## Tree and runtime

Read commit: `02ec7d340b7b2d978eb3c203f5c7a424cf5e5e58`.
Base requirement commit: `253a07d0d7449eaaa5dcf24d276c24540f852f43`.
Host Node: `26.8.2`.

## Test locations

New tests are in `src/tooling/spec/importReach.test.mjs`, `src/tooling/spec/ledger.test.mjs` and `src/tooling/spec/gates.test.mjs`.
The fixed list in `src/tooling/spec/testGuard.test.mjs` has the new command test names.
The test titles that changed do not exist at base `253a07d`.

## Test names

- T1: `importReach.test.mjs`: [gap-ledger-100 gap-ledger-102] The import paths reach only tracked code descendants.
- T2: `importReach.test.mjs`: [gap-ledger-100 gap-ledger-106] The ledger records the reached gap and its own marks.
- T3: `importReach.test.mjs`: [gap-ledger-091 gap-ledger-101] The rule rejects true coverage and old untrue coverage.
- T4: `importReach.test.mjs`: [gap-ledger-102] The rule rejects absent paths and files outside the code set.
- T5: `importReach.test.mjs`: [gap-ledger-103] The rule rejects other content for the reached exception.
- T6: `importReach.test.mjs`: [gap-ledger-104] The gate allows valid reached counts and rejects a larger count.
- T7: `importReach.test.mjs`: [gap-ledger-105] The gate stops for each false reached condition and names the file.
- T8: `importReach.test.mjs`: [gap-ledger-107] The command writes no gap and the gate stops the build for a path with only base edges.
- T9: `importReach.test.mjs`: [gap-ledger-108] The command and gate allow a new edge between base edges.
- T10: `importReach.test.mjs`: [gap-ledger-108] The search visits both states of a file in a cycle.
- T11: `importReach.test.mjs`: [gap-ledger-108] The base graph resolves imports only to base files.
- T12: `ledger.test.mjs`: [gap-ledger-096 gap-ledger-097] The gate follows the reached rule for a reached adopt line, not the commit and file rules.
- T13: `gates.test.mjs`: [gap-ledger-100 gap-ledger-104 gap-ledger-106] The command and gate allow a reached file with the base content.
- T14: `gates.test.mjs`: [gap-ledger-107] The command writes no entry for a file that only base edges reach.
- T15: `gates.test.mjs`: [gap-ledger-108] The command and gate allow a path with a new middle edge.

- T16: `importReach.test.mjs`: [gap-ledger-109] The command and gate refuse an edge that only HEAD has.
- T17: `gates.test.mjs`: [gap-ledger-109] The command writes no entry for an edge that only HEAD has.

## Scenarios

The delta has 21 scenarios, from `gap-ledger-089` through `gap-ledger-109`.
Scenario 109 is new in this round.
The requirement text is identical to the base text.
Test T3 also checks that the command rejects a base entry with no `untrue` field.

| Scenario | Title | Tests | Mutations |
| --- | --- | --- | --- |
| gap-ledger-091 | Adopt no gap of a file that the merged commit did not change | T3 | R-current, L-no-untrue |
| gap-ledger-096 | Stop for an adopt line with a commit that is not a merged commit | T12 | P-reached-branch |
| gap-ledger-097 | Stop for an adopt line with a file that the merged commit did not change | T12 | P-reached-branch |
| gap-ledger-100 | Record a reached file with untrue coverage | T1, T2, T13 | L-record, R-base-absent, R-base-false |
| gap-ledger-101 | Reject a reached file with true coverage | T3 | R-current, R-base, R-base-missing |
| gap-ledger-102 | Reject a file without an import path | T1, T4 | R-code, R-path, G-test-target |
| gap-ledger-103 | Use the old rule for other content | T5 | R-content, L-old-unchanged |
| gap-ledger-104 | Allow a valid reached adopt line | T6, T13 | L-count-mark, L-limit, L-untrue-allowance |
| gap-ledger-105 | Stop for a reached adopt line that is not valid | T7 | L-merged, L-mark, L-untraced, L-invalid-count |
| gap-ledger-106 | Record the reached field | T2, T13 | L-reached-mark, L-changed-shape |
| gap-ledger-107 | Reject a path with only base edges | T8, T14 | G-all-new, G-first-hop, G-state-start |
| gap-ledger-108 | Allow a path with a new middle edge | T9, T10, T11, T15 | G-base-head-files, G-base-head-content, G-state, G-state-propagate, C-base-head-content |

| gap-ledger-109 | Reject a path with only an author-added new edge | T16, T17 | G-from-head-content, G-from-operand, C-from-head-content |

## Mutations

The final main run has 51 KILLED results. The separate lead mutation is also KILLED.
These are 52 distinct mutations. Each final log ends with `SURVIVORS: []`. No final mutation timed out.

The mutation files are `muts.json` and `muts-lead2.json`.
The scratch directory is `/home/ianblenke/docker/gev-tools/ledger-adopt-reached/`.
The final logs are `round3-mutations-final.log` and `round3-lead2-final.log`.
The runner restores each code file after each mutation.

The sandbox mutation run supplied no test names. It supplies no evidence for this table.
The focused test run stopped before the end. It has no verdict.
Each row below names a test that failed in the final host run.

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
| G-base-head-content | KILLED | T9 |
| G-state | KILLED | T10 |
| G-state-start | KILLED | T8 |
| G-state-propagate | KILLED | T9 |
| L-untrue-allowance | KILLED | T6 |
| L-old-unchanged | KILLED | T5 |
| L-invalid-count | KILLED | T7 |
| C-base-head-content | KILLED | T15 |
| G-from-head-content | KILLED | T16 |
| G-from-operand | KILLED | T16 |
| C-from-head-content | KILLED | T17 |
| C-from-base-content | KILLED | T15 |
| G-path-from | KILLED | T16 |
| G-from-head-files | KILLED | T16 |
| G-base-head-reader | KILLED | T9 |
| C-from-base-files | KILLED | T13 |
| P-reached-branch | KILLED | T12 |

## Host tests and coverage

The full suite passed 382 tests, with 0 failures and 0 skips.
The command is `node --test --test-force-exit src/tooling/spec/*.test.mjs`.
It uses one process per test file.
The log is `round3-tests-final.log` in the scratch directory.

The change adds 17 tests above base `253a07d`.
The count command is `python3 /home/ianblenke/docker/gev-tools/ledger-adopt-reached/count-change-tests.py`.

The coverage run returned exit status 0.
Its report has 338 passed tests, 0 failures and 0 skips.
The full suite log has 44 test names absent from the coverage log.
Separate coverage runs passed all 69 ledger tests and 33 review tests.
These runs overlap the main coverage run, so their counts do not add to the suite count.

The three coverage logs contain every test name from the full suite log.
The other logs are `round3-ledger-coverage.log` and `round3-review-coverage.log`.
The coverage logs are `round3-coverage-final.log` and `round3-coverage-detail.json`.

| File | Lines | Branches | Functions | Covered branches |
| --- | --- | --- | --- | --- |
| scripts/spec/gates.mjs | 100.00% | 99.52% | 100.00% | 206/207 |
| scripts/spec/lib/import-reach.mjs | 100.00% | 100.00% | 100.00% | 35/35 |
| scripts/spec/lib/ledger.mjs | 100.00% | 100.00% | 100.00% | 417/417 |

The one branch gap is at `scripts/spec/gates.mjs:388`, in the waiver error response with `file || ''`.
This branch existed before this change, at base `253a07d`, line 387.
The Git library has no code change.

## Review corrections

Each item records a correction to the tree of commit `02ec7d340b7b2d978eb3c203f5c7a424cf5e5e58`.
These items do not give a new review verdict.

- [x] FINDING blocker Spec 1: Use a merged commit edge absent in the base graph; keep the path in HEAD and cache descendants per commit. Read commit: `02ec7d340b7b2d978eb3c203f5c7a424cf5e5e58`.
- [x] FINDING minor Spec 2: State the rule for new, renamed and moved files, and the required review of their edges. Read commit: `02ec7d340b7b2d978eb3c203f5c7a424cf5e5e58`.
- [x] FINDING minor Spec 3: State the resolved-pair comparison, specifier limits, incomplete base file list and different graph file sets. Read commit: `02ec7d340b7b2d978eb3c203f5c7a424cf5e5e58`.
- [x] FINDING minor Spec 4: Repeat each mutation and name its failed test from the new host log. Read commit: `02ec7d340b7b2d978eb3c203f5c7a424cf5e5e58`.
- [x] FINDING minor Spec 5: Remove the unsupported-import search claim. Read commit: `02ec7d340b7b2d978eb3c203f5c7a424cf5e5e58`.
- [x] FINDING blocker STE 1: Name Test T3 and its command refusal for a base entry with no untrue field. Read commit: `02ec7d340b7b2d978eb3c203f5c7a424cf5e5e58`.
- [x] FINDING blocker STE 2: Use one suite count and count the 17 tests of this change with the named command. Read commit: `02ec7d340b7b2d978eb3c203f5c7a424cf5e5e58`.
- [x] FINDING minor STE 3: Use field for untrue and reached, and state the false field value. Read commit: `02ec7d340b7b2d978eb3c203f5c7a424cf5e5e58`.
- [x] FINDING minor STE 4: Define an edge as a pair of two code files. Read commit: `02ec7d340b7b2d978eb3c203f5c7a424cf5e5e58`.
- [x] FINDING minor STE 5: Add the new edge to the import path condition of scenario 101. Read commit: `02ec7d340b7b2d978eb3c203f5c7a424cf5e5e58`.
- [x] FINDING minor STE 6: Use reached adopt line for the line with the true reached field. Read commit: `02ec7d340b7b2d978eb3c203f5c7a424cf5e5e58`.
- [x] FINDING minor STE 7: Define the current graph as HEAD and name the tracked code files of the base commit. Read commit: `02ec7d340b7b2d978eb3c203f5c7a424cf5e5e58`.
- [x] FINDING minor STE 8: Use the requested terms for validity, allowances, base counts and covered counts. Read commit: `02ec7d340b7b2d978eb3c203f5c7a424cf5e5e58`.
- [x] FINDING minor STE 9: Put one instruction in each task. Read commit: `02ec7d340b7b2d978eb3c203f5c7a424cf5e5e58`.
- [x] FINDING minor STE 10: Use test names in the fixed guard list task. Read commit: `02ec7d340b7b2d978eb3c203f5c7a424cf5e5e58`.
- [x] FINDING minor STE 11: Rename T8 to state the command and gate results; update the test list. Read commit: `02ec7d340b7b2d978eb3c203f5c7a424cf5e5e58`.
- [x] FINDING minor STE 12: Add the cycle and base file results to scenario 108. Read commit: `02ec7d340b7b2d978eb3c203f5c7a424cf5e5e58`.
- [x] FINDING minor STE 13: Rename T14 to state that the command writes no entry. Read commit: `02ec7d340b7b2d978eb3c203f5c7a424cf5e5e58`.
- [x] FINDING minor STE 14: Rename T12 with a capital article and the term reached adopt line. Read commit: `02ec7d340b7b2d978eb3c203f5c7a424cf5e5e58`.
- [x] FINDING minor STE 15: Use mutation files. Read commit: `02ec7d340b7b2d978eb3c203f5c7a424cf5e5e58`.

- [x] FINDING minor STE 16: Use the requested sentence about the review folder. Read commit: `02ec7d340b7b2d978eb3c203f5c7a424cf5e5e58`.

## Checks and lead work

The format write and check commands passed for 1115 source files.
The STE lint reports 0 errors.
The git status command lists 11 changed files.
Each file is in `scripts/spec`, `src/tooling/spec` or the change folder.

The calibrated gates, ratchet and review tasks stay open for the lead.
The review folder is not changed in this round.
The merge owner must check the upstream second parent under rule 21 when this change uses adopt.
