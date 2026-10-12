/**
 * Static "last meaningfully changed" dates for the sitemap.
 * Update a date only when the page's visible content changes. Never use new Date():
 * a sitemap that claims every URL changed on every build teaches Google to ignore lastmod.
 * Blog posts use their own frontmatter (updated, else date).
 */
export const CONTENT_DATES = {
  home: "2026-10-12",
  about: "2026-10-12",
  products: "2026-10-12",
  services: "2026-10-11",
  contact: "2026-10-12",
  brands: "2026-10-12",
  brandPages: "2026-10-12",
  catalog: "2026-10-12",
  indore: "2026-10-12",
  blogIndex: "2026-10-12",
  categories: "2026-10-12",
  /** Product catalog data (content/products.ts) and SEO copy (content/productSeoContent.ts). */
  product: "2026-10-12",
  privacy: "2026-10-12",
  terms: "2026-10-12",
} as const;

/** Date the site "Last verified" lines were checked against existing site content. */
export const LAST_VERIFIED = "2026-10-12";
export const LAST_VERIFIED_LABEL = "12 October 2026";
