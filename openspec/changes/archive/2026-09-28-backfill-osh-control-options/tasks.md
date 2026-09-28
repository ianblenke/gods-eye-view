## 1. Backfill the new scenario's test

- [x] 1.1 Write the `[osh-control-036]` test in `view.test.mjs`. Show a target with a boolean field.
  - Assert the rendered `select` has a `false` option, then a `true` option.
  - Mutation: Remove the append call that adds the options in `view.js`. The test must fail.
- [x] 1.2 Confirm the existing `[osh-control-016]` test, whose own assertion the hotfix added, keeps its own tag. Do not rename it.

## 2. Confirm no code changes are needed

- [x] 2.1 Confirm `src/layers/oshControl/view.js` already has 100% line, branch and function coverage with the new test added, and needs no code change.

## 3. Gates and review

- [x] 3.1 Run `make ratchet CHANGE=backfill-osh-control-options` and inspect the command verdict.
- [x] 3.2 Run `make gates CHANGE=backfill-osh-control-options` and inspect the command verdict and QA lines.
- [ ] 3.3 Run `/opsx:review backfill-osh-control-options` with both review agents.
- [ ] 3.4 Write `review.md` with the passed reviews and tree hash.
