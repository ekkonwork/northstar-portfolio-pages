(() => {
  const portfolio = window.PORTFOLIO;
  if (!portfolio) return;
  const gallery = document.getElementById('gallery');
  const dialog = document.getElementById('detailDialog');
  const dialogContent = document.getElementById('dialogContent');
  const switchButton = document.getElementById('langSwitch');
  const page = document.body.dataset.page || 'home';
  let language = localStorage.getItem('northstar-lang') === 'ru' ? 'ru' : 'en';
  let returnFocus = null;

  const label = (item, key) => item[key === 'note' ? (language === 'ru' ? 'noteRu' : 'noteEn') : language];
  const resultPath = id => `assets/curated/${id}.webp`;
  const sourcePath = name => `assets/curated/references/${name}`;

  function createCard(item) {
    const card = document.createElement('article');
    card.className = 'work-card';
    const button = document.createElement('button');
    button.className = 'card-button';
    button.type = 'button';
    button.setAttribute('aria-label', `${label(item)} — ${language === 'ru' ? 'смотреть референс и результат' : 'view reference and result'}`);
    const media = document.createElement('span');
    media.className = 'card-media';
    const image = document.createElement('img');
    image.src = resultPath(item.id);
    image.alt = label(item);
    image.loading = 'lazy';
    image.decoding = 'async';
    media.append(image);
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
    return card;
  }

  function renderHome() {
    gallery.className = 'sector-grid';
    portfolio.sections.forEach(section => {
      const link = document.createElement('a');
      link.className = 'sector-card';
      link.href = section.page;
      const media = document.createElement('span');
      media.className = 'sector-media';
      const image = document.createElement('img');
      image.src = resultPath(section.cover);
      image.alt = label(section);
      image.loading = 'lazy';
      media.append(image);
      const caption = document.createElement('span');
      caption.className = 'sector-caption';
      const number = document.createElement('small');
      number.textContent = `${section.number} / 04`;
      const title = document.createElement('strong');
      title.textContent = label(section);
      const note = document.createElement('span');
      note.textContent = label(section, 'note');
      const arrow = document.createElement('span');
      arrow.className = 'sector-arrow';
      arrow.textContent = '↗';
      caption.append(number, title, note, arrow);
      link.append(media, caption);
      gallery.append(link);
    });
  }

  function renderCategory(section) {
    document.getElementById('categoryNumber').textContent = `${section.number} / 04`;
    document.getElementById('categoryTitle').textContent = label(section);
    document.getElementById('categoryNote').textContent = label(section, 'note');
    document.title = `${label(section)} — Mikhail`;
    document.querySelectorAll('.desktop-nav a, .mobile-sections a').forEach(link => {
      if (link.getAttribute('href') === section.page) link.setAttribute('aria-current', 'page');
    });
    const groups = portfolio.groups[section.id] || [];
    groups.forEach((group, index) => {
      const block = document.createElement('section');
      block.className = 'project-group';
      const header = document.createElement('div');
      header.className = 'group-header';
      const number = document.createElement('span');
      number.textContent = `${String(index + 1).padStart(2, '0')} / ${String(groups.length).padStart(2, '0')}`;
      const title = document.createElement('h2');
      title.textContent = label(group);
      header.append(number, title);
      const grid = document.createElement('div');
      grid.className = 'project-grid';
      group.ids.forEach(id => {
        const item = portfolio.items.find(value => value.id === id);
        if (!item) throw new Error(`Missing portfolio item: ${id}`);
        grid.append(createCard(item));
      });
      block.append(header, grid);
      gallery.append(block);
    });
    const next = portfolio.sections[(portfolio.sections.indexOf(section) + 1) % portfolio.sections.length];
    const nextLink = document.getElementById('nextSection');
    nextLink.href = next.page;
    nextLink.textContent = `${language === 'ru' ? 'Следующий раздел' : 'Next direction'}: ${label(next)} ↗`;
  }

  function render() {
    document.documentElement.lang = language;
    document.querySelectorAll('[data-en][data-ru]').forEach(element => {
      element.innerHTML = element.dataset[language];
    });
    switchButton.textContent = language === 'ru' ? 'EN' : 'RU';
    switchButton.setAttribute('aria-label', language === 'ru' ? 'Switch to English' : 'Переключить на русский');
    gallery.replaceChildren();
    if (page === 'home') renderHome();
    else {
      const section = portfolio.sections.find(value => value.id === page);
      if (!section) throw new Error(`Unknown portfolio page: ${page}`);
      renderCategory(section);
    }
  }

  function openDetail(item, trigger) {
    returnFocus = trigger;
    const section = portfolio.sections.find(value => value.id === item.section);
    const sourceLabel = item.referenceKind === 'model'
      ? (language === 'ru' ? 'Исходная модель' : 'Original model')
      : (language === 'ru' ? 'Исходный товар' : 'Original product');
    const resultLabel = language === 'ru' ? 'Итоговый кадр' : 'Final image';
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
      const image = document.createElement('img');
      image.src = path;
      image.alt = `${caption}: ${label(item)}`;
      figure.append(figcaption, image);
      pair.append(figure);
    });
    inner.append(top, pair);
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
