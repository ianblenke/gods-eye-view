## Why

The location bar shows one pill for each preset city. The order of the pills is the order of the keys of `CITY_POIS` in `src/locations.js`.
The owner asked in chat on 2026-10-11 for a Tampa pill between the Taiwan pill and the Austin pill.
Before this change, the table had ten presets, and Austin was second. The requirement "Preset order" says that Taiwan is first and Austin is second, so this change must change that requirement.

## What Changes

- Add the preset `tampa` to `CITY_POIS`, between `taiwan` and `austin`. It has five places, view bounds and a ground elevation of 10 m.
- Change the requirement "Preset order" and its scenario `location-presets-001`. The order is Taiwan, Tampa, Austin.
- Add the requirements "Tampa preset data", "Tampa pill position" and "Tampa pill flight". Their scenarios are `location-presets-006`, `location-presets-007` and `location-presets-008`.
- Change the test of `location-presets-003`. The scenario text stays, but the test no longer says that Austin is the second pill.
- Write one entry in `CHANGELOG.md`.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `location-presets`: One changed requirement with one scenario, and three added requirements with one scenario each. The other requirements and scenarios do not change.

## Impact

Rule 23: the change adds no code file. It edits `src/locations.js`, which is upstream code and stays out of the manifest, and two test files that exist.
The 55 added lines of `src/locations.js` are data in the table, and they run when the module loads. The change opens no coverage gap.

Other code reads the table and now sees Tampa. The preset geocoder answers an exact search for `Tampa` and for each of the five place names. The HUD and the voice tool for nearby places list the five places. The function `normalizeLocationId()` accepts `tampa`, but the voice schema does not list it.

The voice function `findPoiByName()` and the preset geocoder match place names. The first place has the city in its name, so a request for a Bank of America Plaza in another city does not match it. See `evidence/name-collision.txt`.

The lead ran the 33 test files that import these modules: 789 tests pass.

## Known limits and later changes

- Known limit `camera-numbers`: The range, the pitch and the heading of the five places are not tuned on screen. The first place and the museum lie inside the range and pitch values of the San Francisco preset. The stadium, the airport and Ybor City have a steeper pitch than both presets. A later change can tune them.
- Known limit `places`: The lead took the coordinates of the five places from OpenStreetMap searches on 2026-10-11 and rounded them to four decimals. The first place is a downtown tower, and the pill flies to it. The list has no Sunshine Skyway Bridge, because the bridge is south of the view bounds. See `evidence/places.txt`.
- Known limit `ground-elevation`: The value of 10 m is an estimate, like the values of the other presets. The terrain height outranks it when the terrain is loaded.
- Known limit `search`: An exact search for `Tampa` goes to the bundled preset and no longer goes to the online geocoder. A query such as `Tampa, FL` still goes to the online geocoders, because the preset geocoder matches exact names only.
- Known limit `name-match`: The voice function `findPoiByName()` matches a query that holds all words of a place name. A query for another place that holds the words `ybor` and `city` still flies to the fifth place. The other presets have the same rule.
- Known limit `voice-schema`: The lists of location ids in `src/voice/actionSchemas.js` do not name `tampa`, like they do not name `taiwan` or `tallinn`. A spoken request for Tampa uses the field `query`. A later change can add the id.
- Known limit `scripts-as-text`: The files `mutations-script.txt` and `name-collision.txt` hold scripts as text. No gate measures them.
- Known limit `pill-width`: The location bar has eleven pills now. The bar scrolls sideways (`overflow-x: auto` in `src/ui/styles/location.css`). The lead did not look at its width on screen.
- Known limit `upstream-line`: Upstream can add a preset in the same place of the table. The test files `src/locations.test.mjs` and `src/ui/locationControls.test.mjs` are upstream files with fork tests. A later sync can conflict in these places. Keep both sides then.
