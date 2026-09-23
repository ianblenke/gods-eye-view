# Review: gate-measurement-race

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-09-23
Gates: make gates CHANGE=gate-measurement-race passed
Rounds: 4
Scope: full
Reviewed-Tree: 861fd6c0b9f981b27eca4d8882120363ded35372ab050d9e8f47944b808d3acf

## Findings

- [x] Round 1 spec-adversary F1, F2, F3 (minor): test gaps. Added a `_handle` without `setBlocking` case (053), a better line count with a branch total drift (088), and a base entry without totals (056). Each is mutation-proven below.
- [x] Round 1 spec-adversary F4 (minor): an unknown covered count on both sides counted as agreement. `totalsAgreeOnCoverage` now treats an unknown covered count as disagreement; 056 has a case for it.
- [x] Round 1 spec-adversary F5, F9, F10 (minor): recorded the ignored `setBlocking` return code as a known limit, corrected the worker-thread text of D1, and removed `history.jsonl` from the Impact list.
- [x] Round 1 spec-adversary F6, F7, F8, F11 (minor): tasks.md had the 053 and 054 mutations swapped, and tasks 6.2 and 7.x did not match the state. Corrected; the mutation report is below.
- [x] Round 1 ste-adversary S1 to S13 (major): the worker-thread claim, the swapped mutation records, the wrong case count of 054, a 054 AND line under the wrong WHEN, "that file" with no referent, "more than half" against 196 to 313 of 640, the ambiguous `opendirSync` sentence, the D3/D4 reference, the "fourth AND line", "no other platform", the drift risk text and "blocks the output". All rewritten.
- [x] Round 1 ste-adversary S14 to S33 (minor): passive voice, -ing words, one term for the total drift, "fail" for "redden", "reproduction", "flakiness", the 056 subject and verb, task 1.1, and the name of 054. All corrected; 054 is now "does not change the standard output of another process" (new in this change).
- [x] Round 2 spec-adversary F1 (major): the fix line ran before the `GEV_SPEC_OUT` check, so `coverage-gate-027` ("the guard does nothing") became false. Moved the line after that check; 053 now runs with the gate values, and 054 checks a `child-v8` process without `GEV_SPEC_OUT`.
- [x] Round 2 spec-adversary F2 to F5 (minor): 053 with the gate values, 054 with the value `child`, a line-total drift case in 056, and "not known" in the 056 AND line. All added.
- [x] Round 2 spec-adversary F6, F7, F8 (minor): known limits `equal-rise-not-recorded`, `blocking-mode-in-started-processes`, and the missing-`setBlocking` case in `blocking-mode-not-checked`.
- [x] Round 2 spec-adversary F9, F10 (minor): task 6.2 unchecked until this report; "timing" removed.
- [x] Round 2 ste-adversary S34 (major): `NODE_TEST_CONTEXT=child-v8` marks every test-file child, with or without coverage (confirmed in `runTestFile` of `internal/test_runner/runner.js` of the image). "Coverage child" became "test-file child" everywhere, including the name of 053 (new in this change).
- [x] Round 2 ste-adversary S35, S36 (major): the requirement said coverage undercounts, but the lost output holds only test and link records; the 056 and 088 AND lines now name an unknown covered count.
- [x] Round 2 ste-adversary S37 to S56 (minor): wording, one name for the new rule ("covered-count rule"), task 5.1 split in two, and approved words. All corrected.
- [x] Round 3 spec-adversary F1 (minor): a `>=` mutation passed. Added a 056 case where the covered count rises and one where only the functions total changes.
- [x] Round 3 spec-adversary F2, F3 (minor): the started-process condition now includes an `options.env` that copies the environment; new known limit `blocking-mode-stalls-child` and corrected Risks text.
- [x] Round 3 spec-adversary F4 and round 4 spec-adversary F1 (minor): this review.md with the mutation report, tasks 6.2 and 7.4.
- [x] Round 3 ste-adversary S57, S58 (major): the three "only a test-file child" lines contradicted the started-process limit, and D2 said totals serve only covered counts (they also give the tolerance). Both rewritten.
- [x] Round 3 ste-adversary S59 to S67 (minor): "With blocking mode" in the requirement text, the `opendirSync` sequence, "test-file child processes", the guard as the subject, the past tense in D3, and approved words. All corrected.
- [x] Round 4 ste-adversary S68 to S72 (minor): "records the fixed merge sequence", "a higher covered count", "until the parent reads the data", the `options.env` condition, and "run late". All corrected in the archived change.
- [x] Scope: rounds 1 to 3 read the full change. Round 4, which the user asked for, read only the diff since a snapshot of the round-3 state, because no round had a commit to name in a `diff <commit>` scope.
- [x] STE warnings: the remaining `STE-ING` warnings are all "blocking" in "blocking mode", which the STE adversary accepted as a technical name in rounds 1 to 4.
- [x] Trace: the round-4 ratchet measured the second cause on `src/data/labelArbiter.js` (407/52 to 405/50, 355 covered on both sides) and wrote two history lines. That drift is not an edit of this change, so `gaps.json` and `history.jsonl` stay equal to `main`.

## Mutation report

Each mutation ran on the final code with `node --test` on `testGuard.test.mjs` and `ledger.test.mjs`, and the code was restored after each run (80 of 80 tests pass).

- [x] Remove the blocking-mode line: `coverage-gate-053` failed.
- [x] Remove the `child-v8` condition: `coverage-gate-054` failed.
- [x] Change the condition to `env.NODE_TEST_CONTEXT`: `coverage-gate-054` failed.
- [x] Move the line before the `GEV_SPEC_OUT` check: `coverage-gate-054` failed.
- [x] Remove the last `?.` before `(true)`: `coverage-gate-053` failed.
- [x] Replace `totalsAgreeOnCoverage(entry, base)` with `false`: `gap-ledger-088` failed.
- [x] Make the covered-count comparison always true: `gap-ledger-056` and `gap-ledger-088` failed.
- [x] Compare only branches and functions: `gap-ledger-056` failed.
- [x] Remove the clause that skips an unchanged total: `gap-ledger-088` failed.
- [x] Remove the check for an unknown covered count: `gap-ledger-056` failed.
- [x] Remove the check for a base entry without totals: `gap-ledger-056` failed.
- [x] Accept a higher covered count (`>=`): `gap-ledger-056` failed.
