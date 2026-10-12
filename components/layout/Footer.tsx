"use client";

import Link from "@/components/LocaleLink";
import { LazyLiquidMark } from "@/components/fx/Lazy";
import { Phone, Mail, MessageCircle, MapPin, ChevronDown } from "lucide-react";
import { site } from "@/content/site";
import { getWhatsAppLink } from "@/lib/utils";
import { categories } from "@/content/products";
import { T, useT } from "@/lib/i18n";
import { catNameHi } from "@/content/hi/names";
import { siteHi } from "@/content/hi/site";
import { ShopStatus } from "@/components/visit/VisitUs";
import { ClickTracker } from "@/components/conversion/ClickTracker";

const usefulLinks = [
  { href: "/products", en: "All products", hi: "सभी उत्पाद" },
  { href: "/brands", en: "Brands", hi: "ब्रांड" },
  { href: "/contact", en: "Get a quote", hi: "कोटेशन पाएँ" },
  { href: "/catalog", en: "Catalog", hi: "कैटलॉग" },
  { href: "/indore", en: "Products in Indore", hi: "इंदौर में उत्पाद" },
  { href: "/services", en: "Services", hi: "सेवाएँ" },
  { href: "/about", en: "About us", hi: "हमारे बारे में" },
  { href: "/blog", en: "Blog", hi: "ब्लॉग" },
];

const linkCls =
  "inline-flex min-h-[40px] min-w-[24px] items-center text-[15px] text-white/80 transition-colors hover:text-primary lg:min-h-[34px]";


const groupHead = "font-display text-xl font-extrabold uppercase tracking-wide text-white";

/** Phones: a closed <details> (links stay in the DOM). sm and up: a plain heading with the list always visible. */
function FooterGroup({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <nav aria-label={label} className={className}>
      <details className="group border-t border-white/15 sm:hidden">
        <summary className={groupHead + " flex min-h-[48px] cursor-pointer list-none items-center justify-between [&::-webkit-details-marker]:hidden"}>
          {label}
          <ChevronDown className="h-5 w-5 text-white/60 transition-transform group-open:rotate-180" aria-hidden />
        </summary>
        <div className="pb-2">{children}</div>
      </details>
      <div className="hidden sm:block">
        <h3 className={groupHead}>{label}</h3>
        <div className="mt-2">{children}</div>
      </div>
    </nav>
  );
}

const tel = (n: string) => `tel:${n.replace(/\s/g, "")}`;
const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.fullAddress)}`;

export function Footer() {
  const t = useT();
  const hi = t("en", "hi") === "hi";
  return (
    <footer data-track="footer" className="border-t border-white/15 bg-nav pb-[calc(4.75rem+env(safe-area-inset-bottom,0px))] print:hidden md:pb-0">
      <ClickTracker />
      <div className="page-container py-7 md:py-11">
        <div className="grid gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-[1.2fr_0.65fr_1.15fr_1.1fr] lg:gap-10">
          {/* Business identity */}
          <div className="min-w-0 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block" aria-label={t("HM Ibrahim & Co, home", "एचएम इब्राहिम एंड कंपनी, होम")}>
              <LazyLiquidMark width={176} />
            </Link>
            <p className="mt-2 hidden max-w-xs text-sm leading-snug text-white/80 sm:block sm:text-[15px] sm:leading-relaxed">
              <T en="Iron and hardware trading in Siyaganj, Indore. Retail and wholesale since 1939." hi="सियागंज, इंदौर में लोहा और हार्डवेयर का व्यापार। रिटेल और थोक, 1939 से।" />
            </p>
            <address data-track="footer_visit" className="mt-3 flex items-start gap-3 not-italic">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <span className="min-w-0 text-sm leading-snug text-white/85 sm:text-[15px] sm:leading-relaxed">
                {hi
                  ? `${siteHi.address.line1}, ${siteHi.address.line2}, ${siteHi.address.city} ${siteHi.address.pincode}`
                  : `${site.address.line1}, ${site.address.line2}, ${site.address.city} ${site.address.pincode}`}
                <span className="flex flex-wrap items-center gap-x-4">
                  <ShopStatus tone="dark" className="mt-0.5 !text-sm" />
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-track="footer_visit_map"
                  className="inline-flex min-h-[40px] items-center font-semibold text-white underline decoration-primary underline-offset-4 hover:text-primary lg:min-h-0"
                >
                  <T en="Open in Google Maps" hi="गूगल मैप्स पर खोलें" />
                  <span className="sr-only"> {t("(opens in a new tab)", "(नए टैब में खुलेगा)")}</span>
                </a>
                </span>
              </span>
            </address>
          </div>

          {/* Contact and location: second on mobile (right after the logo); last column on desktop */}
          <div className="lg:order-4">
            <h3 className="font-display text-xl font-extrabold uppercase tracking-wide text-white"><T en="Contact" hi="संपर्क" /></h3>
            <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-0 text-[15px] text-white/85 sm:grid-cols-1 sm:gap-y-3 sm:space-y-0">
              {[
                { n: site.phone, l: hi ? siteHi.phoneLabel : site.phoneLabel },
                { n: String(site.phoneAlt), l: hi ? siteHi.phoneAltLabel : site.phoneAltLabel },
              ].map((p) => (
                <li key={p.n} className="flex items-start gap-3">
                  <Phone className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden />
                  <a href={tel(p.n)} className="block min-h-[40px] hover:text-primary lg:min-h-0">
                    <span className="block whitespace-nowrap text-base font-semibold text-white">{p.n}</span>
                    <span className="block text-xs text-white/60 sm:text-sm">{p.l}</span>
                  </a>
                </li>
              ))}
              <li className="col-span-2 flex items-start gap-3 sm:col-span-1">
                <MessageCircle className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden />
                <a href={getWhatsAppLink(site.whatsapp)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center font-semibold text-white hover:text-primary lg:min-h-0">
                  <T en="WhatsApp us" hi="व्हाट्सएप करें" />
                </a>
              </li>
              {[
                { e: site.email, l: hi ? siteHi.emailLabel : site.emailLabel },
                { e: site.emailAlt, l: hi ? siteHi.emailAltLabel : site.emailAltLabel },
              ].map((m) => (
                <li key={m.e} className="col-span-2 flex items-start gap-3 sm:col-span-1 [&:last-child]:hidden sm:[&:last-child]:flex">
                  <Mail className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden />
                  <a href={`mailto:${m.e}`} className="block min-h-[40px] min-w-0 hover:text-primary lg:min-h-0">
                    <span className="block break-words text-[15px] text-white">{m.e}</span>
                    <span className="hidden text-sm text-white/60 sm:block">{m.l}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful links and categories: one-tap sections on phones, open columns from sm up */}
          <FooterGroup label={t("Useful links", "काम के लिंक")}>
            <ul className="grid grid-cols-2 gap-x-4 sm:grid-cols-1">
              {usefulLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkCls}><T en={l.en} hi={l.hi} /></Link>
                </li>
              ))}
            </ul>
          </FooterGroup>

          <FooterGroup label={t("Product categories", "उत्पाद श्रेणियाँ")} className="sm:col-span-2 lg:col-span-1">
            <ul className="grid grid-cols-2 gap-x-4 sm:grid-cols-3 lg:grid-cols-2">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/categories/${c.slug}`} className={linkCls}>{hi ? catNameHi[c.slug] ?? c.name : c.name}</Link>
                </li>
              ))}
            </ul>
          </FooterGroup>
        </div>

        <div className="mt-5 flex flex-col gap-1 border-t border-white/15 pt-4 text-sm text-white/70 md:mt-8 md:flex-row md:items-center md:justify-between md:gap-3 md:pt-5">
          <p>&copy; {new Date().getFullYear()} <T en="HM Ibrahim & Co. All rights reserved." hi="एचएम इब्राहिम एंड कंपनी। सर्वाधिकार सुरक्षित।" /></p>
          <ul className="flex flex-wrap gap-x-5">
            <li>
              <a href={site.indiamartUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[40px] min-w-[24px] items-center hover:text-primary lg:min-h-0">IndiaMART</a>
            </li>
            <li>
              <a href={site.justdialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[40px] min-w-[24px] items-center hover:text-primary lg:min-h-0">JustDial</a>
            </li>
            <li><Link href="/privacy" className="inline-flex min-h-[40px] min-w-[24px] items-center hover:text-primary lg:min-h-0"><T en="Privacy" hi="गोपनीयता" /></Link></li>
            <li><Link href="/terms" className="inline-flex min-h-[40px] min-w-[24px] items-center hover:text-primary lg:min-h-0"><T en="Terms" hi="शर्तें" /></Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
