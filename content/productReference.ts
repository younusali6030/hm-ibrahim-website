/**
 * Trade reference per product: figures that belong to the product family (a standard, a gauge table, a common
 * construction), gathered from standards summaries and supplier listings on 13 Oct 2026.
 *
 * What this is NOT: a statement of what is on the shelf. Coil weights, roll lengths and pack sizes differ from
 * maker to maker, so none of them are copied into the shop's own spec rows (content/products.ts). Those come
 * from the counter. The page says so in plain words above this block.
 *
 * Rules: only figures that at least two independent sources agree on, or that come from a named standard;
 * no prices; no claim about the shop. Sources are listed in docs/seo/spec-reference-sources.md.
 */

type Bi = { en: string; hi: string };
export type ReferenceRow = { label: Bi; value: Bi };
export type ProductReference = { rows: ReferenceRow[] };

const row = (le: string, lh: string, ve: string, vh: string): ReferenceRow => ({ label: { en: le, hi: lh }, value: { en: ve, hi: vh } });

/** Standard Wire Gauge to diameter. A bigger gauge number is thinner wire. */
const SWG = (gauges: [number, string][]): ReferenceRow =>
  row(
    "Diameter by gauge (SWG)",
    "गेज के हिसाब से व्यास (SWG)",
    gauges.map(([g, mm]) => `${g} SWG ${mm} mm`).join("; "),
    gauges.map(([g, mm]) => `${g} SWG ${mm} mm`).join("; ")
  );

const SWG_TABLE: Record<number, string> = { 8: "4.06", 10: "3.25", 12: "2.64", 14: "2.03", 16: "1.63", 18: "1.22" };
const swg = (...g: number[]) => SWG(g.map((n) => [n, SWG_TABLE[n]] as [number, string]));

const ROPE_NOTE = row(
  "Load rating",
  "लोड रेटिंग",
  "Working load and breaking strength come from the maker's certified table for the exact diameter, construction and grade. Do not take them from a general chart.",
  "वर्किंग लोड और ब्रेकिंग स्ट्रेंथ सटीक व्यास, बनावट और ग्रेड की निर्माता की प्रमाणित तालिका से लें। किसी सामान्य चार्ट से नहीं।"
);

const ropeCommon = (grade: ReferenceRow | null): ProductReference => ({
  rows: [
    row(
      "Common constructions",
      "आम बनावट",
      "6x19 (15 to 26 wires per strand) and 6x37 (27 to 46 wires per strand); the 6x37 is more flexible, the 6x19 more wear-resistant",
      "6x19 (हर लड़ में 15 से 26 तार) और 6x37 (हर लड़ में 27 से 46 तार); 6x37 ज़्यादा लचीली, 6x19 ज़्यादा घिसाई-रोधी"
    ),
    row("Core", "कोर", "Fibre core (FC) or independent wire rope core (IWRC)", "फाइबर कोर (FC) या स्वतंत्र वायर रोप कोर (IWRC)"),
    ...(grade ? [grade] : []),
    ROPE_NOTE,
  ],
});

const IS1239: ReferenceRow[] = [
  row(
    "Standard",
    "मानक",
    "IS 1239 Part 1: steel tubes for water, gas, air and steam; Light, Medium and Heavy classes (yellow, blue and red colour bands)",
    "IS 1239 भाग 1: पानी, गैस, हवा और भाप के लिए स्टील ट्यूब; लाइट, मीडियम और हेवी क्लास (पीला, नीला और लाल बैंड)"
  ),
  row(
    "Length",
    "लंबाई",
    "Random lengths of 4 to 7 m; 6 m is the usual commercial length",
    "4 से 7 मीटर की रैंडम लंबाई; 6 मीटर आम व्यावसायिक लंबाई है"
  ),
  row(
    "Wall thickness (Light / Medium / Heavy)",
    "दीवार की मोटाई (लाइट / मीडियम / हेवी)",
    "1/2 in (15 NB, OD 21.4 mm): 2.0 / 2.65 / 3.25 mm; 1 in (25 NB, OD 33.8 mm): 2.65 / 3.25 / 4.05 mm; 2 in (50 NB, OD 60.3 mm): 2.9 / 3.65 / 4.47 mm; 4 in (100 NB, OD 114.3 mm): 3.65 / 4.5 / 5.4 mm",
    "1/2 in (15 NB, OD 21.4 mm): 2.0 / 2.65 / 3.25 mm; 1 in (25 NB, OD 33.8 mm): 2.65 / 3.25 / 4.05 mm; 2 in (50 NB, OD 60.3 mm): 2.9 / 3.65 / 4.47 mm; 4 in (100 NB, OD 114.3 mm): 3.65 / 4.5 / 5.4 mm"
  ),
];

export const productReference: Record<string, ProductReference> = {
  "gi-wire": {
    rows: [
      swg(8, 10, 12, 14, 16, 18),
      row(
        "Coating",
        "कोटिंग",
        "Zinc coating on galvanised wire is specified by class in the order (IS 4826 covers galvanised round steel wire)",
        "गैल्वनाइज़्ड तार पर जिंक कोटिंग ऑर्डर में क्लास से तय होती है (IS 4826 गैल्वनाइज़्ड गोल स्टील तार को कवर करता है)"
      ),
      row(
        "Coil weight",
        "कॉइल का वज़न",
        "Set by the maker and the order, not by gauge. Utility tenders for 8 and 10 SWG GI wire call for 50 to 80 kg coils",
        "निर्माता और ऑर्डर से तय होता है, गेज से नहीं। 8 और 10 SWG जीआई तार की सरकारी निविदाओं में 50 से 80 kg की कॉइल माँगी जाती है"
      ),
    ],
  },
  "binding-wire": {
    rows: [
      swg(16, 18),
      row(
        "Finish",
        "फिनिश",
        "Black annealed wire is soft enough to tie reinforcement bars by hand; it is sold by weight",
        "काला एनील्ड तार इतना नरम होता है कि हाथ से सरिया बाँधा जा सके; यह वज़न से बिकता है"
      ),
    ],
  },
  "jhatka-machine-fencing-wire": { rows: [swg(10, 12, 14, 16)] },
  "barbed-wire": {
    rows: [
      swg(12, 14),
      row(
        "Reading 12 x 14",
        "12 x 14 का मतलब",
        "The first number is the line wire gauge, the second the barb wire gauge; a smaller number is thicker wire",
        "पहला नंबर मुख्य तार का गेज है, दूसरा काँटे वाले तार का; छोटा नंबर मोटा तार"
      ),
    ],
  },
  "concertina-wire": {
    rows: [
      row("Blade type", "ब्लेड का प्रकार", "BTO-22: blade about 22 mm long and 15 mm wide, spaced about 34 mm apart", "BTO-22: ब्लेड लगभग 22 mm लंबा और 15 mm चौड़ा, लगभग 34 mm की दूरी पर"),
      row("Core wire", "कोर तार", "Usually about 2.5 mm galvanised wire", "आम तौर पर लगभग 2.5 mm का गैल्वनाइज़्ड तार"),
      row(
        "Coil diameter",
        "कॉइल का व्यास",
        "450 to 960 mm in trade listings; 450 and 500 mm coils use 3 clips, 900 mm coils use 5",
        "ट्रेड लिस्टिंग में 450 से 960 mm; 450 और 500 mm की कॉइल में 3 क्लिप, 900 mm में 5"
      ),
      row(
        "Opened length and weight",
        "खोलने पर लंबाई और वज़न",
        "Roughly 8 to 14 m per coil depending on diameter and clips; coil weights from about 5 kg to 14 kg",
        "व्यास और क्लिप के हिसाब से एक कॉइल लगभग 8 से 14 m; कॉइल का वज़न लगभग 5 से 14 kg"
      ),
    ],
  },
  "chain-link-fencing": {
    rows: [
      swg(8, 10, 12),
      row(
        "Trade combinations",
        "बाज़ार में आम जोड़ी",
        "2 x 2 in (50 mm) mesh in 8 to 12 gauge wire, in heights up to 10 ft; lighter 1 in (25 mm) mesh for farms",
        "2 x 2 in (50 mm) जाली, 8 से 12 गेज के तार में, 10 ft तक की ऊँचाई; खेतों के लिए हल्की 1 in (25 mm) जाली"
      ),
      row(
        "How it is sold",
        "कैसे बिकती है",
        "By weight or by area. Roll length and roll weight are stated by the maker, so ask for both with the rate",
        "वज़न या क्षेत्रफल से। रोल की लंबाई और रोल का वज़न निर्माता बताता है, इसलिए रेट के साथ दोनों पूछिए"
      ),
    ],
  },
  "ms-wire-rope": ropeCommon(null),
  "gi-wire-rope": ropeCommon(null),
  "ss-wire-rope": ropeCommon(
    row(
      "Stainless grades",
      "स्टेनलेस ग्रेड",
      "304 and 316; 316 is the marine grade and resists corrosion better than 304",
      "304 और 316; 316 मरीन ग्रेड है और 304 से बेहतर जंग-रोधी है"
    )
  ),
  "bright-bars": {
    rows: [
      row("Length", "लंबाई", "3 m and 6 m are the usual single-piece lengths in the trade", "ट्रेड में 3 m और 6 m आम सिंगल-पीस लंबाई हैं"),
      row(
        "Tolerance",
        "टॉलरेंस",
        "Cold-drawn bars are offered to h9 (DIN 671) or h11 (ASTM A 484); state the class if the fit matters",
        "कोल्ड-ड्रॉन बार h9 (DIN 671) या h11 (ASTM A 484) में मिलते हैं; फिट ज़रूरी हो तो क्लास बताइए"
      ),
    ],
  },
  "ms-pipes": { rows: IS1239 },
  "gi-pipes": { rows: IS1239 },
  "ss-fine-mesh": {
    rows: [
      row("Grades", "ग्रेड", "304 and 316; 316 is the marine grade", "304 और 316; 316 मरीन ग्रेड है"),
      row(
        "Mesh count",
        "मेश काउंट",
        "Openings per inch. Wire diameter and opening follow from the count: for example 40 mesh is about 0.22 mm wire with a 0.415 mm opening",
        "प्रति इंच छेद। तार का व्यास और छेद काउंट से तय होते हैं: जैसे 40 मेश में लगभग 0.22 mm तार और 0.415 mm छेद"
      ),
      row(
        "Roll width",
        "रोल की चौड़ाई",
        "36, 40, 48 and 60 in are the standard widths (48 in is about 1.22 m)",
        "36, 40, 48 और 60 in मानक चौड़ाई हैं (48 in लगभग 1.22 m)"
      ),
    ],
  },
  "mosquito-net": {
    rows: [
      row(
        "Reading 18 x 16",
        "18 x 16 का मतलब",
        "Openings per inch in each direction; 18 x 16 is the usual count for fibreglass insect mesh",
        "हर दिशा में प्रति इंच छेद; फाइबरग्लास कीट-जाली में 18 x 16 आम काउंट है"
      ),
      row(
        "Wire diameter",
        "तार का व्यास",
        "Varies by maker, about 0.17 to 0.33 mm for fibreglass; ask which one you are being quoted",
        "निर्माता के हिसाब से बदलता है, फाइबरग्लास में लगभग 0.17 से 0.33 mm; पूछिए कौन-सा बता रहे हैं"
      ),
      row("Colours", "रंग", "Grey, charcoal and black are the common colours", "ग्रे, चारकोल और काला आम रंग हैं"),
    ],
  },
  "pigeon-nets": {
    rows: [
      row(
        "Mesh size",
        "जाली का छेद",
        "1 in (25 mm) is the usual size for pigeons; 1.5 in (40 mm) is also sold for balconies; 2 in (50 mm) is for larger birds",
        "कबूतरों के लिए 1 in (25 mm) आम है; बालकनी के लिए 1.5 in (40 mm) भी मिलती है; बड़े पक्षियों के लिए 2 in (50 mm)"
      ),
      row(
        "Material and twine",
        "मटेरियल और धागा",
        "Knotted HDPE; twine is quoted in ply (12 and 15 are common) or in mm. Ask for UV stabilisation and breaking strength",
        "गाँठ वाली HDPE; धागा ply (12 और 15 आम) या mm में बताया जाता है। UV स्टेबिलाइज़ेशन और ब्रेकिंग स्ट्रेंथ पूछिए"
      ),
    ],
  },
  "pigeon-spikes": {
    rows: [
      row(
        "Types",
        "प्रकार",
        "Polycarbonate base with stainless steel pins (304 grade), or all-plastic spikes; sold as strips",
        "पॉलीकार्बोनेट बेस पर स्टेनलेस स्टील पिन (304 ग्रेड), या पूरे प्लास्टिक के स्पाइक; पट्टी के रूप में"
      ),
      row(
        "Strip size",
        "पट्टी का साइज़",
        "Strips of about 33 cm and 50 cm are common; choose by the width of the ledge, not only the length",
        "लगभग 33 cm और 50 cm की पट्टियाँ आम हैं; मुंडेर की चौड़ाई के हिसाब से चुनिए, सिर्फ़ लंबाई से नहीं"
      ),
    ],
  },
  "safety-net": {
    rows: [
      row(
        "Standard",
        "मानक",
        "IS 11057 covers industrial safety nets. Check the current text and your site's specification: a tender using it asks for mesh of 70 mm or less, with test certificates",
        "IS 11057 औद्योगिक सेफ्टी नेट को कवर करता है। मौजूदा टेक्स्ट और अपनी साइट की स्पेसिफ़िकेशन देखिए: एक निविदा 70 mm या कम का छेद और टेस्ट सर्टिफ़िकेट माँगती है"
      ),
      row(
        "Before you buy",
        "खरीदने से पहले",
        "A seller's claim of compliance is not verification. Ask for the test certificate and the maximum fall distance the net is rated for",
        "विक्रेता का अनुपालन का दावा सत्यापन नहीं है। टेस्ट सर्टिफ़िकेट और नेट की अधिकतम गिरावट की रेटिंग माँगिए"
      ),
    ],
  },
  "gi-weldmesh": {
    rows: [
      row(
        "Rolls",
        "रोल",
        "Trade listings offer 30 m rolls in widths of 0.6, 1, 1.2 and 1.5 m, and panels to order; wire 1.6 to 5 mm, grids 25 x 25 to 150 x 150 mm",
        "ट्रेड लिस्टिंग में 30 m के रोल 0.6, 1, 1.2 और 1.5 m चौड़ाई में, और ऑर्डर पर पैनल; तार 1.6 से 5 mm, ग्रिड 25 x 25 से 150 x 150 mm"
      ),
      row(
        "Zinc coating",
        "जिंक कोटिंग",
        "Quoted in g/m2 (GSM), commonly 40 to 120; a higher figure lasts longer outdoors",
        "g/m2 (GSM) में बताई जाती है, आम तौर पर 40 से 120; ज़्यादा GSM बाहर ज़्यादा चलती है"
      ),
    ],
  },
  "ms-weldmesh": {
    rows: [
      row(
        "Rolls",
        "रोल",
        "Trade listings offer 30 m rolls in widths of 0.6, 1, 1.2 and 1.5 m, and panels to order; wire 1.6 to 5 mm, grids 25 x 25 to 150 x 150 mm",
        "ट्रेड लिस्टिंग में 30 m के रोल 0.6, 1, 1.2 और 1.5 m चौड़ाई में, और ऑर्डर पर पैनल; तार 1.6 से 5 mm, ग्रिड 25 x 25 से 150 x 150 mm"
      ),
    ],
  },
  "chicken-net": {
    rows: [
      row(
        "Gauge",
        "गेज",
        "Wire is quoted by gauge; a higher number is thinner wire, so 22 gauge is lighter than 20 gauge",
        "तार गेज में बताया जाता है; बड़ा नंबर पतला तार, यानी 22 गेज 20 गेज से हल्का है"
      ),
      row("Opening", "छेद", "1 in and 2 in hexagonal openings are the common sizes", "1 in और 2 in के षट्कोणीय छेद आम साइज़ हैं"),
    ],
  },
};
