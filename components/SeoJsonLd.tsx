/**
 * Helper to output JSON-LD safely. Every node passes through sanitizeJsonLd (lib/schema.ts),
 * which strips offers, ratings, reviews and speakable and swaps duplicated business fragments for @id refs.
 */
import { sanitizeJsonLd } from "@/lib/schema";

type JsonLdSchema = Record<string, unknown>;

/** Escape "<" so a "</script>" inside a string can never close the tag early. */
const safe = (o: unknown) => JSON.stringify(o).replace(/</g, "\\u003c");

export function SeoJsonLd({ data }: { data: JsonLdSchema | JsonLdSchema[] }) {
  const json = Array.isArray(data) ? data : [data];
  return (
    <>
      {json.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: safe(sanitizeJsonLd(schema)) }} />
      ))}
    </>
  );
}
