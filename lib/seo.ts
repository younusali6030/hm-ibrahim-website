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
import { getSeoOverride } from "@/content/seoOverrides";
import { getHiSeo } from "@/content/hi/seo";
import { siteHi } from "@/content/hi/site";
import { localePath, ogLocale, type Lang } from "@/lib/locale";

export type OgType = "default" | "home" | "product" | "category" | "indore" | "blog" | "brand" | "about" | "contact";

export const OG_TYPES: OgType[] = ["default", "home", "product", "category", "indore", "blog", "brand", "about", "contact"];

const FALLBACK_OG = "/logo-dark.png";

function ogFileExists(type: OgType, lang: Lang = "en"): boolean {
  try {
    const sub = lang === "hi" ? path.join("og", "hi") : "og";
    return fs.existsSync(path.join(process.cwd(), "public", sub, `${type}.png`));
  } catch {
    return false;
  }
}

/**
 * Absolute URL of the template image for a page type, or the logo while the PNG has not been generated.
 * Hindi pages use /og/hi/<type>.png when it exists and share the English card until then.
 */
export function ogImage(type: OgType, lang: Lang = "en"): { url: string; width?: number; height?: number } {
  if (lang === "hi" && ogFileExists(type, "hi")) return { url: `${baseUrl}/og/hi/${type}.png`, width: 1200, height: 630 };
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
/** Devanagari is wider per character, so the Hindi suffix is the short brand form. */
const TITLE_SUFFIX_HI = ` | एचएम इब्राहिम`;

/** Cut at a word boundary, never mid-word, with no trailing punctuation clutter. */
export function trimAtWord(text: string, max: number): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max + 1);
  const sentence = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("; "));
  if (sentence > max * 0.6) return cut.slice(0, sentence + 1).trim();
  const space = cut.lastIndexOf(" ");
  let out = cut.slice(0, space > 0 ? space : max).replace(/[,;:\-–(]+$/, "").trim();
  // Do not end on a dangling connector ("... for GI, Binding and").
  out = out.replace(/(\s+(and|or|for|of|in|to|the|a|with|vs|&))+$/i, "").replace(/[,;:\-–(]+$/, "").trim();
  return out;
}

/**
 * Title that stays under ~60 characters in the search result.
 * Short titles use the root template (which appends the site name); long ones go absolute.
 */
export function fitTitle(raw: string, lang: Lang = "en"): Metadata["title"] {
  const bare = raw.replace(/\s*\|\s*(H\.?M\.? ?Ibrahim|HM Ibrahim|एचएम इब्राहिम)[^|]*$/i, "").trim() || raw;
  const suffix = lang === "hi" ? TITLE_SUFFIX_HI : TITLE_SUFFIX;
  if (bare.length + suffix.length <= 62) return bare;
  return { absolute: trimAtWord(bare, 60) };
}

function titleText(t: Metadata["title"], lang: Lang = "en"): string {
  if (typeof t === "string") return `${t}${lang === "hi" ? TITLE_SUFFIX_HI : TITLE_SUFFIX}`;
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

/** Canonical plus hreflang for a language-free path ("blog/my-post", "" for home). */
export function langAlternates(p: string, lang: Lang): NonNullable<Metadata["alternates"]> {
  const clean = p.replace(/^\/+|\/+$/g, "");
  const tail = clean ? `/${clean}` : "/";
  const en = `${baseUrl}${localePath("en", tail)}`.replace(/\/$/, "") || baseUrl;
  const hi = `${baseUrl}${localePath("hi", tail)}`;
  return {
    canonical: lang === "hi" ? hi : en,
    languages: { "en-IN": en, "hi-IN": hi, "x-default": en },
  };
}

/** Absolute URL of a page in a language. */
export function pageUrl(p: string, lang: Lang): string {
  const clean = p.replace(/^\/+|\/+$/g, "");
  const u = `${baseUrl}${localePath(lang, clean ? `/${clean}` : "/")}`;
  return u.replace(/\/$/, "") || baseUrl;
}

export type PageMetaInput = {
  title: string;
  description: string;
  /** Path without a leading slash and without a language prefix, e.g. "blog/my-post". Empty string is the home page. */
  path: string;
  keywords?: string[];
  /** A real photo for this page. When absent the page-type template (/og/<type>.png) is used. */
  image?: { url: string; alt?: string };
  /** Force a template type; otherwise inferred from the path. */
  ogType?: OgType;
  noIndex?: boolean;
  /** Language of the page being built. Hindi text comes from `hi`, else content/hi/seo.ts, else the English input. */
  lang?: Lang;
  /** Explicit Hindi title/description/keywords (used by pages whose copy is generated, e.g. products and posts). */
  hi?: { title: string; description: string; keywords?: string[]; imageAlt?: string };
};

/** Build full metadata for a generic page (canonical, hreflang, OG, Twitter, robots). */
export function buildPageMeta(input: PageMetaInput): Metadata {
  const { path: p, image, ogType, noIndex = false, lang = "en" } = input;
  let { title, description, keywords = [] } = input;
  let hiAbsolute = false;
  if (lang === "hi") {
    const h = input.hi ?? getHiSeo(p);
    if (h) {
      title = h.title;
      description = h.description;
      keywords = h.keywords ?? keywords;
      hiAbsolute = !input.hi; // table entries are complete titles
    }
  }
  const url = pageUrl(p, lang);
  const tpl = ogImage(ogType ?? ogTypeFromPath(p), lang);
  const img = image?.url
    ? { url: image.url.startsWith("http") ? image.url : `${baseUrl}${image.url}` }
    : tpl;
  const alt =
    image?.alt || (lang === "hi" ? `${siteHi.name}, सियागंज, इंदौर` : `${site.name}, Siyaganj, Indore`);
  const override = lang === "en" ? getSeoOverride(p) : undefined;
  const metaTitle: Metadata["title"] = override
    ? { absolute: override.title }
    : hiAbsolute
    ? { absolute: title }
    : fitTitle(title, lang);
  const full = titleText(metaTitle, lang);
  const finalDescription = override?.description ?? description;
  const desc = trimAtWord(finalDescription, lang === "hi" ? 150 : 158);

  return {
    title: metaTitle,
    description: desc,
    keywords: keywords.length ? keywords.join(", ") : undefined,
    alternates: langAlternates(p, lang),
    openGraph: {
      title: full,
      description: trimAtWord(finalDescription, 200),
      url,
      siteName: lang === "hi" ? siteHi.name : site.name,
      locale: ogLocale[lang],
      alternateLocale: [ogLocale[lang === "hi" ? "en" : "hi"]],
      type: "website",
      images: [{ ...img, alt }],
    },
    twitter: {
      card: "summary_large_image",
      title: full,
      description: trimAtWord(finalDescription, 200),
      images: [img.url],
    },
    robots: noIndex ? { index: false, follow: true } : ROBOTS_INDEX,
  };
}

/** Site-wide defaults in app/[lang]/layout.tsx. */
export function buildRootMeta(lang: Lang): Metadata {
  const hi = lang === "hi";
  const name = hi ? siteHi.name : site.name;
  const tagline = hi ? siteHi.tagline : site.tagline;
  const description = hi ? siteHi.description : site.description;
  const og = ogImage("default", lang);
  const keywords = hi
    ? [...siteHi.keywords]
    : [
        "wire mesh Indore",
        "iron and hardware Siyaganj Indore",
        "TMT bars Indore",
        "barbed wire Indore",
        "chain link fencing Indore",
        "GI wire Indore",
        "HM Ibrahim",
      ];
  return {
    title: { default: `${name} | ${tagline}`, template: `%s | ${name}` },
    description,
    keywords,
    metadataBase: new URL(baseUrl),
    openGraph: {
      type: "website",
      locale: ogLocale[lang],
      url: pageUrl("", lang),
      siteName: name,
      title: `${name} | ${tagline}`,
      description,
      images: [
        {
          url: og.url,
          width: og.width ?? 1200,
          height: og.height ?? 630,
          alt: hi ? `${siteHi.name} - इंदौर में लोहा और हार्डवेयर व्यापार` : `${site.name} - Iron & Hardware Trading in Indore`,
        },
      ],
    },
    twitter: { card: "summary_large_image", title: `${name} | ${tagline}`, description, images: [og.url] },
    // No robots here: every page sets its own (ROBOTS_INDEX). A root value would also reach the 404 page, which
    // Next marks noindex, and the two tags would contradict each other.
    icons: { icon: "/favicon.svg" },
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
  lang?: Lang;
};

/**
 * Product meta. Title leads with the product name and the buyer's question (sizes, uses, rate),
 * so product pages do not compete with the /indore/* landing pages that own "<term> Indore".
 * For Hindi, productName and shortDesc must already be the Hindi strings.
 */
export function buildProductMeta(input: ProductMetaInput): Metadata {
  const { productName, shortDesc, slug, imageUrl, lang = "en" } = input;
  const hi = lang === "hi";
  const candidates = hi
    ? [
        `${productName} इंदौर में: साइज़, उपयोग, रेट | एचएम इब्राहिम`,
        `${productName} इंदौर: साइज़ और रेट | एचएम इब्राहिम`,
        `${productName} इंदौर में | एचएम इब्राहिम`,
      ]
    : [
        `${productName} in Indore: Sizes, Uses, Rate | ${site.name}`,
        `${productName} in Indore: Sizes and Rate | HM Ibrahim`,
        `${productName} in Indore | ${site.name}`,
      ];
  // Hand-written title and description for a product (content/seoOverrides.ts, content/hi/seo.ts) win over the template.
  const override = hi ? getHiSeo(`products/${slug}`) : getSeoOverride(`products/${slug}`);
  const title = override?.title ?? candidates.find((c) => c.length <= 60) ?? trimAtWord(candidates[2], 60);

  const lead = shortDesc.replace(/\s+/g, " ").trim().replace(/[.।]?$/, hi ? "।" : ".");
  const description = override?.description
    ? trimAtWord(override.description, hi ? 150 : 158)
    : trimAtWord(
    hi
      ? `${lead} साइज़, उपयोग और कैसे चुनें, सियागंज मेन रोड, इंदौर से ${siteHi.name}। रेट पूछें।`
      : `${lead} Sizes, uses and how to choose, from ${site.name} on Siyaganj Main Road, Indore. Ask for the rate.`,
    hi ? 150 : 158
  );

  const url = pageUrl(`products/${slug}`, lang);
  const photo = imageUrl && imageUrl !== baseUrl ? (imageUrl.startsWith("http") ? imageUrl : `${baseUrl}${imageUrl}`) : "";
  const img = photo ? { url: photo } : ogImage("product", lang);

  return {
    title: { absolute: title },
    description,
    alternates: langAlternates(`products/${slug}`, lang),
    openGraph: {
      title,
      description,
      url,
      siteName: hi ? siteHi.name : site.name,
      images: [{ ...img, alt: productName }],
      locale: ogLocale[lang],
      alternateLocale: [ogLocale[hi ? "en" : "hi"]],
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description, images: [img.url] },
    robots: ROBOTS_INDEX,
  };
}
