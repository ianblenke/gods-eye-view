# Review: cyclones-early-advisory

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-10-11
Gates: make gates CHANGE=cyclones-early-advisory passed
Rounds: 2
Scope: diff c085ba4c5b4cad7876d98c6ef72b0e0f47f26051
Reviewed-Tree: 567cea75356de9109e2936ef6eae101ee5ddfa8cdf63ed0ee6f82005ccbebbb5

## Findings

The reports of round 1 are in `review/round-1/`. The reports of round 2 are `review/spec-adversary.md` and `review/ste-adversary.md`. Each file holds the final message of the agent.
Before the ratchet, the two agents reviewed the plan twice (pre-reviews 1 and 2). The corrections are in the commits 3495a7e9 and 2685df14, and the file `/home/ianblenke/docker/gev-tools/cyclones-early/pre2-brief.md` lists them. The lead did not save the verdicts of the pre-reviews as files.

Verdicts (spec adversary / STE adversary): round 1 FAIL / FAIL; round 2 PASS / PASS.
The agents of the session kept the old severity instructions during these reviews. The brief of each round gave the severity rule of the owner, and the reports follow that rule.

### Round 1 (scope full) - FAIL / FAIL

- [x] FINDING major (spec-adversary and ste-adversary) The Known limit `row-time` said that `snapshotAgeSec()` makes the age label of the layer row show "just now". The row calls `_timeAgo()` in `src/ui/layerPanel.js`, which gives "just now" for any age under 5 seconds. Corrected: the bullet names `_timeAgo()` and, as a second path, the field `ageLabel` of the layer snapshot. The lead read `layerPanel.js` and `getStats()` in `src/layers/cyclones/index.js`.
- [x] FINDING major (spec-adversary and ste-adversary) `evidence/host-checks.txt` said that the evidence files and the documents changed in later commits only. The stacking merge a835553e brings the code and tests of change `vite-deny-runtime-state`. Corrected: line 1 says so, and a new last section runs the four checks of `make precheck`, the two cyclone test files and the lint on the commit cd5716e2 (all pass).
- [x] FINDING major (ste-adversary) `design.md` said that `iso()` checks every time of the status file. It checks the two values that `parseCycloneStatus()` gives to it (`server/providers/cyclones.js` lines 105 and 107). Corrected.
- [x] FINDING minor (spec-adversary) "The two changed lines" was not exact. Corrected: "The two changed code lines".
- [x] FINDING minor (spec-adversary) The Why compared `publicAdvisory.fileUpdateTime` with a field that it did not name. Corrected: the Why names `lastUpdate` and says which field the parser reads as the advisory time and which as the position time.
- [x] FINDING minor (spec-adversary) The 26-minute case has no fault of its own. Accepted by the lead: one window cannot reject 26 minutes and accept 90 minutes, so no fault of the window isolates the case. The spec adversary withdrew the finding in round 2. The fault "Restore the old limit of 5 minutes" fails the test that holds both cases.
- [x] FINDING minor (spec-adversary and ste-adversary) The CHANGELOG entry had no date. Corrected: the entry has the date 2026-10-10, the local date, like the entry of the change `vite-deny-runtime-state`. The archive folder and the trace use the UTC date 2026-10-11. Both dates are right for their purpose.
- [x] FINDING minor (ste-adversary) "By the maintainer" had no evidence. Corrected: "by the owner of the upstream repository", and `evidence/upstream-hunk.txt` records the author (`gh pr view 741 --json author,state,headRefOid`).
- [x] FINDING minor (ste-adversary) `evidence/live-feed.txt` named the old parser "of main" with no commit, and said that the lead chose all clocks. Corrected: the commit 6e54707e (the blob fede1aad), and rows 1 and 2 are headers of the response. The proposal says "five clocks".
- [x] FINDING minor (ste-adversary) "Faults of the window" in the design and in task 3.3 left out the two fields. Corrected in both files.
- [x] FINDING minor (ste-adversary) The word "file" had two meanings in the Why and in the CHANGELOG entry, and some words were not simple ("whenever", "runs slow", "runs fast"). Corrected: "status file", "when", "is more than 63 minutes behind the real time", "is ahead of the real time".

### Round 2 (scope diff c085ba4c) - PASS / PASS

The minor findings below were corrected after the round. The last four stay open by name. The lead accepts each of them. None is major under the owner rule.

- [x] FINDING minor (ste-adversary) `design.md` line 5 said "the whole file" after the correction of line 4. Corrected: "the whole status file".
- [x] FINDING minor (ste-adversary) The age label of `src/data/layerSnapshot.js` is the field `ageLabel` of the layer snapshot. Corrected in the Known limit `row-time`.
- [x] FINDING minor (spec-adversary and ste-adversary) Wording in `evidence/host-checks.txt`: "the checks below", "the tests below", "merged commit", and the missing reason for `openspec validate`. Corrected: line 1 says "the first sections", the last section says "the commit cd5716e2" and "the checks below", and line 1 says that `openspec validate` does not accept an archived change.
- [x] FINDING minor (ste-adversary) The lead rewrote line 1 of `evidence/host-checks.txt` and did not keep it. Accepted by the lead: the measured lines are unchanged, and the removed clause was a forward claim that became false. The STE adversary rates it minor.
- [x] FINDING minor (spec-adversary and ste-adversary, accepted in both rounds) "Gives the storm" in the THEN line of `cyclones-026` has one meaning (the function returns the storm). A change of scenario text needs a new image ratchet.
- [x] FINDING minor (ste-adversary) The words "stamp" and "nominal" are in no word list. Accepted by the lead: the lint reports no error, and the title of upstream pull request #741 uses "nominal".
- [x] FINDING minor (ste-adversary) The Known limit `window` and the word "limit" name one value in two ways. Accepted by the lead: both readings are true, and the text is not normative.

## The stack and the merge of main

The branch held the merge a835553e of change `vite-deny-runtime-state` (PR #30) while that change was under review. The image ratchet on this branch gave the errors `LEDGER-TOTALS-NOT-BASE` for `src/layers/traffic/flow.js` and `src/layers/traffic/surface.js`. Change `vite-deny-runtime-state` records new branch totals for these two files, and the base of the gate (origin/main) did not hold them yet.
PR #30 merged into main (168b129a). The lead merged main into this branch (the commit 24d19643). The merge was clean, and it brings only files of change `vite-deny-runtime-state`. The reviewers did not read the merge. After the merge, `git diff origin/main HEAD --stat` lists only the files of this change.

## Own mistakes of the lead in this change

- [x] FINDING minor (lead) Several sentences of the lead were false when written: the first Why ("every storm disappears"; the server sends the last good snapshot), the direction of the clock in the Known limit `window` (flipped once), the place of the age label (a storm card, then the wrong function), the claim in `host-checks.txt` and the words "every time of the status file". The lead now reads the code line before a sentence says what the code does.
- [x] FINDING minor (lead) Corrections of the lead made a sentence of 28 words and a paragraph of 7 sentences. `make lint` found both, and the lead split them.
- [x] FINDING minor (lead) The lead stacked this branch on the branch of change `vite-deny-runtime-state` so that Docker was not idle. The stack caused the two ledger errors in the ratchet and a wrong claim in `evidence/host-checks.txt`. The lead cleared the errors by merging main after PR #30.

## Record of the image ratchet

The lead ran the image ratchet with `make ratchet CHANGE=cyclones-early-advisory` in the Docker image `gods-eye-view:local` on commit `a835553eee93c573def5a2ef784bcffd5c1b4eab` (the stacking merge). Its log starts with `docker run` and has the line `Command: ratchet`. The code files and the test files did not change after that commit. The verdict lines are:

```text
Command: ratchet
Ownership: 34 owned, 5 upstream
Trace: 923 scenarios, 923 verified, 0 open. 9636 tests, 3713 traced, 5923 untraced.
Coverage: 1071 files, 304 complete, 53 not loaded, 0 untrue.
Owned gaps: 2 code files, 0 lines, 0 test files, 0 tests.
Upstream gaps: 765 code files, 46572 lines, 504 test files, 5923 tests.
COVERAGE-DIFF: 15 changed lines, 0 brought by the merged upstream commit, 15 need coverage.
Ratchet: 2 history lines for cyclones-early-advisory.
Ledger: 0 entries do not match the current gaps.
ERROR LEDGER-TOTALS-NOT-BASE src/layers/traffic/flow.js
ERROR LEDGER-TOTALS-NOT-BASE src/layers/traffic/surface.js
ERROR REVIEW-MISSING openspec/changes/archive/2026-10-11-vite-deny-runtime-state/review.md
ERROR REVIEW-MISSING openspec/changes/cyclones-early-advisory/review.md
```

The two `LEDGER-TOTALS-NOT-BASE` errors and the first `REVIEW-MISSING` error come from the stack (see the section above). The 15 changed lines include the 11 lines of change `vite-deny-runtime-state`.
