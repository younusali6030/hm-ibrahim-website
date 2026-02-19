/**
 * Single source of truth for company info, contact, and site config.
 * Edit this file to update address, phones, hours, and social links across the site.
 */

export const site = {
  name: "HM Ibrahim & Co",
  legalName: "H Mohammed Husain HM Ibrahim & Co",
  tagline: "Est. 1939 • Trusted Iron & Hardware Trading in Siyaganj, Indore",
  description:
    "Legacy iron and hardware trading in Siyaganj, Indore. Retail and wholesale supply of MS angles, TMT bars, pipes, wire, mesh, and construction hardware.",
  /** Manufacturer tagline for About and footer */
  manufacturerTagline: "Manufacturer of Wire Mesh, Welded Wire Mesh & SS Wire Mesh.",

  address: {
    line1: "60, Siyaganj Main Road",
    line2: "Opp. Tijori Gali, Siyaganj",
    city: "Indore",
    state: "Madhya Pradesh",
    pincode: "452007",
    country: "India",
  },

  /** Full address string for display and schema */
  get fullAddress(): string {
    const a = site.address;
    return `${a.line1}, ${a.line2}, ${a.city}, ${a.state} ${a.pincode}, ${a.country}`;
  },

  /** Landmark for "How to reach" */
  landmark: "Opposite Tijori Gali",

  /** Primary phone (used for Call button, WhatsApp, etc.) */
  phone: "+91 9826053563",
  /** Primary contact for above phone/email */
  phoneLabel: "Akbar Ali",
  /** Alternate phone */
  phoneAlt: "+91 9993078654",
  phoneAltLabel: "Shoeb Ali",

  /** WhatsApp number (with country code, no +). Used for wa.me links */
  whatsapp: "919826053563",

  /** Primary business email for quote/contact form submissions */
  email: "shoebali786@gmail.com",
  emailLabel: "Shoeb Ali",
  /** Alternate email */
  emailAlt: "akbar1972@rediffmail.com",
  emailAltLabel: "Akbar Ali",

  /** Opening hours - editable. Format: "Day: Time" or "Day: Closed" */
  hours: {
    weekdays: "Mon - Sat: 9:00 AM - 8:00 PM",
    sunday: "Sun: Closed",
    note: "Hours may vary on holidays.",
  },

  /** Optional: GSTIN. Set to empty string to hide from About/footer */
  gstin: "23AACFH8321H1ZP",

  /** Optional: social links. Use empty string to hide. */
  social: {
    facebook: "",
    instagram: "",
    linkedin: "",
    twitter: "",
  },

  /** IndiaMart & JustDial listing URLs — contact us via these platforms */
  indiamartUrl: "https://www.indiamart.com/mohhusain-haji-hm-ibrahim-and-company/?srsltid=AfmBOooSV6bbouv6mlXb45IfPpIiswPmitzqLhwk5HkFn8RKgHztjdz8",
  justdialUrl: "https://www.justdial.com/Indore/H-Mohd-Husain-H-M-Ibrahim-Co-Opposite-Tijori-Gali-Siyaganj/0731PX731-X731-180227083207-Y3W9_BZDET",

  /** For LocalBusiness schema - price range indication */
  priceRange: "$$",

  /** Areas served for SEO / schema */
  areasServed: [
    "Indore",
    "Dewas",
    "Ujjain",
    "Mhow",
    "Pithampur",
    "Nearby areas",
    "Madhya Pradesh (MP)",
    "Maharashtra",
    "Gujarat",
    "Rajasthan",
  ],

  /** Authorized dealer information */
  authorizedDealer: {
    brand: "Tata",
    enabled: true,
    note: "Authorized Tata dealer • Tata products available on request",
  },

  /** Signature brands (CM, Border) for Barbed Wire & Chain Link Fencing */
  inHouseBrandsEnabled: true,

  /** Google rating badge (hero). Update with real profile URL when available. */
  googleReview: {
    rating: 4.9,
    reviewCount: 350,
    /** Replace with your Google Maps / Business profile URL */
    profileUrl: "https://www.google.com/maps/search/?api=1&query=HM+Ibrahim+%26+Co+Siyaganj+Indore",
  },
} as const;

export type SiteConfig = typeof site;
