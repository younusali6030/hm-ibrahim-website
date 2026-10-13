import { BufferGeometry, CatmullRomCurve3, Float32BufferAttribute, MathUtils, Vector3 } from "three";

/**
 * Procedural wire geometry. One unit is one centimetre, so the proportions are the real ones:
 * 2.5 mm line wire, 1.9 mm barb wire, a 5 cm twist pitch, barbs every 10 cm and a 4.8 cm chain link opening.
 */

export const R_LINE = 0.155;
export const R_BARB = 0.115;
const TWIST_PITCH = 5.2;
const BARB_SPACING = 10;

type Centre = { p: Vector3[]; r: number; group: number };

/** Spatial hash over centreline samples, used to bake crevice darkening where one wire sits against another. */
class OccluderGrid {
  private cells = new Map<string, { p: Vector3; r: number; g: number }[]>();
  constructor(private cell = 0.5) {}
  private key(x: number, y: number, z: number) {
    return `${Math.floor(x / this.cell)},${Math.floor(y / this.cell)},${Math.floor(z / this.cell)}`;
  }
  add(c: Centre) {
    for (const p of c.p) {
      const k = this.key(p.x, p.y, p.z);
      let l = this.cells.get(k);
      if (!l) this.cells.set(k, (l = []));
      l.push({ p, r: c.r, g: c.group });
    }
  }
  /** 0 = open metal, 1 = fully pinched against another wire. */
  occlusion(v: Vector3, group: number): number {
    const cx = Math.floor(v.x / this.cell);
    const cy = Math.floor(v.y / this.cell);
    const cz = Math.floor(v.z / this.cell);
    let occ = 0;
    for (let dx = -1; dx <= 1; dx++)
      for (let dy = -1; dy <= 1; dy++)
        for (let dz = -1; dz <= 1; dz++) {
          const l = this.cells.get(`${cx + dx},${cy + dy},${cz + dz}`);
          if (!l) continue;
          for (const q of l) {
            if (q.g === group) continue;
            const gap = v.distanceTo(q.p) - q.r;
            const o = 1 - MathUtils.clamp(gap / (q.r * 1.1), 0, 1);
            if (o > occ) occ = o;
          }
        }
    return occ;
  }
}

type TubeSpec = {
  pts: Vector3[];
  radius: number;
  group: number;
  radial: number;
  /** Length over which the end tapers to a point (0 = square end). */
  tipLen?: number;
  tipStart?: boolean;
  tipEnd?: boolean;
};

/** Parallel-transport tube with a pointed-tip option. Returns plain arrays so tubes can be merged cheaply. */
function tube(spec: TubeSpec, grid: OccluderGrid | null) {
  const { pts, radius, radial } = spec;
  const n = pts.length;
  const tang: Vector3[] = [];
  for (let i = 0; i < n; i++) {
    tang.push(pts[Math.min(i + 1, n - 1)].clone().sub(pts[Math.max(i - 1, 0)]).normalize());
  }
  const normals: Vector3[] = [];
  const first = Math.abs(tang[0].y) < 0.9 ? new Vector3(0, 1, 0) : new Vector3(1, 0, 0);
  normals.push(first.sub(tang[0].clone().multiplyScalar(first.dot(tang[0]))).normalize());
  for (let i = 1; i < n; i++) {
    const axis = tang[i - 1].clone().cross(tang[i]);
    let nn = normals[i - 1].clone();
    if (axis.lengthSq() > 1e-12) {
      const ang = Math.acos(MathUtils.clamp(tang[i - 1].dot(tang[i]), -1, 1));
      nn.applyAxisAngle(axis.normalize(), ang);
    }
    nn = nn.sub(tang[i].clone().multiplyScalar(nn.dot(tang[i]))).normalize();
    normals.push(nn);
  }
  const arc: number[] = [0];
  for (let i = 1; i < n; i++) arc.push(arc[i - 1] + pts[i].distanceTo(pts[i - 1]));
  const total = arc[n - 1];

  const pos: number[] = [];
  const nor: number[] = [];
  const uv: number[] = [];
  const col: number[] = [];
  const idx: number[] = [];
  const tl = spec.tipLen ?? 0;
  const v = new Vector3();
  for (let i = 0; i < n; i++) {
    let r = radius;
    if (tl > 0) {
      if (spec.tipStart) r *= Math.pow(MathUtils.clamp(arc[i] / tl, 0, 1), 0.8);
      if (spec.tipEnd) r *= Math.pow(MathUtils.clamp((total - arc[i]) / tl, 0, 1), 0.8);
    }
    const B = tang[i].clone().cross(normals[i]);
    for (let j = 0; j <= radial; j++) {
      const a = (j / radial) * Math.PI * 2;
      const dir = normals[i].clone().multiplyScalar(Math.cos(a)).add(B.clone().multiplyScalar(Math.sin(a)));
      v.copy(pts[i]).addScaledVector(dir, r);
      pos.push(v.x, v.y, v.z);
      nor.push(dir.x, dir.y, dir.z);
      uv.push(arc[i] / 6, j / radial);
      let ao = 1;
      if (grid) ao = 1 - 0.72 * Math.pow(grid.occlusion(v, spec.group), 1.4);
      col.push(ao, ao, ao);
    }
  }
  const ring = radial + 1;
  for (let i = 0; i < n - 1; i++)
    for (let j = 0; j < radial; j++) {
      const a = i * ring + j;
      const b = a + ring;
      idx.push(a, b, a + 1, a + 1, b, b + 1);
    }
  return { pos, nor, uv, col, idx };
}

type Parts = ReturnType<typeof tube>[];

function merge(parts: Parts): BufferGeometry {
  const g = new BufferGeometry();
  const pos: number[] = [];
  const nor: number[] = [];
  const uv: number[] = [];
  const col: number[] = [];
  const idx: number[] = [];
  let base = 0;
  for (const p of parts) {
    for (const x of p.pos) pos.push(x);
    for (const x of p.nor) nor.push(x);
    for (const x of p.uv) uv.push(x);
    for (const x of p.col) col.push(x);
    for (const i of p.idx) idx.push(i + base);
    base += p.pos.length / 3;
  }
  g.setAttribute("position", new Float32BufferAttribute(pos, 3));
  g.setAttribute("normal", new Float32BufferAttribute(nor, 3));
  g.setAttribute("uv", new Float32BufferAttribute(uv, 2));
  g.setAttribute("color", new Float32BufferAttribute(col, 3));
  g.setIndex(idx);
  g.computeBoundingSphere();
  g.computeBoundingBox();
  return g;
}

function spaced(curve: CatmullRomCurve3, step: number): Vector3[] {
  const len = curve.getLength();
  return curve.getSpacedPoints(Math.max(8, Math.ceil(len / step)));
}

/* ------------------------------------------------------------------ barbed wire */

/** Local frame (x along the strand) -> world, for placing a wrapped barb on a curved strand. */
function strandAt(x: number, phase: number) {
  const w = (Math.PI * 2) / TWIST_PITCH;
  const a = w * x + phase;
  const c = new Vector3(x, R_LINE * Math.cos(a), R_LINE * Math.sin(a));
  const T = new Vector3(1, -R_LINE * w * Math.sin(a), R_LINE * w * Math.cos(a)).normalize();
  // Radial direction of the helix (away from the pair axis) as the frame's N, so a barb always leaves the outside.
  const N = new Vector3(0, Math.cos(a), Math.sin(a));
  N.sub(T.clone().multiplyScalar(N.dot(T))).normalize();
  const B = T.clone().cross(N);
  return { c, T, N, B };
}

/** One barb piece in strand-local space: tail, 1.5 tight wraps, tail. The two ends leave on opposite sides. */
function barbLocal(theta0: number, xOff: number): Vector3[] {
  const turns = 1.5;
  const rho = R_LINE + R_BARB * 1.03;
  const pitch = 2 * R_BARB * 1.06;
  const steps = Math.round(turns * 22);
  const helix: Vector3[] = [];
  for (let s = 0; s <= steps; s++) {
    const f = s / steps;
    const ang = theta0 + Math.PI * 2 * turns * f;
    helix.push(new Vector3(xOff - (turns * pitch) / 2 + turns * pitch * f, rho * Math.cos(ang), rho * Math.sin(ang)));
  }
  const tangentAt = (i: number) =>
    helix[Math.min(i + 1, helix.length - 1)].clone().sub(helix[Math.max(i - 1, 0)]).normalize();
  const h0 = helix[0];
  const h1 = helix[helix.length - 1];
  const t0 = tangentAt(0);
  const t1 = tangentAt(helix.length - 1);
  const u0 = new Vector3(0, h0.y, h0.z).normalize();
  const u1 = new Vector3(0, h1.y, h1.z).normalize();
  const dirA = new Vector3(-0.55, 0, 0).addScaledVector(u0, 0.835).normalize();
  const dirB = new Vector3(0.55, 0, 0).addScaledVector(u1, 0.835).normalize();
  const tipLen = 1.9;
  const tailA = [
    h0.clone().addScaledVector(dirA, tipLen),
    h0.clone().addScaledVector(dirA, tipLen * 0.45).addScaledVector(t0, -0.08),
    h0.clone().addScaledVector(t0, -0.2),
  ];
  const tailB = [
    h1.clone().addScaledVector(t1, 0.2),
    h1.clone().addScaledVector(dirB, tipLen * 0.45).addScaledVector(t1, 0.08),
    h1.clone().addScaledVector(dirB, tipLen),
  ];
  return [...tailA, ...helix, ...tailB];
}

export type BarbedOptions = { length: number; radialLine?: number; radialBarb?: number; sag?: number };

/** A two-strand twisted line wire with four-point barbs. Centred on the origin, running along +x. */
export function buildBarbedWire({ length, radialLine = 10, radialBarb = 7, sag = 0.0004 }: BarbedOptions) {
  const grid = new OccluderGrid(0.5);
  const half = length / 2;
  const step = 0.12;
  const specs: TubeSpec[] = [];

  for (let s = 0; s < 2; s++) {
    const phase = s * Math.PI;
    const pts: Vector3[] = [];
    for (let x = -half; x <= half + 1e-6; x += step) pts.push(strandAt(x, phase).c);
    specs.push({ pts, radius: R_LINE, group: s, radial: radialLine });
  }

  // Barbs ride strand 0; each station is two pieces a quarter-turn apart, giving four points.
  let g = 2;
  const stations = Math.floor(length / BARB_SPACING);
  for (let k = 0; k < stations; k++) {
    const xb = -half + (k + 0.5) * BARB_SPACING;
    for (let piece = 0; piece < 2; piece++) {
      const f = strandAt(xb + piece * 0.52, 0);
      const local = barbLocal(piece * (Math.PI / 2) + 0.35, 0);
      const world = local.map((p) => f.c.clone().addScaledVector(f.T, p.x).addScaledVector(f.N, p.y).addScaledVector(f.B, p.z));
      const curve = new CatmullRomCurve3(world, false, "centripetal");
      specs.push({
        pts: spaced(curve, 0.05),
        radius: R_BARB,
        group: g++,
        radial: radialBarb,
        tipLen: 0.55,
        tipStart: true,
        tipEnd: true,
      });
    }
  }

  // Occluders: every centreline, tagged by group (strands see barbs and each other).
  const pad = (s: TubeSpec): Centre => {
    const dense: Vector3[] = [];
    for (let i = 0; i < s.pts.length - 1; i++) {
      const a = s.pts[i];
      const b = s.pts[i + 1];
      const n = Math.max(1, Math.ceil(a.distanceTo(b) / (s.radius * 0.8)));
      for (let k = 0; k < n; k++) dense.push(a.clone().lerp(b, k / n));
    }
    return { p: dense, r: s.radius, group: s.group };
  };
  specs.forEach((s) => grid.add(pad(s)));

  const parts = specs.map((s) => tube(s, grid));
  const geo = merge(parts);
  // A taut run still hangs a little between posts.
  const p = geo.getAttribute("position");
  for (let i = 0; i < p.count; i++) p.setY(i, p.getY(i) - sag * p.getX(i) * p.getX(i));
  p.needsUpdate = true;
  geo.computeBoundingSphere();
  return geo;
}

/* ------------------------------------------------------------------ chain link */

export const LINK = { d: 2.8, period: 16, r: R_LINE };

/** Smoothed triangle wave: the flattened, rounded zig-zag a chain link wire is bent into. */
function zigzag(y: number, A: number, P: number): number {
  const th = (y / P) * Math.PI * 2;
  return A * (2 / Math.PI) * Math.asin(Math.sin(th));
}

/** Centreline of chain link wire `i`. Even and odd wires are mirror images; every crossing is over or under. */
function linkPath(i: number, yHalf: number, step: number): Vector3[] {
  const { d, period, r } = LINK;
  const A = d;
  const sign = i % 2 === 0 ? 1 : -1;
  const sigma = 0.55; // bend radius in cm: smoothing of the corners
  const pad = sigma * 4;
  const fine = 0.04;
  const ys: number[] = [];
  const raw: number[] = [];
  for (let y = -yHalf - pad; y <= yHalf + pad + 1e-6; y += fine) {
    ys.push(y);
    raw.push(zigzag(y, A, period));
  }
  // Gaussian smoothing of the corners; amplitude is restored afterwards so crossings land where they should.
  const k = Math.ceil((sigma * 3) / fine);
  const w: number[] = [];
  let ws = 0;
  for (let j = -k; j <= k; j++) {
    const v = Math.exp(-0.5 * Math.pow((j * fine) / sigma, 2));
    w.push(v);
    ws += v;
  }
  const sm = raw.map((_, n) => {
    let acc = 0;
    for (let j = -k; j <= k; j++) acc += raw[MathUtils.clamp(n + j, 0, raw.length - 1)] * w[j + k];
    return acc / ws;
  });
  const pts: Vector3[] = [];
  const zAmp = r * 1.2;
  for (let n = 0; n < ys.length; n += Math.max(1, Math.round(step / fine))) {
    const y = ys[n];
    if (Math.abs(y) > yHalf) continue;
    const th = (y / period) * Math.PI * 2;
    pts.push(new Vector3(i * d + sign * sm[n] * 1.06, y, sign * zAmp * Math.sin(2 * th)));
  }
  return pts;
}

/**
 * The two wire shapes of a chain link panel (even, odd), each with crevice darkening baked from its two
 * neighbours. Instance them at i*d: they are identical across the panel, so the panel is two draw calls.
 */
export function buildChainLinkWires(yHalf: number, radial = 8) {
  const step = 0.14;
  const make = (centre: number) => {
    const grid = new OccluderGrid(0.4);
    for (const nb of [centre - 2, centre - 1, centre + 1, centre + 2]) {
      const pts = linkPath(nb, yHalf, 0.1);
      grid.add({ p: pts, r: R_LINE, group: 1 });
    }
    const pts = linkPath(centre, yHalf, step);
    const geo = merge([tube({ pts, radius: R_LINE, group: 0, radial }, grid)]);
    // Re-centre so instances sit at i*d (even) or (i-1)*d (odd) without a per-wire offset.
    geo.translate(-centre * LINK.d, 0, 0);
    geo.computeBoundingSphere();
    return geo;
  };
  return { even: make(0), odd: make(1) };
}
