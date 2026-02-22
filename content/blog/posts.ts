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
  /** Extra images shown below hero (1–2). Optional. */
  image2?: string;
  image2Alt?: string;
  image3?: string;
  image3Alt?: string;
  content: string;
};

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
      image2: (data.image2 as string) || undefined,
      image2Alt: (data.image2Alt as string) || undefined,
      image3: (data.image3 as string) || undefined,
      image3Alt: (data.image3Alt as string) || undefined,
      content: content.trim(),
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
