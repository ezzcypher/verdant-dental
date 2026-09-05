import { CLINIC, hoursAsText } from "@/lib/clinic";
import { prisma } from "@/lib/prisma";
import { makeReference } from "@/lib/reference";

import { matchTreatment } from "./knowledge";
import type { ChatTurn, ClinicContext, CollectedDetails, ReceptionistResult } from "./types";

/**
 * Deterministic receptionist. Runs when no API key is configured, and as the
 * automatic fallback whenever the Claude call fails — so the widget always
 * answers, and a patient can always complete a booking, even mid-outage.
 *
 * It is a keyword matcher plus a booking state machine driven by the details
 * already collected on the session. No cleverness, no external calls.
 */

const PHONE_RE = /(\+?\d[\d\s().-]{6,}\d)/;
const EMAIL_RE = /([\w.+-]+@[\w-]+\.[\w.-]+)/;

function extract(text: string, ctx: ClinicContext, collected: CollectedDetails): CollectedDetails {
  const out: CollectedDetails = { ...collected };

  if (!out.contactPhone) {
    const m = text.match(PHONE_RE);
    if (m) {
      const digits = m[1].replace(/\D/g, "");
      if (digits.length >= 7) out.contactPhone = m[1].trim();
    }
  }
  if (!out.contactEmail) {
    const m = text.match(EMAIL_RE);
    if (m) out.contactEmail = m[1].trim();
  }
  // Always re-match: the patient's latest message wins, so asking a price
  // question about one treatment and then booking another does the right thing.
  const t = matchTreatment(text, ctx);
  if (t) out.treatment = t;
  if (!out.patientName) {
    const named = text.match(/\b(?:my name is|i am|i'm|this is|it's)\s+([A-Za-z][A-Za-z'\-. ]{1,48})/i);
    if (named) {
      out.patientName = named[1].trim().replace(/[.,!]$/, "");
    } else if (
      // A short bare reply while we are explicitly waiting for the name.
      !out.patientName &&
      collected.treatment &&
      /^[A-Za-z][A-Za-z'\-. ]{1,40}$/.test(text.trim()) &&
      text.trim().split(/\s+/).length <= 4 &&
      !PHONE_RE.test(text)
    ) {
      out.patientName = text.trim();
    }
  }
  return out;
}

function wants(text: string, ...words: string[]): boolean {
  const l = text.toLowerCase();
  return words.some((w) => l.includes(w));
}

function treatmentList(ctx: ClinicContext, limit = 6): string {
  const names = ctx.treatments.slice(0, limit).map((t) => t.name);
  if (!names.length) return "a check-up, hygiene, whitening or an implant consultation";
  if (names.length === 1) return names[0];
  return `${names.slice(0, -1).join(", ")} or ${names[names.length - 1]}`;
}

function priceAnswer(text: string, ctx: ClinicContext): string | null {
  const named = matchTreatment(text, ctx);
  if (named) {
    const t = ctx.treatments.find((x) => x.name === named);
    if (t?.priceFrom) {
      return `${t.name} is ${t.priceFrom}${t.duration ? `, and a visit usually runs ${t.duration}` : ""}. Every quote is fixed and itemised after your consultation and 3D scan.`;
    }
  }
  const priced = ctx.treatments.filter((t) => t.priceFrom).slice(0, 5);
  if (!priced.length) return null;
  return (
    "Here is where our pricing starts: " +
    priced.map((t) => `${t.name} ${t.priceFrom}`).join("; ") +
    ". Quotes are fixed and itemised before any treatment begins."
  );
}

function knowledgeAnswer(text: string, ctx: ClinicContext): string | null {
  const l = text.toLowerCase();
  let best: { score: number; content: string } | null = null;

  for (const k of ctx.knowledge) {
    const hay = `${k.title} ${k.category}`.toLowerCase();
    const words = hay.split(/[^a-z0-9]+/).filter((w) => w.length > 3);
    const score = words.reduce((n, w) => (l.includes(w) ? n + 1 : n), 0);
    if (score > 0 && (!best || score > best.score)) best = { score, content: k.content };
  }
  return best?.content ?? null;
}

export interface RunFallbackArgs {
  history: ChatTurn[];
  userMessage: string;
  ctx: ClinicContext;
  collected: CollectedDetails;
  sessionId: string;
  sourceIpHash: string | null;
}

export async function runFallback(args: RunFallbackArgs): Promise<ReceptionistResult> {
  const text = args.userMessage.trim();
  const collected = extract(text, args.ctx, args.collected);
  let booking: ReceptionistResult["booking"] = null;

  const bookingIntent =
    wants(text, "book", "appointment", "schedule", "see a dentist", "come in", "slot", "visit") ||
    Boolean(collected.treatment && (collected.patientName || collected.contactPhone));

  let reply: string;

  if (bookingIntent) {
    if (!collected.treatment) {
      reply = `Happy to get that booked. What would you like to come in for — ${treatmentList(args.ctx)}?`;
    } else if (!collected.patientName) {
      reply = `Good choice — ${collected.treatment}. What name should I put it under?`;
    } else if (!collected.contactPhone) {
      reply = `Thanks ${collected.patientName}. What is the best phone number for the clinic to confirm your time on?`;
    } else {
      const reference = makeReference();
      await prisma.appointment.create({
        data: {
          reference,
          name: collected.patientName,
          phone: collected.contactPhone,
          email: collected.contactEmail ?? null,
          treatment: collected.treatment,
          preferredDate: collected.preferredDate ?? null,
          preferredTime: collected.preferredTime ?? null,
          reasonForVisit: collected.reasonForVisit ?? null,
          conversationSummary: `Requested ${collected.treatment} via the website chat.`,
          source: "chatbot",
          status: "pending",
          sourceIpHash: args.sourceIpHash,
          chatSessionId: args.sessionId,
        },
      });
      booking = {
        reference,
        treatment: collected.treatment,
        preferredDate: collected.preferredDate ?? null,
        preferredTime: collected.preferredTime ?? null,
      };
      reply =
        `That is booked in as a request — your reference is ${reference}. ` +
        `The front desk will call ${collected.contactPhone} to confirm the exact time. ` +
        `Anything else I can help with?`;
    }
  } else if (wants(text, "price", "cost", "how much", "fee", "charge", "quote")) {
    reply =
      priceAnswer(text, args.ctx) ??
      `Pricing depends on the treatment — call us on ${CLINIC.phone} and the front desk will quote you exactly.`;
  } else if (wants(text, "hour", "open", "close", "when are you", "timing")) {
    reply = `We are open ${hoursAsText()}. Would you like me to book you in?`;
  } else if (wants(text, "where", "address", "location", "find you", "parking", "directions")) {
    reply = `We are at ${CLINIC.address}. Call ${CLINIC.phone} if you need directions on the day.`;
  } else if (wants(text, "phone", "call", "contact", "email", "reach")) {
    reply = `You can reach the clinic on ${CLINIC.phone} or ${CLINIC.email}. I can also take your details here.`;
  } else if (wants(text, "dentist", "doctor", "who will", "specialist", "team")) {
    const list = args.ctx.dentists.slice(0, 4).map((d) => `${d.name} (${d.title})`);
    reply = list.length
      ? `Our team includes ${list.join(", ")}. Would you like to book with one of them?`
      : `Our specialists cover general, cosmetic, orthodontic and surgical dentistry. Shall I book you in?`;
  } else {
    const known = knowledgeAnswer(text, args.ctx);
    reply =
      known ??
      `I can help with treatments, prices, opening hours and booking an appointment. ` +
        `What would you like to know? For anything clinical, call us on ${CLINIC.phone}.`;
  }

  return {
    reply,
    collected,
    booking,
    leadStatus: booking
      ? "converted"
      : collected.contactPhone || collected.contactEmail
        ? "booking"
        : collected.treatment || collected.patientName
          ? "interested"
          : "browsing",
    urgent: false,
    engine: "rules",
  };
}
