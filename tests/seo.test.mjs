// Run: npm test. Guards the manufacturing-scope claim and the search-result copy added in the Oct 2026 visibility audit.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { indorePages, manufacturedProductSlugs } from "../content/indorePages.ts";
import { indorePagesHi } from "../content/hi/indore.ts";
import { seoOverrides } from "../content/seoOverrides.ts";

const root = path.resolve(import.meta.dirname, "..");
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");

// Owner-confirmed 12 Oct 2026: barbed wire, chain link fencing and wire mesh are made by the shop. Nothing else.
const MADE = new Set(["barbed-wire", "chain-link-fencing-jaali", "wire-mesh"]);
// "manufacturers" (plural, as in "branded manufacturers") is not a claim about the shop.
const EN_CLAIM = /\bmanufactur(e|es|ed|er)\b/i;
const HI_CLAIM = /बनाते|बनाती|निर्माता|निर्माण करते|बनाया|बनाई|बनाए/;

function pageText(p) {
  return [p.title, p.description, p.h1, p.intro, p.intro2 ?? "", ...p.specs, ...p.useCases, ...(p.faqs ?? []).flatMap((f) => [f.question, f.answer])].join("\n");
}

test("English Indore pages claim manufacturing only for barbed wire, chain link and wire mesh", () => {
  for (const [slug, page] of Object.entries(indorePages)) {
    const text = pageText(page);
    if (MADE.has(slug)) assert.match(text, EN_CLAIM, `${slug} should say the shop manufactures it`);
    else assert.doesNotMatch(text, EN_CLAIM, `${slug} must not claim manufacturing`);
  }
});

test("Hindi Indore pages follow the same manufacturing scope", () => {
  for (const [slug, page] of Object.entries(indorePagesHi)) {
    const text = pageText({ ...page, specs: page.specs ?? [], useCases: page.useCases ?? [] });
    if (MADE.has(slug)) assert.match(text, HI_CLAIM, `${slug} (hi) should say the shop manufactures it`);
    else assert.doesNotMatch(text, HI_CLAIM, `${slug} (hi) must not claim manufacturing`);
  }
});

test("manufacturing-scope pages that claim it also draw the boundary and have matching FAQs in both languages", () => {
  for (const slug of MADE) {
    const en = indorePages[slug];
    const hi = indorePagesHi[slug];
    assert.ok(en.faqs?.length >= 3, `${slug} needs FAQs`);
    assert.equal(hi.faqs?.length, en.faqs.length, `${slug} Hindi FAQ count`);
    assert.ok(en.faqs.some((f) => /manufacture/i.test(f.question)), `${slug} needs a "do you manufacture" FAQ`);
    assert.ok(en.faqs.some((f) => /across India/.test(f.answer)), `${slug} needs the India-wide order sentence`);
  }
  // Concertina and Tata Wiron are supplied, and the page says so.
  assert.match(pageText(indorePages["barbed-wire"]), /Concertina is supplied by us, not made by us/);
  assert.match(pageText(indorePages["barbed-wire"]), /Tata Wiron[^.]*made by Tata/);
  // Wire mesh page limits the claim: other mesh types are stocked.
  assert.match(pageText(indorePages["wire-mesh"]), /stocked and supplied/);
});

test("product SEO copy mentions manufacturing only under barbed-wire and chain-link-fencing", () => {
  for (const file of ["content/productSeoContent.ts", "content/productCopy.ts", "content/hi/productSeo.ts", "content/hi/productCopy.ts"]) {
    const lines = read(file).split("\n");
    let key = "";
    lines.forEach((line, i) => {
      const m = line.match(/^  ["']?([a-z0-9-]+)["']?: \{/);
      if (m) key = m[1];
      if (EN_CLAIM.test(line) || /हम[^।]{0,60}बनाते|निर्माता हैं|बनाता हूँ|हमारा बनाया|हमारी बनाई/.test(line)) {
        assert.ok(
          (manufacturedProductSlugs).includes(key),
          `${file}:${i + 1} claims manufacturing under "${key}"`
        );
      }
    });
  }
});

test("product schema manufacturer is limited to the confirmed families", () => {
  assert.deepEqual([...manufacturedProductSlugs].sort(), ["barbed-wire", "chain-link-fencing"]);
});

test("search-result titles stay within the display budget", () => {
  for (const [slug, p] of Object.entries(indorePages)) {
    const bare = p.title.length;
    assert.ok(bare <= 62, `indore/${slug} title is ${bare} characters`);
  }
  for (const [key, o] of Object.entries(seoOverrides)) {
    assert.ok(o.title.length <= 66, `${key} title is ${o.title.length} characters`);
    if (o.description) assert.ok(o.description.length <= 170, `${key} description is ${o.description.length} characters`);
  }
});

test("internal navigation points at category pages, not filtered /products?category= URLs", () => {
  for (const file of ["components/layout/Footer.tsx", "app/[lang]/brands/page.tsx"]) {
    assert.doesNotMatch(read(file), /\/products\?category=/, `${file} still links to /products?category=`);
  }
});
