## Context

Source commit: `345ce08d8712c6a547e5bba5da2e2d31e40d4c39`.
The scene director owns project storage, selection and resource setup.
The project module supplies document defaults and migration.
The scene controls draw the options and shot rows from director state.

## Scope boundary

The source method sweep places `SceneDirector` at line 75.
The method `_captureLayerStates` ends at line 532.
The comments through line 538 describe the next method.
The next method starts at line 539 and belongs to part B.
Part A covers lines 75 through 532 of `src/scenes/director.js`.
Parts C and D cover later shot and playback methods.

The constructor calls the legacy bootstrap method, but this change does not state its shot inventory rules.
Tests replace that method for checks of the constructor pack upgrade.
The tests copy only the local fixtures they need from the old test file.

## Test decisions

Tests use local storage, document, event target and owner fakes.
The tests do not request network data.
Each tagged leaf test calls an assertion method.
Mutation checks change the real source file and then restore it.
The mutation helper selects the test that must fail.
The scratch audit checks each compound decision and each loop.

Host coverage uses one test file per process.
The evidence combines covered paths across those processes.
The host result does not give a gate verdict.
The lead checks the Node version in the gate image.

## Related browser QA scripts

- `scripts/qa-director-sharing.mjs` checks scene author controls with local assets.
- `scripts/qa-director-packs.mjs` checks project import and resource cleanup.
- `scripts/qa-director-camera.mjs` checks imported camera paths and camera ownership.
- `scripts/qa-director-interactions.mjs` checks pointer and key actions with resource owners.

## Known limits

- Known limit `unreadable-project-status`: the constructor calls the legacy bootstrap after it sets the initial status at line 173.
  The bootstrap can replace that status with a storage notice.
  No scenario states this behavior.
- Known limit `empty-shot-selection`: `_renderShotList` leaves the selected shot ID unchanged when the selected scene contains no shots at line 450.
  A shot ID from another scene can stay in director state.
  No scenario states this behavior.
- Known limit `old-tests-outside-area`: the evidence lists old tests for the later director parts and other modules.
  Those tests keep their names without tags from this change.

- Known limit `installed-list-default`: the branch at `src/scenes/director.js:263` cannot use the empty array operand.
  The project normalizer sets an own installation list array before this expression.
  The document parser rejects nontext storage values at `src/director/document.js:166`.
  A proxy probe checks that rejection before any property access.
  No scenario states this behavior.

- Known limit `old-title-style`: the old test for `director-118` uses two words with an -ing form.
  The owner rule keeps its title unchanged.
- Known limit `old-visibility-title`: the old visibility request test uses a banned word in its title.
  The test also checks later playback methods.
  The evidence gives its exact title without a tag.
- Known limit `old-control-title`: the old real-director label test in `src/ui/sceneControls.test.mjs` uses a banned word.
  The evidence gives its exact title without a tag.
- Known limit `old-mixed-tests`: old tests for shutdown and unreadable storage also check later load, start or import methods.
  Those tests keep their names without tags from this change.
  New tests cover the setup claims.

- Known limit `fallback-project-checkpoint`: legacy bootstrap writes a default project checkpoint after the constructor rejects a saved document.
  The primary storage value stays unchanged.
  The scratch checkpoint probe checks both storage keys.
  No scenario states this behavior.

## Gates and review

The trace gate checks scenario tags and assertion methods.
The coverage gate checks production lines, branches and functions.
The STE gate checks prose and tagged titles.
The lead runs the ratchet, gates and review after the host checks.
The final tasks for those commands stay unchecked.

## Source commands

The evidence lists the commands for each measurement.
The method sweep uses the following command.

```sh
cd /home/ianblenke/docker/gev-work/director-4a && grep -n '^  [a-zA-Z#_].*) {$' src/scenes/director.js
```
