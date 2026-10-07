## 1. Specs and tests

- [x] 1.1 Write the delta spec.
- [x] 1.2 Write the test for `ste-lint-020`.
  - Run the mutation that removes the call that adds `STE-NOUN` to `findings`. The test must fail.
- [x] 1.3 Write the test for `ste-lint-021`.
  - Run the mutation that replaces `DETERMINERS.has(tokens[index].text.toLowerCase())` with `true`. The test must fail.
  - Run the mutation that replaces `DETERMINERS.has(tokens[index].text.toLowerCase())` with `DETERMINERS.has(lowered[index])`. The test must fail.
- [x] 1.4 Write the test for `ste-lint-022`.
  - Run the mutation that keeps the inner inline code text instead of the placeholder `CODE`. The test must fail.
  - Run the mutation that replaces the prose fence condition `inFence` with `false`. The test must fail.
  - Run the mutation that replaces `!/^["'“‘]/.test(tokens[index + 1].text)` with `true`. The test must fail.
  - Run the mutation that replaces `tokensOf(cleanLine(record.title), 0)` with `tokensOf(record.title, 0)`. The test must fail.
- [x] 1.5 Write the test for `ste-lint-023`.
  - Run the mutation that replaces the level `warning` of `STE-NOUN` with `error`. The test must fail.
- [x] 1.6 Write the test for `ste-lint-024`.
  - Run the mutation that replaces `nounVerbs.has(word)` with `true`. The test must fail.
- [x] 1.7 Write the test for `ste-lint-025`.
  - Run the mutation that replaces `new Set(words.nounVerbs)` with `new Set([])`. The test must fail.
  - Run the mutation that replaces `new Set(words.nounVerbs)` with `new Set(['read'])`. The test must fail.
- [x] 1.8 Write the test for `ste-lint-026`.
  - Run the mutation that replaces `nounVerbs.has(word)` with `nounVerbs.has(word.replace(/(?:['’]s|s['’]?|['’])$/, ''))`. The test must fail.

- [x] 1.9 Write the test for `ste-lint-027`.
  - Run the mutation that removes the call to `cleanLine` for titles. The test must fail.
- [x] 1.10 Test the reported line of the listed word.
  - Run the mutation that reports the determiner line. The test must fail.
- [x] 1.11 Test quotes inside and after a listed word.
  - Run the mutation that excludes each token with a quote. The test must fail.
  - Run the mutation that removes each double quote mark from the listed word before the call to `nounVerbs.has`. The test must fail.
- [x] 1.12 Test the lint command with a noun warning.
  - Run the mutation that makes the noun warning an error. The test must fail.

## 2. Code and guidance

- [x] 2.1 Add the list `nounVerbs` from the review quotes.
- [x] 2.2 Add the noun warning rule.
- [x] 2.3 Change the severity guidance of the STE adversary.
- [x] 2.4 Add the guidance text about word faults to the spec adversary.
- [x] 2.5 Check each scenario with its mutations.
- [x] 2.6 Measure host coverage of the STE lint.
- [x] 2.7 Test all spec test files on the host.
- [x] 2.8 Check all prose with the lint command.
- [x] 2.9 Check the format of the files.
- [x] 2.10 Check that the gate test fixtures keep their old warning counts.
- [x] 2.11 Replace inline code in tagged test titles with `CODE`.

The ratchet command ran at commits `e9b1bf8`, `03d6954` and `5dfc701`.
It wrote `ids.json` and `links.json`, but did not edit `gaps.json`.
The command `git show --stat` for each of these commits lists these files.

## 3. Gates and review

- [ ] 3.1 Run `make ratchet CHANGE=ste-noun-warning`.
- [ ] 3.2 Run `make gates CHANGE=ste-noun-warning`.
- [ ] 3.3 Run the spec adversary and the STE adversary.
- [ ] 3.4 Write `review.md` with the review result.
