## Why

Node changes coverage values with the order of process files. Its range merge also reports coverage that no process records.

## What Changes

- Add an exact process merge without Node internals or a new dependency.
- Replace loaded lcov records after the main test process exits.
- Delete the raw coverage folder after the merge.
- Add one limited ledger rebaseline step for unchanged source files. The check of its history uses the count tolerance.

## Capabilities

### Modified Capabilities

- `coverage-gate`: add an exact process merge.
- `gap-ledger`: add one rebaseline step.

## Impact

The change adds a merge module and tests. It changes the gates, parallel helper and ledger library. The lead measures each ledger gap in the image. The rebaseline and ratchet commands write `gaps.json`, `history.jsonl`, `ids.json` and `links.json`. The lead ran them in the image.

Some uncovered values rise because the old Node merge reported coverage that no process recorded. The rebaseline step records each file by name.

The raw folder lies outside the repository root and output folder. The gate removes it after the measurement ends normally and after an error in the merge. The `finally` block also covers other errors inside the measurement; no test makes one.

## Known limits

The tolerance stays unchanged. The scratch command `node bench.mjs` measures 1056405189 raw bytes and 46512.85 milliseconds for the gate merge. Raw files can occupy about two GB at the peak because Node copies its temporary files. The scratch command `node round-1-evidence.mjs` totals 1056405189 raw bytes. Two copies can occupy 2112810378 bytes at the peak.

Host values differ from image values. The design records the results of the image checks.

Decision D1 of the design accepts a history line for an unchanged metric. Its new value can be one tolerance above the measurement. The check does not prove that the metric differed in the earlier measurement.

The known limits `image-test-timing` and `traffic-navigation-timing` remain. The design records the image evidence.
The `rebaseline` command records an increase. A test that this change removes can cause it. No gate compares removed tests.

After this change joins main, the base holds the merge module. The `rebaseline` command stays in the tree but cannot run again.

### raw-folder-reachable

A test can write a `coverage-*.json` file into its own `process.env.NODE_V8_COVERAGE` folder. Node copies every file into the raw folder.

A test can also search `os.tmpdir()` for `gev-spec-v8-*` or read the parent environment through `/proc/<parent pid>/environ`.

The parent environment still holds the path. `mergeRawCoverage` merges every `coverage-*.json` file. Node's own merge has the same fault.
This change closes only the `GEV_SPEC_OUT` path and the predictable path inside the repository.

### raw-folder-after-kill

After a kill signal, Ctrl-C or a time limit, two folders can stay in the temporary folder until the system clears them. They are the `node-coverage-*` folder of Node and the raw folder. Together they can reach up to about two GB.
The old folder in `.gev-cache/spec` disappeared at the next measurement. The `finally` block cannot remove files after process termination.
The scratch command `python3 round-2-evidence.py` measures 1056405189 raw bytes.

### rebaseline-flip-risk

Image test times can change the uncovered value of a file without a base entry from one item to zero.
The gate then rejects the whole history of the change. The tolerance of up to eight items otherwise allows that difference.
The scratch command `python3 round-2-evidence.py` reads the ledger and its history at commit `0dfd0a78dc70893128abc0f009b731f81120589b`.

The command gives 151 total branches and one uncovered branch for `scripts/spec/lib/test-guard.mjs`.

The command gives 287 total branches and one uncovered branch for `src/layers/osh/index.js`.

The command gives 36 total branches and one uncovered branch for `src/data/aircraftClass.js`.

After this change joins main, these history lines belong to the base. This risk then ends.

### finally-test-scope

Scenario `coverage-gate-066` says that the gate removes the raw folder after an error inside the measurement. The tests make only one such error: an invalid raw file that fails the merge.
The `try` block also covers errors before the merge. No test makes one, so a `try` block that starts later still passes the tests.

### random-name-test-scope

Scenario `coverage-gate-066` says that the folder name is random. Its test proves only that six measurements give different names with a non-empty suffix.
A name that comes from a counter or a process number also passes the test.

### history-122-test-scope

The test of scenario `gap-ledger-122` uses a history with one line. Its check that the gate writes no entry cannot fail, because `invalid()` returns before any write.
The effect today is nil, because the error stops the build in each case.
