import { site } from "@/content/site";

type Props = {
  className?: string;
  /** Kept for existing callers; the line below is fixed and short. */
  max?: number;
};

/** One line of shop facts, each one checkable: year, address, hours and the Google profile. No slogans. */
export function TrustBadges({ className = "" }: Props) {
  const facts = [
    "Since 1939",
    `${site.address.line1}, ${site.address.city}`,
    "Mon to Sat, 9 to 8. Sunday closed",
    `Google ${site.googleReview.rating} from ${site.googleReview.reviewCount} reviews`,
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
