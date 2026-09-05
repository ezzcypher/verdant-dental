import type Anthropic from "@anthropic-ai/sdk";

import { prisma } from "@/lib/prisma";
import { makeReference } from "@/lib/reference";

import type { BookingResult, CollectedDetails } from "./types";

/**
 * The receptionist's two tools. Deliberately few: everything the model needs to
 * *read* (prices, dentists, hours) is already in the cached system prompt, so
 * tools exist only for the two things that write to the database.
 *
 * Not `strict` on purpose. Strict mode requires every property to be listed in
 * `required`, which would force the model to emit all eight fields on every
 * call — including ones it has not actually learned, inviting invention. The
 * executor below validates every field defensively instead, so loose schemas
 * cost nothing and let the model send only what it genuinely heard.
 */

export const TOOL_DEFS: Anthropic.Tool[] = [
  {
    name: "save_patient_details",
    description:
      "Record any patient detail as soon as it is mentioned, so it is never re-asked. " +
      "Call this the moment you learn a name, phone number, email, wanted treatment, " +
      "preferred dentist, preferred date/time, or reason for visiting. Pass only the " +
      "fields you actually learned; omit the rest.",
    input_schema: {
      type: "object",
      properties: {
        patientName: { type: "string", description: "The patient's full name." },
        contactPhone: { type: "string", description: "Phone number as given." },
        contactEmail: { type: "string", description: "Email address as given." },
        treatment: {
          type: "string",
          description: "The treatment they want, matching a name from CLINIC DATA where possible.",
        },
        preferredDentist: { type: "string", description: "A dentist they asked for by name." },
        preferredDate: {
          type: "string",
          description: "Preferred date in the patient's own words, e.g. 'next Tuesday'.",
        },
        preferredTime: {
          type: "string",
          description: "Preferred time in the patient's own words, e.g. 'mornings'.",
        },
        reasonForVisit: {
          type: "string",
          description: "One short line on why they are coming in.",
        },
      },
      required: [],
    },
  },
  {
    name: "book_appointment",
    description:
      "Raise an appointment request with the clinic. Only call this once you hold the " +
      "patient's name, a phone number, and which treatment they want. The clinic calls " +
      "back to confirm the exact slot — this does not lock a time.",
    input_schema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Patient's full name." },
        phone: { type: "string", description: "Contact phone number." },
        treatment: { type: "string", description: "Treatment requested." },
        email: { type: "string", description: "Email, if given." },
        preferredDate: { type: "string", description: "Preferred date, patient's words." },
        preferredTime: { type: "string", description: "Preferred time, patient's words." },
        reasonForVisit: { type: "string", description: "Short reason for the visit." },
        conversationSummary: {
          type: "string",
          description:
            "One or two sentences summarising what the patient wants, for the front desk to read before calling back.",
        },
      },
      required: ["name", "phone", "treatment"],
    },
  },
];

export interface ToolContext {
  sessionId: string;
  sourceIpHash: string | null;
  /** Mutated in place as details are collected, then persisted by the caller. */
  collected: CollectedDetails;
  /** Set when book_appointment succeeds. */
  booking: BookingResult | null;
}

function str(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t.length ? t.slice(0, 500) : null;
}

/** Execute one tool call and return the string result to feed back to the model. */
export async function executeTool(
  name: string,
  rawInput: unknown,
  ctx: ToolContext,
): Promise<string> {
  const input = (rawInput ?? {}) as Record<string, unknown>;

  if (name === "save_patient_details") {
    const fields: (keyof CollectedDetails)[] = [
      "patientName",
      "contactPhone",
      "contactEmail",
      "treatment",
      "preferredDentist",
      "preferredDate",
      "preferredTime",
      "reasonForVisit",
    ];
    const saved: string[] = [];
    for (const f of fields) {
      const v = str(input[f]);
      if (v) {
        ctx.collected[f] = v;
        saved.push(f);
      }
    }
    if (!saved.length) return "Nothing new to save.";
    return `Saved: ${saved.join(", ")}.`;
  }

  if (name === "book_appointment") {
    const name_ = str(input.name);
    const phone = str(input.phone);
    const treatment = str(input.treatment);

    if (!name_ || !phone || !treatment) {
      return (
        "Cannot book yet — still missing: " +
        [!name_ && "name", !phone && "phone", !treatment && "treatment"]
          .filter(Boolean)
          .join(", ") +
        ". Ask the patient for it, then call this tool again."
      );
    }
    if (ctx.booking) {
      return `Already booked this conversation. Reference ${ctx.booking.reference}. Do not book again — just give the patient that reference.`;
    }

    const email = str(input.email);
    const preferredDate = str(input.preferredDate);
    const preferredTime = str(input.preferredTime);
    const reasonForVisit = str(input.reasonForVisit);
    const conversationSummary = str(input.conversationSummary);
    const reference = makeReference();

    await prisma.appointment.create({
      data: {
        reference,
        name: name_,
        phone,
        email,
        treatment,
        preferredDate,
        preferredTime,
        reasonForVisit,
        conversationSummary,
        source: "chatbot",
        status: "pending",
        sourceIpHash: ctx.sourceIpHash,
        chatSessionId: ctx.sessionId,
      },
    });

    Object.assign(ctx.collected, {
      patientName: name_,
      contactPhone: phone,
      contactEmail: email ?? ctx.collected.contactEmail,
      treatment,
      preferredDate: preferredDate ?? ctx.collected.preferredDate,
      preferredTime: preferredTime ?? ctx.collected.preferredTime,
      reasonForVisit: reasonForVisit ?? ctx.collected.reasonForVisit,
    });
    ctx.booking = { reference, treatment, preferredDate, preferredTime };

    return `Booked. Reference ${reference}. Tell the patient this code and that the clinic will call ${phone} to confirm the exact time.`;
  }

  return `Unknown tool "${name}".`;
}
