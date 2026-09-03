(() => {
  if (typeof translations === 'undefined' || typeof setLanguage !== 'function') return;

  const copy = {
    en: {
      navProduction: 'Engineering',
      heroEyebrow: 'COMFYUI / GENERATIVE AI WORKFLOW ENGINEER',
      heroTitle: 'Repeatable GenAI workflows.<br><em>Built around real constraints.</em>',
      heroLede: 'I build production-oriented ComfyUI workflows for virtual try-on, product imagery and consistent characters — with optimization, QA/regeneration loops and production handoff.',
      heroLink: 'Start with a paid technical test',
      heroNote: 'NVIDIA H20 cluster experience<br>VTON · product · consistency',
      experienceYears: 'GenAI R&D + production',
      clusterExperience: 'production cluster experience',
      specSystems: 'strongest specialization',
      workflowDesign: 'custom nodes · API · deployment',
      selectedBody: 'The public cases show outputs, constraints and measured behavior — not my production graphs. High-value workflows stay private; for a real client task I prefer a paid technical test with workflow delivery.',
      profileEyebrow: 'WHAT I BUILD',
      profileTitle: 'From a difficult generation task to a repeatable production workflow.',
      profileBody: 'I build production-oriented ComfyUI systems for virtual try-on, product imagery and consistent people or characters. I work across reference images, masks, depth, pose, segmentation and video inputs; build or modify custom nodes and Python preprocessing/postprocessing; and turn experiments into repeatable workflows with QA/regeneration, version pinning and deployment handoff.',
      profileFactOneTitle: 'VTON + product',
      profileFactOneBody: 'controlled fidelity and commercial image workflows',
      profileFactTwoTitle: 'Consistency',
      profileFactTwoBody: 'people and characters, with or without LoRA',
      profileFactThreeTitle: 'R&D → production',
      profileFactThreeBody: 'model evaluation, optimization and reproducible delivery',
      privateEyebrow: 'WORKFLOW ENGINEERING',
      privateTitle: 'From experiment to repeatable workflow.<br>Quality, cost and handoff included.',
      localAdvantages: 'I can build and modify custom ComfyUI nodes, Python preprocessing/postprocessing, diagnose failure points, optimize VRAM/latency, pin ComfyUI and node versions, mirror model files, deploy from scratch on Vast.ai, and add functional API/queue/webhook integration. For larger backend or DevOps systems I coordinate the production handoff rather than presenting myself as a DevOps engineer.',
      rdAdvantages: 'I actively track new GenAI models, papers and tools, test relevant releases, and use that R&D to choose the fastest viable path for a client problem instead of forcing every task through one fixed model stack.',
      deliveryEyebrow: 'PAID TECHNICAL TEST',
      deliveryTitle: 'Prove the workflow on your real task.',
      paidTestStep1: 'Real client inputs + explicit acceptance criteria',
      paidTestStep2: '1–3 technical approaches tested against the same goal',
      paidTestStep3: 'Selected outputs + working ComfyUI workflow + technical notes',
      paidTestStep4: 'Stable API / production hardening scoped separately when needed',
      contactEyebrow: 'PAID TEST · RETAINER · R&D PARTNER',
      contactTitle: 'Bring a real GenAI problem.<br>I’ll prove the approach on a paid technical test.',
      footerLine: 'ComfyUI / Generative AI workflow engineering · 2026'
    },
    ru: {
      navProduction: 'Инжиниринг',
      heroEyebrow: 'COMFYUI / GENERATIVE AI WORKFLOW ENGINEER',
      heroTitle: 'Повторяемые GenAI-workflow.<br><em>Под реальные ограничения.</em>',
      heroLede: 'Строю production-oriented workflow в ComfyUI для virtual try-on, продуктовых изображений и консистентных персонажей — с оптимизацией, QA/перегенерацией и передачей в production.',
      heroLink: 'Начать с оплачиваемого технического теста',
      heroNote: 'Опыт production на кластере NVIDIA H20<br>VTON · product · consistency',
      experienceYears: 'GenAI R&D + production',
      clusterExperience: 'опыт production-кластера',
      specSystems: 'сильнейшая специализация',
      workflowDesign: 'custom nodes · API · deployment',
      selectedBody: 'Публичные кейсы показывают результаты, ограничения и измеримое поведение, но не мои production-графы. Ценные workflow остаются закрытыми; под реальную задачу клиента предпочитаю оплачиваемый технический тест с передачей workflow.',
      profileEyebrow: 'ЧТО Я СТРОЮ',
      profileTitle: 'От сложной генеративной задачи до повторяемого production-workflow.',
      profileBody: 'Строю production-oriented системы в ComfyUI для virtual try-on, product imagery и консистентных людей или персонажей. Работаю с референсами, масками, depth, pose, segmentation и video inputs; создаю и модифицирую custom nodes и Python preprocessing/postprocessing; превращаю эксперименты в повторяемые workflow с QA/перегенерацией, фиксацией версий и передачей в production.',
      profileFactOneTitle: 'VTON + product',
      profileFactOneBody: 'контроль fidelity и коммерческие image-workflow',
      profileFactTwoTitle: 'Consistency',
      profileFactTwoBody: 'люди и персонажи, с LoRA или без неё',
      profileFactThreeTitle: 'R&D → production',
      profileFactThreeBody: 'оценка моделей, оптимизация и воспроизводимая передача',
      privateEyebrow: 'WORKFLOW ENGINEERING',
      privateTitle: 'От эксперимента до повторяемого workflow.<br>Качество, стоимость и handoff включены.',
      localAdvantages: 'Могу создавать и модифицировать custom nodes в ComfyUI, Python preprocessing/postprocessing, диагностировать узкие места, оптимизировать VRAM/latency, фиксировать версии ComfyUI и нод, зеркалировать файлы моделей, с нуля поднимать окружение на Vast.ai и собирать функциональную API/queue/webhook-обвязку. Для крупных backend/DevOps-систем делаю корректный production handoff, а не выдаю себя за DevOps-инженера.',
      rdAdvantages: 'Постоянно отслеживаю новые GenAI-модели, papers и инструменты, тестирую релевантные релизы и использую этот R&D, чтобы выбирать самый быстрый жизнеспособный путь под задачу клиента, а не проталкивать все задачи через один фиксированный стек.',
      deliveryEyebrow: 'ОПЛАЧИВАЕМЫЙ ТЕХНИЧЕСКИЙ ТЕСТ',
      deliveryTitle: 'Проверим workflow на вашей реальной задаче.',
      paidTestStep1: 'Реальные исходники клиента + явные критерии приёмки',
      paidTestStep2: '1–3 технических подхода проверяются на одной цели',
      paidTestStep3: 'Отобранные outputs + рабочий ComfyUI workflow + технические заметки',
      paidTestStep4: 'Стабильный API / production hardening оцениваются отдельно при необходимости',
      contactEyebrow: 'PAID TEST · RETAINER · R&D PARTNER',
      contactTitle: 'Принесите реальную GenAI-задачу.<br>Я докажу подход на оплачиваемом техническом тесте.',
      footerLine: 'ComfyUI / Generative AI workflow engineering · 2026'
    }
  };

  Object.assign(translations.en, copy.en);
  Object.assign(translations.ru, copy.ru);

  const originalSetLanguage = setLanguage;
  setLanguage = function setPortfolioLanguage(language) {
    originalSetLanguage(language);
    document.title = language === 'ru'
      ? 'Михаил | ComfyUI / Generative AI Workflow Engineer'
      : 'Mikhail | ComfyUI / Generative AI Workflow Engineer';
    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.content = language === 'ru'
        ? 'ComfyUI / Generative AI Workflow Engineer: virtual try-on, product imagery, consistency, QA/regeneration, optimization и production handoff.'
        : 'ComfyUI / Generative AI Workflow Engineer for virtual try-on, product imagery, consistency, QA/regeneration, optimization and production handoff.';
    }
  };

  const currentLanguage = document.documentElement.lang === 'ru' ? 'ru' : 'en';
  setLanguage(currentLanguage);
})();
