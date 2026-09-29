# Mikhail — selected work

A static, bilingual editorial portfolio for four directions: Virtual Try On, Food Design, Jewelry & Watch, and Furniture.

## Preview

```bash
python -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000/`.

## Content

- `index.html`, `css/editorial.css`, `js/editorial.js`: presentation and reference/result viewer.
- `js/curated.js`: the only public image selection and copy. Add or remove an item here to change the displayed portfolio.
- `assets/curated/`: selected final WebP images and their original product reference photos.
- `scripts/sync_curated_assets.ps1`: synchronises approved assets from the sibling private production repository using hardlinks on Windows. Run only in the local workspace; the site itself is static.

The rejected images and review reasons are in the **private** production repository under `review/rejected/` and `review/portfolio_curation_2026-09-30.json`. They are intentionally absent from this site.

Legacy URLs (`work.html`, `case.html` and the four category pages) redirect to the new catalogue. Historic assets and scripts remain in Git for now but are not loaded by the public pages.
