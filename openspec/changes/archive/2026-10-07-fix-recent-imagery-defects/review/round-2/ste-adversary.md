Verdict: FAIL
- [ ] FINDING major openspec/changes/archive/2026-10-07-fix-recent-imagery-defects/specs/recent-imagery/spec.md:45,46 "an absent viewport height keeps the position" -> "a viewport height of zero keeps the body scroll position" Two meanings. Test src/ui/recentImagery.test.mjs:2918-2921 ("without a viewport height") passes height 0. The 049 test (2430) says "zero". Spec 051 treats "absent" as not zero. "an absent card rectangle" is a card with no getBoundingClientRect method (a method that returns nothing throws at recentImagery.js:112). Write "a card without a getBoundingClientRect method keeps the body scroll position". Same fix: design.md:87, evidence.md:219-220, that test name, openspec/specs/recent-imagery/spec.md:610-611.
- [ ] FINDING major openspec/changes/archive/2026-10-07-fix-recent-imagery-defects/proposal.md:49 "the old NaN result was partial" -> "the old NaN results were full or partial" design.md:31-32 says the old latitude test expects full coverage with NaN. model.js:471 already counts full as covering, so only the partial case changes tier.
- [ ] FINDING minor openspec/changes/archive/2026-10-07-fix-recent-imagery-defects/specs/recent-imagery/spec.md:10,19,41,45 "the scroll request runs after the restore" -> "the panel sends the scroll request after it restores the body scroll position" ("restore" is a noun); "throws AbortError without a loader cancellation" -> "throws an external AbortError"; "a height of 100 pixels" -> "a viewport height of 100 pixels" (line 45 names the same value); "keeps the position" has no agent: "the panel keeps ...".
- [ ] FINDING minor openspec/changes/archive/2026-10-07-fix-recent-imagery-defects/proposal.md:8,47,49,53 "restores the old position after DETAILS requests scroll" -> "restores the old body scroll position after the panel makes the scroll request"; "caller catalog errors" -> "an error from the caller" (two readings; not sure which one is meant); "sets the opposite values" -> "changes them back, from 40 to 44 and from 76 to 74" (history.jsonl:1880-1881); "address that rank rule" -> "change that rank rule" (probably not STE); semicolons at 47,49,53 -> two sentences.
- [ ] FINDING minor openspec/changes/archive/2026-10-07-fix-recent-imagery-defects/design.md:82-85,88,89 "The tree read is commit" -> "The tree at the start of the corrections is commit"; "The safest decision keeps the body scroll position restore in every render" -> "The panel restores the body scroll position in every render" (4 nouns; "restore" is a noun); "while closed ... while open" -> "while it is closed ... while it is open"; "sparse ring" -> "footprint with an absent point" (spec:59; also tasks.md:56, evidence.md:221); "records signal state" -> "records the state of the signal".
- [ ] FINDING minor openspec/changes/archive/2026-10-07-fix-recent-imagery-defects/tasks.md:5,23,24,47-64 "scroll position restoration" -> "the call that restores the body scroll position"; "unknown entry" -> "stale entry" and "Delete" -> "Remove"; "Use own product keys" -> "Use only keys on the product table itself"; "Set the card height from its open state" -> "Give the test card a height that depends on the open state"; 4.2a-4.6a "Move ... before render in a mutation" -> "Run the mutation that moves ... before `render()`" (the text can also mean a change to production code); put `Array.from(ring).every` in backticks; add articles to "after settle", "before fetch"; "Correct the terms" is vague.
- [ ] FINDING minor openspec/changes/archive/2026-10-07-fix-recent-imagery-defects/evidence.md:138,158,173,175,219,224,227 "failed at the test-process boundary" -> "stopped before it gave test results"; "The earlier after values" -> "The values in the after columns of the earlier table"; "mutant" -> "mutation"; "to false" -> "to `false`"; "The tree read is commit" as design.md:82; semicolons at 173,224,227 -> two sentences.
- [ ] FINDING minor src/layers/recentImagery/thumbnails.test.mjs:410,658 (names) "the fetch errors and AbortError give different states" -> "an Error and an AbortError from the fetch give different states"; "a present day keeps proof" -> "a day with present proof keeps its proof" (spec.md:23 name).

Notes. In the findings, "A" stands for openspec/changes/archive/2026-10-07-fix-recent-imagery-defects. Replace "A/" with that path when you copy them into review/ste-adversary.md. I read commit b29454b in /home/ianblenke/docker/gev-work/fix-ri.

Round 1 majors: all four are closed.
- 050: spec.md:9,10 no longer says "unless DETAILS opens". It now matches the code, where onOpen calls render() and then revealCard.
- Stale paragraph: the proposal paragraph about model.js:406 is deleted.
- 055: the requirement now reads "move the body to show the DETAILS card when DETAILS opens".
- 053: the text now says "starts a new fetch when the caller requests the day again" and "loader cancellation".
The applied spec at openspec/specs/recent-imagery/spec.md:550-624 has the same text as the delta spec.

Owner's word rule: I searched the change folder, the applied spec and the added test names. No banned word appears in the prose. Only code names match: preserveScroll in muts.json and p.emit in tests.

Test comments: the diff adds none.

Lengths: I checked sentences (at most 25 words, 20 for an instruction) and paragraphs (at most 6 sentences) in the changed lines. All obey the limits.

-ing words and passive voice: none in the changed prose. "tagged" and "corrected" are adjectives.

Not read: the logs in evidence/, the muts.json fields that are not prose, and the full test files (only the changed tests and their helper auditScroll).

Not reported, because the diff does not change them: the production comments at src/ui/recentImagery.js:102-105 and 299-301. They use "body position" and "show its card". I am not sure that STE approves the word "absent", but the base spec uses it too. I did not report it.
