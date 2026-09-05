import { prisma } from "@/lib/prisma";
import { CHAT_SESSION_ADMIN_FIELDS } from "@/lib/admin-select";
import { guardRead } from "@/lib/admin-route";
import { handleRoute, jsonOk } from "@/lib/http";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  return handleRoute("admin.conversations.list", async () => {
    await guardRead();

    const rows = await prisma.chatSession.findMany({
      orderBy: { lastActivityAt: "desc" },
      take: 150,
      select: {
        ...CHAT_SESSION_ADMIN_FIELDS,
        _count: { select: { messages: true, appointments: true } },
      },
    });

    return jsonOk({ conversations: rows });
  });
}
