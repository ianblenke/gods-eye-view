Verdict: PASS

- [ ] FINDING minor src/tooling/spec/gates.test.mjs:2614 change-review-033 AND "name the command output as the verdict source" is unasserted. AGENTS.md:21 (rule 8) is pinned by no test (one grep hit). Pin it with `includes` and add a mutation row.
- [ ] FINDING minor AGENTS.md:22 Rule 9 says the first log line names the command. That holds only for check, ratchet and the document mode. init (gates.mjs:545), rebaseline (573), adopt (592) and waive (462) print `Gates passed.` with no `Command:` line. Bound the rule or add a Known limit.
- [ ] FINDING minor A/specs/coverage-gate/spec.md:132 "MUST keep the runtime, local environment, QA header" has no document-mode test for GATES-LOCAL-ENV (gates.mjs:488; test 490 runs `check`). QA-HEADER cannot fire there, because a QA script is a code file and a changed one is refused. Test 2587 proves QA-COVERS-* only. Add a local-env test or bound the sentence.
- [ ] FINDING minor A/specs/coverage-gate/spec.md:136 and A/design.md:123 "reads tracked .json, .yaml and .yml files under the three allowed paths" is false. findCoverageFlags (coverage.mjs:199, FLAG_SCAN_FILE at line 12) reads every tracked code, json and yaml file. Only those under the allowed paths can change. Say "can change".
- [ ] FINDING minor Makefile:11 The node_modules exclude is proven only at top level (gates.test.mjs:2560). `node_modules/**` survives, and nested folders then get markers (cost, no gap). Rows 157 and 158 are equivalent mutants, because `**/*.mjs` covers both; only the text pin kills them. Add a nested row or accept by name.
- [ ] FINDING minor scripts/spec/lib/measurement.mjs:63 Changing `!file.startsWith('.gev-cache/')` to `includes` survives. No test refuses a protected ignored file in a nested `.gev-cache/` (test 2437 has only `.gev-cachex/`), so the mutant would exempt it. Add `pkg/.gev-cache/a.test.mjs` and a row.
- [ ] FINDING minor A/proposal.md:56 "The image shell was proven by the image runs" is unbounded. `xargs -r` runs the inner marker loop (printf, dirname, mkdir) only if an ignored protected file exists, and the brief does not say the clone had one. Bound it, or probe the image once with an ignored x.test.mjs.

A = openspec/changes/archive/2026-10-08-gates-one-measurement. Tree read: the clone path in the brief (commit 51ee804). I cannot run git, so I did not confirm HEAD.

Round-2 findings closed:
- **Major 1:** all 22 pathspecs of `GATES_DOCS_MARKERS` have a table row and a unique mutation row (152-173). Nested `**/` is proven by `src/deep/x.*` and `containers/*`. A non-code file under `scripts/spec` is proven by test 2155.
- **Major 2:** row 174 is killed by test 2587. The argument for removing `findIgnoreComments` and `findTestImports` is true. Their inventory is tracked code files, and changed code and test files are refused before the path test (measurement.mjs:62), also under the allowed paths. `findCoverageFlags` stays.
- **Minors:** rows 175-188 and the 7 new tests kill them. All 7 refusals assert `Ratchet commit:`. The `timed` mutants cover all 9 COMMANDS.

The ratchet path matches main's `check` path: same order, and ledger, history, registry and links are re-read after the writes. `reviewFiles` is recomputed (gates.mjs:672). The stale `diffFiles` feeds only `changedTests` and MERGE_MODULE, which the ratchet cannot write. Status is 1 before the writes and 2 after. I found no weakened gate (rule 18).

Not done: I only read files. I ran no test, mutation, make, git or image command. I did not read mutations.json rows 1-151 (spot-checked), evidence.md lines 175-2718, the probe scripts or ledger.test.mjs. I did not verify the 100% coverage claim or dash behavior.
