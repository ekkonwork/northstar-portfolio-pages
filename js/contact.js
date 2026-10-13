/* Contact and brief form behavior for the standalone portfolio contact page. */
(function () {
  'use strict';

  const LIMITS = {
    name: 120,
    email: 254,
    message: 3000,
    product_url: 500,
    volume: 250,
    timing: 250
  };
  const CAMPAIGN_VALUES = {
    utm_source: ['outreach', 'portfolio', 'direct'],
    utm_medium: ['email', 'referral'],
    utm_campaign: ['agency_oct26', 'brand_oct26', 'smallbusiness_oct26', 'qa_oct26']
  };
  // ref is an opaque 128-bit random value encoded as unpadded base64url.
  const REF_RE = /^[A-Za-z0-9_-]{21}[AQgw]$/;
  const FORMSPREE_RE = /^https:\/\/formspree\.io\/f\/[a-zA-Z0-9_-]{1,80}$/;
  const MESSAGES = {
    en: {
      sending: 'Sending your message…',
      success: 'Your inquiry was submitted. I’ll reply by email.',
      error: 'The form could not be submitted. Your text is still here; please try again or email me directly.',
      serverError: 'Please check the highlighted fields and try again.',
      emailFallback: 'The form is not connected yet. Email me at {email}.',
      copySuccess: 'Email copied.',
      copyFallback: 'Clipboard access is blocked. Email: {email}',
      copyFailed: 'Could not copy automatically. Email: {email}',
      required: 'Please complete this field.',
      invalidEmail: 'Enter a valid email address.',
      invalidUrl: 'Enter a valid http or https product URL.',
      tooLong: 'This field is too long.',
      timeout: 'The request timed out. Your text is still here; please try again.'
    },
    ru: {
      sending: 'Отправляю сообщение…',
      success: 'Запрос принят. Отвечу вам по электронной почте.',
      error: 'Не удалось отправить форму. Текст сохранён: попробуйте ещё раз или напишите мне на почту.',
      serverError: 'Проверьте отмеченные поля и попробуйте ещё раз.',
      emailFallback: 'Форма пока не подключена. Напишите мне: {email}.',
      copySuccess: 'Почта скопирована.',
      copyFallback: 'Браузер запретил копирование. Почта: {email}',
      copyFailed: 'Не удалось скопировать автоматически. Почта: {email}',
      required: 'Заполните это поле.',
      invalidEmail: 'Введите корректный адрес электронной почты.',
      invalidUrl: 'Введите корректную ссылку с http или https.',
      tooLong: 'Слишком длинное значение.',
      timeout: 'Истекло время ожидания. Текст сохранён: попробуйте ещё раз.'
    }
  };

  function language() {
    const explicit = document.body && document.body.dataset.lang;
    const html = document.documentElement.lang || '';
    return String(explicit || html).toLowerCase().startsWith('ru') ? 'ru' : 'en';
  }

  function t(key, values) {
    const text = MESSAGES[language()][key] || MESSAGES.en[key] || '';
    return Object.keys(values || {}).reduce(function (result, name) {
      return result.replace('{' + name + '}', String(values[name]));
    }, text);
  }

  function emit(name, params) {
    document.dispatchEvent(new CustomEvent('portfolio:event', {
      detail: { name: name, params: params || {} }
    }));
  }

  function cleanCampaignValue(name, value) {
    const token = String(value || '').trim();
    const allowed = CAMPAIGN_VALUES[name];
    return allowed && allowed.includes(token) ? token : '';
  }

  function cleanRef(value) {
    const token = String(value || '').trim();
    return REF_RE.test(token) ? token : '';
  }

  function endpoint() {
    const candidate = window.PORTFOLIO_CONFIG && window.PORTFOLIO_CONFIG.formEndpoint;
    if (typeof candidate !== 'string' || !FORMSPREE_RE.test(candidate)) return '';
    if (/\/(?:REALID|YOUR_FORM_ID|FORM_ID|replace_me)$/i.test(candidate)) return '';
    return candidate;
  }

  function portfolioItems() {
    const items = window.PORTFOLIO && window.PORTFOLIO.items;
    return Array.isArray(items) ? items : [];
  }

  function validatedItem(raw) {
    const candidate = String(raw || '').trim();
    if (!candidate || candidate.length > 120) return null;
    return portfolioItems().find(function (item) {
      return item && typeof item.id === 'string' && item.id === candidate;
    }) || null;
  }

  function queryItem() {
    const params = new URLSearchParams(window.location.search);
    return validatedItem(params.get('item_id') || params.get('item') || params.get('project'));
  }

  function setNamedValue(form, name, value) {
    const field = form.elements.namedItem(name);
    if (field && 'value' in field) field.value = value;
  }

  function attachCampaign(form) {
    const params = new URLSearchParams(window.location.search);
    ['utm_source', 'utm_medium', 'utm_campaign', 'ref'].forEach(function (key) { setNamedValue(form, key, ''); });
    ['utm_source', 'utm_medium', 'utm_campaign'].forEach(function (key) {
      const token = cleanCampaignValue(key, params.get(key));
      if (token) setNamedValue(form, key, token);
    });
    const ref = cleanRef(params.get('ref'));
    if (ref) setNamedValue(form, 'ref', ref);
  }

  function attachProject(form, item) {
    if (!item) return;
    setNamedValue(form, 'item_id', item.id);
    const lang = language();
    const label = typeof item[lang] === 'string' ? item[lang] : item.en;
    if (typeof label === 'string') {
      setNamedValue(form, 'selectedProject', label);
      setNamedValue(form, 'project', label);
    }
  }

  function fieldErrorNode(form, name) {
    const nodes = form.querySelectorAll('[data-field-error], [data-error-for]');
    for (const node of nodes) {
      if (node.getAttribute('data-field-error') === name || node.getAttribute('data-error-for') === name) return node;
    }
    return null;
  }

  function setFieldError(form, field, message) {
    if (!field) return;
    const node = fieldErrorNode(form, field.name);
    if (message) {
      field.setAttribute('aria-invalid', 'true');
      if (node) {
        if (!node.id) node.id = 'error-' + field.name;
        node.textContent = message;
        node.hidden = false;
        const ids = new Set((field.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean));
        ids.add(node.id);
        field.setAttribute('aria-describedby', Array.from(ids).join(' '));
      }
    } else {
      field.removeAttribute('aria-invalid');
      if (node) {
        node.textContent = '';
        node.hidden = true;
      }
    }
  }

  function validate(form) {
    let firstInvalid = null;
    const fields = ['name', 'email', 'message', 'product_url', 'volume', 'timing'];
    fields.forEach(function (name) {
      const field = form.elements.namedItem(name);
      if (!field || !('value' in field)) return;
      const value = String(field.value || '').trim();
      let error = '';
      if (value.length > (LIMITS[name] || 3000)) error = t('tooLong');
      else if (field.required && !value) error = t('required');
      else if (name === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = t('invalidEmail');
      else if (name === 'product_url' && value) {
        try {
          const parsed = new URL(value);
          if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') error = t('invalidUrl');
        } catch (_) {
          error = t('invalidUrl');
        }
      }
      setFieldError(form, field, error);
      if (error && !firstInvalid) firstInvalid = field;
    });
    return firstInvalid;
  }

  function statusNode(form) {
    return form.querySelector('[data-form-status]') || document.querySelector('[data-form-status]');
  }

  function setStatus(form, text, type) {
    const node = statusNode(form);
    if (!node) return;
    node.textContent = text;
    if (type) node.dataset.state = type;
    else delete node.dataset.state;
  }

  function submitButton(form) {
    return form.querySelector('[type="submit"]');
  }

  function setBusy(form, busy) {
    form.dataset.submitting = busy ? 'true' : 'false';
    const button = submitButton(form);
    if (!button) return;
    if (busy) {
      button.dataset.contactOriginalLabel = button.textContent;
      button.disabled = true;
      button.textContent = t('sending');
    } else {
      button.disabled = false;
      const label = language() === 'ru' ? button.dataset.submitLabelRu : button.dataset.submitLabelEn;
      button.textContent = label || button.dataset.contactOriginalLabel || button.textContent;
      delete button.dataset.contactOriginalLabel;
    }
  }

  function responseIsPositive(payload) {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return false;
    if (payload.ok === false || payload.success === false || hasProviderErrors(payload)) return false;
    if (payload.ok === true || payload.success === true) return true;
    return Object.prototype.hasOwnProperty.call(payload, 'next') && (payload.next === null || typeof payload.next === 'string');
  }

  function hasProviderErrors(payload) {
    return ['error', 'errors'].some(function (key) {
      const value = payload[key];
      if (value === null || value === undefined || value === false || value === 0) return false;
      if (typeof value === 'string') return value.trim().length > 0;
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'object') return Object.keys(value).length > 0;
      return true;
    });
  }

  function serverMessage(payload) {
    if (payload && Array.isArray(payload.errors) && payload.errors.length) {
      const first = payload.errors[0];
      if (first && typeof first.message === 'string' && first.message.length < 300) return first.message;
    }
    return t('serverError');
  }

  function handleForm(form) {
    const email = window.PORTFOLIO_CONFIG && window.PORTFOLIO_CONFIG.contactEmail;
    const formStatus = statusNode(form);
    const submit = submitButton(form);
    const target = endpoint();
    if (target) form.action = target;
    if (!target) {
      if (submit) submit.disabled = true;
      if (formStatus) setStatus(form, t('emailFallback', { email: email || 'ekkonwork@gmail.com' }), 'notice');
    }

    const item = queryItem();
    setNamedValue(form, 'item_id', '');
    setNamedValue(form, 'selectedProject', '');
    setNamedValue(form, 'project', '');
    attachProject(form, item);
    attachCampaign(form);

    Object.keys(LIMITS).forEach(function (name) {
      const field = form.elements.namedItem(name);
      if (field && 'maxLength' in field && field.maxLength < 0) field.maxLength = LIMITS[name];
      if (field && 'maxLength' in field && field.maxLength > LIMITS[name]) field.maxLength = LIMITS[name];
      if (field && 'maxLength' in field && field.maxLength === -1) field.maxLength = LIMITS[name];
    });

    let started = false;
    form.addEventListener('input', function (event) {
      const field = event.target;
      if (started || !field || !field.matches('input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"]),textarea,select')) return;
      if (!String(field.value || '').trim()) return;
      started = true;
      emit('brief_start', { item_id: item ? item.id : '' });
    });

    form.addEventListener('input', function (event) {
      if (event.target && event.target.name) setFieldError(form, event.target, '');
    });

    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      if (!target) {
        setStatus(form, t('emailFallback', { email: email || 'ekkonwork@gmail.com' }), 'notice');
        return;
      }
      if (form.dataset.submitting === 'true') return;

      const invalid = validate(form);
      if (invalid) {
        setStatus(form, t('serverError'), 'error');
        invalid.focus();
        return;
      }
      const honeypot = form.elements.namedItem('_gotcha');
      if (honeypot && String(honeypot.value || '').trim()) return;

      const payload = new FormData(form);
      Object.keys(LIMITS).forEach(function (name) {
        const value = payload.get(name);
        if (typeof value === 'string') payload.set(name, value.trim().slice(0, LIMITS[name]));
      });

      // Only attach campaign values that match the documented allowlist and token syntax.
      ['utm_source', 'utm_medium', 'utm_campaign'].forEach(function (name) {
        const value = cleanCampaignValue(name, payload.get(name));
        if (value) payload.set(name, value);
        else payload.delete(name);
      });
      const ref = cleanRef(payload.get('ref'));
      if (ref) payload.set('ref', ref);
      else payload.delete('ref');

      setBusy(form, true);
      setStatus(form, t('sending'), 'pending');
      const controller = new AbortController();
      const timeoutId = window.setTimeout(function () { controller.abort(); }, 15000);
      try {
        const response = await fetch(target, {
          method: 'POST',
          body: payload,
          headers: { Accept: 'application/json' },
          signal: controller.signal,
          credentials: 'omit'
        });
        const contentType = response.headers && response.headers.get('content-type') || '';
        let data = null;
        if (contentType.toLowerCase().includes('application/json')) {
          try { data = await response.json(); } catch (_) { data = null; }
        }
        if (!response.ok) {
          setStatus(form, serverMessage(data), 'error');
          return;
        }
        if (!responseIsPositive(data)) {
          setStatus(form, t('error'), 'error');
          return;
        }

        form.reset();
        attachProject(form, item);
        attachCampaign(form);
        setStatus(form, t('success'), 'success');
        emit('brief_submit_success', { item_id: item ? item.id : '' });
      } catch (error) {
        setStatus(form, error && error.name === 'AbortError' ? t('timeout') : t('error'), 'error');
      } finally {
        window.clearTimeout(timeoutId);
        setBusy(form, false);
      }
    });
  }

  async function copyEmail(button) {
    const email = String(button.getAttribute('data-copy-email') || (window.PORTFOLIO_CONFIG && window.PORTFOLIO_CONFIG.contactEmail) || 'ekkonwork@gmail.com').trim();
    const status = button.parentElement && button.parentElement.querySelector('[data-copy-status]') || document.querySelector('[data-copy-status]');
    let copied = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(email);
        copied = true;
      } else if (document.execCommand) {
        const input = document.createElement('input');
        input.value = email;
        input.setAttribute('aria-hidden', 'true');
        input.style.position = 'fixed';
        input.style.opacity = '0';
        document.body.appendChild(input);
        input.select();
        copied = document.execCommand('copy');
        input.remove();
      }
    } catch (_) {
      copied = false;
    }
    if (status) {
      status.textContent = copied ? t('copySuccess') : t(navigator.clipboard ? 'copyFallback' : 'copyFailed', { email: email });
      status.dataset.state = copied ? 'success' : 'notice';
    }
    if (copied) emit('email_copy', { contact_method: 'copy' });
  }

  function setupCopyButtons() {
    document.querySelectorAll('[data-copy-email]').forEach(function (button) {
      button.addEventListener('click', function () { copyEmail(button); });
    });
  }

  function setupContactClicks() {
    document.addEventListener('click', function (event) {
      const target = event.target instanceof Element ? event.target : event.target && event.target.parentElement;
      const link = target && target.closest('a[href^="mailto:"], [data-contact-link]');
      if (!link) return;
      const position = String(link.getAttribute('data-cta-position') || 'contact');
      const item = validatedItem(link.dataset && link.dataset.itemId) || queryItem();
      emit('contact_click', {
        cta_position: position || 'contact',
        contact_method: link.matches('a[href^="mailto:"]') ? 'mailto' : 'link',
        item_id: item ? item.id : ''
      });
    });
  }

  function init() {
    const form = document.getElementById('projectForm');
    if (form) handleForm(form);
    setupCopyButtons();
    setupContactClicks();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
}());
