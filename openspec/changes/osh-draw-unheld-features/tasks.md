## 1. Spec and proposal

- [ ] 1.1 Write `specs/osh/spec.md`: `osh-058`, `osh-059`, `osh-060` ADDED; `osh-042`, `osh-057` and `osh-032` MODIFIED; the rest carried.
  - Base of every block: `git show main:openspec/specs/osh/spec.md`. `osh-location-streams` was archived on 2026-09-20 as commit `66af434`, so its delta now sits in that one file and it is the single base.
  - Carried byte for byte under Records: `osh-024`, `osh-025`, `osh-026`, `osh-027`, `osh-041`, `osh-051`, `osh-052`.
  - Carried under Systems layer: `osh-028`, `osh-029`, `osh-030`, `osh-031`, `osh-033`, `osh-046`, `osh-049`. Under Feature entities: `osh-045`.
  - `osh-location-streams` is already archived. The base was checked against the archived spec. Every carried scenario is byte-identical. The scenarios `osh-032`, `osh-042` and `osh-057` differ only by the clauses this change adds.
- [ ] 1.2 Write `proposal.md` with the Why, the What Changes, the Impact and the limits.
- [ ] 1.3 Write `design.md` with D52 to D58.
- [ ] 1.4 Write `tasks.md` from this list, with a mutation ledger under each test task.

## 2. The adapter: `osh-058` and the `osh-042` clause

- [ ] 2.1 Keep the name of each `[osh-042]` test that the file has now.
  - Do not rename a test that the file has now. A new name can stop the ratchet on a file with untraced entries.
  - Add a new test for the moved-feature clause.
  - The new test `[osh-042]` a feature that a location moves carries the location's `datastreamId`, `datastreamName`, `phenomenonTime` and `ageMs` satisfies the trace gate.
- [ ] 2.2 Write the `[osh-058]` tests in `src/data/oshSystems.test.mjs`. Use `foi-fixture-`, `sys-fixture-` and `ds-fixture-` ids.
  - `[osh-058]` a fresh location that names an unheld feature draws that feature at the location.
  - `[osh-058]` the drawn feature has the stream-placed shape: `foiUid` as uid, the location's `systemId`, null name, description and `validTime`. Use `assert.deepEqual` on the whole record.
  - `[osh-058]` a location with both keys draws a feature keyed by `foiId`.
  - `[osh-058]` a location with `foiUid` alone draws a feature keyed by the uid.
  - `[osh-058]` the newer of two fresh locations that name one unheld feature wins, and one feature is drawn.
    - `[osh-058]` a newer location that comes first wins over an older location for one unheld feature.
  - `[osh-058]` a location that is not fresh draws no feature.
  - `[osh-058]` a held feature is moved, not drawn a second time. Assert `features.length`.
  - `[osh-058]` the drawn feature's location leaves systems and unplaced unchanged. Give the system no `Point`.
  - `[osh-058]` a second call with no such location gives no such feature.
  - `[osh-042]` a feature that a location moves carries the location's `datastreamId`, `datastreamName`, `phenomenonTime` and `ageMs`.
- [ ] 2.3 Change `placeOshEntities()` in `src/data/oshSystems.js` until 2.2 is green and 2.1 stays green.
- [ ] 2.4 Run each mutation below on the adapter. Report one line for each mutation: the id and the test that failed.
  - A1: restore the `continue` for an unheld feature. Fails the draws-at-the-location test.
  - A2: push the unheld location into `systemLocations`. Fails the M16 test and the systems-unchanged test.
  - A3: set the drawn feature's `systemId` to null. Fails the shape test.
  - A4: key the drawn feature by `foiUid` before `foiId`. Fails the both-keys test.
  - A5: drop the `foiUid` fallback for the key. Fails the uid-alone test.
    - A6: keep the first of two locations for one key. Fails the newer-wins test.
  - A13: replace the newer-wins condition of the unheld-feature draw with a constant true. Fails the test that gives the newer location first.
  - A7: run the draw before the fresh filter. Fails the not-fresh test.
  - A8: also draw an unheld record when the feature is held. Fails the moved-not-drawn-twice test.
  - A9: set the drawn record's `locationSource` to `'geometry'`. Fails the shape test.
  - A10: omit the four stream fields from the drawn record. Fails the shape test.
  - A11: keep the drawn keys in a module-level map across calls. Fails the second-call test.
  - A12: copy only the coordinates on a moved feature. Fails the moved-feature stream-fields test.
  - A mutation that no test fails on is a finding. Stop, add a test that fails for it, and then continue.

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
    - `[osh-059]` the detail for a selected stream-drawn feature with no host shows Placed by with the datastream name and age.
  - `[osh-059]` a system with no Point that only an unheld-feature location names counts under unplaced. Assert `placed.stream` at zero.
  - `[osh-059]` `destroy()` forgets the stream-drawn feature and zeroes `placed.streamFeatures`.
- [ ] 3.1b Write the `[osh-032]` layer test for a held feature that a stream moves.
  - `[osh-032]` the detail for a selected held feature that a stream moves shows its name and Placed by with the location's age.
- [ ] 3.2 Extend the test `[osh-057]` a fresh location that names a feature moves the feature entity and never places a system.
  - Add an unheld-feature location for a second system with no `Point`. Assert no `osh:` entity for it and `placed.stream` at zero.
  - Keep its name and its tag `[osh-057]`. This is the changed `[osh-057]` test that the trace gate needs.
- [ ] 3.3 Write the `[osh-060]` test: four refreshes on one layer.
  - The source's `getFois` throws on the second and the fourth refresh. The location is fresh on the first three only.
  - `[osh-060]` one entity id across a held refresh, a failed features read and a restored read, and none once the location is gone.
  - Assert the entity id, the position, the label, `partial` and `placed.streamFeatures` after each refresh.
- [ ] 3.4 Change `src/layers/osh/index.js` until 3.1 to 3.3 are green.
  - The functions that change: `update()`, the click handler, `pollSelected()`, `applySelection()`, `resetState()` and `getStats()`.
- [ ] 3.5 Run each mutation below on the layer. Report one line for each mutation: the id and the test that failed.
  - L1: filter `placed.features` to held records before the draw loop. Fails the holds-the-entity test.
  - L2: label a stream-drawn feature with its id. Fails the holds-the-entity test on its label assertion.
  - L2b: label a stream-drawn feature with the location's `systemName`. Fails the never-systemName test.
  - L2c: group stream-drawn features by host, or by position, into one entity. Fails the three-entities test.
  - L3: exclude stream-drawn records from `getStats().features`. Fails the holds-the-entity test on its count assertion.
  - L4: read the click's host from `_featureRecordsById` only. Fails the click test.
  - L5: count every placed feature under `placed.streamFeatures`. Fails the count test.
  - L6: count every feature with `locationSource:'stream'` under `placed.streamFeatures`. Fails the count test.
  - L7: build the detail's `feature` from `_featureRecordsById` only. Fails the detail test.
  - L7b: pass no `placedBy` for a feature in `pollSelected()`. Fails the detail test on its `Placed by` assertion.
  - L7c: put the location's `systemName` in the detail's feature name. Fails the detail test on its absent-name assertion.
  - L8: keep stream-drawn records in a map across refreshes and draw them again. Fails the removes-its-entity test and the fourth refresh of `[osh-060]`.
  - L9: read the selection-drop rule from `_featureRecordsById` only. Fails the keeps-its-selection test.
  - L10: skip the draw of stream-drawn records when `partial` is true. Fails the second refresh of `[osh-060]`.
  - L11: do not zero `placed.streamFeatures` in `resetState()`. Fails the destroy test.
    - L12: run the A2 mutation again with the layer suite. Fails the extended `[osh-057]` test.
  - L13: count the stream-drawn features under `placed.stream` too. Fails the extended `[osh-057]` test and the `[osh-059]` unplaced test.
  - L7d: read the feature's `Placed by` from the effective feature, or only for a feature that is not held. Fails the `[osh-032]` layer test.
  - A mutation that no test fails on is a finding. Stop, add a test that fails for it, and then continue.

## 4. The detail: the `osh-032` clauses

- [ ] 4.1 Write the `[osh-032]` detail tests in `src/layers/osh/detail.test.mjs`.
  - `[osh-032]` a feature placed by a stream shows Placed by with the datastream's name and the age.
  - `[osh-032]` a feature with no `placedBy` shows no Placed by line.
  - `[osh-032]` a feature header with no name shows the feature's id, never the host's name.
  - These are the changed `[osh-032]` tests the trace gate demands.
- [ ] 4.2 Change `renderFeatureHeader()` in `src/layers/osh/detail.js` until 4.1 is green.
- [ ] 4.3 Run each mutation below on the detail. Report one line for each mutation: the id and the test that failed.
  - D1: omit `renderPlacedBy()` from the feature header. Fails the Placed-by test.
  - D2: always render the line, with an em dash for no `placedBy`. Fails the no-line test.
  - D3: show `system.name` in place of `feature.id` when the feature has no name. Fails the never-host-name test.
  - A mutation that no test fails on is a finding. Stop, add a test that fails for it, and then continue.

## 5. Gates and review

- [ ] 5.1 Run `make lint` until no STE error remains.
- [ ] 5.2 Run `make ratchet CHANGE=osh-draw-unheld-features`.
- [ ] 5.3 Run `make gates CHANGE=osh-draw-unheld-features`. Confirm the three changed files stay at 100%.
- [ ] 5.4 Run `/opsx:review osh-draw-unheld-features`.
- [ ] 5.5 Correct the findings.
- [ ] 5.6 Record the result in `review.md`.
