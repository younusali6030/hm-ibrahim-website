import {
  BoxGeometry,
  BufferGeometry,
  CanvasTexture,
  CatmullRomCurve3,
  CircleGeometry,
  CylinderGeometry,
  ExtrudeGeometry,
  Float32BufferAttribute,
  Group,
  IcosahedronGeometry,
  InstancedMesh,
  LinearFilter,
  LinearMipmapLinearFilter,
  Material,
  Matrix4,
  Mesh,
  NoColorSpace,
  Path,
  Quaternion,
  RepeatWrapping,
  Shape,
  TubeGeometry,
  Uint32BufferAttribute,
  Vector3,
  Euler,
} from "three";
import { buildBarbedWire, buildChainLinkWires, LINK } from "../wire/geometry";
import { perforatedSheet, type Part } from "../three/parts";

/**
 * Parts for the Products showroom. Same conventions as ../three/parts: centimetre-ish units, +x along a part's
 * length, y = 0 is the bottom of the piece. Shared builders (perforated sheet, barbed wire, chain link wires) are
 * reused; the rest are specific to the showroom's larger, closer view.
 */

export type ShowPart = Part & { textures?: CanvasTexture[] };

const TAU = Math.PI * 2;

/* ------------------------------------------------------------------ small helpers */

function finishMesh(m: Mesh) {
  m.castShadow = m.receiveShadow = true;
  return m;
}

function ensureColors(g: BufferGeometry, v = 1) {
  if (g.getAttribute("color")) return;
  const n = g.getAttribute("position").count;
  g.setAttribute("color", new Float32BufferAttribute(new Float32Array(n * 3).fill(v), 3));
}

/** Convex hull (Andrew monotone chain), counter-clockwise. */
function hull(pts: [number, number][]): [number, number][] {
  const p = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: number[], a: number[], b: number[]) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo: [number, number][] = [];
  for (const q of p) {
    while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop();
    lo.push(q);
  }
  const up: [number, number][] = [];
  for (const q of [...p].reverse()) {
    while (up.length >= 2 && cross(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop();
    up.push(q);
  }
  lo.pop();
  up.pop();
  return [...lo, ...up];
}

/* ------------------------------------------------------------------ ribbed TMT bar */

/**
 * A rolled rebar: round core, two longitudinal ribs, transverse ribs that lean opposite ways on either flank.
 * Sampling follows the rib pitch, so a long bar does not pay for detail it cannot show.
 */
export function rebar(opts: { length: number; radius: number; mat: Material; endMat: Material; radial?: number; perPitch?: number }): ShowPart {
  const { length, radius, mat, endMat } = opts;
  const radial = opts.radial ?? 40;
  const pitch = radius * 1.3;
  const along = Math.max(8, Math.ceil((length / pitch) * (opts.perPitch ?? 9)));
  const rib = radius * 0.17;
  const lon = radius * 0.15;
  const pos: number[] = [];
  const uvs: number[] = [];
  const idx: number[] = [];
  for (let i = 0; i <= along; i++) {
    const x = (i / along) * length;
    for (let j = 0; j <= radial; j++) {
      const a = (j / radial) * TAU;
      const flank = Math.sin(a) >= 0 ? 1 : -1;
      const u = ((x + Math.cos(a) * radius * flank * 0.9) / pitch) % 1;
      const uu = u < 0 ? u + 1 : u;
      const w = Math.min(uu, 1 - uu);
      const prof = Math.max(0, Math.min(1, (0.2 - w) / 0.09));
      const fade = Math.min(1, Math.abs(Math.sin(a)) * 5);
      const lonRib = Math.max(0, 1 - Math.abs(Math.sin(a)) * 8) * lon;
      const r = radius + prof * rib * fade + lonRib;
      pos.push(x, Math.cos(a) * r, Math.sin(a) * r);
      uvs.push(x * 0.4, j / radial);
    }
  }
  const ring = radial + 1;
  for (let i = 0; i < along; i++)
    for (let j = 0; j < radial; j++) {
      const a = i * ring + j;
      const b = a + ring;
      idx.push(a, a + 1, b, a + 1, b + 1, b);
    }
  const body = new BufferGeometry();
  body.setAttribute("position", new Float32BufferAttribute(pos, 3));
  body.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
  body.setIndex(idx);
  body.computeVertexNormals();
  const cap = new CircleGeometry(radius * 0.99, radial);
  const g = new Group();
  const bodyMesh = finishMesh(new Mesh(body, mat));
  const c0 = new Mesh(cap, endMat);
  c0.rotation.y = -Math.PI / 2;
  const c1 = new Mesh(cap, endMat);
  c1.rotation.y = Math.PI / 2;
  c1.position.x = length;
  g.add(bodyMesh, c0, c1);
  g.position.y = radius;
  const root = new Group();
  root.add(g);
  return { object: root, geos: [body, cap] };
}

/* ------------------------------------------------------------------ hollow pipe */

/**
 * A round tube with real wall thickness: the extrusion carries a circular hole, so both ends show the bore. The
 * inside is darkened by depth (vertex colour) because a long bore receives almost no light but at its mouth.
 * The material must have vertexColors enabled.
 */
export function hollowPipe(opts: { length: number; outer: number; wall: number; mat: Material }): ShowPart {
  const { length, outer, wall, mat } = opts;
  const s = new Shape();
  s.absarc(0, 0, outer, 0, TAU, false);
  const h = new Path();
  h.absarc(0, 0, outer - wall, 0, TAU, true);
  s.holes.push(h);
  const bt = wall * 0.22;
  const geo = new ExtrudeGeometry(s, {
    depth: length,
    curveSegments: 44,
    bevelEnabled: true,
    bevelThickness: bt,
    bevelSize: bt,
    bevelOffset: -bt,
    bevelSegments: 2,
    steps: 1,
  });
  geo.rotateY(Math.PI / 2);
  geo.translate(0, outer, 0);
  const p = geo.getAttribute("position");
  const col = new Float32Array(p.count * 3);
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i);
    const r = Math.hypot(p.getY(i) - outer, p.getZ(i));
    const inner = r < outer - wall * 0.45;
    const depth = Math.max(0, Math.min(x + bt, length + bt - x));
    const ao = inner ? 0.12 + 0.88 * Math.exp(-depth / (outer * 1.15)) : 1;
    col[i * 3] = col[i * 3 + 1] = col[i * 3 + 2] = ao;
  }
  geo.setAttribute("color", new Float32BufferAttribute(col, 3));
  const root = new Group();
  root.add(finishMesh(new Mesh(geo, mat)));
  return { object: root, geos: [geo] };
}

/* ------------------------------------------------------------------ bundle strap */

/** A flat steel band around a bundle of round sections whose centres are (z, y) pairs, as seen end-on. */
export function bundleBand(opts: { centres: [number, number][]; radius: number; x: number; width: number; mat: Material }): ShowPart {
  const { centres, radius, mat } = opts;
  const around = (r: number) => {
    const pts: [number, number][] = [];
    for (const [cz, cy] of centres) for (let k = 0; k < 16; k++) pts.push([cz + Math.cos((k / 16) * TAU) * r, cy + Math.sin((k / 16) * TAU) * r]);
    return hull(pts);
  };
  const outer = around(radius + 0.32);
  const inner = around(radius + 0.04);
  const s = new Shape();
  outer.forEach(([a, b], i) => (i ? s.lineTo(a, b) : s.moveTo(a, b)));
  const hole = new Path();
  [...inner].reverse().forEach(([a, b], i) => (i ? hole.lineTo(a, b) : hole.moveTo(a, b)));
  s.holes.push(hole);
  const geo = new ExtrudeGeometry(s, { depth: opts.width, bevelEnabled: false });
  // Shape lives in (z, y) and extrudes along +z. rotateY(-90deg) sends shape-x to +z and the extrusion to -x.
  geo.rotateY(-Math.PI / 2);
  geo.translate(opts.x + opts.width / 2, 0, 0);
  const root = new Group();
  root.add(finishMesh(new Mesh(geo, mat)));
  return { object: root, geos: [geo] };
}

/* ------------------------------------------------------------------ chain link roll */

/**
 * A roll of chain link fabric standing on end. The two woven wire shapes from the Brands scene are cloned wire by
 * wire and bent onto an Archimedean spiral, so every crossing is still over-and-under; crevice shading comes
 * along as vertex colour. The material needs vertexColors on.
 */
export function chainLinkRoll(opts: { halfHeight: number; innerRadius: number; layerGap: number; turns: number; scale: number; mat: Material }): ShowPart {
  const { halfHeight, innerRadius: R0, layerGap, turns, scale, mat } = opts;
  const { even, odd } = buildChainLinkWires(halfHeight, 6);
  const k = layerGap / TAU;
  const theta = (s: number) => (Math.sqrt(Math.max(1e-6, R0 * R0 + 2 * k * s)) - R0) / k;
  const thetaMax = TAU * turns;
  const sMax = R0 * thetaMax + (k * thetaMax * thetaMax) / 2;
  const n = Math.floor(sMax / LINK.d);
  const bake = (src: BufferGeometry) => {
    const p = src.getAttribute("position");
    const nr = src.getAttribute("normal");
    const c = src.getAttribute("color");
    const u = src.getAttribute("uv");
    const ix = src.getIndex()!;
    return { p, nr, c, u, ix };
  };
  const E = bake(even);
  const O = bake(odd);
  let verts = 0;
  let tris = 0;
  for (let i = 0; i < n; i++) {
    const B = i % 2 ? O : E;
    verts += B.p.count;
    tris += B.ix.count;
  }
  const pos = new Float32Array(verts * 3);
  const nor = new Float32Array(verts * 3);
  const col = new Float32Array(verts * 3);
  const uv = new Float32Array(verts * 2);
  const idx = new Uint32Array(tris);
  let vo = 0;
  let io = 0;
  for (let i = 0; i < n; i++) {
    const B = i % 2 ? O : E;
    const cnt = B.p.count;
    for (let v = 0; v < cnt; v++) {
      const s = i * LINK.d + B.p.getX(v);
      const th = theta(s);
      const rc = R0 + k * th;
      const rho = rc + B.p.getZ(v);
      const ct = Math.cos(th);
      const st = Math.sin(th);
      const o = (vo + v) * 3;
      pos[o] = rho * ct * scale;
      pos[o + 1] = (B.p.getY(v) + halfHeight) * scale;
      pos[o + 2] = rho * st * scale;
      const nx = B.nr.getX(v);
      const ny = B.nr.getY(v);
      const nz = B.nr.getZ(v);
      // Panel axes -> world: x along the spiral (-sin, cos), z radial (cos, sin).
      nor[o] = -st * nx + ct * nz;
      nor[o + 1] = ny;
      nor[o + 2] = ct * nx + st * nz;
      col[o] = B.c.getX(v);
      col[o + 1] = B.c.getY(v);
      col[o + 2] = B.c.getZ(v);
      uv[(vo + v) * 2] = B.u.getX(v) + i * 0.37;
      uv[(vo + v) * 2 + 1] = B.u.getY(v);
    }
    for (let t = 0; t < B.ix.count; t++) idx[io + t] = B.ix.getX(t) + vo;
    vo += cnt;
    io += B.ix.count;
  }
  const geo = new BufferGeometry();
  geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
  geo.setAttribute("normal", new Float32BufferAttribute(nor, 3));
  geo.setAttribute("color", new Float32BufferAttribute(col, 3));
  geo.setAttribute("uv", new Float32BufferAttribute(uv, 2));
  geo.setIndex(new Uint32BufferAttribute(idx, 1));
  geo.computeBoundingSphere();
  geo.computeBoundingBox();
  even.dispose();
  odd.dispose();
  const root = new Group();
  root.add(finishMesh(new Mesh(geo, mat)));
  return { object: root, geos: [geo] };
}

/* ------------------------------------------------------------------ barbed wire coil */

/**
 * A stacked coil of barbed wire. The straight two-strand wire from the Brands scene is wrapped on a cylinder, each
 * turn resting on the one below. Vertex colour carries the baked crevice shading.
 */
export function barbedCoil(opts: { turns: number; radius: number; rise: number; scale: number; mat: Material }): ShowPart {
  const { turns, radius: R, rise, scale, mat } = opts;
  const length = turns * TAU * R;
  const geo = buildBarbedWire({ length, radialLine: 7, radialBarb: 5, sag: 0 });
  const p = geo.getAttribute("position");
  const nr = geo.getAttribute("normal");
  const half = length / 2;
  let minY = Infinity;
  const tmp = new Float32Array(p.count * 3);
  const nTmp = new Float32Array(p.count * 3);
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i) + half;
    const th = x / R;
    const rho = R + p.getY(i);
    const ct = Math.cos(th);
    const st = Math.sin(th);
    tmp[i * 3] = rho * ct;
    tmp[i * 3 + 1] = p.getZ(i) + rise * (th / TAU);
    tmp[i * 3 + 2] = rho * st;
    if (tmp[i * 3 + 1] < minY) minY = tmp[i * 3 + 1];
    // Straight wire axes: x along the run, y radial, z vertical.
    const nx = nr.getX(i);
    const ny = nr.getY(i);
    const nz = nr.getZ(i);
    nTmp[i * 3] = -st * nx + ct * ny;
    nTmp[i * 3 + 1] = nz;
    nTmp[i * 3 + 2] = ct * nx + st * ny;
  }
  for (let i = 0; i < p.count; i++) {
    p.setXYZ(i, tmp[i * 3] * scale, (tmp[i * 3 + 1] - minY) * scale, tmp[i * 3 + 2] * scale);
    nr.setXYZ(i, nTmp[i * 3], nTmp[i * 3 + 1], nTmp[i * 3 + 2]);
  }
  p.needsUpdate = nr.needsUpdate = true;
  geo.computeBoundingSphere();
  geo.computeBoundingBox();
  const root = new Group();
  root.add(finishMesh(new Mesh(geo, mat)));
  return { object: root, geos: [geo] };
}

/* ------------------------------------------------------------------ wire rope */

function grooveTexture(): CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 8;
  c.height = 96;
  const ctx = c.getContext("2d")!;
  const img = ctx.createImageData(8, 96);
  for (let y = 0; y < 96; y++) {
    // Three wires visible across a strand's face: a ridge each, a dark seam between.
    const v = 0.5 + 0.5 * Math.cos((y / 96) * TAU * 3);
    const b = Math.round(Math.pow(v, 0.8) * 255);
    for (let x = 0; x < 8; x++) {
      const o = (y * 8 + x) * 4;
      img.data[o] = img.data[o + 1] = img.data[o + 2] = b;
      img.data[o + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const t = new CanvasTexture(c);
  t.wrapS = t.wrapT = RepeatWrapping;
  t.colorSpace = NoColorSpace;
  t.minFilter = LinearMipmapLinearFilter;
  t.magFilter = LinearFilter;
  t.anisotropy = 4;
  return t;
}

/**
 * Six-strand rope laid in a stacked coil with a free tail on the surface. Each strand is a helix around the rope's
 * centreline. Returns its groove texture so the owner can use it as the strand bump map and dispose it.
 */
export function wireRopeCoil(opts: { radius: number; diameter: number; turns: number; tail: number; mat: Material; coreMat: Material }): ShowPart {
  const { radius: R, diameter: D, turns, tail, mat, coreMat } = opts;
  const rs = D * 0.2;
  const lay = D * 7.5;
  const step = D * 0.09;
  const y0 = D / 2;
  const rise = D * 0.985;
  const theta0 = Math.PI / 2;
  // Centreline: straight tail along +x, then circles of radius R climbing by `rise` per turn.
  const C: Vector3[] = [];
  // The tail comes in from +x towards the circle's start.
  for (let s = tail; s > 0; s -= step) C.push(new Vector3(s, y0, R));
  const arc = turns * TAU * R;
  const steps = Math.ceil(arc / step);
  for (let i = 0; i <= steps; i++) {
    const th = theta0 + (i / steps) * turns * TAU;
    C.push(new Vector3(R * Math.cos(th), y0 + (rise * (i / steps) * turns), R * Math.sin(th)));
  }
  const n = C.length;
  const T: Vector3[] = [];
  for (let i = 0; i < n; i++) T.push(C[Math.min(n - 1, i + 1)].clone().sub(C[Math.max(0, i - 1)]).normalize());
  const up = new Vector3(0, 1, 0);
  const lens: number[] = [0];
  for (let i = 1; i < n; i++) lens.push(lens[i - 1] + C[i].distanceTo(C[i - 1]));
  const geos: BufferGeometry[] = [];
  const group = new Group();
  const tube = (pts: Vector3[], radius: number, m: Material) => {
    const curve = new CatmullRomCurve3(pts, false, "centripetal");
    curve.arcLengthDivisions = pts.length;
    const g = new TubeGeometry(curve, pts.length, radius, 7, false);
    geos.push(g);
    group.add(finishMesh(new Mesh(g, m)));
  };
  tube(C, rs * 1.05, coreMat);
  for (let k = 0; k < 6; k++) {
    const ph = (k / 6) * TAU;
    const pts: Vector3[] = [];
    for (let i = 0; i < n; i++) {
      const side = new Vector3().crossVectors(up, T[i]).normalize();
      const out = new Vector3().crossVectors(T[i], side).normalize();
      const a = ph + (lens[i] / lay) * TAU;
      pts.push(C[i].clone().addScaledVector(side, Math.cos(a) * (D / 2 - rs)).addScaledVector(out, Math.sin(a) * (D / 2 - rs)));
    }
    tube(pts, rs * 1.02, mat);
  }
  const root = new Group();
  root.add(group);
  return { object: root, geos };
}

/** Groove bump texture for the strands of `wireRopeCoil`. The caller owns and disposes it. */
export function ropeGrooveTexture() {
  return grooveTexture();
}

/* ------------------------------------------------------------------ welded mesh */

/**
 * A welded wire panel, upright, bottom edge at y = 0, centred on x: straight rods in two layers with a weld
 * nodule at every crossing. Two instanced sets plus one for the welds.
 */
export function weldedPanel(opts: { w: number; h: number; pitch: number; rod: number; mat: Material }): ShowPart {
  const { w, h, pitch, rod, mat } = opts;
  const nx = Math.floor(w / pitch) + 1;
  const ny = Math.floor(h / pitch) + 1;
  const spanX = (nx - 1) * pitch;
  const spanY = (ny - 1) * pitch;
  const over = pitch * 0.55;
  const rodGeo = new CylinderGeometry(1, 1, 1, 8, 1, false);
  const nodeGeo = new IcosahedronGeometry(1, 1);
  const hor = new InstancedMesh(rodGeo, mat, ny);
  const ver = new InstancedMesh(rodGeo, mat, nx);
  const nodes = new InstancedMesh(nodeGeo, mat, nx * ny);
  const m = new Matrix4();
  const q = new Quaternion();
  const qz = new Quaternion().setFromEuler(new Euler(0, 0, Math.PI / 2));
  const base = over;
  for (let j = 0; j < ny; j++) {
    m.compose(new Vector3(0, base + j * pitch, rod), qz, new Vector3(rod, spanX + over * 2, rod));
    hor.setMatrixAt(j, m);
  }
  for (let i = 0; i < nx; i++) {
    m.compose(new Vector3(-spanX / 2 + i * pitch, base + spanY / 2, -rod), q, new Vector3(rod, spanY + over * 2, rod));
    ver.setMatrixAt(i, m);
  }
  let n = 0;
  for (let j = 0; j < ny; j++)
    for (let i = 0; i < nx; i++) {
      m.compose(new Vector3(-spanX / 2 + i * pitch, base + j * pitch, 0), q, new Vector3(rod * 1.55, rod * 1.55, rod * 1.2));
      nodes.setMatrixAt(n++, m);
    }
  const g = new Group();
  for (const im of [hor, ver, nodes]) {
    im.instanceMatrix.needsUpdate = true;
    im.frustumCulled = false;
    finishMesh(im as unknown as Mesh);
    g.add(im);
  }
  // Pull the root so the panel's footprint is centred on the origin.
  const root = new Group();
  root.add(g);
  return { object: root, geos: [rodGeo, nodeGeo] };
}

/* ------------------------------------------------------------------ expanded metal */

/**
 * Expanded metal, upright, bottom at y = 0, centred on x. A diamond lattice of flat strands, each twisted about its
 * own axis (the way slit-and-stretched sheet stands proud of its plane), joined by flat bonds at the nodes.
 */
export function expandedPanel(opts: { w: number; h: number; halfW: number; halfH: number; strand: number; thick: number; mat: Material }): ShowPart {
  const { w, h, halfW, halfH, strand, thick, mat } = opts;
  const cols = Math.floor(w / halfW);
  const rows = Math.floor(h / halfH);
  const strands: { a: [number, number]; b: [number, number] }[] = [];
  const nodes: [number, number][] = [];
  for (let i = 0; i <= cols; i++)
    for (let j = 0; j <= rows; j++) {
      if ((i + j) % 2) continue;
      nodes.push([i, j]);
      for (const dj of [-1, 1]) {
        const ni = i + 1;
        const nj = j + dj;
        if (ni <= cols && nj >= 0 && nj <= rows) strands.push({ a: [i, j], b: [ni, nj] });
      }
    }
  const box = new BoxGeometry(1, 1, 1);
  const st = new InstancedMesh(box, mat, strands.length);
  const nd = new InstancedMesh(box, mat, nodes.length);
  const m = new Matrix4();
  const q = new Quaternion();
  const qa = new Quaternion();
  const qb = new Quaternion();
  const ax = new Vector3(1, 0, 0);
  const oz = (cols * halfW) / 2;
  strands.forEach((s, n) => {
    const ax_ = s.a[0] * halfW - oz;
    const ay = s.a[1] * halfH;
    const bx = s.b[0] * halfW - oz;
    const by = s.b[1] * halfH;
    const len = Math.hypot(bx - ax_, by - ay);
    qa.setFromAxisAngle(new Vector3(0, 0, 1), Math.atan2(by - ay, bx - ax_));
    // Twist of the strand about its own axis: what lifts it out of the sheet plane.
    qb.setFromAxisAngle(ax, 0.62);
    q.copy(qa).multiply(qb);
    m.compose(new Vector3((ax_ + bx) / 2, (ay + by) / 2 + thick, 0), q, new Vector3(len + strand * 0.9, strand, thick * 0.55));
    st.setMatrixAt(n, m);
  });
  const qi = new Quaternion();
  nodes.forEach(([i, j], n) => {
    m.compose(new Vector3(i * halfW - oz, j * halfH + thick, 0), qi, new Vector3(strand * 1.7, strand * 1.5, thick * 0.9));
    nd.setMatrixAt(n, m);
  });
  const g = new Group();
  for (const im of [st, nd]) {
    im.instanceMatrix.needsUpdate = true;
    im.frustumCulled = false;
    finishMesh(im as unknown as Mesh);
    g.add(im);
  }
  const root = new Group();
  root.add(g);
  return { object: root, geos: [box] };
}

/* ------------------------------------------------------------------ upright perforated sheet */

/** The shared perforated plate, stood on its edge (face toward +z), bottom edge at y = 0, centred on x. */
export function uprightPerforated(opts: { w: number; h: number; thick: number; hole: number; pitch: number; margin: number; mat: Material }): ShowPart {
  const part = perforatedSheet({ w: opts.w, d: opts.h, thick: opts.thick, hole: opts.hole, pitch: opts.pitch, margin: opts.margin, mat: opts.mat });
  part.object.rotation.x = Math.PI / 2;
  const root = new Group();
  root.add(part.object);
  root.position.y = 0;
  const wrap = new Group();
  part.object.position.y = 0;
  root.position.y = opts.h / 2;
  wrap.add(root);
  return { object: wrap, geos: part.geos };
}

/* ------------------------------------------------------------------ display foot */

export function foot(opts: { w: number; h: number; d: number; mat: Material }) {
  const g = new BoxGeometry(opts.w, opts.h, opts.d);
  const m = finishMesh(new Mesh(g, opts.mat));
  m.position.y = opts.h / 2;
  return { mesh: m, geo: g };
}
