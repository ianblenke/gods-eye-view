## 1. The two tests

- [x] 1.1 Add `GUARDED_RUN` to the test `[coverage-gate-049]` that has no option and stops for a test that leaves a live timer.
- [x] 1.2 Add `GUARDED_RUN` to the test `[coverage-gate-050]`.
- [x] 1.3 Add the names of the two tests to the list for `gates.test.mjs` in the test `[coverage-gate-046]`.
- [x] 1.4 Run the files `src/tooling/spec/gates.test.mjs` and `src/tooling/spec/testGuard.test.mjs`.
- [x] 1.5 Confirm that no test name changes and that only the list in the test `[coverage-gate-046]` changes an assertion.

## 2. Gates and review

- [x] 2.1 Run `make lint` until no STE error remains.
- [x] 2.2 Run `make gates CHANGE=ci-node-24-skip`.
- [x] 2.3 Read the command output for the verdict.
- [x] 2.4 Run `npm run format:check`.
- [x] 2.5 Run `/opsx:review ci-node-24-skip`.
- [x] 2.6 Correct the findings.
- [x] 2.7 Record the result in `review.md`.
