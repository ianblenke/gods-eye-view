# Director shot mutations

Source commit: `dd4efcaccbac09ab63ec29192825a23b6368be91`.

The helper changes the real source file and restores it after each test process.
The scratch JSON file records exact source text and test patterns.
The table records each selected test and result.

| ID | File:line | Operator | Selected test | Result |
| --- | --- | --- | --- | --- |
| `M001` | `src/scenes/director.js:919` | `"if␠(!scene)␠return;"` → `"if␠(false)␠return;"` | [director-187] The capture rejects an absent scene | KILLED |
| `M002` | `src/scenes/director.js:922` | `"if␠(!camera)"` → `"if␠(false)"` | [director-187] The capture rejects an absent camera | KILLED |
| `M003` | `src/scenes/director.js:940` | `"scene.shots.push(shot);"` → `"scene.shots.length;"` | [director-186] The capture records live fields and selects the new shot | KILLED |
| `M004` | `src/scenes/director.js:933` | `"camera,"` → `"camera:␠{},"` | [director-186] The capture records live fields and selects the new shot | KILLED |
| `M005` | `src/scenes/director.js:934` | `"this.styleManager.getVisualState()"` → `"{}"` | [director-186] The capture records live fields and selects the new shot | KILLED |
| `M006` | `src/scenes/director.js:935` | `"this._captureLayerStates()"` → `"{}"` | [director-186] The capture records live fields and selects the new shot | KILLED |
| `M007` | `src/scenes/director.js:930` | `"&#96;Shot␠${scene.shots.length␠+␠1}&#96;"` → `"'Wrong'"` | [director-186] The capture records live fields and selects the new shot | KILLED |
| `M008` | `src/scenes/director.js:942` | `"this._saveProject();"` → `"void␠0;"` | [director-186] The capture records live fields and selects the new shot | KILLED |
| `M009` | `src/scenes/director.js:953` | `"if␠(!scene)␠return;"` → `"if␠(false)␠return;"` | [director-189] The update rejects an absent scene | KILLED |
| `M010` | `src/scenes/director.js:956` | `"if␠(!shot)"` → `"if␠(false)"` | [director-189] The update rejects an absent shot | KILLED |
| `M011` | `src/scenes/director.js:962` | `"if␠(!camera)␠return;"` → `"if␠(false)␠return;"` | [director-189] The update rejects an absent camera | KILLED |
| `M012` | `src/scenes/director.js:964` | `"shot.move"` → `"false"` | [director-188] The update uses a move camera | KILLED |
| `M013` | `src/scenes/director.js:966` | `":␠camera"` → `":␠{␠...camera,␠altitudeReference:␠'ellipsoid'␠}"` | [director-188] The update uses a static camera | KILLED |
| `M014` | `src/scenes/director.js:967` | `"this.styleManager.getVisualState()"` → `"{}"` | [director-188] The update uses a static camera | KILLED |
| `M015` | `src/scenes/director.js:968` | `"this._captureLayerStates()"` → `"{}"` | [director-188] The update uses a static camera | KILLED |
| `M016` | `src/scenes/director.js:970` | `"this._saveProject();"` → `"void␠0;"` | [director-188] The update uses a static camera | KILLED |
| `M017` | `src/scenes/director.js:982` | `"!scene␠&#124;&#124;␠"` → `""` | [director-190] The deleteShot checks only an absent scene | KILLED |
| `M018` | `src/scenes/director.js:982` | `"␠&#124;&#124;␠!shot"` → `""` | [director-190] The deleteShot checks only an absent shot | KILLED |
| `M019` | `src/scenes/director.js:985` | `"item.id␠!==␠shot.id"` → `"true"` | [director-190] The deletion handles the first | KILLED |
| `M020` | `src/scenes/director.js:986` | `"scene.shots[0]?.id␠&#124;&#124;␠null"` → `"null"` | [director-190] The deletion handles the first | KILLED |
| `M021` | `src/scenes/director.js:986` | `"␠&#124;&#124;␠null"` → `""` | [director-190] The deletion handles the last | KILLED |
| `M022` | `src/scenes/director.js:1009` | `"if␠(this._destroyed)"` → `"if␠(false)"` | [director-191] The load rejects destroyed | KILLED |
| `M023` | `src/scenes/director.js:1047` | `"if␠(this._running)"` → `"if␠(false)"` | [director-191] The load rejects running | KILLED |
| `M024` | `src/scenes/director.js:1049` | `"!scene␠&#124;&#124;␠"` → `""` | [director-191] The loadShot checks only an absent scene | KILLED |
| `M025` | `src/scenes/director.js:1049` | `"␠&#124;&#124;␠!shot"` → `""` | [director-191] The loadShot checks only an absent shot | KILLED |
| `M026` | `src/scenes/director.js:1050` | `"shot.move"` → `"false"` | [director-193] The default flight uses the move duration | KILLED |
| `M027` | `src/scenes/director.js:1050` | `":␠2.2"` → `":␠8"` | [director-193] The default flight uses the static duration | KILLED |
| `M028` | `src/scenes/director.js:1055` | `"!this._claimCameraOwnership()"` → `"false"` | [director-192] The camera refusal stops the load before visual state | KILLED |
| `M029` | `src/scenes/director.js:1057` | `"if␠(fromCamera)"` → `"if␠(false)"` | [director-198] The flight starts before travel publication and layer settlement | KILLED |
| `M030` | `src/scenes/director.js:1070` | `"this._loadToken(++this._loadGeneration,␠controller.signal)"` → `"this._loadToken(this._loadGeneration,␠controller.signal)"` | [director-196] The newer load cancels an older visual wait | KILLED |
| `M031` | `src/scenes/director.js:1067` | `"this._loadAbort?.abort();"` → `"void␠0;"` | [director-196] The newer load cancels an older visual wait | KILLED |
| `M032` | `src/scenes/director.js:1092` | `"if␠(token.cancelled)␠return;"` → `"if␠(false)␠return;"` | [director-196] The newer load cancels an older visual wait | KILLED |
| `M033` | `src/scenes/director.js:1106` | `"if␠(token.cancelled)␠return;"` → `"if␠(false)␠return;"` | [director-227] The load cancellation stops after layers | KILLED |
| `M034` | `src/scenes/director.js:1117` | `"if␠(token.cancelled)␠return;"` → `"if␠(false)␠return;"` | [director-196] The load cancellation stops after packs | KILLED |
| `M035` | `src/scenes/director.js:1162` | `"if␠(token.cancelled)␠return;"` → `"if␠(false)␠return;"` | [director-227] The load cancellation stops after flight | KILLED |
| `M036` | `src/scenes/director.js:1164` | `"if␠(token.cancelled)␠return;"` → `"if␠(false)␠return;"` | [director-196] The load cancellation stops after settle | KILLED |
| `M037` | `src/scenes/director.js:1074` | `"previousScene␠&&␠"` → `""` | [director-193] The default flight uses the static duration | KILLED |
| `M038` | `src/scenes/director.js:1074` | `"previousScene.id␠!==␠scene.id"` → `"false"` | [director-194] The other scene stops before target visual state | KILLED |
| `M039` | `src/scenes/director.js:1076` | `"!released␠&#124;&#124;␠"` → `""` | [director-195] The scene departure handles refusal | KILLED |
| `M040` | `src/scenes/director.js:1076` | `"␠&#124;&#124;␠token.cancelled"` → `""` | [director-195] The scene departure handles cancellation | KILLED |
| `M041` | `src/scenes/director.js:1094` | `"sceneSeek␠&&␠"` → `""` | null seek guard gives the same public result | SURVIVED; equivalent |
| `M042` | `src/scenes/director.js:1094` | `"typeof␠sceneSeek␠===␠'object'"` → `"true"` | [director-193] The scene seek option handles number | KILLED |
| `M043` | `src/scenes/director.js:1097` | `"playMedia␠&&␠"` → `""` | [director-200] The load media option handles false | KILLED |
| `M044` | `src/scenes/director.js:1097` | `"␠&&␠!seekState"` → `""` | [director-200] The scene seek does not grant media ownership | KILLED |
| `M045` | `src/scenes/director.js:1111` | `"if␠(layerResult.refused.length)"` → `"if␠(false)"` | [director-197] The load reports layers refusal | KILLED |
| `M046` | `src/scenes/director.js:1115` | `"!(await␠this._applyDataPacks(scene,␠shot,␠token))"` → `"false"` | [director-197] The load reports packs refusal | KILLED |
| `M047` | `src/scenes/director.js:1120` | `"seekState.camera␠&#124;&#124;␠"` → `""` | [director-225] The loaded seek uses its own camera | KILLED |
| `M048` | `src/scenes/director.js:1120` | `"seekState.camera␠&#124;&#124;␠resolveCameraPose(scene,␠shot.camera)"` → `"seekState.camera"` | [director-225] The loaded seek resolves an absent camera | KILLED |
| `M049` | `src/scenes/director.js:1144` | `"flyDuration,"` → `"0,"` | [director-198] The load completes flight before the hold phase | KILLED |
| `M050` | `src/scenes/director.js:1153` | `"this._publishShotTravel(scene,␠shot,␠cameraTravel);"` → `"void␠0;"` | [director-198] The flight starts before travel publication and layer settlement | KILLED |
| `M051` | `src/scenes/director.js:1156` | `"this._cancelActiveSceneTravel();"` → `"void␠0;"` | [director-199] The flight error handles a live token | KILLED |
| `M052` | `src/scenes/director.js:1157` | `"if␠(!token.cancelled)"` → `"if␠(false)"` | [director-199] The flight error handles a live token | KILLED |
| `M053` | `src/scenes/director.js:1157` | `"if␠(!token.cancelled)"` → `"if␠(true)"` | [director-199] The flight error handles a stale token | KILLED |
| `M054` | `src/scenes/director.js:1163` | `"this._settleShotLayerStates(scene,␠shot,␠token,␠cameraTravel);"` → `"void␠0;"` | [director-198] The flight starts before travel publication and layer settlement | KILLED |
| `M055` | `src/scenes/director.js:1180` | `"this._shotOutcome('shot-loaded',␠scene,␠shot);"` → `"void␠0;"` | [director-198] The load completes flight before the hold phase | KILLED |
| `M056` | `src/scenes/director.js:1021` | `"ownsLoad␠&&"` → `"true␠&&"` | [director-226] The failure media cleanup checks unowned | KILLED |
| `M057` | `src/scenes/director.js:1022` | `"!result?.started"` → `"true"` | [director-226] The failure media cleanup checks success | KILLED |
| `M058` | `src/scenes/director.js:1023` | `"generation␠===␠this._loadGeneration"` → `"true"` | [director-226] The failure media cleanup checks stale | KILLED |
| `M059` | `src/scenes/director.js:1029` | `"ownsLoad␠&&␠"` → `""` | [director-226] The error media cleanup checks unowned | KILLED |
| `M060` | `src/scenes/director.js:1029` | `"generation␠===␠this._loadGeneration"` → `"true"` | [director-226] The error media cleanup checks stale | KILLED |
| `M061` | `src/scenes/director.js:1197` | `"module.setSceneMediaPlayback();"` → `"if␠(module.id␠!==␠'one')␠module.setSceneMediaPlayback();"` | [director-201] The old media owner stops module one | KILLED |
| `M062` | `src/scenes/director.js:1201` | `"Object.entries(shot.layers␠&#124;&#124;␠{})"` → `"Object.entries(shot.layers␠&#124;&#124;␠{}).filter(([id])␠=>␠id␠!==␠'one')"` | [director-200] The media owner reaches layer one | KILLED |
| `M063` | `src/scenes/director.js:1197` | `"module.setSceneMediaPlayback();"` → `"if␠(module.id␠!==␠'two')␠module.setSceneMediaPlayback();"` | [director-201] The old media owner stops module two | KILLED |
| `M064` | `src/scenes/director.js:1201` | `"Object.entries(shot.layers␠&#124;&#124;␠{})"` → `"Object.entries(shot.layers␠&#124;&#124;␠{}).filter(([id])␠=>␠id␠!==␠'two')"` | [director-200] The media owner reaches layer two | KILLED |
| `M065` | `src/scenes/director.js:1199` | `"!scene␠&#124;&#124;␠"` → `""` | [director-201] The media guard checks scene | KILLED |
| `M066` | `src/scenes/director.js:1199` | `"!shot␠&#124;&#124;␠"` → `""` | [director-201] The media guard checks shot | KILLED |
| `M067` | `src/scenes/director.js:1199` | `"!token␠&#124;&#124;␠"` → `""` | [director-201] The media guard checks token | KILLED |
| `M068` | `src/scenes/director.js:1199` | `"token.cancelled␠&#124;&#124;␠"` → `""` | [director-201] The media guard checks cancelled | KILLED |
| `M069` | `src/scenes/director.js:1199` | `"␠&#124;&#124;␠token.signal?.aborted"` → `""` | [director-201] The media guard checks aborted | KILLED |
| `M070` | `src/scenes/director.js:1204` | `"!state?.enabled␠&#124;&#124;"` → `""` | [director-200] The media method skips disabled | KILLED |
| `M071` | `src/scenes/director.js:1205` | `"typeof␠module?.setSceneMediaPlayback␠!==␠'function'"` → `"false"` | [director-200] The media method skips a value that is not a function | KILLED |
| `M072` | `src/scenes/director.js:1201` | `"shot.layers␠&#124;&#124;␠{}"` → `"shot.layers"` | [director-200] The media method skips absent layers | KILLED |
| `M073` | `src/scenes/director.js:1251` | `"Object.entries(states)"` → `"Object.entries(states).filter(([id])␠=>␠id␠!==␠'one')"` | [director-202] The settleShotLayerStates reaches layer one | KILLED |
| `M074` | `src/scenes/director.js:1251` | `"Object.entries(states)"` → `"Object.entries(states).filter(([id])␠=>␠id␠!==␠'two')"` | [director-202] The settleShotLayerStates reaches layer two | KILLED |
| `M075` | `src/scenes/director.js:1253` | `"!state?.enabled␠&#124;&#124;"` → `""` | [director-202] The settleShotLayerStates skips the disabled layer | KILLED |
| `M076` | `src/scenes/director.js:1254` | `"state.params?.sceneControls?.deferEvidenceUntilCameraSettled␠!==␠true"` → `"false"` | [director-202] The settleShotLayerStates skips the control layer | KILLED |
| `M077` | `src/scenes/director.js:1286` | `"Object.entries(states)"` → `"Object.entries(states).filter(([id])␠=>␠id␠!==␠'one')"` | [director-204] The publishShotTravel reaches layer one | KILLED |
| `M078` | `src/scenes/director.js:1286` | `"Object.entries(states)"` → `"Object.entries(states).filter(([id])␠=>␠id␠!==␠'two')"` | [director-204] The publishShotTravel reaches layer two | KILLED |
| `M079` | `src/scenes/director.js:1288` | `"!state?.enabled␠&#124;&#124;"` → `""` | [director-204] The publishShotTravel skips the disabled layer | KILLED |
| `M080` | `src/scenes/director.js:1289` | `"state.params?.sceneControls?.evidencePathDuringCamera␠!==␠true"` → `"false"` | [director-204] The publishShotTravel skips the control layer | KILLED |
| `M081` | `src/scenes/director.js:1322` | `"Object.entries(states)"` → `"Object.entries(states).filter(([id])␠=>␠id␠!==␠'one')"` | [director-205] The cancelActiveSceneTravel reaches layer one | KILLED |
| `M082` | `src/scenes/director.js:1322` | `"Object.entries(states)"` → `"Object.entries(states).filter(([id])␠=>␠id␠!==␠'two')"` | [director-205] The cancelActiveSceneTravel reaches layer two | KILLED |
| `M083` | `src/scenes/director.js:1324` | `"!state?.enabled␠&#124;&#124;"` → `""` | [director-205] The cancelActiveSceneTravel skips the disabled layer | KILLED |
| `M084` | `src/scenes/director.js:1325` | `"state.params?.sceneControls?.evidencePathDuringCamera␠!==␠true"` → `"false"` | [director-205] The cancelActiveSceneTravel skips the control layer | KILLED |
| `M085` | `src/scenes/director.js:1471` | `"Object.entries(states)"` → `"Object.entries(states).filter(([id])␠=>␠id␠!==␠'one')"` | [director-214] The direct seek updates layer one and the camera | KILLED |
| `M086` | `src/scenes/director.js:1471` | `"Object.entries(states)"` → `"Object.entries(states).filter(([id])␠=>␠id␠!==␠'two')"` | [director-214] The direct seek updates layer two and the camera | KILLED |
| `M087` | `src/scenes/director.js:1472` | `"!state?.enabled␠&#124;&#124;"` → `""` | [director-214] The direct seek skips absent disabled | KILLED |
| `M088` | `src/scenes/director.js:1472` | `"␠&#124;&#124;␠!state.params"` → `""` | [director-214] The direct seek skips absent params | KILLED |
| `M089` | `src/scenes/director.js:1238` | `"token?.cancelled"` → `"false"` | [director-202] The cancelled token does not settle layers | KILLED |
| `M090` | `src/scenes/director.js:1242` | `"active:␠false"` → `"active:␠true"` | [director-202] The settleShotLayerStates reaches layer one | KILLED |
| `M091` | `src/scenes/director.js:1243` | `"completed:␠true"` → `"completed:␠false"` | [director-202] The settleShotLayerStates reaches layer one | KILLED |
| `M092` | `src/scenes/director.js:1263` | `"this._activeSceneTravel␠=␠null;"` → `"void␠0;"` | [director-202] The settleShotLayerStates reaches layer one | KILLED |
| `M093` | `src/scenes/director.js:1273` | `"␠&#124;&#124;␠DEFAULT_SHOT_DURATION_SEC"` → `""` | [director-203] The travel duration bad gives 4 seconds | KILLED |
| `M094` | `src/scenes/director.js:1272` | `"0.2,"` → `"0,"` | [director-203] The travel duration -1 gives 0.2 seconds | KILLED |
| `M095` | `src/scenes/director.js:1270` | `"++this._sceneTravelGeneration"` → `"this._sceneTravelGeneration"` | [director-203] The travel duration 4 gives 4 seconds | KILLED |
| `M096` | `src/scenes/director.js:1300` | `"this._cameraMotion?.cancel();"` → `"void␠0;"` | [director-205] The absent travel still cancels camera motion | KILLED |
| `M097` | `src/scenes/director.js:1301` | `"this._usesAuthoredCamera␠=␠false;"` → `"void␠0;"` | [director-205] The absent travel still cancels camera motion | KILLED |
| `M098` | `src/scenes/director.js:1306` | `"(id)␠=>␠this.dataManager?.layers?.get(id)?.module"` → `"(id)␠=>␠null"` | [director-205] The travel cancellation resolves a pack module | KILLED |
| `M099` | `src/scenes/director.js:1310` | `"this._activeSceneTravel␠=␠null;"` → `"void␠0;"` | [director-205] The cancelActiveSceneTravel reaches layer one | KILLED |
| `M100` | `src/scenes/director.js:1316` | `"cancelled:␠true"` → `"cancelled:␠false"` | [director-205] The cancelActiveSceneTravel reaches layer one | KILLED |
| `M101` | `src/scenes/director.js:1333` | `")␠!==␠false"` → `")␠!==␠true"` | [director-206] The travel cancellation handles a parameter refusal | KILLED |
| `M102` | `src/scenes/director.js:1340` | `"if␠(cancelled)␠continue;"` → `"if␠(true)␠continue;"` | [director-206] The travel cancellation handles a parameter refusal | KILLED |
| `M103` | `src/scenes/director.js:1364` | `"if␠(this._destroyed)"` → `"if␠(false)"` | [director-208] The replay rejects destroyed | KILLED |
| `M104` | `src/scenes/director.js:1365` | `"if␠(this._running)"` → `"if␠(false)"` | [director-208] The replay rejects running | KILLED |
| `M105` | `src/scenes/director.js:1367` | `"!scene␠&#124;&#124;␠"` → `""` | [director-208] The replayShot checks only an absent scene | KILLED |
| `M106` | `src/scenes/director.js:1367` | `"␠&#124;&#124;␠!shot"` → `""` | [director-208] The replayShot checks only an absent shot | KILLED |
| `M107` | `src/scenes/director.js:1370` | `"shotIndex␠-␠1"` → `"shotIndex"` | [director-207] The replay uses a static shot | KILLED |
| `M108` | `src/scenes/director.js:1373` | `"␠&#124;&#124;␠DEFAULT_SHOT_DURATION_SEC"` → `""` | [director-207] The replay uses the default duration and cancellation result | KILLED |
| `M109` | `src/scenes/director.js:1374` | `"shot.move"` → `"false"` | [director-207] The replay uses a move shot | KILLED |
| `M110` | `src/scenes/director.js:1378` | `"result␠&#124;&#124;␠"` → `""` | [director-207] The replay uses a static shot | KILLED |
| `M111` | `src/scenes/director.js:1384` | `"!scene␠&#124;&#124;␠"` → `""` | [director-209] The continueScene checks only an absent scene | KILLED |
| `M112` | `src/scenes/director.js:1384` | `"␠&#124;&#124;␠!shot"` → `""` | [director-209] The continueScene checks only an absent shot | KILLED |
| `M113` | `src/scenes/director.js:1388` | `"preview:␠false"` → `"preview:␠true"` | [director-209] The scene request starts after the selected shot | KILLED |
| `M114` | `src/scenes/director.js:1394` | `"if␠(this._destroyed)"` → `"if␠(false)"` | [director-211] The adjacent request rejects destroyed | KILLED |
| `M115` | `src/scenes/director.js:1395` | `"if␠(this._running)"` → `"if␠(false)"` | [director-211] The adjacent request rejects running | KILLED |
| `M116` | `src/scenes/director.js:1397` | `"␠??␠-1"` → `""` | The adjacent null index changes a custom property access | SURVIVED; known limit `adjacent-index-getter` |
| `M117` | `src/scenes/director.js:1398` | `"direction␠<␠0"` → `"false"` | [director-210] The adjacent direction -1 selects its target | KILLED |
| `M118` | `src/scenes/director.js:1398` | `"direction␠<␠0"` → `"true"` | [director-210] The adjacent direction 1 selects its target | KILLED |
| `M119` | `src/scenes/director.js:1402` | `"result?.started␠===␠true"` → `"true"` | [director-211] The adjacent request rejects refusal | KILLED |
| `M120` | `src/scenes/director.js:1426` | `"this._cameraMotion?.active"` → `"false"` | [director-212] The clock timer total checks camera motion true | KILLED |
| `M121` | `src/scenes/director.js:1426` | `"this._cameraMotion?.active"` → `"true"` | [director-212] The clock timer total checks camera motion false | KILLED |
| `M122` | `src/scenes/director.js:1443` | `"if␠(!this._running)"` → `"if␠(false)"` | [director-213] The idle promise handles an idle scene | KILLED |
| `M123` | `src/scenes/director.js:1443` | `"if␠(!this._running)"` → `"if␠(true)"` | [director-213] The idle promise handles an active scene | KILLED |
| `M124` | `src/scenes/director.js:1449` | `"if␠(this._destroyed)"` → `"if␠(false)"` | [director-215] The direct seek guard checks destroyed | KILLED |
| `M125` | `src/scenes/director.js:1452` | `"!scene␠&#124;&#124;\n"` → `"false␠&#124;&#124;\n"` | [director-215] The direct seek guard checks scene | KILLED |
| `M126` | `src/scenes/director.js:1453` | `"!shot␠&#124;&#124;\n"` → `"false␠&#124;&#124;\n"` | [director-215] The direct seek guard checks shot | KILLED |
| `M127` | `src/scenes/director.js:1454` | `"shot.dataPackIds?.length"` → `"false"` | [director-215] The direct seek guard checks packs | KILLED |
| `M128` | `src/scenes/director.js:1455` | `"shot.interactions?.length"` → `"false"` | [director-215] The direct seek guard checks actions | KILLED |
| `M129` | `src/scenes/director.js:1456` | `"this._loadedSceneId␠!==␠scene.id"` → `"false"` | [director-215] The direct seek guard checks loaded scene | KILLED |
| `M130` | `src/scenes/director.js:1457` | `"this._selectedShotId␠!==␠shot.id"` → `"false"` | [director-215] The direct seek guard checks selected shot | KILLED |
| `M131` | `src/scenes/director.js:1460` | `"!this._claimCameraOwnership()"` → `"false"` | [director-216] The direct seek rejects camera refusal | KILLED |
| `M132` | `src/scenes/director.js:1476` | `")␠===␠false"` → `")␠===␠true"` | [director-216] The direct seek rejects params refusal | KILLED |
| `M133` | `src/scenes/director.js:1483` | `"seekState.camera␠&#124;&#124;␠"` → `""` | [director-225] The direct seek uses its own camera | KILLED |
| `M134` | `src/scenes/director.js:1483` | `"seekState.camera␠&#124;&#124;␠resolveCameraPose(scene,␠shot.camera)"` → `"seekState.camera"` | [director-225] The direct seek resolves an absent camera | KILLED |
| `M135` | `src/scenes/director.js:1496` | `"if␠(this._destroyed)"` → `"if␠(false)"` | [director-218] The scene seek rejects destroyed | KILLED |
| `M136` | `src/scenes/director.js:1508` | `"this._destroyed␠&#124;&#124;␠"` → `""` | [director-218] The scene seek rejects destruction after its idle wait | KILLED |
| `M137` | `src/scenes/director.js:1508` | `"generation␠!==␠this._sceneSeekGeneration"` → `"false"` | [director-218] The scene seek rejects stale | KILLED |
| `M138` | `src/scenes/director.js:1511` | `"if␠(!seekState)"` → `"if␠(false)"` | [director-218] The scene seek rejects absent state | KILLED |
| `M139` | `src/scenes/director.js:1512` | `"if␠(this._seekLoadedShot(scene,␠seekState))"` → `"if␠(false)"` | [director-217] The scene seek uses the direct path | KILLED |
| `M140` | `src/scenes/director.js:1517` | `"!this._destroyed"` → `"true"` | [director-218] The scene seek checks destroyed after the shot load | KILLED |
| `M141` | `src/scenes/director.js:1518` | `"generation␠===␠this._sceneSeekGeneration"` → `"true"` | [director-218] The scene seek checks stale after the shot load | KILLED |
| `M142` | `src/scenes/director.js:1519` | `"result?.started␠===␠true"` → `"true"` | [director-218] The scene seek checks not started after the shot load | KILLED |
| `M143` | `src/scenes/director.js:1538` | `"director._destroyed␠&#124;&#124;"` → `"false␠&#124;&#124;"` | [director-219] The load token checks destroyed | KILLED |
| `M144` | `src/scenes/director.js:1539` | `"signal?.aborted␠&#124;&#124;"` → `"false␠&#124;&#124;"` | [director-219] The load token checks aborted | KILLED |
| `M145` | `src/scenes/director.js:1540` | `"director._loadGeneration␠!==␠generation"` → `"false"` | [director-219] The load token checks generation | KILLED |
| `M146` | `src/scenes/director.js:1562` | `"runImmediateNavigation('scene'"` → `"runImmediateNavigation('other'"` | [director-220] The camera claim handles true | KILLED |
| `M147` | `src/scenes/director.js:1564` | `"this._claimingCamera␠=␠false;"` → `"void␠0;"` | [director-220] The camera claim handles throw | KILLED |
| `M148` | `src/scenes/director.js:1566` | `"claimed␠===␠false"` → `"false"` | [director-220] The camera claim handles false | KILLED |
| `M149` | `src/scenes/director.js:1575` | `"!cameraState␠&#124;&#124;␠"` → `""` | [director-221] The camera placement handles absent pose | KILLED |
| `M150` | `src/scenes/director.js:1575` | `"typeof␠this.viewer?.camera?.setView␠!==␠'function'"` → `"false"` | [director-221] The camera placement handles absent method | KILLED |
| `M151` | `src/scenes/director.js:1586` | `"cameraState.heading␠&#124;&#124;␠0"` → `"cameraState.heading"` | [director-221] The camera placement handles defaults | KILLED |
| `M152` | `src/scenes/director.js:1587` | `"cameraState.pitch␠??␠-35"` → `"cameraState.pitch␠&#124;&#124;␠-35"` | [director-221] The camera placement handles zero | KILLED |
| `M153` | `src/scenes/director.js:1587` | `"cameraState.pitch␠??␠-35"` → `"cameraState.pitch"` | [director-221] The camera placement handles defaults | KILLED |
| `M154` | `src/scenes/director.js:1588` | `"cameraState.roll␠&#124;&#124;␠0"` → `"cameraState.roll"` | [director-221] The camera placement handles defaults | KILLED |
| `M155` | `src/scenes/director.js:1612` | `"scene.shots.length"` → `"0"` | [director-222] The scene list gives project order and shot totals | KILLED |
| `M156` | `src/scenes/director.js:1622` | `"query␠??␠''"` → `"query"` | [director-223] The null query does not match the word null | KILLED |
| `M157` | `src/scenes/director.js:1627` | `"this._project.scenes.find((item)␠=>␠item.id␠===␠query)␠&#124;&#124;"` → `"null␠&#124;&#124;"` | [director-223] The scene ID takes precedence over both title matches | KILLED |
| `M158` | `src/scenes/director.js:1628` | `"this._project.scenes.find((item)␠=>␠item.title.toLowerCase()␠===␠q)␠&#124;&#124;"` → `"null␠&#124;&#124;"` | [director-223] The exact title takes precedence over a substring | KILLED |
| `M159` | `src/scenes/director.js:1629` | `"item.title.toLowerCase().includes(q)"` → `"false"` | [director-223] The scene query handles cen | KILLED |
| `M160` | `src/scenes/director.js:1630` | `"return␠scene"` → `"return␠false"` | [director-223] The scene query handles s | KILLED |
| `M161` | `src/scenes/director.js:1644` | `"this._activeRun"` → `"false"` | [director-224] The playback status handles an active scene | KILLED |
| `M162` | `src/scenes/director.js:1647` | `"this._activeRun"` → `"false"` | [director-224] The playback status handles an active scene | KILLED |
| `M163` | `src/scenes/director.js:1196` | `"this._sceneMediaModules␠&#124;&#124;␠[]"` → `"this._sceneMediaModules"` | [director-200] The media method skips absent layers | KILLED |
| `M164` | `src/scenes/director.js:1239` | `"cameraTravel\n"` → `"false\n"` | [director-202] The settleShotLayerStates reaches layer one | KILLED |
| `M165` | `src/scenes/director.js:1246` | `":␠null"` → `":␠{}"` | [director-202] The absent travel gives null layer travel state | KILLED |
| `M166` | `src/scenes/director.js:1101` | `"seekState␠?␠seekState.cameraProgress␠>=␠1␠:␠false"` → `"false"` | [director-217] The scene seek uses camera progress 1 | KILLED |
| `M167` | `src/scenes/director.js:1101` | `"seekState␠?␠seekState.cameraProgress␠>=␠1␠:␠false"` → `"true"` | [director-217] The scene seek uses camera progress 0.5 | KILLED |
| `M168` | `src/scenes/director.js:1052` | `"␠&#124;&#124;\n␠␠␠␠␠␠null"` → `""` | previous scene fallback gives the same public result | SURVIVED; equivalent |
| `M169` | `src/scenes/director.js:1050` | `"flyDuration␠??="` → `"flyDuration␠="` | [director-228] The supplied flight duration gives 0 seconds | KILLED |
| `M170` | `src/scenes/director.js:1581` | `"cameraState.lon"` → `"0"` | [director-221] The camera placement handles pose | KILLED |
| `M171` | `src/scenes/director.js:1582` | `"cameraState.lat"` → `"0"` | [director-221] The camera placement handles pose | KILLED |
| `M172` | `src/scenes/director.js:1583` | `"cameraState.alt"` → `"0"` | [director-221] The camera placement handles pose | KILLED |
| `M173` | `src/scenes/director.js:931` | `"durationSec:␠DEFAULT_SHOT_DURATION_SEC"` → `"durationSec:␠12"` | [director-186] The capture records live fields and selects the new shot | KILLED |
| `M174` | `src/scenes/director.js:932` | `"holdSec:␠DEFAULT_HOLD_SEC"` → `"holdSec:␠12"` | [director-186] The capture records live fields and selects the new shot | KILLED |
| `M175` | `src/scenes/director.js:1555` | `"cancelCameraArrival(this.viewer);"` → `"void␠0;"` | [director-229] The shot camera cancels arrival work before its policy | KILLED |
| `M176` | `src/scenes/director.js:1335` | `"console.warn("` → `"(()=>{})("` | [director-206] The travel cancellation handles a parameter error | KILLED |
| `M177` | `src/scenes/director.js:1347` | `"console.warn("` → `"(()=>{})("` | [director-206] The travel cancellation handles an asynchronous layer error | KILLED |
| `M178` | `src/scenes/director.js:1353` | `"console.warn("` → `"(()=>{})("` | [director-206] The travel cancellation handles a synchronous layer error | KILLED |
| `M179` | `src/scenes/director.js:1345` | `"setEnabled(layerId,␠false"` → `"setEnabled(layerId,␠true"` | [director-206] The travel cancellation handles a parameter refusal | KILLED |
| `M180` | `src/scenes/director.js:1306` | `"this.dataManager?.layers"` → `"this.dataManager.layers"` | [director-205] The travel cancellation accepts an absent manager | KILLED |
| `M181` | `src/scenes/director.js:1306` | `"layers?.get(id)"` → `"layers.get(id)"` | [director-205] The travel cancellation accepts an absent layers | KILLED |
| `M182` | `src/scenes/director.js:1306` | `"get(id)?.module"` → `"get(id).module"` | [director-205] The travel cancellation accepts an absent module | KILLED |
| `M183` | `src/scenes/director.js:1202` | `"this.dataManager?.layers"` → `"this.dataManager.layers"` | [director-200] The media owner accepts an absent manager | KILLED |
| `M184` | `src/scenes/director.js:1202` | `"layers?.get(id)"` → `"layers.get(id)"` | [director-200] The media owner accepts an absent layers | KILLED |
| `M185` | `src/scenes/director.js:1575` | `"viewer?.camera"` → `"viewer.camera"` | [director-230] The camera placement rejects an absent viewer | KILLED |
| `M186` | `src/scenes/director.js:1575` | `"camera?.setView"` → `"camera.setView"` | [director-230] The camera placement rejects an absent camera | KILLED |
| `M187` | `src/scenes/director.js:1211` | `"token,"` → `"token:␠{␠cancelled:␠false␠},"` | [director-200] The media owner reaches layer one | KILLED |
| `M188` | `src/scenes/director.js:1209` | `"sceneId:␠scene.id"` → `"sceneId:␠'other'"` | [director-200] The media owner reaches layer one | KILLED |
| `M189` | `src/scenes/director.js:1210` | `"shotId:␠shot.id"` → `"shotId:␠'other'"` | [director-200] The media owner reaches layer one | KILLED |
| `M190` | `src/scenes/director.js:1433` | `"this._clock.subscribe(listener)"` → `"this._clock.subscribe(()␠=>␠{})"` | [director-212] The clock timer total checks camera motion true | KILLED |
| `M191` | `src/scenes/director.js:1512` | `"if␠(this._seekLoadedShot(scene,␠seekState))"` → `"if␠(false)"` | [director-217] The scene seek uses the direct path | KILLED |
