Verdict: FAIL

Tree: clone /home/ianblenke/docker/gev-work/fix-ontario-511, branch fix-ontario-511-key, @4c045481 (ref read from .git/refs/heads). I ran no code. D/ = openspec/changes/fix-ontario-511-key/ and ev = D/evidence.md. I sent 2 parts to team-lead. Part 1 has 10 more minors. Part 2 has the pre-review 6 map, a pre-review 1 spot check, the clean checks and the read lists.

- [ ] FINDING major D/proposal.md:68-69 @4c045481 "the version of the CI job that runs `npm test`. The CI job on Node 26.x floats, and only Node v26.8.2 was probed." The plain reading is false. ci.yml:23 and :57 show one job with two matrix legs, 24.14.0 and 26.x, and both run `npm test`. So the clause does not name the 24.14.0 leg. "only Node v26.8.2 was probed" contradicts proposal.md:60 and :63, which say Node v24.21.0 was probed in the base image. The first clause came from the pre-review 6 replacement, and that replacement was wrong. "floats" and the passive "was probed" are not STE. -> "The CI matrix runs `npm test` on Node 24.14.0 and on Node 26.x. No worker ran the console probe on Node 24.14.0. The job on Node 26.x uses the newest Node 26 release, and the probe used only Node v26.8.2 of that series."

- [ ] FINDING major ev:1308 and ev:1602 @4c045481 "At Pass 6, the automatic run used another copy of the tests; see S18." Pass 8 added this prefix, so the lines are in the diff. The run happened at Pass 5 on /tmp/ont-pass5-tree (ev:1601, ev:2019). The automatic run that belongs to Pass 6 is the later one on the live copy (tasks.md:129, ev:2020-2022). Read plainly, the sentence gives the wrong pass and can mean either run. The other reading is "known at Pass 6". -> "Pass 6 found that this automatic run used another copy of the tests; see S18."

- [ ] FINDING major D/design.md:85 @4c045481 "It exists for tests and has no scenario of its own. The current tests cover all its code." Pass 8 dropped the subject. Line 84 ends "Import the module once without a query string.", so "It" reads as ontarioRequest.js. That reading is false, because scenarios 002 to 005 cover that module. -> "The reset hook exists for tests and has no scenario of its own. The current tests cover all the code of the reset hook."

- [ ] FINDING minor ev:2140 @4c045481 "The proposal headings do not differ from 3ac3af22. The README, src, server and scripts diff is empty." Two faults that Pass 8 corrected elsewhere are back:
  - "headings" should be "section titles", as at ev:2087. "heading" also means camera heading in spec.md:59-63.
  - The four-noun group is back. Pre-review 6 fixed it at ev:2010.
  -> "The proposal section titles do not differ from 3ac3af22. The diff for README.md, src, server and scripts against that commit is empty."

- [ ] FINDING minor D/proposal.md:43 @4c045481 "while its cache holds a source": "its" can mean the catalog or the loader. Only the catalog has a cache. The claim is true for the catalog (catalog.js:158-163). -> "while the cache of the catalog holds a source."

- [ ] FINDING minor ev:1718 @4c045481 "the output of the base image": an image has no output. The probe has. -> "the output of the probe in the base image".

Checked and true against the code: P1 (catalog.js:158-163 and :245-256, constants.js:248, sources.js:532-534) and P2 (spec.md lines 21, 29, 31 and 83). I found no banned word, prefixed form or "echo" in the new prose. The new -ing word is "floating" (ev:2113). The two warning texts in the code equal spec.md:16, 21, 29 and 31.

I did not read the test files, CHANGELOG.md, docs/CURRENT-STATE.md or automut.mjs. I could not run git, so "unchanged since pre-review 5" rests on the diff file and the brief. Part 2 lists the rest.

---- Part 1 of 2 (sent to the lead by SendMessage) ----

fix-ontario-511-key STE pre-review 7, part 1 of 2 (10 more minors). Tree: clone /home/ianblenke/docker/gev-work/fix-ontario-511, branch fix-ontario-511-key, commit 4c0454810720ce8a3291a1dff6856911875daf3a (ref read from .git/refs/heads/fix-ontario-511-key; working tree, not confirmed clean). I ran no code. D/ = openspec/changes/fix-ontario-511-key/; ev = D/evidence.md. My final message has the verdict, 3 majors (proposal.md:68-69, ev:1308 and 1602, design.md:85) and 3 minors (ev:2140, proposal.md:43, ev:1718).

- [ ] FINDING minor D/proposal.md:76-77 @4c045481 "the order of the Pass 5 test changes and the Pass 5 changes to the scenario text. The lead decides in review.md whether to accept this by name." "Pass 5 test changes" is a noun group next to a different form of the same thing, and "this" has no clear antecedent (the order? the lack of proof?). ev:2060 says "this limit". -> "The evidence does not show the order of the Pass 5 changes to the tests and the Pass 5 changes to the scenario text. The lead decides in review.md whether to accept this limit by name."
- [ ] FINDING minor ev:2113 @4c045481 "P3: The CI limit names the job that runs npm test and the floating Node 26.x version." "floating" is a new -ing word that is not a technical name, and "the job that runs npm test" repeats major 1 (two matrix legs run npm test, ci.yml:23,57). -> "P3: The CI limit names the Node versions of the CI matrix and the newest Node 26 release."
- [ ] FINDING minor ev:2114 @4c045481 "P4: Known limits now names the unknown order of the Pass 5 test and scenario changes." The verb does not agree with the plural (ev:1328 "Known limits accept", ev:2055 "Known limits name"). "Pass 5 test and scenario changes" is the noun group that pre-review 6 flagged at ev:2055. -> "P4: Known limits now name the order of the Pass 5 changes to the tests and to the scenario text. The evidence does not show this order."
- [ ] FINDING minor ev:2058-2060 @4c045481 "E7: The Pass 5 evidence, commit 33118620 and codex-6.txt do not show the order." The split of the sentence left "the order" with no object in the first sentence, and ev:2060 repeats it ("The evidence does not show the order."). -> "The Pass 5 evidence, commit 33118620 and codex-6.txt show no order for the changes to the tests and the changes to the scenario text. The lead decides in review.md whether to accept this limit by name." and delete ev:2059 and the first sentence of ev:2060.
- [ ] FINDING minor ev:2050 @4c045481 "The second file names the command, name and ID of the base image, and exit code." Articles are missing; ev:1721 has the right form. -> "The second file names the command, the name and ID of the base image, and the exit code."
- [ ] FINDING minor ev:2117 @4c045481 "The probe records name the base image." "records" can be a noun or a verb, so the sentence has two parses. -> "The records of the probe name the base image."
- [ ] FINDING minor ev:2137 @4c045481 "The other matches for routes are a file name and old command output. No current reset hook or fixture has the name test function." "routes" is a search word with no mark (proposal.md:49 has a file name routes.js, ev:1728 has old output; both true). "has the name test function" is unclear. -> "The other matches for the word routes are a file name and old command output. No current text calls the reset hook or the fixture a test function." (I grepped: "test function" appears nowhere else in D/ prose files.)
- [ ] FINDING minor ev:2082, ev:2122 @4c045481 "The lead chose the E1 sentence at ev:1330-1332. It replaces the STE text for the README row at ev:1318." (1) "ev:" is not defined in evidence.md; ev:1659 writes "evidence.md:674". (2) "README row" uses the glossary word "row" (design.md:48, one Ontario 511 record) for a table line. (3) ev:1318 holds the lead's own text, not STE text; I am not sure what "the STE text" is. ev:2122 has the same "current evidence lines 1330 to 1332 and 1318" with two items for one noun. -> ev:2082: "The lead chose the E1 sentence at evidence.md lines 1330 to 1332. It replaces the text that the STE report proposed for the README line in the table at evidence.md line 1318." ev:2122: "P8: The E1 note gives the lines 1330 to 1332 and the line 1318 of this file."
- [ ] FINDING minor ev:2110-2111 @4c045481 "To meet the 25-word limit, Pass 8 puts the first line reference in a separate sentence. Pass 8 uses log line in place of count line to match the glossary. No other P1 or P2 word changes." "first line reference" is a noun group with no clear head. "No other P1 or P2 word changes" reads as a noun group, and it is not true: P1 and P2 replaced more words (layer -> catalog, pin, warn, count line). -> "Pass 8 moves the reference to spec.md lines 21, 29 and 31 into its own sentence, so that no sentence has more than 25 words. Pass 8 writes log line in place of count line to match the glossary." (count line occurs nowhere else in D/.)
- [ ] FINDING minor ev:2135, ev:2148 @4c045481 "the code and document references"; "All new log files have index entries." Not sure: "code and document references" can be (code and document) references or code and (document references); evidence.md defines no index. -> "the references to code files and to documents"; name the index file or delete the sentence.

End of part 1. Part 2 has the pre-review 6 map, the pre-review 1 spot check, the clean checks and the read lists.

---- Part 2 of 2 (sent to the lead by SendMessage) ----

fix-ontario-511-key STE pre-review 7, part 2 of 2 (pre-review 6 map, pre-review 1 spot check, checked clean, read and not read). Tree: clone /home/ianblenke/docker/gev-work/fix-ontario-511, branch fix-ontario-511-key, commit 4c0454810720ce8a3291a1dff6856911875daf3a (ref read from .git/refs/heads; working tree). I ran no code. D/ = openspec/changes/fix-ontario-511-key/; ev = D/evidence.md.

PRE-REVIEW 6 REPLACEMENTS (applied / true / wrong)
- Major proposal.md:41 (loader line): applied with the lead's own text (proposal.md:41-43). TRUE: catalog.js:158-163 returns the cache while it holds a source and its age is at most CCTV_SOURCE_CACHE_MS (constants.js:248, 15 minutes); catalog.js:245-256 shows that an empty refresh keeps the old cache and waits one TTL; sources.js:532-534 writes the line for an empty row list (no key, request error). "No scenario covers those cases" is true (spec.md:83 has the line only for the cap case). One fault left: "its cache" (minor in the final message).
- Major proposal.md:68-69 (console channel): applied with the lead's P2 text (proposal.md:71-74). TRUE: spec.md:21, 29, 31 quote the texts with no channel; spec.md:83 says "a log line" with no channel; the tests assert pairs ['warn', text] and ['log', line] (ev:1943, 1961 show the diff of that style). Line numbers 21, 29, 31, 83 match.
- proposal.md:66 "routes" + "one CI job": applied, but the replacement is WRONG (major 1): both matrix legs run npm test (ci.yml:23, 57), and "only Node v26.8.2 was probed" contradicts proposal.md:60, 63. Windows onboarding (ci.yml:111) uses 24.14.0 and runs no npm test and no Ontario test.
- base image: row added (design.md:78), true against Dockerfile:5 (FROM node:24.21.0-bookworm-slim). Used in proposal.md:63, tasks.md:125, ev:54, 1717, 1718, 1721, 1737, 2000, 2047, 2050, 2117. Remaining "Docker image" uses all mean the project image: ev:1589, 1699, 1732, 2001, 2071, proposal.md:46, 80, design.md:35, 56, 65, 105, tasks.md:142, 146. New faults: ev:1718 (minor in the final message), ev:2050 (part 1).
- proposal.md:51: applied ("A request with a valid key can still get these errors."). I did not report "get": openspec/ste/words.json maps obtain -> get, so the project prefers "get".
- ev:1999 vs ev:2019: applied (ev:2000 equals the replacement). tasks.md:129 matches.
- ev:2076 (E1/E8): applied at ev:2082; faults in part 1.
- ev:2043, 2044 (E1/S1, E2/S7): applied, equal to the replacements, TRUE (ev:1330-1332 uses the past tense and the prefix; ev:2000 names the worker).
- ev:2049-2050 (E4): applied (ev:2052-2053), equal. I did not re-read automut.mjs; pre-review 6 checked automut.mjs:149-150.
- ev:2055 (E7): PARTIAL, lead variant split in two sentences; the first sentence lost its object (part 1).
- ev:2061, 2065 ("nine survivors"): applied. ev:2070-2071 -> ev:2076-2077: applied, equal; 333 + 3 = 336 is true. ev:1700: applied, TRUE (Dockerfile:5), wording differs ("the Dockerfile already used"). ev:2010: applied. ev:2075, 2081 -> ev:2081, 2087-2088: applied, equal.
- "test function": design.md:44 and ev:1753, ev:2064 applied. design.md:85 lost its subject (major 3).
- "anchor": design.md:79 equals the replacement and is TRUE against constants.js:127-134 (six points). The sentence in proposal.md:65-66 uses the word as the row defines it.

PRE-REVIEW 1 SPOT CHECK (the diff does not touch these; I read the final files)
- spec.md (read in full): no precedence, canonical, scalar, edge space, nonempty, existing, pending, as before, keyed, should, shall, may. Titles and lines show the replacements: 004 "Return an empty row list for an invalid key", 005 names the fetch, JSON reader and row code, 006 "Select valid rows and image views", license and anchor cities named, units present.
- proposal.md, design.md, tasks.md: no hit of the same words except proposal.md:4 "The owner approved" (not the DATA_SOURCES.md case). "unverified" is gone.
- proposal.md:16 and design.md:5 name two requirements. tasks.md:19-20 are split (show, validate). proposal.md:30 "This work changes no ledger file."
- README.md:308-309, DATA_SOURCES.md:81, SECURITY.md:21 equal the pre-review 1 replacements. .env.example:176 has "server key".
- Not checked: the pre-review 1 test titles (Rows.test, Key.test), CHANGELOG.md and docs/CURRENT-STATE.md (not in the diff; I did not read them).

CHECKED CLEAN
- Banned words and prefixed forms and "echo": case-insensitive search of evidence.md, proposal.md, design.md, tasks.md: one hit, "prioritized" at ev:674 (code quote, old). The new prose has none.
- -ing words: new text has one, "floating" (ev:2113). Others are warning, string, heading (allowed) or quoted log text ("using", proposal.md:41; ev:1915-1943 old diff).
- Passive voice: no passive verb in the new lines. "was wrong" (ev:1700) is a predicate adjective.
- Sentence length: the longest new sentences have 22 to 24 words (ev:2053, ev:2082). Paragraphs: proposal.md:71-74 has 5 sentences; the others fewer than 6.
- Tasks: tasks.md:125 and :129 each give one instruction plus one statement sentence. No Pass 7 or Pass 8 section in tasks.md (spec matter, not STE).
- Warning texts: ontarioRequest.js:19, 36 and sources.js:537 equal spec.md:16, 21, 29, 31 and the quoted text in proposal.md:41 (sources.js:533 template).
- Glossary: rows base image, anchor, host, reset hook do not conflict with other uses I found. "test function" and "count line" no longer occur in D/ except in ev:2111 and ev:2137 (named as removed words).
- Test titles, server files, README: the diff is empty for them (I rely on the diff file and the brief; I could not run git).

READ
Brief, report-pre7.md, pre7.diff (all), pre-review 6 STE report (all), pre-review 1 STE report (all), D/proposal.md, design.md, tasks.md, specs/live-sources/spec.md (all), ev:1296-1375, 1575-1770, 1940-2149, catalog.js:1-262, sources.js:455-545, constants.js:127-134 and :248, ci.yml:10-128, Dockerfile greps, ontarioRequest.js greps, openspec/ste/words.json, README.md/DATA_SOURCES.md/SECURITY.md/.env.example greps.

NOT READ
ev:1-1295 except greps, ev:1376-1574 and 1771-1939 (old Pass 5 and Pass 6 records), the evidence/pass* logs and JSON, automut.mjs, the test files (Key.test, Rows.test), review/pre-review-2 to -5, CHANGELOG.md, docs/CURRENT-STATE.md, README.md:295, the trace files.

End of part 2.
