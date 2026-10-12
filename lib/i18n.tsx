"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Lang = "en" | "hi";
const KEY = "hm_lang";

type Ctx = { lang: Lang; setLang: (l: Lang) => void };
const LangContext = createContext<Ctx>({ lang: "en", setLang: () => {} });

/**
 * Light EN / हिं switch for the key surfaces. Same URL, no duplicate pages: the server always renders English,
 * and the choice is applied after hydration from localStorage. Keep `lang` on <html> in step for screen readers.
 */
export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved === "hi" || saved === "en") setLangState(saved);
    } catch {
      /* private mode: stay on English */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "hi" ? "hi-IN" : "en-IN";
  }, [lang]);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      setLang: (l) => {
        setLangState(l);
        try {
          localStorage.setItem(KEY, l);
        } catch {
          /* ignore */
        }
      },
    }),
    [lang]
  );
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
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

export function LangToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLang();
  return (
    <div className={`inline-flex items-center rounded-full border border-white/15 p-0.5 text-xs font-bold ${className}`} role="group" aria-label="Language">
      {(["en", "hi"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          lang={l === "hi" ? "hi" : "en"}
          className={
            "min-h-8 min-w-9 rounded-full px-2.5 transition-colors " +
            (lang === l ? "bg-white text-black" : "text-white/70 hover:text-white")
          }
        >
          {l === "en" ? "EN" : "हिं"}
        </button>
      ))}
    </div>
  );
}
