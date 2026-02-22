import { getAllPosts } from "@/content/blog/posts";
import { baseUrl, site } from "@/lib/site";

export async function GET() {
  const posts = await getAllPosts();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(site.name)} — Blog</title>
    <link>${baseUrl}/blog</link>
    <description>${escapeXml(site.description)} Blog: guides on wire mesh, TMT bars, fencing, and hardware in Indore, Siyaganj.</description>
    <language>en-in</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/blog/feed" rel="self" type="application/rss+xml"/>
    ${posts.map((p) => `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${baseUrl}/blog/${p.slug}</link>
      <description>${escapeXml(p.description || p.title)}</description>
      <pubDate>${p.date ? new Date(p.date).toUTCString() : new Date().toUTCString()}</pubDate>
      <guid isPermaLink="true">${baseUrl}/blog/${p.slug}</guid>
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
