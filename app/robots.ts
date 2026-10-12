import type { MetadataRoute } from "next";
import { baseUrl } from "@/lib/site";
import { robotsRules } from "@/lib/crawlerPolicy";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: robotsRules(),
    sitemap: [`${baseUrl}/sitemap.xml`, `${baseUrl}/sitemap-images.xml`, `${baseUrl}/sitemap-videos.xml`],
    host: baseUrl,
  };
}
