import { prisma } from "@/lib/prisma";
import { guardRead, guardWrite, parseBody } from "@/lib/admin-route";
import { knowledgeSchema } from "@/lib/validations";
import { uniqueSlug } from "@/lib/slug";
import { handleRoute, jsonOk } from "@/lib/http";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  return handleRoute("admin.knowledge.list", async () => {
    await guardRead();
    const rows = await prisma.knowledgeItem.findMany({
      orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
    });
    return jsonOk({ knowledge: rows });
  });
}

export async function POST(req: Request) {
  return handleRoute("admin.knowledge.create", async () => {
    await guardWrite(req);
    const d = await parseBody(req, knowledgeSchema);
    const row = await prisma.knowledgeItem.create({
      data: { ...d, slug: uniqueSlug(d.title) },
    });
    return jsonOk({ item: row }, 201);
  });
}
