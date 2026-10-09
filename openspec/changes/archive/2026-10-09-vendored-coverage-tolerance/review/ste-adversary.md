Verdict: PASS

Tree: clone vendored-tolerance, commit 701aa5807639b9f89cd1c451d16e56afb2e9c5e3. I found no major finding and no new fault from the archive. I ran no code, lint or git. Two SendMessage parts (N=2) hold the clean list, the items I saw but did not report, and the read and not-read lists.

- [ ] FINDING minor openspec/changes/archive/2026-10-09-vendored-coverage-tolerance/proposal.md:92-94 "Two titles of tests for gap-ledger-154 (ledger.test.mjs lines 1620 and 1688) ... The lead accepts these titles by name." The acceptance list in report-confirm.md:9 names the titles of tests 1620 and 1679, not 1688. Test 1679 is the title that proposal.md:89-91 covers. Without 1688 in review.md, the last sentence at :94 is false for one title. The title of test 1688 has 22 words, and the file scope does not fit in 25 words. -> review.md accepts by name the titles of tests 1620, 1679 and 1688.

- [ ] FINDING minor openspec/specs/gap-ledger/spec.md:4 "A loaded code file with true coverage, the content of the base commit and the content hash of its entry has the tolerance conditions." The archive adds the requirement "Count tolerance for adopted files" (:741), and the Purpose does not name its case. The Purpose stays true, because :760 keeps the base meaning of "tolerance conditions". It is incomplete. -> Accept it by name, or add one sentence: "A file with the adopted-source conditions also has the count tolerance." A Purpose edit changes a file under openspec/specs/, so it needs `make gates-docs` or another ratchet. Check the sentence against :741-784 before you apply it.

Checked clean (details in Part 1):
- The merged requirements at openspec/specs/gap-ledger/spec.md:741-919 equal archive specs/gap-ledger/spec.md:4-182. The only difference is one blank line.
- There are 21 scenario IDs, 136 to 156, once each.
- There are no banned words, `-ing` words or passive verbs in the new text.
- The longest requirement sentence has 24 words.
- The checked box at tasks.md:53 has one imperative instruction. The box count is 166 checked, 4 open, 170 total.
- The line pointers in proposal.md hit the right lines in the tree.
- The proof and log files that evidence.md and proposal.md place "in this change folder" are in the archive folder. I could not check whether git tracks the three .log files.

Paths are under /home/ianblenke/docker/gev-work/vendored-tolerance/.

---- Part 1 of 2 (sent to the lead by SendMessage) ----

Part 1 of 2 (N=2). STE confirming round, vendored-coverage-tolerance. Tree: clone vendored-tolerance, commit 701aa5807639b9f89cd1c451d16e56afb2e9c5e3 (read from .git/refs/heads/vendored-tolerance). A = openspec/changes/archive/2026-10-09-vendored-coverage-tolerance. The final message gives the result and 2 minors. This part lists what is clean.

1. Merged spec. openspec/specs/gap-ledger/spec.md:741-919 equals A/specs/gap-ledger/spec.md:4-182 line by line (the line offset is 737 or 738). The only difference is blank lines: the delta has two blank lines at 134-135, the merge has one. The header "## ADDED Requirements" is gone, as it must be. Two requirements. The 21 scenario IDs 136-156 appear once each. The 13 older scenario IDs that the first requirement cites (004, 008, 013, 028, 054, 057, 069, 070, 071, 072, 073, 074, 078) all exist in the base spec. ids.json has 21 matching lines. history.jsonl:2062 is the one measurement line.
2. Banned words (explicit, verify and forms, malformed, wiring, dismiss and forms, expose, permit, retain, emit, prior, preserve, renew, lone, handover, execute, prescribed, echo, shall, should, may): 0 hits in A/proposal.md, design.md, tasks.md, the delta spec and the merged spec. 0 hits in evidence.md Pass 10 to Pass 13. "priority" (design.md:67) is old: pre-review 1 saw it and words.json does not list it. "echo" is only in old Pass 3 and Pass 4 records (evidence.md:520, 649, 845, 848, 878).
3. -ing words in the five documents: only "meaning", "Meaning" and the path "tooling". Passive voice in new text: none ("absent" is an adjective).
4. Sentence length: the longest requirement sentence is 24 words (merged spec :777). The longest scenario line is 25 words with AND (:814).
5. Task box A/tasks.md:53: one instruction, imperative. Box count: 166 checked, 4 open, 170 total. This matches the report (165 of 170 before this box). The task counts in evidence.md (Pass 8: 17; Pass 9: 11; Pass 10: 5; Pass 11: 3; Pass 12: 5) match the boxes in tasks.md.
6. Line pointers in A/proposal.md (:65, :72-73) hit the right lines in the tree: ledger.mjs 237-245 (neverWorseCounts), 436, 449, 454; ledger.test.mjs 1508, 1643-1653. Tests 1620, 1679 and 1688 exist with the titles that the proposal describes (22 words for 1688).
7. Files that evidence.md and proposal.md place "in this change folder" are in A: proof.json, proof-pass2, 3, 4, 6, 7, 8, 9 (.json), gap-ledger-156-mutation.log, metric-key-mutations.log, metric-key-mutations-pass9.log. I could not check git tracking of the .log files (no git).
8. No new sentence says the change is active. A/tasks.md:125 "Validate the active change with OpenSpec." is a Pass 5 box, true at that time.
9. The glossary rows waiver line, valid waiver line, waived count, waiversCover and tolerance are not in the diff (renames at 100%). No new reading of them.

---- Part 2 of 2 (sent to the lead by SendMessage) ----

Part 2 of 2 (N=2). STE confirming round, tree commit 701aa5807639b9f89cd1c451d16e56afb2e9c5e3.

SEEN, OLD, NOT REPORTED (your call):
- "stale" in the merged spec (openspec/specs/gap-ledger/spec.md:756-919) against "not current" in the base (:67, 68, 272, 342, 375; :671 also says "stale"). This is the pre-review 3 STE finding. The glossary row "stale" (A/design.md:90) closed it. After the archive the live spec has no definition of its own. It is not a new fault, so I did not report it.
- A/proposal.md:54 "in the Node image on the upstream-sync-3 tree". Pre-review 3 gave this sentence. The final make gates runs on this clone (vendored-tolerance). The sentence is a need and not a statement of fact, so I did not rate it. Check that you mean the same tree.
- A/evidence.md:2499-2507 names lint-docs.log to lint-mutation2.log. They name no folder, and none is in A. This is a Pass 7 record. The files were never in the change folder.
- Verbs as nouns in old tasks (for example "mutation run", A/tasks.md:136) and the accepted minors of pre-reviews 9 to 12: not reported.

READ: ste-brief-confirm.md, report-confirm.md and confirm.diff in full. A/proposal.md, design.md, tasks.md and specs/gap-ledger/spec.md in full. openspec/specs/gap-ledger/spec.md lines 1-12 and 730-920, and greps for "stale", "not current" and "exception". evidence.md 2444-2452, 2478-2520, 2672-2680, 2860-2870 and 3130-3428 (Pass 10 to Pass 13). The pre-review 12 STE report in full. openspec/ste/words.json. ledger.mjs 225-255 and 425-465. ledger.test.mjs 1495-1514 and the list of all test titles (grep). Greps in A/review for "priority", "not current", "1688" and "upstream-sync-3 tree". Greps in ids.json, history.jsonl and tasks.md (box counts).

NOT READ: evidence.md 1-3129 except the spots above and the greps. The pre-review reports 1 to 11, except grep hits. Test bodies, except ledger.test.mjs 1495-1514. gates.mjs and gates.test.mjs. ledger.mjs outside 225-255 and 425-465. openspec/trace/links.json. The proof JSON files and the .log files. The vt2 ratchet log: I took the ratchet result from your brief. Git state: I cannot run git, so I did not check which .log files git tracks or the commit graph.
