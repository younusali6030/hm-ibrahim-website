/** Shared helpers for the two small WebGL effects. No library: each shader is a few dozen lines. */

export function motionAllowed(): boolean {
  if (typeof window === "undefined") return false;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const c = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  if (c?.saveData) return false;
  if (c?.effectiveType && /(^|-)(2g|3g)$/.test(c.effectiveType)) return false;
  return true;
}

export function makeProgram(gl: WebGLRenderingContext, vs: string, fs: string): WebGLProgram | null {
  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
  };
  const v = compile(gl.VERTEX_SHADER, vs);
  const f = compile(gl.FRAGMENT_SHADER, fs);
  if (!v || !f) return null;
  const p = gl.createProgram()!;
  gl.attachShader(p, v);
  gl.attachShader(p, f);
  gl.linkProgram(p);
  return gl.getProgramParameter(p, gl.LINK_STATUS) ? p : null;
}

export const FULLSCREEN_VS = `attribute vec2 p; varying vec2 vUv; void main(){ vUv = p*0.5+0.5; gl_Position = vec4(p,0.,1.); }`;

export function bindQuad(gl: WebGLRenderingContext, prog: WebGLProgram) {
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "p");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
}
