## Why

This backfill change records the recent imagery feature at commit `3a919b7`.
The feature searches satellite days for a globe box, pins days A and B, compares them and exports an image.

## What Changes

- Add a spec for current behavior.
- Tag old tests and add tests for code paths.
- Check assertions with mutations.
- Do not change production code. Change only the `@covers` line of `scripts/qa-recent-imagery.mjs`.

## Capabilities

- Add `recent-imagery`.

## Impact

The ledger has 93 old tests in this area. 92 now have tags. One old test stays without a tag.
The area now has 434 tests. The test sweep finds one test without a tag, the old test in the known limits.
The change has 52 scenarios, 434 tests and 877 mutation checks.

The test declaration sweep finds 433 declarations; the path loop gives 434 tests.
The scenario heading sweep finds 52 scenarios.
The `untracedTests` entries in `openspec/trace/gaps.json` give 93 old tests.
The entries in `muts.json` and `muts3.json` give 828 and 49 mutation checks, for a total of 877.


The host uses Node 26.8.2. The ratchet in the gate image gave the same gaps as the host.

The table gives ledger gaps before this change and host gaps after this change.
The ledger from the gate image has the same counts as the host.

| File | Before lines | After host lines | Before branches | After host branches | Before functions | After host functions |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `src/layers/recentImagery/catalog.js` | 0 | 0 | 7 | 0 | 0 | 0 |
| `src/layers/recentImagery/model.js` | 0 | 0 | 16 | 2 | 0 | 0 |
| `src/layers/recentImagery/rendering.js` | 5 | 0 | 7 | 0 | 3 | 0 |
| `src/layers/recentImagery/thumbnails.js` | 5 | 0 | 17 | 1 | 4 | 0 |
| `src/layers/recentImagery/index.js` | 26 | 0 | 46 | 0 | 8 | 0 |
| `src/ui/recentImagery.js` | 27 | 0 | 66 | 2 | 10 | 2 |
| `src/layers/recentImagery/testDoubles.mjs` | 0 | 0 | 0 | 0 | 4 | 0 |

The ratchet command also wrote two history lines for `src/data/labelArbiter.js`, which this change does not edit. The branch count for this file changes between runs. The lead put the entry for that file back at the values in `main`, as a text edit with no measurement.

## Known limits and later changes

- Known limit `recent-imagery-ledger-history`: two history lines for `src/data/labelArbiter.js` record branches 52 to 50 and totals 407 to 405. The ledger entry has 52 branches. The branch count of this file changes between runs.
The host run covers all lines. This change accepts these paths as limits.

- `src/layers/recentImagery/model.js:239`: No input can reach the branch at line 239. The two callers test the date pattern before this call.
- `src/layers/recentImagery/model.js:316`: No input can reach the branch at line 316. Each day bucket has a granule before this call.
- `src/layers/recentImagery/thumbnails.js:69`: No input can reach the branch at line 69. The caller supplies an entry with an object URL.
- `src/ui/recentImagery.js:122`: Only a fake document whose elements have no `children` property reaches the branch at line 122.
- `src/ui/recentImagery.js:900`: No input can reach the branch at line 900. Each path in the export try and catch blocks returns.
- `src/ui/recentImagery.js:183`: No call can reach the function at line 183. The action card has no parameter control to call this function.
- `src/ui/recentImagery.js:269`: No call can reach the function at line 269. The action card has no parameter control to call this function.

The audit checks each compound condition and loop key.
- Known limit `recent-imagery-008-positive-size`: `src/layers/recentImagery/model.js:195`, `sideKm <= 0`. The guard gives the same result as the later check at line 127. The box checks reject negative sizes at line 127 and zero sizes at line 136 after the function creates numeric box edges (`src/layers/recentImagery/model.js:127`).
- Known limit `expression-007-right`: `src/layers/recentImagery/catalog.js:66`, `value === undefined`. The guard gives the same result as the later check at line 69. The finite check rejects undefined because its numeric result is NaN (`src/layers/recentImagery/catalog.js:69`).
- Known limit `expression-065-left`: `src/layers/recentImagery/index.js:292`, `!previewSlot()`. No input makes this operand true at line 292. A non-null automatic preview means that slot A has no pin. The pin methods, `setParams` and the search clear the automatic preview when a slot fills.
- Known limit `expression-083-left`: `src/layers/recentImagery/index.js:468`, `!_enabled || _destroyed`. The guard gives the same result as the later check at line 469. The lease and plan checks reject interrupted calls; the map callback guard rejects later calls after DESTROY (`src/layers/recentImagery/index.js:469`).
- Known limit `expression-084-left`: `src/layers/recentImagery/index.js:468`, `!_enabled`. The guard gives the same result as the later check at line 469. The lease and plan checks reject interrupted calls; the map callback guard rejects later disabled calls (`src/layers/recentImagery/index.js:469`).
- Known limit `expression-084-right`: `src/layers/recentImagery/index.js:468`, `_destroyed`. The guard gives the same result as the later check at line 469. The lease and plan checks reject interrupted calls; the map callback guard rejects later calls after DESTROY (`src/layers/recentImagery/index.js:469`).
- Known limit `expression-121-left`: `src/layers/recentImagery/index.js:740`, `_enabled`. The guard gives the same result as the later check at line 236. The plan check rejects a disabled layer because that enabled flag is private (`src/layers/recentImagery/index.js:236`).
- Known limit `expression-207-left`: `src/layers/recentImagery/model.js:69`, `typeof value === 'number'`. The guard gives the same result as the later check at line 69. The finite check rejects each value that is not a number without numeric conversion, including objects and custom conversion methods (`src/layers/recentImagery/model.js:69`).
- Known limit `expression-218-right`: `src/layers/recentImagery/model.js:195`, `sideKm <= 0`. The guard gives the same result as the later check at line 127. The box checks reject negative sizes at line 127 and zero sizes at line 136 after the function creates numeric box edges (`src/layers/recentImagery/model.js:127`).
- Known limit `expression-223-left`: `src/layers/recentImagery/model.js:246`, `Number.isFinite(time)`. The guard gives the same result as the later check at line 238. The date pattern check bounds the numeric UTC result to a finite value because both callers pass primitive date strings (`src/layers/recentImagery/model.js:238`).
- Known limit `expression-236-true`: `src/layers/recentImagery/model.js:316`, `granules.length`. No input can reach the branch at line 316. The bucket check always has a granule because the private loop creates each bucket from a granule; this is an accepted unreachable path (`src/layers/recentImagery/model.js:316`).
- Known limit `expression-284-right`: `src/layers/recentImagery/rendering.js:227`, `!destroyed`. The guard gives the same result as the later check at line 223. The record check rejects the input because DESTROY removes both private records at line 260 before another REBIND call (`src/layers/recentImagery/rendering.js:223`).
- Known limit `expression-293-true`: `src/layers/recentImagery/thumbnails.js:69`, `keep?.objectUrl`. No input can reach the branch at line 69. The object URL check calls the private function only with a URL; this is an accepted unreachable path (`src/layers/recentImagery/thumbnails.js:142`).
- Known limit `loop-70-thumbnails`: `src/layers/recentImagery/thumbnails.js:70`, `the image loop`. The guard gives the same result as the later check at line 71. The limit check in `src/layers/recentImagery/thumbnails.js:71` stops after one image because each completed request adds one URL before the next private request result.
- Known limit `default-323-dom-children`: `src/ui/recentImagery.js:122`, `root?.children || []`. Only a fake document whose elements have no `children` property reaches the branch at line 122. The element factory at `src/ui/recentImagery.js:156` gives every element of a real document a `children` list.
- Known limit `expression-343-left`: `src/ui/recentImagery.js:429`, `entry.image`. The guard gives the same result as the later check at line 423. The shown check creates the private image first; otherwise both URLs are null and the URL check at line 429 rejects the input (`src/ui/recentImagery.js:423`).
- Known limit `expression-135-left`: `src/layers/recentImagery/index.js:815`, `Boolean(_followKey)`. The guard gives the same result as the later check at line 191. The candidate key check rejects a null follow key before external calls (`src/layers/recentImagery/index.js:191`).
- Known limit `expression-151-true`: `src/layers/recentImagery/index.js:939`, `box`. The guard gives the same result as the later check at line 123. The box check rejects null because normalization at line 79 rejects it before any external property access (`src/layers/recentImagery/model.js:123`).
- Known limit `expression-153-true`: `src/layers/recentImagery/index.js:971`, `_boxError`. The guard gives the same result as the later check at line 974. The target check rejects the input because private paths remove the box error and target together at line 705 (`src/layers/recentImagery/index.js:974`).
- Known limit `expression-166-left`: `src/layers/recentImagery/index.js:1098`, `next`. The guard gives the same result as the later check at line 1100. The assignment gives the same null result because both private slots already contain null; fakes cannot change the private slots directly (`src/layers/recentImagery/index.js:1100`).
- Known limit `expression-173-true`: `src/layers/recentImagery/index.js:1243`, `shown.preview`. The guard gives the same result as the later check at line 767. The image key check maps null and undefined to null because the private plan at line 235 has no property for either key (`src/layers/recentImagery/index.js:767`).
- Known limit `expression-180-left`: `src/layers/recentImagery/index.js:1269`, `_boxError`. The guard gives the same result as the later check at line 1269. The target check rejects the input because private paths remove the box error and target together at line 705 (`src/layers/recentImagery/index.js:1269`).
- Known limit `expression-198-left`: `src/layers/recentImagery/index.js:1390`, `_assigned.a`. The guard gives the same result as the later check at line 1390. The assignment gives the same null result because both private slots already contain null; fakes cannot change the private slots directly (`src/layers/recentImagery/index.js:1390`).
- Known limit `expression-200-left`: `src/layers/recentImagery/index.js:1394`, `pinned`. The guard gives the same result as the later check at line 191. The candidate key check rejects a null pin before external calls (`src/layers/recentImagery/index.js:191`).
- Known limit `expression-299-right`: `src/layers/recentImagery/thumbnails.js:129`, `destroyed`. The guard gives the same result as the later check at line 129. The `cancelled` flag and the entry identity check reject late results because DESTROY stops controllers and removes the private entries at line 274 (`src/layers/recentImagery/thumbnails.js:129`).
- Known limit `expression-170-left`: `src/layers/recentImagery/index.js:1188`, `!_enabled`. The guard gives the same result as the later check at line 236. The plan check rejects a disabled layer because that enabled flag is private (`src/layers/recentImagery/index.js:236`).
- `src/layers/recentImagery/thumbnails.js:121`: An AbortError that the loader did not start leaves the day entry in the cache. A later request does not restart it.
- `src/layers/recentImagery/model.js:331`: The model accepts an inherited product key, such as `__proto__`.
- `src/ui/recentImagery.js:304`: The panel restores the scroll position after the DETAILS card tries to show the card.
- `src/layers/recentImagery/model.js:401`: An incorrect footprint with a nonfinite latitude can produce full coverage.
The lead changes the QA header after the archive creates the capability folder.

- Known limit `recent-imagery-untagged-old-test`: one old test in `src/ui/recentImagery.test.mjs` has a title of 26 words. The gate limit for a tagged title is 25 words. The owner rule keeps an old test name, so this test stays without a tag. Its title starts with "the notice line shows the refusal".

The same old test checks the box, search, pin and comparison hints.
The test also checks the text that CLEAR gives. The claims do not have a scenario.

New tests tagged `recent-imagery-046` carry the claims of the untagged title instead.

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


- The tests for the nonfinite latitude and for the AbortError entry must change if the code changes.
The model test with tag `recent-imagery-013` accepts a nonfinite latitude.
The thumbnail test with tags `recent-imagery-023 recent-imagery-026` maps an AbortError to the unknown state.
