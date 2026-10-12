"use client";

import { usePathname } from "next/navigation";
import { indorePhotos } from "@/content/indoreStory";

/**
 * Photo credits for /indore, rendered by the root layout below the site footer so they are the last thing on the page.
 * Wikimedia Commons photos need author, licence and a link to the source.
 */
export function PageCredits() {
  const path = usePathname();
  if (path !== "/indore") return null;
  return (
    <section className="border-t border-white/10 bg-nav pb-28 pt-6 text-white md:pb-8" aria-labelledby="credits-heading">
      <div className="page-container">
        <h2 id="credits-heading" className="!font-mono-brand !text-[11px] !font-medium uppercase tracking-[0.16em] text-white/50">
          Photo credits
        </h2>
        <ul className="mt-3 grid gap-x-8 gap-y-2 text-xs leading-relaxed text-white/60 sm:grid-cols-2">
          {Object.values(indorePhotos).map((p) => (
            <li key={p.id}>
              <span className="text-white/80">{p.subject}</span>: photo by {p.author} via{" "}
              <a href={p.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-primary">
                Wikimedia Commons
              </a>
              , licensed{" "}
              <a href={p.licenseUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-primary">
                {p.license}
              </a>
              .
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-white/50">Shop photographs and reels are our own.</p>
      </div>
    </section>
  );
}
