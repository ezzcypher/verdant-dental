import { prisma } from "@/lib/prisma";
import { appointmentSchema } from "@/lib/validations";
import { makeReference } from "@/lib/reference";
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
  return handleRoute("appointments", async () => {
    if (!isSameOrigin(req)) return jsonError(403, "Request blocked.");

    const ip = getClientIp(req);
    const limit = rateLimit(`appointments:${ip}`, 5, 60_000);
    if (!limit.ok) {
      return jsonError(429, "Too many requests. Please try again shortly.", {
        retryAfter: limit.retryAfter,
      });
    }

    const parsed = appointmentSchema.safeParse(await readJson(req));
    if (!parsed.success) {
      return jsonError(422, "Please check the highlighted fields.", {
        fields: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      });
    }

    const d = parsed.data;
    const reference = makeReference();

    await prisma.appointment.create({
      data: {
        reference,
        name: d.name,
        phone: d.phone,
        email: d.email ? d.email : null,
        treatment: d.treatment && d.treatment.length >= 2 ? d.treatment : "General appointment",
        preferredDate: d.preferredDate ?? null,
        preferredTime: d.preferredTime ?? null,
        note: d.note ?? null,
        source: "web",
        status: "pending",
        sourceIpHash: hashIp(ip),
      },
    });

    return jsonOk({ ok: true, reference }, 201);
  });
}
