import Link from "@/components/LocaleLink";
import { site } from "@/content/site";
import { getReviewsForProduct } from "@/content/productReviews";
import { GaugeRule } from "@/components/motif/Motif";
import { tt, whenText, type Lang } from "@/lib/locale";
import { ReviewQuote } from "@/components/trust/ReviewQuote";

type Props = { productSlug: string; productName: string; lang?: Lang; max?: number };

/**
 * Real Google reviews under the product photos. Swipes sideways on phones, scrolls down inside a fixed-height
 * box on desktop. Picked by getReviewsForProduct, so a newer or better review takes a slot without any edit here.
 */
export function ProductReviewsRail({ productSlug, productName, lang = "en", max = 10 }: Props) {
  const t = tt(lang);
  const items = getReviewsForProduct(productSlug, max);
  if (items.length === 0) return null;
  const heading = lang === "hi" ? `${productName} के बारे में खरीदार क्या कहते हैं` : `What buyers say about ${productName}`;
  return (
    <section className="mt-8" aria-labelledby="product-reviews-heading">
      <GaugeRule label={`${t("Google", "गूगल")} ${site.googleReview.rating} / ${site.googleReview.reviewCount}`} />
      <h2 id="product-reviews-heading" className="mt-2 font-display text-2xl font-extrabold uppercase leading-none text-foreground">
        {heading}
      </h2>
      {lang === "hi" && (
        <p className="mt-2 text-sm text-muted-foreground">
          ये ग्राहकों की असली समीक्षाएँ हैं, ठीक वैसी ही जैसी उन्होंने गूगल पर लिखीं (मूल भाषा में)।
        </p>
      )}
      <ul
        tabIndex={0}
        aria-label={heading}
        className="mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:block lg:max-h-[26rem] lg:snap-none lg:gap-0 lg:overflow-y-auto lg:overflow-x-hidden lg:border-t lg:border-border lg:pb-0 lg:pr-2"
      >
        {items.map((r) => (
          <li
            key={r.id}
            className="w-[85%] shrink-0 snap-start rounded-sm border border-border bg-card p-4 sm:w-[60%] lg:w-auto lg:rounded-none lg:border-0 lg:border-b lg:bg-transparent lg:px-0"
          >
            <p className="font-semibold text-foreground">{r.author}</p>
            <p className="mt-0.5 font-mono-brand text-xs uppercase tracking-[0.1em] text-muted-foreground">
              <span aria-label={lang === "hi" ? `5 में से ${r.rating} सितारे` : `${r.rating} out of 5 stars`} className="text-primary">
                {"★".repeat(r.rating)}
              </span>
              {r.when && <span> {whenText(r.when, lang)}</span>}
            </p>
            <div className="mt-2">
              <ReviewQuote text={r.text} more={t("Read more", "और पढ़ें")} less={t("Show less", "कम दिखाएँ")} />
            </div>
          </li>
        ))}
      </ul>
      <Link
        href={site.googleReview.profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-flex min-h-[44px] items-center text-sm font-semibold text-foreground underline underline-offset-4 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {t("Read all reviews on Google", "गूगल पर सभी रिव्यू पढ़ें")}
      </Link>
    </section>
  );
}
