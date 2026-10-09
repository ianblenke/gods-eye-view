## 1. Spec and tests

- [x] 1.1 Write the delta spec.
- [x] 1.2 Write the test for `change-review-034`.
  - Run the mutation that removes the sentence "Two possible meanings in other text are minor when the text is true under each meaning." from the file of the agent. The test must fail.
  - Run the mutation that removes the sentence "Other text includes evidence.md, tasks.md, the notes and tables of design.md, review.md and the title of a test." from the file of the agent. The test must fail.
- [x] 1.3 Write the test for `change-review-035`.
  - Run the mutation that replaces the word "major" with "minor" in the line "A banned word in normative text or in a test title." The test must fail.
  - Run the mutation that removes the line "A task that gives two instructions." from the file of the agent. The test must fail.
- [x] 1.4 Write the test for `change-review-036`.
  - Run the mutation that replaces "`critical`, `major` or `minor`" with "`blocker` or `minor`" in rule 16 of `AGENTS.md`. The test must fail.

## 2. Guidance

- [x] 2.1 Change the severity guidance of the STE adversary.
- [x] 2.2 Change rule 16 of `AGENTS.md`.

## 3. Checks

- [x] 3.1 Run the host test of the file `review.test.mjs`.
- [x] 3.2 Run the lint and OpenSpec validate on the host.
- [ ] 3.3 Ask the lead to run make ratchet CHANGE=review-severity-scope in the image.
- [ ] 3.4 Ask the lead to run the two review agents and write review.md.
- [ ] 3.5 Ask the lead to run make gates CHANGE=review-severity-scope on the final tree.
