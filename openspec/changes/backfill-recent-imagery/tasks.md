## 1. The spec

- [x] 1.1 Write the spec before you write the tests.

## 2. Tests and mutations

The change has 52 scenarios, 434 tests and 877 mutation checks.

The test declaration sweep finds 433 declarations; the path loop gives 434 tests.
The scenario heading sweep finds 52 scenarios.
The `untracedTests` entries in `openspec/trace/gaps.json` give 93 old tests.
The entries in `muts.json` and `muts3.json` give 828 and 49 mutation checks, for a total of 877.


- [x] 2.1 Add tests for `recent-imagery-001`.
  - Mutation: In `src/layers/recentImagery/catalog.js`, replace the first block with the second block. The test must fail.

```js
cloud: finiteOrNull(cloud),
```

```js
cloud: null,
```

- [x] 2.2 Add tests for `recent-imagery-002`.
  - Mutation: In `src/layers/recentImagery/catalog.js`, replace the first block with the second block. The test must fail.

```js
const CMR_PAGE_SIZE = 200;
```

```js
const CMR_PAGE_SIZE = 201;
```

- [x] 2.3 Add tests for `recent-imagery-003`.
  - Mutation: In `src/layers/recentImagery/catalog.js`, replace the first block with the second block. The test must fail.

```js
const products = ['S30', 'L30'];
```

```js
const products = ['S30'];
```

- [x] 2.4 Add tests for `recent-imagery-004`.
  - Mutation: In `src/layers/recentImagery/catalog.js`, replace the first block with the second block. The test must fail.

```js
if (!Number.isFinite(nowMs)) throw new TypeError('A valid clock is required');
```

```js
if (false) throw new TypeError('A valid clock is required');
```

- [x] 2.5 Add tests for `recent-imagery-005`.
  - Mutation: In `src/layers/recentImagery/catalog.js`, replace the first block with the second block. The test must fail.

```js
const CMR_MAX_RECORDS = 2000;
```

```js
const CMR_MAX_RECORDS = 1800;
```

- [x] 2.6 Add tests for `recent-imagery-006`.
  - Mutation: In `src/layers/recentImagery/model.js`, replace the first block with the second block. The test must fail.

```js
if (east === west || north === south)
```

```js
if (false)
```

- [x] 2.7 Add tests for `recent-imagery-007`.
  - Mutation: In `src/layers/recentImagery/model.js`, replace the first block with the second block. The test must fail.

```js
const FIT_VIEW_KM = 400;
```

```js
const FIT_VIEW_KM = 200;
```

- [x] 2.8 Add tests for `recent-imagery-008`.
  - Mutation: In `src/layers/recentImagery/model.js`, replace the first block with the second block. The test must fail.

```js
const PIN_BOX_SIDE_KM = 10;
```

```js
const PIN_BOX_SIDE_KM = 20;
```

- [x] 2.9 Add tests for `recent-imagery-009`.
  - Mutation: In `src/layers/recentImagery/model.js`, replace the first block with the second block. The test must fail.

```js
const QUANTUM = 100000;
```

```js
const QUANTUM = 10000;
```

- [x] 2.10 Add tests for `recent-imagery-010`.
  - Mutation: In `src/layers/recentImagery/model.js`, replace the first block with the second block. The test must fail.

```js
if (!match || !isValidDay(match[2])) return null;
```

```js
if (!match) return null;
```

- [x] 2.11 Add tests for `recent-imagery-011`.
  - Mutation: In `src/layers/recentImagery/model.js`, replace the first block with the second block. The test must fail.

```js
if (candidate?.key && !byKey.has(candidate.key))
```

```js
if (candidate?.key)
```

- [x] 2.12 Add tests for `recent-imagery-012`.
  - Mutation: In `src/layers/recentImagery/model.js`, replace the first block with the second block. The test must fail.

```js
availability: 'unknown',
```

```js
availability: 'present',
```

- [x] 2.13 Add tests for `recent-imagery-013`.
  - Mutation: In `src/layers/recentImagery/model.js`, replace the first block with the second block. The test must fail.

```js
    ? 'full'
    : 'partial';
```

```js
    ? 'partial'
    : 'full';
```

- [x] 2.14 Add tests for `recent-imagery-014`.
  - Mutation: In `src/layers/recentImagery/model.js`, replace the first block with the second block. The test must fail.

```js
const coversBox = (c) => c.coverage !== 'partial';
```

```js
const coversBox = (c) => true;
```

- [x] 2.15 Add tests for `recent-imagery-015`.
  - Mutation: In `src/layers/recentImagery/model.js`, replace the first block with the second block. The test must fail.

```js
parts.push(product.sensor, `${product.resolutionM} m`);
```

```js
parts.push(product.sensor, `0 m`);
```

- [x] 2.16 Add tests for `recent-imagery-016`.
  - Mutation: In `src/layers/recentImagery/model.js`, replace the first block with the second block. The test must fail.

```js
/{z}/{y}/{x}.${spec.format}
```

```js
/{z}/{x}/{y}.${spec.format}
```

- [x] 2.17 Add tests for `recent-imagery-017`.
  - Mutation: In `src/layers/recentImagery/model.js`, replace the first block with the second block. The test must fail.

```js
  push(focus);
```

```js
  push(first);
```

- [x] 2.18 Add tests for `recent-imagery-018`.
  - Mutation: In `src/layers/recentImagery/rendering.js`, replace the first block with the second block. The test must fail.

```js
record.layer.alpha = record.alpha;
```

```js
record.layer.alpha = 0;
```

- [x] 2.19 Add tests for `recent-imagery-019`.
  - Mutation: In `src/layers/recentImagery/rendering.js`, replace the first block with the second block. The test must fail.

```js
record.collection.remove(record.layer, true);
```

```js
record.collection.remove(record.layer, false);
```

- [x] 2.20 Add tests for `recent-imagery-020`.
  - Mutation: In `src/layers/recentImagery/rendering.js`, replace the first block with the second block. The test must fail.

```js
if (host.collection && !destroyed) mount(slotId, record);
```

```js
if (false) mount(slotId, record);
```

- [x] 2.21 Add tests for `recent-imagery-021`.
  - Mutation: In `src/layers/recentImagery/rendering.js`, replace the first block with the second block. The test must fail.

```js
if (admission.inFlight >= admission.limit) return undefined;
```

```js
if (false) return undefined;
```

- [x] 2.22 Add tests for `recent-imagery-022`.
  - Mutation: In `src/layers/recentImagery/rendering.js`, replace the first block with the second block. The test must fail.

```js
if (retryTimer !== null) return;
```

```js
if (false) return;
```

- [x] 2.23 Add tests for `recent-imagery-023`.
  - Mutation: In `src/layers/recentImagery/thumbnails.js`, replace the first block with the second block. The test must fail.

```js
if (present === 'false') {
```

```js
if (false) {
```

- [x] 2.24 Add tests for `recent-imagery-024`.
  - Mutation: In `src/layers/recentImagery/thumbnails.js`, replace the first block with the second block. The test must fail.

```js
queue.sort((a, b) => a.priority - b.priority);
```

```js
queue.sort((a, b) => b.priority - a.priority);
```

- [x] 2.25 Add tests for `recent-imagery-025`.
  - Mutation: In `src/layers/recentImagery/thumbnails.js`, replace the first block with the second block. The test must fail.

```js
.sort((a, b) => a.touched - b.touched);
```

```js
.sort((a, b) => b.touched - a.touched);
```

- [x] 2.26 Add tests for `recent-imagery-026`.
  - Mutation: In `src/layers/recentImagery/thumbnails.js`, replace the first block with the second block. The test must fail.

```js
    if (cancelled || destroyed || entries.get(entry.key) !== entry) {
```

```js
    if (false) {
```

- [x] 2.27 Add tests for `recent-imagery-027`.
  - Mutation: In `src/layers/recentImagery/thumbnails.js`, replace the first block with the second block. The test must fail.

```js
      for (const entry of entries.values()) revokeImage(entry);
```

```js
      for (const entry of entries.values()) void entry;
```

- [x] 2.28 Add tests for `recent-imagery-028`.
  - Mutation: In `src/layers/recentImagery/index.js`, replace the first block with the second block. The test must fail.

```js
_refusalTarget = target;
```

```js
_refusalTarget = null;
```

- [x] 2.29 Add tests for `recent-imagery-029`.
  - Mutation: In `src/layers/recentImagery/index.js`, replace the first block with the second block. The test must fail.

```js
if (!_focusKey) autoPreview();
```

```js
if (false) autoPreview();
```

- [x] 2.30 Add tests for `recent-imagery-030`.
  - Mutation: In `src/layers/recentImagery/index.js`, replace the first block with the second block. The test must fail.

```js
if (next && _assigned[OTHER_SLOT[slot]] === next)
```

```js
if (false)
```

- [x] 2.31 Add tests for `recent-imagery-031`.
  - Mutation: In `src/layers/recentImagery/index.js`, replace the first block with the second block. The test must fail.

```js
_split = DEFAULT_SPLIT;
        clearSplitTimer();
```

```js
_split = 0.1;
        clearSplitTimer();
```

- [x] 2.32 Add tests for `recent-imagery-032`.
  - Mutation: In `src/layers/recentImagery/index.js`, replace the first block with the second block. The test must fail.

```js
if (shown.a || shown.b) acquireComparison();
```

```js
if (false) acquireComparison();
```

- [x] 2.33 Add tests for `recent-imagery-033`.
  - Mutation: In `src/layers/recentImagery/index.js`, replace the first block with the second block. The test must fail.

```js
const COMPARISON_IN_USE = 'Comparison in use by another scene';
```

```js
const COMPARISON_IN_USE = 'Bad';
```

- [x] 2.34 Add tests for `recent-imagery-034`.
  - Mutation: In `src/layers/recentImagery/index.js`, replace the first block with the second block. The test must fail.

```js
const automatic = controller.getSwitchOrigin?.() === 'automatic';
```

```js
const automatic = false;
```

- [x] 2.35 Add tests for `recent-imagery-035`.
  - Mutation: In `src/layers/recentImagery/index.js`, replace the first block with the second block. The test must fail.

```js
    const moved = syncHost();
```

```js
    const moved = false;
```

- [x] 2.36 Add tests for `recent-imagery-036`.
  - Mutation: In `src/layers/recentImagery/index.js`, replace the first block with the second block. The test must fail.

```js
_split = clampUnit(Number(params.split) / 100, _split);
```

```js
_split = 0.5;
```

- [x] 2.37 Add tests for `recent-imagery-037`.
  - Mutation: In `src/layers/recentImagery/index.js`, replace the first block with the second block. The test must fail.

```js
_sources[id] = Boolean(next[id]);
```

```js
_sources[id] = true;
```

- [x] 2.38 Add tests for `recent-imagery-038`.
  - Mutation: In `src/layers/recentImagery/index.js`, replace the first block with the second block. The test must fail.

```js
      _alpha = next;
```

```js
      _alpha = 1;
```

- [x] 2.39 Add tests for `recent-imagery-039`.
  - Mutation: In `src/layers/recentImagery/index.js`, replace the first block with the second block. The test must fail.

```js
if (pinned && availability(pinned) === 'empty') {
```

```js
if (false) {
```

- [x] 2.40 Add tests for `recent-imagery-040`.
  - Mutation: In `src/layers/recentImagery/index.js`, replace the first block with the second block. The test must fail.

```js
export const FOCUS_DEBOUNCE_MS = 250;
```

```js
export const FOCUS_DEBOUNCE_MS = 251;
```

- [x] 2.41 Add tests for `recent-imagery-041`.
  - Mutation: In `src/layers/recentImagery/index.js`, replace the first block with the second block. The test must fail.

```js
      _box = null;
      _boxError = null;
```

```js
      _box = _box;
      _boxError = null;
```

- [x] 2.42 Add tests for `recent-imagery-042`.
  - Mutation: In `src/layers/recentImagery/index.js`, replace the first block with the second block. The test must fail.

```js
(distance === bestDistance && index > previous)
```

```js
(distance === bestDistance && index < previous)
```

- [x] 2.43 Add tests for `recent-imagery-043`.
  - Mutation: In `src/ui/recentImagery.js`, replace the first block with the second block. The test must fail.

```js
const root = el('section', 'recent-imagery-readout');
```

```js
const root = el('section', 'bad');
```

- [x] 2.44 Add tests for `recent-imagery-044`.
  - Mutation: In `src/ui/recentImagery.js`, replace the first block with the second block. The test must fail.

```js
ab ? slotId.toUpperCase() : slotId === 'a' ? 'IMAGE' : 'VS',
```

```js
ab ? slotId.toUpperCase() : slotId === 'a' ? 'BAD' : 'VS',
```

- [x] 2.45 Add tests for `recent-imagery-045`.
  - Mutation: In `src/ui/recentImagery.js`, replace the first block with the second block. The test must fail.

```js
if (focus && !event.repeat) layer.preview(focus.key);
```

```js
if (focus) layer.preview(focus.key);
```

- [x] 2.46 Add tests for `recent-imagery-046`.
  - Mutation: In `src/ui/recentImagery.js`, replace the first block with the second block. The test must fail.

```js
if (snapshot.zoomToFit) return 'Zoom in or draw a smaller box';
```

```js
if (snapshot.zoomToFit) return 'Bad';
```

- [x] 2.47 Add tests for `recent-imagery-047`.
  - Mutation: In `src/ui/recentImagery.js`, replace the first block with the second block. The test must fail.

```js
basemap ? ['BASEMAP', 'The basemap', 'basemap'] : ['B', describe(b), 'B'],
```

```js
basemap ? ['BAD', 'The basemap', 'basemap'] : ['B', describe(b), 'B'],
```

- [x] 2.48 Add tests for `recent-imagery-048`.
  - Mutation: In `src/ui/recentImagery.js`, replace the first block with the second block. The test must fail.

```js
revokeObjectUrl(href);
```

```js
void href;
```

- [x] 2.49 Add tests for `recent-imagery-049`.
  - Mutation: In `src/ui/recentImagery.js`, replace the first block with the second block. The test must fail.

```js
title: 'Details',
```

```js
title: 'Bad',
```

- [x] 2.50 Add tests for `recent-imagery-050`.
  - Mutation: In `src/ui/recentImagery.js`, replace the first block with the second block. The test must fail.

```js
if ((Number(container.scrollTop) || 0) !== top) container.scrollTop = top;
```

```js
if (false) container.scrollTop = top;
```

- [x] 2.51 Add tests for `recent-imagery-051`.
  - Mutation: In `src/ui/recentImagery.js`, replace the first block with the second block. The test must fail.

```js
const end = start + (Number(card?.offsetWidth) || 0);
```

```js
const end = start + Number(card?.offsetWidth);
```

## 3. Checks

- [x] 3.1 Audit each compound condition and each loop key.
- [x] 3.2 Record the mutation of the size guard. It gives the same result.
- [x] 3.3 Check the host coverage limits with the gate image.

## 4. Gates and review

- [x] 4.1 Run the ratchet for this change.
- [x] 4.2 Run the gates for this change.
- [ ] 4.3 Run both review agents.
- [ ] 4.4 Record the tree and verdict in review.md.

## 5. Test helper

- [x] 5.1 Add tests for the response and day values of the helper, for `recent-imagery-052`.

Mutation: In `src/layers/recentImagery/testDoubles.mjs`, replace the first block with the second block. The test must fail.

```js
status = ok ? 200 : 500,
```

```js
status = true ? 200 : 500,
```

## 6. Round 3

- [x] 6.1 Check the twelve public API cases with the new tests.
- [x] 6.2 Check each new observable claim from the other mutation rows.
- [x] 6.3 Record each equivalent claim in the proposal and the audit.
- [x] 6.4 Change the tag of the test doubles to `recent-imagery-052`.
- [x] 6.5 Correct the timer title.
- [x] 6.6 Remove the weaker opacity subscriber test.
- [x] 6.7 Run the host test, mutation, coverage, prose and format checks.
