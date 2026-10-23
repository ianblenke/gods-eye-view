# Review: skyfi-source

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-10-23
Gates: make gates CHANGE=skyfi-source passed
Rounds: 3
Scope: diff e7960aad
Reviewed-Tree: 18f91fa35e8e257fecb36dccf857838ee8c8daa8ecb162321a027c607666210a

## Findings

A plan review came first (FAIL from both reviewers, at the plan commit 1629673b). The lead corrected its findings in the plan before the tests and the code. Its reports are outside the repository.

Round 1 had the scope full, at the commit 35af07d6. Both reviewers gave FAIL. The corrections changed documents only, so the lead moved the change back from the archive, restored `openspec/specs` from the ratchet commit, ran the ratchet again, and archived the change again (e7960aad).

Round 2 had the scope diff 35af07d6. The STE adversary gave PASS. The spec adversary gave FAIL with two major findings, and both were test gaps. The lead moved the change back again, added test samples and five faults, ran the faults (run 3), the host tests, the checks and the ratchet again, and archived the change again (f7593d7a).

Round 3 was a narrow confirmation round for the two major findings of round 2, with the scope diff e7960aad. Both reviewers gave PASS.

The reports of each round are in `review/round-<n>/`, and the reports of round 3 are also in `review/`. Each file holds the report in the shape of the reviewer.

### Round 1 (commit 35af07d6)

- [x] FINDING major (spec adversary) Scenario 018 never named the outer bracket pair that the code requires. Fixed: the scenario names an open bracket, one or more rings and a close bracket, and it says that a text with one pair of brackets around the positions does not meet the rule.
- [x] FINDING major (spec adversary) A sentence of `evidence/faults.txt` about the tab sample was false. Fixed: the sentence now says that the text does not meet the rule, so the plugin removes the scene.
- [x] FINDING major (STE adversary) The proposal and the design gave the date 2026-10-23 for the permission of the probe, and `evidence/probe.txt` gave 2026-10-22. Fixed: the owner allowed the probe on 2026-10-22, and the lead ran it on 2026-10-23.
- [x] FINDING minor (spec adversary) The spec said "no control character", but the code refuses only U+0000 to U+001F and U+007F. Fixed: the scenario names these code points.
- [x] FINDING minor (spec adversary) `Date.parse` also reads some times that are not in the ISO form. Fixed: the Known limit `time-format`.
- [x] FINDING minor (STE adversary) "network error and redirect give the same answer" had no clear referent. Fixed: the bullet gives the answer 502 and the error `upstream_failed`.
- [x] FINDING minor (STE adversary) The names "thumbnail link" and "URL" name the same text. Kept: the lead accepts this minor finding under the owner rule.
- [x] FINDING minor (STE adversary) The verb "keep" has several meanings, and "route" and "plugin" name the same actor in places. Kept: the lead accepts this minor finding under the owner rule. A new text of many scenarios needs another ratchet and can add a new fault.
- [x] FINDING minor (STE adversary) The arrow in the list of fields and some words need a check against the dictionary. Kept: the lead accepts this minor finding under the owner rule. The lint has 0 errors.

### Round 2 (commit e7960aad)

- [x] FINDING major (spec adversary) No test had the code points U+0000, U+001F and U+007F in a thumbnail link. Fixed: three bad links, and the faults "link without DEL refused", "link control up to 1e" and "link control from 1".
- [x] FINDING major (spec adversary) No test had more than one space between two numbers of a position. Fixed: a footprint with three spaces, and the fault "one space between numbers".
- [x] FINDING minor (spec adversary) The record of the faults named a commit, and the reviewer could not see if the code was the same. Fixed: `evidence/faults.txt` says that only the test file `src/data/skyfiScenes.test.mjs` changed in the folders server and src.
- [x] FINDING minor (spec adversary) The tests tried only the text `x` after the last bracket. Fixed: two footprints with a space or a line break at the end, and the fault "trailing white space accepted".
- [x] FINDING minor (STE adversary) Three sentences of `evidence/faults.txt` and one of the proposal were unclear. Kept: the lead accepts these minor findings under the owner rule.

### Round 3 (commit f7593d7a)

Both reviewers gave PASS. Each major finding of round 2 is closed.

- [x] FINDING minor (STE adversary) The count 143 and 145 in `evidence/faults.txt` is the count of run 2, and run 3 has 293 faults. Kept: the lead accepts this minor finding under the owner rule. The next lines give the five faults that run 3 adds.
- [x] FINDING minor (STE adversary) "five faults more than run 2" is an unusual order of words. Kept: the lead accepts this minor finding under the owner rule.
- [x] FINDING minor (STE adversary) One sentence of `evidence/faults.txt` does not say that the plugin must refuse the links and remove the footprints. Kept: the lead accepts this minor finding under the owner rule.

### Not fixed by name

The race of two scenes requests that meet before the search map holds the first search was an accepted minor finding of the review of `planet-source`. The code of `skyfi.js` is a copy of that code, so the same limit holds. The effect is one extra search, and the daily count counts both.
