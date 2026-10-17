## 1. Write the tests

- [ ] 1.1 Change the tests for `beemaps-frames-008`, `beemaps-frames-009` and `beemaps-frames-010` in `src/layers/beemaps/box.test.mjs`.
- [ ] 1.2 Change the tests for `beemaps-frames-008` and `beemaps-frames-009` in `src/layers/beemaps/layer.test.mjs`.
- [ ] 1.3 Change the hint in the test for `beemaps-frames-018` in `src/layers/beemaps/model.test.mjs`.
- [ ] 1.4 Change the hint in `src/layers/beemaps/layer.test.mjs`.
- [ ] 1.5 Add "credit_budget" to the tests for `beemaps-frames-016` in `src/layers/beemaps/messages.test.mjs`.
- [ ] 1.6 Carry the scenario `beemaps-frames-017` unchanged in the delta of `beemaps-frames`.
- [ ] 1.7 Write the tests for `beemaps-source-029`, `beemaps-source-030` and `beemaps-source-031` in `src/data/beemapsLog.test.mjs`.
- [ ] 1.8 Write the tests for `beemaps-source-032`, `beemaps-source-033` and `beemaps-source-034` in `src/data/beemapsCredits.test.mjs`.

## 2. Write the code and the documents

- [ ] 2.1 Change the two constants and the comment in `src/layers/beemaps/box.js`.
- [ ] 2.2 Change the hint in `src/layers/beemaps/model.js`.
- [ ] 2.3 Add the text for "credit_budget" in `src/layers/beemaps/messages.js`.
- [ ] 2.4 Make the outcome of `server/providers/beemaps/upstream.js` hold the status and the size of the body.
- [ ] 2.5 Write `server/providers/beemaps/credits.js`.
- [ ] 2.6 Write the log lines and the check of the credit limit in `server/providers/beemaps.js`.
- [ ] 2.7 Add the new files to `openspec/ownership.json` and `scripts/format-scope.json`.
- [ ] 2.8 Change the paragraph of the frames layer in `DATA_SOURCES.md`.
- [ ] 2.9 Add `BEEMAPS_DAILY_CREDITS` to `.env.example`.
- [ ] 2.10 Write one entry in `CHANGELOG.md`.

## 3. Check on the host

- [ ] 3.1 Run the tests in `src/layers/beemaps` on the host.
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
