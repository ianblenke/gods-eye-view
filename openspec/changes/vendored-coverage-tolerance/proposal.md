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
- Do not change the size of the tolerance or the comparison in compareCoverageEntry.

## Capabilities

### Modified Capabilities

- `gap-ledger`: add "Count tolerance for adopted files" and "Total counts for adopted files".

## Impact

Change the ledger library, the gate and their tests. This change opens no gap and closes no gap.
The lead runs the image checks and the two review agents.

## Known limits and later changes

The tolerance is 8 counts or 4% of the metric total, the smaller of the two numbers.
Totals below 25 give tolerance 0.
A real coverage loss of at most the tolerance can stay hidden.
Count tolerance applies to a file with base content and to a file that equals its adopted source.
A file that the fork edits gets no count tolerance from this change.

The gate gives no count tolerance to a code file without base content unless the code file equals its adopted source.
This also applies when a changed upstream test covers the code file.
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

For a file that equals its adopted source and has no base content, neverWorseCounts selects the current gap total count.
For each metric, this applies when its current not-covered count is smaller than or equal to its ledger entry not-covered count.
For that metric, the current gap total count can be larger or smaller than the ledger entry total count of that metric.
The covered count can fall by any amount.
For each metric, this applies when its not-covered counts are equal and its current gap total count is smaller than its ledger entry total count.
For branches and functions, when the not-covered count falls, the covered count can fall by at most the tolerance per ratchet run.

The ratchet command can write a total count that is smaller than the ledger entry total count.
The gate then uses the new total count as the ledger entry total count.
See scripts/spec/lib/ledger.mjs:237-246 and src/tooling/spec/ledger.test.mjs:1643-1653.

For a file with base content, toleranceCounts selects ledger entry branch and function counts.
This applies when the current covered count is smaller than the ledger entry covered count.
For lines, toleranceCounts selects the smaller of the current and ledger entry not-covered counts, and the current gap total count.

The gate never records the ledger entry of a tolerant file as stale for a smaller gap of any size.
See scripts/spec/lib/ledger.mjs:454 for the closed-gap path and :436 and :449 for an open smaller gap.
The test at src/tooling/spec/ledger.test.mjs:1508 asserts 0 against 10 with tolerance 8.
A partial improvement of a metric leaves a difference between the ledger entry not-covered count and the current not-covered count of that metric.
For lines, the not-covered count can then rise to the ledger entry not-covered count plus the tolerance with no error.
For branches and functions, the gate reports LEDGER-LOST-COVERAGE only when the covered count falls below the ledger entry covered count by more than the tolerance.

Pass 4 wrote the test of gap-ledger-156 after the guard code.
This order differs from spec-first. The lead decides in review.md whether to accept it by name.
The test fails when the code has the `||` mutation; proof-pass7.json records that run for mutation gap-ledger-156.

For a file with no base content, the gate fixtures cover only a file absent at the base commit.
They do not cover a file whose current content differs from its content at the base commit.

The title of the test for gap-ledger-143 and gap-ledger-154 uses the words not above in place of smaller than or equal to.
The words not above keep the title inside the limit of 25 words.
The lead accepts these words by name.

The title of the test for gap-ledger-156 does not name the adopted-source conditions.
This keeps the title inside the limit of 25 words.
The lead accepts this title by name.
Two titles of tests for gap-ledger-154 (ledger.test.mjs lines 1620 and 1688) do not name the file scope.
This keeps these titles inside the limit of 25 words.
The lead accepts these titles by name.
