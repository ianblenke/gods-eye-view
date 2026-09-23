## Context

Fable 5.1 examined why whole-project gate runs need frequent retries, at the request of the lead. It reproduced two causes outside the whole-project pipeline, in the pinned Node version of the image (`.node-version`, 24.21.0).

The first cause: the test runner of Node starts one child process for each test file. It marks each child with `NODE_TEST_CONTEXT=child-v8`, with or without coverage. The "v8" names the serializer of the reporter events. Fable found this in `internal/test_runner/runner.js` of the Node build of the image. Each child writes its reporter events to its standard output, an `AF_UNIX` socket pair that Node keeps in non-blocking mode on Linux.

`--test-force-exit` makes that child call `process.exit()` when its event source ends. Node waits for the stream to unpipe, but it does not wait for the kernel socket to send its data. A reproduction with 8 small test files and a stall of 150 ms in the parent lost 196 to 313 of 640 events with `--test-force-exit`. The same reproduction with blocking mode on the standard output of the child kept 640 of 640 each time. The same reproduction without `--test-force-exit` also kept 640 of 640.

The second cause: the Node function `mergeCoverageRanges` (`internal/test_runner/coverage.js`) is not commutative. For each source file, Node reads the coverage records of all the test-file child processes with `opendirSync`. Node merges the records in the sequence that `opendirSync` gives. That sequence is a file system sequence that changes between runs.

Two real runs of the 42 test files that import `src/data/labelArbiter.js` gave the same coverage records, byte for byte. When the merge code of Node merged those 42 records in different sequences, it gave a branch total of 404, 405 or 407. The covered count did not change.

## Changed files

- `scripts/spec/lib/test-guard.mjs`: `installGuard()` sets the standard output of a test-file child process of a gate run to blocking mode.
- `scripts/spec/lib/ledger.mjs`: `compareWithBase()` allows a total drift of an unchanged file when the covered count of each changed metric agrees with the base entry.
- `src/tooling/spec/testGuard.test.mjs`: the tests of `coverage-gate-053` and `coverage-gate-054`.
- `src/tooling/spec/ledger.test.mjs`: the changed test of `gap-ledger-056` and the test of `gap-ledger-088`.
- `openspec/specs/coverage-gate/spec.md` and `openspec/specs/gap-ledger/spec.md`: the new requirement and the changed and added scenarios.

## Goals / Non-Goals

**Goals:**
- Stop the race that loses the queued reporter output of a test-file child process before the parent reads it.
- Stop the false `LEDGER-TOTALS-NOT-BASE` error for a total drift that does not change what the tests of a file cover.
- Change no other rule of the gates. A drift that changes the covered count still stops the build. Without `GEV_SPEC_OUT`, the guard still does nothing (`coverage-gate-027`).

**Non-Goals:**
- Do not change the merge sequence of Node. See D2.
- Do not change `--test-force-exit`, `lossOf`, the tolerance, or a rule for a changed file.
- Do not add a whole-project reproduction of the race to the automated tests. See D4.

## Decisions

### D1. Set blocking mode on the standard output of a test-file child of a gate run

The race is in the test-file child process that `NODE_TEST_CONTEXT=child-v8` identifies. `installGuard()` already reads `env`, and it already runs once in each process through the `NODE_OPTIONS` preload. So it is the one place that knows, early in that process, if the process needs the fix.

The fix line runs after the `GEV_SPEC_OUT` check, so a process without the gate values keeps the rule of `coverage-gate-027`. Each test-file child of a gate run has `GEV_SPEC_OUT`, because `childEnv()` of `gates.mjs` sets it. The line runs before the worker-thread check. In a worker thread, `process.stdout` has no `_handle`, so the line does nothing there. The measured race is in the test-file child, not in the outer runner process, and Node does not mark the outer runner with `child-v8`.

The fix: `processObject.stdout?._handle?.setBlocking?.(true)` when `env.NODE_TEST_CONTEXT === 'child-v8'`. Node already uses blocking mode for standard output on Windows. The fix gives the same behavior on Linux, but only for a process with `GEV_SPEC_OUT` and `NODE_TEST_CONTEXT=child-v8`. A process that a test starts can also have these values (`blocking-mode-in-started-processes`).

Node still ends the child with `--test-force-exit`. A write in blocking mode waits until the kernel can take the data. At the exit, it waits until the kernel sends the queued output. A write in the middle of a test can also wait when the parent does not read (`blocking-mode-stalls-child`).

### D2. Rejected: calculate the branch total in the gate with a fixed merge sequence

The gate can read the coverage records of each process of the main run from `NODE_V8_COVERAGE`. It can merge them in a fixed sequence, for example in the sequence of the URLs of the test files. This gives a constant total for each file, not only for an unchanged file. It needs no comparison of covered counts.

The cost is real. The gate then has its own copy of the merge logic of Node, and a person must change that copy each time Node changes. For that cost, the gate gets a constant total count. The gate uses total counts to calculate covered counts and tolerances. For an unchanged file, the covered-count rule of D3 stops the false error at a lower cost. The known limit `merge-order-not-fixed` records the fixed merge sequence as a later change, if the covered-count rule of D3 is not enough.

### D3. Allow a total drift that does not change the covered count

`compareCoverageEntry` already uses `lossOf`: the smaller of the rise of the not-covered count and the fall of the covered count. It gives the ratchet run of an unchanged file its tolerance. Before this change, the `LEDGER-TOTALS-NOT-BASE` check of `compareWithBase` had no such rule. It stopped the build for each total that was not the base total. The only exception was a `totals` history line of the checked change for that file.

The covered-count rule compares the covered count of each metric whose total changed. When each such covered count is known and agrees with the base entry, the total drift cannot mean a lost test. So the check does not stop the build for it, and the history needs no `totals` line for that file. When a covered count differs or is not known, the check stops the build, as before this change.

### D4. No automated reproduction of the real race

A test that reproduces the race under real load needs a real child process, a real socket and a real burst. The burst must be near the measured limit of about 112 events, or about 33 KB. The result of such a test changes with the load and the speed of the machine. Such a test makes the gates less reliable, and the purpose of this change is to make them more reliable.

The unit tests check the exact condition that the fix reads, `NODE_TEST_CONTEXT`, and the call that it makes, with a fake `processObject`. The reproduction of Fable confirmed the real race and the fix outside the gates. This design records that reproduction. The known limit `no-reproduction-in-gates` records this limit.

## How the gates measure the requirement

### Reporter output durability

`installGuard()` gets one line after its `GEV_SPEC_OUT` check. It sets the standard output of a test-file child to blocking mode when `env.NODE_TEST_CONTEXT === 'child-v8'`.

`coverage-gate-053` checks that a fake `processObject` with the gate values and `child-v8` gets a `setBlocking(true)` call on its `stdout._handle`. It also checks that the guard gives no error for three fake processes with the same values. The first has a `_handle` without `setBlocking`, the second has a `stdout` without `_handle`, and the third has no `stdout`. `coverage-gate-054` checks that three fake processes get no `setBlocking` call. The first has the gate values and no `NODE_TEST_CONTEXT`, the second has the value `child`, and the third has `child-v8` without `GEV_SPEC_OUT`.

Mutations:
- Remove the line. `coverage-gate-053` fails.
- Remove the `env.NODE_TEST_CONTEXT === 'child-v8'` condition, so each process gets the call. `coverage-gate-054` fails.
- Change the condition to `env.NODE_TEST_CONTEXT`, so the value `child` also matches. `coverage-gate-054` fails.
- Move the line before the `GEV_SPEC_OUT` check. `coverage-gate-054` fails.
- Remove the last `?.` before `(true)`. `coverage-gate-053` fails, because the call on a `_handle` without `setBlocking` throws an error.

### Comparison with the base commit

`compareWithBase` gets the function `totalsAgreeOnCoverage(entry, base)`. It gives false when either entry has no totals. For each metric whose total in `entry.totals` differs from `base.totals`, it compares `coveredCount(entry, metric)` with `coveredCount(base, metric)`. It gives true only when each such covered count is known and equal. The totals check becomes:

```js
if (unchanged && JSON.stringify(entry.totals ?? null) !== JSON.stringify(base.totals ?? null) && !totalsHistory.has(file) && !totalsAgreeOnCoverage(entry, base)) {
  error('LEDGER-TOTALS-NOT-BASE', file, ...);
}
```

`gap-ledger-056` gets a third AND line for the changed condition. `gap-ledger-088` covers the new allowed case.

Mutations:
- Replace `totalsAgreeOnCoverage(entry, base)` with `false`. `gap-ledger-088` fails, because the gate stops the build.
- Make the covered-count comparison always true. `gap-ledger-056` fails, because the gate does not stop the build for a drift that changes the covered count.
- Compare only branches and functions, not lines. `gap-ledger-056` fails, because a line-total drift that changes the covered line count no longer stops the build.
- Remove the clause that skips a metric with an unchanged total. `gap-ledger-088` fails, because a better line count then stops the build.
- Remove the check for an unknown covered count. `gap-ledger-056` fails, because a metric with no count then agrees.
- Remove the check for a base entry with no totals. `gap-ledger-056` fails, because the function throws.
- Accept a higher covered count (`>=` in place of `===`). `gap-ledger-056` fails, because a higher covered count then agrees.

## Risks / Trade-offs

A write in blocking mode waits each time the socket is full and the parent does not read. At the exit, that is some milliseconds. In the middle of a test, the event loop of the child stops until the parent reads the data. A test with a timer race can then fail more often under load. The known limits `blocking-mode-stalls-child` and `blocking-mode-in-started-processes` record these waits.

The covered-count rule can hide a real change of a total when the covered count stays equal to the base covered count. The known limits `merge-order-not-fixed` and `equal-rise-not-recorded` record that risk. A drift that changes the covered count still stops the build.
