/**
 * Product categories and products. Edit this file to update catalog.
 * All images are local files in /public/products/
 */

import type { BrandId } from "@/content/brands";

export type ProductSpec = { label: string; value: string };

export type BrandVariant = {
  brandId: BrandId;
  images: string[];
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
  useCases?: string[];
  variants?: string[];
  sizes?: string[];
  materials?: string[];
  notes?: string;
  /** Whether Tata products are available for this item (authorized dealer) */
  tataAvailable?: boolean;
  /** Official Tata distributor/retailer for this product (steel only; show badge + logo) */
  tataOfficial?: boolean;
  /** Brand-specific variants (CM, Boarder) with images and range */
  brandVariants?: BrandVariant[];
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

export const categories: Category[] = [
  {
    slug: "iron-steel",
    name: "Iron & Steel",
    description:
      "MS angles, flats, bright bars, rods, TMT bars, and structural sections for construction and fabrication.",
    icon: "Box",
    image: "/products/ms-angle.png",
    imageAlt: "Industrial steel sections including MS angles, pipes, and bars",
    products: [
      {
        slug: "ms-angles",
        name: "MS Angles",
        shortDesc: "Mild steel angles in various sizes for fabrication and structural use.",
        categorySlug: "iron-steel",
        specs: [
          { label: "Common sizes", value: "20x20 to 100x100 mm" },
          { label: "Thickness", value: "3mm to 10mm" },
          { label: "Lengths", value: "6m / 12m" },
          { label: "Grades", value: "Commonly IS 2062 / mild steel" },
        ],
        images: ["/products/ms-angle.png"],
        image: "/products/ms-angle.png",
        imageAlt: "Stack of MS angles in a warehouse",
        useCases: ["Fabrication", "Structural frames", "Support brackets"],
        variants: ["Equal angles", "Unequal angles"],
        sizes: ["20x20mm", "25x25mm", "30x30mm", "40x40mm", "50x50mm", "65x65mm", "75x75mm", "100x100mm"],
        materials: ["Mild steel (MS)", "IS 2062 grade"],
        notes: "Available in different sizes and thicknesses; availability depends on stock. Commonly requested sizes include 25x25mm, 40x40mm, 50x50mm, and 75x75mm.",
        tataAvailable: true,
        tataOfficial: true,
      },
      {
        slug: "ms-flats",
        name: "MS Flats",
        shortDesc: "Mild steel flat bars for welding and fabrication.",
        categorySlug: "iron-steel",
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
      },
      {
        slug: "bright-bars",
        name: "Bright Bars",
        shortDesc: "Cold-drawn bright bars for precision applications.",
        categorySlug: "iron-steel",
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
      },
      {
        slug: "tmt-bars",
        name: "TMT Bars",
        shortDesc: "Thermo-mechanically treated bars for reinforced concrete.",
        categorySlug: "iron-steel",
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
      },
      {
        slug: "ms-round-bars",
        name: "MS Round Bars / Rods",
        shortDesc: "Mild steel round bars in various diameters.",
        categorySlug: "iron-steel",
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
      },
    ],
  },
  {
    slug: "pipes-sections",
    name: "Pipes & Sections",
    description: "Pipes and tubes in assorted sizes for plumbing, structural, and industrial use.",
    icon: "Cylinder",
    image: "/products/gi-pipes.png",
    imageAlt: "Shiny galvanized iron pipes (GI pipes) stacked in an industrial environment",
    products: [
      {
        slug: "gi-pipes",
        name: "GI Pipes",
        shortDesc: "Galvanized iron pipes for water and general use.",
        categorySlug: "pipes-sections",
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
      },
      {
        slug: "ms-pipes",
        name: "MS Pipes",
        shortDesc: "Mild steel pipes for structural and industrial applications.",
        categorySlug: "pipes-sections",
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
      },
      {
        slug: "square-tubes",
        name: "Square & Rectangular Tubes",
        shortDesc: "Hollow sections for fabrication and furniture.",
        categorySlug: "pipes-sections",
        specs: [
          { label: "Size range", value: "25x25 to 150x150 mm" },
          { label: "Thickness", value: "1.2 mm to 4 mm" },
        ],
        images: ["/products/warehouse-steel-sections.png"],
        image: "/products/warehouse-steel-sections.png",
        imageAlt: "Square and rectangular hollow steel sections",
        useCases: ["Gates", "Furniture", "Fabrication"],
        variants: ["Square tubes", "Rectangular tubes"],
        sizes: ["25x25mm", "30x30mm", "40x40mm", "50x50mm", "65x65mm", "75x75mm", "100x100mm", "150x150mm"],
        materials: ["Mild steel"],
        notes: "Available in different sizes and thicknesses; availability depends on stock. Commonly used for gates, furniture, and fabrication work.",
        tataAvailable: true,
        tataOfficial: true,
      },
    ],
  },
  {
    slug: "wire-mesh",
    name: "Wire & Mesh",
    description: "GI wire, binding wire, barbed wire, chain link, welded mesh, and jalies.",
    icon: "Grid3X3",
    image: "/products/gi-wire.png",
    imageAlt: "Coil of galvanized iron wire",
    products: [
      {
        slug: "gi-wire",
        name: "GI Wire",
        shortDesc: "Galvanized iron wire for binding and general use.",
        categorySlug: "wire-mesh",
        specs: [
          { label: "Gauge", value: "8 SWG to 18 SWG (or 1.2–4.0mm)" },
          { label: "Packing", value: "Coils" },
        ],
        images: ["/products/gi-wire.png"],
        image: "/products/gi-wire.png",
        imageAlt: "Coil of galvanized iron wire",
        useCases: ["Binding", "Fencing", "General purpose"],
        variants: ["GI wire coils", "Annealed GI wire"],
        sizes: ["8 SWG", "10 SWG", "12 SWG", "14 SWG", "16 SWG", "18 SWG"],
        materials: ["Galvanized iron"],
        notes: "Available in different gauges and coil weights; availability depends on stock. Commonly used for binding, fencing, and general tying purposes.",
        tataAvailable: true,
      },
      {
        slug: "binding-wire",
        name: "Binding Wire",
        shortDesc: "Annealed binding wire for RCC work.",
        categorySlug: "wire-mesh",
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
      },
      {
        slug: "barbed-wire",
        name: "Barbed Wire",
        shortDesc: "Barbed wire for boundary and security fencing.",
        categorySlug: "wire-mesh",
        specs: [
          { label: "Wire diameter", value: "Common 12x14 gauge / 2.5mm (common market)" },
          { label: "Types", value: "Single / Double strand" },
          { label: "Packing", value: "Coils up to 25 kg (varies by type and stock)" },
        ],
        images: ["/products/barbed-wire.png"],
        image: "/products/barbed-wire.png",
        imageAlt: "Large coil of barbed wire for security fencing",
        useCases: ["Security fencing", "Boundary fencing"],
        variants: ["Single strand", "Double strand", "2-point", "4-point"],
        sizes: ["Standard coils: 5kg", "10kg", "20kg", "25kg", "Packing: coils up to 25 kg (varies by type and stock)"],
        materials: ["Galvanized iron"],
        notes: "Available in different types and packing sizes; availability depends on stock. Commonly used for boundary and security fencing applications. Packing: coils up to 25 kg (varies by type and stock).",
        tataAvailable: true,
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
            notes: "Boarder brand barbed wire. Available in single/double strand; gauges and coil sizes as per stock.",
          },
        ],
      },
      {
        slug: "chain-link-fencing",
        name: "Chain Link Fencing",
        shortDesc: "Galvanized chain link mesh for compound fencing.",
        categorySlug: "wire-mesh",
        specs: [
          { label: "Mesh opening", value: "1\" to 3\"" },
          { label: "Wire diameter", value: "~2.0mm to 4.0mm" },
          { label: "Height", value: "3ft to 10ft rolls" },
          { label: "Finish", value: "GI / PVC coated" },
        ],
        images: ["/products/chain-link-wire.png"],
        image: "/products/chain-link-wire.png",
        imageAlt: "Roll of galvanized chain link fence with diamond mesh pattern",
        useCases: ["Fencing", "Boundaries"],
        variants: ["GI chain link", "PVC coated chain link"],
        sizes: ["Mesh: 1\"", "2\"", "3\"", "Height: 3ft", "4ft", "5ft", "6ft", "8ft", "10ft"],
        materials: ["Galvanized iron", "PVC coated"],
        notes: "Available in different mesh sizes and heights; availability depends on stock. Commonly used for compound fencing, sports grounds, and industrial boundaries.",
        tataAvailable: true,
        brandVariants: [
          {
            brandId: "cm",
            images: ["/products/brands/cm/chainlink-1.png", "/products/brands/cm/chainlink-2.png"],
            specs: [
              { label: "Mesh opening", value: "1\" to 3\" (common)" },
              { label: "Wire diameter", value: "~2.0mm to 4.0mm" },
              { label: "Heights", value: "3ft to 10ft rolls" },
              { label: "Finish", value: "GI / PVC coated (available depending on stock)" },
            ],
            sizes: ["Mesh: 1\"", "2\"", "3\"", "Height: 3ft", "4ft", "5ft", "6ft", "8ft", "10ft"],
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
              { label: "Mesh opening", value: "1\" to 3\" (common)" },
              { label: "Wire diameter", value: "~2.0mm to 4.0mm" },
              { label: "Heights", value: "3ft to 10ft rolls" },
              { label: "Finish", value: "GI / PVC coated (available depending on stock)" },
            ],
            sizes: ["Mesh: 1\"", "2\"", "3\"", "Height: 3ft", "4ft", "5ft", "6ft", "8ft", "10ft"],
            materials: ["Galvanized iron", "PVC coated"],
            useCases: ["Boundary fencing", "Sports grounds", "Industrial", "Farm"],
            notes: "Boarder brand chain link fencing (jali). Mesh and heights as per stock.",
          },
        ],
      },
      {
        slug: "welded-mesh",
        name: "Welded Mesh",
        shortDesc: "Welded wire mesh for reinforcement and partitioning.",
        categorySlug: "wire-mesh",
        specs: [
          { label: "Mesh", value: "15mm x 15mm, 50x50 to 150x150 mm (commonly available)" },
          { label: "Wire", value: "3–5 mm" },
        ],
        images: ["/products/15mmx15mm-welded-wiremesh.png", "/products/welding-mesh.png", "/products/chain-link-wire.png"],
        image: "/products/15mmx15mm-welded-wiremesh.png",
        imageAlt: "Welded steel mesh sheets stacked together",
        useCases: ["RCC slabs", "Partition", "Cages"],
        variants: ["Welded wire mesh"],
        sizes: ["15mm x 15mm", "50x50mm", "75x75mm", "100x100mm", "150x150mm"],
        materials: ["Mild steel wire"],
        notes: "Available in different mesh sizes and wire diameters; availability depends on stock. Used for RCC slab reinforcement, partitions, and cages. Common mesh sizes include 15mm x 15mm.",
      },
      {
        slug: "ss-gi-mesh-jalies",
        name: "SS / GI Mesh & Jalies",
        shortDesc: "Stainless steel and GI mesh, jalies for windows and grilles.",
        categorySlug: "wire-mesh",
        specs: [
          { label: "Material", value: "SS 304, GI" },
          { label: "Pattern", value: "As per design" },
        ],
        images: ["/products/ss-gi-mesh-and-jali.png", "/products/chain-link-wire.png"],
        image: "/products/ss-gi-mesh-and-jali.png",
        imageAlt: "Decorative steel mesh and jalies for windows",
        useCases: ["Windows", "Ventilation", "Safety grilles"],
        variants: ["SS 304 mesh", "GI mesh", "Decorative jalies"],
        sizes: ["Custom sizes as per design"],
        materials: ["Stainless steel 304", "Galvanized iron"],
        notes: "Available in different patterns and materials; availability depends on stock. Custom designs available as per requirements.",
      },
      {
        slug: "wire-rope",
        name: "Wire Rope",
        shortDesc: "Steel wire rope for lifting, tying, and industrial use.",
        categorySlug: "wire-mesh",
        specs: [
          { label: "Diameter", value: "Commonly 2 mm to 20+ mm (small to heavy duty)" },
          { label: "Construction", value: "6x19, 6x36 (commonly requested), as per requirement" },
          { label: "Core", value: "Fiber core or steel core (as available)" },
          { label: "Finish", value: "Galvanized / ungalvanized (as available)" },
          { label: "Supply", value: "By meter length or full coil/drum (depending on size)" },
        ],
        image: "/products/gi-wire.png",
        imageAlt: "Steel wire rope for lifting and rigging",
        useCases: ["Hoisting", "Rigging", "Pulling", "General industrial and construction use"],
        sizes: ["2mm to 20+ mm diameter", "Supplied by meter or coil/drum"],
        materials: ["Steel", "Galvanized or ungalvanized"],
        notes: "Tell us diameter + length + application and we'll suggest the right rope.",
      },
    ],
  },
  {
    slug: "hardware-tools",
    name: "Hardware & Tools",
    description: "Welding rods, fasteners, nails, crowbars, pickaxes, perforated sheets, pigeon nets.",
    icon: "Wrench",
    image: "/products/welding-rod.png",
    imageAlt: "Assortment of welding rods with different colored coatings",
    products: [
      {
        slug: "welding-rods",
        name: "Welding Rods",
        shortDesc: "Arc welding electrodes in various grades.",
        categorySlug: "hardware-tools",
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
      },
      {
        slug: "fasteners-nails",
        name: "Fasteners & Nails",
        shortDesc: "Bolts, nuts, washers, and nails for construction.",
        categorySlug: "hardware-tools",
        specs: [
          { label: "Types", value: "MS, SS, GI" },
          { label: "Sizes", value: "As per requirement" },
        ],
        images: ["/products/fastener-nail.png", "/products/fastener-nail-1.png", "/products/types-nails.png"],
        image: "/products/fastener-nail.png",
        imageAlt: "Assorted construction fasteners and bolts",
        useCases: ["Structural", "Roofing", "General fixing"],
        variants: ["Bolts", "Nuts", "Washers", "Nails", "Screws"],
        sizes: ["Various sizes as per requirement"],
        materials: ["Mild steel", "Stainless steel", "Galvanized iron"],
        notes: "Available in different types and sizes; availability depends on stock. Please specify your requirements for accurate pricing.",
      },
      {
        slug: "crowbars-pickaxes",
        name: "Crowbars & Pickaxes",
        shortDesc: "Construction and digging tools.",
        categorySlug: "hardware-tools",
        specs: [
          { label: "Type", value: "Heavy duty" },
          { label: "Finish", value: "Black / Galvanized" },
        ],
        images: ["/products/pickaxe-crowbar.png", "/products/pickaxe-crowbar-2.png", "/products/pickaxe-crowbar-3.png", "/products/pickaxe-crowbar-4.png"],
        image: "/products/pickaxe-crowbar.png",
        imageAlt: "Heavy-duty crowbar and demolition tools",
        useCases: ["Demolition", "Digging", "Site work"],
        variants: ["Crowbars", "Pickaxes"],
        sizes: ["Standard sizes"],
        materials: ["Mild steel"],
        notes: "Available in different finishes; availability depends on stock. Heavy-duty construction tools for demolition and site work.",
      },
      {
        slug: "perforated-sheets",
        name: "Perforated Sheets",
        shortDesc: "MS and GI perforated sheets for screening and filtration.",
        categorySlug: "hardware-tools",
        specs: [
          { label: "Thickness", value: "0.5 mm to 3 mm" },
          { label: "Hole pattern", value: "Round, square, slot" },
        ],
        images: ["/products/perforated-sheet.png", "/products/perforated-sheet-2.png"],
        image: "/products/perforated-sheet.png",
        imageAlt: "Perforated steel sheet for ventilation and screening",
        useCases: ["Screens", "Ventilation", "Filtration"],
        variants: ["Round holes", "Square holes", "Slot holes"],
        sizes: ["Custom sizes as per requirement"],
        materials: ["Mild steel", "Galvanized iron"],
        notes: "Available in different thicknesses and hole patterns; availability depends on stock. Custom sizes available as per requirements.",
      },
      {
        slug: "pigeon-nets",
        name: "Pigeon Nets",
        shortDesc: "Nylon and wire pigeon deterrent nets for balconies and ducts.",
        categorySlug: "hardware-tools",
        specs: [
          { label: "Sizes", value: "Custom cut; widths 3ft–20ft; lengths as required" },
          { label: "Materials", value: "Nylon/HDPE" },
          { label: "Colors", value: "Black/white/transparent/green (colors available)" },
          { label: "Styles", value: "Knotless, knotted, UV stabilized options" },
        ],
        images: ["/products/pigeon-net.png"],
        image: "/products/pigeon-net.png",
        imageAlt: "Close-up of white knotted pigeon net held by a hand, showing the small mesh size and durable fiber material",
        useCases: ["Balconies", "Windows", "Shafts"],
        variants: ["Knotless", "Knotted", "UV stabilized"],
        sizes: ["Widths: 3ft to 20ft", "Lengths: As required"],
        materials: ["Nylon", "HDPE"],
        notes: "Available in different sizes, colors, and styles; availability depends on stock. Custom cut to size. UV stabilized options available for outdoor use.",
      },
      {
        slug: "sponge",
        name: "Sponge",
        shortDesc: "Sponge for cleaning, finishing, and site work.",
        categorySlug: "hardware-tools",
        specs: [
          { label: "Sizes", value: "Small, medium, and large (as available)" },
          { label: "Density", value: "Soft / medium / firm (subject to stock)" },
          { label: "Packing", value: "Single pieces or packs (as available)" },
        ],
        image: "/products/welding-rod.png",
        imageAlt: "Construction and cleaning sponge",
        useCases: ["Tiling cleanup", "Grouting", "Surface wiping", "General site cleaning"],
        sizes: [
          "Available in small, medium, and large sizes",
          "Multiple thickness and density options (soft/medium/firm), subject to stock",
          "Sold as single pieces or packs (as available)",
        ],
        notes: "Call/WhatsApp for the exact size and type you need.",
      },
    ],
  },
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
  "binding-wire",
  "welded-mesh",
  "welding-rods",
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
