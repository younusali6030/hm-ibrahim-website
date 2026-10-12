/**
 * Buying frameworks for the nine category pages: the questions that decide what a buyer should order,
 * and what to send with an enquiry so the rate comes back in one call.
 *
 * Rules (same as the rest of the site): general product knowledge only. No prices, no stock claims, no
 * made-up sizes. Anything about this shop (delivery, pickup, cutting) repeats facts already on /contact,
 * /services and the product FAQs. Each entry is in English and Hindi, so the page needs no dictionary lookup.
 */

type Bi = { en: string; hi: string };

export type CategoryGuide = {
  /** One short paragraph under "How to choose" explaining the main decision for the range. */
  decision: Bi;
  /** Visible buying questions. These lead the category FAQ block and the FAQPage markup. */
  choose: { q: Bi; a: Bi }[];
  /** What to send with the enquiry, in the order a counter person asks for it. */
  send: Bi[];
};

export const categoryGuides: Record<string, CategoryGuide> = {
  "fencing-material": {
    decision: {
      en: "Fencing is chosen by what it must stop. Chain link keeps people and animals out and can be seen through. Barbed and concertina wire add deterrence on top of a wall or around a plot. Welded mesh panels are rigid and suit guards and cages.",
      hi: "फेंसिंग इस आधार पर चुनी जाती है कि उसे क्या रोकना है। चेन लिंक लोगों और जानवरों को रोकती है और आर-पार दिखती है। कांटेदार और कंसर्टिना तार दीवार के ऊपर या प्लॉट के चारों ओर रोक बढ़ाते हैं। वेल्डेड मेश पैनल सख्त होते हैं और गार्ड व पिंजरों में काम आते हैं।",
    },
    choose: [
      {
        q: { en: "Chain link or barbed wire for a boundary?", hi: "बाउंड्री के लिए चेन लिंक या कांटेदार तार?" },
        a: {
          en: "Chain link is a woven mesh fence: it blocks passage and keeps its shape on posts, so it suits compounds, plots and sports grounds. Barbed wire is strands with barbs: it is lighter and cheaper to run, and it is used around farms or as a top line over a wall. Many boundaries use both: chain link for the body and barbed wire above it.",
          hi: "चेन लिंक बुनी हुई जाली की बाड़ है: यह रास्ता रोकती है और खंभों पर अपना आकार रखती है, इसलिए कंपाउंड, प्लॉट और खेल के मैदान में लगती है। कांटेदार तार काँटों वाली लड़ियाँ हैं: हल्की होती है, खेत के चारों ओर या दीवार के ऊपर लगती है। कई बाउंड्री में दोनों लगते हैं: नीचे चेन लिंक और ऊपर कांटेदार तार।",
        },
      },
      {
        q: { en: "GI or PVC-coated chain link?", hi: "जीआई या पीवीसी कोटेड चेन लिंक?" },
        a: {
          en: "GI (galvanised) chain link has a zinc coat on bare wire and is the plain, common choice. PVC-coated chain link has a plastic layer over the wire, which is chosen for looks and extra protection outdoors. Tell us which finish you want; both are listed on the chain link page, and availability depends on stock.",
          hi: "जीआई (गैल्वनाइज़्ड) चेन लिंक में तार पर जिंक की परत होती है, यह सादा और आम विकल्प है। पीवीसी कोटेड चेन लिंक में तार पर प्लास्टिक की परत होती है, जो दिखावट और बाहर ज़्यादा सुरक्षा के लिए चुनी जाती है। जो फिनिश चाहिए बताइए; दोनों चेन लिंक पेज पर हैं, उपलब्धता स्टॉक पर निर्भर है।",
        },
      },
      {
        q: { en: "What dimensions do I send for chain link?", hi: "चेन लिंक के लिए कौन-से माप बताने हैं?" },
        a: {
          en: "Send the roll height (for example 4 ft or 6 ft), the mesh opening, the wire thickness, the finish (GI or PVC) and the total length of boundary. The chain link page lists mesh openings of 1 to 4 inch, wire of 1.5 to 4 mm and heights of 3 to 10 ft.",
          hi: "रोल की ऊँचाई (जैसे 4 ft या 6 ft), जाली का छेद, तार की मोटाई, फिनिश (जीआई या पीवीसी) और बाउंड्री की कुल लंबाई बताइए। चेन लिंक पेज पर 1 से 4 इंच के छेद, 1.5 से 4 mm तार और 3 से 10 ft ऊँचाई दी गई है।",
        },
      },
      {
        q: { en: "How is fencing quoted?", hi: "फेंसिंग का रेट किस इकाई में बताया जाता है?" },
        a: {
          en: "The unit differs by item: wire is usually by weight, chain link by area or roll, and posts by piece. We confirm the unit with the rate so two quotes can be compared on the same basis. Send quantity and the delivery town with your request.",
          hi: "इकाई आइटम के हिसाब से बदलती है: तार आम तौर पर वज़न से, चेन लिंक क्षेत्रफल या रोल से और खंभे पीस से। हम रेट के साथ इकाई भी बताते हैं ताकि दो कोटेशन बराबरी पर तुलना हो सकें। मात्रा और डिलीवरी का शहर बताइए।",
        },
      },
    ],
    send: [
      { en: "Item: chain link, barbed wire, concertina, jhatka wire or weld mesh", hi: "आइटम: चेन लिंक, कांटेदार तार, कंसर्टिना, झटका तार या वेल्ड मेश" },
      { en: "Height, mesh opening and wire thickness (chain link and mesh)", hi: "ऊँचाई, जाली का छेद और तार की मोटाई (चेन लिंक और मेश)" },
      { en: "Finish: GI or PVC-coated, and brand if you have one in mind (CM, Border, Tata Wiron)", hi: "फिनिश: जीआई या पीवीसी कोटेड, और ब्रांड अगर तय हो (CM, Border, Tata Wiron)" },
      { en: "Length of boundary or number of rolls and coils", hi: "बाउंड्री की लंबाई या रोल और कॉइल की संख्या" },
      { en: "Delivery town, or pickup from Siyaganj", hi: "डिलीवरी का शहर, या सियागंज से पिकअप" },
    ],
  },

  wiremesh: {
    decision: {
      en: "Wiremesh is chosen by material, opening and wire thickness. The material decides rust and strength, the opening decides what passes through, and the wire thickness decides how stiff it is.",
      hi: "वायरमेश का चुनाव मटेरियल, छेद और तार की मोटाई से होता है। मटेरियल से जंग और मज़बूती तय होती है, छेद से तय होता है कि क्या निकल सकता है, और तार की मोटाई से कड़ापन।",
    },
    choose: [
      {
        q: { en: "GI, MS or SS wiremesh: which one?", hi: "जीआई, एमएस या एसएस वायरमेश: कौन-सी?" },
        a: {
          en: "MS (mild steel) mesh is the plain, lowest-cost steel and is meant to be painted or kept dry. GI (galvanised) mesh has a zinc coat for outdoor and damp places. SS (stainless) mesh does not rust and is used for filters and fine screens. Aluminium is light and rust-free and is common for window and insect screens.",
          hi: "एमएस (माइल्ड स्टील) मेश सादी और कम कीमत की होती है, इसे पेंट करके या सूखी जगह इस्तेमाल करना चाहिए। जीआई (गैल्वनाइज़्ड) मेश पर जिंक की परत होती है, बाहर और नमी वाली जगह के लिए। एसएस (स्टेनलेस) में जंग नहीं लगता, फ़िल्टर और बारीक छलनी में काम आती है। एल्युमिनियम हल्की और जंग-रहित है, खिड़की और कीट-जाली में आम है।",
        },
      },
      {
        q: { en: "What is the difference between wiremesh and weldmesh?", hi: "वायरमेश और वेल्डमेश में क्या फ़र्क है?" },
        a: {
          en: "Wiremesh is woven or crimped from wire, so it is flexible and used for screening, sifting and guards. Weldmesh has its wires welded at every crossing, so it is stiff and holds its shape for cages, partitions and slab reinforcement. Welded mesh has its own category page.",
          hi: "वायरमेश तार को बुनकर या क्रिम्प करके बनती है, इसलिए लचीली होती है और छलनी, छँटाई और गार्ड में काम आती है। वेल्डमेश में हर क्रॉसिंग पर तार वेल्ड होते हैं, इसलिए सख्त होती है और पिंजरे, पार्टिशन और स्लैब रीइन्फोर्समेंट में आकार रखती है। वेल्डेड मेश का अलग कैटेगरी पेज है।",
        },
      },
      {
        q: { en: "What do I tell you to get a wiremesh rate?", hi: "वायरमेश का रेट पाने के लिए क्या बताना है?" },
        a: {
          en: "Say what it is for, the material, the opening size, the wire thickness, and whether you want a full roll or a cut length. Window and mosquito screens also need the width.",
          hi: "बताइए किस काम के लिए चाहिए, मटेरियल, छेद का साइज़, तार की मोटाई, और पूरा रोल चाहिए या कटी हुई लंबाई। खिड़की और मच्छर जाली में चौड़ाई भी बतानी होती है।",
        },
      },
      {
        q: { en: "Can the mesh be cut from the roll?", hi: "क्या जाली रोल से काटकर मिल जाती है?" },
        a: {
          en: "Yes, wiremesh is cut to your size at the Siyaganj counter. Measure the length and width you need and add a little for fixing.",
          hi: "जी हाँ, वायरमेश सियागंज काउंटर पर आपके नाप से काटी जाती है। ज़रूरत की लंबाई और चौड़ाई नाप लीजिए और लगाने के लिए थोड़ा ज़्यादा जोड़ लीजिए।",
        },
      },
    ],
    send: [
      { en: "Use: screening, sifting, guard, window, poultry, garden", hi: "उपयोग: छलनी, छँटाई, गार्ड, खिड़की, पोल्ट्री, बगीचा" },
      { en: "Material: GI, MS, SS or aluminium", hi: "मटेरियल: जीआई, एमएस, एसएस या एल्युमिनियम" },
      { en: "Opening size and wire thickness", hi: "छेद का साइज़ और तार की मोटाई" },
      { en: "Roll or cut length, and width", hi: "रोल या कटी लंबाई, और चौड़ाई" },
      { en: "Delivery town, or pickup from Siyaganj", hi: "डिलीवरी का शहर, या सियागंज से पिकअप" },
    ],
  },

  "welded-mesh": {
    decision: {
      en: "Welded mesh is chosen by wire thickness, grid size and coating. A thicker wire and a tighter grid make it stiffer and heavier; the coating decides where it can stand outdoors.",
      hi: "वेल्डेड मेश का चुनाव तार की मोटाई, ग्रिड साइज़ और कोटिंग से होता है। मोटा तार और छोटा ग्रिड इसे सख्त और भारी बनाते हैं; कोटिंग तय करती है कि यह बाहर कहाँ टिकेगी।",
    },
    choose: [
      {
        q: { en: "GI, MS or PVC-coated weldmesh?", hi: "जीआई, एमएस या पीवीसी कोटेड वेल्डमेश?" },
        a: {
          en: "MS weldmesh is plain steel and is normally used where it is embedded in concrete or painted, such as slab reinforcement. GI weldmesh is galvanised for outdoor use. PVC-coated weldmesh has a plastic layer and is used for visible garden and boundary fencing.",
          hi: "एमएस वेल्डमेश सादा स्टील है और आम तौर पर वहाँ लगता है जहाँ वह कंक्रीट में दबी या पेंट हो, जैसे स्लैब रीइन्फोर्समेंट। जीआई वेल्डमेश बाहर इस्तेमाल के लिए गैल्वनाइज़्ड है। पीवीसी कोटेड वेल्डमेश पर प्लास्टिक की परत होती है, दिखने वाली बगीचे और बाउंड्री फेंसिंग में लगती है।",
        },
      },
      {
        q: { en: "How do I read a weldmesh size?", hi: "वेल्डमेश का साइज़ कैसे पढ़ें?" },
        a: {
          en: "A grid is written as the gap between wires, for example 50 x 50 mm, and the wire is given in mm. The product pages list grids from 15 x 15 mm to 150 x 150 mm and wire of 3 to 5 mm; availability depends on stock.",
          hi: "ग्रिड तारों के बीच की दूरी से लिखा जाता है, जैसे 50 x 50 mm, और तार की मोटाई mm में। प्रोडक्ट पेज पर 15 x 15 mm से 150 x 150 mm ग्रिड और 3 से 5 mm तार दिए हैं; उपलब्धता स्टॉक पर निर्भर है।",
        },
      },
      {
        q: { en: "Rolls or panels?", hi: "रोल या पैनल?" },
        a: {
          en: "Rolls suit long runs and can be cut to length. Panels are flat, rigid sheets for cages, partitions and guards. Tell us which you need and the size.",
          hi: "रोल लंबी दूरी के लिए ठीक हैं और लंबाई में काटे जा सकते हैं। पैनल सपाट, सख्त शीट होते हैं, पिंजरे, पार्टिशन और गार्ड के लिए। कौन-सा चाहिए और साइज़ बताइए।",
        },
      },
    ],
    send: [
      { en: "Use: slab, cage, partition, fence, garden", hi: "उपयोग: स्लैब, पिंजरा, पार्टिशन, बाड़, बगीचा" },
      { en: "Grid size and wire thickness", hi: "ग्रिड साइज़ और तार की मोटाई" },
      { en: "Coating: GI, MS (plain) or PVC", hi: "कोटिंग: जीआई, एमएस (सादा) या पीवीसी" },
      { en: "Roll or panel, with width and length", hi: "रोल या पैनल, चौड़ाई और लंबाई के साथ" },
      { en: "Quantity and delivery town, or pickup", hi: "मात्रा और डिलीवरी का शहर, या पिकअप" },
    ],
  },

  "perforated-sheets": {
    decision: {
      en: "A perforated sheet is chosen by sheet thickness, hole shape and size, and open area. Thickness decides stiffness, the hole decides what passes through, and the open area decides airflow and strength.",
      hi: "परफोरेटेड शीट का चुनाव शीट की मोटाई, छेद का आकार व साइज़ और खुले हिस्से से होता है। मोटाई से कड़ापन तय होता है, छेद से तय होता है कि क्या निकलेगा, और खुले हिस्से से हवा का बहाव और मज़बूती।",
    },
    choose: [
      {
        q: { en: "MS or GI perforated sheet?", hi: "एमएस या जीआई परफोरेटेड शीट?" },
        a: {
          en: "MS sheet is plain mild steel, usually painted or used indoors. GI sheet is galvanised for outdoor and damp use. SS and aluminium sheets are available on request.",
          hi: "एमएस शीट सादा माइल्ड स्टील है, आम तौर पर पेंट करके या अंदर इस्तेमाल होती है। जीआई शीट बाहर और नमी के लिए गैल्वनाइज़्ड है। एसएस और एल्युमिनियम शीट माँगने पर मिलती है।",
        },
      },
      {
        q: { en: "Which hole pattern should I pick?", hi: "छेद का कौन-सा पैटर्न चुनें?" },
        a: {
          en: "Round holes are the general choice for grading, screening and guards. Square, slot and hexagonal holes are chosen for flow, grip or looks. Larger holes pass more material; a larger open area passes more air but leaves the sheet weaker. The buying guide on hole patterns explains the trade-off.",
          hi: "गोल छेद आम तौर पर ग्रेडिंग, छँटाई और गार्ड के लिए होते हैं। चौकोर, स्लॉट और हेक्सागोनल छेद बहाव, पकड़ या सुंदरता के लिए चुने जाते हैं। बड़े छेद ज़्यादा माल निकालते हैं; खुला हिस्सा ज़्यादा हो तो हवा ज़्यादा निकलती है पर शीट कमज़ोर होती है। छेद के पैटर्न की गाइड में यह समझाया है।",
        },
      },
      {
        q: { en: "What do I send for a perforated sheet rate?", hi: "परफोरेटेड शीट का रेट पूछने के लिए क्या भेजें?" },
        a: {
          en: "Thickness, hole shape and size, pitch if you know it, material, sheet size and quantity. A photo or a sample piece helps us match the pattern.",
          hi: "मोटाई, छेद का आकार और साइज़, पिच अगर पता हो, मटेरियल, शीट का साइज़ और मात्रा। फ़ोटो या सैंपल का टुकड़ा पैटर्न मिलाने में मदद करता है।",
        },
      },
    ],
    send: [
      { en: "Material: MS, GI (SS or aluminium on request)", hi: "मटेरियल: एमएस, जीआई (एसएस या एल्युमिनियम माँगने पर)" },
      { en: "Thickness", hi: "मोटाई" },
      { en: "Hole shape, hole size and pitch", hi: "छेद का आकार, साइज़ और पिच" },
      { en: "Sheet size or cut size, and quantity", hi: "शीट का साइज़ या कटा साइज़, और मात्रा" },
      { en: "A photo or sample if you are matching an existing pattern", hi: "पुराने पैटर्न से मिलाना हो तो फ़ोटो या सैंपल" },
    ],
  },

  wires: {
    decision: {
      en: "Wire is chosen by gauge, finish and how it is packed. The gauge decides strength, the finish decides where it can be used, and the pack decides how much you buy in one go.",
      hi: "तार का चुनाव गेज, फिनिश और पैकिंग से होता है। गेज से मज़बूती तय होती है, फिनिश से तय होता है कि कहाँ लगेगा, और पैकिंग से कि एक बार में कितना लेना है।",
    },
    choose: [
      {
        q: { en: "GI wire or binding wire?", hi: "जीआई तार या बाइंडिंग तार?" },
        a: {
          en: "Binding wire is black annealed wire, soft enough to tie reinforcement bars by hand, and is the usual choice for construction. GI wire is galvanised for fencing, tying outdoors and general use where rust matters.",
          hi: "बाइंडिंग तार काला एनील्ड तार है, इतना नरम कि हाथ से सरिया बाँधा जा सके, निर्माण में आम तौर पर यही लगता है। जीआई तार गैल्वनाइज़्ड है, फेंसिंग, बाहर बाँधने और उन कामों के लिए जहाँ जंग की चिंता हो।",
        },
      },
      {
        q: { en: "How do I read the gauge?", hi: "गेज कैसे पढ़ें?" },
        a: {
          en: "Gauge is a number where a bigger number means thinner wire (SWG), so 8 SWG is much thicker than 18 SWG. If you know the diameter in mm, send that instead. The wire gauge guide has a conversion table.",
          hi: "गेज एक नंबर है जिसमें बड़ा नंबर पतला तार होता है (SWG), यानी 8 SWG, 18 SWG से बहुत मोटा है। अगर mm में व्यास पता हो तो वही बताइए। वायर गेज गाइड में कन्वर्ज़न टेबल है।",
        },
      },
      {
        q: { en: "Wire rope or wire?", hi: "वायर रोप या तार?" },
        a: {
          en: "Wire rope is many strands twisted together for pulling, lifting and tensioning; plain wire is a single strand for tying and fencing. Rope is chosen by diameter and construction, and for lifting the working-load limit must come from the supplier's rating, not from a general table.",
          hi: "वायर रोप कई लड़ों को ऐंठकर बनता है, खींचने, उठाने और तानने के लिए; सादा तार एक लड़ का होता है, बाँधने और फेंसिंग के लिए। रोप व्यास और बनावट से चुना जाता है, और उठाने के काम में सुरक्षित लोड सप्लायर की रेटिंग से लेना चाहिए, किसी सामान्य टेबल से नहीं।",
        },
      },
    ],
    send: [
      { en: "Item: GI wire, binding wire, jhatka wire, wire rope or clamps", hi: "आइटम: जीआई तार, बाइंडिंग तार, झटका तार, वायर रोप या क्लैंप" },
      { en: "Gauge in SWG, or diameter in mm", hi: "गेज SWG में, या व्यास mm में" },
      { en: "Material for rope: MS, GI or SS", hi: "रोप का मटेरियल: एमएस, जीआई या एसएस" },
      { en: "Quantity in kg or coils", hi: "मात्रा kg या कॉइल में" },
      { en: "Brand if you have one in mind (for example Tata Wiron)", hi: "ब्रांड अगर तय हो (जैसे Tata Wiron)" },
    ],
  },

  "structural-items": {
    decision: {
      en: "Steel sections are chosen by shape first, then size, thickness and length. Angles, flats and channels do different jobs, so name the shape before the size.",
      hi: "स्टील सेक्शन पहले आकार से, फिर साइज़, मोटाई और लंबाई से चुने जाते हैं। एंगल, फ्लैट और चैनल अलग-अलग काम करते हैं, इसलिए साइज़ से पहले आकार बताइए।",
    },
    choose: [
      {
        q: { en: "Angle, flat or channel: which one?", hi: "एंगल, फ्लैट या चैनल: कौन-सा?" },
        a: {
          en: "Angles (L-section) suit frames, posts and brackets. Flats suit grills, base plates and straps. Channels (U-section) carry load along their length, as in purlins and supports. Send the section, size, thickness and length for each.",
          hi: "एंगल (L-सेक्शन) फ्रेम, खंभे और ब्रैकेट के लिए। फ्लैट ग्रिल, बेस प्लेट और पट्टी के लिए। चैनल (U-सेक्शन) लंबाई में भार उठाता है, जैसे पर्लिन और सपोर्ट में। हर एक का सेक्शन, साइज़, मोटाई और लंबाई बताइए।",
        },
      },
      {
        q: { en: "TMT bar or MS round bar?", hi: "टीएमटी सरिया या एमएस गोल बार?" },
        a: {
          en: "TMT bars are ribbed, heat-treated bars for RCC reinforcement and are bought by diameter and grade. MS round bars are plain bars for fabrication, pins and grills. Do not swap one for the other on a structural drawing.",
          hi: "टीएमटी सरिया पसलियों वाला, हीट-ट्रीटेड बार है, आरसीसी रीइन्फोर्समेंट के लिए, और व्यास व ग्रेड से खरीदा जाता है। एमएस गोल बार सादा बार है, फैब्रिकेशन, पिन और ग्रिल के लिए। स्ट्रक्चरल ड्रॉइंग में एक की जगह दूसरा न लगाएँ।",
        },
      },
      {
        q: { en: "GI pipe or MS pipe?", hi: "जीआई पाइप या एमएस पाइप?" },
        a: {
          en: "GI pipe is galvanised for water lines and outdoor use where rust matters. MS pipe is plain mild steel for structural and fabrication work. Give the nominal bore and the wall thickness or class you need.",
          hi: "जीआई पाइप गैल्वनाइज़्ड है, पानी की लाइन और बाहर के काम के लिए जहाँ जंग की चिंता हो। एमएस पाइप सादा माइल्ड स्टील है, स्ट्रक्चरल और फैब्रिकेशन के लिए। नॉमिनल बोर और दीवार की मोटाई या क्लास बताइए।",
        },
      },
      {
        q: { en: "What do I send to get a rate on steel?", hi: "स्टील का रेट पाने के लिए क्या भेजें?" },
        a: {
          en: "The section, size (for example 50 x 50 mm), thickness, length (6 m or 12 m), black or bright finish, quantity, and whether you will collect or want delivery. The structural guides list common size and weight tables.",
          hi: "सेक्शन, साइज़ (जैसे 50 x 50 mm), मोटाई, लंबाई (6 m या 12 m), काला या ब्राइट फिनिश, मात्रा, और खुद उठाएँगे या डिलीवरी चाहिए। स्ट्रक्चरल गाइड में आम साइज़ और वज़न की टेबल हैं।",
        },
      },
    ],
    send: [
      { en: "Section: angle, flat, channel, beam, bar or pipe", hi: "सेक्शन: एंगल, फ्लैट, चैनल, बीम, बार या पाइप" },
      { en: "Size and thickness (or diameter and grade for TMT)", hi: "साइज़ और मोटाई (टीएमटी में व्यास और ग्रेड)" },
      { en: "Length: 6 m, 12 m or cut", hi: "लंबाई: 6 m, 12 m या कटी हुई" },
      { en: "Quantity in pieces, kg or tonnes", hi: "मात्रा पीस, kg या टन में" },
      { en: "Delivery town, or pickup from Siyaganj", hi: "डिलीवरी का शहर, या सियागंज से पिकअप" },
    ],
  },

  "construction-tools": {
    decision: {
      en: "Site tools are chosen by weight, head size and handle. Heavier tools do more per swing and tire sooner, so pick for the work and the person using it.",
      hi: "साइट के औज़ार वज़न, सिर के साइज़ और हत्थे से चुने जाते हैं। भारी औज़ार हर वार में ज़्यादा काम करता है पर जल्दी थकाता है, इसलिए काम और चलाने वाले के हिसाब से चुनिए।",
    },
    choose: [
      {
        q: { en: "Which weight of sledge hammer or crowbar?", hi: "घन या सब्बल कितने वज़न का लें?" },
        a: {
          en: "Lighter heads suit demolition of small sections and long use; heavier ones suit breaking and driving work. Tell us the weight or length you use now, or what the work is, and we will show what we have.",
          hi: "हल्के सिर छोटे हिस्सों की तोड़-फोड़ और लंबे इस्तेमाल के लिए, भारी सिर तोड़ने और ठोकने के लिए। अभी जो वज़न या लंबाई इस्तेमाल करते हैं या काम क्या है बताइए, हम जो है दिखा देंगे।",
        },
      },
      {
        q: { en: "Faurdha with a handle or without?", hi: "फौड़ा हत्थे के साथ या बिना?" },
        a: {
          en: "Both are on the site. The blade alone suits buyers who fit their own handle or buy in numbers; the handled one is ready to use. Handle length and material can differ with stock.",
          hi: "दोनों साइट पर हैं। सिर्फ़ ब्लेड उन खरीदारों के लिए जो अपना हत्था लगाते हैं या गिनती में लेते हैं; हत्थे वाला सीधे इस्तेमाल के लिए। हत्थे की लंबाई और मटेरियल स्टॉक के अनुसार अलग हो सकते हैं।",
        },
      },
      {
        q: { en: "How do I choose welding rods?", hi: "वेल्डिंग रॉड कैसे चुनें?" },
        a: {
          en: "Rods are chosen by type (for example E6013 or E7018, which are commonly requested) and by diameter. The metal being welded, its thickness and the joint decide the type; the current of your machine decides the diameter.",
          hi: "रॉड टाइप (जैसे E6013 या E7018, जो आम तौर पर माँगे जाते हैं) और व्यास से चुनी जाती है। किस धातु और कितनी मोटाई का जोड़ है, इससे टाइप तय होता है; आपकी मशीन के करंट से व्यास।",
        },
      },
    ],
    send: [
      { en: "Tool and brand (SR, Tata or other)", hi: "औज़ार और ब्रांड (SR, Tata या कोई और)" },
      { en: "Weight, head size or length you use", hi: "जो वज़न, सिर का साइज़ या लंबाई इस्तेमाल करते हैं" },
      { en: "With or without handle", hi: "हत्थे के साथ या बिना" },
      { en: "Quantity", hi: "मात्रा" },
      { en: "Delivery town, or pickup from Siyaganj", hi: "डिलीवरी का शहर, या सियागंज से पिकअप" },
    ],
  },

  nails: {
    decision: {
      en: "Nails are chosen by length, thickness and head. Length decides how far it goes into the timber or surface; thickness decides whether it splits the wood; the head decides what it holds down.",
      hi: "कील लंबाई, मोटाई और सिर से चुनी जाती है। लंबाई से तय होता है कि लकड़ी या सतह में कितनी जाएगी; मोटाई से कि लकड़ी फटेगी या नहीं; और सिर से कि क्या दबाकर रखेगी।",
    },
    choose: [
      {
        q: { en: "What length of nail should I buy?", hi: "कितनी लंबाई की कील लें?" },
        a: {
          en: "A common rule is a nail about two to three times the thickness of the thinner piece being fixed. Wire nails are listed from 1 to 6 inch and roofing nails from 1.5 to 6 inch. Tell us what is being fixed to what.",
          hi: "आम नियम है कि कील उस पतले टुकड़े की मोटाई से दो से तीन गुनी लंबी हो जिसे लगाना है। वायर नेल 1 से 6 इंच और रूफिंग नेल 1.5 से 6 इंच में सूचीबद्ध हैं। बताइए क्या किस पर लगाना है।",
        },
      },
      {
        q: { en: "Wire nail or roofing nail?", hi: "वायर नेल या रूफिंग नेल?" },
        a: {
          en: "Wire nails are the general nail for timber and carpentry. Roofing nails have a wide head, often with a washer, to hold sheets down without tearing through. Use roofing nails for roof sheets.",
          hi: "वायर नेल लकड़ी और बढ़ईगिरी की आम कील है। रूफिंग नेल का सिर चौड़ा होता है, अक्सर वॉशर के साथ, ताकि शीट को बिना फाड़े दबाकर रखे। छत की शीट के लिए रूफिंग नेल लीजिए।",
        },
      },
      {
        q: { en: "How are nails sold?", hi: "कील किस इकाई में बिकती है?" },
        a: {
          en: "By weight, in the length you choose. Tell us the length and kilograms; we confirm the rate and the pack with the quote.",
          hi: "वज़न से, आपकी चुनी हुई लंबाई में। लंबाई और किलो बताइए; रेट और पैक हम कोटेशन में बताते हैं।",
        },
      },
    ],
    send: [
      { en: "Wire nail or roofing nail", hi: "वायर नेल या रूफिंग नेल" },
      { en: "Length in inches", hi: "लंबाई इंच में" },
      { en: "Plain or galvanised, if it matters", hi: "सादी या गैल्वनाइज़्ड, अगर ज़रूरी हो" },
      { en: "Quantity in kg", hi: "मात्रा kg में" },
    ],
  },

  "safety-nets-equipments": {
    decision: {
      en: "Bird protection and safety netting are chosen by what they must stop and where they are fixed. Pigeon net blocks a balcony or shaft, spikes stop birds perching on a ledge, and safety net is a construction-site item.",
      hi: "पक्षियों से बचाव और सेफ्टी नेट इस आधार पर चुने जाते हैं कि क्या रोकना है और कहाँ लगाना है। कबूतर जाली बालकनी या शाफ़्ट बंद करती है, स्पाइक मुंडेर पर बैठना रोकते हैं, और सेफ्टी नेट निर्माण स्थल का सामान है।",
    },
    choose: [
      {
        q: { en: "Pigeon net or bird spikes?", hi: "कबूतर जाली या बर्ड स्पाइक?" },
        a: {
          en: "Net closes an open space such as a balcony, window or duct so birds cannot enter. Spikes sit on ledges, sills and pipes to stop birds landing there. A balcony usually needs net; a ledge usually needs spikes.",
          hi: "जाली बालकनी, खिड़की या डक्ट जैसी खुली जगह बंद करती है ताकि पक्षी अंदर न आएँ। स्पाइक मुंडेर, सिल और पाइप पर लगते हैं ताकि पक्षी वहाँ बैठ न सकें। बालकनी में आम तौर पर जाली, मुंडेर पर स्पाइक।",
        },
      },
      {
        q: { en: "How do I measure for pigeon net?", hi: "कबूतर जाली के लिए नाप कैसे लें?" },
        a: {
          en: "Measure the width and height of the opening and add a little on each side for fixing. Say whether you need the mesh size small enough for small birds. The pigeon net guide shows the steps.",
          hi: "खुली जगह की चौड़ाई और ऊँचाई नापिए और लगाने के लिए हर तरफ़ थोड़ा जोड़ लीजिए। बताइए कि छोटे पक्षियों के लिए छेद छोटा चाहिए या नहीं। कबूतर जाली की गाइड में तरीका दिया है।",
        },
      },
      {
        q: { en: "Does safety net carry a certificate?", hi: "क्या सेफ्टी नेट के साथ प्रमाणपत्र मिलता है?" },
        a: {
          en: "If your project needs a rated or certified net, tell us when you ask. Do not assume a net suits a given fall or load without the manufacturer's specification for it.",
          hi: "अगर आपके प्रोजेक्ट में रेटेड या प्रमाणित नेट चाहिए तो पूछते समय बताइए। किसी भी नेट को किसी गिरावट या भार के लिए ठीक न मानिए जब तक निर्माता की उसकी स्पेसिफ़िकेशन न मिले।",
        },
      },
    ],
    send: [
      { en: "Item: pigeon net, bird spikes or safety net", hi: "आइटम: कबूतर जाली, बर्ड स्पाइक या सेफ्टी नेट" },
      { en: "Opening width and height, or length of ledge", hi: "खुली जगह की चौड़ाई और ऊँचाई, या मुंडेर की लंबाई" },
      { en: "Mesh size or spike type (plastic or steel)", hi: "जाली का छेद या स्पाइक का प्रकार (प्लास्टिक या स्टील)" },
      { en: "For safety net: the specification your site requires", hi: "सेफ्टी नेट के लिए: आपकी साइट की ज़रूरी स्पेसिफ़िकेशन" },
      { en: "Delivery town, or pickup from Siyaganj", hi: "डिलीवरी का शहर, या सियागंज से पिकअप" },
    ],
  },
};

/** Delivery and pickup facts, identical to the product FAQs and the quote form. Nothing here is a promise of a date or a charge. */
export const deliveryFacts = {
  pickup: {
    en: "Collect from the Siyaganj shop, Monday to Saturday.",
    hi: "सियागंज की दुकान से ले जाइए, सोमवार से शनिवार।",
  },
  nearby: {
    en: "Indore city and nearby industrial areas such as Dewas, Ujjain, Mhow and Pithampur are handled from the Siyaganj shop.",
    hi: "इंदौर शहर और देवास, उज्जैन, महू व पीथमपुर जैसे आसपास के औद्योगिक इलाके सियागंज की दुकान से सँभाले जाते हैं।",
  },
  india: {
    en: "Orders are accepted across India. Delivery arrangements are confirmed with each quotation, so give the delivery town when you ask.",
    hi: "पूरे भारत से ऑर्डर स्वीकार होते हैं। डिलीवरी की व्यवस्था हर कोटेशन के साथ तय होती है, इसलिए पूछते समय डिलीवरी का शहर बताइए।",
  },
} as const;

/**
 * Unit the shop quotes this item in, read from the owner's own indicative-rate note ("... per kg ...").
 * Only the unit is used. No figure from that note is shown.
 */
export function quoteUnit(rate: string | undefined, hi: boolean): string | null {
  const m = rate?.match(/\bper\s+(kg|metre|meter|piece|sq\.? ?m)\b/i);
  if (!m) return null;
  const u = m[1].toLowerCase().replace(/\s|\./g, "");
  const en: Record<string, string> = { kg: "kg", metre: "metre", meter: "metre", piece: "piece", sqm: "sq m" };
  const hin: Record<string, string> = { kg: "किलो", metre: "मीटर", meter: "मीटर", piece: "पीस", sqm: "वर्ग मीटर" };
  return (hi ? hin : en)[u] ?? null;
}
