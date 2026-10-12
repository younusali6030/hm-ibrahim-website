// Run: npm test   (Node's built-in runner; no extra dependencies)
import test from "node:test";
import assert from "node:assert/strict";
import { categories, allProducts } from "../content/products.ts";
import { productAliases } from "../content/productAliases.ts";
import { catalogHi } from "../content/hi/catalog.ts";
import { buildProductEntries, searchProducts, normalizeText } from "../lib/productSearch.ts";

const hi = (s) => catalogHi[s] ?? s;
const entries = buildProductEntries(categories, productAliases, hi);
const find = (q) => searchProducts(entries, q);

test("catalogue: unique product count is 53 and every slug appears once in the entries", () => {
  const slugs = new Set(allProducts.map((p) => p.slug));
  assert.equal(slugs.size, allProducts.length);
  assert.equal(entries.length, slugs.size);
  // The category rows add cross-listed products again; the unique count is what the page must show.
  const rows = categories.reduce((n, c) => n + c.products.length, 0);
  assert.ok(rows > slugs.size, "cross-listed products make the category rows exceed the unique count");
});

test("aliases only point at real product slugs", () => {
  const slugs = new Set(allProducts.map((p) => p.slug));
  for (const slug of Object.keys(productAliases)) assert.ok(slugs.has(slug), `unknown slug in productAliases: ${slug}`);
});

test("normalizeText folds transliteration spellings and punctuation", () => {
  assert.equal(normalizeText("  Jaali!! "), "jali");
  assert.equal(normalizeText("Kala-Taar"), "kala tar");
  assert.equal(normalizeText("Machhar   Jali"), "machar jali");
  assert.equal(normalizeText("Chain/Link"), "chain link");
});

test("jali / jaali / जाली find the mesh family, not bars or tools", () => {
  for (const q of ["jali", "jaali", "JALI", "जाली"]) {
    const r = find(q);
    assert.ok(r.length >= 10, `${q} -> ${r.length}`);
    for (const must of ["mosquito-net", "gi-perforated-sheet", "chain-link-fencing", "pigeon-nets", "gi-weldmesh"]) assert.ok(r.includes(must), `${q} missing ${must}`);
    for (const never of ["tmt-bars", "ms-angles", "binding-wire", "sr-crowbar", "gi-pipes"]) assert.ok(!r.includes(never), `${q} should not return ${never}`);
  }
});

test("machhar jali / मच्छर जाली -> mosquito net first", () => {
  for (const q of ["machhar jali", "machhar jaali", "मच्छर जाली"]) assert.ok(find(q).includes("mosquito-net"), q);
  assert.deepEqual(find("machhar jali").filter((s) => !["mosquito-net", "ss-fine-mesh"].includes(s)), []);
});

test("kala taar / काला तार -> binding wire only", () => {
  for (const q of ["kala taar", "kala tar", "काला तार"]) assert.deepEqual(find(q), ["binding-wire"], q);
});

test("kata taar -> barbed wire; barbed wire and chainlink wire", () => {
  assert.deepEqual(find("kata taar"), ["barbed-wire"]);
  assert.ok(find("Barbed Wire").includes("barbed-wire"));
  assert.ok(find("ChainLink wire").includes("chain-link-fencing"));
  assert.ok(find("chain link").includes("chain-link-fencing"));
});

test("TMT bar / sariya / सरिया -> TMT bars", () => {
  for (const q of ["TMT bar", "tmt bars", "sariya", "सरिया"]) assert.ok(find(q).includes("tmt-bars"), q);
});

test("angle, flat, channel hit their own product and not unrelated summaries", () => {
  assert.ok(find("angle").includes("ms-angles"));
  assert.deepEqual(find("flat"), ["ms-flats"]);
  assert.ok(find("channel").includes("ms-channels"));
});

test("geti, phawda, faurdha, kabootar jali, murga jali, chicken mesh, chaddar jali", () => {
  assert.ok(find("geti").includes("sr-pickaxe-geti"));
  assert.deepEqual(find("phawda").sort(), ["sr-hoe-faurdha", "sr-hoe-faurdha-with-handle"]);
  assert.ok(find("faurdha").includes("sr-hoe-faurdha"));
  assert.ok(find("Kabootar Jaali").includes("pigeon-nets"));
  assert.ok(find("कबूतर जाली").includes("pigeon-nets"));
  assert.ok(find("Murga Jali").includes("chicken-net"));
  assert.ok(find("Chicken Mesh").includes("chicken-net"));
  const ch = find("chaddar jali");
  assert.deepEqual(ch.sort(), ["gi-perforated-sheet", "ms-perforated-sheet"]);
});

test("short tokens match word starts only (gi, ms, ss)", () => {
  const gi = find("gi");
  assert.ok(gi.length > 0 && gi.includes("gi-wire"));
  assert.ok(!gi.includes("ms-angles"));
});

test("waterproofing mesh is not mapped to a guess: empty result, so the page shows the ask-us state", () => {
  assert.deepEqual(find("waterproofing mesh"), []);
});

test("empty and whitespace queries return everything; nonsense returns nothing", () => {
  assert.equal(find("").length, entries.length);
  assert.equal(find("   ").length, entries.length);
  assert.deepEqual(find("zzzzqq"), []);
});

test("summary text is only used when no name matches", () => {
  // "plaster" appears only in summaries (fibre mesh, expanded metal), never in a product name or alias.
  const r = find("plaster");
  assert.ok(r.includes("fiber-mesh"));
});
