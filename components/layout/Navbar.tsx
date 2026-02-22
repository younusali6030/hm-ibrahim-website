"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { site } from "@/content/site";
import { getWhatsAppLink } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { trackCallClick, trackWhatsAppClick } from "@/lib/analytics";

// Order: Home, then high-value (Products, Quote, Contact), then supporting (About, Indore, Services)
const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/quote", label: "Request Quote" },
  { href: "/contact", label: "Contact" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/indore", label: "Indore" },
  { href: "/services", label: "Services" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-nav backdrop-blur print:hidden supports-[backdrop-filter]:bg-nav/95">
      <nav className="page-container flex h-14 md:h-16 items-center justify-between" aria-label="Main navigation">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-white text-sm sm:text-base min-h-[44px] items-center"
          onClick={() => setOpen(false)}
        >
          <span className="text-primary">HM</span> Ibrahim & Co
        </Link>

        <ul className="hidden md:flex md:items-center md:gap-6">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors text-white/90 hover:text-primary",
                  pathname === link.href && "text-primary"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex md:items-center md:gap-2">
          <Button asChild size="sm" className="bg-white text-gray-900 hover:bg-gray-100 border-0 font-semibold">
            <a
              href={`tel:${site.phone.replace(/\s/g, "")}`}
              onClick={() => trackCallClick("navbar")}
              aria-label="Call us"
            >
              Call
            </a>
          </Button>
          <Button asChild size="sm" className="bg-primary text-gray-900 hover:bg-primary/90 font-semibold">
            <a
              href={getWhatsAppLink(site.whatsapp, "Hi, I'm interested in your products. Please share price/availability.")}
              onClick={() => trackWhatsAppClick("navbar")}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp us"
            >
              WhatsApp
            </a>
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden flex items-center justify-center min-h-[44px] min-w-[44px] text-white hover:bg-white/10 hover:text-white rounded-md"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-nav-menu"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-6 w-6" aria-hidden /> : <Menu className="h-6 w-6" aria-hidden />}
        </Button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav-menu"
            role="dialog"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-white/20 bg-nav md:hidden overflow-hidden"
          >
            <ul className="flex flex-col gap-0 px-4 py-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "block rounded-md px-3 py-3 text-sm font-medium min-h-[44px] flex items-center text-white/90 hover:bg-white/10 hover:text-white",
                      pathname === link.href && "bg-white/15 text-primary"
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="mt-2 flex gap-2 pt-2 border-t border-white/20">
                <Button asChild className="flex-1 min-h-[44px] bg-white text-gray-900 hover:bg-gray-100 font-semibold" size="sm">
                  <a href={`tel:${site.phone.replace(/\s/g, "")}`} onClick={() => trackCallClick("navbar_mobile")} className="flex items-center justify-center">Call</a>
                </Button>
                <Button asChild className="flex-1 min-h-[44px] bg-primary text-gray-900 hover:bg-primary/90 font-semibold" size="sm">
                  <a
                    href={getWhatsAppLink(site.whatsapp, "Hi, I'm interested in your products. Please share price/availability.")}
                    onClick={() => trackWhatsAppClick("navbar_mobile")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center"
                  >
                    WhatsApp
                  </a>
                </Button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
