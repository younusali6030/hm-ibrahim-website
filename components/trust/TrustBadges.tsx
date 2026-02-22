"use client";

import {
  Calendar,
  Package,
  Truck,
  ShieldCheck,
  BadgeIndianRupee,
  type LucideIcon,
} from "lucide-react";
import { trustBadges } from "@/content/trust";

const iconMap: Record<string, LucideIcon> = {
  Calendar,
  Package,
  Truck,
  ShieldCheck,
  BadgeIndianRupee,
};

type Props = {
  className?: string;
  /** Max badges to show; default all */
  max?: number;
};

export function TrustBadges({ className = "", max }: Props) {
  const badges = max ? trustBadges.slice(0, max) : trustBadges;

  return (
    <section
      className={`flex flex-wrap items-center justify-center gap-3 sm:gap-4 ${className}`}
      aria-label="Trust badges"
    >
      {badges.map((badge) => {
        const Icon = iconMap[badge.icon] ?? Package;
        return (
          <span
            key={badge.id}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-small font-medium text-foreground"
          >
            <Icon className="h-4 w-4 shrink-0 text-primary" aria-hidden />
            {badge.label}
          </span>
        );
      })}
    </section>
  );
}
