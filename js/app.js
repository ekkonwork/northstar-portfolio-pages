/* Northstar shared runtime. Content is local; no external services are called. */
(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lang = document.documentElement.lang === 'ru' ? 'ru' : 'en';
  const L = value => typeof value === 'string' ? value : (value?.[lang] ?? value?.en ?? '');
  const t = key => COPY[lang]?.[key] ?? key;
  const escape = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const save = (key, value) => { try { localStorage.setItem(key, value); } catch (_) {} };

  function applyStatic(root = document) {
    $$('[data-i18n]', root).forEach(el => { const v = COPY[lang][el.dataset.i18n]; if (typeof v === 'string') el.textContent = v; });
    $$('[data-i18n-html]', root).forEach(el => { const v = COPY[lang][el.dataset.i18nHtml]; if (typeof v === 'string') el.innerHTML = escape(v).replace(/\n/g, '<br>'); });
    $$('[data-i18n-attr]', root).forEach(el => el.dataset.i18nAttr.split(';').forEach(pair => {
      const [attr,key] = pair.split(':'); if (attr && typeof COPY[lang][key] === 'string') el.setAttribute(attr, COPY[lang][key]);
    }));
    $$('[data-lang]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    $$('.theme-toggle').forEach(b => b.setAttribute('aria-label', t('themeToggle')));
  }
  function setLang(next, persist = true) {
    lang = next === 'ru' ? 'ru' : 'en'; document.documentElement.lang = lang;
    if (persist) save('northstar-lang', lang);
    applyStatic();
    document.title = `${document.documentElement.dataset.titleKey === 'work' ? t('workPageTitle') + ' — ' : ''}${lang === 'ru' ? 'Михаил' : 'Mikhail'} / Generative AI`;
    document.dispatchEvent(new CustomEvent('northstar:lang', {detail:{lang}}));
    ticker();
  }
  function setTheme(mode, persist = true) {
    mode = mode === 'dark' ? 'dark' : 'light';
    document.documentElement.dataset.theme = mode;
    if (persist) save('northstar-theme', mode);
    const meta = $('meta[name="theme-color"]'); if (meta) meta.content = mode === 'light' ? '#f4f3ef' : '#08090c';
    document.dispatchEvent(new CustomEvent('northstar:theme', {detail:{theme:mode}}));
    window.dispatchEvent(new CustomEvent('northstar:theme', {detail:{theme:mode}}));
  }

  // One observer, not a new observer on every filter/language update.
  const observer = !reduce && 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); observer.unobserve(e.target); } });
  }, {threshold:0.05}) : null;
  function reveal(root = document) {
    $$('.reveal', root).forEach(el => {
      if (!observer) el.classList.add('is-in');
      else if (!el.classList.contains('is-in')) observer.observe(el);
    });
  }
  // Accurate numbers are shown immediately; the UI does not simulate progress.
  function counters(root = document) { $$('[data-count]', root).forEach(el => { el.textContent = el.dataset.count; }); }
  function magnetic() {} // Native pointer behaviour avoids moving touch/focus targets.

  function nav() {
    const bar = $('.nav'), burger = $('.burger'), drawer = $('.drawer');
    if (!bar || !burger || !drawer) return;
    const onScroll = () => bar.classList.toggle('is-stuck', scrollY > 12);
    onScroll(); addEventListener('scroll', onScroll, {passive:true});
    drawer.hidden = true; drawer.inert = true;
    let opened = false;
    const outside = [document.querySelector('main'), document.querySelector('footer')].filter(Boolean);
    function toggle(value, restore = true) {
      if (opened === value) return;
      opened = value; drawer.hidden = !value; drawer.inert = !value;
      drawer.classList.toggle('is-open', value);
      bar.classList.toggle('menu-open', value);
      burger.setAttribute('aria-expanded', String(value));
      burger.setAttribute('aria-label', value ? t('close') : t('menu'));
      outside.forEach(el => { el.inert = value; });
      document.documentElement.classList.toggle('is-locked', value);
      if (value) $('a', drawer)?.focus(); else if (restore) burger.focus();
    }
    burger.addEventListener('click', () => toggle(!opened));
    $$('a', drawer).forEach(a => a.addEventListener('click', () => toggle(false, false)));
    document.addEventListener('keydown', e => {
      if (!opened) return;
      if (e.key === 'Escape') { e.preventDefault(); toggle(false); }
      if (e.key === 'Tab') {
        const focusable = [burger,...$$('a',drawer)];
        const i = focusable.indexOf(document.activeElement);
        e.preventDefault(); focusable[(i + (e.shiftKey ? -1 : 1) + focusable.length) % focusable.length].focus();
      }
    });
    addEventListener('resize', () => { if (innerWidth > 900 && opened) toggle(false,false); });
  }

  const lb = {dialog:null,items:[],index:0,returnTo:null};
  function buildLightbox() {
    const d = document.createElement('dialog'); d.className = 'lightbox';
    d.innerHTML = '<div class="lb-inner"><img class="lb-img" alt=""></div><button class="lb-close" type="button">×</button><button class="lb-nav lb-prev" type="button">←</button><button class="lb-nav lb-next" type="button">→</button><div class="lb-cap" aria-live="polite"></div>';
    document.body.append(d); lb.dialog = d;
    $('.lb-close',d).addEventListener('click',()=>d.close());
    $('.lb-prev',d).addEventListener('click',()=>step(-1)); $('.lb-next',d).addEventListener('click',()=>step(1));
    d.addEventListener('click',e=>{if(e.target===d || e.target.classList.contains('lb-inner')) d.close();});
    d.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();step(e.key==='ArrowLeft'?-1:1);}});
    d.addEventListener('close',()=>{document.documentElement.classList.remove('is-locked'); if(lb.returnTo?.isConnected) lb.returnTo.focus();});
  }
  function step(dir) {lb.index=(lb.index+dir+lb.items.length)%lb.items.length; paintLightbox();}
  function paintLightbox() {
    const item=lb.items[lb.index], d=lb.dialog; if(!item)return;
    const img=$('.lb-img',d); img.src=item.src; img.alt=L(item.caption);
    d.setAttribute('aria-label',lang==='ru'?'Просмотр изображения':'Image viewer');
    $('.lb-close',d).setAttribute('aria-label',t('closeViewer'));
    $('.lb-prev',d).setAttribute('aria-label',lang==='ru'?'Предыдущее изображение':'Previous image');
    $('.lb-next',d).setAttribute('aria-label',lang==='ru'?'Следующее изображение':'Next image');
    $('.lb-cap',d).textContent=`${lb.index+1} / ${lb.items.length} · ${L(item.caption)}`;
    $('.lb-prev',d).hidden=$('.lb-next',d).hidden=lb.items.length<2;
  }
  function openLightbox(items,index=0) {
    const valid=items.filter(x=>x?.src); if(!valid.length)return;
    if(!lb.dialog)buildLightbox();
    lb.items=valid; lb.index=Math.max(0,Math.min(index,valid.length-1)); lb.returnTo=document.activeElement;
    paintLightbox(); if(!lb.dialog.open)lb.dialog.showModal(); document.documentElement.classList.add('is-locked');
  }
  function wireLightbox(root=document) {
    $$('[data-lightbox]',root).forEach(el=>{
      if(el.dataset.lbWired)return; el.dataset.lbWired='1';
      if(!el.matches('button,a')) {el.tabIndex=0; el.setAttribute('role','button');}
      el.setAttribute('aria-label',`${t('viewFull')}: ${el.dataset.lightboxCaption||''}`);
      const open=()=>{
        const group=el.dataset.lightboxGroup;
        const nodes=group?$$('[data-lightbox-group]').filter(x=>x.dataset.lightboxGroup===group):[el];
        openLightbox(nodes.map(n=>({src:n.dataset.lightbox,caption:n.dataset.lightboxCaption||''})),Math.max(0,nodes.indexOf(el)));
      };
      el.addEventListener('click',e=>{e.preventDefault();open();});
      if(!el.matches('button,a'))el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});
    });
  }
  function media(item,group) {
    const b=document.createElement('button');b.type='button';b.className='media-open';
    b.dataset.lightbox=item.src;b.dataset.lightboxCaption=L(item.caption);if(group)b.dataset.lightboxGroup=group;
    const img=document.createElement('img');img.src=item.src;img.alt=L(item.caption);img.loading='lazy';img.decoding='async'; b.append(img);return b;
  }
  function compare(item) {
    const w=document.createElement('div');w.className='compare';w.tabIndex=0;
    w.setAttribute('role','slider');w.setAttribute('aria-label',L(item.label));w.setAttribute('aria-valuemin','0');w.setAttribute('aria-valuemax','100');w.setAttribute('aria-valuenow','50');
    w.innerHTML=`<img class="cmp-out" src="${escape(item.output)}" alt="${escape(t('caseOutput')+': '+L(item.label))}" loading="lazy" decoding="async"><img class="cmp-in" src="${escape(item.input)}" alt="${escape(t('caseInput')+': '+L(item.label))}" loading="lazy" decoding="async"><span class="cmp-bar" aria-hidden="true"></span><span class="cmp-knob" aria-hidden="true">↔</span><span class="cmp-tag cmp-tag--l">${escape(t('caseInput'))}</span><span class="cmp-tag cmp-tag--r">${escape(t('caseOutput'))}</span>`;
    function set(v){v=Math.max(0,Math.min(100,v));w.style.setProperty('--pos',v+'%');w.setAttribute('aria-valuenow',String(Math.round(v)));}
    const fromPointer=e=>{const r=w.getBoundingClientRect();if(r.width)set((e.clientX-r.left)/r.width*100);};
    let dragging=false;
    w.addEventListener('pointerdown',e=>{if(e.button!==0)return;dragging=true;w.focus({preventScroll:true});w.classList.add('is-drag');w.setPointerCapture(e.pointerId);fromPointer(e);});
    w.addEventListener('pointermove',e=>{if(dragging)fromPointer(e);});
    ['pointerup','pointercancel','lostpointercapture'].forEach(event=>w.addEventListener(event,()=>{dragging=false;w.classList.remove('is-drag');}));
    w.addEventListener('keydown',e=>{const v=Number(w.getAttribute('aria-valuenow'));const values={ArrowLeft:v-5,ArrowRight:v+5,Home:0,End:100};if(e.key in values){e.preventDefault();set(values[e.key]);}});
    return w;
  }
  function compareBlock(item) {
    const fig=document.createElement('figure');fig.className='cmp-fig';fig.append(compare(item));
    const cap=document.createElement('figcaption');cap.className='cmp-cap';
    const label=document.createElement('b');label.textContent=L(item.label);cap.append(label);
    const button=document.createElement('button');button.type='button';button.className='compare-full';button.textContent=t('viewFull')+' ↗';
    button.addEventListener('click',()=>openLightbox([{src:item.input,caption:t('caseInput')+' · '+L(item.label)},{src:item.output,caption:t('caseOutput')+' · '+L(item.label)}],1));cap.append(button);fig.append(cap);return fig;
  }
  function buildCard(work,opts={}) {
    const a=document.createElement('a');a.className='card'+(opts.size?' card--'+opts.size:'');a.href='case.html?case='+encodeURIComponent(work.id);
    a.setAttribute('aria-label',L(work.title)+' — '+L(work.tagline));if(work.accent)a.style.setProperty('--card-accent',work.accent);
    a.innerHTML=`<div class="card-media"><span class="card-idx">${escape(work.index)}</span><span class="card-cat">${escape(NS.catLabel(work.category))}</span><img src="${escape(work.cover)}" alt="${escape(L(work.coverAlt))}" loading="lazy" decoding="async"><span class="card-go" aria-hidden="true">↗</span></div><div class="card-body"><h3 class="card-title">${escape(L(work.title))}<span>${escape(work.year)}</span></h3><p class="card-tag">${escape(L(work.tagline))}</p><div class="card-tags">${(work.tags||[]).map(tag=>'<span class="chip">'+escape(tag)+'</span>').join('')}</div></div>`;return a;
  }
  function ticker(){const track=$('.ticker-track');if(track){const html=(t('ticker')||[]).map(s=>'<span>'+escape(s)+'</span>').join('');track.innerHTML=html+html;}}
  window.NS={$, $$, L,t,escape,lang:()=>lang,setLang,setTheme,applyStatic,reveal,counters,magnetic,wireLightbox,openLightbox,media,compare,compareBlock,buildCard,get work(){return WORKS;},get categories(){return CATEGORIES;},catLabel(id){return L(CATEGORIES.find(c=>c.id===id)?.label)||id;}};
  function boot(){
    $('.loader')?.remove();document.body.classList.add('is-ready');
    $$('[data-lang]').forEach(b=>b.addEventListener('click',()=>setLang(b.dataset.lang)));
    $$('.theme-toggle').forEach(b=>b.addEventListener('click',()=>setTheme(document.documentElement.dataset.theme==='light'?'dark':'light')));
    nav();setTheme(document.documentElement.dataset.theme,false);setLang(lang,false);reveal();counters();wireLightbox();
    const progress=$('.progress');if(progress){const update=()=>{const h=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${h>0?Math.min(1,scrollY/h):0})`;};addEventListener('scroll',update,{passive:true});addEventListener('resize',update);update();}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
