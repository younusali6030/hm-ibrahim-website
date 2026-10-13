# Live-site audit (13 Oct 2026): implementation record

Scope: every item of the audit that could be fixed from the repository. Nothing was deployed, no lead was submitted.

## Completed

| Audit item | What changed | Where |
|---|---|---|
| Product page order | Breadcrumb, H1, one-line description, shop-rating line, compact photo, brand selector, key rows, enquiry buttons, full specs and comparison, uses, guidance, FAQs, 3 shop reviews, one related products and guides block. Duplicate related section and trust block removed. | `components/product/ProductDetailClient.tsx`, `app/[lang]/products/[slug]/page.tsx`, `components/ProductSeoContent.tsx` |
| Comparison fields | Labels map to common fields (Opening, Wire size, Height, Length, Finish, Type, Pack weight, Pack type, Sold by). A difference needs two real values that disagree. Chain link now reports 7 real differences, not 13, and Tata height/length share a row with CM/Border. Brands page uses the same normaliser. | `components/product/specSheet.ts` (`compareBrands`), `ProductBrandPicker.tsx`, `app/[lang]/brands/page.tsx` |
| Enquiry context | One shared record builds every quote link and WhatsApp text: product, brand only if the visitor picked one, blank size fields. Header, mobile sticky bar, page buttons, closing links, closing band. No brand or size is preselected. On `/contact` the sticky quote action focuses the form. | `lib/enquiry.ts`, `lib/enquiryStore.ts`, `MobileStickyCTA`, `Navbar`, `ClosingBand`, `ContextQuoteLinks` |
| Telephone links | All `tel:` links are `tel:+91XXXXXXXXXX` via `telHref`. | `lib/utils.ts` and 12 callers |
| Contact form | Product/list, quantity, name, phone, submit first. Delivery, customer type, needed-by, email, attachment sit in a collapsed "Add delivery details or a drawing (optional)" section that stays mounted (values and file kept) and opens itself on an error. | `app/[lang]/contact/QuoteForm.tsx` |
| Indore map | The route embed is driving mode only through the official Maps Embed API; without the key the embed shows the shop and the route opens in Google Maps in driving mode. Location is requested only on "Use my location". Decorative rings and town labels confined to the illustration side (faint graticule only when stacked). Founding year is static. Visit block now precedes the city strip. | `components/indore/IndoreHero.tsx`, `indore.css`, `lib/maps.ts`, `app/[lang]/indore/page.tsx` |
| Mosquito net guide | Child-fall answer replaced with the audit wording; SS absolutes made grade-dependent; GI readers sent to the mosquito-net page instead of the 15-100 mm mesh. | `content/blog/posts/mosquito-net-...md` |
| TMT weight guide | Weighbridge sentence, cut-and-mark step and "sample settles it" wording removed; audit introduction added; title and all "8 mm to 32 mm" strings now 6-32 mm; dates labelled Published / Updated. English and Hindi. | guide, `seoOverrides.ts`, `faqs.ts`, Hindi catalog |
| Product data | Concertina "Opened length per coil"; FRP length and weight split and not tied to the whole diameter range; weldmesh openings from one list with roll and panel rows; GI wire Tata stocked pack separated from the Tata catalogue range; Tata chain link stocked configuration first; CM/Border pack "Roll"; SR hammer size marking not called weight; clamp "Lifting" use and rating removed; safety net named as debris containment; MS pipes round NB and square tube separate rows; mesh count noted as wires per inch. English and Hindi. | `content/products.ts`, `productCopy.ts`, `content/hi/*` |
| Schema and attribution | Multi-make families (chain link, barbed wire) carry no blanket manufacturer; each make is a `hasVariant` Product with its own brand and maker. Visible text matches. No offers or product ratings. | `app/[lang]/products/[slug]/page.tsx` |
| Authorisation scope | Tata steel is "available on request"; the authorised-dealer wording stays on Tata Wiron wire and fencing only. | `stockedBrands.ts`, `site.ts`, product copy, Hindi |
| Layouts | Products hero 414 px at 1440x900 (was 580+); blog hero compact and topic chips on one scrolling row, first article title at about 720 px at 390 px (was about 830); card summaries via `cardTag`; category "Used for" filled from each product's own description. | `ProductsHero.tsx`, `blog/page.tsx`, `BlogTopicChips.tsx`, `BlogLibrary.tsx`, `ledger.ts` |
| Articles | Guide-written "Request a Quote" and "Related reading" blocks lifted out of the body; their guide links fill one row of three guides; the duplicate "Buying this in Indore?" strip removed; one product block and one closing call to action. Barbed-wire guide no longer puts the razor close-up under the barbed-wire section. | `content/blog/tail.ts`, `app/[lang]/blog/[slug]/page.tsx` |
| Technical guides | Edits to nails, cover blocks, fibre mesh, expanded metal, pigeon net, pigeon spikes, storage, bulk buying, FRP vs TMT, farm fencing, wire gauge, perforated sheets, wire mesh supplier, GI vs MS wire, TMT choice. Hindi editions kept in step. "Last verified" replaced by an honest catalogue-check note. | `content/blog/posts*/` |
| Promises | Home promise replaced; "while you wait" removed; services page has one four-step process and a cut-to-size list generated by the same rule as the product stamp. | `HomeHero.tsx`, `StockReel.tsx`, `services/page.tsx` |
| Hindi | English-only guides link straight to English, are labelled "अंग्रेज़ी में उपलब्ध", and their Hindi URL carries a notice, noindex and an English canonical. | `PostCard.tsx`, `BlogLibrary.tsx`, `ProductSeoContent.tsx`, blog page |

## Verified

`npm test` 81 pass (9 new in `tests/liveAudit.test.mjs`); `npm run lint` 0 errors (12 existing warnings, unchanged); `next build` passes; production server: canonicals self-referencing, schema variants as above, no `offers` or `aggregateRating`; tel links all `+91`; product page at 390 px has no horizontal overflow; contact form order and prefill checked in the browser.

## Not done: needs the owner or an external check

1. **Authorised test lead** to confirm email/Sheet delivery (not submitted here).
2. **Google Maps Embed key** (`NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY`): needed for an in-page driving route. The Dewas route against live Google was not run.
3. Values the data does not hold, left as "confirmed with the rate": concertina razor/barbed construction; MS wiremesh woven or welded; clutch wire diameter, length, end fitting; wire rope clamp rope-diameter range per size; SR hammer head weight; FRP rod diameter behind each weight; weldmesh wire diameter for other openings; SS fine mesh and aluminium wire diameter and aperture.
4. **Documents**: Tata steel dealer authorisation; Tata Wiron authorisation scope; who technically reviewed each guide (the TMT sampling procedure still needs an engineer's sign-off before it is added back); a real anonymised quote comparison for the bulk-buying guide.
5. **Photography**: a round MS pipe photo (the only round image is a stock illustration); real photos for products that lack one.
6. **Translation**: 16 guides have no Hindi edition; they stay English-only and noindex until translated.
7. **Search Console**: re-inspect `/products`, `/indore/gi-wire`, `/products/ms-wire-rope`, `/blog/top-hardware-contractors-buy-siyaganj` after recrawl.
8. Product and quantity are first on the form but not required fields (the existing "just call me" path is kept).
