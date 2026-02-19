"use client";

import { Phone, MessageCircle } from "lucide-react";
import { site } from "@/content/site";
import { getWhatsAppLink } from "@/lib/utils";
import { trackCallClick, trackWhatsAppClick } from "@/lib/analytics";

export function MobileStickyCTA() {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 flex gap-2 border-t border-border bg-background/95 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] backdrop-blur print:hidden md:hidden"
      role="group"
      aria-label="Quick contact"
    >
      <a
        href={`tel:${site.phone.replace(/\D/g, "")}`}
        onClick={() => trackCallClick("mobile_sticky")}
        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        aria-label="Call us"
      >
        <Phone className="h-5 w-5" aria-hidden />
        Call
      </a>
      <a
        href={getWhatsAppLink(
          site.whatsapp,
          "Hi, I'm interested in your products. Please share price/availability."
        )}
        onClick={() => trackWhatsAppClick("mobile_sticky")}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-card py-3 text-sm font-medium hover:bg-accent"
        aria-label="WhatsApp us"
      >
        <MessageCircle className="h-5 w-5" aria-hidden />
        WhatsApp
      </a>
    </div>
  );
}
