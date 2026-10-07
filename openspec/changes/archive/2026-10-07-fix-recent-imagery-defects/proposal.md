## Why

The code at commit `81b8bd6c4eb9e2abae1cf6cc9a2447bc16accb02` contains defects from the recent imagery backfill.
The owner chose to correct all defects.

- `src/layers/recentImagery/thumbnails.js:121` leaves a stale entry after an external AbortError.
- `src/layers/recentImagery/model.js:331` accepts parent product keys.
- `src/ui/recentImagery.js:304` restores the old position after DETAILS tries to show its card.
- `src/layers/recentImagery/model.js:401` accepts footprint coordinates that are not finite.

The line numbers come from `rg -n` on the production files.

## What Changes

Remove stale thumbnail entries after external AbortError.
Reject parent product keys in the model.
Show the DETAILS card after the content update restores scroll position.
Exclude invalid footprints from coverage samples.
Change the old tests that state the defective results.

## Capabilities

### Modified

- `recent-imagery`: Correct thumbnails, products, DETAILS position, and footprint coverage.

### New

None.

## Impact

The change edits the model, thumbnail loader, panel, and their tests.
Host coverage must not increase a gap in the ledger.
The ratchet writes `ids.json` and `links.json` and, when the ledger changes, `gaps.json` and `history.jsonl`.

## Known limits and later changes

The host coverage result does not give a verdict for the image gates.
The lead must run the ratchet, gates, and reviews in the supported environment.
Invalid footprints give unknown coverage, rather than an empty coverage label.
The current model uses unknown coverage when no valid polygon exists.

Host coverage leaves an extra branch without a test path at `src/layers/recentImagery/model.js:406`.
The lead must decide how to cover that branch without a change that serves only the coverage instrument.
