/* All gallery images start lazy. Promote only the requested series' first
   result before the later application scripts hydrate the page. */
(() => {
  const groups = [...document.querySelectorAll('.project-group[data-series-index]')];
  if (!groups.length) return;
  const initialHash = window.__PORTFOLIO_INITIAL_HASH__ || window.location.hash;
  const match = initialHash.match(/^#series-(\d+)$/);
  const target = match ? groups.find(group => group.dataset.seriesIndex === match[1]) : groups[0];
  if (target) window.__PORTFOLIO_ENTRY_PRIORITY__ = target.id;
  const image = target?.querySelector('.work-card img');
  if (!image) return;
  image.loading = 'eager';
  image.fetchPriority = 'high';

  // A deep fragment can be clamped near the current document bottom before
  // lazy images and web fonts above it finish settling. Make one correction
  // after only the target image and fonts are ready; abandon it on user input.
  if (!match || !target.id) return;
  let cancelled = false;
  const clickAnchor = event => {
    const clicked = event.target instanceof Element ? event.target : event.target?.parentElement;
    if (clicked?.closest('a[href^="#series-"]')) cancel();
  };
  const onHashChange = () => cancel(false);
  const cleanup = () => {
    window.removeEventListener('wheel',cancel);
    window.removeEventListener('touchstart',cancel);
    window.removeEventListener('pointerdown',cancel);
    window.removeEventListener('keydown',onKeyDown);
    window.removeEventListener('hashchange',onHashChange);
    document.removeEventListener('click',clickAnchor,true);
  };
  const restoreHash = () => {
    if (window.location.hash && window.location.hash !== initialHash) return;
    const url = new URL(window.location.href);
    url.hash = initialHash;
    history.replaceState(history.state,'',`${url.pathname}${url.search}${url.hash}`);
  };
  const cancel = (restore = true) => {
    if (cancelled) return;
    cancelled = true;
    cleanup();
    if (restore) restoreHash();
  };
  const scrollKeys = new Set(['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' ']);
  const onKeyDown = event => {
    if (!scrollKeys.has(event.key)) return;
    const tag = event.target?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || event.target?.isContentEditable) return;
    cancel();
  };
  window.addEventListener('wheel',cancel,{passive:true});
  window.addEventListener('touchstart',cancel,{passive:true});
  window.addEventListener('pointerdown',cancel,{passive:true});
  window.addEventListener('keydown',onKeyDown);
  window.addEventListener('hashchange',onHashChange);
  document.addEventListener('click',clickAnchor,true);
  if (window.__PORTFOLIO_ENTRY_USER_INPUT__) cancel();
  else if (window.__PORTFOLIO_ENTRY_HASH_CHANGED__ || (window.location.hash && window.location.hash !== initialHash)) cancel(false);

  const imageReady = image.complete
    ? image.decode?.().catch(() => Promise.resolve()) || Promise.resolve()
    : new Promise(resolve => {
        image.addEventListener('load',resolve,{once:true});
        image.addEventListener('error',resolve,{once:true});
      });
  const domReady = document.readyState !== 'complete'
    ? new Promise(resolve => document.addEventListener('DOMContentLoaded',resolve,{once:true}))
    : Promise.resolve();
  Promise.all([domReady,document.fonts?.ready || Promise.resolve(),imageReady]).then(() => {
    requestAnimationFrame(() => {
      cleanup();
      if (cancelled || (window.location.hash && window.location.hash !== initialHash)) return;
      const scrollMargin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
      const targetTop = target.getBoundingClientRect().top + window.scrollY;
      const previousBehavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = 'auto';
      window.scrollTo(0,Math.max(0,targetTop - scrollMargin));
      document.documentElement.style.scrollBehavior = previousBehavior;
      restoreHash();
    });
  });
})();
