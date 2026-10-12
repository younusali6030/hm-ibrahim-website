"use client";

import Link from "@/components/LocaleLink";
import { LazyLiquidMark } from "@/components/fx/Lazy";
import { Phone, Mail, MessageCircle, MapPin } from "lucide-react";
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
  "inline-flex min-h-[44px] items-center text-[15px] text-white/80 transition-colors hover:text-primary lg:min-h-[36px]";

const tel = (n: string) => `tel:${n.replace(/\s/g, "")}`;
const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.fullAddress)}`;

export function Footer() {
  const t = useT();
  const hi = t("en", "hi") === "hi";
  return (
    <footer data-track="footer" className="border-t border-white/15 bg-nav pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] print:hidden md:pb-0">
      <ClickTracker />
      <div className="page-container py-9 md:py-11">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.65fr_1.15fr_1.1fr] lg:gap-10">
          {/* Business identity */}
          <div className="min-w-0 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block" aria-label={t("HM Ibrahim & Co, home", "एचएम इब्राहिम एंड कंपनी, होम")}>
              <LazyLiquidMark width={240} />
            </Link>
            <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-white/80">
              <T en="Iron and hardware trading in Siyaganj, Indore. Retail and wholesale since 1939." hi="सियागंज, इंदौर में लोहा और हार्डवेयर का व्यापार। रिटेल और थोक, 1939 से।" />
            </p>
            <address data-track="footer_visit" className="mt-5 flex items-start gap-3 not-italic">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <span className="min-w-0 text-[15px] leading-relaxed text-white/85">
                {hi
                  ? `${siteHi.address.line1}, ${siteHi.address.line2}, ${siteHi.address.city} ${siteHi.address.pincode}`
                  : `${site.address.line1}, ${site.address.line2}, ${site.address.city} ${site.address.pincode}`}
                <ShopStatus tone="dark" className="mt-1 !text-sm" />
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-track="footer_visit_map"
                  className="mt-1 inline-flex min-h-[44px] items-center font-semibold text-white underline decoration-primary underline-offset-4 hover:text-primary lg:min-h-0"
                >
                  <T en="Open in Google Maps" hi="गूगल मैप्स पर खोलें" />
                  <span className="sr-only"> {t("(opens in a new tab)", "(नए टैब में खुलेगा)")}</span>
                </a>
              </span>
            </address>
          </div>

          {/* Contact and location: second on mobile (right after the logo); last column on desktop */}
          <div className="lg:order-4">
            <h3 className="font-display text-xl font-extrabold uppercase tracking-wide text-white"><T en="Contact" hi="संपर्क" /></h3>
            <ul className="mt-3 space-y-3 text-[15px] text-white/85">
              {[
                { n: site.phone, l: hi ? siteHi.phoneLabel : site.phoneLabel },
                { n: String(site.phoneAlt), l: hi ? siteHi.phoneAltLabel : site.phoneAltLabel },
              ].map((p) => (
                <li key={p.n} className="flex items-start gap-3">
                  <Phone className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden />
                  <a href={tel(p.n)} className="block min-h-[44px] hover:text-primary lg:min-h-0">
                    <span className="block whitespace-nowrap text-base font-semibold text-white">{p.n}</span>
                    <span className="block text-sm text-white/60">{p.l}</span>
                  </a>
                </li>
              ))}
              <li className="flex items-start gap-3">
                <MessageCircle className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden />
                <a href={getWhatsAppLink(site.whatsapp)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center font-semibold text-white hover:text-primary lg:min-h-0">
                  <T en="WhatsApp us" hi="व्हाट्सएप करें" />
                </a>
              </li>
              {[
                { e: site.email, l: hi ? siteHi.emailLabel : site.emailLabel },
                { e: site.emailAlt, l: hi ? siteHi.emailAltLabel : site.emailAltLabel },
              ].map((m) => (
                <li key={m.e} className="flex items-start gap-3">
                  <Mail className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden />
                  <a href={`mailto:${m.e}`} className="block min-h-[44px] min-w-0 hover:text-primary lg:min-h-0">
                    <span className="block break-words text-[15px] text-white">{m.e}</span>
                    <span className="block text-sm text-white/60">{m.l}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful links */}
          <nav aria-label={t("Useful links", "काम के लिंक")}>
            <h3 className="font-display text-xl font-extrabold uppercase tracking-wide text-white"><T en="Useful links" hi="काम के लिंक" /></h3>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 sm:grid-cols-1">
              {usefulLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkCls}><T en={l.en} hi={l.hi} /></Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Product categories */}
          <nav aria-label={t("Product categories", "उत्पाद श्रेणियाँ")} className="sm:col-span-2 lg:col-span-1">
            <h3 className="font-display text-xl font-extrabold uppercase tracking-wide text-white"><T en="Product categories" hi="उत्पाद श्रेणियाँ" /></h3>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 sm:grid-cols-3 lg:grid-cols-2">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/products?category=${c.slug}`} className={linkCls}>{hi ? catNameHi[c.slug] ?? c.name : c.name}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/15 pt-5 text-sm text-white/70 md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} <T en="HM Ibrahim & Co. All rights reserved." hi="एचएम इब्राहिम एंड कंपनी। सर्वाधिकार सुरक्षित।" /></p>
          <ul className="flex flex-wrap gap-x-5">
            <li>
              <a href={site.indiamartUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center hover:text-primary lg:min-h-0">IndiaMART</a>
            </li>
            <li>
              <a href={site.justdialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center hover:text-primary lg:min-h-0">JustDial</a>
            </li>
            <li><Link href="/privacy" className="inline-flex min-h-[44px] items-center hover:text-primary lg:min-h-0"><T en="Privacy" hi="गोपनीयता" /></Link></li>
            <li><Link href="/terms" className="inline-flex min-h-[44px] items-center hover:text-primary lg:min-h-0"><T en="Terms" hi="शर्तें" /></Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
