## 1. Write the tests

- [ ] 1.1 Write the tests for `beemaps-frames-008`, `beemaps-frames-009` and `beemaps-frames-010` in `src/layers/beemaps/box.test.mjs`.
- [ ] 1.2 Write the tests for `beemaps-frames-014` and `beemaps-frames-015` in `src/layers/beemaps/records.test.mjs`.
- [ ] 1.3 Write the tests for `beemaps-frames-016` in `src/layers/beemaps/messages.test.mjs`.
- [ ] 1.4 Write the tests for `beemaps-frames-011`, `beemaps-frames-012` and `beemaps-frames-013` in `src/layers/beemaps/source.test.mjs`.
- [ ] 1.5 Write the tests for `beemaps-frames-017` and `beemaps-frames-018` in `src/layers/beemaps/model.test.mjs`.
- [ ] 1.6 Write the tests for `beemaps-frames-001`, `beemaps-frames-002`, `beemaps-frames-003`, `beemaps-frames-004`, `beemaps-frames-005`, `beemaps-frames-006` and `beemaps-frames-007` in `src/layers/beemaps/layer.test.mjs`.
- [ ] 1.7 Write the tests for `beemaps-frames-019`, `beemaps-frames-020`, `beemaps-frames-021`, `beemaps-frames-022` and `beemaps-frames-023` in the same file.
- [ ] 1.8 Write the tests for `beemaps-frames-024`, `beemaps-frames-025`, `beemaps-frames-026` and `beemaps-frames-027` in `src/layers/beemaps/registration.test.mjs`.
- [ ] 1.9 Change the count in the test `[osh-033]` in `src/data/layerState.test.mjs` to 32.
- [ ] 1.10 Carry the scenarios `osh-028`, `osh-029`, `osh-030`, `osh-031`, `osh-032`, `osh-046`, `osh-049`, `osh-057` and `osh-059` unchanged in the delta of `osh`.
- [ ] 1.11 Change the counts in the tests `src/app/constructCatalog.test.mjs`, `src/app/sourceComposition.test.mjs` and `src/sources/reference.test.mjs`.
- [ ] 1.12 Change the token ledger test `src/data/layerStateTokenLedger.test.mjs` for the token "5".

## 2. Write the files

- [ ] 2.1 Write `src/layers/beemaps/box.js`.
- [ ] 2.2 Write `src/layers/beemaps/records.js`.
- [ ] 2.3 Write `src/layers/beemaps/messages.js`.
- [ ] 2.4 Write `src/layers/beemaps/source.js`.
- [ ] 2.5 Write `src/layers/beemaps/model.js`.
- [ ] 2.6 Write `src/layers/beemaps/index.js`.
- [ ] 2.7 Write `src/app/layers/beemaps.js`.
- [ ] 2.8 Register the layer in `src/app/constructCatalog.js`, `src/app/sourceComposition.js` and `src/sources/reference.js`.
- [ ] 2.9 Register the token "5" in `src/data/layerState.js` and `src/data/layerStateTokenReservations.json`.
- [ ] 2.10 Add the layer to `src/ui/layerPanel.js`, `src/voice/layerManifest.js` and `src/data/dataCredits.js`.
- [ ] 2.11 Add the packages to `scripts/package-boundaries.json`.
- [ ] 2.12 Add the new files to `openspec/ownership.json` and `scripts/format-scope.json`.
- [ ] 2.13 Write the entry in `CHANGELOG.md` and the paragraph in `DATA_SOURCES.md`.

## 3. Check on the host and in the image

- [ ] 3.1 Run the tests of the pure files on the host.
- [ ] 3.2 Run the tests of the layer in the image.
- [ ] 3.3 Run the named faults of the layer.
- [ ] 3.4 Write `evidence/mutations.txt` with the result of each fault.
- [ ] 3.5 Run the layer in a real browser with a fake upstream behind the real route.
- [ ] 3.6 Write `evidence/browser-run.txt` with the output of that run.
- [ ] 3.7 Run the four checks of `make precheck` on the host.
- [ ] 3.8 Read the exit status of each check.
- [ ] 3.9 Run the STE lint on the host.
- [ ] 3.10 Run `openspec validate beemaps-frames` on the host.

## 4. Lead work in the image

- [ ] 4.1 Run `make ratchet CHANGE=beemaps-frames`.
- [ ] 4.2 Run the two review agents.
- [ ] 4.3 Write review.md.
- [ ] 4.4 Run `make gates CHANGE=beemaps-frames` on the final tree.
