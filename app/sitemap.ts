import type { MetadataRoute } from "next";
import { allProducts, categories } from "@/content/products";
import { getAllPosts, getHindiPostSlugs } from "@/content/blog/posts";
import { localePath } from "@/lib/locale";
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
  { path: "brands/tata", date: CONTENT_DATES.brandPages },
  { path: "catalog", date: CONTENT_DATES.catalog },
  { path: "indore", date: CONTENT_DATES.indore },
  { path: "privacy", date: CONTENT_DATES.contact },
  { path: "terms", date: CONTENT_DATES.contact },
];

type Entry = MetadataRoute.Sitemap[number];

/** One entry per language, each declaring the other as its alternate (hreflang), plus x-default. */
function both(path: string, date: Date): Entry[] {
  const tail = path ? `/${path}` : "/";
  const en = `${baseUrl}${localePath("en", tail)}`.replace(/\/$/, "") || baseUrl;
  const hi = `${baseUrl}${localePath("hi", tail)}`;
  const languages = { "en-IN": en, "hi-IN": hi, "x-default": en };
  return [
    { url: en, lastModified: date, alternates: { languages } },
    { url: hi, lastModified: date, alternates: { languages } },
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();
  const hiSlugs = new Set(await getHindiPostSlugs());
  const latestPost = posts.reduce<string>((m, p) => ((p.updated || p.date) > m ? p.updated || p.date : m), CONTENT_DATES.blogIndex);

  const entries: MetadataRoute.Sitemap = [];

  for (const { path, date } of staticPages) entries.push(...both(path, new Date(date)));
  entries.push(...both("blog", new Date(latestPost)));

  for (const c of categories) entries.push(...both(`categories/${c.slug}`, new Date(CONTENT_DATES.categories)));
  for (const p of allProducts) entries.push(...both(`products/${p.slug}`, new Date(CONTENT_DATES.product)));
  for (const slug of indorePageSlugs) entries.push(...both(`indore/${slug}`, new Date(CONTENT_DATES.indore)));
  for (const post of posts) {
    const d = new Date(post.updated || post.date);
    if (hiSlugs.has(post.slug)) entries.push(...both(`blog/${post.slug}`, d));
    else entries.push({ url: `${baseUrl}/blog/${post.slug}`, lastModified: d });
  }

  return entries;
}
