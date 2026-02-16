import { site } from "@/content/site";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hmibrahimco.com";

export function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.name,
    alternateName: site.legalName,
    description: site.description,
    url: baseUrl,
    telephone: site.phone.replace(/\s/g, ""),
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${site.address.line1}, ${site.address.line2}`,
      addressLocality: site.address.city,
      addressRegion: site.address.state,
      postalCode: site.address.pincode,
      addressCountry: site.address.country,
    },
    openingHours: "Mo-Sa 09:00-20:00",
    areaServed: site.areasServed.map((name) => ({ "@type": "Place", name })),
    priceRange: site.priceRange,
    ...(site.gstin ? { taxID: site.gstin } : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
