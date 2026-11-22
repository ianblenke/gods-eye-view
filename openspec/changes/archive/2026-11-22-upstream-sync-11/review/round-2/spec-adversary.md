Verdict: FAIL

Tree read: `/home/ianblenke/docker/gev-work/upstream-sync-11`, commit `8047d72a2`, scope `diff 08b1338c2`. I could not run code or `git diff`, so I compared the round 1 report with the files.

**Round 1 findings.** All four criticals and the one major are fixed in the files.
- **osh-033, osh-061, osh-062:** the new `specs/osh/spec.md` matches the tests. `layerState.test.mjs:209` asserts 48. `oshLayer.test.mjs:1987-1990` asserts `disableDepthTest` Infinity, `height` absolute and label `horizonCull`. Lines 2124-2127 assert the set `horizonCull`, 4 entities and the label flags. Lines 2158-2169 assert the poll move.
- **up42-scene-overlay-009 to -011:** the scenarios now say what `images.test.mjs:451-567` asserts: the object URL fill, the order oldest to newest, `clampGround` with `clampTo both`, `draped` outlines, and width and colour.
- **hud-markings-001:** the top-bar line is gone, and the test reads the Vue view.
- **cable-bundled-source-001:** the test now deep-equals `{cables, landingPoints}` with a distinct value for each file.
- **Minor round 1 items:**
  - **Fixed:** the flag filters, the "right after" test names, the Known limits for `leak-record` (114 entries, which matches the record) and `cesium-words`, and the checked boxes in `tasks.md`.
  - **Mostly fixed:** the `share-links` limit. The listed collisions match `src/data/layerState.js`: `00`, `01` and `02` go to the SkyWatch, Planet and SkyFi scenes layers. `8`, `6`, `7` and `9` go to air-quality, beemaps-bursts, gnss-integrity and gdacs. `4`, `3` and `5` go to reticulum, osh-systems and beemaps.

**New findings**
- [x] FINDING major `openspec/specs/credential-boundary/spec.md:25-28,47-57` + `src/googleServerKey.test.mjs:223-231`, `src/keySetupCore.test.mjs:787-788`, `src/tooling/viteBuild.test.mjs:118,127`
  - This is the same fault as round 1 `osh-033`: a changed test while the scenario text stays old.
  - `credential-boundary-003` says the `define` keys deep-equal the three public names. The test now filters four vue-i18n flags first, so the real list has seven keys.
  - `-005` says the two name sets are equal. The test skips the same four flags.
  - `-006` says the check reads the `.js` and `.mjs` files under `server/`, `scripts/` and `tools/`. The test skips test files (design D6 line 84).
  - Only `design.md:83-84` names these changes. No delta spec modifies the three scenarios, and no Known limit names them.
  - Fix: add a `credential-boundary` delta spec that modifies the three scenarios to name the four flags and the test-file skip. Alternatively, add a Known limit.

- [x] FINDING minor `src/data/oshLayer.test.mjs:1978,1993` The names of two `osh-061` tests still say "height reference NONE". The corrected scenario says `absolute`. Rename them. This is an overclaim in a name, not a gap.

- [x] FINDING minor `src/data/oshLayer.test.mjs:2166-2169` The scenario `osh-062` says a later poll move brings back the point and the label. The test asserts only `item.pos.lon === 1` on the way back. The label is asserted only on the way out (`position.x < 0`). Add an assertion that the label `position.x > 0` after the second tick.

- [x] FINDING minor `src/layers/up42Scenes/images.test.mjs:525-537` The `up42-scene-overlay-010` test resolves the images in the order old, middle, new. That is also the expected result order. Removing the `.sort` at `images.js:65` therefore passes this test. The sort is killed only by the `-009` test, which resolves the images in request order. Resolve the images in the order new, middle, old in the `-010` test.

- [ ] FINDING minor `src/tooling/spec/specs.test.mjs:238-276` The `spec-trace-055` test asserts only `loadSpecs().removedIds`. The scenario says the trace gate does not stop for a dropped scenario that has no test. That half is covered only by `trace.test.mjs:225-230`, which carries other tags. Name the scenario on that test, or add one trace assertion.

- [x] FINDING minor `openspec/changes/archive/2026-11-22-upstream-sync-11/proposal.md:50` The last sentence says the fork gave tokens `4`, `3` and `5` to other layers "in an earlier sync". I did not verify when. The upstream token values themselves are as the caller stated. Say only that the fork gave those tokens to other layers.

**Checks that passed**
- The scenarios `coverage-gate-102`, `-103`, `-104`, `-105`, `-106` and `-107` match `upstream-findings.mjs`, `gates.mjs:105-120,331,362,572-581`, and the tests in `upstreamFindings.test.mjs` and `gates.test.mjs`.
- The `osh` delta covers every scenario of both modified requirements (028-033, 046, 049, 057; 061, 062), so none is dropped.
- The voice-panel tag moves (030, 034, 036, 040, 047, plus 003, 038 and 046) point at live scenarios that are in the delta.
- The count of nine rewritten scenarios in D6 matches its list.

**Not checked:** the base copies of upstream tests, retired-ID tags on tests outside the files above (I relied on the gates-docs log), and the STE prose (the other reviewer's scope).
