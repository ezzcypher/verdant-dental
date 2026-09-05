/**
 * Deterministic dental-urgency safety net.
 *
 * Runs on every inbound message regardless of which engine answers, so a real
 * emergency can never be missed because a model phrased things oddly or the API
 * was down. It errs toward flagging on purpose: a false positive costs one extra
 * "call us now" line, a false negative can cost a tooth.
 *
 * Matching is deliberately NOT word-order dependent. An earlier version used
 * fixed phrases like /swollen (face|cheek)/ and silently missed "my face is
 * swollen" - the same emergency, written the way people actually write.
 */

/** Any one of these alone is enough. */
const ABSOLUTE: RegExp[] = [
  /knocked[\s-]?out/i,
  /\bavuls/i,
  /\b(tooth|teeth)\b[^.!?]{0,30}\b(fell|came|knocked)\s+out\b/i,
  /\bfell\s+out\b[^.!?]{0,20}\b(tooth|teeth)\b/i,
  /\babscess/i,
  /\bpus\b/i,
  /\bswell(ing|ed)?\b/i, // any swelling in a dental context is a red flag
  /\bswollen\b/i,
  /\b(trouble|difficulty|hard|struggling)\b[^.!?]{0,20}\b(breath|swallow)/i,
  /\bcan'?t\b[^.!?]{0,15}\b(breathe|swallow)/i,
  /\b(broken|fractured|cracked)\b[^.!?]{0,15}\bjaw\b/i,
  /\bdental emergency\b/i,
  /\bemergency\b[^.!?]{0,25}\b(tooth|teeth|dental|jaw|gum|mouth)\b/i,
  /\b(tooth|teeth|dental|jaw|gum|mouth)\b[^.!?]{0,25}\bemergency\b/i,
];

/**
 * Both halves must appear somewhere in the message, in either order. This is
 * what makes "bleeding badly" and "badly bleeding" behave the same.
 */
const PAIRS: [RegExp, RegExp][] = [
  [
    /\bbleed(ing|s)?\b/i,
    /\b(bad|badly|heav(y|ily)|lot|lots|profuse|nonstop|non-stop|constant|continuous|everywhere|won'?t stop|will not stop|doesn'?t stop|cannot stop|can'?t stop)\b/i,
  ],
  [
    // \w*ache so compounds match too: "ache", "toothache", "headache".
    /\b(pain|painful|\w*ache|aching|hurts?|hurting|sore|throbbing)\b/i,
    /\b(severe|unbearable|excruciat\w*|agon\w*|worst|extreme|terrible|awful|intense|10\s*\/\s*10|can'?t sleep|cannot sleep|keeping me (up|awake)|up all night)\b/i,
  ],
  [
    /\b(broken|broke|fractured|cracked|shattered|split)\b/i,
    /\b(tooth|teeth|molar|incisor|crown|jaw)\b/i,
  ],
];

export function isUrgent(text: string): boolean {
  if (ABSOLUTE.some((re) => re.test(text))) return true;
  return PAIRS.some(([a, b]) => a.test(text) && b.test(text));
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
