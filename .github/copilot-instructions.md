# Clinical Study Extraction System – AI Agent Guide

## Big picture
- Single-page app inside `index.html`; HTML/CSS/JS are co-located. No bundler—open the file directly. Playwright tests live alongside but don’t participate in runtime.
- Three-panel layout (form / PDF / trace). Keep DOM ids/classes like `.linked-input`, `id="pdf-canvas"`, `id="trace-log"`, and validation markers—tests and JS logic depend on them.
- Global `AppState` stores PDF session info plus systematic review queues and databases (`sr_*` keys in localStorage). New state should be JSON-serialized and mirrored on load.

## Core modules
- `ExtractionManager` (instantiated as `extractionManager`) owns extraction records, undo stack, trace rendering, and persistence. Extend via existing hooks such as `addExtraction`, `updateStats`, `navigateToExtraction`, and remember to call `saveToLocalStorage()`.
- PDF flow: `loadPDF` → `extractAllText` → `renderPage`/`renderTextLayer` → `enableTextSelection` → `calculateBoundingBox` → `addExtractionMarker`. Preserve PDF.js viewport math when changing coordinates or zoom behavior.
- Systematic review helpers (`initializeRandomizedQueue`, `advanceQueue`, `updateSystematicReviewUI`, export functions) enforce randomized sequential gating. Never allow skipping `AppState.currentQueueIndex`; update `mainDatabase`, `traceDatabase`, and `articleProgress` together.
- Coordinate visualizer shares data via `VizState`, `openCoordinateVisualizer`, `loadVisualizerArticle`, and `getArticleExtractions`. Marker ids (`data-extraction-id`) link PDF overlays, trace entries, and visualizer—keep them stable.

## Conventions
- New form fields: add `.linked-input`, keep `id`/`name` consistent with step configs, update `getStepFields`, validation badges, and export serializers so AI, manual capture, and SR exports stay aligned.
- Status updates go through `showStatus(message, level)`; tests read the `extraction-status` status element. Provide meaningful copy for manual vs AI flows.
- LocalStorage keys in use: `gemini_api_key`, `sr_randomized_queue`, `sr_current_queue_index`, `sr_article_progress`, `sr_main_database`, `sr_trace_database`, `sr_completed_articles`. Keep load/save symmetry when altering schemas.
- Gemini integration (`aiExtractStep`, `buildPrompt`, `callGemini`) enforces a `MAX_AI_CHARACTERS` guard. On failures, surface `showStatus` warnings and do not mutate form fields.

## Testing & workflows
- Runtime has zero setup; for e2e coverage run:
  ```bash
  npm install
  npm run install:browsers
  npm test
  ```
  Tests under `tests/*.spec.js` use helpers in `tests/helpers/test-helpers.js` and expect `window.AppState`/`window.extractionManager` globals plus sample PDFs from `Articles/` matching `AppState.baseArticles`.

## Exports & compliance
- Export helpers (`exportJSON`, `exportCSV`, `exportAuditHTML`, `exportAnnotatedPDF`, `exportMainDatabase`, `exportTraceDatabase`, `exportSystematicReview`, `exportInteractiveMap`) all funnel through `downloadFile`. Include `documentName`, timestamps, field → value maps, and coordinate payloads in any new format to keep audit parity between per-article and review-wide reports.

Keep these contracts intact to avoid breaking Playwright automation, coordinate syncing, and sequential review guarantees.