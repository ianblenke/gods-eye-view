Verdict: PASS

Tree read: working tree of `/home/ianblenke/docker/gev-ci`, branch `ci-leak-cleanup` at 282ca08 (base b1267c6). This run had only Read, Grep and Glob, with no Bash, so I ran no mutation and no `node --test`. I could not run `git diff`. I compared test names against `openspec/trace/gaps.json` and `links.json` instead.

- [ ] F1 minor `openspec/changes/archive/2026-09-24-ci-leak-cleanup/design.md:16` The Non-Goals line says "Every leak is in test code, or in a library that a test starts." The 165 ms drip timer comes from production code in `src/layers/flights/enrichment.js:46`. The layer clears it only in `destroy` (`src/layers/flights/lifecycle.js:311`). Reword the line and name this in the Known limits: the mock hides a layer timer, and the fix is not a cleanup.

- [ ] F2 minor `openspec/changes/archive/2026-09-24-ci-leak-cleanup/proposal.md:22` and `tasks.md:12,19,25` The Impact line and tasks 2.3, 3.2 and 4.2 claim proof "with the gates in the Docker image" and "with the tracer in the gate image." The proposal's own Why says the image never showed either fault. A clean run there passes with or without the fix. The real evidence is the runner run in `design.md` D3. Reword these lines to name the runner run. Add a Known limit for two facts. A revert of `watch: null`, `optimizeDeps` or the mock still passes `make gates` locally. The tracer was a deleted temporary branch, so it is not in the repo.

- [ ] F3 minor `openspec/changes/archive/2026-09-24-ci-leak-cleanup/tasks.md:6` Task 1.3 "Name each live timer and the code that creates it" is checked. `proposal.md:30` says the tracer named no timer for `src/data/trafficTiming.test.mjs`. Uncheck 1.3 with a note, as `test-teardown-cleanup` did for its task 8.2. This is AGENTS rule 17.

- [ ] F4 minor `openspec/changes/archive/2026-09-24-ci-leak-cleanup/design.md:42` The line "no code file changes, so no coverage total moves" is imprecise. The archived review of `test-teardown-cleanup` (round 2, F2) flagged the same wording. The mock stops the drip callback (`enrichment.js:46-49`) from firing in `trackedModelRegime.test.mjs`. No other test covers it. `history.jsonl:11` records that file as an unstable range (lines 83-88, functions 3-4). The ledger entry at `gaps.json:4204` already sits at the worse end (88/21/4). Its function tolerance is 0, because the total of 16 is below 25. State this in the design. After `make ratchet`, confirm that `gaps.json` and `history.jsonl` add no line for this file.

- [ ] F5 minor `src/data/trafficTiming.test.mjs:334-341` The comment says the 750 ms wait exists because Vite's dependency-optimizer process and file watcher tear down late. This change turns both off in the same test, so the comment is now wrong. State the remaining reason for the wait, or record in `design.md` that it stays only as margin.

- [ ] F6 minor `src/data/trackedModelRegime.test.mjs:252` and `design.md:32`, `proposal.md:16`, `tasks.md:24` The docs say "the two fleet-loader tests" call the loader of "a flights layer". The loop body runs for `flights` and `militaryFlights`. The military layer has no timers and no enrichment (grep of `src/layers/military`), so the mock is a no-op there. After the mocked test, `flightState._enrichDripTimer` keeps a mock handle and one job stays in `_enrichQueue`. That state persists in the module-level flights layer for the rest of the process. No current test reads it. A later test in this file cannot dispatch enrichment or park a drip timer. Say this in the design.

- [ ] F7 minor `openspec/changes/archive/2026-09-24-ci-leak-cleanup/proposal.md:5` "This check is the first step of the Node 24, Node 26 and Windows jobs" is wrong. In `.github/workflows/ci.yml` it comes after checkout, setup-node, `npm ci` and `doctor` (verify job), and after the Pinokio install (Windows job). Say "first check step".

**Checked, and it holds**
- **Test names:** none changed. `gaps.json` lists the 32 names of `trackedModelRegime.test.mjs`, the 3 names of `trafficTiming.test.mjs` and the 2 untraced names of `previewServing.test.mjs`. Each matches the files exactly. `links.json` lists the `[credential-boundary-007]` name of `previewServing.test.mjs` for the third test. It also matches exactly.
- **Assertions:** I saw none that looked weakened or removed, but this is a read of the current files, not a diff.
- **Vite options, in `node_modules/vite` 6.4.3 (`dep-Dm0c1Wj2.js`):**
  - `noDiscovery: true` with an empty `include` makes `isDepOptimizationDisabled` true (line 14726), so no optimizer is created (line 48041).
  - The 200 ms timer is `setTimeout(..., 2 * debounceMs)` at line 47285. The 50 ms timer is `callCrawlEndIfIdleAfterMs` at line 48155. Both belong to the optimizer.
  - `server.watch: null` gives `createNoopWatcher` (line 38519 to 38531). The 1000 ms timer is the chokidar `readdir` throttle at line 22527.
  - `package.json` allows `^6.0.0` and the lockfile pins 6.4.3.
- **Mock timers:** the mock is the first statement of the test. That is before the timer is created, which was the fault of the discarded draft in `test-teardown-cleanup`. `enrichment.js:46` reads the global `setTimeout` at call time. `t.mock.timers.enable({ apis: ['setTimeout'] })` has precedent in `startupCamera.test.mjs:6`. `ENRICH_DISPATCH_GAP_MS` is 200, which fits the 165 ms tracer value.
- **Other timers in this test:** `src/sources/live/standalone.js` and `contract.js` arm no timer. `Date.now` is not mocked.
- **Other tests:** only `trackedModelRegime.test.mjs` queues enrichment through `_ensureModel`, and no test in that file waits on a real timer.
- **Other code:** no code under `server/`, `build/`, `scripts/` or `tools/` reads `server.watcher` or `optimizeDeps`. The `credential-boundary-007` scenario is unchanged. The `coverage-gate` requirement "Run exit" (048 to 050) covers the leak check, so no new scenario is needed. The 25 `"untrue": true` entries in `gaps.json` match the gate's "25 untrue."
- **Gate output:** the only error is REVIEW-MISSING, which is expected in round 1. The 300 STE warnings are not itemized, so I cannot say whether this change adds any. Task 5.1 (`make lint`) is still open. The ratchet (5.2) has not run. No `history.jsonl` line names this change yet.

**Not verified by execution**
- Mutation 1: remove `watch: null` from `previewServing.test.mjs`. By the Vite source, this leaves a 1000 ms chokidar `readdir` throttle timer live.
- Mutation 2: remove `optimizeDeps` from the same file. By the Vite source, this leaves the 200 ms and 50 ms timers live.
- Mutation 3: remove the `t.mock.timers.enable` line from `trackedModelRegime.test.mjs`. This leaves the 165 ms drip timer live.
- Each of these must be run in a private copy with `--import preload2.mjs --test-force-exit --test <file>`.
- For `trafficTiming.test.mjs`, no mutation can show the leak, because the tracer never named a timer there. `proposal.md:30` already records this.
- `prettier` and `format:check` were not run. By eye, the formatting of `src/tooling/previewServing.test.mjs` looks clean.
