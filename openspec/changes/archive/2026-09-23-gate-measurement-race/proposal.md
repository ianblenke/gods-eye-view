## Why

About half of the whole-project gate runs need a retry. A run counts too few test names or scenario links for a file, or it gives a different branch total for a file. No error and no code change explain the difference. This caused many retries in recent changes.

Fable 5.1 found two separate causes in Node 24.21.0. Fable reproduced both causes outside the whole-project pipeline.

The first cause is a race in `--test-force-exit`. The test runner of Node starts one child process for each test file. It gives each child the environment variable `NODE_TEST_CONTEXT=child-v8`. Each child writes its reporter events to its standard output. Node keeps that stream in non-blocking mode on Linux.

`--test-force-exit` calls `process.exit()` for that child when its event source ends. But the kernel socket of the standard output holds only about 112 events before a write must wait. A child whose events end in a fast burst can lose the end of that burst. The child can exit before the kernel sends all the queued output to the parent. The parent gets no error.

The child exits with the status 0 of a run without failures. A reproduction with a stall in the parent and `--test-force-exit` lost 196 to 313 of 640 events of a small test run each time. When the reproduction set the standard output of the child to blocking mode, the parent got all 640 events each time. When the reproduction removed `--test-force-exit`, the parent also got all 640 events.

The second cause is the Node function `mergeCoverageRanges`, which is not commutative. For each source file, Node reads the coverage records of all the test-file child processes with `opendirSync`. It merges the records in the sequence that `opendirSync` gives. That sequence is a file system sequence that changes from run to run.

Two real runs gave the same 42 coverage records for `src/data/labelArbiter.js`, byte for byte. When the merge code of Node merged those 42 records in different sequences, it gave a branch total of 404, 405 or 407. Only the total changes. The covered count stays the same.

## What Changes

- Add a requirement that a test-file child process of a gate run keeps its standard output in blocking mode. Then `--test-force-exit` cannot end it before its queued output reaches the parent.
- Change the check `LEDGER-TOTALS-NOT-BASE`. A total drift of an unchanged file no longer stops the build when the covered count of each changed metric agrees with the base entry. The check still stops the build when a covered count changes, when a covered count is not known, or when an entry has no totals.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `coverage-gate`: the new requirement "Reporter output durability" gets `coverage-gate-053` and `coverage-gate-054`.
- `gap-ledger`: the requirement "Comparison with the base commit" changes the scenario `gap-ledger-056` and adds `gap-ledger-088`.

## Impact

- Changed files: `scripts/spec/lib/test-guard.mjs`, `scripts/spec/lib/ledger.mjs`, `src/tooling/spec/testGuard.test.mjs`, `src/tooling/spec/ledger.test.mjs`, `openspec/specs/coverage-gate/spec.md`, `openspec/specs/gap-ledger/spec.md`, `openspec/trace/ids.json` and `openspec/trace/links.json`.
- Gaps that this change opens: none. Both code files stay at 100%.
- Gaps that this change closes: none. This change keeps two older fixes for the same class of defect. The first is the `.sync` file of `test-force-exit-drops-reporter-output`. The second is the manual fix that rebuilds an entry of `gaps.json` or `links.json` from the test file when the entry becomes smaller. Those fixes stay as a second protection.
- This change writes no waiver.
- The ledger file keeps the version 4.

## Known limits and later changes

- `merge-order-not-fixed`: This change does not change how Node merges coverage records. A total drift with a changed covered count still needs the tolerance or an investigation. A total drift of a changed file also needs the tolerance or an investigation. A later change can calculate the branch total of a file in the gate itself, from the records of each process, in a fixed sequence. The design gives the reason for the choice of this change.
- `equal-rise-not-recorded`: For an unchanged file, a change can now raise a total and the not-covered count of a ledger entry by the same amount. It needs no `totals` history line for that. Then no history line names the change that raised the total. A later change that edits the file starts from that larger not-covered count in the base.
- `blocking-mode-child-only`: The fix sets blocking mode only in a process whose environment has `GEV_SPEC_OUT` and `NODE_TEST_CONTEXT=child-v8`. Such a process is a test-file child process of a gate run, or a process that a test starts. The fix does not change the outer runner process.
- `blocking-mode-in-started-processes`: A test can start a process without its own `options.env`, or with an `options.env` that copies the environment of the test. That process then has `NODE_TEST_CONTEXT=child-v8`, `GEV_SPEC_OUT` and the guard preload. Its standard output then also goes to blocking mode. If the test does not read that output, a write stops that process until the test reads it. The test can then wait until its time limit.
- `blocking-mode-stalls-child`: A write in blocking mode waits each time the socket is full and the parent does not read. This can occur in the middle of a test, also for its console output. The event loop of the child then stops, and its timers run late. A test with a timer race or a time limit can then fail more often under load.
- `blocking-mode-not-checked`: The guard does not read the return code of `setBlocking(true)`. If the call fails, the race can occur again, and no record shows it. Node documents no failure of this call for a socket. Also, if a later Node version removes `setBlocking` from the standard output handle, the guard does nothing and gives no sign. The unit tests use a fake `processObject`, so they do not find this.
- `no-reproduction-in-gates`: This change adds no automated test that reproduces the real race under load. Such a test needs a real child process, a real socket and a real burst. Such a test makes the gates less reliable, and the purpose of the change is to make them more reliable. The unit tests check that the guard sets blocking mode for the correct processes. A reproduction outside the gates confirmed the fix. The design records that reproduction.
