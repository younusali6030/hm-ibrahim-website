/**
 * Short link labels for the /indore/* landing pages.
 * Used by the footer ("Buy in Indore"), blog posts and video pages so every Indore page gets site-wide internal links
 * (TASK-032). Kept free of page copy because the footer is a client component; the matching helper,
 * indoreSlugsForProducts, lives in content/indorePages.ts. Labels are anchor text: keep them to the product term the page owns (docs/seo/keyword-map.md).
 */
import type { IndorePageSlug } from "@/content/indorePages";

export const indoreLinkLabels: Record<IndorePageSlug, { en: string; hi: string }> = {
  "barbed-wire": { en: "Barbed wire", hi: "कांटेदार तार" },
  "chain-link-fencing-jaali": { en: "Chain link fencing", hi: "चेन लिंक फेंसिंग" },
  fencing: { en: "Fencing material", hi: "फेंसिंग सामान" },
  "wire-mesh": { en: "Wire mesh", hi: "वायर मेश जाली" },
  "weld-mesh": { en: "Weld mesh", hi: "वेल्ड मेश" },
  "perforated-sheets": { en: "Perforated sheet", hi: "परफोरेटेड शीट" },
  "gi-wire": { en: "GI wire", hi: "जीआई तार" },
  "tmt-bars": { en: "TMT bars (sariya)", hi: "टीएमटी सरिया" },
  "ms-angles-channels": { en: "MS angles and channels", hi: "एमएस एंगल और चैनल" },
  "ms-gi-pipes": { en: "MS and GI pipes", hi: "एमएस और जीआई पाइप" },
  "wire-rope": { en: "Wire rope", hi: "वायर रोप" },
  "mosquito-net": { en: "Mosquito net", hi: "मच्छर जाली" },
  "pigeon-net": { en: "Pigeon net", hi: "कबूतर जाली" },
  "construction-hardware": { en: "Construction hardware", hi: "निर्माण हार्डवेयर" },
};

/** Footer order: the manufactured lines and biggest searches first. */
export const indoreLinkOrder: IndorePageSlug[] = [
  "barbed-wire",
  "chain-link-fencing-jaali",
  "fencing",
  "wire-mesh",
  "weld-mesh",
  "perforated-sheets",
  "tmt-bars",
  "gi-wire",
  "ms-angles-channels",
  "ms-gi-pipes",
  "wire-rope",
  "mosquito-net",
  "pigeon-net",
  "construction-hardware",
];
