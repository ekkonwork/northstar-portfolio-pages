import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = fs.readFileSync(path.join(root, 'js/analytics.js'), 'utf8');
const contactHtml = fs.readFileSync(path.join(root, 'contact.html'), 'utf8');
const contactScripts = [...contactHtml.matchAll(/<script\b[^>]*src="js\/([^"?]+)[^>]*>/g)].map(match => match[1]);
assert(contactScripts.indexOf('curated.js') >= 0 && contactScripts.indexOf('portfolio-additions.js') > contactScripts.indexOf('curated.js'), 'The contact route loads the complete portfolio item map.');
assert(contactScripts.indexOf('contact.js') > contactScripts.indexOf('portfolio-additions.js'), 'Form item context is validated after the portfolio map loads.');
assert(contactHtml.includes('action="https://formspree.io/f/xqpeylrq"'), 'The no-JavaScript form fallback targets the configured Formspree endpoint.');
for (const [file, itemId] of [['case-food-campaign.html', 'northstar_food_01_2'], ['case-fashion-images.html', '01_outerwear_umbrella_rain_night'], ['case-furniture-scenes.html', '11_furniture_walnut_chair_hotel_lounge']]) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  const scripts = [...html.matchAll(/<script\b[^>]*src="js\/([^"?]+)[^>]*>/g)].map(match => match[1]);
  assert(scripts.indexOf('portfolio-additions.js') > scripts.indexOf('curated.js'), `${file} loads all curated item data before contact tracking.`);
  assert(scripts.indexOf('contact.js') > scripts.indexOf('portfolio-additions.js'), `${file} validates contact context after loading portfolio data.`);
  assert(html.includes(`data-item-id="${itemId}"`) && html.includes(`data-contact-link`), `${file} CTA carries a validated work ID into the contact event.`);
}

class Target {
  constructor() { this.listeners = new Map(); }
  addEventListener(name, fn) { const list = this.listeners.get(name) || []; list.push(fn); this.listeners.set(name, list); }
  dispatchEvent(event) { for (const fn of this.listeners.get(event.type) || []) fn(event); }
}

class Element extends Target {
  constructor() { super(); this.dataset = {}; this.attributes = {}; this.children = []; this.hidden = false; this.textContent = ''; this.href = ''; }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  querySelector(selector) { return this.nodes?.get(selector) || null; }
  querySelectorAll() { return []; }
  append(...children) { this.children.push(...children); }
  click() { this.dispatchEvent({type: 'click', target: this}); }
  closest(selector) { if (selector === '[data-privacy-settings]' && this.dataset.privacySettings !== undefined) return this; return selector === 'a[href]' && this.matches(selector) ? this : null; }
  hasAttribute(name) { return name === 'href' ? Boolean(this.href) : Object.prototype.hasOwnProperty.call(this.attributes, name); }
  matches(selector) { return selector === '[data-no-campaign]' ? this.dataset.noCampaign !== undefined : selector === 'a[href]' && Boolean(this.href); }
  getAttribute(name) { return name === 'href' ? this.href : this.attributes[name] ?? null; }
  focus() { this.focused = true; }
  set innerHTML(_) {
    this.nodes = new Map();
    for (const selector of ['strong', 'p', '[data-privacy-link]', '[data-consent-accept]', '[data-consent-decline]']) this.nodes.set(selector, new Element());
  }
}

class Observer {
  constructor(callback) { this.callback = callback; Observer.instances.push(this); }
  observe(node) { this.node = node; }
  disconnect() {}
}
Observer.instances = [];

const map = new Map();
const listeners = new Target();
const privacyButton = new Element();
privacyButton.dataset.privacySettings = '';
const appLink = new Element();
appLink.href = 'https://ekkonwork.github.io/northstar-portfolio-pages/food.html';
const unrelatedLink = new Element();
unrelatedLink.href = 'https://ekkonwork.github.io/stock-library/index.html';
const groups = [{
  querySelector: () => ({dataset: {itemId: 'food-item-1'}}),
  closest: () => null
}];
const document = Object.assign(listeners, {
  readyState: 'complete',
  documentElement: {lang: 'en'},
  body: {dataset: {page: 'food-design'}, append(node) { if (node.id) map.set(node.id, node); }},
  head: {children: [], append(node) { this.children.push(node); }},
  cookie: '',
  createElement: () => new Element(),
  getElementById: id => map.get(id) || null,
  querySelector: selector => selector === '[data-privacy-settings]' ? privacyButton : null,
  querySelectorAll: selector => {
    if (selector === 'a[href]') return [appLink, unrelatedLink];
    if (selector === '.project-group[id^="series-"] .group-header') return groups;
    return [];
  }
});

const location = new URL(`https://ekkonwork.github.io/northstar-portfolio-pages/food.html?utm_source=outreach&utm_medium=email&utm_campaign=brand_oct26&ref=${'A'.repeat(21)}Q&email=private@example.com`);
let reloads = 0;
location.reload = () => { reloads += 1; };
const dataLayer = [];
const clarityCalls = [];
const window = {
  PORTFOLIO_CONFIG: { ga4MeasurementId: 'G-GSPHXD47HH', clarityProjectId: 'yx6j9yd0g5', siteOrigin: 'https://ekkonwork.github.io' },
  PORTFOLIO: { items: [{id: 'food-item-1'}], groups: {'food-design': [{ids: ['food-item-1']}] } },
  location,
  clarity: (...args) => clarityCalls.push(args),
  dataLayer,
  scrollY: 0,
  IntersectionObserver: Observer,
  addEventListener: () => {}
};
window.location = location;
const storage = new Map();
const localStorage = { getItem: key => storage.get(key) || null, setItem: (key, value) => storage.set(key, value) };
const history = { state: null, replaceState: (_state, _title, url) => { location.href = new URL(url, location.href).href; } };
const context = { window, document, location, history, localStorage, URL, URLSearchParams, Date, JSON, Set, Number, Object, Array, Math, IntersectionObserver: Observer, CustomEvent: class { constructor(type, init = {}) { this.type = type; this.detail = init.detail; } } };
vm.runInNewContext(source, context, {filename: 'js/analytics.js'});

const banner = document.getElementById('privacyConsent');
assert(banner, 'Consent panel is mounted.');
assert.equal(banner.hidden, false, 'A visitor without a saved choice sees the consent panel.');
assert.equal(document.head.children.length, 0, 'Analytics providers are not loaded before consent.');
const guardedPath = window.PORTFOLIO_ANALYTICS.safeLocation('https://ekkonwork.github.io/northstar-portfolio-pages/private@example.com?email=private@example.com#secret');
assert.equal(guardedPath, 'https://ekkonwork.github.io/northstar-portfolio-pages/', 'Unknown paths and query text cannot become analytics page locations.');

// Dynamic contact CTAs must receive the allowlisted campaign at activation time.
const dynamicContact = new Element();
dynamicContact.href = 'https://ekkonwork.github.io/northstar-portfolio-pages/contact.html?item=food-item-1&step=brief#projectForm';
document.dispatchEvent({type: 'click', target: dynamicContact});
const dynamicUrl = new URL(dynamicContact.href);
assert.equal(dynamicUrl.searchParams.get('item'), 'food-item-1', 'Viewer item context survives campaign propagation.');
assert.equal(dynamicUrl.searchParams.get('step'), 'brief', 'Existing query values survive campaign propagation.');
assert.equal(dynamicUrl.hash, '#projectForm', 'Existing hash survives campaign propagation.');
assert.equal(dynamicUrl.searchParams.get('utm_source'), 'outreach');
assert.equal(dynamicUrl.searchParams.get('utm_medium'), 'email');
assert.equal(dynamicUrl.searchParams.get('utm_campaign'), 'brand_oct26');
assert.equal(dynamicUrl.searchParams.get('ref'), `${'A'.repeat(21)}Q`);
const dynamicCategoryLink = new Element();
dynamicCategoryLink.href = 'https://ekkonwork.github.io/northstar-portfolio-pages/contact.html';
document.dispatchEvent({type: 'contextmenu', target: dynamicCategoryLink});
assert.equal(new URL(dynamicCategoryLink.href).searchParams.get('utm_campaign'), 'brand_oct26', 'Dynamic category CTA is decorated before context-menu navigation.');

const rejectedLinks = [
  Object.assign(new Element(), {href: 'https://ekkonwork.github.io/northstar-portfolio-pages/contact.html', attributes: {download: ''}}),
  Object.assign(new Element(), {href: 'https://ekkonwork.github.io/northstar-portfolio-pages/contact.html', dataset: {noCampaign: ''}}),
  Object.assign(new Element(), {href: 'mailto:person@example.com'}),
  Object.assign(new Element(), {href: 'https://ekkonwork.github.io/northstar-portfolio-pages/assets/file.pdf'}),
  Object.assign(new Element(), {href: 'https://outside.example/contact.html'})
];
for (const link of rejectedLinks) {
  const before = link.href;
  document.dispatchEvent({type: 'click', target: link});
  assert.equal(link.href, before, `Campaign was added to excluded link ${before}.`);
}
location.href = `https://ekkonwork.github.io/northstar-portfolio-pages/food.html?utm_source=outreach&utm_medium=email&utm_campaign=brand_oct26&ref=${'A'.repeat(21)}Q&email=private@example.com`;
const invalidReferenceLink = new Element();
invalidReferenceLink.href = 'https://ekkonwork.github.io/northstar-portfolio-pages/contact.html';
document.dispatchEvent({type: 'click', target: invalidReferenceLink});
assert(!new URL(invalidReferenceLink.href).searchParams.has('email'), 'PII from the current URL is never propagated.');
location.href = `https://ekkonwork.github.io/northstar-portfolio-pages/food.html?utm_source=outreach&utm_medium=email&utm_campaign=brand_oct26&ref=${'A'.repeat(21)}Z`;
const invalidRefLink = new Element();
invalidRefLink.href = 'https://ekkonwork.github.io/northstar-portfolio-pages/contact.html?item=food-item-1';
document.dispatchEvent({type: 'auxclick', target: invalidRefLink});
assert.equal(new URL(invalidRefLink.href).searchParams.get('item'), 'food-item-1');
assert.equal(new URL(invalidRefLink.href).searchParams.has('utm_source'), false, 'Invalid reference blocks campaign propagation.');
location.href = `https://ekkonwork.github.io/northstar-portfolio-pages/food.html?utm_source=outreach&utm_medium=email&utm_campaign=brand_oct26&ref=${'A'.repeat(21)}Q&email=private@example.com`;

// Explicit acceptance must load both configured providers and remove arbitrary query text first.
banner.hidden = false;
banner.querySelector('[data-consent-accept]').click();
assert.equal(document.head.children.length, 2, 'GA4 and Clarity load after opt-in.');
const defaultConsent = dataLayer.find(entry => entry[0] === 'consent' && entry[1] === 'default')[2];
assert.equal(defaultConsent.ad_storage, 'denied');
assert.equal(defaultConsent.ad_user_data, 'denied');
assert.equal(defaultConsent.ad_personalization, 'denied');
assert(!location.href.includes('private@example.com'), 'Unapproved query values are removed before Clarity loads.');
assert(appLink.href.includes('utm_campaign=brand_oct26'), 'Approved campaign fields propagate to portfolio routes.');
assert(!unrelatedLink.href.includes('ref='), 'Campaign references do not leak to other repositories on the same host.');

const queuedEvents = dataLayer.filter(entry => entry[0] === 'event');
const beforeSeries = queuedEvents.length;
const observer = Observer.instances.at(-1);
const header = {closest: () => groups[0], querySelector: () => null};
observer.callback([{target: header, isIntersecting: true}]);
observer.callback([{target: header, isIntersecting: true}]);
const seriesEvents = dataLayer.filter(entry => entry[0] === 'event' && entry[1] === 'series_view');
assert.equal(seriesEvents.length, 1, 'A viewed series is recorded once per page view.');
assert.equal(seriesEvents[0][2].series_id, 'food-item-1', 'Series dimension uses its stable first work ID.');
assert(dataLayer.length > beforeSeries, 'A visible series queues a meaningful event.');
assert(clarityCalls.some(call => call[0] === 'set' && call[1] === 'series_id' && call[2] === 'food-item-1'), 'Clarity receives the validated stable series ID.');

document.dispatchEvent(new CustomEvent('portfolio:event', {detail: {
  name: 'image_open',
  params: {sector: 'food-design', series_id: 'series-1', item_id: 'food-item-1', email: 'secret@example.com', company: 'private company'}
}}));
const imageEvent = dataLayer.find(entry => entry[0] === 'event' && entry[1] === 'image_open');
assert(imageEvent, 'A valid image interaction is accepted.');
assert.equal(imageEvent[2].series_id, 'food-item-1');
assert(!('email' in imageEvent[2]) && !('company' in imageEvent[2]), 'PII-like extra event fields are discarded.');
assert(clarityCalls.some(call => call[0] === 'set' && call[1] === 'sector' && call[2] === 'food-design'), 'Clarity receives allowlisted sector context.');
assert(clarityCalls.some(call => call[0] === 'set' && call[1] === 'campaign_ref' && call[2] === `${'A'.repeat(21)}Q`), 'Clarity receives only a canonical opaque campaign reference.');
assert(!clarityCalls.some(call => call[0] === 'set' && /email|company/i.test(call[1])), 'PII-like dimensions are never set in Clarity.');

// Reopening settings and withdrawing consent after opt-in revokes providers and reloads denied.
document.dispatchEvent({type: 'click', target: privacyButton});
banner.querySelector('[data-consent-decline]').click();
assert.equal(reloads, 1, 'Withdrawing an active consent reloads the page after denial.');
assert.equal(JSON.parse(storage.get('northstar-analytics-consent-v1')).analytics, false);
assert(dataLayer.some(entry => entry[0] === 'consent' && entry[1] === 'update' && entry[2].analytics_storage === 'denied'));

console.log('Analytics checks passed: consent gating, URL/parameter filtering, stable series IDs, campaign route scope and withdrawal.');
