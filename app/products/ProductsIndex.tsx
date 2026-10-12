"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Search, ArrowUpRight } from "lucide-react";

export type IndexProduct = { slug: string; name: string; shortDesc: string; image: string; tata: boolean };
export type IndexCategory = { slug: string; name: string; description: string; image: string; products: IndexProduct[] };

export function ProductsIndex({ categories }: { categories: IndexCategory[] }) {
  const [q, setQ] = useState("");
  const [tataOnly, setTataOnly] = useState(false);
  const query = q.trim().toLowerCase();

  // Old links: ?category=slug, ?tata=1, ?q=word
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    if (sp.get("tata") === "1") setTataOnly(true);
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
          if (tataOnly && !p.tata) return false;
          if (!query) return true;
          return (
            p.name.toLowerCase().includes(query) ||
            p.shortDesc.toLowerCase().includes(query) ||
            c.name.toLowerCase().includes(query)
          );
        }),
      }))
      .filter((c) => c.products.length > 0);
  }, [categories, query, tataOnly]);

  const total = view.reduce((n, c) => n + c.products.length, 0);

  return (
    <>
      {/* Sticky rail: search and category jumps */}
      <div className="sticky top-14 z-30 border-b border-border bg-background/95 backdrop-blur md:top-16">
        <div className="page-container flex flex-col gap-3 py-3 lg:flex-row lg:items-center">
          <label className="relative block lg:w-80">
            <span className="sr-only">Search products</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search wire, mesh, bars…"
              className="h-11 w-full rounded-sm border border-input bg-card pl-10 pr-3 text-base outline-none focus:border-foreground"
            />
          </label>
          <nav aria-label="Categories" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-1 lg:px-0 lg:pb-0">
            {view.map((c) => (
              <a
                key={c.slug}
                href={`#c-${c.slug}`}
                className="shrink-0 rounded-sm border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground hover:border-foreground/50"
              >
                {c.name}
              </a>
            ))}
          </nav>
          <button
            type="button"
            aria-pressed={tataOnly}
            onClick={() => setTataOnly((v) => !v)}
            className={
              "shrink-0 rounded-sm border px-3 py-2 text-sm font-semibold " +
              (tataOnly ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:border-foreground/50")
            }
          >
            Tata Wiron only
          </button>
        </div>
      </div>

      <div className="page-container py-10 md:py-16">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {total === 0 ? "No product matches. Try a shorter word, or ask us." : `${total} product${total === 1 ? "" : "s"}`}
        </p>

        <div className="mt-6 divide-y divide-border">
          {view.map((c, i) => (
            <section key={c.slug} id={`c-${c.slug}`} className="scroll-mt-40 py-12 first:pt-0 md:py-16">
              <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
                <div className={"lg:sticky lg:top-44 lg:self-start " + (i % 2 ? "lg:order-2" : "")}>
                  <p className="font-mono-brand text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    {String(i + 1).padStart(2, "0")} / {c.products.length} products
                  </p>
                  <h2 className="mt-2 text-foreground">{c.name}</h2>
                  <p className="mt-3 max-w-md text-muted-foreground">{c.description}</p>
                  {c.image && (
                    <div className="relative mt-6 aspect-[4/3] overflow-hidden rounded-sm bg-secondary">
                      <Image src={c.image} alt={`${c.name} at H M Ibrahim & Co`} fill sizes="(max-width:1024px) 100vw, 40vw" className="object-cover" />
                    </div>
                  )}
                  <Link
                    href={`/contact?category=${c.slug}`}
                    className="mt-6 inline-flex min-h-[48px] items-center rounded-sm bg-primary px-6 font-bold text-primary-foreground hover:brightness-110"
                  >
                    Get a rate for {c.name}
                  </Link>
                </div>

                <ul className="divide-y divide-border border-y border-border">
                  {c.products.map((p) => (
                    <li key={p.slug}>
                      <Link href={`/products/${p.slug}`} className="group flex items-center gap-4 py-4 transition-colors hover:bg-secondary/60 sm:px-2">
                        <span className="relative block h-16 w-16 shrink-0 overflow-hidden rounded-sm bg-secondary sm:h-20 sm:w-20">
                          {p.image && <Image src={p.image} alt="" fill sizes="80px" className="object-cover" />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-display text-2xl font-extrabold uppercase leading-none text-foreground sm:text-3xl">
                            {p.name}
                          </span>
                          <span className="mt-1 line-clamp-2 block text-sm text-muted-foreground">{p.shortDesc}</span>
                          {p.tata && <span className="mt-1 inline-block text-xs font-semibold text-primary">Tata Wiron available</span>}
                        </span>
                        <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" aria-hidden />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ))}
        </div>

        <div className="mt-6 rounded-sm bg-nav p-8 text-white md:p-12">
          <h2 className="text-white">Not on the list?</h2>
          <p className="mt-3 max-w-xl text-white/80">We stock more than the page shows. Send us what you need, or call the counter.</p>
          <Link href="/contact" className="mt-6 inline-flex min-h-[52px] items-center rounded-sm bg-primary px-7 font-bold text-primary-foreground hover:brightness-110">
            Get a quote
          </Link>
        </div>
      </div>
    </>
  );
}
