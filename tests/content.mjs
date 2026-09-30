import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const context = {window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'js/curated.js'),'utf8'), context);
vm.runInNewContext(fs.readFileSync(path.join(root,'js/image-sizes.js'),'utf8'), context);
const portfolio = context.window.PORTFOLIO;
const sizes = context.window.IMAGE_SIZES;
assert.equal(portfolio.sections.length,4);
assert.equal(portfolio.items.length,38,'Keep every approved work in the public selection.');
const grouped = [];
const ids = new Set();
const sources = new Set();
for (const item of portfolio.items) {
  assert(!ids.has(item.id),`Duplicate item ${item.id}`);
  ids.add(item.id);
  assert(fs.existsSync(path.join(root,`assets/curated/${item.id}.webp`)),`Missing result ${item.id}`);
  assert(fs.existsSync(path.join(root,`assets/curated/references/${item.source}`)),`Missing original ${item.source}`);
  assert(fs.existsSync(path.join(root,`assets/curated/reference-previews/${item.source.replace(/\.png$/,'.webp')}`)),`Missing display copy ${item.source}`);
  assert(sizes[item.id]?.every(value => value > 0),`Missing original dimensions ${item.id}`);
  sources.add(item.source);
  for (const key of ['en','ru','noteEn','noteRu']) {
    assert(item[key]?.length,`Missing ${key} for ${item.id}`);
    assert(!/qwen|flux|srpo|denoise|sampling|workflow|\bstep(s)?\b|\bcfg\b|lora/i.test(item[key]),`Production detail in public copy: ${item.id}`);
  }
}
assert.equal(sources.size,10,'Reference coverage changed. Review the new source mapping.');
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
  for (const match of html.matchAll(/(?:src|href)="(?:css\/editorial\.css|js\/(?:curated|image-sizes|editorial|spatial)\.js)\?v=([^"&]+)"/g)) resourceVersions.add(match[1]);
  assert(html.includes('mailto:ekkonwork@gmail.com'));
}
assert.equal(resourceVersions.size,1,'All page shells must use the same asset release.');
console.log('Content verified: 4 directions, 38 approved works, 10 references, complete series and local assets.');
