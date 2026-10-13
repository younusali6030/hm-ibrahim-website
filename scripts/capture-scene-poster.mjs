// Renders a 3D hero scene to its static poster (AVIF + JPG) through the dev-only /lab route.
//   PW_ROOT=<dir containing node_modules/playwright-core> node scripts/capture-scene-poster.mjs \
//     <scene> <outBase> [width=1500] [height=1200] [focus=] [baseUrl=http://localhost:3000]
// Needs: `npm run dev` running, Google Chrome installed, and playwright-core + sharp resolvable.
import { createRequire } from "node:module";
import path from "node:path";

const [, , scene, outBase, w = "1500", h = "1200", focus = "", base = "http://localhost:3000"] = process.argv;
if (!scene || !outBase) throw new Error("usage: capture-scene-poster.mjs <scene> <outBase> [w] [h] [focus] [baseUrl]");
const here = createRequire(import.meta.url);
const pw = createRequire(path.join(process.env.PW_ROOT || process.cwd(), "/")) ("playwright-core");
const sharp = here("sharp");

const browser = await pw.chromium.launch({
  channel: "chrome",
  args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
});
const page = await (await browser.newContext({ viewport: { width: Number(w), height: Number(h) }, deviceScaleFactor: 1 })).newPage();
await page.goto(`${base}/lab?s=${scene}&w=${w}&h=${h}&scene-debug=1`, { waitUntil: "load", timeout: 120000 });
await page.waitForFunction(() => window.__scene, null, { timeout: 60000 });
const dataUrl = await page.evaluate(([W, H, f]) => window.__scene.still(W, H, f || null), [Number(w), Number(h), focus]);
await browser.close();
const png = Buffer.from(dataUrl.split(",")[1], "base64");
await sharp(png).jpeg({ quality: 82, mozjpeg: true }).toFile(`${outBase}.jpg`);
await sharp(png).avif({ quality: 52, effort: 6 }).toFile(`${outBase}.avif`);
console.log("wrote", `${outBase}.jpg`, `${outBase}.avif`);
