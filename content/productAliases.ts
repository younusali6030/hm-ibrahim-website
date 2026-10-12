/**
 * Search aliases: the names buyers actually say at the counter, mapped to the product slugs they mean.
 *
 * Only terms already used in this repo's own product copy, reel titles, blog posts or docs/seo/keyword-map.md are
 * listed (spec lines such as "Also called: Machhar jali", the keyword map, reel titles). Each slug lists its own
 * aliases, so a word never reaches a product it does not describe. Spelling variants (jali / jaali / jhali) are
 * folded by normalizeText() in lib/productSearch.ts, so only genuinely different words are repeated here.
 *
 * Not mapped, because nothing in the catalogue data confirms them: "waterproofing mesh". Add the product here
 * once the shop confirms which item it is (see docs/report/AUDIT-2026-10.md).
 */

/** Mesh and net products a buyer may call "jali". Kept as one list so "jali" never reaches bars, pipes or tools. */
const JALI_FAMILY = [
  "ms-wiremesh",
  "gi-wiremesh",
  "aluminium-wiremesh",
  "crimp-wiremesh",
  "expanded-metal-mesh",
  "mosquito-net",
  "ss-fine-mesh",
  "chicken-net",
  "plastic-hexagonal-poultry-mesh",
  "square-mesh",
  "gi-weldmesh",
  "ms-weldmesh",
  "pvc-coated-weldmesh",
  "chain-link-fencing",
  "pigeon-nets",
  "gi-perforated-sheet",
  "ms-perforated-sheet",
];

const SPECIFIC: Record<string, string[]> = {
  // Binding wire: "kala taar" is the market name (productCopy FAQ, reel title).
  // "biranji" is how buyers write binding wire in their Google reviews (g011, g111, g125).
  "binding-wire": ["kala taar", "kala tar", "black wire", "annealed wire", "biranji", "बिरंजी", "काला तार", "बाइंडिंग तार"],
  "barbed-wire": ["kata taar", "kanta taar", "कांटेदार तार", "काँटेदार तार", "कांटा तार"],
  "concertina-wire": ["razor wire", "razor coil", "concertina coil", "रेज़र तार", "कंसर्टिना"],
  "gi-wire": ["galvanised wire", "galvanized wire", "gi taar", "जीआई तार", "गैल्वनाइज़्ड तार"],
  "jhatka-machine-fencing-wire": ["jhatka machine wire", "jhatka taar", "झटका तार", "झटका मशीन"],
  "chain-link-fencing": ["chainlink", "chain link wire", "chainlink wire", "chain link jali", "compound wall jali", "fencing jali", "चेन लिंक", "चैन लिंक", "फेंसिंग जाली"],
  "mosquito-net": ["machhar jali", "machhar net", "mosquito mesh", "window jali", "window mesh", "मच्छर जाली", "मच्छरदानी", "मच्छर जाल"],
  "ms-holepass": ["hole pass", "holepass bracket", "होलपास"],
  "ss-fine-mesh": ["ss wire mesh", "ss jali", "ss mesh", "ss mosquito net", "stainless mesh", "stainless steel jali", "एसएस जाली"],
  "chicken-net": ["murga jali", "murga net", "chicken mesh", "chicken wire", "poultry jali", "poultry mesh", "मुर्गा जाली", "मुर्गी जाली", "चिकन मेश"],
  "plastic-hexagonal-poultry-mesh": ["pvc hexa mesh", "plastic jali", "garden jali", "poultry fencing", "हेक्सा मेश"],
  "pigeon-nets": ["kabootar jali", "kabutar jali", "kabootar net", "balcony net", "balcony jali", "pigeon jali", "कबूतर जाली", "कबूतर जाल", "बालकनी जाली"],
  "pigeon-spikes": ["bird spikes", "kabootar spikes", "कबूतर स्पाइक"],
  "gi-weldmesh": ["weldmesh jali", "welded jali", "weld mesh", "वेल्डमेश जाली", "वेल्ड मेश"],
  "ms-weldmesh": ["weldmesh jali", "welded jali", "weld mesh", "वेल्डमेश जाली", "वेल्ड मेश"],
  "pvc-coated-weldmesh": ["weldmesh jali", "welded jali", "pvc jali", "वेल्डमेश जाली"],
  "gi-perforated-sheet": ["chaddar jali", "chadar jali", "chaddar", "punched sheet", "jali sheet", "छेद वाली चादर", "चादर जाली", "चद्दर जाली"],
  "ms-perforated-sheet": ["chaddar jali", "chadar jali", "chaddar", "punched sheet", "jali sheet", "छेद वाली चादर", "चादर जाली", "चद्दर जाली"],
  "expanded-metal-mesh": ["expanded jali", "diamond jali", "expanded metal jali", "एक्सपैंडेड जाली"],
  "tmt-bars": ["sariya", "saria", "sarya", "tmt sariya", "rebar", "reinforcement bar", "fe 500", "fe 500d", "fe 550", "सरिया", "टीएमटी", "टीएमटी सरिया"],
  "ms-round-bars": ["round bar", "round rod", "ms rod", "गोल सरिया", "एमएस रॉड"],
  "ms-angles": ["angle iron", "ms angle", "iron angle", "angle", "एंगल", "लोहे का एंगल"],
  "ms-flats": ["flat bar", "ms flat", "iron flat", "फ्लैट"],
  "ms-channels": ["channel", "ms channel", "u channel", "चैनल"],
  "ms-i-beams-joists": ["beam", "joist", "i beam", "बीम"],
  "gi-pipes": ["gi pipe", "galvanised pipe", "जीआई पाइप"],
  "ms-pipes": ["ms pipe", "iron pipe", "एमएस पाइप"],
  "frp-bars": ["frp rod", "fibre bar", "fiber bar", "एफआरपी"],
  "fiber-mesh": ["fibre mesh", "fibreglass mesh", "plaster mesh", "फाइबर मेश"],
  "concrete-cover-block": ["cover block", "cover blocks", "spacer block", "कवर ब्लॉक"],
  // "kheel" and "Bombay kheel" appear in review g147.
  "fasteners-nails": ["wire nail", "kheel", "bombay kheel", "कील", "तार की कील"],
  "roofing-nail": ["roof nail", "छत की कील"],
  "sr-hoe-faurdha": ["phawda", "phavda", "fawda", "faurdha", "fauda", "hoe", "फावड़ा", "फौड़ा"],
  "sr-hoe-faurdha-with-handle": ["phawda", "phavda", "fawda", "faurdha", "fauda", "hoe with handle", "फावड़ा", "फौड़ा"],
  "sr-pickaxe-geti": ["geti", "gaiti", "pickaxe", "pick axe", "गेंती", "गैंती"],
  "sr-crowbar": ["sabbal", "sabal", "saabal", "crow bar", "सब्बल", "सबल"],
  "sr-sledge-hammer": ["ghan", "ghun", "hammer", "घन", "हथौड़ा"],
  "santing-shikanja": ["shikanja", "shuttering clamp", "centring clamp", "शिकंजा", "सेंटरिंग"],
  "welding-rods": ["welding rod", "electrode", "वेल्डिंग रॉड"],
  "cutting-discs-grinding-wheels": ["cutting wheel", "grinding disc", "कटिंग डिस्क"],
  "ms-wire-rope": ["rope", "wire rope", "वायर रोप"],
  "gi-wire-rope": ["rope", "wire rope", "वायर रोप"],
  "ss-wire-rope": ["rope", "wire rope", "ss rope", "वायर रोप"],
  "safety-net": ["construction net", "सेफ्टी नेट"],
};

/** slug -> alias list (English, Hindi and transliterations). */
export const productAliases: Record<string, string[]> = (() => {
  const out: Record<string, string[]> = {};
  for (const [slug, list] of Object.entries(SPECIFIC)) out[slug] = [...list];
  for (const slug of JALI_FAMILY) (out[slug] ??= []).push("jali", "jaali", "जाली");
  return out;
})();
