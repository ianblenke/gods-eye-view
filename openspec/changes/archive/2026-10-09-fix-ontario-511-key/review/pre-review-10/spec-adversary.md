Verdict: PASS

Tree: clone /home/ianblenke/docker/gev-work/fix-ontario-511, commit 5d00d646978e4edcb6128a906bc06c501d012721, read from `.git/refs/heads/fix-ontario-511-key`. I read working-tree files and ran no code or git command. I found no critical or major finding and 4 minors. `ev` below means `openspec/changes/fix-ontario-511-key/evidence.md`. Two messages (part 1 of 2 and part 2 of 2) went to team-lead by SendMessage with the checked-clean list, the read lists and the caveats.

- [ ] FINDING minor ev:2215, ev:2107 Pass 11 rewrote two old records with Pass 11 facts.
  - The Pass 10 row R3 now says "The proposal names the cache that is not empty". The pre10.diff `-` line shows that Pass 10's proposal said "holds a camera object from any pack". The old R3 row said the same.
  - The Pass 8 record P1 now describes the same new wording and has no "At Pass N" prefix.
  - Row S2 (ev:2277) credits the same change to Pass 11.
  - Fix: keep R3 and P1 in the wording of their own pass, or add "At Pass 11," to the new facts. Let S2 carry the change.
- [ ] FINDING minor ev:1309 "It copies this code and the Pass 5 tests."
  - The tree is /tmp/ont-pass5-tree, because ev:1520 and pass5/reverse.log:1 name it. That meets pre-review 9's condition for raising this finding to major.
  - I grade it minor for two reasons. ev:1311 is two lines below and is true at run time: automatic-results.json holds the old Key test title 8 times and the new title 0 times. Pass 6 reran all 140 mutations on the live tests with the same nine survivors (ev:2021-2034), so no verdict depends on it.
  - Fix: name the tree and say that its two Ontario test files are older than the Pass 5 channel changes (S18).
- [ ] FINDING minor ev:2276-2280 The labels S1 to S5 repeat labels that already exist.
  - ev:1746, ev:1750 and ev:1751 define S3, S4 and S5 with other meanings, and ev:2048 uses S1.
  - ev:1321 "See S3" and ev:1335 "(see S3)" now have two README targets.
  - Fix: use a new letter, for example T1 to T5.
- [ ] FINDING minor evidence/pass10/test-function-search.log, evidence/pass10/section-titles.diff, ev:2234 Pass 11 outputs sit in the Pass 10 folder with no note that Pass 11 ran them.
  - The search hits review/pre-review-9/*.md, so it ran after Pass 10.
  - section-titles.diff now compares 12e359c7 with a pass11 titles file.
  - ev:2234 shows `python3 /tmp/pass10-titles.py`. The stored copy is evidence/pass10/check-titles.py, with the same code, and no link or sentence connects them.
  - Fix: add one sentence to the Pass 11 block that says which checks ran in Pass 11, and name check-titles.py.

The changed sentences are true against the code. This covers proposal.md:43-44 against catalog.js:156-172, 181, 192-201 and 245-257 and constants.js:248, and the "No scenario covers the loader without a key or after a request error" sentence. The notes on the Pass 5 automatic run (ev:1311, ev:1606) are true against S18 and the run log, and so are the numbers 12/71/83, 83/14/0, lint 0 errors, validate valid and the empty code diffs. tasks.md is unchanged, and no box is wrong.

Carried and not filed, with the same decision as pre-reviews 7 to 9: a throw inside `refreshCctvSources` does not move `_cctvSourceCacheAt`. On persistent hostile data, "at most once in 15 minutes" then fails. Accept it by name in review.md.

---- Part 1 of 2 (sent to the lead by SendMessage) ----

fix-ontario-511-key pre-review 10, spec adversary, part 1 of 2 (CHECKED CLEAN). Tree: clone /home/ianblenke/docker/gev-work/fix-ontario-511, commit 5d00d646978e4edcb6128a906bc06c501d012721 (read from .git/refs/heads/fix-ontario-511-key; reflog confirms 12e359c7 = filing of pre-review 8, e2172392 = Pass 10 text, 96ccff93 = filing of pre-review 9, 5d00d646 = Pass 11). I read working-tree files and ran no code or git command. ev = openspec/changes/fix-ontario-511-key/evidence.md. The final message has the verdict (PASS, 4 minors).

CLEAN
1. proposal.md:43-44 against code. catalog.js:158-163 returns a non-empty fresh cache; :167-171 single-flight; :256 sets _cctvSourceCacheAt in both branches of :245-255; constants.js:248 = 15*60*1000. A non-empty cache never becomes empty (:245 replaces it only with a non-empty list or when it is empty). So the loader runs at most once per 15 minutes while the cache is not empty. Empty cache falls to :167 and starts a refresh each call with none in flight (line 44). The two sentences split cleanly by cache state. The refresh calls pack.load only if needsLiveSources and pack.enabled() (:192-201), so "can call" is right. cctv.js:37 is the only production createCctvCatalog; catalog.js:48 the only caller of the loader.
2. "No scenario covers the loader without a key or after a request error": TRUE at face value. Scenarios 003/004 name the request helper; 005 names the loader only for a row error; 002 and 006-009 run the loader with a key (tests set FAKE_ROW_KEY or a key). No test outside cctvOntarioKey/Rows mentions Ontario (grep of src).
3. Log line text "Loaded Ontario 511 camera sources: 0 enabled (using nearest 0)" equals sources.js:533; empty rows reach it (isArray([]) is true).
4. ev:1311 and ev:1606 are TRUE at run time, not only at Pass 6: pass5/automatic-phase1-host.log line 1 and automatic-results.json "root" = /tmp/ont-pass5-tree; automatic-results.json holds the OLD title "return an empty list for an HTTP error with JSON rows" 8 times and the new title "empty row list" 0 times. S18 (ev:1761-1873) shows five channels and text-only lists in both copies. Pass 6 reran all 140 mutations on the live tests with the same nine survivors (ev:2021-2034), so no mutation verdict depends on the old copy.
5. "Pass 5 channel changes" matches ev:1318-1319 (pairs, dir channel).
6. P9 to P8: ev:2124 now P8; no P9 left in D/ (text-check.json "P9:" empty; grep of proposal, design, tasks: none). No dangling reference to the deleted Q2 follow-up sentence; "older Pass 5" and "another copy" appear only in review/ quotes.
7. ev:2084 "At Pass 5, the lead chose the words of the README line": TRUE against ev:1321 (row text) and ev:1333-1335 (paragraph). Both targets exist and the heading "Corrections of pre-review 3" (ev:1314) is unique.
8. ev:2107 "At Pass 9, catalog.js lines 156 to 201, lines 245 to 257 and constants.js line 248": line ranges match the code.
9. Numbers: pass11 key log 12/12, rows log 71/71, fail 0; repeated-titles.json 83 titles, 14 references, no flags; openspec-validate.log valid; openspec-show.json id fix-ontario-511-key, deltaCount 2; lint-final.log "STE: 0 errors, 540 warnings", the only two warnings for D/ are ev:413 and proposal.md:41 (old); lint-group-first.log had 2 errors (ev:1604 paragraph, ev:2115 sentence) and lint-group-fixed.log has 0. 12+71=83. Unchanged numbers (336, 25 files, 131/9/140, 149, 411/314, 107/103, 7/3) are outside the diff.
10. Pass 11 "Tree read 96ccff93", Pass 10 "Tree read 12e359c7" and the Pass 10 R-table labels follow the reflog. Pass 10 and Pass 11 each carry the non-run statement. code.diff and review.diff hold only their Command line (empty); status-ignored.log lists only openspec paths (M/A), so README, src, server and scripts are unchanged since 96ccff93. tasks.md and design.md are not in the diff; section 9 is unchecked (rule 17). No key-leak path: no code or test change.
11. Every link in the Pass 10 and Pass 11 blocks points to a file that exists in evidence/pass10 or evidence/pass11 (glob).
12. /tmp/pass10-titles.py equals evidence/pass10/check-titles.py (read both): same code, pass10 log paths.

End of part 1. Part 2 follows.

---- Part 2 of 2 (sent to the lead by SendMessage) ----

fix-ontario-511-key pre-review 10, spec adversary, part 2 of 2 (NOTES, READ, NOT READ). Tree: commit 5d00d646978e4edcb6128a906bc06c501d012721 in /home/ianblenke/docker/gev-work/fix-ontario-511 (working-tree read). This part holds no verdict. ev = evidence.md.

NOTES
1. ev:1309, why minor and not major. Pre-review 9 spec said it would be major if the ev:1309 tree is /tmp/ont-pass5-tree. It is: ev:1520 and ev:1309 both say "the scratch tree", and pass5/reverse.log line 1 runs /tmp/ont-pass5-tree/src/data/cctvOntarioReverse.test.mjs (that Reverse file has the NEW 004 title, reverse.log:6). So in one tree the Reverse file is a Pass 5 test and the Key and Rows files are older. "It copies this code and the Pass 5 tests" is false for those two files. I grade it minor because ev:1311 sits two lines below, in the same block, says what Pass 6 found, and is TRUE at run time (automatic-results.json, old title 8 times). No verdict depends on it (ev:2021-2034 rerun). If you want it clean: ev:1309 "At Pass 5, the scratch tree /tmp/ont-pass5-tree has no branch. It copies this code. Its two Ontario test files are older than the Pass 5 channel changes; see S18." Keep the paragraph at 6 sentences or fewer.
2. Finding 1 detail (rewritten records). Old R3 (Pass 10): "The proposal names a camera object from any pack and each new refresh from an empty cache." That matches the pre10.diff '-' line of proposal.md:43 ("holds a camera object from any pack"). New R3 and new P1 describe the Pass 11 wording, and S2 (ev:2277) credits the same change to Pass 11. Safe repair: keep R3 and P1 in their own pass wording (or add "At Pass 11, the proposal says ..."} and let S2 carry the change. The brief's own rule applies: an "At Pass N" fact must name the pass where it happened. I could not read the Pass 8 commit (objects are packed), so for P1 I rely on the removed text "the cache that holds a source" in the diff.
3. Finding 4 detail. test-function-search.log hits review/pre-review-9/*.md, which exist from 96ccff93 on, so the search ran in Pass 11. section-titles.diff (status M) now diffs 12e359c7 against /tmp/pass11-proposal-titles.txt. The Pass 10 command line still shows python3 /tmp/pass10-titles.py; the stored file is evidence/pass10/check-titles.py (identical code) and no link or sentence connects them. Neither Pass 10 nor Pass 11 links check-titles.py.
4. For the STE adversary (not filed): ev:1605 paragraph split leaves "See S18. It runs each Ontario test file in its own process." where "It" lost its subject (the automut command is now in the paragraph above). The link "[First group lint output]" does not say that it holds 2 errors. ev:2084 "the README line" has no antecedent in the Pass 7 host-check paragraph. ev:2171 Q5 calls spec lines 21, 29 and 31 "request clauses"; line 31 is the row-error (loader) clause. Old text, not in this diff.
5. Carried, not filed (same decision as pre-reviews 7 to 9): a throw inside refreshCctvSources does not move _cctvSourceCacheAt (catalog.js:256 is skipped), so on persistent hostile data the next call runs the loader at once and "at most once in 15 minutes" fails. Accept by name in review.md or leave as is. Also for review.md by name: E7 order limit (proposal.md:77-78), the nine survivors not re-probed for equivalence (ev:2035), the open Purpose sentence and the coverage reader issue (tasks.md section 9).

READ
report-pre10.md; pre10.diff in full; proposal.md, design.md, tasks.md, specs/live-sources/spec.md in full; pre-review-9 spec and STE reports in full; evidence.md 1270-1370, 1500-1660, 1700-1900, 1990-2330 and greps (S[1-5], ont-pass5-tree, scratch, headings, P9/R/S labels); catalog.js 1-70 and 120-262; cctv.js 1-60; constants.js:248; sources.js 455-545; ci.yml (greps); cctvOntarioKey.test.mjs 1-160; cctvOntarioRows.test.mjs 1-80 and 395-420; all live-sources test tags (grep); .git/logs/refs/heads/fix-ontario-511-key in full; evidence/pass10 and pass11: check-titles.py (both), test-function-search.log, text-check.json, status-ignored.log, code.diff, review.diff, section-titles.diff (both), repeated-titles.json, openspec-validate.log, openspec-show.json (grep), test logs (grep counts), lint logs (greps for ERROR and STE: lines; I opened three lint logs by mistake and read their first 377 lines of archive warnings only); pass5 reverse.log, automatic-phase1-host.log (line 1), automatic-results.json (title greps); /tmp/pass10-titles.py.

NOT READ
No code run, no git command (I cannot confirm that the working tree equals commit 5d00d646; I rely on status-ignored.log, the empty diffs and the reflog). evidence.md 1-1270, 1370-1500, 1660-1700, 1900-1990 (old records; greps only). The Pass 8 and Pass 9 commits (objects packed). README, DATA_SOURCES.md, SECURITY.md, CHANGELOG.md, CURRENT-STATE.md, .env.example, dev-fresh.sh, trace files, review/pre-review-1 to -8, bodies of the Rows tests beyond lines 1-80 and 395-420. I did not re-measure coverage or the 411 to 314, 107 to 103, 7 to 3 figures; the image ratchet has not run.

End of part 2.
