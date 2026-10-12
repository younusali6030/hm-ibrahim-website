/**
 * Locale helpers shared by server and client code (no "use client" here).
 *
 * English lives at the plain URLs it always had (/products). Hindi lives under /hi (/hi/products).
 * middleware.ts rewrites both onto app/[lang]/..., so every page is built once per language.
 */

export type Lang = "en" | "hi";
export const LANGS: readonly Lang[] = ["en", "hi"] as const;
export const DEFAULT_LANG: Lang = "en";

export const isLang = (v: unknown): v is Lang => v === "en" || v === "hi";

/** BCP-47 tag for <html lang> and hreflang. */
export const htmlLang: Record<Lang, string> = { en: "en-IN", hi: "hi-IN" };
/** Open Graph locale. */
export const ogLocale: Record<Lang, string> = { en: "en_IN", hi: "hi_IN" };

/** "/products" -> "/hi/products" for Hindi; unchanged for English. "/" -> "/hi". Leaves external and hash links alone. */
export function localePath(lang: Lang, path: string): string {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  const bare = stripLocale(path).path;
  if (lang === "en") return bare;
  return bare === "/" ? "/hi" : `/hi${bare}`;
}

/** Split a pathname into its language and the language-free path. "/hi/blog" -> { hi, "/blog" }. */
export function stripLocale(pathname: string): { lang: Lang; path: string } {
  const m = pathname.match(/^\/hi(\/.*)?$/);
  if (m) return { lang: "hi", path: m[1] || "/" };
  return { lang: "en", path: pathname || "/" };
}

/** Matches "/hi" or "/hi/..." but not "/history". */
export const HI_PREFIX = /^\/hi(?=\/|$)/;

/** Picker for server code that already knows the language: const t = tt(lang); t("Get a quote", "कोटेशन पाएँ"). */
export const tt =
  (lang: Lang) =>
  (en: string, hi?: string): string =>
    lang === "hi" && hi ? hi : en;

const MONTHS_HI: Record<string, string> = {
  January: "जनवरी", February: "फ़रवरी", March: "मार्च", April: "अप्रैल", May: "मई", June: "जून",
  July: "जुलाई", August: "अगस्त", September: "सितंबर", October: "अक्टूबर", November: "नवंबर", December: "दिसंबर",
};

/** "July 2026" -> "जुलाई 2026" (review dates are shown as Google gave them, month names localized). */
export function whenText(when: string | undefined, lang: Lang): string | undefined {
  if (!when || lang !== "hi") return when;
  return when.replace(/\b[A-Z][a-z]+\b/g, (m) => MONTHS_HI[m] ?? m);
}
