# Mikhail — selected work

A static, bilingual portfolio with four separate directions: Virtual Try On, Food Design, Jewelry & Watch, and Furniture. The home page is an interactive exhibition of four visual worlds. The category pages keep all 38 approved images in clear product series, with their original references. Photographs are always fitted in full.

## Visual design

Warm alabaster, graphite and a vermilion accent support large editorial typography. Each home chapter has its own atmosphere, an approved final photograph and the exact original product photograph. Four keyboard-accessible tabs change the exhibition. Both photographs are decoded before a chapter appears; rapidly switching tabs cannot insert an outdated image. Category previews form four aligned rows with two photographs each.

The spatial exhibition uses CSS perspective and a reflective sculpture rendered directly with WebGL. Photo planes and sculpture share one eased pointer pose: entry ramps in over 240 ms, exit returns gently to neutral, and animation stops when settled, offscreen or hidden. Idle time never becomes a large first-frame timestep. Prints keep their stacking order. The canvas is capped at 540 pixels on its longest side. No 3D library, downloaded model or perpetual render loop is required. Photographs and links remain usable without WebGL.

Cross-document navigation uses progressive [CSS View Transitions](https://developer.chrome.com/docs/web-platform/view-transitions/cross-document). Browsers without support use ordinary navigation. Reduced motion disables transitions, scroll animation, reveal motion and pointer parallax. Category pages include sticky series navigation, a strip of original references and a fullscreen viewer. Choose comparison, result or reference; use previous/next controls, arrow keys and Escape. Closing the viewer restores focus. Mobile layouts retain all four sections, full photographs and comparison tools.

Small accent text uses a darker red than the large display typography. Small text colors meet 4.5:1 against the paper background; large orange display text meets 3:1. Page shells share a resource version to prevent old scripts from being combined with new styles. Each direction has its own social preview.

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
- `js/image-sizes.js`: original dimensions, used to reserve image space before loading.
- `js/curated.js`: the only public image selection and copy. Add or remove an item here to change the displayed portfolio.
- `assets/curated/`: selected final WebP images and their original product reference photos.
- `scripts/sync_curated_assets.ps1`: synchronises approved assets from the sibling private production repository using hardlinks on Windows. Run only in the local workspace; the site itself is static.
- `scripts/build_category_pages.ps1`: keeps the four category page shells in sync.
- `scripts/build_image_sizes.py`: reads original image dimensions with Pillow, without changing the photographs. Run after changing the selected assets.
- `scripts/build_reference_previews.py`: creates smaller WebP display copies of the source photographs for the site. Original PNG files stay untouched and can be opened from the reference viewer. These display copies only resize and encode the photograph; no retouching or compositing is performed.

## Verification

```bash
node tests/content.mjs
node tests/spatial-motion.mjs
python scripts/build_image_sizes.py --check
```

The content check covers the approved selection, series coverage, references, dimensions, local links and resource versions. The motion test executes the actual scene script with controlled frame timing, checking edge entry, exit/re-entry, restart after idle, CSS/WebGL synchronization, visibility, reduced motion, touch and the absence of an idle render loop. Browser inspection is still required for visual changes.

When releasing CSS or JavaScript changes, update the resource version in `index.html` and `scripts/build_category_pages.ps1`, then regenerate the category pages. Commit directly to the configured publishing branch.

The rejected images and review reasons are in the **private** production repository under `review/rejected/` and `review/portfolio_curation_2026-09-30.json`. They are intentionally absent from this site.

Legacy `work.html` and `case.html` links redirect to the landing page. Historic assets and scripts remain in Git for now but are not loaded by the public pages.
