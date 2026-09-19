## 1. Spec and proposal

- [x] 1.1 Write `specs/osh/spec.md` with the ADDED, the MODIFIED and the carried scenarios.
  - Quote each base text from `git show HEAD:openspec/specs/osh/spec.md`, at the commit this branch started from.
  - Quote `osh-031` and `osh-032`'s base text from `osh-observation-age`'s own delta, the two scenarios it touches.
  - Carried ids: `osh-020`, `osh-021`, `osh-024`, `osh-025`, `osh-026`, `osh-029`, `osh-030`, `osh-033`, `osh-041`, `osh-047`, `osh-048`, `osh-049`.
  - MODIFIED ids: `osh-027`, `osh-028`, `osh-031`, `osh-032`, `osh-034`, `osh-042`, `osh-046`.
  - ADDED ids: `osh-051`, `osh-052`, `osh-053`, `osh-054`, `osh-055`, `osh-056`, `osh-057`.
- [x] 1.2 Write `proposal.md`: the Why, the three schema shapes, the three sources, the Impact, the limits.
- [x] 1.3 Write `design.md` with D44 to D50 and the request shape.
- [x] 1.4 Write `tasks.md` from this list, with a rules-out line under each test task.

## 2. Fixtures

- [x] 2.1 Write `osh-schema-vector.json`, `osh-schema-flat.json` and `osh-schema-noframe.json`, synthetic.
- [x] 2.2 Write `osh-datastreams-filtered.json` and `osh-latest-page.json`, synthetic.
- [x] 2.3 Add `OSH_LOCATION_PROPERTIES` to `.env.example`, commented and empty. Add the new fixtures to `README.md`.

## 3. Reader and mappers

- [x] 3.1 Write the `readOshSchemaLocation()` tests: all three fixtures, an in-line alternate field name, an ECEF vector, an off-list frame.
  - Add cases for a radian unit, a missing axis, `altitudeMsl` alone, both shapes in one schema, no `resultSchema`, a field past the depth cap.
  - Rules out: a reader that misses a Vector's `coordinates`; one that needs a `referenceFrame`; one that binds by a field's own name.
  - Also rules out: one that binds a height to `altitudeMsl`; one that treats an off-list frame as geographic.
- [x] 3.2 Write `readOshSchemaLocation()` until 3.1 passes.
- [x] 3.3 Rewrite the `extractOshLocation()` tests to drive the reader.
  - Cover the `NaN` height, the kept angles, the null reader, and a result with `lat`/`lon` keys but a null reader.
  - Rules out: the shipped extractor, which finds `lat` and `lon` by name; one that drops the angles for a bad height.
- [x] 3.4 Rewrite `extractOshLocation(result, reader)`. Give `mapOshObservation()` its reader. Until 3.3 passes.
- [x] 3.5 Write the `mapOshLocationPage()` tests: the page fixture, the item with no feature reference, an item with no location kept.
  - Also cover the order kept, the age from the injected clock, a malformed payload.
  - Rules out: a mapper that drops the no-feature item; one that sorts; one that reads the wall clock.
- [x] 3.6 Write `mapOshLocationPage()` until 3.5 passes.
- [x] 3.7 Write the merge-function tests: a stale location dropped first, a fresh feature move by id and by uid.
  - Also cover a fresh system placement above a point, the newer of two winning, an unknown feature dropped, a null name.
  - Rules out: a merge that places a host from a feature-referencing record; one that lets a stale record place anything.
  - Also rules out: one that prefers a point over a fresh record.
- [x] 3.8 Change the merge function until 3.7 passes.

## 4. Id boundary, caches and the pass

- [x] 4.1 Write the schema-URL, system-URL and newest-record-URL pair tests, with the datastream id boundary's own rejection shapes.
  - Rules out: a builder that takes its limit from an argument; a check that skips the query; a URL with a trailing segment.
- [x] 4.2 Write the three fixed pairs and their constants in `ids.js` until 4.1 passes.
- [x] 4.3 Write the schema-cache and system-cache tests through the keyed-cache factory: the TTL, single flight, staleness, the cap.
  - Rules out: a cache that stores the raw schema and re-reads it every call; one shared between ids.
- [x] 4.4 Write `createOshSchemaCache()` and `createOshSystemCache()` until 4.3 passes.
- [x] 4.5 Write the pass tests: the union of the three sources without duplicates, a stream with no reader counted as failed.
  - Also cover a failed page read, the fold through `mapOshLocationPage()`, the fixed URL pairs, no request with no candidate.
  - Also cover the name from the snapshot, the name from one read by id, a null name that keeps the location.
  - Rules out: a pass that pages a stream with no reader; one that drops an unknown system; one that pages one candidate twice.
  - Also rules out: one that drops a location when its name read fails; one that re-reads a snapshot name.
- [x] 4.6 Write `createOshLocationsPass()` until 4.5 passes.
- [x] 4.7 Write the property-filter route tests: one request per URI, the right query keys, the built-in list, an appended value.
  - Also cover a refused value and its positional warning, no URI in any response, the status count.
  - Rules out: a provider that puts the URI in the path; one that logs the refused value's own text.
- [x] 4.8 Write the `/locations` route tests: the response shape, the short cache TTL, an empty answer with no candidate.
  - Also cover the schema read landing before the existing observation route's own read.
  - Rules out: a route cached at the list TTL; one that errors when a single candidate fails.
- [x] 4.9 Add the property lists, the locations route and the schema read to `osh.js` until 4.7 and 4.8 pass.
- [x] 4.10 Change the repository-hygiene test: the two vocabulary hosts, the vendor-segment rule, the fourth key.
  - Count the test files off the directory. Rules out: a fixture with a real vendor segment; a file naming another host.
- [x] 4.11 Run `npm run check:boundaries` and the affected `node --test` files. Confirm the file-count pins hold unedited.

## 5. Browser source, layer and detail

- [x] 5.1 Write the source tests: `getLocations()`, its key-required answer, its throw, its pass-through, its empty query.
  - Rules out: a getter that sends a query; one that drops the failed count.
- [x] 5.2 Add `getLocations()` to `source.js` until 5.1 passes.
- [x] 5.3 Write the layer tests: a thrown locations getter, an aborted update across all three reads, no sent candidate.
  - Rules out: a refresh that errors when only locations fail; one that sends a system id to the locations getter.
- [x] 5.4 Write the stream-placement tests: placement and its stat, the label from the pass's own name, the raw-id fallback.
  - Also cover the placeholder kept outside the union, retirement on staleness, the selected exception, the feature-move priority, the click and the poll.
  - Rules out: a layer that places from geometry only; one that labels every unheld system with its raw id.
  - Also rules out: one that keeps a stale stream's entity; one that unions the placeholder; one that drops a selected entity.
- [x] 5.5 Change `update()` and the record bookkeeping in `layers/osh/index.js` until 5.3 and 5.4 pass.
- [x] 5.6 Re-run this change's own tests before the merge below, against a temporary local stub of the freshness function.
  - `osh-observation-age` had not yet merged that function. The stub run is a stand-in, not proof; re-run for real once merged.

## 6. The two scenarios `osh-observation-age` owns

- [x] 6.1 Merge `osh-observation-age` into this branch.
  - Three files conflicted; each resolved by keeping both sides' additions.
- [x] 6.2 Quote `osh-031` and `osh-032`'s base text from `git show` on the merged tree, verbatim.
  - `osh-031` is carried with no change. `osh-032` gains one line, for the `Placed by` header.
- [x] 6.3 Write the `[osh-032]` detail tests for the `Placed by` line: the name and the age, the em-dash fallback.
  - Also cover no line for a geometry-placed system, and the id standing in for the name with neither.
  - Change `renderSystemHeader()` in `detail.js` until they pass.
  - Rules out: a renderer that always shows the line; one that shows the raw age; one that omits the id fallback.
- [x] 6.4 Re-run `[osh-031]`'s own tests with no edit, a keep-test, since motion is unchanged by this branch.
  - Cover the detail-only fields `pollSelected()` now builds — the stream-placed name fallback and the `placedBy` field — with a layer test.
- [x] 6.5 Fix a staleness bug this merge exposed.
  - The `/api/osh/locations` pass cache can serve one fold more than once.
  - Each location's `ageMs` is now recomputed at serve time from its `phenomenonTime`, never trusted from the fold.
  - This is the same reason `osh-050`'s own route recomputes the single-observation age.
  - A new route test proves the age grows between two answers from one cached pass.

## 7. Gates and review

- [ ] 7.1 Run `make lint` until no STE error remains.
- [ ] 7.2 Run `make ratchet CHANGE=osh-location-streams`.
- [ ] 7.3 Run `make gates CHANGE=osh-location-streams`. Confirm every changed file stays at 100%.
- [ ] 7.4 Run `/opsx:review osh-location-streams`. Correct the findings. Record the result in `review.md`.
