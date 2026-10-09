Verdict: FAIL

Tree: commit 12b044bcd1c1d841882ccc8134567b3e0db471c3. I read the brief, the report, round13.diff, spec.md 255-340, design.md D11, tasks.md 285-333, evidence.md 3440-3688, the pass13/ and pass15/ files, ledger.test.mjs 1560-1630, gates.test.mjs 2700-2835, gap-ledger spec 791-912, and the pre-review 11 and 12 reports. I ran no code. E = openspec/changes/ownership-scoped-gates/evidence.md. I found no banned word in Pass 13 to 15.

- [ ] FINDING major E:3521 "The scenario names no other result" The scenario gap-ledger-138 (gap-ledger/spec.md:797) has a THEN: "the gate gives no tolerance from this requirement". That is a second result, besides the AND. The row also disagrees with the open minor (the title of the test says "no tolerance", but the assertion proves only the stop). -> "The test asserts the history error only. The early source check stops the gate before the ledger comparison (`gates.mjs:535`). The status assertion and the two negative assertions are gone."

- [ ] FINDING major E:3494, E:3611, E:3616, tasks.md:329 "against the final test", "on the final test", "Run the test of `ownership-055`" The lead ran a copy (E:3655), not the final test. The copy changes the count line to `(match ?? []).length`; the final test has `match(...).length` (gates.test.mjs:2830). Under the adoptsof fault the copy prints "count 0", so `match` gives null in the final test. That test cannot print "history error: FAILS", and pass15/ holds no run of the final test. E:3611 also says "The sentence about the fault of Pass 13 is gone", but E:3494 still holds a sentence about that fault.
  -> Delete E:3494 (a Pass 15 fact in the Pass 13 record). E:3611: "The false sentence of Pass 13 about Pass 14 is gone. The lead ran that fault against a copy of the final test of `ownership-055` (see below)." E:3616: "against a copy of the final test". tasks.md:329: "Run a copy of the test of `ownership-055` that prints each assertion, with two faults."

- [ ] FINDING major E:3619 "on the clean commit 0040282f" pass15/host-checks.log shows M evidence.md, M tasks.md and ?? pass15/*. Each fault run changed a code file. The tree was not clean. -> "with the code files and test files of commit 0040282f". Pass 13 (E:3478, E:3504) uses this form.

- [ ] FINDING minor E:3673 "The code files and the file `gates.test.mjs` are the same ... except one test title" The one changed title is in `ledger.test.mjs` (pass15/changes-since-final-run.txt), outside both sets. -> "The code files and the file `gates.test.mjs` are the same as at the final run of Pass 14. The only other change is one test title in `ledger.test.mjs`."

- [ ] FINDING minor E:3625, E:3655 "The first fault", "The second fault" Two paragraphs give these names to different faults. Pass 14 calls the drop-throw fault "the third fault". -> E:3655: "The fault of Pass 14 removes the line `throw error;` ... The fault of Pass 13 changes the call of `validAdoptSources` to a call of `adoptsOf`."

- [ ] FINDING minor tasks.md:315, 327 "Retitle ... and change its assertions"; "Rename" Two instructions in 16.2. 16.2 and 17.2 also use two words for one action. -> "16.2 Rename the gate test of `ownership-055`." and a new task "Change the assertions of the gate test of `ownership-055`." Use "renamed" at E:3478 and E:3517.

- [ ] FINDING minor E:3611-3616 "Spec adversary 2" to "Spec adversary 5" The spec report has 6 findings, and the labels skip E:3522. The reports do not number their findings. -> Label each row with the file:line of the finding.

Minors not listed.
