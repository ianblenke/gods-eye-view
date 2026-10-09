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
- Do not change the tolerance or the coverage error rules.

## Capabilities

### Modified Capabilities

- `gap-ledger`: add "Count tolerance for adopted files" and "Total counts for adopted files".

## Impact

Change the ledger library, the gate and their tests. This change opens no gap and closes no gap.
The lead runs the image checks and the two review agents.

## Known limits and later changes

The tolerance is 8 counts or 4% of the metric total, the smaller of the two numbers.
Totals below 25 give tolerance 0.
This tolerance can hide a real coverage loss within the tolerance.
Count tolerance applies to a file with base content and to a file that equals its adopted source.
A file that the fork edits gets no count tolerance from this change.

The gate gives no count tolerance to a code file that a changed upstream test covers, unless that code file equals its adopted source.
This limit applies to the requirement "Count tolerance for adopted files".

Rule 21 needs the person who merges to check the merged commit against the upstream remote and record the result in review.md.

The requirement "Total counts for adopted files" hides no not-covered count.
It accepts a difference in the total counts and the covered counts that follow.
The requirement "Total counts for adopted files" sets no limit on the size of a total difference.
The covered count of the ledger entry can differ from the covered count of the current gap by more than the tolerance.
The hand-edit check protects the ledger. The not-covered count stays exact for a file that differs from its adopted source.

A file that equals its adopted source can have a closed gap.
Its old ledger entry stays until the ratchet command runs, as for a file with base content.
A valid reached adopt line also supplies the total count exception.
A file with base content already gets this exception from "Count tolerance" when its coverage is true.
The gate refuses the exception for untrue coverage.

The script for the CI artifact uses a copy of the gate predicates.
The command `make gates CHANGE=vendored-coverage-tolerance` in the Node image on the upstream-sync-3 tree must supply the project verdict.

For a file that equals its adopted source and has no base content, neverWorseCounts selects the current total count.
This applies when the current not-covered count is smaller than or equal to the ledger entry not-covered count.
The current total count can be larger or smaller than the ledger entry total count.
A smaller total count with an equal not-covered count lowers the covered count by any amount.
For branches and functions, the gate limits the covered count fall to the tolerance when the not-covered count falls.
See scripts/spec/lib/ledger.mjs:237-246 and src/tooling/spec/ledger.test.mjs:1643-1653.

For a file with base content, toleranceCounts selects ledger entry branch and function counts when the current covered count is smaller.
The comparison is with the ledger entry covered count.
For lines, toleranceCounts selects the smaller not-covered count and the current total count.

The gate never records the ledger entry of a tolerant file as stale for a smaller gap of any size.
See scripts/spec/lib/ledger.mjs:454 for the closed-gap path and :639-640 for an open smaller gap.
The test at src/tooling/spec/ledger.test.mjs:1508 asserts 0 against 10 with tolerance 8.
A partial improvement leaves a difference between the ledger entry count and the current count.
The tolerance can then hide a rise of the not-covered count up to the ledger entry count.

Pass 4 wrote the test of gap-ledger-156 after the guard code.
Origin spec-first, order deviation named; the lead accepts it by name in review.md.
The mutation run showed the `||` mutant alive; the test kills it in pass4/zero-red.log.

The gate fixtures cover an absent file at the base commit.
They do not cover a file whose current content differs from its content at the base commit for this condition.
