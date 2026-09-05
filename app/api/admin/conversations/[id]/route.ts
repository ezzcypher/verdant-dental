import { prisma } from "@/lib/prisma";
import { CHAT_SESSION_ADMIN_FIELDS } from "@/lib/admin-select";
import { guardRead, guardWrite, paramId } from "@/lib/admin-route";
import { handleRoute, jsonError, jsonOk } from "@/lib/http";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  return handleRoute("admin.conversations.get", async () => {
    await guardRead();
    const id = await paramId(ctx);

    const session = await prisma.chatSession.findUnique({
      where: { id },
      select: {
        ...CHAT_SESSION_ADMIN_FIELDS,
        messages: {
          orderBy: { createdAt: "asc" },
          select: { id: true, role: true, content: true, createdAt: true },
        },
        appointments: { select: { reference: true, treatment: true, status: true } },
      },
    });

    if (!session) return jsonError(404, "Conversation not found.");
    return jsonOk({ conversation: session });
  });
}

export async function DELETE(req: Request, ctx: Ctx) {
  return handleRoute("admin.conversations.delete", async () => {
    await guardWrite(req);
    const id = await paramId(ctx);
    await prisma.chatSession.delete({ where: { id } }); // messages cascade
    return jsonOk({ ok: true });
  });
}
