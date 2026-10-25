# Review: bump-node-brotli-fix

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-10-25
Gates: make gates CHANGE=bump-node-brotli-fix passed
Rounds: 2
Scope: diff add86d24
Reviewed-Tree: 8b6ec41a5452def9e805b5ec537f47429e5b62bdbaf17647d5fc3eae4ec8843c

## Findings

Round 1 had the scope full, at the commit add86d24. Both reviewers gave FAIL. The corrections changed the spec, the test, CHANGELOG.md and the prose. So the lead moved the change back from the archive, restored `openspec/specs/ci-gates/spec.md` from main, ran the faults again, ran the ratchet again, and archived the change again (93409e47).

Round 2 had the scope diff add86d24. It was a narrow confirmation of the round 1 findings. Both reviewers gave PASS.

The reports of each round are in `review/round-<n>/`, and the reports of round 2 are also in `review/`. Each file holds the report in the shape of the reviewer.

### Round 1 (commit add86d24)

- [x] FINDING major (spec adversary) The scenario said "or a later line" and refused 25.0.0. Fixed: the scenario says "a version of a line after 26 is accepted" and refuses 25.0.0.
- [x] FINDING major (spec adversary) The requirement allowed any release with the fix, but the test refuses the line 22. Fixed: the requirement names the line 24, the line 26 and a line after 26, and the scenario refuses 22.23.4.
- [x] FINDING major (STE adversary) The advice of CHANGELOG.md "24.22.1 or later" included the line 25. Fixed: the advice names a later release of the line 24 and of the line 26.
- [x] FINDING minor (spec adversary) No sample had a patch above the fixed patch. Fixed: the samples 24.22.2 and 26.12.2, and the fault "patch === first[1]" is killed.
- [x] FINDING minor (spec adversary) The sample 22.23.4 was missing. Fixed: the sample and the fault with a row for the line 22.
- [x] FINDING minor (spec adversary) The reason of the equivalent survivor was worded badly. Fixed: `evidence/faults.txt` has a new sentence.
- [x] FINDING minor (STE adversary) The phrase "or a later line" had no anchor. Fixed: see above.
- [x] FINDING minor (STE adversary) The line 22 and 22.23.4 were not in the proposal. Fixed: the Known limit `fixed-table` says that the test refuses 22.23.4.
- [x] FINDING minor (STE adversary) Task 4.1 was open and the checks file said the ratchet ran. Kept: the lead ticks the tasks in the order of the work, and the box is ticked now.
- [x] FINDING minor (STE adversary) Task 3.2 said "its fault". Fixed.
- [x] FINDING minor (STE adversary) The proposal sentence about a contributor machine had an unclear meaning. Fixed.
- [x] FINDING minor (STE adversary) The design had passive voice, and three words were not approved. Fixed.

### Round 2 (commit 93409e47)

- [x] FINDING minor (spec adversary) The fault ".node-version changed to 24.21.0" is killed only by the last assertion of the test. Kept: the reviewer gives it as a note, and no action is needed.

## Notes

The lead ran the gates in the image `gods-eye-view:node24221`, which is built from the Dockerfile of this change (Node v24.22.1). The tag `gods-eye-view:local` is the image of the running app container, and the lead did not change it. The ratchet found no change in the coverage counts between Node 24.21.0 and Node 24.22.1.
The Known limits `floor`, `host` and `fixed-table` of the proposal stay open on purpose.
