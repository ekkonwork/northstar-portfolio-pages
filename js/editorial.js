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
  const companions = ['northstar_vton_06_1','northstar_food_10_2','northstar_jewelry_watch_02_2','northstar_furniture_09_1'];
  const worldWords = ['FASHION','FOOD','OBJECTS','SPACES'];
  const label = (item, key) => item[key === 'note' ? (language === 'ru' ? 'noteRu' : 'noteEn') : language];
  const text = (en, ru) => language === 'ru' ? ru : en;
  const ruFrames = count => {
    const mod100 = count % 100, mod10 = count % 10;
    if (mod100 >= 11 && mod100 <= 14) return 'кадров';
    if (mod10 === 1) return 'кадр';
    if (mod10 >= 2 && mod10 <= 4) return 'кадра';
    return 'кадров';
  };
  const resultPath = id => `assets/curated/${id}.webp`;
  const sourcePath = name => `assets/curated/reference-previews/${name.replace(/\.png$/,'.webp')}`;
  const originalSourcePath = name => `assets/curated/references/${name}`;
  const itemById = id => portfolio.items.find(value => value.id === id);
  const seriesFor = id => {
    const item = itemById(id);
    const index = item ? (portfolio.groups[item.section] || []).findIndex(group => group.ids.includes(id)) : -1;
    return index < 0 ? '' : `series-${index + 1}`;
  };
  function track(name,params) {
    document.dispatchEvent(new CustomEvent('portfolio:event',{detail:{name,params}}));
  }
  const make = (tag, className, content) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (content !== undefined) node.textContent = content;
    return node;
  };
  function resultImage(item, eager = false, layout = 'column') {
    const image = make('img');
    image.src = resultPath(item.id);
    image.alt = label(item);
    image.loading = eager ? 'eager' : 'lazy';
    image.decoding = 'async';
    if (item.responsive?.length) {
      image.srcset = item.responsive.map(width => `assets/curated/previews/${item.id}-${width}.webp ${width}w`).join(', ') + `, ${resultPath(item.id)} ${window.IMAGE_SIZES[item.id][0]}w`;
      image.sizes = layout === 'wide'
        ? '(max-width:560px) calc(100vw - 56px), (max-width:820px) calc(100vw - 72px), min(1564px, calc(100vw - 132px))'
        : layout === 'single'
          ? '(max-width:560px) calc(100vw - 56px), (max-width:820px) calc(72vw - 59px), min(1116px, calc(72vw - 105px))'
          : '(max-width:560px) calc(100vw - 56px), (max-width:820px) calc(50vw - 58px), min(750px, calc(50vw - 98px))';
    }
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
  function createCard(item, eager = false, layout = 'column') {
    const card = make('article','work-card');
    card.dataset.item = item.id;
    const button = make('a','card-button');
    button.href = resultPath(item.id);
    button.dataset.itemId = item.id;
    button.dataset.seriesId = seriesFor(item.id);
    button.dataset.viewMode = 'auto';
    button.setAttribute('aria-label',`${label(item)} — ${text('view reference and result','смотреть референс и результат')}`);
    const media = make('span','card-media');
    media.append(resultImage(item,eager,layout));
    if (item.motion) media.append(make('small','motion-badge',text('View loop','Смотреть ролик')));
    const caption = make('span','card-caption');
    const words = make('span');
    words.append(make('strong','',label(item)),make('small','',label(item,'note')));
    const arrow = make('span','arrow','↗');
    arrow.setAttribute('aria-hidden','true');
    caption.append(words,arrow);
    button.append(media,caption);
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
      copy.append(make('span','sector-number',`${section.number} / 04`),title,make('p','',label(section,'note')),make('span','sector-count',`${String(count).padStart(2,'0')} ${text('selected images',ruFrames(count))}`),roundLink(section));
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
  function responsiveSource(item) {
    return item.responsive?.length
      ? item.responsive.map(width => `assets/curated/previews/${item.id}-${width}.webp ${width}w`).join(', ') + `, ${resultPath(item.id)} ${window.IMAGE_SIZES[item.id][0]}w`
      : '';
  }
  function loadResponsiveImage(item,sizes) {
    return new Promise((resolve,reject) => {
      const image = new Image();
      image.decoding = 'async';
      const srcset = responsiveSource(item);
      if (srcset) { image.sizes = sizes; image.srcset = srcset; }
      image.onload = async () => { if (image.decode) await image.decode().catch(() => {}); resolve(image); };
      image.onerror = reject;
      image.src = resultPath(item.id);
    });
  }
  function setResponsiveImage(image,item,sizes) {
    const srcset = responsiveSource(item);
    if (srcset) { image.sizes = sizes; image.srcset = srcset; }
    else { image.removeAttribute('srcset'); image.removeAttribute('sizes'); }
    image.src = resultPath(item.id);
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
      const sceneSizes = '(max-width:820px) 100vw, 42vw';
      await Promise.all([loadResponsiveImage(item,sceneSizes),loadImage(sourcePath(item.source))]);
      if (request !== worldRequest) return;
      worldIndex = index;
      const image = document.getElementById('sceneResult');
      setResponsiveImage(image,item,sceneSizes);
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
      const button = make('a','reference-preview');
      button.href = originalSourcePath(source);
      button.dataset.referenceItem = item.id;
      button.dataset.seriesId = `series-${(portfolio.groups[item.section] || []).findIndex(value => value.ids.includes(group.ids[0])) + 1}`;
      button.dataset.viewMode = 'source';
      button.setAttribute('aria-label',`${text('View original reference','Посмотреть исходник')}: ${label(item)}`);
      const image = make('img','reference-image');
      image.src = sourcePath(source);
      image.alt = text('Original product photograph','Исходная фотография продукта');
      image.loading = 'lazy';
      image.decoding = 'async';
      button.append(image);
      previews.append(button);
    });
    const copy = make('div','reference-copy');
    copy.append(make('strong','',sources.length === 1 ? text('The starting point','Исходная фотография') : text('The starting points','Исходные фотографии')),make('span','',text('A real reference. A different scene, light and atmosphere.','Реальный референс. Новая сцена, свет и атмосфера.')));
    const firstItem = itemById(group.ids[0]);
    const open = make('a','reference-open',text('Compare','Сравнить'));
    open.href = resultPath(firstItem.id);
    open.dataset.referenceItem = firstItem.id;
    open.dataset.seriesId = seriesFor(firstItem.id);
    open.dataset.viewMode = 'compare';
    open.append(make('span','','↗'));
    open.setAttribute('aria-label',text('Compare the reference and final image','Сравнить исходник и итоговый кадр'));
    strip.append(previews,copy,open);
    return strip;
  }
  function renderCategory(section,hydrate = false) {
    document.getElementById('categoryNumber').textContent = `${section.number} / 04`;
    document.getElementById('categoryTitle').textContent = label(section);
    document.getElementById('categoryNote').textContent = label(section,'note');
    document.title = `${label(section)} — Mikhail`;
    document.querySelectorAll('.desktop-nav a,.mobile-sections a').forEach(link => {
      if (link.getAttribute('href') === section.page) link.setAttribute('aria-current','page');
    });
    document.querySelector('.project-index')?.setAttribute('aria-label',text('Project series','Серии работ'));
    const groups = portfolio.groups[section.id] || [];
    if (hydrate) {
      document.querySelectorAll('.project-index a').forEach(link => {
        link.setAttribute('aria-current',link.hash === window.location.hash ? 'location' : 'false');
        if (link.getAttribute('aria-current') === 'false') link.removeAttribute('aria-current');
      });
      return;
    }
    const count = portfolio.items.filter(item => item.section === section.id).length;
    const stats = make('div','category-stats');
    stats.append(make('span','',`${String(count).padStart(2,'0')} ${text('selected images',ruFrames(count))}`),make('span','',text('Original references included in every series','Исходные фотографии в каждой серии')));
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
      header.append(make('span','',String(index + 1).padStart(2,'0')),make('h2','',label(group)),make('small','group-count',`${String(group.ids.length).padStart(2,'0')} ${text(group.ids.length === 1 ? 'image' : 'images',ruFrames(group.ids.length))}`));
      const grid = make('div','project-grid');
      group.ids.forEach((id,i) => {
        const item = itemById(id);
        if (!item) throw new Error(`Missing portfolio item: ${id}`);
        const layout = group.ids.length === 1 ? 'single' : i === 0 ? 'wide' : 'column';
        const priority = Boolean(window.__PORTFOLIO_ENTRY_PRIORITY__ === `series-${index + 1}` && i === 0);
        grid.append(createCard(item,priority,layout));
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
    const total = portfolio.items.length;
    document.querySelectorAll('[data-en][data-ru]').forEach(element => { element.innerHTML = element.dataset[language].replace(/\{count\}\s*кадр(?:а|ов)?/,`${total} ${ruFrames(total)}`).replace('{count}',total); });
    document.querySelectorAll('[data-label-en][data-label-ru]').forEach(element => { element.setAttribute('aria-label',element.dataset[`label${language === 'ru' ? 'Ru' : 'En'}`]); });
    document.querySelectorAll('[data-alt-en][data-alt-ru]').forEach(element => { element.alt = element.dataset[`alt${language === 'ru' ? 'Ru' : 'En'}`]; });
    switchButton.textContent = language === 'ru' ? 'EN' : 'RU';
    switchButton.setAttribute('aria-label',text('Переключить на русский','Switch to English'));
    document.querySelector('.skip').textContent = text('Skip to work','Перейти к работам');
    document.querySelector('.brand').setAttribute('aria-label',text('Mikhail — home','Михаил — главная'));
    document.querySelector('.desktop-nav').setAttribute('aria-label',text('Portfolio sections','Разделы портфолио'));
    document.querySelector('.mobile-sections').setAttribute('aria-label',text('Portfolio sections','Разделы портфолио'));
    document.getElementById('worldSelector')?.setAttribute('aria-label',text('Explore four visual worlds','Четыре визуальных мира'));
    document.getElementById('dialogClose').setAttribute('aria-label',text('Close image viewer','Закрыть просмотр'));
    if (page === 'home') {
      gallery.replaceChildren();
      renderHome();
    }
    else {
      const section = portfolio.sections.find(value => value.id === page);
      if (!section) throw new Error(`Unknown portfolio page: ${page}`);
      renderCategory(section,gallery.dataset.staticCategory === 'true');
    }
    document.dispatchEvent(new CustomEvent('portfolio:render'));
    document.dispatchEvent(new CustomEvent('portfolio:language',{detail:{language}}));
  }
  function openDetail(item,trigger,view) {
    activeItem = item;
    if (trigger) returnFocus = trigger;
    if (view) detailView = view;
    const seriesId = trigger?.dataset.seriesId || seriesFor(item.id);
    track('image_open',{sector:item.section,series_id:seriesId,item_id:item.id,view_mode:detailView});
    if (detailView === 'compare') track('reference_compare',{sector:item.section,series_id:seriesId,item_id:item.id,view_mode:detailView});
    const section = portfolio.sections.find(value => value.id === item.section);
    const sourceLabel = item.referenceKind === 'model' ? text('Original model','Исходная модель') : text('Original product','Исходный товар');
    const resultLabel = item.motion ? text('Final loop','Итоговый ролик') : text('Final image','Итоговый кадр');
    dialogContent.querySelectorAll('video').forEach(video => video.pause());
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
      const image = make(item.motion && path === resultPath(item.id) ? 'video' : 'img');
      if (image.tagName === 'VIDEO') {
        image.controls = true; image.loop = true; image.muted = true; image.playsInline = true;
        image.preload = 'none'; image.poster = path; image.src = item.motion.mp4;
        image.setAttribute('aria-label',`${caption}: ${label(item)}`);
        const size = window.IMAGE_SIZES[item.id];
        if (size) [image.width,image.height] = size;
      } else { image.src = path; image.alt = `${caption}: ${label(item)}`; }
      const figcaption = make('figcaption','',caption);
      figure.append(figcaption,image);
      pair.append(figure);
    });
    const views = make('div','detail-view-tabs');
    let originalLink;
    const updateFullImageLink = () => {
      originalLink.href = detailView === 'source' ? originalSourcePath(item.source) : item.motion?.mp4 || item.original || resultPath(item.id);
      originalLink.textContent = detailView === 'source' ? text('Open original reference ↗','Открыть исходную фотографию ↗') : item.motion ? text('Open full video ↗','Открыть ролик целиком ↗') : text('Open full image ↗','Открыть изображение целиком ↗');
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
        if (mode === 'source') pair.querySelectorAll('video').forEach(video => video.pause());
        views.querySelectorAll('button').forEach(tab => tab.setAttribute('aria-pressed',String(tab === button)));
        updateFullImageLink();
        if (mode === 'compare') track('reference_compare',{sector:item.section,series_id:seriesId,item_id:item.id,view_mode:mode});
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
    const contact = make('a','viewer-contact',text('Discuss an image like this ↗','Обсудить похожие изображения ↗'));
    contact.href = `contact.html?item=${encodeURIComponent(item.id)}`;
    contact.dataset.contactPosition = 'viewer';
    contact.dataset.ctaPosition = 'viewer';
    contact.dataset.contactLink = '';
    contact.dataset.itemId = item.id;
    tools.append(contact);
    if (item.motion) {
      const gif = make('a','original-link',text('Download GIF ↗','Скачать GIF ↗'));
      gif.href = item.motion.gif; gif.download = `${item.id}.gif`;
      tools.append(gif);
    }
    inner.append(top,pair,tools);
    dialogContent.append(inner);
    if (!dialog.open) dialog.showModal();
    dialog.scrollTop = 0;
    document.body.classList.add('dialog-open');
  }
  gallery.addEventListener('click',event => {
    const link = event.target.closest('a[data-item-id],a[data-reference-item]');
    if (!link || !gallery.contains(link) || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const item = itemById(link.dataset.itemId || link.dataset.referenceItem);
    if (!item) return;
    event.preventDefault();
    const mode = !link.dataset.viewMode || link.dataset.viewMode === 'auto' ? (window.matchMedia('(max-width:560px)').matches ? 'result' : 'compare') : link.dataset.viewMode;
    openDetail(item,link,mode);
  });
  gallery.addEventListener('click',event => {
    const link = event.target.closest('.project-index a[href^="#series-"]');
    if (!link) return;
    gallery.querySelectorAll('.project-index a[aria-current="location"]').forEach(active => active.removeAttribute('aria-current'));
    link.setAttribute('aria-current','location');
  });
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
    dialogContent.querySelectorAll('video').forEach(video => video.pause());
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
