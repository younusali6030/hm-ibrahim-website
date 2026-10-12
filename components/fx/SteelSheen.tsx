"use client";

import { useEffect, useRef } from "react";
import { FULLSCREEN_VS, bindQuad, makeProgram, motionAllowed } from "./gl";

const FS = `
precision mediump float;
varying vec2 vUv;
uniform vec2 uRes;
uniform float uTime;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h(i), h(i + vec2(1., 0.)), f.x), mix(h(i + vec2(0., 1.)), h(i + vec2(1., 1.)), f.x), f.y);
}
void main(){
  vec2 uv = vUv;
  float t = uTime * 0.035;
  float d = uv.x * 0.9 + uv.y * 0.35;
  float band = n(vec2(d * 3.2 - t * 2.0, uv.y * 1.3));
  float sheen = smoothstep(0.52, 0.98, band);
  float brush = n(vec2(uv.x * 2.5, uv.y * uRes.y * 0.35));
  vec3 base = vec3(0.055, 0.086, 0.118);
  vec3 hi = vec3(0.30, 0.37, 0.45);
  vec3 col = mix(base, hi, sheen * 0.5) + (brush - 0.5) * 0.028;
  col += vec3(0.98, 0.45, 0.09) * 0.035 * smoothstep(0.72, 1.0, n(vec2(d * 2.0 + t * 3.0, 4.0)));
  gl_FragColor = vec4(col, 1.);
}`;

/**
 * One slow steel sheen behind a page hero, drawn at half resolution. The CSS gradient underneath is the whole
 * effect for reduced-motion, Save-Data, slow connections and browsers without WebGL.
 */
export function SteelSheen({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !motionAllowed()) return;
    const gl = canvas.getContext("webgl", { antialias: false, powerPreference: "low-power" });
    if (!gl) return;
    const prog = makeProgram(gl, FULLSCREEN_VS, FS);
    if (!prog) return;
    gl.useProgram(prog);
    bindQuad(gl, prog);
    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");

    let raf = 0;
    let visible = true;
    const t0 = performance.now();
    const size = () => {
      const w = Math.max(2, Math.round(canvas.clientWidth * 0.5));
      const hgt = Math.max(2, Math.round(canvas.clientHeight * 0.5));
      if (canvas.width !== w || canvas.height !== hgt) {
        canvas.width = w;
        canvas.height = hgt;
        gl.viewport(0, 0, w, hgt);
      }
      gl.uniform2f(uRes, w, hgt);
    };
    const draw = (now: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      size();
      gl.uniform1f(uTime, (now - t0) / 1000);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(draw);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(draw);
    });
    io.observe(canvas);
    canvas.dataset.live = "1";
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className={`steel-sheen-fallback ${className}`} aria-hidden="true">
      <canvas ref={ref} className="h-full w-full" />
    </div>
  );
}
