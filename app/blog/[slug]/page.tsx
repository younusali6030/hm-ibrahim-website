import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getPostBySlug, getAllPostSlugs } from "@/content/blog/posts";
import { baseUrl, site } from "@/lib/site";
import { buildPageMeta } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
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
    keywords: ["blog Indore", "Siyaganj", post.title],
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
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    url: `${baseUrl}/blog/${slug}`,
    datePublished: post.date,
    ...(articleImages.length > 0 && {
      image: articleImages.map((src) =>
        src.startsWith("http") ? src : `${baseUrl}${src}`
      ),
    }),
    publisher: {
      "@type": "Organization",
      name: site.name,
      url: baseUrl,
    },
  };

  return (
    <article className="page-container section-padding">
      <JsonLdBreadcrumb items={breadcrumbItems} />
      <SeoJsonLd data={articleSchema} />
      <Breadcrumbs items={breadcrumbItems} className="mb-8" />

      <header className="mb-10 sm:mb-12">
        {(post.image || post.image2 || post.image3) && (
          <div className="mb-8 max-w-xl space-y-3">
            {post.image && (
              <div className="overflow-hidden rounded-lg border border-border bg-card">
                <Image
                  src={post.image}
                  alt={post.imageAlt || post.title}
                  width={576}
                  height={320}
                  className="h-auto max-h-[200px] w-full object-cover"
                  sizes="(max-width: 768px) 100vw, 576px"
                  priority
                />
              </div>
            )}
            {(post.image2 || post.image3) && (
              <div className="grid gap-2 sm:grid-cols-2">
                {post.image2 && (
                  <div className="overflow-hidden rounded-lg border border-border bg-card">
                    <Image
                      src={post.image2}
                      alt={post.image2Alt || post.title}
                      width={320}
                      height={180}
                      className="h-auto max-h-[140px] w-full object-cover"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </div>
                )}
                {post.image3 && (
                  <div className="overflow-hidden rounded-lg border border-border bg-card">
                    <Image
                      src={post.image3}
                      alt={post.image3Alt || post.title}
                      width={320}
                      height={180}
                      className="h-auto max-h-[140px] w-full object-cover"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        <h1 className="text-h1 font-heading font-bold text-foreground">
          {post.title}
        </h1>
        {post.date && (
          <p className="mt-3 text-small text-muted-foreground">{post.date}</p>
        )}
      </header>

      <div className="max-w-3xl">
        <MarkdownContent content={post.content} className="blog-prose" />
      </div>

      <footer className="mt-14 pt-10 border-t border-border">
        <p className="text-muted-foreground text-small">
          Request a quote in Indore or Siyaganj:{" "}
          <Link href="/quote" className="text-primary hover:underline">
            Request a Quote
          </Link>
          {" · "}
          <Link href="/contact" className="text-primary hover:underline">
            Contact
          </Link>
        </p>
        <Link
          href="/blog"
          className="mt-5 inline-block text-small text-primary hover:underline"
        >
          ← Back to Blog
        </Link>
      </footer>
    </article>
  );
}
