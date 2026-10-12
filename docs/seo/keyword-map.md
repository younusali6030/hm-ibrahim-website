# Keyword map: one term, one page

Rule: each head term belongs to exactly one URL. Other pages may mention it, link to the owner with the term
as anchor text, and rank for long-tail variants, but their title and H1 do not target it.
Search volumes were not pulled (no OpenSEO credits spent). Terms come from the shop's own language: product names,
reel titles and customer reviews.

| Head term (and spellings) | Owner URL | Supporting pages that link to the owner |
|---|---|---|
| wire mesh Indore, wiremesh Indore, welded wire mesh Indore | `/indore/wire-mesh` | `/blog/wire-mesh-supplier-indore-types-uses-prices`, `/categories/wiremesh`, `/categories/welded-mesh` |
| jali Indore, jaali Indore, chain link jali, jali for compound wall | `/indore/chain-link-fencing-jaali` | `/blog/welded-wire-mesh-vs-chain-link`, `/products/chain-link-fencing`, brand pages |
| weldmesh jali, welded mesh panel | `/products/gi-weldmesh` (GI), `/products/ms-weldmesh` (MS) | `/categories/welded-mesh`, `/indore/wire-mesh` |
| expanded metal jali | `/products/expanded-metal-mesh` | `/blog/expanded-metal-mesh-uses-types-indore` |
| TMT bars Indore, sariya Indore, Fe 500 / Fe 500D | `/products/tmt-bars` | `/blog/how-to-choose-tmt-bars-indore`, `/blog/tmt-bar-weight-chart-size-guide-indore` |
| TMT bar weight chart | `/blog/tmt-bar-weight-chart-size-guide-indore` | `/products/tmt-bars` |
| barbed wire Indore, kata taar Indore | `/indore/barbed-wire` | `/products/barbed-wire`, `/blog/barbed-wire-vs-concertina-wire` |
| concertina wire Indore | `/products/concertina-wire` | `/indore/barbed-wire`, `/blog/barbed-wire-vs-concertina-wire` |
| barbed wire vs concertina | `/blog/barbed-wire-vs-concertina-wire` | |
| perforated sheet Indore, perforated sheet price | `/indore/perforated-sheets` | `/categories/perforated-sheets`, `/products/gi-perforated-sheet`, `/products/ms-perforated-sheet` |
| perforated sheet hole pattern, open area | `/blog/perforated-sheet-hole-patterns-open-area-guide` | |
| GI wire Indore, galvanised wire | `/indore/gi-wire` | `/products/gi-wire`, `/blog/gi-wire-vs-ms-wire-binding-fencing` |
| binding wire Indore, kala taar, annealed wire | `/products/binding-wire` | `/indore/gi-wire`, `/blog/wire-gauge-chart-swg-bwg-mm-guide` |
| wire gauge chart, SWG to mm | `/blog/wire-gauge-chart-swg-bwg-mm-guide` | |
| Tata Wiron Indore | `/brands` (see note 1) | `/products/gi-wire`, `/products/barbed-wire` |
| CM brand, Border brand fencing | `/brands/cm`, `/brands/border` | `/brands` |
| Siyaganj iron market, Loha Mandi Indore | `/blog/siyaganj-market-guide-buying-iron-hardware-indore` | `/indore`, `/blog/how-bulk-buyers-save-cost-loha-mandi-indore` |
| iron and hardware Indore (broad) | `/indore` | `/` (brand and shop name only) |
| construction hardware Indore, geti, faurdha | `/indore/construction-hardware` | `/categories/construction-tools` |
| mosquito net Indore | `/products/mosquito-net` | `/blog/mosquito-net-types-fibreglass-ss-aluminium-indore` |
| pigeon net Indore, kabootar jali | `/products/pigeon-nets` | `/blog/pigeon-net-balcony-indore-mesh-size-fixing-guide` |
| FRP bars | `/products/frp-bars` | `/blog/frp-bars-vs-tmt-bars-where-each-belongs` |

## Cannibalisation fixed

- Category pages used to be titled "<Category> in Indore, Madhya Pradesh", the same intent as `/indore/*`. Their
  titles are now "range" titles (see `content/seoOverrides.ts`), applied when `app/categories/[category]/page.tsx`
  uses `buildPageMeta` (handoff P1-2).
- Product titles were all "<Name> Supplier in Indore | Siyaganj | HM Ibrahim". They now read
  "<Name> in Indore: Sizes, Uses, Rate" so they answer the specification question, not the head term.
- `ss-gi-mesh-jalies` was listed three times in `content/indorePages.ts` and does not exist as a product or
  category. Removed; each page now lists real products only (verified in the crawl).
- "Jali" had no clear owner. It is now `/indore/chain-link-fencing-jaali`; the wire-mesh page covers "wiremesh" and
  says in one sentence that customers also call welded mesh "weldmesh jali".

Note 1: there is no Tata Wiron brand page (`/brands/tata` is not built; `validSlugs` allows cm and border). If the
owner wants "Tata Wiron Indore" to rank, build `/brands/tata` first. Until then `/brands` is the target.

## Hindi and Hinglish terms (used where a person at the counter would say them)

| Term | Meaning | Where it appears |
|---|---|---|
| jali / jaali | mesh, chain link, weldmesh | Indore wire-mesh and jali pages, weldmesh and expanded metal product copy, blog posts |
| kata taar | barbed wire | `/indore/barbed-wire`, barbed vs concertina post |
| kala taar | black annealed binding wire | `/products/binding-wire`, `/indore/gi-wire`, GI vs MS post |
| sariya | TMT bars | how-to-choose-tmt post, title override |
| loha mandi | iron market | already in use across 70+ places |
| geti, faurdha | pickaxe, hoe | `/indore/construction-hardware`, tool product copy |
| kabootar jali | pigeon net | pigeon net product copy, reel title |
