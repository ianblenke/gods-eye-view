Verdict: FAIL

Round 2 spec adversary report. Scope: the diff from 95f26aee to 57a7e804, and each round-1 finding. Commit read: 57a7e804. I read the files only. I did not run any code.

Each of my six round-1 findings is corrected as the disposition says:
- **Ellipsoid (008):** the fake globe has its own ellipsoid (`Ellipsoid.clone`), and the test checks that the call gets that same object (layer.test.mjs:496). The WGS84 and default faults are killed in faults-4.log:294-295 and in run 5.
- **Abort matchers:** each `assert.rejects` has `{name:'AbortError'}`.
- **Failure body over the limit:** a new test reads a non-2xx body of 8388609 bytes, and the new fault is killed.
- **Mocked timers (005):** a new test moves the mocked timers, and its fault is killed in run 5.
- **Known limit, proposal and docs:** `untested-settings` names each item I listed. The text in proposal.md:37 and CURRENT-STATE.md:4712-4713 is now true.
- **Evidence:** the counts match the logs. Run 5 killed 317 of 317 faults, with 132 tests (122 + 10). Run 4 killed 295, then hit the 600 s timeout. Host run: 827 files, 16 skipped. checks-4.log and browser/run-4.log match the evidence files. qa-4.log has 5 PASS lines.

- [ ] FINDING major openspec/changes/archive/2026-10-22-skywatch-scenes-layer/specs/skywatch-scenes-layer/spec.md:299 (57a7e804) The new "Layer display" text has two meanings, and it disagrees with its scenario. "While it is enabled, the layer MUST show the footprints of its newest good answer" does not limit that answer to the current enable. Take this order: press, good answer, disable, enable. That answer is still "its newest good answer", so the text asks the layer to show it again. Scenario 026 (line 327, "no list") and layer.test.mjs:771-776 ask for the hint and no list. index.js:235 deletes the answer on disable. A good answer that arrives after disable (line 324) has the same problem. Correction: write "the footprints of the newest good answer that it gets after the last call of `enable`". Another way: add "and forget the answer" to the sentence about `disable`. Make the same change in openspec/specs/skywatch-scenes-layer/spec.md:302. I did not check what the new text does to the trace hashes.

- [ ] FINDING minor src/layers/skywatchScenes/layer.test.mjs:382 (57a7e804) Scenario 005 says "after the fake clock and the mocked timers move 10 minutes", for three WHEN cases. The mocked-timer test uses only "upstream_rate_limit", and it never moves `clock.t`. The test at line 350 moves only the clock, with real timers. Some retries pass every test. One example is a timer retry only after "search_timeout" or a rejection. That is a likely edit, because of the Known limit `search-time`. Another example is a timer that also checks `now()`. Correction: run the mocked-timer test for each of the three cases, and add one minute to `h.clock.t` at each tick. Add a named fault for a timer retry after "search_timeout".

- [ ] FINDING minor openspec/changes/archive/2026-10-22-skywatch-scenes-layer/proposal.md:58 (57a7e804) "copied from the CCTV card" is not true for each field. index.js:94 has `interactive: false`, but src/data/cctvCards.js:382 has `interactive: true`. The values of priority, protected and active are the CCTV values of an active card only. Correction: write "taken from an active CCTV card, except `interactive` false".

- [ ] FINDING minor openspec/changes/archive/2026-10-22-skywatch-scenes-layer/evidence/faults.txt:8 (57a7e804) "runs 4 and 5 have four more faults" can be read as "run 4 ran four more faults". Run 4 stopped at the third new fault (faults-4.log:296) and never ran "cap of a failure body 8388609". Correction: write "the fault list of runs 4 and 5 has four more faults. Run 4 killed two of them."

- [ ] FINDING minor openspec/changes/archive/2026-10-22-skywatch-scenes-layer/tasks.md:15 (57a7e804) Task 1.13 names the specs, the tests and the proposal. Commit 7ac632aa also corrected docs/CURRENT-STATE.md, and no task names that. Correction: add docs/CURRENT-STATE.md to task 1.13.

The gate output has no error other than REVIEW-MISSING. The history file has one new measurement line for 826e9fc0, and it names this change.
