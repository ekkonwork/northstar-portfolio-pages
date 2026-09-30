import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const code = fs.readFileSync(new URL('../js/spatial.js',import.meta.url),'utf8');
function harness() {
  let now = 0, nextId = 0, shaderPose = [0,0], draws = 0;
  const queue = new Map(), observers = [];
  const eventTarget = extra => ({
    handlers:{}, ...extra,
    addEventListener(name,fn) { (this.handlers[name] ||= []).push(fn); },
    emit(name,event = {}) { (this.handlers[name] || []).forEach(fn => fn(event)); }
  });
  const styles = {};
  const scene = eventTarget({dataset:{},style:{setProperty:(key,value) => { styles[key] = value; }},getBoundingClientRect:() => ({left:0,top:0,width:600,height:650})});
  const gl = new Proxy({
    getShaderParameter:() => true,getProgramParameter:() => true,
    getUniformLocation:(_,name) => name,
    uniform2f:(name,x,y) => { if (name === 'pointer') shaderPose = [x,y]; },
    drawArrays:() => { draws++; }
  },{get:(object,key) => object[key] || (() => ({}))});
  const canvas = eventTarget({getContext:() => gl});
  const reduced = eventTarget({matches:false}), fine = eventTarget({matches:true});
  const document = eventTarget({hidden:false,body:{append(){}},documentElement:{scrollHeight:900},createElement:() => ({style:{},setAttribute(){}}),querySelectorAll:() => [],getElementById:id => id === 'spatialScene' ? scene : id === 'sculptureCanvas' ? canvas : null});
  const window = eventTarget({innerHeight:900,scrollY:0,matchMedia:query => query.includes('reduced') ? reduced : fine,IntersectionObserver:true,ResizeObserver:true});
  class IntersectionObserver {
    constructor(callback) { this.callback = callback; this.targets = []; observers.push(this); }
    observe(element) { this.targets.push(element); }
    disconnect() {} unobserve() {}
  }
  class ResizeObserver { constructor(callback) { this.callback = callback; } observe() { this.callback(); } }
  vm.runInNewContext(code,{window,document,IntersectionObserver,ResizeObserver,performance:{now:() => now},Float32Array,
    requestAnimationFrame:fn => { const id = ++nextId; queue.set(id,fn); return id; },cancelAnimationFrame:id => queue.delete(id)});
  const pose = () => ['--scene-x','--scene-y'].map(key => Number(styles[key] || 0));
  const tick = (step = 16.67) => {
    now += step;
    const tasks = [...queue.values()]; queue.clear(); tasks.forEach(fn => fn(now));
    pose().forEach((value,axis) => assert(Math.abs(value - shaderPose[axis]) < .0001,'CSS and WebGL must share the same pose.'));
  };
  return {scene,document,reduced,fine,pose,tick,draws:() => draws,pending:() => queue.size,
    wait:duration => { now += duration; },settle:() => { for (let i = 0;i < 200 && queue.size;i++) tick(); assert.equal(queue.size,0,'No perpetual animation at rest.'); },
    visible:value => observers.find(observer => observer.targets.includes(scene)).callback([{isIntersecting:value}])};
}
const h = harness();
h.settle();
h.scene.emit('pointerenter',{clientX:600,clientY:0,pointerType:'mouse'});
h.tick();
assert(Math.abs(h.pose()[0]) < .01,'Entry must not jump to the cursor at the edge.');
h.settle();
assert.equal(h.pose()[0],1); assert.equal(h.pose()[1],-1);
h.scene.emit('pointerleave'); h.tick();
assert(h.pose()[0] > .5,'Exit should ease instead of snapping.');
h.settle(); assert.equal(h.pose()[0],0);
const drawsAtRest = h.draws(); h.wait(30000);
assert.equal(h.draws(),drawsAtRest);
h.scene.emit('pointerenter',{clientX:0,clientY:650,pointerType:'mouse'}); h.tick();
assert(Math.abs(h.pose()[0]) < .01,'Idle time must not turn into a large first-frame movement.');
h.settle();
h.scene.emit('pointerleave'); h.tick();
const origin = h.pose()[0];
h.scene.emit('pointerenter',{clientX:600,clientY:0,pointerType:'mouse'}); h.tick();
assert(Math.abs(h.pose()[0] - origin) < .015,'Re-entry during exit must remain continuous.');
h.visible(false); assert.equal(h.pending(),0);
h.visible(true); h.settle(); assert.equal(h.pose()[0],0);
h.scene.emit('pointerenter',{clientX:600,clientY:0,pointerType:'mouse'}); h.tick();
h.document.hidden = true; h.document.emit('visibilitychange'); assert.equal(h.pending(),0);
h.document.hidden = false; h.document.emit('visibilitychange'); h.settle();
h.reduced.matches = true; h.reduced.emit('change'); h.settle();
h.scene.emit('pointermove',{clientX:600,clientY:0,pointerType:'mouse'}); h.tick(); assert.equal(h.pose()[0],0);
h.reduced.matches = false; h.fine.matches = false; h.fine.emit('change'); h.settle();
h.scene.emit('pointerenter',{clientX:600,clientY:0,pointerType:'touch'}); h.tick(); assert.equal(h.pose()[0],0);
console.log('Scene motion verified: smooth edge entry, idle restart, exit/re-entry, shared pose, visibility, reduced motion, touch and no idle render loop.');
