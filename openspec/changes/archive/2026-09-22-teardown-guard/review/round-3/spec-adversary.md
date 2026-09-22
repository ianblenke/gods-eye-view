Verdict: FAIL

- [ ] F1 minor openspec/changes/teardown-guard/tasks.md:26 At commit `80367af7e1866e7fcce442f8f0471a4a0791db2f`, the note says task 6.4 records the current total, but that task contains no counts. The searches return 77 test declarations and 75 teardown hooks. Record those counts in task 6.4.

- [ ] F3 critical src/tooling/spec/runParallel.test.mjs:74 At commit `80367af7e1866e7fcce442f8f0471a4a0791db2f`, the separate coverage folder makes `withGuardEnv()` preserve the empty guard values. `installGuard()` then returns without a guard. The test deletes the isolated coverage without checking it. `gates.test.mjs:827` also disables the child guard. Thus, no leak in the outer gate does not prove guarded child execution. Supply isolated guard folders, roots and valid inventories. Check the child guard records and coverage before cleanup.

- [ ] F4 critical src/tooling/spec/gates.test.mjs:840 At commit `80367af7e1866e7fcce442f8f0471a4a0791db2f`, the new assertion checks the test name but still does not check the record's `file`. A failed record with the correct name and the wrong file passes. Assert that `jsonl[0].file` identifies the temporary `leak.test.mjs` file.

- [ ] F5 minor openspec/changes/teardown-guard/tasks.md:134 At commit `80367af7e1866e7fcce442f8f0471a4a0791db2f`, the coverage movements are now documented. The superseded untraced measurements and their restoration commits remain absent. New history entries retain false reductions for `scopeMask.test.mjs` and `cockpitMarkup.test.mjs`. Identify the superseded entries and restoration commits, including `d94964e` and `f30b40c`.
