## Why

The location bar shows one pill for each preset city. The order of the pills is the order of the keys of `CITY_POIS` in `src/locations.js`.
The owner asked in chat on 2026-10-11 for a Tampa pill between the Taiwan pill and the Austin pill.
The table has nine presets now, and Austin is second. The requirement "Preset order" says that Taiwan is first and Austin is second, so this change must change that requirement.

## What Changes

- Add the preset `tampa` to `CITY_POIS`, between `taiwan` and `austin`. It has five places, a view box and a ground elevation of 10 m.
- Change the requirement "Preset order" and its scenario `location-presets-001`. The order is Taiwan, Tampa, Austin.
- Add the requirements "Tampa preset data", "Tampa pill position" and "Tampa pill flight". Their scenarios are `location-presets-006`, `location-presets-007` and `location-presets-008`.
- Change the test of `location-presets-003`. Its text stays, but it no longer says that Austin is the second pill.
- Write one entry in `CHANGELOG.md`.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `location-presets`: One changed requirement with one scenario, and three added requirements with one scenario each. The other requirements and scenarios do not change.

## Impact

Rule 23: the change adds no code file. It edits `src/locations.js`, which is upstream code and stays out of the manifest, and two test files that exist.
The 55 added lines of `src/locations.js` are data in the table, and they run when the module loads. The change opens no coverage gap.

Other code reads the table and now sees Tampa. The preset geocoder answers an exact search for `Tampa` and for each of the five place names. The HUD and the voice tool for nearby places list the five places. The voice tool accepts `tampa` as a location id.
The lead ran the 33 test files that import these modules: 760 tests pass.

## Known limits and later changes

- Known limit `camera-numbers`: The range, the pitch and the heading of the five places are not tuned on screen. The lead set them from the Austin and San Francisco presets. A later change can tune them.
- Known limit `places`: The lead took the coordinates of the five places from OpenStreetMap searches on 2026-10-11 and rounded them to four decimals. The first place is a downtown tower, so the pill shows the skyline. The list has no Sunshine Skyway Bridge, because the bridge is south of the view box. See `evidence/places.txt`.
- Known limit `ground-elevation`: The value of 10 m is an estimate, like the values of the other presets. The terrain height outranks it when the terrain is loaded.
- Known limit `search`: An exact search for `Tampa` goes to the bundled preset and no longer goes to the online geocoder. A query such as `Tampa, FL` still goes to the online geocoders, because the preset geocoder matches exact names only.
- Known limit `voice-schema`: The lists of location ids in `src/voice/actionSchemas.js` do not name `tampa`, like they do not name `taiwan` or `tallinn`. A spoken request for Tampa uses the field `query`. A later change can add the id.
- Known limit `upstream-line`: Upstream can add a preset in the same place of the table. A later sync can conflict there. Keep both presets then.
