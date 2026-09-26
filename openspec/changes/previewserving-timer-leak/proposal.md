## Why

The Spec gates job found a live `Timeout` after `src/tooling/previewServing.test.mjs` ended. The file starts real Vite servers and sends local HTTP requests. The gate checks live timers at process exit.

## What Changes

The test waits 60 ms after each Vite server close. The change keeps each test name and assertion. It changes no product code and adds no spec delta.

## Impact

- Changed file: `src/tooling/previewServing.test.mjs`.
- The file has two old test names in `openspec/trace/gaps.json`. This change opens no gap and closes no gap.

## Known Limits

- `node-version`: The local test uses Node 26. The gate uses Node 24.
- `ci-load`: A local CPU load does not give the same load as the CI runner.
- `local-rate`: The unchanged test left no live timer in 100 loaded runs on this host.
- `voice-test`: Ten plain runs of `src/voice/gevActions.test.mjs` had no leak. Its earlier `Immediate` needs separate proof before a fix.
