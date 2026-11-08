/**
 * Indore market rate shown on /indore/* pages: the midpoint of published market prices, dated, with the range it
 * came from. Owner decision D-018 (8 Nov 2026): publish the researched midpoint. These are market estimates, not the
 * shop's quote, and the page says so. Product pages keep the owner's own indicativeRate (content/products.ts).
 *
 * Update monthly: change asOf, low and high; mid is (low + high) / 2 (tests/marketRates.test.mjs checks it).
 * Sources checked 8 Nov 2026:
 * - TMT: Tata nexarc Indore steel price page (Oct 2026, branded ₹55–62/kg); IndiaMART Indore listings
 *   (Kamdhenu 10 mm ₹57/kg, 15 Oct 2026; Goel 16 mm ₹55/kg, 28 Sep 2026).
 * - Chain link: IndiaMART GI chain link listings quoted per kg (₹61–85/kg).
 * - Perforated sheet: plain MS sheet ₹70–92/kg (Aug 2026 metro average) plus a 10–25 % perforation adder,
 *   cross-checked with an MS perforated sheet listing at ₹120/kg: ₹90–130/kg.
 */
import type { IndorePageSlug } from "@/content/indorePages";

export type MarketRate = {
  /** YYYY-MM-DD, India time. */
  asOf: string;
  low: number;
  high: number;
  mid: number;
  unit: "kg";
  /** What the range covers, shown under the figure. */
  basis: { en: string; hi: string };
  /** Short product phrase for the FAQ question. */
  topic: { en: string; hi: string };
};

export const marketRates: Partial<Record<IndorePageSlug, MarketRate>> = {
  "tmt-bars": {
    asOf: "2026-11-09",
    low: 55,
    high: 62,
    mid: 58.5,
    unit: "kg",
    basis: { en: "branded Fe 500D TMT bars, by brand and diameter", hi: "ब्रांडेड Fe 500D टीएमटी सरिया, ब्रांड और डायमीटर के हिसाब से" },
    topic: { en: "TMT bars (sariya)", hi: "सरिया" },
  },
  "chain-link-fencing-jaali": {
    asOf: "2026-11-09",
    low: 61,
    high: 85,
    mid: 73,
    unit: "kg",
    basis: { en: "GI chain link jali, by wire gauge and mesh opening", hi: "जीआई चेन लिंक जाली, तार की मोटाई और जाली के छेद के हिसाब से" },
    topic: { en: "chain link fencing (taar fencing jali)", hi: "चेन लिंक जाली (तार फेंसिंग)" },
  },
  "perforated-sheets": {
    asOf: "2026-11-09",
    low: 90,
    high: 130,
    mid: 110,
    unit: "kg",
    basis: { en: "MS perforated sheet, by thickness and hole pattern", hi: "एमएस परफोरेटेड शीट, मोटाई और छेद के पैटर्न के हिसाब से" },
    topic: { en: "perforated sheet (chaddar jali)", hi: "चादर जाली (परफोरेटेड शीट)" },
  },
};

const MONTHS_HI = ["जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"];
const MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "8 Nov 2026" / "8 नवंबर 2026", without depending on the server's locale data. */
export function formatAsOf(asOf: string, hi: boolean): string {
  const [y, m, d] = asOf.split("-").map(Number);
  return `${d} ${(hi ? MONTHS_HI : MONTHS_EN)[m - 1]} ${y}`;
}

/** "₹58.5", "₹73": one decimal only when needed. */
export function rupees(n: number): string {
  return `₹${Number.isInteger(n) ? n.toLocaleString("en-IN") : n.toFixed(1)}`;
}

/** The FAQ every rate page carries, built from the same numbers as the box so they never disagree. */
export function marketRateFaq(r: MarketRate, hi: boolean): { question: string; answer: string } {
  const date = formatAsOf(r.asOf, hi);
  return hi
    ? {
        question: `इंदौर में आज ${r.topic.hi} का रेट क्या है?`,
        answer: `${date} को इंदौर बाज़ार में ${r.basis.hi} लगभग ${rupees(r.low)}–${rupees(r.high)} प्रति किलो चल रहा था, यानी बीच का भाव लगभग ${rupees(r.mid)} प्रति किलो। यह बाज़ार का अनुमान है, हमारा कोटेशन नहीं, और महीने के बीच भी बदल सकता है। आज का रेट फ़ोन या व्हाट्सएप पर पूछिए।`,
      }
    : {
        question: `What is the ${r.topic.en} rate in Indore today?`,
        answer: `On ${date} the Indore market rate for ${r.basis.en} ran about ${rupees(r.low)}–${rupees(r.high)} per kg, a midpoint of about ${rupees(r.mid)} per kg. This is a market estimate, not our quote, and it can move within the month. Call or WhatsApp us for today's rate.`,
      };
}
