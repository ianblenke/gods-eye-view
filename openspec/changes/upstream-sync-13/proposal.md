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

- `startup-view`: upstream adds an opening animation. The animation now ends at the Taiwan pose. The change adds `startup-view-006` and `startup-view-007`, and writes again `startup-view-001`.
- `location-presets`: the change retires `location-presets-003` and `location-presets-007`. It writes again the requirement text of `location-presets-004` and `location-presets-008`.

## Impact

Rule 23: this plan adds no code file that the fork writes.

Rule 25: upstream deleted the location bar. The owner chose on 2026-11-26 to follow upstream. The two pill scenarios are retired. One upstream test, `mountApplicationViews.test.mjs`, gets a camera double with a `flyTo` function, because the fork starts with a timed flight.

The change adds no layer, no route and no QA script of the fork.

## Known limits and later changes

- Known limit `leak-record`: The record `openspec/trace/upstream-test-findings.json` gets 6 more upstream test files with a live timer. The record has no end date.
- Known limit `qa-coverage`: The gate does not measure the child process of `qaAircraftViewSheetOutput.test.mjs`.
- Known limit `later-upstream`: Upstream has more commits after `7646568a9` at a later time. The next sync merges them.
