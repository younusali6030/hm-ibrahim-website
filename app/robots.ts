import type { MetadataRoute } from "next";
import { baseUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // API routes and the post-submit thank-you page have nothing to index.
        disallow: ["/api/", "/contact/success", "/hi/contact/success"],
      },
    ],
    sitemap: [`${baseUrl}/sitemap.xml`, `${baseUrl}/sitemap-images.xml`, `${baseUrl}/sitemap-videos.xml`],
    host: baseUrl,
  };
}
