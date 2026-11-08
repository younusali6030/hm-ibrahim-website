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
// The fencing hub (owner facts D-019, 9 Nov 2026) names barbed wire and chain link as made, everything else as supplied.
const MADE = new Set(["barbed-wire", "chain-link-fencing-jaali", "wire-mesh", "fencing"]);
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

test("product SEO copy mentions manufacturing only under the owner-confirmed product slugs", () => {
  for (const file of ["content/productSeoContent.ts", "content/productCopy.ts", "content/hi/productSeo.ts", "content/hi/productCopy.ts"]) {
    const lines = read(file).split("\n");
    let key = "";
    lines.forEach((line, i) => {
      const m = line.match(/^  ["']?([a-z0-9-]+)["']?: (\{|[ch]\()/);
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
  assert.deepEqual([...manufacturedProductSlugs].sort(), ["barbed-wire", "chain-link-fencing", "gi-wiremesh", "ms-wiremesh"]);
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

// TASK-032: one term, one page. A product whose main term is owned by an /indore/* page (it is the first product that
// page lists) keeps "Indore" out of its search title, in both languages, so the two pages do not compete.
test("product titles leave 'Indore' to the Indore page that owns the product's term", () => {
  const owned = ["barbed-wire", "chain-link-fencing", "gi-wire", "pigeon-nets", "gi-perforated-sheet", "ms-perforated-sheet", "mosquito-net", "tmt-bars"];
  const hiFile = read("content/hi/seo.ts");
  for (const slug of owned) {
    const en = seoOverrides[`products/${slug}`];
    assert.ok(en, `products/${slug} needs a hand-written title so the "in Indore" template is not used`);
    assert.doesNotMatch(en.title, /Indore/i, `products/${slug} title targets Indore: ${en.title}`);
    const m = hiFile.match(new RegExp(`"products/${slug}": \\{\\s*title: "([^"]+)"`));
    assert.ok(m, `products/${slug} needs a Hindi title override`);
    assert.doesNotMatch(m[1], /इंदौर/, `hi products/${slug} title targets Indore: ${m[1]}`);
  }
});

test("footer links every Indore landing page", async () => {
  const { indoreLinkOrder, indoreLinkLabels } = await import("../content/indoreLinks.ts");
  assert.deepEqual([...indoreLinkOrder].sort(), Object.keys(indorePages).sort());
  assert.deepEqual(Object.keys(indoreLinkLabels).sort(), Object.keys(indorePages).sort());
  assert.match(read("components/layout/Footer.tsx"), /indoreLinkOrder\.map/);
});

test("Indore match picks the specific page for a product", async () => {
  const { indoreSlugsForProducts } = await import("../content/indorePages.ts");
  assert.deepEqual(indoreSlugsForProducts(["barbed-wire"]), ["barbed-wire"]);
  assert.deepEqual(indoreSlugsForProducts(["gi-weldmesh"]), ["weld-mesh"]);
  assert.deepEqual(indoreSlugsForProducts(["tmt-bars", "chain-link-fencing", "gi-wire"]), ["tmt-bars", "chain-link-fencing-jaali"]);
  assert.deepEqual(indoreSlugsForProducts(["no-such-product"]), []);
  // FRP guide links barbed wire first, but two of its four products belong to the TMT page.
  assert.deepEqual(indoreSlugsForProducts(["barbed-wire", "jhatka-machine-fencing-wire", "frp-bars", "tmt-bars"]), ["tmt-bars", "barbed-wire"]);
});

// TASK-033: the layout's title template must append the same suffix fitTitle() measures, or Hindi titles overrun.
test("root title template uses the measured suffixes", () => {
  const src = read("lib/seo.ts");
  assert.match(src, /template: `%s\$\{hi \? TITLE_SUFFIX_HI : TITLE_SUFFIX\}`/);
});

test("Indore pages pass all their products to the review picker; review ids are unique", () => {
  // productReviews.ts imports "./products" without an extension, which node --test cannot load, so this reads the
  // source; the picks themselves are checked on the built pages (see 13-CHANGELOG, TASK-033).
  assert.match(read("app/[lang]/indore/[slug]/page.tsx"), /<ReviewsList lang=\{lang\} max=\{4\} productSlugs=\{page\.productSlugs\} \/>/);
  const ids = [...read("content/productReviews.ts").matchAll(/id: "(g\d+)"/g)].map((m) => m[1]);
  assert.ok(ids.length > 80);
  assert.equal(new Set(ids).size, ids.length);
});
