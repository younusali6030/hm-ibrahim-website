// Usage: node scripts/media/blur-dir.mjs   -> content/media/blur.json (products) and blur-blog.json (blog)
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
const sharp = createRequire(import.meta.url)(process.env.SHARP_PATH || "sharp");
const root = path.resolve(import.meta.dirname, "../..");
const jobs = [
  { dirs: ["products", "products/v2"], out: "content/media/blur.json" },
  { dirs: ["blog"], out: "content/media/blur-blog.json" },
];
for (const { dirs, out } of jobs) {
  const map = {};
  for (const d of dirs) {
    const abs = path.join(root, "public", d);
    for (const f of fs.readdirSync(abs)) {
      if (!/\.(png|jpe?g|webp)$/i.test(f)) continue;
      try {
        const buf = await sharp(path.join(abs, f)).rotate().resize(10).flatten({ background: "#10161d" }).webp({ quality: 30 }).toBuffer();
        map[`/${d}/${f}`] = "data:image/webp;base64," + buf.toString("base64");
      } catch {}
    }
  }
  fs.writeFileSync(path.join(root, out), JSON.stringify(map));
  console.log(out, Object.keys(map).length, (fs.statSync(path.join(root, out)).size / 1024) | 0, "KB");
}
