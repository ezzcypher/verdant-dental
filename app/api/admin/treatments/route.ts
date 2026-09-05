import { prisma } from "@/lib/prisma";
import { guardRead, guardWrite, parseBody } from "@/lib/admin-route";
import { treatmentSchema } from "@/lib/validations";
import { uniqueSlug } from "@/lib/slug";
import { handleRoute, jsonOk } from "@/lib/http";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  return handleRoute("admin.treatments.list", async () => {
    await guardRead();
    const rows = await prisma.treatment.findMany({ orderBy: { sortOrder: "asc" } });
    return jsonOk({ treatments: rows });
  });
}

export async function POST(req: Request) {
  return handleRoute("admin.treatments.create", async () => {
    await guardWrite(req);
    const d = await parseBody(req, treatmentSchema);
    const row = await prisma.treatment.create({ data: { ...d, slug: uniqueSlug(d.name) } });
    return jsonOk({ item: row }, 201);
  });
}
