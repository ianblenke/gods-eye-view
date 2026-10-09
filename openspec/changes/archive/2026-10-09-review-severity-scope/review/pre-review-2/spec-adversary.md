Verdict: FAIL

I read commit 81d6709074707252a69a2fbc3182dbfc6bc9add1 (clone review-severity-scope). I ran no code and no git. Proof, mutations and fixes are in SendMessage parts 1 to 3. All six findings are new faults of the round2 diff.

- [ ] FINDING major openspec/changes/review-severity-scope/specs/change-review/spec.md:7 (also .claude/agents/ste-adversary.md:76 and :27, design.md:23, review.test.mjs:432) The definition "a word or a phrase that openspec/ste/words.json lists" has two meanings. The file has five lists. `allowedIng` lists "finding" and "meaning", so "findings" (spec.md:3) and "meanings" (agent :77, :86, :89) are banned words by the letter. -> "a word or a phrase that the lists `words`, `phrases` and `newWords` of openspec/ste/words.json name". Update the pin and `mutate-pins.py.txt`, and rerun R7.

- [ ] FINDING major spec.md:13,31 "MUST NOT give the severity major to each text with two possible meanings" can mean "not every text" or "no text". The second meaning contradicts spec.md:10. Test 035 checks only three old strings (review.test.mjs:439-443). Append "- **major**: Two possible meanings in other text." to the agent list and tests 034 and 035 still pass. -> "…to two possible meanings in other text that is true under each meaning". Assert the exact set of `- **major**:` lines and add a mutation.

- [ ] FINDING major ste-adversary.md:27 and :67 The new sentence "Report a form of a listed word that the lint does not find." has no scenario, no pin and no mutation. If you delete it, no test fails. The new clause at :67 "or quote the banned word or the two instructions" is pinned, but no scenario line names it. -> Add one AND to scenario 035 for each. Pin :27 and add a mutation.

- [ ] FINDING major spec.md:22 "when no major item names it": "it" can mean "an STE rule" or "the text". The major items name kinds of text, not rules. Under the first meaning a banned word with one clear meaning is minor, which contradicts 035 AND 2. -> "when no major item names the fault" (the words of agent :90).

- [ ] FINDING major design.md:10 "Give a fault in the words of other text the severity minor" contradicts D2 (design.md:29) and spec.md:9. A banned word in a test title is a fault in the words of other text, and it is major. -> Add "except for the faults that the requirement names" and merge or delete :12.

- [ ] FINDING major tasks.md:21 (against evidence.md:20 and spec-files-run.txt:22) Box 3.2 "Run each other test file" is checked, but gates.test.mjs ran only 2 tests (the filter change-review-03). -> "…except gates.test.mjs" and a new task "Run the tests of gates.test.mjs with change-review-03 in their names."

Checked and true:
- All 13 pins equal the agent file character for character.
- The 3 absent strings are gone from the agent file.
- Rule 16 is one line with no "blocker".
- mutations.txt has 18 OK lines and the restored run has 0 failed.
- spec-files-run.txt lists all 22 test files.
- Every status in checks.log is 0.

Minor, not listed:
- proposal.md:14 omits "except for actions at the same time", but it is true under check 7.
- The pins use `includes()` on the whole file.

Questions for you:
- proposal.md:35 calls "echo" the owner word, but the recorded 16 owner words do not hold it. Confirm that the owner named it.
- Please confirm that 81d67090 changes only the change folder. The runs used 9f29ee10.


---- Part 1 of 3 (sent to the lead by SendMessage) ----

Pre-review 2 (spec adversary), part 1 of 3. Tree: commit 81d6709074707252a69a2fbc3182dbfc6bc9add1 (clone review-severity-scope). I ran no code and no git. Verdict FAIL: 6 majors, all new faults of the round2 diff.

F1 major, "banned word" definition. Where: spec.md:7, ste-adversary.md:76 and :27, design.md:23, pin R7 (review.test.mjs:432), mutate-pins.py.txt (hard-codes the pin).
Proof: the definition says "a word or a phrase that openspec/ste/words.json lists". The file has five lists: words, phrases, allowedIng, nounVerbs, newWords. allowedIng lists "finding", "findings", "meaning" (words.json:41-47). By the letter these are banned words, and "meanings" is a form of "meaning" that the list does not name. Self-hits in normative text: spec.md:3 heading "Severity of findings"; ste-adversary.md:77, :86, :89 "meanings". nounVerbs lists "read", so "reads" in the WHEN lines (spec.md:19, 25, 34) is a form the list does not name. "the list" is singular but the file has several lists. Line 27 "a listed word" inherits the same fault. Result: two meanings in a requirement.
Fix: name the keys, in all four places and in the pin: "a word or a phrase that the lists `words`, `phrases` and `newWords` of openspec/ste/words.json name, or a form of such a word that the lists do not name". Update the string in mutate-pins.py.txt pins35[0] and rerun R7 (the other 17 lines do not change).

F2 major, spec.md:13 and :31 "MUST NOT give the severity major to each text with two possible meanings".
Proof of the weak assertion: append the line "- **major**: Two possible meanings in other text." to the severity list of the agent file. Tests 034 and 035 still pass, because the absence check (review.test.mjs:439-443) covers three old strings only. The AND at spec.md:31 is then false and no test fails. Second fault: "MUST NOT ... each text" can mean "not every text" or "no text". The second reading contradicts spec.md:10 (major for two meanings in normative text). Result: two meanings in a requirement and a scenario.
Fix: spec.md:13 "They MUST NOT give the severity major to two possible meanings in other text that is true under each meaning."; same words in the AND at :31; in test 035 assert that the lines of the agent file that start with "- **major**:" equal exactly the four pinned lines; add one mutation that appends a fifth major line (expect change-review-035).

F3 major, ste-adversary.md:27 and :67.
Proof: the new sentence at :27 "Report a form of a listed word that the lint does not find." has no scenario line, no pin and no mutation. Delete it and no test fails. The new clause at :67 "or quote the banned word or the two instructions" is pinned (test 035, 7th pin) but no scenario line names it.
Fix: add one AND to scenario 035 for each of the two (the instructions tell the reviewer to report a form of a listed word that the lint does not find; the evidence for a major finding can be a quote of the banned word or of the two instructions); pin the :27 sentence; add one mutation for it. I did not call design D3 or proposal.md:33 false: "the sentences that the scenarios name" is true once the ANDs exist.


---- Part 2 of 3 ----

Pre-review 2 (spec adversary), part 2 of 3. Tree: commit 81d6709074707252a69a2fbc3182dbfc6bc9add1.

F4 major, spec.md:22 "when no major item names it".
Proof: "it" can mean "an STE rule" (nearest noun) or "the text". The major items name kinds of text and faults, not STE rules. Under the first reading the exception never applies, so a banned word with one clear meaning that breaks an STE rule is minor. That contradicts scenario 035 AND 2 (a banned word in normative text is major). The two readings give different results. Result: two meanings in a scenario.
Fix: "when no major item names the fault" (the words of ste-adversary.md:90). No pin change: the pins hold the agent file, not the scenario.

F5 major, design.md:10 "Give a fault in the words of other text the severity minor, so that the fault does not fail a round."
Proof: a test title is other text (spec.md:6). A banned word in a test title is a fault in the words of other text, and design.md:29 (D2) and spec.md:9 give it major. Read as written, :10 and D2 contradict each other. The line at :12 does not bound :10; it only adds a second sentence. The agent file's own line 78 says a text that disagrees with the specs is major in all text.
Fix: ":10 Give a fault in the words of other text the severity minor, except for the faults that the requirement names." Then delete :12 or leave it as the same sentence without "Give the severity major to".
Note: I rate proposal.md:14 ("Give the severity major to a task with two instructions") as minor, not major. It omits "except for actions at the same time" (spec.md:12), but it is true under check 7, because actions at the same time are one instruction. Add the clause if you want it to match.

F6 major, tasks.md:21 against evidence.md:20 and spec-files-run.txt:22.
Proof: box 3.2 "Run each other test file of src/tooling/spec on the host." is checked. gates.test.mjs ran only 2 tests (the filter change-review-03). evidence.md:20 says so, so the task text and the evidence disagree, and rule 17 says no box for work that is not complete.
Fix: 3.2 "Run each other test file of src/tooling/spec on the host, except gates.test.mjs." and a new task "Run the tests of gates.test.mjs with change-review-03 in their names." Renumber 3.3 to 3.9 and keep evidence.md in step.


---- Part 3 of 3 ----

Pre-review 2 (spec adversary), part 3 of 3. Tree: commit 81d6709074707252a69a2fbc3182dbfc6bc9add1.

Checked and true:
- All 13 pins (6 in 034, 7 in 035) equal the agent file character for character; the 3 absent strings are gone from the file; rule 16 is one line that starts with "16. " and holds the pinned sentence and no "blocker".
- mutations.txt has 18 OK lines and one "restored" line (0 of 3 failed); the evidence.md table ranges (R1-R6, R7-R13, A14-A16, B1-B2) match them; the pin lists in mutate-pins.py.txt equal the test.
- spec-files-run.txt has 22 lines and src/tooling/spec has 22 test files. checks.log: format, lint (0 errors) and validate all status 0.
- Origin spec-first: test tasks 1.x come before guidance tasks 2.x. IDs 034 to 036 are free. No gate code changes (rule 18). The old M1-M5 record was replaced, not rewritten with a newer fact: runs-head.txt, evidence.md and mutations.txt all name 9f29ee10.
- No word of words.json (words, phrases, newWords) in the change folder or in the agent file outside inline code (the SHALL/SHOULD/MAY line 37 is inline code).

Minor, not listed in the final message:
- proposal.md:14 omits "except for actions at the same time" (true under check 7).
- The pins use includes() on the whole file. A pinned sentence moved into the example fence (lines 53-64) still passes. Known limit pin-only does not name the position.
- Scenario 035 AND 3 (the absent strings) mixes one absent minor line with major lines; it belongs to 034.

Questions for you (not findings):
1. "echo": proposal.md:35 calls it "the owner word". The owner's recorded 16 words (memory owner-decisions-2026-10-06.md:13: explicit, verify, malformed, wiring, dismissal/dismiss, expose, permit, retain, emit, prior, preserve, renew, lone, handover, execute, prescribed) do not hold "echo". It appears only in the round 1 brief. Confirm that the owner named it, or write "The word echo".
2. Residual: the runs used 9f29ee10; 81d67090 is "docs(spec): evidence". The git status in checks.log supports a docs-only commit, but I could not run git. Please confirm that 81d67090 changes only the change folder.
