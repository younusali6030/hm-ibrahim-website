#!/usr/bin/env node
/**
 * Keeps content/lastmod.json honest. For every product, category and Indore page it hashes the content that
 * is shown on the page. When the hash differs from the one on record, the page's date moves to today (India
 * time). When it does not, the date is left alone. app/sitemap.xml/route.ts reads the file, so a page's <lastmod>
 * changes only when its content really changed, not on every deploy.
 *
 *   node scripts/update-lastmod.mjs            update the ledger
 *   node scripts/update-lastmod.mjs --check    list pages whose content changed since the ledger (exit 1 if any)
 *
 * Runs automatically before `npm run build` (see "prebuild" in package.json). Commit the updated ledger.
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = path.resolve(import.meta.dirname, "..");
const ledgerPath = path.join(root, "content", "lastmod.json");
const imp = (p) => import(pathToFileURL(path.join(root, p)).href);

const { allProducts, categories } = await imp("content/products.ts");
const { productCopy } = await imp("content/productCopy.ts");
const { productCopyHi } = await imp("content/hi/productCopy.ts");
const { indorePages } = await imp("content/indorePages.ts");
const { indorePagesHi } = await imp("content/hi/indore.ts");
const { categoryGuides } = await imp("content/categoryGuides.ts");
const { productReference } = await imp("content/productReference.ts");

const seoSource = fs.readFileSync(path.join(root, "content", "productSeoContent.ts"), "utf8");
const reviewLines = fs.readFileSync(path.join(root, "content", "productReviews.ts"), "utf8").split("\n");

const sha = (v) => crypto.createHash("sha256").update(typeof v === "string" ? v : JSON.stringify(v)).digest("hex").slice(0, 12);

/** The hand-written block for a product in productSeoContent.ts, if it has one. */
function handWritten(slug) {
  const start = seoSource.indexOf(`\n  "${slug}": {`);
  if (start === -1) return "";
  const end = seoSource.indexOf("\n  },", start);
  return seoSource.slice(start, end === -1 ? undefined : end);
}

const now = new Date(Date.now() + 5.5 * 3600 * 1000);
const today = process.env.LASTMOD_DATE || now.toISOString().slice(0, 10);

const current = {};
for (const p of allProducts) {
  const taggedBy = reviewLines.filter((l) => l.includes(`"${p.slug}"`));
  current[`products/${p.slug}`] = sha([p, productCopy[p.slug] ?? null, productCopyHi[p.slug] ?? null, handWritten(p.slug), taggedBy, ...(productReference[p.slug] ? [productReference[p.slug]] : [])]);
}
for (const c of categories) {
  current[`categories/${c.slug}`] = sha([
    { slug: c.slug, name: c.name, description: c.description, image: c.image, products: c.products.map((p) => [p.slug, p.name, p.shortDesc]) },
    categoryGuides[c.slug] ?? null,
  ]);
}
for (const [slug, page] of Object.entries(indorePages)) {
  current[`indore/${slug}`] = sha([page, indorePagesHi[slug] ?? null]);
}

const previous = fs.existsSync(ledgerPath) ? JSON.parse(fs.readFileSync(ledgerPath, "utf8")) : {};
const next = {};
const changed = [];
for (const key of Object.keys(current).sort()) {
  const was = previous[key];
  if (was && was.hash === current[key]) next[key] = was;
  else {
    next[key] = { hash: current[key], date: today };
    changed.push(key);
  }
}

if (process.argv.includes("--check")) {
  if (changed.length) {
    console.log(`${changed.length} page(s) changed since the ledger:\n${changed.join("\n")}`);
    process.exit(1);
  }
  console.log("lastmod ledger is current");
} else {
  fs.writeFileSync(ledgerPath, JSON.stringify(next, null, 2) + "\n");
  console.log(`lastmod ledger: ${Object.keys(next).length} pages, ${changed.length} moved to ${today}`);
}
