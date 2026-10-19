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
  "wire-rope",
  "weld-mesh",
  "ms-angles-channels",
  "ms-gi-pipes",
  "mosquito-net",
  "tmt-bars",
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
 * Everything else is stocked and supplied. Within wire mesh, product pages carry the claim only for MS and GI wiremesh
 * (owner-confirmed 13 Oct 2026, TASK-027); welded, crimp and other mesh product pages stay stockist wording.
 * The word "manufacture" may only appear on pages for these families;
 * tests/seo.test.mjs fails if it shows up in product or Indore copy for anything else.
 */
export const manufacturedProductSlugs = ["barbed-wire", "chain-link-fencing", "ms-wiremesh", "gi-wiremesh"] as const;

export const indorePages: Record<IndorePageSlug, IndorePage> = {
  "wire-mesh": {
    slug: "wire-mesh",
    // Owns: "wire mesh Indore", "wiremesh Indore". Not "jali" (see chain-link-fencing-jaali); not "weld mesh" (see weld-mesh).
    title: "Wire Mesh in Indore: GI and MS Manufacturer, Supplier",
    description:
      "We manufacture GI and MS wiremesh; weldmesh, PVC-coated and crimp mesh are stocked and supplied. Rolls and panels at Siyaganj, Indore. Ask for the rate.",
    h1: "Wire Mesh in Indore: GI and MS Wiremesh Manufacturer",
    topic: "wire mesh",
    intro:
      "We manufacture GI and MS wiremesh and sell it from our shop on Siyaganj Main Road, Indore. Welded mesh for slabs, cages and partitions, PVC-coated mesh for fences, and crimped mesh for screening are stocked and supplied alongside it. Rolls and panels, retail and wholesale, with orders accepted across India.",
    intro2:
      "Tell us what the mesh is for, the opening size and the wire thickness. We check stock and call back with the rate. Many buyers call it weldmesh jali or wiremesh jali; it is the same family of products, and we will point you to the right one. Welded and PVC-coated mesh, crimp mesh, expanded metal, mosquito net and SS fine mesh are stocked and supplied rather than made by us.",
    specs: [
      "Welded mesh, stocked (GI and MS): openings from 15 x 15 mm and 50 x 50 mm up to 150 x 150 mm, wire 3 to 5 mm",
      "PVC-coated weldmesh, stocked, in rolls, for fencing and cages that stand outdoors",
      "GI and MS wiremesh, made by us; crimped wiremesh, stocked, for screening and sifting",
      "Rolls and panels; cut sizes on request",
    ],
    useCases: ["RCC slab reinforcement", "Partitions and cages", "Machine guards and screening", "Sifting and filtration", "Garden and compound fencing"],
    productSlugs: ["gi-weldmesh", "ms-weldmesh", "pvc-coated-weldmesh", "gi-wiremesh", "ms-wiremesh", "crimp-wiremesh"],
    faqs: [
      {
        question: "Do you manufacture wire mesh in Indore?",
        answer:
          "We manufacture GI and MS wiremesh and sell it from our shop on Siyaganj Main Road, Indore. Welded mesh, PVC-coated mesh, crimp mesh, expanded metal, mosquito net, SS fine mesh and perforated sheet are stocked and supplied, not made by us.",
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
  "wire-rope": {
    slug: "wire-rope",
    // Owns: "wire rope Indore", "wire rope dealer Indore", "steel wire rope Indore". Specs stay on the product pages.
    title: "Wire Rope in Indore: MS, GI and SS, Cut to Length",
    description:
      "Wire rope in Indore: MS, GI and SS, 2 mm to 20+ mm, by the metre or full reel. Wire rope clamps too. Siyaganj shop, Indore. Ask for the rate.",
    h1: "Wire Rope in Indore",
    topic: "wire rope",
    intro:
      "We stock steel wire rope at our shop on Siyaganj Main Road, Indore, in three kinds: plain mild steel (MS), galvanised (GI) and stainless steel (SS). Diameters run from 2 mm to over 20 mm. Buy it by the metre, cut to your length at the counter, or by the full reel. Orders accepted across India.",
    intro2:
      "Choose by where the rope will work. MS rope is for dry or covered places, GI rope has a zinc coat for outdoor work, and SS rope is for damp, marine and corrosive places. Wire rope clamps (U-bolt clips) for making eyes and loops are at the same counter. We do not state lifting ratings here: tell us the job, the diameter and the length, and we will confirm the rope and call back with the rate.",
    specs: [
      "MS, GI and SS wire rope, 2 mm to 20+ mm diameter",
      "By the metre, cut to your length, or by the full reel: 500 m (MS, GI), 305 m (SS)",
      "Galvanised U-bolt wire rope clamps in sizes to fit the rope",
      "Retail and wholesale; orders accepted across India",
    ],
    useCases: ["Hoisting and pulling", "Rigging and tie-downs", "Fencing and tension lines", "Marine and corrosive places (SS)", "Workshops and sites"],
    productSlugs: ["ms-wire-rope", "gi-wire-rope", "ss-wire-rope", "wire-rope-clamp"],
    faqs: [
      {
        question: "Which wire rope should I buy: MS, GI or SS?",
        answer:
          "MS wire rope is plain steel for dry or covered places. GI wire rope has a zinc coat and is the usual choice outdoors. SS wire rope is for damp, marine and corrosive places and costs the most.",
      },
      {
        question: "Can I buy wire rope by the metre in Indore?",
        answer:
          "Yes. We cut wire rope to your length at our Siyaganj counter, or sell the full reel: 500 m for MS and GI, 305 m for SS.",
      },
      {
        question: "What should I tell you to get a rate for wire rope?",
        answer:
          "Tell us the job, the rope type (MS, GI or SS), the diameter, the length and the quantity. We check stock and call back with the rate.",
      },
      {
        question: "Do you supply wire rope outside Indore?",
        answer: "Orders accepted across India; delivery arrangements confirmed with each quotation. Send the quantity and the delivery town with your request.",
      },
    ],
  },
  "weld-mesh": {
    slug: "weld-mesh",
    // Owns: "weld mesh Indore", "weldmesh Indore", "welded wire mesh Indore", "weldmesh jali". Stocked, not made by the shop.
    title: "Weld Mesh in Indore: GI, MS and PVC Coated Weldmesh",
    description:
      "Weld mesh in Indore: GI and MS weldmesh, 15 x 15 to 150 x 150 mm openings, rolls and panels cut to size. PVC-coated rolls too. Siyaganj, Indore.",
    h1: "Weld Mesh in Indore",
    topic: "weld mesh",
    intro:
      "Weld mesh, also asked for as weldmesh jali, has its wires welded at every crossing, so it stays stiff and holds its shape. We stock it at our shop on Siyaganj Main Road, Indore, in galvanised (GI), plain mild steel (MS) and green PVC-coated, in rolls and panels. We cut it to size at the counter.",
    intro2:
      "GI weldmesh is the choice for fences, cages and anything that stays outdoors. MS weldmesh is uncoated and is used where it will be covered, such as RCC slabs and partitions. PVC-coated weldmesh lasts longest in the open. Tell us what the mesh is for, the opening, and the area or number of pieces, and we will call back with the rate.",
    specs: [
      "Openings: 15 x 15, 25 x 25, 50 x 50, 75 x 75, 100 x 100 and 150 x 150 mm (GI and MS)",
      "Roll: 1.5 m x 15 m, 25 x 25 mm opening, 2.5 mm wire",
      "Panel: 1.2 x 2.4 m, 50 x 50 mm opening, 3 mm wire",
      "PVC-coated roll: 3 ft x 15 m, 25 x 25 mm, green",
      "Cut to size at the counter; other wire sizes confirmed with the rate",
    ],
    useCases: ["RCC slab reinforcement", "Partitions", "Cages and enclosures", "Fencing and boundaries", "Machine guards"],
    productSlugs: ["gi-weldmesh", "ms-weldmesh", "pvc-coated-weldmesh"],
    faqs: [
      {
        question: "What is the difference between GI and MS weld mesh?",
        answer:
          "GI weld mesh is galvanised and does not rust easily, so it is used outdoors for fences and cages. MS weld mesh is plain, uncoated steel and is used where it will be covered, such as inside an RCC slab or behind plaster.",
      },
      {
        question: "Do you cut weld mesh to size?",
        answer: "Yes. Rolls and panels are cut to size at our Siyaganj counter. Tell us the sizes and the number of pieces.",
      },
      {
        question: "Is weld mesh the same as chain link jali?",
        answer:
          "No. Weld mesh has welded crossings and square openings and is stiff. Chain link jali is woven wire, flexible, and comes in tall rolls for boundary fencing.",
      },
      {
        question: "Do you supply weld mesh outside Indore?",
        answer: "Orders accepted across India; delivery arrangements confirmed with each quotation. Send the quantity and the delivery town with your request.",
      },
    ],
  },
  "ms-angles-channels": {
    slug: "ms-angles-channels",
    // Owns: "structural steel Indore", "MS sections Indore", "iron merchant Indore". Single sections ("MS angle Indore")
    // stay with their product pages, whose titles target them.
    title: "Structural Steel in Indore: MS Angle, Channel, Beam",
    description:
      "MS angles, channels, flats, I-beams and round bars in Indore: IS 2062 mild steel, 6 m and 12 m lengths. Siyaganj iron shop since 1939. Ask for the rate.",
    h1: "Structural Steel in Indore",
    topic: "structural steel (MS angles, channels, beams)",
    intro:
      "We stock mild steel sections at our shop on Siyaganj Main Road, Indore: angles, channels, flats, I-beams and joists, round bars and bright bars. Most sections are IS 2062 mild steel in 6 m and 12 m lengths, for fabricators, shed builders and site work. Availability of each size depends on stock.",
    intro2:
      "Tell us the section, the size, the thickness and the number of lengths, or send the fabrication list. We check stock and call back with the rate. Tata steel is available on request.",
    specs: [
      "MS angles: 20 x 20 to 100 x 100 mm, 3 to 10 mm thick, equal and unequal",
      "MS channels (ISMC) and I-beams, joists (ISMB, ISJB): 75 mm to 300 mm",
      "MS flats: 12 mm to 150 mm wide, 3 mm to 12 mm thick",
      "MS round bars 6 mm to 50 mm; bright bars 8 mm to 40 mm",
      "Lengths: 6 m and 12 m, as per section and stock",
    ],
    useCases: ["Fabrication and frames", "Industrial sheds and purlins", "Gates and grills", "Support brackets", "Machining (bright bars)"],
    productSlugs: ["ms-angles", "ms-channels", "ms-flats", "ms-i-beams-joists", "ms-round-bars", "bright-bars"],
    faqs: [
      {
        question: "Which MS angle sizes are asked for most?",
        answer: "25 x 25, 40 x 40, 50 x 50 and 75 x 75 mm are the sizes asked for most, in 3 mm to 10 mm thickness.",
      },
      {
        question: "What lengths do MS sections come in?",
        answer: "Most angles, channels, flats, beams and round bars come in 6 m or 12 m lengths, depending on the section and stock. Bright bars come in 6 m.",
      },
      {
        question: "What should I tell you to get a rate?",
        answer: "Tell us the section, the size, the thickness and the number of lengths, or send the fabrication list. We check stock and call back with the rate.",
      },
      {
        question: "Do you supply structural steel outside Indore?",
        answer: "Orders accepted across India; delivery arrangements confirmed with each quotation. Send the quantity and the delivery town with your request.",
      },
    ],
  },
  "ms-gi-pipes": {
    slug: "ms-gi-pipes",
    // Owns: "steel pipe Indore", "pipe dealer Indore". "GI pipe Indore" and "MS pipe Indore" stay with the product pages.
    title: "Steel Pipes in Indore: MS and GI, 15 to 300 mm NB",
    description:
      "MS and GI pipes in Indore: GI 15 to 150 mm NB in light, medium and heavy class; MS 15 to 300 mm NB, black or galvanised, 6 m. Cut at the counter.",
    h1: "Steel Pipes in Indore: MS and GI",
    topic: "MS and GI pipes",
    intro:
      "We stock steel pipe at our shop on Siyaganj Main Road, Indore. GI pipe comes in 15 mm (1/2 inch) to 150 mm (6 inch) NB in light, medium and heavy class, for water lines, fencing and structures. MS pipe comes in 15 mm to 300 mm NB, black or galvanised, for structures, handrails and conduit. Both come in 6 m lengths, and we cut to length at the counter.",
    intro2:
      "Square and rectangular hollow sections are also stocked; the width, depth and wall thickness are confirmed with the rate. Tell us the size, the class and the number of lengths and we will call back with the rate.",
    specs: [
      "GI pipe: 15 mm (1/2\") to 150 mm (6\") NB; light, medium and heavy class",
      "MS pipe: 15 mm to 300 mm NB, black or galvanised",
      "Square and rectangular hollow sections",
      "6 m lengths, cut to length at the counter",
    ],
    useCases: ["Water lines", "Structures and sheds", "Handrails", "Fencing posts", "Conduit"],
    productSlugs: ["gi-pipes", "ms-pipes"],
    faqs: [
      {
        question: "What is the difference between light, medium and heavy GI pipe?",
        answer:
          "The class is the wall thickness. Heavy class has the thickest wall and takes the most pressure and load; light class is thinnest and cheapest. Medium is the usual choice for water lines.",
      },
      {
        question: "Do you cut pipes to length?",
        answer: "Yes. Pipes come in 6 m lengths and we cut them to your length at our Siyaganj counter.",
      },
      {
        question: "What should I tell you to get a rate for pipes?",
        answer: "Tell us MS or GI, the NB size, the class, the number of lengths and what the pipe is for. We check stock and call back with the rate.",
      },
      {
        question: "Do you supply pipes outside Indore?",
        answer: "Orders accepted across India; delivery arrangements confirmed with each quotation. Send the quantity and the delivery town with your request.",
      },
    ],
  },
  "mosquito-net": {
    slug: "mosquito-net",
    // Owns: "mosquito net Indore", "machhar jali Indore", "mosquito mesh shop Indore". /products/mosquito-net keeps the roll specification.
    title: "Mosquito Net (Machhar Jali) in Indore: Cut to Size",
    description:
      "Mosquito net (machhar jali) in Indore: fibreglass, aluminium, GI and SS mesh in 3 ft and 4 ft rolls, cut to your window size at the Siyaganj counter.",
    h1: "Mosquito Net (Machhar Jali) in Indore",
    topic: "mosquito net",
    intro:
      "We sell mosquito net, called machhar jali in the market, from our shop on Siyaganj Main Road, Indore. It comes in fibreglass, aluminium, GI and stainless steel, in 3 ft and 4 ft wide rolls, and we cut it from the roll to the size of your window or door. It is sold by the square foot.",
    intro2:
      "Fibreglass is the usual choice for flats and bedroom windows. Aluminium and GI last longer on doors and ground-floor windows, and stainless steel is the one to pick where rats, heavy use or rust are a worry. Tell us the window size and where it goes and we will suggest the material.",
    specs: [
      "Material: fibreglass, aluminium, GI and stainless steel",
      "Mesh count: fibreglass 18 x 16, aluminium 18 x 16, GI 16 x 16, SS 20 x 20, per inch",
      "Roll width: 3 ft and 4 ft in each material",
      "Cut from the roll to your size; sold by the square foot",
    ],
    useCases: ["Window screens", "Door screens", "Balconies and ventilators", "Insect barriers", "Kitchens and godowns"],
    productSlugs: ["mosquito-net", "ss-fine-mesh"],
    faqs: [
      {
        question: "Which mosquito net lasts longest?",
        answer:
          "Stainless steel lasts longest and resists rust and rats. Aluminium and GI are firmer than fibreglass and suit doors and ground-floor windows. Fibreglass is the lightest and cheapest and is fine for upper-floor windows.",
      },
      {
        question: "Do you cut mosquito net to my window size?",
        answer: "Yes. It comes in 3 ft and 4 ft wide rolls and we cut the length you need at our Siyaganj counter. Bring the window width and height.",
      },
      {
        question: "What does the mesh count mean?",
        answer:
          "It is the number of wires per inch in each direction, for example 18 x 16. A higher count is finer and keeps out smaller insects but lets less air through.",
      },
      {
        question: "What should I tell you to get a rate for mosquito net?",
        answer: "Tell us the material, the width and height you need and how many windows or doors. We check stock and call back with the rate.",
      },
    ],
  },
  "tmt-bars": {
    slug: "tmt-bars",
    // Owns: "TMT bars Indore", "sariya Indore", "TMT bar supplier near me". /products/tmt-bars keeps sizes and grades; the weight chart stays in the blog.
    title: "TMT Bars (Sariya) in Indore: Fe 500, Fe 550",
    description:
      "TMT bars (sariya) in Indore: 6 to 32 mm, typically 12 m, Fe 500, Fe 500D and Fe 550. Retail and wholesale at Siyaganj. Ask for the rate.",
    h1: "TMT Bars (Sariya) in Indore",
    topic: "TMT bars",
    intro:
      "We stock TMT bars, called sariya in the market, at our shop on Siyaganj Main Road, Indore, for houses, shops and small buildings. Sizes run from 6 mm to 32 mm, typically in 12 m lengths, in Fe 500, Fe 500D and Fe 550. We sell retail and wholesale, and availability depends on stock.",
    intro2:
      "The sizes most often asked for in RCC work are 8, 10, 12, 16 and 20 mm. Tell us the diameter, the grade and the weight or number of bars you need and we will call back with the rate. Our TMT weight chart guide helps you work out how many kilograms a job will take.",
    specs: [
      "Diameter: 6, 8, 10, 12, 16, 20, 25 and 32 mm",
      "Length: typically 12 m",
      "Grades: Fe 500, Fe 500D and Fe 550",
      "Retail and wholesale; availability depends on stock",
    ],
    useCases: ["Foundations", "Columns and beams", "Slabs", "Lintels", "RCC boundary walls"],
    productSlugs: ["tmt-bars", "ms-round-bars", "frp-bars"],
    faqs: [
      {
        question: "Which TMT bar sizes do you stock?",
        answer: "6, 8, 10, 12, 16, 20, 25 and 32 mm, typically in 12 m lengths. Availability depends on stock, so confirm the size with us before you visit.",
      },
      {
        question: "What is the difference between Fe 500, Fe 500D and Fe 550?",
        answer:
          "The number is the yield strength in N/mm2. Fe 550 is the strongest. The D grades are more ductile, which matters in earthquake zones. Your engineer's drawing names the grade to use.",
      },
      {
        question: "What should I tell you to get a rate for sariya?",
        answer: "Tell us the diameter, the grade, the weight or number of bars and the delivery town. We check stock and call back with the rate.",
      },
      {
        question: "Do you deliver TMT bars outside Indore?",
        answer: "Orders accepted across India; delivery arrangements confirmed with each quotation. Send the quantity and the delivery town with your request.",
      },
    ],
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
  "gi-weldmesh": "weld-mesh",
  "ms-weldmesh": "weld-mesh",
  "pvc-coated-weldmesh": "weld-mesh",
  "ms-wire-rope": "wire-rope",
  "gi-wire-rope": "wire-rope",
  "ss-wire-rope": "wire-rope",
  "wire-rope-clamp": "wire-rope",
  "ms-angles": "ms-angles-channels",
  "ms-channels": "ms-angles-channels",
  "ms-flats": "ms-angles-channels",
  "ms-i-beams-joists": "ms-angles-channels",
  "ms-round-bars": "ms-angles-channels",
  "bright-bars": "ms-angles-channels",
  "mosquito-net": "mosquito-net",
  "ss-fine-mesh": "mosquito-net",
  "tmt-bars": "tmt-bars",
  "gi-pipes": "ms-gi-pipes",
  "ms-pipes": "ms-gi-pipes",
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
