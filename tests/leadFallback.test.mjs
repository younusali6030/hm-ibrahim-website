import test from "node:test";
import assert from "node:assert/strict";
import { storeFailedLead } from "../lib/leadFallback.ts";

const lead = { name: "A", phone: "9826053563", items: "binding wire", reference: "HM-1", attachment: { content: Buffer.from("x") } };

test("no store configured: returns false and makes no request", async () => {
  for (const k of ["UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN", "KV_REST_API_URL", "KV_REST_API_TOKEN"]) delete process.env[k];
  const real = globalThis.fetch;
  globalThis.fetch = async () => assert.fail("fetch must not be called");
  try {
    assert.equal(await storeFailedLead(lead), false);
  } finally {
    globalThis.fetch = real;
  }
});

test("store configured: pushes the lead without the attachment and trims the list", async () => {
  process.env.UPSTASH_REDIS_REST_URL = "https://redis.example.test/";
  process.env.UPSTASH_REDIS_REST_TOKEN = "t";
  const real = globalThis.fetch;
  let sent;
  globalThis.fetch = async (url, init) => {
    sent = { url, body: JSON.parse(init.body) };
    return new Response(JSON.stringify([{ result: 1 }, { result: "OK" }]), { status: 200 });
  };
  try {
    assert.equal(await storeFailedLead(lead), true);
    assert.equal(sent.url, "https://redis.example.test/pipeline");
    assert.equal(sent.body[0][0], "LPUSH");
    const stored = JSON.parse(sent.body[0][2]);
    assert.equal(stored.reference, "HM-1");
    assert.equal("attachment" in stored, false);
    assert.deepEqual(sent.body[1], ["LTRIM", "hm:failed-leads", "0", "499"]);
  } finally {
    globalThis.fetch = real;
  }
});

test("store error or non-OK response: returns false", async () => {
  process.env.UPSTASH_REDIS_REST_URL = "https://redis.example.test";
  process.env.UPSTASH_REDIS_REST_TOKEN = "t";
  const real = globalThis.fetch;
  try {
    globalThis.fetch = async () => new Response("no", { status: 500 });
    assert.equal(await storeFailedLead(lead), false);
    globalThis.fetch = async () => { throw new Error("down"); };
    assert.equal(await storeFailedLead(lead), false);
  } finally {
    globalThis.fetch = real;
  }
});
