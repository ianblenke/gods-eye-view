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
The provider MUST send only GET requests to the OpenSensorHub server, through one file, and MUST refuse a browser request whose method is not GET.
Origin: spec-first

#### Scenario: Send every upstream request as a recorded GET `osh-004`
- **WHEN** a client requests the systems, datastreams, observations and live routes, so that each upstream call runs
- **THEN** each recorded fetch call has method `GET`, no body and an `AbortSignal`
- **AND** `oshOpenStream()` passes the URL and an option object with only `headers`, so the handshake is a GET with no body

#### Scenario: Keep one upstream call site `osh-005`
- **WHEN** the test discovers every file that matches `server/providers/osh/*.js` and every file that matches `src/data/osh*.js`
- **AND** it reads, as text, `server/providers/osh.js`, the discovered files, and `server/providers/common/http.js`
- **THEN** the first discovered set is five files and the second is six files, both pinned counts
- **AND** only `server/providers/osh/get.js` contains a call to `fetch`, `fetchImpl` or `WebSocket`
- **AND** `get.js` sets `method: 'GET'` and `redirect: 'manual'` on the fetch call
- **AND** no file has `post`, `put`, `patch` or `delete` as a quoted string, in any letter case, and no file has a `body:` key
- **AND** no file imports `node:http`, `node:https`, `undici` or `ws`
- **AND** no scanned file uses the word `send` outside a comment, so the provider sends no message frame to the server
- **AND** every other file that sends an upstream request imports `oshGet`, `oshPages` or `oshOpenStream` from `./get.js` or `./osh/get.js`

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

#### Scenario: Keep the newest-per-feature URL to its fixed shape `osh-054`
- **WHEN** the provider builds the newest-per-feature URL for an accepted id
- **THEN** the path equals the root path plus `datastreams/<id>/observations` and the query is the fixed newest-per-feature query, from its own named constants
- **AND** the safety check throws for another origin, another prefix, an extra path segment or another query
- **AND** the location pass calls this fixed pair directly, and no browser value reaches it

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

#### Scenario: Carry the age of every observation `osh-050`
- **WHEN** the observations route answers with an observation
- **THEN** the observation carries `ageMs`, the provider's clock at serve time minus the parsed `phenomenonTime`, computed by the route and never stored in the cache
- **AND** a second answer served from the same cached snapshot later carries a larger `ageMs`
- **AND** an absent or unparsed `phenomenonTime` gives `ageMs:null`
- **AND** `oshObservationAgeMs()` and `isOshObservationFresh()` read no clock of their own and hold no state
- **AND** an observation is fresh when `ageMs` is a finite number at or under `OSH_FRESH_MAX_AGE_MS`, which is one hour
- **AND** `ageMs:null` is an unknown age, and an unknown age is never fresh
- **AND** a small negative `ageMs` is fresh, down to `OSH_CLOCK_SKEW_MAX_MS`, five minutes, because the OpenSensorHub server's clock leads the provider's clock
- **AND** an `ageMs` further below zero than that is not fresh, because a record from far ahead of the clock is wrong, not new
- **AND** the route serves a negative `ageMs` when the `phenomenonTime` is ahead of the injected `now`
- **AND** the browser source passes `ageMs` through unchanged and computes no age

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
- **WHEN** the extractor reads a result record with a reader from `readOshSchemaLocation()`
- **THEN** it walks the reader's paths into the result and reads the latitude, the longitude and the height by the paths the reader gives
- **AND** a value counts only when `Number(value)` is finite, so the text `NaN`, an empty string and null all fail
- **AND** a bad or absent height gives `alt:null` and keeps a good latitude and longitude
- **AND** a null reader, a bad latitude or longitude, a latitude past 90 degrees or a longitude past 180 degrees gives null
- **AND** it never reads a value by a guessed key name, and never reads `geometry.coordinates`

#### Scenario: Map a feature-of-interest list to feature records `osh-041`
- **WHEN** `mapOshFois()` reads a payload with a list under `features` or `items`
- **THEN** each record keeps `id`, `uid`, `systemId`, `name`, `description`, `validTime`, `lon`, `lat` and `alt`
- **AND** `systemId` is the last path segment of `hostedProcedure@link.href` only when the segment before it is `systems`, else null
- **AND** the mapper skips a feature with no string id, with no `Point`, or with a coordinate that is not finite
- **AND** a repeated id keeps the first record only
- **AND** a malformed payload maps to an empty list

#### Scenario: Place the systems and the features from their sources `osh-042`
- **WHEN** `placeOshEntities({systems, fois, locations})` reads the three lists
- **THEN** a system with a `Point` gives a placed system at its coordinates with `locationSource:'geometry'`
- **AND** a system with no `Point` and no fresh location gives no placed system and adds one to `unplaced`
- **AND** every feature record gives a placed feature at its own point with its `systemId`
- **AND** a location whose `ageMs` is not fresh under `isOshObservationFresh()` is dropped before any other rule
- **AND** a fresh location whose `foiId` or `foiUid` names a held feature moves that feature with `locationSource:'stream'`
- **AND** a feature that a location moves also carries the location's `datastreamId`, `datastreamName`, `phenomenonTime` and `ageMs`
- **AND** a fresh location that names a feature the layer does not hold draws that feature, as `osh-058` says
- **AND** that location never places its system
- **AND** a fresh location with no feature reference places its system with `locationSource:'stream'`, the datastream id and name, `phenomenonTime` and `ageMs`
- **AND** that placement stands in place of that system's `Point`
- **AND** the layer places the newer of two such locations for one system
- **AND** a fresh location whose system has no record still gives a placed system with `name:null`
- **AND** a feature never places its host system, and a system never places a feature

#### Scenario: Read the location fields from a schema `osh-051`
- **WHEN** `readOshSchemaLocation(schema)` reads the record at `resultSchema`, walking `fields` to a depth of four
- **AND** it walks a `Vector` field's `coordinates`
- **THEN** for a `Vector` whose coordinates carry `axisID` `Lat` and `Lon` with unit code `deg`, it binds `lat` and `lon` by axis id
- **AND** it never binds `lat` or `lon` by list position
- **AND** it binds `alt` to a coordinate with axis id `h` and unit code `m`
- **AND** a `Vector` with `Lat` and `Lon` axis ids and no `referenceFrame` binds; a present frame must resolve to EPSG 4979 or EPSG 4326
- **AND** any other frame, or axis ids outside `Lat`, `Lon` and `h` such as `X`, `Y` and `Z`, gives null
- **AND** it reads a definition's last term after the last `/`, `#` or `:`, in lower case
- **AND** for two `Quantity` fields with unit code `deg` whose last term reads `latitude` and `longitude`, it binds each field's path
- **AND** it binds a height only to a `Quantity` in `m` whose last term reads `heighthae`, `heightaboveellipsoid` or `ellipsoidalheight`, never `altitudemsl`
- **AND** it takes the `Vector` shape when a schema has both, and binds `featureUid` to a `Text` field whose definition's last term reads `samplingfeatureuid`
- **AND** it takes every field's path from the schema itself, so a `Vector` named one way, and one named another, give the same reader
- **AND** it gives null when the latitude or the longitude is absent, or when the unit code of either is not `deg`
- **AND** it gives null when the body has no `resultSchema`

#### Scenario: Map a page of newest-per-feature records to location records `osh-052`
- **WHEN** `mapOshLocationPage(payload, reader, nowMs)` reads a page of newest-per-feature records
- **THEN** each item gives a feature reference, the two times, a location and an age
- **AND** the feature reference and the location are both null when absent
- **AND** `location` comes from `extractOshLocation()` and the age from the age function this project's freshness change adds, computed with `nowMs`
- **AND** an item with no location is kept with a null one, and a malformed payload gives an empty list
- **AND** the order of the page is kept, newest first as the server answers it

#### Scenario: Add a feature that the layer does not hold, from its fresh location alone `osh-058`
- **WHEN** `placeOshEntities({systems, fois, locations})` reads a fresh location whose `foiId` and `foiUid` name no held feature
- **THEN** `features` gains one placed feature at the location's `lon`, `lat` and `alt`, with `locationSource:'stream'`
- **AND** that feature's `id` is the location's `foiId`, or its `foiUid` when the location carries no `foiId`
- **AND** that feature takes `uid` from the location's `foiUid` and `systemId` from the location's `systemId`, and has null for `name`, `description` and `validTime`
- **AND** that feature carries the location's `datastreamId`, `datastreamName`, `phenomenonTime` and `ageMs`, the same fields a stream-placed system carries
- **AND** `systems` and `unplaced` are the same as with no such location, so the location never places its system
- **AND** two fresh locations that name one such feature give one placed feature, at the newer location
- **AND** a location that is not fresh, or that names a held feature, gives no such placed feature
- **AND** `placeOshEntities()` keeps no state between two calls, so a second call with no such location gives no such feature

### Requirement: Systems layer
The browser layer MUST show one entity for each system with a point location. It MUST poll the datastreams and the newest observation of the selected system. It MUST report its state through `getStats()`.
Origin: spec-first

#### Scenario: Report key required from the browser source `osh-028`
- **WHEN** the browser source calls the systems, datastreams, features, locations or observation getter and the server answers `503` with `{error:'no_key'}`
- **THEN** the getter resolves to `keyRequired:true`
- **AND** another non-ok status, or a payload without the expected field, makes the getter throw
- **AND** the observation getter sends the datastream id as the `datastream` query parameter
- **AND** the datastreams getter sends a given system id as the `system` query parameter, and sends no such key when none is given
- **AND** the features getter forwards `truncated` from the payload
- **AND** the locations getter forwards `locations` and `failed` from the payload, and sends no query

#### Scenario: Show one entity per placed system and report the stats `osh-029`
- **WHEN** the layer updates with the systems and the features
- **THEN** the map holds one entity with the id `osh:<id>` for each placed system
- **AND** the map holds no entity for a system with no `Point` and no fresh location
- **AND** `getStats()` reports `count`, `features`, `lastUpdate`, `error`, `keyRequired`, `stale`, `unplaced`, `truncated`, `partial`, `selectedId`, `selectedFeatureId` and `placed`
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
- **THEN** the layer moves the entity to that location only when the observation is fresh
- **AND** the layer leaves the entity in place when `ageMs` is above `OSH_FRESH_MAX_AGE_MS`, or below `-OSH_CLOCK_SKEW_MAX_MS`, or null
- **AND** an observation with no location leaves the entity where it was
- **AND** a later systems refresh does not move the entity back while that system stays selected

#### Scenario: Render the detail with escaped values `osh-032`
- **WHEN** `renderOshDetail(detail)` builds the system and datastream HTML
- **THEN** it escapes the characters `<`, `>`, `&` and `"` in every name and value
- **AND** when the selection came from a feature, the header shows the feature's name above the host's name
- **AND** the header shows the host's id when the host has no record, or `Host: —` when the feature has no host
- **AND** each datastream block shows the observation's age below its time, in words such as `12 s`, `5 min`, `3 h` or `6 d`
- **AND** a negative `ageMs` within `OSH_CLOCK_SKEW_MAX_MS` reads `0 s`
- **AND** an `ageMs` below `-OSH_CLOCK_SKEW_MAX_MS` reads `ahead of the clock`, and never reads `old`
- **AND** a block whose observation is not fresh carries the class `osh-detail-old`
- **AND** a block whose age is a number past `OSH_FRESH_MAX_AGE_MS` also carries the text `old`
- **AND** a block with `ageMs:null` reads `age unknown`, and never reads `old`
- **AND** when the system is placed by a stream, the header shows `Placed by` with the datastream's name and the age in the same words
- **AND** when the selected feature is placed by a stream, its header shows the same `Placed by` line for the location that placed it
- **AND** a feature header never shows the host's name in place of the feature's name
- **AND** the header shows the system's id as its name when it has none
- **AND** a host element given to the layer receives that HTML in `innerHTML`
- **AND** an empty selection clears the host

#### Scenario: Register the layer with a stable token `osh-033`
- **WHEN** the test reads the production layer registry
- **THEN** it has an entry `{id:'osh-systems', token:'o', disposition:'enabled-only'}`
- **AND** the registry has 17 entries, sorted by id
- **AND** `src/data/localLayers.js` includes the OSH systems layer

#### Scenario: Read the three lists per refresh, and stay correct when the features or the locations are unavailable `osh-046`
- **WHEN** the layer updates and the features getter or the locations getter throws
- **THEN** the layer places what it has from the other sources, sets `partial:true`, and sets no `error`
- **AND** a server with no `Point`, no feature and no location gives `count:0`, `features:0`, `error:null` and `partial:false`
- **AND** `truncated` is true when the features payload says so
- **AND** a features getter that resolves `keyRequired:true` alone gives an empty feature list, with `partial:false` and no `error`
- **AND** a locations getter that resolves `keyRequired:true` alone gives an empty location list, with `partial:false` and no `error`
- **AND** an update aborted before the three reads settle draws nothing from them
- **AND** the layer sends no candidate of its own to the locations getter, and never walks a sampled list to find one

#### Scenario: Keep every system once seen, because the list samples `osh-049`
- **WHEN** a refresh returns a system list that omits a system an earlier refresh held
- **THEN** that system's record and its entity stay, and `getStats().count` does not fall
- **AND** a selection of that system, and its poll, stay across that refresh
- **AND** a refresh that names a system again with new fields updates its record in place
- **AND** only a `keyRequired` answer or `destroy()` empties the system map; `disable()` does not
- **AND** a feature absent from a refresh is removed, with its entity and any selection of it, because the feature list is stable

#### Scenario: Place a system from a fresh stream record, and retire it when its record is no longer fresh `osh-057`
- **WHEN** a refresh brings a fresh location with no feature reference for a system
- **THEN** the map holds the entity `osh:<id>` for that system with `locationSource:'stream'`, and `getStats().placed.stream` counts it
- **AND** a system with no record in the union map gets that entity with the `systemName` the location carries
- **AND** that system also gets a placeholder record, one that never enters the union map
- **AND** only a location with `systemName:null` gives the id as the label
- **AND** the selected system's own poll moves its entity as `osh-031` says, unchanged
- **AND** a refresh with no fresh location for that system removes the entity and counts the system under `unplaced`
- **AND** a selected system is the one exception: its entity stays at its last position until deselected
- **AND** that exception governs the entity only
- **AND** the system still counts under `unplaced`, because no fresh location named it
- **AND** a fresh location that names a feature by id or uid moves that feature entity and never places the system
- **AND** a fresh location that names a feature the layer does not hold draws that feature entity, as `osh-059` says, and never places the system
- **AND** a click on a stream-placed entity selects it and starts its datastream poll as for any system

### Requirement: Synthetic fixtures
The OSH provider files, adapter files and test files MUST NOT contain a real server address or a captured payload.
Origin: spec-first

#### Scenario: Keep the OSH files free of a real address `osh-034`
- **WHEN** the test reads the provider files, the adapter files and the layer files as text
- **AND** it reads, as text, each test file whose name starts with `osh` or that sits in an `osh/` directory
- **THEN** every scheme-qualified address in them names `localhost`, a reserved `*.example` host, or one of the two vocabulary hosts `www.opengis.net` and `sensorml.com`
- **AND** every `urn:osh:def:` string in them has `fixture` as its vendor segment
- **AND** the provider, adapter and layer files also have no dotted host with an explicit port, other than a `*.example` host
- **AND** those files have no IPv4 literal
- **AND** every system, datastream and feature fixture id starts with `sys-fixture-`, `ds-fixture-` or `foi-fixture-`
- **AND** `.env.example` has the three OSH keys and `OSH_LOCATION_PROPERTIES`, each with an empty value

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
- **WHEN** the test reads, as text, `server/providers/osh.js` and the five files that `osh-005` discovers under `server/providers/osh/`, with comments removed
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

#### Scenario: Show one entity per stream-drawn feature, and remove it when its location is no longer fresh `osh-059`
- **WHEN** the layer updates with a fresh location that names a feature the layer does not hold
- **THEN** the map holds the entity `osh-foi:<id>` for that feature at the location's position, where `<id>` is the placed feature's `id`
- **AND** that location adds no entity `osh:<systemId>` for its system, and adds nothing to `getStats().placed.stream`
- **AND** a system with no `Point` that only such a location names still counts under `unplaced`
- **AND** the entity gets no label, because the feature has no name
- **AND** the location's `systemName` never replaces the feature's name, on the label or in the detail, because one host has many features
- **AND** the layer draws one entity per fresh unheld feature, so three such features of one host at one position give three entities
- **AND** the layer applies no cap to the stream-drawn features, and does not group them by host or by position
- **AND** `getStats().features` counts the entity, and `getStats().placed.streamFeatures` counts only the stream-drawn features
- **AND** a held feature that a fresh location moves is not counted under `placed.streamFeatures`
- **AND** a click on the entity sets `selectedFeatureId` to the feature and `selectedId` to the location's `systemId`, and starts that host's datastream poll
- **AND** the detail for that selection shows the feature's id in place of its name, and shows its host
- **AND** that detail shows `Placed by` with the datastream's name and the location's age
- **AND** a refresh with no fresh location for that feature removes the entity and clears any selection of it
- **AND** the layer keeps no record of a stream-drawn feature after a refresh or after `destroy()`

#### Scenario: Keep one entity for a feature across a failed features read `osh-060`
- **WHEN** one refresh holds a feature and a fresh location whose `foiId` is the feature's `id`
- **AND** the second refresh has a features getter that throws, with the same location, and a third refresh holds the feature again
- **AND** a fourth refresh has a features getter that throws and no fresh location for that feature
- **THEN** all three first refreshes hold the one entity `osh-foi:<id>` at the location's position
- **AND** in the first and the third refresh the entity has the feature's name as its label, with `partial:false` and `placed.streamFeatures` at zero
- **AND** in the second refresh the entity has no label, `partial` is true, and `placed.streamFeatures` counts it
- **AND** the fourth refresh removes the entity
- **AND** the layer places the stream-drawn feature the same way whether the features read failed or the feature list has no such feature

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

#### Scenario: Keep the built schema URL and system URL to their fixed shapes `osh-053`
- **WHEN** the provider builds the schema URL for an accepted datastream id such as `ds-fixture-1`
- **AND** it builds the system URL for an accepted system id such as `sys-fixture-1`
- **THEN** each URL's origin equals the resolved root's origin, its path equals the root path plus `datastreams/<id>/schema` or `systems/<id>`, and its query is empty
- **AND** the safety check for each throws for another origin, another prefix, an extra path segment, or any query
- **AND** the schema cache and the system cache each call their fixed pair directly, with no way for a caller to replace either one
- **AND** no browser value reaches either fixed pair

### Requirement: Location discovery
The provider MUST find candidate location datastreams from stable surfaces only. These are the datastreams list filtered by a declared property, the datastreams of each feature host, and the datastreams of each system with a point. It MUST let the schema decide whether a candidate carries a location. It MUST NOT walk a sampled list to find one.
Origin: spec-first

#### Scenario: Serve the candidate datastreams of each declared property `osh-055`
- **WHEN** the location pass reads the property filter
- **THEN** it sends one list request per URI in the built-in property list, built with the query keys `limit` and `observedProperty`
- **AND** each request is walked by the shared walk and cached per URI for the list TTL
- **AND** the built-in list holds two public terms, and an environment value appends comma-separated URIs to it
- **AND** a value that does not parse as a URL or a URN scheme, or that holds white space, is skipped
- **AND** the skip carries a warning that names only the value's position, never its text
- **AND** no response of any route carries a URI of the list
- **AND** the status route reports their count
- **AND** a candidate found only by the filter, whose system is in no systems snapshot, is served like any other

#### Scenario: Serve the newest location of every candidate datastream `osh-056`
- **WHEN** a client sends `GET /api/osh/locations`
- **THEN** the provider unites the candidates of the property filter, of every feature host's datastreams and of every `Point` system's datastreams
- **AND** it reads each candidate's schema through a per-id cache with the list TTL, one shared refresh and a stale value on failure
- **AND** that schema cache keeps at most 256 ids
- **AND** it reads one newest-per-feature page for each candidate whose schema gave a reader
- **AND** it answers the fetch time, a stale flag, the TTL, the count, the stream count and the failed count
- **AND** it also answers the location list
- **AND** each location names its system, its system's name, its datastream, its feature reference, its position, its time and its age
- **AND** the system's name comes from the systems snapshot when it holds the system, else from one by-id read cached per id
- **AND** that name is null when the read fails or the record has no name, and a failed name read never drops the location
- **AND** a candidate with no reader, or whose page read fails, gives no location and adds one to the failed count
- **AND** every schema URL and every page URL of the pass goes through its fixed pair of functions
- **AND** the pass sits behind a fifteen-second cache with one shared refresh and a stale snapshot on failure
- **AND** with no candidate at all it answers a zero count and sends no schema and no page request

### Requirement: Entity depth and horizon
The browser layer MUST draw every system entity and every feature entity on top of the terrain and the mesh, at the entity's record altitude. It MUST hide an entity that sits beyond the ellipsoid horizon from the camera.
Origin: spec-first

#### Scenario: Draw every entity on top of the terrain, at its own altitude `osh-061`
- **WHEN** the layer draws a system entity, a feature entity, or the entity it re-adds for a selected system
- **THEN** the entity's point carries `disableDepthTestDistance` equal to positive infinity
- **AND** a label on that entity carries `disableDepthTestDistance` equal to positive infinity
- **AND** the point and the label carry `heightReference` equal to `NONE`
- **AND** the entity's position keeps the altitude its record carries, so a record with `alt:100` sits 100 metres above the ellipsoid
- **AND** the entity the layer moves for a fresh observation keeps that observation's altitude in the same way

#### Scenario: Hide an entity beyond the horizon `osh-062`
- **WHEN** the camera's `moveEnd` event fires, or a refresh draws the entities, or the poll moves the selected entity
- **THEN** each system entity and each feature entity beyond the ellipsoid horizon from the camera has `show:false`
- **AND** each entity inside the horizon has `show:true`
- **AND** a later `moveEnd` from a camera that sees a hidden entity restores `show:true`
- **AND** a refresh under a camera that has not moved hides a newly drawn entity beyond the horizon, before any `moveEnd`
- **AND** a poll move that carries the selected entity beyond the horizon hides it, and a later move that brings it back shows it
- **AND** the layer adds one `moveEnd` listener at `init()`, keeps it while the layer is off, and removes it at `destroy()`

### Requirement: Live observations
The provider MUST relay the live observations of one datastream as server-sent events, from one upstream WebSocket for each datastream. The handshake MUST be a GET, and the provider MUST send no message frame to the server. The layer MUST update the detail of the selected system from the stream, and MUST poll a datastream whose stream is not open.
Origin: spec-first

#### Scenario: Refuse the live route with no key, a bad id or a wrong method `osh-063`
- **WHEN** a client requests `/api/osh/live` with no key set, with a bad `datastream` value, or with a method other than GET
- **THEN** the answer is `503` with `{error:'no_key'}` for no key, and `400` with `{error:'bad_datastream'}` for a bad id
- **AND** the answer is `405` with the header `Allow: GET` for a wrong method
- **AND** a bad id is a value outside the pattern of `osh-020`
- **AND** in each of the three cases the provider opens no upstream socket

#### Scenario: Build the live URL to its fixed shape `osh-064`
- **WHEN** the provider builds the live URL for a datastream id and a resolved root
- **THEN** the URL has the scheme `ws` for an `http` root and `wss` for an `https` root
- **AND** the URL has the host and the port of the root, and the path `datastreams/<id>/observations`
- **AND** the URL has the query `f` with the value `application/om+json`, written as `application%2Fom%2Bjson`
- **AND** the URL has no user name and no password, and this holds when the root has them
- **AND** `assertLiveUrl()` throws for another scheme, host, port, path, query, user name, password or fragment

#### Scenario: Open one upstream WebSocket as a GET and send no message frame `osh-065`
- **WHEN** a client opens the live route for a datastream with the key set
- **THEN** the provider opens one upstream WebSocket with `binaryType` set to `arraybuffer`, and the handshake is a GET request
- **AND** the handshake carries `Authorization: Basic` only when both credentials are set, as `osh-007` says
- **AND** the provider sends no message frame to the upstream server
- **AND** the runtime sends only control frames: a pong for each ping, and a close frame when a socket closes
- **AND** the response has the type `text/event-stream`, `Cache-Control: no-store` and `X-Accel-Buffering: no`

#### Scenario: Relay each frame as an observation event `osh-066`
- **WHEN** the upstream socket delivers a binary frame or a text frame that holds one JSON observation
- **THEN** the client receives an event `observation`, and its data is the observation of `osh-022` for that datastream, with the `ageMs` of that moment
- **AND** a frame of 65536 bytes or less that is not JSON, or has no `result`, gives no event
- **AND** after such a frame, the upstream socket and the client responses stay open
- **AND** a frame with more than 65536 bytes closes the upstream socket, with any content, and the client receives the event `unsupported`
- **AND** the provider ends the response of each client of that datastream
- **AND** a request for that datastream in the next ten minutes gets `503` with `{error:'live_unsupported'}`

#### Scenario: Share one upstream socket and close it after the last client `osh-067`
- **WHEN** two clients open the live route for one datastream, and both close
- **THEN** the provider opens one upstream socket, and both clients receive each frame
- **AND** the provider closes the upstream socket two seconds after the last client leaves
- **AND** a client that opens the route within those two seconds keeps the same socket
- **AND** a client whose connection closed before the provider answers gets no response head and opens no socket

#### Scenario: Limit the number of streams `osh-068`
- **WHEN** the provider serves eight datastreams, or sixteen clients listen to one datastream
- **THEN** a client for a ninth datastream, or a seventeenth client for one datastream, gets `503` with `{error:'live_busy'}`
- **AND** the provider opens no upstream socket for that client
- **AND** a datastream counts toward the limit of eight from its first client until two seconds after its last client leaves
- **AND** a datastream counts toward that limit while its socket connects or waits to try again

#### Scenario: Tell the client when the upstream opens and closes, and open a new socket `osh-069`
- **WHEN** the upstream socket opens, closes or fails while a client listens
- **THEN** the client receives the event `open` each time the upstream socket opens, and the event `down` each time it closes or fails
- **AND** a client that joins while the upstream socket is open receives the event `open` at once
- **AND** while a client listens, the delay before each new socket is 1, 2, 4, 8 and 16 seconds, and then 30 seconds each time
- **AND** a socket that stays open for 30 seconds resets that delay to 1 second
- **AND** the response carries a comment line every 20 seconds, so that a proxy keeps the connection open

#### Scenario: Keep the URL and the credentials out of the live route `osh-070`
- **WHEN** the upstream socket fails, and the provider logs a warning
- **THEN** none of the three configured values appears in an event, in a response header or in a log line

#### Scenario: Open the stream from the browser source with a same-origin GET `osh-071`
- **WHEN** the browser source opens a live stream for a datastream id, and later closes it
- **THEN** it creates one `EventSource` for the same-origin path `/api/osh/live?datastream=<id>`, with no credentials in the URL
- **AND** it calls its callbacks for the events `observation`, `open`, `down` and `unsupported`, and `close()` closes the `EventSource`
- **AND** the `error` event of the `EventSource` also calls the callback for `down`
- **AND** the event `open` that the browser raises with no data calls no callback
- **AND** an `observation` event whose data is not one JSON object calls no callback

#### Scenario: Close every live stream when the server closes `osh-075`
- **WHEN** the HTTP server of the provider closes while clients listen
- **THEN** the provider ends the response of each client and clears each of its timers
- **AND** the provider closes each upstream socket that it holds
- **AND** no timer of the provider opens a new upstream socket after that

### Requirement: Live layer
The layer MUST start a live stream for each of at most three datastreams of the selected system. It MUST close each stream when the selection ends. A stream is open from its event `open` until its event `down` or `unsupported`.
Origin: spec-first

#### Scenario: Start and close the streams with the selection `osh-072`
- **WHEN** the user selects a system and the layer reads its datastreams
- **THEN** the layer starts one live stream for each of at most three of its datastreams
- **AND** a new selection, a click on empty space and `destroy()` each close every stream
- **AND** a datastream with `video: true` gets no live stream, and it does not count toward the limit of three

#### Scenario: Update the detail and the entity from a live observation `osh-073`
- **WHEN** a live stream delivers an observation for a datastream of the selected system
- **THEN** the detail shows that observation in the block of its datastream, with its age
- **AND** the entity of the system moves to its location when the location is fresh, and not when the observation is ahead of the clock
- **AND** the layer reads no observation by poll for that datastream, while its stream is open and the layer holds an observation for it

#### Scenario: Poll a datastream whose stream is not open `osh-074`
- **WHEN** a live stream is not open, the layer holds no observation for its datastream, or the stream reports `down` or `unsupported`
- **THEN** the layer polls the newest observation of that datastream at each poll interval, as `osh-030` says
- **AND** a stream that is open, for a datastream that has an observation, stops that poll
- **AND** a datastream with `video: true` gets no poll

### Requirement: Video datastreams
The adapter MUST mark a datastream that carries video.
Origin: spec-first

#### Scenario: Mark a datastream that carries video `osh-076`
- **WHEN** the adapter maps a datastream list
- **THEN** a record whose `resultType` is `coverage` and whose `observedProperties` name `RasterImage` has `video: true`
- **AND** the adapter reads each name as the last non-empty part of the `definition`, split at a slash, a hash sign or a colon
- **AND** any other record has no `video` property

### Requirement: Video relay
The provider MUST relay the video of one datastream as server-sent events, from one upstream WebSocket. The handshake MUST be a GET, and the provider MUST send no message frame to the server.
Origin: spec-first

#### Scenario: Refuse the video route with no key, a bad id or a wrong method `osh-077`
- **WHEN** a client requests `/api/osh/video` with no key set, with a bad `datastream` value, or with a method other than GET
- **THEN** the answer is `503` with `{error:'no_key'}` when no key is set
- **AND** the answer is `400` with `{error:'bad_datastream'}` for a bad id
- **AND** the answer is `405` with the header `Allow: GET` for a wrong method
- **AND** in each of these three cases the provider opens no upstream socket

#### Scenario: Answer a good request to the video route as the live route does `osh-091`
- **WHEN** a client requests `/api/osh/video?datastream=<id>` with a key set, a good id and a root that answers
- **THEN** the provider writes the response head of the live route, and it opens one upstream socket for the video URL
- **AND** the socket has the header `Authorization` only when both credentials are set
- **AND** the property `binaryType` of the socket is `arraybuffer`, and the provider writes no message frame to the socket
- **AND** the provider reads no schema, and every request that it makes to the server is a GET
- **AND** the hub removes the client when its connection closes
- **AND** the provider opens no socket when the client has left before the root loads

#### Scenario: Refuse the video route when no root answers or the hub is full `osh-092`
- **WHEN** a client requests `/api/osh/video?datastream=<id>` with a key set and a good id, and either no root answers or the id is a ninth datastream
- **THEN** the answer is `502` with `{error:'auth_failed'}` or `{error:'base_unresolved'}`, as `osh-012` says, when no root answers
- **AND** the answer is `503` with `{error:'live_busy'}` for a ninth datastream, as `osh-068` says
- **AND** in both cases the provider opens no upstream socket

#### Scenario: Build the video URL to its fixed shape `osh-078`
- **WHEN** the provider builds the video URL for a datastream id and a resolved root
- **THEN** the URL has the scheme `ws` for an `http` root and `wss` for an `https` root
- **AND** the URL has the URL host and the port of the root, and the path `datastreams/<id>/observations`
- **AND** the URL has the query `f` with the value `application/swe+binary`, written as `application%2Fswe%2Bbinary`
- **AND** the URL has no user name and no password, and this holds when the root has them
- **AND** `assertVideoUrl()` throws for another scheme, host, port, path, query, user name, password or fragment

#### Scenario: Relay each video message as a frame event `osh-079`
- **WHEN** the upstream socket delivers a message
- **THEN** each client of the entry receives one event `frame` for each relayed message
- **AND** the hub relays a binary message of at most 2097152 bytes when it is valid, as `osh-083` says
- **AND** the data of the event is the base64 text of the whole message, as one JSON string
- **AND** a text message of any size gives no event
- **AND** a message of less than 12 bytes gives no event
- **AND** a message whose length field does not equal its size minus 12 gives no event
- **AND** a message whose time stamp is not a finite number gives no event
- **AND** a binary message of more than 2097152 bytes closes the upstream socket, and each client receives the event `unsupported`
- **AND** the provider ends the response of each client of the video entry
- **AND** after that message, the video route for that datastream answers `503` with `{error:'live_unsupported'}` for ten minutes

#### Scenario: Replay the current message group to a late client `osh-080`
- **WHEN** a client joins a video stream that has already relayed messages, or the upstream socket of the video stream closes or fails
- **THEN** a client that joins receives the event `open`, and then one event `frame` for each message of the group, in order
- **AND** the group starts with the last key message, and it has each message after that key message
- **AND** a message is a key message when its H.264 data has a NAL unit of type 5
- **AND** the hub starts the group again at each key message, and it empties a group of more than 2097152 bytes
- **AND** after that the hub keeps no group until the next key message
- **AND** when the upstream socket closes or fails, the hub empties the group, and each client receives the event `down`
- **AND** the hub opens the socket again after the delays of `osh-069`, and each client receives the event `open` when the new socket opens

#### Scenario: Keep the video stream apart from the live stream `osh-081`
- **WHEN** clients open the live route and the video route for one datastream id
- **THEN** the hub has two entries and opens two upstream sockets, one for each URL
- **AND** each entry counts toward the limit of eight datastreams
- **AND** a client of the video route gets no event `observation`, and a client of the live route gets no event `frame`
- **AND** the other entry of the same id stays open when the hub refuses or closes one entry

#### Scenario: Destroy the response of a client that does not read `osh-090`
- **WHEN** the hub writes to a client of the live route or the video route
- **AND** the response of that client has more than 8388608 unwritten bytes, that is, its `writableLength` is more than 8388608
- **THEN** the provider destroys the response of that client, and the hub removes that client
- **AND** the other clients of the entry keep their events, and the upstream socket stays open
- **AND** a client whose response has exactly 8388608 unwritten bytes, or fewer, keeps its response

### Requirement: Video player
The browser MUST decode the video messages of one camera onto a canvas, and MUST show a status when it cannot decode them.
Origin: spec-first

#### Scenario: Open the video stream from the browser source `osh-082`
- **WHEN** the browser source opens a video stream for a datastream id, and later closes it
- **THEN** it creates one `EventSource` for the same-origin path `/api/osh/video?datastream=<id>`, with no credentials in the URL
- **AND** it calls `onFrame` with the bytes that the base64 text of each `frame` event encodes
- **AND** it calls its other callbacks for the events `open`, `down` and `unsupported`, and for the `error` event of the `EventSource`, as `osh-071` says
- **AND** a `frame` event whose data is not one JSON string of base64 text calls no callback
- **AND** `close()` closes the `EventSource`

#### Scenario: Read the parts of a video message `osh-083`
- **WHEN** `src/data/oshVideo.js`, the helper, gets the bytes of a video message
- **THEN** it returns the time stamp in milliseconds and the H.264 data of a valid message
- **AND** a valid message has 12 bytes or more, a length field equal to its size minus 12, and a finite time stamp
- **AND** it returns null for every other message
- **AND** the time stamp in the message is a double in seconds, and the length field has four bytes, most significant byte first
- **AND** it splits the H.264 data into NAL units at each start code of three or four bytes
- **AND** it builds the codec string `avc1.` and the three bytes after the NAL header of the SPS, in hexadecimal
- **AND** it builds the `avcC` record from the SPS and the PPS
- **AND** it builds one sample from the slice NAL units of types 1 to 5
- **AND** each slice in the sample has its length in four bytes before it, most significant byte first

#### Scenario: Decode the messages onto a canvas `osh-084`
- **WHEN** the player gets the messages of a video stream
- **THEN** it decodes nothing until a key message with an SPS and a PPS arrives
- **AND** it reports the status `waiting` until then
- **AND** it configures the decoder with the codec string and the `avcC` record of that key message
- **AND** it ignores a message that is not valid, and a message that has no slice NAL unit
- **AND** it decodes each other message from that key message on, as a key chunk or a delta chunk
- **AND** the time stamp of a chunk is the number of whole microseconds after the time stamp of the first decoded message
- **AND** it sets the size of the canvas at the first decoded frame and when the size of a frame changes
- **AND** it draws each decoded frame on the canvas, and it closes the frame also when the draw fails
- **AND** it reports the status `live` at the first drawn frame after each start or reset
- **AND** when the decoder queue holds more than eight chunks, it ignores each delta message until the next key message
- **AND** it configures the decoder again when a key message has a PPS and an SPS that differs from the SPS of the last configuration
- **AND** after a decoder error it reports the status `error` and then `waiting`, resets the decoder, and waits for a key message
- **AND** it treats an exception from `configure` or `decode`, or from the constructor of the decoder, as a decoder error

#### Scenario: Show when the browser cannot decode `osh-085`
- **WHEN** the browser has no `VideoDecoder` or no `EncodedVideoChunk`
- **THEN** the player decodes nothing and reports the status `unsupported`

### Requirement: Camera panel
The layer MUST show the detail and the video of the selected system in a panel, and MUST hide the panel when the selection ends.
Origin: spec-first

#### Scenario: Show and hide the panel with the selection `osh-086`
- **WHEN** the user selects a system or a feature, and later selects nothing
- **THEN** the layer shows the panel host while it has a detail for the selection, and the detail host has that detail
- **AND** the layer hides the panel host and empties the detail host when the selection ends

#### Scenario: Play the video of the selected system `osh-087`
- **WHEN** the datastreams of the selected system have a datastream with `video: true`
- **THEN** the layer starts one video stream for the first such datastream, and it creates one video view and one player
- **AND** the layer passes each message of the stream to the player
- **AND** the view shows the name of the datastream, or its id when it has no name, and the status of the player
- **AND** the view shows the title `Video` when the name that the layer gives it is empty
- **AND** a new selection, a click on empty space and `destroy()` each close the video stream and the player, and remove the view
- **AND** the event `down` shows the status `reconnecting`, and the event `unsupported` shows the status `unavailable` and closes the stream
- **AND** the event `open` shows the last status of the player again
- **AND** the layer starts no video stream when the player reports the status `unsupported`
- **AND** the layer starts no video stream when the source has no `openVideo()`, or when the page has no video host

#### Scenario: Show a video datastream in the detail `osh-088`
- **WHEN** the detail has a datastream with `video: true`
- **THEN** its block shows the name, or the id when it has no name, and the word `Video`
- **AND** the block shows no row `No data`, no time and no age

#### Scenario: Find the hosts of the panel `osh-089`
- **WHEN** the default layer looks for its hosts in a page
- **THEN** it uses the elements with the ids `osh-panel`, `osh-panel-detail` and `osh-panel-video`
- **AND** it uses no host when there is no document, or when the page has no element for an id

#### Scenario: Treat the panel as an occluder of the world overlay `osh-093`
- **WHEN** the world overlay reads its list of occluder selectors
- **THEN** the list has `#osh-panel`, the selector of the panel host
- **AND** the world overlay places a label or a card clear of an element of the list when it can

#### Scenario: Keep the panel in the page and hidden at the start `osh-094`
- **WHEN** a test reads `index.html` and `style.css`
- **THEN** `index.html` has one element with the id `osh-panel` and the attribute `hidden`
- **AND** that element has the class `osh-panel`
- **AND** the elements with the ids `osh-panel-video` and `osh-panel-detail` are inside that element
- **AND** each of the three ids is on one element only
- **AND** `style.css` gives the display `none` to an element that has the class `osh-panel` and the attribute `hidden`

