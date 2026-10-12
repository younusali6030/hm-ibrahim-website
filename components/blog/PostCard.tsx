import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/content/blog/posts";

export function formatDate(iso: string) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00Z");
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

export function PostCard({ post, priority = false }: { post: BlogPost; priority?: boolean }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[14px] border border-border bg-card transition-colors hover:border-foreground/40"
    >
      <span className="relative block aspect-[16/10] overflow-hidden bg-secondary">
        {post.image && (
          <Image
            src={post.image}
            alt={post.imageAlt || post.title}
            fill
            priority={priority}
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
            className="object-cover motion-safe:transition-transform motion-safe:duration-700 group-hover:scale-[1.03]"
            style={{ objectPosition: post.imagePosition || "50% 50%" }}
          />
        )}
        <span className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" aria-hidden="true" />
        {post.category && (
          <span className="absolute left-3 top-3 rounded-[6px] bg-[#070d14]/85 px-2.5 py-1 font-mono-brand text-[11px] uppercase tracking-[0.14em] text-white">{post.category}</span>
        )}
      </span>
      <span className="flex flex-1 flex-col p-5">
        <span className="font-display text-[1.7rem] font-extrabold uppercase leading-[1.02] text-foreground">{post.title}</span>
        {post.description && <span className="mt-3 line-clamp-3 text-[0.95rem] text-muted-foreground">{post.description}</span>}
        <span className="mt-auto flex items-center justify-between pt-4 font-mono-brand text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          <span>{post.readingMinutes} min read</span>
          <span className="text-foreground underline decoration-primary underline-offset-4">Read</span>
        </span>
      </span>
    </Link>
  );
}
