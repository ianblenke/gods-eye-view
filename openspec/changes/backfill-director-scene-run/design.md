## Context

Source commit: `dd4dc1bc3bee72d5ec0d2e159ff6cdae6a53a8de`.
The change adds specs and tests for old code.

## Scope boundary

Part C ends at line 1653.
The area starts at line 1654, before the getter at line 1655.
The area ends at line 2483, the end of `src/scenes/director.js`.
The evidence records the method search and file length commands.

## Test decisions

The new file copies local fixtures and uses viewer, manager, clock and document fakes.
Each host coverage process tests one file.
The evidence takes the union of covered source items.
The host result does not give an image gate verdict.
The trace gate checks scenario tags and assertion methods.
The STE gate checks prose and tagged test titles.

## Related browser QA scripts

- `scripts/qa-director-timing.mjs`: Scene time and seek control.
- `scripts/qa-director-camera.mjs`: Imported camera paths and camera control.
- `scripts/qa-director-interactions.mjs`: Pointer and key actions control authored scenes.
- `scripts/qa-director-packs.mjs`: Pack import, display and resource cleanup.
- `scripts/qa-director-sharing.mjs`: Authors share scenes with local assets.

## Known limits

- Known limit `scene-success-result`: `_startScene` returns an absent value after successful playback at `src/scenes/director.js:1792`.
  The method comment describes a result object.
  No scenario states this behavior.
- Known limit `import-after-wait-result`: the late destruction or generation check returns an absent value at `src/scenes/director.js:1991`.
  Earlier checks return false.
  No scenario states this behavior.
- Known limit `scene-total-field`: the field `scenesRun` records the shot queue total at `src/scenes/director.js:1768`.
  The field name suggests a scene total.
  No scenario states that the field measures scenes.
- Known limit `old-title-rules`: some old titles use words that the owner forbids in new prose.
  Other old tests check methods outside this area.
  The evidence lists every old test without a new tag and its reason.
  Some tagged old titles give style warnings.
  The owner does not allow changes to those titles.

- Known limit `import-asset-owner-error`: an asset owner error leaves the new project with the old selection at `src/scenes/director.js:1999`.
  The asset owner method at line 2006 follows the project assignment.
  The catch reports a JSON file error at line 2031.
  The public probe supplies a valid project and an asset owner that throws.
  No scenario states this behavior.
- Known limit `context-null-value`: the null fallback at `src/scenes/director.js:2212` gives the same public result as an absent value.
  The guard at `src/scenes/scenePolicy.js:125` rejects both values before another field access.
  The public probe uses a proxy for the context state and records each getter access.
  A truthy object uses the same operand in both versions.
  A falsy primitive reaches the same policy guard, and a fake cannot change that guard.
  No scenario states this behavior.

- Known limit `after-shot-default-scene`: an absent scene ID with afterShotId reports shot-not-found at `src/scenes/director.js:1695`.
  The queue uses the selected scene, but the test of scene.id uses the absent argument.
  The public probe supplies a selected scene and a current shot ID.
  No scenario states this behavior.

## Gates and review

The lead runs the ratchet, image gates and review.
The final tasks stay unchecked until those steps finish.
