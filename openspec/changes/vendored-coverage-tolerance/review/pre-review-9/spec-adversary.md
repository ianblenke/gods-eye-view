Verdict: PASS

Tree: clone `/home/ianblenke/docker/gev-work/vendored-tolerance`, commit `766e82902226f0e4a95b1f98a74b7a46f10d7b8d`, scope `diff 47d4cd2a`. I ran no code and no git. D = `openspec/changes/vendored-coverage-tolerance`. I found no critical or major finding. All findings are minor and the lead may accept them by name. A detailed list of what I checked clean, read and not read follows by SendMessage in 2 parts.

- [ ] FINDING minor D/evidence.md:3149 V8 says base content gives zero "not in compareLedger". That is false for a file with no ledger entry: compareLedger calls waiversCover (ledger.mjs:428), and :197 returns false for base content or an unloaded record. The design.md:149 row covers only the with-entry closure (:438-443). Fix: add one clause for the no-entry path and correct V8.
- [ ] FINDING minor D/evidence.md:2779 The Pass 8 and Pass 9 `openspec show` records (also :3065) were true. pass8/check-final.py:7 and pass9/finish.py:23 run json.loads on the output, so the pre-review 8 premise "if no parser ran" was wrong. Pass 10 replaced both with weaker text. Its own record at :3247 says "exits with 0", but the run was `;`-chained (codex-11.log:3450) and nothing captured the exit status or parsed the file. Fix: restore the old wording and name the parser. For Pass 10, parse and capture the exit status, or say neither was done.
- [ ] FINDING minor D/tasks.md:197 Box 10.1 "Correct the faults that pre-review 8 found" is checked. V7 is a future task ("The lead will record…") and V21 says "Keep" (evidence.md:3148, 3162), so neither is a correction. Rule 17. Fix: retitle the box "Resolve the findings…", or check it after review.md records the test 1665 reason.
- [ ] FINDING minor D/evidence.md:17 "No command uses --test-isolation=none" is false now: :3171 uses it. The first Pass 10 ledger run passed at file level (codex-11.log:2928-2936), but the record does not say so. Fix: bound line 18 and state that result.
- [ ] FINDING minor D/proposal.md:14 "The conditions of a coverage error" (also design.md:56) still has two readings. Tolerance now applies to adopted files, so LEDGER-LARGER-GAP and LEDGER-LOST-COVERAGE fire in fewer cases (scenarios 136 and 142, ledger.mjs:436). The comparison in compareCoverageEntry (:362-397) is unchanged. Fix: "Do not change the size of the tolerance or the comparison in compareCoverageEntry."
- [ ] FINDING minor D/evidence.md:2864 The U2 row names one of Pass 8's two changes to line 2188 (the added sentence). It omits the reword "its error rules" to "the conditions of a coverage error" (pre7.diff:99-100; the audit-u2 label at :2973 lists both). Fix: name both.
- [ ] FINDING minor D/evidence.md:3202 pass10/audit.py lines 19, 20 and 29 print constants inside the audit output fence, so they are not checks. The Pass 9 box "…of the new tests" has a record of one test only (1688). The pass9/audit.py output in the Pass 10 block shows 3 hand-picked lines with no note that lines are missing. Fix: label these as notes, and bound the box and the extract.
- [ ] FINDING minor D/evidence.md:2859 The header says "gates 26.8.2", but the label added at :3014 shows a gates run on Node 24.14.0. Also :2871 uses the undefined abbreviation "S lines". Fix: name both Node versions and write "spec.md lines".
- [ ] FINDING minor D/design.md:91 "From the total count of that metric" has two readings. gapTolerance uses the current gap total count (ledger.mjs:209), and checkRebaseline uses min(total, measured) (:770). Fix: name the current gap total count.

---- Part 1 of 2 (sent to the lead by SendMessage) ----

Part 1 of 2 (N=2). Spec adversary, vendored-coverage-tolerance pre-review 9, commit 766e82902226f0e4a95b1f98a74b7a46f10d7b8d (read from .git/refs/heads/vendored-tolerance), scope diff 47d4cd2a. I ran no code and no git. D = openspec/changes/vendored-coverage-tolerance, S = D/specs/gap-ledger/spec.md. The final message has the verdict (PASS, 0 critical, 0 major, 9 minors). This part lists what I checked clean.

CHECKED CLEAN
1. tasks.md Pass 8 boxes (lines 166-182): all 17 equal the "+" block of pre7.diff:513-531, which is the Pass 8 text. The three boxes that Pass 9 had reworded (local file scope, new test clauses, section titles) are restored exactly. Counts: Pass 8 = 17, Pass 9 = 8 (lines 186-193), Pass 10 = 2. The evidence line that states the counts matches the file. Pass 3 = 17 also holds. One verb per task holds by the verb rule. The multi-object boxes (Pass 9 "design, spec and proposal text", 10.2 with four runs) are not a verb fault.
2. Each Pass 9 box has a record in the Pass 9 block: titles U3/U4, mutation table, U1/U5/U6/U10 text, U2/U8 prose, scope-check output, scenario 142 old and new text, the printed test 1688, host outputs. The exception is the plural in box 7 (see finding 7).
3. design.md:46 is true against the code. adoptedFile is used only at ledger.mjs:447 and gates.mjs:602/657, so "Total counts for adopted files changes only when compareLedger records a ledger entry as stale" holds. adoptedAsIs feeds hasTolerance (:187-188), which feeds the tolerant flag (:436), gapTolerance (:444), the closed-gap push (:454) and the ratchet choice (:640). The sentence for the first requirement has no "only", so it makes no exclusivity claim.
4. design.md:149 "waived count" is true for the two closures. compareWithBase (:531-536): zero for base content or an unloaded entry; sums only lines of the checked change with file, metric and entry.sha. compareLedger (:438-443): zero for equal hashes or an unloaded record; sums only lines with gap.sha. waiversOf (:269-271) restricts to the checked change and to positive whole counts. It is consistent with base spec lines 359-361 (gap-ledger-084) and 346-347 (gap-ledger-082). design.md:32 matches :538 and :563 for a file with no base content.
5. proposal.md:76 is true. LEDGER-LOST-COVERAGE has one site (ledger.mjs:392), reached only when lossOf is above the tolerance, and lossOf (:62-68) is at most the fall of the covered count. proposal.md:74-75 matches the line-count rise to entry + tolerance (:374). The "never-worse counts" row matches neverWorseCounts (:237-245), and zero is not absent (`??`). The "tolerance" row is true against toleranceOf (:30-33), except the which-total ambiguity (finding 9).
6. Test titles in proposal.md:89-94: 1620 has 25 words, 1688 has 22, 156 has 24. Adding file scope or the adopted-source conditions gives 28 or more, so the "keeps inside 25 words" claims hold. proposal.md:82 and the line pointers (:454, :436, :449, :237-246; test :1508, :1643-1653) still hit the right lines. The paragraph at 89-94 has 6 sentences.
7. Mutation rows a-g and the control match proof-pass9.json and metric-key-mutations-pass9.log (30!=20 at 1692; 11!=10, 30!=10 and 5!=10 at 1694; 200!=199 at 1697 for e and g; 400!=300 at 1695). Mutation g is `<=` to `<` at ledger.mjs:240; f is `entry.totals?.[metric]` to `entry.totals?.lines` at :242.
8. Code and tests: pre9.diff has no scripts/ or src/ hunk, so scenario-to-test mapping, weak-test, coverage and gate-value checks (1, 2, 3, 4, 5) have nothing new. Spec.md is not in the diff, so scenario 142 and the 22 MUSTs are unchanged. Retired IDs, the ledger and the trace: no ratchet has run, so checks 6, 7 and 8 do not apply.
9. Origin spec-first (check 9): tests precede code in tasks.md for 136-155. The 156 order deviation is in proposal.md:78-80 and accepted by name.
10. Pass 10 numbers: ledger 106/106 on Node 24.14.0 (codex-11.log:3190-3200), lint 0 errors 545 warnings, validate valid. The pass10/audit.py checks (code diff empty, Pass 8 tasks equal to 9b5652a6, headings) are real computed checks. The 13 lines that the Pass 8 extract does not show are confirmed in pass8/audit-final.log:1-13.

---- Part 2 of 2 (sent to the lead by SendMessage) ----

Part 2 of 2 (N=2). Spec adversary, vendored-coverage-tolerance pre-review 9, commit 766e82902226f0e4a95b1f98a74b7a46f10d7b8d. Read and not read, accepted items, observations, caveats.

ACCEPTED BY YOU, NOT FILED (per report-pre9.md)
- Scenario 156 order deviation; titles 1620 and 1679 (25-word limit); the key swap in compareCoverageEntry and gapTolerance (fixtures use equal totals, no test); the T-label clash (Pass 3 and Pass 8); the Pass 8 box "Check the new test clauses" (its record is pass8/audit-final.log:2-12, outside the repo, and the in-repo extract does not show it); the reason for the shorter title of test 1665. Note: review.md does not exist yet, so none of these acceptances is recorded in the change folder. Record each by name in review.md.

OBSERVATIONS, NOT FILED
- The 22 MUSTs: S:30 and S:31 compare "inside the tolerance" with no named metric. This is old text and is covered by the Known limit at proposal.md:71-76.
- Scenario 154 AND "does not change the total counts of the current gap" (S:108) still has two readings. Pre-review 8 accepted it.
- D/tasks.md Section 3 (lines 53-56) is still unchecked. This is correct until the lead's image runs happen.
- The "tolerance" and "waived count" glossary rows sit under "Pass 7 words" and are used by design.md:32 only. The compareLedger half of the "waived count" row is not used anywhere else.
- proposal.md:14 "Do not change the tolerance": it can mean the size of the tolerance (true) or which files get it (false by bullet 1). Same family as finding 5.

SEVERITY NOTES
- Findings 1 and 2 could be read as major. I kept them minor: no stated clause of the row is false for the code it names, and the term is not used for the no-entry path in any document. The pre-review 8 STE premise about the parser was a reviewer's replacement text, and the Pass 10 record is true in what it says. Rule 17 reading of box 10.1 (finding 3) is the closest to an owner-rule fault; if you check it only after review.md records the 1665 reason, it is clean.
- Each fix is text only and cheap: `make gates-docs CHANGE=vendored-coverage-tolerance` works after them if they stay under the three allowed paths.

READ
report-pre9.md; pre9.diff in full; pre-review-8 spec report in full; tasks.md, design.md, proposal.md and S in full; ledger.mjs 1-130, 150-330, 362-482, 484-715, and greps; gates.mjs 545-665 and greps; ledger.test.mjs 1490-1698 (gates.test.mjs by grep for the 154/143 titles); evidence.md 1-60, 2160-2219, 2662-3140, the Pass 10 block (3136-end) via grep; metric-key-mutations-pass9.log and proof-pass9.json in full; base spec gap-ledger lines 315-390 and waiver greps; pass9/audit.py, pass9/scope-check.py, pass10/audit.py in full; pass8/record.py, check-final.py and show.json, pass9/finish.py by grep; pre7.diff lines 386-535 and the hunk list of pre7.diff and pre8.diff; codex-11.log lines 2924-2937, 3188-3203, 3225-3290, 3425-3550 and greps; main-tree ledger.mjs by grep.

NOT READ
evidence.md outside the ranges above (except greps); proof-pass2/3/4/6/7/8.json; pre-reviews 1-7 and the STE pre-review 8 report beyond greps; gates.test.mjs outside the greps; openspec/config.yaml beyond one grep; openspec/trace files (no ratchet has run); pass9/finish.py and pass8/check-final.py beyond the lines named.

CAVEATS
- I cannot run code or git. Claims that rest on a tool (empty code diff since 5f7490ac, Pass 8 tasks equal to 9b5652a6, banned-word forms, ledger 106/106) rest on pre9.diff, my line-by-line comparison with pre7.diff, and the logs. I did not rerun them.
- Host Node 24.14.0 and 26.8.2 differ from .node-version (24.21.0). The image ratchet decides the coverage counts.
- I did not check whether the "S" abbreviation also appears elsewhere in evidence.md. Finding 8 names :2871 only.
