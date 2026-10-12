"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { GaugeRule } from "@/components/motif/Motif";
import { LedgerRow, type LedgerItem } from "@/components/catalog/LedgerRow";
import { T, useT } from "@/lib/i18n";

export type IndexProduct = LedgerItem;
export type IndexCategory = { slug: string; name: string; description: string; image: string; products: IndexProduct[] };

export function ProductsIndex({ categories }: { categories: IndexCategory[] }) {
  const t = useT();
  const [q, setQ] = useState("");
  // "wiron": only products with a Tata Wiron variant. "any": every Tata-flagged product (includes steel lines).
  const [tataFilter, setTataFilter] = useState<"off" | "wiron" | "any">("off");
  const query = q.trim().toLowerCase();

  // Old links: ?category=slug, ?tata=1, ?q=word
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const tata = sp.get("tata");
    if (tata === "wiron") setTataFilter("wiron");
    else if (tata === "1") setTataFilter("any");
    const sq = sp.get("q");
    if (sq) setQ(sq);
    const cat = sp.get("category");
    if (cat) {
      requestAnimationFrame(() => document.getElementById(`c-${cat}`)?.scrollIntoView({ behavior: "auto", block: "start" }));
    }
  }, []);

  const view = useMemo(() => {
    return categories
      .map((c) => ({
        ...c,
        products: c.products.filter((p) => {
          if (tataFilter === "wiron" && p.tata !== "wiron") return false;
          if (tataFilter === "any" && !p.tata) return false;
          if (!query) return true;
          return (
            p.name.toLowerCase().includes(query) ||
            p.shortDesc.toLowerCase().includes(query) ||
            c.name.toLowerCase().includes(query)
          );
        }),
      }))
      .filter((c) => c.products.length > 0);
  }, [categories, query, tataFilter]);

  // Cross-listed products appear under more than one category; count each once.
  const total = new Set(view.flatMap((c) => c.products.map((p) => p.slug))).size;

  return (
    <>
      {/* Rail: search, category jumps, Tata filter. Sticky on desktop only; on a phone it scrolls away so the ledger gets the screen. */}
      <div className="z-30 border-b border-border bg-background lg:sticky lg:top-0">
        <div className="page-container flex flex-wrap items-center gap-x-3 gap-y-3 py-3 lg:flex-nowrap">
          <label className="relative block min-w-0 flex-1 basis-[12rem] lg:max-w-xs lg:flex-none">
            <span className="sr-only">{t("Search products", "प्रोडक्ट खोजें")}</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("Search wire, mesh, bars…", "तार, जाली, सरिया खोजें…")}
              className="h-11 w-full rounded-[6px] border border-input bg-card pl-10 pr-3 text-base outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40"
            />
          </label>
          <nav
            aria-label={t("Categories", "श्रेणियाँ")}
            className="order-last -mx-4 flex w-[calc(100%+2rem)] gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:order-none lg:mx-0 lg:w-auto lg:min-w-0 lg:flex-1 lg:px-0 lg:pb-0"
          >
            {view.map((c) => (
              <a
                key={c.slug}
                href={`#c-${c.slug}`}
                className="inline-flex min-h-[44px] shrink-0 items-center rounded-[6px] border border-border bg-card px-4 text-sm font-semibold text-foreground hover:border-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {c.name}
              </a>
            ))}
          </nav>
          <div className="flex shrink-0 gap-2" role="group" aria-label="Tata filter">
            {(
              [
                ["wiron", "Tata Wiron"],
                ["any", "All Tata"],
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
        <p className="font-mono-brand text-xs uppercase tracking-[0.14em] text-muted-foreground" aria-live="polite">
          {total === 0
            ? t("No product matches. Try a shorter word, or ask us.", "कुछ नहीं मिला। छोटा शब्द आज़माइए, या हमसे पूछिए।")
            : `${total} ${t(total === 1 ? "product" : "products", "आइटम")}`}
        </p>

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
