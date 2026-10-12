"use client";

import { createContext, useContext, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { localePath, stripLocale, type Lang } from "@/lib/locale";

export type { Lang } from "@/lib/locale";

type Ctx = { lang: Lang };
const LangContext = createContext<Ctx>({ lang: "en" });

/**
 * The language comes from the URL (/hi/... is Hindi), so every Hindi page is server-rendered in Hindi,
 * indexable, and has its own canonical and hreflang. There is no client-side swap and no flash of English.
 */
export function LangProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  return <LangContext.Provider value={{ lang }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}

/**
 * Inline bilingual text, usable from server components: <T en="Get a quote" hi="कोटेशन पाएँ" />.
 * Hindi is Devanagari with the trade words people actually say (jali, kata taar, loha, sariya).
 */
export function T({ en, hi }: { en: string; hi?: string }) {
  const { lang } = useLang();
  return <>{lang === "hi" && hi ? hi : en}</>;
}

/** Same as <T> but returns a string, for attributes such as aria-label and placeholder. */
export function useT() {
  const { lang } = useLang();
  return (en: string, hi?: string) => (lang === "hi" && hi ? hi : en);
}

/** Path of the current page in the other language, e.g. /hi/products <-> /products. */
export function useAltLangPath(): { lang: Lang; target: Lang; href: string } {
  const pathname = usePathname() || "/";
  const { lang, path } = stripLocale(pathname);
  const target: Lang = lang === "hi" ? "en" : "hi";
  return { lang, target, href: localePath(target, path) };
}

export function LangToggle({ className = "" }: { className?: string }) {
  const { lang } = useLang();
  const { href } = useAltLangPath();
  const router = useRouter();

  // Real links so crawlers see the alternate-language URL; the click keeps ?query and #hash.
  const go = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    const extra = window.location.search + window.location.hash;
    if (!extra) return;
    e.preventDefault();
    router.push(href + extra);
  };

  return (
    <div
      className={`inline-flex items-center rounded-full border border-white/15 p-0.5 text-xs font-bold ${className}`}
      role="group"
      aria-label={lang === "hi" ? "भाषा" : "Language"}
    >
      {(["en", "hi"] as const).map((l) => {
        const on = lang === l;
        const style = on ? { color: "#0b121a", backgroundColor: "#fff" } : { color: "rgba(255,255,255,0.88)" };
        const cls =
          "inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-full px-2.5 transition-colors " +
          // The two Devanagari letters of the label use the device's own font: on an English page they would
          // otherwise pull in the 120 KB Noto Sans Devanagari web font for two characters.
          (l === "hi" ? "font-deva-system " : "") +
          (on ? "bg-white text-[#0b121a]" : "text-white/85 hover:text-white");
        const label = l === "en" ? "EN" : "हिं";
        return on ? (
          <span key={l} aria-current="true" lang={l} style={style} className={cls}>
            {label}
          </span>
        ) : (
          <Link
            key={l}
            href={href}
            prefetch={false}
            hrefLang={l === "hi" ? "hi-IN" : "en-IN"}
            lang={l}
            onClick={go}
            style={style}
            className={cls}
            // The accessible name starts with the visible label (WCAG 2.5.3), then says what it does.
            aria-label={l === "hi" ? "हिं, हिंदी में देखें" : "EN, view in English"}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
