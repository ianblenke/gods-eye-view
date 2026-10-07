## 1. Spec and tests

- [x] 1.1 Write tests for `director-186`.
  Mutation: `M003` changes `src/scenes/director.js:940` from `scene.shots.push(shot);` to `scene.shots.length;`. The test must fail.
- [x] 1.2 Write tests for `director-187`.
  Mutation: `M001` changes `src/scenes/director.js:919` from `if␠(!scene)␠return;` to `if␠(false)␠return;`. The test must fail.
- [x] 1.3 Write tests for `director-188`.
  Mutation: `M012` changes `src/scenes/director.js:964` from `shot.move` to `false`. The test must fail.
- [x] 1.4 Write tests for `director-189`.
  Mutation: `M009` changes `src/scenes/director.js:953` from `if␠(!scene)␠return;` to `if␠(false)␠return;`. The test must fail.
- [x] 1.5 Write tests for `director-190`.
  Mutation: `M017` changes `src/scenes/director.js:982` from `!scene␠&#124;&#124;` to ``. The test must fail.
- [x] 1.6 Write tests for `director-191`.
  Mutation: `M022` changes `src/scenes/director.js:1009` from `if␠(this._destroyed)` to `if␠(false)`. The test must fail.
- [x] 1.7 Write tests for `director-192`.
  Mutation: `M028` changes `src/scenes/director.js:1055` from `!this._claimCameraOwnership()` to `false`. The test must fail.
- [x] 1.8 Write tests for `director-193`.
  Mutation: `M026` changes `src/scenes/director.js:1050` from `shot.move` to `false`. The test must fail.
- [x] 1.9 Write tests for `director-194`.
  Mutation: `M038` changes `src/scenes/director.js:1074` from `previousScene.id␠!==␠scene.id` to `false`. The test must fail.
- [x] 1.10 Write tests for `director-195`.
  Mutation: `M039` changes `src/scenes/director.js:1076` from `!released␠&#124;&#124;` to ``. The test must fail.
- [x] 1.11 Write tests for `director-196`.
  Mutation: `M030` changes `src/scenes/director.js:1070` from `this._loadToken(++this._loadGeneration,␠controller.signal)` to `this._loadToken(this._loadGeneration,␠controller.signal)`. The test must fail.
- [x] 1.12 Write tests for `director-197`.
  Mutation: `M045` changes `src/scenes/director.js:1111` from `if␠(layerResult.refused.length)` to `if␠(false)`. The test must fail.
- [x] 1.13 Write tests for `director-198`.
  Mutation: `M029` changes `src/scenes/director.js:1057` from `if␠(fromCamera)` to `if␠(false)`. The test must fail.
- [x] 1.14 Write tests for `director-199`.
  Mutation: `M051` changes `src/scenes/director.js:1156` from `this._cancelActiveSceneTravel();` to `void␠0;`. The test must fail.
- [x] 1.15 Write tests for `director-200`.
  Mutation: `M043` changes `src/scenes/director.js:1097` from `playMedia␠&&` to ``. The test must fail.
- [x] 1.16 Write tests for `director-201`.
  Mutation: `M061` changes `src/scenes/director.js:1197` from `module.setSceneMediaPlayback();` to `if␠(module.id␠!==␠'one')␠module.setSceneMediaPlayback();`. The test must fail.
- [x] 1.17 Write tests for `director-202`.
  Mutation: `M073` changes `src/scenes/director.js:1251` from `Object.entries(states)` to `Object.entries(states).filter(([id])␠=>␠id␠!==␠'one')`. The test must fail.
- [x] 1.18 Write tests for `director-203`.
  Mutation: `M093` changes `src/scenes/director.js:1273` from `&#124;&#124;␠DEFAULT_SHOT_DURATION_SEC` to ``. The test must fail.
- [x] 1.19 Write tests for `director-204`.
  Mutation: `M077` changes `src/scenes/director.js:1286` from `Object.entries(states)` to `Object.entries(states).filter(([id])␠=>␠id␠!==␠'one')`. The test must fail.
- [x] 1.20 Write tests for `director-205`.
  Mutation: `M081` changes `src/scenes/director.js:1322` from `Object.entries(states)` to `Object.entries(states).filter(([id])␠=>␠id␠!==␠'one')`. The test must fail.
- [x] 1.21 Write tests for `director-206`.
  Mutation: `M101` changes `src/scenes/director.js:1333` from `)␠!==␠false` to `)␠!==␠true`. The test must fail.
- [x] 1.22 Write tests for `director-207`.
  Mutation: `M107` changes `src/scenes/director.js:1370` from `shotIndex␠-␠1` to `shotIndex`. The test must fail.
- [x] 1.23 Write tests for `director-208`.
  Mutation: `M103` changes `src/scenes/director.js:1364` from `if␠(this._destroyed)` to `if␠(false)`. The test must fail.
- [x] 1.24 Write tests for `director-209`.
  Mutation: `M111` changes `src/scenes/director.js:1384` from `!scene␠&#124;&#124;` to ``. The test must fail.
- [x] 1.25 Write tests for `director-210`.
  Mutation: `M117` changes `src/scenes/director.js:1398` from `direction␠<␠0` to `false`. The test must fail.
- [x] 1.26 Write tests for `director-211`.
  Mutation: `M114` changes `src/scenes/director.js:1394` from `if␠(this._destroyed)` to `if␠(false)`. The test must fail.
- [x] 1.27 Write tests for `director-212`.
  Mutation: `M120` changes `src/scenes/director.js:1426` from `this._cameraMotion?.active` to `false`. The test must fail.
- [x] 1.28 Write tests for `director-213`.
  Mutation: `M122` changes `src/scenes/director.js:1443` from `if␠(!this._running)` to `if␠(false)`. The test must fail.
- [x] 1.29 Write tests for `director-214`.
  Mutation: `M085` changes `src/scenes/director.js:1471` from `Object.entries(states)` to `Object.entries(states).filter(([id])␠=>␠id␠!==␠'one')`. The test must fail.
- [x] 1.30 Write tests for `director-215`.
  Mutation: `M124` changes `src/scenes/director.js:1449` from `if␠(this._destroyed)` to `if␠(false)`. The test must fail.
- [x] 1.31 Write tests for `director-216`.
  Mutation: `M131` changes `src/scenes/director.js:1460` from `!this._claimCameraOwnership()` to `false`. The test must fail.
- [x] 1.32 Write tests for `director-217`.
  Mutation: `M139` changes `src/scenes/director.js:1512` from `if␠(this._seekLoadedShot(scene,␠seekState))` to `if␠(false)`. The test must fail.
- [x] 1.33 Write tests for `director-218`.
  Mutation: `M135` changes `src/scenes/director.js:1496` from `if␠(this._destroyed)` to `if␠(false)`. The test must fail.
- [x] 1.34 Write tests for `director-219`.
  Mutation: `M143` changes `src/scenes/director.js:1538` from `director._destroyed␠&#124;&#124;` to `false␠&#124;&#124;`. The test must fail.
- [x] 1.35 Write tests for `director-220`.
  Mutation: `M146` changes `src/scenes/director.js:1562` from `runImmediateNavigation('scene'` to `runImmediateNavigation('other'`. The test must fail.
- [x] 1.36 Write tests for `director-221`.
  Mutation: `M149` changes `src/scenes/director.js:1575` from `!cameraState␠&#124;&#124;` to ``. The test must fail.
- [x] 1.37 Write tests for `director-222`.
  Mutation: `M155` changes `src/scenes/director.js:1612` from `scene.shots.length` to `0`. The test must fail.
- [x] 1.38 Write tests for `director-223`.
  Mutation: `M156` changes `src/scenes/director.js:1622` from `query␠??␠''` to `query`. The test must fail.
- [x] 1.39 Write tests for `director-224`.
  Mutation: `M161` changes `src/scenes/director.js:1644` from `this._activeRun` to `false`. The test must fail.
- [x] 1.40 Write tests for `director-225`.
  Mutation: `M047` changes `src/scenes/director.js:1120` from `seekState.camera␠&#124;&#124;` to ``. The test must fail.
- [x] 1.41 Write tests for `director-226`.
  Mutation: `M056` changes `src/scenes/director.js:1021` from `ownsLoad␠&&` to `true␠&&`. The test must fail.
- [x] 1.42 Write tests for `director-227`.
  Mutation: `M033` changes `src/scenes/director.js:1106` from `if␠(token.cancelled)␠return;` to `if␠(false)␠return;`. The test must fail.
- [x] 1.43 Write tests for `director-228`.
  Mutation: `M169` changes `src/scenes/director.js:1050` from `flyDuration␠??=` to `flyDuration␠=`. The test must fail.
- [x] 1.44 Write tests for `director-229`.
  Mutation: `M175` changes `src/scenes/director.js:1555` from `cancelCameraArrival(this.viewer);` to `void␠0;`. The test must fail.
- [x] 1.45 Write tests for `director-230`.
  Mutation: `M185` changes `src/scenes/director.js:1575` from `viewer?.camera` to `viewer.camera`. The test must fail.

## 2. Evidence

- [x] 2.1 Record the host coverage union.
- [x] 2.2 Record the decision audit.
- [x] 2.3 Check the new prose.

## 3. Gates and review

- [ ] 3.1 Run `make ratchet CHANGE=backfill-director-scene-shots`.
- [ ] 3.2 Run `make gates CHANGE=backfill-director-scene-shots`.
- [ ] 3.3 Get the two review agent results.
- [ ] 3.4 Write `review.md`.
