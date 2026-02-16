/**
 * In-house brands (CM, Boarder). Used for brand picker, logos, and product variants.
 */

export type BrandId = "cm" | "boarder";

export type BrandPageContent = {
  title: string;
  subtitle: string;
  body: string;
  /** Prominent tagline (e.g. Boarder Hindi tagline) */
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
    tagline: "In-house brand",
    productsSupported: ["barbed-wire", "chain-link-fencing"],
    pageContent: {
      title: "CM (Chote Mullaji)",
      subtitle: "A Legacy Shaped by the Market",
      body: "CM stands for Chote Mullaji — a name that has grown with the market itself. Born from the needs of farmers, boundaries, and security, CM barbed wire and chain link fencing (jali) have become a trusted choice across regions. Our story is one of consistency: the same quality, the same commitment to strength and durability, that the market has relied on for years. We don’t just supply wire; we supply peace of mind for every boundary and every fence.",
    },
  },
  {
    id: "boarder",
    name: "Boarder",
    logo: "/brands/boarder-logo.png",
    tagline: "In-house brand",
    productsSupported: ["barbed-wire", "chain-link-fencing"],
    pageContent: {
      title: "Boarder",
      subtitle: "Built for Strength. Designed for Security.",
      body: "Boarder is built for one thing: reliable protection. From farm boundaries to industrial perimeters, our barbed wire and chain link fencing (jali) are designed to last. We focus on strength, durability, and consistent quality so that every roll delivers what you expect — security you can trust. Boarder has become a name associated with toughness and dependability in fencing across the country.",
      prominentTagline: "Boarder ka vaada — desh ki suraksha zyada.",
    },
  },
];

export function getBrandById(id: BrandId): Brand | undefined {
  return inHouseBrands.find((b) => b.id === id);
}

export function getBrandsForProduct(productSlug: string): Brand[] {
  return inHouseBrands.filter((b) => b.productsSupported.includes(productSlug));
}
