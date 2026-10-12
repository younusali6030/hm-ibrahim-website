/**
 * Signature brands (CM, Border) and Tata Wiron. Used for brand picker, logos, and product variants.
 */

export type BrandId = "cm" | "border" | "tata";

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
      subtitle: "Shaped by the Market",
      body: "CM stands for Chote Mullaji, a name that has grown with the market itself. Made for the needs of farmers, boundaries and security, CM barbed wire and chain link fencing (jali) have become a familiar choice across the region. The story is one of consistency: the same quality and the same strength that buyers have relied on for years. We supply wire for every boundary and every fence.",
    },
  },
  {
    id: "border",
    name: "Border",
    logo: "/brands/boarder-logo.png",
    tagline: "Our signature brand",
    productsSupported: ["barbed-wire", "chain-link-fencing"],
    pageContent: {
      title: "Border",
      subtitle: "Built for Strength. Designed for Security.",
      body: "Border is made for one purpose: dependable protection. From farm boundaries to industrial perimeters, our barbed wire and chain link fencing (jali) are built to last. We focus on strength, durability and consistent quality, so that every roll does what you expect of it. Border is known for tough, dependable fencing.",
      prominentTagline: "Border ka vaada — desh ki suraksha zyada.",
    },
  },
  {
    id: "tata",
    name: "Tata Wiron",
    logo: "/brands/tata-wiron.png",
    tagline: "Authorised Tata Wiron partner",
    productsSupported: ["gi-wire", "barbed-wire", "chain-link-fencing"],
    pageContent: {
      title: "Tata Wiron",
      subtitle: "Tata quality for wire and fencing products",
      body:
        "As an authorised Tata Wiron partner, we supply GI wire, barbed wire and chain link fencing. Tata Wiron products are made for consistent strength and corrosion resistance in fencing and general-purpose use.",
    },
  },
];

export function getBrandById(id: BrandId): Brand | undefined {
  return inHouseBrands.find((b) => b.id === id);
}

export function getBrandsForProduct(productSlug: string): Brand[] {
  return inHouseBrands.filter((b) => b.productsSupported.includes(productSlug));
}
