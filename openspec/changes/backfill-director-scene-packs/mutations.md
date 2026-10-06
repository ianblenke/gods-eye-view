# Director shot pack mutations

Source commit: `b06f15a10c4294fd1ed7776370bfc273159d8d51`.

The source operator uses `␠` for a space and `↵` for a new line.
The scratch folder holds the JSON source edits and process logs.

| ID | File:line | Operator | Test or source limit | Result |
| --- | --- | --- | --- | --- |
| M001 | `src/scenes/director.js:540` | `SCENE_APPEND_RECIPES␠->␠[]` | The legacy sequence keeps three shot IDs and cameras | KILLED |
| M002 | `src/scenes/director.js:542` | `!bootstrap␠&#124;&#124;␠␠->␠` | The recipe accepts absent bootstrap | KILLED |
| M003 | `src/scenes/director.js:542` | `!Array.isArray(bootstrap.cameraPath)␠->␠false` | The recipe accepts absent path | KILLED |
| M004 | `src/scenes/director.js:543` | `Array.isArray(bootstrap.fromShotTitles)␠->␠true` | The recipe accepts absent titles | KILLED |
| M005 | `src/scenes/director.js:548` | `candidate.title␠===␠bootstrap.targetSceneTitle␠&&␠->␠true␠&&` | The legacy scene title protects authored shots | KILLED |
| M006 | `src/scenes/director.js:549` | `candidate.shots.length␠===␠expectedTitles.length␠&&␠->␠true␠&&` | The legacy shot total protects authored shots | KILLED |
| M007 | `src/scenes/director.js:551` | `shot.title␠===␠expectedTitles[index]␠->␠index␠===␠0␠&#124;&#124;␠shot.title␠===␠expectedTitles[index]` | The legacy first title protects authored shots | KILLED |
| M008 | `src/scenes/director.js:551` | `shot.title␠===␠expectedTitles[index]␠->␠index␠===␠1␠&#124;&#124;␠shot.title␠===␠expectedTitles[index]` | The legacy second title protects authored shots | KILLED |
| M009 | `src/scenes/director.js:551` | `shot.title␠===␠expectedTitles[index]␠->␠index␠===␠2␠&#124;&#124;␠shot.title␠===␠expectedTitles[index]` | The legacy third title protects authored shots | KILLED |
| M010 | `src/scenes/director.js:564` | `continue;␠->␠void␠0;` | The legacy checkpoint error protects the scene | KILLED |
| M011 | `src/scenes/director.js:577` | `canonicalBase[index].id␠=␠scene.shots[index].id␠->␠canonicalBase[index].id␠=␠"wrong"` | The legacy sequence keeps three shot IDs and cameras | KILLED |
| M012 | `src/scenes/director.js:578` | `deepClone(scene.shots[index].camera)␠->␠{heading:99}` | The legacy sequence keeps three shot IDs and cameras | KILLED |
| M013 | `src/scenes/director.js:588` | `this._project␠=␠originalProject␠->␠void␠originalProject` | The legacy pack refusal restores the project | KILLED |
| M014 | `src/scenes/director.js:592` | `scene.shots[0]?.id␠&#124;&#124;␠null␠->␠null` | The legacy selection uses its first shot | KILLED |
| M015 | `src/scenes/director.js:592` | `&#124;&#124;␠null␠->␠&#124;&#124;␠"wrong"` | The recipe accepts absent titles | KILLED |
| M016 | `src/scenes/director.js:617` | `return␠{␠appended:␠false,␠reason:␠'scene-not-found'␠}␠->␠return␠{␠appended:␠true␠}` | The absent scene rejects the pack | KILLED |
| M017 | `src/scenes/director.js:619` | `return␠{␠appended:␠false,␠reason:␠'pack-not-found'␠}␠->␠return␠{␠appended:␠true␠}` | The absent pack rejects the request | KILLED |
| M018 | `src/scenes/director.js:624` | `&#124;&#124;␠1␠->␠&#124;&#124;␠9` | The recipe accepts absent version | KILLED |
| M019 | `src/scenes/director.js:625` | `&#124;&#124;␠0␠->␠&#124;&#124;␠99` | The first Nepal pack adds its current sequence | KILLED |
| M020 | `src/scenes/director.js:625` | `>=␠targetVersion␠->␠>␠targetVersion` | The version 18 marker prevents another pack | KILLED |
| M021 | `src/scenes/director.js:634` | `recipe.expansionFromVersion␠&&␠->␠true␠&&` | The absent expansion version uses the source inventory check | KILLED |
| M022 | `src/scenes/director.js:635` | `marker?.version␠>␠0␠&&␠->␠true␠&&` | The zero marker version uses the source inventory check | KILLED |
| M023 | `src/scenes/director.js:636` | `marker.version␠<=␠recipe.expansionFromVersion␠&&␠->␠true␠&&` | The higher marker version uses the source inventory check | KILLED |
| M024 | `src/scenes/director.js:637` | `existingPackShots.length␠!==␠recipe.requiredSourcePackBeatIds.length␠->␠true` | The complete beat total uses the source inventory check | KILLED |
| M025 | `src/scenes/director.js:641` | `Array.isArray(↵␠␠␠␠␠␠recipe.previousRequiredSourcePackBeatIdVariants,↵␠␠␠␠)␠->␠true` | The empty adoption list accepts expansion | KILLED |
| M026 | `src/scenes/director.js:647` | `expanding␠&&␠->␠true␠&&` | The first Nepal pack adds its current sequence | KILLED |
| M027 | `src/scenes/director.js:648` | `!previousSourcePackVariants.some␠->␠false␠&&␠!previousSourcePackVariants.some` | The partial older beats reject expansion | KILLED |
| M028 | `src/scenes/director.js:660` | `Array.isArray(recipe.adoptExistingShotTitles)␠->␠true` | The recipe accepts a nonlist adoptExistingShotTitles | KILLED |
| M029 | `src/scenes/director.js:665` | `expanding␠&&␠->␠true␠&&` | The first pack does not adopt an authored shot | KILLED |
| M030 | `src/scenes/director.js:665` | `adoptableTitles.size␠->␠false` | The authored final view supplies its ID and camera | KILLED |
| M031 | `src/scenes/director.js:679` | `!shot.sourcePackId␠&&␠->␠true␠&&` | The other pack final view does not supply a shot | KILLED |
| M032 | `src/scenes/director.js:679` | `shot.title␠===␠packShot.title␠->␠true` | The authored final view supplies its ID and camera | KILLED |
| M033 | `src/scenes/director.js:681` | `candidates.length␠===␠1␠->␠candidates.length␠>␠0` | The duplicate final view does not supply a shot | KILLED |
| M034 | `src/scenes/director.js:677` | `continue;␠->␠void␠0;` | The stored final beat prevents another adoption | KILLED |
| M035 | `src/scenes/director.js:685` | `marker↵␠->␠false↵` | The older marker does not add shots without expansion | KILLED |
| M036 | `src/scenes/director.js:686` | `expanding↵␠->␠false↵` | The version 12 pack keeps authored cameras and titles | KILLED |
| M037 | `src/scenes/director.js:689` | `!existingPackShots.some␠->␠false␠&&␠!existingPackShots.some` | The version 12 pack keeps authored cameras and titles | KILLED |
| M038 | `src/scenes/director.js:695` | `!adoptedShotIds.has(shot.id)␠->␠true` | The authored final view supplies its ID and camera | KILLED |
| M039 | `src/scenes/director.js:703` | `!existingShot␠&#124;&#124;␠␠->␠` | The absent stored shot rejects adopted source beats | KILLED |
| M040 | `src/scenes/director.js:703` | `!packShot␠->␠false` | The absent pack shot rejects adopted source beats | KILLED |
| M041 | `src/scenes/director.js:704` | `existingShot.sourcePackId␠=␠recipe.id␠->␠void␠recipe.id` | The authored final view supplies its ID and camera | KILLED |
| M042 | `src/scenes/director.js:705` | `existingShot.sourcePackVersion␠=␠targetVersion␠->␠void␠targetVersion` | The authored final view supplies its ID and camera | KILLED |
| M043 | `src/scenes/director.js:707` | `existingShot.layers␠&#124;&#124;␠{}␠->␠existingShot.layers` | The recipe accepts an absent adopted layer object | KILLED |
| M044 | `src/scenes/director.js:725` | `item.sourcePackId␠===␠recipe.id␠&&␠->␠true␠&&` | The older additions follow recipe order | KILLED |
| M045 | `src/scenes/director.js:727` | `nextBeatId␠->␠"wrong"` | The older additions follow recipe order | KILLED |
| M046 | `src/scenes/director.js:729` | `before␠<␠0␠?␠nextShots.length␠:␠before␠->␠nextShots.length` | The older additions follow recipe order | KILLED |
| M047 | `src/scenes/director.js:729` | `before␠<␠0␠?␠nextShots.length␠:␠before␠->␠before` | The last addition follows an authored tail | KILLED |
| M048 | `src/scenes/director.js:732` | `Array.isArray(recipe.requiredShotTitles)␠->␠true` | The recipe accepts a nonlist requiredShotTitles | KILLED |
| M049 | `src/scenes/director.js:744` | `marker?.shotBindings␠->␠null` | The renamed bound shot receives its patch | KILLED |
| M050 | `src/scenes/director.js:748` | `markerBindings↵␠->␠null↵` | The absent bound shot rejects the inventory | KILLED |
| M051 | `src/scenes/director.js:751` | `&#124;&#124;↵␠␠␠␠␠␠␠␠␠␠␠␠␠␠null␠->␠&#124;&#124;↵␠␠␠␠␠␠␠␠␠␠␠␠␠␠{}` | The absent bound shot rejects the inventory | KILLED |
| M052 | `src/scenes/director.js:756` | `resolvedShots.length␠===␠requiredShotTitles.length␠&&␠->␠true␠&&` | The short title prefix rejects the pack | KILLED |
| M053 | `src/scenes/director.js:757` | `markerBindings↵␠->␠null↵` | The renamed bound shot receives its patch | KILLED |
| M054 | `src/scenes/director.js:758` | `resolvedShots.every(Boolean)␠&&␠->␠true␠&&` | The absent bound shot rejects the inventory | KILLED |
| M055 | `src/scenes/director.js:759` | `new␠Set(resolvedShots.map((shot)␠=>␠shot.id)).size␠===↵␠␠␠␠␠␠␠␠␠␠␠␠␠␠requiredShotTitles.length␠->␠true` | The repeated bound shot rejects the inventory | KILLED |
| M056 | `src/scenes/director.js:762` | `shot.title␠===␠requiredShotTitles[index]␠->␠true` | The incorrect initial title rejects the pack | KILLED |
| M057 | `src/scenes/director.js:775` | `Array.isArray(↵␠␠␠␠␠␠recipe.requiredSourcePackBeatIds,↵␠␠␠␠)␠->␠true` | The recipe accepts a nonlist requiredSourcePackBeatIds | KILLED |
| M058 | `src/scenes/director.js:781` | `typeof␠recipe.requiredSourcePackLayerId␠===␠'string'␠->␠true` | The recipe accepts a nontext source layer name | KILLED |
| M059 | `src/scenes/director.js:784` | `requiredSourcePackBeatIds.length␠&&␠->␠true␠&&` | The empty source beat list does not check its layer | KILLED |
| M060 | `src/scenes/director.js:784` | `requiredSourcePackLayerId)␠{␠->␠true)␠{` | The absent source layer name does not check beats | KILLED |
| M061 | `src/scenes/director.js:791` | `sourcePackBeatIds.length␠===␠requiredSourcePackBeatIds.length␠&&␠->␠true␠&&` | The source length rejects the pack | KILLED |
| M062 | `src/scenes/director.js:793` | `beatId␠===␠requiredSourcePackBeatIds[index]␠->␠true` | The source order rejects the pack | KILLED |
| M063 | `src/scenes/director.js:810` | `&#124;&#124;␠null␠->␠&#124;&#124;␠{}` | The absent patch reference rejects the pack | KILLED |
| M064 | `src/scenes/director.js:812` | `matches.length␠===␠1␠->␠matches.length␠>␠0` | The duplicate patch title rejects the pack | KILLED |
| M065 | `src/scenes/director.js:814` | `recipe.shotPatches␠&#124;&#124;␠[]␠->␠recipe.shotPatches` | The recipe accepts absent shotPatches | KILLED |
| M066 | `src/scenes/director.js:831` | `patch.camera␠&&␠->␠true␠&&` | The hold value 7 gives 7 seconds | KILLED |
| M067 | `src/scenes/director.js:831` | `!expanding␠->␠true` | The expansion does not replace a patched camera | KILLED |
| M068 | `src/scenes/director.js:832` | `shot.camera␠=␠normalizeShot␠->␠shot.camera␠=␠false␠&&␠normalizeShot` | The camera patch sets its normalized pose | KILLED |
| M069 | `src/scenes/director.js:834` | `Number.isFinite(Number(patch.holdSec))␠->␠true` | The hold value invalid gives 3 seconds | KILLED |
| M070 | `src/scenes/director.js:835` | `Math.max(0,␠Number(patch.holdSec))␠->␠Number(patch.holdSec)` | The hold value -2 gives 0 seconds | KILLED |
| M071 | `src/scenes/director.js:840` | `...shot.visual,␠...patch.visual␠->␠...patch.visual` | The visual patch keeps other visual fields | KILLED |
| M072 | `src/scenes/director.js:844` | `patch.layers␠&#124;&#124;␠{}␠->␠patch.layers` | The notice reports 1 patched shot | KILLED |
| M073 | `src/scenes/director.js:845` | `shot.layers[layerId]␠=␠normalizeLayerEntry(target)␠->␠if␠(layerId␠!==␠"first")␠shot.layers[layerId]␠=␠normalizeLayerEntry(target)` | The layer patch sets first | KILLED |
| M074 | `src/scenes/director.js:845` | `shot.layers[layerId]␠=␠normalizeLayerEntry(target)␠->␠if␠(layerId␠!==␠"second")␠shot.layers[layerId]␠=␠normalizeLayerEntry(target)` | The layer patch sets second | KILLED |
| M075 | `src/scenes/director.js:851` | `scene.releaseLayerIds␠&#124;&#124;␠[]␠->␠scene.releaseLayerIds` | The recipe accepts absent releaseLayerIds | KILLED |
| M076 | `src/scenes/director.js:852` | `pack.releaseLayerIds␠&#124;&#124;␠[]␠->␠pack.releaseLayerIds` | The pack layer array | Equivalent |
| M077 | `src/scenes/director.js:859` | `nextShots.find((shot)␠=>␠shot.id␠===␠markerBindings?.[title])?.id␠->␠undefined` | The renamed bound shot receives its patch | KILLED |
| M078 | `src/scenes/director.js:860` | `nextShots.find((shot)␠=>␠shot.title␠===␠title)?.id␠->␠undefined` | The title match supplies a shot reference | KILLED |
| M079 | `src/scenes/director.js:873` | `return␠{␠appended:␠false,␠reason:␠'checkpoint-failed'␠}␠->␠return␠{␠appended:␠true␠}` | The pack checkpoint error protects shots | KILLED |
| M080 | `src/scenes/director.js:882` | `Object.keys(shotBindings).length␠->␠false` | The title match supplies a shot reference | KILLED |
| M081 | `src/scenes/director.js:882` | `{␠shotBindings␠}␠:␠{}␠->␠{␠shotBindings␠}␠:␠{␠shotBindings␠}` | The marker replacement keeps another pack marker | KILLED |
| M082 | `src/scenes/director.js:891` | `appendedShots[0]?.id␠&#124;&#124;␠this._selectedShotId␠->␠this._selectedShotId` | The pack selection uses the addition | KILLED |
| M083 | `src/scenes/director.js:891` | `appendedShots[0]?.id␠&#124;&#124;␠this._selectedShotId␠->␠appendedShots[0]?.id` | The pack selection uses the saved shot | KILLED |
| M084 | `src/scenes/director.js:892` | `this._saveProject()␠->␠void␠0` | The pack saves before both control updates | KILLED |
| M085 | `src/scenes/director.js:894` | `this._renderSceneSelect()␠->␠void␠0` | The pack saves before both control updates | KILLED |
| M086 | `src/scenes/director.js:895` | `this._renderShotList()␠->␠void␠0` | The pack saves before both control updates | KILLED |
| M087 | `src/scenes/director.js:899` | `marker↵␠->␠false↵` | The notice reports 1 patched shot | KILLED |
| M088 | `src/scenes/director.js:900` | `patchedShotCount␠===␠1␠?␠'shot'␠:␠'shots'␠->␠'shots'` | The notice reports 1 patched shot | KILLED |
| M089 | `src/scenes/director.js:900` | `patchedShotCount␠===␠1␠?␠'shot'␠:␠'shots'␠->␠'shot'` | The notice reports 2 patched shots | KILLED |
| M090 | `src/scenes/director.js:865` | `if␠(writeCheckpoint)␠->␠if␠(true)` | The silent options save without optional actions | KILLED |
| M091 | `src/scenes/director.js:893` | `if␠(render)␠->␠if␠(true)` | The silent options save without optional actions | KILLED |
| M092 | `src/scenes/director.js:897` | `if␠(announce)␠->␠if␠(true)` | The silent options save without optional actions | KILLED |
| M093 | `src/scenes/director.js:830` | `for␠(const␠{␠patch,␠shot␠}␠of␠resolvedPatches)␠{␠->␠for␠(const␠{␠patch,␠shot␠}␠of␠resolvedPatches)␠{↵␠␠␠␠␠␠if␠(patch.title␠===␠"Global␠Incident␠Context")␠continue;` | The Nepal patch sets target 1 | KILLED |
| M094 | `src/scenes/director.js:830` | `for␠(const␠{␠patch,␠shot␠}␠of␠resolvedPatches)␠{␠->␠for␠(const␠{␠patch,␠shot␠}␠of␠resolvedPatches)␠{↵␠␠␠␠␠␠if␠(patch.title␠===␠"Nepal-Focused␠Globe␠Rotation")␠continue;` | The Nepal patch sets target 2 | KILLED |
| M095 | `src/scenes/director.js:830` | `for␠(const␠{␠patch,␠shot␠}␠of␠resolvedPatches)␠{␠->␠for␠(const␠{␠patch,␠shot␠}␠of␠resolvedPatches)␠{↵␠␠␠␠␠␠if␠(patch.title␠===␠"Bhote␠Koshi␠Regional␠Approach")␠continue;` | The Nepal patch sets target 3 | KILLED |
| M096 | `src/scenes/director.js:830` | `for␠(const␠{␠patch,␠shot␠}␠of␠resolvedPatches)␠{␠->␠for␠(const␠{␠patch,␠shot␠}␠of␠resolvedPatches)␠{↵␠␠␠␠␠␠if␠(patch.title␠===␠"Bhote␠Koshi␠Nearby␠Cities")␠continue;` | The Nepal patch sets target 4 | KILLED |
| M097 | `src/scenes/director.js:830` | `for␠(const␠{␠patch,␠shot␠}␠of␠resolvedPatches)␠{␠->␠for␠(const␠{␠patch,␠shot␠}␠of␠resolvedPatches)␠{↵␠␠␠␠␠␠if␠(patch.title␠===␠"Bhote␠Koshi␠Incident␠Corridor")␠continue;` | The Nepal patch sets target 5 | KILLED |
| M098 | `src/scenes/director.js:830` | `for␠(const␠{␠patch,␠shot␠}␠of␠resolvedPatches)␠{␠->␠for␠(const␠{␠patch,␠shot␠}␠of␠resolvedPatches)␠{↵␠␠␠␠␠␠if␠(patch.title␠===␠"Bhote␠Koshi␠Flood␠Path")␠continue;` | The Nepal patch sets target 6 | KILLED |
| M099 | `src/scenes/director.js:830` | `for␠(const␠{␠patch,␠shot␠}␠of␠resolvedPatches)␠{␠->␠for␠(const␠{␠patch,␠shot␠}␠of␠resolvedPatches)␠{↵␠␠␠␠␠␠if␠(patch.title␠===␠"Bhote␠Koshi␠Corridor␠Overview")␠continue;` | The Nepal patch sets target 7 | KILLED |
| M100 | `src/scenes/director.js:830` | `for␠(const␠{␠patch,␠shot␠}␠of␠resolvedPatches)␠{␠->␠for␠(const␠{␠patch,␠shot␠}␠of␠resolvedPatches)␠{↵␠␠␠␠␠␠if␠(patch.title␠===␠"Bhote␠Koshi␠Upper␠Valley")␠continue;` | The Nepal patch sets target 8 | KILLED |
| M101 | `src/scenes/director.js:830` | `for␠(const␠{␠patch,␠shot␠}␠of␠resolvedPatches)␠{␠->␠for␠(const␠{␠patch,␠shot␠}␠of␠resolvedPatches)␠{↵␠␠␠␠␠␠if␠(patch.title␠===␠"Upper␠Valley␠Collapse")␠continue;` | The Nepal patch sets target 9 | KILLED |
| M102 | `src/scenes/director.js:830` | `for␠(const␠{␠patch,␠shot␠}␠of␠resolvedPatches)␠{␠->␠for␠(const␠{␠patch,␠shot␠}␠of␠resolvedPatches)␠{↵␠␠␠␠␠␠if␠(patch.title␠===␠"Nepal-China␠Border␠Gate")␠continue;` | The Nepal patch sets target 10 | KILLED |
| M103 | `src/scenes/director.js:830` | `for␠(const␠{␠patch,␠shot␠}␠of␠resolvedPatches)␠{␠->␠for␠(const␠{␠patch,␠shot␠}␠of␠resolvedPatches)␠{↵␠␠␠␠␠␠if␠(patch.title␠===␠"Timure␠Evidence␠Cluster")␠continue;` | The Nepal patch sets target 11 | KILLED |
| M104 | `src/scenes/director.js:830` | `for␠(const␠{␠patch,␠shot␠}␠of␠resolvedPatches)␠{␠->␠for␠(const␠{␠patch,␠shot␠}␠of␠resolvedPatches)␠{↵␠␠␠␠␠␠if␠(patch.title␠===␠"Syabru␠Besi␠Passage")␠continue;` | The Nepal patch sets target 12 | KILLED |
| M105 | `src/scenes/director.js:830` | `for␠(const␠{␠patch,␠shot␠}␠of␠resolvedPatches)␠{␠->␠for␠(const␠{␠patch,␠shot␠}␠of␠resolvedPatches)␠{↵␠␠␠␠␠␠if␠(patch.title␠===␠"Bidur␠/␠Trishuli␠Consequence")␠continue;` | The Nepal patch sets target 13 | KILLED |
| M106 | `src/scenes/director.js:830` | `for␠(const␠{␠patch,␠shot␠}␠of␠resolvedPatches)␠{␠->␠for␠(const␠{␠patch,␠shot␠}␠of␠resolvedPatches)␠{↵␠␠␠␠␠␠if␠(patch.title␠===␠"Final␠view")␠continue;` | The Nepal patch sets target 14 | KILLED |
| M107 | `src/scenes/director.js:666` | `for␠(const␠packShot␠of␠pack.shots)␠{␠->␠for␠(const␠packShot␠of␠pack.shots)␠{↵␠␠␠␠␠␠␠␠if␠(packShot.layers?.evidence?.params?.beatId␠===␠"immediate-collapse-viewpoint")␠continue;` | The adoption uses immediate-collapse-viewpoint | KILLED |
| M108 | `src/scenes/director.js:666` | `for␠(const␠packShot␠of␠pack.shots)␠{␠->␠for␠(const␠packShot␠of␠pack.shots)␠{↵␠␠␠␠␠␠␠␠if␠(packShot.layers?.evidence?.params?.beatId␠===␠"debris-dammed-lake")␠continue;` | The adoption uses debris-dammed-lake | KILLED |
| M109 | `src/scenes/director.js:666` | `for␠(const␠packShot␠of␠pack.shots)␠{␠->␠for␠(const␠packShot␠of␠pack.shots)␠{↵␠␠␠␠␠␠␠␠if␠(packShot.layers?.evidence?.params?.beatId␠===␠"second-landslide")␠continue;` | The adoption uses second-landslide | KILLED |
| M110 | `src/scenes/director.js:666` | `for␠(const␠packShot␠of␠pack.shots)␠{␠->␠for␠(const␠packShot␠of␠pack.shots)␠{↵␠␠␠␠␠␠␠␠if␠(packShot.layers?.evidence?.params?.beatId␠===␠"gyirong-border-gate")␠continue;` | The adoption uses gyirong-border-gate | KILLED |
| M111 | `src/scenes/director.js:666` | `for␠(const␠packShot␠of␠pack.shots)␠{␠->␠for␠(const␠packShot␠of␠pack.shots)␠{↵␠␠␠␠␠␠␠␠if␠(packShot.layers?.evidence?.params?.beatId␠===␠"timure-cluster")␠continue;` | The adoption uses timure-cluster | KILLED |
| M112 | `src/scenes/director.js:666` | `for␠(const␠packShot␠of␠pack.shots)␠{␠->␠for␠(const␠packShot␠of␠pack.shots)␠{↵␠␠␠␠␠␠␠␠if␠(packShot.layers?.evidence?.params?.beatId␠===␠"syabru-besi")␠continue;` | The adoption uses syabru-besi | KILLED |
| M113 | `src/scenes/director.js:666` | `for␠(const␠packShot␠of␠pack.shots)␠{␠->␠for␠(const␠packShot␠of␠pack.shots)␠{↵␠␠␠␠␠␠␠␠if␠(packShot.layers?.evidence?.params?.beatId␠===␠"dhunche")␠continue;` | The adoption uses dhunche | KILLED |
| M114 | `src/scenes/director.js:666` | `for␠(const␠packShot␠of␠pack.shots)␠{␠->␠for␠(const␠packShot␠of␠pack.shots)␠{↵␠␠␠␠␠␠␠␠if␠(packShot.layers?.evidence?.params?.beatId␠===␠"mailung-upper-trishuli")␠continue;` | The adoption uses mailung-upper-trishuli | KILLED |
| M115 | `src/scenes/director.js:666` | `for␠(const␠packShot␠of␠pack.shots)␠{␠->␠for␠(const␠packShot␠of␠pack.shots)␠{↵␠␠␠␠␠␠␠␠if␠(packShot.layers?.evidence?.params?.beatId␠===␠"mailung-bazzar")␠continue;` | The adoption uses mailung-bazzar | KILLED |
| M116 | `src/scenes/director.js:666` | `for␠(const␠packShot␠of␠pack.shots)␠{␠->␠for␠(const␠packShot␠of␠pack.shots)␠{↵␠␠␠␠␠␠␠␠if␠(packShot.layers?.evidence?.params?.beatId␠===␠"dandagaun")␠continue;` | The adoption uses dandagaun | KILLED |
| M117 | `src/scenes/director.js:666` | `for␠(const␠packShot␠of␠pack.shots)␠{␠->␠for␠(const␠packShot␠of␠pack.shots)␠{↵␠␠␠␠␠␠␠␠if␠(packShot.layers?.evidence?.params?.beatId␠===␠"dandagaun-viewpoint")␠continue;` | The adoption uses dandagaun-viewpoint | KILLED |
| M118 | `src/scenes/director.js:666` | `for␠(const␠packShot␠of␠pack.shots)␠{␠->␠for␠(const␠packShot␠of␠pack.shots)␠{↵␠␠␠␠␠␠␠␠if␠(packShot.layers?.evidence?.params?.beatId␠===␠"betrawati-bazaar")␠continue;` | The adoption uses betrawati-bazaar | KILLED |
| M119 | `src/scenes/director.js:666` | `for␠(const␠packShot␠of␠pack.shots)␠{␠->␠for␠(const␠packShot␠of␠pack.shots)␠{↵␠␠␠␠␠␠␠␠if␠(packShot.layers?.evidence?.params?.beatId␠===␠"bhainse")␠continue;` | The adoption uses bhainse | KILLED |
| M120 | `src/scenes/director.js:666` | `for␠(const␠packShot␠of␠pack.shots)␠{␠->␠for␠(const␠packShot␠of␠pack.shots)␠{↵␠␠␠␠␠␠␠␠if␠(packShot.layers?.evidence?.params?.beatId␠===␠"bidur-trishuli-bridge")␠continue;` | The adoption uses bidur-trishuli-bridge | KILLED |
| M121 | `src/scenes/director.js:666` | `for␠(const␠packShot␠of␠pack.shots)␠{␠->␠for␠(const␠packShot␠of␠pack.shots)␠{↵␠␠␠␠␠␠␠␠if␠(packShot.layers?.evidence?.params?.beatId␠===␠"devighat-taadi-khola-bridge")␠continue;` | The adoption uses devighat-taadi-khola-bridge | KILLED |
| M122 | `src/scenes/director.js:666` | `for␠(const␠packShot␠of␠pack.shots)␠{␠->␠for␠(const␠packShot␠of␠pack.shots)␠{↵␠␠␠␠␠␠␠␠if␠(packShot.layers?.evidence?.params?.beatId␠===␠"charaudi")␠continue;` | The adoption uses charaudi | KILLED |
| M123 | `src/scenes/director.js:666` | `for␠(const␠packShot␠of␠pack.shots)␠{␠->␠for␠(const␠packShot␠of␠pack.shots)␠{↵␠␠␠␠␠␠␠␠if␠(packShot.layers?.evidence?.params?.beatId␠===␠"final-view")␠continue;` | The adoption uses final-view | KILLED |
| M124 | `src/scenes/director.js:620` | `scene.appliedShotPacks␠&#124;&#124;=␠[]␠->␠void␠0` | The recipe accepts absent version | KILLED |
| M125 | `src/scenes/director.js:620` | `scene.appliedShotPacks␠&#124;&#124;=␠[]␠->␠scene.appliedShotPacks␠=␠[]` | The version 18 marker prevents another pack | KILLED |
| M126 | `src/scenes/director.js:843` | `shot.layers␠&#124;&#124;=␠{}␠->␠void␠0` | The layer patch accepts absent shot layers | KILLED |
| M127 | `src/scenes/director.js:707` | `...deepClone(existingShot.layers␠&#124;&#124;␠{}),␠->␠` | The adoption keeps other authored layers | KILLED |
| M128 | `src/scenes/director.js:851` | `...(scene.releaseLayerIds␠&#124;&#124;␠[]),␠->␠` | The layer list combines scene and pack IDs | KILLED |
| M129 | `src/scenes/director.js:852` | `...(pack.releaseLayerIds␠&#124;&#124;␠[]),␠->␠` | The layer list combines scene and pack IDs | KILLED |
| M130 | `src/scenes/director.js:845` | `shot.layers[layerId]␠=␠normalizeLayerEntry(target)␠->␠if␠(layerId␠!==␠"bhote-koshi-2026")␠shot.layers[layerId]␠=␠normalizeLayerEntry(target)` | The Nepal patch sets target 1 | KILLED |
| M131 | `src/scenes/director.js:845` | `shot.layers[layerId]␠=␠normalizeLayerEntry(target)␠->␠if␠(layerId␠!==␠"bhote-koshi-locator")␠shot.layers[layerId]␠=␠normalizeLayerEntry(target)` | The Nepal locator patch sets Bhote Koshi Upper Valley | KILLED |
| M132 | `src/scenes/director.js:560` | `JSON.stringify(originalProject)␠->␠JSON.stringify({})` | The legacy sequence keeps three shot IDs and cameras | KILLED |
| M133 | `src/scenes/director.js:559` | `STORAGE_CHECKPOINT_KEY␠->␠"wrong"` | The legacy sequence keeps three shot IDs and cameras | KILLED |
| M134 | `src/scenes/director.js:583` | `writeCheckpoint:␠false,␠->␠` | The legacy options disable writeCheckpoint | KILLED |
| M135 | `src/scenes/director.js:584` | `render:␠false,␠->␠` | The legacy options disable render | KILLED |
| M136 | `src/scenes/director.js:585` | `announce:␠false,␠->␠` | The legacy options disable announce | KILLED |
| M137 | `src/scenes/director.js:845` | `normalizeLayerEntry(target)␠->␠target` | The layer patch sets first | KILLED |
| M138 | `src/scenes/director.js:901` | `appendedShots.length␠->␠0` | The notice reports new shots | KILLED |
| M139 | `src/scenes/director.js:832` | `normalizeShot({␠...shot,␠camera:␠patch.camera␠}).camera␠->␠patch.camera` | The camera patch converts text numbers | KILLED |
| M140 | `src/scenes/director.js:849` | `[↵␠␠␠␠␠␠...new␠Set([↵␠␠␠␠␠␠␠␠...(scene.releaseLayerIds␠&#124;&#124;␠[]),↵␠␠␠␠␠␠␠␠...(pack.releaseLayerIds␠&#124;&#124;␠[]),↵␠␠␠␠␠␠]),↵␠␠␠␠]␠->␠[...(scene.releaseLayerIds␠&#124;&#124;␠[]),␠...(pack.releaseLayerIds␠&#124;&#124;␠[])]` | The layer list combines scene and pack IDs | KILLED |
| M141 | `src/scenes/director.js:591` | `this._selectedSceneId␠=␠scene.id;␠->␠void␠0;` | The constructor selects the legacy scene after a custom pack | KILLED |
| M142 | `src/scenes/director.js:890` | `this._selectedSceneId␠=␠scene.id;␠->␠void␠0;` | The pack selection uses the addition | KILLED |
| M143 | `src/scenes/director.js:880` | `id:␠recipe.id,␠->␠id:␠"wrong",` | The first Nepal pack adds its current sequence | KILLED |
| M144 | `src/scenes/director.js:881` | `version:␠targetVersion,␠->␠version:␠0,` | The first Nepal pack adds its current sequence | KILLED |
| M145 | `src/scenes/director.js:847` | `patchedShotCount++;␠->␠void␠0;` | The first Nepal pack adds its current sequence | KILLED |
| M146 | `src/scenes/director.js:881` | `version:␠targetVersion,␠->␠version:␠0,` | the Nepal evidence pack appends once and applies the approved corridor framing | KILLED |
| M147 | `src/scenes/director.js:831` | `patch.camera␠&&␠!expanding␠->␠patch.camera` | installed v12 Nepal pack inserts ten points without replacing renamed cameras | KILLED |
| M148 | `src/scenes/director.js:577` | `canonicalBase[index].id␠=␠scene.shots[index].id␠->␠canonicalBase[index].id␠=␠"wrong"` | a legacy three-shot Nepal browser project bootstraps to the current 25-shot sequence | KILLED |
| M149 | `src/scenes/director.js:762` | `shot.title␠===␠requiredShotTitles[index]␠->␠true` | the Nepal evidence pack refuses a partial inventory without mutating the scene | KILLED |
| M150 | `src/scenes/director.js:881` | `version:␠targetVersion,␠->␠version:␠0,` | the Nepal pack upgrades the upper-valley shots without duplicating evidence beats | KILLED |
| M151 | `src/scenes/director.js:650` | `JSON.stringify(existingPackBeatIds)␠===␠JSON.stringify(beatIds)␠->␠beatIds.length␠!==␠6␠&&␠JSON.stringify(existingPackBeatIds)␠===␠JSON.stringify(beatIds)` | The version 12 pack keeps authored cameras and titles | KILLED |
| M152 | `src/scenes/director.js:650` | `JSON.stringify(existingPackBeatIds)␠===␠JSON.stringify(beatIds)␠->␠beatIds.length␠!==␠16␠&&␠JSON.stringify(existingPackBeatIds)␠===␠JSON.stringify(beatIds)` | The version 17 pack keeps authored cameras and titles | KILLED |

## Source command

```sh
cd /home/ianblenke/docker/gev-work/director-4b && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 python3 -u /home/ianblenke/docker/gev-tools/mut-host.py /home/ianblenke/docker/gev-work/director-4b /home/ianblenke/docker/gev-tools/director-4b/muts.json
```
