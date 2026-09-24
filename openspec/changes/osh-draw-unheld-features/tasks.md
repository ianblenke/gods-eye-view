## 1. Spec and proposal

- [ ] 1.1 Write `specs/osh/spec.md`: `osh-058`, `osh-059`, `osh-060` ADDED; `osh-042`, `osh-057` MODIFIED; the rest carried.
  - Base of every block: `git show main:openspec/specs/osh/spec.md`. `osh-location-streams` was archived on 2026-09-20 as commit `66af434`, so its delta now sits in that one file and it is the single base.
  - Carried byte for byte under Records: `osh-024`, `osh-025`, `osh-026`, `osh-027`, `osh-041`, `osh-051`, `osh-052`.
  - Carried under Systems layer: `osh-028`, `osh-029`, `osh-030`, `osh-031`, `osh-032`, `osh-033`, `osh-046`, `osh-049`. Under Feature entities: `osh-045`.
  - `osh-location-streams` is already archived. The base was checked against the archived spec. Every carried scenario is byte-identical. The scenarios `osh-032`, `osh-042` and `osh-057` differ only by the clauses this change adds.
- [ ] 1.2 Write `proposal.md` with the Why, the What Changes, the Impact and the limits.
- [ ] 1.3 Write `design.md` with D52 to D57.
- [ ] 1.4 Write `tasks.md` from this list, with a mutation ledger under each test task.

## 2. The adapter: `osh-058` and the `osh-042` clause

- [ ] 2.1 Keep existing `[osh-042]` tests unchanged without renaming them.
  - Do not rename existing tests. Renaming an existing test can stop the ratchet on a file with untraced entries.
  - Add test coverage for the new moved-feature clause instead of renaming existing tests.
  - The new test `[osh-042]` a feature that a location moves carries the location's `datastreamId`, `datastreamName`, `phenomenonTime` and `ageMs` satisfies the trace gate.
- [ ] 2.2 Write the `[osh-058]` tests in `src/data/oshSystems.test.mjs`. Use `foi-fixture-`, `sys-fixture-` and `ds-fixture-` ids.
  - `[osh-058]` a fresh location that names an unheld feature draws that feature at the location.
  - `[osh-058]` the drawn feature has the stream-placed shape: `foiUid` as uid, the location's `systemId`, null name, description and `validTime`. Use `assert.deepEqual` on the whole record.
  - `[osh-058]` a location with both keys draws a feature keyed by `foiId`.
  - `[osh-058]` a location with `foiUid` alone draws a feature keyed by the uid.
  - `[osh-058]` the newer of two fresh locations that name one unheld feature wins, and one feature is drawn.
  - `[osh-058]` a location that is not fresh draws no feature.
  - `[osh-058]` a held feature is moved, not drawn a second time. Assert `features.length`.
  - `[osh-058]` the drawn feature's location leaves systems and unplaced unchanged. Give the system no `Point`.
  - `[osh-058]` a second call with no such location gives no such feature.
  - `[osh-042]` a feature that a location moves carries the location's `datastreamId`, `datastreamName`, `phenomenonTime` and `ageMs`.
- [ ] 2.3 Change `placeOshEntities()` in `src/data/oshSystems.js` until 2.2 is green and 2.1 stays green.
- [ ] 2.4 Run each mutation below on the adapter. Report one line per mutation: the id, RED, and the test that reddened.
  - A1: restore the `continue` for an unheld feature. Reddens the draws-at-the-location test.
  - A2: push the unheld location into `systemLocations`. Reddens the M16 test and the systems-unchanged test.
  - A3: set the drawn feature's `systemId` to null. Reddens the shape test.
  - A4: key the drawn feature by `foiUid` before `foiId`. Reddens the both-keys test.
  - A5: drop the `foiUid` fallback for the key. Reddens the uid-alone test.
  - A6: keep the first of two locations for one key. Reddens the newer-wins test.
  - A7: run the draw before the fresh filter. Reddens the not-fresh test.
  - A8: also draw an unheld record when the feature is held. Reddens the moved-not-drawn-twice test.
  - A9: set the drawn record's `locationSource` to `'geometry'`. Reddens the shape test.
  - A10: omit the four stream fields from the drawn record. Reddens the shape test.
  - A11: keep the drawn keys in a module-level map across calls. Reddens the second-call test.
  - A12: copy only the coordinates on a moved feature. Reddens the moved-feature stream-fields test.
  - A mutation that reddens no test is a finding. Stop and add the test before you continue.

## 3. The layer: `osh-059`, `osh-060` and the `osh-057` clause

- [ ] 3.1 Write the `[osh-059]` tests in `src/data/oshLayer.test.mjs`. Register `t.after(() => layer.destroy(viewer))` in each.
  - `[osh-059]` the map holds `osh-foi:<id>` for a stream-drawn feature at the location's position, with no label, and `getStats().features` counts it.
  - `[osh-059]` the location's `systemName` never becomes the label of a stream-drawn feature. Give the location a `systemName`.
  - `[osh-059]` three fresh unheld features of one host at one position give three entities, with no grouping.
  - `[osh-059]` a click on a stream-drawn feature selects its host and starts the datastream poll. Assert `calls.datastreamsArgs`.
  - `[osh-059]` `placed.streamFeatures` counts the stream-drawn feature and not the held feature a stream moved. The held feature must have a fresh location too.
  - `[osh-059]` the detail for a selected stream-drawn feature shows its id, its host id and Placed by with the location's age. Assert the `Placed by` text and that the `systemName` is absent from the header.
  - `[osh-059]` a refresh with no fresh location for a stream-drawn feature removes its entity and clears its selection.
  - `[osh-059]` a selected stream-drawn feature keeps its selection across a refresh that still draws it.
  - `[osh-059]` a system with no Point that only an unheld-feature location names counts under unplaced.
  - `[osh-059]` `destroy()` forgets the stream-drawn feature and zeroes `placed.streamFeatures`.
- [ ] 3.2 Extend the test `[osh-057]` a fresh location that names a feature moves the feature entity and never places a system.
  - Add an unheld-feature location for a second system with no `Point`. Assert no `osh:` entity for it and `placed.stream` at zero.
  - Retag it `[osh-057 osh-059]`. This is the changed `[osh-057]` test the trace gate demands.
- [ ] 3.3 Write the `[osh-060]` test: four refreshes on one layer.
  - The source's `getFois` throws on the second and the fourth refresh. The location is fresh on the first three only.
  - `[osh-060]` one entity id across a held refresh, a failed features read and a restored read, and none once the location is gone.
  - Assert the entity id, the position, the label, `partial` and `placed.streamFeatures` after each refresh.
- [ ] 3.4 Change `src/layers/osh/index.js` until 3.1 to 3.3 are green.
  - The functions that change: `update()`, the click handler, `pollSelected()`, `applySelection()`, `resetState()` and `getStats()`.
- [ ] 3.5 Run each mutation below on the layer. Report one line per mutation: the id, RED, and the test that reddened.
  - L1: filter `placed.features` to held records before the draw loop. Reddens the holds-the-entity test.
  - L2: label a stream-drawn feature with its id. Reddens the holds-the-entity test on its label assertion.
  - L2b: label a stream-drawn feature with the location's `systemName`. Reddens the never-systemName test.
  - L2c: group stream-drawn features by host, or by position, into one entity. Reddens the three-entities test.
  - L3: exclude stream-drawn records from `getStats().features`. Reddens the holds-the-entity test on its count assertion.
  - L4: read the click's host from `_featureRecordsById` only. Reddens the click test.
  - L5: count every placed feature under `placed.streamFeatures`. Reddens the count test.
  - L6: count every feature with `locationSource:'stream'` under `placed.streamFeatures`. Reddens the count test.
  - L7: build the detail's `feature` from `_featureRecordsById` only. Reddens the detail test.
  - L7b: pass no `placedBy` for a feature in `pollSelected()`. Reddens the detail test on its `Placed by` assertion.
  - L7c: put the location's `systemName` in the detail's feature name. Reddens the detail test on its absent-name assertion.
  - L8: keep stream-drawn records in a map across refreshes and draw them again. Reddens the removes-its-entity test and the fourth refresh of `[osh-060]`.
  - L9: read the selection-drop rule from `_featureRecordsById` only. Reddens the keeps-its-selection test.
  - L10: skip the draw of stream-drawn records when `partial` is true. Reddens the second refresh of `[osh-060]`.
  - L11: do not zero `placed.streamFeatures` in `resetState()`. Reddens the destroy test.
  - L12: the A2 mutation, run once more with the layer suite. Reddens the extended `[osh-057 osh-059]` test.
  - A mutation that reddens no test is a finding. Stop and add the test before you continue.

## 4. The detail: the `osh-032` clauses

- [ ] 4.1 Write the `[osh-032]` detail tests in `src/layers/osh/detail.test.mjs`.
  - `[osh-032]` a feature placed by a stream shows Placed by with the datastream's name and the age.
  - `[osh-032]` a feature with no `placedBy` shows no Placed by line.
  - `[osh-032]` a feature header with no name shows the feature's id, never the host's name.
  - These are the changed `[osh-032]` tests the trace gate demands.
- [ ] 4.2 Change `renderFeatureHeader()` in `src/layers/osh/detail.js` until 4.1 is green.
- [ ] 4.3 Run each mutation below on the detail. Report one line per mutation: the id, RED, and the test that reddened.
  - D1: omit `renderPlacedBy()` from the feature header. Reddens the Placed-by test.
  - D2: always render the line, with an em dash for no `placedBy`. Reddens the no-line test.
  - D3: show `system.name` in place of `feature.id` when the feature has no name. Reddens the never-host-name test.
  - A mutation that reddens no test is a finding. Stop and add the test before you continue.

## 5. Gates and review

- [ ] 5.1 Run `make lint` until no STE error remains.
- [ ] 5.2 Run `make ratchet CHANGE=osh-draw-unheld-features`.
- [ ] 5.3 Run `make gates CHANGE=osh-draw-unheld-features`. Confirm the three changed files stay at 100%.
- [ ] 5.4 Run `/opsx:review osh-draw-unheld-features`, correct the findings, and record the result in `review.md`.
