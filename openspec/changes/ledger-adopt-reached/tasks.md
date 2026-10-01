## 1. Specs and tests

- [x] Write the proposal, design and delta spec.
- [x] Keep the test for `gap-ledger-089`.
- [x] Keep the test for `gap-ledger-090`.
- [x] Write the test for `gap-ledger-091` before its code.
- [x] Run the code mutation for `gap-ledger-091`. Report the failed test.
- [x] Keep the test for `gap-ledger-092`.
- [x] Keep the test for `gap-ledger-093`.
- [x] Keep the test for `gap-ledger-094`.
- [x] Keep the test for `gap-ledger-095`.
- [x] Change the test for `gap-ledger-096` to cover a reached line.
  - Run the mutation that skips the reached branch of `checkAdopts`. The test must fail.
- [x] Change the test for `gap-ledger-097` to cover a reached line.
  - Run the mutation that skips the reached branch of `checkAdopts`. The test must fail.
- [x] Keep the test for `gap-ledger-098`.
- [x] Keep the test for `gap-ledger-099`.
- [x] Write the test for `gap-ledger-100` before its code.
- [x] Run the code mutation for `gap-ledger-100`. Report the failed test.
- [x] Write the test for `gap-ledger-101` before its code.
- [x] Run the code mutation for `gap-ledger-101`. Report the failed test.
- [x] Write the test for `gap-ledger-102` before its code.
- [x] Run the code mutation for `gap-ledger-102`. Report the failed test.
- [x] Write the test for `gap-ledger-103` before its code.
- [x] Run the code mutation for `gap-ledger-103`. Report the failed test.
- [x] Write the test for `gap-ledger-104` before its code.
- [x] Run the code mutation for `gap-ledger-104`. Report the failed test.
- [x] Write the test for `gap-ledger-105` before its code.
- [x] Run the code mutation for `gap-ledger-105`. Report the failed test.
- [x] Write the test for `gap-ledger-106` before its code.
- [x] Run the code mutation for `gap-ledger-106`. Report the failed test.

## 2. Test mutations

- [x] Test import paths with the graph mutations in muts.json.
- [x] Test the reached entry with the record and mark mutations.
- [x] Test true coverage with the current and base operand mutations.
- [x] Test the absent base entry and literal false mark with separate mutations.
- [x] Test absent paths with the code and path operand mutations.
- [x] Test other content with the content operand mutation.
- [x] Test valid counts with the count, total and limit mutations.
- [x] Test invalid adopt lines with the commit, mark, path and error mutations.
- [x] Test the command and gate with both command mutations.

## 3. Code and checks

- [x] Write the import descendants helper, ledger extension and gate extension.
- [x] Check each operand with a separate mutation.
- [x] Measure coverage for each changed code file.
- [x] Add the command test name to the fixed guard test list.
- [x] Run all spec tests, STE lint and format checks.

## 4. Round 2

- [x] Write the tests for `gap-ledger-107` and `gap-ledger-108` before their code.
- [x] Add the base graph and the search states to the import descendants helper.
- [x] Test the old rule of `gap-ledger-103` with a file that the merged commit did not change.
- [x] Test the untrue allowance of `gap-ledger-104`.
- [x] Test that an invalid reached adopt line gives no count under `gap-ledger-105`.
- [x] Run each new graph mutation. The test must fail.
- [x] Run each new ledger mutation. The test must fail.
- [x] Run all mutations, tests, coverage, STE lint and format checks.
- [x] Write the final counts in validation.md.

## 5. Gates and review

- [ ] Run the ratchet for this change.
- [ ] Run the gates for this change.
- [ ] Run both review agents.
- [ ] Write review.md with the upstream check when this change uses adopt.
