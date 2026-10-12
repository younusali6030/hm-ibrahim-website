import Link from "next/link";
import { site } from "@/content/site";
import { googleReviews } from "@/content/reviews";
import { getReviewsForProduct, getReviewsForCategory } from "@/content/productReviews";

type Props = { max?: number; title?: string; className?: string; productSlug?: string; categorySlug?: string };

/** Real Google reviews, verbatim. Replaces the old placeholder testimonial blocks. */
export function ReviewsList({ max = 3, title = "What buyers say on Google", className = "", productSlug, categorySlug }: Props) {
  const items = productSlug
    ? getReviewsForProduct(productSlug, max)
    : categorySlug
      ? getReviewsForCategory(categorySlug, max)
      : googleReviews.slice(0, max);
  if (items.length === 0) return null;
  return (
    <section className={className} aria-labelledby="reviews-list-heading">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="reviews-list-heading" className="text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{site.googleReview.rating}</span> from {site.googleReview.reviewCount} reviews
        </p>
      </div>
      <ul className="mt-6 grid gap-4 md:grid-cols-3">
        {items.map((r) => (
          <li key={r.author + r.text.slice(0, 12)} className="flex flex-col rounded-sm border border-border bg-card p-5">
            <p className="text-primary" aria-label={`${r.rating} out of 5 stars`}>
              {"★".repeat(r.rating)}
              <span className="text-border">{"★".repeat(5 - r.rating)}</span>
            </p>
            <blockquote className="mt-2 flex-1 whitespace-pre-line text-sm leading-relaxed text-foreground">{r.text}</blockquote>
            <p className="mt-3 text-sm font-semibold text-foreground">
              {r.author}
              {r.when && <span className="font-normal text-muted-foreground"> · {r.when}</span>}
            </p>
          </li>
        ))}
      </ul>
      <Link
        href={site.googleReview.profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-block text-sm font-semibold text-foreground underline underline-offset-4 hover:text-primary"
      >
        Read all reviews on Google
      </Link>
    </section>
  );
}
