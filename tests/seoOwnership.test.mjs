import test from "node:test";
import assert from "node:assert/strict";
import { indorePages, localPageForProductSlug } from "../content/indorePages.ts";
import { allProducts, categories } from "../content/products.ts";
import { categoryGuides, deliveryFacts, quoteUnit } from "../content/categoryGuides.ts";

test("every product mapped to a local page is real and listed on that page", () => {
  const slugs = new Set(allProducts.map((p) => p.slug));
  for (const [product, page] of Object.entries(localPageForProductSlug)) {
    assert.ok(slugs.has(product), `${product} is not a product`);
    assert.ok(indorePages[page], `${page} is not an Indore page`);
    assert.ok(indorePages[page].productSlugs.includes(product), `${product} is not listed on /indore/${page}`);
  }
});

test("each of the nine categories has a buying guide with questions in both languages", () => {
  for (const c of categories) {
    const g = categoryGuides[c.slug];
    assert.ok(g, `${c.slug} has no guide`);
    assert.ok(g.choose.length >= 3 && g.choose.length <= 6, `${c.slug}: ${g.choose.length} questions`);
    assert.ok(g.send.length >= 4, `${c.slug}: send list too short`);
    for (const item of [g.decision, ...g.choose.flatMap((x) => [x.q, x.a]), ...g.send]) {
      assert.ok(item.en.trim().length >= 3 && item.hi.trim().length >= 3, `${c.slug}: empty text`);
      assert.match(item.hi, /[ऀ-ॿ]/, `${c.slug}: Hindi text has no Devanagari: ${item.en.slice(0, 40)}`);
    }
  }
  assert.ok(deliveryFacts.india.en && deliveryFacts.india.hi);
});

test("guides promise no price, stock level or delivery date", () => {
  const text = JSON.stringify(categoryGuides) + JSON.stringify(deliveryFacts);
  assert.doesNotMatch(text, /₹|\bRs\.?\s?\d|\bin stock\b|always available|same[- ]day|next[- ]day|free delivery/i);
});

test("quote unit is read from the indicative-rate note and shows no figure", () => {
  assert.equal(quoteUnit("Approx. ₹52–62 per kg (varies by size).", false), "kg");
  assert.equal(quoteUnit("Approx. ₹55–75 per sq m (varies).", true), "वर्ग मीटर");
  assert.equal(quoteUnit("Approx. ₹45–85 per piece. Confirm.", false), "piece");
  assert.equal(quoteUnit(undefined, false), null);
});
