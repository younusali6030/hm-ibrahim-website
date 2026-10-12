/**
 * SEO landing pages under /indore/ for local search (wire mesh Indore, jaali Indore, etc.).
 * Keep content natural; no keyword stuffing.
 */

export const indorePageSlugs = [
  "wire-mesh",
  "chain-link-fencing-jaali",
  "barbed-wire",
  "perforated-sheets",
  "gi-wire",
  "construction-hardware",
] as const;

export type IndorePageSlug = (typeof indorePageSlugs)[number];

export type IndorePage = {
  slug: IndorePageSlug;
  title: string;
  description: string;
  h1: string;
  intro: string;
  specs: string[];
  useCases: string[];
  productSlugs: string[];
  /** Optional second paragraph */
  intro2?: string;
};

export const indorePages: Record<IndorePageSlug, IndorePage> = {
  "wire-mesh": {
    slug: "wire-mesh",
    // Owns: "wire mesh Indore", "wiremesh Indore", "welded wire mesh Indore". Not "jali" (see chain-link-fencing-jaali).
    title: "Wire Mesh in Indore: Welded, GI, MS, Crimp",
    description:
      "Wire mesh in Indore from Siyaganj: GI and MS weldmesh, PVC-coated weldmesh, GI and MS wiremesh and crimp mesh, in rolls and panels. Ask for the rate.",
    h1: "Wire Mesh in Indore",
    intro:
      "We sell wire mesh from our shop on Siyaganj Main Road, Indore. Welded mesh for slabs, cages and partitions. Woven and crimped mesh for screening and sifting. Rolls and panels, retail and wholesale.",
    intro2:
      "Tell us what the mesh is for, the opening size and the wire thickness. We check stock and call back with the rate. Many buyers call it weldmesh jali or wiremesh jali; it is the same family of products, and we will point you to the right one.",
    specs: [
      "Welded mesh (GI and MS): openings from 15 x 15 mm and 50 x 50 mm up to 150 x 150 mm, wire 3 to 5 mm",
      "PVC-coated weldmesh in rolls, for fencing and cages that stand outdoors",
      "Woven GI and MS wiremesh, and crimped wiremesh for screening and sifting",
      "Rolls and panels; cut sizes on request",
    ],
    useCases: ["RCC slab reinforcement", "Partitions and cages", "Machine guards and screening", "Sifting and filtration", "Garden and compound fencing"],
    productSlugs: ["gi-weldmesh", "ms-weldmesh", "pvc-coated-weldmesh", "gi-wiremesh", "ms-wiremesh", "crimp-wiremesh"],
  },
  "chain-link-fencing-jaali": {
    slug: "chain-link-fencing-jaali",
    // Owns: "jali Indore", "jaali Indore", "chain link fencing Indore", "jali for compound wall".
    title: "Jali and Chain Link Fencing in Indore",
    description:
      "Chain link jali in Indore: GI and PVC-coated rolls, 1 to 4 inch mesh, 3 to 10 ft high. CM, Border and Tata Wiron at our Siyaganj shop. Ask for the rate.",
    h1: "Jali and Chain Link Fencing in Indore",
    intro:
      "Chain link jali (jaali) is what most compound walls, school grounds and factory boundaries in Indore are fenced with. We sell it in rolls from our shop in Siyaganj, under our own CM and Border brands and as Tata Wiron.",
    intro2:
      "Choose the mesh opening, the wire thickness and the height of the roll. Smaller mesh and thicker wire cost more and last longer. PVC-coated roll lasts longer where it stays wet. Send us the perimeter and the height and we will work out the number of rolls.",
    specs: [
      "Mesh opening: 1, 2, 3 and 4 inch",
      "Wire: 1.5 mm to 4 mm",
      "Roll heights: 3 ft to 10 ft",
      "Finish: GI or PVC-coated, as per stock",
      "Brands: CM, Border and Tata Wiron",
    ],
    useCases: ["Compound and boundary fencing", "Sports grounds and schools", "Factory and warehouse perimeters", "Farm and plot fencing", "Cages and enclosures"],
    productSlugs: ["chain-link-fencing", "barbed-wire", "pvc-coated-weldmesh", "gi-wire"],
  },
  "barbed-wire": {
    slug: "barbed-wire",
    // Owns: "barbed wire Indore", "kata taar Indore", "concertina wire Indore" (product page /products/concertina-wire is the detail target).
    title: "Barbed and Concertina Wire in Indore",
    description:
      "Barbed wire (kata taar) and concertina wire in Indore: single and double strand, 12x14 and 14x14 gauge, coils to 25 kg. CM, Border, Tata Wiron.",
    h1: "Barbed and Concertina Wire in Indore",
    intro:
      "Barbed wire, or kata taar as it is asked for at the counter, is a regular line at our shop in Siyaganj, Indore. Single and double strand, 2-point and 4-point, in coils for farms, plots and boundaries.",
    intro2:
      "For a perimeter that needs more deterrent than plain barbed wire, we also stock concertina wire in single and double coil. Tell us the length of the boundary and whether it runs on posts or along a wall, and we will suggest the wire.",
    specs: [
      "Type: single strand and double strand, 2-point and 4-point barbs",
      "Common gauges: 12 x 14 and 14 x 14",
      "Coils: 5 kg, 10 kg, 20 kg and 25 kg, as per stock",
      "Finish: galvanised (GI)",
      "Brands: CM, Border and Tata Wiron",
      "Concertina wire in single and double coil",
    ],
    useCases: ["Farm boundaries", "Plot and compound fencing", "Wall-top security", "Industrial perimeters"],
    productSlugs: ["barbed-wire", "concertina-wire", "chain-link-fencing", "gi-wire", "jhatka-machine-fencing-wire"],
  },
  "perforated-sheets": {
    slug: "perforated-sheets",
    // Owns: "perforated sheet Indore". Category page /categories/perforated-sheets is the range page.
    title: "Perforated Sheets in Indore: MS and GI",
    description:
      "Perforated sheets in Indore: MS and GI, 0.5 to 3 mm thick, round, square, slot and hexagonal holes. Cut to size at our Siyaganj shop. Ask for the rate.",
    h1: "Perforated Sheets in Indore",
    intro:
      "We sell perforated sheet from our shop in Siyaganj, Indore, in mild steel and galvanised iron. You pick the thickness, the hole shape and the open area. We cut it to the size you need.",
    intro2:
      "Hole size and pitch decide how much air or material passes through. If you are not sure, tell us what the sheet is for (a screen, a guard, ventilation, a filter) and we will suggest a pattern.",
    specs: [
      "Material: mild steel (MS) and galvanised iron (GI)",
      "Thickness: 0.5 mm to 3 mm",
      "Holes: round, square, slot and hexagonal (GI)",
      "Custom sizes on request",
    ],
    useCases: ["Screens and partitions", "Machine guards", "Ventilation panels", "Filtration and sieving", "Decorative cladding"],
    productSlugs: ["gi-perforated-sheet", "ms-perforated-sheet", "expanded-metal-mesh", "gi-weldmesh"],
  },
  "gi-wire": {
    slug: "gi-wire",
    // Owns: "GI wire Indore", "galvanised wire Indore". "binding wire / kala taar" -> /products/binding-wire.
    title: "GI Wire in Indore: Gauges and Coils",
    description:
      "GI wire in Indore from Siyaganj: 8 to 18 SWG in coils, with Tata Wiron GI wire in stock. Binding wire (kala taar) also at the counter. Ask for the rate.",
    h1: "GI Wire in Indore",
    intro:
      "GI wire is zinc-coated steel wire. It is used for tying, fencing, hanging and general work outdoors, where plain wire would rust. We stock it in coils at our shop in Siyaganj, Indore, including Tata Wiron.",
    intro2:
      "For tying rebar on site the usual wire is black annealed binding wire, called kala taar at the counter, in 16 to 18 SWG. Tell us the job and we will give you the right gauge. A bigger gauge number means thinner wire.",
    specs: [
      "GI wire: 8 SWG to 18 SWG in coils",
      "Tata Wiron GI wire in stock",
      "Binding wire (annealed): 16 to 18 SWG, coils up to 50 kg",
      "Jhatka machine wire and fencing wire coils",
    ],
    useCases: ["Tying and binding", "Fencing and tension lines", "Hanging and tie-downs", "Farm use", "RCC binding (annealed binding wire)"],
    productSlugs: ["gi-wire", "binding-wire", "jhatka-machine-fencing-wire", "gi-wire-rope", "barbed-wire"],
  },
  "construction-hardware": {
    slug: "construction-hardware",
    title: "Construction Hardware in Indore",
    description:
      "Construction hardware in Indore: crowbar, pickaxe (geti), hoe (faurdha), sledge hammer, shikanja, welding rods, nails, cutting discs. Siyaganj shop.",
    h1: "Construction Hardware in Indore",
    intro:
      "Site tools and consumables from our shop in Siyaganj, Indore: crowbar, pickaxe (geti), hoe (faurdha), sledge hammer, shikanja for shuttering, cover blocks, welding rods, cutting discs and nails.",
    intro2:
      "Most of the tools are SR brand. Buy one piece or a carton for the site. Tell us what you are building or repairing and we will put the list together.",
    specs: [
      "SR crowbar, pickaxe (geti), hoe (faurdha) and sledge hammer (5M, 10M, 15M)",
      "Shikanja clamps for slab and beam shuttering",
      "Concrete cover blocks in 20 to 50 mm cover",
      "Welding rods, cutting discs and grinding wheels",
      "Wire nails and roofing nails",
    ],
    useCases: ["Site work and digging", "Demolition", "Slab and beam shuttering", "Welding and fabrication", "General construction"],
    productSlugs: ["sr-crowbar", "sr-pickaxe-geti", "sr-hoe-faurdha", "sr-sledge-hammer", "santing-shikanja", "concrete-cover-block", "welding-rods", "cutting-discs-grinding-wheels", "fasteners-nails"],
  },
};

export function getIndorePage(slug: string): IndorePage | null {
  if (indorePageSlugs.includes(slug as IndorePageSlug)) {
    return indorePages[slug as IndorePageSlug];
  }
  return null;
}
