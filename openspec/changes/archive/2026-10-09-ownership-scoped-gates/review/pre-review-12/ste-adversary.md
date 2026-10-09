Verdict: FAIL

Tree: commit 8378c31bd9d0abefe82295f48be8aa1bab10efb7, from `.git/refs/heads/ownership-gates`. I read the brief, the report, `round12.diff`, the new text in the tree, `gates.mjs` 522-650, `ownership.mjs` 70-112, `ledger.mjs` 300-330 and 405-450, `gap-ledger/spec.md` 795 and 904, the pre-review-11 reports, the `pass13/` files, and both tests. I ran no code. E = `openspec/changes/ownership-scoped-gates/evidence.md`.

- [ ] FINDING major src/tooling/spec/ledger.test.mjs:1597 "the gate records the ledger entry as stale and reports LEDGER-ADOPT-FROM for an invalid from commit". The title claims the gate, but the test calls only `checkAdopts` and `compareLedger`. After this change the gate prints no LEDGER-STALE error for such a record (spec.md:276 and 331, `gates.test.mjs:2822`). Two titles now say opposite things about "the gate". -> "[gap-ledger-151] the functions checkAdopts and compareLedger report LEDGER-ADOPT-FROM and record the ledger entry as stale for an invalid from commit". After the rename, run the two 151 faults again. E:3527, E:3534 and `pass14/fault-151-*.txt` quote the old title.
- [ ] FINDING major E:3522 "`review.md` lists them as known limits." No `review.md` exists in the change folder at 8378c31b. -> "The file `review.md` will list them as known limits."
- [ ] FINDING major E:3494 "Pass 14 shows that this fault fails only one assertion of the test of `ownership-055`." No Pass 14 text or file records the assertions for this fault (the `adoptsOf` swap). `pass14/fault-drop-throw-assertions.txt` records another fault, where three assertions fail. The claim comes from pre-review 11 (spec adversary, second finding), not from a Pass 14 record. -> "Pre-review 11 found that this fault fails only the assertion of the history error, because `syncChangedLines` also throws. Pass 14 runs a fault that drops the throw."
- [ ] FINDING major openspec/changes/ownership-scoped-gates/tasks.md:315 "with four faults". The sentence has two readings. In one, each test runs with each fault, and that is false: faults 1 and 2 ran only the unit test of 151, and faults 3 and 4 ran only the tests of 055 and 138. In the other, the tests share the faults. Rule 17 needs the one true reading. -> "Run the test of `gap-ledger-151` with two faults, and the tests of `gap-ledger-138` and `ownership-055` with two other faults."
- [ ] FINDING minor openspec/changes/ownership-scoped-gates/design.md:290 "that this check replaces". spec.md:276 says "This requirement replaces". The clause is the same, but the agent differs. -> "that the requirement replaces". I rate this minor because the items now agree. In pre-review 11 the items disagreed (138 and 151 against 151 only).
- [ ] FINDING minor openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:276 "the clause about a stale ledger entry". The THEN of gap-ledger-151 is "records the ledger entry as stale, and the build stops until the ratchet command runs". I read "the clause" as the first part only, so the second part stays in force without a statement. -> "This requirement replaces 'the gate records the ledger entry as stale' in gap-ledger-151." This adds no sentence; the paragraph keeps 6.

Checked and true:
- spec.md:275-276 and the ownership-055 scenario agree with `gates.mjs:535-538` and `ownership.mjs:83-97`.
- D11 sits after the last sentence of D10.
- `history.jsonl` has 2438 lines (2436 plus 2).
- Both merges are in the reflog (80ea3b1f and 9464af96).
- The fences of `pass13/` and `pass14/` equal their files.
- `adoptedFile(file)` exists at `ledger.mjs:447`, so the text for fault 2 is true.
- The title of the 055 test matches its four assertions.
- I found no banned word in the new lines except "alone", which is a minor in part 1.

Minors not listed here are in my SendMessage part 1 to the lead. They are "alone" at E:3516, "the early stop" and "after the retitle" at E:3515 and E:3517, "total count exception" and "The line that pushes" at E:3524, two runs without a commit,
[result truncated by the channel; the part 1 message has the full list]


---

STE pre-review 12, part 1 of 1: minors (tree 8378c31bd9d0abefe82295f48be8aa1bab10efb7). The verdict and the majors are in my final message. E = openspec/changes/ownership-scoped-gates/evidence.md
- [ ] FINDING minor E:3516 "no fault fails them alone" "alone" is not the banned "lone" (words.json), and the lint gives 0 errors, but I cannot confirm it as approved. If the owner counts it as a prefixed form of "lone", this is major. -> "because no fault fails them when the other assertions pass".
- [ ] FINDING minor E:3515 "the early stop" and E:3517 "after the retitle" Verbs used as nouns, in new text. -> "the three assertions that need the early source check"; "The lead ran the fault again after the lead retitled the test."
- [ ] FINDING minor E:3524 "the total count exception" The spec word is "tolerance" (requirement "Count tolerance for adopted files"); two words for one thing. -> "the count tolerance". Same line: "The line that pushes the error ... pushes the adopt line" uses "line" for a code line and for a ledger record. -> "The statement that pushes the error LEDGER-ADOPT-FROM adds the adopt line to the valid lines instead."
- [ ] FINDING minor E:3540 area "The lead also ran the test file `ledger.test.mjs` on cores 8 to 11." No commit named for this run (rule 11). The fault run in Pass 13 (E:3478) names no commit either. -> add "at commit 85eaab08" to the ledger run; for E:3478 name the commit of the fault run (the fence titles match b35c27d1; check this before you write it).
- [ ] FINDING minor E:3514 "asserts the THEN of gap-ledger-151 at the library level" The unit test also asserts the AND (LEDGER-ADOPT-FROM). It does not assert that the build stops until the ratchet command runs. -> "asserts the THEN and the AND of gap-ledger-151 at the library level, with a LEDGER-STALE error and a LEDGER-ADOPT-FROM error".
Checked and true: spec.md:275-276 and ownership-055 against gates.mjs:535-538 and ownership.mjs:83-97; D11 sits after D10; history 2436 + 2 = 2438 lines; both merges in the reflog; all fences of pass13 and pass14 equal their files; adoptedFile(file) exists at ledger.mjs:447 (fault 2 text is true); paragraph of spec.md:271-276 has 6 sentences; no banned word in new lines except "alone".
