"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
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

  // While the menu is open: lock page scroll and tuck the sticky quote bar away.
  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open);
    return () => document.documentElement.classList.remove("menu-open");
  }, [open]);

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

  return (
    <>
      {!isHome && <div aria-hidden="true" className="h-16 md:h-[72px] print:hidden" />}
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[transform,background-color,backdrop-filter,border-color] duration-500 ease-out print:hidden",
          hidden ? "-translate-y-full" : "translate-y-0",
          open
            ? "border-b border-white/10 bg-[#070d14]/95 backdrop-blur-xl"
            : scrolled || !isHome
            ? "border-b border-white/10 bg-[#070d14]/70 backdrop-blur-xl backdrop-saturate-150"
            : "border-b border-transparent bg-gradient-to-b from-black/55 to-transparent"
        )}
      >
        <div className="relative mx-auto max-w-[1280px]">
          <nav
            className="flex h-16 items-center justify-between px-4 md:h-[72px] md:px-6"
            aria-label="Main navigation"
          >
            <Link
              href="/"
              className="group flex min-h-[44px] items-center gap-2.5 text-white"
              onClick={() => setOpen(false)}
              aria-label="H M Ibrahim and Co, home"
            >
              <Image
                src="/logo-wordmark.png"
                alt="H M Ibrahim & Co, since 1939"
                width={900}
                height={258}
                priority
                className="h-11 w-auto md:h-12"
              />
            </Link>

            <ul className="hidden md:flex md:items-center md:gap-6">
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
                          "absolute inset-x-0 -bottom-0.5 h-[2px] origin-left rounded-full bg-primary transition-transform duration-300",
                          on ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="hidden md:flex md:items-center md:gap-2">
              <a
                href={`tel:${site.phone.replace(/\s/g, "")}`}
                onClick={() => trackCallClick("navbar")}
                aria-label="Call us"
                className="inline-flex h-10 items-center rounded-full px-4 text-sm font-semibold text-white/90 transition hover:bg-white/10"
              >
                Call
              </a>
              <Link
                href="/contact"
                className="inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground transition hover:brightness-110"
              >
                Get a quote
              </Link>
            </div>

            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full text-white transition hover:bg-white/10 md:hidden"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-controls="mobile-nav-menu"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              {open ? <X className="h-6 w-6" aria-hidden /> : <Menu className="h-6 w-6" aria-hidden />}
            </button>
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
                transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
                className="overflow-hidden px-2 pb-3 md:hidden"
              >
                <ul className="flex flex-col px-2 pb-1 pt-1">
                  {navLinks.map((link, i) => {
                    const on = pathname === link.href || pathname.startsWith(link.href + "/");
                    return (
                      <motion.li
                        key={link.href}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.03 * i + 0.04 }}
                      >
                        <Link
                          href={link.href}
                          className={cn(
                            "flex h-12 items-center justify-between border-b border-white/[0.07] px-2 text-[15px] font-semibold uppercase tracking-[0.1em] text-white/85 transition hover:text-white",
                            on && "text-primary"
                          )}
                          onClick={() => setOpen(false)}
                        >
                          {link.label}
                          <span aria-hidden="true" className="text-white/30">›</span>
                        </Link>
                      </motion.li>
                    );
                  })}
                  <li className="mt-3 grid grid-cols-2 gap-2">
                    <a
                      href={`tel:${site.phone.replace(/\s/g, "")}`}
                      onClick={() => trackCallClick("navbar_mobile")}
                      className="flex h-11 items-center justify-center rounded-full border border-white/15 text-sm font-semibold"
                    >
                      Call
                    </a>
                    <a
                      href={getWhatsAppLink(site.whatsapp, "Hi, I'm interested in your products. Please share price/availability.")}
                      onClick={() => trackWhatsAppClick("navbar_mobile")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-11 items-center justify-center rounded-full border border-white/15 text-sm font-semibold"
                    >
                      WhatsApp
                    </a>
                  </li>
                  <li className="mt-2">
                    <Link
                      href="/contact"
                      onClick={() => setOpen(false)}
                      className="flex h-11 w-full items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground"
                    >
                      Get a quote
                    </Link>
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
    </>
  );
}
