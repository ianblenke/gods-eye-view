## Why

The change `credential-boundary` is complete and correct, and it cannot pass the gates. It edits `src/voice/gevActions.js`, a pre-spec file with a ledger entry. The change adds 48 branches to that file, and its tests cover all 48. One branch, at line 2974, executes, and the coverage report counts it as not covered. A marker in that code printed two times from two throw sites, so the report is wrong for that branch.

The file has other content than the base commit, so it has no tolerance. The gate `LEDGER-LARGER-GAP` stops the build for a changed file with more not-covered branches than its entry. So the change added two tests for old code in the same file, to offset the count. Those two tests have no scenario, because no capability describes voice actions. The gate `LEDGER-NOT-IN-BASE` then stops the build for the two untraced names. The two gates both stop the change, one from each side.

## What Changes

- Add a waiver. A waiver is a history line that a person writes with the ledger command `waive`. It names a change, a file, a metric, the lines, a count, the content hash of the file and a reason.
- Allow the not-covered count of that metric to be above the entry count by at most the waived count. This applies to a changed file with the content hash of the waiver. The gates and the ratchet command use the same rule.
- Allow a ledger entry to be above the base entry by at most the waived count of the checked change. This applies to a changed file with the content hash of the waiver.
- Record the rise in the history with the reason `waived` when the ratchet command writes it.
- Give no waived count to a file with other content than the waiver, to a file with the base content, or to another change.
- Keep the rule for untraced test names. A test without a scenario ID is a gap, and a gap cannot open. The design gives the reason.
- Change the scenarios `gap-ledger-004`, `gap-ledger-013`, `gap-ledger-017`, `gap-ledger-022` and `gap-ledger-040` for the waived count.
- Add the requirement "Coverage waiver" with the scenarios `gap-ledger-079` to `gap-ledger-087`.
- Allow a waiver to add a ledger entry for a file with none. This applies when the file's not-covered counts are each at or below the sum of its waivers for that metric. The design gives the reason in D10.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `gap-ledger`: the requirements "Ratchet rule", "Comparison with the base commit" and "Ratchet command" get the waived count in five scenarios. The new requirement "Coverage waiver" gets `gap-ledger-079` to `gap-ledger-087`.

## Impact

- Changed files: `scripts/spec/lib/ledger.mjs`, `scripts/spec/gates.mjs`, `src/tooling/spec/ledger.test.mjs`, `src/tooling/spec/gates.test.mjs`, `openspec/specs/gap-ledger/spec.md`, `openspec/trace/ids.json`, `openspec/trace/links.json` and `openspec/trace/history.jsonl`.
- The ratchet run of this change can also change `openspec/trace/gaps.json`. V8 moves the branch counts of `src/data/labelArbiter.js` between runs, and the known limit `banked-branch-count` records that.
- Gaps that this change opens: one. `scripts/spec/gates.mjs`'s `waive` command has the exact defect it fixes, in its own new code (D10). The team put the seven `if` blocks into one array and one `find` call, and that closed six of the seven phantom branches. The change waives the last one on itself.
- Gaps that this change closes: none.
- This change writes one waiver, on its own file `scripts/spec/gates.mjs`. The change `credential-boundary` writes its own separate waiver after this change merges. The design gives the steps.
- The ledger file keeps the version 4. The waiver is a history line, so `openspec/trace/gaps.json` gets no new field.

## Known limits and later changes

- `waiver-lines-not-checked`: The waiver names the lines of the not-covered items, and the gate does not compare those lines with the coverage report. The parser `parseLcov` keeps only the summary counts of each file. A later change can keep the line of each not-covered item and stop the build for a waiver that names a covered line. Until then, the reviewer of a change reads the lines and the reason.
- `waiver-needs-entry`: RESOLVED by D10. The gates of this change hit the same defect in their own new code. There, `LEDGER-NEW-COVERAGE-GAP` stopped the build first and no waiver reached that path. `compareLedger` and `ratchetLedger` now get a waived count for a file with no entry.
  - The ratchet command adds the entry when the waivers cover it. `compareWithBase` then stopped the same new entry with `LEDGER-NOT-IN-BASE`, so it gets the same waived count for an entry the base ledger does not have. `gap-ledger-086` and `gap-ledger-087` name the scenarios.
- `waiver-not-for-unchanged-file`: A file with the base content has the tolerance and the loss rule of `gap-ledger-054`. A wrong count above the tolerance in such a file has no waiver. The waive command refuses a file with the base content.
- `count-offset`: For a changed file, the gate compares the not-covered counts, not the not-covered items. So a change can cover an old branch and leave a new branch not covered, with no error. The two offset tests of `credential-boundary` have this shape. A comparison of the not-covered items is a later change, and it needs the line of each item from `parseLcov`.
- `no-make-target`: The waive command runs on the host with `node scripts/spec/gates.mjs waive`, because it runs no test. The scenario `ci-gates-007` names the make targets, so a `waive` target is a later change of that capability.
- `untraced-name-no-exit`: The gate keeps the rule that a branch cannot add an untraced test name. The two names that the commit `8b89c92` recorded by hand must get a scenario or go away. The design gives the reason and the two exits.
