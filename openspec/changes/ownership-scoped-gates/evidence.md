## Tree and scope

Tree read: e2437f945215860c42b5d8bba6834c85f93a90ce.

Input commit: 85489e996384b89c0df6938d60f38cbaeb7e80ec.

Upstream read: 95fa816232456a6831172befa2f1b34b9ee73794.

The specs and tests came before the code. The manifest has 92 exact paths and prefixes.

It covers all 1025 fork-only files from the requested tree comparison.

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

Those merged counts use 311 process records. They do not use fake fixture measurements.

The image must supply the pinned Node result. No host result is an image gate verdict.

## Automatic mutations

The default generator omits error message text.

The first generator produced 8993 candidates. The diff filter selected 1581.

Phase one completed: 1327 killed, 240 survived, 12 timeout and 2 crash.

Two tests found source faults: report test totals and an upstream comment with no QA tags.

The specs and failed tests came before those two source fixes.

Of the old mutants, 1552 spans map to the final source. The other 29 spans changed.

The second generator produced 1920 candidates for the two files. The fix filter selected 70 new mutants.

The final set has 1622 current mutants. The result file records their source spans, code edits and failed test names.

We carry forward 1300 phase-one kills for source spans that did not change.

The full second phase uses the final source and the stronger tests.

| Current set | Phase one killed | Phase one survived | Timeout | Crash | Phase two killed | Final survivors |
|---|---:|---:|---:|---:|---:|---:|
| 1622 | 1360 | 248 | 12 | 2 | 173 | 75 |

The 75 survivors have 44 equivalent probes and 31 known limits.

Timeouts do not count as kills. The 12 timeout edits stop a loop counter or make its condition always true.

The two crashes change the JSON parse argument. The tool labels their SyntaxError failures as crashes.

The tool runs each test file in its own Node process. It has no shared test process.

The local copy changes process transport and the worker Git index. It keeps the result classes and deadlines.

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

## Source hashes

The hash file uses SHA-256 for the tested source.

| File | Hash |
|---|---|
| scripts/spec/gates.mjs | a24949d4278b01dc2c376118cc06c122969eef5dc786ae7ebd0372592e339d45 |
| scripts/spec/lib/ownership.mjs | fc0633efedb9fe9b341e8f163ebc96bfdc7e53eaddb832bf6a49cdcf80e71107 |
| scripts/spec/lib/measurement.mjs | af009427eb2145d384180e8867a87bad838d3f0c1d661b4b2c3eccda6902d7d8 |
| scripts/spec/lib/qa-register.mjs | 96e100f8dd7390d83e4cae328452b3f45c371d34e03afcad877f0e0dfdb0fd96 |
| scripts/spec/lib/v8-merge.mjs | 19c743fe91e7c878ac61471736bb15e5835b2b23932a81f4852dc152de599fae |

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

Each file uses its last own adopt source. Other files use the last source in the change.

A file absent from its source uses all its current lines for the source set.

Each source must be an ancestor of HEAD. An invalid source stops the check.

A change without adopt source records keeps the base diff rule.

Whole-file owned coverage and ledger comparisons stay in force.

Scenarios: ownership-020 through ownership-025.

The tests use real temporary Git repositories, including a merge with a conflict.

The first test run stopped at the absent syncChangedLines export. It has no test verdict.

## Pass 2 named mutation proof

The proof copy records tree a70c24e2a5836544b7490899e9d352cbb343d053 and the pass 2 source edits.

It has no branch. The proof does not change the clone.

| Mutation | Source edit | Failed test |
|---|---|---|
| No source intersection | Keep the base set without the filter | ownership-020 ownership-025: exempts merge lines and counts current code |
| Drop the conflict repair line | Replace the intersection with an empty array | ownership-021: needs the manual conflict repair line |
| Drop the vendored author edit | Replace the intersection with an empty array | ownership-022: needs an author edit to a vendored line |

Each mutation ran against its named test and gave exit status 1.

The proof logs and pass2-proof.json are in /home/ianblenke/docker/gev-tools/ownership-gates/.

## Pass 2 image waiver needs

The ledger at tree a70c24e2a5836544b7490899e9d352cbb343d053 has these two owned branch gaps.

| File | Metric | Count | Current file hash |
|---|---|---:|---|
| scripts/spec/lib/test-guard.mjs | branches | 1 | 9451e6303105436c50adc39c30c65ef875c0871c318a6ca26a81e3a94f1ebe9f |
| src/layers/osh/index.js | branches | 1 | b995edb9d833d5661d0484c31a741131b3ea1439a56fa5d03aa24141bb3a8407 |

If the image shows V8 artifacts, each file needs one waiver with metric branches and count 1 for its measured hash.

Each record also needs the change name, a reason and the positive source line numbers from the image report.

No image run occurred here. The ledger counts cannot give those line numbers or prove a V8 artifact.

The lead must use the image result to select the line numbers and assess the reason.

Both files still have their base content. The current waive command rejects a file with its base content.

Thus these are the required record fields, but the command cannot add those records to this change as it stands.

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

The full legacy run finished with its test summary and exit status 1.

The failed cases are coverage-gate-024, spec-trace-039 spec-trace-040, coverage-gate-031 and coverage-gate-048.

These are the four cases from the pass 1 base probe. No new base probe ran in pass 2.

Both scripts that pass 2 changes have 100% line, branch and function coverage on the host.

| Script | Lines | Branches | Functions |
|---|---:|---:|---:|
| ownership.mjs | 100% | 100% | 100% |
| gates.mjs | 759/759 | 361/361 | 88/88 |

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

It runs each test file in its own process. The source clone is read only during each campaign.

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

Each mutation runs node --import host.mjs --test-name-pattern=ownership-NNN src/tooling/spec/ownershipGate.test.mjs in the scratch copy.
The scratch copy has no branch. Its source is commit 88894512 with the pass 3 edits.
The file pass3-proof.json records three exit values of 1 and the failed test names.

The first test for a new file failed because the file was not tracked. The final test stages the new file.

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
