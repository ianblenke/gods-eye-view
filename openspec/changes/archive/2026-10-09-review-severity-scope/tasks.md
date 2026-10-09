## 1. Spec and tests

- [x] 1.1 Write the delta spec.
- [x] 1.2 Write the test for `change-review-034`.
  - Run one mutation for each pinned text of the test. Each mutation removes the text from the file of the agent. The test must fail.
- [x] 1.3 Write the test for `change-review-035`.
  - Run one mutation for each pinned text of the test. Each mutation removes the text from the file of the agent. The test must fail.
  - Run one mutation for each of the three old lines that the test lists as absent. Each mutation puts the line back in the file of the agent. The test must fail.
  - Run the mutation that adds a fifth major line to the severity list in the file of the agent. The test must fail.
- [x] 1.4 Write the test for `change-review-036`.
  - Run the mutation that replaces "`critical`, `major` or `minor`" with "`blocker` or `minor`" in rule 16 of `AGENTS.md`. The test must fail.
  - Run the mutation that adds the word "blocker" to rule 16 of `AGENTS.md`. The test must fail.

## 2. Guidance

- [x] 2.1 Change the severity instructions of the STE adversary.
- [x] 2.2 Change rule 16 of `AGENTS.md`.

## 3. Checks

- [x] 3.1 Run the host test of the file `review.test.mjs`.
- [x] 3.2 Run each other test file of `src/tooling/spec` on the host, except `gates.test.mjs`.
- [x] 3.3 Run the tests of `gates.test.mjs` that have `change-review-03` in their names on the host.
- [x] 3.4 Run the lint on the host.
- [x] 3.5 Run OpenSpec validate on the host.
- [ ] 3.6 Ask the lead to run make ratchet CHANGE=review-severity-scope in the image.
- [ ] 3.7 Ask the lead to run the two review agents.
- [ ] 3.8 Ask the lead to write review.md.
- [ ] 3.9 Ask the lead to run make gates CHANGE=review-severity-scope on the final tree.
