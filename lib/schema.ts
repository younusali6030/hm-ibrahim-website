/**
 * JSON-LD builders and a sanitiser for the whole site.
 *
 * Rules (do not relax without evidence):
 * - No AggregateRating or Review nodes: the 4.9 / 633 Google figures are the shop's own rating of itself
 *   and are shown on the page, not marked up.
 * - A Product carries one AggregateOffer built from the owner's indicative rate (lib/indicativeRate.ts), the
 *   same range the page shows. A product without a parseable rate gets no Product node at all, because
 *   Google rejects a Product that has no offers, review or aggregateRating.
 * - FAQPage only where the same questions are visible on the page.
 * - One stable @id per entity: organization, localbusiness, website. Other nodes point at them by @id.
 * - Every URL is absolute and on the canonical host (baseUrl).
 */

import { baseUrl, entityIds, site, nap } from "@/lib/site";
import { categories } from "@/content/products";
import { localePath, htmlLang, type Lang } from "@/lib/locale";
import { siteHi } from "@/content/hi/site";
import { catalogHi } from "@/content/hi/catalog";
import { RATE_UNIT_CODE, type IndicativeRate } from "@/lib/indicativeRate";

type Json = Record<string, unknown>;

export const ids = {
  ...entityIds,
  page: (path: string) => `${baseUrl}${path === "/" ? "" : path}#webpage`,
} as const;

export const abs = (src: string): string => (/^https?:\/\//.test(src) ? src : `${baseUrl}${src.startsWith("/") ? "" : "/"}${src}`);

/** Listing URLs without the tracking parameters that come with copied links. */
function cleanUrl(u: string): string {
  try {
    const x = new URL(u);
    ["srsltid", "utm_source", "utm_medium", "utm_campaign"].forEach((k) => x.searchParams.delete(k));
    return x.toString().replace(/\?$/, "");
  } catch {
    return u;
  }
}

/** Real profile URLs only. Empty social fields in content/site.ts are skipped, never guessed. */
export function sameAsUrls(): string[] {
  const list = [
    site.social.facebook,
    site.social.instagram,
    site.social.linkedin,
    site.social.twitter,
    site.indiamartUrl,
    site.justdialUrl,
    site.googleReview.profileUrl,
  ]
    .filter(Boolean)
    .map((u) => cleanUrl(u as string));
  return Array.from(new Set(list));
}

export function postalAddress(): Json {
  return {
    "@type": "PostalAddress",
    streetAddress: `${site.address.line1}, ${site.address.line2}`,
    addressLocality: site.address.city,
    addressRegion: site.address.state,
    postalCode: site.address.pincode,
    addressCountry: "IN",
  };
}

/** Global @graph: Organization, HardwareStore (LocalBusiness) and WebSite. Rendered once, in the root layout. */
export function globalGraph(lang: Lang = "en"): Json {
  const hi = lang === "hi";
  // Orders are accepted across India (owner-confirmed); the shop itself is in Indore (see address).
  const areaServed: Json[] = [{ "@type": "Country", name: "India" }];
  const sameAs = sameAsUrls();
  const phone = nap.phone;
  const phoneAlt = site.phoneAlt.replace(/\s/g, "");

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ids.organization,
        name: site.name,
        legalName: site.legalName,
        url: baseUrl,
        logo: { "@type": "ImageObject", url: `${baseUrl}/logo-dark.png` },
        foundingDate: "1939",
        description: hi ? siteHi.description : site.description,
        ...(hi ? { alternateName: [siteHi.name, siteHi.legalName] } : {}),
        brand: [
          { "@type": "Brand", name: "CM", url: `${baseUrl}${localePath(lang, "/brands/cm")}` },
          { "@type": "Brand", name: "Border", url: `${baseUrl}${localePath(lang, "/brands/border")}` },
        ],
        contactPoint: [
          { "@type": "ContactPoint", contactType: "sales", telephone: phone, areaServed: "IN", availableLanguage: ["en", "hi"] },
          { "@type": "ContactPoint", contactType: "sales", telephone: phoneAlt, areaServed: "IN", availableLanguage: ["en", "hi"] },
        ],
        ...(sameAs.length ? { sameAs } : {}),
      },
      {
        "@type": ["HardwareStore", "LocalBusiness"],
        "@id": ids.localBusiness,
        name: site.name,
        alternateName: hi ? [site.legalName, siteHi.name] : site.legalName,
        description: hi ? siteHi.description : site.description,
        url: baseUrl,
        image: [`${baseUrl}/about-storefront.png`, `${baseUrl}/logo-dark.png`],
        logo: `${baseUrl}/logo-dark.png`,
        telephone: phone,
        email: site.email,
        address: postalAddress(),
        geo: { "@type": "GeoCoordinates", latitude: site.geo.latitude, longitude: site.geo.longitude },
        hasMap: site.googleReview.profileUrl,
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            opens: "10:00",
            closes: "20:00",
          },
        ],
        areaServed,
        currenciesAccepted: "INR",
        ...(site.gstin ? { taxID: site.gstin } : {}),
        parentOrganization: { "@id": ids.organization },
        ...(sameAs.length ? { sameAs } : {}),
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: hi ? "लोहा और हार्डवेयर की रेंज" : "Iron and hardware range",
          itemListElement: categories.map((c) => ({
            "@type": "OfferCatalog",
            name: hi ? catalogHi[c.name] ?? c.name : c.name,
            url: `${baseUrl}${localePath(lang, `/categories/${c.slug}`)}`,
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": ids.website,
        name: site.name,
        alternateName: site.legalName,
        url: baseUrl,
        inLanguage: htmlLang[lang],
        publisher: { "@id": ids.organization },
      },
    ],
  };
}

export function breadcrumbList(items: { name: string; url: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: abs(item.url),
    })),
  };
}

export function faqPage(faqs: { question: string; answer: string }[]): Json | null {
  if (!faqs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function itemList(name: string, items: { name: string; url: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, url: abs(it.url) })),
  };
}

export function videoObject(v: {
  name: string;
  description: string;
  thumbnail: string;
  contentUrl: string;
  uploadDate: string;
  pageUrl?: string;
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: v.name,
    description: v.description,
    thumbnailUrl: [abs(v.thumbnail)],
    contentUrl: abs(v.contentUrl),
    uploadDate: v.uploadDate,
    inLanguage: "en-IN",
    publisher: { "@id": ids.organization },
    ...(v.pageUrl ? { embedUrl: abs(v.pageUrl) } : {}),
  };
}

export function productJsonLd(p: {
  slug: string;
  name: string;
  description: string;
  images: string[];
  category?: string;
  materials?: string[];
  specs?: { label: string; value: string }[];
  brands?: string[];
  rate: IndicativeRate;
}): Json {
  const url = `${baseUrl}/products/${p.slug}`;
  const { low, high, unit } = p.rate;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: p.name,
    description: p.description,
    url,
    ...(p.images.length ? { image: p.images.map(abs) } : {}),
    ...(p.category ? { category: p.category } : {}),
    ...(p.materials?.length ? { material: p.materials.join(", ") } : {}),
    ...(p.brands?.length ? { brand: p.brands.map((b) => ({ "@type": "Brand", name: b })) } : {}),
    ...(p.specs?.length
      ? { additionalProperty: p.specs.map((s) => ({ "@type": "PropertyValue", name: s.label, value: s.value })) }
      : {}),
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      lowPrice: low,
      highPrice: high,
      url,
      seller: { "@id": ids.localBusiness },
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        priceCurrency: "INR",
        minPrice: low,
        maxPrice: high,
        unitCode: RATE_UNIT_CODE[unit],
        unitText: unit,
      },
    },
  };
}

export function blogPostingJsonLd(p: {
  slug: string;
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  images?: string[];
  section?: string;
  wordCount?: number;
}): Json {
  const url = `${baseUrl}/blog/${p.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: p.title,
    description: p.description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: p.datePublished,
    dateModified: p.dateModified || p.datePublished,
    inLanguage: "en-IN",
    ...(p.section ? { articleSection: p.section } : {}),
    ...(p.wordCount ? { wordCount: p.wordCount } : {}),
    ...(p.images?.length ? { image: p.images.map(abs) } : {}),
    author: { "@id": ids.organization },
    publisher: { "@id": ids.organization },
    isPartOf: { "@id": ids.website },
  };
}

const DROP_ON_ANY = new Set(["aggregateRating", "review", "reviews", "speakable", "priceRange", "paymentAccepted"]);

/**
 * Last line of defence, applied to every page-level JSON-LD node before it is rendered.
 * It removes what must never ship (offers, ratings, review nodes, speakable) and swaps
 * duplicated Organization / LocalBusiness fragments for @id references.
 */
export function sanitizeJsonLd<T>(node: T, parentKey?: string): T {
  if (Array.isArray(node)) return node.map((n) => sanitizeJsonLd(n, parentKey)).filter((n) => n !== undefined) as unknown as T;
  if (!node || typeof node !== "object") return node;
  const src = node as Json;
  const type = src["@type"];
  const types = Array.isArray(type) ? (type as string[]) : type ? [type as string] : [];
  const out: Json = {};

  for (const [k, v] of Object.entries(src)) {
    if (DROP_ON_ANY.has(k)) continue;
    if (v === undefined || v === null || v === "") continue;
    out[k] = sanitizeJsonLd(v, k);
  }

  if (types.includes("Product")) {
    // Only the AggregateOffer from productJsonLd survives; any other offer shape is dropped.
    const o = out.offers as Json | undefined;
    if (!o || o["@type"] !== "AggregateOffer" || typeof o.lowPrice !== "number") delete out.offers;
    delete out.mpn; // was the URL slug: not a manufacturer part number
    delete out.sku; // was the URL slug: not a stock-keeping unit
    const b = out.brand as Json | undefined;
    if (b && typeof b === "object" && !Array.isArray(b) && b.name === site.name) delete out.brand;
  }
  if (types.includes("Brand")) {
    delete out.brand; // a Brand cannot have a brand
  }
  if (types.includes("BlogPosting") || types.includes("Article") || types.includes("Blog")) {
    const a = out.author as Json | undefined;
    if (a && a["@type"] === "Organization" && !a["@id"]) out.author = { "@id": ids.organization };
    const pub = out.publisher as Json | undefined;
    if (pub && pub["@type"] === "Organization" && !pub["@id"]) out.publisher = { "@id": ids.organization };
    if (types.includes("BlogPosting") && !out.isPartOf) out.isPartOf = { "@id": ids.website };
  }
  // Partial copies of the business inside page schemas become references to the one real entity.
  if (parentKey && ["mainEntity", "seller", "provider"].includes(parentKey)) {
    if (types.includes("LocalBusiness") || types.includes("HardwareStore")) return { "@id": ids.localBusiness } as unknown as T;
    if (types.includes("Organization")) return { "@id": ids.organization } as unknown as T;
  }
  return out as unknown as T;
}

const ENTITY_ID = /#(organization|localbusiness|website)$/;

/**
 * Point a page-level schema node at the Hindi URLs. Internal page URLs (no file extension, not an entity @id)
 * gain the /hi prefix and inLanguage becomes hi-IN. Images, logos and external links are untouched.
 */
export function localizeSchema<T>(node: T, lang: Lang): T {
  if (lang === "en") return node;
  const walk = (v: unknown, key?: string): unknown => {
    if (typeof v === "string") {
      if (key === "inLanguage" && /^en/i.test(v)) return htmlLang.hi;
      if (v.startsWith(baseUrl) && !ENTITY_ID.test(v)) {
        const rest = v.slice(baseUrl.length);
        const pathOnly = rest.split("#")[0].split("?")[0];
        if ((rest === "" || rest.startsWith("/")) && !/\.[a-z0-9]{2,5}$/i.test(pathOnly) && !pathOnly.startsWith("/hi")) {
          const hash = rest.includes("#") ? rest.slice(rest.indexOf("#")) : "";
          const q = rest.includes("?") ? rest.slice(rest.indexOf("?"), hash ? rest.indexOf("#") : undefined) : "";
          return `${baseUrl}${localePath("hi", pathOnly || "/")}${q}${hash}`;
        }
      }
      return v;
    }
    if (Array.isArray(v)) return v.map((x) => walk(x, key));
    if (v && typeof v === "object") {
      return Object.fromEntries(Object.entries(v as Record<string, unknown>).map(([k, x]) => [k, walk(x, k)]));
    }
    return v;
  };
  return walk(node) as T;
}
