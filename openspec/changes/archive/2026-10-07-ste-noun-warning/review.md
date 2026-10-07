# Review: ste-noun-warning

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-10-07
Gates: make gates CHANGE=ste-noun-warning passed
Rounds: 3
Scope: diff 159d70d
Reviewed-Tree: 693716d57e53fe171362de9706acfd5d8bfc49fe20250b62402c9feb86bd3119

## Findings

Full agent reports: `review/round-1/`, `review/round-2/`, `review/spec-adversary.md`, `review/ste-adversary.md`.
The reviewers did not read the corrections after round 3 again. The lead ran the lint, the spec tool tests of the review, the QA register and the STE lint, and the format check after them.

### Round 1 (scope: full) - FAIL (spec-adversary PASS, ste-adversary FAIL)

- [x] FINDING major (ste-adversary, 2 findings) The spec said "single-word quoted identifier" and gave the prose message form for a test title, but the code skips each word that starts with a quote mark and writes the message `Test "<name>": check ...`. The proposal said "does not edit the trace ledger", which has two meanings. Corrected in round 2: the text matches the code, both literal messages are in the spec, and the proposal names `ids.json` and `links.json` and says that `gaps.json` has no edit.
- [x] FINDING minor (spec-adversary, 8 findings) Check 8 and the word rule of the spec adversary disagreed, the scope text of the STE adversary lost one exception, one finding could merge two severities, no instruction for `STE-NOUN`, missing Known limits, no test for quote and line cases, for the title cleaning of other rules and for the command status, and the equivalent mutant `?? []`. Corrected in round 2: guidance text, Known limits, new tests, scenario `ste-lint-027`, and the code no longer has `?? []`.
- [x] FINDING minor (ste-adversary, 11 findings) Wording faults: "permits", the quoted-identifier sentence, two names for the list, task sub-items without a verb, design wording, seven test titles, the wording of the guidance lines and a missing note for `nounVerbs`. Corrected in round 2.

### Round 2 (scope: diff 4e5b0a2) - FAIL (spec-adversary PASS, ste-adversary FAIL)

- [x] FINDING major (ste-adversary, 2 findings) Check 8 of the spec adversary ("a warning that concerns a scenario or a test") had two meanings. Step 7 of the review command gave all STE warnings, but the STE agent said only the warnings of changed files. Corrected in round 3: check 8 says "Do not report a warning", and step 7 gives the STE warnings for the changed files.
- [x] FINDING minor (spec-adversary, 8 findings) Step 7 and the changed files, the exception that needs the earlier findings, `<title>` against the test name and line 0, "an ADDED requirement" for two requirements, the other replacements of `cleanLine`, stale ratchet text, two mutation rows without task lines, and values of `nounVerbs` that are not a list. Corrected in round 3. The other replacements of `cleanLine` are in the Known limit `title-rules`.
- [x] FINDING minor (ste-adversary, 10 findings) Wording faults in the spec, the proposal, the design, the tasks, three test titles and the two agent files, with two minor items that the report cut for length. Corrected in round 3.

### Round 3 (scope: diff 159d70d) - PASS

- [x] FINDING minor (spec-adversary) The "Examples" lines of `.claude/agents/ste-adversary.md` read as examples of major findings. Corrected after round 3: the lines now follow the sentence about minor texts.
- [x] FINDING minor (spec-adversary) Steps 6, 7 and 9 of `.claude/commands/opsx/review.md` give neither the round number nor the folder, step 9 can read as a move after the agents run, and "the changed files" has two readings. Recorded as the Known limit `round-folder-input`. Accepted by Ian Blenke.
- [x] FINDING minor (spec-adversary) The change of the warnings for the STE adversary and the spec adversary was not named in the proposal and in decision D3. Corrected after round 3: both edits are named, and the Known limit `warnings-changed-files` records them. The lead tells the owner.
- [x] FINDING minor (spec-adversary) The text "A value that is not a list fails" is false for a null value. Corrected after round 3 in the Known limit `nounVerbs-unchecked`.
- [x] FINDING minor (spec-adversary) The requirement "Clean tagged test titles" had a test task and no code task. Corrected after round 3: task 2.11 is the code task.
- [x] FINDING minor (spec-adversary) The text named no commit for the ratchet after the round-2 corrections. Corrected after round 3: the commits `e9b1bf8`, `03d6954` and `5dfc701` are named.
- [x] FINDING minor (ste-adversary, 9 findings) The sentence about `cleanLine`, the order of the examples in the severity text, "fails" for a non-list value, a task with "lookup" and "quote", the test names in step 7 of the command, the number n of the round folder, "each of these commits", two phrases in the proposal and a missing "directly" in the `nounVerbsNote`. Corrected after round 3.
