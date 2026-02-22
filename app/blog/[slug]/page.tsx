import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
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

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    url: `${baseUrl}/blog/${slug}`,
    datePublished: post.date,
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
      <Breadcrumbs items={breadcrumbItems} className="mb-6" />

      <header className="mb-8">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
          {post.title}
        </h1>
        {post.date && (
          <p className="mt-2 text-sm text-muted-foreground">{post.date}</p>
        )}
      </header>

      <MarkdownContent content={post.content} />

      <footer className="mt-10 pt-8 border-t border-border">
        <p className="text-muted-foreground text-sm">
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
          className="mt-4 inline-block text-sm text-primary hover:underline"
        >
          ← Back to Blog
        </Link>
      </footer>
    </article>
  );
}
