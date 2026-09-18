## 1. Spec and proposal

- [x] 1.1 Write `specs/osh/spec.md` with the ledger's MODIFIED, ADDED and carried scenarios.
  - Name each carried id: `osh-004`, `osh-006`, `osh-025`, `osh-026`, `osh-027`, `osh-031`, `osh-033`.
- [x] 1.2 Write `proposal.md`: the Why as a mechanism, the two marker kinds, the Impact, the known limits.
  - No count from the owner's server.
- [x] 1.3 Write `design.md` with D29 to D34 and the request shape.
- [x] 1.4 Write `tasks.md` from this list, with a rules-out line under each test task.

## 2. Fixtures

- [x] 2.1 Write `src/data/fixtures/osh-fois.json`, synthetic. Cover the feature shapes of section A3.
- [x] 2.2 Add a system with a null geometry to `osh-systems.json`.
- [x] 2.3 Add the new fixture to `src/data/fixtures/README.md`.

## 3. Adapters

- [x] 3.1 Change the `[osh-024]` tests: null coordinates for a feature with no `Point`, one record for a repeated id.
  - Rules out: the shipped mapper, which skips that feature and keeps both records of a repeated id.
- [x] 3.2 Change `mapOshSystems()` until 3.1 passes.
- [x] 3.3 Write `src/data/oshFois.test.mjs` with the `[osh-041]` tests: the fixture, each skip, the host join, a repeated id.
  - Add the bad host id case as `[osh-047]`.
  - Rules out: a mapper that joins a wrong link kind, keeps a feature with no `Point`, or passes a bad host id through.
- [x] 3.4 Write `src/data/oshFois.js` until 3.3 passes.
- [x] 3.5 Write the `[osh-042]` merge tests: a `Point` places, a null counts as unplaced, every feature places, no cross-placement.
  - Rules out: a merge that places a host at its first feature, or drops a feature with a null host.
- [x] 3.6 Write the merge function in `oshSystems.js` until 3.5 passes.
- [x] 3.7 Change the `[osh-005]` pinned `src/data` list in `oshProxy.test.mjs`. Count the files off the directory.
  - Rules out: a second new adapter file the scan does not read.
- [x] 3.8 Add `src/data/oshFois.js` to the `osh-provider` group in `scripts/package-boundaries.json`.

## 4. Page walk, id boundary and routes

- [x] 4.1 Write the `[osh-044]` tests of the page cap option and its truncated answer, in `oshGet.test.mjs`.
  - Rules out: a walk that reports a loss for a refused link, or requests a page past its cap.
- [x] 4.2 Change the page walk function in `get.js` until 4.1 passes. Change its callers in `osh.js`.
- [x] 4.3 Write the `[osh-047]` tests of the system id reader, builder and checker, in `oshIds.test.mjs`.
  - Reuse the rejection sets of `osh-020`.
  - Rules out: a reader that takes the first of two values, or a builder that puts the id in the query.
- [x] 4.4 Write the three functions and the query constant in `ids.js` until 4.3 passes.
- [x] 4.5 Write the `[osh-048]` keyed-cache tests in `oshObservationsProxy.test.mjs`: TTL, single flight, stale on failure, the cap, two keys apart.
  - Rules out: a cache shared between keys, or one that refetches inside the TTL.
- [x] 4.6 Refactor the keyed cache in `observations.js`. Wrap both caches until 4.5 passes.
  - Confirm the `[osh-023]` tests still pass with no edit.
- [x] 4.7 Write the `[osh-047]` route rejection test and the `[osh-048]` route tests: the recorded URL, no format key.
  - Also cover the global list with no key, and the status field.
  - Rules out: a route that filters the global walk by id instead of fetching the per-system list.
- [x] 4.8 Add the system key to the datastreams route in `osh.js`, with the fixed pair called directly, until 4.7 passes.
- [x] 4.9 Write the `[osh-043]` route tests: the shape, the cache, the stale answer, the 502, the recorded GETs.
  - Also cover the query and the status route.
  - Rules out: a route that answers 200 with an empty list on a failed walk with no snapshot.
- [x] 4.10 Add the features cache and route to `osh.js` until 4.9 passes.
- [x] 4.11 Change the `[osh-034]` hygiene test: the feature fixture, its id prefix, the test-file count off the directory.
  - Rules out: a feature fixture with an id that is not synthetic.
- [x] 4.12 Run the boundary check and the full test suite. Confirm `osh-038` and `osh-039` pass with no edit.

## 5. Browser source, layer and detail

- [x] 5.1 Change the `[osh-028]` source tests: the features getter, the truncated flag, the system key present and absent.
  - Rules out: a getter that always sends the system key, or one that swallows the truncated flag.
- [x] 5.2 Add the features getter and the system option to `source.js` until 5.1 passes.
- [x] 5.3 Change the `[osh-032]` detail tests: the feature header, the host id with no record, the no-host case.
  - Also cover the escape of a feature name.
  - Rules out: a renderer that writes a feature name unescaped.
- [x] 5.4 Change the detail renderer until 5.3 passes.
- [x] 5.5 Change the `[osh-029]` layer tests: no entity for a system with null coordinates, and the new stats fields.
  - Rules out: the shipped layer, which would draw that system at zero, zero.
- [x] 5.6 Write the `[osh-045]` layer tests: feature entities, the label condition, each click case, the dropped feature.
  - Also cover the uid map and the no-fetch-by-id rule.
  - Rules out: a layer that gives a feature the system prefix, or starts a poll for a feature with no host.
- [x] 5.7 Write the `[osh-046]` layer tests: a thrown features getter, an empty server, the truncated flag, an abort.
  - Rules out: a refresh that sets an error when only the features read fails.
- [x] 5.8 Change the `[osh-030]` layer tests: the poll passes the selected id, and drops a foreign record.
  - Rules out: the shipped poll, which calls the getter with no argument.
- [x] 5.9 Remove the `[osh-031]` test that says a dropped system clears the selection. Its assertion is now wrong. Keep the rest.
- [x] 5.10 Write the `[osh-049]` layer tests: an omitted system keeps its entity, selection and poll; a renamed system updates.
  - Also cover the key-required empty-map case, and an omitted feature.
  - Rules out: the shipped layer, which rebuilds its entities from each response.
- [x] 5.11 Change the update function, the click handler, the poll and the record maps in `layers/osh/index.js` until 5.5 to 5.10 pass.
- [x] 5.12 Run the other `[osh-031]` tests with no edit. Confirm the motion holds. This is a keep-test.

## 6. Gates and review

- [ ] 6.1 Run the lint gate until no STE error remains.
- [ ] 6.2 Run the ratchet gate for this change.
- [ ] 6.3 Run the coverage gate for this change. Confirm every OSH file stays at 100%.
- [ ] 6.4 Run the review agents. Record the result in `review.md`.

## Scenario ledger

| Requirement | Scenario | State | The test must newly assert |
|---|---|---|---|
| GET only | `osh-004` | carried | nothing; keep |
| GET only | `osh-005` | MODIFIED | the `src/data` pin includes the new adapter file, counted off the directory |
| GET only | `osh-006` | carried | nothing; keep |
| Records | `osh-024` | MODIFIED | a feature with no `Point` gives a record with null `lon`, `lat`, `alt`; a repeated id gives one record |
| Records | `osh-025` | carried | nothing; keep |
| Records | `osh-026` | carried | nothing; keep |
| Records | `osh-027` | carried | nothing; keep |
| Records | `osh-041` | ADDED | the feature adapter, the host join, the repeated id |
| Records | `osh-042` | ADDED | the placement of systems and features |
| Systems layer | `osh-028` | MODIFIED | the features getter, the truncated flag, the system key present and absent |
| Systems layer | `osh-029` | MODIFIED | no entity for null coordinates; the new stats fields |
| Systems layer | `osh-030` | MODIFIED | the getter receives the selected id; a foreign record is dropped |
| Systems layer | `osh-031` | carried | text unchanged; the test that says an omitted system clears the selection is removed as wrong; the rest keep |
| Systems layer | `osh-032` | MODIFIED | the feature header, the host id, the no-host case |
| Systems layer | `osh-033` | carried | nothing; keep |
| Systems layer | `osh-046` | ADDED | the optional features read, the partial flag, the empty server, the abort |
| Systems layer | `osh-049` | ADDED | the system map is a union; an omitted system keeps its entity, selection and poll; an omitted feature goes |
| Synthetic fixtures | `osh-034` | MODIFIED | the feature fixture, its id prefix, the test-file count off the directory |
| Features of interest | `osh-043` | ADDED | the route, its cache, its recorded GETs |
| Features of interest | `osh-044` | ADDED | the page cap option and its truncated answer |
| Feature entities | `osh-045` | ADDED | feature entities, selection, the uid map |
| Datastreams of one system | `osh-047` | ADDED | the system-id boundary |
| Datastreams of one system | `osh-048` | ADDED | the per-system route and cache |

Seven MODIFIED, nine ADDED, seven carried. Three requirements are new. No requirement text changes.
