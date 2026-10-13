import type { SceneFactory } from "../three/stage";
import { createWireScene } from "./scene";

/** Adapter so the Brands scene loads through the shared SceneHost. */
const createScene: SceneFactory = ({ canvas, host }) => {
  const s = createWireScene({ canvas, host });
  return {
    start: () => s.start(),
    stop: () => s.stop(),
    dispose: () => s.dispose(),
    onFirstFrame: (cb) => s.onFirstFrame(cb),
    setPaused: (p) => s.setPaused(p),
    still: (w, h) => s.still(w, h, w >= h ? "wide" : "tall"),
  };
};
export default createScene;
