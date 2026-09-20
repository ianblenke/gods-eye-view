## 1. Spec and proposal

- [x] 1.1 Write `specs/osh/spec.md` with one ADDED requirement and the scenarios `osh-061` and `osh-062`.
  - The change MODIFIES no scenario. The plan quotes no base text, because no scenario body changes.
  - The last id on `main` is `osh-057`. The ids `osh-058` to `osh-060` belong to `osh-draw-unheld-features`.
- [x] 1.2 Write `proposal.md`: the Why, the four options, the Impact, the limits.
- [x] 1.3 Write `design.md` with D59 to D64.
- [x] 1.4 Write `tasks.md` from this list, with the mutation each test must redden.

## 2. Fixtures and the fake viewer

- [x] 2.1 Add `SYSTEM_FAR` and `FEATURE_FAR` to `src/data/oshLayer.test.mjs`, at longitude -179 and latitude -2.
  - Use the ids `sys-fixture-far` and `foi-fixture-far`. Give `FEATURE_FAR` the host `sys-fixture-far`. Both are synthetic.
- [x] 2.2 Give `fakeViewer()` a camera: `positionWC` over longitude 1, latitude 2 at 1 500 000 metres.
  - Give it `moveEnd` as a `new Cesium.Event()`. Return two helpers: `setCamera(lon, lat, height)` and `raiseMoveEnd()`.
  - Every current test in the file must stay green with no other edit. Run the file and confirm before 3.1.

## 3. `osh-061`: on top, at its own altitude

- [x] 3.1 Write the `[osh-061]` tests. Import only `createOshLayer` from the layer.
  - Test `[osh-061]`: the system entity's point and label draw on top, with the height reference NONE. Read each value with `getValue(JulianDate.now())`.
  - Compare the depth distance with the literal `Infinity`. Compare the height reference with `Cesium.HeightReference.NONE`.
  - Test `[osh-061]`: the feature entity's point and label draw on top, with the height reference NONE. Use `FEATURE_A`.
  - Test `[osh-061]`: the re-added entity for a selected system draws on top, on its point and its label. Select a stream-placed system, then refresh with no fresh location.
  - Test `[osh-061]`: a placed system keeps its altitude. Use `aircraftLocation()`, whose `alt` is 100, and read the height back through `Cesium.Cartographic.fromCartesian()`.
  - Test `[osh-061]`: a moved entity keeps the observation's altitude. Give the observation `alt:250` and read the height back the same way.
  - Test `[osh-061]`: a feature entity keeps its own altitude. Use `FEATURE_ALT`, whose `alt` is 75, and read the height back the same way — every other feature fixture carries `alt:0`, which leaves `feature.alt || 0` mutation-proof.
  - M1: set the system point's depth distance to `1800`. Reddens the system-entity test.
  - M2: remove the depth distance from the system label. Reddens the system-entity test on its label assertion.
  - M3: remove the helper from the feature point. Reddens the feature-entity test.
  - M4: remove the helper from the re-added point. Reddens the re-added-entity test.
  - M5: set the point's height reference to `CLAMP_TO_GROUND`. Reddens the system-entity test on its height-reference assertion.
  - M6: change `record.alt || 0` to `0`. Reddens the placed-altitude test.
  - M13: replace the re-added entity's `label: selectedSystemEntity.label` with a fresh literal. Reddens the re-added-entity test on its label assertion.
  - M14: change `feature.alt || 0` to `0`. Reddens the feature-altitude test.
- [x] 3.2 Add the helper from D62 and apply it at the five sites until 3.1 is green.
  - Put a one-line comment at the helper that names D59, D60 and the cctv field test of 2026-07-06.

## 4. `osh-062`: hide an entity beyond the horizon

- [x] 4.1 Write the `[osh-062]` tests. Register `t.after(() => layer.destroy(viewer))` in each.
  - Test `[osh-062]`: a refresh under a camera that has not moved hides the antipode entities and shows the near ones. Assert `show` on all four.
  - Test `[osh-062]`: a moveEnd over the antipode swaps which entities show. Call `setCamera(-179, -2, 1_500_000)`, then `raiseMoveEnd()`.
  - Test `[osh-062]`: a moveEnd raised while the layer is off still updates show, so enable() shows a correct set.
  - Test `[osh-062]`: a poll move across the limb hides the selected entity, and a later move back shows it. Use mock timers as the `[osh-030]` poll test does.
  - Test `[osh-062]`: init() adds one moveEnd listener, disable() keeps it, and destroy() removes it. Assert `numberOfListeners` at each step.
  - M7: make the horizon pass set `show` to `true` for every entity. Reddens the refresh test on an antipode assertion.
  - M8: invert `isPointVisible`. Reddens the refresh test on both a near and an antipode assertion.
  - M9: add the listener in `enable()` and remove it in `disable()`. Reddens the off-camera test and the listener-count test.
  - M10: remove the horizon pass call at the end of the draw loop in `update()`. Reddens the refresh test.
  - M11: remove the re-test after the poll's loop over the selected system's datastreams. Reddens the poll-move test.
  - M12: remove the listener removal from `destroy()`. Reddens the listener-count test on its last assertion.
- [x] 4.2 Write the horizon pass and the listener from D61 until 4.1 is green.
  - Confirm in the Cesium source that the `Entity.show` setter returns early for an unchanged value. Add no guard.
  - The pass call inside the poll runs once after the loop over the selected system's datastreams, not once per datastream with a fresh location.
- [x] 4.3 Run M1 to M14 one at a time. Record the test that reddened for each.
  - Revert each mutation before the next. A mutation that no test reddens is a finding. Fix the test, then run it again.
  - M13 and M14 came from the spec-adversary review, after the first pass through M1-M12 found nothing that survived.

## 5. Gates and review

- [x] 5.1 Run `make lint` until no STE error remains.
- [x] 5.2 Run `make ratchet CHANGE=osh-marker-depth`.
  - Ran twice: once for `osh-061`/`osh-062` as written. It ran again after the STE fix renamed the requirement and scenario titles, since the scenario hash covers the name.
- [x] 5.3 Run `make gates CHANGE=osh-marker-depth`. Confirm `src/layers/osh/index.js` stays at 100%.
  - Read the command output for the gate verdict. Three zeros in `results.json` mean the tests did not crash, not that the gates passed.
  - Ran twice. The first run, before the review fixes, failed on the ratchet not having run yet and `review.md` missing. The second, after both commits, failed on `review.md` missing alone — the one error expected before a review exists.
- [x] 5.4 Report the M1 to M14 results in the implementation report, one line per mutation.
- [ ] 5.5 Run the spec-adversary and STE-adversary review. Correct the findings. Record the result in `review.md`.
