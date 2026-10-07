## 1. Spec

- [x] 1.1 Read the source at the recorded commit.
- [x] 1.2 Add the director scenarios.

## 2. Tests

- [x] 2.1 Complete the tests for `director-001`.

  Mutation: Apply `m196` to `src/director/document.js`.

```diff
- JSON.stringify(project, null, 2)
+ JSON.stringify({scenes:[]}, null, 2)
```

  The test must fail.

- [x] 2.2 Complete the tests for `director-002`.

  Mutation: Apply `m197` to `src/director/document.js`.

```diff
- return validateSceneDocument(parsed);
+ return validateSceneDocument({scenes:[{shots:[]}]});
```

  The test must fail.

- [x] 2.3 Complete the tests for `director-003`.

  Mutation: Apply `m198` to `src/director/document.js`.

```diff
- Object.hasOwn(project, 'version') ? project.version : 1
+ Object.hasOwn(project, 'version') ? project.version : 3
```

  The test must fail.

- [x] 2.4 Complete the tests for `director-004`.

  Mutation: Apply `m044` to `src/director/document.js`.

```diff
- ![1, 2, 3, 4, 5, 6].includes(version)
+ false
```

  The test must fail.

- [x] 2.5 Complete the tests for `director-005`.

  Mutation: Apply `m001` to `src/director/documentFields.js`.

```diff
- if (!value || typeof value !== 'object' || Array.isArray(value))
+ if (false || typeof value !== 'object' || Array.isArray(value))
```

  The test must fail.

- [x] 2.6 Complete the tests for `director-006`.

  Mutation: Apply `m005` to `src/director/documentFields.js`.

```diff
- typeof value !== 'string' ||
+ false ||
```

  The test must fail.

- [x] 2.7 Complete the tests for `director-007`.

  Mutation: Apply `m010` to `src/director/documentFields.js`.

```diff
- !Number.isFinite(numeric) ||
+ false ||
```

  The test must fail.

- [x] 2.8 Complete the tests for `director-008`.

  Mutation: Apply `m017` to `src/director/documentFields.js`.

```diff
- Object.hasOwn(value, key)
+ key in value
```

  The test must fail.

- [x] 2.9 Complete the tests for `director-009`.

  Mutation: Apply `m018` to `src/director/documentFields.js`.

```diff
- !Array.isArray(value) ||
+ false ||
```

  The test must fail.

- [x] 2.10 Complete the tests for `director-010`.

  Mutation: Apply `m022` to `src/director/documentFields.js`.

```diff
- ++budget.nodes > SCENE_DOCUMENT_LIMITS.nodes
+ false
```

  The test must fail.

- [x] 2.11 Complete the tests for `director-011`.

  Mutation: Apply `m024` to `src/director/documentFields.js`.

```diff
- value === null ||
+ false ||
```

  The test must fail.

- [x] 2.12 Complete the tests for `director-012`.

  Mutation: Apply `m034` to `src/director/documentFields.js`.

```diff
- value.length > SCENE_DOCUMENT_LIMITS.string
+ false
```

  The test must fail.

- [x] 2.13 Complete the tests for `director-013`.

  Mutation: Apply `m040` to `src/director/document.js`.

```diff
- typeof text !== 'string' ||
+ false ||
```

  The test must fail.

- [x] 2.14 Complete the tests for `director-014`.

  Mutation: Apply `m045` to `src/director/document.js`.

```diff
- ['style', 'mapStack']
+ ['mapStack']
```

  The test must fail.

- [x] 2.15 Complete the tests for `director-015`.

  Mutation: Apply `m048` to `src/director/document.js`.

```diff
-     bloom: { enabled: 'boolean', intensity: [-100, 10000], version: [1, 100] }
+     bloom: { enabledREMOVED: 'boolean', intensity: [-100, 10000], version: [1, 100] }
```

  The test must fail.

- [x] 2.16 Complete the tests for `director-016`.

  Mutation: Apply `m062` to `src/director/document.js`.

```diff
- ['createdAt', 'updatedAt']
+ ['updatedAt']
```

  The test must fail.

- [x] 2.17 Complete the tests for `director-017`.

  Mutation: Apply `m065` to `src/director/document.js`.

```diff
-       optional(shot, 'durationSec', at, (v, p) =>
-         number(v, p, 0, 86400, legacy),
-       );
```

  The test must fail.

- [x] 2.18 Complete the tests for `director-018`.

  Mutation: Apply `m074` to `src/director/document.js`.

```diff
- typeof entry.enabled !== 'boolean'
+ false
```

  The test must fail.

- [x] 2.19 Complete the tests for `director-019`.

  Mutation: Apply `m082` to `src/director/authoring.js`.

```diff
- if (Object.hasOwn(sceneDetails, key)) scene[key] = sceneDetails[key];
+ if (key !== 'anchors' && Object.hasOwn(sceneDetails, key)) scene[key] = sceneDetails[key];
```

  The test must fail.

- [x] 2.20 Complete the tests for `director-020`.

  Mutation: Apply `m099` to `src/director/authoring.js`.

```diff
- || !shot
+ || false
```

  The test must fail.

- [x] 2.21 Complete the tests for `director-021`.

  Mutation: Apply `m083` to `src/director/authoring.js`.

```diff
- delete scene[key];
+ if(key !== 'anchors') delete scene[key];
```

  The test must fail.

- [x] 2.22 Complete the tests for `director-022`.

  Mutation: Apply `m102` to `src/director/authoring.js`.

```diff
- scenes: [scene]
+ scenes: copy.scenes
```

  The test must fail.

- [x] 2.23 Complete the tests for `director-023`.

  Mutation: Apply `m127` to `src/director/clock.js`.

```diff
- Number(sceneElapsedSec) || 0
+ Number(sceneElapsedSec)
```

  The test must fail.

- [x] 2.24 Complete the tests for `director-024`.

  Mutation: Apply `m134` to `src/director/clock.js`.

```diff
- this._sceneClockSnapshot.stopped ||
+ false ||
```

  The test must fail.

- [x] 2.25 Complete the tests for `director-025`.

  Mutation: Apply `m174` to `src/director/clock.js`.

```diff
- this.now() < endAt
+ false
```

  The test must fail.

- [x] 2.26 Complete the tests for `director-026`.

  Mutation: Apply `m132` to `src/director/clock.js`.

```diff
- return () => this._sceneClockListeners.delete(listener);
+ return () => {};
```

  The test must fail.

- [x] 2.27 Complete the tests for `director-027`.

  Mutation: Apply `m136` to `src/director/clock.js`.

```diff
- Math.max(1000, totalSec * 1000)
+ totalSec * 1000
```

  The test must fail.

- [x] 2.28 Complete the tests for `director-028`.

  Mutation: Apply `m160` to `src/director/clock.js`.

```diff
- if (seconds <= 0)
+ if (false)
```

  The test must fail.

- [x] 2.29 Complete the tests for `director-029`.

  Mutation: Apply `m140` to `src/director/clock.js`.

```diff
- to, sceneClock = null) {
-     this.stopShot();
-     const generation = this._shotGeneration;
-     if (
-       generation !== this._shotGeneration ||
-       this._destroyed ||
-       token.cancelled ||
-       token.signal?.aborted ||
-       this.isRunning()
-     )
+ to, sceneClock = null) {
+     this.stopShot();
+     const generation = this._shotGeneration;
+     if (
+       generation !== this._shotGeneration ||
+       false ||
+       token.cancelled ||
+       token.signal?.aborted ||
+       this.isRunning()
+     )
```

  The test must fail.

- [x] 2.30 Complete the tests for `director-030`.

  Mutation: Apply `m162` to `src/director/clock.js`.

```diff
- st generation = this._sceneGeneration;
-     const timing = this.timingForShot(scene, shot);
-     if (
-       generation !== this._sceneGeneration ||
-       this._destroyed ||
-       token.cancelled ||
-       token.signal?.aborted
-     )
+ st generation = this._sceneGeneration;
+     const timing = this.timingForShot(scene, shot);
+     if (
+       generation !== this._sceneGeneration ||
+       false ||
+       token.cancelled ||
+       token.signal?.aborted
+     )
```

  The test must fail.

- [x] 2.31 Complete the tests for `director-031`.

  Mutation: Apply `m104` to `src/director/timeline.js`.

```diff
- durations[shotIndex] : 0
+ 0 : 0
```

  The test must fail.

- [x] 2.32 Complete the tests for `director-032`.

  Mutation: Apply `m105` to `src/director/timeline.js`.

```diff
- durationForShot(scene, item)) || []
+ durationForShot(scene, item))
```

  The test must fail.

- [x] 2.33 Complete the tests for `director-033`.

  Mutation: Apply `m110` to `src/director/timeline.js`.

```diff
- const target = toCamera || fromCamera;
+ const target = toCamera;
```

  The test must fail.

- [x] 2.34 Complete the tests for `director-034`.

  Mutation: Apply `m116` to `src/director/timeline.js`.

```diff
- targetSec < endElapsedSec ||
+ false ||
```

  The test must fail.

- [x] 2.35 Complete the tests for `director-035`.

  Mutation: Apply `m124` to `src/director/timeline.js`.

```diff
- scene.shots[shotIndex - 1]?.camera || shot.camera
+ shot.camera
```

  The test must fail.

- [x] 2.36 Complete the tests for `director-036`.

  Mutation: Apply `m191` to `src/director/playback.js`.

```diff
- const ordered = single
+ const ordered = false
```

  The test must fail.

- [x] 2.37 Complete the tests for `director-037`.

  Mutation: Apply `m180` to `src/director/playback.js`.

```diff
-   'selectShot',
```

  The test must fail.

- [x] 2.38 Complete the tests for `director-038`.

  Mutation: Apply `m187` to `src/director/playback.js`.

```diff
- Boolean(token.cancelled || token.signal?.aborted)
+ Boolean(false || token.signal?.aborted)
```

  The test must fail.

- [x] 2.39 Complete the tests for `director-039`.

  Mutation: Apply `m189` to `src/director/playback.js`.

```diff
- previousScene.id !== queue[0].scene.id
+ true
```

  The test must fail.

- [x] 2.40 Complete the tests for `director-040`.

  Mutation: Apply `m214` to `src/director/playback.js`.

```diff
- if (releaseOnFinish && activeScene) await adapter.releaseScene(activeScene);
```

  The test must fail.

## 3. Host checks

- [x] 3.1 Check each module with host coverage.
- [x] 3.2 Check each decision in the audit.
- [x] 3.3 Check the prose with STE lint.
- [x] 3.4 Check source format.

## 4. Gates and review

- [ ] 4.1 Run `make ratchet CHANGE=backfill-director-timing`.
- [ ] 4.2 Run `make gates CHANGE=backfill-director-timing`.
- [ ] 4.3 Get the archive and review from the lead.
- [ ] 4.4 Record both review verdicts in `review.md`.
