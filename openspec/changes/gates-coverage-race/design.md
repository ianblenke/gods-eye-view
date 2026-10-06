## Source

The raw data uses source commit `290b5d2cf65d614e39f42a0b3b24a53fc2514985`. The command `node --expose-internals` prints the Node coverage source through `process.binding`. Scratch tools use Node internals only for the oracle. Repository code uses no Node internals.

The raw evidence rejects D2 of the archived race change. A fixed file order keeps false coverage. The exact process merge removes it.

## Process rules

The lcov report names LF as lines found.
The lcov report names LH as lines hit.
The lcov report names BRF as branches found.
The lcov report names BRH as branches hit.
The lcov report names FNF as functions found.
The lcov report names FNH as functions hit.

SF names the source file.

Node's `getLines` splits source after each line feed and keeps CRLF offsets. Node's `CoverageLine` excludes the line end characters from its extent. An empty line starts with a positive value. Other lines start with zero.

Node's `getLines` applies the next-line state before the disabled state. It checks next-line comments only on lines without the ignore state. It checks enable and disable comments on every line. A status comment resets the next-line state after the current line.

Node's `mapRangeToLines` locates the line that contains the range start. It visits lines whose start precedes the range end. It writes a value only when the range contains the whole line. Functions and ranges keep their source order. Later writes replace earlier writes.

Node's `summary` includes every split line in LF. A positive line value or an ignore state contributes to LH. Ignored lines do not enter the detailed line report. Every block range contributes to BRF. A nonzero range value or an entirely ignored range contributes to BRH.

Node's `summary` excludes the first function from FNF. Each later function with a range contributes to FNF. Its first range supplies the coverage value. A nonzero value or an entirely ignored range contributes to FNH.

## Merge

The merge module is the file `scripts/spec/lib/v8-merge.mjs`.

The merge module accepts process data and a source callback. Its state keeps per-URL line sets and function variants. State combination adds each covered line and identity to the result. This allows any process order or group order.

The repository function `functionKey` copies Node's `mergeCoverageScripts` identity rule: the function name and first range extent. A branch identity adds its extent and occurrence index within equal extents. The index follows range order within one function. Different source URLs keep separate records.

A listed branch uses its own value. An absent branch uses the innermost listed range that contains its extent. A function without block coverage uses its first range. An absent function supplies zero. An entirely ignored range supplies coverage as in Node's `summary`.

For example, one process lists an outer positive range and an inner zero range. Another process lists only the outer positive range. The inner branch gets the outer value from the second process. The merge covers that branch. Lines still use each process result before the merge.

## Gate interface

`measure` creates a dedicated random raw folder with `mkdtempSync` in the system temporary folder. The prefix is `gev-spec-v8-`.
The folder lies outside the repository root and output folder. Only the main process gets its path through `NODE_V8_COVERAGE`.
`executeRuns` writes only each process overlay to `runs.json`. Allocation processes get no environment key.

`runParallel` adds the overlay to its own environment. The guard obeys the same rules.
A `finally` block removes only this raw folder after the coverage merge, also after an error or absent lcov text.
If lcov text exists without raw coverage files, the gate adds `COVERAGE-RAW-MISSING` and still uses Node text for the other checks.

The gate reads raw JSON files one at a time. It keeps only file URLs inside the root, outside node_modules and test files. It also excludes Node mock URLs. The gate replaces records for loaded URLs and keeps records for unloaded files. `parseLcov` still selects the worst record across URL variants.

## Rebaseline conditions

The command name is `rebaseline`. It accepts only the active change `gates-coverage-race`. The changed-file list must contain the merge module. The base tree must lack that module. History must lack an earlier rebaseline step of this change. These conditions prevent future changes from using the command.

The command changes only loaded source files with true coverage and base content. Each different metric gets a history line with old and new values and totals. Files that now have uncovered items get an entry. Fully covered files lose their gap entry. Each affected file appears in command output.

The gate validates history against the base entries, current content and measurement within the count tolerance. It accepts only line, branch and function metrics. It rejects repeated file metric pairs. Valid entries supply a temporary base ledger to the existing comparison. The comparison rules and tolerance stay unchanged. The current ledger comparison still stops larger gaps.

## Evidence and limits

The host does not establish image coverage values. The lead runs ratchet, rebaseline and gates in the image. The existing specification allows this lcov record replacement without a text change.

## Host evidence

The oracle command is `node --expose-internals` with the scratch file `oracle.cjs`. It checks all raw process files against Node with the same source text. It keeps source snapshots for changed gate files at the source commit. It pairs equal-path URL variants in source order.

The command checks 1308 raw files and 13669 source records. Each metric gives zero mismatches. The resolver check uses 25 process files in 50 seeded orders. Each order gives LF 2117, LH 1700, BRF 524, BRH 389, FNF 68 and FNH 52. The comparison with `union-all.json` gives zero different files. That comparison combines covered line sets across URL variants for each path.

The oracle measures 1056405189 input bytes. Its process merge and final summary need 12328.43 milliseconds. Its peak resident memory is 437844 KiB. These values include the oracle process, so a separate benchmark measures the gate path.

The scratch command `node round-1-evidence.mjs` tests a fresh `mkdtempSync` folder with the prefix `gev-spec-v8-`.
It runs `node --test --experimental-test-coverage` and gives only the main process that folder.
The test child confirms that its own coverage folder differs. Node returns one raw file with 278076 bytes to the fresh folder.
The process exits with status zero. The command removes the folder after the experiment.

The same command totals 1308 raw files with 1056405189 bytes from the original evidence.
Node copies those files from its own temporary folder. Thus the two copies can occupy 2112810378 bytes at the peak.

## Rebaseline sequence

The lead runs rebaseline before ratchet. Before the rebaseline step, ratchet cannot record the larger gaps that the exact merge reveals. Ratchet checks rebaseline history before it changes the ledger. A measurement outside the count tolerance of this history stops that command. This check applies only to the limited step of this change. The existing tolerance formulas and comparison rules stay unchanged.

## Gate path cost

The command `node bench.mjs` in scratch calls the gate merge on the raw folder. It processes 1308 files with 1056405189 bytes. It takes 46512.85 milliseconds and reaches 349052 KiB of resident memory. It writes 892 URL records.

The gate removes the raw folder after the coverage merge or after every error inside the measurement. Other output files stay after a measurement without an error.

## Earlier host coverage evidence

The earlier scratch command `node cleanup-summary.mjs` combines raw records from the measurement of the gate tests on the host. It gives LF/LH 645/645, BRF/BRH 256/256 and FNF/FNH 69/69. The old waiver scenario `gap-ledger-080` allows this added test. The production error path stays unchanged.

The earlier scratch command `node parallel-summary.mjs` combines parent records and real CLI records from the isolated test folder. It gives LF/LH 35/35, BRF/BRH 9/9 and FNF/FNH 6/6. The scratch preload copies those records before test cleanup. The parent coverage report excludes that folder.

## D1. Rebaseline tolerance

The check uses the count tolerance. The command still records exact measurements. The source tree for this decision is commit `b70722b525182b0494e4cd7fe07f8719aae345bc`.

Each history line names the active change. The change must add the merge module. These conditions prevent use by another change. Each file keeps true loaded coverage and unchanged content. Its hash equals the base hash when a base entry exists. A new gap lacks a base hash, so current content supplies its hash.

Old values and old totals equal the base entry exactly. An absent base entry supplies zero and a null total. The start point stays exact. New values use the tolerance of the smaller total. Both uncovered and covered differences must stay within that tolerance. A larger total cannot increase the allowance.

The check rejects repeated file metric pairs. It checks all three metrics against the ledger snapshot that the command wrote. Every snapshot metric that differs from the base needs its history line. For a fully covered file, each metric with uncovered items in the base needs a history line. This rule concerns the snapshot, so a later measurement cannot change its metric set.

The check compares each affected ledger entry with the current measurement through the same metric predicate. Loaded state, source hash and true coverage stay exact. Valid history lines supply the temporary base entries. These entries use the true loaded source state, even when the old entry lacked that state. Metrics without history keep their base values. A new entry uses zero for metrics without history.

## Known limits of D1

The check does not compare the number or set of history lines with recomputed lines. A recorded metric can equal the base during a later measurement. A measured increase without history gets no rebaseline allowance. The normal comparison decides that case.

A line for an unchanged measured metric can still supply an allowance. Its old values remain exact. Its new values stay at most one tolerance above the measurement. The temporary base comparison therefore keeps this limited allowance. The check does not prove that a recorded metric differed during the earlier measurement.

The ledger snapshot also stays within one tolerance of the current measurement. The comparison rules stay unchanged. Host measurements do not establish image values. The trace files keep the image data.

## Image evidence

The image measurements in this section precede the corrections of review round one.

The lead ran `rebaseline` in the image. The scratch command `node round-1-evidence.mjs` reads 153 history lines for 111 files. 43 lines hold a line metric and 110 lines hold a branch metric. No line holds a function metric.

The same scratch command shows that the uncovered values of 109 files rise and no uncovered value falls. The uncovered lines rise by 552 in total. Nine files lack a base entry. The old merge hid their gaps.

The number of fully covered files falls from 264 to 257. The scratch logs `sn-ratchet.log` and `rebaseline.log` give these two counts.

The file `src/annotations/resolver.js` rises from 342 to 417 uncovered lines. This value equals the exact merge of the host data.

Two image measurements of the same tree agree on 150 of the 153 recorded values. The other three values belong to two files.

For `server/providers/vessels/ais-store.js`, the uncovered lines are 44 in one measurement and 40 in the other. Its branch total is 74 in one and 76 in the other.

For `src/cameraGroundGuard.js`, the branch total is 53 in one and 54 in the other. Two host measurements of the whole suite agree for every source file that this change does not edit.

Some tests therefore run different code in the image from one measurement to the next. Known limit `image-test-timing` includes the branch total of `src/cameraGroundGuard.js`, which alternates between 53 and 54.
This change does not find those tests. Decision D1 limits the effect with the count tolerance.

The ratchet command passed after D1 and wrote one history line. Three gate commands then measured the same tree.

The command with the change name gave only the error `REVIEW-MISSING`, and 0 ledger entries did not match. The two commands without the change name also gave 0 entries that did not match.

Both commands without the change name gave the same ledger errors against the unchanged base. These commands do not apply the rebaseline history, so the new counts look like rises. After this change joins main, these errors stop. The base then holds the new values.

One of these two commands also reported a failed test, `src/layers/traffic/navigation.test.mjs`. Known limit `traffic-navigation-timing`: that test failed once in three measurements. This change does not edit it.

## Round one corrections

The corrections start from commit `19d8d459bf9212d31300abfec3ce5cf9e628d6a7`.

For equal parent widths, the later listed range wins. The test uses a covered parent, an uncovered equal parent, and an absent inner branch.
`combineCoverage` serves only the tests of scenario `coverage-gate-062`.
The history check rejects a file without a base entry when all three measured uncovered values equal zero.

The scratch command `python3 round-2-evidence.py` checks the current camera total and its history.
The earlier command `python3 round-1-totals.py` prints the two files without uncovered increases.
`src/cameraGroundGuard.js` still records ten uncovered branches. Its branch total now increases from 53 to 54.
`src/keylessGeocoder.js` keeps five uncovered branches; its branch total falls from 120 to 118.
These total changes explain the two files outside the set with uncovered rises.

## Final host evidence of round one

The command `node --version` gives host Node 26.8.2.
The command `node round-1-module-summary.mjs` checks raw records with the repository coverage merge.
It gives LF/LH 651/651, BRF/BRH 268/268 and FNF/FNH 70/70 for the gates.
It gives LF/LH 813/813, BRF/BRH 525/525 and FNF/FNH 95/95 for the ledger.
It gives LF/LH 35/35, BRF/BRH 10/10 and FNF/FNH 6/6 for the parallel helper.
It gives LF/LH 188/188, BRF/BRH 103/103 and FNF/FNH 19/19 for the merge module.

The gate records include its parent process and real CLI processes in the same folder.
The parallel preload copies its real CLI records before the test removes their folder.
The ledger and merge module each use the raw records of their test process.

The command `python3 round-1-report.py` reads the final command output for each spec test file.
It gives 423 tests and 423 passes across 20 files, with no failure or cancelled test.
Each test file uses its own process.

The full mutation command uses `mut-host.py` with the environment option `--test-isolation=none` and the full `muts.json` file.
The command `python3 round-1-final-audit.py` gives 207 KILLED rows and no open row.
It names the failed test of each row.
The full command follows the last edit of a production file.

The first full gate test process stopped before the end, so it gives no verdict.
A later full process gave one failed test because an old fake process supplied no raw file.
The corrected fake process supplies a raw file. The final full process passes.

The first full mutation command found one survivor after the helper no longer served scenario `coverage-gate-063`.
The new two-URL group fixture in scenario `coverage-gate-062` kills that mutation. The second full command passes.

## Known limits of round two

### raw-folder-reachable

A test can write a `coverage-*.json` file into its own `process.env.NODE_V8_COVERAGE` folder. Node copies every file into the raw folder.

A test can also search `os.tmpdir()` for `gev-spec-v8-*` or read the parent environment through `/proc/<parent pid>/environ`.

The parent environment still holds the path. `mergeRawCoverage` merges every `coverage-*.json` file. Node's own merge had the same hole.
This change closes only the `GEV_SPEC_OUT` path and the predictable path inside the repository.

### raw-folder-after-kill

After a kill signal, Ctrl-C or a time limit, the temporary folder can hold about one GB until the system clears it.
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

The scratch command `python3 round-2-evidence.py` shows the branch total of `src/cameraGroundGuard.js` changes from 53 to 54.
The ledger records 54. This result corrects the earlier total under `image-test-timing`.
