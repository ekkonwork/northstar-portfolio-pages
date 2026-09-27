/* ============================================================================
   NORTHSTAR — GPU BACKDROP
   A hand-written WebGL fragment shader. No three.js, no CDN, no dependencies.
   Renders a slow domain-warped flow field that reacts to the pointer and
   follows the colour theme. Rendered at reduced resolution and upscaled,
   because the field is soft — nobody can tell, and it costs a fraction.
   ========================================================================= */
(() => {
  'use strict';

  const canvas = document.getElementById('fx');
  if (!canvas) return;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const VERT = `
attribute vec2 a_pos;
void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }`;

  const FRAG = `
precision highp float;
uniform vec2  u_res;
uniform float u_time;
uniform vec2  u_mouse;
uniform float u_light;
uniform float u_intro;

vec2 hash2(vec2 p){
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise(vec2 p){
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(dot(hash2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
        dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
    mix(dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
        dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
    u.y);
}

float fbm(vec2 p){
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++){
    v += a * noise(p);
    p *= 2.03;
    a *= 0.5;
  }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 p  = (gl_FragCoord.xy - 0.5 * u_res) / min(u_res.x, u_res.y);
  float t = u_time * 0.045;

  /* domain warping — two rounds, the classic way to get living fluid motion */
  vec2 q = vec2(fbm(p * 1.5 + t), fbm(p * 1.5 + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(p * 2.1 + 1.7 * q + vec2(1.7, 9.2) + t * 1.3),
                fbm(p * 2.1 + 1.7 * q + vec2(8.3, 2.8) - t * 1.1));
  float f = fbm(p * 1.7 + 2.3 * r);

  vec3 ink    = vec3(0.020, 0.024, 0.036);
  vec3 cobalt = vec3(0.115, 0.180, 0.820);
  vec3 violet = vec3(0.400, 0.250, 0.950);
  vec3 teal   = vec3(0.040, 0.480, 0.700);

  /* ribbons, not a wash — brightness is concentrated by the power curve */
  vec3 col = mix(ink, cobalt, pow(smoothstep(-0.40, 0.80, f), 1.7) * 0.92);
  col = mix(col, violet, pow(smoothstep(0.10, 1.00, r.x * 0.90 + 0.48), 2.1) * 0.78);
  col = mix(col, teal,   0.13 * pow(smoothstep(0.15, 0.95, q.y), 2.0));

  /* pointer light */
  vec2 m = (u_mouse - 0.5 * u_res) / min(u_res.x, u_res.y);
  float d = length(p - m);
  col += cobalt * 0.30 * exp(-d * 3.4);
  col += violet * 0.14 * exp(-d * 6.5);

  /* depth shaping */
  col *= 1.0 - 0.90 * smoothstep(0.10, 1.20, length(p * vec2(0.80, 1.0)));
  col *= 0.34 + 0.66 * smoothstep(-0.60, 0.95, p.y + 0.15);
  col *= 0.92;

  /* theme counterpart: a paper-bright wash instead of a dark void */
  vec3 paper = vec3(0.945, 0.940, 0.918);
  vec3 tint  = col * 0.75 + vec3(0.62, 0.65, 0.80);
  col = mix(col, mix(paper, tint, 0.55), u_light);

  col *= u_intro;
  gl_FragColor = vec4(col, 1.0);
}`;

  const gl = canvas.getContext('webgl', {
    alpha: false, antialias: false, depth: false, stencil: false,
    powerPreference: 'high-performance'
  }) || canvas.getContext('experimental-webgl');

  if (!gl) { canvas.style.display = 'none'; return; }

  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn('[fx]', gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  }

  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) { canvas.style.display = 'none'; return; }

  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { canvas.style.display = 'none'; return; }
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'a_pos');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const U = {
    res:   gl.getUniformLocation(prog, 'u_res'),
    time:  gl.getUniformLocation(prog, 'u_time'),
    mouse: gl.getUniformLocation(prog, 'u_mouse'),
    light: gl.getUniformLocation(prog, 'u_light'),
    intro: gl.getUniformLocation(prog, 'u_intro')
  };

  const SCALE = 0.55;                 // internal render scale
  const DPR   = Math.min(devicePixelRatio || 1, 1.5);

  let w = 0, h = 0;
  function resize() {
    const rect = canvas.getBoundingClientRect();
    const cw = Math.max(1, Math.round(rect.width  * DPR * SCALE));
    const ch = Math.max(1, Math.round(rect.height * DPR * SCALE));
    if (cw === w && ch === h) return;
    w = cw; h = ch;
    canvas.width = w;
    canvas.height = h;
    gl.viewport(0, 0, w, h);
    gl.uniform2f(U.res, w, h);
  }

  /* pointer, in device pixels of the canvas */
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  function setMouse(cx, cy) {
    const rect = canvas.getBoundingClientRect();
    mouse.tx = (cx - rect.left) * DPR * SCALE;
    mouse.ty = (rect.height - (cy - rect.top)) * DPR * SCALE;  // gl origin is bottom-left
  }
  mouse.x = mouse.tx = innerWidth * 0.5 * DPR * SCALE;
  mouse.y = mouse.ty = innerHeight * 0.35 * DPR * SCALE;

  addEventListener('pointermove', e => setMouse(e.clientX, e.clientY), { passive: true });
  addEventListener('resize', resize);
  addEventListener('orientationchange', resize);

  let light = document.documentElement.dataset.theme === 'light' ? 1 : 0;
  addEventListener('northstar:theme', () => {
    light = document.documentElement.dataset.theme === 'light' ? 1 : 0;
  });

  let visible = true;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { visible = entries[0].isIntersecting; }, { threshold: 0 })
      .observe(canvas);
  }

  let intro = 0;
  const start = performance.now();
  let raf = 0;
  let running = true;

  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (!running) return;

    const elapsed = (now - start) / 1000;
    intro = Math.min(1, intro + (reduce ? 1 : 0.012));

    if (!visible) return;

    resize();

    mouse.x += (mouse.tx - mouse.x) * 0.055;
    mouse.y += (mouse.ty - mouse.y) * 0.055;

    gl.uniform1f(U.time, reduce ? 12.0 : elapsed);
    gl.uniform2f(U.mouse, mouse.x, mouse.y);
    gl.uniform1f(U.light, light);
    gl.uniform1f(U.intro, intro);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  resize();
  raf = requestAnimationFrame(frame);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(raf); running = false; }
    else if (!running) { running = true; raf = requestAnimationFrame(frame); }
  });

  /* light theme needs its own nudge — app.js owns the toggle, so mirror it */
  const themeBtn = document.querySelector('.theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      light = document.documentElement.dataset.theme === 'light' ? 1 : 0;
    });
  }
})();
