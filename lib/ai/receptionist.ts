import { aiEnv } from "@/lib/env";
import { CLINIC } from "@/lib/clinic";

import { runClaude } from "./claude";
import { runFallback } from "./fallback";
import { loadClinicContext } from "./knowledge";
import { isUrgent, urgentNotice } from "./urgency";
import type { ChatTurn, CollectedDetails, ReceptionistResult } from "./types";

/**
 * Strip anything key-shaped before a message reaches the logs. Provider errors
 * are not supposed to echo credentials, but logs outlive assumptions and a
 * serverless log line is not a place to find out otherwise.
 */
function redact(s: string): string {
  return s
    .replace(/sk-ant-[A-Za-z0-9_-]+/g, "sk-ant-[REDACTED]")
    .replace(/postgres(?:ql)?:\/\/[^\s"']+/gi, "postgresql://[REDACTED]")
    .replace(/\b[A-Fa-f0-9]{48,}\b/g, "[REDACTED]");
}

function describeError(err: unknown): string {
  if (err instanceof Error) return redact(`${err.name}: ${err.message}`);
  return redact(String(err));
}

export interface AnswerArgs {
  history: ChatTurn[];
  userMessage: string;
  collected: CollectedDetails;
  sessionId: string;
  sourceIpHash: string | null;
}

/**
 * One turn of the receptionist.
 *
 * Order matters: the deterministic urgency check runs first and its notice is
 * prepended to whatever the engine says, so a dental emergency is surfaced even
 * if the model phrases things oddly — or if the model never ran at all.
 *
 * Claude answers when a key is configured; any failure (network, rate limit,
 * refusal, bad key) silently degrades to the rules engine. The patient never
 * sees an error, and the booking path keeps working through an outage.
 */
export async function answer(args: AnswerArgs): Promise<ReceptionistResult> {
  const ctx = await loadClinicContext();
  const urgent = isUrgent(args.userMessage);

  let result: ReceptionistResult;

  if (aiEnv().apiKey) {
    try {
      result = await runClaude({ ...args, ctx });
    } catch (err) {
      // Covers every failure mode the brief calls out: missing/invalid key,
      // 429 rate limit, 5xx, network error, request timeout, and a refusal.
      console.error("[chat] claude failed, falling back to rules:", describeError(err));
      result = await runFallback({ ...args, ctx });
    }
  } else {
    result = await runFallback({ ...args, ctx });
  }

  if (urgent) {
    result = {
      ...result,
      urgent: true,
      reply: `${urgentNotice(CLINIC.emergencyLine)}\n\n${result.reply}`,
    };
  }

  return result;
}

/** Opening line shown before the patient types anything. */
export function greeting(): string {
  return (
    `Hello — I'm the virtual receptionist at ${CLINIC.name}. ` +
    `I can answer questions about treatments, prices and opening hours, or book you an appointment. ` +
    `What can I help with?`
  );
}
