/* ============================================================================
   NORTHSTAR — 3D SYSTEM LATTICE
   A real 3D object: perspective projection, rotation matrices, depth fog,
   rendered on the GPU with raw WebGL. No three.js, no CDN, ~7 KB.

   It visualises the thing the portfolio is actually about — every frame passes
   through the same controlled graph — so the 3D earns its place rather than
   being decoration.
   ========================================================================= */
(() => {
  'use strict';

  const canvas = document.getElementById('lattice');
  if (!canvas) return;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const VERT = `
attribute vec3 a_pos;
attribute float a_seed;
uniform mat4  u_mvp;
uniform float u_size;
uniform float u_time;
varying float v_depth;
varying float v_seed;

void main(){
  vec4 clip = u_mvp * vec4(a_pos, 1.0);
  /* a slow breathing pulse keeps the lattice alive without being busy */
  vec3 jitter = vec3(
    sin(u_time * 0.45 + a_seed * 6.28),
    cos(u_time * 0.37 + a_seed * 5.11),
    sin(u_time * 0.29 + a_seed * 4.73)
  ) * 0.035;
  clip.xyz += jitter * clip.w;
  gl_Position = clip;
  v_depth = clip.w;
  v_seed  = a_seed;
  gl_PointSize = clamp(u_size / max(clip.w, 0.001), 1.6, 16.0);
}`;

  const FRAG_POINT = `
precision mediump float;
uniform vec3  u_c1;
uniform vec3  u_c2;
uniform float u_alpha;
varying float v_depth;
varying float v_seed;

void main(){
  vec2 d = gl_PointCoord - 0.5;
  float r = length(d);
  if (r > 0.5) discard;
  float soft = 1.0 - smoothstep(0.06, 0.50, r);
  float fog  = 1.0 - smoothstep(3.6, 8.2, v_depth);
  vec3 col = mix(u_c1, u_c2, v_seed);
  gl_FragColor = vec4(col, soft * (0.25 + 0.75 * fog) * u_alpha);
}`;

  const FRAG_LINE = `
precision mediump float;
uniform vec3  u_c1;
uniform float u_alpha;
varying float v_depth;

void main(){
  float fog = 1.0 - smoothstep(3.2, 7.6, v_depth);
  gl_FragColor = vec4(u_c1, fog * u_alpha);
}`;

  const gl = canvas.getContext('webgl', {
    alpha: true, antialias: true, depth: false, premultipliedAlpha: false
  }) || canvas.getContext('experimental-webgl');

  if (!gl) { canvas.parentElement.style.display = 'none'; return; }

  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn('[lattice]', gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  }

  function program(fragSrc) {
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, fragSrc);
    if (!vs || !fs) return null;
    const p = gl.createProgram();
    gl.attachShader(p, vs);
    gl.attachShader(p, fs);
    gl.linkProgram(p);
    return gl.getProgramParameter(p, gl.LINK_STATUS) ? p : null;
  }

  const progPoint = program(FRAG_POINT);
  const progLine  = program(FRAG_LINE);
  if (!progPoint || !progLine) { canvas.parentElement.style.display = 'none'; return; }

  /* ---------------------------------------------------- geometry -------- */
  /* three stages along X, each a small cluster of nodes — a pipeline you can
     read at a glance: input → controlled graph → delivered frames */
  const NODES = 132;
  const positions = [];
  const seeds = [];

  const STAGES = [
    { x: -2.35, spread: 0.58, count: 34 },   // supplied inputs
    { x:  0.00, spread: 0.98, count: 64 },   // the controlled graph
    { x:  2.35, spread: 0.58, count: 34 }    // delivered outputs
  ];

  let seed = 0;
  STAGES.forEach((stage, si) => {
    for (let i = 0; i < stage.count; i++) {
      /* deterministic pseudo-random so the shape is identical every load */
      const r = (n) => {
        const v = Math.sin((seed * 12.9898 + n * 78.233 + si * 4.1) * 43758.5453);
        return v - Math.floor(v);
      };
      seed++;
      const theta = r(1) * Math.PI * 2;
      const phi = Math.acos(2 * r(2) - 1);
      const rad = stage.spread * (0.35 + 0.65 * Math.pow(r(3), 0.6));
      positions.push(
        stage.x + rad * Math.sin(phi) * Math.cos(theta) * 0.85,
        rad * Math.sin(phi) * Math.sin(theta) * 0.85,
        rad * Math.cos(phi) * 0.85
      );
      seeds.push(r(4));
    }
  });

  /* edges: connect each node to its nearest neighbours, and stage to stage */
  const edges = [];
  const nodeCount = NODES;
  const at = i => [positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]];
  const dist2 = (a, b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;

  for (let i = 0; i < nodeCount; i++) {
    const a = at(i);
    const near = [];
    for (let j = i + 1; j < nodeCount; j++) {
      const b = at(j);
      const d = dist2(a, b);
      if (d < 0.30) near.push([d, j]);
    }
    near.sort((x, y) => x[0] - y[0]);
    near.slice(0, 3).forEach(([, j]) => edges.push(i, j));
  }

  const lineVerts = [];
  edges.forEach(idx => {
    const p = at(idx);
    lineVerts.push(p[0], p[1], p[2]);
  });

  function makeBuffer(data) {
    const b = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    return b;
  }
  /* uploaded once — never inside the render loop */
  const bufPtPos   = makeBuffer(positions);
  const bufPtSeed  = makeBuffer(seeds);
  const bufLinePos = makeBuffer(lineVerts);

  function attrib(buf, loc, size) {
    if (loc < 0) return;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
  }

  /* ------------------------------------------------------- matrices ----- */
  function perspective(fovy, aspect, near, far) {
    const f = 1 / Math.tan(fovy / 2), nf = 1 / (near - far);
    return [f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0];
  }
  function mul(a, b) {
    const o = new Array(16);
    for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) {
      o[c * 4 + r] = a[r] * b[c * 4] + a[4 + r] * b[c * 4 + 1] + a[8 + r] * b[c * 4 + 2] + a[12 + r] * b[c * 4 + 3];
    }
    return o;
  }
  function rotX(rad) {
    const c = Math.cos(rad), s = Math.sin(rad);
    return [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1];
  }
  function rotY(rad) {
    const c = Math.cos(rad), s = Math.sin(rad);
    return [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1];
  }
  function translate(x, y, z) {
    return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1];
  }

  /* ---------------------------------------------------------- state ----- */
  const uP = {
    mvp:   gl.getUniformLocation(progPoint, 'u_mvp'),
    size:  gl.getUniformLocation(progPoint, 'u_size'),
    time:  gl.getUniformLocation(progPoint, 'u_time'),
    c1:    gl.getUniformLocation(progPoint, 'u_c1'),
    c2:    gl.getUniformLocation(progPoint, 'u_c2'),
    alpha: gl.getUniformLocation(progPoint, 'u_alpha')
  };
  const uL = {
    mvp:   gl.getUniformLocation(progLine, 'u_mvp'),
    time:  gl.getUniformLocation(progLine, 'u_time'),
    c1:    gl.getUniformLocation(progLine, 'u_c1'),
    alpha: gl.getUniformLocation(progLine, 'u_alpha')
  };

  const aPosP  = gl.getAttribLocation(progPoint, 'a_pos');
  const aSeedP = gl.getAttribLocation(progPoint, 'a_seed');
  const aPosL  = gl.getAttribLocation(progLine, 'a_pos');

  let w = 0, h = 0;
  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 1.6);
    const cw = Math.max(1, Math.round(rect.width * dpr));
    const ch = Math.max(1, Math.round(rect.height * dpr));
    if (cw === w && ch === h) return;
    w = cw; h = ch;
    canvas.width = w; canvas.height = h;
    gl.viewport(0, 0, w, h);
  }

  /* pointer steers the object */
  let mx = 0, my = 0, tx = 0, ty = 0;
  addEventListener('pointermove', e => {
    tx = (e.clientX / innerWidth - 0.5) * 2;
    ty = (e.clientY / innerHeight - 0.5) * 2;
  }, { passive: true });

  function theme() {
    const light = document.documentElement.dataset.theme === 'light';
    return light
      ? { c1: [0.14, 0.20, 0.76], c2: [0.44, 0.28, 0.86], line: [0.30, 0.34, 0.74], aP: 1.0, aL: 0.60 }
      : { c1: [0.50, 0.64, 1.00], c2: [0.80, 0.64, 1.00], line: [0.46, 0.60, 1.00], aP: 1.0, aL: 0.78 };
  }

  let visible = true;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(e => { visible = e[0].isIntersecting; }, { threshold: 0 }).observe(canvas);
  }

  let running = true, raf = 0;
  const t0 = performance.now();

  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (!running || !visible) return;

    resize();
    const t = (now - t0) / 1000;

    mx += (tx - mx) * 0.05;
    my += (ty - my) * 0.05;

    const spin = reduce ? 0.4 : t * 0.11;

    /* Wide panels put the caption on the left, so the object shifts right.
       Narrow panels stack the caption on top, so the object drops down. */
    const aspect = w / h;
    const wide = aspect > 1.5;
    const ox = wide ? 0.85 : 0;
    const oy = wide ? 0 : -0.85;
    const oz = wide ? -4.9 : -6.3;

    const mvp = mul(
      perspective(Math.PI / 4.5, aspect, 0.1, 60),
      mul(
        translate(ox, oy, oz),
        mul(rotX(-0.18 + my * 0.24), rotY(spin + mx * 0.40))
      )
    );

    const th = theme();
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    /* lines first, nodes on top */
    gl.useProgram(progLine);
    gl.uniformMatrix4fv(uL.mvp, false, new Float32Array(mvp));
    gl.uniform1f(uL.time, t);
    gl.uniform3fv(uL.c1, th.line);
    gl.uniform1f(uL.alpha, th.aL);
    attrib(bufLinePos, aPosL, 3);
    gl.drawArrays(gl.LINES, 0, lineVerts.length / 3);

    gl.useProgram(progPoint);
    gl.uniformMatrix4fv(uP.mvp, false, new Float32Array(mvp));
    gl.uniform1f(uP.time, t);
    gl.uniform1f(uP.size, 52 * (w / 1400));
    gl.uniform3fv(uP.c1, th.c1);
    gl.uniform3fv(uP.c2, th.c2);
    gl.uniform1f(uP.alpha, th.aP);
    attrib(bufPtPos, aPosP, 3);
    attrib(bufPtSeed, aSeedP, 1);
    gl.drawArrays(gl.POINTS, 0, nodeCount);
  }

  resize();
  raf = requestAnimationFrame(frame);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(raf); running = false; }
    else if (!running) { running = true; raf = requestAnimationFrame(frame); }
  });
})();
