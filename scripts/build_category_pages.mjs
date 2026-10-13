import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const check = process.argv.includes('--check');
const context = {window:{}};
for (const file of ['js/curated.js','js/portfolio-additions.js','js/responsive-previews.js','js/image-sizes.js']) {
  vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'), context, {filename:file});
}
const {sections,groups,items} = context.window.PORTFOLIO;
const sizes = context.window.IMAGE_SIZES;
const esc = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
const attr = (en,ru) => `data-en="${esc(en)}" data-ru="${esc(ru)}"`;
const itemFor = id => items.find(item => item.id === id);
const countText = n => String(n).padStart(2,'0');
const ruFrames = n => n % 100 >= 11 && n % 100 <= 14 ? 'кадров' : n % 10 === 1 ? 'кадр' : n % 10 >= 2 && n % 10 <= 4 ? 'кадра' : 'кадров';
const enImages = n => `${countText(n)} selected ${n === 1 ? 'image' : 'images'}`;
const localizedCount = n => `data-count="${n}"`;
function sectionCounts(count) { return `<span ${localizedCount(count)} class="category-count" data-en="${esc(enImages(count))}" data-ru="${esc(`${countText(count)} ${ruFrames(count)}`)}">${esc(enImages(count))}</span>`; }
function sizesFor(layout) {
  if (layout === 'wide') return '(max-width: 560px) calc(100vw - 56px), (max-width: 820px) calc(100vw - 72px), min(1564px, calc(100vw - 132px))';
  if (layout === 'single') return '(max-width: 560px) calc(100vw - 56px), (max-width: 820px) calc(72vw - 59px), min(1116px, calc(72vw - 105px))';
  return '(max-width: 560px) calc(100vw - 56px), (max-width: 820px) calc(50vw - 58px), min(750px, calc(50vw - 98px))';
}
function imageMarkup(item, {layout='column', alt=null, className=''}={}) {
  const [width,height] = sizes[item.id] || [2368,1760];
  const variants = item.responsive || [];
  const srcset = variants.map(value => `assets/curated/previews/${item.id}-${value}.webp ${value}w`).join(', ');
  const srcsetAttr = srcset ? ` srcset="${srcset}, assets/curated/${item.id}.webp ${width}w" sizes="${esc(sizesFor(layout))}"` : '';
  return `<img${className ? ` class="${className}"` : ''} src="assets/curated/${esc(item.id)}.webp"${srcsetAttr} width="${width}" height="${height}" alt="${esc(alt ?? item.en)}" loading="lazy" decoding="async">`;
}
function referenceStrip(group,index) {
  const sources = [...new Set(group.ids.map(id => itemFor(id).source))];
  const previews = sources.map(source => {
    const item = group.ids.map(itemFor).find(value => value.source === source);
    const href = `assets/curated/references/${source}`;
    const preview = `assets/curated/reference-previews/${source.replace(/\.png$/i,'.webp')}`;
    return `<a class="reference-preview" href="${href}" data-reference-item="${esc(item.id)}" data-series-id="series-${index + 1}" data-view-mode="source" data-label-en="View original reference: ${esc(item.en)}" data-label-ru="Посмотреть исходник: ${esc(item.ru)}" aria-label="${esc(`View original reference: ${item.en}`)}"><img class="reference-image" src="${preview}" alt="Original product photograph" data-alt-en="Original product photograph" data-alt-ru="Исходная фотография продукта" loading="lazy" decoding="async"></a>`;
  }).join('');
  const copy = sources.length === 1
    ? `<strong data-en="The starting point" data-ru="Исходная фотография">The starting point</strong>`
    : `<strong data-en="The starting points" data-ru="Исходные фотографии">The starting points</strong>`;
  const detail = `<span data-en="A real reference. A different scene, light and atmosphere." data-ru="Реальный референс. Новая сцена, свет и атмосфера.">A real reference. A different scene, light and atmosphere.</span>`;
  const compare = `<a class="reference-open" href="assets/curated/${esc(group.ids[0])}.webp" data-reference-item="${esc(group.ids[0])}" data-series-id="series-${index + 1}" data-view-mode="compare"><span data-en="Compare" data-ru="Сравнить">Compare</span><span aria-hidden="true">↗</span></a>`;
  return `<div class="series-reference"><div class="reference-images${sources.length > 1 ? ' multiple' : ''}">${previews}</div><div class="reference-copy">${copy}${detail}</div>${compare}</div>`;
}
function groupMarkup(group,index) {
  const cards = group.ids.map((id,itemIndex) => {
    const item = itemFor(id);
    if (!item) throw new Error(`Unknown item ${id}`);
    const layout = group.ids.length === 1 ? 'single' : itemIndex === 0 ? 'wide' : 'column';
    const href = `assets/curated/${item.id}.webp`;
    const image = imageMarkup(item,{layout});
    const motionBadge = item.motion ? `<small class="motion-badge" data-en="View loop" data-ru="Смотреть ролик">View loop</small>` : '';
    return `<article class="work-card" data-item="${esc(item.id)}"><a class="card-button" href="${href}" data-item-id="${esc(item.id)}" data-series-id="series-${index + 1}" data-view-mode="auto" data-label-en="${esc(`${item.en} — view reference and result`)}" data-label-ru="${esc(`${item.ru} — смотреть исходник и результат`)}" aria-label="${esc(`${item.en} — view reference and result`)}"><span class="card-media">${image}${motionBadge}</span><span class="card-caption"><span><strong ${attr(item.en,item.ru)}>${esc(item.en)}</strong><small ${attr(item.noteEn,item.noteRu)}>${esc(item.noteEn)}</small></span><span class="arrow" aria-hidden="true">↗</span></span></a></article>`;
  }).join('');
  return `<section class="project-group" id="series-${index + 1}" data-series-index="${index + 1}"><div class="group-header"><span>${countText(index + 1)}</span><h2 ${attr(group.en,group.ru)}>${esc(group.en)}</h2><small class="group-count" data-en="${esc(`${countText(group.ids.length)} ${group.ids.length === 1 ? 'image' : 'images'}`)}" data-ru="${esc(`${countText(group.ids.length)} ${ruFrames(group.ids.length)}`)}">${countText(group.ids.length)} ${group.ids.length === 1 ? 'image' : 'images'}</small></div>${referenceStrip(group,index)}<div class="project-grid">${cards}</div></section>`;
}
function categoryMarkup(section) {
  const groupsForSection = groups[section.id] || [];
  const count = items.filter(item => item.section === section.id).length;
  const indexLinks = groupsForSection.map((group,index) => `<a href="#series-${index + 1}" ${attr(group.en,group.ru)}${index === 0 ? ' aria-current="location"' : ''}>${esc(group.en)}</a>`).join('');
  const next = sections[(sections.indexOf(section) + 1) % sections.length];
  const groupsHtml = groupsForSection.map(groupMarkup).join('');
  return `<div class="category-intro" data-static-category="true"><span id="categoryNumber">${section.number} / 04</span><h1 id="categoryTitle" ${attr(section.en,section.ru)}>${esc(section.en)}</h1><p id="categoryNote" ${attr(section.noteEn,section.noteRu)}>${esc(section.noteEn)}</p></div><div id="gallery" class="category-gallery" data-static-category="true"><div class="category-stats">${sectionCounts(count)}<span data-en="Original references included in every series" data-ru="Исходные фотографии в каждой серии">Original references included in every series</span></div><nav class="project-index" aria-label="Project series">${indexLinks}</nav>${groupsHtml}</div><a id="nextSection" class="next-section" href="${next.page}"><div><small data-en="Next visual world" data-ru="Следующий визуальный мир">Next visual world</small><strong ${attr(next.en,next.ru)}>${esc(next.en)}</strong></div><span aria-hidden="true">↗</span></a>`;
}
function shell(section,version) {
  const title = `${section.en} — Mikhail`;
  const description = `Selected ${section.en} work by Mikhail. Original product references and full-frame results.`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#f1f0eb">
  <meta name="referrer" content="origin">
  <meta name="description" content="${esc(description)}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="Selected commercial imagery. Explore the original reference and the world created around it.">
  <meta property="og:image" content="https://ekkonwork.github.io/northstar-portfolio-pages/assets/curated/${esc(section.cover)}.webp">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="canonical" href="https://ekkonwork.github.io/northstar-portfolio-pages/${section.page}">
  <link rel="icon" href="favicon.svg?v=exhibition-6" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="css/editorial.css?v=${version}">
  <link rel="stylesheet" href="css/conversion.css?v=${version}">
  <title>${esc(title)}</title>
  <script>try{const h=location.hash;if(/^#series-\\d+$/.test(h)){window.__PORTFOLIO_INITIAL_HASH__=h;history.replaceState(history.state,'',location.pathname+location.search);const f=()=>{window.__PORTFOLIO_ENTRY_USER_INPUT__=true};window.addEventListener('wheel',f,{once:true,passive:true});window.addEventListener('touchstart',f,{once:true,passive:true});window.addEventListener('pointerdown',f,{once:true,passive:true});const k=e=>{if(['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(e.key)){f();window.removeEventListener('keydown',k)}};window.addEventListener('keydown',k);window.addEventListener('hashchange',()=>{window.__PORTFOLIO_ENTRY_HASH_CHANGED__=true},{once:true})}}catch(_){}</script>
</head>
<body data-page="${section.id}">
  <a class="skip" href="#gallery" data-en="Skip to work" data-ru="Перейти к работам">Skip to work</a>
  <header class="site-header" id="top">
    <a class="brand" href="index.html" aria-label="Mikhail — home">mikhail<span class="brand-dot">✳</span></a>
    <nav class="desktop-nav" aria-label="Portfolio sections">
      <a href="vton.html" data-en="Virtual Try On" data-ru="Примерка">Virtual Try On</a>
      <a href="food.html" data-en="Food Design" data-ru="Фуд-дизайн">Food Design</a>
      <a href="jewelry.html" data-en="Jewelry &amp; Watch" data-ru="Украшения и часы">Jewelry &amp; Watch</a>
      <a href="furniture.html" data-en="Furniture" data-ru="Мебель">Furniture</a>
    </nav>
    <div class="header-right">
      <button class="lang-switch" id="langSwitch" type="button" aria-label="Switch language">RU</button>
      <a class="header-contact" href="contact.html" data-en="Let's talk ↗" data-ru="Обсудим ↗">Let's talk ↗</a>
    </div>
  </header>
  <nav class="mobile-sections" aria-label="Portfolio sections">
    <a href="vton.html" data-en="Try On" data-ru="Примерка">Try On</a>
    <a href="food.html" data-en="Food" data-ru="Еда">Food</a>
    <a href="jewelry.html" data-en="Jewelry &amp; Watch" data-ru="Украшения и часы">Jewelry &amp; Watch</a>
    <a href="furniture.html" data-en="Furniture" data-ru="Мебель">Furniture</a>
  </nav>
  <main class="category-main wrap">
    <a class="back-link" href="index.html#work" data-en="← All directions" data-ru="← Все направления">← All directions</a>
    ${categoryMarkup(section)}
  </main>
  <footer class="category-footer wrap"><a href="index.html">Mikhail</a><a href="mailto:ekkonwork@gmail.com" data-cta-position="footer">ekkonwork@gmail.com ↗</a><a href="privacy.html" data-en="Privacy" data-ru="Конфиденциальность">Privacy</a><button class="privacy-settings-link" type="button" data-privacy-settings data-en="Privacy settings" data-ru="Настройки приватности">Privacy settings</button><span>© 2026</span></footer>
  <dialog class="detail-dialog" id="detailDialog" aria-label="Project detail">
    <button class="dialog-close" id="dialogClose" type="button" aria-label="Close">×</button>
    <div id="dialogContent"></div>
  </dialog>
  <script src="js/entry-priority.js?v=${version}" defer></script>
  <script src="js/curated.js?v=${version}" defer></script>
  <script src="js/portfolio-additions.js?v=${version}" defer></script>
  <script src="js/responsive-previews.js?v=${version}" defer></script>
  <script src="js/image-sizes.js?v=${version}" defer></script>
  <script src="js/site-config.js?v=${version}" defer></script>
  <script src="js/analytics.js?v=${version}" defer></script>
  <script src="js/editorial.js?v=${version}" defer></script>
  <script src="js/conversion.js?v=${version}" defer></script>
  <script src="js/contact.js?v=${version}" defer></script>
  <script src="js/spatial.js?v=${version}" defer></script>
</body>
</html>
`;
}
const indexHtml = fs.readFileSync(path.join(root,'index.html'),'utf8');
const version = indexHtml.match(/css\/editorial\.css\?v=([^"\s]+)/)?.[1];
if (!version) throw new Error('Home page resource version is required');
let differences = 0;
for (const section of sections) {
  const file = path.join(root,section.page);
  const expected = shell(section,version);
  const existing = fs.existsSync(file) ? fs.readFileSync(file,'utf8') : '';
  if (existing !== expected) {
    differences++;
    if (!check) fs.writeFileSync(file,expected,'utf8');
  }
}
if (check && differences) {
  console.error(`Category page build check failed: ${differences} generated page(s) differ.`);
  process.exitCode = 1;
} else if (check) console.log('Category pages are up to date.');
else console.log(`Generated ${sections.length} static category pages.`);
