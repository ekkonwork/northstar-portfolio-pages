(() => {
  const portfolio = window.PORTFOLIO;
  if (!portfolio) return;
  const gallery = document.getElementById('gallery');
  const dialog = document.getElementById('detailDialog');
  const dialogContent = document.getElementById('dialogContent');
  const switchButton = document.getElementById('langSwitch');
  const page = document.body.dataset.page || 'home';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let language = 'en';
  try { language = localStorage.getItem('northstar-lang') === 'ru' ? 'ru' : 'en'; } catch (_) {}
  let returnFocus = null;
  let activeItem = null;
  let detailView = 'compare';
  let worldIndex = 1;
  let worldRequest = 0;
  const companions = ['02_outerwear_snow_wide','65_food_takeaway_coffee_city_landscape','63_watches_blue_dial_packshot_full40','40_furniture_walnut_chair_japandi_room40'];
  const worldWords = ['FASHION','FOOD','OBJECTS','SPACES'];
  const label = (item, key) => item[key === 'note' ? (language === 'ru' ? 'noteRu' : 'noteEn') : language];
  const text = (en, ru) => language === 'ru' ? ru : en;
  const resultPath = id => `assets/curated/${id}.webp`;
  const sourcePath = name => `assets/curated/reference-previews/${name.replace(/\.png$/,'.webp')}`;
  const originalSourcePath = name => `assets/curated/references/${name}`;
  const itemById = id => portfolio.items.find(value => value.id === id);
  const make = (tag, className, content) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (content !== undefined) node.textContent = content;
    return node;
  };
  function resultImage(item, eager = false) {
    const image = make('img');
    image.src = resultPath(item.id);
    image.alt = label(item);
    image.loading = eager ? 'eager' : 'lazy';
    image.decoding = 'async';
    const size = window.IMAGE_SIZES?.[item.id];
    if (size) [image.width, image.height] = size;
    return image;
  }
  function roundLink(section) {
    const link = make('a','primary-link');
    link.href = section.page;
    link.append(make('span','',text('Explore the series','Смотреть серии')));
    const arrow = make('span','round-arrow','↗');
    arrow.setAttribute('aria-hidden','true');
    link.append(arrow);
    return link;
  }
  function createCard(item, eager = false) {
    const card = make('article','work-card');
    card.dataset.item = item.id;
    const button = make('button','card-button');
    button.type = 'button';
    button.setAttribute('aria-label',`${label(item)} — ${text('view reference and result','смотреть референс и результат')}`);
    const media = make('span','card-media');
    media.append(resultImage(item,eager));
    const caption = make('span','card-caption');
    const words = make('span');
    words.append(make('strong','',label(item)),make('small','',label(item,'note')));
    const arrow = make('span','arrow','↗');
    arrow.setAttribute('aria-hidden','true');
    caption.append(words,arrow);
    button.append(media,caption);
    button.addEventListener('click',() => openDetail(item,button,window.matchMedia('(max-width:560px)').matches ? 'result' : 'compare'));
    card.append(button);
    return card;
  }
  function renderHome() {
    gallery.className = 'sector-grid';
    portfolio.sections.forEach((section,index) => {
      const row = make('article','sector-card');
      row.dataset.sector = section.id;
      const copy = make('div','sector-caption');
      const title = make('h3');
      const titleLink = make('a','',label(section));
      titleLink.href = section.page;
      title.append(titleLink);
      const count = portfolio.items.filter(item => item.section === section.id).length;
      copy.append(make('span','sector-number',`${section.number} / 04`),title,make('p','',label(section,'note')),make('span','sector-count',`${String(count).padStart(2,'0')} ${text('selected images','кадров')}`),roundLink(section));
      const art = make('div','sector-artworks');
      [section.cover,companions[index]].forEach(id => {
        const link = make('a','sector-media');
        link.href = section.page;
        link.setAttribute('aria-label',`${label(section)} — ${label(itemById(id))}`);
        link.append(resultImage(itemById(id)));
        art.append(link);
      });
      row.append(copy,art);
      gallery.append(row);
    });
    renderWorldTabs();
    selectWorld(worldIndex,false);
  }
  function renderWorldTabs() {
    const selector = document.getElementById('worldSelector');
    selector.replaceChildren();
    portfolio.sections.forEach((section,index) => {
      const button = make('button','world-tab');
      button.id = `world-tab-${index}`;
      button.type = 'button';
      button.setAttribute('role','tab');
      button.setAttribute('aria-controls','spatialScene');
      button.setAttribute('aria-selected',String(index === worldIndex));
      button.tabIndex = index === worldIndex ? 0 : -1;
      const arrow = make('b','',index === worldIndex ? '↗' : '+');
      arrow.setAttribute('aria-hidden','true');
      button.append(make('small','',section.number),make('span','',label(section)),arrow);
      button.addEventListener('click',() => selectWorld(index));
      button.addEventListener('keydown',event => {
        let next;
        if (event.key === 'ArrowRight') next = (index + 1) % 4;
        if (event.key === 'ArrowLeft') next = (index + 3) % 4;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = 3;
        if (next === undefined) return;
        event.preventDefault();
        selector.children[next].focus();
        selectWorld(next);
      });
      selector.append(button);
    });
  }
  function loadImage(path) {
    return new Promise((resolve,reject) => {
      const image = new Image();
      image.onload = async () => { if (image.decode) await image.decode().catch(() => {}); resolve(image); };
      image.onerror = reject;
      image.src = path;
    });
  }
  async function selectWorld(index,animate = true) {
    const request = ++worldRequest;
    const section = portfolio.sections[index];
    const item = itemById(section.cover);
    const scene = document.getElementById('spatialScene');
    scene.setAttribute('aria-busy','true');
    const status = document.getElementById('worldStatus');
    if (animate) status.textContent = `${text('Loading','Загружается раздел')}: ${label(section)}`;
    document.querySelectorAll('.world-tab').forEach((tab,i) => {
      if (i === index && animate) tab.querySelector('b').textContent = '…';
      else tab.querySelector('b').textContent = i === worldIndex ? '↗' : '+';
    });
    try {
      // Decode both photographs before changing the visible chapter. Fast
      // repeated selections must never insert a late image from an older one.
      await Promise.all([loadImage(resultPath(item.id)),loadImage(sourcePath(item.source))]);
      if (request !== worldRequest) return;
      worldIndex = index;
      const image = document.getElementById('sceneResult');
      image.src = resultPath(item.id);
      image.alt = label(item);
      const size = window.IMAGE_SIZES?.[item.id];
      if (size) [image.width,image.height] = size;
      const source = document.getElementById('sceneSource');
      source.src = sourcePath(item.source);
      source.alt = `${text('Original reference','Исходный референс')}: ${label(section)}`;
      document.getElementById('sceneCategory').textContent = `${section.number} / ${label(section)}`;
      document.getElementById('sceneResultTitle').textContent = label(item);
      document.getElementById('sceneNumber').textContent = section.number;
      document.getElementById('sceneWord').textContent = worldWords[index];
      scene.dataset.world = section.id;
      scene.setAttribute('aria-labelledby',`world-tab-${index}`);
      ['sceneResultLink','sceneSourceLink','sceneExplore'].forEach(id => {
        const link = document.getElementById(id);
        link.href = section.page;
        link.setAttribute('aria-label',`${text('Explore','Открыть')}: ${label(section)}`);
      });
      document.querySelectorAll('.world-tab').forEach((tab,i) => {
        tab.setAttribute('aria-selected',String(i === index));
        tab.tabIndex = i === index ? 0 : -1;
        tab.querySelector('b').textContent = i === index ? '↗' : '+';
      });
      if (animate && !reduced.matches) {
        document.querySelectorAll('.scene-print').forEach(print => {
          print.getAnimations().forEach(animation => animation.cancel());
          print.animate([{opacity:0},{opacity:1}],{duration:500,easing:'cubic-bezier(.22,1,.36,1)'});
        });
      }
      document.dispatchEvent(new CustomEvent('portfolio:worldchange'));
      if (animate) status.textContent = label(section);
    } catch (_) {
      // Keep the previous decoded chapter and working category links offline.
      if (request === worldRequest && animate) status.textContent = text('The images could not load. Please try again.','Изображения не загрузились. Попробуйте ещё раз.');
    } finally {
      if (request === worldRequest) {
        scene.setAttribute('aria-busy','false');
        document.querySelectorAll('.world-tab').forEach((tab,i) => { tab.querySelector('b').textContent = i === worldIndex ? '↗' : '+'; });
      }
    }
  }
  function referenceStrip(group) {
    const strip = make('div','series-reference');
    const sources = [...new Set(group.ids.map(id => itemById(id).source))];
    const previews = make('div','reference-images');
    if (sources.length > 1) previews.classList.add('multiple');
    sources.forEach(source => {
      const item = group.ids.map(itemById).find(item => item.source === source);
      const button = make('button','reference-preview');
      button.type = 'button';
      button.setAttribute('aria-label',`${text('View original reference','Посмотреть исходник')}: ${label(item)}`);
      const image = make('img','reference-image');
      image.src = sourcePath(source);
      image.alt = text('Original product photograph','Исходная фотография продукта');
      image.loading = 'lazy';
      image.decoding = 'async';
      button.append(image);
      button.addEventListener('click',() => openDetail(item,button,'source'));
      previews.append(button);
    });
    const copy = make('div','reference-copy');
    copy.append(make('strong','',sources.length === 1 ? text('The starting point','Исходная фотография') : text('The starting points','Исходные фотографии')),make('span','',text('A real reference. A different scene, light and atmosphere.','Реальный референс. Новая сцена, свет и атмосфера.')));
    const open = make('button','reference-open',text('Compare','Сравнить'));
    open.type = 'button';
    open.append(make('span','','↗'));
    open.setAttribute('aria-label',text('Compare the reference and final image','Сравнить исходник и итоговый кадр'));
    open.addEventListener('click',() => openDetail(itemById(group.ids[0]),open,'compare'));
    strip.append(previews,copy,open);
    return strip;
  }
  function renderCategory(section) {
    document.getElementById('categoryNumber').textContent = `${section.number} / 04`;
    document.getElementById('categoryTitle').textContent = label(section);
    document.getElementById('categoryNote').textContent = label(section,'note');
    document.title = `${label(section)} — Mikhail`;
    document.querySelectorAll('.desktop-nav a,.mobile-sections a').forEach(link => {
      if (link.getAttribute('href') === section.page) link.setAttribute('aria-current','page');
    });
    const groups = portfolio.groups[section.id] || [];
    const count = portfolio.items.filter(item => item.section === section.id).length;
    const stats = make('div','category-stats');
    stats.append(make('span','',`${String(count).padStart(2,'0')} ${text('selected images','кадров')}`),make('span','',text('Original references included in every series','Исходные фотографии в каждой серии')));
    gallery.append(stats);
    const indexNav = make('nav','project-index');
    indexNav.setAttribute('aria-label',text('Project series','Серии работ'));
    groups.forEach((group,index) => {
      const link = make('a','',label(group));
      link.href = `#series-${index + 1}`;
      if (index === 0) link.setAttribute('aria-current','location');
      indexNav.append(link);
    });
    gallery.append(indexNav);
    groups.forEach((group,index) => {
      const block = make('section','project-group');
      block.id = `series-${index + 1}`;
      const header = make('div','group-header');
      header.append(make('span','',String(index + 1).padStart(2,'0')),make('h2','',label(group)),make('small','group-count',`${String(group.ids.length).padStart(2,'0')} ${text('images',group.ids.length === 1 ? 'кадр' : group.ids.length < 5 ? 'кадра' : 'кадров')}`));
      const grid = make('div','project-grid');
      group.ids.forEach((id,i) => {
        const item = itemById(id);
        if (!item) throw new Error(`Missing portfolio item: ${id}`);
        grid.append(createCard(item,index === 0 && i === 0));
      });
      block.append(header,referenceStrip(group),grid);
      gallery.append(block);
    });
    const next = portfolio.sections[(portfolio.sections.indexOf(section) + 1) % portfolio.sections.length];
    const link = document.getElementById('nextSection');
    link.href = next.page;
    link.replaceChildren();
    const words = make('div');
    words.append(make('small','',text('Next visual world','Следующий визуальный мир')),make('strong','',label(next)));
    link.append(words,make('span','','↗'));
  }
  function render() {
    document.documentElement.lang = language;
    document.querySelectorAll('[data-en][data-ru]').forEach(element => { element.innerHTML = element.dataset[language].replace('{count}',portfolio.items.length); });
    switchButton.textContent = language === 'ru' ? 'EN' : 'RU';
    switchButton.setAttribute('aria-label',text('Переключить на русский','Switch to English'));
    document.querySelector('.skip').textContent = text('Skip to work','Перейти к работам');
    document.querySelector('.brand').setAttribute('aria-label',text('Mikhail — home','Михаил — главная'));
    document.querySelector('.desktop-nav').setAttribute('aria-label',text('Portfolio sections','Разделы портфолио'));
    document.querySelector('.mobile-sections').setAttribute('aria-label',text('Portfolio sections','Разделы портфолио'));
    document.getElementById('worldSelector')?.setAttribute('aria-label',text('Explore four visual worlds','Четыре визуальных мира'));
    document.getElementById('dialogClose').setAttribute('aria-label',text('Close image viewer','Закрыть просмотр'));
    gallery.replaceChildren();
    if (page === 'home') renderHome();
    else {
      const section = portfolio.sections.find(value => value.id === page);
      if (!section) throw new Error(`Unknown portfolio page: ${page}`);
      renderCategory(section);
    }
    document.dispatchEvent(new CustomEvent('portfolio:render'));
  }
  function openDetail(item,trigger,view) {
    activeItem = item;
    if (trigger) returnFocus = trigger;
    if (view) detailView = view;
    const section = portfolio.sections.find(value => value.id === item.section);
    const sourceLabel = item.referenceKind === 'model' ? text('Original model','Исходная модель') : text('Original product','Исходный товар');
    const resultLabel = text('Final image','Итоговый кадр');
    dialogContent.replaceChildren();
    const inner = make('div','detail-inner');
    const top = make('div','detail-top');
    const heading = make('h2','',label(item));
    heading.id = 'detailTitle';
    dialog.setAttribute('aria-labelledby','detailTitle');
    top.append(heading,make('p','',`${label(section)} / ${label(item,'note')}`));
    const pair = make('div','detail-pair');
    pair.dataset.view = detailView;
    [[sourceLabel,sourcePath(item.source)],[resultLabel,resultPath(item.id)]].forEach(([caption,path]) => {
      const figure = make('figure');
      const image = make('img');
      image.src = path;
      image.alt = `${caption}: ${label(item)}`;
      const figcaption = make('figcaption','',caption);
      figure.append(figcaption,image);
      pair.append(figure);
    });
    const views = make('div','detail-view-tabs');
    let originalLink;
    const updateFullImageLink = () => {
      originalLink.href = detailView === 'source' ? originalSourcePath(item.source) : resultPath(item.id);
      originalLink.textContent = detailView === 'source' ? text('Open original reference ↗','Открыть исходную фотографию ↗') : text('Open full image ↗','Открыть изображение целиком ↗');
    };
    views.setAttribute('role','group');
    views.setAttribute('aria-label',text('Image view','Режим просмотра'));
    [['compare',text('Compare','Сравнение')],['result',text('Image','Результат')],['source',text('Reference','Исходник')]].forEach(([mode,title]) => {
      const button = make('button','',title);
      button.type = 'button';
      button.setAttribute('aria-pressed',String(detailView === mode));
      button.addEventListener('click',() => {
        detailView = mode;
        pair.dataset.view = mode;
        views.querySelectorAll('button').forEach(tab => tab.setAttribute('aria-pressed',String(tab === button)));
        updateFullImageLink();
      });
      views.append(button);
    });
    top.append(views);
    const tools = make('div','detail-tools');
    const pager = make('div','detail-pager');
    const ordered = portfolio.groups[item.section].flatMap(group => group.ids);
    const previous = make('button','','←');
    previous.type = 'button';
    previous.setAttribute('aria-label',text('Previous image','Предыдущий кадр'));
    previous.addEventListener('click',() => stepDetail(-1));
    const next = make('button','','→');
    next.type = 'button';
    next.setAttribute('aria-label',text('Next image','Следующий кадр'));
    next.addEventListener('click',() => stepDetail(1));
    const counter = make('span','detail-counter',`${String(ordered.indexOf(item.id) + 1).padStart(2,'0')} / ${String(ordered.length).padStart(2,'0')}`);
    pager.append(previous,counter,next);
    originalLink = make('a','original-link');
    updateFullImageLink();
    originalLink.target = '_blank';
    originalLink.rel = 'noopener';
    tools.append(pager,originalLink);
    inner.append(top,pair,tools);
    dialogContent.append(inner);
    if (!dialog.open) dialog.showModal();
    dialog.scrollTop = 0;
    document.body.classList.add('dialog-open');
  }
  function stepDetail(direction) {
    if (!activeItem) return;
    const ordered = portfolio.groups[activeItem.section].flatMap(group => group.ids);
    const index = ordered.indexOf(activeItem.id);
    const id = ordered[(index + direction + ordered.length) % ordered.length];
    openDetail(itemById(id));
    dialog.querySelector(direction > 0 ? '[aria-label="Next image"],[aria-label="Следующий кадр"]' : '[aria-label="Previous image"],[aria-label="Предыдущий кадр"]').focus({preventScroll:true});
  }
  switchButton.addEventListener('click',() => {
    language = language === 'en' ? 'ru' : 'en';
    try { localStorage.setItem('northstar-lang',language); } catch (_) {}
    if (dialog.open) dialog.close();
    render();
  });
  document.getElementById('dialogClose').addEventListener('click',() => dialog.close());
  dialog.addEventListener('close',() => {
    activeItem = null;
    document.body.classList.remove('dialog-open');
    dialogContent.replaceChildren();
    if (returnFocus?.isConnected) returnFocus.focus({preventScroll:true});
  });
  dialog.addEventListener('keydown',event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      stepDetail(event.key === 'ArrowRight' ? 1 : -1);
    }
  });
  render();
})();
