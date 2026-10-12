import { breadcrumbList, localizeSchema } from "@/lib/schema";
import type { Lang } from "@/lib/locale";

type BreadcrumbItem = { name: string; url: string };

export function JsonLdBreadcrumb({ items, lang = "en" }: { items: BreadcrumbItem[]; lang?: Lang }) {
  if (items.length === 0) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(localizeSchema(breadcrumbList(items), lang)).replace(/</g, "\\u003c") }}
    />
  );
}
