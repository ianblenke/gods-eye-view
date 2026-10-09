Verdict: PASS

Tree: clone /home/ianblenke/docker/gev-work/fix-ontario-511, commit 4017cfe30a0bd00cba5b2b2db7ffdb209b020c1c. I ran no code and no git. ev is openspec/changes/fix-ontario-511-key/evidence.md. There are 0 major findings and 6 minor findings. Two parts went to team-lead by SendMessage: Part 1 has the replacement map, Part 2 has the clean checks and the read lists.

The restores are correct. R3 (ev:2215) and P1 (ev:2107) equal the Pass 10 and Pass 8 wording (pre10.diff:80 and :37) and are true. The pre-review 10 major is closed. P4 and the automut sentence are true against proposal.md:77 and pass5/automatic-phase1-host.log. No banned word or "echo" appears in new prose. Lint shows 0 errors and no new warning.

- [ ] FINDING minor ev:2276 T1 "from the Pass 9 scratch tree note" -> "Pass 11 deletes the second sentence of note Q2 in the Pass 9 block." No Pass 9 scratch tree note exists. The scratch tree note is ev:1309, and U6 (ev:2338) says Pass 12 deletes a sentence from it. T1 and U6 then read as two passes that delete one sentence.
- [ ] FINDING minor ev:2279,2333 The T rows do not record Pass 11's rewrites of P1 and of the texts of R1, R3, R5 and R6. U1 "again" has no antecedent. -> T4: "At Pass 11, notes P1 and R3 name the cache that is not empty." U1: "P1 and R3 have the words of Pass 8 and Pass 10 again."
- [ ] FINDING minor ev:2282 "the title diff", "the name test function" -> Two other names exist for these objects: the link "Section-title diff" and the link "the search for the reset hook name" (ev:2264). evidence/pass11/check-titles.py is also unnamed. Write: "At Pass 11, the section-title diff against 12e359c7 and the search for the words test function ran again. Their outputs are in evidence/pass10."
- [ ] FINDING minor ev:2253,2264 The Pass 10 block links two files that are Pass 11 runs. No Pass 10 sentence claims them, and ev:2282 discloses it only in the Pass 11 block. -> Move both links to the Pass 11 block, or start each link text with "At Pass 11,".
- [ ] FINDING minor ev:2333,2336,2337,2338 U1 "past-pass words", "Pass 11 cache text"; U4 "Their rows" (glossary: row is an Ontario row; R1 uses "table line"), "R1 uses README line"; U5 "dates ... stored title script"; U6 "The Pass 5 note ... its tests". -> U1 "P1 and R3 have the words of Pass 8 and Pass 10 again. T2 records the text that Pass 11 wrote about the cache." U4 "Their table lines name the text changes. R1 uses the words README line." U5 "The Pass 11 block says that Pass 11 made the two outputs in evidence/pass10 and names the script that evidence/pass10 holds." U6 "The note on the scratch tree in the Pass 5 block names /tmp/ont-pass5-tree. Pass 12 deletes the false sentence about the tests of that tree."
- [ ] FINDING minor ev:2280 T5 "gains" (not sure that "gain" is an approved STE verb), no articles -> "Pass 11 adds a correction title, a tree commit, labels and command records to the Pass 10 block."

Out of scope this round: the optional minor at proposal.md:43 ("covers") stays open, because proposal.md is unchanged.

---- Part 1 of 2 (sent to the lead by SendMessage) ----

Part 1 of 2. STE pre-review 11 of fix-ontario-511-key. Tree: clone /home/ianblenke/docker/gev-work/fix-ontario-511, commit 4017cfe30a0bd00cba5b2b2db7ffdb209b020c1c (read from .git/refs/heads/fix-ontario-511-key). I ran no code and no git. ev = D/evidence.md, D = openspec/changes/fix-ontario-511-key/. My final message: Verdict PASS, 0 major, 6 minor.

PRE-REVIEW 10 REPLACEMENTS (applied / true / changed)
- R3 (major last round), ev:2215: APPLIED, exact. It equals pre10.diff:80 word for word ("The proposal names a camera object from any pack and each new refresh from an empty cache."), and it matches the Pass 10 proposal text at pre10.diff:175. TRUE. The major is closed.
- P1, ev:2107: APPLIED, exact. It equals pre10.diff:37 ("...the cache that holds a source."). The second sentence and the "At Pass 9," sentence are as before. TRUE.
- P4, ev:2116: APPLIED word for word. TRUE against proposal.md:77 ("The evidence does not show the order of the Pass 5 changes to the tests and the Pass 5 changes to the scenario text").
- Automut sentence, ev:1607: APPLIED word for word. The first line of evidence/pass5/automatic-phase1-host.log shows the automut command with --tests Key,Rows; the baselines run one file per worker. TRUE.
- S to T labels: APPLIED. grep: no S1 to S5 pointer to the old Pass 11 rows is left; the S labels at ev:1321, 1335, 1746-1751, 2048, 2065 are the Pass 6 and Pass 7 labels. T and U labels occur only in the two tables. No clash.
- README line: APPLIED at ev:2084, 2213, 2278, 2336. No "README sentence" or "README note" is left in the change files outside review/.
- S4 replacement (pre-review 10 asked for "Notes P1 and P4 name the cache ... and the order ..."): NOT APPLIED as proposed. T4 names P4, P9 to P8 and the two links; it does not name P1.
- Add after P1 "At Pass 11, the proposal says that the cache of the catalog is not empty": NOT APPLIED. T2 records the proposal text instead. Acceptable.
- Script note (check-titles.py): APPLIED but in the Pass 11 block (ev:2282), not next to the Pass 10 command at ev:2234. The text is true: evidence/pass10/check-titles.py reads the pass10 logs. evidence/pass11/check-titles.py also exists, reads the pass11 logs, and no sentence names it.
- Optional proposal.md:43 "covers" (not sure): NOT APPLIED. proposal.md is unchanged this round, so it stays out of scope. It stays an open optional minor.

OTHER CHECKS ON THE HISTORY QUESTION
- T1 to T5 against pre10.diff: T1 true except the place name (finding 1). T2 true against proposal.md:43. T3 true against ev:2084. T4 true (P4 is two sentences; pre10.diff:55-56 relabels P9 to P8; pre10.diff:97-98 and 106-107 change two link texts). T5 true (pre10.diff:72-74, 84-89, 110-112).
- The ev:2282 sentence "ran again; their outputs are in evidence/pass10" is TRUE by file times. The Glob order (oldest first) puts evidence/pass10/test-function-search.log and section-titles.diff between the pass11 logs and pass11/section-titles.diff. The pass10/section-titles.diff command compares /tmp/12e359c7-proposal-titles.txt with /tmp/pass11-proposal-titles.txt, so it is a Pass 11 run. "ran again" is also supported: the Pass 10 corrections-search.log pattern contains "name test function".
- Pass 8, 9 and 10 blocks: no sentence states a Pass 12 fact. Pass 11 facts in them: the R1, R3, R5, R6 row texts and the Pass 10 links were rewritten in Pass 11. R3 is restored. R1 and R6 name the same Pass 10 objects as before. R5 adds "The Pass 3B text 'test helper' stays as a record", which was true at Pass 10 (ev:797 unchanged). Pre-review 10 accepted these. Not reported.
- Pass 11 rewrote P1 and the R rows (pre10.diff:37-38, 84-89). No T row records that, so U1 "again" has no antecedent in the Pass 11 block (finding 2).
- The Pass 10 block links two files that are Pass 11 runs (finding 4). No Pass 10 sentence claims them as Pass 10 work, so I report a minor. The overwrite of evidence files belongs to the spec adversary.

---- Part 2 of 2 (sent to the lead by SendMessage) ----

Part 2 of 2. STE pre-review 11 of fix-ontario-511-key. Tree: clone /home/ianblenke/docker/gev-work/fix-ontario-511, commit 4017cfe30a0bd00cba5b2b2db7ffdb209b020c1c. I ran no code and no git.

CHECKED CLEAN
- Banned words and prefixed forms (explicit, verif*, malform*, wiring, dismiss*, expos*, permit*, retain*, emit*, prior, preserv*, renew*, lone, handover, execut*, prescrib*, echo*), case-insensitive, over the whole of ev: one hit, "prioritized" at ev:674 inside a code block of an old record. None in the diff.
- Lint: pass12/lint-final.log and lint-group-fixed.log say "STE: 0 errors, 540 warnings". The two warnings for D are old (ev:413 "are undefined"; proposal.md:41 "using", quoted log text). lint-group-first.log had 541 warnings (ev:2338 "is deleted"); the final text fixes it.
- Sentence length in the new and changed lines: all 25 words or fewer (T1 first sentence 22; P4 second sentence 23; ev:2282 first sentence 21 with a semicolon). Paragraphs: ev:1606-1609 has 5 sentences; ev:2282 has 2.
- -ing words, passive voice: none new. Tense: simple present and simple past only.
- At Pass N prefixes: ev:1309 "At Pass 5" right; P1 "At Pass 9" and P3, P4 "At Pass 9" right; ev:2282 "At Pass 11" right (the rerun happened in Pass 11).
- Labels: T1 to T5 and U1 to U6 occur once each. P1 to P8 run in order.
- Pass 12 block links: all 13 linked files exist in evidence/pass12. Two files are not linked: status-ignored-first.log (it lists the pass12 *.log files as ignored, "!!"; the final status-ignored.log shows all files staged "A" and no "!!") and corrections-search.log. This is for the spec adversary, not an STE fault.
- Numbers: 12 + 71 = 83 stays in the Pass 11 block (ev:2286-2296). The Pass 12 block gives no count in prose; it links the two test logs only. Not a prose fault.
- Glossary words in the new text: pack (only in the restored R3, Pass 10 wording), source, key, row (only Ontario rows, except U4 "rows" in finding 5), log line, loader, cache, catalog used in their glossary sense. "automut" is a tool name. No glossary row is added by Pass 12 (design.md Pass 8 words is the last block; I read it).
- Task boxes, README, proposal.md, design.md, tasks.md, spec.md, test files, server files: not in the diff. Not re-read for faults except design.md (all) and proposal.md lines 34-53.
- STE-NOUN: "search", "diff", "check" are used as nouns in the Pass 8 to Pass 12 records; the lint gives no STE-NOUN warning for them and earlier rounds accepted them. Not reported.

NOTES
- "gains" at ev:2280: I am not sure that "gain" is an approved STE verb (get / add are safer). Reported as a minor with the word "not sure".
- ev:2282 "name test function" equals the pattern of the Pass 10 search (corrections-search.log line 1), so the words are a true name for that search, but the link text at ev:2264 calls the same search "the search for the reset hook name".

READ
Brief, report, pre11.diff (all), pre10.diff (all), D/review/pre-review-10/ste-adversary.md (all), design.md (all), proposal.md 34-53, evidence.md lines 1300-1345, 1590-1660, 1706-1770, 2095-2367 and greps (banned words, no branch / ont-pass5-tree, automut, README line/sentence/note, rows, T and U labels, S1 to S5, past-pass, which came first), evidence/pass10 and pass11 file lists with file times (Glob order), pass10/section-titles.diff, pass11/section-titles.diff, pass10/test-function-search.log, pass10/check-titles.py, pass11/check-titles.py, pass10/corrections-search.log and text-search.json (grep), pass12/lint-final.log (grep), lint-group-first.log and lint-group-fixed.log (grep), status-ignored.log, status-ignored-first.log, corrections-search.log, pass5/automatic-phase1-host.log (head).

NOT READ
ev lines 1-1299, 1345-1590, 1660-1706, 1770-2095 (old records; only greps), the evidence logs and JSON beyond those named, the STE dictionary (I cannot check each word), git state (I cannot run git; "README/src/server/scripts diff is empty" rests on the brief), CHANGELOG.md, docs/CURRENT-STATE.md, README.md, DATA_SOURCES.md, spec.md, tasks.md, the test files and the server files (none is in the diff).
