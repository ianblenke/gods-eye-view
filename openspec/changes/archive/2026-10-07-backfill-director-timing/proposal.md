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

## Known limits

- Known limit `ledger-count-noise`: the ratchet recorded a count change for `server/providers/vessels/ais-store.js` under this change.
  The lines changed from 44 to 40 and the branch total changed from 74 to 76.
  This change does not touch that file; the same flip appears in other changes.
  The search below shows the entries at lines 132, 1474, 1880, 2021 and 2022.

```sh
cd /home/ianblenke/docker/gev-work/director && rg -n 'ais-store|aisStore' openspec/trace/history.jsonl
```
