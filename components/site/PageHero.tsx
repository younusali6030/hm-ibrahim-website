import Image from "next/image";
import type { ReactNode } from "react";

type Props = {
  eyebrow: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  children?: ReactNode;
  image?: { src: string; alt: string };
  /** Smaller headline for long titles */
  compact?: boolean;
};

/** The shared dark page header: eyebrow, display headline, lede, actions, optional photo. */
export function PageHero({ eyebrow, title, lede, children, image, compact }: Props) {
  return (
    <section className="relative overflow-hidden bg-nav text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{ background: "radial-gradient(ellipse 55% 90% at 90% 30%, rgba(249,115,22,0.16), transparent 70%)" }}
        aria-hidden="true"
      />
      <div className={"page-container relative grid items-center gap-10 py-12 md:py-20 " + (image ? "lg:grid-cols-[1.05fr_1fr]" : "")}>
        <div>
          <p className="font-mono-brand text-xs uppercase tracking-[0.16em] text-white/60">{eyebrow}</p>
          <h1
            className="mt-3 text-white"
            style={{ fontSize: compact ? "clamp(2.4rem, 5.4vw, 4.6rem)" : "clamp(2.8rem, 6.5vw, 5.6rem)" }}
          >
            {title}
          </h1>
          {lede && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/80">{lede}</p>}
          {children && <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">{children}</div>}
        </div>
        {image && (
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm shadow-2xl ring-1 ring-white/15">
            <Image src={image.src} alt={image.alt} fill priority sizes="(max-width:1024px) 100vw, 45vw" className="object-cover" />
          </div>
        )}
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
