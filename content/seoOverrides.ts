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
      "Crowbar (sabbal), sledge hammer (ghan), pickaxe (geti), hoe (faurdha, phawda), shikanja, cover blocks, welding rods and cutting discs at Siyaganj, Indore.",
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
    title: "Barbed Wire: 12 x 14 Gauge, Coils, Rate | HM Ibrahim",
    description:
      "Barbed wire we manufacture: single and double strand, 12 x 14 and 14 x 14 gauge, coils to 25 kg. Orders accepted across India. Ask for the rate.",
  },
  "products/chain-link-fencing": {
    title: "Chain Link Fencing: Mesh, Wire, Height | HM Ibrahim",
    description:
      "Chain link fencing we manufacture: 1 to 4 inch mesh, 1.5 to 4 mm wire, 3 to 10 ft rolls, GI or PVC-coated. Orders accepted across India. Ask for the rate.",
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
      "Galvanised perforated sheet, 0.5 to 3 mm, in round, square, slot and hexagonal holes, cut to size at Siyaganj, Indore. Ask for the rate.",
  },
  "products/ms-perforated-sheet": {
    title: "MS Perforated Sheet (Chaddar Jali), Indore | HM Ibrahim",
    description:
      "Mild steel perforated sheet, 0.5 to 3 mm, in round, square and slot holes, cut to size at Siyaganj, Indore. SS and aluminium sheet on request.",
  },
  "products/sr-crowbar": {
    title: "SR Crowbar (Sabbal) in Indore | HM Ibrahim, Siyaganj",
    description:
      "SR brand crowbar (sabbal) for demolition, prying and hard-ground digging, in stock at the Siyaganj counter, Indore. Tell us the length for a rate.",
  },
  "products/sr-hoe-faurdha": {
    title: "SR Hoe Blade (Faurdha, Phawda) in Indore | HM Ibrahim",
    description:
      "SR brand hoe blade (faurdha, phawda) for farm, garden and site digging, from Siyaganj, Indore. Need it ready to use? See the hoe with handle.",
  },
  "products/sr-hoe-faurdha-with-handle": {
    title: "SR Hoe (Faurdha, Phawda) with Handle, Indore | HM Ibrahim",
    description:
      "SR carbon steel hoe (faurdha, phawda) with fitted handle, ready to use for farm, garden and site work. Green and black as per stock. Siyaganj, Indore.",
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
    title: "TMT Bar Weight Chart: 8 mm to 32 mm, Per Metre and Bar",
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
