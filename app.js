const dialog = document.querySelector('.lightbox');
const dialogImage = dialog.querySelector('img');
const closeButton = dialog.querySelector('.lightbox-close');

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
