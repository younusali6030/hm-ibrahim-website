import { globalGraph } from "@/lib/schema";

/** Global schema: Organization, HardwareStore/LocalBusiness and WebSite in one @graph. Built in lib/schema.ts. */
export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(globalGraph()).replace(/</g, "\\u003c") }}
    />
  );
}
