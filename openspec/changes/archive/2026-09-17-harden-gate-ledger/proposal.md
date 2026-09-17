## Why

The change `establish-spec-governance` kept two minor findings and three known limits for a later change. The change `simplify-ledger` closed most of them, because it removed the ranges, the count band and the kept samples.

Three items stay open. The scenario `coverage-gate-046` has two groups of words for one group of tests. The scenario `gap-ledger-054` has the same fault for the covered counts, which is the finding S220. The proposal of `establish-spec-governance` still records seven known limits of the ranges and the band as open. The mechanism of each one is not in the project now. A reader of the known limits gets information that is not correct.

## What Changes

- Give the scenario `coverage-gate-046` one group of words for the tests that need the guard to count assertions.
- Give the scenario `gap-ledger-054` one group of words for the covered counts. This is the finding S220.
- Record the seven known limits of the ranges and the band as closed or smaller, with the name of the change.

## Capabilities

### Modified Capabilities
- `coverage-gate`: the words of the scenario `coverage-gate-046`.
- `gap-ledger`: the words of the scenario `gap-ledger-054`.

## Impact

- Changed files: `openspec/specs/coverage-gate/spec.md`, `openspec/specs/gap-ledger/spec.md`, `src/tooling/spec/testGuard.test.mjs`, `src/tooling/spec/ledger.test.mjs`, `openspec/trace/history.jsonl`, `openspec/trace/ids.json`, and the proposal and the review record of the archived change `establish-spec-governance`.
- The code of the gates and the code of the app stay the same.
- Gaps that this change opens: none. The change adds no code, and `openspec/trace/gaps.json` is the same as the base. The first ratchet run gave `src/data/labelArbiter.js` 52 not-covered branches with a total of 407, and the second run gave 50 with a total of 405. So `openspec/trace/history.jsonl` records four lines for that file. See the known limit `banked-branch-count`.
- Gaps that this change closes: none in coverage.

## Known limits and later changes

- `archived-proposal-edit`: This change changes the proposal of an archived change. The tree hash of that change is in its `review.md`, and the gates do not compare that hash again after the archive command. So no gate finds this edit.
- `banked-branch-count`: V8 counts the branches of `src/data/labelArbiter.js` in a different way in each run. A ratchet run can write the larger not-covered count with the larger total, so the covered count stays the same. For a changed file, the gate compares only the not-covered counts. So a later change of that file can remove the same number of covered branches with no error. The known limit `branch-identity` records the same effect for each file.
- `guarded-test-list`: The test of `coverage-gate-046` finds the tests that need the guard to count assertions with the text `GUARDED_RUN` in each test file of `src/tooling/spec/`. It names the expected tests of two files. The test does not check a test with an inline skip option, with another constant name, or in another folder. So the test does not make sure that it names each test that needs the guard to count assertions.
- `ci-sample-tool`: The review of `establish-spec-governance` told this change to make a tool that makes samples from a CI run. The kept samples are not in the project now, so such a tool has no purpose.
- `ledger-file-wording`: The requirement "Ledger file" says that the ledger records the not-covered branches and functions of each code file below 100%. The entries of a file that no test loads record null for the two counts. The review of `simplify-ledger` records this open finding with the acceptance of the project owner.
