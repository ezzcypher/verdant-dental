import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const git = (...args) => execFileSync("git", args, { cwd: ROOT, encoding: "utf8" });

describe("secrets are never committed", () => {
  const tracked = git("ls-files").split(/\r?\n/).filter(Boolean);

  test("no secret-bearing file is tracked by git", () => {
    const forbidden = [".env", ".env.ai", ".env.local", "ADMIN-CREDENTIALS.txt", "prisma/dev.db"];
    for (const f of forbidden) {
      assert.ok(!tracked.includes(f), `${f} must never be committed`);
    }
  });

  test("no tracked file contains a live credential", () => {
    // .env.example carries placeholders on purpose; everything else must be clean.
    const patterns = [
      { re: /sk-ant-(?!\.\.\.)[A-Za-z0-9_-]{20,}/, label: "Anthropic key" },
      { re: /postgres(?:ql)?:\/\/[^\s"']*:[^\s"'@]{8,}@(?!USER)/i, label: "Postgres URL with password" },
      { re: /scrypt:\d+:[a-f0-9]{16,}:[a-f0-9]{32,}/i, label: "admin password hash" },
    ];

    for (const file of tracked) {
      if (file === ".env.example") continue;
      const full = path.join(ROOT, file);
      if (!existsSync(full)) continue;
      let content;
      try {
        content = readFileSync(full, "utf8");
      } catch {
        continue; // binary
      }
      for (const { re, label } of patterns) {
        assert.ok(!re.test(content), `${file} appears to contain a ${label}`);
      }
    }
  });

  test("gitignore covers every local secret file", () => {
    const ignored = readFileSync(path.join(ROOT, ".gitignore"), "utf8");
    for (const entry of [".env", ".env.ai", "ADMIN-CREDENTIALS.txt"]) {
      assert.ok(ignored.includes(entry), `.gitignore must list ${entry}`);
    }
  });
});

describe("serverless deployment configuration", () => {
  const chatRoute = readFileSync(path.join(ROOT, "app/api/chat/route.ts"), "utf8");

  test("chat route pins the Node runtime (Prisma cannot run on Edge)", () => {
    assert.match(chatRoute, /export const runtime = "nodejs"/);
  });

  test("chat route raises maxDuration above the 10s default", () => {
    const m = chatRoute.match(/export const maxDuration = (\d+)/);
    assert.ok(m, "maxDuration must be declared");
    assert.ok(Number(m[1]) >= 30, "maxDuration must exceed a slow model turn");
  });

  test("the Anthropic request timeout sits below maxDuration", () => {
    const claude = readFileSync(path.join(ROOT, "lib/ai/claude.ts"), "utf8");
    const timeout = Number(claude.match(/REQUEST_TIMEOUT_MS = ([\d_]+)/)[1].replace(/_/g, ""));
    const maxDuration = Number(chatRoute.match(/maxDuration = (\d+)/)[1]) * 1000;
    assert.ok(
      timeout < maxDuration,
      "the SDK must time out first so the request degrades instead of 504-ing",
    );
  });

  test("Prisma targets the Vercel serverless binary", () => {
    const schema = readFileSync(path.join(ROOT, "prisma/schema.prisma"), "utf8");
    assert.match(schema, /rhel-openssl-3\.0\.x/);
    assert.match(schema, /provider\s*=\s*"postgresql"/);
  });

  test("build runs prisma generate before next build", () => {
    const pkg = JSON.parse(readFileSync(path.join(ROOT, "package.json"), "utf8"));
    assert.match(pkg.scripts.build, /prisma generate/);
  });
});

describe("env handling", () => {
  const env = readFileSync(path.join(ROOT, "lib/env.ts"), "utf8");
  const prisma = readFileSync(path.join(ROOT, "lib/prisma.ts"), "utf8");

  test("config is validated lazily, never at module import", () => {
    // A top-level serverEnv() call would fail the Vercel build during
    // "Collecting page data" rather than at request time.
    assert.ok(!/^serverEnv\(\)/m.test(env));
    assert.match(prisma, /new Proxy/, "prisma client must be lazily constructed");
  });

  test("env values are trimmed and de-quoted against paste artifacts", () => {
    assert.match(env, /function clean/);
    assert.match(env, /\^\(\["'\]\)/);
  });

  test("a malformed Anthropic key is treated as absent, not used", () => {
    assert.match(env, /\^sk-ant-/);
  });
});
