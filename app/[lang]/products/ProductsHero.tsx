"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "@/components/LocaleLink";
import { ArrowUpRight, ChevronLeft } from "lucide-react";
import { useT } from "@/lib/i18n";
import { useCategoryFocus } from "./CategoryFocus";
import type { ShowroomApi } from "@/components/fx/products/showroom";
import { SHOWROOM_ITEMS } from "@/components/fx/products/showroomItems";
import { whenEngaged } from "@/components/fx/whenEngaged";

export type ShowcaseItem = { slug: string; name: string; shortDesc: string; categorySlug: string; categoryName: string };

const loadScene = () => import("@/components/fx/products/showroom");
const GROUPS = new Set<string>(SHOWROOM_ITEMS.map((i) => i.category));

/** Network or user preference says: do not spend a GPU on a hero. Reduced motion is honoured inside the scene. */
function heavyAllowed() {
  const c = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  if (c?.saveData) return false;
  if (c?.effectiveType && /(^|-)(2g|3g)$/.test(c.effectiveType)) return false;
  return true;
}

type Props = {
  eyebrow: ReactNode;
  title: ReactNode;
  lede: ReactNode;
  actions: ReactNode;
  items: ShowcaseItem[];
};

/**
 * The Products hero: headline on the left, a live 3D showroom filling the right two-thirds of the section.
 * Hover or focus a product to light it and name it; select it to frame it with a link to its page. The category
 * rail below shares one filter state with the scene (useCategoryFocus), so a filter also frames its group.
 */
export function ProductsHero({ eyebrow, title, lede, actions, items }: Props) {
  const t = useT();
  const { active, selected: filterSelected } = useCategoryFocus();
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<ShowroomApi | null>(null);
  const panelLink = useRef<HTMLAnchorElement>(null);
  const viaKeyboard = useRef(false);

  const [live, setLive] = useState(false);
  const [fallback, setFallback] = useState(false);
  const [ready, setReady] = useState(0);
  const [hovered, setHovered] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [labelSlug, setLabelSlug] = useState<string | null>(null);

  const bySlug = useMemo(() => new Map(items.map((i) => [i.slug, i])), [items]);
  const lit = picked ? null : focused ?? hovered;

  /* ------------------------------------------------------------ boot the scene on first input (or after 12 s) */
  useEffect(() => {
    const host = stageRef.current;
    const cv = canvasRef.current;
    if (!host || !cv) return;
    if (!heavyAllowed()) {
      setFallback(true);
      return;
    }
    let disposed = false;
    let api: ShowroomApi | null = null;
    let io: IntersectionObserver | null = null;
    let visible = true;
    let tabVisible = !document.hidden;
    let idle = 0;
    let timer = 0;
    const sync = () => {
      if (!api) return;
      if (visible && tabVisible) api.start();
      else api.stop();
    };
    const onVis = () => {
      tabVisible = !document.hidden;
      sync();
    };
    const boot = async () => {
      if (disposed) return;
      try {
        const mod = await loadScene();
        if (disposed) return;
        api = mod.default({ canvas: cv, host }) as ShowroomApi;
        apiRef.current = api;
        if (process.env.NODE_ENV !== "production" && location.search.includes("scene-debug")) {
          (window as unknown as { __scene?: unknown }).__scene = api;
        }
        api.onProject((p) => {
          const el = labelRef.current;
          if (!el) return;
          if (!p) {
            el.style.opacity = "0";
            setLabelSlug(null);
            return;
          }
          const w = host.clientWidth;
          const card = el.firstElementChild as HTMLElement | null;
          const half = (card?.offsetWidth ?? 140) / 2 + 10;
          const tall = (card?.offsetHeight ?? 70) + 8;
          const x = Math.min(w - half, Math.max(half, p.x));
          const y = Math.max(tall, p.y);
          el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
          el.style.opacity = "1";
          setLabelSlug((s) => (s === p.slug ? s : p.slug));
        });
        api.onFirstFrame(() => !disposed && setLive(true));
        io = new IntersectionObserver(
          ([e]) => {
            visible = e.isIntersecting;
            sync();
          },
          { threshold: 0.02 }
        );
        io.observe(host);
        document.addEventListener("visibilitychange", onVis);
        sync();
        setReady((n) => n + 1);
      } catch {
        // No WebGL: the poster and the product list are the finished hero.
        api?.dispose();
        api = null;
        apiRef.current = null;
        if (!disposed) setFallback(true);
      }
    };
    // Starts on the first input, or after 12 s (see whenEngaged). The poster and the product list below are a
    // complete page without the scene.
    const cancelEngaged = whenEngaged(boot);
    return () => {
      disposed = true;
      cancelEngaged();
      document.removeEventListener("visibilitychange", onVis);
      window.clearTimeout(timer);
      const cic = (window as unknown as { cancelIdleCallback?: (h: number) => void }).cancelIdleCallback;
      if (idle && cic) cic(idle);
      io?.disconnect();
      apiRef.current = null;
      api?.dispose();
      api = null;
    };
  }, []);

  /* ------------------------------------------------------------ state -> scene */
  useEffect(() => {
    apiRef.current?.select(picked);
  }, [picked, ready]);
  useEffect(() => {
    apiRef.current?.hover(picked ?? lit);
  }, [lit, picked, ready]);
  useEffect(() => {
    apiRef.current?.setGroup(active && GROUPS.has(active) ? active : null);
  }, [active, ready]);

  // A new category filter replaces a product selection: one shared filter, one thing in focus.
  const lastFilter = useRef<string | null>(filterSelected);
  useEffect(() => {
    if (lastFilter.current !== filterSelected) {
      lastFilter.current = filterSelected;
      setPicked(null);
    }
  }, [filterSelected]);

  // Keyboard selection moves focus to the panel's link so Enter again opens the product.
  useEffect(() => {
    if (picked && viaKeyboard.current) {
      viaKeyboard.current = false;
      panelLink.current?.focus({ preventScroll: true });
    }
  }, [picked]);

  /* ------------------------------------------------------------ pointer */
  const raf = useRef(0);
  const onMove = useCallback((e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const { clientX, clientY } = e;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const s = apiRef.current?.pick(clientX, clientY) ?? null;
      setHovered((h) => (h === s ? h : s));
    });
  }, []);
  const drag = useRef<{ x: number; moved: number } | null>(null);
  const dragged = useRef(false);
  const onDown = useCallback(
    (e: React.PointerEvent) => {
      dragged.current = false;
      if (picked) drag.current = { x: e.clientX, moved: 0 };
    },
    [picked]
  );
  const onDrag = useCallback((e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || (e.pointerType === "mouse" && e.buttons === 0)) return;
    const dx = e.clientX - d.x;
    d.x = e.clientX;
    d.moved += Math.abs(dx);
    if (d.moved > 6) dragged.current = true;
    apiRef.current?.orbit(-dx * 0.007);
  }, []);
  const onUp = useCallback(() => {
    drag.current = null;
  }, []);
  const onLeave = useCallback(() => {
    cancelAnimationFrame(raf.current);
    setHovered(null);
  }, []);
  const onClick = useCallback(
    (e: React.MouseEvent) => {
      if (dragged.current) {
        dragged.current = false;
        return;
      }
      const s = apiRef.current?.pick(e.clientX, e.clientY) ?? null;
      if (s && bySlug.has(s)) {
        setPicked(s);
        setHovered(null);
      } else if (picked) setPicked(null);
    },
    [bySlug, picked]
  );

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && picked) {
      setPicked(null);
      setFocused(null);
    }
  };

  const sel = picked ? bySlug.get(picked) : null;
  const labelItem = labelSlug ? bySlug.get(labelSlug) : null;
  const interactive = live && !fallback;

  return (
    <section className="relative isolate overflow-hidden bg-nav text-white" onKeyDown={onKey} aria-label={t("Product range", "प्रोडक्ट रेंज")}>
      <div className="relative">
        {/* Copy. Pointer events pass through to the scene except on the actions. */}
        <div className="page-container pointer-events-none relative z-10 py-8 md:py-14 lg:flex lg:min-h-[clamp(580px,74vh,720px)] lg:items-center">
          <div className="min-w-0 lg:max-w-[min(46%,40rem)]">
            <p className="flex items-center gap-3 font-mono-brand text-xs uppercase tracking-[0.16em] text-white/60">
              <span className="h-px w-8 bg-primary" aria-hidden="true" />
              {eyebrow}
            </p>
            <h1 className="mt-3 text-white" style={{ fontSize: "clamp(2.3rem, 4.6vw, 4.5rem)" }}>
              {title}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80">{lede}</p>
            <div className="pointer-events-auto mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">{actions}</div>
          </div>
        </div>

        {/* Stage: the right two-thirds on desktop, a band under the copy on a phone. */}
        <div
          ref={stageRef}
          onPointerDown={interactive ? onDown : undefined}
          onPointerMove={
            interactive
              ? (e) => {
                  onDrag(e);
                  onMove(e);
                }
              : undefined
          }
          onPointerUp={interactive ? onUp : undefined}
          onPointerCancel={interactive ? onUp : undefined}
          onPointerLeave={
            interactive
              ? () => {
                  onUp();
                  onLeave();
                }
              : undefined
          }
          onClick={interactive ? onClick : undefined}
          style={{ touchAction: "pan-y", cursor: interactive ? (picked ? "grab" : hovered ? "pointer" : undefined) : undefined }}
          className="relative z-0 h-[clamp(380px,128vw,620px)] w-full lg:absolute lg:inset-y-0 lg:left-[33%] lg:right-0 lg:h-auto lg:w-auto"
        >
          <div
            className="absolute inset-0 [mask-image:linear-gradient(180deg,transparent_0,#000_16%,#000_88%,transparent_100%)] lg:[-webkit-mask-composite:source-in] lg:[mask-composite:intersect] lg:[mask-image:linear-gradient(90deg,transparent_0,rgba(0,0,0,0.5)_10%,#000_26%,#000_100%),linear-gradient(180deg,transparent_0,#000_12%,#000_86%,transparent_100%)]"
            aria-hidden="true"
          >
            <picture>
              <source media="(max-width: 1023px)" type="image/avif" srcSet="/fx/products-showroom-m.avif" />
              <source media="(max-width: 1023px)" srcSet="/fx/products-showroom-m.jpg" />
              <source type="image/avif" srcSet="/fx/products-showroom.avif" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/fx/products-showroom.jpg"
                alt=""
                width={1600}
                height={1104}
                className="absolute inset-0 h-full w-full object-cover object-[60%_50%]"
                fetchPriority="high"
                decoding="async"
              />
            </picture>
            <canvas
              ref={canvasRef}
              tabIndex={-1}
              className="absolute inset-0 h-full w-full transition-opacity duration-700 ease-out"
              style={{ opacity: live && !fallback ? 1 : 0 }}
            />
          </div>

          {/* Name label that follows the lit product. */}
          <div
            ref={labelRef}
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 z-10 opacity-0 transition-opacity duration-150 will-change-transform"
          >
            <div className="-translate-x-1/2 -translate-y-full pb-3">
              <div className="relative whitespace-nowrap rounded-[4px] border border-white/20 bg-nav/90 px-3 py-1.5 shadow-lg backdrop-blur">
                <span className="font-display text-lg font-extrabold uppercase leading-none tracking-wide text-white">
                  {labelItem?.name}
                </span>
                <span className="mt-1 hidden items-center gap-1 font-mono-brand text-[10px] uppercase tracking-[0.14em] text-primary sm:flex">
                  {t("Select to view", "देखने के लिए चुनें")}
                  <ArrowUpRight className="h-3 w-3" aria-hidden />
                </span>
                <span className="absolute left-1/2 top-full h-3 w-px -translate-x-1/2 bg-primary" />
              </div>
            </div>
          </div>

          {/* Selected product. */}
          {sel && (
            <div className="absolute inset-x-3 bottom-3 z-20 rounded-[6px] border border-white/15 bg-nav/90 p-3 shadow-2xl backdrop-blur lg:inset-x-auto lg:p-4 lg:bottom-8 lg:right-8 lg:w-[23rem]">
              <p className="font-mono-brand text-[11px] uppercase tracking-[0.16em] text-primary">{sel.categoryName}</p>
              <h2 className="mt-1 font-display text-2xl font-extrabold uppercase leading-none text-white lg:text-3xl">{sel.name}</h2>
              <p className="mt-2 line-clamp-2 text-sm leading-snug text-white/70 max-lg:hidden">{sel.shortDesc}</p>
              <p className="mt-2 font-mono-brand text-[10px] uppercase tracking-[0.14em] text-white/50">{t("Drag to turn", "घुमाने के लिए खींचें")}</p>
              <div className="mt-3 flex gap-2 lg:mt-4 lg:flex-wrap">
                <Link
                  ref={panelLink}
                  href={`/products/${sel.slug}`}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-sm bg-primary px-4 font-bold lg:px-5 text-primary-foreground transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  {t("View product", "प्रोडक्ट देखें")}
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setPicked(null);
                    setFocused(null);
                  }}
                  className="inline-flex min-h-[44px] items-center gap-1 rounded-sm border border-white/35 px-3 text-sm font-semibold lg:px-4 lg:text-base text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden />
                  {t("Back to collection", "पूरी रेंज पर वापस")}
                </button>
              </div>
            </div>
          )}

          {/* Keyboard and screen-reader route to every product in the scene; the list is the visible fallback. */}
          <ul
            aria-label={t("Products in the collection", "कलेक्शन के प्रोडक्ट")}
            className={
              fallback
                ? "pointer-events-auto absolute inset-x-3 bottom-3 z-20 flex flex-wrap gap-2"
                : "sr-only focus-within:not-sr-only focus-within:pointer-events-auto focus-within:absolute focus-within:inset-x-3 focus-within:bottom-3 focus-within:z-20 focus-within:flex focus-within:flex-wrap focus-within:gap-2"
            }
          >
            {items.map((i) =>
              fallback ? (
                <li key={i.slug}>
                  <Link
                    href={`/products/${i.slug}`}
                    className="inline-flex min-h-[40px] items-center rounded-[6px] border border-white/20 bg-nav/80 px-3 text-sm font-semibold text-white backdrop-blur hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    {i.name}
                  </Link>
                </li>
              ) : (
                <li key={i.slug}>
                  <button
                    type="button"
                    aria-pressed={picked === i.slug}
                    onFocus={() => setFocused(i.slug)}
                    onBlur={() => setFocused((f) => (f === i.slug ? null : f))}
                    onClick={() => {
                      viaKeyboard.current = true;
                      setPicked(i.slug);
                    }}
                    className="inline-flex min-h-[40px] items-center rounded-[6px] border border-white/30 bg-nav/90 px-3 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    {i.name}
                  </button>
                </li>
              )
            )}
          </ul>
          <p className="sr-only" role="status" aria-live="polite">
            {sel ? sel.name : ""}
          </p>
        </div>
      </div>
    </section>
  );
}
