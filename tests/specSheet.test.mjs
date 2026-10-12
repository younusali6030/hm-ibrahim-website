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

test("plastic mesh is never asked for a wire gauge; expanded metal asks for strand thickness", () => {
  for (const slug of ["plastic-hexagonal-poultry-mesh", "square-mesh"]) assert.ok(!sheetOf(slug).rows.some((r) => r.key === "gauge"), slug);
  assert.equal(sheetOf("expanded-metal-mesh").rows.find((r) => r.key === "gauge").label, "Strand thickness");
});

test("values already on file fill their rows: pipe length, rope supply, pigeon net width", () => {
  assert.equal(sheetOf("ms-pipes").rows.find((r) => r.key === "length").value, "6 m");
  for (const slug of ["ms-wire-rope", "gi-wire-rope", "ss-wire-rope"]) assert.match(sheetOf(slug).rows.find((r) => r.key === "pack").value, /metre/);
  assert.equal(sheetOf("pigeon-nets").rows.find((r) => r.key === "size").value, "3 ft to 20 ft");
});

test("owner-selected catalogue: roll, sheet, coil and pack rows are filled and kept separate", () => {
  const row = (slug, key) => sheetOf(slug).rows.find((r) => r.key === key)?.value;
  assert.equal(row("bright-bars", "length"), "6 m");
  assert.match(row("chain-link-fencing", "length"), /^15 m/);
  assert.match(row("gi-wire", "pack"), /5, 10 and 25 kg/);
  for (const slug of ["ms-wiremesh", "gi-wiremesh", "crimp-wiremesh"]) {
    assert.equal(row(slug, "width"), "1.2 m (about 3.94 ft)", slug);
    assert.equal(row(slug, "length"), "15 m", slug);
  }
  assert.match(row("ms-wiremesh", "gauge"), /1\.2 mm on 15 x 15 mm; 1\.6 mm on 25 x 25 mm; 2\.5 mm on 50 x 50 mm/);
  assert.match(row("crimp-wiremesh", "gauge"), /2\.5 mm on 25 x 25 mm; 3\.0 mm on 50 x 50 mm/);
  assert.equal(row("aluminium-wiremesh", "mesh"), "18 x 16 per inch");
  assert.equal(row("aluminium-wiremesh", "width"), "3 ft and 4 ft");
  assert.equal(row("expanded-metal-mesh", "gauge"), "0.5, 1.0 and 1.5 mm");
  assert.equal(row("chicken-net", "gauge"), "0.7 mm");
  assert.equal(row("chicken-net", "length"), "30 m");
  assert.equal(row("plastic-hexagonal-poultry-mesh", "height"), "1.2 m (about 3.94 ft)");
  assert.equal(row("square-mesh", "length"), "25 m");
  assert.equal(row("pvc-coated-weldmesh", "length"), "15 m");
  assert.equal(row("gi-perforated-sheet", "sheet"), "1,220 x 2,440 mm (4 x 8 ft)");
  assert.equal(row("jhatka-machine-fencing-wire", "gauge"), "1.5 mm");
  assert.equal(row("santing-shikanja", "overall"), "600 mm (23.6 in) and 900 mm (35.4 in)");
  assert.equal(row("pigeon-spikes", "size"), "30 cm");
});

test("rope reels: MS and GI 500 m, SS 305 m", () => {
  const pack = (slug) => sheetOf(slug).rows.find((r) => r.key === "pack").value;
  assert.match(pack("ms-wire-rope"), /500 m/);
  assert.match(pack("gi-wire-rope"), /500 m/);
  assert.match(pack("ss-wire-rope"), /305 m/);
});

test("safety net is not described as fall protection", () => {
  const p = allProducts.find((x) => x.slug === "safety-net");
  const text = JSON.stringify(p);
  assert.ok(!/fall protection"?\]|for fall protection/i.test(p.shortDesc + p.useCases.join(" ")), text);
  assert.match(p.specs.find((s) => s.label === "Test certificate").value, /None claimed/);
});

test("held attributes stay off the pages until the maker's spec is on file", () => {
  const all = JSON.stringify(allProducts);
  assert.ok(!/6 x 19|6x19|BTO-22|SS ?304 (wire )?rope|steel core|0\.2 mm radial/i.test(all));
  assert.ok(!/PVC-coated fibreglass mosquito mesh/i.test(all));
});
