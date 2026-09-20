## 1. The specs

- [ ] 1.1 Write the delta spec with the three modified requirements and the requirement "Coverage waiver".
- [ ] 1.2 Write proposal.md with the measured counts, the Impact and the known limits.
- [ ] 1.3 Write design.md with the waiver, its bounds, the rejected options and the changed files.

## 2. The tests of the waived count

For each test below, run the named mutation before the code exists, and again after. Report the test that reddens for each mutation in the review notes.

- [ ] 2.1 Write the test for `gap-ledger-081` with `compareLedger` and a synthetic waiver.
  - Mutation: remove the waived count from the branch comparison. The test must redden.
- [ ] 2.2 Write the test for `gap-ledger-082` with a waiver for other content and one for the same hash.
  - Mutation 1: remove the hash condition from the waiver sum. The other-content case must redden.
  - Mutation 2: give the unchanged path a waived count. The same-hash case must redden.
- [ ] 2.3 Write the test for `gap-ledger-083` with `compareWithBase` and a waiver line of the checked change.
  - Mutation: remove the waiver sum from `compareWithBase`. The test must redden.
- [ ] 2.4 Write the test for `gap-ledger-084` with four waiver lines that give nothing.
  - The four lines: in the base history, another change, another hash, a file with the base content.
  - Mutation: remove one of the four conditions at a time. One case must redden for each.
- [ ] 2.5 Write the test for `gap-ledger-085` with `ratchetLedger` and a waiver that allows the rise.
  - Mutation 1: do not pass the waivers to `compareLedger`. The test must redden.
  - Mutation 2: write the reason `shown by test` for a changed file. The test must redden.
- [ ] 2.6 Change the test for `gap-ledger-004` with a count above the entry plus the waived count.
  - Mutation: replace the waived line count with 8. The test must redden.
- [ ] 2.7 Change the test for `gap-ledger-017` with a count above the entry plus the waived count.
  - Mutation: replace the waived branch count with 8. The test must redden.
- [ ] 2.8 Change the test for `gap-ledger-013` with a waiver that is too small for the rise.
  - Mutation: give the ratchet command a waived count of 8. The test must redden.
- [ ] 2.9 Change the test for `gap-ledger-022` with a rise above the waived line count.
  - Mutation: replace the waived count with 8. The test must redden.
- [ ] 2.10 Change the test for `gap-ledger-040` with a rise above the waived branch count.
  - Mutation: replace the waived count with 8. The test must redden.

## 3. The code of the waived count

- [ ] 3.1 Write `waiversOf` and the waived count in `compareCoverageEntry` and `compareLedger` until 2.1, 2.2, 2.6 and 2.7 pass.
- [ ] 3.2 Write the waived count in `compareWithBase` until 2.3, 2.4, 2.9 and 2.10 pass.
- [ ] 3.3 Write the waivers and the reason `waived` in `ratchetLedger` until 2.5 and 2.8 pass.
- [ ] 3.4 Update the JSDoc of `compareLedger`, `compareWithBase` and `ratchetLedger`.

## 4. The tests and the code of the command

- [ ] 4.1 Write the fixture with a base ledger entry for `src/math.js` with one not-covered branch.
- [ ] 4.2 Write the test for `gap-ledger-079` in `gates.test.mjs`.
  - The test runs `waive`, reads the history line, runs the ratchet command, then a check that passes.
  - The test also runs the ratchet command without the waiver, which must stop with `LEDGER-LARGER-GAP`.
  - Mutation 1: remove one field from the waiver line. The test must redden.
  - Mutation 2: write the history file in place of an append. The check must redden with `LEDGER-HISTORY-CHANGED`.
  - Mutation 3: do not pass the waivers to the ratchet command in `gates.mjs`. The test must redden.
- [ ] 4.3 Write the test for `gap-ledger-080` with one case for each of the seven faults.
  - Mutation: remove one check at a time. The case of that fault must redden.
- [ ] 4.4 Write the command `waive` in `gates.mjs`, with its options and `GATES-WAIVE`, until 4.2 and 4.3 pass.
- [ ] 4.5 Pass the waivers of the checked change to `compareLedger` and to `ratchetLedger` in `gates.mjs`.
- [ ] 4.6 Update the usage text and the JSDoc of `parseArgs`.

## 5. The scenarios that keep their text

- [ ] 5.1 Keep the tests for `gap-ledger-003`, `gap-ledger-018`, `gap-ledger-078`.
- [ ] 5.2 Keep the tests for `gap-ledger-054`, `gap-ledger-055`, `gap-ledger-019`.
- [ ] 5.3 Keep the tests for `gap-ledger-009`, `gap-ledger-020`, `gap-ledger-031`.
- [ ] 5.4 Keep the tests for `gap-ledger-005`, `gap-ledger-006`, `gap-ledger-007`.
- [ ] 5.5 Keep the tests for `gap-ledger-008`, `gap-ledger-053`.
- [ ] 5.6 Keep the tests for `gap-ledger-021`, `gap-ledger-048`, `gap-ledger-041`.
- [ ] 5.7 Keep the tests for `gap-ledger-056`, `gap-ledger-032`, `gap-ledger-023`.
- [ ] 5.8 Keep the tests for `gap-ledger-024`, `gap-ledger-025`, `gap-ledger-026`.
- [ ] 5.9 Keep the tests for `gap-ledger-046`, `gap-ledger-030`.
- [ ] 5.10 Keep the tests for `gap-ledger-010`, `gap-ledger-011`, `gap-ledger-012`.
- [ ] 5.11 Keep the tests for `gap-ledger-014`, `gap-ledger-027`, `gap-ledger-077`.
- [ ] 5.12 Keep the tests for `gap-ledger-028`, `gap-ledger-029`, `gap-ledger-057`.

## 6. Coverage

- [ ] 6.1 Keep `scripts/spec/lib/ledger.mjs` and `scripts/spec/gates.mjs` at 100% lines, branches and functions.
- [ ] 6.2 Report each mutation of sections 2 and 4 with the test that reddened, in the review notes.

## 7. Gates and review

- [ ] 7.1 Run `make lint`.
- [ ] 7.2 Run `make ratchet CHANGE=ledger-waiver`.
- [ ] 7.3 Run `make gates CHANGE=ledger-waiver` until all gates pass.
- [ ] 7.4 Run `/opsx:review ledger-waiver`.
