Verdict: FAIL

I read round2.diff, the round-1 report and the live `import-reach.mjs`. I could not run code. Commit read: 378024f.

- [ ] FINDING major scripts/spec/lib/import-reach.mjs:44 The round-1 attack still works. "New edge" means absent in the base commit's graph, not created by the merged commit. Edges are read from the HEAD tree (`files`/`readFile`). An author can add `import './legacy.js'` to a file that the merge changed, in their own commit, or in this change. That edge is new against base, so the file is reached, `usedNewEdge` is true, and the untrue gap is adopted. Neither the gates nor the Known limits name this. The limit that names rule 21 covers only the merge parent. Fix: take the new-edge test from the merged commit, for example by reading the importer at `--from` and requiring the edge in the `--from` graph and not in the base graph. Otherwise name the limit in proposal.md and make the rule-21 reviewer check each new edge.
- [ ] FINDING minor scripts/spec/lib/import-reach.mjs:44 A file that is new at HEAD, or renamed or moved, has no base entry. `baseEdges.get(file) ?? []` then makes every edge of that file new. An old import path from a renamed changed file reaches unchanged files as new reached files. Scenario 100 says "absent in the base import graph", so this is literal, but it is looser than the intent. Add this to the Known limits.
- [ ] FINDING minor scripts/spec/lib/import-reach.mjs:44 Edges are compared as resolved (importer, target) pairs. Changing the specifier text alone does not make an edge new. Adding the same import under another specifier does not either. A base file list that lacks a file the base graph needs gives edges that look new. The base and HEAD resolution use different file sets, so a file that exists only at HEAD cannot be a base target. This is the intended behaviour, but proposal.md does not state it.
- [ ] FINDING minor openspec/changes/archive/2026-10-01-ledger-adopt-reached/validation.md:357 The table says `G-base-head-content` is killed by T11. In T11 the base and HEAD content of `src/root.js` are identical. The base file set has no `src/new.js`, so a base graph read with HEAD content gives the same result. T9 or T15 is the test that can kill it (the `mid.js` content differs). Correct the "Test that failed" column, or show the T11 log line. I cannot confirm any of the 44 mutations from the log.
- [ ] FINDING minor proposal.md:64 The claim "A search found 0 unsupported imports" has no command or log named. Name the search, or remove the claim.

Checks that held:
- The counts agree with the lead's evidence: 44 distinct mutations (43 table rows plus `P-reached-branch`) and 380 tests.
- The requirement text is unchanged.
- Scenarios 107 and 108 are tested. T8 and T9 cover the all-base and new-middle-edge cases at the library level. T14 and T15 cover them at the command and gate level.
- The test for 103 now has a real assertion of the old rule.
- The test for 105 now asserts that an invalid reached line gives no count.
- The test for 104 now asserts the untrue allowance.
- The search visits each (file, flag) state once, so cycles end.
