/**
 * Product-page copy for the products without a hand-written entry in productSeoContent.ts.
 * Shop-counter voice. Facts come from content/products.ts or from standard practice (formulae, IS codes).
 * No prices: every pricing paragraph names what moves the rate and tells the reader to ask.
 * Compact tuple: [overview, uses, buying, pricing, faqs, blogSlugs, relatedProductSlugs?]
 */
export type FaqPair = [question: string, answer: string];
export type ProductCopy = {
  overview: string;
  usesInIndore: string;
  buyingGuide: string;
  pricingFactors: string;
  faqs: FaqPair[];
  blogs: string[];
  related?: string[];
};

const c = (
  overview: string,
  usesInIndore: string,
  buyingGuide: string,
  pricingFactors: string,
  faqs: FaqPair[],
  blogs: string[] = [],
  related?: string[]
): ProductCopy => ({ overview, usesInIndore, buyingGuide, pricingFactors, faqs, blogs, related });

export const productCopy: Record<string, ProductCopy> = {
  // ---------------------------------------------------------------- Structural
  "bright-bars": c(
    "Bright bars are round, flat or square bars that have been cold drawn, so the surface is smooth and the diameter is held to a tighter tolerance than a hot-rolled bar. We stock round bright bars from 8 mm to 40 mm for machining and shaft work.",
    "Machine shops and workshops use bright bar for shafts, pins, spindles and bushes. Fabricators use it where a clean, true surface matters, such as rails, handles and display frames.",
    "Say the diameter and the job. If the bar will be turned on a lathe, tell us so we can give you a bar that machines cleanly. For plain fabrication a hot-rolled MS round bar is cheaper and does the same work. Weight per metre of a round bar is d x d / 162 kg, with d in mm.",
    "The rate depends on the diameter, the shape (round, flat, square), the grade and the quantity, and it follows the steel market. Ask for the rate with the size and the weight you need.",
    [
      ["What is the difference between a bright bar and an MS round bar?", "A bright bar is cold drawn. It has a smoother surface and a tighter size tolerance. An MS round bar is hot rolled and has a darker, rougher surface."],
      ["Which sizes of bright bar do you keep?", "Round bright bars from 8 mm to 40 mm: 8, 10, 12, 16, 20, 25, 32 and 40 mm. Flat and square bright bars can be asked for."],
    ],
    ["common-mistakes-buying-steel-sections"],
    ["ms-round-bars", "ms-flats", "ms-angles"]
  ),
  "ms-round-bars": c(
    "MS round bars, also called rods, are plain mild steel bars sold in 6 m and 12 m lengths. We stock diameters from 6 mm to 50 mm, in black finish and, on request, bright.",
    "Fabricators use round bar for gates, grills, railings, anchors and hooks. Workshops cut it for pins, rollers and fasteners. It is not a reinforcement bar: for RCC use ribbed TMT bars instead.",
    "Weight per metre is d x d / 162 kg. A 12 mm bar is about 0.89 kg per metre, so a 12 m length is about 10.7 kg. Use that to check what is delivered. If your drawing says reinforcement, you want TMT, not plain round.",
    "Rates move with the diameter, the length, the quantity and the day's steel market. Bulk and repeat orders get a better per-kg rate. Ask us with the diameters and the total weight.",
    [
      ["Can I use MS round bar instead of TMT bar in a slab?", "No. TMT bars have ribs that grip the concrete and a tested yield strength. Plain round bar is for fabrication, not reinforcement."],
      ["How do I work out the weight of a round bar?", "Weight in kg per metre is the diameter in mm squared, divided by 162. A 16 mm bar is about 1.58 kg per metre."],
    ],
    ["tmt-bar-weight-chart-size-guide-indore", "common-mistakes-buying-steel-sections"],
    ["tmt-bars", "bright-bars", "ms-flats"]
  ),
  "ms-channels": c(
    "MS channels are C-shaped structural sections used where a beam or a purlin is needed without the cost of an I-beam. We stock sizes from 75 mm to 300 mm in 6 m and 12 m lengths, to IS 2062 mild steel.",
    "Channels carry roof purlins in sheds, frame gates and staircases, support machinery bases and form the legs of trolleys and racks. Two channels welded back to back make a stiff column or beam.",
    "Pick the size from the span and the load in your drawing. If you do not have a drawing, ask your fabricator or engineer, not the counter. Look for straight sections with even flanges, and ask for the length that wastes the least in cutting.",
    "The rate depends on the section size, the length and the quantity, and it follows steel prices. Sections are sold by weight, so the heavier the section the more it costs per metre. Ask with the size and the running metres.",
    [
      ["What sizes of MS channel do you stock?", "75, 100, 125, 150, 200, 250 and 300 mm, in 6 m and 12 m lengths. Ask us what is in stock today."],
      ["Do you cut channels to length?", "We mostly sell standard lengths. Cut-to-length may be possible for some sizes. Ask when you request the rate."],
    ],
    ["common-mistakes-buying-steel-sections", "how-bulk-buyers-save-cost-loha-mandi-indore"],
    ["ms-angles", "ms-i-beams-joists", "ms-flats"]
  ),
  "ms-i-beams-joists": c(
    "I-beams and joists are the heavy sections for beams and columns in sheds, mezzanine floors and platforms. We stock ISMB and ISJB sections from 75 mm to 300 mm in 6 m and 12 m lengths, in IS 2062 mild steel.",
    "Industrial sheds, mezzanine floors, crane gantries, bridge girders on small spans and equipment platforms all use I-sections. Joists are the lighter sections used for floors and roof framing.",
    "The section and the length come from the structural drawing. Do not swap a section at the counter to save money. Tell us the section, the length and the number of pieces, and bring the cutting list if the lengths are odd.",
    "I-sections are priced by weight. The rate depends on the section, the length, the quantity and the steel market that week. Ask for the rate with the section and the tonnage.",
    [
      ["What is the difference between ISMB and ISJB?", "ISMB is the medium weight beam. ISJB is the lighter joist section. Your drawing names the one it needs."],
      ["Can you deliver long beams to a site outside Indore?", "Delivery can be arranged depending on length, weight and distance. Give us the site location when you ask for the rate."],
    ],
    ["common-mistakes-buying-steel-sections", "siyaganj-market-guide-buying-iron-hardware-indore"],
    ["ms-channels", "ms-angles", "tmt-bars"]
  ),
  "ms-pipes": c(
    "MS pipes are black mild steel pipes, round and plain, for structure and conduit. We stock sizes from 15 mm to 300 mm nominal bore, black or galvanised, in the schedule or class you ask for.",
    "Handrails, gate frames, scaffolding, shed trusses and water or air lines in plants all use MS pipe. Black pipe is painted after fabrication. Galvanised pipe is chosen where it stays outdoors.",
    "Ask for the nominal bore, the wall thickness or class, and whether it is black or galvanised. A pipe used as a structural member is chosen by wall thickness, not just diameter. For potable water see our GI pipes.",
    "The rate depends on the bore, the wall thickness, the length, black or galvanised, and the steel market. Pipes are sold by weight or by length. Ask us with bore, class and metres.",
    [
      ["Is MS pipe the same as GI pipe?", "No. MS pipe is plain mild steel. GI pipe is the same steel with a zinc coating, so it rusts slowly outdoors. We stock both."],
      ["What size MS pipes do you keep?", "From 15 mm up to 300 mm nominal bore. Common sizes are 25, 40, 50 and 80 mm. Ask us for current stock."],
    ],
    ["common-mistakes-buying-steel-sections", "how-to-estimate-material-quantity-fencing"],
    ["gi-pipes", "ms-angles", "ms-channels"]
  ),
  "ms-holepass": c(
    "Holepass is a galvanised MS L-bracket with a large central hole and smaller fixing holes. It holds a pipe or cable at a wall or a frame and lets it pass through.",
    "Plumbers and electricians use it to support pipe runs and cable trays. Fabricators use it as a cheap angle bracket for light frames and fencing.",
    "Tell us the pipe or cable diameter it must carry and the quantity. It is sold in bulk, so a sample brought to the counter settles the size fastest.",
    "The rate depends on the size, the thickness, the finish and the number of pieces. Ask with a sample or a drawing.",
    [
      ["What is holepass used for?", "It is an L-bracket with a hole for a pipe or cable to pass through, used for supports and mounting."],
      ["Is holepass galvanised?", "Yes, it is supplied galvanised, which helps it last outdoors."],
    ],
    [],
    ["ms-angles", "gi-pipes", "ms-flats"]
  ),
  "frp-bars": c(
    "FRP bars are glass-fibre reinforced polymer rods. They do not rust and they weigh a fraction of steel. We stock them as 4 ft (530 g), 5 ft (660 g) and 6 ft (790 g) pieces, and in diameters from 6 mm to 20 mm.",
    "Farmers and builders use FRP bars as fence posts and tie rods, where steel would rust. They also go into marine and chemical-plant work where corrosion is the problem.",
    "FRP is not a drop-in swap for steel in a beam or a slab. It cannot be bent on site, and its strength and stiffness are different. Use it as per an engineer's design. For fence posts, pick the length to suit the height above ground plus the depth you set.",
    "The rate depends on the diameter, the length and the number of pieces. Ask with the length you need and how many.",
    [
      ["Can FRP bars replace TMT bars in a house?", "Only where an engineer has designed for it. FRP behaves differently from steel and cannot be bent on site. For ordinary RCC, use TMT bars."],
      ["How long are FRP bars?", "We stock 4 ft, 5 ft and 6 ft pieces, weighing 530 g, 660 g and 790 g."],
      ["Does FRP rust?", "No. The glass fibre and resin do not corrode, which is the reason to choose it."],
    ],
    ["frp-bars-vs-tmt-bars-where-each-belongs", "farm-fencing-madhya-pradesh-posts-wire-angle-plan"],
    ["tmt-bars", "barbed-wire", "ms-angles"]
  ),
  "fiber-mesh": c(
    "Fibermesh is a self-adhesive or plain glass-fibre mesh tape that is pressed into plaster. It holds the surface across joints and stops hairline cracks. We stock widths of 4 inch, 6 inch, 8 inch and 1 metre.",
    "Plasterers lay it over the joint where brick meets concrete, over conduit chases and across wall corners before the coat goes on. The 1 m width covers whole patches and ceilings.",
    "Pick the width by the joint: 4 to 8 inch for joints and chases, 1 m for larger patches. Press it into the first coat and cover it fully. A mesh left proud of the plaster will show through.",
    "The rate depends on the width, the roll length and the number of rolls. Ask us with width and metres.",
    [
      ["Where should fibermesh go in plaster?", "Across the joint between brick and concrete, over chased conduit lines and at corners, bedded into the first coat of plaster."],
      ["Is it the same as chicken mesh?", "No. Fibermesh is a light glass-fibre mesh for plaster. Chicken mesh is a galvanised wire net."],
    ],
    ["fibre-mesh-plaster-cracks-guide"],
    ["expanded-metal-mesh", "gi-wiremesh", "binding-wire"]
  ),

  // ---------------------------------------------------------------- Wiremesh
  "ms-wiremesh": c(
    "MS wiremesh is woven or welded mild steel wire in a square grid. It is the cheapest mesh we sell and it is meant for indoor or painted use. Openings run from 15 mm to 150 mm.",
    "Fabricators use it for guards, partitions, trays and cages inside buildings. It is also used for screening and as a base for plaster work indoors.",
    "Specify the opening, the wire thickness and the roll or panel size. If the mesh will see rain or damp, choose GI or PVC-coated mesh instead of MS, or paint it after fixing.",
    "The rate depends on the opening, the wire gauge, the roll size and the quantity. A smaller opening and a thicker wire mean more steel and a higher rate. Ask us with the grid and the area.",
    [
      ["Will MS wiremesh rust?", "Yes, if it stays wet. Use it indoors or paint it. For outdoor use choose GI or PVC-coated mesh."],
      ["What openings do you keep?", "15 x 15 mm, 50 x 50 mm, 75 x 75 mm, 100 x 100 mm and 150 x 150 mm, as per stock."],
    ],
    ["wire-mesh-supplier-indore-types-uses-prices", "welded-wire-mesh-vs-chain-link"],
    ["gi-wiremesh", "ms-weldmesh", "crimp-wiremesh"]
  ),
  "gi-wiremesh": c(
    "GI wiremesh is steel wire mesh with a zinc coating, so it stands up to weather. We stock openings from 15 mm to 100 mm in rolls.",
    "It is used for compound screens, bird and animal cages, window guards, farm fencing and anywhere the mesh stays outdoors.",
    "Ask for the opening, the gauge and the roll width. GI mesh costs more than MS and lasts much longer outdoors. For a coated, softer finish on a fence, see PVC-coated weldmesh.",
    "The rate depends on the opening, the wire gauge, the zinc coating, the roll size and the quantity. Ask us with the grid and the area.",
    [
      ["What is the difference between GI and MS wiremesh?", "GI has a zinc coat and resists rust. MS is bare steel and should be used indoors or painted."],
      ["Can I use it for a poultry shed?", "Yes, GI wiremesh is common for cages and sheds. For hexagonal poultry net, see GI chicken mesh."],
    ],
    ["wire-mesh-supplier-indore-types-uses-prices", "mosquito-net-types-fibreglass-ss-aluminium-indore"],
    ["ms-wiremesh", "gi-weldmesh", "chicken-net"]
  ),
  "aluminium-wiremesh": c(
    "Aluminium wiremesh is a light, non-rusting mesh. It will not stain and it does not add weight. We keep it in several openings for screening and for food and chemical use.",
    "It is used for window and door screens, filters, ventilation covers and places where rust stains or galvanising are a problem.",
    "Tell us the opening and the wire gauge. Aluminium is softer than steel, so it is not for security or load. For a stronger screen choose SS fine mesh.",
    "Aluminium costs more than MS or GI. The rate depends on the opening, the wire gauge, the width and the quantity. Ask us with the details.",
    [
      ["Is aluminium mesh stronger than GI mesh?", "No. It is lighter and rust-free, but softer. For strength, use GI or SS."],
      ["Does it work as mosquito net?", "Yes, in a fine opening. See our mosquito net page for the options."],
    ],
    ["mosquito-net-types-fibreglass-ss-aluminium-indore"],
    ["mosquito-net", "ss-fine-mesh", "gi-wiremesh"]
  ),
  "crimp-wiremesh": c(
    "Crimp wiremesh is woven from wires that are pre-bent, so they lock at every crossing and the openings stay square. It is stiff, flat and dependable for screening.",
    "Quarries and plants use it for sieves and screens. It is also used as a partition and as a cover over vents and drains.",
    "Say the opening and the wire gauge. Thicker wire gives a stiffer screen that lasts longer under load, such as aggregate. The mesh is cut from rolls to the size you need.",
    "The rate depends on the opening, the wire gauge, MS or GI, and the quantity. Ask us with the opening and the area.",
    [
      ["What is the benefit of crimped wires?", "The pre-bent wires lock in place, so the openings do not shift when the mesh is loaded."],
      ["Do you supply it in MS and GI?", "Yes, both. Choose GI if it will stay outdoors."],
    ],
    ["wire-mesh-supplier-indore-types-uses-prices"],
    ["ms-wiremesh", "gi-wiremesh", "expanded-metal-mesh"]
  ),
  "expanded-metal-mesh": c(
    "Expanded metal mesh is cut and stretched from a single steel sheet, so it forms a diamond pattern with no welds. It is rigid and strong for its weight. We supply it in rolls and cut sheets, plain, painted or galvanised.",
    "It is used for gates, grills, machine guards, walkways, stair treads, fence panels and as a plaster base. Interior designers and artists also buy it for screens and lamps.",
    "Choose the strand thickness and the diamond size from the job: small diamond for a guard, large for a fence or a walkway. Ask for the sheet size or roll you need. Painted or galvanised stock is better outdoors.",
    "The rate depends on the sheet thickness, the diamond size, the finish and the size of the sheet. Ask us with the use and the size.",
    [
      ["What is expanded metal used for?", "Grills, gates, machine guards, walkways, fence panels and plaster base, among other uses."],
      ["How is it different from welded mesh?", "It is one piece, stretched from a sheet, so there are no welds that can snap. Welded mesh is wire joined at the crossings."],
    ],
    ["expanded-metal-mesh-uses-types-indore", "welded-wire-mesh-vs-chain-link"],
    ["gi-weldmesh", "ms-perforated-sheet", "crimp-wiremesh"]
  ),
  "mosquito-net": c(
    "Mosquito net is fine mesh that keeps insects out and lets air through. We sell it in rolls, and we cut it at the counter to your window size.",
    "It is fixed in window and door frames, vents and balconies. Choose the material by the place: fibreglass is cheap and easy to fit, aluminium is firmer, stainless steel lasts longest and resists cutting.",
    "Measure the frame in width and height, add a little for fixing, and tell us the material. For rooms near the sea or in kitchens, stainless steel holds up best. See the blog for the comparison.",
    "The rate depends on the material, the mesh count, the width and the length you buy. Ask us with the width and metres.",
    [
      ["Which mosquito net lasts longest?", "Stainless steel mesh lasts longest and resists rats and cuts. Fibreglass is the cheapest and easiest to fit."],
      ["Can you cut it to size?", "Yes. We cut mosquito net at the counter from the roll."],
    ],
    ["mosquito-net-types-fibreglass-ss-aluminium-indore"],
    ["ss-fine-mesh", "aluminium-wiremesh", "gi-wiremesh"]
  ),
  "ss-fine-mesh": c(
    "SS fine mesh is woven stainless steel wire in a small opening. It resists rust and heat, and it is used where a finer, tougher screen is needed than aluminium or GI.",
    "It is used for insect screens, filters, kitchens, laboratories, food and chemical plants, and for sieving fine material.",
    "Tell us the aperture in mesh count or mm, the wire diameter and the width. For ordinary windows fibreglass or aluminium is cheaper. Pay for stainless where corrosion, heat or rats are the problem.",
    "Stainless costs more than GI or MS. The rate depends on the grade of steel, the mesh count, the wire diameter and the width. Ask us with the mesh and the area.",
    [
      ["Is SS mesh good for mosquito screens?", "Yes. It does not rust, it is hard to cut, and it keeps its shape for years."],
      ["Which grade of stainless do you supply?", "Ask us at the time of the quote. Tell us if you need a particular grade."],
    ],
    ["mosquito-net-types-fibreglass-ss-aluminium-indore"],
    ["mosquito-net", "aluminium-wiremesh", "crimp-wiremesh"]
  ),
  "chicken-net": c(
    "GI chicken mesh is a hexagonal galvanised wire net that comes in rolls. It is the usual netting for poultry runs, cages and light garden fencing.",
    "It is used for hen houses, bird cages, small animal pens, plant guards and plaster work as a light base.",
    "Check the mesh size against the animal: small hexagon for chicks and small birds, larger for adult birds and general fencing. Galvanised net lasts longer than plastic. Tell us the roll width.",
    "The rate depends on the mesh size, the wire thickness, the width and the roll length. Ask us with the width and metres.",
    [
      ["Is galvanised chicken mesh better than plastic?", "It is stronger and lasts longer against animals. Plastic hexa mesh is lighter and cheaper, for lighter work."],
      ["Do you sell it by the metre?", "Yes, we can cut from the roll. Tell us the width and the length."],
    ],
    ["wire-mesh-supplier-indore-types-uses-prices"],
    ["plastic-hexagonal-poultry-mesh", "gi-wiremesh", "square-mesh"]
  ),
  "plastic-hexagonal-poultry-mesh": c(
    "Hexa mesh is a plastic hexagonal net. It is light, it does not rust and it is cheap, so it suits garden, poultry and light barrier work. It comes in green, white and other colours.",
    "It is used for garden fencing, plant supports, poultry runs, pet enclosures and as a temporary barrier on farms.",
    "Plastic net is for light duty. It will not stop a large animal or a determined thief. For a permanent fence choose GI chicken mesh or chain link. Tell us the height of the roll you need.",
    "The rate depends on the width, the mesh size and the length. Ask us with the width and metres.",
    [
      ["Will plastic hexa mesh last in the sun?", "Good UV-stabilised plastic lasts several seasons. Cheaper nets fade and go brittle sooner."],
      ["What colours are available?", "Green and white are common. Other colours as per stock."],
    ],
    [],
    ["chicken-net", "square-mesh", "pvc-coated-weldmesh"]
  ),
  "square-mesh": c(
    "Square mesh is plastic net with square holes, in different hole sizes and colours such as blue and green. It is light and does not rust.",
    "It is used for garden fencing, plant climbers, poultry, screening and light barriers.",
    "Say the hole size and the width. Plastic net is for light duty. For strength outdoors use GI wiremesh or PVC-coated weldmesh.",
    "The rate depends on the hole size, the width, the colour and the length. Ask us with the details.",
    [
      ["Where is plastic square mesh used?", "Gardens, plant climbers, poultry runs and light barriers."],
      ["Is it strong enough for a fence?", "Only for light duty. For a real boundary use chain link or welded mesh."],
    ],
    [],
    ["plastic-hexagonal-poultry-mesh", "chicken-net", "pvc-coated-weldmesh"]
  ),

  // ---------------------------------------------------------------- Welded mesh
  "gi-weldmesh": c(
    "GI weldmesh is welded wire mesh with a galvanised coat, so it stays rigid and resists rust. We stock grids from 15 x 15 mm to 150 x 150 mm, in rolls and panels. Many customers call it weldmesh jali.",
    "It is used for partitions, cages, machine guards, balcony and terrace screens, farm fencing and, in the right grid, as slab mesh. Factories buy it for guards and bins.",
    "Choose the grid and the wire thickness from the job. A 50 x 50 mm grid with thick wire is stiff enough for a guard. Wider grids suit fencing. For slab reinforcement, use the grid and wire that your engineer specifies, not a guess. See our guide on welded mesh and chain link.",
    "The rate depends on the grid, the wire thickness, the roll or panel size and the quantity. Heavier wire and tighter grids cost more. Ask us with the grid and the area.",
    [
      ["What grid sizes of GI weldmesh do you stock?", "15 x 15 mm, 50 x 50 mm, 75 x 75 mm, 100 x 100 mm and 150 x 150 mm, as per stock."],
      ["Is GI weldmesh better than MS weldmesh?", "For outdoor use, yes, because of the zinc coat. Indoors, MS is cheaper and does the same work."],
      ["Is weldmesh the same as jali?", "Customers often call weldmesh jali at the counter. It is welded wire mesh, in a square grid."],
    ],
    ["welded-wire-mesh-vs-chain-link", "wire-mesh-supplier-indore-types-uses-prices"],
    ["ms-weldmesh", "pvc-coated-weldmesh", "chain-link-fencing"]
  ),
  "ms-weldmesh": c(
    "MS weldmesh is welded mild steel wire mesh in a square grid. It is rigid and cheaper than GI. We stock grids from 15 x 15 mm to 150 x 150 mm in rolls and panels.",
    "It is used for slab and floor mesh where specified, partitions, cages, racks and machine guards. It is also welded into frames and then painted.",
    "Pick the grid and the wire from your drawing. For anything outdoors choose GI or PVC-coated mesh, or plan to paint it. Panels save cutting time on small jobs; rolls suit large areas.",
    "The rate depends on the grid, the wire thickness, the roll or panel size and the quantity. Ask us with the grid and the area.",
    [
      ["Can MS weldmesh go into a slab?", "Yes, where the structural drawing calls for it, in the grid and wire it specifies."],
      ["Will it rust?", "Bare MS rusts if it stays wet. Paint it or use GI for outdoors."],
    ],
    ["welded-wire-mesh-vs-chain-link", "wire-mesh-supplier-indore-types-uses-prices"],
    ["gi-weldmesh", "ms-wiremesh", "binding-wire"]
  ),
  "pvc-coated-weldmesh": c(
    "PVC-coated weldmesh is welded wire mesh with a plastic coat over the wire. It is green or another colour as per stock, and it is sold in rolls.",
    "It is used for garden and boundary fences, play areas, pet and poultry enclosures, and places where bare wire would scratch or rust fast.",
    "Ask for the grid, the wire gauge and the roll height. The coat keeps rust off for years and softens the look. It still needs strong posts and straining wire at the top and bottom.",
    "The rate depends on the grid, the wire gauge, the coat and the roll size. Coated mesh costs more than plain GI. Ask us with the grid and the length.",
    [
      ["How is PVC-coated mesh different from GI weldmesh?", "The wire carries a plastic coat over the metal, which resists rust and looks neater. It costs more."],
      ["Which colours do you have?", "Green is common. Others as per stock."],
    ],
    ["welded-wire-mesh-vs-chain-link", "how-to-estimate-material-quantity-fencing"],
    ["gi-weldmesh", "chain-link-fencing", "plastic-hexagonal-poultry-mesh"]
  ),

  // ---------------------------------------------------------------- Perforated sheets
  "gi-perforated-sheet": c(
    "GI perforated sheet is galvanised steel sheet punched with a regular pattern of holes. We supply thicknesses from 0.5 mm to 3 mm in round, square, slot and hexagonal patterns, cut to your size.",
    "It is used for ventilation panels, speaker and machine covers, screens and partitions, cladding, filters and air-handling parts. The zinc coat helps outdoors.",
    "Three choices matter: the thickness for strength, the hole size and pitch for flow, and the open area, which is the share of the sheet that is hole. Our guide on hole patterns explains how to work it out.",
    "The rate depends on the thickness, the hole pattern, the sheet size, the coat and the quantity. A fine pattern costs more to punch. Ask us with the pattern and the sheet size.",
    [
      ["What hole patterns do you have?", "Round, square, slot and hexagonal. Custom patterns can be asked for."],
      ["Do you cut the sheet to size?", "Yes. Send us the size and the pattern."],
    ],
    ["perforated-sheet-hole-patterns-open-area-guide", "perforated-sheets-ms-vs-ss-applications"],
    ["ms-perforated-sheet", "expanded-metal-mesh", "gi-weldmesh"]
  ),
  "ms-perforated-sheet": c(
    "MS perforated sheet is mild steel sheet punched in round, square or slot patterns, in thicknesses from 0.5 mm to 3 mm. It is the cheaper option and is meant for indoor use or for painting.",
    "It is used for screens, machine guards, partition panels, ventilation covers and filters inside plants and workshops.",
    "Choose the thickness, the hole size and the open area for the job. For anything outside, pick GI or paint the MS sheet after cutting. Say the sheet size and the quantity.",
    "The rate depends on the thickness, the hole pattern, the sheet size and the quantity. Ask us with the pattern and the sheet size.",
    [
      ["MS or GI perforated sheet: which should I choose?", "GI for outdoors or damp places. MS for indoors, or where you will paint it."],
      ["What thicknesses are available?", "0.5 mm to 3 mm."],
    ],
    ["perforated-sheets-ms-vs-ss-applications", "perforated-sheet-hole-patterns-open-area-guide"],
    ["gi-perforated-sheet", "expanded-metal-mesh", "ms-weldmesh"]
  ),

  // ---------------------------------------------------------------- Wires
  "gi-wire": c(
    "GI wire is steel wire with a zinc coating. We sell it in coils from 8 SWG to 18 SWG, including Tata Wiron GI wire. A bigger SWG number means a thinner wire.",
    "It is used for tying and binding outdoors, for tension and tie lines on fences, for hanging and for farm work. It lasts longer outdoors than black wire because the zinc protects the steel.",
    "Pick the gauge from the job: 12 to 14 SWG for tying fence and mesh, 8 to 10 SWG for tension lines and heavy tie-downs, 16 to 18 SWG for light tying. Use our gauge chart to convert SWG to mm. For rebar tying use annealed binding wire.",
    "The rate depends on the gauge, the zinc coat, the coil weight and the market. It is sold by weight. Ask us with the gauge and the kg.",
    [
      ["What is the difference between GI wire and binding wire?", "GI wire is galvanised and hard for outdoor use. Binding wire is black annealed wire, soft and easy to twist, for tying rebar."],
      ["Do you stock Tata Wiron GI wire?", "Yes, as an authorised Tata dealer. Ask for the gauge you need."],
      ["How many metres are in a kg of GI wire?", "It depends on the gauge. A 12 SWG wire is about 23 m per kg."],
    ],
    ["wire-gauge-chart-swg-bwg-mm-guide", "gi-wire-vs-ms-wire-binding-fencing", "best-practices-storing-steel-wire-warehouse"],
    ["binding-wire", "barbed-wire", "jhatka-machine-fencing-wire"]
  ),
  "binding-wire": c(
    "Binding wire is black annealed wire, soft enough to twist by hand, used to tie reinforcement bars. In the market it is called kala taar. We keep 16 and 18 SWG, in coils of up to 50 kg.",
    "Every RCC job uses it: tying bars in slabs, beams and columns, tying cover blocks and tying centering. It is also used for general tying in workshops.",
    "18 SWG is easier on the hands and fine for most ties; 16 SWG is stronger and used on heavier bars. Soft wire twists without breaking. A coil that feels stiff and springy is not binding wire. A common site budget is 8 to 10 kg per tonne of steel, but your bar schedule decides the real figure.",
    "The rate depends on the gauge, the coil weight and the market. It is sold by weight, and bulk coils are cheaper per kg. Ask us with the gauge and the kg.",
    [
      ["What gauge binding wire is used for rebar?", "16 to 18 SWG annealed wire, with 18 SWG the most common for hand tying."],
      ["How much binding wire do I need?", "Sites commonly budget 8 to 10 kg per tonne of steel. Use your bar bending schedule for the real number."],
      ["What is kala taar?", "It is the market name for black annealed binding wire."],
    ],
    ["wire-gauge-chart-swg-bwg-mm-guide", "tmt-bar-weight-chart-size-guide-indore", "concrete-cover-blocks-why-cover-matters-slab-beam-column"],
    ["gi-wire", "tmt-bars", "concrete-cover-block"]
  ),
  "jhatka-machine-fencing-wire": c(
    "Jhatka wire is high-tensile fencing wire used in jhatka (shock) machines and for farm boundaries. It comes in coils and is hard and springy, not meant for tying.",
    "Farmers use it to run fence lines on posts and to carry the electric charge on jhatka fencing against animals. It also works as a tension line on a boundary.",
    "Tell us the gauge, the length of the fence and the coil weight. Do not use soft binding wire for a tension line; it will stretch. For a plain physical fence, barbed wire may do the job.",
    "The rate depends on the gauge, the coil weight and the market. Ask us with the gauge and the weight.",
    [
      ["What is jhatka wire used for?", "Boundary and agricultural fencing, and electrified jhatka machine lines against animals."],
      ["What gauge is common?", "12 to 14 SWG high-tensile wire is common for tension lines. Tell us the job and we will suggest one."],
    ],
    ["farm-fencing-madhya-pradesh-posts-wire-angle-plan", "wire-gauge-chart-swg-bwg-mm-guide"],
    ["barbed-wire", "gi-wire", "ms-angles"]
  ),
  "clutch-wire": c(
    "Clutch wire is thin steel wire for clutch and control cables on vehicles and machinery. It comes in spools and coils, galvanised or coated as per stock.",
    "Mechanics and cable makers use it for clutch and brake cables, control linkages and light mechanical pull lines.",
    "Tell us the gauge, the length and the spool size. If you are replacing a cable, bring a short piece so we match the diameter. It is not wire rope for lifting.",
    "The rate depends on the gauge, the finish and the weight. Ask us with the gauge and the quantity.",
    [
      ["Can clutch wire be used for lifting?", "No. Use wire rope with a known working load for lifting."],
      ["Can I bring a sample?", "Yes, a short piece lets us match the diameter at the counter."],
    ],
    [],
    ["ms-wire-rope", "gi-wire", "binding-wire"]
  ),
  "ms-wire-rope": c(
    "MS wire rope is steel wire rope in plain mild steel, sold by the metre or the coil from 2 mm to 20 mm and above. It is the cheapest rope and is for dry or protected use.",
    "It is used for hoists, pulling and towing, rigging, ties and guy lines, and in workshops and sites on the ground.",
    "Ask for the diameter and the length. Ropes are described by diameter and by construction, such as 6 x 19, which says how many strands and wires it holds. A rope for lifting needs a rated safe working load from the maker. Do not guess it.",
    "The rate depends on the diameter, the construction and the length, and it is by metre or by kg. Ask us with the diameter and the metres.",
    [
      ["What is the difference between MS, GI and SS wire rope?", "MS is plain steel. GI has a zinc coat for outdoor use. SS is stainless and is chosen for marine or corrosive places."],
      ["Do you sell wire rope clamps?", "Yes. See our wire rope clamps for forming eyes."],
    ],
    ["wire-gauge-chart-swg-bwg-mm-guide"],
    ["gi-wire-rope", "ss-wire-rope", "wire-rope-clamp"]
  ),
  "ss-wire-rope": c(
    "SS wire rope is stainless steel rope that does not rust. It is used where moisture, chemicals or a clean look matter. We supply it by the metre or by the coil, from 2 mm to 20 mm and above.",
    "It is used in marine and coastal work, kitchens and food plants, balcony railings, art installations and chemical plants.",
    "Tell us the diameter, the length and the construction. Stainless rope costs more than GI or MS; pay for it where rust, stains or corrosion are the problem. A lifting rope needs a rated working load from the maker.",
    "Stainless costs more than MS or GI. The rate depends on the diameter, the construction and the length. Ask us with the diameter and the metres.",
    [
      ["Why choose SS over GI wire rope?", "Stainless does not rust and does not stain. GI is cheaper and fine for most outdoor jobs."],
      ["Do you cut it to length?", "Yes, we sell by the metre or by the coil."],
    ],
    [],
    ["gi-wire-rope", "ms-wire-rope", "wire-rope-clamp"]
  ),
  "gi-wire-rope": c(
    "GI wire rope is steel wire rope with a zinc coat for outdoor use. We supply it from 2 mm to 20 mm and above, by the metre or the coil.",
    "It is used for hoists, guy ropes, shade and net supports, cable railing, rigging and any rope that stays in the weather.",
    "Ask for the diameter and the length. Pair it with the right size of wire rope clamps for the eyes. If it takes a lift, ask the maker for the safe working load.",
    "The rate depends on the diameter, the construction and the length. Ask us with the diameter and the metres.",
    [
      ["Is GI wire rope good for outdoor use?", "Yes. The zinc coat slows rust. For coastal or chemical places choose stainless."],
      ["Which clamps do I need?", "Clamps sized to the rope diameter. See our wire rope clamps."],
    ],
    ["pigeon-net-balcony-indore-mesh-size-fixing-guide"],
    ["ms-wire-rope", "ss-wire-rope", "wire-rope-clamp"]
  ),
  "wire-rope-clamp": c(
    "Wire rope clamps are U-bolt clips that hold a wire rope back on itself to make an eye or a loop. They come in sizes to match rope diameter, galvanised.",
    "Riggers, fabricators and site crews use them to make eyes, terminations, guy lines and tie-offs on wire rope.",
    "The clamp size must match the rope diameter exactly. Use at least three on a small rope. The saddle of each clamp goes on the live, load-carrying side and the U-bolt on the short end. Check and re-tighten after the first load.",
    "The rate depends on the size and the number of pieces. Ask us with the rope diameter and the quantity.",
    [
      ["How many clamps do I need per eye?", "At least three for small ropes, and more as the rope gets thicker. Follow the maker's table for your size."],
      ["Which way round does a rope clamp go?", "The saddle on the live (load) side of the rope and the U-bolt on the short end."],
    ],
    [],
    ["gi-wire-rope", "ms-wire-rope", "ss-wire-rope"]
  ),
  "concertina-wire": c(
    "Concertina wire is barbed or razor wire formed into coils that are stretched along a boundary. It is a stronger deterrent than plain barbed wire. We supply single and double coil in galvanised steel.",
    "It is used on top of boundary walls, along industrial and warehouse perimeters, on plots and at sensitive sites where plain barbed wire is not enough.",
    "Give us the length of the perimeter and say whether it goes on a wall, on posts or on top of chain link. A coil opens out to many metres, so we can work out the number of coils from the length. Fit it with gloves and eye protection.",
    "The rate depends on the coil type (single or double), the wire gauge, the blade or barb type and the length. Ask us with the length in metres.",
    [
      ["What is the difference between barbed and concertina wire?", "Barbed wire is a strand with barbs. Concertina is a coil that opens out and gives a thicker, tougher barrier."],
      ["Can it go on top of chain link?", "Yes. It is often fixed on top of a chain link or masonry wall."],
    ],
    ["barbed-wire-vs-concertina-wire", "farm-fencing-madhya-pradesh-posts-wire-angle-plan"],
    ["barbed-wire", "chain-link-fencing", "gi-wire"]
  ),

  // ---------------------------------------------------------------- Tools
  "sr-crowbar": c(
    "The crowbar is a heavy steel bar with a flat or pointed end, for prying, lifting and breaking. We stock SR brand crowbars for site and demolition work.",
    "It is used for demolition, lifting slabs and kerbs, prying shuttering, digging in hard ground and moving heavy objects.",
    "Pick the length and weight for the job. A long bar gives more leverage; a short one is easier to carry. Check that the ends are not chipped.",
    "The rate depends on the length, the weight and the number of pieces. Ask us with the size.",
    [["Which brand of crowbar do you sell?", "SR brand."], ["Do you keep different lengths?", "Yes. Tell us the length or the job and we will show you what is in stock."]],
    [],
    ["sr-sledge-hammer", "sr-pickaxe-geti", "sr-hoe-faurdha"]
  ),
  "sr-sledge-hammer": c(
    "The sledge hammer is a long-handled heavy hammer for breaking, driving stakes and demolition. We stock SR brand sledge hammer heads in 5M, 10M and 15M sizes.",
    "Labour crews use it for breaking concrete and masonry, driving fence posts and stakes, and in smithy work.",
    "Choose the head size by the work: the lighter head is for stakes and long days; the heavy one is for breaking. Handles are fitted from the market on request. Check the head is tight on the handle before use.",
    "The rate depends on the head size and the number of pieces. Ask us with the size.",
    [["What sizes do you stock?", "5M, 10M and 15M heads, SR brand."], ["Do you supply the handle?", "Ask when you request the rate; handle options depend on stock."]],
    [],
    ["sr-crowbar", "sr-pickaxe-geti", "santing-shikanja"]
  ),
  "sr-hoe-faurdha": c(
    "The hoe, called faurdha or phawda, is a digging and weeding tool with a flat steel blade. We stock the SR brand blade, which is fitted with a handle after purchase.",
    "It is used in farms and gardens for digging, weeding and levelling, and on sites for light digging and mixing.",
    "Choose the blade size by the soil: a heavier blade for hard ground. If you want a ready tool, ask for the faurdha with handle.",
    "The rate depends on the blade size and the number of pieces. Ask us with the size.",
    [["Is the handle included?", "This listing is for the blade. A hoe with a fitted handle is listed separately."], ["Which brand?", "SR brand."]],
    [],
    ["sr-hoe-faurdha-with-handle", "sr-pickaxe-geti", "sr-crowbar"]
  ),
  "sr-pickaxe-geti": c(
    "The pickaxe, called geti, has a pointed head for breaking hard ground and rock. We stock SR brand heads for site and trench work.",
    "It is used for trench digging, breaking soil and soft rock, and breaking old concrete and masonry.",
    "Choose by weight: a heavier head breaks harder ground but tires the user faster. Handles are fitted after purchase. Check that the head is well wedged before use.",
    "The rate depends on the head weight and the number of pieces. Ask us with the size.",
    [["What is a geti?", "Geti is the market name for a pickaxe head."], ["Which brand do you sell?", "SR brand."]],
    [],
    ["sr-crowbar", "sr-sledge-hammer", "sr-hoe-faurdha"]
  ),
  "santing-shikanja": c(
    "Shikanja, also called santing, is a heavy clamp used to hold formwork and shuttering in place when a slab or beam is cast.",
    "Contractors use it to clamp props, plates and centering in slab, beam and column shuttering. It is used again and again across jobs.",
    "Buy by the count you need per pour. Check that the thread and the hooks are not bent. Oil them after use so they open easily on the next job.",
    "The rate depends on the size and the number of pieces. Ask us with the quantity.",
    [["What is shikanja used for?", "It clamps shuttering and centering when a slab or beam is cast."], ["Is it reusable?", "Yes, with care. Clean and oil it after each pour."]],
    ["concrete-cover-blocks-why-cover-matters-slab-beam-column", "top-hardware-contractors-buy-siyaganj"],
    ["concrete-cover-block", "binding-wire", "tmt-bars"]
  ),
  "concrete-cover-block": c(
    "Concrete cover blocks, or spacers, keep the reinforcement bars the right distance from the shuttering so the bars end up covered with concrete. We stock 20, 25, 30, 40 and 50 mm cover.",
    "They go under slab bars, beside beam bars and against column bars before the pour. They are tied to the bars with binding wire.",
    "Choose the cover from the drawing. Typical mild-exposure cover is 20 mm for slabs, 25 mm for beams and 40 mm for columns; your drawing overrides this. Do not use wood or bricks as spacers.",
    "The rate depends on the cover size and the number of pieces. They are sold in bulk. Ask us with the size and the count.",
    [
      ["How much cover for a slab?", "20 mm is typical for a slab in mild exposure. Follow your drawing."],
      ["How are cover blocks fixed?", "Tied to the rebar with binding wire before the concrete goes in."],
    ],
    ["concrete-cover-blocks-why-cover-matters-slab-beam-column", "tmt-bar-weight-chart-size-guide-indore"],
    ["binding-wire", "tmt-bars", "santing-shikanja"]
  ),
  "welding-rods": c(
    "Welding rods, or electrodes, are coated rods for arc welding. We stock the common types, E6013 and E7018, in 2.5, 3.15 and 4.0 mm sizes in 1 kg and 5 kg boxes.",
    "Fabricators and repair shops use them for MS fabrication, gates, grills, frames and general repair. E6013 is the all-round rod. E7018 is used where a stronger, cleaner weld is specified.",
    "Match the rod to the job and the current of your machine. Keep E7018 dry, as it takes up moisture. Thinner rods are for thin plate and thick rods for heavy work.",
    "The rate depends on the type, the size, the brand and the pack. Welding rods are sold by weight. Ask us with the type and size.",
    [
      ["Which welding rod for general work?", "E6013 is the common all-round rod for MS fabrication and repair."],
      ["How do I store E7018?", "Dry. Keep it in a sealed box or an oven if the shop is damp."],
    ],
    ["top-hardware-contractors-buy-siyaganj"],
    ["cutting-discs-grinding-wheels", "ms-angles", "ms-flats"]
  ),
  "sponge": c(
    "Construction sponge is a soft block used to clean and finish tiles, grout and plaster. We keep different sizes and densities.",
    "Tilers and plasterers use it to wipe grout, clean tile faces and finish plaster. Painters and cleaners use it for general site cleanup.",
    "Soft sponge is for wiping and tile cleaning, firm sponge is for finishing plaster. Tell us the size and what it is for.",
    "The rate depends on the size, the density and the pack. Ask us with the size and the count.",
    [["Which sponge for wiping grout?", "A soft to medium sponge."], ["Is it sold singly?", "Singly or in packs, as per stock."]],
    [],
    ["cutting-discs-grinding-wheels", "welding-rods", "santing-shikanja"]
  ),
  "cutting-discs-grinding-wheels": c(
    "Cutting discs and grinding wheels are abrasive wheels for angle grinders. We stock 4 inch (100 mm) to 7 inch (180 mm) discs with a 22 mm bore, in cutting thickness of 1 to 3 mm and grinding thickness of 6 mm.",
    "Fabricators use cutting discs to cut pipe, angle, bar and sheet. Grinding wheels clean welds and shape metal. Flexible discs are for finishing.",
    "The disc diameter must match the guard and the spindle speed of your grinder. Use a cutting disc to cut and a grinding wheel to grind. Do not side-grind with a cutting disc. Always wear eye protection.",
    "The rate depends on the diameter, the thickness, the type and the brand. Ask us with the size and the count.",
    [
      ["What size disc fits my grinder?", "The diameter printed on the grinder's guard. The common one is 4 inch (100 mm)."],
      ["Can I grind with a cutting disc?", "No. A cutting disc is thin and can break if used on its side."],
    ],
    [],
    ["welding-rods", "ms-angles", "sponge"]
  ),
  "sr-hoe-faurdha-with-handle": c(
    "This is the SR hoe (faurdha) with the handle already fitted, with a carbon steel blade and a green, black or other finish as per stock. It is ready to use from the shop.",
    "It is used for digging, weeding and levelling in farms and gardens, and for light site work.",
    "Choose a handle length that suits the user's height. Carbon steel holds an edge but should be wiped dry to stop rust.",
    "The rate depends on the blade size and the handle. Ask us for the current rate.",
    [["Is this the complete tool?", "Yes. It comes with the handle fitted."], ["What colours?", "Green and black as per stock."]],
    [],
    ["sr-hoe-faurdha", "sr-pickaxe-geti", "sr-crowbar"]
  ),

  // ---------------------------------------------------------------- Nails
  "fasteners-nails": c(
    "Wire nails are plain steel nails sold by weight, from 1 inch to 6 inch. We keep them in bins by length, in mild steel and galvanised.",
    "Carpenters use them for shuttering, framing and packing. Fencers use them to fix wire and mesh to wooden posts. Roofers use the longer sizes for battens.",
    "Pick the length at 2.5 to 3 times the thickness of the piece you are fixing. Thinner nails split less in wood. For roofing sheet, use roofing nails.",
    "Nails are sold by weight. The rate depends on the length, the gauge, the finish and the quantity. Ask us with the length and the kg.",
    [
      ["What length wire nail for shuttering?", "Usually 2 to 3 inch, depending on the plank thickness."],
      ["Are nails sold by weight?", "Yes, by the kg."],
    ],
    ["nails-guide-wire-nails-roofing-nails-concrete-nails"],
    ["roofing-nail", "binding-wire", "gi-wire"]
  ),
  "roofing-nail": c(
    "Roofing nails have a wide flat head that grips sheet and felt without tearing it. We stock lengths from 1.5 inch to 6 inch, in mild steel and galvanised.",
    "They are used to fix metal and fibre sheet, felt and shingles to wood battens, and for fixing mesh and netting.",
    "Use galvanised nails outdoors so they do not stain or rot out. Choose length to go 25 mm or more into the batten. Tell us the sheet type.",
    "Roofing nails are sold by weight. The rate depends on the length, the finish and the quantity. Ask us with the length and kg.",
    [
      ["Galvanised or plain roofing nails?", "Galvanised for outdoors. Plain nails rust and stain."],
      ["What length for a sheet roof?", "Long enough to go at least 25 mm into the batten."],
    ],
    ["nails-guide-wire-nails-roofing-nails-concrete-nails"],
    ["fasteners-nails", "gi-wire", "pigeon-nets"]
  ),

  // ---------------------------------------------------------------- Safety nets
  "pigeon-nets": c(
    "Pigeon net is a knotted nylon or HDPE net that closes off a balcony, window or shaft so birds cannot get in. We cut it to size at the counter, in widths of 3 ft to 20 ft.",
    "Apartment owners fit it on balconies, duct shafts, terraces, window cut-outs and open parking. It also keeps birds out of godowns.",
    "Measure the opening and add a little for fixing. Choose the mesh by the bird: small mesh for pigeons and sparrows. Fix it on a frame of GI wire or rope, pulled taut, with no gaps. See the guide for fixing details.",
    "The rate depends on the material, the mesh and thread thickness, and the area. Ask us with the size of the opening.",
    [
      ["What size mesh for pigeons?", "A small mesh that a pigeon cannot push its head through. We will show you the options at the counter."],
      ["How is it fixed?", "On GI wire or rope round the frame, pulled tight, with fixings every 30 cm or so."],
    ],
    ["pigeon-net-balcony-indore-mesh-size-fixing-guide", "pigeon-spikes-netting-installation-guide"],
    ["pigeon-spikes", "gi-wire", "gi-wire-rope"]
  ),
  "pigeon-spikes": c(
    "Pigeon spikes are rows of pointed spikes that stop birds from landing on a ledge. We stock plastic and stainless steel wire spikes.",
    "They go on window ledges, parapet walls, beams, AC outdoor units and sign boards.",
    "Choose by the ledge width and the exposure. Plastic spikes are cheaper and fine for most ledges. Stainless spikes last longer in sun and rain. Clean the surface before you fix.",
    "The rate depends on the material and the running metres. Ask us with the length.",
    [
      ["Do spikes hurt birds?", "They are blunt-pointed deterrents that stop a bird from landing; they are not meant to injure."],
      ["Spikes or net?", "Spikes for ledges, net for open spaces such as balconies and shafts."],
    ],
    ["pigeon-spikes-netting-installation-guide", "pigeon-net-balcony-indore-mesh-size-fixing-guide"],
    ["pigeon-nets", "gi-wire", "fasteners-nails"]
  ),
  "safety-net": c(
    "Safety net is a heavy-duty net used on construction sites to catch falling people and debris. We supply nylon and polyethylene nets.",
    "Contractors fit it on scaffolding and building edges, around stairwells and over work areas where tools or material can fall.",
    "Tell us the area and how it will be fixed. A net for fall protection must be fixed and rated as the site rules say; ask your safety officer for the standard. Debris netting is a lighter net for catching material only.",
    "The rate depends on the material, the mesh, the strength and the area. Ask us with the dimensions.",
    [
      ["Is safety net the same as pigeon net?", "No. Safety net is a heavy-duty net for sites. Pigeon net is a light net for keeping birds out."],
      ["Can you supply it to size?", "Tell us the dimensions and we will confirm what is possible."],
    ],
    ["pigeon-spikes-netting-installation-guide"],
    ["pigeon-nets", "gi-wire-rope", "wire-rope-clamp"]
  ),
};
