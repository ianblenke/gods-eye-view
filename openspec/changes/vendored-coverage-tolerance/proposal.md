## Why

V8 can merge adjacent branch ranges with equal counts. The counts can differ across machines.
An upstream sync can then fail with LEDGER-STALE for files that the fork does not edit.
A file that the fork edits can also have different total counts and equal not-covered counts.

## What Changes

- Extend count tolerance to a file that equals its adopted source.
- Use the same adopted source rule for the ci, check and ratchet commands.
- Accept total count differences for a file with a valid adopt line, equal hashes and equal not-covered counts.
- Apply never-worse counts to a file that equals its adopted source without base content.
- Use toleranceCounts for a file with base content.
- Do not change the tolerance sizes and all coverage error rules.

## Capabilities

### Modified Capabilities

- `gap-ledger`: add "Count tolerance for adopted files" and "Total counts for adopted files".

## Impact

Change the ledger library, the gate and their tests. This change opens no gap and closes no gap.
The lead runs the image checks and the two review agents.

## Known limits and later changes

The tolerance is 8 counts or 4% of the metric total, the smaller of the two numbers.
Totals below 25 give tolerance 0.
This tolerance can hide a real coverage loss within those limits.
Count tolerance applies to a file with base content and to a file that equals its adopted source.
A file that the fork edits gets no count tolerance from this change.

A changed upstream test gives no count tolerance to a code file unless that code file equals its adopted source.
This limit applies to the requirement "Count tolerance for adopted files".

Rule 21 needs the person who merges to check the merged commit against the upstream remote and record the result in review.md.

The requirement "Total counts for adopted files" hides no not-covered count.
It accepts a difference in the total counts and the covered counts that follow.
The requirement "Total counts for adopted files" sets no bound on the size of a total difference.
The covered count of the ledger entry can differ from the covered count of the current gap by more than the tolerance.
The hand-edit check protects the ledger. The not-covered count stays exact for a file that differs from its adopted source.

A file that equals its adopted source can have a closed gap.
Its old ledger entry stays until the ratchet command runs, as for a file with base content.
A valid reached adopt line also supplies the total count exception.
A file with base content already gets this exception from "Count tolerance" when its coverage is true.
The code refuses the exception for untrue coverage.

The script for the CI artifact uses a copy of the gate predicates.
make gates CHANGE=vendored-coverage-tolerance in the Node image on the upstream-sync-3 tree must supply the project verdict.

For a file that equals its adopted source, neverWorseCounts writes smaller total counts when current not-covered counts do not exceed ledger entry counts.
The covered count can fall by up to the tolerance at each ratchet run.
See scripts/spec/lib/ledger.mjs:237-246 and src/tooling/spec/ledger.test.mjs:1643-1653.
toleranceCounts writes ledger entry counts for this case with base content.

The gate never records a tolerant ledger entry as stale for a smaller gap of any size.
See scripts/spec/lib/ledger.mjs:449 and src/tooling/spec/ledger.test.mjs:1508, which asserts 0 against 10 with tolerance 8.
A partial improvement leaves slack that can hide a later fall back to the old count.
