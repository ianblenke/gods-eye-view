## 1. Specs and tests

- [x] 1.1 Write the delta specs and design before the tests.

- [x] 1.2 Test `coverage-gate-055` before the code.
  Mutation: Change the empty line value to zero. The test must fail.

- [x] 1.3 Test `coverage-gate-056` before the code.
  Mutation: Replace the number in the comment with the default. The test must fail.

- [x] 1.4 Test `coverage-gate-057` before the code.
  Mutation: Remove the later function condition. The test must fail.

- [x] 1.5 Test `coverage-gate-058` before the code.
  Mutation: Remove the positive line condition. The test must fail.

- [x] 1.6 Test `coverage-gate-059` before the code.
  Mutation: Remove the function name from its identity. The test must fail.

- [x] 1.7 Test `coverage-gate-060` before the code.
  Mutation: Replace the parent width comparison `>` with `>=`. The test must fail.

- [x] 1.8 Test `coverage-gate-061` before the code.
  Mutation: Replace the occurrence value with zero. The test must fail.

- [x] 1.9 Test `coverage-gate-062` before the code.
  Mutation: Use only the first coverage state. The test must fail.

- [x] 1.10 Test `coverage-gate-063` before the code.
  Mutation: Use only the first script. The test must fail.

- [x] 1.11 Test `coverage-gate-064` before the code.
  Mutation: Write the inherited environment to the runs file. The test must fail.

- [x] 1.12 Test `coverage-gate-065` before the code.
  Mutation: Remove the line that replaces the loaded records. The test must fail.

- [x] 1.13 Test `coverage-gate-066` before the code.
  Mutation: Replace the random name with `gev-spec-v8-fixed`. The test must fail.

  Mutation: Remove the line that deletes the raw folder. The test must fail.

- [x] 1.14 Test `coverage-gate-067` before the code.
  Mutation: Move the absent raw file check before the lcov condition. The test must fail.

  Mutation: Remove the absent raw file error. The test must fail.

- [x] 1.15 Test `gap-ledger-110` before the code.
  Mutation: Write zero for the new value of the lines metric. The test must fail.

- [x] 1.16 Test `gap-ledger-111` before the code.
  Mutation: Remove the active change condition. The test must fail.

- [x] 1.17 Test `gap-ledger-112` before the code.
  Mutation: Remove the base content condition. The test must fail.

- [x] 1.18 Test `gap-ledger-113` before the code.
  Mutation: Return the original base ledger. The test must fail.

- [x] 1.19 Test `gap-ledger-114` before the code.
  Mutation: Remove the merge module conditions. The test must fail.

- [x] 1.20 Test `gap-ledger-115` before the code.
  Mutation: Remove the check of the history prefix. The test must fail.

- [x] 1.21 Test `gap-ledger-116` before the code.
  Mutation: Replace the tolerance comparison `<=` with `<`. The test must fail.

- [x] 1.22 Test `gap-ledger-117` before the code.
  Mutation: Replace `Math.min` with `Math.max`. The test must fail.

- [x] 1.23 Test `gap-ledger-118` before the code.
  Mutation: Replace floor with ceil. The test must fail.

- [x] 1.24 Test `gap-ledger-119` before the code.
  Mutation: Remove the exact old value check. The test must fail.

- [x] 1.25 Test `gap-ledger-120` before the code.
  Mutation: Restore the equal history length check. The test must fail.

- [x] 1.26 Test `gap-ledger-121` before the code.
  Mutation: Remove the ledger metric check. The test must fail.

- [x] 1.27 Test `gap-ledger-122` before the code.
  Mutation: Remove the all-metrics-zero check. The test must fail.

## 2. Code and checks

- [x] 2.1 Write the coverage merge and gate interface after the tests.
- [x] 2.2 Write the rebaseline command and history checks after the tests.
- [x] 2.3 Check each compound operand with a mutation.
- [x] 2.4 Run the full mutation file after the last edit of a test or production file.
- [x] 2.5 Measure host coverage.
- [x] 2.6 Run each spec test file alone.
- [x] 2.7 Run the fresh temporary folder experiment.
- [x] 2.8 Check the prose.
- [x] 2.9 Check format.

## 3. Gates and review

- [ ] 3.1 Check the rebaseline evidence of the image.
- [ ] 3.2 Ask the lead to run `make ratchet CHANGE=gates-coverage-race` in the image.
- [ ] 3.3 Ask the lead to run `make gates CHANGE=gates-coverage-race` in the image.
- [ ] 3.4 Get both review agent verdicts.
- [ ] 3.5 Record the tree and verdicts in review.md.
