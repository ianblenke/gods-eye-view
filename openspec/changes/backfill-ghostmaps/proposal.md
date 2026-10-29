## Why

This backfill change records the GhostMaps layer at commit `b5a64127667c22af8c68b53706e9f27d866acac0`.
The layer shows S2 Underground products from the GhostMaps repository.
The layer id is `s2-ghostmaps`.
The token is `03`.

## What Changes

- Add the `ghostmaps` capability.
- Add tests for current behavior.
- Add scenario tags to old tests where the title meets the word rules.
- Check the tests with mutations.
- Do not change production code or QA scripts.

## Capabilities

### New Capabilities

- `ghostmaps`: The proxy, catalog, KML data, report fields, source and browser layer.

### Modified Capabilities

None.

## Impact

The scope includes the proxy, the application factory and the browser modules in `src/layers/ghostMaps/`.
The change adds only specs and tests for old code.
The ledger sweep finds 23 old GhostMaps tests.
The sweep reads each GhostMaps entry in `untracedTests` from `openspec/trace/gaps.json`.
The design records the sweep commands, coverage evidence and known limits.

The pack and share paths in the request do not belong to this capability.
This change does not edit them.

The new test files keep the upstream class of their adjacent modules.
They test code from the upstream sync and do not add runtime modules.
