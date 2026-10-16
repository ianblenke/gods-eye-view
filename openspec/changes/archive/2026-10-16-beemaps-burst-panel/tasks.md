## 1. Write the tests

- [x] 1.1 Write the tests for `beemaps-bursts-008` (the box part) in `src/layers/beemapsBursts/box.test.mjs`.
- [x] 1.2 Write the tests for `beemaps-bursts-022`, `beemaps-bursts-023` and `beemaps-bursts-025` (the validation of the answers) in `src/layers/beemapsBursts/records.test.mjs`.
- [x] 1.3 Write the tests for `beemaps-bursts-008`, `beemaps-bursts-014`, `beemaps-bursts-016` and `beemaps-bursts-027` (the texts) in `src/layers/beemapsBursts/messages.test.mjs`.
- [x] 1.4 Write the tests for `beemaps-bursts-021`, `beemaps-bursts-022`, `beemaps-bursts-023`, `beemaps-bursts-024` and `beemaps-bursts-025` in `src/layers/beemapsBursts/source.test.mjs`.
- [x] 1.5 Write the tests for `beemaps-bursts-007`, `beemaps-bursts-018` (the text), `beemaps-bursts-020` and `beemaps-bursts-026` in `src/layers/beemapsBursts/model.test.mjs`.
- [x] 1.6 Write the tests for `beemaps-bursts-001`, `beemaps-bursts-002`, `beemaps-bursts-004`, `beemaps-bursts-005`, `beemaps-bursts-006`, `beemaps-bursts-007`, `beemaps-bursts-008`, `beemaps-bursts-009` and `beemaps-bursts-010` in `src/layers/beemapsBursts/layer.test.mjs`.
- [x] 1.7 Write the tests for `beemaps-bursts-011`, `beemaps-bursts-012`, `beemaps-bursts-013`, `beemaps-bursts-014`, `beemaps-bursts-015`, `beemaps-bursts-016`, `beemaps-bursts-017`, `beemaps-bursts-029` and `beemaps-bursts-030` in the same file.
- [x] 1.8 Write the tests for `beemaps-bursts-018`, `beemaps-bursts-019` and `beemaps-bursts-020` in the same file.
- [x] 1.9 Write the tests for `beemaps-bursts-003`, `beemaps-bursts-020` and `beemaps-bursts-028` in `src/layers/beemapsBursts/registration.test.mjs`.
- [x] 1.10 Change the registry counts from 32 to 33 in `src/data/layerState.test.mjs`: the test `[osh-033]` and the test of the production registry.
- [x] 1.11 Carry the scenarios `osh-028`, `osh-029`, `osh-030`, `osh-031`, `osh-032`, `osh-046`, `osh-049` and `osh-057` unchanged in the delta of `osh`.
- [x] 1.12 Change the test `[beemaps-frames-025]` in `src/layers/beemaps/registration.test.mjs` to the new end of the group Cameras.
- [x] 1.13 Carry the scenarios `beemaps-frames-024`, `beemaps-frames-026` and `beemaps-frames-027` unchanged in the delta of `beemaps-frames`.
- [x] 1.14 Change the counts in `src/app/constructCatalog.test.mjs` and `src/app/sourceComposition.test.mjs`.
- [x] 1.15 Add the key "beemaps-bursts" to the key list in `src/sources/reference.test.mjs`.
- [x] 1.16 Change the next free token, the counts and the length of `l` in `src/data/layerStateTokenLedger.test.mjs`.

## 2. Write the files

- [x] 2.1 Write `src/layers/beemapsBursts/box.js`.
- [x] 2.2 Write `src/layers/beemapsBursts/records.js`.
- [x] 2.3 Write `src/layers/beemapsBursts/messages.js`.
- [x] 2.4 Write `src/layers/beemapsBursts/source.js`.
- [x] 2.5 Write `src/layers/beemapsBursts/model.js`.
- [x] 2.6 Write `src/layers/beemapsBursts/index.js`.
- [x] 2.7 Write `src/app/layers/beemapsBursts.js`.
- [x] 2.8 Register the layer in `src/app/constructCatalog.js`, `src/app/sourceComposition.js` and `src/sources/reference.js`.
- [x] 2.9 Register the token "6" in `src/data/layerState.js` and `src/data/layerStateTokenReservations.json`.
- [x] 2.10 Add the layer to `src/ui/layerPanel.js`, `src/voice/layerManifest.js` and `src/data/dataCredits.js`.
- [x] 2.11 Add the packages to `scripts/package-boundaries.json`.
- [x] 2.12 Add the two exports of the layer to `package.json`.
- [x] 2.13 Add the new files to `openspec/ownership.json` and `scripts/format-scope.json`.
- [x] 2.14 Write the entry in `CHANGELOG.md`.
- [x] 2.15 Write the paragraph in `DATA_SOURCES.md`.

## 3. Check on the host and in the image

- [x] 3.1 Run the tests of the pure files on the host.
- [x] 3.2 Run the tests of the layer in the image.
- [x] 3.3 Run `node scripts/check-package-boundaries.mjs`.
- [x] 3.4 Run `node scripts/check-import-directions.mjs`.
- [x] 3.5 Run `node scripts/format.mjs --check`.
- [x] 3.6 Run `make lint`.
- [x] 3.7 Run `openspec validate beemaps-burst-panel --strict`.
- [x] 3.8 Run the named faults of the layer.
- [x] 3.9 Write `evidence/mutations.txt` with the result of each fault.
- [x] 3.10 Run the layer in a real browser with the real routes of change 3 and a fake upstream.
- [x] 3.11 Write `evidence/browser-run.txt` with the output of that run.

## 4. Gates and review

- [x] 4.1 Run `make ratchet CHANGE=beemaps-burst-panel`.
- [x] 4.5 Read the verdict of the ratchet.
- [ ] 4.2 Run `/opsx:review beemaps-burst-panel` until both reviewers give PASS.
- [ ] 4.3 Write `review.md`.
- [ ] 4.4 Run `make gates CHANGE=beemaps-burst-panel` on the final tree.
