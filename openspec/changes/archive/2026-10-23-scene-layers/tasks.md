## 1. Write the tests

- [x] 1.1 Write the tests for `scene-layers-014` and `scene-layers-015` in `src/layers/sceneLayer/records.test.mjs`.
- [x] 1.2 Write the tests for `scene-layers-016` and `scene-layers-017` in `src/layers/sceneLayer/messages.test.mjs`.
- [x] 1.3 Write the tests for `scene-layers-018`, `scene-layers-019`, `scene-layers-020` and `scene-layers-021` in `src/layers/sceneLayer/model.test.mjs`.
- [x] 1.4 Write the tests for `scene-layers-010`, `scene-layers-011`, `scene-layers-012` and `scene-layers-013` in `src/layers/sceneLayer/source.test.mjs`.
- [x] 1.5 Write the tests for `scene-layers-001`, `scene-layers-002`, `scene-layers-003`, `scene-layers-004` and `scene-layers-005` in `src/layers/sceneLayer/layer.test.mjs`.
- [x] 1.6 Write the tests for `scene-layers-006`, `scene-layers-007`, `scene-layers-008`, `scene-layers-009` and `scene-layers-036` in the same file.
- [x] 1.7 Write the tests for `scene-layers-022`, `scene-layers-023`, `scene-layers-024`, `scene-layers-025` and `scene-layers-026` in the same file.
- [x] 1.8 Write the tests for `scene-layers-027`, `scene-layers-028`, `scene-layers-029` and `scene-layers-030` in the same file.
- [x] 1.9 Write the tests for `scene-layers-031`, `scene-layers-032`, `scene-layers-033`, `scene-layers-034` and `scene-layers-035` in `src/layers/sceneLayer/registration.test.mjs`.
- [x] 1.10 Edit `src/data/layerState.test.mjs` for the tokens "01" and "02".
- [x] 1.11 Edit `src/data/layerStateTokenLedger.test.mjs` for the tokens "01" and "02".
- [x] 1.12 Edit `src/app/constructCatalog.test.mjs` for the two layers.
- [x] 1.13 Edit `src/app/sourceComposition.test.mjs` for the two source contracts.
- [x] 1.14 Edit `src/sources/reference.test.mjs` for the two sources.

## 2. Write the files

- [x] 2.1 Write `src/layers/sceneLayer/services.js`.
- [x] 2.2 Write `src/layers/sceneLayer/records.js`.
- [x] 2.3 Write `src/layers/sceneLayer/messages.js`.
- [x] 2.4 Write `src/layers/sceneLayer/model.js`.
- [x] 2.5 Write `src/layers/sceneLayer/source.js`.
- [x] 2.6 Write `src/layers/sceneLayer/index.js`.
- [x] 2.7 Write `src/app/layers/sceneLayers.js`.
- [x] 2.8 Register the two layers in `src/app/constructCatalog.js`.
- [x] 2.9 Register the two sources in `src/sources/reference.js`.
- [x] 2.10 Add the two source contracts in `src/app/sourceComposition.js`.
- [x] 2.11 Add the tokens "01" and "02" in `src/data/layerState.js`.
- [x] 2.12 Add the tokens "01" and "02" in `src/data/layerStateTokenReservations.json`.
- [x] 2.13 Add the two layers to the group "Cameras" in `src/ui/layerPanel.js`.
- [x] 2.14 Add the two names in `src/ui/layerNames.js`.
- [x] 2.15 Add the two layers to `src/voice/layerManifest.js`.
- [x] 2.16 Add the two credits in `src/data/dataCredits.js`.
- [x] 2.17 Add the Spanish texts in `src/i18n/locales/es.json`.
- [x] 2.18 Add the Russian texts in `src/i18n/locales/ru.json`.
- [x] 2.19 Correct the comment about the free token in `scripts/qa-layer-token-twochar.mjs`.
- [x] 2.20 Add the new code files and test files to `openspec/ownership.json`.
- [x] 2.21 Add the new code files and test files to `scripts/format-scope.json`.
- [x] 2.22 Add the new code files and test files to `scripts/package-boundaries.json`.
- [x] 2.23 Format the new code files with Prettier.
- [x] 2.24 Write the entry in `CHANGELOG.md`.
- [x] 2.25 Write the paragraph in `DATA_SOURCES.md`.
- [x] 2.26 Write the paragraph in `docs/CURRENT-STATE.md`.

## 3. Check on the host

- [x] 3.1 Run the six test files of the shared module with coverage on the host.
- [x] 3.2 Run both layers in a Chrome for Testing with a fake upstream.
- [x] 3.3 Write `evidence/browser.txt` with the result of the run.
- [x] 3.4 Run each named test against its fault.
- [x] 3.5 Write `evidence/faults.txt` with the result of each fault.
- [x] 3.6 Run each test file on the host.
- [x] 3.7 Run the four checks of `make precheck` on the host.
- [x] 3.8 Run the STE lint on the host.
- [x] 3.9 Run `openspec validate scene-layers --strict` on the host.

## 4. Lead work in the image

- [x] 4.1 Run `make ratchet CHANGE=scene-layers`.
- [ ] 4.2 Run the two review agents.
- [ ] 4.3 Write review.md.
- [ ] 4.4 Run `make gates CHANGE=scene-layers` on the final tree.
