"use client";

import Image from "next/image";
import { SceneHost } from "@/components/fx/SceneHost";
import { useT } from "@/lib/i18n";
import { deskKey, useBlogTopic } from "./BlogTopics";
import { useEffect, useState } from "react";

const loadScene = () => import("@/components/fx/blog/scene");

export type TopicArt = { topic: string; image: string; alt: string };

/**
 * "Understand the material before you order." The inspection desk. Topics that have a sample on the desk
 * (wire, mesh, structural steel, sheets) bring that sample into focus; the others cross-fade to an existing
 * article image for that topic. Nothing here carries a measurement: the caliper only shows a scale.
 */
export function BlogHeroArt({ art }: { art: TopicArt[] }) {
  const t = useT();
  const { active } = useBlogTopic();
  const [live, setLive] = useState(false);
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    const h = ric ? ric(() => setArmed(true), { timeout: 3000 }) : window.setTimeout(() => setArmed(true), 1500);
    return () => {
      const cic = (window as unknown as { cancelIdleCallback?: (h: number) => void }).cancelIdleCallback;
      if (ric && cic) cic(h);
      else window.clearTimeout(h);
    };
  }, []);

  const key = deskKey(active);
  const showArt = active !== null && (!key || !live);
  return (
    <>
      <SceneHost load={loadScene} poster="/fx/blog-art" posterNarrow="/fx/blog-art-m" focus={key} onLive={setLive} posterPosition="50% 52%" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_55%_55%,transparent_55%,rgba(7,13,20,0.5)_100%)]" aria-hidden="true" />
      {armed &&
        art.map((a) => {
          const on = showArt && a.topic === active;
          return (
            <div
              key={a.topic}
              aria-hidden="true"
              className={"pointer-events-none absolute inset-0 transition-opacity duration-300 " + (on ? "opacity-100" : "opacity-0")}
            >
              <Image src={a.image} alt="" fill sizes="(max-width:1024px) 100vw, 40vw" quality={60} className="object-cover" />
              <span className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#070d14]/85 to-transparent" />
            </div>
          );
        })}
      <p className="pointer-events-none absolute bottom-3 left-4 right-24 font-mono-brand text-[11px] uppercase tracking-[0.14em] text-white/70" aria-live="polite">
        {active ? <span className="text-primary">{active}</span> : <span className="text-white/50">{t("The inspection desk: mesh, sheet, bar and wire", "निरीक्षण की मेज़: जाली, शीट, सरिया और तार")}</span>}
      </p>
    </>
  );
}
