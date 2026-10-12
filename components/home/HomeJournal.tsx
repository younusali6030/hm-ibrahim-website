"use client";

import Link from "@/components/LocaleLink";
import Image from "next/image";
import type { BlogPost } from "@/content/blog/posts";
import { T, useT } from "@/lib/i18n";

/** Latest buyer's guides, so the home page leads straight into the blog. */
export function HomeJournal({ posts }: { posts: BlogPost[] }) {
  const t = useT();
  if (posts.length === 0) return null;
  return (
    <section className="border-t border-border py-9 md:py-20" aria-labelledby="journal-heading">
      <div className="page-container">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono-brand text-xs uppercase tracking-[0.16em] text-muted-foreground"><T en="The buyer's guide" hi="खरीदार की गाइड" /></p>
            <h2 id="journal-heading" data-reveal className="mt-2 text-foreground"><T en="Know it before you buy it" hi="खरीदने से पहले जान लीजिए" /></h2>
          </div>
          <Link href="/blog" className="glass-pill px-5 py-2.5 text-sm font-bold">
            <T en="All guides" hi="सभी गाइड" /> →
          </Link>
        </div>
        <ul className="mt-5 grid gap-3 md:mt-8 md:grid-cols-3 md:gap-4">
          {posts.map((p, i) => (
            <li key={p.slug} data-reveal style={{ ["--rd" as string]: `${i * 90}ms` }}>
              <Link href={`/blog/${p.slug}`} className="group lift flex overflow-hidden rounded-[16px] border border-border bg-card md:block md:rounded-[22px]">
                <span className="relative block aspect-square w-28 shrink-0 overflow-hidden bg-secondary md:aspect-[4/3] md:w-auto">
                  {p.image && (
                    <Image
                      src={p.image}
                      alt={p.imageAlt || p.title}
                      fill
                      sizes="(max-width:768px) 112px, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      style={{ objectPosition: p.imagePosition || "center" }}
                    />
                  )}
                  <span className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" aria-hidden="true" />
                  {p.category && <span className="glass-pill absolute left-3 top-3 hidden px-3 py-1 md:block text-[11px] font-bold uppercase tracking-wider">{p.category}</span>}
                </span>
                <span className="flex min-w-0 flex-col justify-center p-3 md:block md:p-5">
                  <span className="block font-display text-xl font-extrabold uppercase leading-[1.05] text-foreground md:text-2xl md:leading-[1.02]">{p.title}</span>
                  <span className="mt-1 block text-sm text-muted-foreground md:mt-2">{t(`${p.readingMinutes} min read`, `${p.readingMinutes} मिनट में पढ़ें`)}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
