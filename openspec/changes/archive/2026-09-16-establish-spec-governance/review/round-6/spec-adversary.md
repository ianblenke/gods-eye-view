Verdict: FAIL
- [ ] F1 major scripts/spec/lib/ledger.mjs:137 For a loaded entry with a range, `sameTotals` only checks that the totals are integers. It does not compare them with the measured totals. Also, the ratchet command keeps a range entry without a change when the counts are in the range (:378). Thus the ledger keeps old totals, and the code does not do gap-ledger-057 for range entries. I tested a copy of `ledger.mjs` (`review-spec-r6/range-totals.mjs`):
  - The base has a range entry with `totals.branches: 50` and branches 3 to 5.
  - Change A adds a test that calls a function that no test called before. The total becomes 60 and 5 branches stay not covered, so 55 branches are covered. `compareLedger` gave `{"errors":[],"stale":[]}`. The ratchet command kept totals 50 and wrote no history line.
  - Change B removes coverage: 12 branches are not covered, so 48 are covered. `compareLedger` gave only `LEDGER-STALE`, because the ledger records 50 − 5 = 45 covered branches. The ratchet command wrote `shown by test` and `totals changed`. `compareWithBase` gave `[]`. The gate did not stop for the loss of 7 covered branches.

  A second test (`range-false.mjs`) shows the other half of the problem. After an honest ratchet that writes only a `lines smaller` line, I changed the totals of a range entry by hand to `{ branches: 5, functions: 1 }`. `compareLedger` and `compareWithBase` both gave no errors. The reason is that LEDGER-TOTALS-NOT-BASE (:310) accepts any history line for the file, not only a `totals` line. The four real range entries have totals that change between runs: the samples for `ais-store.js` give 62 and 64. Thus exact totals cannot be the rule.

  Correction: record a range for the total counts (or the lowest covered count) in the stability command. Make the entry stale when the current totals are outside that range. Make the ratchet command write the new totals with a `totals changed` line. Require a `totals` line, not any line, for LEDGER-TOTALS-NOT-BASE. Add the two-change case to the gap-ledger-054 and gap-ledger-057 tests. If you do not do this, add the case to the known limits and to design.md "Unstable coverage".
- [ ] F2 minor openspec/changes/archive/2026-09-14-establish-spec-governance/proposal.md:61 The `guard-processes` limit says that the guard gives the gate values to the processes of `node:child_process`. That is not true for a child process that has no `NODE_V8_COVERAGE`, because `withGuardEnv` returns the options without a change (test-guard.mjs:134). That child gets no guard, so its own `node:child_process` is not wrapped. It can then start Node with `NODE_V8_COVERAGE` set to the coverage folder of the test and without `GEV_SPEC_OUT`. I tested this with a copy of `scripts/spec` and a fixture project (`review-spec-r6/nocov-gate.mjs`):
  - The test passes its `NODE_V8_COVERAGE` to the middle process under another name.
  - The last process runs `sub` under the `sourceURL` of `src/math.js`.
  - The check gave `0 untrue`, no `COVERAGE-FAKE` and `LEDGER-STALE` for `src/math.js`. The fake coverage made the gap smaller.
  - In the control run, the last process wrote to another folder. That run gave no `LEDGER-STALE`.

  Check 5 of `.claude/agents/spec-adversary.md` also does not name this pattern. Correction: give the guard and the gate coverage folder to each child process of a gate test process, and add a gate test. If you do not do this, add to `guard-processes` that a child process without `NODE_V8_COVERAGE` gets no guard and no gate values. Add this pattern to check 5. Also add the exception to design.md:63.
- [ ] F3 minor .claude/commands/opsx/review.md:24 The step says to run `git rm -r openspec/specs` when the commit before the archive has no `openspec/specs/` folder. That is the case on this branch: `HEAD` has no `openspec/` folder. `git rm -r -n openspec/specs` stops with "staged content different from both the file and the HEAD". The reason is that the archived spec files are staged (`A` and `AM`).

  Also, `git restore --source=<commit> --staged --worktree openspec/specs` does not remove an untracked spec file that the archive command wrote for a new capability. I tested this in `review-spec-r6/gitrm2`, and `openspec/specs/newcap/spec.md` stayed. When nothing in `openspec/specs` is tracked, the restore command stops with "pathspec did not match". The next `openspec archive` then finds the old archive output.

  Correction: use `git rm -r -f` (or `git restore` alone, which I found to work for staged files). Also tell the author to remove the untracked files in `openspec/specs/` that the archive command wrote.

Round-5 findings:
- **Recorded as a known limit:** F1 and F2. `guard-processes` is in the proposal (:61). coverage-gate-039 now names only a worker thread with the environment of its process. The agent file has check 5 "Guard values". No test in `src/tooling/spec/` starts a shell with changed `GEV_SPEC_*` values or makes a worker with `env` or `execArgv` options. F2 in this round is a path that the limit text does not include.
- **Corrected for the reported cases:** F3.
  - `hasTotals` makes a loaded range entry with `{}`, null totals or a string total stale. The gap-ledger-055 test (ledger.test.mjs:152) has these cases.
  - LEDGER-TOTALS-NOT-BASE is in place (ledger.mjs:310, gap-ledger-056 test at :365).
  - The ratchet command writes `totals changed` lines (:406, gap-ledger-057 test at :351).
  - F1 in this round is the remaining case with integer totals that are false or old.
- **Partly corrected:** F4. The `git restore` form is correct for tracked files. F3 in this round is the problem with the fallback command and with untracked files.

Gate output: the only error is `REVIEW-MISSING`, which you expected, and there are no warnings. The trace files agree:
- `ids.json` and `links.json` each have 201 IDs, and they agree with the scenario IDs in the specs. Each ID names establish-spec-governance, and no link list is empty.
- The four history lines name the change and agree with the proposal table.
- Each loaded ledger entry has integer totals.
- Each scenario has its test task before the code task.
- `openspec/trace/retired-ids.json` does not exist, so no retired ID is in use.

I did not change files in the repository, and I used only read-only Git commands there. The experiments are in `/tmp/claude-1000/-home-ianblenke-docker-gods-eye-view/bdb4f5c7-182e-45ee-82b1-3e3b1892873d/scratchpad/review-spec-r6/`. The copy of `scripts/spec` is in `copy/spec`. I used the local Node v26. F1 and F3 do not depend on the Node version. F2 depends only on how environment values pass to child processes, and Node 24 does the same. I did not run F2 on 24.21.0.