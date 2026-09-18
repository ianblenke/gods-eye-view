## 1. Spec and proposal

- [x] 1.1 Write `specs/osh/spec.md` with the MODIFIED, the ADDED and the carried scenarios of the ledger below. Name each carried id: `osh-004`, `osh-006`, `osh-025`, `osh-026`, `osh-027`, `osh-031`, `osh-033`.
- [x] 1.2 Write `proposal.md` with the Why as a mechanism, the two marker kinds, the Impact and the known limits. No count from the owner's server.
- [x] 1.3 Write `design.md` with D29 to D34 and the request shape.
- [x] 1.4 Write `tasks.md` from this list, with the rules-out line under each test task.

## 2. Fixtures

- [x] 2.1 Write `src/data/fixtures/osh-fois.json`, synthetic, with the feature shapes: three features for one system at three positions, one for a second system, one with a null geometry, one with a link to `procedures/x`, one with no link.
- [x] 2.2 Add a system with a null geometry to `osh-systems.json`.
- [x] 2.3 Add the new fixture to `src/data/fixtures/README.md`.

## 3. Adapters

- [x] 3.1 Change the `[osh-024]` tests: a feature with no `Point` gives a record with null coordinates, and a repeated id gives one record.
  - Rules out: the shipped `mapOshSystems()`, which skips that feature and keeps both records of a repeated id; and a mapper that writes `0` for an absent coordinate.
- [x] 3.2 Change `mapOshSystems()` until 3.1 passes.
- [x] 3.3 Write `src/data/oshFois.test.mjs` with the `[osh-041]` tests: the fixture, each skip, the host join, a repeated id, a host id outside the pattern as `[osh-047]`.
  - Rules out: a mapper that joins a `procedures/x` link; one that keeps a feature with no `Point`; one that keeps both records of a repeated id; one that passes an off-pattern host id through.
- [x] 3.4 Write `src/data/oshFois.js` until 3.3 passes.
- [x] 3.5 Write the `[osh-042]` tests of `placeOshEntities()`: a `Point` places, a null does not and counts, every feature places, no cross-placement.
  - Rules out: a merge that places a host at its first feature, or a feature at its host; one that drops a feature with a null host.
- [x] 3.6 Write `placeOshEntities()` in `oshSystems.js` until 3.5 passes.
- [x] 3.7 Change the `[osh-005]` pinned `src/data` list in `oshProxy.test.mjs`. Count the files off the directory.
  - Rules out: a second new adapter file that the scan does not read. This is the updated pin, not a new property.
- [x] 3.8 Add `src/data/oshFois.js` to the `osh-provider` group in `scripts/package-boundaries.json`.

## 4. Page walk, id boundary and routes

- [x] 4.1 Write the `[osh-044]` tests of `maxPages` and `{items, truncated}` in `oshGet.test.mjs`.
  - Rules out: a walk that reports `truncated` for a refused link or for no next link; one that requests a page past `maxPages`; a default other than 20.
- [x] 4.2 Change `oshPages()` in `get.js` until 4.1 passes, and change its callers in `osh.js`.
- [x] 4.3 Write the `[osh-047]` tests of `readSystemId()`, `systemDatastreamsUrl()` and `assertSystemDatastreamsUrl()` in `oshIds.test.mjs`, with the rejection sets of `osh-020`.
  - Rules out: a reader that takes the first of two values; a builder that puts the id in the query; a check that compares the path but not the query.
- [x] 4.4 Write the three functions and the query constant in `ids.js` until 4.3 passes.
- [x] 4.5 Write the `[osh-048]` keyed-cache tests in `oshObservationsProxy.test.mjs`: TTL, single flight, stale on failure, the cap, two keys apart.
  - Rules out: a cache shared between keys; one that refetches inside the TTL; one that throws on failure with a snapshot in hand.
- [x] 4.6 Refactor `createOshKeyedCache()` in `observations.js`, wrap both caches, until 4.5 passes and the `[osh-023]` tests still pass with no edit.
- [x] 4.7 Write the `[osh-047]` route rejection test and the `[osh-048]` route tests in `oshProxy.test.mjs`: the recorded URL, no `f` key, the global list with no key, the status field.
  - Rules out: a route that filters the global walk by the id instead of fetching the per-system list; one that sends `f`; one that answers `400` for a request with no `system` key.
- [x] 4.8 Add the `system` key to the datastreams route in `osh.js`, with the fixed pair called directly, until 4.7 passes.
- [x] 4.9 Write the `[osh-043]` route tests: the shape, the cache, the stale answer, the 502, the recorded GETs, the query, the status route.
  - Rules out: a route that answers `200` with an empty list on a failed walk with no snapshot; one that omits `truncated`; one that sends the query with a literal `+`.
- [x] 4.10 Add the features cache and route to `osh.js` until 4.9 passes.
- [x] 4.11 Change the `[osh-034]` hygiene test: the feature fixture, the `foi-fixture-` prefix, the test-file count off the directory.
  - Rules out: a feature fixture with an id that is not synthetic; a new test file the scan does not read.
- [x] 4.12 Run `npm run check:boundaries` and the full `node --test`. Confirm `osh-038` and `osh-039` pass with no edit.

## 5. Browser source, layer and detail

- [x] 5.1 Change the `[osh-028]` source tests: the features getter, `truncated`, and the `system` key on the datastreams getter, present and absent.
  - Rules out: a getter that always sends `system`; one that sends it unencoded; one that swallows `truncated`.
- [x] 5.2 Add `getFois()` and the `system` option to `source.js` until 5.1 passes.
- [x] 5.3 Change the `[osh-032]` detail tests: the feature header, the host id with no record, `Host: —`, and the escape of a feature name.
  - Rules out: a renderer that writes a feature name unescaped; one that shows the feature header for a system selection.
- [x] 5.4 Change `renderOshDetail()` until 5.3 passes.
- [x] 5.5 Change the `[osh-029]` layer tests: no entity for a system with null coordinates, and the new stats fields.
  - Rules out: the shipped layer, which would draw that system at latitude zero and longitude zero.
- [x] 5.6 Write the `[osh-045]` layer tests: feature entities, the label condition, each click case, the dropped feature, the uid map, no fetch by id.
  - Rules out: a layer that gives a feature the `osh:` prefix; one that starts a poll for a feature with no host; one that keeps a selection after the feature leaves the list.
- [x] 5.7 Write the `[osh-046]` layer tests: a thrown features getter, a server with nothing, `truncated`, an abort.
  - Rules out: a refresh that sets `error` when only the features fail; one that draws from a read that settled after an abort.
- [x] 5.8 Change the `[osh-030]` layer tests: the poll passes the selected id to the getter, and drops a record of another system.
  - Rules out: the shipped poll, which calls the getter with no argument.
- [x] 5.9 Remove the `[osh-031]` test that asserts a system dropped from a later fetch clears the selection. Its assertion is now wrong. Keep every other `[osh-031]` test.
- [x] 5.10 Write the `[osh-049]` layer tests: an omitted system stays with its entity, its selection and its poll; a renamed system updates; `keyRequired` empties the map; an omitted feature goes.
  - Rules out: the shipped layer, which rebuilds the entities from each response and clears the selection of an omitted system.
- [x] 5.11 Change `update()`, the click handler, `pollSelected()` and the record maps in `layers/osh/index.js` until 5.5 to 5.10 pass.
- [x] 5.12 Run the other `[osh-031]` tests with no edit. Confirm the motion holds. This is a keep-test.

## 6. Gates and review

- [ ] 6.1 Run `make lint` until no STE error remains.
- [ ] 6.2 Run `make ratchet CHANGE=osh-geo-discovery`.
- [ ] 6.3 Run `make gates CHANGE=osh-geo-discovery`. Confirm every OSH file stays at 100%.
- [ ] 6.4 Run the review agents and record the result in `review.md`.

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
| Systems layer | `osh-028` | MODIFIED | the features getter, `truncated`, the `system` key present and absent |
| Systems layer | `osh-029` | MODIFIED | no entity for null coordinates; the new stats fields |
| Systems layer | `osh-030` | MODIFIED | the getter receives the selected id; a foreign record is dropped |
| Systems layer | `osh-031` | carried | text unchanged; one of its tests, the one that asserts an omitted system clears the selection, is removed as wrong; the rest keep |
| Systems layer | `osh-032` | MODIFIED | the feature header, the host id, `Host: —` |
| Systems layer | `osh-033` | carried | nothing; keep |
| Systems layer | `osh-046` | ADDED | the optional features read, `partial`, the empty server, the abort |
| Systems layer | `osh-049` | ADDED | the system map is a union; an omitted system keeps its entity, selection and poll; an omitted feature goes |
| Synthetic fixtures | `osh-034` | MODIFIED | the feature fixture, the `foi-fixture-` prefix, the test-file count off the directory |
| Features of interest | `osh-043` | ADDED | the route, its cache, its recorded GETs |
| Features of interest | `osh-044` | ADDED | `maxPages` and `truncated` |
| Feature markers | `osh-045` | ADDED | feature entities, selection, the uid map |
| Datastreams of one system | `osh-047` | ADDED | the system-id boundary |
| Datastreams of one system | `osh-048` | ADDED | the per-system route and cache |

Seven MODIFIED, nine ADDED, seven carried. Three requirements are new. No requirement text changes.
