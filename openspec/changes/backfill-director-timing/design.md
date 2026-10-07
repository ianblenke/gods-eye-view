## Context

The source base is commit `290b5d2cf65d614e39f42a0b3b24a53fc2514985`.
Round 2 reads commit `43b776a14aaf7d9379a786f5dafdc1c79bd4e371`.
The scene controller supplies duration, hold, camera and timer adapters to these modules.

## Goals

Record current public behavior with tests that fail against code mutations.
Keep all production files unchanged.
The lead changes the browser QA headers at the archive step.

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
The scratch branch audit lists each branch and key loop.

## Base ledger sweep

The command below reads the base ledger at `290b5d2` and the current ledger.

```sh
cd /home/ianblenke/docker/gev-work/director && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director/sweep.py
```

| File | Open lines | Open branches | Open functions |
| --- | ---: | ---: | ---: |
| src/director/document.js | 2 | 3 | 0 |
| src/director/documentFields.js | 1 | 7 | 0 |
| src/director/authoring.js | 0 | 2 | 0 |
| src/director/clock.js | 12 | 11 | 1 |
| src/director/playback.js | Not listed | Not listed | Not listed |
| src/director/timeline.js | 0 | 10 | 0 |

The base ledger sweep gives these old test totals.

| Test file | Old tests |
| --- | ---: |
| src/director/document.test.mjs | 7 |
| src/director/clock.test.mjs | 6 |
| src/director/playback.test.mjs | 28 |
| src/director/timeline.test.mjs | 2 |

## Import sweep

The repository import sweep finds author tests in the author test file and the share test file.
The sweep finds the fields module tests in its adjacent file.
The base commit contains no test that imports the fields module.

```sh
cd /home/ianblenke/docker/gev-work/director && rg -l "from ['\"].*/authoring\.js['\"]" -g '*.test.mjs' .
cd /home/ianblenke/docker/gev-work/director && rg -l "from ['\"].*/documentFields\.js['\"]" -g '*.test.mjs' .
```

## Known limits

The evidence lists old tests that keep banned words and stay without tags.
The audit records equivalent checks through public functions and custom objects.
The lead checks Node 24 coverage and gate results.
- Known limit `zero-duration-default`: `src/director/timeline.js` uses the default flight duration for a shot with duration zero. Document validation accepts zero. No scenario states this behavior.
- Known limit `immediate-subscriber-error`: an error of a subscriber that the clock calls at once leaves the clock call. Publication catches the error of each later subscriber. No scenario states the first behavior.

- Known limit `qa-headers-ahead`: the lead changes the QA headers to `director` at the archive step.
  The camera, interaction, pack and asset exchange scripts then claim this capability before the later changes add their scenarios.
  The later camera, interaction, pack and asset exchange changes add those scenarios.
- Known limit `cleanup-error`: a failed cleanup replaces the phase error at `src/director/playback.js:86`. No scenario states this behavior.
- Known limit `scene-release-error`: with final cleanup on, an error from `releaseScene` between scenes keeps `activeScene`, so that method runs twice.
  Source: `src/director/playback.js:71`.
  No scenario states this behavior.

## Round 2 choices

The angle test uses progress 0.5, as the old test does.
Heading 350 to 10 gives 360 at progress 0.5 and 370 at progress 1.
The scenarios keep IDs `director-001` through `director-040`.
The tests come first for these corrections, as the round brief states.
The production files stay unchanged.
The scratch files stay outside the repository.

## Prose corrections

The test lists quote exact titles in code blocks.
Old test titles keep their words because the brief bans changes to those names.

The prose uses the stop method, the seek state, cancelled tokens, subscribers and errors.
The API uses the caller; a person selects a shot outside playback.
The fields module uses one name in this design and the proposal.
The task list separates the format check from the request for archive and review.
The phrase “bound” stays in old test titles and scenario headings as a verb that means set a limit.

The old `m068` row deleted a loop body and caused a syntax error.
The corrected row uses an empty statement, so the loop stays valid and the test checks the field result.

The QA limit names later work by its module scope because the round brief does not name each folder.
