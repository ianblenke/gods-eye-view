## MODIFIED Requirements

### Requirement: Browser bundle inputs
The browser build MUST show the browser only the three public credentials and the AIS live settings.
The public credentials are the Google Maps browser key, the Cesium ion token and the Mapillary client token.
They come from the `googleApiKey`, `cesiumToken` and `mapillaryToken` parameters of `createBrowserViteConfig()`.
The standalone config supplies `mapillaryToken` from `MAPILLARY_CLIENT_TOKEN` on the environment.
The AIS live settings come from environment names that start with `VITE_AIS_LIVE_`.
Origin: spec-first

#### Scenario: Build a fixture and find only the allowed sentinels `credential-boundary-001`
- **WHEN** the test builds a fixture page through the real browser config, with a sentinel value for every credential name
- **THEN** the built output holds the browser-key sentinel, the ion-token sentinel and the Mapillary client token sentinel
- **AND** it holds the `VITE_AIS_LIVE_MAX_ROWS` sentinel and no other sentinel

#### Scenario: Keep an unprefixed `VITE_` value out of the bundle `credential-boundary-002`
- **WHEN** the test puts a `VITE_GEV_PROBE_SECRET` sentinel and a `VITE_AIS_LIVE_MAX_ROWS` sentinel on the environment before the build
- **AND** the fixture also has a Mapillary client token sentinel
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
- **AND** the environment has a Mapillary client token sentinel
- **THEN** the built output holds the Mapillary client token sentinel
- **AND** the built output holds no sentinel for `GOOGLE_MAPS_SERVER_API_KEY`, and a failed assertion names it
- **AND** `src/main.js`, read as text, gives only `import.meta.env.GOOGLE_MAPS_API_KEY` as `googleApiKey`, and has no text `SERVER_API_KEY`

