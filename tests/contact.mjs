import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = fs.readFileSync(path.join(root, 'js/contact.js'), 'utf8');

class Field {
  constructor(name, value = '', options = {}) {
    this.name = name;
    this.value = value;
    this.required = Boolean(options.required);
    this.type = options.type || 'text';
    this.attributes = {};
  }
  matches(selector) {
    if (selector.includes('input:not')) return this.tag === 'textarea' || this.tag === 'select' || (this.tag === 'input' && !['hidden', 'checkbox', 'radio'].includes(this.type));
    return selector.split(',').some((part) => part.trim() === this.tag || part.trim() === `${this.tag}[type="${this.type}"]`);
  }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  getAttribute(name) { return this.attributes[name] || ''; }
  removeAttribute(name) { delete this.attributes[name]; }
  focus() { this.focused = true; }
}

class FormDataStub {
  constructor(form) {
    this.values = new Map();
    for (const field of form.fields) this.values.set(field.name, field.value);
  }
  get(name) { return this.values.has(name) ? this.values.get(name) : null; }
  set(name, value) { this.values.set(name, value); }
  delete(name) { this.values.delete(name); }
}

function makeHarness({search = '', fetchImpl, initial = {}} = {}) {
  const events = [];
  const documentListeners = new Map();
  const formListeners = new Map();
  const fields = [
    new Field('name', initial.name || ''),
    new Field('email', initial.email || 'misha@example.com', {required: true}),
    new Field('message', initial.message || 'Please contact me', {required: true}),
    new Field('product_url', initial.product_url || ''),
    new Field('volume', initial.volume || ''),
    new Field('timing', initial.timing || ''),
    new Field('item_id', ''), new Field('selectedProject', ''), new Field('project', ''),
    new Field('utm_source', ''), new Field('utm_medium', ''), new Field('utm_campaign', ''), new Field('ref', ''),
    new Field('_gotcha', '', {type: 'text'})
  ];
  fields.forEach((field) => { field.tag = 'input'; });
  const byName = new Map(fields.map((field) => [field.name, field]));
  const status = {textContent: '', dataset: {}};
  const button = {textContent: 'Send', dataset: {submitLabelEn: 'Send'}, disabled: false};
  const form = {
    fields,
    elements: {namedItem: (name) => byName.get(name) || null},
    dataset: {}, action: '', resets: 0,
    addEventListener(name, listener) { const bucket = formListeners.get(name) || []; bucket.push(listener); formListeners.set(name, bucket); },
    querySelector(selector) { return selector === '[data-form-status]' ? status : selector === '[type="submit"]' ? button : null; },
    querySelectorAll() { return []; },
    reset() { this.resets += 1; for (const field of fields) if (!['item_id', 'selectedProject', 'project'].includes(field.name)) field.value = ''; }
  };
  const document = {
    readyState: 'complete',
    body: {dataset: {lang: 'en'}, appendChild() {}},
    documentElement: {lang: 'en'},
    listeners: documentListeners,
    addEventListener(name, listener) { const bucket = documentListeners.get(name) || []; bucket.push(listener); documentListeners.set(name, bucket); },
    dispatchEvent(event) { events.push(event); },
    getElementById(id) { return id === 'projectForm' ? form : null; },
    querySelector(selector) { return selector === '[data-form-status]' ? status : null; },
    querySelectorAll() { return []; }
  };
  const window = {
    location: {search},
    PORTFOLIO_CONFIG: {contactEmail: 'misha@example.com', formEndpoint: 'https://formspree.io/f/xqpeylrq'},
    PORTFOLIO: {items: [{id: 'work-food-1', en: 'Food study', ru: 'Фуд-съёмка'}, {id: 'work-fashion-2', en: 'Fashion study', ru: 'Мода'}]},
    setTimeout, clearTimeout, isSecureContext: false
  };
  const context = {
    window, document, URL, URLSearchParams, FormData: FormDataStub, AbortController,
    CustomEvent: class CustomEvent { constructor(type, options) { this.type = type; this.detail = options.detail; } },
    navigator: {}, Element: class Element {}, fetch: fetchImpl || (async () => ({ok: true, headers: {get: () => 'application/json'}, json: async () => ({ok: true})}))
  };
  vm.runInNewContext(source, context);
  return {
    events, form, fields, status, button,
    field: (name) => byName.get(name),
    triggerForm: async (name, event = {}) => {
      for (const listener of formListeners.get(name) || []) await listener({target: event.target || form, preventDefault() { this.prevented = true; }, ...event});
    },
    triggerDocument: (name, event = {}) => { for (const listener of documentListeners.get(name) || []) listener(event); }
  };
}

const positive = () => ({ok: true, headers: {get: () => 'application/json'}, json: async () => ({ok: true})});

{
  const h = makeHarness({search: '?item=work-food-1&utm_source=outreach&utm_medium=email&utm_campaign=agency_oct26&ref=AbCdEf0123456789_-AbCQ'});
  assert.equal(h.field('utm_source').value, 'outreach');
  assert.equal(h.field('utm_medium').value, 'email');
  assert.equal(h.field('utm_campaign').value, 'agency_oct26');
  assert.equal(h.field('ref').value, 'AbCdEf0123456789_-AbCQ');

  const link = {
    dataset: {itemId: 'work-fashion-2'},
    getAttribute: (name) => name === 'data-cta-position' ? 'viewer' : null,
    matches: () => false
  };
  h.triggerDocument('click', {target: {parentElement: {closest: () => link}}});
  const click = h.events.find((event) => event.detail.name === 'contact_click');
  assert.equal(click.detail.params.item_id, 'work-fashion-2', 'Viewer CTA item context should win over a stale query item.');
  assert.equal(click.detail.params.cta_position, 'viewer');
}

{
  const h = makeHarness();
  const message = h.field('message');
  message.value = '   ';
  await h.triggerForm('input', {target: message});
  assert.equal(h.events.filter((event) => event.detail.name === 'brief_start').length, 0, 'Focus or whitespace alone is not a started brief.');
  message.value = 'A private project brief that must never enter analytics';
  await h.triggerForm('input', {target: message});
  await h.triggerForm('input', {target: message});
  const starts = h.events.filter((event) => event.detail.name === 'brief_start');
  assert.equal(starts.length, 1, 'The first nonempty user input should start one brief event.');
  assert.deepEqual(Object.keys(starts[0].detail.params).sort(), ['item_id']);
  assert(!JSON.stringify(starts).includes(message.value), 'Brief text must stay out of analytics.');
}

{
  const h = makeHarness({search: '?utm_source=misha%40example.com&utm_medium=phone&utm_campaign=client_123&ref=phone-number-12345'});
  assert.equal(h.field('utm_source').value, '');
  assert.equal(h.field('utm_medium').value, '');
  assert.equal(h.field('utm_campaign').value, '');
  assert.equal(h.field('ref').value, '');
  const noncanonical = makeHarness({search: '?ref=0123456789abcdefghij-B'});
  assert.equal(noncanonical.field('ref').value, '', 'A noncanonical base64url tail must not pass as a 128-bit ref.');
}

{
  let submitted;
  const h = makeHarness({
    search: '?utm_source=portfolio&utm_medium=referral&utm_campaign=smallbusiness_oct26&ref=0123456789abcdefghij-A',
    fetchImpl: async (_url, options) => { submitted = options.body; return positive(); }
  });
  const email = h.field('email');
  const message = h.field('message');
  const originalEmail = email.value;
  const originalMessage = message.value;
  await h.triggerForm('submit');
  assert.equal(h.form.resets, 1, 'A positive provider acknowledgement should reset the form.');
  assert.equal(h.status.dataset.state, 'success');
  assert.equal(submitted.get('utm_source'), 'portfolio');
  assert.equal(submitted.get('utm_medium'), 'referral');
  assert.equal(submitted.get('utm_campaign'), 'smallbusiness_oct26');
  assert.equal(submitted.get('ref'), '0123456789abcdefghij-A');
  const success = h.events.find((event) => event.detail.name === 'brief_submit_success');
  assert(success);
  assert.deepEqual(Object.keys(success.detail.params).sort(), ['item_id']);
  assert(!JSON.stringify(h.events).includes(originalEmail));
  assert(!JSON.stringify(h.events).includes(originalMessage));
}

for (const payload of [
  {ok: false, next: null},
  {next: '/thanks', errors: [{message: 'Rejected by provider'}]},
  {success: false, next: '/thanks'},
  {ok: true, next: null, error: 'Provider rejected the submission'}
]) {
  const h = makeHarness({fetchImpl: async () => ({ok: true, headers: {get: () => 'application/json'}, json: async () => payload})});
  await h.triggerForm('submit');
  assert.equal(h.form.resets, 0, `Contradictory provider response must preserve the draft: ${JSON.stringify(payload)}`);
  assert.equal(h.field('message').value, 'Please contact me');
  assert.equal(h.status.dataset.state, 'error');
  assert.equal(h.events.filter((event) => event.detail.name === 'brief_submit_success').length, 0, 'A rejected response must not emit conversion success.');
}

{
  let release;
  let calls = 0;
  const h = makeHarness({fetchImpl: async () => { calls += 1; return new Promise((resolve) => { release = resolve; }); }});
  const first = h.triggerForm('submit');
  await Promise.resolve();
  await h.triggerForm('submit');
  assert.equal(calls, 1, 'A second submit while the first is pending must not duplicate delivery.');
  release(positive());
  await first;
}

{
  const h = makeHarness({fetchImpl: async () => { const error = new Error('aborted'); error.name = 'AbortError'; throw error; }});
  await h.triggerForm('submit');
  assert.equal(h.field('email').value, 'misha@example.com');
  assert.equal(h.field('message').value, 'Please contact me');
  assert.match(h.status.textContent, /timed out/i);
  assert.equal(h.form.resets, 0);
}

console.log('Contact behavior verified: allowlisted campaign context, viewer item attribution, one-time meaningful input event, and safe form submission outcomes.');
