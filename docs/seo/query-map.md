# Prioritised query map

Prepared 12 Oct 2026. Source: the 53-product catalogue (`content/products.ts`), existing aliases (`content/productAliases.ts`),
the keyword map (`keyword-map.md`) and the SERPs in `query-evidence-log.csv`.
**No search volumes appear here.** OpenSEO volume lookups were not run (credits went to SERP inspection) and Search Console is not connected.
Priority reflects commercial value (what the shop makes or stocks in depth), how close the site already is (local pack present, organic
rank near page 2) and SERP shape (directory-dominated or not). It is a judgement, not a measured number.

Legend. Intent: **M** manufacturer, **B** buy/rate, **S** specification, **L** local, **N** national. Tested: Y (SERP pulled this pass), N (not yet).

| Pri | Query | Lang | Intent | Product(s) | Target page | Tested | Status |
|---|---|---|---|---|---|---|---|
| 1 | barbed wire manufacturer Indore | en | M, L | barbed-wire | `/indore/barbed-wire` | N (closest: 'barbed wire Indore', Y) | Page rewritten on this branch |
| 1 | chain link fencing manufacturer Indore | en | M, L | chain-link-fencing | `/indore/chain-link-fencing-jaali` | Y (organic 14, old title) | Page rewritten |
| 1 | wire mesh manufacturer Indore | en | M, L | weldmesh, wiremesh, crimp | `/indore/wire-mesh` | N ('wire mesh supplier Indore', Y) | Page rewritten |
| 1 | barbed wire Indore; kata taar Indore | en | B, L | barbed-wire | `/indore/barbed-wire` | Y | Not seen in organic; not in pack |
| 1 | chain link fencing Indore; jali Indore | en | B, L | chain-link-fencing | `/indore/chain-link-fencing-jaali` | Y | Pack 2 of 3 |
| 1 | कांटेदार तार इंदौर; कटा तार इंदौर | hi | B, L | barbed-wire | `/hi/indore/barbed-wire` | Y (first) | Not seen |
| 1 | चेन लिंक जाली इंदौर; चेन लिंक फेंसिंग इंदौर | hi | B, L | chain-link-fencing | `/hi/indore/chain-link-fencing-jaali` | Y | Organic 13; pack 1 of 3 |
| 1 | barbed wire manufacturer in India; barbed wire supplier India | en | M, N | barbed-wire | `/products/barbed-wire` | Y | Not seen; national SERP led by other cities' makers |
| 1 | chain link fencing manufacturer India | en | M, N | chain-link-fencing | `/products/chain-link-fencing` | Y | Not seen |
| 2 | welded wire mesh Indore; weld mesh Indore; weldmesh jali | en | B, S, L | gi/ms/pvc weldmesh | `/indore/wire-mesh` | Y | Not seen; not in pack |
| 2 | wire mesh wholesale supplier India | en | B, N | mesh family | `/categories/wiremesh` | Y | Not seen |
| 2 | binding wire Indore; kala taar rate Indore; बाइंडिंग तार इंदौर | en, hi | B, S, L | binding-wire | `/products/binding-wire` | Y | Not seen; not in pack |
| 2 | binding wire weight per coil; 18 gauge binding wire diameter | en | S | binding-wire | `/products/binding-wire` (spec block, to add) | N | Gap: no spec block |
| 2 | Tata Wiron dealer Indore | en | B, L | tata lines | `/brands/tata` | Y | Not seen; title changed to 'dealer' on branch |
| 2 | GI wire Indore; galvanised wire gauge | en | B, S | gi-wire | `/indore/gi-wire` | Y | Not seen |
| 2 | perforated sheet Indore; chaddar jali Indore | en | B, L | gi/ms perforated | `/indore/perforated-sheets` | Y | Pack 2 of 3; organic not seen |
| 2 | machhar jali Indore; mosquito net roll Indore | en | B, L | mosquito-net, ss-fine-mesh | `/products/mosquito-net` | Y (first) | Pack 1 of 3; organic not seen |
| 2 | TMT bars Indore; sariya rate Indore | en | B, L | tmt-bars | `/products/tmt-bars` | Y | Not seen; directory-led |
| 2 | TMT bar weight chart | en | S | tmt-bars | `/blog/tmt-bar-weight-chart-size-guide-indore` | Earlier run only | Not seen in earlier capture |
| 3 | concertina wire Indore | en | B, L | concertina-wire | `/products/concertina-wire` | Y | Pack 2 of 3; organic not seen |
| 3 | chicken mesh Indore; murga jali Indore | en | B, L | chicken-net | `/products/chicken-net` | Y (first) | Pack 1 of 3 |
| 3 | expanded metal mesh Indore | en | B, L | expanded-metal-mesh | `/products/expanded-metal-mesh` | Y | Not seen |
| 3 | MS angle Indore; angle rate Indore | en | B, L | ms-angles | `/products/ms-angles` | Y | Pack 3 of 3 |
| 3 | GI pipe dealers Indore | en | B, L | gi-pipes | `/products/gi-pipes` | Y | Not seen |
| 3 | wire rope Indore | en | B, L | wire ropes | `/categories/wires` | Y | Not seen; specialists lead |
| 3 | pigeon net Indore; kabootar jali Indore | en, hinglish | B, L | pigeon-nets | `/products/pigeon-nets` | Y | Not seen; installers lead |
| 3 | welding rod Indore | en | B, L | welding-rods | `/products/welding-rods` | Y | Not seen |
| 3 | crowbar sabbal Indore; geti Indore | en | B, L | tools | `/products/sr-crowbar` | Y | Pack 3 of 3 |
| 3 | iron hardware shop Siyaganj; loha mandi Indore | en | L | whole shop | `/indore`, `/blog/siyaganj-market-guide-buying-iron-hardware-indore` | Y (first) | Not seen; JustDial and local stores lead |
| 4 | HM Ibrahim and Co Indore (brand) | en | L | home | `/` | Y | Organic 2; knowledge panel present |
| 4 | square mesh, aluminium mesh, holepass, bright bar, round bar, channel, I-beam, FRP, fibermesh, nails, sponge, cutting disc, shikanja, cover block, hoe, sledge hammer, bird spikes, safety net (each + Indore) | en | B, L | remaining 26 products | product pages | N | Test in the next batch, using the same method |
| 4 | Hindi forms for the rest (काला तार, सरिया, मच्छर जाली, चादर जाली, कबूतर जाली) | hi | B, L | various | `/hi/...` twins | N | Only 3 Hindi queries ran cleanly |

## Why not hundreds of queries

The shop's volume is in a few families. Pulling 1,000 long-tail terms would add rows, not decisions. This pass tested one head term, one
Hinglish or Hindi variant and one manufacturer or national variant for each valuable family, and expanded only where a result showed a
reachable gap (chain link organic rank 13 to 14; local pack present but no organic page).
