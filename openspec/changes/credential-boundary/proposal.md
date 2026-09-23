## Why

Every secret credential already stays on the server. Two places still send a
public browser key to Google from inside the browser. The search box and the
voice reverse-lookup both call Google's geocoding endpoint directly, with the
key in the URL. Both calls can move behind our own server, the way every
other Google call already does.

A second gap sits in the build. Vite exposes any `.env` line named
`VITE_<something>` to the browser bundle by default. No code change and no
review are needed for that to happen. A test built through the real browser
config confirms this: a probe value placed on the environment reaches the
built output. A future `.env` line could ship a value nobody meant to
expose.

This change adds a geocoding proxy on the server. It moves both browser call
sites behind that proxy. It narrows the `VITE_` channel to the three AIS
knobs it was meant for. It also adds two checks that outlive this change.
One is a build-output scan that names any credential reaching the bundle.
The other is a registry check that every credential name the server reads
is documented somewhere.

## What Changes

- Add `GET /api/google/geocode`, a server route. It resolves the same
  server-first key the Places routes already use. It forwards a geocode or
  a reverse-geocode request, and answers `configured:false` with no
  upstream call when no key is set.
- Add `projectGeocodeResults()`, a pure function. It keeps Google's own
  field names and caps every list, so the browser's parsers need no change
  beyond the transport.
- Change the search box and the voice reverse-lookup to call the new route
  instead of Google directly. Neither one holds or sends a key again.
- Narrow the build's `VITE_` prefix to `VITE_AIS_LIVE_`, the only names it
  was meant to expose.
- Add a build-output test that names any credential sentinel found in the
  built bundle.
- Add a registry test too. It checks that every server-read credential name
  is documented in the key registry or in `.env.example`.

## Impact

- New files, each at full coverage: `server/providers/places/geocode.js`,
  `server/providers/places/coordinates.js`, and their test files.
- Changed files: `build/vite.js`, `server/providers/places/google.js`,
  `server/providers/places.js`, `src/data/placeProviderPayloads.js`,
  `src/search/google.js`, `src/standalone/placeSearch.js`,
  `src/standalone/application.js`, `src/voice/gevActions.js`. The tests
  cover each branch that this change adds.
- `src/search/google.js` and `src/voice/gevActions.js` are pre-spec files
  with ledger entries. Their old not-covered branches stay. The tests of
  this change run two functions of `gevActions.js` for the first time, and
  one of their branches is a range with no code. The change writes a
  waiver with the count 1 for it (D7).
- Five test files gain a new tagged assertion this change adds:
  `viteBuild.test.mjs`, `googleServerKey.test.mjs`,
  `previewServing.test.mjs`, `src/search/placeSearch.test.mjs` and
  `gevActions.test.mjs`.
- Configuration: the `place-providers` boundary group in
  `scripts/package-boundaries.json` gains the two new route files.
- The request shape changes. A geocode lookup now sends one same-origin GET
  to our server first, instead of one direct GET to Google. The server's
  own upstream call carries a 5 s timeout and a 1 MB response cap.
- The OpenAI client secret is out of scope. Our server mints it per voice
  session, and it expires. It is designed to reach the browser for WebRTC,
  so it is not an API key in the sense this change is about.

## Known limits left open

- `google-browser-key-scope-not-narrowed`: the browser key's API
  restriction must cover Places API (New), Street View Static API and
  Geocoding API, not Map Tiles API alone. That stays true until the
  account owner creates a second key, sets `GOOGLE_MAPS_SERVER_API_KEY`, and
  narrows the browser key. This change is complete either way. The browser
  stops sending the key to Google in its own requests, regardless of
  whether the server key exists. The server always resolves and spends
  whatever key it has.
