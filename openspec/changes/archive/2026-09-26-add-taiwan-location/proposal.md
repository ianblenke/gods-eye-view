## Why

The owner types Taiwan in the location search each time. A Taiwan pill gives direct access to that place.

## What Changes

- Add Taiwan as the first location preset, before Austin.
- Add one island view and four places to the Taiwan preset.
- Add tests for the data, pill order, flight and search.

## Capabilities

### New Capabilities

- `location-presets`: The app gives a direct Taiwan preset in the command dock.

### Modified Capabilities

None.

## Impact

- Change `src/locations.js` and add tests in `src/locations.test.mjs`, `src/ui/locationControls.test.mjs` and `src/search/offlineGeocoders.test.mjs`.
- Add this change folder. The format tool can change these files.
- `src/locations.js` has a gap in `openspec/trace/gaps.json`: 288 lines, 46 branches and 16 functions before this change.
- This change adds 55 lines of data to that file, and the tests cover them. The ratchet command writes 45 branches not covered (46 before). The count of 288 lines and 16 functions does not change.
- The ratchet command also writes the new totals of `src/locations.js` (1552 lines and 139 branches). It writes new totals for `src/ui/locationControls.js` too (36 branches, 34 before). This change does not edit that file, and only the counts of the branch records change.
- The registry gets 5 new scenario IDs.

## Known limits

- `taiwan-camera-data`: The POI coordinates are approximate camera frames, not survey data.
- `taiwan-hud-point`: The HUD adds the island view to its nearest POI list. It can name that point as Taiwan.
- `taiwan-cctv`: The camera seed list has no Taiwan camera. The catalog can still resolve the new city name.
- `taiwan-default-view`: The owner must judge the island view as the pill default in a browser.
