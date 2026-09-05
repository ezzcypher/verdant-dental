import { prisma } from "@/lib/prisma";
import { APPOINTMENT_ADMIN_FIELDS } from "@/lib/admin-select";
import { guardRead } from "@/lib/admin-route";
import { handleRoute, jsonOk } from "@/lib/http";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  return handleRoute("admin.appointments.list", async () => {
    await guardRead();

    const status = new URL(req.url).searchParams.get("status");
    const rows = await prisma.appointment.findMany({
      where: status && status !== "all" ? { status } : undefined,
      orderBy: { createdAt: "desc" },
      take: 200,
      select: APPOINTMENT_ADMIN_FIELDS,
    });

    return jsonOk({ appointments: rows });
  });
}
