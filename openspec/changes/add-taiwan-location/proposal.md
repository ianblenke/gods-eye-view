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
- `src/locations.js` has a gap in `openspec/trace/gaps.json`: 288 lines, 46 branches and 16 functions.
- This change adds data to that file. The tests can cover these new lines. The Docker gate must confirm the gap count.
- The host cannot run the Docker gates or ratchet. The ledger stays as it is for this work.

## Known limits

- `taiwan-camera-data`: The POI coordinates are approximate camera frames, not survey data.
- `taiwan-hud-point`: The HUD adds the island view to its nearest POI list. It can name that point as Taiwan.
- `taiwan-cctv`: The camera seed list has no Taiwan camera. The catalog can still resolve the new city name.
- `taiwan-default-view`: The owner must judge the island view as the pill default in a browser.
