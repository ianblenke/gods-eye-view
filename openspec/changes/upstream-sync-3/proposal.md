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
- Keep the two render test cleanup blocks after the unchanged upstream check finds two leaked timers.
- Correct the token width and catalog count assertions for OSH and Street Level.
- Document the optional Gemini script credential and keep the credential inventory assertion.

The merge commit is `debfde0982ad21e3359340162dbca25d592c392f`.
Its second parent is the full upstream commit above. The upstream remote main check returned that commit on 2026-10-08.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- credential-boundary: Change Browser bundle inputs and scenarios `001`, `002`, `003`, `004` and `016` for three public credentials.

## Impact

The upstream diff from the shared ancestor changes 435 files. The design lists the conflict resolutions and host evidence.
The trace ledger records the upstream gaps. The image adopt run records 338 entries.
Those entries have gaps of 17811 lines, 2836 branches, 1060 functions and 1816 untraced tests.

No project adopt, ratchet or full gate command runs in this host task. The host lint command is the allowed exception.

Upstream adds Street Level, a public Mapillary token, voice comparison tools, default rate limits and browser security controls.
The fork keeps its OSH implementation files equal to the canonical base. Only the shared registration and boundary files need the fork additions.

## Known limits and later changes

The image must measure coverage and trace gaps. The lead must check the lock file and get both review results.
This host task creates no `review.md` and does not push.


## Pass 3 decision

Source commit: `07bf094e8df16abfe6e8b1847d2c1157b7e9ecf0`.
The third credential supports the Mapillary viewer and direct Graph API requests.
SECURITY.md states that the client token is public. The server provider uses the same token for tiles.
The browser helper receives it through `mapillaryToken`. The standalone config reads `MAPILLARY_CLIENT_TOKEN` from the environment.

The requirement now names three credentials. All five carried scenarios need changed tests with their scenario tags.
The fixture tests check the Mapillary sentinel. The literal scan checks the upstream shape `MLY|1|abc` and a synthetic sample.
The config tests check clear values and reject environment defaults. Secret credentials remain on the server.

### Nine upstream test edits

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

This task sends no upstream pull request.

### Production timer limits

Vendored production code still leaves bounded one-shot timers. Only the tests clear these leaked timers.
The pointerCrop deadline is 400 ms. The gevRealtime fixtures leave 56 metric deadlines and 10 narration deadlines before test cleanup.

### ranking-ceiling-not-measured

The analystEngine ceiling is 4000 ms. A linear slowdown below 10 times the old ceiling can pass.
The zero-ceiling fault proves the assertion, but does not measure that performance limit.

### Panel key coverage limit

The owner accepts that both sets of child processes omit `NODE_V8_COVERAGE`.
No counted test covers the winner arms in `server/mcp/panelKey.js`. The ledger keeps this gap.
The lead must record this acceptance in `review.md`.

### OSH token limit

OSH token `3` meets the next free upstream digit `3`. A later sync can need a new conflict resolution.

### Panel credential count

SECURITY.md and build-panel.mjs now name the same three browser credentials.

### Coverage measurement limit

Six files have smaller gaps between two measurements of the same tree.
The files are mapillary/tiles.js, bhoteKoshiEmbeddedMedia.js, flights/motion.js, military/queries.js, and flights and military rendering.js.
The two rendering files each lose two uncovered lines and one uncovered function.
The other four files each lose one uncovered function or branch.

Final gates and CI can return to the larger counts. The lead must check these tests in the image.
If the counts return, use a ledger-refresh change, as in sync 2. Do not weaken the gate.
