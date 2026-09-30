/* Public curation only. Technical production records remain in the private repository. */
window.PORTFOLIO = {
  sections: [
    { id: 'virtual-try-on', page: 'vton.html', cover: '01_outerwear_umbrella_rain_night', number: '01', en: 'Virtual Try On', ru: 'Виртуальная примерка', noteEn: 'Garments in a new context, with their defining details in view.', noteRu: 'Одежда в новой среде, с вниманием к её узнаваемым деталям.' },
    { id: 'food-design', page: 'food.html', cover: '23_food_coffee_splash_motion', number: '02', en: 'Food Design', ru: 'Фуд-дизайн', noteEn: 'Food, drinks and the atmosphere around them.', noteRu: 'Еда, напитки и атмосфера вокруг них.' },
    { id: 'jewelry-watch', page: 'jewelry.html', cover: '13_jewelry_silver_ring_ice', number: '03', en: 'Jewelry & Watch', ru: 'Украшения и часы', noteEn: 'Material, shape and light at a smaller scale.', noteRu: 'Материал, форма и свет в крупном плане.' },
    { id: 'furniture', page: 'furniture.html', cover: '11_furniture_walnut_chair_hotel_lounge', number: '04', en: 'Furniture', ru: 'Мебель', noteEn: 'The same object, seen in spaces with different moods.', noteRu: 'Один предмет в пространствах с разным характером.' }
  ],
  groups: {
    'virtual-try-on': [
      { en: 'Outerwear', ru: 'Верхняя одежда', ids: ['47_outerwear_jacket_flatlay_hero40','01_outerwear_umbrella_rain_night','02_outerwear_snow_wide','03_outerwear_riverside','16_outerwear_station_concourse','33_outerwear_rain_hood_backview40'] },
      { en: 'Activewear', ru: 'Спортивная одежда', ids: ['49_bottoms_leggings_flatlay_hero40','04_bottoms_patterned_leggings_studio','05_bottoms_patterned_leggings_park','17_bottoms_patterned_leggings_rooftop','18_bottoms_patterned_leggings_loft_stretch','34_bottoms_activewear_city_run40'] },
      { en: 'Intimates', ru: 'Бельё', ids: ['51_intimates_plum_flatlay_linen40','06_intimates_plum_window','07_intimates_plum_studio_seated','19_intimates_plum_gym','20_intimates_plum_terrace'] },
      { en: 'Business editorial', ru: 'Деловые образы', ids: ['29_business_smart_casual_glass_boardroom40','30_business_smart_casual_atrium_commute40','54_business_smart_casual_boardroom_seated40','55_business_smart_casual_glass_corridor40','56_business_smart_casual_window_portrait40'] },
      { en: 'Loungewear editorial', ru: 'Домашние образы', ids: ['31_mens_loungewear_bedroom_morning40','32_mens_loungewear_terrace_coffee40','57_mens_loungewear_armchair_evening40','58_mens_loungewear_bedside_morning40'] }
    ],
    'food-design': [
      { en: 'Coffee', ru: 'Кофе', ids: ['08_food_takeaway_coffee_city','23_food_coffee_splash_motion'] },
      { en: 'At the café', ru: 'В кафе', ids: ['21_food_walnut_cafe_salmon','10_food_walnut_cafe_pappardelle','09_food_walnut_cafe_tart'] },
      { en: 'At the restaurant', ru: 'В ресторане', ids: ['22_food_lemon_tart_restaurant','39_food_pappardelle_candlelight_dining40'] },
      { en: 'Japanese table', ru: 'Японская кухня', ids: ['35_food_japanese_ramen_authentic40','36_food_japanese_sushi_slate40'] },
      { en: 'Bakery', ru: 'Пекарня', ids: ['37_food_artisan_croissant_bakery40'] },
      { en: 'The table', ru: 'Сервировка', ids: ['61_campaign_food_table_set40'] }
    ],
    'jewelry-watch': [
      { en: 'Silver ring', ru: 'Серебряное кольцо', ids: ['13_jewelry_silver_ring_ice','62_jewelry_ring_linen_fold40'] },
      { en: 'Blue dial watch', ru: 'Часы с синим циферблатом', ids: ['63_watches_blue_dial_packshot_full40','43_watches_blue_dial_ultramacro40','28_watches_blue_dial_studio_flatlay','15_watches_blue_dial_architecture','27_watches_blue_dial_car_interior','44_watches_blue_dial_lifestyle_dining40'] }
    ],
    furniture: [
      { en: 'The chair', ru: 'Кресло', ids: ['12_furniture_walnut_chair_studio','52_furniture_chair_packshot_studio40','53_furniture_chair_weave_macro40'] },
      { en: 'In a space', ru: 'В интерьере', ids: ['11_furniture_walnut_chair_hotel_lounge','24_furniture_walnut_chair_industrial_loft','25_furniture_walnut_chair_executive_office','40_furniture_walnut_chair_japandi_room40','41_furniture_walnut_chair_library_nook40','42_furniture_walnut_chair_hearth_evening40'] }
    ]
  },
  items: [
    { id: '01_outerwear_umbrella_rain_night', section: 'virtual-try-on', en: 'After the rain', ru: 'После дождя', noteEn: 'Outerwear / city night', noteRu: 'Верхняя одежда / вечерний город', source: 'jacket_phone_source.png' },
    { id: '02_outerwear_snow_wide', section: 'virtual-try-on', en: 'Winter crossing', ru: 'Зимний переход', noteEn: 'Outerwear / snow', noteRu: 'Верхняя одежда / снег', source: 'jacket_phone_source.png' },
    { id: '04_bottoms_patterned_leggings_studio', section: 'virtual-try-on', en: 'Movement study', ru: 'В движении', noteEn: 'Activewear / studio', noteRu: 'Спортивная одежда / студия', source: 'leggings_phone_source.png' },
    { id: '06_intimates_plum_window', section: 'virtual-try-on', en: 'Soft daylight', ru: 'Мягкий свет', noteEn: 'Intimates / window light', noteRu: 'Бельё / дневной свет', source: 'underwear_phone_source.png' },
    { id: '17_bottoms_patterned_leggings_rooftop', section: 'virtual-try-on', en: 'Open air', ru: 'На воздухе', noteEn: 'Activewear / rooftop', noteRu: 'Спортивная одежда / крыша', source: 'leggings_phone_source.png' },
    { id: '47_outerwear_jacket_flatlay_hero40', section: 'virtual-try-on', en: 'The jacket', ru: 'Куртка', noteEn: 'Garment / still life', noteRu: 'Одежда / натюрморт', source: 'jacket_phone_source.png' },
    { id: '51_intimates_plum_flatlay_linen40', section: 'virtual-try-on', en: 'Plum on linen', ru: 'Сливовый на льне', noteEn: 'Intimates / still life', noteRu: 'Бельё / натюрморт', source: 'underwear_phone_source.png' },

    { id: '23_food_coffee_splash_motion', section: 'food-design', en: 'Coffee in motion', ru: 'Кофе в движении', noteEn: 'Takeaway / campaign', noteRu: 'Кофе с собой / кампания', source: 'takeaway_coffee_pattern_phone_source.png' },
    { id: '08_food_takeaway_coffee_city', section: 'food-design', en: 'Coffee, to go', ru: 'Кофе с собой', noteEn: 'Takeaway / city', noteRu: 'Кофе с собой / город', source: 'takeaway_coffee_pattern_phone_source.png' },
    { id: '09_food_walnut_cafe_tart', section: 'food-design', en: 'A table for one', ru: 'Столик на одного', noteEn: 'Dessert / café', noteRu: 'Десерт / кафе', source: 'lemon_tart_restaurant_phone_source.png' },
    { id: '10_food_walnut_cafe_pappardelle', section: 'food-design', en: 'Lunch hour', ru: 'Время обеда', noteEn: 'Pasta / café', noteRu: 'Паста / кафе', source: 'pappardelle_restaurant_phone_source.png' },
    { id: '21_food_walnut_cafe_salmon', section: 'food-design', en: 'Morning ritual', ru: 'Утренний ритуал', noteEn: 'Breakfast / café', noteRu: 'Завтрак / кафе', source: 'salmon_toast_phone_source.png' },
    { id: '22_food_lemon_tart_restaurant', section: 'food-design', en: 'After dinner', ru: 'После ужина', noteEn: 'Dessert / restaurant', noteRu: 'Десерт / ресторан', source: 'lemon_tart_restaurant_phone_source.png' },

    { id: '13_jewelry_silver_ring_ice', section: 'jewelry-watch', en: 'On ice', ru: 'На льду', noteEn: 'Silver ring / lifestyle', noteRu: 'Серебряное кольцо / лайфстайл', source: 'silver_ring_phone_source.png' },
    { id: '15_watches_blue_dial_architecture', section: 'jewelry-watch', en: 'Blue hour', ru: 'Синий час', noteEn: 'Steel watch / architecture', noteRu: 'Стальные часы / архитектура', source: 'watch_phone_source.png' },
    { id: '27_watches_blue_dial_car_interior', section: 'jewelry-watch', en: 'In transit', ru: 'В пути', noteEn: 'Steel watch / lifestyle', noteRu: 'Стальные часы / лайфстайл', source: 'watch_phone_source.png' },
    { id: '43_watches_blue_dial_ultramacro40', section: 'jewelry-watch', en: 'Dial detail', ru: 'Детали циферблата', noteEn: 'Steel watch / detail', noteRu: 'Стальные часы / детали', source: 'watch_phone_source.png' },
    { id: '63_watches_blue_dial_packshot_full40', section: 'jewelry-watch', en: 'Blue dial', ru: 'Синий циферблат', noteEn: 'Steel watch / studio', noteRu: 'Стальные часы / студия', source: 'watch_phone_source.png' },

    { id: '11_furniture_walnut_chair_hotel_lounge', section: 'furniture', en: 'A quiet corner', ru: 'Тихий угол', noteEn: 'Lounge chair / hotel', noteRu: 'Кресло / отель', source: 'lounge_chair_phone_source.png' },
    { id: '12_furniture_walnut_chair_studio', section: 'furniture', en: 'The object itself', ru: 'Сам предмет', noteEn: 'Lounge chair / studio', noteRu: 'Кресло / студия', source: 'lounge_chair_phone_source.png' },
    { id: '24_furniture_walnut_chair_industrial_loft', section: 'furniture', en: 'Warm in the loft', ru: 'Тепло в лофте', noteEn: 'Lounge chair / interior', noteRu: 'Кресло / интерьер', source: 'lounge_chair_phone_source.png' },
    { id: '40_furniture_walnut_chair_japandi_room40', section: 'furniture', en: 'Quiet space', ru: 'Спокойное пространство', noteEn: 'Lounge chair / interior', noteRu: 'Кресло / интерьер', source: 'lounge_chair_phone_source.png' },
    { id: '53_furniture_chair_weave_macro40', section: 'furniture', en: 'Tactile detail', ru: 'Фактура вблизи', noteEn: 'Walnut & woven fabric', noteRu: 'Орех и плетёная ткань', source: 'lounge_chair_phone_source.png' },
    { id: '03_outerwear_riverside', section: 'virtual-try-on', en: 'By the river', ru: 'У реки', noteEn: 'Outerwear / overcast', noteRu: 'Верхняя одежда / пасмурный день', source: 'jacket_phone_source.png' },
    { id: '16_outerwear_station_concourse', section: 'virtual-try-on', en: 'Departure', ru: 'Отправление', noteEn: 'Outerwear / station', noteRu: 'Верхняя одежда / вокзал', source: 'jacket_phone_source.png' },
    { id: '33_outerwear_rain_hood_backview40', section: 'virtual-try-on', en: 'Rain from behind', ru: 'Навстречу дождю', noteEn: 'Outerwear / rear view', noteRu: 'Верхняя одежда / вид со спины', source: 'jacket_phone_source.png' },
    { id: '05_bottoms_patterned_leggings_park', section: 'virtual-try-on', en: 'Park path', ru: 'Аллея парка', noteEn: 'Activewear / outdoors', noteRu: 'Спортивная одежда / улица', source: 'leggings_phone_source.png' },
    { id: '18_bottoms_patterned_leggings_loft_stretch', section: 'virtual-try-on', en: 'Stretch', ru: 'Разминка', noteEn: 'Activewear / loft', noteRu: 'Спортивная одежда / лофт', source: 'leggings_phone_source.png' },
    { id: '34_bottoms_activewear_city_run40', section: 'virtual-try-on', en: 'City run', ru: 'Пробежка по городу', noteEn: 'Activewear / movement', noteRu: 'Спортивная одежда / движение', source: 'leggings_phone_source.png' },
    { id: '49_bottoms_leggings_flatlay_hero40', section: 'virtual-try-on', en: 'Pattern in full', ru: 'Узор целиком', noteEn: 'Activewear / still life', noteRu: 'Спортивная одежда / натюрморт', source: 'leggings_phone_source.png' },
    { id: '07_intimates_plum_studio_seated', section: 'virtual-try-on', en: 'Studio portrait', ru: 'Студийный портрет', noteEn: 'Intimates / studio', noteRu: 'Бельё / студия', source: 'underwear_phone_source.png' },
    { id: '19_intimates_plum_gym', section: 'virtual-try-on', en: 'After training', ru: 'После тренировки', noteEn: 'Intimates / studio gym', noteRu: 'Бельё / студия', source: 'underwear_phone_source.png' },
    { id: '20_intimates_plum_terrace', section: 'virtual-try-on', en: 'Terrace light', ru: 'Свет террасы', noteEn: 'Intimates / terrace', noteRu: 'Бельё / терраса', source: 'underwear_phone_source.png' },
    { id: '29_business_smart_casual_glass_boardroom40', section: 'virtual-try-on', en: 'Glass boardroom', ru: 'Переговорная', noteEn: 'Editorial / business', noteRu: 'Имиджевая съёмка / деловой стиль', source: 'w2_boardroom_glass_ref.png', referenceKind: 'scene' },
    { id: '30_business_smart_casual_atrium_commute40', section: 'virtual-try-on', en: 'Morning commute', ru: 'Утро в атриуме', noteEn: 'Editorial / business', noteRu: 'Имиджевая съёмка / деловой стиль', source: 'w2_atrium_daylight_ref.png', referenceKind: 'scene' },
    { id: '54_business_smart_casual_boardroom_seated40', section: 'virtual-try-on', en: 'At the table', ru: 'За столом', noteEn: 'Editorial / business', noteRu: 'Имиджевая съёмка / деловой стиль', source: 'w3_boardroom_seated_ref.png', referenceKind: 'scene' },
    { id: '55_business_smart_casual_glass_corridor40', section: 'virtual-try-on', en: 'Between meetings', ru: 'Между встречами', noteEn: 'Editorial / business', noteRu: 'Имиджевая съёмка / деловой стиль', source: 'w3_glass_corridor_ref.png', referenceKind: 'scene' },
    { id: '56_business_smart_casual_window_portrait40', section: 'virtual-try-on', en: 'Window portrait', ru: 'Портрет у окна', noteEn: 'Editorial / business', noteRu: 'Имиджевая съёмка / деловой стиль', source: 'w3_office_window_ref.png', referenceKind: 'scene' },
    { id: '31_mens_loungewear_bedroom_morning40', section: 'virtual-try-on', en: 'Slow morning', ru: 'Неспешное утро', noteEn: 'Editorial / loungewear', noteRu: 'Имиджевая съёмка / домашний стиль', source: 'w2_bedroom_soft_morning_ref.png', referenceKind: 'scene' },
    { id: '32_mens_loungewear_terrace_coffee40', section: 'virtual-try-on', en: 'Terrace coffee', ru: 'Кофе на террасе', noteEn: 'Editorial / loungewear', noteRu: 'Имиджевая съёмка / домашний стиль', source: 'w2_terrace_greenery_ref.png', referenceKind: 'scene' },
    { id: '57_mens_loungewear_armchair_evening40', section: 'virtual-try-on', en: 'Evening at home', ru: 'Домашний вечер', noteEn: 'Editorial / loungewear', noteRu: 'Имиджевая съёмка / домашний стиль', source: 'w3_evening_lounge_ref.png', referenceKind: 'scene' },
    { id: '58_mens_loungewear_bedside_morning40', section: 'virtual-try-on', en: 'First light', ru: 'Первые лучи', noteEn: 'Editorial / loungewear', noteRu: 'Имиджевая съёмка / домашний стиль', source: 'w3_bedside_morning_ref.png', referenceKind: 'scene' },
    { id: '35_food_japanese_ramen_authentic40', section: 'food-design', en: 'Ramen', ru: 'Рамен', noteEn: 'Japanese table / warm wood', noteRu: 'Японская кухня / тёплое дерево', source: 'w2_dark_timber_counter_ref.png', referenceKind: 'scene' },
    { id: '36_food_japanese_sushi_slate40', section: 'food-design', en: 'Sushi on slate', ru: 'Суши на сланце', noteEn: 'Japanese table / dark slate', noteRu: 'Японская кухня / тёмный сланец', source: 'w2_matte_black_slate_ref.png', referenceKind: 'scene' },
    { id: '37_food_artisan_croissant_bakery40', section: 'food-design', en: 'Bakery morning', ru: 'Утро в пекарне', noteEn: 'Pastry / morning light', noteRu: 'Выпечка / утренний свет', source: 'w2_bakery_warm_morning_ref.png', referenceKind: 'scene' },
    { id: '39_food_pappardelle_candlelight_dining40', section: 'food-design', en: 'Candlelit dinner', ru: 'Ужин при свечах', noteEn: 'Pasta / restaurant', noteRu: 'Паста / ресторан', source: 'pappardelle_restaurant_phone_source.png' },
    { id: '61_campaign_food_table_set40', section: 'food-design', en: 'A table to share', ru: 'Стол для компании', noteEn: 'Food / table setting', noteRu: 'Еда / сервировка', source: 'w3_cafetable_warm_ref.png', referenceKind: 'scene' },
    { id: '28_watches_blue_dial_studio_flatlay', section: 'jewelry-watch', en: 'Time in blue', ru: 'Время в синем', noteEn: 'Steel watch / studio', noteRu: 'Стальные часы / студия', source: 'watch_phone_source.png' },
    { id: '44_watches_blue_dial_lifestyle_dining40', section: 'jewelry-watch', en: 'Dinner hour', ru: 'Время ужина', noteEn: 'Steel watch / lifestyle', noteRu: 'Стальные часы / лайфстайл', source: 'watch_phone_source.png' },
    { id: '62_jewelry_ring_linen_fold40', section: 'jewelry-watch', en: 'On linen', ru: 'На льне', noteEn: 'Silver ring / detail', noteRu: 'Серебряное кольцо / детали', source: 'silver_ring_phone_source.png' },
    { id: '25_furniture_walnut_chair_executive_office', section: 'furniture', en: 'In the office', ru: 'В кабинете', noteEn: 'Lounge chair / office', noteRu: 'Кресло / кабинет', source: 'lounge_chair_phone_source.png' },
    { id: '41_furniture_walnut_chair_library_nook40', section: 'furniture', en: 'Reading nook', ru: 'Уголок для чтения', noteEn: 'Lounge chair / library', noteRu: 'Кресло / библиотека', source: 'lounge_chair_phone_source.png' },
    { id: '42_furniture_walnut_chair_hearth_evening40', section: 'furniture', en: 'By the fire', ru: 'У камина', noteEn: 'Lounge chair / evening', noteRu: 'Кресло / вечер', source: 'lounge_chair_phone_source.png' },
    { id: '52_furniture_chair_packshot_studio40', section: 'furniture', en: 'Form and texture', ru: 'Форма и фактура', noteEn: 'Lounge chair / studio', noteRu: 'Кресло / студия', source: 'lounge_chair_phone_source.png' }
  ]
};
