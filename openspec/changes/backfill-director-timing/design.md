## Context

This change records commit `290b5d2cf65d614e39f42a0b3b24a53fc2514985`.
The scene controller supplies duration, hold, camera and timer adapters to these modules.

## Goals

Record current public behavior with tests that fail against code mutations.
Keep all production files and browser QA scripts unchanged.

## Decisions

The tests use local objects, custom clocks and adapters.
The tests do not request network data.
The host coverage result is not a gate result.
The lead runs the ratchet, gates, archive and review.

The trace gate checks test tags and assertion methods.
The coverage gate checks each code file.
The STE gate checks prose and tagged test titles.

## Related browser QA scripts

- `scripts/qa-director-timing.mjs` proves scene time, seek control and clock ownership in the browser.
- `scripts/qa-director-camera.mjs` proves imported camera paths and camera control across playback and seek.
- `scripts/qa-director-interactions.mjs` proves pointer and key actions on authored scenes after shot selection.
- `scripts/qa-director-packs.mjs` proves pack import, display and resource cleanup across shot changes.
- `scripts/qa-director-sharing.mjs` proves local asset exchange and author controls for selected scenes.

## Evidence

The final evidence lists host coverage, test links, code mutations and known limits.
The scratch audit lists each decision and key loop.

## Ledger sweep

The command below reads each scoped ledger entry and each old test name.

```sh
cd /home/ianblenke/docker/gev-work/director && python3 /home/ianblenke/docker/gev-tools/director/sweep.py
```

| File | Open lines | Open branches | Open functions |
| --- | ---: | ---: | ---: |
| src/director/document.js | 2 | 3 | 0 |
| src/director/documentFields.js | 1 | 7 | 0 |
| src/director/authoring.js | 0 | 2 | 0 |
| src/director/clock.js | 12 | 11 | 1 |
| src/director/playback.js | Not listed | Not listed | Not listed |
| src/director/timeline.js | 0 | 10 | 0 |

The same sweep gives these old test totals from the ledger.

| Test file | Old tests |
| --- | ---: |
| src/director/document.test.mjs | 7 |
| src/director/clock.test.mjs | 6 |
| src/director/playback.test.mjs | 28 |
| src/director/timeline.test.mjs | 2 |

## Import sweep

The whole repository import sweep finds author tests only in the share test file.
It finds no direct field helper import in a test.
This change adds adjacent tests for each module.

```sh
cd /home/ianblenke/docker/gev-work/director && grep -rln "from '.*/authoring.js'" --include=*.test.mjs .
cd /home/ianblenke/docker/gev-work/director && grep -rln "from '.*/documentFields.js'" --include=*.test.mjs .
```

## Known limits

The evidence lists old tests that keep banned words and stay without tags.
The audit records equivalent checks through public functions and custom objects.
The lead checks Node 24 coverage and gate results.
- Known limit `zero-duration-default`: `src/director/timeline.js` uses the default flight duration for a shot with duration zero. Document validation accepts zero. No scenario states this behavior.
- Known limit `immediate-subscriber-error`: an exception of a subscriber that the clock calls at once leaves the clock call. Publication catches the exception of each later subscriber. No scenario states the first behavior.
