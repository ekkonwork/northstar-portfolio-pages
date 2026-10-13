/* Consent-gated, PII-free portfolio measurement. No provider code loads before opt-in. */
(() => {
  'use strict';

  const CONSENT_KEY = 'northstar-analytics-consent-v1';
  const CONSENT_VERSION = 1;
  const CONSENT_TTL = 180 * 24 * 60 * 60 * 1000;
  const SOURCES = new Set(['outreach', 'portfolio', 'direct']);
  const MEDIUMS = new Set(['email', 'referral']);
  const CAMPAIGNS = new Set(['agency_oct26', 'brand_oct26', 'smallbusiness_oct26', 'qa_oct26']);
  const REF_RE = /^[A-Za-z0-9_-]{21}[AQgw]$/;
  const SECTORS = new Set(['virtual-try-on', 'food-design', 'jewelry-watch', 'furniture']);
  const EVENTS = new Set(['page_view', 'series_view', 'image_open', 'reference_compare', 'contact_click', 'email_copy', 'brief_start', 'brief_submit_success', 'engaged_visit']);
  const APP_BASE_PATH = '/northstar-portfolio-pages/';
  const APP_ROUTES = new Set(['', 'index.html', 'vton.html', 'food.html', 'jewelry.html', 'furniture.html', 'contact.html', 'privacy.html', 'case-food-campaign.html', 'case-fashion-images.html', 'case-furniture-scenes.html']);
  const config = window.PORTFOLIO_CONFIG || {};
  const measurementId = /^G-[A-Z0-9]+$/.test(config.ga4MeasurementId || '') ? config.ga4MeasurementId : '';
  const clarityId = /^[a-z0-9]{10}$/.test(config.clarityProjectId || '') ? config.clarityProjectId : '';
  let choice = readChoice();
  let loaded = false;
  let engaged = false;
  let seriesObserver = null;
  const seenSeries = new Set();

  function readChoice() {
    try {
      const value = JSON.parse(localStorage.getItem(CONSENT_KEY) || 'null');
      if (!value || value.version !== CONSENT_VERSION || !Number.isFinite(value.at) || Date.now() - value.at > CONSENT_TTL) return null;
      return value.analytics === true;
    } catch (_) { return null; }
  }

  function storeChoice(allowed) {
    choice = Boolean(allowed);
    try { localStorage.setItem(CONSENT_KEY, JSON.stringify({ version: CONSENT_VERSION, at: Date.now(), analytics: choice })); } catch (_) {}
  }

  function isTestMode(url) { return url.searchParams.get('analytics_test') === '1'; }
  function excluded(url) {
    const host = location.hostname.toLowerCase();
    const local = location.protocol === 'file:' || host === 'localhost' || host === '127.0.0.1' || host === '::1';
    return !isTestMode(url) && (local || url.searchParams.get('qa') === '1');
  }

  function campaign(url) {
    const result = {};
    if (SOURCES.has(url.searchParams.get('utm_source'))) result.utm_source = url.searchParams.get('utm_source');
    if (MEDIUMS.has(url.searchParams.get('utm_medium'))) result.utm_medium = url.searchParams.get('utm_medium');
    if (CAMPAIGNS.has(url.searchParams.get('utm_campaign'))) result.utm_campaign = url.searchParams.get('utm_campaign');
    const ref = url.searchParams.get('ref');
    if (ref && REF_RE.test(ref)) result.ref = ref;
    return result;
  }

  function safeLocation(input) {
    const url = new URL(input || location.href, location.href);
    const route = url.pathname.startsWith(APP_BASE_PATH) ? url.pathname.slice(APP_BASE_PATH.length) : '';
    const path = APP_ROUTES.has(route) ? `${APP_BASE_PATH}${route}` : APP_BASE_PATH;
    const params = new URLSearchParams();
    Object.entries(campaign(url)).forEach(([key, value]) => params.set(key, value));
    if (isTestMode(url)) params.set('analytics_test', '1');
    const origin = config.siteOrigin ? new URL(config.siteOrigin).origin : url.origin;
    return `${origin}${path}${params.size ? `?${params.toString()}` : ''}${safeHash(url, route)}`;
  }

  function safeHash(url, route) {
    const match = url.hash.match(/^#series-(\d{1,2})$/);
    if (!match) return '';
    const section = { 'vton.html': 'virtual-try-on', 'food.html': 'food-design', 'jewelry.html': 'jewelry-watch', 'furniture.html': 'furniture' }[route];
    const groups = section && window.PORTFOLIO && window.PORTFOLIO.groups && window.PORTFOLIO.groups[section];
    return groups && Number(match[1]) >= 1 && Number(match[1]) <= groups.length ? url.hash : '';
  }

  function safeReferrer() {
    try { return document.referrer ? new URL(document.referrer).origin : ''; } catch (_) { return ''; }
  }

  function referrerHasNoQuery() {
    try {
      if (!document.referrer) return true;
      const referrer = new URL(document.referrer);
      return !referrer.search && !referrer.hash;
    } catch (_) { return false; }
  }

  function safeParams(name, raw) {
    const params = {};
    const source = raw && typeof raw === 'object' ? raw : {};
    const sector = typeof source.sector === 'string' && SECTORS.has(source.sector) ? source.sector : '';
    const itemIds = new Set((window.PORTFOLIO && window.PORTFOLIO.items || []).map(item => item && item.id).filter(id => typeof id === 'string'));
    const itemId = typeof source.item_id === 'string' && itemIds.has(source.item_id) ? source.item_id : '';
    let series = '';
    if (typeof source.series_id === 'string') {
      if (/^[A-Za-z0-9_-]{3,100}$/.test(source.series_id) && itemIds.has(source.series_id)) series = source.series_id;
      else {
        const match = source.series_id.match(/^series-(\d{1,2})$/);
        const groups = sector && window.PORTFOLIO && window.PORTFOLIO.groups && window.PORTFOLIO.groups[sector];
        const group = match && groups && groups[Number(match[1]) - 1];
        if (group && Array.isArray(group.ids) && itemIds.has(group.ids[0])) series = group.ids[0];
      }
    }
    const position = typeof (source.contact_position || source.cta_position) === 'string' && /^(header|hero|footer|viewer|contact|case|privacy|home-process|category)$/.test(source.contact_position || source.cta_position) ? (source.contact_position || source.cta_position) : '';
    const method = typeof source.contact_method === 'string' && /^(mailto|link|copy)$/.test(source.contact_method) ? source.contact_method : '';
    const mode = typeof source.view_mode === 'string' && /^(source|result|compare)$/.test(source.view_mode) ? source.view_mode : '';
    if (sector) params.sector = sector;
    if (itemId) params.item_id = itemId;
    if (series) params.series_id = series;
    if (position) params.contact_position = position;
    if (method) params.contact_method = method;
    if (mode) params.view_mode = mode;
    if (name === 'series_view' && !params.series_id) return null;
    if ((name === 'image_open' || name === 'reference_compare') && !params.item_id) return null;
    if (name === 'contact_click' && !params.contact_position) params.contact_position = 'contact';
    return params;
  }

  function send(name, raw) {
    if (!choice || !loaded || !EVENTS.has(name)) return false;
    const url = new URL(location.href);
    if (excluded(url)) return false;
    const params = safeParams(name, raw);
    if (!params) return false;
    if (isTestMode(url)) { params.debug_mode = true; params.traffic_type = 'internal'; }
    let queued = false;
    if (typeof window.gtag === 'function') { window.gtag('event', name, params); queued = true; }
    if (typeof window.clarity === 'function') {
      // Clarity has no GA-style event parameters. Set only the same validated,
      // low-risk dimensions that are allowed into GA4 before emitting the event.
      const tags = { sector: params.sector, item_id: params.item_id, series_id: params.series_id, contact_position: params.contact_position };
      const ref = campaign(url).ref;
      if (ref) tags.campaign_ref = ref;
      Object.entries(tags).forEach(([key, value]) => {
        if (typeof value === 'string' && value) window.clarity('set', key, value);
      });
      window.clarity('event', name);
      queued = true;
    }
    return queued;
  }

  function startProviders() {
    if (loaded || !choice || excluded(new URL(location.href))) return;
    if (!sanitizeCurrentUrl()) return;
    loaded = true;
    const safe = safeLocation(location.href);
    if (measurementId) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
      window.gtag('consent', 'default', {
        analytics_storage: 'granted',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        functionality_storage: 'denied',
        personalization_storage: 'denied',
        security_storage: 'granted'
      });
      window.gtag('js', new Date());
      window.gtag('config', measurementId, {
        send_page_view: false,
        page_location: safe,
        page_referrer: safeReferrer(),
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
        cookie_flags: 'SameSite=None;Secure'
      });
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
      script.referrerPolicy = 'strict-origin-when-cross-origin';
      document.head.append(script);
    }
    if (clarityId && referrerHasNoQuery()) {
      window.clarity = window.clarity || function () { (window.clarity.q = window.clarity.q || []).push(arguments); };
      window.clarity('consentv2', { ad_Storage: 'denied', analytics_Storage: 'granted' });
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.clarity.ms/tag/${encodeURIComponent(clarityId)}`;
      script.referrerPolicy = 'strict-origin-when-cross-origin';
      document.head.append(script);
    }
    send('page_view', {});
    observeSeries();
    if (window.scrollY >= 250) { send('engaged_visit', {}); engaged = true; }
  }

  function clearAnalyticsCookies() {
    document.cookie.split(';').forEach(value => {
      const name = value.split('=')[0].trim();
      if (/^(_ga|_gid|_gat|_clck|_clsk)/.test(name)) {
        document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
        document.cookie = `${name}=; Max-Age=0; path=/; domain=${location.hostname}; SameSite=Lax`;
      }
    });
  }

  function revoke() {
    storeChoice(false);
    try { window.gtag && window.gtag('consent', 'update', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' }); } catch (_) {}
    try { window.clarity && window.clarity('consentv2', { ad_Storage: 'denied', analytics_Storage: 'denied' }); } catch (_) {}
    clearAnalyticsCookies();
    window.location.reload();
  }

  function observeSeries() {
    if (seriesObserver) seriesObserver.disconnect();
    if (!('IntersectionObserver' in window)) return;
    const headers = document.querySelectorAll('.project-group[id^="series-"] .group-header');
    seriesObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const group = entry.target.closest('.project-group');
      const itemLink = group && group.querySelector('[data-item-id]');
      const id = itemLink && itemLink.dataset.itemId;
      if (!id) return;
      if (!seenSeries.has(id)) {
        seenSeries.add(id);
        send('series_view', { series_id: id, sector: document.body.dataset.page });
      }
    }), { threshold: 0.2 });
    headers.forEach(header => seriesObserver.observe(header));
  }

  function sanitizeCurrentUrl() {
    const current = new URL(location.href);
    const safe = campaign(current);
    if (isTestMode(current)) safe.analytics_test = '1';
    const items = new Set((window.PORTFOLIO && window.PORTFOLIO.items || []).map(item => item && item.id).filter(id => typeof id === 'string'));
    for (const key of ['item', 'item_id', 'project']) {
      const candidate = current.searchParams.get(key);
      if (candidate && items.has(candidate)) { safe.item = candidate; break; }
    }
    const query = new URLSearchParams();
    Object.entries(safe).forEach(([key, value]) => query.set(key, value));
    const route = current.pathname.startsWith(APP_BASE_PATH) ? current.pathname.slice(APP_BASE_PATH.length) : '';
    const path = APP_ROUTES.has(route) ? current.pathname : APP_BASE_PATH;
    const hash = safeHash(current, route);
    const next = `${path}${query.size ? `?${query.toString()}` : ''}${hash}`;
    if (`${current.pathname}${current.search}${current.hash}` !== next) {
      try { history.replaceState(history.state, '', next); }
      catch (_) { return false; }
    }
    return true;
  }

  function campaignLink(url) {
    const current = new URL(location.href);
    const incoming = campaign(current);
    if (!incoming.utm_source || !incoming.utm_medium || !incoming.utm_campaign || !incoming.ref) return url;
    for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'ref']) if (!url.searchParams.has(key)) url.searchParams.set(key, incoming[key]);
    return url;
  }

  function propagateCampaign() {
    const origin = config.siteOrigin ? new URL(config.siteOrigin).origin : location.origin;
    const basePath = new URL(config.siteOrigin ? `${config.siteOrigin}${APP_BASE_PATH}` : `${location.origin}${APP_BASE_PATH}`).pathname;
    document.querySelectorAll('a[href]').forEach(link => {
      if (link.hasAttribute('download') || link.matches('[data-no-campaign]') || /^mailto:|^tel:|^javascript:/i.test(link.getAttribute('href') || '')) return;
      let url;
      try { url = new URL(link.href, location.href); } catch (_) { return; }
      if (url.origin !== origin || !url.pathname.startsWith(basePath)) return;
      const route = url.pathname.slice(basePath.length);
      if (!APP_ROUTES.has(route)) return;
      const previous = url.href;
      const updated = campaignLink(url);
      if (updated.href !== previous) link.href = updated.href;
    });
  }

  function setConsent(allowed) {
    if (allowed) {
      storeChoice(true);
      const banner = document.getElementById('privacyConsent');
      if (banner) banner.hidden = true;
      startProviders();
    } else revoke();
  }

  function language() { return document.documentElement.lang.toLowerCase().startsWith('ru') ? 'ru' : 'en'; }
  function copyConsentText() {
    return language() === 'ru'
      ? { title: 'Аналитика портфолио', body: 'С вашего согласия Google Analytics и Microsoft Clarity соберут обезличенные просмотры страниц и действия с работами. Данные формы и её содержимое в аналитику не передаются. Рекламные функции отключены.', accept: 'Разрешить аналитику', decline: 'Отклонить', settings: 'Настройки приватности', privacy: 'Политика конфиденциальности' }
      : { title: 'Portfolio analytics', body: 'With your permission, Google Analytics and Microsoft Clarity measure page views and interactions with portfolio work. Form contents are never sent to analytics. Advertising features stay disabled.', accept: 'Allow analytics', decline: 'Decline', settings: 'Privacy settings', privacy: 'Privacy notice' };
  }

  function mountConsent() {
    if (document.getElementById('privacyConsent')) return;
    const text = copyConsentText();
    const banner = document.createElement('aside');
    banner.id = 'privacyConsent';
    banner.className = 'privacy-consent';
    banner.setAttribute('aria-labelledby', 'privacyConsentTitle');
    banner.hidden = choice !== null;
    banner.innerHTML = `<div class="privacy-consent-copy"><strong id="privacyConsentTitle"></strong><p></p><a href="privacy.html" data-privacy-link></a></div><div class="privacy-consent-actions"><button type="button" data-consent-accept></button><button type="button" data-consent-decline></button></div>`;
    document.body.append(banner);
    const update = () => {
      const copy = copyConsentText();
      banner.querySelector('strong').textContent = copy.title;
      banner.querySelector('p').textContent = copy.body;
      banner.querySelector('[data-privacy-link]').textContent = copy.privacy;
      banner.querySelector('[data-consent-accept]').textContent = copy.accept;
      banner.querySelector('[data-consent-decline]').textContent = copy.decline;
      document.querySelectorAll('[data-privacy-settings]').forEach(button => button.textContent = copy.settings);
    };
    update();
    banner.querySelector('[data-consent-accept]').addEventListener('click', () => setConsent(true));
    banner.querySelector('[data-consent-decline]').addEventListener('click', () => {
      if (loaded) revoke();
      else { storeChoice(false); clearAnalyticsCookies(); banner.hidden = true; }
    });
    document.addEventListener('click', event => {
      const button = event.target.closest('[data-privacy-settings]');
      if (!button) return;
      banner.hidden = false;
      banner.querySelector('[data-consent-accept]').focus();
    });
    document.addEventListener('portfolio:language', update);
  }

  function attachEvents() {
    document.addEventListener('portfolio:event', event => {
      const detail = event.detail || {};
      if (typeof detail.name === 'string') send(detail.name, detail.params);
    });
    document.addEventListener('portfolio:render', observeSeries);
    window.addEventListener('scroll', () => {
      if (engaged || window.scrollY < 250) return;
      if (send('engaged_visit', {})) engaged = true;
    }, { passive: true });
    document.addEventListener('visibilitychange', () => { if (!document.hidden) propagateCampaign(); });
  }

  function init() {
    mountConsent();
    attachEvents();
    propagateCampaign();
    if (choice === true) startProviders();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
  window.PORTFOLIO_ANALYTICS = Object.freeze({ setConsent, safeLocation, campaign, revoke });
})();
