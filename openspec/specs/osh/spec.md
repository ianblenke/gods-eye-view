# osh Specification

## Purpose
Show the sensor systems of an OpenSensorHub server on the globe, with the newest observation of each datastream of the selected system. Send only GET requests to that server, because the account can create and delete streams.

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
- **AND** it fails when either discovered set is not four files, its pinned size
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
The provider MUST NOT follow a redirect, and MUST stay on the resolved root's origin when it walks a page link. It MUST cap the response body size and the request time of each upstream call.
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
- **AND** the mapper skips a feature with no Point geometry or a non-finite coordinate
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

### Requirement: Systems layer
The browser layer MUST show one entity for each system with a point location. It MUST poll the datastreams and the newest observation of the selected system. It MUST report its state through `getStats()`.
Origin: spec-first

#### Scenario: Report key required from the browser source `osh-028`
- **WHEN** the browser source calls the systems, datastreams or observation getter and the server answers `503` with `{error:'no_key'}`
- **THEN** the getter resolves to `keyRequired:true`
- **AND** another non-ok status, or a payload without the expected field, makes the getter throw
- **AND** the observation getter sends the datastream id as the `datastream` query parameter

#### Scenario: Show one entity per system and report the stats `osh-029`
- **WHEN** the layer updates with a list of system records
- **THEN** the map holds one entity for each record, and `getStats()` reports `count`, `lastUpdate`, `error`, `keyRequired` and `stale`
- **AND** a failed fetch sets `error` and leaves the entities unchanged
- **AND** a `keyRequired` answer clears the entities
- **AND** `disable()` hides the data source, and only `destroy()` removes it

#### Scenario: Poll the datastreams of the selected system `osh-030`
- **WHEN** a click selects a system entity
- **THEN** the layer reads the datastreams once and the newest observation of each datastream of that system, then again every 15 seconds
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
- **AND** a host element given to the layer receives that HTML in `innerHTML`
- **AND** an empty selection clears the host

#### Scenario: Register the layer with a stable token `osh-033`
- **WHEN** the test reads the production layer registry
- **THEN** it has an entry `{id:'osh-systems', token:'o', disposition:'enabled-only'}`
- **AND** the registry has 17 entries, sorted by id
- **AND** `src/data/localLayers.js` includes the OSH systems layer

### Requirement: Synthetic fixtures
The OSH provider files, adapter files and test files MUST NOT contain a real server address or a captured payload.
Origin: spec-first

#### Scenario: Keep the OSH files free of a real address `osh-034`
- **WHEN** the test reads the provider files, the adapter files and the layer files as text
- **AND** it reads, as text, each test file whose name starts with `osh` or that sits in an `osh/` directory
- **THEN** every scheme-qualified address in them names `localhost` or a reserved `*.example` host
- **AND** the provider, adapter and layer files also have no dotted host with an explicit port, other than a `*.example` host
- **AND** those files have no IPv4 literal
- **AND** every system and datastream fixture id starts with `sys-fixture-` or `ds-fixture-`
- **AND** `.env.example` has the three OSH keys, each with an empty value

### Requirement: Installation
The provider MUST install the same middleware for the dev server and the preview server.
Origin: spec-first

#### Scenario: Install identical middleware on both server hooks `osh-035`
- **WHEN** `configureServer` and `configurePreviewServer` each run against a fake server object
- **THEN** each installs the same `/api/osh` middleware, and it answers a request the same way

