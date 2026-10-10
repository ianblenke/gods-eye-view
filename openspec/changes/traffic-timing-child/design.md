## Source

Base commit: `4f0db4ae` (main, after the merge of the Pensacola pack).
The file `.gev-cache/spec/guard-1951.jsonl` of the last gate run lists 51 violations COVERAGE-FAKE. The record has the assertions of the test file `src/data/trafficTiming.test.mjs` only.
The 51 files are the 51 entries of `openspec/trace/gaps.json` with `untrue: true`.

## Key decisions

### D1: A child process for the Vite scenario

The test with the Vite server runs in a child process. The child process runs the same test file with the setting GEV_TRAFFIC_TIMING_CHILD. The file gets no new file, because a new script would be a new code file with a gap.

### D2: The settings of the child process

The parent gives the child a new folder in NODE_V8_COVERAGE and the value "" for GEV_SPEC_OUT, GEV_SPEC_ROOT and GEV_SPEC_INVENTORY.
The wrapper of the guard adds its own settings only when the folder is the folder of the gate run. A new folder makes the settings of the test win, and the preload of the guard installs nothing.
The pattern is in `src/tooling/spec/runParallel.test.mjs`.

### D3: The checks of the test

The child asserts its own settings before the scenario starts. The parent asserts the status 0 and a file "coverage-" in the folder.
A parent that runs the scenario itself fails the check of the child settings. A child with a wrong setting makes the status 1.

### D4: No change of the guard

The guard and the function `untrueFiles` stay as they are. Code that runs under the name of a file with other source is not true coverage.

## Files and measures

The change edits `src/data/trafficTiming.test.mjs`. The coverage gate and the ledger gate measure the result: the ratchet records the 51 entries and the scenario ID.
The trace gate checks that the test carries the ID `coverage-gate-101`.

The prose lint checks STE. The OpenSpec commands check the change structure.
The named faults measure whether a change of the test makes the test fail.
The lead runs the gates in Docker and both review agents on the final tree.

## Purpose at archive time

The lead adds these sentences to the coverage-gate Purpose at archive time:
"The capability also has a requirement for transformed code. A test runs that code in a child process."
