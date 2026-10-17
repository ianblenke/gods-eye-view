## 1. Write the specs and the tests

- [x] 1.1 Change the tests for `beemaps-frames-008`, `beemaps-frames-009` and `beemaps-frames-010` in `src/layers/beemaps/box.test.mjs`.
- [x] 1.2 Change the tests for `beemaps-frames-008` and `beemaps-frames-009` in `src/layers/beemaps/layer.test.mjs`.
- [x] 1.3 Change the hint in the test for `beemaps-frames-018` in `src/layers/beemaps/model.test.mjs`.
- [x] 1.4 Change the hint that the tests for `beemaps-frames-018` read in `src/layers/beemaps/layer.test.mjs`.
- [x] 1.5 Add "credit_budget" to the tests for `beemaps-frames-016` in `src/layers/beemaps/messages.test.mjs`.
- [x] 1.6 Carry the scenario `beemaps-frames-017` unchanged in the delta of `beemaps-frames`.
- [x] 1.7 Carry the scenarios `beemaps-bursts-006`, `beemaps-bursts-007`, `beemaps-bursts-008`, `beemaps-bursts-009`, `beemaps-bursts-010` and `beemaps-bursts-011` unchanged in the delta of `beemaps-bursts`.
- [x] 1.8 Change the titles of the tests for `beemaps-bursts-008` that name "the frames layer" or "the frames box" in `src/layers/beemapsBursts/box.test.mjs`.
- [x] 1.9 Change the title of one test for `beemaps-bursts-006` in `src/layers/beemapsBursts/layer.test.mjs`.
- [x] 1.10 Change the title of one test for `beemaps-bursts-007` in `src/layers/beemapsBursts/model.test.mjs`.
- [x] 1.11 Add a check of the box of the quote request to one test each for `beemaps-bursts-009`, `beemaps-bursts-010` and `beemaps-bursts-011`.
- [x] 1.12 Write the tests for `beemaps-source-029`, `beemaps-source-030` and `beemaps-source-031` in `src/data/beemapsLog.test.mjs`.
- [x] 1.13 Write the tests for `beemaps-source-032`, `beemaps-source-033`, `beemaps-source-034` and `beemaps-source-035` in `src/data/beemapsCredits.test.mjs`.
- [x] 1.14 Add the file `credits.js` to the lists of files in the tests for `beemaps-source-015` in `src/data/beemapsUpstream.test.mjs`.
- [x] 1.15 Add the file `credits.js` to the list of files in the test for `beemaps-burst-control-038` in `src/data/beemapsBurstScan.test.mjs`.
- [x] 1.16 Give the helper `install` in `src/data/beemapsProxy.test.mjs` a collector for the option `log`.
- [x] 1.17 Give the credit file a readable path in the test for `beemaps-source-017` in `src/data/beemapsProxy.test.mjs`.

## 2. Write the code and the documents

- [x] 2.1 Write the internal function, `viewBox` and `framesBox` in `src/layers/beemaps/box.js`.
- [x] 2.2 Call `framesBox` in `src/layers/beemaps/index.js`.
- [x] 2.3 Change the hint in `src/layers/beemaps/model.js`.
- [x] 2.4 Add the text for "credit_budget" in `src/layers/beemaps/messages.js`.
- [x] 2.5 Change the comment in `src/layers/beemapsBursts/box.js`.
- [x] 2.6 Add the optional function `observe` to `callUpstream` in `server/providers/beemaps/upstream.js`.
- [x] 2.7 Write `server/providers/beemaps/credits.js`.
- [x] 2.8 Write the log lines in `server/providers/beemaps.js`.
- [x] 2.9 Write the check of the credit limit in `server/providers/beemaps.js`.
- [x] 2.10 Write the addition of credits in `server/providers/beemaps.js`.
- [x] 2.11 Add the new files to `scripts/format-scope.json`.
- [x] 2.12 Add the new tests to `openspec/ownership.json`.
- [x] 2.13 Change the paragraph of the frames layer in `DATA_SOURCES.md`.
- [x] 2.14 Change the paragraph of the route in `DATA_SOURCES.md`.
- [x] 2.15 Add `BEEMAPS_DAILY_CREDITS` to `.env.example`.
- [x] 2.16 Write one entry in `CHANGELOG.md`.

## 3. Check on the host

- [x] 3.1 Run the tests in `src/layers/beemaps` and `src/layers/beemapsBursts` on the host.
- [x] 3.2 Run the tests `src/data/beemaps*.test.mjs` on the host.
- [x] 3.3 Run one named fault for each rule and each limit of the spec.
- [x] 3.4 Write `evidence/mutations.txt` with the result of each fault.
- [x] 3.5 Write `evidence/real-shape.txt` with the output of the check of the route and the layer with a fake answer.
- [x] 3.6 Run the four checks of `make precheck` on the host.
- [x] 3.7 Run the STE lint on the host.
- [x] 3.8 Run `openspec validate beemaps-frames-limits --strict` on the host.

## 4. Lead work in the image

- [x] 4.1 Run `make ratchet CHANGE=beemaps-frames-limits`.
- [x] 4.2 Read the verdict of the ratchet.
- [ ] 4.3 Run the two review agents.
- [ ] 4.4 Write review.md.
- [ ] 4.5 Run `make gates CHANGE=beemaps-frames-limits` on the final tree.
