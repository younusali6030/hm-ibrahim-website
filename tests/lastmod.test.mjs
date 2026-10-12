import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { allProducts, categories } from "../content/products.ts";
import { indorePageSlugs } from "../content/indorePages.ts";

const ledger = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, "..", "content", "lastmod.json"), "utf8"));

test("lastmod ledger covers every product, category and Indore page with a real date", () => {
  const keys = [
    ...allProducts.map((p) => `products/${p.slug}`),
    ...categories.map((c) => `categories/${c.slug}`),
    ...indorePageSlugs.map((s) => `indore/${s}`),
  ];
  for (const k of keys) {
    assert.ok(ledger[k], `${k} missing: run node scripts/update-lastmod.mjs`);
    assert.match(ledger[k].date, /^\d{4}-\d{2}-\d{2}$/, k);
    assert.match(ledger[k].hash, /^[0-9a-f]{12}$/, k);
  }
  assert.equal(Object.keys(ledger).length, keys.length, "ledger has entries for pages that no longer exist");
});
