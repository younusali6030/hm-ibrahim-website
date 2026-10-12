import { allProducts, getCategoryBySlug, getProductImages } from "@/content/products";
import { getAllPosts } from "@/content/blog/posts";
import { baseUrl } from "@/lib/site";
import { getHindiPostSlugs } from "@/content/blog/posts";
import { indorePhotos } from "@/content/indoreStory";

export const dynamic = "force-static";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const abs = (s: string) => (s.startsWith("http") ? s : `${baseUrl}${s}`);

/** Image sitemap: product photos on product pages and hero/body photos on blog posts. Only local, real files. */
export async function GET() {
  const rows: { page: string; images: string[] }[] = [];

  for (const p of allProducts) {
    const imgs = getProductImages(p, getCategoryBySlug(p.categorySlug)).filter((i) => !i.endsWith(".svg"));
    if (imgs.length) {
      rows.push({ page: `${baseUrl}/products/${p.slug}`, images: imgs });
      rows.push({ page: `${baseUrl}/hi/products/${p.slug}`, images: imgs });
    }
  }
  rows.push({ page: `${baseUrl}/indore`, images: Object.values(indorePhotos).map((p) => p.src) });
  rows.push({ page: `${baseUrl}/hi/indore`, images: Object.values(indorePhotos).map((p) => p.src) });
  const hiSlugs = new Set(await getHindiPostSlugs());
  for (const post of await getAllPosts()) {
    const imgs = [post.image, post.image2, post.image3].filter(Boolean) as string[];
    if (!imgs.length) continue;
    rows.push({ page: `${baseUrl}/blog/${post.slug}`, images: imgs });
    if (hiSlugs.has(post.slug)) rows.push({ page: `${baseUrl}/hi/blog/${post.slug}`, images: imgs });
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${rows
  .map(
    (r) =>
      `<url><loc>${esc(r.page)}</loc>${Array.from(new Set(r.images))
        .slice(0, 1000)
        .map((i) => `<image:image><image:loc>${esc(abs(i))}</image:loc></image:image>`)
        .join("")}</url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600, s-maxage=86400" },
  });
}
