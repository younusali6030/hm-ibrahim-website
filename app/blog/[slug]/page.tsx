import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getPostBySlug, getAllPostSlugs, getAllPosts } from "@/content/blog/posts";
import { baseUrl, site } from "@/lib/site";
import { buildPageMeta } from "@/lib/seo";
import { JsonLdBreadcrumb } from "@/components/JsonLdBreadcrumb";
import { MarkdownContent } from "@/components/MarkdownContent";
import { SeoJsonLd } from "@/components/SeoJsonLd";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Blog" };

  return buildPageMeta({
    title: `${post.title} | Blog | ${site.name}`,
    description: post.description || `${post.title}. Read on our blog. Indore, Siyaganj.`,
    path: `blog/${slug}`,
    keywords: ["blog Indore", "Siyaganj", post.category ?? "", post.title].filter(Boolean),
  });
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

  const articleImages = [post.image, post.image2, post.image3].filter(Boolean) as string[];
  const abs = (src: string) => (src.startsWith("http") ? src : `${baseUrl}${src}`);
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    url: `${baseUrl}/blog/${slug}`,
    mainEntityOfPage: `${baseUrl}/blog/${slug}`,
    datePublished: post.date,
    dateModified: post.updated || post.date,
    wordCount: post.wordCount,
    inLanguage: "en-IN",
    ...(post.category && { articleSection: post.category }),
    ...(articleImages.length > 0 && { image: articleImages.map(abs) }),
    author: { "@type": "Organization", name: site.name, url: baseUrl },
    publisher: {
      "@type": "Organization",
      name: site.name,
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

  const hero = post.image;

  return (
    <article>
      <JsonLdBreadcrumb items={breadcrumbItems} />
      <SeoJsonLd data={articleSchema} />
      {faqSchema && <SeoJsonLd data={faqSchema} />}
      {videoSchema && <SeoJsonLd data={videoSchema} />}

      <header className="bg-nav text-white">
        <div className="page-container grid items-end gap-8 py-12 md:py-20 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="font-mono-brand text-xs uppercase tracking-[0.16em] text-white/60">
              <Link href="/blog" className="hover:text-white">The buyer&apos;s guide</Link>
              {post.category ? ` · ${post.category}` : ""}
              {post.date ? ` · ${post.date}` : ""}
              {` · ${post.readingMinutes} min read`}
            </p>
            <h1 className="mt-4 text-white" style={{ fontSize: "clamp(2.4rem, 5.4vw, 4.6rem)" }}>
              {post.title}
            </h1>
            {post.description && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/80">{post.description}</p>}
          </div>
          {hero && (
            <div className="relative aspect-[16/10] overflow-hidden rounded-sm ring-1 ring-white/15">
              <Image src={hero} alt={post.imageAlt || post.title} fill priority sizes="(max-width:1024px) 100vw, 40vw" className="object-cover" />
            </div>
          )}
        </div>
      </header>

      <div className="page-container py-12 md:py-16">
        <div className="mx-auto max-w-3xl">
          {post.video && (
            <figure className="mb-10">
              <video
                className="aspect-video w-full rounded-sm bg-black object-cover"
                poster={post.video.replace(/\.mp4$/, ".jpg")}
                controls
                muted
                playsInline
                preload="none"
              >
                <source src={post.video} type="video/mp4" />
              </video>
              {post.videoCaption && <figcaption className="mt-2 text-sm text-muted-foreground">{post.videoCaption}</figcaption>}
            </figure>
          )}
          <MarkdownContent content={post.content} className="blog-prose" />
        </div>

        {(post.image2 || post.image3) && (
          <div className="mx-auto mt-12 grid max-w-3xl gap-3 sm:grid-cols-2">
            {[
              { src: post.image2, alt: post.image2Alt },
              { src: post.image3, alt: post.image3Alt },
            ]
              .filter((i) => i.src)
              .map((i) => (
                <div key={i.src} className="relative aspect-[16/10] overflow-hidden rounded-sm bg-secondary">
                  <Image src={i.src as string} alt={i.alt || post.title} fill sizes="(max-width:640px) 100vw, 380px" className="object-cover" />
                </div>
              ))}
          </div>
        )}
      </div>

      {related.length > 0 && (
        <section className="border-t border-border py-12 md:py-16" aria-labelledby="related-heading">
          <div className="page-container">
            <h2 id="related-heading" className="text-foreground">Keep reading</h2>
            <ul className="mt-6 grid gap-5 md:grid-cols-3">
              {related.map((p) => (
                <li key={p.slug}>
                  <Link href={`/blog/${p.slug}`} className="group block overflow-hidden rounded-sm border border-border bg-card">
                    <span className="relative block aspect-[16/10] bg-secondary">
                      {p.image && <Image src={p.image} alt={p.imageAlt || p.title} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />}
                    </span>
                    <span className="block p-4 font-display text-xl font-extrabold uppercase leading-tight text-foreground">{p.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="bg-nav py-14 text-white md:py-16">
        <div className="page-container flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-white">Buying this material in Indore?</h2>
            <p className="mt-2 max-w-xl text-white/80">Send your list and we call back with rates and stock.</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link href="/contact" className="inline-flex min-h-[52px] items-center justify-center rounded-sm bg-primary px-7 font-bold text-primary-foreground hover:brightness-110">
              Get a quote
            </Link>
            <Link href="/blog" className="inline-flex min-h-[52px] items-center justify-center rounded-sm border border-white/40 px-7 font-semibold text-white hover:bg-white/10">
              More guides
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
