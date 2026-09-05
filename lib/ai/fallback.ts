import { CLINIC, hoursAsText } from "@/lib/clinic";
import { prisma } from "@/lib/prisma";
import { makeReference } from "@/lib/reference";

import { matchTreatment } from "./knowledge";
import type { ChatTurn, ClinicContext, CollectedDetails, ReceptionistResult } from "./types";

/**
 * Deterministic receptionist. Runs when no ANTHROPIC_API_KEY is configured, and
 * as the automatic fallback whenever the Claude call fails.
 *
 * It cannot reason, so it does the next best thing: score the message against a
 * set of intents, track what the previous turn asked for, and answer the winning
 * intent specifically. That covers greetings, vague openers ("I have a problem"),
 * symptoms, prices, logistics and the whole booking flow — which is most real
 * front-desk traffic. Anything it genuinely cannot place falls through to a
 * knowledge-base search before the generic reply.
 */

const PHONE_RE = /(\+?\d[\d\s().-]{6,}\d)/;
const EMAIL_RE = /([\w.+-]+@[\w-]+\.[\w.-]+)/;

function normalize(s: string): string {
  return ` ${s.toLowerCase().replace(/[^a-z0-9'\s]/g, " ").replace(/\s+/g, " ").trim()} `;
}

/** Whole-word/phrase containment against a normalised string. */
function has(norm: string, ...terms: string[]): boolean {
  return terms.some((t) => norm.includes(` ${t} `) || norm.includes(` ${t}`));
}

function count(norm: string, terms: string[]): number {
  return terms.reduce((n, t) => (norm.includes(t) ? n + 1 : n), 0);
}

/* ------------------------------------------------------------------ *
 * What did the previous turn ask for?
 * ------------------------------------------------------------------ */

type Awaiting = "name" | "phone" | "treatment" | "symptom" | null;

function awaiting(lastAssistant: string): Awaiting {
  const l = lastAssistant.toLowerCase();
  if (!l) return null;
  if (l.includes("what name") || l.includes("name should i")) return "name";
  if (l.includes("phone number") || l.includes("best number")) return "phone";
  if (l.includes("what would you like to come in for")) return "treatment";
  if (l.includes("tell me a bit more") || l.includes("is it pain, something broken")) return "symptom";
  return null;
}

/* ------------------------------------------------------------------ *
 * Detail extraction
 * ------------------------------------------------------------------ */

/**
 * Words that disqualify a phrase from being a person's name. Question words
 * matter as much as the obvious ones: "how much is whitening" has no question
 * mark, is all letters, and would otherwise sail through as a name.
 */
const NON_NAME =
  /\b(yes|no|yeah|yep|nope|ok|okay|hi|hello|hey|thanks|thank you|please|sure|maybe|help|book|booking|appointment|price|prices|cost|costs|pain|hurts?|how|what|when|where|why|who|which|whose|can|could|would|should|do|does|did|is|are|am|was|were|much|many|any|your|you|the|and|for|with|about|need|want|have|has|tell|show|give)\b/i;

function looksLikeName(s: string): boolean {
  const t = s.trim();
  if (!/^[A-Za-z][A-Za-z'\-. ]{1,48}$/.test(t)) return false;
  // Real names given to a receptionist are one to three words.
  const words = t.split(/\s+/);
  if (words.length > 3) return false;
  if (NON_NAME.test(t)) return false;
  return true;
}

function extract(
  text: string,
  norm: string,
  ctx: ClinicContext,
  collected: CollectedDetails,
  want: Awaiting,
): CollectedDetails {
  const out: CollectedDetails = { ...collected };

  if (!out.contactPhone) {
    const m = text.match(PHONE_RE);
    if (m && m[1].replace(/\D/g, "").length >= 7) out.contactPhone = m[1].trim();
  }
  if (!out.contactEmail) {
    const m = text.match(EMAIL_RE);
    if (m) out.contactEmail = m[1].trim();
  }

  // Latest message wins: asking a price question about one treatment then
  // booking another must not keep the first.
  const t = matchTreatment(text, ctx);
  if (t) out.treatment = t;

  if (!out.patientName) {
    const named = text.match(
      /\b(?:my name is|i am|i'm|this is|it's|name's)\s+([A-Za-z][A-Za-z'\-. ]{1,48})/i,
    );
    if (named) {
      out.patientName = named[1].trim().replace(/[.,!?]$/, "");
    } else if (want === "name" && looksLikeName(text)) {
      out.patientName = text.trim();
    }
  }

  if (!out.preferredDate) {
    const when = norm.match(
      / (today|tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday|next week|this week|asap|as soon as possible)/,
    );
    if (when) out.preferredDate = when[1];
  }
  if (!out.preferredTime) {
    if (has(norm, "morning", "mornings")) out.preferredTime = "mornings";
    else if (has(norm, "afternoon", "afternoons")) out.preferredTime = "afternoons";
    else if (has(norm, "evening", "evenings", "after work")) out.preferredTime = "evenings";
  }

  return out;
}

/* ------------------------------------------------------------------ *
 * Intent scoring
 * ------------------------------------------------------------------ */

type Intent =
  | "greeting"
  | "thanks"
  | "affirm"
  | "deny"
  | "symptom"
  | "vague_problem"
  | "booking"
  | "price"
  | "hours"
  | "location"
  | "contact"
  | "team"
  | "services"
  | "payment"
  | "children"
  | "anxiety"
  | "unknown";

const SIGNALS: Record<Exclude<Intent, "unknown">, string[]> = {
  greeting: ["hello", "hi ", "hey", "good morning", "good afternoon", "good evening", "howdy", "hiya"],
  thanks: ["thank", "thanks", "cheers", "appreciate", "brilliant", "perfect"],
  affirm: ["yes", "yeah", "yep", "sure", "please do", "go ahead", "sounds good", "ok"],
  deny: ["no thanks", "not now", "nope", "maybe later", "nothing else"],
  symptom: [
    "hurt", "hurts", "hurting", "pain", "painful", "ache", "aching", "toothache",
    "sore", "sensitive", "sensitivity", "throb", "bleeding", "bleeds", "swollen",
    "swelling", "broken", "broke", "chipped", "cracked", "crack", "loose", "wobbly",
    "fell out", "knocked out", "abscess", "infected", "infection", "cavity", "hole",
    "bad breath", "gum", "gums", "wisdom", "stuck", "lost a filling", "lost filling",
  ],
  vague_problem: ["problem", "issue", "trouble", "something wrong", "need help", "worried", "concern"],
  booking: [
    "book", "booking", "appointment", "schedule", "slot", "come in", "see someone",
    "see a dentist", "availability", "available", "fit me in", "get in",
  ],
  price: ["price", "prices", "cost", "costs", "how much", "fee", "fees", "charge", "quote", "expensive", "afford", "cheap"],
  hours: ["hour", "hours", "open", "opening", "close", "closing", "timing", "what time", "weekend", "saturday", "sunday"],
  location: ["where", "address", "located", "location", "direction", "directions", "parking", "park", "find you", "get to you"],
  contact: ["phone number", "call you", "email", "contact", "reach you", "your number"],
  // "dentist" alone is far too generic - it appears in "I'm nervous about
  // dentists" and "I need a dentist" too. This intent needs a real ask about
  // *who*, so the bare nouns are excluded deliberately.
  team: ["who is", "who are", "which dentist", "your dentist", "your doctor", "specialist", "team", "staff", "hygienist", "surgeon"],
  services: ["what do you do", "what do you offer", "services", "treatments", "what treatments", "offer"],
  payment: ["insurance", "insured", "payment", "instal", "finance", "cover", "covered", "claim", "payment plan"],
  children: ["child", "children", "kid", "kids", "my son", "my daughter", "toddler", "family", "my boy", "my girl", "year old", "years old", "yr old"],
  anxiety: ["nervous", "scared", "anxious", "afraid", "phobia", "terrified", "sedation", "hate the dentist", "dont like the dentist"],
};

/**
 * When two intents tie, the more specific one wins. A message mentioning both
 * a feeling and a noun ("nervous about dentists") is about the feeling.
 */
const PRIORITY: Intent[] = [
  "symptom", "anxiety", "children", "payment", "price", "booking", "hours",
  "location", "contact", "services", "team", "vague_problem", "greeting",
  "thanks", "affirm", "deny", "unknown",
];

/** Longer, more specific signals outrank short generic ones. */
function scoreIntents(norm: string): { intent: Intent; score: number } {
  let best: Intent = "unknown";
  let bestScore = 0;

  for (const [intent, terms] of Object.entries(SIGNALS) as [Exclude<Intent, "unknown">, string[]][]) {
    // Longest match only, per term family, so "dentist"/"dentists" cannot
    // double-count and inflate an intent past a more specific one.
    let score = 0;
    const matched: string[] = [];
    for (const term of terms) {
      if (!norm.includes(term)) continue;
      if (matched.some((m) => m.includes(term) || term.includes(m))) continue;
      matched.push(term);
      score += term.includes(" ") ? 3 : term.length > 5 ? 2 : 1;
    }
    const better =
      score > bestScore ||
      (score === bestScore && score > 0 && PRIORITY.indexOf(intent) < PRIORITY.indexOf(best));
    if (better) {
      bestScore = score;
      best = intent;
    }
  }
  return { intent: best, score: bestScore };
}

/* ------------------------------------------------------------------ *
 * Knowledge-base search
 * ------------------------------------------------------------------ */

const STOP = new Set([
  "the", "a", "an", "and", "or", "but", "is", "are", "was", "do", "does", "did",
  "you", "your", "yours", "i", "me", "my", "we", "us", "it", "to", "of", "in",
  "on", "for", "with", "can", "could", "would", "should", "have", "has", "get",
  "what", "how", "when", "where", "why", "any", "there", "this", "that", "about",
]);

function knowledgeAnswer(norm: string, ctx: ClinicContext): string | null {
  const words = norm.split(" ").filter((w) => w.length > 2 && !STOP.has(w));
  if (!words.length) return null;

  let best: { score: number; content: string } | null = null;
  for (const k of ctx.knowledge) {
    const title = k.title.toLowerCase();
    const body = k.content.toLowerCase();
    let score = 0;
    for (const w of words) {
      if (title.includes(w)) score += 3;
      else if (body.includes(w)) score += 1;
    }
    if (score > 0 && (!best || score > best.score)) best = { score, content: k.content };
  }
  // Require more than one incidental word match.
  return best && best.score >= 3 ? best.content : null;
}

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */

function treatmentList(ctx: ClinicContext, limit = 5): string {
  const names = ctx.treatments.filter((t) => t.category !== "emergency").slice(0, limit).map((t) => t.name);
  if (!names.length) return "a check-up, hygiene, whitening or an implant consultation";
  return `${names.slice(0, -1).join(", ")} or ${names[names.length - 1]}`;
}

function priceAnswer(text: string, ctx: ClinicContext): string | null {
  const named = matchTreatment(text, ctx);
  if (named) {
    const t = ctx.treatments.find((x) => x.name === named);
    if (t?.priceFrom) {
      return `${t.name} is ${t.priceFrom}${t.duration ? `, and a visit usually runs ${t.duration}` : ""}. Every quote is fixed and itemised after your consultation. Would you like me to book you in?`;
    }
  }
  const priced = ctx.treatments.filter((t) => t.priceFrom).slice(0, 5);
  if (!priced.length) return null;
  return (
    "Here is where our pricing starts: " +
    priced.map((t) => `${t.name} ${t.priceFrom}`).join("; ") +
    ". Which one were you asking about?"
  );
}

/**
 * What the symptom sounds like it needs, without diagnosing it.
 *
 * Always resolves to a bookable treatment. An undiagnosed ache genuinely IS an
 * exam - leaving the treatment unset stalls the booking flow, which is exactly
 * the moment a worried patient gives up and closes the tab.
 */
function symptomReply(
  norm: string,
  ctx: ClinicContext,
  known: string | null | undefined,
): { reply: string; treatment: string | null } {
  const urgentish = has(
    norm, "bleeding", "swollen", "swelling", "knocked out", "fell out", "abscess", "broken", "broke",
  );

  const emergency = ctx.treatments.find((t) => t.category === "emergency")?.name ?? null;
  const exam = ctx.treatments.find((t) => /exam|check/i.test(t.name))?.name ?? null;

  if (urgentish) {
    return {
      treatment: known ?? emergency ?? exam,
      reply:
        `That does need looking at quickly. Please call us on ${CLINIC.phone} — we hold same-day relief slots every working day. ` +
        `I can also take your details here and have the front desk ring you straight back. What name should I put it under?`,
    };
  }

  if (known) {
    const t = ctx.treatments.find((x) => x.name === known);
    return {
      treatment: known,
      reply:
        `Sorry to hear that. That is usually seen under ${known}${t?.priceFrom ? ` (${t.priceFrom})` : ""}, ` +
        `though the dentist confirms after an exam. Shall I book you in? If so, what name should I put it under?`,
    };
  }

  return {
    treatment: exam,
    reply:
      `Sorry to hear that — that is worth getting looked at. The right starting point is ${exam ?? "a check-up"}` +
      `${exam ? ` (${ctx.treatments.find((t) => t.name === exam)?.priceFrom ?? ""})` : ""}, where the dentist finds the cause. ` +
      `Shall I book that in? If so, what name should I put it under? If the pain is severe right now, call ${CLINIC.phone} instead and we will see you today.`,
  };
}

/* ------------------------------------------------------------------ *
 * Main
 * ------------------------------------------------------------------ */

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
  const norm = normalize(text);
  const lastAssistant = [...args.history].reverse().find((t) => t.role === "assistant")?.content ?? "";
  const want = awaiting(lastAssistant);

  const collected = extract(text, norm, args.ctx, args.collected, want);
  const { intent, score } = scoreIntents(norm);

  // A bare name arriving mid-booking is a name, even when the previous question
  // was about something else. Without this the flow stalls on "Priya Raman".
  //
  // Gated on the message carrying no clear intent of its own: a question like
  // "how much is whitening" must be answered, never mistaken for a name just
  // because a treatment is already on file.
  const speculativeName = intent === "unknown" || intent === "affirm" || want === "name";
  if (!collected.patientName && speculativeName && looksLikeName(text) && (collected.treatment || want)) {
    collected.patientName = text.trim();
  }

  let booking: ReceptionistResult["booking"] = null;
  let reply: string;

  const ready = Boolean(collected.patientName && collected.contactPhone && collected.treatment);
  const inBookingFlow =
    want === "name" ||
    want === "phone" ||
    want === "treatment" ||
    intent === "booking" ||
    (Boolean(collected.treatment) && Boolean(collected.patientName || collected.contactPhone));

  // ---- booking takes priority once it is genuinely under way ----------------
  if (ready) {
    const reference = makeReference();
    await prisma.appointment.create({
      data: {
        reference,
        name: collected.patientName!,
        phone: collected.contactPhone!,
        email: collected.contactEmail ?? null,
        treatment: collected.treatment!,
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
      treatment: collected.treatment!,
      preferredDate: collected.preferredDate ?? null,
      preferredTime: collected.preferredTime ?? null,
    };
    reply =
      `Done — your reference is ${reference}. The front desk will call ${collected.contactPhone} to confirm the exact time. ` +
      `Anything else I can help with?`;
  } else if (inBookingFlow) {
    if (!collected.treatment) {
      reply = `Happy to get that booked. What would you like to come in for — ${treatmentList(args.ctx)}?`;
    } else if (!collected.patientName) {
      reply = `Good choice — ${collected.treatment}. What name should I put it under?`;
    } else {
      reply = `Thanks ${collected.patientName}. What is the best phone number for us to confirm your time on?`;
    }
  }
  // ---- everything else -------------------------------------------------------
  else {
    switch (intent) {
      case "greeting":
        reply = `Hello! I can help with treatments, prices and opening hours, or book you an appointment. What is on your mind?`;
        break;

      case "thanks":
        reply = `You are very welcome. Anything else before you go?`;
        break;

      case "affirm":
        reply = collected.treatment
          ? `Great — what name should I put the ${collected.treatment} appointment under?`
          : `Great. What would you like to come in for — ${treatmentList(args.ctx)}?`;
        break;

      case "deny":
        reply = `No problem at all. We are here on ${CLINIC.phone} whenever you need us.`;
        break;

      case "symptom": {
        const s = symptomReply(norm, args.ctx, collected.treatment);
        // Pin the treatment so the next turn continues the booking instead of
        // asking "what would you like to come in for" all over again.
        if (s.treatment) collected.treatment = s.treatment;
        reply = s.reply;
        break;
      }

      case "vague_problem":
        reply = `Of course — tell me a bit more and I will point you the right way. Is it something bothering you in your mouth, a question about a treatment or a price, or do you just want to get booked in?`;
        break;

      case "price":
        reply =
          priceAnswer(text, args.ctx) ??
          `Pricing depends on the treatment — call ${CLINIC.phone} and the front desk will quote you exactly.`;
        break;

      case "hours":
        reply = `We are open ${hoursAsText()}. Would you like me to book you in?`;
        break;

      case "location":
        reply = has(norm, "parking", "park")
          ? `We are at ${CLINIC.address}. Street parking is metered, and the Lindenhof underground car park two doors down is validated for two hours with a treatment appointment.`
          : `We are at ${CLINIC.address}, about five minutes from the central transit stop. Call ${CLINIC.phone} if you need directions on the day.`;
        break;

      case "contact":
        reply = `You can reach us on ${CLINIC.phone} or ${CLINIC.email}. I can also take your details here and have someone call you back.`;
        break;

      case "team": {
        const list = args.ctx.dentists.slice(0, 4).map((d) => `${d.name} (${d.title})`);
        reply = list.length
          ? `Our team includes ${list.join(", ")}. Would you like to book with one of them?`
          : `Our specialists cover general, cosmetic, orthodontic and surgical dentistry. Shall I book you in?`;
        break;
      }

      case "services":
        reply = `We cover ${treatmentList(args.ctx, 6)} and more. Which one would you like to know about?`;
        break;

      case "payment":
        reply =
          knowledgeAnswer(norm, args.ctx) ??
          `We take all major cards and bank transfer, and treatment over $500 can be split across 3 to 24 months. We are not tied to an insurer but provide itemised invoices most plans reimburse.`;
        break;

      case "children":
        reply =
          knowledgeAnswer(norm, args.ctx) ??
          `We see children from age three, and under-16 check-ups are half price when a parent is also a patient. Would you like to book one in?`;
        break;

      case "anxiety":
        reply =
          knowledgeAnswer(norm, args.ctx) ??
          `That is very common and completely fine. Tell us when you book and we will give you a longer, quieter appointment — nitrous oxide and oral sedation are available for any treatment. Shall I book you in?`;
        break;

      default: {
        const known = knowledgeAnswer(norm, args.ctx);
        reply =
          known ??
          (score > 0
            ? `I want to make sure I answer that properly — are you asking about a treatment, a price, our opening hours, or booking an appointment?`
            : `I can help with treatments, prices, opening hours and booking an appointment. What would you like to know? For anything clinical, call us on ${CLINIC.phone}.`);
      }
    }
  }

  // Never say exactly the same thing twice in a row — that is what makes a bot
  // feel broken even when the answer was reasonable.
  if (reply === lastAssistant) {
    reply = `Sorry, let me try that differently. I can look up a treatment or a price, tell you our opening hours, or take your details and book you in — which of those would help?`;
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
