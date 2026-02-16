"use client";

import { site } from "@/content/site";
import { getWhatsAppLink } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function SpecificBrandBlock() {
  const whatsAppMessage = "Hi, I'm looking for a specific brand or product. Do you have it available?";

  return (
    <div
      className="rounded-lg border border-border bg-card/60 p-4"
      role="region"
      aria-labelledby="specific-brand-heading"
    >
      <h2 id="specific-brand-heading" className="text-sm font-semibold text-foreground">
        Looking for a specific brand?
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        We stock trusted brands and quality local options. If you don&apos;t see your item listed,
        call or WhatsApp us for quick availability.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button asChild size="sm">
          <a href={`tel:${site.phone.replace(/\s/g, "")}`} aria-label="Call us">
            Call
          </a>
        </Button>
        <Button asChild size="sm" variant="outline">
          <a
            href={getWhatsAppLink(site.whatsapp, whatsAppMessage)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp us"
          >
            WhatsApp
          </a>
        </Button>
      </div>
    </div>
  );
}
