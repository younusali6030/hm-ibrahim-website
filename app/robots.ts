import type { MetadataRoute } from "next";
import { baseUrl } from "@/lib/site";
import { ALLOW_TRAINING_CRAWLERS, DISALLOWED_PATHS, TRAINING_CRAWLERS } from "@/lib/crawlerPolicy";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOWED_PATHS },
      // Only present when the owner opts out of model training (see lib/crawlerPolicy.ts).
      ...(ALLOW_TRAINING_CRAWLERS ? [] : [{ userAgent: [...TRAINING_CRAWLERS], disallow: "/" }]),
    ],
    sitemap: [`${baseUrl}/sitemap.xml`, `${baseUrl}/sitemap-images.xml`, `${baseUrl}/sitemap-videos.xml`],
    host: baseUrl,
  };
}
