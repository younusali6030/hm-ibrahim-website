/**
 * Site constants for SEO and app config.
 * Change NEXT_PUBLIC_SITE_URL in .env or here for production domain.
 */

import { site as siteContent } from "@/content/site";

/** Canonical base URL (no trailing slash). Use for sitemap, canonicals, OG, schema. */
export const baseUrl =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_SITE_URL
    ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")
    : "https://hmibrahimco.com";

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
