// Renders the Hindi Open Graph cards (1200x630) to public/og/hi/<type>.png with headless Chromium.
// Usage: node scripts/og/build-hi-og.mjs   (set CHROME to a chrome-headless-shell binary if it is not found)
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { tmpdir, homedir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(fileURLToPath(new URL("../..", import.meta.url)));
const cards = {
  default: ["सियागंज, इंदौर", "लोहा, तार और जाली,", "1939 से।"],
  home: ["सियागंज, इंदौर", "लोहा, तार और जाली,", "1939 से।"],
  product: ["उत्पाद", "हर साइज़,", "एक काउंटर पर।"],
  category: ["रेंज", "पूरी रेंज,", "एक काउंटर।"],
  indore: ["इंदौर", "इंदौर के लिए,", "सियागंज से।"],
  blog: ["गाइड", "काउंटर से", "खरीदारी गाइड।"],
  brand: ["ब्रांड", "सीएम, बॉर्डर", "और टाटा वायरॉन।"],
  about: ["हमारे बारे में", "सियागंज में,", "1939 से।"],
  contact: ["संपर्क", "रेट पूछिए,", "या दुकान आइए।"],
};

function findChrome() {
  if (process.env.CHROME) return process.env.CHROME;
  const base = join(homedir(), "Library/Caches/ms-playwright");
  if (existsSync(base)) {
    for (const d of readdirSync(base).filter((n) => n.startsWith("chromium_headless_shell"))) {
      for (const sub of readdirSync(join(base, d))) {
        const p = join(base, d, sub, "headless_shell");
        if (existsSync(p)) return p;
      }
    }
  }
  throw new Error("No headless Chromium found. Set CHROME.");
}

const chrome = findChrome();
const dir = mkdtempSync(join(tmpdir(), "hm-og-"));
const logo = pathToFileURL(join(root, "public/logo-wordmark.png")).href;
const html = (eyebrow, l1, l2) => `<!doctype html><html lang="hi"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@500;800&family=IBM+Plex+Mono:wght@500&display=block" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;background:#0a0f16;color:#f4f6fa;font-family:"Noto Sans Devanagari",sans-serif;position:relative;overflow:hidden}
.mesh{position:absolute;right:0;top:0;width:380px;height:300px;opacity:.55;
 background:repeating-linear-gradient(45deg,rgba(255,255,255,.07) 0 1px,transparent 1px 26px),repeating-linear-gradient(-45deg,rgba(255,255,255,.07) 0 1px,transparent 1px 26px);
 -webkit-mask-image:linear-gradient(225deg,#000,transparent 75%)}
.eyebrow{position:absolute;left:72px;top:72px;display:flex;align-items:center;gap:18px;font-size:30px;font-weight:500;color:#aab2bf}
.eyebrow i{display:block;width:48px;height:2px;background:#f97316}
h1{position:absolute;left:72px;top:140px;font-size:104px;line-height:1.28;font-weight:800;letter-spacing:-1px}
h1 b{display:block;color:#f97316;font-weight:800}
.ruler{position:absolute;left:72px;right:72px;top:498px;height:20px;border-top:2px solid #aab2bf;
 background:repeating-linear-gradient(90deg,#aab2bf 0 2px,transparent 2px 20px);background-size:100% 10px;background-repeat:no-repeat;background-position:0 0}
.addr{position:absolute;left:72px;top:546px;font-size:28px;font-weight:500;color:#aab2bf}
img{position:absolute;right:72px;top:524px;height:64px}
</style></head><body><div class="mesh"></div>
<div class="eyebrow"><i></i>${eyebrow}</div>
<h1>${l1}<b>${l2}</b></h1><div class="ruler"></div>
<div class="addr">60, सियागंज मेन रोड, इंदौर &nbsp;·&nbsp; 1939 से</div>
<img src="${logo}" alt="">
</body></html>`;

for (const [type, [eyebrow, l1, l2]] of Object.entries(cards)) {
  const f = join(dir, `${type}.html`);
  writeFileSync(f, html(eyebrow, l1, l2));
  const out = join(root, "public/og/hi", `${type}.png`);
  execFileSync(chrome, ["--no-sandbox", "--hide-scrollbars", "--allow-file-access-from-files", "--force-device-scale-factor=1",
    "--window-size=1200,630", "--virtual-time-budget=8000", `--screenshot=${out}`, pathToFileURL(f).href], { stdio: "ignore" });
  console.log("wrote", out);
}
