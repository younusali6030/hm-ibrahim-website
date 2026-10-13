// Usage: [ONLY=id1,id2] SRC_DIR="<media folder>" node scripts/media/build-images.mjs   (needs `sharp`: NODE_PATH or npm i -D sharp)
// Reads content/media/manifest.json, writes <dest>.webp + <dest>.avif (max 1600px, never upscaled) into public/,
// and updates content/media/blur.json with a tiny base64 placeholder per image.
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
const require = createRequire(import.meta.url);
const sharp = require(process.env.SHARP_PATH || "sharp");
const root = path.resolve(import.meta.dirname, "../..");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "content/media/manifest.json"), "utf8"));
const blurFile = path.join(root, "content/media/blur.json");
const blur = fs.existsSync(blurFile) ? JSON.parse(fs.readFileSync(blurFile, "utf8")) : {};
const srcDir = process.env.SRC_DIR;
const only = process.env.ONLY ? new Set(process.env.ONLY.split(",")) : null;
for (const m of manifest) {
  if (m.generated) continue;
  if (only && !only.has(m.id)) continue;
  const input = m.abs ?? path.join(srcDir, m.src);
  const out = path.join(root, "public", m.dest);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const img = () => sharp(input).rotate().resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true });
  await img().webp({ quality: 80, effort: 5 }).toFile(out + ".webp");
  const tiny = await sharp(input).rotate().resize(16).blur(0.5).webp({ quality: 40 }).toBuffer();
  blur[m.dest + ".webp"] = "data:image/webp;base64," + tiny.toString("base64");
  console.log("ok", m.dest, (fs.statSync(out + ".webp").size / 1024) | 0, "KB webp");
}
fs.writeFileSync(blurFile, JSON.stringify(blur, null, 1));
