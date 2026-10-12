import { site } from "@/content/site";
import { googleReviews, ratingBreakdown } from "@/content/reviews";
import { tt, whenText, type Lang } from "@/lib/locale";

export function GoogleReviews({ lang = "en" }: { lang?: Lang }) {
  const t = tt(lang);
  const url = site.googleReview.profileUrl;
  const shown = googleReviews.slice(0, 3);
  const has = shown.length > 0;

  return (
    <section className="py-14 md:py-20" aria-labelledby="reviews-heading">
      <div className="page-container">
        <p className="font-mono-brand text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          {t("What buyers say", "खरीदार क्या कहते हैं")}
        </p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-6">
          <h2 id="reviews-heading" className="text-foreground">
            {t("Read it from our customers", "हमारे ग्राहकों से ही पढ़िए")}
          </h2>
          {site.googleReview.verified && (
            <div className="flex items-center gap-5">
              <p className="font-display text-7xl font-extrabold leading-none text-foreground">{site.googleReview.rating}</p>
              <div>
                <p className="text-xl text-primary" aria-hidden="true">★★★★★</p>
                <p className="text-sm text-muted-foreground">
                  {lang === "hi"
                    ? `गूगल पर ${site.googleReview.reviewCount} रिव्यू, ${Math.round((ratingBreakdown[5] / site.googleReview.reviewCount) * 100)}% पाँच सितारा`
                    : `${site.googleReview.reviewCount} reviews on Google, ${Math.round((ratingBreakdown[5] / site.googleReview.reviewCount) * 100)}% five-star`}
                </p>
              </div>
            </div>
          )}
        </div>

        {has ? (
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {shown.map((r, i) => (
              <li key={i} data-reveal style={{ ["--rd" as string]: `${i * 100}ms` }} className="flex flex-col rounded-sm border border-border bg-card p-6">
                <p className="text-primary" aria-label={lang === "hi" ? `5 में से ${r.rating} सितारे` : `${r.rating} out of 5 stars`}>
                  {"★".repeat(r.rating)}
                  <span className="text-border">{"★".repeat(5 - r.rating)}</span>
                </p>
                <blockquote className="mt-3 flex-1 text-base leading-relaxed text-foreground" lang="en"><span className="whitespace-pre-line">{r.text}</span></blockquote>
                <p className="mt-4 text-sm font-semibold text-foreground">
                  {r.author}
                  {r.when && <span className="font-normal text-muted-foreground"> · {whenText(r.when, lang)}</span>}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 max-w-2xl text-muted-foreground">
            {t("Buyers across Indore leave reviews on our Google listing. See what they say, or add yours.", "इंदौर भर के खरीदार हमारी गूगल लिस्टिंग पर रिव्यू छोड़ते हैं। देखिए वे क्या कहते हैं, या अपना भी जोड़िए।")}
          </p>
        )}

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex min-h-[48px] items-center justify-center rounded-sm border border-input bg-card px-6 font-semibold text-foreground transition-colors hover:border-foreground/50"
        >
          {t("See all reviews on Google", "गूगल पर सभी रिव्यू देखें")}
        </a>
      </div>
    </section>
  );
}
