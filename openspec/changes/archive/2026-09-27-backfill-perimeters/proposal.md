## Why

The fire perimeter layer and proxy have no backfill spec. The ledger shows code gaps in six files and 64 old tests without scenario tags. This is a backfill change for behavior that the code has now.

## What Changes

- Add one `perimeters` spec with 27 scenarios and `Origin: backfill` requirements.
- Tag the 64 old tests and add tests for code gaps.
- Add 13 tests in `server/providers/firePerimeters.test.mjs` for the two uncovered provider error paths and other code gaps.
- Change no production file.

## Capabilities

### New Capabilities

- `perimeters`: WFIGS data, incident facts, InciWeb links, cards and layer life cycle.

### Modified Capabilities

None.

## Impact

The ledger has these gaps before this change. The target after the change is zero, except for two branches that no test can reach.

- `cards.js`: 0 lines, 2 branches and 0 functions before; 0 each after. `cards.test.mjs` has 9 untraced tests before; 0 after.
- `inciweb.js`: 0 lines, 4 branches and 2 functions before; 0 each after. `inciweb.test.mjs` has 9 untraced tests before; 0 after.
- `index.js`: 7 lines, 17 branches and 2 functions before; 0 lines, 2 branches and 0 functions after. `ownership.test.mjs` has 17 untraced tests before; 0 after.
- `records.js`: 0 lines, 4 branches and 0 functions before; 0 each after. `records.test.mjs` has 7 untraced tests before; 0 after.
- `source.js`: 0 lines, 1 branch and 1 function before; 0 each after. `source.test.mjs` has 5 untraced tests before; 0 after.
- `firePerimeters.js`: 6 lines, 6 branches and 1 function before; 0 each after. Its old test file is `src/data/firePerimetersProxy.test.mjs`, with 17 untraced tests before and 0 after. The change tags these tests and adds 13 tests in `server/providers/firePerimeters.test.mjs` for the two uncovered upstream error paths.
- This change opens no gap. The lead can record closed gaps with the ratchet command.
- The ratchet command also wrote two history lines for `src/data/labelArbiter.js`, which this change does not edit. Its count changes between runs. The lead put the entry and the history of that file back to the content of `main`, as a text edit with no measurement.

## Known limits and later changes

- `index.js` line 137 has a return when `canSelect()` is false. Only a selection calls this function, and a selection needs `canSelect()` to be true. No test can reach this return.
- `index.js` line 369 has a continuation after `try` and `catch`. Each path returns. No test can reach the continuation.
- No browser QA script names perimeters. The design records this result.
- `perimeters-020` through `perimeters-027` tag the old proxy tests for cache use, redirects and bad page ids.
- A polygon change with the same incident facts keeps old entities. The snapshot key omits polygons. A later change can decide if this needs a fix.
- The host Node version can give coverage counts that differ from the gate image. The lead checks the final counts in the image.
- The tests use fake network and viewer objects. They do not check a live data service or a browser.
