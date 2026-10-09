Verdict: FAIL

Tree: `/home/ianblenke/docker/gev-work/vendored-tolerance`, commit fbef25e2a93d8b0ee471ac33247c64c4161e63f0, scope `diff 8ee1bd5f`. I ran no code and no git. Parts 1 and 2 of 2 went to team-lead by SendMessage.

- [ ] FINDING major evidence.md:3308,3314-3316 The Pass 11 audit fence prints fixed text as output. "Task records", "T labels" and "At Pass prefixes" are constants (pass11/audit.py:20,31,32). "X3 ... unchanged" only matches a label list and does not compare with 8ee1bd5f. Pass 11 removed identical lines from the Pass 10 fence (row Y7, pre-review 9 filing) and wrote four new ones in its own block. Rule 20 is not met, and Y7 is false for the Pass 11 block. Fix: delete the four lines, or move them out as "The author states" sentences as at :3248-3250.
- [ ] FINDING minor evidence.md:3161,3163 W20 says Pass 10 stated the JSON exit result, but :3246 now says no exit status and no parse result were recorded. W22 says Pass 10 checked task records and At Pass prefixes, but :3248-3250 now call both author statements. The changed lines make these rows false. Fix: add a Pass 11 row that says so; do not rewrite W20 or W22.
- [ ] FINDING minor evidence.md:3149 W8 says "At Pass 11, base content also rejects waiver coverage in compareLedger ...". That dates a base behavior to Pass 11: waiversCover exists in main ledger.mjs:196 and the code diff is empty. Fix: delete the false Pass 10 sentence. State the no-entry path in Pass 11 row Y1 as a design.md fact.
- [ ] FINDING minor proposal.md:14, design.md:56 "the comparison that each (coverage) error code makes" includes LEDGER-STALE. This change changes that comparison (ledger.mjs:436-449 tolerant and totalsOnly feed the stale list; :474 raises the error), and design.md:46 says so. The replacement text was the STE adversary's and is wrong. Fix: use the pre-review 9 spec text "the comparison in compareCoverageEntry" (:362-397, unchanged).
- [ ] FINDING minor design.md:91 "compareLedger gives it the current gap total count" is true only for a tolerant file. Any other file gets the default `() => 0` (ledger.mjs:362, :444). Fix: add "for a tolerant file".
- [ ] FINDING minor design.md:150 The waived count row omits two things in the code. waiversOf keeps only a positive whole count after the base history (ledger.mjs:251-258, :270). compareWithBase also calls waiversCover for a file absent from the base ledger (:523), which "Without a ledger entry" does not name. waiversCover has no glossary row.
- [ ] FINDING minor evidence.md:3167-3169 Pre-review 9 asked for the result of the first Pass 10 ledger run. The text says "ran at file level" with no result (codex-11.log:2929-2932 shows tests 1, pass 1). Fix: state the result.

All four printed claims in the first finding are true in content. Pre-review 9 filed the same defect as minor. I rate it major because it came back in the same pass that claimed to fix it. The other six are minors the lead may accept by name.

---- Part 1 of 2 (sent to the lead by SendMessage) ----

Part 1 of 2 (N=2). Spec adversary, vendored-coverage-tolerance pre-review 10, tree commit fbef25e2a93d8b0ee471ac33247c64c4161e63f0 (read from .git/refs/heads/vendored-tolerance), scope diff 8ee1bd5f. I ran no code and no git. D = openspec/changes/vendored-coverage-tolerance. The final message has the verdict and 7 findings (1 major, 6 minor). This part lists what I checked clean.

CHECKED CLEAN
1. design.md:150 "waived count" and :149 "waiver line" against ledger.mjs: compareWithBase (:531-536) sums only lines with file, metric and entry.sha and gives 0 for base content or an unloaded entry; compareLedger (:438-443) sums only lines with gap.sha and gives 0 for equal hashes or an unloaded entry or gap; waiversCover (:196-202, call at :428) rejects base content or an unloaded record. waiversOf (:269-271) restricts to the checked change. Every sentence in the row has 13 to 20 words. design.md:32 matches :538 and :563.
2. design.md:46 true (hasTolerance :187-188 feeds tolerant :436, :444 and :454; adoptedFile is used only at :447-449). design.md:103 and the never-worse row match neverWorseCounts :237-245 (`??` keeps zero). design.md:91 tolerance row is true for toleranceOf :30-33, gapTolerance :208-210 and checkRebaseline :770 (min of two totals), except the bound in finding 5.
3. tasks.md: Pass 8 = 17 boxes (:166-182), Pass 9 = 11 (:186-196), Pass 10 = 5 (:200-204). The diff touches only the Pass 9 and Pass 10 lines; the Pass 8 boxes are unchanged. Every scenario ID 136-156 still appears in tasks.md (SPEC-LINT-NO-TASK holds). The unchecked Pass 10 JSON box (:203) is honest: :3246 says no exit status and no parse result were recorded; the Pass 11 record at :3286-3290 is real (codex-12.log:2477-2490 asserts exit 0 and runs json.loads). Each Pass 9 box has a record: U table, mutation table, scope-check output, the 1688 test text with six assert.equal lines (:2935-2940, matches pass11/titles.log), host outputs.
4. Old records (all evidence.md hunks of pre10.diff): header :17 true (only Pass 10 uses --test-isolation=none; grep finds no earlier use). :2779 and :3065 true: pass8/check-final.py:6-7 and pass9/finish.py:23 assert exit 0 and run json.loads; pass8/record.py:63 first wrote "The JSON parse passed.", Pass 9 reworded it, Pass 11 restores the Pass 9 wording (same fact). Pass 9 header Node versions true (:3014 and :3027). U9 numbers match the scope-check output (22 rules, lines 38 and 42 pass, 20 left). Label check by grep: Y only at :3258-3266; W only at :3142-3163 and :3260; V8 engine intact at :116 and :352; X rows (:1327-1331) not touched by the diff, so "X3 unchanged" is true.
5. Numbers: ledger.test.mjs has 106 top-level tests (grep) and pass11/ledger.log shows 106/106. The diff has no scripts/, src/ or spec.md hunk, so checks 1 to 8 (scenario and test, weak tests, coverage, gate values, ledger, trace, gate output) have nothing new. No new gap for check 10.
6. proposal.md:92 "Two titles" is true: 1620 and 1688 do not name the file scope; 1643 and gates.test.mjs:2816 do.

---- Part 2 of 2 (sent to the lead by SendMessage) ----

Part 2 of 2 (N=2). Spec adversary, pre-review 10, tree commit fbef25e2a93d8b0ee471ac33247c64c4161e63f0. Read and not read, caveats, lead decisions.

WHY THE FIRST FINDING IS MAJOR
Pre-review 9 filed the constant-print lines of pass10/audit.py (:19, :20, :29) as minor. I rate the same defect major now because Pass 11 removed exactly those lines from the Pass 10 fence (table row Y7) and then wrote four new ones with the same labels in its own fence: "Task records" (pass11/audit.py:20), "T labels" (:31, `t` computed and never used), "At Pass prefixes" (:32), and "X3 ... unchanged" (:30, the assert matches a label list against a literal and does not compare with 8ee1bd5f). That is rule 20 (own correction adds the fault), and Y7 is not true of the Pass 11 block. All four printed claims are true in content, so this is a one-line fix: delete the four lines or move them out as "The author states" sentences. If you disagree on severity, the text of the finding still stands.

LEAD DECISIONS, NOT FINDINGS
a. tasks.md has no Pass 11 section. The Pass 9 and Pass 10 sections were also created one pass late (W1). The unchecked Pass 10 JSON box (:203) has its real record only in the Pass 11 block. Decide whether to check it with a pointer to that record or leave it open.
b. The Pass 11 tree line uses the short hash `8ee1bd5f` (evidence.md:3254); Pass 9 and Pass 10 used full hashes (AGENTS.md rule 11). Minor at most.
c. pass11/audit.py:7 `git diff -- review` ignores untracked and staged files, so "Review reports: unchanged" cannot fail for a new file. Copied from pass10/audit.py:11. Weak, not filed.
d. pass11/edit.py:12 `re.sub(r'\bV(\d+)\b', ...)` would also rename the engine V8 at evidence.md:116 and :352. The final file keeps V8 there and the diff does not touch those lines, so the file is right; I cite pre10.diff as the record, not the script.
e. The items you accepted by name (scenario 156 order, titles 1620 and 1679, key swap, T-label clash, Pass 8 task "Check the new test clauses", reason for test 1665) are not filed. review.md does not exist yet, so none is recorded in the change folder.

READ
report-pre10.md and pre10.diff in full; design.md, proposal.md, tasks.md and spec.md in full; evidence.md :1-20, :2662-2857 and :2855-3349; ledger.mjs :1-715 and :735-830 (in two ranges), and by grep the main-tree ledger.mjs; pre-review 9 spec and STE reports in full; pass11/audit.py, edit.py, ledger.log, titles.log, audit-final.log, audit-end.log, openspec.log; pass10/audit.py; pass8/check-final.py and pass9/check-final.py; grep of codex-11.log and codex-12.log; ledger.test.mjs titles by grep.

NOT READ
gates.mjs, gates.test.mjs bodies, ledger.test.mjs bodies (no test hunk in the diff), proof-pass*.json, pre-reviews 1 to 8, the lint logs beyond their first lines (I did not recount the 545 warnings), openspec/trace files (no ratchet has run), the review/ and proof files that pre10.diff leaves out.

CAVEATS
I cannot run git. The comparison with 5e424a0c in the brief was not possible; I used pre10.diff (every evidence.md hunk since 8ee1bd5f is in it) and greps. Changes between 5e424a0c and 8ee1bd5f are out of scope for this round. Host Node 24.14.0 and 26.8.2 differ from .node-version; the image ratchet decides the coverage counts.
