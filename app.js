const dialog = document.querySelector('.lightbox');
const dialogImage = dialog.querySelector('img');
const closeButton = dialog.querySelector('.lightbox-close');

const translations = {
  ru: {
    navWork: 'Работы', navProduction: 'Производство', navContact: 'Контакты',
    heroEyebrow: 'ЛОКАЛЬНОЕ AI-ПРОИЗВОДСТВО · 2026',
    heroTitle: 'Один исходник.<br><em>Целая кампания.</em>',
    heroLede: 'Коммерческие визуальные системы для продуктов, которые должны оставаться узнаваемыми.',
    heroLink: 'Смотреть шесть производственных систем <span>↓</span>',
    selectedEyebrow: 'ИЗБРАННЫЕ СИСТЕМЫ',
    selectedTitle: 'Не отдельные картинки.<br>Повторяемый визуальный язык.',
    selectedBody: 'Каждый кейс начинается с исходных материалов и заканчивается цельной коммерческой серией, созданной локально на выделенном оборудовании.',
    privateEyebrow: 'ЛОКАЛЬНОЕ ПРОИЗВОДСТВО',
    privateTitle: 'Собрано внутри студии.<br>Измерено на RTX 5090.',
    deliveryEyebrow: 'ФОРМАТ ПОСТАВКИ',
    deliveryTitle: 'Готово выйти за пределы мудборда.',
    contactEyebrow: 'WHITE-LABEL · КАМПАНИИ · SKU-СЕРИИ',
    contactTitle: 'Принесите продукт.<br>Построим визуальную систему.'
  },
  en: {
    navWork: 'Work', navProduction: 'Production', navContact: 'Contact',
    heroEyebrow: 'CONTROLLED AI PRODUCTION · 2026',
    heroTitle: 'One source.<br><em>A whole campaign.</em>',
    heroLede: 'Commercial image systems for products that must stay recognizable.',
    heroLink: 'Explore six production systems <span>↓</span>',
    selectedEyebrow: 'SELECTED SYSTEMS',
    selectedTitle: 'Not isolated images.<br>Repeatable visual language.',
    selectedBody: 'Each case starts with supplied source material and ends as a cohesive commercial series, produced privately on dedicated hardware.',
    privateEyebrow: 'PRIVATE PRODUCTION',
    privateTitle: 'Built in-house.<br>Measured on RTX 5090.',
    deliveryEyebrow: 'DELIVERY FORMAT',
    deliveryTitle: 'Built to leave the moodboard.',
    contactEyebrow: 'WHITE-LABEL · CAMPAIGNS · SKU BATCHES',
    contactTitle: 'Bring the product.<br>Build the visual system.'
  }
};

function setLanguage(language) {
  document.documentElement.lang = language;
  document.querySelectorAll('[data-i18n]').forEach((node) => {
    const key = node.dataset.i18n;
    if (translations[language][key]) node.innerHTML = translations[language][key];
  });
  document.querySelectorAll('[data-lang]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.lang === language));
  });
  localStorage.setItem('northstar-language', language);
}

document.querySelectorAll('[data-lang]').forEach((button) => {
  button.addEventListener('click', () => setLanguage(button.dataset.lang));
});
setLanguage(localStorage.getItem('northstar-language') || 'en');

function openLightbox(source, alt = '') {
  dialogImage.src = source;
  dialogImage.alt = alt;
  dialog.showModal();
}

document.querySelectorAll('[data-full]').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const thumbnail = trigger.querySelector('img');
    openLightbox(trigger.dataset.full, thumbnail?.alt || 'Full-resolution production image');
  });
});

closeButton.addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});
dialog.addEventListener('close', () => {
  dialogImage.removeAttribute('src');
});

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reducedMotion || !('IntersectionObserver' in window)) {
  document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
}

window.addEventListener('load', () => {
  if (!window.location.hash) return;
  document.querySelector(window.location.hash)?.scrollIntoView({ behavior: 'auto', block: 'start' });
});
