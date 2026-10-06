# Director mutation checks

Source commit: `345ce08d8712c6a547e5bba5da2e2d31e40d4c39`.

The helper changes the real source file for each check.
The helper restores that file after the test process.
The scratch JSON file records the exact old text, new text and test pattern.
The table names the source operator and the test that checks it.

| ID | File:line | Operator | Selected test | Result |
| --- | --- | --- | --- | --- |
| `M001` | `src/scenes/director.js:166` | `"this._project.scenes[0]?.id␠&#124;&#124;␠"` → `""` | [director-111] The initial selection | KILLED |
| `M002` | `src/scenes/director.js:262` | `"normalizeProject(parseSceneDocument(raw)"` → `"parseSceneDocument(raw"` | [director-116] The project normalization | KILLED |
| `M003` | `src/scenes/director.js:280` | `"anchorIndex␠<␠0"` → `"false"` | [director-121] The absent migration anchor | KILLED |
| `M004` | `src/scenes/director.js:227` | `"this._destroyPromi"` → `"fal"` | [director-129] The shutdown promise | KILLED |
| `M005` | `src/scenes/director.js:321` | `"new␠Date().toISOString()"` → `"\"2000-01-01T00:00:00.000Z\""` | [director-132] The project timestamp | KILLED |
| `M006` | `src/scenes/director.js:324` | `"parseSceneDocument(payload);\n␠␠␠␠␠␠"` → `""` | [director-133] The invalid project document | KILLED |
| `M007` | `src/scenes/director.js:335` | `"e␠instanceof␠SceneDocumentError"` → `"true"` | [director-134] The storage quota error | KILLED |
| `M008` | `src/scenes/director.js:437` | `"this._project.scenes[0]?.id␠&#124;&#124;␠"` → `""` | [director-136] The scene selector | KILLED |
| `M009` | `src/scenes/director.js:453` | `"scene.shots[0].id"` → `"null"` | [director-137] The shot list selection | KILLED |
| `M010` | `src/scenes/director.js:478` | `"="` → `"!"` | [director-138] The scene and shot lookup | KILLED |
| `M011` | `src/scenes/director.js:488` | `".trim()"` → `""` | [director-139] The scene creation name | KILLED |
| `M012` | `src/scenes/director.js:488` | `"␠+␠1"` → `""` | [director-140] The blank scene name | KILLED |
| `M013` | `src/scenes/director.js:484` | `"!sceneNam"` → `"fals"` | [director-141] The absent scene name | KILLED |
| `M014` | `src/scenes/director.js:505` | `"!"` → `"="` | [director-142] The scene deletion | KILLED |
| `M015` | `src/scenes/director.js:508` | `"!this._project.scenes.length"` → `"false"` | [director-143] The last scene deletion | KILLED |
| `M016` | `src/scenes/director.js:528` | `"(params␠?␠{␠params␠}␠:␠{})"` → `"{}"` | [director-144] The layer state snapshot | KILLED |
| `M017` | `src/scenes/director.js:372` | `"type␠===␠'shot-loaded'"` → `"false"` | [director-145] The shot outcome | KILLED |
| `M018` | `src/scenes/director.js:411` | `".trim()"` → `""` | [director-146] The control actions | KILLED |
| `M019` | `src/scenes/director.js:167` | `"this._project.scenes[0]?.shots[0]?.id␠&#124;&#124;␠null"` → `"\"wrong\""` | [director-112] The empty project selects no scene or shot | KILLED |
| `M020` | `src/scenes/director.js:261` | `"!raw"` → `"false"` | [director-113] The absent project uses default scenes | KILLED |
| `M021` | `src/scenes/director.js:315` | `"this._storageReadError"` → `"false"` | [director-114] The rejected project protects its saved bytes | KILLED |
| `M022` | `src/scenes/director.js:308` | `"error"` → `"null"` | [director-115] The storage access error gives default scenes | KILLED |
| `M023` | `src/scenes/director.js:285` | `"␠+␠1"` → `""` | [director-117] The migration uses the primary anchor | KILLED |
| `M024` | `src/scenes/director.js:275` | `"anchorIndex␠<␠0"` → `"false"` | [director-118] The migration uses the fallback anchor | KILLED |
| `M025` | `src/scenes/director.js:268` | `"installed.has(recipe.id)"` → `"false"` | [director-119] The installation marker prevents a second scene | KILLED |
| `M026` | `src/scenes/director.js:282` | `"id␠===␠recipe.id␠&#124;&#124;␠scene."` → `""` | [director-120] The migration checks the scene id | KILLED |
| `M027` | `src/scenes/director.js:282` | `"␠&#124;&#124;␠scene.title␠===␠recipe.title"` → `""` | [director-120] The migration checks the scene title | KILLED |
| `M028` | `src/scenes/director.js:305` | `"project"` → `"createDefaultProject()"` | [director-122] The migration survives a storage error | KILLED |
| `M029` | `src/scenes/director.js:197` | `"fals"` → `"tru"` | [director-123] The installed pack checks version 17 | KILLED |
| `M030` | `src/scenes/director.js:193` | `"marker.version␠>␠0"` → `"true"` | [director-123] The installed pack checks version 0 | KILLED |
| `M031` | `src/scenes/director.js:193` | `"\n␠␠␠␠␠␠␠␠␠␠marker.version␠<=␠recipe.expansionFromVersion"` → `"␠true"` | [director-123] The installed pack checks version 18 | KILLED |
| `M032` | `src/scenes/director.js:192` | `"recipe?.expansionFromVersion"` → `"true"` | [director-123] The unknown pack does not request an upgrade | KILLED |
| `M033` | `src/scenes/director.js:130` | `"pointerdown',␠'"` → `""` | [director-124] The canvas registers pointerdown | KILLED |
| `M034` | `src/scenes/director.js:130` | `",␠'wheel'"` → `""` | [director-124] The canvas registers wheel | KILLED |
| `M035` | `src/scenes/director.js:124` | `"this._usesAuthoredCamera␠&&␠"` → `""` | [director-124] The camera gesture checks _usesAuthoredCamera | KILLED |
| `M036` | `src/scenes/director.js:124` | `"␠&&␠!this._claimingCamera"` → `""` | [director-124] The camera gesture checks _claimingCamera | KILLED |
| `M037` | `src/scenes/director.js:120` | `"event?.type␠===␠'pointerdown'"` → `"true"` | [director-125] The active pointer action keeps camera ownership | KILLED |
| `M038` | `src/scenes/director.js:121` | `"his._interactions?.getState().activ"` → `"ru"` | [director-125] The inactive pointer action yields camera ownership | KILLED |
| `M039` | `src/scenes/director.js:208` | `"user',␠'"` → `""` | [director-126] The user request disables a scene layer | KILLED |
| `M040` | `src/scenes/director.js:208` | `"voice',␠'"` → `""` | [director-126] The voice request disables a scene layer | KILLED |
| `M041` | `src/scenes/director.js:208` | `",␠'tool'"` → `""` | [director-126] The tool request disables a scene layer | KILLED |
| `M042` | `src/scenes/director.js:207` | `"change.enabled␠!==␠"` → `""` | [director-127] The visibility request checks its enabled | KILLED |
| `M043` | `src/scenes/director.js:208` | `"!['user',␠'voice',␠'tool'].includes(change.origin)"` → `"false"` | [director-127] The visibility request checks its origin | KILLED |
| `M044` | `src/scenes/director.js:212` | `"!scene?.releaseLayerIds?.includes(change.layerId)"` → `"false"` | [director-127] The visibility request checks its layer | KILLED |
| `M045` | `src/scenes/director.js:221` | `"release"` → `"()␠=>␠{}"` | [director-128] The work set removes success results | KILLED |
| `M046` | `src/scenes/director.js:221` | `"release"` → `"()␠=>␠{}"` | [director-128] The work set removes error results | KILLED |
| `M047` | `src/scenes/director.js:247` | `"this._clock.destroy()"` → `"void␠this._clock"` | [director-130] The shutdown disposes each resource | KILLED |
| `M048` | `src/scenes/director.js:246` | `"this._pendingWork␠&#124;&#124;␠"` → `""` | [director-131] The shutdown waits for unsettled work | KILLED |
| `M049` | `src/scenes/director.js:344` | `"Scene␠not␠saved␠—␠browser␠storage␠unavailable"` → `"wrong"` | [director-135] The toast uses its default text | KILLED |
| `M050` | `src/scenes/director.js:354` | `"remove"` → `"add"` | [director-135] The toast removes its visible class after the deadline | KILLED |
| `M051` | `src/scenes/director.js:358` | `"/*␠toast␠is␠best-effort␠*/"` → `"throw␠Error('toast');"` | [director-135] The toast tolerates a document error | KILLED |
| `M052` | `src/scenes/director.js:435` | `"!this._project.scenes.some((scene)␠=>␠scene.id␠===␠this._selectedSceneId)"` → `"true"` | [director-136] The selector keeps a valid scene | KILLED |
| `M053` | `src/scenes/director.js:437` | `"null"` → `"\"wrong\""` | [director-136] The selector uses null for an empty project | KILLED |
| `M054` | `src/scenes/director.js:451` | `"!scene.shots.some((shot)␠=>␠shot.id␠===␠this._selectedShotId)"` → `"true"` | [director-137] The shot list keeps a valid selection | KILLED |
| `M055` | `src/scenes/director.js:450` | `"scene?.shots.length"` → `"true"` | [director-137] The shot list accepts an absent scene | KILLED |
| `M056` | `src/scenes/director.js:501` | `"␠␠␠␠if␠(!scene)␠return;\n"` → `""` | [director-142] The absent scene selection leaves the project unchanged | KILLED |
| `M057` | `src/scenes/director.js:401` | `"this._getSelectedScene()?.shots[0]?.id␠&#124;&#124;␠"` → `""` | [director-146] The scene control selects its first shot | KILLED |
| `M058` | `src/scenes/director.js:395` | `"this._running"` → `"false"` | [director-146] The controls give the project state | KILLED |
| `M059` | `src/scenes/director.js:417` | `"this.captureShot()"` → `"undefined"` | [director-146] The controls call capture | KILLED |
| `M060` | `src/scenes/director.js:110` | `"destroyed␠&&␠!this._"` → `""` | [director-147] The action checks _destroyed | KILLED |
| `M061` | `src/scenes/director.js:110` | `"_running␠&&␠!this."` → `""` | [director-147] The action checks _running | KILLED |
| `M062` | `src/scenes/director.js:110` | `"␠&&␠!this.viewer.trackedEntity"` → `""` | [director-147] The action checks trackedEntity | KILLED |
| `M063` | `src/scenes/director.js:110` | `"!this._destroyed␠&&␠!this._running␠&&␠!this.viewer.trackedEntity"` → `"false"` | [director-147] The action checks available | KILLED |
| `M064` | `src/scenes/director.js:115` | `"this._setCameraView(pose)"` → `"false"` | [director-148] The camera callback gives the authored pose | KILLED |
| `M065` | `src/scenes/director.js:155` | `"this._setProgress(progress)"` → `"{}"` | [director-148] The clock callbacks give state shot time and progress | KILLED |
| `M066` | `src/scenes/director.js:176` | `"0"` → `"1"` | [director-149] The initial snapshot gives the panel state | KILLED |
| `M067` | `src/scenes/director.js:133` | `"pointerdown',␠'"` → `""` | [director-130] The shutdown removes pointerdown | KILLED |
| `M068` | `src/scenes/director.js:133` | `",␠'wheel'"` → `""` | [director-130] The shutdown removes wheel | KILLED |
| `M069` | `src/scenes/director.js:246` | `"␠&#124;&#124;␠[]"` → `""` | [director-131] The shutdown accepts an absent work set | KILLED |
| `M070` | `src/scenes/director.js:189` | `"␠&#124;&#124;␠[]"` → `""` | [director-123] The constructor accepts absent pack markers | KILLED |
| `M071` | `src/scenes/director.js:450` | `"?.shots.length"` → `""` | [director-137] The empty shot list leaves its selection | KILLED |
| `M072` | `src/scenes/director.js:401` | `"null"` → `"\"wrong\""` | [director-146] The scene control selects an empty scene | KILLED |
| `M073` | `src/scenes/director.js:415` | `"this._createScene(name)"` → `"undefined"` | [director-146] The controls call create | KILLED |
| `M074` | `src/scenes/director.js:416` | `"this._deleteSelectedScene()"` → `"undefined"` | [director-146] The controls call deleteScene | KILLED |
| `M075` | `src/scenes/director.js:418` | `"this.updateSelectedShot()"` → `"undefined"` | [director-146] The controls call update | KILLED |
| `M076` | `src/scenes/director.js:419` | `"this.startScene(id)"` → `"undefined"` | [director-146] The controls call start | KILLED |
| `M077` | `src/scenes/director.js:420` | `"this.stopScene(reason)"` → `"undefined"` | [director-146] The controls call stop | KILLED |
| `M078` | `src/scenes/director.js:421` | `"this.runNextScene()"` → `"undefined"` | [director-146] The controls call next | KILLED |
| `M079` | `src/scenes/director.js:422` | `"this.exportProject()"` → `"undefined"` | [director-146] The controls call export | KILLED |
| `M080` | `src/scenes/director.js:423` | `"this.importProjectFile(file)"` → `"undefined"` | [director-146] The controls call import | KILLED |
| `M081` | `src/scenes/director.js:425` | `"this.downloadLastRunMetadata()"` → `"undefined"` | [director-146] The controls call download | KILLED |
| `M082` | `src/scenes/director.js:426` | `"this.loadShot(sceneId,␠shotId)"` → `"undefined"` | [director-146] The controls call load | KILLED |
| `M083` | `src/scenes/director.js:427` | `"this.deleteShot(sceneId,␠shotId)"` → `"undefined"` | [director-146] The controls call deleteShot | KILLED |
| `M084` | `src/scenes/director.js:424` | `"this._sharing.preview(file)"` → `"undefined"` | [director-146] The controls call reviewImport | KILLED |
| `M085` | `src/scenes/director.js:275` | `"anchorIndex␠<␠0␠&&␠"` → `""` | [director-118] The primary anchor takes precedence over the fallback | KILLED |
| `M086` | `src/scenes/director.js:275` | `"␠&&␠recipe.installAlongsideFallbackSceneId"` → `""` | [director-121] The absent fallback avoids extra field access | KILLED |
| `M087` | `src/scenes/director.js:267` | `"typeof␠recipe.installAlongsideSceneId␠!==␠'string'"` → `"false"` | [director-121] The recipe check rejects a nontext anchor | KILLED |
| `M088` | `src/scenes/director.js:411` | `"␠&#124;&#124;␠shot.title"` → `""` | [director-146] The blank shot title keeps its saved title | KILLED |
| `M089` | `src/scenes/director.js:524` | `""` → `".filter(item=>item.id␠!==␠'one')"` | [director-144] The layer snapshot includes one | KILLED |
| `M090` | `src/scenes/director.js:524` | `""` → `".filter(item=>item.id␠!==␠'two')"` | [director-144] The layer snapshot includes two | KILLED |
| `M091` | `src/scenes/director.js:528` | `"(params␠?␠{␠params␠}␠:␠{})"` → `"{␠params␠}"` | [director-144] The layer snapshot excludes absent parameters | KILLED |
| `M092` | `src/scenes/director.js:513` | `"null"` → `"\"wrong\""` | [director-142] The scene deletion accepts an empty shot list | KILLED |
| `M093` | `src/scenes/director.js:512` | `"null"` → `"\"wrong\""` | [director-143] The last scene deletion uses an empty recipe list | KILLED |
| `M094` | `src/scenes/director.js:153` | `"this._running"` → `"false"` | [director-148] The clock callbacks give state shot time and progress | KILLED |
| `M095` | `src/scenes/director.js:154` | `"this._sceneTimingForShot(scene,␠shot)"` → `"null"` | [director-148] The clock callbacks give state shot time and progress | KILLED |
| `M096` | `src/scenes/director.js:86` | `"fals"` → `"tru"` | [director-148] The clock callbacks give state shot time and progress | KILLED |
| `M097` | `src/scenes/director.js:376` | `"scene.id"` → `"\"wrong\""` | [director-145] The shot outcome | KILLED |
| `M098` | `src/scenes/director.js:377` | `"scene.title"` → `"\"wrong\""` | [director-145] The shot outcome | KILLED |
| `M099` | `src/scenes/director.js:378` | `""` → `":␠scene.shots[0]"` | [director-145] The shot outcome | KILLED |
| `M100` | `src/scenes/director.js:371` | `"scene.shots.indexOf(shot)"` → `"0"` | [director-145] The shot outcome | KILLED |
| `M101` | `src/scenes/director.js:175` | `"Ready"` → `"wrong"` | [director-149] The initial snapshot gives the panel state | KILLED |
| `M102` | `src/scenes/director.js:177` | `""` → `"wrong"` | [director-149] The initial snapshot gives the panel state | KILLED |
| `M103` | `src/scenes/director.js:178` | `"fals"` → `"tru"` | [director-149] The initial snapshot gives the panel state | KILLED |
| `M104` | `src/scenes/director.js:179` | `"fals"` → `"tru"` | [director-149] The initial snapshot gives the panel state | KILLED |
| `M105` | `src/scenes/director.js:184` | `"!!this._lastRunJson"` → `"false"` | [director-149] The initial snapshot gives the panel state | KILLED |
| `M106` | `src/scenes/director.js:285` | `"project.scenes.splice(anchorIndex␠+␠1,␠0,␠recipeToScene(recipe))"` → `"void␠project.scenes"` | an older default project gains the complete selectable Nepal scene once | KILLED |
| `M107` | `src/scenes/director.js:268` | `"installed.has(recipe.id)"` → `"false"` | a previously installed Nepal scene stays deleted when its marker remains | KILLED |
| `M108` | `src/scenes/director.js:275` | `"anchorIndex␠<␠0␠&&␠recipe.installAlongsideFallbackSceneId"` → `"false"` | an existing public default project gains Nepal without replacing authored shots | KILLED |
| `M109` | `src/scenes/director.js:324` | `"parseSceneDocument(payload);\n␠␠␠␠␠␠"` → `""` | invalid authored edits cannot persist an unreadable project over a good save | KILLED |
| `M110` | `src/scenes/director.js:129` | `"?"` → `""` | [director-124] The constructor accepts a viewer without a scene | KILLED |
| `M111` | `src/scenes/director.js:120` | `"?"` → `""` | [director-124] The camera gesture accepts an absent event | KILLED |
| `M112` | `src/scenes/director.js:121` | `"?"` → `""` | [director-125] The pointer press accepts an absent interaction owner | KILLED |
| `M113` | `src/scenes/director.js:230` | `"?."` → `""` | [director-130] The shutdown accepts absent optional owners | KILLED |
| `M114` | `src/scenes/director.js:368` | `"?"` → `""` | [director-145] The outcome accepts an absent state owner | KILLED |
| `M115` | `src/scenes/director.js:128` | `"?."` → `""` | [director-124] The constructor accepts an absent camera subscription | KILLED |
| `M116` | `src/scenes/director.js:188` | `""` → `".filter(scene=>scene.id!==\"second\")"` | [director-123] The constructor checks each scene and pack marker | KILLED |
| `M117` | `src/scenes/director.js:189` | `""` → `".filter(marker=>marker.id!==\"bhote-koshi-nepal-evidence-pack\")"` | [director-123] The constructor checks each scene and pack marker | KILLED |
| `M118` | `src/scenes/director.js:413` | `"this._shotOutcome('shot-renamed',␠scene,␠shot)"` → `"void␠shot"` | [director-146] The controls publish selection and name changes | KILLED |
| `M119` | `src/scenes/director.js:218` | `"this._pendingWork␠&#124;&#124;=␠new␠Set()"` → `"void␠this._pendingWork"` | [director-128] The work set removes success results | KILLED |
| `M120` | `src/scenes/director.js:263` | `"␠&#124;&#124;␠[]"` → `""` | The normalized installation list resists a custom storage object | Equivalent |
| `M121` | `src/scenes/director.js:173` | `"this._storageReadError"` → `"false"` | [director-149] The initial snapshot gives the storage error | KILLED |
| `M122` | `src/scenes/director.js:166` | `"␠&#124;&#124;␠null"` → `""` | [director-112] The empty project selects no scene or shot | KILLED |
| `M123` | `src/scenes/director.js:168` | `"␠&#124;&#124;␠null"` → `""` | [director-112] The empty project selects no scene or shot | KILLED |
| `M124` | `src/scenes/director.js:466` | `"␠&#124;&#124;␠null"` → `""` | [director-138] The scene and shot lookup | KILLED |
| `M125` | `src/scenes/director.js:488` | `"sceneName.trim()␠&#124;&#124;␠"` → `""` | [director-139] The scene creation name | KILLED |
| `M126` | `src/scenes/director.js:488` | `"␠&#124;&#124;␠\u0060Scene␠${this._project.scenes.length␠+␠1}\u0060"` → `""` | [director-140] The blank scene name | KILLED |
| `M127` | `src/scenes/director.js:411` | `"title.trim()␠&#124;&#124;␠"` → `""` | [director-146] The control actions | KILLED |
| `M128` | `src/scenes/director.js:265` | `""` → `".filter(recipe=>recipe.id!==\"bhote-koshi-nepal-scene\")"` | [director-121] The project checks recipe bhote-koshi-nepal-scene | KILLED |
| `M129` | `src/scenes/director.js:265` | `""` → `".filter(recipe=>recipe.id!==\"flights-radar\")"` | [director-121] The project checks recipe flights-radar | KILLED |
| `M130` | `src/scenes/director.js:265` | `""` → `".filter(recipe=>recipe.id!==\"orbital-watch\")"` | [director-121] The project checks recipe orbital-watch | KILLED |
| `M131` | `src/scenes/director.js:265` | `""` → `".filter(recipe=>recipe.id!==\"thermal-threats\")"` | [director-121] The project checks recipe thermal-threats | KILLED |
| `M132` | `src/scenes/director.js:265` | `""` → `".filter(recipe=>recipe.id!==\"city-overload\")"` | [director-121] The project checks recipe city-overload | KILLED |
| `M133` | `src/scenes/director.js:265` | `""` → `".filter(recipe=>recipe.id!==\"omniscience-pullback\")"` | [director-121] The project checks recipe omniscience-pullback | KILLED |
| `M134` | `src/scenes/director.js:189` | `""` → `".slice(1)"` | [director-123] The constructor reads an unknown pack marker | KILLED |
| `M135` | `src/scenes/director.js:188` | `""` → `".filter(scene=>scene.id!==\"first\")"` | [director-123] The constructor reads an empty scene marker list | KILLED |
| `M136` | `src/scenes/director.js:230` | `"this._visibilityUnsubscribe?.()"` → `"void␠0"` | [director-130] The shutdown disposes each resource | KILLED |
| `M137` | `src/scenes/director.js:231` | `"this._cameraHandoffUnsubscribe?.()"` → `"void␠0"` | [director-130] The shutdown disposes each resource | KILLED |
| `M138` | `src/scenes/director.js:232` | `"this._removeCameraInput?.()"` → `"void␠0"` | [director-130] The shutdown disposes each resource | KILLED |
| `M139` | `src/scenes/director.js:233` | `"this._cameraMotion?.destroy()"` → `"void␠0"` | [director-130] The shutdown disposes each resource | KILLED |
| `M140` | `src/scenes/director.js:234` | `"this._sharing?.destroy()"` → `"void␠0"` | [director-130] The shutdown disposes each resource | KILLED |
| `M141` | `src/scenes/director.js:235` | `"this._bundleAssets?.clear()"` → `"void␠0"` | [director-130] The shutdown disposes each resource | KILLED |
| `M142` | `src/scenes/director.js:236` | `"this._interactions?.destroy()"` → `"void␠0"` | [director-130] The shutdown disposes each resource | KILLED |
| `M143` | `src/scenes/director.js:237` | `"this._dataPacks?.destroy()"` → `"void␠0"` | [director-130] The shutdown disposes each resource | KILLED |
| `M144` | `src/scenes/director.js:238` | `"this._controls?.destroy()"` → `"void␠0"` | [director-130] The shutdown disposes each resource | KILLED |
| `M145` | `src/scenes/director.js:239` | `"this._state.destroy()"` → `"void␠0"` | [director-130] The shutdown disposes each resource | KILLED |
| `M146` | `src/scenes/director.js:247` | `"\n␠␠␠␠␠␠this._cancelActiveSceneTravel();"` → `""` | [director-130] The shutdown disposes each resource | KILLED |
| `M147` | `src/scenes/director.js:228` | `"\n␠␠␠␠this._sceneSeekGeneration++;"` → `""` | [director-130] The shutdown disposes each resource | KILLED |
| `M148` | `src/scenes/director.js:243` | `"_loadGeneration++;\n␠␠␠␠␠␠this."` → `""` | [director-130] The shutdown disposes each resource | KILLED |
| `M149` | `src/scenes/director.js:242` | `"Abort?.abort();\n␠␠␠␠␠␠this._load"` → `""` | [director-130] The shutdown disposes each resource | KILLED |
| `M150` | `src/scenes/director.js:244` | `"this.viewer.camera.cancelFlight();\n␠␠␠␠␠␠"` → `""` | [director-130] The shutdown disposes each resource | KILLED |
| `M151` | `src/scenes/director.js:241` | `"stopScene('Stopped');\n␠␠␠␠␠␠this."` → `""` | [director-130] The shutdown disposes each resource | KILLED |
| `M152` | `src/scenes/director.js:527` | `"!"` → `""` | [director-144] The layer state snapshot | KILLED |
| `M153` | `src/scenes/director.js:335` | `"e␠instanceof␠SceneDocumentError"` → `"false"` | [director-133] The invalid project document | KILLED |
| `M154` | `src/scenes/director.js:466` | `"␠&#124;&#124;␠null"` → `""` | [director-138] The absent scene lookup returns null | KILLED |
| `M155` | `src/scenes/director.js:168` | `"this._project.scenes[0]?.shots[0]?.id␠&#124;&#124;␠"` → `""` | [director-111] The initial selection | KILLED |
| `M156` | `src/scenes/director.js:103` | `"this._bundleAssets.source"` → `"dataPacks.sources[BUNDLE_SOURCE]"` | [director-150] The constructor gives its byte store to the bundle source | KILLED |
| `M157` | `src/scenes/director.js:102` | `"dataPacks.sources"` → `"{}"` | [director-150] The constructor gives its byte store to the bundle source | KILLED |
| `M158` | `src/scenes/director.js:315` | `"this._storageReadError"` → `"false"` | [director-114] The invalid document text protects saved bytes | KILLED |
| `M159` | `src/scenes/director.js:184` | `"hasRun:␠!!this._lastRunJson,\n␠␠␠␠"` → `""` | [director-149] The initial snapshot gives the panel state | KILLED |
| `M160` | `src/scenes/director.js:183` | `"this._presentation"` → `"{}"` | [director-149] The initial snapshot gives the panel state | KILLED |
| `M161` | `src/scenes/director.js:492` | `"scene.id"` → `"\"scene-1\""` | [director-139] The scene creation name | KILLED |

## Source limit

The list fallback at line 263 gives the same result without its empty array operand.
The project normalizer sets an own list array at `src/scenes/project.js:394`.
The document parser rejects nontext values at `src/director/document.js:166`.
The proxy probe records zero property accesses before that rejection.
The source limit probe passes with and without this operand.

## Commands

```sh
cd /home/ianblenke/docker/gev-work/director-4a && NODE_OPTIONS=--test-isolation=none python3 -u /home/ianblenke/docker/gev-tools/mut-host.py /home/ianblenke/docker/gev-work/director-4a /home/ianblenke/docker/gev-tools/director-4a/muts.json
cd /home/ianblenke/docker/gev-work/director-4a && NODE_OPTIONS=--test-isolation=none python3 -u /home/ianblenke/docker/gev-tools/mut-host.py /home/ianblenke/docker/gev-work/director-4a /home/ianblenke/docker/gev-tools/director-4a/muts.json M001 M007 M019 M030 M031 M033 M034 M048 M057 M059 M060 M061 M062 M063 M064 M065 M066 M067 M068 M069 M070 M071 M072 M073 M074 M075 M076 M077 M078 M079 M080 M081 M082 M083 M084 M085 M086 M087 M088 M089 M090 M091 M092 M093 M094 M095 M096 M097 M098 M099 M100 M101 M102 M103 M104 M105 M106 M107 M108 M109 M110 M111 M112 M113 M114 M115 M116 M117 M118 M119 M120
cd /home/ianblenke/docker/gev-work/director-4a && NODE_OPTIONS=--test-isolation=none python3 -u /home/ianblenke/docker/gev-tools/mut-host.py /home/ianblenke/docker/gev-work/director-4a /home/ianblenke/docker/gev-tools/director-4a/muts.json M005 M048 M065 M069 M092 M094 M095 M096 M100 M121 M122 M123 M124 M125 M126 M127 M128 M129 M130 M131 M132 M133 M134 M135 M136 M137 M138 M139 M140 M141 M142 M143 M144 M145 M146 M147 M148 M149 M150 M151 M152 M153
cd /home/ianblenke/docker/gev-work/director-4a && NODE_OPTIONS=--test-isolation=none python3 -u /home/ianblenke/docker/gev-tools/mut-host.py /home/ianblenke/docker/gev-work/director-4a /home/ianblenke/docker/gev-tools/director-4a/muts.json M154 M155
cd /home/ianblenke/docker/gev-work/director-4a && NODE_OPTIONS=--test-isolation=none python3 -u /home/ianblenke/docker/gev-tools/mut-host.py /home/ianblenke/docker/gev-work/director-4a /home/ianblenke/docker/gev-tools/director-4a/muts.json M005 M006 M007 M153 M156 M157 M158 M159 M160
cd /home/ianblenke/docker/gev-work/director-4a && NODE_OPTIONS=--test-isolation=none python3 -u /home/ianblenke/docker/gev-tools/mut-host.py /home/ianblenke/docker/gev-work/director-4a /home/ianblenke/docker/gev-tools/director-4a/muts.json M093 M161
```
