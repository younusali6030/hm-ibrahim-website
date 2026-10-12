/**
 * Copy and photo credits for the /indore story page.
 * Facts here come from the owner (who we have supplied) and from site.ts / the about page.
 * Landmark captions only describe the landmark; the only place we claim to have supplied is Daly College.
 * Photos are from Wikimedia Commons under CC BY-SA. Credits render at the very end of the page.
 */

export type IndorePhoto = {
  id: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  /** Short name used in the credits list */
  subject: string;
  author: string;
  license: string;
  licenseUrl: string;
  sourceUrl: string;
};

export const indorePhotos: Record<"rajwadaNight" | "rajwadaDay" | "daly" | "chhatri" | "choral", IndorePhoto> = {
  rajwadaNight: {
    id: "rajwada-night",
    src: "/indore/rajwada-night.webp",
    width: 1920,
    height: 1434,
    alt: "Rajwada, the old Holkar palace in the heart of Indore, lit up at night with auto-rickshaws in front",
    subject: "Rajwada at night",
    author: "Surendra 1999",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Indore_Rajwada_at_night.jpg",
  },
  rajwadaDay: {
    id: "rajwada-day",
    src: "/indore/rajwada-day.webp",
    width: 1920,
    height: 1322,
    alt: "Rajwada palace in daylight with the busy old-city square in front of it, Indore",
    subject: "Rajwada by day",
    author: "Bernard Gagnon",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Rajwada_Palace,_Indore.jpg",
  },
  daly: {
    id: "daly-college",
    src: "/indore/daly-college.webp",
    width: 1920,
    height: 1176,
    alt: "The front of Daly College, Indore, with its clock tower, domes and flowering bougainvillea",
    subject: "Daly College",
    author: "Adarsh Bindal",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:The_Daly_College.jpg",
  },
  chhatri: {
    id: "krishnapura-chhatri",
    src: "/indore/krishnapura-chhatri.webp",
    width: 1920,
    height: 1280,
    alt: "The Krishnapura Chhatris, Holkar-era memorial domes on the Khan river bank in old Indore",
    subject: "Krishnapura Chhatris",
    author: "DipankarSn",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:The_Krishnapura_Chhatris_Indore_1.jpg",
  },
  choral: {
    id: "choral-dam",
    src: "/indore/choral-dam.webp",
    width: 1920,
    height: 1277,
    alt: "Choral dam near Mhow, Indore, at dusk, with lamp posts along the lakeside walk and hills across the water",
    subject: "Choral dam, Mhow",
    author: "Kirandeep Atwal",
    license: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:A_view_at_dusk_Choral_Dam,_Mhow,_Indore_Madhya_Pradesh_India_2014.jpg",
  },
};

export type SuppliedRow = { name: string; kind: string; line: string; nameHi: string; kindHi: string; lineHi: string };

/** Who we have supplied, as the owner told us. Lines say what each buys; nothing about contract size or value. */
export const supplied: SuppliedRow[] = [
  {
    name: "Daly College",
    kind: "School",
    line: "One of Indore's oldest schools. We have supplied the campus.",
    nameHi: "डैली कॉलेज",
    kindHi: "स्कूल",
    lineHi: "इंदौर के सबसे पुराने स्कूलों में से एक। इस कैंपस को हमने माल सप्लाई किया है।",
  },
  {
    name: "Apna Sweets",
    kind: "Food and retail",
    line: "A name every Indori knows. We have supplied them too.",
    nameHi: "अपना स्वीट्स",
    kindHi: "खान-पान और रिटेल",
    lineHi: "हर इंदौरी जिस नाम को जानता है। उन्हें भी हमने सप्लाई किया है।",
  },
  {
    name: "Factories in Pithampur",
    kind: "Industry",
    line: "Industrial units in and around Pithampur buy wire, mesh, sheets and sections from our counter.",
    nameHi: "पीथमपुर की फैक्ट्रियाँ",
    kindHi: "उद्योग",
    lineHi: "पीथमपुर और आसपास की औद्योगिक इकाइयाँ हमारे काउंटर से तार, जाली, शीट और सेक्शन ले जाती हैं।",
  },
  {
    name: "Farmers across MP",
    kind: "Farms",
    line: "Farmers from all over Madhya Pradesh come to us for barbed wire, chain link and fencing.",
    nameHi: "पूरे मध्य प्रदेश के किसान",
    kindHi: "खेती",
    lineHi: "पूरे मध्य प्रदेश के किसान काँटेदार तार, चेन लिंक और फेंसिंग के लिए हमारे पास आते हैं।",
  },
  {
    name: "Contractors, builders, fabricators",
    kind: "The trade",
    line: "The people who actually build the city. They are who we know best.",
    nameHi: "ठेकेदार, बिल्डर, फैब्रिकेटर",
    kindHi: "व्यापार",
    lineHi: "जो लोग सच में शहर को बनाते हैं। हम इन्हें सबसे अच्छी तरह जानते हैं।",
  },
];

export const aims = [
  {
    t: "Stock first",
    tHi: "पहले माल",
    d: "Keep the range on the shelf so a job in Indore never waits on us.",
    dHi: "रेंज हमेशा शेल्फ पर रखना, ताकि इंदौर का कोई काम हमारी वजह से न रुके।",
  },
  {
    t: "One straight rate",
    tHi: "एक सीधा रेट",
    d: "The same honest answer for a school and for a small shop.",
    dHi: "स्कूल हो या छोटी दुकान, सबको एक जैसा सीधा जवाब।",
  },
  {
    t: "Back the builders",
    tHi: "बनाने वालों का साथ",
    d: "Keep supporting the contractors, factories and farmers who are building Indore and Madhya Pradesh.",
    dHi: "इंदौर और मध्य प्रदेश को बनाने वाले ठेकेदारों, फैक्ट्रियों और किसानों का साथ देते रहना।",
  },
];

export const indoreFaqs = [
  {
    question: "Where is HM Ibrahim & Co in Indore?",
    answer:
      "60, Siyaganj Main Road, opposite Tijori Gali, Siyaganj, Indore 452007, in the old iron and hardware market known as Loha Mandi. We are open Monday to Saturday, 9 AM to 8 PM.",
  },
  {
    question: "What do you sell, retail or wholesale?",
    answer:
      "Both. Iron and steel sections, TMT bars, pipes, GI and binding wire, wire mesh, chain link jali, barbed wire, perforated sheets and construction hardware. Tell us the product, size and quantity and we call back with the rate.",
  },
  {
    question: "Do you supply factories in Pithampur and farmers across Madhya Pradesh?",
    answer:
      "Yes. Industrial units in and around Pithampur buy wire, mesh, sheets and sections from us, and farmers from across Madhya Pradesh buy barbed wire, chain link and fencing wire in our CM and Border brands.",
  },
  {
    question: "Which areas do you deliver to?",
    answer:
      "Across Indore, from Siyaganj, Rajwada and Chhatribagh to Palasia, Vijay Nagar, Bhawarkuan, Rau and the Super Corridor, and to Mhow, Pithampur, Sanwer Road, Dewas and Ujjain. Further across Madhya Pradesh on request. Dispatch depends on stock, quantity and location.",
  },
];
