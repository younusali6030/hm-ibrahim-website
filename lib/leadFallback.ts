/**
 * Last-resort store for a lead when both the owner email and the Google Sheet failed.
 *
 * Writes the lead (without the attachment) to a Redis list over the same Upstash / Vercel KV REST pair the rate
 * limit uses. Read it back with `LRANGE hm:failed-leads 0 -1` in the Upstash console. Returns false when no store
 * is configured or the write fails, so the caller can fall back to the log line.
 */
const KEY = "hm:failed-leads";
const KEEP = 500;

type Lead = Record<string, unknown>;

export async function storeFailedLead(lead: Lead): Promise<boolean> {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return false;
  try {
    const { attachment: _attachment, ...rest } = lead;
    void _attachment;
    const res = await fetch(`${url.replace(/\/$/, "")}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify([
        ["LPUSH", KEY, JSON.stringify({ ...rest, savedAt: new Date().toISOString() })],
        ["LTRIM", KEY, "0", String(KEEP - 1)],
      ]),
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return false;
    const out = (await res.json()) as Array<{ result?: unknown; error?: unknown }>;
    return Number.isFinite(Number(out?.[0]?.result)) && !out?.[0]?.error;
  } catch {
    return false;
  }
}
