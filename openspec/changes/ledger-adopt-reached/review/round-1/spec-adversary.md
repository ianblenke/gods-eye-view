Verdict: FAIL

I read round1.diff and the live scripts/spec files. I could not run code. Commit read: acbbb29.

- [ ] FINDING major scripts/spec/lib/import-reach.mjs:48 The import path is read from the HEAD tree, not from the merged commit. An author can add `import './legacy.js'` to any file the merge changed, in their own commit or in this change. The rule 1 to 4 then holds for that file, and the new untrue gap is adopted. Condition (4) never checks that the merge created the path. Neither the gates nor the known limits stop or name this. Fix: require that the edge is absent in the base tree (compute reach on base and on HEAD, and accept only new paths). Otherwise name the limit in proposal.md and require the rule-21 reviewer to check it.
- [ ] FINDING minor scripts/spec/lib/ledger.mjs:515 A reached line checks only `untrue === true` and `untraced === 0`. Its `lines`, `branches` and `functions` are never compared with the measurement. A hand-written line with `lines: 999` raises the allowance of an unchanged file. The totals check is also skipped entirely at ledger.mjs:529 for any file with a reached line, so any totals value passes. Scenario 104 says "the measured ... counts", which the gate does not check. Add this to the known limits.
- [ ] FINDING minor scripts/spec/lib/import-reach.mjs:466 Resolution tries only exact, `.js`, `.mjs`, `/index.js` and `/index.mjs`. It misses `.ts`, `.tsx`, `.jsx`, `.cjs` and `.json`, and a specifier with a query such as `?raw`. Tests that pass `.ts` or `.jsx` names would show whether `moduleImports` parses those files at all. This produces false stops and is not in the known limits. The limit "literal specifiers" does not name it.
- [ ] FINDING minor scripts/spec/lib/import-reach.mjs:491 The condition `baseEntry.untrue === false` rejects a base entry that has no `untrue` field. Scenario 100 says "false untrue coverage", so this agrees with the spec, but it stops a correct change for old base ledgers. Name it in the known limits.
- [ ] FINDING minor openspec/specs/gap-ledger/spec.md:380 Scenario 104 lacks an AND line that says untrue coverage is allowed for a reached file with base content. The behavior comes from ceiling.untrue, and the requirement text stays unchanged. Scenarios 092, 093 and 098 still say "content not equal to base", so a reader finds no scenario for it. Add the AND line to 104. A MODIFIED requirement cannot change the requirement text, but a scenario can.
- [ ] FINDING minor src/tooling/spec/importReach.test.mjs:693 The second THEN of 103 ("the old rule adopts its gap only when the merged commit changed the file") is tagged but not proved. The test uses `eligible: () => true`, so no check shows that an unchanged file is rejected by the old rule. The 091 test covers that part. Add a tag, or add an assertion for it.
- [ ] FINDING minor openspec/changes/archive/2026-10-01-ledger-adopt-reached/validation.md:298 The counts disagree with the lead's evidence. validation.md says 32 mutations and 373 tests, and the lead reports 33 mutations and 374 tests. validation.md:306 says the gate keeps "one branch gap" for gates.mjs at 99.51%. Correct the numbers to match the final run.

Check (d) is equivalent. For a non-reached file, `adoptedFor` returns undefined, so `ceiling` is NO_ADOPTED with every metric at 0. `moreThan` already requires `entry[metric]` above a non-null base, so `entry[metric] > 0` always holds. The `!ceiling.reached` guard cannot change a non-reached result.

Checks that held:
- A reached line for an unchanged file with true coverage is rejected.
- A reached line with a base entry that is already untrue is rejected.
- A reached line with a non-merged commit is rejected.
- A reached line whose file is outside `codeFiles` is rejected.
- A reached line with changed content is rejected.
- A reached line with no path is rejected.
- A test-only path gives no edge.
- Cycles end, because each file is visited once.
- A parse error gives no edges.
- A reached line becomes invalid once its coverage turns true, and then gives no allowance.
