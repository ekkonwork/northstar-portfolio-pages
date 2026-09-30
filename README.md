# Mikhail — selected work

A static, bilingual portfolio with four separate directions: Virtual Try On, Food Design, Jewelry & Watch, and Furniture. A spatial gallery opens the home page; the category pages keep the 38 selected images in product-based series. Gallery and reference images are shown in full.

## Visual design

The interface combines a warm light background, graphite typography and an electric blue accent. The home scene contains two photographic prints in CSS perspective and a reflective sculpture rendered directly with WebGL. The canvas redraws on resize and pointer input, stops when hidden, and is capped at 540 pixels on its longest side. No 3D library, downloaded model or continuous render loop is required. The photographs and links remain usable without WebGL.

Cross-document navigation uses progressive [CSS View Transitions](https://developer.chrome.com/docs/web-platform/view-transitions/cross-document). Browsers without support use ordinary navigation. Reduced motion disables the transitions, scroll animation, reveal motion and pointer parallax. Category pages include series navigation, image counts and a reference/result viewer with previous/next controls, arrow keys, Escape and focus restoration.

## Preview

```bash
python -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000/`.

## Content

- `index.html`: landing page and four direction links.
- `vton.html`, `food.html`, `jewelry.html`, `furniture.html`: dedicated portfolio sections.
- `css/editorial.css`, `js/editorial.js`: presentation and reference/result viewer.
- `js/spatial.js`: WebGL sculpture, pointer depth, progressive reveals and scroll progress.
- `js/curated.js`: the only public image selection and copy. Add or remove an item here to change the displayed portfolio.
- `assets/curated/`: selected final WebP images and their original product reference photos.
- `scripts/sync_curated_assets.ps1`: synchronises approved assets from the sibling private production repository using hardlinks on Windows. Run only in the local workspace; the site itself is static.
- `scripts/build_category_pages.ps1`: keeps the four category page shells in sync.

The rejected images and review reasons are in the **private** production repository under `review/rejected/` and `review/portfolio_curation_2026-09-30.json`. They are intentionally absent from this site.

Legacy `work.html` and `case.html` links redirect to the landing page. Historic assets and scripts remain in Git for now but are not loaded by the public pages.
