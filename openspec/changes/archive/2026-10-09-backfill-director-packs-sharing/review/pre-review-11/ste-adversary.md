Verdict: PASS

Tree: `/home/ianblenke/docker/gev-work/director-3`, branch `backfill-director-3`, commit 0a0d9975fb15403081b52beeea2bf6b69f188077. Scope is `diff ac61cb3d`. I ran no code. A = `openspec/changes/backfill-director-packs-sharing/`.

I found no major finding. All 16 pre-review 10 replacements (S1 to S16) are in the files and say the same thing. S11 and S14 are true against the tests: `backfill.test.mjs:306` and `packs.test.mjs:260`. New prose has no banned word, no prefixed form, no "echo" and no new -ing word. The new faults that the corrections add are minor. Two more parts are in your inbox. Part 1 holds 12 more minors and part 2 holds the checked-clean list and the read lists.

- [ ] FINDING minor A/proposal.md:80 "spec.md line 388 states the clause below." No clause follows. Line 388 has a before-read half, which `sharing.test.mjs:2385` asserts, and an after-settle half. Line 81 pins the scope to `bundle.js:129`, so the limit is clear, but the clause is not named. -> "spec.md line 388 states that the share helpers reject cancellation after the text promise settles."
- [ ] FINDING minor A/proposal.md:76 "are shown by call counts" is passive. -> "Only call counts show the clauses after each digest and after the asset result."
- [ ] FINDING minor A/proposal.md:82 "swallows" is probably not an approved word. I am not sure of the best word. -> "A change that catches that error and does nothing passes each test."
- [ ] FINDING minor A/tasks.md:1594,1597,1598 The rewrite of the tasks adds three faults:
  - 14.18 "Run the OpenSpec check." lost the two commands that the evidence records. -> "14.18 Run the OpenSpec show and validate commands."
  - 14.21 "predispatch check" differs from the glossary word and task 13.13. -> "14.21 Run the predispatch checker."
  - 14.22 "title check" differs from "title scan" in tasks 11.13, 12.15 and 13.14. It can also mean 14.15. -> "14.22 Run the title scan."
- [ ] FINDING minor A/tasks.md:1595 "Compare source edits with the source commit." uses "source" in two meanings in one task. The glossary gives it a third meaning, the source function. -> "14.19 Compare the production files with the source commit."
- [ ] FINDING minor A/tasks.md:1596 "14.20 Correct the task label." lost its referent when 14.9 was split. I think it is the label of task 13.2. The task also sits after the checks, out of work order. -> "14.20 Correct the label of task 13.2."
- [ ] FINDING minor A/evidence.md:16839 "the settle step ran" uses a term that nothing defines. The test pushes 'settled' at `sharing.test.mjs:2423`, before the return at :2424. -> "The settled marker shows that the text method ended before the second check."
- [ ] FINDING minor A/evidence.md:15291 "The run kills m290." uses "run" as a noun, which was the S16 replacement. The Pass 7 note records that predispatch flags this use. -> "The worker runs m290 again. The test kills m290."
- [ ] FINDING minor A/evidence.md:16851,16855 Unquoted words are used as nouns. S6 "use and" -> `use the word "and"`. S10 "uses mutation and code text for await" -> `uses "mutation" for "hoist" and inline code for await`.

**Note:** `T:1592` (14.16, "Run lint and the banned word scan.") is the exact S1 replacement, so I keep it minor. Part 1 has the details.

**Not read:** the logs in `evidence/pass12/`, the clause blocks, the generated tables beyond their labels, and the Pass 4 to 11 records outside the lines named in part 2.

---- Part 1 of 2 (sent to the lead by SendMessage) ----

STE pre-review 11, part 1 of 2 (more findings, all minor). Tree: clone director-3, branch backfill-director-3, commit 0a0d9975fb15403081b52beeea2bf6b69f188077 (read from .git/refs/heads), scope diff ac61cb3d. A = openspec/changes/backfill-director-packs-sharing/, E = A/evidence.md, T = A/tasks.md. I ran no code. The final message holds the verdict and the 8 main findings; I do not repeat them here.

- [ ] FINDING minor E:16972 "Its output lists flags in past records. It gives no TASK flag." "It" can mean the command or its output. -> "The output gives no TASK flag."
- [ ] FINDING minor E:16973,16974 Two different files carry the same link text "[the Pass 12 log]" (predispatch.log and openspec-show.log). One word, two things; the reader cannot tell the logs apart. -> "[the Pass 12 predispatch log]" and "[the Pass 12 OpenSpec log]".
- [ ] FINDING minor E:11549,11550,15267 (and T:1578) Check 2. Task 14.2 now says "does not detect" and "detects" (S8). The m480 block still says "The old test passes this mutation. The new test fails this mutation ..." and E:15267 says "The old sharing file passes m480". The correction leaves three words (passes, fails, detects; the hand rows say kills) for one event, and S8 called passes/fails the wrong way round. -> "The old test does not detect this mutation. The new test detects this mutation with the settled marker out of order." / "The old sharing file does not detect m480 with no name filter."
- [ ] FINDING minor E:15269 "No other test of the old sharing file kills the mutation." "other" has no referent: the old file passes m480, so no test of it kills m480. -> "No test of the old sharing file kills the mutation."
- [ ] FINDING minor E:16869 "the neighbours of each corrected sentence" is vague and not an approved word. -> "the sentences before and after each corrected sentence".
- [ ] FINDING minor E:16877 "for the lead decision" (decision = verb used as a noun). -> "for the lead to decide in review.md".
- [ ] FINDING minor E:16883 "runs no container, image gate, ratchet, archive, review agent, push or gh command": ratchet, archive and push are verbs used as nouns, and a list of seven items before "command" can attach "command" to the last item only. -> "The worker runs no container, no image gate, no ratchet command, no archive command, no review agent, no push command and no gh command."
- [ ] FINDING minor E:16875 "follow their awaited calls": "awaited" is a past participle used as an adjective, "their" has two possible antecedents. -> "follow the calls that they await".
- [ ] FINDING minor E:16854 S9 row "The text names the first failed test and the other tests of the old file." The text does not name other tests; it says that no test of the old file kills m480. -> "The text names the first failed test of the new file and says that no test of the old file kills the mutation."
- [ ] FINDING minor E:11533 "The flag at packs.test.mjs:260 shows no fault" still gives no source for "the flag" (the S14 replacement added the file and line, not the antecedent). packs.test.mjs:260 is [director-090] and asserts load false at :276-279, so the sentence is true. -> "The flag of the lead at packs.test.mjs:260 ..." (name the source of the flag).
- [ ] FINDING minor E:11775 "the 5 stop titles" names the five titles by the verb "stop" and the 12 others by the clause word "before". The five labels (sharing.test.mjs:1947-1951) use "before" and "after". -> "the 5 bundle helper titles at sharing.test.mjs:1946-1953".
- [ ] FINDING minor T:1592 "14.16 Run lint and the banned word scan." Two separate commands (lint-last and banned-last in E). It is the exact S1 replacement of pre-review 10, and one verb with a compound object has the precedent of old 14.17, so I keep it minor. E:16868 "Each task gives one instruction." is true only under that reading. If you want strict one-command tasks: "14.16 Run lint." plus a new task "Run the banned word scan."
- [ ] FINDING minor T:1575-1599 (structure, for the spec side too) Pass 12 corrects pre-review 10, but tasks.md has no section "15. Correct pre-review 10 findings" (sections 12, 13, 14 follow the pattern pass N corrects pre-review N-2). Pass 12 instead rewrote finished tasks of section 14 (14.9, 14.16-14.19) and added 14.20-14.23 after 14.19, out of work order. The heading "## 14. Correct pre-review 9 findings" now holds work of Pass 12.

Part 2 of 2 follows (checked clean, read and not read).

---- Part 2 of 2 (sent to the lead by SendMessage) ----

STE pre-review 11, part 2 of 2 (checked clean, read and not read). Tree: clone director-3, branch backfill-director-3, commit 0a0d9975fb15403081b52beeea2bf6b69f188077, scope diff ac61cb3d. A = openspec/changes/backfill-director-packs-sharing/. I ran no code.

S1-S16 OF PRE-REVIEW 10, EACH CHECKED IN THE FILES
- S1 T:1592 text identical to my replacement. S2 design.md:226 identical. S3 T:1577 identical. S4 E:11513 and E:11517 identical. S5 E:11518 identical. S6 "Only m172 and m389 survive." in audit.md:535, survivors.md, mutations.md and E:15394; grep finds "m172, m389" only inside review/ files. S7 audit.md:528 identical; "Text promise settlement" has no hit left (the other "settlement" hits are Pass 7/8 old records at E:858, 969, 2360, 2390, 2395). S8 T:1578 identical. S9 E:15268,15269 as I wrote. S10 E:11545 heading, E:11548 sentence identical; no link to "m480 red and green" (the only hit is the old line inside the Pass 12 diff code block at E:17017). S11 E:11521 identical; B:306 asserts disposals === 1 after load(null) rejects and the idle state: TRUE. S12 E:11515 and proposal.md:70 identical; the bullet (proposal.md:68-73) has six sentences and no blank line. S13 the Findings table has 3 cells in every row; "H means ... source commit." sits at E:11502, before the first "H:566" at E:11510. S14 E:11523 lead sentence (25 words) and E:11533 as I wrote; packs.test.mjs:260 is [director-090] and asserts false at :276: TRUE. S15 no "read commit" left in new prose (E:819 "read commit `290b5d2`" is an old Pass 7 record with the verb "read"). S16 E:15288 and E:15291 as I wrote (but see the "run" noun finding in the final message).
- Spec minors in the diff: filter statement E:11773-11776 TRUE against backfill.test.mjs:95-114 (12 titles, all with "before") and sharing.test.mjs:1946-1953 (5 labels); W5 label at E:9864 present; the new Known limits name unique ids and the live lines: bundle.js:94, 154, 161 are the checks after await at those lines, :129 is the second check, spec.md:383, 384, 388 are the clauses.

NEW PROSE, CHECKED CLEAN
- Banned words and prefixed forms (explicit, verify, malformed, wiring, dismiss, expose, permit, retain, emit, prior, preserve, renew, lone, handover, execute, prescribed, unverified, echo): 0 hits in all "+" lines of round11.diff.
- -ing words in "+" lines: only "sharing" (name), "heading" and "Findings" (nouns). Passive voice: only proposal.md:76. Sentences over 25 words: none (longest E:11523, 25). Paragraphs over 6 sentences: none (E:16879-16883 has exactly 6).
- Tables: Pass 12 table (20 rows, 3 cells each), Findings table, audit.md table (4 cells). Counts 480, 478, 430/12/228, 494, 125 agree in the diff and files I read.
- Titles: no title, test body or hand row changed; I made no title check beyond the label equality of the audit.md row with sharing.test.mjs:2406.
- Known limit sentences: the three "decides in review.md" lines are 13 words each; "mutation" and "hoist": "hoist" no longer appears in new prose.

READ
round11.diff (all 488 lines), ste-brief-round11.md, report-round11.md, review/pre-review-10/ste-adversary.md and spec-adversary.md, tasks.md 1480-1599, proposal.md 30-99, design.md 150-248, evidence.md 11470-11620, 11760-11790, 15262-15301, 16820-16980 (the Pass 12 block text to the end of the diff, the code blocks by the diff), audit.md 500-537, bundle.js 60-190, spec.md 360-405, sharing.test.mjs 610-640, 1550-1575, 1935-1965, 2355-2445, backfill.test.mjs 85-125 and 300-322, packs.test.mjs 240-280, mutations.md headings by grep, and the file list of evidence/pass12/.
NOT READ
the logs in evidence/pass12/ (exist, content not read), evidence.md Pass 4-11 records outside the lines above, the clause blocks, mutations.md and survivors.md tables (labels by grep only), review/round-1 to round-6, the scripts in gev-tools (counts.py, self-check.py, banned-forms.py), the heading comparison against the Pass 7 text of mutations.md (I cannot tell whether "##" is the Pass 7 original; the spec side should check E:17017 and mutations.md:14578).
