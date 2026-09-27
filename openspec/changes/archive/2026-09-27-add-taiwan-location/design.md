## Context

`CITY_POIS` supplies the location pills, preset flights, search, voice names and nearby HUD points. This change starts from commit `ba9555ad1715810e5425ff7d1b9eb78ed2a499af`.

## Goals

- Put Taiwan to the left of Austin in the command dock.
- Give the pill an island view and four local places.
- Keep Taiwan search results inside the preset view bounds.

## Non-goals

- Add cameras, new geocoder logic or new voice logic.
- Change the camera data of other presets.

## Decisions

### First POI

`flyToPresetLocation` uses the first POI in default mode. The island view is first so the pill opens the full Taiwan area.

### Preset order

`LocationControls` reads `Object.entries(cities)` in key order. Taiwan is the first key of `CITY_POIS`, so its pill is first.

### Old tests

No old test name or assertion needs a change. The new preset meets the shared data checks in `src/cityPresets.test.mjs`.

### Gate checks

The trace gate maps each scenario ID to a test with an assert method. The coverage gate checks `src/locations.js` and the other code files.
The STE lint checks this prose and each new test name. The host tests check the data, fake DOM, fake viewer and preset geocoder.

## Files

- Change `src/locations.js` to add the Taiwan data.
- Add tests to `src/locations.test.mjs`, `src/ui/locationControls.test.mjs` and `src/search/offlineGeocoders.test.mjs`.
- Add the proposal, design, tasks and spec in this change folder.

## Related browser QA scripts

The gate reports that no QA script covers this change. No new QA script is part of this change.
