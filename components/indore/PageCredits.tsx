"use client";

import { usePathname } from "next/navigation";
import { indorePhotos } from "@/content/indoreStory";
import { indorePhotosHi } from "@/content/hi/indore";
import { stripLocale } from "@/lib/locale";
import { useLang } from "@/lib/i18n";

/**
 * Photo credits for /indore, rendered by the root layout below the site footer so they are the last thing on the page.
 * Wikimedia Commons photos need author, licence and a link to the source.
 */
export function PageCredits() {
  const path = stripLocale(usePathname() || "/").path;
  const { lang } = useLang();
  const hi = lang === "hi";
  if (path !== "/indore") return null;
  return (
    <section className="border-t border-white/10 bg-nav pb-28 pt-6 text-white md:pb-8" aria-labelledby="credits-heading">
      <div className="page-container">
        <h2 id="credits-heading" className="!font-mono-brand !text-[11px] !font-medium uppercase tracking-[0.16em] text-white/50">
          {hi ? "फ़ोटो क्रेडिट" : "Photo credits"}
        </h2>
        <ul className="mt-3 grid gap-x-8 gap-y-2 text-xs leading-relaxed text-white/60 sm:grid-cols-2">
          {Object.entries(indorePhotos).map(([key, p]) => (
            <li key={p.id}>
              <span className="text-white/80">{hi ? indorePhotosHi[key]?.subject ?? p.subject : p.subject}</span>
              {hi ? ": फ़ोटो " : ": photo by "}
              {p.author}
              {hi ? ", " : " via "}
              <a href={p.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-primary">
                {hi ? "विकिमीडिया कॉमन्स" : "Wikimedia Commons"}
              </a>
              {hi ? " से, लाइसेंस " : ", licensed "}
              <a href={p.licenseUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-primary">
                {p.license}
              </a>
              {hi ? "।" : "."}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-white/50">{hi ? "दुकान की तस्वीरें और रील हमारी अपनी हैं।" : "Shop photographs and reels are our own."}</p>
      </div>
    </section>
  );
}
