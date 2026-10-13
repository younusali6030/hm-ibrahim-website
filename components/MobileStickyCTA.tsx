"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "@/components/LocaleLink";
import { Phone, MessageCircle, FileText } from "lucide-react";
import { site } from "@/content/site";
import { getWhatsAppLink, telHref } from "@/lib/utils";
import { trackCallClick, trackWhatsAppClick } from "@/lib/analytics";
import { T, useT, useLang } from "@/lib/i18n";
import { useEnquiryLinks } from "@/lib/enquiryStore";

const FIELD = "input, textarea, select, [role='combobox'], [contenteditable='true']";

/** True when focus is in a field of a form that asked for the bar to step aside (`data-hide-sticky`). */
function inHidingForm(el: Element | null): boolean {
  return !!el && el.matches(FIELD) && !!el.closest("[data-hide-sticky]");
}

export function MobileStickyCTA() {
  const t = useT();
  const { lang } = useLang();
  const [typing, setTyping] = useState(false);
  // The product page publishes what the visitor chose; everywhere else the bar is generic.
  const { quoteHref, waText } = useEnquiryLinks(
    lang,
    t("Hi, I'm interested in your products. Please share prices and availability.", "नमस्ते, मुझे आपके उत्पादों में रुचि है। कृपया भाव और उपलब्धता बताइए।")
  );
  const onContact = /\/contact\/?$/.test(usePathname() ?? "");

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
        href={quoteHref}
        onClick={(e) => {
          // Already on the contact page: bring the form into focus instead of reloading an empty contact URL.
          if (!onContact) return;
          const el = document.getElementById("items");
          if (!el) return;
          e.preventDefault();
          el.scrollIntoView({ block: "center", behavior: "smooth" });
          el.focus({ preventScroll: true });
        }}
        className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-[0_8px_22px_-8px_rgba(249,115,22,0.8)] active:scale-[0.98]"
        aria-label={t("Get a quote", "कोटेशन पाएँ")}
      >
        <FileText className="h-5 w-5" aria-hidden />
        <T en="Get a quote" hi="कोटेशन पाएँ" />
      </Link>
      <a
        href={telHref(site.phone)}
        onClick={() => trackCallClick("mobile_sticky")}
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-white active:scale-95"
        aria-label={t("Call us", "कॉल करें")}
      >
        <Phone className="h-5 w-5" aria-hidden />
      </a>
      <a
        href={getWhatsAppLink(site.whatsapp, waText)}
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
