/**
 * Product categories and products. Edit this file to update catalog.
 * All images are local files in /public/products/
 */

import type { BrandId } from "@/content/brands";

export type ProductSpec = { label: string; value: string };

export type BrandVariant = {
  brandId: BrandId;
  images: string[];
  /** Optional video paths in /public/products/ (e.g. /products/demo.mp4) */
  videos?: string[];
  specs?: ProductSpec[];
  sizes?: string[];
  materials?: string[];
  useCases?: string[];
  notes: string;
};

export type Product = {
  slug: string;
  name: string;
  shortDesc: string;
  categorySlug: string;
  specs?: ProductSpec[];
  /** @deprecated Use images array instead */
  image?: string;
  imageAlt?: string;
  /** Array of local image paths in /public/products/ */
  images?: string[];
  /** Optional video paths in /public/products/ (e.g. /products/demo.mp4) */
  videos?: string[];
  useCases?: string[];
  variants?: string[];
  sizes?: string[];
  materials?: string[];
  notes?: string;
  /** Whether Tata products are available for this item (authorized dealer) */
  tataAvailable?: boolean;
  /** Official Tata distributor/retailer for this product (steel only; show badge + logo) */
  tataOfficial?: boolean;
  /** Brand-specific variants (CM, Border) with images and range */
  brandVariants?: BrandVariant[];
  /** Optional indicative rate range for catalog email (e.g. "Approx. ₹55–65 per kg") when API rates not used */
  indicativeRate?: string;
};

export type Category = {
  slug: string;
  name: string;
  description: string;
  icon: string; // lucide icon name
  image?: string;
  imageAlt?: string;
  products: Product[];
};

/** Up to `max` thumbnails from the category; uses multiple images from the same product to fill slots. */
export function getCategoryThumbnails(
  cat: Category,
  max = 6
): { src: string; alt: string }[] {
  const out: { src: string; alt: string }[] = [];
  for (const p of cat.products) {
    if (out.length >= max) break;
    const urls = (p.images?.length ? p.images : p.image ? [p.image] : []) as string[];
    const alt = p.imageAlt || `${p.name} – ${p.shortDesc}`;
    for (const src of urls) {
      if (out.length >= max) break;
      out.push({ src, alt });
    }
  }
  return out;
}

export const categories: Category[] = [
  {
    slug: "structural-items",
    name: "Structural Items",
    description:
      "Angle, flats, bright bars, TMT bars, channels, and pipes for construction and fabrication.",
    icon: "Box",
    image: "/products/ms-angle.png",
    imageAlt: "Industrial steel sections including MS angles, pipes, and bars",
    products: [
      {
        slug: "ms-angles",
        name: "Angle",
        shortDesc: "Mild steel angles in various sizes for fabrication and structural use.",
        categorySlug: "structural-items",
        specs: [
          { label: "Common sizes", value: "20x20 to 100x100 mm" },
          { label: "Thickness", value: "3mm to 10mm" },
          { label: "Lengths", value: "6m / 12m" },
          { label: "Grades", value: "Commonly IS 2062 / mild steel" },
        ],
        images: ["/products/ms-angle-1.png", "/products/ms-angle-2.png"],
        image: "/products/ms-angle-1.png",
        imageAlt: "Stack of MS angles in a warehouse",
        useCases: ["Fabrication", "Structural frames", "Support brackets"],
        variants: ["Equal angles", "Unequal angles"],
        sizes: ["20x20mm", "25x25mm", "30x30mm", "40x40mm", "50x50mm", "65x65mm", "75x75mm", "100x100mm"],
        materials: ["Mild steel (MS)", "IS 2062 grade"],
        notes: "Available in different sizes and thicknesses; availability depends on stock. Commonly requested sizes include 25x25mm, 40x40mm, 50x50mm, and 75x75mm.",
        tataAvailable: true,
        tataOfficial: true,
        indicativeRate: "Approx. ₹52–62 per kg (varies by size and quantity). Confirm for current price.",
      },
      {
        slug: "ms-flats",
        name: "Flats",
        shortDesc: "Mild steel flat bars for welding and fabrication.",
        categorySlug: "structural-items",
        specs: [
          { label: "Width", value: "12mm to 150mm" },
          { label: "Thickness", value: "3mm to 12mm" },
          { label: "Lengths", value: "6m / 12m" },
        ],
        images: ["/products/ms-flat.png"],
        image: "/products/ms-flat.png",
        imageAlt: "Stack of Mild Steel (MS) Flat bars bundled in an industrial warehouse",
        useCases: ["Grills", "Base plates", "Brackets"],
        variants: ["Black MS flats", "Bright MS flats"],
        sizes: ["12mm x 3mm", "20mm x 5mm", "25mm x 5mm", "30mm x 6mm", "40mm x 6mm", "50mm x 6mm", "75mm x 8mm", "100mm x 10mm", "150mm x 12mm"],
        materials: ["Mild steel"],
        notes: "Available in multiple sizes and weights; availability depends on stock. Commonly used for fabrication, grills, and structural supports.",
        tataAvailable: true,
        tataOfficial: true,
        indicativeRate: "Approx. ₹58–68 per kg (varies by size and quantity). Confirm for current price.",
      },
      {
        slug: "bright-bars",
        name: "Bright Bars",
        shortDesc: "Cold-drawn bright bars for precision applications.",
        categorySlug: "structural-items",
        specs: [
          { label: "Diameter/Size", value: "8mm to 40mm" },
          { label: "Finish", value: "Bright drawn" },
        ],
        images: ["/products/bright-bars.png"],
        image: "/products/bright-bars.png",
        imageAlt: "Bright steel round bars for machining",
        useCases: ["Precision parts", "Shafts", "Machining"],
        variants: ["Round bright bars", "Flat bright bars", "Square bright bars"],
        sizes: ["8mm", "10mm", "12mm", "16mm", "20mm", "25mm", "32mm", "40mm"],
        materials: ["Cold-drawn mild steel"],
        notes: "Tighter tolerance commonly requested. Available in different sizes; availability depends on stock. Suitable for precision machining applications.",
        tataAvailable: true,
        tataOfficial: true,
        indicativeRate: "Approx. ₹65–78 per kg (varies by size and finish). Confirm for current price.",
      },
      {
        slug: "tmt-bars",
        name: "TMT Bars",
        shortDesc: "Thermo-mechanically treated bars for reinforced concrete.",
        categorySlug: "structural-items",
        specs: [
          { label: "Diameter", value: "6mm, 8mm, 10mm, 12mm, 16mm, 20mm, 25mm, 32mm" },
          { label: "Length", value: "Typically 12m" },
          { label: "Grades", value: "Commonly Fe 500 / Fe 550" },
        ],
        images: ["/products/tmt-bar.png"],
        image: "/products/tmt-bar.png",
        imageAlt: "Bundles of ribbed TMT steel bars stacked in an industrial warehouse",
        useCases: ["RCC construction", "Columns", "Beams", "Slabs"],
        variants: ["Fe 500", "Fe 550", "Fe 500D"],
        sizes: ["6mm", "8mm", "10mm", "12mm", "16mm", "20mm", "25mm", "32mm"],
        materials: ["Thermo-mechanically treated steel"],
        notes: "Available in different sizes and grades; availability depends on stock. Commonly requested sizes include 8mm, 10mm, 12mm, 16mm, and 20mm for RCC work.",
        tataAvailable: true,
        tataOfficial: true,
        indicativeRate: "Approx. ₹52–62 per kg (varies by size and grade). Confirm for current price.",
      },
      {
        slug: "ms-round-bars",
        name: "MS Round Bars / Rods",
        shortDesc: "Mild steel round bars in various diameters.",
        categorySlug: "structural-items",
        specs: [
          { label: "Diameter", value: "6mm to 50mm" },
          { label: "Lengths", value: "6m / 12m" },
          { label: "Finish", value: "Black / Bright (if applicable)" },
        ],
        images: ["/products/ms-round-bar.png"],
        image: "/products/ms-round-bar.png",
        imageAlt: "Bundles of MS round bars stacked in a warehouse",
        useCases: ["Machining", "Anchors", "General fabrication"],
        variants: ["Black MS round bars", "Bright MS round bars"],
        sizes: ["6mm", "8mm", "10mm", "12mm", "16mm", "20mm", "25mm", "32mm", "40mm", "50mm"],
        materials: ["Mild steel"],
        notes: "Available in different sizes and lengths; availability depends on stock. Commonly used for fabrication, anchors, and general construction purposes.",
        tataAvailable: true,
        tataOfficial: true,
        indicativeRate: "Approx. ₹50–60 per kg (varies by size). Confirm for current price.",
      },
      {
        slug: "ms-channels",
        name: "Channels",
        shortDesc: "Mild steel channel sections for structural and fabrication use.",
        categorySlug: "structural-items",
        specs: [
          { label: "Sizes", value: "75mm to 300mm (ISA / ISMC)" },
          { label: "Thickness", value: "As per standard section" },
          { label: "Lengths", value: "6m / 12m" },
        ],
        images: ["/products/ms-angle.png"],
        image: "/products/ms-angle.png",
        imageAlt: "MS channel sections for structural use",
        useCases: ["Structural frames", "Purlins", "Support channels", "Fabrication"],
        variants: ["Equal flange", "Unequal flange"],
        sizes: ["75mm", "100mm", "125mm", "150mm", "200mm", "250mm", "300mm"],
        materials: ["Mild steel (MS)", "IS 2062"],
        notes: "Available in standard channel sizes; availability depends on stock. Used for structural support, purlins, and fabrication.",
        tataAvailable: true,
        tataOfficial: true,
        indicativeRate: "Approx. ₹55–68 per kg (varies by size). Confirm for current price.",
      },
      {
        slug: "ms-i-beams-joists",
        name: "MS I-Beams & Joists",
        shortDesc: "Mild steel I-beams and joists for heavy structural support.",
        categorySlug: "structural-items",
        specs: [
          { label: "Sizes", value: "75mm to 300mm (ISMB / ISJB)" },
          { label: "Lengths", value: "6m / 12m" },
          { label: "Grades", value: "IS 2062 mild steel" },
        ],
        images: ["/products/ms-round-bar.png"],
        image: "/products/ms-round-bar.png",
        imageAlt: "MS I-beams and joists for structural construction",
        useCases: ["Beams", "Columns", "Industrial sheds", "Bridges"],
        variants: ["I-beams (ISMB)", "Joists (ISJB)"],
        sizes: ["75mm", "100mm", "125mm", "150mm", "200mm", "250mm", "300mm"],
        materials: ["Mild steel"],
        notes: "Available in standard I-section sizes; availability depends on stock. Contact us for specific sizes and load requirements.",
        tataAvailable: true,
        tataOfficial: true,
        indicativeRate: "Approx. ₹56–66 per kg (varies by size). Confirm for current price.",
      },
      {
        slug: "gi-pipes",
        name: "Pipes (GI)",
        shortDesc: "Galvanized iron pipes for water and general use.",
        categorySlug: "structural-items",
        specs: [
          { label: "NB sizes", value: "15mm (1/2\") to 150mm (6\") commonly" },
          { label: "Length", value: "6m standard" },
          { label: "Classes", value: "Light / Medium / Heavy (as per requirement)" },
        ],
        images: ["/products/gi-pipes.png"],
        image: "/products/gi-pipes.png",
        imageAlt: "Shiny galvanized iron pipes (GI pipes) stacked in an industrial environment",
        useCases: ["Water lines", "Structure", "Fencing"],
        variants: ["Light class", "Medium class", "Heavy class"],
        sizes: ["15mm (1/2\")", "20mm (3/4\")", "25mm (1\")", "32mm (1.25\")", "40mm (1.5\")", "50mm (2\")", "65mm (2.5\")", "80mm (3\")", "100mm (4\")", "125mm (5\")", "150mm (6\")"],
        materials: ["Galvanized iron (GI)"],
        notes: "Available in different sizes and classes; availability depends on stock. Commonly used for water supply, fencing, and structural applications.",
        indicativeRate: "Approx. ₹85–180 per metre (varies by NB size and class). Confirm for current price.",
      },
      {
        slug: "ms-pipes",
        name: "Pipes (MS)",
        shortDesc: "Mild steel pipes for structural and industrial applications.",
        categorySlug: "structural-items",
        specs: [
          { label: "NB range", value: "15 mm to 300 mm" },
          { label: "Schedule", value: "As per requirement" },
        ],
        images: ["/products/gi-pipes.png"],
        image: "/products/gi-pipes.png",
        imageAlt: "Industrial steel pipes for structural use",
        useCases: ["Structural", "Handrails", "Conduit"],
        variants: ["Black MS pipes", "Galvanized MS pipes"],
        sizes: ["15mm", "20mm", "25mm", "32mm", "40mm", "50mm", "65mm", "80mm", "100mm", "125mm", "150mm", "200mm", "250mm", "300mm"],
        materials: ["Mild steel"],
        notes: "Available in different sizes and schedules; availability depends on stock. Suitable for structural and industrial applications.",
        tataAvailable: true,
        tataOfficial: true,
        indicativeRate: "Approx. ₹55–70 per kg (varies by size and schedule). Confirm for current price.",
      },
      {
        slug: "ms-holepass",
        name: "MS Holepass",
        shortDesc: "Galvanized MS L-shaped brackets with pre-drilled holes for pipe support, cable pass-through, and mounting.",
        categorySlug: "structural-items",
        specs: [
          { label: "Type", value: "L-shaped angle bracket" },
          { label: "Holes", value: "Central large hole with smaller fastener holes" },
          { label: "Finish", value: "Galvanized / zinc-coated" },
          { label: "Material", value: "Mild steel (MS)" },
        ],
        images: ["/products/ms-holepass.png"],
        image: "/products/ms-holepass.png",
        imageAlt: "Bundles of galvanized MS holepass L-brackets stacked in bulk",
        useCases: ["Pipe support", "Cable pass-through", "Mounting brackets", "Structural support", "Fabrication"],
        materials: ["Mild steel", "Galvanized"],
        notes: "MS holepass brackets available in bulk. L-shaped with pre-drilled holes for secure mounting and pass-through. Contact us for sizes and quantity.",
      },
    ],
  },
  {
    slug: "fencing-material",
    name: "Fencing Material",
    description: "Chain link fencing and barbed wire for boundaries and security.",
    icon: "Box",
    image: "/products/brands/boarder/barbed-1.png",
    imageAlt: "Barbed wire and chain link fencing",
    products: [
      {
        slug: "chain-link-fencing",
        name: "Chain Link Fencing",
        shortDesc: "Galvanized chain link mesh for compound fencing.",
        categorySlug: "fencing-material",
        specs: [
          { label: "Chainlink mesh opening", value: "1\" to 4\"" },
          { label: "Wire size", value: "1.5mm to 4mm" },
          { label: "Height", value: "3ft to 10ft rolls" },
          { label: "Finish", value: "GI / PVC coated" },
        ],
        images: [
          "/products/brands/cm/chainlink-1.png",
          "/products/tata-chainlink-1.png",
          "/products/chain-link-wire.png",
        ],
        image: "/products/brands/cm/chainlink-1.png",
        imageAlt: "CM brand chain link fencing roll",
        useCases: ["Fencing", "Boundaries"],
        variants: ["GI chain link", "PVC coated chain link"],
        sizes: ["Mesh: 1\"", "2\"", "3\"", "4\"", "Height: 3ft", "4ft", "5ft", "6ft", "8ft", "10ft"],
        materials: ["Galvanized iron", "PVC coated"],
        notes:
          "Available in different mesh sizes and heights; availability depends on stock. Commonly used for compound fencing, sports grounds, and industrial boundaries. Tata Wiron chain link fencing available along with CM and Border brands.",
        tataAvailable: true,
        tataOfficial: true,
        brandVariants: [
          {
            brandId: "cm",
            images: ["/products/brands/cm/chainlink-1.png", "/products/brands/cm/chainlink-2.png"],
            specs: [
              { label: "Chainlink mesh opening", value: "1\" to 4\" (common)" },
              { label: "Wire size", value: "1.5mm to 4mm" },
              { label: "Heights", value: "3ft to 10ft rolls" },
              { label: "Finish", value: "GI / PVC coated (available depending on stock)" },
            ],
            sizes: ["Mesh: 1\"", "2\"", "3\"", "4\"", "Height: 3ft", "4ft", "5ft", "6ft", "8ft", "10ft"],
            materials: ["Galvanized iron", "PVC coated"],
            useCases: ["Boundary fencing", "Sports grounds", "Industrial", "Farm"],
            notes: "CM brand chain link fencing (jali). Mesh and heights as per stock.",
          },
          {
            brandId: "boarder",
            images: [
              "/products/brands/boarder/chainlink-1.png",
              "/products/brands/boarder/chainlink-2.png",
              "/products/brands/boarder/barbed-chainlink-stack.png",
              "/products/brands/boarder/chainlink-3.png",
            ],
            specs: [
              { label: "Chainlink mesh opening", value: "1\" to 4\" (common)" },
              { label: "Wire size", value: "1.5mm to 4mm" },
              { label: "Heights", value: "3ft to 10ft rolls" },
              { label: "Finish", value: "GI / PVC coated (available depending on stock)" },
            ],
            sizes: ["Mesh: 1\"", "2\"", "3\"", "4\"", "Height: 3ft", "4ft", "5ft", "6ft", "8ft", "10ft"],
            materials: ["Galvanized iron", "PVC coated"],
            useCases: ["Boundary fencing", "Sports grounds", "Industrial", "Farm"],
            notes: "Border brand chain link fencing (jali). Mesh and heights as per stock.",
          },
          {
            brandId: "tata",
            images: ["/products/tata-chainlink-1.png"],
            specs: [
              { label: "Brand", value: "Tata Wiron chain link fencing" },
              { label: "Chainlink mesh opening", value: "1\" to 4\" (common Tata range)" },
              { label: "Wire size", value: "1.5mm to 4mm" },
              { label: "Finish", value: "GI (other finishes as per availability)" },
            ],
            sizes: ["Heights and mesh sizes as per Tata Wiron availability"],
            materials: ["Galvanized iron"],
            useCases: ["High-quality boundary fencing", "Industrial and residential compounds"],
            notes: "Tata Wiron chain link fencing for durable compound and boundary fencing.",
          },
        ],
        indicativeRate: "Approx. ₹55–75 per sq m (varies by mesh size and height). Confirm for current price.",
      },
      {
        slug: "barbed-wire",
        name: "Barbed Wire",
        shortDesc: "Barbed wire for boundary and security fencing. CM, Border, and Tata Wiron.",
        categorySlug: "fencing-material",
        specs: [
          { label: "Wire diameter", value: "Common 12x14 gauge / 2.5mm (common market)" },
          { label: "Types", value: "Single / Double strand" },
          { label: "Packing", value: "Coils up to 25 kg (varies by type and stock)" },
        ],
        images: [
          "/products/brands/boarder/barbed-1.png",
          "/products/tata-barbed-wire.png",
          "/products/barbed-wire.png",
        ],
        image: "/products/brands/boarder/barbed-1.png",
        imageAlt: "Border brand barbed wire stack for security fencing",
        useCases: ["Security fencing", "Boundary fencing"],
        variants: ["Single strand", "Double strand", "2-point", "4-point"],
        sizes: ["Standard coils: 5kg", "10kg", "20kg", "25kg", "Packing: coils up to 25 kg (varies by type and stock)"],
        materials: ["Galvanized iron"],
        notes:
          "Available in different types and packing sizes; availability depends on stock. CM, Border, and Tata Wiron barbed wire. Packing: coils up to 25 kg (varies by type and stock).",
        tataAvailable: true,
        tataOfficial: true,
        brandVariants: [
          {
            brandId: "cm",
            images: ["/products/brands/cm/barbed-1.png"],
            specs: [
              { label: "Type", value: "Single strand / Double strand" },
              { label: "Common gauges", value: "12x14, 14x14 (commonly available)" },
              { label: "Coils", value: "Up to 25 kg" },
              { label: "Finish", value: "GI" },
            ],
            sizes: ["5kg", "10kg", "20kg", "25kg coils"],
            materials: ["Galvanized iron"],
            useCases: ["Farm fencing", "Boundary", "Security"],
            notes: "CM brand barbed wire. Available in single/double strand; gauges and coil sizes as per stock.",
          },
          {
            brandId: "boarder",
            images: [
              "/products/brands/boarder/barbed-1.png",
              "/products/brands/boarder/barbed-chainlink-stack.png",
              "/products/brands/boarder/chainlink-3.png",
            ],
            specs: [
              { label: "Type", value: "Single strand / Double strand" },
              { label: "Common gauges", value: "12x14, 14x14 (commonly available)" },
              { label: "Coils", value: "Up to 25 kg" },
              { label: "Finish", value: "GI / coated (as per stock)" },
            ],
            sizes: ["5kg", "10kg", "20kg", "25kg coils"],
            materials: ["Galvanized iron"],
            useCases: ["Farm fencing", "Boundary", "Security"],
            notes: "Border brand barbed wire. Available in single/double strand; gauges and coil sizes as per stock.",
          },
          {
            brandId: "tata",
            images: ["/products/tata-barbed-wire.png"],
            specs: [
              { label: "Brand", value: "Tata Wiron barbed wire" },
              { label: "Coating", value: "Patented coating technology (Tashiel-1000 type, as available)" },
              { label: "Packing", value: "Branded coils as per stock" },
            ],
            sizes: ["Standard coils as per Tata Wiron specification"],
            materials: ["Galvanized iron"],
            useCases: ["High durability security fencing", "Farm boundaries", "Perimeter fencing"],
            notes: "Tata Wiron barbed wire for long life and corrosion resistance. Availability as per Tata stock.",
          },
        ],
        indicativeRate: "Approx. ₹75–92 per kg (varies by type and coil size). Confirm for current price.",
      },
    ],
  },
  {
    slug: "wiremesh",
    name: "Wiremesh",
    description: "MS wiremesh, G.I wiremesh, Aluminium wiremesh, and Crimp wiremesh for screening and reinforcement.",
    icon: "Grid3X3",
    image: "/products/gi-wire.png",
    imageAlt: "Wire mesh products",
    products: [
      {
        slug: "ms-wiremesh",
        name: "MS Wiremesh",
        shortDesc: "Mild steel wire mesh for reinforcement and screening.",
        categorySlug: "wiremesh",
        specs: [{ label: "Mesh sizes", value: "Various; as per stock" }],
        sizes: ["15mm x 15mm", "50x50mm", "75x75mm", "100x100mm", "150x150mm"],
        materials: ["Mild steel"],
        notes: "MS wire mesh available in different mesh sizes. Contact us for availability and pricing.",
        indicativeRate: "Approx. ₹50–70 per sq m (varies by mesh). Confirm for current price.",
      },
      {
        slug: "gi-wiremesh",
        name: "G.I Wiremesh",
        shortDesc: "Galvanized iron wire mesh for corrosion-resistant screening and reinforcement.",
        categorySlug: "wiremesh",
        specs: [{ label: "Mesh sizes", value: "Various; as per stock" }],
        images: ["/products/gi-wiremesh.png"],
        image: "/products/gi-wiremesh.png",
        imageAlt: "G.I wiremesh — galvanized iron woven wire mesh with uniform square openings",
        sizes: ["15mm x 15mm", "50x50mm", "75x75mm", "100x100mm"],
        materials: ["Galvanized iron"],
        notes: "GI wire mesh for long life in exposed applications. Contact us for sizes and pricing.",
        indicativeRate: "Approx. ₹55–75 per sq m (varies by mesh). Confirm for current price.",
      },
      {
        slug: "aluminium-wiremesh",
        name: "Aluminium Wiremesh",
        shortDesc: "Aluminium wire mesh for lightweight, non-rust screening and filtration.",
        categorySlug: "wiremesh",
        specs: [{ label: "Mesh sizes", value: "Various; as per stock" }],
        materials: ["Aluminium"],
        notes: "Aluminium mesh for chemical and food applications. Contact us for availability.",
        indicativeRate: "Approx. ₹120–200 per sq m (varies by mesh). Confirm for current price.",
      },
      {
        slug: "crimp-wiremesh",
        name: "Crimp Wiremesh",
        shortDesc: "Crimped wire mesh with pre-bent wires for stable square openings; screening, sifting, and reinforcement.",
        categorySlug: "wiremesh",
        specs: [
          { label: "Weave", value: "Crimped (pre-bent wires)" },
          { label: "Mesh sizes", value: "Various; as per stock" },
        ],
        images: ["/products/crimp-wiremesh-1.png", "/products/crimp-wiremesh-2.png", "/products/crimp-wiremesh-3.png"],
        image: "/products/crimp-wiremesh-1.png",
        imageAlt: "Crimp wiremesh — crimped wire mesh with square openings, supplied in rolls",
        sizes: ["15mm x 15mm", "50x50mm", "75x75mm", "100x100mm", "150x150mm", "As per stock"],
        materials: ["Mild steel", "Galvanized iron"],
        useCases: ["Screening", "Sifting", "Reinforcement", "Partitioning", "Security"],
        notes: "Crimped wire mesh holds wires firmly at intersections. Available in rolls; mesh sizes and wire gauge as per stock. Contact us for sizes and pricing.",
        indicativeRate: "Approx. ₹50–75 per sq m (varies by mesh and gauge). Confirm for current price.",
      },
      {
        slug: "mosquito-net",
        name: "Mosquito Net",
        shortDesc: "Fine mesh for mosquito screening, insect barriers, and ventilation; supplied in rolls.",
        categorySlug: "wiremesh",
        specs: [
          { label: "Type", value: "Fine mesh / mosquito screening" },
          { label: "Form", value: "Rolls" },
        ],
        images: ["/products/mosquito-net.png"],
        image: "/products/mosquito-net.png",
        imageAlt: "Fine metallic mosquito net mesh in rolls",
        useCases: ["Mosquito screening", "Insect barriers", "Ventilation", "Doors and windows"],
        materials: ["Stainless steel", "Metallic mesh"],
        notes: "Fine mesh suitable for mosquito net and insect screening. Available in rolls. Contact us for width, length, and mesh size.",
        indicativeRate: "Approx. ₹80–200 per sq m (varies by mesh). Confirm for current price.",
      },
      {
        slug: "ss-fine-mesh",
        name: "SS Fine Mesh",
        shortDesc: "Stainless steel fine mesh for screening, filtration, and insect barriers; supplied in rolls.",
        categorySlug: "wiremesh",
        specs: [
          { label: "Material", value: "Stainless steel (SS)" },
          { label: "Weave", value: "Fine mesh" },
          { label: "Form", value: "Rolls" },
        ],
        images: ["/products/ss-fine-mesh.png", "/products/ss-fine-mesh-1.png"],
        image: "/products/ss-fine-mesh.png",
        imageAlt: "SS fine mesh roll",
        useCases: ["Screening", "Filtration", "Mosquito net", "Insect barriers", "Ventilation"],
        materials: ["Stainless steel"],
        notes: "Stainless steel fine mesh in rolls. Durable and corrosion-resistant. Contact us for aperture size, width, and length.",
        indicativeRate: "Approx. ₹100–250 per sq m (varies by mesh). Confirm for current price.",
      },
    ],
  },
  {
    slug: "welded-mesh",
    name: "Welded Mesh",
    description: "GI weldmesh, MS weldmesh, and PVC coated weldmesh for reinforcement and partitioning.",
    icon: "Grid3X3",
    products: [
      {
        slug: "gi-weldmesh",
        name: "GI Weldmesh",
        shortDesc: "Galvanized iron welded wire mesh for reinforcement, partitioning, and corrosion-resistant use.",
        categorySlug: "welded-mesh",
        specs: [
          { label: "Mesh", value: "15mm x 15mm, 50x50 to 150x150 mm (commonly available)" },
          { label: "Wire", value: "3–5 mm" },
          { label: "Finish", value: "Galvanized (GI)" },
        ],
        images: ["/products/gi-weldmesh-main.png", "/products/gi-weldmesh-1.png"],
        image: "/products/gi-weldmesh-main.png",
        imageAlt: "GI weldmesh rolls",
        useCases: ["RCC slabs", "Partition", "Cages", "Fencing", "Reinforcement"],
        sizes: ["15mm x 15mm", "50x50mm", "75x75mm", "100x100mm", "150x150mm"],
        materials: ["Galvanized iron wire"],
        notes: "GI welded mesh available in different mesh sizes and wire diameters. Corrosion-resistant. Used for RCC slab reinforcement, partitions, and cages. Contact us for sizes.",
        indicativeRate: "Approx. ₹55–75 per sq m (varies by mesh and wire size). Confirm for current price.",
      },
      {
        slug: "ms-weldmesh",
        name: "MS Weldmesh",
        shortDesc: "Mild steel welded wire mesh for reinforcement and partitioning.",
        categorySlug: "welded-mesh",
        specs: [
          { label: "Mesh", value: "15mm x 15mm, 50x50 to 150x150 mm (commonly available)" },
          { label: "Wire", value: "3–5 mm" },
          { label: "Finish", value: "Mild steel (MS)" },
        ],
        images: ["/products/ms-weldmesh-1.png"],
        image: "/products/ms-weldmesh-1.png",
        imageAlt: "MS weldmesh rolls",
        useCases: ["RCC slabs", "Partition", "Cages", "Reinforcement"],
        sizes: ["15mm x 15mm", "50x50mm", "75x75mm", "100x100mm", "150x150mm"],
        materials: ["Mild steel wire"],
        notes: "MS welded mesh available in different mesh sizes and wire diameters. Used for RCC slab reinforcement, partitions, and cages. Contact us for sizes.",
        indicativeRate: "Approx. ₹50–70 per sq m (varies by mesh and wire size). Confirm for current price.",
      },
      {
        slug: "pvc-coated-weldmesh",
        name: "PVC Coated Weldmesh",
        shortDesc: "PVC coated welded wire mesh in rolls for fencing, partitions, and corrosion-resistant applications.",
        categorySlug: "welded-mesh",
        specs: [
          { label: "Coating", value: "PVC coated" },
          { label: "Form", value: "Rolls" },
          { label: "Mesh", value: "Square grid; sizes as per stock" },
        ],
        images: ["/products/pvc-coated-weldmesh.png"],
        image: "/products/pvc-coated-weldmesh.png",
        imageAlt: "Green PVC coated weldmesh rolls in warehouse",
        useCases: ["Fencing", "Partitions", "Cages", "Boundary", "Corrosion-resistant screening"],
        materials: ["Steel wire", "PVC coating"],
        notes: "PVC coated weldmesh available in rolls. Green and other colours as per stock. Contact us for mesh size, wire gauge, and length.",
        indicativeRate: "Approx. ₹80–150 per sq m (varies by mesh and coating). Confirm for current price.",
      },
    ],
  },
  {
    slug: "perforated-sheets",
    name: "Perforated Sheets",
    description: "MS and G.I perforated sheets for screening and filtration.",
    icon: "Grid3X3",
    products: [
      {
        slug: "perforated-sheets",
        name: "MS & G.I Perforated Sheet",
        shortDesc: "MS and GI perforated sheets for screening and filtration.",
        categorySlug: "perforated-sheets",
        specs: [
          { label: "Thickness", value: "0.5 mm to 3 mm" },
          { label: "Hole pattern", value: "Round, square, slot" },
        ],
        images: ["/products/perforated-sheet.png", "/products/perforated-sheet-2.png"],
        useCases: ["Screens", "Ventilation", "Filtration"],
        variants: ["Round holes", "Square holes", "Slot holes"],
        materials: ["Mild steel", "Galvanized iron"],
        notes: "Available in different thicknesses and hole patterns. Custom sizes available.",
        indicativeRate: "Approx. ₹120–220 per sq m (varies by thickness and pattern). Confirm for current price.",
      },
    ],
  },
  {
    slug: "wires",
    name: "Wires",
    description: "MS and GI wire, binding wire, jhatka wire, clutch wire, wire rope, and concertina wire.",
    icon: "Grid3X3",
    image: "/products/gi-wire.png",
    products: [
      {
        slug: "gi-wire",
        name: "GI Wire",
        shortDesc: "Galvanized iron wire for binding, fencing, and general use. Tata Wiron available.",
        categorySlug: "wires",
        specs: [{ label: "Gauge", value: "8 SWG to 18 SWG" }],
        images: ["/products/tata-gi-wire-1.png", "/products/tata-gi-wire-2.png"],
        image: "/products/tata-gi-wire-1.png",
        imageAlt: "GI wire coils",
        sizes: ["8 SWG", "10 SWG", "12 SWG", "14 SWG", "16 SWG", "18 SWG"],
        materials: ["Galvanized iron"],
        useCases: ["Binding", "Fencing", "General purpose", "Agricultural use"],
        notes: "GI wire available in coils. Tata Wiron GI wire in stock. Contact us for gauge and quantity.",
        tataAvailable: true,
        tataOfficial: true,
        brandVariants: [
          {
            brandId: "tata",
            images: ["/products/tata-gi-wire-1.png", "/products/tata-gi-wire-2.png"],
            specs: [
              { label: "Brand", value: "Tata Wiron GI wire" },
              { label: "Gauge", value: "8 SWG to 18 SWG" },
              { label: "Coating", value: "Heavy zinc coating for long life" },
            ],
            sizes: ["8 SWG", "10 SWG", "12 SWG", "14 SWG", "16 SWG", "18 SWG"],
            materials: ["Galvanized iron"],
            useCases: ["Binding", "General purpose tying", "Light fencing"],
            notes: "Tata Wiron GI wire with consistent strength and coating quality.",
          },
        ],
        indicativeRate: "Approx. ₹72–88 per kg (varies by gauge). Confirm for current price.",
      },
      {
        slug: "binding-wire",
        name: "Binding Wire",
        shortDesc: "Annealed binding wire for RCC work.",
        categorySlug: "wires",
        specs: [
          { label: "Gauge", value: "16–18 SWG" },
          { label: "Packing", value: "Coils up to 50 kg (varies by gauge and stock)" },
        ],
        images: ["/products/binding-wire.png", "/products/gi-wire.png"],
        image: "/products/binding-wire.png",
        imageAlt: "Binding wire bundles used for RCC tying",
        useCases: ["RCC binding", "Reinforcement tying"],
        variants: ["Annealed binding wire"],
        sizes: ["16 SWG", "18 SWG", "Packing: coils up to 50 kg (varies by gauge and stock)"],
        materials: ["Annealed mild steel"],
        notes: "Available in different pack sizes; availability depends on stock. Specifically designed for RCC reinforcement tying work. Packing: coils up to 50 kg (varies by gauge and stock).",
        tataAvailable: true,
        indicativeRate: "Approx. ₹65–78 per kg (varies by gauge and pack size). Confirm for current price.",
      },
      {
        slug: "jhatka-machine-fencing-wire",
        name: "Jhatka Wire",
        shortDesc: "Jhatka machine wire for fencing and agricultural use; quality wire for boundaries and farm applications.",
        categorySlug: "wires",
        specs: [
          { label: "Type", value: "Jhatka / fencing wire" },
          { label: "Packing", value: "Coils / spools" },
          { label: "Use", value: "Fencing, agricultural boundaries, jhatka machines" },
        ],
        images: ["/products/nylon-jhatka-wire.png", "/products/jhatka-machine-fencing-wire-1.png", "/products/jhatka-machine-fencing-wire-2.png"],
        videos: ["/products/jhatka-machine-fencing-wire.mp4"],
        image: "/products/nylon-jhatka-wire.png",
        imageAlt: "Jhatka wire coils for agricultural and boundary use",
        useCases: ["Farm fencing", "Boundary wire", "Jhatka machine use", "Agricultural fencing"],
        variants: ["Jhatka wire", "Fencing wire coils"],
        sizes: ["Coil sizes and lengths as per stock"],
        materials: ["Galvanized steel", "GI wire"],
        notes: "Quality jhatka and fencing wire for agricultural and boundary use. Available in coils; contact us for gauge and quantity.",
        indicativeRate: "Approx. ₹68–82 per kg (varies by gauge). Confirm for current price.",
      },
      {
        slug: "clutch-wire",
        name: "Clutch Wire",
        shortDesc: "Clutch wire for automotive and machinery applications; supplied in spools.",
        categorySlug: "wires",
        specs: [
          { label: "Gauge", value: "As per requirement (thin gauge for clutch cables)" },
          { label: "Packing", value: "Spools / coils" },
          { label: "Finish", value: "Galvanized / coated as per stock" },
        ],
        images: ["/products/clutch-wire-1.png", "/products/clutch-wire-2.png"],
        image: "/products/clutch-wire-1.png",
        imageAlt: "Clutch wire spools for automotive and machinery use",
        useCases: ["Clutch assemblies", "Automotive cables", "Machinery linkages", "Control cables"],
        variants: ["Clutch cable wire", "Control wire spools"],
        sizes: ["Spool sizes and lengths as per stock"],
        materials: ["Steel", "Galvanized"],
        notes: "Available in spools; used for clutch cables and similar applications. Contact us for gauge, length, and quantity.",
        indicativeRate: "Approx. ₹70–85 per kg (varies by gauge). Confirm for current price.",
      },
      {
        slug: "ms-wire-rope",
        name: "MS Wire Rope",
        shortDesc: "Mild steel wire rope for lifting, rigging, tying, and industrial use.",
        categorySlug: "wires",
        specs: [{ label: "Diameter", value: "2 mm to 20+ mm" }],
        images: ["/products/ms-wire-rope.png", "/products/ms-wire-rope-2.png"],
        image: "/products/ms-wire-rope.png",
        imageAlt: "MS wire rope wound on wooden spool",
        useCases: ["Hoisting", "Rigging", "Pulling", "Lifting", "Tying"],
        materials: ["Mild steel (MS)"],
        notes: "MS wire rope supplied by meter or coil. Contact us for diameter and length.",
        indicativeRate: "Approx. ₹85–180 per kg (varies by diameter). Confirm for current price.",
      },
      {
        slug: "ss-wire-rope",
        name: "SS Wire Rope",
        shortDesc: "Stainless steel wire rope for lifting, rigging, and industrial use with corrosion resistance.",
        categorySlug: "wires",
        specs: [{ label: "Diameter", value: "2 mm to 20+ mm" }],
        images: ["/products/ss-wire-rope.png", "/products/ss-wire-rope-2.png"],
        image: "/products/ss-wire-rope.png",
        imageAlt: "SS wire rope on spool",
        useCases: ["Hoisting", "Rigging", "Pulling", "Lifting", "Tying", "Marine and corrosive environments"],
        materials: ["Stainless steel (SS)"],
        notes: "SS wire rope supplied by meter or coil. Corrosion-resistant for demanding environments. Contact us for diameter and length.",
        indicativeRate: "Approx. ₹120–250 per kg (varies by diameter). Confirm for current price.",
      },
      {
        slug: "gi-wire-rope",
        name: "GI Wire Rope",
        shortDesc: "Galvanized iron wire rope for lifting, rigging, and industrial use with corrosion resistance.",
        categorySlug: "wires",
        specs: [{ label: "Diameter", value: "2 mm to 20+ mm" }],
        images: ["/products/gi-wire-rope.png"],
        image: "/products/gi-wire-rope.png",
        imageAlt: "GI wire rope coil",
        useCases: ["Hoisting", "Rigging", "Pulling", "Lifting", "Tying", "Outdoor applications"],
        materials: ["Galvanized iron (GI)"],
        notes: "GI wire rope supplied by meter or coil. Galvanized for better corrosion resistance. Contact us for diameter and length.",
        indicativeRate: "Approx. ₹85–180 per kg (varies by diameter). Confirm for current price.",
      },
      {
        slug: "wire-rope-clamp",
        name: "Wire Rope Clamp",
        shortDesc: "U-bolt wire rope clips for securing eyes, loops, and connections in wire rope.",
        categorySlug: "wires",
        specs: [
          { label: "Type", value: "U-bolt wire rope clip" },
          { label: "Finish", value: "Galvanized" },
        ],
        images: ["/products/wire-rope-clamp.png"],
        image: "/products/wire-rope-clamp.png",
        imageAlt: "Galvanized U-bolt wire rope clamp",
        useCases: ["Rigging", "Eye splicing", "Wire rope connections", "Lifting", "Securing loops"],
        materials: ["Galvanized steel"],
        notes: "Wire rope clamps for forming eyes and securing wire rope connections. Available in sizes to match rope diameter. Contact us for size and quantity.",
        indicativeRate: "Approx. ₹15–80 per piece (varies by size). Confirm for current price.",
      },
      {
        slug: "concertina-wire",
        name: "Concertina Wire",
        shortDesc: "Coiled barbed wire for high-security perimeter fencing.",
        categorySlug: "wires",
        specs: [{ label: "Type", value: "Single coil / Double coil" }],
        images: ["/products/concertina-wire-main.png"],
        image: "/products/concertina-wire-main.png",
        useCases: ["Security fencing", "Perimeter", "Industrial boundaries"],
        materials: ["Galvanized steel"],
        notes: "High-security fencing. Contact us for coil size and type.",
        indicativeRate: "Approx. ₹120–200 per metre (varies by type). Confirm for current price.",
      },
    ],
  },
  {
    slug: "construction-tools",
    name: "Construction Tools",
    description: "Crowbar, Sledge Hammer, Hoe (Phawda), Pickaxe (Geti), Shikanja, Coverblock, welding rods, sponge, cutting disc.",
    icon: "Wrench",
    products: [
      {
        slug: "sr-crowbar",
        name: "Crowbar",
        shortDesc: "Heavy-duty crowbars for demolition and site work.",
        categorySlug: "construction-tools",
        specs: [{ label: "Brand", value: "SR" }],
        images: ["/products/sr-crowbar-1.png", "/products/sr-crowbar-2.png"],
        image: "/products/sr-crowbar-1.png",
        imageAlt: "SR crowbar — black shaft with orange tip, heavy-duty digging and prying bars",
        useCases: ["Demolition", "Digging", "Prying"],
        indicativeRate: "Approx. ₹350–650 per piece. Confirm for current price.",
      },
      {
        slug: "sr-sledge-hammer",
        name: "Sledge Hammer",
        shortDesc: "Heavy-duty SR sledgehammer heads for demolition, driving stakes, and construction.",
        categorySlug: "construction-tools",
        specs: [
          { label: "Brand", value: "SR" },
          { label: "Sizes", value: "5M, 10M, 15M (head weight)" },
        ],
        images: ["/products/sr-sledge-hammer.png"],
        image: "/products/sr-sledge-hammer.png",
        imageAlt: "SR sledgehammer heads in blue — 5M, 10M, 15M sizes",
        useCases: ["Demolition", "Driving stakes", "Breaking concrete", "Construction", "Blacksmithing"],
        sizes: ["5M", "10M", "15M"],
        materials: ["Steel"],
        notes: "SR brand sledgehammer heads in multiple sizes. Contact us for availability and handle options.",
        indicativeRate: "Approx. ₹400–1,200 per piece (varies by size). Confirm for current price.",
      },
      {
        slug: "sr-hoe-faurdha",
        name: "Hoe (Phawda)",
        shortDesc: "Hoe blades for agriculture and gardening.",
        categorySlug: "construction-tools",
        specs: [{ label: "Brand", value: "SR" }],
        images: [
          "/products/sr-hoe-faurdha-1.png",
          "/products/sr-hoe-faurdha-2.png",
          "/products/sr-hoe-faurdha-3.png",
          "/products/sr-hoe-faurdha-4.png",
        ],
        image: "/products/sr-hoe-faurdha-1.png",
        imageAlt: "SR hoe (faurdha) — carbon steel hoe blades in blue, orange, red, green",
        useCases: ["Agriculture", "Gardening", "Digging"],
        indicativeRate: "Approx. ₹180–320 per piece. Confirm for current price.",
      },
      {
        slug: "sr-pickaxe-geti",
        name: "Pickaxe (Geti)",
        shortDesc: "Pickaxe heads for breaking ground and construction.",
        categorySlug: "construction-tools",
        specs: [{ label: "Brand", value: "SR" }],
        images: [
          "/products/sr-pickaxe-geti-1.png",
          "/products/sr-pickaxe-geti-2.png",
          "/products/sr-pickaxe-geti-3.png",
          "/products/sr-pickaxe-geti-4.png",
          "/products/sr-pickaxe-geti-5.png",
        ],
        image: "/products/sr-pickaxe-geti-1.png",
        imageAlt: "SR pickaxe (geti) — carbon steel pickaxe heads, multiple weights and colors",
        useCases: ["Breaking ground", "Rock and soil", "Construction"],
        indicativeRate: "Approx. ₹280–450 per piece. Confirm for current price.",
      },
      {
        slug: "santing-shikanja",
        name: "Shikanja",
        shortDesc: "Heavy-duty construction clamps for formwork and shuttering.",
        categorySlug: "construction-tools",
        images: ["/products/santing-shikanja-1.png"],
        image: "/products/santing-shikanja-1.png",
        imageAlt: "Santing / Shikanja — heavy-duty construction clamps for formwork",
        useCases: ["RCC slab casting", "Beam formwork", "Shuttering"],
        indicativeRate: "Approx. ₹45–85 per piece. Confirm for current price.",
      },
      {
        slug: "concrete-cover-block",
        name: "Coverblock",
        shortDesc: "Concrete cover blocks (spacers) for RCC rebar cover.",
        categorySlug: "construction-tools",
        images: ["/products/concrete-cover-block-1.png", "/products/concrete-cover-block-2.png", "/products/concrete-cover-block-3.png"],
        image: "/products/concrete-cover-block-1.png",
        imageAlt: "Concrete cover block for rebar spacing in RCC",
        useCases: ["RCC slabs", "Beams", "Columns"],
        sizes: ["20mm", "25mm", "30mm", "40mm", "50mm cover"],
        indicativeRate: "Approx. ₹3–8 per piece. Confirm for current price.",
      },
      {
        slug: "welding-rods",
        name: "Welding Rods",
        shortDesc: "Arc welding electrodes in various grades.",
        categorySlug: "construction-tools",
        specs: [
          { label: "Types", value: "E6013, E7018 commonly requested" },
          { label: "Sizes", value: "2.5mm, 3.15mm, 4.0mm" },
          { label: "Packing", value: "1kg / 5kg boxes (varies by brand)" },
        ],
        images: ["/products/welding-rod.png"],
        image: "/products/welding-rod.png",
        imageAlt: "Assortment of welding rods with different colored coatings",
        useCases: ["MS fabrication", "Repair work"],
        variants: ["E6013", "E7018", "E7024", "E6010"],
        sizes: ["2.5mm", "3.15mm", "4.0mm"],
        materials: ["Coated electrodes"],
        notes: "Available in different types and sizes; availability depends on stock. Commonly requested types include E6013 and E7018 for general fabrication and repair work.",
        indicativeRate: "Approx. ₹95–130 per kg (varies by type and size). Confirm for current price.",
      },
      {
        slug: "sponge",
        name: "Sponge",
        shortDesc: "Sponge for cleaning, finishing, and site work.",
        categorySlug: "construction-tools",
        specs: [
          { label: "Sizes", value: "Small, medium, and large (as available)" },
          { label: "Density", value: "Soft / medium / firm (subject to stock)" },
          { label: "Packing", value: "Single pieces or packs (as available)" },
        ],
        images: ["/products/welding-rod.png"],
        image: "/products/welding-rod.png",
        imageAlt: "Construction and cleaning sponge",
        useCases: ["Tiling cleanup", "Grouting", "Surface wiping", "General site cleaning"],
        sizes: [
          "Available in small, medium, and large sizes",
          "Multiple thickness and density options (soft/medium/firm), subject to stock",
          "Sold as single pieces or packs (as available)",
        ],
        notes: "Call/WhatsApp for the exact size and type you need.",
        indicativeRate: "Approx. ₹25–75 per piece (varies by size). Confirm for current price.",
      },
      {
        slug: "cutting-discs-grinding-wheels",
        name: "Cutting Disc & Grinding Wheels",
        shortDesc: "Abrasive cutting and grinding discs for metal and fabrication.",
        categorySlug: "construction-tools",
        specs: [
          { label: "Diameter", value: "4\" to 7\" (100mm to 180mm) common" },
          { label: "Thickness", value: "1mm to 3mm (cutting); 6mm (grinding)" },
          { label: "Bore", value: "22mm standard" },
        ],
        images: ["/products/grinding-disc-main.png", "/products/grinding-disc-1.png"],
        image: "/products/grinding-disc-main.png",
        imageAlt: "Cutting and grinding discs for metal work",
        useCases: ["Metal cutting", "Grinding", "Fabrication", "Site work"],
        variants: ["Cutting discs", "Grinding wheels", "Flexible discs"],
        sizes: ["100mm (4\")", "115mm", "125mm (5\")", "150mm (6\")", "180mm (7\")"],
        materials: ["Abrasive"],
        notes: "Available in various sizes and grades; availability depends on stock. Contact us for bulk or specific requirements.",
        indicativeRate: "Approx. ₹35–95 per piece (varies by diameter and type). Confirm for current price.",
      },
      {
        slug: "sr-hoe-faurdha-with-handle",
        name: "Hoe (Faurdha) with Handle",
        shortDesc: "Hoe (faurdha) with handle — carbon steel blade and fitted handle. Ready to use for agriculture and gardening.",
        categorySlug: "construction-tools",
        specs: [
          { label: "Brand", value: "SR" },
          { label: "Material", value: "Carbon steel blade" },
          { label: "Type", value: "Hoe with handle (complete tool)" },
          { label: "Finish", value: "Green, black, or as per stock" },
        ],
        images: [
          "/products/sr-hoe-faurdha-with-handle-1.png",
          "/products/sr-hoe-faurdha-with-handle-2.png",
        ],
        videos: ["/products/sr-hoe-with-handle.mp4"],
        image: "/products/sr-hoe-faurdha-with-handle-1.png",
        imageAlt: "Hoe (faurdha) with handle — carbon steel hoe, ready to use",
        useCases: ["Agriculture", "Gardening", "Digging", "Weeding", "Site work"],
        variants: ["Green with handle", "Black with handle", "Other colors as per stock"],
        sizes: ["Standard; handle length and blade size as per stock"],
        materials: ["Carbon steel", "Handle (wood/metal as supplied)"],
        notes: "SR brand hoe (faurdha) supplied with handle. Carbon steel blade, ready to use. Available in green, black, and other colors. Contact us for availability.",
        indicativeRate: "Approx. ₹220–380 per piece (with handle). Confirm for current price.",
      },
    ],
  },
  {
    slug: "frp-bars",
    name: "FRP Bars",
    description: "FRP bars used for fencing & construction; corrosion-resistant reinforcement.",
    icon: "Box",
    products: [
      {
        slug: "frp-bars",
        name: "FRP Bars",
        shortDesc: "Fiber Reinforced Polymer bars for concrete reinforcement; used for fencing & construction.",
        categorySlug: "frp-bars",
        specs: [
          { label: "Diameter", value: "6mm to 20mm (commonly 8mm, 10mm, 12mm, 16mm)" },
          { label: "Length & weight", value: "4 ft – 530 g, 5 ft – 660 g, 6 ft – 790 g" },
          { label: "Material", value: "Glass fiber reinforced polymer" },
        ],
        images: ["/products/frp-bars-1.png", "/products/frp-bars-2.png", "/products/frp-bars-3.png"],
        videos: ["/products/frp-bars-pipe.mp4"],
        useCases: ["RCC", "Fencing", "Marine structures", "Bridges"],
        sizes: ["4 ft (530 g)", "5 ft (660 g)", "6 ft (790 g)", "6mm", "8mm", "10mm", "12mm", "16mm", "20mm diameter"],
        materials: ["Glass fiber reinforced polymer (GFRP)"],
        notes: "Corrosion-resistant alternative to steel TMT. Available in 4 ft / 5 ft / 6 ft lengths and diameters 6mm–20mm.",
        indicativeRate: "Approx. ₹90–120 per kg (varies by diameter and length). Confirm for current price.",
      },
    ],
  },
  {
    slug: "fibermesh",
    name: "Fibermesh",
    description: "Fiber mesh used in construction & wall plastering. Available in sizes 4\", 6\", 8\", & 1 m.",
    icon: "Grid3X3",
    products: [
      {
        slug: "fiber-mesh",
        name: "Fibermesh",
        shortDesc: "Fiberglass reinforcement mesh for plaster, render, and construction; crack resistance.",
        categorySlug: "fibermesh",
        specs: [
          { label: "Material", value: "Fiberglass" },
          { label: "Width", value: "4\", 6\", 8\", 1 m" },
        ],
        images: ["/products/fiber-mesh-main.png", "/products/fiber-mesh-1.png"],
        useCases: ["Plaster reinforcement", "Wall plastering", "Crack prevention", "Construction"],
        sizes: ["4\"", "6\"", "8\"", "1 m"],
        materials: ["Fiberglass"],
        notes: "Fiber mesh for embedding in plaster or render. Available in 4\", 6\", 8\", and 1 m width.",
        indicativeRate: "Approx. ₹15–35 per metre (varies by width). Confirm for current price.",
      },
    ],
  },
  {
    slug: "chicken-mesh",
    name: "Chicken Mesh",
    description: "G.I chicken mesh (poultry mesh) for enclosures and light fencing.",
    icon: "Grid3X3",
    products: [
      {
        slug: "chicken-net",
        name: "G.I Chicken Mesh (Poultry Mesh)",
        shortDesc: "Hexagonal galvanized wire net for poultry, enclosures, and light fencing.",
        categorySlug: "chicken-mesh",
        specs: [{ label: "Mesh", value: "Small hexagonal (poultry grade)" }],
        images: ["/products/chicken-net-1.png"],
        useCases: ["Poultry enclosures", "Bird cages", "Light fencing"],
        materials: ["Galvanized iron"],
        notes: "Available in roll form. Contact us for mesh size and dimensions.",
        indicativeRate: "Approx. ₹45–65 per metre (varies by width and mesh). Confirm for current price.",
      },
    ],
  },
  {
    slug: "plastic-hexa",
    name: "Plastic Hexa",
    description: "Hexa mesh and square mesh (available in different hole sizes).",
    icon: "Grid3X3",
    products: [
      {
        slug: "plastic-hexagonal-poultry-mesh",
        name: "Hexa Mesh",
        shortDesc: "Plastic hexagonal mesh for poultry, garden fencing, and light barriers.",
        categorySlug: "plastic-hexa",
        specs: [{ label: "Material", value: "Plastic" }, { label: "Pattern", value: "Hexagonal" }],
        images: ["/products/hexa-mesh-1.png", "/products/hexa-mesh-2.png"],
        image: "/products/hexa-mesh-1.png",
        imageAlt: "Plastic hexa mesh — green hexagonal mesh in rolls",
        useCases: ["Poultry", "Garden fencing", "Pet enclosures"],
        materials: ["Plastic"],
        notes: "Lightweight plastic hexagonal mesh. Available in green, white, and other colors.",
        indicativeRate: "Approx. ₹25–55 per metre (varies by width). Confirm for current price.",
      },
      {
        slug: "square-mesh",
        name: "Square Mesh",
        shortDesc: "Plastic square mesh available in different hole sizes and colors.",
        categorySlug: "plastic-hexa",
        specs: [{ label: "Pattern", value: "Square mesh" }, { label: "Hole sizes", value: "Various" }],
        images: ["/products/square-mesh-1.png", "/products/square-mesh-2.png"],
        image: "/products/square-mesh-1.png",
        imageAlt: "Plastic square mesh — blue and green square grid mesh in rolls",
        materials: ["Plastic"],
        useCases: ["Poultry", "Garden fencing", "Screening", "Light barriers"],
        notes: "Square mesh in different hole sizes and colors (e.g. blue, green). Contact us for dimensions.",
        indicativeRate: "Contact for price.",
      },
    ],
  },
  {
    slug: "nails",
    name: "Nails",
    description: "Wire nails (1 inch to 6 inch) and roofing nails (1.5 inch to 6 inch).",
    icon: "Wrench",
    products: [
      {
        slug: "fasteners-nails",
        name: "Wire Nails (1\" to 6\")",
        shortDesc: "Wire nails for construction — 1 inch to 6 inch.",
        categorySlug: "nails",
        specs: [{ label: "Sizes", value: "1\" to 6\"" }],
        images: ["/products/wire-nail-1.png"],
        sizes: ["1\"", "2\"", "3\"", "4\"", "5\"", "6\""],
        useCases: ["Structural", "Roofing", "Carpentry", "Fencing"],
        materials: ["Mild steel", "Galvanized"],
        notes: "Wire nails in lengths from 1 inch to 6 inch. Specify size and quantity.",
        indicativeRate: "Approx. ₹65–95 per kg (varies by size). Confirm for current price.",
      },
      {
        slug: "roofing-nail",
        name: "Roofing Nails (1.5\" to 6\")",
        shortDesc: "Roofing nails with wide flat head — 1.5 inch to 6 inch.",
        categorySlug: "nails",
        specs: [{ label: "Sizes", value: "1.5\" to 6\"" }],
        images: ["/products/roofing-nail-1.png"],
        sizes: ["1.5\"", "2\"", "2.5\"", "3\"", "4\"", "5\"", "6\""],
        useCases: ["Roofing", "Shingles", "Sheet fixing"],
        materials: ["Mild steel", "Galvanized"],
        notes: "Roofing nails with wide flat head. Available from 1.5 inch to 6 inch.",
        indicativeRate: "Approx. ₹70–100 per kg (varies by size). Confirm for current price.",
      },
    ],
  },
  {
    slug: "safety-nets-equipments",
    name: "Safety Nets & Equipments",
    description: "Pigeon net, pigeon spikes/bird spikes, and safety net.",
    icon: "Box",
    products: [
      {
        slug: "pigeon-nets",
        name: "Pigeon Net",
        shortDesc: "Nylon and wire pigeon deterrent nets for balconies and ducts.",
        categorySlug: "safety-nets-equipments",
        specs: [{ label: "Materials", value: "Nylon/HDPE" }],
        images: ["/products/pigeon-net.png"],
        useCases: ["Balconies", "Windows", "Shafts"],
        sizes: ["Widths: 3ft to 20ft", "Lengths: As required"],
        materials: ["Nylon", "HDPE"],
        notes: "Available in different sizes and colors. Custom cut to size.",
        indicativeRate: "Approx. ₹15–40 per sq m. Confirm for current price.",
      },
      {
        slug: "pigeon-spikes",
        name: "Pigeon Spikes / Bird Spikes",
        shortDesc: "Plastic and SS pigeon spikes for ledges, parapets, and sign boards.",
        categorySlug: "safety-nets-equipments",
        images: ["/products/pigeon-spike-1.png"],
        useCases: ["Window ledges", "Parapet walls", "Sign boards"],
        variants: ["Plastic spikes", "SS wire spikes"],
        materials: ["UV-stabilized plastic", "Stainless steel"],
        notes: "Pigeon spikes to prevent birds from sitting on ledges and beams.",
        indicativeRate: "Approx. ₹25–80 per metre (plastic) / ₹150–350 per metre (SS). Confirm for current price.",
      },
      {
        slug: "safety-net",
        name: "Safety Net",
        shortDesc: "Construction safety nets for fall protection and debris containment.",
        categorySlug: "safety-nets-equipments",
        specs: [{ label: "Type", value: "Construction / fall protection" }],
        images: ["/products/safety-net-1.png"],
        useCases: ["Scaffolding", "Fall protection", "Debris containment", "Construction sites"],
        materials: ["Nylon", "Polyethylene"],
        notes: "Heavy-duty safety nets for construction and scaffolding. Contact us for dimensions.",
        indicativeRate: "Approx. ₹35–90 per sq m. Confirm for current price.",
      },
    ],
  }
];

export type ProductWithCategory = Product & { categoryName: string };

/** All products flattened for search and detail pages */
export const allProducts: ProductWithCategory[] = categories.flatMap((c) =>
  c.products.map((p) => ({ ...p, categoryName: c.name }))
);

export function getProductBySlug(slug: string): ProductWithCategory | null {
  const found = allProducts.find((p) => p.slug === slug);
  return found ?? null;
}

export function getCategoryBySlug(slug: string): Category | null {
  return categories.find((c) => c.slug === slug) ?? null;
}

/** Featured product slugs for homepage (subset) */
export const featuredProductSlugs: string[] = [
  "ms-angles",
  "tmt-bars",
  "gi-pipes",
  "gi-wire",
  "gi-weldmesh",
  "perforated-sheets",
  "chain-link-fencing",
  "fasteners-nails",
  "ms-flats",
  "barbed-wire",
];

export function getFeaturedProducts(): ProductWithCategory[] {
  return featuredProductSlugs
    .map((slug) => allProducts.find((p) => p.slug === slug))
    .filter((p): p is ProductWithCategory => !!p);
}

/**
 * Get product images array with backward compatibility.
 * If brandId is provided and product has brandVariants for that brand, returns brand images.
 */
export function getProductImages(
  product: Product,
  category?: Category | null,
  brandId?: BrandId
): string[] {
  if (brandId && product.brandVariants) {
    const variant = product.brandVariants.find((v) => v.brandId === brandId);
    if (variant?.images?.length) return variant.images;
  }
  if (product.images && product.images.length > 0) {
    return product.images;
  }
  if (product.image) {
    return [product.image];
  }
  if (category?.image) {
    return [category.image];
  }
  return ["/placeholder-product.svg"];
}

/** Get product videos (brand variant or product-level). */
export function getProductVideos(
  product: Product,
  brandId?: BrandId
): string[] {
  if (brandId && product.brandVariants) {
    const variant = product.brandVariants.find((v) => v.brandId === brandId);
    if (variant?.videos?.length) return variant.videos;
  }
  return product.videos ?? [];
}

/** Media item for gallery: image or video. */
export type ProductMediaItem = { type: "image"; src: string } | { type: "video"; src: string };

/** Get combined images + videos for product gallery (images first, then videos). */
export function getProductMedia(
  product: Product,
  category?: Category | null,
  brandId?: BrandId
): ProductMediaItem[] {
  const images = getProductImages(product, category, brandId);
  const videos = getProductVideos(product, brandId);
  const imageItems: ProductMediaItem[] = images.map((src) => ({ type: "image", src }));
  const videoItems: ProductMediaItem[] = videos.map((src) => ({ type: "video", src }));
  return [...imageItems, ...videoItems];
}

/** Get brand variant for a product by brandId */
export function getBrandVariant(product: Product, brandId: BrandId): BrandVariant | undefined {
  return product.brandVariants?.find((v) => v.brandId === brandId);
}

/** Get related products (same category, excluding current), for internal linking and SEO */
export function getRelatedProducts(productSlug: string, limit = 4): ProductWithCategory[] {
  const product = getProductBySlug(productSlug);
  if (!product) return [];
  return allProducts
    .filter((p) => p.categorySlug === product.categorySlug && p.slug !== productSlug)
    .slice(0, limit);
}
