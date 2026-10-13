import { site } from "@/content/site";
import { siteHi } from "@/content/hi/site";
import { tt, type Lang } from "@/lib/locale";

type Props = {
  className?: string;
  /** Kept for existing callers; the line below is fixed and short. */
  max?: number;
  lang?: Lang;
};

/** One line of shop facts, each one checkable: year, address, hours and the Google profile. No slogans. */
export function TrustBadges({ className = "", lang = "en" }: Props) {
  const t = tt(lang);
  const hi = lang === "hi";
  const facts = [
    t("Since 1939", "1939 से"),
    hi ? `${siteHi.address.line1}, ${siteHi.address.city}` : `${site.address.line1}, ${site.address.city}`,
    t("Mon to Sat, 10 am to 8 pm. Sunday closed", "सोम से शनि, 10 से 8। रविवार बंद"),
    hi
      ? `गूगल पर ${site.googleReview.reviewCount} रिव्यू से ${site.googleReview.rating}`
      : `Google ${site.googleReview.rating} from ${site.googleReview.reviewCount} reviews`,
  ];
  return (
    <p
      className={`border-y border-border py-3 font-mono-brand text-xs uppercase leading-relaxed tracking-[0.12em] text-muted-foreground ${className}`}
    >
      {facts.map((f, i) => (
        <span key={f}>
          {i > 0 && <span className="mx-2 text-primary" aria-hidden="true">/</span>}
          {f}
        </span>
      ))}
    </p>
  );
}
