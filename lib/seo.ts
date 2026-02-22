/**
 * Central SEO helper for Next.js App Router.
 * Use with generateMetadata(): return buildPageMeta(...) or buildProductMeta(...).
 */

import type { Metadata } from "next";
import { baseUrl, site } from "@/lib/site";

export type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: { url: string; alt?: string };
  noIndex?: boolean;
};

/** Build full metadata for a generic page (canonical, OG, Twitter, robots). */
export function buildPageMeta(input: PageMetaInput): Metadata {
  const { title, description, path, keywords = [], image, noIndex = false } = input;
  const url = path ? `${baseUrl}/${path}` : baseUrl;
  const img = image?.url?.startsWith("http") ? image.url : `${baseUrl}${image?.url || "/logo-dark.png"}`;

  return {
    title: title.length > 60 ? title.slice(0, 57) + "..." : title,
    description: description.length > 160 ? description.slice(0, 157) + "..." : description,
    keywords: keywords.length ? keywords.join(", ") : undefined,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: description.slice(0, 200),
      url,
      siteName: site.name,
      locale: "en_IN",
      type: "website",
      images: [{ url: img, alt: image?.alt || site.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: description.slice(0, 200),
      images: [img],
    },
    robots: noIndex
      ? { index: false, follow: true }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };
}

export type ProductMetaInput = {
  productName: string;
  shortDesc: string;
  slug: string;
  categoryName?: string;
  imageUrl?: string;
  materials?: string[];
  sizes?: string[];
};

/**
 * Product meta: title format "{Product} Supplier in Indore | Siyaganj | HM Ibrahim" (≤60 chars),
 * description 150–160 chars with product + Indore + quote/wholesale + trust/1939.
 */
export function buildProductMeta(input: ProductMetaInput): Metadata {
  const { productName, shortDesc, slug, categoryName, imageUrl, materials = [], sizes = [] } = input;
  const title = `${productName} Supplier in Indore | Siyaganj | HM Ibrahim`;
  const titleFinal = title.length > 60 ? title.slice(0, 57) + "..." : title;
  const descParts = [
    `${productName} — ${shortDesc}`,
    "Wholesale & retail in Indore, Siyaganj, Loha Mandi.",
    "Quote or visit. Trusted since 1939.",
  ];
  const description = descParts.join(" ").slice(0, 160);

  const url = `${baseUrl}/products/${slug}`;
  const img = imageUrl?.startsWith("http") ? imageUrl : `${baseUrl}${imageUrl || ""}`;

  const keywords = [
    `${productName} Indore`,
    `${productName} Siyaganj`,
    `${productName} Loha Mandi`,
    ...(categoryName ? [`${categoryName} Indore`] : []),
    ...materials.slice(0, 2).map((m) => `${m} Indore`),
    "HM Ibrahim",
  ];

  return {
    title: titleFinal,
    description,
    keywords: keywords.join(", "),
    alternates: { canonical: url },
    openGraph: {
      title: titleFinal,
      description,
      url,
      siteName: site.name,
      images: imageUrl ? [{ url: img, alt: productName }] : [],
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: titleFinal,
      description,
      images: imageUrl ? [img] : [],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}
