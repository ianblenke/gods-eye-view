## Why

Ontario 511 now needs a developer key. The camera pack returns no cameras without that key.
The owner approved this fix on 2026-10-08.

## What Changes

Add an optional server key. Stop the Ontario request when the key is absent.
Use fixed warning text. Correct the Ontario documents.
Add backfill scenarios `live-sources-006` to `live-sources-009` for the existing Ontario row rules.

## Capabilities

### Modified

- `live-sources`: Add the Ontario credential requirement.

### New

None.

## Impact

Change the Ontario loader and add a server request helper with fixture tests.
The new helper must have no coverage gap. The host report records the source file coverage.
No ledger file changes in this host task.

## Known limits and later changes

The lead must run the image checks and both reviews.
The separate catalog cap issue stays outside this change.
