import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "@/content/blog/posts";
import { baseUrl, site } from "@/lib/site";
import { buildPageMeta } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = buildPageMeta({
  title: `Blog | Iron & Hardware Tips, Indore & Siyaganj | ${site.name}`,
  description:
    "Guides on wire mesh, TMT bars, fencing, perforated sheets, and hardware in Indore, Siyaganj, Loha Mandi. Buyer tips and request a quote.",
  path: "blog",
  keywords: [
    "wire mesh Indore",
    "TMT bars Indore",
    "fencing Siyaganj",
    "hardware blog Indore",
    "Loha Mandi Indore",
  ],
});

export default async function BlogIndexPage() {
  const posts = await getAllPosts();
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
  ];

  return (
    <div className="page-container section-padding">
      <Breadcrumbs items={breadcrumbItems} className="mb-8" />
      <h1 className="text-h1 font-heading font-bold text-foreground">
        Blog
      </h1>
      <p className="mt-4 max-w-2xl text-body text-muted-foreground leading-relaxed">
        Guides and tips on wire mesh, TMT bars, fencing, perforated sheets, and hardware for buyers in Indore, Siyaganj, and Loha Mandi. Request a quote for any product.
      </p>

      <ul className="mt-12 space-y-8 sm:space-y-10">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary/50 hover:bg-card/80 sm:flex-row"
            >
              {post.image && (
                <div className="relative h-24 w-full shrink-0 sm:h-20 sm:w-28">
                  <Image
                    src={post.image}
                    alt={post.imageAlt || post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 112px"
                  />
                </div>
              )}
              <div className="flex min-w-0 flex-1 flex-col justify-center p-5 sm:p-6">
                <h2 className="text-h3 font-heading font-semibold text-foreground">
                  {post.title}
                </h2>
                {post.description && (
                  <p className="mt-2 text-small text-muted-foreground line-clamp-2 leading-relaxed">
                    {post.description}
                  </p>
                )}
                {post.date && (
                  <p className="mt-3 text-small text-muted-foreground">{post.date}</p>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {posts.length === 0 && (
        <p className="mt-12 text-muted-foreground">No posts yet. Check back soon.</p>
      )}
    </div>
  );
}
