## 1. The specs

- [x] 1.1 Write the delta spec with the four changed scenarios and the requirement "Adoption of merged code".
- [x] 1.2 Write proposal.md with the counts of the merge commit and the known limits.
- [x] 1.3 Write design.md with the rules, the rejected options and the changed files.
- [x] 1.4 Add rule 21 for the command `adopt` to `AGENTS.md`.

## 2. The Git helpers

- [x] 2.1 Write the test for `resolveCommit` in `git.test.mjs`, with the tag `gap-ledger-090`.
  - Mutation: return the reference text and not the full hash. The test must fail.
- [x] 2.2 Write the test for `mergeParents` with a real merge, with the tags `gap-ledger-090` and `gap-ledger-096`.
  - Mutation 1: include the first parent of each merge commit. The test must fail.
  - Mutation 2: read all merge commits of HEAD, and not only the commits after the base. The test must fail.
- [x] 2.3 Write the test for `changedByCommit` with a file that only the fork changed, with the tag `gap-ledger-097`.
  - Mutation: compare the base commit with the merged commit, and not their merge base. The test must fail.
- [x] 2.4 Write `resolveCommit`, `mergeParents` and `changedByCommit` in `scripts/spec/lib/git.mjs` until 2.1 to 2.3 pass.

## 3. The tests of the ledger functions

For each test below, run the named mutation. Report the test that fails in `review.md`.

- [x] 3.1 Write the test for `gap-ledger-089` with `adoptLedger`, one code file and one test file.
  - Mutation 1: write the change name as the origin of an entry that exists. The test must fail.
  - Mutation 4: keep the closed names of the old entry of a test file. The test must fail.
  - Mutation 2: skip the loop of the test files. The test must fail.
  - Mutation 3: write `null` counts for a code file, or a count for a test file. The test must fail.
- [x] 3.2 Write the test for `gap-ledger-091` with a file that the merged commit did not change.
  - Mutation: remove the eligible condition from the loop of the code files, then from the loop of the test files. The test must fail for each.
- [x] 3.3 Write the test for `gap-ledger-095` with `adoptsOf` and one line for each condition.
  - The lines: the base history, another change name, another kind, a negative count, a count that is not whole, and a valid line.
  - Mutation: remove one condition at a time. One case must fail for each.
- [x] 3.4 Write the test for `gap-ledger-096` and `gap-ledger-097` with `checkAdopts`.
  - Mutation 1: give the commit error a wrong code. The test must fail.
  - Mutation 2: keep a line with a wrong commit in the valid lines. The test must fail.
  - Mutation 3: do not check the file. The test must fail.
- [x] 3.5 Write the test for `gap-ledger-092` with `compareWithBase`, a coverage entry and an entry of untraced tests.
  - Mutation 1: remove the adopted count from the check of an entry that the base does not have. The test must fail.
  - Mutation 2: allow a count above the adopted count. The test must fail.
  - Mutation 3: remove the condition for a file with the base content. The test must fail.
- [x] 3.6 Write the test for `gap-ledger-093` with a rise of the lines, the branches and the functions.
  - Mutation 1: remove the adopted count from the rule for the lines metric. The test must fail.
  - Mutation 2: remove it from the branch and function rule. The test must fail.
  - Mutation 3: use the smallest adopted count, and not the largest. The test must fail.
- [x] 3.7 Write the test for `gap-ledger-094` with more untraced tests in a file that the base has.
  - Mutation 1: remove the adopted count from the untraced check. The test must fail.
  - Mutation 2: count the names of the entry, and not its tests. The test must fail.
  - Mutation 3: count the tests above the base entry, and not all tests of the entry. The test must fail.
- [x] 3.8 Write the test for `gap-ledger-098` with an entry that has untrue coverage.
  - Mutation 1: ignore the mark of the adopt line. The test must fail.
  - Mutation 2: allow untrue coverage of a file with no adopt line. The test must fail.
- [x] 3.9 Change the test for `gap-ledger-021` with an entry that has a valid adopt line.
  - Mutation: replace the check of the adopted count for an entry that the base does not have with `true`. The test must fail.
- [x] 3.10 Change the test for `gap-ledger-022` with a rise above the adopted count.
  - Mutation: remove the adopted count from the message. The test must fail.
- [x] 3.11 Change the test for `gap-ledger-032` with an adopt line that has no mark for untrue coverage.
  - Mutation: remove the mark condition from the check of an entry that the base has. The test must fail.
- [x] 3.12 Change the test for `gap-ledger-040` with a rise above the adopted count.
  - Mutation: remove the adopted count from the message. The test must fail.

## 4. The code of the ledger functions

- [x] 4.1 Write `adoptsOf`, `checkAdopts` and `adoptedCounts` in `ledger.mjs` until 3.3 and 3.4 pass.
- [x] 4.2 Write `adoptLedger` in `ledger.mjs` until 3.1 and 3.2 pass.
- [x] 4.3 Write the adopted count in `compareWithBase` until 3.5 to 3.12 pass.
- [x] 4.4 Write the JSDoc of the new functions.
- [x] 4.5 Update the JSDoc of `compareWithBase`.

## 5. The command

- [x] 5.1 Write the fixture with a base commit, a branch with a new file and a merge commit.
  - The branch adds a code file with a gap and a test file with an untraced test.
  - The fork also adds a file that the branch does not change.
- [x] 5.2 Write the test for `gap-ledger-089` and `gap-ledger-091` in `gates.test.mjs`.
  - The test runs `adopt`, reads the history lines, runs the ratchet command and runs the check.
  - Mutation 1: write the head commit in the field `from`. The test must fail.
  - Mutation 2: adopt the file that only the fork changed. The test must fail.
  - The test also compares `ids.json` and `links.json` before and after `adopt`.
  - Mutation 4: write the links file in the `adopt` command. The test must fail.
  - Mutation 3: remove the stop for an error of the measurement. The test must fail.
- [x] 5.3 Write the test for `gap-ledger-090` with one case for each fault.
  - The test also compares `gaps.json` after each fault.
  - Mutation 2: write the ledger file in the code of a fault. The test must fail.
  - Mutation: remove each entry of the `faults` array, one at a time. The test must fail for each.
- [x] 5.4 Write the test for `gap-ledger-096` and `gap-ledger-097` with adopt lines that a person writes by hand.
  - Mutation: do not pass the errors of `checkAdopts` to the report. The test must fail.
- [x] 5.5 Write the test for `gap-ledger-099` in `ciFiles.test.mjs`, with the text of `Makefile`.
  - Mutation 1: remove `FROM_ARG` from the target. The test must fail.
  - Mutation 2: define `FROM_ARG` two times. The test must fail.
- [x] 5.6 Write the command `adopt` and the check of the adopt lines in `gates.mjs` until 5.2 to 5.4 pass.
- [x] 5.7 Write the target `adopt` and `FROM_ARG` in `Makefile` until 5.5 passes.
- [x] 5.8 Update the usage text and the JSDoc of `parseArgs`.

## 6. The scenarios that keep their text

- [x] 6.1 Keep the tests for `gap-ledger-048`, `gap-ledger-041`, `gap-ledger-056`.
- [x] 6.2 Keep the tests for `gap-ledger-023`, `gap-ledger-024`, `gap-ledger-025`.
- [x] 6.3 Keep the tests for `gap-ledger-026`, `gap-ledger-046`, `gap-ledger-030`.
- [x] 6.4 Keep the test for `gap-ledger-088`.

## 7. Coverage

- [x] 7.1 Keep `scripts/spec/lib/ledger.mjs` and `scripts/spec/lib/git.mjs` at 100% lines, branches and functions.
- [x] 7.2 Keep `scripts/spec/gates.mjs` at the counts of its ledger entry.
- [x] 7.3 Report each mutation of sections 2, 3 and 5 with the test that failed, in `review.md`.

## 8. Gates and review

- [x] 8.1 Run `make ratchet CHANGE=ledger-adopt`.
- [x] 8.2 Run `make lint`.
- [x] 8.3 Correct each STE error.
- [ ] 8.4 Run `make gates CHANGE=ledger-adopt`. The only errors must be review errors.
- [ ] 8.5 Run the review with `/opsx:review ledger-adopt`.
- [ ] 8.6 Write `review.md`.
