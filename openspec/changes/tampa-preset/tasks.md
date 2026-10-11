## 1. Write the tests

- [x] 1.1 Change the test of `location-presets-001` in `src/locations.test.mjs`.
- [x] 1.2 Write the test for `location-presets-006` in the same file.
- [x] 1.3 Keep the test for `location-presets-002` and `location-presets-004`.
- [x] 1.4 Change the test of `location-presets-003` in `src/ui/locationControls.test.mjs`.
- [x] 1.5 Write the test for `location-presets-007` in the same file.
- [x] 1.6 Write the test for `location-presets-008` in the same file.

## 2. Write the code and the documents

- [x] 2.1 Add the preset `tampa` to `CITY_POIS` in `src/locations.js`.
- [x] 2.2 Write one entry in `CHANGELOG.md`.

## 3. Check on the host

- [x] 3.1 Run the three test files `src/locations.test.mjs`, `src/ui/locationControls.test.mjs` and `src/cityPresets.test.mjs`.
- [x] 3.2 Run the 33 test files that import the table or its consumers.
- [x] 3.3 Run the named faults of the order and of the data.
- [x] 3.4 Write `evidence/mutations.txt` with the result of each fault.
- [x] 3.5 Run the four checks of `make precheck` on the host.
- [x] 3.6 Run the STE lint on the host.
- [x] 3.7 Run `openspec validate tampa-preset` on the host.
- [x] 3.8 Write `evidence/places.txt` with the OpenStreetMap searches for the five places.
- [ ] 3.9 Write `evidence/name-collision.txt` with the result of both name matchers.
- [ ] 3.10 Write `evidence/red-green.txt` with a test run on the base code and on the new code.

## 4. Lead work in the image

- [ ] 4.1 Run `make ratchet CHANGE=tampa-preset`.
- [ ] 4.2 Run the two review agents.
- [ ] 4.3 Write review.md.
- [ ] 4.4 Run `make gates CHANGE=tampa-preset` on the final tree.
