/* Small bilingual layer and practical contact paths around the image work. */
(() => {
  'use strict';

  const root = document.documentElement;
  const body = document.body;
  const isEditorialPage = Boolean(document.getElementById('gallery') && document.getElementById('langSwitch'));
  let lang = root.lang.toLowerCase().startsWith('ru') ? 'ru' : 'en';
  try { if (localStorage.getItem('northstar-lang') === 'ru') lang = 'ru'; } catch (_) {}

  function setLanguage(next) {
    lang = next === 'ru' ? 'ru' : 'en';
    root.lang = lang;
    document.querySelectorAll('[data-en][data-ru]').forEach(node => {
      const content = node.dataset[lang];
      if (content !== undefined) node.innerHTML = content;
    });
    document.querySelectorAll('[data-alt-en][data-alt-ru]').forEach(node => { node.alt = node.dataset[lang === 'ru' ? 'altRu' : 'altEn']; });
    document.querySelectorAll('[data-placeholder-en][data-placeholder-ru]').forEach(node => { node.placeholder = node.dataset[lang === 'ru' ? 'placeholderRu' : 'placeholderEn']; });
    document.querySelectorAll('[data-submit-label-en][data-submit-label-ru]').forEach(node => { node.textContent = node.dataset[lang === 'ru' ? 'submitLabelRu' : 'submitLabelEn']; });
    const button = document.getElementById('langSwitch');
    if (button && !isEditorialPage) {
      button.textContent = lang === 'ru' ? 'EN' : 'RU';
      button.setAttribute('aria-label', lang === 'ru' ? 'Switch to English' : 'Переключить на русский');
    }
    try { localStorage.setItem('northstar-lang', lang); } catch (_) {}
    document.dispatchEvent(new CustomEvent('portfolio:language', { detail: { language: lang } }));
  }

  function contactLink(label) {
    const link = document.createElement('a');
    link.className = 'conversion-cta';
    link.href = 'contact.html';
    link.dataset.ctaPosition = label;
    link.dataset.contactLink = '';
    link.dataset.en = 'Discuss a project ↗';
    link.dataset.ru = 'Обсудить проект ↗';
    link.textContent = lang === 'ru' ? link.dataset.ru : link.dataset.en;
    return link;
  }

  function addCategoryContact() {
    if (body.dataset.page === 'home' || !document.querySelector('.category-main') || document.querySelector('.category-contact')) return;
    const block = document.createElement('section');
    block.className = 'category-contact';
    const title = document.createElement('h2');
    title.dataset.en = 'Need a larger image series?';
    title.dataset.ru = 'Нужна большая серия изображений?';
    title.textContent = lang === 'ru' ? title.dataset.ru : title.dataset.en;
    const copy = document.createElement('p');
    copy.dataset.en = 'I’m available for ongoing image production and larger batches. Share the product, visual direction and approximate scope to start a conversation.';
    copy.dataset.ru = 'Открыт к долгосрочному сотрудничеству и большим сериям. Расскажите о продукте, визуальном направлении и примерном объёме, чтобы обсудить проект.';
    copy.textContent = lang === 'ru' ? copy.dataset.ru : copy.dataset.en;
    block.append(title, copy, contactLink('category'));
    const footer = document.querySelector('.category-footer');
    (footer || document.querySelector('.category-main')).before(block);
  }

  function addPrivacyFooter() {
    const footer = document.querySelector('.site-footer,.category-footer,.conversion-footer');
    if (!footer || footer.querySelector('[data-privacy-settings]')) return;
    const link = document.createElement('a');
    link.href = 'privacy.html';
    link.dataset.en = 'Privacy';
    link.dataset.ru = 'Конфиденциальность';
    link.textContent = lang === 'ru' ? link.dataset.ru : link.dataset.en;
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.privacySettings = '';
    button.className = 'privacy-settings-link';
    button.dataset.en = 'Privacy settings';
    button.dataset.ru = 'Настройки приватности';
    button.textContent = lang === 'ru' ? button.dataset.ru : button.dataset.en;
    footer.append(link, button);
  }

  function init() {
    if (!isEditorialPage) setLanguage(lang);
    const button = document.getElementById('langSwitch');
    if (button && !isEditorialPage) button.addEventListener('click', () => setLanguage(lang === 'en' ? 'ru' : 'en'));
    addCategoryContact();
    addPrivacyFooter();
    document.querySelectorAll('a[href="contact.html"],a[href^="contact.html?"]').forEach(link => { link.dataset.contactLink = ''; });
    if (body.dataset.page === 'contact') {
      const params = new URLSearchParams(location.search);
      const item = params.get('item');
      const form = document.getElementById('projectForm');
      if (form && item) form.dataset.itemQuery = item;
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
  document.addEventListener('portfolio:language', event => { lang = event.detail && event.detail.language === 'ru' ? 'ru' : 'en'; });
})();
