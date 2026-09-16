Round 3 verification complete. I re-derived every number in the corrected prose from `openspec/trace/gaps.json` with the two formulas (`toleranceOf` = `min(8, floor(total*0.04))`, old band `max(5, ceil(count*0.02))` at `47e355e`).

```
Verdict: PASS
Findings: none
```

Round-2 findings, one by one:

- **F1 (minor) closed.** `proposal.md:39` now gives the two sums apart: lines 1965 → 2039 for 206 of 353 loaded entries, covered branches 1802 → 532, covered functions 1765 → 86. I recomputed all five numbers from the ledger and each is exact.
- **F2 (minor) closed.** `design.md:13` names the covered counts, and `line-tolerance-larger` records the exception. Exactly 18 metrics are larger and the largest difference is 3 (`src/annotations/annotationEngine.js` branches 5→8, `src/data/radio.js` functions 5→8, and 16 more). The gap is named, so check 10 is met.
- **F3 (minor) closed.** `src/tooling/spec/gates.test.mjs:283` asserts `untracedTests['src/math.test.mjs']` is present in the ledger that `init` wrote, and `:288` asserts it is `undefined` after `ratchet --change add-demo`. The tag `[demo-001]` is what removes it, so the assertion fails if the ratchet run does not rewrite the ledger. The weak `version === 4` assertion is gone.

Checked for damage from the eleven STE corrections and the three post-archive edits, and found none:

- `openspec/specs/gap-ledger/spec.md` matches the delta requirement-for-requirement. The two REMOVED requirements are gone from the main spec.
- The hand-written Purpose agrees with the requirement "Count tolerance", and the empty line before `## Requirements` is present in all three edited main specs.
- The S3 wording "does not write a worse count" agrees with `toleranceCounts`, and with `gap-ledger-073` in the delta and the main spec.
- The design table recomputes correctly under the new rule, including the 25-branch case that gives 1, which agrees with `gap-ledger-071`.
- `retired-ids.json` holds 25 IDs, matching the two REMOVED reasons.
- Gate output has only the expected `REVIEW-MISSING`; trace is 238 of 238 verified and the ledger reports 0 mismatches.

One thing I considered and deliberately did not raise: the MODIFIED requirement "Ledger file" still says the ledger records "the not-covered lines, branches and functions" for each code file below 100%, while the 107 unloaded entries record `null` for branches and functions. The STE's S10 correction fixed the totals half of that sentence and left this half, but the clause is inherited verbatim from `47e355e:openspec/specs/gap-ledger/spec.md:7` and no author can hide a gap with it, so it is not worth a permanently open minor.
