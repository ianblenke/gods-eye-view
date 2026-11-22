## Why

The owner asked on 2026-11-19 to refresh the fork from upstream.
Upstream has 2701 commits after the tenth sync. Its tree has 4032 changed files since the shared ancestor `2bcdca1c9`. The second merge brings 116 more commits.
The fork has 2006 new commits in the same time. 153 files changed on both sides.

Upstream added a renderer port. Code outside `src/render/cesium/` can no longer reach Cesium or the viewer. The allow-lists `src/render/cesiumAllowList.json` and `src/render/viewerAccessAllowList.json` are empty. The boundary tests `noCesiumOutsideRender` and `viewerAccess` fail for any new entry. Upstream also moved its views to Vue and removed the HTML templates.

## What Changes

- Merge the upstream commit `42559db10` and then the later commit `7f2dc81cf`. `design.md` gives the resolution of the 69 conflicts of the first merge. The second merge has 9 conflicts in the package boundaries and the locale files.
- Move nine fork layer files to the renderer ports. Then the two boundary tests pass with the empty allow-lists. Decision D1 gives the rules.
  - The layers are `beemaps`, `beemapsBursts`, `gdacs`, `osh` and `reticulum`.
  - The other layers are `sceneLayer`, `skywatchScenes` and `up42Scenes`. The file `images.js` of `up42Scenes` moves too.
- Keep the fork share tokens. Give the seven new upstream layers the tokens `05` to `0b`. Decision D2 gives the reason.
- Remove the classification banner of the new upstream HUD. Decision D3 gives the reason.
- Keep the Taiwan start flight on the camera port. Decision D4 gives the work.
- Add the 21 fork texts to the nine new locales. Decision D5 gives the limit.
- Retire 196 scenarios and change the text of twelve scenarios. Decision D6 lists them.
- Change the gate scripts in four ways. Decision D8 gives the changes.
- Add the backfill scenarios `cable-bundled-source-001` and `cockpit-contact-dot-001` for two upstream files.
- Run the adopt command for each upstream file that the merge brings and that has a coverage gap.

## Capabilities

### New Capabilities

- `cable-bundled-source`: the bundled cable source reads its two files with the global fetch function.
- `cockpit-contact-dot`: the cockpit draws the image of the contact dot once.

### Modified Capabilities

- `gdacs-layer` and `reticulum-layer`: the scenarios `gdacs-layer-019` and `reticulum-layer-018` name the layer next to the fork layer in the panel group. Upstream layers now follow the fork layers.
- `osh`: the scenarios `osh-033`, `osh-061` and `osh-062` say what the tests prove after the move. The registry has 48 entries. The renderer hides the points beyond the horizon.
- `up42-scene-overlay`: the scenarios `up42-scene-overlay-009`, `-010` and `-011` say what the tests prove after the move. The fill is opaque, and the newest image draws last.
- `hud-markings`: the scenario `hud-markings-001` has no line about a top bar.
- `credential-boundary`: the scenarios `credential-boundary-003`, `-005` and `-006` name the four flags of vue-i18n and the test files that the checks skip.
- `coverage-gate` and `spec-trace`: the gate has four new rules. Decision D8 gives them.
- `cyclones`, `ghostmaps`, `perimeters`, `recent-imagery`, `share-codec`, `voice-panel` and `wind`: Decision D6 retires scenarios of these capabilities and gives the reason.

## Impact

Rule 23: the change adds one code file that the fork writes: `src/testSupport/sceneViewer.mjs`. It is a test viewer for the scene layers. The file `src/layers/skywatchScenes/view.js` lies in an owned folder. The change adds `sceneViewer.mjs` and the new test files of the fork to `openspec/ownership.json`. The other new files are upstream files.

Rule 25: the merge breaks tests with a scenario ID for upstream code. Decision D6 retires the scenarios, or writes them again. The change writes again the tests of `location-presets-003`, `-004`, `-007`, `-008` and `startup-view-001` to `-005`. It keeps their scenarios.

The change adds no layer, no route and no QA script of the fork.

## Known limits and later changes

- Known limit `share-links`: An upstream share link can enable a wrong layer in the fork. The fork keeps its own tokens. Upstream gave the seven new layers the tokens `00`, `01`, `02`, `8`, `6`, `7` and `9`. The fork gave those tokens to other layers. Upstream also gave `air-quality`, `gnss-integrity` and `s2-ghostmaps` the tokens `4`, `3` and `5`. The fork gave those tokens to other layers.
- Known limit `locales`: The lead wrote the 21 fork texts for the nine new locales. No native speaker checked them.
- Known limit `up42-image-alpha`: The UP42 image set draws opaque. The shape set has no alpha, so the old alpha of 0.85 is gone. No rule puts the outlines above the images.
- Known limit `osh-labels`: The OSH layer shows at most 500 overlay labels. The old Cesium labels had no limit.
- Known limit `osh-horizon`: The renderer hides the OSH points beyond the horizon. No test of the fork shows that the renderer hides them. The layer sets `horizonCull`, and the tests check its value.
- Known limit `cesium-words`: Some scenarios of `reticulum-layer`, `gdacs-layer`, `up42-scenes-layer`, `beemaps-frames` and `beemaps-bursts` still use words of Cesium, for example "entity". The moved tests check the same behavior through the draw port. A later change can write the scenarios again.
- Known limit `leak-record`: The record `openspec/trace/upstream-test-findings.json` gives no error for a live timer in 114 upstream test files. The record has no end date. The gate gives no stale error for a leak, because the run time decides whether a leak occurs. The file `src/data/trafficTiming.test.mjs` has a fork edit and is not in the ownership manifest, so the gate treats it as an upstream file.
- Known limit `backfill`: The retired scenarios have no test. A later backfill change can write them for the new upstream code.
