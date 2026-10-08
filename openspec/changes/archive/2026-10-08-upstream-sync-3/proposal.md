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

### Ten upstream test corrections

Changes to upstream test files can cause conflicts at the next sync.
Each later sync must keep or replace these test corrections.
The test corrections are in these files:

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

The owner approved the first nine files as candidates for an upstream pull request. The owner has not decided on the tenth.
The tenth correction keeps the coverage count of this fork stable.
The corrected test keeps its old name and stays untraced, so the trace gate cannot see a later weakening of its new assertion.
This task sends no upstream pull request.

### Production timer limits

Upstream production code still leaves one-shot timers. Only the tests clear these leaked timers.
The recorded delays are 16 ms (streetLevel), 600 ms (locations), 400 ms (pointerCrop) and 0 ms (panelDock). The streetLevelControls test ends with one animation frame callback still open.

The gevRealtime fixtures end with 56 metric deadlines and 10 narration deadlines still open before test cleanup. The realtimeNarration fixture ends with one narration deadline and one metric deadline still open.
This change does not record the delays of these deadlines. Each timer calls its function once.

### ranking-ceiling-not-measured

The analystEngine ceiling is 4000 ms. A linear slowdown below 10 times the old ceiling can pass.
The zero-ceiling fault proves the assertion, but does not measure that performance limit.

### Panel key coverage limit

The owner accepts that the child processes of both race tests start without `NODE_V8_COVERAGE`.
The ledger records 7 uncovered branches and 1 uncovered function for `server/mcp/panelKey.js`.
Lines 37, 49 and 108 of that file hold the race branches that only the winner of the race reaches. No counted test covers them.

The other uncovered branches, such as the `throw error` branches at lines 34 and 106, are not race branches. The ledger keeps all of them.
The lead must record in `review.md` that the owner accepts this gap.

### OSH token limit

Upstream uses the digits 0, 1 and 2. OSH token `3` is the digit that comes next in the upstream allocation order.
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

The first run of the final gates found 7 uncovered functions in `server/providers/mapillary/tiles.js`, where the ledger records 6. The function at line 255 runs only when a tile file vanishes during a sweep.
In 8 image runs of 18 test files, only the process of `mapillaryProvider.test.mjs` ran it, in 7 runs. The correction of the sweep test in that file makes the function run each time.

The second run of the final gates found a branch total of 178 where the ledger records 179. The loop of `sweepTileDisk` changed its V8 ranges when a background sweep added one removal. The second correction keeps the removals above the breaks in the runs that we measured.

The 8 image runs use one test command for 18 files. The final gates run the whole project under more load, so the third run of the final gates is the proof. If it fails again, use a ledger-refresh change.

Only `tiles.js` has a repeated-run measure. The other five files rest on the ratchet and on the first run of the final gates, which agree.

A ratchet run also recorded changed totals for `server/providers/mapillary/tiles.js` (178 to 179 branches) and `server/providers/places/google.js` (61 to 62 branches).
No production code changed in these two files between the ratchet runs. The first test correction changed the sweep test, and that is part of why the total of `tiles.js` moved.
The branch total of tiles.js was 177, 178 and 179 in three measurements.

Totals can change between runs. The count tolerance applies only to files that have the content of the base commit.
The lead expects that it does not apply to these two files.

Final gates and CI can return to the larger counts or to other totals. The lead must check in the image the tests of the six files above and of `server/providers/places/google.js`.
If the counts return, use a ledger-refresh change, as in sync 2. Do not weaken the gate.

### count-shaped-test

The two extra tiles in the first disk sweep test exist to keep the V8 range counts of `tiles.js` stable.
V8 merges neighbouring ranges that have equal counts, so the ledger total depends on counts at run time.
The same effect can change the totals of the five other adopted files.
The planned change `vendored-coverage-tolerance` would remove the need for such a test shape.
Until then, a failure of this kind needs a test correction or a ledger-refresh change.

### spec-wording-minors

Review round 2 lists minor wording findings in two kinds of file. One kind needs a new ratchet after a change. The other kind has text from upstream.
The owner accepts these by name. A later change corrects them.

- `specs/credential-boundary/spec.md`: the words "install", "gate", "method" and "Mapillary token".
- The same file: one noun group in scenario `004` and the sentence about status `200`.
- `src/googleGeocodeProxy.test.mjs` lines 561 and 595: the two test titles have no article.
- `src/tools/mcpPanelKey.test.mjs` line 110: the words "race paths" name the race branches.
- `SECURITY.md` lines 35 and 79: one adjective from the owner list. It comes from upstream text and from an older fork sentence.
- Review round 3 lists wording findings that remain open. One is the verb "run" used as a noun in the older design sections.
- Two more are the place of the section "Final gates correction" and some noun groups. `review/ste-adversary.md` has the full list.

### qa-tags-not-pinned

The scenario `qa-scripts-023` and its test check the tag `pending:application-shell` for three scripts only.
The scripts `qa-street-level.mjs` (`pending:street-level`) and `qa-voice-bench.mjs` (`pending:voice`) can return to `unmapped:`, and the register test still passes.
The register advice ignores `unmapped:` scripts, so the advice will not show them to the author of a later spec.

### site-terms-not-defined

The scenarios `017` and `018` use the words "cross-site" and "same-site" with no definition.
The tests for `017` check that the route refuses four request shapes: a foreign `Origin`, `Origin: null`, `Sec-Fetch-Site: cross-site` and an `X-Forwarded-For` header.
The `X-Forwarded-For` header is a proxy header, not a cross-site header. The tests also check that the route refuses a POST request with a cross-site header before the method check.
No scenario says that the route admits a request with no `Origin` and no `Sec-Fetch-Site`.
