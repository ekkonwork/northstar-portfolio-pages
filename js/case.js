/* Reusable case renderer. Local metadata always points at the configured public site. */
(() => {
  'use strict';
  const {$,L,t,escape,media,compareBlock,reveal,wireLightbox}=NS;
  const id=new URLSearchParams(location.search).get('case');
  const work=NS.work.find(w=>w.id===id);
  const h=value=>escape(L(value));
  const BASE='https://ekkonwork.github.io/northstar-portfolio-pages/';
  function meta(kind,key,value){let el=document.querySelector(`meta[${kind}="${key}"]`);if(!el){el=document.createElement('meta');el.setAttribute(kind,key);document.head.append(el);}el.content=value;}
  function notFound(){
    $('#case-body').innerHTML=`<section class="page-hero"><div class="page"><p class="eyebrow">404</p><h1 class="page-title">${escape(t('caseNotFound'))}</h1><p class="page-lede">${escape(t('caseNotFoundBody'))}</p><a class="btn" href="work.html">${escape(t('caseBack'))} ↗</a></div></section>`;
    document.title=t('caseNotFound')+' — Mikhail';meta('name','robots','noindex,follow');
  }
  if(!work){notFound();document.addEventListener('northstar:lang',notFound);return;}
  function paint(){
    const url=BASE+'case.html?case='+encodeURIComponent(work.id),title=L(work.title)+' — Mikhail / Generative AI';
    meta('name','description',L(work.summary));meta('property','og:title',title);meta('property','og:description',L(work.tagline));meta('property','og:url',url);meta('property','og:image',BASE+work.cover);meta('property','og:image:alt',L(work.coverAlt));
    meta('name','twitter:title',title);meta('name','twitter:description',L(work.tagline));meta('name','twitter:image',BASE+work.cover);
    let canonical=$('link[rel="canonical"]');if(!canonical){canonical=document.createElement('link');canonical.rel='canonical';document.head.append(canonical);}canonical.href=url;
    if(/^#[0-9a-f]{6}$/i.test(work.accent)) document.documentElement.style.setProperty('--glow',work.accent+'50');
    $('#kicker').textContent=`${work.index} / ${NS.catLabel(work.category)} / ${work.year}`;
    $('#title').textContent=L(work.title);$('#tagline').textContent=L(work.tagline);
    const cover=$('#coverWrap');cover.dataset.ratio=work.ratio||'landscape';const coverButton=media({src:work.cover,caption:work.coverAlt});const img=coverButton.querySelector('img');img.loading='eager';img.fetchPriority='high';cover.replaceChildren(coverButton);
    $('#meta').innerHTML=(work.meta||[]).map(m=>`<div><dt>${h(m.k)}</dt><dd>${h(m.v)}</dd></div>`).join('');
    $('#tags').innerHTML=(work.tags||[]).map(s=>`<span class="chip">${escape(s)}</span>`).join('');
    $('#summary').textContent=L(work.summary);$('#metrics').innerHTML=(work.metrics||[]).map(m=>`<span><b>${escape(m.v)}</b> ${h(m.l)}</span>`).join('');
    $('#sections').innerHTML=(work.sections||[]).map((s,i)=>`<div class="block-title reveal"><h2>${h(s.h)}</h2><span>${i+1} / ${work.sections.length}</span></div><p class="prose reveal">${h(s.p)}</p>`).join('');
    $('#compares').replaceChildren(...(work.compare||[]).map(item=>compareBlock(item)));
    function gallery(items,target,group){
      const host=$(target);host.replaceChildren();
      items.forEach(item=>{const fig=document.createElement('figure');fig.className='reveal'+(item.size==='w'?' g-w':'');fig.append(media(item,group));const cap=document.createElement('figcaption');cap.textContent=L(item.caption);fig.append(cap);host.append(fig);});
    }
    gallery(work.inputs||[],'#inputs','inputs');gallery(work.gallery||[],'#gallery','gallery');
    $('#inputsTitle').hidden=!(work.inputs||[]).length;$('#galleryTitle').hidden=!(work.gallery||[]).length;
    const n=NS.work.length,i=NS.work.indexOf(work),prev=NS.work[(i-1+n)%n],next=NS.work[(i+1)%n];
    $('#caseNav').innerHTML=`<a href="case.html?case=${encodeURIComponent(prev.id)}"><em>← ${escape(t('casePrev'))}</em><b>${h(prev.title)}</b></a><a href="case.html?case=${encodeURIComponent(next.id)}"><em>${escape(t('caseNext'))} →</em><b>${h(next.title)}</b></a>`;
    document.title=title;reveal();wireLightbox();
  }
  paint();document.addEventListener('northstar:lang',paint);
})();
