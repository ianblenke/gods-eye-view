## Why

This backfill records the voice panel at commit `89fe216472d408b6ac9a0d9b53f65ef20434d917`.
The panel owns Preview, Voice Settings, local preferences and local inactivity evidence.

## What Changes

- Add the `voice-panel` capability.
- Add scenario tags and tests under `src/voice/panel/`.
- Check decision operands and key loops with mutations.

## Capabilities

### New Capabilities

- `voice-panel`: Panel presentation, browser preferences, action observations and native activity.

### Modified Capabilities

None.

## Impact

This change targets the ledger gaps for the scope files.
The baseline data records each gap and old test name.
Production files, QA scripts and trace files keep their bytes at this host snapshot.
New tests keep the upstream class of the adjacent scope modules.
The lead runs the calibrated ratchet, gates and formal reviews.

Browser layout, live audio, auth focus and action choice remain outside this unit test scope.
The QA headers name those separate purposes.

## Ledger targets

The source ledger records these gaps.
The measurement command checks each entry against the baseline.

| File                              | Lines | Branches | Functions |
| --------------------------------- | ----: | -------: | --------: |
| src/voice/panel/actionObserver.js |    10 |       11 |         0 |
| src/voice/panel/host.js           |     0 |       15 |         0 |
| src/voice/panel/inactivity.js     |     0 |        4 |         0 |
| src/voice/panel/manualPanel.js    |     5 |        8 |         1 |
| src/voice/panel/nativeActivity.js |     0 |        6 |         0 |
| src/voice/panel/preferences.js    |     0 |        6 |         0 |
| src/voice/panel/testDom.mjs       |     9 |        3 |         7 |

```bash
cd /home/ianblenke/docker/gev-work/voicepanel && python3 /home/ianblenke/docker/gev-tools/voicepanel/review-recount.py
```

## The review corrections

Source commit: `74ec10e054a88935c7fcfce96300ea660f7c7747`.
The correction report names the spec and test changes.
The host checks use the current worktree.
The baseline table records the earlier ledger state.
The change adds no production behavior.
