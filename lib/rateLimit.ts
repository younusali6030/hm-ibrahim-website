/**
 * Fixed-window rate limit for the quote form.
 *
 * With UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN set (or the Vercel KV pair KV_REST_API_URL / KV_REST_API_TOKEN)
 * the counter lives in Redis, so every serverless instance shares it. Without them, or if Redis is unreachable,
 * it falls back to a per-instance in-memory counter: weaker, but the form keeps working.
 */
const memory = new Map<string, number[]>();

function memoryLimited(key: string, max: number, windowMs: number, now: number): boolean {
  const recent = (memory.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) {
    memory.set(key, recent);
    return true;
  }
  recent.push(now);
  memory.set(key, recent);
  if (memory.size > 2000) {
    memory.forEach((v, k) => {
      if (v.every((t) => now - t >= windowMs)) memory.delete(k);
    });
  }
  return false;
}

function redisConfig(): { url: string; token: string } | null {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ""), token } : null;
}

/** True when this key has used up its allowance for the window. Counts the call. */
export async function rateLimited(key: string, max: number, windowMs: number, now = Date.now()): Promise<boolean> {
  const cfg = redisConfig();
  if (!cfg) return memoryLimited(key, max, windowMs, now);
  try {
    const k = `rl:${key}`;
    const res = await fetch(`${cfg.url}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${cfg.token}`, "Content-Type": "application/json" },
      body: JSON.stringify([
        ["SET", k, "0", "EX", String(Math.ceil(windowMs / 1000)), "NX"],
        ["INCR", k],
      ]),
      signal: AbortSignal.timeout(1500),
    });
    if (!res.ok) throw new Error(`redis ${res.status}`);
    const out = (await res.json()) as Array<{ result?: unknown }>;
    const count = Number(out?.[1]?.result);
    if (!Number.isFinite(count)) throw new Error("redis: no count");
    return count > max;
  } catch (e) {
    console.warn("[rate-limit] shared store unavailable, using memory", (e as Error).message);
    return memoryLimited(key, max, windowMs, now);
  }
}
