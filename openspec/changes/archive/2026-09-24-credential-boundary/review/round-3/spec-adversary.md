Verdict: PASS

Tree read: /home/ianblenke/docker/gev-cred, working tree of branch credential-boundary. I checked it against cb-r3.diff (the change since 938df29). I have no shell in this run, so I could not run `git`, any test or any mutation. Every conclusion comes from reading the code, the tests, `links.json`, `gaps.json` and `ids.json`.

Gate output: `REVIEW-MISSING` is the one error, and it clears when `review.md` exists. The 269 STE warnings can only be the `STE-PASSIVE` and `STE-ING` heuristics. The output does not list them, so I could not tell whether any come from this change's files.

Round-2 corrections I checked and found right:
- **F1:** the keyless POST test asserts 405, the same body, `no-store` and `keyReads === 0`. Task mutation 8 (method check below the key check) fails on it.
- **F2:** the 429 case sends `{status:'ZERO_RESULTS',results:[]}` and the 502 case sends `{configured:false,...}`.
  - Deleting the `response.ok === false` arm gives Google `answered:true` for both bodies.
  - Photon's empty miss also gives `answered:true`, so the combined answer is `answered:true`. The `deepEqual` to `answered:false` then fails.
  - Mutation 2 (`answered:true` on an HTTP error) fails the same way.
- **F3, F6, F7:**
  - The D5 scan text now matches `bundleCredentials.test.mjs:191-217`.
  - Spec 012 now matches `projectGeocodePoint`, `projectGeocodeBox` and `projectGeocodeResults`.
  - The exact-256 test fails under `>=`, and it fails when the limit constant is 255.
- **F4, F5:** the two new known limits match the code. The `cesium/` filter is at `bundleCredentials.test.mjs:112-114`, and `publicDir: false` is at `:99`.
- **F8:** the `docs/CURRENT-STATE.md` sentence matches `gevActions.js:2940-2948`.
- **F9:** tasks 9.1 to 9.5 are checked. Gate output confirms lint, ratchet and gates ran; I could not check the mutations.
- **Spec sync:** `openspec/specs/credential-boundary/spec.md` matches the change delta line for line. The new and renamed tests are in `links.json`. No `history.jsonl` line changed: lines 588 to 613 are the same 26 lines and all name this change. No retired ID is used. The two `gaps.json` entries agree with D7 and D8: `google.js` has 3 branches, and `gevActions.js` has 222 of 847.

Findings (minor, all four open for the bundle):
- [ ] F1 minor /home/ianblenke/docker/gev-cred/openspec/changes/archive/2026-09-24-credential-boundary/specs/credential-boundary/spec.md:88 The new line "a point or a box with a coordinate that is not a finite number gives null" is only partly asserted (test at src/googleGeocodeProxy.test.mjs:390-444, code at src/data/placeProviderPayloads.js:119 and :128). The test sends one point with a bad `lat`, one box with no `southwest`, and one viewport that is a string. Two edits pass every test:
  - Remove `Number.isFinite(point?.lng)`.
  - Change `northeast && southwest` to `southwest`.

  Add a point with a good `lat` and a bad `lng`. Add a box with a good `southwest` and a bad `northeast`. Then add both mutations to task 5.2.
- [ ] F2 minor /home/ianblenke/docker/gev-cred/openspec/changes/archive/2026-09-24-credential-boundary/specs/credential-boundary/spec.md:93 The MUST of "Browser geocoding" says the browser sends geocoding requests "only to `/api/google/geocode`". The Photon fallback in scenario 013 sends browser requests to `photon.komoot.io`, and the 013 test asserts that hostname. The Purpose line has the same problem (spec.md:4, and openspec/specs/credential-boundary/spec.md:4 and :96). This text is outside the changed lines, so correct it or record it as accepted. To correct it, write "Google geocoding requests" in the requirement and the Purpose, in the change spec and in the synced spec.
- [ ] F3 minor /home/ianblenke/docker/gev-cred/openspec/changes/archive/2026-09-24-credential-boundary/tasks.md:39-40 The split makes the order explicit. Task 4.3 (code: export `standalonePlugins()`) comes before task 4.4 (test: build the fixture with it). For the requirement "Browser bundle inputs" (Origin spec-first), some test tasks (4.4 to 4.7) come after code tasks (4.2, 4.3). Tasks 5.11, 6.4 and 6.7 have the same order. The gates do not check task order (`spec-lint.mjs` only checks that a task names each ID). Move 4.4 before 4.3, or record the order as accepted.
- [ ] F4 minor /home/ianblenke/docker/gev-cred/openspec/changes/archive/2026-09-24-credential-boundary/tasks.md:140 Task 9.5 is checked, but no file in the repository records the result of the 50 mutations. Round-2 F9 asked to "record each result". Put the mutation list and its results in `review.md` (task 9.7). Do this before anyone reads the checked box as proof.
