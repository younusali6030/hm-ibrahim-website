# Search-visibility audit: hmibrahim.net

Prepared 12 Oct 2026 on branch `seo/visibility-audit-2026-10` (from `main` at `7ebea98`). Nothing is deployed, pushed, posted or sent.

Companion files: [query-evidence-log.csv](query-evidence-log.csv) · [query-map.md](query-map.md) ·
[product-opportunity-table.md](product-opportunity-table.md) · [offsite-actions.md](offsite-actions.md) · [measurement-plan.md](measurement-plan.md).

## 1. What was and was not available

| Source | Status |
|---|---|
| Google Search Console | **Not connected.** OpenSEO returned `not_connected`, and its project domain is `hmibrahimco.com`, not `hmibrahim.net`. No clicks, impressions, CTR or average position exist in this report. |
| Live SERPs (OpenSEO, DataForSEO) | 35 queries run on 12 Oct 2026. Google, desktop: 28 English and 3 Hindi queries with the city set to Indore through the provider, 3 national queries at country level, and one `site:` query. 206 credits spent, 207 left. |
| Search volumes | Not pulled and not invented. |
| AI answers and citations | **Not inspected.** An AI Overview block appeared on 13 of the 35 SERPs, but the provider returned no text and no sources. No ChatGPT, Perplexity, Gemini or Copilot checks were run. |
| Maps / local finder | Only the local pack embedded in the web SERP. The separate Maps grid was not run. |
| Ads | None returned in the commercial queries. One Search Console promo on the `site:` query. |

Location caveat: "Indore" here is the provider's city setting (code 1007796). It is a controlled simulation, not a phone in Indore, and real
results can differ. National queries carry no city. Each query inspected only 13 to 18 organic rows, so "not seen" never means "not ranking".

## 2. Findings

**F1. The shop never says on the product pages that it manufactures.** Barbed wire, chain link and wire mesh are the shop's made products
(owner, 12 Oct 2026), yet the Indore pages, product pages and metadata all said "we sell" and "we stock". Manufacturing appeared only on About.
In every family tested, the pages that rank carry "Manufacturer" in the title and H1.

**F2. Organic presence is thin; local presence is real.** The own domain appeared in the inspected organic rows for 3 of 35 queries
(brand query rank 2; `/indore/chain-link-fencing-jaali` at rank 13 on the Hindi query and 14 on the "manufacturer" query).
The local pack carried the shop on 9 queries: jali, chain link, perforated sheet, concertina wire, chicken mesh, machhar jali, MS angle, crowbar,
and the Hindi chain link query. Pack listings link to the homepage, not to a product page.

**F3. Directories hold the top of almost every SERP.** IndiaMART and JustDial category pages take most of ranks 1 to 8 for every query tested.
The realistic aim for the website is the manufacturer-intent and specification queries those pages answer poorly, plus the local pack,
not displacing directories on head terms.

**F4. Google was still showing old titles.** For `/indore/chain-link-fencing-jaali` and the product pages in `site:`, the SERP titles and
descriptions are from before the earlier edits (live HTML already has the new ones). `/products?category=*` and `/quote?category=*` URLs from
the old site are still in the index; the site now canonicalises or 308-redirects them. This is a recrawl lag, not a code fault.

**F5. The footer linked to 9 `/products?category=...` URLs on every page.** Those are the parameter URLs Google indexed. The category landing
pages (`/categories/<slug>`) are the pages with their own titles and FAQs.

**F6. Hours conflict is still visible to searchers.** Local pack and JustDial show "Opens 10 am"; site and schema say 9 am. (Open since the GEO pass.)

**F7. Apex domain still has no DNS record.** `dig hmibrahim.net` returns nothing. The Google listing links to the apex.

**F8. Hindi-script queries show little from the own domain.** 3 Hindi queries ran (one per family). One showed the own domain (organic 13, local pack 1 of 3);
the other two (कांटेदार तार, बाइंडिंग तार) did not. The provider errored on those two on the first two attempts and returned data on the third.

## 3. Implemented on the branch

| Change | Files | Why |
|---|---|---|
| Barbed wire, chain link and wire mesh Indore pages: manufacturer title, H1, intro, boundary sentence ("concertina is supplied by us, not made by us"; "expanded metal, mosquito net, SS fine mesh and perforated sheet are stocked and supplied") | `content/indorePages.ts`, `content/hi/indore.ts`, `content/hi/seo.ts` | F1: match the manufacturer intent truthfully and within the confirmed scope |
| 4 visible FAQs per page (manufacture, 12 x 14 explained, weldmesh vs wiremesh, mesh and wire choice, India-wide orders), emitted as FAQPage JSON-LD | same, `app/[lang]/indore/[slug]/page.tsx` | Answers the questions the SERP competitors answer; FAQ text is on the page |
| Product pages for barbed wire and chain link: specification and India-wide titles and descriptions, FAQ "Are you a manufacturer and do you supply across India", "What does 12 x 14 mean", `Product.manufacturer` pointing at the shop's Organization (these two products only) | `content/seoOverrides.ts`, `content/hi/seo.ts`, `content/productSeoContent.ts`, `content/hi/productSeo.ts`, `app/[lang]/products/[slug]/page.tsx` | F1; separates the "Indore manufacturer" page from the "specs and India-wide" page so they do not compete |
| Tata Wiron page title and description now say "dealer" | `app/[lang]/brands/[slug]/page.tsx` | The query is "Tata Wiron dealer Indore"; no result from the site appeared. Wording follows the existing site claim of authorised dealer |
| Footer and brands page link to `/categories/<slug>` instead of `/products?category=<slug>` | `components/layout/Footer.tsx`, `app/[lang]/brands/page.tsx` | F5 |
| `tests/seo.test.mjs` (7 tests): manufacturing wording only for the three confirmed families, in English and Hindi, in Indore and product copy; FAQ parity; title budgets; no parameter links | `tests/seo.test.mjs` | Keeps the claim from drifting |

**Not changed on purpose:** robots.txt (training crawlers stay blocked, search and retrieval crawlers stay allowed), prices (none published),
ratings and reviews schema, the enquiry flow, design, city pages (none added), `/hi` structure.

## 4. Verification

| Check | Result |
|---|---|
| `npx tsc --noEmit` | clean |
| `npm test` | 47 pass, 0 fail (40 existing plus 7 new) |
| `next build` (separate dist dir) | succeeded; all routes generated. First attempt failed on a transient Google Fonts fetch, the retry passed |
| Rendered HTML from the production build (`next start`) | title, description, H1, FAQPage, BreadcrumbList and `Product.manufacturer` as intended on 3 Indore pages, 1 Hindi Indore page, 1 product page and the Tata page; canonicals correct |
| Visual check | FAQ block renders in the existing accordion style (desktop) |
| robots.txt | unchanged; training crawlers blocked |

Not verified: mobile layout of the new FAQ block, Hindi rendering on a phone, anything on the production domain, rich-result validation.

## 5. Remaining gaps

1. Search Console data (queries, CTR, position) is missing. Everything about demand is unknown.
2. 26 of 53 products had no SERP test (credit budget). They are listed in the product table as "Not tested".
3. AI answers and citations were not tested.
4. Owner to confirm which wire mesh types are made in-house (welded GI and MS, woven, crimp, PVC-coated). Until then the manufacturing claim sits on the
   Indore wire mesh page only, not on individual mesh product pages.
5. Spec blocks the competitors show and we do not: binding wire diameter and coil weight, weldmesh panel sizes, expanded metal strand sizes. They need owner data. None was invented.
6. Hours (F6), apex DNS (F7), profile and directory edits (`offsite-actions.md`).
7. Only 3 Hindi queries were run. Hindi forms for the other families (काला तार, सरिया, मच्छर जाली, चादर जाली, कबूतर जाली) are untested.

## 6. Immediate versus slow

- **Immediate when deployed:** titles, H1, FAQs, schema, internal links.
- **Needs recrawl (days to weeks):** new titles and descriptions appearing in results; request indexing for the 8 URLs listed in `offsite-actions.md` section D.
- **Needs time and is not promised:** any organic rank movement. The SERPs are directory-led; success is measured per `measurement-plan.md`.
- **Needs the owner:** hours, DNS, profile edits, spec data, Search Console connection.
