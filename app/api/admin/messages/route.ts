import { prisma } from "@/lib/prisma";
import { CONTACT_ADMIN_FIELDS } from "@/lib/admin-select";
import { guardRead } from "@/lib/admin-route";
import { handleRoute, jsonOk } from "@/lib/http";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  return handleRoute("admin.messages.list", async () => {
    await guardRead();
    const rows = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
      select: CONTACT_ADMIN_FIELDS,
    });
    return jsonOk({ messages: rows });
  });
}
