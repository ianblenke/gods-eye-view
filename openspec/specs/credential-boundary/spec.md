# credential-boundary Specification

## Purpose
Keep each secret credential on the server. Put only the three public credentials and the AIS live settings in the browser bundle. Send geocoding requests from the browser only to our server, with no API key.
## Requirements
### Requirement: Browser bundle inputs
The browser build MUST show the browser only the three public credentials and the AIS live settings.
The public credentials are the Google Maps browser key, the Cesium ion token and the Mapillary client token.
They come from the `googleApiKey`, `cesiumToken` and `mapillaryToken` parameters of `createBrowserViteConfig()`.
The standalone config supplies `mapillaryToken` from `MAPILLARY_CLIENT_TOKEN` on the environment.
The AIS live settings come from environment names that start with `VITE_AIS_LIVE_`.
Origin: spec-first

#### Scenario: Build a fixture and find only the allowed sentinels `credential-boundary-001`
- **WHEN** the test builds a fixture page through the real browser config, with a sentinel value for every credential name
- **THEN** the built output holds the browser-key sentinel, the ion-token sentinel and the sentinel for the Mapillary token
- **AND** it holds the `VITE_AIS_LIVE_MAX_ROWS` sentinel and no other sentinel

#### Scenario: Keep an unprefixed `VITE_` value out of the bundle `credential-boundary-002`
- **WHEN** the test puts a `VITE_GEV_PROBE_SECRET` sentinel and a `VITE_AIS_LIVE_MAX_ROWS` sentinel on the environment before the build
- **AND** the fixture also has a sentinel for the Mapillary token
- **THEN** the built output has no `VITE_GEV_PROBE_SECRET` sentinel
- **AND** the built output has the `VITE_AIS_LIVE_MAX_ROWS` sentinel

#### Scenario: Keep the `define` list at the three public names `credential-boundary-003`
- **WHEN** the test reads `Object.keys()` of the `define` of the browser config
- **THEN** it deep-equals `import.meta.env.GOOGLE_MAPS_API_KEY`, `import.meta.env.CESIUM_ION_TOKEN` and `import.meta.env.MAPILLARY_CLIENT_TOKEN`, in order
- **AND** with no parameters, all three `define` values are `undefined`

#### Scenario: Keep key-shaped literals out of browser source `credential-boundary-004`
- **WHEN** the test reads `index.html`, every file under `build/`, and every non-test file under `src/`, as text
- **THEN** no file matches a Google key, OpenAI key, JWT or Mapillary client token pattern
- **AND** each pattern matches a synthetic sample built from itself
- **AND** the Mapillary pattern matches the upstream token shape `MLY|1|abc`

#### Scenario: Keep the server key out of the bundle and out of `main.js` `credential-boundary-016`
- **WHEN** the environment has a sentinel for `GOOGLE_MAPS_SERVER_API_KEY`, and the test gives the browser sentinel as the `googleApiKey` of the build
- **AND** the environment has a sentinel for the Mapillary token
- **THEN** the built output holds the sentinel for the Mapillary token
- **AND** the built output holds no sentinel for `GOOGLE_MAPS_SERVER_API_KEY`, and a failed assertion names it
- **AND** `src/main.js`, read as text, gives only `import.meta.env.GOOGLE_MAPS_API_KEY` as `googleApiKey`, and has no text `SERVER_API_KEY`

### Requirement: Credential registry
The key registry MUST mark as client-exposed exactly the names in the `define` of the browser build. Every credential name that the server reads MUST appear in the registry or in `.env.example`.
Origin: spec-first

#### Scenario: The registry and the `define` list agree `credential-boundary-005`
- **WHEN** the test reads every registry entry marked client-exposed, and every name in the `define` of the browser build
- **THEN** the two name sets are equal

#### Scenario: Document each credential name that the server reads `credential-boundary-006`
- **WHEN** the test reads the `.js` and `.mjs` files under `server/`, `scripts/` and `tools/`
- **AND** it finds each name in `process.env.NAME`, `env.NAME`, `env['NAME']`, a destructured `process.env` or `env`, or a quoted string
- **AND** the name ends in `_KEY`, `_TOKEN`, `_SECRET` or `_PASSWORD`
- **THEN** every name found is in the registry, in `.env.example`, or in both
- **AND** the list of names found nowhere is empty
- **AND** the names found include `OPENAI_API_KEY` and `GOOGLE_MAPS_SERVER_API_KEY`

### Requirement: Browser geocoding routes
The browser MUST send Google geocoding requests only to `/api/google/geocode` and `/api/google/reverse-geocode`, with no API key in the request. When the forward route answers `configured:false` or an HTTP error, the place search MUST ask the next geocoder.
Origin: spec-first

#### Scenario: Leave no direct call to the geocoding host of Google `credential-boundary-019`
- **WHEN** the test reads every non-test file under `src/`, as text
- **THEN** none of them match `maps.googleapis.com/maps/api/geocode`
- **AND** exactly one file under `server/` matches it

#### Scenario: Send a forward lookup to the server route, with a keyless fallback `credential-boundary-020`
- **WHEN** the standalone place search geocodes a query, and the browser has a key
- **THEN** its request URL is the same-origin `/api/google/geocode`, with `address` and `bounds`, and no `key`
- **AND** a `configured:false` answer gives `{place:null, answered:true}`, and the Photon fallback runs next
- **AND** an HTTP error answer from the route gives `{place:null, answered:false}`, and the Photon fallback runs next

