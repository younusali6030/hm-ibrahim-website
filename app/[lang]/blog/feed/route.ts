import { getAllPosts } from "@/content/blog/posts";
import { baseUrl, site } from "@/lib/site";
import { pageUrl } from "@/lib/seo";
import { siteHi } from "@/content/hi/site";
import type { Lang } from "@/lib/locale";

export async function GET(_req: Request, { params }: { params: { lang: string } }) {
  const lang = params.lang as Lang;
  const hi = lang === "hi";
  const posts = await getAllPosts(lang);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(hi ? siteHi.name : site.name)} — ${hi ? "ब्लॉग" : "Blog"}</title>
    <link>${pageUrl("blog", lang)}</link>
    <description>${escapeXml(hi ? siteHi.description : site.description)} ${hi ? "ब्लॉग: इंदौर, सियागंज में वायर मेश, टीएमटी सरिया, फेंसिंग और हार्डवेयर पर गाइड।" : "Blog: guides on wire mesh, TMT bars, fencing, and hardware in Indore, Siyaganj."}</description>
    <language>${hi ? "hi-in" : "en-in"}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${pageUrl("blog/feed", lang)}" rel="self" type="application/rss+xml"/>
    ${posts.map((p) => `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${pageUrl(`blog/${p.slug}`, lang)}</link>
      <description>${escapeXml(p.description || p.title)}</description>
      <pubDate>${p.date ? new Date(p.date).toUTCString() : new Date().toUTCString()}</pubDate>
      <guid isPermaLink="true">${pageUrl(`blog/${p.slug}`, lang)}</guid>
    </item>`).join("")}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
