Verdict: FAIL

Tree: I read commit 2eb8d00058a28347b239257eb07eb75feffeff22 (clone review-severity-scope). I ran no code and no git. Details and candidate fixes are in SendMessage parts 1 and 2.

- [ ] FINDING major .claude/agents/ste-adversary.md:66-68,70-72 The unchanged rules "write major only with evidence of two meanings or a disagreement, else minor" and "a text that does not obey an STE rule is minor" contradict the new lines 84 and 87. A banned word and a task with two instructions have neither kind of evidence, and both break an STE rule. Read literally, they are minor. No pin catches this. -> Name all four kinds of evidence in 66-68. Add "except for the faults in the list below" to line 70.
- [ ] FINDING major .claude/agents/ste-adversary.md:84 (also spec.md:8,23 and review.test.mjs:429) "Banned word" has no definition. Line 27 says the lint stops the words of words.json and "Do not report these again". Line 72 rates "a word that STE does not approve" as minor. The owner list ("echo", prefixed forms) is not in words.json. One term leads to two actions. -> Define it once in the agent file and the requirement, and align line 27.
- [ ] FINDING major proposal.md:11,13 / spec.md:8,11,21 / design.md:11 / review.test.mjs:427 "Keep ... major" is false for two classes. The base file (round1.diff lines 18, 30-31) rated a banned word and a task with two instructions as minor, so the change adds them as major. "Keep" is true only for proposal.md:12, the first half of proposal.md:13, and spec.md:9-10. -> Write "Give" for the two new classes. Rename the scenario and test titles, then update mutations.txt and re-run M3 and M4.
- [ ] FINDING major tasks.md:21 Box 3.2 (lint and openspec validate) is checked, but evidence.md and evidence/ hold no output of either (rules 17, 19). -> Add the outputs as an evidence file, or uncheck the box.
- [ ] FINDING minor review.test.mjs:418-439 Mutations M1-M5 leave these pins unproved: 034 pins 1 and 4, 035 pins 2 and 3, and the 036 absence assertion. M5 fails the first assert, so the second never decides. The 036 check tests only the backticked word `blocker` anywhere in AGENTS.md, not rule 16. -> Add one mutation per pin and check the rule 16 line.
- [ ] FINDING minor review.test.mjs:418-435 No test checks that the removed old lines are gone (major 1 is this failure). Known limit pin-only does not name it. -> Add absence pins, or name the limit.
- [ ] FINDING minor ste-adversary.md:75 / spec.md:6 Bare "review.md" can mean .claude/commands/opsx/review.md (listed at line 20, read by the gate) or the review.md of the change. -> "the review.md of the change".
- [ ] FINDING minor ste-adversary.md:87 Check 7 (line 36) allows actions at the same time. The list entry has no such exception.
- [ ] FINDING minor proposal.md, design.md Decisions: neither is in a list ("Other text includes" is open). Known limit judgment covers it.

Checked and true:
- The pins of 034-036 equal the agent file and AGENTS.md rule 16 character for character.
- Rule 16 agrees with scripts/spec/lib/review.mjs:141-146.
- IDs 034-036 are free.
- spec-files-run.txt lists all 22 test files of src/tooling/spec, and mutations.txt agrees with the evidence.md table.
- The change touches no gate code (rule 18).
- Review command steps 10-12 and the spec adversary file do not conflict.

Residual: the mutations ran at ee72a4a2 and the tree is 2eb8d000. The reflog says the second commit is docs only, but I could not confirm it without git.


---- Part 1 of 2 (sent to the lead by SendMessage) ----

Part 1 of 2 (spec adversary, pre-review 1, review-severity-scope, tree commit 2eb8d00058a28347b239257eb07eb75feffeff22). I ran no code and no git. Check each replacement text against the files before you apply it.

MAJOR 1: ste-adversary.md lines 66-68 and 70-72 contradict the new list (lines 84, 87).
- Lines 66-68 (unchanged, outside the diff hunk, but made wrong by it): 'Write "major" only with evidence in the finding. Give the two meanings, or describe the disagreement with the code, the specs or the other prose. Without that evidence, write "minor".' A banned word (line 84) and a task with two instructions (line 87) have neither kind of evidence. Read literally, the reviewer must write minor. The list says major.
- Lines 70-72: 'A text that does not obey an STE rule is minor ... a word that STE does not approve.' A banned word is a text that breaks an STE rule (the project word list), and check 7 (one instruction per task) is an STE rule. The same literal reading gives minor for both.
- No pin catches this: tests 034 and 035 use includes() on the new lines only, and no test asserts that the old guidance is gone.
- Candidate fix: lines 66-68 become 'Write "major" only with evidence in the finding. Give the banned word, the two meanings, the two instructions, or the disagreement with the code, the specs or the other prose. Without that evidence, write "minor".' Line 70 gets 'except for the faults in the list below'. Check these sentences with make lint.

MAJOR 2: "banned word" has no definition in the agent file, the requirement or the scenario (ste-adversary.md:84, spec.md:8, spec.md:23, design.md:26, test pin review.test.mjs:429).
- Line 27 says the lint stops the words in openspec/ste/words.json and 'Do not report these again'. If a banned word means a words.json word, line 27 says do not report it and line 84 says it is major.
- Line 72 says 'a word that STE does not approve' is minor. A reviewer cannot tell a banned word from this.
- scripts/spec/lib/ste.mjs:165-166: a newWords word is an error in new prose and a title (the gate stops) and a warning in old text (STE-WORD-OLD). So the new rule applies to the old-text warnings, to forms the lint misses, or to both. The text does not say which.
- Your brief lists "echo" and "prefixed forms" as banned. Neither is in words.json (ste.test.mjs:450 pins the 34 newWords keys). So the owner's list exists only in the brief.
- Candidate fix: one sentence in the agent file AND in the requirement: 'A banned word is a word or phrase in openspec/ste/words.json, or a form of such a word.' Then change line 27 to say whether the adversary reports a words.json word that the lint did not stop. Decide the echo case.


---- Part 2 of 2 (sent to the lead by SendMessage) ----

Part 2 of 2 (spec adversary, pre-review 1, review-severity-scope, commit 2eb8d00058a28347b239257eb07eb75feffeff22).

MAJOR 3: "Keep ... major" is false for two of the four classes.
- The base file (round1.diff lines 18, 30-31) said 'The text is major only when it gives two meanings or disagrees ...' and rated 'one clear meaning, but it does not obey an STE rule' as minor. So a banned word and a task with two instructions were minor before. The change makes them major.
- False places: proposal.md:11 and the second half of proposal.md:13, spec.md:8 and spec.md:11 ("MUST keep"), design.md:11 (Goals), scenario title spec.md:21, test title review.test.mjs:427 ("keeps"), mutations.txt:14,20.
- True places: proposal.md:12, the first half of proposal.md:13, spec.md:9-10 (two meanings in normative text and disagreement were major before).
- Candidate fix: write "Give" for the two new classes in the proposal and the requirement, and name them as new. Rename the scenario and the test title (the ID stays). Then update the title in mutations.txt and re-run M3 and M4 under the new title. The proposal lines are a plain false statement. The "MUST keep" lines in the spec could be read as forward-looking, so you may rate those lower.

MAJOR 4: tasks.md:21 (box 3.2 'Run the lint and OpenSpec validate on the host') is checked. evidence.md has only the sections Mutations and Host tests, and evidence/ has three files (mutations.txt, spec-files-run.txt, runs-head.txt). None holds a lint or validate output. Box 3.1 has its record (spec-files-run.txt line 13: review.test.mjs 36 pass). Rules 17 and 19. Fix: add the outputs as an evidence file and name it in evidence.md, or uncheck the box.

MINOR 5: mutation coverage per pin. M1 hits 034 pin 3, M2 hits pin 2, M3 hits 035 pin 1, M4 hits pin 4, M5 hits 036 pin 1. No mutation covers 034 pins 1 and 4, 035 pins 2 and 3, or the 036 absence assertion (M5 fails the first assert, so the second never decides). The 036 absence check tests the backticked word `blocker` anywhere in AGENTS.md, not rule 16. A bare "blocker" in rule 16 passes. Rule 13 holds per test, but not per pin.
MINOR 6: no test checks that the removed old lines are gone. Major 1 is exactly that failure. Known limit pin-only does not name it. Add absence pins for the three removed old lines, or name the limit.
MINOR 7: bare "review.md" (ste-adversary.md:75, spec.md:6) can mean .claude/commands/opsx/review.md (line 20 lists it; the gate reads it) or the review.md of the change. Line 47 already uses it for the record, so context mostly resolves it. Fix: 'the review.md of the change'. A pin string changes, so update the tests, M2 text and tasks.md:6.
MINOR 8: check 7 (ste-adversary.md:36) allows 'actions at the same time'; the list entry at line 87 has no exception.
MINOR 9: proposal.md and the decisions of design.md are in neither list. 'Other text includes' is open, 'Normative text is' is closed, so they are other text. Known limit judgment covers this.

Checked and true: the pins of 034-036 equal the agent file lines 74-76, 84-89 and AGENTS.md rule 16 character for character. Rule 16 agrees with scripts/spec/lib/review.mjs:141-146 (second word; only minor accepted). IDs 034-036 are free (ids.json, retired-ids.json). spec-files-run.txt lists all 22 files of src/tooling/spec. mutations.txt agrees with the evidence.md table. The change touches no gate code (rule 18). The review.md command steps 10-12 and the spec adversary file do not conflict (known limit other-files). Residual: the mutations ran at ee72a4a2 and the tree is 2eb8d000; the reflog says docs only, but I could not run git to confirm.
