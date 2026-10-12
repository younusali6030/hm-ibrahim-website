/**
 * Real Google reviews (verbatim) tagged to the products they talk about.
 * Source: the shop's Google listing. Tags were assigned from the words in each review.
 * Never edit review text. To add more, append an entry with the exact Google text.
 */
import { getProductBySlug } from "./products";

export type TaggedReview = {
  id: string;
  author: string;
  rating: 4 | 5;
  text: string;
  when: string;
  /** Product slugs this review talks about */
  tags: string[];
};

export const taggedReviews: TaggedReview[] = [
  { id: "g000", author: "Kopal Diwan", rating: 5, when: "October 2026", tags: [], text: "Purchased PVC garden fencing, really good product and material." },
  { id: "g001", author: "Chauhan Meenakshi", rating: 5, when: "October 2026", tags: [], text: "Very gud  understanding Very gud quality n services handled by vendors working in shop" },
  { id: "g002", author: "Equity Research Vijitone", rating: 5, when: "October 2026", tags: [], text: "Misquito net\nAluminum grill\nWelcro\nAll type if neshes wth good variety options.\nExcellent shop in siyaganj.\nOne if uts kind in indore wholesale and retail shop.\nIron products too available." },
  { id: "g006", author: "rahul parmar", rating: 5, when: "October 2026", tags: [], text: "It’s a nice shop located in main market.\nOwner is good and rates are best from market" },
  { id: "g007", author: "Team Green House Nursery", rating: 5, when: "October 2026", tags: [], text: "Tata & Sr products huge range and best rate. Tata wire also available.\nGood shop" },
  { id: "g009", author: "javed mugal", rating: 5, when: "October 2026", tags: [], text: "One stop shop for all construction hardware and wireless needs.\nFair price and really good nature of owner" },
  { id: "g011", author: "Manish Choudhary", rating: 5, when: "September 2026", tags: ["binding-wire"], text: "Must visit. Binding wire & biranji best wholesale rate" },
  { id: "g012", author: "Baban Patel", rating: 5, when: "September 2026", tags: [], text: "Excellent shop with great variety and best rates" },
  { id: "g016", author: "Arpit Barma", rating: 5, when: "September 2026", tags: [], text: "Very attentive service from the staff and the owner. I got what was right at that time and I appreciated it." },
  { id: "g017", author: "Sarru Shah", rating: 5, when: "September 2026", tags: ["wiremesh", "gi-wiremesh", "ms-wiremesh", "fibermesh", "fiber-mesh", "pigeon-nets", "pigeon-spikes", "safety-nets-equipments"], text: "Kabutar jali\nSpikes\nCricket net\nFibremesh best price in siyaganj indore" },
  { id: "g018", author: "rajesh shah", rating: 5, when: "September 2026", tags: [], text: "Jolly and all hardware item industrial  performance service good" },
  { id: "g019", author: "Rafik Lohar", rating: 5, when: "September 2026", tags: ["ms-angles", "ms-flats", "ms-channels", "ms-i-beams-joists", "wiremesh", "gi-wiremesh", "ms-wiremesh", "nails", "fasteners-nails", "roofing-nail"], text: "Fair rates throughout Siayaganj.\nWater mesh nails at reasonable prices.\nAngel flats at the best rates." },
  { id: "g020", author: "shyam Jhala", rating: 5, when: "September 2026", tags: ["gi-wire", "construction-tools", "sr-crowbar", "sr-pickaxe-geti", "sr-hoe-faurdha", "santing-shikanja", "nails", "fasteners-nails", "roofing-nail"], text: "Geti phawda sabbal sr tata  fair price.\nWirenail\nWire\nGi wire\nTata reasonable rate" },
  { id: "g021", author: "Bibin Babu", rating: 5, when: "September 2026", tags: [], text: "Had the best experience with the shop , the quality of the products are super well as well as the staff and specially the owner is very cooperative and helpful" },
  { id: "g022", author: "Sakshi Tiwari", rating: 5, when: "September 2026", tags: [], text: "Best shop for purchasing  hardware products in wholesale or retail in reasonable  price . Must visit this shop in siyaganj indore." },
  { id: "g023", author: "Rajendra Rajput", rating: 5, when: "September 2026", tags: ["wiremesh", "gi-wiremesh", "ms-wiremesh", "perforated-sheets", "gi-perforated-sheet", "ms-perforated-sheet"], text: "Ss perforated sheet all varieties.\nMs perforated sheet\nWiremesh\nAll available wholesale rate." },
  { id: "g024", author: "Gokul Nigrwal", rating: 5, when: "September 2026", tags: ["ms-angles", "ms-flats", "ms-channels", "ms-i-beams-joists", "frp-bars", "fibermesh", "fiber-mesh"], text: "Best shop of its kind in the indore market.\nWholesale price of mesges fibremesh frp  jhakta wire angel." },
  { id: "g025", author: "Aman Mandloi", rating: 5, when: "September 2026", tags: ["perforated-sheets", "gi-perforated-sheet", "ms-perforated-sheet"], text: "I purchased perforated sheet for my grading plant. Best rate and best product. All types of perforated sheet available" },
  { id: "g028", author: "Gulzar Restaurant", rating: 5, when: "September 2026", tags: ["wiremesh", "gi-wiremesh", "ms-wiremesh"], text: "Jali\nIron and hardware products reasonable price.\nBest shop in siyaganj" },
  { id: "g029", author: "Lankesh Arya", rating: 5, when: "September 2026", tags: ["ms-angles", "ms-flats", "ms-channels", "ms-i-beams-joists", "wiremesh", "gi-wiremesh", "ms-wiremesh", "mosquito-net", "frp-bars", "fibermesh", "fiber-mesh", "pigeon-nets", "pigeon-spikes", "safety-nets-equipments"], text: "Mosquito net\nKabootar jali.\nBest orice\nExcellent behaviour of owner.\nएंगेल channel frp waterproof jali.\nAvailable" },
  { id: "g030", author: "Deepak YADAV", rating: 5, when: "September 2026", tags: ["ms-angles", "ms-flats", "ms-channels", "ms-i-beams-joists", "wiremesh", "gi-wiremesh", "ms-wiremesh", "perforated-sheets", "gi-perforated-sheet", "ms-perforated-sheet", "jhatka-machine-fencing-wire", "frp-bars"], text: "Perforated sheet\nAngel\nWiremesh\nFrp\nJhatka wire\nTata wire for fencing and farming\nBansal wire\nAll at very fair price.\nBest shop in market.\nBehavioral nd Handling superb." },
  { id: "g032", author: "Narendra Patidar", rating: 5, when: "September 2026", tags: [], text: "best shop in siyaganj market. must visit. nice behaviour and fair prices." },
  { id: "g033", author: "Ayush Raghuwanshi", rating: 5, when: "August 2026", tags: ["wiremesh", "gi-wiremesh", "ms-wiremesh", "mosquito-net"], text: "Great quality SS mosquito jali at a reasonable price. Good service and helpful staff. Highly recommended" },
  { id: "g035", author: "Deepak Jain", rating: 5, when: "August 2026", tags: ["ms-angles", "ms-flats", "ms-channels", "ms-i-beams-joists", "jhatka-machine-fencing-wire", "ms-wire-rope", "ss-wire-rope", "gi-wire-rope", "wire-rope-clamp"], text: "Fro jhatka wire wirerope angel very reasonable rate.\nVery good behaviour of owner" },
  { id: "g036", author: "Sunil Makasre", rating: 5, when: "July 2026", tags: ["wiremesh", "gi-wiremesh", "ms-wiremesh", "gi-wire", "ms-wire-rope", "ss-wire-rope", "gi-wire-rope", "wire-rope-clamp"], text: "I have been purchasing various type of wiremesh products from this shop since 5 years. A great shop with huge variety.\nThe behavior is great and the staff is also helpful. They cater all our needs.\nThey also deal in wire rope and all type of GI & MS wire." },
  { id: "g039", author: "Saurabh Jain", rating: 5, when: "June 2026", tags: ["wiremesh", "gi-wiremesh", "ms-wiremesh", "mosquito-net"], text: "Purchased Sangam Jali and Mosquito Net from this shop. Good quality material and reasonable pricing." },
  { id: "g041", author: "Pyarelal Tripathi", rating: 5, when: "June 2026", tags: ["concrete-cover-block"], text: "Wire & cover block at good and attractive rates" },
  { id: "g042", author: "nakul bhaskar", rating: 5, when: "June 2026", tags: ["wiremesh", "gi-wiremesh", "ms-wiremesh", "ss-fine-mesh", "pigeon-nets", "pigeon-spikes", "safety-nets-equipments"], text: "Best shop in market...\nSs mesh & pigeon net best rate" },
  { id: "g045", author: "Nirmal Lodha", rating: 5, when: "June 2026", tags: [], text: "Good to see the quality and price of the material must visit" },
  { id: "g046", author: "Rajesh Kushwah", rating: 5, when: "June 2026", tags: [], text: "Good shop. Everything is available at reasonable prices." },
  { id: "g047", author: "SMOKY OP", rating: 5, when: "May 2026", tags: [], text: "Experience ofPurchasing goods from this shop is really good" },
  { id: "g050", author: "Subodh Holkar", rating: 5, when: "May 2026", tags: ["wiremesh", "gi-wiremesh", "ms-wiremesh", "ss-fine-mesh"], text: "Mr shoeb is a very polite and helpful person. I would like to meet him again. I bought a good quality steel mesh from him." },
  { id: "g051", author: "Rehan khan", rating: 5, when: "May 2026", tags: ["wiremesh", "gi-wiremesh", "ms-wiremesh"], text: "I got what I was looking for. It took me half an hour in the market but no shop has the variety which this shop has. All types of wiremesh (jaali) is available with them.\nGreat shop and good behaviour with reasonable price.\n5 / 5 stars" },
  { id: "g052", author: "Pranay Kawadkar", rating: 5, when: "May 2026", tags: [], text: "Best shop with the awesome staff to understand the need of customer with awesome quality item" },
  { id: "g054", author: "sohan singh kang", rating: 5, when: "May 2026", tags: [], text: "As a teacher , my experience here was nice. God bless them 🙏" },
  { id: "g057", author: "Jagdishraj Andsans", rating: 5, when: "May 2026", tags: [], text: "Perfect wireless in ss I purchased.\nBest rate from market" },
  { id: "g063", author: "Atul Nirmal", rating: 5, when: "May 2026", tags: ["wiremesh", "gi-wiremesh", "ms-wiremesh"], text: "It's the best shop I purchase a jaali like a mustang car he give me a best rate and beast quality product" },
  { id: "g064", author: "Abhay Patil", rating: 5, when: "May 2026", tags: ["gi-wire"], text: "Ms wire & give wire at best price in the whole market. Good quality and good behavior.\nMr. Shoeb is a nice guy & handles everything smoothly" },
  { id: "g067", author: "Nischal Gujrati", rating: 5, when: "April 2026", tags: [], text: "Resnebal Rate and quality of material is very good" },
  { id: "g068", author: "Palash Gupta", rating: 5, when: "April 2026", tags: [], text: "Good Service prompt response competitive rates" },
  { id: "g070", author: "Ashok patel Kushwaha", rating: 5, when: "April 2026", tags: ["construction-tools", "sr-crowbar", "sr-pickaxe-geti", "sr-hoe-faurdha", "santing-shikanja"], text: "Sabbal Hatoda\nCrowbar and hammer wholesale rates.\nVery nice shop" },
  { id: "g071", author: "Ankush Bhandari", rating: 5, when: "April 2026", tags: ["wiremesh", "gi-wiremesh", "ms-wiremesh", "fibermesh", "fiber-mesh", "chicken-mesh", "chicken-net"], text: "Murga jali pvc..\nWaterproof meshes\nIron and Hardware products giod stuff.\nFair price.\nExcellent behavior of shop owner." },
  { id: "g073", author: "vinod kumar Adwani", rating: 5, when: "April 2026", tags: [], text: "Wholesale and retail shop of all type of iron and hardware items.\nExcellent behaviour of owner.\nBest trained staff." },
  { id: "g076", author: "ashutosh sharma", rating: 5, when: "April 2026", tags: [], text: "Wide variety of product range available with affordable price and quality service by the owner and the staff" },
  { id: "g080", author: "METAWELD ENGINEERING", rating: 5, when: "April 2026", tags: ["welded-mesh", "gi-weldmesh", "ms-weldmesh", "pvc-coated-weldmesh", "wiremesh", "gi-wiremesh", "ms-wiremesh"], text: "Purchased wiremesh jali ,/ weldmesh jali for my factory & machine. Great price with best quality from the market.\nNice shop with huge variety" },
  { id: "g081", author: "Rakesh Silaley", rating: 5, when: "April 2026", tags: [], text: "Excellent service\nNo words to describe the variety of shops\nBest shop in Indore, Siyaganj\nPolite behavior if owned" },
  { id: "g082", author: "SailendRa Choyal", rating: 5, when: "April 2026", tags: ["ms-wire-rope", "ss-wire-rope", "gi-wire-rope", "wire-rope-clamp", "chicken-mesh", "chicken-net", "pigeon-nets", "pigeon-spikes", "safety-nets-equipments"], text: "Very nice shop, iron and hardware construction products.\nStaining tape, sponge and foam,\nWire rope, wire rope clamp, chicken fire, pigeon fire.\nReal rates in entire Indore.\nWholesale rates.\nVery good behavior of the owner.\nStaff well trained." },
  { id: "g083", author: "hemant gurjar", rating: 5, when: "April 2026", tags: ["gi-wire", "jhatka-machine-fencing-wire", "construction-tools", "sr-crowbar", "sr-pickaxe-geti", "sr-hoe-faurdha", "santing-shikanja"], text: "Hammer gi wire...wide range\nTata Bansal wire best rate.\nFrom bat\nOnion net\nJhatka machine wire reasonable price.\nSuperb behavior of the owner." },
  { id: "g084", author: "pappu prince malviya", rating: 5, when: "April 2026", tags: ["wiremesh", "gi-wiremesh", "ms-wiremesh", "plastic-hexa", "plastic-hexagonal-poultry-mesh", "pigeon-nets", "pigeon-spikes", "safety-nets-equipments"], text: "Hexa pvc fencing jali best rate in indore\nKabutar protection.\nWiremeshes and iron products" },
  { id: "g087", author: "Shubham Silwadiya", rating: 5, when: "April 2026", tags: ["ms-angles", "ms-flats", "ms-channels", "ms-i-beams-joists", "ms-holepass", "wiremesh", "gi-wiremesh", "ms-wiremesh", "perforated-sheets", "gi-perforated-sheet", "ms-perforated-sheet", "binding-wire", "construction-tools", "sr-crowbar", "sr-pickaxe-geti", "sr-hoe-faurdha", "santing-shikanja", "fibermesh", "fiber-mesh", "plastic-hexa", "plastic-hexagonal-poultry-mesh", "nails", "fasteners-nails", "roofing-nail"], text: "Perforated sheet\nWaterproofing mesh\nCrowbars\nSr tata\nFlates channel angel..\nHolepass\nHexagon wiremesh\nBinding wire\nBombay kherl all available at good rate in siyaganj at this shop.\nExcellent behaviour of staff as eee owner is pure gentleman.\nRecommend to purchase from here." },
  { id: "g093", author: "Shivpal Bhaskar", rating: 5, when: "April 2026", tags: [], text: "Tent materials are available at very good prices and of excellent quality. This is a great shop." },
  { id: "g097", author: "Sonu Nayak", rating: 5, when: "April 2026", tags: ["wiremesh", "gi-wiremesh", "ms-wiremesh"], text: "Great service with a lot of varities of wiremesh.\nGood shop" },
  { id: "g098", author: "Mahendra mourya", rating: 5, when: "April 2026", tags: ["wiremesh", "gi-wiremesh", "ms-wiremesh"], text: "Purchased wiremesh for my factory in pithampur.\nBest price from market & great service" },
  { id: "g099", author: "Jayant Kochar", rating: 5, when: "April 2026", tags: ["ms-wire-rope", "ss-wire-rope", "gi-wire-rope", "wire-rope-clamp"], text: "Good customer service. The owner attended properly & understood the problem" },
  { id: "g102", author: "Raufe khan", rating: 5, when: "April 2026", tags: ["wiremesh", "gi-wiremesh", "ms-wiremesh", "ms-wire-rope", "ss-wire-rope", "gi-wire-rope", "wire-rope-clamp", "construction-tools", "sr-crowbar", "sr-pickaxe-geti", "sr-hoe-faurdha", "santing-shikanja", "frp-bars"], text: "Wire rope\nWirerope cilam\nPlant mesh\nBest rates.\nVery good behavior at the shop.\nBest shop in Siyaganj.\nFRP bars, shock absorber wire. Fair price.\nFencing solutions in one shop.\nFast-fixing angels are also available.\nCrowbars for tents.\nSabal" },
  { id: "g103", author: "amjad patel", rating: 5, when: "April 2026", tags: ["wiremesh", "gi-wiremesh", "ms-wiremesh", "ss-fine-mesh", "fibermesh", "fiber-mesh"], text: "Wiremesj gi\nWaterproof mesh\nSs meshes\nPerfect rate.\nExcellent behaviour of shop staff as well as owner" },
  { id: "g107", author: "pramod garg", rating: 5, when: "April 2026", tags: ["ms-angles", "ms-flats", "ms-channels", "ms-i-beams-joists"], text: "Wireless Ltd.\nExcellent shop\nAll the water is available.\nAlso found Angel Channel.\nPVC water at a good rate." },
  { id: "g108", author: "Siddharth Mukati", rating: 5, when: "April 2026", tags: ["wiremesh", "gi-wiremesh", "ms-wiremesh"], text: "You can get all types of jaali\nMust visit shop in siyaganj" },
  { id: "g109", author: "Shahjad Luhar", rating: 5, when: "April 2026", tags: ["ms-angles", "ms-flats", "ms-channels", "ms-i-beams-joists", "wiremesh", "gi-wiremesh", "ms-wiremesh", "perforated-sheets", "gi-perforated-sheet", "ms-perforated-sheet", "fibermesh", "fiber-mesh"], text: "Bars angel wholesale rate.\nJaali perforated sheet wholesale rates.waterprrofing jali.\nMeshes of waterproof all sizes and gsm at reasonable rates." },
  { id: "g110", author: "Anurag Barwal", rating: 5, when: "April 2026", tags: ["ms-angles", "ms-flats", "ms-channels", "ms-i-beams-joists", "barbed-wire", "concertina-wire", "wiremesh", "gi-wiremesh", "ms-wiremesh", "pigeon-nets", "pigeon-spikes", "safety-nets-equipments"], text: "Concertina wire\nBarbed wire\nAngel\nSiyaganj best shop and rate.\nVery best rate.\nBird spikes and kabutar jali also good rate" },
  { id: "g111", author: "Ajay Sen", rating: 5, when: "April 2026", tags: ["ms-angles", "ms-flats", "ms-channels", "ms-i-beams-joists", "ms-holepass", "wiremesh", "gi-wiremesh", "ms-wiremesh"], text: "Wiremesh best rate .\nHolepass, biranji, wire, channel, angels ,flate bars all available under one roof.\nFair price of materials." },
  { id: "g112", author: "Pavanesh Muruga", rating: 5, when: "April 2026", tags: ["ms-angles", "ms-flats", "ms-channels", "ms-i-beams-joists", "wiremesh", "gi-wiremesh", "ms-wiremesh", "ss-fine-mesh", "fibermesh", "fiber-mesh"], text: "Excellent shop in whole siyaganjof iron and hardware related.\nFlate, channel , angel all at one shop.\nWiremesh ,fine meshes, pvc, waterproof available at best price." },
  { id: "g113", author: "KOMMU RAJU", rating: 5, when: "April 2026", tags: ["ms-angles", "ms-flats", "ms-channels", "ms-i-beams-joists", "wiremesh", "gi-wiremesh", "ms-wiremesh", "ss-fine-mesh", "chicken-mesh", "chicken-net", "plastic-hexa", "plastic-hexagonal-poultry-mesh"], text: "Best shop of iron and hardware items\nAngel flate channel\nCooler mesh , witemesh ,ss meshed, PVC hexa meshed.\nBest price shop" },
  { id: "g114", author: "Omfoo Ooo", rating: 5, when: "April 2026", tags: ["ms-angles", "ms-flats", "ms-channels", "ms-i-beams-joists", "wiremesh", "gi-wiremesh", "ms-wiremesh", "ss-fine-mesh", "plastic-hexa", "plastic-hexagonal-poultry-mesh"], text: "Nice service best rates pvc hexa mesh and wire mesh, ss wire mesh angle" },
  { id: "g115", author: "Ashfaque Qurashi", rating: 5, when: "April 2026", tags: ["ms-angles", "ms-flats", "ms-channels", "ms-i-beams-joists", "wiremesh", "gi-wiremesh", "ms-wiremesh", "pigeon-nets", "pigeon-spikes", "safety-nets-equipments"], text: "Jali\nAngel\nChannel\nFlate\nPigeon net\nSpikes\nBest rate" },
  { id: "g116", author: "Aadil Shaikh", rating: 5, when: "April 2026", tags: ["ms-angles", "ms-flats", "ms-channels", "ms-i-beams-joists", "perforated-sheets", "gi-perforated-sheet", "ms-perforated-sheet"], text: "Perforated sheet\nFlate\nAngel\nChannel\nSahi rate" },
  { id: "g117", author: "ashsh agrawal", rating: 5, when: "April 2026", tags: ["wiremesh", "gi-wiremesh", "ms-wiremesh"], text: "Distoner jali at really good price. They have a huge range of wire mesh products available with them. Must visit for all industrial and domestic wire mesh needs." },
  { id: "g120", author: "Satish Chauhan", rating: 5, when: "April 2026", tags: ["perforated-sheets", "gi-perforated-sheet", "ms-perforated-sheet"], text: "Perforated sheet.\nFor all types of sheets.\nFor thresher machines." },
  { id: "g121", author: "Jitendra Meena", rating: 5, when: "April 2026", tags: ["ms-angles", "ms-flats", "ms-channels", "ms-i-beams-joists"], text: "Angel and Angel poles readily available.\nTara at best rates.\nTata cum border all available." },
  { id: "g125", author: "Jvh Printers", rating: 5, when: "March 2026", tags: ["ms-holepass", "binding-wire", "nails", "fasteners-nails", "roofing-nail"], text: "Binding wire\nBiranji\nAll wire nails\nHolepass\nBest rate siyaganj" },
  { id: "g126", author: "Chouhan Ji", rating: 5, when: "March 2026", tags: ["gi-wire", "jhatka-machine-fencing-wire"], text: "Wire.\nGi wire.\nSS wire.\nJhatka machine wire.\nAll best price." },
  { id: "g127", author: "Sanju Panchal", rating: 5, when: "March 2026", tags: ["ms-angles", "ms-flats", "ms-channels", "ms-i-beams-joists", "barbed-wire", "perforated-sheets", "gi-perforated-sheet", "ms-perforated-sheet"], text: "Perforated sheet best rates.\nBarbed wire best.\nAngel all sizes available." },
  { id: "g128", author: "Fardin Khan", rating: 5, when: "March 2026", tags: [], text: "Nice shope all type of hardware & good customer service" },
  { id: "g130", author: "Ashok sharde", rating: 5, when: "March 2026", tags: ["wiremesh", "gi-wiremesh", "ms-wiremesh", "perforated-sheets", "gi-perforated-sheet", "ms-perforated-sheet"], text: "Ms jali, perforated, ss perforated\nSahi rate.\nExcellent shop" },
  { id: "g132", author: "Babita Verma", rating: 5, when: "March 2026", tags: ["wiremesh", "gi-wiremesh", "ms-wiremesh", "jhatka-machine-fencing-wire", "frp-bars"], text: "PVC jali reasonable rate.\nRBT FRP jhatka wire reasonable rate." },
  { id: "g133", author: "Sudhanshu shukla", rating: 5, when: "March 2026", tags: ["wiremesh", "gi-wiremesh", "ms-wiremesh"], text: "Jalli at the best price.\nAll kinds of iron and Jalli." },
  { id: "g140", author: "Mahendra singh Panwar", rating: 5, when: "March 2026", tags: ["binding-wire", "nails", "fasteners-nails", "roofing-nail"], text: "I appreciated the shop. I've been buying black wire, nails, and hole punches for the past five years. I've never had any issues with the price. It's a very good shop." },
  { id: "g141", author: "Dinesh Mathe", rating: 5, when: "March 2026", tags: [], text: "It's a very large shop. They have all kinds of iron and steel. All prices are wholesale. The staff is very skilled and knowledgeable. All iron items are available at their shop." },
  { id: "g142", author: "Mahesh Makwana", rating: 5, when: "March 2026", tags: [], text: "I bought the fish, it is a very big shop, wholesale rate is all" },
  { id: "g143", author: "jpnshukla123 madhumadhu", rating: 5, when: "March 2026", tags: [], text: "Took a shovel. Wholesale bhao. Very good shop" },
  { id: "g146", author: "Mukesh Parmar", rating: 4, when: "March 2026", tags: ["chain-link-fencing", "wiremesh", "gi-wiremesh", "ms-wiremesh"], text: "Chainlink jaali mesh rate sahi.\nTata also available best rate" },
  { id: "g147", author: "santosh sawle", rating: 5, when: "March 2026", tags: ["nails", "fasteners-nails", "roofing-nail"], text: "Bombay kheel, tape, wire very good price. Wide variety of iron and hardware range.\nPerfect shop with owner gentleman." },
  { id: "g148", author: "Hemraj Yadav", rating: 5, when: "March 2026", tags: ["ms-wire-rope", "ss-wire-rope", "gi-wire-rope", "wire-rope-clamp"], text: "Tochan wire..turnbuckle best price. Wirerope lot of variety ss wirerope too" },
  { id: "g150", author: "Manish Sharma", rating: 5, when: "March 2026", tags: [], text: "Everything this is fine best rate and good shop" },
  { id: "g157", author: "Sanendra Tripathi", rating: 5, when: "March 2026", tags: ["gi-wire"], text: "Gi wire and tata wiron good price.\nExcellent behaviour of owner." },
];

function score(r: TaggedReview): number {
  // Prefer five stars and a readable length (about 120 to 320 characters).
  const len = r.text.length;
  const lenScore = len >= 120 && len <= 320 ? 2 : len < 120 ? 0.5 : 1;
  return (r.rating === 5 ? 2 : 0) + lenScore + r.tags.length * 0.05;
}

const general = [...taggedReviews].sort((a, b) => score(b) - score(a));

/**
 * Reviews for a product page: reviews that name this product first,
 * then ones that name anything in the same category, then the shop's best overall.
 */
export function getReviewsForProduct(productSlug: string, limit = 3): TaggedReview[] {
  const product = getProductBySlug(productSlug);
  const picked: TaggedReview[] = [];
  const seen = new Set<string>();
  const add = (list: TaggedReview[]) => {
    for (const r of list) {
      if (picked.length >= limit) return;
      if (!seen.has(r.id)) {
        seen.add(r.id);
        picked.push(r);
      }
    }
  };
  add(taggedReviews.filter((r) => r.tags.includes(productSlug)).sort((a, b) => score(b) - score(a)));
  if (product && picked.length < limit) {
    add(
      taggedReviews
        .filter((r) => r.tags.some((t) => getProductBySlug(t)?.categorySlug === product.categorySlug))
        .sort((a, b) => score(b) - score(a))
    );
  }
  add(general);
  return picked;
}

/** Reviews for a category page. */
export function getReviewsForCategory(categorySlug: string, limit = 3): TaggedReview[] {
  const list = taggedReviews
    .filter((r) => r.tags.some((t) => getProductBySlug(t)?.categorySlug === categorySlug))
    .sort((a, b) => score(b) - score(a))
    .slice(0, limit);
  return list.length >= limit ? list : [...list, ...general.filter((g) => !list.includes(g))].slice(0, limit);
}

/** Homepage and general pages: the strongest reviews across the whole range. */
export function getTopReviews(limit = 3): TaggedReview[] {
  return general.slice(0, limit);
}
