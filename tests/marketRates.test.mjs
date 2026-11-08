// Run: npm test. Guards the dated Indore market rates (content/marketRates.ts, decision D-018).
import test from "node:test";
import assert from "node:assert/strict";
import { marketRates, marketRateFaq, formatAsOf, rupees } from "../content/marketRates.ts";
import { indorePageSlugs } from "../content/indorePages.ts";

test("every market rate is on a real Indore page, dated, and its midpoint is the middle of its range", () => {
  for (const [slug, r] of Object.entries(marketRates)) {
    assert.ok(indorePageSlugs.includes(slug), `${slug} is not an Indore page`);
    assert.match(r.asOf, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(!Number.isNaN(Date.parse(r.asOf)), `${slug} asOf is not a date`);
    assert.ok(r.low > 0 && r.low < r.high, `${slug} range is not low < high`);
    assert.equal(r.mid, (r.low + r.high) / 2, `${slug} mid must be (low + high) / 2`);
  }
});

test("the rate FAQ says it is a market estimate, in both languages", () => {
  for (const r of Object.values(marketRates)) {
    assert.match(marketRateFaq(r, false).answer, /market estimate, not our quote/);
    assert.match(marketRateFaq(r, true).answer, /बाज़ार का अनुमान है, हमारा कोटेशन नहीं/);
  }
});

test("date and rupee formatting", () => {
  assert.equal(formatAsOf("2026-11-08", false), "8 Nov 2026");
  assert.equal(formatAsOf("2026-11-08", true), "8 नवंबर 2026");
  assert.equal(rupees(58.5), "₹58.5");
  assert.equal(rupees(73), "₹73");
});
