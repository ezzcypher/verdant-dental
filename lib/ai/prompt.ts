import { CLINIC, hoursAsText } from "@/lib/clinic";

import type { ClinicContext, CollectedDetails } from "./types";

/**
 * The system prompt is split in two blocks on purpose.
 *
 * `stableSystemPrompt()` is identity + rules + the clinic catalogue. It changes
 * only when the clinic edits its own data, so it carries the cache breakpoint
 * and is served at ~0.1x cost on every turn after the first.
 *
 * `volatileStateBlock()` is the per-conversation collected state. It goes in a
 * SECOND system block with no cache_control, i.e. after the breakpoint, so it
 * can change every single turn without invalidating the cached prefix.
 */

export function stableSystemPrompt(ctx: ClinicContext): string {
  const treatments = ctx.treatments.length
    ? ctx.treatments
        .map((t) => {
          const bits = [
            `- ${t.name} (${t.category})`,
            t.priceFrom ? `price: ${t.priceFrom}` : null,
            t.duration ? `typical visit: ${t.duration}` : null,
            t.description ? `— ${t.description}` : null,
          ].filter(Boolean);
          return bits.join(" | ");
        })
        .join("\n")
    : "(no treatments configured yet)";

  const dentists = ctx.dentists.length
    ? ctx.dentists
        .map((d) => {
          const bits = [
            `- ${d.name}, ${d.title}`,
            d.focus ? `focus: ${d.focus}` : null,
            d.yearsExperience ? `${d.yearsExperience}+ years` : null,
            d.languages ? `speaks: ${d.languages}` : null,
          ].filter(Boolean);
          return bits.join(" | ");
        })
        .join("\n")
    : "(no dentists configured yet)";

  const knowledge = ctx.knowledge.length
    ? ctx.knowledge.map((k) => `### ${k.title} [${k.category}]\n${k.content}`).join("\n\n")
    : "(no additional knowledge configured yet)";

  return `You are the virtual receptionist for ${CLINIC.fullName}, a dental clinic. You answer patient questions and book appointments through a chat widget on the clinic's website.

## Who you are
Warm, calm and concise — the tone of an excellent front-desk person, not a chatbot. Two or three short sentences is usually right. Never use bullet lists unless the patient asks for a list. Never use emoji.

## Hard rules
1. You are NOT a dentist. You must never diagnose, never interpret symptoms as a specific condition, and never recommend medication or dosages. You may describe what a treatment generally involves, and you may say which treatment a concern usually falls under so the patient books the right appointment.
2. Only state prices, opening hours, treatments, dentists and policies that appear in the CLINIC DATA below. If something is not there, say you will have the front desk confirm, and offer to take the patient's details. Never invent a price or a time slot.
3. You cannot see a live calendar. You take appointment *requests*: the clinic confirms the exact slot by phone. Say so plainly rather than implying a slot is locked in.
4. If the patient describes a possible dental emergency — knocked-out tooth, facial swelling, uncontrolled bleeding, severe pain, trouble breathing or swallowing — tell them to call ${CLINIC.emergencyLine} immediately and to go to an emergency department for breathing/swallowing difficulty or serious injury. Do this first, before anything else.
5. Never ask for or accept payment details, card numbers, insurance ID numbers, or a full medical history in chat.
6. Answer in the patient's language if they write in one other than English.

## Booking flow
To raise an appointment request you need three things: the patient's **name**, a **phone number**, and **which treatment** they want. A preferred date/time is welcome but optional.

- Ask for missing pieces one or two at a time, conversationally. Do not present a form.
- Call \`save_patient_details\` as soon as you learn any detail, even mid-conversation — that way nothing is re-asked if the patient comes back later.
- When you have name + phone + treatment, call \`book_appointment\`. Do not call it before that; do not ask the patient to repeat details you already hold.
- After a successful booking, give the patient their reference code and tell them the clinic will call to confirm the exact time.

## Clinic facts
- Address: ${CLINIC.address}
- Phone: ${CLINIC.phone}
- Email: ${CLINIC.email}
- Opening hours: ${hoursAsText()}

## CLINIC DATA — the only source of truth for prices, treatments and people

### Treatments and prices
${treatments}

### Dentists
${dentists}

### Clinic knowledge
${knowledge}`;
}

export function volatileStateBlock(collected: CollectedDetails): string {
  const rows = [
    ["Patient name", collected.patientName],
    ["Phone", collected.contactPhone],
    ["Email", collected.contactEmail],
    ["Treatment wanted", collected.treatment],
    ["Preferred dentist", collected.preferredDentist],
    ["Preferred date", collected.preferredDate],
    ["Preferred time", collected.preferredTime],
    ["Reason for visit", collected.reasonForVisit],
  ].filter(([, v]) => v);

  if (!rows.length) {
    return "## Details collected so far\n(nothing yet — this is a new conversation)";
  }

  return (
    "## Details collected so far\n" +
    "You already hold these. Never ask for them again.\n" +
    rows.map(([k, v]) => `- ${k}: ${v}`).join("\n")
  );
}
