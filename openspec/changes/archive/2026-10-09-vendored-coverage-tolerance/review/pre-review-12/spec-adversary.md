Verdict: PASS

Tree read: clone `/home/ianblenke/docker/gev-work/vendored-tolerance`, commit `26243a1813b537e7d69a4dea1797106fcd96a18f`. Scope was `diff 46264bfb`. I ran no code and no git. There are no critical or major findings, and one minor that this diff introduced.

**Major S1 (waiver line, two meanings) is fixed.**
- `design.md:149` now says "History line with the kind waiver." That is the broad meaning. `openspec/specs/gap-ledger/spec.md` lines 352, 357, 359 and 361 and the title of gap-ledger-084 read true with it.
- `design.md:150` ("valid waiver line") equals what `waiversOf` keeps (`ledger.mjs:251-258` and `:270`).
- `design.md:152-153` use "valid waiver lines" in every sum.
- `proposal.md`, `tasks.md` and the change's spec delta have no "waiv" hit.
- Row 153 (waived count) matches `ledger.mjs` at `:438-443`, `:531-536` and `:197`.
- Row 152 (waiversCover) names all four checks of `ledger.mjs:196-202` (loaded record, not base content, one line naming file and hash, per-metric sum). It equals scenario 086 clause by clause. Row 151 (compareCoverageEntry) is true against `ledger.mjs:362-397`.

**Major S2 (`tasks.md:208`) is fixed.**
- "Correct the major faults that pre-review 9 found." is true. I checked all four pre-review 9 STE majors against the tree. The waived-count wording is fixed in rows 149-153. The toleranceOf total is fixed at `design.md:91`. The labels are W1-W22, and only the engine name V8 remains. Box 10.2 is split into four boxes at `tasks.md:201-204`. Pre-review 9 had no spec major.

**Other checks, clean:**
- Pass 12 and Pass 13 fences hold only command output. `pass13/audit.py:27-28` asserts they equal the last lines of the ledger, validate and lint logs.
- The new "Exit: 0." claims in the Pass 13 block are backed. The wrapper at `codex-14.log:1436-1449` asserts exit 0 and runs `json.loads` on the show output. The ledger and lint runs "succeeded".
- No old record is rewritten with a newer fact.
- The diff has no new unbounded "only" or "all" claim.
- Task counts (17, 11, 5, 3, 5) equal `tasks.md`.
- A1-A6 are defined once and Z7 survives only in the A5 row.
- Ledger is 106/106.
- The diff has no code or test hunk, so my other checks have nothing new.

- [ ] FINDING minor openspec/changes/vendored-coverage-tolerance/evidence.md:3269,3358 The label Z6 has two rows with two texts. The Pass 11 table (`:3269`) states the fact "At Pass 11, waiversCover rejects ...". The Pass 12 table (`:3358`) says "Move the Pass 11 fact of W8 to row Z6 of the Pass 11 table." `pass13/audit.py:19` asserts the count of 2 on purpose. The pre-review 11 STE fix kept Z6 single by adding the sentence to Z3. I rate it minor because the label is an identifier and not a fact, both pre-review 11 reviewers asked for the Pass 12 record, and the Pass 12 row names the Pass 11 row. If you want it closed, delete the Pass 12 row Z6 and append that sentence to row Z3.

Parts 1 and 2 of 2 went to team-lead by SendMessage. They hold the full proof, the unfiled items, the read and not-read lists, and the caveats. One unfiled item matters for `review.md`: `tasks.md:200` has the same shape that S2 rated major, but it is an old record you accept by name, and `review.md` does not exist yet.

---- Part 1 of 2 (sent to the lead by SendMessage) ----

Part 1 of 2 (N=2). Spec adversary, vendored-coverage-tolerance pre-review 12, tree commit 26243a1813b537e7d69a4dea1797106fcd96a18f (read from .git/refs/heads/vendored-tolerance; .git/logs/HEAD:38 shows parent 46264bfb). I ran no code and no git. D = openspec/changes/vendored-coverage-tolerance. Final message: PASS, 0 critical, 0 major, 1 minor (introduced by this diff). This part holds the proof that both majors are fixed and the checks that came out clean.

MAJOR S1 (waiver line, two meanings) IS FIXED.
- design.md:149 now reads "History line with the kind waiver." This is the broad meaning. It makes true all uses in the base spec: gap-ledger/spec.md:352 ("waiver lines from the checked change"), :357 ("a waiver line is in the base history, has another change name"), :359, :361 ("a waiver line with a count that is not a positive whole number") and the live title of gap-ledger-084. It has the same shape as the adopt pair (design.md:81-82).
- design.md:150 "valid waiver line" equals what waiversOf keeps (ledger.mjs:251-258 historyLinesOf: change name present and history starts with the base history; :270: kind waiver, line.change === change, Number.isInteger(count) && count > 0).
- Every sum uses "valid": rows 152 and 153. grep for "waiv" in proposal.md, tasks.md and specs/ of the change: zero hits. The only other hits are evidence.md records (Y1, Z2, A1, W4, W8, code quotes), which are old records and stay.
- Row 153 (waived count) against the code: compareWithBase :531-536 (zero if sameAsBase or entry not loaded; filter file, metric, sha === entry.sha; waivers from waiversOf at :509); compareLedger :438-443 (zero if hashes equal or either side not loaded; sha === gap.sha; waivers come from gates.mjs:553 waiversOf); waiversCover rejects at :197. All true.

MAJOR S2 (tasks.md:208) IS FIXED. Pre-review 9 had four STE majors (the pre-11 STE text names two; I checked all four against the tree) and no spec major. Current tree: (1) waived-count wording of "lines" and "zero for base content": rows 152-153 now say "valid waiver lines", "file with base content", "ledger entry without loaded coverage"; (2) toleranceOf total: design.md:91 "toleranceOf computes the tolerance from one total count. For a tolerant file, compareLedger gives toleranceOf the current gap total count of that metric"; (3) V8 label clash: grep for \bV[0-9]+\b in the four documents shows only the engine V8 (design.md:130, proposal.md:3, evidence.md:116, 352, 3262); labels are W1-W22 (evidence.md:3142-3163); (4) box 10.2 split: tasks.md:201-204 are four boxes (Pass 10 = 5). So "Correct the major faults that pre-review 9 found." is true. It stays true although Pass 11 also fixed some minors (Y5-Y8).

NEW waiversCover ROW (design.md:152) against ledger.mjs:196-202: four checks, all named. (a) record.loaded; (b) !sameAsBase(file) ("content different from the base"); (c) own.length === 0 returns false ("at least one valid waiver line must name the file and the content hash", with no metric filter, as in the code); (d) every metric: record[metric] <= sum of counts of own lines of that metric. The A2 claim "all checks" holds. The row also equals scenario gap-ledger-086 (spec.md:369-374) clause by clause. Callers: grep shows only :428 (gap with no entry) and :523 (ledger entry with no base entry), so "a record that has no entry to compare with" is fully backed.
compareCoverageEntry ROW (design.md:151): signature (file, entry, gap, tolerance, waived) returns the errors array (:362-397). True. proposal.md:14 and design.md:56 use the name, and it now has a row.

OTHER CHECKS CLEAN
- The diff has three files only (design.md, evidence.md, tasks.md). Insertions and deletions in the commit message of 26243a18 (49 and 14) match the diff I counted. Code and tests: the lead's check says `git diff f1990c6d -- scripts src` is empty; the audit (pass13/audit.py:8) asserts it. So checks 1-8, 10, 11 of my list have nothing new.
- Pass 12 and Pass 13 fences hold only what a command printed. Pass 13 audit.py:27-28 asserts them equal to the last 8 lines of pass13/ledger.log (tests 106, pass 106, duration_ms 429.947092), pass13/validate.log (one line) and the last line of pass13/lint-final.log (543 warnings). The Pass 12 show fence is gone; its command name, exit status and parse result stand in the paragraph line (evidence.md:3375, :3377).
- "Exit: 0." claims in the Pass 13 block (evidence.md:3402, 3423): the ledger run (codex-14.log:1100-1101) and the final lint run (:1348-1349, last command of its bash call) both "succeeded". The show and validate script (:1436-1449) asserts returncode == 0, runs json.loads on the full output, and printed exit 0 and PASS. So these new text claims are backed.
- Labels: Z1-Z5 once each (evidence.md:3353-3357); Z6 twice (see the minor); A1-A6 once each (:3395-3400); A5 has no earlier use; Z7 occurs only in the A5 row (:3399). No clash with W, Y, U, T, X (grep of Z\d+, A\d, V\d).
- Pass 11 table row (evidence.md:3269) now Z6; Pass 12 Tree read line has "with Pass 12 text edits" (:3360); Pass 13 Tree read names 46264bfb in full, which is the parent commit (.git/logs/HEAD:37-38).
- Old records: no old fact is rewritten with a newer fact. The only edits to Pass 11 and Pass 12 content are the Z7-to-Z6 label, the "with Pass 12 text edits" clause and the move of author-written command lines out of the Pass 12 fences. All three are stated in rows A4-A6.
- Task counts in the Pass 12 line (17, 11, 5, 3, 5) equal tasks.md (:166-182, :186-196, :200-204, :208-210, :214-218). Ledger test file 106/106 in pass13/ledger.log.
- No new unbounded "only" or "all" claim. "compareWithBase adds only valid waiver lines with the content hash of the ledger entry" is true: waiversOf is called inside compareWithBase. A2's "all checks" is true (see above). Part 2 follows.

---- Part 2 of 2 (sent to the lead by SendMessage) ----

Part 2 of 2 (N=2). Spec adversary, vendored-coverage-tolerance pre-review 12, tree commit 26243a1813b537e7d69a4dea1797106fcd96a18f. This part holds the minor in full, the items I checked and did not file, what I read and did not read, and caveats.

THE MINOR (filed in the final message). evidence.md:3269 and :3358: the label Z6 has two rows with two texts. The Pass 11 table row Z6 (:3269) states the fact "At Pass 11, waiversCover rejects ...". The Pass 12 table row Z6 (:3358) says "Move the Pass 11 fact of W8 to row Z6 of the Pass 11 table." A reader who looks up Z6 finds two definitions. pass13/audit.py:19 asserts the count of 2 on purpose. The pre-11 STE fix (S7) was to keep Z6 as the row in the Pass 11 table and append the sentence to Z3; the new separate row made the label double (rule 20, own correction adds a fault). Severity reasoning for minor, not major: the label is an identifier, not a fact about code or results; both pre-11 reviewers asked for the Pass 12 record; the Pass 12 row names the Pass 11 row, so no reader gets a false statement; A5 records the rename. You can overrule with that in front of you. If you want it closed cheaply: delete the Pass 12 row Z6 and append "Move the Pass 11 fact of W8 to row Z6 of the Pass 11 table." to row Z3.

CHECKED AND NOT FILED
1. The word "valid" in design.md:152-153 for waiversCover and compareLedger is guaranteed by the caller, not by those functions: compareLedger sums any object in its `waivers` input that matches file, metric and sha (:438-443), and waiversCover does the same with file and sha (:198). In the gate, input comes from waiversOf (gates.mjs:553), so the row is true for the gate. Unit tests pass shapes such as { change: 'backfill-orbit', ... } directly (ledger.test.mjs:145, 163, 461, 756-776, 938). The pre-Pass-13 row had the same shape ("waiver lines of the checked change"), so this diff adds no new fact. Rule 15 flavour only.
2. evidence.md:3291-3293: the Pass 11 show fence still holds the wrapper line "python3 json.loads: PASS". It is the same class that A4 removed from the Pass 12 fences. Old record, not touched by this diff.
3. tasks.md:200 (restored Pass 10 box "Correct the faults that pre-review 8 found.") has the shape that STE S2 rated major for the Pass 11 box; W7 is a future task and W21 says "Keep". It is an old record, pre-review 9 spec filed it minor, and you accept it by name (restored box 10.1). Make sure review.md names it.
4. tasks.md has no Pass 13 section. Pass 9, 10 and 11 sections were also added one pass late (pre-10 spec Part 2, decision a). Not a rule 17 fault: no box is checked for it. If you add a Pass 13 section later, give each box a record in the Pass 13 block.
5. design.md headings: the table "Pass 7 words" now holds rows added at Pass 11 to Pass 13. The audit holds level 2 and 3 headings equal on purpose, and earlier reviews accepted this. Not filed.
6. design.md:153 last sentence "Without a ledger entry, waiversCover rejects a file with base content or a current gap without loaded coverage" names the compareLedger caller only; the compareWithBase caller (:523) passes a ledger entry. Omission, not false. Row 152 covers both callers.
7. review.md does not exist yet in the change folder. The minors that you accept by name (listed in report-pre12.md:15) must stand in it before the final review. I did not find review.md in the file list.

READ
report-pre12.md and pre12.diff in full; design.md in full; tasks.md :120-219; evidence.md :3130-3189 and :3236-3428 (Pass 10 to Pass 13), plus greps over the four documents and the spec delta (waiv, Z\d, A\d, V\d, "Correct the ... faults", glossary, compareCoverageEntry); ledger.mjs :150-570 and greps for waiversCover; gates.mjs by grep (waiversOf at :34, :553); base spec gap-ledger/spec.md :325-374; ledger.test.mjs by grep (waivers, waiversCover, 086/087); pre-review 11 spec and STE reports in full; pre-review 9 spec and STE reports in full; pre-review 10 spec report :1-40; gev-tools pass13/audit.py, audit.log, ledger.log, validate.log, validate-final.log, show-final.stderr.log, lint-final.log (first lines); codex-14.txt (grep), codex-14.log :1096-1130, :1334-1365, :1420-1509 and greps; .git/logs/HEAD :34-38.

NOT READ
ledger.mjs :570-830; gates.mjs bodies; ledger.test.mjs and gates.test.mjs bodies (no hunk); proof-pass*.json; pre-reviews 1-8; pre-review 10 STE report; spec.md of the change (greps only; it has no hunk); openspec/trace files (no ratchet has run on this tree); evidence.md outside the ranges above; the 543 lint warnings (I did not re-count them; I read the first lines of lint-final.log only).

CAVEATS
I ran no code and no git. Claims that rest on a tool (empty code diff since f1990c6d, banned word forms 0, section-title equality, ledger 106/106, lint 0 errors) rest on pass13/audit.log, the logs and your host checks; I did not rerun them. Host Node is 24.14.0, not .node-version; the image ratchet decides coverage counts. The 240-test gates run and the replay were not re-run, which is correct since no code or test changed.
