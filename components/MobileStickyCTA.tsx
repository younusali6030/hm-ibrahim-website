"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Phone, MessageCircle, FileText } from "lucide-react";
import { site } from "@/content/site";
import { getWhatsAppLink } from "@/lib/utils";
import { trackCallClick, trackWhatsAppClick } from "@/lib/analytics";
import { T, useT } from "@/lib/i18n";

const FIELD = "input, textarea, select, [role='combobox'], [contenteditable='true']";

/** True when focus is in a field of a form that asked for the bar to step aside (`data-hide-sticky`). */
function inHidingForm(el: Element | null): boolean {
  return !!el && el.matches(FIELD) && !!el.closest("[data-hide-sticky]");
}

export function MobileStickyCTA() {
  const t = useT();
  const [typing, setTyping] = useState(false);

  // While a field of a [data-hide-sticky] form has focus (and the phone keyboard is up), the bar must not sit on the fields.
  useEffect(() => {
    const onIn = (e: FocusEvent) => {
      if (e.target instanceof Element && inHidingForm(e.target)) setTyping(true);
    };
    const onOut = () => {
      requestAnimationFrame(() => setTyping(inHidingForm(document.activeElement)));
    };
    document.addEventListener("focusin", onIn);
    document.addEventListener("focusout", onOut);
    return () => {
      document.removeEventListener("focusin", onIn);
      document.removeEventListener("focusout", onOut);
    };
  }, []);

  return (
    <div
      className={
        "sticky-cta glass-strong fixed inset-x-3 bottom-[calc(0.6rem+env(safe-area-inset-bottom,0px))] z-40 flex gap-2 rounded-full p-1.5 transition-[transform,opacity,visibility] duration-200 print:hidden md:hidden " +
        (typing ? "invisible translate-y-[160%] opacity-0" : "")
      }
      role="group"
      aria-label={t("Quick contact", "जल्दी संपर्क")}
      data-track="mobile_sticky"
    >
      <Link
        href="/contact"
        className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-[0_8px_22px_-8px_rgba(249,115,22,0.8)] active:scale-[0.98]"
        aria-label={t("Get a quote", "कोटेशन पाएँ")}
      >
        <FileText className="h-5 w-5" aria-hidden />
        <T en="Get a quote" hi="कोटेशन पाएँ" />
      </Link>
      <a
        href={`tel:${site.phone.replace(/\D/g, "")}`}
        onClick={() => trackCallClick("mobile_sticky")}
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-white active:scale-95"
        aria-label={t("Call us", "कॉल करें")}
      >
        <Phone className="h-5 w-5" aria-hidden />
      </a>
      <a
        href={getWhatsAppLink(site.whatsapp, "Hi, I'm interested in your products. Please share price/availability.")}
        onClick={() => trackWhatsAppClick("mobile_sticky")}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-white active:scale-95"
        aria-label={t("WhatsApp us", "व्हाट्सएप करें")}
      >
        <MessageCircle className="h-5 w-5" aria-hidden />
      </a>
    </div>
  );
}
