Verdict: PASS

STE confirming round for `backfill-director-packs-sharing`. I read branch `backfill-director-3` at commit a349ea9bd7bfa54a845b5c825e334cd79a98171e, scope `diff 0a0d9975`. I ran no code. A = `openspec/changes/archive/2026-10-09-backfill-director-packs-sharing/`, E = A/evidence.md, T = A/tasks.md.

I found no major finding. All 22 minors of pre-review 11 are applied in the files or accepted (T:1592 stays). New prose has no banned word or prefixed form, no "echo", no new -ing word, no passive voice, no sentence over 25 words and no paragraph over 6 sentences. The two Purpose sentences are true. The Known limit quotes match `spec.md`. Hand rows a9251, a9252, a9253, a9262, a9263, a9264, a9265, a2525 and a9230 exist. The probe files and the pass13 logs that E cites exist. The faults below were added by corrections, and all are minor.

- [ ] FINDING minor A/proposal.md:77,83 "all four mutations survive the three test files." The proposal never says which four. Limit 2 describes one change, so "all four" is out of place there. Limit 1 lost its sentence that names the change. -> Limit 1: "The probe in evidence/probe-signal-check-order.txt shows that the three mutations that move the check between the call and its `await` at bundle.js:94, 154 and 161 survive the three test files." Limit 2: "The probe in evidence/probe-signal-check-order.txt shows that the mutation that catches the error at bundle.js:129 survives the three test files."
- [ ] FINDING minor A/proposal.md:80 `"after the text promise settles. They reject cancellation."` The quote has no antecedent for "They". -> `scenario director-107 states that the share helpers reject cancellation after the text promise settles.`
- [ ] FINDING minor E:17069 (K3) "The filter includes eight more labels and their killer rows." "Filter" has more than one meaning in the change. A reader can take it as the script now reading eight more labels, but E:11774 says the script does not read them. -> "The filter text names eight more labels and their killer rows."
- [ ] FINDING minor E:11776,11788 "They also include these labels" mixes titles and labels. "Those clauses" now sits after the label list, so a reader can attach it to the eight new labels. -> "They also include the titles that these labels build at sharing.test.mjs:2256-2303:" and "kill the clauses of the 12 before titles and the 5 bundle helper titles."
- [ ] FINDING minor E:17070-17078 (K4, K5, K6 and the lines below the table). Four faults:
  - K4 "Tasks 14.18 to 14.22 name the checks": 14.20 is a correction, not a check.
  - K5 does not name `mutations.md`. `audit.md:530` and `survivors.md:1072` keep level 3 for the same heading.
  - K5 and K6 use vague terms: "The vague template claim is absent", "Unneeded sentences are absent".
  - "the folder scope rule" is defined nowhere in the change, and the link lines have no verb.
  -> K4 "name the commands and the label"; K5 "The mutations.md block Pass 11 hand count has its own heading. The sentence about the script template is gone."; K6 "The worker removed the sentences that nothing needs."; "The script pass11/append-hand.py is outside the change folder. The worker does not change it."
- [ ] FINDING minor T:1594,1603,1607,1609 Four faults:
  - 14.18 "Run the OpenSpec show and validate commands." names two commands (the same shape as 14.16).
  - 15.1 and 16.1 have the same text, "Correct the prose.", and do not say which prose.
  - The heading "Post-ratchet text corrections" breaks the "Correct pre-review N findings" pattern.
  - -> "16. Correct pre-review 11 findings" and "Correct the text of the proposal and the evidence."
- [ ] FINDING minor E:16887 "follow the calls that they await." A check does not await. -> "come after the `await` of each call."
- [ ] FINDING minor E:15279,15281 (also E:11549-11550, T:1578) "does not detect" and "kills" name one event, so the paragraph uses two words for it. -> "The old sharing file does not kill m480 with no name filter." Also change "detect" to "kill" at E:11549-11550 and at T:1578 (see part 3 of 3 for the full text).

---- Part 1 of 3 (sent to the lead by SendMessage) ----

STE confirming round, part 1 of 2 (the 22 pre-review 11 minors, one by one, and checked clean). Tree: clone director-3, branch backfill-director-3, commit a349ea9bd7bfa54a845b5c825e334cd79a98171e (read from .git/refs/heads). Scope diff 0a0d9975. A = openspec/changes/archive/2026-10-09-backfill-director-packs-sharing/, E = A/evidence.md, T = A/tasks.md. I ran no code. My verdict and findings F1-F8 are in my final message.

THE 22 MINORS OF PRE-REVIEW 11 (9 in its final message, 13 in its part 1), each checked in the current files:
1. proposal.md:80 "the clause below": replaced by the quote of director-107 (proposal.md:80). The quote matches spec.md ("after the text promise settles. They reject cancellation."). New fault: F2.
2. proposal.md:76 passive: now "Only call counts show the clauses after each digest and after the asset result." OK.
3. proposal.md:82 "swallows": now "A change that catches that error and does nothing passes each test." OK.
4. T 14.18, 14.21, 14.22: T:1594, 1597, 1598 equal the three replacements. OK (14.18 two commands: F6).
5. T 14.19: T:1595 equals the replacement. OK.
6. T 14.20: T:1596 equals the replacement. Task 13.2 exists (T:1556). OK.
7. E "settle step": E:16853 "the text method ended before the second check". OK.
8. E "The run kills m290": E:15302-15303 "runs m290 again. The test kills m290." OK.
9. E S6 and S10 rows: E:16865 and E:16869 have the quotes. OK.
10. E "Its output lists flags": E "The output gives no TASK flag." OK (diff hunk at E:17000 area).
11. E two "[the Pass 12 log]" links: now "[the Pass 12 predispatch log]" and "[the Pass 12 OpenSpec log]". Both files exist in evidence/pass12/. OK.
12. E m480 passes/fails: E:11549-11550 and E:15279 now use detect. OK, but F8 (detect and kill).
13. E "No other test": E:15281 "No test of the old sharing file kills the mutation." OK.
14. E "neighbours" sentence and "Each task gives one instruction.": deleted. OK.
15. E "for the lead decision": E:16889 "for the lead to decide in review.md". OK.
16. E "runs no container, image gate ...": deleted. OK.
17. E "follow their awaited calls": E:16887 "follow the calls that they await". Replaced, but F7.
18. E S9 row: E:16868 equals the replacement. OK.
19. E "The flag at packs.test.mjs:260": E:11533 "The flag of the lead at ...". OK.
20. E "5 stop titles": E:11775 "5 bundle helper titles at sharing.test.mjs:1946-1953". The five titles at sharing.test.mjs:1953 are "The bundle helpers stop ${label}", so the name is true. OK.
21. T:1592 14.16: unchanged. Accepted as minor in pre-review 11. Not reported again.
22. T structure: sections 15 and 16 added (T:1601-1611). OK (heading and duplicate text: F6).

CHECKED CLEAN
- Banned words and prefixed forms (explicit, verify, malformed, wiring, dismissal, dismiss, expose, permit, retain, emit, prior, preserve, renew, lone, handover, execute, prescribed, unverified, echo): 0 hits in the "+" lines of confirm.diff (grep with -i). The Pass 13 banned-forms.log also says 0 hits.
- -ing words in new prose: only "during", "sharing" (name), "heading" and "loading" (state name in the Purpose-neutral spec clause 089). No new -ing word.
- Passive voice in new prose: none. Old titles with "are configured", "is absent" and "is not finite" exist since earlier passes (they are in links.json lines of the diff only because the hashes changed).
- Sentences over 25 words in new prose: none (longest: E:11775, 20 words). Paragraphs over 6 sentences: none.
- Purpose sentences (spec.md:7-8): 19 and 17 words. Every noun phrase equals a glossary word (validator, decoder, session, directory source, bundle helpers, store, share helpers, preview) and a requirement name. Both true against the 8 merged requirements.
- Merged requirements: 8 headings (Data pack manifests, geometry, sessions, Asset sources, Scene bundles, Bundle byte store, Share work, Share preview). I read all 35 scenarios in the diff and found no banned word and no new fault. Not compared word for word with the delta (you did).
- Hand rows a9251, a9252, a9253, a9262, a9263, a9264, a9265, a2525, a9230 exist in survivors.md (lines 211, 557, 578-592) and kill the 8 labels that E:11778-11786 names. The labels are at sharing.test.mjs:243 and 2256-2303 (checked line by line). K3 "eight" = 7 + 1: true.
- Known limit quotes: "after each digest", "after the asset result" and "after the text promise settles. They reject cancellation." are in spec.md (director-107). bundle.js:93-94, 127-130, 150-154, 160-161 agree with the JSON names f3a-f3d. Probe file shows four SURVIVED.
- Files cited by the Pass 13 block exist: probe-signal-check-order.txt, probe-signal-check-order-mutations.json, pass13/counts.log, check-repeated-titles.log, self-check.log, banned-forms.log, headings.log.
- Counts 480, 478, 430/12/228, 494, 125, 670 agree with pass13/counts.log and E.
- No title, label or hand row changed since 0a0d9975, so no label n audit.md, mutations.md, survivors.md or E can have gone out of date. No restored record changed.
Part 2 of 2 follows (read, not read, notes).

---- Part 2 of 3 (sent to the lead by SendMessage) ----

STE confirming round, part 2 of 2 (read, not read, notes). Tree: director-3, branch backfill-director-3, commit a349ea9bd7bfa54a845b5c825e334cd79a98171e. Scope diff 0a0d9975. A = openspec/changes/archive/2026-10-09-backfill-director-packs-sharing/. I ran no code.

CORRECTIONS TO PART 1: in the -ing line, read "'loading' (the state name in the clause of director-089)" and in the last bullet read "no label in audit.md, mutations.md, survivors.md or evidence.md can have gone out of date".

NOTES
- Severity. I found no major finding. The closest case is F1 (proposal.md:77,83). Each limit is clear in its first lines, and limit 2 names its one change. The probe result is true. Only the count "four" has no antecedent in proposal.md (the four names f3a-f3d are in the JSON, not in the proposal). Nobody can read four variants of the check at bundle.js:129 into limit 2. I graded it minor because there is no second meaning. If you want it clean, use the F1 replacement.
- Rule 16 of AGENTS.md names blocker/minor as the vocabulary of the gate; you asked for major/minor. I have only minors, so the conflict does not matter in this round. Write the same words in review.md that the gate reads.
- Lint count. E:17094 and pass13/lint-final.log:587 record "585 warnings". You report 586. I did not run lint. A likely cause is one more STE-ING warning for "loading" in the merged openspec/specs/director/spec.md (the log lists the same warning at the delta spec.md:163). Not a defect: the Pass 13 line is a record.
- Heading levels. mutations.md:15075 now has "##", but audit.md:530 and survivors.md:1072 keep "### Pass 11 hand count". This is not a defect (the K5 row says only that the block has its own heading), but F5 asks for the file name in K5.
- Task order. T:1596 (14.20) still sits after the checks (14.19). Pre-review 11 listed it with the order complaint; I do not report it again.
- Scope. The brief (item 1) asks for the replacements F1-F10 and M1-M17 of pre-review 7. I did not recheck them against the files. I relied on the confirmations of pre-reviews 8 to 11 (pre-review 10 and 11 both checked the earlier replacements and the restored records), and on the fact that confirm.diff shows no line of those records.

READ
- /home/ianblenke/docker/gev-tools/director-3/review-confirm/ste-brief-confirm.md and report-confirm.md.
- confirm.diff: lines 1-30 and 1573-2257 in full (evidence.md, mutations.md, proposal.md, tasks.md and spec.md hunks and the merged spec). The trace hunks (gaps.json, history.jsonl, ids.json, links.json, lines 22-1572) only by grep: banned words, passive voice, -ing words in the titles.
- A/review/pre-review-10/ste-adversary.md and A/review/pre-review-11/ste-adversary.md (full).
- A/proposal.md (full), A/tasks.md 1480-1612, A/design.md 160-248 (glossary), A/evidence.md 11520-11810, 15268-15318, 16820-16980, 17040-17100, A/evidence/probe-signal-check-order.txt and -mutations.json, A/evidence/pass13/lint-final.log (by grep), banned-forms.log, counts.log.
- openspec/specs/director/spec.md lines 1-14 (Purpose), src/director/sharing/bundle.js 56-170, sharing.test.mjs 243, 1936-1975, 2250-2320, 2410-2430 and survivors.md hits for the nine hand rows.

NOT READ
- evidence.md outside the lines above (Pass 4-11 records), the clause blocks and mutation code blocks.
- mutations.md and survivors.md tables beyond the labels and the hits above; audit.md except the grep hit at line 530.
- The delta spec A/specs/director/spec.md (I read the merged copy in confirm.diff; you compared both word for word).
- The other pass13 logs (tests, predispatch, format, titles, corrections-search, openspec-show, openspec-validate, check-repeated-titles, self-check, headings) exist but I did not read them.
- review/round-1 to round-6, review/pre-review-7 to pre-review-9; review/pre-review-11/spec-adversary.md only through grep.
- The scripts in gev-tools (counts, scan-titles, append-hand.py, mut-host.py).

---- Part 3 of 3 (sent to the lead by SendMessage) ----

STE confirming round, part 3 of 3 (the cut tail of my final message). Tree: director-3, branch backfill-director-3, commit a349ea9bd7bfa54a845b5c825e334cd79a98171e.

The last finding was F8. Its full text:
- [ ] FINDING minor A/evidence.md:15279,15281 (also E:11549-11550, T:1578) "does not detect" and "kills" name one event, so the paragraph uses two words for it. -> "The old sharing file does not kill m480 with no name filter." Also change "detect" to "kill" at E:11549-11550 ("The old test does not kill this mutation. The new test kills this mutation with the settled marker out of order.") and at T:1578 ("14.2 Show that the old test does not kill m480 and the new test kills m480.").

A = openspec/changes/archive/2026-10-09-backfill-director-packs-sharing/, E = A/evidence.md, T = A/tasks.md.

No finding follows F8. The tail holds nothing that is not in the final message, and the final message already holds F1 to F8. Parts 1 and 2 hold the 22 minors, the checked-clean list and the read and not-read lists, with no new finding. The verdict stays PASS (minor findings only).
