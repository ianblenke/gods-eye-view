## 1. Spec and proposal

- [x] 1.1 Write `specs/osh/spec.md` with the ADDED, the MODIFIED and the carried scenarios, quoted from `git show HEAD:openspec/specs/osh/spec.md` at the commit this branch started from, and from `osh-observation-age`'s own delta for the two scenarios it touches.
- [x] 1.2 Write `proposal.md` with the Why, the three measured schema shapes, the three candidate sources, the Impact and the limits.
- [x] 1.3 Write `design.md` with D44 to D50 and the request shape.
- [x] 1.4 Write `tasks.md` from this list, with the rules-out line under each test task.

## 2. Fixtures

- [x] 2.1 Write `osh-schema-vector.json`, `osh-schema-flat.json` and `osh-schema-noframe.json`, synthetic.
- [x] 2.2 Write `osh-datastreams-filtered.json` and `osh-latest-page.json`, synthetic.
- [x] 2.3 Add `OSH_LOCATION_PROPERTIES` to `.env.example`, commented and empty, and the new fixtures to `README.md`.

## 3. Reader and mappers

- [x] 3.1 Write the `readOshSchemaLocation()` tests: all three fixtures, an in-line alternate field name, an ECEF vector, an off-list frame, a radian unit, a missing axis, `altitudeMsl` alone, both shapes in one schema, no `resultSchema`, a field past the depth cap.
  - Rules out: a reader that walks `fields` only and misses a Vector's `coordinates`; one that requires a `referenceFrame`; one that binds by a field's own name or by list position; one that binds a height to `altitudeMsl`; one that treats an off-list frame as geographic.
- [x] 3.2 Write `readOshSchemaLocation()` until 3.1 passes.
- [x] 3.3 Rewrite the `extractOshLocation()` tests to drive the reader: the `NaN` height, the kept angles, the null reader, a result with `lat`/`lon` keys and a null reader giving null.
  - Rules out: the shipped extractor, which finds `lat` and `lon` by name; one that drops the angles for a bad height.
- [x] 3.4 Rewrite `extractOshLocation(result, reader)`, and give `mapOshObservation()` its reader, until 3.3 passes.
- [x] 3.5 Write the `mapOshLocationPage()` tests: the page fixture, the one item with no feature reference, an item with no location kept, the order kept, the age from the injected clock, a malformed payload.
  - Rules out: a mapper that drops the no-feature item; one that sorts; one that reads the wall clock instead of the injected one.
- [x] 3.6 Write `mapOshLocationPage()` until 3.5 passes.
- [x] 3.7 Write the merge-function tests: a stale location dropped first; a fresh feature move by id and by uid; a fresh system placement above a point; the newer of two winning; an unknown feature dropped; a system with no held record placed with a null name.
  - Rules out: a merge that places a host from a feature-referencing record; one that lets a stale record place anything; one that prefers a point over a fresh record.
- [x] 3.8 Change the merge function until 3.7 passes.

## 4. Id boundary, caches and the pass

- [x] 4.1 Write the schema-URL, system-URL and newest-record-URL pair tests, with the rejection shapes the datastream id boundary already uses.
  - Rules out: a builder that takes its limit from an argument; a check that compares the path but not the query; a URL with a trailing segment.
- [x] 4.2 Write the three fixed pairs and their constants in `ids.js` until 4.1 passes.
- [x] 4.3 Write the schema-cache and system-cache tests through the keyed-cache factory: the TTL, single flight, staleness, the cap, one reader or name per id.
  - Rules out: a cache that stores the raw schema and re-reads it on every call; one shared between ids.
- [x] 4.4 Write `createOshSchemaCache()` and `createOshSystemCache()` until 4.3 passes.
- [x] 4.5 Write the pass tests: the union of the three sources without duplicates, a stream with no reader counted as failed, a failed page read counted the same way, the fold through `mapOshLocationPage()`, the fixed URL pairs, no request sent with no candidate, the name from the snapshot, the name from one read by id, a null name on a failed read that keeps the location.
  - Rules out: a pass that reads a page for a stream with no reader; one that drops a candidate whose system is unknown; one that reads a candidate twice when two sources name it; one that drops a location when its name read fails; one that reads a name the snapshot already holds.
- [x] 4.6 Write `createOshLocationsPass()` until 4.5 passes.
- [x] 4.7 Write the property-filter route tests: one request per URI with the right query keys, the built-in list, an appended value, a refused value and its positional warning, no URI in any response, the status count.
  - Rules out: a provider that puts the URI in the path; one that logs the refused value's own text; one that echoes the list on the status route.
- [x] 4.8 Write the `/locations` route tests: the response shape, the short cache TTL, an empty answer with no candidate at all, the schema read landing before the existing observation route's own read.
  - Rules out: a route cached at the list TTL instead of the short one; one that answers an error when a single candidate fails.
- [x] 4.9 Add the property lists, the locations route and the schema read to `osh.js` until 4.7 and 4.8 pass.
- [x] 4.10 Change the repository-hygiene test: the two public vocabulary hosts, the synthetic vendor-segment rule, the fourth environment key. Count the test files off the directory.
  - Rules out: a fixture with a real vendor segment in a definition term; a source file naming any other host.
- [x] 4.11 Run `npm run check:boundaries` and the affected `node --test` files. Confirm the file-count pins hold with no edit.

## 5. Browser source, layer and detail

- [x] 5.1 Write the source tests: `getLocations()`, its key-required answer, its throw, its pass-through of the payload, its empty query.
  - Rules out: a getter that sends a query; one that drops the failed count.
- [x] 5.2 Add `getLocations()` to `source.js` until 5.1 passes.
- [x] 5.3 Write the layer tests: a thrown locations getter setting partial with no error, an aborted update across all three reads, no candidate sent to the locations getter.
  - Rules out: a refresh that sets an error when only the locations read fails; one that sends a system id to the locations getter.
- [x] 5.4 Write the stream-placement tests: placement and its stat, the label from the pass's own name, the raw-id label only with no name at all, the placeholder kept outside the layer's own union, retirement on staleness, the selected exception, the feature move taking priority over any system placement, the click and the poll on a stream-placed entity.
  - Rules out: a layer that places from geometry only; one that labels every unheld system with its raw id; one that keeps a stale stream's entity; one that puts the placeholder into the union; one that removes a selected entity.
- [x] 5.5 Change `update()` and the record bookkeeping in `layers/osh/index.js` until 5.3 and 5.4 pass.
- [x] 5.6 Run the motion and the detail tests already shipped, with no edit — a keep-test, pending the two scenarios `osh-observation-age` still owns.

## 6. The two scenarios `osh-observation-age` owns

- [ ] 6.1 Merge `osh-observation-age` into this branch.
- [ ] 6.2 Quote its base text for the motion scenario and the detail-rendering scenario from the merged tree, and add this change's own line to each: the detail's `Placed by` header for a stream-placed system, and nothing new for motion — the selected system's own poll is unchanged.
- [ ] 6.3 Change the detail renderer's tests and its code for the `Placed by` line.
- [ ] 6.4 Confirm the motion tests already shipped need no change.

## 7. Gates and review

- [ ] 7.1 Run `make lint` until no STE error remains.
- [ ] 7.2 Run `make ratchet CHANGE=osh-location-streams`.
- [ ] 7.3 Run `make gates CHANGE=osh-location-streams`. Confirm every changed file stays at 100%.
- [ ] 7.4 Run `/opsx:review osh-location-streams`, correct the findings, and record the result in `review.md`.
