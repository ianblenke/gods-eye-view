Verdict: FAIL
- [ ] S223 major proposal.md "The width limit applies only in the comparison with a base ledger, and the base has no ledger." This sentence disagrees with `gap-ledger-043`, with design.md and with the limit `deterministic-tests`, which give the width limit with no condition. The code checks the width of each entry with a range each time a base ledger exists. The next change uses this ledger as its base, so its gate stops for `src/data/manager.js` and `src/layers/flights/enrichment.js`.
- [ ] S224 minor proposal.md "the author made samples from the lcov reports and the guard results of two CI runs with the functions of the gates" does not agree fully with design.md, and "with the functions of the gates" can go with "made" or with "CI runs".
- [ ] S225 minor proposal.md "Then the author must add the samples of that run" — the same bullet says that the CI job does not keep samples, so no samples of that run exist to add.

Notes:
- **Table values:** all 13 rows agree with the `low` values and the high counts in `openspec/trace/gaps.json`.
- **Old limit name:** `unfound-instability` now occurs only in old review files.
- **Gate output:** "STE: 0 errors, 0 warnings."
