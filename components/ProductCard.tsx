import Link from "@/components/LocaleLink";
import { PhotoPlate } from "@/components/ui/PhotoPlate";
import type { Product, ProductWithCategory } from "@/content/products";
import { getCategoryBySlug, getProductImages } from "@/content/products";
import { StencilTag } from "@/components/motif/Motif";
import { NoPhoto } from "@/components/catalog/LedgerRow";
import { sizeTag } from "@/components/catalog/ledger";
import { T } from "@/lib/i18n";
import { getProductBySlug } from "@/content/products";
import { tr } from "@/lib/localize";
import type { Lang } from "@/lib/locale";

type Props = {
  product: Product | ProductWithCategory;
  /** Kept for existing callers; cards no longer animate in. */
  index?: number;
  /** Pass an already-localized product together with its language. */
  lang?: Lang;
};

/** A counter-ledger tile: same 4/3 dark-steel photo crop as the catalog rows, name, size tag, rate link. */
export function ProductCard({ product, lang = "en" }: Props) {
  const category = getCategoryBySlug(product.categorySlug);
  const [imgSrc, imgSrc2] = getProductImages(product, category);
  // The size tag is picked by matching English spec labels, so it is built from the English record and then translated.
  const tag = sizeTag(getProductBySlug(product.slug) ?? product, (s) => tr(s, lang));
  const imgAlt = product.imageAlt || product.name;

  return (
    <article className="group relative flex h-full flex-col border-t border-border pt-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[6px] bg-[hsl(210_30%_10%)] ring-1 ring-white/10">
        {!imgSrc && <NoPhoto name={product.name} />}
        {imgSrc && <PhotoPlate src={imgSrc} src2={imgSrc2} alt={imgAlt} sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw" />}
        <span className="pointer-events-none absolute inset-0 bg-[hsl(210_40%_6%/0.18)]" aria-hidden="true" />
      </div>
      <h3 className="mt-3 font-display text-2xl font-extrabold uppercase leading-[1.02] text-foreground">
        <Link
          href={`/products/${product.slug}`}
          className="rounded-sm after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {product.name}
        </Link>
      </h3>
      {tag && <StencilTag className="mt-2 !text-[0.8rem] text-foreground">{tag}</StencilTag>}
      <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted-foreground">{product.shortDesc}</p>
      <Link
        href={`/contact?product=${product.slug}&category=${product.categorySlug}`}
        className="relative z-10 mt-3 inline-flex min-h-[44px] items-center font-mono-brand text-xs font-semibold uppercase tracking-[0.12em] text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <T en="Ask for rate" hi="रेट पूछें" />
      </Link>
    </article>
  );
}
