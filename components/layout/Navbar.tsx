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

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
  { href: "/services", label: "Services" },
  { href: "/quote", label: "Request Quote" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur print:hidden supports-[backdrop-filter]:bg-background/80">
      <nav className="container mx-auto flex h-14 md:h-16 items-center justify-between px-4 md:px-6 max-w-7xl" aria-label="Main navigation">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-foreground"
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
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === link.href ? "text-primary" : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex md:items-center md:gap-2">
          <Button asChild size="sm" variant="outline">
            <a
              href={`tel:${site.phone.replace(/\s/g, "")}`}
              aria-label="Call us"
            >
              Call
            </a>
          </Button>
          <Button asChild size="sm">
            <a
              href={getWhatsAppLink(site.whatsapp, "Hi, I'm interested in your products. Please share price/availability.")}
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
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-border bg-card md:hidden overflow-hidden"
          >
            <ul className="flex flex-col gap-0 px-4 py-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "block rounded-md px-3 py-3 text-sm font-medium min-h-[44px] flex items-center",
                      pathname === link.href
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="mt-2 flex gap-2 pt-2 border-t border-border">
                <Button asChild className="flex-1 min-h-[44px]" size="sm" variant="outline">
                  <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="flex items-center justify-center">Call</a>
                </Button>
                <Button asChild className="flex-1 min-h-[44px]" size="sm">
                  <a
                    href={getWhatsAppLink(site.whatsapp, "Hi, I'm interested in your products. Please share price/availability.")}
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
