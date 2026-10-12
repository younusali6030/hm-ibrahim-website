import Link from "@/components/LocaleLink";
import Image from "next/image";
import type { BlogPost } from "@/content/blog/posts";
import type { Lang } from "@/lib/locale";
import { blogBlur } from "@/lib/media-blog";

export function formatDate(iso: string, lang: Lang = "en") {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00Z");
  return d.toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

export function PostCard({ post, priority = false, lang = "en" }: { post: BlogPost; priority?: boolean; lang?: Lang }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full overflow-hidden rounded-[14px] border border-border bg-card transition-colors hover:border-foreground/40 sm:flex-col"
    >
      <span className="relative block aspect-square w-28 shrink-0 overflow-hidden bg-secondary sm:aspect-[16/10] sm:w-auto">
        {post.image && (
          <Image
            src={post.image}
            alt={post.imageAlt || post.title}
            fill
            priority={priority}
            {...(blogBlur(post.image) ? { placeholder: "blur" as const, blurDataURL: blogBlur(post.image) } : {})}
            sizes="(max-width:640px) 112px, (max-width:1024px) 50vw, 33vw"
            className="object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:[transform:perspective(1000px)_rotateX(1deg)_rotateY(-2deg)_scale(1.06)]"
            style={{ objectPosition: post.imagePosition || "50% 50%" }}
          />
        )}
        <span className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" aria-hidden="true" />
        {post.category && (
          <span className="absolute left-3 top-3 hidden rounded-[6px] bg-[#070d14]/85 px-2.5 py-1 font-mono-brand text-[11px] uppercase tracking-[0.14em] text-white sm:block">{post.category}</span>
        )}
      </span>
      <span className="flex min-w-0 flex-1 flex-col justify-center p-3 sm:justify-start sm:p-5">
        <span lang={post.lang !== lang ? post.lang : undefined} className="font-display text-xl font-extrabold uppercase leading-[1.05] text-foreground sm:text-[1.7rem] sm:leading-[1.02]">{post.title}</span>
        {post.description && <span className="mt-3 line-clamp-3 text-[0.95rem] text-muted-foreground max-sm:hidden">{post.description}</span>}
        <span className="mt-1 flex items-center justify-between font-mono-brand sm:mt-auto sm:pt-4 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          <span>{lang === "hi" ? `${post.readingMinutes} मिनट में पढ़ें` : `${post.readingMinutes} min read`}</span>
          <span className="text-foreground underline decoration-primary underline-offset-4">{lang === "hi" ? "पढ़ें" : "Read"}</span>
        </span>
      </span>
    </Link>
  );
}
