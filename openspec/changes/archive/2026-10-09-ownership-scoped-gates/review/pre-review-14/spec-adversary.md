Verdict: FAIL

Tree read: clone ownership-gates, commit 7a699a4b50139227d41db3ead7c4e3e715e470c0 (read from `.git/refs/heads/ownership-gates`). I ran no code. E = `openspec/changes/ownership-scoped-gates/evidence.md`.

- [ ] FINDING major E:3609 The Pass 15 row says "The sentence of Pass 13 about the fault of Pass 15 is gone." That is false as a record of Pass 15, and it puts a Pass 16 fact into an old block. `round13.diff:31-32` shows that Pass 15 deleted "Pass 14 shows that this fault fails only one assertion…" and added "Pass 15 runs this fault against the final test…". Pass 16 deleted that Pass 15 sentence, and E:3695 already records this. No "fault of Pass 15" exists. Pass 15 ran the faults of Pass 13 and Pass 14, and E:3653 names the same fault "the fault of Pass 13". The earlier text of this row was true; the Pass 16 edit made it false. Tasks box 18.1 is checked over this new false statement (rule 17). Fix: write "The sentence of Pass 13 about Pass 14 is gone. The lead ran the fault of Pass 13 against a copy of the final test of `ownership-055` (see below)." Then look at the line again (rule 19).

- [ ] FINDING minor E:3494 The sentence "with the code files and test files of commit b35c27d1" for the second run has no record. `pass13/second-run-summary.txt` has three lines and no commit. This is the same gap as the host-run sentence that Pass 16 deleted, and E:3697 says that this gap is closed. Fix: delete the commit from this sentence or file the commit, as for `pass14/final-run-head.txt`.

- [ ] FINDING minor E:3700 "for the final text". `pass16/host-checks.log:1-5` names HEAD 12b044bc with `M evidence.md` and `M tasks.md`. Nothing ties the linted text to 7a699a4b. Pre-review 13 raised the same point for Pass 15. Fix: say that the lint ran on the working tree over 12b044bc, or run the lint at 7a699a4b and file the log.

- [ ] FINDING minor E:3519, E:3521 The THEN of gap-ledger-138 goes only to a future `review.md`, which does not exist. `proposal.md` "Known limits" (line 41 on) does not name it, so check 10 is not met today. The words "no gate test" are true: `gates.mjs:535-538` stops before any comparison. They do not mean "no test". `ledger.test.mjs:1597-1608` asserts a LEDGER-STALE error and a LEDGER-ADOPT-FROM error for an unmerged `from`, but its fixture differs only in totals. It exercises the total count exception (147-151) and not the tolerance of 136-146. Check that before you tag it 138. Fix: add one sentence now to "Known limits" in `proposal.md`: the 138 test asserts the AND only, and no gate test asserts the THEN. A round-1 reviewer can raise the tag under check 1.

Minors not listed.

Checked and true, so you can skip these:
- The claim of the TypeError at E:3653 is true. `gates.test.mjs:2830` calls `.match(/…/g).length`, and `print-assertions.py.txt:12` uses `?? []`.
- `pass15/fault-adoptsof-assertions.txt` shows count 0.
- `pass15/changes-since-final-run.txt` shows one file, `ledger.test.mjs`, so E:3671 is true.
- The test of ownership-055 asserts each line of the scenario (`gates.test.mjs:2828-2831`). The 138 row matches the body of the test, `gates.test.mjs:2707-2715`.
- Pass 16 deleted the host sentence, and `pass13/host-checks.log` shows statuses 0 and 0 lint errors.
- Tasks 15.x to 18.x each have a record except as noted above. The renumbering of section 16 breaks no reference, because only the evidence text names "Section 16".
- The diff changes documents only. I saw no change in `src` or `scripts`, but I could not run git.
- The Pass 14 row and the sentence after it carry a Pass 16 decision. Both pre-review 13 reviewers asked for that text at E:3521 and it is true, so I report nothing for it.
