## Why

Every secret credential already stays on the server. Two places still send a
public browser key to Google in a geocoding request from the browser. The
search box and the voice reverse-lookup both call the geocoding endpoint of
Google directly, with the key in the URL. Both calls can go through our own
server, as the Places and Street View calls of Google already do.

A second gap is in the build. By default, Vite exposes each `.env` line
with a name that starts with `VITE_` to the browser bundle. This needs no
code change and no review. A fixture build through the real browser config
shows this: a probe value on the environment gets to the built output. A
later `.env` line can thus ship a value that nobody wants to expose.

This change adds a geocoding route on the server. It moves both browser
calls to that route. It narrows the `VITE_` prefix to the three AIS live
settings. It also adds two checks that stay after this change. One scans
the build output and names each credential that gets to the bundle. The
other checks that the registry or `.env.example` documents each credential
name that the server reads.

## What Changes

- Add `GET /api/google/geocode`, a server route. It selects the key with
  the same rule as the Places routes, the server key first. It sends a
  forward or a reverse lookup to Google. When the server has no Google key,
  it answers `configured:false` and makes no upstream call.
- Add `projectGeocodeResults()`, a pure function. It keeps the field names
  of Google, so the parsers of the browser need no change other than the
  URL. It keeps at most 12 results. Each result keeps at most 20 address
  components and 8 types, and each component keeps at most 8 types.
- Change the search box and the voice reverse-lookup to call the new route.
  Neither one holds or sends a key.
- Narrow the `VITE_` prefix of the build to `VITE_AIS_LIVE_`.
- Add a test that builds a fixture page and names each credential sentinel
  in the built output.
- Add a registry test. It checks that the key registry or `.env.example`
  documents each credential name that the server reads.

## Impact

- New code files, each at full coverage: `server/providers/places/geocode.js`
  and `server/providers/places/coordinates.js`.
- New test files: `src/googleGeocodeProxy.test.mjs`,
  `src/googleGeocodeRateLimit.test.mjs` and
  `src/tooling/bundleCredentials.test.mjs`.
- Changed code: `build/vite.js`, `server/providers/places/google.js`,
  `server/providers/places.js`, `server/standalone/vite.config.js`,
  `src/data/placeProviderPayloads.js`, `src/search/google.js`,
  `src/standalone/placeSearch.js`, `src/standalone/application.js` and
  `src/voice/gevActions.js`. The tests cover each branch that this change
  adds.
- `src/search/google.js` and `src/voice/gevActions.js` are pre-spec files
  with ledger entries, and their old not-covered branches stay. The tests of
  this change run `reverseGeocode` and `sanitizeLabel` of `gevActions.js`
  for the first time. One branch of `reverseGeocode` is a range with no
  code. The change writes a waiver with the count 1 for it (D7).
- Six test files get new tagged tests: `viteBuild.test.mjs`,
  `googleServerKey.test.mjs`, `previewServing.test.mjs`,
  `src/search/placeSearch.test.mjs`, `gevActions.test.mjs` and
  `keySetupCore.test.mjs`.
- Configuration: the `place-providers` boundary group in
  `scripts/package-boundaries.json` gets `geocode.js` and `coordinates.js`.
  `.gitignore` ignores each `.env.*` file, except `.env.example`.
- The request changes. A geocoding lookup now sends one same-origin GET to
  our server first, not one direct GET to Google. The server sends its own
  call to Google with a 5 s timeout, and it reads at most 1 MB.
- Gaps that this change opens: one branch of `src/voice/gevActions.js`, at
  the range with no code of D7. The waiver of D7 allows it.
- Gaps that this change closes:
  - The ledger entry of `src/standalone/placeSearch.js`.
  - One line of `src/standalone/application.js`.
  - 74 lines and 4 functions of `src/voice/gevActions.js`.
  - One branch of `src/search/google.js`.
  - Four untraced test names, in three test files.
- The OpenAI client secret is out of scope. Our server makes it for each
  voice session, and it expires. The browser gets it by design for WebRTC,
  so it is not an API key in the sense of this change.

## Known limits and later changes

- `google-browser-key-scope-not-narrowed`: the API restriction of the
  browser key must include Places API (New), Street View Static API and
  Geocoding API, not only Map Tiles API. This stays true until the account
  owner makes a second key, sets `GOOGLE_MAPS_SERVER_API_KEY`, and narrows
  the browser key. The browser sends its geocoding requests only to our
  server, with no key, also when no server key exists. The photoreal map
  tiles still send the browser key to Google.
- `credential-scan-forms`: the registry scan does not find a dynamic read
  such as `env[variable]`, or a name that the code builds from parts. It
  also does not find a credential name with no `_KEY`, `_TOKEN`, `_SECRET`
  or `_PASSWORD` suffix. It reads only `server/`, `scripts/` and `tools/`.
- `one-ais-setting-probed`: the fixture checks only `VITE_AIS_LIVE_MAX_ROWS`
  as present in the bundle. `viteBuild.test.mjs` stops a change of the
  prefix. A change that removes only `VITE_AIS_LIVE_API_URL` or
  `VITE_AIS_LIVE_LABEL_MAX_ROWS` in another way passes these tests.
