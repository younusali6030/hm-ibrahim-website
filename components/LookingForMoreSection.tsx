import { site } from "@/content/site";
import { getWhatsAppLink } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Props = {
  variant?: "page" | "product";
  className?: string;
};

const whatsAppPrefill = "Hi, I'm looking for [item]. Do you have it available?";

export function LookingForMoreSection({ variant = "page", className = "" }: Props) {
  if (variant === "product") {
    return (
      <div className={`rounded-lg border border-border/60 bg-muted/30 p-4 ${className}`}>
        <p className="text-sm text-muted-foreground">
          We stock many more construction and fabrication hardware items. If you don&apos;t see what
          you need,{" "}
          <a
            href={`tel:${site.phone.replace(/\s/g, "")}`}
            className="text-primary hover:underline"
          >
            call
          </a>{" "}
          or{" "}
          <a
            href={getWhatsAppLink(site.whatsapp, "Hi, I'm looking for a product. Do you have it available?")}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            WhatsApp
          </a>{" "}
          us for quick availability and pricing.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`rounded-lg border border-border bg-card/60 p-4 md:p-5 ${className}`}
      role="region"
      aria-labelledby="stock-more-heading"
    >
      <h2 id="stock-more-heading" className="text-sm font-semibold text-foreground">
        Need something specific?
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        We stock a wide range of construction hardware beyond what&apos;s listed here. Call or
        WhatsApp for availability.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button asChild size="sm">
          <a href={`tel:${site.phone.replace(/\s/g, "")}`} aria-label="Call us">
            Call
          </a>
        </Button>
        <Button asChild size="sm" variant="outline">
          <a
            href={getWhatsAppLink(site.whatsapp, whatsAppPrefill)}
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
