import { prisma } from "@/lib/prisma";

import type { ClinicContext } from "./types";

/**
 * Load everything the receptionist may answer from. Read fresh per conversation
 * turn so an edit in the admin dashboard takes effect immediately — no redeploy,
 * no cache to bust. All three tables are tiny (tens of rows), so this is one
 * cheap round-trip.
 */
export async function loadClinicContext(): Promise<ClinicContext> {
  const [treatments, dentists, knowledge] = await Promise.all([
    prisma.treatment.findMany({
      where: { active: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: {
        name: true,
        category: true,
        description: true,
        priceFrom: true,
        duration: true,
        keywords: true,
      },
    }),
    prisma.dentist.findMany({
      where: { active: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: {
        name: true,
        title: true,
        focus: true,
        yearsExperience: true,
        languages: true,
      },
    }),
    prisma.knowledgeItem.findMany({
      where: { active: true },
      orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
      select: { category: true, title: true, content: true },
    }),
  ]);

  return { treatments, dentists, knowledge };
}

/** Best-effort match of free text to a treatment name, for the rules engine. */
export function matchTreatment(text: string, ctx: ClinicContext): string | null {
  const lower = text.toLowerCase();

  for (const t of ctx.treatments) {
    if (lower.includes(t.name.toLowerCase())) return t.name;
  }
  for (const t of ctx.treatments) {
    const keywords = (t.keywords ?? "")
      .split(",")
      .map((k) => k.trim().toLowerCase())
      .filter(Boolean);
    if (keywords.some((k) => lower.includes(k))) return t.name;
  }
  return null;
}
