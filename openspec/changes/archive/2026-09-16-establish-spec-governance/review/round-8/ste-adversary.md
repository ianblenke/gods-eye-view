Verdict: FAIL
- [ ] S119 openspec/changes/archive/2026-09-14-establish-spec-governance/proposal.md:40 "The ledger records a range for each file, from the lowest count to the highest count that the runs gave:" and the table rows at :45 "total branches 117 to 118" and :46 "total branches 22 to 23" One word, one meaning. In this table, "range" means the lowest and highest counts that the runs gave, and this includes the total branch count. Everywhere else in the change, "range" means the low count and the high count of the not-covered counts in a ledger entry. See `range-totals` at proposal.md:66 ("the gate does not compare the total counts of an entry with a range"), design.md:113 and gap-ledger-058 ("writes a range to the ledger entry of that file, with each low count equal to its high count"). The ledger does not record 117 to 118 or 22 to 23. For `src/keylessGeocoder.js`, it records the ranges lines 4 to 4, branches 5 to 5 and functions 1 to 1, and the total branch count 118. For `src/search/placeSearch.js`, it records the total branch count 23. Also, the table now uses "branches" for the not-covered branch count and "total branches" for the total branch count. Thus "lines 40 to 44" and "lines 562 to 567" can read as line numbers. Write: "Unstable coverage: six old files have coverage that changes between runs. The table gives the lowest count and the highest count that the runs gave. The ledger records a range for the not-covered counts. It does not record a range for the total counts:". Then change the column heading "Range" to "Counts", and use "not-covered lines 40 to 44", "total branch count 117 to 118", "total branch count 22 to 23", "not-covered lines 562 to 567, not-covered branches 137 to 138", "not-covered branches 50 to 52" and "not-covered lines 1302 to 1304, not-covered branches 219 to 221".

Notes for the caller:
- **Round-7 check:** S118 is corrected. proposal.md:63 now has the exact text from the finding, and the sentences after it have no new STE problems.
- **Merged specs:** openspec/specs/*/spec.md is still the same as the delta specs, except for the header, Purpose and Requirements lines. The Purpose lines have no findings.
- **Gate output:** it shows "STE: 0 errors, 0 warnings". There are no STE-PASSIVE or STE-ING warnings to examine.
- **Test names:** compared with round 7, line 82 (coverage-gate-038) changed and line 152 (gap-ledger-058) is new. Neither has a finding.
- **Other new or changed prose has no findings:**
  - the limits `guard-processes` and `range-totals`
  - design.md:97–113 (unstable files and total counts) and design.md:49 and :63 (worker threads)
  - coverage-gate-038 (its heading now agrees with coverage-gate-039)
  - gap-ledger-057 and gap-ledger-058
  - tasks 4.57 and 4.58
- **Phrasing left as it is:**
  - The coverage-gate-038 heading says "a process without coverage", and coverage-gate-037 says "collects coverage". I did not report this, because coverage-gate-007 already uses "without coverage" with the same meaning.
  - gap-ledger-057 says "an entry" and then "a file". I did not report this, because the meaning is clear and a different wording is only a preference.
- I did not read .env, and I made no changes to files in the repository.