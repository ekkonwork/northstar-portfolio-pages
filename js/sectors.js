/**
 * ==========================================================================
 * NORTHSTAR SECTORS ENGINE — 4 COMMERCIAL CATEGORIES (REFINED EDITION)
 * ==========================================================================
 * - Uncropped photography (contain mode with dynamic aspect ratio)
 * - Zero cartoon icons: sleek typographic monogram badges
 * - Deep linking (#vton, #food, #jewelry, #furniture) with branded intro
 * - Responsive interactive Before/After comparison sliders
 * - Adaptive ambient particles
 * ==========================================================================
 */

(() => {
  'use strict';

  // Sector Configuration mapping to Mikhail's real WORKS database
  const SECTOR_CONFIG = {
    vton: {
      id: 'vton',
      slugs: ['vton', 'virtual-try-on', 'try-on', 'fashion'],
      code: '01 · VTON',
      title: { en: 'Virtual Try On', ru: 'Virtual Try On' },
      subtitle: { en: 'Digital Fitting & Commercial Fashion Lookbooks', ru: 'Цифровая примерка и коммерческие лукбуки' },
      badge: { en: 'Fashion Tech', ru: 'Fashion Tech' },
      themeClass: 'theme-vton',
      accent: '#C2A68D',
      heroImage: 'assets/hero/vton_hero.jpg',
      tagline: {
        en: 'Photorealistic garment and accessory fitting for e-commerce and luxury fashion brands without studio shoots.',
        ru: 'Фотореалистичная виртуальная примерка одежды и аксессуаров для брендов и маркетплейсов без студийных съёмок.'
      },
      stats: [
        { v: '100%', l: { en: 'Cut & Pose Fidelity', ru: 'Сохранение кроя и позы' } },
        { v: '≈63s', l: { en: 'Complete Garment Pass', ru: 'Полный рендер образа' } },
        { v: '4K', l: { en: 'Master Output', ru: 'Финальное разрешение' } },
        { v: '-75%', l: { en: 'Shooting Cost Saved', ru: 'Экономия на съёмках' } }
      ],
      capabilities: [
        { en: 'Garment transfer across varied poses and camera angles', ru: 'Перенос одежды на разные позы и ракурсы камеры' },
        { en: 'Multi-model diversity: 1 SKU across demographic types', ru: 'Один артикул на моделях разного типажа и комплекции' },
        { en: 'Complex textiles: wool, ripstop nylon, pleated silk, denim', ru: 'Сложные ткани: шерсть, рипстоп, плиссированный шёлк, деним' },
        { en: 'E-commerce lookbooks & vertical social reels (9:16)', ru: 'Каталожные пакшоты и вертикальные reels для соцсетей (9:16)' }
      ],
      ctaTitle: { en: 'Ready to launch Virtual Try-On for your brand?', ru: 'Готовы запустить Virtual Try-On для вашего бренда?' },
      ctaDesc: {
        en: 'Discuss your SKU catalog, model casting and delivery formats directly with Mikhail.',
        ru: 'Обсудите каталог ваших артикулов, типажи моделей и форматы сдачи напрямую с Михаилом.'
      },
      workIds: ['fashion-transfer', 'fashion-campaigns', 'green-jacket-series']
    },

    food: {
      id: 'food',
      slugs: ['food', 'food-design', 'culinary', 'beverage'],
      code: '02 · FOOD',
      title: { en: 'Food Design', ru: 'Food Design' },
      subtitle: { en: 'Sensory Gastronomy & High-Speed Commercial CGI', ru: 'Аппетитная фуд-реклама и коммерческий CGI' },
      badge: { en: 'Commercial Food VFX', ru: 'Commercial Food VFX' },
      themeClass: 'theme-food',
      accent: '#F59E0B',
      heroImage: 'assets/hero/food_hero.jpg',
      tagline: {
        en: 'Dynamic culinary commercials: high-speed splashes, levitating ingredients, steam and macro textures.',
        ru: 'Сочная фуд-реклама кинематографичного уровня: левитирующие ингредиенты, брызги 1000fps, пар и макросъёмка.'
      },
      stats: [
        { v: '4 Dishes', l: { en: 'Unified Menu World', ru: 'Единая концепция меню' } },
        { v: 'Fixed CAM', l: { en: 'Stable Tableware & Light', ru: 'Стабильный свет и посуда' } },
        { v: '1000fps', l: { en: 'Slow-Mo Dynamic Feel', ru: 'Эффект замедления' } },
        { v: 'Ultra-HD', l: { en: 'PBR Food Textures', ru: 'Гиперреалистичные текстуры' } }
      ],
      capabilities: [
        { en: 'Full menu campaigns with locked tableware and lighting', ru: 'Серия блюд для ресторанного меню со стабильной посудой' },
        { en: 'Phone photo to high-end commercial cafe packshot', ru: 'Из обычного фото на телефон в дорогой рекламный кадр' },
        { en: 'Liquid splashes, condensation, steam and caramel viscosity', ru: 'Брызги, конденсат на стекле, пар и вязкость соусов' },
        { en: 'Graphic delivery assets and packaging key visuals', ru: 'Графические сеты для доставки и пакшоты упаковки' }
      ],
      ctaTitle: { en: 'Ready to launch a sensory Food Campaign?', ru: 'Готовы запустить аппетитную фуд-кампанию?' },
      ctaDesc: {
        en: 'Deliver mouth-watering food and beverage campaigns without studio spills or expensive culinary stylists.',
        ru: 'Создайте сочную рекламу еды и напитков без аренды павильона и дорогостоящих фуд-стилистов.'
      },
      workIds: ['hospitality', 'cobalt-cup']
    },

    jewelry: {
      id: 'jewelry',
      slugs: ['jewelry', 'jewelry-watch', 'watch', 'watches', 'luxury'],
      code: '03 · WATCHES',
      title: { en: 'Jewelry & Watch', ru: 'Jewelry & Watch' },
      subtitle: { en: 'Haute Horlogerie & High Jewelry Micro-CGI', ru: 'Высокое часовое искусство и ювелирный CGI' },
      badge: { en: 'Haute Horlogerie', ru: 'Haute Horlogerie' },
      themeClass: 'theme-jewelry',
      accent: '#D4AF37',
      heroImage: 'assets/hero/jewelry_hero.jpg',
      tagline: {
        en: 'Absolute precision on micro-facets, diamond fire, 18K metals and Swiss tourbillon choreographies.',
        ru: 'Абсолютная точность граней, блеск бриллиантов, золото 18K и кинематографичная хореография часовых механизмов.'
      },
      stats: [
        { v: '100%', l: { en: 'Watch Reference Fidelity', ru: 'Точность циферблата и деталей' } },
        { v: 'Submicron', l: { en: 'Macro Facet Sharpness', ru: 'Микро-фокус на гранях' } },
        { v: '18k Gold', l: { en: 'Photorealistic Metals', ru: 'Рендер металлов и камней' } },
        { v: 'Geneva', l: { en: 'Luxury Presentation', ru: 'Швейцарский уровень' } }
      ],
      capabilities: [
        { en: 'Strict watch dial, bezel, and chrono subdial consistency', ru: 'Строгое сохранение циферблата, безеля и стрелок' },
        { en: 'Prismatic diamond dispersion and caustic reflections', ru: 'Призматическая дисперсия бриллиантов и отражения' },
        { en: 'Commercial macro still from low-fidelity phone source', ru: 'Коммерческий макро-кадр из простого фото на телефон' },
        { en: 'Controlled studio light on brushed & mirror-polished metals', ru: 'Контролируемый свет на матовом и зеркальном металле' }
      ],
      ctaTitle: { en: 'Need luxury presentation for fine timepieces or jewelry?', ru: 'Нужна премиальная подача для украшений или часов?' },
      ctaDesc: {
        en: 'Protect brand identity with flawless product preservation and exquisite Swiss horology finish.',
        ru: 'Подчеркните статус изделий безупречной точностью брендовых элементов и швейцарским уровнем детализации.'
      },
      workIds: ['product-fidelity', 'watch-ring']
    },

    furniture: {
      id: 'furniture',
      slugs: ['furniture', 'furniture-interior', 'interior', 'interiors', 'spaces'],
      code: '04 · INTERIORS',
      title: { en: 'Furniture & Interior', ru: 'Furniture & Interior' },
      subtitle: { en: 'Tactile Materials & Architectural Staging', ru: 'Тактильные материалы и архитектурная подача' },
      badge: { en: 'Tactile Architecture', ru: 'Tactile Architecture' },
      themeClass: 'theme-furniture',
      accent: '#C89D7C',
      heroImage: 'assets/hero/furniture_hero.jpg',
      tagline: {
        en: 'Sculptural designer furniture, tactile textiles and natural architectural daylight in Japandi/Bauhaus spaces.',
        ru: 'Скульптурная мебель, тактильные текстуры ткани, дерева и травертина в естественном утреннем свете.'
      },
      stats: [
        { v: '100%', l: { en: 'Product Geometry Locked', ru: 'Геометрия и пропорции 1:1' } },
        { v: 'Multi-Space', l: { en: 'Penthouse & Gallery', ru: 'Разные интерьерные сцены' } },
        { v: 'Day→Dusk', l: { en: 'Architectural Lighting', ru: 'Сценарии естественного света' } },
        { v: '8K PBR', l: { en: 'Tactile Bouclé & Wood', ru: 'Текстуры букле и ореха' } }
      ],
      capabilities: [
        { en: '1 piece of furniture across diverse architectural environments', ru: 'Один предмет мебели в разных архитектурных стилях' },
        { en: 'Virtual staging and decluttering for architectural real estate', ru: 'Виртуальная меблировка и расхламление помещений' },
        { en: 'Day to dusk transition for exterior and interior listings', ru: 'Переход из дневного света в сумеречный интерьер' },
        { en: 'High fidelity to phone reference: armrest cutouts, tags, seams', ru: 'Точность к референсу: вырезы подлокотников, швы, ярлыки' }
      ],
      ctaTitle: { en: 'Visualize a new furniture line or interior collection?', ru: 'Хотите визуализировать коллекцию мебели или интерьер?' },
      ctaDesc: {
        en: 'Bring your catalog to life with architectural spaces, daylight angles, and realistic tactile materials.',
        ru: 'Оживите каталог мебели живыми пространствами, дневным светом и реалистичными тактильными материалами.'
      },
      workIds: ['furniture', 'walnut-chair', 'property']
    }
  };

  let currentSector = null;
  let isTransitioning = false;

  const L = (val) => {
    if (!val) return '';
    if (typeof val === 'string') return val;
    const lang = (window.NS && window.NS.lang) ? window.NS.lang() : (document.documentElement.lang || 'ru');
    return val[lang] || val.en || val.ru || '';
  };

  function resolveSector(hash) {
    if (!hash || hash === '#' || hash === '#hub' || hash === '#all') return null;
    const clean = hash.replace(/^#/, '').toLowerCase().trim();
    for (const key in SECTOR_CONFIG) {
      const sec = SECTOR_CONFIG[key];
      if (sec.id === clean || sec.slugs.includes(clean)) return sec;
    }
    return null;
  }

  // ==========================================================================
  // TRANSITION CONTROLLER (Curtain Wipe & Branded Intro)
  // ==========================================================================
  function playTransition(targetSector, onMidpoint, onDone) {
    isTransitioning = true;
    const overlay = document.getElementById('sectorTransition');
    const curtain = document.getElementById('transCurtain');
    const modal = document.getElementById('transModal');
    const kicker = document.getElementById('transKicker');
    const title = document.getElementById('transTitle');
    const bar = document.getElementById('transBarInner');

    if (targetSector) {
      if (kicker) kicker.textContent = `[ ${targetSector.code} · DIRECT ENTRY ]`;
      if (title) title.textContent = L(targetSector.title);
      overlay.style.setProperty('--trans-accent', targetSector.accent);
    } else {
      if (kicker) kicker.textContent = '[ SECTORS OVERVIEW ]';
      if (title) title.textContent = 'PORTFOLIO';
      overlay.style.setProperty('--trans-accent', '#FFFFFF');
    }

    overlay.classList.add('is-active');
    overlay.style.opacity = '1';
    curtain.style.transition = 'transform 0.4s cubic-bezier(0.77, 0, 0.175, 1)';
    curtain.style.transform = 'translateY(0%)';

    setTimeout(() => {
      modal.style.transition = 'opacity 0.3s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
      modal.style.opacity = '1';
      modal.style.transform = 'scale(1)';
      bar.style.transition = 'width 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
      bar.style.width = '100%';
    }, 120);

    setTimeout(() => {
      if (onMidpoint) onMidpoint();
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 450);

    setTimeout(() => {
      modal.style.opacity = '0';
      modal.style.transform = 'scale(1.04)';
      curtain.style.transform = 'translateY(-100%)';

      setTimeout(() => {
        curtain.style.transition = 'none';
        curtain.style.transform = 'translateY(100%)';
        overlay.classList.remove('is-active');
        overlay.style.opacity = '0';
        bar.style.width = '0%';
        isTransitioning = false;
        if (onDone) onDone();
      }, 350);
    }, 850);
  }

  // ==========================================================================
  // RENDER DEDICATED SECTOR VIEW
  // ==========================================================================
  function showSector(sector, isInitial) {
    const render = () => {
      currentSector = sector;

      // Update body theme
      document.body.className = '';
      document.body.classList.add(sector.themeClass);

      // DOM Views
      const hub = document.getElementById('hubSection');
      const sec = document.getElementById('sectorSection');
      if (hub) hub.classList.add('hidden');
      if (sec) sec.classList.add('visible');

      // Update Top Nav Pills
      updatePills(sector.id);

      // Render Hero Elements
      const heroArt = document.getElementById('secHeroArt');
      const kicker = document.getElementById('secKicker');
      const headline = document.getElementById('secHeadline');
      const strapline = document.getElementById('secStrapline');
      const para = document.getElementById('secParagraph');
      const primaryBtn = document.getElementById('secPrimaryBtn');

      if (heroArt) heroArt.style.backgroundImage = `url('${sector.heroImage}')`;
      if (kicker) kicker.innerHTML = `<span>●</span> ${sector.code} · ${L(sector.badge)}`;
      if (headline) headline.textContent = L(sector.title);
      if (strapline) strapline.textContent = L(sector.subtitle);
      if (para) para.textContent = L(sector.tagline);
      if (primaryBtn) primaryBtn.textContent = (document.documentElement.lang === 'ru' ? 'Обсудить проект' : 'Start project') + ' →';

      // Render Hero Right Card
      const cardTitle = document.getElementById('secCardTitle');
      const cardBadge = document.getElementById('secCardBadge') || document.getElementById('secCardSub');
      const statsQuad = document.getElementById('secStatsQuad');
      const capsList = document.getElementById('secCapsList');

      if (cardTitle) cardTitle.textContent = L(sector.title);
      if (cardBadge) cardBadge.textContent = sector.code;

      if (statsQuad) {
        statsQuad.innerHTML = sector.stats.map(s => `
          <div class="sec-stat-box">
            <span class="sec-stat-value">${s.v}</span>
            <span class="sec-stat-label">${L(s.l)}</span>
          </div>
        `).join('');
      }

      if (capsList) {
        capsList.innerHTML = sector.capabilities.map(c => `
          <li class="sec-cap-item">
            <span class="sec-cap-dot"></span>
            <span>${L(c)}</span>
          </li>
        `).join('');
      }

      // Render Sector's Real Projects from WORKS (NO CROPPING)
      renderProjects(sector);

      // Render Footer CTA
      const footerTitle = document.getElementById('secFooterTitle');
      const footerDesc = document.getElementById('secFooterDesc');
      if (footerTitle) footerTitle.textContent = L(sector.ctaTitle);
      if (footerDesc) footerDesc.textContent = L(sector.ctaDesc);

      // Render Other Sectors Bar
      renderOtherSectorsLinks(sector.id);

      // Update Canvas mode
      setAmbientCanvasMode(sector.id);

      // Update Page Title
      document.title = `${L(sector.title)} | Mikhail — GenAI Portfolio`;
    };

    if (isInitial) {
      playTransition(sector, render);
    } else {
      playTransition(sector, render);
    }
  }

  // ==========================================================================
  // RENDER REAL PROJECTS (UNCROPPED MEDIA & ACCURATE COMPARISON SLIDERS)
  // ==========================================================================
  function renderProjects(sector) {
    const grid = document.getElementById('secProjectsGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const allWorks = window.WORKS || (window.NS ? window.NS.work : []);
    const matchingWorks = sector.workIds.map(id => allWorks.find(w => w.id === id)).filter(Boolean);

    matchingWorks.forEach(work => {
      const card = document.createElement('article');
      card.className = 'sec-work-card';

      // Check if project has compare data for interactive slider
      if (work.compare && work.compare.length > 0 && window.NS && window.NS.compare) {
        const cmpBlock = window.NS.compare(work.compare[0]);
        cmpBlock.querySelectorAll('img').forEach(img => {
          img.loading = 'eager';
          img.decoding = 'sync';
        });
        cmpBlock.classList.add('sec-work-compare');
        card.appendChild(cmpBlock);
      } else {
        const visual = document.createElement('div');
        visual.className = 'sec-card-visual';
        visual.innerHTML = `
          <div class="sec-card-top-tags">
            <span class="sec-badge-tag">${L(sector.badge)}</span>
            <span class="sec-badge-idx">${work.index || '01'}</span>
          </div>
          <img class="sec-card-img" src="${work.cover}" alt="${L(work.coverAlt) || L(work.title)}" loading="lazy">
        `;
        card.appendChild(visual);
      }

      const body = document.createElement('div');
      body.className = 'sec-card-body';
      body.innerHTML = `
        <div class="sec-card-meta-line">
          <span class="sec-client-brand">${work.meta && work.meta[0] ? L(work.meta[0].v) : 'Commercial Spec'}</span>
          <span>${work.year || '2026'}</span>
        </div>
        <h3 class="sec-item-title">${L(work.title)}</h3>
        <p class="sec-item-summary">${L(work.summary) || L(work.tagline)}</p>
        <div class="sec-item-chips">
          ${(work.tags || []).map(t => `<span class="sec-chip">#${t}</span>`).join('')}
        </div>
        <div class="sec-card-actions">
          <a class="sec-case-link" href="case.html?case=${encodeURIComponent(work.id)}">
            <span>${document.documentElement.lang === 'ru' ? 'Смотреть полный кейс' : 'View full case study'}</span>
            <span>→</span>
          </a>
          <span style="font-family: var(--mono); font-size: 0.68rem; color: var(--muted); letter-spacing: 0.08em;">
            ${work.metrics && work.metrics[0] ? work.metrics[0].v : '4K Prores'}
          </span>
        </div>
      `;
      card.appendChild(body);
      grid.appendChild(card);
    });
  }

  // ==========================================================================
  // RENDER MAIN HUB VIEW
  // ==========================================================================
  function showHub(isInitial) {
    const render = () => {
      currentSector = null;
      document.body.className = '';
      document.body.classList.add('mode-hub');

      const hub = document.getElementById('hubSection');
      const sec = document.getElementById('sectorSection');
      if (sec) sec.classList.remove('visible');
      if (hub) hub.classList.remove('hidden');

      updatePills(null);
      setAmbientCanvasMode('hub');
      document.title = (document.documentElement.lang === 'ru' ? 'Михаил' : 'Mikhail') + ' — AI Video & CGI Director Portfolio';

      // Check query param for simulating hover state in screenshots/demo
      const urlParams = new URLSearchParams(window.location.search);
      const hoverSec = urlParams.get('hover');
      if (hoverSec) {
        const panel = document.querySelector(`.slash-panel[data-sec="${hoverSec}"]`);
        if (panel) {
          panel.classList.add('is-active-hover');
          panel.closest('.slash-track')?.classList.add('has-hovered');
        }
      }
    };

    if (isInitial) {
      render();
    } else {
      playTransition(null, render);
    }
  }

  // ==========================================================================
  // TOP NAV PILLS & LINKING
  // ==========================================================================
  function initNav() {
    const container = document.getElementById('navSectorPills');
    if (!container) return;
    container.innerHTML = '';

    for (const key in SECTOR_CONFIG) {
      const sec = SECTOR_CONFIG[key];
      const a = document.createElement('a');
      a.href = `#${sec.id}`;
      a.className = 'nav-sector-pill';
      a.dataset.secId = sec.id;
      a.textContent = L(sec.title);
      a.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.hash = `#${sec.id}`;
      });
      container.appendChild(a);
    }

    const hubTrigger = document.getElementById('navHubTrigger');
    if (hubTrigger) {
      hubTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.hash = '#hub';
      });
    }

    // Monolithic Slash Panels Click & Hover Interactions
    document.querySelectorAll('.slash-panel, .pillar-card').forEach(panel => {
      panel.addEventListener('click', () => {
        const secId = panel.dataset.sec;
        window.location.hash = `#${secId}`;
      });
      panel.addEventListener('mouseenter', () => {
        const track = panel.closest('.slash-track');
        if (track) track.classList.add('has-hovered');
      });
      panel.addEventListener('mouseleave', () => {
        const track = panel.closest('.slash-track');
        if (track) track.classList.remove('has-hovered');
      });
    });

    // Share Button
    const shareBtn = document.getElementById('secShareBtn');
    if (shareBtn) {
      shareBtn.addEventListener('click', copyDirectLink);
    }

    // Hero Primary CTA Scrolls to footer contacts
    const primaryBtn = document.getElementById('secPrimaryBtn');
    if (primaryBtn) {
      primaryBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const footer = document.getElementById('secFooterBanner');
        if (footer) footer.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }

  function updatePills(activeId) {
    document.querySelectorAll('.nav-sector-pill').forEach(pill => {
      if (pill.dataset.secId === activeId) pill.classList.add('active');
      else pill.classList.remove('active');
    });
  }

  function renderOtherSectorsLinks(currentId) {
    const container = document.getElementById('secOtherLinks');
    if (!container) return;
    container.innerHTML = '';

    for (const key in SECTOR_CONFIG) {
      const sec = SECTOR_CONFIG[key];
      if (sec.id === currentId) continue;
      const link = document.createElement('a');
      link.href = `#${sec.id}`;
      link.className = 'sec-other-link';
      link.innerHTML = `
        <span>${sec.code}</span>
        <span>${L(sec.title)}</span>
        <span aria-hidden="true">→</span>
      `;
      link.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.hash = `#${sec.id}`;
      });
      container.appendChild(link);
    }
  }

  // ==========================================================================
  // SHARE DEEP LINK & TOAST
  // ==========================================================================
  function copyDirectLink() {
    if (!currentSector) return;
    const url = `${window.location.origin}${window.location.pathname}#${currentSector.id}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        showToast(document.documentElement.lang === 'ru'
          ? `Прямая ссылка на раздел «${L(currentSector.title)}» скопирована!`
          : `Direct link to "${L(currentSector.title)}" copied!`);
      }).catch(() => {
        prompt('Copy direct link for client:', url);
      });
    } else {
      prompt('Copy direct link for client:', url);
    }
  }

  function showToast(text) {
    const toast = document.getElementById('sectorToast');
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add('is-shown');
    setTimeout(() => {
      toast.classList.remove('is-shown');
    }, 2800);
  }

  // ==========================================================================
  // ROUTE HANDLER
  // ==========================================================================
  function handleRoute(isInitial = false) {
    const targetSector = resolveSector(window.location.hash);
    if (targetSector) {
      if (currentSector?.id !== targetSector.id) {
        showSector(targetSector, isInitial);
      }
    } else {
      showHub(isInitial);
    }
  }

  window.addEventListener('hashchange', () => handleRoute(false));
  document.addEventListener('northstar:lang', () => {
    if (currentSector) showSector(currentSector, false);
    else showHub(false);
  });

  // ==========================================================================
  // ADAPTIVE AMBIENT CANVAS (Luxury Subdued Physics)
  // ==========================================================================
  let canvasMode = 'hub';
  let canvas, ctx, width, height;
  let particles = [];

  function initAmbientCanvas() {
    canvas = document.getElementById('ambientCanvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    drawAmbient();
  }

  function resizeCanvas() {
    if (!canvas) return;
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticles();
  }

  function setAmbientCanvasMode(mode) {
    canvasMode = mode;
    initParticles();
  }

  function initParticles() {
    particles = [];
    const count = 35;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: canvasMode === 'food' ? -(Math.random() * 0.5 + 0.1) : (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.15,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        angle: Math.random() * Math.PI * 2
      });
    }
  }

  function drawAmbient() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    if (canvasMode === 'hub') {
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = width; if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height; if (p.y > height) p.y = 0;
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.3})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
    } else if (canvasMode === 'vton') {
      particles.forEach(p => {
        p.x += p.vx * 0.6; p.y += p.vy * 0.6;
        if (p.x < 0) p.x = width; if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height; if (p.y > height) p.y = 0;
        ctx.fillStyle = `rgba(194, 166, 141, ${p.alpha * 0.4})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.9, 0, Math.PI * 2);
        ctx.fill();
      });
    } else if (canvasMode === 'food') {
      particles.forEach(p => {
        p.x += Math.sin(p.angle) * 0.3; p.y += p.vy; p.angle += 0.02;
        if (p.y < 0) { p.y = height + 10; p.x = Math.random() * width; }
        ctx.fillStyle = `rgba(245, 158, 11, ${p.alpha * 0.45})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 1.1, 0, Math.PI * 2);
        ctx.fill();
      });
    } else if (canvasMode === 'jewelry') {
      particles.forEach(p => {
        p.angle += p.twinkleSpeed;
        const currentAlpha = (Math.sin(p.angle) * 0.5 + 0.5) * p.alpha;
        const s = p.size * 1.4;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.fillStyle = `rgba(212, 175, 55, ${currentAlpha * 0.7})`;
        ctx.beginPath();
        ctx.moveTo(0, -s * 2);
        ctx.quadraticCurveTo(0, 0, s * 2, 0);
        ctx.quadraticCurveTo(0, 0, 0, s * 2);
        ctx.quadraticCurveTo(0, 0, -s * 2, 0);
        ctx.quadraticCurveTo(0, 0, 0, -s * 2);
        ctx.fill();
        ctx.restore();
      });
    } else if (canvasMode === 'furniture') {
      particles.forEach(p => {
        p.x += p.vx * 0.5; p.y += p.vy * 0.5;
        if (p.x < 0) p.x = width; if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height; if (p.y > height) p.y = 0;
        ctx.fillStyle = `rgba(200, 157, 124, ${p.alpha * 0.3})`;
        ctx.fillRect(p.x, p.y, p.size * 0.9, p.size * 0.9);
      });
    }

    requestAnimationFrame(drawAmbient);
  }

  // Boot
  document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initAmbientCanvas();
    handleRoute(true);
  });
})();
