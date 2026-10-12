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
    <section className="border-t border-border py-14 md:py-20" aria-labelledby="journal-heading">
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
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {posts.map((p, i) => (
            <li key={p.slug} data-reveal style={{ ["--rd" as string]: `${i * 90}ms` }}>
              <Link href={`/blog/${p.slug}`} className="group lift block overflow-hidden rounded-[22px] border border-border bg-card">
                <span className="relative block aspect-[4/3] overflow-hidden bg-secondary">
                  {p.image && (
                    <Image
                      src={p.image}
                      alt={p.imageAlt || p.title}
                      fill
                      sizes="(max-width:768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      style={{ objectPosition: p.imagePosition || "center" }}
                    />
                  )}
                  <span className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" aria-hidden="true" />
                  {p.category && <span className="glass-pill absolute left-3 top-3 px-3 py-1 text-[11px] font-bold uppercase tracking-wider">{p.category}</span>}
                </span>
                <span className="block p-5">
                  <span className="block font-display text-2xl font-extrabold uppercase leading-[1.02] text-foreground">{p.title}</span>
                  <span className="mt-2 block text-sm text-muted-foreground">{t(`${p.readingMinutes} min read`, `${p.readingMinutes} मिनट में पढ़ें`)}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
