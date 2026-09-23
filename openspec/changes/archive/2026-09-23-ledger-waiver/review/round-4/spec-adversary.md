Verdict: PASS
Tree read: `/home/ianblenke/docker/gev-waiver`, branch `ledger-waiver`, working tree. I read the round-4 diff (`lw-r4.diff`), the files that it changes, and the text that those lines touch. I read the code and did not run it, so each mutation result below comes from reading the code.

Round-3 status:
- **Corrected:** F1, F2, F4, F6, F7 and F8. The count filter, the loaded conditions, the removed `typeof` guards, the rewritten-history case, the no-change-name case, the new waiver reason, "eight", and the HEAD and merge-base checks are all in place. For each mutation that the diff adds to design.md:186-193, the named test fails, except the one in the new F1.
- **Recorded:** F3 as `waiver-count-not-checked`, and F5 as `waive-accepts-archived-change`. The reason in F5's known limit is wrong (see the new F2).
- **Still open, as planned:** F9, F10 and F11. The new F4 to F6 below carry them.
- **Also checked:** the main spec `openspec/specs/gap-ledger/spec.md` agrees with the delta for `gap-ledger-082`, `gap-ledger-084` and `gap-ledger-087`. `openspec/trace/links.json` has the renamed `gap-ledger-087` tests.

- [ ] F1 minor src/tooling/spec/ledger.test.mjs:844 The new AND line of `gap-ledger-084` says that a count that is not a positive whole number gives no waived count. The only case uses a string count (`'2'`), so no test fails when you remove `&& line.count > 0` from scripts/spec/lib/ledger.mjs:246. A negative count then lowers the sum. A count-0 line then meets the "one or more waivers" condition of `waiversCover` for an all-zero new entry. design.md:187 ("remove the count condition … The test fails for each") and tasks.md:23 say that each condition has a failing case. To correct it, add two cases:
  - `rise([good, { ...good, count: -2 }])`, which expects `[]`.
  - `stops(ledgerWith({ coverage: { 'src/new.js': LOADED(0, 0, 0, { sha: 'new' }) } }), [{ count: 0 }])`.
- [ ] F2 minor openspec/changes/archive/2026-09-23-ledger-waiver/proposal.md:46 `waive-accepts-archived-change` says that the waiver of an archived change "has no effect after the archive". That is false:
  - `planCi` (scripts/spec/lib/ci.mjs:30) checks only the archived change that the diff adds.
  - This change's own check after the archive needs its `ledger-waiver` waiver. Without it, `compareWithBase` stops the new `scripts/spec/gates.mjs` entry with `LEDGER-NOT-IN-BASE`.
  - A waiver stops having effect only after the merge, when its line is in the base history.
  
  Write "after the merge", and say that a check of the archived change on its own branch still uses its waivers.
- [ ] F3 minor openspec/changes/archive/2026-09-23-ledger-waiver/specs/gap-ledger/spec.md:260 The new AND lines put a condition in a result line:
  - :260 in `gap-ledger-082` ("a file that no test loads …").
  - :273-274 in `gap-ledger-084` (a file that no test loads, and a count that is not a positive whole number).
  
  The WHEN does not state these conditions, and under the WHEN each such line is already true. The tests of these lines do not make the WHEN: in ledger.test.mjs:733-739 and :852-854 the waiver hash agrees with the file and the entry, and in :844 the line is otherwise valid. Move each condition into the WHEN as an "or" alternative, and change the main spec to agree. Or record this as a known limit.
- [ ] F4 minor openspec/trace/gaps.json This is round-3 F9, carried. The new ledger entry for `scripts/spec/gates.mjs` (branches 1, with the waiver at history.jsonl:586-587) rests on marker evidence that no gate checks. review.md must record that the user, Ian Blenke, accepts it by name.
- [ ] F5 minor openspec/changes/archive/2026-09-23-ledger-waiver/tasks.md:94 This is round-3 F10, carried. Tasks 6.1, 6.2 and 7.1 to 7.4 are open, and the gates do not check tasks. Record each mutation of design.md:180-194, with the test that failed, in review.md. Mark each task done only when its work is complete.
- [ ] F6 minor gate output This is round-3 F11, carried. `ERROR REVIEW-MISSING openspec/changes/archive/2026-09-23-ledger-waiver/review.md`. Run `make gates CHANGE=ledger-waiver` on the final tree after review.md, and report the full output.
