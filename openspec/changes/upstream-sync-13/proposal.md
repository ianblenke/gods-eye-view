## Why

The owner asked on 2026-11-26 to run the thirteenth upstream sync.
The twelfth sync merged upstream up to `fca2c81d8`. Upstream has 191 commits after that point. They change 487 files, up to the commit `7646568a9`.

## What Changes

- Merge the upstream commit `7646568a9` into the fork in one merge commit.
- Resolve the conflicts by hand. A trial merge shows 12 conflicts.
- Accept the upstream removal of eleven files. Three of them are QA scripts that have a fork edit.
- Run the adopt command for each upstream file that the merge brings and that has a coverage gap.
- Write again or retire each scenario that the merge breaks. A later task lists them.

## Capabilities

### New Capabilities

None yet. A later task adds a backfill capability if an upstream file needs it.

### Modified Capabilities

None yet. The design document lists each modified capability after the merge.

## Impact

Rule 23: this plan adds no code file that the fork writes.

The change adds no layer, no route and no QA script of the fork.

## Known limits and later changes

- Known limit `later-upstream`: Upstream has more commits after `7646568a9` at a later time. The next sync merges them.
