Verdict: PASS

- [ ] FINDING minor openspec/specs/live-sources/spec.md:4 The new Purpose sentence ("covers the Ontario camera credential and the Ontario row rules") is not the sentence in design.md:109-110 ("has requirements for the Ontario camera key. It has requirements for the Ontario row rules."). Task 9.2 (tasks.md:141) says "from design.md". Make one text equal the other before you run `make tree`, or the record says the task used a sentence that it did not use.
- [ ] FINDING minor tasks.md:140-146 Three of the seven open boxes are done. 9.3 is done because the image ratchet passed. 9.4 is done because sources.js went from 411 to 314 lines, 107 to 103 branches and 7 to 3 functions (gaps.json:621-623, history.jsonl). 9.2 is done with other words. Rule 17 does not force a check, but review.md must not report these three as open work.
- [ ] FINDING minor openspec/changes/archive/2026-10-09-fix-ontario-511-key/evidence/pass6/automatic-rerun.sh.txt:1 This file and console-probe.mjs.txt hold code under a name that `CODE_FILE` (scripts/spec/lib/inventory.mjs:3) does not count. The 11 `.py` scripts in evidence/pass6, pass8, pass9, pass10 and pass11 are also code that no gate measures. None has a scenario or a test, and the Known limits section does not name them. No sentence records the rename. evidence.md:1722 says Pass 6 "copies the script". The reports pre-review-5/spec-adversary.md:6 and pre-review-6/spec-adversary.md:54-55 cite the old names. evidence.md also cites about 15 scripts in gev-tools/pass3, pass3b, pass5 and /tmp that the archive does not hold. Name all of this in review.md as a limit, with one sentence on the rename.
- [ ] FINDING minor proposal.md:29-30 The text names ratchet commit `60099724`, while history.jsonl records `37137e64` (the numbers agree). "This work changes no ledger file" is true only for the worker pass: the ratchet changed gaps.json, history.jsonl, ids.json and links.json. The Impact section does not name the directionText.js branch total (32 to 33). Its uncovered count stays 2, and the file has no hash line, so this change does not own it. Name both points in review.md.

Tree read: clone /home/ianblenke/docker/gev-work/fix-ontario-511, commit d46ce25d035172f47f1b5c6e4d960a648d7590fb. I ran no code and no git command.

No critical or major finding:
- The merged spec equals the delta text for both requirements and all scenarios 002 to 009. "Transport abort error" is intact.
- Each ID 002 to 009 has tagged tests: 83 tests plus 3 tests tagged with both 006 and 007.
- The sources.js shrink is consistent with the new tests.
- The dev-fresh.sh hash change is the comment edit on line 13, stated in design.md:97.
- The counts agree: 120 tasks, 113 checked; 12+71=83; 140 mutants=131+9; 336 tests in 25 files.
- A search of every archive file, ignored logs included, found no key value. The helper weakens no boundary.
- `make gates` has no error I can see apart from the missing review.md. Any later edit to design.md, tasks.md, evidence.md or the Purpose changes the `make tree` hash, so make the finding 1 fix first.

Two parts went to team-lead by SendMessage (N = 2). Part 1 of 2 lists what I checked and found clean. Part 2 of 2 has the notes, the severity note on finding 3, and the lists of what I read and did not read.

---- Part 1 of 2 (sent to the lead by SendMessage) ----

fix-ontario-511-key spec CONFIRMING round, Part 1 of 2 (checked clean). N = 2 parts. Tree: clone /home/ianblenke/docker/gev-work/fix-ontario-511, commit d46ce25d035172f47f1b5c6e4d960a648d7590fb (read from .git/refs/heads/fix-ontario-511-key). I ran no code and no git. My final message: PASS, 0 critical, 0 major, 4 minors (the final message holds the findings; this part holds no verdict).

CHECKED CLEAN
1. Archive and spec merge. Merged openspec/specs/live-sources/spec.md lines 14-99 equal the delta specs/live-sources/spec.md lines 3-88 text for text (both requirement sentences, both Origin lines, all 8 scenario texts, 002 to 009). The requirement "Transport abort error" (lines 6-12) and scenario 001 are intact. The diff shows one changed line (Purpose, line 4) and 87 added lines. The first two Purpose sentences are unchanged. The Purpose sentence is true.
2. Scenario to test. ids.json has 002 to 009 under fix-ontario-511-key, since 2026-10-09, 5 lines each = 40 lines. retired-ids.json has no live-sources entry. links.json has an array for each of 002 to 009. The diff of 102 lines = 8 headers + 8 closers + 86 links = 83 tests (12 key + 71 rows) + 3 tests tagged with both 006 and 007. So no test is untagged. I did not count the tag text in the 71 row tests one by one; I rely on 833 verified, 0 open.
3. gaps.json. sources.js 314/103/3, totals 1689/489/43, sha 9eed31d3. The 18-line diff = 9 changed values: 7 for sources.js (3 counts, 3 totals, sha), dev-fresh.sh sha, directionText.js branch total 33. No gap entry for ontarioRequest.js and none for a live-sources file. The 7 history.jsonl lines all name fix-ontario-511-key and commit 37137e64. Five are sources.js lines (lines 411 to 314, branches 107 to 103, functions 7 to 3, hash, totals). The numbers equal proposal.md:29. The sources.js shrink is consistent: the four Ontario functions had no calls before, so lines -97, branches -4, functions -4.
4. dev-fresh.sh. The main copy (gods-eye-view, line 13) says "(all keyless)"; the branch says "(Ontario needs a server key)". Both have 400 nonempty lines; the history has a hash line only. The edit is stated in design.md:97, not in proposal.md.
5. Dangling files. No active folder openspec/changes/fix-ontario-511-key is left. The index holds the two .txt files. The .log count in the index is 447 and on disk is 447, and *.log is the only ignore rule that touches the folder. Every link in the Pass 10, 11 and 12 blocks and every file name in the Pass 5 and 6 blocks exists. No .js, .mjs, .cjs, .ts, .html or .sh file is left under openspec/. A grep with an explicit **/*.log glob and one for the other file types found the old script names only in evidence.md:1370 (a gev-tools path), console-probe-image-command.txt (the Docker command), and the reports of pre-review 5 and 6.
6. Key leak. A grep for [?&]key= over every file type of the archive (ignored logs included) finds nothing. ontarioRequest.js writes only the two fixed texts; the loader catch writes one fixed text. .env.example has an empty key. The base loader (main sources.js:477) used resp.json() with no size cap, so the helper weakens no boundary. package-boundaries.json lists the helper.
7. Counts. Tasks 5+11+14+23+13+20+15+12+7 = 120, 113 checked, only section 9 open. 12+71 = 83. 140 candidates = 131 helper + 9 catch; 131 killed, 9 survived; 149 records with phase 2. 336 = 320 + 16 layer tests, 25 files. ci.yml:23 lists 24.14.0 and 26.x; Dockerfile:5 and .node-version say 24.21.0.
8. Report shape. review.mjs AGENT_VERDICT is /^[ \t]*Verdict:.*$/gim and needs exactly one line "Verdict: PASS". My report has one.

---- Part 2 of 2 (sent to the lead by SendMessage) ----

fix-ontario-511-key spec CONFIRMING round, Part 2 of 2 (notes, caveats, read and not read). Commit d46ce25d035172f47f1b5c6e4d960a648d7590fb. This part holds no verdict.

ANSWERS TO YOUR FOUR ATTACK AREAS
1. Archive: clean, except the Purpose text (final finding 1) and the stored scripts (finding 3).
2. Trace commit: the sources.js shrink is real and agrees with the proposal. directionText.js: only the branch TOTAL moved (32 to 33); the uncovered count stays 2, and its sha has no history line, so the file is unchanged. The new Rows tests call directionToHeading (sources.js:493-495) with new inputs, so the total shifts. It is not an entry that this change owns. proposal.md Impact does not name it; put it in review.md by name. The dev-fresh.sh hash change is the comment edit on line 13 (design.md:97 states it; proposal.md does not).
3. False statements: none that decides a verdict. The counts all agree (Part 1, item 7). Small items are in the final message (findings 2 and 4).
4. make gates: I see nothing besides review errors. Notes for you: (a) REVIEW-TREE compares the hash of ALL non-review change files plus every non-openspec/changes diff file, which includes openspec/specs and the trace files (computeTreeHash). An edit to design.md, tasks.md, evidence.md or the Purpose after you run make tree makes REVIEW-TREE fail. If you fix finding 1, do it before make tree. (b) A make run copies openspec/trace back at its end; compare it with the commit. (c) REVIEW-OPEN-FINDING needs each unchecked line in review.md to be checked, or minor, "Accepted by <name>" and Rounds of 3 or more. (d) tasks.md open boxes are not a gate.

SEVERITY NOTE (so you can decide)
My agent rules (check 3) call a file with code that has no scenario or test critical. The 11 .py scripts under evidence/pass6, pass8, pass9, pass10 and pass11 and the 2 .txt scripts are such files: CODE_FILE in scripts/spec/lib/inventory.mjs:3 has no .py and no .txt, so no gate measures them. I filed finding 3 as minor, because your brief scale puts everything outside key leak, weakened boundary, false verdict claim and false title into minor, and because the pre-review 1 to 11 reports left the .py files unfiled. If you want the rule applied literally, raise it; the fix is then to name the files in review.md or the Known limits section.

OTHER NOTES (not filed)
- For the STE adversary: "credential" in the new Purpose sentence is not a glossary term (design.md glossary has key, server key, developer key). The word "covers" is also new in the Purpose.
- pre-review-5/spec-adversary.md:6 and pre-review-6/spec-adversary.md:54-55 cite automatic-rerun.sh:6-7 and evidence/pass6/console-probe.mjs by the old names. Reports stay unchanged; the rename makes those cites resolve only through the .txt names. A .txt copy cannot run with node (no ESM by extension). One sentence in review.md covers it.
- evidence.md:1722 says Pass 6 "copies the script ... to evidence/pass6" and gives no name; the new .txt names appear in no document.
- The pre-review 5 report lists unchecked FINDING lines. The gate reads only review.md, so they are not open findings.
- evidence.md cites about 15 scripts that the archive does not hold (gev-tools/fix-ontario-511/pass3, pass3b, pass5; /tmp/*). Only pass6, pass8, pass9, pass10 and pass11 scripts are stored. I fold this into finding 3.
- Carried and accepted by you by name: the throw inside refreshCctvSources, E7, the nine survivors, the coverage reader issue, the reset hook, README first estimates, the channel gap, no probe on Node 24.14.0. Task 9.1 (coverage reader) stays open for that reason.

READ
Your brief; confirm.diff (all); archive proposal.md, design.md, tasks.md, specs/live-sources/spec.md (all); evidence.md 1 to 2367 (all); openspec/specs/live-sources/spec.md (all); ontarioRequest.js (all); sources.js 396-545; pre-review-10 and pre-review-11 spec reports; review.mjs (all); inventory.mjs line 3; trace: ids.json (live-sources), links.json (002 to 009 start lines), gaps.json (sources.js, dev-fresh.sh, directionText.js, greps for live-sources and ontario), retired-ids.json (grep); scripts/dev-fresh.sh (greps, main and branch); .env.example; ci.yml, Dockerfile, .node-version; .gitignore; .git/index (greps for the archive paths); file lists of evidence/pass4 to pass12.

NOT READ
No code run, no git command, so I cannot confirm that the working tree equals commit d46ce25d (I rely on the ref file and the index). The 447 log files (greps only). pre-review 1 to 9 reports. The test bodies (unchanged since pre-review 11; no code or test is in the diff). README, CHANGELOG, DATA_SOURCES, SECURITY, CURRENT-STATE (unchanged). I did not re-measure coverage or re-run the ratchet or make gates-docs; I rely on your report that the only error is REVIEW-MISSING. I did not read the gate output (the brief had none).
