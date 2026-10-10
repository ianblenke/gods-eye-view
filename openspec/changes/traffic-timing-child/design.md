## Source

Base commit: `4f0db4ae` (main, after the merge of the Pensacola pack).
The guard record of the last gate run lists 51 violations COVERAGE-FAKE. The record has the assertions of the test file `src/data/trafficTiming.test.mjs` only.
The 51 files are the 51 entries of `openspec/trace/gaps.json` with `untrue: true`. The file `evidence/guard-record.txt` holds the list, because each run of a gates target of `make` deletes the folder of the record.

## Key decisions

### D1: A child process for the Vite scenario

The test with the Vite server runs in a child process. The child process runs the same test file with the setting GEV_TRAFFIC_TIMING_CHILD. The change adds no new file, because a new script would be a new code file with a gap.

### D2: The settings of the child process

The parent gives the child a new folder in NODE_V8_COVERAGE and the value "" for GEV_SPEC_OUT, GEV_SPEC_ROOT and GEV_SPEC_INVENTORY.
The wrapper of the guard replaces the settings of the child with its values only when the folder is the folder of the gate run. In other cases the settings of the test win, and a setting that the test does not set gets the gate value. So the test sets the value "" and does not leave the settings out. The preload of the guard then installs nothing.
The pattern is in `src/tooling/spec/runParallel.test.mjs`.

### D3: The checks of the test

The child asserts its own settings before the scenario starts. After its last check the child writes the file "scenario-done.json" with its process number.
The parent asserts three things. The status is 0. The folder holds a file whose name starts with "coverage-". The file "scenario-done.json" holds the process number of the child process.

A parent that runs the scenario itself fails the check of the child settings. A child with a wrong setting makes the status 1.

The test removes the variable NODE_TEST_CONTEXT from the child settings, because the child would print binary frames. The call has a time limit of 300000 milliseconds, so a child that does not stop cannot block the parent.

### D4: No change of the guard

The guard and the function `untrueFiles` stay as they are. Code that runs under the name of a file with other source is not true coverage.

## Files and measures

The change edits `src/data/trafficTiming.test.mjs`. The coverage gate and the ledger gate measure the result: the ratchet records the 51 entries and the scenario ID.
The trace gate checks that the test carries the ID `coverage-gate-101`.

The prose lint checks STE. The OpenSpec commands check the change structure.
The named faults measure whether a change of the test makes the test fail. They run with `node --test` on the host.
The lead runs the gates in Docker and both review agents on the final tree.

## Purpose at archive time

The lead adds these sentences to the coverage-gate Purpose at archive time:
"The capability also has a requirement for transformed code. A test runs that code in a child process."
