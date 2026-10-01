## Why

A merge can extend an import path to a file with the base content. A file that Vite loads can then have untrue coverage. The old adopt rule rejects that gap.

## What Changes

- Add a reached exception to the command `adopt` and its gate checks.
- Record boolean `reached: true` on each new reached line.
- Keep the old rule for changed files.

## Capabilities

### Modified Capabilities

- `gap-ledger`: extend Adoption of merged code.

## Impact

Change the gate, ledger library, import reach library and spec tests. Open no gap. Close no gap. Keep the existing gate branch gap. The lead runs the ratchet and the gates.

## Known limits

The rule uses only import paths with literal specifiers. It cannot adopt a file that a test reaches through another method. The merge owner must check the upstream second parent under rule 21. The gate cannot prove upstream origin. A file with a parse error supplies no import edges.
