## 1. Specs and tests

- [x] 1.1 Write the delta specs and design before the tests.

- [x] 1.2 Write the tests for `coverage-gate-055` first.
  Mutation: Change the empty line value to zero. The test must fail.

- [x] 1.3 Write the tests for `coverage-gate-056` first.
  Mutation: Replace the explicit next-line number with the default. The test must fail.

- [x] 1.4 Write the tests for `coverage-gate-057` first.
  Mutation: Remove the later function condition. The test must fail.

- [x] 1.5 Write the tests for `coverage-gate-058` first.
  Mutation: Remove the positive line condition. The test must fail.

- [x] 1.6 Write the tests for `coverage-gate-059` first.
  Mutation: Remove the function name from its identity. The test must fail.

- [x] 1.7 Write the tests for `coverage-gate-060` first.
  Mutation: Replace the parent width comparison `>` with `>=`. The test must fail.

- [x] 1.8 Write the tests for `coverage-gate-061` first.
  Mutation: Replace the occurrence value with zero. The test must fail.

- [x] 1.9 Write the tests for `coverage-gate-062` first.
  Mutation: Use only the first coverage state. The test must fail.

- [x] 1.10 Write the tests for `coverage-gate-063` first.
  Mutation: Use only the first script. The test must fail.

- [x] 1.11 Write the tests for `coverage-gate-064` first.
  Mutation: Write the inherited environment to the runs file. The test must fail.

- [x] 1.12 Write the tests for `coverage-gate-065` first.
  Mutation: Remove the line that replaces the loaded records. The test must fail.

- [x] 1.13 Write the tests for `coverage-gate-066` first.
  Mutation: Remove the line that deletes the private raw folder. The test must fail.

- [x] 1.14 Write the tests for `coverage-gate-067` first.
  Mutation: Remove the absent raw file error. The test must fail.

- [x] 1.15 Write the tests for `gap-ledger-110` first.
  Mutation: Write zero for the new line value. The test must fail.

- [x] 1.16 Write the tests for `gap-ledger-111` first.
  Mutation: Remove the active change condition. The test must fail.

- [x] 1.17 Write the tests for `gap-ledger-112` first.
  Mutation: Remove the base content condition. The test must fail.

- [x] 1.18 Write the tests for `gap-ledger-113` first.
  Mutation: Return the original base ledger. The test must fail.

- [x] 1.19 Write the tests for `gap-ledger-114` first.
  Mutation: Remove the module conditions. The test must fail.

- [x] 1.20 Write the tests for `gap-ledger-115` first.
  Mutation: Remove the base history prefix check. The test must fail.

- [x] 1.21 Write the tests for `gap-ledger-116` first.
  Mutation: Replace the tolerance comparison `<=` with `<`. The test must fail.

- [x] 1.22 Write the tests for `gap-ledger-117` first.
  Mutation: Replace `Math.min` with `Math.max`. The test must fail.

- [x] 1.23 Write the tests for `gap-ledger-118` first.
  Mutation: Replace floor with ceil. The test must fail.

- [x] 1.24 Write the tests for `gap-ledger-119` first.
  Mutation: Remove the exact old value check. The test must fail.

- [x] 1.25 Write the tests for `gap-ledger-120` first.
  Mutation: Restore the equal history length check. The test must fail.

- [x] 1.26 Write the tests for `gap-ledger-121` first.
  Mutation: Remove the ledger metric check. The test must fail.

- [x] 1.27 Write the tests for `gap-ledger-122` first.
  Mutation: Remove the all-metrics-zero check. The test must fail.

## 2. Code and checks

- [x] 2.1 Write the coverage merge and gate interface after the tests.
- [x] 2.2 Write the rebaseline command and history checks after the tests.
- [x] 2.3 Check each compound operand with a mutation.
- [x] 2.4 Run the complete mutation file after the last production change.
- [x] 2.5 Measure host coverage.
- [x] 2.6 Run each spec test file alone.
- [x] 2.7 Run the fresh temporary folder experiment.
- [x] 2.8 Check prose.
- [x] 2.9 Check format.

## 3. Gates and review

- [ ] 3.1 Check the rebaseline evidence of the image.
- [ ] 3.2 Ask the lead to run `make ratchet CHANGE=gates-coverage-race` in the image.
- [ ] 3.3 Ask the lead to run `make gates CHANGE=gates-coverage-race` in the image.
- [ ] 3.4 Get both review agent verdicts.
- [ ] 3.5 Record the tree and verdicts in review.md.
