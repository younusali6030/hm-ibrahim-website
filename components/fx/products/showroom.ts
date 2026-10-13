import {
  Box3,
  BoxGeometry,
  CanvasTexture,
  CatmullRomCurve3,
  CircleGeometry,
  Color,
  DirectionalLight,
  ExtrudeGeometry,
  Fog,
  Group,
  HemisphereLight,
  InstancedMesh,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
  PlaneGeometry,
  Raycaster,
  Shape,
  SpotLight,
  SRGBColorSpace,
  TubeGeometry,
  Vector2,
  Vector3,
  type BufferGeometry,
  type Material,
} from "three";
import { createStage, type SceneController, type SceneFactory } from "../three/stage";
import { contactShadowTexture, grainTexture } from "../three/shared";
import { angleSection, brightBar, contactShadow, wireCoil, wovenPanel, type Part } from "../three/parts";
import {
  barbedCoil,
  bundleBand,
  chainLinkRoll,
  expandedPanel,
  foot,
  hollowPipe,
  rebar,
  ropeGrooveTexture,
  uprightPerforated,
  weldedPanel,
  wireRopeCoil,
} from "./showroomParts";
import { SHOWROOM_ITEMS, type LabelPoint, type ShowroomSlug } from "./showroomItems";

/**
 * "The range, in the showroom."
 * Eleven real products in three depth bands on a dark display slab: long bar stock and pipe at the front, coils and
 * rolls in the middle, upright mesh and plate on a low platform at the back. Everything is rigid and rests on the
 * surface. The camera is the only thing that moves: an entry reveal, a damped pointer parallax, and a smooth frame
 * onto a product or a category group.
 */

export { SHOWROOM_ITEMS, type ShowroomSlug, type LabelPoint };


export type ShowroomApi = SceneController & {
  /** Frame a category group (null = whole collection). */
  setGroup(category: string | null): void;
  /** Frame one product (null = back to the collection). */
  select(slug: string | null): void;
  /** Highlight one product without moving the camera (pointer hover, keyboard focus). */
  hover(slug: string | null): void;
  /** Turn the camera round the selected product by `d` radians (drag). No effect on the collection view. */
  orbit(d: number): void;
  /** Product under a client-space point, or null. */
  pick(clientX: number, clientY: number): string | null;
  /** Jump the camera to its current goal without easing. */
  snap(): void;
  /** Called after every drawn frame with the hovered product's screen position (canvas CSS px). */
  onProject(cb: (p: LabelPoint) => void): void;
};

type Slot = { x: number; z: number; yaw: number; onPlatform?: boolean };

/** Where each product stands. x right, z toward the viewer; yaw about the vertical axis. */
const WIDE: Record<ShowroomSlug, Slot> = {
  // Front: long bar stock, lying across the view.
  "tmt-bars": { x: -20, z: 40, yaw: -0.08 },
  "bright-bars": { x: 20, z: 42, yaw: 0.06 },
  "ms-flats": { x: -23, z: 28, yaw: 0.05 },
  "ms-round-bars": { x: 21, z: 30, yaw: -0.05 },
  // Second row: sections and tube turned end-on, small coils beside them.
  "ms-angles": { x: -32, z: 8, yaw: -0.95 },
  "gi-pipes": { x: -10, z: 6, yaw: -1.2 },
  "binding-wire": { x: 9, z: 12, yaw: 0.4 },
  "gi-wire-rope": { x: 29, z: 8, yaw: -1.25 },
  // Third row: coils and rolls.
  "chain-link-fencing": { x: -31, z: -18, yaw: 0.3 },
  "barbed-wire": { x: -10, z: -19, yaw: 0 },
  "concertina-wire": { x: 12, z: -19, yaw: 0.12 },
  "gi-wire": { x: 33, z: -20, yaw: 0.5 },
  // Upright mesh and plate on the back platform.
  "gi-weldmesh": { x: -32, z: -45, yaw: 0.22, onPlatform: true },
  "gi-wiremesh": { x: -10.5, z: -47, yaw: 0.06, onPlatform: true },
  "expanded-metal-mesh": { x: 10.5, z: -47, yaw: -0.06, onPlatform: true },
  "gi-perforated-sheet": { x: 32, z: -45, yaw: -0.22, onPlatform: true },
};

/** A narrower, deeper arrangement for portrait and square canvases. */
const COMPACT: Record<ShowroomSlug, Slot> = {
  "tmt-bars": { x: -2, z: 55, yaw: -0.06 },
  "bright-bars": { x: 5, z: 45, yaw: 0.08 },
  "ms-flats": { x: -4, z: 36, yaw: -0.05 },
  "ms-round-bars": { x: 5, z: 28, yaw: 0.06 },
  "ms-angles": { x: -21, z: 15, yaw: -0.9 },
  "gi-pipes": { x: 2, z: 4, yaw: -1.15 },
  "binding-wire": { x: 22, z: 15, yaw: 0.4 },
  "gi-wire-rope": { x: 24, z: -6, yaw: -1.9 },
  "barbed-wire": { x: -19, z: -6, yaw: 0 },
  "chain-link-fencing": { x: -20, z: -29, yaw: 0.3 },
  "concertina-wire": { x: 1, z: -29, yaw: 1.5 },
  "gi-wire": { x: 22, z: -31, yaw: 0.5 },
  "gi-weldmesh": { x: -24, z: -52, yaw: 0.3, onPlatform: true },
  "gi-wiremesh": { x: -8, z: -56, yaw: 0.08, onPlatform: true },
  "expanded-metal-mesh": { x: 8, z: -56, yaw: -0.08, onPlatform: true },
  "gi-perforated-sheet": { x: 24, z: -52, yaw: -0.3, onPlatform: true },
};

/** Preferred viewing angle when a product is selected. `end` looks down the product's axis from its near end. */
const VIEW: Record<ShowroomSlug, { az: number | "end"; off?: number; el: number }> = {
  "tmt-bars": { az: 0.28, el: 0.34 },
  "bright-bars": { az: -0.24, el: 0.3 },
  "gi-pipes": { az: "end", off: 0.42, el: 0.3 },
  "ms-angles": { az: "end", off: 0.5, el: 0.32 },
  "gi-wire": { az: 0.5, el: 0.36 },
  "chain-link-fencing": { az: 0.3, el: 0.3 },
  "barbed-wire": { az: 0.35, el: 0.38 },
  "gi-wire-rope": { az: 0.2, el: 0.62 },
  "gi-weldmesh": { az: 0.28, el: 0.34 },
  "expanded-metal-mesh": { az: 0.3, el: 0.34 },
  "gi-perforated-sheet": { az: -0.28, el: 0.34 },
  "ms-flats": { az: 0.5, el: 0.36 },
  "ms-round-bars": { az: -0.5, el: 0.34 },
  "gi-wiremesh": { az: 0.26, el: 0.32 },
  "binding-wire": { az: 0.4, el: 0.5 },
  "concertina-wire": { az: 0.5, el: 0.36 },
};

const PLATFORM_Y = 2.4;
/** Resting horizontal view offset on a wide stage, as a fraction of its width (negative: picture sits right). */
const REST_SHIFT = -0.095;
/** The same, with a product selected: centred between the headline and the stage's right edge. */
const SEL_SHIFT = -0.07;
/** Resting vertical offset on a wide stage (negative: picture sits lower, clear of the header fade). */
const REST_DROP = -0.035;

type Tint = { m: MeshStandardMaterial; color: Color; env: number };
type Prod = {
  slug: ShowroomSlug;
  category: string;
  group: Group;
  tints: Tint[];
  hit: Mesh;
  local: Box3;
  centre: Vector3;
  anchor: Vector3;
  ring: Mesh;
  weight: number;
  glow: number;
  /** Seat-shadow decals and their resting opacity: they fade with the product. */
  decals: { m: MeshBasicMaterial; o: number }[];
  /** True while this product would stand between the camera and the selected one. */
  hide: boolean;
  vis: number;
};

const smoothDamp = (cur: number, target: number, vel: { v: number }, smooth: number, dt: number) => {
  if (dt <= 0) return cur;
  const omega = 2 / Math.max(0.0001, smooth);
  const x = omega * dt;
  const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  const change = cur - target;
  const temp = (vel.v + omega * change) * dt;
  vel.v = (vel.v - omega * temp) * exp;
  let out = target + (change + temp) * exp;
  if ((target - cur > 0) === (out > target)) {
    out = target;
    vel.v = 0;
  }
  return out;
};

function ringTexture(): CanvasTexture {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(128, 128, 96, 128, 128, 128);
  g.addColorStop(0, "rgba(255,138,60,0)");
  g.addColorStop(0.72, "rgba(255,138,60,0.0)");
  g.addColorStop(0.9, "rgba(255,138,60,0.85)");
  g.addColorStop(0.96, "rgba(255,138,60,0.18)");
  g.addColorStop(1, "rgba(255,138,60,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

const createShowroom: SceneFactory = ({ canvas, host }) => {
  let api: Partial<ShowroomApi> = {};
  const ctl = createStage({ canvas, host, env: "showroom", fov: 25, exposure: 1.06, background: "#0e171f", maxPixelRatio: Math.min(window.innerWidth < 700 ? 1.5 : 1.75, window.devicePixelRatio || 1) }, (stage) => {
    const { scene, camera, steels, mobile } = stage;
    camera.far = 900;
    camera.near = 1;
    camera.updateProjectionMatrix();
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const geos: BufferGeometry[] = [];
    const mats: Material[] = [];
    const texs: CanvasTexture[] = [];
    const own = <T extends { geos: BufferGeometry[]; textures?: CanvasTexture[] }>(p: T) => {
      geos.push(...p.geos);
      if (p.textures) texs.push(...p.textures);
      return p;
    };

    /* ------------------------------------------------------------ surfaces */
    const aniso = stage.renderer.capabilities.getMaxAnisotropy();
    // The display surface's grain is sized in world units (extruded faces carry 1 uv = 1 unit): broad and soft,
    // so it never beats against the pixel grid.
    const floorGrain = grainTexture(aniso, { cells: [9, 31, 96], seed: 53, base: 0.56, amp: 0.16 });
    floorGrain.repeat.set(0.045, 0.045);
    const slabMat = new MeshPhysicalMaterial({
      color: new Color("#090e14"),
      metalness: 0.1,
      // Fully matte, and no roughness map: a map would multiply this down and turn the low edge lights into a
      // blotchy sheen across the surface at product-level views.
      roughness: 0.96,
      bumpMap: floorGrain,
      bumpScale: 0.02,
      // No clearcoat: a glossy surface throws the low edge lights back as a sheet of glare at product-level views.
      envMapIntensity: 0.3,
    });
    const platMat = slabMat.clone();
    platMat.color = new Color("#0f1820");
    mats.push(slabMat, platMat);

    const rounded = (w: number, d: number, r: number) => {
      const s = new Shape();
      s.moveTo(-w / 2 + r, -d / 2);
      s.lineTo(w / 2 - r, -d / 2);
      s.quadraticCurveTo(w / 2, -d / 2, w / 2, -d / 2 + r);
      s.lineTo(w / 2, d / 2 - r);
      s.quadraticCurveTo(w / 2, d / 2, w / 2 - r, d / 2);
      s.lineTo(-w / 2 + r, d / 2);
      s.quadraticCurveTo(-w / 2, d / 2, -w / 2, d / 2 - r);
      s.lineTo(-w / 2, -d / 2 + r);
      s.quadraticCurveTo(-w / 2, -d / 2, -w / 2 + r, -d / 2);
      return s;
    };
    const block = (w: number, d: number, h: number, y: number, z: number, mat: Material) => {
      const g = new ExtrudeGeometry(rounded(w, d, 3), { depth: h, bevelEnabled: true, bevelSize: 0.5, bevelThickness: 0.5, bevelSegments: 2, curveSegments: 6 });
      g.rotateX(-Math.PI / 2);
      geos.push(g);
      const m = new Mesh(g, mat);
      m.position.set(0, y, z);
      m.receiveShadow = true;
      m.castShadow = true;
      scene.add(m);
      return m;
    };
    // The slab's top face is y = 0 (its body hangs below); the platform stands on it.
    // The surface runs past every edge of the picture and is lost in the fog; only the platform has an edge.
    block(1500, 1100, 4, -4, -80, slabMat);
    block(168, 40, PLATFORM_Y, 0, -48, platMat);

    /* ------------------------------------------------------------ finishes (per product clones) */
    // Fine, restrained grain for rolled and mill steel: one tile per ~3 units on extruded parts, another for rebar.
    const grainWorld = grainTexture(aniso, { cells: [28, 72, 160], seed: 77, base: 0.62, amp: 0.4 });
    grainWorld.repeat.set(0.6, 0.6);
    const grainRebar = grainTexture(aniso, { cells: [12, 40, 110], seed: 91, base: 0.62, amp: 0.5 });
    grainRebar.repeat.set(0.7, 4);
    // Broad, shallow variation for large smooth faces (tube, rolled sections): reads as finish, not as pattern.
    const grainBroad = grainTexture(aniso, { cells: [4, 13, 41, 120], seed: 63, base: 0.6, amp: 0.3 });
    grainBroad.repeat.set(0.09, 0.09);
    texs.push(grainWorld, grainRebar, floorGrain, grainBroad);
    const shadowTex = contactShadowTexture();
    const ringTex = ringTexture();
    texs.push(ringTex);
    const ringGeo = new PlaneGeometry(1, 1);
    geos.push(ringGeo);

    const prods: Prod[] = [];
    const byGroup = new Map<string, Prod>();

    const make = (slug: ShowroomSlug, category: string, build: (t: (src: MeshStandardMaterial, o?: { vertexColors?: boolean; color?: string; rough?: number; bump?: number; grain?: CanvasTexture }) => MeshStandardMaterial) => Group) => {
      const tints: Tint[] = [];
      const tintMat = (src: MeshStandardMaterial, o: { vertexColors?: boolean; color?: string; rough?: number; bump?: number; grain?: CanvasTexture } = {}) => {
        const m = src.clone();
        if (o.color) m.color = new Color(o.color);
        if (o.rough !== undefined) m.roughness = o.rough;
        if (o.vertexColors) m.vertexColors = true;
        if (o.bump !== undefined) m.bumpScale = o.bump;
        if (o.grain) {
          m.roughnessMap = o.grain;
          m.bumpMap = o.grain;
          m.bumpScale = o.bump ?? 0.14;
        }
        mats.push(m);
        tints.push({ m, color: m.color.clone(), env: m.envMapIntensity });
        return m;
      };
      const decals: Prod["decals"] = [];
      const group = build(tintMat);
      const local = new Box3().setFromObject(group);
      const size = local.getSize(new Vector3());
      const centre = local.getCenter(new Vector3());
      // Seat shadows: a tight dark pool and a wider, fainter one.
      for (const [k, o] of [
        [1.12, 0.95],
        [1.7, 0.5],
      ] as const) {
        const c = contactShadow(shadowTex, Math.max(8, size.x * k), Math.max(8, size.z * k), o);
        c.mesh.position.set(centre.x, 0.05, centre.z);
        geos.push(c.geo);
        mats.push(c.mat);
        decals.push({ m: c.mat, o });
        group.add(c.mesh);
      }
      // Highlight ring: a thin warm ellipse laid on the surface under the product.
      const ringMat = new MeshBasicMaterial({ map: ringTex, transparent: true, opacity: 0, depthWrite: false, toneMapped: false });
      mats.push(ringMat);
      const ring = new Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(centre.x, 0.08, centre.z);
      ring.scale.set(Math.max(size.x * 1.2, 14) + 6, Math.max(size.z * 1.2, 14) + 6, 1);
      ring.renderOrder = 2;
      group.add(ring);
      const hitGeo = new BoxGeometry(size.x * 1.08 + 2, size.y * 1.1 + 2, size.z * 1.08 + 2);
      geos.push(hitGeo);
      const hit = new Mesh(hitGeo, new MeshBasicMaterial({ visible: false }));
      hit.visible = false;
      hit.position.copy(centre);
      group.add(hit);
      hit.userData.slug = slug;
      const p: Prod = {
        slug,
        category,
        group,
        tints,
        hit,
        local,
        centre,
        anchor: new Vector3(centre.x, local.max.y + 1.5, centre.z),
        ring,
        weight: 1,
        glow: 0,
        decals,
        hide: false,
        vis: 1,
      };
      prods.push(p);
      byGroup.set(slug, p);
      scene.add(group);
    };

    /* ------------------------------------------------------------ the eleven products */

    // 1. TMT bars: five ribbed bars in a pyramid bundle, two bands.
    make("tmt-bars", "structural-items", (t) => {
      const r = 1.75;
      const L = 40;
      const mat = t(steels.rolled, { color: "#434a51", rough: 0.92, grain: grainRebar, bump: 0.1 });
      const end = t(steels.cut, { color: "#8d9296" });
      const g = new Group();
      const spots: [number, number, number][] = [
        [-2 * r, 0, -0.5],
        [0, 0, 0.6],
        [2 * r, 0, -0.2],
        [-r, r * Math.sqrt(3), 0.3],
        [r, r * Math.sqrt(3), -0.7],
      ];
      for (const [z, y, dx] of spots) {
        const p = own(rebar({ length: L, radius: r, mat, endMat: end }));
        p.object.position.set(-L / 2 + dx, y, z);
        g.add(p.object);
      }
      const centres: [number, number][] = spots.map(([z, y]) => [z, y + r]);
      const band = t(steels.rolled, { color: "#2c3035", rough: 0.55 });
      for (const x of [-L * 0.28, L * 0.2]) {
        const b = own(bundleBand({ centres, radius: r, x, width: 1.7, mat: band }));
        g.add(b.object);
      }
      return g;
    });

    // 2. Bright bars: a range of four diameters, ends staggered like a counter display.
    make("bright-bars", "structural-items", (t) => {
      const mat = t(steels.bright, { color: "#dfe2e4" });
      const end = t(steels.cut, { color: "#c9cdd0", rough: 0.62 });
      end.metalness = 0.85;
      const capGeo = new CircleGeometry(1, 48);
      geos.push(capGeo);
      const g = new Group();
      const radii = [1.1, 1.45, 1.8, 2.2];
      const lens = [30, 33, 29, 32];
      const off = [0.5, -1.2, 0.8, -0.4];
      let z = 0;
      const total = radii.reduce((a, b) => a + b * 2, 0);
      z = -total / 2;
      radii.forEach((r, i) => {
        z += r;
        const p = own(brightBar({ length: lens[i], radius: r, mat }));
        p.object.position.set(-lens[i] / 2 + off[i], 0, z);
        g.add(p.object);
        // A sawn, faced end: flat and satin, so the bar reads as solid stock and not as tube.
        for (const side of [-1, 1]) {
          const c = new Mesh(capGeo, end);
          c.scale.setScalar(r * 0.94);
          c.rotation.y = (side * Math.PI) / 2;
          c.position.set(off[i] + side * (lens[i] / 2 + 0.012), r, z);
          g.add(c);
        }
        z += r;
      });
      return g;
    });

    // 3. MS angles: two sizes side by side, the L-shaped end turned to the viewer by the layout yaw.
    make("ms-angles", "structural-items", (t) => {
      const mat = t(steels.mill, { color: "#5b6269", rough: 0.9, grain: grainBroad, bump: 0.05 });
      const g = new Group();
      const a = own(angleSection({ length: 28, leg: 8.5, thick: 1.0, mat }));
      a.object.rotation.y = Math.PI;
      a.object.position.set(14, 0, -4);
      const b = own(angleSection({ length: 25, leg: 6.5, thick: 0.85, mat }));
      b.object.rotation.y = Math.PI;
      b.object.position.set(11.5, 0, 6.4);
      g.add(a.object, b.object);
      return g;
    });

    // 4. GI pipes: three tubes with real wall thickness, bound with a band, bores toward the viewer.
    make("gi-pipes", "structural-items", (t) => {
      const R = 3.3;
      const L = 30;
      const mat = t(steels.galvanized, { vertexColors: true, color: "#8a9196", rough: 0.68, grain: grainBroad, bump: 0.03 });
      const g = new Group();
      const spots: [number, number][] = [
        [-R, 0],
        [R, 0],
        [0, R * Math.sqrt(3)],
      ];
      spots.forEach(([z, y], i) => {
        const p = own(hollowPipe({ length: L, outer: R, wall: 0.5, mat }));
        p.object.position.set(-L / 2 + (i - 1) * 0.9, y, z);
        g.add(p.object);
      });
      const band = t(steels.rolled, { color: "#2c3035", rough: 0.55 });
      const b = own(bundleBand({ centres: spots.map(([z, y]) => [z, y + R] as [number, number]), radius: R, x: -L * 0.12, width: 1.8, mat: band }));
      g.add(b.object);
      return g;
    });

    // 5. Chain link: a roll of fabric standing on end.
    make("chain-link-fencing", "fencing-material", (t) => {
      const mat = t(steels.galvanized, { vertexColors: true, color: "#8d9499", rough: 0.72 });
      const g = new Group();
      const p = own(chainLinkRoll({ halfHeight: 12.5, innerRadius: 4.6, layerGap: 1.05, turns: 3.7, scale: 1.02, mat }));
      g.add(p.object);
      return g;
    });

    // 6. Barbed wire: a stacked coil of two-strand wire with four-point barbs.
    make("barbed-wire", "fencing-material", (t) => {
      const mat = t(steels.galvanized, { vertexColors: true, color: "#8d9499", rough: 0.72 });
      const g = new Group();
      const p = own(barbedCoil({ turns: 3.4, radius: 6.2, rise: 2.7, scale: 1.5, mat }));
      g.add(p.object);
      return g;
    });

    // 7. Expanded metal: diamond-pattern sheet on two display feet.
    make("expanded-metal-mesh", "wiremesh", (t) => {
      const mat = t(steels.mill, { color: "#555b62", rough: 1, grain: grainWorld, bump: 0.2 });
      const ft = t(steels.rolled, { color: "#262a2f", rough: 0.6 });
      const g = new Group();
      const p = own(expandedPanel({ w: 20, h: 19.6, halfW: 2.0, halfH: 1.22, strand: 0.56, thick: 0.4, mat }));
      p.object.position.y = 1.7;
      g.add(p.object);
      for (const dx of [-7, 7]) {
        const f = foot({ w: 5.4, h: 2.6, d: 3.4, mat: ft });
        f.mesh.position.x = dx;
        geos.push(f.geo);
        g.add(f.mesh);
      }
      return g;
    });

    // 8. Welded mesh: straight rods, a weld at every crossing.
    make("gi-weldmesh", "welded-mesh", (t) => {
      const mat = t(steels.galvanized, { color: "#8a9196", rough: 0.72 });
      const ft = t(steels.rolled, { color: "#262a2f", rough: 0.6 });
      const g = new Group();
      const p = own(weldedPanel({ w: 19.8, h: 19.8, pitch: 3.3, rod: 0.34, mat }));
      p.object.position.y = 1.9;
      g.add(p.object);
      for (const dx of [-7, 7]) {
        const f = foot({ w: 5.4, h: 2.6, d: 3.4, mat: ft });
        f.mesh.position.x = dx;
        geos.push(f.geo);
        g.add(f.mesh);
      }
      return g;
    });

    // 9. Perforated sheet: round holes on a 60 degree stagger.
    make("gi-perforated-sheet", "perforated-sheets", (t) => {
      const mat = t(steels.galvanized, { color: "#868d92", rough: 0.76 });
      const ft = t(steels.rolled, { color: "#262a2f", rough: 0.6 });
      const g = new Group();
      const p = own(uprightPerforated({ w: 20, h: 19.5, thick: 0.34, hole: 0.95, pitch: 1.65, margin: 1.4, mat }));
      p.object.position.y = 1.6;
      g.add(p.object);
      for (const dx of [-7, 7]) {
        const f = foot({ w: 5.4, h: 2.6, d: 3.4, mat: ft });
        f.mesh.position.x = dx;
        geos.push(f.geo);
        g.add(f.mesh);
      }
      return g;
    });

    // 10. GI wire: a bound coil standing on its edge, its bore turned to the viewer.
    make("gi-wire", "wires", (t) => {
      const mat = t(steels.galvanized, { color: "#848b90", rough: 0.7 });
      const g = new Group();
      const p = own(wireCoil({ inner: 5.8, outer: 10.6, height: 6.4, wire: 0.24, mat, seed: 5 }));
      p.object.rotation.x = Math.PI / 2;
      p.object.position.set(0, 10.6, -3.2);
      g.add(p.object);
      return g;
    });

    // 11. GI wire rope: six strands laid round a core, coiled with a free tail.
    make("gi-wire-rope", "wires", (t) => {
      const mat = t(steels.galvanized, { color: "#6f767b", rough: 0.7, bump: 1.1 });
      const bump = ropeGrooveTexture();
      texs.push(bump);
      mat.bumpMap = bump;
      mat.bumpScale = 1.1;
      const core = t(steels.rolled, { color: "#33383d", rough: 0.7 });
      const g = new Group();
      const p = own(wireRopeCoil({ radius: 9.5, diameter: 2.7, turns: 3.2, tail: 9, mat, coreMat: core }));
      g.add(p.object);
      return g;
    });

    // 12. MS flats: a banded stack of flat bar.
    make("ms-flats", "structural-items", (t) => {
      const mat = t(steels.mill, { color: "#565d64", rough: 0.88, grain: grainBroad, bump: 0.05 });
      const band = t(steels.rolled, { color: "#2c3035", rough: 0.55 });
      const g = new Group();
      const L = 30;
      const W = 5.2;
      const T = 0.85;
      const flat = new BoxGeometry(L, T, W);
      const strap = new BoxGeometry(1.5, T * 4 + 0.5, W + 0.5);
      geos.push(flat, strap);
      [0.4, -0.7, 0.9, -0.2].forEach((dx, i) => {
        const m = new Mesh(flat, mat);
        m.position.set(dx, T / 2 + i * (T + 0.04), (i % 2 ? 0.18 : -0.12));
        m.castShadow = m.receiveShadow = true;
        g.add(m);
      });
      for (const x of [-8.5, 7.5]) {
        const m = new Mesh(strap, band);
        m.position.set(x, (T * 4 + 0.3) / 2, 0);
        m.castShadow = true;
        g.add(m);
      }
      return g;
    });

    // 13. MS round bars: black hot-rolled rounds in a small pyramid.
    make("ms-round-bars", "structural-items", (t) => {
      const mat = t(steels.mill, { color: "#4b5258", rough: 0.8, grain: grainBroad, bump: 0.04 });
      const end = t(steels.cut, { color: "#9da2a6", rough: 0.7 });
      const capGeo = new CircleGeometry(1, 40);
      geos.push(capGeo);
      const g = new Group();
      const r = 1.55;
      const L = 28;
      const spots: [number, number, number][] = [
        [-2 * r, 0, 0.6],
        [0, 0, -0.5],
        [2 * r, 0, 0.3],
        [-r, r * Math.sqrt(3), -0.3],
        [r, r * Math.sqrt(3), 0.8],
      ];
      for (const [z, y, dx] of spots) {
        const p = own(brightBar({ length: L, radius: r, mat }));
        p.object.position.set(-L / 2 + dx, y, z);
        g.add(p.object);
        for (const side of [-1, 1]) {
          const c = new Mesh(capGeo, end);
          c.scale.setScalar(r * 0.94);
          c.rotation.y = (side * Math.PI) / 2;
          c.position.set(dx + side * (L / 2 + 0.012), y + r, z);
          g.add(c);
        }
      }
      return g;
    });

    // 14. GI wire mesh: fine woven cloth, every crossing over and under.
    make("gi-wiremesh", "wiremesh", (t) => {
      const mat = t(steels.galvanized, { color: "#8f969b", rough: 0.7 });
      const ft = t(steels.rolled, { color: "#262a2f", rough: 0.6 });
      const g = new Group();
      const p = own(wovenPanel({ w: 20, h: 18.6, pitch: 1.15, wire: 0.13, mat }));
      p.object.position.y = 1.9;
      g.add(p.object);
      for (const dx of [-7, 7]) {
        const f = foot({ w: 5.4, h: 2.6, d: 3.4, mat: ft });
        f.mesh.position.x = dx;
        geos.push(f.geo);
        g.add(f.mesh);
      }
      return g;
    });

    // 15. Binding wire: two small coils of soft black annealed wire, one resting on the other.
    make("binding-wire", "wires", (t) => {
      const mat = t(steels.rolled, { color: "#33383d", rough: 0.5 });
      mat.metalness = 0.9;
      mat.bumpScale = 0.1;
      const g = new Group();
      const a = own(wireCoil({ inner: 3.4, outer: 6.6, height: 3.2, wire: 0.15, mat, seed: 9 }));
      const b = own(wireCoil({ inner: 3.2, outer: 6.2, height: 3.0, wire: 0.15, mat, seed: 14 }));
      b.object.position.set(0.9, 3.25, -0.5);
      b.object.rotation.y = 1.1;
      g.add(a.object, b.object);
      return g;
    });

    // 16. Concertina wire: an open coil of razor wire lying on its side.
    make("concertina-wire", "wires", (t) => {
      const mat = t(steels.galvanized, { color: "#939a9f", rough: 0.62 });
      const g = new Group();
      const R = 8;
      const L = 19;
      const loops = 7;
      const N = loops * 56;
      const pts: Vector3[] = [];
      for (let i = 0; i <= N; i++) {
        const a = (i / N) * loops * Math.PI * 2;
        pts.push(new Vector3((i / N - 0.5) * L, R + 0.3 - Math.cos(a) * R, Math.sin(a) * R));
      }
      const curve = new CatmullRomCurve3(pts);
      const wire = new TubeGeometry(curve, N, 0.21, 6, false);
      const blade = new BoxGeometry(1.05, 0.09, 2.3);
      geos.push(wire, blade);
      const core = new Mesh(wire, mat);
      core.castShadow = core.receiveShadow = true;
      g.add(core);
      const count = Math.floor(curve.getLength() / 3.4);
      const blades = new InstancedMesh(blade, mat, count);
      const o = new Object3D();
      const tan = new Vector3();
      for (let i = 0; i < count; i++) {
        const u = (i + 0.5) / count;
        curve.getPointAt(u, o.position);
        curve.getTangentAt(u, tan);
        o.lookAt(tan.add(o.position));
        o.rotateZ(i * 1.9);
        o.updateMatrix();
        blades.setMatrixAt(i, o.matrix);
      }
      blades.instanceMatrix.needsUpdate = true;
      blades.frustumCulled = false;
      blades.castShadow = true;
      g.add(blades);
      return g;
    });

    /* ------------------------------------------------------------ layout */
    let compact = false;
    const place = () => {
      const table = compact ? COMPACT : WIDE;
      for (const p of prods) {
        const s = table[p.slug];
        p.group.position.set(s.x, s.onPlatform ? PLATFORM_Y : 0, s.z);
        p.group.rotation.y = s.yaw;
        p.group.updateMatrixWorld(true);
      }
    };

    /* ------------------------------------------------------------ lights */
    scene.fog = new Fog("#0e171f", 200, 520);
    const hemi = new HemisphereLight("#5d7391", "#05080b", 0.4);
    const key = new DirectionalLight("#e6eeff", 3.0);
    key.position.set(-60, 92, 64);
    key.target.position.set(0, 0, -6);
    key.castShadow = true;
    key.shadow.mapSize.set(mobile ? 1536 : 2560, mobile ? 1536 : 2560);
    const sc = key.shadow.camera;
    sc.left = -95;
    sc.right = 95;
    sc.top = 75;
    sc.bottom = -75;
    sc.near = 20;
    sc.far = 260;
    key.shadow.bias = -0.0004;
    key.shadow.normalBias = 0.06;
    key.shadow.radius = 4;
    const fill = new DirectionalLight("#fff0e0", 0.55);
    fill.position.set(70, 28, 90);
    // Warm edge light: low and from behind, so it catches standing edges and round flanks and barely grazes the
    // surface. An accent on the steel, not a wash over the room.
    const rim = new DirectionalLight("#ff8a3c", 2.4);
    rim.position.set(96, 11, -84);
    rim.target.position.set(0, 4, -10);
    const rimCool = new DirectionalLight("#a8c6ff", 0.9);
    rimCool.position.set(-84, 34, -66);
    // A wide, soft pool over the collection: the slab falls away to black at the edges.
    const pool = new SpotLight("#fff1de", 3.0, 0, 0.62, 1, 0);
    pool.position.set(-8, 150, 70);
    pool.target.position.set(6, 0, -4);
    // A narrow spot that settles on whichever product is in focus.
    const follow = new SpotLight("#fff3e2", 0, 0, 0.16, 1, 0);
    follow.position.set(-10, 120, 60);
    const followAt = new Vector3();
    scene.add(hemi, key, key.target, fill, rim, rim.target, rimCool, pool, pool.target, follow, follow.target);

    /* ------------------------------------------------------------ camera */
    const cur = { tx: 0, ty: 4, tz: 0, az: 0, el: 0.4, dist: 200 };
    const vel = { tx: { v: 0 }, ty: { v: 0 }, tz: { v: 0 }, az: { v: 0 }, el: { v: 0 }, dist: { v: 0 } };
    type Goal = typeof cur;
    let goal: Goal = { ...cur };
    let goalDirty = true;
    let introLeft = 0;
    let smooth = 0.9;

    let hoverSlug: string | null = null;
    let selectedSlug: ShowroomSlug | null = null;
    let groupSlug: string | null = null;
    let orbit = 0;
    let projectCb: ((p: LabelPoint) => void) | null = null;
    let lastLabel = "";

    const tmpCam = camera.clone();
    const corners = (b: Box3) => {
      const pts: Vector3[] = [];
      for (const x of [b.min.x, b.max.x]) for (const y of [b.min.y, b.max.y]) for (const z of [b.min.z, b.max.z]) pts.push(new Vector3(x, y, z));
      return pts;
    };
    // The ring and shadow decals live in the group too; measure the product itself from its own local box.
    const productBox = (p: Prod) => {
      const b = p.local.clone();
      b.applyMatrix4(p.group.matrixWorld);
      return b;
    };

    /** Smallest distance at which all points sit inside the central `fill` fraction of the view. */
    const fitDist = (pts: Vector3[], target: Vector3, az: number, el: number, fillX: number, fillY: number) => {
      tmpCam.aspect = camera.aspect;
      tmpCam.fov = camera.fov;
      tmpCam.near = camera.near;
      tmpCam.far = camera.far;
      tmpCam.updateProjectionMatrix();
      const v = new Vector3();
      let lo = 15;
      let hi = 900;
      for (let i = 0; i < 18; i++) {
        const d = (lo + hi) / 2;
        tmpCam.position.set(target.x + Math.sin(az) * Math.cos(el) * d, target.y + Math.sin(el) * d, target.z + Math.cos(az) * Math.cos(el) * d);
        tmpCam.lookAt(target);
        tmpCam.updateMatrixWorld(true);
        tmpCam.matrixWorldInverse.copy(tmpCam.matrixWorld).invert();
        let ok = true;
        for (const p of pts) {
          v.copy(p).applyMatrix4(tmpCam.matrixWorldInverse).applyMatrix4(tmpCam.projectionMatrix);
          if (Math.abs(v.x) > fillX || Math.abs(v.y) > fillY) {
            ok = false;
            break;
          }
        }
        if (ok) hi = d;
        else lo = d;
      }
      return hi;
    };

    /** Screen-space bounds (NDC) and nearest view depth of a set of points, seen from tmpCam. */
    const screenRect = (pts: Vector3[]) => {
      const v = new Vector3();
      const r = { x0: Infinity, x1: -Infinity, y0: Infinity, y1: -Infinity, near: Infinity };
      for (const p of pts) {
        v.copy(p).applyMatrix4(tmpCam.matrixWorldInverse);
        r.near = Math.min(r.near, -v.z);
        v.applyMatrix4(tmpCam.projectionMatrix);
        r.x0 = Math.min(r.x0, v.x);
        r.x1 = Math.max(r.x1, v.x);
        r.y0 = Math.min(r.y0, v.y);
        r.y1 = Math.max(r.y1, v.y);
      }
      return r;
    };

    const computeGoal = () => {
      const aspect = stage.size.aspect;
      const all = prods.map(productBox);
      const sel = selectedSlug ? byGroup.get(selectedSlug) : null;
      const grp = !sel && groupSlug ? prods.filter((p) => p.category === groupSlug) : [];
      if (sel) {
        const v = VIEW[sel.slug];
        const b = productBox(sel);
        const c = b.getCenter(new Vector3());
        let az: number;
        if (v.az === "end") {
          // Look down the product's length from the end that faces the viewer.
          const yaw = sel.group.rotation.y;
          const dx = Math.cos(yaw);
          const dz = -Math.sin(yaw);
          const s = dz >= 0 ? 1 : -1;
          az = Math.atan2(dx * s, dz * s) + (v.off ?? 0.4) * (dx * s > 0 ? -1 : 1);
        } else {
          az = sel.group.rotation.y + v.az;
        }
        az += orbit;
        const fill = aspect < 1.1 ? 0.8 : 0.7;
        goal = { tx: c.x, ty: c.y, tz: c.z, az, el: v.el + (aspect < 1.1 ? 0.12 : 0), dist: fitDist(corners(b), c, az, v.el, fill, fill * 0.95) };
        // Anything that would stand between this camera and the product steps out of the picture.
        tmpCam.position.set(c.x + Math.sin(az) * Math.cos(goal.el) * goal.dist, c.y + Math.sin(goal.el) * goal.dist, c.z + Math.cos(az) * Math.cos(goal.el) * goal.dist);
        tmpCam.lookAt(c);
        tmpCam.updateMatrixWorld(true);
        tmpCam.matrixWorldInverse.copy(tmpCam.matrixWorld).invert();
        const mine = screenRect(corners(b));
        for (const p of prods) {
          if (p === sel) {
            p.hide = false;
            continue;
          }
          const r = screenRect(corners(productBox(p)));
          const pad = 0.06;
          p.hide = r.near < goal.dist && r.x0 < mine.x1 + pad && r.x1 > mine.x0 - pad && r.y0 < mine.y1 + pad && r.y1 > mine.y0 - pad;
        }
      } else if (grp.length) {
        const b = new Box3();
        grp.forEach((p) => b.union(productBox(p)));
        const c = b.getCenter(new Vector3());
        // High enough that the rows in front do not stand across the group, loose enough to keep its neighbours.
        const el = aspect < 1.1 ? 0.62 : 0.6;
        goal = { tx: c.x, ty: c.y, tz: c.z, az: 0, el, dist: fitDist(grp.map(productBox).flatMap(corners), c, 0, el, aspect < 1.1 ? 0.74 : 0.56, 0.6) };
      } else {
        const b = new Box3();
        all.forEach((x) => b.union(x));
        const c = b.getCenter(new Vector3());
        c.y = 4;
        const el = aspect < 1.1 ? 0.6 : 0.56;
        goal = { tx: c.x, ty: c.y, tz: c.z + 2, az: 0, el, dist: fitDist(all.flatMap(corners), c, 0, el, aspect < 1.1 ? 0.96 : 0.85, 0.92) };
      }
      goalDirty = false;
    };

    /* ------------------------------------------------------------ frame update */
    const raycaster = new Raycaster();
    const v3 = new Vector3();
    let lastAspect = -1;
    let started = false;
    let pointerGain = reduced ? 0 : 1;
    let shift = 0; // 0 = collection, 1 = a product is selected: slide the picture clear of the info panel

    const emphasis = (p: Prod) => {
      if (selectedSlug) return p.slug === selectedSlug ? 1.1 : 0.18;
      if (hoverSlug) return p.slug === hoverSlug ? 1.16 : groupSlug && p.category === groupSlug ? 0.92 : 0.8;
      if (groupSlug) return p.category === groupSlug ? 1.04 : 0.32;
      return 1;
    };
    const glowTarget = (p: Prod) => (p.slug === hoverSlug || p.slug === selectedSlug ? 1 : 0);

    const update = (dt: number) => {
      const aspect = stage.size.aspect;
      if (aspect !== lastAspect) {
        lastAspect = aspect;
        const want = aspect < 1.12;
        if (want !== compact || !started) {
          compact = want;
          place();
        }
        goalDirty = true;
      }
      if (goalDirty) computeGoal();
      if (!started) {
        started = true;
        // Entry reveal: begin a little wider, lower and turned, and settle into the collection.
        if (!reduced) {
          cur.tx = goal.tx;
          cur.ty = goal.ty - 3;
          cur.tz = goal.tz;
          cur.az = goal.az - 0.3;
          cur.el = goal.el * 0.72;
          cur.dist = goal.dist * 1.12;
          introLeft = 1;
          smooth = 0.6;
        } else Object.assign(cur, goal);
      }
      const k = dt === 0 ? 1 : 1 - Math.exp(-dt * 9);
      let moving = false;
      const sm = smooth;
      for (const key_ of ["tx", "ty", "tz", "az", "el", "dist"] as const) {
        if (reduced) cur[key_] = goal[key_];
        else cur[key_] = smoothDamp(cur[key_], goal[key_], vel[key_], sm, dt);
        if (Math.abs(cur[key_] - goal[key_]) > (key_ === "dist" ? 0.02 : 0.0015) || Math.abs(vel[key_].v) > 0.0008) moving = true;
      }
      if (!moving && smooth !== 0.7) smooth = 0.7;
      if (introLeft > 0 && !moving) introLeft = 0;

      const px = stage.pointer.x * pointerGain;
      const py = stage.pointer.y * pointerGain;
      const sel = !!selectedSlug;
      const az = cur.az + px * (sel ? 0.05 : 0.085);
      const el = cur.el - py * (sel ? 0.018 : 0.03);
      camera.position.set(cur.tx + Math.sin(az) * Math.cos(el) * cur.dist, cur.ty + Math.sin(el) * cur.dist, cur.tz + Math.cos(az) * Math.cos(el) * cur.dist);
      camera.lookAt(cur.tx, cur.ty, cur.tz);
      camera.updateMatrixWorld();
      const wantShift = selectedSlug ? 1 : 0;
      shift = reduced ? wantShift : shift + (wantShift - shift) * k;
      if (Math.abs(wantShift - shift) > 0.003) moving = true;
      else shift = wantShift;
      {
        // On a wide stage the picture rests a little right of centre, clear of the headline that overlaps the
        // stage's left edge; with a product selected it slides the other way, clear of the info panel.
        const { w, h } = stage.size;
        const narrow = stage.size.aspect < 1.1;
        const ox = narrow ? 0 : w * (REST_SHIFT + (SEL_SHIFT - REST_SHIFT) * shift);
        const oy = h * (narrow ? 0.15 * shift : REST_DROP + (0.05 - REST_DROP) * shift);
        if (Math.abs(ox) > 0.5 || Math.abs(oy) > 0.5) camera.setViewOffset(w, h, ox, oy, w, h);
        else if (camera.view?.enabled) camera.clearViewOffset();
      }
      const fog = scene.fog as Fog;
      fog.near = cur.dist + 45;
      fog.far = cur.dist + 330;

      for (const p of prods) {
        const w = emphasis(p);
        const g = glowTarget(p);
        p.weight += (w - p.weight) * k;
        p.glow += (g - p.glow) * k;
        if (Math.abs(w - p.weight) > 0.004 || Math.abs(g - p.glow) > 0.004) moving = true;
        else {
          p.weight = w;
          p.glow = g;
        }
        for (const t of p.tints) {
          t.m.color.copy(t.color).multiplyScalar(p.weight);
          t.m.envMapIntensity = t.env * Math.pow(Math.min(1.2, p.weight), 1.7);
        }
        const visT = selectedSlug && p.hide ? 0 : 1;
        p.vis += (visT - p.vis) * k;
        if (Math.abs(visT - p.vis) > 0.004) moving = true;
        else p.vis = visT;
        const solid = p.vis > 0.999;
        for (const t of p.tints) {
          t.m.transparent = !solid;
          t.m.opacity = p.vis;
        }
        for (const d of p.decals) d.m.opacity = d.o * p.vis;
        p.group.visible = p.vis > 0.01;
        (p.ring.material as MeshBasicMaterial).opacity = p.glow * 0.95;
        p.ring.visible = p.glow > 0.01;
      }

      {
        const f = (selectedSlug ? byGroup.get(selectedSlug) : hoverSlug ? byGroup.get(hoverSlug as ShowroomSlug) : null) ?? null;
        if (f) {
          followAt.copy(f.centre);
          f.group.localToWorld(followAt);
          if (follow.intensity < 0.05) follow.target.position.copy(followAt);
          else follow.target.position.lerp(followAt, k);
          follow.position.set(follow.target.position.x - 14, 120, follow.target.position.z + 62);
        }
        const want = f ? 3.2 : 0;
        follow.intensity += (want - follow.intensity) * k;
        if (Math.abs(want - follow.intensity) > 0.02) moving = true;
        else follow.intensity = want;
      }

      if (projectCb) {
        const p = hoverSlug && !selectedSlug ? byGroup.get(hoverSlug as ShowroomSlug) : null;
        if (p) {
          v3.copy(p.anchor);
          p.group.localToWorld(v3);
          v3.project(camera);
          const x = (v3.x * 0.5 + 0.5) * stage.size.w;
          const y = (-v3.y * 0.5 + 0.5) * stage.size.h;
          const sig = `${p.slug}:${x.toFixed(1)}:${y.toFixed(1)}`;
          if (sig !== lastLabel) {
            lastLabel = sig;
            projectCb({ slug: p.slug, x, y });
          }
        } else if (lastLabel !== "") {
          lastLabel = "";
          projectCb(null);
        }
      }
      return moving || introLeft > 0;
    };

    api = {
      setGroup(category) {
        if (groupSlug === category) return;
        groupSlug = category && prods.some((p) => p.category === category) ? category : null;
        goalDirty = true;
        smooth = 0.7;
        stage.invalidate();
      },
      select(slug) {
        const next = slug && byGroup.has(slug as ShowroomSlug) ? (slug as ShowroomSlug) : null;
        if (next === selectedSlug) return;
        selectedSlug = next;
        orbit = 0;
        goalDirty = true;
        smooth = 0.75;
        stage.invalidate();
      },
      orbit(d) {
        if (!selectedSlug) return;
        orbit = Math.max(-1.5, Math.min(1.5, orbit + d));
        goalDirty = true;
        smooth = 0.28;
        stage.invalidate();
      },
      hover(slug) {
        if (hoverSlug === slug) return;
        hoverSlug = slug;
        stage.invalidate();
      },
      pick(cx, cy) {
        const r = canvas.getBoundingClientRect();
        if (r.width < 2 || r.height < 2) return null;
        const ndc = new Vector2(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1);
        if (Math.abs(ndc.x) > 1 || Math.abs(ndc.y) > 1) return null;
        raycaster.setFromCamera(ndc, camera);
        const hit = raycaster.intersectObjects(
          prods.filter((p) => p.vis > 0.5).map((p) => p.hit),
          false
        )[0];
        return hit ? (hit.object.userData.slug as string) : null;
      },
      onProject(cb) {
        projectCb = cb;
      },
      snap() {
        if (goalDirty) computeGoal();
        Object.assign(cur, goal);
        shift = selectedSlug ? 1 : 0;
        for (const k_ of Object.keys(vel) as (keyof typeof vel)[]) vel[k_].v = 0;
        introLeft = 0;
        stage.invalidate();
      },
    };

    return {
      update(dt) {
        return update(dt);
      },
      resize() {
        goalDirty = true;
      },
      focus(key_) {
        if (key_ && byGroup.has(key_ as ShowroomSlug)) {
          selectedSlug = key_ as ShowroomSlug;
          groupSlug = null;
        } else {
          selectedSlug = null;
          groupSlug = key_ && prods.some((p) => p.category === key_) ? key_ : null;
        }
        goalDirty = true;
      },
      settle() {
        if (goalDirty) computeGoal();
        Object.assign(cur, goal);
        shift = selectedSlug ? 1 : 0;
        for (const k_ of Object.keys(vel) as (keyof typeof vel)[]) vel[k_].v = 0;
        introLeft = 0;
      },
      lowerQuality() {
        key.castShadow = false;
      },
      dispose() {
        geos.forEach((g) => g.dispose());
        mats.forEach((m) => m.dispose());
        texs.forEach((t) => t.dispose());
        shadowTex.dispose();
        key.shadow.map?.dispose();
        scene.clear();
      },
    };
  });
  return Object.assign(ctl, api) as ShowroomApi;
};

export default createShowroom;
