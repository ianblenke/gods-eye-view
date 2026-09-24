## 1. The specs

- [x] 1.1 Write the delta spec with the requirement "Reporter output durability", `gap-ledger-056` and `gap-ledger-088`.
- [x] 1.2 Write proposal.md with the two causes, the fix and the known limits.
- [x] 1.3 Write design.md with the rejected option and the mutation of each check.
- [x] 1.4 Keep the tests for `gap-ledger-021`, `gap-ledger-022`, `gap-ledger-040`, `gap-ledger-048`, `gap-ledger-041`.
- [x] 1.5 Keep the tests for `gap-ledger-032`, `gap-ledger-023`, `gap-ledger-024`, `gap-ledger-025`, `gap-ledger-026`.
- [x] 1.6 Keep the tests for `gap-ledger-046`, `gap-ledger-030`.

## 2. The tests of the standard output fix

- [x] 2.1 Write the test for `coverage-gate-053` with a fake `processObject`, the gate values and `NODE_TEST_CONTEXT=child-v8`.
  - Mutation 1: remove the line that sets blocking mode. The test must fail.
  - Mutation 2: remove the last `?.` before `(true)`. The test must fail.
- [x] 2.2 Write the test for `coverage-gate-054` with processes without `NODE_TEST_CONTEXT=child-v8` or without `GEV_SPEC_OUT`.
  - Mutation 1: remove the `env.NODE_TEST_CONTEXT === 'child-v8'` condition. The test must fail.
  - Mutation 2: change the condition to `env.NODE_TEST_CONTEXT`. The test must fail.
  - Mutation 3: move the line before the `GEV_SPEC_OUT` check. The test must fail.

## 3. The code of the standard output fix

- [x] 3.1 Write the blocking-mode line in `installGuard()`, after its `GEV_SPEC_OUT` check, until 2.1 and 2.2 pass.

## 4. The tests of the covered-count rule

- [x] 4.1 Change the test for `gap-ledger-056` with total drifts that change the covered count.
  - Mutation 1: make the covered-count comparison always true. The test must fail.
  - Mutation 2: remove the check for an unknown covered count. The test must fail.
  - Mutation 3: remove the check for a base entry with no totals. The test must fail.
  - Mutation 4: compare only branches and functions, not lines. The test must fail.
  - Mutation 5: accept a higher covered count (`>=`). The test must fail.
- [x] 4.2 Write the test for `gap-ledger-088` with a total drift and an unchanged covered count.
  - Mutation 1: replace `totalsAgreeOnCoverage(entry, base)` with `false`. The test must fail.
  - Mutation 2: remove the clause that skips a metric with an unchanged total. The test must fail.

## 5. The code of the covered-count rule

- [x] 5.1 Write `totalsAgreeOnCoverage`.
- [x] 5.2 Use `totalsAgreeOnCoverage` in `compareWithBase` until 4.1 and 4.2 pass.
- [x] 5.3 Update the JSDoc of `compareWithBase`.

## 6. Coverage

- [x] 6.1 Keep `scripts/spec/lib/test-guard.mjs` and `scripts/spec/lib/ledger.mjs` at 100% lines, branches and functions.
- [x] 6.2 Report each mutation of sections 2 and 4 with the test that failed, in `review.md`.

## 7. Gates and review

- [x] 7.1 Run `make lint`.
- [x] 7.2 Run `make ratchet CHANGE=gate-measurement-race`.
- [x] 7.3 Run `make gates CHANGE=gate-measurement-race` until all gates pass.
- [x] 7.4 Run `/opsx:review gate-measurement-race`.
