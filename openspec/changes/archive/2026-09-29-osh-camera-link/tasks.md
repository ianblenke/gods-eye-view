## 1. Match a linked camera by name and number

- [x] 1.1 Write the `[osh-097]` tests for `findLinkedCameraSystem()` in a new file `src/layers/osh/cameraLink.test.mjs`.
  - Assert it returns the system whose name has the same first digit run as the selected name. That system's own name also has "camera", read without regard to letter case.
  - Assert it returns `null` when the selected name has no digit.
  - Assert it returns `null` when no candidate's name has both the same digit run and the word "camera".
  - Assert it skips a candidate with no name, and a candidate whose own id equals the selected id.
  - Assert it returns the first candidate that matches, in the order `systemRecords` gives them, when more than one candidate matches.
  - Mutation: Match a name's last digit run instead of its first. Give a candidate an earlier, different number and a later number equal to the selected one. The test must fail without the fix.
  - Mutation: Compare "camera" with letter case. A candidate named `Camera 3` must still match when the selected name is `unit 3`. The test must fail without the fix.
- [x] 1.2 Write `findLinkedCameraSystem()` in `src/layers/osh/cameraLink.js`.
  - It takes the selected id, the selected name, and the system records.
  - Read the first digit run of the selected name with a digit pattern; return `null` at once when it finds none.
  - Read the system records in their own given order; skip a record with no `name` or with the selected id.
  - Return the first record whose own first digit run equals the selected one, and whose own name has "camera", read without regard to letter case.
  - Return `null` when no record matches.

## 2. Start the linked camera's video as a fallback

- [x] 2.1 Write the `[osh-097]` test in `src/data/oshLayer.test.mjs`.
  - This is the real test file for `src/layers/osh/index.js`. An earlier draft named a file that did not exist; this corrects it.
  - Show a selected system with no video datastream of its own.
  - Show a second system record whose name matches it.
  - Assert the layer reads the datastreams of the matched system.
  - Assert the layer starts one video stream, one player and one view for the matched system's own first `video: true` datastream.
  - Assert the view's own name is the matched system's own name, not the selected system's name or the datastream's own name.
  - Mutation: Keep the view's own name as the datastream's own name. The test must fail.
- [x] 2.2 Write the `[osh-097]` test for no match, in `src/data/oshLayer.test.mjs`.
  - Show a selected system with no video datastream of its own.
  - Show no system record that matches it.
  - Assert the layer reads no further datastreams, and starts no video stream.
  - Also written: a test for a failed read of the matched camera's own datastreams.
  - Also written: a test for a stale generation during that read, design D4's own guard. Both start no video.
- [x] 2.3 Change `openStreams()` in `src/layers/osh/index.js`: make it `async`.
  - When the selected system's own states have a `video: true` state, keep the current behaviour unchanged.
  - Otherwise, read the selected system's own record and call `findLinkedCameraSystem()`.
  - When it returns a record, read that record's own datastreams. Find its first `video: true` datastream. Start the video session for it with the matched record's own name.
  - Stop the fallback, with no video started, when the poll's own generation is stale after the read.
- [x] 2.4 Change the one call site of `openStreams()` in `pollSelected()` to `await` it.

## 3. Confirm the carried scenarios still pass

- [x] 3.1 Run `src/data/oshLayer.test.mjs` in full.
  - It has 146 tests. Confirm `[osh-086]`, `[osh-087]`, `[osh-088]`, `[osh-089]`, `[osh-093]` and `[osh-094]`'s own tests pass with no change to their own assertions.
- [x] 3.2 Confirm `src/layers/osh/index.js` and `src/layers/osh/cameraLink.js` keep 100% coverage.
  - This means full line, branch and function coverage.
  - Measure it across every test file that imports `createOshLayer`: `src/data/oshLayer.test.mjs`, `src/data/osh.test.mjs`, `src/layers/oshControl/view.test.mjs` and `cameraLink.test.mjs`.
- [x] 3.3 `make ratchet` failed a hard-coded file count in `src/data/oshRepositoryHygiene.test.mjs`.
  - Test `[osh-034]` checks that no OSH test file has a real address.
  - The count, 18, did not include the new `cameraLink.test.mjs`, in an `osh/` directory.
  - Changed the count to 19, per the test's own failure message.
  - Re-ran all `[osh-034]` tests, 8 tests, to confirm the new file has no real address and no non-fixture vendor URN.

## 4. Gates and review

- [ ] 4.1 Run `make ratchet CHANGE=osh-camera-link` and inspect the command verdict.
- [ ] 4.2 Run `make gates CHANGE=osh-camera-link` and inspect the command verdict and QA lines.
- [ ] 4.3 Run `/opsx:review osh-camera-link` with both review agents.
- [ ] 4.4 Write `review.md` with the passed reviews and tree hash.
