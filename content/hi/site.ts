/**
 * Hindi counterpart of content/site.ts. Brand and trade words follow how customers say them in the market
 * (jali, kata taar, loha, sariya). Phone numbers, GSTIN, e-mail and URLs are never translated.
 */
import type { Lang } from "@/lib/locale";
import { site } from "@/content/site";

export const siteHi = {
  name: "एचएम इब्राहिम एंड कंपनी",
  /** The Latin name is the registered trade name and stays in titles beside the Devanagari one. */
  nameLatin: site.name,
  legalName: "एच मोहम्मद हुसैन एचएम इब्राहिम एंड कंपनी",
  tagline: "स्थापना 1939 • सियागंज, इंदौर में भरोसेमंद लोहा और हार्डवेयर व्यापार",
  description:
    "सियागंज, इंदौर में 1939 से लोहा और हार्डवेयर का व्यापार। एमएस एंगल, टीएमटी सरिया, पाइप, तार, जाली और निर्माण हार्डवेयर की रिटेल और थोक आपूर्ति।",
  manufacturerTagline: "हम कांटेदार तार, चेन लिंक फेंसिंग और वायर मेश बनाते हैं। बाकी रेंज हम स्टॉक करके सप्लाई करते हैं।",
  address: {
    line1: "60, सियागंज मेन रोड",
    line2: "तिजोरी गली के सामने, सियागंज",
    city: "इंदौर",
    state: "मध्य प्रदेश",
    pincode: "452007",
    country: "भारत",
  },
  fullAddress: "60, सियागंज मेन रोड, तिजोरी गली के सामने, सियागंज, इंदौर, मध्य प्रदेश 452007, भारत",
  landmark: "तिजोरी गली के सामने",
  phoneLabel: "अकबर अली",
  phoneAltLabel: "शोएब अली",
  emailLabel: "शोएब अली",
  emailAltLabel: "अकबर अली",
  hours: {
    weekdays: "सोम – शनि: सुबह 9:00 – रात 8:00",
    sunday: "रविवार: बंद",
    note: "त्योहार और छुट्टियों पर समय बदल सकता है।",
  },
  orderReach: "पूरे भारत से ऑर्डर स्वीकार किए जाते हैं; डिलीवरी की व्यवस्था हर कोटेशन के साथ तय की जाती है।",
  areasServed: ["भारत"],
  keywords: [
    "इंदौर में वायर मेश",
    "सियागंज इंदौर लोहा और हार्डवेयर",
    "इंदौर में टीएमटी सरिया",
    "इंदौर में कांटेदार तार",
    "इंदौर में चेन लिंक जाली",
    "जीआई तार इंदौर",
    "एचएम इब्राहिम",
  ],
} as const;

/** Site text in the visitor's language. Fields without a Hindi counterpart fall back to English. */
export function siteText(lang: Lang) {
  if (lang === "en") {
    return {
      name: site.name,
      legalName: site.legalName,
      tagline: site.tagline,
      description: site.description,
      manufacturerTagline: site.manufacturerTagline,
      address: site.address,
      fullAddress: site.fullAddress,
      landmark: site.landmark,
      phoneLabel: site.phoneLabel,
      phoneAltLabel: site.phoneAltLabel,
      emailLabel: site.emailLabel,
      emailAltLabel: site.emailAltLabel,
      hours: site.hours,
      areasServed: [...site.areasServed] as string[],
    };
  }
  return {
    name: siteHi.name,
    legalName: siteHi.legalName,
    tagline: siteHi.tagline,
    description: siteHi.description,
    manufacturerTagline: siteHi.manufacturerTagline,
    address: siteHi.address,
    fullAddress: siteHi.fullAddress,
    landmark: siteHi.landmark,
    phoneLabel: siteHi.phoneLabel,
    phoneAltLabel: siteHi.phoneAltLabel,
    emailLabel: siteHi.emailLabel,
    emailAltLabel: siteHi.emailAltLabel,
    hours: siteHi.hours,
    areasServed: [...siteHi.areasServed] as string[],
  };
}
