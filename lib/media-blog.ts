import blur from "@/content/media/blur-blog.json";

const map = blur as Record<string, string>;
export function blogBlur(src?: string): string | undefined {
  return src ? map[src] : undefined;
}
