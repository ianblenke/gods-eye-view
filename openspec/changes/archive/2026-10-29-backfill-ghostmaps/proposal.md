## Why

This backfill change records the GhostMaps layer at commit `03be515cbbc11ee27a7445b8c628cbc06a1289fb`.
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
This backfill adds specs and tests for old code, with trace records and archive evidence.
The original ledger sweep finds 23 old GhostMaps tests.
The sweep reads the original ledger at commit `b5a64127667c22af8c68b53706e9f27d866acac0`.
The evidence names the command.
The design records the sweep commands, coverage evidence and known limits.

The pack and share paths in the request do not belong to this capability.
This change does not edit them.

The archived trace records include a totals change for `src/layers/streetLevel/view.js`.
This correction keeps that code and those trace records.
The limit is `ghostmaps-ratchet-noise`: the branch total changes between checks.

The new test files keep the upstream class of their adjacent modules.
They test code from the upstream sync and do not add runtime modules.

## Round one corrections

The correction reads commit `03be515cbbc11ee27a7445b8c628cbc06a1289fb`.
The tests check literal metadata, request arguments, distinct editions and each allocated image URL.
The scenario links separate supported routes from unsupported requests.
The evidence records the host measurements and each mutation result.

## Known limits

### Known limit `ghostmaps-phone-layout`

Unit tests cannot prove the phone panel width or horizontal overflow.
The browser script proves them.
The script is `scripts/qa-ghostmaps.mjs`.

### Known limit `ghostmaps-browser-horizon`

Unit tests prove local pin visibility with a fake viewer.
They cannot prove rendered pins behind the planet or their return in a real browser.
The browser script proves them.
The script is `scripts/qa-ghostmaps.mjs`.

### Known limit `ghostmaps-browser-pixels`

Unit tests cannot prove marker hits at the screen center or report card pixels.
The browser script proves them.
The script is `scripts/qa-ghostmaps.mjs`.

### Known limit `ghostmaps-live-repository`

Unit tests use local data and cannot prove the live repository or a real event connection.
The browser script proves them.
The script is `scripts/qa-ghostmaps.mjs`.

## Round two corrections

The correction reads commit `9714441e9f3cc9fe4348d09a63ddba7f31f538f8`.
The tests distinguish product ids, versions, file bytes, storage keys and image URLs.
The tests check each remote request with a present and absent token.
The tests check initial card and chip states before each action.
The evidence records each review mutation and the systematic sweep.

## Host measurements

The host suite passes 285 tests, with 284 tagged tests.
The delta contains 68 scenarios.
The mutation spec contains 527 cases: 507 killed cases and 20 documented equivalents.
The audit contains 170 rows, with 0 open rows.

The systematic sweep checks 284 tests across 7 files.
The commands below supply these values.

```bash
cd /home/ianblenke/docker/gev-work/ghostmaps && python3 /home/ianblenke/docker/gev-tools/ghostmaps/measure-round3.py
cd /home/ianblenke/docker/gev-work/ghostmaps && python3 /home/ianblenke/docker/gev-tools/ghostmaps/audit-round3.py
cd /home/ianblenke/docker/gev-work/ghostmaps && python3 /home/ianblenke/docker/gev-tools/ghostmaps/sweep-round3.py
```
