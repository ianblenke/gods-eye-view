## 1. The two tests

- [x] 1.1 Add `GUARDED_RUN` to the test `[coverage-gate-049]` that stops for a live timer.
- [x] 1.2 Add `GUARDED_RUN` to the test `[coverage-gate-050]`.
- [x] 1.3 Add the names of the two tests to the list in the test `[coverage-gate-046]`.
- [x] 1.4 Run the files `src/tooling/spec/gates.test.mjs` and `src/tooling/spec/testGuard.test.mjs`.
- [x] 1.5 Confirm that every test keeps its name and its assertions.

## 2. Gates and review

- [ ] 2.1 Run `make lint` until no STE error remains.
- [ ] 2.2 Run `make gates CHANGE=ci-node-24-skip`.
- [ ] 2.3 Read the command output for the verdict.
- [ ] 2.4 Run `npm run format:check`.
- [ ] 2.5 Run `/opsx:review ci-node-24-skip`.
- [ ] 2.6 Correct the findings.
- [ ] 2.7 Record the result in `review.md`.
