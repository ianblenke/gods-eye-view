## 1. The specs

- [x] 1.1 Write the delta spec with 9 requirements and the 25 scenarios `cyclones-001` to `cyclones-025`.
- [x] 1.2 Write proposal.md with the gap counts and the known limits.
- [x] 1.3 Write design.md with the decisions and the changed files.

## 2. The source

For each task below, run the named mutation on `source.js`. Report the test that fails in `review.md`.

- [ ] 2.1 Tag one old test and write two tests for `cyclones-001` in `source.test.mjs`.
  - Mutation 1: return the pair itself, not a copy of it. The test must fail.
  - Mutation 2: read `positionAt` from `raw.issuedAt`. The test must fail.
  - Mutation 3: keep the link text of `advisoryUrl`, and do not call `officialLink()`. The test must fail.
- [ ] 2.2 Tag one old test for `cyclones-002` in `source.test.mjs`.
  - Mutation 1: remove the error for `unavailable` with one storm. The test must fail.
  - Mutation 2: write `unavailable: false` in each result. The test must fail.
- [ ] 2.3 Tag one old test and write one test for `cyclones-003` in `source.test.mjs`.
  - Mutation 1: change the limit of 32 storms to 33. The test must fail.
  - Mutation 2: remove the check for an id that appears twice. The test must fail.
  - Mutation 3: remove the end anchor from the pattern of the storm id. The test must fail.
  - Mutation 4: add the status `stale` to the list of geometry statuses. The test must fail.
- [ ] 2.4 Tag one old test and write five tests for `cyclones-004` in `source.test.mjs`.
  - Mutation 1: allow one more character than the limit of a text. The test must fail.
  - Mutation 2: allow the character `>` in a text. The test must fail.
  - Mutation 3: allow the top of a range, with `>=` and not `>`. The test must fail.
  - Mutation 4: read a missing `directionDegrees` as `null`. The test must fail.
  - Mutation 5: allow four digits in an advisory number. The test must fail.
  - Mutation 6: remove the check of the fragment of a link. The test must fail.
- [ ] 2.5 Tag one old test and write three tests for `cyclones-005` in `source.test.mjs`.
  - Mutation 1: remove the forecast points from the check of a `current` storm. The test must fail.
  - Mutation 2: change the limit of 500 forecast points to 501. The test must fail.
  - Mutation 3: remove the check that the last pair of a ring equals the first pair. The test must fail.
  - Mutation 4: accept the type `Point` for a track or a cone. The test must fail.
- [ ] 2.6 Tag one old test and write two tests for `cyclones-006` in `source.test.mjs`.
  - Mutation 1: request `/api/cyclone`, not `/api/cyclones`. The test must fail.
  - Mutation 2: change the option `redirect` from `error` to `follow`. The test must fail.
  - Mutation 3: return the parsed body and do not validate it. The test must fail.
- [ ] 2.7 Tag one old test and write two tests for `cyclones-007` in `source.test.mjs`.
  - Mutation 1: replace the check of `response.ok` with `false`. The test must fail.
  - Mutation 2: remove the call that cancels the body of a failed response. The test must fail.
  - Mutation 3: change the limit from 4 MiB to 4,096,000 bytes. The test must fail.
- [ ] 2.8 Tag two old tests and write four tests for `cyclones-008` in `source.test.mjs`.
  - Mutation 1: change the default deadline from 15000 to 15001 ms. The test must fail.
  - Mutation 2: remove `clearTimeout(timer)`. The test must fail.
  - Mutation 3: remove the check of the signal before the request. The test must fail.
  - Mutation 4: remove the check of the signal after the body read. The test must fail.
  - Mutation 5: abort the request with no reason. The test must fail.

## 3. The labels

For each task below, run the named mutation on `labels.js`. Report the test that fails in `review.md`.

- [ ] 3.1 Tag two old tests and write two tests for `cyclones-009` in `labels.test.mjs`.
  - Mutation 1: remove the wind from the priority of a card. The test must fail.
  - Mutation 2: add the lead hours to the priority of a lead-hour label, and do not subtract them. The test must fail.
  - Mutation 3: change the collision group to `other-card`. The test must fail.
  - Mutation 4: put the classification in the details of each card, also when it is empty. The test must fail.
  - Mutation 5: remove the distance limit of a lead-hour label. The test must fail.
- [ ] 3.2 Tag one old test and write three tests for `cyclones-010` in `labels.test.mjs`.
  - Mutation 1: use `Math.max`, and not `Math.min`, for the collision capacity. The test must fail.
  - Mutation 2: remove the return for an unchanged selection. The test must fail.
  - Mutation 3: change the cohort limit from 64 to 65. The test must fail.
  - Mutation 4: remove the call that shows the source. The test must fail.
  - Mutation 5: replace the default overlay function with an empty function. The test must fail.
- [ ] 3.3 Tag one old test and write one test for `cyclones-011` in `labels.test.mjs`.
  - Mutation 1: remove the start anchor from the pattern of the entry id. The test must fail.
  - Mutation 2: accept an empty storm id in the pattern. The test must fail.

## 4. The rendering

For each task below, run the named mutation on `rendering.js`. Report the test that fails in `review.md`.

- [ ] 4.1 Tag two old tests and write seven tests for `cyclones-012` in `rendering.test.mjs`.
  - Mutation 1: remove the skip of a forecast point at lead hour 0. The test must fail.
  - Mutation 2: change the width of a track from 2.5 to 2. The test must fail.
  - Mutation 3: use `Math.min`, and not `Math.max`, for the radius of the focus sphere. The test must fail.
  - Mutation 4: draw the geometry for each status that is not `pending`. The test must fail.
  - Mutation 5: give the first center point the size of a selected storm. The test must fail.
- [ ] 4.2 Tag one old test and write one test for `cyclones-013` in `rendering.test.mjs`.
  - Mutation 1: swap the two colors in `select()`. The test must fail.
  - Mutation 2: remove the call that sends the selection to the labels. The test must fail.
  - Mutation 3: remove the render request after a selection. The test must fail.
- [ ] 4.3 Tag four old tests and write one test for `cyclones-014` in `rendering.test.mjs`.
  - Mutation 1: replace the sphere test of a storm with `true`. The test must fail.
  - Mutation 2: replace the minimum radius of the ellipsoid with its maximum radius. The test must fail.
  - Mutation 3: request a render when nothing changed. The test must fail.
  - Mutation 4: invert the result of the point occluder. The test must fail.
- [ ] 4.4 Tag two old tests and write one test for `cyclones-015` in `rendering.test.mjs`.
  - Mutation 1: own each id that starts with `cyclone:`. The test must fail.
  - Mutation 2: map each entity to the first storm of the snapshot. The test must fail.
  - Mutation 3: return the entity id, and not `null`, for an unknown entity. The test must fail.
- [ ] 4.5 Tag six old tests and write three tests for `cyclones-016` in `rendering.test.mjs`.
  - Mutation 1: remove the test of `generation` after the add. The test must fail.
  - Mutation 2: remove the removal of the new data source after a replaced call. The test must fail.
  - Mutation 3: return `false`, and do not throw, when the add fails for the newest call. The test must fail.
  - Mutation 4: do not raise `generation` at the start of the call. The test must fail.
- [ ] 4.6 Tag two old tests and write three tests for `cyclones-017` in `rendering.test.mjs`.
  - Mutation 1: remove the rise of `generation` in `clear()`. The test must fail.
  - Mutation 2: do not reset the selection in `clear()`. The test must fail.
  - Mutation 3: do not clear the labels in `clear()`. The test must fail.
  - Mutation 4: report `timerActive` as `true`. The test must fail.

## 5. The layer

For each task below, run the named mutation on `index.js`. Report the test that fails in `review.md`.

- [ ] 5.1 Write two tests for `cyclones-018` in `index.test.mjs`.
  - Mutation 1: change the update interval from 300000 to 300001 ms. The test must fail.
  - Mutation 2: throw an `Error`, and not a `TypeError`, for a missing source. The test must fail.
  - Mutation 3: do not pass `overlayHost` to the renderer. The test must fail.
- [ ] 5.2 Tag one old test and write five tests for `cyclones-019` in `index.test.mjs`.
  - Mutation 1: remove the call that unregisters the pick owner. The test must fail.
  - Mutation 2: remove the abort of the request in `disable()`. The test must fail.
  - Mutation 3: destroy a click handler that Cesium already destroyed. The test must fail.
  - Mutation 4: remove the call of `rendering.destroy()` in `destroy()`. The test must fail.
  - Mutation 5: remove the test for a viewer with no canvas. The test must fail.
- [ ] 5.3 Tag three old tests and write eight tests for `cyclones-020` in `index.test.mjs`.
  - Mutation 1: remove the default text of the error of an unavailable snapshot. The test must fail.
  - Mutation 2: do not clear the renderer for an unavailable snapshot. The test must fail.
  - Mutation 3: remove the listener of the caller abort. The test must fail.
  - Mutation 4: remove the test of `controller.signal.aborted` in the `catch` block. The test must fail.
  - Mutation 5: remove the call of `notify()` when a request starts. The test must fail.
- [ ] 5.4 Tag three old tests and write seven tests for `cyclones-021` in `index.test.mjs`.
  - Mutation 1: remove the words `stale source` from the stale text. The test must fail.
  - Mutation 2: start the ordinal of a list item at 0. The test must fail.
  - Mutation 3: cut the issue time at 15 characters, not 16. The test must fail.
  - Mutation 4: remove the advisory number from the text of a pending geometry. The test must fail.
  - Mutation 5: test the code name with `in`, and not with `Object.hasOwn`. The test must fail.
- [ ] 5.5 Write three tests for `cyclones-022` in `index.test.mjs`.
  - Mutation 1: use the fetch time, and not the issue time, in `lastUpdate`. The test must fail.
  - Mutation 2: remove `!snapshot.unavailable` from `empty`. The test must fail.
  - Mutation 3: remove `timerActive: false` from the diagnostics. The test must fail.
- [ ] 5.6 Tag three old tests and write one test for `cyclones-023` in `index.test.mjs`.
  - Mutation 1: accept a `clear` that is not `true`. The test must fail.
  - Mutation 2: select each `stormId`, also when it is not in the snapshot. The test must fail.
  - Mutation 3: set the intent `auto`, and not `user`, in `setParams()`. The test must fail.
  - Mutation 4: select no storm for the intent `auto`. The test must fail.
- [ ] 5.7 Tag two old tests and write five tests for `cyclones-024` in `index.test.mjs`.
  - Mutation 1: change the tolerance of the recorded hit from 1 px to 2 px. The test must fail.
  - Mutation 2: join the test of the two axes with `||`. The test must fail.
  - Mutation 3: remove the return for a vessel card. The test must fail.
  - Mutation 4: do not forget the captured hit after one click. The test must fail.
  - Mutation 5: remove `mouseup` from the release events. The test must fail.
- [ ] 5.8 Tag three old tests and write six tests for `cyclones-025` in `index.test.mjs`.
  - Mutation 1: swap the two durations of the flight. The test must fail.
  - Mutation 2: remove the test of `generation` in the queued function. The test must fail.
  - Mutation 3: open the link with the option `noopener` only. The test must fail.
  - Mutation 4: open the link for a storm with no advisory URL. The test must fail.
  - Mutation 5: ask for `prefers-color-scheme`, not `prefers-reduced-motion`. The test must fail.

## 6. Coverage

- [ ] 6.1 Keep `source.js`, `labels.js` and `rendering.js` at 100% lines, branches and functions.
- [ ] 6.2 Keep `index.js` at 100% lines and functions, and at one open branch.
- [ ] 6.3 Report each mutation of sections 2 to 5 with the test that failed, in `review.md`.

## 7. Gates and review

- [ ] 7.1 Run `make ratchet CHANGE=backfill-cyclones`.
- [ ] 7.2 Run `make lint`.
- [ ] 7.3 Correct each STE error.
- [ ] 7.4 Run `make gates CHANGE=backfill-cyclones`. The only errors must be review errors.
- [ ] 7.5 Run the review with `/opsx:review backfill-cyclones`.
- [ ] 7.6 Write `review.md`.
