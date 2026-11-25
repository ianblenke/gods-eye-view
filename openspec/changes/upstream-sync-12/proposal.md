## Why

The owner asked on 2026-11-23 to run the twelfth upstream sync.
The eleventh sync merged upstream up to `7f2dc81cf`. Upstream has 265 commits after that point. They change 358 files, up to the commit `fca2c81d8`. The pull requests run from #1152 to #1917.

## What Changes

- Merge the upstream commit `fca2c81d8` into the fork in one merge commit.
- Resolve the conflicts by hand. A trial merge shows 13 conflicts. The files include `.env.example`, `DATA_SOURCES.md`, two gate configuration files and the list `same-as-english.json`. They also include test files of the cyclones, perimeters, recent imagery and director code. `design.md` gives the resolutions.
- Keep the fork share tokens. The merge adds no layer.
- Run the adopt command for each upstream file that the merge brings and that has a coverage gap.
- Write again each scenario and test that the merge breaks. The section Impact lists them. The change retires no scenario.
- Add the backfill scenarios `director-111` and `context-contacts-entry-001`.

## Capabilities

### New Capabilities

- `context-contacts-entry`: a Contacts request keeps the tracked aircraft.

### Modified Capabilities

- `live-sources`: the scenario `live-sources-007` names the new license text of the Ontario cameras.
- `director`: the new scenario `director-111` covers a run that resumes inside a flight.
- `perimeters`: the source returns fires and pieces. The scenario `perimeters-001` says so.

## Impact

Rule 25: the merge breaks tests with a scenario ID for upstream code. The change writes again the scenarios `live-sources-007` and `perimeters-001`. It writes again the tests of `cyclones-001`, `perimeters-001`, `perimeters-005`, `perimeters-006`, `recent-imagery-023` and `recent-imagery-027`.

Rule 23: the change adds one test file that the fork writes: `src/ui/contextActions.forkBackfill.test.mjs`. The change adds it to `openspec/ownership.json`.

The change adds no layer, no route and no QA script of the fork.

## Known limits and later changes

- Known limit `leak-record`: The record `openspec/trace/upstream-test-findings.json` gets 7 more upstream test files with a live timer. The record has no end date.
- Known limit `later-upstream`: Upstream has more commits after `fca2c81d8`. The next sync merges them.
- Known limit `resume-timing`: The test of `director-111` uses real timers. Upstream removed its test of this behavior because of its timing. A slow machine can make the test fail.
- Known limit `contacts-tab`: Upstream removed the start of the Contacts mode from the phone Context tab. The fork takes this change.
