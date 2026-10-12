import { allProducts } from "@/content/products";
import { getAllPosts } from "@/content/blog/posts";
import { homeReels, brandVideos, type SiteVideo } from "@/content/reels";
import { baseUrl } from "@/lib/site";

export const dynamic = "force-static";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const human = (file: string) => {
  const t = file.replace(/-/g, " ").trim();
  return t.charAt(0).toUpperCase() + t.slice(1);
};
const base = (src: string) => src.replace(/^.*\//, "").replace(/\.mp4$/, "");
const noExt = (src: string) => src.replace(/\.mp4$/, "");

/** Video sitemap: home-page reels, brand-page walkthrough, product-page clips and blog-post loops. */
export async function GET() {
  const vids: SiteVideo[] = [...homeReels, ...brandVideos];

  for (const p of allProducts) {
    for (const v of p.videos ?? []) {
      vids.push({
        src: noExt(v),
        title: `${p.name}: ${human(base(v))}`,
        description: `${p.name} at the H M Ibrahim & Co counter, Siyaganj, Indore. ${p.shortDesc}`,
        page: `/products/${p.slug}`,
        uploadDate: "2026-10-11",
      });
    }
  }
  for (const post of await getAllPosts()) {
    if (!post.video) continue;
    vids.push({
      src: noExt(post.video),
      title: post.videoCaption || post.title,
      description: post.videoCaption || post.description,
      page: `/blog/${post.slug}`,
      uploadDate: "2026-10-11",
    });
  }

  const byPage = new Map<string, SiteVideo[]>();
  const seen = new Set<string>();
  for (const v of vids) {
    const key = `${v.page}|${v.src}`;
    if (seen.has(key)) continue;
    seen.add(key);
    byPage.set(v.page, [...(byPage.get(v.page) ?? []), v]);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${Array.from(byPage.entries())
  .map(
    ([page, list]) =>
      `<url><loc>${esc(page === "/" ? baseUrl : `${baseUrl}${page}`)}</loc>${list
        .map(
          (v) =>
            `<video:video><video:thumbnail_loc>${esc(`${baseUrl}${v.src}.jpg`)}</video:thumbnail_loc><video:title>${esc(
              v.title.slice(0, 100)
            )}</video:title><video:description>${esc(v.description.slice(0, 2000))}</video:description><video:content_loc>${esc(
              `${baseUrl}${v.src}.mp4`
            )}</video:content_loc><video:publication_date>${v.uploadDate}</video:publication_date><video:family_friendly>yes</video:family_friendly></video:video>`
        )
        .join("")}</url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600, s-maxage=86400" },
  });
}
