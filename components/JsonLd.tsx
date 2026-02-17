import { site } from "@/content/site";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hmibrahimco.com";

export function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${baseUrl}#organization`,
    name: site.name,
    alternateName: site.legalName,
    description: site.description,
    url: baseUrl,
    logo: `${baseUrl}/logo.svg`,
    image: `${baseUrl}/logo.svg`,
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
    geo: {
      "@type": "GeoCoordinates",
      latitude: "22.7196", // Approximate Indore coordinates - update with exact if available
      longitude: "75.8577",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:00",
        closes: "20:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Sunday",
        opens: "00:00",
        closes: "00:00",
      },
    ],
    areaServed: site.areasServed.map((name) => ({ 
      "@type": "City", 
      name,
      "@id": `https://www.wikidata.org/wiki/${name}`,
    })),
    priceRange: site.priceRange,
    paymentAccepted: "Cash, Bank Transfer, UPI",
    currenciesAccepted: "INR",
    ...(site.gstin ? { taxID: site.gstin } : {}),
    ...(site.googleReview ? {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: site.googleReview.rating.toString(),
        reviewCount: site.googleReview.reviewCount.toString(),
        bestRating: "5",
        worstRating: "1",
      },
    } : {}),
    sameAs: [
      ...(site.social.facebook ? [site.social.facebook] : []),
      ...(site.social.instagram ? [site.social.instagram] : []),
      ...(site.social.linkedin ? [site.social.linkedin] : []),
      ...(site.social.twitter ? [site.social.twitter] : []),
    ].filter(Boolean),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Iron & Hardware Products",
      itemListElement: [
        {
          "@type": "OfferCatalog",
          name: "Iron & Steel",
        },
        {
          "@type": "OfferCatalog",
          name: "Wire & Mesh",
        },
        {
          "@type": "OfferCatalog",
          name: "Pipes & Sections",
        },
        {
          "@type": "OfferCatalog",
          name: "Hardware & Tools",
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
