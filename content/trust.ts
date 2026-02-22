/**
 * Trust badges, testimonials, and optional stats for the site.
 *
 * HOW TO UPDATE TESTIMONIALS:
 * 1. Add real testimonials only with permission (name, company, quote).
 * 2. For real testimonials: set isPlaceholder: false and use real name/company/quote.
 * 3. For placeholders: keep isPlaceholder: true and name like "Client (placeholder)".
 * 4. Do NOT add Review/aggregateRating schema for placeholder testimonials.
 * 5. Optional: add productSlug or categorySlug to show testimonial on relevant product/category pages.
 */

import type { LucideIcon } from "lucide-react";

export type TrustBadge = {
  id: string;
  label: string;
  icon: string; // lucide icon name
};

export type TrustTestimonial = {
  id: string;
  name: string;
  /** e.g. "Contractor", "Fabricator" */
  companyType: string;
  /** e.g. "Indore", "Siyaganj" */
  city: string;
  quote: string;
  /** 1-5; only use for real testimonials; do NOT add schema for placeholders */
  rating?: number;
  /** Optional: show this testimonial on product page */
  productSlug?: string;
  /** Optional: show on category pages */
  categorySlug?: string;
  /** True = placeholder (do not use for Review schema). Replace with real testimonial. */
  isPlaceholder: boolean;
};

/** TODO: Replace with real metrics when you have them. Clearly placeholder — do not show as fact. */
export type TrustMetric = {
  id: string;
  value: string;
  label: string;
  /** Always true for now — placeholder until real data */
  isPlaceholder: boolean;
};

export const trustBadges: TrustBadge[] = [
  { id: "since-1939", label: "Since 1939", icon: "Calendar" },
  { id: "bulk-stock", label: "Bulk Stock", icon: "Package" },
  { id: "wholesale-pricing", label: "Wholesale Pricing", icon: "BadgeIndianRupee" },
  { id: "fast-dispatch", label: "Fast Dispatch", icon: "Truck" },
  { id: "quality-checked", label: "Quality Checked", icon: "ShieldCheck" },
];

/**
 * Testimonials: mix of placeholders (marked) and slots for real ones.
 * To add a real testimonial: copy an entry, set isPlaceholder: false, add real name, companyType, city, quote.
 * Get permission before using names/companies. Do not fabricate reviews.
 */
export const trustTestimonials: TrustTestimonial[] = [
  {
    id: "t1",
    name: "Client (placeholder)",
    companyType: "Contractor",
    city: "Indore",
    quote: "Reliable supply and fair rates. We have been buying TMT and angles from Siyaganj for our projects.",
    rating: 5,
    isPlaceholder: true,
    categorySlug: "structural-items",
  },
  {
    id: "t2",
    name: "Client (placeholder)",
    companyType: "Fabricator",
    city: "Siyaganj",
    quote: "Good stock of wire mesh and weldmesh. Quick dispatch and no hassle with bulk orders.",
    isPlaceholder: true,
    categorySlug: "welded-mesh",
  },
  {
    id: "t3",
    name: "Client (placeholder)",
    companyType: "Builder",
    city: "Indore",
    quote: "We order fencing material and GI wire regularly. Trust them for quality and on-time delivery.",
    rating: 5,
    isPlaceholder: true,
    categorySlug: "fencing-material",
  },
  {
    id: "t4",
    name: "Client (placeholder)",
    companyType: "Workshop owner",
    city: "Dewas",
    quote: "One stop for rods, welding consumables, and hardware. Saves time and we get consistent quality.",
    isPlaceholder: true,
    categorySlug: "construction-tools",
  },
  {
    id: "t5",
    name: "Client (placeholder)",
    companyType: "Retail customer",
    city: "Indore",
    quote: "Small order was treated with same care as big ones. Old-school values and helpful staff.",
    isPlaceholder: true,
  },
];

/**
 * Optional stats for homepage. PLACEHOLDER ONLY — replace values when you have real data.
 * TODO: Replace with actual numbers (years in business, SKU count, repeat customer %, dispatch time).
 * Do not display as factual until updated.
 */
export const trustMetrics: TrustMetric[] = [
  { id: "years", value: "85+", label: "Years in business", isPlaceholder: true },
  { id: "skus", value: "—", label: "SKUs (fill when known)", isPlaceholder: true },
  { id: "repeat", value: "—", label: "Repeat customers (fill when known)", isPlaceholder: true },
  { id: "dispatch", value: "—", label: "Avg. dispatch (fill when known)", isPlaceholder: true },
];

/** Get testimonials for product page: prefer ones matching category/product, then generic; exclude placeholders from schema only. */
export function getTestimonialsForProduct(categorySlug?: string, productSlug?: string, limit = 3): TrustTestimonial[] {
  const scored = trustTestimonials.map((t) => {
    let score = 0;
    if (t.productSlug === productSlug) score += 3;
    if (t.categorySlug === categorySlug) score += 2;
    if (!t.categorySlug && !t.productSlug) score += 1;
    return { t, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((x) => x.t);
}
