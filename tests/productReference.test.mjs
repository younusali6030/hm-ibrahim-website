import test from "node:test";
import assert from "node:assert/strict";
import { productReference } from "../content/productReference.ts";
import { allProducts } from "../content/products.ts";

test("trade reference is attached only to real products and has both languages", () => {
  const slugs = new Set(allProducts.map((p) => p.slug));
  for (const [slug, ref] of Object.entries(productReference)) {
    assert.ok(slugs.has(slug), `${slug} is not a product`);
    assert.ok(ref.rows.length > 0, slug);
    for (const r of ref.rows) {
      for (const b of [r.label, r.value]) assert.ok(b.en.trim() && b.hi.trim(), `${slug}: empty text`);
    }
  }
});

test("trade reference holds no price and never claims stock", () => {
  const text = JSON.stringify(productReference);
  assert.doesNotMatch(text, /₹|\bRs\.?\s?\d|\bin stock\b|we (stock|keep|sell)\b/i);
});
