Verdict: PASS

Tree read: clone `/home/ianblenke/docker/gev-work/vendored-tolerance`, commit f1990c6d882f59ef1616509b6518e3cf15038b5b, scope `diff 02c2bb72`. I ran no code and no git. There are no critical or major findings. Both majors of pre-review 10 are fixed. The 4 minors below were all introduced by this diff.

**Major 1 (spec) is fixed.**
- The Pass 11 audit fence (evidence.md:3303-3333) has none of the 4 author lines.
- I compared it line by line with `pass11/audit-final.log`. The other lines are verbatim and in order.
- Row Z1 states the removal, so the fence is not an unlabelled extract.

**Major 2 (STE) is fixed.**
- The design.md rows "waiver line" (:149), "waiversCover" (:150), "waived count" (:151) and "tolerance" (:91) are true against ledger.mjs.
- "Waiver line" now equals what `waiversOf` keeps (ledger.mjs:251-258, :269-271).
- Both `compareLedger` and `compareWithBase` take their waivers from `waiversOf` (gates.mjs:553, :657).
- The code has no diff: audit.py asserts `git diff fbef25e2 -- scripts src` is empty, and the lead's host check agrees.

**Minor findings**
- [ ] FINDING minor evidence.md:3377-3379,3385,3387 The Pass 12 `openspec show` and `openspec validate` fences hold "Command: ..." and "Exit: 0" lines that the author's wrapper wrote (codex-13.log:948-955). openspec printed neither. They are true, and the Pass 11 fences do not have them. The fence check compares against the wrapper's own log, so it cannot see this. Move both lines into the paragraph line, or say that the wrapper prints them.
- [ ] FINDING minor evidence.md:3269 Row Z7 is a Pass 12 addition with a Z label inside the Pass 11 table. The Pass 12 table does not list it, and no Z6 exists. "At Pass 11" dates a base behaviour (ledger.mjs:196-202, unchanged) to Pass 11, which pre-review 10 spec finding 3 objected to for W8. The fact is true (ledger.mjs:197, :428). List the addition in the Pass 12 table, or state it as an undated design.md fact.
- [ ] FINDING minor tasks.md:200,208 This is a rule 17 problem. Restoring box 10.1 brings back pre-review 9 spec finding 3, which was filed minor. The new checked Pass 11 box "Correct the faults that pre-review 9 found." has no scope, while Y9 says "Keep" and you list uncorrected pre-9 minors for review.md. Z3 says "restore", but the restored box lacks the "10.1 " prefix. Scope the Pass 11 box like the Pass 12 box, or record the test 1665 reason in review.md and accept both boxes by name.
- [ ] FINDING minor evidence.md:3149 The restored W8 sentence "Base content gives zero in compareWithBase, not in compareLedger." is flat and false for a file with no ledger entry (ledger.mjs:197, :428). The truth is in design.md:151 and row Z7, but W8 has no pointer to them. Accept it by name, or add "At Pass 10," to the sentence.

**Severity note for the third finding.** Read strictly, rule 17 would make it major. I filed it minor because pre-review 9 filed the same defect on box 10.1 as minor. The Pass 11 table is also headed "Correction or decision". No gate reads the boxes. If you want it closed now, the fix is cheap, as the finding says.

Parts 1 and 2 of 2 went to team-lead by SendMessage. They hold the checks I found clean, the files I read and did not read, and the caveats.

---- Part 1 of 2 (sent to the lead by SendMessage) ----

Part 1 of 2 (N=2). Spec adversary, vendored-coverage-tolerance pre-review 11, tree commit f1990c6d882f59ef1616509b6518e3cf15038b5b (read from .git/refs/heads/vendored-tolerance; .git/logs/HEAD:36 shows parent 02c2bb727cae37226e061b4024093bab61da23b8). I ran no code and no git. D = openspec/changes/vendored-coverage-tolerance. The final message is PASS: 0 critical, 0 major, 4 minors (all introduced by this diff). This part lists what I checked clean.

MAJOR 1 (spec, pre-10: author lines in the Pass 11 fence) IS FIXED. evidence.md:3303-3333 has none of the four lines. I compared it line by line with pass11/audit-final.log: the 29 remaining lines are verbatim and in order; the four removed lines are log lines 8, 14, 15, 16. Every remaining print in pass11/audit.py follows an assert (:6,:7,:9,:12,:18,:19,:23,:27-28,:35). Row Z1 states the removal, so the fence is not an unlabelled extract. The other Pass 11 fences (ledger, show, validate) hold only lines from the commands or from the log (the log's Command and Exit lines are stripped there).

MAJOR 2 (STE: glossary rows vs waiversOf) IS FIXED. design.md:149 "waiver line" equals what waiversOf keeps (ledger.mjs:269-271 with historyLinesOf :251-258): after the base history, kind waiver, change equals the checked change (empty change gives no lines), count a positive whole number. Both compareLedger (gates.mjs:657, waivers from :553) and compareWithBase (:509) use waiversOf. design.md:150 "waiversCover" is true for both callers (ledger.mjs:428 gap with no entry; :523 ledger entry with no base entry). design.md:151 "waived count": compareWithBase :531-536 sums file, metric and entry.sha, gives 0 for base content or an unloaded entry; compareLedger :438-443 sums file, metric and gap.sha, gives 0 when hashes are equal or either side is unloaded (no base-content clause there, as the row says); waiversCover :197 rejects an unloaded record or base content. design.md:91 "tolerance": gapTolerance :208-210 is used only for a tolerant file (:444); the default is () => 0 (:362); toleranceOf is also called at :770 with the smaller of two totals, which the row does not contradict ("one total count").

OTHER CHECKS CLEAN
- proposal.md:14 and design.md:56 "the comparison in compareCoverageEntry": the function body (ledger.mjs:362-397) equals main-tree :345-380. No "error code makes" or "its existing rule" text is left in the live documents or in spec.md.
- Restores: W8 (evidence.md:3149) equals pre9.diff:177 apart from the V to W relabel done at Pass 11. The Pass 10 output sentence equals pre9.diff:197. The separate sentence "The second command adds --test-isolation=none ..." is a reason for a Pass 10 command, not a newer fact. Pre9.diff has no such sentence, so it is an addition, but a true one.
- tasks.md counts: Pass 8 = 17 (:166-182), Pass 9 = 11 (:186-196), Pass 10 = 5 (:200-204), Pass 11 = 3 (:208-210), Pass 12 = 5 (:214-218). One verb in each Pass 11 and Pass 12 box; each has a record (table, ledger fence, show fence, lint fence, validate fence). The unchecked Pass 10 JSON box (:203) agrees with evidence.md:3248 (no exit status, no parse result).
- Numbers: ledger 106/106 (pass12/ledger.log:107-114, duration 432.405143 as in the fence). Lint: the last lint run (pass12/lint-complete.log, 543 warnings; codex-13.log:1294-1296) ran after the last evidence edit; lint-final.log and lint-end.log (544) are older. codex-13.log:1299-1318 asserts that the Pass 12 fences equal the logs. Show and validate were run again on the final tree (:1333-1350: exit 0, json.loads PASS, valid).
- Full hash 02c2bb72... in the Pass 12 "Tree read" line is correct (.git/logs/HEAD:35). Section titles: only ### Pass 12 is new (pass12/audit.py:32-37 checks level 2 and 3).
- Code: the diff has no scripts/ or src/ hunk (audit.py:6 asserts it; lead check agrees). Checks 1-8 of my list have nothing new. No new QA script in the repo (pass12/audit.py lives in gev-tools).
Part 2 of 2 follows.

---- Part 2 of 2 (sent to the lead by SendMessage) ----

Part 2 of 2 (N=2). Spec adversary, pre-review 11, tree commit f1990c6d882f59ef1616509b6518e3cf15038b5b.

SEVERITY READING (finding 3, rule 17). The brief defines major as "an owner rule is not met". Read strictly, a checked box whose text says "Correct the faults that pre-review 9 found" is not true while pre-review 9 spec finding 3 stands again (this diff restores box 10.1, which that finding called a rule 17 fault) and while you list uncorrected pre-9 minors for review.md. I filed it minor for three reasons: pre-review 9 filed the identical defect (box 10.1 with a "Keep" row and a future task row) as minor and said it was clean once review.md records the 1665 reason; the Pass 11 table is headed "Correction or decision", and Y9 is a decision; no gate reads the boxes. If you want it closed in this pass, the cheap fix is to scope the Pass 11 box the way the Pass 12 box is scoped, or to write the 1665 reason in review.md before the final review. If you read rule 17 strictly, treat finding 3 as major.

FINDINGS IN DETAIL
1. evidence.md:3377-3379, 3385, 3387. In the Pass 12 openspec fences, the lines "Command: ..." and "Exit: 0" are written by the author's wrapper (codex-13.log:948-955 writes them with f.write; the second run at :1333-1338 prints them with print). openspec printed neither. They are true and cheap to check, but Z1 removed exactly this class from the Pass 11 fence, and the Pass 11 fences show neither line. The "Pass 12 fences match command output" check (codex-13.log:1307-1308) compares with the wrapper's own log, so it cannot see this. Fix: move both lines into the paragraph line, as Pass 11 does, or say that the wrapper prints them.
2. evidence.md:3269 (Z7). A row with a Z label was added to the Pass 11 table. The Pass 12 table (3351-3357) does not list the addition, and no Z6 exists (audit.py:26 counts 6 labels: Z1-Z5 and Z7). The date "At Pass 11" ties a base behaviour (main ledger.mjs:196-202 is identical) to Pass 11, the dating that pre-review 10 spec finding 3 objected to for W8. The fact itself is true (ledger.mjs:197, :428). Fix: add a Pass 12 row for it, or state it as an undated design.md fact.
3. tasks.md:200, :208. See the severity reading above. Also: the restored box 10.1 is "Correct the faults that pre-review 8 found." without the prefix "10.1 ". The Pass 10 text had the prefix; the prefix removal is a Pass 11 edit that Y4 does not name. Z3 says "restore", so the restore is not exact.
4. evidence.md:3149 (W8). The restored sentence "Base content gives zero in compareWithBase, not in compareLedger." is flat and has no "At Pass 10" prefix. For a file with no ledger entry it is false (ledger.mjs:197, :428: base content makes waiversCover reject). Pre-review 9 spec finding 1 called it false. The truth stands in design.md:151 and in row Z7, but W8 has no pointer to them. This is the price of "never rewrite an old record"; accept it by name or add "At Pass 10," to the sentence.

CHECKED AND NOT FILED
- The Pass 12 table label order: the "Tree read" line sits after the table here and before it in Pass 10 and 11. Cosmetic.
- design.md:151 gives the counting rule of waiversCover (file, metric, sha of the record) nowhere; it names only the rejections. Not false. Pre-review 10 spec finding 6 covers the "Without a ledger entry" gap for the :523 caller; I did not repeat it.
- The Pass 10 JSON box (tasks.md:203) can never be checked honestly. `openspec archive` may ask about incomplete tasks, and Section 3 (tasks.md:53-56) is also open until the image runs. No gate reads unchecked boxes (grep of scripts/spec shows only SPEC-LINT-NO-TASK for scenario IDs). Record both in review.md.
- Pre-review 10 STE minors that stay open (design.md:119 "count tolerance" vs rule, Y1/Y2/Y4 coined words, evidence.md:17 and :2944 tense, "get the tolerance") I did not repeat, as you directed.

READ
report-pre11.md and pre11.diff in full; design.md, proposal.md in full; tasks.md :100-219; evidence.md :1-30 and :3120-3395; ledger.mjs :20-49, :180-290, :355-590 and greps (toleranceOf, hasTolerance, waiversCover, compareLedger, compareWithBase, gapTolerance); gates.mjs by grep (waiversOf at :34, :553, :635, :657); main-tree ledger.mjs :180-215 and :340-380; pre-review 10 spec report in full and STE report :1-40; pre-review 9 spec report in full and STE findings by grep; pre9.diff :160-240; pre10.diff :300-380; pass11/audit.py, pass11/audit-final.log, pass11/openspec.log; pass12/audit.py, ledger.log, openspec.log, validate.log and the STE lines of the lint logs; codex-13.txt; codex-13.log :925-975, :1290-1365 and greps; .git/logs/HEAD.

NOT READ
ledger.mjs :590-715 and :735-830; gates.mjs bodies; gates.test.mjs and ledger.test.mjs bodies (no hunk); proof-pass*.json; pre-reviews 1-8; spec.md (only greps); the lint logs beyond the STE summary lines; openspec/trace files (no ratchet has run); evidence.md outside the ranges above. I did not re-count the 543 warnings.

CAVEATS
I cannot run git. The diff scope rests on pre11.diff and on the audit.py asserts. Host Node 24.14.0 differs from .node-version; the image ratchet decides coverage counts. The gates test (240) and replay were not re-run, which is correct since no code or test changed.
