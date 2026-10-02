Verdict: PASS

I could not run code or git. The 159, 7147 and rule-21 numbers come from your message, not from my own check. Checked directly: `design.md`, `tasks.md` and `proposal.md` as they stand, and the QA scripts `qa-overpass-offload.mjs`, `qa-military-names.mjs` and `qa-admin-outlines.mjs`. I did not read the other ten reworded QA scripts or any test files.

(a) Mutations 2.1 to 2.6 now say the same thing in `design.md` and `tasks.md`. I cannot check them against what was run.

(b) The new known limits are true as far as the documents go. `sync2-no-final-ratchet` agrees with your gate output. It is not true that nothing claims "gates passed". See F1.

(c) The reworded QA purposes fit the scripts I read. `@covers pending:alpr` fits `qa-overpass-offload.mjs`, which asserts ALPR entities and the London ALPR row.

(d) The numbers agree across the three documents: 159 = 152 + 7, 13 headers, 83 scripts, 29 rows, 6 mutations.

- [ ] FINDING minor tasks.md:29 Task 3.2 is checked, but `sync2-no-final-ratchet` says the last two ratchet runs stopped with `LEDGER-LARGER-GAP`. Rule 17 forbids a checked box for incomplete work. Uncheck it, or write "run once, then stopped" on the line, and record the owner's acceptance by name in `review.md`.
- [ ] FINDING minor design.md:58 The text "The ledger must record each gap" is not true for `src/annotations/resolver.js`, where the ledger has 342 and the run measures 359. Add "except the files in `sync2-count-flips`".
- [ ] FINDING minor design.md:54 Mutation 2.6 fails only by a time-out kill. It does not show that the 10 s ceiling assertion can fail, because the mutation would also stop the test with the ceiling removed. `sync2-ceiling-not-measured` names the weak ceiling but not this. Add one sentence, or add a mutation that delays the lookup by 11 s.
- [ ] FINDING minor proposal.md:50 "The 13 new QA headers name ... `pending:`, and the header of `qa-journey-recorder.mjs` has `unmapped:`" does not say whether the recorder is one of the 13. `design.md` D3 puts both helper files inside the 13 scripts. Say "12 of the 13 ... and the other one".
- [ ] FINDING minor proposal.md:7 The rule-21 chain is only partly in the change documents. `design.md` D1 names the parents `253a07d` and `e7707d9`. Neither document names the merge commit `b8ff1c4` or the `git ls-remote` result `e7707d9`. Task 3.5 must put both in `review.md`.
