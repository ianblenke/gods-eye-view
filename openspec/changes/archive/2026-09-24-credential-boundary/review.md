# Review: credential-boundary

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-09-23
Gates: make gates CHANGE=credential-boundary passed
Rounds: 3
Scope: diff 938df29
Reviewed-Tree: c0063c18f66d1191f3f4ad1616e36106aa5e5371e39593640f6c958366d6fbe3

## Findings

- [x] Round 1 spec-adversary F1 (critical): the `credential-boundary-008` table gave the route its own key resolver, so it checked itself. The test now installs the route through `googlePlacesContextProxy()` and runs the real resolver for four key rows. `resolveApiKey` is a required option of the installer, so no default stays untested.
- [x] Round 1 spec-adversary F2, F3, F8 (major): the 1 MB limit had a body that was not JSON, no test showed that the route shares the Places rate limiter, and the 405 test did not stub the fetch. Now a body of 1 MB plus 1 byte and a body of exactly 1 MB, a new test file `googleGeocodeRateLimit.test.mjs`, and a 405 test with zero fetch calls.
- [x] Round 1 spec-adversary F4, F5 (major): the fixture build kept only two fields of the config, and the scans read only `.js` files. The fixture builds with `standalonePlugins()` and the full config. The scans read every file that is not a test file.
- [x] Round 1 spec-adversary F6 (major): the previewServing row asserted only a status. A new tagged test checks the body, `no-store` and zero upstream calls on the real servers. The old test of that file is the text of `main` again, because the STE lint rejects "terminate" in a tagged name and an existing test keeps its name.
- [x] Round 1 spec-adversary F7 (major): `reverseGeocode` remembered an HTTP error answer. It now remembers only a `configured:false` answer and an answer with a Google status.
- [x] Round 1 spec-adversary F9 to F12 (minor): 010 now says that the check of the key comes first, the blank address, the 5 s timeout and the body that is not JSON have tests and scenario lines, each component and box keeps only named fields, and the route removes the key from the error text of Google.
- [x] Round 1 spec-adversary F13 (minor): the edited untraced tests keep their untraced names. A relative-URL mistake of this change kept one annotationResolver test from reaching its subject; it is corrected. Two new 013 tests check the route error answers.
- [x] Round 1 spec-adversary F14, F15 (minor): the 006 scan finds destructured, bracket and quoted reads, with a positive control and a fixture for each form. The 001 tests compare with the three literal sentinel names.
- [x] Round 1 spec-adversary F16 to F20 (minor): the Impact section lists the gaps that the change closes, the tasks are checked, the two prose files are corrected, the 014 URL test sets the browser key, and the lint has 0 errors. The STE-ING warnings that stay are the technical name "geocoding" and check-only warnings.
- [x] Round 1 ste-adversary S1 to S9 (major): the scan scope, the fixture text, the 010 WHEN, the 008 mutation, the Impact lists, the maximum list lengths, the claim about the browser key, "no verdict" and the requirement text. All rewritten to agree with the code.
- [x] Round 1 ste-adversary S10 to S33 (minor): rewritten in the same pass, and the round-2 STE review did not raise them again. S31 is kept in this form: the previewServing test keeps its name from `main`, and a new tagged test says "the real dev and preview servers answer the geocode route with the keyless answer".
- [x] Round 2 spec-adversary F1 (major): a keyless POST got no test. The 405 test now sends one, and checks that the route does not read the key. Moving the method check below the key check fails it.
- [x] Round 2 spec-adversary F2 (major): the 013 route-error tests passed without the `ok:false` arm. They now send bodies that give `answered:true` when the search reads them. Deleting the arm fails the test.
- [x] Round 2 spec-adversary F3 to F9 (minor): D5 states the scans exactly, the two known limits `bundle-scan-skips-cesium` and `public-folder-not-scanned` are added, 012 states the point, box and default rules, an address of exactly 256 characters has a test, the sentence of CURRENT-STATE.md is corrected, and tasks 9.1 to 9.5 are checked.
- [x] Round 2 ste-adversary S34, S35, S36 (major): the scan text of D5, the files that the 006 scan reads (`.js` and `.mjs`), and the geometry line of 012. All rewritten.
- [x] Round 2 ste-adversary S37 to S59 (minor): corrected in the spec, proposal, design and tasks. S39, S54 and S55 were first corrected at the places that the finding names; round 3 found the rest in design.md (S65 to S69), and they are corrected now.
- [x] Round 2 ste-adversary S40 (minor): kept. One word for "answer" or "response", and for "call" or "request", in all prose and test names would change tests in other files.
- [x] Round 2 ste-adversary S46 (minor): kept. The review process (`.claude/commands/opsx/review.md` step 11) reads the section "Known limits and later changes".
- [x] Round 2 ste-adversary S60 (minor): kept. "Fixed error text" means the same text each time, and the change uses it in that meaning everywhere.
- [x] Round 3 spec-adversary F1 (minor): the tests of 012 send one point with a bad `lat` and one box with no `southwest`. Two edits pass them. Recorded as the known limit `projection-partial-points`.
- [x] Round 3 spec-adversary F2 (minor): the browser still sends a request to Photon when the route gives no place. Recorded as the known limit `photon-fallback-from-browser`.
- [x] Round 3 spec-adversary F3 (minor): some code tasks come before the test tasks of their scenario. Recorded as the known limit `tasks-order-code-before-test`.
- [x] Round 3 spec-adversary F4 (minor): the mutation report below records the result of each mutation of task 9.5.
- [x] Round 3 ste-adversary S61, S65 to S73 (minor): "gap" in task 2.2, the sentence about `.env` lines and the prefix, the hook that builds the fixture, the place of the `cesium/` sentence, the Photon sentence of D8, the forms of the 006 scan, "stops" and "breaks", "built output", "neither the registry nor `.env.example`" and the "also when" text of the proposal. All corrected in the proposal, the design or the tasks.
- [x] Round 3 ste-adversary S62, S63, S64 (minor): kept. They name the text of scenario 010. The review process corrects minor STE findings in the proposal and the design; a change of the spec text changes the hash of 010 and needs a new round, and the limit of three rounds is reached.
- [x] Scope: round 1 read the whole change. Round 2 read the diff since commit `90ffba9`, and round 3 read the diff since commit `938df29`. Each commit is the tree that the round before had read; the change documents were compared with their text in the same commit.
- [x] Trace: the ratchet measured the V8 drift of `src/data/labelArbiter.js` in each run. That drift is not an edit of this change, so its entry and its history lines stay equal to `main`.
- [x] Waiver: one waiver for `src/voice/gevActions.js`, 1 branch at line 2975. Its evidence (D7) is the raw V8 range, the marker counts, and the comparison of the report with the report of `main`, record by record. Three skeptics could not refute it, and both reviewers checked it again in round 2.

## Coverage of the changed code files

The gates ran in the Docker image (Node 24). Each line gives the lines, branches and functions that the tests cover, out of the total, and the ledger entry.

- [x] `server/providers/places/geocode.js`: 151 of 151 lines, 55 of 55 branches, 7 of 7 functions. No ledger entry.
- [x] `server/providers/places/coordinates.js`: 24 of 24 lines, 18 of 18 branches, 1 of 1 functions. No ledger entry.
- [x] `server/providers/places.js`, `server/providers/places/google-key.js` and `src/standalone/placeSearch.js`: complete. No ledger entry.
- [x] `build/vite.js`, `server/standalone/vite.config.js`, `server/providers/places/google.js` and `src/data/placeProviderPayloads.js`: the not-covered counts equal the ledger entry of `main` (2, 1, 10 and 5 branches).
- [x] `src/search/google.js`: 3 branches not covered, down from the 4 of the entry.
- [x] `src/voice/gevActions.js`: 222 branches not covered against 221 of the entry, and the waiver allows the one branch at line 2975. Its lines went from 1304 to 1230 not covered, and its functions from 65 to 61.

## Mutation report

Each mutation ran on the final tree, in one session, in a private copy. The tests of the file ran with `node --test` on the host (Node 26), and each mutation was restored after its run. All baselines passed. Each of the 49 mutations failed one or more tagged tests.

- [x] Geocode: no keyless return: `credential-boundary-007` failed.
- [x] Geocode: drop no-store in sendJson: `credential-boundary-007`, `credential-boundary-008`, `credential-boundary-010`, `credential-boundary-011` failed.
- [x] Geocode: drop the both-modes check: `credential-boundary-010` failed.
- [x] Geocode: address without .trim(): `credential-boundary-010` failed.
- [x] Geocode: address length > to >=: `credential-boundary-010` failed.
- [x] Geocode: timeout 5000 to 1000: `credential-boundary-011` failed.
- [x] Geocode: maximum body 1 MB to 1.5 MB: `credential-boundary-011` failed.
- [x] Geocode: maximum body 1 MB to 512 KB: `credential-boundary-011` failed.
- [x] Geocode: catch answers 500: `credential-boundary-011` failed.
- [x] Geocode: read error sends error.message: `credential-boundary-011` failed.
- [x] Geocode: drop the key redaction: `credential-boundary-011` failed.
- [x] Geocode: 502 sends error.message: `credential-boundary-011` failed.
- [x] Geocode: limiter never refuses: `credential-boundary-011` failed.
- [x] Geocode: 405 body with configured:false: `credential-boundary-010` failed.
- [x] Geocode: keyless answer makes an upstream call: `credential-boundary-007` failed.
- [x] Geocode: method check below the key check: `credential-boundary-010` failed.
- [x] Geocode: key read before the method check: `credential-boundary-010` failed.
- [x] Google.js: browser-key-only resolver for the route: `credential-boundary-008` failed.
- [x] Google.js: route has no rate limiter: `credential-boundary-011` failed.
- [x] Google.js: route has its own limiter: `credential-boundary-011` failed.
- [x] Google-server-key: browser key only: `credential-boundary-008` failed.
- [x] Projection: 13 results: `credential-boundary-012` failed.
- [x] Projection: component types not shortened: `credential-boundary-012` failed.
- [x] Projection: geometry.location kept whole: `credential-boundary-012` failed.
- [x] Projection: box with one good corner: `credential-boundary-012` failed.
- [x] Projection: status kept when not a string: `credential-boundary-012` failed.
- [x] Bundle: plugin writes the server key into index.html: `credential-boundary-001`, `credential-boundary-016` failed.
- [x] Bundle: plugin widens envPrefix: `credential-boundary-001`, `credential-boundary-002` failed.
- [x] Build: envPrefix removed: `credential-boundary-001`, `credential-boundary-002`, `credential-boundary-003` failed.
- [x] Build: third define name: `credential-boundary-003`, `credential-boundary-005` failed.
- [x] Scan: key literal in src/keySetupCore.mjs: `credential-boundary-004` failed.
- [x] Scan: key literal in a .json file under src/data: `credential-boundary-004` failed.
- [x] Scan: geocode host in a .css file: `credential-boundary-015` failed.
- [x] Scan: geocode host in src/keySetupCore.mjs: `credential-boundary-015` failed.
- [x] Registry: destructured read of an undocumented name: `credential-boundary-006` failed.
- [x] Registry: bracket read of an undocumented name: `credential-boundary-006` failed.
- [x] Registry: dotted read of an undocumented name: `credential-boundary-006` failed.
- [x] Reverse lookup: remember an HTTP error answer: `credential-boundary-014` failed.
- [x] Reverse lookup: never remember null: `credential-boundary-014` failed.
- [x] Reverse lookup: do not remember configured:false: `credential-boundary-014` failed.
- [x] Reverse lookup: browser key in the URL: `credential-boundary-014` failed.
- [x] SanitizeLabel: no replacement: `credential-boundary-014` failed.
- [x] SanitizeLabel: no DEL: `credential-boundary-014` failed.
- [x] SanitizeLabel: < 0x1f: `credential-boundary-014` failed.
- [x] SanitizeLabel: >= 0x7f: `credential-boundary-014` failed.
- [x] Search: delete the ok:false arm: `credential-boundary-013` failed.
- [x] Search: configured:false gives answered:false: `credential-boundary-013` failed.
- [x] Search: HTTP error gives answered:true: `credential-boundary-013` failed.
- [x] Preview: stub answer before the route, no no-store: `credential-boundary-007` failed.
