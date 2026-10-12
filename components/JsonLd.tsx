import { baseUrl, entityIds, site } from "@/lib/site";
import { categories } from "@/content/products";

/** Global schema for rich results & AI search. Uses @graph for multiple types. */
export function JsonLd() {
  const orgId = entityIds.organization;
  const webSiteId = entityIds.website;

  const address = {
    "@type": "PostalAddress" as const,
    streetAddress: `${site.address.line1}, ${site.address.line2}`,
    addressLocality: site.address.city,
    addressRegion: site.address.state,
    postalCode: site.address.pincode,
    addressCountry: site.address.country,
  };

  const openingHoursSpecification = [
    {
      "@type": "OpeningHoursSpecification" as const,
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "20:00",
    },
    {
      // Closed all day. Google's LocalBusiness docs: set both opens and closes to "00:00".
      "@type": "OpeningHoursSpecification" as const,
      dayOfWeek: "Sunday",
      opens: "00:00",
      closes: "00:00",
    },
  ];

  // Cities are City; states are AdministrativeArea. Vague entries ("Nearby areas") are not entities, so they are skipped.
  const cityNames = new Set(["Indore", "Dewas", "Ujjain", "Mhow", "Pithampur"]);
  const stateNames: Record<string, string> = {
    "Madhya Pradesh (MP)": "Madhya Pradesh",
    Maharashtra: "Maharashtra",
    Gujarat: "Gujarat",
    Rajasthan: "Rajasthan",
  };
  const areaServed = site.areasServed.flatMap((name): { "@type": string; name: string }[] => {
    if (cityNames.has(name)) return [{ "@type": "City" as const, name }];
    if (stateNames[name]) return [{ "@type": "AdministrativeArea" as const, name: stateNames[name] }];
    return [];
  });

  // No AggregateRating here: it is the business's own rating of itself (not eligible for review
  // rich results) and the 4.9 / 633 figures cannot be verified from this codebase. The figures
  // remain visible on-page via site.googleReview.

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
      "@id": entityIds.localBusiness,
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
      openingHoursSpecification,
      areaServed,
      priceRange: site.priceRange,
      paymentAccepted: "Cash, Bank Transfer, UPI",
      currenciesAccepted: "INR",
      ...(site.gstin ? { taxID: site.gstin } : {}),
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
