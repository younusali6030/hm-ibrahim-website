/**
 * Blog posts: metadata and content from Markdown files.
 * Files live in content/blog/posts/*.md (slug = filename without .md).
 */

import path from "path";
import fs from "fs/promises";
import matter from "gray-matter";
import type { Lang } from "@/lib/locale";

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  /** Hero image path. Optional. */
  image?: string;
  imageAlt?: string;
  /** CSS object-position for the hero image, e.g. "50% 30%". */
  imagePosition?: string;
  /** Extra images shown below hero (1–2). Optional. */
  image2?: string;
  image2Alt?: string;
  image3?: string;
  image3Alt?: string;
  /** Last edit date (ISO). Falls back to `date`. */
  updated?: string;
  /** Short topic label shown on cards and in JSON-LD. */
  category?: string;
  /** Optional silent loop from /public/videos, shown under the intro. */
  video?: string;
  videoCaption?: string;
  content: string;
  wordCount: number;
  readingMinutes: number;
  faqs: { question: string; answer: string }[];
  /** Language of title, description and body. A Hindi request for an untranslated post returns English with lang "en". */
  lang: Lang;
};

/** Pull question/answer pairs out of a "## FAQs" section written as **Question?** followed by the answer. */
export function extractFaqs(md: string): { question: string; answer: string }[] {
  const m = md.match(/^##\s+(?:FAQs?|Frequently asked questions|अक्सर पूछे जाने वाले सवाल)[^\n]*\n([\s\S]*?)(?=^##\s|\s*$(?![\s\S]))/im);
  if (!m) return [];
  const out: { question: string; answer: string }[] = [];
  let q: string | null = null;
  let a: string[] = [];
  const flush = () => {
    if (q && a.join(" ").trim()) out.push({ question: q, answer: a.join(" ").replace(/\s+/g, " ").trim() });
    q = null;
    a = [];
  };
  for (const line of m[1].split("\n")) {
    const qm = line.match(/^\*\*(.+?)\*\*\s*$/);
    if (qm) {
      flush();
      q = qm[1].trim();
    } else if (q && line.trim()) {
      a.push(line.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\*\*/g, ""));
    }
  }
  flush();
  return out;
}

const POSTS_DIR = path.join(process.cwd(), "content/blog/posts");

export async function getAllPostSlugs(): Promise<string[]> {
  try {
    const files = await fs.readdir(POSTS_DIR);
    return files.filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));
  } catch {
    return [];
  }
}

const POSTS_DIR_HI = path.join(process.cwd(), "content/blog/posts-hi");

/**
 * One post. For Hindi, the Hindi file supplies title, description, category, alt texts, caption and body;
 * dates, images and video come from the English file so the two cannot drift.
 */
export async function getPostBySlug(slug: string, lang: Lang = "en"): Promise<BlogPost | null> {
  try {
    const raw = await fs.readFile(path.join(POSTS_DIR, `${slug}.md`), "utf-8");
    const en = matter(raw);
    let data = en.data as Record<string, unknown>;
    let content = en.content;
    let used: Lang = "en";
    if (lang === "hi") {
      try {
        const hiRaw = await fs.readFile(path.join(POSTS_DIR_HI, `${slug}.md`), "utf-8");
        const hi = matter(hiRaw);
        data = { ...data, ...(hi.data as Record<string, unknown>) };
        content = hi.content;
        used = "hi";
      } catch {
        /* no Hindi file yet: fall back to English */
      }
    }
    const words = content.trim().split(/\s+/).length;
    return {
      slug,
      title: (data.title as string) || slug,
      description: (data.description as string) || "",
      date: (data.date as string) || "",
      image: (data.image as string) || undefined,
      imageAlt: (data.imageAlt as string) || undefined,
      imagePosition: (data.imagePosition as string) || undefined,
      image2: (data.image2 as string) || undefined,
      image2Alt: (data.image2Alt as string) || undefined,
      image3: (data.image3 as string) || undefined,
      image3Alt: (data.image3Alt as string) || undefined,
      updated: (data.updated as string) || undefined,
      category: (data.category as string) || undefined,
      video: (data.video as string) || undefined,
      videoCaption: (data.videoCaption as string) || undefined,
      content: content.trim(),
      wordCount: words,
      readingMinutes: Math.max(1, Math.round(words / (used === "hi" ? 180 : 210))),
      faqs: extractFaqs(content),
      lang: used,
    };
  } catch {
    return null;
  }
}

export async function getAllPosts(lang: Lang = "en"): Promise<BlogPost[]> {
  const slugs = await getAllPostSlugs();
  const posts: BlogPost[] = [];
  for (const slug of slugs) {
    const post = await getPostBySlug(slug, lang);
    if (post) posts.push(post);
  }
  posts.sort((a, b) => (b.date > a.date ? 1 : -1));
  return posts;
}

/** Slugs that have a Hindi translation on disk. */
export async function getHindiPostSlugs(): Promise<string[]> {
  try {
    const files = await fs.readdir(POSTS_DIR_HI);
    return files.filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));
  } catch {
    return [];
  }
}

/** Get post by slug for internal linking (title only). */
export async function getPostTitleBySlug(slug: string, lang: Lang = "en"): Promise<string | null> {
  const post = await getPostBySlug(slug, lang);
  return post?.title ?? null;
}
