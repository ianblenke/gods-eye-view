## Why

A merge can extend an import path to a file with the base content. A file that Vite loads can then have untrue coverage. The old adopt rule rejects that gap.

## What Changes

- Add a reached exception to the command `adopt` and its gate checks.
- Record the boolean `reached: true` on each new reached adopt line.
- Keep the old rule for changed files.

## Capabilities

### Modified Capabilities

- `gap-ledger`: extend Adoption of merged code.

## Impact

Change the gate, ledger library, import descendants library and spec tests. This change opens no gap and closes no gap. Keep the existing gate branch gap. The lead runs the ratchet and the gates.

## Known limits

- The rule uses only import paths with literal specifiers. It cannot adopt a file that a test reaches through another method.
- Resolution tries only exact paths, `.js`, `.mjs`, `/index.js` and `/index.mjs`. It does not try `.ts`, `.tsx`, `.jsx`, `.cjs` or `.json` extensions. It does not resolve specifiers with a query such as `?raw`.
- The merge owner must check the upstream second parent under rule 21. The gate cannot prove upstream origin.
- A file with a parse error supplies no import edges.
- A base entry with no `untrue` field cannot serve as the base entry for a reached adopt line.
- A reached adopt line is not valid when its file has true coverage. That adopt line then gives no allowance.
- The gate does not compare the adopt line counts for `lines`, `branches` and `functions` with the measurement. Changed files have the same limit for these counts.
- The gate omits the base totals check for a file with a valid reached adopt line. The content hash check stays active.
- For lines, the ledger allowance cannot exceed the larger of the base count and the adopted count. A reached file has no waiver allowance.
- For non-null branch and function counts above the base count, the gate allows adopted counts or no decrease in the covered counts of the base.
- An entry absent from the base must stay within every adopted count. A measurement above the ledger allowance still stops the build.

- A changed file that is new or renamed has no base entry. Each edge of it in the merged commit graph is new.
- The rule treats a moved file as a renamed file. A reviewer must check its edges.
- Edges are pairs of resolved files. A change to specifier text alone does not make an edge new.
- The same import under another specifier is not new.
- A base file list that lacks a file needed by the base graph makes edges look new.
- The base, merged commit and HEAD graphs resolve imports over different file sets.
