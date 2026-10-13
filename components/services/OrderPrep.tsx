"use client";

import { createContext, useContext, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Check } from "lucide-react";
import { SceneHost } from "@/components/fx/SceneHost";

export type StepKey = "list" | "check" | "prepare" | "handover";
export type PrepStep = { key: StepKey; label: string; line: string };

/** Words laid over the picture. They are page copy, passed in already translated. */
export type OrderSceneCopy = {
  listTitle: string;
  example: string;
  items: string[];
  fieldsTitle: string;
  fields: string[];
  preparedTitle: string;
  prepared: string;
  handover: { term: string; detail: string }[];
};

const ORDER: StepKey[] = ["list", "check", "prepare", "handover"];

const loadScene = () => import("@/components/fx/services/scene");

const POSTERS: Record<StepKey, string> = {
  list: "/fx/order-list",
  check: "/fx/order-check",
  prepare: "/fx/order-prepare",
  handover: "/fx/order-handover",
};

type Anchors = Record<"list" | "sheet" | "loose" | "order" | "group", [number, number]>;
/** Where those points fall in the posters (10:9), for when the live scene is not running. */
const FALLBACK: Anchors = { list: [19.6, 63.1], sheet: [12.2, 71.6], loose: [59.1, 69.5], order: [54.9, 69.8], group: [64.5, 59.4] };
/** What each step lights, and how wide. */
const SHADE: Record<StepKey, { on: keyof Anchors; size: number }> = {
  list: { on: "sheet", size: 0.9 },
  check: { on: "loose", size: 2.9 },
  prepare: { on: "group", size: 1.35 },
  handover: { on: "group", size: 1.15 },
};
const MASK =
  "[-webkit-mask-image:radial-gradient(closest-side,#000_70%,transparent_100%)] [mask-image:radial-gradient(closest-side,#000_70%,transparent_100%)]";

type Journey = { active: StepKey; setActive: (k: StepKey) => void; id: string };
const JourneyContext = createContext<Journey | null>(null);
const useJourney = () => {
  const j = useContext(JourneyContext);
  if (!j) throw new Error("OrderJourney is missing");
  return j;
};

/** Holds the chosen step for the picture (hero artwork) and the step selector (hero footer). */
export function OrderJourney({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<StepKey>("list");
  const id = useId();
  const value = useMemo(() => ({ active, setActive, id }), [active, id]);
  return <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>;
}

const paper =
  "pointer-events-auto absolute z-10 w-[min(14.5rem,62%)] rounded-[5px] bg-[#f3efe6] px-3 py-2.5 text-[#1a222b] shadow-[0_14px_30px_-12px_rgba(0,0,0,0.75)] motion-safe:animate-[scene-fade_0.3s_ease-out] max-sm:py-2 sm:px-3.5 sm:py-3";
const paperHead = "flex items-baseline justify-between gap-3 font-mono-brand text-[10.5px] uppercase tracking-[0.14em] text-[#1a222b]/70";
const reveal = "grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none";
/** A hairline from the card down to the thing it describes, ending in a dot on the object. */
const leader = "pointer-events-none absolute w-px bg-white/45 after:absolute after:-left-[3px] after:h-[7px] after:w-[7px] after:rounded-full after:bg-primary";

/**
 * The work table. One fixed view; the chosen step changes what is on it, and the words for that step sit over
 * the picture as real HTML (the list beside the clipboard, the handover note above the prepared order).
 */
export function OrderScene({ copy }: { copy: OrderSceneCopy }) {
  const { active, id } = useJourney();
  const box = useRef<HTMLDivElement>(null);
  const early = active === "list" || active === "check";

  // The scene reports where things are on screen; the leaders and the focus shade follow them.
  const [at, setAt] = useState<Anchors>(FALLBACK);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    // The posters are 10:9 and lose their top in a wider box: restate their anchors for this box.
    const k = (el.clientWidth / el.clientHeight) * 0.9;
    const fitted = Object.fromEntries(Object.entries(FALLBACK).map(([n, [x, y]]) => [n, [x, 100 - (100 - y) * k]])) as Anchors;
    setAt(fitted);
    const onAnchors = (ev: Event) => setAt({ ...fitted, ...(ev as CustomEvent<Anchors>).detail });
    el.addEventListener("scene-anchors", onAnchors);
    return () => el.removeEventListener("scene-anchors", onAnchors);
  }, []);
  const shade = SHADE[active];
  const [sx, sy] = at[shade.on];

  return (
    <div ref={box} className="relative -mb-7 -mt-3 aspect-[10/9] w-full lg:-mb-12 lg:-ml-10 lg:-mt-4 lg:aspect-[3/2] lg:w-[calc(100%+4.5rem)] lg:max-w-none">
      <SceneHost
        load={loadScene}
        poster={POSTERS.list}
        posterWidth={1000}
        posterHeight={900}
        posterPosition="50% 100%"
        focus={active}
        focusPosters={POSTERS}
        className={MASK}
      >
        {/* Everything but the subject of the step falls back into the page colour. */}
        <span
          className="pointer-events-none absolute -left-full -top-full h-[200%] w-[200%] bg-[radial-gradient(closest-side,transparent_0%,transparent_22%,rgba(14,22,30,0.82)_52%)] transition-transform duration-500 ease-out motion-reduce:transition-none"
          style={{ transform: `translate(${sx / 2}%, ${sy / 2}%) scale(${shade.size})` }}
          aria-hidden="true"
        />
      </SceneHost>
      <div
        role="tabpanel"
        id={`${id}-panel`}
        aria-labelledby={`${id}-tab-${active}`}
        className="pointer-events-none absolute inset-0"
      >
        {early ? (
          <>
            <span className={leader + " top-0 after:-bottom-[3px]"} style={{ left: `${at.list[0]}%`, height: `${at.list[1]}%` }} aria-hidden="true" />
            <div key="sheet" className={paper + " left-0 top-0"}>
              <p className={paperHead}>
                <span>{copy.listTitle}</span>
                <span className="normal-case tracking-normal text-[#1a222b]/55">{copy.example}</span>
              </p>
              <ol className="mt-1.5 space-y-0.5 text-[0.86rem] font-semibold leading-snug sm:text-[0.94rem]">
                {copy.items.map((item, i) => (
                  <li key={item} className="flex gap-2">
                    <span className="font-mono-brand text-[0.72rem] font-normal leading-[1.7] text-[#1a222b]/55" aria-hidden="true">
                      {i + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
              <div className={reveal + (active === "check" ? " grid-rows-[1fr] opacity-100" : " grid-rows-[0fr] opacity-0")} aria-hidden={active !== "check"}>
                <div className="overflow-hidden">
                  <p className={paperHead + " mt-2 border-t border-[#1a222b]/15 pt-1.5 sm:mt-2.5 sm:pt-2"}>{copy.fieldsTitle}</p>
                  <ul className="mt-1.5 flex gap-x-2.5 whitespace-nowrap text-[0.74rem] font-semibold sm:gap-x-3 sm:text-[0.86rem]">
                    {copy.fields.map((f) => (
                      <li key={f} className="flex items-center gap-0.5 sm:gap-1">
                        <Check className="h-3 w-3 text-[#c2500a] sm:h-3.5 sm:w-3.5" strokeWidth={3} aria-hidden />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <span className={leader + " bottom-9 hidden after:-top-[3px] lg:block"} style={{ left: `${at.order[0]}%`, top: `${at.order[1]}%` }} aria-hidden="true" />
            <div
              key="slip"
              className={paper + " right-0 top-0 lg:bottom-9 lg:left-[calc(var(--at)-1.25rem)] lg:right-auto lg:top-auto"}
              style={{ ["--at" as string]: `${at.order[0]}%` }}
            >
              <p className={paperHead}>{copy.preparedTitle}</p>
              <p className="mt-1 flex items-center gap-1.5 text-[0.86rem] font-semibold leading-snug sm:text-[0.94rem]">
                <Check className="h-3.5 w-3.5 shrink-0 text-[#c2500a]" strokeWidth={3} aria-hidden />
                {copy.prepared}
              </p>
              <div className={reveal + (active === "handover" ? " grid-rows-[1fr] opacity-100" : " grid-rows-[0fr] opacity-0")} aria-hidden={active !== "handover"}>
                <div className="overflow-hidden">
                  <dl className="mt-2 space-y-0.5 border-t border-[#1a222b]/15 pt-1.5 text-[0.8rem] leading-snug sm:mt-2.5 sm:space-y-1 sm:pt-2 sm:text-[0.86rem]">
                    {copy.handover.map((h) => (
                      <div key={h.term} className="flex gap-2">
                        <dt className="w-[4.4rem] shrink-0 font-mono-brand text-[10.5px] uppercase leading-[1.9] tracking-[0.12em] text-[#1a222b]/70">{h.term}</dt>
                        <dd className="font-semibold">{h.detail}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * The four steps as one connected line. Arrow keys, Home and End move along it; a click or tap picks a step.
 * From the lg breakpoint every step shows its sentence, so nothing moves when the choice changes; on a phone
 * the chosen step's sentence sits in a fixed-height line under the track.
 */
export function OrderRail({ steps, heading }: { steps: PrepStep[]; heading: string }) {
  const { active, setActive, id } = useJourney();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const at = ORDER.indexOf(active);
  const current = steps[at];

  const onKey = (ev: KeyboardEvent<HTMLDivElement>) => {
    const move: Record<string, number> = { ArrowRight: at + 1, ArrowDown: at + 1, ArrowLeft: at - 1, ArrowUp: at - 1, Home: 0, End: steps.length - 1 };
    if (!(ev.key in move)) return;
    ev.preventDefault();
    const next = (move[ev.key] + steps.length) % steps.length;
    setActive(steps[next].key);
    tabs.current[next]?.focus();
  };

  return (
    <div className="page-container relative pb-6 md:pb-7">
      <p id={`${id}-heading`} className="flex items-center gap-3 font-mono-brand text-xs uppercase tracking-[0.16em] text-white/60">
        {heading}
        <span className="h-px flex-1 bg-white/10" aria-hidden="true" />
      </p>
      <div role="tablist" aria-labelledby={`${id}-heading`} onKeyDown={onKey} className="relative mt-4 grid grid-cols-4">
        {/* The track runs from the first marker to the last; the orange part reaches the chosen step. */}
        <span className="pointer-events-none absolute left-[15px] right-[calc(25%-15px)] top-[14px] h-0.5 bg-white/15" aria-hidden="true">
          <span
            className="block h-full origin-left bg-primary transition-transform duration-500 ease-out motion-reduce:transition-none"
            style={{ transform: `scaleX(${at / (steps.length - 1)})` }}
          />
        </span>
        {steps.map((s, i) => {
          const on = i === at;
          const done = i < at;
          return (
            <button
              key={s.key}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${id}-tab-${s.key}`}
              aria-selected={on}
              aria-controls={`${id}-panel`}
              tabIndex={on ? 0 : -1}
              onClick={() => setActive(s.key)}
              className="group relative flex min-h-[72px] flex-col items-start rounded-[4px] pr-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-nav sm:pr-5"
            >
              <span
                className={
                  "flex h-[30px] w-[30px] items-center justify-center rounded-full border-2 font-mono-brand text-[12px] font-semibold transition-colors duration-300 " +
                  (on
                    ? "border-primary bg-primary text-primary-foreground shadow-[0_0_0_5px_hsl(var(--primary)/0.2)]"
                    : done
                      ? "border-primary bg-nav text-primary"
                      : "border-white/30 bg-nav text-white/70 group-hover:border-white/70 group-hover:text-white")
                }
                aria-hidden="true"
              >
                {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
              </span>
              <span
                className={
                  "mt-2.5 text-[0.84rem] font-semibold leading-tight transition-colors duration-300 sm:text-[1rem] " +
                  (on ? "text-white" : "text-white/65 group-hover:text-white")
                }
              >
                {s.label}
              </span>
              <span
                className={"mt-1.5 hidden text-[0.9rem] leading-snug transition-colors duration-300 lg:block " + (on ? "text-white/85" : "text-white/45")}
              >
                {s.line}
              </span>
            </button>
          );
        })}
      </div>
      <p className="mt-3 min-h-[2.8rem] text-[0.95rem] leading-snug text-white/85 lg:hidden" aria-live="polite">
        <span key={active} className="block motion-safe:animate-[scene-fade_0.3s_ease-out]">
          {current.line}
        </span>
      </p>
    </div>
  );
}
