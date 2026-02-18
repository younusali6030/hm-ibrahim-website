/**
 * Helper to output JSON-LD schema safely. Use for Product, FAQ, BreadcrumbList, etc.
 */

type JsonLdSchema = Record<string, unknown>;

export function SeoJsonLd({ data }: { data: JsonLdSchema | JsonLdSchema[] }) {
  const json = Array.isArray(data) ? data : [data];
  return (
    <>
      {json.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      ))}
    </>
  );
}
