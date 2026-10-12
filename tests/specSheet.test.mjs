import test from "node:test";
import assert from "node:assert/strict";
import { allProducts } from "../content/products.ts";
import { buildSheet, sheetKind, trimRepeatedPacking } from "../components/product/specSheet.ts";

const sheetOf = (slug) => {
  const p = allProducts.find((x) => x.slug === slug);
  assert.ok(p, slug);
  return buildSheet(
    { specs: p.specs, sizes: p.sizes, materials: p.materials, variants: p.variants, useCases: p.useCases, notes: p.notes },
    { slug: p.slug, categorySlug: p.categorySlug },
    null
  );
};
const labels = (s) => [...s.rows, ...s.extras].map((r) => r.label);

test("binding wire: gauge, pack, material, finish, availability; no mesh / hole size", () => {
  const s = sheetOf("binding-wire");
  assert.equal(s.kind, "wire");
  assert.ok(!labels(s).some((l) => /mesh|hole/i.test(l)), labels(s).join(", "));
  const by = Object.fromEntries(s.rows.map((r) => [r.key, r.value]));
  assert.equal(by.gauge, "16–18 SWG");
  assert.match(by.pack, /50 kg/);
  assert.equal(by.material, "Annealed mild steel");
  assert.equal(by.finish, "Black, annealed");
  assert.ok(s.rows.some((r) => r.key === "availability"));
});

test("binding wire: pack line and gauges are not repeated in the extras", () => {
  const s = sheetOf("binding-wire");
  const text = s.extras.map((e) => `${e.label}: ${e.value}`).join(" | ");
  assert.ok(!/packing/i.test(text), text);
  assert.ok(!/16 SWG/.test(text), text);
});

test("no single-wire product offers a mesh row; every mesh keeps one", () => {
  for (const slug of ["gi-wire", "barbed-wire", "clutch-wire", "concertina-wire", "jhatka-machine-fencing-wire"]) {
    assert.ok(!sheetOf(slug).rows.some((r) => r.key === "mesh"), slug);
  }
  for (const slug of ["gi-weldmesh", "ms-wiremesh", "chain-link-fencing"]) {
    assert.ok(sheetOf(slug).rows.some((r) => r.key === "mesh"), slug);
  }
});

test("perforated sheet is sold by thickness, hole and sheet size, never gauge or roll", () => {
  const s = sheetOf("gi-perforated-sheet");
  assert.equal(s.kind, "sheet");
  assert.deepEqual(s.rows.slice(0, 3).map((r) => r.key), ["thickness", "hole", "sheet"]);
});

test("solid bars do not ask for a wall thickness", () => {
  for (const slug of ["tmt-bars", "bright-bars", "ms-round-bars"]) assert.ok(!sheetOf(slug).rows.some((r) => r.key === "thickness"), slug);
  assert.ok(sheetOf("ms-angles").rows.some((r) => r.key === "thickness"));
});

test("a spec value shown in a row is not listed again", () => {
  for (const p of allProducts) {
    const s = sheetOf(p.slug);
    const seen = new Set();
    for (const r of [...s.rows, ...s.extras]) {
      if (!r.value) continue;
      const k = r.value.toLowerCase();
      assert.ok(!seen.has(k), `${p.slug}: "${r.value}" appears twice`);
      seen.add(k);
    }
  }
});

test("every product shows something in its spec sheet", () => {
  for (const p of allProducts) {
    const s = sheetOf(p.slug);
    assert.ok(s.rows.length + s.extras.length > 0, p.slug);
  }
  assert.equal(sheetKind({ slug: "pigeon-nets", categorySlug: "safety-nets-equipments" }), "net");
});

test("trimRepeatedPacking removes only a trailing packing sentence", () => {
  const n = "Specifically designed for RCC tying work. Packing: coils up to 50 kg (varies by gauge and stock).";
  assert.equal(trimRepeatedPacking(n, true), "Specifically designed for RCC tying work.");
  assert.equal(trimRepeatedPacking(n, false), n);
  assert.equal(trimRepeatedPacking("Packing: coils up to 50 kg (varies).", false), "Packing: coils up to 50 kg (varies).");
});
