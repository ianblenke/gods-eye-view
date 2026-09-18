## MODIFIED Requirements

### Requirement: GET only
The provider MUST send only GET requests to the OpenSensorHub server, through one function, and MUST refuse a browser request whose method is not GET.
Origin: spec-first

#### Scenario: Send every upstream request as a recorded GET `osh-004`
- **WHEN** a client requests the systems, datastreams and observations routes, so that the base probe, the list fetch and the observation fetch each run
- **THEN** each recorded upstream call has method `GET`, no body and an `AbortSignal`

#### Scenario: Keep one upstream call site `osh-005`
- **WHEN** the test discovers every file that matches `server/providers/osh/*.js` and every file that matches `src/data/osh*.js`
- **AND** it fails when the first set is not four files, or the second set is not five files, its pinned sizes
- **AND** it reads, as text, `server/providers/osh.js`, the discovered files, and `server/providers/common/http.js`
- **THEN** only `server/providers/osh/get.js` contains a call to `fetch` or `fetchImpl`
- **AND** `get.js` sets `method: 'GET'` and `redirect: 'manual'` on that call
- **AND** no file has `post`, `put`, `patch` or `delete` as a quoted string, in any letter case, and no file has a `body:` key
- **AND** no file imports `node:http`, `node:https`, `undici` or `ws`
- **AND** every other file that sends an upstream request imports `oshGet` or `oshPages` from `./get.js` or `./osh/get.js`

#### Scenario: Refuse a non-GET browser request `osh-006`
- **WHEN** a client sends `POST`, `PUT`, `PATCH` or `DELETE` to any sub-path of `/api/osh`
- **THEN** the response is `405` with the header `Allow: GET`
- **AND** the provider sends zero upstream requests

### Requirement: Records
The shared adapters MUST be pure, and MUST tolerate an absent or malformed field.
Origin: spec-first

#### Scenario: Map a feature list to system records `osh-024`
- **WHEN** a payload carries a list under `features` or `items`
- **THEN** each record keeps `id`, `uid`, `name`, `description`, `validTime`, `lon`, `lat` and `alt`
- **AND** a feature with no `Point` geometry, or with a coordinate that is not finite, keeps a record with `lon`, `lat` and `alt` null
- **AND** the mapper skips a feature with no string id, and keeps the first record of a repeated id
- **AND** a malformed payload maps to an empty list

#### Scenario: Map a datastream list to datastream records `osh-025`
- **WHEN** a payload carries a list under `items` or `datastreams`
- **THEN** each record keeps `id`, `systemId`, `name`, `outputName` and `validTime`
- **AND** `systemId` comes from `system@id`, `systemId`, `system.id` or the last path segment of `system@link.href`, in that order, else null
- **AND** the mapper skips an entry with no id, or an id outside the datastream id pattern

#### Scenario: Flatten a result to rows `osh-026`
- **WHEN** the flattener reads a result record
- **THEN** a primitive value becomes one row, a nested object becomes dotted paths, and an array becomes index paths
- **AND** an object or an array with a path of four or more names becomes the string `[object]`
- **AND** a primitive keeps its own value at any depth
- **AND** a result with more than 64 rows keeps 63 and ends with one marker row
- **AND** a null result gives an empty row list

#### Scenario: Extract a location from a result `osh-027`
- **WHEN** the extractor searches a result record for a location
- **THEN** it returns an object with `lat`/`lon` or `latitude`/`longitude` keys, case-insensitive, at a path of three names or fewer, with an optional `alt`
- **AND** with none found, it uses `geometry.coordinates` as `[lon, lat, alt?]` instead
- **AND** it refuses a latitude past 90 degrees or a longitude past 180 degrees
- **AND** a result with neither gives null

#### Scenario: Map a feature-of-interest list to feature records `osh-041`
- **WHEN** a payload carries a list under `features` or `items`
- **THEN** each record keeps `id`, `uid`, `systemId`, `name`, `description`, `validTime`, `lon`, `lat` and `alt`
- **AND** `systemId` is the last path segment of `hostedProcedure@link.href` only when the segment before it is `systems`, else null
- **AND** the mapper skips a feature with no string id, with no `Point`, or with a coordinate that is not finite
- **AND** a repeated id keeps the first record only
- **AND** a malformed payload maps to an empty list

#### Scenario: Place the systems and the features from their own geometry `osh-042`
- **WHEN** `placeOshEntities({systems, fois})` reads the two lists
- **THEN** a system with a `Point` gives a placed system at its coordinates with `locationSource:'geometry'`
- **AND** a system with no `Point` gives no placed system and adds one to `unplaced`
- **AND** every feature record gives a placed feature at its own point with its `systemId`
- **AND** a feature never places its host system, and a system never places a feature

### Requirement: Systems layer
The browser layer MUST show one entity for each system with a point location. It MUST poll the datastreams and the newest observation of the selected system. It MUST report its state through `getStats()`.
Origin: spec-first

#### Scenario: Report key required from the browser source `osh-028`
- **WHEN** the browser source calls the systems, datastreams, features or observation getter and the server answers `503` with `{error:'no_key'}`
- **THEN** the getter resolves to `keyRequired:true`
- **AND** another non-ok status, or a payload without the expected field, makes the getter throw
- **AND** the observation getter sends the datastream id as the `datastream` query parameter
- **AND** the datastreams getter sends a given system id as the `system` query parameter, and sends no such key when none is given
- **AND** the features getter passes through `truncated` from the payload

#### Scenario: Show one entity per placed system and report the stats `osh-029`
- **WHEN** the layer updates with the systems and the features
- **THEN** the map holds one entity with the id `osh:<id>` for each placed system, and none for a system with no `Point`
- **AND** `getStats()` reports `count`, `features`, `lastUpdate`, `error`, `keyRequired`, `stale`, `unplaced`, `truncated`, `partial`, `selectedId` and `selectedFeatureId`
- **AND** a failed systems fetch sets `error` and leaves the entities unchanged
- **AND** a `keyRequired` answer clears the entities
- **AND** `disable()` hides the data source, and only `destroy()` removes it

#### Scenario: Poll the datastreams of the selected system `osh-030`
- **WHEN** a click selects a system entity or a feature entity with a host
- **THEN** the layer reads the datastreams of that system through the datastreams getter with the `system` key, once
- **AND** it reads the newest observation of each, then again every 15 seconds
- **AND** it keeps only the records whose `systemId` equals the selected id
- **AND** a click that selects another system stops the first poll and starts a new one
- **AND** a click on empty space or on a non-OSH entity clears the selection and stops the poll

#### Scenario: Move the entity for the selected system's newest location `osh-031`
- **WHEN** a poll's newest observation for the selected system carries a location
- **THEN** the entity moves to that location
- **AND** an observation with no location leaves the entity where it was
- **AND** a later systems refresh does not move the entity back while that system stays selected

#### Scenario: Render the detail with escaped values `osh-032`
- **WHEN** `renderOshDetail(detail)` builds the system and datastream HTML
- **THEN** it escapes the characters `<`, `>`, `&` and `"` in every name and value
- **AND** when the selection came from a feature, the header shows the feature's name above the host's name
- **AND** the header shows the host's id when the host has no record, or `Host: —` when the feature has no host
- **AND** a host element given to the layer receives that HTML in `innerHTML`
- **AND** an empty selection clears the host

#### Scenario: Register the layer with a stable token `osh-033`
- **WHEN** the test reads the production layer registry
- **THEN** it has an entry `{id:'osh-systems', token:'o', disposition:'enabled-only'}`
- **AND** the registry has 17 entries, sorted by id
- **AND** `src/data/localLayers.js` includes the OSH systems layer

#### Scenario: Read the two lists per refresh, and stay correct when the features are unavailable `osh-046`
- **WHEN** the layer updates and the features getter throws
- **THEN** the layer places the systems it has, sets `partial:true`, and sets no `error`
- **AND** a server with no `Point` and no feature gives `count:0`, `features:0`, `error:null` and `partial:false`
- **AND** `truncated` is true when the features payload says so
- **AND** an update aborted before the two reads settle draws nothing from them

#### Scenario: Keep every system once seen, because the list samples `osh-049`
- **WHEN** a refresh returns a system list that omits a system an earlier refresh held
- **THEN** that system's record and its entity stay, and `getStats().count` does not fall
- **AND** a selection of that system, and its poll, stay across that refresh
- **AND** a refresh that names a system again with new fields updates its record in place
- **AND** only a `keyRequired` answer, `disable()` or `destroy()` empties the system map
- **AND** a feature absent from a refresh is removed, with its entity and any selection of it, because the feature list is stable

### Requirement: Synthetic fixtures
The OSH provider files, adapter files and test files MUST NOT contain a real server address or a captured payload.
Origin: spec-first

#### Scenario: Keep the OSH files free of a real address `osh-034`
- **WHEN** the test reads the provider files, the adapter files and the layer files as text
- **AND** it reads, as text, each test file whose name starts with `osh` or that sits in an `osh/` directory
- **THEN** every scheme-qualified address in them names `localhost` or a reserved `*.example` host
- **AND** the provider, adapter and layer files also have no dotted host with an explicit port, other than a `*.example` host
- **AND** those files have no IPv4 literal
- **AND** every system, datastream and feature fixture id starts with `sys-fixture-`, `ds-fixture-` or `foi-fixture-`
- **AND** `.env.example` has the three OSH keys, each with an empty value

## ADDED Requirements

### Requirement: Features of interest
The provider MUST serve the features of interest that carry a point. It MUST cache one snapshot per five-minute TTL, with the same walk rules and request form as the other lists. It MUST report when a walk stopped at its page cap.
Origin: spec-first

#### Scenario: Serve the feature list `osh-043`
- **WHEN** a client sends `GET /api/osh/fois`
- **THEN** the response names the fetch time, a stale flag, the TTL, the count, the truncated flag and the feature records
- **AND** the feature records are the ones `mapOshFois()` builds
- **AND** two requests inside the five-minute TTL cause one upstream walk, and concurrent requests share one
- **AND** a failed walk with an earlier snapshot answers that snapshot with `stale:true`
- **AND** a failed walk with no snapshot answers `502` with `{error:'upstream_failed'}`
- **AND** each recorded upstream call of the walk has method `GET`, no body and an `AbortSignal`
- **AND** the first page's query is `limit=200&f=application%2Fgeo%2Bjson`
- **AND** each recorded query equals its own `URLSearchParams` round trip
- **AND** the status route reports the features cache the way it reports the two lists

#### Scenario: Walk the feature list to its own page cap `osh-044`
- **WHEN** `oshPages()` walks a list with a `maxPages` option, or with none
- **THEN** it follows at most `maxPages` pages, with a default of 20, so the systems and the datastreams walks never request a 21st page
- **AND** the feature walk passes 60, so it never requests a 61st page
- **AND** the walk answers `{items, truncated}`, with `truncated:true` only when the page at the cap still named a next link
- **AND** a walk that stops for a refused link, or for no next link, answers `truncated:false`

### Requirement: Feature markers
The browser layer MUST show one entity for each feature of interest with a point. It MUST select the feature's host system when a click picks that entity.
Origin: spec-first

#### Scenario: Show one entity per feature and select its host on a click `osh-045`
- **WHEN** the layer updates with feature records
- **THEN** the map holds one entity with the id `osh-foi:<id>` for each feature, with a point
- **AND** the entity's label shows only within 200 km
- **AND** `getStats().features` counts the feature entities
- **AND** a click on a feature entity sets `selectedFeatureId` to the feature and `selectedId` to its host id
- **AND** that click starts the host's datastream poll, whether or not the host is in the systems list
- **AND** a click on a feature with a null host sets `selectedFeatureId`, leaves `selectedId` null, and starts no poll
- **AND** a click on empty space clears both, and a later refresh that drops the feature clears both
- **AND** the layer finds a feature record by id and by uid, and never fetches a feature by id
- **AND** the detail names the feature and its host

### Requirement: Datastreams of one system
The provider MUST serve the datastreams of one system from the per-system route when a `system` query value matches the id pattern. It MUST keep the origin, the path and the query of that URL fixed, and MUST refuse any other value with no upstream request.
Origin: spec-first

#### Scenario: Keep the system id to the pattern and the URL to its shape `osh-047`
- **WHEN** the `system` query value is absent with another key present, empty or repeated
- **AND** the test sends, on its own, one value from the rejection sets of `osh-020`
- **THEN** the response is `400` with `{error:'bad_system'}`, and the provider sends zero upstream requests
- **AND** for an accepted id such as `sys-fixture-1`, the built URL origin equals the resolved root's origin
- **AND** the built URL path equals the root path plus `systems/<id>/datastreams`, and the query is `limit=100`
- **AND** `assertSystemDatastreamsUrl()` throws for another origin, another prefix, an extra path segment or another query
- **AND** the route calls this fixed pair of functions directly, with no way for a caller to replace either one
- **AND** `mapOshFois()` keeps a `systemId` outside the pattern as null

#### Scenario: Serve the datastreams of one system, cached per id `osh-048`
- **WHEN** a client sends `GET /api/osh/datastreams?system=sys-fixture-1` and the upstream page walk succeeds
- **THEN** the response names the system id, the fetch time, a stale flag, the TTL, the count and the datastream records
- **AND** the datastream records are the ones `mapOshDatastreams()` builds
- **AND** each recorded upstream call is a `GET` with no body and an `AbortSignal`
- **AND** its query round-trips through `URLSearchParams`, and it carries no `f` key
- **AND** concurrent requests for one id share one walk, a second id causes its own, and a request inside five minutes sends none
- **AND** a failed walk serves the stale snapshot when one exists, and answers `502` with `{error:'upstream_failed'}` when none exists
- **AND** the cache keeps at most 256 ids
- **AND** a request with no `system` key serves the global list as `osh-016` says
- **AND** the status route reports the per-system cache size
