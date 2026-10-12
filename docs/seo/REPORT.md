# SEO and GEO report: hmibrahim.net

Prepared 12 October 2026. Scope: technical, structured data, local, content, AI-answer readiness.
Baseline tag: `baseline-pre-evolution`. Crawl evidence: `localhost:3001` (the running prod build, before) and a
scratch build of the new code (after). No credits were spent on OpenSEO, nothing was deployed or posted.

## 1. Score table

Rubric: ten areas, 0 to 10 each, scored from what the crawl and the code show. "Shipped" is what is committed
now. "With handoff" assumes the design agent applies `docs/seo/handoff-to-design.md` and the OG PNGs exist.

| Area | Before | Shipped | With handoff | Evidence |
|---|---|---|---|---|
| Crawl and indexing (robots, status codes, redirects) | 8 | 9 | 9 | Success page and `/api/` now disallowed; 404s correct; 9 redirects intact |
| Canonical host consistency | 8 | 8 | 9 | All canonicals, sitemap, schema on `https://www.hmibrahim.net`; apex-to-www is a Vercel setting, not visible in code |
| Sitemaps | 4 | 9 | 9 | Was `new Date()` on all 103 URLs, no image or video sitemap. Now real dates, plus image and video sitemaps, listed in robots |
| Titles and descriptions | 5 | 7 | 9 | Blog, product, Indore fixed. Home (78 / 203 chars), products, services, indore index, categories still own metadata |
| Structured data validity | 5 | 8 | 9 | Fake `Offer` InStock on 53 products, `sku` and `mpn` equal to URL slug, `speakable`, `priceRange`, unverified `paymentAccepted`, Brand with brand removed |
| Local SEO and NAP | 7 | 8 | 8 | NAP identical on site and schema; business-name variants remain (see 5) |
| Content depth and uniqueness | 4 | 8 | 8 | 53 of 53 products now have specific copy; before, 6 had it and the rest shared a template |
| Internal linking | 5 | 7 | 8 | Guides linked from at least one product page: 8 of 24 to 24 of 24 (each of 53 products links 2 to 3); guides linking to other guides: 0 to 24; guides linking to `/indore/*`: 16 |
| GEO / AI answer readiness | 4 | 7 | 8 | `llms.txt`, quick-answer blocks on 13 guides, tables kept, "Last verified" dated lines |
| Social previews (OG) | 3 | 5 | 8 | Home had no og:image; every page used the logo. Template wiring done; PNGs not yet generated |
| **Total /100** | **53** | **76** | **85** | |

## 2. What changed (all committed)

Technical
- `app/sitemap.ts`: real `lastModified` (blog frontmatter `updated`, else `date`; static dates in `lib/contentDates.ts`).
  Removed `changeFrequency` and `priority` (Google ignores both). Indore slugs now come from `content/indorePages.ts`.
- `app/sitemap-images.xml/route.ts` and `app/sitemap-videos.xml/route.ts`: image sitemap (products and posts) and
  video sitemap (12 reels, brand walkthrough, product clips, blog loops). Next 14.2 sitemap metadata does not support
  image or video fields, so these are route handlers. Both are listed in `robots.txt`.
- `app/robots.ts`: disallows `/api/` and `/contact/success`, lists all three sitemaps.
- `lib/seo.ts`: title budget (about 60 characters, never cut mid-word), description trimmed at a word, canonical
  always `www`, OG image from `/og/<type>.png` with safe fallback, path-based overrides from `content/seoOverrides.ts`.
- `next.config.mjs`: no change needed. No URL was changed or removed, so no new 301 is required.

Structured data (`lib/schema.ts`, `components/SeoJsonLd.tsx`, `components/JsonLd.tsx`, `components/JsonLdBreadcrumb.tsx`)
- Global graph: Organization (`/#organization`), HardwareStore + LocalBusiness (`/#localbusiness`), WebSite (`/#website`).
  Opening hours Mon to Sat 09:00 to 20:00 (Sunday omitted = closed). `sameAs`: IndiaMART, JustDial (tracking
  parameter stripped), Google Maps profile. Social fields are empty in `content/site.ts` so none are emitted.
- Every page-level node passes through `sanitizeJsonLd()`: strips `offers`, `sku`, `mpn`, `speakable`,
  `aggregateRating`, `review`; replaces duplicated LocalBusiness and Organization fragments with `@id` references;
  fixes `Brand.brand`; BlogPosting author and publisher become `@id` references.
- `script` output escapes `<`.

Local and content
- `content/indorePages.ts`: removed the non-existent `ss-gi-mesh-jalies` slug, corrected specs to match the catalog,
  rewrote six pages with one keyword each (see `keyword-map.md`).
- `content/productCopy.ts` (new) plus `content/productSeoContent.ts`: specific overview, uses, buying guide,
  pricing drivers (no prices) and 2 to 4 FAQs for all 47 products that had only a template; category-specific
  "why us" and three service-area variants so no two pages share a paragraph.
- 13 guides got a quick-answer box, 24 got "Related reading" (posts, `/indore/*`, products), first-person shop
  voice replaced "Siyaganj suppliers". `perforated-sheets-ms-vs-ss-applications` title now says MS vs GI, which is what it covers.
- `public/llms.txt` created.

## 3. Canonical host: finding

`lib/site.ts` sets `PRODUCTION_URL = "https://www.hmibrahim.net"`. Commit `fd3052e` ("canonical host fix") moved
everything to it, and `DEPLOY.md` tells the owner to add `www.hmibrahim.net` in Vercel. Sitemap, robots, canonicals,
OG and JSON-LD all use `www`. There is no host redirect in `next.config.mjs`.

So the brief's "hmibrahim.net" is the brand domain, not a mismatch in code: **canonical is `www.hmibrahim.net`**.
Not flipped. I did not add an apex-to-www redirect in `next.config.mjs`: if the Vercel domain settings already
redirect `www` to apex, a second rule would loop. Verify in Vercel (NEEDS YOU, item 1).

## 4. Structured data matrix (verified by structure from a crawl of 103 URLs)

| Page type | Types emitted | Valid | Notes |
|---|---|---|---|
| Every page | Organization, HardwareStore+LocalBusiness, WebSite (one `@graph`) | yes | stable `@id`s |
| Home | FAQPage | fix | schema lists 6 questions, page shows 4 (handoff P1-4) |
| Product (53) | BreadcrumbList, Product, FAQPage | yes | no Offer, no rating; FAQs visible on page |
| Category (9) | BreadcrumbList, ItemList, FAQPage | yes | FAQ text is templated (handoff P1-5) |
| Indore landing (6) | BreadcrumbList | yes | ItemList available (handoff P2-1) |
| Blog index | Blog (+BlogPosting list), BreadcrumbList | yes | |
| Blog post (24) | BlogPosting, BreadcrumbList, FAQPage (19 of 24 have FAQs), VideoObject (7) | yes | FAQs are visible markdown |
| Brand (2) | Brand | yes | add VideoObject (handoff) |
| About / Contact | AboutPage / ContactPage with `mainEntity` as `@id` | yes | |
| Products index | ItemList of 30 of 53 | partial | handoff P2-1 |

Removed as invalid or spammy: `Offer` with `availability: InStock` and no price (all products), `sku`/`mpn`
copied from the slug, `speakable` on products, `priceRange: "$$"` (invented), `paymentAccepted` (not stated on any
page), `SearchAction` (sitelinks search box is retired), query-string `OfferCatalog` URLs.
Deliberately not added: AggregateRating or Review for the 4.9 / 633 Google figures. Self-serving ratings on a
LocalBusiness are not eligible for rich results, and the figures stay visible on the page.

## 5. Local SEO

NAP as it must appear everywhere:

- Name: H M Ibrahim & Co (see naming issue below)
- Address: 60, Siyaganj Main Road, Opp. Tijori Gali, Siyaganj, Indore, Madhya Pradesh 452007
- Phone: +91 98260 53563 (alternate +91 99930 78654)
- Hours: Monday to Saturday 9:00 AM to 8:00 PM, Sunday closed

Checked on `/contact`, footer and schema: address, hours and phone match. Landmark "Opp. Tijori Gali" present.

Issues:
1. **Business name is written four ways**: "HM Ibrahim & Co" (titles, schema `name`), "H M Ibrahim & Co" (page text, GBP
   style), "H.M. Ibrahim & Co." (product copy), and the legal name "H Mohammed Husain HM Ibrahim & Co". JustDial reads
   "H Mohd Husain H M Ibrahim & Co" and the IndiaMART URL uses "Mohhusain Haji HM Ibrahim and Company". Pick one display name
   and use it on GBP, JustDial, IndiaMART and the site.
2. About page meta says "four generations of leadership"; the brief and a customer review say third generation. Owner to confirm.
3. No `geo` coordinates in schema: not invented. Owner can supply from the GBP pin.

GBP alignment checklist: primary category "Hardware store" (or the closest the owner already uses); secondary
"Wire products supplier", "Steel fabricator" only if true; description with the same wording as `llms.txt`;
hours identical; products list mirroring the `/indore/*` pages; Q and A seeded from the product FAQs; photos from `/blog` and `/products`.

Citation consistency list (each must carry the NAP above, same name, and link to `https://www.hmibrahim.net`):

| Directory | Status | Action |
|---|---|---|
| Google Business Profile (cid 13885147699571790648) | exists, 4.9 stars, 633 reviews | align per checklist |
| IndiaMART | URL in `content/site.ts` | check name, address, website field |
| JustDial | URL in `content/site.ts` | check name, address, hours |
| Instagram | handle unknown, `site.social.instagram` is empty | NEEDS YOU: real URL |
| Facebook, LinkedIn, X | empty | NEEDS YOU: only if they exist |
| Bing Places, Apple Business Connect | unknown | claim and match |
| Sulekha, TradeIndia, ExportersIndia | unknown | search for duplicates, merge |

## 6. Core Web Vitals budget (mobile, 75th percentile)

Targets: LCP 2.5 s or less, INP 200 ms or less, CLS 0.1 or less.

| Page type | LCP element | HTML now | Budget: HTML | Budget: JS (gzip) | Budget: images above fold | Main risk |
|---|---|---|---|---|---|---|
| Home | hero image (not logo) | 138 KB | 100 KB | 170 KB | 1 image, 150 KB WebP | wordmark logo preloaded `fetchpriority=high`; 4 font files; reels `preload="none"` is correct |
| Products index | first product card row | 257 KB | 150 KB | 150 KB | 4 cards lazy after the first row | 53 cards server-rendered with long text |
| Product | main gallery image | 118 KB | 90 KB | 150 KB | 1 image, 120 KB | FAQ and content in `<details>` is fine; related products below the fold |
| Category | first product image | 118 KB | 90 KB | 130 KB | 1 image | FAQ accordion |
| Indore landing | hero image | 71 KB | 70 KB | 120 KB | 1 image | none |
| Blog post | hero image (`priority`) | 111 KB | 90 KB | 130 KB | 1 hero, others lazy | MP4 loop must keep `preload="none"` and a poster |
| Contact | heading text | 50 KB | 50 KB | 140 KB | none | quote form hydrate; keep the form deferred |

Measurement still needed (not possible from curl): run PageSpeed or CrUX for the six types above after the next deploy.

## 7. Ranked backlog

Done in this pass are marked [done].

| # | Item | Impact | Effort | Owner |
|---|---|---|---|---|
| 1 | Verify apex-to-www redirect and one canonical host in Vercel and Search Console | high | 10 min | owner |
| 2 | Apply handoff P1-1 to P1-5 (home, index pages, categories, layout og, home FAQ) | high | 2 h | design |
| 3 | Generate `public/og/*.png` per `og-image-plan.md` | medium | 2 h | design |
| 4 | Align GBP, JustDial, IndiaMART to the one NAP and name | high | 2 h | owner |
| 5 | Submit the three sitemaps in Search Console and Bing Webmaster Tools; inspect `/indore/*` and top products | medium | 30 min | owner |
| 6 | Add real social URLs to `content/site.ts` once known (schema `sameAs` picks them up) | low | 5 min | owner |
| 7 | Real photos for channels, I-beams, sponge, MS and aluminium wiremesh (borrowed images today) | medium | 1 day | owner |
| 8 | Build `/brands/tata` page for "Tata Wiron Indore" | medium | 3 h | design + SEO |
| 9 | Rank tracking for the 12 head terms in `keyword-map.md` and local grid for Siyaganj | medium | credits | SEO (needs approval) |
| 10 | Make `ReelsSection` read `content/reels.ts`; add VideoObject schema | medium | 1 h | design |
| 11 | Decide whether `/catalog` should be indexed | low | 15 min | owner |
| 12 | Review the 6 hand-written product pages (angles, flats, TMT, GI pipes, chain link, barbed wire) for the same shop voice | low | 2 h | SEO |

Weeks-long off-site work (no code):

- Weeks 1 to 2: GBP clean-up and weekly posts, ask every walk-in and WhatsApp customer for a Google review (the 633 reviews are the main local asset),
  reply to every review, upload 10 real photos of stock and the shopfront.
- Weeks 2 to 4: fix citations (table above), claim Bing Places, remove duplicate listings.
- Weeks 3 to 6: 5 to 10 local links: Indore builders' and contractors' associations, fabricators the shop supplies, Madhya
  Pradesh farm fencing suppliers, local news "heritage business" story (1939 is a real hook), Tata Wiron dealer locator.
- Weeks 4 to 8: one short reel per week, each embedded on a product page with a transcript sentence, also posted to YouTube Shorts and Instagram with the site URL.
- Weeks 6 to 12: ask contractors and architects the shop supplies for a named testimonial on their own site; publish one new guide per fortnight from questions asked at the counter (use the quote form's product field as the topic list).

## 8. NEEDS YOU

1. Confirm in Vercel which host is primary and that the other 308-redirects to it. Code says `www.hmibrahim.net`.
2. Real social profile URLs for `content/site.ts` (`instagram`, `facebook`, `linkedin`, `twitter`). Left empty, not guessed.
3. One business display name to use everywhere (see section 5).
4. Third generation or four? About page meta says four.
5. Latitude and longitude of the shop pin from the GBP, if `geo` should be added.
6. Whether Tata Wiron should get its own `/brands/tata` page.
7. `products.ts` carries `indicativeRate` strings ("Approx. 52 to 62 per kg ...") used only in the catalog email. The rule is
   "ask for the rate". Confirm the owner is comfortable with those figures leaving the building, or remove them.
8. Confirm payment methods (cash, bank transfer, UPI): if true, `paymentAccepted` can go back in the schema.
9. Approval for a credit batch if rank tracking and keyword volumes are wanted (estimate first).
10. `content/site.ts` still holds `priceRange: "$$"`. Unused now; delete it when convenient.
