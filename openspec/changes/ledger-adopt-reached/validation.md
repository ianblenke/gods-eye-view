## Tree and runtime

Read commit: `253a07d0d7449eaaa5dcf24d276c24540f852f43`.
Host Node: `26.8.2`.

## Scenario tests and mutations

All new tests are in `src/tooling/spec/importReach.test.mjs`. The command test is in `src/tooling/spec/gates.test.mjs`.

| Scenario | Title | Test title after the tags | Mutation that fails the test |
| --- | --- | --- | --- |
| gap-ledger-091 | Adopt no gap of a file that the merged commit did not change | The rule rejects true coverage and old untrue coverage | Remove the current untrue check. |
| gap-ledger-100 | Record a reached file with untrue coverage | The ledger records the reached gap and its own marks | Remove the reached path from the code loop. |
| gap-ledger-101 | Reject a reached file with true coverage | The rule rejects true coverage and old untrue coverage | Remove the current check or the literal false base check. |
| gap-ledger-102 | Reject a file without an import path | The rule rejects absent paths and files outside the code set | Remove the path check or the code check. |
| gap-ledger-103 | Use the old rule for other content | The rule rejects other content for the reached exception | Remove the base content check. |
| gap-ledger-104 | Allow a valid reached line | The gate allows valid reached counts and rejects a larger count | Remove the reached count mark or raise the limit. |
| gap-ledger-105 | Reject a false reached line | The gate rejects each false reached condition with the file name | Remove the merged commit check or the tree check. |
| gap-ledger-106 | Record the reached mark | The ledger records the reached gap and its own marks | Remove the reached field from the history line. |

The import path test has the title "The import paths reach only tracked code descendants". Graph mutations fail this test. They remove transitive steps, literal imports, extension paths or index paths. A mutation that lets test files supply edges also fails this test.

The command test has the title "The command and gate accept a reached file with base content". The command and gate callback mutations fail this test. This test carries `gap-ledger-100`, `gap-ledger-104` and `gap-ledger-106`.

The full mutation list is in the scratch file `muts.json`. The log records 32 failed mutations for the final code. The base entry tests also reject an absent untrue mark. One earlier root filter mutation survived. The code no longer has that redundant filter.

## Host coverage

| File | Lines | Branches | Functions |
| --- | --- | --- | --- |
| scripts/spec/lib/import-reach.mjs | 100% | 100% | 100% |
| scripts/spec/lib/ledger.mjs | 100% | 100% | 100% |
| scripts/spec/gates.mjs | 100% | 99.51% | 100% |

The gate keeps the one branch gap that the base ledger records. The coverage run ended with 372 passed tests and one failed guard list test. The corrected guard list test passed on its next run. The full test run then passed all 373 tests with no skips. The final library check passed 75 tests after the literal false correction. The final command test also passed.

## Checks

The format write and check commands passed for 1115 source files. STE lint reports 0 errors and 342 warnings. The warnings include old prose. The lead must run the calibrated gates and the ratchet. The review tasks stay open.

## Limits

The rule uses literal import paths. A parse error supplies no edges. The merge owner must still check the upstream second parent under rule 21. No command documentation states that adopt records only changed files, so this change needs no command document edit.
