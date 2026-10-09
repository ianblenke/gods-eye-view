Verdict: FAIL

STE pre-review 8, part 1 of 3. Tree: working tree of clone director-3 at d7334e07 (read from .git/refs/heads/backfill-director-3). Scope: diff b7653ad7. I ran no code.

Abbreviations: A/ = openspec/changes/backfill-director-packs-sharing/; S = A/specs/director/spec.md; B = src/director/packs/backfill.test.mjs; H = src/director/sharing/sharing.test.mjs.

Parts 2 and 3 went to team-lead by SendMessage. Totals: 4 major (X1-X4) and 13 minor (Y1-Y13). The pre-review 7 findings F1-F10 and M1-M17 are present with the same meaning. The read and not-read lists are in part 3.

- [ ] FINDING major X1 B:1824 "[director-090] The session returns false for a cleared load call and does not read the signal state". The body (B:1824-1832) passes no signal and counts no read. It asserts only `await work === false`, so the negative claim is not asserted. "The signal" also has two meanings: S:184 says "caller signal state" and S:186 says "old source signal state". Pre-review 7 M12 proposed this text, and check-verbs.py does not test "does not read". -> "[director-090] The session returns false for a cleared load call". Echoes: A/mutations.md:4911-4912 (m180); A/evidence.md:382, 8309, 9515.

- [ ] FINDING major X2 H:2406 "[director-107] ...check the signal after the text promise settles and report the call order". The share helpers report nothing: readSceneShare returns `{ project, assets }` (bundle.js:130). The `order` array belongs to the test (H:2407-2427). The verb of result is not asserted. -> "[director-107] The share helpers check the signal after the text promise settles". Echoes: A/survivors.md:606 (a9279); A/evidence.md:8530-8531.

- [ ] FINDING major X3 H:1099 "[director-106] The share helpers return a project with the larger bundle file limit and reject excess bytes". The body (H:1099-1114) asserts `v.assets.size === 0` and the rejection. It makes no assertion on the project. Pass 9 retitled H:1076 and H:1548 for this same fault, and check-verbs.py missed this one (flagCount 0). The new row A/audit.md:234 names this title, and A/evidence.md:8554 repeats it. -> "[director-106] The share helpers return an empty asset map for a bundle file above 5242880 bytes and reject excess bytes". Echoes: A/audit.md:234; A/mutations.md:3774-3775 (m138); the Pass 9 "Spec minor 5" record and hand list in A/evidence.md.

- [ ] FINDING major X4 A/evidence.md:8048 "The worker changes test titles and three tag cells only." This is false. The same pass changes 9 documents, and the "scope" record in the same block lists them: audit, design, evidence, mutations, probe-ranges, proposal, the spec, survivors and tasks. -> "In the two test files, the worker changes only test titles and three tag cells."

Minor findings Y1-Y13 are in parts 2 and 3. The main ones:
- **Y1:** "19 milliseconds deadline" uses a plural unit as a modifier (B:2254, 2278).
- **Y2:** "gives its reason" has two antecedents (B:2997).
- **Y3, Y5:** other "it"/"its" cases with two antecedents.
- **Y6:** the audit rows named "Bundle source" use the glossary word "source" for the adapter name.
- **Y7:** a stray blank line in A/proposal.md:71.
- **Y9:** the unbounded "only" in A/design.md:242.
- **Y11:** the word "echo" and subject, noun and article faults in the evidence.md Pass 9 prose.

The stale-label check is clean. Old title fragments in the active documents give 0 hits, and the hits left are in labeled past lists. The banned-word check is clean in new prose.

Files: /home/ianblenke/docker/gev-work/director-3/openspec/changes/backfill-director-packs-sharing/, /home/ianblenke/docker/gev-work/director-3/src/director/packs/backfill.test.mjs, /home/ianblenke/docker/gev-work/director-3/src/director/sharing/sharing.test.mjs

---- Part 2 of 3 (sent to the lead by SendMessage) ----

STE pre-review 8, part 2 of 3 (minors Y1-Y10). Tree: working tree of director-3 at d7334e07; scope diff b7653ad7; I ran no code. A/ = openspec/changes/backfill-director-packs-sharing/; S = A/specs/director/spec.md; B = src/director/packs/backfill.test.mjs; H = src/director/sharing/sharing.test.mjs. Part 1 (the final message) holds the verdict and the majors X1-X4.

- [ ] FINDING minor Y1 B:2254,2278 "at the 19 milliseconds deadline", "at the default 15000 milliseconds deadline": a plural unit is a modifier (check 6). Echoes: A/mutations.md m271,m272; A/evidence.md hand list. -> "at the deadline of 19 milliseconds", "at the default deadline of 15000 milliseconds" (S:201 says "a default deadline of 15000 milliseconds").
- [ ] FINDING minor Y2 B:2997 "gives its reason to the source signal for the deadline": "its" = the session or the source signal. S:202 says "The session sets the source signal reason to Asset load timed out when the deadline expires". Echoes: A/survivors.md a1691,a1692,a9401,a9402; A/mutations.md; A/evidence.md. -> "The session sets the source signal reason at the deadline and rejects the call".
- [ ] FINDING minor Y3 B:549 "after the caller destroys it": "it" = the session or the caller signal state. Echoes: A/survivors.md a1613; A/mutations.md m284. -> "after the caller destroys the session".
- [ ] FINDING minor Y4 B:1199,1211 tail "without a source call" attaches to the session, to the signal or to "returns false". Echoes: A/mutations.md m061,m062. -> "...and makes no source call".
- [ ] FINDING minor Y5 S:145 "the session starts with the idle state. Its load method checks…": "Its" follows "the idle state" (two candidates). -> "The load method of the session checks data pack lists before asset work and rejects an invalid data pack list."
- [ ] FINDING minor Y6 A/audit.md:232,233 rows "Bundle source", "Preview bundle source": the glossary word "source" (A/design.md:196) means a function; here it means the adapter name scene-bundle. S:24,32, A/proposal.md:72 and A/audit.md:266 say "source name". -> "Bundle source name", "Preview bundle source name".
- [ ] FINDING minor Y7 A/proposal.md:71-73: the new blank line inside the bullet is the pre-review 7 M1 fault class. The new sentence at 72 splits "It also covers…" (70) from "It covers geometry types…" (73), so "It" follows a plural subject. -> delete line 71 and move line 72 after line 74 ("Hand rows cover only the additions that audit.md names.").
- [ ] FINDING minor Y8 A/tasks.md:1537,1541 "Correct the repeated titles", "Check the repeated titles": three phrases for one thing (1515 "Check each place that repeats a test title"; 1542 "duplicate titles"). 1531 "Retag" is a verb with a prefix that STE may not approve (I am not sure). -> 1537 "Correct each place that repeats a changed test title."; 1541 "Check each place that repeats a test title."; 1531 "Change the tag of the three GeoJSON field rows."
- [ ] FINDING minor Y9 Names outside inline code: A/audit.md:266 closed-set-added-members; A/design.md:243 and A/evidence.md:8061 allowed-field-added-members -> put them in backticks. A/design.md:242 "The placement tests prove valid fields only." The "only" has no bound: B:448-450 and B:786 prove rejection. -> "The two tests at B:2144 and B:2149 show only that the validator accepts valid fields." A/design.md:243 "stays in force" -> "stays".
- [ ] FINDING minor Y10 A/design.md:199,200,218: the glossary rows that pass 9 added sit in the table under "### Pass 8 words" (184) with "Source commit f8f6a94d" (186). A "Pass 9 words" section, which your brief names, does not exist. A/design.md:218, 223 and 241 define parseSceneDocument three times; 210 and 240 define the store twice. -> add under the table "Pass 9 adds the rows public data pack limits, share limits and document parser." and delete 240-241.

---- Part 3 of 3 (sent to the lead by SendMessage) ----

STE pre-review 8, part 3 of 3 (minors Y11-Y13, checked clean, read and not read). Tree: working tree of director-3 at d7334e07; scope diff b7653ad7; I ran no code. Same abbreviations as part 2.

- [ ] FINDING minor Y11 A/evidence.md Pass 9 prose. 8497 "The destroyed and cancelled load calls assert false": the tests assert, not the calls -> "The tests of the destroyed and cancelled load calls assert false and no source call." 8498 "one disposal" (noun made from a verb) -> "one dispose call". 8301 "signal reads, caller destruction" -> "reads of the signal, the destroy call of the caller". 8354 "used writes and rejects with integrity declarations" -> "used the verbs writes and rejects and the noun integrity declarations". 8141, 8218 "used store for", "used changes for" -> "used the word store for", "used the word changes for". 8081 "named an invalid data pack list, invalid bundle and excess asset count" -> add the articles "an invalid bundle and an excess asset count". 8292 "used repeated titles in new prose" -> "used the heading repeated titles". 8501 "no false alarm remains" contradicts "corrected all five titles" -> "no flag remains". 8291 "First words: The heading echoes." has the word "echo" in new prose and is not the first words of M11 -> "First words: A/evidence.md:6533 heading".
- [ ] FINDING minor Y12 S:234 "The factory rejects a directory URL without a slash at the end." B:1488, A/audit.md:235 and A/proposal.md:72 say "final slash": two phrases for one thing. -> S:234 "...without a final slash."
- [ ] FINDING minor Y13 Titles of scenarios 76-110 with a singular noun and no article (check 6). The lines are not in the diff, and M13 listed other lines: B:885 "rejects ID type for the feature", B:786 "rejects height and reference for the image", B:981 "returns zero for absent height", H:968 "rejects excess asset total". -> "rejects the ID type for the feature", "rejects the height and the reference for the image", "returns zero for an absent height", "rejects an excess asset total".

CHECKED CLEAN
- Owner's banned words and forms: 0 in new prose (rg over round8.diff and A/ outside review/). Hits are only Old records and lint output in evidence.md, the upstream line "preserves" (H:680 hunk header) and the file name verify-patterns.py (file names are not checked).
- Pre-review 7 F1-F10 and M1-M17: present with the same meaning. F2 B:2581,2858; F3, F5, F7, F8 in S; F4 S:148,325, B:542, H:362 and survivors a0004,a2254; F6 H:2366,2385; F9 H:566. F10: A/evidence.md:3278-3376 matches pass 7 in form. Each shown pattern matches its shown line, the test lines end with the quote, comma and arrow, and 3327 is the ${mode} template. I could not run git show, so I did not compare it with f8f6a94d byte by byte.
- Stale labels: rg of about 40 old title fragments in audit, design, proposal, tasks, survivors, probe-ranges and the delta spec: 0 hits. The hits in mutations.md (sections at 11170, 11599, 13231, 14550) and evidence.md (Old/New and Pass 7/8 records) are labeled past lists. m238/m239 (mutations.md:6486,6515; evidence.md:9573-9574) match the live titles.
- The two test files: titles and three tag cells only (I read every hunk). round8.diff names no file under review/.
- Bodies read for the verb of result: B:249, 549, 1199, 1211, 1286, 1297, 1834, 2144, 2149, 2341-2363, 2581, 2858; H:531, 683, 1076, 1548, 2366, 2385. All assert the stated result, except the three in part 1 (X1-X3).
- New audit rows against code: bundle.js:100,117; preview.js:17; source.js:15 are correct. The titles at H:882, H:1216, B:1488 and H:1099 exist.
- No new clause over 22 words; no paragraph over 6 sentences; tasks 12.1-12.21 start with a verb and give one instruction each; survivors.md:394 title is live (B:491).

READ: ste-brief-round8.md, report-round8.md, A/review/pre-review-7/ste-adversary.md, round8.diff (all hunks except the mutations.md row hunks at diff lines 2760-3504, where I read the first hunks, the last hunk and used rg), A/audit.md 205-280, A/proposal.md 50-90, A/design.md 170-244, A/evidence.md 3246-3385 and by rg, the whole delta spec by the openspec show record and S:1-100, preview.js 1-44, bundle.js 92-131, the test bodies listed above.
NOT READ: survivors.md rows outside the diff; mutations.md bodies and label rows 2760-3504 of the diff (labels not compared one by one); probe files; checks.md; packs.test.mjs; review/round-1 to round-6; the lint and predispatch logs; the hand-run logs. I ran no code.
