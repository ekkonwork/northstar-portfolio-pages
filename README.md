# Mikhail — selected work

A static, bilingual editorial portfolio with four separate directions: Virtual Try On, Food Design, Jewelry & Watch, and Furniture. The home page presents the directions; each category page keeps its work in product-based series. Images are shown in full.

## Preview

```bash
python -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000/`.

## Content

- `index.html`: landing page and four direction links.
- `vton.html`, `food.html`, `jewelry.html`, `furniture.html`: dedicated portfolio sections.
- `css/editorial.css`, `js/editorial.js`: presentation and reference/result viewer.
- `js/curated.js`: the only public image selection and copy. Add or remove an item here to change the displayed portfolio.
- `assets/curated/`: selected final WebP images and their original product reference photos.
- `scripts/sync_curated_assets.ps1`: synchronises approved assets from the sibling private production repository using hardlinks on Windows. Run only in the local workspace; the site itself is static.
- `scripts/build_category_pages.ps1`: keeps the four category page shells in sync.

The rejected images and review reasons are in the **private** production repository under `review/rejected/` and `review/portfolio_curation_2026-09-30.json`. They are intentionally absent from this site.

Legacy `work.html` and `case.html` links redirect to the landing page. Historic assets and scripts remain in Git for now but are not loaded by the public pages.
