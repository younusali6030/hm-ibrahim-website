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
    title: "Wire Mesh Indore | Welded & Sheet Mesh in Siyaganj",
    description: "Wire mesh and welded wire mesh in Indore. HM Ibrahim & Co, Siyaganj, supplies welded mesh, sheet mesh, and wire mesh for construction and fencing. Retail and wholesale.",
    h1: "Wire Mesh in Indore",
    intro: "We supply wire mesh and welded wire mesh from our store in Siyaganj, Indore. Whether you need mesh for RCC slabs, partitions, fencing, or screening, we stock a range of options and can source specific sizes and gauges.",
    intro2: "Our wire mesh range includes welded mesh in common grid sizes, sheet mesh, and related products. Available for retail and wholesale; contact us for sizes and pricing.",
    specs: [
      "Welded mesh: 15mm x 15mm, 50x50mm to 150x150mm grid",
      "Wire gauge and thickness as per application",
      "Sheet mesh and custom sizes on request",
    ],
    useCases: ["RCC slab reinforcement", "Partition panels", "Cages and enclosures", "Screening and fencing"],
    productSlugs: ["gi-weldmesh", "ms-weldmesh", "gi-wire", "chain-link-fencing", "ss-gi-mesh-jalies"],
  },
  "chain-link-fencing-jaali": {
    slug: "chain-link-fencing-jaali",
    title: "Chain Link Fencing & Jaali Indore | Jali in Siyaganj",
    description: "Chain link fencing and jaali (jali) in Indore. HM Ibrahim & Co, Siyaganj, supplies GI and PVC-coated chain link, compound fencing, and jali. Retail and wholesale.",
    h1: "Chain Link Fencing & Jaali in Indore",
    intro: "Chain link fencing and jaali (jali) are among our core products in Siyaganj, Indore. We stock galvanized and PVC-coated chain link in various mesh sizes and heights for compound fencing, boundaries, and industrial use.",
    intro2: "We also supply decorative and functional jalies for windows and grilles. Available in GI and SS options. Contact us for mesh size, height, and roll length.",
    specs: [
      "Mesh: 1\", 2\", 3\" common",
      "Heights: 3ft to 10ft rolls",
      "GI and PVC-coated options",
      "Signature brands: CM, Border",
    ],
    useCases: ["Compound fencing", "Boundary walls", "Sports grounds", "Industrial premises", "Window jali"],
    productSlugs: ["chain-link-fencing", "barbed-wire", "ss-gi-mesh-jalies"],
  },
  "barbed-wire": {
    slug: "barbed-wire",
    title: "Barbed Wire Indore | Security & Boundary Fencing in Siyaganj",
    description: "Barbed wire in Indore for boundary and security fencing. HM Ibrahim & Co, Siyaganj, supplies GI barbed wire in single and double strand. CM and Border brands. Retail and wholesale.",
    h1: "Barbed Wire in Indore",
    intro: "We supply barbed wire for boundary and security fencing from our Siyaganj, Indore store. Available in single and double strand, in various coil sizes, for farms, boundaries, and industrial sites.",
    intro2: "Our signature brands CM and Border offer trusted barbed wire options. Tell us your length and height requirements for a quote.",
    specs: [
      "Single strand and double strand",
      "2-point and 4-point common",
      "Coils: 5kg, 10kg, 20kg, 25kg (as per stock)",
      "Galvanized finish",
    ],
    useCases: ["Farm boundaries", "Security fencing", "Perimeter fencing", "Agricultural use"],
    productSlugs: ["barbed-wire", "chain-link-fencing", "gi-wire"],
  },
  "perforated-sheets": {
    slug: "perforated-sheets",
    title: "Perforated Sheets Indore | MS & GI Perforated Sheet in Siyaganj",
    description: "Perforated sheets in Indore. HM Ibrahim & Co, Siyaganj, supplies MS and GI perforated sheets for screening, ventilation, and filtration. Various patterns and thicknesses.",
    h1: "Perforated Sheets in Indore",
    intro: "We supply perforated sheets (MS and GI) from Siyaganj, Indore. Used for screening, ventilation, filtration, and cladding. Available in different thicknesses and hole patterns.",
    specs: [
      "Thickness: 0.5mm to 3mm",
      "Patterns: round, square, slot",
      "MS and galvanized options",
      "Custom sizes on request",
    ],
    useCases: ["Screens and partitions", "Ventilation panels", "Filtration", "Decorative cladding"],
    productSlugs: ["gi-perforated-sheet", "ms-perforated-sheet", "ss-gi-mesh-jalies", "gi-weldmesh", "ms-weldmesh"],
  },
  "gi-wire": {
    slug: "gi-wire",
    title: "GI Wire Indore | Galvanized Iron Wire in Siyaganj",
    description: "GI wire (galvanized iron wire) in Indore. HM Ibrahim & Co, Siyaganj, supplies GI wire for binding, fencing, and general use. Various gauges and coil weights. Retail and wholesale.",
    h1: "GI Wire in Indore",
    intro: "We stock GI wire (galvanized iron wire) at our Siyaganj, Indore location. Used for binding, fencing, tying, and general construction. Available in multiple gauges and coil weights.",
    intro2: "Tata GI wire is available on request. Contact us for gauge, weight, and quantity.",
    specs: [
      "Gauges: 8 SWG to 18 SWG",
      "Coils and annealed options",
      "Binding wire also available",
    ],
    useCases: ["Binding and tying", "Fencing", "General construction", "RCC binding (binding wire)"],
    productSlugs: ["gi-wire", "binding-wire", "barbed-wire"],
  },
  "construction-hardware": {
    slug: "construction-hardware",
    title: "Construction Hardware & Site Supplies Indore | Fawda, Sponge, Tools",
    description: "Construction hardware and site supplies in Indore. HM Ibrahim & Co, Siyaganj, supplies fawda (shovel), pickaxe, crowbar, sponge, welding rods, fasteners, and more for site and fabrication.",
    h1: "Construction Hardware & Site Supplies in Indore",
    intro: "We supply construction hardware and site supplies from Siyaganj, Indore — including tools and consumables for daily site and fabrication work. If you need fawda (shovel), pickaxe, crowbar, sponge for cleaning and finishing, welding rods, fasteners, or nails, we can help.",
    intro2: "Our range covers hand tools, welding consumables, and general site supplies. Retail and wholesale; contact us for specific items and quantities.",
    specs: [
      "Fawda (shovel), pickaxe, crowbar — heavy duty",
      "Sponge for tiling, grouting, and site cleaning",
      "Welding rods (E6013, E7018, etc.)",
      "Fasteners, nails, bolts, nuts",
    ],
    useCases: ["Site work", "Digging and demolition", "Welding and fabrication", "Tiling and finishing", "General construction"],
    productSlugs: ["sr-crowbar", "sponge", "welding-rods", "fasteners-nails", "gi-perforated-sheet", "ms-perforated-sheet", "cutting-discs-grinding-wheels"],
  },
};

export function getIndorePage(slug: string): IndorePage | null {
  if (indorePageSlugs.includes(slug as IndorePageSlug)) {
    return indorePages[slug as IndorePageSlug];
  }
  return null;
}
