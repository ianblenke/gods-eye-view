# Review: tampa-preset

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-10-11
Gates: make gates CHANGE=tampa-preset passed
Rounds: 1
Scope: full
Reviewed-Tree: 70c8cf491785135302e005742f9b01b8f1501b248f395aa77c59c292b3c6504d

## Findings

The reports of round 1 are `review/spec-adversary.md` and `review/ste-adversary.md`. Each file holds the final message of the agent.
Before the ratchet, the two agents reviewed the plan, the tests and the code three times (pre-reviews 1 to 3). The reports of pre-reviews 1 and 2 are outside the repository, in `/home/ianblenke/docker/gev-tools/tampa-preset/` (`pre1-spec.md`, `pre1-ste.md`, `pre2-spec.md`, `pre2-ste.md`). The reports of pre-review 3 exist only as messages of the agents. The last lines of the STE report of pre-review 2 were cut in the message that reached the lead.

Verdicts (spec adversary / STE adversary): pre-review 1 FAIL / FAIL; pre-review 2 FAIL / FAIL; pre-review 3 PASS / PASS; round 1 PASS / PASS.
The agents of the session kept the old severity instructions during these reviews. The brief of each review gave the severity rule of the owner, and the reports follow that rule.

### Plan pre-reviews 1 to 3

- [x] FINDING major (spec-adversary and ste-adversary) The proposal said that the table had nine presets. The table had ten before the change. Corrected.
- [x] FINDING major (spec-adversary) The proposal and the design said that the camera numbers follow the Austin and San Francisco presets. This is false for the airport, the stadium and Ybor City. Corrected: the text names the places that lie inside the values of the San Francisco preset and the places that have a steeper pitch or a larger range. The lead measured the ranges from the table.
- [x] FINDING minor (spec-adversary and ste-adversary) The voice function `findPoiByName()` and the preset geocoder match place names, so the plain name `Bank of America Plaza` would take a request for the same name in another city. Corrected: the first place is named `Bank of America Plaza, Tampa`. `evidence/name-collision.txt` runs both matchers before and after. The Known limits `name-match` and `label` record what is left.
- [x] FINDING major (ste-adversary) Scenario 006 listed the five places with no order, so it had two meanings. Corrected: the line says "in this order".
- [x] FINDING major (spec-adversary) An excerpt of `evidence/mutations-run.txt` held the `test at` line of the next test. Corrected: the extraction stops at the end of the block, and each block starts with its own `test at` line.
- [x] FINDING minor (spec-adversary) The loops of the test of `location-presets-006` came after the comparison of the whole preset, so they could not fail alone. Corrected: the loops come first.
- [x] FINDING minor (spec-adversary and ste-adversary) Faults missing for the third key of 001, the relational line of 003 and the names of the places 3 to 5. Corrected: there are 32 named faults, and two runs gave the same lines.
- [x] FINDING minor (spec-adversary and ste-adversary) The 33 related test files were not listed, and the evidence had no red-then-green run. Corrected: `evidence/host-checks.txt` lists the files and the command that makes the list, and `evidence/red-green.txt` has the run.
- [x] FINDING minor (spec-adversary and ste-adversary) Wording and Known limits: the CHANGELOG sentence of 32 words, "view box", "existing", "both presets", "a test run", the voice sentence, the limits `pill-width`, `label` and `scripts-as-text`, the files of `upstream-line`, the HUD tag, the line in `evidence/places.txt` for the new name, and task 1.3 that was no work. Corrected.
- [x] FINDING minor (spec-adversary and ste-adversary) The three minor findings of pre-review 3: the claim about the OpenStreetMap name in `evidence/places.txt`, the HUD text in the Known limit `label` without quotes, and the lint and validate lines of `evidence/host-checks.txt` that named an old commit. Corrected.

### Round 1 (scope full) - PASS / PASS

- [x] FINDING minor (ste-adversary) The Known limit `label` did not say that the row of places shows the same name. Corrected: one sentence added.
- [x] FINDING minor (spec-adversary) The claims of the Known limit `search` had no run in the evidence. Corrected: `evidence/name-collision.txt` has a section with eleven queries of the preset geocoder.
- [x] FINDING minor (spec-adversary) No test pins the answer of the preset geocoder for `Tampa` (scenario `location-presets-005` covers Taiwan only). Accepted by the lead: the answer comes from generic code that scenario 005 tests, the Known limit `search` names the change of behavior, and the evidence shows the queries.
- [x] FINDING minor (spec-adversary) `evidence/places.txt` said "view box" in the line for the Sunshine Skyway Bridge. Corrected to "view bounds". The STE adversary had left this old line as it was; the lead corrected the word because the file belongs to this change.

## Deviation from rule 1

- [x] FINDING minor (lead; both reviewers asked for this record) AGENTS.md rule 1 says that the spec changes before the code. The name of the first place changed in the code (commit 0f18d842) and in the test (commit bc525a6e) before the scenario changed (commit 5991e1c2). The lead found the name collision with a command on the running code, then changed the code, the test and the scenario in the same session. All three changed before the image ratchet, and three pre-reviews read the final texts.

## Own mistakes of the lead in this change

- [x] FINDING minor (lead) Several statements of the lead were false when written: "nine presets", the camera numbers that "follow" two presets, the tower height of 176 m from memory (the OpenStreetMap tag gives 178.87 m), and a count of 760 tests that came from a run that lost output. The lead now reads the code or runs a command before a sentence gives a count or a behavior.
- [x] FINDING minor (lead) The first coordinates of Bank of America Plaza, written from memory, were about 240 m from the OpenStreetMap point (computed from the two pairs of coordinates). The lead took all five coordinates from OpenStreetMap searches and recorded the results.
- [x] FINDING minor (lead) The first version of the fault script used `--test-force-exit`. In 5 of 112 fault runs the reporter lost the name of a failing test. The script now runs without the option, and `evidence/mutations-run.txt` records this.
- [x] FINDING minor (lead) Corrections of the lead made sentences of 26 to 30 words and paragraphs of 7 to 10 sentences. `make lint` found each one, and the lead corrected them.

## Record of the image ratchet

The lead ran the image ratchet with `make ratchet CHANGE=tampa-preset` in the Docker image `gods-eye-view:local` on commit `a55ccfda00508e03d702da167aececd666b6004b`. Its log starts with `docker run` and has the line `Command: ratchet`. The only error is the missing `review.md`. The code files and the test files did not change after that commit. The verdict lines are:

```text
Command: ratchet
Ownership: 12 owned, 4 upstream
Trace: 926 scenarios, 926 verified, 0 open. 9639 tests, 3716 traced, 5923 untraced.
Coverage: 1071 files, 304 complete, 53 not loaded, 0 untrue.
Owned gaps: 2 code files, 0 lines, 0 test files, 0 tests.
Upstream gaps: 765 code files, 46572 lines, 504 test files, 5923 tests.
COVERAGE-DIFF: 55 changed lines, 0 brought by the merged upstream commit, 55 need coverage.
Ratchet: 2 history lines for tampa-preset.
Ledger: 0 entries do not match the current gaps.
ERROR REVIEW-MISSING openspec/changes/tampa-preset/review.md Change tampa-preset has no review.md
```

The command `make gates-docs CHANGE=tampa-preset` on the archived tree trusted the snapshot of the same commit and gave the same only error.
