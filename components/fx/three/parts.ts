import {
  BufferGeometry,
  CatmullRomCurve3,
  CircleGeometry,
  ExtrudeGeometry,
  Float32BufferAttribute,
  Group,
  InstancedMesh,
  LatheGeometry,
  Material,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  Path,
  PlaneGeometry,
  Shape,
  TorusGeometry,
  TubeGeometry,
  Vector2,
  Vector3,
  Euler,
  Quaternion,
  type Texture,
} from "three";

/**
 * Physical parts shared by the still-life scenes. Units are centimetres, +x runs along a part's length,
 * and every part is built so that y = 0 is the bottom of the piece: place it on the surface and it rests there.
 * Geometries are returned in `geos` so the owning scene can dispose them.
 */

export type Part = { object: Group; geos: BufferGeometry[]; mats?: Material[] };

const rnd = (seed: number) => {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
};

/** Soft dark pool laid on the surface under a part. */
export function contactShadow(tex: Texture, w: number, d: number, opacity = 0.7) {
  const g = new PlaneGeometry(w, d);
  const m = new MeshBasicMaterial({ map: tex, transparent: true, opacity, depthWrite: false, color: 0x000000 });
  const mesh = new Mesh(g, m);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = 0.02;
  mesh.renderOrder = 1;
  return { mesh, geo: g, mat: m };
}

/* ------------------------------------------------------------------ ribbed TMT bar */

/**
 * A rolled rebar: round core, two longitudinal ribs and diagonal transverse ribs that lean opposite ways
 * on either side. Lies along +x with its lowest point at y = 0 (centre at y = radius).
 */
export function ribbedBar(opts: { length: number; radius: number; mat: Material; endMat: Material; seg?: number }): Part {
  const { length, radius, mat, endMat } = opts;
  const radial = opts.seg ?? 56;
  const along = Math.round(length * 9);
  const pitch = radius * 1.22;
  const rib = radius * 0.14;
  const lon = radius * 0.13;
  const pos: number[] = [];
  const uvs: number[] = [];
  const idx: number[] = [];
  for (let i = 0; i <= along; i++) {
    const x = (i / along) * length;
    for (let j = 0; j <= radial; j++) {
      const a = (j / radial) * Math.PI * 2;
      // Which flank: +1 above the longitudinal ribs on one side, -1 on the other. The rib leans with the flank.
      const flank = Math.sin(a) >= 0 ? 1 : -1;
      const lean = flank * 0.9;
      const u = ((x + Math.cos(a) * radius * lean) / pitch) % 1;
      const uu = u < 0 ? u + 1 : u;
      // A rounded-trapezoid rib profile across the pitch.
      const w = Math.min(uu, 1 - uu);
      const prof = Math.max(0, Math.min(1, (0.2 - w) / 0.1));
      // Ribs fade out where they meet a longitudinal rib so the two do not stack.
      const toLon = Math.min(Math.abs(Math.sin(a)), 1);
      const fade = Math.min(1, toLon * 5);
      const lonRib = Math.max(0, 1 - Math.abs(Math.sin(a)) * 9) * lon;
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
  const bodyMesh = new Mesh(body, mat);
  bodyMesh.castShadow = bodyMesh.receiveShadow = true;
  const c0 = new Mesh(cap, endMat);
  c0.rotation.y = -Math.PI / 2;
  c0.position.x = 0;
  const c1 = new Mesh(cap, endMat);
  c1.rotation.y = Math.PI / 2;
  c1.position.x = length;
  g.add(bodyMesh, c0, c1);
  g.position.y = radius; // rests on the surface
  const root = new Group();
  root.add(g);
  return { object: root, geos: [body, cap] };
}

/* ------------------------------------------------------------------ bright round bar */

export function brightBar(opts: { length: number; radius: number; mat: Material }): Part {
  const { length, radius, mat } = opts;
  const ch = radius * 0.07;
  const pts = [
    new Vector2(0, 0),
    new Vector2(radius - ch, 0),
    new Vector2(radius, ch),
    new Vector2(radius, length - ch),
    new Vector2(radius - ch, length),
    new Vector2(0, length),
  ];
  const geo = new LatheGeometry(pts, 64);
  const m = new Mesh(geo, mat);
  m.castShadow = m.receiveShadow = true;
  // Lathe runs along +y; lay it along +x.
  m.rotation.z = -Math.PI / 2;
  m.position.y = radius;
  const root = new Group();
  root.add(m);
  return { object: root, geos: [geo] };
}

/* ------------------------------------------------------------------ angle section */

/**
 * An equal angle, one leg flat on the surface, the other standing. Extruded along +x so the L-shaped end faces -x
 * and +x; rotate the group to bring an end toward the viewer.
 */
export function angleSection(opts: { length: number; leg: number; thick: number; mat: Material }): Part {
  const { length, leg, thick, mat } = opts;
  const s = new Shape();
  // Profile in (z, y): flat leg along z, standing leg along y. Toe radii are left square: this is mill-rolled stock.
  s.moveTo(0, 0);
  s.lineTo(leg, 0);
  s.lineTo(leg, thick);
  s.lineTo(thick, thick);
  s.lineTo(thick, leg);
  s.lineTo(0, leg);
  s.lineTo(0, 0);
  const geo = new ExtrudeGeometry(s, {
    depth: length,
    bevelEnabled: true,
    bevelSize: thick * 0.09,
    bevelThickness: thick * 0.09,
    bevelSegments: 2,
    curveSegments: 4,
  });
  // Extrusion axis is +z; turn it onto +x, keeping the profile's y up.
  geo.rotateY(Math.PI / 2);
  geo.translate(0, 0, 0);
  const m = new Mesh(geo, mat);
  m.castShadow = m.receiveShadow = true;
  const root = new Group();
  root.add(m);
  return { object: root, geos: [geo] };
}

/* ------------------------------------------------------------------ perforated sheet */

export function perforatedSheet(opts: {
  w: number;
  d: number;
  thick: number;
  hole: number;
  pitch: number;
  margin: number;
  mat: Material;
}): Part {
  const { w, d, thick, hole, pitch, margin, mat } = opts;
  const s = new Shape();
  s.moveTo(-w / 2, -d / 2);
  s.lineTo(w / 2, -d / 2);
  s.lineTo(w / 2, d / 2);
  s.lineTo(-w / 2, d / 2);
  s.lineTo(-w / 2, -d / 2);
  // 60 degree staggered round holes: the standard pattern for round-hole perforated plate.
  const rowStep = pitch * 0.866;
  const cols = Math.floor((w - 2 * margin) / pitch);
  const rows = Math.floor((d - 2 * margin) / rowStep);
  const x0 = -((cols - 1) * pitch) / 2;
  const y0 = -((rows - 1) * rowStep) / 2;
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      const cx = x0 + c * pitch + (r % 2 ? pitch / 2 : 0);
      if (cx + hole / 2 > w / 2 - margin * 0.6) continue;
      const cy = y0 + r * rowStep;
      const p = new Path();
      p.absarc(cx, cy, hole / 2, 0, Math.PI * 2, true);
      s.holes.push(p);
    }
  const geo = new ExtrudeGeometry(s, { depth: thick, bevelEnabled: true, bevelSize: thick * 0.12, bevelThickness: thick * 0.12, bevelSegments: 1, curveSegments: 14 });
  geo.rotateX(-Math.PI / 2); // lie flat: thickness along +y
  const m = new Mesh(geo, mat);
  m.castShadow = m.receiveShadow = true;
  m.position.y = thick * 0.12; // bevel overhang sits on the surface
  const root = new Group();
  root.add(m);
  return { object: root, geos: [geo] };
}

/* ------------------------------------------------------------------ wire coil */

/** A bound coil of wire lying flat: instanced rings in a rectangular winding, two ties around the section. */
export function wireCoil(opts: { inner: number; outer: number; height: number; wire: number; mat: Material; seed?: number }): Part {
  const { inner, outer, height, wire, mat } = opts;
  const r = rnd(opts.seed ?? 3);
  const ringGeo = new TorusGeometry(1, wire, 6, 72);
  const step = wire * 2.15;
  const cols = Math.max(2, Math.round((outer - inner) / step));
  const rows = Math.max(2, Math.round(height / step));
  const inst = new InstancedMesh(ringGeo, mat, cols * rows);
  inst.castShadow = inst.receiveShadow = true;
  const m = new Matrix4();
  const q = new Quaternion();
  const e = new Euler();
  let n = 0;
  for (let row = 0; row < rows; row++)
    for (let col = 0; col < cols; col++) {
      const radius = inner + wire + col * ((outer - inner - 2 * wire) / (cols - 1)) + (r() - 0.5) * wire * 0.5;
      const y = wire + row * ((height - 2 * wire) / (rows - 1)) + (r() - 0.5) * wire * 0.4;
      e.set(Math.PI / 2 + (r() - 0.5) * 0.04, (r() - 0.5) * 0.04, 0);
      q.setFromEuler(e);
      m.compose(new Vector3(0, y, 0), q, new Vector3(radius, radius, 1));
      inst.setMatrixAt(n++, m);
    }
  inst.instanceMatrix.needsUpdate = true;
  inst.frustumCulled = false;
  const g = new Group();
  g.add(inst);
  const geos: BufferGeometry[] = [ringGeo];
  // Two ties wrapped through the hole and around the outside.
  const tieR = (height + 0.4) / 2;
  const tieGeo = new TorusGeometry(tieR, wire * 1.3, 6, 36);
  geos.push(tieGeo);
  for (const ang of [0.6, 0.6 + Math.PI]) {
    const t = new Mesh(tieGeo, mat);
    t.scale.set(1, 1, 1);
    const mid = (inner + outer) / 2;
    // Torus plane is XY by default; we want it to contain the radial direction and Y.
    t.scale.x = ((outer - inner) / 2 + wire * 1.5) / tieR;
    t.position.set(Math.cos(ang) * mid, height / 2, Math.sin(ang) * mid);
    t.rotation.y = -ang;
    t.castShadow = true;
    g.add(t);
  }
  const root = new Group();
  root.add(g);
  return { object: root, geos };
}

/* ------------------------------------------------------------------ woven mesh panel */

/**
 * A woven wire panel, upright, bottom edge at y = 0, centred on x. Wires are four shared wavy geometries
 * (horizontal and vertical, even and odd) instanced across the panel, so crossings alternate over and under.
 */
export function wovenPanel(opts: { w: number; h: number; pitch: number; wire: number; mat: Material }): Part {
  const { w, h, pitch, wire, mat } = opts;
  const cols = Math.floor(w / pitch);
  const rows = Math.floor(h / pitch);
  const amp = wire * 1.05;
  const wave = (len: number, parity: number, horizontal: boolean) => {
    const off = pitch * 0.6 + (horizontal ? 0 : wire);
    const pts: Vector3[] = [];
    const n = Math.round((len / pitch) * 8);
    for (let i = 0; i <= n; i++) {
      const t = (i / n) * len;
      const z = amp * Math.cos((Math.PI * (t - off)) / pitch) * (parity ? -1 : 1) * (horizontal ? 1 : -1);
      pts.push(horizontal ? new Vector3(t - len / 2, 0, z) : new Vector3(0, t, z));
    }
    return new TubeGeometry(new CatmullRomCurve3(pts), n * 2, wire, 5, false);
  };
  const hLen = (cols - 1) * pitch + pitch * 1.2;
  const vLen = (rows - 1) * pitch + pitch * 1.2;
  const geos = [wave(hLen, 0, true), wave(hLen, 1, true), wave(vLen, 0, false), wave(vLen, 1, false)];
  const meshes: InstancedMesh[] = [];
  const m = new Matrix4();
  const mk = (geo: BufferGeometry, count: number) => {
    const im = new InstancedMesh(geo, mat, count);
    im.castShadow = im.receiveShadow = true;
    im.frustumCulled = false;
    meshes.push(im);
    return im;
  };
  const hEven = mk(geos[0], Math.ceil(rows / 2));
  const hOdd = mk(geos[1], Math.floor(rows / 2));
  const vEven = mk(geos[2], Math.ceil(cols / 2));
  const vOdd = mk(geos[3], Math.floor(cols / 2));
  let ie = 0;
  let io = 0;
  for (let i = 0; i < rows; i++) {
    m.makeTranslation(0, wire + i * pitch + pitch * 0.6, 0);
    if (i % 2 === 0) hEven.setMatrixAt(ie++, m);
    else hOdd.setMatrixAt(io++, m);
  }
  ie = io = 0;
  for (let j = 0; j < cols; j++) {
    m.makeTranslation(-hLen / 2 + pitch * 0.6 + j * pitch, 0, 0);
    if (j % 2 === 0) vEven.setMatrixAt(ie++, m);
    else vOdd.setMatrixAt(io++, m);
  }
  const g = new Group();
  meshes.forEach((x) => {
    x.instanceMatrix.needsUpdate = true;
    g.add(x);
  });
  const root = new Group();
  root.add(g);
  return { object: root, geos };
}

export { Vector3 };
