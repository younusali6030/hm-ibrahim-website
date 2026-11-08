/**
 * The shop's reels. Each one has its own watch page at /videos/<id> (and /hi/videos/<id>), which is the only
 * page that carries its VideoObject schema and the only page listed for it in /sitemap-videos.xml.
 * Google indexes a video only where it is the main content of the page, so the home page carousel, the
 * Indore page and the CM / Border brand pages embed these reels without schema and link to the watch page.
 *
 * Files live in /public/reels: <id>.mp4 and the 720x1280 poster <id>.jpg.
 * uploadDate is the day the encoded file was added to the site; duration (seconds) was read from the file.
 * No transcript exists (see content/captions.ts), so the text below only says what the title and the
 * shop already state. Never add claims about what is said in a clip without someone listening to it.
 */
import type { Lang } from "@/lib/locale";

type ReelText = {
  /** Card and carousel title. */
  short: string;
  /** One-line note under the card title. */
  note: string;
  /** Watch page H1 and VideoObject name. */
  title: string;
  /** Search result title (bare, without the site name). */
  seoTitle: string;
  /** What the clip shows; the watch page lede and the VideoObject description. */
  summary: string;
};

export type Reel = {
  id: string;
  en: ReelText;
  hi: ReelText;
  /** Length in seconds. */
  duration: number;
  uploadDate: string;
  /** Product slugs (content/products.ts) shown in the clip. */
  products?: string[];
  /** Category slugs shown in the clip when it covers a whole range. */
  categories?: string[];
  /** Brand pages that also embed the clip. */
  brands?: ("cm" | "border" | "tata")[];
  /** A customer speaks in the clip. */
  customer?: boolean;
  /** Shown in the home page carousel. */
  home?: boolean;
};

const UPLOADED = "2026-10-11";

export const reels: Reel[] = [
  {
    id: "shop-par-bharosa",
    home: true,
    duration: 28.4,
    uploadDate: UPLOADED,
    en: {
      short: "Shop par bharosa",
      note: "Walk in. See the stock. Decide.",
      title: "Shop par bharosa: walk in, see the stock, decide",
      seoTitle: "Inside Our Siyaganj Shop: Video, Indore",
      summary: "A short reel from the HM Ibrahim & Co counter on Siyaganj Main Road, Indore: the stock on the shelves, the way a buyer sees it when they walk in.",
    },
    hi: {
      short: "दुकान पर भरोसा",
      note: "आइए। माल देखिए। फिर तय कीजिए।",
      title: "दुकान पर भरोसा: आइए, माल देखिए, फिर तय कीजिए",
      seoTitle: "सियागंज की हमारी दुकान: वीडियो, इंदौर",
      summary: "सियागंज मेन रोड, इंदौर पर एचएम इब्राहिम एंड कंपनी के काउंटर से एक छोटी रील: शेल्फ पर रखा माल, जैसा दुकान में आने वाला खरीदार देखता है।",
    },
  },
  {
    id: "check-the-strength",
    home: true,
    duration: 30.9,
    uploadDate: UPLOADED,
    categories: ["wires", "wiremesh"],
    en: {
      short: "Check the strength",
      note: "Wire and mesh, tested in front of you.",
      title: "Check the strength: wire and mesh tested in front of you",
      seoTitle: "Wire and Mesh Strength Check: Video",
      summary: "Wire and mesh strength checked at the counter of our Siyaganj shop in Indore, in front of the buyer.",
    },
    hi: {
      short: "मज़बूती परखिए",
      note: "तार और जाली, आपके सामने जाँची गई।",
      title: "मज़बूती परखिए: तार और जाली, आपके सामने जाँची गई",
      seoTitle: "तार और जाली की मज़बूती की जाँच: वीडियो",
      summary: "इंदौर में सियागंज की हमारी दुकान के काउंटर पर, खरीदार के सामने तार और जाली की मज़बूती की जाँच।",
    },
  },
  {
    id: "machhar-full-stop",
    home: true,
    duration: 25.8,
    uploadDate: UPLOADED,
    products: ["mosquito-net"],
    en: {
      short: "Machhar ka full stop",
      note: "Mosquito net, cut at the counter.",
      title: "Mosquito net (machhar jali) cut at the counter",
      seoTitle: "Mosquito Net (Machhar Jali) Video, Indore",
      summary: "Mosquito net (machhar jali) being cut to size at the counter of our Siyaganj shop in Indore.",
    },
    hi: {
      short: "मच्छर का फुल स्टॉप",
      note: "मच्छरदानी जाली, काउंटर पर कटती हुई।",
      title: "मच्छर जाली, काउंटर पर नाप से कटती हुई",
      seoTitle: "मच्छर जाली का वीडियो, इंदौर",
      summary: "इंदौर में सियागंज की हमारी दुकान के काउंटर पर मच्छर जाली नाप से काटी जा रही है।",
    },
  },
  {
    id: "perforated-sheet-customer",
    home: true,
    customer: true,
    duration: 20.3,
    uploadDate: UPLOADED,
    categories: ["perforated-sheets"],
    en: {
      short: "Perforated sheet",
      note: "A customer on why he buys it here.",
      title: "Perforated sheet: a customer on why he buys it here",
      seoTitle: "Perforated Sheet: Customer Video, Indore",
      summary: "A customer talks about buying perforated sheet from HM Ibrahim & Co at Siyaganj, Indore.",
    },
    hi: {
      short: "परफोरेटेड शीट",
      note: "एक ग्राहक बताते हैं कि यहीं से क्यों लेते हैं।",
      title: "परफोरेटेड शीट: एक ग्राहक बताते हैं कि यहीं से क्यों लेते हैं",
      seoTitle: "परफोरेटेड शीट: ग्राहक का वीडियो, इंदौर",
      summary: "एक ग्राहक सियागंज, इंदौर में एचएम इब्राहिम एंड कंपनी से परफोरेटेड शीट खरीदने के बारे में बताते हैं।",
    },
  },
  {
    id: "nail-reel",
    home: true,
    duration: 14.2,
    uploadDate: UPLOADED,
    categories: ["nails"],
    en: {
      short: "Nails, by weight",
      note: "Every length in the bins.",
      title: "Nails by weight: every length in the bins",
      seoTitle: "Wire Nails by Weight: Shop Video, Indore",
      summary: "Wire nails and roofing nails in the bins at our Siyaganj shop in Indore, sold by weight.",
    },
    hi: {
      short: "कीलें, वज़न के हिसाब से",
      note: "हर लंबाई डिब्बों में।",
      title: "कीलें वज़न के हिसाब से: हर लंबाई डिब्बों में",
      seoTitle: "वज़न के हिसाब से कीलें: दुकान का वीडियो",
      summary: "इंदौर में सियागंज की हमारी दुकान के डिब्बों में तार की कीलें और छत की कीलें, वज़न के हिसाब से बिकती हैं।",
    },
  },
  {
    id: "kala-taar-wholesale",
    home: true,
    duration: 23.6,
    uploadDate: UPLOADED,
    products: ["binding-wire"],
    en: {
      short: "Kala taar, wholesale",
      note: "Binding wire by the coil.",
      title: "Kala taar wholesale: binding wire by the coil",
      seoTitle: "Kala Taar (Binding Wire) Wholesale Video",
      summary: "Black annealed binding wire (kala taar) sold by the coil at our Siyaganj shop in Indore.",
    },
    hi: {
      short: "काला तार, थोक में",
      note: "कॉइल के हिसाब से बाइंडिंग तार।",
      title: "काला तार थोक में: कॉइल के हिसाब से बाइंडिंग तार",
      seoTitle: "काला तार (बाइंडिंग तार) थोक का वीडियो",
      summary: "इंदौर में सियागंज की हमारी दुकान पर कॉइल के हिसाब से बिकता काला बाइंडिंग तार।",
    },
  },
  {
    id: "frp-bars",
    home: true,
    duration: 34,
    uploadDate: UPLOADED,
    products: ["frp-bars"],
    en: {
      short: "FRP bars",
      note: "Light and rust-proof.",
      title: "FRP bars: light, rust-proof, cut to length",
      seoTitle: "FRP Bars Video: Light, Rust-Proof, Indore",
      summary: "FRP bars in 4 ft, 5 ft and 6 ft lengths at our Siyaganj shop in Indore.",
    },
    hi: {
      short: "एफआरपी बार",
      note: "हल्के, ज़ंग-रहित, नाप से कटे।",
      title: "एफआरपी बार: हल्के, ज़ंग-रहित, नाप से कटे",
      seoTitle: "एफआरपी बार का वीडियो: हल्के, ज़ंग-रहित",
      summary: "इंदौर में सियागंज की हमारी दुकान पर 4 फ़ुट, 5 फ़ुट और 6 फ़ुट लंबाई के एफआरपी बार।",
    },
  },
  {
    id: "weldmesh-jali",
    home: true,
    duration: 14.3,
    uploadDate: UPLOADED,
    categories: ["welded-mesh"],
    en: {
      short: "Weldmesh jali",
      note: "Rolls and panels, any gauge.",
      title: "Weldmesh jali: rolls and panels",
      seoTitle: "Weldmesh Jali Rolls and Panels: Video",
      summary: "Welded wire mesh (weldmesh jali) rolls and panels at our Siyaganj shop in Indore.",
    },
    hi: {
      short: "वेल्डमेश जाली",
      note: "रोल और पैनल, हर गेज।",
      title: "वेल्डमेश जाली: रोल और पैनल",
      seoTitle: "वेल्डमेश जाली के रोल और पैनल: वीडियो",
      summary: "इंदौर में सियागंज की हमारी दुकान पर वेल्डेड वायर मेश (वेल्डमेश जाली) के रोल और पैनल।",
    },
  },
  {
    id: "kabootar-jali",
    home: true,
    duration: 31.2,
    uploadDate: UPLOADED,
    products: ["pigeon-nets"],
    en: {
      short: "Kabootar jali",
      note: "Pigeon net for balconies and shafts.",
      title: "Kabootar jali: pigeon net for balconies and shafts",
      seoTitle: "Kabootar Jali (Pigeon Net) Video, Indore",
      summary: "Pigeon net (kabootar jali) for balconies and shafts, shown at our Siyaganj shop in Indore.",
    },
    hi: {
      short: "कबूतर जाली",
      note: "बालकनी और शाफ्ट के लिए कबूतर रोकने वाली जाली।",
      title: "कबूतर जाली: बालकनी और शाफ्ट के लिए",
      seoTitle: "कबूतर जाली का वीडियो, इंदौर",
      summary: "बालकनी और शाफ्ट के लिए कबूतर जाली, इंदौर में सियागंज की हमारी दुकान पर।",
    },
  },
  {
    id: "pvc-hexa-mesh",
    home: true,
    duration: 35.8,
    uploadDate: UPLOADED,
    products: ["plastic-hexagonal-poultry-mesh"],
    en: {
      short: "PVC hexa mesh",
      note: "Garden and poultry fencing.",
      title: "PVC hexa mesh for garden and poultry fencing",
      seoTitle: "PVC Hexa Mesh for Garden & Poultry: Video",
      summary: "Plastic hexagonal mesh for garden and poultry fencing, shown at our Siyaganj shop in Indore.",
    },
    hi: {
      short: "पीवीसी हेक्सा मेश",
      note: "बगीचे और पोल्ट्री की फेंसिंग।",
      title: "बगीचे और पोल्ट्री फेंसिंग के लिए पीवीसी हेक्सा मेश",
      seoTitle: "पीवीसी हेक्सा मेश, बगीचा और पोल्ट्री: वीडियो",
      summary: "बगीचे और पोल्ट्री की फेंसिंग के लिए प्लास्टिक हेक्सागोनल मेश, इंदौर में सियागंज की हमारी दुकान पर।",
    },
  },
  {
    id: "tata-wire-rate",
    home: true,
    duration: 23.7,
    uploadDate: UPLOADED,
    products: ["gi-wire"],
    brands: ["tata"],
    en: {
      short: "Tata wire, firm rate",
      note: "Tata Wiron, straight from the shelf.",
      title: "Tata Wiron wire, straight from the shelf",
      seoTitle: "Tata Wiron GI Wire at Our Shop: Video",
      summary: "Tata Wiron GI wire stocked at HM Ibrahim & Co, Siyaganj, Indore, an authorised Tata Wiron dealer.",
    },
    hi: {
      short: "टाटा तार, पक्का रेट",
      note: "टाटा वायरॉन, सीधे शेल्फ से।",
      title: "टाटा वायरॉन तार, सीधे शेल्फ से",
      seoTitle: "हमारी दुकान पर टाटा वायरॉन जीआई तार: वीडियो",
      summary: "अधिकृत टाटा वायरॉन डीलर एचएम इब्राहिम एंड कंपनी, सियागंज, इंदौर में रखा टाटा वायरॉन जीआई तार।",
    },
  },
  {
    id: "rat-jaali-customer",
    home: true,
    customer: true,
    duration: 25.9,
    uploadDate: UPLOADED,
    en: {
      short: "A customer, on camera",
      note: "Rat jaali, from our customer.",
      title: "Rat jaali: a customer on camera",
      seoTitle: "Rat Jaali: Customer Video, Indore",
      summary: "A customer talks about rat jaali bought from our Siyaganj shop in Indore.",
    },
    hi: {
      short: "एक ग्राहक, कैमरे पर",
      note: "चूहा जाली, हमारे ग्राहक की ज़ुबानी।",
      title: "चूहा जाली: एक ग्राहक, कैमरे पर",
      seoTitle: "चूहा जाली: ग्राहक का वीडियो, इंदौर",
      summary: "एक ग्राहक इंदौर में सियागंज की हमारी दुकान से ली गई चूहा जाली के बारे में बताते हैं।",
    },
  },
  {
    id: "chainlink-walkthrough",
    duration: 21.8,
    uploadDate: UPLOADED,
    products: ["chain-link-fencing"],
    brands: ["cm", "border"],
    en: {
      short: "Chain link fencing",
      note: "CM and Border rolls, walked through.",
      title: "Chain link fencing (jali) walkthrough",
      seoTitle: "Chain Link Fencing (Jali) Walkthrough Video",
      summary: "A walkthrough of chain link fencing rolls (jali) from the CM and Border brands at our Siyaganj shop in Indore.",
    },
    hi: {
      short: "चेन लिंक फेंसिंग",
      note: "सीएम और बॉर्डर के रोल, एक झलक।",
      title: "चेन लिंक फेंसिंग (जाली) की झलक",
      seoTitle: "चेन लिंक फेंसिंग (जाली) का वीडियो",
      summary: "इंदौर में सियागंज की हमारी दुकान पर सीएम और बॉर्डर ब्रांड के चेन लिंक फेंसिंग (जाली) रोल की झलक।",
    },
  },
];

export const homeReels = reels.filter((r) => r.home);

export function getReel(id: string): Reel | undefined {
  return reels.find((r) => r.id === id);
}

export const reelText = (r: Reel, lang: Lang): ReelText => (lang === "hi" ? r.hi : r.en);

export const reelSrc = (id: string) => ({ video: `/reels/${id}.mp4`, poster: `/reels/${id}.jpg` });

/** "0:28" for cards. */
export function clock(seconds: number): string {
  const s = Math.round(seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/** ISO 8601 duration for VideoObject, e.g. PT28S. */
export function isoDuration(seconds: number): string {
  const s = Math.round(seconds);
  const m = Math.floor(s / 60);
  return `PT${m ? `${m}M` : ""}${s % 60}S`;
}
