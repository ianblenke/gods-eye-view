## Why

The backfill records director behavior at commit `290b5d2cf65d614e39f42a0b3b24a53fc2514985`.
A director document holds timed scenes and camera moves for a tour.

## What Changes

- Add the director spec for the document module, the fields module, the author module, the clock module, the timeline module and the playback module.
- Add test tags and tests for current code.
- Check the tests with code mutations.

## Capabilities

### New Capabilities

- `director`: the document module, the fields module, the author module, the clock module, the timeline module and the playback module.

### Modified Capabilities

None.

## Impact

The change targets the gaps in the design table.
The lead measures the gate result and records closed gaps with the ratchet.
This change does not change production code.
The lead changes the browser QA headers at the archive step.
The next director changes extend the same capability and continue the scenario IDs.
