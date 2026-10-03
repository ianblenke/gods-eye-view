## 1. Specs and tests

- [x] 1.1 Write the delta spec.
- [x] 1.2 Write the test for `ste-lint-020`.
  - Mutation: Remove the call that adds `STE-NOUN` to `findings`. The test must fail.
- [x] 1.3 Write the test for `ste-lint-021`.
  - Mutation: Replace `DETERMINERS.has(tokens[index].text.toLowerCase())` with `true`. The test must fail.
- [x] 1.4 Write the test for `ste-lint-022`.
  - Mutation: Keep the inner inline code text instead of the placeholder `CODE`. The test must fail.
  - Mutation: Replace the prose fence condition `inFence` with `false`. The test must fail.
  - Mutation: Replace `!/^["'“‘]/.test(tokens[index + 1].text)` with `true`. The test must fail.
  - Mutation: Replace `tokensOf(cleanLine(record.title), 0)` with `tokensOf(record.title, 0)`. The test must fail.
- [x] 1.5 Write the test for `ste-lint-023`.
  - Mutation: Replace the level `warning` of `STE-NOUN` with `error`. The test must fail.
- [x] 1.6 Write the test for `ste-lint-024`.
  - Mutation: Replace `nounVerbs.has(word)` with `true`. The test must fail.
- [x] 1.7 Write the test for `ste-lint-025`.
  - Mutation: Replace `new Set(words.nounVerbs ?? [])` with `new Set([])`. The test must fail.
  - Mutation: Replace `new Set(words.nounVerbs ?? [])` with `new Set(['read'])`. The test must fail.
- [x] 1.8 Write the test for `ste-lint-026`.
  - Mutation: Replace `nounVerbs.has(word)` with `nounVerbs.has(word.replace(/(?:['’]s|s['’]?|['’])$/, ''))`. The test must fail.

## 2. Code and guidance

- [x] 2.1 Add the noun verb list from the review quotes.
- [x] 2.2 Add the noun warning rule.
- [x] 2.3 Change the severity guidance of the STE adversary.
- [x] 2.4 Add the sentence about word faults to the spec adversary.
- [x] 2.5 Check each scenario with its mutations.
- [x] 2.6 Measure host coverage of the STE lint.
- [x] 2.7 Test all spec test files on the host.
- [x] 2.8 Check all prose with the lint command.
- [x] 2.9 Check the format of the files.
- [x] 2.10 Check that the gate test fixtures keep their old warning counts.

## 3. Gates and review

- [ ] 3.1 Run `make ratchet CHANGE=ste-noun-warning`.
- [ ] 3.2 Run `make gates CHANGE=ste-noun-warning`.
- [ ] 3.3 Run the spec adversary and the STE adversary.
- [ ] 3.4 Write `review.md` with the review result.
