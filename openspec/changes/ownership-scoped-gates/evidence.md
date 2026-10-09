## Tree and scope

Tree read: e2437f945215860c42b5d8bba6834c85f93a90ce.

Input commit: 85489e996384b89c0df6938d60f38cbaeb7e80ec.

Upstream read: 95fa816232456a6831172befa2f1b34b9ee73794.

At Pass 1, the specs and tests came before the code. The manifest has 92 exact paths and prefixes.

The manifest lists all 1025 fork-only files from the requested tree comparison.

The QA register has 83 script purposes, no errors and no script for ownership.

## Files

Input files: AGENTS.md, openspec/config.yaml and openspec/ownership.json.

Gate files: scripts/spec/gates.mjs and lib/ownership.mjs, lib/measurement.mjs, lib/qa-register.mjs and lib/v8-merge.mjs under scripts/spec/.

Test files under src/tooling/spec/: ownership.test.mjs, ownershipGate.test.mjs, qaRegister.test.mjs, v8Merge.test.mjs and gates.test.mjs.

The change folder has the proposal, design, spec, tasks, this evidence and mutation-results.json.

## Host checks

Node version: 26.8.2. Host test and mutation commands use taskset cores 4 through 7 and nice value 19.

Each test file runs in its own process. The local tool copy has no test isolation flag.

| Test file | Tests | Pass | Fail |
|---|---:|---:|---:|
| ownership.test.mjs | 26 | 26 | 0 |
| ownershipGate.test.mjs | 11 | 11 | 0 |
| qaRegister.test.mjs | 39 | 39 | 0 |
| v8Merge.test.mjs | 11 | 11 | 0 |

These titles are the names at the time of the run. Later corrections renamed some titles; the tags are unchanged.

The first complete gates.test.mjs run had 227 tests: 218 passed and 9 failed.

Three fixture checks now pass with the line data that the new rule needs.

The host adapter joins per-file traces and LCOV. It accepts absent LCOV when a child stops before the report.

The final full legacy run finished with exit status 1. Its log has no test summary.

The reporter recheck has 10 tests: 6 passed and 4 failed.

The four failures concern a worker, child coverage, parent process arguments and forced exit records.

A scratch copy of base commit e2437f945215860c42b5d8bba6834c85f93a90ce fails all four cases with the same host adapter.

The base probe has 4 tests, 0 passes and 4 failures. These failures predate the change.

The scratch copy has no branch. Its TREE_READ file names the base commit.

| Case | Base | Input commit |
|---|---|---|
| coverage-gate-024 | fail | fail |
| spec-trace-039 spec-trace-040 | fail | fail |
| coverage-gate-031 | fail | fail |
| coverage-gate-048 | fail | fail |

These titles are the names at the time of the run. Later corrections renamed some titles; the tags are unchanged.

The first base probe stopped before tests because the scratch copy lacked a dependency. It has no test verdict.

Two earlier large runs stopped before the end. They have no verdict.

The host adapter uses file descriptors because sandbox pipes give EPERM errors.

It runs fixture test files separately. It does not change the repository runner or a gate rule.

## Format and prose

Format result: Checked 1158 source files. The format host shim recovers a successful Git result after a sandbox EPERM error.

The native format command stopped at that error. The shim does not bypass a format check.

STE lint result: 0 errors. The final log records the warning count.

## Coverage

Each changed script has 100% line, branch and function coverage on the host.

Node reports give 100% for ownership.mjs, qa-register.mjs and v8-merge.mjs.

The target-file reader merges actual V8 records for the other two files, one target at a time.

| Script | Lines | Branches | Functions |
|---|---:|---:|---:|
| gates.mjs | 757/757 | 363/363 | 88/88 |
| measurement.mjs | 65/65 | 58/58 | 8/8 |

These titles are the names at the time of the run. Later corrections renamed some titles; the tags are unchanged.

Those merged counts use 311 process records. They do not use fake fixture measurements.

The image must supply the Node result of the image. No host result is an image gate verdict.

## Automatic mutations

The default generator omits error message text.

The first generator produced 8993 candidates. The diff filter selected 1581.

Phase one completed: 1327 killed, 240 survived, 12 timeout and 2 crash.

Two tests found source faults: report test totals and an upstream comment with no QA tags.

At Pass 1, the specs and failed tests came before those two source fixes.

Of the old mutants, 1552 spans map to the final source. The other 29 spans changed.

The second generator produced 1920 candidates for the two files. The fix filter selected 70 new mutants.

The final set has 1622 current mutants. The result file records their source spans, code edits and failed test names.

We carry forward 1300 phase-one kills for source spans that did not change.

The full second phase uses the final source and the stronger tests.

| Current set | Phase one killed | Phase one survived | Timeout | Crash | Phase two killed | Final survivors |
|---|---:|---:|---:|---:|---:|---:|
| 1622 | 1360 | 248 | 12 | 2 | 173 | 75 |

These titles are the names at the time of the run. Later corrections renamed some titles; the tags are unchanged.

The 75 survivors have 44 equivalent probes and 31 known limits.

Timeouts do not count as kills. The 12 timeout edits stop a loop counter or make its condition always true.

The two crashes change the JSON parse argument. The tool labels their SyntaxError failures as crashes.

The tool runs each test file in its own Node process. It has no shared test process.

The local copy changes process transport and the worker Git index. It keeps the result groups and deadlines.

The tool files and full logs are in /home/ianblenke/docker/gev-tools/ownership-gates/.

The command inputs are phase2-mutants.json and followup-mutants.json. Results are results.json and followup-results.json.

The original phase-one inputs and source copies remain in that folder.

Use mutation-results.json in this change for the current set and the failed test names.

## Survivor bounds

E means EQUIVALENT. The probe file applies the mutation or probes its exact expression and compares literal input cases.

The input contract has plain JSON records, string text and POSIX paths. It has no getters.

L1 means a known limit for old commands or usage text. The focused mutation set does not test those commands.

L2 means a known limit for old measurement options, trace links or profile labels. The focused mutation set does not test them.

L3 means a known limit for QA advice with repeated covers items. The focused set has no repeated item.

L4 means a known limit for class advice on other commands. The spec needs that advice only for check and ratchet.

The probe source is equivalent-probes.mjs. The probe result has 44 passed cases.

| ID | File and line | Result |
|---|---|---|
| a0021 | scripts/spec/gates.mjs:53 | L1 |
| a0022 | scripts/spec/gates.mjs:53 | L1 |
| a0023 | scripts/spec/gates.mjs:53 | L1 |
| a0025 | scripts/spec/gates.mjs:53 | L1 |
| a0031 | scripts/spec/gates.mjs:53 | L1 |
| a0032 | scripts/spec/gates.mjs:53 | L1 |
| a0033 | scripts/spec/gates.mjs:53 | L1 |
| a0035 | scripts/spec/gates.mjs:53 | L1 |
| a0041 | scripts/spec/gates.mjs:53 | L1 |
| a0042 | scripts/spec/gates.mjs:53 | L1 |
| a0043 | scripts/spec/gates.mjs:53 | L1 |
| a0045 | scripts/spec/gates.mjs:53 | L1 |
| a0075 | scripts/spec/gates.mjs:55 | L1 |
| a1749 | scripts/spec/gates.mjs:320 | E |
| a1755 | scripts/spec/gates.mjs:320 | E |
| a1756 | scripts/spec/gates.mjs:320 | E |
| a1760 | scripts/spec/gates.mjs:320 | L2 |
| a1761 | scripts/spec/gates.mjs:320 | L2 |
| a1762 | scripts/spec/gates.mjs:320 | L2 |
| a3256 | scripts/spec/gates.mjs:511 | L4 |
| a3258 | scripts/spec/gates.mjs:511 | L4 |
| a3265 | scripts/spec/gates.mjs:511 | E |
| a3267 | scripts/spec/gates.mjs:511 | L4 |
| a3270 | scripts/spec/gates.mjs:511 | L4 |
| a3694 | scripts/spec/gates.mjs:540 | L2 |
| a3700 | scripts/spec/gates.mjs:540 | L2 |
| a3705 | scripts/spec/gates.mjs:541 | L2 |
| a3710 | scripts/spec/gates.mjs:541 | L2 |
| a3718 | scripts/spec/gates.mjs:541 | L2 |
| a3719 | scripts/spec/gates.mjs:541 | L2 |
| a3720 | scripts/spec/gates.mjs:541 | L2 |
| a3726 | scripts/spec/gates.mjs:541 | L2 |
| a3727 | scripts/spec/gates.mjs:541 | L2 |
| a3728 | scripts/spec/gates.mjs:541 | L2 |
| a3944 | scripts/spec/gates.mjs:567 | E |
| a3949 | scripts/spec/gates.mjs:567 | E |
| a3995 | scripts/spec/gates.mjs:572 | E |
| a3998 | scripts/spec/gates.mjs:572 | E |
| a5535 | scripts/spec/lib/ownership.mjs:11 | E |
| a5536 | scripts/spec/lib/ownership.mjs:11 | E |
| a5566 | scripts/spec/lib/ownership.mjs:12 | E |
| a5603 | scripts/spec/lib/ownership.mjs:13 | E |
| a5625 | scripts/spec/lib/ownership.mjs:22 | E |
| a5627 | scripts/spec/lib/ownership.mjs:22 | E |
| a5632 | scripts/spec/lib/ownership.mjs:22 | E |
| a5894 | scripts/spec/lib/ownership.mjs:61 | E |
| a5896 | scripts/spec/lib/ownership.mjs:61 | E |
| a5970 | scripts/spec/lib/ownership.mjs:75 | E |
| a5971 | scripts/spec/lib/ownership.mjs:75 | E |
| a6015 | scripts/spec/lib/ownership.mjs:80 | E |
| a6113 | scripts/spec/lib/ownership.mjs:90 | E |
| a6118 | scripts/spec/lib/ownership.mjs:90 | E |
| a6123 | scripts/spec/lib/ownership.mjs:90 | E |
| a6132 | scripts/spec/lib/ownership.mjs:90 | E |
| a6136 | scripts/spec/lib/ownership.mjs:90 | E |
| a6138 | scripts/spec/lib/ownership.mjs:90 | E |
| a6150 | scripts/spec/lib/ownership.mjs:92 | E |
| a6174 | scripts/spec/lib/ownership.mjs:94 | E |
| a6179 | scripts/spec/lib/ownership.mjs:94 | E |
| a6276 | scripts/spec/lib/ownership.mjs:100 | E |
| a6278 | scripts/spec/lib/ownership.mjs:100 | E |
| a6279 | scripts/spec/lib/ownership.mjs:100 | E |
| a6306 | scripts/spec/lib/ownership.mjs:101 | E |
| a6328 | scripts/spec/lib/ownership.mjs:102 | E |
| a7424 | scripts/spec/lib/qa-register.mjs:39 | E |
| a7439 | scripts/spec/lib/qa-register.mjs:39 | E |
| a7440 | scripts/spec/lib/qa-register.mjs:39 | E |
| a7853 | scripts/spec/lib/qa-register.mjs:82 | L3 |
| b0028 | scripts/spec/lib/ownership.mjs:114 | E |
| b0037 | scripts/spec/lib/qa-register.mjs:39 | E |
| b0046 | scripts/spec/lib/qa-register.mjs:39 | E |
| b0048 | scripts/spec/lib/qa-register.mjs:39 | E |
| b0049 | scripts/spec/lib/qa-register.mjs:39 | E |
| b0063 | scripts/spec/lib/qa-register.mjs:39 | E |
| b0064 | scripts/spec/lib/qa-register.mjs:39 | E |

These titles are the names at the time of the run. Later corrections renamed some titles; the tags are unchanged.

## Failed mutation tests

The result file gives the full name and source file for every killed mutant.

| ID | Code edit | Failed test |
|---|---|---|
| a2401 | Replace manifest with undefined | [ownership-011] report uses the manifest for ledger paths |
| a0902 | Remove QA header errors | [ownership-010] check keeps QA header errors |
| a5768 | Change minus to plus | [ownership-016] sorts all line numbers as numbers |
| a5579 | Change Z to Y | [ownership-001] accepts each ASCII range end |
| a5997 | Remove the DA start anchor | [ownership-017] rejects extra line record text |
| a6221 | Use only the last waiver count | [ownership-018] sums owned file gaps and waiver counts |
| a6616 | Use an empty assertion array | [ownership-013] stores line data in the snapshot |
| b0056 | Remove the comment start anchor | [ownership-009] uses the synthetic header for a later comment |
| b0009 | Use only the last test file count | [ownership-018] sums test counts across owned files |
| b0013 | Remove the initial zero count | [ownership-019] counts zero instances for an empty name map |

These titles are the names at the time of the run. Later corrections renamed some titles; the tags are unchanged.

## Source hashes

The hash file uses SHA-256 for the tested source.

| File | Hash |
|---|---|
| scripts/spec/gates.mjs | a24949d4278b01dc2c376118cc06c122969eef5dc786ae7ebd0372592e339d45 |
| scripts/spec/lib/ownership.mjs | fc0633efedb9fe9b341e8f163ebc96bfdc7e53eaddb832bf6a49cdcf80e71107 |
| scripts/spec/lib/measurement.mjs | af009427eb2145d384180e8867a87bad838d3f0c1d661b4b2c3eccda6902d7d8 |
| scripts/spec/lib/qa-register.mjs | 96e100f8dd7390d83e4cae328452b3f45c371d34e03afcad877f0e0dfdb0fd96 |
| scripts/spec/lib/v8-merge.mjs | 19c743fe91e7c878ac61471736bb15e5835b2b23932a81f4852dc152de599fae |

These titles are the names at the time of the run. Later corrections renamed some titles; the tags are unchanged.

## Lead work

No Docker, make, project ratchet, project adopt, review, push or gh command ran here.

The lead must run the image measurement and make ratchet CHANGE=ownership-scoped-gates.

The lead must read the ratchet comparison verdict and its QA lines.

The base ledger has one branch gap in test-guard.mjs and one in src/layers/osh/index.js. Both files are owned.

The lead must resolve each true owned gap. The new gate stays strict.

The lead must run the two review agents, archive the change and write review.md.

The lead must run make gates CHANGE=ownership-scoped-gates on the final tree and commit the change and trace files.

The pass 2 section records the owner decision for sync lines.

## Correction search

The final source search gives these lines:

```
scripts/spec/lib/ownership.mjs:115: const names = tests.reduce((sum, file) => sum + Object.values(ledger.untracedTests[file].names).reduce((total, count) => total + count, 0), 0);
scripts/spec/lib/qa-register.mjs:40: header = { purpose: 'Check upstream code.', covers: ['unmapped: upstream'], run: `node ${file}`, needs: 'The upstream script needs its own setup.', synthetic: true };
src/tooling/spec/gates.test.mjs:1624: function trustedFixture(body, extra = {}, base = {}, measurement = {}) {
src/tooling/spec/gates.test.mjs:2280: }, {}, {}, { loaded: true }));
src/tooling/spec/gates.test.mjs:2397: }, { '.gitignore': '.gev-cache/\nscripts/spec/ignored.txt\n' }, {}, { loaded: true }));
```

## Pass 2 tree and rule

Tree read: a70c24e2a5836544b7490899e9d352cbb343d053.

The owner states that upstream source lines need no changed line coverage in a sync.

The gate uses the intersection of the base diff lines and the adopt source diff lines.

Each file uses the adopt source of its last adopt record. Other files use the last source in the change.

A file absent from its source uses all its current lines for the source set.

Each source must be an ancestor of HEAD. An invalid source stops the check.

A change without adopt source records keeps the base diff rule.

Whole-file owned coverage and ledger comparisons stay in force.

Scenarios: ownership-020 through ownership-025.

The tests use real temporary Git repositories, with a merge with a conflict.

The first test run stopped at the absent syncChangedLines export. It has no test verdict.

## Pass 2 named mutation proof

The proof copy records tree a70c24e2a5836544b7490899e9d352cbb343d053 and the pass 2 source edits.

It has no branch. The proof does not change the clone.

| Mutation | Source edit | Failed test |
|---|---|---|
| No source intersection | Keep the base set without the filter | ownership-020 ownership-025: exempts merge lines and counts current code |
| Drop the conflict repair line | Replace the intersection with an empty array | ownership-021: needs the manual conflict repair line |
| Drop the vendored author edit | Replace the intersection with an empty array | ownership-022: needs an author edit to a vendored line |

These titles are the names at the time of the run. Later corrections renamed some titles; the tags are unchanged.

Each mutation ran against its named test and gave exit status 1.

The proof logs and pass2-proof.json are in /home/ianblenke/docker/gev-tools/ownership-gates/.

## Pass 2 image waiver needs

The ledger at tree a70c24e2a5836544b7490899e9d352cbb343d053 has these two owned branch gaps.

| File | Metric | Count | Current file hash |
|---|---|---:|---|
| scripts/spec/lib/test-guard.mjs | branches | 1 | 9451e6303105436c50adc39c30c65ef875c0871c318a6ca26a81e3a94f1ebe9f |
| src/layers/osh/index.js | branches | 1 | b995edb9d833d5661d0484c31a741131b3ea1439a56fa5d03aa24141bb3a8407 |

These titles are the names at the time of the run. Later corrections renamed some titles; the tags are unchanged.

If the image shows V8 artifacts, each file needs one waiver with metric branches and count 1 for its measured hash.

Each record also needs the change name, a reason and the positive source line numbers from the image report.

No image run occurred here. The ledger counts cannot give those line numbers or prove a V8 artifact.

The lead must use the image result to select the line numbers and assess the reason.

Both files still have their base content. The current waive command rejects a file with its base content.

Thus these are the record fields that the command needs, but the command cannot add those records to this change in its current form.

The lead must decide how to resolve this process conflict. Do not change code only to satisfy the instrument.

A true branch gap needs a test. No ledger edit or upstream adopt record can hide an owned gap.

## Pass 2 host checks

Node version: 26.8.2. Each test file runs in its own process on cores 4 through 7 with nice value 19.

| Test file | Tests | Pass | Fail |
|---|---:|---:|---:|
| ownership.test.mjs | 34 | 34 | 0 |
| ownershipGate.test.mjs | 12 | 12 | 0 |
| qaRegister.test.mjs | 39 | 39 | 0 |
| v8Merge.test.mjs | 11 | 11 | 0 |
| gates.test.mjs | 227 | 223 | 4 |

These titles are the names at the time of the run. Later corrections renamed some titles; the tags are unchanged.

The full legacy run finished with its test summary and exit status 1.

The failed cases are coverage-gate-024, spec-trace-039 spec-trace-040, coverage-gate-031 and coverage-gate-048.

These are the four cases from the pass 1 base probe. No new base probe ran in pass 2.

Both scripts that pass 2 changes have 100% line, branch and function coverage on the host.

| Script | Lines | Branches | Functions |
|---|---:|---:|---:|
| ownership.mjs | 100% | 100% | 100% |
| gates.mjs | 759/759 | 361/361 | 88/88 |

These titles are the names at the time of the run. Later corrections renamed some titles; the tags are unchanged.

The gate script counts use 305 actual V8 process records from the two gate test files.

The target-file reader checks only the gate script in those records. It does not use fixture measurements.

The ownership report comes from the final 34-test run.

The native format command stopped at Git EPERM. It has no format verdict.

The host shim reads the successful Git output from that error. The format check then passed for 1158 source files.

The STE lint passed with 0 errors. The final lint log gives the warning count.

No Docker, make, project gate CLI, ratchet, adopt, waive, push or gh command ran in pass 2.

The test fixtures call the gate functions to test their behavior in temporary repositories.

## Pass 2 source search

Tree read: a70c24e2a5836544b7490899e9d352cbb343d053, with the pass 2 edits.

The final source search gives these lines:

```
openspec/config.yaml:21:     For a sync, upstream source lines need no changed line coverage.
AGENTS.md:11:5. Keep each owned code file at 100% line, branch and function coverage. Keep each line that a change adds or edits at 100%, in every file. For a sync, upstream source lines need no changed line coverage. Rule 23 defines owned paths.
AGENTS.md:40:24. The review of a sync reads the files resolved by hand and the change documents. `review.md` lists the files resolved by hand under `Resolved files:`, or states `none`. For a sync, `Scope: full` covers those files and documents. After round one, `Scope: diff <hash>` stays valid.
AGENTS.md:41:A sync needs changed line coverage only for base diff lines that also differ from their adopted upstream source.
scripts/spec/lib/ownership.mjs:69:export function syncChangedLines({ root, base, files, history, baseHistory, change }) {
scripts/spec/lib/ownership.mjs:81:      const author = new Set(changedLines({ root, base: from, files: [file] })[file]);
scripts/spec/lib/ownership.mjs:82:      changed[file] = changed[file].filter(line => author.has(line));
scripts/spec/gates.mjs:2:import { readOwnership, ownershipAdvice, syncChangedLines, parseLineCoverage, coverageFaults, gapReport } from './lib/ownership.mjs';
scripts/spec/gates.mjs:570:      const scoped = syncChangedLines({ root, base, files: diffFiles.filter(file => measured.inventory.includes(file)), history: historyText, baseHistory: baseHistoryText, change });
```

## Pass 2 automatic mutations

Tree read: a70c24e2a5836544b7490899e9d352cbb343d053, with the pass 2 edits.

The current generator ran on ownership.mjs and gates.mjs only. It produced 7471 candidates.

The diff filter selected all 317 candidates whose spans touch the pass 2 script lines.

The tool copy uses the current generator classes and the pass 1 host process transport.

It runs each test file in its own process. The project clone is read-only.

Phase one used 32 ownership tests and 12 gate tests. Phase two used all 34 ownership tests and 12 gate tests.

New tests check the base history prefix, each last source, source types and an author rename.

Phase two has fresh baselines because the tests changed. The production source did not change between phases.

The two source-length survivors then ran with the one-character bad source test and no fast-test skips.

Both failed ownership-024: rejects absent and separate source commits.

| Run | Candidates | Killed | Passed | Crash | Timeout |
|---|---:|---:|---:|---:|---:|
| Fast phase | 317 | 257 | 57 | 3 | 0 |
| Full phase | 57 | 47 | 10 | 0 | 0 |
| Source-length follow-up | 2 | 2 | 0 | 0 | 0 |

These titles are the names at the time of the run. Later corrections renamed some titles; the tags are unchanged.

Final assessment: 306 killed, 3 crashes, 6 bounded equivalents and 2 known limits. No candidate remains without an assessment.

The three crashes change the JSON line separator. The tool reports their SyntaxError failures as crashes, separate from kills.

The crash IDs are a0492, a0493 and a0499. Their failed test names are in mutation-results-pass2.json.

The six equivalent probes passed all 28 cases. The bounds below state the input limits of each argument.

| ID | File and line | Assessment | Bound |
|---|---|---|---|
| a0625 | ownership.mjs:80 | EQUIVALENT | The match is an object or undefined. The fallback is an object from a nonempty array. |
| a0538 | ownership.mjs:72 | EQUIVALENT | The fixed Git tree gives one stable status per source. Repeat checks change only cost. |
| a0477 | ownership.mjs:70 | EQUIVALENT | History inputs are strings. The expression serves only as a conditional test. |
| a0515 | ownership.mjs:71 | EQUIVALENT | Records are plain JSON objects with no getters. Property reads have no side effects. |
| a0520 | ownership.mjs:71 | EQUIVALENT | Records are plain JSON objects with no getters. Property reads have no side effects. |
| a9618 | gates.mjs:571 | EQUIVALENT | Scoped fields are plain data. A log fault returns from the catch before the local value can matter. |
| a9058 | ownership.mjs:72 | Known limit | The suite does not pair an invalid source with a failed base diff. The first error can change. |
| a9495 | gates.mjs:567 | Known limit | The suite does not pair an invalid source with invalid base ledger JSON. The first error can change. |

These titles are the names at the time of the run. Later corrections renamed some titles; the tags are unchanged.

The probe source and results are pass2-equivalent-probes.mjs and pass2-equivalent-probes.json in the tool folder.

The mutation bundle records each source span, code edit, run status, failed test name and final assessment.

The lead must assess the two known limits during review.

## Pass 2 source hashes

| File | SHA-256 |
|---|---|
| scripts/spec/lib/ownership.mjs | 0f9e2fc8d8419b15e53953a2144c39cb8e21e3e9ea3a1014a8c104cb67b30c65 |
| scripts/spec/gates.mjs | 3c73ee46a6252220c006b7a94e2bc052ec3242926409a436ad9a08eb93e0d904 |
| src/tooling/spec/ownership.test.mjs | abb2b51930121340c1843859d0b6c833de269f593f606b30066198f2c60aeda6 |
| src/tooling/spec/ownershipGate.test.mjs | d368ca267cd91cd659c234eca4a5598f7e32a633f56fbea441d447d83c307aa5 |

These titles are the names at the time of the run. Later corrections renamed some titles; the tags are unchanged.

## Pass 2 commit

Implementation commit: f53f46a236840b5f553aa317b27a08624f3ee3c0.

The four tested source hashes match this commit.

This commit has the code, tests, AGENTS.md and config.yaml. The change documents follow in a separate commit.

## Pass 3

Tree read: 88894512ef934f160fbeebea551d6cd2607c9c43.

The lead changes the owned coverage rule. This decision replaces the pass 2 image waiver advice above.

The two unchanged owned files keep their recorded branch gaps. They need no waiver for this change.

The ledger comparison still rejects larger gaps. The report lists each owned gap.

Scenarios ownership-003, ownership-004, ownership-012 and ownership-024 have new scope or error order text.
Scenario ownership-004 now checks changed owned code and code without a ledger entry.
Scenarios ownership-026 through ownership-028 check the old, changed and new file cases.
Tasks now name each scenario from ownership-001 through ownership-028.

All host Node commands use taskset -c 4-7 nice -n 19. Node is 26.8.2.

The ownership test command is node --experimental-test-coverage --test-coverage-include='**/scripts/spec/lib/ownership.mjs' src/tooling/spec/ownership.test.mjs.
It passes 35 tests. The report has 100% line, branch and function coverage for ownership.mjs.

The gate test command is node --import /home/ianblenke/docker/gev-tools/ownership-gates/host.mjs src/tooling/spec/ownershipGate.test.mjs.
It passes 18 tests. Each test file has its own process.

The QA test command is node src/tooling/spec/qaRegister.test.mjs. It passes 39 tests.

The three test files clear inherited Git variables and set fixed config paths, identity, trust and locale.
Every Git init selects main. Each direct Git call that writes commits has identity options.
Temporary repositories set cwd for each call. Gate Git calls use the same fixed process environment.

The native npm run format:check stops at Git EPERM. It has no format verdict.
The same command with NODE_OPTIONS=--import=/home/ianblenke/docker/gev-tools/ownership-gates/pass2-format-shim.mjs checks 1158 source files.

The command node scripts/spec/gates.mjs lint --change ownership-scoped-gates reports 0 errors and 542 warnings.

| Mutation | Failed test |
|---|---|
| Treat unchanged as changed | ownership-026 checks an old owned gap |
| Drop the changed check | ownership-027 checks an old owned gap |
| Drop the report line | ownership-026 checks an old owned gap |

These titles are the names at the time of the run. Later corrections renamed some titles; the tags are unchanged.

Each mutation runs node --import host.mjs --test-name-pattern=ownership-NNN src/tooling/spec/ownershipGate.test.mjs in the scratch copy.
The scratch copy has no branch. Its source is commit 88894512 with the pass 3 edits.
The file pass3-proof.json records three exit values of 1 and the failed test names.

The first test for a new file failed because the file had no Git record. The final test stages the new file.

The lead must run make ratchet CHANGE=ownership-scoped-gates in the image.
Expect only REVIEW-MISSING. The two unchanged owned files must give no COVERAGE-OWNED error.
The lead runs review and final gates. This change stays active.

The final file mode test checks Git output: zero changed lines and mode change 100644 to 100755.
The test proves that a mode change does not change the code content.

The final source search is rg -n for spawnSync Git calls and Git init calls in the three changed test files.
The output in pass3-source-search.log shows identity options on the conflict merge at ownership.test.mjs:240.
It also shows main on both local Git init calls. The gate fixture init selects main too.

The full legacy command is node --import /home/ianblenke/docker/gev-tools/ownership-gates/host.mjs src/tooling/spec/gates.test.mjs.
It finishes with 227 tests, 223 passes and four failures. It has exit status 1.
The four IDs are coverage-gate-024, spec-trace-039/spec-trace-040, coverage-gate-031 and coverage-gate-048.
These are the four host adapter failures that the pass 1 base probe and pass 2 run record.

The coverage command is node host-coverage.mjs scripts/spec/gates.mjs raw-pass3-gate raw-pass3-gate-final in the tool folder.
It reads 305 actual process records. It reports 760/760 lines, 366/366 branches and 89/89 functions.
Both changed scripts have 100% line, branch and function coverage on the host.

The command node pass3-equivalent-probes.mjs passes 39 cases for five pure order mutants.
The probe inputs have plain JSON records, string paths, arrays and no getters.
The coverage fault set stays equal. The specification does not set the order of coverage faults.
The command condition gives the same result for seven command names.

The new ownership-024 test checks source faults before invalid base ledger JSON.
It closes that pass 2 test limit. The source fault with a base diff fault remains outside the focused suite.

## Pass 3 automatic mutations

Source commit: 3a72f0f21b160c6c2a9cdabede2df2dda7ec2c23.

The current tool command is node automut.mjs gen with this clone root and ownership.mjs and gates.mjs as files.
It produces 7681 candidates. The diff filter against 88894512 selects 129 candidates that touch pass 3 script lines.
The 129 code edits match the local transport copy set. The ID map links both sets by file, span and code edit.

The local tool copy runs each test file in its own process. It uses the pass 1 host transport.
The command uses run with the clone root, both ownership test files, phase 1, jobs 2 and slow-ms 1000.

Phase 2 uses the same files, jobs 2 and all tests. It has no fast-test skips.
The follow-up uses ten recorded phase-one passes and fresh baselines for the final tests.
Its run command uses phase 2, jobs 2 and resume.

It runs all 35 ownership tests and 18 gate tests.

| Named run | Candidates | Killed | Passed | Crash | Timeout |
|---|---:|---:|---:|---:|---:|
| pass3-p1.log | 129 | 61 | 68 | 0 | 0 |
| pass3-p2.log | 68 | 53 | 15 | 0 | 0 |
| pass3-followup.log | 10 | 9 | 0 | 1 | 0 |

These titles are the names at the time of the run. Later corrections renamed some titles; the tags are unchanged.

Final result: 123 killed, one crash, five bounded equivalents and zero timeouts. No candidate lacks an assessment.

The crash is a9624. The test ownership-024 checks the source before a bad base ledger and fails with SyntaxError.
The tool records that test failure as CRASH. It is separate from the kill total.
Seven follow-up mutants fail ownership-026 with the new file mode test.
The other two kills concern bad history before gap advice and advice before a diff fault.

| Current ID | Local ID | Assessment | Bound |
|---|---|---|---|
| a0946 | a0946 | EQUIVALENT | Both checks read plain records and arrays with no getters. |
| a9223 | a1404 | EQUIVALENT | The fault set stays equal. The spec does not set its order. |
| a9227 | a1408 | EQUIVALENT | Both skip checks read plain records and arrays with no getters. |
| a9228 | a1409 | EQUIVALENT | A waiver filter reads plain JSON records and has no side effects. |
| a5241 | a5385 | EQUIVALENT | The command is a string. Either check order selects check and ratchet. |

These titles are the names at the time of the run. Later corrections renamed some titles; the tags are unchanged.

The probe command passes 39 cases. mutation-results-pass3.json records each edit, status, failed test name and assessment.
The tool folder has the full commands, logs, ID map, final result file and probe source.

The image log own1-ratchet.log starts with the Docker ratchet command and reports QA: no script covers this change.
No listed QA purpose conflicts with this spec. This pass starts no container and runs no project gate CLI except lint.

## Pass 3 source hashes

| File | SHA-256 |
|---|---|
| scripts/spec/gates.mjs | a6406d53af498f3834add87e4ff8c742dca9fdcc5f4f10deaa3ae05e95555b74 |
| scripts/spec/lib/ownership.mjs | 3b4ed68932e269b91e522bf1c9a295eea0e5127fa3323dce0ac14356101c6c51 |
| src/tooling/spec/ownership.test.mjs | fe749be37d90a196e10512484336d926d37480298db0b48e7f2de9bd1cee49d1 |
| src/tooling/spec/ownershipGate.test.mjs | 79b17016f38e33c5c21d2466eeeadbd3a1bc810bb56ea18a5428836798308c31 |
| src/tooling/spec/qaRegister.test.mjs | 4bf29fc98c16f84eff64866986e0872b0bd89deeb1ae44f68cde94abe3d930ad |

These titles are the names at the time of the run. Later corrections renamed some titles; the tags are unchanged.


## Pass 4

The merge parent rule replaces the ancestor rule of pass 2.

Tree read: bf174f99d5eb799c0f3fd17648b5b6042dab1402, branch ownership-gates.
The corrections use the lead decisions The pass 4 decisions in design.md. The round 1 reports stay unchanged.
New scenario IDs are ownership-029 through ownership-053.

### Round 1 spec findings

| First words | Correction | Tree read |
| --- | --- | --- |
| A one-line hand-written history entry | Use adoptsOf and the shared isAdoptSource predicate. Stop with LEDGER-ADOPT-FROM for a record with no string file or no merged source. | bf174f99 |
| The QA synthetic header is open | Use only a base script without a QA tag, or a valid adopt file. | bf174f99 |
| Scenario ownership-012 is unmet | AGENTS.md and config.yaml state the no-ledger case. The test asserts both texts. | bf174f99 |
| The manifest is read only | Read the base manifest and use its union with the current manifest. Test the real sentinel paths. | bf174f99 |
| changedLines uses the default | Set maxBuffer to 268435456 bytes. The spawn test asserts that literal. | bf174f99 |
| HTML and shell files | Keep the code. Name the remedy html-shell-line-data and the rule 18 lead notice in Known limits. | bf174f99 |
| Three tags do not match | Remove the three wrong tags. Add ownership-037 and ownership-038 for the stop order. | bf174f99 |
| The AND line of ownership-020 | Name the literal COVERAGE-DIFF log line in a text block. | bf174f99 |
| Survivor class L4 | Add ownership-053 for ci and init with a recorded owned gap. Both cases pass. | bf174f99 |
| Each sync change uses adopt | Say each file that the merge brings and that has a coverage gap. | bf174f99 |
| The manifest check accepts entries | Name paths that match no file in Known limits. The owner reviews each manifest diff. | bf174f99 |

These titles are the names at the time of the run. Later corrections renamed some titles; the tags are unchanged.

### Round 1 STE findings

| ID | First words | Correction | Tree read |
| --- | --- | --- | --- |
| S1 | the report and Ownership advice | Use owned gap advice for the gapReport output. | bf174f99 |
| S2 | the line needs coverage | Name the base and the adopt source. Rename the two data headings. | bf174f99 |
| S3 | Scenario ownership-012 | Use the correct subject and the no-ledger owned case. | bf174f99 |
| S4 | upstream source lines | Use the same adopted source sentence in AGENTS.md and config.yaml. | bf174f99 |
| S5 | Keep each line | Limit line coverage to code files. State the full owned coverage rule. | bf174f99 |
| S6 | The report lists | Name the report command and add it to the Gates table. | bf174f99 |
| S7 | A backfill is | State that a backfill adds specs and tests for old code that another change needs. | bf174f99 |
| S8 | Each sync change | Use adopt for files that the merge brings and that have a coverage gap. | bf174f99 |
| S9 | an adopt source is absent | Name a source commit that the repository lacks or that no merge after the base brought. | bf174f99 |
| S10 | reject has two meanings | Use ignore for skipped records and stop for source errors. | bf174f99 |
| S11 | The qa-scripts no-change advice | Name qa-scripts-019, qa-scripts-002 and qa-scripts-003. Bound the QA exception. | bf174f99 |
| S12 | repair has two meanings | Use resolved by hand for a conflict. State the rule for a scenario that a sync breaks. | bf174f99 |
| S13 | use 1 for a covered line | State DA counts 1 and 0. The test uses a V8 hit count of 5. | bf174f99 |
| S14 | changed has two meanings | Use paths in the diff for class output and changed code for content changes. | bf174f99 |
| S15 | A task with two instructions | Split each task into one instruction. | bf174f99 |
| S16 | needs the manual conflict | Say needs coverage for the line or edit. | bf174f99 |
| S17 | fixes the process boundary | Say has the process rules in AGENTS.md and config.yaml. | bf174f99 |
| S18 | checks an old owned gap | Name acceptance for unchanged code and rejection for edited code. | bf174f99 |
| S19 | Approved words | Use strict checks, show, and the Node version in .node-version. Clarify the mutation line limit. | bf174f99 |
| S20 | One word one meaning | Use final code, QA exception, and the list of files that a person resolved by hand. | bf174f99 |
| S21 | A move can add | Use active verbs and shorter noun groups. | bf174f99 |
| S22 | Approved words | Use keep, find, the register function, and a nonempty from value. | bf174f99 |
| S23 | One word one meaning | Use LCOV records, code commit, QA advisory, and resolved by hand. | bf174f99 |
| S24 | Verbs and voice | Name the ratchet command, QA-HEADER, and the commands that give the line sets. | bf174f99 |
| S25 | existing | Use the text diff rule. | bf174f99 |
| S26 | Instructions | Split tasks and state the code check action. | bf174f99 |
| S27 | including | Use with and active prose. Keep the old command output unchanged. | bf174f99 |
| S28 | Words and articles | Clarify path safety, waiver conditions, header position, values and the report subject. | bf174f99 |
| S29 | Terms and references | Use test instances, adopt source, and the upstream project. | bf174f99 |
| S30 | Rule 22 | Bound the header exception, name the proposal, use active review prose, and state the scenario instruction. | bf174f99 |
| S31 | All owned JS code | Use owned code files and the adopt instruction. | bf174f99 |
| S32 | Purpose | The lead set the applied Purpose after the archive. Pass 5 has no applied ownership spec after the lead restored the base specs. | bf174f99 |
| S33 | Test titles | Use plain verbs and name the line rule, character ranges and adopt source. | bf174f99 |
| S34 | Test titles | Remove command subjects and name the ratchet command and QA-HEADER. | bf174f99 |
| S35 | Test titles | Name each header error and use shebang. | bf174f99 |
| S36 | Gate messages | Clarify the synthetic header covers item. Keep the old plural style, as the lead directs. | bf174f99 |

These titles are the names at the time of the run. Later corrections renamed some titles; the tags are unchanged.

Pass 4 applied the replacements listed in its table. No unclear replacement remains under prose faults.
The lead set the applied Purpose after the archive. S36 keeps the plural style that the lead names.

### Fault tests and named mutations

The two red commands run on the code before correction:

```sh
taskset -c 4-7 nice -n 19 node --test-name-pattern='ownership-029|ownership-03[1-6]' src/tooling/spec/ownership.test.mjs
taskset -c 4-7 nice -n 19 node --test-name-pattern='ownership-03[45]' src/tooling/spec/qaRegister.test.mjs
```

The first command has 5 failed tests. The second has 2 failed tests.
The logs are /tmp/pass4-red-own.log and /tmp/pass4-red-qa.log.
A command with --test stopped at the host child process adapter before test details. It gives no scenario verdict.

The named mutation command is python /tmp/pass4-named.py.
It writes only an isolated copy under the tool folder. The project clone stays unchanged.
Each row has exit status 1 and names the failed test in named-results.json.

| Fault | Failed test |
| --- | --- |
| Accept an incomplete source record at HEAD | ownership-031 |
| Remove the merge parent check for a work commit | ownership-032 |
| Remove the merge parent check for an ancestor | ownership-033 |
| Give a new script the synthetic header | ownership-034 |
| Give a script with a deleted base header the synthetic header | ownership-035 |
| Drop the base manifest paths | ownership-029 |
| Drop maxBuffer from Git diff | ownership-036 |

These titles are the names at the time of the run. Later corrections renamed some titles; the tags are unchanged.

The other ownership-031 test uses a valid merged source with absent ledger fields.
An absent file stops the run. Invalid count fields give no source and keep the base diff rule.
It also checks a short hash of a valid merged source.

### Correction search

Tree read: 799372f0 with the pass 4 documents.
The command uses rg -n with the correction terms over code, tests and process files.
The output is in pass4/source-search-final.log in the tool folder.
The command is in /tmp/pass4-refresh-search.py.

```text
src/tooling/spec/ownershipGate.test.mjs:128:test('[ownership-001] stops the gate for an absent manifest', () => withFixture(root => {
src/tooling/spec/ownershipGate.test.mjs:135:test('[ownership-011] reads the ledger without tests or a base', () => withFixture(root => {
src/tooling/spec/ownershipGate.test.mjs:139:  assert.equal(result.output, 'Owned gaps: 0 code files, 0 lines, 0 test files, 0 tests.\nUpstream gaps: 0 code files, 0 lines, 0 test files, 0 tests.');
src/tooling/spec/ownershipGate.test.mjs:145:test('[ownership-003 ownership-007] prints classes and rejects an upstream line gap', () => withFixture(root => {
src/tooling/spec/ownershipGate.test.mjs:157:test('[ownership-003 ownership-004] rejects an owned gap before the ratchet command writes the ledger', () => withFixture(root => {
src/tooling/spec/ownershipGate.test.mjs:169:test('[ownership-007] rejects changed upstream lines', () => withFixture(root => {
src/tooling/spec/ownershipGate.test.mjs:184:test('[ownership-026] records a gap before the owned file check', () => withFixture(root => {
src/tooling/spec/ownershipGate.test.mjs:204:test('[ownership-037] stops when Git cannot read a code diff', () => withFixture(root => {
src/tooling/spec/ownershipGate.test.mjs:219:    assert.match(result.output, /Owned gaps: 0 code files/);
src/tooling/spec/ownershipGate.test.mjs:226:test('[ownership-009 ownership-013] uses the manifest and snapshot line data', () => withFixture(root => {
src/tooling/spec/ownershipGate.test.mjs:235:  assert.match(ratchet.output, /QA: scripts\/qa-upstream.mjs uses the synthetic header with the covers item unmapped: upstream\./);
src/tooling/spec/ownershipGate.test.mjs:241:  assert.match(docs.output, /QA: scripts\/qa-upstream.mjs uses the synthetic header with the covers item unmapped: upstream\./);
src/tooling/spec/ownershipGate.test.mjs:245:test('[ownership-013] accepts an absent line report', () => withFixture(root => {
src/tooling/spec/ownershipGate.test.mjs:251:test('[ownership-011] uses the manifest for ledger paths', () => withFixture(root => {
src/tooling/spec/ownershipGate.test.mjs:255:  assert.equal(result.output, 'Owned gaps: 1 code files, 2 lines, 0 test files, 0 tests.\nowned code: src/math.js\nUpstream gaps: 0 code files, 0 lines, 0 test files, 0 tests.');
src/tooling/spec/ownershipGate.test.mjs:257:test('[ownership-010] still reports QA-HEADER errors', () => withFixture(root => {
src/tooling/spec/ownershipGate.test.mjs:266:test('[ownership-020 ownership-022] accepts merged lines and rejects an author line', () => withFixture(root => {
src/tooling/spec/ownershipGate.test.mjs:304:      assert.match(result.output, /Owned gaps: 1 code files/);
src/tooling/spec/ownershipGate.test.mjs:308:      assert.match(ratchet.output, /Owned gaps: 1 code files/);
src/tooling/spec/ownershipGate.test.mjs:313:test('[ownership-028] rejects a new owned gap without a ledger entry', () => withFixture(root => {
src/tooling/spec/ownershipGate.test.mjs:325:test('[ownership-031 ownership-024] checks the adopt source commit before a bad base ledger', () => withFixture(root => {
src/tooling/spec/ownershipGate.test.mjs:337:test('[ownership-038] rejects bad history before gap advice', () => withFixture(root => {
src/tooling/spec/ownershipGate.test.mjs:347:test('[ownership-029] stops an invalid base manifest before the test run', () => withFixture(root => {
src/tooling/spec/ownershipGate.test.mjs:356:test('[ownership-029 ownership-027] rejects a gap after its base owned path is removed', () => withFixture(root => {
src/tooling/spec/ownershipGate.test.mjs:369:test('[ownership-039] stops a work source in the adopt command', () => withFixture(root => {
src/tooling/spec/ownershipGate.test.mjs:380:test('[ownership-040] uses the CI change for an adopted QA file', () => withFixture(root => {
src/tooling/spec/ownershipGate.test.mjs:394:  assert.match(result.output, /QA: scripts\/qa-merge.mjs uses the synthetic header with the covers item unmapped: upstream\./);
src/tooling/spec/ownershipGate.test.mjs:398:test('[ownership-038] stops bad JSON without a change before gap advice', () => withFixture(root => {
src/tooling/spec/ownershipGate.test.mjs:407:test('[ownership-042] skips a base adopt record before the test run', () => withFixture(root => {
src/tooling/spec/ownershipGate.test.mjs:419:test('[ownership-044] uses an adopted QA header with a snapshot', () => withFixture(root => {
src/tooling/spec/ownershipGate.test.mjs:434:  assert.match(result.output, /QA: scripts\/qa-merge.mjs uses the synthetic header with the covers item unmapped: upstream\./);
src/tooling/spec/ownershipGate.test.mjs:439:test('[ownership-045] names the measurement phase', () => withFixture(root => {
src/tooling/spec/ownershipGate.test.mjs:450:test('[ownership-046] stops an absent adopt source commit', () => withFixture(root => {
src/tooling/spec/ownershipGate.test.mjs:458:test('[ownership-047] stops a valid adopt source without a ledger', () => withFixture(root => {
src/tooling/spec/ownershipGate.test.mjs:471:test('[ownership-048] passes the measurement environment and allocation list', () => withFixture(root => {
src/tooling/spec/ownershipGate.test.mjs:487:test('[ownership-049] stops an untraced change scenario in both measurement modes', () => withFixture(root => {
src/tooling/spec/ownershipGate.test.mjs:510:test('[gap-ledger-111] stops an invalid baseline before the test run', () => withFixture(root => {
src/tooling/spec/ownershipGate.test.mjs:523:test('[ownership-053] omits class and gap advice from CI and init', () => withFixture(root => {
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:3:### Requirement: Manifest contract
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:5:A safe path has only ASCII letters, digits, underscores, dots, hyphens and slashes.
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:9:#### Scenario: Read a manifest `ownership-001`
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:14:### Requirement: Path class
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:18:#### Scenario: Classify paths `ownership-002`
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:23:### Requirement: Class output
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:29:#### Scenario: Show path classes `ownership-003`
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:30:- **WHEN** check or ratchet has paths in the diff
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:33:#### Scenario: Omit advice from CI and init `ownership-053`
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:37:### Requirement: Owned coverage
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:38:The gate MUST reject gaps in changed owned code files and owned code files without a ledger entry, except valid waivers.
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:42:#### Scenario: Check owned gaps `ownership-004`
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:43:- **WHEN** a changed owned code file or an owned code file without a ledger entry has a gap
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:44:- **THEN** the gate reports COVERAGE-OWNED unless valid waivers waive all gap counts
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:46:### Requirement: Diff ranges
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:47:The gate MUST select the added line ranges of each current code file against the base.
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:50:#### Scenario: Read diff lines `ownership-005`
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:54:### Requirement: Line records
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:58:#### Scenario: Read line counts `ownership-006`
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:62:### Requirement: Diff coverage
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:66:#### Scenario: Check line gaps `ownership-007`
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:70:### Requirement: Line waivers
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:74:#### Scenario: Check line waivers `ownership-008`
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:82:### Requirement: QA exception
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:94:The scenario qa-scripts-019 does not apply to a synthetic header: the gate prints the synthetic header advisory when no change name is given. The scenarios qa-scripts-002 and qa-scripts-003 do not apply within this exception.
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:98:#### Scenario: Use an upstream header `ownership-009`
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:101:- **THEN** the register uses the covers item `unmapped: upstream` and prints an advisory
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:103:### Requirement: QA boundary
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:107:#### Scenario: Reject a bad QA header `ownership-010`
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:111:### Requirement: Gap report
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:115:#### Scenario: Report gap classes `ownership-011`
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:119:### Requirement: Process boundary
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:123:#### Scenario: Read the process rules `ownership-012`
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:125:- **THEN** the text says that a changed owned code file and an owned code file without a ledger entry need full coverage
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:127:- **AND** review.md lists the files that a person resolved by hand
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:129:### Requirement: Line data
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:134:#### Scenario: Keep line data `ownership-013`
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:136:- **THEN** covered lines have the DA count 1 and uncovered lines have the DA count 0
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:139:### Requirement: Test instance total
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:143:#### Scenario: Count test instances `ownership-014`
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:147:### Requirement: QA header block
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:151:#### Scenario: Accept an upstream comment block `ownership-015`
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:156:### Requirement: Numeric line order
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:160:#### Scenario: Sort line numbers `ownership-016`
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:164:### Requirement: Exact line records
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:168:#### Scenario: Ignore extra record text `ownership-017`
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:172:### Requirement: Gap totals
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:176:#### Scenario: Add gap and waiver counts `ownership-018`
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:180:### Requirement: Empty test names
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:184:#### Scenario: Count an empty name map `ownership-019`
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:188:### Requirement: Sync line scope
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:191:A file uses its last adopt source in the change, or the last source in the change if it has none.
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:192:Each adopt source must come from a record that passes the ledger record checks. Its `from` commit must be a parent, other than the first parent, of a merge commit after the base commit.
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:195:#### Scenario: Exempt upstream lines `ownership-020`
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:196:- **WHEN** a merge brings 5 code lines equal to the adopt source
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:204:#### Scenario: Check a conflict that a person resolved by hand `ownership-021`
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:205:- **WHEN** a person resolves a conflict and line 1 of the result differs from the base and the adopt source
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:209:#### Scenario: Check an edit to vendored code `ownership-022`
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:211:- **THEN** the line needs coverage if it differs from the base and from the adopt source
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:212:- **AND** other lines that equal the adopt source need no changed line coverage
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:214:#### Scenario: Select each file source `ownership-023`
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:215:- **WHEN** a change has more than one adopt source
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:216:- **THEN** each file uses its last adopt source and other files use the last source
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:219:#### Scenario: Reject an invalid source `ownership-024`
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:220:- **WHEN** an adopt source commit is not in the repository or is not a merge parent after the base
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:222:- **AND** a change with no adopt source keeps the base diff rule
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:225:#### Scenario: Check current code paths `ownership-025`
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:226:- **WHEN** the upstream project deletes or renames a code file
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:227:- **THEN** deleted paths have no new lines and new paths use the same path in the adopt source without rename detection
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:230:#### Scenario: Keep an old owned gap `ownership-026`
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:231:- **WHEN** an unchanged owned code file has a recorded gap
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:236:#### Scenario: Reject a changed owned gap `ownership-027`
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:237:- **WHEN** a changed owned code file has a recorded gap
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:240:#### Scenario: Reject a new owned gap `ownership-028`
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:241:- **WHEN** a new owned code file has a gap and no ledger entry
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:244:### Requirement: Base ownership
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:248:#### Scenario: Keep base owned paths `ownership-029`
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:254:#### Scenario: Check the project manifest `ownership-030`
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:258:### Requirement: Adopt record boundary
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:262:Other records that adoptsOf does not accept give no source.
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:265:#### Scenario: Stop a record without a file `ownership-031`
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:274:#### Scenario: Stop a work branch source `ownership-032`
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:278:#### Scenario: Stop an ancestor without a merge `ownership-033`
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:282:#### Scenario: Stop a number in the source field `ownership-041`
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:287:#### Scenario: Stop a later invalid record `ownership-050`
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:291:#### Scenario: Stop a source name with a null byte `ownership-052`
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:293:- **THEN** the gate gives LEDGER-ADOPT-FROM with the same message as ownership-031
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:295:### Requirement: QA exception boundary
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:299:#### Scenario: Stop a new script without a header `ownership-034`
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:303:#### Scenario: Stop a deleted header `ownership-035`
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:307:### Requirement: Diff process bounds
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:311:#### Scenario: Set the diff buffer `ownership-036`
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:313:- **THEN** maxBuffer is 268435456 bytes
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:315:### Requirement: Gate order
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:319:#### Scenario: Stop a failed diff `ownership-037`
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:323:#### Scenario: Stop bad history before advice `ownership-038`
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:329:#### Scenario: Stop a source fault before a diff fault `ownership-051`
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:330:- **WHEN** an adopt source is invalid and Git cannot read the diff
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:333:### Requirement: Adopt command source
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:337:#### Scenario: Stop a work source in the adopt command `ownership-039`
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:347:### Requirement: CI source scope
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:348:CI MUST use its selected change name for the adopt source list before the measurement.
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:351:#### Scenario: Use the CI change for QA sources `ownership-040`
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:356:### Requirement: Base history scope
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:357:The adopt source check MUST read only records after the base history prefix.
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:360:#### Scenario: Skip a base adopt record `ownership-042`
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:365:### Requirement: Adopt records outside this change
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:369:#### Scenario: Skip records outside this change `ownership-043`
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:373:### Requirement: Snapshot QA source scope
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:377:#### Scenario: Use an adopt source with a snapshot `ownership-044`
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:386:### Requirement: Measurement phase name
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:390:#### Scenario: Name the measurement phase `ownership-045`
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:394:### Requirement: Adopt input faults
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:398:#### Scenario: Stop an absent adopt commit `ownership-046`
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:402:#### Scenario: Stop an absent adopt ledger `ownership-047`
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:406:### Requirement: Measurement inputs
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:410:#### Scenario: Pass the measurement inputs `ownership-048`
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:415:### Requirement: Selected change trace
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:419:#### Scenario: Stop an untraced change scenario `ownership-049`
openspec/changes/ownership-scoped-gates/design.md:5:The owner needs whole-file coverage for changed owned code and owned code without a ledger entry. Each changed line needs coverage.
openspec/changes/ownership-scoped-gates/design.md:31:Apply both coverage checks after the measurement and before the ratchet command writes the files.
openspec/changes/ownership-scoped-gates/design.md:35:Use COVERAGE-OWNED for a changed owned file gap or an owned file without a ledger entry. Use COVERAGE-DIFF for uncovered changed lines.
openspec/changes/ownership-scoped-gates/design.md:57:Print a QA advisory for each synthetic header, even without a change name.
openspec/changes/ownership-scoped-gates/design.md:59:The scenarios qa-scripts-002 and qa-scripts-003 do not apply within the QA exception.
openspec/changes/ownership-scoped-gates/design.md:63:The scenario qa-scripts-019 does not apply to a synthetic header. The gate prints the synthetic header advisory when no change name is given.
openspec/changes/ownership-scoped-gates/design.md:71:AGENTS.md says that review.md lists the files that a person resolved by hand under Resolved files:, or states none.
openspec/changes/ownership-scoped-gates/design.md:75:Use a documented rule because Git cannot find every line that a person resolved by hand from a merge commit.
openspec/changes/ownership-scoped-gates/design.md:97:Use only records that adoptsOf accepts for this change after the unchanged base history prefix.
openspec/changes/ownership-scoped-gates/design.md:101:Use isAdoptSource for the adopt command, checkAdopts and syncChangedLines. It checks mergeParents(root, base).has(resolveCommit(root, from)).
openspec/changes/ownership-scoped-gates/design.md:104:Other records that adoptsOf does not accept give no source.
openspec/changes/ownership-scoped-gates/design.md:106:A is the set of new-side line numbers in the base diff. B is the set of those in the adopt source diff.
openspec/changes/ownership-scoped-gates/design.md:120:Binary code files use the text diff rule. Binary non-code files do not enter the code inventory.
openspec/changes/ownership-scoped-gates/design.md:132:Check whole-file coverage for owned code that differs from its base content, or has no ledger entry.
openspec/changes/ownership-scoped-gates/design.md:142:Pass 3 code commit: 3a72f0f21b160c6c2a9cdabede2df2dda7ec2c23.
openspec/changes/ownership-scoped-gates/design.md:163:The host mutation copy has no Git index. Its QA run omits qa-scripts-023, the project inventory test.
openspec/config.yaml:18:  4. Each owned code file that a change adds or edits needs 100% line, branch and function coverage.
openspec/config.yaml:19:     Each owned code file without a ledger entry also needs full coverage.
openspec/config.yaml:20:     The command node scripts/spec/gates.mjs report lists owned gaps in files that the change does not edit.
openspec/config.yaml:22:     A changed line needs line coverage in every code file.
openspec/config.yaml:36:  - Do not change an ID or use it again. If you remove a scenario, retire its ID.
openspec/config.yaml:60:    - 'Do not change a scenario ID or use it again. Retire the ID of a removed scenario.'
AGENTS.md:11:5. Keep each owned code file that a change adds or edits at 100% line, branch and function coverage. Each owned code file without a ledger entry also needs full coverage. The command `node scripts/spec/gates.mjs report` lists the owned gaps in files that the change does not edit. The target is zero owned gaps. Keep 100% line coverage for each line that a change adds or edits in a code file. For a sync, a changed line needs no coverage when it equals the adopted upstream source.
AGENTS.md:35:Use `adopt` for each file that the merge brings and that has a coverage gap.
AGENTS.md:37:22. For a spec change, read the QA lines in the gate output. Avoid a conflict with a listed purpose. Add a header to each new QA script that the fork writes. The gate gives a header to an upstream QA script with no QA tag in its first comment block in two cases. The script exists at the base without a QA tag, or a valid adopt record names it. The covers item is `unmapped: upstream`.
AGENTS.md:39:23. `openspec/ownership.json` lists the owned paths. For each new code file, add its path to the manifest or state the reason for its upstream class in the proposal.
AGENTS.md:40:24. For a sync, the two review agents read the files that a person resolved by hand and the change documents. `review.md` lists the files that a person resolved by hand under `Resolved files:`, or states `none`. For a sync, `Scope: full` covers those files and documents. After round one, `Scope: diff <hash>` stays valid.
AGENTS.md:42:25. When a sync breaks a test with a scenario ID for upstream code, retire the scenario or write it again. State the choice in the proposal.
AGENTS.md:48:The gates run on the Node version in `.node-version`. Use the Docker image, because other Node versions give different coverage counts.
AGENTS.md:52:| `node scripts/spec/gates.mjs report` | List owned and upstream gaps without a test run |
AGENTS.md:61:A gap is a code file below 100% coverage or a test without a scenario ID. The file `openspec/trace/gaps.json` records each open gap. The gates stop the build in these conditions:
AGENTS.md:70:2. Do the tasks in order. Write each test before its code. Commit each file outside openspec/changes/, openspec/specs/ and openspec/trace/. Commit code files and test files before the ratchet command.
AGENTS.md:72:4. Read the ratchet verdict. Correct each error, except the review errors. Use `make gates-docs CHANGE=<name>` when each changed file lies under the three allowed paths. The command also refuses changed code files and test files under those paths.
AGENTS.md:79:A backfill is a change that adds specs and tests for old code that another change needs.
AGENTS.md:81:A backfill change adds specs and tests for old code. Its name is `backfill-<capability>`.
AGENTS.md:83:1. Select one capability and its code files from `openspec/trace/gaps.json`.
AGENTS.md:96:When a code file or test file changes, use another ratchet command or all gates.
src/tooling/spec/qaRegister.test.mjs:34:  assert.deepEqual(result.errors, [{ code: 'QA-HEADER', file: FILE, message: 'scripts/qa-example.mjs: add one first block with one nonempty line for each QA tag and valid covers items.' }]);
src/tooling/spec/qaRegister.test.mjs:38:test('[qa-scripts-001] accepts a shebang and reads all four tags', () => fixture(({ put, scan }) => {
src/tooling/spec/qaRegister.test.mjs:45:test('[qa-scripts-002] rejects code before the first block', () => fixture(({ put, scan }) => { put(FILE, `export {};\n${header()}`); headerError(scan()); }));
src/tooling/spec/qaRegister.test.mjs:46:test('[qa-scripts-003] rejects an absent tag', () => fixture(({ put, scan }) => { put(FILE, header().replace(' * @needs A browser and a server.\n', '')); headerError(scan()); }));
src/tooling/spec/qaRegister.test.mjs:47:test('[qa-scripts-004] rejects a repeated tag', () => fixture(({ put, scan }) => { put(FILE, header().replace(' * @covers', ' * @purpose Another purpose.\n * @covers')); headerError(scan()); }));
src/tooling/spec/qaRegister.test.mjs:48:test('[qa-scripts-005] rejects an empty tag', () => fixture(({ put, scan }) => { put(FILE, header().replace('@run node scripts/qa-example.mjs', '@run ')); headerError(scan()); }));
src/tooling/spec/qaRegister.test.mjs:49:test('[qa-scripts-006] rejects a covers item with a space', () => fixture(({ put, scan }) => { put(FILE, header('pending:example, pending:other')); headerError(scan()); }));
src/tooling/spec/qaRegister.test.mjs:50:test('[qa-scripts-007] accepts a capability folder', () => fixture(({ put, scan }) => { put(FILE, header('example')); put('openspec/specs/example/spec.md'); assert.deepEqual(scan().errors, []); }));
src/tooling/spec/qaRegister.test.mjs:51:test('[qa-scripts-008] reports an unknown capability', () => fixture(({ put, scan }) => { put(FILE, header('example')); assert.deepEqual(scan().errors, [{ code: 'QA-COVERS-UNKNOWN', file: FILE, message: 'scripts/qa-example.mjs: example has no capability folder in openspec/specs/.' }]); }));
src/tooling/spec/qaRegister.test.mjs:52:test('[qa-scripts-009] accepts an open pending area', () => fixture(({ put, scan }) => { put(FILE, header('pending:example')); assert.deepEqual(scan().errors, []); }));
src/tooling/spec/qaRegister.test.mjs:53:test('[qa-scripts-010] reports a pending area that has a capability folder', () => fixture(({ put, scan }) => { put(FILE, header('pending:example')); put('openspec/specs/example/spec.md'); assert.deepEqual(scan().errors, [{ code: 'QA-COVERS-LANDED', file: FILE, message: 'scripts/qa-example.mjs: replace pending:example with example; its capability folder exists.' }]); }));
src/tooling/spec/qaRegister.test.mjs:54:test('[qa-scripts-011] accepts one unmapped reason', () => fixture(({ put, scan }) => { put(FILE, header('unmapped: No area fits this check')); assert.deepEqual(scan().errors, []); }));
src/tooling/spec/qaRegister.test.mjs:55:test('[qa-scripts-012] rejects an unmapped list', () => fixture(({ put, scan }) => { put(FILE, header('unmapped: reason,pending:example')); headerError(scan()); }));
src/tooling/spec/qaRegister.test.mjs:56:test('[qa-scripts-016] gives delta advice with the script purpose', () => fixture(({ root, put, scan }) => { put(FILE, header('example')); put('openspec/specs/example/spec.md'); put('openspec/changes/add-example/specs/example/spec.md'); assert.deepEqual(qaAdvice({ root, change: 'add-example', scripts: scan().scripts }), ['QA: scripts/qa-example.mjs covers example: Prove that the layer works.']); }));
src/tooling/spec/qaRegister.test.mjs:57:test('[qa-scripts-017] gives advice for a backfill area', () => fixture(({ root, put, scan }) => { put(FILE, header('pending:example')); put('openspec/changes/backfill-example/proposal.md'); assert.deepEqual(qaAdvice({ root, change: 'backfill-example', scripts: scan().scripts }), ['QA: scripts/qa-example.mjs covers example: Prove that the layer works.']); }));
src/tooling/spec/qaRegister.test.mjs:58:test('[qa-scripts-018] gives the no match line', () => fixture(({ root, put, scan }) => { put(FILE, header()); put('openspec/changes/add-other/specs/other/spec.md'); assert.deepEqual(qaAdvice({ root, change: 'add-other', scripts: scan().scripts }), ['QA: no script covers the capabilities of this change.']); }));
src/tooling/spec/qaRegister.test.mjs:59:test('[qa-scripts-019] gives no advice without a change', () => fixture(({ root, put, scan }) => { put(FILE, header()); assert.deepEqual(qaAdvice({ root, scripts: scan().scripts }), []); }));
src/tooling/spec/qaRegister.test.mjs:60:test('[qa-scripts-020] tells authors to read advice and add a header', () => {
src/tooling/spec/qaRegister.test.mjs:66:test('[qa-scripts-021] gives QA lines to the spec adversary', () => {
src/tooling/spec/qaRegister.test.mjs:70:test('[qa-scripts-022] asks the spec adversary to read each QA check', () => {
src/tooling/spec/qaRegister.test.mjs:77:test('[qa-scripts-023] checks all tracked QA scripts in this repository', () => {
src/tooling/spec/qaRegister.test.mjs:85:test('[qa-scripts-026] gives advice from an archived change', () => fixture(({ root, put, scan }) => { put(FILE, header('example')); put('openspec/specs/example/spec.md'); put('openspec/changes/archive/2026-09-26-add-example/specs/example/spec.md'); assert.deepEqual(qaAdvice({ root, change: 'add-example', scripts: scan().scripts }), ['QA: scripts/qa-example.mjs covers example: Prove that the layer works.']); }));
src/tooling/spec/qaRegister.test.mjs:86:test('[qa-scripts-027] sorts advice by script then capability', () => fixture(({ root, put, scan }) => {
src/tooling/spec/qaRegister.test.mjs:96:test('[qa-scripts-028] rejects a header continuation line', () => fixture(({ put, scan }) => { put(FILE, header().replace(' * @covers', ' * Extra text.\n * @covers')); headerError(scan()); }));
src/tooling/spec/qaRegister.test.mjs:98:test('[qa-scripts-005] rejects a purpose without a final mark', () => fixture(({ put, scan }) => {
src/tooling/spec/qaRegister.test.mjs:102:test('[qa-scripts-005] rejects an empty needs value', () => fixture(({ put, scan }) => {
src/tooling/spec/qaRegister.test.mjs:106:test('[qa-scripts-018] gives no match advice for an unknown change', () => fixture(({ root, put, scan }) => {
src/tooling/spec/qaRegister.test.mjs:110:test('[qa-scripts-025] sorts two covers errors for one script', () => fixture(({ put, scan }) => {
src/tooling/spec/qaRegister.test.mjs:116:test('[qa-scripts-008] rejects a file that has a capability name', () => fixture(({ put, scan }) => {
src/tooling/spec/qaRegister.test.mjs:122:test('[qa-scripts-025] gives no advice for invalid covers items', () => fixture(({ root, put, scan }) => {
src/tooling/spec/qaRegister.test.mjs:130:test('[qa-scripts-011] gives no advice for an unmapped reason', () => fixture(({ root, put, scan }) => {
src/tooling/spec/qaRegister.test.mjs:136:test('[qa-scripts-025] gives no advice for a file with a capability name', () => fixture(({ root, put, scan }) => {
src/tooling/spec/qaRegister.test.mjs:144:test('[ownership-009] uses a synthetic upstream QA header', () => fixture(({ root, put }) => {
src/tooling/spec/qaRegister.test.mjs:146:  const result = readQaRegister({ root, tracked: ['scripts/qa-new.mjs'], manifest, readBaseFile: () => 'export {};\n' });
src/tooling/spec/qaRegister.test.mjs:150:  assert.deepEqual(qaAdvice({ root, scripts: result.scripts }), ['QA: scripts/qa-new.mjs uses the synthetic header with the covers item unmapped: upstream.']);
src/tooling/spec/qaRegister.test.mjs:151:  assert.deepEqual(qaAdvice({ root, change: 'unknown', scripts: result.scripts }), ['QA: scripts/qa-new.mjs uses the synthetic header with the covers item unmapped: upstream.', 'QA: no script covers the capabilities of this change.']);
src/tooling/spec/qaRegister.test.mjs:153:test('[ownership-010] rejects an absent owned header and an invalid upstream header', () => fixture(({ root, put }) => {
src/tooling/spec/qaRegister.test.mjs:161:test('[ownership-009 ownership-010] keeps a valid upstream QA header and its capability checks', () => fixture(({ root, put }) => {
src/tooling/spec/qaRegister.test.mjs:163:  const result = readQaRegister({ root, tracked: [FILE], manifest, readBaseFile: () => '/* Base license. */\n' });
src/tooling/spec/qaRegister.test.mjs:169:test('[ownership-015] accepts an upstream first comment with no QA tags', () => fixture(({ root, put }) => {
src/tooling/spec/qaRegister.test.mjs:171:  const result = readQaRegister({ root, tracked: [FILE], manifest, readBaseFile: () => '/* Base license. */\n' });
src/tooling/spec/qaRegister.test.mjs:175:  assert.deepEqual(errorCodes(readQaRegister({ root, tracked: [FILE], manifest, readBaseFile: () => '/* Base license. */\n' })), ['QA-HEADER']);
src/tooling/spec/qaRegister.test.mjs:178:test('[ownership-010] rejects an upstream QA block with no end', () => fixture(({ root, put }) => {
src/tooling/spec/qaRegister.test.mjs:180:  assert.deepEqual(errorCodes(readQaRegister({ root, tracked: [FILE], manifest, readBaseFile: () => '/* Base license. */\n' })), ['QA-HEADER']);
src/tooling/spec/qaRegister.test.mjs:183:test('[ownership-010] rejects a bad upstream QA block after a shebang', () => fixture(({ root, put }) => {
src/tooling/spec/qaRegister.test.mjs:185:  assert.deepEqual(errorCodes(readQaRegister({ root, tracked: [FILE], manifest, readBaseFile: () => '/* Base license. */\n' })), ['QA-HEADER']);
src/tooling/spec/qaRegister.test.mjs:188:test('[ownership-010] rejects a shebang inside a QA comment', () => fixture(({ root, put }) => {
src/tooling/spec/qaRegister.test.mjs:190:  assert.deepEqual(readQaRegister({ root, tracked: [FILE], manifest: { version: 1, owned: [] }, readBaseFile: () => '/* Base license. */\n' }).errors, [{ code: 'QA-HEADER', file: 'scripts/qa-example.mjs', message: 'scripts/qa-example.mjs: add one first block with one nonempty line for each QA tag and valid covers items.' }]);
src/tooling/spec/qaRegister.test.mjs:193:test('[ownership-009] uses the synthetic header for a later comment', () => fixture(({ root, put }) => {
src/tooling/spec/qaRegister.test.mjs:195:  const result = readQaRegister({ root, tracked: [FILE], manifest: { version: 1, owned: [] }, readBaseFile: () => 'export {};\n' });
src/tooling/spec/qaRegister.test.mjs:200:test('[ownership-034] reports QA-HEADER for a new unlisted script', () => fixture(({ root, put }) => {
src/tooling/spec/qaRegister.test.mjs:202:  const result = readQaRegister({ root, tracked: [FILE], manifest, readBaseFile: () => null, adopts: [] });
src/tooling/spec/qaRegister.test.mjs:205:  assert.deepEqual(errorCodes(readQaRegister({ root, tracked: [FILE], manifest, readBaseFile: () => null, adopts: [{ file: 'scripts/qa-other.mjs' }] })), ['QA-HEADER']);
src/tooling/spec/qaRegister.test.mjs:207:test('[ownership-035] reports QA-HEADER after a base header is deleted', () => fixture(({ root, put }) => {
src/tooling/spec/qaRegister.test.mjs:209:  const result = readQaRegister({ root, tracked: [FILE], manifest, readBaseFile: () => header(), adopts: [] });
src/tooling/spec/qaRegister.test.mjs:214:test('[ownership-009 ownership-015] uses a valid adopt file for the synthetic header', () => fixture(({ root, put }) => {
src/tooling/spec/qaRegister.test.mjs:223:test('[ownership-010] rejects an owned base script without a header', () => fixture(({ root, put }) => {
src/tooling/spec/qaRegister.test.mjs:225:  const result = readQaRegister({ root, tracked: [FILE], manifest: { version: 1, owned: ['scripts/'] }, readBaseFile: () => 'export {};\n' });
src/tooling/spec/qaRegister.test.mjs:230:test('[ownership-009] uses the adopt file among other records', () => fixture(({ root, put }) => {
src/tooling/spec/qaRegister.test.mjs:239:test('[ownership-009] uses the first empty comment for the QA boundary', () => fixture(({ root, put }) => {
src/tooling/spec/qaRegister.test.mjs:241:  const result = readQaRegister({ root, tracked: [FILE], manifest, readBaseFile: () => '/* License. */\n' });
src/tooling/spec/qaRegister.test.mjs:246:test('[ownership-010] reports a QA error after an empty shebang', () => fixture(({ root, put }) => {
src/tooling/spec/qaRegister.test.mjs:248:  const result = readQaRegister({ root, tracked: [FILE], manifest, readBaseFile: () => '/* License. */\n' });
src/tooling/spec/qaRegister.test.mjs:252:test('[ownership-009] keeps code after a CR inside the shebang', () => fixture(({ root, put }) => {
src/tooling/spec/qaRegister.test.mjs:254:  const result = readQaRegister({ root, tracked: [FILE], manifest, readBaseFile: () => '/* License. */\n' });
scripts/spec/lib/qa-register.mjs:7:const HEADER_MESSAGE = (file) => `${file}: add one first block with one nonempty line for each QA tag and valid covers items.`;
scripts/spec/lib/qa-register.mjs:33:export function readQaRegister({ root, tracked, manifest, readBaseFile = () => null, adopts = [] }) {
scripts/spec/lib/qa-register.mjs:40:    const baseText = readBaseFile(file);
scripts/spec/lib/qa-register.mjs:41:    const eligible = (baseText !== null && !hasQaTag(baseText)) || adopts.some(item => item.file === file);
scripts/spec/lib/qa-register.mjs:67:  const advisory = scripts.filter(script => script.synthetic).map(script => `QA: ${script.file} uses the synthetic header with the covers item unmapped: upstream.`);
scripts/spec/lib/qa-register.mjs:68:  if (!change) return advisory;
scripts/spec/lib/qa-register.mjs:85:  return [...advisory, ...(lines.length ? [...new Set(lines.map((line) => line.text))] : ['QA: no script covers the capabilities of this change.'])];
scripts/spec/gates.mjs:2:import { readOwnership, isAdoptSource, validAdoptSources, ownershipAdvice, syncChangedLines, parseLineCoverage, coverageFaults, gapReport } from './lib/ownership.mjs';
scripts/spec/gates.mjs:25:  adoptsOf,
scripts/spec/gates.mjs:222:  const qaRegister = readQaRegister({ root, tracked, manifest, readBaseFile: file => readFileAt(root, base, file), adopts });
scripts/spec/gates.mjs:345:  const qa = readQaRegister({ root, tracked: listTrackedFiles(root), manifest, readBaseFile: file => readFileAt(root, base, file), adopts });
scripts/spec/gates.mjs:488:      [Boolean(fromCommit) && !isAdoptSource(root, base, fromCommit), `The commit ${options.from} is not a merged commit. It must be a parent, other than the first parent, of a merge commit after the base commit.`],
scripts/spec/gates.mjs:535:    adopts = validAdoptSources({ root, base, history: readOptional(root, HISTORY_FILE) ?? '', baseHistory: readFileAt(root, base, HISTORY_FILE) ?? '', change });
scripts/spec/gates.mjs:595:      const reachOf = importReach({ files: [...codeFiles], readFile: (name) => readFileSync(path.join(root, name), 'utf8'), baseFiles: listFilesAt(root, base), readBaseFile: (name) => readFileAt(root, base, name), fromFiles: listFilesAt(root, from), readFromFile: (name) => readFileAt(root, from, name) });
scripts/spec/gates.mjs:639:      retired: measured.specs.retired,
scripts/spec/gates.mjs:681:    adopts: adoptsOf(historyText, baseHistoryText, change),
scripts/spec/gates.mjs:682:    isMergedCommit: (from) => isAdoptSource(root, base, from),
scripts/spec/gates.mjs:689:    retired: [...measured.specs.retired],
scripts/spec/gates.mjs:690:    baseRetired: JSON.parse(readFileAt(root, base, RETIRED_FILE) ?? '[]'),
scripts/spec/gates.mjs:699:    ...checkRegistry({ registry, scenarios: measured.specs.scenarios, retired: measured.specs.retired }),
scripts/spec/gates.mjs:700:    ...compareRegistryWithBase({ registry, baseRegistry: JSON.parse(readFileAt(root, base, 'openspec/trace/ids.json') ?? 'null'), retired: measured.specs.retired, changedTestIds: changedTestIds(measured.records) }),
src/tooling/spec/ownership.test.mjs:32:test('[ownership-001] accepts the manifest contract', () => fixture(({ root, put }) => {
src/tooling/spec/ownership.test.mjs:38:test('[ownership-001] rejects each bad manifest field', () => {
src/tooling/spec/ownership.test.mjs:47:test('[ownership-001] reports an absent or bad manifest file', () => fixture(({ root, put }) => {
src/tooling/spec/ownership.test.mjs:53:test('[ownership-002] classifies exact paths and directory prefixes', () => {
src/tooling/spec/ownership.test.mjs:60:test('[ownership-003] shows each path class and totals', () => {
src/tooling/spec/ownership.test.mjs:65:test('[ownership-004] rejects all owned gap metrics', () => {
src/tooling/spec/ownership.test.mjs:78:test('[ownership-005] reads only added diff ranges', () => {
src/tooling/spec/ownership.test.mjs:82:test('[ownership-005] reads real edited new and deleted files', () => fixture(({ root, put }) => {
src/tooling/spec/ownership.test.mjs:91:test('[ownership-006] keeps only lines that every duplicate record covers', () => {
src/tooling/spec/ownership.test.mjs:98:test('[ownership-007] lists all uncovered changed lines in both classes', () => {
src/tooling/spec/ownership.test.mjs:108:test('[ownership-008] limits a line waiver to its file hash, its metric and its count', () => {
src/tooling/spec/ownership.test.mjs:115:test('[ownership-011] separates code and test gaps by class', () => {
src/tooling/spec/ownership.test.mjs:117:    'Owned gaps: 1 code files, 2 lines, 1 test files, 2 tests.', 'owned code: src/own/a.js', 'owned tests: src/own/a.test.mjs',
src/tooling/spec/ownership.test.mjs:118:    'Upstream gaps: 1 code files, 7 lines, 1 test files, 1 tests.', 'upstream code: other.js', 'upstream tests: other.test.mjs',
src/tooling/spec/ownership.test.mjs:120:  assert.deepEqual(gapReport(manifest, { coverage: {}, untracedTests: {} }), ['Owned gaps: 0 code files, 0 lines, 0 test files, 0 tests.', 'Upstream gaps: 0 code files, 0 lines, 0 test files, 0 tests.']);
src/tooling/spec/ownership.test.mjs:122:test('[ownership-012] has the process rules in AGENTS.md and config.yaml', () => {
src/tooling/spec/ownership.test.mjs:125:  assert.match(text, /Keep each owned code file that a change adds or edits at 100% line, branch and function coverage\./);
src/tooling/spec/ownership.test.mjs:126:  assert.match(text, /Each owned code file without a ledger entry also needs full coverage\./);
src/tooling/spec/ownership.test.mjs:127:  assert.match(text, /Keep 100% line coverage for each line that a change adds or edits in a code file\./);
src/tooling/spec/ownership.test.mjs:129:  assert.match(text, /Use `adopt` for each file that the merge brings and that has a coverage gap\./);
src/tooling/spec/ownership.test.mjs:131:  assert.match(text, /24\..*review.md.*files.*resolved by hand/);
src/tooling/spec/ownership.test.mjs:133:  assert.match(text, /25\..*retire the scenario or write it again/);
src/tooling/spec/ownership.test.mjs:137:  assert.match(config, /Each owned code file that a change adds or edits needs 100% line, branch and function coverage\./);
src/tooling/spec/ownership.test.mjs:138:  assert.match(config, /Each owned code file without a ledger entry also needs full coverage\./);
src/tooling/spec/ownership.test.mjs:142:test('[ownership-013] writes merged DA counts for each code line', () => {
src/tooling/spec/ownership.test.mjs:147:test('[ownership-013] stores line data in the snapshot', () => fixture(({ root, put }) => {
src/tooling/spec/ownership.test.mjs:155:test('[ownership-004 ownership-008] ignores fractional and negative waiver counts', () => {
src/tooling/spec/ownership.test.mjs:162:test('[ownership-007 ownership-008] rejects all line waivers for an untrue file', () => {
src/tooling/spec/ownership.test.mjs:167:test('[ownership-004] reports each owned gap after an upstream file', () => {
src/tooling/spec/ownership.test.mjs:171:test('[ownership-014] counts every test instance', () => {
src/tooling/spec/ownership.test.mjs:173:    'Owned gaps: 0 code files, 0 lines, 1 test files, 3 tests.', 'owned tests: single.js',
src/tooling/spec/ownership.test.mjs:174:    'Upstream gaps: 0 code files, 0 lines, 1 test files, 4 tests.', 'upstream tests: other.test.mjs',
src/tooling/spec/ownership.test.mjs:178:test('[ownership-001] accepts the first and last characters of each allowed character range', () => {
src/tooling/spec/ownership.test.mjs:181:test('[ownership-016] sorts all line numbers as numbers', () => {
src/tooling/spec/ownership.test.mjs:185:test('[ownership-017] ignores extra line record text', () => {
src/tooling/spec/ownership.test.mjs:189:test('[ownership-018] adds owned file gaps and waiver counts', () => {
src/tooling/spec/ownership.test.mjs:190:  assert.deepEqual(gapReport(manifest, { coverage: { 'src/own/a.js': { lines: 2 }, 'src/own/b.js': { lines: 3 } }, untracedTests: {} }), ['Owned gaps: 2 code files, 5 lines, 0 test files, 0 tests.', 'owned code: src/own/a.js', 'owned code: src/own/b.js', 'Upstream gaps: 0 code files, 0 lines, 0 test files, 0 tests.']);
src/tooling/spec/ownership.test.mjs:195:test('[ownership-005] uses each Git diff option', () => fixture(({ root, put }) => {
src/tooling/spec/ownership.test.mjs:207:test('[ownership-018] adds test counts across owned files', () => {
src/tooling/spec/ownership.test.mjs:208:  assert.deepEqual(gapReport(manifest, { coverage: {}, untracedTests: { 'single.js': { names: { one: 2, two: 1 } }, 'src/own/a.test.js': { names: { three: 4 } } } }), ['Owned gaps: 0 code files, 0 lines, 2 test files, 7 tests.', 'owned tests: single.js', 'owned tests: src/own/a.test.js', 'Upstream gaps: 0 code files, 0 lines, 0 test files, 0 tests.']);
src/tooling/spec/ownership.test.mjs:210:test('[ownership-019] counts zero instances for an empty name map', () => {
src/tooling/spec/ownership.test.mjs:211:  assert.deepEqual(gapReport(manifest, { coverage: {}, untracedTests: { 'single.js': { names: {} } } }), ['Owned gaps: 0 code files, 0 lines, 1 test files, 0 tests.', 'owned tests: single.js', 'Upstream gaps: 0 code files, 0 lines, 0 test files, 0 tests.']);
src/tooling/spec/ownership.test.mjs:238:test('[ownership-020 ownership-025] needs no coverage for lines that equal the merged source', () => syncFixture(({ input }) => {
src/tooling/spec/ownership.test.mjs:245:test('[ownership-021] needs coverage for a line that a person resolved by hand', () => syncFixture(({ root, put, git, commit, base, from, input }) => {
src/tooling/spec/ownership.test.mjs:256:test('[ownership-022] needs coverage for an author edit to an upstream line', () => syncFixture(({ put, commit, input }) => {
src/tooling/spec/ownership.test.mjs:264:test('[ownership-023] uses the last adopt source for each file and the last source for other files', () => syncFixture(({ put, git, commit, from, adopt, input }) => {
src/tooling/spec/ownership.test.mjs:275:test('[ownership-024] stops a source commit that the repository lacks or that no merge brought', () => syncFixture(({ git, put, commit, input, adopt, base }) => {
src/tooling/spec/ownership.test.mjs:283:test('[ownership-024] keeps the base diff rule without current adopt sources', () => syncFixture(({ input, adopt }) => {
src/tooling/spec/ownership.test.mjs:292:test('[ownership-024] ignores base adopt records and stops non-string source values', () => syncFixture(({ input, adopt }) => {
src/tooling/spec/ownership.test.mjs:304:test('[ownership-025] checks each line of an author rename absent from the source', () => syncFixture(({ git, commit, input }) => {
src/tooling/spec/ownership.test.mjs:311:test('[ownership-026 ownership-027 ownership-028] accepts only unchanged owned gaps with a ledger entry', () => {
src/tooling/spec/ownership.test.mjs:320:test('[ownership-029 ownership-001] keeps base paths after manifest removal', () => syncFixture(({ root, put, git, base: absentBase }) => {
src/tooling/spec/ownership.test.mjs:341:test('[ownership-030] owns the project sentinel files', () => {
src/tooling/spec/ownership.test.mjs:345:test('[ownership-031] stops an adopt record without a file at HEAD', () => syncFixture(({ input, git }) => {
src/tooling/spec/ownership.test.mjs:352:test('[ownership-032] stops a work branch adopt source', () => syncFixture(({ input, put, commit, adopt }) => {
src/tooling/spec/ownership.test.mjs:356:test('[ownership-033] stops an ancestor that no merge brought', () => syncFixture(({ input, base, adopt }) => {
src/tooling/spec/ownership.test.mjs:359:test('[ownership-036] gives the diff a 256 MiB buffer', () => fixture(({ root, put }) => {
src/tooling/spec/ownership.test.mjs:363:  childProcess.spawnSync = (command, args, options) => { if (args[0] === 'diff') buffer = options.maxBuffer; return { status: 0, stdout: '', stderr: '' }; };
src/tooling/spec/ownership.test.mjs:369:test('[ownership-031 ownership-024] stops an incomplete record with a merged source', () => syncFixture(({ input, from, adopt }) => {
src/tooling/spec/ownership.test.mjs:380:test('[ownership-041] stops a number in the from field with a merged branch', () => syncFixture(({ input, git, from, adopt }) => {
src/tooling/spec/ownership.test.mjs:387:test('[ownership-043] skips invalid adopt records outside the change', () => syncFixture(({ input }) => {
src/tooling/spec/ownership.test.mjs:400:test('[ownership-050] stops an invalid record after a valid record', () => syncFixture(({ input, from }) => {
src/tooling/spec/ownership.test.mjs:405:test('[ownership-051 ownership-024] stops an invalid source before a diff fault', () => syncFixture(({ input }) => {
src/tooling/spec/ownership.test.mjs:426:test('[ownership-052] stops a source name with a null byte', () => syncFixture(({ input, adopt }) => {
openspec/changes/ownership-scoped-gates/tasks.md:76:- [x] 5.2 Add the check for changed owned files and for owned files without a ledger entry.
openspec/changes/ownership-scoped-gates/tasks.md:84:- [x] 6.1 Write the tests for `ownership-029`.
openspec/changes/ownership-scoped-gates/tasks.md:85:- [x] 6.2 Write the tests for `ownership-030`.
openspec/changes/ownership-scoped-gates/tasks.md:86:- [x] 6.3 Write the tests for `ownership-031`.
openspec/changes/ownership-scoped-gates/tasks.md:87:- [x] 6.4 Write the tests for `ownership-032`.
openspec/changes/ownership-scoped-gates/tasks.md:88:- [x] 6.5 Write the tests for `ownership-033`.
openspec/changes/ownership-scoped-gates/tasks.md:89:- [x] 6.6 Write the tests for `ownership-034`.
openspec/changes/ownership-scoped-gates/tasks.md:90:- [x] 6.7 Write the tests for `ownership-035`.
openspec/changes/ownership-scoped-gates/tasks.md:91:- [x] 6.8 Write the tests for `ownership-036`.
openspec/changes/ownership-scoped-gates/tasks.md:92:- [x] 6.9 Write the tests for `ownership-037`.
openspec/changes/ownership-scoped-gates/tasks.md:93:- [x] 6.10 Write the tests for `ownership-038`.
openspec/changes/ownership-scoped-gates/tasks.md:95:- [x] 6.11 Share the adopt source predicate.
openspec/changes/ownership-scoped-gates/tasks.md:112:- [x] 6.27 Write the test for `ownership-039`.
openspec/changes/ownership-scoped-gates/tasks.md:114:- [x] 6.28 Write the test for `ownership-040`.
openspec/changes/ownership-scoped-gates/tasks.md:116:- [x] 6.29 Read adopt sources after CI selects the change.
openspec/changes/ownership-scoped-gates/tasks.md:119:- [x] 6.31 Write the test for `ownership-041`.
openspec/changes/ownership-scoped-gates/tasks.md:121:- [x] 6.32 Write the test for `ownership-042`.
openspec/changes/ownership-scoped-gates/tasks.md:123:- [x] 6.33 Write the test for `ownership-043`.
openspec/changes/ownership-scoped-gates/tasks.md:124:- [x] 6.34 Write the test for `ownership-044`.
openspec/changes/ownership-scoped-gates/tasks.md:125:- [x] 6.35 Write the test for `ownership-045`.
openspec/changes/ownership-scoped-gates/tasks.md:127:- [x] 6.36 Write the test for `ownership-046`.
openspec/changes/ownership-scoped-gates/tasks.md:128:- [x] 6.37 Write the test for `ownership-047`.
openspec/changes/ownership-scoped-gates/tasks.md:130:- [x] 6.38 Write the test for `ownership-048`.
openspec/changes/ownership-scoped-gates/tasks.md:132:- [x] 6.39 Write the test for `ownership-049`.
openspec/changes/ownership-scoped-gates/tasks.md:134:- [x] 6.40 Write the test for `ownership-050`.
openspec/changes/ownership-scoped-gates/tasks.md:136:- [x] 6.41 Write the test for `ownership-051`.
openspec/changes/ownership-scoped-gates/tasks.md:138:- [x] 6.42 Write the test for `ownership-052`.
openspec/changes/ownership-scoped-gates/tasks.md:139:- [x] 6.43 Return false when Git cannot read an adopt source name.
openspec/changes/ownership-scoped-gates/tasks.md:143:- [x] 6.45 Write the test for `ownership-053`.
scripts/spec/lib/ownership.mjs:4:import { readFileAt, mergeParents, resolveCommit } from './git.mjs';
scripts/spec/lib/ownership.mjs:5:import { adoptsOf } from './ledger.mjs';
scripts/spec/lib/ownership.mjs:27:    return { manifest: { version: 1, owned: [...new Set([...previous.owned, ...current.owned])] }, errors: [] };
scripts/spec/lib/ownership.mjs:60:    const diff = spawnSync('git', ['diff', '--text', '--no-ext-diff', '--no-textconv', '--no-renames', '-U0', base, '--', file], { cwd: root, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
scripts/spec/lib/ownership.mjs:73:/** True when a merge after the base brought the adopt source. */
scripts/spec/lib/ownership.mjs:74:export function isAdoptSource(root, base, from) {
scripts/spec/lib/ownership.mjs:76:    return mergeParents(root, base).has(resolveCommit(root, from));
scripts/spec/lib/ownership.mjs:83:export function validAdoptSources({ root, base, history, baseHistory, change }) {
scripts/spec/lib/ownership.mjs:88:  const adopts = adoptsOf(history, baseHistory, change);
scripts/spec/lib/ownership.mjs:90:    if (typeof record.file !== 'string' || typeof record.from !== 'string' || !isAdoptSource(root, base, record.from)) {
scripts/spec/lib/ownership.mjs:101:  const adopts = validAdoptSources({ root, base, history, baseHistory, change });
scripts/spec/lib/ownership.mjs:164:    result.push(`${group === 'owned' ? 'Owned' : 'Upstream'} gaps: ${code.length} code files, ${lines} lines, ${tests.length} test files, ${names} tests.`);
openspec/changes/ownership-scoped-gates/proposal.md:3:The owner accepts a boundary for strict checks for the fork.
openspec/changes/ownership-scoped-gates/proposal.md:5:Changed owned files and owned files without a ledger entry need full coverage. Each changed line needs coverage in every code file.
openspec/changes/ownership-scoped-gates/proposal.md:13:- Add whole-file checks for changed owned code and owned code without a ledger entry. Check each code diff line.
openspec/changes/ownership-scoped-gates/proposal.md:19:- Check only the lines that differ from both the base and the adopt source for a sync.
openspec/changes/ownership-scoped-gates/proposal.md:31:The change adds no intended coverage gap and closes no old gap.
openspec/changes/ownership-scoped-gates/proposal.md:41:Host coverage cannot replace the image measurement on the Node version in .node-version.
openspec/changes/ownership-scoped-gates/proposal.md:45:The manifest accepts ASCII letters, digits, underscores, dots, hyphens and slashes in paths.
openspec/changes/ownership-scoped-gates/proposal.md:51:The list of files that a person resolved by hand is a review rule. Git cannot show all such files.
openspec/changes/ownership-scoped-gates/proposal.md:73:Author edits and lines that a person resolved by hand need coverage if they differ from both the base and the source.
openspec/changes/ownership-scoped-gates/proposal.md:79:It also had limits for trace links and repeated QA covers items.
openspec/changes/ownership-scoped-gates/proposal.md:93:A real merge of an own branch followed by adopt is still accepted. Rule 21 needs a manual check of the upstream remote.
openspec/changes/ownership-scoped-gates/proposal.md:99:Manifest entries that match no file are not checked. This includes a typo or a directory without its final slash.
openspec/changes/ownership-scoped-gates/proposal.md:102:The follow-up change html-shell-line-data must treat zero-script HTML as code with no code lines.
openspec/changes/ownership-scoped-gates/proposal.md:105:The old gate plural style, such as 1 code files, stays.
```

### Final host commands

All Node commands use taskset -c 4-7 nice -n 19. The host Node version is v26.8.2.
Each test file has its own process. No test isolation flag is used.

The command python3 /tmp/pass4-final-focused.py runs the three focused files in order.
It uses --experimental-test-coverage with one --test-coverage-include path for each library.

| File | Log | Passed | Failed |
| --- | --- | ---: | ---: |
| ownership.test.mjs | /tmp/pass4-check-ownership.log | 47 | 0 |
| qaRegister.test.mjs | /tmp/pass4-check-qaRegister.log | 47 | 0 |
| ownershipGate.test.mjs | /tmp/pass4-check-ownershipGate.log | 32 | 0 |
| v8Merge.test.mjs | /tmp/pass4-v8-final.log | 11 | 0 |

These titles are the names at the time of the run. Later corrections renamed some titles; the tags are unchanged.

The two focused library logs each show 100% line, branch and function coverage.
The final gates.test.mjs command uses the host adapter and omits only the four known host cases.
It passes 223 tests with no failure in /tmp/pass4-legacy-null-final.log.

```sh
NODE_V8_COVERAGE=/home/ianblenke/docker/gev-tools/ownership-gates/pass4/raw-legacy-null-final taskset -c 4-7 nice -n 19 node --import=/home/ianblenke/docker/gev-tools/ownership-gates/host.mjs --test-skip-pattern='^(?:\[coverage\-gate\-024\]|\[spec\-trace\-039\ spec\-trace\-040\]|\[coverage\-gate\-031\]|\[coverage\-gate\-048\])' --test-reporter=spec src/tooling/spec/gates.test.mjs
```

The command with --test-name-pattern for those four IDs fails the same four cases.
The log /tmp/pass4-known-host-final.log has 4 failed tests and no passed test.
The cases concern a worker load, a forged result, a child environment and a forced exit.

The first full run has 227 tests: 222 pass and 5 fail in /tmp/pass4-legacy.log.
The extra failure is gap-ledger-096/gap-ledger-097: its old assertion expects later checks after the new source stop.
The corrected test uses one run for that stop and one run for file and base ledger errors.
The target command passes 1 test in /tmp/pass4-legacy-adopt.log.

### Further fault proof

The commands python3 /tmp/pass4-extra-named.py, /tmp/pass4-more-named.py,
/tmp/pass4-last-named.py and /tmp/pass4-order-named.py use isolated code copies.
Their result files are named-extra-results.json, named-more-results.json,
named-last-results.json and named-order-results.json under pass4 in the tool folder.
Each named fault has exit status 1 and a failed test in those files.

| Fault | Failed test |
| --- | --- |
| Read sources before CI selects its change | ownership-040 |
| Skip the work source check in the adopt command | ownership-039 |
| Skip history JSON checks without a change | ownership-038 |
| Drop the from string check with branch 1 | ownership-041 |
| Read no base history | ownership-042 |
| Drop the change and history prefix guard | ownership-043 |
| Drop adopt records from snapshot QA | ownership-044 |
| Drop the measure phase name | ownership-045 |
| Drop the absent source fault | ownership-046 |
| Drop the absent ledger fault | ownership-047 |
| Drop the caller environment or allocation list | ownership-048 |
| Drop the selected change in either measurement mode | ownership-049 |
| Read only the first adopt record | ownership-050 |
| Read the diff before the source check | ownership-051 |
| Drop base paths or duplicate path removal | ownership-029 |
| Read a base when none is given | ownership-001 ownership-029 |
| Remove an owned sentinel path | ownership-030 |
| Skip the failed diff stop | ownership-037 |
| Accept any adopt file for a QA header | ownership-034 |
| Change the first comment or shebang bound | ownership-009 ownership-010 |
| Drop the error code field | ownership-031 |

These titles are the names at the time of the run. Later corrections renamed some titles; the tags are unchanged.

The null source command first fails ownership-052 with ERR_INVALID_ARG_VALUE in /tmp/pass4-null-red.log.
After the source predicate correction, the same command passes in /tmp/pass4-null-green.log.
The code now gives LEDGER-ADOPT-FROM and the STE message of ownership-031.

Two late test attempts stopped at a syntax error in a fixture string. They give no test verdict.
The corrected target command passes 6 tests in /tmp/pass4-gate-late-green.log.
The final target command passes 3 tests in /tmp/pass4-final-late.log.

### Mutation scope

The official gen command reads the three changed scripts and writes pass4/null-all.json.
Its log /tmp/pass4-null-gen.log names 8928 candidates.
The command python3 /tmp/pass4-remap-null.py selects 754 candidates on the script lines of git diff -U0 bf174f99.
The input is pass4/mutants-pass4-final.json.

The source predicate context changed for the null byte correction.
The mapper keeps 739 unchanged spans and tests 15 fresh candidates. It drops 13 old spans.
The phase 1 command completes with 277 kills, 476 passes and 1 crash.
The full phase 2 command tests old survivors and the fresh candidates with all current tests.

The full batch finishes in /tmp/pass4-strong-p2.log.
It then runs the two no-change guard mutants again in /tmp/pass4-guard-p2.log.

The host runner copies the official tool and changes only the test process adapter.
It uses file output to avoid the host pipe fault and stops at the first failed test.
The QA inventory test qa-scripts-023 runs in the project clone. Worker copies have no Git index and omit it.
The old interrupted campaigns give no final mutation verdict.


The command python3 /tmp/pass4-last-proof.py has four failed fault tests.
Its file pass4/named-final-results.json names ownership-052, gap-ledger-111, ownership-039 and ownership-053.
The first fault removes the source name catch.
The next fault moves the baseline check after tests.
The other faults remove the source name from the message and print advice for CI and init.

The no-change guard mutant c0546 fails ownership-043 after the absent and empty name cases.
The command python3 /tmp/pass4-extra-scope.py records exit status 1 in pass4/named-no-change-results.json.
The original code passes 47 tests in /tmp/pass4-check-ownership-final.log.
That command uses the one-file coverage options of the earlier ownership command.
The test title of ownership-002 also changes to match the changed scenario heading.
The requirements of ownership-014, ownership-016 and ownership-019 do not change.

The format command uses the host shim from pass 2:

```text
NODE_OPTIONS=--import=/home/ianblenke/docker/gev-tools/ownership-gates/pass2-format-shim.mjs taskset -c 4-7 nice -n 19 node scripts/format.mjs --check
```

Its log /tmp/pass4-format-final.log says Checked 1158 source files. The exit status is 0.
The lint command after the test corrections gives STE: 0 errors, 549 warnings in /tmp/pass4-lint-scope.log.

### Code commit

The pass 4 code, tests and process text have commit 799372f0.
The command git commit reports 9 files changed, 544 insertions and 116 deletions.
The first attempt stopped because the Git index was read-only. It made no commit.
The approved sandbox retry made this commit in the clone.

The round 1 correction tables read bf174f99. The final checks read the code of 799372f0.

### Coverage commands

The focused commands give 100% line, branch and function coverage for ownership.mjs and qa-register.mjs.
The final ownership command is in /tmp/pass4-check-ownership-final.log.
The QA command is in /tmp/pass4-check-qaRegister.log.
The host merge command reads one script per process:

```text
taskset -c 4-7 nice -n 19 node /home/ianblenke/docker/gev-tools/ownership-gates/host-coverage.mjs <script> /home/ianblenke/docker/gev-tools/ownership-gates/pass4/raw-legacy-null-final /home/ianblenke/docker/gev-tools/ownership-gates/pass4/raw-focused-ci-final
```

The v8-merge.mjs command also reads pass4/raw-v8-final.
These data use the current gate script and the unchanged measurement and V8 scripts.

| Script | Lines | Branches | Functions | Log |
| --- | --- | --- | --- | --- |
| ownership.mjs | 100% | 100% | 100% | /tmp/pass4-check-ownership-final.log |
| qa-register.mjs | 100% | 100% | 100% | /tmp/pass4-check-qaRegister.log |
| gates.mjs | 769/769 | 376/376 | 91/91 | /tmp/pass4-cov-gates-current.json |
| measurement.mjs | 65/65 | 57/57 | 8/8 | /tmp/pass4-cov-measurement-current.json |
| v8-merge.mjs | 190/190 | 111/111 | 19/19 | /tmp/pass4-cov-v8-current.json |

These titles are the names at the time of the run. Later corrections renamed some titles; the tags are unchanged.

Each host merge command has exit status 0. The first two merged reports read 292 process records.
The V8 report reads 293 records. Each script has 100% line, branch and function coverage.

The final scenario audit is in /tmp/pass4-scenario-audit-final.log.
It compares requirement text at bf174f99 with the pass 4 delta and checks the test diff from that commit.
It finds 47 scenarios under changed requirements. Each has a changed tagged test.
The other six scenarios have unchanged requirements and unchanged scenario text.

The command git diff --check has no error output.
The lint command after the coverage table gives STE: 0 errors, 549 warnings in /tmp/pass4-lint-coverage.log.

### Mutation commands

The official generator command is:

```text
taskset -c 4-7 nice -n 19 node /home/ianblenke/docker/gev-tools/automut/automut.mjs gen --root /home/ianblenke/docker/gev-work/ownership-gates --files scripts/spec/lib/ownership.mjs,scripts/spec/gates.mjs,scripts/spec/lib/qa-register.mjs --out /home/ianblenke/docker/gev-tools/ownership-gates/pass4/null-all.json
python3 /tmp/pass4-remap-null.py
```

The host second phase command is:

```text
taskset -c 4-7 nice -n 19 node /home/ianblenke/docker/gev-tools/ownership-gates/pass4/automut-host.mjs run --root /home/ianblenke/docker/gev-work/ownership-gates --mutants /home/ianblenke/docker/gev-tools/ownership-gates/pass4/mutants-pass4-final.json --tests src/tooling/spec/ownership.test.mjs,src/tooling/spec/qaRegister.test.mjs,src/tooling/spec/ownershipGate.test.mjs --order 'scripts/spec/gates.mjs=ownershipGate,ownership,qaRegister;scripts/spec/lib/qa-register.mjs=qaRegister,ownership,ownershipGate' --phase 2 --jobs 2 --slow-ms 300 --out /home/ianblenke/docker/gev-tools/ownership-gates/pass4/results-pass4-final.json --resume
```

The first phase uses the same host runner with --phase 1.
Its completed result is in /tmp/pass4-null-p1.log.
The old phase-two kills and crashes remain only for unchanged source spans.
The final full phase reads every old survivor and each fresh source predicate candidate.

The known host adapter cases also run against commit 799372f0:

```text
taskset -c 4-7 nice -n 19 node --import=/home/ianblenke/docker/gev-tools/ownership-gates/host.mjs --test-name-pattern='^(?:\[coverage\-gate\-024\]|\[spec\-trace\-039\ spec\-trace\-040\]|\[coverage\-gate\-031\]|\[coverage\-gate\-048\])' --test-reporter=spec src/tooling/spec/gates.test.mjs
```

The command has exit status 1. The log /tmp/pass4-known-host-current.log has the same 4 failures and no passed test.
The other 223 legacy tests pass on the current code. No new host failure remains.

The parser hash audit uses the project parseSpecFile function:

```text
taskset -c 4-7 nice -n 19 node /tmp/pass4-hash-audit.mjs
```

The log /tmp/pass4-hash-audit.log has 53 scenarios and 47 changed hashes.
It has no changed hash without a changed tagged test. The parser has no spec error.

The full batch finishes all 131 cases with exit status 0 in /tmp/pass4-strong-p2.log.
Two no-change cases enter ownership-043 during that batch. The worker copies still have the earlier test body.
The final automatic rerun reads the new cases for c0546 and c0549.
The ownership-002 title change has no effect on its assertions.

### Final mutation result

Tree read: 799372f0. The source spans are relative to bf174f99.
The automatic tool finishes with 754 mutants: 698 KILLED, 44 SURVIVED and 12 CRASH.
The tool does not count CRASH as KILLED. Some CRASH records name failed tests.
This report keeps the tool status.

The final artifact is mutation-results-pass4.json. It has the input spans, raw tool results and the assessment.

| Script | KILLED | SURVIVED | CRASH |
| --- | --- | --- | --- |
| scripts/spec/gates.mjs | 279 | 20 | 7 |
| scripts/spec/lib/ownership.mjs | 266 | 12 | 5 |
| scripts/spec/lib/qa-register.mjs | 153 | 12 | 0 |

These titles are the names at the time of the run. Later corrections renamed some titles; the tags are unchanged.

Each survivor has an EQUIVALENT probe and a reason below.
The probes use readable stable input files, plain JSON records and fixed Git refs.
They do not claim the same result for a concurrent file edit or a permission fault.

| ID | Probe cases | Reason |
| --- | --- | --- |
| a1384 | 16 | Empty, absent and non-tag block text have no QA tag. |
| a1386 | 16 | Empty, absent and non-tag block text have no QA tag. |
| a1387 | 16 | Empty, absent and non-tag block text have no QA tag. |
| a1411 | 16 | The source error code and the default are both LEDGER-ADOPT-FROM for readable input files. |
| a1412 | 16 | Empty, absent and non-tag block text have no QA tag. |
| a1702 | 16 | The Boolean checks have the same result for plain JSON and fixed Git refs. |
| a1732 | 16 | A valid header has QA tags. The later no-tag check stops the synthetic path. |
| a1739 | 16 | The Boolean checks have the same result for plain JSON and fixed Git refs. |
| a1744 | 16 | The Boolean checks have the same result for plain JSON and fixed Git refs. |
| a1753 | 16 | A valid header has QA tags. The later no-tag check stops the synthetic path. |
| a1754 | 16 | The Boolean checks have the same result for plain JSON and fixed Git refs. |
| a9440 | 16 | The independent reads and checks give the same records or error. |
| c0147 | 10 | JSON.parse reads the UTF-8 buffer as the same JSON text. |
| c0149 | 10 | JSON.parse reads the UTF-8 buffer as the same JSON text. |
| c0154 | 10 | The base read and parse of the current manifest give the same manifest or error. |
| c0550 | 8 | The Boolean checks have the same result for plain JSON and fixed Git refs. |
| c0588 | 12 | The Boolean checks have the same result for plain JSON and fixed Git refs. |
| c0614 | 12 | The Boolean checks have the same result for plain JSON and fixed Git refs. |
| c0619 | 12 | The Boolean checks have the same result for plain JSON and fixed Git refs. |
| c4477 | 6 | The earlier fault in the fault list stops an absent source. |
| c4481 | 6 | The earlier fault in the fault list stops an absent source. |
| c4482 | 6 | The earlier fault in the fault list stops an absent source. |
| c4952 | 4 | The optional history value is null or a string. Both operators select the same text. |
| c4966 | 4 | The optional history value is null or a string. Both operators select the same text. |
| c4995 | 4 | The optional history value is null or a string. Both operators select the same text. |
| c4996 | 4 | The source error code and the default are both LEDGER-ADOPT-FROM for readable input files. |
| c4999 | 4 | The optional history value is null or a string. Both operators select the same text. |
| c5000 | 4 | The optional history value is null or a string. Both operators select the same text. |
| c6441 | 26 | The earlier source check has accepted the same merged commit before this later check. |
| c6442 | 26 | The earlier source check has accepted the same merged commit before this later check. |
| c9140 | 10 | The independent reads and checks give the same records or error. |
| c9167 | 4 | A deleted path has no line result, before or after the text diff. |
| c9184 | 12 | The independent reads and checks give the same records or error. |
| c9185 | 12 | The independent reads and checks give the same records or error. |
| c9522 | 26 | The independent QA, trace and ledger comparisons give the same errors and data. |
| c9523 | 26 | The independent QA, trace and ledger comparisons give the same errors and data. |
| c9602 | 26 | The local manifest is not read on the early error or tree return. |
| c9608 | 26 | The local manifest is not read on the early error or tree return. |
| c9609 | 26 | The local manifest is not read on the early error or tree return. |
| c9613 | 26 | The moved read has no error or side effect on the readable fixture. |
| c9629 | 26 | The local declaration has no effect before CI selects the change. |
| c9631 | 26 | The moved read has no error or side effect on the readable fixture. |
| c9659 | 26 | The independent QA, trace and ledger comparisons give the same errors and data. |
| n0014 | 16 | The callers test the result as a Boolean. False and undefined both stop the source. |

These titles are the names at the time of the run. Later corrections renamed some titles; the tags are unchanged.

The probe commands are:

```text
taskset -c 4-7 nice -n 19 node /home/ianblenke/docker/gev-tools/ownership-gates/pass4/equivalent-probe.mjs
taskset -c 4-7 nice -n 19 node /home/ianblenke/docker/gev-tools/ownership-gates/pass4/equivalent-gate-probe.mjs
taskset -c 4-7 nice -n 19 node /home/ianblenke/docker/gev-tools/ownership-gates/pass4/equivalent-catch-probe.mjs
```

Their result files give 648 passed probe cases for the survivors.

The automatic guard rerun has exit status 0. Both c0546 and c0549 are KILLED in /tmp/pass4-guard-p2.log.
The command python3 /tmp/pass4-final-artifact.py writes the final result artifact and the survivor table.
Its totals are 698 KILLED, 44 SURVIVED and 12 CRASH for 754 mutants.
The three probe result files have 648 passed cases for those 44 survivors.
Each of the 39 named fault records has exit status 1 and a failed test name.

The official report command is:

```text
taskset -c 4-7 nice -n 19 node /home/ianblenke/docker/gev-tools/automut/automut.mjs report --mutants /home/ianblenke/docker/gev-tools/ownership-gates/pass4/mutants-pass4-final.json --results /home/ianblenke/docker/gev-tools/ownership-gates/pass4/results-pass4-final.json --out /home/ianblenke/docker/gev-tools/ownership-gates/pass4/survivors-final.md
```

Its total row has 277 first-phase kills and 421 second-phase kills.
It has 1 first-phase crash and 11 second-phase crashes, with no timeout or pending mutant.
Both phases are complete. The raw tool report has no commit field value.
The result artifact names code commit 799372f06a74a793d63b4939dd98b7e035a4df69 and the script hashes.

The final checks do not run Docker, make, real gates, ratchet, archive or the next review round.
The lead runs those checks and the full review round. This pass makes no merge or push.

The final record lint has exit status 0 in /tmp/pass4-lint-final-record-fixed.log.
It gives STE: 0 errors, 554 warnings. The final git diff --check command has no error output.

The document and result artifact commit is f8c3c0d3.
The code and test commit remains 799372f06a74a793d63b4939dd98b7e035a4df69.
After the document commit, task 6.26 is complete.

## Pass 5

Tree read: fbdb630ae4b8af37437e808a023f7569c9276510, branch ownership-gates.

The text before this section contains Old records. Each table keeps the titles at the time of its run.
At Pass 5, the repeated-title check excludes those Old records. The tags keep the same IDs.

### Findings

All rows concern tree fbdb630ae4b8af37437e808a023f7569c9276510 and the Pass 5 work tree.

| First words | Correction |
|---|---|
| Critical: A forged adopt line | D7 rejects every revision name. The option still resolves names. |
| Major: Code and spec disagree | D8 makes the base QA tag decisive. |
| Major: The adopt arm has no producer | D8 writes the zero-count QA record. Other errors still stop the command. |
| Major: Order and origin | D9 states the real order and the backfill origin. |
| Minor: qa-scripts-023 calls readQaRegister | The QA exception now names qa-scripts-023. |
| Minor: The survivor table has 39 rows | The initial tree already has all 44 rows. The audit counts them. |
| Minor: Bad history JSON gets the code | Ownership-038 names the error line. Both tests check the code; the no-change test checks the full line. |
| Minor: An owned path leaves | The proposal states the one-change effect. Rule 23 names the owner read. |
| Extra: Cost | The proposal names three mergeParents calls per record. The code has no cache. |
| Extra: Pass 4 reads commit | The proposal names the pass base and the code commit. |
| Extra: AGENTS.md and config.yaml say report | Both texts say all ledger gaps of both classes. |
| Extra: AGENTS.md unnumbered lines | Rule 21 has its sentence on the same line. Rule 24 has no duplicate coverage sentence. |
| Extra: No real upstream-class or sync change | The proposal names this limit. |

| ID and first words | Correction |
|---|---|
| S37: The third AND | The process text is the actor of the review.md clause. |
| S38: MUST keep QA-HEADER | The QA clauses bound new scripts and base QA tags. |
| S39: Valid adopt record | The definition needs adoptsOf and the full merged hash. Two sentences keep the STE word limit. |
| S40: Omit advice from CI and init | Class lines and owned gap lines have separate names. |
| S41: The host measurement | The gate prints the measure phase time. Host means the machine outside the image. |
| S42: Is not a merge parent | The clause excludes the first parent of a merge. |
| S43: An owned path leaves | The proposal states the next change effect and the owner read. |
| S44: Rejects changed upstream lines | The title names uncovered changed upstream lines in CI. |
| S45: New unlisted script | The title and design name the absent adopt record. |
| S46: A path is owned | The design bounds the union by the base. The Purpose after archive text has the same rule. |
| S47: A read without a base | The gate reads the manifest without a base. |
| S48: Stop a record without a file | The headings and titles name the gate stop. |
| S49: The waivers cover | The spec and design use waive for the waiver. |
| S50: A total of 3 tests | The clause names test instances. |
| S51: Reject an absent owned header | The clause names a script with no header. |
| S52: The eligibility rule | The spec has one QA rule and no duplicate base clause. |
| S53: Vendored code | The clause uses upstream file. |
| S54: Adopt source | The source is the commit. File content is the file in the adopt source. |
| S55: From has no code format | The spec formats the field and the Git branch name. |
| S56: Unquoted literals with periods | The spec puts each literal in a text block. |
| S57: Articles and pronouns | The ci command, snapshot check and history clauses have named actors and objects. |
| S58: Four verbs for one event | The gate prints error codes. The history check skips records. |
| S59: The actor is the test | The gate reads the project manifest. |
| S60: It checks mergeParents | The design names isAdoptSource and the full hash check. |
| S61: An absent string file | The design names a record with no string file value. |
| S62: Its last own record | The design uses last adopt record and are not in the code inventory. |
| S63: A synthetic QA header needs | The QA register is the actor. The base tag rule also applies. |
| S64: Source clone | The design names the project clone, mutation tool and ci command. |
| S65: The accepted suffix | The design names records after the base history prefix. |
| S66: Within the base script | The proposal names the QA rule and says such scripts stay outside the code inventory. |
| S67: A boundary for strict checks | The proposal states the owner decision about owned and upstream code. |
| S68: A real merge of an own branch | The proposal names a branch that a person wrote in this project and AGENTS.md rule 21. |
| S69: Manifest entries that match no file | The gate does not check such entries. The proposal gives examples. |
| S70: It in when a change needs it | The proposal names the follow-up change and the way to waive absent line data. |
| S71: The old gate plural style | The proposal says the new messages use the old plural form. |
| S72: Survivor class L4 | The proposal names the known limit L4 of evidence.md. |
| S73: Task numbers are out of order | The task numbers now follow the document order. The Order note keeps the real history. |
| S74: State the no-ledger rule | The tasks name the owned file, diff process and owned gap lines. |
| S75: The coverage sentence stays | Rule 24 has no duplicate coverage sentence. |
| S76: Two backfill sentences | The second sentence now gives only the backfill name. |
| S77: The gate gives a header | Rule 22 names the synthetic header and the adopt command producer. |
| S78: New fault of title renames | Each old table has its title-date note. Current labels use live titles. |
| S79: All clear STE replacements apply | The old claim now names only the pass 4 table. The manifest lists files and the image has a Node result. |
| S80: Pass 2 text with old rules | The pass 4 note says the merge parent rule replaces the ancestor rule. |
| S81: D1 through D6 | The evidence links the pass 4 decisions to design.md and states the lead set the applied Purpose. |
| S82: Missing or absent source | The survivor rows say stops an absent source. |
| S83: Stop records with no string file | The evidence names the error code first and the cause second. |
| S84: Keeps base paths after manifest removal | The title names a change that removes or shortens a manifest path. |
| S85: Records a gap before the check | The title names the adopt command and no owned gap lines. |
| S86: Cryptic titles and two names | The titles name the empty comment, CR shebang and valid adopt record. |
| S87: Accepts an absent line report | The title names a run with no line data. |
| S88: Rejects bad history | The titles name the gate stop and the file in the adopt source. |
| S89: Owns the project sentinel files | The title names the gate, OSH layer and OSH provider paths. |
| S90: The message repeats the code | The message has no code prefix. The full lowercase hash wording follows D7. |

The S49, S50, S62, S67, S75, S77 and S79 corrections also close the open round 1 prose faults.
The active tree has no applied ownership spec. The design gives the Purpose text for the next archive.

### Search output

The search reads the Pass 5 work tree at base commit fbdb630ae4b8af37437e808a023f7569c9276510.

```text
D7
$ rg -n return typeof from|new Error scripts/spec/lib/ownership.mjs
16:    throw new Error('Use version 1 and unique safe relative paths in the owned array.');
61:    if (diff.status !== 0) throw new Error(`Git cannot read the diff of ${file}: ${diff.stderr}`);
76:    return typeof from === 'string' && /^[0-9a-f]{40}$/.test(from) && mergeParents(root, base).has(from);
91:      const error = new Error('Use an adopt record with a string file, a full lowercase from hash and a source that a merge after the base brought.');

D8
$ rg -n function adoptableQaScript|const eligible|adoptableQaScript\(\{ file, text scripts/spec/lib/qa-register.mjs
12:export function adoptableQaScript({ file, text, baseText, manifest }) {
47:    const eligible = baseText !== null ? !hasQaTag(baseText) : adopts.some(item => item.file === file);
48:    if (!header && eligible && adoptableQaScript({ file, text, baseText, manifest })) {

D8 producer
$ rg -n const qaFiles|const errors = measured.errors.filter|current: \{ .*qaFiles|result.history.push\(\{ date scripts/spec/gates.mjs
614:    const qaFiles = qaCandidates.filter(file => merged.has(file) &&
616:    const errors = measured.errors.filter(error => error.code !== 'QA-HEADER' || !qaFiles.includes(error.file));
620:      current: { ...measured.current, coverage: new Map([...measured.current.coverage].filter(([file]) => !qaFiles.includes(file))) },
629:      result.history.push({ date, change, commit: headCommit(root), kind: 'adopt', file, from: fromCommit, lines: 0, branches: 0, functions: 0, untraced: 0, untrue: false });

D9
$ rg -n Origin: backfill openspec/changes/ownership-scoped-gates/specs/ownership/spec.md
412:Origin: backfill
424:Origin: backfill
444:Origin: backfill
453:Origin: backfill

D9 order
$ rg -n Order note|Pass 4 wrote|Their tests close openspec/changes/ownership-scoped-gates/tasks.md
167:### Order note
169:Pass 4 wrote tests for ownership-037 through ownership-053 after the first code corrections.
174:Their tests close the phase time, source option, absent ledger, caller environment, allocation list and selected change trace gaps.

D10 QA inventory
$ rg -n qa-scripts-023 openspec/changes/ownership-scoped-gates/specs/ownership/spec.md
97:The scenario qa-scripts-019 does not apply to a synthetic header: the gate prints the QA advisory when no change name is given. The scenarios qa-scripts-002, qa-scripts-003 and qa-scripts-023 do not apply within this exception.

D10 history
$ rg -n Expected property name src/tooling/spec/ownershipGate.test.mjs
403:  assert.deepEqual(result.output.split('\n').filter(line => line.startsWith('ERROR ')), ["ERROR LEDGER-ADOPT-FROM openspec/trace/history.jsonl Expected property name or '}' in JSON at position 1 (line 1 column 2)"]);

D10 limits
$ rg -n three times|No real sync|Pass 4 has base openspec/changes/ownership-scoped-gates/proposal.md
92:Pass 4 has base commit bf174f99d5eb799c0f3fd17648b5b6042dab1402 and code commit 799372f0.
111:A full check run calls mergeParents three times for each valid adopt record. A sync with many adopt records can be slow.
113:No real sync or upstream class change has run through the new gates. The first sync will be the first real use.

D10 process
$ rg -n all ledger gaps|owner reads|synthetic header|writes the adopt record AGENTS.md
11:5. Keep each owned code file that a change adds or edits at 100% line, branch and function coverage. Each owned code file without a ledger entry also needs full coverage. The command `node scripts/spec/gates.mjs report` lists all ledger gaps of both classes. The target is zero owned gaps. Keep 100% line coverage for each line that a change adds or edits in a code file. For a sync, a changed line needs no coverage when it equals the file in the adopt source.
36:22. For a spec change, read the QA lines in the gate output. Avoid a conflict with a listed purpose. Add a header to each new QA script that the fork writes. The gate uses a synthetic header for an upstream QA script with no QA tag in its first comment block. For a script that exists at the base, the base header must also have no QA tag.
38:    For a new upstream script with no QA tag, a valid adopt record must name the script. Run the `adopt` command. The command writes the adopt record for that script. The covers item of that header is `unmapped: upstream`.
40:23. `openspec/ownership.json` lists the owned paths. For each new code file, add its path to the manifest or state the reason for its upstream class in the proposal. The owner reads each removal of an owned path from the manifest.

D10 survivor rows
$ rg -n ^\| (c9613|c9629|c9631|c9659|n0014)  openspec/changes/ownership-scoped-gates/evidence.md
1434:| c9613 | 26 | The moved read has no error or side effect on the readable fixture. |
1435:| c9629 | 26 | The local declaration has no effect before CI selects the change. |
1436:| c9631 | 26 | The moved read has no error or side effect on the readable fixture. |
1437:| c9659 | 26 | The independent QA, trace and ledger comparisons give the same errors and data. |
1438:| n0014 | 16 | The callers test the result as a Boolean. False and undefined both stop the source. |

D11 test titles
$ rg -n ^test\( src/tooling/spec/ownership.test.mjs
32:test('[ownership-001] gate accepts the manifest contract', () => fixture(({ root, put }) => {
38:test('[ownership-001] gate rejects each bad manifest field', () => {
47:test('[ownership-001] gate reports an absent or bad manifest file', () => fixture(({ root, put }) => {
53:test('[ownership-002] gate classifies exact paths and directory prefixes', () => {
60:test('[ownership-003] gate shows each path class and totals', () => {
65:test('[ownership-004] gate rejects all owned gap metrics', () => {
78:test('[ownership-005] gate reads only added diff ranges', () => {
82:test('[ownership-005] gate reads real edited new and deleted files', () => fixture(({ root, put }) => {
91:test('[ownership-006] gate keeps only lines that every duplicate record covers', () => {
98:test('[ownership-007] gate lists all uncovered changed lines in both classes', () => {
108:test('[ownership-008] gate limits a line waiver to its file hash, its metric and its count', () => {
115:test('[ownership-011] gate separates code and test gaps by class', () => {
122:test('[ownership-012] gate has the process rules in AGENTS.md and config.yaml', () => {
145:test('[ownership-013] gate writes merged DA counts for each code line', () => {
150:test('[ownership-013] gate stores line data in the snapshot', () => fixture(({ root, put }) => {
158:test('[ownership-004 ownership-008] gate ignores fractional and negative waiver counts', () => {
165:test('[ownership-007 ownership-008] gate rejects all line waivers for an untrue file', () => {
170:test('[ownership-004] gate reports each owned gap after an upstream file', () => {
174:test('[ownership-014] gate counts every test instance', () => {
181:test('[ownership-001] gate accepts the first and last characters of each allowed character range', () => {
184:test('[ownership-016] gate sorts all line numbers as numbers', () => {
188:test('[ownership-017] gate ignores extra line record text', () => {
192:test('[ownership-018] gate adds owned file gaps and waiver counts', () => {
198:test('[ownership-005] gate uses each Git diff option', () => fixture(({ root, put }) => {
210:test('[ownership-018] gate adds test counts across owned files', () => {
213:test('[ownership-019] gate counts zero instances for an empty name map', () => {
241:test('[ownership-020 ownership-025] gate needs no coverage for lines that equal the file in the adopt source', () => syncFixture(({ input }) => {
248:test('[ownership-021] gate needs coverage for a line that a person resolved by hand', () => syncFixture(({ root, put, git, commit, base, from, input }) => {
259:test('[ownership-022] gate needs coverage for an author edit to an upstream line', () => syncFixture(({ put, commit, input }) => {
267:test('[ownership-023] gate uses the last adopt source for each file and the last source for other files', () => syncFixture(({ put, git, commit, from, adopt, input }) => {
278:test('[ownership-024] gate stops for a source commit that the repository lacks or that no merge brought', () => syncFixture(({ git, put, commit, input, adopt, base }) => {
287:test('[ownership-024] gate keeps the base diff rule without current adopt sources', () => syncFixture(({ input, adopt }) => {
296:test('[ownership-024] gate skips base adopt records and stops for non-string source values', () => syncFixture(({ input, adopt }) => {
308:test('[ownership-025] gate checks each line of an author rename absent from the source', () => syncFixture(({ git, commit, input }) => {
315:test('[ownership-026 ownership-027 ownership-028] gate accepts only unchanged owned gaps with a ledger entry', () => {
324:test('[ownership-029 ownership-001] gate keeps base paths after a change removes or shortens a manifest path', () => syncFixture(({ root, put, git, base: absentBase }) => {
345:test('[ownership-030] gate lists the gate, the OSH layer and the OSH provider as owned paths', () => {
349:test('[ownership-031] gate stops for an adopt record without a file at HEAD', () => syncFixture(({ input, git }) => {
356:test('[ownership-032] gate stops for a work branch adopt source', () => syncFixture(({ input, put, commit, adopt }) => {
360:test('[ownership-033] gate stops for an ancestor that no merge brought', () => syncFixture(({ input, base, adopt }) => {
363:test('[ownership-036] gate gives the diff a 256 MiB buffer', () => fixture(({ root, put }) => {
373:test('[ownership-031 ownership-024] gate stops for an invalid file or source and skips records with invalid counts', () => syncFixture(({ input, from, adopt }) => {
384:test('[ownership-041] gate stops for a number or revision name in the from field', () => syncFixture(({ input, git, from, adopt }) => {
391:test('[ownership-043] gate skips invalid adopt records outside the change', () => syncFixture(({ input }) => {
404:test('[ownership-050] gate stops for an invalid record after a valid record', () => syncFixture(({ input, from }) => {
409:test('[ownership-051 ownership-024] gate stops for an invalid source before a diff fault', () => syncFixture(({ input }) => {
430:test('[ownership-052] gate stops for a source name with a null byte', () => syncFixture(({ input, adopt }) => {
438:test('[ownership-031 ownership-041] gate stops for revision names in a merge HEAD history', () => syncFixture(({ input, git, from, adopt }) => {
450:test('[ownership-052] source check returns false when Git cannot read the merge parents', () => {
462:test('[ownership-031 ownership-041] source check rejects strings outside the hash pattern before it reads merge parents', () => {

D11 gate test titles
$ rg -n ^test\(|^  test\( src/tooling/spec/ownershipGate.test.mjs
128:test('[ownership-001] gate stops for an absent manifest', () => withFixture(root => {
135:test('[ownership-011] gate reads the ledger without tests or a base', () => withFixture(root => {
145:test('[ownership-003 ownership-007] gate prints classes and rejects an upstream line gap', () => withFixture(root => {
157:test('[ownership-003 ownership-004] gate rejects an owned gap before the ratchet command writes the ledger', () => withFixture(root => {
169:test('[ownership-007] gate rejects uncovered changed upstream lines in CI', () => withFixture(root => {
184:test('[ownership-026] gate records a gap with the adopt command and prints no owned gap lines', () => withFixture(root => {
204:test('[ownership-037] gate stops when Git cannot read a code diff', () => withFixture(root => {
226:test('[ownership-009 ownership-013] gate uses the manifest and snapshot line data', () => withFixture(root => {
245:test('[ownership-013] gate accepts a run with no line data', () => withFixture(root => {
251:test('[ownership-011] gate uses the manifest for ledger paths', () => withFixture(root => {
257:test('[ownership-010] gate still prints QA-HEADER errors', () => withFixture(root => {
266:test('[ownership-020 ownership-022] gate accepts merged lines and rejects an author line', () => withFixture(root => {
287:  test(`[ownership-${id}] gate ${edit ? 'rejects a recorded gap in an edited owned file' : 'accepts a recorded gap in an unchanged owned file'}${mode ? ' with a new file mode' : ''}`, () => withFixture(root => {
313:test('[ownership-028] gate rejects a new owned gap without a ledger entry', () => withFixture(root => {
325:test('[ownership-031 ownership-024] gate checks the adopt source commit before a bad base ledger', () => withFixture(root => {
337:test('[ownership-038] gate stops for bad history before the owned gap lines', () => withFixture(root => {
347:test('[ownership-029] gate stops for an invalid base manifest before the test run', () => withFixture(root => {
356:test('[ownership-029 ownership-027] gate rejects a gap after its base owned path is removed', () => withFixture(root => {
369:test('[ownership-039] gate stops for a work source in the adopt command', () => withFixture(root => {
380:test('[ownership-040] gate uses the CI change for a file that a valid adopt record names', () => withFixture(root => {
398:test('[ownership-038] gate stops for bad JSON without a change before the owned gap lines', () => withFixture(root => {
408:test('[ownership-042] gate skips a base adopt record before the test run', () => withFixture(root => {
422:test('[ownership-044] gate uses the synthetic header with a snapshot and a valid adopt record', () => withFixture(root => {
442:test('[ownership-045] gate names the measurement phase', () => withFixture(root => {
453:test('[ownership-046] gate stops for an absent adopt source commit', () => withFixture(root => {
461:test('[ownership-047] gate stops for a valid adopt source without a ledger', () => withFixture(root => {
474:test('[ownership-048] gate passes the measurement environment and allocation list', () => withFixture(root => {
490:test('[ownership-049] gate stops for an untraced change scenario in both measurement modes', () => withFixture(root => {
513:test('[gap-ledger-111] stops an invalid baseline before the test run', () => withFixture(root => {
526:test('[ownership-053] gate omits the Class, Ownership and Owned gaps lines from CI and init', () => withFixture(root => {
555:test('[ownership-031 ownership-041] gate stops for revision names in CI merge HEAD history', () => withFixture(root => {
571:test('[ownership-054] gate writes the QA adopt record with a full hash from HEAD^2', () => withFixture(root => {
583:test('[ownership-054] gate writes the QA adopt record beside a coverage gap record', () => withFixture(root => {
591:test('[ownership-054 ownership-035] gate stops the adopt command for QA files outside the exception', () => {
607:test('[ownership-054] gate writes a QA adopt record for a base script without a QA tag', () => withFixture(root => {
618:test('[ownership-054] adopt command writes no QA record for an absent current file', () => withFixture(root => {
630:test('[ownership-054] adopt command stops for a coverage ignore error in the eligible QA file', () => withFixture(root => {
642:test('[ownership-054] adopt command writes one record for each QA file from both candidate lists', () => withFixture(root => {

D11 QA test titles
$ rg -n ^test\( src/tooling/spec/qaRegister.test.mjs
38:test('[qa-scripts-001] accepts a shebang and reads all four tags', () => fixture(({ put, scan }) => {
45:test('[qa-scripts-002] rejects code before the first block', () => fixture(({ put, scan }) => { put(FILE, `export {};\n${header()}`); headerError(scan()); }));
46:test('[qa-scripts-003] rejects an absent tag', () => fixture(({ put, scan }) => { put(FILE, header().replace(' * @needs A browser and a server.\n', '')); headerError(scan()); }));
47:test('[qa-scripts-004] rejects a repeated tag', () => fixture(({ put, scan }) => { put(FILE, header().replace(' * @covers', ' * @purpose Another purpose.\n * @covers')); headerError(scan()); }));
48:test('[qa-scripts-005] rejects an empty tag', () => fixture(({ put, scan }) => { put(FILE, header().replace('@run node scripts/qa-example.mjs', '@run ')); headerError(scan()); }));
49:test('[qa-scripts-006] rejects a covers item with a space', () => fixture(({ put, scan }) => { put(FILE, header('pending:example, pending:other')); headerError(scan()); }));
50:test('[qa-scripts-007] accepts a capability folder', () => fixture(({ put, scan }) => { put(FILE, header('example')); put('openspec/specs/example/spec.md'); assert.deepEqual(scan().errors, []); }));
51:test('[qa-scripts-008] reports an unknown capability', () => fixture(({ put, scan }) => { put(FILE, header('example')); assert.deepEqual(scan().errors, [{ code: 'QA-COVERS-UNKNOWN', file: FILE, message: 'scripts/qa-example.mjs: example has no capability folder in openspec/specs/.' }]); }));
52:test('[qa-scripts-009] accepts an open pending area', () => fixture(({ put, scan }) => { put(FILE, header('pending:example')); assert.deepEqual(scan().errors, []); }));
53:test('[qa-scripts-010] reports a pending area that has a capability folder', () => fixture(({ put, scan }) => { put(FILE, header('pending:example')); put('openspec/specs/example/spec.md'); assert.deepEqual(scan().errors, [{ code: 'QA-COVERS-LANDED', file: FILE, message: 'scripts/qa-example.mjs: replace pending:example with example; its capability folder exists.' }]); }));
54:test('[qa-scripts-011] accepts one unmapped reason', () => fixture(({ put, scan }) => { put(FILE, header('unmapped: No area fits this check')); assert.deepEqual(scan().errors, []); }));
55:test('[qa-scripts-012] rejects an unmapped list', () => fixture(({ put, scan }) => { put(FILE, header('unmapped: reason,pending:example')); headerError(scan()); }));
56:test('[qa-scripts-016] gives delta advice with the script purpose', () => fixture(({ root, put, scan }) => { put(FILE, header('example')); put('openspec/specs/example/spec.md'); put('openspec/changes/add-example/specs/example/spec.md'); assert.deepEqual(qaAdvice({ root, change: 'add-example', scripts: scan().scripts }), ['QA: scripts/qa-example.mjs covers example: Prove that the layer works.']); }));
57:test('[qa-scripts-017] gives advice for a backfill area', () => fixture(({ root, put, scan }) => { put(FILE, header('pending:example')); put('openspec/changes/backfill-example/proposal.md'); assert.deepEqual(qaAdvice({ root, change: 'backfill-example', scripts: scan().scripts }), ['QA: scripts/qa-example.mjs covers example: Prove that the layer works.']); }));
58:test('[qa-scripts-018] gives the no match line', () => fixture(({ root, put, scan }) => { put(FILE, header()); put('openspec/changes/add-other/specs/other/spec.md'); assert.deepEqual(qaAdvice({ root, change: 'add-other', scripts: scan().scripts }), ['QA: no script covers the capabilities of this change.']); }));
59:test('[qa-scripts-019] gives no advice without a change', () => fixture(({ root, put, scan }) => { put(FILE, header()); assert.deepEqual(qaAdvice({ root, scripts: scan().scripts }), []); }));
60:test('[qa-scripts-020] tells authors to read advice and add a header', () => {
66:test('[qa-scripts-021] gives QA lines to the spec adversary', () => {
70:test('[qa-scripts-022] asks the spec adversary to read each QA check', () => {
77:test('[qa-scripts-023] checks all tracked QA scripts in this repository', () => {
85:test('[qa-scripts-026] gives advice from an archived change', () => fixture(({ root, put, scan }) => { put(FILE, header('example')); put('openspec/specs/example/spec.md'); put('openspec/changes/archive/2026-09-26-add-example/specs/example/spec.md'); assert.deepEqual(qaAdvice({ root, change: 'add-example', scripts: scan().scripts }), ['QA: scripts/qa-example.mjs covers example: Prove that the layer works.']); }));
86:test('[qa-scripts-027] sorts advice by script then capability', () => fixture(({ root, put, scan }) => {
96:test('[qa-scripts-028] rejects a header continuation line', () => fixture(({ put, scan }) => { put(FILE, header().replace(' * @covers', ' * Extra text.\n * @covers')); headerError(scan()); }));
98:test('[qa-scripts-005] rejects a purpose without a final mark', () => fixture(({ put, scan }) => {
102:test('[qa-scripts-005] rejects an empty needs value', () => fixture(({ put, scan }) => {
106:test('[qa-scripts-018] gives no match advice for an unknown change', () => fixture(({ root, put, scan }) => {
110:test('[qa-scripts-025] sorts two covers errors for one script', () => fixture(({ put, scan }) => {
116:test('[qa-scripts-008] rejects a file that has a capability name', () => fixture(({ put, scan }) => {
122:test('[qa-scripts-025] gives no advice for invalid covers items', () => fixture(({ root, put, scan }) => {
130:test('[qa-scripts-011] gives no advice for an unmapped reason', () => fixture(({ root, put, scan }) => {
136:test('[qa-scripts-025] gives no advice for a file with a capability name', () => fixture(({ root, put, scan }) => {
144:test('[ownership-009] QA register uses a synthetic upstream QA header', () => fixture(({ root, put }) => {
153:test('[ownership-010] QA register rejects an owned script with no header and an upstream script with an invalid header', () => fixture(({ root, put }) => {
161:test('[ownership-009 ownership-010] QA register keeps a valid upstream QA header and its capability checks', () => fixture(({ root, put }) => {
169:test('[ownership-015] QA register accepts an upstream first comment with no QA tags', () => fixture(({ root, put }) => {
178:test('[ownership-010] QA register rejects an upstream QA block with no end', () => fixture(({ root, put }) => {
183:test('[ownership-010] QA register rejects a bad upstream QA block after a shebang', () => fixture(({ root, put }) => {
188:test('[ownership-010] QA register rejects a shebang inside a QA comment', () => fixture(({ root, put }) => {
193:test('[ownership-009] QA register uses the synthetic header for a later comment', () => fixture(({ root, put }) => {
200:test('[ownership-034] QA register prints QA-HEADER for a new script that no adopt record names', () => fixture(({ root, put }) => {
207:test('[ownership-035] QA register prints QA-HEADER after a base header is deleted', () => fixture(({ root, put }) => {
214:test('[ownership-009 ownership-015] QA register uses a file that a valid adopt record names for the synthetic header', () => fixture(({ root, put }) => {
223:test('[ownership-010] QA register rejects an owned base script without a header', () => fixture(({ root, put }) => {
230:test('[ownership-009] QA register uses a file that a valid adopt record names among other records', () => fixture(({ root, put }) => {
239:test('[ownership-009] QA register gives the synthetic header when an empty comment comes before a comment with a QA tag', () => fixture(({ root, put }) => {
246:test('[ownership-010] QA register prints a QA error after an empty shebang', () => fixture(({ root, put }) => {
252:test('[ownership-009] QA register gives the synthetic header when code follows a shebang that ends with CR', () => fixture(({ root, put }) => {
259:test('[ownership-035] QA register prints QA-HEADER for a base QA tag even with an adopt record', () => fixture(({ root, put }) => {
266:test('[ownership-054] QA adopt helper accepts only upstream scripts with no current or base QA tag', () => {

D11 definition and literals
$ rg -n valid adopt record is|condition|ERROR |Phase measure|QA-HEADER|read.*without a base|whole DA|waivers waive|test instances|\*\*(WHEN|THEN|AND)\*\* openspec/changes/ownership-scoped-gates/specs/ownership/spec.md
10:- **WHEN** the gate reads valid and invalid manifest files
11:- **THEN** the gate accepts valid files and prints OWNERSHIP-MANIFEST for absent or invalid files
12:- **AND** when the gate reads the manifest without a base, the gate uses only the current manifest
19:- **WHEN** the manifest lists `single.js` and `src/own/`
20:- **THEN** `single.js` and `src/own/a.js` have the owned class
21:- **AND** `single.jsx` and `src/owner/a.js` have the upstream class
30:- **WHEN** check or ratchet has paths in the diff
31:- **THEN** the log names each class and shows Ownership: N owned, M upstream
34:- **WHEN** a ledger has a recorded owned gap and the command is ci or init
35:- **THEN** the gate prints no Class, Ownership or Owned gaps line
36:- **AND** init stops before the owned gap line code because the ledger exists
44:- **WHEN** a changed owned code file or an owned code file without a ledger entry has a gap
45:- **THEN** the gate prints COVERAGE-OWNED unless valid waivers waive all gap counts
52:- **WHEN** the diff has added, edited or deleted lines
53:- **THEN** the gate selects only the new line numbers and all lines of a new file
60:- **WHEN** a file has duplicate LCOV records
61:- **THEN** the gate counts a line as covered only if every record covers it
68:- **WHEN** a changed line has no covered line data from a loaded file whose coverage is not untrue
69:- **THEN** the gate prints COVERAGE-DIFF with the file and all uncovered line numbers
76:- **WHEN** an uncovered changed line has a waiver
77:- **THEN** the file is loaded
78:- **AND** its coverage is not untrue
79:- **AND** its hash equals the waiver hash
80:- **AND** the waiver metric is lines
81:- **AND** the waiver count is not below the number of waived lines
101:- **WHEN** an upstream QA script has no header block at the start of the file
102:- **AND** the base file had no QA tag, or the script is new and a valid adopt record names the script
103:- **THEN** the QA register uses the covers item `unmapped: upstream` and prints the QA advisory
110:- **WHEN** an owned script has no header or an upstream script has an invalid first block
111:- **THEN** the QA register prints QA-HEADER and keeps all other register checks
118:- **WHEN** the ledger has owned and upstream code and test gaps
119:- **THEN** the report command lists the paths and totals of both classes without a test run
126:- **WHEN** an agent reads AGENTS.md and the OpenSpec context
127:- **THEN** the text says that a changed owned code file and an owned code file without a ledger entry need full coverage
128:- **AND** the text says that a changed line needs coverage and that a sync uses `adopt`
129:- **AND** the text says that review.md lists the files that a person resolved by hand
137:- **WHEN** the gate writes V8 coverage and a measurement snapshot
138:- **THEN** covered lines have the DA count 1 and uncovered lines have the DA count 0
139:- **AND** the snapshot check reads the line data for document mode
142:The report command MUST count all test instances in each ledger name map.
145:#### Scenario: Count test instances `ownership-014`
146:- **WHEN** one test name has a count of 2 and another has a count of 1
147:- **THEN** the report command prints a total of 3 test instances
154:- **WHEN** an upstream QA script starts with a comment block that has no QA tags
155:- **AND** the script meets the QA exception
156:- **THEN** the QA register uses the synthetic upstream header
157:- **AND** an invalid first block with a QA tag still prints QA-HEADER
164:- **WHEN** diff ranges or line records have lines 2, 10 and 20
165:- **THEN** the result has the order 2, 10, 20
168:The gate MUST accept only whole DA records and diff headers at the start of a line.
172:- **WHEN** a DA record has a text prefix or suffix, or a diff header has a text prefix
173:- **THEN** the gate ignores that record or header
180:- **WHEN** two owned files have 2 and 3 line gaps and two line waivers each waive one gap
181:- **THEN** the report command prints 5 line gaps and the waivers waive a count of 2
184:The report command MUST count zero test instances for an empty name map.
188:- **WHEN** a test file has an empty name map
189:- **THEN** the report command counts zero test instances
200:- **WHEN** a merge brings 5 code lines equal to the file in the adopt source
201:- **THEN** those lines need no changed line coverage
202:- **AND** the gate prints this line:
209:- **WHEN** a person resolves a conflict and line 1 of the result differs from the base file and the file in the adopt source
210:- **THEN** that line needs coverage
211:- **AND** the gate prints COVERAGE-DIFF for an uncovered line
214:- **WHEN** a person edits line 2 of an upstream file in the sync change
215:- **THEN** the line needs coverage if the line differs from the base file and from the file in the adopt source
216:- **AND** other lines that equal the file in the adopt source need no changed line coverage
219:- **WHEN** a change has more than one adopt source
220:- **THEN** each file uses the adopt source of its last valid adopt record and other files use the last adopt source
221:- **AND** a file absent from the adopt source needs coverage for all its base diff lines
224:- **WHEN** an adopt source commit is absent from the repository
226:- **THEN** the gate prints LEDGER-ADOPT-FROM and stops
227:- **AND** a change with no adopt source keeps the base diff rule
228:- **AND** an invalid source stops before the base ledger JSON check
231:- **WHEN** the upstream project deletes or renames a code file
232:- **THEN** deleted paths have no new lines and new paths use the same path in the adopt source without rename detection
233:- **AND** the line check reads only current code inventory paths
236:- **WHEN** an unchanged owned code file has a recorded gap
237:- **THEN** the owned coverage check passes
238:- **AND** the report and the owned gap lines of check and ratchet list the gap
239:- **AND** the adopt command prints no owned gap lines
242:- **WHEN** a changed owned code file has a recorded gap
243:- **THEN** the gate prints COVERAGE-OWNED
246:- **WHEN** a new owned code file has a gap and no ledger entry
247:- **THEN** the gate prints COVERAGE-OWNED
254:- **WHEN** the current manifest removes or shortens a base owned prefix
255:- **THEN** paths that the base manifest lists stay owned
256:- **AND** an absent base manifest is empty and an invalid base manifest gives OWNERSHIP-MANIFEST
257:- **AND** each path occurs once in the union manifest
260:- **WHEN** the gate reads the project manifest openspec/ownership.json
261:- **THEN** scripts/spec/gates.mjs, src/layers/osh/index.js and server/providers/osh.js are owned
271:A valid adopt record is a record that `adoptsOf` accepts for this change and that meets the next condition.
280:- **WHEN** an adopt record for this change has no file and its `from` value is `HEAD`
281:- **THEN** the gate prints LEDGER-ADOPT-FROM
282:- **AND** a short hash, a branch name, `HEAD^2`, `origin/source`, an uppercase hash and a hash with a space make the gate print LEDGER-ADOPT-FROM
283:- **AND** no such record exempts a line from COVERAGE-DIFF
284:- **AND** the source check reads no merge parents for strings that do not match the hash pattern
285:- **AND** the gate prints this error line:
288:ERROR LEDGER-ADOPT-FROM openspec/trace/history.jsonl Use an adopt record with a string file, a full lowercase from hash and a source that a merge after the base brought.
292:- **WHEN** an adopt record names a work branch commit that no merge brought
293:- **THEN** the gate prints LEDGER-ADOPT-FROM
296:- **WHEN** an adopt record names an ancestor that no merge after the base brought
297:- **THEN** the gate prints LEDGER-ADOPT-FROM
300:- **WHEN** an adopt record has the `from` value 1 and the Git branch named `1` points to a valid adopt source
301:- **THEN** the gate prints LEDGER-ADOPT-FROM
302:- **AND** the gate also prints LEDGER-ADOPT-FROM for the string value `1`
305:- **WHEN** a valid adopt record comes before a record for this change without a file
306:- **THEN** the gate prints LEDGER-ADOPT-FROM for the later record
309:- **WHEN** the `from` string of an adopt record has a null byte
310:- **THEN** the gate prints LEDGER-ADOPT-FROM with the same message as ownership-031
311:- **AND** the source check returns false when Git cannot read the merge parents
314:The QA register MUST print QA-HEADER for a script with no current header in these cases.
319:- **WHEN** a new upstream script has no header and no valid adopt record names it
320:- **THEN** the QA register prints QA-HEADER
323:- **WHEN** an upstream script had a QA tag at the base and has no header now
324:- **THEN** the QA register prints QA-HEADER even when a valid adopt record names the script
331:- **WHEN** the gate starts the Git diff process
332:- **THEN** maxBuffer is 268435456 bytes
339:- **WHEN** Git cannot read a diff
340:- **THEN** the gate prints COVERAGE-DIFF before the base ledger check
343:- **WHEN** history has a line with the text `{`
344:- **THEN** the run stops before the owned gap lines
345:- **AND** a run without a change name also stops before the owned gap lines
346:- **AND** the gate prints this error line:
349:ERROR LEDGER-ADOPT-FROM openspec/trace/history.jsonl Expected property name or '}' in JSON at position 1 (line 1 column 2)
354:- **WHEN** an adopt source is invalid and Git cannot read the diff
355:- **THEN** LEDGER-ADOPT-FROM stops the run before the diff process starts
362:- **WHEN** the adopt command names a work branch commit that no merge after the base brought
363:- **THEN** the gate prints GATES-ADOPT before the test run
364:- **AND** a source named HEAD has this literal error line:
367:ERROR GATES-ADOPT The commit HEAD is not a merged commit. It must be a parent, other than the first parent, of a merge commit after the base commit.
376:- **WHEN** the ci command selects a change with a valid adopt record for a new upstream QA script
377:- **THEN** the QA register uses the synthetic header for that script
378:- **AND** the log has no QA-HEADER error
385:- **WHEN** a base history record lacks a file and the current history has the same record
386:- **THEN** the gate prints no LEDGER-ADOPT-FROM error for that record
387:- **AND** the gate starts the test run
394:- **WHEN** an invalid adopt record names another change, no change is selected, or the history does not start with the base history
395:- **THEN** the line check keeps the base diff rule without LEDGER-ADOPT-FROM
402:- **WHEN** a trusted snapshot has a new QA script with no header and a valid adopt record
403:- **THEN** the snapshot check uses the synthetic header without QA-HEADER
404:- **AND** the snapshot check prints this text because the selected change has one scenario with one passed test:
415:- **WHEN** a measurement takes 2 seconds on the test clock
416:- **THEN** the gate prints this line:
419:Phase measure: 2 s
427:- **WHEN** the adopt command names a commit `absent` that the repository lacks
428:- **THEN** the gate prints this error line:
431:ERROR GATES-ADOPT Git cannot find the commit absent
435:- **WHEN** the adopt command names a valid merged source and no ledger exists
436:- **THEN** the gate prints this error line:
439:ERROR GATES-ADOPT openspec/trace/gaps.json is not there. Run: node scripts/spec/gates.mjs init
447:- **WHEN** the caller sets MEASUREMENT_TOKEN to token and lists tools/other.test.mjs as an allocation file
448:- **THEN** the child environment has MEASUREMENT_TOKEN with the value token
449:- **AND** the allocation run names tools/other.test.mjs and uses --expose-gc
456:- **WHEN** a measurement or a trusted snapshot has no assertion for scenario demo-001 of the selected active change
457:- **THEN** the gate prints TRACE-UNVERIFIED for demo-001
464:A QA-HEADER error for such a script must not stop the adopt command.
471:- **WHEN** a merge brings one or more new upstream QA scripts with no QA tag and the adopt command names `HEAD^2`
472:- **THEN** the adopt command writes one record for each script with the full hash of the second parent
473:- **AND** lines, branches, functions and untraced are 0 and untrue is false
474:- **AND** the next gate run uses the synthetic header
475:- **AND** an owned script with no header, or a script that the merged commit did not change, keeps QA-HEADER
476:- **AND** an invalid current header or a deleted base QA header keeps QA-HEADER
477:- **AND** a merged upstream base script with no current or base QA tag gets one zero-count adopt record
478:- **AND** any other error stops the adopt command without a new record
479:- **AND** a coverage ignore comment in that QA script makes the gate print COVERAGE-IGNORE and write no adopt record
480:- **AND** the adopt command writes no QA record for an absent current file

D11 tasks
$ rg -n ^- \[.*\] [1-7]\. openspec/changes/ownership-scoped-gates/tasks.md
3:- [x] 1.1 Write the test for `ownership-001`.
4:- [x] 1.2 Write the test for `ownership-002`.
5:- [x] 1.3 Write the test for `ownership-003`.
6:- [x] 1.4 Write the test for `ownership-004`.
7:- [x] 1.5 Write the test for `ownership-005`.
8:- [x] 1.6 Write the test for `ownership-006`.
9:- [x] 1.7 Write the test for `ownership-007`.
10:- [x] 1.8 Write the test for `ownership-008`.
11:- [x] 1.9 Write the test for `ownership-009`.
12:- [x] 1.10 Write the test for `ownership-010`.
13:- [x] 1.11 Write the test for `ownership-011`.
14:- [x] 1.12 Write the test for `ownership-012`.
16:- [x] 1.13 Write the test for `ownership-013`.
18:- [x] 1.14 Write the test for `ownership-014`.
19:- [x] 1.15 Write the test for `ownership-015`.
21:- [x] 1.16 Write the test for `ownership-016`.
22:- [x] 1.17 Write the test for `ownership-017`.
23:- [x] 1.18 Write the test for `ownership-018`.
25:- [x] 1.19 Write the test for `ownership-019`.
27:- [x] 1.20 Write the test for `ownership-020`.
28:- [x] 1.21 Write the test for `ownership-021`.
29:- [x] 1.22 Write the test for `ownership-022`.
30:- [x] 1.23 Write the test for `ownership-023`.
31:- [x] 1.24 Write the test for `ownership-024`.
32:- [x] 1.25 Write the test for `ownership-025`.
33:- [x] 1.26 Write the test for `ownership-026`.
34:- [x] 1.27 Write the test for `ownership-027`.
35:- [x] 1.28 Write the test for `ownership-028`.
39:- [x] 2.1 Add the manifest and path class module.
40:- [x] 2.2 Add the coverage checks.
41:- [x] 2.3 Add snapshot data.
42:- [x] 2.4 Add the QA exception.
43:- [x] 2.5 Add the report command.
44:- [x] 2.6 Update the process text.
48:- [x] 3.1 Run host tests.
49:- [x] 3.2 Measure coverage for each changed script.
50:- [x] 3.3 Run the automatic mutation tool.
51:- [x] 3.4 Assess each survivor.
52:- [x] 3.5 Run the format check.
53:- [x] 3.6 Run STE lint.
54:- [x] 3.7 Commit code, tests and input files before the lead runs ratchet.
55:- [ ] 3.8 Ask the lead to run make ratchet CHANGE=ownership-scoped-gates in the image.
56:- [ ] 3.9 Ask the lead to run the two review agents and write review.md.
57:- [ ] 3.10 Ask the lead to run make gates CHANGE=ownership-scoped-gates on the final tree.
61:- [x] 4.1 Write tests for `ownership-020` through `ownership-025` before code.
62:- [x] 4.2 Add the source diff intersection.
63:- [x] 4.3 Add the count report.
64:- [x] 4.4 Update the process text for sync lines.
65:- [x] 4.5 Run host tests.
66:- [x] 4.6 Measure coverage.
67:- [x] 4.7 Run mutations.
68:- [x] 4.8 Run lint.
69:- [x] 4.9 Run the format check.
70:- [x] 4.10 Record proof.
71:- [x] 4.11 Commit the pass 2 files.
75:- [x] 5.1 Set fixed Git config and identity for the tests.
76:- [x] 5.2 Add the check for changed owned files and for owned files without a ledger entry.
77:- [x] 5.3 Print the owned gap lines in the check and ratchet output.
78:- [x] 5.4 Run host checks.
79:- [x] 5.5 Record all results.
80:- [x] 5.6 Commit the pass 3 code, tests and process text.
84:- [x] 6.1 Write the tests for `ownership-029`.
85:- [x] 6.2 Write the tests for `ownership-030`.
86:- [x] 6.3 Write the tests for `ownership-031`.
87:- [x] 6.4 Write the tests for `ownership-032`.
88:- [x] 6.5 Write the tests for `ownership-033`.
89:- [x] 6.6 Write the tests for `ownership-034`.
90:- [x] 6.7 Write the tests for `ownership-035`.
91:- [x] 6.8 Write the tests for `ownership-036`.
92:- [x] 6.9 Write the tests for `ownership-037`.
93:- [x] 6.10 Write the tests for `ownership-038`.
95:- [x] 6.11 Share the adopt source predicate.
96:- [x] 6.12 Stop the gate for records of this change with no string file or full source hash.
97:- [x] 6.13 Limit the synthetic QA header exception.
98:- [x] 6.14 Add the base manifest union.
99:- [x] 6.15 State the rule for an owned code file without a ledger entry.
100:- [x] 6.16 Set the output buffer of the Git diff process.
101:- [x] 6.17 Correct the round 1 prose faults.
102:- [x] 6.18 Run the named mutations.
103:- [x] 6.19 Run the full host tests.
104:- [x] 6.20 Measure coverage for each changed script.
105:- [x] 6.21 Run the automatic mutation tool.
106:- [x] 6.22 Assess each survivor.
107:- [x] 6.23 Run the format check.
108:- [x] 6.24 Run STE lint.
109:- [x] 6.25 Record the pass 4 results.
110:- [x] 6.26 Commit the pass 4 files.
112:- [x] 6.27 Write the test for `ownership-039`.
114:- [x] 6.28 Write the test for `ownership-040`.
116:- [x] 6.29 Read adopt sources after CI selects the change.
117:- [x] 6.30 Stop for bad history JSON before the owned gap lines, also when no change is selected.
119:- [x] 6.31 Write the test for `ownership-041`.
121:- [x] 6.32 Write the test for `ownership-042`.
123:- [x] 6.33 Write the test for `ownership-043`.
124:- [x] 6.34 Write the test for `ownership-044`.
125:- [x] 6.35 Write the test for `ownership-045`.
127:- [x] 6.36 Write the test for `ownership-046`.
128:- [x] 6.37 Write the test for `ownership-047`.
130:- [x] 6.38 Write the test for `ownership-048`.
132:- [x] 6.39 Write the test for `ownership-049`.
134:- [x] 6.40 Write the test for `ownership-050`.
136:- [x] 6.41 Write the test for `ownership-051`.
138:- [x] 6.42 Write the test for `ownership-052`.
139:- [x] 6.43 Return false when Git cannot read an adopt source name.
141:- [x] 6.44 Write the test for `gap-ledger-111`.
143:- [x] 6.45 Write the test for `ownership-053`.
147:- [x] 7.1 Write the Pass 5 words table.
148:- [x] 7.2 Change the spec for D7 through D10.
149:- [x] 7.3 Write the red tests for `ownership-054`.
150:- [x] 7.4 Reject revision names in history records.
151:- [x] 7.5 Apply the base QA tag rule.
152:- [x] 7.6 Add the QA adopt record producer.
153:- [x] 7.7 Correct the round 2 prose faults.
154:- [x] 7.8 Run each host test file.
155:- [x] 7.9 Measure each changed script.
156:- [x] 7.10 Run the named faults.
157:- [x] 7.11 Add the same-file error test for `ownership-054`.
158:- [x] 7.12 Run the automatic mutation tool.
159:- [x] 7.13 Assess each survivor.
160:- [ ] 7.14 Run lint.
161:- [ ] 7.15 Run the format check.
162:- [ ] 7.16 Run the title echo check.
163:- [ ] 7.17 Run OpenSpec show and validate.
164:- [ ] 7.18 Compare document headings.
165:- [ ] 7.19 Commit the Pass 5 files.

D11 clauses
$ rg -n text says that review|no valid adopt record|valid adopt record must|owned gap lines|measurement phase under|parent, other than|test instances|waivers waive|upstream file|records after|snapshot check MUST openspec/changes/ownership-scoped-gates/specs/ownership/spec.md
25:The owned gap lines apply only to check and ratchet.
26:Invalid history stops before the owned gap lines. The owned gap lines come before the changed line check.
45:- **THEN** the gate prints COVERAGE-OWNED unless valid waivers waive all gap counts
86:For a new script, a valid adopt record must name the script.
129:- **AND** the text says that review.md lists the files that a person resolved by hand
142:The report command MUST count all test instances in each ledger name map.
145:#### Scenario: Count test instances `ownership-014`
147:- **THEN** the report command prints a total of 3 test instances
181:- **THEN** the report command prints 5 line gaps and the waivers waive a count of 2
184:The report command MUST count zero test instances for an empty name map.
189:- **THEN** the report command counts zero test instances
214:- **WHEN** a person edits line 2 of an upstream file in the sync change
225:- **OR** the commit is not a parent, other than the first parent, of a merge commit after the base
238:- **AND** the report and the owned gap lines of check and ratchet list the gap
239:- **AND** the adopt command prints no owned gap lines
267:The commit must be a parent, other than the first parent, of a merge commit after the base.
315:The script is new and no valid adopt record names the script, or the base header has a QA tag.
319:- **WHEN** a new upstream script has no header and no valid adopt record names it
342:#### Scenario: Stop the gate for bad history before the owned gap lines `ownership-038`
344:- **THEN** the run stops before the owned gap lines
345:- **AND** a run without a change name also stops before the owned gap lines
367:ERROR GATES-ADOPT The commit HEAD is not a merged commit. It must be a parent, other than the first parent, of a merge commit after the base commit.
381:The history check MUST read only records after the base history prefix.
398:The snapshot check MUST use the current valid adopt records for QA headers.
411:The gate MUST print the time of the measurement phase under the name measure.
452:The measurement and the snapshot check MUST check the scenarios of the selected change.

D11 design
$ rg -n With a base|isAdoptSource checks|last adopt record|are not in|clone of the project|automatic mutation tool does|allocation file list openspec/changes/ownership-scoped-gates/design.md
9:- owned: With a base, a path is owned when the base manifest or the current manifest lists it. Without a base, only the current manifest counts.
100:Each file uses its last adopt record. A file without a record uses the last adopt source in the change.
102:Use isAdoptSource for the adopt command, checkAdopts and syncChangedLines. The function isAdoptSource checks the full lowercase hash and mergeParents(root, base).has(from).
121:Binary code files use the text diff rule. Binary non-code files are not in the code inventory.
166:That test runs in the clone of the project. The host adapter uses file output to avoid the host pipe error.
167:The host adapter reads that output during each test and stops on the first failed test, as the automatic mutation tool does.
173:The measurement uses the caller environment and the allocation file list. The phase time line names the phase measure.
229:| allocation file list | allocationFiles argument of measure |
277:With a base, a path is owned when the base manifest or the current manifest lists it.

D11 proposal
$ rg -n owner accepts|Such scripts|path is upstream|owner rejects|does not check manifest|follow-up change|plural form|known limit L4 openspec/changes/ownership-scoped-gates/proposal.md
3:The owner accepts that strict checks apply to owned code and not to upstream code.
57:Such scripts also stay outside the code inventory.
98:The path is upstream for the next change. The owner rejects each removal of an owned path when the owner reads the manifest diff.
100:The gate does not check manifest entries that match no file. For example, an entry can have a typo or lack its final slash.
103:The follow-up change html-shell-line-data must count HTML with no script as code with no code lines.
104:The follow-up change must also add a way to waive a file with no line data.
107:The new messages use the plural form for a count of 1, as the old messages do, for example 1 files.
109:Pass 4 adds the ci and init cases for the known limit L4 of evidence.md. Both cases use a recorded owned gap.

D11 historical prose
$ rg -n ^(The manifest lists all 1025|The image must supply|The merge parent rule replaces|The lead set the applied Purpose)|^\| c44(77|81|82)  openspec/changes/ownership-scoped-gates/evidence.md
11:The manifest lists all 1025 fork-only files from the requested tree comparison.
100:The image must supply the Node result of the image. No host result is an image gate verdict.
654:The merge parent rule replaces the ancestor rule of pass 2.
722:The lead set the applied Purpose after the archive. S36 keeps the plural style that the lead names.
1414:| c4477 | 6 | The earlier fault in the fault list stops an absent source. |
1415:| c4481 | 6 | The earlier fault in the fault list stops an absent source. |
1416:| c4482 | 6 | The earlier fault in the fault list stops an absent source. |
```

### Red runs and named faults

The red runs used the code from tree fbdb630ae4b8af37437e808a023f7569c9276510.
Red ownership and gate tests failed for revision names. The QA base-tag test failed because the register gave a synthetic header.
The two producer tests stopped with QA-HEADER. The red producer log also found an absent history file in a fixture.
The fixture now treats absent history as empty text.

The first base-script red run stopped in init because the fixture did not move the base ref. It gives no producer verdict.
The corrected fixture moves the base ref before init. The named drop-base-QA-producer fault fails that test.

The first regex fault passed because exact membership also rejects revision names. That result gave no proof of the regex check.
The spec now says the source check reads no merge parents for a string outside the hash pattern.
The new test checks the Git call count. The regex fault now fails that test.

The first catch test had a hash of 42 digits and reached no Git call. That test gave no proof of the catch path.
The corrected test uses 40 digits and checks one Git call. The source-catch-throw fault fails that test.


The automatic selector first used offsets from other files. That run stopped before the end and has no final verdict.
A second run stopped to add the shape test before the mutation phase. That run also has no final verdict.
The final selector compares each mutant with the changed lines of its own file.


The new producer first read each tracked merged file. A deleted current QA script caused an uncaught file read error.
The red-absent-QA.log test shows that fault. The producer now uses only the QA register scripts and QA-HEADER errors as candidates.
The absent script has no candidate and gets no record. The two candidate arms have named faults.

The automatic run stopped before the end for this correction and gives no final verdict.

### Named fault results

Command: `python3 /home/ianblenke/docker/gev-tools/ownership-gates/pass5/named-faults.py`.
The command ran each test process with taskset and nice. All 22 faults failed a test.
At Pass 5, the table and final logs use current titles.

| Fault | Failed test | Exit status |
|---|---|---:|
| source-catch-throw | [ownership-052] source check returns false when Git cannot read the merge parents | 1 |
| hash-regex-true | [ownership-031 ownership-041] source check rejects strings outside the hash pattern before it reads merge parents | 1 |
| drop-merge-membership | [ownership-032] gate stops for a work branch adopt source | 1 |
| revision-resolver | [ownership-031 ownership-024] gate stops for an invalid file or source and skips records with invalid counts | 1 |
| base-tag-adopt-override | [ownership-035] QA register prints QA-HEADER for a base QA tag even with an adopt record | 1 |
| drop-QA-exception | [ownership-009] QA register uses a synthetic upstream QA header | 1 |
| drop-base-QA-producer | [ownership-054] gate writes a QA adopt record for a base script without a QA tag | 1 |
| drop-base-QA-candidates | [ownership-054] gate writes a QA adopt record for a base script without a QA tag | 1 |
| drop-new-QA-candidates | [ownership-054] gate writes the QA adopt record with a full hash from HEAD^2 | 1 |
| drop-QA-coverage-filter | [ownership-054] gate writes the QA adopt record with a full hash from HEAD^2 | 1 |
| drop-QA-record | [ownership-054] gate writes the QA adopt record with a full hash from HEAD^2 | 1 |
| stop-eligible-QA | [ownership-054] gate writes the QA adopt record with a full hash from HEAD^2 | 1 |
| drop-merged-QA-bound | [ownership-054 ownership-035] gate stops the adopt command for QA files outside the exception | 1 |
| drop-other-error-code | [ownership-054] adopt command stops for a coverage ignore error in the eligible QA file | 1 |
| drop-other-error-stop | [ownership-054 ownership-035] gate stops the adopt command for QA files outside the exception | 1 |
| drop-base-QA-tag | [ownership-054] QA adopt helper accepts only upstream scripts with no current or base QA tag | 1 |
| drop-current-QA-tag | [ownership-054] QA adopt helper accepts only upstream scripts with no current or base QA tag | 1 |
| drop-QA-class | [ownership-054] QA adopt helper accepts only upstream scripts with no current or base QA tag | 1 |
| drop-history-error-code | [ownership-038] gate stops for bad history before the owned gap lines | 1 |
| extend-hash-count | [ownership-031 ownership-041] source check rejects strings outside the hash pattern before it reads merge parents | 1 |
| drop-hash-start-anchor | [ownership-031 ownership-041] source check rejects strings outside the hash pattern before it reads merge parents | 1 |
| keep-first-QA-record | [ownership-054] adopt command writes one record for each QA file from both candidate lists | 1 |

Pass 6 renamed these tests. The Pass 5 titles and results stay as records of that run.

The base-tag-adopt-override fault changes both base tag checks to allow the adopt record.
One check alone gives no proof because the other check still blocks the synthetic header.

The new same-file error test fails when the error code check is false.
That fault removes both QA-HEADER and COVERAGE-IGNORE for the eligible QA file.
The correct code keeps COVERAGE-IGNORE and writes no adopt record.

### Host tests and coverage

Tree read: fbdb630ae4b8af37437e808a023f7569c9276510. These checks use the Pass 5 work tree.
All commands use taskset and nice, as the brief says. Each process runs one test file.

| Test file | Tests | Passed | Failed | Log |
|---|---:|---:|---:|---|
| ownership.test.mjs | 50 | 50 | 0 | own-last.log |
| ownershipGate.test.mjs | 40 | 40 | 0 | gate-final-40.log |
| qaRegister.test.mjs | 49 | 49 | 0 | qa-last.log |
| v8Merge.test.mjs | 11 | 11 | 0 | green-v8Merge.log |
| gates.test.mjs, all cases | 227 | 223 | 4 | final-gates.log |
| gates.test.mjs, known four omitted | 223 | 223 | 0 | legacy-current.log |

The full legacy run failed only the four known host adapter cases. That run used the producer before the candidate correction.
The final code passed all 223 other legacy cases. The final producer passed all 40 ownership gate cases.

| Script | Lines hit / total | Branches hit / total | Functions hit / total |
|---|---:|---:|---:|
| scripts/spec/lib/ownership.mjs | 168 / 168 | 130 / 130 | 44 / 44 |
| scripts/spec/lib/qa-register.mjs | 92 / 92 | 94 / 94 | 16 / 16 |
| scripts/spec/gates.mjs | 776 / 776 | 389 / 389 | 97 / 97 |

Command:

```text
node /home/ianblenke/docker/gev-tools/ownership-gates/host-coverage.mjs <script> <raw directories>
```

Each script has 100% line, branch and function coverage. Each command checks one script.
The gate script uses only raw-legacy-current and raw-gate-final-40. Both runs used the final code.

The ownership script uses raw-own-last. The QA register uses raw-qa-last and raw-gate-final-40. Both runs used the final code.


### Automatic mutation results

Tree read: fbdb630ae4b8af37437e808a023f7569c9276510. The source hashes are in mutation-results-pass5.json.
The selector found 401 faults on changed script lines. Both phases finished.

| Phase | Killed | Crash | Survived |
|---|---:|---:|---:|
| Fast tests | 326 | 1 | 74 |
| Full tests of the 74 survivors | 50 | 0 | 24 |

The totals are 376 kills, one crash and 24 equivalent faults. The 22 named faults are separate from these totals.
The native results and each fault are in mutation-results-pass5.json.

The crash g4687 failed the coverage gap producer test and the base script producer test.

The crash changed a history record to undefined. JSON.parse then failed on the history line.

The first full phase finished with 47 kills and 27 survivors. The stop request arrived after that phase ended.
Three survivors were real faults: a0536, a0541 and g4681. New tests killed all three in the final full phase.

At Pass 5, the hash tests include a prefix before the hash and a hash with 41 digits.
The producer test uses two base scripts and two new scripts. It checks all four full-hash records.

The probe command compared each survivor with the correct code. Each row states the number of cases and the code reason.
The claims apply to the same readable tree, valid API input types and measurement data. Git refs must not change during a run.

| ID | Probe cases | Reason |
|---|---:|---|
| a1821 | 720 | The QA adopt helper rejects a current header with a QA tag. |
| a0517 | 70 | The regex and exact hash set reject non-string values. The history check first checks the string type. |
| a1800 | 720 | The QA adopt helper also rejects a base header with a QA tag. |
| a1805 | 720 | The QA adopt helper also rejects a base header with a QA tag. |
| g4627 | 48 | adoptLedger reads the entries with for-of. The array has the same unique entries as the Map. |
| g4496 | 48 | Any other error stays in the error list and stops the command before a record write. |
| g4497 | 48 | Any other error stays in the error list and stops the command before a record write. |
| g4516 | 48 | The checks give the same result for readable files. The merged set still bounds the records. |
| g4570 | 48 | Both checks have no side effects. |
| g9376 | 48 | The command arms are mutually exclusive and both return. |
| g9377 | 48 | The extra phase timer is unused in the adopt arm. No extra phase time line appears. |
| g9507 | 48 | The two declarations read separate data without side effects. |
| g9511 | 48 | adoptLedger computes data without a file write. The error stop discards that data. |
| g9513 | 48 | writeLedger changes no history record or Git ref. The QA records still precede appendHistory. |
| g9521 | 48 | adoptLedger reads the entries with for-of. The Set has the same unique entry arrays as the Map. |
| a0527 | 70 | The regex and exact hash set reject non-string values. The history check first checks the string type. |
| a0528 | 70 | Both checks have no side effects for valid API input types. |
| a9201 | 70 | adoptsOf reads records without side effects. The history check still checks each record before return. |
| a1475 | 720 | The checks have no side effects and give the same result for valid API input types. |
| a1485 | 720 | Both checks have no side effects. The manifest guard still precedes classify. |
| a1806 | 720 | The QA adopt helper also rejects a base header with a QA tag. |
| a1826 | 720 | The checks have no side effects and the QA adopt helper uses the same inputs. |
| a1830 | 720 | The QA adopt helper rejects a current header with a QA tag. |
| a1831 | 720 | Both checks have no side effects. |

Commands:

```text
node /home/ianblenke/docker/gev-tools/ownership-gates/pass5/equivalent-probe.mjs
python3 /home/ianblenke/docker/gev-tools/ownership-gates/pass5/named-anchor.py
python3 /home/ianblenke/docker/gev-tools/ownership-gates/pass5/named-multiple.py
```

The Node processes used taskset -c 4-7 and nice -n 19. The probe log is probe-final.log.
The anchor logs and the four-file log show the three more named fault failures.


### Self-check and final host checks

Tree read: fbdb630ae4b8af37437e808a023f7569c9276510. The Pass 5 self-check reads the code, scenario clauses and five test files.
The words table names the actors and objects. The scenario clauses and test titles name an outcome and match the code.
At Pass 5, each changed scenario has a changed tagged test. At Pass 5, the repeated-title check excludes only review reports and Old records.

```text
python3 /home/ianblenke/docker/gev-tools/ownership-gates/pass5/check-echoes.py
Live titles: 377
Labels checked: 175
Stale labels: 0
```

The heading check reads every change document and AGENTS.md against the base commit.
Only the proposal heading Known limits changes to Known limits and later changes, as the brief directs.
The five proposal headings match the brief. All other old headings stay the same.

The delta spec has 54 unique scenario IDs. No scenario clause uses bare it or the test as its actor.

OpenSpec show and validate both passed. The package boundary command passed; no new code module needs a manifest entry.
The mutation JSON file contains data, not code. The review report files have no diff.

No image command, full project gate, ratchet, archive or review agent ran in this pass.
The lead must run those checks. The host checks give no image gate or review verdict.


The final lint command has 0 errors and 584 warnings in lint-end4.log.
The diff check has no error output.

Command:

```text
taskset -c 4-7 nice -n 19 node scripts/spec/gates.mjs lint --change ownership-scoped-gates
```

The mutation report command reads the native results. Its total row is:

```text
all | 401 | 326 | 1 | 0 | 74 | 50 | 0 | 0 | 24 | 0 | 0
```

The columns are faults, phase 1 kills, crashes, timeouts and survivors, then phase 2 kills, crashes and timeouts.
The last three columns are real survivors and pending phase 1 and phase 2 faults.

Command:

```text
taskset -c 4-7 nice -n 19 node /home/ianblenke/docker/gev-tools/ownership-gates/pass5/automut-host.mjs report --mutants /home/ianblenke/docker/gev-tools/ownership-gates/pass5/mutants.json --results /home/ianblenke/docker/gev-tools/ownership-gates/pass5/results.json --out /home/ianblenke/docker/gev-tools/ownership-gates/pass5/survivors-final.md
```


The final format check passed with Checked 1158 source files in format-end.log.
The latest record lint passed with 0 errors and 585 warnings in lint-record.log.

Command:

```text
taskset -c 4-7 nice -n 19 node --import /home/ianblenke/docker/gev-tools/ownership-gates/pass2-format-shim.mjs scripts/format.mjs --check
```

The final OpenSpec outputs are show-end.json and validate-end.log. Both commands have exit status 0.
At Pass 5, the final heading audit and repeated-title check passed. At Pass 5, the source hashes still match mutation-results-pass5.json.

## Pass 6

Tree read: 1563dfd8fc15e380daf3b2605fa3fd6d06fd705e, branch ownership-gates.
The checks use the Pass 6 work tree.
The filed reviews and the past run tables stay as records of their own trees.

The Pass 6 words table defines the terms before the corrections.
The spec changes come before the test changes. The changes to the code that prints the message come after both failed runs.
At Pass 6, no new scenario ID or test is necessary. Old tests have stronger assertions.

### Corrections

| Finding | Correction |
|---|---|
| S91: This rule | The requirement names its priority before the definition of a valid adopt record. |
| S92: strict checks | The proposal states the whole-file boundary and the coverage rule for each changed upstream line. |
| S93: outside the exception | The title also names another error. The Pass 5 fault table has a note that names the new titles. |
| S94: CI merge HEAD | The title names a history with a merge HEAD. Its body runs check. |
| Spec major: Order note | The note limits the test-first claim to task 7.3 and lists the tests that came after code. |
| Spec minor: QA priority | The adopt QA requirement replaces qa-scripts-024 and gap-ledger-089 within the exception. |
| Spec minor: JSON text | ownership-038 checks the error code and stable message prefix, without V8 position text. |
| Spec minor: synthetic script | The proposal lists each check that the script loses, also for lines that a person wrote or resolved by hand. |
| Spec minor: 83 scripts | The known limit names qa-scripts-023 and the change of the count that a sync needs. |
| Spec minor: adopt file | The next-run assertion fails when the output has a LEDGER-ADOPT error code. |
| Spec minor: command and context | What Changes names ownership-054. ownership-012 has the new context clauses and assertions. |
| S95: OR line | ownership-024 has one WHEN line for both faults. The defined term adopt source keeps the sentence within 25 words. |
| S96: title subjects | Each changed title has no subject. The manifest title names classification. |
| S97: script name | The new prose uses the name repeated-title check. The Pass 5 script stays unchanged. |
| S98: verb forms | The four sentences use the simple past or simple present. |
| S99: voice | The caller gives the change name, or the gate selects no change. |
| S100: script inventory | The proposal names scripts with a synthetic header and the checks that they lose. |
| S101: header words | Rule 22 names the first comment block and the covers item of the synthetic header. |
| S102: context paragraph | The QA sentences have their own paragraph. Each paragraph has at most six sentences. |
| S103: task words | The tasks name each action. Tasks 7.17 and 7.17a name separate OpenSpec commands. |
| S104: glossary | The glossary has one row for each thing and no duplicate record-filter or merged-commit row. |
| S105: message | The message names the file name and the full lowercase hash in the from field. |
| S106: manifest diff | Both process documents and the rule test name the manifest diff that removes an owned path. |
| S107: init step | The scenario names the error and the step that prints the owned gap lines. |
| S108: JSON event | The spec, glossary and titles use one name for the JSON parse error in the history. |
| S109: source terms | The prose uses adopt source, QA advisory and base script. The known limit accepts the pinned output term by name. |
| S110: print and record | The scenarios name the QA-HEADER output and the command that writes the record. |
| S111: field and hash | The heading names a number or name. The helper titles name a value that is not a full hash. |
| S112: manifest use | Both design clauses say that the gate uses only the current manifest. |
| S113: sync commit | AGENTS.md, config.yaml and their assertions name the commit that the adopt command names. |

The qa-scripts-024 test uses an owned script. The gap-ledger-089 test stops for a failed test.
Neither test disagrees with the upstream QA exception.

### Order note

At Pass 6, the note said that only the first tests of task 7.3 preceded the code that task 7.6 added.
The later tests came after code tasks 7.4 through 7.6.
At Pass 6, the table in tasks.md names task 7.11, the call-count test, the base-script test and the absent-file test.
It also names the prefix, 41-digit and four-file tests that killed a0536, a0541 and g4681.
The note states the named fault of each test. It does not change the Pass 5 run records.

### Failed runs before code

Commands use taskset -c 4-7 nice -n 19 and the host.mjs adapter.
Each command runs one test file, with --test-reporter=spec.
The logs are under /home/ianblenke/docker/gev-tools/ownership-gates/pass6/.

| Log | Tests | Passed | Failed | Cause |
|---|---:|---:|---:|---|
| red-ownership.log | 50 | 47 | 3 | New process text and the new error message |
| red-ownershipGate.log | 40 | 39 | 1 | New error message |

The assertion for the JSON prefix and the assertion for the LEDGER-ADOPT codes pass against the correct code.
The named faults below show that each assertion fails against the opposite code.

### Named faults

Command: python3 /home/ianblenke/docker/gev-tools/ownership-gates/pass6/named-faults.py.
The command changes code in a copy of the tree of this pass. The copy has no branch.
Each process uses taskset and nice. Each fault has exit status 1 and a failed test.

| Fault | Code change | Failed test |
|---|---|---|
| history-error-code | Print LEDGER-OTHER for the JSON parse error | [ownership-038] stops for a JSON parse error in the history without a change before the owned gap lines |
| history-error-prefix | Print Wrong JSON text. for the JSON parse error | [ownership-038] stops for a JSON parse error in the history without a change before the owned gap lines |
| record-for-file-merge-did-not-change | Treat the adopt record as a record for a file that the merge did not change | [ownership-054] writes the QA adopt record with a full hash from HEAD^2 |
| old-adopt-message | Print the old adopt message | [ownership-031] stops for an adopt record without a file and with the hash of HEAD |
| drop-config-history-rule | Tell the author to write history records by hand | [ownership-012] has the process rules in AGENTS.md and config.yaml |

These titles are the names at the time of the run. Later corrections renamed some titles; the tags are unchanged.

### Automatic mutations

The host copy of the automatic mutation tool uses the Pass 5 operators and host adapter.
The tool selects mutations that touch the changed message line, with message mutations active.
Commands use taskset -c 4-7 nice -n 19.

```text
node /home/ianblenke/docker/gev-tools/ownership-gates/pass6/automut-host.mjs gen --root /home/ianblenke/docker/gev-work/ownership-gates --files scripts/spec/lib/ownership.mjs --messages --out /home/ianblenke/docker/gev-tools/ownership-gates/pass6/all-mutants.json
node /home/ianblenke/docker/gev-tools/ownership-gates/pass6/automut-host.mjs run --root /home/ianblenke/docker/gev-work/ownership-gates --mutants /home/ianblenke/docker/gev-tools/ownership-gates/pass6/mutants.json --tests src/tooling/spec/ownership.test.mjs --phase 1 --jobs 1 --slow-ms 1000 --out /home/ianblenke/docker/gev-tools/ownership-gates/pass6/results.json
node /home/ianblenke/docker/gev-tools/ownership-gates/pass6/automut-host.mjs run --root /home/ianblenke/docker/gev-work/ownership-gates --mutants /home/ianblenke/docker/gev-tools/ownership-gates/pass6/mutants.json --tests src/tooling/spec/ownership.test.mjs --phase 2 --jobs 1 --slow-ms 1000 --out /home/ianblenke/docker/gev-tools/ownership-gates/pass6/results.json --resume
```

Output from survivors.md:

```text
| all | 9 | 8 | 0 | 0 | 1 | 0 | 0 | 0 | 1 | 0 | 0 |
```

The columns state total, phase-one kills, crashes, timeouts and survivors, then phase-two counts and both open queues.
Both phases ended. No timeout or crash exists.

| Survivor | Status | Probe cases | Reason |
|---|---|---:|---|
| a9201 | EQUIVALENT | 36 | adoptsOf reads plain JSON data without side effects. The source check reads the same records before or after that call. |

The claim applies to the tree of this pass, string history inputs and stable Git refs.
The probe compares returned records and error names, codes and messages.
Command: node /home/ianblenke/docker/gev-tools/ownership-gates/pass6/probe.mjs.

```text
a9201: 36 cases; equal returned records and error shapes.
```

### Title and body checks

Command: python3 /home/ianblenke/docker/gev-tools/ownership-gates/pass6/check-clauses.py.
The script prints each changed title and its full assertion calls, from the JavaScript syntax tree.
The output ends with:

```text
Changed title bodies: 105
```

I read all 105 bodies, with each negative clause, order clause and result verb.
Each title change removes the subject or changes the claim, so that the title matches the assertion of the test.
The body diff has only titles and the assertions that ownership-038, ownership-012, the next run of ownership-054, S105, S106 and S113 need.
Command:

```text
git diff -U0 1563dfd8 -- src | grep '^[-+]' | grep -v '^+++\|^---'
```

The output is in pass6/test-body-diff.log. No other body line changes.
The repeated-title script reads current document labels and excludes the filed reviews and all past evidence blocks.
Past tables have notes that say later corrections renamed some titles.

### Host test output

Tree read: 1563dfd8fc15e380daf3b2605fa3fd6d06fd705e, with the Pass 6 corrections.
All five required test files ended. Each process runs one file.
Command form:

```text
taskset -c 4-7 nice -n 19 node --import /home/ianblenke/docker/gev-tools/ownership-gates/host.mjs --test-reporter=spec src/tooling/spec/<name>.test.mjs
```

| File | Tests | Passed | Failed | Log |
|---|---:|---:|---:|---|
| ownership.test.mjs | 50 | 50 | 0 | final-ownership.log |
| ownershipGate.test.mjs | 40 | 40 | 0 | final-ownershipGate.log |
| qaRegister.test.mjs | 49 | 49 | 0 | final-qaRegister.log |
| v8Merge.test.mjs | 11 | 11 | 0 | final-v8Merge.log |
| gates.test.mjs | 227 | 223 | 4 | final-gates.log |

The full legacy run has only the four known host adapter failures. It has no new failure.
The failed IDs are coverage-gate-024, spec-trace-039/spec-trace-040, coverage-gate-031 and coverage-gate-048.
The full legacy command has exit status 1. The other four required commands have exit status 0.

The coverage run omits only those four known cases. It ended with 223 tests, 223 passed and 0 failed.
Log: pass6/coverage-legacy.log. The command has exit status 0.

```text
NODE_V8_COVERAGE=/home/ianblenke/docker/gev-tools/ownership-gates/pass6/raw-legacy taskset -c 4-7 nice -n 19 node --import /home/ianblenke/docker/gev-tools/ownership-gates/host.mjs --test-skip-pattern='^(?:\[coverage\-gate\-024\]|\[spec\-trace\-039\ spec\-trace\-040\]|\[coverage\-gate\-031\]|\[coverage\-gate\-048\])' --test-reporter=spec src/tooling/spec/gates.test.mjs
```

### Fresh coverage

Each raw directory has fresh Pass 6 data. The source code stays the same during these runs.

The ownership, QA register and ownership gate processes each run one test file with NODE_V8_COVERAGE set.
The gate script uses the final raw-legacy and raw-gate directories.
The QA register uses raw-qa and raw-gate. The ownership script uses raw-own.
Each coverage command checks one script, under taskset and nice.

```text
node /home/ianblenke/docker/gev-tools/ownership-gates/host-coverage.mjs scripts/spec/lib/ownership.mjs /home/ianblenke/docker/gev-tools/ownership-gates/pass6/raw-own
node /home/ianblenke/docker/gev-tools/ownership-gates/host-coverage.mjs scripts/spec/lib/qa-register.mjs /home/ianblenke/docker/gev-tools/ownership-gates/pass6/raw-qa /home/ianblenke/docker/gev-tools/ownership-gates/pass6/raw-gate
node /home/ianblenke/docker/gev-tools/ownership-gates/host-coverage.mjs scripts/spec/gates.mjs /home/ianblenke/docker/gev-tools/ownership-gates/pass6/raw-legacy /home/ianblenke/docker/gev-tools/ownership-gates/pass6/raw-gate
```

| Script | Lines hit / total | Branches hit / total | Functions hit / total |
|---|---:|---:|---:|
| scripts/spec/lib/ownership.mjs | 168 / 168 | 130 / 130 | 44 / 44 |
| scripts/spec/lib/qa-register.mjs | 92 / 92 | 94 / 94 | 16 / 16 |
| scripts/spec/gates.mjs | 776 / 776 | 389 / 389 | 97 / 97 |

All three scripts have 100% line, branch and function coverage. All three coverage commands have exit status 0.

### Format and scope

Command:

```text
taskset -c 4-7 nice -n 19 node --import /home/ianblenke/docker/gev-tools/ownership-gates/pass2-format-shim.mjs scripts/format.mjs --check
```

Output:

```text
Checked 1158 source files.
```

The format command has exit status 0. No new project code file needs a package-boundary entry.
The review folders, trace files and applied specs have no diff against the commit named in Tree read.
Outside tests, no image run, ratchet, adopt, waive, archive, push or review command ran in this pass.
The lead must run the image gates and the next review round.

### Final document checks

The repeated-title command has exit status 0:

```text
python3 /home/ianblenke/docker/gev-tools/ownership-gates/pass6/check-repeated-titles.py
Live titles: 377
Labels checked: 27
Stale labels: 0
```

The banned-word search reads added prose and source lines against the commit named in Tree read, with prefixed forms.
The selector omits fenced code blocks, whose text is literal output or code.
The pattern treats priority as a separate word, as the review does.
Command:

```text
rg -n -i -P '\b[a-z]*(explicit|verif|malform|wiring|dismiss|expos|permit|retain|emit|prior(?!ity)|preserv|renew|lone|handover|execut|prescrib)[a-z]*\b' /home/ianblenke/docker/gev-tools/ownership-gates/pass6/added-text.txt
```

The search has 0 matches. The output file banned-grep.log is empty.
The literal pattern above names the words for the search; it is not prose.

Commands:

```text
taskset -c 4-7 nice -n 19 openspec show ownership-scoped-gates --json
taskset -c 4-7 nice -n 19 openspec validate ownership-scoped-gates
```

Both commands have exit status 0. The show output is JSON for ownership-scoped-gates.
The show command also prints this warning:

```text
Warning: Ignoring flags not applicable to change: scenarios
```

The validate output is:

```text
Change 'ownership-scoped-gates' is valid
```

Command: python3 /home/ianblenke/docker/gev-tools/ownership-gates/pass6/check-headings.py.
The headings diff has exit status 0. No original main heading changes or moves.
The evidence and tasks each add a Pass 6 main heading. The design adds a Pass 6 words subheading.
The proposal keeps all five original main headings, with Known limits and later changes unchanged.

The correction search opens the final text again. Output from pass6/correction-search.log:

```text
openspec/config.yaml:30:     Do not write history records by hand.
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:269:The `from` field must be a full hash of 40 lowercase hexadecimal digits of a commit that a merge after the base brought.
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:275:The record must also name, in `from`, the full hash of a commit that a merge after the base brought.
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:290:ERROR LEDGER-ADOPT-FROM openspec/trace/history.jsonl Use an adopt record with a file name and a full lowercase hash in the from field. A merge after the base must bring that hash.
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:317:The script is new and no valid adopt record names the script, or the first comment block of the base script has a QA tag.
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:472:The adopt command resolves its `--from` option and writes the full hash.
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:477:- **THEN** the adopt command writes one record for each script with the full hash of the second parent
src/tooling/spec/ownership.test.mjs:145:  assert.match(config, /Do not write history records by hand\./);
src/tooling/spec/ownership.test.mjs:387:test('[ownership-041] stops for a number or a name that is not a full hash in the from field', () => syncFixture(({ input, git, from, adopt }) => {
src/tooling/spec/ownership.test.mjs:441:test('[ownership-031 ownership-041] stops for a name that is not a full hash in a history with a merge HEAD', () => syncFixture(({ input, git, from, adopt }) => {
AGENTS.md:36:22. For a spec change, read the QA lines in the gate output. Avoid a conflict with a listed purpose. Add a header to each new QA script that the fork writes. The gate uses a synthetic header for an upstream QA script with no QA tag in its first comment block. For a script that exists at the base, the first comment block of the base script must also have no QA tag.
src/tooling/spec/ownershipGate.test.mjs:335:  assert.deepEqual(result.output.split('\n').filter(line => line.startsWith('ERROR ')), ['ERROR LEDGER-ADOPT-FROM openspec/trace/history.jsonl Use an adopt record with a file name and a full lowercase hash in the from field. A merge after the base must bring that hash.']);
src/tooling/spec/ownershipGate.test.mjs:405:  assert.match(errors[0], /^ERROR LEDGER-ADOPT-FROM openspec\/trace\/history\.jsonl Expected property name or '\}' in JSON/);
src/tooling/spec/ownershipGate.test.mjs:557:test('[ownership-031 ownership-041] stops for revision names in a history with a merge HEAD', () => withFixture(root => {
src/tooling/spec/ownershipGate.test.mjs:573:test('[ownership-054] writes the QA adopt record with a full hash from HEAD^2', () => withFixture(root => {
src/tooling/spec/ownershipGate.test.mjs:582:  assert.doesNotMatch(next.output, /ERROR QA-HEADER|ERROR LEDGER-ADOPT-/);
src/tooling/spec/ownershipGate.test.mjs:593:test('[ownership-054 ownership-035] stops the adopt command for QA files outside the exception and for another error', () => {
```

The final lint command is:

```text
taskset -c 4-7 nice -n 19 node scripts/spec/gates.mjs lint --change ownership-scoped-gates
```

Each correction group ends with 0 lint errors. The final lint also has 0 errors.
The logs keep the warnings and the full output.

## Pass 7

Tree read: 087615f536a53f514cfcee9a94ca2752843029a5, branch ownership-gates.
The checks use the Pass 7 work tree.

### Corrections

The rows below describe the Pass 7 work tree from commit 087615f536a53f514cfcee9a94ca2752843029a5.
The review folders and past run output stay as records.
No script code changes. The Pass 7 words table defines coverage item.

| Finding | Correction |
|---|---|
| B1: Order note | Add the catch test and QA helper test, their faults and tasks. Name all eight failed red tests. |
| B1: Loop mode | The evidence does not show when a task added the other-error loop mode. |
| B2, S114: Past tables | The sentence says that the notes say later corrections renamed some titles. The notes do not name each pass. |
| B3, S115: Manifest title | The unit title names the returned error. The spec names the errors array for absent or invalid files. |
| B3: Printed error | The gate test checks the printed OWNERSHIP-MANIFEST line for both an absent file and a bad file. |
| B4, S116: Hash pattern | The title says that the source check reads no merge parents. |
| B4, S117: Hash name | The check-command title names a value that is not a full hash, also for uppercase and space cases. |
| B5a: Coverage flags | Remove the false limit. findCoverageFlags reads tracked files at gates.mjs:230. |
| B5b: Reached record | Name gap-ledger-105 and add a gate test for the early LEDGER-ADOPT-FROM error at history.jsonl. |
| B5c: New script | Both ownership-054 result lines name a new script. The base-script exception stays. |
| B5d: D10 | Name ownership-038, the error code and the stable prefix of the message. |
| B5e: Init cause | Match the GATES-INIT error that says gaps.json exists. A different cause fails the test. |
| S118: Voice | Both titles use the active voice. The owned path belongs to the file. |
| S119: Synthetic header | Both titles name the synthetic header as the result. One title names one of three adopt records. |
| S120: Coverage terms | At Pass 7, the row said to use LCOV record, coverage item and extra text around a DA line or diff header. At Pass 8, the title names a DA text prefix or suffix and a diff header text prefix. |
| S121: Init pronoun | The result line states that init stops before the report step because the ledger exists. |
| S122: Context | Name the new script and say not to write history records by hand. Use two AND lines. |
| S123: Rule relation | Use replaces in both requirements. The QA clause names the requirement and its script scope. |
| S124: Source terms | Use second parent in the result line and adopt source in the design. The text of the message stays. |
| S125: QA and JSON | The design says prints QA-HEADER. At Pass 8, D10 names ownership-038, and task 6.30 names the JSON parse error in the history. |
| S126: Sync bound | Both coverage sentences in Why include the exception for lines that a sync brings unchanged. |
| S127: Plain words | Use no QA tag, expects 83 and output message text. Remove the S109 label. |
| S128: Real use | State that no real sync or path-class change used the new gate. |
| S129: Order and code | Use These Pass 5 tests. Name the code that writes the record or prints the message. |
| S130: Path | Remove the absent path reference. |
| S131: Title change | Use Old tests and a sentence with one clear subject for each title change. |
| S132: Assertions | Say that an assertion fails a test. Name the assertions for the JSON prefix and LEDGER-ADOPT codes. |
| S133: Labels | Use note and change of the count. Name ownership-038, ownership-012 and the next run of ownership-054. |
| S134: Tree | Use tree of this pass and commit named in Tree read. |
| S135: Hash message | At Pass 8, keep S135 as an open minor for review.md. The five strings that check the message stay the same. |

### Order count

Command: python3 /home/ianblenke/docker/gev-tools/ownership-gates/pass7/check-order.py.
The script compares all three red logs with the live titles and the Order table.
Passes 5, 6 and 7 changed titles. The script pairs the red and live titles by their test order.

Each pair must have the same scenario tags. The title pairs are in pass7/order-title-map.json.
The table has seven later tests. At Pass 8, rows 7 and 8 describe extra cases of the test in row 4.
That test came after the code and is absent from the red log.

The script writes only titles that neither set contains to pass7/order-missing.log.
That output is empty.
The counts are:

```text
ownership: red 48, live 50, table 2
ownershipGate: red 36, live 40, table 4
qaRegister: red 48, live 49, table 1
```

The eight failed titles in the Order note are the titles from the red logs, not claims about their later names.
The catch test came after the code. Pass 5 describes its first hash of 42 digits and its corrected hash of 40 digits.
The QA helper test also came after the code. Its three named faults failed that test at Pass 5.
The other-error loop mode has a failed named fault at Pass 5, but that record does not show when a task added the mode.

### Test body scope

Command:

```text
git diff -U0 087615f5 -- src | grep '^[-+]' | grep -v '^+++\|^---'
```

The output is in pass7/test-body-diff.log.
Only title lines and these three test bodies change:

- ownership-001 in ownershipGate.test.mjs: check the printed error for a bad manifest and an absent manifest.
- ownership-053 in ownershipGate.test.mjs: match the init error for a ledger that exists.
- ownership-031 in gates.test.mjs: add the reached adopt record with a source that is not a merge parent.

The tests use no new node:test API.

### Named faults

Command: python3 /home/ianblenke/docker/gev-tools/ownership-gates/pass7/named-faults.py.
Each fault changes code in a copy of the Pass 7 work tree from 087615f536a53f514cfcee9a94ca2752843029a5.
The copy has no branch. Each process runs one test file under taskset and nice.

The first attempt stops after the manifest fault because the next source selector is wrong. It gives no complete fault verdict.
The second attempt stops because the copy already has its node_modules link. It gives no fault verdict.

The corrected runner removes its old copy and checks each source selector.
The three requested faults then fail their tests. The final runner also checks the returned manifest error.

The final output is:

```text
manifest-return-code 1 ['[ownership-001] returns OWNERSHIP-MANIFEST for an absent or bad manifest file', '[ownership-029 ownership-001] keeps base paths after a change removes or shortens a manifest path']
manifest-error-code 1 ['[ownership-001] prints OWNERSHIP-MANIFEST for an absent or bad manifest']
skip-reached-source-check 1 ['[ownership-031] prints LEDGER-ADOPT-FROM for a reached line whose source is not a merge parent']
init-other-reason 1 ['[ownership-053] omits the Class, Ownership and Owned gaps lines from CI and init']
```

The manifest fault changes OWNERSHIP-MANIFEST to OWNERSHIP-OTHER in readOwnership.
The source fault skips validAdoptSources for a reached record.
The init fault changes the message about the ledger that exists to a message that names another cause.
The final named-results.json has status 1 and failed test names for all four rows.
The red.log file also shows the three requested faults before the final runner.

### Title and sentence checks

Command: python3 /home/ianblenke/docker/gev-tools/ownership-gates/pass7/check-clauses.py.
The script prints all changed titles and their full assertion calls. It also prints the stronger ownership-053 body.
I read all 15 body records, with the clauses for no reads, after, result verbs and the returned error.
The output in pass7/clauses.log ends with:

```text
Changed title bodies: 15
```

I read each changed sentence again against the code and nearby text.
The manifest result line now has the absent-or-invalid-file condition. A valid file has no error in the errors array.
The current and base QA tags, the inventory calls and the init exists check agree with the new prose.

Command: python3 /home/ianblenke/docker/gev-tools/ownership-gates/pass7/check-repeated-titles.py.
The script excludes the review folders, past evidence blocks and the task block that records the red titles.
The output in pass7/repeated-titles.log is:

```text
Live titles: 378
Labels checked: 26
Stale labels: 0
```

The banned-word selector reads the added prose and source lines against 087615f536a53f514cfcee9a94ca2752843029a5.
It excludes fenced code and output records. The search also checks prefixed forms.
Command:

```text
python3 /home/ianblenke/docker/gev-tools/ownership-gates/pass7/select-added-prose.py
rg -ni '\b\w*(?:explicit|verify|malformed|wiring|dismiss|expose|permit|retain|emit|prior|preserve|renew|lone|handover|execute|prescribed)\w*\b' /home/ianblenke/docker/gev-tools/ownership-gates/pass7/added-text.txt
```

The search output is empty in pass7/banned-grep.log.

### Automatic mutation selection

Commands use taskset -c 4-7 nice -n 19:

```text
node /home/ianblenke/docker/gev-tools/automut/automut.mjs gen --root /home/ianblenke/docker/gev-work/ownership-gates --files scripts/spec/lib/ownership.mjs,scripts/spec/lib/qa-register.mjs,scripts/spec/gates.mjs --out /home/ianblenke/docker/gev-tools/ownership-gates/pass7/all-mutants.json
python3 /home/ianblenke/docker/gev-tools/ownership-gates/pass7/select-mutants.py
```

Real output in pass7/gen.log and pass7/selection.log:

```text
9191 mutants
Changed-line mutants: 0
{}
```

No script code line changes against 087615f536a53f514cfcee9a94ca2752843029a5, so there is no selected mutant or mutation phase.
The wrapper with synchronous file access also calls the same generate function and gives Generated mutants: 9191 in pass7/gen-sync.log.
At Pass 7, the four named fault runs gave proof for the returned error and some stronger gate assertions.
At Pass 8, those runs did not reach the invalid-manifest block. The Pass 8 fault fails its printed-error assertion.

### Host test output

Tree read: 087615f536a53f514cfcee9a94ca2752843029a5, with the Pass 7 corrections.
All five test processes ended. Each process runs one file under taskset and nice.
The first log line names its command. NODE_V8_COVERAGE names a fresh Pass 7 raw directory.
Command form:

```text
taskset -c 4-7 nice -n 19 node --import /home/ianblenke/docker/gev-tools/ownership-gates/host.mjs --test-reporter=spec src/tooling/spec/<name>.test.mjs
```

The real reporter output gives these counts:

| File | Tests | Passed | Failed |
|---|---:|---:|---:|
| ownership.test.mjs | 50 | 50 | 0 |
| ownershipGate.test.mjs | 40 | 40 | 0 |
| qaRegister.test.mjs | 49 | 49 | 0 |
| v8Merge.test.mjs | 11 | 11 | 0 |
| gates.test.mjs | 228 | 224 | 4 |

The legacy run has exit status 1. Its only failures are the four known host adapter cases.
They have tags coverage-gate-024, coverage-gate-031, coverage-gate-048 and spec-trace-039/spec-trace-040.
The new ownership-031 reached-record test passes in that full run. No new host failure occurs.

The final title runs also pass all 50 ownership tests and all 40 ownership gate tests.
Their output is in pass7/final-titles-ownership.log and pass7/final-titles-ownershipGate.log.

The separate green command checks the new test:

```text
taskset -c 4-7 nice -n 19 node --import /home/ianblenke/docker/gev-tools/ownership-gates/host.mjs --test-reporter=spec --test-name-pattern=ownership-031 src/tooling/spec/gates.test.mjs
```

Its output in pass7/green-reached.log has 1 test, 1 pass and 0 failures.

### Fresh coverage

The three scripts stay the same during the fresh Pass 7 coverage runs.
Each coverage command checks one script. All commands use taskset -c 4-7 nice -n 19.
The command for ownership.mjs reads raw-own. The QA register command reads raw-qa and raw-gate.
The gate script command reads raw-legacy and raw-gate.

```text
node /home/ianblenke/docker/gev-tools/ownership-gates/host-coverage.mjs scripts/spec/lib/ownership.mjs /home/ianblenke/docker/gev-tools/ownership-gates/pass7/raw-own
node /home/ianblenke/docker/gev-tools/ownership-gates/host-coverage.mjs scripts/spec/lib/qa-register.mjs /home/ianblenke/docker/gev-tools/ownership-gates/pass7/raw-qa /home/ianblenke/docker/gev-tools/ownership-gates/pass7/raw-gate
node /home/ianblenke/docker/gev-tools/ownership-gates/host-coverage.mjs scripts/spec/gates.mjs /home/ianblenke/docker/gev-tools/ownership-gates/pass7/raw-legacy /home/ianblenke/docker/gev-tools/ownership-gates/pass7/raw-gate
```

Real output:

```text
{"file":"scripts/spec/lib/ownership.mjs","processes":1,"counts":{"LF":168,"LH":168,"BRF":130,"BRH":130,"FNF":44,"FNH":44}}
{"file":"scripts/spec/lib/qa-register.mjs","processes":2,"counts":{"LF":92,"LH":92,"BRF":94,"BRH":94,"FNF":16,"FNH":16}}
{"file":"scripts/spec/gates.mjs","processes":307,"counts":{"LF":776,"LH":776,"BRF":389,"BRH":389,"FNF":97,"FNH":97}}
```

All three commands have exit status 0 and 100% line, branch and function coverage.

### Final document checks

The format shim command has exit status 0. The output in pass7/format-final.log is:

```text
Checked 1158 source files.
```

The OpenSpec commands use taskset -c 4-7 nice -n 19:

```text
openspec show ownership-scoped-gates --json
openspec validate ownership-scoped-gates
```

Both commands have exit status 0. The JSON output is in pass7/show-final.json.
The validate output in pass7/validate-final.log is:

```text
Change 'ownership-scoped-gates' is valid
```

The first two attempts use a local OpenSpec path that does not exist. They stop with MODULE_NOT_FOUND and give no OpenSpec verdict.
The commands above use the installed openspec command.

Command: python3 /home/ianblenke/docker/gev-tools/ownership-gates/pass7/check-headings.py.
The output in pass7/headings.log has no removed main heading and no change to their order.
Only the Pass 7 main headings in tasks.md and evidence.md are new. The proposal headings stay the same.

The correction search reads the files again after the changes. The full output is in pass7/correction-search.log.
Its first eleven output lines are:

```text
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:269:For a reached adopt line whose `from` is not a merge parent, the stop LEDGER-ADOPT-FROM comes first.
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:290:- **AND** a reached adopt line with a source that is not a merge parent prints LEDGER-ADOPT-FROM at openspec/trace/history.jsonl
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:291:- **AND** the source check reads no merge parents for strings that do not match the hash pattern
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:410:- **WHEN** a trusted snapshot has a new QA script with no header and a valid adopt record
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:485:- **AND** an owned script with no header, or a new script that the second parent did not change, prints QA-HEADER
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:489:- **AND** a coverage ignore comment in that new QA script makes the gate print COVERAGE-IGNORE and write no adopt record
openspec/changes/ownership-scoped-gates/tasks.md:184:| 7.10 | [ownership-052] returns false when Git cannot read the merge parents | source-catch-throw |
openspec/changes/ownership-scoped-gates/tasks.md:185:| 7.10 | [ownership-054] accepts only upstream scripts with no current or base QA tag | drop-base-QA-tag, drop-current-QA-tag, drop-QA-class |
openspec/changes/ownership-scoped-gates/tasks.md:194:The evidence does not show when the other-error loop mode was added.
src/tooling/spec/qaRegister.test.mjs:64:  assert.match(rule || '', /header to each new QA script/i);
openspec/changes/ownership-scoped-gates/design.md:279:D10: The scenario ownership-038 names the error code and the stable prefix of the message. The init scenario states its early stop.
```

The review folders, trace files, applied specs and script code have no diff against 087615f536a53f514cfcee9a94ca2752843029a5.
No new project file needs a package-boundary entry. The body diff has only the three bodies listed above and title lines.

The final lint command is:

```text
taskset -c 4-7 nice -n 19 node scripts/spec/gates.mjs lint --change ownership-scoped-gates
```

Each correction group ends with 0 lint errors. The final lint output is in pass7/lint-final.log.

```text
STE: 0 errors, 588 warnings.
```

Outside tests, no image run, ratchet, adopt, waive, archive, push, gh or review command ran in Pass 7.
The lead must run the image checks and the next review round. This pass claims no image verdict.

## Pass 8

Tree read: d84cd029301550fc8e6a1401c88f741bd298f945, branch ownership-gates.
The checks use the Pass 8 work tree from that commit.
Past output blocks and filed reviews stay the same.

### Corrections

| Finding | Correction |
|---|---|
| F1 | Keep the absent-file code in a named fault. Fail the invalid-manifest assertion at ownershipGate.test.mjs:136. |
| F2, S136 | Name only the diff prefix and the DA prefix or suffix that the body checks. |
| F3 | State that table rows 7 and 8 are extra cases of row 4. That test came after the code. |
| F4 | Check that the absent-file message is a non-empty string. An empty-message fault fails at ownership.test.mjs:51. |
| F5 | State that the QA replacement applies in the adopt command. |
| F6 | Add GUARDED_RUN to the real-init fixture test. Keep all assertions. |
| S137 | Name ledger entries and waiver counts for one file. Define coverage item without waivers. |
| S138 | Name a new upstream QA script of the merge as the source of the coverage ignore comment. |
| S139 | State that D10 names ownership-038 and task 6.30 names the JSON parse error. |
| S140 | Name the returned error object, its code and invalid files. |
| S141, S143 | Name the reached adopt record and state that the gate prints LEDGER-ADOPT-FROM and stops. |
| S142 | Use this requirement for the sync relation. |
| S144 | Use values for the hash-pattern inputs, which include null and 1. |
| S145 | Name the process rules and adopt rules that the assertions check. |
| S146 | State that HEAD is a merge commit. Define check command. |
| S147 | Name the new upstream QA script with no QA tag. |
| S148 | Add the article before the owned gap lines. Use plural errors to meet the task word limit. |
| S149 | State that the evidence does not show when a task added the loop mode. |
| S150 | Use names, counts, file and attempt for past run accounts. |
| S151, S152 | State what the message means. Leave S135 open for the lead in review.md. |
| S153 | Restore first in the Pass 6 order sentence and use preceded. |
| S154 | State that later corrections renamed some titles. |
| S155 | Give Passes 5, 6 and 7 as the subject of changed. |
| S156 | State that this pass claims no image verdict. |
| S157 | State what the notes say. Use plain clauses for init and its cause. |

The suggested gap sentence was too broad for the code at this commit.
gapReport adds line counts by class, not all metrics. coverageFaults adds positive whole-number waiver counts with the same file, hash and metric.
The requirement now states those bounds. A waiver remains a history record, not a field of a coverage item.

### Named faults

Command: python3 /home/ianblenke/docker/gev-tools/ownership-gates/pass8/named-faults.py.
Each fault changes one code expression in a scratch copy of this commit and the Pass 8 tests.
The copy has no branch. Each test process uses taskset -c 4-7 nice -n 19 and the host adapter.
The empty-message red run precedes the green run. No production code correction is needed.

| Fault | Code change | Failed assertion |
|---|---|---|
| invalid-manifest-code | Keep OWNERSHIP-MANIFEST only for ENOENT in the catch. | ownershipGate.test.mjs:136: the output must match ERROR OWNERSHIP-MANIFEST. |
| absent-manifest-message | Set the message to an empty string only for ENOENT. | ownership.test.mjs:51: the message length must differ from 0. |
| diff-prefix | Remove the start anchor of the diff header pattern. | ownership.test.mjs:194: the line list must equal []. |
| DA-prefix | Remove the start anchor of the DA pattern. | ownership.test.mjs:195: the covered line list must equal []. |
| DA-suffix | Remove the end anchor of the DA pattern. | ownership.test.mjs:195: the covered line list must equal []. |
| gap-sum | Use the largest gap count instead of the sum. | ownership.test.mjs:198: the report must have 5 lines. |
| waiver-sum | Use the largest waiver count instead of the sum. | ownership.test.mjs:199: the error list must equal []. |

The invalid-manifest fault passes the absent-file assertions before it fails at line 136.
The actual error code there is OWNERSHIP-OTHER. The message fault reports actual 0 at line 51.
All seven code fault processes finish with status 1 and the named failed tests.

Two more faults remove the QA adopt rule from AGENTS.md and config.yaml in the scratch copy.
They fail ownership-012 at ownership.test.mjs:140 and :146. Production files stay the same.
The command is python3 /home/ianblenke/docker/gev-tools/ownership-gates/pass8/named-QA-faults.py.

The full output and both results files are in pass8/ beside this file.

### Title and order checks

Commands use the scripts in /home/ianblenke/docker/gev-tools/ownership-gates/pass8/.
check-clauses.py prints ten changed titles and their assertion calls. I read each clause against its body.

check-order.py compares the three red logs, the live titles and the Order table.
Its missing-title output is empty. The counts stay 48/50/2, 36/40/4 and 48/49/1.
check-repeated-titles.py checks current labels and excludes past evidence output and filed reviews.

The source diff has ten title lines, two absent-message assertions and the GUARDED_RUN option.
The scripts, AGENTS.md and openspec/config.yaml have no diff against the tree read for this pass.
The QA register code and the gate code stay the same.

### Correction search

The rg command searches the corrected titles, glossary rows and adopt clause in two test files and three change documents.
The search reads the files after the corrections. The output is in pass8/correction-search.log.
Its first ten lines are:

```text
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:181:It must add only positive whole-number waiver counts for the same file, hash and metric.
openspec/changes/ownership-scoped-gates/specs/ownership/spec.md:474:In the adopt command, for such a script, this requirement replaces qa-scripts-024 and gap-ledger-089.
openspec/changes/ownership-scoped-gates/evidence.md:2695:| S125: QA and JSON | The design says prints QA-HEADER. At Pass 8, D10 names ownership-038, and task 6.30 names the JSON parse error in the history. |
openspec/changes/ownership-scoped-gates/evidence.md:2745:- ownership-031 in gates.test.mjs: add the reached adopt record with a source that is not a merge parent.
openspec/changes/ownership-scoped-gates/evidence.md:2972:| F6 | Add GUARDED_RUN to the real-init fixture test. Keep all assertions. |
openspec/changes/ownership-scoped-gates/evidence.md:2975:| S139 | State that D10 names ownership-038 and task 6.30 names the JSON parse error. |
openspec/changes/ownership-scoped-gates/evidence.md:2994:gapReport adds line counts by class, not all metrics. coverageFaults adds positive whole-number waiver counts with the same file, hash and metric.
openspec/changes/ownership-scoped-gates/evidence.md:3033:The source diff has ten title lines, two absent-message assertions and the GUARDED_RUN option.
openspec/changes/ownership-scoped-gates/design.md:264:| coverage item | Measured data for one file: the file name, the hash and the uncovered counts |
openspec/changes/ownership-scoped-gates/design.md:270:| check command | The command check of runGates |
```

### Automatic mutation selection

Commands:

```text
taskset -c 4-7 nice -n 19 node /home/ianblenke/docker/gev-tools/ownership-gates/pass8/gen-sync.mjs
python3 /home/ianblenke/docker/gev-tools/ownership-gates/pass8/select-mutants.py
```

Real output:

```text
Generated mutants: 9191
Changed-line mutants: 0
{}
```

Both commands finish with status 0. No production code line differs from the tree read for this pass.
The empty selection needs no automatic fault run. The nine named faults check the assertions of this pass.

### Host test output

All five host test processes ended. Each process runs one file under taskset -c 4-7 nice -n 19.
The first line of each final test log names its command. NODE_V8_COVERAGE uses fresh Pass 8 directories.
Command form:

```text
taskset -c 4-7 nice -n 19 node --import /home/ianblenke/docker/gev-tools/ownership-gates/host.mjs --test-reporter=spec src/tooling/spec/<name>.test.mjs
```

Real reporter output:

```text
ownership
ℹ tests 50
ℹ pass 50
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ownershipGate
ℹ tests 40
ℹ pass 40
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
qaRegister
ℹ tests 49
ℹ pass 49
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
v8Merge
ℹ tests 11
ℹ pass 11
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
gates
ℹ tests 228
ℹ pass 224
ℹ fail 4
ℹ cancelled 0
ℹ skipped 0
```

The legacy process has status 1. The other four have status 0.
Its only failures have tags coverage-gate-024, coverage-gate-031, coverage-gate-048 and spec-trace-039/spec-trace-040.

These are the four known host failures from Pass 7. The reached-adopt-record test passes in the full run.
The final ownership title run also passes all 50 tests. No new node:test API is needed.

### Document checks

The format command uses the Pass 2 host import and scripts/format.mjs --check.
It ends with status 0 and reports Checked 1158 source files.
OpenSpec show and validate both end with status 0.

```text
taskset -c 4-7 nice -n 19 openspec show ownership-scoped-gates --json
taskset -c 4-7 nice -n 19 openspec validate ownership-scoped-gates
```

The validate output is:

```text
Change 'ownership-scoped-gates' is valid
```

The first all-heading check stopped on duplicate heading labels and gave no complete heading verdict.
The corrected sequence check passes for all heading levels. No old heading is absent or out of order.
All proposal headings stay the same. New headings name the Pass 8 words and evidence sections.

The title check has 0 stale labels. The order check has empty output. The banned-word search also has empty output.

The review folders, trace files, applied specs and production scripts have no diff against d84cd029301550fc8e6a1401c88f741bd298f945.
The source diff has only the ten title lines, two message assertions and GUARDED_RUN.
No new project code file needs a manifest entry or a package-boundary check.

Outside tests, this pass runs no Docker, make, full gate, ratchet, adopt, waive, archive, push, gh or review command.
The lead must run the image checks and the next review round. This pass claims no image verdict.

### Fresh coverage

Each command checks one production file and uses taskset -c 4-7 nice -n 19.
All raw data comes from the completed Pass 8 host tests.

```text
taskset -c 4-7 nice -n 19 node /home/ianblenke/docker/gev-tools/ownership-gates/host-coverage.mjs scripts/spec/lib/ownership.mjs /home/ianblenke/docker/gev-tools/ownership-gates/pass8/raw-own
taskset -c 4-7 nice -n 19 node /home/ianblenke/docker/gev-tools/ownership-gates/host-coverage.mjs scripts/spec/lib/qa-register.mjs /home/ianblenke/docker/gev-tools/ownership-gates/pass8/raw-qa /home/ianblenke/docker/gev-tools/ownership-gates/pass8/raw-gate
taskset -c 4-7 nice -n 19 node /home/ianblenke/docker/gev-tools/ownership-gates/host-coverage.mjs scripts/spec/gates.mjs /home/ianblenke/docker/gev-tools/ownership-gates/pass8/raw-legacy /home/ianblenke/docker/gev-tools/ownership-gates/pass8/raw-gate
```

Real output:

```text
{"file":"scripts/spec/lib/ownership.mjs","processes":1,"counts":{"LF":168,"LH":168,"BRF":130,"BRH":130,"FNF":44,"FNH":44}}
{"file":"scripts/spec/lib/qa-register.mjs","processes":2,"counts":{"LF":92,"LH":92,"BRF":94,"BRH":94,"FNF":16,"FNH":16}}
{"file":"scripts/spec/gates.mjs","processes":307,"counts":{"LF":776,"LH":776,"BRF":389,"BRH":389,"FNF":97,"FNH":97}}
```

All three commands end with status 0 and full line, branch and function coverage.
These host counts give no image verdict.

### Final lint

Command:

```text
taskset -c 4-7 nice -n 19 node scripts/spec/gates.mjs lint --change ownership-scoped-gates
```

The command ends with status 0. Real output:

```text
STE: 0 errors, 586 warnings.
```

Each correction group ends with 0 lint errors. The final log keeps all warnings.
