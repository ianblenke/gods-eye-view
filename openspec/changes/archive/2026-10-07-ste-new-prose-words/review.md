# Review: ste-new-prose-words

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-10-07
Gates: make gates CHANGE=ste-new-prose-words passed
Rounds: 3
Scope: diff c6af7eb
Reviewed-Tree: c62ab9b1ad4d5f62b5908f679d879d284e4df38c212c3a69dbce9da2a0773d1c

## Findings

Full agent reports: `review/round-1/`, `review/round-2/`, `review/spec-adversary.md`, `review/ste-adversary.md`.
The reviewers did not read the corrections after round 3 again. The lead ran the lint, the predispatch check and the format check after them.

### Round 1 (scope: full) - FAIL (spec-adversary FAIL, ste-adversary FAIL)

- [x] FINDING major (spec-adversary, 2 findings) The guard `Object.hasOwn` had no test and no mutation row, and the change under review became old prose at the archive step, so later rounds and the final gates gave only warnings. Corrected in round 2: scenario `ste-lint-040` and its mutation row, and the rule now depends on the cutoff date `newWordsFrom` and on the trace registry.
- [x] FINDING major (ste-adversary, 3 findings) The proposal said that the change does not edit the trace files, "a listed word" had two meanings, and "the approved words" had two meanings. Corrected in round 2.
- [x] FINDING minor (spec-adversary, 5 findings) The `titleRoot` code, a modified scenario that made old titles new, the duplicate `prior`, past-form suggestions that read "is ran", and a design note that cited a file outside the repository. Corrected in round 2.
- [x] FINDING minor (ste-adversary, 10 findings) Wording faults in the documents and the test titles. Corrected in round 2.

### Round 2 (scope: diff edd90f9) - FAIL (spec-adversary FAIL, ste-adversary FAIL)

- [x] FINDING major (spec-adversary) A new test that names only old IDs gives only the warning for its words. Recorded as the Known limit `titles-of-old-ids` in the proposal. Accepted by Ian Blenke.
- [x] FINDING major (ste-adversary) The test title "gives errors for unknown IDs and an absent registry" had two meanings. Corrected in round 3: the title says "gives an error for a word in a title with an unknown ID or an absent registry".
- [x] FINDING minor (spec-adversary, 7 findings) Only `constructor` reaches the guard, a `since` value that is absent or not a string gave old prose, invalid JSON in `ids.json` crashed the lint, a missing `date-cutoff` limit, two dead operands, Known limits in the design and not in the proposal, and open task boxes. Corrected in round 3: the code checks the type of `since`, scenario `ste-lint-045` gives a named error, the dead operands of the Markdown rule are gone, and the Known limits are in the proposal.
- [x] FINDING minor (ste-adversary, 8 findings) Test titles, terms, the commit in the design and tasks without a code change. Corrected in round 3.

### Round 3 (scope: diff c6af7eb) - PASS

- [x] FINDING minor (spec-adversary, 7 findings) The `date-cutoff` limit was stale, `titles-of-old-ids` did not say that the agent file needs a later change, no limit named the hand edits of dates, the old specs that still hold the words, the dead default `?? ''` of the title rule, test 045 that checks only the prefix with a raw TypeError for valid JSON `null`, and the open task boxes. Corrected after round 3 in the proposal, the design and the tasks: the Known limits `titles-of-old-ids`, `date-cutoff`, `hand-edited-dates`, `old-spec-words`, `registry-shape` and `dead-default-operand`, and the boxes 2.5 and 2.7. The code operand and the check of the parser reason stay as they are. Accepted by Ian Blenke.
- [x] FINDING minor (ste-adversary, 9 findings) A false sentence about `harden-timing-tests`, "absent" for "missing", the -ing words, the phrasing of the Known limits, and wording of the delta spec and of three test titles. Corrected after round 3 in the proposal, the design and the tasks. The wording faults in the delta spec (the lines for `ste-lint-044`, `ste-lint-045`, `ste-lint-043`, `ste-lint-033`) and in the three test titles need a new ratchet and stay open. Accepted by Ian Blenke.
