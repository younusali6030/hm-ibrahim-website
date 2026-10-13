"use client";

import Link from "@/components/LocaleLink";
import NextLink from "next/link";
import Image from "next/image";
import { useMemo } from "react";
import { PostCard, formatDate, type PostCardData } from "@/components/blog/PostCard";
import { useBlogTopic } from "./BlogTopics";
import { topicCounts } from "./topicCounts";
import { useLang } from "@/lib/i18n";

type Props = {
  posts: PostCardData[];
  /** The post shown large at the top when no topic is selected. */
  leadSlug: string;
};

/** The featured guide and the reference grid. The topic chips in the hero narrow it; nothing reloads or jumps. */
/** Lead card link: an English-only guide seen from the Hindi site goes straight to the English page. */
function LeadLink({ slug, englishOnly, className, children }: { slug: string; englishOnly: boolean; className: string; children: React.ReactNode }) {
  return englishOnly ? (
    <NextLink href={`/blog/${slug}`} hrefLang="en" className={className}>
      {children}
    </NextLink>
  ) : (
    <Link href={`/blog/${slug}`} className={className}>
      {children}
    </Link>
  );
}

export function BlogLibrary({ posts, leadSlug }: Props) {
  const { lang } = useLang();
  const hi = lang === "hi";
  const { selected } = useBlogTopic();
  const fallback = hi ? "गाइड" : "Guides";
  const lead = posts.find((p) => p.slug === leadSlug) ?? posts[0];

  const groups = useMemo(() => {
    const list = selected ? posts.filter((p) => (p.category || fallback) === selected) : posts.filter((p) => p !== lead);
    const m = new Map<string, PostCardData[]>();
    for (const p of list) {
      const c = p.category || fallback;
      m.set(c, [...(m.get(c) ?? []), p]);
    }
    return Array.from(m.entries()).sort((a, b) => b[1].length - a[1].length);
  }, [posts, selected, lead, fallback]);

  const counts = useMemo(() => new Map(topicCounts(posts, fallback)), [posts, fallback]);

  return (
    <div>
      {lead && !selected && (
        <LeadLink
          slug={lead.slug}
          englishOnly={hi && lead.lang !== "hi"}
          className="group grid overflow-hidden rounded-[14px] border border-border bg-card shadow-[0_24px_50px_-28px_rgba(0,0,0,0.9)] transition-colors hover:border-foreground/40 lg:grid-cols-[1.1fr_1fr]"
        >
          <span className="relative block aspect-[3/1] bg-secondary sm:aspect-[16/10] lg:aspect-auto lg:min-h-[19rem]">
            {lead.image && (
              <Image
                src={lead.image}
                alt={lead.imageAlt || lead.title}
                fill
                priority
                sizes="(max-width:1024px) 100vw, 55vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                style={{ objectPosition: lead.imagePosition || "50% 50%" }}
              />
            )}
          </span>
          <span className="flex flex-col justify-center p-6 md:p-8">
            <span className="st-eyebrow">
              {hi ? "ताज़ा" : "Latest"}
              {lead.category ? ` · ${lead.category}` : ""}
            </span>
            <span lang={lead.lang !== lang ? lead.lang : undefined} className="mt-3 font-display text-3xl font-extrabold uppercase leading-[1] text-foreground md:text-[2.5rem]">
              {lead.title}
            </span>
            {lead.description && <span className="mt-3 line-clamp-3 text-muted-foreground">{lead.description}</span>}
            <span className="mt-5 font-mono-brand text-xs uppercase tracking-[0.14em] text-muted-foreground">
              {hi ? "प्रकाशित" : "Published"} <time dateTime={lead.date}>{formatDate(lead.date, lang)}</time> · {hi ? `${lead.readingMinutes} मिनट में पढ़ें` : `${lead.readingMinutes} min read`}
            </span>
            <span className="mt-4 text-sm font-bold text-foreground underline decoration-primary underline-offset-4">{hi ? "गाइड पढ़ें" : "Read the guide"}</span>
          </span>
        </LeadLink>
      )}

      {groups.map(([cat, list]) => (
        <div key={cat} id={`topic-${cat}`} className="mt-12 scroll-mt-28">
          <div className="flex items-end justify-between gap-4 border-b border-foreground/40 pb-3">
            <h2 className="text-foreground">{cat}</h2>
            <span className="font-mono-brand text-xs uppercase tracking-[0.14em] text-muted-foreground">
              {hi ? `${counts.get(cat) ?? list.length} गाइड` : `${counts.get(cat) ?? list.length} ${(counts.get(cat) ?? list.length) === 1 ? "guide" : "guides"}`}
            </span>
          </div>
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((post) => (
              <li key={post.slug}>
                <PostCard post={post} lang={lang} />
              </li>
            ))}
          </ul>
        </div>
      ))}
      {posts.length === 0 && <p className="text-muted-foreground">{hi ? "अभी कोई गाइड नहीं है। जल्द देखिए।" : "No guides yet. Check back soon."}</p>}
    </div>
  );
}
