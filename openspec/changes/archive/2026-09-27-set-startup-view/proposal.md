## Why

The owner starts the app to look at Taiwan. The current default flight ends in Austin.

## What Changes

- Add a Taiwan start pose and a default camera flight.
- Use that flight when no share state exists.
- Show `Flying to Taiwan...` for the default flight.
- Keep share state as the source of the view when it exists.

## Capabilities

### New Capabilities

- `startup-view`: The app starts at the Taiwan pose when no share state exists.

### Modified Capabilities

None.

## Impact

- Change `src/camera.js`, `src/app/controls.js`, and `docs/CURRENT-STATE.md`.
- Add `src/app/startView.test.mjs` and the four documents in this change folder.
- The ledger has open gaps for `src/camera.js` and `src/app/controls.js` at commit `ba9555a`.
- The new functions of `src/camera.js` are covered. Its gap stays at 21 lines and 2 functions not covered. Its totals are 144 lines, 12 branches and 8 functions.
- `controls.js` still has no test that imports it (ledger entry `loaded: false`). It has 50 lines not covered (51 before), because one call replaces the old `if` block.
- No test runs its one call of `startApplicationView`.
- The registry gets 5 new scenario IDs.
- The ratchet command also wrote two history lines for `src/data/labelArbiter.js`, which this change does not edit. Its count changes between runs. The lead put the entry and the history of that file back to the content of `main`. This is a text edit, with no measurement.

## Known limits

- `austin-start-kept`: The old Austin flight and its test stay for direct callers.
- `qa-label-readability.mjs`: Its comment waits for the Austin flight.
- `qa-sprites-b5.mjs`: Its comment cancels the Austin flight.
- `qa-cctv-v2.mjs`: Its comment waits for the Austin flight.
- `qa-enrich-ambient.mjs`: Its comment cancels the Austin flight.
- `qa-labels.mjs`: Its comment waits for the Austin flight.
- `qa-floor-verify.mjs`: Its comment says that it cancels the start flight before a view over Austin.
- `flight-timing-kept`: The 25000 m start height and 4 s flight come from the old flight.
- `no-browser-view`: No browser view of the result was run.
