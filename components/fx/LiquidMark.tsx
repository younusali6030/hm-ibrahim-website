"use client";

import { useEffect, useRef, useState } from "react";
import { FULLSCREEN_VS, bindQuad, makeProgram, motionAllowed } from "./gl";

const FS = `
precision mediump float;
varying vec2 vUv;
uniform sampler2D uMark;
uniform vec2 uTexel;
uniform float uTime;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h(i), h(i + vec2(1., 0.)), f.x), mix(h(i + vec2(0., 1.)), h(i + vec2(1., 1.)), f.x), f.y);
}
float height(vec2 uv){
  float a = 0.;
  for (int x = -2; x <= 2; x++) for (int y = -2; y <= 2; y++) a += texture2D(uMark, uv + vec2(float(x), float(y)) * uTexel * 2.2).a;
  return a / 25.;
}
void main(){
  vec2 uv = vec2(vUv.x, 1. - vUv.y);
  float alpha = texture2D(uMark, uv).a;
  if (alpha < 0.01) { gl_FragColor = vec4(0.); return; }
  float e = 1.5;
  float hx = height(uv + vec2(uTexel.x * e, 0.)) - height(uv - vec2(uTexel.x * e, 0.));
  float hy = height(uv + vec2(0., uTexel.y * e)) - height(uv - vec2(0., uTexel.y * e));
  vec3 N = normalize(vec3(-hx * 5., -hy * 5., 0.35));
  float t = uTime * 0.18;
  // Reflect a slow, warped steel horizon: dark floor, bright band, one warm edge.
  float env = n(N.xy * 2.4 + vec2(t, -t * 0.7) + uv * 1.6);
  float band = smoothstep(0.25, 0.85, env + N.y * 0.6);
  vec3 steel = mix(vec3(0.28, 0.33, 0.39), vec3(0.93, 0.95, 0.97), band);
  float rim = smoothstep(0.55, 1.0, n(N.xy * 3.1 - vec2(t * 1.4, t)));
  steel += vec3(0.98, 0.45, 0.09) * 0.22 * rim * (1. - band);
  gl_FragColor = vec4(steel * alpha, alpha);
}`;

/**
 * The HM wordmark as liquid steel. Used once, as the footer seal. The plain white PNG is always in the page;
 * the canvas draws over it only when motion is allowed and WebGL works.
 */
export function LiquidMark({ width = 320, className = "" }: { width?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);
  const ratio = 301 / 1000;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !motionAllowed()) return;
    const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false });
    if (!gl) return;
    const prog = makeProgram(gl, FULLSCREEN_VS, FS);
    if (!prog) return;
    gl.useProgram(prog);
    bindQuad(gl, prog);
    const uTime = gl.getUniformLocation(prog, "uTime");
    let raf = 0;
    let stopped = false;
    let visible = false;
    const t0 = performance.now();

    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      if (stopped) return;
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.uniform1i(gl.getUniformLocation(prog, "uMark"), 0);
      gl.uniform2f(gl.getUniformLocation(prog, "uTexel"), 1 / img.width, 1 / img.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(width * ratio * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      const draw = (now: number) => {
        raf = 0;
        if (stopped || !visible || document.hidden) return;
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform1f(uTime, (now - t0) / 1000);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        raf = requestAnimationFrame(draw);
      };
      const io = new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        if (visible && !raf) raf = requestAnimationFrame(draw);
      });
      io.observe(canvas);
      setLive(true);
      cleanup = () => io.disconnect();
    };
    let cleanup = () => {};
    img.src = "/fx/hm-mark.png";
    return () => {
      stopped = true;
      cleanup();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [width, ratio]);

  return (
    <div className={`relative ${className}`} style={{ width, aspectRatio: "1000 / 301" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/fx/hm-mark.png"
        alt="H M Ibrahim & Co, since 1939"
        width={1000}
        height={301}
        loading="lazy"
        decoding="async"
        className={"absolute inset-0 h-full w-full object-contain transition-opacity duration-500 " + (live ? "opacity-0" : "opacity-90")}
      />
      <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden="true" />
    </div>
  );
}
