import { PrismaClient } from "@prisma/client";

import { serverEnv } from "@/lib/env";

/**
 * Lazy singleton. Deliberately does NOT validate env or construct the client at
 * module-import time: Next.js imports every route module during "Collecting page
 * data" at build time (even for fully `force-dynamic` routes), so a top-level
 * throw here would fail the production build itself whenever env vars aren't
 * visible in that phase — turning a runtime config problem into a deploy
 * blocker with a confusing "Failed to collect page data" error.
 *
 * Instead, validation + construction happen on first real use (the first query a
 * request makes), which surfaces the same clear error at request time.
 */

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function getClient(): PrismaClient {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;

  serverEnv(); // throws a clear, aggregated error if misconfigured

  const client = new PrismaClient({
    // No "query" logging — Prisma's query log echoes parameter values, which for
    // these models means patient names, phone numbers and emails in the console.
    log: process.env.NODE_ENV === "production" ? ["error"] : ["error", "warn"],
  });

  // Cached across hot-reloads in dev and warm serverless invocations in prod.
  globalForPrisma.prisma = client;
  return client;
}

export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    return Reflect.get(getClient(), prop, receiver);
  },
});
