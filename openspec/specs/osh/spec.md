# osh Specification

## Purpose
Show the systems of a private OpenSensorHub server on the globe, with the newest observation of each datastream of the selected system. Let the browser read the server only through same-origin routes, so it never receives the credentials. Send only GET requests, because the account can create and delete streams.
## Requirements
### Requirement: Keyless behaviour
The provider MUST NOT contact the OpenSensorHub server when `OSH_URL` is not set or does not parse as a URL.
Origin: spec-first

#### Scenario: Report no key on the status route `osh-001`
- **WHEN** a client sends `GET /api/osh/status` and `OSH_URL` is not set
- **THEN** the response is `200` with `hasKey:false` and `base:{candidate:null, failures:[], probedAt:null}`
- **AND** the provider sends zero upstream requests

#### Scenario: Refuse the data routes with no key `osh-002`
- **WHEN** a client sends `GET` to any sub-path of `/api/osh` other than `status`, and `OSH_URL` is not set or is not a valid URL
- **THEN** the response is `503` with `{error:'no_key'}`, even for a sub-path the provider does not otherwise know
- **AND** the provider sends zero upstream requests

#### Scenario: Read the three keys at request time `osh-003`
- **WHEN** `OSH_URL` is set on the environment object after the provider is built, and a client then sends `GET /api/osh/systems`
- **THEN** the response uses the new value
- **AND** an earlier request with no `OSH_URL` still answered `503`

### Requirement: GET only
The provider MUST send only GET requests to the OpenSensorHub server, through one function, and MUST refuse a browser request whose method is not GET.
Origin: spec-first

#### Scenario: Send every upstream request as a recorded GET `osh-004`
- **WHEN** a client requests the systems, datastreams and observations routes, so that the base probe, the list fetch and the observation fetch each run
- **THEN** each recorded upstream call has method `GET`, no body and an `AbortSignal`

#### Scenario: Keep one upstream call site `osh-005`
- **WHEN** the test discovers every file that matches `server/providers/osh/*.js` and every file that matches `src/data/osh*.js`
- **AND** it reads, as text, `server/providers/osh.js`, the discovered files, and `server/providers/common/http.js`
- **THEN** the first discovered set is four files and the second is five files, both pinned counts
- **AND** only `server/providers/osh/get.js` contains a call to `fetch` or `fetchImpl`
- **AND** `get.js` sets `method: 'GET'` and `redirect: 'manual'` on that call
- **AND** no file has `post`, `put`, `patch` or `delete` as a quoted string, in any letter case, and no file has a `body:` key
- **AND** no file imports `node:http`, `node:https`, `undici` or `ws`
- **AND** every other file that sends an upstream request imports `oshGet` or `oshPages` from `./get.js` or `./osh/get.js`

#### Scenario: Refuse a non-GET browser request `osh-006`
- **WHEN** a client sends `POST`, `PUT`, `PATCH` or `DELETE` to any sub-path of `/api/osh`
- **THEN** the response is `405` with the header `Allow: GET`
- **AND** the provider sends zero upstream requests

### Requirement: Credentials
The provider MUST keep the OpenSensorHub URL and credentials on the server. It MUST send Basic authentication only when both the username and the password are set.
Origin: spec-first

#### Scenario: Send Basic authentication only when both values are set `osh-007`
- **WHEN** the provider sends an upstream request with `OSH_USERNAME` and `OSH_PASSWORD` both set, both unset, or with only one set
- **THEN** the request carries an `Authorization: Basic` header only in the both-set case

#### Scenario: Keep the URL and the credentials out of every response and log line `osh-008`
- **WHEN** the provider answers the status route, an error on any route, and a `400` for a refused datastream id, and it logs a warning
- **THEN** none of the three configured values appears in a response body or a log line
- **AND** the status response has no field whose value contains `://`

### Requirement: API root resolution
The provider MUST find the OpenSensorHub API root from a fixed list of three candidates, with GET probes only, once per process. It MUST report the name of the candidate that answered, never its URL.
Origin: spec-first

#### Scenario: Use the configured value when it answers with a system list `osh-009`
- **WHEN** the candidate built from `OSH_URL` answers `200` with a JSON body that has an array under `features` or `items`
- **THEN** the provider resolves the root to that candidate, named `root`, with one upstream probe
- **AND** the probe URL is the candidate plus `systems?limit=1&f=application%2Fgeo%2Bjson`
- **AND** the `f` value of that URL decodes to `application/geo+json`

#### Scenario: Try the next candidate after a miss `osh-010`
- **WHEN** the `root` candidate answers `404`, the `api` candidate answers `200` with a non-list body, and the `sensorhub-api` candidate answers `200` with a list
- **THEN** the provider probes the three candidates in that fixed order
- **AND** it resolves the root to `sensorhub-api`
- **AND** it records the two earlier misses with their status

#### Scenario: Probe once per process, and again after a change `osh-011`
- **WHEN** two requests for the systems route and one for the datastreams route arrive after the root resolves
- **THEN** the provider sends exactly one probe pass, shared by concurrent first requests
- **AND** a later request with a changed `OSH_URL` starts one new probe pass

#### Scenario: Report failure when every candidate misses `osh-012`
- **WHEN** every candidate misses, and a client later requests a data route within 60 seconds of that failed pass
- **THEN** the status route reports `candidate:null` with the three failures
- **AND** a data route answers `502` with `{error:'auth_failed'}` when a failure carries status `401` or `403`, else `{error:'base_unresolved'}`
- **AND** no new probe runs inside the 60-second hold, and one runs after it

### Requirement: Upstream safety
The provider MUST NOT follow a redirect, and MUST stay on the resolved root's origin when it walks a page link. A next link MUST name a later page of the same request, never a different request. It MUST cap the response body size and the request time of each upstream call.
Origin: spec-first

#### Scenario: Refuse a redirect `osh-013`
- **WHEN** an upstream response has a status between 300 and 399
- **THEN** the request fails, with exactly one upstream call for that request
- **AND** a redirect seen during the base probe counts as a miss for that candidate

#### Scenario: Follow a next link only on the same origin, at most 20 pages `osh-014`
- **WHEN** the provider walks a systems or datastreams page, whether or not it carries `links` with a `rel:'next'` entry
- **THEN** the provider follows it only when its resolved origin equals the root's origin
- **AND** it follows at most 20 pages, so it never requests a 21st page
- **AND** it stops when there is no next link, or the link's `href` fails to parse
- **AND** a page with a status outside 200 to 299 stops the walk with an error

#### Scenario: Follow a next link only as a later page of the same request `osh-036`
- **WHEN** a page names a next link
- **THEN** the provider follows it only when its origin equals the resolved root's origin, even when the link is protocol-relative with the same path
- **AND** it follows the link only when its path equals the current page's path
- **AND** it refuses the link when it carries a username or a password
- **AND** it follows the link only when its query has no key outside `limit`, `offset`, `cursor`, `page`, `startIndex` and `f`
- **AND** it refuses the link when it carries a fragment
- **AND** the provider refuses a link with a query key such as `_method` the same way, because that key is outside the list
- **AND** a refused link stops the walk without an error, and keeps the items the walk already gathered
- **AND** the request for an accepted link carries a query that the provider builds from the values of the candidate's allowed keys
- **AND** the query that the provider builds keeps a separator such as `;` inside one value as text, and never as a second key

#### Scenario: Stop for a body over the cap or a request past the timeout `osh-015`
- **WHEN** an upstream response declares a `Content-Length` above the byte cap, or a request runs past its timeout
- **THEN** the request fails
- **AND** an oversized declared body is never read or parsed

### Requirement: List cache
The provider MUST serve the systems and the datastreams lists from one cached snapshot per five-minute TTL. It MUST share one upstream refresh between concurrent requests. It MUST serve the stale snapshot when the server fails.
Origin: spec-first

#### Scenario: Serve the cached list inside the TTL `osh-016`
- **WHEN** two requests for the same list route arrive inside the five-minute TTL
- **THEN** only the first causes an upstream page walk, and both responses have `stale:false`
- **AND** the provider keeps the systems cache and the datastreams cache apart

#### Scenario: Share one refresh between concurrent requests `osh-017`
- **WHEN** two requests for the same list route arrive while no cached snapshot is fresh
- **THEN** the provider sends only one upstream page walk for both

#### Scenario: Serve the stale list on failure, and 502 with none `osh-018`
- **WHEN** a list refresh fails and a snapshot from an earlier pass exists
- **THEN** the response carries that snapshot with `stale:true`
- **AND** a refresh failure with no earlier snapshot answers `502` with `{error:'upstream_failed'}`

#### Scenario: Answer 404 for an unknown sub-path `osh-019`
- **WHEN** `OSH_URL` is set, and a client sends `GET` to a sub-path of `/api/osh` other than `status`, `systems`, `datastreams` or `observations`
- **THEN** the response is `404` with `{error:'not_found'}`

### Requirement: Datastream id boundary
The provider MUST accept a `datastream` query value only when it matches the datastream id pattern. It MUST keep the origin, the path prefix and the query of the observations URL fixed. The pattern is `^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$`.
Origin: spec-first

#### Scenario: Refuse a datastream id outside the pattern `osh-020`
- **WHEN** the `datastream` query value is absent, empty or repeated
- **AND** the test sends, on its own, one value from this set: `../systems`, `..%2Fsystems`, `https://osh.example/x`, `//osh.example/x`, `http:x`, `javascript:x`
- **AND** the test sends, on its own, one value from this set: `a?limit=1`, `a&limit=1`, `a#f`, `a/b`, `a%2Fb`, `a.b`, `a b`, a 65-character value
- **THEN** the response is `400` with `{error:'bad_datastream'}`
- **AND** the provider sends zero upstream requests

#### Scenario: Keep the built observation URL to its fixed shape `osh-021`
- **WHEN** the provider builds the observations URL for an accepted id such as `ds-fixture-1` or `A_b-9`
- **THEN** the URL origin equals the resolved root's origin, the path equals the root path plus `datastreams/<id>/observations`, and the query is the fixed query
- **AND** a safety check on the built URL throws for another origin, another prefix, an extra path segment or another query
- **AND** the route calls this fixed pair of functions directly, with no way for a caller to replace either one

### Requirement: Newest observation
The provider MUST serve the newest observation of one datastream, cached for 15 seconds.
Origin: spec-first

#### Scenario: Serve the newest observation of a datastream `osh-022`
- **WHEN** a client sends `GET /api/osh/observations?datastream=ds-fixture-1` for an id whose upstream call succeeds
- **THEN** the response names the datastream, the fetch time, a stale flag, the TTL and an observation built from the newest item
- **AND** an empty upstream item list gives `observation:null`
- **AND** a non-2xx upstream status gives `502` with `{error:'observation_failed', upstreamStatus}`

#### Scenario: Cache the newest observation per datastream `osh-023`
- **WHEN** concurrent requests name the same datastream id, and other requests name a second id
- **THEN** the same-id requests share one upstream call, inside a 15-second TTL, and the second id causes its own call
- **AND** a failed refresh serves the stale value when one exists
- **AND** the cache keeps at most 256 ids, and drops the oldest past that cap

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
- **WHEN** `mapOshFois()` reads a payload with a list under `features` or `items`
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
- **AND** a failure while the layer places or draws the entities also sets `error`, and the update resolves to `false`
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
- **AND** a features getter that resolves `keyRequired:true` alone gives an empty feature list, with `partial:false` and no `error`
- **AND** an update aborted before the two reads settle draws nothing from them

#### Scenario: Keep every system once seen, because the list samples `osh-049`
- **WHEN** a refresh returns a system list that omits a system an earlier refresh held
- **THEN** that system's record and its entity stay, and `getStats().count` does not fall
- **AND** a selection of that system, and its poll, stay across that refresh
- **AND** a refresh that names a system again with new fields updates its record in place
- **AND** only a `keyRequired` answer or `destroy()` empties the system map; `disable()` does not
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

### Requirement: Installation
The provider MUST install the same middleware for the dev server and the preview server.
Origin: spec-first

#### Scenario: Install identical middleware on both server hooks `osh-035`
- **WHEN** `configureServer` and `configurePreviewServer` each run against a fake server object
- **THEN** each installs the same `/api/osh` middleware, and it answers a request the same way

### Requirement: Query construction
The provider MUST build the query of every upstream list URL from named keys and values with `URLSearchParams`. It MUST NOT write a URL with a literal query, and MUST NOT write a query value with a hand-encoded byte.
Origin: spec-first

#### Scenario: Build every list URL from parts `osh-037`
- **WHEN** the provider builds the URL of the base probe, the systems list or the datastreams list
- **THEN** `oshListUrl(root, path, query)` gives a URL on the root's origin, with the root's path plus `path`, and a query of the `URLSearchParams` form of `query`
- **AND** `oshListUrl()` throws when the built URL leaves the root's origin or the root's path
- **AND** a value with `+`, `/`, `&` or a space reaches the query as `%2B`, `%2F`, `%26` or `+`
- **AND** the probe query is `limit=1&f=application%2Fgeo%2Bjson`, the systems query is `limit=100&f=application%2Fgeo%2Bjson` and the datastreams query is `limit=100`
- **AND** `OSH_LIST_FORMAT` is `application/geo+json`

#### Scenario: Send each upstream query in its canonical form `osh-038`
- **WHEN** a client requests the systems, datastreams and observations routes, so that the probe, the two list fetches and the observation fetch each run
- **THEN** the query of each recorded upstream URL equals its own `URLSearchParams` round trip, byte for byte
- **AND** each recorded URL with an `f` key decodes that key to `application/geo+json`
- **AND** no decoded query value holds a space

#### Scenario: Keep the provider files free of a literal query `osh-039`
- **WHEN** the test reads, as text, `server/providers/osh.js` and the four files that `osh-005` discovers under `server/providers/osh/`, with comments removed
- **THEN** no quoted string in those files holds a `key=value` pair whose value has `+`, `%`, `#` or a space
- **AND** no quoted string in those files holds `?` followed by a `key=value` pair

#### Scenario: Keep the provider's own format on a walked next-page link `osh-040`
- **WHEN** a next-page link carries an `f` key, omits it, or carries it twice
- **THEN** the walked request's `f` value is `OSH_LIST_FORMAT`, written once, when the current page asked for one
- **AND** the walked request carries no `f` key at all when the current page asked for none
- **AND** that format holds across every later page of the same walk, and the walk never takes that format from a link
- **AND** the query reaches the wire as `application%2Fgeo%2Bjson`, even when a link's raw value holds a literal `+`

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
- **THEN** it follows at most `maxPages` pages, with a default of 20
- **AND** the systems and the datastreams walks pass no `maxPages` value, so neither ever requests a 21st page
- **AND** the feature walk passes 60, so it never requests a 61st page
- **AND** the walk answers `{items, truncated}`, with `truncated:true` only when the page at the cap still named a next link
- **AND** a walk that stops for a refused link, or for no next link, answers `truncated:false`

### Requirement: Feature entities
The browser layer MUST show one entity for each feature of interest with a point. It MUST select the feature's host system when a click picks that entity.
Origin: spec-first

#### Scenario: Show one entity per feature and select its host on a click `osh-045`
- **WHEN** the layer updates with feature records
- **THEN** the map holds one entity with the id `osh-foi:<id>` for each feature, with a point
- **AND** the entity's label shows only within 200 km
- **AND** a feature with no name gets no label
- **AND** `getStats().features` counts the feature entities
- **AND** a click on a feature entity sets `selectedFeatureId` to the feature and `selectedId` to its host id
- **AND** that click starts the host's datastream poll, whether or not the host is in the systems list
- **AND** a click on a feature with a null host sets `selectedFeatureId`, leaves `selectedId` null, and starts no poll
- **AND** a click on empty space clears `selectedFeatureId` and `selectedId`
- **AND** a later refresh that drops the feature also clears `selectedFeatureId` and `selectedId`
- **AND** the layer finds a feature record by id and by uid, and never fetches a feature by id
- **AND** the detail names the feature and its host

### Requirement: Datastreams of one system
The provider MUST serve the datastreams of one system from the per-system route when a `system` query value matches the id pattern. It MUST keep the origin, the path and the query of that URL fixed, and MUST refuse any other value with no upstream request.
Origin: spec-first

#### Scenario: Keep the system id to the pattern and the URL to its shape `osh-047`
- **WHEN** the `system` query key is present, with a value that is empty, repeated, or outside the id pattern
- **AND** the test sends, on its own, one value from the rejection sets of `osh-020`
- **THEN** the response is `400` with `{error:'bad_system'}`, and the provider sends zero upstream requests
- **AND** for an accepted id such as `sys-fixture-1`, the built URL origin equals the resolved root's origin
- **AND** the built URL path equals the root path plus `systems/<id>/datastreams`, and the query is `limit=100`
- **AND** `assertSystemDatastreamsUrl()` throws for another origin, another prefix, an extra path segment or another query
- **AND** the route calls this fixed pair of functions directly, with no way for a caller to replace either one
- **AND** `mapOshFois()` keeps a `systemId` outside the pattern as null
- **AND** an absent `system` key is not a refusal: the route serves the global list and `readSystemId()` answers null

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

