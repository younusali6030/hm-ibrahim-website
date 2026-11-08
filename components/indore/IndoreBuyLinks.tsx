import Link from "@/components/LocaleLink";
import { ArrowRight, MapPin } from "lucide-react";
import { indorePages, type IndorePageSlug } from "@/content/indorePages";
import { indoreLinkLabels } from "@/content/indoreLinks";
import { indorePagesHi } from "@/content/hi/indore";
import type { Lang } from "@/lib/locale";

/**
 * "Buy in Indore": links from a guide or video to the /indore/* landing pages for the products it covers (TASK-032).
 * Renders nothing when no Indore page matches.
 */
export function IndoreBuyLinks({ slugs, lang, className = "" }: { slugs: IndorePageSlug[]; lang: Lang; className?: string }) {
  if (slugs.length === 0) return null;
  const hi = lang === "hi";
  return (
    <section className={className} aria-labelledby="indore-buy-heading">
      <h2 id="indore-buy-heading" className="text-foreground">
        {hi ? "इंदौर में खरीदें" : "Buy in Indore"}
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {slugs.map((slug) => {
          const page = indorePages[slug];
          const desc = hi ? indorePagesHi[slug].description : page.description;
          return (
            <li key={slug}>
              <Link
                href={`/indore/${slug}`}
                className="group flex h-full items-start gap-3 rounded-[14px] border border-border bg-card p-4 transition-colors hover:border-primary"
              >
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden />
                <span className="min-w-0">
                  <span className="block font-semibold text-foreground group-hover:text-primary">
                    {hi ? `इंदौर में ${indoreLinkLabels[slug].hi}` : `${indoreLinkLabels[slug].en} in Indore`}{" "}
                    <ArrowRight className="inline h-4 w-4" aria-hidden />
                  </span>
                  <span className="mt-1 block text-sm text-muted-foreground">{desc}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
