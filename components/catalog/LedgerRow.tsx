import Link from "@/components/LocaleLink";
import { PhotoPlate } from "@/components/ui/PhotoPlate";
import { ArrowUpRight } from "lucide-react";
import { StencilTag } from "@/components/motif/Motif";
import { T } from "@/lib/i18n";

/** Honest stand-in when a product has no photograph yet: a stencil plate, not a fake picture. */
export function NoPhoto({ name }: { name: string }) {
  return (
    <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-[repeating-linear-gradient(135deg,hsl(210_30%_10%)_0_10px,hsl(210_30%_12%)_10px_20px)] text-center">
      <span className="font-display text-xl font-extrabold uppercase leading-none text-foreground/80">{name}</span>
      <span className="font-mono-brand text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
        <T en="Photo on request" hi="फ़ोटो माँगने पर" />
      </span>
    </span>
  );
}

export type LedgerItem = {
  slug: string;
  name: string;
  shortDesc: string;
  image: string;
  image2?: string;
  imageAlt?: string;
  categorySlug?: string;
  tag?: string | null;
  tata?: "wiron" | "other" | null;
};

/** One line of the counter ledger: photo, name and size tag, and an "Ask for rate" action. */
export function LedgerRow({ item, index, anchor }: { item: LedgerItem; index: number; anchor?: boolean }) {
  const ask = `/contact?product=${item.slug}${item.categorySlug ? `&category=${item.categorySlug}` : ""}`;
  return (
    <li id={anchor ? `p-${item.slug}` : undefined} className="group relative scroll-mt-24 grid grid-cols-[5.5rem_minmax(0,1fr)] gap-x-3 gap-y-0 border-b border-border py-3 transition-colors hover:bg-secondary/40 sm:grid-cols-[11rem_minmax(0,1fr)_auto] sm:items-center sm:gap-x-6 sm:py-4">
      <div className="relative row-span-2 aspect-[4/3] self-start overflow-hidden rounded-[6px] bg-[hsl(210_30%_10%)] ring-1 ring-white/10 sm:row-span-1 sm:self-center">
        {!item.image && <NoPhoto name={item.name} />}
        {item.image && (
          <PhotoPlate src={item.image} src2={item.image2} alt={item.imageAlt ?? ""} sizes="(max-width:640px) 88px, 176px" />
        )}
        <span className="pointer-events-none absolute inset-0 bg-[hsl(210_40%_6%/0.18)]" aria-hidden="true" />
      </div>

      <div className="min-w-0">
        <p className="font-mono-brand text-[11px] uppercase tracking-[0.16em] text-muted-foreground max-sm:hidden" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </p>
        <h3 className="font-display text-xl font-extrabold uppercase leading-[1.05] text-foreground sm:mt-0.5 sm:text-[1.7rem]">
          <Link
            href={`/products/${item.slug}`}
            className="rounded-sm after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {item.name}
          </Link>
        </h3>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 sm:mt-2 sm:block">
          {item.tag && <StencilTag className="!text-[0.85rem] text-foreground">{item.tag}</StencilTag>}
          <p className="mt-1.5 line-clamp-2 text-sm leading-snug text-muted-foreground max-sm:hidden">{item.shortDesc}</p>
          {item.tata && (
            <p className="font-mono-brand text-[11px] uppercase tracking-[0.12em] text-primary sm:mt-1.5">
              {item.tata === "wiron" ? <T en="Tata Wiron available" hi="टाटा वायरॉन उपलब्ध" /> : <T en="Tata on request" hi="टाटा माँगने पर" />}
            </p>
          )}
        </div>
      </div>

      <div className="col-start-2 mt-1 sm:col-start-auto sm:mt-0">
        <Link
          href={ask}
          className="relative z-10 inline-flex min-h-[40px] items-center gap-1.5 rounded-sm font-mono-brand text-xs font-semibold uppercase tracking-[0.12em] text-primary transition-colors hover:text-primary sm:min-h-[44px] sm:border sm:border-primary/70 sm:px-4 sm:hover:bg-primary sm:hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <T en="Ask for rate" hi="रेट पूछें" />
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </li>
  );
}
