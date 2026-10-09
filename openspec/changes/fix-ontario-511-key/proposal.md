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
The change closes uncovered ranges of four functions of `server/providers/cctv/sources.js`: the loader and three other functions.

The ratchet records the new count.
The lead reports the ratchet on commit `60099724`: lines 411 to 314, branches 107 to 103, functions 7 to 3.
The lead repeats the ratchet after these corrections. This work changes no ledger file.

## Known limits and later changes

No worker saw a camera response with the key. The row fields come from the old code and the developer page.
For each process, the request helper writes one warning for an absent or blank key and one warning for request errors. A later request error writes no warning.
The key travels in the query string. An HTTP 200 response with an error object gives no log line or warning.

The layer shows no status for an empty pack. No worker sent a GET request for a camera image with a key.
Setup doctor, Pinokio fields and key setup do not list `ONTARIO_511_API_KEY`.
The loader writes "Loaded Ontario 511 camera sources: 0 enabled (using nearest 0)" at each refresh without a key and after a request error. No scenario covers those cases.

The status lines of `scripts/dev-fresh.sh` do not show the Ontario key state.
The lead must run the Docker image checks and both reviews. The separate catalog cap issue stays outside this change.

`server/providers/cctv/ontarioRequest.js` has a reset hook for tests.
`src/renderGovernor.js` and `server/providers/places/routes.js` use the same style.

The hook has no scenario. The lead accepts it by name.
The request warning tells the user to check ONTARIO_511_API_KEY.
The warning has the same text for a timeout, an HTTP 5xx error and an HTTP 429 error. The key does not cause these errors.
The code no longer writes the HTTP status in a log line.

The tests watch the six console channels. They do not watch text that code writes directly to process.stdout and process.stderr.

The probe shows that `console.table`, `console.group` labels, `console.count`, `console.timeLog` and `console.timeEnd` call `console.log`.
`console.trace` calls `console.error`. A failed `console.assert` calls `console.warn`.
On both Node versions, `console.dirxml` writes directly to stdout, so the tests do not watch it.

`console.groupEnd`, a valid `console.countReset` and `console.time` write no text in the probe.
These routes come from Node v26.8.2 and from Node v24.21.0 in the Docker image. The routes are the same.

The scenario 008 test cannot detect a seventh anchor far from all rows.
It cannot detect a move of the Windsor anchor by less than about 3 kilometers. The Windsor row is the last of the six anchor rows.

The lead accepts the word image in the Pass 3 and Pass 3B records by name.
Those records use image for the Docker image.
