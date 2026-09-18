## 1. Gitignore

- [x] 0.1 Add `.env.*` with a `!.env.example` exception to `.gitignore`.
  - Its own commit, ahead of every other change here.

## 2. Spec and proposal

- [x] 1.1 Write `specs/credential-boundary/spec.md`, four requirements, `001`-`016`.
- [x] 1.2 Write `proposal.md`: the two direct calls, the `VITE_` gap, impact, known limits.
- [x] 1.3 Write `design.md` with D1-D6, the risks, and the file list.
- [x] 1.4 Write `tasks.md`, this file.

## 3. Names

- [x] 2.1 Write the `credential-boundary-006` registry-read scan test.
  - Rules out: a credential name read with no example line and no registry entry.
  - Mutation: add `process.env.GEV_PROBE_SECRET` to a server file. The test must name it.
- [x] 2.2 Add the three missing commented names to `.env.example`, until 2.1 passes.
- [x] 2.3 Write the `credential-boundary-005` registry/define equality test.
  - Rules out: a client-exposed flag with no matching define, or the reverse.
  - Mutation: mark the `openai` registry entry `clientExposed: true`. The test must fail.

## 4. Build

- [x] 3.1 Write `bundleCredentials.test.mjs` with `credential-boundary-001`, `002` and `016`.
  - Rules out: the shipped config, which ships an unprefixed `VITE_` value. Also a
    define of a third name. Also a scan of the wrong output directory.
  - Mutation 1: define `OPENAI_API_KEY` too. `001` must name it, then revert.
  - Mutation 2: set `envPrefix: 'VITE_'`. `002` must fail, then revert.
  - Mutation 3: define `GOOGLE_MAPS_SERVER_API_KEY` too. `016` must name it, then revert.
- [x] 3.2 Add `envPrefix` to `build/vite.js`, until 3.1 passes.
- [x] 3.3 Tag the existing define tests with `credential-boundary-003`. Add the
  `Object.keys` equality assertion each carries.
  - Mutation: add a third define key. The equality assertion must fail.
- [x] 3.4 Write the `credential-boundary-004` key-shaped-literal scan test.
  - Rules out: a hardcoded key in `src/`; a pattern that matches nothing.
  - Mutation: add the synthetic Google-key sample as a string in `src/mapStartup.js`.

## 5. Server route

- [x] 4.1 Write `googleGeocodeProxy.test.mjs` with `credential-boundary-007`, `008` and `009`.
  - Rules out: a route with no key check. Also one that sends the browser
    key when a server key is set. Also one that echoes the key. Also one
    with no `no-store` header.
  - Mutation 1: swap the key resolver for a browser-key-only one. `008`'s
    table must fail, then revert.
  - Mutation 2: drop the `no-store` header. `007` and `008` must fail, then revert.
  - Mutation 3: drop the keyless early return. `007`'s call count must fail, then revert.
- [x] 4.2 Write the `credential-boundary-012` projection tests.
  - Rules out: a projection that passes an extra field or an uncapped list through.
  - Mutation: raise the results cap from 12 to 13. The cap test must fail.
- [x] 4.3 Write `projectGeocodeResults` in `placeProviderPayloads.js`, until 4.2 passes.
- [x] 4.4 Write the `credential-boundary-010` and `011` tests.
  - Rules out: a route that accepts both modes at once. Also one that
    answers `502` for an upstream `403`. Also one with no limiter check.
  - Mutation 1: remove the both-modes check. `010` must fail, then revert.
  - Mutation 2: make the catch block answer `500`. `011`'s `502` case must fail, then revert.
  - Mutation 3: pass a limiter that never refuses. `011`'s `429` case must fail, then revert.
- [x] 4.5 Write `coordinates.js` and `geocode.js`, until 4.1 and 4.4 pass.
  - Install the route from `google.js`. Export it from `places.js`. Add
    both files to `package-boundaries.json`.
- [x] 4.6 Run `npm run check:boundaries`.
- [x] 4.7 Add the route to the `previewServing` route table. Tag that test
  with `credential-boundary-007`.
  - Mutation: rename the route path in `geocode.js`. The table row must answer `404`.

## 6. Browser

- [x] 5.1 Write the `credential-boundary-013` tests in `placeSearch.test.mjs`.
  - Rules out: the shipped request function, which still sends `key=`.
  - Mutation: make `createGoogleGeocoder` treat `configured:false` as `answered:false`. The test must fail.
- [x] 5.2 Change `search/google.js` and `standalone/placeSearch.js`, until 5.1 passes.
  Remove `resolveApiKey` from `application.js`.
- [x] 5.3 Change every other caller test that mocks the direct Google host, to
  mock `/api/google/geocode` instead.
- [x] 5.4 Add the `credential-boundary-014` test seam and tests in `gevActions.js`
  and `gevActions.test.mjs`.
  - Rules out: a version that re-asks after a `configured:false` answer.
  - Mutation: remove the remembered-unconfigured flag. The second-call
    fetch-count assertion must fail.
- [x] 5.5 Change `reverseGeocode()`, until 5.4 passes.
- [x] 5.6 Write the `credential-boundary-015` direct-call scan test.
  - Rules out: a re-added direct call, even inside a comment.
  - Mutation: add the Google geocode host string to a code comment. The scan must fail.

## 7. Prose

- [x] 6.1 Update `.env.example`, `SECURITY.md`, `pinokio/_ENVIRONMENT`,
  `google-key.js`'s comment and `docs/CURRENT-STATE.md`.
  - State the browser key's narrowed scope, the server key's widened
    scope, and the OpenAI client secret's design.

## 8. Gates and review

- [ ] 7.1 Run `make lint`, until clean.
- [ ] 7.2 Run `make ratchet`.
- [ ] 7.3 Run `make gates`. Read the per-file coverage from the Docker run
  for every changed file, by name.
- [ ] 7.4 Run every mutation above once more on the final tree, in one sitting.
- [ ] 7.5 Run the review agents. Write `review.md`.

## Scenario ledger

| Requirement | Scenario | State | The test must newly assert |
|---|---|---|---|
| Browser bundle inputs | `credential-boundary-001` | ADDED | the built sentinel set equals the three allowed |
| Browser bundle inputs | `credential-boundary-002` | ADDED | an unprefixed `VITE_` sentinel is absent; the AIS sentinel is present |
| Browser bundle inputs | `credential-boundary-003` | ADDED | the define keys equal the two names |
| Browser bundle inputs | `credential-boundary-004` | ADDED | no key-shaped literal in browser source; each sample matches its pattern |
| Browser bundle inputs | `credential-boundary-016` | ADDED | the server-key sentinel is absent, named on failure; `main.js` passes only the browser define |
| Credential registry | `credential-boundary-005` | ADDED | the client-exposed names equal the define names |
| Credential registry | `credential-boundary-006` | ADDED | every server credential read is documented; the undocumented list is empty |
| Google geocoding proxy | `credential-boundary-007` | ADDED | a keyless answer, `no-store`, zero upstream calls, on the route and the real servers |
| Google geocoding proxy | `credential-boundary-008` | ADDED | the forward query, the key-selection table, the projected result, no key in the body |
| Google geocoding proxy | `credential-boundary-009` | ADDED | the reverse `latlng`, the projected result |
| Google geocoding proxy | `credential-boundary-010` | ADDED | every 400 case, and the 405 case |
| Google geocoding proxy | `credential-boundary-011` | ADDED | the non-ok passthrough, the 502, the over-cap answer, the 429 |
| Google geocoding proxy | `credential-boundary-012` | ADDED | the caps and the field allowlist; a malformed input |
| Browser geocoding | `credential-boundary-013` | ADDED | the same-origin URL, no key, the keyless fallback to Photon |
| Browser geocoding | `credential-boundary-014` | ADDED | the proxy URL, no global key needed, the remembered keyless state |
| Browser geocoding | `credential-boundary-015` | ADDED | no direct call to the Google geocoding host remains in `src/` |

Sixteen ADDED, zero MODIFIED, zero carried. Four requirements, all new.
