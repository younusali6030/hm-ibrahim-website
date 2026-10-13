# Product specification gaps: replacement copy, evidence and counter questions

Prepared 12 Oct 2026 for the 28 products listed by `node scripts/spec-gaps.mjs --md`.

**Honest count: 5 fully resolved, 15 partially resolved, 8 still need owner input.**

**Applied 12 Oct 2026:** every supported value in Part 1 is now in `content/products.ts`, with Hindi in `content/hi/catalogExtra.ts`. The gap script went from 28 products and 43 open rows to 20 products and 28 open rows. The Part 3 questions were not answered by guesswork: no source read in this session holds those values, so those rows stay out of the pages until the counter supplies them.

**Part 3 answered 12 Oct 2026:** the owner supplied the "HM Ibrahim: Proposed Standard Catalog" (50 items). Every value is now in `content/products.ts`, with Hindi in `content/hi/catalogExtra.ts` and a test for each row group in `tests/specSheet.test.mjs`. The gap script went from 20 products and 28 open rows to 4 products and 4 open rows. See "Part 3 answers: what was applied and what is held" at the end of this file.

How to read this file:

- **Part 1** is publish-ready copy. Every value in it is backed by our own site, our own IndiaMART listing, our own shop photos, the maker's own page for a brand we sell (Tata Wiron), or a property of the material itself. A field we could not establish is left out of Part 1 and listed in Part 3.
- **Part 2** is the internal evidence table. It does not go on the website.
- **Part 3** is the short list of questions for the counter.

What the research found, in one paragraph: our IndiaMART listing (GSTIN 23AACFH8321H1ZP, so it is ours) names products and prices but carries one specification only: "S S Wiremesh, Material Grade: SS304". Our Google profile, Instagram and product photos show no roll lengths, coil weights or sheet sizes. The reels with speech could not be transcribed in this session. Other Indore and MP sellers publish roll and coil figures, but those describe their stock, not ours, so none are used. That is why most roll, coil and sheet sizes are still in Part 3.

---

## Part 1. Final copy

Labels in the "Replaces" lines are the field names in `content/products.ts`.

### Fully resolved

#### 1. MS Pipes
https://www.hmibrahim.net/products/ms-pipes

Replaces: missing **Length** row; `Schedule: "As per requirement"`; notes "Available in different sizes and schedules; availability depends on stock."

| Specification | Value |
|---|---|
| Nominal bore | 15, 20, 25, 32, 40, 50, 65, 80, 100, 125, 150, 200, 250 and 300 mm |
| Length | 6 m |
| Types | Black MS pipes, galvanised MS pipes |
| Material | Mild steel |
| Cut to size | Yes, at the counter |

> We stock black and galvanised mild steel pipes from 15 mm to 300 mm nominal bore in 6 m lengths, and we cut them to the length you need. Tell us the bore and the wall thickness or class, and whether you want black or galvanised.

#### 2. MS Wire Rope
https://www.hmibrahim.net/products/ms-wire-rope

Replaces: missing **Length / pack** row; notes "Contact us for diameter and length."

| Specification | Value |
|---|---|
| Diameter | 2 mm to 20 mm and above |
| Sold by | The metre, cut to your length, or the full coil |
| Material | Mild steel |

> Our MS wire rope runs from 2 mm to 20 mm and above. We sell it by the metre, cut to your length, or by the full coil. It is plain steel rope for dry or protected use.

#### 3. SS Wire Rope
https://www.hmibrahim.net/products/ss-wire-rope

Replaces: missing **Length / pack** row; notes "Contact us for diameter and length."

| Specification | Value |
|---|---|
| Diameter | 2 mm to 20 mm and above |
| Sold by | The metre, cut to your length, or the full coil |
| Material | Stainless steel |

> We supply stainless steel wire rope from 2 mm to 20 mm and above, by the metre or by the full coil. It does not rust, so it suits damp, marine and corrosive places.

#### 4. GI Wire Rope
https://www.hmibrahim.net/products/gi-wire-rope

Replaces: missing **Length / pack** row; notes "Contact us for diameter and length."

| Specification | Value |
|---|---|
| Diameter | 2 mm to 20 mm and above |
| Sold by | The metre, cut to your length, or the full coil |
| Material | Galvanised steel |
| Finish | Zinc coated |

> Our GI wire rope is zinc-coated steel rope for outdoor work, from 2 mm to 20 mm and above. We sell it by the metre, cut to your length, or by the full coil.

#### 5. Pigeon Net
https://www.hmibrahim.net/products/pigeon-nets

Replaces: missing **Size** row (the widths sit in `sizes`, so the sheet does not show them); `sizes: "Lengths: As required"`; notes "Available in different sizes and colours."

| Specification | Value |
|---|---|
| Width | 3 ft to 20 ft |
| Length | Cut to the length you need |
| Material | Nylon, HDPE |
| Construction | Knotted net |
| Cut to size | Yes, at the counter |

> Our pigeon net (kabootar jali) is a knotted nylon or HDPE net in widths from 3 ft to 20 ft. We cut it at the counter to the length of your balcony, window or shaft.

---

### Partially resolved

Each block below is ready to publish as it stands. The fields still open are in Part 3.

#### 6. Chain Link Fencing
https://www.hmibrahim.net/products/chain-link-fencing

Replaces: missing **Roll length** and **Pack / roll** rows; the Tata variant's `Chain link mesh opening: "1\" to 4\" (common Tata range)"`, `Wire size: "1.5 mm to 4 mm"`, `Finish: "GI (other finishes as per availability)"` and `sizes: "Heights and mesh sizes as per Tata Wiron availability"`; the "(available depending on stock)" and "Mesh and heights as per stock" wording on CM and Border.

CM and Border (our own manufacture):

| Specification | Value |
|---|---|
| Mesh opening | 1 in, 2 in, 3 in, 4 in |
| Wire diameter | 1.5 mm to 4 mm |
| Roll height | 3, 4, 5, 6, 8 and 10 ft |
| Finish | Galvanised (GI) or PVC coated |
| Brands | CM, Border |

Tata Wiron D-Fence:

| Specification | Value |
|---|---|
| Brand | Tata Wiron D-Fence chain link |
| Mesh opening | 2 x 2 in (51 mm), 3 x 3 in (76 mm), 4 x 4 in (102 mm) |
| Wire diameter | 2.5 mm, 2.64 mm, 3.0 mm |
| Height | 4, 5 and 6 ft |
| Bundle length | 15 m and 30 m |
| Pack | Compacted bundle |
| Finish | Galvanised (GI) |

> We manufacture chain link fencing under our CM and Border brands in 1 in to 4 in mesh, 1.5 mm to 4 mm wire and roll heights of 3 ft to 10 ft, galvanised or PVC coated. We also supply Tata Wiron D-Fence chain link, which Tata makes in 2 in, 3 in and 4 in mesh, 2.5 mm to 3.0 mm wire and 15 m or 30 m compacted bundles.

#### 7. GI Wire
https://www.hmibrahim.net/products/gi-wire

Replaces: missing **Pack / coil** row; notes "Contact us for gauge and quantity."; Tata variant `Coating: "Heavy zinc coating for long life"`.

| Specification | Value |
|---|---|
| Gauge (SWG) and diameter | 8 SWG (4.06 mm), 10 SWG (3.25 mm), 12 SWG (2.64 mm), 14 SWG (2.03 mm), 16 SWG (1.63 mm), 18 SWG (1.22 mm) |
| Form | Coils |
| Sold by | Weight (kg) |
| Material | Galvanised steel wire |
| Brands | Tata Wiron |

Tata Wiron:

| Specification | Value |
|---|---|
| Brand | Tata Wiron GI wire |
| Diameter | 2.0 mm, 2.5 mm, 3.0 mm, 4.0 mm |
| Pack | 10 kg bundle |

> We sell GI wire in coils from 8 SWG (4.06 mm) to 18 SWG (1.22 mm), by weight. We stock Tata Wiron GI wire, which Tata packs in 10 kg bundles in 2.0, 2.5, 3.0 and 4.0 mm.

#### 8. SS Fine Mesh
https://www.hmibrahim.net/products/ss-fine-mesh

Replaces: missing **Gauge / wire size** and **Mesh / hole size** rows (still open); `Material: "Stainless steel (SS)"`; `Weave: "Fine mesh"`; notes "Contact us for aperture size, width, and length."; FAQ answer "Ask us at the time of the quote."

| Specification | Value |
|---|---|
| Material grade | Stainless steel, SS 304 |
| Weave | Woven wire cloth |
| Form | Rolls, cut to size at the counter |
| Sold by | Square foot |

> Our SS fine mesh is woven SS 304 stainless steel wire cloth. We keep it in rolls, cut it to your size at the counter and sell it by the square foot.

FAQ replacement. *Which grade of stainless do you supply?* "SS 304."

#### 9. Mosquito Net
https://www.hmibrahim.net/products/mosquito-net

Replaces: missing **Gauge / wire size** and **Mesh / hole size** rows (mesh count still open; a wire gauge applies only to the metal meshes); notes "Tell us the material, the mesh count, and the width and length you need."

| Specification | Value |
|---|---|
| Also called | Machhar jali, mosquito mesh, window jali |
| Material | Fibreglass, aluminium, GI, stainless steel |
| Form | Rolls, cut to size at the counter |
| Sold by | Square foot |

> We sell mosquito net (machhar jali) in fibreglass, aluminium, GI and stainless steel. It comes off the roll, cut at the counter to your window or door, and is sold by the square foot.

#### 10. MS Wiremesh
https://www.hmibrahim.net/products/ms-wiremesh

Replaces: `Mesh sizes: "Various; as per stock"`; missing **Gauge / wire size** (still open) and **Pack / roll**; notes "Contact us for availability and pricing."

| Specification | Value |
|---|---|
| Mesh opening | 15 x 15 mm, 50 x 50 mm, 75 x 75 mm, 100 x 100 mm, 150 x 150 mm |
| Supplied as | Rolls and panels, cut to size at the counter |
| Material | Mild steel |

> Our MS wiremesh is a square-grid mild steel mesh in openings of 15, 50, 75, 100 and 150 mm. We supply it in rolls and panels and cut it to size. It is for indoor or painted use.

#### 11. GI Wiremesh
https://www.hmibrahim.net/products/gi-wiremesh

Replaces: `Mesh sizes: "Various; as per stock"`; missing **Gauge / wire size** (still open) and **Pack / roll**; notes "Contact us for sizes and pricing."

| Specification | Value |
|---|---|
| Mesh opening | 15 x 15 mm, 50 x 50 mm, 75 x 75 mm, 100 x 100 mm |
| Supplied as | Rolls, cut to size at the counter |
| Material | Galvanised steel wire |
| Finish | Zinc coated |

> Our GI wiremesh is zinc-coated steel wire mesh in openings of 15, 50, 75 and 100 mm. We keep it in rolls and cut it to your size.

#### 12. Aluminium Wiremesh
https://www.hmibrahim.net/products/aluminium-wiremesh

Replaces: `Mesh sizes: "Various; as per stock"`; missing **Gauge / wire size** and mesh opening (both still open) and **Pack / roll**; notes "Contact us for availability."

| Specification | Value |
|---|---|
| Also called | Aluminium jali |
| Material | Aluminium |
| Supplied as | Cut to size at the counter |

> Our aluminium wiremesh (aluminium jali) is a light mesh that does not rust. We cut it to your size at the counter.

#### 13. Crimp Wiremesh
https://www.hmibrahim.net/products/crimp-wiremesh

Replaces: `Mesh sizes: "Various; as per stock"`; `sizes: "As per stock"`; missing **Gauge / wire size** (still open) and **Pack / roll**; notes "mesh sizes and wire gauge as per stock. Contact us for sizes and pricing."

| Specification | Value |
|---|---|
| Weave | Crimped: the wires are pre-bent and lock at every crossing |
| Mesh opening | 15 x 15 mm, 50 x 50 mm, 75 x 75 mm, 100 x 100 mm, 150 x 150 mm |
| Supplied as | Rolls, cut to size at the counter |
| Material | Mild steel, galvanised steel |

> Our crimp wiremesh is woven from pre-bent wires that lock at every crossing, so the openings stay square under load. We supply it in mild steel and galvanised steel, in openings from 15 mm to 150 mm, cut from the roll to your size.

#### 14. Expanded Metal Mesh
https://www.hmibrahim.net/products/expanded-metal-mesh

Replaces: the **Gauge / wire size** row, which does not apply (expanded metal is slit from sheet, so it has a strand thickness, not a wire gauge); notes "Strand thickness, diamond size and roll or sheet size vary. Tell us the use and the size and we will confirm what is in stock."

Field change: show **Strand thickness** in place of "Gauge / wire size" for this product. Its value is in Part 3.

| Specification | Value |
|---|---|
| Pattern | Diamond, slit and stretched from a single sheet, no welds |
| Supplied as | Rolls and cut sheets |
| Material | Mild steel, galvanised steel |
| Finish | Plain, painted or galvanised |

> Our expanded metal mesh is a diamond-pattern mesh slit and stretched from one steel sheet, so it has no welds to break. We supply it in rolls and cut sheets, in mild steel and galvanised steel, plain, painted or galvanised.

#### 15. Plastic Hexa Mesh
https://www.hmibrahim.net/products/plastic-hexagonal-poultry-mesh

Replaces: the **Gauge / wire size** row, which does not apply (plastic mesh has no wire); missing **Roll length** and **Pack / roll** (still open); notes "Available in green, white, and other colours."

Field change: remove "Gauge / wire size" for this product.

| Specification | Value |
|---|---|
| Also called | PVC hexa mesh |
| Pattern | Hexagonal |
| Material | Plastic |
| Colours | Green, white |
| Supplied as | Rolls |

> Our plastic hexa mesh is a light hexagonal plastic net in green and white rolls. It does not rust and suits garden, poultry and light barrier work.

#### 16. Plastic Square Mesh
https://www.hmibrahim.net/products/square-mesh

Replaces: the **Gauge / wire size** row, which does not apply; `Hole sizes: "Various"`; missing **Roll length** and **Pack / roll** (still open); notes "Contact us for dimensions."

Field change: remove "Gauge / wire size" for this product.

| Specification | Value |
|---|---|
| Pattern | Square |
| Material | Plastic |
| Colours | Blue, green |
| Supplied as | Rolls |

> Our plastic square mesh is a light, rust-free net with square holes, in blue and green rolls, for gardens, plant climbers, poultry runs and light barriers.

#### 17. GI Weldmesh
https://www.hmibrahim.net/products/gi-weldmesh

Replaces: `Mesh: "... (commonly available)"`; missing **Pack / roll**; notes "Contact us for sizes."

| Specification | Value |
|---|---|
| Grid | 15 x 15 mm, 50 x 50 mm, 75 x 75 mm, 100 x 100 mm, 150 x 150 mm |
| Wire diameter | 3 mm to 5 mm |
| Supplied as | Rolls and panels, cut to size at the counter |
| Material | Galvanised steel wire |
| Finish | Galvanised (GI) |

> Our GI weldmesh (weldmesh jali) is welded, galvanised steel wire mesh in grids from 15 x 15 mm to 150 x 150 mm and 3 mm to 5 mm wire. We supply it in rolls and panels and cut it to size.

#### 18. MS Weldmesh
https://www.hmibrahim.net/products/ms-weldmesh

Replaces: `Mesh: "... (commonly available)"`; `Finish: "Mild steel (MS)"` (a material, not a finish); missing **Pack / roll**; notes "Contact us for sizes."

| Specification | Value |
|---|---|
| Grid | 15 x 15 mm, 50 x 50 mm, 75 x 75 mm, 100 x 100 mm, 150 x 150 mm |
| Wire diameter | 3 mm to 5 mm |
| Supplied as | Rolls and panels, cut to size at the counter |
| Material | Mild steel wire |
| Finish | Plain, uncoated |

> Our MS weldmesh is welded mild steel wire mesh in grids from 15 x 15 mm to 150 x 150 mm and 3 mm to 5 mm wire. We supply it in rolls and panels and cut it to size. It is uncoated, for indoor use or for painting.

#### 19. Shikanja
https://www.hmibrahim.net/products/santing-shikanja

Replaces: an empty specification sheet ("Size, pack and any other detail: nothing on file").

| Specification | Value |
|---|---|
| Also called | Santing, shuttering clamp |
| Material | Steel flat bar |
| Sold by | Piece |

> Our shikanja (santing) is a steel flat-bar clamp that holds shuttering and formwork while a slab or beam is cast. We sell it by the piece.

#### 20. Pigeon Spikes / Bird Spikes
https://www.hmibrahim.net/products/pigeon-spikes

Replaces: missing **Size** row (strip length still open); notes "Pigeon spikes to prevent birds from sitting on ledges and beams."

| Specification | Value |
|---|---|
| Types | Plastic spikes, stainless steel wire spikes |
| Material | Plastic; stainless steel |
| Form | Strips |
| Sold by | Running metre |

> We stock pigeon spikes in two types, plastic and stainless steel wire. They come as strips, sold by the running metre, for window ledges, parapets and sign boards.

---

### Still requires owner input

For these eight, no source tied to our shop gives the missing value. The copy below tidies the fields we do hold and removes the filler; the missing row stays out until Part 3 is answered.

#### 21. Bright Bars
https://www.hmibrahim.net/products/bright-bars

Missing: **Length**. Replaces notes "Available in different sizes; availability depends on stock."

| Specification | Value |
|---|---|
| Diameter | 8, 10, 12, 16, 20, 25, 32 and 40 mm |
| Sections | Round, flat, square |
| Material | Cold-drawn mild steel |
| Finish | Bright drawn |

> We stock cold-drawn bright bars in round section from 8 mm to 40 mm, with flat and square bars to order. The drawn surface is smooth and holds a tighter size than a hot-rolled bar, which suits shafts and machined parts.

#### 22. GI Chicken Mesh (Poultry Mesh)
https://www.hmibrahim.net/products/chicken-net

Missing: **Gauge / wire size**, **Roll length**, **Pack / roll**. Replaces `Mesh: "Small hexagonal (poultry grade)"`; notes "Contact us for mesh size and dimensions."

| Specification | Value |
|---|---|
| Also called | Murga jali |
| Pattern | Hexagonal |
| Material | Galvanised steel wire |
| Supplied as | Rolls, cut by the metre |

> Our GI chicken mesh (murga jali) is a hexagonal galvanised wire net for poultry runs, cages and light fencing. We sell it off the roll, cut by the metre.

#### 23. PVC Coated Weldmesh
https://www.hmibrahim.net/products/pvc-coated-weldmesh

Missing: **Wire diameter** (base wire and coated, as two figures), **Roll length**. Replaces `Mesh: "Square grid; sizes as per stock"`; notes "Green and other colours as per stock. Contact us for mesh size, wire gauge, and length."

| Specification | Value |
|---|---|
| Grid | Square |
| Material | Steel wire with PVC coating |
| Colour | Green |
| Supplied as | Rolls, cut to size at the counter |

> Our PVC coated weldmesh is welded steel wire mesh with a green plastic coat over the wire. We keep it in rolls and cut it to size, for fencing, partitions and cages.

#### 24. GI Perforated Sheet
https://www.hmibrahim.net/products/gi-perforated-sheet

Missing: **Sheet size**. Replaces notes "Custom sizes available."

| Specification | Value |
|---|---|
| Also called | Chaddar jali, punched sheet |
| Thickness | 0.5 mm to 3 mm |
| Hole shape | Round, square, slot, hexagonal |
| Material | Galvanised steel sheet |
| Cut to size | Yes, at the counter |

> Our GI perforated sheet (chaddar jali) is galvanised steel sheet punched in round, square, slot and hexagonal patterns, from 0.5 mm to 3 mm thick. We cut it to your size.

#### 25. MS Perforated Sheet
https://www.hmibrahim.net/products/ms-perforated-sheet

Missing: **Sheet size**. Replaces notes "Custom sizes available."

| Specification | Value |
|---|---|
| Also called | Chaddar jali, punched sheet |
| Thickness | 0.5 mm to 3 mm |
| Hole shape | Round, square, slot |
| Material | Mild steel sheet |
| Cut to size | Yes, at the counter |

> Our MS perforated sheet (chaddar jali) is mild steel sheet punched in round, square and slot patterns, from 0.5 mm to 3 mm thick. We cut it to your size. It is for indoor use or for painting.

#### 26. Jhatka Wire
https://www.hmibrahim.net/products/jhatka-machine-fencing-wire

Missing: **Gauge / diameter**. Also a conflict to settle: the catalogue says galvanised steel wire, while our own lead photo shows twisted poly wire in red and green coils. Replaces `Type: "Jhatka / fencing wire"`; `sizes: "Coil sizes and lengths as per stock"`; notes "contact us for gauge and quantity."

| Specification | Value |
|---|---|
| Use | Jhatka (electric fence) machine lines, farm boundaries |
| Form | Coils and spools |

> We supply jhatka wire in coils and spools for jhatka machine lines and farm boundaries.

Material is left out of this block until the conflict is settled.

#### 27. Concertina Wire
https://www.hmibrahim.net/products/concertina-wire

Missing: **Core wire diameter and blade type** (the "Gauge" row), **Coil diameter and pack**. Replaces notes "Contact us for coil size and type."

| Specification | Value |
|---|---|
| Type | Single coil, double coil |
| Material | Galvanised steel |

> We supply galvanised concertina wire in single and double coil for walls, posts and the top of chain link fencing.

#### 28. Safety Net
https://www.hmibrahim.net/products/safety-net

Missing: **Size**. Replaces notes "Heavy-duty safety nets for construction and scaffolding. Contact us for dimensions."

| Specification | Value |
|---|---|
| Use | Construction sites and scaffolding |
| Material | Nylon, polyethylene |

> We supply nylon and polyethylene safety nets for construction sites and scaffolding.

No load rating, fall rating or standard is stated for this product, because we hold no test certificate or maker's document for it.

---

## Part 2. Internal evidence table (not for publication)

"Ours" means the source establishes our offering. "Inherent" means a property of the product or a maker's fact about a brand we sell.

| # | Product: field | Proposed value | Source | Evidence | Type | Status |
|---|---|---|---|---|---|---|
| 1 | MS pipes: Length | 6 m | `content/productSeoContent.ts` (GI pipes page: "typically 6 m length", "Standard length is 6 m"); `content/products.ts` (MS pipes variants include galvanised MS pipes) | Our own page states 6 m for the pipes we sell; IS 1239 tubes are supplied in 4 to 7 m mill lengths, so 6 m is consistent | Ours (sibling page), not re-confirmed for black pipe | Supported. Lowest-confidence item in the resolved group: one "yes" from the counter closes it |
| 1 | MS pipes: Cut to size | Yes | `components/product/specSheet.ts` `isCutToSize` (pipes) | Site already tells customers pipes are cut | Ours | Supported |
| 2-4 | Wire ropes: Sold by | Metre, cut to length, or full coil | `content/products.ts` notes ("supplied by metre or coil"); `content/productCopy.ts` FAQ "we sell by the metre or by the coil" | Stated on all three rope pages | Ours | Supported |
| 4 | GI wire rope: Material | Galvanised steel | Material fact: wire rope is drawn steel wire; "GI" is trade shorthand | Corrects "Galvanised iron" | Inherent | Supported |
| 5 | Pigeon net: Width | 3 ft to 20 ft | `content/products.ts` `sizes`; `content/productCopy.ts` overview | Already published; only held in the wrong field | Ours | Supported |
| 5 | Pigeon net: Material | Nylon, HDPE | `content/products.ts` `materials` | `shortDesc` says "Nylon and wire": drop "wire", no wire net is on file | Ours | Supported; shortDesc conflicts |
| 6 | Chain link (CM, Border): mesh, wire, height, finish | 1 to 4 in; 1.5 to 4 mm; 3 to 10 ft; GI or PVC | `content/products.ts`; `content/seoOverrides.ts` | Existing catalogue data; manufacture owner-confirmed 12 Oct 2026 (`content/site.ts`) | Ours | Supported |
| 6 | Chain link (CM, Border): Roll length, roll weight | not established | none | Labels in our photos are not legible for size | Ours | Requires owner input |
| 6 | Chain link (Tata): mesh | 2x2, 3x3, 4x4 in (51, 76, 102 mm) | https://aashiyana.tatasteel.com/in/en/buy-our-products/brands/tata-wiron/product-details/wrn-52.html | Tata's own sizing chart | Inherent (maker's range) | Supported. Conflicts with our current "1 to 4 in (common Tata range)": Tata lists no 1 in mesh |
| 6 | Chain link (Tata): wire diameter | 2.5, 2.64, 3.0 mm | https://aashiyana.tatasteel.com/in/en/brands/tata-wiron/category-page.html/tata-wiron/chain-link and SKUs WRN-48, WRN-52, WRN-64 | SKU names on Tata's store | Inherent | Supported. Conflicts with our current "1.5 mm to 4 mm" |
| 6 | Chain link (Tata): height | 4, 5, 6 ft | Same category page | SKU names "Height - 4 / 5 / 6" | Inherent | Supported for those heights; the page has a "Load more" button, so the list may be longer |
| 6 | Chain link (Tata): bundle length | 15 m and 30 m | Same; WRN-52 gives 15.24 m | SKU names "Length 15m", "Length 30m" | Inherent | Supported |
| 6 | Chain link (Tata): pack | Compacted bundle | `public/products/tata-chainlink-1.png` (Tata's own artwork: "Available as compacted bundles") | Maker's statement | Inherent | Supported |
| 6 | Chain link (Tata): which sizes we stock | not established | none | Tata's range is not our shelf | Ours | Requires owner input |
| 7 | GI wire: SWG to mm | 8: 4.06; 10: 3.25; 12: 2.64; 14: 2.03; 16: 1.63; 18: 1.22 | Standard Wire Gauge table; already used in `content/productReference.ts` | Fixed conversion. Tata's 2.64 mm SKU matches 12 SWG | Inherent | Supported |
| 7 | GI wire: Sold by | Weight (kg) | `content/productCopy.ts` ("It is sold by weight") | Own page | Ours | Supported |
| 7 | GI wire (Tata): pack | 10 kg bundle in 2.0, 2.5, 3.0, 4.0 mm | https://aashiyana.tatasteel.com/in/en/buy-our-products/brands/tata-wiron/product-details/wrn-227.html (also wrn-228, -229, -230) | "GI Farming wire (10 KG Bundle)" SKUs | Inherent | Supported. Dealer listings also quote 50 kg and 150 kg Tata coils; those are resellers, not Tata, and are not used |
| 7 | GI wire: our coil weights | not established | none | Listings elsewhere range from 0.5 kg to 1000 kg | Ours | Requires owner input |
| 7 | GI wire (Tata): "Heavy zinc coating for long life" | remove | none found | No Tata document seen for a coating class on the wire we stock | Inherent | Unsupported claim in current copy |
| 8 | SS fine mesh: grade | SS 304 | https://m.indiamart.com/mohhusain-haji-hm-ibrahim-and-company/ss-wire-mesh.html | Our listing: "S S Wiremesh, Material Grade: SS304". GSTIN on the listing matches ours | Ours | Supported |
| 8, 9 | SS fine mesh, mosquito net: Sold by | Square foot | Same listing; https://m.indiamart.com/mohhusain-haji-hm-ibrahim-and-company/mosquito-mesh.html | Our listing prices "S S Wiremesh" and "Macchar Jali Role" per sq ft | Ours | Supported |
| 8, 9 | Mesh count, wire diameter, roll width | not established | none | "18 x 16" is common for fibreglass in the trade; nothing says it is ours | Ours | Requires owner input |
| 9 | Mosquito net: two grades | not established | Our listing shows two "Macchar Jali Role" entries at different rates | Suggests two grades or materials; the listing does not say which | Ours | Requires owner input |
| 10-13 | Wiremesh: openings | as listed | `content/products.ts` `sizes` | Existing data | Ours | Supported |
| 10-13 | Wiremesh: Supplied as | Rolls (and panels for MS), cut to size | `content/productCopy.ts`; `isCutToSize` | Own pages | Ours | Supported |
| 10-13 | Wiremesh: wire gauge, roll width, roll length | not established | none | | Ours | Requires owner input |
| 12 | Aluminium wiremesh: "Aluminium jali" | name | https://m.indiamart.com/mohhusain-haji-hm-ibrahim-and-company/wire-mesh.html | Listed by us | Ours | Supported |
| 12 | Aluminium wiremesh: roll form | left out | `public/products/v2/aluminium-wiremesh-*.webp` | Image origin is unclear, so "rolls" is not claimed | Ours | Requires owner input |
| 12 | Aluminium wiremesh: "chemical and food applications" | remove | none | No grade or certificate on file | n/a | Unsupported claim in current notes |
| 14 | Expanded metal: field | Strand thickness, not wire gauge | Product fact: slit and stretched sheet | Row label is wrong for this product | Inherent | Supported (field change); value requires owner input |
| 15, 16 | Plastic meshes: Gauge / wire size | not applicable | Product fact: extruded plastic strand, no wire | Row should not be offered | Inherent | Supported (field removed) |
| 15 | Plastic hexa: colours | Green, white | `content/products.ts`; `public/products/hexa-mesh-1.png`; reel "pvc-hexa-mesh" | Own data and photos | Ours | Supported |
| 16 | Plastic square: colours | Blue, green | `content/products.ts`; `public/products/square-mesh-1.png` | Own data and photos | Ours | Supported |
| 15, 16 | Plastic meshes: hole size, roll height, roll length | not established | none | | Ours | Requires owner input |
| 17, 18 | Weldmesh: grid, wire | as listed; 3 to 5 mm | `content/products.ts` | Existing data | Ours | Supported |
| 17, 18 | Weldmesh: Supplied as | Rolls and panels | `content/productCopy.ts`; reel "weldmesh-jali" | Own page and video | Ours | Supported |
| 17, 18 | Weldmesh: roll width, roll length, panel size | not established | none | 30 m rolls appear in other sellers' listings only | Ours | Requires owner input |
| 19 | Shikanja: material, form | Steel flat bar | `public/products/santing-shikanja-1.png` | Our own photo shows flat-bar steel clamps | Ours (photo) | Supported |
| 19 | Shikanja: Sold by | Piece | `content/products.ts` `indicativeRate` ("per piece") | Own data | Ours | Supported |
| 19 | Shikanja: sizes | not established | none | | Ours | Requires owner input |
| 20 | Pigeon spikes: Sold by | Running metre | `content/products.ts` `indicativeRate` ("per metre") | Own data | Ours | Supported |
| 20 | Pigeon spikes: "UV-stabilised plastic" | changed to "Plastic" | none | No maker's document; our product image is a catalogue picture, not shop stock | n/a | Unsupported claim in current data |
| 20 | Pigeon spikes: strip length, base width | not established | none | 33 and 50 cm strips are other sellers' sizes | Ours | Requires owner input |
| 21 | Bright bars: Length | not established | none | 3 m and 6 m come from one trade listing | Ours | Requires owner input |
| 22 | Chicken mesh: "Murga jali" | name | https://m.indiamart.com/mohhusain-haji-hm-ibrahim-and-company/other-products.html | Our listing: "Murga Jal" | Ours | Supported |
| 22 | Chicken mesh: cut by the metre | Yes | `content/productCopy.ts` FAQ | Own page | Ours | Supported |
| 22 | Chicken mesh: gauge, opening, roll width, roll length | not established | none | | Ours | Requires owner input |
| 23 | PVC weldmesh: colour | Green | `public/products/pvc-coated-weldmesh.png`; `content/products.ts` | Own photo and data | Ours | Supported |
| 23 | PVC weldmesh: grid, base and coated wire diameter, roll length | not established | none | | Ours | Requires owner input |
| 24, 25 | Perforated sheet: thickness, hole shape | as listed | `content/products.ts` | Existing data | Ours | Supported |
| 24, 25 | Perforated sheet: Sheet size | not established | `public/reels/perforated-sheet-customer.jpg` shows slot-hole sheet in coil form | One frame; 6 x 3 ft and 8 x 4 ft come from one other supplier | Ours | Requires owner input |
| 26 | Jhatka wire: material | conflicting | `content/products.ts` ("Galvanised steel, GI wire") against `public/products/nylon-jhatka-wire.png` (twisted poly wire, red and green) | Two different products under one page | Ours | Conflicting |
| 26 | Jhatka wire: gauge | not established | none | Our FAQ says "12 to 14 SWG is common", which describes the trade, not our stock | Ours | Requires owner input |
| 27 | Concertina: type, material | Single / double coil; galvanised steel | `content/products.ts` | Existing data | Ours | Supported |
| 27 | Concertina: blade type, core wire, coil diameter, coil length | not established | none | BTO-22 and 450 to 900 mm coils are trade figures; our product image is a catalogue picture | Ours | Requires owner input |
| 28 | Safety net: material | Nylon, polyethylene | `content/products.ts` | Existing data | Ours | Supported |
| 28 | Safety net: size, mesh, any rating or standard | not established | none | No certificate on file. "Fall protection" is kept out of the spec table | Ours | Requires owner input |

Sources that returned nothing usable:

- IndiaMART desktop page: HTTP 429. The mobile pages were read instead (profile, products, wire mesh, welded wire mesh, SS wire mesh, wires and cables, steel pipe, MS wire, mosquito mesh, other products, about us).
- Justdial listing: HTTP 403.
- Google Business Profile: name, address, hours, 4.9 from 633 reviews. No product specifications.
- Instagram `hmibrahimsince1939`: bio and highlight titles only.
- tatawiron.com: HTTP 403. Tata Aashiyana (Tata Steel's own store) was used instead.
- Reels with speech (chain link walkthrough, weldmesh jali, kabootar jali, PVC hexa mesh, Tata wire rate, machhar jali): not transcribed. They are the most likely place where sizes are already said out loud.

---

## Part 3. Counter questions

One short answer each. Numbers only where possible.

**Bright bars**
1. Bar length: ___ m

**MS pipes**
2. Black MS pipe length 6 m: yes / no

**Chain link (CM and Border)**
3. Roll length: ___ ft or m
4. Sold by: kg / sq ft / running ft
5. Tata Wiron D-Fence sizes we keep: mesh ___ in, wire ___ mm, height ___ ft, bundle 15 m / 30 m

**GI wire**
6. Coil weight, loose GI wire: ___ kg
7. Tata Wiron pack we keep: 10 kg bundle / other ___ kg

**MS, GI and crimp wiremesh**
8. Wire gauge or diameter for each opening: ___
9. Roll width: ___ ft
10. Roll length: ___ ft or m
11. MS wiremesh panel size: ___

**Aluminium wiremesh**
12. Mesh count or opening: ___
13. Roll width: ___ ft

**Expanded metal mesh**
14. Strand thickness: ___ mm
15. Diamond size: ___ mm
16. Sheet size and roll width: ___

**Mosquito net**
17. Mesh count for each material (fibreglass, aluminium, GI, SS): ___
18. Roll widths: ___ ft
19. The two rates on IndiaMART are for which two materials or grades: ___

**SS fine mesh**
20. Mesh counts kept: ___
21. Roll width: ___ ft

**GI chicken mesh**
22. Wire gauge: ___
23. Hexagon size: ___ in
24. Roll width: ___ ft, roll length: ___ ft or m

**Plastic hexa mesh and plastic square mesh**
25. Hole size, each: ___
26. Roll height, each: ___ ft
27. Roll length, each: ___ m

**GI and MS weldmesh**
28. Roll width: ___ ft, roll length: ___ ft or m
29. Panel size: ___

**PVC coated weldmesh**
30. Grid: ___ mm
31. Wire diameter before coating: ___ mm; after coating: ___ mm
32. Roll height: ___ ft, roll length: ___ ft or m

**GI and MS perforated sheet**
33. Sheet size or coil width: ___
34. Hole diameters kept: ___ mm

**Jhatka wire**
35. What we sell: poly wire / GI wire / both
36. Gauge or diameter: ___
37. Coil or spool length: ___ m

**Wire ropes (MS, GI, SS)**
38. Full coil length: ___ m
39. SS rope grade: 304 / 316
40. Construction kept: 6x19 / 6x37 / other ___

**Concertina wire**
41. Coil diameter: ___ mm
42. Opened length per coil: ___ m
43. Blade type marked on the coil: ___

**Shikanja**
44. Sizes kept: ___ in

**Pigeon net**
45. Mesh size: ___ in

**Pigeon spikes**
46. Strip length: ___ cm
47. Pack: ___ strips

**Safety net**
48. Net sizes kept: ___ x ___ m
49. Mesh size: ___ mm
50. Test certificate from the maker: yes / no

---

## Final count

| Result | Count | Products |
|---|---|---|
| Fully resolved | 5 | MS pipes; MS, SS and GI wire rope; pigeon net |
| Partially resolved | 15 | Chain link fencing; GI wire; SS fine mesh; mosquito net; MS, GI, aluminium and crimp wiremesh; expanded metal mesh; plastic hexa mesh; plastic square mesh; GI and MS weldmesh; shikanja; pigeon spikes |
| Still requires owner input | 8 | Bright bars; GI chicken mesh; PVC coated weldmesh; GI and MS perforated sheet; jhatka wire; concertina wire; safety net |

Counted by field rather than by product, the script lists 43 missing fields:

- 5 closed with a value: MS pipe length, the three rope "Length / pack" rows, pigeon net size.
- 3 closed by removing or renaming a row that does not apply: plastic hexa mesh, plastic square mesh, expanded metal mesh.
- 8 part-filled: "Pack / roll" now states the supplied form on MS, GI and crimp wiremesh and on GI and MS weldmesh, with roll dimensions still open (5); chain link roll length and pack, and GI wire pack, are filled for Tata Wiron only (3).
- 27 still fully open and waiting on Part 3.


---

## Part 3 answers: what was applied and what is held

Source: the owner's "HM Ibrahim: Proposed Standard Catalog", an owner-selected specification proposal. It is not an inspection record or a manufacturer certification, and the site claims neither.

### Applied to the pages

| # | Product | Rows now on the page |
|---|---|---|
| 1 | Bright bars | Length 6 m |
| 2 | MS pipes | Black MS pipe 6 m: already shown, confirmed |
| 3-4 | Chain link, CM and Border | Roll length 15 m; sold by weight (kg); packed in rolls |
| 5 | Chain link, Tata Wiron | Stocked configuration kept on the Tata variant: 4 x 4 in mesh, 2.5 mm wire, 5 ft height, 15 m bundle. Tata's own range rows are unchanged |
| 6-7 | GI wire | Loose packs 5, 10 and 25 kg, weighed from bulk coils; Tata pack we stock: 10 kg bundle of 4.0 mm GI farming wire |
| 8-11 | MS, GI, crimp wiremesh | MS and GI: 1.2 mm on 15 x 15, 1.6 mm on 25 x 25, 2.5 mm on 50 x 50. Crimp: 2.5 mm on 25 x 25, 3.0 mm on 50 x 50. Roll 1.2 m (about 3.94 ft) x 15 m. MS panel 1.2 x 2.4 m. The combinations are listed as selected, not as a grid |
| 12-13 | Aluminium wiremesh | 18 x 16 per inch; roll widths 3 ft and 4 ft |
| 14-16 | Expanded metal | Thickness 0.5, 1.0, 1.5 mm; pitch 10 x 20 and 20 x 40 mm (stated as pitch, not clear opening); 1.2 x 2.4 m sheets, 0.5 mm in 1 m x 10 m rolls |
| 17-18 | Mosquito net | Counts: fibreglass 18 x 16, aluminium 18 x 16, GI 16 x 16, SS 20 x 20; widths 3 ft and 4 ft for each |
| 20-21 | SS fine mesh | 20, 40 and 60 per inch; roll width 1 m |
| 22-24 | GI chicken mesh | 0.7 mm wire; 25 mm nominal hexagon (about 1 in); 1 m x 30 m |
| 25-27 | Plastic hexa and square mesh | Hexa 25 mm, 1.2 m high; square 10 x 10 mm, 1 m high; 25 m each |
| 28-29 | GI and MS weldmesh | Roll 1.5 m x 15 m, 25 x 25 mm, 2.5 mm wire; panel 1.2 x 2.4 m, 50 x 50 mm, 3 mm wire. The old "3-5 mm" wire row is removed because it contradicts the 2.5 mm roll |
| 30, 32 | PVC coated weldmesh | 25 x 25 mm finished opening; 3 ft x 15 m |
| 33-34 | GI and MS perforated sheet | Sheet 1,220 x 2,440 mm (4 x 8 ft); round holes 2, 3, 5, 6 mm in 1 mm sheet; hole pitch and open area stay with the manufacturer's specification |
| 35-37 | Jhatka wire | GI steel fencing wire, 1.5 mm, 100 m cut-length coils. Page copy no longer says "high-tensile" or "12 to 14 SWG" |
| 38 | Wire ropes | Full reel: MS 500 m, GI 500 m, SS 305 m |
| 41-42 | Concertina wire | Coil 450 and 600 mm; 8 m and 9 m opened length, with a note not to stretch a coil past its length |
| 44 | Shikanja | Overall length 600 mm (23.6 in) and 900 mm (35.4 in). Labelled overall length, not jaw opening |
| 45 | Pigeon net | Mesh 50 x 50 mm (about 2 x 2 in) |
| 46-47 | Pigeon spikes | Strip 30 cm; retail pack 10 strips, 3 m in total |
| 48-50 | Safety net | 5 x 10 m, 50 x 50 mm mesh. No maker's test certificate is claimed, so "fall protection" is removed from the short description, the use list, the overview, the buying guide and the FAQs (English and Hindi), and a "Is this a fall-arrest net?" answer is added |

### Held until the maker's specification is on file

The owner's own rule: obtain matching supplier specifications for grades, wire construction and coating measurements before publishing those attributes. These items are therefore not on any page. `tests/specSheet.test.mjs` fails if they appear.

| # | Held value | Needs |
|---|---|---|
| 31 | PVC weldmesh wire: 1.0 mm steel core, 1.4 mm finished, 0.2 mm radial coating | Maker's data sheet for the coated wire |
| 39 | SS rope grade 304 | Maker's mill or product sheet |
| 40 | Rope construction 6 x 19 (core type and strength grade stay separate attributes) | Maker's rope sheet |
| 43 | Concertina blade profile BTO-22 | Maker's coil specification |
| 19 | Mosquito net variants "PVC-coated fibreglass, 18 x 16" and "SS304, 20 x 20" | Grade and coating from the maker, and a fresh rate for each. These are IndiaMART listing names, not site rows |

### Needs doing outside the website

- Make up the proposed retail packs and cut lengths before they are quoted: GI wire 5, 10 and 25 kg, jhatka 100 m coils, pigeon spike 10-strip packs.
- The two IndiaMART mosquito-mesh listings need the new variant names and a fresh, explained rate each. No old rate is carried over here.
- Not claimed anywhere: manufacturer certification, safe working load, structural suitability, fall-protection performance.

### Still open after this pass

Wire diameter is not selected for aluminium wiremesh, mosquito net and SS fine mesh, so the gap script still lists them. PVC weldmesh wire is held (row 31).
