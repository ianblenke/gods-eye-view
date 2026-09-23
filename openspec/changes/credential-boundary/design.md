## Context

The server already holds every secret credential and brokers every paid
call. Two exceptions remain. The search box and the voice reverse-lookup
each send a direct request to Google's geocoding endpoint, with the browser
key in the URL. The key is public by design, restricted by referrer and by
API scope, not by secrecy. Sending it from the browser is still the wrong
shape: every other Google call already goes through our server first.

A second gap sits in the build config. Vite's default `VITE_` prefix
exposes any matching `.env` line to the bundle, with no code change and no
review. The AIS live knobs need three such names. Nothing else must use
that channel.

## Goals / Non-Goals

**Goals:**
- Move both direct geocode calls behind a server route, with no key in any
  browser request or response.
- Narrow the `VITE_` channel to the three AIS knobs it was built for.
- Add a build-output test that names any credential reaching the bundle,
  and keep it honest with mutation checks, not only the coverage ratchet.
- Add a registry test that every server-read credential name is documented.

**Non-Goals:**
- Hide the two public-by-design keys. They stay in the bundle, protected by
  restriction, not by secrecy.
- Narrow the browser key's own Google Cloud API scope. That needs the
  account owner to create a second key first; it is a known limit, not a
  code change.
- Change the OpenAI client secret flow. It already stays short-lived and
  server-minted, and reaching the browser is its design, not a leak.

## Decisions

### D1 One geocode route, server key, Google's own field names

`GET /api/google/geocode` lives in a new file,
`server/providers/places/geocode.js`. It answers exactly one of two modes
per request. A forward lookup takes `address` and an optional `bounds`. A
reverse lookup takes `lat` and `lon`. Neither mode, or both, answers `400`.

The route resolves its key with `googleServerApiKey()` at request time, the
way the Places routes already do. A keyless request answers `200` with
`{configured:false, error:null, status:null, results:[]}` and makes no
upstream call. A configured request sends one GET to Google, with a 5 s
timeout and a 1 MB response cap on the read. Every answer, on every path,
carries `Cache-Control: no-store`. The key never appears in a response
body.

The route shares the Places rate limiter. `google.js` passes its own
`googleRateLimiter()` into the geocode installer, so both cost-bearing
Google surfaces spend one per-IP budget. `validatePlacesCoordinates()`
moves to a new small module, `coordinates.js`, so `google.js` and
`geocode.js` can both read it with neither one importing the other.

### D2 Projection is pure and lives with the other place payloads

`projectGeocodeResults(data)` joins the other project functions in
`src/data/placeProviderPayloads.js`. It keeps `status` as a string or null,
and up to 12 results. Each result keeps only `formatted_address`, up to 20
`address_components` (each with `long_name` and `types`), up to 8 `types`,
and `geometry` (`location`, `bounds`, `viewport`). A malformed input gives
`{status:null, results:[]}`. This module already sits in the
`place-providers` boundary group and is shared by Node and the browser.

### D3 The build exposes exactly two names plus the AIS prefix

`build/vite.js` adds `envPrefix: 'VITE_AIS_LIVE_'` to
`createBrowserViteConfig()`. The three AIS knobs keep working, with no
rename. A `.env` line named `VITE_ANYTHING_ELSE` no longer reaches the
bundle. The `define` block keeps its two names, unchanged.

### D4 The browser geocoders lose the key

`createStandalonePlaceSearch()` drops its `resolveApiKey` input. Its
request function now builds `/api/google/geocode?address=..&bounds=..` and
never sends a `key`. `createGoogleGeocoder()` treats a `configured:false`
answer as no verdict, `{place:null, answered:true}`, so the Photon fallback
still runs.

`reverseGeocode()` in `gevActions.js` fetches
`/api/google/geocode?lat=..&lon=..`. It no longer reads
`window.__GOOGLE_MAPS_API_KEY__`. It remembers a `configured:false` answer
for the page's life, so a keyless server costs one wasted request, not one
per lookup. `window.__GOOGLE_MAPS_API_KEY__` itself stays: it holds only
the browser key, and `mapStackController.js` reads its presence to decide
whether photoreal tiles are available.

### D5 The bundle test builds a fixture through the real config

`src/tooling/bundleCredentials.test.mjs` writes a temp root with a fixture
page. Its module script references `import.meta.env.<NAME>` for every
credential name in the key registry and in `.env.example`, plus one probe
name outside that list. The test sets a sentinel value for every one of
those names on the environment. It builds through `createBrowserViteConfig()`
with `vite`'s real `build()`, and reads every output file back as text.

The assertion is two-sided. Every secret sentinel must be absent, checked
one name at a time so a failure names the credential and the file that
held it. The two public sentinels, plus the one AIS sentinel, must be
present, as a positive control. An empty scan result would pass the first
check for the wrong reason.

Mutation checks are part of the test task, not the gate. The ratchet
enforces non-regression within a tolerance. It does not prove full
coverage, and it cannot catch a test whose two sides read the same value.
Each test task below names the hand edit that must turn its test red.

### D6 How the gates measure this change

Coverage: every new file stays at full line, branch and function
coverage. In a changed file, the tests cover each branch that this change
adds. The gate reads the per-file report, not only the ratchet. D7 and D8
give the rules for the two pre-spec files.

Trace: every test names its scenario ids, at most three per test. Spec
lint: one `WHEN` line and at least one `THEN` line per scenario, a `MUST`
sentence and an `Origin` line per requirement. STE lint covers the
proposal, this file, the tasks, the delta spec and every tagged test name.
Boundaries: the `place-providers` group in
`scripts/package-boundaries.json` gains `geocode.js` and `coordinates.js`.
Preview: `previewServing.test.mjs`'s route table gains the geocode route.

### D7 The ledger entry of `src/voice/gevActions.js`

`src/voice/gevActions.js` is a pre-spec file. Its ledger entry allows 221
not-covered branches of 798. On `main`, no test runs `reverseGeocode` or
`sanitizeLabel`, so the report has no branch records inside them. The
tests of `credential-boundary-014` run both functions, and the report now
counts 845 branches.

The report gives 222 not-covered branches. A comparison with the report of
`main`, record by record, finds one new not-covered record. It is at line
2974, in the async function of `reverseGeocode`.

The raw V8 coverage gives its range as line 2974, columns 5 to 6. The text
of the range is one space, between the closing brace of the `catch` block
and `finally`. V8 counts it as the code after the `try` and `catch`
blocks, and both blocks end with `return`. So no statement is in the
range, and no test can execute it. A marker run shows that the `finally`
block executes 8 times and the `catch` block 2 times.

The other new branches of the two functions are covered. The control
character branch of `sanitizeLabel` had no test at first. The place-shape
test of `credential-boundary-014` now gives control characters and a
letter that is not ASCII. It checks that the labels are the same as
before this change.

So the change writes one waiver with the `waive` command of
`gap-ledger-079`, for the metric `branches`, the line 2974 and the count 1.
Its reason names the range and the marker counts. The change does not
edit the code only to move the count.

An earlier version of this change had two tests of `set_layer_visibility`.
They covered two old branches to offset the count. No scenario traces
them, so `LEDGER-NOT-IN-BASE` stopped their names. The change removes
them.

### D8 The tests of `src/search/google.js`

On `main`, the standalone search gave no response when it had no key, and
the `if (!response)` arm of `createGoogleGeocoder` answered for that path.
This change removes that path, so no caller can reach the arm. The change
removes the arm and its comment.

An earlier version of this change had four tests with the tag
`credential-boundary-013`. No test checked what that scenario states. They
covered the arm above, the `ok:false` arm and two defaults of
`normalizeGooglePlace`. The change removes them for the same reason as
the tests of D7. `src/search/google.js` keeps the 4 not-covered branches
that its ledger entry allows.

### Files

New: `server/providers/places/geocode.js`,
`server/providers/places/coordinates.js`, `src/googleGeocodeProxy.test.mjs`,
`src/tooling/bundleCredentials.test.mjs`,
`openspec/changes/credential-boundary/{proposal,design,tasks}.md`,
`openspec/changes/credential-boundary/specs/credential-boundary/spec.md`.

Changed code: `build/vite.js`, `server/providers/places/google.js`,
`server/providers/places.js`, `src/data/placeProviderPayloads.js`,
`src/search/google.js`, `src/standalone/placeSearch.js`,
`src/standalone/application.js`, `src/voice/gevActions.js`,
`scripts/package-boundaries.json`, `.gitignore`.

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

1. **A test asserts the wrong output directory.** Guard: the two public
   sentinels and the AIS sentinel are positive controls. An empty scan
   would fail those, not only pass the negative check.
2. **A future credential name skips both the registry and `.env.example`.**
   Guard: the registry test scans `process.env.NAME` and `env.NAME` under
   `server/`, `scripts/` and `tools/`, and fails on any undocumented name
   shaped like a credential.
3. **A shared rate limiter double-counts against the Places budget.** This
   is the intended design: geocoding and Places spend the same per-IP
   quota, because both are the same paid Google surface.
4. **The `VITE_` narrowing breaks a knob nobody remembered.** Guard: the
   ratchet's untraced-test coverage plus the fixture's positive control on
   `VITE_AIS_LIVE_MAX_ROWS` catch a broken prefix immediately.
5. **The fixture only probes one of the three AIS knobs by name.** The
   test excludes all three from the "must be absent" list, by a fixed
   name list, but only asserts `VITE_AIS_LIVE_MAX_ROWS` as present. A
   change that broke only `VITE_AIS_LIVE_API_URL` or
   `VITE_AIS_LIVE_LABEL_MAX_ROWS` would pass this test. The fixed list
   cuts the other way for safety. A future `VITE_AIS_LIVE_*` name that
   is genuinely secret is not on it, so it stays on the "must be
   absent" side. It fails loudly if the prefix match exposes it.
