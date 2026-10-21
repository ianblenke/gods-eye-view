## 1. Plan and specs

- [x] 1.1 Write the change plan.
- [x] 1.2 Write the delta spec for `skywatch-scenes-layer`.
- [x] 1.3 Change the count of the scenario `osh-033` to 37 in the delta spec for `osh`.
- [x] 1.4 Keep the scenario `osh-028` in the delta spec for `osh`.
- [x] 1.5 Keep the scenario `osh-029` in the delta spec for `osh`.
- [x] 1.6 Keep the scenario `osh-030` in the delta spec for `osh`.
- [x] 1.7 Keep the scenario `osh-031` in the delta spec for `osh`.
- [x] 1.8 Keep the scenario `osh-032` in the delta spec for `osh`.
- [x] 1.9 Keep the scenario `osh-046` in the delta spec for `osh`.
- [x] 1.10 Keep the scenario `osh-049` in the delta spec for `osh`.
- [x] 1.11 Keep the scenario `osh-057` in the delta spec for `osh`.
- [x] 1.12 Correct the plan after the plan review.

## 2. Tests

- [ ] 2.1 Write `src/layers/skywatchScenes/box.test.mjs` for `skywatch-scenes-layer-008`, `skywatch-scenes-layer-009`, `skywatch-scenes-layer-010` and `skywatch-scenes-layer-011`.
- [ ] 2.2 Write `src/layers/skywatchScenes/records.test.mjs` for `skywatch-scenes-layer-016` and `skywatch-scenes-layer-017`.
- [ ] 2.3 Write `src/layers/skywatchScenes/source.test.mjs` for `skywatch-scenes-layer-012`, `skywatch-scenes-layer-013`, `skywatch-scenes-layer-014`, `skywatch-scenes-layer-015` and `skywatch-scenes-layer-017`.
- [ ] 2.4 Write `src/layers/skywatchScenes/messages.test.mjs` for `skywatch-scenes-layer-018` and `skywatch-scenes-layer-019`.
- [ ] 2.5 Write `src/layers/skywatchScenes/model.test.mjs` for `skywatch-scenes-layer-020`, `skywatch-scenes-layer-021`, `skywatch-scenes-layer-022` and `skywatch-scenes-layer-023`.
- [ ] 2.6 Write `src/layers/skywatchScenes/layer.test.mjs` for `skywatch-scenes-layer-001`, `skywatch-scenes-layer-002`, `skywatch-scenes-layer-003`, `skywatch-scenes-layer-004`, `skywatch-scenes-layer-005`, `skywatch-scenes-layer-006` and `skywatch-scenes-layer-007`.
- [ ] 2.7 Add to `src/layers/skywatchScenes/layer.test.mjs` the tests for `skywatch-scenes-layer-008`, `skywatch-scenes-layer-009` and `skywatch-scenes-layer-011`.
- [ ] 2.8 Add to `src/layers/skywatchScenes/layer.test.mjs` the tests for `skywatch-scenes-layer-024`, `skywatch-scenes-layer-025`, `skywatch-scenes-layer-026`, `skywatch-scenes-layer-027` and `skywatch-scenes-layer-028`.
- [ ] 2.9 Add to `src/layers/skywatchScenes/layer.test.mjs` the tests for `skywatch-scenes-layer-029`, `skywatch-scenes-layer-030`, `skywatch-scenes-layer-031` and `skywatch-scenes-layer-032`.
- [ ] 2.10 Write `src/layers/skywatchScenes/registration.test.mjs` for `skywatch-scenes-layer-033`, `skywatch-scenes-layer-034`, `skywatch-scenes-layer-035`, `skywatch-scenes-layer-036` and `skywatch-scenes-layer-037`.
- [ ] 2.11 Change the test of `osh-033` to expect 37 entries.
- [ ] 2.12 Change the count of the registry to 37 in the test "production registry is exact, canonical, and rejects incomplete contracts".
- [ ] 2.13 Make that test expect the next free token "01" from the real ledger.
- [ ] 2.14 Make the samples of that test use the ledger without `gdacs` and `skywatch-scenes`.
- [ ] 2.15 Use "01" and "c.01" in the test of the layer lists that are not valid.
- [ ] 2.16 Change the layer count of `src/app/constructCatalog.test.mjs` to 38 in its two tests.
- [ ] 2.17 Change the layer count of `src/app/sourceComposition.test.mjs` to 38.
- [ ] 2.18 Add the name "skywatch-scenes" to the list of `src/sources/reference.test.mjs`.
- [ ] 2.19 Make the fixture rows of `src/data/layerStateTokenLedger.test.mjs` not include the row of `skywatch-scenes`.
- [ ] 2.20 Make the helper `writeCodecFixture` remove the registry entry of `skywatch-scenes`.
- [ ] 2.21 Make the test of the complete ledger count 37 rows.
- [ ] 2.22 Make the test of the complete ledger expect `skywatch-scenes` with "00".

## 3. Code

- [ ] 3.1 Write `src/layers/skywatchScenes/box.js`.
- [ ] 3.2 Write `src/layers/skywatchScenes/records.js`.
- [ ] 3.3 Write `src/layers/skywatchScenes/source.js`.
- [ ] 3.4 Write `src/layers/skywatchScenes/messages.js`.
- [ ] 3.5 Write `src/layers/skywatchScenes/model.js`.
- [ ] 3.6 Write `src/layers/skywatchScenes/index.js`.
- [ ] 3.7 Write `src/app/layers/skywatchScenes.js`.
- [ ] 3.8 Register the layer in the catalog, right after the layer `gdacs`.
- [ ] 3.9 Register the source contract and the reference source.
- [ ] 3.10 Register the share token "00" in the registry.
- [ ] 3.11 Add the row of the layer to the ledger file.
- [ ] 3.12 Add the layer to the group "Cameras", right after `recent-imagery`.
- [ ] 3.13 Add the layer to the layer names.
- [ ] 3.14 Add the credit of the layer.
- [ ] 3.15 Add the layer to `VOICE_OFF_LAYERS`.
- [ ] 3.16 Add the Spanish and Russian texts.
- [ ] 3.17 Add the new paths to `openspec/ownership.json`.
- [ ] 3.18 Add the new paths to `scripts/format-scope.json`.
- [ ] 3.19 Add the new paths to `scripts/package-boundaries.json`.
- [ ] 3.20 Make `scripts/qa-layer-token-twochar.mjs` use the next free token of two characters.
- [ ] 3.21 Update the paragraph about that QA script in `docs/CURRENT-STATE.md`.
- [ ] 3.22 Write the entry in `CHANGELOG.md`.
- [ ] 3.23 Name the layer in the SkyWatch section of `DATA_SOURCES.md`.

## 4. Evidence

- [ ] 4.1 Run the named faults on the host.
- [ ] 4.2 Run each test file on the host.
- [ ] 4.3 Run the four checks of `make precheck` on the host.
- [ ] 4.4 Run the STE lint on the host.
- [ ] 4.5 Look at the layer in a headless Chrome with a stored answer and a stored image.
- [ ] 4.6 Check the share link with "l=00" and a new page load in that headless Chrome.

## 5. Lead work in the image

- [ ] 5.1 Run `make ratchet CHANGE=skywatch-scenes-layer`.
- [ ] 5.2 Run the two review agents.
- [ ] 5.3 Write review.md.
- [ ] 5.4 Run `make gates CHANGE=skywatch-scenes-layer` on the final tree.
