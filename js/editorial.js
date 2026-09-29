(() => {
  const portfolio = window.PORTFOLIO;
  if (!portfolio) return;
  const gallery = document.getElementById('gallery');
  const dialog = document.getElementById('detailDialog');
  const dialogContent = document.getElementById('dialogContent');
  const switchButton = document.getElementById('langSwitch');
  let language = localStorage.getItem('northstar-lang') === 'ru' ? 'ru' : 'en';
  let returnFocus = null;

  const label = (item, key) => item[key === 'note' ? (language === 'ru' ? 'noteRu' : 'noteEn') : language];
  const resultPath = id => `assets/curated/${id}.webp`;
  const sourcePath = name => `assets/curated/references/${name}`;

  function render() {
    document.documentElement.lang = language;
    document.querySelectorAll('[data-en][data-ru]').forEach(element => {
      element.innerHTML = element.dataset[language];
    });
    switchButton.textContent = language === 'ru' ? 'EN' : 'RU';
    switchButton.setAttribute('aria-label', language === 'ru' ? 'Switch to English' : 'Переключить на русский');
    gallery.replaceChildren();

    portfolio.sections.forEach(section => {
      const block = document.createElement('section');
      block.className = 'portfolio-section';
      block.id = section.id;
      block.setAttribute('aria-labelledby', `${section.id}-heading`);
      const header = document.createElement('div');
      header.className = 'portfolio-section-head';
      header.innerHTML = `<span class="number">${section.number} / 04</span><h3 id="${section.id}-heading">${label(section)}</h3><p>${label(section, 'note')}</p>`;
      block.append(header);
      const grid = document.createElement('div');
      grid.className = 'grid';

      portfolio.items.filter(item => item.section === section.id).forEach((item, index) => {
        const card = document.createElement('article');
        card.className = `work-card ${index === 0 ? 'feature' : index === 1 ? 'side' : index === 2 || index === 3 ? 'wide' : ''}`;
        const button = document.createElement('button');
        button.className = 'card-button';
        button.type = 'button';
        button.setAttribute('aria-label', `${label(item)} — ${language === 'ru' ? 'смотреть референс и результат' : 'view reference and result'}`);
        const media = document.createElement('span');
        media.className = 'card-media';
        const picture = document.createElement('img');
        picture.src = resultPath(item.id);
        picture.alt = label(item);
        picture.loading = 'lazy';
        picture.decoding = 'async';
        media.append(picture);
        const caption = document.createElement('span');
        caption.className = 'card-caption';
        const words = document.createElement('span');
        const title = document.createElement('strong');
        title.textContent = label(item);
        const note = document.createElement('small');
        note.textContent = label(item, 'note');
        words.append(title, note);
        const arrow = document.createElement('span');
        arrow.className = 'arrow';
        arrow.setAttribute('aria-hidden', 'true');
        arrow.textContent = '↗';
        caption.append(words, arrow);
        button.append(media, caption);
        button.addEventListener('click', () => openDetail(item, button));
        card.append(button);
        grid.append(card);
      });
      block.append(grid);
      gallery.append(block);
    });
  }

  function openDetail(item, trigger) {
    returnFocus = trigger;
    const section = portfolio.sections.find(value => value.id === item.section);
    const sourceLabel = language === 'ru' ? 'Исходный референс' : 'Original reference';
    const resultLabel = language === 'ru' ? 'Итоговый кадр' : 'Final image';
    const note = language === 'ru'
      ? 'Исходный снимок показывает предмет или блюдо, вокруг которого создан итоговый кадр.'
      : 'The original photo shows the object or dish used as the starting reference for the final image.';
    dialogContent.replaceChildren();
    const inner = document.createElement('div');
    inner.className = 'detail-inner';
    const top = document.createElement('div');
    top.className = 'detail-top';
    const heading = document.createElement('h2');
    heading.textContent = label(item);
    const category = document.createElement('p');
    category.textContent = `${label(section)} / ${label(item, 'note')}`;
    top.append(heading, category);
    const pair = document.createElement('div');
    pair.className = 'detail-pair';
    [[sourceLabel, sourcePath(item.source)], [resultLabel, resultPath(item.id)]].forEach(([caption, path]) => {
      const figure = document.createElement('figure');
      const figcaption = document.createElement('figcaption');
      figcaption.textContent = caption;
      const img = document.createElement('img');
      img.src = path;
      img.alt = `${caption}: ${label(item)}`;
      figure.append(figcaption, img);
      pair.append(figure);
    });
    const description = document.createElement('p');
    description.className = 'detail-note';
    description.textContent = note;
    inner.append(top, pair, description);
    dialogContent.append(inner);
    dialog.showModal();
    document.body.classList.add('dialog-open');
  }

  switchButton.addEventListener('click', () => {
    language = language === 'en' ? 'ru' : 'en';
    localStorage.setItem('northstar-lang', language);
    if (dialog.open) dialog.close();
    render();
  });
  document.getElementById('dialogClose').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    dialogContent.replaceChildren();
    returnFocus?.focus();
  });
  render();
})();
