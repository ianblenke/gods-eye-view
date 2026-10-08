## Why

V8 can merge adjacent branch ranges with equal counts. Timers can change those counts across machines.
An upstream sync can then fail with LEDGER-STALE for files that the fork does not edit.
A file that the fork edits can also have different total counts and equal not-covered counts.

## What Changes

- Extend count tolerance to a file that equals its adopted source.
- Use the same adopted source rule for the ci, check and ratchet commands.
- Accept total count differences for a file with a valid adopt line, equal hashes and equal not-covered counts.
- Apply never-worse counts to a file that equals its adopted source without base content.
- Keep toleranceCounts for a file with base content.
- Keep the count tolerance limits and all coverage error rules.

## Capabilities

### Modified Capabilities

- `gap-ledger`: add "Count tolerance for adopted files" and "Total counts for adopted files".

## Impact

Change the ledger library, the gate and their tests. This change opens no gap and closes no gap.
The lead runs the image checks and the two review agents.

## Known limits and later changes

The count tolerance is 8 counts or 4% of the metric total, the smaller of the two numbers.
Totals below 25 give no count tolerance.
This tolerance can hide a real coverage loss within those limits.
Count tolerance applies to a file with base content and to a file that equals its adopted source.
A file that the fork edits gets no count tolerance from this change.
A changed upstream test gives no tolerance from this requirement to a code file unless that code file equals its adopted source.

Rule 21 needs the person who merges to check the merged commit against the upstream remote and record the result in review.md.

The requirement "Total counts for adopted files" hides no not-covered count.
It accepts a difference in the total counts and the covered counts that follow.
Pass 2 sets no bound on the size of a total difference. The covered baseline can lag.
The hand-edit check protects the ledger. The not-covered count stays exact for a file that differs from its adopted source.

A file that equals its adopted source can have a closed gap.
Its old ledger entry stays until the ratchet command runs, as for a file with base content.
A valid reached adopt line also supplies the total count exception. This has no effect for a file with base content.
For true coverage, the base content tolerance already accepts that total count difference.
The total-only guards exclude untrue coverage.

The script for the CI artifact uses a copy of the gate predicates.
The full gate command in the Node image on the upstream-sync-3 tree must supply the project verdict.
