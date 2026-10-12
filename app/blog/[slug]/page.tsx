import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MessageCircle, Phone, Clock, CalendarDays } from "lucide-react";
import { getPostBySlug, getAllPostSlugs, getAllPosts } from "@/content/blog/posts";
import { extractToc, extractProductSlugs } from "@/content/blog/toc";
import { getProductBySlug } from "@/content/products";
import { baseUrl, site as siteLib } from "@/lib/site";
import { site } from "@/content/site";
import { getWhatsAppLink } from "@/lib/utils";
import { buildPageMeta } from "@/lib/seo";
import { JsonLdBreadcrumb } from "@/components/JsonLdBreadcrumb";
import { MarkdownContent } from "@/components/MarkdownContent";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";
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
  const productCards = extractProductSlugs(post.content, 4)
    .map((s) => getProductBySlug(s))
    .filter((p): p is NonNullable<typeof p> => !!p);

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
    <article>
      <JsonLdBreadcrumb items={breadcrumbItems} />
      <SeoJsonLd data={articleSchema} />
      {faqSchema && <SeoJsonLd data={faqSchema} />}
      {videoSchema && <SeoJsonLd data={videoSchema} />}
      <ReadingProgress targetId="post-body" />

      <header className="relative overflow-hidden bg-nav text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{ background: "radial-gradient(ellipse 55% 90% at 90% 20%, rgba(249,115,22,0.16), transparent 70%)" }}
          aria-hidden="true"
        />
        <div className="page-container relative grid items-center gap-8 py-10 md:py-16 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Breadcrumbs items={breadcrumbItems.slice(0, -1)} className="mb-5 [&_*]:!text-white/70" />
            <div className="flex flex-wrap items-center gap-2">
              {post.category && <span className="glass-pill px-3 py-1 text-[11px] font-bold uppercase tracking-wider">{post.category}</span>}
              <span className="inline-flex items-center gap-1.5 font-mono-brand text-[11px] uppercase tracking-[0.14em] text-white/65">
                <Clock className="h-3.5 w-3.5" aria-hidden /> {post.readingMinutes} min read
              </span>
              {post.date && (
                <span className="inline-flex items-center gap-1.5 font-mono-brand text-[11px] uppercase tracking-[0.14em] text-white/65">
                  <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                  <time dateTime={post.updated || post.date}>{formatDate(post.updated || post.date)}</time>
                </span>
              )}
            </div>
            <h1 className="mt-4 text-white" style={{ fontSize: "clamp(2.3rem, 5.2vw, 4.4rem)" }}>
              {post.title}
            </h1>
            {post.description && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/80">{post.description}</p>}
            <p className="mt-6 text-sm text-white/60">
              By <span className="font-semibold text-white/90">{siteLib.name}</span>, Siyaganj, Indore · since 1939
            </p>
          </div>
          {post.image && (
            <div className="relative aspect-[16/10] overflow-hidden rounded-[28px] shadow-2xl ring-1 ring-white/15">
              <Image
                src={post.image}
                alt={post.imageAlt || post.title}
                fill
                priority
                sizes="(max-width:1024px) 100vw, 46vw"
                className="object-cover"
                style={{ objectPosition: post.imagePosition || "50% 50%" }}
              />
            </div>
          )}
        </div>
      </header>

      <div className="page-container py-10 md:py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-14">
          <div id="post-body" className="min-w-0">
            {toc.length > 1 && (
              <details className="glass mb-8 rounded-[22px] px-5 py-4 lg:hidden">
                <summary className="cursor-pointer list-none text-sm font-bold uppercase tracking-[0.12em]">In this guide</summary>
                <ol className="mt-3 space-y-1">
                  {toc.map((t) => (
                    <li key={t.id}>
                      <a href={`#${t.id}`} className="block py-1.5 text-[0.95rem] text-white/80 hover:text-primary">
                        {t.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </details>
            )}

            {post.video && (
              <figure className="mb-10 mx-auto max-w-sm">
                <video
                  className="aspect-[9/16] w-full rounded-[22px] bg-black object-cover"
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
                      <div className="relative aspect-[16/10] overflow-hidden rounded-[20px] bg-secondary">
                        <Image src={i.src as string} alt={i.alt || post.title} fill sizes="(max-width:640px) 100vw, 400px" className="object-cover" />
                      </div>
                      {i.alt && <figcaption className="mt-2 text-sm text-muted-foreground">{i.alt}</figcaption>}
                    </figure>
                  ))}
              </div>
            )}

            <div className="glass mt-12 flex flex-col gap-4 rounded-[24px] p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-display text-2xl font-extrabold uppercase leading-none">Buying this in Indore?</p>
                <p className="mt-2 text-sm text-white/75">Send your list. We check stock and call back with rates.</p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Link href={`/contact${productCards[0] ? `?product=${productCards[0].slug}` : ""}`} className="glass-btn glass-btn-main">
                  Get a quote
                </Link>
                <a href={waAsk} target="_blank" rel="noopener noreferrer" className="glass-btn">
                  <MessageCircle className="h-5 w-5" aria-hidden /> WhatsApp
                </a>
              </div>
            </div>
          </div>

          <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start" aria-label="Guide tools">
            {toc.length > 1 && (
              <nav className="glass hidden rounded-[22px] p-5 lg:block" aria-label="Table of contents">
                <p className="font-mono-brand text-[11px] uppercase tracking-[0.16em] text-white/60">In this guide</p>
                <ol className="mt-3 space-y-1">
                  {toc.map((t) => (
                    <li key={t.id}>
                      <a href={`#${t.id}`} className="block rounded-lg px-2 py-1.5 text-sm leading-snug text-white/80 transition hover:bg-white/10 hover:text-white">
                        {t.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            {productCards.length > 0 && (
              <div className="mt-5">
                <p className="font-mono-brand text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Mentioned in this guide</p>
                <ul className="mt-3 space-y-2">
                  {productCards.map((p) => (
                    <li key={p.slug}>
                      <Link href={`/products/${p.slug}`} className="lift flex items-center gap-3 rounded-2xl border border-border bg-card p-2.5 pr-4">
                        <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-secondary">
                          {(p.images?.[0] ?? p.image) && <Image src={(p.images?.[0] ?? p.image) as string} alt="" fill sizes="56px" className="object-cover" />}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-bold text-foreground">{p.name}</span>
                          <span className="block text-xs text-primary">See range →</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-5 flex gap-2">
              <a href={waShare} target="_blank" rel="noopener noreferrer" className="glass-pill flex-1 px-4 py-2.5 text-center text-sm font-semibold">
                Share on WhatsApp
              </a>
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="glass-pill flex items-center justify-center px-4 py-2.5" aria-label="Call us">
                <Phone className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </aside>
        </div>
      </div>

      {related.length > 0 && (
        <section className="border-t border-border py-12 md:py-16" aria-labelledby="related-heading">
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
    </article>
  );
}
