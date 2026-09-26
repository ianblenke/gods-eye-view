## Context

The gate starts each test file in a child process. The guard records each live `Timeout` or `Immediate` at process exit. A record stops the gate with `GATES-TEST-LEAK`.

## Decision

The change edits `src/tooling/previewServing.test.mjs` only. The test waits 60 ms after each Vite server closes. The test keeps each assertion and name.

Vite sets a 50 ms crawl timer after a dev request. Its `cancel()` sets a flag but does not clear an armed timer. A temporary `async_hooks` hook found this timer live after `server.close()`. The hook also found an undici `Immediate` after a local `fetch` request. The 60 ms wait gives both resources time to end.

## Evidence

The test uses the gate preload and environment in a separate process for each run. The run uses the gate test flags. Sixteen busy Node processes give the CPU load. The local check reads the guard record from each run.

Before the change, 30 plain runs had 0 leaks and 0 failures. Before the change, 100 loaded runs had 0 leaks and 0 failures. The baseline used a dot reporter instead of the gate trace reporter.

After the change, 30 plain runs had 0 leaks and 0 failures. After the change, 100 loaded runs had 0 leaks and 0 failures. These runs used the gate trace reporter.

A temporary development test exits immediately after the server closes. With the wait removed, its guard found an `Immediate` in five of five runs. With the wait, its guard found no leak in five of five runs. The scratch test does not prove the source of the CI `Timeout`.

Ten plain runs of `src/voice/gevActions.test.mjs` had no leak and no failure. No timer stack links that file to the Vite test.

## Gate Checks

The test process must leave no live timer. STE lint checks these documents. The format check checks the test file. The gap ledger has no new gap.

## Risks

- `node-version`: Node 26 can use timers in a way that differs from Node 24.
- `ci-load`: The CI runner can use a different load.
- `local-rate`: The baseline has no leak, so the local rates alone cannot prove that the wait fixes the CI failure.
- `voice-test`: The earlier voice `Immediate` has no known owner. This change does not test a fix for it.
