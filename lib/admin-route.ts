import type { ZodSchema } from "zod";

import { requireAdmin } from "@/lib/auth";
import { HttpError, isSameOrigin, readJson } from "@/lib/http";

/** Auth only — for GET handlers, which change nothing. */
export async function guardRead(): Promise<void> {
  await requireAdmin();
}

/** Auth + same-origin — for anything that writes. */
export async function guardWrite(req: Request): Promise<void> {
  if (!isSameOrigin(req)) throw new HttpError(403, "Request blocked.");
  await requireAdmin();
}

/** Guarded body parse that throws a 422 with field errors on failure. */
export async function parseBody<T>(req: Request, schema: ZodSchema<T>): Promise<T> {
  const parsed = schema.safeParse(await readJson(req));
  if (!parsed.success) {
    throw new HttpError(422, "Please check the highlighted fields.");
  }
  return parsed.data;
}

/** Next 15 hands route params in as a promise. */
export async function paramId(ctx: { params: Promise<{ id: string }> }): Promise<string> {
  const { id } = await ctx.params;
  if (!id || id.length > 64) throw new HttpError(400, "Invalid id.");
  return id;
}
