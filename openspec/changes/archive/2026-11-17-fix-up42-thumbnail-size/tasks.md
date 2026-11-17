## 1. Spec

- [x] 1.1 Write the proposal.
- [x] 1.2 Write the design.
- [x] 1.3 Write the delta specs.
- [x] 1.4 Run the STE lint.

## 2. Tests

- [x] 2.1 Change the tests for `up42-thumbnails-010` to the limit of 4194304 bytes.
- [x] 2.2 Change the test for `up42-scenes-layer-015` to the limit of 4194304 bytes.
- [x] 2.3 Add one test for each of `up42-scenes-layer-012`, `up42-scenes-layer-013` and `up42-scenes-layer-014`.

## 3. Code

- [x] 3.1 Add the limit of 4 MiB to auth.js.
- [x] 3.2 Change MAX_THUMBNAIL_BYTES in source.js to 4 MiB.
- [x] 3.3 Add the changelog fragment.

## 4. Checks

- [x] 4.1 Run the thumbnail and source tests with coverage.
- [x] 4.2 Run the two mutations that restore 1 MiB.
- [x] 4.3 Record the tests that failed.
- [ ] 4.4 Have the lead run the ratchet command.
- [ ] 4.5 Have the lead run both review agents.
- [ ] 4.6 Have the lead write review.md.
- [ ] 4.7 Have the lead run make gates.
