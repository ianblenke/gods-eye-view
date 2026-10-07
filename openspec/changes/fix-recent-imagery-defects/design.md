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

The tree read is commit `c913d8cf820a0d3947a0f5b120449f1946e3544e`.
The safest decision keeps the body scroll position restore in every render.
The scroll request follows that restore when DETAILS opens.
The test card gives a height of zero while closed and 60 pixels while open.

Separate tests cover an absent viewport height and an absent card rectangle.
A sparse ring test covers an absent point.
The thumbnail test records signal state and asserts that state after the fetch settles.
The proposal names the other product readers with their actual input sources.
No production correction is necessary for these review findings.
