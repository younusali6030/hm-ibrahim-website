import Link from "@/components/LocaleLink";
import { site } from "@/content/site";
import { googleReviews } from "@/content/reviews";
import { getReviewsForProduct, getReviewsForCategory } from "@/content/productReviews";
import { GaugeRule } from "@/components/motif/Motif";
import { tt, whenText, type Lang } from "@/lib/locale";
import { ReviewQuote } from "@/components/trust/ReviewQuote";

type Props = { max?: number; title?: string; className?: string; productSlug?: string; categorySlug?: string; lang?: Lang };

/** Real Google reviews, verbatim, set as a ruled quote ledger. */
export function ReviewsList({ max = 3, title, className = "", productSlug, categorySlug, lang = "en" }: Props) {
  const t = tt(lang);
  const heading = title ?? t("What buyers say on Google", "गूगल पर खरीदार क्या कहते हैं");
  const items = productSlug
    ? getReviewsForProduct(productSlug, max)
    : categorySlug
      ? getReviewsForCategory(categorySlug, max)
      : googleReviews.slice(0, max);
  if (items.length === 0) return null;
  return (
    <section className={className} aria-labelledby="reviews-list-heading">
      <GaugeRule label={`${t("Google", "गूगल")} ${site.googleReview.rating} / ${site.googleReview.reviewCount}`} className="mt-2" />
      <h2 id="reviews-list-heading" className="mt-2 text-foreground">{heading}</h2>
      {lang === "hi" && (
        <p className="mt-2 text-sm text-muted-foreground">
          ये ग्राहकों की असली समीक्षाएँ हैं, ठीक वैसी ही जैसी उन्होंने गूगल पर लिखीं (मूल भाषा में)।
        </p>
      )}
      <ul className="mt-4 border-t border-border">
        {items.map((r) => (
          <li
            key={r.author + r.text.slice(0, 12)}
            className="grid gap-x-8 gap-y-1 border-b border-border py-4 md:grid-cols-[11rem_minmax(0,1fr)]"
          >
            <div>
              <p className="font-semibold text-foreground">{r.author}</p>
              <p className="mt-0.5 font-mono-brand text-xs uppercase tracking-[0.1em] text-muted-foreground">
                <span aria-label={lang === "hi" ? `5 में से ${r.rating} सितारे` : `${r.rating} out of 5 stars`} className="text-primary">
                  {"★".repeat(r.rating)}
                </span>
                {r.when && <span> {whenText(r.when, lang)}</span>}
              </p>
            </div>
            <ReviewQuote text={r.text} more={t("Read more", "और पढ़ें")} less={t("Show less", "कम दिखाएँ")} />
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
