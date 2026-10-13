import {
  ACESFilmicToneMapping,
  Color,
  CustomBlending,
  DirectionalLight,
  Fog,
  Group,
  HalfFloatType,
  HemisphereLight,
  InstancedMesh,
  LinearFilter,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  NoBlending,
  OneFactor,
  OneMinusSrcAlphaFactor,
  OrthographicCamera,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  Vector2,
  Vector4,
  WebGLRenderer,
  WebGLRenderTarget,
  type BufferGeometry,
  type Material,
} from "three";
import { LINK, buildBarbedWire, buildChainLinkWires } from "./geometry";
import { buildEnvironment, zincTexture } from "../three/shared";

/* ------------------------------------------------------------------ layout */

export type LayoutName = "wide" | "tall";

type Strand = { x: number; y: number; z: number; rot: number; flip: boolean };
type Layout = {
  /** The reference frame at the focus plane, in cm. Real viewports crop it like object-fit: cover, anchored right. */
  ref: { w: number; h: number };
  dist: number;
  focus: { x: number; y: number };
  /** Screen-space dimming: dot(ndc, dir) mapped through smoothstep(from, to) between `low` and 1. */
  mask: { dir: [number, number]; from: number; to: number; low: number };
  strands: Strand[];
  chain: { x: number; y: number; z: number; rotZ: number; yaw: number };
  far: { x: number; y: number; z: number; rotZ: number; yaw: number; scale: number };
  fg: Strand;
};

const LAYOUTS: Record<LayoutName, Layout> = {
  wide: {
    ref: { w: 44, h: 16.5 },
    dist: 52,
    focus: { x: 3, y: 0 },
    mask: { dir: [1, 0.1], from: 0.08, to: 0.56, low: 0.08 },
    strands: [
      { x: 4, y: -3.4, z: 0, rot: 0.115, flip: false },
      { x: -2, y: 3.6, z: -0.6, rot: 0.07, flip: true },
    ],
    chain: { x: 6, y: 0, z: -4.6, rotZ: -0.2, yaw: -0.12 },
    far: { x: 8, y: 2, z: -24, rotZ: 0.62, yaw: 0.1, scale: 1.25 },
    fg: { x: 14, y: -6.6, z: 17, rot: 0.19, flip: false },
  },
  tall: {
    ref: { w: 20, h: 28.6 },
    dist: 50,
    focus: { x: 0, y: -2 },
    mask: { dir: [0.2, -1], from: -0.22, to: 0.5, low: 0.12 },
    strands: [
      { x: 0, y: -9.2, z: 0, rot: 0.2, flip: false },
      { x: 0, y: -14.6, z: -0.6, rot: 0.15, flip: true },
    ],
    chain: { x: 1, y: -9, z: -4.6, rotZ: -0.2, yaw: -0.1 },
    far: { x: 2, y: 0, z: -24, rotZ: 0.62, yaw: 0.1, scale: 1.25 },
    fg: { x: 9, y: -16.5, z: 15, rot: -0.12, flip: true },
  },
};


/* ------------------------------------------------------------------ screen-space calm mask */

type MaskUniforms = { uMask: { value: Vector4 }; uLow: { value: number } };

/** Dims a material in screen space, so the left of the frame stays calm whatever the camera does. */
function withMask(mat: MeshStandardMaterial, u: MaskUniforms) {
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uMask = u.uMask;
    sh.uniforms.uLow = u.uLow;
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec4 vClipP;")
      .replace("#include <project_vertex>", "#include <project_vertex>\nvClipP = gl_Position;");
    sh.fragmentShader = sh.fragmentShader
      .replace("#include <common>", "#include <common>\nvarying vec4 vClipP;\nuniform vec4 uMask;\nuniform float uLow;")
      .replace(
        "#include <tonemapping_fragment>",
        "{ vec2 ndc = vClipP.xy / vClipP.w; float mk = smoothstep(uMask.z, uMask.w, dot(ndc, uMask.xy)); gl_FragColor.rgb *= mix(uLow, 1.0, mk); }\n#include <tonemapping_fragment>"
      );
  };
  mat.customProgramCacheKey = () => "wire-mask";
}

/* ------------------------------------------------------------------ depth-of-field layers */

const BG_COLOR = new Color("#0a1017");

const BLUR_FS = `
uniform sampler2D tDiffuse; uniform vec2 uStep; varying vec2 vUv;
void main(){
  vec4 s = texture2D(tDiffuse, vUv) * 0.227027;
  s += (texture2D(tDiffuse, vUv + uStep * 1.3846) + texture2D(tDiffuse, vUv - uStep * 1.3846)) * 0.316216;
  s += (texture2D(tDiffuse, vUv + uStep * 3.2308) + texture2D(tDiffuse, vUv - uStep * 3.2308)) * 0.070270;
  gl_FragColor = s;
}`;
const QUAD_VS = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }`;
const COMPOSITE_FS = `
uniform sampler2D tDiffuse; varying vec2 vUv;
void main(){
  vec4 c = texture2D(tDiffuse, vUv);
  vec3 col = c.a > 0.0005 ? c.rgb / c.a : vec3(0.);
  gl_FragColor = vec4(col, 1.);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
  gl_FragColor = vec4(gl_FragColor.rgb * c.a, c.a);
}`;

class Layer {
  a: WebGLRenderTarget;
  b: WebGLRenderTarget;
  constructor(private scale: number) {
    const opts = { type: HalfFloatType, minFilter: LinearFilter, magFilter: LinearFilter, depthBuffer: true };
    this.a = new WebGLRenderTarget(4, 4, opts);
    this.b = new WebGLRenderTarget(4, 4, { ...opts, depthBuffer: false });
  }
  setSize(w: number, h: number) {
    const sw = Math.max(2, Math.round(w * this.scale));
    const sh = Math.max(2, Math.round(h * this.scale));
    this.a.setSize(sw, sh);
    this.b.setSize(sw, sh);
  }
  dispose() {
    this.a.dispose();
    this.b.dispose();
  }
}

/* ------------------------------------------------------------------ the scene */

export type WireSceneOptions = {
  canvas: HTMLCanvasElement;
  /** Container the canvas fills; drives size and layout. */
  host: HTMLElement;
  maxPixelRatio?: number;
  /** When false, no pointer parallax and no time-based orbit: used for stills. */
  interactive?: boolean;
};

export type WireScene = {
  start(): void;
  stop(): void;
  /** Freeze the camera drift; the pointer response stays. */
  setPaused(paused: boolean): void;
  /** Render one frame at an exact pixel size and time, for poster capture and tests. */
  still(width: number, height: number, layout: LayoutName, t?: number): string;
  onFirstFrame(cb: () => void): void;
  dispose(): void;
};

const ORBIT_PERIOD = 56; // seconds; every motion term is a multiple of this, so the loop has no seam

export function createWireScene(opts: WireSceneOptions): WireScene {
  const { canvas, host } = opts;
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
  const maxDpr = opts.maxPixelRatio ?? 2;
  let dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
  renderer.setPixelRatio(dpr);
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.autoClear = false;
  renderer.shadowMap.enabled = true;

  const env = buildEnvironment(renderer);
  const zinc = zincTexture(renderer.capabilities.getMaxAnisotropy());

  const maskU: MaskUniforms = { uMask: { value: new Vector4(1, 0, -0.6, 0.3) }, uLow: { value: 0.22 } };
  const metal = (tint: string, rough: number, k = 1) => {
    const m = new MeshStandardMaterial({
      color: new Color(tint).multiplyScalar(k),
      metalness: 0.94,
      roughness: rough,
      roughnessMap: zinc,
      bumpMap: zinc,
      bumpScale: 0.35,
      vertexColors: true,
      envMapIntensity: 1,
    });
    withMask(m, maskU);
    return m;
  };
  const matMain = metal("#c9ccce", 1.0);
  const matFar = metal("#a9aeb3", 1.0, 0.7);
  const matFg = metal("#b4b8bc", 1.0, 0.85);

  const mobile = Math.min(window.innerWidth, window.innerHeight) < 700;
  const barbed = buildBarbedWire({ length: 96, radialLine: mobile ? 8 : 12, radialBarb: mobile ? 6 : 8 });
  const links = buildChainLinkWires(24, mobile ? 6 : 8);
  const owned: BufferGeometry[] = [barbed, links.even, links.odd];

  const lights = (scene: Scene, shadow: boolean) => {
    scene.environment = env;
    scene.add(new HemisphereLight("#2a3a4d", "#05080c", 0.35));
    const key = new DirectionalLight("#fff1e0", 2.6);
    key.position.set(-14, 16, 22);
    key.target.position.set(4, 0, -2);
    scene.add(key, key.target);
    const rim = new DirectionalLight("#b4d2f2", 1.2);
    rim.position.set(20, 8, -16);
    scene.add(rim);
    if (shadow) {
      key.castShadow = true;
      key.shadow.mapSize.set(2048, 2048);
      const c = key.shadow.camera;
      c.left = -34;
      c.right = 34;
      c.top = 16;
      c.bottom = -16;
      c.near = 5;
      c.far = 70;
      key.shadow.bias = -0.0004;
      key.shadow.normalBias = 0.03;
      key.shadow.radius = 2.5;
    }
    return key;
  };

  const instanced = (geoE: BufferGeometry, geoO: BufferGeometry, mat: Material, count: number, shadow: boolean) => {
    const g = new Group();
    const half = Math.floor(count / 2);
    const even = new InstancedMesh(geoE, mat, Math.ceil(count / 2) + 1);
    const odd = new InstancedMesh(geoO, mat, Math.ceil(count / 2) + 1);
    const m = new Matrix4();
    let e = 0;
    let o = 0;
    for (let i = -half; i <= half; i++) {
      m.makeTranslation(i * LINK.d, 0, 0);
      if (i % 2 === 0) even.setMatrixAt(e++, m);
      else odd.setMatrixAt(o++, m);
    }
    even.count = e;
    odd.count = o;
    even.frustumCulled = odd.frustumCulled = false;
    even.receiveShadow = odd.receiveShadow = shadow;
    g.add(even, odd);
    return g;
  };

  // Main scene: sharp barbed wire in front of a chain link panel.
  const mainScene = new Scene();
  mainScene.fog = new Fog(BG_COLOR, 70, 150);
  const keyMain = lights(mainScene, true);
  const chainMain = instanced(links.even, links.odd, matMain, 31, true);
  mainScene.add(chainMain);
  const strandMeshes: Mesh[] = [0, 1].map(() => {
    const m = new Mesh(barbed, matMain);
    m.castShadow = true;
    m.frustumCulled = false;
    mainScene.add(m);
    return m;
  });

  // Far layer: a second mesh, further back, darker and soft.
  const farScene = new Scene();
  farScene.fog = new Fog(BG_COLOR, 30, 110);
  lights(farScene, false);
  const chainFar = instanced(links.even, links.odd, matFar, 41, false);
  farScene.add(chainFar);

  // Foreground layer: one strand close to the lens, out of focus.
  const fgScene = new Scene();
  lights(fgScene, false);
  const fgStrand = new Mesh(barbed, matFg);
  fgStrand.frustumCulled = false;
  fgScene.add(fgStrand);

  // Compositing quad.
  const quadScene = new Scene();
  const quadCam = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const quad = new Mesh(new PlaneGeometry(2, 2));
  quad.frustumCulled = false;
  quadScene.add(quad);
  const blurMat = new ShaderMaterial({
    uniforms: { tDiffuse: { value: null }, uStep: { value: new Vector2() } },
    vertexShader: QUAD_VS,
    fragmentShader: BLUR_FS,
    depthTest: false,
    depthWrite: false,
    blending: NoBlending,
  });
  const compOpaque = new ShaderMaterial({
    uniforms: { tDiffuse: { value: null } },
    vertexShader: QUAD_VS,
    fragmentShader: COMPOSITE_FS,
    depthTest: false,
    depthWrite: false,
    blending: NoBlending,
  });
  const compAlpha = new ShaderMaterial({
    uniforms: { tDiffuse: { value: null } },
    vertexShader: QUAD_VS,
    fragmentShader: COMPOSITE_FS,
    depthTest: false,
    depthWrite: false,
    transparent: true,
    blending: CustomBlending,
    blendSrc: OneFactor,
    blendDst: OneMinusSrcAlphaFactor,
  });

  const farLayer = new Layer(0.5);
  const fgLayer = new Layer(0.6);

  const camera = new PerspectiveCamera(26, 2, 1, 400);
  let layout: LayoutName = "wide";
  let aspect = 2;
  let px = 0;
  let py = 0;
  let sx = 0;
  let sy = 0;
  let time = 0;

  const applyLayout = (name: LayoutName) => {
    layout = name;
    const L = LAYOUTS[name];
    const place = (o: Mesh | Group, s: Strand) => {
      o.position.set(s.x, s.y, s.z);
      o.rotation.set(s.flip ? Math.PI : 0, 0, s.rot, "XYZ");
    };
    strandMeshes.forEach((m, i) => place(m, L.strands[i]));
    place(fgStrand, L.fg);
    fgStrand.scale.setScalar(1);
    chainMain.position.set(L.chain.x, L.chain.y, L.chain.z);
    chainMain.rotation.set(0, L.chain.yaw, L.chain.rotZ, "XYZ");
    chainFar.position.set(L.far.x, L.far.y, L.far.z);
    chainFar.rotation.set(0, L.far.yaw, L.far.rotZ, "XYZ");
    chainFar.scale.setScalar(L.far.scale);
    const [dx, dy] = L.mask.dir;
    maskU.uMask.value.set(dx, dy, L.mask.from, L.mask.to);
    maskU.uLow.value = L.mask.low;
    keyMain.shadow.needsUpdate = true;
  };

  /** Camera framing: the reference box is cropped like object-fit: cover, anchored to the right edge. */
  const frame = (t: number, nx: number, ny: number) => {
    const L = LAYOUTS[layout];
    const a0 = L.ref.w / L.ref.h;
    const visW = aspect >= a0 ? L.ref.w : L.ref.h * aspect;
    const visH = aspect >= a0 ? L.ref.w / aspect : L.ref.h;
    const anchor = (L.ref.w - visW) / 2;
    const fx = L.focus.x + anchor;
    const fy = L.focus.y;
    const w = (Math.PI * 2 * t) / ORBIT_PERIOD;
    const yaw = 0.038 * Math.sin(w) + 0.006 * Math.sin(2 * w + 1.1) - nx * 0.03;
    const pitch = 0.014 * Math.sin(w + 0.6) + 0.004 * Math.sin(2 * w) + ny * 0.018 + 0.03;
    const dist = L.dist * (1 + 0.016 * Math.sin(w + 2.1));
    // Narrower heroes put the copy across more of the frame, so the calm zone widens with them.
    const shift = layout === "wide" ? Math.max(0, 2.6 - aspect) * 0.26 : 0;
    maskU.uMask.value.set(L.mask.dir[0], L.mask.dir[1], L.mask.from + shift, L.mask.to + shift);
    camera.fov = (2 * Math.atan(visH / 2 / L.dist) * 180) / Math.PI;
    camera.aspect = aspect;
    camera.position.set(
      fx + dist * Math.sin(yaw) * Math.cos(pitch),
      fy + dist * Math.sin(pitch),
      dist * Math.cos(yaw) * Math.cos(pitch)
    );
    camera.lookAt(fx, fy, 0);
    camera.updateProjectionMatrix();
  };

  const composite = (layer: Layer, scene: Scene, radius: number, opaque: boolean) => {
    renderer.setRenderTarget(layer.a);
    if (opaque) renderer.setClearColor(BG_COLOR, 1);
    else renderer.setClearColor(0x000000, 0);
    renderer.clear();
    renderer.render(scene, camera);
    quad.material = blurMat;
    blurMat.uniforms.tDiffuse.value = layer.a.texture;
    blurMat.uniforms.uStep.value.set(radius / layer.a.width, 0);
    renderer.setRenderTarget(layer.b);
    renderer.render(quadScene, quadCam);
    blurMat.uniforms.tDiffuse.value = layer.b.texture;
    blurMat.uniforms.uStep.value.set(0, radius / layer.a.height);
    renderer.setRenderTarget(layer.a);
    renderer.render(quadScene, quadCam);
    const mat = opaque ? compOpaque : compAlpha;
    mat.uniforms.tDiffuse.value = layer.a.texture;
    quad.material = mat;
    renderer.setRenderTarget(null);
    renderer.render(quadScene, quadCam);
  };

  const draw = () => {
    renderer.setRenderTarget(null);
    renderer.setClearColor(BG_COLOR, 1);
    renderer.clear();
    composite(farLayer, farScene, 1.5, true);
    renderer.clearDepth();
    renderer.render(mainScene, camera);
    composite(fgLayer, fgScene, 1.9, false);
  };

  const resize = (w?: number, h?: number, force?: LayoutName) => {
    const cw = w ?? Math.max(2, host.clientWidth);
    const ch = h ?? Math.max(2, host.clientHeight);
    renderer.setSize(cw, ch, false);
    const bw = cw * dpr;
    const bh = ch * dpr;
    farLayer.setSize(bw, bh);
    fgLayer.setSize(bw, bh);
    aspect = cw / ch;
    const next: LayoutName = force ?? (cw < 700 ? "tall" : "wide");
    if (next !== layout || !applied) {
      applied = true;
      applyLayout(next);
    }
  };
  let applied = false;

  /* ---- loop & lifecycle ---- */
  let raf = 0;
  let running = false;
  let last = 0;
  let framesSlow = 0;
  let paused = false;
  let first: (() => void) | null = null;
  let firstDone = false;
  const interactive = opts.interactive !== false;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

  const onMove = (e: PointerEvent) => {
    px = (e.clientX / window.innerWidth) * 2 - 1;
    py = (e.clientY / window.innerHeight) * 2 - 1;
  };
  if (interactive && finePointer) window.addEventListener("pointermove", onMove, { passive: true });

  const tick = (now: number) => {
    if (!running) return;
    raf = requestAnimationFrame(tick);
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    if (!paused) time += dt;
    const k = 1 - Math.exp(-dt * 3);
    sx += (px - sx) * k;
    sy += (py - sy) * k;
    frame(time, sx, sy);
    draw();
    if (!firstDone) {
      firstDone = true;
      first?.();
    }
    // Quality adaptation: sustained slow frames step the pixel ratio down, then drop shadows.
    if (dt > 0.026) framesSlow++;
    else framesSlow = Math.max(0, framesSlow - 2);
    if (framesSlow > 45) {
      framesSlow = 0;
      if (dpr > 1.01) {
        dpr = Math.max(1, dpr * 0.75);
        renderer.setPixelRatio(dpr);
        resize();
      } else if (renderer.shadowMap.enabled) {
        renderer.shadowMap.enabled = false;
        keyMain.castShadow = false;
        mainScene.traverse((o) => {
          const m = (o as Mesh).material as Material | undefined;
          if (m) m.needsUpdate = true;
        });
      }
    }
  };

  const ro = new ResizeObserver(() => {
    resize();
    if (!running && firstDone) {
      frame(time, sx, sy);
      draw();
    }
  });
  ro.observe(host);
  resize();

  return {
    start() {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    },
    stop() {
      running = false;
      cancelAnimationFrame(raf);
    },
    setPaused(p) {
      paused = p;
    },
    onFirstFrame(cb) {
      if (firstDone) cb();
      else first = cb;
    },
    still(width, height, name, t = 0) {
      const prevDpr = dpr;
      dpr = 1;
      renderer.setPixelRatio(1);
      resize(width, height, name);
      frame(t, 0, 0);
      draw();
      const url = canvas.toDataURL("image/png");
      dpr = prevDpr;
      renderer.setPixelRatio(dpr);
      applied = false;
      resize();
      return url;
    },
    dispose() {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      owned.forEach((g) => g.dispose());
      [matMain, matFar, matFg, blurMat, compOpaque, compAlpha].forEach((m) => m.dispose());
      quad.geometry.dispose();
      zinc.dispose();
      env.dispose();
      farLayer.dispose();
      fgLayer.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
