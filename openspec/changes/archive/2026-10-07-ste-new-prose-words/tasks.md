## 1. Specs and tests

- [x] 1.1 Write the delta spec.
- [x] 1.2 Write the test for `ste-lint-028`.
  - Run the mutation that makes an active change old prose. The test must fail.
- [x] 1.3 Write the test for `ste-lint-029`.
  - Run the mutation that treats the archive as new prose. The test must fail.
- [x] 1.4 Write the test for `ste-lint-030`.
  - Run the mutation that treats an applied spec as new prose. The test must fail.
- [x] 1.5 Write the test for `ste-lint-031`.
  - Run the mutation that makes an agent file old prose. The test must fail.
- [x] 1.6 Write the test for `ste-lint-032`.
  - Run the mutation that removes the registry dates. The test must fail.
- [x] 1.7 Write the test for `ste-lint-033`.
  - Run the mutation that makes every tagged title new prose. The test must fail.
- [x] 1.8 Write the test for `ste-lint-034`.
  - Run the mutation that needs all tags to name new scenarios. The test must fail.
- [x] 1.9 Write the test for `ste-lint-035`.
  - Run the mutation that uses a fixed word map. The test must fail.
- [x] 1.10 Write the test for `ste-lint-036`.
  - Run the mutation that adds a word that the owner did not choose. The test must fail.
- [x] 1.11 Write the test for `ste-lint-037`.
  - Run the mutation that sets the level of an old prose warning to error. The test must fail.
- [x] 1.12 Write the test for `ste-lint-038`.
  - Run the mutation that checks text inside code. The test must fail.
- [x] 1.13 Write the test for `ste-lint-039`.
  - Run the mutation that changes the suggested word. The test must fail.

- [x] 1.14 Write the test for `ste-lint-040`.
  - Run the mutation that replaces `Object.hasOwn` with `in`. The test must fail.
- [x] 1.15 Write the test for `ste-lint-041`.
  - Run the mutation that changes the archive folder date comparison. The test must fail.
- [x] 1.16 Write the test for `ste-lint-042`.
  - Run the mutation that makes an old ID new. The test must fail.
- [x] 1.17 Write the test for `ste-lint-043`.
  - Run the mutation that treats an unknown ID as old. The test must fail.
- [x] 1.18 Write the test for `ste-lint-044`.
  - Run the mutation that replaces `words.newWordsFrom ?? ''` with `words.newWordsFrom ?? '9999-12-31'`. The test must fail.

- [x] 1.19 Write the test for `ste-lint-045`.
  - Run the mutation that removes the JSON error prefix. The test must fail.

## 2. Code and host checks

- [x] 2.1 Add the map of the words that the owner chose.
- [x] 2.2 Add the rule for `newWords`.
- [x] 2.3 Test each scenario with mutations.
- [x] 2.4 Measure host coverage.
- [x] 2.5 Test each spec tool file.
- [x] 2.6 Check the whole tree with the lint command.
- [x] 2.7 Run `node scripts/format.mjs --check`.
- [x] 2.8 Run `/home/ianblenke/docker/gev-tools/predispatch/predispatch.py` on the change documents.

## 3. Gates and review

- [ ] 3.1 Run `make ratchet CHANGE=ste-new-prose-words`.
- [ ] 3.2 Run `make gates CHANGE=ste-new-prose-words`.
- [ ] 3.3 Run the spec adversary and the STE adversary.
- [ ] 3.4 Write `review.md` with the review result.
