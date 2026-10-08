## 1. Spec documents

- [x] 1.1 Write the delta spec.
- [x] 1.2 Write the proposal.
- [x] 1.3 Write the design.

## 2. Scenario tests

- [x] 2.1 Write the tests for `director-076`.
  Mutation: `m001` uses the code change below. The test must fail.

```text
Old:
/^[a-zA-Z0-9_-][a-zA-Z0-9_.-]*$/
New:
/^never$/
```

- [x] 2.2 Write the tests for `director-077`.
  Mutation: `m003` uses the code change below. The test must fail.

```text
Old:
pack.version !== 1
New:
false
```

- [x] 2.3 Write the tests for `director-078`.
  Mutation: `m005` uses the code change below. The test must fail.

```text
Old:
parsed.protocol !== 'https:'
New:
false
```

- [x] 2.4 Write the tests for `director-079`.
  Mutation: `m014` uses the code change below. The test must fail.

```text
Old:
!Number.isInteger(v)
New:
false
```

- [x] 2.5 Write the tests for `director-080`.
  Mutation: `m018` uses the code change below. The test must fail.

```text
Old:
p.bounds[0] >= p.bounds[2]
New:
false
```

- [x] 2.6 Write the tests for `director-081`.
  Mutation: `m022` uses the code change below. The test must fail.

```text
Old:
!anchorIds.has(p.anchorId)
New:
false
```

- [x] 2.7 Write the tests for `director-082`.
  Mutation: `m023` uses the code change below. The test must fail.

```text
Old:
seen.has(pack.id)
New:
false
```

- [x] 2.8 Write the tests for `director-083`.
  Mutation: `m027` uses the code change below. The test must fail.

```text
Old:
value?.type !== 'FeatureCollection'
New:
false
```

- [x] 2.9 Write the tests for `director-084`.
  Mutation: `m030` uses the code change below. The test must fail.

```text
Old:
feature?.type !== 'Feature'
New:
false
```

- [x] 2.10 Write the tests for `director-085`.
  Mutation: `m035` uses the code change below. The test must fail.

```text
Old:
!Array.isArray(p)
New:
false
```

- [x] 2.11 Write the tests for `director-086`.
  Mutation: `m045` uses the code change below. The test must fail.

```text
Old:
!Array.isArray(points)
New:
false
```

- [x] 2.12 Write the tests for `director-087`.
  Mutation: `m052` uses the code change below. The test must fail.

```text
Old:
g?.type === 'Polygon'
New:
true
```

- [x] 2.13 Write the tests for `director-088`.
  Mutation: `m058` uses the code change below. The test must fail.

```text
Old:
if (!packs.length) return true;
New:
if (!packs.length) return false;
```

- [x] 2.14 Write the tests for `director-089`.
  Mutation: `m063` uses the code change below. The test must fail.

```text
Old:
run.handles.splice(0).reverse()
New:
run.handles.splice(0)
```

- [x] 2.15 Write the tests for `director-090`.
  Mutation: `m065` uses the code change below. The test must fail.

```text
Old:
if (ended) late(value);
New:
if (ended) {}
```

- [x] 2.16 Write the tests for `director-091`.
  Mutation: `m068` uses the code change below. The test must fail.

```text
Old:
if (active === run) clear();
        if (superseded)
New:
clear();
        if (superseded)
```

- [x] 2.17 Write the tests for `director-092`.
  Mutation: `m071` uses the change below. The test must fail.

- [x] 2.18 Write the tests for `director-093`.
  Mutation: `m073` uses the code change below. The test must fail.

```text
Old:
!(bytes instanceof Uint8Array)
New:
false
```

- [x] 2.19 Write the tests for `director-094`.
  Mutation: `m082` uses the code change below. The test must fail.

```text
Old:
!['https:', 'http:'].includes(base.protocol)
New:
false
```

- [x] 2.20 Write the tests for `director-095`.
  Mutation: `m088` uses the code change below. The test must fail.

```text
Old:
cache: 'no-store'
New:
cache: 'default'
```

- [x] 2.21 Write the tests for `director-096`.
  Mutation: `m089` uses the code change below. The test must fail.

```text
Old:
offset += chunk.byteLength;
New:
offset = 0;
```

- [x] 2.22 Write the tests for `director-097`.
  Mutation: `m094` uses the code change below. The test must fail.

```text
Old:
if (!reader) throw new Error('Asset stream unavailable');
New:
if (!reader) return {};
```

- [x] 2.23 Write the tests for `director-098`.
  Mutation: `m099` uses the code change below. The test must fail.

```text
Old:
typeof text !== 'string'
New:
false
```

- [x] 2.24 Write the tests for `director-099`.
  Mutation: `m104` uses the code change below. The test must fail.

```text
Old:
typeof value !== 'string'
New:
false
```

- [x] 2.25 Write the tests for `director-100`.
  Mutation: `m113` uses the code change below. The test must fail.

```text
Old:
      !asset ||
New:
      false ||
```

- [x] 2.26 Write the tests for `director-101`.
  Mutation: `m119` uses the code change below. The test must fail.

```text
Old:
pack.source = { adapter: BUNDLE_SOURCE, path: entry.path };
New:
pack.source = { adapter: 'bad', path: entry.path };
```

- [x] 2.27 Write the tests for `director-102`.
  Mutation: `m120` uses the code change below. The test must fail.

```text
Old:
!(bytes instanceof Uint8Array)
New:
false
```

- [x] 2.28 Write the tests for `director-103`.
  Mutation: `m128` uses the code change below. The test must fail.

```text
Old:
let entry = known.get(key);
New:
let entry = null;
```

- [x] 2.29 Write the tests for `director-104`.
  Mutation: `m131` uses the code change below. The test must fail.

```text
Old:
assets = new Map(next);
New:
assets = next;
```

- [x] 2.30 Write the tests for `director-105`.
  Mutation: `m133` uses the code change below. The test must fail.

```text
Old:
!asset || asset.bytes.length > maxBytes
New:
asset.bytes.length > maxBytes
```

- [x] 2.31 Write the tests for `director-106`.
  Mutation: `m136` uses the code change below. The test must fail.

```text
Old:
file.name?.endsWith('.gevbundle.json')
New:
file.name.endsWith('.gevbundle.json')
```

- [x] 2.32 Write the tests for `director-107`.
  Mutation: `m139` uses the code change below. The test must fail.

```text
Old:
if (!signal) return Promise.resolve(work);
New:
if (!signal) return Promise.resolve(8);
```

- [x] 2.33 Write the tests for `director-108`.
  Mutation: `m145` uses the code change below. The test must fail.

```text
Old:
n + a.bytes.length
New:
n
```

- [x] 2.34 Write the tests for `director-109`.
  Mutation: `m147` uses the code change below. The test must fail.

```text
Old:
assets.has(pack.source.path)
New:
false
```

- [x] 2.35 Write the tests for `director-110`.
  Mutation: `m151` uses the code change below. The test must fail.

```text
Old:
!layers.has(id)
New:
true
```

## Corrections of review round 1

- [x] 5.1 Check the test of `m303`.
  Mutation: `m303` changes the code below. The test must fail.

```text
Old:
{64}
New:
{1,64}
```

- [x] 5.2 Check the test of `m304`.
  Mutation: `m304` changes the code below. The test must fail.

```text
Old:
{64}
New:
{64,}
```

- [x] 5.3 Check the test of `m305`.
  Mutation: `m305` changes the code below. The test must fail.

```text
Old:
/^[a-f0-9]{64}$/
New:
/[a-f0-9]{64}$/
```

- [x] 5.4 Check the test of `m306`.
  Mutation: `m306` changes the code below. The test must fail.

```text
Old:
/^[a-f0-9]{64}$/
New:
/^[a-f0-9]{64}/
```

- [x] 5.5 Check the test of `m307`.
  Mutation: `m307` changes the code below. The test must fail.

```text
Old:
[a-f0-9]
New:
[a-fA-F0-9]
```

- [x] 5.6 Check the test of `m308`.
  Mutation: `m308` changes the code below. The test must fail.

```text
Old:
p.bounds[0] >= p.bounds[2]
New:
p.bounds[0] > p.bounds[2]
```

- [x] 5.7 Check the test of `m309`.
  Mutation: `m309` changes the code below. The test must fail.

```text
Old:
p.bounds[1] >= p.bounds[3]
New:
p.bounds[1] > p.bounds[3]
```

- [x] 5.8 Check the test of `m310`.
  Mutation: `m310` changes the code below. The test must fail.

```text
Old:
i % 2 ? -90 : -180
New:
i % 2 ? -89 : -180
```

- [x] 5.9 Check the test of `m311`.
  Mutation: `m311` changes the code below. The test must fail.

```text
Old:
i % 2 ? -90 : -180
New:
i % 2 ? -90 : -179
```

- [x] 5.10 Check the test of `m312`.
  Mutation: `m312` changes the code below. The test must fail.

```text
Old:
i % 2 ? 90 : 180
New:
i % 2 ? 89 : 180
```

- [x] 5.11 Check the test of `m313`.
  Mutation: `m313` changes the code below. The test must fail.

```text
Old:
i % 2 ? 90 : 180
New:
i % 2 ? 90 : 179
```

- [x] 5.12 Check the test of `m314`.
  Mutation: `m314` changes the code below. The test must fail.

```text
Old:
Object.hasOwn(scene, 'dataPacks')
New:
'dataPacks' in scene
```

- [x] 5.13 Check the test of `m315`.
  Mutation: `m315` changes the code below. The test must fail.

```text
Old:
          false,
New:
          true,
```

- [x] 5.14 Check the test of `m316`.
  Mutation: `m316` changes the code below. The test must fail.

```text
Old:
-12000, 1e9, false
New:
-12000, 1e9, true
```

- [x] 5.15 Check the test of `m317`.
  Mutation: `m317` changes the code below. The test must fail.

```text
Old:
string(pack.attribution.text, `${path}.attribution.text`, 4096)
New:
string(pack.attribution.text, `${path}.attribution.text`, 4095)
```

- [x] 5.16 Check the test of `m318`.
  Mutation: `m318` changes the code below. The test must fail.

```text
Old:
string(pack.attribution.license, `${path}.attribution.license`, 4096)
New:
string(pack.attribution.license, `${path}.attribution.license`, 4095)
```

- [x] 5.17 Check the test of `m319`.
  Mutation: `m319` changes the code below. The test must fail.

```text
Old:
string(url, at, 2048)
New:
string(url, at, 2047)
```

- [x] 5.18 Check the test of `m320`.
  Mutation: `m320` changes the code below. The test must fail.

```text
Old:
string(value, path, 1024)
New:
string(value, path, 1023)
```

- [x] 5.19 Check the test of `m321`.
  Mutation: `m321` changes the code below. The test must fail.

```text
Old:
.every((part) => /^[a-zA-Z0-9_-][a-zA-Z0-9_.-]*$/.test(part))
New:
.every(() => true)
```

- [x] 5.20 Check the test of `m322`.
  Mutation: `m322` changes the code below. The test must fail.

```text
Old:
packs.length > PACK_LIMITS.packs
New:
packs.length >= PACK_LIMITS.packs
```

- [x] 5.21 Check the test of `m323`.
  Mutation: `m323` changes the code below. The test must fail.

```text
Old:
bytes.length > PACK_LIMITS.bytes
New:
bytes.length >= PACK_LIMITS.bytes
```

- [x] 5.22 Check the test of `m324`.
  Mutation: `m324` changes the code below. The test must fail.

```text
Old:
total > PACK_LIMITS.totalBytes
New:
total >= PACK_LIMITS.totalBytes
```

- [x] 5.23 Check the test of `m325`.
  Mutation: `m325` changes the code below. The test must fail.

```text
Old:
path: pack.source.path,
New:
path: 'wrong',
```

- [x] 5.24 Check the test of `m326`.
  Mutation: `m326` changes the code below. The test must fail.

```text
Old:
adapter({ pack, asset, anchors, signal: controller.signal })
New:
adapter({ pack, anchors, signal: controller.signal })
```

- [x] 5.25 Check the test of `m327`.
  Mutation: `m327` changes the code below. The test must fail.

```text
Old:
adapter({ pack, asset, anchors, signal: controller.signal })
New:
adapter({ pack, asset, anchors })
```

- [x] 5.26 Check the test of `m328`.
  Mutation: `m328` changes the code below. The test must fail.

```text
Old:
        clearTimeout(run.timer);
New:
        /* timer */
```

- [x] 5.27 Check the test of `m329`.
  Mutation: `m329` changes the code below. The test must fail.

```text
Old:

    clearTimeout(run.timer);
New:

    /* timer */
```

- [x] 5.28 Check the test of `m330`.
  Mutation: `m330` changes the code below. The test must fail.

```text
Old:
      packs.forEach((pack, i) =>
        validateDataPack(pack, `packs[${i}]`, anchorIds),
      );
New:

```

- [x] 5.29 Check the test of `m331`.
  Mutation: `m331` changes the code below. The test must fail.

```text
Old:
for (const handle of run.handles.splice(0).reverse()) handle.dispose();
New:
for (const handle of []) handle.dispose();
```

- [x] 5.30 Check the test of `m332`.
  Mutation: `m332` changes the code below. The test must fail.

```text
Old:
      packs.forEach((pack, i) =>
        validateDataPack(pack, `packs[${i}]`, anchorIds),
      );
      if (disposed || signal?.aborted) return false;
      if (!packs.length) return true;
      const controller = new AbortController();
      const run = {
        controller,
        handles: [],
        status: 'loading',
        detach: () => signal?.removeEventListener('abort', cancel),
      };
      const cancel = () => {
        if (active === run) clear();
      };
      active = run;
      signal?.addEventListener('abort', cancel, { once: true });
      run.timer = setTimeout(
        () => controller.abort(new Error('Asset load timed out')),
        timeoutMs,
      );
      let total = 0;
      try {
        for (const pack of packs) {

New:

      if (disposed || signal?.aborted) return false;
      if (!packs.length) return true;
      const controller = new AbortController();
      const run = {
        controller,
        handles: [],
        status: 'loading',
        detach: () => signal?.removeEventListener('abort', cancel),
      };
      const cancel = () => {
        if (active === run) clear();
      };
      active = run;
      signal?.addEventListener('abort', cancel, { once: true });
      run.timer = setTimeout(
        () => controller.abort(new Error('Asset load timed out')),
        timeoutMs,
      );
      let total = 0;
      try {
        for (const [i, pack] of packs.entries()) {
          validateDataPack(pack, `packs[${i}]`, anchorIds);

```

- [x] 5.31 Check the test of `m333`.
  Mutation: `m333` changes the code below. The test must fail.

```text
Old:
{ fatal: true }
New:
{}
```

- [x] 5.32 Check the test of `m334`.
  Mutation: `m334` changes the code below. The test must fail.

```text
Old:
value?.type
New:
value.type
```

- [x] 5.33 Check the test of `m335`.
  Mutation: `m335` changes the code below. The test must fail.

```text
Old:
feature?.id
New:
feature.id
```

- [x] 5.34 Check the test of `m336`.
  Mutation: `m336` changes the code below. The test must fail.

```text
Old:
feature?.type
New:
feature.type
```

- [x] 5.35 Check the test of `m337`.
  Mutation: `m337` changes the code below. The test must fail.

```text
Old:
g?.type === 'Point'
New:
g.type === 'Point'
```

- [x] 5.36 Check the test of `m338`.
  Mutation: `m338` changes the code below. The test must fail.

```text
Old:
g?.type === 'LineString'
New:
g.type === 'LineString'
```

- [x] 5.37 Check the test of `m339`.
  Mutation: `m339` changes the code below. The test must fail.

```text
Old:
g?.type === 'Polygon'
New:
g.type === 'Polygon'
```

- [x] 5.38 Check the test of `m340`.
  Mutation: `m340` changes the code below. The test must fail.

```text
Old:
fetchImpl = globalThis.fetch
New:
fetchImpl = undefined
```

- [x] 5.39 Check the test of `m341`.
  Mutation: `m341` changes the code below. The test must fail.

```text
Old:
bytes.length > PACK_LIMITS.bytes
New:
bytes.length >= PACK_LIMITS.bytes
```

- [x] 5.40 Check the test of `m342`.
  Mutation: `m342` changes the code below. The test must fail.

```text
Old:
total > PACK_LIMITS.totalBytes
New:
total >= PACK_LIMITS.totalBytes
```

- [x] 5.41 Check the test of `m343`.
  Mutation: `m343` changes the code below. The test must fail.

```text
Old:
value.length > Math.ceil(PACK_LIMITS.bytes / 3) * 4
New:
value.length >= Math.ceil(PACK_LIMITS.bytes / 3) * 4
```

- [x] 5.42 Check the test of `m344`.
  Mutation: `m344` changes the code below. The test must fail.

```text
Old:
file.size > limit
New:
file.size >= limit
```

- [x] 5.43 Check the test of `m345`.
  Mutation: `m345` changes the code below. The test must fail.

```text
Old:
file.size > limit
New:
file.size >= limit
```

- [x] 5.44 Check the test of `m346`.
  Mutation: `m346` changes the code below. The test must fail.

```text
Old:
      checkMime(asset.mimeType);
New:

```

- [x] 5.45 Check the test of `m347`.
  Mutation: `m347` changes the code below. The test must fail.

```text
Old:
array(input.assets, 'assets', SHARE_LIMITS.assets);
New:

```

- [x] 5.46 Check the test of `m348`.
  Mutation: `m348` changes the code below. The test must fail.

```text
Old:

    checkBytes(bytes, total);
New:

```

- [x] 5.47 Check the test of `m349`.
  Mutation: `m349` changes the code below. The test must fail.

```text
Old:
total > PACK_LIMITS.totalBytes
New:
total > PACK_LIMITS.totalBytes + 1
```

- [x] 5.48 Check the test of `m350`.
  Mutation: `m350` changes the code below. The test must fail.

```text
Old:
      checkAbort(signal);
      validateAssetPath(path);
New:
      validateAssetPath(path);
```

- [x] 5.49 Check the test of `m351`.
  Mutation: `m351` changes the code below. The test must fail.

```text
Old:
    checkAbort(signal);
    fields(entry
New:
    fields(entry
```

- [x] 5.50 Check the test of `m352`.
  Mutation: `m352` changes the code below. The test must fail.

```text
Old:
    checkAbort(signal);
    if (entry.sha256
New:
    if (entry.sha256
```

- [x] 5.51 Check the test of `m353`.
  Mutation: `m353` changes the code below. The test must fail.

```text
Old:
    checkAbort(signal);
    const key
New:
    const key
```

- [x] 5.52 Check the test of `m354`.
  Mutation: `m354` changes the code below. The test must fail.

```text
Old:
      checkAbort(signal);
      if (!asset)
New:
      if (!asset)
```

- [x] 5.53 Check the test of `m355`.
  Mutation: `m355` changes the code below. The test must fail.

```text
Old:
      checkAbort(signal);
      if (
        (pack.byteLength
New:
      if (
        (pack.byteLength
```

- [x] 5.54 Check the test of `m356`.
  Mutation: `m356` changes the code below. The test must fail.

```text
Old:
project.scenes.reduce((n, s) => n + s.shots.length, 0)
New:
project.scenes.length
```

- [x] 5.55 Check the test of `m357`.
  Mutation: `m357` changes the code below. The test must fail.

```text
Old:
n + s.shots.length
New:
n + 1
```

- [x] 5.56 Check the test of `m358`.
  Mutation: `m358` changes the code below. The test must fail.

```text
Old:
...new Set(
        project.scenes.flatMap((s) =>
          s.shots.flatMap((shot) => Object.keys(shot.layers || {})),
        ),
      )
New:
...project.scenes.flatMap((s) => s.shots.flatMap((shot) => Object.keys(shot.layers || {})))
```

- [x] 5.57 Check the test of `m359`.
  Mutation: `m359` changes the code below. The test must fail.

```text
Old:
string(pack.id, `${path}.id`)
New:
string(pack.id, `${path}.id`, 255)
```

- [x] 5.58 Check the test of `m360`.
  Mutation: `m360` changes the code below. The test must fail.

```text
Old:
string(pack.id, `${path}.id`)
New:
string(pack.id, `${path}.id`, 257)
```

- [x] 5.59 Check the test of `m361`.
  Mutation: `m361` changes the code below. The test must fail.

```text
Old:
string(pack.source.adapter, `${path}.source.adapter`)
New:
string(pack.source.adapter, `${path}.source.adapter`, 255)
```

- [x] 5.60 Check the test of `m362`.
  Mutation: `m362` changes the code below. The test must fail.

```text
Old:
string(pack.source.adapter, `${path}.source.adapter`)
New:
string(pack.source.adapter, `${path}.source.adapter`, 257)
```

- [x] 5.61 Check the test of `m363`.
  Mutation: `m363` changes the code below. The test must fail.

```text
Old:
string(pack.attribution.text, `${path}.attribution.text`, 4096)
New:
string(pack.attribution.text, `${path}.attribution.text`, 4097)
```

- [x] 5.62 Check the test of `m364`.
  Mutation: `m364` changes the code below. The test must fail.

```text
Old:
string(pack.attribution.license, `${path}.attribution.license`, 4096)
New:
string(pack.attribution.license, `${path}.attribution.license`, 4097)
```

- [x] 5.63 Check the test of `m365`.
  Mutation: `m365` changes the code below. The test must fail.

```text
Old:
string(url, at, 2048)
New:
string(url, at, 2049)
```

- [x] 5.64 Check the test of `m366`.
  Mutation: `m366` changes the code below. The test must fail.

```text
Old:
string(value, path, 1024)
New:
string(value, path, 1025)
```

- [x] 5.65 Check the test of `m367`.
  Mutation: `m367` changes the code below. The test must fail.

```text
Old:
assets.length >= SHARE_LIMITS.assets
New:
assets.length > SHARE_LIMITS.assets
```

- [x] 5.66 Check all title pairs in evidence.md.
- [x] 5.67 Check the complete mutation command output.

## 3. Gates and review

- [ ] 3.1 Run `make ratchet` for this change.
- [ ] 3.2 Run `make gates` for this change.
- [ ] 3.3 Get both review agent verdicts.
- [ ] 3.4 Write `review.md` from those verdicts.

## Corrections of review round 2

- [x] 6.1 Check the test of `m368`.
  Mutation: `m368` uses the change below. The test must fail.

```js
Old: Math.abs(p[0]) > 180
New: p[0] > 180
```

- [x] 6.2 Check the test of `m369`.
  Mutation: `m369` uses the change below. The test must fail.

```js
Old: Math.abs(p[1]) > 90
New: p[1] > 90
```

- [x] 6.3 Check the test of `m370`.
  Mutation: `m370` uses the change below. The test must fail.

```js
Old: Math.abs(p[0]) > 180
New: Math.abs(p[0]) >= 180
```

- [x] 6.4 Check the test of `m371`.
  Mutation: `m371` uses the change below. The test must fail.

```js
Old: Math.abs(p[1]) > 90
New: Math.abs(p[1]) >= 90
```

- [x] 6.5 Check the test of `m372`.
  Mutation: `m372` uses the change below. The test must fail.

```js
Old: ![2, 3].includes(p.length)
New: p.length < 2
```

- [x] 6.6 Check the test of `m373`.
  Mutation: `m373` uses the change below. The test must fail.

```js
Old: ![2, 3].includes(p.length)
New: p.length > 3
```

- [x] 6.7 Check the test of `m374`.
  Mutation: `m374` uses the change below. The test must fail.

```js
Old: /^[a-zA-Z0-9_-][a-zA-Z0-9_.-]*$/
New: /[a-zA-Z0-9_-][a-zA-Z0-9_.-]*$/
```

- [x] 6.8 Check the test of `m375`.
  Mutation: `m375` uses the change below. The test must fail.

```js
Old: /^[a-zA-Z0-9_-][a-zA-Z0-9_.-]*$/
New: /^[a-zA-Z0-9_-][a-zA-Z0-9_.-]*/
```

- [x] 6.9 Check the test of `m376`.
  Mutation: `m376` uses the change below. The test must fail.

```js
Old: number(v, at, 1, PACK_LIMITS.bytes, false)
New: number(v, at, 2, PACK_LIMITS.bytes, false)
```

- [x] 6.10 Check the test of `m377`.
  Mutation: `m377` uses the change below. The test must fail.

```js
Old: array(p.bounds, `${at}.bounds`, 4);
New: ;
```

- [x] 6.11 Check the test of `m378`.
  Mutation: `m378` uses the change below. The test must fail.

```js
Old: array(packs, `${path}.dataPacks`, PACK_LIMITS.packs);
New: array(packs, `${path}.dataPacks`, 9);
```

- [x] 6.12 Check the test of `m379`.
  Mutation: `m379` uses the change below. The test must fail.

```js
Old: array(packs, `${path}.dataPacks`, PACK_LIMITS.packs);
New: array(packs, `${path}.dataPacks`, 7);
```

- [x] 6.13 Check the test of `m380`.
  Mutation: `m380` uses the change below. The test must fail.

```js
Old: status: 'loading'
New: status: 'ready'
```

- [x] 6.14 Check the test of `m381`.
  Mutation: `m381` uses the change below. The test must fail.

```js
Old: maxBytes = PACK_LIMITS.bytes
New: maxBytes = PACK_LIMITS.bytes - 1
```

- [x] 6.15 Check the test of `m382`.
  Mutation: `m382` uses the change below. The test must fail.

```js
Old: text.length > SHARE_LIMITS.bytes
New: text.length >= SHARE_LIMITS.bytes
```

- [x] 6.16 Check the test of `m383`.
  Mutation: `m383` uses the change below. The test must fail.

```js
Old: new TextEncoder().encode(text).length > SHARE_LIMITS.bytes
  )
New: new TextEncoder().encode(text).length >= SHARE_LIMITS.bytes
  )
```

- [x] 6.17 Check the test of `m384`.
  Mutation: `m384` uses the change below. The test must fail.

```js
Old: return { project: parseSceneDocument(text), assets: new Map() };
New: return { project: JSON.parse(text), assets: new Map() };
```

- [x] 6.18 Check the test of `m385`.
  Mutation: `m385` uses the change below. The test must fail.

```js
Old: input?.format !== 'gev-scene-bundle'
New: input.format !== 'gev-scene-bundle'
```

- [x] 6.19 Check the test of `m386`.
  Mutation: `m386` uses the change below. The test must fail.

```js
Old: fields(input, '$', ['format', 'version', 'project', 'assets']);
New: ;
```

- [x] 6.20 Check the test of `m387`.
  Mutation: `m387` uses the change below. The test must fail.

```js
Old: const project = parseSceneDocument(JSON.stringify(input.project));
New: const project = structuredClone(input.project);
```

- [x] 6.21 Check the test of `m388`.
  Mutation: `m388` uses the change below. The test must fail.

```js
Old: array(input.assets, 'assets', SHARE_LIMITS.assets);
New: array(input.assets, 'assets', SHARE_LIMITS.assets - 1);
```

- [x] 6.22 Check the getter and resolver probe of `m389`.
  The probe compares both forms through the public API of the module.

```js
Old: const copy = parseSceneDocument(stringifySceneDocument(project));
New: const copy = JSON.parse(stringifySceneDocument(project));
```

- [x] 6.23 Check the test of `m390`.
  Mutation: `m390` uses the change below. The test must fail.

```js
Old: resolveAsset(pack, { signal })
New: resolveAsset(undefined, { signal })
```

- [x] 6.24 Check the test of `m391`.
  Mutation: `m391` uses the change below. The test must fail.

```js
Old: resolveAsset(pack, { signal })
New: resolveAsset(pack, {})
```

- [x] 6.25 Check the test of `m392`.
  Mutation: `m392` uses the change below. The test must fail.

```js
Old: if (new TextEncoder().encode(text).length > SHARE_LIMITS.bytes)
New: if (new TextEncoder().encode(text).length >= SHARE_LIMITS.bytes)
```

- [x] 6.26 Check the test of `m393`.
  Mutation: `m393` uses the change below. The test must fail.

```js
Old: asset.bytes.length > maxBytes
New: asset.bytes.length >= maxBytes
```

- [x] 6.27 Check the test of `m394`.
  Mutation: `m394` uses the change below. The test must fail.

```js
Old: adapter({ pack, asset, anchors, signal: controller.signal })
New: adapter({ asset, anchors, signal: controller.signal })
```

- [x] 6.28 Check the test of `m395`.
  Mutation: `m395` uses the change below. The test must fail.

```js
Old: adapter({ pack, asset, anchors, signal: controller.signal })
New: adapter({ pack, asset, signal: controller.signal })
```

- [x] 6.29 Check the test of `m396`.
  Mutation: `m396` uses the change below. The test must fail.

```js
Old: signal.addEventListener('abort', abort, { once: true });
New: signal.addEventListener('abort', abort);
```

- [x] 6.30 Check the test of `m397`.
  Mutation: `m397` uses the change below. The test must fail.

```js
Old:       (value) => {
        signal.removeEventListener('abort', abort);
New:       (value) => {
```

- [x] 6.31 Check the test of `m398`.
  Mutation: `m398` uses the change below. The test must fail.

```js
Old:       (error) => {
        signal.removeEventListener('abort', abort);
New:       (error) => {
```

- [x] 6.32 Check the test of `m399`.
  Mutation: `m399` uses the change below. The test must fail.

```js
Old: number(v, at, 1, PACK_LIMITS.bytes, false)
New: number(v, at, 1, PACK_LIMITS.bytes - 1, false)
```

- [x] 6.33 Check the test of `m400`.
  Mutation: `m400` uses the change below. The test must fail.

```js
Old: number(p.height, `${at}.height`, -12000, 1e9, false)
New: number(p.height, `${at}.height`, -11999, 1e9, false)
```

- [x] 6.34 Check the test of `m401`.
  Mutation: `m401` uses the change below. The test must fail.

```js
Old: number(p.height, `${at}.height`, -12000, 1e9, false)
New: number(p.height, `${at}.height`, -12000, 1e9 - 1, false)
```

- [x] 6.35 Check the test of `m402`.
  Mutation: `m402` uses the change below. The test must fail.

```js
Old: p[2] < -12000
New: p[2] <= -12000
```

- [x] 6.36 Check the test of `m403`.
  Mutation: `m403` uses the change below. The test must fail.

```js
Old: p[2] > 1e9
New: p[2] >= 1e9
```

- [x] 6.37 Check the test of `m404`.
  Mutation: `m404` uses the change below. The test must fail.

```js
Old:       signal.removeEventListener('abort', abort);
      reject(signal.reason);
New:       reject(signal.reason);
```

- [x] 6.38 Check the test of `m405`.
  Mutation: `m405` uses the change below. The test must fail.

```js
Old:         signal.removeEventListener('abort', abort);
        signal.aborted
New:         signal.aborted
```

- [x] 6.39 Check the test of `m406`.
  Mutation: `m406` uses the change below. The test must fail.

```js
Old:         signal.removeEventListener('abort', abort);
        reject(error);
New:         reject(error);
```

- [x] 6.40 Check the test of `m407`.
  Mutation: `m407` uses the change below. The test must fail.

```js
Old: signal.addEventListener('abort', abort, { once: true });
New: signal.addEventListener('abort', abort);
```

- [x] 6.41 Check the test of `m408`.
  Mutation: `m408` uses the change below. The test must fail.

```js
Old: const copy = parseSceneDocument(stringifySceneDocument(project));
New: const copy = structuredClone(project);
```

- [x] 6.42 Complete the automatic survivor table.
- [x] 6.43 Check all host results after the last test change.

## 7 Pass 4

- [x] 7.1 Reduce repeated work in the byte limit tests.
- [x] 7.2 Add scenario clauses for new input checks.
- [x] 7.3 Add tagged tests for observable mutations.
- [x] 7.4 Check every equivalent claim with a public function probe.
- [x] 7.5 Complete the automatic check of former survivors.
- [x] 7.6 Replace the hand operand table with the automatic audit.
- [x] 7.7 Record each survivor result.
- [x] 7.8 Check all test files without forced process exit.
- [x] 7.9 Check each production file for full host coverage.
- [x] 7.10 Check all hand mutation rows.
- [x] 7.11 Correct each real prose error.
- [x] 7.12 Check the final file scope.

## 8 Pass 5

- [x] 8.1 Add tests for long invalid JSON text.
- [x] 8.2 Add tests for the standard base64 alphabet.
- [x] 8.3 Check snapshot keys and bytes.
- [x] 8.4 Check project validation before the resolver call.
- [x] 8.5 Check path segments with _ and - at the start.
- [x] 8.6 Check every equivalent probe across its public input limits.
- [x] 8.7 Correct all review prose findings.
- [x] 8.8 Extend the mutation tool classes.
- [x] 8.9 Complete the extension mutation check.
- [x] 8.10 Check the former survivors after the test changes.
- [x] 8.11 Check all hand mutation rows.
- [x] 8.12 Check all three test files.
- [x] 8.13 Check coverage for each production file.
- [x] 8.14 Check prose and test titles.
- [x] 8.15 Check the format.
- [x] 8.16 Check the production file diff.
- [x] 8.17 Record the final evidence.

## 9. Corrections of review round 4

- [x] 9.1 Add tests with later items for `director-076`, `director-077`, `director-079`, `director-080`, `director-081` and `director-082`.
- [x] 9.2 Add tests with later items for `director-084`, `director-085`, `director-086` and `director-087`.
- [x] 9.3 Add tests with later items for `director-088`, `director-093` and `director-094`.
- [x] 9.4 Add tests with later items for `director-099`, `director-101`, `director-102`, `director-104` and `director-107`.
- [x] 9.5 Add tests with later items for `director-108` and `director-110`.
- [x] 9.6 Strengthen the stored invalid path test for `director-105`.
- [x] 9.7 Correct test titles for `director-089`, `director-090`, `director-091`, `director-092`, `director-097`, `director-098` and `director-106`.
- [x] 9.8 Add hand rows m409 to m448.
- [x] 9.9 Correct the scenario text.
- [x] 9.10 Build the loop table.
- [x] 9.11 Correct the run names in audit.md and evidence.md.
- [x] 9.12 Regenerate the killer titles from the final rerun after pass 5.
- [x] 9.13 Record the title corrections.
- [x] 9.14 Correct the probe prose.
- [x] 9.15 Run the test files.
- [x] 9.16 Check host coverage.
- [x] 9.17 Run the complete hand mutation list.
- [x] 9.18 Run the prose checks.
- [x] 9.19 Check format.
- [x] 9.20 Check the production diff.

The lead runs the image gates, ratchet and review round 5.

## 10. Corrections of review round 5

Source commit: `0bf26a8ec20c1f6685f25e4f7ec57bb113204822`.

The loop table lists 52 collection traversals in six of the seven source files.

- [x] 10.1 Add the two-layer test for `director-110`.
- [x] 10.2 Add the two-registry test for `director-088` and `director-093`.
- [x] 10.3 Add allowed-field tests for `director-077`, `director-078`, `director-080`, `director-081` and `director-099`.
- [x] 10.4 Add positive byte tests for `director-099`.
- [x] 10.5 Add configured source and layer tests for `director-109` and `director-110`.
- [x] 10.6 Correct titles for `director-076`, `director-082`, `director-085`, `director-089`, `director-096`, `director-097`, `director-098`, `director-102`, `director-105`, `director-106`, `director-107` and `director-108`.
- [x] 10.7 Correct scenario clauses.
- [x] 10.8 Add hand rows m449 to m479.
- [x] 10.9 Regenerate the traversal table.
- [x] 10.10 Regenerate the killer titles from the saved results.
- [x] 10.11 Correct the review prose.
- [x] 10.12 Run each test file.
- [x] 10.13 Measure each source file for coverage.
- [x] 10.14 Run the complete hand list.
- [x] 10.15 Run the prose checks.
- [x] 10.16 Check format.
- [x] 10.17 Check the production diff.
- [x] 10.18 Commit the correction.


## 11. Correct round 6 findings

- [x] 11.1 Write the Pass 8 glossary.
- [x] 11.2 Correct the test actors and outcomes.
- [x] 11.3 Correct the scenario results.
- [x] 11.4 Correct the document labels.
- [x] 11.5 Record every closed-set limit.
- [x] 11.6 Name each killer test in the loop table.
- [x] 11.7 Check every title and scenario result.
- [x] 11.8 Check all title echoes.
- [x] 11.9 Run each test file alone.
- [x] 11.10 Measure each production file.
- [x] 11.11 Run all hand mutations.
- [x] 11.12 Run the prose checks.
- [x] 11.13 Run the title scan.
- [x] 11.14 Check the source format.
- [x] 11.15 Compare the production files.
- [x] 11.16 Check the OpenSpec change.
- [x] 11.17 Compare every document heading.
- [x] 11.18 Record the Pass 8 evidence.
- [x] 11.19 Commit the corrections.
