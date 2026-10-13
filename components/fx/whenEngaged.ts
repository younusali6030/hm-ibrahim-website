/**
 * Runs `cb` once, on the visitor's first touch, key, scroll or pointer move, or after `fallbackMs` if they only
 * look. Used to start the three.js heroes: the posters are complete pictures, and ~1 s of WebGL set-up on a
 * mid-range phone should not land in the load-time rush (first paint, LCP, the first tap).
 * Returns a cancel function. The callback is deferred to an idle slot so an input handler never runs it inline.
 */
const INPUTS = ["pointerdown", "pointermove", "keydown", "scroll", "touchstart", "wheel"] as const;

export function whenEngaged(cb: () => void, fallbackMs = 12000): () => void {
  let done = false;
  let timer = 0;
  let idle = 0;
  const win = window as unknown as {
    requestIdleCallback?: (fn: () => void, o?: { timeout: number }) => number;
    cancelIdleCallback?: (h: number) => void;
  };
  const cleanup = () => {
    INPUTS.forEach((e) => window.removeEventListener(e, go));
    window.clearTimeout(timer);
  };
  function go() {
    if (done) return;
    done = true;
    cleanup();
    if (win.requestIdleCallback) idle = win.requestIdleCallback(cb, { timeout: 1000 });
    else timer = window.setTimeout(cb, 0);
  }
  INPUTS.forEach((e) => window.addEventListener(e, go, { once: true, passive: true }));
  timer = window.setTimeout(go, fallbackMs);
  return () => {
    done = true;
    cleanup();
    window.clearTimeout(timer);
    if (idle && win.cancelIdleCallback) win.cancelIdleCallback(idle);
  };
}
