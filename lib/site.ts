/**
 * Site constants for SEO and app config.
 */

import { site as siteContent } from "@/content/site";

/** Canonical production origin (no trailing slash). The only host that may appear in canonicals, OG, sitemap, robots and JSON-LD. */
export const PRODUCTION_URL = "https://www.hmibrahim.net";

/**
 * Canonical base URL used for sitemap, canonicals, OG and schema.
 * Always the production origin, so a preview deployment or a mistyped
 * NEXT_PUBLIC_SITE_URL can never leak into SEO output. Only `next dev`
 * honours NEXT_PUBLIC_SITE_URL, for testing against a local origin.
 */
export const baseUrl: string =
  process.env.NODE_ENV === "development" && /^https?:\/\/[^\s/]+/.test(process.env.NEXT_PUBLIC_SITE_URL ?? "")
    ? (process.env.NEXT_PUBLIC_SITE_URL as string).replace(/\/$/, "")
    : PRODUCTION_URL;

/** Stable JSON-LD entity identifiers. */
export const entityIds = {
  organization: `${baseUrl}/#organization`,
  localBusiness: `${baseUrl}/#localbusiness`,
  website: `${baseUrl}/#website`,
} as const;

/** NAP: Name, Address, Phone — for schema and citations */
export const nap = {
  name: siteContent.name,
  legalName: siteContent.legalName,
  address: siteContent.fullAddress,
  streetAddress: `${siteContent.address.line1}, ${siteContent.address.line2}`,
  addressLocality: siteContent.address.city,
  addressRegion: siteContent.address.state,
  postalCode: siteContent.address.pincode,
  addressCountry: siteContent.address.country,
  phone: siteContent.phone.replace(/\s/g, ""),
  email: siteContent.email,
} as const;

/** City/region for local SEO */
export const localSeo = {
  city: "Indore",
  state: "Madhya Pradesh",
  region: "MP",
  area: "Siyaganj",
} as const;

export { siteContent as site };
