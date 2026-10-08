# Review: upstream-sync-3

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-10-08
Gates: make gates CHANGE=upstream-sync-3 passed
Rounds: 2
Scope: diff 58b2de7
Reviewed-Tree: 2e9c84ad4b001e60539601548fb63d0e83e2196cff5abb61f6cbdc36bdb33220

## Findings

### Round 1 (scope: full) - FAIL (spec-adversary FAIL, ste-adversary FAIL)

Full agent reports: `review/round-1/spec-adversary.md`, `review/round-1/ste-adversary.md`.

- [x] FINDING major (spec-adversary) The paid route `/api/google/geocode` did not call `admitSameSite`, so a cross-site page could spend the server key. Corrected: the route calls the gate first. The new requirement "Same-site geocode admission" has the scenarios `credential-boundary-017` and `credential-boundary-018` with tests, and `SECURITY.md` names the route.
- [x] FINDING minor (spec-adversary, 7 findings) The heading of the limits, a false comment in `mcpPanelKey.test.mjs`, the unmeasured ranking ceiling, six adopted files with smaller gaps, stale text and counts, the missing `?? ''` row for `build/vite.js`, and the `unmapped:` tags of five QA headers. Corrected in the proposal, the design, the tasks, the test comment and the QA headers (`pending:voice`, `pending:street-level`, `pending:application-shell`).
- [x] FINDING major (ste-adversary, 5 findings) The false comment about the race paths, the contradiction in the limits about the ranking ceiling, the ninth test fix that the candidate list lacked, the title of `osh-033` and the words "four public sentinels". Corrected.
- [x] FINDING minor (ste-adversary, 10 findings) Derived forms of an owner word, QA purposes, tasks with several instructions, -ing words, passive voice, second names, test titles, verbs used as nouns, and the Purpose text. Corrected, and the lead set the Purpose after the archive.

### Round 2 (scope: diff 58b2de7) - PASS (spec-adversary PASS, ste-adversary PASS)

Full agent reports: `review/spec-adversary.md`, `review/ste-adversary.md`.

- [x] FINDING minor (spec-adversary, 11 findings) The limits under the wrong heading, the order of two tasks, the counts of eight and nine files, the pins of the QA tags, the undefined terms "cross-site" and "same-site", the `@needs` line of the voice bench, the false claim about `build-panel.mjs`, the change of `qa-scripts-023`, the drift of totals for `tiles.js` and `google.js`, the bounds of the panel key limit, the named timer files, and three task faults. Corrected in the proposal, the design, the tasks and the QA headers, or recorded as the limits `qa-tags-not-pinned`, `site-terms-not-defined` and `spec-wording-minors`.
- [x] FINDING minor (ste-adversary, about 40 findings) Wording in the design, the proposal, the tasks, the new requirement, two test titles, two QA purposes and `SECURITY.md`. Corrected in the proposal, the design, the tasks and the QA headers. The findings in the spec, the test titles, the test comment and `SECURITY.md` need a new ratchet or are upstream text. They are recorded in the limit `spec-wording-minors`.

## Rule 21

- [x] The upstream remote has the second parent of the merge commit. The command `git ls-remote upstream main` returned `95fa816232456a6831172befa2f1b34b9ee73794` on 2026-10-08.
- [x] The merge commit `debfde0982ad21e3359340162dbca25d592c392f` has the parents `e2437f945215860c42b5d8bba6834c85f93a90ce` and `95fa816232456a6831172befa2f1b34b9ee73794`.
- [x] The command `adopt` ran with `--from 95fa816232456a6831172befa2f1b34b9ee73794`, which is the merged commit and not the merge commit. It recorded 338 files.
- [x] Resolved files: `.env.example`, `.github/workflows/ci.yml`, `SECURITY.md`, `build/vite.js`, `package-lock.json`, `package.json`, `scripts/package-boundaries.json`, `server/providers/local.js`, `server/providers/places/google.js`, `server/standalone/vite.config.js`, `src/app/constructCatalog.js`, `src/data/layerState.test.mjs`, `src/data/layerStateTokenLedger.test.mjs`, `src/locations.test.mjs`, `src/tooling/viteBuild.test.mjs`, `src/voice/gevRealtime.test.mjs`. The reviewers read the difference of these files from upstream.

## Accepted by the owner

- [x] The child processes of the two race tests in `src/tools/mcpPanelKey.test.mjs` start without `NODE_V8_COVERAGE`. No counted test covers the branches that only the winner of the race reaches in `server/mcp/panelKey.js` (lines 37, 49 and 108). The ledger records 7 uncovered branches and 1 uncovered function for the file. Accepted under the rigor boundary that Ian Blenke accepted on 2026-10-08: upstream code is vendored and adopted with its recorded gap.
- [x] The analystEngine ranking ceiling of 4000 ms does not measure a linear slowdown below 10 times the old ceiling (limit `ranking-ceiling-not-measured`). Accepted under the same rigor boundary.
- [x] The totals of six adopted files (`mapillary/tiles.js`, `bhoteKoshiEmbeddedMedia.js`, `flights/motion.js`, `military/queries.js`, `flights/rendering.js`, `military/rendering.js`) and of `google.js` can differ between runs. If the final gates or CI show other counts, the repair is a ledger-refresh change, as in sync 2. The merge owner checks CI on `main` after the push.
