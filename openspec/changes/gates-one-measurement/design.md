## Context

The correction tree starts at commit `c87e7eb88b263791c21277a604ec23c745aafd0e` from `git rev-parse HEAD`.
The Fable report sections on structural costs describe repeated measurements after document changes.
The gate code separates measurement from comparisons.

## Decisions

### D1: One measurement

Run comparisons before the ratchet ends.
Read the ledger and history again after the command writes the files.
Use the same measured coverage, records, assertions and links.
The set `RATCHET_FIXES` still allows repairs before the command writes the files.

The comparisons then use the repaired values without that allowance.
A second measurement does not add file check information.

### D2: The refusal rule

Compare Git content against the commit in the last ratchet history line for this change.
Allow only `openspec/changes/`, `openspec/specs/` and `openspec/trace/` for tracked and untracked changes.

Compare both names of renamed files.
Protected ignored files still cause refusal, except dependency and cache folders.
Use the code inventory at the ratchet commit for ignored code paths.
Other ignored build files do not cause refusal.
The ratchet records the sorted refused paths against HEAD in `dirty`.
Document gates refuse a history line with dirty paths even after those files return to HEAD.

The decision to keep history unchanged compares the dirty list and the snapshot and commit.
Store records, assertions and coverage in a snapshot with its hash in the ratchet history.
Refuse an absent snapshot or a different hash.

Copy the snapshot into the container work folder because Git ignores `.gev-cache/`.
Use a separate container command for document gates, with no file copies back to the source folder.
Add marker files for omitted input file names, because the usual container copy omits ignored files.
Use empty JSON objects so a package marker cannot stop Node before the refusal.
Rebuild trace results with current specs, so changed specs cannot inherit an old verdict.

The document mode writes no trace file.
Refuse failed Git comparisons because an empty result cannot prove equal content.

### D3: Output and status

The first line names the command or the snapshot trust state.
The ratchet prints `REVIEW-MISSING` after it writes the files.
The comparison verdict gives ratchet status zero or two.
Errors that stop the ratchet before it writes the files have status 1.

The command `check` without `--no-measure` keeps its verdict lines and status.
The document mode gives no verdict on refusal.
The document mode names each changed input file and the ratchet commit.
A successful trust decision still runs every file check.

### D4: Command times

Use Coordinated Universal Time (UTC) for command times.
Put the UTC start line after the command or trust line.
Put the UTC finish line after the verdict, with elapsed seconds.
Use an injected clock function for tests.
Time the phases `measure`, `specs`, `compare`, `lint` and `review`.

Show phase seconds only above one second, to identify slow serial work.
The time for `measure` includes its `specs` phase.

### D5: Fast checks

Add `precheck` with the same image pattern as `lint`.
Run format, import direction, package boundary and layer token checks.
Use `origin/main` for the layer token base.
The target has no call to `gates.mjs` because these checks need no measurement.

### D6: Review and gate guidance

Use the ratchet verdict at the start of review after `precheck`.
Commit the input files before the ratchet command so the document mode can trust the measured tree.
Use document gates for archive and prose changes under the three allowed paths.
Keep one full measurement on the final tree and keep CI.
Add both targets to `AGENTS.md` and update the gate flow text under `docs/`.

Keep the review sentences that the tests read.

## Checks

Write scenario tests before production code.
Use fake measurements in fixture repositories.
Test each protected ignored file class and each refusal reason.
Mutate each scenario operand and record the failed repository test.

Measure host coverage before and after the change.
Test each spec test file without forced exit.
The lead completes container gates and review later.

The ratchet container also adds protected ignored file markers before the gate command.
The dirty history comparison needs those names from the source folder.

Keep protected ignored file markers for the ratchet dirty list.
Exclude `.gev-cache/` from the marker list.
Copy only `.gev-cache/spec/` back from the container.
Other cache files stay in the source folder.

Record only created marker names in a separate list.
Remove those markers before the command copies files back.
The command keeps real ignored trace files and copied files that were not markers.

Refuse code files and test files before the allowed path test.
Use forty hexadecimal digits for the ratchet commit.
Do not add an ancestry command: the content comparison still checks a commit from another branch.

Use file class names in refusal reasons.
A refusal list can have input files, code files or test files.
Code files and test files can lie under the three allowed paths.
