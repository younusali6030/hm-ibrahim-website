import type { ReactNode } from "react";
import "./story.css";

/** Mono eyebrow with the orange tick, display h2, optional plain lede. One per section, never stacked. */
export function SectionHead({
  eyebrow,
  title,
  lede,
  id,
  className = "",
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="st-eyebrow">{eyebrow}</p>
      <h2 id={id} className="mt-3 text-foreground">
        {title}
      </h2>
      {lede && <p className="st-lede mt-4">{lede}</p>}
    </div>
  );
}
