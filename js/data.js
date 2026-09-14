/* CONTENT DATABASE: add one WORKS object to add a case. All text uses {en,ru}.
   Numbers are source-reported; see case disclosures. No external data is fetched. */
const CATEGORIES = [
  {
    "id": "all",
    "label": {
      "en": "All work",
      "ru": "Все работы"
    }
  },
  {
    "id": "fashion",
    "label": {
      "en": "Fashion",
      "ru": "Мода"
    }
  },
  {
    "id": "product",
    "label": {
      "en": "Product",
      "ru": "Продукт"
    }
  },
  {
    "id": "spaces",
    "label": {
      "en": "Spaces",
      "ru": "Пространства"
    }
  },
  {
    "id": "characters",
    "label": {
      "en": "Characters",
      "ru": "Персонажи"
    }
  }
];

const FILTER_ORDER = [
  "all",
  "fashion",
  "product",
  "spaces",
  "characters"
];

const WORKS = [
  {
    "id": "fashion-transfer",
    "index": "01",
    "category": "fashion",
    "year": "2026",
    "featured": true,
    "accent": "#2f4cff",
    "cover": "assets/web/final/fashion/cobalt-car-editorial.webp",
    "coverAlt": {
      "en": "Cobalt ripstop jacket transferred onto a model seated in a luxury car",
      "ru": "Кобальтовая куртка, перенесённая на модель в салоне автомобиля"
    },
    "ratio": "portrait",
    "title": {
      "en": "Virtual try-on",
      "ru": "Виртуальная примерка"
    },
    "tagline": {
      "en": "Garment fidelity · matched poses",
      "ru": "Точность одежды · сохранение поз"
    },
    "summary": {
      "en": "Two garments are transferred onto three real commercial poses. The person, the setting and the lower half of the outfit stay anchored to the source frame — only the upper garment changes.",
      "ru": "Две вещи переносятся на три реальные коммерческие позы. Человек, сцена и нижняя часть образа остаются привязаны к исходному кадру — меняется только верхняя одежда."
    },
    "tags": [
      "VTON",
      "Identity lock",
      "Pose retain"
    ],
    "meta": [
      {
        "k": {
          "en": "Type",
          "ru": "Тип"
        },
        "v": {
          "en": "Independent spec study",
          "ru": "Независимый spec-кейс"
        }
      },
      {
        "k": {
          "en": "Inputs",
          "ru": "Исходники"
        },
        "v": {
          "en": "2 garments · 3 poses",
          "ru": "2 вещи · 3 позы"
        }
      },
      {
        "k": {
          "en": "Render time",
          "ru": "Рендер"
        },
        "v": {
          "en": "≈63 s complete pass",
          "ru": "≈63 с полный проход"
        }
      },
      {
        "k": {
          "en": "Output",
          "ru": "Результат"
        },
        "v": {
          "en": "4 displayed finals",
          "ru": "4 показанных финала"
        }
      }
    ],
    "metrics": [
      {
        "v": "≈63s",
        "l": {
          "en": "complete garment render",
          "ru": "полный рендер образа"
        }
      },
      {
        "v": "2",
        "l": {
          "en": "garment references",
          "ru": "референса одежды"
        }
      },
      {
        "v": "3",
        "l": {
          "en": "matched source poses",
          "ru": "исходные позы"
        }
      }
    ],
    "compare": [
      {
        "input": "assets/web/references/fashion/model-car-door-source.webp",
        "output": "assets/web/final/fashion/cobalt-car-editorial.webp",
        "label": {
          "en": "Car doorway · cobalt jacket",
          "ru": "У автомобиля · кобальтовая куртка"
        }
      },
      {
        "input": "assets/web/references/fashion/model-brutalist-walk-source.webp",
        "output": "assets/web/final/fashion/houndstooth-brutalist-walk.webp",
        "label": {
          "en": "Architectural walk · houndstooth",
          "ru": "Прогулка у брутализма · гусиная лапка"
        }
      }
    ],
    "gallery": [
      {
        "src": "assets/web/final/fashion/houndstooth-car-editorial.webp",
        "caption": {
          "en": "Houndstooth · car editorial",
          "ru": "Гусиная лапка · автомобильная съёмка"
        },
        "size": "t"
      },
      {
        "src": "assets/web/final/fashion/cobalt-brutalist-walk.webp",
        "caption": {
          "en": "Cobalt · brutalist walk",
          "ru": "Кобальт · прогулка у брутализма"
        },
        "size": "t"
      },
      {
        "src": "assets/web/final/fashion/cobalt-car-editorial.webp",
        "caption": {
          "en": "Cobalt · car editorial",
          "ru": "Кобальт · автомобильная съёмка"
        },
        "size": "t"
      }
    ],
    "inputs": [
      {
        "src": "assets/web/references/fashion/cobalt-ripstop-jacket-source.webp",
        "caption": {
          "en": "Garment input 01",
          "ru": "Исходник одежды 01"
        }
      },
      {
        "src": "assets/web/references/fashion/houndstooth-cardigan-source.webp",
        "caption": {
          "en": "Garment input 02",
          "ru": "Исходник одежды 02"
        }
      },
      {
        "src": "assets/web/references/fashion/model-car-door-source.webp",
        "caption": {
          "en": "Model input 01",
          "ru": "Исходник модели 01"
        }
      },
      {
        "src": "assets/web/references/fashion/model-brutalist-walk-source.webp",
        "caption": {
          "en": "Model input 02",
          "ru": "Исходник модели 02"
        }
      },
      {
        "src": "assets/web/references/fashion/model-glass-atrium-source.webp",
        "caption": {
          "en": "Model input 03",
          "ru": "Исходник модели 03"
        }
      }
    ],
    "sections": [
      {
        "h": {
          "en": "Transfer constraints",
          "ru": "Ограничения переноса"
        },
        "p": {
          "en": "The study changes the upper garment while aiming to retain the supplied person, pose, setting and lower styling. Compare the original and output at full resolution to assess garment detail and any remaining differences.",
          "ru": "В кейсе меняется верхняя одежда с задачей сохранить человека, позу, сцену и нижнюю часть образа. Сравните исходник и результат в полном размере, чтобы оценить детали одежды и оставшиеся различия."
        }
      },
      {
        "h": {
          "en": "About this case",
          "ru": "Об этом кейсе"
        },
        "p": {
          "en": "Independent synthetic case study. Timing, resolution and experience figures are retained from the supplied portfolio, not re-benchmarked for this redesign. Public examples do not include private production workflows.",
          "ru": "Независимый синтетический кейс. Время обработки, разрешение и опыт перенесены из исходного портфолио, без нового бенчмарка при редизайне. Закрытые production-workflow в публичные примеры не входят."
        }
      }
    ]
  },
  {
    "id": "fashion-campaigns",
    "index": "02",
    "category": "fashion",
    "year": "2026",
    "featured": true,
    "accent": "#6b4cff",
    "cover": "assets/web/final/fashion/ivory-jumpsuit-opera-bluehour.webp",
    "coverAlt": {
      "en": "Ivory tailored jumpsuit transferred onto a model outside an opera house at blue hour",
      "ru": "Айвори-комбинезон, перенесённый на модель у оперного театра в синий час"
    },
    "ratio": "portrait",
    "title": {
      "en": "Fashion, in context",
      "ru": "Одежда в новом контексте"
    },
    "tagline": {
      "en": "Five garments · five narrative locations",
      "ru": "Пять вещей · пять локаций"
    },
    "summary": {
      "en": "Five garment references are paired with five supplied model scenes: private jet, cliff pool, design district, spiral museum and opera house. These are independent synthetic studies, not commissioned brand campaigns.",
      "ru": "Пять референсов одежды сопоставлены с пятью исходными сценами: частный самолёт, бассейн у скалы, дизайн-квартал, спиральный музей и опера. Это независимые синтетические кейсы, не заказные кампании брендов."
    },
    "tags": [
      "VTON",
      "Category matrix",
      "Art direction"
    ],
    "meta": [
      {
        "k": {
          "en": "Type",
          "ru": "Тип"
        },
        "v": {
          "en": "Independent spec study",
          "ru": "Независимый spec-кейс"
        }
      },
      {
        "k": {
          "en": "Coverage",
          "ru": "Покрытие"
        },
        "v": {
          "en": "5 garments · 5 scenes",
          "ru": "5 вещей · 5 сцен"
        }
      },
      {
        "k": {
          "en": "Output",
          "ru": "Результат"
        },
        "v": {
          "en": "5 shown · 1088 × 1920",
          "ru": "5 показано · 1088 × 1920"
        }
      }
    ],
    "metrics": [
      {
        "v": "5",
        "l": {
          "en": "garment categories",
          "ru": "категорий одежды"
        }
      },
      {
        "v": "5",
        "l": {
          "en": "selected scenes",
          "ru": "отобранных сцен"
        }
      },
      {
        "v": "100%",
        "l": {
          "en": "local production",
          "ru": "локальное производство"
        }
      }
    ],
    "compare": [
      {
        "input": "assets/web/references/fashion-expanded/model-private-jet-source.webp",
        "output": "assets/web/final/fashion/violet-slip-private-jet.webp",
        "label": {
          "en": "Private jet · violet satin",
          "ru": "Самолёт · фиолетовый сатин"
        }
      },
      {
        "input": "assets/web/references/fashion-expanded/model-cliff-pool-source.webp",
        "output": "assets/web/final/fashion/coral-onepiece-cliff-pool.webp",
        "label": {
          "en": "Cliff pool · coral swimwear",
          "ru": "Бассейн · коралловый купальник"
        }
      },
      {
        "input": "assets/web/references/fashion-expanded/model-design-district-source.webp",
        "output": "assets/web/final/fashion/cobalt-skirt-design-district.webp",
        "label": {
          "en": "Design district · cobalt skirt",
          "ru": "Дизайн-квартал · кобальтовая юбка"
        }
      },
      {
        "input": "assets/web/references/fashion-expanded/model-spiral-museum-source.webp",
        "output": "assets/web/final/fashion/rust-denim-skirt-spiral-museum.webp",
        "label": {
          "en": "Spiral museum · rust denim",
          "ru": "Музей · деним"
        }
      },
      {
        "input": "assets/web/references/fashion-expanded/model-opera-bluehour-source.webp",
        "output": "assets/web/final/fashion/ivory-jumpsuit-opera-bluehour.webp",
        "label": {
          "en": "Opera · ivory jumpsuit",
          "ru": "Опера · айвори-комбинезон"
        }
      }
    ],
    "gallery": [
      {
        "src": "assets/web/final/fashion/violet-slip-private-jet.webp",
        "caption": {
          "en": "Private jet · violet satin",
          "ru": "Самолёт · фиолетовый сатин"
        },
        "size": "t"
      },
      {
        "src": "assets/web/final/fashion/coral-onepiece-cliff-pool.webp",
        "caption": {
          "en": "Cliff pool · coral swimwear",
          "ru": "Бассейн · коралловый купальник"
        },
        "size": "t"
      },
      {
        "src": "assets/web/final/fashion/cobalt-skirt-design-district.webp",
        "caption": {
          "en": "Design district · cobalt skirt",
          "ru": "Дизайн-квартал · кобальтовая юбка"
        },
        "size": "t"
      },
      {
        "src": "assets/web/final/fashion/rust-denim-skirt-spiral-museum.webp",
        "caption": {
          "en": "Spiral museum · rust denim",
          "ru": "Музей · деним"
        },
        "size": "t"
      },
      {
        "src": "assets/web/final/fashion/ivory-jumpsuit-opera-bluehour.webp",
        "caption": {
          "en": "Opera · ivory jumpsuit",
          "ru": "Опера · айвори-комбинезон"
        },
        "size": "t"
      }
    ],
    "inputs": [
      {
        "src": "assets/web/references/fashion-expanded/violet-satin-slip-dress-source.webp",
        "caption": {
          "en": "Violet satin slip",
          "ru": "Фиолетовый слип"
        }
      },
      {
        "src": "assets/web/references/fashion-expanded/coral-sculpt-onepiece-source.webp",
        "caption": {
          "en": "Coral one-piece",
          "ru": "Коралловый купальник"
        }
      },
      {
        "src": "assets/web/references/fashion-expanded/cobalt-pleated-midi-skirt-source.webp",
        "caption": {
          "en": "Cobalt midi skirt",
          "ru": "Кобальтовая юбка"
        }
      },
      {
        "src": "assets/web/references/fashion-expanded/rust-denim-maxi-skirt-source.webp",
        "caption": {
          "en": "Rust denim skirt",
          "ru": "Ржавый деним"
        }
      },
      {
        "src": "assets/web/references/fashion-expanded/ivory-tailored-jumpsuit-source.webp",
        "caption": {
          "en": "Ivory jumpsuit",
          "ru": "Айвори-комбинезон"
        }
      }
    ],
    "sections": [
      {
        "h": {
          "en": "Five explicit transfers",
          "ru": "Пять явных переносов"
        },
        "p": {
          "en": "Each comparison pairs its supplied model scene with the selected output. Garment references are listed separately below. The previously excluded teal outfit stays out of the public selection.",
          "ru": "Каждое сравнение связывает исходную сцену с отобранным результатом. Референсы одежды отдельно показаны ниже. Ранее исключённый бирюзовый комплект не возвращён в публичную подборку."
        }
      },
      {
        "h": {
          "en": "About this case",
          "ru": "Об этом кейсе"
        },
        "p": {
          "en": "Independent synthetic case study. Timing, resolution and experience figures are retained from the supplied portfolio, not re-benchmarked for this redesign. Public examples do not include private production workflows.",
          "ru": "Независимый синтетический кейс. Время обработки, разрешение и опыт перенесены из исходного портфолио, без нового бенчмарка при редизайне. Закрытые production-workflow в публичные примеры не входят."
        }
      }
    ]
  },
  {
    "id": "hospitality",
    "index": "03",
    "category": "product",
    "year": "2026",
    "featured": true,
    "accent": "#ff4d3d",
    "cover": "assets/web/final/food/cobalt-menu-beet-salad.webp",
    "coverAlt": {
      "en": "Beet salad photographed on a cobalt bistro table set",
      "ru": "Свекольный салат на кобальтовой бистро-съёмке"
    },
    "ratio": "landscape",
    "title": {
      "en": "A menu, not a one-off",
      "ru": "Не один кадр, а целое меню"
    },
    "tagline": {
      "en": "Art direction · consistent series",
      "ru": "Арт-дирекция · единая серия"
    },
    "summary": {
      "en": "An empty cobalt bistro set becomes a four-dish menu series without moving the plate, the lens, the light, the napkin or the glass. A second red set opens a graphic delivery direction.",
      "ru": "Пустой кобальтовый бистро-сет превращается в серию из четырёх блюд, при этом тарелка, оптика, свет, салфетка и бокал остаются на месте. Второй, красный сет открывает графическое delivery-направление."
    },
    "tags": [
      "Product series",
      "Fixed camera",
      "Colorway system"
    ],
    "meta": [
      {
        "k": {
          "en": "Type",
          "ru": "Тип"
        },
        "v": {
          "en": "Independent spec study",
          "ru": "Независимый spec-кейс"
        }
      },
      {
        "k": {
          "en": "Series",
          "ru": "Серия"
        },
        "v": {
          "en": "2 sets · 5 dishes",
          "ru": "2 сета · 5 блюд"
        }
      },
      {
        "k": {
          "en": "Output",
          "ru": "Результат"
        },
        "v": {
          "en": "5 × Full HD+",
          "ru": "5 × Full HD+"
        }
      }
    ],
    "metrics": [
      {
        "v": "4",
        "l": {
          "en": "dishes on the cobalt set",
          "ru": "блюда в кобальтовом сете"
        }
      },
      {
        "v": "1",
        "l": {
          "en": "red-set direction",
          "ru": "красное направление"
        }
      },
      {
        "v": "2",
        "l": {
          "en": "supplied sets",
          "ru": "исходных сета"
        }
      }
    ],
    "compare": [
      {
        "input": "assets/web/references/food/cobalt-menu-set-source.webp",
        "output": "assets/web/final/food/cobalt-menu-pappardelle.webp",
        "label": {
          "en": "Empty set → pappardelle",
          "ru": "Пустой сет → паппарделле"
        }
      },
      {
        "input": "assets/web/references/food/red-graphic-menu-set-source.webp",
        "output": "assets/web/final/food/red-campaign-tuna-bowl.webp",
        "label": {
          "en": "Red set → tuna bowl",
          "ru": "Красный сет → боул с тунцом"
        }
      }
    ],
    "gallery": [
      {
        "src": "assets/web/final/food/cobalt-menu-chocolate-tart.webp",
        "caption": {
          "en": "Chocolate tart · cobalt set",
          "ru": "Шоколадный тарт · кобальтовый сет"
        },
        "size": "w"
      },
      {
        "src": "assets/web/final/food/cobalt-menu-salmon.webp",
        "caption": {
          "en": "Salmon · cobalt set",
          "ru": "Лосось · кобальтовый сет"
        },
        "size": "w"
      },
      {
        "src": "assets/web/final/food/cobalt-menu-pappardelle.webp",
        "caption": {
          "en": "Pappardelle · cobalt set",
          "ru": "Паппарделле · кобальтовый сет"
        },
        "size": "w"
      },
      {
        "src": "assets/web/final/food/cobalt-menu-beet-salad.webp",
        "caption": {
          "en": "Beet salad · cobalt set",
          "ru": "Свекольный салат · кобальтовый сет"
        },
        "size": "w"
      }
    ],
    "inputs": [
      {
        "src": "assets/web/references/food/cobalt-menu-set-source.webp",
        "caption": {
          "en": "Set input 01",
          "ru": "Исходник сета 01"
        }
      },
      {
        "src": "assets/web/references/food/red-graphic-menu-set-source.webp",
        "caption": {
          "en": "Set input 02",
          "ru": "Исходник сета 02"
        }
      }
    ],
    "sections": [
      {
        "h": {
          "en": "A consistent series",
          "ru": "Единая серия"
        },
        "p": {
          "en": "The supplied table settings define the framing, tableware and colour direction. Food is the intended variable. The selected images show the approach; they are not a guarantee of unchanged pixels.",
          "ru": "Исходные сеты задают кадрирование, посуду и цветовое направление. Изменяемая часть — блюдо. Отобранные изображения демонстрируют подход, но не гарантируют неизменность каждого пикселя."
        }
      },
      {
        "h": {
          "en": "About this case",
          "ru": "Об этом кейсе"
        },
        "p": {
          "en": "Independent synthetic case study. Timing, resolution and experience figures are retained from the supplied portfolio, not re-benchmarked for this redesign. Public examples do not include private production workflows.",
          "ru": "Независимый синтетический кейс. Время обработки, разрешение и опыт перенесены из исходного портфолио, без нового бенчмарка при редизайне. Закрытые production-workflow в публичные примеры не входят."
        }
      }
    ]
  },
  {
    "id": "furniture",
    "index": "04",
    "category": "product",
    "year": "2026",
    "featured": true,
    "accent": "#2f4cff",
    "cover": "assets/web/final/furniture/cobalt-chair-gallery-scale.webp",
    "coverAlt": {
      "en": "Person seated in a cobalt mohair chair inside a postmodern gallery",
      "ru": "Человек в кобальтовом кресле в постмодернистской галерее"
    },
    "ratio": "portrait",
    "title": {
      "en": "One product. New spaces.",
      "ru": "Один продукт. Новые пространства."
    },
    "tagline": {
      "en": "Product identity · spatial control",
      "ru": "Идентичность продукта · контроль пространства"
    },
    "summary": {
      "en": "A cobalt mohair chair moves between cold penthouse luxury and a warm postmodern gallery. Its shell, cushion, material and chrome frame stay recognisable in every frame.",
      "ru": "Кобальтовое кресло из мохера перемещается между холодным пентхаусом и тёплой постмодернистской галереей. Корпус, подушка, материал и хромированное основание остаются узнаваемыми в каждом кадре."
    },
    "tags": [
      "Product fidelity",
      "Interior staging",
      "Scale study"
    ],
    "meta": [
      {
        "k": {
          "en": "Type",
          "ru": "Тип"
        },
        "v": {
          "en": "Independent spec study",
          "ru": "Независимый spec-кейс"
        }
      },
      {
        "k": {
          "en": "Settings",
          "ru": "Сцены"
        },
        "v": {
          "en": "2 interior directions",
          "ru": "2 интерьерных направления"
        }
      },
      {
        "k": {
          "en": "Output",
          "ru": "Результат"
        },
        "v": {
          "en": "4 × Full HD+",
          "ru": "4 × Full HD+"
        }
      }
    ],
    "metrics": [
      {
        "v": "4",
        "l": {
          "en": "invariants held",
          "ru": "неизменных признака"
        }
      },
      {
        "v": "2",
        "l": {
          "en": "interior identities",
          "ru": "интерьерных образа"
        }
      },
      {
        "v": "1",
        "l": {
          "en": "product reference",
          "ru": "продуктовый референс"
        }
      }
    ],
    "compare": [
      {
        "input": "assets/web/references/furniture/cold-penthouse-room-source.webp",
        "output": "assets/web/final/furniture/cobalt-chair-penthouse-wide.webp",
        "label": {
          "en": "Cold penthouse · wide",
          "ru": "Холодный пентхаус · общий план"
        }
      },
      {
        "input": "assets/web/references/furniture/postmodern-gallery-room-source.webp",
        "output": "assets/web/final/furniture/cobalt-chair-gallery-scale.webp",
        "label": {
          "en": "Postmodern gallery · human scale",
          "ru": "Галерея · человеческий масштаб"
        }
      }
    ],
    "gallery": [
      {
        "src": "assets/web/final/furniture/cobalt-chair-penthouse-detail.webp",
        "caption": {
          "en": "Penthouse · material detail",
          "ru": "Пентхаус · деталь материала"
        },
        "size": "t"
      },
      {
        "src": "assets/web/final/furniture/cobalt-chair-gallery-wide.webp",
        "caption": {
          "en": "Gallery · wide",
          "ru": "Галерея · общий план"
        },
        "size": "t"
      }
    ],
    "inputs": [
      {
        "src": "assets/web/references/furniture/cobalt-chrome-chair-source.webp",
        "caption": {
          "en": "Product input",
          "ru": "Продуктовый исходник"
        }
      },
      {
        "src": "assets/web/references/furniture/cold-penthouse-room-source.webp",
        "caption": {
          "en": "Room input 01",
          "ru": "Исходник комнаты 01"
        }
      },
      {
        "src": "assets/web/references/furniture/postmodern-gallery-room-source.webp",
        "caption": {
          "en": "Room input 02",
          "ru": "Исходник комнаты 02"
        }
      }
    ],
    "sections": [
      {
        "h": {
          "en": "Product identity",
          "ru": "Идентичность продукта"
        },
        "p": {
          "en": "Cobalt mohair, the curved shell, separate cushion and chrome frame are the target product features. The supplied chair and room references allow the results to be compared directly.",
          "ru": "Кобальтовый мохер, гнутый корпус, отдельная подушка и хромированное основание — целевые признаки продукта. Исходники кресла и помещений позволяют сравнить результат с референсами."
        }
      },
      {
        "h": {
          "en": "About this case",
          "ru": "Об этом кейсе"
        },
        "p": {
          "en": "Independent synthetic case study. Timing, resolution and experience figures are retained from the supplied portfolio, not re-benchmarked for this redesign. Public examples do not include private production workflows.",
          "ru": "Независимый синтетический кейс. Время обработки, разрешение и опыт перенесены из исходного портфолио, без нового бенчмарка при редизайне. Закрытые production-workflow в публичные примеры не входят."
        }
      }
    ]
  },
  {
    "id": "property",
    "index": "05",
    "category": "spaces",
    "year": "2026",
    "featured": true,
    "accent": "#1f8a6d",
    "cover": "assets/web/final/real-estate/villa-day-to-dusk.webp",
    "coverAlt": {
      "en": "Modern villa photographed at dusk with lit interiors",
      "ru": "Современная вилла в сумерках с подсвеченными интерьерами"
    },
    "ratio": "landscape",
    "title": {
      "en": "Spaces, reimagined",
      "ru": "Пространство по-новому"
    },
    "tagline": {
      "en": "Staging · cleanup · day to dusk",
      "ru": "Меблировка · очистка · сумерки"
    },
    "summary": {
      "en": "A complete listing launch kit: virtual staging, decluttering, furniture removal, day-to-dusk, a vertical social crop and a clearly labelled renovation visualisation. Permanent property features are always checked against the original.",
      "ru": "Полный набор для запуска объекта: виртуальная меблировка, расхламление, удаление мебели, переход день→сумерки, вертикальный social-кроп и явно помеченная визуализация ремонта. Постоянные элементы объекта всегда сверяются с оригиналом."
    },
    "tags": [
      "Virtual staging",
      "Declutter",
      "Day to dusk"
    ],
    "meta": [
      {
        "k": {
          "en": "Type",
          "ru": "Тип"
        },
        "v": {
          "en": "Independent spec study",
          "ru": "Независимый spec-кейс"
        }
      },
      {
        "k": {
          "en": "Rule",
          "ru": "Правило"
        },
        "v": {
          "en": "No invented permanent features",
          "ru": "Никаких выдуманных постоянных элементов"
        }
      },
      {
        "k": {
          "en": "Output",
          "ru": "Результат"
        },
        "v": {
          "en": "7 × Full HD+",
          "ru": "7 × Full HD+"
        }
      }
    ],
    "metrics": [
      {
        "v": "7",
        "l": {
          "en": "launch assets",
          "ru": "ассета для запуска"
        }
      },
      {
        "v": "4",
        "l": {
          "en": "transformation types",
          "ru": "типа преобразований"
        }
      }
    ],
    "compare": [
      {
        "input": "assets/web/references/real-estate/villa-daylight-source.webp",
        "output": "assets/web/final/real-estate/villa-day-to-dusk.webp",
        "label": {
          "en": "Daylight → dusk listing image",
          "ru": "День → сумерки, листинг"
        }
      },
      {
        "input": "assets/web/references/real-estate/empty-living-room-source.webp",
        "output": "assets/web/final/real-estate/living-room-scandinavian-staging.webp",
        "label": {
          "en": "Empty room → Scandinavian staging",
          "ru": "Пустая комната → скандинавская меблировка"
        }
      },
      {
        "input": "assets/web/references/real-estate/cluttered-apartment-source.webp",
        "output": "assets/web/final/real-estate/apartment-decluttered.webp",
        "label": {
          "en": "Occupied → decluttered",
          "ru": "Жилая → расхламлённая"
        }
      },
      {
        "input": "assets/web/references/real-estate/unfinished-condo-source.webp",
        "output": "assets/web/final/real-estate/condo-renovation-visualization.webp",
        "label": {
          "en": "Proposed renovation — visualisation, not existing condition",
          "ru": "Предлагаемый ремонт — визуализация, не текущее состояние"
        }
      }
    ],
    "gallery": [
      {
        "src": "assets/web/final/real-estate/living-room-warm-contemporary-staging.webp",
        "caption": {
          "en": "Warm contemporary staging",
          "ru": "Тёплая современная меблировка"
        },
        "size": "w"
      },
      {
        "src": "assets/web/final/real-estate/apartment-furniture-removed.webp",
        "caption": {
          "en": "Movable furniture removed",
          "ru": "Мебель удалена"
        },
        "size": "w"
      },
      {
        "src": "assets/web/final/real-estate/villa-listing-social-hero.webp",
        "caption": {
          "en": "Vertical social asset",
          "ru": "Вертикальный social-ассет"
        },
        "size": "t"
      },
      {
        "src": "assets/web/final/real-estate/condo-renovation-visualization.webp",
        "caption": {
          "en": "Labelled renovation visualisation",
          "ru": "Помеченная визуализация ремонта"
        },
        "size": "t"
      }
    ],
    "inputs": [
      {
        "src": "assets/web/references/real-estate/empty-living-room-source.webp",
        "caption": {
          "en": "Empty living room",
          "ru": "Пустая гостиная"
        }
      },
      {
        "src": "assets/web/references/real-estate/cluttered-apartment-source.webp",
        "caption": {
          "en": "Occupied apartment",
          "ru": "Жилая квартира"
        }
      },
      {
        "src": "assets/web/references/real-estate/villa-daylight-source.webp",
        "caption": {
          "en": "Villa daylight",
          "ru": "Вилла днём"
        }
      },
      {
        "src": "assets/web/references/real-estate/unfinished-condo-source.webp",
        "caption": {
          "en": "Unfinished condo",
          "ru": "Незавершённая квартира"
        }
      }
    ],
    "sections": [
      {
        "h": {
          "en": "Honesty is part of the deliverable",
          "ru": "Честность — часть результата"
        },
        "p": {
          "en": "Staging and cleanup may only touch what a photographer could move. Walls, windows, floors and the camera stay tied to the original, and renovation concepts are labelled as concepts, never sold as photographs.",
          "ru": "Меблировка и очистка касаются только того, что мог бы передвинуть фотограф. Стены, окна, полы и камера привязаны к оригиналу, а концепции ремонта помечаются как концепции и не выдаются за фотографии."
        }
      },
      {
        "h": {
          "en": "About this case",
          "ru": "Об этом кейсе"
        },
        "p": {
          "en": "Independent synthetic case study. Timing, resolution and experience figures are retained from the supplied portfolio, not re-benchmarked for this redesign. Public examples do not include private production workflows.",
          "ru": "Независимый синтетический кейс. Время обработки, разрешение и опыт перенесены из исходного портфолио, без нового бенчмарка при редизайне. Закрытые production-workflow в публичные примеры не входят."
        }
      }
    ]
  },
  {
    "id": "product-fidelity",
    "index": "06",
    "category": "characters",
    "year": "2026",
    "featured": true,
    "accent": "#c9a227",
    "cover": "assets/portfolio-2026/products/finals/rolex-daytona.webp",
    "coverAlt": {
      "en": "Rolex Daytona commercial still produced as an independent spec study",
      "ru": "Коммерческий кадр Rolex Daytona в рамках независимого spec-кейса"
    },
    "ratio": "square",
    "title": {
      "en": "Identity is the constant",
      "ru": "Идентичность — неизменна"
    },
    "tagline": {
      "en": "Characters · watches · jewellery",
      "ru": "Персонажи · часы · украшения"
    },
    "summary": {
      "en": "Supplied people, characters and products move into new commercial scenes while keeping the details that make them recognisable. Only manually approved finals are published.",
      "ru": "Переданные люди, персонажи и продукты переносятся в новые коммерческие сцены, сохраняя детали, по которым они узнаются. Публикуются только вручную одобренные финалы."
    },
    "tags": [
      "Character consistency",
      "Product fidelity",
      "Manual gate"
    ],
    "meta": [
      {
        "k": {
          "en": "Type",
          "ru": "Тип"
        },
        "v": {
          "en": "Independent spec study",
          "ru": "Независимый spec-кейс"
        }
      },
      {
        "k": {
          "en": "Selected",
          "ru": "Отобрано"
        },
        "v": {
          "en": "2 character scenes · 3 products",
          "ru": "2 сцены с персонажами · 3 продукта"
        }
      },
      {
        "k": {
          "en": "Inference",
          "ru": "Инференс"
        },
        "v": {
          "en": "87.7–114.3 s per frame",
          "ru": "87,7–114,3 с на кадр"
        }
      }
    ],
    "metrics": [
      {
        "v": "≈114s",
        "l": {
          "en": "average inference",
          "ru": "средний инференс"
        }
      },
      {
        "v": "up to 4K",
        "l": {
          "en": "final resolution, source-dependent",
          "ru": "финальное разрешение, зависит от источника"
        }
      },
      {
        "v": "3",
        "l": {
          "en": "selected products",
          "ru": "отобранных продукта"
        }
      }
    ],
    "compare": [
      {
        "input": "assets/portfolio-2026/products/inputs/rolex-daytona.webp",
        "inputFrame": { "width": 80, "height": 118, "left": 8, "top": -15 },
        "output": "assets/portfolio-2026/products/finals/rolex-daytona.webp",
        "label": {
          "en": "Rolex Daytona · campaign still",
          "ru": "Rolex Daytona · рекламный кадр"
        }
      },
      {
        "input": "assets/portfolio-2026/products/inputs/cartier-santos.webp",
        "output": "assets/portfolio-2026/products/finals/cartier-santos.webp",
        "label": {
          "en": "Cartier Santos · emerald campaign",
          "ru": "Cartier Santos · изумрудная кампания"
        }
      },
      {
        "input": "assets/portfolio-2026/story/inputs/child-reference.webp",
        "output": "assets/portfolio-2026/story/finals/trampoline.webp",
        "label": {
          "en": "Child identity · new scene",
          "ru": "Идентичность ребёнка · новая сцена"
        }
      },
      {
        "input": "assets/portfolio-2026/products/inputs/juste-un-clou.webp",
        "output": "assets/portfolio-2026/products/finals/juste-un-clou.webp",
        "label": {
          "en": "Juste un Clou · product study",
          "ru": "Juste un Clou · продуктовый кейс"
        }
      }
    ],
    "gallery": [
      {
        "src": "assets/portfolio-2026/products/finals/juste-un-clou.webp",
        "caption": {
          "en": "Juste un Clou · jewellery campaign",
          "ru": "Juste un Clou · ювелирная кампания"
        },
        "size": "s"
      },
      {
        "src": "assets/portfolio-2026/story/finals/museum.webp",
        "caption": {
          "en": "Child + mascot · space museum",
          "ru": "Ребёнок и маскот · космический музей"
        },
        "size": "s"
      },
      {
        "src": "assets/portfolio-2026/products/finals/cartier-santos.webp",
        "caption": {
          "en": "Cartier Santos · emerald campaign",
          "ru": "Cartier Santos · изумрудная кампания"
        },
        "size": "s"
      }
    ],
    "inputs": [
      {
        "src": "assets/portfolio-2026/story/inputs/child-reference.webp",
        "caption": {
          "en": "Child identity",
          "ru": "Идентичность ребёнка"
        }
      },
      {
        "src": "assets/portfolio-2026/story/inputs/mascot-reference.webp",
        "caption": {
          "en": "Mascot identity",
          "ru": "Идентичность маскота"
        }
      },
      {
        "src": "assets/portfolio-2026/products/inputs/juste-un-clou.webp",
        "caption": {
          "en": "Juste un Clou",
          "ru": "Juste un Clou"
        }
      }
    ],
    "sections": [
      {
        "h": {
          "en": "Independent demonstration",
          "ru": "Независимая демонстрация"
        },
        "p": {
          "en": "Selected character and product images demonstrate consistency across scenes. Outputs were manually selected in the original portfolio. Fine logos, proportions and facial details remain important review points.",
          "ru": "Отобранные изображения персонажей и продуктов демонстрируют постоянство в разных сценах. В исходном портфолио финалы отбирались вручную. Мелкие логотипы, пропорции и детали лица требуют внимания при проверке."
        }
      },
      {
        "h": {
          "en": "No brand affiliation",
          "ru": "Без связи с брендами"
        },
        "p": {
          "en": "Independent spec study. Brand names and references are shown only for demonstration. No affiliation, commission or endorsement by Rolex or Cartier is implied.",
          "ru": "Независимый spec-кейс. Бренды и референсы показаны только для демонстрации. Связь, заказ или одобрение со стороны Rolex или Cartier не подразумеваются."
        }
      },
      {
        "h": {
          "en": "About this case",
          "ru": "Об этом кейсе"
        },
        "p": {
          "en": "Independent synthetic case study. Timing, resolution and experience figures are retained from the supplied portfolio, not re-benchmarked for this redesign. Public examples do not include private production workflows.",
          "ru": "Независимый синтетический кейс. Время обработки, разрешение и опыт перенесены из исходного портфолио, без нового бенчмарка при редизайне. Закрытые production-workflow в публичные примеры не входят."
        }
      }
    ],
    "categories": [
      "product",
      "characters"
    ]
  }
];

const PROOF_BOARDS = [
  {
    "src": "assets/web/proof/fashion-input-to-output.webp",
    "label": {
      "en": "Fashion transfer",
      "ru": "Перенос одежды"
    }
  },
  {
    "src": "assets/web/proof/food-menu-series-board.webp",
    "label": {
      "en": "Menu series",
      "ru": "Серия меню"
    }
  },
  {
    "src": "assets/web/proof/furniture-input-to-output.webp",
    "label": {
      "en": "Product in space",
      "ru": "Продукт в пространстве"
    }
  },
  {
    "src": "assets/web/proof/real-estate-input-to-output.webp",
    "label": {
      "en": "Property kit",
      "ru": "Набор для объекта"
    }
  },
  {
    "src": "assets/web/proof/story-input-to-output.webp",
    "label": {
      "en": "Character story",
      "ru": "История персонажа"
    }
  },
  {
    "src": "assets/web/proof/fashion-expansion-input-to-output.webp",
    "label": {
      "en": "Category matrix",
      "ru": "Матрица категорий"
    }
  }
];

const COPY = {
  "en": {
    "brand": "MIKHAIL",
    "brandSub": "GENERATIVE AI ENGINEER",
    "navHome": "Home",
    "navWork": "Work",
    "navEngineering": "Engineering",
    "navContact": "Contact",
    "menu": "Menu",
    "close": "Close",
    "heroEyebrow": "COMFYUI / GENERATIVE AI WORKFLOW ENGINEER",
    "heroLine1": "Creative output.",
    "heroLine2": "Engineered to repeat.",
    "heroLede": "I turn difficult image-generation problems into controlled ComfyUI systems — virtual try-on, product imagery and consistent characters, built for production rather than a good first frame.",
    "heroCta": "See the work",
    "heroCta2": "Start a project",
    "heroScroll": "Scroll",
    "ticker": [
      "VIRTUAL TRY-ON",
      "PRODUCT IMAGERY",
      "IDENTITY LOCK",
      "QA LOOPS",
      "CUSTOM NODES",
      "VRAM OPTIMISATION",
      "PRODUCTION HANDOFF",
      "R&D"
    ],
    "statsEyebrow": "01 / AT A GLANCE",
    "statsTitle": "Creative range.\nEngineering underneath.",
    "stats": [
      {
        "v": "3+",
        "l": {
          "en": "years in GenAI R&D and production",
          "ru": "года в GenAI R&D и production"
        }
      },
      {
        "v": "8×H20",
        "l": {
          "en": "production cluster experience",
          "ru": "опыт production-кластера"
        }
      },
      {
        "v": "37",
        "l": {
          "en": "selected masters reported in the source",
          "ru": "мастер-кадров заявлено в исходнике"
        }
      },
      {
        "v": "100%",
        "l": {
          "en": "produced locally, end to end",
          "ru": "произведено локально, от начала до конца"
        }
      }
    ],
    "workEyebrow": "02 / SELECTED WORK",
    "workTitle": "The image is the proof.\nThe system is the work.",
    "workLede": "Independent synthetic case studies in fidelity, consistency and control. Open a case to see the supplied inputs, the generated outputs and the constraints that held them together.",
    "workAll": "All case studies",
    "proofEyebrow": "03 / EVIDENCE",
    "proofTitle": "Input on the left.\nOutput on the right.",
    "proofLede": "Drag to compare full frames without crop. Source framing and generated geometry may differ.",
    "profileEyebrow": "04 / THE ENGINEER",
    "profileTitle": "Creative ambition.\nProduction discipline.",
    "profileBody": "I build production-oriented ComfyUI systems for virtual try-on, product imagery and consistent people or characters. I work across reference images, masks, depth, pose, segmentation and video inputs; build and modify custom nodes plus Python preprocessing and postprocessing; and turn experiments into repeatable workflows with QA and regeneration loops, version pinning and a clean handoff.",
    "capabilities": [
      {
        "t": "VTON + product",
        "d": "Controlled garment and product fidelity with commercial-grade output."
      },
      {
        "t": "Consistency",
        "d": "People, characters and products that survive a change of scene."
      },
      {
        "t": "R&D → production",
        "d": "Model evaluation, VRAM and latency optimisation, reproducible delivery."
      },
      {
        "t": "Custom nodes",
        "d": "ComfyUI node authoring and Python preprocessing / postprocessing."
      }
    ],
    "engineEyebrow": "05 / UNDER THE HOOD",
    "engineTitle": "From experiment to repeatable workflow.",
    "engineLede": "Source-reported timings on one dedicated RTX 5090 after startup; not re-benchmarked for this redesign. Machine processing excludes art direction, iteration and human selection.",
    "engineMetrics": [
      {
        "v": "≈41s",
        "l": "average Full HD render",
        "d": "Across five accepted 1080×1920 production samples."
      },
      {
        "v": "≈63s",
        "l": "complete garment render",
        "d": "One prepared item, isolation through final render."
      },
      {
        "v": "≈5.2m",
        "l": "five-item batch",
        "d": "Five different garments processed back to back."
      },
      {
        "v": "37",
        "l": "selected masters",
        "d": "Source-reported selection, not a count of images currently shown."
      }
    ],
    "engineNote": "I can build and modify custom ComfyUI nodes, write Python pre/postprocessing, diagnose failure points, optimise VRAM and latency, pin ComfyUI and node versions, mirror model files, deploy from scratch on Vast.ai and add functional API, queue and webhook integration. For larger backend or DevOps systems I coordinate the handoff rather than presenting myself as a DevOps engineer.",
    "latticeEyebrow": "SYSTEM MAP · LIVE 3D",
    "latticeTitle": "Every frame passes through the same graph.",
    "latticeBody": "Inputs are isolated on the left, the controlled stage does the work in the middle, and only manually approved frames leave on the right. The shape is identical whether the subject is a garment, a dish, a room or a watch — that repetition is the product.",
    "processEyebrow": "06 / HOW WE START",
    "processTitle": "Your inputs.\nA working proof.",
    "process": [
      {
        "n": "01",
        "t": "Real inputs",
        "d": "You send actual client material and explicit acceptance criteria."
      },
      {
        "n": "02",
        "t": "Parallel approaches",
        "d": "One to three technical paths tested against the same goal."
      },
      {
        "n": "03",
        "t": "Working handover",
        "d": "Selected outputs, a runnable ComfyUI workflow and technical notes."
      },
      {
        "n": "04",
        "t": "Hardening",
        "d": "Stable API and production hardening scoped separately when you need them."
      }
    ],
    "contactEyebrow": "PAID TECHNICAL TEST · RETAINER · R&D PARTNER",
    "contactTitle": "Bring a real GenAI problem.\nI will prove the approach on a paid test.",
    "contactCta": "Start with a paid technical test",
    "footerNote": "ComfyUI / Generative AI workflow engineering · 2026",
    "workPageTitle": "Case studies",
    "workPageLede": "Every project, in one place. Filter by discipline or search by technique.",
    "searchPlaceholder": "Search cases, techniques, tags…",
    "resultsOne": "case",
    "resultsMany": "cases",
    "emptyTitle": "Nothing matches that filter",
    "emptyBody": "Try a different discipline or clear the search field.",
    "clearFilters": "Clear filters",
    "sortLabel": "Sort",
    "sortNewest": "Newest first",
    "sortOldest": "Oldest first",
    "sortAz": "A → Z",
    "viewGrid": "Grid",
    "viewList": "Index",
    "caseInput": "Supplied input",
    "caseOutput": "Generated output",
    "caseDrag": "Compare full images",
    "caseInputs": "Supplied inputs",
    "caseOutputs": "Delivered outputs",
    "caseGallery": "Full gallery",
    "caseOverview": "Overview",
    "caseMeta": "Details",
    "caseBack": "All case studies",
    "caseNext": "Next case",
    "casePrev": "Previous case",
    "openCase": "Open case",
    "viewFull": "View full size",
    "closeViewer": "Close",
    "themeToggle": "Toggle colour theme",
    "langToggle": "Switch language",
    "caseNotFound": "That case could not be found.",
    "caseNotFoundBody": "It may have been renamed or removed. Browse everything instead."
  },
  "ru": {
    "brand": "МИХАИЛ",
    "brandSub": "GENERATIVE AI ENGINEER",
    "navHome": "Главная",
    "navWork": "Работы",
    "navEngineering": "Инжиниринг",
    "navContact": "Контакты",
    "menu": "Меню",
    "close": "Закрыть",
    "heroEyebrow": "COMFYUI / GENERATIVE AI WORKFLOW ENGINEER",
    "heroLine1": "Креативный результат.",
    "heroLine2": "Повторяемый по замыслу.",
    "heroLede": "Превращаю сложные задачи генерации изображений в управляемые системы ComfyUI: виртуальная примерка, продуктовые кадры и постоянство персонажей. Это рабочий production, а не удачный первый кадр.",
    "heroCta": "Смотреть работы",
    "heroCta2": "Обсудить проект",
    "heroScroll": "Вниз",
    "ticker": [
      "ВИРТУАЛЬНАЯ ПРИМЕРКА",
      "ПРОДУКТОВЫЕ КАДРЫ",
      "IDENTITY LOCK",
      "QA-ЦИКЛЫ",
      "CUSTOM NODES",
      "ОПТИМИЗАЦИЯ VRAM",
      "PRODUCTION HANDOFF",
      "R&D"
    ],
    "statsEyebrow": "01 / КОРОТКО",
    "statsTitle": "Разные задачи.\nОбщая инженерная основа.",
    "stats": [
      {
        "v": "3+",
        "l": {
          "en": "years in GenAI R&D and production",
          "ru": "года в GenAI R&D и production"
        }
      },
      {
        "v": "8×H20",
        "l": {
          "en": "production cluster experience",
          "ru": "опыт production-кластера"
        }
      },
      {
        "v": "37",
        "l": {
          "en": "selected masters reported in the source",
          "ru": "мастер-кадров заявлено в исходнике"
        }
      },
      {
        "v": "100%",
        "l": {
          "en": "produced locally, end to end",
          "ru": "произведено локально, от начала до конца"
        }
      }
    ],
    "workEyebrow": "02 / ИЗБРАННЫЕ РАБОТЫ",
    "workTitle": "Изображение — доказательство.\nСистема — моя работа.",
    "workLede": "Независимые синтетические кейсы о точности, постоянстве и контроле. Откройте кейс, чтобы увидеть исходники, результаты и ограничения, которые их удержали.",
    "workAll": "Все кейсы",
    "proofEyebrow": "03 / ДОКАЗАТЕЛЬСТВО",
    "proofTitle": "Исходник слева.\nРезультат справа.",
    "proofLede": "Потяните слайдер: кадры показаны целиком, без обрезки. Кадрирование исходника и геометрия результата могут различаться.",
    "profileEyebrow": "04 / ОБ ИНЖЕНЕРЕ",
    "profileTitle": "Креативный замысел.\nИнженерная точность.",
    "profileBody": "Строю production-oriented системы в ComfyUI для virtual try-on, продуктовых изображений и консистентных людей и персонажей. Работаю с референсами, масками, depth, pose, segmentation и video inputs; создаю и модифицирую custom nodes и Python preprocessing/postprocessing; превращаю эксперименты в повторяемые workflow с QA-циклами, фиксацией версий и чистым handoff.",
    "capabilities": [
      {
        "t": "VTON + продукт",
        "d": "Контролируемая точность одежды и продукта на коммерческом уровне."
      },
      {
        "t": "Постоянство",
        "d": "Люди, персонажи и продукты, переживающие смену сцены."
      },
      {
        "t": "R&D → production",
        "d": "Оценка моделей, оптимизация VRAM и latency, воспроизводимая передача."
      },
      {
        "t": "Custom nodes",
        "d": "Разработка нод для ComfyUI и Python pre/postprocessing."
      }
    ],
    "engineEyebrow": "05 / ПОД КАПОТОМ",
    "engineTitle": "От эксперимента до повторяемого workflow.",
    "engineLede": "Замеры из исходного портфолио на выделенной RTX 5090 после прогрева; при редизайне не повторялись. Машинное время не включает арт-дирекцию, итерации и ручной отбор.",
    "engineMetrics": [
      {
        "v": "≈41с",
        "l": "средний рендер Full HD",
        "d": "По пяти принятым production-сэмплам 1080×1920."
      },
      {
        "v": "≈63с",
        "l": "полный рендер образа",
        "d": "Один подготовленный предмет: от изоляции до финального кадра."
      },
      {
        "v": "≈5,2м",
        "l": "пачка из пяти предметов",
        "d": "Пять разных вещей подряд."
      },
      {
        "v": "37",
        "l": "отобранных мастер-кадров",
        "d": "Подборка, заявленная в исходнике, не число изображений на этой странице."
      }
    ],
    "engineNote": "Могу создавать и модифицировать custom nodes в ComfyUI, писать Python pre/postprocessing, диагностировать точки отказа, оптимизировать VRAM и latency, фиксировать версии ComfyUI и нод, зеркалировать файлы моделей, поднимать окружение с нуля на Vast.ai и собирать функциональную API/queue/webhook-обвязку. Для крупных backend- и DevOps-систем делаю корректный handoff, а не выдаю себя за DevOps-инженера.",
    "latticeEyebrow": "КАРТА СИСТЕМЫ · 3D",
    "latticeTitle": "Каждый кадр проходит через один и тот же граф.",
    "latticeBody": "Слева изолируются исходники, в центре работает управляемая стадия, справа выходят только вручную одобренные кадры. Форма одна и та же — неважно, что на входе: одежда, блюдо, комната или часы. Именно это повторение и есть продукт.",
    "processEyebrow": "06 / С ЧЕГО НАЧНЁМ",
    "processTitle": "Ваши исходники.\nРабочее доказательство.",
    "process": [
      {
        "n": "01",
        "t": "Реальные исходники",
        "d": "Вы присылаете настоящие материалы клиента и явные критерии приёмки."
      },
      {
        "n": "02",
        "t": "Параллельные подходы",
        "d": "От одного до трёх технических путей проверяются на одной цели."
      },
      {
        "n": "03",
        "t": "Рабочая передача",
        "d": "Отобранные результаты, запускаемый ComfyUI workflow и технические заметки."
      },
      {
        "n": "04",
        "t": "Усиление",
        "d": "Стабильный API и production hardening оцениваются отдельно, когда нужны."
      }
    ],
    "contactEyebrow": "ТЕХНИЧЕСКИЙ ТЕСТ · СОПРОВОЖДЕНИЕ · R&D-ПАРТНЁР",
    "contactTitle": "Есть реальная GenAI-задача?\nДокажу подход на платном тесте.",
    "contactCta": "Начать с технического теста",
    "footerNote": "ComfyUI / Generative AI workflow engineering · 2026",
    "workPageTitle": "Кейсы",
    "workPageLede": "Все проекты в одном месте. Фильтруйте по направлению или ищите по технике.",
    "searchPlaceholder": "Поиск по кейсам, техникам, тегам…",
    "resultsOne": "кейс",
    "resultsMany": "кейсов",
    "emptyTitle": "Ничего не найдено",
    "emptyBody": "Попробуйте другое направление или очистите поиск.",
    "clearFilters": "Сбросить фильтры",
    "sortLabel": "Сортировка",
    "sortNewest": "Сначала новые",
    "sortOldest": "Сначала старые",
    "sortAz": "А → Я",
    "viewGrid": "Сетка",
    "viewList": "Список",
    "caseInput": "Исходник",
    "caseOutput": "Результат",
    "caseDrag": "Сравните полные изображения",
    "caseInputs": "Переданные исходники",
    "caseOutputs": "Готовые результаты",
    "caseGallery": "Полная галерея",
    "caseOverview": "Обзор",
    "caseMeta": "Детали",
    "caseBack": "Все кейсы",
    "caseNext": "Следующий кейс",
    "casePrev": "Предыдущий кейс",
    "openCase": "Открыть кейс",
    "viewFull": "Открыть в полном размере",
    "closeViewer": "Закрыть",
    "themeToggle": "Переключить тему",
    "langToggle": "Сменить язык",
    "caseNotFound": "Кейс не найден.",
    "caseNotFoundBody": "Возможно, он переименован или удалён. Посмотрите все работы."
  }
};


