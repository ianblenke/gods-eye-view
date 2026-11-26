## Context

Upstream main is `7646568a9`. The shared ancestor with the fork is `fca2c81d8`, the last commit of the twelfth sync.

## Decisions

### D1: One merge, plan first

The plan commit comes before the merge commit.

### D2: Follow upstream on the location pills

Upstream deleted the location bar. The owner chose on 2026-11-26 to follow upstream. The change retires `location-presets-003` and `location-presets-007`.

Purpose at archive time of `location-presets`: Keep the location presets in a known order and with valid data. Put the Taiwan preset first, and answer its name from the bundled presets.

### D3: Two edits of upstream tests

- `mountApplicationViews.test.mjs` gives its camera double a `flyTo` function, because the fork starts with a timed flight above Taiwan.
- `qaAircraftViewSheetOutput.test.mjs` starts a child process with the permission model. The coverage preload of the gate cannot run in that child. The change gives the child an empty `NODE_V8_COVERAGE` and empty `NODE_OPTIONS`.

### D4: The opening ends on Taiwan

Upstream plays an opening animation that ends where the camera stands. The fork flight to Taiwan would move the camera during the animation. The owner chose on 2026-11-26 that the opening lands on Taiwan. With an opening, the camera goes to the Taiwan pose at once. With no opening, the fork flight stays.

Purpose at archive time of `startup-view`: Start the application at a known view when the page loads. Show the Taiwan view when the page has no share link. Keep the share link view when the page has one.

## Risks

An upstream change to a shape that a fork test reads can break the test. The tasks check this after the merge.
