## Context

The change records commit `290b5d2`.
The scene controller resolves camera poses when it loads, replays or seeks a scene.
It admits interactions after it loads or seeks a scene.

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
The audit records each branch and field loop.

## Sweep commands

The evidence gives the ledger gaps, old test totals and import paths from the scope sweep.
The audit command gives the tested, default-value and equivalent row totals.
The complete mutation command gives each result in its output.

```sh
cd /home/ianblenke/docker/gev-work/director-2 && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director-2/sweep.py
cd /home/ianblenke/docker/gev-work/director-2 && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director-2/audit2.py
```

## Corrections of review round 1

Pass 2 reads base commit `290b5d2` and the current files.
The code accepts duration 0.2 seconds and rejects 0.19 seconds.
The pass uses these limits because the brief gives two different results for 0.19 seconds.

The pass deletes the test that changes the Map size getter.
A supplied list or proxy cannot change the native Map size getter.
The native Map stores each ID before the session reads its size.
An inactive session therefore contains no interaction that dispatch can find.

The scratch probe uses getters, a proxy list and a map callback spy.
Row m149 records an equivalent change, not failed tests.
The proposal gives the known limits.

## Text check choices

The predispatch tool also checks code blocks.
Those blocks hold source strings, error messages, test titles and the lcov record.
The pass keeps those strings because they are evidence.
The word `abort` names the API event and signal.

The tool marks the verb in the phrase "content that runs" as a noun.
That phrase states a verb, so the pass keeps it.
The audit class `DEFAULT-VALUE` names a row type, not a unit.

## Source check

The source comparison with main gives no difference.

```sh
cd /home/ianblenke/docker/gev-work/director-2 && git diff --stat 290b5d2 origin/main -- 'src/director/*.js' 'src/director/interactions/*.js'
```
