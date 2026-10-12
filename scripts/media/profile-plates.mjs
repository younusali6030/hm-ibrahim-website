// Draws honest section-profile plates (technical drawings, not photos) for products without a real photo.
// Usage: SHARP_PATH=... node scripts/media/profile-plates.mjs
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
const sharp = createRequire(import.meta.url)(process.env.SHARP_PATH || "sharp");
const root = path.resolve(import.meta.dirname, "../..");
const frame = (title, code, body, dims) => `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
<defs><pattern id="g" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#fff" stroke-opacity=".05"/></pattern>
<linearGradient id="s" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8fa3b5"/><stop offset=".5" stop-color="#5d7184"/><stop offset="1" stop-color="#3b4a59"/></linearGradient></defs>
<rect width="1200" height="900" fill="#0b121a"/><rect width="1200" height="900" fill="url(#g)"/>
<g fill="none" stroke="#f97316" stroke-width="2">${dims}</g>
<g fill="url(#s)" stroke="#c9d4de" stroke-width="3" stroke-linejoin="round">${body}</g>
<text x="60" y="92" font-family="IBM Plex Mono, monospace" font-size="26" letter-spacing="4" fill="#f97316">${code}</text>
<text x="60" y="150" font-family="Arial Narrow, Arial, sans-serif" font-weight="800" font-size="64" fill="#e8eef3">${title}</text>
<text x="60" y="850" font-family="IBM Plex Mono, monospace" font-size="20" letter-spacing="3" fill="#7d8c99">SECTION PROFILE · NOT TO SCALE · H M IBRAHIM &amp; CO.</text></svg>`;
const plates = {
  "ms-i-beams-joists-1": frame("I-BEAM / JOIST", "ISMB · ISJB", `<path d="M360 250H840V310H650V590H840V650H360V590H550V310H360Z"/>`,
    `<path d="M300 250V650M290 250H320M290 650H320M360 700H840M360 690V710M840 690V710M900 310V590M890 310H910M890 590H910"/><text x="260" y="460" fill="#f97316" stroke="none" font-family="IBM Plex Mono" font-size="22" transform="rotate(-90 260 460)">DEPTH</text><text x="560" y="740" fill="#f97316" stroke="none" font-family="IBM Plex Mono" font-size="22">FLANGE WIDTH</text>`),
  "ms-channels-plate": frame("CHANNEL", "ISMC · ISLC", `<path d="M400 250H780V320H480V580H780V650H400Z"/>`,
    `<path d="M340 250V650M330 250H350M330 650H350M400 700H780M400 690V710M780 690V710M850 250H850"/><text x="300" y="460" fill="#f97316" stroke="none" font-family="IBM Plex Mono" font-size="22" transform="rotate(-90 300 460)">DEPTH</text><text x="500" y="740" fill="#f97316" stroke="none" font-family="IBM Plex Mono" font-size="22">FLANGE WIDTH</text>`),
};
const out = path.join(root, "public/products/v2");
fs.mkdirSync(out, { recursive: true });
for (const [id, svg] of Object.entries(plates)) {
  await sharp(Buffer.from(svg)).webp({ quality: 88 }).toFile(path.join(out, id + ".webp"));
  console.log("plate", id);
}
