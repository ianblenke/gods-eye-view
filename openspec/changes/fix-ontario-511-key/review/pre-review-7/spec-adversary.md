Verdict: PASS

Tree: clone /home/ianblenke/docker/gev-work/fix-ontario-511, commit 4c0454810720ce8a3291a1dff6856911875daf3a (read from `.git/refs/heads/fix-ontario-511-key`). I ran no code and no git command. I found no critical or major finding, and 7 minors. D/ is `openspec/changes/fix-ontario-511-key/` and ev is `D/evidence.md`. 2 parts went to team-lead by SendMessage: the clean checks, then the notes and the read and not-read lists.

- [ ] FINDING minor D/design.md:85 "It exists for tests and has no scenario of its own." follows "Import the module once without a query string." The nearest noun is the module, and for the module the sentence is false (scenarios 002 to 005 cover it). The glossary row at design.md:44 is fine. I weighed major and kept minor: the paragraph is about the hook, and pre-review 6 graded a lost antecedent (ev:2076) minor. It does not block. Fix now: "The reset hook exists for tests and has no scenario of its own."
- [ ] FINDING minor ev:1308 and ev:1602 "At Pass 6, the automatic run used another copy of the tests." The prefix dates the run to Pass 6. This is the Pass 5 run (root /tmp/ont-pass5-tree, ev:1601; ev:2019 says so). The only run after Pass 6 used the live copy (ev:2020-2022). Write "S18 (Pass 6) shows that this run used another copy of the tests."
- [ ] FINDING minor D/proposal.md:68-69 "Node 24.14.0, the version of the CI job that runs `npm test`" assumes one such job. ci.yml:23 is a matrix, and both legs run `npm test` (ci.yml:57). "only Node v26.8.2 was probed" can read as all versions, but v24.21.0 was probed (proposal.md:63). Write "the 24.14.0 leg of the two CI jobs that run `npm test`" and "Of the 26.x versions, only v26.8.2 was probed."
- [ ] FINDING minor ev:2106 and corrections-search.log:26 The cited support is "catalog.js lines 156 to 201". The "at most once in 15 minutes" bound rests on catalog.js:245-256, which keeps the cache through an empty refresh and sets `_cctvSourceCacheAt` at :256. The proposal sentence is true; add 245-257 to the citation.
- [ ] FINDING minor ev:797 "It is a test helper." names the reset hook. This is carried from pre-review 6 spec F4. The glossary keeps "helper" for the request helper (design.md:45). Pass 8 did not change this line or accept it by name. Use "reset hook".
- [ ] FINDING minor D/proposal.md:41-43 The 15-minute bound covers only a cache that holds a source. With an empty cache (catalog.js:159, :245), each call that is not in flight runs the loader, so the line repeats. The limit is silent on this. Add one sentence or accept it by name.
- [ ] FINDING minor D/proposal.md:72-73 "spec.md lines 21, 29 and 31" and "line 83" are true for the change delta `specs/live-sources/spec.md`. After archive, `openspec/specs/live-sources/spec.md` has other line numbers, because live-sources-001 comes first. Write the path.

Checked clean:
- P1 to P4 against catalog.js, constants.js:248, ci.yml, spec.md and the tests.
- The base image: Dockerfile:5, the probe command file and all 8 places that use the term.
- The glossary rows for host and anchor.
- The test counts 12, 71 and 83, and the labels 336, 25 files, 131, 9, 140 and 149.
- The task boxes against the evidence.
- No test title is false, and no path for the key to reach a console channel exists.

I read neither the git state nor the full ev:1-1295.

---- Part 1 of 2 (sent to the lead by SendMessage) ----

fix-ontario-511-key pre-review 7, spec adversary, part 1 of 2 (CHECKED CLEAN). Tree: clone /home/ianblenke/docker/gev-work/fix-ontario-511, commit 4c0454810720ce8a3291a1dff6856911875daf3a (read from .git/refs/heads/fix-ontario-511-key). I ran no code and no git command. D/ = openspec/changes/fix-ontario-511-key/, ev = D/evidence.md. This part is not a verdict. My final message holds the verdict (PASS, 7 minors).

P1 (proposal.md:41-43) is TRUE against the code.
- getCctvSources (catalog.js:156-172) returns the cache when it is non-empty and age <= CCTV_SOURCE_CACHE_MS (constants.js:248 = 15 * 60 * 1000).
- refreshCctvSources (:181) calls pack.load only inside the allSettled map at :199-202, and only when needsLiveSources (:192-193) and pack.enabled().
- :245-246 replaces the cache only if capped is non-empty or the cache is empty, so a non-empty cache never goes empty again. :256 sets _cctvSourceCacheAt in both branches (stale-serve included), so calls are at least 15 minutes apart start to start. Single-flight (:167-170) removes the concurrent case. cctv.js:37 creates one catalog per plugin, cctv.js:138 is the only caller.
- The "0 enabled (using nearest 0)" line: ontarioRequest.js:21 and :39 return [] for no key and for any fetch/JSON error; sources.js:467 passes the array test; sources.js:532-534 logs. A 200 with a non-array body returns at :467 before the log, so proposal.md:36 ("no log line or warning") stays true. "No scenario covers those cases" is true: scenario 003/004 name only the request helper; no test runs the loader with an absent key or after a request error.

P2 (proposal.md:71-74) is TRUE.
- spec.md:21 and :29 quote the request error text with "writes" and no channel. :31 quotes the row error text, no channel. :83 says "a log line" (glossary: any channel). Lines 21, 29, 31, 83 are right for the change delta file.
- Tests: warn for request error text at Key.test 91, 112, 164, 204 and Rows.test 655 (loop, channel warn); warn for row error text at Key.test 153 and Rows.test 318; log for the loader line at Rows.test 409, 432, 491, 601. Matches "console.warn" and "console.log".
- spec.md:16 (scenario 003) says "warning", which the glossary ties to console.warn, so leaving 003 out of the limit is right.

P3 (proposal.md:68-69): ci.yml:23 matrix [24.14.0, 26.x] (both legs run npm test, :57); ci.yml:111 windows-onboarding is 24.14.0 and runs a focused node --test list (:124) with no Ontario test. Probe facts true: ev:1365-1372 (v26.8.2 only on the host), pass6/console-probe-image.json:2 (v24.21.0). See the minor in my final message about "the CI job".

P4 (proposal.md:76-77) is consistent with ev:2058-2061 and with tasks.md:107-109 vs :120 (tests listed before "Correct the specs"). No contradiction.

P5: Dockerfile:5 is `FROM node:24.21.0-bookworm-slim` (only FROM in the file). .node-version = 24.21.0. pass6/console-probe-image-command.txt line 1 and 3 name node:24.21.0-bookworm-slim, ID 0e0ff40c39bc. All 8 places that call the probe run "the base image" (tasks.md:125; proposal.md:63; ev:1472, 1717, 1718, 1721, 1737, 1999, 2047, 2050). Remaining "Docker image" uses (design.md:35, 56, 65, 72, 105; ev:978, 1112, 1202, 1589, 1699, 1717 first sentence, 1732, 2001, 2071) all mean the project check image or the gate verdict, which is right. ONTARIO_ANCHORS (constants.js:127-134) has six points; "anchor" row true; uses at proposal.md:65-66 agree. "host" row: spec.md:43 and the Rows titles use "URL host name"; all other "host" uses in D/ mean the computer.

P6: "test function" is gone from proposal, design, tasks and ev (grep: no hit; ev:2137 is the only text with the phrase, and it states the absence). ev:797 still says "test helper" (minor in my final message). Glossary "reset hook" matches ontarioRequest.js:9-12. "fixture" row is true for Key.test fixture() and Rows.test load().

P7/P8: tasks.md:129 and ev:2000 and ev:2019-2020 agree (after Pass 6). ev:1330-1332 is the E1 sentence and ev:1318 is the README row, exactly as ev:2082 says; no earlier edit shifted them (the diff hunks before 1330 are in-place, +0 lines).

Numbers: pass8/cctvOntarioKey.test.log "tests 12, pass 12, fail 0"; cctvOntarioRows.test.log "tests 71, pass 71, fail 0"; repeated-titles.json 83 titles, 14 references, flags []; verbs.json 83 tests, one flag (Rows 003 absent key, true); lint-final.log:544 "STE: 0 errors, 542 warnings"; ev:1976-1989 gives 25 files, 336, 333 + 3, host repeat 21; 131 + 9 = 140, 140 + 9 = 149. Pass 7 text "333 ... 21 includes the three denied ... 336" is arithmetic-true. I disagree with no test title. The test files were not in the diff; I re-read Key.test (all) and Rows.test 1-140, 140-300, 296-660.

Key leak check (critical class): ontarioRequest.js catch (:32) logs only a constant; sources.js catch (:536) logs only a constant; the Loaded line holds counts only. No new leak path. The tests mock all six channels in both fixtures.

---- Part 2 of 2 (sent to the lead by SendMessage) ----

fix-ontario-511-key pre-review 7, spec adversary, part 2 of 2 (notes, READ and NOT READ). Tree: commit 4c0454810720ce8a3291a1dff6856911875daf3a in /home/ianblenke/docker/gev-work/fix-ontario-511. No line of this part is a verdict.

NOTES (not findings)
1. Severity call on design.md:85. I weighed major: the nearest noun before "It exists for tests and has no scenario of its own." is "the module" (design.md:84), and for the module the sentence is false (scenarios 002 to 005 cover it). I graded minor because the paragraph is about the hook and "exists for tests" is the hook's defining trait, and because pre-review 6 graded the lost antecedent at ev:2076 minor. If you read the scale's "false doc claim" strictly, raise it. The fix is four words: "The reset hook exists for tests and has no scenario of its own."
2. Rule 20 faults that Pass 8 added: design.md:85 (antecedent) and ev:1308 / ev:1602 (the "At Pass 6," prefix puts the Pass 5 automatic run at Pass 6; ev:1307 still says the scratch tree "copies ... the Pass 5 tests", which S18 shows is only true of the older Pass 5 tests). New lint warnings in the change folder: ev:2113 "floating" (STE-ING) and proposal.md:69 "was probed" (STE-PASSIVE). Warnings only; the STE adversary owns them.
3. The Known limit at proposal.md:42-43 is true but has two edges the code allows. (a) If refreshCctvSources rejects (it is not wrapped; loadSourcesFromFile, normalizeSourceItem, allocateSourceCap, joinGroundHeights can throw only on odd data), _cctvSourceCacheAt is not advanced and the next call re-runs the loader at once. (b) An empty cache has no TTL. I put (b) in my final message as a minor; (a) is unusual and I do not report it.
4. Out of the Pass 8 diff, carried, not reported: ev:2031 "The lead did not run the equivalence probes again" for the nine survivors (h43, h44, h91, h103, h104, h113, h126, h127, h130). The Known limits do not name it. Pre-review 6 did not raise it. If you want the section complete, add one sentence or accept it by name in review.md.
5. README.md:295 ("poses are first estimates") has no Ontario content; E1 stands by your decision. Not in the diff.
6. tasks.md has no Pass 7 or Pass 8 section. No false box (rule 17 is met); the evidence holds the Pass 7 and Pass 8 work. proposal.md:41 quotes the log line without its "[CCTV] " prefix; tests assert the full text. Both harmless.
7. Optional, ev:2110-2111: "Pass 8 puts the first line reference in a separate sentence ... No other P1 or P2 word changes." The proposal text is yours word for word, and I could not see a prior draft or codex-9.txt. The statement has no baseline I could check. Minor at most; I did not file it.
8. Open decision still in the text: proposal.md:76-77 says the lead decides in review.md whether to accept the E7 order limit. That is a deliberate deferral, not a defect, but review.md must then carry the acceptance by name.

READ
report-pre7.md; pre7.diff in full; proposal.md, design.md, tasks.md and specs/live-sources/spec.md in full; pre-review 6 spec and STE reports in full; evidence.md 1296-1366, 1362-1490, 1585-1760, 1690-1800, 1960-2150 and a header grep of the whole file; evidence/pass8 (host-check.py, corrections-search.log, repeated-titles.json, verbs.json in full, lint-final.log by grep, both test logs by grep); evidence/pass6/console-probe-image-command.txt and console-probe-image.json by grep; catalog.js 25-84 and 120-262; constants.js 123-134 and 225-270; sources.js 380-570; ontarioRequest.js; cctv.js 25-55; Key.test and Rows.test in full; ci.yml in full; Dockerfile and .node-version by grep; package.json test script by grep; openspec/specs/live-sources/spec.md headings; openspec/trace ids/links by grep for live-sources.

NOT READ OR NOT DONE
No code run, no git command (I cannot confirm that the working tree equals the commit, that the Pass 8 files have index entries, or that no ignored file exists; I rely on status-ignored.log existing). evidence.md lines 1-1295 and 1490-1585 (header grep only); evidence logs of passes 1 to 7; pre-review 1 to 5 reports; README, CHANGELOG, SECURITY.md, DATA_SOURCES.md, CURRENT-STATE.md, .env.example, dev-fresh.sh (not in the diff); normalize.js and automut.mjs (relied on pre-review 6 for lines 468-471 and 149-150); trace files beyond the live-sources grep; I did not re-measure any coverage figure or the 411 to 314, 107 to 103, 7 to 3 numbers (the ont2 trace was discarded).
