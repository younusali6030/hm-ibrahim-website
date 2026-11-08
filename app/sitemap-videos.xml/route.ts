import { reels } from "@/content/reels";
import { baseUrl } from "@/lib/site";

export const dynamic = "force-static";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * Video sitemap: one entry per reel, on its watch page (/videos/<id> and /hi/videos/<id>).
 * Google indexes a video only on a page where it is the main content, so the reels embedded on the home,
 * brand and Indore pages and the short product / blog loops are deliberately not listed here
 * (Search Console reported every one of them as "Video isn't on a watch page").
 */
export async function GET() {
  const rows: string[] = [];
  for (const r of reels) {
    for (const lang of ["en", "hi"] as const) {
      const text = lang === "hi" ? r.hi : r.en;
      const loc = `${baseUrl}${lang === "hi" ? "/hi" : ""}/videos/${r.id}`;
      rows.push(
        `<url><loc>${esc(loc)}</loc><video:video><video:thumbnail_loc>${esc(`${baseUrl}/reels/${r.id}.jpg`)}</video:thumbnail_loc><video:title>${esc(
          text.title.slice(0, 100)
        )}</video:title><video:description>${esc(text.summary.slice(0, 2000))}</video:description><video:content_loc>${esc(
          `${baseUrl}/reels/${r.id}.mp4`
        )}</video:content_loc><video:duration>${Math.round(r.duration)}</video:duration><video:publication_date>${r.uploadDate}</video:publication_date><video:family_friendly>yes</video:family_friendly></video:video></url>`
      );
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${rows.join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600, s-maxage=86400" },
  });
}
