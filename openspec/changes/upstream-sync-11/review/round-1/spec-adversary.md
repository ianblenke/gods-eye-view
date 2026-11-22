Verdict: FAIL

Commit read: `08b1338c2` (branch `upstream-sync`), in `/home/ianblenke/docker/gev-work/upstream-sync-11`. This is round 1, scope full. I read the code and tests. I could not run code or `git diff`.

- [x] FINDING critical `openspec/specs/osh/spec.md:348` + `src/data/layerState.test.mjs:209` Scenario `osh-033` says "the registry has 41 entries". The rewritten test asserts 48. The change has no osh delta spec, so the text is false, and the gate only matches tags. Fix: modify `osh-033` in a delta spec to say 48, or retire it.

- [x] FINDING critical `openspec/specs/osh/spec.md:574-589` + `src/data/oshLayer.test.mjs:1978-2171`
  - Scenarios `osh-061` and `osh-062` still name Cesium behavior that the ported layer does not do.
  - `osh-061` says the point and the label carry `disableDepthTestDistance`=Infinity and `heightReference` NONE. The tests check `item.disableDepthTest` and `item.height === 'absolute'` on the point only. The label test asserts only `label.horizonCull === true`, and its comment claims "over the depth test" without an assertion.
  - `osh-062` says entities beyond the horizon get `show:false`, and that `moveEnd` is added at `init`, kept while off and removed at `destroy`. The tests check only that `horizonCull` is set on the spec and the labels. No test covers hiding, restoring, or the `moveEnd` listener. A grep for `moveEnd` in `oshLayer.test.mjs` finds nothing.
  - The proposal does not list this loss. Fix: modify the two scenarios to match the port, name the lost listener and hide behavior in Known limits, or add tests.
  - Rule 13: removing `horizonCull: true` at `src/layers/osh/index.js:178` would fail the label asserts. No change to the code fails the `show:false` or `moveEnd` lines, because nothing tests them.

- [x] FINDING critical `openspec/specs/up42-scene-overlay/spec.md:51-64` + `src/layers/up42Scenes/images.test.mjs:451-567` Scenarios `up42-scene-overlay-009`, `-010` and `-011` still claim behavior the tests drop.
  - `-009` says the image material is "transparent true and white with alpha 0.85". The test asserts only `fill.image === 'blob:preview-1'`.
  - `-010` says polygon zIndex values are 3, 2, 1. The test asserts array order, `height 'clampGround'` and `clampTo 'both'`.
  - `-011` says outlines stay above the images with zIndex 25. No test checks outline order over images.
  - The proposal's Known limit `up42-image-alpha` admits that alpha and outline order are gone. The scenarios stayed and are marked verified. Fix: modify these three scenarios to the new behavior, or retire them.

- [x] FINDING critical `openspec/specs/hud-markings/spec.md:15` + `src/hudMarkings.test.mjs:31-42` The scenario `hud-markings-001` has the line "a file `src/hud.js` without the class hud-top-bar also stops the build". The test no longer checks it. `src/hud.js` and `IntelHudView.vue` have no `hud-top-bar` text, so the line is false after D3. The delta removes only requirement "Layout of the top bar", not this line. Fix: modify `hud-markings-001` to drop the line.

- [x] FINDING major `src/layers/submarineCables/bundledSourceDefault.test.mjs:15` The `cable-bundled-source-001` AND says "the source gives the two collections". The test asserts `assert.ok(snapshot)` and the two URL suffixes. The mock returns one identical object for both calls. A mutation that returns `{}`, or swaps `cables` and `landingPoints`, passes. Fix: assert `snapshot` deep-equals `{cables, landingPoints}`, with a different value for each URL.

- [x] FINDING minor `src/googleServerKey.test.mjs:215-223` The test for `credential-boundary-003` filters out every `define` key that starts with `__`. The scenario says the list equals the three public names. Any credential named `__X` now passes the boundary. Fix: filter the four named vue-i18n flags exactly.

- [x] FINDING minor `openspec/specs/{reticulum-layer,gdacs-layer,up42-scenes-layer,beemaps-frames,beemaps-bursts}/spec.md` The scenarios still use Cesium words: "data source has 3 entities", "polyline on the ground", `show` false, "box entity". The ported tests check the logical equivalent through a shim (`clampGround`, `pos`, `pixelSize`), so the tests mostly follow the text. Fix: reword in a later change, or name this in Known limits.

- [x] FINDING minor `src/layers/gdacs/registration.test.mjs:98` and `src/layers/reticulum/registration.test.mjs:90` The tests are named "at the end of the group", but they assert only that the layer follows its neighbor. This is a name that overclaims, not a hidden gap.

- [x] FINDING minor `openspec/trace/upstream-test-findings.json:4-345` + `scripts/spec/lib/upstream-findings.mjs:43` The record excuses a live timer (`GATES-TEST-LEAK`) for 110 upstream test files. The stale check skips that code on purpose, so a file that is listed once is excused for ever, even after a fork edit. The record also excuses `src/data/trafficTiming.test.mjs`, which carries the fork scenario `coverage-gate-101` and a fork edit but is not owned. The owner approved the mechanism (D8). Record these as Known limits: a permanent excuse, and a file that a fork edit made but the manifest does not own.

- [x] FINDING minor `openspec/changes/archive/2026-11-22-upstream-sync-11/proposal.md:45` Known limit `share-links` says the fork "does not decode" the upstream links of the seven layers. The fork now uses the tokens `05` to `0b` for those layers. I did not check the upstream token values. If any upstream link uses a token that the fork gave to another layer, that link enables the wrong layer instead of being ignored. Fix: check the upstream tokens, and word the limit to match.

- [x] FINDING minor `openspec/changes/archive/2026-11-22-upstream-sync-11/tasks.md:25-42` Task 1.23 (findings record) is unchecked, but its work exists: the record, the code and the tests. The other open tasks need the lead to check them before the merge.

Checks that passed:
- The 196 retired IDs: I spot-checked `share-codec-010`, `hud-markings-003`, `ghostmaps-029` and `voice-panel-012`. All are in `retired-ids.json`, and no test still carries those IDs.
- The coverage-gate-102, 103, 104, 105, 106, 107 and spec-trace-055 scenarios match `gates.mjs`, `upstream-findings.mjs` and `specs.mjs`. The tests assert the described outputs. `splitFindings` never excuses an owned file.
- `startup-view-001` to `-005`, `location-presets-004`, `credential-boundary-020` and `cockpit-contact-dot-001` assert their text.

Not checked:
- Item 5: the edits to upstream tests (`decode`, `placeSuggestions`, `radioPanel`, `gpuIcons`, `nominatimGuardLifecycle` and the rest). No base copy was readable, so I did not judge whether each edit still catches its fault.
- The kept ghostmaps, voice-panel, cyclones, wind, recent-imagery and perimeters tests, beyond the gate's "verified" count.
- The text of the 21 locale strings.
- `beemaps-frames-009`: its tests were listed but not read in depth.
