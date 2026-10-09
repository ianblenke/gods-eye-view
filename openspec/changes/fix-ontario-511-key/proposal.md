## Why

Ontario 511 now needs a developer key. The camera pack returns no cameras without that key.
The owner approved this correction on 2026-10-08.

## What Changes

Add a server key. Send no Ontario request when the key is absent or blank.
Use warning text that never changes. Correct the Ontario documents.
Add backfill scenarios `live-sources-006` to `live-sources-009` for the current Ontario row rules.

## Capabilities

### Modified

- `live-sources`: Add the Ontario camera key requirement and the Ontario row rules requirement.

### New

None.

## Impact

Change the Ontario loader and add a request helper with fixture tests.
The request helper must have no coverage gap. No gap opens.
The change closes uncovered ranges of four functions of `server/providers/cctv/sources.js`: the loader and three helpers.

The ratchet records the new count.
The lead reports the ratchet on commit `60099724`: lines 411 to 314, branches 107 to 103, functions 7 to 3.
The lead repeats the ratchet after these corrections. This work changes no ledger file.

## Known limits and later changes

No worker saw a camera response with the key. The row fields come from the old code and the developer page.
The request helper writes one warning for absent keys and one for request errors per process. A later request error writes no warning.
The key travels in the query string. An HTTP 200 response with an error object gives no log line or warning.

The layer shows no status for an empty pack. No worker sent a GET request for a camera image with a key.
Setup doctor, Pinokio fields and key setup do not list `ONTARIO_511_API_KEY`.
The loader writes "Loaded Ontario 511 camera sources: 0 enabled (using nearest 0)" at each refresh without a key. No scenario covers that case.

The status lines of `scripts/dev-fresh.sh` do not show the Ontario key state.
The lead must run the Docker image checks and both reviews. The separate catalog cap issue stays outside this change.

`server/providers/cctv/ontarioRequest.js` has a reset hook for tests.
`src/renderGovernor.js` and `server/providers/places/routes.js` use the same style.

The hook has no scenario. The lead accepts it by name.
The request warning names the key for timeouts, HTTP 5xx and HTTP 429 errors. The old status log is gone.

The tests watch all console channels. They do not watch stderr from other code.
