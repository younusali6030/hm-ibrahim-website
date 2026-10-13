import {
  BoxGeometry,
  DirectionalLight,
  Fog,
  Group,
  HemisphereLight,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  SpotLight,
  Vector3,
  type BufferGeometry,
  type Material,
} from "three";
import { createStage, type SceneFactory } from "../three/stage";
import { contactShadowTexture } from "../three/shared";
import { angleSection, brightBar, contactShadow, perforatedSheet, ribbedBar, wireCoil, wovenPanel } from "../three/parts";

/**
 * "The range, laid out on the counter."
 * A still life on a dark matte counter: ribbed TMT bar, bright round bar, MS angle, perforated sheet,
 * a wire coil and an upright mesh sample. Focus keys: tmt, angle, bright, sheet, coil, mesh.
 */

export type ProductsFocus = "structural" | "mesh" | "sheet" | "coil";

/** Where each focus group looks: centre of attention in scene space and the parts that belong to it. */
const FOCUS: Record<ProductsFocus, { at: [number, number, number]; spread: number }> = {
  structural: { at: [-4, 1.5, 12], spread: 20 },
  mesh: { at: [8, 11, -12], spread: 17 },
  sheet: { at: [-21, 0.5, -1], spread: 14 },
  coil: { at: [22, 2, 6], spread: 11 },
};

const createProductsScene: SceneFactory = ({ canvas, host }) =>
  createStage({ canvas, host, env: "bench", fov: 26, exposure: 1.12 }, (stage) => {
    const { scene, camera, steels, mobile } = stage;
    const geos: BufferGeometry[] = [];
    const mats: Material[] = [];
    const own = <T extends { geos: BufferGeometry[] }>(p: T) => (geos.push(...p.geos), p);

    // Counter: one big dark plane that fades into the background fog at the back.
    const counterGeo = new PlaneGeometry(420, 300);
    const counter = new Mesh(counterGeo, steels.counter);
    counter.rotation.x = -Math.PI / 2;
    counter.receiveShadow = true;
    geos.push(counterGeo);
    scene.add(counter);
    scene.fog = new Fog("#0b1118", 90, 230);

    const world = new Group();
    scene.add(world);

    const shadowTex = contactShadowTexture();
    const pools: { geo: BufferGeometry; mat: Material }[] = [];
    const pool = (x: number, z: number, w: number, d: number, rot = 0, o = 0.75) => {
      const c = contactShadow(shadowTex, w, d, o);
      c.mesh.position.x = x;
      c.mesh.position.z = z;
      c.mesh.rotation.z = rot;
      world.add(c.mesh);
      pools.push({ geo: c.geo, mat: c.mat });
    };

    // --- TMT bar, short, on the front left, a little off square.
    const tmt = own(ribbedBar({ length: 36, radius: 1.15, mat: steels.rolled, endMat: steels.cut }));
    tmt.object.position.set(-26, 0, 17);
    tmt.object.rotation.y = 0.12;
    world.add(tmt.object);
    pool(-8, 17.4, 44, 5.5, -0.12, 0.8);

    // --- Bright round bar, behind it, longer reflections.
    const bright = own(brightBar({ length: 34, radius: 1.0, mat: steels.bright }));
    bright.object.position.set(-24, 0, 11.4);
    bright.object.rotation.y = 0.07;
    world.add(bright.object);
    pool(-7, 11.6, 42, 4.6, -0.07, 0.7);

    // --- MS angle: lies on one leg, its L-shaped end turned towards the viewer.
    const angle = own(angleSection({ length: 17, leg: 5.4, thick: 0.75, mat: steels.mill }));
    const angleGroup = new Group();
    angleGroup.add(angle.object);
    // Length axis is +x; yaw it so the end faces the camera at roughly 35 degrees.
    angleGroup.rotation.y = -1.18;
    angleGroup.position.set(7.5, 0, 6.5);
    world.add(angleGroup);
    pool(7.5, 3, 11, 24, 0.0, 0.8);

    // --- Perforated sheet: two plates, the top one turned so the thickness and holes read.
    const sheetMat = steels.cut;
    const sheetA = own(perforatedSheet({ w: 24, d: 17, thick: 0.28, hole: 0.8, pitch: 1.75, margin: 1.4, mat: sheetMat }));
    sheetA.object.position.set(-19.5, 0, -3);
    sheetA.object.rotation.y = 0.16;
    const sheetB = own(perforatedSheet({ w: 24, d: 17, thick: 0.28, hole: 0.8, pitch: 1.75, margin: 1.4, mat: sheetMat }));
    sheetB.object.position.set(-17.9, 0.5, -3.7);
    sheetB.object.rotation.y = -0.07;
    world.add(sheetA.object, sheetB.object);
    pool(-19, -3.3, 31, 24, 0.12, 0.8);

    // --- Wire coil, galvanized, front right.
    const coil = own(wireCoil({ inner: 4.2, outer: 7.4, height: 4.2, wire: 0.13, mat: steels.galvanized }));
    coil.object.position.set(23.5, 0, 8);
    coil.object.rotation.y = 0.5;
    world.add(coil.object);
    pool(23.5, 8.6, 20, 20, 0, 0.85);

    // --- Upright mesh sample on two steel feet.
    const mesh = own(wovenPanel({ w: 28, h: 22, pitch: 1.35, wire: 0.1, mat: steels.galvanized }));
    const meshGroup = new Group();
    meshGroup.add(mesh.object);
    meshGroup.position.set(8, 0.9, -14);
    meshGroup.rotation.set(-0.07, -0.12, 0);
    world.add(meshGroup);
    const footGeo = new BoxGeometry(4.2, 1.3, 2.6);
    geos.push(footGeo);
    const footMat = steels.mill;
    for (const dx of [-8, 8]) {
      const foot = new Mesh(footGeo, footMat);
      foot.position.set(8 + dx * 0.98 + 0.4, 0.65, -14 + dx * 0.12);
      foot.rotation.y = -0.12;
      foot.castShadow = foot.receiveShadow = true;
      world.add(foot);
    }
    pool(8, -14.4, 32, 6, -0.12, 0.7);

    // --- Light: soft warm key from the front left, a cool strip behind, one emphasis spot.
    const hemi = new HemisphereLight("#3d5066", "#06090d", 0.5);
    const key = new DirectionalLight("#fff0dd", 3.0);
    key.position.set(-38, 62, 44);
    key.target.position.set(0, 0, 0);
    key.castShadow = true;
    key.shadow.mapSize.set(mobile ? 1024 : 2048, mobile ? 1024 : 2048);
    const sc = key.shadow.camera;
    sc.left = -50;
    sc.right = 50;
    sc.top = 38;
    sc.bottom = -38;
    sc.near = 10;
    sc.far = 180;
    key.shadow.bias = -0.0005;
    key.shadow.normalBias = 0.05;
    key.shadow.radius = 4;
    const rim = new DirectionalLight("#b4d2f2", 1.4);
    rim.position.set(46, 24, -44);
    const spot = new SpotLight("#ffe8cf", 0, 140, 0.34, 0.85, 1.2);
    spot.position.set(-6, 64, 40);
    scene.add(hemi, key, key.target, rim, spot, spot.target);

    // --- Camera framing: a 3/4 view from above and in front, with a damped pointer yaw.
    const BASE = new Vector3(0, 0, 0);
    let focusKey: ProductsFocus | null = null;
    let amt = 0; // 0 = whole assortment, 1 = fully focused
    let amtTarget = 0;
    let lookFrom = new Vector3(0, 3, 4);
    const lookNow = new Vector3();
    const posNow = new Vector3();
    let fitW = 0;
    let fitDist = 100;

    const compute = () => {
      const a = stage.size.aspect;
      const tanH = Math.tan((camera.fov * Math.PI) / 360);
      // The assortment spans about 78 cm wide and 56 deep; fit both, with air.
      const byH = 22 / tanH;
      const byW = 35.5 / (tanH * a);
      fitDist = Math.max(byH, byW);
      fitW = a;
    };

    const SET_FOCUS: Record<string, ProductsFocus> = { structural: "structural", tmt: "structural", angle: "structural", bright: "structural", mesh: "mesh", sheet: "sheet", coil: "coil" };

    const apply = (stage_: typeof stage, snap = false) => {
      const f = focusKey ? FOCUS[focusKey] : null;
      const want = f ? new Vector3(...f.at) : lookFrom;
      lookNow.lerpVectors(lookFrom, want, amt * 0.25);
      const dolly = 1 - amt * 0.06;
      const elev = 0.74 - amt * 0.04;
      const yaw = -0.04 + stage_.pointer.x * 0.06;
      const pitchAdj = stage_.pointer.y * 0.025;
      const d = fitDist * dolly;
      posNow.set(
        lookNow.x + Math.sin(yaw) * d * Math.cos(elev + pitchAdj),
        lookNow.y + Math.sin(elev + pitchAdj) * d,
        lookNow.z + Math.cos(yaw) * d * Math.cos(elev + pitchAdj)
      );
      camera.position.copy(posNow);
      camera.lookAt(lookNow);
      // Lighting follows the focus: the key eases back a touch, the spot comes up on the part.
      key.intensity = 3.0 - amt * 0.7;
      hemi.intensity = 0.5 - amt * 0.15;
      spot.intensity = amt * 5.2;
      if (f) {
        spot.target.position.set(...f.at);
        spot.angle = Math.atan2(f.spread, 90);
      }
      if (snap) amt = amtTarget;
    };

    const baseLook = () => {
      lookFrom.copy(BASE).add(new Vector3(1.5, 2.2, 3));
    };
    baseLook();

    return {
      update(dt, st) {
        if (fitW !== st.size.aspect) compute();
        // Ease amt towards its target with a ~0.45 s time constant.
        const k = 1 - Math.exp(-dt * 6.5);
        amt += (amtTarget - amt) * (dt === 0 ? 1 : k);
        const settling = Math.abs(amtTarget - amt) > 0.002;
        if (!settling) amt = amtTarget;
        apply(st);
        return settling;
      },
      resize() {
        compute();
      },
      focus(key) {
        const mapped = key ? SET_FOCUS[key] ?? null : null;
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
        pools.forEach((p) => {
          p.geo.dispose();
          p.mat.dispose();
        });
        shadowTex.dispose();
        (steels.counter as MeshStandardMaterial).dispose();
        key.shadow.map?.dispose();
        scene.clear();
      },
    };
  });

export default createProductsScene;
