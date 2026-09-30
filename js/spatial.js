/* Progressive visual enhancements. Work and navigation never depend on WebGL. */
(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(pointer: fine)');
  const progress = document.createElement('div');
  progress.className = 'page-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.append(progress);
  let scrollFrame = 0;
  function updateProgress() {
    scrollFrame = 0;
    const range = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${range > 0 ? Math.min(100, window.scrollY / range * 100) : 0}%`;
  }
  window.addEventListener('scroll', () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateProgress);
  }, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });
  updateProgress();

  let observer;
  let seriesObserver;
  function revealWorks() {
    observer?.disconnect();
    seriesObserver?.disconnect();
    const groups = [...document.querySelectorAll('.project-group')];
    if ('IntersectionObserver' in window && groups.length) {
      seriesObserver = new IntersectionObserver(entries => {
        const visible = entries.filter(entry => entry.isIntersecting).sort((a,b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (!visible) return;
        document.querySelectorAll('.project-index a').forEach(link => {
          if (link.hash === `#${visible.target.id}`) link.setAttribute('aria-current','location');
          else link.removeAttribute('aria-current');
        });
      }, { rootMargin: '-145px 0px -50% 0px' });
      groups.forEach(group => seriesObserver.observe(group));
    }
    if (reduced.matches || !('IntersectionObserver' in window)) return;
    observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    }, { threshold: .04, rootMargin: '0px 0px 40px 0px' });
    document.querySelectorAll('.sector-card, .work-card, .approach-inner, .site-footer').forEach(element => {
      if (element.getBoundingClientRect().top < window.innerHeight) return;
      element.classList.add('reveal-ready');
      observer.observe(element);
    });
  }
  document.addEventListener('portfolio:render', revealWorks);
  reduced.addEventListener('change', () => {
    document.querySelectorAll('.reveal-ready').forEach(element => element.classList.add('is-visible'));
  });
  revealWorks();

  const scene = document.getElementById('spatialScene');
  const canvas = document.getElementById('sculptureCanvas');
  if (!scene || !canvas) return;
  let renderScene = () => {};
  let frame = 0;
  let pointer = [0, 0];
  let target = [0, 0];
  let entryOrigin = [0, 0];
  let entryStarted = 0;
  let lastFrameTime = 0;
  let pointerInside = false;
  let sceneVisible = true;

  function animateScene(now) {
    frame = 0;
    if (!sceneVisible || document.hidden) { lastFrameTime = 0; return; }
    // Restart with a small timestep after idle; elapsed idle time must never
    // become a single large camera movement on the first pointer event.
    const elapsed = lastFrameTime ? Math.min(32, now - lastFrameTime) : 16.67;
    lastFrameTime = now;
    const entry = pointerInside ? Math.min(1, Math.max(0, (now - entryStarted) / 240)) : 1;
    const entryEase = entry * entry * (3 - 2 * entry);
    const desired = pointerInside
      ? target.map((value, axis) => entryOrigin[axis] + (value - entryOrigin[axis]) * entryEase)
      : [0, 0];
    const follow = 1 - Math.exp(-elapsed / 150);
    pointer = reduced.matches ? [0, 0]
      : pointer.map((value, axis) => value + (desired[axis] - value) * follow);
    const moving = !reduced.matches &&
      (entry < 1 || pointer.some((value, axis) => Math.abs(value - target[axis]) > .0004));
    if (!moving) pointer = reduced.matches ? [0, 0] : [...target];
    // The photo planes and shader use the same eased pose in the same frame.
    scene.style.setProperty('--scene-x', pointer[0].toFixed(4));
    scene.style.setProperty('--scene-y', pointer[1].toFixed(4));
    renderScene();
    if (moving) frame = requestAnimationFrame(animateScene);
    else lastFrameTime = 0;
  }

  function requestRender() {
    if (frame || !sceneVisible || document.hidden) return;
    lastFrameTime = 0;
    frame = requestAnimationFrame(animateScene);
  }
  function resetPointer() {
    pointerInside = false;
    target = [0, 0];
    requestRender();
  }
  function updateTarget(event) {
    if (reduced.matches || !finePointer.matches || event.pointerType === 'touch') return;
    const rect = scene.getBoundingClientRect();
    target = [
      Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1)),
      Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1))
    ];
    if (!pointerInside) {
      pointerInside = true;
      entryOrigin = [...pointer];
      entryStarted = performance.now();
    }
    requestRender();
  }
  scene.addEventListener('pointerenter', updateTarget, { passive: true });
  scene.addEventListener('pointermove', updateTarget, { passive: true });
  scene.addEventListener('pointerleave', resetPointer);
  scene.addEventListener('pointercancel', resetPointer);
  reduced.addEventListener('change', resetPointer);
  finePointer.addEventListener('change', resetPointer);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      sceneVisible = entries[0].isIntersecting;
      if (sceneVisible) requestRender();
      else { cancelAnimationFrame(frame); frame = 0; lastFrameTime = 0; resetPointer(); }
    }).observe(scene);
  }

  const gl = canvas.getContext('webgl', { antialias: false, alpha: true, powerPreference: 'low-power', preserveDrawingBuffer: true });
  if (!gl) { canvas.hidden = true; return; }
  const vertex = `attribute vec2 position; void main(){gl_Position=vec4(position,0.,1.);}`;
  const fragment = `
    precision highp float;
    uniform vec2 resolution;
    uniform vec2 pointer;
    mat2 turn(float a){float s=sin(a),c=cos(a);return mat2(c,-s,s,c);}
    float shape(vec3 p){
      vec3 ring=p-vec3(-.76,.77,-.15);
      ring.yz=turn(.69+pointer.y*.1)*ring.yz;
      ring.xz=turn(-.43+pointer.x*.13)*ring.xz;
      float torus=length(vec2(length(ring.xy)-.49,ring.z))-.145;
      float ball=length(p-vec3(.70,-.86,.05))-.17;
      return min(torus,ball);
    }
    vec3 normalAt(vec3 p){vec2 e=vec2(.001,0);return normalize(vec3(shape(p+e.xyy)-shape(p-e.xyy),shape(p+e.yxy)-shape(p-e.yxy),shape(p+e.yyx)-shape(p-e.yyx)));}
    vec3 environment(vec3 r){
      vec3 color=mix(vec3(.28,.32,.30),vec3(.94,.95,.90),smoothstep(-.65,.9,r.y));
      color+=vec3(.9,.95,1.)*pow(max(0.,dot(r,normalize(vec3(-1.,1.3,1.)))),40.)*1.5;
      color+=vec3(.95,.76,.53)*pow(max(0.,dot(r,normalize(vec3(.8,.15,1.)))),18.)*.85;
      color-=vec3(.26)*pow(max(0.,dot(r,normalize(vec3(-.4,.1,-1.)))),6.);
      return color;
    }
    void main(){
      vec2 uv=(gl_FragCoord.xy-resolution*.5)/resolution.y;
      vec3 ro=vec3(pointer.x*.10,-pointer.y*.06,4.4);
      vec3 rd=normalize(vec3(uv*3.35,-4.4));
      float travel=0.; bool hit=false;
      for(int i=0;i<60;i++){float d=shape(ro+rd*travel);if(d<.001){hit=true;break;}travel+=d;if(travel>7.)break;}
      if(!hit){gl_FragColor=vec4(0.);return;}
      vec3 p=ro+rd*travel;vec3 n=normalAt(p);
      vec3 reflected=environment(reflect(rd,n));
      float diffuse=max(.0,dot(n,normalize(vec3(-.7,1.,1.2))));
      float fresnel=pow(1.-max(0.,dot(n,-rd)),4.);
      vec3 color=reflected*.8+vec3(.08,.09,.065)*diffuse+vec3(.16)*fresnel;
      gl_FragColor=vec4(pow(max(color,vec3(0.)),vec3(.91)),1.);
    }`;
  function compile(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { gl.deleteShader(shader); return null; }
    return shader;
  }
  const vs = compile(gl.VERTEX_SHADER, vertex);
  const fs = compile(gl.FRAGMENT_SHADER, fragment);
  if (!vs || !fs) { canvas.hidden = true; return; }
  const program = gl.createProgram();
  gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { canvas.hidden = true; return; }
  gl.useProgram(program);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const resolution = gl.getUniformLocation(program, 'resolution');
  const pointerUniform = gl.getUniformLocation(program, 'pointer');
  renderScene = () => {
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(resolution, canvas.width, canvas.height);
    gl.uniform2f(pointerUniform, pointer[0], pointer[1]);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };
  function resize() {
    const rect = scene.getBoundingClientRect();
    const scale = Math.min(1, 540 / Math.max(rect.width, rect.height));
    canvas.width = Math.round(rect.width * scale);
    canvas.height = Math.round(rect.height * scale);
    requestRender();
  }
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(scene);
  else window.addEventListener('resize', resize, { passive: true });
  canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); canvas.hidden = true; });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(frame); frame = 0; lastFrameTime = 0; resetPointer();
    } else requestRender();
  });
  scene.dataset.renderer = 'webgl';
  resize();
})();
