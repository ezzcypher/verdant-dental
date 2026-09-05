import { prisma } from "@/lib/prisma";
import { guardRead, guardWrite, parseBody } from "@/lib/admin-route";
import { dentistSchema } from "@/lib/validations";
import { uniqueSlug } from "@/lib/slug";
import { handleRoute, jsonOk } from "@/lib/http";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  return handleRoute("admin.dentists.list", async () => {
    await guardRead();
    const rows = await prisma.dentist.findMany({ orderBy: { sortOrder: "asc" } });
    return jsonOk({ dentists: rows });
  });
}

export async function POST(req: Request) {
  return handleRoute("admin.dentists.create", async () => {
    await guardWrite(req);
    const d = await parseBody(req, dentistSchema);
    const row = await prisma.dentist.create({ data: { ...d, slug: uniqueSlug(d.name) } });
    return jsonOk({ item: row }, 201);
  });
}
