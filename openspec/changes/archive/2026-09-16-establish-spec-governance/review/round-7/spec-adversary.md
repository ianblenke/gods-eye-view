Verdict: FAIL
- [ ] F1 minor openspec/changes/archive/2026-09-14-establish-spec-governance/specs/gap-ledger/spec.md:291 gap-ledger-057 says that the ratchet command writes the new total counts and a `totals changed` line when a total count is not the count in the entry. The code does not do this for an entry with a range when each count is in the range. In that case, `sameTotals` returns true (scripts/spec/lib/ledger.mjs:137), and the ratchet command keeps the old entry (ledger.mjs:378). I tested a copy of `ledger.mjs` (`review-spec-r7/range-057.mjs`). The entry had totals `{ branches: 62, functions: 19 }`, and the run gave total branches 64 with each count in the range. `compareLedger` gave `{"errors":[],"stale":[]}`. The ratchet command kept totals 62 and wrote no history line. The `range-totals` limit (proposal.md:64) and design.md:113 say only that the gate does not compare these totals. They do not say that the ratchet command keeps them. The gap-ledger-057 test (ledger.test.mjs:351) has no entry with a range. Correction: add "for an entry without a range, or an entry with a count outside its range" to the WHEN line of gap-ledger-057. Also add to `range-totals` and to design.md:113 that the ratchet command keeps the old total counts of such an entry. Add a range entry with counts in the range to the gap-ledger-057 test, and assert that the totals do not change.
- [ ] F2 minor openspec/changes/archive/2026-09-14-establish-spec-governance/design.md:63 Round-6 F2 said to add the exception to this line, and this correction is not done. The line still says that "the guard gives the gate values to the child processes of the worker thread", with no exception. The guard does not load in a worker thread with its own `env` that has no `GEV_SPEC_OUT`, because `installGuard` returns at test-guard.mjs:234. Thus the child processes of that worker get no gate values. The `guard-processes` limit (proposal.md:61) and coverage-gate-039 name this exception, so the design does not agree with them. Correction: add to design.md:63 that this is true only for a worker thread with the environment of its process. Also say that a worker thread with its own `env` or `execArgv` options, and a child process without `NODE_V8_COVERAGE`, get no gate values, and refer to `guard-processes`.
- [ ] F3 minor openspec/changes/archive/2026-09-14-establish-spec-governance/specs/coverage-gate/spec.md:205 In coverage-gate-038, the THEN line says "the guard does nothing" for a process without an inspector. The code does two things before it tries the inspector session:
  - It wraps the `node:child_process` functions (test-guard.mjs:245).
  - For a node:test runner, it locks the gate values in `process.env` (test-guard.mjs:250).

  coverage-gate-040 needs this behavior, so the THEN lines of 038 and 040 do not agree. I tested a copy of the guard (`review-spec-r7/guard-038.mjs`) with a failed inspector session and `execArgv: ['--test']`. `installGuard` returned `null`, but it replaced `spawn` with the wrapper. The environment also kept `GEV_SPEC_OUT` after the test changed it. The coverage-gate-038 test (testGuard.test.mjs:290) passes because it asserts only the `null` result and that no results file exists. Correction: change the THEN line of coverage-gate-038 to "the guard does not check the sources, does not count the assertions and writes no results". Add an AND line that says that the guard gives the gate values to the child processes that collect coverage. Add assertions for the wrapped function to the coverage-gate-038 test.

Round-6 findings:
- **Recorded as a known limit:** F1.
  - `range-totals` is in the proposal (:64), and the paragraph is in design.md "Unstable coverage" (:113).
  - LEDGER-TOTALS-NOT-BASE now accepts only a history line with the metric `totals` from the checked change (ledger.mjs:268, :310).
  - The gap-ledger-056 test (ledger.test.mjs:365) now has a `lines` line from the same change, and the gate still stops for it.
  - F1 in this round is the remaining difference between gap-ledger-057 and the code.
- **Partly corrected:** F2. `guard-processes` (proposal.md:61) now names a child process without `NODE_V8_COVERAGE`. Check 5 of `.claude/agents/spec-adversary.md` (:33) now names this pattern. F2 in this round is the design.md part that is not done.
- **Corrected:** F3. Step 9 of `.claude/commands/opsx/review.md` (:24) now uses `git rm -r -f` and tells the author to remove the untracked spec files. In a test repository, `git rm -r -f` removed staged `A`/`AM` spec files. `git restore --source --staged --worktree` with the removal of untracked files gave the content of the commit.

Gate output: the only error is `REVIEW-MISSING`, which you expected. There are no warnings.
- The four history lines name establish-spec-governance and agree with `gaps.json` and the proposal table.
- Each loaded ledger entry has integer totals.
- Each scenario has its test task before the code task.
- `openspec/trace/retired-ids.json` does not exist, so no retired ID is in use.

I did not change files in the repository. I used only read-only Git commands there. The experiments are in `/tmp/claude-1000/-home-ianblenke-docker-gods-eye-view/bdb4f5c7-182e-45ee-82b1-3e3b1892873d/scratchpad/review-spec-r7/`:
- `range-057.mjs` and `guard-038.mjs` use the copies in `copy/`.
- `g1/` and `g2/` are the Git tests for the review command.

I used the local Node v26. F1 and F3 use only the logic of the ledger and the guard, so they do not depend on the Node version.