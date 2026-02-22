import type { Metadata } from "next";
import Link from "next/link";
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
      <Breadcrumbs items={breadcrumbItems} className="mb-6" />
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
        Blog
      </h1>
      <p className="mt-3 text-muted-foreground max-w-2xl">
        Guides and tips on wire mesh, TMT bars, fencing, perforated sheets, and hardware for buyers in Indore, Siyaganj, and Loha Mandi. Request a quote for any product.
      </p>

      <ul className="mt-10 space-y-6">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="block rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/50 hover:bg-card/80"
            >
              <h2 className="text-lg font-semibold text-foreground">{post.title}</h2>
              {post.description && (
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{post.description}</p>
              )}
              {post.date && (
                <p className="mt-2 text-xs text-muted-foreground">{post.date}</p>
              )}
            </Link>
          </li>
        ))}
      </ul>

      {posts.length === 0 && (
        <p className="mt-8 text-muted-foreground">No posts yet. Check back soon.</p>
      )}
    </div>
  );
}
