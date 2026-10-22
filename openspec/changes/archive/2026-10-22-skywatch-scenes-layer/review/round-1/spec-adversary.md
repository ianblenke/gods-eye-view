Verdict: FAIL

Round 1, full scope, commit 95f26aee. Clone: /home/ianblenke/docker/gev-work/skywatch-scenes-layer. I found 1 major finding and 5 minor findings.

These items match the files and the logs:
- The osh delta is word for word the same as the base spec. The only difference is 36 changed to 37.
- Token "00" agrees across the registry, the ledger, the ledger tests, the QA script and docs/CURRENT-STATE.md.
- The fault counts match faults-1/2/3.log: 302/295, 310/310 and 313/313, with 129, 129 and 130 tests.
- The host counts match host-3.log: 827 files, 16 skipped, and 47/11/24/12/6/11/9 tests in the layer files.
- The PASS counts of the QA runs match qa-3/4/5.log.

- [ ] FINDING major src/layers/skywatchScenes/layer.test.mjs:142 (95f26aee) Rule 15 is not met. The fake globe has `ellipsoid: Cesium.Ellipsoid.WGS84`, and line 474 asserts identity with that same constant. That constant is also the Cesium default. So no test checks the source of the AND line "that call uses the ellipsoid of the globe" (skywatch-scenes-layer-008). A fault that changes index.js:35 to `Cesium.Ellipsoid.WGS84` or `Cesium.Ellipsoid.default` passes every test. evidence/faults.txt:236 ("pick with no ellipsoid") only removes the argument. Correction: give the fake globe its own ellipsoid object, for example `Cesium.Ellipsoid.clone(Cesium.Ellipsoid.WGS84)`, which I did not run. Assert identity with that object, and record the constant fault in faults.txt.

- [ ] FINDING minor src/layers/skywatchScenes/layer.test.mjs:367 (95f26aee) In skywatch-scenes-layer-005, "the fake clock" is only the `now` option, and no test mocks the real timers. A retry such as `setTimeout(press, retryAfter*1000)` passes every test. Correction: use `t.mock.timers`, move the timers 10 minutes, and add a named fault for the retry.

- [ ] FINDING minor src/layers/skywatchScenes/source.test.mjs:395 (95f26aee) Lines 395, 402, 587 and 599 call `assert.rejects` with no matcher. That is weaker than the THEN text "rejects with the AbortError" in -014 and -015. The 8388608-byte cap is also tested only on 2xx bodies (lines 239-256 and 285). The non-2xx body that `failureOf` reads, which is the WHEN case of -014, has no test. Correction: add `{name:'AbortError'}` to each call, and add a non-2xx body of 8388609 bytes.

- [ ] FINDING minor src/layers/skywatchScenes/index.js:84 (95f26aee) Some code has no scenario and no assertion:
  - the card fields paintLane, details, priority, protected, active, interactive, collisionGroup, zIndex, minDistance, horizonCull and terrainOcclusion (lines 84-99);
  - the setEntries options `{cohortLimit:1, moving:false}` (lines 202-205);
  - `setVisible(false)` in `init` (line 300);
  - the 1 MiB cap of the status body (source.js:9). The fault run tried only a 1-byte cap, so a fault that removes the cap is not killed.
  Correction: add AND lines for these items, or name them in the Known limits.

- [ ] FINDING minor docs/CURRENT-STATE.md:4712 (95f26aee) The changed sentence says "The script proves … legacy-token compatibility". But evidence/browser.txt:68 says that check did not run with the new fixture token "01". Correction: write "The script checks …", or name the check that did not run.

- [ ] FINDING minor openspec/changes/archive/2026-10-22-skywatch-scenes-layer/proposal.md:35 (95f26aee) The sentence "'00' stays free in each fixture" is not true for three candidate maps in src/data/layerStateTokenLedger.test.mjs (lines 70, 228 and 421). Each one spreads LAYER_STATE_TOKEN_RESERVATIONS, which now gives "00" to skywatch-scenes. The test titles stay true. Correction: say "the ledger rows and the registry entries of each fixture", as D10 does.
