const dialog = document.querySelector('.lightbox');
const dialogImage = dialog.querySelector('img');
const closeButton = dialog.querySelector('.lightbox-close');

const translations = {
  ru: {
    navWork: 'Работы', navProduction: 'Производство', navContact: 'Контакты', fidelitySection: 'ИДЕНТИЧНОСТЬ И ТОЧНОСТЬ ПРОДУКТА',
    acceptedFinals: 'принятых финальных кадров', imageSystems: 'коммерческих визуальных систем', fidelityRenders: 'рендеров с сохранением идентичности', privateProduction: 'локального производства',
    heroEyebrow: 'GENERATIVE AI PRODUCTION · 3 ГОДА',
    heroTitle: 'Коммерческие изображения.<br><em>Стабильные от кадра к кадру.</em>',
    heroLede: '3 года в Generative AI: фриланс, виртуальная примерка и коммерческие production-задачи.',
    heroLink: 'Смотреть избранные кейсы',
    heroNote: 'Опыт работы с кластером NVIDIA H20<br>Production в ComfyUI',
    experienceYears: 'Generative AI production',
    clusterExperience: 'кластер стартапа виртуальной примерки',
    specSystems: 'синтетических коммерческих кейсов',
    workflowDesign: 'workflow-дизайн + production',
    selectedEyebrow: 'ИЗБРАННЫЕ КЕЙСЫ',
    selectedTitle: 'Синтетические по происхождению.<br>Построены вокруг реальных ограничений.',
    selectedBody: 'Все работы ниже - самостоятельные synthetic spec-кейсы. Каждый проверяет реальную production-задачу: точность, повторяемость, арт-дирекцию или контролируемое преобразование.',
    profileEyebrow: 'О МИХАИЛЕ',
    profileTitle: 'От single-GPU workflow до production-кластера из 8× H20.',
    profileBody: 'Три года работаю с Generative AI: на фрилансе и в стартапе виртуальной примерки, где строил production-workflow в ComfyUI на кластере из 8× NVIDIA H20. Мой фокус: контролируемая генерация, идентичность, точность продукта, повторяемые серии и практичная передача результата.',
    profileFactOneTitle: '3 года',
    profileFactOneBody: 'Generative AI production',
    profileFactTwoTitle: 'Фриланс + стартап',
    profileFactTwoBody: 'коммерческие и продуктовые workflow',
    profileFactThreeTitle: 'ComfyUI',
    profileFactThreeBody: 'workflow-дизайн, генерация и отбор',
    brandDisclaimer: 'Независимый презентационный spec-кейс. Названия брендов и продуктовые референсы показаны только для демонстрации. Работа не заказана и не одобрена Rolex или Cartier, аффилиации с брендами нет.',
    privateEyebrow: 'PRODUCTION WORKFLOW',
    privateTitle: 'Спроектировано для повторяемого production.<br>Проверено локально.',
    metricNote: 'Замерено на одной RTX 5090 после запуска. Время отражает только машинную обработку и не включает арт-дирекцию, итерации и ручной отбор.',
    localAdvantages: 'Также у меня есть production-опыт в стартапе виртуальной примерки на кластере из 8× NVIDIA H20, где я строил ComfyUI-workflow для повторяемой генерации и контролируемого переноса продукта.',
    selectedMasters: 'Отобранные мастер-файлы',
    selectedMastersBody: 'Каждый финал имеет разрешение Full HD или выше и проходит ручной отбор перед презентацией.',
    storyResolution: '<b>до 4K</b> финальное разрешение зависит от исходных материалов', localProduction: '<b>100%</b> локальное производство',
    deliveryEyebrow: 'ФОРМАТ ПОСТАВКИ',
    deliveryTitle: 'Готово к production-передаче.',
    contactEyebrow: 'АГЕНТСТВА · ФРИЛАНС · WHITE-LABEL',
    contactTitle: 'Нужен контролируемый GenAI production?<br>Построим систему.',
    footerLine: 'Generative AI production · 2026'
  },
  en: {
    navWork: 'Work', navProduction: 'Production', navContact: 'Contact', fidelitySection: 'IDENTITY + PRODUCT FIDELITY',
    acceptedFinals: 'accepted production finals', imageSystems: 'commercial image systems', fidelityRenders: 'new fidelity renders', privateProduction: 'privately run production',
    heroEyebrow: 'GENERATIVE AI PRODUCTION · 3 YEARS',
    heroTitle: 'Commercial images.<br><em>Built to stay consistent.</em>',
    heroLede: '3 years building controlled GenAI image workflows for freelance, virtual try-on and commercial production.',
    heroLink: 'View selected case studies',
    heroNote: 'NVIDIA H20 cluster experience<br>ComfyUI production',
    experienceYears: 'Generative AI production',
    clusterExperience: 'virtual try-on startup cluster',
    specSystems: 'synthetic commercial case studies',
    workflowDesign: 'workflow design + production',
    selectedEyebrow: 'SELECTED CASE STUDIES',
    selectedTitle: 'Synthetic by design.<br>Built around real constraints.',
    selectedBody: 'All work below is self-initiated synthetic spec work. Each case isolates a real production problem: fidelity, repeatability, art direction or controlled transformation.',
    profileEyebrow: 'ABOUT MIKHAIL',
    profileTitle: 'From single-GPU workflows to an 8× H20 production cluster.',
    profileBody: 'I have spent three years working with Generative AI across freelance projects and a virtual try-on startup, where I built ComfyUI production workflows on an 8× NVIDIA H20 cluster. My focus is controlled image generation: identity, product fidelity, repeatable series and practical delivery.',
    profileFactOneTitle: '3 years',
    profileFactOneBody: 'Generative AI production',
    profileFactTwoTitle: 'Freelance + startup',
    profileFactTwoBody: 'commercial and product workflows',
    profileFactThreeTitle: 'ComfyUI',
    profileFactThreeBody: 'workflow design, generation and selection',
    brandDisclaimer: 'Independent spec study. Brand names and product references are shown for demonstration only. No affiliation, commission or endorsement by Rolex or Cartier is implied.',
    privateEyebrow: 'PRODUCTION WORKFLOW',
    privateTitle: 'Designed for repeatable production.<br>Tested locally.',
    metricNote: 'Measured on one dedicated RTX 5090 after startup. Timings describe machine processing only and exclude art direction, iteration and human selection.',
    localAdvantages: 'I also have production experience in a virtual try-on startup on an 8× NVIDIA H20 cluster, building ComfyUI workflows for repeatable image generation and controlled product transfer.',
    selectedMasters: 'Selected masters',
    selectedMastersBody: 'Every final is Full HD or larger and manually reviewed before presentation.',
    storyResolution: '<b>up to 4K</b> final resolution, source-dependent', localProduction: '<b>100%</b> local production',
    deliveryEyebrow: 'DELIVERY FORMAT',
    deliveryTitle: 'Built for production handoff.',
    contactEyebrow: 'AGENCY · FREELANCE · WHITE-LABEL',
    contactTitle: 'Need controlled GenAI production?<br>Let’s build the system.',
    footerLine: 'Generative AI production · 2026'
  }
};

function setLanguage(language) {
  document.documentElement.lang = language;
  document.title = language === 'ru' ? 'Михаил | Generative AI Production' : 'Mikhail | Generative AI Production';
  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = language === 'ru'
    ? 'Михаил, специалист по Generative AI production с 3 годами опыта во фрилансе и виртуальной примерке.'
    : 'Mikhail is a Generative AI production specialist with 3 years of experience across freelance work and virtual try-on.';
  translateVisibleText(language);
  document.querySelectorAll('[data-i18n]').forEach((node) => {
    const key = node.dataset.i18n;
    if (translations[language][key]) node.innerHTML = translations[language][key];
  });
  document.querySelectorAll('[data-lang]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.lang === language));
  });
  localStorage.setItem('northstar-language', language);
}

const originalTextNodes = [];
const ruRules = [
  ['Skip to work', 'Перейти к работам'], ['Language', 'Язык'], ['NORTHSTAR/STUDIO', 'TONOFA/STUDIO'], ['SELECTED SYSTEMS', 'ИЗБРАННЫЕ СИСТЕМЫ'],
  ['FASHION TRANSFER', 'ПЕРЕНОС ОДЕЖДЫ'], ['FASHION CAMPAIGNS', 'МОДНЫЕ КАМПАНИИ'], ['HOSPITALITY', 'РЕСТОРАННЫЕ КАМПАНИИ'],
  ['FURNITURE', 'МЕБЕЛЬ'], ['PROPERTY MEDIA', 'НЕДВИЖИМОСТЬ'], ['IDENTITY + PRODUCT FIDELITY', 'ИДЕНТИЧНОСТЬ И ТОЧНОСТЬ ПРОДУКТА'],
  ['SUPPLIED INPUTS', 'ПРЕДОСТАВЛЕННЫЕ ИСХОДНИКИ'], ['CONTROLLED OUTPUTS', 'КОНТРОЛИРУЕМЫЕ РЕЗУЛЬТАТЫ'], ['SIX EXPLICIT TRANSFERS', 'ШЕСТЬ ЯВНЫХ ПЕРЕНОСОВ'],
  ['GENERATED OUTPUT', 'СОЗДАННЫЙ РЕЗУЛЬТАТ'], ['GENERATED MENU OUTPUTS', 'СОЗДАННЫЕ БЛЮДА ДЛЯ МЕНЮ'], ['ALTERNATE DIRECTION', 'АЛЬТЕРНАТИВНОЕ НАПРАВЛЕНИЕ'],
  ['PRODUCT INPUT', 'ИСХОДНИК ПРОДУКТА'], ['ROOM INPUT', 'ИСХОДНИК ПОМЕЩЕНИЯ'], ['GENERATED SPATIAL OUTPUTS', 'СОЗДАННЫЕ ПРОСТРАНСТВЕННЫЕ СЦЕНЫ'],
  ['PRODUCT INVARIANTS', 'НЕИЗМЕННЫЕ СВОЙСТВА ПРОДУКТА'], ['VIRTUAL STAGING', 'ВИРТУАЛЬНАЯ МЕБЛИРОВКА'], ['DECLUTTER + REMOVE', 'УБОРКА И УДАЛЕНИЕ'],
  ['LISTING CAMPAIGN', 'КАМПАНИЯ ДЛЯ ОБЪЯВЛЕНИЯ'], ['LABELED VISUALIZATION', 'ВИЗУАЛИЗАЦИЯ С ПОМЕТКОЙ'], ['CHARACTER STORY', 'ИСТОРИЯ С ПЕРСОНАЖАМИ'],
  ['WATCHES + JEWELLERY', 'ЧАСЫ И ЮВЕЛИРНЫЕ ИЗДЕЛИЯ'], ['SELECTED FINAL', 'ВЫБРАННЫЙ ФИНАЛ'], ['Campaign still', 'Рекламный кадр'],
  ['Emerald campaign', 'Изумрудная кампания'], ['Jewellery campaign', 'Ювелирная кампания'], ['PRIVATE PRODUCTION', 'ЛОКАЛЬНОЕ ПРОИЗВОДСТВО'],
  ['DELIVERY FORMAT', 'ФОРМАТ ПОСТАВКИ'], ['Full-resolution PNG masters', 'PNG-мастера в полном разрешении'], ['Responsive web derivatives', 'Адаптированные версии для сайта'],
  ['Clear input / output comparisons', 'Понятные сравнения исходников и результатов'], ['Campaign-ready grouped exports', 'Сгруппированные материалы, готовые для кампании'],
  ['average inference', 'среднее время инференса'], ['final resolution', 'финальное разрешение'], ['local production', 'локальное производство'],
  ['manually accepted', 'принято вручную'], ['Accepted', 'Принято'], ['Inference', 'Время инференса'], ['Production', 'Производство'],
  ['Measured time', 'Время инференса'], ['Output', 'Результат'], ['Coverage', 'Охват'], ['Series', 'Серия'], ['Settings', 'Сценарии'], ['Rule', 'Правило'],
  ['INPUT', 'ИСХОДНИК'], ['OUTPUT', 'РЕЗУЛЬТАТ'], ['FINAL', 'ФИНАЛ'], ['Input', 'Исходник'], ['Output', 'Результат'],
  ['Child identity', 'Внешность ребёнка'], ['Mascot identity', 'Внешность маскота'], ['Trampoline', 'Батут'], ['Space museum', 'Космический музей'],
  ['Cobalt bistro', 'Кобальтовое бистро'], ['Red delivery campaign', 'Красная кампания доставки'], ['Cobalt chair', 'Кобальтовое кресло'],
  ['Cold penthouse', 'Холодный пентхаус'], ['Postmodern gallery', 'Постмодернистская галерея'], ['Scandinavian staging', 'Скандинавская меблировка'],
  ['Warm contemporary staging', 'Тёплая современная меблировка'], ['Clutter removed', 'Беспорядок убран'], ['Movable furniture removed', 'Подвижная мебель удалена'],
  ['Day-to-dusk listing image', 'Кадр объявления от дня к сумеркам'], ['Vertical social asset', 'Вертикальный материал для соцсетей'], ['Proposed renovation visualization', 'Визуализация предлагаемого ремонта'],
  ['Average Full HD render', 'Среднее время рендера Full HD'], ['Complete garment render', 'Полный рендер одежды'], ['Five-item batch', 'Пакет из пяти вещей'], ['Accepted masters', 'Принятые мастер-файлы'],
  ['Car doorway', 'Дверь автомобиля'], ['Architectural walk', 'Прогулка у современной архитектуры'], ['Glass atrium', 'Стеклянный атриум'], ['Private jet', 'Частный самолёт'], ['Cliff pool', 'Бассейн на утёсе'], ['Design district', 'Дизайнерский квартал'], ['Spiral museum', 'Спиральный музей'], ['Opera at blue hour', 'Оперный театр в синий час'], ['Yacht at sunset', 'Яхта на закате']
  ,['Two garments.', 'Две вещи.'], ['Three editorial worlds.', 'Три редакционных мира.'], ['Six garments.', 'Шесть вещей.'], ['Four narrative locations.', 'Четыре сюжетные локации.'], ['One set.', 'Один сет.'], ['A complete menu.', 'Полное меню.'], ['One chair.', 'Одно кресло.'], ['Two spatial identities.', 'Два пространственных образа.'], ['One listing.', 'Один объект.'], ['The complete launch kit.', 'Полный комплект для запуска.'],
  ['A cobalt ripstop jacket and a micro-houndstooth cardigan are transferred onto three real commercial poses. The person, setting and lower outfit remain stable.', 'Кобальтовая куртка из рипстопа и кардиган в мелкую «гусиную лапку» перенесены на три коммерческие позы. Человек, окружение и нижняя часть образа сохраняются.'],
  ['Swim, skirts, eveningwear and tailoring move into a cliff pool, yacht, spiral museum, opera house and private runway. The matrix tests real category changes across natural commercial poses.', 'Купальники, юбки, вечерние образы и костюмы переносятся в разные коммерческие сцены. Матрица показывает смену категорий на естественных позах.'],
  ['An empty cobalt bistro table becomes a four-dish menu series without changing its plate, lens, light, napkin or glass. A red set opens a second campaign direction.', 'Пустой кобальтовый столик бистро превращается в серию из четырёх блюд без изменения посуды, объектива, света, салфетки и бокала. Красный сет открывает второе направление кампании.'],
  ['A cobalt mohair chair moves between cold penthouse luxury and a warm postmodern gallery. Its shell, cushion, material and chrome frame remain recognizable.', 'Кобальтовое кресло из мохера переносится из холодной роскоши пентхауса в тёплую постмодернистскую галерею. Его корпус, подушка, материал и хромированный каркас остаются узнаваемыми.'],
  ['Virtual staging, decluttering, furniture removal, day-to-dusk, listing social and a clearly labeled renovation visualization. Every source original remains available; permanent property features are checked against it.', 'Виртуальная меблировка, удаление лишних предметов, переход от дня к сумеркам, визуал для соцсетей и чётко обозначенная визуализация ремонта. Исходники сохраняются, а постоянные элементы объекта сверяются с оригиналом.'],
  ['Two accepted scenes from the same supplied child and mascot. Only manually approved finals are shown.', 'Две принятые сцены с одним ребёнком и маскотом из исходников. Показаны только финалы, прошедшие ручной отбор.'],
  ['Every row pairs the exact supplied product photograph with its selected commercial final.', 'В каждой строке показаны исходная фотография продукта и выбранный коммерческий результат.'],
  ['Only the upper garment changes. Pose, identity, setting and lower styling stay anchored to each model input.', 'Меняется только верхняя часть одежды. Поза, внешность, окружение и нижняя часть образа сохраняются по исходной фотографии.'],
  ['Two garment references and three untouched model photographs define the full transfer contract.', 'Два референса одежды и три исходные фотографии моделей задают условия переноса.'],
  ['Every row names both inputs and places the generated campaign frame beside them.', 'В каждой строке показаны исходные материалы и созданный рядом коммерческий кадр.'],
  ['The dish changes within each supplied set. The production surface and campaign identity stay fixed.', 'В каждом сете меняется блюдо, а поверхность съёмки и визуальная идентичность кампании сохраняются.'],
  ['One exact chair reference and two empty room references define product identity and spatial direction separately.', 'Один точный референс кресла и два пустых интерьера отдельно задают продукт и пространство.'],
  ['The rooms set the environment. The chair reference remains the product identity contract.', 'Помещения задают окружение, а референс кресла сохраняет идентичность продукта.'],
  ['Built in-house.', 'Собрано внутри студии.'], ['Measured on RTX 5090.', 'Измерено на RTX 5090.'], ['One empty room, two furnishing directions.', 'Одна пустая комната. Два варианта меблировки.'], ['One occupied apartment, two levels of cleanup.', 'Одна обжитая квартира. Два уровня очистки.'], ['One daylight exterior, two launch assets.', 'Один дневной вид снаружи. Два материала для запуска.'], ['Unfinished condition to proposed renovation.', 'От текущего состояния к концепции ремонта.']
  ,['Private RTX 5090 production', 'Локальное производство на RTX 5090'], ['Private RTX 5090', 'Локально на RTX 5090'], ['≈63s complete render', '≈63 с на полный рендер'], ['Full HD master', 'Мастер-файл в Full HD'], ['GARMENT 01', 'ВЕЩЬ 01'], ['GARMENT 02', 'ВЕЩЬ 02'], ['MODEL 01', 'МОДЕЛЬ 01'], ['MODEL 02', 'МОДЕЛЬ 02'], ['MODEL 03', 'МОДЕЛЬ 03'], ['Cobalt ripstop jacket', 'Кобальтовая куртка из рипстопа'], ['Houndstooth cardigan', 'Кардиган в узор «гусиная лапка»'], ['Dress transferred, scene retained', 'Платье перенесено, сцена сохранена'], ['Swimwear transferred, pose retained', 'Купальник перенесён, поза сохранена'], ['Skirt transferred, styling retained', 'Юбка перенесена, стилизация сохранена'], ['Denim transferred, architecture retained', 'Деним перенесён, архитектура сохранена'], ['Tailoring transferred, light retained', 'Костюм перенесён, освещение сохранено'], ['Two-piece transferred, scene retained', 'Комплект перенесён, сцена сохранена'], ['GENERATED OUTPUT', 'СОЗДАННЫЙ РЕЗУЛЬТАТ'], ['MODEL + LOCATION INPUT', 'ИСХОДНИК МОДЕЛИ + ЛОКАЦИИ'], ['GARMENT INPUT', 'ИСХОДНИК ОДЕЖДЫ'], ['SET INPUT 01', 'ИСХОДНИК СЕТА 01'], ['SET INPUT 02', 'ИСХОДНИК СЕТА 02'], ['ROOM INPUT 01', 'ИСХОДНИК ПОМЕЩЕНИЯ 01'], ['ROOM INPUT 02', 'ИСХОДНИК ПОМЕЩЕНИЯ 02'], ['OUTPUT 01', 'РЕЗУЛЬТАТ 01'], ['OUTPUT 02', 'РЕЗУЛЬТАТ 02'], ['FINAL 01', 'ФИНАЛ 01'], ['FINAL 02', 'ФИНАЛ 02']
  ,['Measured across five accepted 1080×1920 production samples.', 'Измерено на пяти принятых производственных образцах 1080×1920.'], ['One prepared item, including garment isolation and final rendering.', 'Одна подготовленная вещь, включая выделение одежды и финальный рендер.'], ['Five different garments processed consecutively after startup.', 'Пять разных вещей обработаны последовательно после запуска.'], ['Every final is Full HD or larger and manually reviewed before delivery.', 'Каждый финал имеет разрешение Full HD или выше и проходит ручную проверку перед передачей.'], ['Input / output', 'Исходники и результаты'], ['Built to leave the moodboard.', 'Готово выйти за пределы мудборда.'], ['WHITE-LABEL · CAMPAIGNS · SKU BATCHES', 'WHITE-LABEL · КАМПАНИИ · СЕРИИ SKU']
  ,['Matched pose pairs', 'Пары с совпадающими позами'], ['Car door · architectural walk', 'Дверь автомобиля · архитектурная прогулка'], ['6 garments · 6 scenes', '6 вещей · 6 сцен'], ['GARMENT ИСХОДНИК', 'ИСХОДНИК ОДЕЖДЫ'], ['MODEL + LOCATION ИСХОДНИК', 'ИСХОДНИК МОДЕЛИ + ЛОКАЦИИ'], ['Violet satin slip', 'Фиолетовое атласное платье-комбинация'], ['Coral one-piece', 'Коралловый слитный купальник'], ['Cobalt pleated skirt', 'Кобальтовая плиссированная юбка'], ['Rust denim skirt', 'Ржавая джинсовая юбка'], ['Ivory jumpsuit', 'Слоново-белый комбинезон'], ['Teal two-piece', 'Бирюзовый комплект'], ['Шесть вещей. Six supplied model scenes. Six directly auditable transfers.', 'Шесть вещей. Шесть исходных сцен с моделями. Шесть проверяемых переносов.'], ['2 sets · 5 dishes', '2 сета · 5 блюд'], ['5 × Full HD+', '5 × Full HD+'], ['Two empty art-directed sets. Food is the generated variable; tableware, framing and campaign color remain controlled.', 'Два пустых постановочных сета. Еда меняется, а посуда, кадрирование и цвет кампании остаются под контролем.'], ['SET ИСХОДНИК 01', 'ИСХОДНИК СЕТА 01'], ['SET ИСХОДНИК 02', 'ИСХОДНИК СЕТА 02'], ['Graphic red.', 'Графичный красный.'], ['Delivery ready.', 'Готово для доставки.'], ['The visual direction can move from editorial dining into a bold top-down delivery campaign while staying consistent as a commercial series.', 'Визуальное направление может перейти от журнальной ресторанной съёмки к выразительной кампании доставки сверху, сохраняя целостность коммерческой серии.'], ['2 interior directions', '2 интерьерных направления'], ['4 × Full HD+', '4 × Full HD+'], ['Cobalt mohair', 'Кобальтовый мохер'], ['Curved shell', 'Изогнутый корпус'], ['Separate cushion', 'Отдельная подушка'], ['Chrome sled frame', 'Хромированный полозьевидный каркас'], ['No invented permanent features', 'Без выдуманных постоянных элементов'], ['7 × Full HD+', '7 × Full HD+'], ['Walls, windows, floor and camera remain tied to the original. Only the editable furnishing zone changes.', 'Стены, окна, пол и камера привязаны к оригиналу. Меняется только редактируемая зона мебели.'], ['Original empty room', 'Исходная пустая комната'], ['The first pass removes clutter. The second removes movable furniture while retaining permanent property features.', 'На первом этапе убирается беспорядок. На втором удаляется подвижная мебель, а постоянные элементы объекта сохраняются.'], ['Original occupied apartment', 'Исходная обжитая квартира'], ['The source architecture drives both a blue-hour listing image and a vertical social crop.', 'Архитектура исходника определяет и кадр объявления в синий час, и вертикальный материал для соцсетей.'], ['Original daylight villa', 'Исходный вид виллы днём'], ['This is presented as a future-state concept, never as a photograph of the existing property.', 'Это концепция будущего состояния, а не фотография существующего объекта.'], ['Recognizable subjects.', 'Узнаваемые объекты.'], ['New commercial worlds.', 'Новые коммерческие миры.'], ['Supplied people, characters and products move into new commercial scenes while keeping their recognizable visual identity.', 'Предоставленные люди, персонажи и продукты переносятся в новые коммерческие сцены с сохранением узнаваемой визуальной идентичности.'], ['2 character scenes · 3 products', '2 сцены с персонажами · 3 продукта'], ['87.7–114.3s per frame', '87,7–114,3 с на кадр'], ['100% local · RTX 5090', '100% локально · RTX 5090'], ['SELECTED PRODUCTS', 'ОТОБРАННЫЕ ПРОДУКТЫ'], ['Принято masters', 'Принятые мастер-файлы'], ['Локально на RTX 5090 image production · 2026', 'Локальное производство изображений на RTX 5090 · 2026'], ['Private RTX 5090 image production · 2026', 'Локальное производство изображений на RTX 5090 · 2026'], ['seed', 'seed'], ['round-trip', 'загрузка туда-обратно'], ['input/output', 'исходники и результаты'], ['Type', 'Тип'], ['Independent spec study', 'Независимый презентационный spec-кейс'], ['Selected', 'Отобрано']
];

function translateVisibleText(language) {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  if (!originalTextNodes.length) while (walker.nextNode()) originalTextNodes.push({ node: walker.currentNode, text: walker.currentNode.nodeValue });
  originalTextNodes.forEach(({ node, text }) => {
    if (language === 'en') { node.nodeValue = text; return; }
    let value = text;
    ruRules.forEach(([from, to]) => { value = value.replaceAll(from, to); });
    node.nodeValue = value;
  });
}

const initialTextWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
while (initialTextWalker.nextNode()) originalTextNodes.push({ node: initialTextWalker.currentNode, text: initialTextWalker.currentNode.nodeValue });

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
