import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { site } from "@/content/site";
import { getWhatsAppLink } from "@/lib/utils";

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
  { href: "/services", label: "Services" },
  { href: "/quote", label: "Request Quote" },
  { href: "/contact", label: "Contact" },
  { href: "/catalog", label: "Download Catalog" },
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

export function Footer() {
  return (
    <footer className="border-t border-border bg-card print:hidden">
      <div className="container mx-auto px-4 md:px-6 py-12 max-w-7xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div>
            <p className="text-lg font-semibold text-foreground">
              <span className="text-primary">HM</span> Ibrahim & Co
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{site.tagline}</p>
            <p className="mt-2 text-sm text-muted-foreground">{site.description}</p>
            <p className="mt-2 text-sm text-muted-foreground">{site.manufacturerTagline}</p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground">Quick links</h3>
            <ul className="mt-3 space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground">Contact</h3>
            <ul className="mt-3 space-y-3 text-sm text-muted-foreground">
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
                  {site.phoneLabel && <span className="text-muted-foreground/80">({site.phoneLabel})</span>}
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
                    {site.phoneAltLabel && <span className="text-muted-foreground/80">({site.phoneAltLabel})</span>}
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
                  {site.emailLabel && <span className="text-muted-foreground/80">({site.emailLabel})</span>}
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
                    {site.emailAltLabel && <span className="text-muted-foreground/80">({site.emailAltLabel})</span>}
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
            <h3 className="font-semibold text-foreground">Products in Indore</h3>
            <ul className="mt-3 space-y-2">
              {indoreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground">Location & areas served</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Siyaganj, Indore — {site.landmark}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
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
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} HM Ibrahim & Co. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
