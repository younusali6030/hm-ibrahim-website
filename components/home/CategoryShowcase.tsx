import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { categories, getCategoryThumbnails } from "@/content/products";
import { GaugeRule, StencilTag } from "@/components/motif/Motif";

/** The counter as a ledger: one ruled row per range, a few real photos, a count, and a way in. */
export function CategoryShowcase() {
  return (
    <section className="py-14 md:py-20" aria-labelledby="categories-heading">
      <div className="page-container">
        <p data-reveal className="font-mono-brand text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          The counter
        </p>
        <h2 id="categories-heading" data-reveal className="mt-2 max-w-3xl text-foreground">
          Every wire, mesh, sheet and bar a build calls for
        </h2>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          In stock at our Siyaganj counter, for retail and wholesale. Pick a range, then ask for a rate.
        </p>

        <div className="mt-10">
          <GaugeRule label={`${categories.length} ranges`} />
          <ol className="mt-2">
            {categories.map((cat, i) => {
              const thumbs = getCategoryThumbnails(cat, 3);
              return (
                <li key={cat.slug} data-reveal className="border-b border-border">
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="group grid min-h-[76px] grid-cols-[2rem_1fr_auto] items-center gap-x-3 gap-y-1 py-4 sm:grid-cols-[3rem_1fr_auto_auto] sm:gap-x-6 sm:py-5"
                  >
                    <span className="font-mono-brand text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                    <span className="min-w-0">
                      <span className="block font-display text-[1.75rem] font-extrabold uppercase leading-none text-foreground transition-colors group-hover:text-primary sm:text-4xl lg:text-5xl">
                        {cat.name}
                      </span>
                      <span className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <StencilTag className="text-muted-foreground">
                          {cat.products.length} {cat.products.length === 1 ? "item" : "items"}
                        </StencilTag>
                        <span className="line-clamp-1 text-sm text-muted-foreground">
                          {cat.products.slice(0, 3).map((p) => p.name).join(" · ")}
                        </span>
                      </span>
                    </span>
                    <span className="hidden gap-1.5 sm:flex" aria-hidden="true">
                      {thumbs.map((t) => (
                        <span key={t.src} className="relative h-14 w-14 overflow-hidden rounded-[6px] bg-secondary ring-1 ring-white/10 transition group-hover:ring-primary/60">
                          <Image src={t.src} alt="" fill sizes="56px" className="object-cover opacity-80 transition-opacity group-hover:opacity-100" />
                        </span>
                      ))}
                    </span>
                    <ArrowUpRight className="h-5 w-5 text-muted-foreground transition group-hover:text-primary" aria-hidden />
                  </Link>
                </li>
              );
            })}
          </ol>
          <div className="mt-6">
            <Link href="/products" className="glass-btn glass-btn-main">
              Browse all products <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
