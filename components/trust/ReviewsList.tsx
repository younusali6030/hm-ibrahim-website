import Link from "next/link";
import { site } from "@/content/site";
import { googleReviews } from "@/content/reviews";
import { getReviewsForProduct, getReviewsForCategory } from "@/content/productReviews";
import { GaugeRule } from "@/components/motif/Motif";

type Props = { max?: number; title?: string; className?: string; productSlug?: string; categorySlug?: string };

/** Real Google reviews, verbatim, set as a ruled quote ledger. */
export function ReviewsList({ max = 3, title = "What buyers say on Google", className = "", productSlug, categorySlug }: Props) {
  const items = productSlug
    ? getReviewsForProduct(productSlug, max)
    : categorySlug
      ? getReviewsForCategory(categorySlug, max)
      : googleReviews.slice(0, max);
  if (items.length === 0) return null;
  return (
    <section className={className} aria-labelledby="reviews-list-heading">
      <GaugeRule label={`Google ${site.googleReview.rating} / ${site.googleReview.reviewCount}`} className="mt-6" />
      <h2 id="reviews-list-heading" className="mt-3 text-foreground">{title}</h2>
      <ul className="mt-5 border-t border-border">
        {items.map((r) => (
          <li
            key={r.author + r.text.slice(0, 12)}
            className="grid gap-x-8 gap-y-2 border-b border-border py-5 md:grid-cols-[11rem_minmax(0,1fr)]"
          >
            <div>
              <p className="font-semibold text-foreground">{r.author}</p>
              <p className="mt-0.5 font-mono-brand text-xs uppercase tracking-[0.1em] text-muted-foreground">
                <span aria-label={`${r.rating} out of 5 stars`} className="text-primary">
                  {"★".repeat(r.rating)}
                </span>
                {r.when && <span> {r.when}</span>}
              </p>
            </div>
            <blockquote className="whitespace-pre-line leading-relaxed text-foreground/90">{r.text}</blockquote>
          </li>
        ))}
      </ul>
      <Link
        href={site.googleReview.profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex min-h-[44px] items-center text-sm font-semibold text-foreground underline underline-offset-4 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        Read all reviews on Google
      </Link>
    </section>
  );
}
