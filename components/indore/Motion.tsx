"use client";

import Image from "next/image";
import { useLang } from "@/lib/i18n";
import { useEffect, useRef, type ReactNode } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import "./indore.css";

/** Fade and rise when it scrolls into view. Content is in the HTML either way. */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Thin orange bar across the top that fills as you read down the page. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  // Always render the element: returning null here on the client only (reduced motion) broke hydration of the page.
  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-primary motion-reduce:invisible"
      style={{ scaleX }}
    />
  );
}

/** Pointer-driven 3D tilt. Does nothing on touch or with reduced motion. */
export function Tilt({ children, max = 7, className = "" }: { children: ReactNode; max?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const sx = useSpring(rx, { stiffness: 140, damping: 16 });
  const sy = useSpring(ry, { stiffness: 140, damping: 16 });
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <div
      ref={ref}
      className={className}
      style={{ perspective: 1100 }}
      onPointerMove={(e) => {
        if (e.pointerType === "touch") return;
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        ry.set(px * max * 2);
        rx.set(-py * max * 2);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      <motion.div style={{ rotateX: sx, rotateY: sy, transformStyle: "preserve-3d" }}>{children}</motion.div>
    </div>
  );
}

/** A photo that drifts and scales slowly against the scroll. */
export function ParallaxImage({
  src,
  alt,
  sizes,
  className = "",
  priority = false,
  position = "center",
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  position?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.18, 1.1, 1.18]);
  return (
    <div ref={ref} className={"relative overflow-hidden " + className}>
      <motion.div className="absolute inset-0" style={reduce ? undefined : { y, scale }}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
          style={{ objectPosition: position }}
        />
      </motion.div>
    </div>
  );
}

/** Counts up to a number when it enters the screen. The final value is in the HTML. */
export function CountUp({
  to,
  from = 0,
  decimals = 0,
  duration = 1.6,
  suffix = "",
}: {
  to: number;
  from?: number;
  decimals?: number;
  duration?: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!inView || reduce || !ref.current) return;
    const c = animate(from, to, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = v.toFixed(decimals) + suffix;
      },
    });
    return () => c.stop();
  }, [inView, reduce, from, to, decimals, duration, suffix]);
  return <span ref={ref}>{to.toFixed(decimals)}{suffix}</span>;
}

/** Looping ticker of place names. Decorative; the same names are in the page copy. */
export function PlaceMarquee({ items }: { items: string[] }) {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center gap-10 pr-10" aria-hidden={hidden || undefined}>
      {items.map((t) => (
        <li key={t} className="flex items-center gap-10 whitespace-nowrap">
          <span className="font-display text-2xl font-extrabold uppercase tracking-wide text-foreground/85 md:text-3xl">{t}</span>
          <span className="h-2 w-2 rotate-45 bg-primary" aria-hidden="true" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className="ind-marquee py-4">
      <div className="ind-marquee-track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

export type RingPhoto = { src: string; alt: string; label: string };

/** Five photos on a slowly turning 3D drum. Pauses on hover or focus; a plain grid with reduced motion. */
export function PhotoRing({ photos }: { photos: RingPhoto[] }) {
  const { lang } = useLang();
  return (
    <div className="ind-ring-scene" role="group" aria-label={lang === "hi" ? "इंदौर की तस्वीरें, धीरे-धीरे घूमती हुई" : "Photos of Indore, turning slowly"} tabIndex={0}>
      <div className="ind-ring-tilt">
        <div className="ind-ring">
          {photos.map((p, i) => (
            <figure key={p.src} className="ind-card" style={{ ["--i" as string]: i }}>
              <Image src={p.src} alt={p.alt} fill sizes="(max-width:768px) 62vw, 460px" className="object-cover" />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-10 font-mono-brand text-xs uppercase tracking-[0.16em] text-white">
                {p.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}
