import Link from "@/components/LocaleLink";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { StencilTag } from "@/components/motif/Motif";
import { T } from "@/lib/i18n";

export type LedgerItem = {
  slug: string;
  name: string;
  shortDesc: string;
  image: string;
  imageAlt?: string;
  categorySlug?: string;
  tag?: string | null;
  tata?: "wiron" | "other" | null;
};

/** One line of the counter ledger: photo, name and size tag, and an "Ask for rate" action. */
export function LedgerRow({ item, index, anchor }: { item: LedgerItem; index: number; anchor?: boolean }) {
  const ask = `/contact?product=${item.slug}${item.categorySlug ? `&category=${item.categorySlug}` : ""}`;
  return (
    <li id={anchor ? `p-${item.slug}` : undefined} className="group relative scroll-mt-24 grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-4 gap-y-2 border-b border-border py-4 transition-colors hover:bg-secondary/40 sm:grid-cols-[11rem_minmax(0,1fr)_auto] sm:items-center sm:gap-x-6 sm:py-5">
      <div className="relative aspect-[4/3] self-start overflow-hidden rounded-[6px] bg-[hsl(210_30%_10%)] ring-1 ring-white/10 sm:self-center">
        {item.image && (
          <Image src={item.image} alt={item.imageAlt ?? ""} fill sizes="(max-width:640px) 104px, 176px" className="object-cover" />
        )}
        <span className="pointer-events-none absolute inset-0 bg-[hsl(210_40%_6%/0.18)]" aria-hidden="true" />
      </div>

      <div className="min-w-0">
        <p className="font-mono-brand text-[11px] uppercase tracking-[0.16em] text-muted-foreground" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </p>
        <h3 className="mt-0.5 font-display text-2xl font-extrabold uppercase leading-[1.02] text-foreground sm:text-[1.9rem]">
          <Link
            href={`/products/${item.slug}`}
            className="rounded-sm after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {item.name}
          </Link>
        </h3>
        {item.tag && <StencilTag className="mt-2 !text-[0.9rem] text-foreground">{item.tag}</StencilTag>}
        <p className="mt-2 line-clamp-2 text-sm leading-snug text-muted-foreground">{item.shortDesc}</p>
        {item.tata && (
          <p className="mt-1.5 font-mono-brand text-[11px] uppercase tracking-[0.12em] text-primary">
            {item.tata === "wiron" ? <T en="Tata Wiron available" hi="टाटा वायरॉन उपलब्ध" /> : <T en="Tata on request" hi="टाटा माँगने पर" />}
          </p>
        )}
      </div>

      <div className="col-start-2 sm:col-start-auto">
        <Link
          href={ask}
          className="relative z-10 inline-flex min-h-[44px] items-center gap-2 rounded-sm border border-primary/70 px-4 font-mono-brand text-xs font-semibold uppercase tracking-[0.12em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <T en="Ask for rate" hi="रेट पूछें" />
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </li>
  );
}
