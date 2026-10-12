# Trade reference: sources and what was left out

Collected 13 Oct 2026 for the "Trade reference" block on product pages (`content/productReference.ts`).

## Method and limits

- The shop's own IndiaMART listing (`content/site.ts`, `indiamartUrl`) returned HTTP 429 (Too Many Requests) to both the in-app
  browser and Chrome, so it could not be read. It is the best source for the shop's own pack and size details. Open it in a signed-in
  browser, copy the specifications it lists per item, and add them to `specs` in `content/products.ts`.
- Other suppliers' listings were used only for figures that belong to the product family (standards, gauge tables, common
  constructions). Coil weights, roll lengths and pack sizes differ from maker to maker (for example GI wire coils range from 0.5 kg
  to 1000 kg across listings), so none were copied into the shop's spec rows. Doing so would state something about this shop's stock
  that nobody at the counter confirmed.
- No text was copied from listings. Prices on those pages were ignored.

## Sources by product

| Product | Reference added | Source |
|---|---|---|
| GI wire | SWG to mm table; zinc coating by class; 50 to 80 kg coils in utility tenders | Gujarat utility GI wire spec (pgvcl.com); WBSEDCL GI stay wire spec |
| Binding wire, jhatka wire, barbed wire | SWG to mm | Standard Wire Gauge table |
| Concertina wire | BTO-22 blade 22 x 15 mm, 34 mm spacing; 2.5 mm core; 450 to 960 mm coils; 8 to 14 m opened; 5 to 14 kg | Globalsources spec PDF; Inchalam table; vidaXL listings |
| Chain link | 2 x 2 in mesh in 8 to 12 gauge up to 10 ft; sold by weight or area | Bokadia Wires; Bhansali Wire Industries |
| Wire rope (MS, GI, SS) | 6x19 and 6x37, FC and IWRC; SS 304 and 316 | Fortune Rope; Lexco Cable catalogues |
| Bright bars | 3 m and 6 m lengths; h9 (DIN 671) and h11 (ASTM A 484) | Bhansali Bright Bars trade listing |
| MS and GI pipes | IS 1239 Part 1 classes, 4 to 7 m random length, wall thickness by NB | IS 1239 table circulated online (indicative, not the BIS text); L&T-SuFin listings |
| SS fine mesh | 304 and 316; mesh count; 36 / 40 / 48 / 60 in widths | Newark Wire Cloth; Cronin; IndiaMART listings |
| Mosquito net | 18 x 16 count; 0.17 to 0.33 mm wire; colours | Fibreglass insect mesh listings (UK, Italy, India) |
| Pigeon net | 1, 1.5, 2 in mesh; knotted HDPE; 12 and 15 ply | IndiaMART bird-net listings; aajjo.com |
| Pigeon spikes | Polycarbonate base with 304 pins; 33 and 50 cm strips | Killgerm, Mast Digital, ManoMano listings |
| Safety net | IS 11057 named; 70 mm or less mesh in one tender; ask for certificate | NTPC tender job_39979; InfraLens IS 8769 summary |
| Weldmesh | 30 m rolls, 0.6 to 1.5 m widths, 1.6 to 5 mm wire, 40 to 120 GSM | Tradeindia and IndiaMART GI mesh listings |
| Chicken mesh | Gauge direction; 1 in and 2 in openings | Hex netting listings |

## Left out on purpose

- Roll length and roll weight for chain link, wiremesh, poultry and plastic meshes: supplier-specific.
- Wire rope breaking strength and working load: must come from the maker's certified table.
- Clutch wire, shikanja, sponge, cover blocks, welding rods, perforated-sheet pack: no reliable family-level figure found. These
  need the counter's own values (see `audit-implementation-2026-10-12.md`, section 5).
- Sheet sizes for perforated sheet (6 x 3 ft and 8 x 4 ft appear in one supplier's list): one source only.
- IS 11057 text itself was not found. Only the name of the standard is stated, with a prompt to check the current text.
