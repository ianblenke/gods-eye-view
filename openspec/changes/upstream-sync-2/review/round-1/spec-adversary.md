Verdict: PASS

I could not run code or git, so the rule-21 merge parents and the 7147-test count are taken from your message, not checked. Checked directly:
- The 159 adopt lines in `history.jsonl` match the document.
- The import chain from `traffic.js` reaches all 7 reached files. For example `src/app/layers/traffic.js` imports `src/data/groundFloor.js`, and `src/data/terrainHeights.js` imports `src/services/application.js`. The chain also runs through `src/services/terrainHeights.js` to `geoid.js`, and through `overpassFeatures.js` to `featureSource.js`, `overpassFeaturesRecords.js` and `featureGeometry.js`.
- I did not find the "absent in the base graph" half of the rule; that needs git.
- The token `3`, the digit-4 fixtures, the `qa-scripts-023` counts (83) and the 13 headers look consistent.

No critical or major findings. Minor findings, to be accepted by name or recorded as known limits:

- [ ] FINDING minor openspec/changes/archive/2026-10-01-upstream-sync-2/proposal.md:201 The gate output has two `LEDGER-STALE` errors and one `LEDGER-LARGER-GAP` error (`src/cameraGroundGuard.js`, `src/data/labelArbiter.js`, `src/annotations/resolver.js`). `sync2-count-flips` names all three and the owner accepts them. Record that acceptance by name in `review.md`. The `resolver.js` text says "342 or 359", but earlier runs 5 and 6 did not flag it, so say it is the third flaky file.
- [ ] FINDING minor proposal.md:197 The Known limits omit the mock timers in `src/locations.test.mjs`. `t.mock.timers.enable({ apis: ['setTimeout'] })` means the camera ground guard polling never runs in that test, so a defect in that polling stays hidden. Add a limit such as `sync2-flight-timers-mocked`.
- [ ] FINDING minor proposal.md:207 The `after()` wait of 1300 ms in `src/data/militaryInstallations.test.mjs` hides the leaked deadline timers and does not prove they end. It also adds 1.3 s to the file. Name this in `sync2-timer-fixes-in-tests`.
- [ ] FINDING minor design.md:147 Mutation 2.6 ended as a hang that the run stopped at 120 s, but task 2.6 says "the test must fail". Say it is a time-out kill, or add a mutation that fails the test by assertion. Mutation 2.2 also differs: design says remove the `@covers` line, tasks says remove the header.
- [ ] FINDING minor design.md:125 Section D4 and tasks 2.3 to 2.4 describe only the timer-leak fixes. The diff of `src/data/militaryInstallations.test.mjs` also shows `terrainDelayTimer` and `boundedTimer` code with `clearTimeout` and a `globalThis.setTimeout` wrapper, but grep finds the same code in the main tree. Add a sentence that the wrapper comes from the fork. Say whether `after()` is still needed with those clears.
- [ ] FINDING minor src/data/layerState.test.mjs:195 The test `[osh-033]` is named "token o" but asserts token `3`. A changed assertion in this file (the count 29 at line 197 and following) is correct, so only the stale name remains. This was already in the base and is outside the diff, so the author can accept it by name.
- [ ] FINDING minor scripts/qa-layer-token-twochar.mjs:3 The header `@run` gives no URL, but the script reads `QA_BASE_URL` with a default of `http://127.0.0.1:4173`. `@needs` says "a local Vite server". State the variable and the port, or say the script starts its own server.
- [ ] FINDING minor proposal.md:195 The claims "181 of 211 files" and "19 files that both sides changed, each checked" have no proof in the change. Give the command that shows them, or mark them as the author's count.
