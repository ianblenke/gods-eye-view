## 1. Gitignore

- [x] 1.1 Add `.env.*` with a `!.env.example` exception to `.gitignore`.
  - Make this commit before all other commits of the change.

## 2. Spec and proposal

- [x] 2.1 Write `specs/credential-boundary/spec.md`, with four requirements and the scenarios `001` to `016`.
- [x] 2.2 Write `proposal.md` with the two direct calls, the `VITE_` gap, the impact and the known limits.
- [x] 2.3 Write `design.md` with D1 to D8, the risks and the file list.
- [x] 2.4 Write `tasks.md`.

## 3. Names

Revert each mutation of this section after its check.

- [x] 3.1 Write the scan test of `credential-boundary-006` for the credential names that the server reads.
  - The test fails for: a credential name that the server reads, with no example line and no registry entry.
  - Mutation 1: add `process.env.GEV_PROBE_SECRET` to a server file. The test must name it.
  - Mutation 2: read it in a destructured `process.env`, in `env['NAME']` and in a quoted string. The test must fail for each.
  - Mutation 3: make the scan patterns match nothing. The positive control must fail.
- [x] 3.2 Add the three commented names that `.env.example` lacks, until 3.1 passes.
- [x] 3.3 Write the equality test of `credential-boundary-005` for the registry and the `define` names.
  - The test fails for: a client-exposed flag with no `define` entry for it, or the reverse.
  - Mutation: mark the `openai` registry entry `clientExposed: true`. The test must fail.

## 4. Build

Revert each mutation of this section after its check.

- [x] 4.1 Write `bundleCredentials.test.mjs` with `credential-boundary-001`, `002` and `016`.
  - The test fails for: an unprefixed `VITE_` value in the bundle, a third `define` name, and a scan of the wrong directory.
  - Mutation 1: add `OPENAI_API_KEY` to `define`. `001` must name it.
  - Mutation 2: set `envPrefix: 'VITE_'`. `002` must fail.
  - Mutation 3: add `GOOGLE_MAPS_SERVER_API_KEY` to `define`. `016` must name it.
  - Mutation 4: add a plugin whose `transformIndexHtml` writes the server key. `016` must fail.
  - Mutation 5: add a plugin whose `config()` sets `envPrefix: 'VITE_'`. `002` must fail.
- [x] 4.2 Add `envPrefix` to `build/vite.js`, until 4.1 passes.
- [x] 4.3 Export `standalonePlugins()` from `server/standalone/vite.config.js`.
- [x] 4.4 Build the fixture in the test with `standalonePlugins()`.
- [x] 4.5 Add the tag `credential-boundary-003` to the current `define` tests.
- [x] 4.6 Add the `Object.keys` equality assertion to each of those tests.

  - Mutation: add a third `define` key. The equality assertion must fail.
- [x] 4.7 Write the key-shaped literal scan test of `credential-boundary-004`.
  - The test fails for: a hardcoded key in `src/`, in any file that is not a test file, and a pattern that matches nothing.
  - Mutation 1: add a synthetic Google key to `src/keySetupCore.mjs`. The test must fail.
  - Mutation 2: add it to a `.json` file under `src/data/`. The test must fail.

## 5. Server route

Revert each mutation of this section after its check.

- [x] 5.1 Write `googleGeocodeProxy.test.mjs` with `credential-boundary-007`, `008` and `009`.
  - The test fails for: a route with no key check, the browser key when a server key exists, and a key in a response.
  - Mutation 1: make `googleServerApiKey()` give only the browser key. The `008` table must fail.
  - Mutation 2: at `google.js`, give the route a resolver for the browser key only. The `008` table must fail.
  - Mutation 3: remove the `no-store` header. `007` and `008` must fail.
  - Mutation 4: remove the keyless early return. The call count of `007` must fail.
- [x] 5.2 Write the projection tests of `credential-boundary-012`.
  - The test fails for: a projection that keeps an extra field, or a list longer than its maximum length.
  - Mutation 1: change the maximum number of results from 12 to 13. The test must fail.
  - Mutation 2: keep each component whole. The test must fail.
  - Mutation 3: keep `geometry` whole. The test must fail.
- [x] 5.3 Write `projectGeocodeResults` in `placeProviderPayloads.js`, until 5.2 passes.
- [x] 5.4 Write the tests of `credential-boundary-010` and `011`.
  - The test fails for: both modes at once, a blank address, a key in an error text, and no limiter check.
  - Mutation 1: remove the check for both modes. `010` must fail.
  - Mutation 2: remove `.trim()` from the address. `010` must fail.
  - Mutation 3: make the catch block answer `500`. The `502` case of `011` must fail.
  - Mutation 4: change the timeout from 5000 ms to 1000 ms. `011` must fail.
  - Mutation 5: change the maximum body size to 1.5 MB, then to 512 KB. `011` must fail for each.
  - Mutation 6: send the error text of Google with the key. `011` must fail.
  - Mutation 7: give the route a limiter that never refuses. The `429` case of `011` must fail.
  - Mutation 8: move the method check below the key check. `010` must fail.
  - Mutation 9: change the address length check from `>` to `>=`. `010` must fail.
- [x] 5.5 Write the shared limiter test of `011` in `googleGeocodeRateLimit.test.mjs`.
  - Mutation: at `google.js`, give the route no limiter, then its own limiter. The test must fail for each.
- [x] 5.6 Write `coordinates.js` and `geocode.js`, until 5.1, 5.4 and 5.5 pass.
- [x] 5.7 Install the route from `google.js`.
- [x] 5.8 Export the route from `places.js`.
- [x] 5.9 Add `geocode.js` and `coordinates.js` to `package-boundaries.json`.
- [x] 5.10 Run `npm run check:boundaries`.
- [x] 5.11 Write a test of `credential-boundary-007` in `previewServing.test.mjs` for the real servers.
  - The test leaves the old test of that file unchanged.
  - Mutation 1: change the route path in `geocode.js`. The test must fail.
  - Mutation 2: install a stub answer before the route. The test must fail.
  - Mutation 3: remove the `no-store` header. The test must fail.
  - Mutation 4: make a keyless request call the upstream host. The test must fail.

## 6. Browser

Revert each mutation of this section after its check.

- [x] 6.1 Write the tests of `credential-boundary-013` in `placeSearch.test.mjs`.
  - The test fails for: a request function that sends `key=`, and an HTTP error answer that gives `answered:true`.
  - Mutation 1: give `answered:false` for a `configured:false` answer. The test must fail.
  - Mutation 2: give `answered:true` for an HTTP error answer. The test must fail.
  - Mutation 3: delete the `response.ok === false` arm. The test must fail.
- [x] 6.2 Change `search/google.js` and `standalone/placeSearch.js`, until 6.1 passes.
- [x] 6.3 Remove `resolveApiKey` from `application.js`.
- [x] 6.4 Mock `/api/google/geocode` in each other test that mocks the direct Google host.
  - These edits change only the mocked URL and add `configured:true`.
  - The mock of `annotationResolver.test.mjs` reads the relative URL with a base.
- [x] 6.5 Add the test hook and the tests of `credential-boundary-014` to `gevActions.js` and its tests.
  - The test fails for: a second request after a `configured:false` answer, and a key in the URL.
  - Mutation 1: remove the flag that remembers a `configured:false` answer. The fetch count must fail.
  - Mutation 2: add the browser key to the URL. The URL test must fail.
  - Mutation 3: remember an HTTP error answer. The tests of a later fetch must fail.
- [x] 6.6 Change `reverseGeocode()`, until 6.5 passes.
- [x] 6.7 Write the direct-call scan test of `credential-boundary-015`.
  - The test fails for: a direct call to the geocoding host of Google, also in a comment or a data file.
  - Mutation: add `maps.googleapis.com/maps/api/geocode` to a code comment. The scan must fail.

## 7. Prose

- [x] 7.1 Update `.env.example`, `SECURITY.md`, `pinokio/_ENVIRONMENT`, `google-key.js` and `docs/CURRENT-STATE.md`.
    - Describe the narrower use of the browser key, the wider use of the server key and the design of the OpenAI client secret.

## 8. The ledger entries of `gevActions.js` and `google.js`

Revert each mutation of this section after its check.

- [x] 8.1 Remove the two `set_layer_visibility` offset tests. No scenario traces them.
- [x] 8.2 Measure the not-covered branches of `gevActions.js` against the report of `main`.
- [x] 8.3 Give control characters and a letter that is not ASCII in the 014 place-shape test.
  - Mutation 1: write each character with no replacement. The test must fail.
  - Mutation 2: remove the DEL condition. The test must fail.
  - Mutation 3: change `code < 0x20` to `code < 0x1f`. The test must fail.
  - Mutation 4: change `code === 0x7f` to `code >= 0x7f`. The test must fail.
- [x] 8.4 Remove the `if (!response)` arm of `createGoogleGeocoder` and the four 013 tests of D8.
- [x] 8.5 Run `waive` for line 2975 with the count 1, and a reason with the evidence of D7.

## 9. Gates and review

- [ ] 9.1 Run `make lint`, until it gives no errors.
- [ ] 9.2 Run `make ratchet CHANGE=credential-boundary`.
- [ ] 9.3 Run `make gates CHANGE=credential-boundary`.
- [ ] 9.4 Read the coverage of each changed file from the Docker run.
- [ ] 9.5 Run each mutation of sections 3 to 8 on the final tree, in one session.
- [ ] 9.6 Run the review agents.
- [ ] 9.7 Write `review.md`.

## Scenario ledger

| Requirement | Scenario | State | The test must newly assert |
|---|---|---|---|
| Browser bundle inputs | `credential-boundary-001` | ADDED | the built sentinel set equals the three allowed names |
| Browser bundle inputs | `credential-boundary-002` | ADDED | no unprefixed `VITE_` sentinel; the AIS sentinel is present |
| Browser bundle inputs | `credential-boundary-003` | ADDED | the `define` keys equal the two names |
| Browser bundle inputs | `credential-boundary-004` | ADDED | no key-shaped literal in a non-test file of `src/`; each sample matches its pattern |
| Browser bundle inputs | `credential-boundary-016` | ADDED | no server-key sentinel, named on failure; `main.js` gives only the browser key |
| Credential registry | `credential-boundary-005` | ADDED | the client-exposed names equal the `define` names |
| Credential registry | `credential-boundary-006` | ADDED | the registry or `.env.example` documents each credential name that the server reads; the positive control |
| Google geocoding proxy | `credential-boundary-007` | ADDED | a keyless answer, `no-store` and zero upstream calls, on the route and on the real servers |
| Google geocoding proxy | `credential-boundary-008` | ADDED | the forward query, the key selection through the real resolver, no key in the body |
| Google geocoding proxy | `credential-boundary-009` | ADDED | the reverse `latlng` and the projected result |
| Google geocoding proxy | `credential-boundary-010` | ADDED | each `400` case, and the `405` case with or without a key, with zero upstream calls |
| Google geocoding proxy | `credential-boundary-011` | ADDED | the error status, the `502`, the timeout, the maximum size, the key removal, the shared `429` |
| Google geocoding proxy | `credential-boundary-012` | ADDED | the maximum list lengths and the allowed fields, also in components and boxes |
| Browser geocoding | `credential-boundary-013` | ADDED | the same-origin URL with no key, and the Photon fallback after each answer with no place |
| Browser geocoding | `credential-boundary-014` | ADDED | the route URL with no key, the remembered keyless answer, no memory of an error |
| Browser geocoding | `credential-boundary-015` | ADDED | no direct call to the geocoding host of Google in a non-test file of `src/` |

Sixteen ADDED, zero MODIFIED, zero carried. Four requirements, all new.
