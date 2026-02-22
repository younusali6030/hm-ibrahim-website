"use client";

import { trustMetrics } from "@/content/trust";

/**
 * Optional stats strip. Only shows metrics that are not placeholders or that have a displayable value.
 * TODO: When you replace placeholders in content/trust.ts with real values, set isPlaceholder: false
 * and this strip will show them. For now we only show "Years in business" (85+) as the one safe placeholder.
 */
type Props = {
  className?: string;
};

export function StatsStrip({ className = "" }: Props) {
  const displayable = trustMetrics.filter(
    (m) => m.value !== "—" && m.value !== ""
  );

  if (displayable.length === 0) return null;

  return (
    <section
      className={`border-y border-border bg-muted/30 py-6 sm:py-8 ${className}`}
      aria-label="Key metrics"
    >
      <div className="page-container">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8">
          {displayable.map((m) => (
            <div key={m.id} className="text-center">
              <p className="text-h3 font-heading font-bold text-foreground">
                {m.value}
              </p>
              <p className="mt-1 text-small text-muted-foreground">{m.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
