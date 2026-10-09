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

Pass 4 wrote the test of gap-ledger-156 after the guard code.
Before this test, the `||` mutation made no test fail.
The test fails with that mutation; proof-pass7.json records that run for mutation gap-ledger-156.
This order differs from spec-first.
The lead decides in review.md whether to accept it by name.

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
- [x] Compare the level 2 and level 3 headings with parent commit 9357d762.
- [x] Record the Pass 5 evidence.
- [x] Run STE lint after each correction group.

### Pass 6

- [x] Restore the file scope of the three count rules for D1.
- [x] Restore the checked change in the glossary rows for D2.
- [x] Correct the stale rule pointers for D3.
- [x] Remove the prose fence for D4.
- [x] Name the mutation run for D4.
- [x] Restore the Pass 4 table row.
- [x] Restore the Pass 4 command fences.
- [x] State the per-run limits and metric limits for D6.
- [x] Move the metric condition before THEN for D7.
- [x] Change four test titles for D7.
- [x] Correct the two code comment lines for D8.
- [x] Correct the glossary rows and prose for D9.

### Pass 7

- [x] Correct the file scope and metric scope for G1 and G2.
- [x] Correct the glossary cases and base limit for G3 and G4.
- [x] Correct the scope record, proof citation and task record for G5.
- [x] Correct the listed prose and test title for G6.
- [x] Run the scope check.
- [x] Run the title checks.
- [x] Run both host test files.
- [x] Measure coverage of ledger.mjs and gates.mjs.
- [x] Run the logical operator mutation for gap-ledger-156.
- [x] Run STE lint.
- [x] Run the banned word check.
- [x] Compare the level 2 and level 3 headings with commit fa34f8cb.
- [x] Check the JSON output of openspec show.
- [x] Validate the change with OpenSpec.
- [x] Replay the four coverage targets.
- [x] Record the Pass 7 evidence.

### Pass 8

- [x] Correct the pre-review 6 prose.
- [x] Split the Pass 6 and Pass 7 tasks.
- [x] Write the metric test for gap-ledger-154.
- [x] Run the five metric key mutations.
- [x] Run the ledger test file.
- [x] Run the gates test file.
- [x] Measure coverage of both scripts.
- [x] Check the local file scope of both requirements.
- [x] Check the repeated titles.
- [x] Check the new test clauses.
- [x] Run STE lint.
- [x] Check the banned word forms.
- [x] Check the JSON output of openspec show.
- [x] Validate the change with OpenSpec.
- [x] Replay the four coverage targets.
- [x] Compare the level 2 and level 3 section titles.
- [x] Record the Pass 8 evidence.

### Pass 9

- [x] Rename the two test titles.
- [x] Run the seven metric mutations.
- [x] Correct the design text.
- [x] Correct the spec text.
- [x] Correct the proposal text.
- [x] Correct the evidence prose.
- [x] Change the scope-check script.
- [x] Name the metric in scenario 142.
- [x] Print the title of the test at ledger.test.mjs line 1688.
- [x] Print the six body assertions of the test at ledger.test.mjs line 1688.
- [x] Run the host checks.

### Pass 10

- [x] Correct the faults that pre-review 8 found.
- [x] Run the ledger host test.
- [x] Run STE lint.
- [ ] Check the JSON output of openspec show.
- [x] Validate the change with OpenSpec.

### Pass 11

- [x] Correct the faults that pre-review 9 found.
- [x] Run the ledger host test.
- [x] Check the JSON output of openspec show.

### Pass 12

- [x] Correct the major faults that pre-review 10 found.
- [x] Run the ledger host test.
- [x] Run STE lint.
- [x] Check the JSON output of openspec show.
- [x] Validate the change with OpenSpec.
