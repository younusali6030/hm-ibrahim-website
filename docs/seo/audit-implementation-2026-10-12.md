# Audit implementation record, 12 October 2026

Source: the "Hmibrahim SEO foundation" audit (Phases 1 to 4). This file says what was changed in the repo, what
was deliberately not changed and why, and what only the owner can do. Companion files: `keyword-map.md`,
`measurement-plan.md`, `offsite-actions.md`, `search-console-findings-2026-10-12.md`.

## 1. Findings: status

| # | Finding | Status | What was done |
|---|---|---|---|
| P1 | Apex `hmibrahim.net` does not resolve | **Owner action** | Confirmed again: no A record on the apex, `www` is a CNAME to Vercel. The connected Vercel account has no hmibrahim project, so it cannot be changed from here. Steps in section 4. |
| P1 | `/products/x` and `/indore/x` overlap | Done (structure) | One owner per intent in `localPageForProductSlug` (`content/indorePages.ts`). Product pages keep specification and range; each now links to the Indore page that owns "<product> Indore", and the Indore pages list their products as an `ItemList`. A test fails if a mapped product is not on its owner page. Merge or redirect only after Search Console shows real cannibalisation (section 3). |
| P1 | Vague spec fields ("Ask at counter") | Done (display) / **Owner data** | Placeholder rows are gone. Missing values are listed once as "Confirmed when you ask for the rate: ...". Real values must come from the counter: checklist in section 5. Nothing was invented. |
| P1 | Chain-link dimensions mislabelled | Done | "Roll height" (3 ft to 10 ft) is its own row; "Roll length" and "Pack / roll" are listed as to-confirm because the data has no value. Mesh opening, wire diameter and finish were already separate. |
| P1 | Product schema has no offers, reviews or ratings | Decision: unchanged | Not a defect. Prices are "ask for rate" and the 4.9 / 633 figure is the shop's own rating, so adding `offers` or `aggregateRating` would be false. Product markup now sets `brand` (CM, Border, Tata Wiron) only where the shop stocks that make, plus `material`, `image`, `additionalProperty`, `manufacturer` (barbed wire and chain link only) and `isRelatedTo`. Add `offers` only if a real, maintained price is ever published. |
| P2 | Product reviews headed as product-specific | Done | The block is headed "What buyers say about <product>" only when every review shown names that product. Otherwise it reads "Reviews of our shop", with a line saying how many name the product. |
| P2 | Category FAQs drift | Done | Each category leads with its own buying questions (3 to 4, English and Hindi), then delivery and bulk, then product answers. Fencing opens with chain link vs barbed wire, GI vs PVC, dimensions and quote unit. |
| P2 | Generic H1s ("Angle", "Flats", "Sponge") | Done | MS Angles, MS Flat Bars, MS Channels, GI Pipes, MS Pipes, Plastic Hexa Mesh, Plastic Square Mesh, Concrete Cover Blocks, Construction Sponge. Hindi names kept in step. URLs unchanged. |
| P2 | Sitemap `lastmod` shared by 164 URLs | Done | Per-page dates in `content/lastmod.json`, moved only when a hash of the page's content changes (`scripts/update-lastmod.mjs`, run before every build; `npm run lastmod:check`). Seeded 2026-10-12, which is true: those pages did change that day. Commit the file after each build. |
| P2 | Search snapshots show older titles | **Owner action** | Use URL Inspection, "Test live URL", before changing any title (section 4). |

## 2. Phase 2 and 3 items

| Item | Status |
|---|---|
| Catalogue keyword map | Section 6. Existing ownership rules in `keyword-map.md` stay in force. |
| Category pages: intro, comparison table, local pickup and delivery, 4 to 6 questions, guide links | Done. `content/categoryGuides.ts`, `components/catalog/CategoryGuide.tsx`. The comparison table is built from catalogue data (material, types, use) and the quote *unit* read from the owner's rate note; no price is shown. |
| Quote form: product, quantity and unit, delivery town, pickup or delivery, needed-by date, optional photo or PDF | Done. Product, category and brand are prefilled from the link. Photo: JPG, PNG, WebP or PDF, 3 MB, checked by content, emailed to the shop only. Server action body limit raised to 4 MB in `next.config.mjs`. |
| Enquiries traceable to a landing page | Done. First page and channel (organic:google, direct, referral, utm) are stored per visit and sent with the lead, to the email, CSV and sheet. New sheet columns are appended at the end. |
| Successful enquiries separate from clicks | Done. `quote_request` / `contact_submit` fire only after the server saves the lead, with landing page, channel, product and delivery mode. Clicks on any link to the form fire `click_quote_cta`. Call, WhatsApp and directions clicks were already tracked. |
| Titles, descriptions, URLs | No change needed: titles are within budget (test), descriptions are written per page, URLs are kept. The audit's example titles were not adopted for `/products/*` on purpose: "GI wire supplier Indore" is owned by `/indore/gi-wire`. |
| Product page order | Already close to the recommended order (summary, photos, quote action, specification, uses, reviews, related, overview, buying guide, pricing factors, FAQs). Not reshuffled. |
| Search words (biranji, kheel, hole pass, SS jali) | Added to `content/productAliases.ts`, each from the shop's own reviews or product copy. |
| Schema | See P1 row. FAQ markup kept because the questions are visible; it no longer earns a rich result (Google retired it), so it is low priority. |
| Robots / AI crawlers | Unchanged. Blocking training crawlers does not affect Google Search. |

## 3. Using Search Console (when the export arrives)

1. Export 3 months and the previous 3 months: queries, pages, query by page. Store under `docs/seo/gsc/`.
2. Drop branded queries. Keep query and page pairs with average position 4 to 20 and real impressions.
3. Score: `impressions x achievable CTR gain x qualified-enquiry rate x gross profit per enquiry`. Use stated estimates until the new enquiry columns have data.
4. Two of our URLs for one query: apply the owner map in `keyword-map.md`. If the non-owner page has the impressions, give it a different purpose or fold it into the owner and 301 it, then update links, sitemap and language alternates.
5. Re-measure 4 weeks after the change, same device filter, same window length.

## 4. Owner actions that cannot be done in the repo

1. **Apex domain.** In the Vercel project add `hmibrahim.net` with a permanent redirect to `https://www.hmibrahim.net`, then add the A record Vercel shows at the registrar. Check: `curl -I https://hmibrahim.net/` returns 308 with a `Location` on `www`, path and query kept. Set the Google Business Profile website to the `www` URL.
2. **Search Console.** Resubmit the three sitemaps after deploy; request indexing for the URLs in `offsite-actions.md` section D; re-inspect the five URLs grouped under `747live.bet` after two weeks.
3. **Counter data.** Fill the gaps in section 5.
4. **Named reviewer on technical guides.** E-E-A-T asks for a real person. Give a name and role for the guides on weights, gauges and wire rope, then add it to the guide template. Not invented.
5. **Rates.** Decide whether to publish any maintained price. Until then `offers` stays out of the schema.
6. **Profiles, citations, links.** `offsite-actions.md`.

## 5. Spec data the counter team should supply

One answer per cell, in `content/products.ts` (`specs`). Regenerate this list with `node scripts/spec-gaps.mjs --md`.

| Product | Category | Missing |
|---|---|---|
| [Bright Bars](https://www.hmibrahim.net/products/bright-bars) | structural-items | Length |
| [MS Pipes](https://www.hmibrahim.net/products/ms-pipes) | structural-items | Length |
| [Chain Link Fencing](https://www.hmibrahim.net/products/chain-link-fencing) | fencing-material | Roll length; Pack / roll |
| [MS Wiremesh](https://www.hmibrahim.net/products/ms-wiremesh) | wiremesh | Gauge / wire size; Pack / roll |
| [GI Wiremesh](https://www.hmibrahim.net/products/gi-wiremesh) | wiremesh | Gauge / wire size; Pack / roll |
| [Aluminium Wiremesh](https://www.hmibrahim.net/products/aluminium-wiremesh) | wiremesh | Gauge / wire size; Pack / roll |
| [Crimp Wiremesh](https://www.hmibrahim.net/products/crimp-wiremesh) | wiremesh | Gauge / wire size; Pack / roll |
| [Expanded Metal Mesh](https://www.hmibrahim.net/products/expanded-metal-mesh) | wiremesh | Gauge / wire size |
| [Mosquito Net](https://www.hmibrahim.net/products/mosquito-net) | wiremesh | Gauge / wire size; Mesh / hole size |
| [SS Fine Mesh](https://www.hmibrahim.net/products/ss-fine-mesh) | wiremesh | Gauge / wire size; Mesh / hole size |
| [GI Chicken Mesh (Poultry Mesh)](https://www.hmibrahim.net/products/chicken-net) | wiremesh | Gauge / wire size; Roll length; Pack / roll |
| [Plastic Hexa Mesh](https://www.hmibrahim.net/products/plastic-hexagonal-poultry-mesh) | wiremesh | Gauge / wire size; Roll length; Pack / roll |
| [Plastic Square Mesh](https://www.hmibrahim.net/products/square-mesh) | wiremesh | Gauge / wire size; Roll length; Pack / roll |
| [GI Weldmesh](https://www.hmibrahim.net/products/gi-weldmesh) | welded-mesh | Pack / roll |
| [MS Weldmesh](https://www.hmibrahim.net/products/ms-weldmesh) | welded-mesh | Pack / roll |
| [PVC Coated Weldmesh](https://www.hmibrahim.net/products/pvc-coated-weldmesh) | welded-mesh | Gauge / wire size; Roll length |
| [GI Perforated Sheet](https://www.hmibrahim.net/products/gi-perforated-sheet) | perforated-sheets | Sheet size |
| [MS Perforated Sheet](https://www.hmibrahim.net/products/ms-perforated-sheet) | perforated-sheets | Sheet size |
| [GI Wire](https://www.hmibrahim.net/products/gi-wire) | wires | Pack / coil |
| [Jhatka Wire](https://www.hmibrahim.net/products/jhatka-machine-fencing-wire) | wires | Gauge |
| [MS Wire Rope](https://www.hmibrahim.net/products/ms-wire-rope) | wires | Length / pack |
| [SS Wire Rope](https://www.hmibrahim.net/products/ss-wire-rope) | wires | Length / pack |
| [GI Wire Rope](https://www.hmibrahim.net/products/gi-wire-rope) | wires | Length / pack |
| [Concertina Wire](https://www.hmibrahim.net/products/concertina-wire) | wires | Gauge; Pack / coil |
| [Shikanja](https://www.hmibrahim.net/products/santing-shikanja) | construction-tools | Size, pack and any other detail (nothing on file) |
| [Pigeon Net](https://www.hmibrahim.net/products/pigeon-nets) | safety-nets-equipments | Size |
| [Pigeon Spikes / Bird Spikes](https://www.hmibrahim.net/products/pigeon-spikes) | safety-nets-equipments | Size |
| [Safety Net](https://www.hmibrahim.net/products/safety-net) | safety-nets-equipments | Size |

## 6. Catalogue keyword map

Candidates, not measured volumes. Add "Indore" to purchase terms. One URL per intent; extra wording goes on the owner page, not a new page.

| Product page | Purchase terms | Selection terms |
|---|---|---|
| [ms-angles](https://www.hmibrahim.net/products/ms-angles) | MS angle supplier, steel angle price, 50x50 MS angle | MS angle sizes and weight |
| [ms-flats](https://www.hmibrahim.net/products/ms-flats) | MS flat bar supplier, flat steel bar price | flat bar thickness selection |
| [bright-bars](https://www.hmibrahim.net/products/bright-bars) | bright bar supplier, bright round bar price | bright bar vs black bar |
| [tmt-bars](https://www.hmibrahim.net/products/tmt-bars) | TMT bar dealer, sariya price, 12 mm TMT bar | TMT grade and brand comparison |
| [ms-round-bars](https://www.hmibrahim.net/products/ms-round-bars) | MS round bar supplier, MS rod price | round bar vs bright bar |
| [ms-channels](https://www.hmibrahim.net/products/ms-channels) | MS channel supplier, steel channel price | channel sizes and weight |
| [ms-i-beams-joists](https://www.hmibrahim.net/products/ms-i-beams-joists) | MS beam supplier, steel joist price | I-beam size and weight chart |
| [gi-pipes](https://www.hmibrahim.net/products/gi-pipes) / [ms-pipes](https://www.hmibrahim.net/products/ms-pipes) | GI pipe dealer, MS pipe price | GI vs MS pipe, class and thickness |
| [ms-holepass](https://www.hmibrahim.net/products/ms-holepass) | holepass supplier | holepass dimensions and uses |
| [frp-bars](https://www.hmibrahim.net/products/frp-bars) | FRP bar supplier | FRP vs TMT bars |
| [fiber-mesh](https://www.hmibrahim.net/products/fiber-mesh) | plaster fibre mesh supplier | mesh width for plaster |
| [chain-link-fencing](https://www.hmibrahim.net/products/chain-link-fencing) (local intent: `/indore/chain-link-fencing-jaali`) | chain link fencing supplier, chain link jali price, 6 ft chain link | GI vs PVC, mesh size |
| [barbed-wire](https://www.hmibrahim.net/products/barbed-wire) (local: `/indore/barbed-wire`) | barbed wire supplier, kata taar price per kg | gauge comparison |
| [concertina-wire](https://www.hmibrahim.net/products/concertina-wire) | concertina coil supplier, razor wire | concertina vs barbed wire |
| [ms-wiremesh](https://www.hmibrahim.net/products/ms-wiremesh) / [gi-wiremesh](https://www.hmibrahim.net/products/gi-wiremesh) (local: `/indore/wire-mesh`) | wire mesh supplier, jali price | MS vs GI, woven vs welded |
| [aluminium-wiremesh](https://www.hmibrahim.net/products/aluminium-wiremesh) | aluminium mesh supplier | aluminium vs SS mosquito mesh |
| [crimp-wiremesh](https://www.hmibrahim.net/products/crimp-wiremesh) | crimped wire mesh supplier | opening and wire diameter |
| [expanded-metal-mesh](https://www.hmibrahim.net/products/expanded-metal-mesh) | expanded metal mesh supplier | expanded vs welded mesh |
| [mosquito-net](https://www.hmibrahim.net/products/mosquito-net) | mosquito mesh roll, machhar jali | SS vs aluminium vs fibreglass |
| [ss-fine-mesh](https://www.hmibrahim.net/products/ss-fine-mesh) | SS fine mesh supplier | mesh count and grade |
| [chicken-net](https://www.hmibrahim.net/products/chicken-net) | poultry wire mesh, murga jali | opening selection |
| [plastic-hexagonal-poultry-mesh](https://www.hmibrahim.net/products/plastic-hexagonal-poultry-mesh) / [square-mesh](https://www.hmibrahim.net/products/square-mesh) | plastic hexa mesh, garden mesh roll | plastic vs galvanised; square vs hexa |
| [gi-weldmesh](https://www.hmibrahim.net/products/gi-weldmesh) / [ms-weldmesh](https://www.hmibrahim.net/products/ms-weldmesh) / [pvc-coated-weldmesh](https://www.hmibrahim.net/products/pvc-coated-weldmesh) | welded mesh supplier, weldmesh price | GI vs MS vs PVC |
| [gi-perforated-sheet](https://www.hmibrahim.net/products/gi-perforated-sheet) / [ms-perforated-sheet](https://www.hmibrahim.net/products/ms-perforated-sheet) (local: `/indore/perforated-sheets`) | perforated sheet supplier, chaddar jali price | MS vs GI, hole pattern |
| [gi-wire](https://www.hmibrahim.net/products/gi-wire) (local: `/indore/gi-wire`) | GI wire supplier, Tata Wiron GI wire | gauge in mm, coating |
| [binding-wire](https://www.hmibrahim.net/products/binding-wire) | binding wire supplier, kala taar price, 18 SWG | 16 vs 18 SWG |
| [jhatka-machine-fencing-wire](https://www.hmibrahim.net/products/jhatka-machine-fencing-wire) | jhatka wire supplier | electric-fence wire spec |
| [clutch-wire](https://www.hmibrahim.net/products/clutch-wire) | clutch wire supplier | diameter and construction |
| [ms-wire-rope](https://www.hmibrahim.net/products/ms-wire-rope) / [ss-wire-rope](https://www.hmibrahim.net/products/ss-wire-rope) / [gi-wire-rope](https://www.hmibrahim.net/products/gi-wire-rope) | wire rope supplier | construction, diameter, GI vs SS |
| [wire-rope-clamp](https://www.hmibrahim.net/products/wire-rope-clamp) | rope clamp supplier | clamp size for rope |
| Tools (sr-crowbar, sr-sledge-hammer, sr-hoe-faurdha, sr-pickaxe-geti, santing-shikanja; local: `/indore/construction-hardware`) | sabbal, ghan, faurdha, geti, shikanja supplier | weight and size selection |
| [concrete-cover-block](https://www.hmibrahim.net/products/concrete-cover-block) | cover block supplier | size for required cover |
| [welding-rods](https://www.hmibrahim.net/products/welding-rods) | welding electrode dealer | grade and diameter |
| [sponge](https://www.hmibrahim.net/products/sponge) | grout sponge supplier | grout vs plastering sponge |
| [cutting-discs-grinding-wheels](https://www.hmibrahim.net/products/cutting-discs-grinding-wheels) | cutting disc dealer | cutting vs grinding |
| [fasteners-nails](https://www.hmibrahim.net/products/fasteners-nails) / [roofing-nail](https://www.hmibrahim.net/products/roofing-nail) | wire nail wholesaler, roofing nail price | nail length for the job |
| [pigeon-nets](https://www.hmibrahim.net/products/pigeon-nets) / [pigeon-spikes](https://www.hmibrahim.net/products/pigeon-spikes) | pigeon net supplier, bird spike supplier | net vs spikes |
| [safety-net](https://www.hmibrahim.net/products/safety-net) | construction safety net supplier | specification and certification: from the maker, not from SEO copy |

## 7. 30 / 60 / 90 days: what is left after this change set

| When | Owner | Work |
|---|---|---|
| Day 0 | Developer | Deploy; run `npm test`, `npm run lastmod:check`; commit `content/lastmod.json`. |
| Days 1 to 7 | Owner | Apex redirect (section 4), Search Console baseline, profile fixes. |
| Days 5 to 30 | Counter + editor | Section 5 values for the 28 products. |
| Days 14 | SEO | Re-check SERP titles; URL Inspection on the priority URLs. |
| Days 30 | SEO | First Search Console comparison; decide merges (section 3). |
| Days 31 to 60 | Editor | Refresh six guides; add two anonymised local examples; add the named reviewer. |
| Days 61 to 90 | SEO + owner | Review enquiries by landing page and channel (new sheet columns) against orders and margin. |
