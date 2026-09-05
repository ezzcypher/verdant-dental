/**
 * Minimal in-memory fixed-window rate limiter.
 *
 * Scope: one server instance. It resets on redeploy and is not shared across
 * serverless instances, so treat it as friction against casual abuse rather than
 * a hard guarantee. For a multi-instance production deployment, swap the Map for
 * a shared store (Upstash Redis / Vercel KV) behind this same interface.
 */

interface Window {
  count: number;
  resetAt: number;
}

const windows = new Map<string, Window>();
const MAX_KEYS = 10_000;

export interface RateLimitResult {
  ok: boolean;
  /** Seconds until the window resets. */
  retryAfter: number;
}

export function rateLimit(key: string, limit = 5, windowMs = 60_000): RateLimitResult {
  const now = Date.now();
  const existing = windows.get(key);

  if (!existing || now >= existing.resetAt) {
    // Opportunistic cleanup so the map can't grow without bound.
    if (windows.size > MAX_KEYS) {
      for (const [k, w] of windows) if (now >= w.resetAt) windows.delete(k);
    }
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }

  if (existing.count >= limit) {
    return { ok: false, retryAfter: Math.ceil((existing.resetAt - now) / 1000) };
  }

  existing.count += 1;
  return { ok: true, retryAfter: 0 };
}

/**
 * Apply several windows at once (e.g. 5/minute AND 20/hour on login). Every
 * window is consumed so a caller can't dodge the slow one by staying under the
 * fast one; the longest retry-after wins.
 */
export function rateLimitMany(
  specs: { key: string; limit: number; windowMs: number }[],
): RateLimitResult {
  let worst: RateLimitResult = { ok: true, retryAfter: 0 };
  for (const s of specs) {
    const r = rateLimit(s.key, s.limit, s.windowMs);
    if (!r.ok && r.retryAfter > worst.retryAfter) worst = r;
  }
  return worst;
}
