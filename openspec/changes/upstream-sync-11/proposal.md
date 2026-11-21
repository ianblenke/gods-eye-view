## Why

The owner asked on 2026-11-19 to refresh the fork from upstream.
Upstream has 2701 commits after the tenth sync, and its tree changed 4032 files since the shared ancestor `2bcdca1c9`.
The fork changed 2006 commits in the same time. 153 files changed on both sides.

Upstream added a renderer port. Code outside `src/render/cesium/` can no longer reach Cesium or the viewer. The allow-lists `src/render/cesiumAllowList.json` and `src/render/viewerAccessAllowList.json` are empty, and the ratchet tests `noCesiumOutsideRender` and `viewerAccess` fail for any new entry. Upstream also moved its views to Vue and removed the HTML templates.

## What Changes

- Merge the upstream commit `42559db10` in one merge. `design.md` gives the resolution of the 69 conflicts.
- Port nine fork layer files to the renderer ports. Then the two ratchet tests pass with the empty allow-lists. Decision D1 gives the rules.
  - The layers are `beemaps`, `beemapsBursts`, `gdacs`, `osh` and `reticulum`.
  - The other layers are `sceneLayer`, `skywatchScenes` and `up42Scenes`, with its file `images.js`.
- Keep the fork share tokens. Give the seven new upstream layers the tokens `05` to `0b`. Decision D2 gives the reason.
- Remove the classification banner of the new upstream HUD. Decision D3 gives the reason.
- Keep the Taiwan start flight on the camera port. Decision D4 gives the work.
- Add the 21 fork texts to the nine new locales. Decision D5 gives the limit.
- Retire 202 scenarios and change two. Decision D6 lists them.
- Change the gate scripts in three ways. Decision D8 gives the changes.
- Run the adopt command for each upstream file that the merge brings and that has a coverage gap.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `gdacs-layer` and `reticulum-layer`: the scenarios `gdacs-layer-019` and `reticulum-layer-018` name the neighbour layer in the panel group, because upstream layers now follow the fork layers.
- `coverage-gate`, `cyclones`, `ghostmaps`, `hud-markings`, `perimeters`, `recent-imagery`, `share-codec`, `voice-panel` and `wind`: scenarios are retired. Decision D6 gives the reason.

## Impact

Rule 23: the change adds two code files that the fork writes. `src/testSupport/sceneViewer.mjs` is a test viewer for the scene layers. `src/layers/skywatchScenes/view.js` lies in an owned folder. The change adds `sceneViewer.mjs` and three test files of the fork backfills to `openspec/ownership.json`. The other new files are upstream files.

Rule 25: the merge breaks tests with a scenario ID for upstream code. Decision D6 retires the scenarios, or writes them again. The change writes again the tests of `location-presets-003`, `-004`, `-007`, `-008` and `startup-view-001` to `-005`. It keeps their scenarios.

The change adds no layer, no route and no QA script of the fork.

## Known limits and later changes

- Known limit `share-links`: The fork does not decode the upstream share links of the seven new layers. The fork keeps its own tokens.
- Known limit `locales`: The lead wrote the 21 fork texts for the nine new locales. No native speaker checked them.
- Known limit `up42-image-alpha`: The UP42 image set draws opaque. The shape set has no alpha, so the old alpha of 0.85 is gone. The outlines do not draw over the images by a rule.
- Known limit `osh-labels`: The OSH layer shows at most 500 overlay labels. The old Cesium labels had no limit.
- Known limit `backfill`: The retired scenarios have no test. A later backfill change can write them for the new upstream code.
