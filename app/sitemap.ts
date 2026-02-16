import type { MetadataRoute } from "next";
import { allProducts } from "@/content/products";
import { inHouseBrands } from "@/content/brands";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hmibrahimco.com";

const staticPages = [
  "",
  "about",
  "products",
  "services",
  "quote",
  "contact",
] as const;

const indoreSlugs = [
  "wire-mesh",
  "chain-link-fencing-jaali",
  "barbed-wire",
  "perforated-sheets",
  "gi-wire",
  "construction-hardware",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const path of staticPages) {
    entries.push({
      url: path ? `${baseUrl}/${path}` : baseUrl,
      lastModified: new Date(),
      changeFrequency: path === "" ? "weekly" : path === "products" || path === "quote" ? "weekly" : "monthly",
      priority: path === "" ? 1 : path === "products" || path === "contact" ? 0.9 : 0.8,
    });
  }

  for (const product of allProducts) {
    entries.push({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    });
  }

  for (const brand of inHouseBrands) {
    entries.push({
      url: `${baseUrl}/brands/${brand.id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    });
  }

  for (const slug of indoreSlugs) {
    entries.push({
      url: `${baseUrl}/indore/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    });
  }

  return entries;
}
