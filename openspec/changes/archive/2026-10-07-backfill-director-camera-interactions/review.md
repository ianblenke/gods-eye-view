# Review: backfill-director-camera-interactions

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-10-07
Gates: make gates CHANGE=backfill-director-camera-interactions passed
Rounds: 3
Scope: diff 86aa23f
Reviewed-Tree: c78119b4efbc14556de785e7a7fa55d65af356dec323f7e042568f8c4124d5ef

## Findings

Full agent reports: `review/round-1/`, `review/round-2/`, `review/spec-adversary.md`, `review/ste-adversary.md`.
The reviewers did not read the prose corrections after round 3 again. The lead ran the lint after them.

### Round 1 (scope: full) - FAIL (spec-adversary FAIL, ste-adversary FAIL)

- [x] FINDING major (spec-adversary, 3 findings) The limit sides 0.2 and 2048 survived a change by one step, scenario 057 "unsupported field" was tested only for the card list, and the state callback of the session had no scenario text. Corrected in pass 2: tests and rows at the limit sides, a reject test and a row for each field check, and THEN and AND lines for the state callback.
- [x] FINDING minor (spec-adversary, 8 findings) More mutations that survived, wrong audit rows, a test that patched a built-in prototype, a false sentence about old titles, no Known limits section, bare `assert.throws`, and the QA headers. Corrected in pass 2 or recorded as Known limits in the proposal.
- [x] FINDING major (ste-adversary, 6 findings) The words "inline", "legacy", "destination" and "action" had two meanings, one baseline sentence could mean "with none", and one evidence sentence was false. Corrected in pass 2.
- [x] FINDING minor (ste-adversary, 6 findings and 3 cut for length) Derived forms of the owner word "execute", 34 vague requirement sentences, second names, unclear titles, verbs used as nouns, and stale numbers. Corrected in pass 2.

### Round 2 (scope: diff 252a7ab) - FAIL (spec-adversary PASS, ste-adversary FAIL)

- [x] FINDING major (ste-adversary) The evidence listed one changed old title, but pass 2 changed five. Corrected in pass 3: the Title correction lists all five old and new titles.
- [x] FINDING major (ste-adversary) Scenario 051 said that numeric text is accepted only in versions 1 and 2, but anchors reject it. Corrected in pass 3: the scenario limits numeric text to pose fields.
- [x] FINDING major (ste-adversary) The title "The shot rejects an extra field" used "shot" for two things. Corrected in pass 3: the four sibling titles name the action field.
- [x] FINDING minor (spec-adversary, 10 findings) The split at 0.5, survivors in the session guard, the equivalence bound of m149, `Object.hasOwn`, version 1 numeric text, wrong audit rows, the callback state inside the adapter call, two tests tagged 060, the claim "can recover", and the list of old titles. Corrected in pass 3: tests, rows m250 to m257, a probe in the change folder, and the Known limit `session-builtin-patch`.
- [x] FINDING minor (ste-adversary, 10 findings) Titles with "Action", "validator", "abort signal", missing articles, numerals, tasks with several instructions, stale counts and -ing words. Corrected in pass 3.

### Round 3 (scope: diff 86aa23f) - PASS (spec-adversary PASS, ste-adversary PASS)

- [x] FINDING minor (spec-adversary) The audit rows m252 to m254 lay outside the table, the proposal named only m149 in `session-builtin-patch`, and the probe file was a script that no gate runs. Corrected after round 3: the rows are in the table, the proposal names m253 and its bound, and the Known limit `probe-file` records the probe.
- [x] FINDING minor (spec-adversary, 5 findings) A row that moves the state callback after the race is missing, scenario 048 has no AND line for the 0.55 test, the test of scenario 073 reads the signal only before the abort event, no test rejects pose text at version 4, and "of the same shot" in scenario 060 has two readings. Recorded as the Known limit `missing-rows-and-lines` in the proposal. Accepted by Ian Blenke.
- [x] FINDING minor (ste-adversary, 5 findings) Prose in the proposal, design and evidence: "stops throwing", "outside it", "a map callback spy", the warning count, the unit of latitude, and the claim for m253. Corrected after round 3.
- [x] FINDING minor (ste-adversary, 6 findings) Wording in the delta spec and in test titles: "of the same shot", "refuses adapter call", "and no content runs", "accepts a session change", "a camera stays a shot without a move", the abort event text, and verbs used as nouns in titles. These need a new ratchet and stay open: the Known limit `spec-wording-minors` records them. Accepted by Ian Blenke.
