"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import "./about.css";

export type AboutStat = { value?: number; decimals?: number; suffix?: string; text?: string; from?: number; label: string };

type Props = {
  eyebrow: ReactNode;
  title: ReactNode;
  lede: ReactNode;
  children: ReactNode;
  photo: { src: string; alt: string };
  place: string;
  stats: AboutStat[];
};

/** A figure that counts up to its value once, on entry. Server and reduced-motion render the final value. */
function Count({ value, decimals = 0, from }: { value: number; decimals?: number; from?: number }) {
  const [v, setV] = useState(value);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const start = from ?? 0;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / 1100);
      const e = 1 - Math.pow(1 - p, 3);
      setV(start + (value - start) * e);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    setV(start);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, from]);
  return <>{v.toFixed(decimals)}</>;
}

/**
 * The About hero: headline on the left, the real shopfront running to the right edge of the section and settling
 * into the page colour, a row of facts along the bottom. The photograph eases in once and then follows the pointer
 * by a few pixels; nothing inside the picture is warped.
 */
export function AboutHero({ eyebrow, title, lede, children, photo, place, stats }: Props) {
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = layer.current;
    if (!el) return;
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    const step = () => {
      raf = 0;
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      el.style.setProperty("--ab-px", `${(-x * 16).toFixed(2)}px`);
      el.style.setProperty("--ab-py", `${(-y * 10).toFixed(2)}px`);
      if (Math.abs(tx - x) > 0.002 || Math.abs(ty - y) > 0.002) raf = requestAnimationFrame(step);
    };
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(step);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="ab-hero relative isolate overflow-hidden bg-nav text-white">
      <div className="relative">
        <div className="page-container relative z-10 py-8 md:py-14 lg:flex lg:min-h-[clamp(520px,68vh,680px)] lg:items-center">
          <div className="ab-copy min-w-0 lg:max-w-[min(44%,38rem)]">
            <p className="flex items-center gap-3 font-mono-brand text-xs uppercase tracking-[0.16em] text-white/60">
              <span className="h-px w-8 bg-primary" aria-hidden="true" />
              {eyebrow}
            </p>
            <h1 className="mt-3 text-white" style={{ fontSize: "clamp(2.8rem, 5.6vw, 5.4rem)" }}>
              {title}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80">{lede}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">{children}</div>
          </div>
        </div>

        {/* The shopfront: right edge of the section on desktop, a band under the copy on a phone. */}
        <div className="ab-shot relative z-0 h-[clamp(260px,72vw,460px)] w-full lg:absolute lg:inset-y-0 lg:left-[42%] lg:right-0 lg:h-auto lg:w-auto">
          <div ref={layer} className="ab-shot-layer absolute inset-0">
            <Image src={photo.src} alt={photo.alt} fill priority quality={78} sizes="(max-width:1023px) 100vw, 62vw" className="object-cover object-[50%_32%]" />
          </div>
          <div className="ab-shot-grade pointer-events-none absolute inset-0" aria-hidden="true" />
          <p className="ab-place absolute bottom-5 right-5 z-10 flex items-center gap-2 font-mono-brand text-[11px] uppercase tracking-[0.16em] text-white/85 lg:bottom-7 lg:right-8">
            <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
            {place}
          </p>
        </div>
      </div>

      {/* Facts along the bottom edge. */}
      <div className="relative z-10 border-t border-white/10 bg-nav/70 backdrop-blur-sm">
        <dl className="page-container grid grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div key={s.label} className="ab-stat flex flex-col-reverse gap-1 border-white/10 py-5 pr-4 lg:py-6 [&:not(:first-child)]:lg:border-l [&:not(:first-child)]:lg:pl-8 [&:nth-child(even)]:max-lg:border-l [&:nth-child(even)]:max-lg:pl-5 [&:nth-child(n+3)]:max-lg:border-t" style={{ animationDelay: `${0.35 + i * 0.09}s` }}>
              <dt className="font-mono-brand text-[11px] uppercase leading-snug tracking-[0.14em] text-white/55">{s.label}</dt>
              <dd className="font-display text-[clamp(2.2rem,4vw,3.4rem)] font-extrabold leading-none tabular-nums text-white">
                {s.text ?? (
                  <>
                    <Count value={s.value ?? 0} decimals={s.decimals} from={s.from} />
                    {s.suffix && <span className="text-primary">{s.suffix}</span>}
                  </>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
