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

- Known limit `ledger-count-noise`: the ratchet recorded a different count for `server/providers/vessels/ais-store.js` under this change.
  The line count changed from 44 to 40 and the branch total changed from 74 to 76.
  This change does not touch that file; the same count change appears in other changes.
  The search below lists the entries. Each entry names its change.

```sh
cd /home/ianblenke/docker/gev-work/director && rg -n 'ais-store|aisStore' openspec/trace/history.jsonl
```

- Known limit `absent-shot-input`: the last line of scenario `director-032` does not name the absent shot as its input.
  The timeline test of the absent shot elapsed time states the input. A later change adds the words "for the absent shot".
- Known limit `director-003-extra-results`: two tests tagged `director-003` assert results that no THEN or AND line states.
  The document test of the absent version accepts the number text "2" without a version.
  The migration test gives version 6 and bloom intensity 150 for the old intensity 25. A later change adds AND lines for both results.
- Known limit `spec-wording-minors`: the round 3 STE report names wording faults in the delta spec, such as one value with two names for scene duration.
  The review accepts them by name, because a change of scenario text needs a new ratchet and a new archive.
