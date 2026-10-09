Verdict: PASS

Tree read: commit 26243a1813b537e7d69a4dea1797106fcd96a18f (clone vendored-tolerance). I found no new major. I ran no code, lint or git. Two SendMessage parts (N=2) hold the reasons and the lists of what I read and did not read.

**S1 (waiver line) is fixed.**
- `waiver line` is the broad term. `valid waiver line` is the narrow term.
- Row :150 equals `waiversOf` (ledger.mjs:269-271).
- The base spec (:352, 357, 359, 361) and the title [gap-ledger-084] use the broad term, and both stay true.
- Row :153 says `compareLedger` adds only valid waiver lines. `gates.mjs:553` builds `waivers` with `waiversOf`, and :657 passes them to `compareLedger`, so the claim holds.
- proposal.md, tasks.md and the delta spec have no "waiv" hit.

**S2 (tasks.md:208) is fixed.** Pre-review 9 had four STE majors, not two:
- the waiver row (Y1);
- the `toleranceOf` total (Y2, design.md:91);
- the V8 label (Y3);
- the four-command task (Y4, now four boxes).

All four are corrected, so the box "Correct the major faults that pre-review 9 found." is true.

**Findings (all minor, all introduced by this diff):**
- [ ] FINDING minor openspec/changes/vendored-coverage-tolerance/evidence.md:3269,3358 "Z6" The label Z6 names two rows: the Pass 11 table row and the new Pass 12 table row. A5 says "Z6" twice ("Rename Z7 to Z6. Add the Z6record to the Pass 12 table."). Every in-file use names its table, so no sentence reads two ways. A bare citation "Z6" does. The Pass 12 row is also new in an old record, but A5 discloses it, so the spec adversary decides the old-record question. -> Delete :3358. Append "Move the Pass 11 fact of W8 to row Z6 of the Pass 11 table." to Z3. Write A5: "Rename Z7 to Z6. Add the move of that row to row Z3."
- [ ] FINDING minor openspec/changes/vendored-coverage-tolerance/design.md:152 "content different from the base" "The base" is a second name for the defined term "base content" (rows 109-110, 153). It can also mean the base commit, the base ledger or the base history. -> "The file of the record must not have base content."
- [ ] FINDING minor openspec/changes/vendored-coverage-tolerance/design.md:152 "It needs loaded coverage" "It" can be the function or the record. The facts are the same either way. -> "The record must have loaded coverage."
- [ ] FINDING minor openspec/changes/vendored-coverage-tolerance/design.md:152 "checks waiver lines for a record" The first sentence uses the broad term. The next two sentences use the narrow term. `gates.mjs:553` passes only valid waiver lines. -> "Function that checks valid waiver lines for a record that has no entry to compare with."
- [ ] FINDING minor openspec/changes/vendored-coverage-tolerance/tasks.md:219 "### Pass 12" tasks.md has no "### Pass 13", but evidence.md:3389 has a Pass 13 block with six corrections. Passes 8 to 12 each have boxes. This is not a prose fault, so the spec adversary decides. -> Add "### Pass 13" with "- [x] Correct the major faults that pre-review 11 found." and the host checks, or record the omission in review.md.

**Checked clean:**
- Rows :149-153 are true against ledger.mjs, and A2 "all checks" matches the four checks in `waiversCover` (:196-202).
- The longest sentence in the new rows has 22 words.
- The added lines of pre12.diff have no banned word, no -ing word (except the path "tooling") and no passive verb.
- The lint shows no warning on the new lines.
- The Pass 13 ledger, validate and lint fences equal the printed output in the pass13 logs.
- Labels A1 to A6 are used once each, and I found no clash with W, Y, U, T or X.

Do not write bare "lines" in any replacement text. That was the pre-review 9 major.

---- Part 1 of 2 (sent to the lead by SendMessage) ----

Part 1 of 2 (N=2). STE pre-review 12, vendored-coverage-tolerance, tree commit 26243a1813b537e7d69a4dea1797106fcd96a18f (read from .git/refs/heads/vendored-tolerance of the clone). D = openspec/changes/vendored-coverage-tolerance. The final message holds the PASS verdict, no new major and 5 minors in short form. This part gives reasons and what is clean.

S1 (waiver line / valid waiver line): FIXED.
- Uses of "waiver line(s)": design.md:149 broad definition; :150 narrow definition (it uses the broad term as the genus, like the pair :81-82); :152 once broad, twice narrow (my minor 3); :153 narrow three times. proposal.md, tasks.md and the delta spec have 0 hits for "waiv" (grep). evidence.md hits (Y1 :3260, Z2 :3354, A1 :3395) are records of what each pass did; no conflict.
- Base spec gap-ledger/spec.md:352, 357, 359, 361 use the broad term and stay true. The live title [gap-ledger-084] "for other waiver lines" (ledger.test.mjs:811) is broad and true: a line in the base history, with another change name, another hash or a count that is not positive is a waiver line and not a valid waiver line.
- Row :150 equals waiversOf (ledger.mjs:269-271: history starts with the base history, kind waiver, line.change === change, positive whole count).
- Row :153 "compareLedger adds only valid waiver lines": grounded in the caller. gates.mjs:553 builds waivers with waiversOf, and :657 (compareLedger) and :635 (ratchetLedger) pass it. compareWithBase calls waiversOf itself (ledger.mjs:509). The code of compareLedger alone cannot prove this claim; the caller does.
- Row :153 facts: compareWithBase ledger.mjs:531-536, compareLedger :438-443, waiversCover :196-202. TRUE. Six sentences (14, 14, 16, 21, 22, 18 words), at the limit.
- Row :152 equals waiversCover: four checks (record.loaded, sameAsBase, one or more lines for the file and hash, each metric at or below the sum). A2 "State all checks" is true. Sentences have 15, 10, 18 and 22 words.
- Row :151 compareCoverageEntry equals ledger.mjs:362-397 (returns the errors array). Row :150 has 22 words.

S2 (tasks.md:208): FIXED, with a correction to the record. Pre-review 9 had FOUR STE majors (header of pre-review-9/ste-adversary.md line 3), not two as the pre-review 11 reports say. All four are corrected: waiver row (Y1, design.md:149-153), toleranceOf total (Y2, design.md:91 now "from one total count ... compareLedger gives toleranceOf the current gap total count"), V8 label (Y3, evidence.md has only the engine name V8 outside the Y3 row; W1 to W22 exist), four-command task (Y4, tasks.md:198-204 now four boxes, JSON box unchecked). The pre-review 9 spec report is PASS. So "Correct the major faults that pre-review 9 found." is true.

Fences: Pass 13 ledger fence = pass13/ledger.log lines 107-114 (duration 429.947092); validate = pass13/validate-final.log; lint line = pass13/lint-final.log line 544 ("STE: 0 errors, 543 warnings."). Pass 12 and Pass 13 fences hold printed lines only; command names, exit status and the json.loads result stand in the paragraph lines. Full hash 46264bfb1afeb8b8e44c57a85e6727f92289ae65 exists (.git/logs/HEAD:37).

Words: banned forms in the added lines of pre12.diff: 0 (explicit, verify, malformed, wiring, dismiss, expose, permit, retain, emit, prior, preserve, renew, lone, handover, execute, prescribed, shall, should, may). No -ing word except the path "tooling". No passive verb. Lint lists no warning on the new lines (the 5 warnings of the change are evidence.md:508, 580, 589, 866, 1125, all old).

Labels: Z1 to Z5 once each (:3353-3357); Z6 twice (:3269, :3358; pass13/audit.log:5 says so); A1 to A6 once each and no earlier A label in the change folder; no clash with W, Y, U, T, X.

Old-record question for the spec adversary: the Pass 12 table gains the row Z6 (:3358) after its filing. The action is true of Pass 12 (the Pass 11 fact left W8 then), and A5 discloses the addition, so I rate it minor. The label Z6 did not exist at Pass 12 (it was Z7).

---- Part 2 of 2 (sent to the lead by SendMessage) ----

Part 2 of 2 (N=2). STE pre-review 12, tree commit 26243a1813b537e7d69a4dea1797106fcd96a18f.

READ: ste-brief-pre12.md, report-pre12.md and pre12.diff in full; pre-review-11/ste-adversary.md in full; pre-review-9/ste-adversary.md lines 1-20 (the four majors); design.md in full; tasks.md 150-219; evidence.md 3120-3427 (Pass 10 to Pass 13); scripts/spec/lib/ledger.mjs 170-290 and 355-555; scripts/spec/gates.mjs 540-670 and the grep for waiver and waiversOf; base spec openspec/specs/gap-ledger/spec.md (grep "waiv": all lines); grep of the titles with "waiv" in ledger.test.mjs and gates.test.mjs; gev-tools pass13/audit.log, ledger.log (lines 100-114), validate-final.log, lint-final.log (grep and first 377 lines), codex-14.txt; .git/logs/HEAD (hash check); grep of "waiv", "compareCoverageEntry", "V8", "Z[0-9]" and "A[1-6]" in proposal.md, tasks.md, design.md, the delta spec and evidence.md.

NOT READ: proposal.md and the delta spec specs/gap-ledger/spec.md except by grep (0 hits for "waiv"); evidence.md 1-3119; the other pre-review reports; the bodies of the tests; ledger.mjs 290-355 and 555 to the end; gates.mjs outside 540-670; pass13/audit.py; the show logs except show-final.stderr.log. I ran no code, no lint and no git. I did not run the 240-test gates run.

MINORS THIS DIFF INTRODUCED, longer form of the five in the final message:
1. evidence.md:3269 and :3358, label Z6 twice. In-file uses name the table ("row Z6 of the Pass 11 table", A5 "Rename Z7 to Z6. Add the Z6 record to the Pass 12 table."), so no sentence reads two ways. A bare citation "Z6" in review.md or a later report does. The T and X3 clashes were accepted by name as minors; the V8 clash was major only because "see V8" pointed into the glossary. Cheap fix (the pre-review 11 STE proposal): delete :3358, append "Move the Pass 11 fact of W8 to row Z6 of the Pass 11 table." to Z3, and write A5 "Rename Z7 to Z6. Add the move of that row to row Z3."
2. design.md:152 "content different from the base": the glossary term is "base content" (:109-110, :153). Bare "the base" can be the base commit, the base ledger or the base history (the base spec says "the base history"). Replacement: "The file of the record must not have base content." Do not write bare "lines" in any replacement (the pre-review 9 major was "lines" against the lines metric).
3. design.md:152 "It needs loaded coverage": "It" is the function or the record. Same facts either way. Replacement: "The record must have loaded coverage."
4. design.md:152 "checks waiver lines for a record": broad term, while the next two sentences use the narrow term. gates.mjs:553 passes only valid waiver lines. Replacement: "Function that checks valid waiver lines for a record that has no entry to compare with."
5. tasks.md: no "### Pass 13" while evidence.md:3389 has a Pass 13 block with six corrections. Passes 8 to 12 each have boxes. Not a prose fault; the spec adversary decides. If the lead adds one, the box is "Correct the major faults that pre-review 11 found." plus the host checks; then the task counts in the evidence block need a sentence.

NOT REPORTED (old minors, not in this diff): design.md:119 toleranceOf row against :91; "base history prefix" (:12) against "base history"; "It gives zero" pronoun in :153 (old structure); design.md:46 "get the tolerance"; Pass 11 audit fence omits four constant lines (S6 of pre-review 11, lead decision).
