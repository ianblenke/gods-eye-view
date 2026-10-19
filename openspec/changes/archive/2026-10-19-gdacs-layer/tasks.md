## 1. Plan and specs

- [x] 1.1 Write the change plan.
- [x] 1.2 Write the delta spec for `gdacs-layer`.
- [x] 1.3 Change the count of the scenario `osh-033` to 36 in the delta spec for `osh`.
- [x] 1.4 Keep the scenario `osh-028` in the delta spec for `osh`.
- [x] 1.5 Keep the scenario `osh-029` in the delta spec for `osh`.
- [x] 1.6 Keep the scenario `osh-030` in the delta spec for `osh`.
- [x] 1.7 Keep the scenario `osh-031` in the delta spec for `osh`.
- [x] 1.8 Keep the scenario `osh-032` in the delta spec for `osh`.
- [x] 1.9 Keep the scenario `osh-046` in the delta spec for `osh`.
- [x] 1.10 Keep the scenario `osh-049` in the delta spec for `osh`.
- [x] 1.11 Keep the scenario `osh-057` in the delta spec for `osh`.
- [x] 1.12 Correct the plan after the plan review.
- [x] 1.13 Correct the specs and the plan after round 1 of the review.
- [x] 1.14 Correct the specs and the plan after round 2 of the review.

## 2. Tests

- [x] 2.1 Write `src/layers/gdacs/records.test.mjs` for `gdacs-layer-005`, `gdacs-layer-006`, `gdacs-layer-007`, `gdacs-layer-008` and `gdacs-layer-009`.
- [x] 2.2 Write `src/layers/gdacs/source.test.mjs` for `gdacs-layer-003` and `gdacs-layer-004`.
- [x] 2.3 Write `src/layers/gdacs/model.test.mjs` for `gdacs-layer-010` and `gdacs-layer-011`.
- [x] 2.4 Write `src/layers/gdacs/layer.test.mjs` for `gdacs-layer-001`, `gdacs-layer-002`, `gdacs-layer-012`, `gdacs-layer-013`, `gdacs-layer-014`, `gdacs-layer-015`, `gdacs-layer-016` and `gdacs-layer-017`.
- [x] 2.5 Write `src/layers/gdacs/registration.test.mjs` for `gdacs-layer-018`, `gdacs-layer-019`, `gdacs-layer-020`, `gdacs-layer-021` and `gdacs-layer-022`.
- [x] 2.6 Change the test of `osh-033` to expect 36 entries.
- [x] 2.7 Change the count of the registry to 36 in the test "production registry is exact, canonical, and rejects incomplete contracts".
- [x] 2.8 Make that test expect the next free token "00" from the real ledger.
- [x] 2.9 Make the samples of that test that need a free digit use the ledger without `gdacs`.
- [x] 2.10 Change the layer count of `src/app/constructCatalog.test.mjs` to 37 in its two tests.
- [x] 2.11 Change the layer count of `src/app/sourceComposition.test.mjs` to 37.
- [x] 2.12 Add the name "gdacs" to the list of `src/sources/reference.test.mjs`.
- [x] 2.13 Make the fixture rows of `src/data/layerStateTokenLedger.test.mjs` leave out the row of `gdacs`.
- [x] 2.14 Make the helper `writeCodecFixture` remove the registry entry of `gdacs`.
- [x] 2.15 Make the test of the complete ledger read all rows, count 36 rows and expect `gdacs` with "9".
- [x] 2.16 Make the fixture of the two-character test compare its ledger with the published ledger without `gdacs`.
- [x] 2.17 Add the samples of round 1 of the review to the tests.
- [x] 2.18 Add the samples of round 2 of the review to the tests.

## 3. Code

- [x] 3.1 Write `src/layers/gdacs/records.js`.
- [x] 3.2 Write `src/layers/gdacs/source.js`.
- [x] 3.3 Write `src/layers/gdacs/model.js`.
- [x] 3.4 Write `src/layers/gdacs/index.js`.
- [x] 3.5 Write `src/app/layers/gdacs.js`.
- [x] 3.6 Register the layer in the catalog.
- [x] 3.7 Register the source contract and the reference source.
- [x] 3.8 Register the share token "9" in the registry.
- [x] 3.9 Add the row of the layer to the ledger file.
- [x] 3.10 Add the layer to the group "Events".
- [x] 3.11 Add the layer to the layer names.
- [x] 3.12 Add the credit of the layer.
- [x] 3.13 Add the layer to `VOICE_OFF_LAYERS`.
- [x] 3.14 Add the Spanish and Russian texts.
- [x] 3.15 Add the new paths to `openspec/ownership.json`.
- [x] 3.16 Add the new paths to `scripts/format-scope.json`.
- [x] 3.17 Add the new paths to `scripts/package-boundaries.json`.
- [x] 3.18 Write the entry in `CHANGELOG.md`.
- [x] 3.19 Name the layer in the GDACS row and in the GDACS section of `DATA_SOURCES.md`.
- [x] 3.20 Add the second sentence of the disclaimer to the credit of the layer.

## 4. Evidence

- [x] 4.1 Run the named faults on the host.
- [x] 4.2 Run each test file on the host.
- [x] 4.3 Run the four checks of `make precheck` on the host.
- [x] 4.4 Run the STE lint on the host.
- [x] 4.5 Look at the layer in a headless Chrome with a stored document.

## 5. Lead work in the image

- [x] 5.1 Run `make ratchet CHANGE=gdacs-layer`.
- [ ] 5.2 Run the two review agents.
- [ ] 5.3 Write review.md.
- [ ] 5.4 Run `make gates CHANGE=gdacs-layer` on the final tree.
