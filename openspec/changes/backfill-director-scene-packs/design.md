## Context

Source commit: `b06f15a10c4294fd1ed7776370bfc273159d8d51`.
The legacy bootstrap upgrades a stored Nepal scene.
The pack method adds or updates shots through stored markers and shot references.

## Scope boundary

The area starts at `src/scenes/director.js:539` with `_bootstrapLegacyShotPacks`.
The area includes `appendShotPack` and ends at line 916.
The next method, `captureShot`, starts at line 917.
The method search command in the evidence gives this boundary.
Part A states the built-in scene and deleted-scene marker rules.
The current change does not repeat those requirements.

## Test decisions

The tests copy local fixtures and use storage and director fakes.
Custom recipe objects reach optional fields through the public pack method.
The tests do not request network data.
The host measures each test file in a separate process.
The evidence combines covered items from those processes.
The host result does not give a gate verdict.

## Default field table

Other fields use the local fixture values.
Each row states only the field forms that its tests check.

| Field | Form | Default |
| --- | --- | --- |
| `version` | Absent | Marker version 1 |
| `requiredShotTitles` | Absent or a nonarray object | Empty list |
| `requiredSourcePackBeatIds` | Absent or a nonarray object | Empty list |
| `requiredSourcePackLayerId` | Absent or a number | No source inventory check |
| `adoptExistingShotTitles` | Absent or a nonarray object | Empty set |
| `previousRequiredSourcePackBeatIdVariants` | Absent | List with the older beat list |
| `shotPatches` | Absent | Empty list |
| `releaseLayerIds` | Absent | Empty list |
| Scene `appliedShotPacks` | Absent | Empty list |
| Shot `layers` | Absent | Empty object before pack layers |
| `legacySceneBootstrap` | Absent | No project change |
| Bootstrap `cameraPath` | Absent | No project change |
| Bootstrap `fromShotTitles` | Absent | Empty list |

## Related browser QA scripts

The script header and comment search finds no script for the legacy Nepal shot pack bootstrap.
The scripts check camera control, authored actions, asset import, scene time and file sharing.

## Known limits

- Known limit `pack-layer-array`: the fallback branch at `src/scenes/director.js:852` cannot use an empty array operand.
  `recipeToScene` sets an own array at `src/scenes/project.js:175` before this expression.
  The array check at `src/scenes/project.js:177` replaces a nonarray recipe list with an empty list.
  Custom recipe proxies record field accesses through the public pack method.
  The source fallback gives the same result with and without that operand.
  No scenario states this behavior.
- Known limit `marker-list-before-refusal`: `appendShotPack` sets an absent marker list before an inventory refusal at `src/scenes/director.js:620`.
  A direct caller can see the new empty list after that refusal.
  No scenario states this behavior.
- Known limit `pack-save-result`: `appendShotPack` calls project storage after it changes shots and markers at `src/scenes/director.js:892`.
  Project storage catches primary storage errors without a success indicator.
  A storage error leaves the new shots and markers in memory.
  No scenario states this behavior.

- Known limit `singular-addition-notice`: the addition notice uses the word shots for one shot at `src/scenes/director.js:901`.
  No scenario states this behavior.

- Known limit `old-title-form`: the old version 12 test starts its title with installed.
  The owner rule keeps that title unchanged.
- Known limit `old-title-forms`: the old tagged titles contain framing, replacing, mutating or duplicating.
  The owner rule keeps those titles unchanged.
- Known limit `quoted-old-titles`: the evidence quotes unchanged old test names.
  The word check reports old words and abbreviations in those quotes.
  Those quotes do not add prose rules or scenario claims.

- Known limit `old-version-title`: the old version 12 title names a different addition total from its current fixture.
  The owner rule keeps that title unchanged.
- Known limit `bound-camera-with-complete-beats`: a complete source beat inventory disables expansion at `src/scenes/director.js:637`.
  The camera patch at `src/scenes/director.js:831` can replace a renamed bound camera in that case.
  No scenario states this behavior.

- Known limit `legacy-field-replacement`: the bootstrap copies only shot IDs and cameras at `src/scenes/director.js:577`.
  The shot array replacement at `src/scenes/director.js:580` replaces other authored shot fields with recipe fields.
  No scenario states this behavior.

## Gates and review

The lead runs the ratchet, gates and review.
The final tasks stay unchecked until those steps finish.
