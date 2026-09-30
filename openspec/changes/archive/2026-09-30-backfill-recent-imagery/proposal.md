## Why

This backfill change records the recent imagery feature at commit `3a919b7`.
The feature searches satellite days for a globe box, pins days A and B, compares them and exports an image.

## What Changes

- Add a spec for current behavior.
- Tag old tests and add tests for code paths.
- Check assertions with mutations.
- Do not change production code or browser QA scripts.

## Capabilities

- Add `recent-imagery`.

## Impact

The ledger has 93 old tests in this area. 92 now have tags. One old test stays without a tag.
The area now has 391 tests. The test sweep finds one test without a tag, the old test in the known limits.
The change has 52 scenarios, 391 tests and 831 mutation checks.

Host Node 26 coverage can differ from the gate image. The ratchet in the gate image left the same gaps.

The table gives ledger gaps before this change and host gaps after this change.
The ledger from the gate image has the same counts as the host.

| File | Before lines | After host lines | Before branches | After host branches | Before functions | After host functions |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `src/layers/recentImagery/catalog.js` | 0 | 0 | 7 | 0 | 0 | 0 |
| `src/layers/recentImagery/model.js` | 0 | 0 | 16 | 2 | 0 | 0 |
| `src/layers/recentImagery/rendering.js` | 5 | 0 | 7 | 0 | 3 | 0 |
| `src/layers/recentImagery/thumbnails.js` | 5 | 0 | 17 | 2 | 4 | 0 |
| `src/layers/recentImagery/index.js` | 26 | 0 | 46 | 2 | 8 | 0 |
| `src/ui/recentImagery.js` | 27 | 0 | 66 | 4 | 10 | 2 |
| `src/layers/recentImagery/testDoubles.mjs` | 0 | 0 | 0 | 0 | 4 | 0 |

The ratchet command also wrote two history lines for `src/data/labelArbiter.js`, which this change does not edit. The branch count for this file changes between runs. The lead set the entry for that file back to the values in `main`, as a text edit with no measurement.

## Known limits and later changes

- Known limit `recent-imagery-ledger-history`: two history lines for `src/data/labelArbiter.js` still show the drift that this change corrected (before 52, after 50 branches). The entry in the ledger has the correct value. The two history lines do not have the correct value.
The host run covers all lines. These branches and functions have no path through the current API and DOM state.

- `src/layers/recentImagery/model.js:239`: The branch at line 239 cannot run. The date pattern makes the UTC value finite.
- `src/layers/recentImagery/model.js:316`: The branch at line 316 cannot run. Each day bucket has a granule before this call.
- `src/layers/recentImagery/thumbnails.js:69`: The branch at line 69 cannot run. The caller supplies an entry with an object URL.
- `src/layers/recentImagery/thumbnails.js:151`: The branch at line 151 cannot run. Queue removal also removes the entry before the next pump.
- `src/layers/recentImagery/index.js:292`: The branch at line 292 cannot run. Pin assignment clears the automatic preview state before this call.
- `src/layers/recentImagery/index.js:472`: The branch at line 472 cannot run. The layer releases the lease before this callback can see an empty pair.
- `src/ui/recentImagery.js:122`: The branch at line 122 cannot run. Each panel element has a children collection.
- `src/ui/recentImagery.js:410`: The branch at line 410 cannot run. The strip creates each entry before it updates the card.
- `src/ui/recentImagery.js:835`: The branch at line 835 cannot run. Each subscription checks the destroy state before it calls render.
- `src/ui/recentImagery.js:900`: The branch at line 900 cannot run. Each path in the export try and catch blocks returns.
- `src/ui/recentImagery.js:183`: The function at line 183 cannot run. The action card has no parameter control to call this function.
- `src/ui/recentImagery.js:269`: The function at line 269 cannot run. The action card has no parameter control to call this function.

The audit checks each compound condition and loop key.
- `src/layers/recentImagery/model.js:195`: The nonpositive pin size guard is equivalent. Later box checks reject the same inputs.
- `src/layers/recentImagery/thumbnails.js:121`: An unsolicited AbortError leaves an entry. A later request does not restart it.
- `src/layers/recentImagery/model.js:331`: The model accepts an inherited product key, such as `__proto__`.
- `src/ui/recentImagery.js:304`: Panel render restores scroll after DETAILS tries to reveal the card.
- `src/layers/recentImagery/model.js:401`: A malformed footprint with a nonfinite latitude can produce full coverage.
The lead changes the QA header after the archive creates the capability folder.

- Known limit `recent-imagery-untagged-old-test`: one old test in `src/ui/recentImagery.test.mjs` has a title of 26 words. The gate limit for a tagged title is 25 words. The owner rule keeps an old test name, so this test stays without a tag. Its title starts with "the notice line shows the refusal". Two new tests carry the claims of `recent-imagery-046` instead.

No old test has a banned word. One old test stays without a tag.

The title sweep lists 29 old names. The gates flag 23 of them for -ing words or passive voice. The gates do not flag 3 with a hyphenated -ing word. Two start with "disable" as a noun. One has 26 words and stays untagged.

The owner rule keeps these names. The list gives each name and its file.

- `src/layers/recentImagery/catalog.test.mjs` (passive voice):

```text
an invalid box or clock is refused before any request
```

- `src/layers/recentImagery/catalog.test.mjs` (failing, passive voice):

```text
both HLS collections fold with the VIIRS days; one failing product is reported, not fatal
```

- `src/layers/recentImagery/index.test.mjs` (pending):

```text
CLEAR forgets the box, pins, preview, pending pick, opacity, split and the tool; mode and sources survive
```

- `src/layers/recentImagery/index.test.mjs` (moving, unpinning):

```text
IMAGE: SHOW pins a day, focus stops moving the map, a second SHOW moves the pin and unpinning drops the layer at once
```

- `src/layers/recentImagery/index.test.mjs` (shrinking):

```text
USE VIEW takes the camera rectangle and refuses a view over the cap instead of shrinking it
```

- `src/layers/recentImagery/index.test.mjs` (passive voice):

```text
a catalog failure is exposed and leaves nothing draped
```

- `src/layers/recentImagery/index.test.mjs` (being):

```text
a pinned day still being probed drapes once the probe says present
```

- `src/layers/recentImagery/index.test.mjs` (re-rendering):

```text
alpha, split and visible range notify without re-rendering the row
```

- `src/layers/recentImagery/index.test.mjs` (re-leasing):

```text
an automatic fallback to Google 3D drops the swipe instead of re-leasing Esri; a manual switch re-leases once (stats poll)
```

- `src/layers/recentImagery/index.test.mjs` (re-leasing):

```text
an automatic fallback to Google 3D drops the swipe instead of re-leasing Esri; a manual switch re-leases once (subscription)
```

- `src/layers/recentImagery/index.test.mjs` (passive voice):

```text
an empty day never drapes: the automatic preview re-ranks, a pick is refused and an empty pin is unpinned
```

- `src/layers/recentImagery/index.test.mjs` (disable as a noun):

```text
disable after a re-lease hands Google 3D back and does not take Esri again
```

- `src/layers/recentImagery/index.test.mjs` (disable as a noun):

```text
disable releases the lease, hides the drapes and cancels the tool; pins come back on enable
```

- `src/layers/recentImagery/index.test.mjs` (pinning):

```text
pinning an offscreen day probes it at once
```

- `src/layers/recentImagery/index.test.mjs` (passive voice):

```text
restored pins outside the visible strip window are probed and swipe once present
```

- `src/layers/recentImagery/index.test.mjs` (passive voice):

```text
restored pins the catalog no longer lists are dropped and START HERE previews
```

- `src/layers/recentImagery/index.test.mjs` (publishing):

```text
share links restore the box, both pins, the mode and a non-default split once, without publishing back
```

- `src/layers/recentImagery/index.test.mjs` (scrubbing):

```text
the divider recentres on every new comparison but not while scrubbing the second day
```

- `src/layers/recentImagery/index.test.mjs` (turning, pending):

```text
turning a source off hides its cards and drapes, disarms its pending preview and labels its pins "Source off"
```

- `src/layers/recentImagery/model.test.mjs` (merging):

```text
merging sorts newest day first, then S30, L30, VIIRS, and the first key wins
```

- `src/layers/recentImagery/rendering.test.mjs` (leaving):

```text
against the basemap slot a splits left with no second layer, and leaving the swipe only restyles it
```

- `src/layers/recentImagery/thumbnails.test.mjs` (sensing):

```text
Data-Present decides the day: present with an object URL and sensing time, empty, or error
```

- `src/layers/recentImagery/thumbnails.test.mjs` (passive voice):

```text
decoded thumbnails are evicted least-recently-used and revoked; a read is not a use and an evicted day keeps what it learned
```

- `src/layers/recentImagery/thumbnails.test.mjs` (reading, passive voice):

```text
reading every card in strip order (a snapshot) never decides who is evicted; evicted days stay known and come back on request
```

- `src/ui/recentImagery.test.mjs` (holding):

```text
DETAILS is a collapsed rail card holding every note, and the empty-days toggle
```

- `src/ui/recentImagery.test.mjs` (moving):

```text
cards carry thumbnail, date, sensor, cloud, START HERE and PREVIEW; the chips follow the mode without moving
```

- `src/ui/recentImagery.test.mjs` (passive voice):

```text
no control changes place in the tree, no block is hidden and every fixed-height block keeps its height class across every state (DOM-structure guard)
```

- `src/ui/recentImagery.test.mjs` (passive voice):

```text
strip keys: arrows preview after the debounce, S / A / B pin, Enter previews, repeats are ignored
```

- `src/ui/recentImagery.test.mjs` (long title):

```text
the notice line shows the refusal, then errors, then CLEAR, then the Esri note; the hint names the next step and that SWAP trades the sides
```

