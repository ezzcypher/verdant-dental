import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

/**
 * Boot `next start` on a free port with extra environment applied, and wait for
 * /api/health. Returns a handle with the base URL and a stop().
 *
 * Runs the real production server so route config (runtime, maxDuration),
 * middleware and the real database are all in play.
 */
export async function startApp({ port, env = {} }) {
  const child = spawn(
    process.execPath,
    [path.join("node_modules", "next", "dist", "bin", "next"), "start", "-p", String(port)],
    {
      cwd: ROOT,
      env: { ...process.env, ...env },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );

  const logs = [];
  child.stdout.on("data", (d) => logs.push(String(d)));
  child.stderr.on("data", (d) => logs.push(String(d)));

  const base = `http://127.0.0.1:${port}`;
  for (let i = 0; i < 60; i++) {
    await sleep(500);
    try {
      const r = await fetch(`${base}/api/health`);
      if (r.ok) {
        return {
          base,
          logs,
          stop: async () => {
            child.kill();
            await sleep(300);
          },
        };
      }
    } catch {
      /* not up yet */
    }
  }
  child.kill();
  throw new Error(`server on ${port} did not start:\n${logs.join("")}`);
}

/** POST /api/chat with the same-origin header the route requires. */
export async function chat(base, message, sessionId) {
  const res = await fetch(`${base}/api/chat`, {
    method: "POST",
    headers: { "content-type": "application/json", origin: base },
    body: JSON.stringify(sessionId ? { message, sessionId } : { message }),
  });
  const data = await res.json().catch(() => null);
  return { status: res.status, ...data };
}
