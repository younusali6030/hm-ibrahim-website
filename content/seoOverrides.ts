/**
 * Search-result title and description overrides, keyed by path (no leading slash).
 * buildPageMeta() applies these automatically, so on-page H1s stay as the designer wrote them
 * while the <title> and meta description are written for the results page.
 * Titles are complete (absolute) and kept to 60 characters. Descriptions to 155.
 * One page per keyword: see docs/seo/keyword-map.md before editing.
 */
export type SeoOverride = { title: string; description?: string };

export const seoOverrides: Record<string, SeoOverride> = {
  // ---- Category pages: the RANGE. The /indore/* pages own "<term> Indore".
  "categories/structural-items": {
    title: "Steel Angles, Flats, Channels, Bars, Pipes | HM Ibrahim",
    description:
      "Structural steel range at Siyaganj, Indore: MS angles, flats, channels, beams, TMT and round bars, GI and MS pipes, FRP bars. Ask for the rate.",
  },
  "categories/fencing-material": {
    title: "Fencing Material: Chain Link, Barbed Wire | HM Ibrahim",
    description:
      "Chain link, barbed and concertina wire, jhatka wire, weld mesh and angle posts for boundaries and farms. CM, Border and Tata Wiron at Siyaganj, Indore.",
  },
  "categories/wiremesh": {
    title: "Wiremesh Range: GI, MS, Crimp, Mosquito Net | HM Ibrahim",
    description:
      "MS, GI, aluminium and crimp wiremesh, expanded metal, mosquito net, SS fine mesh, chicken mesh and hexa mesh. Cut from the roll at Siyaganj, Indore.",
  },
  "categories/welded-mesh": {
    title: "Welded Mesh Range: GI, MS, PVC-Coated | HM Ibrahim",
    description:
      "GI, MS and PVC-coated welded mesh in rolls and panels, from 15 x 15 mm to 150 x 150 mm grids. Weldmesh jali at the Siyaganj counter, Indore.",
  },
  "categories/perforated-sheets": {
    title: "Perforated Sheet (Chaddar Jali) Range | HM Ibrahim",
    description:
      "GI and MS perforated sheets (chaddar jali), 0.5 to 3 mm, in round, square, slot and hexagonal holes, cut to size. SS and aluminium on request. Siyaganj, Indore.",
  },
  "categories/wires": {
    title: "Wire and Wire Rope: GI, Binding, Fencing | HM Ibrahim",
    description:
      "GI wire, binding wire (kala taar), jhatka wire, MS, GI and SS wire rope, rope clamps and concertina wire, in coils at Siyaganj, Indore.",
  },
  "categories/construction-tools": {
    title: "Sabbal, Geti, Faurdha, Ghan: Site Tools | HM Ibrahim",
    description:
      "Crowbar (sabbal), sledge hammer (ghan), pickaxe (geti), shovel (faurdha, phawda), shikanja, cover blocks, welding rods and cutting discs at Siyaganj, Indore.",
  },
  "categories/nails": {
    title: "Wire Nails and Roofing Nails, 1 to 6 Inch | HM Ibrahim",
    description:
      "Wire nails from 1 to 6 inch and roofing nails from 1.5 to 6 inch, sold by weight in plain and galvanised steel at Siyaganj, Indore.",
  },
  "categories/safety-nets-equipments": {
    title: "Pigeon Net, Bird Spikes and Safety Net | HM Ibrahim",
    description:
      "Pigeon net cut to your balcony size, plastic and steel bird spikes, and construction safety net. Siyaganj, Indore. Ask for the rate.",
  },

  // ---- Product pages: hand-written for the priority products (see docs/seo-indore-audit.md).
  // Barbed wire and chain link are made by the shop (owner-confirmed 12 Oct 2026). The /indore/* pages own the
  // "<product> manufacturer Indore" intent; these product pages own the specification and "supplied across India" intent.
  "products/barbed-wire": {
    title: "Barbed Wire in Indore: 12 x 14 Gauge, Coils | HM Ibrahim",
    description:
      "Barbed wire we manufacture in Indore: single and double strand, 12 x 14 and 14 x 14 gauge, coils to 25 kg. Orders accepted across India. Ask for the rate.",
  },
  "products/chain-link-fencing": {
    title: "Chain Link Fencing in Indore: Mesh, Wire, Height",
    description:
      "Chain link fencing we manufacture in Indore: 1 to 4 inch mesh, 1.5 to 4 mm wire, 3 to 10 ft rolls, GI or PVC. Orders across India. Ask for the rate.",
  },
  "products/ms-wiremesh": {
    title: "MS Wiremesh Manufacturer in Indore, 15 to 150 mm",
    description:
      "MS wiremesh we manufacture in Indore: 15 x 15 to 150 x 150 mm openings, 1.2 m x 15 m rolls, cut to size. Orders accepted across India. Ask for the rate.",
  },
  "products/gi-wiremesh": {
    title: "GI Wiremesh Manufacturer in Indore, 15 to 100 mm",
    description:
      "GI wiremesh we manufacture in Indore: 15 to 100 mm openings, zinc-coated, 1.2 m x 15 m rolls, cut to size. Orders across India. Ask for the rate.",
  },
  "products/gi-weldmesh": {
    title: "GI Weldmesh Jali in Indore: Rolls and Panels | HM Ibrahim",
    description:
      "GI welded mesh (weldmesh jali) in rolls and panels, 15 x 15 to 150 x 150 mm, cut to size at Siyaganj, Indore. Send the opening and area for the rate.",
  },
  "products/ms-weldmesh": {
    title: "MS Weldmesh Jali in Indore: Rolls and Panels | HM Ibrahim",
    description:
      "MS welded mesh (weldmesh jali) in rolls and panels, 15 x 15 to 150 x 150 mm, cut to size at Siyaganj, Indore. Send the opening and area for the rate.",
  },
  "products/pvc-coated-weldmesh": {
    title: "PVC Coated Weldmesh in Indore: Green, 25 mm Grid",
    description:
      "Green PVC coated welded mesh, 25 x 25 mm grid, 3 ft x 15 m rolls, cut to size at Siyaganj, Indore. For fences and cages. Ask for the rate.",
  },
  "products/crimp-wiremesh": {
    title: "Crimp Wiremesh in Indore: 15 to 150 mm, MS and GI",
    description:
      "Crimped wire mesh in MS and GI, 15 x 15 to 150 x 150 mm, 1.2 m x 15 m rolls, cut to size at Siyaganj, Indore. For sieves and screens. Ask for the rate.",
  },
  "products/chicken-net": {
    title: "GI Chicken Mesh (Murga Jali) in Indore, 25 mm | HM Ibrahim",
    description:
      "Hexagonal galvanised chicken mesh (murga jali), 25 mm, 1 m x 30 m rolls, cut by the metre at Siyaganj, Indore. For poultry and cages. Ask for the rate.",
  },
  "products/expanded-metal-mesh": {
    title: "Expanded Metal Mesh (Jali) in Indore: Sheets, Rolls",
    description:
      "Expanded metal jali, plain, painted or galvanised: 0.5, 1.0, 1.5 mm strand, 1.2 x 2.4 m sheets and 0.5 mm rolls at Siyaganj, Indore. Ask for the rate.",
  },
  "products/aluminium-wiremesh": {
    title: "Aluminium Wiremesh (Aluminium Jali) in Indore | HM Ibrahim",
    description:
      "Aluminium jali, 18 x 16 per inch mesh count, 3 ft and 4 ft widths, cut to size at Siyaganj, Indore. Rust-free screening. Send width and length for a rate.",
  },
  "products/plastic-hexagonal-poultry-mesh": {
    title: "Plastic Hexa Mesh (PVC Hexa Net) in Indore, 25 mm",
    description:
      "Green and white plastic hexagonal mesh, 25 mm opening, 1.2 m x 25 m rolls for poultry runs and garden fencing at Siyaganj, Indore. Ask for the rate.",
  },
  "products/square-mesh": {
    title: "Plastic Square Mesh in Indore: 10 mm, Blue, Green",
    description:
      "Plastic square mesh, 10 x 10 mm holes, 1 m x 25 m rolls in blue and green for gardens and light barriers at Siyaganj, Indore. Ask for the rate.",
  },
  "products/ms-angles": {
    title: "MS Angle in Indore: 20 to 100 mm, 3 to 10 mm | HM Ibrahim",
    description:
      "MS angle iron, 20 x 20 to 100 x 100 mm, 3 to 10 mm thick, 6 m and 12 m, commonly IS 2062, retail and wholesale at Siyaganj, Indore. Ask for the rate.",
  },
  "products/ms-flats": {
    title: "MS Flat Bars in Indore: 12 to 150 mm Wide | HM Ibrahim",
    description:
      "MS flats 12 to 150 mm wide, 3 to 12 mm thick, in 6 m and 12 m lengths, retail and wholesale at Siyaganj, Indore. Send size and quantity for the rate.",
  },
  "products/bright-bars": {
    title: "Bright Bars in Indore: 8 to 40 mm, Bright Drawn | HM Ibrahim",
    description:
      "Bright drawn steel bars, 8 to 40 mm, 6 m length, for shafts, pins and machined parts at Siyaganj, Indore. Send the diameter and quantity for the rate.",
  },
  "products/tmt-bars": {
    title: "TMT Bars (Sariya) in Indore: 6 to 32 mm, Fe 500 | HM Ibrahim",
    description:
      "TMT sariya in 6, 8, 10, 12, 16, 20, 25 and 32 mm, typically 12 m, Fe 500 and Fe 550, retail and wholesale at Siyaganj, Indore. Ask for the rate.",
  },
  "products/ms-round-bars": {
    title: "MS Round Bars and Rods in Indore: 6 to 50 mm | HM Ibrahim",
    description:
      "MS round bars and rods, 6 to 50 mm diameter, 6 m and 12 m lengths, black or bright, at Siyaganj, Indore. Send the diameter and quantity for the rate.",
  },
  "products/ms-channels": {
    title: "MS Channels in Indore: 75 to 300 mm, ISMC | HM Ibrahim",
    description:
      "MS channels, 75 to 300 mm (ISA and ISMC sections), 6 m and 12 m lengths, retail and wholesale at Siyaganj, Indore. Send the size and quantity for the rate.",
  },
  "products/ms-i-beams-joists": {
    title: "MS I-Beams and Joists in Indore: 75 to 300 mm | HM Ibrahim",
    description:
      "MS I-beams and joists, 75 to 300 mm (ISMB and ISJB), IS 2062 mild steel, 6 m and 12 m lengths at Siyaganj, Indore. Send the size for the rate.",
  },
  "products/gi-pipes": {
    title: "GI Pipes in Indore: 15 to 150 mm NB, Light to Heavy",
    description:
      "GI pipes in 15 to 150 mm NB, light, medium and heavy class, 6 m standard length, for water lines and fencing at Siyaganj, Indore. Ask for the rate.",
  },
  "products/ms-pipes": {
    title: "MS Pipes in Indore: 15 to 300 mm NB, Square Tube",
    description:
      "MS round pipe, 15 to 300 mm NB in 6 m lengths, plus square and rectangular hollow sections, at Siyaganj, Indore. Send size and wall thickness for the rate.",
  },
  "products/ms-holepass": {
    title: "MS Holepass (Hole Pass) Bracket in Indore | HM Ibrahim",
    description:
      "Galvanised mild steel L-shaped holepass angle bracket with a central large hole and smaller fastener holes, at Siyaganj, Indore. Ask for the rate.",
  },
  "products/frp-bars": {
    title: "FRP Bars in Indore: 6 to 20 mm, 4 to 6 ft Rods | HM Ibrahim",
    description:
      "Glass fibre reinforced polymer (FRP) bars, 6 to 20 mm, in 4, 5 and 6 ft rods, at Siyaganj, Indore. Send the diameter and quantity for the rate.",
  },
  "products/gi-wire": {
    title: "GI Wire Gauges in Indore: 8 to 18 SWG, Packs | HM Ibrahim",
    description:
      "GI wire 8 to 18 SWG (4.06 to 1.22 mm), sold by weight in 5, 10 and 25 kg packs, plus Tata Wiron farming wire at Siyaganj, Indore. Ask for the rate.",
  },
  "products/binding-wire": {
    title: "Binding Wire (Kala Taar) in Indore: 16 to 18 SWG",
    description:
      "Black annealed binding wire (kala taar), 16 to 18 SWG, in coils up to 50 kg for tying rebar and general site work at Siyaganj, Indore. Ask for the rate.",
  },
  "products/jhatka-machine-fencing-wire": {
    title: "Jhatka Machine Fencing Wire in Indore, 1.5 mm | HM Ibrahim",
    description:
      "GI steel jhatka wire, 1.5 mm, in 100 m coils for farm boundaries and jhatka machines at Siyaganj, Indore. Send the length you need for the rate.",
  },
  "products/clutch-wire": {
    title: "Clutch Wire in Indore: Spools and Coils | HM Ibrahim",
    description:
      "Clutch wire for clutch cables in thin gauge, galvanised or coated as per stock, in spools and coils at Siyaganj, Indore. Tell us the gauge for the rate.",
  },
  "products/ms-wire-rope": {
    title: "MS Wire Rope in Indore: 2 to 20 mm, by the Metre",
    description:
      "MS wire rope, 2 to 20 mm and above, cut to length by the metre or full 500 m reel, at Siyaganj, Indore. Send the diameter and length for the rate.",
  },
  "products/gi-wire-rope": {
    title: "GI Wire Rope in Indore: 2 to 20 mm, by the Metre",
    description:
      "GI wire rope, 2 to 20 mm and above, cut to length by the metre or full 500 m reel, at Siyaganj, Indore. Send the diameter and length for the rate.",
  },
  "products/ss-wire-rope": {
    title: "SS Wire Rope in Indore: 2 to 20 mm, by the Metre",
    description:
      "Stainless steel wire rope from 2 mm to 20 mm and above, cut to your length by the metre or full 305 m reel, at Siyaganj, Indore. Send diameter and length.",
  },
  "products/wire-rope-clamp": {
    title: "Wire Rope Clamp (U-Bolt Clip) in Indore, Galvanised",
    description:
      "Galvanised U-bolt wire rope clips for joining and ending wire rope, at Siyaganj, Indore. Send the rope diameter and quantity for the rate.",
  },
  "products/concertina-wire": {
    title: "Concertina Wire in Indore: 450 and 600 mm Coils | HM Ibrahim",
    description:
      "Single and double coil concertina wire, 450 mm (8 m opened) and 600 mm (9 m opened) coils, supplied at Siyaganj, Indore. Send the quantity for the rate.",
  },
  "products/fiber-mesh": {
    title: "Fibermesh (Fibreglass Mesh) in Indore: 4 in to 1 m",
    description:
      "Fibreglass reinforcement mesh for plaster and render, 4 in, 6 in, 8 in and 1 m widths, to resist cracks at joints, at Siyaganj, Indore. Ask for the rate.",
  },
  "products/santing-shikanja": {
    title: "Shikanja (Santing) Shuttering Clamp in Indore | HM Ibrahim",
    description:
      "Heavy-duty shikanja shuttering clamps, 600 mm and 900 mm, sold by the piece for formwork and centering at Siyaganj, Indore. Ask for the rate.",
  },
  "products/concrete-cover-block": {
    title: "Concrete Cover Blocks in Indore for RCC Rebar Cover",
    description:
      "Concrete cover blocks (spacers) to hold rebar cover in slabs, beams and columns, at Siyaganj, Indore. Tell us the cover and quantity for the rate.",
  },
  "products/welding-rods": {
    title: "Welding Rods in Indore: E6013, E7018, 2.5 to 4 mm",
    description:
      "Arc welding electrodes E6013 and E7018 in 2.5, 3.15 and 4.0 mm, 1 kg and 5 kg boxes, at Siyaganj, Indore. Send the type and size for the rate.",
  },
  "products/sponge": {
    title: "Construction Sponge in Indore for Finishing Work",
    description:
      "Construction sponge for cleaning and finishing plaster and tile work, in small, medium and large sizes as available, at Siyaganj, Indore. Ask for the rate.",
  },
  "products/cutting-discs-grinding-wheels": {
    title: "Cutting Discs, Grinding Wheels in Indore, 4 to 7 in",
    description:
      "Metal cutting discs (1 to 3 mm) and grinding wheels (6 mm), 4 to 7 inch, 22 mm bore, at Siyaganj, Indore. Send the diameter and quantity for the rate.",
  },
  "products/fasteners-nails": {
    title: "Wire Nails in Indore: 1 to 6 Inch | HM Ibrahim",
    description:
      "Wire nails from 1 to 6 inch, sold by weight at Siyaganj, Indore, retail and wholesale. Send the size and quantity for the rate.",
  },
  "products/roofing-nail": {
    title: "Roofing Nails in Indore: 1.5 to 6 Inch, Wide Head",
    description:
      "Roofing nails with a wide flat head, 1.5 to 6 inch, for sheets and felt, sold by weight at Siyaganj, Indore. Send the size and quantity for the rate.",
  },
  "products/pigeon-nets": {
    title: "Pigeon Net (Kabootar Jali) in Indore: 3 to 20 ft",
    description:
      "Knotted nylon and HDPE pigeon net, 50 x 50 mm mesh, 3 to 20 ft wide, cut to your length at Siyaganj, Indore. Send the width and length for the rate.",
  },
  "products/pigeon-spikes": {
    title: "Pigeon Spikes (Bird Spikes) in Indore, 30 cm Strips",
    description:
      "Plastic and SS bird spikes in 30 cm strips, by the running metre or 10-strip, 3 m packs, for ledges and parapets at Siyaganj, Indore. Ask for the rate.",
  },
  "products/safety-net": {
    title: "Safety Net for Construction Sites in Indore, 5 x 10 m",
    description:
      "Debris net, nylon and polyethylene, 5 x 10 m, 50 x 50 mm mesh, for sites and scaffolding at Siyaganj, Indore. Not fall protection. Ask for the rate.",
  },
  "products/mosquito-net": {
    title: "Mosquito Net (Machhar Jali) in Indore | HM Ibrahim",
    description:
      "Mosquito mesh in rolls: fibreglass, aluminium, GI and stainless steel, cut to your window size at Siyaganj, Indore. Tell us the width and mesh count.",
  },
  "products/ss-fine-mesh": {
    title: "SS Fine Mesh and SS Mosquito Net, Indore | HM Ibrahim",
    description:
      "Stainless steel fine mesh in rolls for insect screens, filters and sieving. Rust and rat resistant. Siyaganj, Indore. Send mesh count and width for a rate.",
  },
  "products/gi-perforated-sheet": {
    title: "GI Perforated Sheet (Chaddar Jali), Indore | HM Ibrahim",
    description:
      "GI perforated sheet, 0.5 to 3 mm, 4 x 8 ft sheets, round, square, slot and hexagonal holes, cut to size at Siyaganj, Indore. Ask for the rate.",
  },
  "products/ms-perforated-sheet": {
    title: "MS Perforated Sheet (Chaddar Jali), Indore | HM Ibrahim",
    description:
      "MS perforated sheet, 0.5 to 3 mm, 4 x 8 ft sheets, round, square and slot holes, cut to size at Siyaganj, Indore. SS and aluminium sheet on request.",
  },
  "products/sr-crowbar": {
    title: "SR Crowbar (Sabbal) in Indore | HM Ibrahim, Siyaganj",
    description:
      "SR brand crowbar (sabbal) for demolition, prying and hard-ground digging, in stock at the Siyaganj counter, Indore. Tell us the length for a rate.",
  },
  "products/sr-hoe-faurdha": {
    title: "SR Shovel Blade (Faurdha, Phawda) in Indore | HM Ibrahim",
    description:
      "SR brand shovel blade (faurdha, phawda) for farm, garden and site digging, from Siyaganj, Indore. Need it ready to use? See the shovel with handle.",
  },
  "products/sr-hoe-faurdha-with-handle": {
    title: "SR Shovel (Faurdha, Phawda) with Handle, Indore | HM Ibrahim",
    description:
      "SR carbon steel shovel (faurdha, phawda) with fitted handle, ready to use for farm, garden and site work. Green and black as per stock. Siyaganj, Indore.",
  },
  "products/sr-pickaxe-geti": {
    title: "SR Pickaxe (Geti) in Indore | HM Ibrahim, Siyaganj",
    description:
      "SR brand pickaxe (geti) heads for hard ground, trench work and demolition, at the Siyaganj counter in Indore. Retail and wholesale. Ask for the rate.",
  },
  "products/sr-sledge-hammer": {
    title: "SR Sledge Hammer (Ghan) 5M, 10M, 15M, Indore | HM Ibrahim",
    description:
      "SR brand sledge hammer heads in 5M, 10M and 15M for breaking and driving stakes, at the Siyaganj counter, Indore. Ask for handle options and the rate.",
  },

  // ---- Blog posts
  "blog/barbed-wire-vs-concertina-wire": {
    title: "Barbed Wire vs Concertina Wire: Which to Fit | HM Ibrahim",
    description:
      "Barbed wire or concertina wire for your boundary? Security level, cost, fixing and where each one fits, from the Siyaganj counter in Indore.",
  },
  "blog/best-practices-storing-steel-wire-warehouse": {
    title: "How to Store Steel and Wire in a Warehouse | HM Ibrahim",
    description:
      "Keep steel bars, wire coils and mesh dry, off the ground and easy to count. Rust, stacking and handling tips from an Indore stockist.",
  },
  "blog/common-mistakes-buying-steel-sections": {
    title: "Mistakes to Avoid When Buying Steel Angles, Flats",
    description:
      "Wrong size, wrong grade, no weight check. The common mistakes when buying MS angles, flats and channels in Indore, and how to avoid them.",
  },
  "blog/concrete-cover-blocks-why-cover-matters-slab-beam-column": {
    title: "Concrete Cover Blocks: Why 20 mm Cover Matters",
  },
  "blog/expanded-metal-mesh-uses-types-indore": {
    title: "Expanded Metal Mesh (Jali): Uses and How to Order",
  },
  "blog/farm-fencing-madhya-pradesh-posts-wire-angle-plan": {
    title: "Farm Fencing in Madhya Pradesh: Posts, Wire, Angle",
  },
  "blog/fibre-mesh-plaster-cracks-guide": {
    title: "Fibre Mesh for Plaster: Stop Cracks at Joints",
  },
  "blog/frp-bars-vs-tmt-bars-where-each-belongs": {
    title: "FRP Bars vs TMT Bars: Where Each One Belongs",
  },
  "blog/gi-wire-vs-ms-wire-binding-fencing": {
    title: "GI Wire vs MS Wire: Which for Binding and Fencing",
    description:
      "GI wire or MS (black) wire? Which one for tying rebar, fencing and farm work, what the zinc coat does, and what to ask for at the counter in Indore.",
  },
  "blog/how-bulk-buyers-save-cost-loha-mandi-indore": {
    title: "How Bulk Buyers Save Money in Loha Mandi, Indore",
    description:
      "How contractors and dealers cut the cost of iron and wire in Indore's Loha Mandi: combine the list, buy by weight, ask for the rate on repeat orders.",
  },
  "blog/how-to-choose-tmt-bars-indore": {
    title: "How to Choose TMT Bars (Sariya) in Indore: Fe 500, 550",
    description:
      "Fe 500, Fe 500D or Fe 550? How to choose TMT bars (sariya) for a house or a shed, which diameters are common, and what to check at the counter.",
  },
  "blog/how-to-estimate-material-quantity-fencing": {
    title: "How to Estimate Fencing Material: Posts, Wire, Mesh",
    description:
      "Measure the boundary, space the posts, add the corners and the gate, then work out wire, mesh and binding wire. A worked method from an Indore stockist.",
  },
  "blog/mosquito-net-types-fibreglass-ss-aluminium-indore": {
    title: "Mosquito Net for Windows: Fibreglass, SS, Aluminium",
  },
  "blog/nails-guide-wire-nails-roofing-nails-concrete-nails": {
    title: "Wire, Roofing and Concrete Nails: Which for Which Job",
  },
  "blog/perforated-sheet-hole-patterns-open-area-guide": {
    title: "Perforated Sheet Hole Patterns and Open Area Explained",
  },
  "blog/perforated-sheets-ms-vs-ss-applications": {
    title: "Perforated Sheets: MS vs GI, Patterns and Uses",
    description:
      "MS or GI perforated sheet? Hole patterns, thickness and where each one is used, explained plainly by an Indore stockist.",
  },
  "blog/pigeon-net-balcony-indore-mesh-size-fixing-guide": {
    title: "Pigeon Net for Balconies in Indore: Size and Fixing",
  },
  "blog/pigeon-spikes-netting-installation-guide": {
    title: "Pigeon Spikes and Netting: Installation Guide",
    description:
      "Spikes for ledges, net for open spaces. How to fit bird spikes and pigeon netting so they hold, with notes from the Siyaganj counter in Indore.",
  },
  "blog/siyaganj-market-guide-buying-iron-hardware-indore": {
    title: "Siyaganj Iron Market Guide: Buying Hardware in Indore",
  },
  "blog/tmt-bar-weight-chart-size-guide-indore": {
    title: "TMT Bar Weight Chart: 6 mm to 32 mm, Per Metre and Bar",
  },
  "blog/top-hardware-contractors-buy-siyaganj": {
    title: "Hardware Contractors Buy in Siyaganj: Checklist",
    description:
      "A site checklist of iron, wire, mesh, nails, tools and consumables that contractors buy at Siyaganj, Indore, grouped so nothing is missed.",
  },
  "blog/welded-wire-mesh-vs-chain-link": {
    title: "Welded Wire Mesh vs Chain Link: Cost, Strength, Use",
    description:
      "Welded mesh or chain link jali for your fence? Cost, strength, look and where each one is the better choice, compared plainly.",
  },
  "blog/wire-gauge-chart-swg-bwg-mm-guide": {
    title: "Wire Gauge Chart (SWG, BWG) in mm: Which Gauge for What",
  },
  "blog/wire-mesh-supplier-indore-types-uses-prices": {
    title: "Wire Mesh in Indore: Types, Uses, What Sets the Rate",
    description:
      "MS, GI, welded and crimp wire mesh: what each one is for, what moves the rate, and what to tell the supplier when you ask for a quote in Indore.",
  },
};

export function getSeoOverride(p: string): SeoOverride | undefined {
  return seoOverrides[p.replace(/^\/+|\/+$/g, "")];
}
