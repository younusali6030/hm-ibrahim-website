import test from "node:test";
import assert from "node:assert/strict";
import { rateLimited } from "../lib/rateLimit.ts";

test("memory fallback: blocks the 6th hit in a window and frees it after", async () => {
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.KV_REST_API_URL;
  const t0 = 1_000_000;
  for (let i = 0; i < 5; i++) assert.equal(await rateLimited("mem-a", 5, 600_000, t0 + i), false);
  assert.equal(await rateLimited("mem-a", 5, 600_000, t0 + 10), true);
  assert.equal(await rateLimited("mem-b", 5, 600_000, t0), false, "other keys are independent");
  assert.equal(await rateLimited("mem-a", 5, 600_000, t0 + 600_001), false);
});

test("shared store: uses the Redis REST count, and falls back to memory on error", async () => {
  process.env.UPSTASH_REDIS_REST_URL = "https://redis.example.test";
  process.env.UPSTASH_REDIS_REST_TOKEN = "t";
  const realFetch = globalThis.fetch;
  let count = 0;
  const seen = [];
  globalThis.fetch = async (url, init) => {
    seen.push({ url, body: JSON.parse(init.body), auth: init.headers.Authorization });
    count += 1;
    return new Response(JSON.stringify([{ result: "OK" }, { result: count }]), { status: 200 });
  };
  try {
    for (let i = 0; i < 5; i++) assert.equal(await rateLimited("redis-a", 5, 600_000), false);
    assert.equal(await rateLimited("redis-a", 5, 600_000), true);
    assert.equal(seen[0].url, "https://redis.example.test/pipeline");
    assert.deepEqual(seen[0].body[0].slice(0, 2), ["SET", "rl:redis-a"]);
    assert.equal(seen[0].auth, "Bearer t");
    globalThis.fetch = async () => new Response("boom", { status: 500 });
    assert.equal(await rateLimited("redis-b", 5, 600_000, 1), false, "fail open to memory");
  } finally {
    globalThis.fetch = realFetch;
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
  }
});
