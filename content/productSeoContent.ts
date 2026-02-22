/**
 * Unique SEO content per product page (800–1200 words).
 * Sections: Overview, Uses in Indore, Specifications, Buying guide, Pricing factors, Why us, FAQs, Service area.
 * City keywords: Indore, Siyaganj, Loha Mandi, New Siyaganj; nearby: Dewas, Pithampur, Ujjain.
 */

export type ProductSeoFaq = { question: string; answer: string };

export type ProductSeoContent = {
  overview: string;
  usesInIndore: string;
  buyingGuide: string;
  pricingFactors: string;
  whyUs: string;
  serviceArea: string;
  faqs: ProductSeoFaq[];
  /** Override related product slugs; otherwise same-category is used */
  relatedProductSlugs?: string[];
  /** Blog post slugs to link (Read next) */
  relatedBlogSlugs?: string[];
};

import type { ProductWithCategory } from "./products";

const contentMap: Partial<Record<string, ProductSeoContent>> = {
  "ms-angles": {
    overview: `Mild steel (MS) angles are L-shaped structural sections used widely in fabrication, frames, and support work across Indore and the region. At H.M. Ibrahim & Co we stock equal and unequal angles in sizes from 20x20 mm to 100x100 mm, with thicknesses from 3 mm to 10 mm and standard lengths of 6 m and 12 m. Contractors and fabricators in Siyaganj, Loha Mandi, and New Siyaganj rely on consistent quality and availability for industrial sheds, grills, and structural frames. Our angles meet common grades such as IS 2062 and are suitable for welding and fabrication.`,
    usesInIndore: `In Indore and nearby areas, MS angles are used for building frames, support brackets, industrial shed purlins, and fabrication of gates and grills. Construction and fabrication units in Siyaganj and Loha Mandi use angles for RCC formwork support, machinery bases, and boundary structures. Agri and industrial projects in Dewas, Pithampur, and Ujjain also source angles for shed frames and equipment supports. We supply retail and wholesale to contractors and fabricators across these areas.`,
    buyingGuide: `Choose size and thickness based on load and design. Equal angles (e.g. 50x50 mm) are common for symmetric frames; unequal angles suit specific connections. Check for straightness and consistent thickness. For outdoor use, consider galvanizing or paint. Specify length (6 m or 12 m) and quantity; bulk orders from Loha Mandi or Siyaganj often get better rates.`,
    pricingFactors: `Price depends on size, thickness, quantity, and market rates. Heavier sections and larger sizes cost more per metre. Wholesale and repeat orders typically get better rates. We do not publish fixed prices; request a quote with size, thickness, and quantity for current rates in Indore.`,
    whyUs: `H.M. Ibrahim & Co has been supplying iron and hardware in Siyaganj, Indore since 1939. We stock MS angles in multiple sizes and thicknesses and serve contractors, fabricators, and industries in Indore, Siyaganj, Loha Mandi, and nearby areas. You can request a quote or visit our shop for availability and pricing.`,
    serviceArea: `We serve Indore, Siyaganj, Loha Mandi, New Siyaganj, and nearby areas including Dewas, Pithampur, Ujjain, and Mhow. Delivery can be arranged subject to order size and location.`,
    faqs: [
      { question: "What sizes of MS angles do you stock in Indore?", answer: "We stock MS angles from 20x20 mm to 100x100 mm, thickness 3 mm to 10 mm, in 6 m and 12 m lengths. Common sizes include 25x25, 40x40, 50x50, and 75x75 mm. Availability varies; contact us for current stock in Siyaganj." },
      { question: "Do you supply MS angles for wholesale in Siyaganj?", answer: "Yes. We supply both retail and wholesale to contractors and fabricators in Siyaganj, Loha Mandi, and Indore. Quote with quantity for better rates." },
      { question: "Are MS angles suitable for outdoor use?", answer: "Black MS angles can rust if exposed. For outdoor or humid use, consider galvanized angles or paint. We can guide on availability." },
      { question: "What grade are your MS angles?", answer: "We commonly supply angles as per IS 2062 / mild steel. Specify if you need a particular grade or test certificate." },
      { question: "Can I get cut-to-length angles?", answer: "We primarily supply standard lengths. Cut-to-length may be possible in some cases; ask when requesting a quote." },
    ],
    relatedBlogSlugs: ["common-mistakes-buying-steel-sections", "how-bulk-buyers-save-cost-loha-mandi-indore"],
  },
  "ms-flats": {
    overview: `MS flats are flat mild steel bars used for grills, base plates, brackets, and fabrication across Indore and the region. We stock widths from 12 mm to 150 mm and thicknesses from 3 mm to 12 mm in 6 m and 12 m lengths. Black and bright MS flats are used by fabricators and contractors in Siyaganj, Loha Mandi, and New Siyaganj for structural and decorative work. H.M. Ibrahim & Co has been a trusted source for flats and other structural items in Indore since 1939.`,
    usesInIndore: `In Indore, MS flats are widely used for window and gate grills, base plates for columns and machinery, and support brackets. Units in Siyaganj and Loha Mandi use flats for fabrication of frames, stair stringers, and industrial fixtures. Construction and fabrication demand in Dewas, Pithampur, and Ujjain also drives regular orders. We supply retail and wholesale to meet local and nearby demand.`,
    buyingGuide: `Select width and thickness as per design and load. Bright flats give a cleaner finish for visible applications. Check for flatness and consistent dimensions. Specify length and quantity; mention if you need a specific finish (black or bright).`,
    pricingFactors: `Rates depend on width, thickness, quantity, and current market. Heavier and wider sections cost more. Wholesale orders get better per-kg rates. Request a quote with dimensions and quantity for Indore/Siyaganj rates.`,
    whyUs: `We stock MS flats in multiple sizes and serve fabricators and contractors in Siyaganj, Indore, and nearby areas. Request a quote or visit our shop for availability and pricing.`,
    serviceArea: `We serve Indore, Siyaganj, Loha Mandi, New Siyaganj, Dewas, Pithampur, Ujjain, and Mhow. Delivery subject to order size and location.`,
    faqs: [
      { question: "What sizes of MS flats are available in Indore?", answer: "We stock widths from 12 mm to 150 mm and thickness 3 mm to 12 mm, in 6 m and 12 m lengths. Common sizes include 20x5, 25x5, 40x6, 50x6, 75x8, and 100x10 mm. Contact us for current stock in Siyaganj." },
      { question: "Do you have bright MS flats?", answer: "Yes. We have both black and bright MS flats. Specify your requirement when requesting a quote." },
      { question: "Are MS flats suitable for welding?", answer: "Yes. Mild steel flats are commonly used for welding and fabrication. Ensure correct grade if you have specific weld requirements." },
      { question: "Do you deliver flats to Dewas or Pithampur?", answer: "We serve Indore and nearby areas including Dewas and Pithampur. Delivery can be arranged depending on order size and location." },
    ],
    relatedBlogSlugs: ["common-mistakes-buying-steel-sections", "top-hardware-contractors-buy-siyaganj"],
  },
  "tmt-bars": {
    overview: `TMT (thermo-mechanically treated) bars are the standard reinforcement for RCC construction in Indore and across India. We supply TMT bars in diameters from 6 mm to 32 mm (commonly 8, 10, 12, 16, 20, 25 mm) in grades such as Fe 500 and Fe 550, typically in 12 m length. Contractors and builders in Siyaganj, Loha Mandi, and New Siyaganj depend on consistent supply for columns, beams, slabs, and foundations. H.M. Ibrahim & Co has been supplying TMT bars and other construction steel in Indore since 1939.`,
    usesInIndore: `In Indore, TMT bars are used for residential and commercial RCC work: columns, beams, slabs, and foundations. Construction activity in Siyaganj, Loha Mandi, and New Siyaganj keeps demand high. Projects in Dewas, Pithampur, and Ujjain also source TMT bars for industrial and civil structures. We supply retail and wholesale to builders, contractors, and RCC suppliers across these areas.`,
    buyingGuide: `Choose grade (Fe 500, Fe 550, Fe 500D) and diameter as per structural design. Fe 500 is common for most buildings; Fe 550 where higher strength is needed. Check for proper rib pattern and absence of surface defects. Specify diameter, grade, and quantity; bulk orders get better rates.`,
    pricingFactors: `Price depends on diameter, grade, quantity, and market. Larger diameters and higher grades cost more per kg. Rates fluctuate with raw material and demand. We do not fix prices on the site; request a quote for current rates in Indore.`,
    whyUs: `We stock TMT bars in multiple sizes and grades and serve builders and contractors in Siyaganj, Indore, and nearby areas. Request a quote or visit for availability and pricing.`,
    serviceArea: `We serve Indore, Siyaganj, Loha Mandi, New Siyaganj, Dewas, Pithampur, Ujjain, and Mhow. Delivery can be arranged for bulk orders.`,
    faqs: [
      { question: "What grades of TMT bars do you supply in Indore?", answer: "We supply Fe 500, Fe 550, and Fe 500D in various diameters. Specify grade and size when requesting a quote." },
      { question: "Which TMT bar sizes are most commonly used?", answer: "8 mm, 10 mm, 12 mm, 16 mm, and 20 mm are commonly used for columns, beams, and slabs. Contact us for stock in Siyaganj." },
      { question: "Do you deliver TMT bars to construction sites?", answer: "Delivery can be arranged depending on order size and location. Mention your site location when requesting a quote." },
      { question: "Can I get a small quantity for a home project?", answer: "Yes. We serve both retail and wholesale. Minimum order may vary by product; contact us for details." },
      { question: "Are your TMT bars from branded manufacturers?", answer: "We stock quality TMT bars; Tata and other brands may be available on request. Ask for current availability." },
    ],
    relatedBlogSlugs: ["how-to-choose-tmt-bars-indore", "how-bulk-buyers-save-cost-loha-mandi-indore"],
  },
  "gi-pipes": {
    overview: `Galvanized iron (GI) pipes are used for water lines, fencing, and structural applications in Indore and the region. We supply GI pipes in NB sizes from 15 mm (1/2") to 150 mm (6") in light, medium, and heavy classes, typically 6 m length. Plumbers, contractors, and industries in Siyaganj, Loha Mandi, and New Siyaganj source GI pipes for water supply, boundary fencing, and support structures. H.M. Ibrahim & Co has been a trusted supplier of pipes and hardware in Indore since 1939.`,
    usesInIndore: `In Indore, GI pipes are used for domestic and commercial water supply, overhead tanks, and distribution lines. In Siyaganj and Loha Mandi, contractors use GI pipes for fencing, gates, and structural supports. Agri and industrial projects in Dewas, Pithampur, and Ujjain also use GI pipes for water and fencing. We supply retail and wholesale across these areas.`,
    buyingGuide: `Choose NB size and class (light/medium/heavy) as per pressure and use. For water supply, class and joint type matter. For fencing, consider diameter and wall thickness. Specify size, class, and quantity for an accurate quote.`,
    pricingFactors: `Rates depend on NB size, class, quantity, and market. Heavier class and larger sizes cost more. Prices are per metre or per piece. Request a quote with size and quantity for current rates in Indore.`,
    whyUs: `We stock GI pipes in multiple sizes and classes and serve plumbers and contractors in Siyaganj, Indore, and nearby areas. Request a quote or visit for availability and pricing.`,
    serviceArea: `We serve Indore, Siyaganj, Loha Mandi, New Siyaganj, Dewas, Pithampur, Ujjain, and Mhow. Delivery subject to order size and location.`,
    faqs: [
      { question: "What GI pipe sizes do you stock in Indore?", answer: "We stock from 15 mm (1/2\") to 150 mm (6\") NB in light, medium, and heavy classes. Contact us for current availability in Siyaganj." },
      { question: "Are GI pipes suitable for drinking water?", answer: "Yes. GI pipes are commonly used for potable water supply. Ensure correct class and joints for your application." },
      { question: "Do you supply GI pipes for fencing?", answer: "Yes. GI pipes are used for boundary fencing and gate frames. Specify diameter and length required." },
      { question: "What is the standard length of GI pipes?", answer: "Standard length is 6 m. Other lengths may be available; ask when ordering." },
    ],
    relatedBlogSlugs: ["how-to-estimate-material-quantity-fencing", "top-hardware-contractors-buy-siyaganj"],
  },
  "chain-link-fencing": {
    overview: `Chain link fencing (jali) is widely used for compound boundaries, sports grounds, and industrial sites in Indore and the region. We supply galvanized and PVC-coated chain link in mesh sizes from 1" to 4", wire thickness 1.5 mm to 4 mm, and heights from 3 ft to 10 ft in rolls. Contractors and property owners in Siyaganj, Loha Mandi, and New Siyaganj source chain link for residential, commercial, and industrial fencing. H.M. Ibrahim & Co stocks CM, Border, and Tata Wiron chain link and has been supplying fencing material in Indore since 1939.`,
    usesInIndore: `In Indore, chain link is used for residential compound walls, school and sports grounds, factories, and warehouses. In Siyaganj and Loha Mandi, bulk buyers and contractors order chain link for boundary and security fencing. Projects in Dewas, Pithampur, and Ujjain also use chain link for industrial and farm boundaries. We supply retail and wholesale across these areas.`,
    buyingGuide: `Choose mesh size (1" to 4") and wire gauge based on security and cost. Smaller mesh and thicker wire are stronger but cost more. PVC-coated lasts longer in exposed conditions. Specify height, length, mesh size, and finish (GI or PVC) for a quote.`,
    pricingFactors: `Price depends on mesh size, wire gauge, height, finish (GI vs PVC), and quantity. Larger rolls and bulk orders get better per-sq-m rates. Request a quote with specifications for current rates in Indore.`,
    whyUs: `We stock multiple brands and sizes of chain link fencing and serve contractors and buyers in Siyaganj, Indore, and nearby areas. Request a quote or visit for availability and pricing.`,
    serviceArea: `We serve Indore, Siyaganj, Loha Mandi, New Siyaganj, Dewas, Pithampur, Ujjain, and Mhow. Delivery can be arranged for bulk orders.`,
    faqs: [
      { question: "What mesh sizes of chain link do you have in Indore?", answer: "We have 1\", 2\", 3\", and 4\" mesh in various heights (3 ft to 10 ft). GI and PVC coated. Contact us for stock in Siyaganj." },
      { question: "Which is better for boundary: chain link or barbed wire?", answer: "Chain link gives a full barrier and is common for compounds. Barbed wire is often used on top for extra security. We can supply both." },
      { question: "Do you have Tata Wiron chain link?", answer: "Yes. Tata Wiron chain link fencing is available along with CM and Border brands. Ask for current availability." },
      { question: "How do I estimate how much chain link I need?", answer: "Measure the perimeter and height. We can help with quantity and roll sizes; see our blog for estimation tips." },
    ],
    relatedBlogSlugs: ["wire-mesh-supplier-indore-types-uses-prices", "welded-wire-mesh-vs-chain-link"],
  },
  "barbed-wire": {
    overview: `Barbed wire is used for security and boundary fencing across Indore and the region. We supply single- and double-strand barbed wire in common gauges (e.g. 12x14), in coils up to 25 kg. CM, Border, and Tata Wiron barbed wire are stocked for contractors and farmers in Siyaganj, Loha Mandi, and New Siyaganj. H.M. Ibrahim & Co has been supplying fencing material in Indore since 1939.`,
    usesInIndore: `In Indore, barbed wire is used for boundary fencing, farm boundaries, and perimeter security. Contractors in Siyaganj and Loha Mandi order barbed wire for residential, industrial, and agricultural projects. Dewas, Pithampur, and Ujjain also see demand for farm and boundary fencing. We supply retail and wholesale.`,
    buyingGuide: `Choose single or double strand and gauge as per security needs. Double strand and thicker gauge last longer. Specify coil size and quantity for a quote.`,
    pricingFactors: `Rates depend on type, gauge, coil size, and quantity. Request a quote for current rates in Indore.`,
    whyUs: `We stock multiple brands of barbed wire and serve contractors and farmers in Siyaganj, Indore, and nearby areas. Request a quote or visit for availability.`,
    serviceArea: `We serve Indore, Siyaganj, Loha Mandi, New Siyaganj, Dewas, Pithampur, Ujjain, and Mhow.`,
    faqs: [
      { question: "What types of barbed wire do you stock in Indore?", answer: "We have single and double strand, 2-point and 4-point, in coils up to 25 kg. CM, Border, and Tata Wiron available. Contact us for Siyaganj stock." },
      { question: "Barbed wire vs concertina: which for high security?", answer: "Concertina (coiled) is used for high-security perimeters. Barbed wire is common for boundaries. We supply both." },
      { question: "Do you deliver barbed wire?", answer: "Delivery can be arranged depending on order size and location. Mention your location when requesting a quote." },
    ],
    relatedBlogSlugs: ["barbed-wire-vs-concertina-wire", "wire-mesh-supplier-indore-types-uses-prices"],
  },
};

/** Default content generator when no custom entry exists — still unique per product using name/category/useCases. */
function getDefaultContent(product: ProductWithCategory): ProductSeoContent {
  const { name, categoryName: cat, useCases = [], sizes } = product;
  const cities = "Indore, Siyaganj, Loha Mandi, and New Siyaganj";
  const nearby = "Dewas, Pithampur, Ujjain, and Mhow";
  const uses = useCases.slice(0, 4).join(", ");

  return {
    overview: `${name} is used across construction, fabrication, and industrial applications in Indore and the region. At H.M. Ibrahim & Co we stock ${name} in sizes and grades suitable for contractors and industries. Buyers in ${cities} rely on us for consistent quality and availability. We have been supplying iron and hardware in Siyaganj, Indore since 1939.`,
    usesInIndore: `In Indore, ${name} is used for ${uses || "various applications"}. Contractors and industries in Siyaganj and Loha Mandi source ${name} for projects ranging from residential to industrial. Demand from ${nearby} also keeps our supply chain active. We supply retail and wholesale to meet local and nearby demand.`,
    buyingGuide: `Choose size, thickness or gauge, and material as per your design. Check specifications and finish. Specify quantity and any special requirements when requesting a quote. We can guide on best options for your use.`,
    pricingFactors: `Price depends on size, material, quantity, and current market rates. Bulk orders typically get better rates. We do not publish fixed prices; request a quote with your specification for current rates in Indore.`,
    whyUs: `H.M. Ibrahim & Co has been a trusted supplier in Siyaganj, Indore since 1939. We stock ${name} and other ${cat} and serve contractors and industries in Indore and nearby areas. Request a quote or visit our shop for availability and pricing.`,
    serviceArea: `We serve ${cities} and nearby areas including ${nearby}. Delivery can be arranged subject to order size and location.`,
    faqs: [
      { question: `Do you stock ${name} in Indore?`, answer: `Yes. We stock ${name} and supply retail and wholesale from our Siyaganj location. Contact us for current availability and pricing.` },
      { question: `What sizes of ${name} are available?`, answer: sizes?.length ? `We have ${sizes.slice(0, 5).join(", ")} and more. Contact us for full range and stock in Siyaganj.` : `Contact us for sizes and availability in Indore.` },
      { question: "Do you deliver to nearby cities?", answer: `We serve Indore and nearby areas including ${nearby}. Delivery depends on order size and location.` },
      { question: "How can I get a price quote?", answer: "Use the Request a Quote form on the site or call/WhatsApp us with product, size, and quantity. We respond with current rates." },
      { question: "Are you open on weekends?", answer: "We are open Monday–Saturday 9 AM–8 PM. Sunday closed. Call before visiting on holidays." },
    ],
  };
}

/** Get SEO content for a product. Uses custom entry if present, else generated default. */
export function getProductSeoContent(
  slug: string,
  product: ProductWithCategory | null
): ProductSeoContent | null {
  if (!product) return null;
  const custom = contentMap[slug];
  if (custom) {
    return {
      ...custom,
      relatedProductSlugs: custom.relatedProductSlugs,
      relatedBlogSlugs: custom.relatedBlogSlugs,
    };
  }
  return getDefaultContent(product);
}

/** Get related blog slugs for a product (from custom content or empty). */
export function getRelatedBlogSlugsForProduct(slug: string): string[] {
  const custom = contentMap[slug];
  return custom?.relatedBlogSlugs ?? [];
}
