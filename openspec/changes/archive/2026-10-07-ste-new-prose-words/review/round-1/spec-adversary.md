Verdict: FAIL
Tree: gev-work/ste-words, commit e1b64bb078e583017d1f33b0e72b03c3579f55f7, round 1, full scope. I ran no code or mutations.

- [ ] FINDING major scripts/spec/lib/ste.mjs:166 `Object.hasOwn` has no mutation row, and no test of this change tests it. `word in (words.newWords ?? {})` or `newWords[word]` passes every test. Then "constructor", "toString" or "valueOf" in new prose gives the error `Use "function Object()...", not "constructor"` (AGENTS rule 15). Add a scenario and a test for prose and a title with `constructor` and `toString` (no finding). Add the mutation row `in`.
- [ ] FINDING major openspec/changes/archive/2026-10-07-ste-new-prose-words/design.md:16 D1 makes the change under review old prose at the archive step. The doc-only corrections of rounds 2-3 (review.md step 10, step 11 Known limits) and the final gates (steps 3, 15) give only `WARN STE-WORD-OLD`. Nobody reads that warning. The spec adversary check 8 says "Do not report a warning". `.claude/agents/ste-adversary.md:27` says "Do not report" for words from words.json, and it has no text for `STE-WORD-OLD`. No Known limit names this; the two limits name titles only. Correct it in one of two ways. Either classify archive folders dated 2026-10-07 or later as new prose, and titles by `since` in ids.json. Or add a Known limit for Markdown, and tell the STE adversary to report each `STE-WORD-OLD` in a changed file.
- [ ] FINDING minor scripts/spec/lib/ste.mjs:290 titleRoot has one active change, so `[...changeIds.values()][0]` survives. Add a second active change with its own ID and a mutation row.
- [ ] FINDING minor scripts/spec/lib/ste.mjs:239 An ID in main and in an active delta (a MODIFIED scenario) makes an old title new. That is an error on the old titles of all scenarios of a modified requirement; 44 old titles have listed words today. No test pins it: the filter `!mainIds.has(id)` survives. No Known limit names it. Add the test and the limit, or exclude IDs in main.
- [ ] FINDING minor openspec/ste/words.json:93 `prior` is in `words` and in `newWords`. New prose gets two equal errors, and the `STE:` count doubles. Old prose gets an error and a warning, which contradicts "warnings in old prose" (only `existing-word-rule` names it). No test pins either. Remove it from `newWords` and from the ste-lint-036 literal, or pin it with a test.
- [ ] FINDING minor openspec/ste/words.json:104 The suggestions `executed`→`ran` and `exposed`→`shown` give "is ran" in the usual passive use. `explicitly` and `verification` are not on the owner's list, but ste-lint-036 calls the map "approved". Check the forms. Tell the owner.
- [ ] FINDING minor design.md:56 D4 cites a "scratch audit" outside the repo, and no hit counts are in the repo. Name the command that finds the hits. Add: quote an old banned title in a fenced block, because inline code over 4 words gives `STE-CODE-SPAN`.

Notes, not counted:
- `proposal.md:24` ("does not edit the trace files") is false: ids.json and links.json hold the new IDs. `review/ste-adversary.md` already reports it.
- No scenario covers a word list without `newWords` (`?? {}`). Only step 3 of ste-lint-035 pins it.
- The owner approved errors. This change gives warnings in old prose, and the finding on D1 shows the effect in the review flow. Tell the owner.
- The pre-archive `TRACE-FAILED-TEST` on navigation.test.mjs is not a finding. The final `make gates` after the archive must show only review errors.

What fits:
- Tests 028-039 make their WHEN and assert each THEN with literal values.
- Mutation rows exist for the path operands, the rule and level pairs, the tag logic, the defaults and the code exclusions.
- The map has 37 keys and all owner words, and no replacement is in `words`.
- No QA script covers ste-lint.
- ids.json and links.json are right, and history.jsonl has no line for this change.

Not read: gate output (only the lead's text), the 18 other spec-tool test files, `ci.mjs` (grep only), the unmerged branches, and the STE dictionary status of words.
Files: scripts/spec/lib/ste.mjs, openspec/ste/words.json, src/tooling/spec/ste.test.mjs, .claude/agents/ste-adversary.md.
