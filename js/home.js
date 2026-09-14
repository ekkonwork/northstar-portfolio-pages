/* ============================================================================
   NORTHSTAR — LANDING PAGE
   Everything below is rendered from js/data.js, so adding a case study to the
   database is all it takes to make it appear here.
   ========================================================================= */
(() => {
  'use strict';
  const { $, L, t, buildCard, compareBlock, reveal, counters, magnetic, wireLightbox } = NS;

  /* Editorial rhythm for the featured grid.
     Order matters: CSS grid auto-placement does not backfill, so the three
     span-4 cards must come first, then the two span-6 cards. */
  const FEATURED_ORDER = [
    'fashion-transfer',
    'fashion-campaigns',
    'product-fidelity',
    'hospitality',
    'property',
    'furniture'
  ];
  const LAYOUT = {
    'fashion-transfer':  { size: 'std' },
    'fashion-campaigns': { size: 'std' },
    'product-fidelity':  { size: 'std' },
    'hospitality':       { size: 'std' },
    'property':          { size: 'std' },
    'furniture':         { size: 'std' }
  };

  const PROOF_PICKS = ['fashion-transfer', 'property', 'hospitality', 'product-fidelity'];

  function renderStats() {
    const host = $('#stats');
    if (!host) return;
    const data = (COPY[NS.lang()] || COPY.en).stats || [];
    host.innerHTML = data.map((s, i) => `
      <div class="stat reveal reveal-d${i + 1}">
        <b data-count="${s.v}">${s.v}</b>
        <span>${L(s.l)}</span>
      </div>`).join('');
  }

  function renderFeatured() {
    const host = $('#featured');
    if (!host) return;
    host.innerHTML = '';
    const byId = id => NS.work.find(w => w.id === id);
    const ordered = FEATURED_ORDER.map(byId).filter(w => w && w.featured);
    /* anything else flagged as featured lands at the end, so the DB stays open */
    NS.work.filter(w => w.featured && !FEATURED_ORDER.includes(w.id)).forEach(w => ordered.push(w));

    ordered.forEach((w, i) => {
      const card = buildCard(w, LAYOUT[w.id] || { size: 'std' });
      card.classList.add('reveal', `reveal-d${(i % 3) + 1}`);
      host.append(card);
    });
  }

  function renderProof() {
    const host = $('#proofGrid');
    if (!host) return;
    host.innerHTML = '';
    PROOF_PICKS.forEach((id, i) => {
      const w = NS.work.find(x => x.id === id);
      if (!w || !w.compare || !w.compare.length) return;
      const block = compareBlock(w.compare[0]);
      block.classList.add('reveal', `reveal-d${(i % 2) + 1}`);
      host.append(block);
    });
  }

  function renderCaps() {
    const host = $('#caps');
    if (!host) return;
    const caps = (COPY[NS.lang()] || COPY.en).capabilities || [];
    host.innerHTML = caps.map((c, i) => `
      <div class="cap reveal reveal-d${i + 1}">
        <b>${String(i + 1).padStart(2, '0')}</b>
        <div><h3>${c.t}</h3><p>${c.d}</p></div>
      </div>`).join('');
  }

  function renderProfileFacts() {
    const host = $('#profileFacts');
    if (!host) return;
    const data = (COPY[NS.lang()] || COPY.en).stats || [];
    host.innerHTML = data.map(s => `<span><b>${s.v}</b> ${L(s.l)}</span>`).join('');
  }

  function renderEngine() {
    const host = $('#engineMetrics');
    if (!host) return;
    const data = (COPY[NS.lang()] || COPY.en).engineMetrics || [];
    host.innerHTML = data.map((m, i) => `
      <article class="metric reveal reveal-d${i + 1}">
        <b>${m.v}</b>
        <span>${m.l}</span>
        <p>${m.d}</p>
      </article>`).join('');
  }

  function renderSteps() {
    const host = $('#steps');
    if (!host) return;
    const data = (COPY[NS.lang()] || COPY.en).process || [];
    host.innerHTML = data.map((s, i) => `
      <article class="step reveal reveal-d${i + 1}">
        <em>${s.n}</em>
        <h3>${s.t}</h3>
        <p>${s.d}</p>
      </article>`).join('');
  }

  function paint() {
    renderStats();
    renderFeatured();
    renderProof();
    renderCaps();
    renderProfileFacts();
    renderEngine();
    renderSteps();
    reveal();
    counters();
    magnetic();
    wireLightbox();
  }

  paint();
  document.addEventListener('northstar:lang', paint);
})();
