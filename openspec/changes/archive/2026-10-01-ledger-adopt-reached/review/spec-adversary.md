Verdict: PASS

I read round3.diff, the live `import-reach.mjs`, the merge fixture and tests T13 to T17 in `gates.test.mjs`, and `muts.json`. I could not run code. Commit read: the clone's current tree (HEAD ee1e7a1 per the caller).

The round-2 major is fixed. `import-reach.mjs:45` now needs `fromEdges.has AND NOT baseEdges.has`. T17 makes the author edge in the working tree only, and `src/merged.js` is a changed file in `up`, so the test reaches the rule it names. The operand mutations are real: `G-from-operand` replaces the from operand with `true`, `G-all-new` replaces the base operand with `true`, and `G-state-propagate` removes the `usedNewEdge ||` operand. The requirement text is unchanged, and the validation counts agree with your evidence: 52 mutation rows in the table, 51 ids in `muts.json` plus P-reached-branch, and 382 tests.

- [ ] FINDING minor scripts/spec/lib/import-reach.mjs:45 "New" means in the `--from` tree and absent in the base tree, not "brought by the merge". An old upstream edge that the fork removed from base counts as new. An author who adds the same edge at HEAD then passes. This needs a coincidence of fork removal and author re-add, but proposal.md does not name it. Add a Known limit that the from and base graphs are whole-tree graphs, not merge-base diffs.
- [ ] FINDING minor src/tooling/spec/importReach.test.mjs:157 The T16 line starts with a space (` test('[gap-ledger-109] ...`). Either format:check does not cover this folder or it is not enforced. Remove the space.
- [ ] FINDING minor openspec/changes/archive/2026-10-01-ledger-adopt-reached/validation.md:360 A blank line splits the scenario table before the `gap-ledger-109` row, so the row renders outside the table. The same happens in the test list before T16 and T17. Remove the blank lines.
- [ ] FINDING minor openspec/changes/archive/2026-10-01-ledger-adopt-reached/proposal.md:54 The Known limits list has a blank line before its last six items. Merge them into one list. The statement "Each edge of it in the merged commit graph is new" holds only for a file that exists in the `--from` tree. Add that condition.
- [ ] FINDING minor openspec/changes/archive/2026-10-01-ledger-adopt-reached/validation.md:519 "The git status command lists 11 changed files" has no log named. Name the log or remove the sentence.

Scenarios 100 to 109 claim only what their tests assert. The 109 library test also covers three cases: `from` lacking `mid.js`, `from` lacking the target file, and HEAD removing the merged edge.
