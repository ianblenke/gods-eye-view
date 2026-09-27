## Context

At commit `ba9555a`, `src/app/controls.js` calls the Austin flight when no share state exists.
The share link parser uses the URL hash. A valid latitude and longitude set share state.

## Goals

- Set the default camera pose to longitude 120.6485, latitude 24.18, and height 217 m.
- Use heading 0, pitch -35 degrees, and roll 0 for the final view.
- Give the share view priority over the default flight.

## Non-goals

- Change the share link parser or the old Austin function.
- Edit or run browser QA scripts.

## Decisions

### Keep the old flight form

`flyToStartView()` sets a high view, waits 500 ms, and starts a 4 s flight. This keeps the old camera motion.

### Use zero roll

The owner gave roll 360 degrees. That angle is the same as zero degrees. The constant and camera call use zero.

### Set the start view

`startApplicationView()` in `src/camera.js` selects the start flight from `hasShareState`.
It sets the loader text and gives the flight stop function to `defer` when no share state exists.
`src/app/controls.js` calls this function with the viewer, share state, loader, and `defer`.
`src/app/startView.test.mjs` calls this function with a fake viewer, loader, and `defer`.

Host Node cannot import the full controls module because the installed `mgrs` module lacks a named export.
`controls.js` still has no test that imports it (ledger entry `loaded: false`).
No test runs its one call of `startApplicationView`.
No old test needs an edit. `src/app/startupCamera.test.mjs` stays as it is.

### Check each result

The tests compare camera values with literals from the spec. A fake camera records each call from the new function.
The start view test records the call to the camera, the loader text, and the stop function.

## Gate checks

- The trace gate checks five IDs and the assert calls in `src/app/startView.test.mjs`.
- The coverage gate checks `src/camera.js`. The old `src/app/controls.js` gap stays. No test imports it.
- The STE lint checks this change and its tagged test names.
- The host tests and mutation log check each scenario. The host uses Node 26; the full gate uses Node 24.

## Related browser QA scripts

- `qa-label-readability.mjs`: Waits for the Austin flight to start and end.
- `qa-sprites-b5.mjs`: Cancels the Austin flight before a test view.
- `qa-cctv-v2.mjs`: Waits for the Austin flight and first tiles.
- `qa-enrich-ambient.mjs`: Cancels the Austin flight before a test view.
- `qa-labels.mjs`: Waits for the Austin flight, then cancels it.
- `qa-floor-verify.mjs`: Cancels the start flight before a view over Austin airport.
