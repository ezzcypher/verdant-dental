import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { CONTACT_ADMIN_FIELDS } from "@/lib/admin-select";
import { guardWrite, paramId, parseBody } from "@/lib/admin-route";
import { handleRoute, jsonOk } from "@/lib/http";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

const handledSchema = z.object({ handled: z.boolean() });

export async function PATCH(req: Request, ctx: Ctx) {
  return handleRoute("admin.messages.update", async () => {
    await guardWrite(req);
    const id = await paramId(ctx);
    const { handled } = await parseBody(req, handledSchema);
    const row = await prisma.contactMessage.update({
      where: { id },
      data: { handled },
      select: CONTACT_ADMIN_FIELDS,
    });
    return jsonOk({ message: row });
  });
}

export async function DELETE(req: Request, ctx: Ctx) {
  return handleRoute("admin.messages.delete", async () => {
    await guardWrite(req);
    const id = await paramId(ctx);
    await prisma.contactMessage.delete({ where: { id } });
    return jsonOk({ ok: true });
  });
}
