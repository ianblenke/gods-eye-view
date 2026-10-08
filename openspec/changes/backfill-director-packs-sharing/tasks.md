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
  Mutation: Apply `m071`: replace `!source` with `false`. The size read test must fail.

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
