"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { site } from "@/content/site";
import { getWhatsAppLink } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { trackCallClick, trackWhatsAppClick } from "@/lib/analytics";

// One contact path: the primary "Get a quote" button leads to /contact (quote form + visit info).
const navLinks = [
  { href: "/products", label: "Products" },
  { href: "/brands", label: "Brands" },
  { href: "/about", label: "About" },
  { href: "/indore", label: "Indore" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Blog" },
];

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const barRef = useRef<HTMLSpanElement>(null);
  const openRef = useRef(false);
  openRef.current = open;

  // Scroll behaviour: transparent over the hero, glass once you move, tucks away on the way down, returns on the way up.
  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const tick = () => {
      raf = 0;
      const y = window.scrollY;
      setScrolled(y > 24);
      const dy = y - last;
      if (Math.abs(dy) > 6) {
        setHidden(dy > 0 && y > 480 && !openRef.current);
        last = y;
      }
      if (y < 40) setHidden(false);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (barRef.current) barRef.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pathname]);

  const solid = scrolled || !isHome || open;

  return (
    <>
      {!isHome && <div aria-hidden="true" className="h-16 md:h-20 print:hidden" />}
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 print:hidden transition-[transform,background-color,box-shadow,backdrop-filter] duration-500 ease-out",
          hidden ? "-translate-y-full" : "translate-y-0",
          solid
            ? "bg-[#070d14]/80 shadow-[0_10px_40px_-18px_rgba(0,0,0,0.7)] backdrop-blur-xl backdrop-saturate-150"
            : "bg-gradient-to-b from-black/70 via-black/30 to-transparent"
        )}
      >
        <nav
          className={cn(
            "page-container flex items-center justify-between transition-[height] duration-500 ease-out",
            scrolled ? "h-14" : "h-16 md:h-20"
          )}
          aria-label="Main navigation"
        >
          <Link
            href="/"
            className="group flex min-h-[44px] items-center gap-2.5 text-white"
            onClick={() => setOpen(false)}
            aria-label="H M Ibrahim and Co, home"
          >
            <span
              className={cn(
                "flex items-center justify-center rounded-[3px] bg-primary font-display font-extrabold leading-none text-primary-foreground transition-all duration-500",
                scrolled ? "h-8 w-8 text-base" : "h-9 w-9 text-lg md:h-10 md:w-10 md:text-xl"
              )}
            >
              HM
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-lg font-extrabold uppercase tracking-wide sm:text-xl">Ibrahim &amp; Co</span>
              <span
                className={cn(
                  "font-mono-brand text-[10px] uppercase tracking-[0.2em] text-white/60 transition-all duration-500",
                  scrolled ? "max-h-0 opacity-0" : "mt-1 max-h-4 opacity-100"
                )}
              >
                Siyaganj, Indore · 1939
              </span>
            </span>
          </Link>

          <ul className="hidden md:flex md:items-center md:gap-7">
            {navLinks.map((link) => {
              const on = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "group relative py-2 text-[13px] font-semibold uppercase tracking-[0.12em] transition-colors",
                      on ? "text-white" : "text-white/75 hover:text-white"
                    )}
                  >
                    {link.label}
                    <span
                      className={cn(
                        "absolute inset-x-0 -bottom-0.5 h-[2px] origin-left bg-primary transition-transform duration-300",
                        on ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

        <div className="hidden md:flex md:items-center md:gap-2">
          <Button asChild size="sm" className="bg-primary text-primary-foreground hover:brightness-110 border-0 font-bold">
            <Link href="/contact">Get a quote</Link>
          </Button>
          <Button asChild size="sm" className="bg-white text-gray-900 hover:bg-gray-100 border-0 font-semibold">
            <a
              href={`tel:${site.phone.replace(/\s/g, "")}`}
              onClick={() => trackCallClick("navbar")}
              aria-label="Call us"
            >
              Call
            </a>
          </Button>
          <Button asChild size="sm" className="bg-white/10 text-white hover:bg-white/20 border border-white/30 font-semibold">
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
        <span
          ref={barRef}
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-left bg-primary transition-opacity duration-300",
            scrolled ? "opacity-100" : "opacity-0"
          )}
        />

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
              <li className="mt-2 pt-2 border-t border-white/20">
                <Button asChild className="w-full min-h-[48px] bg-primary text-primary-foreground hover:brightness-110 font-bold" size="sm">
                  <Link href="/contact" onClick={() => setOpen(false)}>Get a quote</Link>
                </Button>
              </li>
              <li className="mt-2 flex gap-2">
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
    </>
  );
}
