import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "@/content/blog/posts";
import { baseUrl, site } from "@/lib/site";
import { buildPageMeta } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { GaugeRule } from "@/components/motif/Motif";
import { ContactStrip } from "@/components/story/ContactStrip";
import { T } from "@/lib/i18n";
import "@/components/story/story.css";
import { PostCard, formatDate } from "@/components/blog/PostCard";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { JsonLdBreadcrumb } from "@/components/JsonLdBreadcrumb";
import { slugifyHeading } from "@/content/blog/toc";

export const metadata: Metadata = buildPageMeta({
  title: "Hardware Buying Guides, Indore",
  description:
    "Plain buying guides on wire mesh, TMT bars, fencing, perforated sheets and hardware from an Indore stockist in Siyaganj. Sizes, weights, uses and how to check quality.",
  path: "blog",
  keywords: ["wire mesh guide Indore", "TMT bars weight chart", "fencing wire Siyaganj", "hardware buying guide Indore", "Loha Mandi Indore"],
});

export default async function BlogIndexPage() {
  const posts = await getAllPosts();
  const [lead, ...rest] = posts;

  const groups = new Map<string, typeof posts>();
  for (const p of rest) {
    const c = p.category || "Guides";
    groups.set(c, [...(groups.get(c) ?? []), p]);
  }
  const categories = Array.from(groups.entries()).sort((a, b) => b[1].length - a[1].length);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${site.name} buying guides`,
    url: `${baseUrl}/blog`,
    inLanguage: "en-IN",
    publisher: { "@type": "Organization", name: site.name, url: baseUrl },
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${baseUrl}/blog/${p.slug}`,
      datePublished: p.date,
      dateModified: p.updated || p.date,
      ...(p.image && { image: `${baseUrl}${p.image}` }),
    })),
  };

  return (
    <>
      <SeoJsonLd data={schema} />
      <JsonLdBreadcrumb items={[{ name: "Home", url: "/" }, { name: "Blog", url: "/blog" }]} />

      <PageHero
        eyebrow={<T en="The buyer's guide" hi="खरीदार की गाइड" />}
        title={<T en="Know the material before you buy it" hi="माल खरीदने से पहले उसे जान लीजिए" />}
        lede="Plain guides from the counter on wire mesh, TMT bars, fencing, perforated sheets and hardware. Written for people buying in Indore."
        compact
      >
        <div className="flex flex-wrap gap-2" aria-label="Topics">
          {categories.map(([c, list]) => (
            <a key={c} href={`#${slugifyHeading(c)}`} className="inline-flex min-h-[44px] items-center rounded-full border border-white/30 px-4 text-sm font-semibold text-white hover:bg-white/10">
              {c} <span className="text-white/50">{list.length}</span>
            </a>
          ))}
        </div>
      </PageHero>

      <section className="py-12 md:py-16">
        <div className="page-container">
          {lead && (
            <Link
              href={`/blog/${lead.slug}`}
              className="group grid overflow-hidden rounded-[14px] border border-border bg-card transition-colors hover:border-foreground/40 lg:grid-cols-[1.25fr_1fr]"
            >
              <span className="relative block aspect-[16/10] bg-secondary lg:aspect-auto lg:min-h-[24rem]">
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
              <span className="flex flex-col justify-center p-7 md:p-10">
                <span className="st-eyebrow">Latest{lead.category ? ` · ${lead.category}` : ""}</span>
                <span className="mt-4 font-display text-4xl font-extrabold uppercase leading-[0.98] text-foreground md:text-5xl">{lead.title}</span>
                {lead.description && <span className="mt-4 line-clamp-4 text-muted-foreground">{lead.description}</span>}
                <span className="mt-6 font-mono-brand text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  {formatDate(lead.date)} · {lead.readingMinutes} min read
                </span>
                <span className="mt-5 text-sm font-bold text-foreground underline decoration-primary underline-offset-4">Read the guide</span>
              </span>
            </Link>
          )}

          {categories.map(([cat, list]) => (
            <div key={cat} id={slugifyHeading(cat)} className="mt-14 scroll-mt-28">
              <div className="flex items-end justify-between gap-4 pb-3">
                <h2 className="text-foreground">{cat}</h2>
                <span className="font-mono-brand text-xs uppercase tracking-[0.14em] text-muted-foreground">{list.length} guides</span>
              </div>
              <GaugeRule />
              <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((post) => (
                  <li key={post.slug}>
                    <PostCard post={post} />
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {posts.length === 0 && <p className="text-muted-foreground">No guides yet. Check back soon.</p>}
        </div>
      </section>

      <ContactStrip heading="Still unsure what to buy?" headingId="ask-heading" waMessage="Hi, I read your buying guides. The job and material I need: " />
    </>
  );
}
