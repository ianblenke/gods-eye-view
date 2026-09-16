# Review: remove-classification-banner

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-09-16
Gates: make gates CHANGE=remove-classification-banner passed
Rounds: 4
Scope: full
Reviewed-Tree: ea00361e09eb49de3166d52cac4acc5a7e25f139f0eb12cf67bf250f3b704f1d

The output of each round is in `review/round-<n>/`. The output in `review/` is the output of round 4, where both agents gave the verdict PASS.

The number of findings decreased in each round: 20 in round 1, 12 in round 2, 4 in round 3 and 3 in round 4. Round 2, round 3 and round 4 read only the corrections of the round before. No commit records the tree of a round, because the branch has one commit for the change.

After the verdict PASS of round 4, the author corrected the three minor findings of that round. Step 11 of `/opsx:review` permits this. The corrections changed only prose: two lines of the delta spec, two lines of the proposal and one task.

## Findings

### Round 1: spec-adversary

- [x] F1 major The test compared the markings with case. The HUD has the rule `text-transform: uppercase`, so "Top Secret" passed the test and the user saw "TOP SECRET". The test now compares in upper case.
- [x] F2 major The claim "the center part stays in the middle" was not true with `justify-content: space-between` and an empty left part. The change now gives the two parts `flex: 1 1 0`, and `hud-markings-003` checks the rule.
- [x] F3 major The test read two files. It now reads seven HUD files. Known limit `hud-markings-file-scope`.
- [x] F4 minor The two module comments of `src/hud.js` no longer name classification banners.
- [x] F5 minor The style rule check moved to its own scenario `hud-markings-004`, under the first requirement.
- [x] F6 minor The proposal now gives the real line counts.
- [x] F7 minor The gate output of each later round is complete.

### Round 1: ste-adversary

- [x] S1 to S13 All 13 findings corrected in the proposal, the design, the tasks, the delta spec and one test name. The corrections include: the rule and its selector line in task 1.6; "not correct" in place of "false"; "one of the markings"; the group rule name in the design; "checks the words"; and an AND line for each check that a scenario did not give.

### Round 2: spec-adversary

- [x] F1 major The new rule `.hud-top-bar-right { text-align: right; }` had no scenario and no test. The requirement, `hud-markings-003` and the test now cover it.
- [x] F2 minor The proposal now writes "four comment lines".
- [x] F3 minor Each AND line now names one file.
- [x] F4 minor The marking "CLASSIFIED" stopped the build for the correct open marking "UNCLASSIFIED". The test now uses `(?<!UN)CLASSIFIED`.

### Round 2: ste-adversary

- [x] S1 to S8 All eight findings corrected: the line count, "in any letter case", the file name in each AND line, the last use of "false", "the same width" in the tasks and the test name, "a rule without `flex: 1 1 0`", and a Purpose without a phrasal verb.

### Round 3: spec-adversary (Verdict: PASS)

- [x] F1 minor The requirement now names "UNCLASSIFIED" as the only exception, and the AND line now writes "the two letters before".

### Round 3: ste-adversary

- [x] S1 major The AND line now writes "the two letters before "CLASSIFIED" are not "UN"", which is what the test does.
- [x] S2 minor The AND line for the right part now names `text-align: right`.
- [x] S3 minor The proposal and the tasks now name the text of the right part.

### Round 4: spec-adversary (Verdict: PASS)

- [x] No finding.

### Round 4: ste-adversary (Verdict: PASS)

- [x] S1 minor The AND line now writes "in its own rule for the right part", because a group rule for the two parts also exists.
- [x] S2 minor The known limit `hud-markings-width-not-measured` now names the two CSS rules and the text of the right part.
- [x] S3 minor The four places now write "at the right edge".
