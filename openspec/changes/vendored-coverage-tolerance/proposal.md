## Why

V8 can merge adjacent branch ranges with equal counts. Background work can change those counts across machines.
A sync can then fail with LEDGER-STALE for upstream files that the fork does not edit.
Fork edits can also have different total counts with equal not-covered counts.

## What Changes

- Extend count tolerance to files that equal a valid adopted upstream source.
- Use the same rule for ci, check and the ratchet command.
- Accept total count differences for valid adopted files with equal hashes and not-covered counts.
- Keep the count limits and the ratchet count rule.

## Capabilities

### Modified Capabilities

- `gap-ledger`: add Count tolerance for adopted files.

## Impact

Change the ledger library, the gate and their tests. This change opens no gap and closes no gap.
The lead runs the image checks and the two review agents.

## Known limits and later changes

The count tolerance is 8 counts or 4% of the metric total, whichever is less.
Totals below 25 give no count tolerance.
This tolerance can hide a real coverage loss within those limits.
Count tolerance applies only to files that equal the adopted upstream commit.
A changed upstream test gives no new tolerance to its production file unless that file itself equals a valid adopted source.
Rule 21 still needs the owner to check the upstream remote and the merge second parent.

The second rule accepts only total count differences for valid adopted files with equal ledger hashes and not-covered counts.
This rule hides no coverage count. Fork edits keep exact not-covered counts and coverage errors.
