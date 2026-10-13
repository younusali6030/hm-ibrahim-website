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
  /** Short product phrase for the WhatsApp message and contact strip, when the H1 is not a clean "<topic> in Indore". */
  topic?: string;
  /** Visible FAQs; also emitted as FAQPage JSON-LD. Only on pages whose questions are answered on the page. */
  faqs?: { question: string; answer: string }[];
};

/**
 * Manufacturing scope, owner-confirmed 12 Oct 2026: the shop manufactures barbed wire, chain link fencing and wire mesh.
 * Everything else is stocked and supplied. The word "manufacture" may only appear on pages for these three families;
 * tests/seo.test.mjs fails if it shows up in product or Indore copy for anything else.
 */
export const manufacturedProductSlugs = ["barbed-wire", "chain-link-fencing"] as const;

export const indorePages: Record<IndorePageSlug, IndorePage> = {
  "wire-mesh": {
    slug: "wire-mesh",
    // Owns: "wire mesh Indore", "wiremesh Indore", "welded wire mesh Indore". Not "jali" (see chain-link-fencing-jaali).
    title: "Wire Mesh Manufacturer and Supplier in Indore",
    description:
      "We manufacture wire mesh: GI and MS weldmesh, PVC-coated weldmesh, woven and crimp mesh, in rolls and panels. Siyaganj, Indore. Ask for the rate.",
    h1: "Wire Mesh Manufacturer in Indore",
    topic: "wire mesh",
    intro:
      "We manufacture wire mesh and sell it from our shop on Siyaganj Main Road, Indore. Welded mesh for slabs, cages and partitions. Woven and crimped mesh for screening and sifting. Rolls and panels, retail and wholesale, with orders accepted across India.",
    intro2:
      "Tell us what the mesh is for, the opening size and the wire thickness. We check stock and call back with the rate. Many buyers call it weldmesh jali or wiremesh jali; it is the same family of products, and we will point you to the right one. Other mesh in our range, such as expanded metal, mosquito net and SS fine mesh, is stocked and supplied rather than made by us.",
    specs: [
      "Welded mesh (GI and MS): openings from 15 x 15 mm and 50 x 50 mm up to 150 x 150 mm, wire 3 to 5 mm",
      "PVC-coated weldmesh in rolls, for fencing and cages that stand outdoors",
      "Woven GI and MS wiremesh, and crimped wiremesh for screening and sifting",
      "Rolls and panels; cut sizes on request",
    ],
    useCases: ["RCC slab reinforcement", "Partitions and cages", "Machine guards and screening", "Sifting and filtration", "Garden and compound fencing"],
    productSlugs: ["gi-weldmesh", "ms-weldmesh", "pvc-coated-weldmesh", "gi-wiremesh", "ms-wiremesh", "crimp-wiremesh"],
    faqs: [
      {
        question: "Do you manufacture wire mesh in Indore?",
        answer:
          "Yes. We manufacture wire mesh and sell it from our shop on Siyaganj Main Road, Indore. Expanded metal, mosquito net, SS fine mesh and perforated sheet are stocked and supplied, not made by us.",
      },
      {
        question: "What is the difference between weldmesh and wiremesh?",
        answer:
          "Weldmesh has its wires welded at every crossing, so it is stiff and holds its shape. It is used for slab reinforcement, cages, partitions and fence panels. Wiremesh is woven or crimped from wire, and it is used for screening, sifting and guards.",
      },
      {
        question: "What should I tell you to get a rate for wire mesh?",
        answer:
          "Tell us what it is for, the opening size, the wire thickness, whether you want GI, MS or PVC-coated, roll or panel, and the quantity. We check stock and call back with the rate.",
      },
      {
        question: "Do you supply wire mesh outside Indore?",
        answer: "Orders accepted across India; delivery arrangements confirmed with each quotation. Send the quantity and the delivery town with your request.",
      },
    ],
  },
  "chain-link-fencing-jaali": {
    slug: "chain-link-fencing-jaali",
    // Owns: "jali Indore", "jaali Indore", "chain link fencing Indore", "jali for compound wall".
    title: "Chain Link Fencing Manufacturer, Jali in Indore",
    description:
      "We manufacture chain link fencing (jali): GI and PVC-coated rolls, 1 to 4 inch mesh, 3 to 10 ft high. CM, Border and Tata Wiron at Siyaganj, Indore.",
    h1: "Chain Link Fencing and Jali Manufacturer in Indore",
    topic: "chain link fencing (jali)",
    intro:
      "Chain link jali (jaali) is what most compound walls, school grounds and factory boundaries in Indore are fenced with. We manufacture chain link fencing and sell it in rolls from our shop in Siyaganj, under our own CM and Border brands. Tata Wiron, also in stock, is Tata's product, which we supply as an authorised dealer.",
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
    faqs: [
      {
        question: "Do you manufacture chain link fencing in Indore?",
        answer:
          "Yes. We manufacture chain link fencing and sell it from our shop on Siyaganj Main Road, Indore. Tata Wiron chain link, which we also stock, is made by Tata and supplied by us as an authorised dealer.",
      },
      {
        question: "Which mesh size and wire thickness should I choose?",
        answer:
          "A smaller opening and thicker wire cost more and last longer. We have 1, 2, 3 and 4 inch openings in wire from 1.5 mm to 4 mm. PVC-coated roll lasts longer where the fence stays wet.",
      },
      {
        question: "How do I work out how many rolls I need?",
        answer:
          "Measure the perimeter and the height you want, then allow for the gate and the corners. Send us the perimeter and the height and we will work out the number of rolls and the posts.",
      },
      {
        question: "Do you supply chain link outside Indore?",
        answer: "Orders accepted across India; delivery arrangements confirmed with each quotation. Send the quantity and the delivery town with your request.",
      },
    ],
  },
  "barbed-wire": {
    slug: "barbed-wire",
    // Owns: "barbed wire Indore", "kata taar Indore", "concertina wire Indore" (product page /products/concertina-wire is the detail target).
    title: "Barbed Wire Manufacturer in Indore | Kata Taar",
    description:
      "We manufacture barbed wire (kata taar): single and double strand, 12 x 14 and 14 x 14 gauge, coils to 25 kg. Concertina also stocked. Siyaganj, Indore.",
    h1: "Barbed Wire Manufacturer in Indore",
    topic: "barbed wire (kata taar)",
    intro:
      "We manufacture barbed wire, or kata taar as it is asked for at the counter, and sell it from our shop in Siyaganj, Indore. Single and double strand, 2-point and 4-point, in coils for farms, plots and boundaries. Orders accepted across India.",
    intro2:
      "For a perimeter that needs more deterrent than plain barbed wire, we also stock concertina wire in single and double coil. Concertina is supplied by us, not made by us. Tell us the length of the boundary and whether it runs on posts or along a wall, and we will suggest the wire.",
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
    faqs: [
      {
        question: "Do you manufacture barbed wire in Indore?",
        answer:
          "Yes. We manufacture barbed wire and sell it from our shop on Siyaganj Main Road, Indore. Tata Wiron barbed wire, which we also stock, is made by Tata and supplied by us as an authorised dealer.",
      },
      {
        question: "What does 12 x 14 mean on barbed wire?",
        answer:
          "The first number is the gauge of the main line wire and the second is the gauge of the barb wire wound round it. A smaller gauge number is thicker wire. On the SWG scale 12 is about 2.64 mm and 14 is about 2.03 mm. Ask us to confirm the diameter of the coil you are buying.",
      },
      {
        question: "Which is better for a boundary, barbed wire or concertina wire?",
        answer:
          "Barbed wire is the usual choice for farms, plots and compound boundaries. Concertina is coiled and gives a stronger deterrent on wall tops and industrial perimeters, at a higher cost. Our guide on barbed wire versus concertina wire compares them.",
      },
      {
        question: "Do you supply barbed wire outside Indore?",
        answer: "Orders accepted across India; delivery arrangements confirmed with each quotation. Send the quantity and the delivery town with your request.",
      },
    ],
  },
  "perforated-sheets": {
    slug: "perforated-sheets",
    // Owns: "perforated sheet Indore". Category page /categories/perforated-sheets is the range page.
    title: "Perforated Sheet (Chaddar Jali) in Indore: MS, GI",
    description:
      "Perforated sheet (chaddar jali) in Indore: MS and GI, 0.5 to 3 mm, round, square, slot and hexagonal holes. SS and aluminium on request. Siyaganj shop.",
    h1: "Perforated Sheets in Indore",
    intro:
      "We sell perforated sheet, called chaddar jali in the market, from our shop in Siyaganj, Indore, in mild steel and galvanised iron. Stainless steel and aluminium sheet are available on request. You pick the thickness, the hole shape and the open area. We cut it to the size you need.",
    intro2:
      "Chaddar jali is punched sheet, not expanded metal. Hole size and pitch decide how much air or material passes through. If you are not sure, tell us what the sheet is for (a screen, a guard, ventilation, a filter) and we will suggest a pattern.",
    specs: [
      "Material: mild steel (MS) and galvanised iron (GI); SS and aluminium on request",
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
      "Construction hardware in Indore: crowbar (sabbal), pickaxe (geti), shovel (faurdha, phawda), sledge hammer, shikanja, welding rods, nails, cutting discs. Siyaganj.",
    h1: "Construction Hardware in Indore",
    intro:
      "Site tools and consumables from our shop in Siyaganj, Indore: crowbar (sabbal), pickaxe (geti), shovel (faurdha or phawda), sledge hammer (ghan), shikanja for shuttering, cover blocks, welding rods, cutting discs and nails.",
    intro2:
      "Most of the tools are SR brand. Buy one piece or a carton for the site. Tell us what you are building or repairing and we will put the list together.",
    specs: [
      "SR crowbar (sabbal), pickaxe (geti), shovel (faurdha, phawda; blade or with handle) and sledge hammer (5M, 10M, 15M)",
      "Shikanja clamps for slab and beam shuttering",
      "Concrete cover blocks in 20 to 50 mm cover",
      "Welding rods, cutting discs and grinding wheels",
      "Wire nails and roofing nails",
    ],
    useCases: ["Site work and digging", "Demolition", "Slab and beam shuttering", "Welding and fabrication", "General construction"],
    productSlugs: ["sr-crowbar", "sr-pickaxe-geti", "sr-hoe-faurdha", "sr-hoe-faurdha-with-handle", "sr-sledge-hammer", "santing-shikanja", "concrete-cover-block", "welding-rods", "cutting-discs-grinding-wheels", "fasteners-nails"],
  },
};

/**
 * Which /indore/* page owns the local-buying intent for a product page. The product page keeps the specification
 * and range intent; the Indore page keeps "<product> Indore" (see docs/seo/keyword-map.md). One owner per product:
 * chain link appears in the barbed-wire page's list too, but its local intent belongs to the jali page.
 * tests/seo.test.mjs checks that every mapped product is listed on its owner page.
 */
export const localPageForProductSlug: Record<string, IndorePageSlug> = {
  "barbed-wire": "barbed-wire",
  "concertina-wire": "barbed-wire",
  "chain-link-fencing": "chain-link-fencing-jaali",
  "gi-wire": "gi-wire",
  "gi-wiremesh": "wire-mesh",
  "ms-wiremesh": "wire-mesh",
  "crimp-wiremesh": "wire-mesh",
  "gi-weldmesh": "wire-mesh",
  "ms-weldmesh": "wire-mesh",
  "pvc-coated-weldmesh": "wire-mesh",
  "gi-perforated-sheet": "perforated-sheets",
  "ms-perforated-sheet": "perforated-sheets",
  "sr-crowbar": "construction-hardware",
  "sr-pickaxe-geti": "construction-hardware",
  "sr-hoe-faurdha": "construction-hardware",
  "sr-hoe-faurdha-with-handle": "construction-hardware",
  "sr-sledge-hammer": "construction-hardware",
  "santing-shikanja": "construction-hardware",
};

export function getIndorePage(slug: string): IndorePage | null {
  if (indorePageSlugs.includes(slug as IndorePageSlug)) {
    return indorePages[slug as IndorePageSlug];
  }
  return null;
}
