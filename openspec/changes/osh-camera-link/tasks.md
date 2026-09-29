## 1. Match a linked camera by name and number

- [ ] 1.1 Write the `[osh-097]` tests for `findLinkedCameraSystem()` in a new file `src/layers/osh/cameraLink.test.mjs`.
  - Assert it returns the system whose name has the same first digit run as the selected name. That system's own name also has "camera", read without regard to letter case.
  - Assert it returns `null` when the selected name has no digit.
  - Assert it returns `null` when no candidate's name has both the same digit run and the word "camera".
  - Assert it skips a candidate with no name, and a candidate whose own id equals the selected id.
  - Assert it returns the first candidate that matches, in the order `systemRecords` gives them, when more than one candidate matches.
  - Mutation: Match a name's last digit run instead of its first. Give a candidate an earlier, different number and a later number equal to the selected one. The test must fail without the fix.
  - Mutation: Compare "camera" with letter case. A candidate named `Camera 3` must still match when the selected name is `unit 3`. The test must fail without the fix.
- [ ] 1.2 Write `findLinkedCameraSystem({ selectedId, selectedName, systemRecords })` in `src/layers/osh/cameraLink.js`.
  - Read the first digit run of `selectedName` with a digit pattern; return `null` at once when it finds none.
  - Read `systemRecords` in its own given order; skip a record with no `name` or with the id `selectedId`.
  - Return the first record whose own first digit run equals the selected one, and whose own name has "camera", read without regard to letter case.
  - Return `null` when no record matches.

## 2. Start the linked camera's video as a fallback

- [ ] 2.1 Write the `[osh-097]` test in `src/layers/osh/index.test.mjs`. Show a selected system with no video datastream of its own, and a second system record whose name matches it.
  - Assert the layer reads the datastreams of the matched system.
  - Assert the layer starts one video stream, one player and one view for the matched system's own first `video: true` datastream.
  - Assert the view's own name is the matched system's own name, not the selected system's name or the datastream's own name.
  - Mutation: Keep the view's own name as the datastream's own name. The test must fail.
- [ ] 2.2 Write the `[osh-097]` test for no match. Show a selected system with no video datastream of its own, and no system record that matches it.
  - Assert the layer reads no further datastreams, and starts no video stream.
- [ ] 2.3 Change `openStreams()` in `src/layers/osh/index.js`: make it `async`.
  - When the selected system's own states have a `video: true` state, keep the current behaviour unchanged.
  - Otherwise, read the selected system's own record and call `findLinkedCameraSystem()`.
  - When it returns a record, read that record's own datastreams. Find its first `video: true` datastream. Start the video session for it with the matched record's own name.
  - Stop the fallback, with no video started, when the poll's own generation is stale after the read.
- [ ] 2.4 Change the one call site of `openStreams()` in `pollSelected()` to `await` it.

## 3. Confirm the carried scenarios still pass

- [ ] 3.1 Run `index.test.mjs` in full. Confirm `[osh-086]`, `[osh-087]`, `[osh-088]`, `[osh-089]`, `[osh-093]` and `[osh-094]`'s own tests pass with no change to their own assertions.
- [ ] 3.2 Confirm `src/layers/osh/index.js` and the new `src/layers/osh/cameraLink.js` keep 100% line, branch and function coverage.

## 4. Gates and review

- [ ] 4.1 Run `make ratchet CHANGE=osh-camera-link` and inspect the command verdict.
- [ ] 4.2 Run `make gates CHANGE=osh-camera-link` and inspect the command verdict and QA lines.
- [ ] 4.3 Run `/opsx:review osh-camera-link` with both review agents.
- [ ] 4.4 Write `review.md` with the passed reviews and tree hash.
