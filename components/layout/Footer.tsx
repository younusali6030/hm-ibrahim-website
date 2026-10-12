"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { site } from "@/content/site";
import { getWhatsAppLink } from "@/lib/utils";
import { categories } from "@/content/products";

const usefulLinks = [
  { href: "/products", label: "All products" },
  { href: "/brands", label: "Brands" },
  { href: "/contact", label: "Get a quote" },
  { href: "/catalog", label: "Catalog" },
  { href: "/indore", label: "Products in Indore" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About us" },
  { href: "/blog", label: "Blog" },
];

const linkCls =
  "inline-flex min-h-[44px] items-center text-[15px] text-white/80 transition-colors hover:text-primary lg:min-h-[36px]";

const tel = (n: string) => `tel:${n.replace(/\s/g, "")}`;

export function Footer() {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.fullAddress)}`;

  return (
    <footer className="border-t border-white/15 bg-nav pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] print:hidden md:pb-0">
      <div className="page-container py-10 md:py-14">
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
            <h3 className="font-display text-xl font-extrabold uppercase tracking-wide text-white">Contact &amp; location</h3>
            <ul className="mt-4 space-y-4 text-[15px] text-white/85">
              <li className="flex items-start gap-3">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden />
                <span>
                  {site.address.line1}, {site.address.line2}, {site.address.city}, {site.address.state} {site.address.pincode}
                  <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-1 block min-h-[44px] py-2 font-semibold text-primary hover:underline lg:min-h-0 lg:py-0">
                    Get directions
                  </a>
                </span>
              </li>
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
                  WhatsApp us
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
              <li className="flex items-start gap-3">
                <Clock className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden />
                <span>
                  {site.hours.weekdays}
                  <br />
                  {site.hours.sunday}
                </span>
              </li>
            </ul>
          </div>

          {/* Useful links */}
          <nav aria-label="Useful links">
            <h3 className="font-display text-xl font-extrabold uppercase tracking-wide text-white">Useful links</h3>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 sm:grid-cols-1">
              {usefulLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkCls}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Product categories */}
          <nav aria-label="Product categories" className="sm:col-span-2 lg:col-span-1">
            <h3 className="font-display text-xl font-extrabold uppercase tracking-wide text-white">Product categories</h3>
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
