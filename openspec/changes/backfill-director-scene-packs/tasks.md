## 1. Specs and tests

The source edits use `␠` for a space and `↵` for a new line.

- [x] 1.1 Add tests for `director-151`.
  Mutation: `M148` replaces `␠␠␠␠␠␠␠␠canonicalBase[index].id␠=␠scene.shots[index].id;↵` with `␠␠␠␠␠␠␠␠canonicalBase[index].id␠=␠"wrong";↵`. The test must fail.
- [x] 1.2 Add tests for `director-152`.
  Mutation: `M005` replaces `␠␠␠␠␠␠␠␠␠␠candidate.title␠===␠bootstrap.targetSceneTitle␠&&↵` with `␠␠␠␠␠␠␠␠␠␠true␠&&↵`. The test must fail.
- [x] 1.3 Add tests for `director-153`.
  Mutation: `M010` replaces `␠␠␠␠␠␠␠␠this._toastStorageError();↵␠␠␠␠␠␠␠␠continue;↵␠␠␠␠␠␠}↵` with `␠␠␠␠␠␠␠␠this._toastStorageError();↵␠␠␠␠␠␠␠␠void␠0;↵␠␠␠␠␠␠}↵`. The test must fail.
- [x] 1.4 Add tests for `director-154`.
  Mutation: `M013` replaces `␠␠␠␠␠␠␠␠this._project␠=␠originalProject;↵` with `␠␠␠␠␠␠␠␠void␠originalProject;↵`. The test must fail.
- [x] 1.5 Add tests for `director-155`.
  Mutation: `M141` replaces `␠␠␠␠␠␠this._selectedSceneId␠=␠scene.id;↵` with `␠␠␠␠␠␠void␠0;↵`. The test must fail.
- [x] 1.6 Add tests for `director-156`.
  Mutation: `M016` replaces `␠␠␠␠if␠(!scene)␠return␠{␠appended:␠false,␠reason:␠'scene-not-found'␠};↵` with `␠␠␠␠if␠(!scene)␠return␠{␠appended:␠true␠};↵`. The test must fail.
- [x] 1.7 Add tests for `director-157`.
  Mutation: `M017` replaces `␠␠␠␠if␠(!recipe)␠return␠{␠appended:␠false,␠reason:␠'pack-not-found'␠};↵` with `␠␠␠␠if␠(!recipe)␠return␠{␠appended:␠true␠};↵`. The test must fail.
- [x] 1.8 Add tests for `director-158`.
  Mutation: `M020` replaces `␠␠␠␠if␠((Number(marker?.version)␠||␠0)␠>=␠targetVersion)␠{↵` with `␠␠␠␠if␠((Number(marker?.version)␠||␠0)␠>␠targetVersion)␠{↵`. The test must fail.
- [x] 1.9 Add tests for `director-159`.
  Mutation: `M144` replaces `␠␠␠␠␠␠version:␠targetVersion,↵` with `␠␠␠␠␠␠version:␠0,↵`. The test must fail.
- [x] 1.10 Add tests for `director-160`.
  Mutation: `M151` replaces `␠␠␠␠␠␠␠␠␠␠JSON.stringify(existingPackBeatIds)␠===␠JSON.stringify(beatIds),↵` with `␠␠␠␠␠␠␠␠␠␠beatIds.length␠!==␠6␠&&␠JSON.stringify(existingPackBeatIds)␠===␠JSON.stringify(beatIds),↵`. The test must fail.
- [x] 1.11 Add tests for `director-161`.
  Mutation: `M027` replaces `␠␠␠␠␠␠!previousSourcePackVariants.some(↵` with `␠␠␠␠␠␠false␠&&␠!previousSourcePackVariants.some(↵`. The test must fail.
- [x] 1.12 Add tests for `director-162`.
  Mutation: `M041` replaces `␠␠␠␠␠␠existingShot.sourcePackId␠=␠recipe.id;↵` with `␠␠␠␠␠␠void␠recipe.id;↵`. The test must fail.
- [x] 1.13 Add tests for `director-163`.
  Mutation: `M031` replaces `␠␠␠␠␠␠␠␠␠␠(shot)␠=>␠!shot.sourcePackId␠&&␠shot.title␠===␠packShot.title,↵` with `␠␠␠␠␠␠␠␠␠␠(shot)␠=>␠true␠&&␠shot.title␠===␠packShot.title,↵`. The test must fail.
- [x] 1.14 Add tests for `director-164`.
  Mutation: `M034` replaces `␠␠␠␠␠␠␠␠)↵␠␠␠␠␠␠␠␠␠␠continue;↵␠␠␠␠␠␠␠␠const␠candidates␠=␠scene.shots.filter(↵` with `␠␠␠␠␠␠␠␠)↵␠␠␠␠␠␠␠␠␠␠void␠0;↵␠␠␠␠␠␠␠␠const␠candidates␠=␠scene.shots.filter(↵`. The test must fail.
- [x] 1.15 Add tests for `director-165`.
  Mutation: `M047` replaces `␠␠␠␠␠␠␠␠nextShots.splice(before␠<␠0␠?␠nextShots.length␠:␠before,␠0,␠shot);↵` with `␠␠␠␠␠␠␠␠nextShots.splice(before,␠0,␠shot);↵`. The test must fail.
- [x] 1.16 Add tests for `director-166`.
  Mutation: `M149` replaces `␠␠␠␠␠␠␠␠␠␠␠␠␠␠(shot,␠index)␠=>␠shot.title␠===␠requiredShotTitles[index],↵` with `␠␠␠␠␠␠␠␠␠␠␠␠␠␠(shot,␠index)␠=>␠true,↵`. The test must fail.
- [x] 1.17 Add tests for `director-167`.
  Mutation: `M049` replaces `␠␠␠␠const␠markerBindings␠=␠marker?.shotBindings↵` with `␠␠␠␠const␠markerBindings␠=␠null↵`. The test must fail.
- [x] 1.18 Add tests for `director-168`.
  Mutation: `M050` replaces `␠␠␠␠␠␠const␠resolvedShots␠=␠markerBindings↵␠␠␠␠␠␠␠␠?␠requiredShotTitles.map(↵` with `␠␠␠␠␠␠const␠resolvedShots␠=␠null↵␠␠␠␠␠␠␠␠?␠requiredShotTitles.map(↵`. The test must fail.
- [x] 1.19 Add tests for `director-169`.
  Mutation: `M055` replaces `␠␠␠␠␠␠␠␠␠␠␠␠new␠Set(resolvedShots.map((shot)␠=>␠shot.id)).size␠===↵␠␠␠␠␠␠␠␠␠␠␠␠␠␠requiredShotTitles.length↵` with `␠␠␠␠␠␠␠␠␠␠␠␠true↵`. The test must fail.
- [x] 1.20 Add tests for `director-170`.
  Mutation: `M061` replaces `␠␠␠␠␠␠␠␠sourcePackBeatIds.length␠===␠requiredSourcePackBeatIds.length␠&&↵` with `␠␠␠␠␠␠␠␠true␠&&↵`. The test must fail.
- [x] 1.21 Add tests for `director-171`.
  Mutation: `M063` replaces `␠␠␠␠␠␠␠␠return␠nextShots.find((shot)␠=>␠shot.id␠===␠boundShotId)␠||␠null;↵` with `␠␠␠␠␠␠␠␠return␠nextShots.find((shot)␠=>␠shot.id␠===␠boundShotId)␠||␠{};↵`. The test must fail.
- [x] 1.22 Add tests for `director-172`.
  Mutation: `M064` replaces `␠␠␠␠␠␠return␠matches.length␠===␠1␠?␠matches[0]␠:␠null;↵` with `␠␠␠␠␠␠return␠matches.length␠>␠0␠?␠matches[0]␠:␠null;↵`. The test must fail.
- [x] 1.23 Add tests for `director-173`.
  Mutation: `M139` replaces `␠␠␠␠␠␠␠␠shot.camera␠=␠normalizeShot({␠...shot,␠camera:␠patch.camera␠}).camera;↵` with `␠␠␠␠␠␠␠␠shot.camera␠=␠patch.camera;↵`. The test must fail.
- [x] 1.24 Add tests for `director-174`.
  Mutation: `M070` replaces `␠␠␠␠␠␠␠␠shot.holdSec␠=␠Math.max(0,␠Number(patch.holdSec));↵` with `␠␠␠␠␠␠␠␠shot.holdSec␠=␠Number(patch.holdSec);↵`. The test must fail.
- [x] 1.25 Add tests for `director-175`.
  Mutation: `M071` replaces `␠␠␠␠␠␠␠␠␠␠visual:␠{␠...shot.visual,␠...patch.visual␠},↵` with `␠␠␠␠␠␠␠␠␠␠visual:␠{␠...patch.visual␠},↵`. The test must fail.
- [x] 1.26 Add tests for `director-176`.
  Mutation: `M137` replaces `␠␠␠␠␠␠␠␠shot.layers[layerId]␠=␠normalizeLayerEntry(target);↵` with `␠␠␠␠␠␠␠␠shot.layers[layerId]␠=␠target;↵`. The test must fail.
- [x] 1.27 Add tests for `director-177`.
  Mutation: `M140` replaces `␠␠␠␠const␠nextReleaseLayerIds␠=␠[↵␠␠␠␠␠␠...new␠Set([↵␠␠␠␠␠␠␠␠...(scene.releaseLayerIds␠||␠[]),↵␠␠␠␠␠␠␠␠...(pack.releaseLayerIds␠||␠[]),↵␠␠␠␠␠␠]),↵␠␠␠␠];↵` with `␠␠␠␠const␠nextReleaseLayerIds␠=␠[...(scene.releaseLayerIds␠||␠[]),␠...(pack.releaseLayerIds␠||␠[])];↵`. The test must fail.
- [x] 1.28 Add tests for `director-178`.
  Mutation: `M079` replaces `␠␠␠␠␠␠␠␠return␠{␠appended:␠false,␠reason:␠'checkpoint-failed'␠};↵` with `␠␠␠␠␠␠␠␠return␠{␠appended:␠true␠};↵`. The test must fail.
- [x] 1.29 Add tests for `director-179`.
  Mutation: `M142` replaces `␠␠␠␠}↵␠␠␠␠this._selectedSceneId␠=␠scene.id;↵␠␠␠␠this._selectedShotId␠=␠appendedShots[0]?.id␠||␠this._selectedShotId;↵` with `␠␠␠␠}↵␠␠␠␠void␠0;↵␠␠␠␠this._selectedShotId␠=␠appendedShots[0]?.id␠||␠this._selectedShotId;↵`. The test must fail.
- [x] 1.30 Add tests for `director-180`.
  Mutation: `M084` replaces `␠␠␠␠this._selectedShotId␠=␠appendedShots[0]?.id␠||␠this._selectedShotId;↵␠␠␠␠this._saveProject();↵␠␠␠␠if␠(render)␠{↵` with `␠␠␠␠this._selectedShotId␠=␠appendedShots[0]?.id␠||␠this._selectedShotId;↵␠␠␠␠void␠0;↵␠␠␠␠if␠(render)␠{↵`. The test must fail.
- [x] 1.31 Add tests for `director-181`.
  Mutation: `M138` replaces `␠␠␠␠␠␠␠␠␠␠:␠`Appended␠${appendedShots.length}␠shots:␠${recipe.title}`,↵` with `␠␠␠␠␠␠␠␠␠␠:␠`Appended␠${0}␠shots:␠${recipe.title}`,↵`. The test must fail.
- [x] 1.32 Add tests for `director-182`.
  Mutation: `M150` replaces `␠␠␠␠␠␠version:␠targetVersion,↵` with `␠␠␠␠␠␠version:␠0,↵`. The test must fail.
- [x] 1.33 Add tests for `director-183`.
  Mutation: `M028` replaces `␠␠␠␠␠␠Array.isArray(recipe.adoptExistingShotTitles)↵` with `␠␠␠␠␠␠true↵`. The test must fail.
- [x] 1.34 Add tests for `director-184`.
  Mutation: `M078` replaces `␠␠␠␠␠␠␠␠␠␠␠␠nextShots.find((shot)␠=>␠shot.title␠===␠title)?.id,↵` with `␠␠␠␠␠␠␠␠␠␠␠␠undefined,↵`. The test must fail.
- [x] 1.35 Add tests for `director-185`.
  Mutation: `M090` replaces `␠␠␠␠if␠(writeCheckpoint)␠{↵` with `␠␠␠␠if␠(true)␠{↵`. The test must fail.

## 2. Gates and review

- [ ] 2.1 Run `make ratchet CHANGE=backfill-director-scene-packs`.
- [ ] 2.2 Run `make gates CHANGE=backfill-director-scene-packs`.
- [ ] 2.3 Get both review results with `/opsx:review backfill-director-scene-packs`.
- [ ] 2.4 Record the results in `review.md`.
