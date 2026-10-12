"use client";

import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MessageCircle } from "lucide-react";
import { site } from "@/content/site";
import { getWhatsAppLink } from "@/lib/utils";
import { categories } from "@/content/products";
import { T } from "@/lib/i18n";
import { VisitUs } from "@/components/visit/VisitUs";
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

export function Footer() {
  return (
    <footer data-track="footer" className="border-t border-white/15 bg-nav pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] print:hidden md:pb-0">
      <ClickTracker />
      <div className="page-container py-10 md:py-14">
        <VisitUs variant="strip" source="footer_visit" className="mb-10" />
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.1fr_0.8fr_0.9fr_1.4fr] lg:gap-10">
          {/* Business identity */}
          <div className="min-w-0 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block" aria-label="HM Ibrahim & Co, home">
              <Image src="/logo-wordmark.png" alt="HM Ibrahim & Co, since 1939" width={900} height={258} className="h-14 w-auto" />
            </Link>
            <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-white/80">
              Iron and hardware trading in Siyaganj, Indore. Retail and wholesale since 1939.
            </p>
          </div>

          {/* Contact and location: second on mobile (right after the logo); last column on desktop */}
          <div className="lg:order-4">
            <h3 className="font-display text-xl font-extrabold uppercase tracking-wide text-white"><T en="Contact" hi="संपर्क" /></h3>
            <ul className="mt-4 space-y-4 text-[15px] text-white/85">
              {[
                { n: site.phone, l: site.phoneLabel },
                { n: String(site.phoneAlt), l: site.phoneAltLabel },
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
                { e: site.email, l: site.emailLabel },
                { e: site.emailAlt, l: site.emailAltLabel },
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
          <nav aria-label="Useful links">
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
          <nav aria-label="Product categories" className="sm:col-span-2 lg:col-span-1">
            <h3 className="font-display text-xl font-extrabold uppercase tracking-wide text-white"><T en="Product categories" hi="उत्पाद श्रेणियाँ" /></h3>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 sm:grid-cols-3 lg:grid-cols-1">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/products?category=${c.slug}`} className={linkCls}>{c.name}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/15 pt-6 text-sm text-white/70 md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} HM Ibrahim &amp; Co. All rights reserved.</p>
          <ul className="flex flex-wrap gap-x-5">
            <li>
              <a href={site.indiamartUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center hover:text-primary lg:min-h-0">IndiaMART</a>
            </li>
            <li>
              <a href={site.justdialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center hover:text-primary lg:min-h-0">JustDial</a>
            </li>
            <li><Link href="/privacy" className="inline-flex min-h-[44px] items-center hover:text-primary lg:min-h-0">Privacy</Link></li>
            <li><Link href="/terms" className="inline-flex min-h-[44px] items-center hover:text-primary lg:min-h-0">Terms</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
