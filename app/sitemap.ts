import type { MetadataRoute } from "next";
import { allProducts, categories } from "@/content/products";
import { inHouseBrands } from "@/content/brands";
import { getAllPostSlugs } from "@/content/blog/posts";
import { baseUrl } from "@/lib/site";

const staticPages = [
  "",
  "about",
  "products",
  "services",
  "quote",
  "contact",
  "catalog",
  "indore",
  "blog",
] as const;

const indoreSlugs = [
  "wire-mesh",
  "chain-link-fencing-jaali",
  "barbed-wire",
  "perforated-sheets",
  "gi-wire",
  "construction-hardware",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const path of staticPages) {
    entries.push({
      url: path ? `${baseUrl}/${path}` : baseUrl,
      lastModified: new Date(),
      changeFrequency: path === "" ? "weekly" : path === "products" || path === "quote" ? "weekly" : "monthly",
      priority: path === "" ? 1 : path === "products" || path === "contact" ? 0.9 : 0.8,
    });
  }

  for (const category of categories) {
    entries.push({
      url: `${baseUrl}/categories/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.85,
    });
  }

  for (const product of allProducts) {
    entries.push({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    });
  }

  for (const brand of inHouseBrands.filter((b) => b.pageContent)) {
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
      changeFrequency: "weekly" as const,
      priority: 0.85,
    });
  }

  const blogSlugs = await getAllPostSlugs();
  entries.push({
    url: `${baseUrl}/blog`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  });
  for (const slug of blogSlugs) {
    entries.push({
      url: `${baseUrl}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    });
  }

  return entries;
}
