# Review: ledger-waiver

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-09-23
Gates: make gates CHANGE=ledger-waiver passed
Rounds: 5
Scope: full
Reviewed-Tree: a3ad5a11e54f98698116ca3958a9ba82d25cbf17a4ba0f4414e3ce1159be4939

## Findings

- [x] Round 1 spec-adversary F1 (critical): the `gap-ledger-079` test did not check that `waive` leaves `gaps.json` alone. The test now compares `gaps.json` before and after the command (commit `95a4f10`).
- [x] Round 1 ste-adversary S1, S2 (major): the `gap-ledger-082` THEN line had two "with" phrases, and a test name called a file "waived". Both rewritten; the test name is new in this change.
- [x] Round 1 ste-adversary S3 to S15 (minor): "close on", "hit", "restructuring", -ing words, passive voice, "unwaived" and a missing article. All corrected.
- [x] Round 2 spec-adversary F1 (critical): case 4 of `gap-ledger-084` got its `LEDGER-MORE-THAN-BASE` from another rule, so it could not fail for the base-content rule. The case now has the same hash on both sides, and case 5 checks a lines waiver on the base content.
- [x] Round 2 spec-adversary F2 (major): the two paths for a file with no entry gave a waived count to a file with the base content. `waiversCover` now has the base-content condition, with cases in `gap-ledger-003`, `gap-ledger-086` and `gap-ledger-087`.
- [x] Round 2 spec-adversary F3 (major): `gap-ledger-003`, `gap-ledger-021` and `gap-ledger-048` still said that the gate stops the build with no condition, against `gap-ledger-083`, `gap-ledger-086` and `gap-ledger-087`. The change now modifies them, so it modifies eight scenarios, each with a changed test.
- [x] Round 2 spec-adversary F4 (major): a fully waived file with no entry was not recorded as not current, so a change could pass with no ratchet run. `compareLedger` now records it; `gap-ledger-086` checks `LEDGER-STALE`.
- [x] Round 2 spec-adversary F5 (major): the tests did not check the WHEN conditions of the paths for a file with no entry, or the lines rule of `compareWithBase`. `gap-ledger-086` and `gap-ledger-087` now have a case for each condition, and `gap-ledger-083` has a lines case.
- [x] Round 2 spec-adversary F6 (minor): the `gap-ledger-079` test used `find`, so two appended lines passed. It now checks that exactly one line is appended.
- [x] Round 2 spec-adversary F7 (minor): `!codeFiles.has(file)` and `!gap.loaded` in the second loop of `ratchetLedger` were dead code. Removed (D10).
- [x] Round 2 spec-adversary F8 (minor): a history line recorded the untraced count of `src/cockpitMarkup.test.mjs` as smaller, a drift that this change does not cause. Removed, with the `labelArbiter.js` drift lines.
- [x] Round 2 spec-adversary F12 (minor): `src/tooling/spec/testGuard.test.mjs` was not in the changed-file lists. Added.
- [x] Round 2 spec-adversary F10, F11, round 3 F10, F11 and round 4 F5, F6 (minor): the mutation report, tasks 6.x and 7.x and the final gate run. See the mutation report below; the round-4 skeptic refuted F5 and F6 as work that comes after the round.
- [x] Round 2 ste-adversary S1 to S3 (major): "the seven changed or added scenarios", test names with "a count with no waiver" (new in this change, renamed), and the `fullyWaived` mutation text. All corrected.
- [x] Round 2 ste-adversary S4 to S18 (minor): -ing words, "hit", "caught what it missed", "trigger", "deliberate", "under-waived", "reddens" and "check" with two meanings. All corrected.
- [x] Round 3 spec-adversary F1 (minor): a hand-written count such as `"5"` made a string sum. `waiversOf` now keeps only a line with a positive whole-number count; `gap-ledger-084` has a case for each part.
- [x] Round 3 spec-adversary F2 (minor): the entry paths gave a waived count to a file that no test loads. The waived counts of `compareLedger` and `compareWithBase` now need loaded records; `gap-ledger-082` and `gap-ledger-084` have a case for each condition.
- [x] Round 3 spec-adversary F3, F5 (minor): known limits `waiver-count-not-checked` and `waive-accepts-archived-change`.
- [x] Round 3 spec-adversary F4 (minor): three guards of `waiversOf` had no failing test. `gap-ledger-084` now has cases 6 to 13.
- [x] Round 3 spec-adversary F6 (minor): the waiver reason said "plus more from other GATES-WAIVE tests". The reason now gives the eight runs of the `gap-ledger-080` test and the measured count.
- [x] Round 3 spec-adversary F7 (minor): "five scenario bodies" became "eight".
- [x] Round 3 spec-adversary F8 (minor): the `gap-ledger-079` test now checks that the `commit` field is the head commit and not the merge base.
- [ ] F9 minor (round 2 spec-adversary F9, round 3 F9 and round 4 F4): the new ledger entry for `scripts/spec/gates.mjs` (branches 1) rests on marker evidence that no gate checks (D10, `history.jsonl` waiver line). Accepted by Ian Blenke.
- [x] Round 3 ste-adversary S1, S2 (major): "five scenario bodies" against eight, and "make the rule always false" with two meanings. Rewritten.
- [x] Round 3 ste-adversary S3 to S13, S15 to S17 (minor): "check" and "record" with two meanings, passive voice, "right", "would", "circularity", "stands between", "unconditionally", "cut", "a waived file", "too small a waiver", the 087 clause and "on itself". All corrected.
- [x] Round 3 ste-adversary S14 (minor): kept. A skeptic refuted it: the WHEN lines give each metric, so "that count" has one meaning.
- [x] Round 4 spec-adversary F1 and ste-adversary S1 (major): no case failed for `line.count > 0` alone, or for one of the two loaded conditions of `compareLedger` alone. `gap-ledger-084` now has a negative count and a count of 0, and `gap-ledger-082` has cases 4 and 5. design.md and tasks.md name each part, and each part fails its test (report below).
- [x] Round 4 spec-adversary F2 (minor): `waive-accepts-archived-change` said the waiver has no effect after the archive. It now says that the CI check of the archived change uses it, and that it has no effect after the merge.
- [x] Round 4 spec-adversary F3 (minor): kept. A skeptic refuted it as a style opinion; the main spec uses the same AND form.
- [x] Round 4 ste-adversary S2 (major): "has no waiver" disagreed with the `waive` command, which writes a line for such a file. It now says "gets no waived count", and that the command does not refuse the file.
- [x] Round 4 ste-adversary S3, S4, S5, S7 (minor): "the content hash of the counts", the title of `gap-ledger-087`, "a waived file" in task 3.6, and "write the base commit". All corrected; the `gap-ledger-087` title now equals its test name.
- [x] Round 4 ste-adversary S6 (minor): kept. A skeptic refuted it: its line reference was wrong, and "whose" is an approved word.
- [x] Round 5 spec-adversary F1 (minor): the `!entry.loaded` condition of the waived count of `compareLedger` changes no verdict, and no scenario names it. Known limit `entry-not-loaded-condition`.
- [x] Round 5 spec-adversary F2 (minor): kept. A skeptic refuted it: review.md and the final gate run come after the round. `make lint` and the gates give no STE warning for a file of this change.
- [x] Round 5 ste-adversary S1 to S3 (minor): "Also" joined two separate mutations in two lines of design.md, and a part of a proposal.md sentence had no verb. All corrected in the archived change.
- [x] Scope: rounds 1 to 3 read the full change. Rounds 4 and 5 read only the diff since a snapshot of the round before, because no round had a commit to name in a `diff <commit>` scope. The user asked for round 4. Round 5 confirmed that the two round-4 majors are closed, and both agents gave PASS.
- [x] Trace: the ratchet runs measured the V8 drift of `src/data/labelArbiter.js`. That drift is not an edit of this change, so its entry and history lines stay equal to `main`. This change adds only the `scripts/spec/gates.mjs` entry and its two history lines.

## Mutation report

Each mutation ran on the final code with `node --test`: all of `ledger.test.mjs` for `ledger.mjs`, and the `gap-ledger-079` and `gap-ledger-080` tests of `gates.test.mjs` for `gates.mjs`. The code was restored after each run. The baselines pass: 60 of 60 and 2 of 2.

- [x] `compareCoverageEntry`: remove `+ waivedLines`: `gap-ledger-085` failed.
- [x] `compareCoverageEntry`: remove `+ waivedMetric`: `gap-ledger-081`, `gap-ledger-085` failed.
- [x] `compareLedger` waived count: a constant 8: `gap-ledger-004`, `gap-ledger-009`, `gap-ledger-013`, `gap-ledger-017`, `gap-ledger-070`, `gap-ledger-071`, `gap-ledger-074`, `gap-ledger-082` failed.
- [x] `compareLedger` waived count: remove the sha condition: `gap-ledger-082` failed.
- [x] `compareLedger` waived count: remove the changed condition: `gap-ledger-082` failed.
- [x] `compareLedger` waived count: remove `!entry.loaded`: `gap-ledger-082` failed.
- [x] `compareLedger` waived count: remove `!gap.loaded`: `gap-ledger-082` failed.
- [x] `compareWithBase` waived count: 0: `gap-ledger-022`, `gap-ledger-040`, `gap-ledger-048`, `gap-ledger-083`, `gap-ledger-084` failed.
- [x] `compareWithBase` waived count: a constant 8: `gap-ledger-022`, `gap-ledger-040`, `gap-ledger-084` failed.
- [x] `compareWithBase`: remove `+ waivedLines` from the line rule: `gap-ledger-083` failed.
- [x] `compareWithBase` waived count: remove the `entry.sha` condition: `gap-ledger-084` failed.
- [x] `compareWithBase` waived count: remove the unchanged condition: `gap-ledger-084` failed.
- [x] `compareWithBase` waived count: remove the loaded condition: `gap-ledger-084` failed.
- [x] `waiversOf`: remove the change name filter: `gap-ledger-084`, `gap-ledger-087` failed.
- [x] `waiversOf`: remove `slice(baseHistory.length)`: `gap-ledger-084` failed.
- [x] `waiversOf`: remove the `!change` guard: `gap-ledger-084` failed.
- [x] `waiversOf`: remove the base prefix guard: `gap-ledger-084` failed.
- [x] `waiversOf`: remove `Number.isInteger(line.count)`: `gap-ledger-084` failed.
- [x] `waiversOf`: remove `line.count > 0`: `gap-ledger-084` failed.
- [x] `ratchetLedger`: do not pass the waivers to `compareLedger`: `gap-ledger-085`, `gap-ledger-086` failed.
- [x] `ratchetLedger`: reason `shown by test` for a changed file: `gap-ledger-085` failed.
- [x] `ratchetLedger`: reason `shown by test` for a line rise: `gap-ledger-085` failed.
- [x] `compareLedger`: do not mark a waived file with no entry as not current: `gap-ledger-086` failed.
- [x] `ratchetLedger`: add a history line only for the branches: `gap-ledger-086` failed.
- [x] `waiversCover`: remove the base-content condition: `gap-ledger-003`, `gap-ledger-086`, `gap-ledger-087` failed.
- [x] `waiversCover`: remove the loaded condition: `gap-ledger-086`, `gap-ledger-087` failed.
- [x] `waiversCover`: remove the file filter: `gap-ledger-086`, `gap-ledger-087` failed.
- [x] `waiversCover`: remove the hash filter: `gap-ledger-086`, `gap-ledger-087` failed.
- [x] `waiversCover`: remove the metric filter: `gap-ledger-086`, `gap-ledger-087` failed.
- [x] `waiversCover`: remove the condition for one or more waivers: `gap-ledger-084`, `gap-ledger-087` failed.
- [x] `compareWithBase`: replace the call of `waiversCover` with `false`: `gap-ledger-021`, `gap-ledger-087` failed.
- [x] `waive`: remove the `reason` field: `gap-ledger-079` failed.
- [x] `waive`: append the line two times: `gap-ledger-079` failed.
- [x] `waive`: write the base commit in place of the head commit: `gap-ledger-079` failed.
- [x] `waive`: remove the fault entry `!active`: `gap-ledger-080` failed.
- [x] `waive`: remove the fault entry `!isTracked`: `gap-ledger-080` failed.
- [x] `waive`: remove the fault entry `sameAsBaseFile`: `gap-ledger-080` failed.
- [x] `waive`: remove the fault entry `!validMetric`: `gap-ledger-080` failed.
- [x] `waive`: remove the fault entry `!validLines`: `gap-ledger-080` failed.
- [x] `waive`: remove the fault entry `!validCount`: `gap-ledger-080` failed.
- [x] `waive`: remove the fault entry `!validReason`: `gap-ledger-080` failed.
