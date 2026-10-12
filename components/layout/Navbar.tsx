"use client";

import Link from "@/components/LocaleLink";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { site } from "@/content/site";
import { getWhatsAppLink } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { trackCallClick, trackWhatsAppClick } from "@/lib/analytics";
import { LangToggle, T, useT } from "@/lib/i18n";
import { stripLocale } from "@/lib/locale";

// One contact path: the primary "Get a quote" button leads to /contact (quote form + visit info).
const navLinks = [
  { href: "/products", en: "Products", hi: "उत्पाद" },
  { href: "/brands", en: "Brands", hi: "ब्रांड" },
  { href: "/about", en: "About", hi: "हमारे बारे में" },
  { href: "/indore", en: "Indore", hi: "इंदौर" },
  { href: "/services", en: "Services", hi: "सेवाएँ" },
  { href: "/blog", en: "Blog", hi: "ब्लॉग" },
];

export function Navbar() {
  const pathname = stripLocale(usePathname() || "/").path;
  const t = useT();
  const isHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const barRef = useRef<HTMLSpanElement>(null);
  const openRef = useRef(false);
  openRef.current = open;

  // Escape closes the open menu and hands focus back to the toggle.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      document.querySelector<HTMLButtonElement>('header button[aria-expanded]')?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

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
            aria-label={t("Main navigation", "मुख्य मेन्यू")}
          >
            <Link
              href="/"
              className="group flex min-h-[44px] items-center gap-2.5 text-white"
              onClick={() => setOpen(false)}
              aria-label={t("HM Ibrahim & Co, home", "एच एम इब्राहिम एंड कंपनी, होम")}
            >
              <Image
                src="/logo-wordmark.png"
                alt={t("HM Ibrahim & Co, since 1939", "एच एम इब्राहिम एंड कंपनी, 1939 से")}
                width={336}
                height={96}
                sizes="(min-width:768px) 168px, 154px"
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
                      <T en={link.en} hi={link.hi} />
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
              <LangToggle className="mr-1 [&_button]:min-h-[40px] [&_button]:min-w-[44px]" />
              <a
                href={`tel:${site.phone.replace(/\s/g, "")}`}
                onClick={() => trackCallClick("navbar")}
                aria-label={t("Call us", "कॉल करें")}
                className="inline-flex h-10 items-center rounded-full px-3 text-sm font-semibold text-white/90 lg:px-4 transition hover:bg-white/10"
              >
                <T en="Call" hi="कॉल करें" />
              </a>
              <Link
                href="/contact"
                className="inline-flex h-10 items-center whitespace-nowrap rounded-full bg-primary px-4 text-sm font-bold lg:px-5 text-primary-foreground transition hover:brightness-110"
              >
                <T en="Get a quote" hi="कोटेशन पाएँ" />
              </Link>
            </div>

            <div className="flex items-center gap-1 md:hidden">
            <LangToggle className="[&_button]:min-h-[40px] [&_button]:min-w-[44px]" />
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full text-white transition hover:bg-white/10"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-controls="mobile-nav-menu"
              aria-label={open ? t("Close menu", "मेन्यू बंद करें") : t("Open menu", "मेन्यू खोलें")}
            >
              {open ? <X className="h-6 w-6" aria-hidden /> : <Menu className="h-6 w-6" aria-hidden />}
            </button>
            </div>
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
                aria-label={t("Mobile navigation", "मोबाइल मेन्यू")}
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
                          <T en={link.en} hi={link.hi} />
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
                      <T en="Call" hi="कॉल करें" />
                    </a>
                    <a
                      href={getWhatsAppLink(site.whatsapp, t("Hi, I'm interested in your products. Please share prices and availability.", "नमस्ते, मुझे आपके उत्पादों में रुचि है। कृपया भाव और उपलब्धता बताइए।"))}
                      onClick={() => trackWhatsAppClick("navbar_mobile")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-11 items-center justify-center rounded-full border border-white/15 text-sm font-semibold"
                    >
                      <T en="WhatsApp" hi="व्हाट्सएप" />
                    </a>
                  </li>
                  <li className="mt-2">
                    <Link
                      href="/contact"
                      onClick={() => setOpen(false)}
                      className="flex h-11 w-full items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground"
                    >
                      <T en="Get a quote" hi="कोटेशन पाएँ" />
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
