## Context

This change records commit `290b5d2cf65d614e39f42a0b3b24a53fc2514985`.
The scene controller resolves camera poses for load, replay and seek.
It admits actions after load and seek.

## Decisions

Tests call public functions with local objects and custom adapters.
They do not request network data.
The trace gate checks tags and assertion methods.
The coverage gate checks each production file.
The STE gate checks prose and tagged test titles.
Host coverage does not give a gate verdict.

The lead runs the ratchet, gates and review.

## Related browser QA scripts

- `scripts/qa-director-camera.mjs` proves that imported camera paths and camera control agree.
- `scripts/qa-director-interactions.mjs` proves that pointer and key actions control an authored scene.

## Evidence

The evidence records the scope sweep, test links and host coverage.
The mutation report records the exact changes and failed tests.
The scratch audit records each decision and field loop.

## Sweep commands

The evidence gives the ledger gaps, old test totals and import paths from the scope sweep.
The audit command gives the tested, default-value and equivalent row totals.
The report command reads each final mutation result from command output.

```sh
cd /home/ianblenke/docker/gev-work/director-2 && python3 /home/ianblenke/docker/gev-tools/director-2/sweep.py
cd /home/ianblenke/docker/gev-work/director-2 && python3 /home/ianblenke/docker/gev-tools/director-2/audit.py
cd /home/ianblenke/docker/gev-work/director-2 && python3 /home/ianblenke/docker/gev-tools/director-2/report.py
```

## Known limits

The evidence names the host branch before finally in the interaction session.
The evidence also names the state callback exception and the tests outside this scope.
The lead checks the Node version of the gates before the ledger update.
- Known limit `session-finally-branch`: the branch at `src/director/interactions/session.js` line 51 cannot run, because the try block and the catch block both return. The file keeps one gap in branch coverage.
- Known limit `session-callback-busy`: when the state callback of `dispatch` throws at line 34, the session stays busy. No scenario states this behavior.
