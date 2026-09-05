import { prisma } from "@/lib/prisma";
import { APPOINTMENT_ADMIN_FIELDS } from "@/lib/admin-select";
import { guardWrite, paramId, parseBody } from "@/lib/admin-route";
import { appointmentStatusSchema } from "@/lib/validations";
import { handleRoute, jsonOk } from "@/lib/http";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  return handleRoute("admin.appointments.update", async () => {
    await guardWrite(req);
    const id = await paramId(ctx);
    const { status } = await parseBody(req, appointmentStatusSchema);

    const row = await prisma.appointment.update({
      where: { id },
      data: { status },
      select: APPOINTMENT_ADMIN_FIELDS,
    });
    return jsonOk({ appointment: row });
  });
}

export async function DELETE(req: Request, ctx: Ctx) {
  return handleRoute("admin.appointments.delete", async () => {
    await guardWrite(req);
    const id = await paramId(ctx);
    await prisma.appointment.delete({ where: { id } });
    return jsonOk({ ok: true });
  });
}
