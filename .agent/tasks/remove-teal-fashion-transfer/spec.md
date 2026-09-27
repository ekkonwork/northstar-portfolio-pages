# remove-teal-fashion-transfer Spec

## Task

Remove the problematic teal/turquoise two-piece fashion transfer from the public portfolio in both EN and RU presentation, and keep the remaining campaign copy/counts internally consistent.

## Acceptance Criteria

- AC1. The teal/turquoise two-piece transfer row (garment source, yacht model input, and generated output) is removed from the rendered fashion-campaign portfolio.
- AC2. Fashion-campaign counts and descriptive copy no longer claim six garments/transfers or include the removed yacht/teal transfer, in both English and Russian UI.
- AC3. The remaining five fashion transfer rows are unchanged and positioning.js remains syntactically valid.
- AC4. The change is committed directly to main and the resulting GitHub Pages deployment succeeds.

## Constraints

- Do not publish workflow JSON/graphs or alter unrelated portfolio cases.
- Keep the diff minimal.
- Use the existing bilingual runtime architecture rather than rewriting app.js.

## Non-Goals

- Do not delete source image assets from repository history/assets.
- Do not redesign the fashion section.

## Verification

- Re-read positioning.js from main and verify selectors/copy.
- Verify the removed asset names are handled by the DOM-removal logic and five-transfer copy is applied for EN/RU.
- Verify JavaScript syntax by inspection/checking structure.
- Verify GitHub Pages workflow for the commit concludes success.
