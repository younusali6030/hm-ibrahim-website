import { allProducts, categories } from "@/content/products";
import { getAllPosts, getHindiPostSlugs } from "@/content/blog/posts";
import { localePath } from "@/lib/locale";
import { indorePageSlugs } from "@/content/indorePages";
import { baseUrl } from "@/lib/site";
import { CONTENT_DATES } from "@/lib/contentDates";
import lastmodLedger from "@/content/lastmod.json";

/**
 * Every lastModified below is a real content date: blog frontmatter (updated, else date), the per-page
 * ledger in content/lastmod.json (products, categories, Indore pages), or the static dates in lib/contentDates.ts. Nothing uses new Date(). Google ignores changefreq and
 * priority, so they are not emitted.
 *
 * Companion sitemaps (listed in robots.txt): /sitemap-images.xml and /sitemap-videos.xml.
 *
 * Written as a route handler, not Next's sitemap.ts: Next 14 emits <xhtml:link> before <lastmod>, which breaks the
 * element order in the sitemap schema (loc, lastmod, then other namespaces). Search Console read the two companion
 * sitemaps but reported this one as "could not be read", so it now uses the same output path and headers as they do.
 */
export const dynamic = "force-static";
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

/**
 * Date a product, category or Indore page last changed, from content/lastmod.json (written by
 * scripts/update-lastmod.mjs from a hash of the page's content). Falls back to the static date for the group.
 */
const ledger = lastmodLedger as Record<string, { hash: string; date: string }>;
const pageDate = (key: string, fallback: string) => new Date(ledger[key]?.date ?? fallback);

type Entry = { url: string; lastModified: Date; alternates?: { languages: Record<string, string> } };

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

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function GET() {
  const posts = await getAllPosts();
  const hiSlugs = new Set(await getHindiPostSlugs());
  const latestPost = posts.reduce<string>((m, p) => ((p.updated || p.date) > m ? p.updated || p.date : m), CONTENT_DATES.blogIndex);

  const entries: Entry[] = [];

  for (const { path, date } of staticPages) entries.push(...both(path, new Date(date)));
  entries.push(...both("blog", new Date(latestPost)));

  for (const c of categories) entries.push(...both(`categories/${c.slug}`, pageDate(`categories/${c.slug}`, CONTENT_DATES.categories)));
  for (const p of allProducts) entries.push(...both(`products/${p.slug}`, pageDate(`products/${p.slug}`, CONTENT_DATES.product)));
  for (const slug of indorePageSlugs) entries.push(...both(`indore/${slug}`, pageDate(`indore/${slug}`, CONTENT_DATES.indore)));
  for (const post of posts) {
    const d = new Date(post.updated || post.date);
    if (hiSlugs.has(post.slug)) entries.push(...both(`blog/${post.slug}`, d));
    else entries.push({ url: `${baseUrl}/blog/${post.slug}`, lastModified: d });
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries
  .map(
    (e) =>
      `<url><loc>${esc(e.url)}</loc><lastmod>${e.lastModified.toISOString().slice(0, 10)}</lastmod>${Object.entries(e.alternates?.languages ?? {})
        .map(([lang, href]) => `<xhtml:link rel="alternate" hreflang="${lang}" href="${esc(href)}"/>`)
        .join("")}</url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600, s-maxage=86400" },
  });
}
