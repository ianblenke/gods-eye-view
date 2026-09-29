## Why

A selected system with no video of its own shows no camera feed. A paired camera can exist as a separate system nearby. The owner cannot see that camera without a second click on its own marker.

## What Changes

- Adds a match rule to the Camera panel, for a system with no video datastream of its own.
- The layer finds another system whose name has the same number and the word "camera".
- Plays that system's video in the existing video view, instead of no video.
- Shows that system's own name in the video view.
- Reads the datastreams of the matched system only when the selected system has none of its own.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `osh`: the Camera panel requirement gains a match rule. It plays a linked camera's video when the selected system has none of its own.

## Impact

- Changes `src/layers/osh/index.js`.
- Opens no gap in `openspec/trace`. The changed file keeps full line, branch and function coverage.
