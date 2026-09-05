import { randomBytes } from "node:crypto";

import { prisma } from "@/lib/prisma";
import { chatSchema } from "@/lib/validations";
import { answer } from "@/lib/ai/receptionist";
import type { ChatTurn, CollectedDetails } from "@/lib/ai/types";
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

/** Chat is chattier than a form, so it gets its own, looser budget. */
const CHAT_LIMIT = 20;
const CHAT_WINDOW_MS = 60_000;

/** Replayed to the model; also what the admin sees in the transcript. */
const HISTORY_LIMIT = 30;

export async function POST(req: Request) {
  return handleRoute("chat", async () => {
    if (!isSameOrigin(req)) {
      return jsonError(403, "Request blocked.");
    }

    const ip = getClientIp(req);
    const limit = rateLimit(`chat:${ip}`, CHAT_LIMIT, CHAT_WINDOW_MS);
    if (!limit.ok) {
      return jsonError(429, "You're sending messages very quickly — give it a moment.", {
        retryAfter: limit.retryAfter,
      });
    }

    const parsed = chatSchema.safeParse(await readJson(req));
    if (!parsed.success) {
      return jsonError(422, "Invalid message.", {
        fields: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      });
    }

    const { sessionId: publicId, message } = parsed.data;
    const sourceIpHash = hashIp(ip);

    // Resolve or create the conversation. An unknown/expired public id simply
    // starts a fresh session rather than erroring at the patient.
    let session = publicId
      ? await prisma.chatSession.findUnique({ where: { publicId } })
      : null;

    if (!session) {
      session = await prisma.chatSession.create({
        data: { publicId: randomBytes(18).toString("base64url"), sourceIpHash },
      });
    }

    const priorRows = await prisma.chatMessage.findMany({
      where: { sessionId: session.id },
      orderBy: { createdAt: "asc" },
      take: HISTORY_LIMIT,
      select: { role: true, content: true },
    });
    const history: ChatTurn[] = priorRows
      .filter((m): m is { role: "user" | "assistant"; content: string } =>
        m.role === "user" || m.role === "assistant",
      )
      .map((m) => ({ role: m.role, content: m.content }));

    await prisma.chatMessage.create({
      data: { sessionId: session.id, role: "user", content: message },
    });

    const collected: CollectedDetails = {
      patientName: session.patientName,
      contactPhone: session.contactPhone,
      contactEmail: session.contactEmail,
      treatment: session.treatment,
      preferredDentist: session.preferredDentist,
      preferredDate: session.preferredDate,
      preferredTime: session.preferredTime,
      reasonForVisit: session.reasonForVisit,
    };

    const result = await answer({
      history,
      userMessage: message,
      collected,
      sessionId: session.id,
      sourceIpHash,
    });

    await prisma.chatMessage.create({
      data: { sessionId: session.id, role: "assistant", content: result.reply },
    });

    await prisma.chatSession.update({
      where: { id: session.id },
      data: {
        patientName: result.collected.patientName ?? undefined,
        contactPhone: result.collected.contactPhone ?? undefined,
        contactEmail: result.collected.contactEmail ?? undefined,
        treatment: result.collected.treatment ?? undefined,
        preferredDentist: result.collected.preferredDentist ?? undefined,
        preferredDate: result.collected.preferredDate ?? undefined,
        preferredTime: result.collected.preferredTime ?? undefined,
        reasonForVisit: result.collected.reasonForVisit ?? undefined,
        leadStatus: result.leadStatus,
        status: result.booking ? "converted" : session.status,
        urgentFlag: session.urgentFlag || result.urgent,
        summary:
          result.collected.treatment && result.collected.patientName
            ? `${result.collected.patientName} — ${result.collected.treatment}`
            : (result.collected.treatment ?? session.summary),
        lastActivityAt: new Date(),
      },
    });

    return jsonOk({
      sessionId: session.publicId,
      reply: result.reply,
      booking: result.booking,
      urgent: result.urgent,
    });
  });
}
