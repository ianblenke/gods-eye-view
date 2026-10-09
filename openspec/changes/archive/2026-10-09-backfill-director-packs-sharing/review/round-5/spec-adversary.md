Verdict: FAIL

Tree read: /home/ianblenke/docker/gev-work/director-3, branch backfill-director-3, commit 174779a731c3cd91924dd32a2aae92dbb03d58fa (read from `.git/refs/heads/backfill-director-3`). Scope: `diff 2b3ced9f`. I ran no code, because I have only Read, Grep and Glob.

- [ ] FINDING major openspec/specs/director/spec.md:1130 Clause director-110 "Without layer IDs, the preview reports every named layer as absent" (delta spec.md:419) is asserted with one named layer only. Every `missingLayers` assertion in sharing.test.mjs has at most one element: `['1']` at :362, `['traffic']` at :558 and :1405, `['ships']` at :1252 and :1483, `[]` at :1399, `['later']` at :2735. The loop `.filter((id) => !layers.has(id))` at src/director/sharing/preview.js:36 is also missing from the loop table (audit.md:393-430). Edit: append `.slice(0, 1)` to the `.filter` result at preview.js:36. All tests pass, and no hand row or Known limit names this edit. Killing the input-side narrowing is not enough (tests at :1243 and :1475 do kill that). Add a test with two absent layers and no `layerIds`. For example, use a shot with `layers: { traffic: true, ships: true }` and expect `['traffic', 'ships']`. Add a loop-table row for preview.js:36 with a hand row.

- [ ] FINDING minor src/director/packs/session.js:41 The registry copies `new Map(Object.entries(sources))` and `new Map(Object.entries(adapters))` (:41-42) have no second-entry test. This traversal is not in the loop table. Every session test registers exactly one source key and one adapter key (backfill.test.mjs:66-67, :1349, :2160-2200, :3177; packs.test.mjs:184-190, :212, :239, :264, :287, :320). Edit: `Object.entries(adapters).slice(0, 1)` passes all tests. So does an adapter lookup that takes the first entry instead of `adapterMap.get(pack.format)`. The app registers several entries (src/scenes/dataPacks/controller.js:7-10). Add a test with two sources and two adapters (a geojson pack and an image pack, in two sources). Add a loop-table row, or name this as a limit.

- [ ] FINDING minor openspec/changes/archive/2026-10-08-backfill-director-packs-sharing/audit.md:395 "The table covers each collection loop in the seven source files" is false. These traversals are absent from the table:
  - `Object.keys(shot.layers || {})` at preview.js:33, and the Set spread at preview.js:31-36. A test kills the key narrowing (sharing.test.mjs:1475), but there is no row.
  - The per-byte hex `Array.from` mapper at session.js:124 and bundle.js:26.
  - The base64 `Uint8Array.from` mapper at bundle.js:46.
  - The `.filter` at preview.js:36 (see the major finding above).
  - The `Object.entries` registries (see the previous finding).
  
  The three mapper cases are killed by positive digest and byte tests, so I found no fault there. Add rows, or change the claim to "each loop with a per-item check or call over scenes, shots, packs, anchors, assets, features, positions or rings".

- [ ] FINDING minor openspec/changes/archive/2026-10-08-backfill-director-packs-sharing/audit.md:218 The closed-sets table lists three sets. It omits the allowed-field lists, which are also closed sets: manifest.js:34-43, :48, :51, :84-92 and bundle.js:78, :86. Every extra-field test uses the key name `extra` (backfill.test.mjs:96, :101, :437, :441, :448, :472; sharing.test.mjs:171, :2030, :2253, :2277, :2314). Edit: adding any other name to an allow list, for example `'script'` in `['adapter', 'path']`, passes all tests. The proposal's "Known limits and later changes" section does not name this either. Name the limit in audit.md and in proposal.md, or add a second extra key per list.

**What I checked and found clean**

- **Counters for the abort tests.** I traced them against bundle.js:63, :85, :94, :144, :154 and :161.
  - The import test at stopAt 4 gives digests 1 and checks 4. Hoisting the check at :85 (m409) moves the throw after the second digest, so it fails.
  - The export test at stopAt 4 asserts `calls === 1`. m410 gives calls
  [the channel cut the text here; part 2 follows]

Checked and clean, continued:
- Abort counters. Stream test (source.js:22, :42; third call throws) gives reads 1. Moving the check after the read gives reads 2. After-digest tests (stopAt 5 import, 6 export) fail if the check at :94 or :161 is removed or moved before the digest. m447 and m448 also hoist one check, but a pure removal is killed too (counts 3 and 4, never reach 5 or 6).
- Shot loop: slice(0,1), slice(1), slice(0,-1) and the shots[0] path (m411, m412) all fail the literal `$.shots[1].dataPackIds` message.
- Closed sets: file:///assets/ passes every other condition at source.js:9-16, so only the protocol list rejects it. The nine MIME types each have an accept test for export and import (sharing.test.mjs:1647-1748). The SVG test covers both directions.

Answers to the brief:
1. Loop table completeness. All 32 file:line citations match the code. Missing rows: preview.js:36 `.filter` (no test with two absent layers; major), session.js:41-42 `Object.entries` registries (no test with two sources or adapters; minor), preview.js:33 `Object.keys` and the Set spread (tested at sharing.test.mjs:1475, row missing), the hex `Array.from` mappers at session.js:124 and bundle.js:26 and the base64 mapper at bundle.js:46 (killed by positive digest tests, rows missing). No recursion exists. lifetime.js has no loop (correct).
2. The 40 hand rows. I read all 40 old/new spans against the production files. Each pattern occurs once in its named file and the replacement is valid code. I did not run them. mutations.md:13648-13688 shows 40 KILLED; the only survivors are m172 and m389. The named tests assert what the rows need (m424, m427, m428, m429, m430, m433, m436 reviewed in the test files). Preview test: shots 3, packs 1, bytes 3, externalContent true, missingLayers ['later'] make m437-m444 fail one by one. Byte-chunk test: base64 length 43692 is the same with or without the second chunk, so the `AAD/` tail check is what kills m446, and it is present.
3. Scenario text against tests. Changed clauses checked: 076 second segment, 077 geojsonx and second pack, 080 each coordinate, 081 second anchor, 082 second shot and second ID, 084/085/087 second feature, coordinate, line position, ring, 088 second declaration, 093 second anchor, 094 file protocol, 097 two chunks, 099 nine types and SVG, 101 second scene, 104 second asset, 105 held unsafe path, 107 two-asset and two-pack clauses, 108 second scene/pack/shot/asset, 110 second shot. Each has a tagged test that fails for a fault. The one exception is 110 "every named layer" (the major finding).
4. Numbers. 3849 = 3718+64+3+64; 711 = 644+67; 260+711 = 971 = 840+127+4. Test additions: 16 backfill + 10 share. Loop table has 32 rows; 37 hand rows are cited in it, plus m413-m415 in the closed-set text = 40. Proposal line references (bundle.js:157, geojson.js:27, session.js:74 and :100) match the code. Production files unchanged in content versus the audit citations.
5. Trace. history.jsonl:2041-2052 all name this change. The "smaller" untraced entries leave one test each, matching the Known limit old-tests-outside-scope. links.json already holds the new and renamed titles (for example "segment access", "stops before the second asset"). Note: openspec/trace is not in your diff, so I could only check its current content, not when it changed.
6. Run names. "Final rerun" means the pass-5 run only (audit.md:57, :164, :259, :377; design.md:120, :141, :161). "Rerun after pass 4" is used at audit.md:91-117.

Read: the brief, the full diff except the large mutations.md and survivors.md bodies, the seven production files, all 40 hand rows in muts.json, the new tests and their neighbours in both test files, the main spec 940-1134, the proposal, the round-4 spec report, the trace greps above.

Not read or not verified: most of mutations.md (result list and diff head only); survivors.md (first hunk and spot greps); the saved result files director-3-final2/results-mutants*.json (Glob found no such directory, so the 51 and 123 regenerated labels are unchecked); the evidence logs; probe outputs except probe-registry-order and probe-extension; the QA scripts; the round 1 to 3 reports; STE wording. I ran no code.
