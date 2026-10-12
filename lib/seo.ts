/**
 * Central SEO helper for Next.js App Router.
 * Use with generateMetadata(): return buildPageMeta(...) or buildProductMeta(...).
 *
 * Open Graph images: one template per page type at /public/og/<type>.png (1200x630).
 * ogImage() uses the file when it exists and falls back to the logo until it does, so a
 * missing PNG can never produce a 404 og:image. See docs/seo/og-image-plan.md.
 */

import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import { baseUrl, site } from "@/lib/site";

export type OgType = "default" | "home" | "product" | "category" | "indore" | "blog" | "brand" | "about" | "contact";

export const OG_TYPES: OgType[] = ["default", "home", "product", "category", "indore", "blog", "brand", "about", "contact"];

const FALLBACK_OG = "/logo-dark.png";

function ogFileExists(type: OgType): boolean {
  try {
    return fs.existsSync(path.join(process.cwd(), "public", "og", `${type}.png`));
  } catch {
    return false;
  }
}

/** Absolute URL of the template image for a page type, or the logo while the PNG has not been generated. */
export function ogImage(type: OgType): { url: string; width?: number; height?: number } {
  if (ogFileExists(type)) return { url: `${baseUrl}/og/${type}.png`, width: 1200, height: 630 };
  if (type !== "default" && ogFileExists("default")) return { url: `${baseUrl}/og/default.png`, width: 1200, height: 630 };
  return { url: `${baseUrl}${FALLBACK_OG}` };
}

export function ogTypeFromPath(p: string): OgType {
  const clean = p.replace(/^\/+/, "");
  if (clean === "") return "home";
  if (clean.startsWith("products")) return "product";
  if (clean.startsWith("categories")) return "category";
  if (clean.startsWith("indore")) return "indore";
  if (clean.startsWith("blog")) return "blog";
  if (clean.startsWith("brands")) return "brand";
  if (clean.startsWith("about")) return "about";
  if (clean.startsWith("contact")) return "contact";
  return "default";
}

const TITLE_SUFFIX = ` | ${site.name}`;

/** Cut at a word boundary, never mid-word, with no trailing punctuation clutter. */
export function trimAtWord(text: string, max: number): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max + 1);
  const sentence = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("; "));
  if (sentence > max * 0.6) return cut.slice(0, sentence + 1).trim();
  const space = cut.lastIndexOf(" ");
  return cut.slice(0, space > 0 ? space : max).replace(/[,;:\-–(]+$/, "").trim();
}

/**
 * Title that stays under ~60 characters in the search result.
 * Short titles use the root template (which appends the site name); long ones go absolute.
 */
export function fitTitle(raw: string): Metadata["title"] {
  const bare = raw.replace(/\s*\|\s*(H\.?M\.? ?Ibrahim|HM Ibrahim)[^|]*$/i, "").trim() || raw;
  if (bare.length + TITLE_SUFFIX.length <= 62) return bare;
  return { absolute: trimAtWord(bare, 60) };
}

function titleText(t: Metadata["title"]): string {
  if (typeof t === "string") return `${t}${TITLE_SUFFIX}`;
  if (t && typeof t === "object" && "absolute" in t) return String(t.absolute);
  return site.name;
}

const ROBOTS_INDEX: NonNullable<Metadata["robots"]> = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-video-preview": -1,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
};

export type PageMetaInput = {
  title: string;
  description: string;
  /** Path without a leading slash, e.g. "blog/my-post". Empty string is the home page. */
  path: string;
  keywords?: string[];
  /** A real photo for this page. When absent the page-type template (/og/<type>.png) is used. */
  image?: { url: string; alt?: string };
  /** Force a template type; otherwise inferred from the path. */
  ogType?: OgType;
  noIndex?: boolean;
};

/** Build full metadata for a generic page (canonical, OG, Twitter, robots). */
export function buildPageMeta(input: PageMetaInput): Metadata {
  const { title, description, path: p, keywords = [], image, ogType, noIndex = false } = input;
  const url = p ? `${baseUrl}/${p.replace(/^\/+/, "")}` : baseUrl;
  const tpl = ogImage(ogType ?? ogTypeFromPath(p));
  const img = image?.url
    ? { url: image.url.startsWith("http") ? image.url : `${baseUrl}${image.url}` }
    : tpl;
  const alt = image?.alt || `${site.name}, Siyaganj, Indore`;
  const metaTitle = fitTitle(title);
  const full = titleText(metaTitle);
  const desc = trimAtWord(description, 158);

  return {
    title: metaTitle,
    description: desc,
    keywords: keywords.length ? keywords.join(", ") : undefined,
    alternates: { canonical: url },
    openGraph: {
      title: full,
      description: trimAtWord(description, 200),
      url,
      siteName: site.name,
      locale: "en_IN",
      type: "website",
      images: [{ ...img, alt }],
    },
    twitter: {
      card: "summary_large_image",
      title: full,
      description: trimAtWord(description, 200),
      images: [img.url],
    },
    robots: noIndex ? { index: false, follow: true } : ROBOTS_INDEX,
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
 * Product meta. Title leads with the product name and the buyer's question (sizes, uses, rate),
 * so product pages do not compete with the /indore/* landing pages that own "<term> Indore".
 */
export function buildProductMeta(input: ProductMetaInput): Metadata {
  const { productName, shortDesc, slug, imageUrl } = input;
  const candidates = [
    `${productName} in Indore: Sizes, Uses, Rate | ${site.name}`,
    `${productName} in Indore: Sizes and Rate | HM Ibrahim`,
    `${productName} in Indore | ${site.name}`,
  ];
  const title = candidates.find((c) => c.length <= 60) ?? trimAtWord(candidates[2], 60);

  const lead = shortDesc.replace(/\s+/g, " ").trim().replace(/\.?$/, ".");
  const description = trimAtWord(
    `${lead} Sizes, uses and how to choose, from ${site.name} on Siyaganj Main Road, Indore. Ask for the rate.`,
    158
  );

  const url = `${baseUrl}/products/${slug}`;
  const photo = imageUrl && imageUrl !== baseUrl ? (imageUrl.startsWith("http") ? imageUrl : `${baseUrl}${imageUrl}`) : "";
  const img = photo ? { url: photo } : ogImage("product");

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      images: [{ ...img, alt: productName }],
      locale: "en_IN",
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description, images: [img.url] },
    robots: ROBOTS_INDEX,
  };
}
