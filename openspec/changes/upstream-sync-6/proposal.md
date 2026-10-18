## Why

The owner wants a sync more often than once each week. On 2026-10-17 the owner told the lead to start the sixth sync.
Upstream has 622 commits after the fifth sync. The first-parent history of upstream has 90 commits in that range.
The commits add a Docker install path, interface text in Spanish and Russian, an Air quality layer and a GNSS integrity layer.
They also add three more Street Level providers, two server routes for geocoding and many fixes.

## What Changes

- Merge upstream commit `73aec2e6b2ecfa865ddb7cb8839fa2d40fd0eb66` into the plan commit. The plan commit has the base commit `1d6b70fc5cc761d0ef1b71be5688f47578610f0e` as its parent.
- Resolve the content conflicts in 43 files. `design.md` gives the resolution of each file.
- Give the two new upstream layers the next free share link tokens. The token of `gnss-integrity` is `7`, and the token of `air-quality` is `8`.
- Use the upstream geocoding routes `/api/google/geocode` and `/api/google/reverse-geocode`. Remove the fork route and its files.
- Keep the fork Docker files. Do not use the upstream Docker install path.
- Move the Taiwan and Tampa presets into the new upstream file `src/cityPois.js`.
- Mark the fork texts that the upstream text check finds, and add their Spanish and Russian text.
- Write again the fork tests that the merge breaks. `design.md` gives each test.
- Make six upstream test files end with no live timer, because the gates refuse a live timer at the end of a test process.
- Close the old gap of one branch in the owned file `src/layers/osh/index.js` with one more case in the test of `osh-control-031`. The change edits that file, so the file needs full coverage.
- Run the adopt command for each upstream file that the merge brings and that has a coverage gap.
- Merge the fork main commit `41add05cb89f1e5cec470e558cb4a03c8c871e6e` into the branch. That commit adds the change `html-code-lines`. Without it, the mark in `src/ui/templates/context.html` stops the ratchet with COVERAGE-DIFF.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `credential-boundary`: The fork route `/api/google/geocode` goes away, because upstream has its own routes. The change removes three requirements and adds the requirement "Browser geocoding routes".
- `qa-scripts`: The merge adds nine upstream QA scripts. The register test then checks 99 scripts.

## Impact

Outside the change folder, the merge commit changes 782 files compared with the base commit. It adds 258 files and removes 4 files.
Outside the change folder, the commits after the merge commit and before the merge of the fork main change 44 files. Two of these files are in `openspec/trace/`.
The merge of the fork main brings the 29 files of the change `html-code-lines`.

Rule 23: the owner approved on 2026-10-17 the removal of five owned paths from `openspec/ownership.json`.
The five paths are `server/providers/places/coordinates.js`, `server/providers/places/geocode.js`, `src/googleGeocodeProxy.test.mjs`, `src/googleGeocodeRateLimit.test.mjs` and `src/search/reverseGeocodeRoute.test.mjs`.
The file `src/googleGeocodeProxy.test.mjs` stays in the tree as an upstream file, because upstream adds a file with that name.
The upstream files that the merge adds are upstream code, because the fork does not write them. The manifest lists only paths that the fork writes.

The change edits these owned files: `.dockerignore`, `src/data/oshLayer.test.mjs`, `src/layers/osh/index.js`, `src/layers/osh/videoPlayer.js`, `src/layers/reticulum/index.js`, `src/tooling/bundleCredentials.test.mjs` and `src/tooling/spec/qaRegister.test.mjs`.
It also edits the registration tests of the layers Bee Maps Frames, Bee Maps Bursts and Reticulum Network.

Rule 25: the merge breaks fork tests with scenario IDs.
For the scenarios `credential-boundary-007` to `credential-boundary-015`, `credential-boundary-017` and `credential-boundary-018`, the change retires the scenario. The upstream geocoding code replaces the code of these scenarios, except two parts that stay true.
The new scenario `credential-boundary-019` has the text of `credential-boundary-015`, and its test is the old test with a new ID and a new file name.

The new scenario `credential-boundary-020` has the text of `credential-boundary-013`, with the condition of a browser key. The upstream forward lookup still uses the fork code in `src/search/google.js` for this behavior. Its five tests are the old tests of `credential-boundary-013` with the new ID and a browser key.

The change edits the tests of 17 other scenarios and keeps the scenario text. The scenarios are `beemaps-bursts-028`, `beemaps-frames-025`, `cyclones-021`, `cyclones-025`, `osh-033`, `perimeters-005`, `recent-imagery-023`, `recent-imagery-026`, `recent-imagery-027`, `recent-imagery-029`, `recent-imagery-044`, `recent-imagery-046`, `recent-imagery-047`, `recent-imagery-049`, `recent-imagery-053`, `reticulum-layer-018` and `wind-020`.

The upstream code adds no dependency. `package-lock.json` does not change.
The upstream code adds routes. The fork keeps them as upstream code with the adopt records.

## Known limits and later changes

- Known limit `host-node`: Host tests run on Node 26, and the image uses Node 24.21.0. Host coverage cannot replace the image measurement.
- Known limit `upstream-tokens`: An upstream share link with the token `3` or `4` opens the OSH layer or the Reticulum layer in the fork. In upstream the same tokens open GNSS integrity and Air quality.
- Known limit `last-digit`: The fork has one free digit token, `9`. A layer after that gets a token of two characters.
- Known limit `key-wiring`: No test calls `createStandaloneApplication()` in `src/standalone/application.js`. So no test fails when the line `resolveApiKey` goes away from that file. The line equals the upstream file.
- Known limit `docker-path`: The fork does not use the upstream Docker install path. The file `scripts/docker-start.mjs` comes from upstream and has no use in the fork.
- Known limit `fork-text`: The text check of upstream does not find all fork texts. Fork texts that the check does not find stay in English in the Spanish and Russian interface.
- Known limit `changelog`: Upstream now puts each new changelog entry in a file under `changelog.d/`. The fork still edits `CHANGELOG.md`, so the next sync can have a conflict there again.
- Known limit `osh-source`: The OSH layer is not in the catalog source contracts of upstream. This is older than this change.
