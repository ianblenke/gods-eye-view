## Source

The source tree is commit `290b5d2cf65d614e39f42a0b3b24a53fc2514985`. The command `node --expose-internals` prints the Node coverage source through `process.binding`. Scratch tools use Node internals only for the oracle. Repository code uses no Node internals.

The raw evidence rejects D2 of the archived race change. A fixed file order retains false coverage. The exact process union removes it.

## Process rules

`getLines` splits source after each LF and retains CRLF offsets. `CoverageLine` excludes the line ending from its extent. An empty line starts with a positive value. Other lines start with zero.

`getLines` applies the next-line state before the disabled state. It checks next-line comments only on lines without the ignore state. It checks enable and disable comments on every line. A status comment resets the next-line state after the current line.

`mapRangeToLines` locates the line that contains the range start. It visits lines whose start precedes the range end. It writes a value only when the range contains the whole line. Functions and ranges retain their source order. Later writes replace earlier writes.

`summary` includes every split line in LF. A positive line value or an ignore state contributes to LH. Ignored lines do not enter the detailed line report. Every block range contributes to BRF. A nonzero range value or an entirely ignored range contributes to BRH.

`summary` excludes the first function from FNF. Each later function with a range contributes to FNF. Its first range supplies the coverage value. A nonzero value or an entirely ignored range contributes to FNH.

## Union

The pure module accepts process data and a source callback. Its state retains per-URL line sets and function variants. State combination uses set union. This permits any process order or group order.

`mergeCoverageScripts` supplies the function identity rule: the function name and first range extent. A branch identity adds its extent and occurrence index within equal extents. The index follows range order within one function. Different source URLs retain separate records.

A listed branch uses its own value. An absent branch uses the innermost listed range that contains its extent. A function without block coverage uses its first range. An absent function supplies zero. An entirely ignored range supplies coverage as in `summary`.

For example, one process lists an outer positive range and an inner zero range. Another process lists only the outer positive range. The inner branch gets the outer value from the second process. The union covers that branch. Lines still use each process result before the union.

## Gate interface

`buildTestRuns` sets the raw directory only on the main process. `executeRuns` combines that environment with `childEnv`. `runParallel` accepts a complete optional environment per process. Allocation processes retain the environment without raw coverage. The guard keeps its existing rules.

The gate reads raw JSON files one at a time. It retains only file URLs inside the root, outside node_modules and test files. It also excludes Node mock URLs. The gate replaces records for loaded URLs and retains records for unloaded files. `parseLcov` still selects the worst record across URL variants.

## Baseline bounds

The command name is `rebaseline`. It accepts only the active change `gates-coverage-race`. The changed-file list must contain the merge module. The base tree must lack that module. History must lack an earlier baseline step of this change. These bounds prevent future changes from using the command.

The command changes only loaded source files with true coverage and base content. Each different metric gets a history line with old and new values and totals. Newly incomplete files get an entry. Complete files lose their gap entry. Each affected file appears in command output.

The gate validates history against the base entries, current content and measurement within the count tolerance. It accepts only complete metric sets without duplicate pairs. Valid entries supply a temporary base ledger to the existing comparison. The comparison rules and tolerance stay unchanged. The current ledger comparison still stops larger gaps.

## Evidence and limits

The host does not establish image coverage values. The lead executes ratchet, rebaseline and gates in the prescribed image. The existing specification permits this lcov record replacement without a text change.

## Host evidence

The oracle command is `node --expose-internals` with the scratch file `oracle.cjs`. It checks all raw process files against Node with the same source text. It retains source snapshots for changed gate files at the source commit. It pairs equal-path URL variants in source order.

The command checks 1308 raw files and 13669 source records. Each metric gives zero mismatches. The resolver check uses 25 process files in 50 seeded orders. Each order gives LF 2117, LH 1700, BRF 524, BRH 389, FNF 68 and FNH 52. The comparison with `union-all.json` gives zero different files. That comparison combines covered line sets across URL variants for each path.

The oracle measures 1056405189 input bytes. Its process union and final summary need 12328.43 milliseconds. Its peak resident memory is 437844 KiB. These values include the oracle process, so a separate benchmark measures the gate path.

The retention command sets `NODE_V8_COVERAGE` and executes `node --test --experimental-test-coverage` on the scratch test. Host Node retains one raw file with 277959 bytes. Node uses a temporary directory, then copies the raw file to the requested directory. The experiment needs no image or repository source change. Its raw directory is the scratch path `retention-check-v8`.

## Baseline sequence

The lead executes rebaseline before ratchet. Ratchet cannot record the larger gaps that the exact merge reveals before the baseline step. Ratchet checks baseline history before it changes the ledger. A measurement outside the count tolerance of this history stops that command. This check applies only to the bounded step of this change. The existing tolerance formulas and comparison rules stay unchanged.

## Gate path cost

The command `node bench.mjs` in scratch calls the gate merge on the raw directory. It processes 1308 files with 1056405189 bytes. It takes 46512.85 milliseconds and reaches 349052 KiB of resident memory. It writes 892 URL records. 

The gate deletes the raw folder after the merge because CI uploads the output folder. It also deletes that folder without lcov text. Other output files stay.

## Host coverage evidence

The scratch command `node cleanup-summary.mjs` combines raw records from the complete host gate test measurement. It gives LF/LH 645/645, BRF/BRH 256/256 and FNF/FNH 69/69. The old waiver scenario `gap-ledger-080` permits this added test. The production error path stays unchanged.

The scratch command `node parallel-summary.mjs` combines parent records and real CLI records from the isolated test folder. It gives LF/LH 35/35, BRF/BRH 9/9 and FNF/FNH 6/6. The scratch preload copies those records before test cleanup. The parent coverage report excludes that folder.

## D1. Baseline tolerance

The check uses the count tolerance. The command still records exact measurements. The source tree for this decision is commit `b70722b525182b0494e4cd7fe07f8719aae345bc`.

Each history line keeps the active change and new module bounds. These bounds prevent use by another change. Each file retains true loaded coverage and unchanged content. Its hash equals the base hash when a base entry exists. A new gap lacks a base hash, so current content supplies its hash.

Old values and old totals equal the base entry exactly. An absent base entry supplies zero and a null total. This preserves the start point. New values use the tolerance of the smaller total. Both uncovered and covered differences must stay within that tolerance. A larger total cannot increase the allowance.

The check rejects repeated file metric pairs. It retains complete metric sets against the ledger snapshot that the command wrote. Every snapshot metric that differs from the base needs its history line. A complete snapshot needs the base metrics that became complete. This rule concerns the snapshot, so a later measurement cannot change its metric set.

The check compares each affected ledger entry with the current measurement through the same metric predicate. Loaded state, source hash and true coverage stay exact. Valid history lines supply the temporary base entries. These entries use the true loaded source state, even when the old entry lacked that state. Metrics without history retain their base values. A new entry uses zero for metrics without history.

## Known limits of D1

The check does not compare the number or set of history lines with recomputed lines. A recorded metric can equal the base during a later measurement. A measured increase without history gets no baseline allowance. The normal comparison decides that case.

A line for an unchanged measured metric can still supply an allowance. Its old values remain exact. Its new values stay at most one tolerance above the measurement. The temporary base comparison therefore retains this bounded allowance. The check does not prove that a recorded metric differed during the earlier measurement.

The ledger snapshot also stays within one tolerance of the current measurement. The comparison rules stay unchanged. Host measurements do not establish image values. The trace files retain the image data.

## Image evidence

The command `rebaseline` recorded 153 history lines for 111 files in the prescribed image. 43 lines hold a line metric and 110 lines hold a branch metric. No line holds a function metric.

109 files rise and no file falls. The line counts rise by 552 in total. Nine files had no ledger entry before, because the old merge hid their gaps.

The count of complete files falls from 264 to 257. The scratch logs `sn-ratchet.log` and `rebaseline.log` give these two counts.

The file `src/annotations/resolver.js` rises from 342 to 417 uncovered lines. This value equals the exact union of the host data.

Two image measurements of the same tree agree on 150 of the 153 recorded values. The other three values belong to two files.

For `server/providers/vessels/ais-store.js`, the uncovered lines are 44 in one measurement and 40 in the other. Its branch total is 74 in one and 76 in the other.

For `src/cameraGroundGuard.js`, the branch total is 53 in one and 54 in the other. Two host measurements of the whole suite agree for every source file that this change does not edit.

Some tests therefore execute different code in the image from one measurement to the next. Known limit `image-test-timing`: this change does not find those tests. Decision D1 bounds the effect with the count tolerance.

The ratchet command passed after D1 and wrote one history line. Three gate commands then measured the same tree.

The command with the change name gave only the error `REVIEW-MISSING`, and 0 ledger entries did not match. The two commands without the change name also gave 0 entries that did not match.

Both commands without the change name gave the same ledger errors against the unchanged base. They do not apply the baseline history, so the new counts look like rises. The merge removes these errors, because the base then holds the new counts.

One of these two commands also reported a failed test, `src/layers/traffic/navigation.test.mjs`. Known limit `traffic-navigation-timing`: that test failed once in three measurements. This change does not edit it.
