# SEO audit: 14 priority products, Indore (12 October 2026)

Site: `https://www.hmibrahim.net` (canonical host, see `docs/seo/REPORT.md` section 3). Codebase: `HM/`.
Builds on the earlier SEO pass (`docs/seo/REPORT.md`, `docs/seo/keyword-map.md`). Nothing was deployed.

## 1. What is verified and what is not

| Item | Status |
|---|---|
| Search volumes | **India-wide, not Indore.** OpenSEO `get_keyword_metrics`, location 2356 (India), 12 Oct 2026. Treat as relative demand only. |
| Keyword difficulty | Returned as 0 to 15 for almost every term; not credible for these queries. Not used for prioritisation. |
| Search Console (clicks, impressions, positions) | **Not connected.** The OpenSEO project is registered to `hmibrahimco.com`, not `hmibrahim.net`, and has no Search Console link. No ranking claim is made. |
| Live Indore SERP and local competitors | **Not researched** (no SERP credits spent). Competitor gaps below are from the catalogue and content, not from a SERP read. |
| Google Business Profile | Not accessed. |
| Terms with no data returned | chaddar jali, phawda, faurdha, geti: the tool returned no row. Absence is not evidence of zero demand. |

## 2. Demand estimate (India-wide monthly searches)

| Term | Volume | Cluster | Primary URL |
|---|---|---|---|
| mosquito net | 201,000 | Mosquito mesh | `/products/mosquito-net` |
| mosquito mesh | 4,400 | Mosquito mesh | `/products/mosquito-net` |
| machhar jali | 3,600 | Mosquito mesh | `/products/mosquito-net` |
| mosquito net roll | 880 | Mosquito mesh | `/products/mosquito-net` |
| aluminium mosquito net | 880 | Mosquito mesh (aluminium) | `/products/mosquito-net` |
| ss mosquito net | 480 | Mosquito mesh (SS) | `/products/ss-fine-mesh` |
| fiberglass mosquito net | 320 | Mosquito mesh (fibreglass) | `/products/mosquito-net` |
| gi mosquito net | 50 | Mosquito mesh (GI) | `/products/mosquito-net` |
| perforated sheet | 8,100 | Perforated sheet | `/indore/perforated-sheets` |
| ss perforated sheet | 1,600 | Perforated sheet (SS) | `/categories/perforated-sheets` |
| aluminium perforated sheet | 1,600 | Perforated sheet (Al) | `/categories/perforated-sheets` |
| ms perforated sheet | 480 | Perforated sheet (MS) | `/products/ms-perforated-sheet` |
| gi perforated sheet | 210 | Perforated sheet (GI) | `/products/gi-perforated-sheet` |
| perforated sheet price | 210 | Perforated sheet | `/indore/perforated-sheets` |
| crowbar | 18,100 | Tools | `/products/sr-crowbar` |
| pickaxe | 12,100 | Tools | `/products/sr-pickaxe-geti` |
| sledge hammer | 9,900 | Tools | `/products/sr-sledge-hammer` |
| sabbal | 1,900 | Tools | `/products/sr-crowbar` |

Tool terms such as "crowbar" and "sledge hammer" are mostly generic or e-commerce searches. The local, counter-buying
intent sits in "<tool> Indore", "<tool> price" and the Hindi names, which this tool does not report for Indore.

## 3. Decisions

1. **No new product pages for SS/aluminium perforated sheet or GI/aluminium/fibreglass mosquito mesh.** The repo holds no
   distinct specifications, sizes or photographs for them, and the brief forbids inventing SKUs, sizes or prices. They are
   covered as material options on the existing mosquito-net, SS fine mesh and perforated-sheet pages (owner confirmed they
   can be supplied). Create separate entries once the data in section 6 is supplied.
2. **No separate agricultural-tools collection.** `construction-tools` plus `/indore/construction-hardware` already serve the
   intent, and the tools are 5 products. A new collection would be thin and compete with them.
3. **No new mosquito-net `/indore/` page.** `/products/mosquito-net` already owns "mosquito net Indore" (keyword map). Its
   title now carries "Machhar Jali" and "Indore".
4. **Chaddar jali = perforated sheet** (punched hole). One intent, one owner (`/indore/perforated-sheets`); the product
   pages carry the material-specific terms. The copy states that it is not expanded metal.

## 4. Issues found and fixed

| Issue | Where | Fix |
|---|---|---|
| Sheet products showed wire labels "Gauge / wire size" and "Roll length / pack" | `components/product/specSheet.ts` (`perforated-sheets` was in `WIRE_CATEGORIES`) | New sheet rows: Thickness, Hole shape / size, Sheet size |
| Tools showed generic "Size / Thickness / Length" rows | same | New tool rows: Brand, Size / weight, Handle |
| All 9 product titles used the one template "<Name> in Indore: Sizes, Uses, Rate" and none carried the market name | `lib/seo.ts` `buildProductMeta` | Now reads `products/<slug>` overrides (EN `content/seoOverrides.ts`, HI `content/hi/seo.ts`) |
| "machhar jali", "chaddar jali", "sabbal", "phawda" absent from titles, H1 area, specs and copy | `content/products.ts`, `content/productCopy.ts`, `content/hi/*` | Added as "Also called" spec, in descriptions, overview and FAQ |
| Mosquito-net data listed only "Stainless steel, Metallic mesh" although fibreglass, aluminium and GI are supplied | `content/products.ts` | Materials, spec and material comparison updated |
| Perforated category and Indore page said "MS and GI" only | `content/indorePages.ts`, `content/hi/indore.ts`, `content/products.ts` | "SS and aluminium on request" added |
| Homepage had no text links to the priority products | `components/home/CategoryShowcase.tsx` | "Often asked for at the counter" link row (9 links) |

Already correct and left alone: canonical host, sitemap with real dates, robots, redirects, Product JSON-LD without
`offers`/rating (sanitised in `lib/schema.ts`), call/WhatsApp/quote tracking (`lib/analytics.ts`, `MobileStickyCTA`,
`ProductDetailClient`), blog guides for mosquito net and perforated sheet, barbed wire and chain link pages (not touched).

## 5. Keyword-to-URL map

See `docs/seo/keyword-map.md` (updated). Status key: **Implemented** = on page and in build output; **Unverified** =
ranking and Indore demand not measured.

## 6. Missing inventory details (needed before new pages or specs)

- Mosquito mesh, per material (fibreglass, aluminium, GI, SS): mesh counts stocked, wire diameter or fibre type, roll
  widths and lengths, colours (fibreglass is often grey or black; confirm), and a real photo of each roll.
- SS fine mesh: grade (304 or 316), mesh counts, roll width and length.
- Perforated sheet, per material (MS, GI, SS, aluminium): thicknesses actually stocked, hole sizes and pitches, standard
  sheet sizes (for example the stocked length x width), whether cut-to-size has a minimum, and photos of SS and aluminium
  sheet.
- Tools: weights and lengths of crowbar, pickaxe and hoe blade; sledge head weights per size (5M, 10M, 15M are a
  shop code; confirm kg); handle material and length for the hoe with handle; real photos if current ones are not
  of stocked items.
- Opening hours, phone numbers and address are taken from `content/site.ts` unchanged.

## 7. Search Console next steps (when access exists)

1. Add `https://www.hmibrahim.net` as a property in OpenSEO or share access; correct the project domain.
2. After deploy: request indexing for the 9 product URLs, `/indore/perforated-sheets` and `/categories/perforated-sheets`.
3. Baseline 28 days of queries per page for: machhar jali, mosquito mesh, chaddar jali, perforated sheet, sabbal,
   phawda, geti, faurdha (including Hindi script). Filter country India, then check Indore in the city report if available.
4. After 4 to 6 weeks compare impressions, CTR and position per page. Watch for two pages sharing one query
   (`/products/ms-perforated-sheet` against `/indore/perforated-sheets`, `/products/ss-fine-mesh` against `/products/mosquito-net`).
5. Confirm GA4 key events (call, WhatsApp, quote) fire on these pages; `NEXT_PUBLIC_GA_ID` must be set in production.
