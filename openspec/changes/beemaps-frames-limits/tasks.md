## 1. Write the tests

- [ ] 1.1 Change the tests for `beemaps-frames-008`, `beemaps-frames-009` and `beemaps-frames-010` in `src/layers/beemaps/box.test.mjs`.
- [ ] 1.2 Change the tests for `beemaps-frames-008` and `beemaps-frames-009` in `src/layers/beemaps/layer.test.mjs`.
- [ ] 1.3 Change the hint in the test for `beemaps-frames-018` in `src/layers/beemaps/model.test.mjs`.
- [ ] 1.4 Change the hint that the tests for `beemaps-frames-018` read in `src/layers/beemaps/layer.test.mjs`.
- [ ] 1.5 Add "credit_budget" to the tests for `beemaps-frames-016` in `src/layers/beemaps/messages.test.mjs`.
- [ ] 1.6 Carry the scenario `beemaps-frames-017` unchanged in the delta of `beemaps-frames`.
- [ ] 1.7 Carry the scenarios `beemaps-bursts-006` to `beemaps-bursts-011` unchanged in the delta of `beemaps-bursts`.
- [ ] 1.8 Write the tests for `beemaps-source-029`, `beemaps-source-030` and `beemaps-source-031` in `src/data/beemapsLog.test.mjs`.
- [ ] 1.9 Write the tests for `beemaps-source-032`, `beemaps-source-033`, `beemaps-source-034` and `beemaps-source-035` in `src/data/beemapsCredits.test.mjs`.
- [ ] 1.10 Add the file `credits.js` to the lists of files in the tests for `beemaps-source-015` in `src/data/beemapsUpstream.test.mjs`.
- [ ] 1.11 Add the file `credits.js` to the list of files in the test for `beemaps-burst-control-038` in `src/data/beemapsBurstScan.test.mjs`.
- [ ] 1.12 Add a row for the body `null` to the tests for `readCredits` in `src/data/beemapsFrames.test.mjs`.
- [ ] 1.13 Give the helper `install` in `src/data/beemapsProxy.test.mjs` a collector for the option `log`.

## 2. Write the code and the documents

- [ ] 2.1 Write the internal function, `viewBox` and `framesBox` in `src/layers/beemaps/box.js`.
- [ ] 2.2 Call `framesBox` in `src/layers/beemaps/index.js`.
- [ ] 2.3 Change the hint in `src/layers/beemaps/model.js`.
- [ ] 2.4 Add the text for "credit_budget" in `src/layers/beemaps/messages.js`.
- [ ] 2.5 Change the comment in `src/layers/beemapsBursts/box.js`.
- [ ] 2.6 Add the optional function `observe` to `callUpstream` in `server/providers/beemaps/upstream.js`.
- [ ] 2.7 Make `readCredits` in `server/providers/beemaps/normalize.js` safe for a value that is not an object.
- [ ] 2.8 Write `server/providers/beemaps/credits.js`.
- [ ] 2.9 Write the log lines in `server/providers/beemaps.js`.
- [ ] 2.10 Write the check of the credit limit and the addition of credits in `server/providers/beemaps.js`.
- [ ] 2.11 Add the new files to `scripts/format-scope.json` and the new tests to `openspec/ownership.json`.
- [ ] 2.12 Change the paragraphs of the frames layer and of the route in `DATA_SOURCES.md`.
- [ ] 2.13 Add `BEEMAPS_DAILY_CREDITS` to `.env.example`.
- [ ] 2.14 Write one entry in `CHANGELOG.md`.

## 3. Check on the host

- [ ] 3.1 Run the tests in `src/layers/beemaps` and `src/layers/beemapsBursts` on the host.
- [ ] 3.2 Run the tests `src/data/beemaps*.test.mjs` on the host.
- [ ] 3.3 Run one named fault for each rule and each limit of the spec.
- [ ] 3.4 Write `evidence/mutations.txt` with the result of each fault.
- [ ] 3.5 Write `evidence/real-shape.txt` with the output of the check of the route and the layer with a fake answer.
- [ ] 3.6 Run the four checks of `make precheck` on the host.
- [ ] 3.7 Run the STE lint on the host.
- [ ] 3.8 Run `openspec validate beemaps-frames-limits --strict` on the host.

## 4. Lead work in the image

- [ ] 4.1 Run `make ratchet CHANGE=beemaps-frames-limits`.
- [ ] 4.2 Read the verdict of the ratchet.
- [ ] 4.3 Run the two review agents.
- [ ] 4.4 Write review.md.
- [ ] 4.5 Run `make gates CHANGE=beemaps-frames-limits` on the final tree.
