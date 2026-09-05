import Anthropic from "@anthropic-ai/sdk";

import { aiEnv } from "@/lib/env";

import { stableSystemPrompt, volatileStateBlock } from "./prompt";
import { TOOL_DEFS, executeTool, type ToolContext } from "./tools";
import type { ChatTurn, ClinicContext, CollectedDetails, ReceptionistResult } from "./types";

/** Hard ceiling on tool round-trips per turn — a runaway loop costs real money. */
const MAX_TOOL_ITERATIONS = 4;

/** Chat replies are short; this is generous and keeps us well inside HTTP timeouts. */
const MAX_TOKENS = 2048;

/** How much history to replay. Enough for context, bounded so cost stays flat. */
const HISTORY_TURNS = 16;

/**
 * Per-request ceiling, in milliseconds (the TS SDK takes ms, unlike the Python
 * one). Deliberately well under the route's maxDuration so a slow or hung API
 * call throws here and degrades to the rules engine, rather than running the
 * serverless function out of time and returning a 504 to the patient.
 */
const REQUEST_TIMEOUT_MS = 40_000;

/** The only tool names that may ever execute. Derived from the definitions so
 *  the two can never drift apart. */
const ALLOWED_TOOL_NAMES = new Set(TOOL_DEFS.map((t) => t.name));

let client: Anthropic | null = null;
let clientKey: string | null = null;

function getClient(apiKey: string): Anthropic {
  // Rebuild if the key changed (key rotation between warm invocations).
  if (!client || clientKey !== apiKey) {
    client = new Anthropic({ apiKey, maxRetries: 1, timeout: REQUEST_TIMEOUT_MS });
    clientKey = apiKey;
  }
  return client;
}

export interface RunClaudeArgs {
  history: ChatTurn[];
  userMessage: string;
  ctx: ClinicContext;
  collected: CollectedDetails;
  sessionId: string;
  sourceIpHash: string | null;
}

/**
 * One conversation turn against Claude, with the booking tools wired in.
 *
 * Throws on any API failure so the caller can fall back to the rules engine —
 * a patient should never see an error bubble in the widget.
 */
export async function runClaude(args: RunClaudeArgs): Promise<ReceptionistResult> {
  const { apiKey, model } = aiEnv();
  if (!apiKey) throw new Error("No ANTHROPIC_API_KEY configured");

  const anthropic = getClient(apiKey);

  const toolCtx: ToolContext = {
    sessionId: args.sessionId,
    sourceIpHash: args.sourceIpHash,
    collected: { ...args.collected },
    booking: null,
  };

  const messages: Anthropic.MessageParam[] = [
    ...args.history.slice(-HISTORY_TURNS).map((t) => ({
      role: t.role,
      content: t.content,
    })),
    { role: "user" as const, content: args.userMessage },
  ];

  // Two system blocks: the stable catalogue carries the cache breakpoint, the
  // per-conversation state sits after it so it can change every turn without
  // invalidating the cached prefix.
  const system: Anthropic.TextBlockParam[] = [
    {
      type: "text",
      text: stableSystemPrompt(args.ctx),
      cache_control: { type: "ephemeral" },
    },
    { type: "text", text: volatileStateBlock(toolCtx.collected) },
  ];

  let reply = "";

  for (let i = 0; i < MAX_TOOL_ITERATIONS; i++) {
    const response = await anthropic.messages.create({
      model,
      max_tokens: MAX_TOKENS,
      // Thinking stays on (Opus 5 default) — disabling it risks tool calls being
      // written into visible text. Low effort keeps chat latency acceptable.
      output_config: { effort: "low" },
      system,
      tools: TOOL_DEFS,
      messages,
    });

    if (response.stop_reason === "refusal") {
      throw new Error(`Model refused: ${response.stop_details?.category ?? "unknown"}`);
    }

    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();
    if (text) reply = text;

    const toolUses = response.content.filter(
      (b): b is Anthropic.ToolUseBlock => b.type === "tool_use",
    );
    if (!toolUses.length) break;

    messages.push({ role: "assistant", content: response.content });

    const results: Anthropic.ToolResultBlockParam[] = [];
    for (const call of toolUses) {
      let out: string;
      try {
        // Second gate on top of executeTool's own whitelist: only names this
        // turn actually advertised can run, so a hallucinated or injected tool
        // name can never reach the executor.
        if (!ALLOWED_TOOL_NAMES.has(call.name)) {
          results.push({
            type: "tool_result",
            tool_use_id: call.id,
            content: `No such tool "${call.name}". Only ${[...ALLOWED_TOOL_NAMES].join(" and ")} exist.`,
            is_error: true,
          });
          continue;
        }
        out = await executeTool(call.name, call.input, toolCtx);
      } catch (err) {
        // A failed write must come back as a tool_result, not a thrown turn —
        // otherwise the model never learns the booking did not happen.
        console.error(
          `[chat] tool ${call.name} failed:`,
          err instanceof Error ? err.message : String(err),
        );
        out = "That failed on our side. Apologise briefly and offer the clinic phone number.";
        results.push({ type: "tool_result", tool_use_id: call.id, content: out, is_error: true });
        continue;
      }
      results.push({ type: "tool_result", tool_use_id: call.id, content: out });
    }

    messages.push({ role: "user", content: results });

    // The state block must reflect anything just saved, or the next iteration
    // could re-ask for it.
    system[1] = { type: "text", text: volatileStateBlock(toolCtx.collected) };
  }

  if (!reply) {
    reply =
      "Sorry — I lost my thread there. Could you say that again, or call the clinic directly?";
  }

  return {
    reply,
    collected: toolCtx.collected,
    booking: toolCtx.booking,
    leadStatus: deriveLeadStatus(toolCtx),
    urgent: false, // set by the orchestrator's deterministic check
    engine: "claude",
  };
}

function deriveLeadStatus(ctx: ToolContext): ReceptionistResult["leadStatus"] {
  if (ctx.booking) return "converted";
  const c = ctx.collected;
  if (c.contactPhone || c.contactEmail) return "booking";
  if (c.patientName || c.treatment || c.preferredDate) return "interested";
  return "browsing";
}
