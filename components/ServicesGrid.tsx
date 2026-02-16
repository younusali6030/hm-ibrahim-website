"use client";

import { services } from "@/content/services";
import { getIcon } from "@/components/icons";

export function ServicesGrid() {
  return (
    <div className="mt-12 grid gap-8 md:grid-cols-2">
      {services.map((service) => {
        const Icon = getIcon(service.icon);
        return (
          <div
            key={service.slug}
            className={`rounded-lg border border-border bg-card p-6 ${service.highlight ? "ring-1 ring-primary/30" : ""}`}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 text-primary">
                <Icon className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">{service.title}</h2>
            </div>
            <p className="mt-4 text-muted-foreground leading-relaxed">{service.description}</p>
            {(service.slug === "delivery" || service.slug === "fabrication") && (
              <p className="mt-2 text-sm text-muted-foreground italic">
                Subject to availability / please enquire at the time of order.
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
