"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { site } from "@/content/site";
import { getWhatsAppLink } from "@/lib/utils";
import { categories } from "@/content/products";

// High-value links first: Products, Quote, Contact; then supporting pages
const footerLinks = [
  { href: "/products", label: "Browse all products" },
  { href: "/quote", label: "Request a quote" },
  { href: "/contact", label: "Contact us" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About us" },
  { href: "/indore", label: "Products in Indore" },
  { href: "/services", label: "Services" },
  { href: "/catalog", label: "Download catalog" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

const indoreLinks = [
  { href: "/indore/wire-mesh", label: "Wire Mesh Indore" },
  { href: "/indore/chain-link-fencing-jaali", label: "Chain Link & Jaali Indore" },
  { href: "/indore/barbed-wire", label: "Barbed Wire Indore" },
  { href: "/indore/perforated-sheets", label: "Perforated Sheets Indore" },
  { href: "/indore/gi-wire", label: "GI Wire Indore" },
  { href: "/indore/construction-hardware", label: "Construction Hardware Indore" },
];

// Link to filtered products (1 click to products) + category SEO page for crawlers
const categoryLinks = categories.map((c) => ({
  href: `/products?category=${c.slug}`,
  label: c.name,
}));

export function Footer() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <footer className="border-t border-white/20 bg-nav print:hidden">
      <div className="page-container section-padding">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <div className="min-w-0">
            {isHome ? (
              <p className="text-base sm:text-lg font-semibold text-white">
                <span className="text-primary">HM</span> Ibrahim & Co
              </p>
            ) : (
              <Link href="/" className="inline-block">
                <Image src="/logo-transparent.png" alt="HM Ibrahim & Co" width={220} height={76} className="h-14 w-auto object-contain" />
              </Link>
            )}
            <p className="mt-2 text-sm text-white/80">{site.tagline}</p>
            <p className="mt-2 text-sm text-white/80">{site.description}</p>
            <p className="mt-2 text-sm text-white/80">{site.manufacturerTagline}</p>
          </div>

          <div>
            <h3 className="font-semibold text-white">Quick links</h3>
            <ul className="mt-3 space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block py-1.5 text-sm text-white/80 hover:text-primary min-h-[44px] sm:min-h-0 sm:py-0 flex items-center"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white">Contact</h3>
            <ul className="mt-3 space-y-3 text-sm text-white/80">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                  <span>{site.fullAddress}</span>
              </li>
              <li>
                <a
                  href={`tel:${site.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-2 hover:text-primary min-h-[44px] items-center"
                >
                  <Phone className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                  {site.phone}
                  {site.phoneLabel && <span className="text-white/60">({site.phoneLabel})</span>}
                </a>
              </li>
              {site.phoneAlt && (
                <li>
                  <a
                    href={`tel:${String(site.phoneAlt).replace(/\s/g, "")}`}
                    className="flex items-center gap-2 hover:text-primary min-h-[44px] items-center"
                  >
                    <Phone className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                    {site.phoneAlt}
                    {site.phoneAltLabel && <span className="text-white/60">({site.phoneAltLabel})</span>}
                  </a>
                </li>
              )}
              <li>
                <a
                  href={getWhatsAppLink(site.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-primary min-h-[44px] items-center"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="flex items-center gap-2 hover:text-primary min-h-[44px] items-center break-all"
                >
                  <Mail className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                  {site.email}
                  {site.emailLabel && <span className="text-white/60">({site.emailLabel})</span>}
                </a>
              </li>
              {site.emailAlt && (
                <li>
                  <a
                    href={`mailto:${site.emailAlt}`}
                    className="flex items-center gap-2 hover:text-primary min-h-[44px] items-center break-all"
                  >
                    <Mail className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                  {site.emailAlt}
                  {site.emailAltLabel && <span className="text-white/60">({site.emailAltLabel})</span>}
                  </a>
                </li>
              )}
              <li className="flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                <span>
                  {site.hours.weekdays}
                  <br />
                  {site.hours.sunday}
                  <br />
                  {site.hours.note}
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white">Categories</h3>
            <ul className="mt-3 space-y-0">
              {categoryLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block py-1.5 text-sm text-white/80 hover:text-primary min-h-[44px] sm:min-h-0 sm:py-0 flex items-center"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white">Products in Indore</h3>
            <ul className="mt-3 space-y-0">
              {indoreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block py-1.5 text-sm text-white/80 hover:text-primary min-h-[44px] sm:min-h-0 sm:py-0 flex items-center"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white">Location & areas served</h3>
            <p className="mt-2 text-sm text-white/80">
              Siyaganj, Indore — {site.landmark}
            </p>
            <p className="mt-1 text-sm text-white/80">
              We serve {site.areasServed.join(", ")}.
            </p>
            <Link
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.fullAddress)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm text-primary hover:underline"
            >
              Get directions →
            </Link>
            {"indiamartUrl" in site && site.indiamartUrl && (
              <a
                href={site.indiamartUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block text-sm text-primary hover:underline"
              >
                Contact us on IndiaMART →
              </a>
            )}
            {"justdialUrl" in site && site.justdialUrl && (
              <a
                href={site.justdialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block text-sm text-primary hover:underline"
              >
                Contact us on JustDial →
              </a>
            )}
          </div>
        </div>

        <div className="mt-10 border-t border-white/20 pt-8 text-center text-sm text-white/70">
          <p>© {new Date().getFullYear()} HM Ibrahim & Co. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
