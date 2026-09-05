import { prisma } from "@/lib/prisma";
import { messageSchema } from "@/lib/validations";
import { rateLimit } from "@/lib/rate-limit";
import {
  getClientIp,
  hashIp,
  handleRoute,
  isSameOrigin,
  jsonError,
  jsonOk,
  readJson,
} from "@/lib/http";

export async function POST(req: Request) {
  return handleRoute("contact", async () => {
    if (!isSameOrigin(req)) return jsonError(403, "Request blocked.");

    const ip = getClientIp(req);
    const limit = rateLimit(`contact:${ip}`, 5, 60_000);
    if (!limit.ok) {
      return jsonError(429, "Too many requests. Please try again shortly.", {
        retryAfter: limit.retryAfter,
      });
    }

    const parsed = messageSchema.safeParse(await readJson(req));
    if (!parsed.success) {
      return jsonError(422, "Please check the highlighted fields.", {
        fields: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      });
    }

    const d = parsed.data;
    await prisma.contactMessage.create({
      data: {
        name: d.name,
        email: d.email,
        subject: d.subject ?? null,
        body: d.body,
        sourceIpHash: hashIp(ip),
      },
    });

    return jsonOk({ ok: true }, 201);
  });
}
