/**
 * Visual and range content for the CM, Border and Tata Wiron brand pages.
 * Story text and taglines live in content/brands.ts; specs come from the product catalog (brandVariants).
 */
import type { BrandId } from "./brands";

export type BrandPageVisuals = {
  accent: string;
  logoClear: string;
  hero: { src: string; alt: string };
  gallery: { src: string; alt: string }[];
  /** Facts below the hero. Only values that already appear in the product catalog. */
  facts: { big: string; small: string }[];
};

export const brandPageVisuals: Partial<Record<BrandId, BrandPageVisuals>> = {
  cm: {
    accent: "#d4202c",
    logoClear: "/brands/cm-logo-clear.png",
    hero: { src: "/brands/cm-chainlink.jpg", alt: "CM brand chain link fencing rolls stacked at the HM Ibrahim & Co shop" },
    gallery: [
      { src: "/brands/cm-barbed.jpg", alt: "CM barbed wire and chain link label on a coil" },
      { src: "/brands/cm-chainlink-wide.jpg", alt: "Rolls of CM chain link fencing in rows" },
      { src: "/brands/stack-barbed.jpg", alt: "Stacked CM barbed wire coils in stock" },
      { src: "/brands/stack-barbed-2.jpg", alt: "CM barbed wire coils ready for dispatch" },
    ],
    facts: [
      { big: "1 to 4 in", small: "Chain link mesh opening" },
      { big: "3 to 10 ft", small: "Roll heights" },
      { big: "Up to 25 kg", small: "Barbed wire coils" },
    ],
  },
  border: {
    accent: "#f26a21",
    logoClear: "/brands/border-logo-clear.png",
    hero: { src: "/brands/border-chainlink-barbed.jpg", alt: "Border brand chain link and barbed wire rolls with the Border label" },
    gallery: [
      { src: "/brands/border-barbed.jpg", alt: "Border brand barbed wire coils with the Border wrapper" },
      { src: "/brands/border-chainlink.jpg", alt: "A full roll of Border chain link fencing" },
      { src: "/products/brands/boarder/barbed-chainlink-stack.png", alt: "Border barbed wire and chain link stacked together" },
    ],
    facts: [
      { big: "1 to 4 in", small: "Chain link mesh opening" },
      { big: "3 to 10 ft", small: "Roll heights" },
      { big: "Up to 25 kg", small: "Barbed wire coils" },
    ],
  },
  tata: {
    accent: "#1b4f9c",
    logoClear: "/brands/tata-wiron.png",
    hero: { src: "/products/tata-chainlink-1.png", alt: "Tata Wiron chain link fencing roll at the HM Ibrahim & Co shop" },
    gallery: [
      { src: "/products/tata-barbed-wire.png", alt: "Tata Wiron barbed wire coil" },
      { src: "/products/tata-gi-wire-1.png", alt: "Tata Wiron GI wire coils" },
      { src: "/products/tata-gi-wire-2.png", alt: "Tata Wiron GI wire in stock" },
    ],
    facts: [
      { big: "8 to 18 SWG", small: "GI wire gauge" },
      { big: "1 to 4 in", small: "Chain link mesh opening" },
      { big: "1.5 to 4 mm", small: "Chain link wire size" },
    ],
  },
};
