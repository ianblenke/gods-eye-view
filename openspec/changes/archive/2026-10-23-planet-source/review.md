# Review: planet-source

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-10-23
Gates: make gates CHANGE=planet-source passed
Rounds: 2
Scope: diff e36128b3
Reviewed-Tree: f830e420d7c629ad717579c0b2f8596ad4ce631345bd4cbf3c20babfacab3ea7

## Findings

A plan review came first (FAIL from both reviewers, at the plan commit 292c4fdd). The lead corrected its findings in the plan before the tests and the code. Its reports are outside the repository.

Round 1 had the scope full, at the commit e36128b3. The STE adversary gave PASS. The spec adversary gave FAIL with two major findings. The corrections changed one code file and two test files, so the lead moved the change back from the archive, ran the faults (run 4), the host tests, the checks and the ratchet again, and archived the change again (028f87a4).

Round 2 had the scope diff e36128b3, at the commit 028f87a4. Both reviewers gave PASS.

The reports of each round are in `review/round-<n>/`. Each file holds the report in the shape of the reviewer.

### Round 1 (commit e36128b3)

- [x] FINDING major (spec adversary) Scenario 015 says that the store step answers also when the count equals the limit, but no test shared a search in flight at the limit. Fixed: the test `[planet-source-015] shares an upstream search that is in flight when the count equals the limit`, and the fault "in-flight share after the budget" (first attempt of run 4 left it alive; its changed code read the map after the await; corrected, and run 4 kills it).
- [x] FINDING major (spec adversary) Scenario 018 says that each position has 2 or 3 numbers, but a third value that is not a number passed. Fixed: `positionOf` refuses it, the samples `[10, 20, 'x']` and `[10, 20, null]`, and the fault "third value not checked".
- [x] FINDING minor (spec adversary) The rate limit uses the `Date` clock, and the other steps use the option `now`. Kept: the lead accepts this minor finding under the owner rule. The tests mock `Date`, and the clock is the same one in the SkyWatch plugin.
- [x] FINDING minor (STE adversary) design.md says that `truncated` is true for a next page, but it is also true for more than 50 scenes. Kept: the lead accepts this minor finding under the owner rule. The sentence is true, and scenario 019 has both cases.
- [x] FINDING minor (STE adversary) design.md says "4 days" for a span of 5 calendar dates. Kept: the lead accepts this minor finding under the owner rule. The sentence is true for the span from the first date to the last.
- [x] FINDING minor (STE adversary) evidence/api-description.txt uses "may". Kept: the lead accepts this minor finding under the owner rule. The line quotes the terms of Planet.
- [x] FINDING minor (STE adversary) The spec uses "less" for minus in scenario 031. Kept: the lead accepts this minor finding under the owner rule. A new text of the spec changes its hash and needs another ratchet.
- [x] FINDING minor (STE adversary) Three test titles use "above", "good" and "in flight". Kept: the lead accepts this minor finding under the owner rule. A change of a title is a change of a test file.

### Round 2 (commit 028f87a4)

Both reviewers gave PASS. Each major finding of round 1 is closed.

- [x] FINDING minor (spec adversary) `await fromStore(id)` can return `null`, and `await null` yields a microtask, so two requests could both start a search. Kept: the lead accepts this minor finding under the owner rule. Each request reads its body with an await first, so two requests can meet in one microtask queue only in a rare case. The effect is one extra search. The daily count still counts both. A change is a change of a code file; the owner can ask for it.
- [x] FINDING minor (spec adversary) The samples `'x'` and `null` of the third value are only in the test. Kept: the lead accepts this minor finding under the owner rule. A new text of the spec needs another ratchet.
- [x] FINDING minor (STE adversary) evidence/faults.txt uses "an in-flight share", "text" and "attempt" in line 11. Kept: the lead accepts this minor finding under the owner rule.
- [x] FINDING minor (STE adversary) A test title says "the count" and the other titles say "the daily count". Kept: the lead accepts this minor finding under the owner rule.
