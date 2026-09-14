# Northstar — Mikhail / Generative AI portfolio

A static portfolio with a dedicated case catalogue and reusable case pages.
No npm installation, build step, CDN, external fonts or tracking are required to view the site.

## Open the site

Extract the entire ZIP, then open `index.html`. Keep `assets/`, `js/` and `styles.css` beside it.
Do not open individual HTML files from inside the ZIP viewer.

Alternatively, from the extracted folder:

```bash
python -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000/`. JavaScript is required for the catalogue and case content; a contact fallback is shown when scripting is disabled.

## Pages

- `index.html`: introduction, selected work, comparisons, engineer profile and contact.
- `work.html`: all six case studies, category filters, bilingual search, sorting and grid/list views.
- `case.html?case=fashion-transfer`: individual case, source images, full-size viewer and comparisons.
- The other case IDs are `fashion-campaigns`, `hospitality`, `furniture`, `property` and `product-fidelity`.

## Add a future project

1. Put the actual source and output images in a new folder under `assets/`.
2. Open `js/data.js` and append an object to the `WORKS` array. Copy an existing case as a template.
3. Give it a unique `id`, display `index`, category, year, cover and EN/RU text.
4. Fill `compare`, `inputs`, `gallery`, `meta`, `metrics` and `sections` with your real evidence. Empty optional arrays are allowed.
5. Set `featured: true` only if it should appear on the homepage.

The catalogue counts, search and individual page use the same data. You do not need to create a separate HTML file for each project. Existing homepage cases have an editorial order in `js/home.js`; new featured entries appear after them.

Supported primary categories: `fashion`, `product`, `spaces`, `characters`.
An optional `categories` array adds secondary filters, e.g. `["product", "characters"]`.
Chronological sorting uses an optional ISO `date` field, otherwise `year`; equal dates retain the database order.

### Minimal example (replace every sample value)

```js
{
  id: "new-project",
  index: "07",
  category: "product",
  year: "2026",
  date: "2026-09-14",
  featured: false,
  accent: "#2f4cff",
  cover: "assets/new-project/cover.webp",
  coverAlt: { en: "Description of the actual image", ru: "Описание изображения" },
  ratio: "landscape",
  title: { en: "Project title", ru: "Название проекта" },
  tagline: { en: "Short description", ru: "Краткое описание" },
  summary: { en: "What was done and what was verified.", ru: "Что сделано и проверено." },
  tags: ["ComfyUI"],
  meta: [],
  metrics: [],
  compare: [],
  gallery: [],
  inputs: [],
  sections: []
}
```

Text is plain text, not HTML. Quote strings correctly and separate array entries with commas.
A comparison entry uses `input`, `output` and bilingual `label`. Gallery/input entries use `src` and bilingual `caption`; `size: "w"` spans two gallery columns on larger screens.

## Interaction and accessibility

- Light initial appearance; a saved dark preference is preserved. EN/RU and theme settings persist where browser storage is available.
- The project CTA opens the contact section, not the catalogue.
- Mobile navigation can be closed with the same toggle or Escape; keyboard focus stays inside the menu while it is open.
- Comparisons use a slider by default, with the output image aspect ratio and full-frame contain sizing centered on both layers. Drag and keyboard controls remain available. Each registered pair has a measured per-image similarity transform (scale, rotation and translation). The input is clipped to the output frame; the original files remain available in the full-size viewer. Registration cannot remove pose, perspective or locally generated geometry changes.
- Source and gallery images are native buttons, keyboard accessible. The full-size viewer supports Previous/Next and Escape, then restores focus.
- No artificial loading percentage or moving cursor targets. Earlier background implementations are retained; they are decorative, not evidence of a production system. Reduced-motion support is not a certified accessibility audit.

## Content integrity

These are independent synthetic studies, not commissioned brand campaigns. Brand disclaimers remain.
All 81 asset files from the supplied archive are retained. Public fashion campaign selection stays at five garment/scene pairs; the excluded teal outfit is not republished.
Timing, resolution and experience figures are source-reported, not independently benchmarked during this redesign. The original claim of 37 masters is not the number of image elements rendered on this website. Added unsupported perfect-fidelity claims and expanded delivery counts were removed.

## Files and verification

- `js/data.js`: bilingual content and case database.
- `js/app.js`: shared controls, localization, image viewer and comparison UI.
- `js/work.js`: validated URL/filter/search/sort state, including file-URL fallback.
- `js/case.js`: case rendering and public metadata.
- `js/home.js`: homepage sections and featured selection.
- `styles.css`: layout, typography, themes and responsive rules.
- `verification.json`: browser checks from the final acceptance run, with actual pass/fail values.
- `asset-integrity.json`: byte comparison against the original ZIP.
- `comparison-verification.json`: current native-ratio slider and viewer checks at mobile and desktop widths.

Browser checks target Chromium. They do not constitute Safari/Firefox coverage, a complete WCAG audit, a new generation benchmark or a deployment test. No emails/messages were sent; external contact services were not tested.

## Publish

Back up the existing repository first. Copy this folder's website files into the site root, preserving the `assets/`, `js/` and `.nojekyll` layout. Old root-level `app.js`, `design.js` and `positioning.js` are no longer referenced, so they do not need to be deleted for this version to work.

Deployment target: GitHub Pages, served from the repository main branch root. Public base:
`https://ekkonwork.github.io/northstar-portfolio-pages/`.
If moving hosts, update the HTML metadata and `BASE` in `js/case.js`.

Case-specific metadata is updated client-side; social crawlers that do not execute JavaScript will see the generic case preview. For unique social cards/search indexing per case, a later static-generation step is needed. Query-based case links work without host rewrite rules.
