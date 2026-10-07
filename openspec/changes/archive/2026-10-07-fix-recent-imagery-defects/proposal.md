## Why

The code at commit `81b8bd6c4eb9e2abae1cf6cc9a2447bc16accb02` contains defects from the recent imagery backfill.
The owner chose to correct all defects.

- `src/layers/recentImagery/thumbnails.js:121` leaves a stale entry after an external AbortError.
- `src/layers/recentImagery/model.js:331` accepts parent product keys.
- `src/ui/recentImagery.js:304` restores the old body scroll position after the panel sends the scroll request.
- `src/layers/recentImagery/model.js:401` accepts footprint coordinates that are not finite.

The line numbers come from `rg -n` on the production files.

## What Changes

Remove stale thumbnail entries after an external AbortError.
Reject parent product keys in the model.
Show the DETAILS card after the content update restores the body scroll position.
Exclude invalid footprints from coverage samples.
Change the old tests that state the defective results.

## Capabilities

### Modified

- `recent-imagery`: Correct thumbnails, products, body scroll position, and footprint coverage.

### New

None.

## Impact

The change edits the model, thumbnail loader, panel, and their tests.
Host coverage must not increase a gap in the ledger.
The ratchet writes `ids.json` and `links.json` and, when the ledger changes, `gaps.json` and `history.jsonl`.

## Known limits and later changes

The host coverage result does not give a verdict for the Docker gates.
The lead must run the ratchet, gates, and reviews in the supported environment.
Invalid footprints give unknown coverage, rather than an empty coverage label.
The current model uses unknown coverage when no valid polygon exists.

- `other-products-readers`: Other product table readers stay without own-key guards.
  The readers are in `catalog.js:148`, `rendering.js:102`, `index.js:66`, `index.js:753`, `index.js:770`, and `ui/recentImagery.js:57`.
  Normal catalog paths use fixed product names, granule groups, overview days, or the key parser.
  The catalog URL builder also accepts a product from the caller.
  The layer reads product keys from errors that its catalog function returns.
- `unknown-coverage-ranks-covering`: The `coversBox` function in `rankLatest` treats unknown coverage as coverage of the box.
  A day with only invalid footprints can enter the `clear` or `cloudy` tier.
  The old NaN results were full or partial.
  Only an old partial result changes the tier when it becomes unknown.
  A later change can change that rank rule.
- `ledger-count-noise`: The ratchet records an unrelated change for `server/providers/vessels/ais-store.js`.
  Its line gap changes from 44 to 40, and its branch total changes from 74 to 76.
  The history also records that change under `upstream-sync`, `backfill-director-timing` and this change.
  The `gates-coverage-race` change changes them back, from 40 to 44 and from 76 to 74.
  The source search of `history.jsonl` supplies these values.

- `qa-details-scroll`: The browser QA script sets its own body scroll position after it opens DETAILS.
  No browser check shows that the body moves to show the DETAILS card.
  The unit tests of scenario 055 check that the body moves.
- `reveal-card-defaults`: The function `revealCard` has operands that no test or mutation row covers.
  They are the default values `|| 0` for `clientTop` and `scrollTop`, and the optional chains on `scroller` and `card`.
  Every test that reaches them sets `clientTop` to 0 or 2 and starts `scrollTop` at 0.
  A later change adds a test without a `clientTop` value, with a card top of -10 pixels and a body scroll position of 40 pixels.
- `spec-wording-minors`: The STE report of round 3 names wording faults in the scenario lines and in test names.
  One fault is "ends" for a late fetch. Another is "scroller" and "view" for the body and the viewport.
  The third fault is the words "from the fetch" in a thumbnail test name.
  A change of scenario text or of a test name needs a new ratchet and a new archive, so the review accepts them by name.
