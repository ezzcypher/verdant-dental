import { prisma } from "@/lib/prisma";
import { guardWrite, paramId, parseBody } from "@/lib/admin-route";
import { knowledgeSchema } from "@/lib/validations";
import { handleRoute, jsonOk } from "@/lib/http";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  return handleRoute("admin.knowledge.update", async () => {
    await guardWrite(req);
    const id = await paramId(ctx);
    const d = await parseBody(req, knowledgeSchema.partial());
    const row = await prisma.knowledgeItem.update({ where: { id }, data: d });
    return jsonOk({ item: row });
  });
}

export async function DELETE(req: Request, ctx: Ctx) {
  return handleRoute("admin.knowledge.delete", async () => {
    await guardWrite(req);
    const id = await paramId(ctx);
    await prisma.knowledgeItem.delete({ where: { id } });
    return jsonOk({ ok: true });
  });
}
