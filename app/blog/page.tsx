import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "@/content/blog/posts";
import { site } from "@/lib/site";
import { buildPageMeta } from "@/lib/seo";
import { PageHero, btnMain } from "@/components/site/PageHero";

export const metadata: Metadata = buildPageMeta({
  title: `Blog | Iron & Hardware Guides, Indore & Siyaganj | ${site.name}`,
  description:
    "Plain guides on wire mesh, TMT bars, fencing, perforated sheets and hardware for buyers in Indore, Siyaganj and Loha Mandi.",
  path: "blog",
  keywords: ["wire mesh Indore", "TMT bars Indore", "fencing Siyaganj", "hardware guide Indore", "Loha Mandi Indore"],
});

export default async function BlogIndexPage() {
  const posts = await getAllPosts();
  const [lead, ...rest] = posts;

  return (
    <>
      <PageHero
        eyebrow="The buyer's guide"
        title="Know the material before you buy it"
        lede="Plain guides from the counter on wire mesh, TMT bars, fencing, perforated sheets and hardware. Written for people buying in Indore."
        compact
      />

      <section className="py-14 md:py-20">
        <div className="page-container">
          {lead && (
            <Link
              href={`/blog/${lead.slug}`}
              className="group grid overflow-hidden rounded-sm border border-border bg-card transition-shadow hover:shadow-xl lg:grid-cols-[1.2fr_1fr]"
            >
              <span className="relative block aspect-[16/10] bg-secondary lg:aspect-auto lg:min-h-[22rem]">
                {lead.image && (
                  <Image src={lead.image} alt={lead.imageAlt || lead.title} fill priority sizes="(max-width:1024px) 100vw, 55vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                )}
              </span>
              <span className="flex flex-col justify-center p-7 md:p-10">
                <span className="font-mono-brand text-xs uppercase tracking-[0.16em] text-muted-foreground">Latest{lead.date ? ` · ${lead.date}` : ""}</span>
                <span className="mt-3 font-display text-4xl font-extrabold uppercase leading-none text-foreground md:text-5xl">{lead.title}</span>
                {lead.description && <span className="mt-4 line-clamp-3 text-muted-foreground">{lead.description}</span>}
                <span className="mt-6 text-sm font-bold text-foreground underline underline-offset-4 group-hover:text-primary">Read the guide</span>
              </span>
            </Link>
          )}

          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-sm border border-border bg-card transition-shadow hover:shadow-xl"
                >
                  <span className="relative block aspect-[16/10] bg-secondary">
                    {post.image && (
                      <Image src={post.image} alt={post.imageAlt || post.title} fill sizes="(max-width:640px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    )}
                  </span>
                  <span className="flex flex-1 flex-col p-5">
                    <span className="font-mono-brand text-xs uppercase tracking-[0.16em] text-muted-foreground">
                      {post.category ? `${post.category} · ` : ""}{post.readingMinutes} min read
                    </span>
                    <span className="mt-2 font-display text-3xl font-extrabold uppercase leading-none text-foreground">{post.title}</span>
                    {post.description && <span className="mt-3 line-clamp-3 text-sm text-muted-foreground">{post.description}</span>}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {posts.length === 0 && <p className="text-muted-foreground">No guides yet. Check back soon.</p>}
        </div>
      </section>

      <section className="bg-nav py-14 text-white md:py-20">
        <div className="page-container flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <h2 className="text-white">Still unsure what to buy?</h2>
          <Link href="/contact" className={btnMain}>Ask the counter</Link>
        </div>
      </section>
    </>
  );
}
