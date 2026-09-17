## Why

The gate `LEDGER-LOST-COVERAGE` stops the build for `src/search/placeSearch.js`, a file that lost no coverage. V8 measures its branch total as 22 in one run and 23 in another, with the same 3 branches not covered each time. The covered count derives from the total, so the fall in the total reads as a lost branch.

## What Changes

- Compare the loss of covered branches and covered functions of an unchanged file, in place of the covered count alone. The loss is the smaller of the rise of the not-covered count and the fall of the covered count. A fall of the not-covered count no longer hides a fall of the covered count.
- The scenario `gap-ledger-054` gets a new message that shows both counts.
- The scenario `gap-ledger-070` gets the loss rule too, with a new message that shows both counts.
- The scenario `gap-ledger-072` gets a second condition: the gate does not stop the build when only one of the two differences is above the tolerance.
- Add the scenario `gap-ledger-078` for a smaller total with the same not-covered count.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `gap-ledger`: the requirement "Ratchet rule" gets the loss rule and the scenario `gap-ledger-078`. The requirement "Count tolerance" gets the loss rule in the scenarios `gap-ledger-070` and `gap-ledger-072`.

## Impact

- Changed files: `scripts/spec/lib/ledger.mjs`, `src/tooling/spec/ledger.test.mjs`, `openspec/specs/gap-ledger/spec.md`, `openspec/trace/ids.json`, `openspec/trace/history.jsonl`, `openspec/trace/links.json`. Two ratchet runs added two history lines each. The branch counts of `src/data/labelArbiter.js` moved and then moved back.
- Gaps that this change opens: none.
- Gaps that this change closes: none in coverage. The ratchet run keeps the entry of `src/search/placeSearch.js` at a branch total of 23 with 3 branches not covered.
- The ratchet runs of this change recorded `src/data/labelArbiter.js` at a branch total of 405 or 407, with 50 or 52 branches not covered. This change never touches that file.
- The covered branch count stays 355 for both runs, so the file loses no coverage. The entry holds the count of the last run, and a later run can give the other count.
- The known limit `banked-branch-count`, in the archived change `2026-09-17-harden-gate-ledger`, names this V8 branch-count instability.

## Known limits and later changes

- `uncalled-function-branches`: A fall of the covered count no longer stops the build, on the branches or on the functions, in two cases. The not-covered count can stay the same, or it can rise by no more than the tolerance. A caller in another file that no longer calls a function with covered branches of its own gives this shape. One shape, checked against the code, moved from 30 not covered of 400 to 31 of 361, and lost 40 covered branches with no stop. The line metric still stops the build for this shape, unless the function has at most the line tolerance in lines. The second case needs the tolerance conditions, and a stricter rule is a later change.
- `requirement-text-less-exact`: The requirement "Count tolerance" states a bound of the tolerance for a count difference. The scenarios `gap-ledger-054`, `gap-ledger-070`, `gap-ledger-072` and `gap-ledger-078` give the exact rule, and the code follows them. A reader of the requirement alone gets a bound the code does not follow for the covered count. The code can allow more than that bound, never less. The requirement text does not change here: a change gives each of its six scenarios a new hash, and `gap-ledger-071` has nothing new to test. A later change that already changes that requirement can make the requirement text exact.
