Verdict: FAIL
- [ ] F1 major scripts/spec/lib/ledger.mjs:275 The gate does not check a range that moves up to a new position with the same width. The gate never compares the total counts of an entry with a range with the total counts of the run (`sameTotals`, :137). The base comparison only needs a `totals` history line from the checked change (:311). The gate does not check the values in that line, so an author can write the line by hand. Thus an author can remove tests of an unchanged file with a range. Then the author moves the low count, the high count and the total count up by the same number. The covered count stays equal to the base (:320), and `outsideChanged` has no effect on this path. There is no limit on the number. I tested a copy of `ledger.mjs` (`review-spec-r9/shift.mjs`) with the base entry of `src/keylessGeocoder.js`:
  - The run gave 8 not-covered branches and total branches 118, so 3 fewer branches were covered.
  - With the base ledger, `compareLedger` gave `LEDGER-LOST-COVERAGE`, and the ratchet command stopped.
  - The author edited the entry to branches 8, `low.branches` 8 and `totals.branches` 121, and added `{"change":"backfill-x","file":"src/keylessGeocoder.js","metric":"totals"}`. Then `compareLedger` gave no errors and no stale entries. `compareWithBase` with `outsideChanged: true` gave `[]`.

  This case is not in `range-totals` (proposal.md:66). That limit names only a change that adds covered branches and removes the same number of other covered branches.

  Correction: for an entry with a range, make the gate stop when the total counts are not equal to the base total counts and the high count is above the base high count, unless the current totals of the run show the change. One method is to compare the entry totals with the current totals in `compareLedger` when a count is above the base high count. Another method is to use the rules of a new range for such an entry. Add a scenario and a test for a moved range with changed totals and a history line that a person wrote. If you do not do this, add this case to `range-totals` and to design.md "Unstable coverage".
- [ ] F2 minor openspec/changes/archive/2026-09-14-establish-spec-governance/proposal.md:66 `range-totals` says that the gate "does not compare the total counts or the covered counts of an entry with a range". This has no condition. But gap-ledger-054 and the code (ledger.mjs:174) compare the covered counts when a not-covered count is above the high count. design.md:113 has the condition "While each not-covered count is in its range". Correction: add "while each not-covered count is in its range" to the sentence in `range-totals`.
- [ ] F3 minor openspec/changes/archive/2026-09-14-establish-spec-governance/specs/gap-ledger/spec.md:203 gap-ledger-021 says that the gate stops for an entry that the base ledger does not have. It gives no exception. The code does not do this check for an entry with a range when the base has no entry (ledger.mjs:275–295). Round 9 made this exception larger, because it now also applies to a range of width 0. The gap-ledger-037 test (ledger.test.mjs:290, `src/flaky.js` is not in `RANGE_BASE`) asserts no errors for such an entry. Thus the gap-ledger-021 scenario is not true for all entries. Correction: add "and the entry has no range" to the WHEN line of gap-ledger-021, or add a THEN line that names the rules of gap-ledger-059 for an entry with a range.
- [ ] F4 minor openspec/changes/archive/2026-09-14-establish-spec-governance/design.md:101 The text says: "For each file with different not-covered counts or total counts, the command writes a high count and a low count." Since the round-8 correction, `stabilityLedger` skips a file with no ledger entry and zero not-covered counts in each sample (ledger.mjs:490). The gap-ledger-058 test (ledger.test.mjs:517–518) asserts that `src/done.js` gets no entry. Correction: add "of a file below 100%" to that sentence in design.md, as in the WHEN line of gap-ledger-058.

Round-8 findings:
- **Corrected:** F1.
  - `compareWithBase` treats an entry with `low` as a new range when its base entry has no `low` (ledger.mjs:275).
  - gap-ledger-059 is in the spec, `ids.json`, `links.json` and task 4.58, and task 4.58 comes before task 4.59.
  - Its test (ledger.test.mjs:567) asserts `LEDGER-UNSTABLE-NO-HISTORY` and `LEDGER-UNSTABLE-FILE-CHANGE` for an added range of width 0. It passes with an `unstable` line. Without the new line of code, the test fails.
  - `deterministic-tests` (proposal.md:60) and design.md:105 say "new or wider".
  - The request to also check changed `low` values was not done. F1 in this round comes from that part.
- **Corrected:** F2. The WHEN line of gap-ledger-054 (spec.md:56) names an entry without a range or a count above the high count. The test (ledger.test.mjs:75–76) asserts `LEDGER-LOST-COVERAGE` for a count above the range. design.md:113 has the condition. proposal.md:66 does not have it (F2 in this round).
- **Corrected:** F3. `stabilityLedger` skips a file with no entry and zero not-covered counts (ledger.mjs:490). gap-ledger-058 names "a file below 100%" (spec.md:133). The test asserts no entry and no history line for `src/done.js`. design.md:101 does not have the change (F4 in this round).
- **Corrected:** F4. proposal.md:40 now says that the ledger records a range with equal low and high counts and the highest total branch count. This agrees with `gaps.json` (118 and 23) and with history.jsonl lines 5 and 6.

Gate output: the only error is `REVIEW-MISSING`, which you expected. There are no warnings.

I did not change files in the repository. The experiments are in `/tmp/claude-1000/-home-ianblenke-docker-gods-eye-view/bdb4f5c7-182e-45ee-82b1-3e3b1892873d/scratchpad/review-spec-r9/`:
- `shift.mjs` uses `copy/ledger.mjs` and shows F1.
- In `tree/`, `ledger.test.mjs` passed 55 of 55 tests with the local Node v26.

F1 uses only the logic of the ledger, so it does not depend on the Node version.