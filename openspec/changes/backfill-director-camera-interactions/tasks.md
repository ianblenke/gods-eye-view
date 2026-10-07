## Tests

Commit: `290b5d2cf65d614e39f42a0b3b24a53fc2514985`.

- [x] 1.1 Write tests for `director-041`.
  Mutation: `m001`. Change `src/director/camera.js` as follows. The test must fail.

  ```text
  Old:
  if (!camera) return null;
  New:
  if (!camera) return {};
  ```

- [x] 1.2 Write tests for `director-042`.
  Mutation: `m003`. Change `src/director/camera.js` as follows. The test must fail.

  ```text
  Old:
  : camera;
  New:
  : {};
  ```

- [x] 1.3 Write tests for `director-043`.
  Mutation: `m004`. Change `src/director/camera.js` as follows. The test must fail.

  ```text
  Old:
  id === camera.anchorId
  New:
  false
  ```

- [x] 1.4 Write tests for `director-044`.
  Mutation: `m008`. Change `src/director/camera.js` as follows. The test must fail.

  ```text
  Old:
  heading: camera.heading ?? 0
  New:
  heading: camera.heading ?? 9
  ```

- [x] 1.5 Write tests for `director-045`.
  Mutation: `m014`. Change `src/director/camera.js` as follows. The test must fail.

  ```text
  Old:
  durationSec: shot.durationSec
  New:
  durationSec: 0
  ```

- [x] 1.6 Write tests for `director-046`.
  Mutation: `m015`. Change `src/director/camera.js` as follows. The test must fail.

  ```text
  Old:
  Math.max(0, Math.min(1, Number(progress) || 0))
  New:
  Math.min(1, Number(progress) || 0)
  ```

- [x] 1.7 Write tests for `director-047`.
  Mutation: `m021`. Change `src/director/camera.js` as follows. The test must fail.

  ```text
  Old:
  lat: lerp(from.lat, to.lat)
  New:
  lat: from.lat
  ```

- [x] 1.8 Write tests for `director-048`.
  Mutation: `m028`. Change `src/director/camera.js` as follows. The test must fail.

  ```text
  Old:
  4 * t ** 3
  New:
  t
  ```

- [x] 1.9 Write tests for `director-049`.
  Mutation: `m031`. Change `src/director/cameraDocument.js` as follows. The test must fail.

  ```text
  Old:
  number(value[key], `${path}.${key}`, ...range, legacy);
  New:
  if (key !== 'lat') number(value[key], `${path}.${key}`, ...range, legacy);
  ```

- [x] 1.10 Write tests for `director-050`.
  Mutation: `m040`. Change `src/director/cameraDocument.js` as follows. The test must fail.

  ```text
  Old:
  number(value[key], `${path}.${key}`, ...range, legacy);
  New:
  if (key !== 'heading') number(value[key], `${path}.${key}`, ...range, legacy);
  ```

- [x] 1.11 Write tests for `director-051`.
  Mutation: `m047`. Change `src/director/cameraDocument.js` as follows. The test must fail.

  ```text
  Old:
  coordinates(value, path, ORIENTATION, false, version < 3);
  New:
  coordinates(value, path, ORIENTATION, false, false);
  ```

- [x] 1.12 Write tests for `director-052`.
  Mutation: `m066`. Change `src/director/cameraDocument.js` as follows. The test must fail.

  ```text
  Old:
  if (!anchorIds.has(value.anchorId))
  New:
  if (false)
  ```

- [x] 1.13 Write tests for `director-053`.
  Mutation: `m032`. Change `src/director/cameraDocument.js` as follows. The test must fail.

  ```text
  Old:
  number(value[key], `${path}.${key}`, ...range, legacy);
  New:
  if (key !== 'lat') number(value[key], `${path}.${key}`, ...range, legacy);
  ```

- [x] 1.14 Write tests for `director-054`.
  Mutation: `m075`. Change `src/director/cameraDocument.js` as follows. The test must fail.

  ```text
  Old:
  if (!['linear', 'cubic-in-out'].includes(move.easing))
  New:
  if (false)
  ```

- [x] 1.15 Write tests for `director-055`.
  Mutation: `m061`. Change `src/director/cameraDocument.js` as follows. The test must fail.

  ```text
  Old:
  ...(version >= 4 ? ['altitudeReference'] : [])
  New:
  ...[]
  ```

- [x] 1.16 Write tests for `director-056`.
  Mutation: `m088`. Change `src/director/interactions/document.js` as follows. The test must fail.

  ```text
  Old:
  packs.get(item.target.packId)?.format !== 'geojson' ||
            !shot.dataPackIds?.includes(item.target.packId)
  New:
  !shot.dataPackIds?.includes(item.target.packId)
  ```

- [x] 1.17 Write tests for `director-057`.
  Mutation: `m096`. Change `src/director/interactions/document.js` as follows. The test must fail.

  ```text
  Old:
  !a || !Object.hasOwn(specs, a.type)
  New:
  !Object.hasOwn(specs, a.type)
  ```

- [x] 1.18 Write tests for `director-058`.
  Mutation: `m105`. Change `src/director/interactions/document.js` as follows. The test must fail.

  ```text
  Old:
  parsed.protocol !== 'https:' ||
                parsed.username ||
                parsed.password ||
                parsed.search ||
                parsed.hash
  New:
  parsed.username ||
                parsed.password ||
                parsed.search ||
                parsed.hash
  ```

- [x] 1.19 Write tests for `director-059`.
  Mutation: `m093`. Change `src/director/interactions/document.js` as follows. The test must fail.

  ```text
  Old:
  scene.anchors || []
  New:
  scene.anchors || [{id:'a'}]
  ```

- [x] 1.20 Write tests for `director-060`.
  Mutation: `m115`. Change `src/director/interactions/document.js` as follows. The test must fail.

  ```text
  Old:
  if (!target) fail(field, 'unknown shot');
  New:
  if (!target) return;
  ```

- [x] 1.21 Write tests for `director-061`.
  Mutation: `m121`. Change `src/director/interactions/document.js` as follows. The test must fail.

  ```text
  Old:
  Object.hasOwn(shot.layers || {}, a.layerId)
  New:
  a.layerId in (shot.layers || {})
  ```

- [x] 1.22 Write tests for `director-062`.
  Mutation: `m125`. Change `src/director/interactions/document.js` as follows. The test must fail.

  ```text
  Old:
  string(item.id, field);
  New:
  <empty>
  ```

- [x] 1.23 Write tests for `director-063`.
  Mutation: `m169`. Change `src/director/interactions/document.js` as follows. The test must fail.

  ```text
  Old:
  string(a.text, field, 4096);
  New:
  string(a.text, field, 4096); a.text = "changed";
  ```

- [x] 1.24 Write tests for `director-064`.
  Mutation: `m168`. Change `src/director/cameraDocument.js` as follows. The test must fail.

  ```text
  Old:
  pose(shot.camera, `${at}.camera`, version, anchorIds, true);
  New:
  pose(shot.camera, `${at}.camera`, version, anchorIds, true); shot.camera.heading = 99;
  ```

- [x] 1.25 Write tests for `director-065`.
  Mutation: `m133`. Change `src/director/interactions/session.js` as follows. The test must fail.

  ```text
  Old:
  active = false,
  New:
  active = true,
  ```

- [x] 1.26 Write tests for `director-066`.
  Mutation: `m134`. Change `src/director/interactions/session.js` as follows. The test must fail.

  ```text
  Old:
  active = !!actions.size;
  New:
  active = false;
  ```

- [x] 1.27 Write tests for `director-067`.
  Mutation: `m135`. Change `src/director/interactions/session.js` as follows. The test must fail.

  ```text
  Old:
  if (!active || busy || !item) return false;
  New:
  if (false) return false;
  ```

- [x] 1.28 Write tests for `director-068`.
  Mutation: `m136`. Change `src/director/interactions/session.js` as follows. The test must fail.

  ```text
  Old:
  !active || busy || !item
  New:
  !active || !item
  ```

- [x] 1.29 Write tests for `director-069`.
  Mutation: `m137`. Change `src/director/interactions/session.js` as follows. The test must fail.

  ```text
  Old:
  !active || busy || !item
  New:
  !active || busy
  ```

- [x] 1.30 Write tests for `director-070`.
  Mutation: `m138`. Change `src/director/interactions/session.js` as follows. The test must fail.

  ```text
  Old:
  busy = true;
  New:
  busy = false;
  ```

- [x] 1.31 Write tests for `director-071`.
  Mutation: `m139`. Change `src/director/interactions/session.js` as follows. The test must fail.

  ```text
  Old:
  (await Promise.race([work, cancelled])) !== false
  New:
  (await Promise.race([work, cancelled])) !== null
  ```

- [x] 1.32 Write tests for `director-072`.
  Mutation: `m140`. Change `src/director/interactions/session.js` as follows. The test must fail.

  ```text
  Old:
  } catch {
          return false;
  New:
  } catch {
          return true;
  ```

- [x] 1.33 Write tests for `director-073`.
  Mutation: `m142`. Change `src/director/interactions/session.js` as follows. The test must fail.

  ```text
  Old:
  if (current.signal.aborted) return false;
  New:
  <empty>
  ```

- [x] 1.34 Write tests for `director-074`.
  Mutation: `m144`. Change `src/director/interactions/session.js` as follows. The test must fail.

  ```text
  Old:
  if (controller === current) {
  New:
  if (true) {
  ```

- [x] 1.35 Write tests for `director-075`.
  Mutation: `m215`. Change `src/director/cameraDocument.js` as follows. The test must fail.

  ```text
  Old:
  ? ['anchorId']
  New:
  ? ['anchorId', 'lat']
  ```

## Gates and review

- [ ] 2.1 Run `make ratchet` for this change.
- [ ] 2.2 Run `make gates` for this change.
- [ ] 2.3 Get both agent reviews.
- [ ] 2.4 Record the verdict in `review.md`.
