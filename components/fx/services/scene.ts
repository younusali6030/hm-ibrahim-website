import {
  BoxGeometry,
  BufferGeometry,
  CanvasTexture,
  Color,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  Euler,
  Float32BufferAttribute,
  Fog,
  Group,
  HemisphereLight,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  Quaternion,
  SRGBColorSpace,
  TorusGeometry,
  Vector3,
  type Material,
} from "three";
import { createStage, type SceneFactory } from "../three/stage";
import { contactShadowTexture, grainTexture } from "../three/shared";
import { contactShadow, ribbedBar } from "../three/parts";

/**
 * "Your order, from list to collection." One fixed view of a work table: the order sheet on a clipboard, and the
 * three kinds of material on it (a welded mesh roll, a coil of wire, a few TMT bars). Units are centimetres and
 * the pieces keep their real proportions to the A4 clipboard.
 *
 * The four focus keys are the four steps. `list` and `check` show the material loose on the table; `prepare` and
 * `handover` slide it together and strap it. Nothing is written in the textures: the page lays its own HTML over
 * the picture, at the anchor points this scene reports through the `scene-anchors` event.
 */

type Step = "list" | "check" | "prepare" | "handover";

const BG = "#0e161e";

type Look = { key: number; mats: number; clip: number };
type Num = keyof Look;

/** Per step: key light, how much the metal is held back, how much the clipboard is. */
const LOOKS: Record<Step, Look> = {
  list: { key: 0.7, mats: 0.34, clip: 1 },
  check: { key: 1.8, mats: 1, clip: 1 },
  prepare: { key: 1.7, mats: 1, clip: 0.66 },
  handover: { key: 1.5, mats: 1.1, clip: 0.42 },
};
const NUMS: Num[] = ["key", "mats", "clip"];

/**
 * Points the page needs on screen: where the clipboard and the prepared order are (its HTML is tied to them),
 * and the middle of the loose material and of the prepared order (its focus shade follows them).
 */
const ANCHORS: Record<string, [number, number, number]> = {
  list: [-37, 0.5, 2],
  sheet: [-40, 0, 18],
  loose: [18, 4, -2],
  order: [12, 0.5, -3],
  group: [20, 5, -20],
};

const seeded = (seed: number) => {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
};

/** Order sheet: ruled rows with an empty box at the start of each. Lines only, no invented text or figures. */
function sheetTexture(maxAniso: number) {
  const W = 512;
  const H = 724;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d")!;
  g.fillStyle = "#ebe7dd";
  g.fillRect(0, 0, W, H);
  g.fillStyle = "#2a3139";
  g.fillRect(40, 44, 210, 22);
  g.fillStyle = "#8b9199";
  g.fillRect(40, 78, 130, 9);
  const widths = [330, 290, 360, 250, 320, 300, 340, 270, 310, 230];
  for (let i = 0; i < 10; i++) {
    const y = 150 + i * 52;
    g.strokeStyle = "#6e7680";
    g.lineWidth = 2.5;
    g.strokeRect(40, y - 18, 22, 22);
    g.fillStyle = "#4a525c";
    g.fillRect(84, y - 10, widths[i], 7);
    g.strokeStyle = "#cfcbbf";
    g.lineWidth = 1.5;
    g.beginPath();
    g.moveTo(40, y + 12);
    g.lineTo(W - 40, y + 12);
    g.stroke();
  }
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = Math.min(8, maxAniso);
  return t;
}

/** Tick marks over the boxes, drawn in the shop's orange: "we have checked these". */
function tickTexture() {
  const W = 512;
  const H = 724;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d")!;
  g.strokeStyle = "#f97316";
  g.lineWidth = 9;
  g.lineCap = "round";
  g.lineJoin = "round";
  for (let i = 0; i < 6; i++) {
    const y = 150 + i * 52;
    g.beginPath();
    g.moveTo(38, y - 8);
    g.lineTo(52, y + 6);
    g.lineTo(84, y - 34);
    g.stroke();
  }
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

/** A blank collection tag: paper, an orange band and a punched hole. */
function tagTexture() {
  const W = 256;
  const H = 160;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d")!;
  g.fillStyle = "#e9e2cf";
  g.fillRect(0, 0, W, H);
  g.fillStyle = "#f97316";
  g.fillRect(0, 0, W, 34);
  g.fillStyle = "#1c232b";
  g.beginPath();
  g.arc(26, 96, 9, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#8b9199";
  for (let i = 0; i < 3; i++) g.fillRect(60, 68 + i * 26, 150 - i * 24, 6);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

/** A flat strap following a closed outline given in (z, y), `width` wide along x. */
function bandGeometry(outline: [number, number][], width: number) {
  const pos: number[] = [];
  const idx: number[] = [];
  const n = outline.length;
  for (let i = 0; i <= n; i++) {
    const [z, y] = outline[i % n];
    pos.push(-width / 2, y, z, width / 2, y, z);
  }
  for (let i = 0; i < n; i++) {
    const a = i * 2;
    idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/** Convex hull of a set of circles in (z, y): the path a strap takes around a pack of round bars. */
function hullOfCircles(circles: [number, number][], r: number): [number, number][] {
  type P = [number, number];
  const pts: P[] = [];
  for (const [cz, cy] of circles)
    for (let i = 0; i < 28; i++) {
      const a = (i / 28) * Math.PI * 2;
      pts.push([cz + Math.cos(a) * r, Math.max(0.04, cy + Math.sin(a) * r)]);
    }
  pts.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: P, a: P, b: P) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const half = (list: P[]) => {
    const out: P[] = [];
    for (const pt of list) {
      while (out.length >= 2 && cross(out[out.length - 2], out[out.length - 1], pt) <= 0) out.pop();
      out.push(pt);
    }
    return out.slice(0, -1);
  };
  return half(pts).concat(half(pts.slice().reverse()));
}

const createServicesScene: SceneFactory = ({ canvas, host }) =>
  createStage({ canvas, host, env: "bench", fov: 24, exposure: 1.1, background: BG }, (stage) => {
    const { scene, camera, steels, mobile } = stage;
    const aniso = stage.renderer.capabilities.getMaxAnisotropy();
    const geos: BufferGeometry[] = [];
    const mats: Material[] = [];
    const textures: CanvasTexture[] = [];
    const track = <M extends Material>(m: M) => (mats.push(m), m);
    const keep = <G extends BufferGeometry>(g: G) => (geos.push(g), g);

    // Own copies of the shared finishes, so the material can be held back while the list is the subject.
    const zinc = track(steels.galvanized.clone());
    const bar = track(steels.rolled.clone());
    const cut = track(steels.cut.clone());
    const metals = [zinc, bar, cut];
    const metalBase = metals.map((m) => m.envMapIntensity);

    // The table: matte, fine-grained, a shade lighter than the page it fades into.
    const tableGrain = grainTexture(aniso, { cells: [20, 56, 128], seed: 41, base: 0.62, amp: 0.3 });
    tableGrain.repeat.set(12, 9);
    textures.push(tableGrain);
    const tableMat = track(
      new MeshStandardMaterial({ color: "#161e27", metalness: 0, roughness: 1, roughnessMap: tableGrain, bumpMap: tableGrain, bumpScale: 0.12, envMapIntensity: 0.45 })
    );
    const counter = new Mesh(keep(new PlaneGeometry(900, 700)), tableMat);
    counter.rotation.x = -Math.PI / 2;
    counter.receiveShadow = true;
    scene.add(counter);
    const fog = new Fog(BG, 200, 420);
    scene.fog = fog;

    const world = new Group();
    scene.add(world);
    const shadowTex = contactShadowTexture();
    const pools: { geo: BufferGeometry; mat: Material }[] = [];
    const pool = (parent: Group, w: number, d: number, o = 0.75) => {
      const c = contactShadow(shadowTex, w, d, o);
      parent.add(c.mesh);
      pools.push({ geo: c.geo, mat: c.mat });
      return c.mesh;
    };

    // --- Clipboard with the order sheet (A4 on a hardboard back).
    const clip = new Group();
    const boardBase = new Color("#5a4633");
    const boardMat = track(new MeshStandardMaterial({ color: boardBase, roughness: 0.82, metalness: 0 }));
    const board = new Mesh(keep(new BoxGeometry(23.5, 0.4, 33)), boardMat);
    board.position.y = 0.2;
    board.castShadow = board.receiveShadow = true;
    clip.add(board);
    const sheetTex = sheetTexture(aniso);
    const tickTex = tickTexture();
    textures.push(sheetTex, tickTex);
    const sheetGeo = keep(new PlaneGeometry(21, 29.7));
    const sheetMat = track(new MeshStandardMaterial({ map: sheetTex, roughness: 0.94, metalness: 0 }));
    const sheet = new Mesh(sheetGeo, sheetMat);
    sheet.rotation.x = -Math.PI / 2;
    sheet.position.set(0, 0.43, 0.8);
    sheet.receiveShadow = true;
    clip.add(sheet);
    const tickMat = track(new MeshBasicMaterial({ map: tickTex, transparent: true, opacity: 0, depthWrite: false }));
    const ticks = new Mesh(sheetGeo, tickMat);
    ticks.rotation.x = -Math.PI / 2;
    ticks.position.set(0, 0.46, 0.8);
    clip.add(ticks);
    const clipTop = new Mesh(keep(new BoxGeometry(9, 0.9, 2.6)), zinc);
    clipTop.position.set(0, 0.85, -14.6);
    clipTop.castShadow = true;
    clip.add(clipTop);
    pool(clip, 31, 41, 0.6);
    clip.position.set(-40, 0, 18);
    clip.rotation.y = 0.22;
    world.add(clip);

    // --- Welded mesh roll: four wraps, each a row of hoops with straight line wires welded inside them.
    const R = 10;
    const L = 44;
    const WIRE = 0.17;
    const PITCH = 4;
    const roll = new Group();
    const rollBody = new Group();
    rollBody.position.y = R + WIRE;
    roll.add(rollBody);
    const m4 = new Matrix4();
    const q = new Quaternion();
    const e = new Euler();
    const one = new Vector3(1, 1, 1);
    const rr = seeded(21);
    const lineGeo = keep(new CylinderGeometry(WIRE, WIRE, L + PITCH * 0.5, 6, 1, false));
    const hoops = Math.round(L / PITCH) + 1;
    for (let k = 0; k < 4; k++) {
      const r = R - k * 0.78;
      const shift = (rr() - 0.5) * 1.2;
      const hoop = new InstancedMesh(keep(new TorusGeometry(r, WIRE, 6, 64)), zinc, hoops);
      q.setFromEuler(e.set(0, Math.PI / 2, 0));
      for (let i = 0; i < hoops; i++) {
        m4.compose(new Vector3(-L / 2 + i * PITCH + shift, 0, 0), q, one);
        hoop.setMatrixAt(i, m4);
      }
      const count = Math.round((2 * Math.PI * r) / PITCH);
      const lines = new InstancedMesh(lineGeo, zinc, count);
      const turn = rr() * Math.PI;
      const lr = r - WIRE * 1.9;
      q.setFromEuler(e.set(0, 0, Math.PI / 2));
      for (let j = 0; j < count; j++) {
        const a = turn + (j / count) * Math.PI * 2;
        m4.compose(new Vector3(shift, Math.cos(a) * lr, Math.sin(a) * lr), q, one);
        lines.setMatrixAt(j, m4);
      }
      for (const im of [hoop, lines]) {
        im.instanceMatrix.needsUpdate = true;
        im.castShadow = im.receiveShadow = true;
        im.frustumCulled = false;
        rollBody.add(im);
      }
    }
    pool(roll, L + 14, R * 2 + 12, 0.8);
    world.add(roll);

    // --- Coil of wire: every turn is a true round ring, wound in layers and tied in three places.
    const coil = new Group();
    const CW = 0.24;
    const C_IN = 7.6;
    const C_OUT = 12;
    const C_H = 6.6;
    const cols = Math.round((C_OUT - C_IN) / (CW * 2.04));
    const rows = Math.round(C_H / (CW * 2.04));
    const cr = seeded(9);
    for (let col = 0; col < cols; col++) {
      const radius = C_IN + CW + (col * (C_OUT - C_IN - 2 * CW)) / (cols - 1);
      const ring = new InstancedMesh(keep(new TorusGeometry(radius, CW, 6, 88)), zinc, rows);
      for (let row = 0; row < rows; row++) {
        const y = CW + (row * (C_H - 2 * CW)) / (rows - 1) + (cr() - 0.5) * CW * 0.5;
        q.setFromEuler(e.set(Math.PI / 2 + (cr() - 0.5) * 0.02, 0, (cr() - 0.5) * 0.02));
        m4.compose(new Vector3((cr() - 0.5) * CW * 0.6, y, (cr() - 0.5) * CW * 0.6), q, one);
        ring.setMatrixAt(row, m4);
      }
      ring.instanceMatrix.needsUpdate = true;
      ring.castShadow = ring.receiveShadow = true;
      ring.frustumCulled = false;
      coil.add(ring);
    }
    const tieR = C_H / 2 + 0.3;
    const tieGeo = keep(new TorusGeometry(tieR, 0.13, 5, 28));
    for (const ang of [0.5, 0.5 + (Math.PI * 2) / 3, 0.5 + (Math.PI * 4) / 3]) {
      const tie = new Mesh(tieGeo, zinc);
      const mid = (C_IN + C_OUT) / 2;
      tie.scale.x = ((C_OUT - C_IN) / 2 + 0.3) / tieR;
      tie.position.set(Math.cos(ang) * mid, C_H / 2, Math.sin(ang) * mid);
      tie.rotation.y = -ang;
      tie.castShadow = true;
      coil.add(tie);
    }
    pool(coil, C_OUT * 2 + 10, C_OUT * 2 + 10, 0.85);
    world.add(coil);

    // --- TMT bars: seven lengths, loose in a row, then packed four-and-three.
    const BAR_L = 56;
    const BAR_R = 0.8;
    const SEAT = 0.92; // centre spacing once ribs touch
    const barPart = ribbedBar({ length: BAR_L, radius: BAR_R, mat: bar, endMat: cut, seg: 20 });
    geos.push(...barPart.geos);
    const bundle = new Group();
    const br = seeded(5);
    const packed: [number, number][] = [
      [-2.76, 0.1],
      [-0.92, 0.1],
      [0.92, 0.1],
      [2.76, 0.1],
      [-1.84, 0.1 + SEAT * 1.732],
      [0, 0.1 + SEAT * 1.732],
      [1.84, 0.1 + SEAT * 1.732],
    ];
    const looseZ = [-8.4, -3.0, 2.5, 8.2, -5.7, -0.3, 5.3];
    const bars = packed.map(([pz, py], i) => {
      const holder = new Group();
      const body = i === 0 ? barPart.object : barPart.object.clone();
      body.position.x = -BAR_L / 2;
      holder.add(body);
      bundle.add(holder);
      return { holder, pz, py, lx: (br() - 0.5) * 6, lz: looseZ[i], lyaw: (br() - 0.5) * 0.024 };
    });
    const bundlePool = pool(bundle, BAR_L + 10, 26, 0.7);
    world.add(bundle);

    // --- Straps: what "secured" looks like. They only exist once the order is together.
    const strapMat = track(
      new MeshStandardMaterial({ color: "#e2681a", roughness: 0.62, metalness: 0, side: DoubleSide, transparent: true, opacity: 0 })
    );
    const straps: Mesh[] = [];
    const rollStrapGeo = keep(new CylinderGeometry(R + WIRE + 0.12, R + WIRE + 0.12, 1.9, 72, 1, true));
    for (const x of [-12.5, 12.5]) {
      const s = new Mesh(rollStrapGeo, strapMat);
      s.rotation.z = Math.PI / 2;
      s.position.x = x;
      rollBody.add(s);
      straps.push(s);
    }
    const barStrapGeo = keep(
      bandGeometry(
        hullOfCircles(
          packed.map(([pz, py]) => [pz, py + BAR_R] as [number, number]),
          BAR_R + 0.2
        ),
        1.6
      )
    );
    for (const x of [-17, 17]) {
      const s = new Mesh(barStrapGeo, strapMat);
      s.position.x = x;
      bundle.add(s);
      straps.push(s);
    }
    straps.forEach((s) => {
      s.castShadow = true;
      s.visible = false;
    });

    // --- Collection tag, laid against the order at handover.
    const tagTex = tagTexture();
    textures.push(tagTex);
    const tagMat = track(new MeshStandardMaterial({ map: tagTex, roughness: 0.9, metalness: 0, transparent: true, opacity: 0 }));
    const tag = new Mesh(keep(new PlaneGeometry(9.5, 6)), tagMat);
    tag.rotation.x = -Math.PI / 2;
    tag.rotation.z = 0.25;
    tag.position.set(-1, 0.06, -1);
    tag.receiveShadow = true;
    tag.visible = false;
    world.add(tag);

    // Loose on the table (a), and together for collection (b): x, z, turn.
    const PLACE = {
      roll: { a: [3, -23, 0.26], b: [6, -28, 0] },
      coil: { a: [49, 10, 0.4], b: [42, -23, 0.4] },
      bundle: { a: [8, 13, -0.1], b: [6, -13.2, 0] },
    };

    // --- Light: a soft key for form and shadow and a cool rim. The page shades everything but the step's subject.
    const hemi = new HemisphereLight("#3d5066", "#06090d", 0.35);
    const key = new DirectionalLight("#fff0dd", 2.0);
    key.position.set(-70, 120, 86);
    key.castShadow = true;
    key.shadow.mapSize.set(mobile ? 1024 : 2048, mobile ? 1024 : 2048);
    const sc = key.shadow.camera;
    sc.left = -84;
    sc.right = 84;
    sc.top = 60;
    sc.bottom = -60;
    sc.near = 20;
    sc.far = 360;
    key.shadow.bias = -0.0004;
    key.shadow.normalBias = 0.06;
    const rim = new DirectionalLight("#b4d2f2", 1.0);
    rim.position.set(90, 44, -80);
    scene.add(hemi, key, key.target, rim);

    // --- State.
    let want: Step = "list";
    const now: Record<Num, number> = { ...LOOKS.list };
    let p = 0; // 0 loose, 1 together
    let strap = 0;
    let tick = 0;
    let tagA = 0;

    const lookAt = new Vector3(3, 2, -9);
    let fitA = 0;
    const v = new Vector3();
    const compute = () => {
      const a = stage.size.aspect;
      const tanH = Math.tan((camera.fov * Math.PI) / 360);
      const d = Math.max(40 / tanH, 72 / (tanH * a));
      fitA = a;
      const yaw = 0.34;
      const elev = 0.7;
      // A taller box gains its extra height at the top (room for the page's list card): the table keeps its
      // place against the bottom edge, as it sits in a 3:2 box.
      const push = Math.max(0, d * tanH - 72 / 1.5) / Math.sin(elev);
      v.set(lookAt.x - Math.sin(yaw) * push, lookAt.y, lookAt.z - Math.cos(yaw) * push);
      camera.position.set(v.x + Math.sin(yaw) * d * Math.cos(elev), v.y + Math.sin(elev) * d, v.z + Math.cos(yaw) * d * Math.cos(elev));
      camera.lookAt(v);
      camera.updateMatrixWorld();
      fog.near = d * 0.98;
      fog.far = d * 1.9;
      const detail: Record<string, [number, number]> = {};
      for (const k in ANCHORS) {
        v.set(...ANCHORS[k]).project(camera);
        detail[k] = [((v.x + 1) / 2) * 100, ((1 - v.y) / 2) * 100];
      }
      host.dispatchEvent(new CustomEvent("scene-anchors", { bubbles: true, detail }));
    };

    const mix = (a: number, b: number, t: number) => a + (b - a) * t;
    const place = (g: Group, s: { a: number[]; b: number[] }, t: number) => {
      g.position.set(mix(s.a[0], s.b[0], t), 0, mix(s.a[1], s.b[1], t));
      g.rotation.y = mix(s.a[2], s.b[2], t);
    };
    const apply = () => {
      const t = p * p * (3 - 2 * p);
      place(roll, PLACE.roll, t);
      place(coil, PLACE.coil, t);
      place(bundle, PLACE.bundle, t);
      for (const b of bars) {
        b.holder.position.set(mix(b.lx, 0, t), mix(0.1, b.py, t), mix(b.lz, b.pz, t));
        b.holder.rotation.y = mix(b.lyaw, 0, t);
      }
      bundlePool.scale.set(1, mix(1, 0.46, t), 1);
      strapMat.opacity = strap;
      straps.forEach((s) => (s.visible = strap > 0.01));
      tagMat.opacity = tagA;
      tag.visible = tagA > 0.01;
      tickMat.opacity = tick;
      key.intensity = now.key;
      metals.forEach((m, i) => (m.envMapIntensity = metalBase[i] * now.mats));
      sheetMat.color.setScalar(now.clip);
      boardMat.color.copy(boardBase).multiplyScalar(now.clip);
    };

    /** One easing step of size k (0..1). Returns true while anything is still on its way. */
    const step = (k: number) => {
      const target = LOOKS[want];
      const together = want === "prepare" || want === "handover";
      // Straps come off before anything moves apart, and go on only once it has come together.
      const pGoal = together ? 1 : strap > 0.12 ? p : 0;
      const strapGoal = together && p > 0.9 ? 1 : 0;
      const tagGoal = want === "handover" && strap > 0.85 ? 1 : 0;
      let moving = false;
      const ease = (cur: number, to: number, rate = 1) => {
        const next = cur + (to - cur) * Math.min(1, k * rate);
        if (Math.abs(to - next) < 0.003) return to;
        moving = true;
        return next;
      };
      p = ease(p, pGoal, 0.9);
      strap = ease(strap, strapGoal, 1.8);
      tagA = ease(tagA, tagGoal, 1.6);
      tick = ease(tick, want === "list" ? 0 : 1, 1.4);
      for (const n of NUMS) now[n] = ease(now[n], target[n]);
      // The goals above are gated on each other, so one more pass is needed whenever a gate has just opened.
      const gated = (together ? 1 : 0) !== p || strapGoal !== strap || tagGoal !== tagA;
      return moving || gated;
    };

    return {
      update(dt, st) {
        if (fitA !== st.size.aspect) compute();
        const moving = step(dt === 0 ? 1 : 1 - Math.exp(-dt * 7));
        apply();
        return moving;
      },
      resize: compute,
      focus(k) {
        want = k === "check" || k === "prepare" || k === "handover" ? k : "list";
      },
      settle() {
        for (let i = 0; i < 12; i++) step(1);
      },
      lowerQuality() {
        key.castShadow = false;
      },
      dispose() {
        geos.forEach((g) => g.dispose());
        mats.forEach((m) => m.dispose());
        textures.forEach((t) => t.dispose());
        pools.forEach((x) => {
          x.geo.dispose();
          x.mat.dispose();
        });
        shadowTex.dispose();
        key.shadow.map?.dispose();
        scene.clear();
      },
    };
  });

export default createServicesScene;
