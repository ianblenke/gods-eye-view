## Why

The owner asked on 2026-11-23 to run the twelfth upstream sync.
The eleventh sync merged upstream up to `7f2dc81cf`. Upstream has 265 commits after that point. They change 358 files, up to the commit `fca2c81d8`. The pull requests run from #1152 to #1917.

## What Changes

- Merge the upstream commit `fca2c81d8` into the fork in one merge commit.
- Resolve the conflicts by hand. A trial merge shows 13 conflicts. The files are `.env.example`, `DATA_SOURCES.md`, two gate configuration files, the English locale list and seven test files of the cyclones, perimeters, recent imagery and director code.
- Keep the fork share tokens, and give each new upstream layer a free token.
- Run the adopt command for each upstream file that the merge brings and that has a coverage gap.
- Retire or write again each scenario that the merge breaks. The design document will list them.

## Capabilities

### New Capabilities

None yet. A later task adds a backfill capability if an upstream file needs it.

### Modified Capabilities

None yet. The design document lists each modified capability after the merge.

## Impact

Rule 23: this plan adds no code file that the fork writes. It will add a line to the manifest for a new file of the fork, if the merge needs one.

The change adds no layer, no route and no QA script of the fork.

## Known limits and later changes

None yet. Each limit is added after the merge and the gates.
