"use client";

import Link from "@/components/LocaleLink";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCategoryFocus } from "./CategoryFocus";
import { MessageCircle, Search, X } from "lucide-react";
import { GaugeRule } from "@/components/motif/Motif";
import { LedgerRow, type LedgerItem } from "@/components/catalog/LedgerRow";
import { T, useT } from "@/lib/i18n";
import { searchProducts, type SearchEntry } from "@/lib/productSearch";
import { site } from "@/content/site";
import { getWhatsAppLink } from "@/lib/utils";

export type IndexProduct = LedgerItem & { search: SearchEntry };
export type IndexCategory = { slug: string; name: string; description: string; image: string; products: IndexProduct[] };

type TataFilter = "off" | "wiron" | "any";

/** ?q= and ?tata= (wiron | 1) from the address bar. Same params the old links used. */
function readUrlState(): { q: string; tata: TataFilter; category: string | null } {
  const sp = new URLSearchParams(window.location.search);
  const tata = sp.get("tata");
  return {
    q: (sp.get("q") ?? "").slice(0, 80),
    tata: tata === "wiron" ? "wiron" : tata === "1" ? "any" : "off",
    category: sp.get("category"),
  };
}

function CategoryChip({
  pressed,
  onClick,
  onPreview,
  onLeave,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  onPreview: () => void;
  onLeave?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      onPointerEnter={(e) => e.pointerType === "mouse" && onPreview()}
      onFocus={onPreview}
      onBlur={onLeave}
      className={
        "inline-flex min-h-[44px] shrink-0 items-center rounded-[6px] border px-4 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary " +
        (pressed ? "border-primary bg-primary/15 text-white" : "border-white/15 bg-white/[0.04] text-white/90 hover:border-white/40")
      }
    >
      {children}
    </button>
  );
}

export function ProductsIndex({ categories }: { categories: IndexCategory[] }) {
  const t = useT();
  const [q, setQ] = useState("");
  // "wiron": only products with a Tata Wiron variant. "any": every Tata-flagged product (includes steel lines).
  const [tataFilter, setTataFilter] = useState<TataFilter>("off");
  const { selected, setSelected, setPreview } = useCategoryFocus();
  const searchRef = useRef<HTMLInputElement>(null);
  // True once ?q= / ?tata= have been read into state. Until then the address bar is left alone: writing it from the
  // initial (empty) state would erase the very parameters we are about to read.
  const [hydrated, setHydrated] = useState(false);

  // One entry per unique product: a product listed under two categories is searched (and counted) once.
  const entries = useMemo(() => {
    const seen = new Map<string, IndexProduct>();
    categories.forEach((c) => c.products.forEach((p) => seen.has(p.slug) || seen.set(p.slug, p)));
    return Array.from(seen.values()).map((p) => ({ id: p.slug, ...p.search }));
  }, [categories]);

  // Old links (?category=slug, ?tata=1, ?q=word) and back/forward restore the same state.
  useEffect(() => {
    const apply = () => {
      const s = readUrlState();
      setQ(s.q);
      setTataFilter(s.tata);
      // ?category=slug is the old deep link; it now selects that category (the ledger narrows to it).
      setSelected(s.category && categories.some((c) => c.slug === s.category) ? s.category : null);
    };
    apply();
    setHydrated(true);
    window.addEventListener("popstate", apply);
    return () => window.removeEventListener("popstate", apply);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep ?q= and ?tata= in the address bar (replace, no new history entry) so a refresh, a shared link and the
  // language switch all land on the same list.
  useEffect(() => {
    if (!hydrated) return;
    const url = new URL(window.location.href);
    const query = q.trim();
    if (query) url.searchParams.set("q", query);
    else url.searchParams.delete("q");
    if (tataFilter === "wiron") url.searchParams.set("tata", "wiron");
    else if (tataFilter === "any") url.searchParams.set("tata", "1");
    else url.searchParams.delete("tata");
    if (selected) url.searchParams.set("category", selected);
    else url.searchParams.delete("category");
    if (url.search !== window.location.search) window.history.replaceState(window.history.state, "", url);
  }, [q, tataFilter, selected, hydrated]);

  const matched = useMemo(() => new Set(searchProducts(entries, q)), [entries, q]);
  const filtering = q.trim() !== "" || tataFilter !== "off" || selected !== null;

  // Categories that still have a match for the current search and Tata toggle: these are the chips.
  const matchView = useMemo(() => {
    return categories
      .map((c) => ({
        ...c,
        products: c.products.filter((p) => {
          if (tataFilter === "wiron" && p.tata !== "wiron") return false;
          if (tataFilter === "any" && !p.tata) return false;
          return matched.has(p.slug);
        }),
      }))
      .filter((c) => c.products.length > 0);
  }, [categories, matched, tataFilter]);
  const view = useMemo(() => (selected ? matchView.filter((c) => c.slug === selected) : matchView), [matchView, selected]);

  // Cross-listed products appear under more than one category; count each once.
  const total = new Set(view.flatMap((c) => c.products.map((p) => p.slug))).size;

  const clear = useCallback(() => {
    setQ("");
    setTataFilter("off");
    setSelected(null);
    searchRef.current?.focus();
  }, [setSelected]);

  const askText = q.trim();
  const askHref = askText ? `/contact?product=${encodeURIComponent(askText)}` : "/contact";

  return (
    <>
      {/* Rail: search, category jumps, Tata filter. Sticky on desktop only; on a phone it scrolls away so the ledger gets the screen. */}
      <div className="z-30 border-b border-white/10 border-t border-t-white/10 bg-nav lg:sticky lg:top-0">
        <div className="page-container flex flex-wrap items-center gap-x-3 gap-y-3 py-3 lg:flex-nowrap">
          <div className="relative block min-w-0 flex-1 basis-[12rem] lg:max-w-xs lg:flex-none">
            <label htmlFor="product-search" className="sr-only">{t("Search products", "प्रोडक्ट खोजें")}</label>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <input
              id="product-search"
              ref={searchRef}
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("Search wire, jali, sariya…", "तार, जाली, सरिया खोजें…")}
              autoComplete="off"
              enterKeyHint="search"
              className="h-11 w-full rounded-[6px] border border-input bg-card pl-10 pr-10 text-base outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40 [&::-webkit-search-cancel-button]:hidden"
            />
            {q && (
              <button
                type="button"
                onClick={() => {
                  setQ("");
                  searchRef.current?.focus();
                }}
                aria-label={t("Clear search", "खोज साफ़ करें")}
                className="absolute right-0 top-0 inline-flex h-11 w-11 items-center justify-center rounded-[6px] text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            )}
          </div>
          <nav
            aria-label={t("Categories", "श्रेणियाँ")}
            className="order-last -mx-4 flex w-[calc(100%+2rem)] gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:order-none lg:mx-0 lg:w-auto lg:min-w-0 lg:flex-1 lg:px-0 lg:pb-0"
            onPointerLeave={() => setPreview(null)}
          >
            <CategoryChip pressed={selected === null} onClick={() => setSelected(null)} onPreview={() => setPreview(null)}>
              {t("All", "सभी")}
            </CategoryChip>
            {matchView.map((c) => (
              <CategoryChip
                key={c.slug}
                pressed={selected === c.slug}
                onClick={() => setSelected(selected === c.slug ? null : c.slug)}
                onPreview={() => setPreview(c.slug)}
                onLeave={() => setPreview(null)}
              >
                {c.name}
              </CategoryChip>
            ))}
          </nav>
          <div className="flex shrink-0 gap-2" role="group" aria-label={t("Tata filter", "टाटा फ़िल्टर")}>
            {(
              [
                ["wiron", t("Tata Wiron", "टाटा वायरॉन")],
                ["any", t("All Tata", "सभी टाटा")],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                aria-pressed={tataFilter === key}
                onClick={() => setTataFilter((v) => (v === key ? "off" : key))}
                className={
                  "h-11 shrink-0 rounded-[6px] border px-4 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary " +
                  (tataFilter === key ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:border-foreground/50")
                }
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="page-container pb-28 pt-8 md:pb-16 md:pt-12">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <p className="font-mono-brand text-xs uppercase tracking-[0.14em] text-muted-foreground" role="status" aria-live="polite">
            {total === 0
              ? t("No product matches", "कोई प्रोडक्ट नहीं मिला")
              : `${total} ${t(total === 1 ? "product" : "products", "आइटम")}`}
          </p>
          {filtering && total > 0 && (
            <button
              type="button"
              onClick={clear}
              className="inline-flex min-h-[44px] items-center font-mono-brand text-xs uppercase tracking-[0.14em] text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <T en="Clear search and filters" hi="खोज और फ़िल्टर हटाएँ" />
            </button>
          )}
        </div>

        {total === 0 && (
          <div className="mt-6 max-w-xl border-l-2 border-primary/70 pl-4">
            <h2 className="text-foreground">
              {askText ? t(`Nothing for “${askText}”`, `“${askText}” के लिए कुछ नहीं मिला`) : t("Nothing matches these filters", "इन फ़िल्टर से कुछ नहीं मिला")}
            </h2>
            <p className="mt-2 text-muted-foreground">
              <T
                en="Try a shorter word, or the name you use at the counter (jali, sariya, kala taar). We stock more than the page lists, so you can also ask us directly."
                hi="छोटा शब्द आज़माइए, या वही नाम लिखिए जो काउंटर पर बोलते हैं (जाली, सरिया, काला तार)। दुकान में सूची से ज़्यादा माल है, सीधे पूछ भी सकते हैं।"
              />
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={clear}
                className="inline-flex min-h-[48px] items-center justify-center rounded-sm border border-input bg-card px-5 font-semibold text-foreground hover:border-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <T en="Clear search and filters" hi="खोज और फ़िल्टर हटाएँ" />
              </button>
              <Link
                href={askHref}
                className="inline-flex min-h-[48px] items-center justify-center rounded-sm bg-primary px-5 font-bold text-primary-foreground hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {askText ? <T en="Ask us for this item" hi="यह माल हमसे पूछें" /> : <T en="Ask for a rate" hi="रेट पूछें" />}
              </Link>
              <a
                href={getWhatsAppLink(
                  site.whatsapp,
                  askText
                    ? t(`Hi, do you have "${askText}"? Please share the rate and availability.`, `नमस्ते, क्या आपके पास "${askText}" है? कृपया भाव और उपलब्धता बताइए।`)
                    : t("Hi, I'm looking for an item. Please share prices and availability.", "नमस्ते, मुझे एक सामान चाहिए। कृपया भाव और उपलब्धता बताइए।")
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-sm border border-input bg-card px-5 font-semibold text-foreground hover:border-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <MessageCircle className="h-4 w-4" aria-hidden />
                <T en="WhatsApp" hi="व्हाट्सएप" />
              </a>
            </div>
          </div>
        )}

        {view.map((c, i) => (
          <section key={c.slug} id={`c-${c.slug}`} aria-labelledby={`h-${c.slug}`} className="mt-12 scroll-mt-20 first:mt-6">
            <GaugeRule
              tone={i === 0 ? "primary" : "muted"}
              label={`${String(i + 1).padStart(2, "0")} / ${c.products.length}`}
              className="mt-8"
            />
            <div className="mt-3 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
              <div className="min-w-0">
                <h2 id={`h-${c.slug}`} className="text-foreground">{c.name}</h2>
                <p className="mt-2 max-w-xl text-sm text-muted-foreground">{c.description}</p>
              </div>
              <Link
                href={`/categories/${c.slug}`}
                className="inline-flex min-h-[44px] items-center font-mono-brand text-xs uppercase tracking-[0.14em] text-foreground underline underline-offset-4 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <T en={`Open ${c.name}`} hi={`${c.name} खोलें`} />
              </Link>
            </div>
            <ul className="mt-4 border-t border-border">
              {c.products.map((p, j) => (
                <LedgerRow key={p.slug} item={p} index={j} />
              ))}
            </ul>
          </section>
        ))}

        <div className="mt-16 border-t-2 border-primary/70 pt-6 md:flex md:items-end md:justify-between md:gap-8">
          <div>
            <h2 className="text-foreground"><T en="Not on the list?" hi="लिस्ट में नहीं है?" /></h2>
            <p className="mt-2 max-w-xl text-muted-foreground">
              <T
                en="We stock more than the page shows. Send us what you need, or call the counter."
                hi="दुकान में इससे ज़्यादा माल है। जो चाहिए बताइए, या काउंटर पर फ़ोन कीजिए।"
              />
            </p>
          </div>
          <Link
            href="/contact"
            className="mt-5 inline-flex min-h-[52px] items-center rounded-sm bg-primary px-7 font-bold text-primary-foreground hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background md:mt-0"
          >
            <T en="Ask for a rate" hi="रेट पूछें" />
          </Link>
        </div>
      </div>
    </>
  );
}
