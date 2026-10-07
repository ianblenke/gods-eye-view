## Why

The scene director shot methods need spec and test links.
The change records old behavior without production code changes.

## What Changes

Add director scenarios for shot authoring, loads, travel, seek, camera ownership and scene queries.
Add local fake tests in `src/scenes/directorShots.test.mjs`.

## Capabilities

### Modified Capabilities

- `director`: Add shot method requirements.

## Impact

The change closes test and coverage gaps in the shot method area.
The lead measures image coverage and updates the ledger.
