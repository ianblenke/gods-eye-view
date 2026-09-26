## 1. Spec and tests

- [x] 1.1 Write the spec, proposal and design for the Taiwan preset.
- [x] 1.2 Write the key order test for `location-presets-001`.
  - Mutation: Move the Taiwan key after Austin. The test must fail.
- [x] 1.3 Write the data test for `location-presets-002`.
  - Mutation: Move a POI outside the bounds. The test must fail.
- [x] 1.4 Write the pill test for `location-presets-003`.
  - Mutation: Set the Taiwan pill name to another name. The test must fail.
- [x] 1.5 Write the flight test for `location-presets-004`.
  - Mutation: Change the first POI range to 1000 m. The test must fail.
- [x] 1.6 Write the search test for `location-presets-005`.
  - Mutation: Change the preset name to another name. The test must fail.

## 2. Code and checks

- [x] 2.1 Add the Taiwan preset as the first key of `CITY_POIS`.
- [x] 2.2 Run each scenario test and each mutation.
- [x] 2.3 Run STE lint, format checks and all tests that use the preset file.

## 3. Gates and review

- [x] 3.1 Run the ratchet command in the Docker image.
- [x] 3.2 Run the gates in the Docker image.
- [ ] 3.3 Get two review agent verdicts.
- [ ] 3.4 Write `review.md` with the tree hash and verdicts.
