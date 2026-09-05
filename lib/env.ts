/**
 * Central, validated access to server-side configuration.
 *
 * SERVER ONLY. Import this only from route handlers, middleware helpers, and
 * server components — never from a "use client" module.
 *
 * Validation happens on FIRST USE, never at module import time. Next.js imports
 * every route module during "Collecting page data" at build time, so a
 * top-level throw here would fail the production build whenever env vars aren't
 * visible in that phase — turning a runtime config problem into a deploy
 * blocker. See lib/prisma.ts for the matching lazy-client pattern.
 *
 * Nothing in this file is a literal secret — only variable *names* and shape rules.
 */

interface ServerEnv {
  DATABASE_URL: string;
  AUTH_SECRET: string;
  IP_HASH_SALT: string;
  ADMIN_PASSWORD_HASH: string;
  /** Comma-separated extra origins allowed to call mutating API routes. */
  ALLOWED_ORIGINS: string[];
  NODE_ENV: "development" | "test" | "production";
}

let cached: ServerEnv | null = null;

function fail(problems: string[]): never {
  throw new Error(
    `Invalid server configuration — the app cannot start:\n` +
      problems.map((p) => `  • ${p}`).join("\n") +
      `\n\nCopy .env.example to .env and fill in the values (see README.md → Backend setup).`,
  );
}

/**
 * Trim whitespace (including the trailing newline some dashboard paste boxes
 * add) and strip one layer of accidentally-included surrounding quotes — a
 * common mistake when copying a `KEY="value"` line from a .env file and pasting
 * just the value into a web form that doesn't expect the quotes. Cheap, and it
 * closes off a whole class of "works locally, 500s in prod".
 */
function clean(v: string | undefined): string | undefined {
  if (v === undefined) return undefined;
  const trimmed = v.trim();
  const quoted = trimmed.match(/^(["'])([\s\S]*)\1$/);
  return quoted ? quoted[2].trim() : trimmed;
}

export function serverEnv(): ServerEnv {
  if (cached) return cached;

  const problems: string[] = [];
  const DATABASE_URL = clean(process.env.DATABASE_URL);
  const AUTH_SECRET = clean(process.env.AUTH_SECRET);
  const IP_HASH_SALT = clean(process.env.IP_HASH_SALT);
  const ADMIN_PASSWORD_HASH = clean(process.env.ADMIN_PASSWORD_HASH);
  const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS;
  const NODE_ENV = process.env.NODE_ENV;

  if (!DATABASE_URL) {
    problems.push("DATABASE_URL is required (the pooled Postgres connection string)");
  }
  if (!AUTH_SECRET || AUTH_SECRET.length < 32) {
    problems.push(
      "AUTH_SECRET is required and must be at least 32 characters " +
        "(generate: node -e \"console.log(require('crypto').randomBytes(48).toString('hex'))\")",
    );
  }
  if (!IP_HASH_SALT || IP_HASH_SALT.length < 16) {
    problems.push("IP_HASH_SALT is required and must be at least 16 characters");
  }
  if (!ADMIN_PASSWORD_HASH || !/^scrypt:\d+:[a-f0-9]+:[a-f0-9]+$/i.test(ADMIN_PASSWORD_HASH)) {
    problems.push(
      "ADMIN_PASSWORD_HASH is required and must be a scrypt hash " +
        "(generate: npm run admin:hash -- 'your-admin-password')",
    );
  }

  if (problems.length) fail(problems);

  cached = {
    DATABASE_URL: DATABASE_URL!,
    AUTH_SECRET: AUTH_SECRET!,
    IP_HASH_SALT: IP_HASH_SALT!,
    ADMIN_PASSWORD_HASH: ADMIN_PASSWORD_HASH!,
    ALLOWED_ORIGINS: (ALLOWED_ORIGINS ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    NODE_ENV: (NODE_ENV as ServerEnv["NODE_ENV"]) ?? "development",
  };
  return cached;
}

export const isProd = () => process.env.NODE_ENV === "production";

/* ------------------------------------------------------------------ *
 * AI receptionist — optional.
 *
 * With no key set the chatbot runs its deterministic rule-based engine
 * (still answers from the knowledge base and completes real bookings).
 * With a key it runs Claude, and falls back to the rule-based engine on
 * any API error so the widget never dies in front of a patient.
 * ------------------------------------------------------------------ */

export interface AiEnv {
  apiKey: string | null;
  model: string;
}

/** Default model. Opus 5 with low effort: fast enough for chat, accurate on tool calls. */
export const DEFAULT_AI_MODEL = "claude-opus-5";

export function aiEnv(): AiEnv {
  const apiKey = clean(process.env.ANTHROPIC_API_KEY) || null;
  const model = clean(process.env.AI_MODEL) || DEFAULT_AI_MODEL;
  // A key that survived a bad paste but isn't actually a key is worse than none:
  // it would 401 on every turn. Treat anything not shaped like one as absent.
  if (apiKey && !/^sk-ant-/.test(apiKey)) {
    return { apiKey: null, model };
  }
  return { apiKey, model };
}

export const aiLiveMode = () => aiEnv().apiKey !== null;
