#!/usr/bin/env node
/** Lists, per product, the spec-sheet fields the catalogue data does not fill. The counter team fills them once in content/products.ts. */
import path from "node:path";
import { pathToFileURL } from "node:url";
const root = path.resolve(import.meta.dirname, "..");
const { allProducts } = await import(pathToFileURL(path.join(root, "content/products.ts")).href);
const { buildSheet, splitSheetRows } = await import(pathToFileURL(path.join(root, "components/product/specSheet.ts")).href);
const out = [];
for (const p of allProducts) {
  const s = buildSheet({ specs: p.specs, sizes: p.sizes, materials: p.materials, variants: p.variants, useCases: p.useCases, notes: p.notes }, p, null);
  const miss = splitSheetRows(s.rows).unknown.map((r) => r.label);
  const none = s.rows.length === 1 && s.rows[0].key === "details" && s.extras.length === 0;
  if (miss.length || none) out.push({ slug: p.slug, name: p.name, category: p.categorySlug, missing: none ? ["Size, pack and any other detail (nothing on file)"] : miss });
}
if (process.argv.includes("--md")) {
  console.log("| Product | Category | Missing |\n|---|---|---|");
  for (const r of out) console.log(`| [${r.name}](https://www.hmibrahim.net/products/${r.slug}) | ${r.category} | ${r.missing.join("; ")} |`);
} else console.log(JSON.stringify(out, null, 2));
