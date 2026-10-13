import {
  BoxGeometry,
  CanvasTexture,
  CylinderGeometry,
  DirectionalLight,
  Fog,
  Group,
  HemisphereLight,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  RepeatWrapping,
  SRGBColorSpace,
  SpotLight,
  Vector3,
  type BufferGeometry,
  type Material,
} from "three";
import { createStage, type SceneFactory } from "../three/stage";
import { contactShadowTexture } from "../three/shared";
import { contactShadow, perforatedSheet, ribbedBar, wireCoil, wovenPanel } from "../three/parts";

/**
 * "Understand the material before you order." A dark inspection desk: a drafting-grid sheet with a woven mesh
 * sample, a perforated-sheet sample, the cut end of a ribbed bar held by a vernier caliper, and a small coil of
 * wire. Focus keys: wire, mesh, steel, sheet. The caliper shows a scale but never a reading.
 */

type Key = "wire" | "mesh" | "steel" | "sheet";

const FOCUS: Record<Key, { at: [number, number, number]; spread: number }> = {
  wire: { at: [21, 1.5, 9], spread: 9 },
  mesh: { at: [-13, 0.5, -4], spread: 12 },
  steel: { at: [2, 3, 7], spread: 9 },
  sheet: { at: [14, 0.3, -6], spread: 11 },
};

function gridTexture(maxAniso: number) {
  const W = 1024;
  const H = 720;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d")!;
  g.fillStyle = "#a3aeb8";
  g.fillRect(0, 0, W, H);
  g.strokeStyle = "rgba(40,70,100,0.30)";
  g.lineWidth = 1;
  for (let x = 0; x <= W; x += 16) {
    g.beginPath();
    g.moveTo(x, 0);
    g.lineTo(x, H);
    g.stroke();
  }
  for (let y = 0; y <= H; y += 16) {
    g.beginPath();
    g.moveTo(0, y);
    g.lineTo(W, y);
    g.stroke();
  }
  g.strokeStyle = "rgba(40,70,100,0.5)";
  g.lineWidth = 1.6;
  for (let x = 0; x <= W; x += 80) {
    g.beginPath();
    g.moveTo(x, 0);
    g.lineTo(x, H);
    g.stroke();
  }
  for (let y = 0; y <= H; y += 80) {
    g.beginPath();
    g.moveTo(0, y);
    g.lineTo(W, y);
    g.stroke();
  }
  // Border and a title block as plain rectangles: a drawing sheet with nothing written on it.
  g.strokeStyle = "rgba(30,45,60,0.8)";
  g.lineWidth = 4;
  g.strokeRect(22, 22, W - 44, H - 44);
  g.strokeRect(W - 300, H - 130, 278, 108);
  g.beginPath();
  g.moveTo(W - 300, H - 76);
  g.lineTo(W - 22, H - 76);
  g.stroke();
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = Math.min(8, maxAniso);
  return t;
}

/** Caliper beam scale: 1 mm ticks with longer 5 and 10 mm marks, and no numerals. */
function scaleTexture(maxAniso: number) {
  const W = 2048;
  const H = 96;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d")!;
  g.fillStyle = "#d9dcde";
  g.fillRect(0, 0, W, H);
  g.fillStyle = "#1b2026";
  const n = 240;
  for (let i = 0; i <= n; i++) {
    const x = (i / n) * W;
    const len = i % 10 === 0 ? 44 : i % 5 === 0 ? 32 : 22;
    g.fillRect(x - 1, 0, 2, len);
  }
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = Math.min(8, maxAniso);
  t.wrapS = t.wrapT = RepeatWrapping;
  return t;
}

const createBlogScene: SceneFactory = ({ canvas, host }) =>
  createStage({ canvas, host, env: "bench", fov: 24, exposure: 1.1 }, (stage) => {
    const { scene, camera, steels, mobile } = stage;
    const aniso = stage.renderer.capabilities.getMaxAnisotropy();
    const geos: BufferGeometry[] = [];
    const mats: Material[] = [];
    const textures: CanvasTexture[] = [];
    const track = <M extends Material>(m: M) => (mats.push(m), m);

    const deskGeo = new PlaneGeometry(420, 300);
    const desk = new Mesh(deskGeo, steels.counter);
    desk.rotation.x = -Math.PI / 2;
    desk.receiveShadow = true;
    geos.push(deskGeo);
    scene.add(desk);
    scene.fog = new Fog("#0b1118", 90, 230);

    const world = new Group();
    scene.add(world);
    const shadowTex = contactShadowTexture();
    const pools: { geo: BufferGeometry; mat: Material }[] = [];
    const pool = (x: number, z: number, w: number, d: number, rot = 0, o = 0.75) => {
      const c = contactShadow(shadowTex, w, d, o);
      c.mesh.position.set(x, 0.02, z);
      c.mesh.rotation.z = rot;
      world.add(c.mesh);
      pools.push({ geo: c.geo, mat: c.mat });
    };

    // --- Drafting sheet.
    const gridTex = gridTexture(aniso);
    textures.push(gridTex);
    const paperGeo = new BoxGeometry(44, 0.12, 31);
    geos.push(paperGeo);
    const paperMat = track(new MeshStandardMaterial({ map: gridTex, color: "#9ea4aa", roughness: 0.93, metalness: 0 }));
    const paper = new Mesh(paperGeo, paperMat);
    paper.position.set(-3, 0.06, -1);
    paper.rotation.y = 0.1;
    paper.receiveShadow = paper.castShadow = true;
    world.add(paper);
    pool(-3, -1, 50, 37, 0.1, 0.55);
    const PAPER_Y = 0.12;

    // --- Mesh sample, flat on the sheet.
    const mesh = wovenPanel({ w: 13, h: 13, pitch: 1.0, wire: 0.085, mat: steels.galvanized });
    geos.push(...mesh.geos);
    const meshHolder = new Group();
    mesh.object.rotation.x = Math.PI / 2;
    mesh.object.position.set(0, 0.1, -6.5);
    meshHolder.add(mesh.object);
    meshHolder.position.set(-14.5, PAPER_Y, -2);
    meshHolder.rotation.y = 0.25;
    world.add(meshHolder);

    // --- Perforated sheet sample.
    const sheet = perforatedSheet({ w: 15, d: 11, thick: 0.25, hole: 0.7, pitch: 1.5, margin: 1.2, mat: steels.cut });
    geos.push(...sheet.geos);
    sheet.object.position.set(13, PAPER_Y + 0.0, -7.5);
    sheet.object.rotation.y = -0.3;
    world.add(sheet.object);
    pool(13, -7.5, 19, 15, 0.3, 0.7);

    // --- Ribbed bar end, standing, held by the caliper jaws.
    const bar = ribbedBar({ length: 5.2, radius: 1.15, mat: steels.rolled, endMat: steels.cut });
    geos.push(...bar.geos);
    const barStand = new Group();
    bar.object.rotation.z = Math.PI / 2;
    bar.object.position.set(1.15, 0, 0);
    barStand.add(bar.object);
    barStand.position.set(1, PAPER_Y, 7.6);
    world.add(barStand);
    pool(1.2, 8, 7, 7, 0, 0.9);

    // --- Vernier caliper lying flat, jaws closed on the bar's foot.
    const cal = new Group();
    const scaleTex = scaleTexture(aniso);
    textures.push(scaleTex);
    const beamGeo = new BoxGeometry(19, 0.34, 2.1);
    geos.push(beamGeo);
    const beamMats = [steels.cut, steels.cut, track(new MeshStandardMaterial({ map: scaleTex, metalness: 0.6, roughness: 0.5 })), steels.cut, steels.cut, steels.cut];
    const beam = new Mesh(beamGeo, beamMats);
    beam.position.set(9.5 - 0.3, 0.17, 0);
    beam.castShadow = beam.receiveShadow = true;
    cal.add(beam);
    const jawGeo = new BoxGeometry(0.55, 0.34, 6.2);
    geos.push(jawGeo);
    const fixedJaw = new Mesh(jawGeo, steels.cut);
    fixedJaw.position.set(-0.3, 0.17, 2.05);
    fixedJaw.castShadow = true;
    cal.add(fixedJaw);
    const slideGeo = new BoxGeometry(5.2, 0.62, 2.6);
    geos.push(slideGeo);
    const slider = new Mesh(slideGeo, steels.cut);
    slider.position.set(2.3 + 0.3 + 2.6, 0.31, 0);
    slider.castShadow = true;
    cal.add(slider);
    const slideJaw = new Mesh(jawGeo, steels.cut);
    slideJaw.position.set(2.3 + 0.3 + 0.28, 0.17, 2.05);
    slideJaw.castShadow = true;
    cal.add(slideJaw);
    const wheelGeo = new CylinderGeometry(0.75, 0.75, 0.5, 28);
    geos.push(wheelGeo);
    const wheel = new Mesh(wheelGeo, steels.mill);
    wheel.position.set(2.6 + 3.4, 0.85, 0.3);
    cal.add(wheel);
    // Jaw gap = bar diameter (2.3 cm): the bar centre sits half-way between the jaw faces.
    cal.position.set(1 - 1.15 - 0.55, PAPER_Y, 5.2 - 2.05 + 0.2);
    cal.rotation.y = 0.0;
    world.add(cal);
    pool(6, 5.6, 24, 6, 0, 0.6);

    // --- A small coil of wire, front right.
    const coil = wireCoil({ inner: 2.6, outer: 4.6, height: 2.6, wire: 0.1, mat: steels.galvanized, seed: 5 });
    geos.push(...coil.geos);
    coil.object.position.set(21.5, 0, 6.5);
    coil.object.rotation.y = 0.4;
    world.add(coil.object);
    pool(21.5, 6.8, 12.5, 12.5, 0, 0.85);

    // --- Light.
    const hemi = new HemisphereLight("#3d5066", "#06090d", 0.5);
    const key = new DirectionalLight("#fff0dd", 3.0);
    key.position.set(-34, 56, 40);
    key.castShadow = true;
    key.shadow.mapSize.set(mobile ? 1024 : 2048, mobile ? 1024 : 2048);
    const sc = key.shadow.camera;
    sc.left = -46;
    sc.right = 46;
    sc.top = 36;
    sc.bottom = -36;
    sc.near = 10;
    sc.far = 180;
    key.shadow.bias = -0.0005;
    key.shadow.normalBias = 0.05;
    const rim = new DirectionalLight("#b4d2f2", 1.2);
    rim.position.set(44, 22, -40);
    const spot = new SpotLight("#ffe8cf", 0, 140, 0.34, 0.85, 1.2);
    spot.position.set(-4, 60, 38);
    scene.add(hemi, key, key.target, rim, spot, spot.target);

    let focusKey: Key | null = null;
    let amt = 0;
    let amtTarget = 0;
    const lookFrom = new Vector3(1, 1.5, 2);
    const lookNow = new Vector3();
    let fitDist = 100;
    let fitA = 0;
    const compute = () => {
      const a = stage.size.aspect;
      const tanH = Math.tan((camera.fov * Math.PI) / 360);
      fitDist = Math.max(13.5 / tanH, 26 / (tanH * a));
      fitA = a;
    };
    const apply = () => {
      const f = focusKey ? FOCUS[focusKey] : null;
      const want = f ? new Vector3(...f.at) : lookFrom;
      lookNow.lerpVectors(lookFrom, want, amt * 0.18);
      const d = fitDist * (1 - amt * 0.07);
      const yaw = -0.12 + stage.pointer.x * 0.05;
      const elev = 0.82 - amt * 0.03 + stage.pointer.y * 0.02;
      camera.position.set(
        lookNow.x + Math.sin(yaw) * d * Math.cos(elev),
        lookNow.y + Math.sin(elev) * d,
        lookNow.z + Math.cos(yaw) * d * Math.cos(elev)
      );
      camera.lookAt(lookNow);
      key.intensity = 3.0 - amt * 0.7;
      hemi.intensity = 0.5 - amt * 0.15;
      spot.intensity = amt * 5.2;
      if (f) {
        spot.target.position.set(...f.at);
        spot.angle = Math.atan2(f.spread, 90);
      }
    };

    return {
      update(dt, st) {
        if (fitA !== st.size.aspect) compute();
        const k = dt === 0 ? 1 : 1 - Math.exp(-dt * 6.5);
        amt += (amtTarget - amt) * k;
        const moving = Math.abs(amtTarget - amt) > 0.002;
        if (!moving) amt = amtTarget;
        apply();
        return moving;
      },
      resize: compute,
      focus(key) {
        const mapped = key === "wire" || key === "mesh" || key === "steel" || key === "sheet" ? (key as Key) : null;
        if (mapped) focusKey = mapped;
        amtTarget = mapped ? 1 : 0;
      },
      settle() {
        amt = amtTarget;
      },
      lowerQuality() {
        key.castShadow = false;
      },
      dispose() {
        geos.forEach((g) => g.dispose());
        mats.forEach((m) => m.dispose());
        textures.forEach((t) => t.dispose());
        pools.forEach((p) => {
          p.geo.dispose();
          p.mat.dispose();
        });
        shadowTex.dispose();
        key.shadow.map?.dispose();
        scene.clear();
      },
    };
  });

export default createBlogScene;
