## 1. Specs and tests

- [x] Write the proposal.
- [x] Write the design.
- [x] Write the delta spec.
- [x] Write the test for `gap-ledger-136` before its code.
- [x] Write the test for `gap-ledger-137` before its code.
- [x] Write the test for `gap-ledger-138` before its code.
- [x] Write the test for `gap-ledger-139` before its code.
- [x] Write the test for `gap-ledger-140` before its code.
- [x] Write the test for `gap-ledger-141` before its code.
- [x] Write the test for `gap-ledger-142` before its code.
- [x] Write the test for `gap-ledger-143` before its code.
- [x] Write the test for `gap-ledger-144` before its code.
- [x] Add the test for an absent file with `gap-ledger-145`.
- [x] Add the test for the adopt line of the code file with `gap-ledger-146`.

- [x] Add the requirement "Total counts for adopted files".
- [x] Write the test for `gap-ledger-147` before its code.
- [x] Write the test for `gap-ledger-148` before its code.
- [x] Write the test for `gap-ledger-149` before its code.
- [x] Write the test for `gap-ledger-150` before its code.
- [x] Write the test for `gap-ledger-151` before its code.
- [x] Write the test for `gap-ledger-152` before its code.
- [x] Write the test for `gap-ledger-153` before its code.

## 2. Code and host checks

- [x] Add the adoptedAsIs predicate to the ledger functions.
- [x] Add valid adopted source evidence to the gate.
- [x] Run each spec test file on the host.
- [x] Measure coverage of both changed scripts.
- [x] Run each named mutation.
- [x] Run automatic mutations on the changed lines.
- [x] Replay the real CI data.
- [x] Run STE lint.
- [x] Commit the code, the tests and the change folder.

- [x] Add the total count predicate.
- [x] Run host tests.
- [x] Measure script coverage.
- [x] Run named mutations.
- [x] Run automatic mutations.
- [x] Replay the real CI data.
- [x] Run STE lint.
- [x] Check the JSON output of openspec show.
- [x] Validate the change with OpenSpec.
- [x] Compare document headings with the commit that design.md names.
- [x] Commit the pass 2 code and tests.

## 3. Lead image checks and review

- [ ] Run make ratchet CHANGE=vendored-coverage-tolerance in the image.
- [ ] Run make gates CHANGE=vendored-coverage-tolerance in the image.
- [ ] Run both review agents.
- [ ] Write review.md.

### Pass 3

- [x] Write the word table in design.md.
- [x] Write the test for `gap-ledger-154`.
- [x] Run the test for `gap-ledger-154` against commit 04554050.

- [x] Correct the eight spec findings of pre-review 1.
- [x] Correct the 43 STE findings of pre-review 1.
- [x] Change each tagged test for each changed scenario.
- [x] Write the tests of lines, branches and functions for gap-ledger-154 before its code.
- [x] Repeat the red test for gap-ledger-154.
- [x] Add neverWorseCounts.
- [x] Run the green test for gap-ledger-154.
- [x] Run the host checks that evidence.md lists under Host commands and verdicts.
- [x] Run each named mutation.
- [x] Run automatic mutations on the changed code.
- [x] Check each title that a document repeats against the live test titles with the repeated titles script.
- [x] Record the self-check in evidence.md.
- [x] Replay the real CI data on s3-replay3.
- [x] Commit the code, the tests and the change folder.

### Pass 4

- [x] Correct the glossary.
- [x] Correct the exception clauses.
- [x] Write the test for gap-ledger-155 before its code.
- [x] Add the total count guard.
- [x] Write the test for gap-ledger-156.

Historical record:

```text
Pass 4 wrote the test of gap-ledger-156 after the guard code; the mutation run showed the `||` mutant alive, and the test kills it; the red run is zero-red.log.
```

- [x] Run the logical operator mutation for gap-ledger-156.
- [x] Check the ratchet output in the gate test.
- [x] Run the host checks.
- [x] Run each named mutation.
- [x] Run automatic mutations.
- [x] Check each title that a document repeats against the live test titles.
- [x] Check each test title against its body.
- [x] Replay the real CI data on s3-replay4.
- [x] Check the JSON output of openspec show.
- [x] Validate the change with OpenSpec.
- [x] Compare document headings with commit 25ba5d2d.
- [x] Commit the code, the tests and the change folder.

### Pass 5

- [x] Correct the glossary before the other document edits.
- [x] Correct the pre-review 3 findings.
- [x] Strengthen the test for gap-ledger-155.
- [x] Run both wrong metric key mutations before the green ledger test.
- [x] Read each changed sentence against the code.
- [x] Check all changed titles against their assertion calls.
- [x] Check the repeated document titles.
- [x] Check banned words and their forms.
- [x] Run the ledger test file.
- [x] Measure ledger coverage.
- [x] Run the mutation generator on the changed comment lines.
- [x] Compare the code AST with parent commit 9357d762.
- [x] Replay the real CI data on s3-replay5.
- [x] Run all 240 gate titles with complete output reports.
- [x] Repeat the three gate runs that stopped before the end.
- [x] Measure gate coverage.
- [x] Check the JSON output of openspec show.
- [x] Validate the active change with OpenSpec.
- [x] Diff the level 2 and level 3 headings against parent commit 9357d762.
- [x] Record the Pass 5 evidence.
- [x] Run STE lint after each correction group.
