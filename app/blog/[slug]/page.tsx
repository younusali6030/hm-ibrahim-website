import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MessageCircle, Phone, ArrowRight } from "lucide-react";
import { getPostBySlug, getAllPostSlugs, getAllPosts } from "@/content/blog/posts";
import { extractToc, extractProductSlugs } from "@/content/blog/toc";
import { getProductBySlug, getRelatedProducts } from "@/content/products";
import { baseUrl, site as siteLib } from "@/lib/site";
import { site } from "@/content/site";
import { getWhatsAppLink } from "@/lib/utils";
import { buildPageMeta } from "@/lib/seo";
import { JsonLdBreadcrumb } from "@/components/JsonLdBreadcrumb";
import { MarkdownContent } from "@/components/MarkdownContent";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { PageHero, btnMain, btnGhostDark } from "@/components/site/PageHero";
import { ContactStrip } from "@/components/story/ContactStrip";
import { GaugeRule } from "@/components/motif/Motif";
import "@/components/story/story.css";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { PostCard, formatDate } from "@/components/blog/PostCard";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Blog" };

  const base = buildPageMeta({
    title: post.title,
    description: post.description || `${post.title}. A buying guide from our Siyaganj, Indore counter.`,
    path: `blog/${slug}`,
    keywords: [post.category ? `${post.category} Indore` : "", "Siyaganj", "Indore hardware", post.title].filter(Boolean),
    image: post.image ? { url: post.image, alt: post.imageAlt } : undefined,
  });
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updated || post.date,
      section: post.category,
    } as Metadata["openGraph"],
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: post.title, url: `/blog/${slug}` },
  ];

  const toc = extractToc(post.content).filter((t) => !/^(faqs?|frequently asked)/i.test(t.text) || true);
  // Products the guide links to, in order; topped up from the catalog's related mapping when the guide names fewer than three.
  const linked = extractProductSlugs(post.content, 6)
    .map((s) => getProductBySlug(s))
    .filter((p): p is NonNullable<typeof p> => !!p);
  const productCards = [...linked];
  if (linked[0] && productCards.length < 3) {
    for (const r of getRelatedProducts(linked[0].slug, 4)) {
      if (productCards.length >= 4) break;
      if (!productCards.some((p) => p.slug === r.slug)) productCards.push(r);
    }
  }

  const articleImages = [post.image, post.image2, post.image3].filter(Boolean) as string[];
  const abs = (src: string) => (src.startsWith("http") ? src : `${baseUrl}${src}`);
  const url = `${baseUrl}/blog/${slug}`;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: post.date,
    dateModified: post.updated || post.date,
    wordCount: post.wordCount,
    timeRequired: `PT${post.readingMinutes}M`,
    inLanguage: "en-IN",
    ...(post.category && { articleSection: post.category }),
    ...(articleImages.length > 0 && { image: articleImages.map(abs) }),
    author: { "@type": "Organization", name: siteLib.name, url: baseUrl },
    publisher: {
      "@type": "Organization",
      name: siteLib.name,
      url: baseUrl,
      logo: { "@type": "ImageObject", url: `${baseUrl}/logo-dark.png` },
    },
  };
  const faqSchema =
    post.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }
      : null;
  const videoSchema = post.video
    ? {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: post.videoCaption || post.title,
        description: post.videoCaption || post.description,
        thumbnailUrl: abs(post.video.replace(/\.mp4$/, ".jpg")),
        contentUrl: abs(post.video),
        uploadDate: post.date,
      }
    : null;

  const related = (await getAllPosts())
    .filter((p) => p.slug !== slug)
    .sort((a, b) => Number(b.category === post.category) - Number(a.category === post.category))
    .slice(0, 3);

  const waShare = `https://wa.me/?text=${encodeURIComponent(`${post.title} ${url}`)}`;
  const waAsk = getWhatsAppLink(site.whatsapp, `Hi, I read "${post.title}" on your blog. Please share price/availability.`);

  return (
    <article className="blog-article">
      <JsonLdBreadcrumb items={breadcrumbItems} />
      <SeoJsonLd data={articleSchema} />
      {faqSchema && <SeoJsonLd data={faqSchema} />}
      {videoSchema && <SeoJsonLd data={videoSchema} />}
      <ReadingProgress targetId="post-body" />

      <PageHero
        compact
        eyebrow={
          <>
            <Link href="/blog" className="hover:text-white">Buyer&apos;s guide</Link>
            {post.category ? <> / {post.category}</> : null}
          </>
        }
        title={post.title}
        lede={post.description || undefined}
        image={post.image ? { src: post.image, alt: post.imageAlt || post.title } : undefined}
      />

      <div className="page-container st-sec !pt-8 md:!pt-12">
        <p className="font-mono-brand text-xs uppercase tracking-[0.14em] text-muted-foreground">
          {post.date && (
            <>
              <time dateTime={post.updated || post.date}>{formatDate(post.updated || post.date)}</time>
              <span aria-hidden="true"> · </span>
            </>
          )}
          {post.readingMinutes} min read
          <span aria-hidden="true"> · </span>
          {siteLib.name}, Siyaganj, Indore, since 1939
        </p>

        <div className="mt-8 grid gap-10 lg:grid-cols-[13rem_minmax(0,42rem)] lg:justify-center lg:gap-16">
          <aside className="min-w-0 lg:order-first lg:sticky lg:top-28 lg:self-start" aria-label="Guide tools">
            {toc.length > 1 && (
              <>
                <details className="rounded-[10px] border border-border bg-card px-4 py-3 lg:hidden">
                  <summary className="flex min-h-[44px] cursor-pointer items-center text-sm font-bold uppercase tracking-[0.12em]">In this guide</summary>
                  <ol className="mt-2 space-y-1">
                    {toc.map((t) => (
                      <li key={t.id}>
                        <a href={`#${t.id}`} className="flex min-h-[44px] items-center text-[0.95rem] text-foreground/85 hover:text-primary">
                          {t.text}
                        </a>
                      </li>
                    ))}
                  </ol>
                </details>
                <nav className="hidden lg:block" aria-label="Table of contents">
                  <p className="st-eyebrow">In this guide</p>
                  <ol className="mt-3 border-t border-foreground/40">
                    {toc.map((t) => (
                      <li key={t.id} className="border-b border-border">
                        <a href={`#${t.id}`} className="block py-2 text-sm leading-snug text-foreground/80 hover:text-primary">
                          {t.text}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              </>
            )}
            <div className="mt-6 hidden gap-2 lg:flex lg:flex-col">
              <a href={waShare} target="_blank" rel="noopener noreferrer" className="st-link text-sm">
                Share on WhatsApp<span className="sr-only"> (opens in a new tab)</span>
              </a>
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="st-link text-sm">
                <Phone className="h-4 w-4" aria-hidden /> Call the counter
              </a>
            </div>
          </aside>

          <div id="post-body" className="min-w-0">
            {post.video && (
              <figure className="mx-auto mb-10 max-w-sm">
                <video
                  className="aspect-[9/16] w-full rounded-[14px] bg-black object-cover"
                  poster={post.video.replace(/\.mp4$/, ".jpg")}
                  controls
                  muted
                  playsInline
                  preload="none"
                >
                  <source src={post.video} type="video/mp4" />
                </video>
                {post.videoCaption && <figcaption className="mt-2 text-center text-sm text-muted-foreground">{post.videoCaption}</figcaption>}
              </figure>
            )}

            <MarkdownContent content={post.content} className="blog-prose" />

            {(post.image2 || post.image3) && (
              <div className="mt-12 grid gap-3 sm:grid-cols-2">
                {[
                  { src: post.image2, alt: post.image2Alt },
                  { src: post.image3, alt: post.image3Alt },
                ]
                  .filter((i) => i.src)
                  .map((i) => (
                    <figure key={i.src} className="m-0">
                      <div className="relative aspect-[16/10] overflow-hidden rounded-[14px] bg-secondary">
                        <Image src={i.src as string} alt={i.alt || post.title} fill sizes="(max-width:640px) 100vw, 400px" className="object-cover" />
                      </div>
                      {i.alt && <figcaption className="mt-2 text-sm text-muted-foreground">{i.alt}</figcaption>}
                    </figure>
                  ))}
              </div>
            )}

            {productCards.length > 0 && (
              <section className="mt-14" aria-labelledby="related-products-heading">
                <GaugeRule label="Related products" />
                <h2 id="related-products-heading" className="mt-6 text-foreground">From the shelf</h2>
                <ul className="st-ledger mt-5">
                  {productCards.map((p) => {
                    const img = p.images?.[0] ?? p.image;
                    return (
                      <li key={p.slug} className="border-b border-border">
                        <Link href={`/products/${p.slug}`} className="group flex min-h-[64px] items-center gap-4 py-3">
                          <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[10px] bg-secondary">
                            {img && <Image src={img} alt="" fill sizes="56px" className="object-cover" />}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block font-semibold text-foreground group-hover:text-primary">{p.name}</span>
                            <span className="block truncate text-sm text-muted-foreground">{p.shortDesc}</span>
                          </span>
                          <span className="shrink-0 text-sm font-semibold text-foreground">
                            Ask for rate <ArrowRight className="inline h-4 w-4" aria-hidden />
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}

            <div className="mt-12 flex flex-col gap-4 border-y border-foreground/30 py-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-display text-2xl font-extrabold uppercase leading-none">Buying this in Indore?</p>
                <p className="mt-2 text-sm text-muted-foreground">Send your list. We check stock and call back with rates.</p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Link href={`/contact${productCards[0] ? `?product=${productCards[0].slug}` : ""}`} className={btnMain}>
                  Get a quote
                </Link>
                <a href={waAsk} target="_blank" rel="noopener noreferrer" className={btnGhostDark}>
                  <MessageCircle className="mr-2 h-5 w-5" aria-hidden /> WhatsApp
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="st-sec st-sec-tint" aria-labelledby="related-heading">
          <div className="page-container">
            <h2 id="related-heading" className="text-foreground">Keep reading</h2>
            <ul className="mt-6 grid gap-5 md:grid-cols-3">
              {related.map((p) => (
                <li key={p.slug}>
                  <PostCard post={p} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <ContactStrip heading="Ask the counter" headingId="post-visit-heading" quoteHref={`/contact${productCards[0] ? `?product=${productCards[0].slug}` : ""}`} waMessage={`Hi, I read "${post.title}". Product, size and quantity I need: `} />
    </article>
  );
}
