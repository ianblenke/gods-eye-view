# Review: gdacs-source

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-10-16
Gates: make gates CHANGE=gdacs-source passed
Rounds: 3
Scope: diff 783ad02a5c4b437b6b180dd5072c2934bd7671b9
Reviewed-Tree: 8ca28b26c3f658e58d0215730ff93193e03116094812f5cd1b70b0f00ba415d5

## Findings

The reports of rounds 1 and 2 are in `review/round-1/` and `review/round-2/`. The reports of round 3 are in `review/round-3/`. Each file holds the report word for word.

A plan review came before the code. It had two rounds, and both reviewers gave FAIL in both rounds. The reports are outside the repository, and the lead corrected all findings in the spec before the code was final.

Round 1 had the scope full, at the commit 5717ba90. Both reviewers gave FAIL. Round 2 had the scope diff 5717ba90, at the commit 783ad02a. Both reviewers gave FAIL again.

Round 3 had the scope diff 783ad02a, at the commit ae974e95. Both reviewers gave PASS with minor findings only. After each of the rounds 1 and 2, the lead ran the fault runs, the mutation run, the live run, the checks and the ratchet again.

After round 3, the lead did not run the faults or the mutation run again, because no code or test changed. The lead corrected the minor findings that lie in `CHANGELOG.md`, `DATA_SOURCES.md` and in one reason of the evidence. The lead added the others to the Known limits of the proposal.

The owner accepted the reading of the license on 2026-10-16. The owner also allowed a push, a pull request and a merge when CI is green.

### Round 1 (commit 5717ba90)

- [x] FINDING major (spec adversary) Scenario 008 made "0099-10-12T01:00:00" null, but the rule said that a valid time has a real date. Fixed: the rule says "a year from 0100 to 9999". Scenario 007 has the valid values "0100-01-01T00:00:00" and (round 2) "9999-12-31T23:59:59". Three named faults fail tests 007 and 008.
- [x] FINDING major (spec adversary) The counts in `evidence/mutations.txt` did not add up (773 in place of 799). Fixed: the numbers of faults and of equivalent faults come from the part files, and the script that writes the evidence checks the sums.
- [x] FINDING major (spec adversary) The age of the stale document had no instant, and the code counts it at the start of the refresh. Fixed: the requirement and scenario 024 say "at the start of the failed refresh". Test 024 moves the clock 30 seconds during the failed page request. A named fault reads the clock again and fails test 024.
- [x] FINDING major (spec adversary) Scenario 020 said that the clock moves 5 seconds, and the test moves it 7 seconds. Fixed: the scenario says 7 seconds.
- [x] FINDING minor (spec adversary) Two tests carried the tag 025 for no line of scenario 025, and tests 010 and 011 named a storm and a volcano but used a flood record. Fixed: the tags are removed, and the tests use the types TC and VO (round 2: FL, VO, then TC).
- [x] FINDING minor (spec adversary) The reasons of two equivalent faults had hidden assumptions (a clock that goes back, ids of the form FL-1e+21). Fixed: the reasons state the assumptions.
- [x] FINDING minor (spec adversary) The live run read one page, named no code commit and did not show the severity 0 of the floods and volcanoes. Fixed: the Known limit `real-service-once` says it. The live run is repeated on each code commit, names the commit and counts the raw records with the severity 0.
- [x] FINDING minor (spec adversary) The comment at the top of `gdacs.js` said that the layer never sees a link or HTML text of the feed. This is false for text fields. Fixed: the comment says that a text field can hold any text. The Known limit `text-is-plain` says that change 2 must show these fields as plain text.
- [x] FINDING minor (spec adversary) The license literal dropped "on this website" of the Commission notice, and the project disclaimer was called "the GDACS disclaimer". Fixed: the literal says "on the Commission website" in the code, the spec, the test and the documents. The Known limits `license-inferred` and `license-owner-step` name the addresses and the date. The disclaimer is "a disclaimer about the GDACS estimates".
- [x] FINDING major (STE adversary) The counts of `evidence/mutations.txt` did not add up. Fixed with the second major finding of the spec adversary.
- [x] FINDING major (STE adversary) The evidence said that no test of the scenario in the first column fails for 11 faults. This was false for 8 of them. Fixed: the check of the script was wrong, because it missed a test title with two tags. The script now stops when a fault that is not an equivalent fault has a scenario that no failing test names. Three faults got the scenario of a failing test.
- [x] FINDING major (STE adversary) The word "page" had two meanings in the spec. Fixed over rounds 1 and 2: a page is a numbered part of the event list, and an answer is the reply of GDACS to a page request. The spec, the design, the proposal, the tests and the fault names use these words.
- [x] FINDING major (STE adversary) The text "Later commits change evidence files and task ticks only" was false. Fixed: the text names the evidence files, the task ticks, the trace files and the archive folder.
- [x] FINDING major (STE adversary) The text "of the last 14 days" in `DATA_SOURCES.md` could mean events that began in the last 14 days. Fixed in round 1, and again in round 2 ("14 days before the refresh").
- [x] FINDING minor (STE adversary) Passive verbs and a verb-less clause in the spec. Fixed.
- [x] FINDING minor (STE adversary) The words "keep a failed refresh as a document" used "refresh" for a document. Fixed: "It MUST NOT cache the stale document or the `unavailable` document."
- [x] FINDING minor (STE adversary) Two test titles named no rule or could mean two things. Fixed.
- [x] FINDING minor (STE adversary) Verbs in the evidence ("had read", "read" as a noun). Fixed.

### Round 2 (commit 783ad02a)

- [x] FINDING major (spec adversary) The line in `CHANGELOG.md` named no instant for the age of the stale document. The notes of the lead said it did. Fixed in round 3: the line says "at the start of the failed refresh". The notes of the lead were wrong, and the new notes say so.
- [x] FINDING major (spec adversary) The glossary of the design still defined a page as the answer of GDACS. Fixed: the glossary uses the definition of the spec.
- [x] FINDING major (spec adversary) The text "14 days before the request" in `DATA_SOURCES.md` had two meanings. Fixed: "14 days before the refresh".
- [x] FINDING major (spec adversary) The scenario 024 used "stale answer" for the reply of the route. Fixed: the route "serves" the stale document.
- [x] FINDING minor (spec adversary) Test 011 made the first case a volcano, and the scenario says a flood. Fixed: FL, VO, then TC.
- [x] FINDING minor (spec adversary) Scenario 015 said "the answers to the pages 2 to 5", and the test defines page 2 only. Fixed: "the answer to page 2".
- [x] FINDING minor (spec adversary) The year clause of scenario 008 could attach to two values. Fixed: each value has its own line.
- [x] FINDING minor (spec adversary) The Known limit `text-is-plain` left out `severity.unit` and the other steps of the clean-up. Fixed.
- [x] FINDING minor (spec adversary) Scenario 007 had no valid sample for the year 9999 and no fault for the upper edge. Fixed: a sample and the fault "Drop a year above 9998 in the real date test".
- [x] FINDING major (STE adversary) The glossary of the design contradicted the spec (page). Fixed with the second major finding of the spec adversary.
- [x] FINDING major (STE adversary) The line in `CHANGELOG.md` named no instant. Fixed with the first major finding of the spec adversary.
- [x] FINDING major (STE adversary) The new lines of scenario 024 used "answer", "holds" and "counts" with two meanings. Fixed: two lines with "serves" and "the age of a document is its age at the start of the failed refresh".
- [x] FINDING major (STE adversary) The title of test 024 read as the age at the failure. Fixed: the title says "if the document is younger than 1 hour at the start of that refresh".
- [x] FINDING major (STE adversary) The text "14 days before the request" in `DATA_SOURCES.md` was false for a cached document. Fixed with the third major finding of the spec adversary.
- [x] FINDING major (STE adversary) The Known limit `text-is-plain` left out `severity.unit` and said "removes only control characters and angle brackets". Fixed with the fourth minor finding of the spec adversary.
- [x] FINDING minor (STE adversary) The input of scenario 015 had a clause with no verb. Fixed: "in ascending order".
- [x] FINDING minor (STE adversary) The design and the proposal said "does not cache a failed refresh". Fixed: "does not cache the stale document or the `unavailable` document".
- [x] FINDING minor (STE adversary) Test 011 made the first case a volcano. Fixed with the first minor finding of the spec adversary.
- [x] FINDING minor (STE adversary) The words "on its website" in the license literal could mean the Union or the Commission. Fixed: "on the Commission website".
- [x] FINDING minor (STE adversary) Fault names and reasons in `evidence/mutations.txt` kept the old sense of "page". Fixed in part: nine fault names and two reasons are changed. The rest is in the Known limit `evidence-words`.

### Round 3 (commit ae974e95)

- [x] FINDING minor (spec adversary) The sentence "the provider serves a document with `unavailable` true when that document is exactly 1 hour old" can bind "that document" to the `unavailable` document. Kept: the Known limit `age-wording` says it. A change of the scenario needs a new ratchet. Test 024 uses the right meaning.
- [x] FINDING minor (spec adversary) The correction of "page" in `evidence/mutations.txt` is not complete. Kept: the Known limit `evidence-words` says it. The names come from the fault script and its logs.
- [x] FINDING minor (spec adversary) The reason of an equivalent fault said "beyond the year 9999", and a clock before the year 0000 also differs. Fixed: "before the year 0000 or after the year 9999".
- [x] FINDING minor (STE adversary) A sentence of `CHANGELOG.md` had 31 words. Fixed: two sentences.
- [x] FINDING minor (STE adversary) Two sentences of `DATA_SOURCES.md` had 30 and 34 words. Fixed: the sentences are split.
- [x] FINDING minor (STE adversary) Some lines of `evidence/mutations.txt` use "answer" for the reply of the route. Kept: the Known limit `evidence-words` says it.
- [x] FINDING minor (STE adversary) The label "Route answer:" of `evidence/live-run.txt` names the reply of the route. Kept: the Known limit `evidence-words` says it. A change needs a new run of the script.
- [x] FINDING minor (STE adversary) The sentence "records whose `todate` has the value" is plural with one value. Kept: the Known limit `plural-value` says it. A change of the scenario needs a new ratchet.

### Notes of round 3

- The STE adversary said that more minor items exist, for example "this holds" with the meaning "is true". The lead did not ask for them, because the process allows no round 4.
- The briefs of the lead gave 32253 bytes for the document of the live run. The file `evidence/live-run.txt` says 32272 bytes, and that number is right.
- The ratchet recorded one more branch for `src/layers/traffic/ingestion.js` and for `src/layers/traffic/surface.js` in `openspec/trace/gaps.json`. This change does not touch these files. The Known limit `traffic-totals` says it.
