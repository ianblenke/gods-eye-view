## 1. Documents

- [x] 1.1 Write the proposal, design, and spec for two error paths.

## 2. Tests and proof

- [x] 2.1 Add tests for `layer-lifecycle-001` to `manager.test.mjs`.
  - Tag each test with `[layer-lifecycle-001]`.
  - Mutation: Remove the rejection of a false destroy result. The test must fail.
  - Mutation: Return true from the destroy catch. The test must fail.
  - Mutation: Leave `destroying` true in the destroy catch. The test must fail.
  - Mutation: Remove the status event from the destroy catch. The test must fail.
- [x] 2.2 Add a test for `layer-lifecycle-002` to `manager.test.mjs`.
  - Tag the test with `[layer-lifecycle-002]`.
  - Mutation: Remove the catch for an activity listener error. The test must fail.
  - Mutation: Change the activity warning text. The test must fail.
  - Mutation: Pass a copy of the event to each listener. The test must fail.
- [x] 2.3 Run the selected test set 20 times plain and 20 times with CPU load.
- [x] 2.4 Run each mutation and record each test that fails.
- [x] 2.5 Run STE lint, format check, and the new tests.

## 3. Gates and review

- [x] 3.1 Run the ratchet command for this change.
- [x] 3.2 Run the gates for this change.
- [x] 3.3 Run the two review agents.
- [x] 3.4 Write `review.md` with the review result.
