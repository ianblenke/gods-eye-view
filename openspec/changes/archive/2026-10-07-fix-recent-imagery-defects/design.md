## Source

The source commit is `81b8bd6c4eb9e2abae1cf6cc9a2447bc16accb02`.
The archived backfill records the defects.
The current tests and source confirm the defects.

## Thumbnail decision

The old test expects unknown status after an external AbortError but does not request the day again.
Remove the entry when the current fetch ends with an external AbortError and the entry status is unknown.
The loader starts a new fetch when the caller requests the day again.
An old fetch must not remove a new entry.

## Product decision

Use `Object.hasOwn` before the model reads a product value.
The old tests reject unknown names but do not test parent keys.
Reject parent keys in granule groups, `START HERE`, readouts, and image URL builders.
The candidate key parser already rejects parent keys.

## DETAILS decision

The old test expects zero after the scroll request writes the body scroll position.
Move the scroll request after the function that restores the body scroll position.
Keep normal refresh behavior through `recent-imagery-050`.
Keep the base THEN line and add the order of the scroll request after DETAILS opens.
The new scenario states the exact body scroll position from the dimensions in the old test.

## Footprint decision

The old latitude test expects full coverage with NaN.
Another old test expects partial coverage with NaN.
Change both tests to expect unknown coverage.
Accept a footprint only when all points contain finite numeric coordinates.
Other valid footprints still supply coverage proof.

## Evidence and gates

The tests use literal expected results and assertion methods.
Each mutation changes production code and must cause a repository test to fail.
The host commands measure coverage separately for each production file.
The lint command checks prose and test titles.
The format command checks file layout.
 
The predispatch command checks the change before the lead receives it.
The lead runs the Docker gates and the reviews.

## Browser quality assurance (QA)

`scripts/qa-recent-imagery.mjs` tests panel layout, search, pins, exports, map changes, share state, and closed-circuit television (CCTV) stability.
The unit scenarios do not change those purposes.

## Coverage limits for the lead

The source search `rg -n` locates the other current coverage limits.
The model leaves branches at `src/layers/recentImagery/model.js:242` and `src/layers/recentImagery/model.js:319` without coverage.
The thumbnail loader leaves the fallback at `src/layers/recentImagery/thumbnails.js:69` without coverage.
The panel leaves the fallback at `src/ui/recentImagery.js:122` and a branch at `src/ui/recentImagery.js:896` without coverage.
The panel leaves functions at `src/ui/recentImagery.js:183` and `src/ui/recentImagery.js:269` without coverage.
The host evidence records the results, rather than a gates verdict.

## Divisor default decision

Remove the unreachable default of the divisor in `pointInPolygon`.
For finite `yi` and `yj`, the cross condition needs different values.

```js
yi > lat !== yj > lat
```

Thus `yi !== yj`, and the divisor cannot equal zero.
The default cannot change the result for finite coordinates.

The search command `rg -n pointInPolygon src` shows one caller of the model function: `coverageFor`.
The model does not export the function.
Other search results name separate functions in other files.
The footprint filter accepts only finite coordinates.
No mutation is necessary because no default code remains.

## Corrections of review round 1

The base commit is `81b8bd6`.
The worker read the working tree of the lead.
The panel restores the body scroll position in every render.
The panel sends the scroll request after it restores the body scroll position when DETAILS opens.
The test card gives a height of zero while it is closed and 60 pixels while it is open.

Separate tests cover a viewport height of zero and a card without a getBoundingClientRect method.
A test covers a footprint with an absent point.
The thumbnail test records the state of the signal and asserts that state after the fetch settles.
The proposal names the other product readers with their actual input sources.
No production correction is necessary for these review findings.

## Corrections of review round 2

The base commit is `81b8bd6`.
The worker read the working tree of the lead at Git current commit `ee1b35ee8c2e9074366530346f761fc2ddda5680`.
The old latitude tests give partial and full coverage for NaN.
The base-code probe gives partial coverage for the tested NaN longitude.
All three cases now give unknown coverage.
The rank rule treats both full and unknown coverage as coverage of the box.

The tests use separate cases for zero and undefined viewport heights.
The undefined-height test removes the clientHeight value after the helper sets it.
The test card top is -10 pixels.
The body scroll position stays at 40 pixels, with no scroll request.
The exact AND text from correction A names each height case and the card without a getBoundingClientRect method.

The card inside the view starts at 10 pixels, with a height of 20 pixels.
The viewport height is 100 pixels.
The body scroll position stays at 40 pixels, with no scroll request.
The scroll spy detects a write even when the value stays at 40.
Thus the zero-delta mutation is not equivalent.

The content-update mutation moves the scroll request into render after the call that restores the body scroll position.
The test must reject a body scroll position of 20 instead of 10.
A separate probe records the scroll request of 20.
No production correction is necessary.

The browser QA script sets its own body scroll position after DETAILS opens.
The proposal records that limit as `qa-details-scroll`.
Corrections A and C give exact AND text.
Those lines keep that text.
The general panel-agent request in correction D does not change those lines.
