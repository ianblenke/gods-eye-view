Verdict: FAIL

I read commit 4bc6ceab808afe2b66446d7adc9af5eb55a64786 with Read and Grep only, so I cannot tell the working tree from the commit. There is no critical finding, no bypass and no weaker gate. Notes are in two parts sent by SendMessage (Part 1 of 2 and Part 2 of 2).

- [ ] FINDING major openspec/changes/ownership-scoped-gates/proposal.md:44 "The tests tagged ownership-004 and ownership-008 prove both bounds" is false for the base bound of `waiversOf` (ledger.mjs:252-254). The line count bound is proved: ownership.test.mjs:115 uses `{ count: 1 }` with lines [2,3] against ownership.mjs:149.
  - ownership.test.mjs imports no `waiversOf`. Its 004 and 008 tests (:79, :115, :165) pass waiver arrays straight into `coverageFaults`.
  - ownershipGate.test.mjs contains no "waiver" text, so its 004 test (:165) never sees a waiver line. No 004 or 008 test can fail if the `slice(baseHistory.length)` guard is removed (rule 13).
  - The base bound is proved by gap-ledger-084 (ledger.test.mjs:811, case 1). That test goes through `compareWithBase`, which calls `waiversOf` at ledger.mjs:487. The bound is tested elsewhere. The code has no hole.
  - No gate test sends a history waiver through gates.mjs:575 and :587 into `coverageFaults`. "COVERAGE-OWNED unless valid waivers waive" (ownership-004) is therefore proved only at unit level. I could not run the mutation. By reading, a `waivers: []` change at :587 makes the gate stricter, so it is no bypass.
  - Fix (a): name gap-ledger-084 for the base bound, and add the unproved wiring to the limit.
  - Fix (b): add a gate test tagged 004 or 008 with one base-history waiver and one post-base waiver, plus a named fault at :587 that fails it.
  - The limit also does not say that "valid waiver" (spec.md:40, :46, :186) is defined only in design.md:264. The archive does not copy design.md to openspec/specs.
- [ ] FINDING minor openspec/changes/ownership-scoped-gates/evidence.md:3288 "seven ownership-054 tests" covers only ownershipGate.test.mjs, and pass10/scenario-clauses.log lists the same seven. An eighth test carries the tag: qaRegister.test.mjs:266. It asserts `adoptableQaScript` booleans, not a printed or written result. Name that test and the clause it supports, or write "seven in ownershipGate.test.mjs".
- [ ] FINDING minor openspec/changes/ownership-scoped-gates/evidence.md:3267 and :3319 "no ... ratchet, adopt, waive ... command ran" is false as written. The tests run `runGates` with ratchet (ownershipGate.test.mjs:170), adopt (:203) and waive (gates.test.mjs:841) in fixtures. The old "Outside tests" qualifier is gone. Add "on the project tree" or "outside test fixtures".

Checked clean:
- ownership-018: both tagged tests (ownership.test.mjs:199 and :217) assert their clauses, and the new text is true for both bodies. The :217 title is true.
- ownership-054: the last AND line is true against ownershipGate.test.mjs:641, qa-register.mjs:47-55, inventory.mjs:43 and gates.mjs:616-617. "For that script" is true but weaker than the code.
- No old record is rewritten with a newer fact.
- The Order sentence in tasks.md:193 is true.
- Numbers agree: 54 scenarios, 50/50 and 40/40 in the pass10 logs, and the diff touches no script, AGENTS.md or config.yaml.

Caveats are in Part 2. No format check ran after the :217 title change. links.json:3106-3107 still lists the old 018 titles until the ratchet runs.

---- Part 1 of 2 (sent to the lead by SendMessage) ----

Part 1 of 2 (spec adversary, pre-review 8, ownership-scoped-gates). Tree: clone gev-work/ownership-gates, commit 4bc6ceab808afe2b66446d7adc9af5eb55a64786 (read from .git/refs/heads/ownership-gates). Read/Grep/Glob only, so I cannot tell committed lines from working-tree lines. Verdict FAIL: 1 major (proposal.md:44), 3 minors, no critical, no bypass, no weaker gate. Part 2 follows.

ATTACK 1, ownership-018 (spec.md:184-189) against the two tagged tests. Only two tests carry the tag (grep over src/tooling/spec): ownership.test.mjs:199 and :217. No other tag/test pair changed; the source diff is the :217 title only.
- :199 asserts WHEN 1 (gapReport of src/own/a.js lines 2 + src/own/b.js lines 3 gives 'Owned gaps: 2 code files, 5 lines, 0 test files, 0 tests.'), WHEN/AND 2 (a record with 2 uncovered lines and two count-1 line waivers for src/own/a.js, plus the branch and function waivers that the record needs, gives faults == []), and THEN 'waivers waive a count of 2' as a lower bound. TRUE for the body. Named faults gap-sum and waiver-sum exist in Pass 8 (evidence.md:3006-3007, tree d84cd029, lines now :200/:201).
- :217 has coverage: {} and two test files (single.js 2+1, src/own/a.test.js 4). It asserts the exact array whose first element is 'Owned gaps: 0 code files, 0 lines, 2 test files, 7 tests.'. Every clause of the second ledger is TRUE. The new title is TRUE (3+4 test instances). Fault test-count-sum (Math.max) fails :218 (Pass 9, pass9 log; line unchanged).
- Neither test makes all WHEN lines; each makes its own ledger. That is the intended split and nothing is hidden.

ATTACK 2, ownership-054 last AND (spec.md:493). ownershipGate.test.mjs:641 uses one new script scripts/qa-merge.mjs with '/* node:coverage ignore next */', no QA tag; asserts status 1, /ERROR COVERAGE-IGNORE scripts\/qa-merge.mjs/ and zero kind:adopt records. Code: qa-register.mjs:47 gives eligible=false for a new script with no adopt record, :48 skips the synthetic header, :51-53 pushes QA-HEADER; inventory.mjs:43 keeps the file in the inventory, so the ignore check flags it; gates.mjs:616-617 removes only QA-HEADER for qaFiles and stops on any other error. TRUE. 'for that script' is TRUE and weaker than the code (the code writes no record for any script); with one script in the test, nothing stronger is proved, so the wording is honest. The sentence also duplicates spec.md:492 'any other error stops the adopt command without a new record'. 'one of the new scripts' is satisfied by a test with one script. Eight tests carry the 054 tag, not seven (see finding 2).

ATTACK 3, Known limit (proposal.md:43-45).
- waiversOf is at ledger.mjs:252-254 (the base bound is historyLinesOf :234-241: no change name, or history not starting with baseHistory, gives [], then slice(baseHistory.length)). The line count bound is ownership.mjs:149 (waiver.lines.length <= waiver.count). Names and lines are TRUE.
- 'The tests tagged ownership-004 and ownership-008 prove both bounds' is TRUE for the line count bound (ownership.test.mjs:115, patch { count: 1 } with lines [2,3]; the mutation files also carry mutants of that expression) and FALSE for the base bound: ownership.test.mjs imports no waiversOf and passes waiver arrays straight to coverageFaults (:79, :115, :165, :201-202); ownershipGate.test.mjs has no text 'waiver' at all, so its 004 test (:165) can never see a waiver line. The base bound is proved by gap-ledger-084 (ledger.test.mjs:811, case 1 'In the base history', through compareWithBase, which calls waiversOf at ledger.mjs:487; archived ledger-waiver review.md:71 lists the slice fault as killed). I think the sentence came from the pre-review 7 reviewer text ('Tests tagged 004 and 008 prove them (:79, :115, :165)'), which is itself wrong for the base half.
- Related gap: no gate-level test sends a history waiver through gates.mjs:573-575 and :587 into coverageFaults (grep: no 'waiver' in ownershipGate.test.mjs; COVERAGE-OWNED appears only in ownershipGate.test.mjs and never with a waiver; gates.test.mjs has no COVERAGE-DIFF/OWNED text). A change of `waivers` to `[]` at :587 makes the gate stricter, not weaker, so it is no bypass; but the claim 'tests prove' covers it and it is unproved. I could not run the mutation; this is from reading.
- Not in the limit: 'valid waiver' (spec.md:40, :46, :186) is defined only in design.md:264, which the archive does not copy to openspec/specs; the requirement at :181 now gives the bounds inline for the waiver counts.

---- Part 2 of 2 (sent to the lead by SendMessage) ----

Part 2 of 2 (spec adversary, pre-review 8, commit 4bc6ceab808afe2b66446d7adc9af5eb55a64786). Attacks 4 and 5, checked clean, read and not read, caveats.

ATTACK 4, evidence and tasks.
- Old record rewritten with a newer fact: none found. The edits to the Pass 9 block (correction rows, fault rows, the two sentences) and to the Pass 7 row S121 (comma only) restate Pass 9 or Pass 7 facts with the pass number; the Pass 9 ran-list matches the commands in its own block (tests, five fault processes, coverage, lint, format, OpenSpec, title and order checks, mutant generation). The row 'config-adopt-sentence' names the sentence that ownership.test.mjs:147 matches. The old row evidence.md:3199 ('Name the gate and file hash in the requirement') stays as the Pass 9 record, correctly.
- Non-run sentences: the Pass 10 ran-list is true for the pass10 logs (ownership 50/50, ownershipGate 40/40, lint 0 errors 584 warnings, show, validate, repeated titles, banned-word check, section titles). The not-run list is true for the project tree but false as written for test fixtures (finding 3).
- tasks.md:193 (Order sentence): 'the rows for a prefix and for 41 digits' = rows 7 and 8; 'the row for a value outside the hash pattern' = row 4; nine rows, seven tests. TRUE. Section 12 (tasks.md:286-289): 12.2 is backed by pass10 logs; 12.1 says 'Correct the faults that pre-review 7 found'. S135 comes from the Pass 7 table (evidence.md:2705) and H3 is recorded at evidence.md:3277, so I did not file the box.
- pass10/self-check.log: headings added = '## 12. Pass 10' and '## Pass 10' only; proposal, design and spec headings unchanged. Matches the diff.

ATTACK 5, rule 18 and numbers. The diff touches no script, AGENTS.md or config.yaml; the only source change is the :217 title. 54 scenario headings in spec.md (001-054). ownership.test.mjs has 50 test( lines; ownershipGate.test.mjs has 37 top-level + the 3-test loop = 40; pass10 logs show tests 50 pass 50 and tests 40 pass 40. qaRegister 49, v8Merge 11 and gates 228 (224 pass, 4 host failures) are Pass 9 numbers and not re-run in Pass 10; the Pass 10 block does not claim them. No weaker gate, no box ticked for undone work that I could find.

CAVEATS (not findings).
- No format check ran after the title change at ownership.test.mjs:217 (the Pass 10 block lists none). CI has failed on format:check before; the lead should run scripts/format.mjs --check once.
- links.json:3106-3107 still lists both old 018 titles until the image ratchet rewrites them. I claim nothing about the ledger.
- The 018 THEN 'the waivers waive a count of 2' is asserted only as a lower bound at :201; it names no printed output. Not worse than before this pass; I did not file it.
- design.md:264 (Pass 9 row) sits under the heading '### Pass 7 words'; label only, kept by the lead per S191.
- Gate output was not given, so checks 6 and 8 and the ledger comparisons were not done. I could not run the mutation for the wiring point in part 1.

READ: report-round8.md, round8.diff (all 222 lines), proposal.md, spec.md 30-200 and 455-495, tasks.md 150-290, design.md 205-285, evidence.md 2655-2715 and 3180-3320, pre-review 6 and 7 spec reports, ownership.mjs (whole), qa-register.mjs 25-85, inventory.mjs 25-60, gates.mjs 555-660, ledger.mjs 225-290 and 470-500, ownership.test.mjs 1-260, ownershipGate.test.mjs 1-240 and 575-668, qaRegister.test.mjs 240-274, ledger.test.mjs 805-865, pass10/ logs (clauses, self-check, correction-search, test summaries), grep hits in trace/.
NOT READ: evidence.md outside those ranges; mutation result files beyond grep; gates.test.mjs outside grep hits; AGENTS.md and config.yaml (unchanged); review folders pre-review 3-5 and rounds 1-2; pass9 logs.
