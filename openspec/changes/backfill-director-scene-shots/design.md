## Context

Source commit: `dd4efcaccbac09ab63ec29192825a23b6368be91`.
The change adds specs and tests for old shot methods.

## Scope boundary

The area starts with `captureShot` at `src/scenes/director.js:917`.
The area ends at line 1653 after `getPlaybackStatus`.
Part B ends at line 916.
Part D starts with `get running` at line 1655.
The evidence records the method search command.

## Test decisions

The new test file copies local fixtures and uses custom director, viewer and manager fakes.
The tests call real shot methods with controlled clocks and promises.
The host measures each test file separately.
The evidence combines covered source items from those files.
Host coverage does not give an image gate verdict.

## Related browser QA scripts

- `scripts/qa-director-timing.mjs`: Scene time and seek control.
- `scripts/qa-director-camera.mjs`: Imported camera paths and camera control.
- `scripts/qa-director-interactions.mjs`: Pointer and key actions control authored scenes.
- `scripts/qa-director-packs.mjs`: Pack display and resource cleanup during shot changes.

## Known limits

- Known limit `old-zero-pitch-title`: the old zero-pitch title uses a word that the owner forbids in new prose.
  The test remains without a tag because the owner forbids a title change.
- Known limit `old-snapshot-title`: the old snapshot and outcome title uses a word that the owner forbids in new prose.
  The test remains without a tag because the owner forbids a title change.
- Known limit `old-destruction-title`: the old destruction title combines shot methods with the scene method in part D.
  The title also uses a word that the owner forbids in new prose.
  The test remains without a tag.
- Known limit `presentation-helper-tests`: old hold and map tests check the presentation helper through director methods.
  The new scenarios do not state those helper policies.
  The tests remain without new tags.

- Known limit `seek-after-layer-refusal`: a direct seek can succeed after a shot load reports a layer refusal.
  The owner assignment at `src/scenes/director.js:1109` precedes that refusal.
  The identity checks at line 1457 accept the scene and shot from that failed load.
  The direct path does not enable the refused layer.
  The public probe uses a manager that rejects each layer attempt.
  No scenario states this behavior.

- Known limit `shot-save-result`: shot methods change memory before storage at `src/scenes/director.js:941`, line 970 and line 988.
  The storage method catches errors without a success result.
  Capture and update still report their shot outcome after a storage error.
  No scenario states this behavior.

- Known limit `delete-other-scene-selection`: a shot deletion from another scene changes the selected shot without a scene selection change.
  The assignment at `src/scenes/director.js:986` uses that other scene.
  No scenario states this behavior.

- Known limit `adjacent-unknown-shot`: the next-shot request can select the first shot when the source shot ID is absent.
  The index at `src/scenes/director.js:1397` becomes minus one.
  No scenario states this behavior.
- Known limit `zero-travel-duration`: an immediate camera flight uses zero seconds, but its travel state uses four seconds at `src/scenes/director.js:1273`.
  No scenario states this behavior.
- Known limit `previous-scene-fallback`: the null fallback at `src/scenes/director.js:1052` gives the same public result as an absent value.
  The condition at line 1074 rejects both values before another property access.
  A proxy probe records one scene lookup and the same shot result.
  No scenario states this behavior.
- Known limit `null-seek-guard`: the left operand at `src/scenes/director.js:1094` does not change the result for a null seek state.
  The true arm also returns null after the type check.
  A getter probe records one option access and the same camera flight.
  No scenario states this behavior.
- Known limit `adjacent-index-getter`: a custom shot-list getter can change the index fallback at `src/scenes/director.js:1397`.
  The public probe gives an absent list on its first access and an array on its next access.
  The fallback changes the next array property access.
  No scenario states this behavior.
- Known limit `old-title-rules`: old titles keep words and forms outside the new prose rules.
  The evidence lists each old test without a new tag and its scope reason.
  No scenario states the title forms.

## Gates and review

The lead runs the ratchet, gates and review.
The final tasks stay unchecked until those steps finish.

## Coverage result

The evidence records the host command and all covered source items in this area.
The host finds no unreachable line or branch in this area.
The image gate result remains with the lead.

## Host tool limit

The direct formatter stops with `spawnSync git EPERM` before its format checks finish.
The scratch adapter accepts the captured Git output only after child status zero and empty error output.
The format scope and all format checks stay the same.

