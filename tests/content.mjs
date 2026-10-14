import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const context = {window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'js/curated.js'),'utf8'), context);
vm.runInNewContext(fs.readFileSync(path.join(root,'js/portfolio-additions.js'),'utf8'), context);
vm.runInNewContext(fs.readFileSync(path.join(root,'js/responsive-previews.js'),'utf8'), context);
vm.runInNewContext(fs.readFileSync(path.join(root,'js/image-sizes.js'),'utf8'), context);
const portfolio = context.window.PORTFOLIO;
const sizes = context.window.IMAGE_SIZES;
assert.equal(portfolio.sections.length,4);
const legacy = JSON.parse(fs.readFileSync(path.join(root,'tests/approved-legacy.json'),'utf8'));
assert.equal(legacy.length,27);
const additions=context.window.NORTHSTAR_ADDITIONS;
assert.equal(additions.items.length,66,'Exactly the approved 66 new stills.');
assert.equal(portfolio.items.length,93);
assert.equal(new Set(additions.items.map(item=>item.source)).size,40);
for (const [section,count] of Object.entries({'virtual-try-on':22,'food-design':15,'jewelry-watch':15,'furniture':14})) {
  assert.equal(additions.items.filter(item=>item.section===section).length,count);
}
for (const rejected of ['northstar_vton_03_2','northstar_furniture_05_2']) assert(!additions.items.some(item=>item.id===rejected));
assert(legacy.every(id => portfolio.items.some(item => item.id === id)), 'Keep every approved work in the public selection.');
const grouped = [];
const ids = new Set();
const sources = new Set();
for (const item of portfolio.items) {
  assert(!ids.has(item.id),`Duplicate item ${item.id}`);
  ids.add(item.id);
  if (item.original) assert(fs.existsSync(path.join(root,item.original)),`Missing lossless original ${item.id}`);
  assert(fs.existsSync(path.join(root,`assets/curated/${item.id}.webp`)),`Missing result ${item.id}`);
  assert(fs.existsSync(path.join(root,`assets/curated/references/${item.source}`)),`Missing original ${item.source}`);
  assert(fs.existsSync(path.join(root,`assets/curated/reference-previews/${item.source.replace(/\.png$/,'.webp')}`)),`Missing display copy ${item.source}`);
  assert(sizes[item.id]?.every(value => value > 0),`Missing original dimensions ${item.id}`);
  for (const width of item.responsive || []) assert(fs.existsSync(path.join(root,`assets/curated/previews/${item.id}-${width}.webp`)));
  if (item.motion) {
    assert(fs.existsSync(path.join(root,item.motion.mp4)),`Missing MP4 ${item.id}`);
    assert(fs.existsSync(path.join(root,item.motion.gif)),`Missing GIF ${item.id}`);
  }
  sources.add(item.source);
  for (const key of ['en','ru','noteEn','noteRu']) {
    assert(item[key]?.length,`Missing ${key} for ${item.id}`);
    assert(!/qwen|flux|srpo|denoise|sampling|workflow|\bstep(s)?\b|\bcfg\b|\blora\b/i.test(item[key]),`Production detail in public copy: ${item.id}`);
  }
}
assert(sources.size>=8,'Keep the original eight reference mappings.');
for (const section of portfolio.sections) {
  assert(ids.has(section.cover),`Unknown cover ${section.cover}`);
  for (const group of portfolio.groups[section.id]) {
    for (const id of group.ids) {
      assert(ids.has(id),`Unknown grouped work ${id}`);
      assert.equal(portfolio.items.find(item => item.id === id).section,section.id);
      grouped.push(id);
    }
  }
}
assert.equal(new Set(grouped).size,grouped.length,'A work occurs in more than one series.');
assert.deepEqual([...ids].sort(),[...grouped].sort(),'Every approved work must appear in a series.');
const rejected = ['tactile detail','on ice','in transit','one table three dishes','rain from behind','business editorial','loungewear editorial'];
for (const title of rejected) assert(!portfolio.items.some(item => item.en.toLowerCase() === title),`Rejected work returned: ${title}`);
for (const groupTitle of ['activewear','intimates','спортивная одежда','бельё']) {
  assert(!portfolio.groups['virtual-try-on'].some(group => group.en.toLowerCase() === groupTitle || group.ru.toLowerCase() === groupTitle),`Rejected series returned: ${groupTitle}`);
}
const resourceVersions = new Set();
for (const page of ['index.html',...portfolio.sections.map(section => section.page)]) {
  const html = fs.readFileSync(path.join(root,page),'utf8');
  for (const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
    const asset = match[1].split('?')[0];
    if (/^(https?:|mailto:)/.test(asset)) continue;
    assert(fs.existsSync(path.join(root,asset)),`Broken asset or link in ${page}: ${asset}`);
  }
  assert(html.includes('editorial.css?v='));
  assert(html.includes('image-sizes.js?v='));
  for (const match of html.matchAll(/(?:src|href)="(?:css\/(?:editorial|conversion)\.css|js\/(?:entry-priority|curated|portfolio-additions|responsive-previews|image-sizes|site-config|analytics|editorial|conversion|contact|spatial)\.js)\?v=([^"&]+)"/g)) resourceVersions.add(match[1]);
  assert(!html.includes('mailto:ekkonwork@gmail.com'), `${page} must route commercial contact links to the form.`);
  assert(!/\uFFFD|вЂ|в†|вњ|В©|Г—|РџСЂ|Р¤Сѓ|РЈРє|РњРµ|РћР±/.test(html),`Encoding corruption in ${page}`);
  for (const ruText of ['data-ru="Примерка"','data-ru="Фуд-дизайн"','data-ru="Украшения и часы"','data-ru="Мебель"','data-ru="Обсудим ↗"']) {
    assert(html.includes(ruText),`Missing Russian copy (${ruText}) in ${page}`);
  }
  const scripts=[...html.matchAll(/<script\b[^>]*src="js\/(entry-priority|curated|portfolio-additions|responsive-previews|image-sizes|site-config|analytics|editorial|conversion|contact|spatial)\.js[^>]*>/g)];
  if (page !== 'index.html') {
    assert.deepEqual(scripts.map(match=>match[1]),['entry-priority','curated','portfolio-additions','responsive-previews','image-sizes','site-config','analytics','editorial','conversion','contact','spatial']);
    assert(scripts.every(match=>/\bdefer\b/.test(match[0])));
    const section=portfolio.sections.find(value=>value.page===page);
    const pageGroups=portfolio.groups[section.id];
    const cards=[...html.matchAll(/data-item-id="([^"]+)"/g)].map(match=>match[1]);
    const expected=Array.from(pageGroups).flatMap(group=>Array.from(group.ids));
    assert.deepEqual(cards,expected,`Static card mapping changed in ${page}`);
    assert(html.includes('id="categoryTitle"') && html.includes('id="categoryNote"'));
    assert(html.includes('data-static-category="true"'));
    assert.equal([...html.matchAll(/<section class="project-group" id="series-\d+"/g)].length,pageGroups.length);
    assert(!/<div id="gallery"><\/div>/.test(html),`Empty JS-only gallery shell in ${page}`);
    assert(html.includes('loading="lazy"'));
    assert(html.includes('contact.html'));
  }
}
for (const internal of ['.agent','research','experiments','workflows','assets/proof','assets/web/proof','alignment-report.json','verification.json','scripts/sync_curated_assets.ps1']) {
  assert(!fs.existsSync(path.join(root,internal)),`Internal artifact in public tree: ${internal}`);
}
assert.equal(resourceVersions.size,1,'All page shells must use the same asset release.');
console.log('Content verified: 4 directions, approved works with preserved legacy selection, verified references, complete series and local assets.');
