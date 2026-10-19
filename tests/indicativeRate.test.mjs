// Run: npm test. The indicative rate feeds both the visible price line and the Product AggregateOffer.
import test from "node:test";
import assert from "node:assert/strict";
import { parseIndicativeRate } from "../lib/indicativeRate.ts";

test("parses a plain range with its unit", () => {
  assert.deepEqual(parseIndicativeRate("Approx. ₹52–62 per kg (varies by size and quantity). Confirm for current price."), {
    low: 52,
    high: 62,
    unit: "kg",
  });
});

test("thousands separators and per-piece units", () => {
  assert.deepEqual(parseIndicativeRate("Approx. ₹400–1,200 per piece (varies by size). Confirm for current price."), {
    low: 400,
    high: 1200,
    unit: "piece",
  });
});

test("two ranges in one string span the lowest and highest amount", () => {
  assert.deepEqual(
    parseIndicativeRate("Approx. ₹25–80 per metre (plastic) / ₹150–350 per metre (SS). Confirm for current price."),
    { low: 25, high: 350, unit: "metre" }
  );
});

test("sq m unit", () => {
  assert.equal(parseIndicativeRate("Approx. ₹15–40 per sq m. Confirm for current price.")?.unit, "sq m");
});

test("no amount or no unit gives null, so no Product schema is emitted", () => {
  assert.equal(parseIndicativeRate("Contact us for the price."), null);
  assert.equal(parseIndicativeRate(undefined), null);
  assert.equal(parseIndicativeRate("Approx. ₹50–60"), null);
});
