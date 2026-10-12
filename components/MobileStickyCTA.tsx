"use client";

import Link from "next/link";
import { Phone, MessageCircle, FileText } from "lucide-react";
import { site } from "@/content/site";
import { getWhatsAppLink } from "@/lib/utils";
import { trackCallClick, trackWhatsAppClick } from "@/lib/analytics";

export function MobileStickyCTA() {
  return (
    <div
      className="sticky-cta glass-strong fixed inset-x-3 bottom-[calc(0.6rem+env(safe-area-inset-bottom,0px))] z-40 flex gap-2 rounded-full p-1.5 print:hidden md:hidden"
      role="group"
      aria-label="Quick contact"
    >
      <Link
        href="/contact"
        className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-[0_8px_22px_-8px_rgba(249,115,22,0.8)] active:scale-[0.98]"
        aria-label="Get a quote"
      >
        <FileText className="h-5 w-5" aria-hidden />
        Get a quote
      </Link>
      <a
        href={`tel:${site.phone.replace(/\D/g, "")}`}
        onClick={() => trackCallClick("mobile_sticky")}
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-white active:scale-95"
        aria-label="Call us"
      >
        <Phone className="h-5 w-5" aria-hidden />
      </a>
      <a
        href={getWhatsAppLink(site.whatsapp, "Hi, I'm interested in your products. Please share price/availability.")}
        onClick={() => trackWhatsAppClick("mobile_sticky")}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-white active:scale-95"
        aria-label="WhatsApp us"
      >
        <MessageCircle className="h-5 w-5" aria-hidden />
      </a>
    </div>
  );
}
