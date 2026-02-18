import { baseUrl } from "@/lib/site";

type BreadcrumbItem = { name: string; url: string };

export function JsonLdBreadcrumb({ items }: { items: BreadcrumbItem[] }) {
  if (items.length === 0) return null;
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${baseUrl}${item.url}`,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
