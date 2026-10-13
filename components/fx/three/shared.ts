import {
  BackSide,
  CanvasTexture,
  Color,
  DoubleSide,
  LinearFilter,
  LinearMipmapLinearFilter,
  Material,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  NoColorSpace,
  PlaneGeometry,
  PMREMGenerator,
  RepeatWrapping,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  SRGBColorSpace,
  type Texture,
  type WebGLRenderer,
} from "three";

/**
 * Material and lighting vocabulary shared by every 3D hero on the site: one studio, one set of steels.
 * Scenes import from here so a galvanized wire on Brands and a galvanized coil on Products are the same zinc.
 * Everything here is created per scene and must be released with the returned `dispose`.
 */

/* ------------------------------------------------------------------ procedural textures */

/** Tileable value noise on a small lattice. */
export function noise2(w: number, h: number, cells: number, seed: number): Float32Array {
  const rnd = (x: number, y: number) => {
    const n = Math.sin((x + seed * 17.13) * 127.1 + (y + seed * 3.7) * 311.7) * 43758.5453;
    return n - Math.floor(n);
  };
  const out = new Float32Array(w * h);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const fx = (x / w) * cells;
      const fy = (y / h) * cells;
      const x0 = Math.floor(fx);
      const y0 = Math.floor(fy);
      const tx = fx - x0;
      const ty = fy - y0;
      const sx = tx * tx * (3 - 2 * tx);
      const sy = ty * ty * (3 - 2 * ty);
      const c = (i: number, j: number) => rnd(((x0 + i) % cells + cells) % cells, ((y0 + j) % cells + cells) % cells);
      const a = c(0, 0) + (c(1, 0) - c(0, 0)) * sx;
      const b = c(0, 1) + (c(1, 1) - c(0, 1)) * sx;
      out[y * w + x] = a + (b - a) * sy;
    }
  return out;
}

function seeded(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

function finish(c: HTMLCanvasElement, maxAniso: number, srgb = false): CanvasTexture {
  const t = new CanvasTexture(c);
  t.wrapS = t.wrapT = RepeatWrapping;
  t.colorSpace = srgb ? SRGBColorSpace : NoColorSpace;
  t.anisotropy = Math.min(8, maxAniso);
  t.minFilter = LinearMipmapLinearFilter;
  t.magFilter = LinearFilter;
  return t;
}

/**
 * Galvanized zinc as a roughness/bump map: broad spangle mottling, fine grain and a few drawn-wire scratches.
 * The U axis runs along the wire, so scratches follow its length. `mottle` raises the contrast of the blotches.
 */
export function zincTexture(maxAniso: number, mottle = 1): CanvasTexture {
  const W = 512;
  const H = 256;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;
  const lo = noise2(W, H, 5, 1);
  const mid = noise2(W, H, 14, 2);
  const hi = noise2(W, H, 64, 3);
  const fine = noise2(W, H, 128, 4);
  const img = ctx.createImageData(W, H);
  for (let i = 0; i < W * H; i++) {
    // Low-frequency blotches are what read as spangle on dull zinc; the fine terms stop it looking smooth.
    const blotch = Math.pow(Math.abs(lo[i] - 0.5) * 2, 0.8) * (lo[i] > 0.5 ? 1 : -1);
    const v = 0.62 + blotch * 0.16 * mottle + (mid[i] - 0.5) * 0.14 * mottle + (hi[i] - 0.5) * 0.1 + (fine[i] - 0.5) * 0.07;
    const b = Math.round(Math.min(1, Math.max(0, v)) * 255);
    img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = b;
    img.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  const r = seeded(12345);
  for (let n = 0; n < 56; n++) {
    const y = r() * H;
    const x = r() * W;
    const len = 30 + r() * 150;
    const dark = r() < 0.5;
    ctx.strokeStyle = dark ? `rgba(40,40,40,${0.1 + r() * 0.16})` : `rgba(210,210,210,${0.08 + r() * 0.14})`;
    ctx.lineWidth = 0.6 + r() * 0.9;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + len, y + (r() - 0.5) * 3);
    ctx.stroke();
    if (x + len > W) {
      ctx.beginPath();
      ctx.moveTo(x - W, y);
      ctx.lineTo(x - W + len, y + (r() - 0.5) * 3);
      ctx.stroke();
    }
  }
  return finish(c, maxAniso);
}

/** Isotropic surface grain, used as roughness and bump on rolled and mill steel and on the counter. */
export function grainTexture(maxAniso: number, opts: { cells?: number[]; seed?: number; base?: number; amp?: number } = {}): CanvasTexture {
  const S = 256;
  const { cells = [4, 16, 48, 128], seed = 7, base = 0.55, amp = 0.5 } = opts;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const ctx = c.getContext("2d")!;
  const layers = cells.map((n, i) => noise2(S, S, n, seed + i * 3));
  const img = ctx.createImageData(S, S);
  for (let i = 0; i < S * S; i++) {
    let v = base;
    layers.forEach((l, k) => (v += (l[i] - 0.5) * amp * Math.pow(0.7, k)));
    const b = Math.round(Math.min(1, Math.max(0, v)) * 255);
    img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = b;
    img.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return finish(c, maxAniso);
}

/** A soft dark pool, drawn under an object to seat it on the surface. */
export function contactShadowTexture(): CanvasTexture {
  const S = 128;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(S / 2, S / 2, S * 0.04, S / 2, S / 2, S / 2);
  g.addColorStop(0, "rgba(0,0,0,0.85)");
  g.addColorStop(0.45, "rgba(0,0,0,0.42)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S, S);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

/* ------------------------------------------------------------------ environment */

export type EnvPreset = "fence" | "bench" | "showroom";

type Card = { pos: [number, number, number]; size: [number, number]; color: string; i: number };

const CARDS: Record<EnvPreset, Card[]> = {
  // Brands: a navy dome, a broad soft key, a cool strip rim and a faint warm card.
  fence: [
    { pos: [-22, 20, 26], size: [34, 22], color: "#fff6ea", i: 7 },
    { pos: [0, 34, -4], size: [34, 7], color: "#f2f4f8", i: 3 },
    { pos: [34, 8, -26], size: [7, 34], color: "#b4d2f2", i: 4.2 },
    { pos: [-34, -4, -18], size: [6, 24], color: "#8cc2ff", i: 2.0 },
    { pos: [24, -17, 14], size: [10, 10], color: "#ff8a3c", i: 3.4 },
  ],
  // Products showroom: a big cool softbox up and to the left, two long overhead strips (they draw the streaks on
  // round bars), a warm orange edge strip behind on the right, a faint cool bounce low on the left.
  showroom: [
    { pos: [-30, 36, 22], size: [44, 30], color: "#dce8ff", i: 5.2 },
    { pos: [8, 44, -4], size: [70, 5], color: "#f4f7ff", i: 6.0 },
    { pos: [-12, 34, -16], size: [60, 4], color: "#ffffff", i: 3.4 },
    { pos: [44, 14, -34], size: [8, 40], color: "#ff7a1c", i: 2.6 },
    { pos: [-46, 6, -6], size: [8, 30], color: "#9cc2f0", i: 2.2 },
    { pos: [26, 8, 40], size: [30, 14], color: "#cfdaea", i: 0.9 },
  ],
  // Tabletop scenes: a large overhead softbox, a long window strip from the left, a warm bounce from the right.
  bench: [
    { pos: [-6, 40, 8], size: [46, 26], color: "#fff4e6", i: 6.5 },
    { pos: [-40, 14, 6], size: [10, 38], color: "#e9f1ff", i: 4.4 },
    { pos: [36, 10, -22], size: [8, 30], color: "#b4d2f2", i: 3.6 },
    { pos: [30, 4, 20], size: [14, 12], color: "#ff8a3c", i: 2.6 },
    { pos: [0, 26, -46], size: [80, 30], color: "#dfe7f0", i: 1.0 },
  ],
};

/** A small, art-directed studio baked into a PMREM texture. Dispose the returned texture with the scene. */
export function buildEnvironment(renderer: WebGLRenderer, preset: EnvPreset = "fence"): Texture {
  const env = new Scene();
  const dome = new Mesh(
    new SphereGeometry(60, 32, 16),
    new ShaderMaterial({
      side: BackSide,
      depthWrite: false,
      uniforms: {},
      vertexShader: `varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
      fragmentShader: `varying vec3 vP;
        void main(){
          float h = normalize(vP).y;
          vec3 top = vec3(0.13, 0.15, 0.17);
          vec3 mid = vec3(0.045, 0.055, 0.068);
          vec3 low = vec3(0.006, 0.009, 0.013);
          vec3 c = h > 0. ? mix(mid, top, smoothstep(0., 0.9, h)) : mix(mid, low, smoothstep(0., -0.7, h));
          gl_FragColor = vec4(c, 1.);
        }`,
    })
  );
  env.add(dome);
  for (const c of CARDS[preset]) {
    const m = new Mesh(
      new PlaneGeometry(c.size[0], c.size[1]),
      new MeshBasicMaterial({ color: new Color(c.color).multiplyScalar(c.i), toneMapped: false, side: DoubleSide })
    );
    m.position.set(...c.pos);
    m.lookAt(0, 0, 0);
    env.add(m);
  }
  const pm = new PMREMGenerator(renderer);
  const rt = pm.fromScene(env, 0.015);
  pm.dispose();
  env.traverse((o) => {
    if (o instanceof Mesh) {
      o.geometry.dispose();
      (o.material as Material).dispose();
    }
  });
  return rt.texture;
}

/* ------------------------------------------------------------------ steels */

export type Steels = {
  /** Hot-dip galvanized: dull zinc, mottled, broad soft reflections. */
  galvanized: MeshStandardMaterial;
  /** Rolled TMT: dark, scaled, a little blue in the grey. */
  rolled: MeshStandardMaterial;
  /** Drawn bright bar: smooth, directional reflections. */
  bright: MeshStandardMaterial;
  /** Hot-rolled mill finish for sections and flats. */
  mill: MeshStandardMaterial;
  /** Cut face of a bar: lighter, brushed. */
  cut: MeshStandardMaterial;
  /** Matte dark work surface. */
  counter: MeshStandardMaterial;
  dispose(): void;
};

/** One shared set of finishes. `maxAniso` comes from renderer.capabilities.getMaxAnisotropy(). */
export function createSteels(maxAniso: number): Steels {
  const zinc = zincTexture(maxAniso, 1);
  const grain = grainTexture(maxAniso, { seed: 11 });
  const scale = grainTexture(maxAniso, { cells: [3, 9, 31, 90], seed: 29, base: 0.7, amp: 0.7 });
  // Extruded sections carry world-unit UVs (1 uv = 1 cm), so their grain tiles every ~9 cm instead of every cm.
  scale.repeat.set(0.11, 0.11);
  grain.repeat.set(0.11, 0.11);
  const counterGrain = grainTexture(maxAniso, { cells: [2, 7, 23, 80], seed: 41, base: 0.5, amp: 0.45 });
  counterGrain.repeat.set(3, 3);

  const galvanized = new MeshStandardMaterial({
    color: new Color("#868c90"),
    metalness: 0.95,
    roughness: 1,
    roughnessMap: zinc,
    bumpMap: zinc,
    bumpScale: 0.25,
    envMapIntensity: 1,
  });
  const rolled = new MeshStandardMaterial({
    color: new Color("#5c626a"),
    metalness: 0.72,
    roughness: 0.9,
    roughnessMap: scale,
    bumpMap: scale,
    bumpScale: 0.6,
  });
  const bright = new MeshStandardMaterial({
    color: new Color("#d3d6d8"),
    metalness: 1,
    roughness: 0.26,
    roughnessMap: grain,
    envMapIntensity: 1.15,
  });
  const mill = new MeshStandardMaterial({
    color: new Color("#6b7075"),
    metalness: 0.7,
    roughness: 0.85,
    roughnessMap: scale,
    bumpMap: scale,
    bumpScale: 0.5,
  });
  const cut = new MeshStandardMaterial({
    color: new Color("#b8bcbf"),
    metalness: 0.6,
    roughness: 0.85,
    roughnessMap: grain,
  });
  const counter = new MeshStandardMaterial({
    color: new Color("#0d1217"),
    metalness: 0.05,
    roughness: 0.86,
    roughnessMap: counterGrain,
    bumpMap: counterGrain,
    bumpScale: 0.4,
  });
  const textures = [zinc, grain, scale, counterGrain];
  const mats = [galvanized, rolled, bright, mill, cut, counter];
  return {
    galvanized,
    rolled,
    bright,
    mill,
    cut,
    counter,
    dispose() {
      mats.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
    },
  };
}
