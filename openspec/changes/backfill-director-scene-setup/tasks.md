## 1 Spec

- [x] 1.1 Write the added director requirements.

## 2 Tests

- [x] 2.1 Add tests for `director-111`.

  Mutation: `M001` replaces the first block with the second block. The test must fail.

  ```js
  this._project = this._loadProject();
      this._selectedSceneId = this._project.scenes[0]?.id || null;
  ```

  ```js
  this._project = this._loadProject();
      this._selectedSceneId = null;
  ```

- [x] 2.2 Add tests for `director-112`.

  Mutation: `M019` replaces the first block with the second block. The test must fail.

  ```js
  this._selectedSceneId = this._project.scenes[0]?.id || null;
      this._selectedShotId = this._project.scenes[0]?.shots[0]?.id || null;
      /**
  ```

  ```js
  this._selectedSceneId = this._project.scenes[0]?.id || null;
      this._selectedShotId = "wrong";
      /**
  ```

- [x] 2.3 Add tests for `director-113`.

  Mutation: `M020` replaces the first block with the second block. The test must fail.

  ```js
  if (!raw) return createDefaultProject();
  ```

  ```js
  if (false) return createDefaultProject();
  ```

- [x] 2.4 Add tests for `director-114`.

  Mutation: `M021` replaces the first block with the second block. The test must fail.

  ```js
  if (this._storageReadError) {
  ```

  ```js
  if (false) {
  ```

- [x] 2.5 Add tests for `director-115`.

  Mutation: `M022` replaces the first block with the second block. The test must fail.

  ```js
  this._storageReadError = error;
  ```

  ```js
  this._storageReadError = null;
  ```

- [x] 2.6 Add tests for `director-116`.

  Mutation: `M002` replaces the first block with the second block. The test must fail.

  ```js
  const project = normalizeProject(parseSceneDocument(raw));
  ```

  ```js
  const project = parseSceneDocument(raw);
  ```

- [x] 2.7 Add tests for `director-117`.

  Mutation: `M023` replaces the first block with the second block. The test must fail.

  ```js
  project.scenes.splice(anchorIndex + 1, 0, recipeToScene(recipe));
  ```

  ```js
  project.scenes.splice(anchorIndex, 0, recipeToScene(recipe));
  ```

- [x] 2.8 Add tests for `director-118`.

  Mutation: `M024` replaces the first block with the second block. The test must fail.

  ```js
  anchorIndex < 0 && recipe.installAlongsideFallbackSceneId
  ```

  ```js
  false && recipe.installAlongsideFallbackSceneId
  ```

- [x] 2.9 Add tests for `director-119`.

  Mutation: `M025` replaces the first block with the second block. The test must fail.

  ```js
  installed.has(recipe.id)
  ```

  ```js
  false
  ```

- [x] 2.10 Add tests for `director-120`.

  Mutation: `M026` replaces the first block with the second block. The test must fail.

  ```js
  scene.id === recipe.id || scene.title === recipe.title
  ```

  ```js
  scene.title === recipe.title
  ```

- [x] 2.11 Add tests for `director-121`.

  Mutation: `M003` replaces the first block with the second block. The test must fail.

  ```js
  if (anchorIndex < 0) continue;
  ```

  ```js
  if (false) continue;
  ```

- [x] 2.12 Add tests for `director-122`.

  Mutation: `M028` replaces the first block with the second block. The test must fail.

  ```js
  return project;
      } catch (error)
  ```

  ```js
  return createDefaultProject();
      } catch (error)
  ```

- [x] 2.13 Add tests for `director-123`.

  Mutation: `M029` replaces the first block with the second block. The test must fail.

  ```js
  render: false,
              announce: false,
  ```

  ```js
  render: true,
              announce: false,
  ```

- [x] 2.14 Add tests for `director-124`.

  Mutation: `M033` replaces the first block with the second block. The test must fail.

  ```js
  ['pointerdown', 'wheel'])
        canvas?.addEventListener
  ```

  ```js
  ['wheel'])
        canvas?.addEventListener
  ```

- [x] 2.15 Add tests for `director-125`.

  Mutation: `M037` replaces the first block with the second block. The test must fail.

  ```js
  event?.type === 'pointerdown' &&
  ```

  ```js
  true &&
  ```

- [x] 2.16 Add tests for `director-126`.

  Mutation: `M039` replaces the first block with the second block. The test must fail.

  ```js
  ['user', 'voice', 'tool'].includes(change.origin)
  ```

  ```js
  ['voice', 'tool'].includes(change.origin)
  ```

- [x] 2.17 Add tests for `director-127`.

  Mutation: `M042` replaces the first block with the second block. The test must fail.

  ```js
  change.enabled !== false ||
  ```

  ```js
  false ||
  ```

- [x] 2.18 Add tests for `director-128`.

  Mutation: `M045` replaces the first block with the second block. The test must fail.

  ```js
  promise.then(release, release);
  ```

  ```js
  promise.then(() => {}, release);
  ```

- [x] 2.19 Add tests for `director-129`.

  Mutation: `M004` replaces the first block with the second block. The test must fail.

  ```js
  if (this._destroyPromise) return this._destroyPromise;
  ```

  ```js
  if (false) return this._destroyPromise;
  ```

- [x] 2.20 Add tests for `director-130`.

  Mutation: `M047` replaces the first block with the second block. The test must fail.

  ```js
  this._clock.destroy();
  ```

  ```js
  void this._clock;
  ```

- [x] 2.21 Add tests for `director-131`.

  Mutation: `M048` replaces the first block with the second block. The test must fail.

  ```js
  await Promise.allSettled(this._pendingWork || []);
  ```

  ```js
  await Promise.allSettled([]);
  ```

- [x] 2.22 Add tests for `director-132`.

  Mutation: `M005` replaces the first block with the second block. The test must fail.

  ```js
  this._project.updatedAt = new Date().toISOString();
  ```

  ```js
  this._project.updatedAt = "2000-01-01T00:00:00.000Z";
  ```

- [x] 2.23 Add tests for `director-133`.

  Mutation: `M006` replaces the first block with the second block. The test must fail.

  ```js
  parseSceneDocument(payload);
        localStorage.setItem(STORAGE_KEY, payload);
  ```

  ```js
  localStorage.setItem(STORAGE_KEY, payload);
  ```

- [x] 2.24 Add tests for `director-134`.

  Mutation: `M007` replaces the first block with the second block. The test must fail.

  ```js
  e instanceof SceneDocumentError
  ```

  ```js
  true
  ```

- [x] 2.25 Add tests for `director-135`.

  Mutation: `M049` replaces the first block with the second block. The test must fail.

  ```js
  message = 'Scene not saved — browser storage unavailable'
  ```

  ```js
  message = 'wrong'
  ```

- [x] 2.26 Add tests for `director-136`.

  Mutation: `M008` replaces the first block with the second block. The test must fail.

  ```js
  this._selectedSceneId = this._project.scenes[0]?.id || null;
      }
  ```

  ```js
  this._selectedSceneId = null;
      }
  ```

- [x] 2.27 Add tests for `director-137`.

  Mutation: `M009` replaces the first block with the second block. The test must fail.

  ```js
  this._selectedShotId = scene.shots[0].id;
  ```

  ```js
  this._selectedShotId = null;
  ```

- [x] 2.28 Add tests for `director-138`.

  Mutation: `M010` replaces the first block with the second block. The test must fail.

  ```js
  (item) => item.id === shotId
  ```

  ```js
  (item) => item.id !== shotId
  ```

- [x] 2.29 Add tests for `director-139`.

  Mutation: `M011` replaces the first block with the second block. The test must fail.

  ```js
  title: sceneName.trim() || `Scene ${this._project.scenes.length + 1}`,
  ```

  ```js
  title: sceneName || `Scene ${this._project.scenes.length + 1}`,
  ```

- [x] 2.30 Add tests for `director-140`.

  Mutation: `M012` replaces the first block with the second block. The test must fail.

  ```js
  `Scene ${this._project.scenes.length + 1}`
  ```

  ```js
  `Scene ${this._project.scenes.length}`
  ```

- [x] 2.31 Add tests for `director-141`.

  Mutation: `M013` replaces the first block with the second block. The test must fail.

  ```js
  if (!sceneName) return;
  ```

  ```js
  if (false) return;
  ```

- [x] 2.32 Add tests for `director-142`.

  Mutation: `M014` replaces the first block with the second block. The test must fail.

  ```js
  (item) => item.id !== scene.id,
  ```

  ```js
  (item) => item.id === scene.id,
  ```

- [x] 2.33 Add tests for `director-143`.

  Mutation: `M015` replaces the first block with the second block. The test must fail.

  ```js
  if (!this._project.scenes.length) {
  ```

  ```js
  if (false) {
  ```

- [x] 2.34 Add tests for `director-144`.

  Mutation: `M016` replaces the first block with the second block. The test must fail.

  ```js
  ...(params ? { params } : {}),
  ```

  ```js
  ...{},
  ```

- [x] 2.35 Add tests for `director-145`.

  Mutation: `M017` replaces the first block with the second block. The test must fail.

  ```js
  if (type === 'shot-loaded')
  ```

  ```js
  if (false)
  ```

- [x] 2.36 Add tests for `director-146`.

  Mutation: `M018` replaces the first block with the second block. The test must fail.

  ```js
  shot.title = title.trim() || shot.title;
  ```

  ```js
  shot.title = title || shot.title;
  ```

- [x] 2.37 Add tests for `director-147`.

  Mutation: `M060` replaces the first block with the second block. The test must fail.

  ```js
  !this._destroyed && !this._running && !this.viewer.trackedEntity
  ```

  ```js
  !this._running && !this.viewer.trackedEntity
  ```

- [x] 2.38 Add tests for `director-148`.

  Mutation: `M064` replaces the first block with the second block. The test must fail.

  ```js
  applyPose: (pose) => this._setCameraView(pose),
  ```

  ```js
  applyPose: (pose) => false,
  ```

- [x] 2.39 Add tests for `director-149`.

  Mutation: `M066` replaces the first block with the second block. The test must fail.

  ```js
  progress: 0,
        runtime:
  ```

  ```js
  progress: 1,
        runtime:
  ```

- [x] 2.40 Add tests for `director-150`.

  Mutation: `M156` replaces the first block with the second block. The test must fail.

  ```js
  [BUNDLE_SOURCE]: this._bundleAssets.source,
  ```

  ```js
  [BUNDLE_SOURCE]: dataPacks.sources[BUNDLE_SOURCE],
  ```

## 3 Host checks

- [x] 3.1 Measure each test file in a separate process.
- [x] 3.2 Check the decision audit.
- [x] 3.3 Check the prose.

## 4 Gates and review

- [ ] 4.1 Run `make ratchet CHANGE=backfill-director-scene-setup`.
- [ ] 4.2 Run `make gates CHANGE=backfill-director-scene-setup`.
- [ ] 4.3 Get both reviews through `/opsx:review backfill-director-scene-setup`.
- [ ] 4.4 Record the reviewed tree in `review.md`.
