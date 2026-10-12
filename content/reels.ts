/**
 * Reels and product videos with the page each one is embedded on.
 * Used by the video sitemap and VideoObject schema. Titles and notes mirror what the page shows.
 * Files live in /public/reels and /public/videos; the .jpg next to each .mp4 is its poster.
 * uploadDate is the day the encoded file was added to the site (2026-10-11).
 */
export type SiteVideo = {
  /** Path without extension, e.g. /reels/nail-reel */
  src: string;
  title: string;
  description: string;
  /** Page where the video is embedded (site-relative). */
  page: string;
  uploadDate: string;
};

const UPLOADED = "2026-10-11";

export const homeReels: SiteVideo[] = [
  { src: "/reels/shop-par-bharosa", title: "Shop par bharosa: walk in, see the stock, decide", description: "A short reel from the H M Ibrahim & Co counter on Siyaganj Main Road, Indore.", page: "/", uploadDate: UPLOADED },
  { src: "/reels/check-the-strength", title: "Check the strength: wire and mesh tested in front of you", description: "Wire and mesh strength checked at the counter in Siyaganj, Indore.", page: "/", uploadDate: UPLOADED },
  { src: "/reels/machhar-full-stop", title: "Mosquito net cut at the counter", description: "Mosquito net (machhar jali) being cut to size at the Siyaganj shop.", page: "/", uploadDate: UPLOADED },
  { src: "/reels/perforated-sheet-customer", title: "Perforated sheet: a customer on why he buys it here", description: "A customer talks about buying perforated sheet from H M Ibrahim & Co, Siyaganj.", page: "/", uploadDate: UPLOADED },
  { src: "/reels/nail-reel", title: "Nails by weight: every length in the bins", description: "Wire nails and roofing nails in the bins at the Siyaganj shop.", page: "/", uploadDate: UPLOADED },
  { src: "/reels/kala-taar-wholesale", title: "Kala taar wholesale: binding wire by the coil", description: "Black annealed binding wire (kala taar) sold by the coil at the Siyaganj shop.", page: "/", uploadDate: UPLOADED },
  { src: "/reels/frp-bars", title: "FRP bars: light, rust-proof, cut to length", description: "FRP bars in 4 ft, 5 ft and 6 ft lengths at the Siyaganj shop.", page: "/", uploadDate: UPLOADED },
  { src: "/reels/weldmesh-jali", title: "Weldmesh jali: rolls and panels", description: "Welded wire mesh (weldmesh jali) rolls and panels at the Siyaganj shop.", page: "/", uploadDate: UPLOADED },
  { src: "/reels/kabootar-jali", title: "Kabootar jali: pigeon net for balconies and shafts", description: "Pigeon net (kabootar jali) for balconies and shafts.", page: "/", uploadDate: UPLOADED },
  { src: "/reels/pvc-hexa-mesh", title: "PVC hexa mesh for garden and poultry fencing", description: "Plastic hexagonal mesh for garden and poultry fencing.", page: "/", uploadDate: UPLOADED },
  { src: "/reels/tata-wire-rate", title: "Tata Wiron wire, straight from the shelf", description: "Tata Wiron GI wire stocked at H M Ibrahim & Co, an authorised Tata dealer.", page: "/", uploadDate: UPLOADED },
  { src: "/reels/rat-jaali-customer", title: "Rat jaali: a customer on camera", description: "A customer talks about rat jaali bought from the Siyaganj shop.", page: "/", uploadDate: UPLOADED },
];

/** Chain link walkthrough, embedded on the CM and Border brand pages. */
export const brandVideos: SiteVideo[] = [
  { src: "/reels/chainlink-walkthrough", title: "Chain link fencing walkthrough", description: "A walkthrough of chain link fencing rolls (jali) from the CM and Border brands at the Siyaganj shop.", page: "/brands/cm", uploadDate: UPLOADED },
  { src: "/reels/chainlink-walkthrough", title: "Chain link fencing walkthrough (Border)", description: "A walkthrough of chain link fencing rolls (jali) from the CM and Border brands at the Siyaganj shop.", page: "/brands/border", uploadDate: UPLOADED },
];
