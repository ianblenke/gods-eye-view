## Context

Upstream main is `7646568a9`. The shared ancestor with the fork is `fca2c81d8`, the last commit of the twelfth sync.

## Decisions

### D1: One merge, plan first

The plan commit comes before the merge commit.

### D2: Follow upstream on the location pills

Upstream deleted the location bar. The owner chose on 2026-11-26 to follow upstream. The change retires `location-presets-003` and `location-presets-007`.

Purpose at archive time of `location-presets`: Keep the location presets in a known order and with valid data. Put the Taiwan preset first, and answer a search for its name from the bundled presets.

### D3: Two edits of upstream tests

- `mountApplicationViews.test.mjs` gives its camera double a `flyTo` function, because of the fork flight. The fork starts that timed flight when the page has no opening and no share state.
- `qaAircraftViewSheetOutput.test.mjs` starts a child process with the permission model. The coverage preload of the gate cannot run in that child. The change gives the child an empty `NODE_V8_COVERAGE` value and an empty `NODE_OPTIONS` value.

### D4: The opening ends on Taiwan

Upstream plays an opening animation that ends where the camera stands. A fork flight to Taiwan moves the camera during the animation. The owner chose on 2026-11-26 that the opening ends on Taiwan. With an opening and no share state, the camera goes to the Taiwan pose at once. With no opening and no share state, the fork flight stays. The controls give an opening when `openingWanted` returns true and the share code is not rejected.

Purpose at archive time of `startup-view`: Start the application at a known view when the page loads. Show the Taiwan view when the page has no share state. Keep the share view when the page has share state.

## Risks

An upstream change to a shape that a fork test reads can break the test. The tasks check this after the merge.
