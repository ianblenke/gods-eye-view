## 1. Specs and tests

- [x] Write the proposal, design and delta spec.
- [x] Keep the test for `gap-ledger-089`.
- [x] Keep the test for `gap-ledger-090`.
- [x] Write the test for `gap-ledger-091` before its code.
- [x] Run the code mutation for `gap-ledger-091` and record the failed test in validation.md.
- [x] Keep the test for `gap-ledger-092`.
- [x] Keep the test for `gap-ledger-093`.
- [x] Keep the test for `gap-ledger-094`.
- [x] Keep the test for `gap-ledger-095`.
- [x] Change the test for `gap-ledger-096` to cover a reached adopt line.
  - Run the mutation that skips the reached branch of `checkAdopts` and record the failed test in validation.md.
- [x] Change the test for `gap-ledger-097` to cover a reached adopt line.
  - Run the mutation that skips the reached branch of `checkAdopts` and record the failed test in validation.md.
- [x] Keep the test for `gap-ledger-098`.
- [x] Keep the test for `gap-ledger-099`.
- [x] Write the test for `gap-ledger-100` before its code.
- [x] Run the code mutation for `gap-ledger-100` and record the failed test in validation.md.
- [x] Write the test for `gap-ledger-101` before its code.
- [x] Run the code mutation for `gap-ledger-101` and record the failed test in validation.md.
- [x] Write the test for `gap-ledger-102` before its code.
- [x] Run the code mutation for `gap-ledger-102` and record the failed test in validation.md.
- [x] Write the test for `gap-ledger-103` before its code.
- [x] Run the code mutation for `gap-ledger-103` and record the failed test in validation.md.
- [x] Write the test for `gap-ledger-104` before its code.
- [x] Run the code mutation for `gap-ledger-104` and record the failed test in validation.md.
- [x] Write the test for `gap-ledger-105` before its code.
- [x] Run the code mutation for `gap-ledger-105` and record the failed test in validation.md.
- [x] Write the test for `gap-ledger-106` before its code.
- [x] Run the code mutation for `gap-ledger-106` and record the failed test in validation.md.

## 2. Test mutations

- [x] Test import paths with the graph mutations in muts.json.
- [x] Test the reached entry with the record and field mutations.
- [x] Test true coverage with the current and base operand mutations.
- [x] Test the absent base entry and literal false field with separate mutations.
- [x] Test absent paths with the code and path operand mutations.
- [x] Test other content with the content operand mutation.
- [x] Test valid counts with the count, total and limit mutations.
- [x] Test adopt lines that are not valid with the commit, field, path and error mutations.
- [x] Test the command and gate with both command mutations.

## 3. Code and checks

- [x] Write the import descendants helper, ledger extension and gate extension.
- [x] Check each operand with a separate mutation.
- [x] Measure coverage for each changed code file.
- [x] Add the command test names to the fixed guard test list.
- [x] Run all spec tests, STE lint and format checks.

## 4. Round 2

- [x] Write the tests for `gap-ledger-107` and `gap-ledger-108` before their code.
- [x] Add the base graph and the search states to the import descendants helper.
- [x] Test the old rule of `gap-ledger-103` with a file that the merged commit did not change.
- [x] Test the untrue allowance of `gap-ledger-104`.
- [x] Test that a reached adopt line that is not valid gives no count under `gap-ledger-105`.
- [x] Run each new graph mutation and record the failed test in validation.md.
- [x] Run each new ledger mutation and record the failed test in validation.md.
- [x] Run all mutations, tests, coverage, STE lint and format checks.
- [x] Write the final counts in validation.md.

## 5. Round 3

- [x] Write the tests for `gap-ledger-109` before its code.
- [x] Read the merged commit graph for each commit.
- [x] Run each mutation and record the failed test in validation.md.
- [x] Run tests, coverage, lint and format checks.

## 6. Gates and review

- [ ] Run the ratchet for this change.
- [ ] Run the gates for this change.
- [ ] Run both review agents.
- [ ] Write review.md with the upstream check when this change uses adopt.
