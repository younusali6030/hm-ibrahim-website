import Image from "next/image";
import type { ReactNode } from "react";
import { GaugeRule, JaliWeave } from "@/components/motif/Motif";
import { LazySteelSheen } from "@/components/fx/Lazy";
import { LoopFilm } from "@/components/fx/LoopFilm";

type Props = {
  eyebrow: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  children?: ReactNode;
  image?: { src: string; alt: string };
  /** Smaller headline for long titles */
  compact?: boolean;
  /** One steel-sheen shader behind the header (static gradient when motion is off). Use on one page only. */
  sheen?: boolean;
  /** The rendered barbed-wire coil loop behind the header. Use on one page only. */
  film?: boolean;
};

/** The shared dark page header: eyebrow, display headline, lede, actions, optional photo. */
export function PageHero({ eyebrow, title, lede, children, image, compact, sheen, film }: Props) {
  return (
    <section className="relative overflow-hidden bg-nav text-white">
      {film ? (
        <>
          <LoopFilm />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070d14] via-[#070d14]/80 to-[#070d14]/20" aria-hidden="true" />
        </>
      ) : sheen ? (
        <LazySteelSheen />
      ) : null}
      {/* Jali weave, not a glow: the same mesh the shop sells, faded into the corner. */}
      <JaliWeave className="inset-y-0 right-0 w-full max-w-[56rem]" />
      <div className={"page-container relative grid items-center gap-10 py-10 md:py-20 " + (image ? "lg:grid-cols-[1.05fr_1fr]" : "")}>
        <div>
          <p className="flex items-center gap-3 font-mono-brand text-xs uppercase tracking-[0.16em] text-white/60">
            <span className="h-px w-8 bg-primary" aria-hidden="true" />
            {eyebrow}
          </p>
          <h1
            className="mt-3 text-white"
            style={{ fontSize: compact ? "clamp(2.1rem, 5.4vw, 4.6rem)" : "clamp(2.4rem, 6.5vw, 5.6rem)" }}
          >
            {title}
          </h1>
          {lede && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/80">{lede}</p>}
          {children && <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">{children}</div>}
        </div>
        {image && (
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm shadow-2xl ring-1 ring-white/15">
            <Image src={image.src} alt={image.alt} fill priority quality={60} sizes="(max-width:1024px) 100vw, 45vw" className="object-cover" />
          </div>
        )}
      </div>
      <div className="page-container relative pb-0">
        <GaugeRule />
      </div>
    </section>
  );
}

export const btnMain =
  "inline-flex min-h-[52px] items-center justify-center rounded-sm bg-primary px-7 font-bold text-primary-foreground transition hover:brightness-110";
export const btnGhostDark =
  "inline-flex min-h-[52px] items-center justify-center rounded-sm border border-white/40 px-7 font-semibold text-white hover:bg-white/10";
export const btnGhost =
  "inline-flex min-h-[48px] items-center justify-center rounded-sm border border-input bg-card px-6 font-semibold text-foreground hover:border-foreground/50";
