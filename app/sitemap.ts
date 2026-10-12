import type { MetadataRoute } from "next";
import { allProducts, categories } from "@/content/products";
import { getAllPosts } from "@/content/blog/posts";
import { indorePageSlugs } from "@/content/indorePages";
import { baseUrl } from "@/lib/site";
import { CONTENT_DATES } from "@/lib/contentDates";

/**
 * Every lastModified below is a real content date: blog frontmatter (updated, else date) or the
 * static dates in lib/contentDates.ts. Nothing uses new Date(). Google ignores changefreq and
 * priority, so they are not emitted.
 *
 * Companion sitemaps (listed in robots.txt): /sitemap-images.xml and /sitemap-videos.xml.
 */
const staticPages: { path: string; date: string }[] = [
  { path: "", date: CONTENT_DATES.home },
  { path: "about", date: CONTENT_DATES.about },
  { path: "products", date: CONTENT_DATES.products },
  { path: "services", date: CONTENT_DATES.services },
  { path: "contact", date: CONTENT_DATES.contact },
  { path: "brands", date: CONTENT_DATES.brands },
  { path: "brands/cm", date: CONTENT_DATES.brandPages },
  { path: "brands/border", date: CONTENT_DATES.brandPages },
  { path: "catalog", date: CONTENT_DATES.catalog },
  { path: "indore", date: CONTENT_DATES.indore },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();
  const latestPost = posts.reduce<string>((m, p) => ((p.updated || p.date) > m ? p.updated || p.date : m), CONTENT_DATES.blogIndex);

  const entries: MetadataRoute.Sitemap = [];

  for (const { path, date } of staticPages) {
    entries.push({ url: path ? `${baseUrl}/${path}` : baseUrl, lastModified: new Date(date) });
  }
  entries.push({ url: `${baseUrl}/blog`, lastModified: new Date(latestPost) });

  for (const c of categories) {
    entries.push({ url: `${baseUrl}/categories/${c.slug}`, lastModified: new Date(CONTENT_DATES.categories) });
  }
  for (const p of allProducts) {
    entries.push({ url: `${baseUrl}/products/${p.slug}`, lastModified: new Date(CONTENT_DATES.product) });
  }
  for (const slug of indorePageSlugs) {
    entries.push({ url: `${baseUrl}/indore/${slug}`, lastModified: new Date(CONTENT_DATES.indore) });
  }
  for (const post of posts) {
    entries.push({ url: `${baseUrl}/blog/${post.slug}`, lastModified: new Date(post.updated || post.date) });
  }

  return entries;
}
