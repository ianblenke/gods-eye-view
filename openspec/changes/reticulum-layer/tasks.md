## 1. Write the tests

- [ ] 1.1 Write the tests for `reticulum-layer-003` and `reticulum-layer-004` in `src/layers/reticulum/source.test.mjs`.
- [ ] 1.2 Write the tests for `reticulum-layer-005`, `reticulum-layer-006` and `reticulum-layer-007` in `src/layers/reticulum/records.test.mjs`.
- [ ] 1.3 Write the test for `reticulum-layer-008` in the same file.
- [ ] 1.4 Write the tests for `reticulum-layer-009` and `reticulum-layer-010` in `src/layers/reticulum/model.test.mjs`.
- [ ] 1.5 Write the tests for `reticulum-layer-001` and `reticulum-layer-002` in `src/layers/reticulum/layer.test.mjs`.
- [ ] 1.6 Write the tests for `reticulum-layer-011`, `reticulum-layer-012` and `reticulum-layer-013` in the same file.
- [ ] 1.7 Write the tests for `reticulum-layer-014`, `reticulum-layer-015` and `reticulum-layer-016` in the same file.
- [ ] 1.8 Write the tests for `reticulum-layer-017`, `reticulum-layer-018`, `reticulum-layer-019` and `reticulum-layer-020` in `src/layers/reticulum/registration.test.mjs`.

## 2. Write the files

- [ ] 2.1 Write `src/layers/reticulum/records.js`.
- [ ] 2.2 Write `src/layers/reticulum/source.js`.
- [ ] 2.3 Write `src/layers/reticulum/model.js`.
- [ ] 2.4 Write `src/layers/reticulum/index.js` and `src/app/layers/reticulum.js`.
- [ ] 2.5 Register the layer in the catalog, the source composition and the reference sources.
- [ ] 2.6 Register the share token, the panel group, the voice-off entry and the credit.
- [ ] 2.7 Add the package exports and the package boundaries.
- [ ] 2.8 Add the new files to `openspec/ownership.json` and `scripts/format-scope.json`.
- [ ] 2.9 Update the tests that count layers or pin the share token.
- [ ] 2.10 Write the entry in `CHANGELOG.md` and the paragraph in `DATA_SOURCES.md`.

## 3. Check on the host and in the image

- [ ] 3.1 Run the tests of the pure modules on the host.
- [ ] 3.2 Run the tests of the layer and the registrations in the image.
- [ ] 3.3 Run the whole unit suite in the image.
- [ ] 3.4 Run the named faults of the pure modules.
- [ ] 3.5 Run the named faults of the layer in the image.
- [ ] 3.6 Write `evidence/mutations.txt` with the result of each fault.
- [ ] 3.7 Run the visual check with the listener and a throwaway app container.
- [ ] 3.8 Write `evidence/visual-check.txt` with the output of the check.
- [ ] 3.9 Run the four checks of `make precheck` on the host.
- [ ] 3.10 Run the STE lint on the host.
- [ ] 3.11 Run `openspec validate reticulum-layer` on the host.

## 4. Lead work in the image

- [ ] 4.1 Run `make ratchet CHANGE=reticulum-layer`.
- [ ] 4.2 Run the two review agents.
- [ ] 4.3 Write review.md.
- [ ] 4.4 Run `make gates CHANGE=reticulum-layer` on the final tree.
