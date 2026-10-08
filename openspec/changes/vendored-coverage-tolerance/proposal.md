## Why

V8 can merge adjacent branch ranges with equal counts. Background work can change those counts across machines.
A sync can then fail with LEDGER-STALE for upstream files that the fork does not edit.

## What Changes

- Extend count tolerance to files that equal a valid adopted upstream source.
- Use the same rule for ci, check and the ratchet command.
- Keep the count limits and the ratchet count rule.

## Capabilities

### Modified Capabilities

- `gap-ledger`: add Count tolerance for adopted files.

## Impact

Change the ledger library, the gate and their tests. This change opens no gap and closes no gap.
The lead runs the image checks and the two review agents.

## Known limits

The tolerance can hide a real coverage loss of up to 4-8% of a vendored file.
The rule applies only to files that equal the adopted upstream commit.
A changed upstream test gives no new tolerance to its production file unless that file itself equals a valid adopted source.
Rule 21 still needs the owner to check the upstream remote and the merge second parent.

The real CI replay leaves src/keySetupCore.mjs exact. The fork adds an OSH account block that the adopted source lacks.
This rule cannot clear that stale entry. The owner must select a separate rule or a code change for that fork edit.
