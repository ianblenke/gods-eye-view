## Why

The backfill records director behavior at commit `290b5d2cf65d614e39f42a0b3b24a53fc2514985`.
A director document holds timed scenes and camera moves for a tour.

## What Changes

- Add the director spec for documents, fields, author details, clocks, timeline and playback.
- Add test tags and tests for current code.
- Check the tests with code mutations.

## Capabilities

### New Capabilities

- `director`: document validation, author details, time and playback.

### Modified Capabilities

None.

## Impact

The change targets the gaps in the design table.
The lead measures the gate result and records closed gaps with the ratchet.
This change does not change production code or browser QA scripts.
The next director changes extend the same capability and continue the scenario IDs.
