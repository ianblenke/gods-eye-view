## Why

The owner asked on 2026-11-23 to run the twelfth upstream sync.
The eleventh sync merged upstream up to `7f2dc81cf`. Upstream has 265 commits after that point. They change 358 files, up to the commit `fca2c81d8`. The pull requests run from #1152 to #1917.

## What Changes

- Merge the upstream commit `fca2c81d8` into the fork in one merge commit.
- Resolve the conflicts by hand. A trial merge shows 13 conflicts. The files include `.env.example`, `DATA_SOURCES.md`, two gate configuration files and the English locale list. They also include seven test files of the cyclones, perimeters, recent imagery and director code.
- Keep the fork share tokens, and give each new upstream layer a free token.
- Run the adopt command for each upstream file that the merge brings and that has a coverage gap.
- Retire or write again each scenario that the merge breaks. The design document will list them.

## Capabilities

### New Capabilities

None yet. A later task adds a backfill capability if an upstream file needs it.

### Modified Capabilities

- `live-sources`: the scenario `live-sources-007` names the new license text of the Ontario cameras.
- `perimeters`: the source returns fires and pieces. The scenario `perimeters-001` says so.

## Impact

Rule 25: the merge breaks tests with a scenario ID for upstream code. The change writes again the scenarios `live-sources-007` and `perimeters-001`. It writes again the tests of `cyclones-001`, `perimeters-001`, `perimeters-005`, `perimeters-006`, `recent-imagery-023` and `recent-imagery-027`.

Rule 23: this plan adds no code file that the fork writes. It will add a line to the manifest for a new file of the fork, if the merge needs one.

The change adds no layer, no route and no QA script of the fork.

## Known limits and later changes

None yet. Each limit is added after the merge and the gates.
