## Tree and runtime

Read commit: `7e715d9a5a3e5948a7491f51efc1555b927ace58`.
Base requirement commit: `253a07d0d7449eaaa5dcf24d276c24540f852f43`.
Host Node: `26.8.2`.

## Test locations

New tests are in `src/tooling/spec/importReach.test.mjs`, `src/tooling/spec/ledger.test.mjs` and `src/tooling/spec/gates.test.mjs`.
The fixed list in `src/tooling/spec/testGuard.test.mjs` has the new command test names.
The two test titles that changed do not exist at base `253a07d`.

## Test names

- T1: `importReach.test.mjs`: [gap-ledger-100 gap-ledger-102] The import paths reach only tracked code descendants.
- T2: `importReach.test.mjs`: [gap-ledger-100 gap-ledger-106] The ledger records the reached gap and its own marks.
- T3: `importReach.test.mjs`: [gap-ledger-091 gap-ledger-101] The rule rejects true coverage and old untrue coverage.
- T4: `importReach.test.mjs`: [gap-ledger-102] The rule rejects absent paths and files outside the code set.
- T5: `importReach.test.mjs`: [gap-ledger-103] The rule rejects other content for the reached exception.
- T6: `importReach.test.mjs`: [gap-ledger-104] The gate allows valid reached counts and rejects a larger count.
- T7: `importReach.test.mjs`: [gap-ledger-105] The gate stops for each false reached condition and names the file.
- T8: `importReach.test.mjs`: [gap-ledger-107] The command and gate reject a path with only base edges.
- T9: `importReach.test.mjs`: [gap-ledger-108] The command and gate allow a new edge between base edges.
- T10: `importReach.test.mjs`: [gap-ledger-108] The search visits both states of a file in a cycle.
- T11: `importReach.test.mjs`: [gap-ledger-108] The base graph resolves imports only to base files.
- T12: `ledger.test.mjs`: [gap-ledger-096 gap-ledger-097] a reached line follows the reached rule and not the commit and file rules.
- T13: `gates.test.mjs`: [gap-ledger-100 gap-ledger-104 gap-ledger-106] The command and gate allow a reached file with the base content.
- T14: `gates.test.mjs`: [gap-ledger-107] The command writes no reached gap for a base import path.
- T15: `gates.test.mjs`: [gap-ledger-108] The command and gate allow a path with a new middle edge.

## Scenarios

The delta has 20 scenarios, from `gap-ledger-089` through `gap-ledger-108`.
Scenarios 107 and 108 are new in this round.
The loaded tree has 609 unique scenario IDs and no spec error.
The requirement text is identical to the base text.
The test also checks that the rule rejects a base entry with no `untrue` field.

| Scenario | Title | Tests | Mutations |
| --- | --- | --- | --- |
| gap-ledger-091 | Adopt no gap of a file that the merged commit did not change | T3 | R-current, L-no-untrue |
| gap-ledger-096 | Stop for an adopt line with a commit that is not a merged commit | T12 | P-reached-branch |
| gap-ledger-097 | Stop for an adopt line with a file that the merged commit did not change | T12 | P-reached-branch |
| gap-ledger-100 | Record a reached file with untrue coverage | T1, T2, T13 | L-record, R-base-absent, R-base-false |
| gap-ledger-101 | Reject a reached file with true coverage | T3 | R-current, R-base, R-base-missing |
| gap-ledger-102 | Reject a file without an import path | T1, T4 | R-code, R-path, G-test-target |
| gap-ledger-103 | Use the old rule for other content | T5 | R-content, L-old-unchanged |
| gap-ledger-104 | Allow a valid reached line | T6, T13 | L-count-mark, L-limit, L-untrue-allowance |
| gap-ledger-105 | Stop for a reached line that is not valid | T7 | L-merged, L-mark, L-untraced, L-invalid-count |
| gap-ledger-106 | Record the reached mark | T2, T13 | L-reached-mark, L-changed-shape |
| gap-ledger-107 | Reject a path with only base edges | T8, T14 | G-all-new, G-first-hop, G-state-start |
| gap-ledger-108 | Allow a path with a new middle edge | T9, T10, T11, T15 | G-base-head-files, G-base-head-content, G-state, G-state-propagate, C-base-head-content |

## Mutations

The final main battery has 43 KILLED results. The separate lead mutation `P-reached-branch` is also KILLED.
These are 44 distinct mutations. All 32 mutations in the lead copy are also KILLED.
Each final log ends with `SURVIVORS: []`. No final mutation timed out.

The first batch had one survivor, `C-base-head-content`. The new middle-edge command test detects that fault.
The final batch repeats all 43 main mutations with the new test.
The runner restores each code file after each mutation.

The scratch directory is `/home/ianblenke/docker/gev-tools/ledger-adopt-reached/`.
The spec files are `muts.json`, `muts-lead2.json` and `muts-lead.json`.
The final logs are `round2-mutations-final.log`, `round2-lead2-final.log` and `round2-lead-copy.log`.

Each row below names at least one test that failed for that mutation.

| Mutation | Result | Test that failed |
| --- | --- | --- |
| R-code | KILLED | T4 |
| R-content | KILLED | T5 |
| R-current | KILLED | T3 |
| R-base | KILLED | T3 |
| R-path | KILLED | T4 |
| G-transitive | KILLED | T1 |
| G-literal | KILLED | T1 |
| G-test-target | KILLED | T1 |
| G-index | KILLED | T1 |
| G-extension | KILLED | T1 |
| L-record | KILLED | T2 |
| L-reached-mark | KILLED | T2 |
| L-changed-shape | KILLED | T2 |
| L-merged | KILLED | T7 |
| L-mark | KILLED | T7 |
| L-untraced | KILLED | T7 |
| L-recheck | KILLED | T7 |
| L-error | KILLED | T7 |
| L-count-mark | KILLED | T6 |
| L-unchanged-count | KILLED | T6 |
| L-totals | KILLED | T6 |
| L-branches | KILLED | T6 |
| L-limit | KILLED | T6 |
| L-no-untrue | KILLED | T3 |
| C-record | KILLED | T13 |
| C-gate | KILLED | T13 |
| G-js | KILLED | T1 |
| G-index-js | KILLED | T1 |
| L-keep-mark | KILLED | T6 |
| R-base-absent | KILLED | T1 |
| R-base-false | KILLED | T1 |
| R-base-missing | KILLED | T3 |
| G-all-new | KILLED | T8 |
| G-first-hop | KILLED | T8 |
| G-base-head-files | KILLED | T11 |
| G-base-head-content | KILLED | T11 |
| G-state | KILLED | T10 |
| G-state-start | KILLED | T8 |
| G-state-propagate | KILLED | T9 |
| L-untrue-allowance | KILLED | T6 |
| L-old-unchanged | KILLED | T5 |
| L-invalid-count | KILLED | T7 |
| C-base-head-content | KILLED | T15 |
| P-reached-branch | KILLED | T12 |

## Host tests and coverage

The exact full test command passed all 380 tests, with 0 failures and 0 skips.
The command uses one process per test file.
The scratch log `round2-tests-final.log` contains these final totals.

The final coverage command passed, with 364 tests, 0 failures and 0 skips.
The 16 review tests appear only in the exact full test log.
A separate host coverage run passed all 33 review tests, with 0 failures and 0 skips.
Its scratch log is `round2-review-coverage.log`.

The two coverage logs contain every test name from the exact full test log.
That full run passed 380 tests.
The scratch log `round2-coverage-final.log` contains the coverage verdict.
The scratch file `round2-coverage-detail.json` contains the branch counts and line numbers.

| File | Lines | Branches | Functions | Covered branches |
| --- | --- | --- | --- | --- |
| scripts/spec/gates.mjs | 100.00% | 99.52% | 100.00% | 206/207 |
| scripts/spec/lib/import-reach.mjs | 100.00% | 100.00% | 100.00% | 33/33 |
| scripts/spec/lib/ledger.mjs | 100.00% | 100.00% | 100.00% | 417/417 |

The one branch gap is at `scripts/spec/gates.mjs:388`, in the waiver error response with `file || ''`.
This branch existed before this change. The identical source line is at base `253a07d`, line 387.

The base ledger records one branch gap for this file. The final host run also has one branch gap.
No branch gap opens. The gate has 206 of 207 branches covered.
The Git library has no code change in this round.


## Review corrections

Each item below names the commit that supplied the tree for this round.
These items record corrections. They do not give a new review verdict.

- [x] FINDING blocker Spec 1: Add the base graph, the new-edge search states, scenarios 107 and 108, and their operand mutations. Read commit: `7e715d9a5a3e5948a7491f51efc1555b927ace58`.
- [x] FINDING minor Spec 2: State the count and totals limits, and the exact allowance bounds, in the proposal. Read commit: `7e715d9a5a3e5948a7491f51efc1555b927ace58`.
- [x] FINDING minor Spec 3: State the resolution limits and the search count of 0 unsupported code imports in the proposal. Read commit: `7e715d9a5a3e5948a7491f51efc1555b927ace58`.
- [x] FINDING minor Spec 4: State the old-ledger limit for an absent `untrue` field in the proposal. Read commit: `7e715d9a5a3e5948a7491f51efc1555b927ace58`.
- [x] FINDING minor Spec 5: Add the untrue allowance to scenario 104, its test, and mutation `L-untrue-allowance`. Read commit: `7e715d9a5a3e5948a7491f51efc1555b927ace58`.
- [x] FINDING minor Spec 6: Assert the old-rule refusal in scenario 103 with a real eligible callback; mutation `L-old-unchanged` detects it. Read commit: `7e715d9a5a3e5948a7491f51efc1555b927ace58`.
- [x] FINDING minor Spec 7: Replace the old counts with the final evidence, and name the branch gap in this report. Read commit: `7e715d9a5a3e5948a7491f51efc1555b927ace58`.
- [x] FINDING blocker STE 1: Name all three new-test files and add scenarios 096 and 097 to the table. Read commit: `7e715d9a5a3e5948a7491f51efc1555b927ace58`.
- [x] FINDING blocker STE 2: State the required `untrue` and `untraced` values in scenarios 100 and 105. Read commit: `7e715d9a5a3e5948a7491f51efc1555b927ace58`.
- [x] FINDING blocker STE 3: Keep the requirement text; explain scenarios 096, 097 and 105 in the design, and test the absence of adopted counts. Read commit: `7e715d9a5a3e5948a7491f51efc1555b927ace58`.
- [x] FINDING blocker STE 4: Use adopt lines, history lines and coverage counts as separate terms in the design. Read commit: `7e715d9a5a3e5948a7491f51efc1555b927ace58`.
- [x] FINDING minor STE 5: State that the gate allows the entry and totals when the reached adopt line is valid. Read commit: `7e715d9a5a3e5948a7491f51efc1555b927ace58`.
- [x] FINDING minor STE 6: Use import descendants instead of the noun reach in the design and proposal. Read commit: `7e715d9a5a3e5948a7491f51efc1555b927ace58`.
- [x] FINDING minor STE 7: Add the articles, define measured coverage, and use the same phrase in scenarios 100 and 102 and the design. Read commit: `7e715d9a5a3e5948a7491f51efc1555b927ace58`.
- [x] FINDING minor STE 8: Use stops the build for the gate and the requested title for scenario 105. Read commit: `7e715d9a5a3e5948a7491f51efc1555b927ace58`.
- [x] FINDING minor STE 9: Define the content comparisons in scenarios 101 to 103; scenario 103 no longer calls other content a reached file. Read commit: `7e715d9a5a3e5948a7491f51efc1555b927ace58`.
- [x] FINDING minor STE 10: Split the mutation instructions into sentences and start each sub-item with a verb. Read commit: `7e715d9a5a3e5948a7491f51efc1555b927ace58`.
- [x] FINDING minor STE 11: Add the article before boolean and state that this change opens no gap and closes no gap. Read commit: `7e715d9a5a3e5948a7491f51efc1555b927ace58`.
- [x] FINDING minor STE 12: State that the test checks the rule refusal for a base entry with no `untrue` field. Read commit: `7e715d9a5a3e5948a7491f51efc1555b927ace58`.
- [x] FINDING minor STE 13: Rename both new tests, update the fixed list and mutation patterns, and repeat the mutations. Read commit: `7e715d9a5a3e5948a7491f51efc1555b927ace58`.
- [x] FINDING minor STE 14: Use the instruction: Do not change the code that measures coverage. Read commit: `7e715d9a5a3e5948a7491f51efc1555b927ace58`.

## Checks and lead work

The host format write and check commands passed for 1115 source files.
The STE lint command reports 0 errors after each group of prose corrections.
The final STE lint reports 0 errors and 344 warnings.

The calibrated gates, ratchet and review tasks stay open for the lead.
The review folder has no edit in this round.
The merge owner must still check the upstream second parent under rule 21 when this change uses adopt.
