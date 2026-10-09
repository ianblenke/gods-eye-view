Verdict: FAIL

Tree: `/home/ianblenke/docker/gev-work/fix-ontario-511`, branch `fix-ontario-511-key`, commit `d46ce25d035172f47f1b5c6e4d960a648d7590fb`. I ran no code and no git. D = `openspec/changes/archive/2026-10-09-fix-ontario-511-key/`.

- [ ] FINDING major openspec/specs/live-sources/spec.md:4 "The capability also covers the Ontario camera credential and the Ontario row rules." The archive step wrote a Purpose sentence that is not the one in the design.
  - D/design.md:107-110 says the lead adds a different sentence: "The capability also has requirements for the Ontario camera key. It has requirements for the Ontario row rules." D/tasks.md:141 says "Add the Purpose sentence from design.md at archive time."
  - design.md:110 is now false, and task 141 cannot be called done.
  - "credential" is a second name for what the requirement title (spec.md:14) and the glossary (design.md:46, 55) call "key". "covers" in the sense "includes" is not an approved STE meaning.
  - Pre-review 2 already changed "credential" to "key" and "covers" to "has requirements for". The archive step brought both back.
  - The lead's acceptance of "the open Purpose sentence" covered a missing sentence, not a different one.
  -> Write the design.md text word for word: "Keep the identity of an error that a transport aborts. Reject a fetch with the same error object that the fetch function gave. The capability also has requirements for the Ontario camera key. It has requirements for the Ontario row rules."
  - `scripts/spec/lib/specs.mjs:38-41,75` hash only the scenario name, the body and the requirement name and text. The Purpose is in no hash, so this edit rehashes no scenario.
  - `openspec/specs/` changes, so run `make gates-docs` after the edit.

- [ ] FINDING minor openspec/specs/live-sources/spec.md:96 (and D/specs/live-sources/spec.md:85) "Reject a non-array response" In this capability "reject" means a promise rejection (scenario 001; the Purpose). Scenario 009 says the loader returns an empty source list and throws no error. The body is clear, so this is minor and not new. -> "Return an empty source list for a response that is not an array". `ids.json` hashes the scenario name, so a title change needs a new ratchet. No test title changes. I recommend that the lead accepts it by name.

Checked clean:
- **Archived documents:** they equal the pre-review 11 text. Every rename in `confirm.diff` has similarity 100%, and the evidence.md line numbers in the pre-review 11 report still match.
- **Merged spec:** the two requirements equal the delta text line by line, and "Transport abort error" is intact.
- **Banned words:** the only hit is "prioritized" at evidence.md:674, inside an old code record. The new Purpose sentence has none.
- **Links and file names:** all 34 links in evidence.md point to existing files. No live sentence names the old `.sh` or `.mjs` file names of the two probe scripts.
- **Other STE checks:** the -ing words, passive voice, task form and counts (113 of 120 tasks, 12 + 71 = 83 tests, 140 mutants) show no new fault.

Parts 1 and 2 of 2 went to team-lead by SendMessage. They hold the read and not-read lists and two notes: tasks 142 and 143 are done but still unchecked, and design.md:5 reads as old after the archive.

---- Part 1 of 2 (sent to the lead by SendMessage) ----

Part 1 of 2. STE confirming round of fix-ontario-511-key. Tree: clone /home/ianblenke/docker/gev-work/fix-ontario-511, commit d46ce25d035172f47f1b5c6e4d960a648d7590fb (from .git/refs/heads/fix-ontario-511-key). I ran no code and no git. Verdict FAIL: 1 major, 1 minor. D = openspec/changes/archive/2026-10-09-fix-ontario-511-key/.

THE MAJOR (new fault of the archive step)
openspec/specs/live-sources/spec.md:4 reads "The capability also covers the Ontario camera credential and the Ontario row rules."
D/design.md:107-110 ("Purpose at archive time") says: "The lead adds this sentence to the live-sources Purpose at archive time: 'The capability also has requirements for the Ontario camera key. It has requirements for the Ontario row rules.'" D/tasks.md:141 says "Add the Purpose sentence from design.md at archive time."
1. The merged sentence is not the sentence of design.md. The design.md sentence is now false, and task 141 cannot say it is done.
2. "credential" is a second name for the object that the requirement title (spec.md:14) and the glossary (design.md:46, 55) call "key". Pre-review 2 (STE, 2 minors) already moved the project from "credential" to "key" and from "covers" to "has requirements for". The archive step brought both back. The words "credential" and "cover" (in the sense include) are not approved STE words, and "credential" is in no glossary row.
3. The lead's acceptance "the open Purpose sentence" in review.md covered a missing sentence, not a different one.
REPLACEMENT: put the design.md text word for word in openspec/specs/live-sources/spec.md:4: "Keep the identity of an error that a transport aborts. Reject a fetch with the same error object that the fetch function gave. The capability also has requirements for the Ontario camera key. It has requirements for the Ontario row rules." Then design.md:107-110 stays true, no glossary word is missing, and task 141 is done (you may then check it: 114 of 120, 6 open; tasks.md is under an allowed path).
SAFE FOR THE LEDGER: scripts/spec/lib/specs.mjs:38-41 and :75 hash the scenario name, the body, the requirement name and the requirement text. The Purpose is in no hash, so the edit rehashes no scenario. Run make gates-docs after the edit, because openspec/specs/ changes.
Alternative if you want to keep your wording: edit D/design.md:110 to your sentence and replace "credential" by "key" in both. I do not recommend it; the design.md text is already STE-checked.

THE MINOR (old, not new, optional; accept by name)
spec.md:85 (merged) and D/specs/live-sources/spec.md:85 title "Reject a non-array response". In this capability "reject" means a promise rejection (scenario 001, "rejects with that same error object"; the Purpose, "Reject a fetch"). Scenario 009 says the loader returns an empty source list and throws no error. The body is clear, so I file it minor and not major. A new title, "Return an empty source list for a response that is not an array", needs a new ratchet: ids.json stores a hash of the scenario name. The test titles (links.json) do not use the heading, so no test changes. I would accept it by name.

NOTES, NOT FINDINGS
- D/tasks.md section 9: tasks 142 (ratchet in the image) and 143 (sources.js gap at or below the ledger) are open, but the image ratchet ran and the gap shrank (411 to 314 lines, 107 to 103 branches, 7 to 3 functions in history.jsonl). If review.md lists them as open, say that the work is done and the box waits for review.md. Counts: 5+11+14+23+13+20+15+12+7 = 120 tasks, 113 checked, 7 open. True.
- D/design.md:5 "No current specification names Ontario" sits under "Base commit", so it is true for the base commit. It reads as old after the archive. Not filed.

---- Part 2 of 2 (sent to the lead by SendMessage) ----

Part 2 of 2. STE confirming round of fix-ontario-511-key. Tree: clone /home/ianblenke/docker/gev-work/fix-ontario-511, commit d46ce25d035172f47f1b5c6e4d960a648d7590fb. I ran no code and no git. D = openspec/changes/archive/2026-10-09-fix-ontario-511-key/. CORRECTION to Part 1: the heading "Reject a non-array response" is at line 96 of the merged openspec/specs/live-sources/spec.md and at line 85 of D/specs/live-sources/spec.md.

CHECKED CLEAN
- Archived documents equal the text of pre-review 11: every rename in confirm.diff has similarity index 100%, and the line numbers that the pre-review 11 report cites in evidence.md (2215, 2276, 2280, 2282, 2333 to 2338) match the file now (evidence.md ends at line 2367 with Pass 12).
- Merged spec lines 14 to 99 equal D/specs/live-sources/spec.md lines 3 to 88 line by line. The requirement "Transport abort error" (merged lines 6 to 12) is intact. Scenario IDs 002 to 009 occur once each.
- The line pointers in proposal.md:73-74 ("lines 21, 29 and 31", "line 83") still point to the right lines of D/specs/live-sources/spec.md (004 request error text, 005 request error text, 005 row error text, 008 log line).
- Banned words and prefixed forms (explicit, verif*, malform*, wiring, dismiss*, expos*, permit*, retain*, emit*, prior, preserv*, renew*, lone, handover, execut*, prescrib*, echo*) in proposal.md, design.md, tasks.md, evidence.md, D/specs and the merged spec: one hit, "prioritized" at evidence.md:674 inside a code block of an old record. None in the Purpose sentence.
- -ing words in proposal.md, design.md, tasks.md and D/specs: only nouns and technical names (warning, heading, string, Meaning) and the quoted log text "using" at proposal.md:41. No passive verb with "is/are/was/were/be + -ed" in those files.
- Sentence length and paragraph length in proposal.md: the paragraph at lines 34 to 37 has 6 sentences (the limit), the longest sentence has 21 words. Lint reports 0 errors per the brief.
- Tasks: every task starts with a verb in the imperative. The second sentences at tasks.md:44, 45, 125 and 129 are statements, not instructions.
- The 34 links of evidence.md (Pass 10, 11 and 12 blocks) point to files that exist in the archived folder. proposal.md has no link. The only absolute "openspec/changes/fix-ontario-511-key/..." strings in evidence.md (lines 726 to 746, 1267 to 1288, 2246) are command records and diff headers of past runs; they stay.
- The two probe scripts: no live sentence names evidence/pass6/automatic-rerun.sh or evidence/pass6/console-probe.mjs. evidence.md:1370 names pass5/console-probe.mjs in a gev-tools path inside a command record; evidence.md:1722 says "copies the script" without a file name. The review reports (pre-review 5 to 7) name the old file names; they are past records.
- Labels S, T, U, R, P, Q, E: unchanged by the archive. The T and U rows (evidence.md:2274 to 2338) are as in pre-review 11. The 12 minors of pre-review 11 stay accepted by name; I did not repeat them.
- Numbers: 12 + 71 = 83 tests (evidence.md:2225 to 2231), 140 = 131 + 9 mutants (evidence.md:1119), the ledger lines in history.jsonl (411 to 314, 107 to 103, 7 to 3) equal proposal.md:29.
- Test titles of the two test files: the 009 test title is "return an empty source list for non-array data ..." (cctvOntarioRows.test.mjs:294). I read the titles of cctvOntarioKey.test.mjs (11 lines) and found no banned word. They are not in the diff.

READ
Brief, report-confirm.md, confirm.diff (all), pre-review 11 STE report (all), merged live-sources spec (all), D/specs/live-sources/spec.md (all), D/proposal.md (all), D/design.md (all), D/tasks.md (all), D/evidence.md lines 2195 to 2367 and greps (banned words, links, scripts, rerun/.sh/.mjs), the evidence/pass10 to pass12 file lists, grep of Purpose and credential in D/ and in the user documents, scripts/spec/lib/specs.mjs lines 1 to 140, ids.json lines 2086 to 2096, links.json grep for live-sources-009.

NOT READ
evidence.md lines 1 to 2194 (old records; greps only), the evidence logs and JSON, the review reports before pre-review 11 (grep only), README.md, DATA_SOURCES.md, SECURITY.md, CHANGELOG.md, docs/CURRENT-STATE.md and .env.example (not in the diff), the trace files except the lines named above. I cannot see the git index: whether the ignored *.log evidence files are tracked after the archive move is the item of the spec adversary, and I did not check it. I do not know the STE dictionary by heart: "credential" and "cover" (include) are my judgement, not a lint result.
