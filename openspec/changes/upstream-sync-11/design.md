## Context

Base commit: `872006a5`, the merge of pull request 29 of the fork.
Upstream commit: `42559db10b6af9a9049fb78f24204cf036c4e807`, the head of `upstream/main` on 2026-11-19.
The shared ancestor is the commit `2bcdca1c9`, which sync 10 merged.

The clone `upstream-sync-11` holds the merge. It uses the image `gods-eye-view:sync11`, which the lead built from the merged lock file. The fork image `gods-eye-view:local` stays as it is.

## Goals / Non-Goals

**Goals:**
- Bring the upstream code into the fork with the fork layers, tokens and Docker files intact.
- Keep the two ratchet tests of the renderer boundary green with empty allow-lists.
- Keep every test file green, run one file at a time.

**Non-Goals:**
- Specs and tests for the new upstream code.
- A change of the upstream code, except for the files of the conflicts and the files that decisions D1 to D4 name.

## Decisions

### D1: Port the fork layers to the renderer ports

Upstream gives no exception to the ratchet. The rule 18 of `AGENTS.md` forbids to make a gate weaker. The change ports the fork layers.

- `gdacs`, `reticulum` and `beemaps` draw one point set with `drawOf(viewer).points(...)`.
- `beemapsBursts` draws one shape set of rectangles.
- `sceneLayer`, `skywatchScenes` and `up42Scenes` draw line sets for outlines, shape sets for fills, and a shape set for the UP42 images. The view centre comes from the query port. The module `src/layers/skywatchScenes/view.js` holds the code that the three layers share.
- `osh` draws one point set with `horizonCull`. The layer hands its labels to the overlay host, and it reads clicks through `inputFor(viewer).onClick`.
- The layers keep their ids, their share tokens and their texts.

The tests use `bindFakeCesiumCamera` and fake draw, query and input ports. The test viewer `src/testSupport/sceneViewer.mjs` serves the three scene layers.

The change adds the new imports of the ported layers to the packages `reticulum`, `beemaps`, `beemaps-bursts` and `osh-layer` in `scripts/package-boundaries.json`.

### D2: Share tokens

The check `scripts/check-layer-state-tokens.mjs` compares the registry with the published base of the fork. The tokens of the fork layers cannot change:

- `air-quality` 8, `gnss-integrity` 7, `osh-systems` 3 and `reticulum` 4.
- `beemaps` 5, `beemaps-bursts` 6 and `gdacs` 9.
- `s2-ghostmaps` 03, `skywatch-scenes` 00, `planet-scenes` 01, `skyfi-scenes` 02 and `up42-scenes` 04.

The seven new upstream layers get the next free tokens: `news` 05, `shipwrecks` 06, `rail` 07, `drone-airspace` 08, `sea-marks` 09, `ski-pistes` 0a and `wildlife-sightings` 0b. The next free token is 0c. The tests of the ledger use the one-character rows as the old ledger, and they remove `gdacs` where they need the last digit free.

### D3: HUD

Upstream rewrote the HUD as the Vue view `src/ui/views/IntelHudView.vue`, and it kept a classification banner. The fork rule says that the HUD shows no classification marking. The change removes the field `classification` from `src/hud.js` and the element from the view.

The view has no top bar. The scenario `hud-markings-003` named the three parts of the top bar, so the change retires it. The test file `src/hudMarkingsDom.test.mjs` is removed. The test `hud-markings-001` reads the view file too.

### D4: Start view and panels

Upstream starts from the whole planet (`START_VIEW`). The fork starts with a flight to Taiwan. `src/camera.js` keeps `TAIWAN_VIEW`, `flyToStartView` and `startApplicationView`, and they use the camera port. `src/app/controls.js` calls `startApplicationView`.

The panel of OSH moved from the removed template `src/ui/templates/context.html` into `index.html`, and `#osh-panel` is in `src/overlays/worldOverlayChrome.js`.
The tests of `startup-view-001` to `-005` and of `location-presets-003`, `-004`, `-007` and `-008` use the camera port and the published view of the location controls. They keep their scenarios.

### D5: New locales

Upstream has nine new locales: ar, de, fr, he, it, ja, pt, sv and uk. Each locale needs the 21 fork texts. The lead wrote them. The i18n script makes `zh-Hant.json` from the file `zh-CN.json`. Texts that equal the English text are in `same-as-english.json`. The files are in the packages `reticulum` and `osh-layer`.

### D6: Retired scenarios (rule 25)

The fork wrote backfill tests for upstream code. Upstream changed that code in this range, and the fork tests no longer match it. The merge takes the upstream tests of those files. The change keeps three fork test files, which pass: `src/director/document.forkBackfill.test.mjs`, `src/layers/ghostMaps/records.forkBackfill.test.mjs` and `src/layers/perimeters/cards.forkBackfill.test.mjs`. The change deletes the other fork backfill tests.

The change retires 202 scenarios in nine capabilities. The delta specs list them. After the archive, the lead adds the IDs to `openspec/trace/retired-ids.json` and removes their empty links from `openspec/trace/links.json`.
The scenario `coverage-gate-101` stays retired, because upstream rewrote `src/data/trafficTiming.test.mjs` and the new test runs in the process of the test runner.

The change also rewrites tests, and it keeps their scenarios:
- The test of `osh-033` counts 48 layers.
- The tests of `osh-061`, `osh-062` and `osh-073` read the draw set.
- The tests of the scene layers read draw sets instead of entities. The tests `up42-scene-overlay-009` to `-012` check the new order of the images.
- The tests of `credential-boundary-003` and `-005` skip the four build flags of vue-i18n.
- The test of `credential-boundary-006` skips test files.
- The tests of `credential-boundary-020` count one more request, because the search asks the status of the Nominatim route first.

### D7: Fragments of the changelog

Upstream fragments in `changelog.d/` use the numbers 1431 to 1438 too. The change renames the fork fragments `143x-up42-*.md` to `943x-up42-*.md`, so no number repeats.
