## Source

The source commit is `81b8bd6c4eb9e2abae1cf6cc9a2447bc16accb02`.
The archived backfill records the defects.
The current tests and source confirm the defects.

## Thumbnail decision

The old test expects unknown status after external AbortError but does not request the day again.
Remove the entry when the current fetch ends with external AbortError.
A later request can then start another fetch.
An old fetch must not remove a replacement entry.

## Product decision

Use `Object.hasOwn` before the model reads a product value.
The old tests reject unknown names but do not test parent keys.
Reject parent keys in granule groups, `START HERE`, readouts, and image URL builders.
The candidate key parser already rejects parent keys.

## DETAILS decision

The old test expects zero after the reveal writes the body position.
Move the reveal after the function that restores the content position.
Keep normal refresh behavior through `recent-imagery-050`.
Change its scenario to state the DETAILS exception without a change to the first requirement sentence.
The new scenario states the exact position from the dimensions in the old test.

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
The lead runs the image gates and the reviews.

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

## D5: Divisor default

Remove the unreachable default of the divisor in `pointInPolygon`.
For finite `yi` and `yj`, the cross condition needs different values.

```js
yi > lat !== yj > lat
```

Thus `yi !== yj`, and the divisor cannot equal zero.
The default cannot change the result for finite coordinates.

The search command `rg -n pointInPolygon src` shows one caller of the model function: `coverageFor`.
The model function is not exported.
Other search results name separate functions in other files.
The footprint filter accepts only finite coordinates.
No mutation is necessary because no default code remains.
