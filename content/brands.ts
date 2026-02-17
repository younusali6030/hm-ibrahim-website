/**
 * Signature brands (CM, Border) and Tata Wiron. Used for brand picker, logos, and product variants.
 */

export type BrandId = "cm" | "boarder" | "tata" | "national";

export type BrandPageContent = {
  title: string;
  subtitle: string;
  body: string;
  /** Prominent tagline (e.g. Border Hindi tagline) */
  prominentTagline?: string;
};

export type Brand = {
  id: BrandId;
  name: string;
  logo: string;
  tagline: string;
  productsSupported: string[];
  /** Content for dedicated brand info page (/brands/[id]) */
  pageContent?: BrandPageContent;
};

export const inHouseBrands: Brand[] = [
  {
    id: "cm",
    name: "CM",
    logo: "/brands/cm-logo.png",
    tagline: "Our signature brand",
    productsSupported: ["barbed-wire", "chain-link-fencing"],
    pageContent: {
      title: "CM (Chote Mullaji)",
      subtitle: "A Legacy Shaped by the Market",
      body: "CM stands for Chote Mullaji — a name that has grown with the market itself. Born from the needs of farmers, boundaries, and security, CM barbed wire and chain link fencing (jali) have become a trusted choice across regions. Our story is one of consistency: the same quality, the same commitment to strength and durability, that the market has relied on for years. We don’t just supply wire; we supply peace of mind for every boundary and every fence.",
    },
  },
  {
    id: "boarder",
    name: "Border",
    logo: "/brands/boarder-logo.png",
    tagline: "Our signature brand",
    productsSupported: ["barbed-wire", "chain-link-fencing"],
    pageContent: {
      title: "Border",
      subtitle: "Built for Strength. Designed for Security.",
      body: "Border is built for one thing: reliable protection. From farm boundaries to industrial perimeters, our barbed wire and chain link fencing (jali) are designed to last. We focus on strength, durability, and consistent quality so that every roll delivers what you expect — security you can trust. Border has become a name associated with toughness and dependability in fencing across the country.",
      prominentTagline: "Border ka vaada — desh ki suraksha zyada.",
    },
  },
  {
    id: "tata",
    name: "Tata Wiron",
    logo: "/brands/tata-wiron.png",
    tagline: "Authorized Tata Wiron partner",
    productsSupported: ["gi-wire", "barbed-wire", "chain-link-fencing"],
    pageContent: {
      title: "Tata Wiron",
      subtitle: "Tata quality for wire and fencing products",
      body:
        "As an authorized Tata Wiron partner, we supply GI wire, barbed wire, and chain link fencing with Tata's trusted quality and coating technology. Tata Wiron products offer consistent strength, corrosion resistance, and reliable performance for fencing and general purpose use.",
    },
  },
  {
    id: "national",
    name: "Others",
    logo: "/products/national-barbed-wire-1.png",
    tagline: "Quality local brand",
    productsSupported: ["barbed-wire"],
    pageContent: {
      title: "National Barbed Wire",
      subtitle: "High quality, reliable local brand for boundary and farm security",
      body:
        "National barbed wire is a trusted local brand we stock for boundary fencing, farm security, and perimeter protection. Known for strong and reliable security — 'मजबूत एवं भरोसेमंद सुरक्षा' — and promoted with the message that saving the crop leads to development. We offer National barbed wire in standard gauges and coil sizes as per stock.",
    },
  },
];

export function getBrandById(id: BrandId): Brand | undefined {
  return inHouseBrands.find((b) => b.id === id);
}

export function getBrandsForProduct(productSlug: string): Brand[] {
  return inHouseBrands.filter((b) => b.productsSupported.includes(productSlug));
}
