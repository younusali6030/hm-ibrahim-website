import {
  ACESFilmicToneMapping,
  Color,
  PCFShadowMap,
  PerspectiveCamera,
  Scene,
  SRGBColorSpace,
  WebGLRenderer,
  type Texture,
} from "three";
import { buildEnvironment, createSteels, type EnvPreset, type Steels } from "./shared";

/**
 * Shared runtime for the still-life heroes (Products, Services, Blog).
 *
 * It renders on demand: a frame is drawn when something changed (a focus tween, the pointer easing, a resize)
 * and the loop goes quiet once everything has settled, so an idle hero costs no GPU time at all.
 * Pixel ratio is capped, quality steps down on slow frames, and dispose() releases the GL context.
 */

export type SceneController = {
  start(): void;
  stop(): void;
  dispose(): void;
  onFirstFrame(cb: () => void): void;
  /** Emphasise one named part of the scene (or nothing). Optional: not every scene has parts. */
  setFocus?(key: string | null): void;
  /** Continuous scenes only: freeze or resume the motion. */
  setPaused?(paused: boolean): void;
  /** Render one frame at an exact size for poster capture. Returns a PNG data URL. */
  still?(width: number, height: number, key?: string | null): string;
};

export type SceneFactory = (o: { canvas: HTMLCanvasElement; host: HTMLElement }) => SceneController;

export type Stage = {
  renderer: WebGLRenderer;
  scene: Scene;
  camera: PerspectiveCamera;
  env: Texture;
  steels: Steels;
  mobile: boolean;
  /** Damped pointer, -1..1 from the window centre. Zero on touch devices. */
  pointer: { x: number; y: number };
  size: { w: number; h: number; aspect: number };
  invalidate(): void;
};

export type StageHooks = {
  /** Called every frame before drawing. Return true while the scene is still moving. */
  update(dt: number, stage: Stage): boolean;
  /** Called when the canvas size or aspect changes (and once at start). */
  resize?(stage: Stage): void;
  /** Emphasise a named part. The scene tweens towards it inside update(). */
  focus?(key: string | null, stage: Stage): void;
  /** Snap every tween to its target (used for stills). */
  settle?(stage: Stage): void;
  /** Called when quality is stepped down: release optional costs. */
  lowerQuality?(stage: Stage): void;
  dispose(): void;
};

export function createStage(
  opts: { canvas: HTMLCanvasElement; host: HTMLElement; env?: EnvPreset; fov?: number; exposure?: number; background?: string; maxPixelRatio?: number },
  build: (stage: Stage) => StageHooks
): SceneController {
  const { canvas, host } = opts;
  const mobile = Math.min(window.innerWidth, window.innerHeight) < 700;
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
  const maxDpr = opts.maxPixelRatio ?? (mobile ? 1.5 : 2);
  let dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
  renderer.setPixelRatio(dpr);
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = opts.exposure ?? 1.1;
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;
  const bg = new Color(opts.background ?? "#0a1017");
  renderer.setClearColor(bg, 1);

  const env = buildEnvironment(renderer, opts.env ?? "bench");
  const steels = createSteels(renderer.capabilities.getMaxAnisotropy());
  const scene = new Scene();
  scene.environment = env;
  scene.background = bg;
  const camera = new PerspectiveCamera(opts.fov ?? 28, 1.6, 0.5, 400);

  const stage: Stage = {
    renderer,
    scene,
    camera,
    env,
    steels,
    mobile,
    pointer: { x: 0, y: 0 },
    size: { w: 1, h: 1, aspect: 1 },
    invalidate: () => {
      if (running && !raf) raf = requestAnimationFrame(tick);
    },
  };
  const hooks = build(stage);

  let running = false;
  let raf = 0;
  let last = 0;
  let firstDone = false;
  let first: (() => void) | null = null;
  let tx = 0;
  let ty = 0;
  let slow = 0;
  let disposed = false;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

  const resize = (w?: number, h?: number) => {
    const cw = w ?? Math.max(2, host.clientWidth);
    const ch = h ?? Math.max(2, host.clientHeight);
    renderer.setSize(cw, ch, false);
    stage.size = { w: cw, h: ch, aspect: cw / ch };
    camera.aspect = cw / ch;
    camera.updateProjectionMatrix();
    hooks.resize?.(stage);
  };

  const draw = () => renderer.render(scene, camera);

  const tick = (now: number) => {
    raf = 0;
    if (!running || disposed) return;
    const dt = Math.min(0.1, (now - last) / 1000 || 0.016);
    last = now;
    // Pointer easing: a half-second settle, with a hard stop so it can go idle.
    const k = 1 - Math.exp(-dt * 5);
    const dx = tx - stage.pointer.x;
    const dy = ty - stage.pointer.y;
    stage.pointer.x += dx * k;
    stage.pointer.y += dy * k;
    const easing = Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001;
    const moving = hooks.update(dt, stage);
    draw();
    if (!firstDone) {
      firstDone = true;
      first?.();
    }
    if (dt > 0.034) slow++;
    else slow = Math.max(0, slow - 2);
    if (slow > 40) {
      slow = 0;
      if (dpr > 1.01) {
        dpr = Math.max(1, dpr * 0.75);
        renderer.setPixelRatio(dpr);
        resize();
      } else if (renderer.shadowMap.enabled) {
        renderer.shadowMap.enabled = false;
        hooks.lowerQuality?.(stage);
        scene.traverse((o) => {
          const m = (o as { material?: { needsUpdate: boolean } | { needsUpdate: boolean }[] }).material;
          if (Array.isArray(m)) m.forEach((x) => (x.needsUpdate = true));
          else if (m) m.needsUpdate = true;
        });
      }
    }
    if (moving || easing) raf = requestAnimationFrame(tick);
  };

  const onMove = (e: PointerEvent) => {
    tx = (e.clientX / window.innerWidth) * 2 - 1;
    ty = (e.clientY / window.innerHeight) * 2 - 1;
    stage.invalidate();
  };
  if (finePointer) window.addEventListener("pointermove", onMove, { passive: true });

  const ro = new ResizeObserver(() => {
    resize();
    if (firstDone || running) {
      if (!raf) raf = requestAnimationFrame(tick);
    }
  });
  ro.observe(host);
  resize();
  // One frame as soon as the scene exists, even before start(): the poster is replaced by a true first frame.
  hooks.update(0, stage);

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
      raf = 0;
    },
    onFirstFrame(cb) {
      if (firstDone) cb();
      else first = cb;
    },
    setFocus(key) {
      hooks.focus?.(key, stage);
      stage.invalidate();
    },
    still(width, height, key = null) {
      const prev = dpr;
      dpr = 1;
      renderer.setPixelRatio(1);
      resize(width, height);
      hooks.focus?.(key, stage);
      hooks.settle?.(stage);
      hooks.update(10, stage);
      draw();
      const url = canvas.toDataURL("image/png");
      dpr = prev;
      renderer.setPixelRatio(prev);
      resize();
      return url;
    },
    dispose() {
      disposed = true;
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      hooks.dispose();
      steels.dispose();
      env.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
