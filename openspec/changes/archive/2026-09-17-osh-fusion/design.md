## Context

The project owner runs a private OpenSensorHub (OSH) server. Its account has create and delete rights. A request with the wrong method could destroy a real sensor stream. `OSH_URL` can be the exact API root, or it can need `api/` or `sensorhub/api/` after it. This design infers every OSH payload shape below; no live server has confirmed one.

## Changed files

New: `server/providers/osh.js`, `osh/get.js`, `osh/base.js`, `osh/ids.js`, `osh/observations.js`, `src/data/oshSystems.js`, `oshDatastreams.js`, `oshObservations.js`, `osh.js`, `src/layers/osh/index.js`, `source.js`, `detail.js`, three fixtures, and their test files.

Changed: `server/providers/local.js`, `src/data/localLayers.js`, `layerState.js`, `layerState.test.mjs`, `package.json`, `scripts/package-boundaries.json`, `.env.example`, `src/data/fixtures/README.md`.

## Goals / Non-Goals

**Goals:**
- Prove every upstream call is a GET, through one function.
- Resolve the API root from a short candidate list.
- Show OSH systems and their datastream data on the globe, read-only.

**Non-Goals:**
- Tracks, time windows or features of interest (a later change).
- A WebSocket or MQTT connection. The layer polls on a timer.
- A key-setup UI entry. The three keys reach `.env.example` only.

## Decisions

### D1 Injection for coverage
`oshProxy()` takes `env`, `fetchImpl`, `now` and `warn` as named options, each with a live default. The provider reads the environment per request, inside the middleware, the way `firms.js` reads its key. Every scenario drives the public middleware with a fake server and a fake response object.

### D2 One upstream call site
`oshGet()`, in `get.js`, is the only function that calls `fetchImpl`. It always sends a GET with no body and `redirect: 'manual'`. The probe, each list route, the page walk and the observation fetch all call it. One scenario reads the provider files as text and checks this.

### D3 Browser method guard
The middleware mounts at `/api/osh`. A request whose method is not GET gets a `405`, with an `Allow` header, before any other work, on every sub-path.

### D4 API root candidates
The provider builds three candidate roots from `OSH_URL`: the value itself, the value plus `api/`, and the value plus `sensorhub/api/`. This order never changes. It covers the three cases the owner named. A malformed `OSH_URL` counts as no key.

### D5 Probe
For each candidate, in order, the provider sends one GET for a small system list. A hit is a `200` with an array in the body. Any other outcome is a miss, recorded with its status. When every candidate misses, and one carried an auth status, a data route reports an auth failure; else a resolution failure.

### D6 Per-process resolution cache
`base.js` keeps the resolved root, the name of the candidate that answered, and the failure list, in closure state. A changed `OSH_URL` clears that state. Concurrent first requests share one probe pass. After a full miss the provider waits 60 seconds before the next pass.

### D7 Status without the host
The status route names the candidate that answered, never the URL, so a check of that response can confirm no field carries a host name.

### D8 Credentials
The provider sends Basic authentication only when both the username and the password are set. Its log lines carry fixed text, status codes and candidate names, never the configured values.

### D9 Redirects
The provider never follows a redirect, because a redirect could carry the Basic header to another host. A redirect seen during the probe counts as a miss.

### D10 Page walk
The page walk follows a next-page link only when its origin matches the resolved root, and it stops after 20 pages. A page status outside 200 to 299 stops the whole walk with an error, the same as `observations.js` does for one datastream.

### D11 Limits
Each upstream request carries a timeout, and its body is read under a fixed byte cap.

### D12 List caches
The systems list and the datastreams list each keep a five-minute cache, with one shared refresh and a fallback that serves the stale snapshot. Neither list touches disk — a disk file would hold real system names.

### D13 Datastream id boundary — the sharpest part
Four layers, each tested:
1. The route reads the datastream id from the query only, and refuses a value that is absent, empty, repeated, or fails a strict pattern.
2. The provider builds the observations URL from that id, between two fixed path segments.
3. A safety check re-reads the built URL and throws on a mismatched origin, path or query. The route runs it right after it builds the URL. The URL builder and the safety check both come from the fixed `ids.js` import, never from a caller-supplied option. Only a code edit can weaken it.
4. The observation fetch still goes through the one call site, the same as every other call.

A rejected id answers `400`, with no echo of the value. For every id `readDatastreamId()` accepts, the safety check cannot fail. Its character set has no symbol that `encodeURIComponent()` changes, so the built URL and the check's own reconstruction always agree. `oshIds.test.mjs` proves the check's throw on its own, with crafted URLs no accepted id can produce.

The general error response, `osh-008`, catches a future edit that breaks the invariant. No dedicated branch catches it. A dedicated branch here could run, and a test could prove it ran, only through the seam this design refuses to add.

### D14 Newest observation
The provider reads the newest item of one datastream's observations, with a query kept as one named constant. The adapter builds `phenomenonTime`, `resultTime`, flattened rows and a location from that item; an empty list gives a null result. A per-id cache keeps a 15-second TTL, one shared refresh per id, a fallback that serves the stale value, and a 256-id cap.

### D15 Adapters shared by both sides
The server applies the three pure adapters before it caches a response, so a cached or served payload always holds trimmed records. The browser source only checks the shape it expects and passes the records through unchanged.

### D16 Result flattener
The flattener turns a result record into path and value rows. A primitive gets one row; a nested value gets dotted or index paths. An object or an array at depth four or more gets a fixed marker. A primitive keeps its own value at any depth. A result past 64 rows ends with one truncation marker.

### D17 Location extraction
The location extractor looks for a latitude and a longitude pair, case-insensitive, at a shallow depth, then falls back to a point geometry. Both paths range-check the result. The layer calls this only for the selected system's newest result.

### D18 Layer
The layer follows the shape of the earthquakes layer, with one data source and one entity per system record. Its stats method names the count, the last update, an error, a key-required flag, a stale flag and the selected id. A click on a system entity selects it; any other click deselects. The selected system owns one 15-second poll of its datastreams and their newest results. A moved marker keeps its position across a later systems refresh while it stays selected.

### D19 Detail host
A pure function renders the escaped detail HTML. The layer writes that HTML into a host element whenever a caller supplies one. No panel supplies a host element yet. Its place in the UI stays a known limit for a later change.

### D20 Registration
`src/data/localLayers.js` adds the layer to the local layer list. Its registry entry sits between `military-installations` and `radio` to keep the registry sorted. The registered-layer count moves from 16 to 17.

### D21 Key lists
Only `.env.example` gains the three keys, commented and empty. The key setup UI, Pinokio, the setup doctor and dev-fresh each have a pinned test and stay unchanged.

### D22 Credits
None. The data comes from the project owner's own server.

### D23 How the gates measure the requirements
Coverage: every new file reaches full line, branch and function coverage through its test file. Trace: every test name starts with its scenario tag. Spec lint: one WHEN line and one or more THEN lines per scenario, a MUST sentence in each requirement, an origin line. STE lint: every changed Markdown file and every traced test name.
