## 1. Plan and specs

- [ ] 1.1 Write the change plan.
- [ ] 1.2 Write the delta spec for `gdacs-layer`.
- [ ] 1.3 Change the count of the scenario `osh-033` to 36 in the delta spec for `osh`.
- [ ] 1.4 Keep the scenario `osh-028` in the delta spec for `osh`.
- [ ] 1.5 Keep the scenario `osh-029` in the delta spec for `osh`.
- [ ] 1.6 Keep the scenario `osh-030` in the delta spec for `osh`.
- [ ] 1.7 Keep the scenario `osh-031` in the delta spec for `osh`.
- [ ] 1.8 Keep the scenario `osh-032` in the delta spec for `osh`.
- [ ] 1.9 Keep the scenario `osh-046` in the delta spec for `osh`.
- [ ] 1.10 Keep the scenario `osh-049` in the delta spec for `osh`.
- [ ] 1.11 Keep the scenario `osh-057` in the delta spec for `osh`.

## 2. Tests

- [ ] 2.1 Write `src/layers/gdacs/records.test.mjs` for `gdacs-layer-005` to `gdacs-layer-009`.
- [ ] 2.2 Write `src/layers/gdacs/source.test.mjs` for `gdacs-layer-003` and `gdacs-layer-004`.
- [ ] 2.3 Write `src/layers/gdacs/model.test.mjs` for `gdacs-layer-010` and `gdacs-layer-011`.
- [ ] 2.4 Write `src/layers/gdacs/layer.test.mjs` for `gdacs-layer-001`, `gdacs-layer-002` and `gdacs-layer-012` to `gdacs-layer-017`.
- [ ] 2.5 Write `src/layers/gdacs/registration.test.mjs` for `gdacs-layer-018` to `gdacs-layer-022`.
- [ ] 2.6 Change the test of `osh-033` to expect 36 entries.
- [ ] 2.7 Change the layer counts of the upstream tests to 37 layers in the catalog and 36 entries in the registry.
- [ ] 2.8 Change the free token of the five tests of the token ledger from "9" to "00".

## 3. Code

- [ ] 3.1 Write `src/layers/gdacs/records.js`.
- [ ] 3.2 Write `src/layers/gdacs/source.js`.
- [ ] 3.3 Write `src/layers/gdacs/model.js`.
- [ ] 3.4 Write `src/layers/gdacs/index.js` and `src/app/layers/gdacs.js`.
- [ ] 3.5 Register the layer in the catalog, the source composition and the reference sources.
- [ ] 3.6 Register the share token "9" in the registry and in the ledger file.
- [ ] 3.7 Add the layer to the group "Events", to the layer names, to the credits and to `VOICE_OFF_LAYERS`.
- [ ] 3.8 Add the Spanish and Russian texts.
- [ ] 3.9 Add the new files to `openspec/ownership.json`, `scripts/format-scope.json` and `scripts/package-boundaries.json`.
- [ ] 3.10 Write the entry in `CHANGELOG.md` and the paragraph in `DATA_SOURCES.md`.

## 4. Evidence

- [ ] 4.1 Run the named faults on the host.
- [ ] 4.2 Run each test file on the host.
- [ ] 4.3 Run the four checks of `make precheck` and the lint on the host.
- [ ] 4.4 Look at the layer in a headless Chrome with a stored document.

## 5. Lead work in the image

- [ ] 5.1 Run `make ratchet CHANGE=gdacs-layer`.
- [ ] 5.2 Run the two review agents.
- [ ] 5.3 Write review.md.
- [ ] 5.4 Run `make gates CHANGE=gdacs-layer` on the final tree.
