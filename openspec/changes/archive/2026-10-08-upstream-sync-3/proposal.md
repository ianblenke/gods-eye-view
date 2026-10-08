## Why

The owner requests routine syncs more often than once each week. The fork keeps upstream code as it is, with its recorded gaps.
The upstream branch has 255 commits after the shared ancestor `e7707d9a0f34d9fbffc300023c319f95caa5be30`.

The fork keeps OSH code in this project. No OSH code goes upstream.

## What Changes

- Merge upstream commit `95fa816232456a6831172befa2f1b34b9ee73794` into canonical base `e2437f945215860c42b5d8bba6834c85f93a90ce`.
- Resolve 16 content conflicts with upstream code and the small fork additions.
- Keep OSH registration, token `3`, package entries and the Taiwan preset.
- Keep the credential boundary, spec scripts and spec CI job.
- Add four-tag headers to five upstream QA files. Change the register test to expect 88 files.
- Keep the cleanup blocks in the two render tests after the unchanged upstream check finds two leaked timers.
- Correct the token width and catalog count assertions for OSH and Street Level.
- Document the optional Gemini script credential and keep the credential inventory assertion.

The merge commit is `debfde0982ad21e3359340162dbca25d592c392f`.
Its second parent is the full upstream commit above. The check of main on the upstream remote returned that commit on 2026-10-08.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- credential-boundary: Change Browser bundle inputs and scenarios `001`, `002`, `003`, `004` and `016` for three public credentials.
- credential-boundary: Add same-site geocode admission with scenarios `017` and `018`.
- osh: Correct the registry count in `osh-033` to 30.
- qa-scripts: Correct the script count in `qa-scripts-023` to 88. Check that three scripts name `pending:application-shell` in their covers tag.

## Impact

The upstream diff from the shared ancestor changes 435 files. The design lists the conflict resolutions and host evidence.
The trace ledger records the upstream gaps. The image adopt run records 338 entries.
Those entries have gaps of 17811 lines, 2836 branches, 1060 functions and 1816 untraced tests.

No project adopt, ratchet or full gate command runs in this host task. The host lint command is the allowed exception.

Upstream adds Street Level, a public Mapillary token, voice comparison tools, default rate limits and browser security controls.
The fork keeps its OSH implementation files equal to the canonical base. Only the shared registration and boundary files need the fork additions.

## Pass 3 decision

Source commit: `07bf094e8df16abfe6e8b1847d2c1157b7e9ecf0`.
The third credential supports the Mapillary viewer and direct Graph API requests.
SECURITY.md states that the client token is public. The server provider uses the same token for tiles.
The browser helper receives it through `mapillaryToken`. The standalone config reads `MAPILLARY_CLIENT_TOKEN` from the environment.

The requirement now names three credentials. All five carried scenarios need changed tests with their scenario tags.
The fixture tests check the Mapillary sentinel. The literal scan checks the upstream shape `MLY|1|abc` and a synthetic sample.
The config tests check clear values and reject environment defaults. Secret credentials remain on the server.

## Known limits and later changes

The image ratchet and the document gates ran after review round 1. Review round 2 passed with minor findings only.
The lead runs the final gates and CI, and writes `review.md`. The entries below are the limits of this change.

### Ten upstream test edits

Changes to upstream test files can cause conflicts at the next sync.
Each later sync must keep or replace these test corrections.
The owner approves test corrections as candidates for an upstream pull request.
The candidates are these files:

- `src/layers/streetLevel/index.test.mjs`
- `src/locations.test.mjs`
- `src/ui/panelDock.test.mjs`
- `src/ui/streetLevelControls.test.mjs`
- `src/voice/gevRealtime.test.mjs`
- `src/voice/pointerCrop.test.mjs`
- `src/voice/realtimeNarration.test.mjs`
- `src/data/analystEngine.test.mjs`
- `src/tools/mcpPanelKey.test.mjs`
- `src/tooling/mapillaryProvider.test.mjs`

This task sends no upstream pull request.

### Production timer limits

Upstream production code still leaves one-shot timers. Only the tests clear these leaked timers.
The recorded delays are 16 ms (streetLevel), 600 ms (locations), 400 ms (pointerCrop) and 0 ms (panelDock). The streetLevelControls test leaves one animation frame callback.

The gevRealtime fixtures leave 56 metric deadlines and 10 narration deadlines before test cleanup. The realtimeNarration fixture leaves one narration deadline and one metric deadline.
This change does not record the delays of these deadlines. Each timer fires once.

### ranking-ceiling-not-measured

The analystEngine ceiling is 4000 ms. A linear slowdown below 10 times the old ceiling can pass.
The zero-ceiling fault proves the assertion, but does not measure that performance limit.

### Panel key coverage limit

The owner accepts that the child processes of both race tests start without `NODE_V8_COVERAGE`.
The ledger records 7 uncovered branches and 1 uncovered function for `server/mcp/panelKey.js`.
Lines 37, 49 and 108 of that file are the branches that only the winner of the race reaches. No counted test covers them.

The other uncovered branches, such as the `throw error` branches at lines 34 and 106, are not winner branches. The ledger keeps all of them.
The lead must record in `review.md` that the owner accepts this gap.

### OSH token limit

Upstream uses the digits 0, 1 and 2. OSH token `3` is the digit that upstream allocates next.
A later upstream change can use `3` and cause a conflict. A later sync can need a new conflict resolution.
The next free digit in the merged tree is `4`.

### Panel build credentials

The panel build uses the standalone config, so it carries the same three browser credentials as the app.
SECURITY.md line 106 names the same three.

### Coverage measurement limit

Six files have smaller gaps between two measurements of the same tree.
The files are mapillary/tiles.js, bhoteKoshiEmbeddedMedia.js, flights/motion.js, military/queries.js, and flights and military rendering.js.
The two rendering files each lose two uncovered lines and one uncovered function.
The other four files each lose one uncovered function or branch.

The first final gates run found 7 uncovered functions in `server/providers/mapillary/tiles.js`, where the ledger records 6. The function at line 255 runs only when a tile file vanishes during a sweep. Under load, `mapillaryProvider.test.mjs` hit that race in 7 of 10 image runs, and alone it never did. The edit to the sweep test in that file makes the function run each time.

The last ratchet also records changed totals for `server/providers/mapillary/tiles.js` (178 to 179 branches) and `server/providers/places/google.js` (61 to 62 branches).
No code changed in these two files between the ratchet runs. The branch total of tiles.js was 177, 178 and 179 in three measurements.
Totals can drift between runs. The count tolerance covers only files with base content, so we expect that it does not apply to these two files.

Final gates and CI can return to the larger counts or to other totals. The lead must check the tests of these files in the image.
If the counts return, use a ledger-refresh change, as in sync 2. Do not weaken the gate.

### spec-wording-minors

Review round 2 lists wording minors in files that need a new ratchet or upstream text. The owner accepts these by name. A later change corrects them.

- `specs/credential-boundary/spec.md`: the words "install", "gate", "method" and "Mapillary token".
- The same file: one noun group in scenario `004` and the sentence about status `200`.
- `src/googleGeocodeProxy.test.mjs` lines 561 and 595: the two test titles lack an article.
- `src/tools/mcpPanelKey.test.mjs` line 110: the words "race paths" name the race branches.
- `SECURITY.md` lines 35 and 79: one adjective from the owner list. It comes from upstream text and from an older fork sentence.

### qa-tags-not-pinned

The scenario `qa-scripts-023` and its test pin `pending:application-shell` for three scripts only.
The scripts `qa-street-level.mjs` (`pending:street-level`) and `qa-voice-bench.mjs` (`pending:voice`) can return to `unmapped:`, and the register test still passes.
The register advice ignores `unmapped:` scripts, so a later spec would not show them.

### site-terms-not-defined

The scenarios `017` and `018` use the words "cross-site" and "same-site" with no definition.
The tests for `017` refuse four request shapes: a foreign `Origin`, `Origin: null`, `Sec-Fetch-Site: cross-site` and a forwarding header.
The forwarding header is a proxy signal, not a cross-site signal. The tests also refuse a POST request with a cross-site header before the method check.
No scenario says that the route admits a request with no `Origin` and no `Sec-Fetch-Site`.
