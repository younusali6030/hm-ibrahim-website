import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { GaugeRule, JaliWeave } from "@/components/motif/Motif";
import { LazySteelSheen } from "@/components/fx/Lazy";
import { WireHero } from "@/components/fx/WireHero";

type Props = {
  eyebrow: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  children?: ReactNode;
  image?: { src: string; alt: string };
  /** Smaller headline for long titles */
  compact?: boolean;
  /** One steel-sheen shader behind the header (static gradient when motion is off). */
  sheen?: boolean;
  /** The live barbed-wire and chain-link scene behind the header (poster when motion is off). Brands only. */
  film?: boolean;
  /**
   * Page-specific artwork for the right-hand column (about 45% of the width on desktop, below the copy on a phone).
   * The slot reserves its own height, so nothing shifts when a canvas or photo arrives. Drops the repeated
   * ruler and corner mesh: the artwork carries the page instead.
   */
  art?: ReactNode;
  /** Aspect ratio of the art slot: `aspect` from the lg breakpoint up, `mobileAspect` below it (e.g. "1.14", "5 / 4"). */
  artSize?: { aspect: string; mobileAspect?: string };
  /** Let the artwork draw its own frame (no clipping box, ring or background). */
  artBare?: boolean;
  /** The artwork sets its own height (a map with a list under it). Reserve it inside the component instead. */
  artAuto?: boolean;
  /** Less padding above and below, for a hero that carries its own footer and should hand over to the page sooner. */
  dense?: boolean;
  /** Extra block in the copy column, under the actions (a row of facts). */
  after?: ReactNode;
  /** Headline size override, e.g. "clamp(2.2rem, 4.4vw, 4.2rem)". Scales to the column, not the viewport alone. */
  titleSize?: string;
  /** Anything that belongs at the very bottom of the hero (a search rail, a topic row). Full container width. */
  footer?: ReactNode;
  className?: string;
};

/** The shared dark page header: eyebrow, display headline, lede, actions, optional photo or artwork. */
export function PageHero({ eyebrow, title, lede, children, image, compact, sheen, film, art, artSize, artBare, artAuto, dense, after, titleSize, footer, className = "" }: Props) {
  const flat = Boolean(art || film);
  const size = titleSize ?? (compact ? "clamp(2.1rem, 5.4vw, 4.6rem)" : "clamp(2.4rem, 6.5vw, 5.6rem)");
  const artStyle = artSize
    ? ({ ["--art-lg" as string]: artSize.aspect, ["--art-aspect" as string]: artSize.mobileAspect ?? "4 / 3" } as CSSProperties)
    : undefined;
  return (
    <section className={"relative overflow-hidden bg-nav text-white " + className}>
      {film ? (
        <>
          <WireHero />
          {/* Keeps the headline and buttons readable: solid on the left, clear over the product on the right. */}
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(7,13,20,0.94)_0%,rgba(7,13,20,0.78)_38%,rgba(7,13,20,0.2)_64%,rgba(7,13,20,0)_100%)] max-sm:bg-[linear-gradient(180deg,rgba(7,13,20,0.9)_0%,rgba(7,13,20,0.72)_55%,rgba(7,13,20,0.25)_100%)]"
            aria-hidden="true"
          />
          {/* The picture settles into the page colour at the bottom edge instead of being cut. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-nav" aria-hidden="true" />
        </>
      ) : sheen ? (
        <LazySteelSheen />
      ) : null}
      {/* Jali weave, not a glow: the same mesh the shop sells, faded into the corner. Only on pages without artwork. */}
      {!flat && <JaliWeave className="inset-y-0 right-0 w-full max-w-[56rem]" />}
      <div
        className={
          "page-container relative grid items-center gap-8 " +
          (dense ? "pb-6 pt-7 md:pb-7 md:pt-8 " : "py-8 md:py-14 ") +
          (art ? "lg:grid-cols-[minmax(0,11fr)_minmax(0,9fr)] lg:gap-12 " : film ? "max-sm:pb-48 " : image ? "md:py-20 lg:grid-cols-[1.05fr_1fr] " : "md:py-20 ")
        }
      >
        <div className="min-w-0">
          <p className="flex items-center gap-3 font-mono-brand text-xs uppercase tracking-[0.16em] text-white/60">
            <span className="h-px w-8 bg-primary" aria-hidden="true" />
            {eyebrow}
          </p>
          <h1 className="mt-3 text-white" style={{ fontSize: size }}>
            {title}
          </h1>
          {lede && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/80">{lede}</p>}
          {children && <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">{children}</div>}
          {after}
        </div>
        {art && (
          <div
            className={
              "relative isolate w-full " +
              (artAuto ? "" : "[aspect-ratio:var(--art-aspect,4/3)] lg:[aspect-ratio:var(--art-lg,1.14)] ") +
              (artBare ? "" : "overflow-hidden rounded-[10px] bg-[#0b1118] ring-1 ring-white/10")
            }
            style={artStyle}
          >
            {art}
          </div>
        )}
        {image && !art && (
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm shadow-2xl ring-1 ring-white/15">
            <Image src={image.src} alt={image.alt} fill priority quality={60} sizes="(max-width:1024px) 100vw, 45vw" className="object-cover" />
          </div>
        )}
      </div>
      {footer}
      {!flat && !footer && (
        <div className="page-container relative pb-0">
          <GaugeRule />
        </div>
      )}
    </section>
  );
}

export const btnMain =
  "inline-flex min-h-[52px] items-center justify-center rounded-sm bg-primary px-7 font-bold text-primary-foreground transition hover:brightness-110";
export const btnGhostDark =
  "inline-flex min-h-[52px] items-center justify-center rounded-sm border border-white/40 px-7 font-semibold text-white hover:bg-white/10";
export const btnGhost =
  "inline-flex min-h-[48px] items-center justify-center rounded-sm border border-input bg-card px-6 font-semibold text-foreground hover:border-foreground/50";
