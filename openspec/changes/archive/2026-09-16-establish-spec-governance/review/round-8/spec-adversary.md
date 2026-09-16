Verdict: FAIL
- [ ] F1 major scripts/spec/lib/ledger.mjs:275 `compareWithBase` applies the rules for ranges only when a range is wider than the range of the base entry. A range with each low count equal to its high count has width 0, so it is never "wider". gap-ledger-058 now writes such ranges, but the gate cannot tell a range from the stability command from a range that a person adds by hand. A later change can add `low` equal to the counts of a base entry that has no range. It needs no `unstable` history line, and its diff can change tests outside `openspec/`. The entry then turns off two checks: `sameTotals` (:137) and the check for fewer covered branches and functions (:174). I tested a copy of `ledger.mjs` (`review-spec-r8/zero-width.mjs`):
  - The base entry has branches 3 and totals `{ branches: 50, functions: 10 }`. The run gave branches 3 and total branches 40, so 10 fewer branches were covered.
  - Without `low`, `compareLedger` gave `LEDGER-LOST-COVERAGE`.
  - With `low: { lines: 10, branches: 3, functions: 1 }` added, `compareLedger` gave `{"errors":[],"stale":[]}`. `compareWithBase` with `outsideChanged: true` and no history gave `[]`. The ratchet command kept totals 50 and wrote no history line.

  The `deterministic-tests` limit (proposal.md:60) and design.md:105–109 name the rules only for a wider range.

  Correction: make `compareWithBase` treat an entry with `low` as a new range when its base entry has no `low`, or when the `low` values are not the base values. Such an entry must meet the same rules as a wider range. Add a scenario and a test with an added `low` of width 0. If you do not do this, add this case to `deterministic-tests` and to design.md "Unstable coverage".
- [ ] F2 minor openspec/changes/archive/2026-09-14-establish-spec-governance/specs/gap-ledger/spec.md:54 gap-ledger-054 says that the gate stops when an unchanged file has a smaller covered branch count or covered function count, with no exception. The code does not do this check for an entry with a range when the not-covered count is not above the high count (ledger.mjs:174). The gap-ledger-058 test (ledger.test.mjs:517) shows the conflict. It asserts no errors for `src/geocoder.js` with total branches 117 and 5 not-covered branches, so 112 branches are covered. The entry records 118 − 5 = 113 covered branches. Thus the tests of gap-ledger-054 and gap-ledger-058 do not agree. Correction: add "for an entry without a range, or a count above the high count of its range" to the WHEN line of gap-ledger-054. Add this skip to `range-totals` (proposal.md:66) and to design.md:113.
- [ ] F3 minor scripts/spec/lib/ledger.mjs:482 The stability command now finds unstable total counts for a file that has no gap. `sameCounts` compares the totals of each file in the samples, and complete files are included. For a file at 100% with different total counts, `stabilityLedger` writes a new entry. The entry has zero counts, `low` zeros and the origin `unstable`, and the file has no gap. That entry has width 0 and is not in the base, so `compareWithBase` stops with `LEDGER-NOT-IN-BASE` (:297). The command therefore writes a ledger that the gate stops for. I tested a copy (`review-spec-r8/complete-058.mjs`) with total branches 20 and 21 at zero not-covered counts. `compareLedger` gave no errors, and `compareWithBase` gave `LEDGER-NOT-IN-BASE src/done.js`. Complete files do have this problem. The kept samples of `scripts/spec/lib/ledger.mjs` at one content hash (`a277f80d5af8…`) have total branches 327 and 326, with zero not-covered counts. For a new file, the command stops with "content is not the base content". Correction: in `stabilityLedger`, do not record total-only differences for a file with zero not-covered counts in each sample and no ledger entry. Add "of a file below 100%" to the WHEN line of gap-ledger-058 (spec.md:131). Add a complete file with different totals to the gap-ledger-058 test, and assert that it gets no entry and no history line.
- [ ] F4 minor openspec/changes/archive/2026-09-14-establish-spec-governance/proposal.md:40 The text says that "the ledger records a range for each file, from the lowest count to the highest count". For `src/keylessGeocoder.js` and `src/search/placeSearch.js`, the table (:45, :46) gives "total branches 117 to 118" and "22 to 23". Neither the ledger nor the history records these ranges:
  - `gaps.json` has only `totals.branches` 118 and 23, with `low` equal to the not-covered counts.
  - history.jsonl:5 and :6 give only `[4,4]`, `[5,5]`, `[1,1]` and `[2,2]`, `[3,3]`, `[1,1]`.

  A reader of the history cannot see why these files are unstable. Correction: say in the proposal that the ledger records a range with equal low and high counts for these two files and keeps total branches 118 and 23. Or record the lowest and highest total counts in the history line of gap-ledger-058, and assert them in its test.

Round-7 findings:
- **Corrected:** F1.
  - The WHEN line of gap-ledger-057 (spec.md:298) names an entry without a range, or an entry with a count outside its range.
  - `range-totals` (proposal.md:66) and design.md:113 say that the ratchet command keeps the old total counts.
  - The gap-ledger-057 test (ledger.test.mjs:363–367) has a range case with counts in the range (totals stay the same, no history). It also has a case with a count below the range (a `totals` line).
- **Corrected:** F2. design.md:63 now names a worker thread with the environment of its process as the only case. It also names the worker thread with its own `env` or `execArgv` options and the child process without `NODE_V8_COVERAGE`, and it refers to `guard-processes`.
- **Corrected:** F3. The THEN and AND lines of coverage-gate-038 (coverage-gate spec.md:205–206) agree with the code. The test (testGuard.test.mjs:290) asserts the gate values and `NODE_OPTIONS` that the wrapped `spawn` gives, for a process without coverage and for a test runner.

Correction for unstable total counts (not from a finding):
- `sameCounts` compares the totals (ledger.mjs:481).
- The gap-ledger-058 test asserts the entry, the `unstable` line and the case with old samples that have no totals.
- `ids.json` and `links.json` have gap-ledger-058, and task 4.57 comes before task 4.58.
- The six history lines name establish-spec-governance and agree with `gaps.json`.
- The kept samples agree with the proposal table: 117/118 and 22/23 total branches with equal not-covered counts.
- F1, F3 and F4 in this round come from this correction.

Gate output: the only error is `REVIEW-MISSING`, which you expected. There are no warnings.
- The 202 scenarios in the change specs agree with `openspec/specs/`.
- `openspec/trace/retired-ids.json` does not exist, so no retired ID is in use.

I did not change files in the repository. I used only read-only commands there. The experiments are in `/tmp/claude-1000/-home-ianblenke-docker-gods-eye-view/bdb4f5c7-182e-45ee-82b1-3e3b1892873d/scratchpad/review-spec-r8/`:
- `zero-width.mjs` and `complete-058.mjs` use `copy/ledger.mjs`.
- In `tree/`, `ledger.test.mjs` passed 54 of 54 tests with the local Node v26.

F1 to F3 use only the logic of the ledger, so they do not depend on the Node version.