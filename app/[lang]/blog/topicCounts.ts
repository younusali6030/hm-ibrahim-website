/** Guides per topic, derived from the posts themselves, most guides first. Plain module: used by server and client. */
export function topicCounts(posts: { category?: string }[], fallback: string) {
  const m = new Map<string, number>();
  for (const p of posts) {
    const c = p.category || fallback;
    m.set(c, (m.get(c) ?? 0) + 1);
  }
  return Array.from(m.entries()).sort((a, b) => b[1] - a[1]);
}
