import type { CSSProperties, ReactNode } from "react";

/**
 * The shop's mark-making kit. Four marks, all drawn from the counter and the godown:
 * the wire-gauge ruler, the jali weave, the stencil tag and the counter stamp.
 * Used with restraint: one or two per page, never as wallpaper.
 */

/** A wire-gauge ruler: minor tick every 8px, a long tick every 80px. Purely a rule, hidden from assistive tech. */
export function GaugeRule({
  label,
  className = "",
  tone = "muted",
}: {
  label?: ReactNode;
  className?: string;
  tone?: "muted" | "primary";
}) {
  return (
    <div className={`gauge-rule gauge-rule-${tone} ${className}`} aria-hidden={label ? undefined : true}>
      {label ? <span className="gauge-rule-label">{label}</span> : null}
    </div>
  );
}

/** Woven diamond mesh, faded to its edges. Position it with className; it never takes pointer events. */
export function JaliWeave({
  className = "",
  size = 22,
  style,
}: {
  className?: string;
  size?: number;
  style?: CSSProperties;
}) {
  return (
    <div
      className={`jali-weave ${className}`}
      style={{ ["--jali" as string]: `${size}px`, ...style }}
      aria-hidden="true"
    />
  );
}

/** Hot-rolled stencil lettering for codes and sizes, e.g. "MS ANGLE 40 x 40 x 5". */
export function StencilTag({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`stencil-tag ${className}`}>{children}</span>;
}

/** A rubber stamp from the counter. Says what the shop actually does; never a certification. */
export function CounterStamp({
  children,
  sub,
  className = "",
  tilt = -3,
}: {
  children: ReactNode;
  sub?: ReactNode;
  className?: string;
  tilt?: number;
}) {
  return (
    <div className={`counter-stamp ${className}`} style={{ ["--tilt" as string]: `${tilt}deg` }}>
      <span className="counter-stamp-main">{children}</span>
      {sub ? <span className="counter-stamp-sub">{sub}</span> : null}
    </div>
  );
}
