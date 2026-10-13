import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { allProducts } from "../content/products.ts";
import { compareBrands } from "../components/product/specSheet.ts";
import { telHref } from "../lib/utils.ts";
import { enquiryFields, enquiryText, quoteHrefFor } from "../lib/enquiry.ts";
import { splitGuideTail } from "../content/blog/tail.ts";

const bySlug = (s) => allProducts.find((p) => p.slug === s);
const row = (rows, label) => rows.find((r) => r.label === label);

test("chain link comparison: heights and lengths share one row, none reported missing", () => {
  const rows = compareBrands(bySlug("chain-link-fencing").brandVariants);
  assert.ok(!rows.some((r) => /^Roll height$|^Bundle length$|^Roll length$/.test(r.label)));
  const h = row(rows, "Height");
  assert.deepEqual(h.values, ["3 ft to 10 ft", "3 ft to 10 ft", "4 ft, 5 ft, 6 ft"]);
  const l = row(rows, "Length");
  assert.deepEqual(l.values, ["15 m", "15 m", "15 m and 30 m"]);
  for (const label of ["Opening", "Wire size", "Height", "Length", "Finish"]) assert.ok(row(rows, label).values.every(Boolean), label);
});

test("a difference needs two real values that disagree; uses and absent values never count", () => {
  const rows = compareBrands(bySlug("chain-link-fencing").brandVariants);
  assert.equal(row(rows, "Used for").differs, false);
  assert.equal(row(rows, "Sold by").differs, false); // Tata value absent
  assert.equal(row(rows, "Height").differs, true);
  const differing = rows.filter((r) => r.differs).map((r) => r.label);
  // Only fields whose values really disagree: the old raw-label comparison reported 13.
  assert.deepEqual(differing, ["Opening", "Wire size", "Height", "Length", "Finish", "Pack type", "Material"]);
});

test("barbed wire: gauges, coil weight and finish are normalised, not left as brand-specific labels", () => {
  const rows = compareBrands(bySlug("barbed-wire").brandVariants);
  const labels = rows.map((r) => r.label);
  assert.ok(!labels.includes("Coils") && !labels.includes("Coating") && !labels.includes("Common gauges"), labels.join(", "));
});

test("GI wire: the stocked Tata pack is separate from the catalogue range", () => {
  const v = bySlug("gi-wire").brandVariants[0];
  assert.equal(v.specs.find((s) => s.label === "Stocked configuration").value, "10 kg bundle of 4.0 mm GI farming wire");
  assert.ok(!v.specs.some((s) => /^Gauge$/.test(s.label)), "loose SWG range must not be claimed for the Tata pack");
});

test("every tel: link is the international +91 form", () => {
  for (const n of ["+91 9826053563", "919826053563", "9826053563", "098260 53563"]) assert.equal(telHref(n), "tel:+919826053563");
});

test("enquiry text names the product and the chosen brand and never fills in a size", () => {
  const t = enquiryText({ productSlug: "chain-link-fencing", productName: "Chain Link Fencing", categorySlug: "fencing-material", brandId: "tata", brandName: "Tata Wiron", fields: enquiryFields("mesh") });
  assert.equal(t, "Product: Chain Link Fencing; Brand: Tata Wiron; Required opening: ; Wire diameter: ; Height: ; Quantity: ");
  assert.equal(quoteHrefFor({ productSlug: "chain-link-fencing", categorySlug: "fencing-material", brandId: "tata" }), "/contact?product=chain-link-fencing&category=fencing-material&brand=tata");
  assert.ok(!/brand=/.test(quoteHrefFor({ productSlug: "gi-wire", categorySlug: "wires", brandId: null })));
});

test("guide tail: quote and related-reading blocks leave the body, their guide links and review note are kept", () => {
  const md = "Intro\n\n## One\n\ntext\n\n## FAQs\n\nq\n\n## Request a Quote in Indore / Siyaganj\n\ncta\n\n## Related reading\n\n- [A](/blog/a-guide)\n- [P](/products/x)\n\n*note*";
  const { body, guideSlugs } = splitGuideTail(md);
  assert.ok(!/Request a Quote|Related reading/.test(body));
  assert.deepEqual(guideSlugs, ["a-guide"]);
  assert.ok(body.trimEnd().endsWith("*note*"));
});

test("safety wording: the two audited passages are corrected", () => {
  const tmt = readFileSync(new URL("../content/blog/posts/tmt-bar-weight-chart-size-guide-indore.md", import.meta.url), "utf8");
  assert.ok(!/do not need a weighbridge/i.test(tmt));
  assert.ok(!/cut one metre|measure and mark/i.test(tmt));
  assert.match(tmt, /does not establish the total weight of a truck delivery/);
  assert.match(tmt, /TMT Bar Weight Chart: 6–32 mm/);
  const net = readFileSync(new URL("../content/blog/posts/mosquito-net-types-fibreglass-ss-aluminium-indore.md", import.meta.url), "utf8");
  assert.match(net, /not a child fall-prevention barrier/);
  assert.ok(!/children lean on/i.test(net));
});

test("no guide (English or Hindi) still limits TMT sizes to 8 mm in a 6 mm table", () => {
  for (const dir of ["posts", "posts-hi"]) {
    for (const f of readdirSync(new URL(`../content/blog/${dir}/`, import.meta.url))) {
      const s = readFileSync(new URL(`../content/blog/${dir}/${f}`, import.meta.url), "utf8");
      assert.ok(!/8 mm to 32 mm|8 mm से 32 mm/.test(s), f);
    }
  }
});
