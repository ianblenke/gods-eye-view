## Why

The gap ledger marks 51 code files as untrue. The gate gives them 0% coverage for every test, also for a test that loads the real source.
One test file causes this. The test `src/data/trafficTiming.test.mjs` starts a Vite server that changes the source of 51 files. The guard then finds code that runs under the name of a file with other source.

A fork edit of such a file raises an error that no waiver clears. For this reason the Pensacola pack has no data credit.

## What Changes

- Change the test `src/data/trafficTiming.test.mjs`. The test with the Vite server starts a child process that runs the same file.
- The child process has a folder of its own for V8 coverage and blank guard settings. The test checks both in the child and in the parent.
- Run the image ratchet. It records the new numbers of the 51 ledger entries.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `coverage-gate`: Add the requirement "Transformed code outside the guard" with the scenario `coverage-gate-101`.

## Impact

The change edits no code file. It edits one test file of the upstream class, and it adds no file.
The guard stays as it is, and the gate stays as strict as before. The code that the Vite server changes is not counted, as before.

The ratchet closes the untrue mark of 51 entries of `openspec/trace/gaps.json`. It sets the numbers of lines from the real coverage of the other tests. A file that no other test loads gets the state "not loaded".
The ratchet records the closed gaps and the new scenario ID. No gap opens.

## Known limits and later changes

- Known limit `scope`: Only the test of traffic timing makes a violation in the last gate run. Other tests that use a Vite server make none.
- Known limit `child-cost`: The test file runs twice, in the parent process and in the child process. The test takes more time.
- Known limit `upstream-test`: The test file is upstream code. A later sync can conflict with this change.
- Known limit `result`: The new numbers of the 51 entries are known only after the ratchet.
- Later change: The Pensacola pack can get its data credit after this change, with a test for the changed lines.
