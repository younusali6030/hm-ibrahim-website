/**
 * Single source of truth for company info, contact, and site config.
 * Edit this file to update address, phones, hours, and social links across the site.
 */

export const site = {
  name: "HM Ibrahim & Co",
  legalName: "H Mohammed Husain HM Ibrahim & Co",
  tagline: "Est. 1939 • Iron & Hardware Trading in Siyaganj, Indore",
  description:
    "Iron and hardware traders in Siyaganj, Indore, since 1939. Retail and wholesale supply of MS angles, TMT bars, pipes, wire, mesh and construction hardware.",
  /** Manufacturer tagline for About and the catalogue. Owner-confirmed 12 Oct 2026: only these three products are made by the shop. */
  manufacturerTagline: "We manufacture barbed wire, chain link fencing and wire mesh. The rest of our range is stocked and supplied.",

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
    weekdays: "Mon to Sat: 10 am to 8 pm",
    sunday: "Sunday: Closed",
    note: "Hours may vary on public holidays.",
  },

  /** Optional: GSTIN. Set to empty string to hide from About/footer */
  gstin: "23AACFH8321H1ZP",

  /** Optional: social links. Use empty string to hide. */
  social: {
    facebook: "",
    /** The shop's own account: its bio links to hmibrahim.net and the reels on this site come from it. */
    instagram: "https://www.instagram.com/hmibrahimsince1939/",
    linkedin: "",
    twitter: "",
  },

  /** IndiaMart & JustDial listing URLs — contact us via these platforms */
  indiamartUrl: "https://www.indiamart.com/mohhusain-haji-hm-ibrahim-and-company/?srsltid=AfmBOooSV6bbouv6mlXb45IfPpIiswPmitzqLhwk5HkFn8RKgHztjdz8",
  justdialUrl: "https://www.justdial.com/Indore/H-Mohd-Husain-H-M-Ibrahim-Co-Opposite-Tijori-Gali-Siyaganj/0731PX731-X731-180227083207-Y3W9_BZDET",

  /** Owner-confirmed 12 Oct 2026. Use this exact sentence wherever reach or delivery is stated. */
  orderReach: "Orders accepted across India; delivery arrangements confirmed with each quotation.",

  /** Shop pin from the Google Business Profile (Maps place data, read 13 Oct 2026). */
  geo: { latitude: 22.7163264, longitude: 75.8655796 },
  /**
   * Google Place ID of the shop's listing "H Mohammed Husain HM Ibrahim & Co (CM)" (the same listing as
   * googleReview.profileUrl; checked October 2026 by opening Google Maps with this ID). Used as the routing destination.
   */
  googlePlaceId: "ChIJ____Dw79YjkROBPPHkT0scA",
  /** The listing's name on Google Maps, used with the address as the readable routing destination. */
  googleListingName: "H Mohammed Husain HM Ibrahim & Co (CM)",

  /** Areas served for schema: orders are accepted across India. */
  areasServed: ["India"],

  /** Authorised dealer information */
  authorizedDealer: {
    brand: "Tata",
    enabled: true,
    note: "Authorised Tata Wiron dealer (wire and fencing) • Other Tata products available on request",
  },

  /** Signature brands (CM, Border) for Barbed Wire & Chain Link Fencing */
  inHouseBrandsEnabled: true,

  /** Google rating badge (hero). Update with real profile URL when available. */
  googleReview: {
    /** Real figures from the shop's Google Business Profile (checked October 2026). */
    verified: true,
    rating: 4.9,
    reviewCount: 633,
    profileUrl: "https://www.google.com/maps?cid=13885147699571790648",
  },
} as const;

export type SiteConfig = typeof site;
