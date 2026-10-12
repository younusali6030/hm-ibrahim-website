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
      className="group lift flex h-full flex-col overflow-hidden rounded-[22px] border border-border bg-card"
    >
      <span className="relative block aspect-[16/10] overflow-hidden bg-secondary">
        {post.image && (
          <Image
            src={post.image}
            alt={post.imageAlt || post.title}
            fill
            priority={priority}
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            style={{ objectPosition: post.imagePosition || "50% 50%" }}
          />
        )}
        <span className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" aria-hidden="true" />
        {post.category && (
          <span className="glass-pill absolute left-3 top-3 px-3 py-1 text-[11px] font-bold uppercase tracking-wider">{post.category}</span>
        )}
      </span>
      <span className="flex flex-1 flex-col p-5">
        <span className="font-display text-[1.7rem] font-extrabold uppercase leading-[1.02] text-foreground">{post.title}</span>
        {post.description && <span className="mt-3 line-clamp-3 text-[0.95rem] text-muted-foreground">{post.description}</span>}
        <span className="mt-auto flex items-center justify-between pt-4 font-mono-brand text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          <span>{post.readingMinutes} min read</span>
          <span className="text-primary transition-transform duration-300 group-hover:translate-x-1">Read →</span>
        </span>
      </span>
    </Link>
  );
}
