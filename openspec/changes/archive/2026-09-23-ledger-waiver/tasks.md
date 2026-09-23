## 1. The specs

- [x] 1.1 Write the delta spec with the three modified requirements and the requirement "Coverage waiver".
- [x] 1.2 Write proposal.md with the measured counts, the Impact and the known limits.
- [x] 1.3 Write design.md with the waiver, its bounds, the rejected options and the changed files.

## 2. The tests of the waived count

For each test below, run the named mutation, and report the test that fails in `review.md`.

- [x] 2.1 Write the test for `gap-ledger-081` with `compareLedger` and a synthetic waiver.
  - Mutation: remove the waived count from the branch comparison. The test must fail.
- [x] 2.2 Write the test for `gap-ledger-082` with other content, the same hash and a file that no test loads.
  - Mutation 1: remove the hash condition from the waiver sum. The test must fail.
  - Mutation 2: give the unchanged path a waived count. The test must fail.
  - Mutation 3: remove `!entry.loaded`, then `!gap.loaded`, from the waived count. The test must fail for each.
- [x] 2.3 Write the test for `gap-ledger-083` with `compareWithBase` and waiver lines of the checked change.
  - Mutation 1: remove the waiver sum from `compareWithBase`. The test must fail.
  - Mutation 2: remove `+ waivedLines` from the line rule of `compareWithBase`. The test must fail.
- [x] 2.4 Write the test for `gap-ledger-084` with waiver lines that give nothing.
  - The lines: in the base history, another change, another hash, and for a file with the base content.
  - The lines also have a wrong count, a wrong metric, no hash, another kind, or no change name.
  - Mutation: remove one condition at a time. One case must fail for each.
- [x] 2.5 Write the test for `gap-ledger-085` with `ratchetLedger` and a waiver that allows the rise.
  - Mutation 1: do not pass the waivers to `compareLedger`. The test must fail.
  - Mutation 2: write the reason `shown by test` for a changed file. The test must fail.
- [x] 2.6 Change the test for `gap-ledger-004` with a count above the entry plus the waived count.
  - Mutation: replace the waived line count with 8. The test must fail.
- [x] 2.7 Change the test for `gap-ledger-017` with a count above the entry plus the waived count.
  - Mutation: replace the waived branch count with 8. The test must fail.
- [x] 2.8 Change the test for `gap-ledger-013` with a waiver that is too small for the rise.
  - Mutation: give the ratchet command a waived count of 8. The test must fail.
- [x] 2.9 Change the test for `gap-ledger-022` with a rise above the waived line count.
  - Mutation: replace the waived count with 8. The test must fail.
- [x] 2.10 Change the test for `gap-ledger-040` with a rise above the waived branch count.
  - Mutation: replace the waived count with 8. The test must fail.
- [x] 2.11 Write the tests for `gap-ledger-086` with a full waiver, a waiver that is too small and the added entry.
  - Mutation 1: do not mark a file with no entry as not current. The test must fail.
  - Mutation 2: remove the base-content, loaded, file, hash or metric condition. The test must fail.
  - Mutation 3: record a history line only for the branches. The test must fail.
- [x] 2.12 Write the tests for `gap-ledger-087` with a full waiver and waivers that give nothing.
  - Mutation 1: remove the condition for one or more waivers. The test must fail.
  - Mutation 2: replace the call of `waiversCover` in `compareWithBase` with `false`. The test must fail.
- [x] 2.13 Change the test for `gap-ledger-003` with a waiver for a file with the base content.
  - Mutation: remove the base-content condition of `waiversCover`. The test must fail.
- [x] 2.14 Change the test for `gap-ledger-021` with a coverage waiver and untraced names.
  - Mutation: replace the call of `waiversCover` in `compareWithBase` with `false`. The test must fail.
- [x] 2.15 Change the test for `gap-ledger-048` with a changed file and a waiver.
  - Mutation: make the waived count of `compareWithBase` 0. The test must fail.

## 3. The code of the waived count

- [x] 3.1 Write `waiversOf` and the waived count in `compareCoverageEntry` and `compareLedger` until 2.1, 2.2, 2.6 and 2.7 pass.
- [x] 3.2 Write the waived count in `compareWithBase` until 2.3, 2.4, 2.9 and 2.10 pass.
- [x] 3.3 Write the waivers and the reason `waived` in `ratchetLedger` until 2.5 and 2.8 pass.
- [x] 3.4 Update the JSDoc of `compareLedger`, `compareWithBase` and `ratchetLedger`.
- [x] 3.5 Write `waiversCover`, and use it in `compareLedger` and `compareWithBase`, until 2.11 to 2.15 pass.
  - See D10.
- [x] 3.6 Write the second loop of `ratchetLedger` until 2.11 passes.
  - The loop adds the entry of a file with no entry and a waived count.

## 4. The tests and the code of the command

- [x] 4.1 Write the fixture with a base ledger entry for `src/math.js` with one not-covered branch.
- [x] 4.2 Write the test for `gap-ledger-079` in `gates.test.mjs`.
  - The test runs `waive`, reads the one new history line, runs `check`, runs the ratchet command, then `check` again.
  - The test also runs the ratchet command without the waiver, which must stop with `LEDGER-LARGER-GAP`.
  - Mutation 1: remove the `reason` field from the waiver line. The test failed.
  - Mutation 2: append the waiver line two times. The test failed.
  - Mutation 3: write the base commit in place of the head commit. The test failed.
- [x] 4.3 Write the test for `gap-ledger-080` with one case for each of the seven faults.
  - Mutation: remove each entry of the `faults` array, one at a time. The test failed for each.
- [x] 4.4 Write the command `waive` in `gates.mjs`, with its options and `GATES-WAIVE`, until 4.2 and 4.3 pass.
- [x] 4.5 Pass the waivers of the checked change to `compareLedger` and to `ratchetLedger` in `gates.mjs`.
- [x] 4.6 Update the usage text and the JSDoc of `parseArgs`.
- [x] 4.7 Put the seven fault conditions of `waive` into one `faults` array and one `find` call.
  - A mutation showed that this closes six of the seven phantom branches. The last one is the `if (fault)` line. See D10.

## 5. The scenarios that keep their text

- [x] 5.1 Keep the tests for `gap-ledger-018`, `gap-ledger-078`, `gap-ledger-054`.
- [x] 5.2 Keep the tests for `gap-ledger-055`, `gap-ledger-019`, `gap-ledger-009`.
- [x] 5.3 Keep the tests for `gap-ledger-020`, `gap-ledger-031`, `gap-ledger-005`.
- [x] 5.4 Keep the tests for `gap-ledger-006`, `gap-ledger-007`, `gap-ledger-008`.
- [x] 5.5 Keep the tests for `gap-ledger-053`, `gap-ledger-041`, `gap-ledger-056`.
- [x] 5.6 Keep the tests for `gap-ledger-032`, `gap-ledger-023`, `gap-ledger-024`.
- [x] 5.7 Keep the tests for `gap-ledger-025`, `gap-ledger-026`, `gap-ledger-046`.
- [x] 5.8 Keep the tests for `gap-ledger-030`, `gap-ledger-010`, `gap-ledger-011`.
- [x] 5.9 Keep the tests for `gap-ledger-012`, `gap-ledger-014`, `gap-ledger-027`.
- [x] 5.10 Keep the tests for `gap-ledger-077`, `gap-ledger-028`, `gap-ledger-029`.
- [x] 5.11 Keep the tests for `gap-ledger-057`, and for `gap-ledger-088`, which `gate-measurement-race` added on `main`.

## 6. Coverage

- [x] 6.1 Keep `scripts/spec/lib/ledger.mjs` at 100% lines, branches and functions.
- [x] 6.2 Report each mutation of sections 2 and 4 with the test that failed, in `review.md`.
- [x] 6.3 Replace the old 7-branch waiver for `gates.mjs` in the history with a waiver for its one phantom branch.
  - The new line names the marker evidence and the measured count.

## 7. Gates and review

- [x] 7.1 Run `make lint`.
- [x] 7.2 Run `make ratchet CHANGE=ledger-waiver`.
- [x] 7.3 Run `make gates CHANGE=ledger-waiver` until all gates pass.
- [x] 7.4 Run `/opsx:review ledger-waiver`.
