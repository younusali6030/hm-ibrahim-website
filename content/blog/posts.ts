/**
 * Blog posts: metadata and content from Markdown files.
 * Files live in content/blog/posts/*.md (slug = filename without .md).
 */

import path from "path";
import fs from "fs/promises";
import matter from "gray-matter";

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
};

/** Pull question/answer pairs out of a "## FAQs" section written as **Question?** followed by the answer. */
export function extractFaqs(md: string): { question: string; answer: string }[] {
  const m = md.match(/^##\s+(?:FAQs?|Frequently asked questions)[^\n]*\n([\s\S]*?)(?=^##\s|\s*$(?![\s\S]))/im);
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

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(POSTS_DIR, `${slug}.md`);
    const raw = await fs.readFile(fullPath, "utf-8");
    const { data, content } = matter(raw);
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
      wordCount: content.trim().split(/\s+/).length,
      readingMinutes: Math.max(1, Math.round(content.trim().split(/\s+/).length / 210)),
      faqs: extractFaqs(content),
    };
  } catch {
    return null;
  }
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const slugs = await getAllPostSlugs();
  const posts: BlogPost[] = [];
  for (const slug of slugs) {
    const post = await getPostBySlug(slug);
    if (post) posts.push(post);
  }
  posts.sort((a, b) => (b.date > a.date ? 1 : -1));
  return posts;
}

/** Get post by slug for internal linking (title only). */
export async function getPostTitleBySlug(slug: string): Promise<string | null> {
  const post = await getPostBySlug(slug);
  return post?.title ?? null;
}
