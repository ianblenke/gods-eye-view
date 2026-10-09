Verdict: FAIL

Commit read: 3bc52f7e790d6117e22405517cedf9fbe34104c3, in /home/ianblenke/docker/gev-work/director-3 (branch backfill-director-3). I read the working tree and could not check for uncommitted edits. I ran no code. Parts 1 to 3 went to team-lead by SendMessage.

- [ ] FINDING major src/director/sharing/sharing.test.mjs:2406 The title "check the signal after the text promise settles" (and spec.md:388) claims more than the body asserts. The body asserts only the order ['check','text','check','check'], and text() pushes 'text' before any await. This mutation passes: in bundle.js:128-129, call checkAbort(options?.signal) before the await (`const pending = withShareSignal(file.text(), options?.signal); checkAbort(options?.signal); const text = await pending;`). The order stays identical, because parseSceneShare adds the third check at bundle.js:63. Hand rows a9279 and a9281 do not make this change. Fix: make text() await one tick and push 'settled', expect ['check','text','settled','check','check'], and add the hoist as a hand row. Or retitle to "before and after the call to the text method" and reword spec.md:388.
- [ ] FINDING minor openspec/changes/backfill-director-packs-sharing/evidence.md:5151 Also :5546 and :6071. Old equals New in three rename records. They are Pass 8 records (added at round7.diff:3988, :4383, :4908; f8f6a94d lacks them). The restore-check facts 7 to 9 match only :3064, :3074 and :3079. New must be the live titles (backfill.test.mjs:3039, sharing.test.mjs:818 and :2743).
- [ ] FINDING minor openspec/changes/backfill-director-packs-sharing/evidence.md:9864 W5 says the removed order clauses had no assertion. backfill.test.mjs:306 asserts the order (disposals is 1 after load(null) rejects, and a9130 is killed by it). Correct the sentence.
- [ ] FINDING minor openspec/changes/backfill-director-packs-sharing/evidence.md:651 The director-105 list omits the retagged test sharing.test.mjs:566. Line :11351 says "No tag cell changes"; only the W1 row (:9841) names the added tag.
- [ ] FINDING minor src/director/sharing/sharing.test.mjs:968 Also :1752. "asset total" means the asset count (65 and 64 packs). spec.md:323 and sharing.test.mjs:1859 use "total" for the byte sum. Use "more than 64 assets" and "64 assets".
- [ ] FINDING minor openspec/changes/backfill-director-packs-sharing/proposal.md:74 The blank line inside the Known limit bullet moved and was not removed (Y7 asked to delete it). Row Y7 (evidence.md:9857) says only "old position".
- [ ] FINDING minor src/director/packs/packs.test.mjs:180 "on Stop" and "the transport" appear in no scenario. The body calls clear() and destroy() together, so the title cannot show which call disposes and aborts (spec.md:161 says "clears or destroys").
- [ ] FINDING minor openspec/changes/backfill-director-packs-sharing/evidence.md:612 The 102 list names "The export rejects an excess asset total" twice, but one test carries it (sharing.test.mjs:968). Pass 10 edited both lines.

The other 23 changed titles are true against their bodies. Labels in mutations.md, survivors.md and audit.md equal the live titles, and the numbers agree (670 tests; 479 hand rows, 477 killed, survivors m172 and m389). Details are in parts 1 and 2.

---- Part 1 of 3 (sent to the lead by SendMessage) ----

Part 1 of 3 (spec adversary, pre-review 9; titles against bodies). Tree: /home/ianblenke/docker/gev-work/director-3, branch backfill-director-3, commit 3bc52f7e790d6117e22405517cedf9fbe34104c3 (.git/refs/heads), working tree, I ran no code, uncommitted edits not checkable. B = src/director/packs/backfill.test.mjs, P = packs.test.mjs, H = src/director/sharing/sharing.test.mjs.

The 24 changed titles, each read against its body (the diff has no body line in the three test files, only title lines):
- B:306 "checks the new list and disposes old resources": B:310-313 true, rejects 'Too many data packs', disposals 1, idle/0. The order is still shown (disposal happens although the list is invalid).
- B:359: B:372 order ['check','check','timer'], B:373 state 'loading' at clearTimeout. True without the ready-state claim.
- B:549: B:553 false, B:554 reads 0. B:573 "checks its source signal": B:581 true, B:582 checks 2 (before-bytes is shown by B:377, after-renderer by B:359).
- B:786: B:789 /height/ at -12001, B:792 /ellipsoid/. B:885: id 7 gives /IDs/. B:981: [0,0] gives [0,0,0].
- B:1199, B:1211: B:1206-1207 and B:1219-1220 false and calls 0.
- B:1824 "returns false for a cleared load call": B:1829 false. m180 removes `active !== run ||` at session.js:149, so the call rejects instead of returning false: killed. The old source-signal clause is carried by B:3039-3051 (reads reset to 0 after clear, then 0), the caller-signal clause by B:556-562 (reads 1).
- B:2254, B:2278: B:2268 delay 19, B:2292 delay 15000, then callback() rejects /could not load/.
- B:2997: B:3004-3005 rejects, reason 'Asset load timed out'.
- P:115: P:131-133 credentials omit, redirect 'error', referrerPolicy; P:134-135 invalid path with no fetch; P:136 /byte limit/; P:141 /unavailable/. Dropping "redirects" is right: the body asserts the option, not a rejected redirect.
- P:234: P:250 false, P:257 disposed 1; the body has no replacement, so "keeps the replacement" had to go.
- H:337: H:344 length 8388608. H:455: H:467 reads 1, H:468 original unchanged, H:472-484 attribution and bytes. H:625: H:634 /abort/i. H:2100: H:2107-2113 (3 bytes pass, 2 bytes throw).
- H:566: H:575-582 independent copy, H:585 throws for an aborted signal (no matcher, but the path is valid so only a missing signal check lets it pass), H:587 zero state, H:588 /unavailable/. Tags 104 and 105 fit spec.md:351 and :359.
- H:1099: H:1105 size 0, H:1106-1113 rejects 52428801 with /share exceeds 50 MiB/ and text() not called. H:968: H:970 /too many bundled assets/ (65 packs).
- H:1904: H:1908-1910 'asset byte limit exceeded' at 11184812 characters (8388609 bytes), H:1912-1914 'invalid or oversized base64 asset' at +4. m343 (> to >=) flips the first message: true.
- H:2406: NOT true, see the major finding in the final message.

---- Part 2 of 3 (sent to the lead by SendMessage) ----

Part 2 of 3 (spec adversary, pre-review 9; checked clean, open points). Same tree: commit 3bc52f7e790d6117e22405517cedf9fbe34104c3, working tree, no code run.

CHECKED CLEAN
- All 11 titles of packs.test.mjs that the old script skipped (P:59, 93, 115, 144, 180, 207, 234, 260, 284, 317, 342) read against bodies: true. Notes only: P:59 and the other assert.throws calls have no matcher but each mutation starts from a valid project, so each cause is single; P:144 "stable" is vague; P:180 see the minor in the final message.
- Every title in the three files with before, after, once, again, during, between, each, all, both, every: read in full (B 1-3267 except the repetitive blocks B:2026-2092, sharing H 1-2917 except H:1-123). The only title whose key clause no body line can show is H:2406. H:1904, B:359, B:166, B:181, H:2572, H:2623, H:2640 are good: each has a marker that discriminates the order (a tick before 'cancelled', 'observed' false, aborted set in removeEventListener).
- Labels: every new label in mutations.md (m021, m031, m043, m061, m062, m127, m138, m180, m246, m250, m255, m260, m262, m271, m272, m284, m343, m367, m393), survivors.md (a1567, a1613, a1691, a1692, a1757-a1760, a1944-a1947, a3477, a9130, a9144-a9146, a9150, a9279, a9313, a9314, a9321-a9331, a9334, a9335, a9398-a9402, a9428, a9429, a9455) and audit.md:232-235 and :444-499 equals a live title. A grep of 25 old fragments over the change folder outside evidence.md and review/ finds only the labelled past command lists in mutations.md from line 11170. Hand run (evidence.md:10737-11216): every label equals a live title (the display cuts at 100 characters).
- WHEN lines: B:542 assigns PACK_LIMITS.packs = 9 (spec 088), H:364 assigns SHARE_LIMITS.assets = 65 (spec 102). The scenarios are ADDED, so no modified-scenario rule applies. 094 "final slash" matches B:1488.
- Numbers: 24 changed titles = 13 B + 2 P + 9 H = 24 rows in evidence.md:10545-10568 = changedTitleTemplates 24; 430 + 12 + 228 = 670 = runtimeTests; 479 rows, 477 killed, survivors m172 and m389 (evidence.md:10717-10722, :11216); clause table 315 rows (10223-10537) and 497 = 315 + 182; 494 titles; 11 omitted minus 3 dynamic = 8.
- The seven pre-review 8 spec minors: 1099 fixed, 455 fixed (reads 1), 625 fixed, 337/2100/2406 "byte copies"/"call order" fixed, the WHEN lines fixed, design.md:241 fixed (B:2144 and B:2149 are the two valid-field tests), the Pass 7 prose fixed for the named lines (see the next point).
- No production file, review file or trace file appears in the diff. The three test-file hunks change only test( title lines.

OPEN POINTS (not findings)
- evidence.md:2912 and about 20 other New: lines in "Pass 7 title corrections" (2683-2996) still hold the Pass 8 text (round7.diff:2043-2149 give the f8f6a94d text). Last round named only the lines of "## Pass 7" (2996+), so "W3; records" (evidence.md:9850) holds for those. Say "Pass 7 section" precisely or restore these too.
- The ratchet will see the retag at H:566 as a new 105 link.

---- Part 3 of 3 (sent to the lead by SendMessage) ----

Part 3 of 3 (spec adversary, pre-review 9; read and not read). Same tree: commit 3bc52f7e790d6117e22405517cedf9fbe34104c3, working tree, no code run. Correction to part 2: I read backfill.test.mjs (1-3267), packs.test.mjs (1-365) and sharing.test.mjs (1-2917) in full, including the repetitive blocks; the "except" clauses in part 2 are wrong.

READ
- report-round9.md, round9.diff (all hunks; the long evidence.md Pass 10 hunk by section), the delta spec in full, proposal.md in full, design.md 150-243, tasks.md 1440-1573.
- evidence.md: 90-120, 322-440, 454-530, 588-700, 3030-3110, 5100-5170, 5536-5555, 6060-6080, 9820-10230 (Pass 10 start to clause method), 10223-10540 (clause table), 10539-11490 (changed titles, host results, hand run, final checks).
- mutations.md 1-50, 4880-4915, 7060-7145, 14540-14565; survivors.md 1-40 and the rows in the diff; audit.md grep of every [director- row.
- Production: session.js 55-160, bundle.js 1-131 and 195-221, lifetime.js, manifest.js grep for bounds.
- Earlier reports: review/pre-review-8/spec-adversary.md and ste-adversary.md in full; review7/round7.diff 1990-2390, 3940-4020, 4378-4390 (f8f6a94d text for the Pass 7 records).

NOT READ
- evidence.md outside the ranges above (Pass 2 to Pass 6 and Pass 8 bulk, probe logs, the evidence/ folder), mutations.md rows other than the changed ones, survivors.md rows outside the diff, checks.md, probe-ranges.md, the pass10 scripts (check-clauses.py, restore-check.py), and the review/round-1 to round-6 reports.
- I could not run git, so I did not compare any record with f8f6a94d byte by byte; I used round7.diff, whose "-" lines are the f8f6a94d text and whose "+" lines are the Pass 8 text.
- I did not check uncommitted edits, links.json, gaps.json or history.jsonl (the ratchet has not run).

HOW I REACHED THE MAJOR
Mutation test of H:2406 by hand: bundle.js:127-130 gives checks C1 (127), 'text' (the call at 128), C2 (129) and C3 (parseSceneShare, bundle.js:63). With C2 moved before the await, the order is the same four entries, so the title claim "after the text promise settles" (and spec.md:388) has no failing test. AGENTS.md rule 13 asks for the code change that must make the test fail; no such change exists for the "settles" part.
