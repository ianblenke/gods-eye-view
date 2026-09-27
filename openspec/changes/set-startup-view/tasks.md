## 1. Documents

- [x] 1.1 Write the proposal, design, tasks, and five scenarios.

## 2. Tests and code

- [x] 2.1 Write the test for `startup-view-001` before code.
  - Mutation: Change the final latitude or height. The test must fail.
  - Mutation: Make `startApplicationView()` call `flyToAustin()`. The test must fail.
- [x] 2.2 Write the test for `startup-view-002` before code.
  - Mutation: Change the timer from 500 to 5000 ms. The test must fail.
- [x] 2.3 Write the test for `startup-view-003` before code.
  - Mutation: Remove the call that clears the timer. The test must fail.
- [x] 2.4 Write the test for `startup-view-004` before code.
  - Mutation: Swap the branch for `hasShareState`. The test must fail.
- [x] 2.5 Write the test for `startup-view-005` before code.
  - Mutation: Change the default loader text. The test must fail.
  - Mutation: Remove the call of `defer`. The test must fail.
- [x] 2.6 Add the new camera flight and change the app call.
- [x] 2.7 Run each mutation and the host tests.
- [x] 2.8 Run STE lint and the format check.
- [x] 2.9 Test the app call of `startApplicationView()` with fake controls, a fake scene, and a fake cloud controller.
- [x] 2.10 Give `StyleManager` in `src/standalone/controls.js` and add the cloud controller input.
- [x] 2.11 Run the new mutations and host checks.

## 3. Gates and review

- [x] 3.1 Run the ratchet command for this change.
- [x] 3.2 Run the gates for this change.
- [ ] 3.3 Run the two review agents.
- [ ] 3.4 Write `review.md` with the review result.
