Verdict: FAIL

Tree read: /home/ianblenke/docker/gev-cred, working tree of branch credential-boundary, checked against cb-r2.diff (the change since 90ffba9). I have no shell, so I could not read HEAD or run any test or mutation. Every conclusion below comes from reading the code and tests.

- [ ] F1 major src/googleGeocodeProxy.test.mjs:201 The 010 scenario says a non-GET request gets 405 "with zero upstream calls, with or without a key" (spec.md:74 of the archived change). The only 405 test uses `resolveApiKey: () => 'fixture-server-key'`, and no test sends a keyless POST. If the method check in geocode.js:81 moves below the keyless check at geocode.js:88, every test still passes, and a keyless POST then gets 200 with `configured:false`. Design D1 also says 405 comes "before the route reads a key", and no test shows that. The WHEN of 010 says "the server has a Google key", which contradicts the "or without a key" clause. Add a keyless POST case to the 405 test. It must assert 405, the same body, `no-store`, zero fetch calls, and that `resolveApiKey` was not called. Then make the WHEN and the AND agree.

- [ ] F2 major src/search/placeSearch.test.mjs:59-90 (code at src/search/google.js:44) The two new 013 route-error tests send `Response.json({configured:true, status:null, results:[]}, {status})` with status 429 and 502. If the `if (response.ok === false) return { place: null, answered: false }` arm is deleted, that body falls through to `{place:null, answered:false}` anyway, so the tests pass against the code and against its removal (AGENTS rule 13). Design D8 says the arm "now has a real test", and the ledger entry for google.js went from 4 to 3 branches on that basis (history line 598). Task 6.1 names no mutation that deletes the arm. Send an error status with a body that would give a different answer if it were read, for example `{configured:false}` with 502, or `{status:'ZERO_RESULTS', results:[]}` with 429. Assert `answered:false`. Add the mutation "delete the arm" to task 6.1.

- [ ] F3 minor openspec/changes/archive/2026-09-24-credential-boundary/design.md:127-131 D5 says the scans of 004 and 015 "read each file under `build/`". The 015 scan (src/tooling/bundleCredentials.test.mjs:207-217) reads non-test files under `src/` and `server/`, not `build/`. The 004 scan reads `index.html`, `build/` and `src/`, not `server/`. Correct the paragraph.

- [ ] F4 minor src/tooling/bundleCredentials.test.mjs:112-114 The sentinel scan skips every file under `dist/cesium/`. A plugin that emits a leak into `cesium/` passes 001, 002 and 016. The known-limits section does not name this. Name it as a known limit, or scan those files for the sentinel text.

- [ ] F5 minor src/tooling/bundleCredentials.test.mjs:191-197 (and :99) The 004 scan reads `index.html`, `build/` and `src/` only. The real build copies `public/` (svg, glb) into the bundle, but the fixture sets `publicDir: false` and the scan skips `public/`. A key-shaped literal in `public/` passes. The known-limits section does not name this. Add the directory to the scan, or record the limit.

- [ ] F6 minor openspec/changes/archive/2026-09-24-credential-boundary/specs/credential-boundary/spec.md:81-86 (code at src/data/placeProviderPayloads.js:117-129 and 145-166) Scenario 012 does not describe behavior that the code does and the tests assert (src/googleGeocodeProxy.test.mjs:368-448):
  - A point or a box without finite `lat` and `lng` becomes null, and a box with one good corner becomes null.
  - An empty result gets default values for each field.
  - The line "a bad input gives `{status:null, results:[]}`" is wrong for `{status:'OK', results:'nope'}`. The code and its docstring give `{status:'OK', results:[]}`.
  Add AND lines for these rules, or narrow the "bad input" wording.

- [ ] F7 minor src/googleGeocodeProxy.test.mjs:185 (code at server/providers/places/geocode.js:55) The 010 tests check 257 characters but not exactly 256. The mutation `>` to `>=` in `address.length > GEOCODE_MAX_ADDRESS_LENGTH` passes. The body-size boundary got an exact-size test, but the address length did not. Add a 256-character address that the route accepts.

- [ ] F8 minor docs/CURRENT-STATE.md:474-476 The text says `projectGeocodeResults()` keeps "Google's own field names and caps every list, so only the transport changed at both call sites". `reverseGeocode` in src/voice/gevActions.js:2940-2948 now remembers `configured:false` and refuses to remember an error answer. That is more than a transport change. This file is outside the diff, but the changed line at gevActions.js:2947 makes the text wrong. Correct the sentence.

- [ ] F9 minor openspec/changes/archive/2026-09-24-credential-boundary/tasks.md:128-134 The round-1 finding F17 is not corrected. Tasks 9.1 to 9.5 are unchecked, although the gate output shows lint, ratchet and gates ran. No file records a run of the mutations that tasks 3 to 8 list. Check 9.1 to 9.4. Run the mutations on the final tree, record each result, and then check 9.5 before the merge.

Round-1 corrections that I checked and found right:
- **F1 and F3, key selection and shared limiter:** these now run through `googlePlacesContextProxy()`. `src/googleGeocodeRateLimit.test.mjs` runs in its own process, as `scripts/run-unit-tests.mjs` and `gates.mjs` run one file at a time.
- **F2, body size:** valid JSON bodies of 1 MB plus 1 byte and exactly 1 MB, with the fixed error text.
- **F4, fixture build:** it uses the full production config and `standalonePlugins()`.
- **F7, error caching in `reverseGeocode`:** each operand of `response.ok !== false && data.status != null` is discriminated by a test.
- **F12, key in error text:** the redaction and the fixed error texts are tested, including the 5 s body timeout.
- **D7 waiver:** the arithmetic holds. I counted 14 tests, 19 `finally` runs and 2 `catch` runs, and line 2975 is `} finally {`.
- **Trace and ledger:** links.json and the history lines 588-613 match the current tests, and all history lines name this change.
- **Synced spec:** openspec/specs/credential-boundary/spec.md matches the change delta.
