import { aiEnv, DEFAULT_AI_MODEL } from "@/lib/env";
import { guardRead } from "@/lib/admin-route";
import { handleRoute, jsonOk } from "@/lib/http";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Operator-visible configuration state. Admin-only on purpose: whether an AI key
 * is configured is still configuration, and the public /api/health deliberately
 * discloses nothing. Reports only whether a key is PRESENT — never any part of
 * its value.
 */
export async function GET() {
  return handleRoute("admin.status", async () => {
    await guardRead();
    const { apiKey, model } = aiEnv();
    return jsonOk({
      aiMode: apiKey ? "claude" : "rules",
      model: apiKey ? model : null,
      defaultModel: DEFAULT_AI_MODEL,
    });
  });
}
