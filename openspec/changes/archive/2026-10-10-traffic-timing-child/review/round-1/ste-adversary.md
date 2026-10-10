# Round 1, STE adversary (scope: full, tree commit 2142b7f54adcb3891700dc190020b28e3f497133)

This file holds the final message of the agent as the lead received it.

Verdict: FAIL

Commit read: 2142b7f54adcb3891700dc190020b28e3f497133 (clone gev-work/traffic-timing-child). "archive" means openspec/changes/archive/2026-10-10-traffic-timing-child/. I found no banned word or form.

- [ ] FINDING major archive/specs/coverage-gate/spec.md:15 (the same line is in openspec/specs/coverage-gate/spec.md:685) and archive/design.md:21 "after its last check" has no fault that can make the test fail.
  - A child that writes the file first, or writes it and skips the scenario, still gives status 0, a coverage file and `done.pid === result.pid` (test lines 42-48).
  - Fault 9 in mutations.txt covers the status, not the order.
  - I accepted this in pre-review 2 and was wrong.
  - Write the scenario line: 'AND the child process writes the file "scenario-done.json" into the folder'. Write design D3: 'the child writes the file "scenario-done.json" with its process number'.
  - Add to the Known limit `child-unguarded`: "A child that writes the file and then skips the scenario also passes."
  - I checked this against the test and the twelve faults.
- [ ] FINDING minor archive/proposal.md:36 (`child-unguarded`) omits the leak check. Impact (line 27) says the gate checks neither the assertions nor the leaks of the child. The statement that no gate became weaker (rule 18) is true for the coverage, but not for these two checks. A child with a private folder and blank settings adds no coverage, because a child with the gate folder gets the gate values (test-guard.mjs:150-151). Write: "The gate counts the assertions of the parent test only and checks the leaks of the parent only."
- [ ] FINDING minor archive/proposal.md:37 (`child-cost`) "about 19 seconds ... 12 seconds" has no record in the change. Add a short .txt file in evidence/, or drop the numbers. The image ratchet took 1652.9 s, against 1657.6 s for Pensacola, so I see no sign of a longer run.
- [ ] FINDING minor archive/proposal.md:35 (`new-numbers`) "not a new fault" uses "fault" with a second meaning (a code change in the named faults), and 377 branches are new numbers. Write: "These are the first real measures of those files. The code of those files did not change." This is true: the code diff holds the test file only.
- [ ] FINDING minor archive/design.md:5 "each run of a gates target of `make`" is unclear. Write: "because each gate run deletes the folder of the record".
- [ ] FINDING minor archive/tasks.md:7,11,13 Boxes 2.1, 2.5 and 2.7 have no record file in evidence/. The ratchet log shows STE 0 errors, which covers 2.6 only. Add a short host record, or say which log holds each result.

I checked these against the files and found them true:
- Ledger and ratchet numbers:
  - ledger-change.txt: 51 rows, 9 removed (771 to 762), 377 branches in 39 entries, 65 functions in 20 entries, and the 51 entries' lines drop by 9755, which equals 56328 minus 46573.
  - ttcr1-verdict.txt: 306 complete (297 + 9), 53 not loaded (104 - 51), 0 untrue.
  - dataCredits.js: 475 to 23.
- Trace files:
  - history.jsonl has 178 lines, with 42 "untrue" and 42 "loaded" lines.
  - ids.json has one new ID, and links.json has one link.
- Spec and design:
  - The archived delta equals the added requirement.
  - The Purpose sentences equal design.md word for word.
  - The test title tag is right.
- Statement of the claim: an assertion deleted in the child can still pass, but the parent keeps three counted assertions.
