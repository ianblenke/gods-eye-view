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

The owner must decide whether imported sync lines need coverage against the base. The code applies the stated base diff rule.

## Correction search

The final source search gives these lines:

```
scripts/spec/lib/ownership.mjs:115: const names = tests.reduce((sum, file) => sum + Object.values(ledger.untracedTests[file].names).reduce((total, count) => total + count, 0), 0);
scripts/spec/lib/qa-register.mjs:40: header = { purpose: 'Check upstream code.', covers: ['unmapped: upstream'], run: `node ${file}`, needs: 'The upstream script needs its own setup.', synthetic: true };
src/tooling/spec/gates.test.mjs:1624: function trustedFixture(body, extra = {}, base = {}, measurement = {}) {
src/tooling/spec/gates.test.mjs:2280: }, {}, {}, { loaded: true }));
src/tooling/spec/gates.test.mjs:2397: }, { '.gitignore': '.gev-cache/\nscripts/spec/ignored.txt\n' }, {}, { loaded: true }));
```
