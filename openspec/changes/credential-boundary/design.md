## Context

The server already holds every secret credential and sends every paid call.
Two exceptions remain. The search box and the voice reverse-lookup each send
a direct request to the geocoding endpoint of Google, with the browser key in
the URL. The key is public by design: a referrer restriction and an API
restriction protect it, not secrecy. But the browser must not send it: each
other Google call already goes through our server first.

A second gap is in the build config. The default `VITE_` prefix of Vite
exposes each `.env` line with a matching name to the bundle, with no code
change and no review. The AIS live settings need three such names. No other
name must use that prefix.

## Goals / Non-Goals

**Goals:**
- Move both direct geocoding calls to a server route, with no key in a
  browser request or response.
- Narrow the `VITE_` prefix to the three AIS live settings.
- Add a test that builds a fixture page and names each credential in the
  bundle. Mutation checks, not only the coverage ratchet, show that it can
  fail.
- Add a registry test that the registry or `.env.example` documents each
  credential name that the server reads.

**Non-Goals:**
- Hide the two public keys. They stay in the bundle, and their restrictions
  protect them, not secrecy.
- Narrow the Google Cloud API restriction of the browser key. The account
  owner must first make a second key. This is a known limit, not a code
  change.
- Change the OpenAI client secret. Our server makes it for each session, it
  expires, and the browser gets it by design.

## Decisions

### D1 One geocoding route, the server key, the field names of Google

`GET /api/google/geocode` is in a new file,
`server/providers/places/geocode.js`. It answers one of two modes for each
request. A forward lookup takes `address` and an optional `bounds`. A reverse
lookup takes `lat` and `lon`.

The route has no key of its own. `google.js` gives it the key resolver of the Places routes. That
resolver selects the server key, or the browser key when the server key is
blank. With no key, the route answers `200` with
`{configured:false, error:null, status:null, results:[]}` and makes no
upstream call. With a key, a request with neither mode or both modes answers
`400`. A request with a method other than `GET` answers `405` before the
route reads a key, so that answer has no `configured` field.

A request with a key sends one GET to Google, with a 5 s timeout. The route
reads at most 1 MB of the answer. Every answer carries `Cache-Control:
no-store`, and no answer holds the key. For an HTTP error status, the route
sends the error text of Google with the key removed. For a read that is too
large, too late or not JSON, the route sends a fixed error text.

The route uses the same rate limiter as the Places routes. `google.js` gives
its own `googleRateLimiter()` to the geocoding installer, so the two paid
Google APIs spend one budget for each IP address.
`validatePlacesCoordinates()` moves to a new small module, `coordinates.js`.
So `google.js` and `geocode.js` both read it, and neither one imports the
other.

### D2 The projection is pure and is in the module of the other place payloads

`projectGeocodeResults(data)` is a new function in
`src/data/placeProviderPayloads.js`, next to the other `project...()`
functions. It keeps `status` as a string or null, and at most 12 results.
Each result keeps only `formatted_address`, at most 20
`address_components`, at most 8 `types`, and `geometry`. Each component
keeps only `long_name` and at most 8 `types`. `geometry` keeps `location`
as `{lat,lng}`, and `bounds` and `viewport` as `{northeast, southwest}`
boxes, or null when a value is not a finite number.

A bad input gives `{status:null, results:[]}`. This module is already in the
`place-providers` boundary group, and Node and the browser both use it.

### D3 The build exposes the two public credentials and the AIS prefix

`build/vite.js` adds `envPrefix: 'VITE_AIS_LIVE_'` to
`createBrowserViteConfig()`. The three AIS live settings keep their names
and their function. A `.env` line with the name `VITE_ANYTHING_ELSE` does
not get to the bundle. The `define` block keeps its two names, unchanged.

### D4 The browser geocoders send no key

`createStandalonePlaceSearch()` has no `resolveApiKey` input now. Its
request function sends `/api/google/geocode?address=..&bounds=..` and never
sends a `key`. `createGoogleGeocoder()` gives `{place:null, answered:true}`
for a `configured:false` answer, the same shape as a `ZERO_RESULTS` miss.
The Photon fallback then runs, and its answer alone decides the result. An
HTTP error answer of the route gives `{place:null, answered:false}`, so the
result stays open to a later search.

`reverseGeocode()` in `gevActions.js` fetches
`/api/google/geocode?lat=..&lon=..`, and it does not read
`window.__GOOGLE_MAPS_API_KEY__`. It remembers a `configured:false` answer
for the life of the page, so a keyless server costs one request, not one
for each lookup. It does not remember an answer with an HTTP error status or with no Google
status. So after a short outage, a later call fetches again.
`window.__GOOGLE_MAPS_API_KEY__` stays. It holds only the browser key, and
`mapStackController.js` reads it to find if photoreal tiles are available.

### D5 The bundle test builds a fixture through the real config

`src/tooling/bundleCredentials.test.mjs` writes a temporary root with a
fixture page. Its module script reads `import.meta.env.<NAME>` and
`process.env.<NAME>` for every credential name in the key registry and in
`.env.example`. It also reads one probe name outside that list. The test puts a
sentinel value for each of those names on the environment.

`server/standalone/vite.config.js` exports `standalonePlugins()`, the plugin
list of the production build. The test gives it to
`createBrowserViteConfig()`, and it gives the full config to the real
`build()` of Vite, with no config file. The test does not call the default
export, because that reads the real `.env`. The build runs one time, and
each test reads the output files as text.

The assertion has two sides. Every secret sentinel must be absent. The test
checks one name at a time, so a failure names the credential and the file.
The two public sentinels and the one AIS sentinel must be present, as a
positive control. An empty scan result passes the first check for the wrong
reason, but it fails the second.

The scans of `credential-boundary-004` and `credential-boundary-015` read
each file under `build/`. Under `src/`, they read each file with a name that
does not end in `.test.js` or `.test.mjs`. This includes `.mjs`, `.json`, `.css`
and data files, because the browser loads some of them. A data file in
protobuf keeps its strings as UTF-8, so a key in it still matches.

Mutation checks are part of each test task, not of the gate. The ratchet
stops a loss within a tolerance. It does not prove full coverage, and it
cannot find a test whose two sides read the same value. Each test task in
`tasks.md` names the hand edit that must make its test fail.

### D6 How the gates measure this change

Coverage: every new file stays at full line, branch and function
coverage. In a changed file, the tests cover each branch that this change
adds. The gate reads the report for each file, not only the ratchet. D7 and
D8 give the rules for the two pre-spec files.

Trace: every test names its scenario IDs, at most three for each test. Spec
lint: one `WHEN` line and one or more `THEN` lines for each scenario, and a
`MUST` sentence and an `Origin` line for each requirement. The STE lint reads
the proposal, this file, the tasks, the delta spec and every tagged test
name. Boundaries: the `place-providers` group in
`scripts/package-boundaries.json` gets `geocode.js` and `coordinates.js`.
Preview: a new test of `previewServing.test.mjs` checks the geocoding route
on the real dev and preview servers.

### D7 The ledger entry of `src/voice/gevActions.js`

`src/voice/gevActions.js` is a pre-spec file. On `main`, its ledger entry
allows 221 not-covered branches of 798. On `main`, no test runs
`reverseGeocode` or `sanitizeLabel`, so the report has no branch records in
them. The tests of `credential-boundary-014` run both functions, and the
report now counts 847 branches.

The report gives 222 not-covered branches. A comparison with the
report of `main`, record by record, finds one new not-covered record. It is
at line 2975, in the async function of `reverseGeocode`.

The raw V8 coverage gives its range as line 2975, columns 5 to 6. The text
of the range is one space, between the closing brace of the `catch` block
and `finally`. V8 counts it as the code after the `try` and `catch` blocks,
and both blocks end with `return`. So no statement is in the range, and no
test can execute it. A marker run shows that the `finally` block executes
19 times and the `catch` block 2 times, in the 14 tests of
`credential-boundary-014`.

The other new branches of the two functions are covered. The control
character branch of `sanitizeLabel` had no test at first. The place-shape
test of `credential-boundary-014` now gives control characters and a letter
that is not ASCII. It checks that the labels are the same as before this
change.

So the change writes one waiver with the `waive` command of
`gap-ledger-079`, for the metric `branches`, the line 2975 and the count 1.
Its reason names the range and the marker counts. The change does not edit
the code only to move the count.

An earlier version of this change had two tests of `set_layer_visibility`.
They covered two old branches to offset the count. No scenario traces them,
so the `LEDGER-NOT-IN-BASE` check stopped the build for their names. The
change removes them.

### D8 The tests of `src/search/google.js`

On `main`, the standalone search gave no response when it had no key, and
the `if (!response)` arm of `createGoogleGeocoder` answered for that path.
This change removes that path, so no caller can get to the arm. The change
removes the arm and its comment.

An earlier version of this change had four tests with the tag
`credential-boundary-013`. No test checked what that scenario states. They
covered the arm above, the `ok:false` arm and two defaults of
`normalizeGooglePlace`. The change removes them for the same reason as the
tests of D7.

The `ok:false` arm now has a real test of `credential-boundary-013`. The
route can answer `429` or `502`. The search must then give an open answer
and use Photon. `src/search/google.js` keeps 3 not-covered
branches, down from the 4 that its ledger entry allowed.

### Files

New: `server/providers/places/geocode.js`,
`server/providers/places/coordinates.js`, `src/googleGeocodeProxy.test.mjs`,
`src/googleGeocodeRateLimit.test.mjs`,
`src/tooling/bundleCredentials.test.mjs`,
`openspec/changes/credential-boundary/{proposal,design,tasks}.md`,
`openspec/changes/credential-boundary/specs/credential-boundary/spec.md`.

Changed code: `build/vite.js`, `server/providers/places/google.js`,
`server/providers/places.js`, `server/standalone/vite.config.js`,
`src/data/placeProviderPayloads.js`, `src/search/google.js`,
`src/standalone/placeSearch.js`, `src/standalone/application.js`,
`src/voice/gevActions.js`, `scripts/package-boundaries.json`, `.gitignore`.

Changed tests: `src/tooling/viteBuild.test.mjs`,
`src/googleServerKey.test.mjs`, `src/tooling/previewServing.test.mjs`,
`src/search/placeSearch.test.mjs`, `src/voice/gevActions.test.mjs`,
`src/keySetupCore.test.mjs`, `src/locations.test.mjs`,
`src/annotations/annotationEngine.test.mjs`,
`src/annotations/annotationResolver.test.mjs`,
`src/voice/gevRealtime.test.mjs`.

Changed prose: `.env.example`, `SECURITY.md`, `pinokio/_ENVIRONMENT`,
`server/providers/places/google-key.js`, `docs/CURRENT-STATE.md`.

## Risks / Trade-offs

1. **A test reads the wrong output directory.** Guard: the two public
   sentinels and the AIS sentinel are positive controls. An empty scan
   passes the negative check, but it fails those controls.
2. **A later credential name is not in the registry or in `.env.example`.**
   Guard: the registry test finds dotted, destructured and quoted reads
   under `server/`, `scripts/` and `tools/`. It stops the build for each
   name with a credential suffix that no file documents. The known limit
   `credential-scan-forms` names the reads that it does not find.
3. **The shared rate limiter counts geocoding against the Places budget.**
   This is the design: geocoding and Places spend the same budget for each
   IP address, because both are the same paid Google service.
4. **The narrower `VITE_` prefix stops an AIS setting.** Guard: the prefix
   test of `viteBuild.test.mjs` and the positive control of the fixture on
   `VITE_AIS_LIVE_MAX_ROWS` stop a changed prefix.
5. **The fixture checks only one of the three AIS settings by name.** The
   test keeps all three off the "must be absent" list, but it checks only
   `VITE_AIS_LIVE_MAX_ROWS` as present. A change that stops only
   `VITE_AIS_LIVE_API_URL` or `VITE_AIS_LIVE_LABEL_MAX_ROWS` passes this
   test. The known limit `one-ais-setting-probed` records this.
