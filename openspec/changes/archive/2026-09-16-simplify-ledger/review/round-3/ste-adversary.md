Verified the corrections against `gaps.json`, `toleranceOf`/`toleranceCounts` in `scripts/spec/lib/ledger.mjs`, and the old `rangeLimit`/`bandFileCounts` at `HEAD`. Recomputed every number in the known limit.

```
Verdict: PASS
- [ ] S1 minor specs/gap-ledger/spec.md:58 (and openspec/specs/gap-ledger/spec.md:8) "For each code file below 100% ... It also records the not-covered lines, branches and functions, and the total counts of each loaded file." The text does not agree with the code. The correction closed the totals half, but 107 entries of a file that no test loads still record null for the not-covered branches and the not-covered functions. Write: "It records the not-covered lines of each code file, and the not-covered branches and functions and the total counts of each loaded file."
- [ ] S2 minor design.md:13 "Keep the gate as strong as the three mechanisms together for the covered counts in sum." Approved words. "in sum" also means "in summary". Write: "Keep the sum of the new tolerances of the covered counts not larger than the three mechanisms together."
- [ ] S3 minor proposal.md:39 "The sum of the allowed lines becomes 2039 in place of 1965. For the covered branches the sum becomes 532 in place of 1802" One word, one meaning. The four numbers are sums of the tolerance alone; the sum of the allowed lines is 31414. Write: "The sum of the line tolerances becomes 2039 in place of 1965. For the covered branches the sum of the tolerances becomes 532 in place of 1802, and for the covered functions 86 in place of 1765."
- [ ] S4 minor proposal.md:39 "For 18 of the 706 loaded metrics the new covered tolerance is larger than the old band" One word, one meaning. The 353 loaded entries have 1059 metrics; 706 counts the branches and the functions only. "the covered tolerance" is the tolerance of the covered count. Write: "For 18 of the 706 covered metrics of the loaded entries, the new tolerance of the covered count is larger than the old band, by at most 3."
```

Round 2: S1 to S9 and S11 are closed. S10 is half open (see S1 above): the totals half is correct now, the not-covered branches and functions half stays. The round-1 carry-overs S8, S14 and S21 are closed with S8, S7 and S11.

Checked and correct (recomputed from `openspec/trace/gaps.json`):
- The line sums 1965 and 2039, the branch sums 1802 and 532, the function sums 1765 and 86, and 206 of 353 loaded entries.
- 18 of 706 covered metrics get a larger tolerance, and the largest difference is 3 (`src/annotations/annotationEngine.js` branches: 8 in place of 5).
- `gap-ledger-073` "keeps the entry count of each metric with a worse current count" agrees with `toleranceCounts`, for the line count and for the covered branch and function counts.
- The empty line before "## Requirements" is in `openspec/specs/gap-ledger/spec.md`, `openspec/specs/spec-trace/spec.md` and `openspec/specs/ci-gates/spec.md`, and `design.md:70` records the reason.
- The corrected design text at `design.md:74` is active and has no phrasal verb.
