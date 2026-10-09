Verdict: FAIL

Tree read: clone `/home/ianblenke/docker/gev-work/ownership-gates`, branch ownership-gates, commit d10db81f86744a3bcd72e30d692af721ea40dc6d. I ran no code and no git. Details are in the two parts I sent to team-lead.

- [ ] FINDING major evidence.md:3717 and pass17/host-checks.log:2,7,14 An old record now holds a newer fact. At 91eee2c9 the Pass 17 block said the checks ran "over commit 70e02e6d". The log held HEAD 70e02e6d, the line "?? review/pre-review-15/" and "666 warnings". Both pre-review 16 reports passed and cited that record (spec-adversary.md:17, ste-adversary.md:12). After 91eee2c9, the sentence and the log were replaced with the run over 91eee2c9 (667 warnings). The tree no longer holds the record that was reviewed. Fix: restore both from 91eee2c9 with `git show`. Put the 91eee2c9 run in a new file, for example `pass17/host-checks-final.log`, and add a new sentence that names it. Then run `make lint` and `make gates-docs CHANGE=ownership-scoped-gates`. Pre-review 16 rated the earlier overwrite (7a699a4b to 70e02e6d) as minor. Its brief did not state this owner rule, and the round 18 brief does.

Confirmed, no finding:
1. **Spec equality.** `openspec/specs/ownership/spec.md` has 35 requirements and all 55 scenarios. It equals the archived delta spec except the Purpose and cosmetic blank lines: two double blank lines collapse to one, and the file ends with one extra blank line. The Purpose equals design.md:294-298 word for word. gates-docs shows no changed-scenario error.
2. **Archive move.** The archive holds 216 files on disk: 176 renames, 6 new `pass18/` files and 34 review files. The active folder is gone. `round18-full.diff` shows no additions of the review files at the archive path, so my evidence for this check is the file list on disk plus `.git/index`. The index is the staged state, not the commit tree.
3. **Tasks.** Only 3.9 and 3.10 are open. That is two boxes, not three. Tasks 19.2 to 20.5 each have a record. The only in-tree record for 3.8 is the f596ba38 measurement line.
4. **Trace.** `ids.json` holds the 55 ownership IDs, and no hash outside `ownership-*` changed. `links.json` links ownership-055, gap-ledger-151 and gap-ledger-138 to their tests, with the titles verified in the test files. The `history.jsonl` +1 line names the change and carries no "dirty" field.
5. **Rule 18.** Only the `testGuard.test.mjs` list changed in `src`. The new entry is last and equals `gates.test.mjs:2627` character for character. The pin only grows. That test needs `GUARDED_RUN` because `withMergeFixture` runs a real measurement. The ratchet stop at `gates.mjs:653` comes before every write to `openspec/trace/`.

Pre-review 17: all 10 findings are applied in `evidence.md` and `tasks.md`.

Minors not listed.

Notes for the lead:
- The passing ratchet verdict is only in `gev-tools/ratchet2-verdict.txt`. Quote it in `review.md`.
- `gates-docs-archive.txt` names no commit, so its run on d10db81f is your claim.
- `pass18/host-checks.log` shows the same overwrite habit, but I did not file it. Pass 18 had not passed a review when it was overwritten.


---- Part 1 of 2 (sent to the lead by SendMessage) ----

Part 1/2 (spec-adversary, confirming round, ownership-scoped-gates; tree d10db81f86744a3bcd72e30d692af721ea40dc6d; I ran no code and no git).

Check 1. openspec/specs/ownership/spec.md (509 lines) vs the archived delta spec (503 lines): I compared every line. 35 requirements, 55 scenarios (ownership-001 to 055, none missing). Differences: the first 9 lines (H1, "## Purpose" with 5 lines, "## Requirements" in place of "## ADDED Requirements"); the delta has two double blank lines (after the fence of ownership-038 and after the fence of ownership-039) that the applied spec has as one; the applied spec ends with one extra blank line. The 5 Purpose lines equal design.md:294-298 word for word. gates-docs-archive.txt shows no changed-scenario error, so the hashes agree.

Check 2. The archive folder has 216 files on disk: 176 renames in round18-full.diff + 6 new pass18/ files + 34 review files (round-1, round-2, pre-review-3 to 17, two reports each). The active folder is gone. NOTE: round18-full.diff shows 30 review files as deleted at the old path and shows NO additions at the archive path (pre-review-16 and 17 never appear as new files). The evidence for "no file lost" is the file list on disk plus .git/index (which lists all 34 review paths and the .log paths I spot-checked, pass8 to pass18). I read the index, not the commit tree. Every file that evidence.md names in pass13 to pass18 exists.

Check 3. tasks.md has TWO open boxes (3.9, 3.10), not three; 3.8 is checked. In-tree record of 3.8: the history.jsonl measurement line for f596ba38 (no "dirty" field); the verdict lines are only in gev-tools/ratchet2-verdict.txt, so review.md should quote them. 20.1 to 20.5: testGuard.test.mjs:458; fault-no-guarded-run.txt (30 of 31); spec-files-run.txt (21 files = the 22 test files of src/tooling/spec minus gates.test.mjs; testGuard has 31 top-level tests); host-checks.log (six statuses 0). 19.2 and 19.3 have the Pass 17 paragraphs. All 55 ownership IDs appear in tasks.md (spec-lint-021).

Check 4. ids.json: 55 ownership entries; 054 and 055 new with since 2026-10-09; no hash outside ownership-* changed. links.json: ownership-055 -> gates.test.mjs:2822 (asserts one LEDGER-ADOPT-FROM at history.jsonl, none for the file, no LEDGER-STALE); gap-ledger-151 -> ledger.test.mjs:1597; gap-ledger-138 -> gates.test.mjs:2707; ownership-031 gains gates.test.mjs:2627. history.jsonl +1 line names the change, commit f596ba38, kind measurement.

Check 5. Only testGuard.test.mjs changed in src: the new title is the last entry (file order) and equals gates.test.mjs:2627 character for character. That test calls withMergeFixture, whose init runs a real measurement, so GUARDED_RUN is warranted. The pin only grows. gates.mjs:651-653: the ratchet stops at measured.errors before writeLedger/appendHistory/writeLinks (684-691), so "wrote no file in openspec/trace/" is true.

Pre-review 17: all 10 findings are applied in evidence.md and tasks.md (counts 2+4 and 4+5 are true).


---- Part 2 of 2 (sent to the lead by SendMessage) ----

Part 2/2 (spec-adversary). The one major: an OLD record rewritten with a NEWER fact (owner rule).
- At 91eee2c9 the Pass 17 block said the checks ran "over commit 70e02e6d" (old text at :3713) and pass17/host-checks.log held HEAD 70e02e6d, "?? review/pre-review-15/" (line 7) and "666 warnings" (line 14). Pre-review 16 passed that record: spec-adversary.md:17 and ste-adversary.md:12 both cite it.
- After 91eee2c9 the sentence (now :3717) and the log were REPLACED with the run over 91eee2c9 (667 warnings, pre-review-16/). round18-full.diff lines 387-414 and 29/100 show it (log similarity 83 percent).
- Fix: restore both from 91eee2c9 (git show; the old path was openspec/changes/ownership-scoped-gates/pass17/host-checks.log). Put the 91eee2c9 run in a NEW file (for example pass17/host-checks-final.log) and add a NEW sentence that names it. Then make lint and make gates-docs CHANGE=ownership-scoped-gates.
- Context so you can weigh it: pre-review 16 rated the earlier overwrite (7a699a4b to 70e02e6d) minor, but its brief (report-round16.md) had no OWNER RULES line; this brief has the rule. It is the same habit twice. The rewording at :3715 is NOT a finding (same fact, both reviewers asked for it).

Same habit, not filed: pass18/host-checks.log was made at an earlier HEAD and overwritten with 2284f19d (pre-review 17 spec adversary F6 says so). Pass 18 had not passed a review at that point, so it is not an old record. Keep it as is, or add a line that names the commit.

Notes (not findings): (1) the brief says "three open boxes"; the file has two. (2) gates-docs-archive.txt names no commit; that its run was on d10db81f is your claim. (3) Put in review.md the passing ratchet verdict lines (Trace 911/911, Ledger 0, Owned gaps 2 code files, COVERAGE-DIFF 247 need coverage, only REVIEW-MISSING). (4) The review.md known limits should still list the gap-ledger-138 THEN minor and the row-label minor (Pass 17 block says it will). Minors not listed.
