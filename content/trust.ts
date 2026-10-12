/**
 * Trust badges. Real customer reviews live in content/reviews.ts (copied verbatim from Google).
 */

import type { LucideIcon } from "lucide-react";

export type TrustBadge = {
  id: string;
  label: string;
  icon: string; // lucide icon name
};

export const trustBadges: TrustBadge[] = [
  { id: "since-1939", label: "Since 1939", icon: "Calendar" },
  { id: "bulk-stock", label: "Bulk Stock", icon: "Package" },
  { id: "wholesale-pricing", label: "Wholesale Pricing", icon: "BadgeIndianRupee" },
  { id: "fast-dispatch", label: "Fast Dispatch", icon: "Truck" },
  { id: "quality-checked", label: "Quality Checked", icon: "ShieldCheck" },
];
