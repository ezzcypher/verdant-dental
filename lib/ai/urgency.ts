/**
 * Deterministic dental-urgency safety net.
 *
 * This runs on every inbound message regardless of which engine answers, so a
 * genuine emergency can never be missed because a model phrased things oddly or
 * the API was down. It is intentionally keyword-based and errs toward flagging:
 * a false positive costs one extra "call us now" line, a false negative could
 * cost a tooth.
 */

const URGENT_PATTERNS: RegExp[] = [
  /\bknocked[- ]?out\b/i,
  /\btooth (fell|came) out\b/i,
  /\bavuls/i,
  /\bbroken (tooth|jaw)\b/i,
  /\bcracked tooth\b/i,
  /\bfractured (tooth|jaw)\b/i,
  /\bsevere pain\b/i,
  /\bunbearable\b/i,
  /\bexcruciating\b/i,
  /\bcan'?t sleep\b.*\b(pain|tooth)\b/i,
  /\bswollen (face|cheek|jaw|gum)\b/i,
  /\bfacial swelling\b/i,
  /\babscess\b/i,
  /\bpus\b/i,
  /\bbleeding (won'?t|will not|doesn'?t) stop\b/i,
  /\bheavy bleeding\b/i,
  /\btrouble (breathing|swallowing)\b/i,
  /\bdifficulty (breathing|swallowing)\b/i,
  /\bfever\b.*\b(tooth|dental|gum|jaw)\b/i,
  /\bdental emergency\b/i,
  /\bemergency\b.*\b(tooth|dental|jaw|gum)\b/i,
];

export function isUrgent(text: string): boolean {
  return URGENT_PATTERNS.some((re) => re.test(text));
}

/** Prepended to the reply whenever isUrgent() fires. */
export function urgentNotice(phone: string): string {
  return (
    `This sounds like it needs same-day attention. Please call us now on ${phone} — ` +
    `we hold emergency slots open every working day. ` +
    `If there is heavy bleeding that will not stop, facial swelling affecting your breathing ` +
    `or swallowing, or a serious injury, go to your nearest emergency department instead.`
  );
}
