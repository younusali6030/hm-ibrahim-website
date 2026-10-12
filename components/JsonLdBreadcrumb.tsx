import { breadcrumbList } from "@/lib/schema";

type BreadcrumbItem = { name: string; url: string };

export function JsonLdBreadcrumb({ items }: { items: BreadcrumbItem[] }) {
  if (items.length === 0) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList(items)).replace(/</g, "\\u003c") }}
    />
  );
}
