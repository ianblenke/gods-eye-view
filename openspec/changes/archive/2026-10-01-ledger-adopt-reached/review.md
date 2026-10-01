# Review: ledger-adopt-reached

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-10-01
Gates: make gates CHANGE=ledger-adopt-reached passed
Rounds: 3
Scope: diff 378024f
Reviewed-Tree: 0eef00d4f31b9e9014fe213b1f740bd9d773469a909fe36017fee9d9b9036574

## Findings

### Round 1 (scope: full) - FAIL

Full agent reports: `review/round-1/spec-adversary.md`, `review/round-1/ste-adversary.md`.

- [x] major (spec-adversary) The import path was read from the final tree, so an author could add an import and make an unchanged untrue file adoptable. Corrected in round 2 and again in round 3: the new edge must exist in the merged commit graph and be absent in the base graph.
- [x] minor (spec-adversary) Counts, totals and allowance limits, resolution limits, a base entry with no `untrue` field, a reached adopt line that becomes not valid. Corrected: each is a Known limit in `proposal.md`.
- [x] minor (spec-adversary) Scenario 104 lacked an AND line, and the second THEN of scenario 103 had no proof. Corrected with a real assertion and a mutation for each.
- [x] minor (spec-adversary) The numbers in `validation.md` did not agree with the evidence. Corrected from the final runs.
- [x] major (ste-adversary) The test location sentence, the conditions of scenario 105, the requirement text and the word "line" with three meanings. Corrected. The requirement text stays unchanged by design, and `design.md` explains how scenarios 096, 097 and 105 fit.
- [x] minor (ste-adversary) 10 wording items in the design, the proposal, the tasks and the test titles. Corrected, including two renamed new tests.

### Round 2 (scope: diff acbbb29) - FAIL

Full agent reports: `review/round-2/spec-adversary.md`, `review/round-2/ste-adversary.md`.

- [x] major (spec-adversary) The new edge was still measured against the base only, so an author could still add an import in their own commit. Corrected: the edge must be in the merged commit graph and absent in the base graph, with new scenario `gap-ledger-109` and tests at the library, command and gate level.
- [x] minor (spec-adversary) Known limits for moved files, edge pairs, base file lists, a wrong killing test in `validation.md`, and a claim with no command. Corrected in `proposal.md` and `validation.md`.
- [x] major (ste-adversary) Two inconsistencies in `validation.md` (the test reference and the test counts). Corrected.
- [x] minor (ste-adversary) 13 wording items: one term for the adopt line, the definition of an edge, scenario 101, design words, proposal words, tasks with one instruction, test titles. Corrected.

### Round 3 (scope: diff 378024f) - PASS

Full agent reports: `review/spec-adversary.md`, `review/ste-adversary.md`.

- [x] minor (spec-adversary, import-reach.mjs:45) The merged commit graph and the base graph cover whole trees, not diffs from the merge base. Corrected: Known limit in `proposal.md`.
- [x] minor (spec-adversary and ste-adversary, proposal.md and validation.md) A blank line split the known limits list and three tables, the wording of two limits, a sentence with no log named, and wording in `design.md`. Corrected in the archived prose. Lint shows 0 errors.
- [x] minor (spec-adversary and ste-adversary, importReach.test.mjs:157) A leading space before `test(`, and the title says "refuse" where scenario 109 says "writes no entry" and "stops the build". Accepted by Ian Blenke.
- [x] minor (ste-adversary, spec.md scenario 109) Three terms name one thing: "author-added new edge" and "an edge that only HEAD has". Accepted by Ian Blenke.
- [x] minor (ste-adversary, importReach.test.mjs T8) The title says "writes no gap", and scenario 107 says "writes no entry". Accepted by Ian Blenke.
- [x] minor (ste-adversary, spec.md scenario 100) "the path uses the edges of the HEAD graph" defines the HEAD graph only in `design.md`. Accepted by Ian Blenke.
- [x] minor (ste-adversary, spec.md scenarios 102 and 107) A definition of a new edge sits under WHEN and reads as a second condition. Accepted by Ian Blenke.
- [x] minor (ste-adversary, importReach.test.mjs T11) The title says "base files", and scenario 108 uses the longer term. Accepted by Ian Blenke.

## Rule 21

Rule 21 applies to a change that uses `adopt`. This change builds the gate and does not use `adopt`. The second upstream sync uses the new rule and records the check of its merge commit in its own `review.md`.
