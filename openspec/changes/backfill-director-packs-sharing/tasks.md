## 1. Spec documents

- [x] 1.1 Write the delta spec.
- [x] 1.2 Write the proposal.
- [x] 1.3 Write the design.

## 2. Scenario tests

- [x] 2.1 Tag or write the tests for `director-076`.
  Mutation: Apply `m001` with the exact code change below. The test must fail.

```text
Old:
/^[a-zA-Z0-9_-][a-zA-Z0-9_.-]*$/
New:
/^never$/
```

- [x] 2.2 Tag or write the tests for `director-077`.
  Mutation: Apply `m003` with the exact code change below. The test must fail.

```text
Old:
pack.version !== 1
New:
false
```

- [x] 2.3 Tag or write the tests for `director-078`.
  Mutation: Apply `m005` with the exact code change below. The test must fail.

```text
Old:
parsed.protocol !== 'https:'
New:
false
```

- [x] 2.4 Tag or write the tests for `director-079`.
  Mutation: Apply `m014` with the exact code change below. The test must fail.

```text
Old:
!Number.isInteger(v)
New:
false
```

- [x] 2.5 Tag or write the tests for `director-080`.
  Mutation: Apply `m018` with the exact code change below. The test must fail.

```text
Old:
p.bounds[0] >= p.bounds[2]
New:
false
```

- [x] 2.6 Tag or write the tests for `director-081`.
  Mutation: Apply `m022` with the exact code change below. The test must fail.

```text
Old:
!anchorIds.has(p.anchorId)
New:
false
```

- [x] 2.7 Tag or write the tests for `director-082`.
  Mutation: Apply `m023` with the exact code change below. The test must fail.

```text
Old:
seen.has(pack.id)
New:
false
```

- [x] 2.8 Tag or write the tests for `director-083`.
  Mutation: Apply `m027` with the exact code change below. The test must fail.

```text
Old:
value?.type !== 'FeatureCollection'
New:
false
```

- [x] 2.9 Tag or write the tests for `director-084`.
  Mutation: Apply `m030` with the exact code change below. The test must fail.

```text
Old:
feature?.type !== 'Feature'
New:
false
```

- [x] 2.10 Tag or write the tests for `director-085`.
  Mutation: Apply `m035` with the exact code change below. The test must fail.

```text
Old:
!Array.isArray(p)
New:
false
```

- [x] 2.11 Tag or write the tests for `director-086`.
  Mutation: Apply `m045` with the exact code change below. The test must fail.

```text
Old:
!Array.isArray(points)
New:
false
```

- [x] 2.12 Tag or write the tests for `director-087`.
  Mutation: Apply `m052` with the exact code change below. The test must fail.

```text
Old:
g?.type === 'Polygon'
New:
true
```

- [x] 2.13 Tag or write the tests for `director-088`.
  Mutation: Apply `m058` with the exact code change below. The test must fail.

```text
Old:
if (!packs.length) return true;
New:
if (!packs.length) return false;
```

- [x] 2.14 Tag or write the tests for `director-089`.
  Mutation: Apply `m063` with the exact code change below. The test must fail.

```text
Old:
run.handles.splice(0).reverse()
New:
run.handles.splice(0)
```

- [x] 2.15 Tag or write the tests for `director-090`.
  Mutation: Apply `m065` with the exact code change below. The test must fail.

```text
Old:
if (ended) late(value);
New:
if (ended) {}
```

- [x] 2.16 Tag or write the tests for `director-091`.
  Mutation: Apply `m068` with the exact code change below. The test must fail.

```text
Old:
if (active === run) clear();
        if (superseded)
New:
clear();
        if (superseded)
```

- [x] 2.17 Tag or write the tests for `director-092`.
  Mutation: Apply `m071`: replace `!source` with `false`. The size read test must fail.

- [x] 2.18 Tag or write the tests for `director-093`.
  Mutation: Apply `m073` with the exact code change below. The test must fail.

```text
Old:
!(bytes instanceof Uint8Array)
New:
false
```

- [x] 2.19 Tag or write the tests for `director-094`.
  Mutation: Apply `m082` with the exact code change below. The test must fail.

```text
Old:
!['https:', 'http:'].includes(base.protocol)
New:
false
```

- [x] 2.20 Tag or write the tests for `director-095`.
  Mutation: Apply `m088` with the exact code change below. The test must fail.

```text
Old:
cache: 'no-store'
New:
cache: 'default'
```

- [x] 2.21 Tag or write the tests for `director-096`.
  Mutation: Apply `m089` with the exact code change below. The test must fail.

```text
Old:
offset += chunk.byteLength;
New:
offset = 0;
```

- [x] 2.22 Tag or write the tests for `director-097`.
  Mutation: Apply `m094` with the exact code change below. The test must fail.

```text
Old:
if (!reader) throw new Error('Asset stream unavailable');
New:
if (!reader) return {};
```

- [x] 2.23 Tag or write the tests for `director-098`.
  Mutation: Apply `m099` with the exact code change below. The test must fail.

```text
Old:
typeof text !== 'string'
New:
false
```

- [x] 2.24 Tag or write the tests for `director-099`.
  Mutation: Apply `m104` with the exact code change below. The test must fail.

```text
Old:
typeof value !== 'string'
New:
false
```

- [x] 2.25 Tag or write the tests for `director-100`.
  Mutation: Apply `m113` with the exact code change below. The test must fail.

```text
Old:
      !asset ||
New:
      false ||
```

- [x] 2.26 Tag or write the tests for `director-101`.
  Mutation: Apply `m119` with the exact code change below. The test must fail.

```text
Old:
pack.source = { adapter: BUNDLE_SOURCE, path: entry.path };
New:
pack.source = { adapter: 'bad', path: entry.path };
```

- [x] 2.27 Tag or write the tests for `director-102`.
  Mutation: Apply `m120` with the exact code change below. The test must fail.

```text
Old:
!(bytes instanceof Uint8Array)
New:
false
```

- [x] 2.28 Tag or write the tests for `director-103`.
  Mutation: Apply `m128` with the exact code change below. The test must fail.

```text
Old:
let entry = known.get(key);
New:
let entry = null;
```

- [x] 2.29 Tag or write the tests for `director-104`.
  Mutation: Apply `m131` with the exact code change below. The test must fail.

```text
Old:
assets = new Map(next);
New:
assets = next;
```

- [x] 2.30 Tag or write the tests for `director-105`.
  Mutation: Apply `m133` with the exact code change below. The test must fail.

```text
Old:
!asset || asset.bytes.length > maxBytes
New:
asset.bytes.length > maxBytes
```

- [x] 2.31 Tag or write the tests for `director-106`.
  Mutation: Apply `m136` with the exact code change below. The test must fail.

```text
Old:
file.name?.endsWith('.gevbundle.json')
New:
file.name.endsWith('.gevbundle.json')
```

- [x] 2.32 Tag or write the tests for `director-107`.
  Mutation: Apply `m139` with the exact code change below. The test must fail.

```text
Old:
if (!signal) return Promise.resolve(work);
New:
if (!signal) return Promise.resolve(8);
```

- [x] 2.33 Tag or write the tests for `director-108`.
  Mutation: Apply `m145` with the exact code change below. The test must fail.

```text
Old:
n + a.bytes.length
New:
n
```

- [x] 2.34 Tag or write the tests for `director-109`.
  Mutation: Apply `m147` with the exact code change below. The test must fail.

```text
Old:
assets.has(pack.source.path)
New:
false
```

- [x] 2.35 Tag or write the tests for `director-110`.
  Mutation: Apply `m151` with the exact code change below. The test must fail.

```text
Old:
!layers.has(id)
New:
true
```

## 3. Gates and review

- [ ] 3.1 Run `make ratchet` for this change.
- [ ] 3.2 Run `make gates` for this change.
- [ ] 3.3 Get both review agent verdicts.
- [ ] 3.4 Write `review.md` from those verdicts.
