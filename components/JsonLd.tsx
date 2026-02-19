import { baseUrl, site } from "@/lib/site";
import { categories } from "@/content/products";

/** Global schema for rich results & AI search. Uses @graph for multiple types. */
export function JsonLd() {
  const orgId = `${baseUrl}#organization`;
  const webSiteId = `${baseUrl}#website`;

  const address = {
    "@type": "PostalAddress" as const,
    streetAddress: `${site.address.line1}, ${site.address.line2}`,
    addressLocality: site.address.city,
    addressRegion: site.address.state,
    postalCode: site.address.pincode,
    addressCountry: site.address.country,
  };

  const geo = {
    "@type": "GeoCoordinates" as const,
    latitude: "22.7196",
    longitude: "75.8577",
  };

  const openingHoursSpecification = [
    {
      "@type": "OpeningHoursSpecification" as const,
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "20:00",
    },
    {
      "@type": "OpeningHoursSpecification" as const,
      dayOfWeek: "Sunday",
      opens: "00:00",
      closes: "00:00",
    },
  ];

  const areaServed = site.areasServed.map((name) =>
    name === "Nearby areas" || name.includes("Maharashtra") || name.includes("Gujarat") || name.includes("Rajasthan")
      ? { "@type": "Place" as const, name }
      : { "@type": "City" as const, name }
  );

  const aggregateRating = site.googleReview
    ? {
        "@type": "AggregateRating" as const,
        ratingValue: site.googleReview.rating.toString(),
        reviewCount: site.googleReview.reviewCount.toString(),
        bestRating: "5",
        worstRating: "1",
        url: site.googleReview.profileUrl,
      }
    : undefined;

  const sameAs = [
    ...(site.social.facebook ? [site.social.facebook] : []),
    ...(site.social.instagram ? [site.social.instagram] : []),
    ...(site.social.linkedin ? [site.social.linkedin] : []),
    ...(site.social.twitter ? [site.social.twitter] : []),
  ].filter(Boolean);

  const hasOfferCatalog = {
    "@type": "OfferCatalog" as const,
    name: "Iron & Hardware Products",
    itemListElement: categories.map((c) => ({
      "@type": "OfferCatalog" as const,
      name: c.name,
      url: `${baseUrl}/products?category=${c.slug}`,
    })),
  };

  const graph = [
    {
      "@type": "Organization" as const,
      "@id": orgId,
      name: site.name,
      alternateName: site.legalName,
      url: baseUrl,
      logo: `${baseUrl}/logo-dark.png`,
      foundingDate: "1939",
      description: site.description,
      slogan: site.tagline,
      knowsAbout: [
        "Iron and steel",
        "MS angles",
        "TMT bars",
        "Wire mesh",
        "Barbed wire",
        "Chain link fencing",
        "GI pipes",
        "Construction hardware",
        "Wholesale iron Indore",
      ],
    },
    {
      "@type": "LocalBusiness" as const,
      "@id": `${baseUrl}#localbusiness`,
      parentOrganization: { "@id": orgId },
      name: site.name,
      alternateName: site.legalName,
      description: site.description,
      url: baseUrl,
      logo: `${baseUrl}/logo-dark.png`,
      image: `${baseUrl}/logo-dark.png`,
      telephone: site.phone.replace(/\s/g, ""),
      email: site.email,
      address,
      geo,
      openingHoursSpecification,
      areaServed,
      priceRange: site.priceRange,
      paymentAccepted: "Cash, Bank Transfer, UPI",
      currenciesAccepted: "INR",
      ...(site.gstin ? { taxID: site.gstin } : {}),
      ...(aggregateRating ? { aggregateRating } : {}),
      ...(sameAs.length ? { sameAs } : {}),
      hasOfferCatalog,
    },
    {
      "@type": "WebSite" as const,
      "@id": webSiteId,
      name: site.name,
      alternateName: site.legalName,
      url: baseUrl,
      description: site.description,
      publisher: { "@id": orgId },
      potentialAction: {
        "@type": "SearchAction" as const,
        target: {
          "@type": "EntryPoint" as const,
          urlTemplate: `${baseUrl}/products?view=all&q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
      inLanguage: "en-IN",
    },
  ];

  const schema = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
