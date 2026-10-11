## Context

Base commit: `09255a9f` (main, after the merge of `cyclones-early-advisory`).
The table `CITY_POIS` in `src/locations.js` holds the presets. `LOCATIONS` and the pills of the location bar follow the order of its keys.

The test file `src/cityPresets.test.mjs` already checks every preset as data. It checks the keys, the finite numbers, the camera angles and the view bounds. It also checks that each place is inside the view bounds. It checks Tampa with no change.

## Decisions

### D1: The data of the Tampa preset

The first place is "Bank of America Plaza, Tampa", a tower in downtown Tampa. The OpenStreetMap height tag of the tower is 178.87 m. The other four places are Raymond James Stadium, Tampa International Airport, Henry B. Plant Museum and Ybor City.
The lead took the latitude and the longitude of each place from a search in OpenStreetMap on 2026-10-11 and rounded them to four decimals. The file `evidence/places.txt` holds the results.

The view bounds run from 27.8 N, 82.65 W to 28.1 N, 82.3 W. They hold the five places and the downtown of Tampa. The ground elevation of 10 m follows the other presets, which use approximate values in meters.

The name of the first place holds the city, because two functions match place names. The voice function `findPoiByName()` matches a query that holds all words of a name, and the preset geocoder matches an exact name. With the plain name `Bank of America Plaza`, the voice function matches a request for the same name in another city. The file `evidence/name-collision.txt` shows this.

The Austin preset has ranges of 500 to 550 m and pitches of -28 to -18 degrees. The San Francisco preset has ranges of 420 to 1400 m and pitches of -30 to -20 degrees.
The first place (650 m, -22 degrees) and the museum (450 m, -28 degrees) lie inside the values of the San Francisco preset. The stadium, the airport and Ybor City have a steeper pitch than both presets, and the airport and Ybor City also have a larger range.

### D2: The order

The pill order is the key order of the table, so the entry goes between `taiwan` and `austin`. The change adds no sort field.

### D3: The shape of the spec change

Only the requirement "Preset order" becomes false, so it is the only changed requirement. It has one scenario, `location-presets-001`.
The three new requirements are added, and they do not change a requirement that exists. The scenario `location-presets-003` keeps its text. Its test no longer reads the second pill as Austin and compares the positions of the Taiwan pill and the Austin pill.

### D4: The tests

The test of `location-presets-001` checks the first three keys. The test of `location-presets-006` compares the whole Tampa preset with literal values, like the test of `location-presets-002` does for Taiwan.
The test of `location-presets-007` compares the positions of the Taiwan, Tampa and Austin pills and the text of the Tampa pill. The test of `location-presets-008` clicks the Tampa pill and reads the flight.

## Files and measures

The change edits `src/locations.js`, `src/locations.test.mjs`, `src/ui/locationControls.test.mjs` and `CHANGELOG.md`. It adds the spec delta and the evidence.

The trace gate checks that the tests carry the IDs `location-presets-001`, `-003`, `-006`, `-007` and `-008`. The format check measures the edited files. The prose lint checks STE.
The named faults measure whether a change of the Tampa data or of the order makes a test fail.
The lead runs the gates in Docker and both review agents on the final tree.
