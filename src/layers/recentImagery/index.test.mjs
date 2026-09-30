import test from 'node:test';
import assert from 'node:assert/strict';
import { NO_IMAGERY_HOST } from '../../maps/imageryHost.js';
import { acquireImageryComparison } from '../../maps/imageryComparison.js';
import { MapSourceController } from '../../maps/controller.js';
import { createDefaultMapSources } from '../../maps/defaultSources.js';
import { resetPointerOwnership } from '../../data/inputOwnership.js';
import { initImageryBoxTool } from '../../ui/imageryBoxTool.js';
import {
  FOCUS_DEBOUNCE_MS,
  MODES,
  SPLIT_PUBLISH_MS,
  createRecentImageryLayer,
} from './index.js';
import {
  BOX,
  CANDIDATES,
  boxToolFakes,
  candidate,
  fakeCatalog,
  fakeController,
  fakeRenderer,
  fakeThumbnails,
  manualTimers,
  settle,
} from './testDoubles.mjs';

const NOW = new Date('2026-09-21T15:00:00Z');
const LINK_BOX = {
  west: -9780000,
  south: 3020000,
  east: -9770000,
  north: 3030000,
};
const S18 = 'S30:2026-09-18';
const L16 = 'L30:2026-09-16';
const V21 = 'VIIRS:2026-09-21';
const V15 = 'VIIRS:2026-09-15';

/**
 * A photoreal map controller with the real lease (`acquireImageryComparison`):
 * one owner, an asynchronous stack switch and a restore on release. `stuck`
 * never leaves photoreal, so the lease fails. With `subscribable`, every
 * settled switch notifies its subscribers, as `MapSourceController` does,
 * after `onSettled(id)` has moved the host.
 */
function leasingController({ stuck = false, subscribable = false } = {}) {
  const subscribers = new Set();
  const controller = {
    calls: [],
    acquisitions: 0,
    _activeId: 'photoreal',
    _generation: 0,
    onSettled: null,
    getActiveId() {
      return this._activeId;
    },
    getSwitchGeneration() {
      return this._generation;
    },
    async setStack(id) {
      this.calls.push(['setStack', id]);
      const generation = ++this._generation;
      await settle();
      if (generation !== this._generation) return { status: 'superseded' };
      if (!stuck) this._activeId = id;
      this.onSettled?.(this._activeId);
      for (const listener of [...subscribers]) listener();
      return { status: 'ready', activeId: this._activeId };
    },
    acquireImageryComparison(options) {
      this.acquisitions += 1;
      return acquireImageryComparison(this, options);
    },
  };
  /** Tell every subscriber the (unchanged) switch settled again. */
  controller.notify = () => {
    for (const listener of [...subscribers]) listener();
  };
  if (subscribable)
    controller.subscribe = (listener) => {
      subscribers.add(listener);
      return () => subscribers.delete(listener);
    };
  return controller;
}

/** The layer manager's publish hook, recording what the layer adopts. */
function fakeDataManager(layerRef) {
  const adopted = [];
  return {
    adopted,
    adoptLayerParams(id, params, options) {
      const live = layerRef.layer.getParams();
      assert.ok(
        Object.entries(params).every(([key, value]) =>
          Object.is(live[key], value),
        ),
        'adopted params match the live params',
      );
      adopted.push([id, params, options.origin]);
      return true;
    },
  };
}

/**
 * The daily overview is off on a first run; the fixture turns it on so the
 * strip holds all four candidates unless told otherwise.
 */
function fixture({
  hostKind = 'globe',
  controller = fakeController(),
  viirs = true,
} = {}) {
  const renderer = fakeRenderer();
  const thumbnails = fakeThumbnails();
  const catalog = fakeCatalog();
  const timers = manualTimers();
  const hostState = { kind: hostKind };
  const collections = { none: null, globe: {}, tileset: {} };
  const layer = createRecentImageryLayer({
    catalog,
    renderer,
    thumbnails,
    host: () => ({
      collection: collections[hostState.kind],
      kind: hostState.kind,
    }),
    now: () => NOW,
    setTimeoutImpl: timers.setTimeoutImpl,
    clearTimeoutImpl: timers.clearTimeoutImpl,
  });
  if (viirs) layer.setSources({ viirs: true });
  const viewer = { camera: {} };
  const reasons = [];
  layer.subscribe((snapshot, reason) => reasons.push(reason));
  layer.init(viewer);
  if (controller) layer.attachMapStackController(controller);
  const dataManager = fakeDataManager({ layer });
  layer.attachDataManager(dataManager);
  const toolCalls = [];
  layer.setToolHandler(() => toolCalls.push('cancel'));
  /** Enable, select BOX and land the catalog. */
  const ready = async (candidates) => {
    layer.enable();
    layer.setBox(BOX);
    catalog.resolveLast(candidates);
    await settle();
  };
  const owned = () => renderer.getOwned();
  /** Slot keys and split directions, compactly. */
  const drapes = () => {
    const o = renderer.getOwned();
    return {
      a: o.a && `${o.a.key}|${o.a.splitDirection}`,
      b: o.b && `${o.b.key}|${o.b.splitDirection}`,
    };
  };
  return {
    layer,
    renderer,
    thumbnails,
    catalog,
    controller,
    dataManager,
    hostState,
    viewer,
    reasons,
    timers,
    toolCalls,
    ready,
    owned,
    drapes,
    snap: () => layer.getSnapshot(),
    diag: () => layer.diagnostics(),
  };
}

const settleTimes = async (count = 4) => {
  for (let i = 0; i < count; i += 1) await settle();
};

test('[recent-imagery-028] a refused box is loud, says its size and persists until a box succeeds; so does a tool refusal', async () => {
  const f = fixture();
  f.layer.enable();
  assert.equal(
    f.layer.setBox({ west: 0, south: 0, east: 20, north: 20 }),
    false,
  );
  assert.match(f.snap().boxError, /^Box is 2,226 km wide · limit 1,000 km$/);
  assert.equal(f.snap().error, null, 'a box refusal is not a layer error');
  assert.equal(f.catalog.searches.length, 0);
  assert.equal(
    f.layer.reportBoxRefusal('Select one side of the dateline'),
    true,
  );
  assert.equal(f.layer.reportBoxRefusal(''), false);
  f.layer.setSources({ viirs: false });
  assert.equal(f.snap().boxError, 'Select one side of the dateline');
  // A share-link box spanning the world is refused too, not read as a sliver.
  f.layer.setParams({
    west: -18000000,
    south: -8000000,
    east: 18000000,
    north: 8000000,
  });
  assert.match(f.snap().boxError, /^Box is [\d,]+ km wide/);
  assert.equal(f.snap().box, null);
  assert.equal(f.layer.setBox(BOX), true);
  assert.equal(f.snap().boxError, null);
});

test('[recent-imagery-029] a valid box searches and previews the START HERE day alone in IMAGE mode', async () => {
  const f = fixture();
  f.layer.enable();
  f.layer.setBox(BOX);
  assert.equal(f.snap().searching, true);
  assert.equal(f.catalog.searches[0].request.days, 30);
  f.catalog.resolveLast();
  await settle();
  const snapshot = f.snap();
  assert.equal(snapshot.searching, false);
  assert.equal(snapshot.mode, 'image');
  assert.equal(snapshot.candidates.length, 4);
  assert.deepEqual(snapshot.auto, {
    key: 'S30:2026-09-18',
    reason: 'clear',
    certain: true,
  });
  assert.deepEqual(snapshot.recommended, {
    key: 'S30:2026-09-18',
    reason: 'clear',
  });
  assert.equal(snapshot.focus.key, 'S30:2026-09-18', 'focus starts on it');
  assert.equal(snapshot.preview.key, 'S30:2026-09-18');
  assert.equal(snapshot.preview.slot, 'a');
  assert.equal(snapshot.preview.label, 'Sep 18 · Sentinel-2 · 30 m');
  assert.equal(snapshot.candidates[1].preview, true);
  const none = {
    key: null,
    candidate: null,
    label: null,
    sourceOff: false,
    drapable: false,
  };
  assert.deepEqual(snapshot.pins, { a: none, b: none });
  assert.deepEqual(snapshot.shown, {
    a: 'S30:2026-09-18',
    b: null,
    swipe: 'none',
  });
  assert.deepEqual(f.drapes(), { a: `${'S30:2026-09-18'}|none`, b: null });
  assert.equal(f.layer.getStats().count, 4);
  assert.ok(
    f.thumbnails.calls.some((c) => c[0] === 'ordered' && c[1].length === 4),
  );
  assert.deepEqual(
    f.dataManager.adopted.map(([, params]) => Object.keys(params)),
    [['west', 'south', 'east', 'north']],
    'the chosen box is published',
  );
  // The same box again is a no-op; a new box aborts the running search.
  f.layer.setBox(BOX);
  assert.equal(f.catalog.searches.length, 1);
  f.layer.setBox({ ...BOX, east: -97.6 });
  f.layer.setBox({ ...BOX, east: -97.5 });
  assert.equal(f.catalog.searches[1].request.signal.aborted, true);
  f.catalog.resolveLast();
  await settle();
  assert.equal(f.snap().preview.key, 'S30:2026-09-18');
});

test('[recent-imagery-029] the focused day is the enriched strip entry, never the raw catalog candidate', async () => {
  const f = fixture();
  await f.ready();
  f.thumbnails.setStatus(S18, 'present');
  let { focus, candidates, focusIndex } = f.snap();
  assert.equal(focus.preview, true);
  assert.equal(focus.pinned, null);
  assert.equal(focus.drapable, true);
  assert.equal(focus.thumbnail.status, 'present');
  assert.deepEqual(focus, candidates[focusIndex]);
  f.layer.setMode('ab');
  f.layer.setAssignment('a', S18);
  f.layer.setAssignment('b', L16);
  f.layer.focus(1);
  ({ focus } = f.snap());
  assert.equal(focus.key, 'S30:2026-09-18');
  assert.equal(focus.pinned, 'a');
  assert.equal(f.snap().candidates[2].pinned, 'b');
});

test('[recent-imagery-029] a catalog of partial-coverage days still yields a START HERE day, labelled partial', async () => {
  const f = fixture();
  await f.ready(
    CANDIDATES.map((c) =>
      c.product === 'VIIRS' ? c : { ...c, coverage: 'partial' },
    ),
  );
  assert.equal(f.snap().auto.reason, 'partial');
  assert.deepEqual(f.snap().recommended, {
    key: 'S30:2026-09-18',
    reason: 'partial',
  });
});

test('[recent-imagery-030] IMAGE: SHOW pins a day, focus stops moving the map, a second SHOW moves the pin and unpinning drops the layer at once', async () => {
  const f = fixture();
  await f.ready();
  assert.equal(f.layer.toggleAssignment('a', L16), true);
  assert.equal(f.snap().pins.a.key, 'L30:2026-09-16');
  assert.equal(f.snap().preview.key, null, 'the preview gives way');
  assert.deepEqual(f.drapes(), { a: `${'L30:2026-09-16'}|none`, b: null });
  assert.equal(f.snap().focus.key, 'L30:2026-09-16', 'focus follows the pin');
  // Focus no longer changes the map.
  f.thumbnails.setStatus(V15, 'present');
  f.layer.focus(3);
  assert.equal(f.timers.armed(), 0);
  assert.equal(f.layer.preview(V15), false, 'a click only focuses');
  assert.equal(f.snap().focus.key, 'VIIRS:2026-09-15');
  assert.deepEqual(f.drapes(), { a: `${'L30:2026-09-16'}|none`, b: null });
  // SHOW on another day moves the pin.
  f.layer.toggleAssignment('a', S18);
  assert.deepEqual(f.drapes(), { a: `${'S30:2026-09-18'}|none`, b: null });
  // SHOW again unpins; nothing replaces it until focus moves.
  assert.equal(f.layer.toggleAssignment('a', S18), true);
  assert.equal(f.snap().pins.a.key, null);
  assert.equal(f.renderer.ownedCount(), 0);
  f.layer.focus(2);
  f.timers.flush();
  assert.deepEqual(f.drapes(), { a: `${'L30:2026-09-16'}|none`, b: null });
  assert.equal(f.snap().preview.key, 'L30:2026-09-16');
  assert.deepEqual(
    f.dataManager.adopted.slice(1).map(([, params]) => params),
    [
      { a: 'L30:2026-09-16', b: null },
      { a: 'S30:2026-09-18', b: null },
      { a: null, b: null },
    ],
  );
  // Unknown, empty or off-source days cannot be pinned.
  assert.equal(f.layer.setAssignment('a', 'nope'), false);
  f.thumbnails.probe(V21, 'empty');
  assert.equal(f.layer.setAssignment('a', V21), false);
  assert.equal(f.layer.setAssignment('c', S18), false);
});

test('[recent-imagery-031] VS BASEMAP: the day swipes on the left with no second layer; the preview swipes too; the lease borrows Esri', async () => {
  const controller = leasingController();
  const f = fixture({ controller });
  await f.ready();
  await settleTimes();
  assert.equal(controller.getActiveId(), 'esri-imagery', 'a preview borrows');
  assert.equal(f.snap().borrowedEsri, true);
  assert.equal(f.layer.setMode('basemap'), true);
  assert.equal(f.layer.setMode('basemap'), false);
  assert.equal(f.snap().mode, 'basemap');
  assert.deepEqual(f.snap().shown, {
    a: 'S30:2026-09-18',
    b: null,
    swipe: 'basemap',
  });
  assert.equal(f.snap().comparison.active, true);
  assert.deepEqual(f.drapes(), { a: `${'S30:2026-09-18'}|left`, b: null });
  f.layer.setAssignment('a', L16);
  assert.deepEqual(f.drapes(), { a: `${'L30:2026-09-16'}|left`, b: null });
  assert.equal(f.renderer.ownedCount(), 1);
  assert.deepEqual(f.dataManager.adopted.at(-2)[1], { mode: 1 });
  // Back to IMAGE: the same pin, no divider.
  f.layer.setMode('image');
  assert.deepEqual(f.drapes(), { a: `${'L30:2026-09-16'}|none`, b: null });
  assert.equal(f.snap().comparison.active, false);
  assert.deepEqual(MODES, ['image', 'basemap', 'ab']);
});

test('[recent-imagery-030] A / B: A pins, the focused day previews as B against it, B pins, and a day is in one slot only', async () => {
  const f = fixture();
  await f.ready();
  f.controller.lease.settle();
  await settle();
  f.layer.setMode('ab');
  assert.deepEqual(
    f.drapes(),
    { a: `${'S30:2026-09-18'}|none`, b: null },
    'the preview fills A',
  );
  f.layer.setAssignment('a', S18);
  assert.deepEqual(f.drapes(), { a: `${'S30:2026-09-18'}|none`, b: null });
  assert.equal(f.snap().preview.key, null);
  // The next focus previews in B, behind the swipe.
  f.layer.focus(2);
  f.timers.flush();
  assert.equal(f.snap().preview.slot, 'b');
  assert.deepEqual(f.drapes(), {
    a: `${'S30:2026-09-18'}|left`,
    b: `${'L30:2026-09-16'}|right`,
  });
  assert.equal(f.snap().comparison.active, true);
  // Focus back on A's own card takes the B preview off.
  f.layer.focus(1);
  f.timers.flush();
  assert.deepEqual(f.drapes(), { a: `${'S30:2026-09-18'}|none`, b: null });
  f.layer.setAssignment('b', L16);
  assert.deepEqual(f.drapes(), {
    a: `${'S30:2026-09-18'}|left`,
    b: `${'L30:2026-09-16'}|right`,
  });
  // Pinning B's day as A moves it: A is L16, B is empty again.
  f.layer.setAssignment('a', L16);
  assert.deepEqual(
    [f.snap().pins.a.key, f.snap().pins.b.key],
    ['L30:2026-09-16', null],
  );
  assert.deepEqual(f.drapes(), { a: `${'L30:2026-09-16'}|none`, b: null });
  f.layer.setAssignment('b', S18);
  // B alone is a single image.
  f.layer.setAssignment('a', null);
  assert.deepEqual(f.drapes(), { a: null, b: `${'S30:2026-09-18'}|none` });
  // Pins survive a mode switch; B only drapes in A / B.
  f.layer.setAssignment('a', L16);
  f.layer.setMode('image');
  assert.deepEqual(f.drapes(), { a: `${'L30:2026-09-16'}|none`, b: null });
  f.layer.setMode('ab');
  assert.deepEqual(f.drapes(), {
    a: `${'L30:2026-09-16'}|left`,
    b: `${'S30:2026-09-18'}|right`,
  });
  assert.ok(f.renderer.peak() <= 2, 'never more than two layers');
});

test('[recent-imagery-031] the divider recentres on every new comparison but not while scrubbing the second day', async () => {
  const f = fixture();
  await f.ready();
  f.controller.lease.settle();
  await settle();
  f.layer.setMode('ab');
  f.layer.setAssignment('a', S18);
  f.layer.setAssignment('b', L16);
  f.layer.setSplit(0.8);
  assert.equal(f.timers.armed(), 1, 'split publish is debounced');
  assert.equal([...f.timers.pending.values()][0].ms, 400);
  f.timers.flush();
  assert.deepEqual(f.dataManager.adopted.at(-1)[1], { split: 80 });
  f.layer.setAssignment('b', null);
  assert.equal(f.snap().split, 0.8, 'one image keeps the last framing');
  f.layer.preview(L16);
  assert.equal(f.snap().shown.swipe, 'ab');
  assert.equal(f.snap().split, 0.5, 'a new comparison starts centred');
  f.layer.setSplit(0.3);
  f.thumbnails.setStatus(V15, 'present');
  f.layer.focus(3);
  f.timers.flush();
  assert.equal(f.snap().shown.b, 'VIIRS:2026-09-15');
  assert.equal(f.snap().split, 0.3, 'scrubbing B keeps the divider');
  f.layer.setMode('basemap');
  assert.equal(f.snap().split, 0.5, 'a new kind of comparison recentres');
});

test('[recent-imagery-031] SWAP trades the sides of a live divider, again restores, never publishes and resets on a new comparison or CLEAR', async () => {
  const f = fixture();
  await f.ready();
  f.controller.lease.settle();
  await settle();
  const directions = () => [
    f.owned().a?.splitDirection,
    f.owned().b?.splitDirection,
  ];
  // IMAGE mode: no swipe, nothing to swap.
  assert.equal(f.layer.swapSides(), false);
  assert.equal(f.snap().swapped, false);
  // VS BASEMAP: the image moves to the right half, the basemap shows left.
  f.layer.setMode('basemap');
  assert.deepEqual(directions(), ['left', undefined]);
  assert.equal(f.layer.swapSides(), true);
  assert.equal(f.snap().swapped, true);
  assert.deepEqual(directions(), ['right', undefined]);
  assert.equal(f.layer.swapSides(), true);
  assert.deepEqual(directions(), ['left', undefined]);
  // A / B: A moves right and B left; the divider position stays.
  f.layer.setMode('ab');
  f.layer.setAssignment('a', S18);
  f.layer.setAssignment('b', L16);
  f.layer.setSplit(0.3);
  const adopted = f.dataManager.adopted.length;
  f.layer.swapSides();
  assert.deepEqual(directions(), ['right', 'left']);
  assert.equal(f.snap().split, 0.3);
  assert.equal(f.dataManager.adopted.length, adopted, 'nothing published');
  assert.equal('swapped' in f.layer.getParams(), false, 'not in the link');
  // Unpinning B ends the comparison; the next one starts unswapped.
  f.layer.setAssignment('b', null);
  f.layer.preview(L16);
  assert.equal(f.snap().shown.swipe, 'ab');
  assert.equal(f.snap().swapped, false, 'a new comparison is unswapped');
  assert.deepEqual(directions(), ['left', 'right']);
  f.layer.swapSides();
  f.layer.clear();
  assert.equal(f.snap().swapped, false, 'CLEAR resets it');
});

test('[recent-imagery-032] any image on the map holds the Esri lease; the last image cleared hands Google 3D back', async () => {
  const controller = leasingController();
  const f = fixture({ controller });
  await f.ready();
  await settleTimes();
  assert.deepEqual(controller.calls, [['setStack', 'esri-imagery']]);
  f.layer.setAssignment('a', S18);
  f.layer.clearPreview();
  await settleTimes();
  assert.equal(controller.getActiveId(), 'esri-imagery', 'still showing A');
  f.layer.setAssignment('a', null);
  assert.equal(f.renderer.ownedCount(), 0);
  await settleTimes();
  assert.equal(controller.getActiveId(), 'photoreal');
  assert.equal(f.snap().borrowedEsri, false);
  // A new image borrows again; disable hands it back.
  f.layer.preview(L16);
  await settleTimes();
  assert.equal(controller.getActiveId(), 'esri-imagery');
  f.layer.disable();
  await settleTimes();
  assert.equal(controller.getActiveId(), 'photoreal');
});

test('[recent-imagery-033] a refused lease is guidance and the images still drape without a swipe', async () => {
  const f = fixture({ controller: fakeController({ refuse: true }) });
  await f.ready();
  f.layer.setMode('basemap');
  assert.equal(f.snap().error, 'Comparison in use by another scene');
  assert.deepEqual(f.drapes(), { a: `${'S30:2026-09-18'}|none`, b: null });
  f.layer.clearPreview();
  assert.equal(f.snap().error, null, 'nothing shown, nothing refused');
});

test('[recent-imagery-033] a lease that cannot reach the Esri map never shows the divider and says why', async () => {
  const f = fixture({ controller: leasingController({ stuck: true }) });
  await f.ready();
  f.layer.setMode('basemap');
  await settleTimes();
  assert.equal(f.snap().comparison.active, false);
  assert.equal(f.snap().error, 'Esri map unavailable · no swipe');
  assert.equal(f.owned().a.splitDirection, 'none');
});

test('[recent-imagery-032] unpin then pin before the release settles recovers the lease', async () => {
  const controller = leasingController();
  const f = fixture({ controller });
  await f.ready();
  f.layer.setMode('basemap');
  f.layer.setAssignment('a', S18);
  await settleTimes();
  assert.equal(controller.getActiveId(), 'esri-imagery');
  f.layer.setAssignment('a', null);
  assert.equal(f.diag().releasing, true);
  f.layer.setAssignment('a', L16);
  assert.equal(f.diag().lease, false, 'no lease while releasing');
  await settleTimes(8);
  assert.equal(f.diag().lease, true);
  assert.equal(f.snap().comparison.active, true);
  assert.equal(controller.getActiveId(), 'esri-imagery');
});

/**
 * A / B on Esri from Google 3D, with the host following the active stack:
 * Google 3D hides the globe (tileset host), every other stack is a globe.
 */
async function comparingOnEsri() {
  const controller = leasingController({ subscribable: true });
  const f = fixture({ controller, hostKind: 'tileset' });
  controller.onSettled = (id) => {
    f.hostState.kind = id === 'photoreal' ? 'tileset' : 'globe';
  };
  await f.ready();
  f.layer.setMode('ab');
  f.layer.setAssignment('a', S18);
  f.layer.setAssignment('b', L16);
  await settleTimes(8);
  assert.equal(controller.getActiveId(), 'esri-imagery');
  assert.equal(f.snap().comparison.active, true);
  assert.deepEqual(controller.calls, [['setStack', 'esri-imagery']]);
  return { controller, f };
}

test('[recent-imagery-034] a manual switch to Google 3D while a day is shown takes Esri back once and the divider stays', async () => {
  const { controller, f } = await comparingOnEsri();
  // The operator picks Google 3D by hand: the layer re-leases Esri at once.
  await controller.setStack('photoreal');
  await settleTimes(8);
  assert.deepEqual(controller.calls, [
    ['setStack', 'esri-imagery'],
    ['setStack', 'photoreal'],
    ['setStack', 'esri-imagery'],
  ]);
  assert.equal(controller.getActiveId(), 'esri-imagery');
  assert.equal(f.snap().shown.swipe, 'ab');
  assert.equal(f.snap().comparison.active, true);
  assert.equal(f.snap().comparison.suspended, false);
  assert.deepEqual(f.drapes(), {
    a: `${'S30:2026-09-18'}|left`,
    b: `${'L30:2026-09-16'}|right`,
  });
  assert.equal(
    f.snap().notice,
    'Imagery stays on Esri · CLEAR to use Google 3D',
  );
  assert.equal(f.snap().error, null);
  // Once per switch generation: a repeated notification is not a new
  // switch, and the re-lease's own switch landing on Google 3D (a fallback)
  // is not the operator's.
  controller.notify();
  controller._activeId = 'photoreal';
  controller.notify();
  await settleTimes(8);
  assert.equal(controller.calls.length, 3, 'no second re-lease');
  controller._activeId = 'esri-imagery';
  controller.notify();
  // Globe stacks just rebind: Esri → OSM keeps the swipe and switches nothing.
  await controller.setStack('osm');
  await settleTimes(8);
  assert.equal(controller.calls.length, 4);
  assert.equal(controller.getActiveId(), 'osm');
  assert.equal(f.snap().comparison.active, true);
  assert.deepEqual(f.drapes(), {
    a: `${'S30:2026-09-18'}|left`,
    b: `${'L30:2026-09-16'}|right`,
  });
});

test('[recent-imagery-032] CLEAR after a re-lease hands Google 3D back and does not take Esri again', async () => {
  const { controller, f } = await comparingOnEsri();
  await controller.setStack('photoreal');
  await settleTimes(8);
  assert.equal(controller.getActiveId(), 'esri-imagery');
  const acquisitions = controller.acquisitions;
  f.layer.clear();
  await settleTimes(8);
  assert.equal(controller.getActiveId(), 'photoreal');
  assert.deepEqual(controller.calls.at(-1), ['setStack', 'photoreal']);
  assert.equal(controller.calls.length, 4);
  assert.equal(controller.acquisitions, acquisitions, 'no new lease');
  assert.equal(f.diag().lease, false);
  assert.equal(f.snap().notice, 'Box and images cleared');
});

test('[recent-imagery-032] disable after a re-lease hands Google 3D back and does not take Esri again', async () => {
  const { controller, f } = await comparingOnEsri();
  await controller.setStack('photoreal');
  await settleTimes(8);
  const acquisitions = controller.acquisitions;
  f.layer.disable();
  await settleTimes(8);
  assert.equal(controller.getActiveId(), 'photoreal');
  assert.equal(controller.calls.length, 4);
  assert.equal(controller.acquisitions, acquisitions);
  assert.equal(f.diag().lease, false);
});

test('[recent-imagery-033] a re-lease refused by another owner says so, drapes without a swipe and does not loop', async () => {
  const { controller, f } = await comparingOnEsri();
  const acquire = controller.acquireImageryComparison;
  controller.acquireImageryComparison = function () {
    this.acquisitions += 1;
    throw new Error('Imagery comparison is already held by nepal');
  };
  await controller.setStack('photoreal');
  await settleTimes(8);
  assert.equal(controller.acquisitions, 2, 'one attempt');
  assert.equal(f.snap().error, 'Comparison in use by another scene');
  assert.notEqual(
    f.snap().notice,
    'Imagery stays on Esri · CLEAR to use Google 3D',
  );
  assert.equal(f.snap().comparison.active, false);
  assert.equal(f.owned().a.kind, 'tileset');
  assert.equal(f.owned().a.splitDirection, 'none');
  // More notifications and renders never try again.
  controller.notify();
  controller.notify();
  f.layer.setAlpha(0.5);
  f.layer.setMode('basemap');
  f.layer.setMode('ab');
  await settleTimes(8);
  assert.equal(controller.acquisitions, 2);
  assert.deepEqual(controller.calls.at(-1), ['setStack', 'photoreal']);
  controller.acquireImageryComparison = acquire;
});

test('[recent-imagery-033] without a lease (another owner held it first) a switch to Google 3D takes nothing', async () => {
  const controller = leasingController({ subscribable: true });
  const nepal = acquireImageryComparison(controller, { owner: 'nepal' });
  await nepal.ready;
  controller.calls.length = 0;
  const f = fixture({ controller, hostKind: 'tileset' });
  await f.ready();
  f.layer.setMode('basemap');
  assert.equal(f.snap().error, 'Comparison in use by another scene');
  await controller.setStack('photoreal');
  await settleTimes(8);
  assert.deepEqual(controller.calls, [['setStack', 'photoreal']]);
  assert.equal(f.snap().error, 'Comparison in use by another scene');
});

/**
 * The real `MapSourceController` on Google 3D over the default sources, with
 * Esri tiles that can fail after it activated (`failEsriTiles`) and an OSM
 * map that never activates, so a tile fallback recovers to Google 3D.
 * Every `setStack` (the layer's, the operator's, the fallback's) is
 * recorded in `calls`.
 */
function failingMapController() {
  const listeners = new Set();
  const esriErrors = {
    addEventListener(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
  const registry = createDefaultMapSources({ googleTileset: { show: true } });
  for (const source of registry.sources) {
    if (!source.imagery) continue;
    const id = source.descriptor.id;
    source.imagery =
      id === 'osm'
        ? async () => {
            throw new Error('OSM offline');
          }
        : async () => ({
            id,
            errorEvent:
              id === 'esri-imagery' ? esriErrors : { addEventListener() {} },
          });
    source.terrain = {
      id: 'keyless',
      create: async () => ({ provider: { id: 'terrain' } }),
    };
  }
  const viewer = {
    scene: {
      globe: { show: false },
      requestRender() {},
      frameState: {
        creditDisplay: {
          addStaticCredit() {},
          removeStaticCredit() {},
        },
      },
      primitives: { add() {}, remove() {} },
    },
    imageryLayers: { add() {}, remove() {} },
  };
  const controller = new MapSourceController(viewer, {
    registry,
    initialStack: 'photoreal',
    createImageryLayer: (provider) => ({ provider }),
    onError: () => {},
  });
  const calls = [];
  const setStack = controller.setStack.bind(controller);
  controller.setStack = (id, options) => {
    calls.push(id);
    return setStack(id, options);
  };
  const failEsriTiles = () => {
    for (const fn of [...listeners]) fn({});
    for (const fn of [...listeners]) fn({});
  };
  return { controller, calls, failEsriTiles };
}

for (const path of ['subscription', 'stats poll']) {
  test(`[recent-imagery-034] an automatic fallback to Google 3D drops the swipe instead of re-leasing Esri; a manual switch re-leases once (${path})`, async () => {
    const { controller, calls, failEsriTiles } = failingMapController();
    // Without `subscribe` the layer watches the map from the stats poll.
    const attached =
      path === 'subscription'
        ? controller
        : {
            getActiveId: () => controller.getActiveId(),
            getSwitchGeneration: () => controller.getSwitchGeneration(),
            getSwitchOrigin: () => controller.getSwitchOrigin(),
            acquireImageryComparison: (options) =>
              controller.acquireImageryComparison(options),
          };
    const f = fixture({ controller: attached, hostKind: 'tileset' });
    Object.defineProperty(f.hostState, 'kind', {
      get: () =>
        controller.getActiveId() === 'photoreal' ? 'tileset' : 'globe',
    });
    const watch = async () => {
      await settleTimes(8);
      if (path === 'stats poll') f.layer.getStats();
      await settleTimes(8);
    };
    await f.ready();
    f.layer.setMode('ab');
    f.layer.setAssignment('a', S18);
    f.layer.setAssignment('b', L16);
    await watch();
    assert.equal(controller.getActiveId(), 'esri-imagery');
    assert.equal(f.snap().comparison.active, true);
    assert.deepEqual(calls, ['esri-imagery']);

    // Esri tiles fail: the controller falls back to OSM, OSM cannot
    // activate, and it recovers to Google 3D. Nobody chose Google 3D, so
    // the layer lets the lease go and shows both days without a swipe.
    failEsriTiles();
    await watch();
    assert.deepEqual(calls, ['esri-imagery', 'osm'], 'no Esri retry');
    assert.equal(controller.getActiveId(), 'photoreal');
    assert.equal(controller.getSwitchOrigin(), 'automatic');
    assert.equal(f.diag().lease, false);
    assert.equal(f.diag().host, 'tileset');
    assert.equal(f.snap().shown.swipe, 'ab');
    assert.equal(f.snap().comparison.active, false);
    assert.deepEqual(f.drapes(), {
      a: `${'S30:2026-09-18'}|none`,
      b: `${'L30:2026-09-16'}|none`,
    });
    assert.equal(f.owned().a.kind, 'tileset');
    assert.equal(f.snap().error, 'Esri map unavailable · no swipe');
    assert.notEqual(
      f.snap().notice,
      'Imagery stays on Esri · CLEAR to use Google 3D',
    );
    // More polls, renders and dead Esri listeners never retry.
    failEsriTiles();
    f.layer.setAlpha(0.5);
    f.layer.setMode('basemap');
    f.layer.setMode('ab');
    await watch();
    assert.deepEqual(calls, ['esri-imagery', 'osm']);

    // The operator picks Google 3D by hand: that is answered once.
    await controller.setStack('photoreal');
    await watch();
    await watch();
    assert.deepEqual(calls, [
      'esri-imagery',
      'osm',
      'photoreal',
      'esri-imagery',
    ]);
    assert.equal(controller.getActiveId(), 'esri-imagery');
    assert.equal(f.diag().lease, true);
    assert.equal(f.snap().comparison.active, true);
    assert.deepEqual(f.drapes(), {
      a: `${'S30:2026-09-18'}|left`,
      b: `${'L30:2026-09-16'}|right`,
    });
    assert.equal(
      f.snap().notice,
      'Imagery stays on Esri · CLEAR to use Google 3D',
    );
    assert.equal(f.snap().error, null);
    controller.destroy();
  });
}

test('[recent-imagery-035] without a host the drapes hide and say so; the stats poll rebinds when no subscription exists', async () => {
  const f = fixture({ hostKind: 'none' });
  await f.ready();
  assert.equal(f.renderer.ownedCount(), 0);
  assert.equal(f.layer.getStats().error, NO_IMAGERY_HOST);
  assert.equal(f.snap().error, NO_IMAGERY_HOST);
  f.hostState.kind = 'tileset';
  assert.equal(f.layer.getStats().error, null);
  assert.equal(f.owned().a.kind, 'tileset');
});

test('[recent-imagery-035] a controller subscription moves the drape to the new host on every settled switch', async () => {
  const listeners = new Set();
  const controller = {
    ...fakeController(),
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
  const f = fixture({ controller });
  await f.ready();
  f.hostState.kind = 'tileset';
  f.layer.getStats();
  assert.equal(
    f.owned().a.kind,
    'globe',
    'the poll defers to the subscription',
  );
  const before = f.reasons.length;
  for (const listener of listeners) listener();
  assert.equal(f.owned().a.kind, 'tileset');
  assert.equal(f.reasons.length, before + 1, 'the panel re-renders');
  f.hostState.kind = 'globe';
  for (const listener of listeners) listener();
  assert.equal(f.owned().a.kind, 'globe');
  const quiet = f.reasons.length;
  for (const listener of listeners) listener();
  assert.equal(f.reasons.length, quiet, 'a no-op switch is quiet');
  f.layer.destroy();
  assert.equal(listeners.size, 0);
});

test('[recent-imagery-029] a catalog failure is exposed and leaves nothing draped', async () => {
  const f = fixture();
  f.layer.enable();
  f.layer.setBox(BOX);
  f.catalog.searches[0].reject(new Error('CMR down'));
  await settle();
  assert.equal(f.snap().error, 'CMR down');
  assert.equal(f.snap().candidates.length, 0);
  assert.equal(f.renderer.ownedCount(), 0);
});

test('[recent-imagery-036] share links restore the box, both pins, the mode and a non-default split once, without publishing back', async () => {
  const f = fixture();
  f.layer.setParams({ split: 50 });
  assert.equal(f.diag().splitFromLink, false, 'a stored default is not a link');
  f.layer.setParams({
    ...LINK_BOX,
    a: S18,
    b: L16,
    mode: 2,
    split: 30,
  });
  assert.equal(f.diag().splitFromLink, true);
  f.layer.enable();
  f.catalog.resolveLast();
  await settle();
  f.controller.lease.settle();
  await settle();
  assert.equal(f.snap().mode, 'ab');
  assert.deepEqual(f.drapes(), {
    a: `${'S30:2026-09-18'}|left`,
    b: `${'L30:2026-09-16'}|right`,
  });
  assert.equal(f.snap().auto, null, 'a restored pin is never auto');
  assert.equal(f.snap().focus.key, 'S30:2026-09-18');
  assert.equal(f.snap().split, 0.3, 'the link framing is honoured');
  assert.equal(f.diag().splitFromLink, false, 'and consumed');
  assert.deepEqual(f.layer.getParams(), {
    ...LINK_BOX,
    a: 'S30:2026-09-18',
    b: 'L30:2026-09-16',
    mode: 2,
    split: 30,
    viirs: true,
  });
  assert.deepEqual(f.dataManager.adopted, [], 'a restore publishes nothing');
  // String modes and junk.
  f.layer.setParams({ mode: 'basemap' });
  assert.equal(f.snap().mode, 'basemap');
  f.layer.setParams({ mode: 7 });
  assert.equal(f.snap().mode, 'basemap');
  // A pin repeated in both slots keeps A.
  f.layer.setParams({ a: L16, b: L16, mode: 2 });
  assert.deepEqual(
    [f.snap().pins.a.key, f.snap().pins.b.key],
    ['L30:2026-09-16', null],
  );
});

test('[recent-imagery-036] restored pins the catalog no longer lists are dropped and START HERE previews', async () => {
  const f = fixture();
  f.layer.setParams({ ...LINK_BOX, a: 'S30:2026-09-01', b: 'S30:2026-09-02' });
  f.layer.enable();
  f.catalog.resolveLast();
  await settle();
  assert.equal(f.snap().pins.a.key, null);
  assert.equal(f.snap().preview.key, 'S30:2026-09-18');
  assert.equal(f.snap().auto.reason, 'clear');
});

test('[recent-imagery-037] the data-panel row carries only the two source chips', async () => {
  const f = fixture({ viirs: false });
  await f.ready();
  const { chips } = f.layer.getRowControls();
  assert.deepEqual(
    chips.map(({ id, label, active, params }) => [id, label, active, params]),
    [
      ['hls', 'MORE DETAIL · 30 m', true, { hls: false }],
      ['viirs', 'DAILY OVERVIEW · 250 m', false, { viirs: true }],
    ],
  );
  f.layer.setParams(chips[1].params);
  assert.equal(f.layer.getRowControls().chips[1].active, true);
  assert.equal(f.layer.getParams().viirs, true);
});

test('[recent-imagery-028] USE VIEW takes the camera rectangle and refuses a view over the cap instead of shrinking it', () => {
  const f = fixture();
  f.layer.enable();
  assert.equal(f.layer.useCurrentView(), false);
  assert.equal(
    f.snap().boxError,
    'Point the camera at the ground to use the view',
  );
  const rad = (deg) => (deg * Math.PI) / 180;
  const view = (west, south, east, north) => () => ({
    west: rad(west),
    south: rad(south),
    east: rad(east),
    north: rad(north),
  });
  f.viewer.camera.computeViewRectangle = view(-97.8, 30.2, -97.7, 30.3);
  assert.equal(f.layer.useCurrentView(), true);
  assert.ok(Math.abs(f.snap().box.west + 97.8) < 1e-9);
  f.viewer.camera.computeViewRectangle = view(-108, 20, -88, 40);
  assert.equal(f.layer.useCurrentView(), false);
  assert.match(f.snap().boxError, /^View is 2,2\d\d km wide · limit 1,000 km$/);
  assert.equal(f.catalog.searches.length, 1, 'nothing searched');
  assert.ok(Math.abs(f.snap().box.west + 97.8) < 1e-9, 'the box is kept');
});

test('[recent-imagery-028] ZOOM IN: an oversized box or view flies top-down to its centre at the height whose view is 400 km wide', () => {
  const f = fixture();
  const flights = [];
  const deg = (rad) => (rad * 180) / Math.PI;
  const rad = (value) => (value * Math.PI) / 180;
  // A 1000 × 500 canvas with a 60° horizontal FOV.
  const fovy = 2 * Math.atan(Math.tan(Math.PI / 6) / 2);
  const expected = 400_000 / (2 * Math.tan(Math.PI / 6));
  let centreHit = null;
  Object.assign(f.viewer, {
    scene: {
      canvas: { clientWidth: 1000, clientHeight: 500 },
      ellipsoid: {
        cartographicToCartesian: (c) => ({ ...c, cartesian: true }),
        cartesianToCartographic: (c) => c && { ...c },
      },
    },
  });
  Object.assign(f.viewer.camera, {
    frustum: { fovy },
    flyTo: (options) => flights.push(options),
    pickEllipsoid: (position) => {
      assert.deepEqual(position, { x: 500, y: 250 }, 'the canvas centre');
      return centreHit;
    },
  });
  f.layer.enable();
  assert.equal(f.snap().zoomToFit, false);
  assert.equal(f.layer.zoomToFit(), null, 'nothing refused, nothing to fit');
  // A box over the cap: its centre.
  f.layer.setBox({ west: 0, south: 0, east: 20, north: 20 });
  assert.equal(f.snap().zoomToFit, true);
  const height = f.layer.zoomToFit();
  assert.ok(Math.abs(height - expected) < 1e-6, String(height));
  assert.equal(flights.length, 1);
  const [flight] = flights;
  assert.ok(Math.abs(deg(flight.destination.longitude) - 10) < 1e-9);
  assert.ok(Math.abs(deg(flight.destination.latitude) - 10) < 1e-9);
  assert.equal(flight.destination.height, height);
  assert.deepEqual(flight.orientation, {
    heading: 0,
    pitch: -Math.PI / 2,
    roll: 0,
  });
  assert.equal(flight.duration, 1.2);
  // A view over the cap: the ground under the canvas centre.
  f.viewer.camera.computeViewRectangle = () => ({
    west: rad(-108),
    south: rad(20),
    east: rad(-88),
    north: rad(40),
  });
  centreHit = { longitude: rad(-97), latitude: rad(31), height: 0 };
  assert.equal(f.layer.useCurrentView(), false);
  assert.equal(f.snap().zoomToFit, true);
  f.layer.zoomToFit();
  assert.ok(Math.abs(deg(flights[1].destination.longitude) + 97) < 1e-9);
  assert.ok(Math.abs(deg(flights[1].destination.latitude) - 31) < 1e-9);
  // Sky at the centre: the view rectangle's centre instead.
  centreHit = null;
  f.layer.useCurrentView();
  f.layer.zoomToFit();
  assert.ok(Math.abs(deg(flights[2].destination.longitude) + 98) < 1e-9);
  assert.ok(Math.abs(deg(flights[2].destination.latitude) - 30) < 1e-9);
  // The box tool's own oversized drag carries its box.
  f.layer.reportBoxRefusal('Box is 2,226 km wide · limit 1,000 km', {
    west: 0,
    south: 0,
    east: 20,
    north: 20,
  });
  assert.equal(f.snap().zoomToFit, true);
  // Other refusals and a box that succeeds offer nothing to fit.
  f.layer.reportBoxRefusal('Select one side of the dateline');
  assert.equal(f.snap().zoomToFit, false);
  f.layer.setBox({ west: 179, south: 0, east: -179, north: 1 });
  assert.equal(f.snap().zoomToFit, false);
  assert.equal(f.layer.zoomToFit(), null);
  f.layer.setBox({ west: 0, south: 0, east: 20, north: 20 });
  assert.equal(f.snap().zoomToFit, true);
  f.layer.setBox(BOX);
  assert.equal(f.snap().zoomToFit, false);
  assert.equal(f.layer.zoomToFit(), null);
  assert.equal(flights.length, 3);
});

test('[recent-imagery-038] alpha, split and visible range notify without re-rendering the row', async () => {
  const f = fixture();
  let rowRenders = 0;
  f.layer.setRowControlsListener(() => rowRenders++);
  await f.ready();
  const rows = rowRenders;
  f.layer.setAlpha(0.4);
  assert.deepEqual(f.renderer.calls.at(-1), ['alpha', 'b', 0.4]);
  assert.equal(f.owned().a.alpha, 1, 'the fake keeps the look it was given');
  f.layer.setSplit(0.25);
  f.layer.setVisibleRange(1, 3);
  assert.equal(f.thumbnails.calls.at(-1)[2].firstVisible, 1);
  assert.equal(rowRenders, rows);
  assert.deepEqual(f.reasons.slice(-2), ['alpha', 'split']);
  f.layer.setAlpha('bad');
  assert.equal(f.snap().alpha, 0.4);
});

test('[recent-imagery-032] disable releases the lease, hides the drapes and cancels the tool; pins come back on enable', async () => {
  const f = fixture();
  await f.ready();
  f.layer.setMode('basemap');
  f.layer.setAssignment('a', S18);
  f.controller.lease.settle();
  await settle();
  f.layer.disable();
  await settle();
  assert.equal(f.renderer.ownedCount(), 0);
  assert.deepEqual(f.controller.calls.at(-1), ['release']);
  assert.deepEqual(f.toolCalls, ['cancel']);
  assert.equal(f.snap().enabled, false);
  f.layer.enable();
  f.catalog.resolveLast();
  await settle();
  assert.equal(f.snap().pins.a.key, 'S30:2026-09-18');
  assert.equal(f.snap().shown.swipe, 'basemap');
  f.layer.destroy();
  assert.ok(f.renderer.calls.some((c) => c[0] === 'destroy'));
  assert.ok(f.thumbnails.calls.some((c) => c[0] === 'destroy'));
  assert.equal(f.layer.enable(), false);
});

test('[recent-imagery-039] an empty day never drapes: the automatic preview re-ranks, a pick is refused and an empty pin is unpinned', async () => {
  const f = fixture();
  await f.ready();
  const before = f.reasons.length;
  f.thumbnails.probe(S18, 'empty');
  assert.equal(f.snap().preview.key, 'L30:2026-09-16');
  assert.equal(f.snap().auto.reason, 'cloudy');
  assert.equal(f.owned().a.key, 'L30:2026-09-16');
  assert.deepEqual(f.reasons.slice(before), ['thumbnail', 'state']);
  f.thumbnails.probe(V15, 'empty');
  f.layer.setShowUnavailable(true);
  assert.equal(f.layer.preview(V15), false);
  assert.equal(f.diag().following, null, 'an empty day is not followed');
  assert.equal(f.owned().a.key, 'L30:2026-09-16', 'the previous preview stays');
  // A restored pin that resolves empty is unpinned.
  const g = fixture();
  g.layer.setParams({ ...LINK_BOX, a: S18, b: L16, mode: 2 });
  g.layer.enable();
  g.catalog.resolveLast();
  await settle();
  assert.equal(g.renderer.ownedCount(), 2);
  g.thumbnails.probe(S18, 'empty');
  assert.equal(g.snap().pins.a.key, null);
  assert.deepEqual(g.drapes(), { a: null, b: `${'L30:2026-09-16'}|none` });
});

test('[recent-imagery-039] an automatic overview that probes empty hands over to the next ranked day', async () => {
  const f = fixture();
  await f.ready([CANDIDATES[0], CANDIDATES[3]]);
  assert.equal(
    f.diag().following,
    'VIIRS:2026-09-21',
    'the newest overview is followed',
  );
  f.thumbnails.probe(V21, 'empty');
  assert.equal(
    f.diag().following,
    'VIIRS:2026-09-15',
    'the next overview takes over',
  );
  assert.equal(f.snap().preview.pending, 'VIIRS:2026-09-15');
  f.thumbnails.probe(V15, 'present');
  assert.deepEqual(f.drapes(), { a: `${'VIIRS:2026-09-15'}|none`, b: null });
});

test('[recent-imagery-039] a pinned day still being probed drapes once the probe says present', async () => {
  const f = fixture();
  f.layer.setParams({ ...LINK_BOX, a: V21, mode: 0 });
  f.layer.enable();
  f.catalog.resolveLast();
  await settle();
  assert.equal(f.snap().pins.a.key, 'VIIRS:2026-09-21');
  assert.equal(f.renderer.ownedCount(), 0, 'unknown days never drape');
  f.thumbnails.probe(V21, 'present');
  assert.deepEqual(f.drapes(), { a: `${'VIIRS:2026-09-21'}|none`, b: null });
});

/** Thirty daily VIIRS days, newest first, from NOW back. */
const dailyViirs = () =>
  Array.from({ length: 30 }, (_, back) =>
    candidate(
      'VIIRS',
      new Date(Date.UTC(2026, 8, 21 - back)).toISOString().slice(0, 10),
    ),
  );

test('[recent-imagery-039] restored pins outside the visible strip window are probed and swipe once present', async () => {
  const f = fixture();
  const days = dailyViirs();
  const newest = days[0].key;
  const older = days[25].key;
  assert.equal(older, 'VIIRS:2026-08-27');
  f.layer.setVisibleRange(0, 5);
  f.layer.setParams({ ...LINK_BOX, a: newest, b: older, mode: 2 });
  f.layer.enable();
  f.catalog.resolveLast(days);
  await settle();
  assert.ok(
    f.thumbnails.requested.includes(older),
    'the offscreen B pin is probed',
  );
  assert.deepEqual(
    f.thumbnails.requests.find(([key]) => key === older),
    [older, 0],
    'at the focused card priority',
  );
  f.thumbnails.probeRequested('present');
  f.controller.lease.settle();
  await settle();
  assert.deepEqual(f.snap().shown, { a: newest, b: older, swipe: 'ab' });
  assert.deepEqual(f.drapes(), { a: `${newest}|left`, b: `${older}|right` });
});

test('[recent-imagery-039] pinning an offscreen day probes it at once', async () => {
  const f = fixture();
  const days = dailyViirs();
  const older = days[25].key;
  f.layer.setVisibleRange(0, 5);
  await f.ready(days);
  f.layer.setMode('ab');
  assert.ok(!f.thumbnails.requested.includes(older), 'not probed yet');
  assert.equal(f.layer.setAssignment('b', older), true);
  assert.deepEqual(f.thumbnails.requests.at(-1), [older, 0]);
  f.thumbnails.probe(older, 'present');
  assert.equal(f.snap().shown.b, older);
});

test('[recent-imagery-037] turning a source off hides its cards and drapes, disarms its pending preview and labels its pins "Source off"', async () => {
  const f = fixture();
  await f.ready();
  f.layer.setMode('ab');
  f.layer.setAssignment('a', S18);
  f.thumbnails.setStatus(V21, 'present');
  f.layer.setAssignment('b', V21);
  f.layer.setAssignment('b', null);
  f.layer.focus(2);
  assert.equal(f.diag().pending, 'L30:2026-09-16');
  assert.equal(f.layer.setSources({ hls: false }), true);
  assert.equal(f.diag().pending, undefined);
  f.timers.flush();
  const snapshot = f.snap();
  assert.deepEqual(
    snapshot.candidates.map((c) => c.key),
    ['VIIRS:2026-09-21', 'VIIRS:2026-09-15'],
  );
  assert.equal(snapshot.pins.a.sourceOff, true);
  assert.equal(f.owned().a, null);
  assert.equal(f.layer.getParams().a, 'S30:2026-09-18', 'the link keeps it');
  f.layer.setSources({ hls: true });
  assert.equal(f.owned().a.key, 'S30:2026-09-18');
  assert.equal(f.layer.setSources({ hls: true }), false);
});

test('[recent-imagery-040] arrow focus previews the focused present day after the 250 ms debounce; only the last of a burst drapes', async () => {
  const f = fixture();
  await f.ready();
  f.thumbnails.setStatus(V15, 'present');
  f.layer.focus(2);
  assert.equal(f.snap().preview.key, 'S30:2026-09-18', 'not yet');
  assert.equal(f.snap().preview.pending, 'L30:2026-09-16');
  assert.equal(f.snap().candidates[2].pending, true);
  assert.equal([...f.timers.pending.values()][0].ms, 250);
  assert.equal(FOCUS_DEBOUNCE_MS, 250);
  f.layer.focus(3);
  assert.equal(f.timers.armed(), 1, 'a single timer');
  f.timers.flush();
  assert.equal(f.snap().preview.key, 'VIIRS:2026-09-15');
  assert.equal(f.snap().auto, null);
  assert.equal(f.renderer.ownedCount(), 1, 'never a second layer');
  // Focus back on the previewed day disarms everything.
  f.layer.focus(2);
  f.layer.focus(3);
  assert.equal(f.timers.armed(), 0);
  assert.equal(f.diag().pending, undefined);
});

test('[recent-imagery-040] an unprobed day never drapes; a followed one previews once the probe says present, unless focus moved on', async () => {
  const f = fixture();
  await f.ready();
  f.layer.focus(0);
  assert.equal(f.timers.armed(), 0, 'no debounce for an unconfirmed day');
  assert.equal(f.diag().following, 'VIIRS:2026-09-21');
  f.thumbnails.probe(V21, 'present');
  assert.equal(f.snap().preview.key, 'VIIRS:2026-09-21');
  assert.equal(f.diag().following, null);
  // A click on an unknown day is followed too; moving focus away forgets it.
  assert.equal(f.layer.preview(V15), false);
  assert.equal(f.diag().following, 'VIIRS:2026-09-15');
  f.layer.focus(2);
  f.timers.flush();
  f.thumbnails.probe(V15, 'present');
  assert.equal(f.snap().preview.key, 'L30:2026-09-16', 'not followed');
});

test('[recent-imagery-040] a card click previews at once; a repeat click is a no-op and focus follows', async () => {
  const f = fixture();
  await f.ready();
  const shows = () => f.renderer.calls.filter((c) => c[0] === 'show').length;
  const before = shows();
  assert.equal(f.layer.preview(L16), true);
  assert.equal(f.snap().focus.key, 'L30:2026-09-16');
  assert.equal(f.owned().a.key, 'L30:2026-09-16');
  f.layer.preview(L16);
  assert.equal(shows(), before + 1, 'no redraw');
  assert.equal(f.layer.preview('nope'), false);
});

test('[recent-imagery-041] Escape order: clearPreview takes the preview off and keeps pins; nothing to clear says so', async () => {
  const f = fixture();
  await f.ready();
  assert.equal(f.layer.clearPreview(), true);
  assert.equal(f.renderer.ownedCount(), 0);
  assert.equal(f.snap().preview.key, null);
  assert.equal(f.layer.clearPreview(), false);
  f.layer.setAssignment('a', S18);
  assert.equal(f.layer.clearPreview(), false, 'a pin is not a preview');
  assert.equal(f.owned().a.key, 'S30:2026-09-18');
  // A preview still on its way counts.
  f.layer.setMode('ab');
  f.layer.focus(2);
  assert.equal(f.layer.clearPreview(), true);
  assert.equal(f.timers.armed(), 0);
});

test('[recent-imagery-041] CLEAR forgets the box, pins, preview, pending pick, opacity, split and the tool; mode and sources survive', async () => {
  const f = fixture();
  await f.ready();
  f.layer.setMode('ab');
  f.layer.setAssignment('a', S18);
  f.layer.setAlpha(0.3);
  f.layer.setSplit(0.2);
  f.layer.setSources({ viirs: false });
  f.layer.focus(1);
  f.layer.clear();
  const snapshot = f.snap();
  assert.deepEqual(
    [
      snapshot.box,
      snapshot.pins.a.key,
      snapshot.pins.b.key,
      snapshot.preview.key,
      snapshot.alpha,
      snapshot.split,
      snapshot.mode,
    ],
    [null, null, null, null, 1, 0.5, 'ab'],
  );
  assert.equal(snapshot.notice, 'Box and images cleared');
  assert.equal(snapshot.sources.viirs, false);
  assert.equal(f.renderer.ownedCount(), 0);
  assert.equal(f.timers.armed(), 0);
  assert.deepEqual(f.toolCalls, ['cancel']);
  assert.deepEqual(f.dataManager.adopted.at(-1)[1], {
    west: null,
    south: null,
    east: null,
    north: null,
    a: null,
    b: null,
    split: 50,
  });
});

test('[recent-imagery-042] confirmed-empty days hide behind the toggle and focus keeps its key or moves to the nearest older card', async () => {
  const f = fixture();
  await f.ready();
  f.layer.focus(2);
  f.thumbnails.probe(L16, 'empty');
  assert.deepEqual(
    f.snap().candidates.map((c) => c.key),
    ['VIIRS:2026-09-21', 'S30:2026-09-18', 'VIIRS:2026-09-15'],
  );
  assert.equal(f.snap().hiddenCount, 1);
  assert.equal(f.snap().focus.key, 'VIIRS:2026-09-15', 'ties go older');
  f.layer.setShowUnavailable(true);
  assert.equal(f.snap().candidates.length, 4);
  assert.equal(f.snap().hiddenCount, 0);
  assert.equal(f.snap().focus.key, 'VIIRS:2026-09-15', 'same key kept');
  assert.equal(f.snap().candidates[2].drapable, false);
});

test('[recent-imagery-042] a new box takes the old drapes down at once; pins the new catalog still lists survive', async () => {
  const f = fixture();
  await f.ready();
  f.layer.setMode('ab');
  f.layer.setAssignment('a', S18);
  f.layer.setAssignment('b', L16);
  f.layer.setBox({ ...BOX, north: 30.4 });
  assert.equal(f.renderer.ownedCount(), 0, 'down before the search lands');
  f.catalog.resolveLast();
  await settle();
  assert.equal(f.snap().shown.swipe, 'ab');
  assert.equal(f.renderer.ownedCount(), 2);
});

test('[recent-imagery-041] with SELECT BOX armed, Escape clears the preview first and the next Escape cancels the tool', async () => {
  resetPointerOwnership();
  const f = fixture();
  const fakes = boxToolFakes();
  const cancels = [];
  const tool = initImageryBoxTool({
    viewer: fakes.viewer,
    cesium: fakes.cesium,
    pickWorld: fakes.pickWorld,
    documentRef: fakes.documentRef,
    onBox: (box) => f.layer.setBox(box),
    onCancel: (reason) => cancels.push(reason),
    onActive: (active) => f.layer.setToolActive(active),
    // The wiring in src/app/tools.js.
    onEscape: () => f.layer.clearPreview(),
  });
  await f.ready();
  assert.equal(tool.start(), true);
  fakes.key('Escape');
  assert.equal(f.snap().preview.key, null, 'Escape clears the preview');
  assert.equal(tool.isActive(), true, 'and leaves SELECT BOX armed');
  fakes.key('Escape');
  assert.equal(tool.isActive(), false);
  assert.deepEqual(cancels, ['escape']);
  assert.equal(f.snap().toolActive, false);
  await tool.destroy();
});

test('[recent-imagery-029 recent-imagery-038] listener and publication errors keep the layer state valid', async () => {
  const f = fixture();
  const warnings = [];
  const warn = console.warn;
  console.warn = (...args) => warnings.push(args[0]);
  try {
    const off = f.layer.subscribe(() => {
      throw new Error('listener');
    });
    f.layer.attachDataManager({
      adoptLayerParams() {
        throw new Error('publish');
      },
    });
    await f.ready();
    f.layer.setSplit(0.25);
    f.timers.flush();
    assert.equal(f.snap().split, 0.25);
    assert.equal(
      warnings.includes('[Data:RecentImagery] listener failed:'),
      true,
    );
    assert.equal(
      warnings.includes('[Data:RecentImagery] publish failed:'),
      true,
    );
    off();
    f.layer.destroy();
  } finally {
    console.warn = warn;
  }
});

test('[recent-imagery-028 recent-imagery-035] an absent host and a valid pin box have a known state', async () => {
  const renderer = fakeRenderer();
  const thumbnails = fakeThumbnails();
  const catalog = fakeCatalog();
  const layer = createRecentImageryLayer({
    renderer,
    thumbnails,
    catalog,
    host: () => null,
  });
  layer.init(null);
  layer.attachMapStackController(null);
  layer.attachDataManager(null);
  layer.setToolHandler(null);
  layer.setRowControlsListener(null);
  layer.attachTileset(null);
  assert.equal(layer.boxFromPinAt(NaN, 0), false);
  assert.equal(layer.getSnapshot().boxError, 'That point cannot anchor a box');
  assert.equal(layer.boxFromPinAt(0, 0), true);
  layer.enable({ camera: {} });
  catalog.resolveLast([]);
  await settle();
  assert.equal(layer.diagnostics().host, 'none');
  assert.equal(layer.getStats().error, NO_IMAGERY_HOST);
  await layer.update();
  layer.destroy();
  layer.destroy();
  assert.equal(layer.enable(), false);
});

test('[recent-imagery-029] catalog defaults and notes show each source error', async () => {
  const f = fixture();
  f.layer.enable();
  f.layer.setBox(BOX);
  f.catalog.searches.at(-1).resolve({
    candidates: CANDIDATES,
    truncated: true,
    errors: [
      { product: 'S30', message: 'down' },
      { product: 'X30', message: 'bad' },
    ],
  });
  await settle();
  assert.deepEqual(f.snap().notes.slice(0, 3), [
    'Catalog truncated · a newer clear day may exist',
    'HLS S30 catalog unavailable · down',
    'X30 catalog unavailable · bad',
  ]);
  f.layer.setBox({ ...BOX, east: -97.6 });
  f.catalog.searches.at(-1).resolve(null);
  await settle();
  assert.equal(f.snap().candidates.length, 0);
  f.layer.setBox({ ...BOX, east: -97.5 });
  f.catalog.searches.at(-1).reject(null);
  await settle();
  assert.equal(f.snap().error, 'Imagery catalog unavailable');
  f.layer.destroy();
});

test('[recent-imagery-032 recent-imagery-035] an absent controller allows a globe swipe and a tileset suspension', async () => {
  const f = fixture({ controller: null });
  await f.ready();
  f.layer.setMode('basemap');
  assert.equal(f.snap().comparison.active, true);
  f.hostState.kind = 'tileset';
  f.layer.attachTileset({ id: 'new-host' });
  assert.equal(f.snap().comparison.suspended, true);
  assert.equal(f.snap().error, 'Swipe needs a globe map');
  f.layer.attachTileset(null);
  f.layer.destroy();
});

test('[recent-imagery-030 recent-imagery-036] invalid assignments and modes do not change the pins', async () => {
  const f = fixture();
  assert.equal(f.layer.setParams(null), false);
  assert.equal(f.layer.setParams('bad'), false);
  assert.equal(f.layer.setMode(''), false);
  assert.equal(f.layer.setMode('bad'), false);
  assert.equal(f.layer.setMode(null), false);
  f.layer.focus(0);
  f.layer.setShowUnavailable(false);
  await f.ready();
  assert.equal(f.layer.setAssignment('bad', S18), false);
  assert.equal(f.layer.setAssignment('a', 'bad'), false);
  assert.equal(f.layer.setAssignment('a', S18), true);
  f.layer.setMode('ab');
  assert.equal(f.layer.preview(S18), false);
  assert.equal(f.snap().pins.a.key, 'S30:2026-09-18');
  f.layer.setParams({ mode: 99, split: 'bad', a: S18, b: S18 });
  assert.equal(f.snap().pins.b.key, null);
  f.layer.setSources({ hls: false });
  assert.equal(f.layer.setAssignment('a', S18), false);
  f.layer.setToolActive(false);
  f.layer.destroy();
});

test('[recent-imagery-032] a rejected lease and an error on release report the state without a loop', async () => {
  const f = fixture();
  const warn = console.warn;
  const warnings = [];
  console.warn = (...args) => warnings.push(args[0]);
  try {
    await f.ready();
    f.controller.lease.settle(null);
    await settle();
    assert.equal(f.snap().error, 'Esri map unavailable · no swipe');
    f.controller.lease.release = async () => {
      throw new Error('release');
    };
    f.layer.clear();
    await settleTimes();
    assert.deepEqual(warnings, [
      '[Data:RecentImagery] comparison release failed:',
    ]);
    f.layer.destroy();
  } finally {
    console.warn = warn;
  }
});

test('[recent-imagery-034] a manual change to Google 3D does not stop on a synchronous release error', async () => {
  let active = 'esri';
  let generation = 1;
  const f = fixture();
  f.controller.getActiveId = () => active;
  f.controller.getSwitchGeneration = () => generation;
  await f.ready();
  f.controller.lease.settle({ status: 'ready', activeId: 'esri' });
  await settle();
  f.controller.lease.release = () => {
    throw new Error('release');
  };
  const warnings = [];
  const warn = console.warn;
  console.warn = (...args) => warnings.push(args[0]);
  try {
    active = 'photoreal';
    generation = 2;
    f.layer.getStats();
    assert.deepEqual(warnings, [
      '[Data:RecentImagery] comparison release failed:',
    ]);
    assert.equal(
      f.controller.calls.filter(([call]) => call === 'acquire').length,
      2,
    );
  } finally {
    console.warn = warn;
  }
  f.layer.destroy();
});

test('[recent-imagery-040 recent-imagery-038] the default focus and split timers change the state', async () => {
  const renderer = fakeRenderer();
  const thumbnails = fakeThumbnails();
  const catalog = fakeCatalog();
  const layer = createRecentImageryLayer({
    renderer,
    thumbnails,
    catalog,
    host: () => ({ kind: 'globe', collection: {} }),
  });
  layer.enable();
  layer.setBox(BOX);
  catalog.resolveLast();
  await settle();
  layer.focus(1);
  layer.focus(0);
  layer.focus(1);
  layer.setSplit(0.2);
  layer.setSplit(0.3);
  await new Promise((resolve) => setTimeout(resolve, 410));
  assert.equal(layer.getSnapshot().split, 0.3);
  assert.equal(layer.getSnapshot().preview.key, 'L30:2026-09-16');
  layer.destroy();
});

test('[recent-imagery-032] a late lease result after destroy cannot show a swipe', async () => {
  const f = fixture();
  await f.ready();
  const lease = f.controller.lease;
  f.layer.destroy();
  lease.settle({ status: 'ready' });
  await settle();
  assert.equal(f.renderer.ownedCount(), 0);
  assert.equal(f.snap().comparison.active, false);
});

test('[recent-imagery-028] a change to west starts a new search', async () => {
  const f = fixture();
  await f.ready();
  f.layer.setBox({ ...BOX, west: -97.81 });
  assert.equal(f.catalog.searches.length, 2);
  assert.equal(f.catalog.searches.at(-1).request.box.west, -97.81);
  f.layer.destroy();
});

test('[recent-imagery-028] a change to south starts a new search', async () => {
  const f = fixture();
  await f.ready();
  f.layer.setBox({ ...BOX, south: 30.19 });
  assert.equal(f.catalog.searches.length, 2);
  assert.equal(f.catalog.searches.at(-1).request.box.south, 30.19);
  f.layer.destroy();
});

test('[recent-imagery-028] a change to east starts a new search', async () => {
  const f = fixture();
  await f.ready();
  f.layer.setBox({ ...BOX, east: -97.69 });
  assert.equal(f.catalog.searches.length, 2);
  assert.equal(f.catalog.searches.at(-1).request.box.east, -97.69);
  f.layer.destroy();
});

test('[recent-imagery-028] a change to north starts a new search', async () => {
  const f = fixture();
  await f.ready();
  f.layer.setBox({ ...BOX, north: 30.31 });
  assert.equal(f.catalog.searches.length, 2);
  assert.equal(f.catalog.searches.at(-1).request.box.north, 30.31);
  f.layer.destroy();
});

test('[recent-imagery-037] the hls source alone changes its state', async () => {
  const f = fixture();
  await f.ready();
  assert.equal(f.layer.setSources({ hls: false }), true);
  assert.equal(f.snap().sources.hls, false);
  assert.equal(f.snap().sources.viirs, true);
  f.layer.destroy();
});

test('[recent-imagery-037] the viirs source alone changes its state', async () => {
  const f = fixture();
  await f.ready();
  assert.equal(f.layer.setSources({ viirs: false }), true);
  assert.equal(f.snap().sources.viirs, false);
  assert.equal(f.snap().sources.hls, true);
  f.layer.destroy();
});

test('[recent-imagery-030 recent-imagery-036] a single B pin restores focus in A and B mode', async () => {
  const f = fixture();
  await f.ready();
  f.layer.setParams({ mode: 2, a: null, b: L16 });
  assert.equal(f.snap().focus.key, 'L30:2026-09-16');
  assert.equal(f.snap().candidates.find((c) => c.key === L16).pinned, 'b');
  assert.equal(f.snap().pins.a.key, null);
  assert.equal(f.snap().pins.b.key, 'L30:2026-09-16');
  f.layer.destroy();
});

test('[recent-imagery-029] an unknown source product does not enter the strip', async () => {
  const f = fixture();
  await f.ready([
    { key: 'X30:2026-09-18', product: 'X30', day: '2026-09-18', granules: [] },
  ]);
  assert.equal(f.snap().candidates.length, 0);
  assert.equal(f.snap().recommended, null);
  f.layer.destroy();
});

test('[recent-imagery-040 recent-imagery-041] a late focus callback cannot restore a cancelled preview', async () => {
  const f = fixture();
  await f.ready();
  f.layer.focus(2);
  const pending = [...f.timers.pending.values()][0];
  f.layer.clearPreview();
  pending.fn();
  assert.equal(f.snap().preview.key, null);
  f.layer.focus(1);
  f.layer.focus(2);
  f.thumbnails.setStatus(L16, 'empty');
  f.timers.flush();
  assert.equal(f.snap().preview.key, null);
  f.layer.destroy();
  f.layer.setToolActive(true);
  assert.equal(f.layer.enable(), false);
});

test('[recent-imagery-032] a rejected lease does not activate the divider', async () => {
  const f = fixture();
  f.controller.acquireImageryComparison = () => ({
    ready: Promise.reject(new Error('map')),
    release: () => undefined,
  });
  await f.ready();
  await settle();
  f.layer.setMode('basemap');
  assert.equal(f.snap().comparison.active, false);
  assert.equal(f.snap().error, 'Esri map unavailable · no swipe');
  f.layer.destroy();
});

test('[recent-imagery-028] the globe ellipsoid supports a view center, and an absent tool message returns false', () => {
  const f = fixture();
  const ellipsoid = {
    cartesianToCartographic: () => ({ longitude: 0, latitude: 0 }),
    cartographicToCartesian: (point) => point,
  };
  f.viewer.scene = {
    canvas: { clientWidth: 100, clientHeight: 100 },
    globe: { ellipsoid },
  };
  f.viewer.camera.computeViewRectangle = () => ({
    west: 0,
    south: 0,
    east: 0.5,
    north: 0.5,
  });
  f.viewer.camera.pickEllipsoid = () => ({});
  let flight;
  f.viewer.camera.flyTo = (options) => {
    flight = options;
  };
  assert.equal(f.layer.useCurrentView(), false);
  assert.equal(f.layer.zoomToFit() > 0, true);
  assert.equal(flight.destination.longitude, 0);
  assert.equal(flight.destination.latitude, 0);
  assert.equal(f.layer.reportBoxRefusal(null), false);
  f.layer.destroy();
});

test('[recent-imagery-030] a B pin remains active when the A slot has a preview', async () => {
  const f = fixture();
  await f.ready();
  f.layer.setMode('ab');
  f.layer.setAssignment('b', L16);
  f.layer.preview(S18);
  assert.equal(f.snap().shown.a, 'S30:2026-09-18');
  assert.equal(f.snap().shown.b, 'L30:2026-09-16');
  assert.equal(f.layer.preview(L16), false);
  assert.equal(f.snap().preview.key, null);
  f.layer.destroy();
});

test('[recent-imagery-038] identical local controls do not send another state update', async () => {
  const f = fixture();
  await f.ready();
  f.layer.setSplit(0.5);
  f.layer.setVisibleRange(2, 'bad');
  assert.equal(f.thumbnails.calls.at(-1)[2].lastVisible, 2);
  f.layer.setSources({ hls: false });
  assert.equal(f.layer.setAssignment('a', S18), false);
  f.layer.destroy();
});

test('[recent-imagery-029] an aborted catalog success cannot restore old days', async () => {
  const f = fixture();
  f.catalog.searchHls = () =>
    new Promise((resolve) => {
      f.finish = resolve;
    });
  f.layer.enable();
  f.layer.setBox(BOX);
  f.layer.disable();
  f.finish({ candidates: CANDIDATES });
  await settle();
  assert.equal(f.snap().candidates.length, 0);
  assert.equal(f.snap().shown.a, null);
  f.layer.destroy();
});

test('[recent-imagery-029] a renderer without a slot readout still shows the day', async () => {
  const f = fixture();
  f.renderer.getOwned = undefined;
  await f.ready();
  f.thumbnails.probe(S18, 'present');
  assert.equal(f.renderer.ownedCount(), 1);
  assert.equal(f.snap().shown.a, 'S30:2026-09-18');
  f.layer.destroy();
});

test('[recent-imagery-034] an automatic change to Google 3D clears the earlier Esri notice', async () => {
  let active = 'esri';
  let generation = 1;
  let origin = 'user';
  const f = fixture();
  f.controller.getActiveId = () => active;
  f.controller.getSwitchGeneration = () => generation;
  f.controller.getSwitchOrigin = () => origin;
  await f.ready();
  f.controller.lease.settle({ status: 'ready', activeId: 'esri' });
  await settle();
  active = 'photoreal';
  generation = 2;
  f.layer.getStats();
  assert.equal(
    f.snap().notice,
    'Imagery stays on Esri · CLEAR to use Google 3D',
  );
  active = 'esri';
  f.controller.lease.settle({ status: 'ready', activeId: 'esri' });
  await settle();
  active = 'photoreal';
  generation = 3;
  origin = 'automatic';
  f.layer.getStats();
  assert.equal(f.snap().notice, null);
  assert.equal(f.snap().error, 'Esri map unavailable · no swipe');
  f.layer.destroy();
});

test('[recent-imagery-034] an absent switch generation does not get a lease again', async () => {
  const f = fixture();
  f.controller.getActiveId = () => 'photoreal';
  await f.ready();
  f.layer.getStats();
  assert.equal(
    f.controller.calls.filter(([call]) => call === 'acquire').length,
    1,
  );
  f.layer.destroy();
});

test('[recent-imagery-039] a repeated ENABLE call replaces the thumbnail listener', async () => {
  const f = fixture();
  await f.ready();
  f.layer.enable();
  f.thumbnails.probe(S18, 'empty');
  assert.equal(f.snap().shown.a, 'L30:2026-09-16');
  f.layer.attachMapStackController({
    subscribe: () => () => f.reasons.push('off-map'),
  });
  f.layer.attachMapStackController(null);
  assert.equal(f.reasons.includes('off-map'), true);
  f.layer.destroy();
});

test('[recent-imagery-034] a refused second manual lease clears the Esri notice', async () => {
  let active = 'esri';
  let generation = 1;
  const f = fixture();
  f.controller.getActiveId = () => active;
  f.controller.getSwitchGeneration = () => generation;
  await f.ready();
  f.controller.lease.settle({ status: 'ready', activeId: 'esri' });
  await settle();
  active = 'photoreal';
  generation = 2;
  f.layer.getStats();
  assert.equal(
    f.snap().notice,
    'Imagery stays on Esri · CLEAR to use Google 3D',
  );
  f.controller.acquireImageryComparison = () => {
    throw new Error('held');
  };
  generation = 3;
  f.layer.getStats();
  assert.equal(f.snap().notice, null);
  assert.equal(f.snap().error, 'Comparison in use by another scene');
  f.layer.destroy();
});

test('[recent-imagery-040 recent-imagery-041] the same focus and a late CLEAR call do not add renderer work', async () => {
  const f = fixture();
  await f.ready();
  const count = f.reasons.length;
  f.layer.focus(1);
  assert.equal(f.reasons.length, count);
  f.layer.destroy();
  const calls = f.renderer.calls.length;
  f.layer.clear();
  assert.equal(f.renderer.calls.length, calls);
});

test('[recent-imagery-030] a repeated pin assignment does not change the slot', async () => {
  const f = fixture();
  await f.ready();
  assert.equal(f.layer.setAssignment('a', S18), true);
  assert.equal(f.layer.setAssignment('a', S18), false);
  assert.equal(f.snap().pins.a.key, 'S30:2026-09-18');
  f.layer.destroy();
});

test('[recent-imagery-039] an empty proof removes slot a alone', async () => {
  const f = fixture();
  await f.ready();
  f.layer.setMode('ab');
  f.layer.setAssignment('a', S18);
  f.layer.setAssignment('b', L16);
  f.thumbnails.probe(S18, 'empty');
  assert.equal(f.snap().pins.a.key, null);
  assert.equal(f.snap().pins.b.key, 'L30:2026-09-16');
  f.layer.destroy();
});

test('[recent-imagery-039] an empty proof removes slot b alone', async () => {
  const f = fixture();
  await f.ready();
  f.layer.setMode('ab');
  f.layer.setAssignment('a', S18);
  f.layer.setAssignment('b', L16);
  f.thumbnails.probe(L16, 'empty');
  assert.equal(f.snap().pins.b.key, null);
  assert.equal(f.snap().pins.a.key, 'S30:2026-09-18');
  f.layer.destroy();
});

test('[recent-imagery-034] a single A image can get the Esri lease again', async () => {
  let active = 'esri';
  let generation = 1;
  const f = fixture();
  f.controller.getActiveId = () => active;
  f.controller.getSwitchGeneration = () => generation;
  await f.ready();
  f.controller.lease.settle({ status: 'ready', activeId: 'esri' });
  await settle();
  f.layer.setMode('ab');
  f.layer.setAssignment('a', S18);
  assert.equal(f.snap().shown.b, null);
  active = 'photoreal';
  generation = 2;
  f.layer.getStats();
  assert.equal(
    f.controller.calls.filter(([call]) => call === 'acquire').length,
    2,
  );
  f.layer.destroy();
});

test('[recent-imagery-034] a single B image can get the Esri lease again', async () => {
  let active = 'esri';
  let generation = 1;
  const f = fixture();
  f.controller.getActiveId = () => active;
  f.controller.getSwitchGeneration = () => generation;
  await f.ready();
  f.controller.lease.settle({ status: 'ready', activeId: 'esri' });
  await settle();
  f.layer.setMode('ab');
  f.layer.setAssignment('b', S18);
  assert.equal(f.snap().shown.a, null);
  active = 'photoreal';
  generation = 2;
  f.layer.getStats();
  assert.equal(
    f.controller.calls.filter(([call]) => call === 'acquire').length,
    2,
  );
  f.layer.destroy();
});

test('[recent-imagery-036] a new catalog removes each absent pin', async () => {
  const f = fixture();
  await f.ready();
  f.layer.setMode('ab');
  f.layer.setAssignment('a', S18);
  f.layer.setAssignment('b', L16);
  f.layer.setBox({ ...BOX, east: -97.69 });
  f.catalog.resolveLast([candidate('VIIRS', '2026-09-21')]);
  await settle();
  assert.equal(f.snap().pins.a.key, null);
  assert.equal(f.snap().pins.b.key, null);
  f.layer.destroy();
});

test('[recent-imagery-032] both image slots leave the renderer when the layer stops', async () => {
  const f = fixture();
  await f.ready();
  f.layer.setMode('ab');
  f.layer.setAssignment('a', S18);
  f.layer.setAssignment('b', L16);
  assert.equal(f.owned().a.key, 'S30:2026-09-18');
  assert.equal(f.owned().b.key, 'L30:2026-09-16');
  f.layer.disable();
  assert.equal(f.owned().a, null);
  assert.equal(f.owned().b, null);
  f.layer.destroy();
});

test('[recent-imagery-041] CLEAR resets alpha on both renderer slots', async () => {
  const f = fixture();
  await f.ready();
  f.layer.setMode('ab');
  f.layer.setAssignment('a', S18);
  f.layer.setAssignment('b', L16);
  f.layer.setAlpha(0.3);
  assert.deepEqual(
    f.renderer.calls.filter((call) => call[0] === 'alpha').slice(-2),
    [
      ['alpha', 'a', 0.3],
      ['alpha', 'b', 0.3],
    ],
  );
  const calls = [];
  const setAlpha = f.renderer.setAlpha;
  f.renderer.setAlpha = (slot, alpha) => {
    calls.push([slot, alpha]);
    return setAlpha.call(f.renderer, slot, alpha);
  };
  f.layer.clear();
  assert.deepEqual(calls, [
    ['a', 1],
    ['b', 1],
  ]);
  f.layer.destroy();
});

test('[recent-imagery-028] zero canvas width alone uses the box center for ZOOM IN', () => {
  const f = fixture();
  let flight;
  f.viewer.scene = {
    canvas: { clientWidth: 0, clientHeight: 500 },
    ellipsoid: {
      cartesianToCartographic: () => ({ longitude: 0, latitude: 0 }),
      cartographicToCartesian: (value) => value,
    },
  };
  f.viewer.camera.computeViewRectangle = () => ({
    west: 0,
    south: 0,
    east: 0.4,
    north: 0.4,
  });
  f.viewer.camera.pickEllipsoid = () => ({});
  f.viewer.camera.flyTo = (value) => {
    flight = value;
  };
  f.layer.useCurrentView();
  f.layer.zoomToFit();
  assert.equal(flight.destination.longitude, 0.2);
  assert.equal(flight.destination.latitude, 0.2);
  f.layer.destroy();
});

test('[recent-imagery-028] zero canvas height alone uses the box center for ZOOM IN', () => {
  const f = fixture();
  let flight;
  f.viewer.scene = {
    canvas: { clientWidth: 1000, clientHeight: 0 },
    ellipsoid: {
      cartesianToCartographic: () => ({ longitude: 0, latitude: 0 }),
      cartographicToCartesian: (value) => value,
    },
  };
  f.viewer.camera.computeViewRectangle = () => ({
    west: 0,
    south: 0,
    east: 0.4,
    north: 0.4,
  });
  f.viewer.camera.pickEllipsoid = () => ({});
  f.viewer.camera.flyTo = (value) => {
    flight = value;
  };
  f.layer.useCurrentView();
  f.layer.zoomToFit();
  assert.equal(flight.destination.longitude, 0.2);
  assert.equal(flight.destination.latitude, 0.2);
  f.layer.destroy();
});

test('[recent-imagery-028] an absent ground hit alone uses the box center for ZOOM IN', () => {
  const f = fixture();
  let flight;
  f.viewer.scene = {
    canvas: { clientWidth: 1000, clientHeight: 500 },
    ellipsoid: {
      cartesianToCartographic: () => ({ longitude: 0, latitude: 0 }),
      cartographicToCartesian: (value) => value,
    },
  };
  f.viewer.camera.computeViewRectangle = () => ({
    west: 0,
    south: 0,
    east: 0.4,
    north: 0.4,
  });
  f.viewer.camera.pickEllipsoid = () => null;
  f.viewer.camera.flyTo = (value) => {
    flight = value;
  };
  f.layer.useCurrentView();
  f.layer.zoomToFit();
  assert.equal(flight.destination.longitude, 0.2);
  assert.equal(flight.destination.latitude, 0.2);
  f.layer.destroy();
});

test('[recent-imagery-028] an absent ground conversion method alone uses the box center', () => {
  const f = fixture();
  let flight;
  f.viewer.scene = {
    canvas: { clientWidth: 1000, clientHeight: 500 },
    ellipsoid: { cartographicToCartesian: (value) => value },
  };
  f.viewer.camera.computeViewRectangle = () => ({
    west: 0,
    south: 0,
    east: 0.4,
    north: 0.4,
  });
  f.viewer.camera.pickEllipsoid = () => ({});
  f.viewer.camera.flyTo = (value) => {
    flight = value;
  };
  f.layer.useCurrentView();
  f.layer.zoomToFit();
  assert.equal(flight.destination.longitude, 0.2);
  assert.equal(flight.destination.latitude, 0.2);
  f.layer.destroy();
});

test('[recent-imagery-030] a null mode alone does not change the current mode', async () => {
  const f = fixture();
  await f.ready();
  f.layer.setMode('ab');
  assert.equal(f.layer.setMode(null), false);
  assert.equal(f.snap().mode, 'ab');
  f.layer.destroy();
});

test('[recent-imagery-030] an empty mode alone does not change the current mode', async () => {
  const f = fixture();
  await f.ready();
  f.layer.setMode('ab');
  assert.equal(f.layer.setMode(''), false);
  assert.equal(f.snap().mode, 'ab');
  f.layer.destroy();
});

test('[recent-imagery-036] an absent A day alone removes the A pin', async () => {
  const f = fixture();
  await f.ready();
  f.layer.setMode('ab');
  f.layer.setAssignment('a', S18);
  f.layer.setAssignment('b', L16);
  f.layer.setBox({ ...BOX, east: -97.69 });
  f.catalog.resolveLast(CANDIDATES.filter((day) => day.key !== S18));
  await settle();
  assert.equal(f.snap().pins.a.key, null);
  assert.equal(f.snap().pins.b.key, 'L30:2026-09-16');
  f.layer.destroy();
});

test('[recent-imagery-036] an absent B day alone removes the B pin', async () => {
  const f = fixture();
  await f.ready();
  f.layer.setMode('ab');
  f.layer.setAssignment('a', S18);
  f.layer.setAssignment('b', L16);
  f.layer.setBox({ ...BOX, east: -97.69 });
  f.catalog.resolveLast(CANDIDATES.filter((day) => day.key !== L16));
  await settle();
  assert.equal(f.snap().pins.a.key, 'S30:2026-09-18');
  assert.equal(f.snap().pins.b.key, null);
  f.layer.destroy();
});

test('[recent-imagery-030] IMAGE can preview a day from the B pin', async () => {
  const f = fixture();
  await f.ready();
  f.layer.setMode('ab');
  f.layer.setAssignment('b', L16);
  f.layer.setMode('image');
  assert.equal(f.layer.preview(L16), true);
  assert.equal(f.snap().shown.a, 'L30:2026-09-16');
  assert.equal(f.snap().pins.b.key, 'L30:2026-09-16');
  f.layer.destroy();
});

test('[recent-imagery-031] two pins do not allow another preview', async () => {
  const f = fixture();
  await f.ready();
  f.layer.setMode('ab');
  f.layer.setAssignment('a', S18);
  f.layer.setAssignment('b', L16);
  f.thumbnails.probe(V15, 'present');
  assert.equal(f.layer.preview(V15), false);
  assert.equal(f.snap().preview.pending, null);
  assert.equal(f.snap().preview.key, null);
  assert.equal(f.snap().pins.a.key, 'S30:2026-09-18');
  assert.equal(f.snap().pins.b.key, 'L30:2026-09-16');
  f.layer.destroy();
});

test('[recent-imagery-031] a single B image cannot form an A and B comparison', async () => {
  const f = fixture();
  await f.ready();
  f.layer.setMode('ab');
  f.layer.setAssignment('b', L16);
  f.controller.lease.settle();
  await settle();
  assert.equal(f.snap().shown.a, null);
  assert.equal(f.snap().shown.b, 'L30:2026-09-16');
  assert.equal(f.snap().shown.swipe, 'none');
  f.layer.destroy();
});

test('[recent-imagery-042] a farther old day does not replace the nearest old day', async () => {
  const f = fixture();
  await f.ready();
  f.layer.focus(1);
  f.thumbnails.probe(S18, 'empty');
  assert.equal(f.snap().focus.key, 'L30:2026-09-16');
  assert.deepEqual(
    f.snap().candidates.map((day) => day.key),
    ['VIIRS:2026-09-21', 'L30:2026-09-16', 'VIIRS:2026-09-15'],
  );
  f.layer.destroy();
});

test('[recent-imagery-035] a host collection change alone sends a state update', async () => {
  const host = { collection: {}, kind: 'globe' },
    catalog = fakeCatalog();
  const layer = createRecentImageryLayer({
    catalog,
    renderer: fakeRenderer(),
    thumbnails: fakeThumbnails(),
    host: () => ({ ...host }),
    now: () => NOW,
  });
  layer.init({ camera: {} });
  layer.enable();
  layer.setBox(BOX);
  catalog.resolveLast();
  await settle();
  const states = [];
  layer.subscribe((state) => states.push(state));
  host.collection = {};
  layer.getStats();
  assert.equal(states.length, 1);
  layer.destroy();
});

test('[recent-imagery-035] a host kind change alone sends a state update', async () => {
  const host = { collection: {}, kind: 'globe' },
    catalog = fakeCatalog();
  const layer = createRecentImageryLayer({
    catalog,
    renderer: fakeRenderer(),
    thumbnails: fakeThumbnails(),
    host: () => ({ ...host }),
    now: () => NOW,
  });
  layer.init({ camera: {} });
  layer.enable();
  layer.setBox(BOX);
  catalog.resolveLast();
  await settle();
  const states = [];
  layer.subscribe((state) => states.push(state));
  host.kind = 'tileset';
  layer.getStats();
  assert.equal(states.length, 1);
  layer.destroy();
});

test('[recent-imagery-040] focus on the A pin clears the B preview', async () => {
  const f = fixture();
  await f.ready();
  f.layer.setMode('ab');
  f.layer.setAssignment('a', S18);
  f.layer.preview(L16);
  f.layer.focus(1);
  assert.equal(f.snap().preview.pending, null);
  f.timers.flush();
  assert.equal(f.snap().shown.b, null);
  f.layer.destroy();
});

test('[recent-imagery-040] focus on an unknown A pin clears the B preview', async () => {
  const f = fixture();
  await f.ready();
  f.layer.setMode('ab');
  f.layer.setAssignment('a', V21);
  f.layer.preview(L16);
  f.layer.focus(0);
  f.timers.flush();
  assert.equal(f.snap().shown.b, null);
  assert.equal(f.snap().pins.a.key, 'VIIRS:2026-09-21');
  f.layer.destroy();
});

test('[recent-imagery-033] the tileset host note waits for a successful lease', async () => {
  const f = fixture({ hostKind: 'tileset' });
  await f.ready();
  f.layer.setMode('basemap');
  assert.equal(f.snap().error, null);
  assert.equal(f.snap().comparison.suspended, false);
  f.controller.lease.settle();
  await settle();
  assert.equal(f.snap().error, 'Swipe needs a globe map');
  assert.equal(f.snap().comparison.suspended, true);
  f.layer.destroy();
});

test('[recent-imagery-033] IMAGE does not show the tileset swipe note', async () => {
  const f = fixture({ hostKind: 'tileset' });
  await f.ready();
  f.controller.lease.settle();
  await settle();
  assert.equal(f.snap().shown.a, 'S30:2026-09-18');
  assert.equal(f.snap().shown.swipe, 'none');
  assert.equal(f.snap().comparison.suspended, false);
  assert.equal(f.snap().error, null);
  f.layer.destroy();
});

test('[recent-imagery-029] an absent overview day alone does not allow its pass note', async () => {
  const f = fixture();
  await f.ready([candidate('S30', '2026-09-18', 12)]);
  assert.equal(
    f
      .snap()
      .notes.includes(
        'Daily overview for today may still be empty until the pass',
      ),
    false,
  );
  f.layer.destroy();
});

test('[recent-imagery-029] an inactive overview source alone does not allow its pass note', async () => {
  const f = fixture();
  await f.ready();
  f.layer.setSources({ viirs: false });
  assert.equal(
    f
      .snap()
      .notes.includes(
        'Daily overview for today may still be empty until the pass',
      ),
    false,
  );
  f.layer.destroy();
});

test('[recent-imagery-037] a VIIRS source change keeps the HLS preview timer', async () => {
  const f = fixture();
  await f.ready();
  f.layer.focus(2);
  f.layer.setSources({ viirs: false });
  assert.equal(f.snap().preview.pending, 'L30:2026-09-16');
  f.timers.flush();
  assert.equal(f.snap().preview.key, 'L30:2026-09-16');
  f.layer.destroy();
});

test('[recent-imagery-038] a destroyed layer does not publish local changes', async () => {
  const f = fixture();
  await f.ready();
  const calls = [];
  const manager = { adoptLayerParams: (...args) => calls.push(args) };
  f.layer.attachDataManager(manager);
  f.layer.destroy();
  f.layer.attachDataManager(manager);
  f.layer.setBox({ ...BOX, east: -97.69 });
  assert.deepEqual(calls, []);
});

test('[recent-imagery-038] the layer does not call an absent state manager', async () => {
  const f = fixture();
  await f.ready();
  f.layer.attachDataManager(null);
  const warn = console.warn,
    calls = [];
  console.warn = (...args) => calls.push(args);
  try {
    f.layer.setBox({ ...BOX, east: -97.69 });
    assert.deepEqual(calls, []);
  } finally {
    console.warn = warn;
    f.layer.destroy();
  }
});

test('[recent-imagery-034] the same automatic switch does not send another state update', async () => {
  const f = fixture();
  let active = 'esri',
    generation = 1;
  f.controller.getActiveId = () => active;
  f.controller.getSwitchGeneration = () => generation;
  f.controller.getSwitchOrigin = () => 'automatic';
  await f.ready();
  f.controller.lease.settle({ status: 'ready', activeId: 'esri' });
  await settle();
  active = 'photoreal';
  generation = 2;
  f.layer.getStats();
  const calls = [];
  f.layer.subscribe(() => calls.push('state'));
  f.layer.getStats();
  assert.deepEqual(calls, []);
  f.layer.destroy();
});

test('[recent-imagery-037] an active source does not mark the A pin off', async () => {
  const f = fixture();
  await f.ready();
  f.layer.setAssignment('a', S18);
  assert.equal(Object.hasOwn(f.snap().pins.a, 'sourceOff'), true);
  assert.equal(f.snap().pins.a.sourceOff, false);
  f.layer.setSources({ hls: false });
  assert.equal(f.snap().pins.a.sourceOff, true);
  f.layer.setSources({ hls: true });
  assert.equal(f.snap().pins.a.sourceOff, false);
  f.layer.destroy();
});

test('[recent-imagery-032] an old lease result cannot start the new comparison', async () => {
  const f = fixture();
  await f.ready();
  const old = f.controller.lease;
  f.layer.clear();
  await settle();
  f.layer.setMode('basemap');
  f.layer.setBox(BOX);
  f.catalog.resolveLast();
  await settle();
  const current = f.controller.lease;
  old.settle({ status: 'ready' });
  await settle();
  assert.equal(f.snap().comparison.active, false);
  current.settle({ status: 'ready' });
  await settle();
  assert.equal(f.snap().comparison.active, true);
  f.layer.destroy();
});

test('[recent-imagery-031] BASEMAP without an A image has no swipe', async () => {
  const f = fixture();
  await f.ready();
  f.layer.setMode('basemap');
  f.layer.clearPreview();
  await settle();
  assert.equal(f.snap().shown.a, null);
  assert.equal(f.snap().shown.swipe, 'none');
  f.layer.destroy();
});

test('[recent-imagery-035] a map callback does not move the host while the layer is off', async () => {
  const controller = fakeController();
  let callback;
  controller.subscribe = (fn) => {
    callback = fn;
    return () => {};
  };
  const f = fixture({ controller });
  await f.ready();
  f.layer.disable();
  f.renderer.calls.length = 0;
  f.hostState.kind = 'tileset';
  callback();
  assert.equal(f.renderer.calls.length, 0);
  assert.equal(f.layer.diagnostics().host, 'globe');
  f.layer.destroy();
});

test('[recent-imagery-029] an empty catalog allows another search for the same box', async () => {
  const f = fixture({ viirs: false });
  await f.ready([]);
  assert.equal(f.snap().candidates.length, 0);
  f.layer.setBox(BOX);
  assert.equal(f.catalog.searches.length, 2);
  f.catalog.resolveLast([]);
  await settle();
  f.layer.destroy();
});

test('[recent-imagery-036] a control callback with share parameters does not publish user state', async () => {
  const f = fixture();
  await f.ready();
  let restore = false;
  f.layer.subscribe(() => {
    if (restore) {
      restore = false;
      f.layer.setMode('basemap');
    }
  });
  f.dataManager.adopted.length = 0;
  restore = true;
  f.layer.setParams({ mode: 2 });
  assert.equal(f.snap().mode, 'basemap');
  assert.deepEqual(f.dataManager.adopted, []);
  f.layer.destroy();
});

test('[recent-imagery-031] a tileset host alone does not allow a live swipe', async () => {
  const f = fixture({ hostKind: 'tileset' });
  await f.ready();
  f.layer.setMode('basemap');
  f.controller.lease.settle();
  await settle();
  assert.equal(f.snap().shown.swipe, 'basemap');
  assert.equal(f.snap().comparison.active, false);
  f.layer.destroy();
});

test('[recent-imagery-038] a layer without subscribers does not read the clock for a state update', async () => {
  let clockCalls = 0;
  const catalog = fakeCatalog();
  const layer = createRecentImageryLayer({
    catalog,
    renderer: fakeRenderer(),
    thumbnails: fakeThumbnails(),
    host: () => ({ collection: {}, kind: 'globe' }),
    now: () => {
      clockCalls += 1;
      return NOW;
    },
  });
  layer.init({ camera: {} });
  layer.enable();
  layer.setBox(BOX);
  catalog.resolveLast();
  await settle();
  clockCalls = 0;
  layer.setAlpha(0.4);
  assert.equal(clockCalls, 0);
  layer.destroy();
});

test('[recent-imagery-035] a layer without a host removes its host error when it stops', async () => {
  const f = fixture();
  await f.ready();
  f.hostState.kind = 'none';
  f.layer.getStats();
  assert.equal(
    f.snap().error,
    'Hidden by this map source · choose a globe map',
  );
  f.layer.disable();
  assert.equal(f.snap().enabled, false);
  assert.equal(f.snap().error, null);
  f.layer.destroy();
});

test('[recent-imagery-039] a pin that first has pixels sends a full state update', async () => {
  const f = fixture();
  await f.ready();
  f.layer.setAssignment('a', V15);
  assert.equal(f.snap().shown.a, null);
  f.reasons.length = 0;
  f.thumbnails.probe(V15, 'present');
  assert.equal(f.drapes().a, 'VIIRS:2026-09-15|none');
  assert.deepEqual(f.reasons, ['thumbnail', 'state']);
  f.layer.destroy();
});

test('[recent-imagery-017] a new first card alone updates the thumbnail range', async () => {
  const f = fixture();
  await f.ready();
  f.layer.setVisibleRange(0, 2);
  f.layer.setVisibleRange(1, 2);
  assert.equal(f.thumbnails.calls.at(-1)[2].firstVisible, 1);
  assert.equal(f.thumbnails.calls.at(-1)[2].lastVisible, 2);
  f.layer.destroy();
});

test('[recent-imagery-017] a new last card alone updates the thumbnail range', async () => {
  const f = fixture();
  await f.ready();
  f.layer.setVisibleRange(1, 1);
  f.layer.setVisibleRange(1, 2);
  assert.equal(f.thumbnails.calls.at(-1)[2].firstVisible, 1);
  assert.equal(f.thumbnails.calls.at(-1)[2].lastVisible, 2);
  f.layer.destroy();
});

test('[recent-imagery-006] a valid box snapshot gives its kilometer size', async () => {
  const f = fixture();
  await f.ready();
  assert.equal(Math.round(f.snap().boxSizeKm.width * 100), 962);
  assert.equal(Math.round(f.snap().boxSizeKm.height * 100), 1113);
  f.layer.destroy();
});

test('[recent-imagery-006] a snapshot without a box has no kilometer size', async () => {
  const f = fixture();
  assert.equal(f.snap().boxSizeKm, null);
  f.layer.destroy();
});

test('[recent-imagery-029] the layer snapshot gives the focus readout', async () => {
  const f = fixture();
  await f.ready();
  assert.equal(
    f.snap().readout,
    'Sep 18, 2026 17:12Z · 3 days ago · Sentinel-2 via HLS · 30 m · 12% scene cloud',
  );
  f.layer.destroy();
});

test('[recent-imagery-029] an empty HLS snapshot does not read the clock for its readout', async () => {
  let clockCalls = 0;
  const catalog = fakeCatalog();
  const layer = createRecentImageryLayer({
    catalog,
    renderer: fakeRenderer(),
    thumbnails: fakeThumbnails(),
    host: () => ({ collection: {}, kind: 'globe' }),
    now: () => {
      clockCalls += 1;
      return NOW;
    },
  });
  layer.init({ camera: {} });
  layer.enable();
  layer.setBox(BOX);
  catalog.resolveLast([]);
  await settle();
  clockCalls = 0;
  const state = layer.getSnapshot();
  assert.equal(state.readout, '');
  assert.equal(clockCalls, 1);
  layer.destroy();
});

test('[recent-imagery-032] an Esri origin alone leaves the borrowed flag false', async () => {
  const controller = fakeController();
  controller.getActiveId = () => 'esri';
  const f = fixture({ controller });
  await f.ready();
  controller.lease.settle({ status: 'ready', activeId: 'esri' });
  await settle();
  assert.equal(f.snap().borrowedEsri, false);
  f.layer.destroy();
});

test('[recent-imagery-032] another active map alone clears the borrowed flag', async () => {
  let active = 'photoreal';
  const controller = fakeController();
  controller.getActiveId = () => active;
  const f = fixture({ controller });
  await f.ready();
  active = 'esri';
  controller.lease.settle({ status: 'ready', activeId: 'esri' });
  await settle();
  assert.equal(f.snap().borrowedEsri, true);
  active = 'osm';
  assert.equal(f.snap().borrowedEsri, false);
  f.layer.destroy();
});

test('[recent-imagery-032] an absent lease map ID alone leaves the borrowed flag false', async () => {
  let active = 'photoreal';
  const controller = fakeController();
  controller.getActiveId = () => active;
  const f = fixture({ controller });
  await f.ready();
  active = null;
  controller.lease.settle({ status: 'ready' });
  await settle();
  assert.equal(f.snap().borrowedEsri, false);
  f.layer.destroy();
});

test('[recent-imagery-028] a nonfunction tool handler does not stop CLEAR', async () => {
  const f = fixture();
  f.layer.setToolHandler({});
  assert.doesNotThrow(() => f.layer.clear());
  f.layer.destroy();
});

test('[recent-imagery-037] a source change calls its row listener', async () => {
  const f = fixture();
  await f.ready();
  let calls = 0;
  f.layer.setRowControlsListener(() => {
    calls += 1;
  });
  f.layer.setSources({ viirs: false });
  assert.equal(calls, 1);
  f.layer.destroy();
});

test('[recent-imagery-037] a source change ignores a nonfunction row listener', async () => {
  const f = fixture();
  await f.ready();
  f.layer.setRowControlsListener({});
  assert.doesNotThrow(() => f.layer.setSources({ viirs: false }));
  f.layer.destroy();
});

test('[recent-imagery-028] an absent Cartesian placement method alone does not allow a flight', async () => {
  const f = fixture();
  f.viewer.scene = { ellipsoid: {} };
  f.viewer.camera.flyTo = () => {};
  f.layer.reportBoxRefusal('Box too wide', {
    west: 0,
    south: 0,
    east: 20,
    north: 20,
  });
  assert.equal(f.layer.zoomToFit(), null);
  f.layer.destroy();
});

test('[recent-imagery-028] an absent camera flight method alone does not allow a flight', async () => {
  const f = fixture();
  f.viewer.scene = { ellipsoid: { cartographicToCartesian: (value) => value } };
  f.layer.reportBoxRefusal('Box too wide', {
    west: 0,
    south: 0,
    east: 20,
    north: 20,
  });
  assert.equal(f.layer.zoomToFit(), null);
  f.layer.destroy();
});

test('[recent-imagery-035] a tileset change does not change the host while the layer is off', async () => {
  const f = fixture();
  await f.ready();
  f.layer.disable();
  f.renderer.calls.length = 0;
  f.hostState.kind = 'tileset';
  f.layer.attachTileset({});
  assert.equal(f.layer.diagnostics().host, 'globe');
  assert.deepEqual(f.renderer.calls, []);
  f.layer.destroy();
});

test('[recent-imagery-035] an unchanged tileset host does not send another state update', async () => {
  const f = fixture();
  await f.ready();
  f.reasons.length = 0;
  f.layer.attachTileset({});
  assert.deepEqual(f.reasons, []);
  f.layer.destroy();
});

test('[recent-imagery-036] a null split parameter alone keeps the divider value', async () => {
  const f = fixture();
  await f.ready();
  f.layer.setSplit(0.3);
  f.layer.setParams({ split: null });
  assert.equal(f.snap().split, 0.3);
  f.layer.destroy();
});

test('[recent-imagery-036] a nonfinite split parameter alone keeps the divider source flag', async () => {
  const f = fixture();
  await f.ready();
  f.layer.setSplit(0.3);
  f.layer.setParams({ split: NaN });
  assert.equal(f.snap().split, 0.3);
  assert.equal(f.layer.diagnostics().splitFromLink, false);
  f.layer.destroy();
});

test('[recent-imagery-036] the same mode parameter does not send renderer work', async () => {
  const f = fixture();
  await f.ready();
  f.renderer.calls.length = 0;
  f.thumbnails.calls.length = 0;
  f.layer.setParams({ mode: 0 });
  assert.deepEqual(f.renderer.calls, []);
  assert.deepEqual(f.thumbnails.calls, []);
  f.layer.destroy();
});

test('[recent-imagery-036] a single B parameter restores only the B pin', async () => {
  const f = fixture();
  await f.ready();
  f.layer.setMode('ab');
  f.layer.setAssignment('a', S18);
  f.layer.setParams({ b: L16 });
  assert.equal(f.snap().pins.a.key, 'S30:2026-09-18');
  assert.equal(f.snap().pins.b.key, 'L30:2026-09-16');
  f.layer.destroy();
});

test('[recent-imagery-036] an incorrect share pin key becomes null', async () => {
  const f = fixture();
  f.layer.setParams({ a: 'bad' });
  assert.equal(f.layer.getParams().a, null);
  f.layer.destroy();
});

test('[recent-imagery-036] an absent catalog pin alone keeps the current focus', async () => {
  const f = fixture();
  await f.ready();
  f.layer.focus(2);
  f.layer.setParams({ a: 'S30:2026-09-01' });
  assert.equal(f.snap().focus.key, 'L30:2026-09-16');
  f.layer.destroy();
});

test('[recent-imagery-036] share parameters do not send renderer work while the layer is off', async () => {
  const f = fixture();
  f.renderer.calls.length = 0;
  f.thumbnails.calls.length = 0;
  f.layer.setParams({ mode: 2 });
  assert.deepEqual(f.renderer.calls, []);
  assert.deepEqual(f.thumbnails.calls, []);
  f.layer.destroy();
});

test('[recent-imagery-038 recent-imagery-040] one clock step completes both divider publication and focus preview', async () => {
  const f = fixture();
  await f.ready();
  f.controller.lease.settle();
  await settle();
  f.layer.setMode('ab');
  f.layer.setAssignment('a', S18);
  f.layer.preview(L16);
  f.thumbnails.setStatus(V15, 'present');
  f.dataManager.adopted.length = 0;
  f.layer.setSplit(0.2);
  f.layer.focus(3);
  assert.equal(f.timers.armed(), 2);
  f.timers.flush();
  assert.deepEqual(
    f.dataManager.adopted.map(([, params]) => params),
    [{ split: 20 }],
  );
  assert.equal(f.snap().shown.b, 'VIIRS:2026-09-15');
  f.layer.destroy();
});

test('[recent-imagery-032] a late controller gets a lease after the next preview', async () => {
  const f = fixture({ controller: null });
  await f.ready();
  f.layer.clearPreview();
  const controller = fakeController();
  f.layer.attachMapStackController(controller);
  f.layer.preview(L16);
  assert.equal(
    controller.calls.filter(([name]) => name === 'acquire').length,
    1,
  );
  assert.equal(f.layer.diagnostics().lease, true);
  f.layer.destroy();
});

test('[recent-imagery-029] an active HLS request does not allow a repeat search for the same box', async () => {
  const f = fixture();
  f.layer.enable();
  f.layer.setBox(BOX);
  f.layer.setBox(BOX);
  assert.equal(f.catalog.searches.length, 1);
  f.catalog.resolveLast();
  await settle();
  f.layer.destroy();
});

test('[recent-imagery-041] a followed day alone counts as a preview to clear', async () => {
  const f = fixture();
  await f.ready();
  f.layer.clearPreview();
  f.layer.preview(V15);
  assert.equal(f.layer.clearPreview(), true);
  assert.equal(f.snap().preview.pending, null);
  f.layer.destroy();
});

test('[recent-imagery-039] a followed day with new pixels sends a full state update', async () => {
  const f = fixture();
  await f.ready();
  f.layer.clearPreview();
  f.layer.preview(V15);
  f.reasons.length = 0;
  f.thumbnails.probe(V15, 'present');
  assert.deepEqual(f.reasons, ['thumbnail', 'state']);
  f.layer.destroy();
});

test('[recent-imagery-040] an unknown followed day keeps its probe wait state', async () => {
  const f = fixture();
  await f.ready();
  f.layer.clearPreview();
  f.layer.preview(V15);
  f.thumbnails.probe(V15, 'unknown');
  assert.equal(f.snap().preview.pending, 'VIIRS:2026-09-15');
  assert.equal(f.snap().shown.a, null);
  f.layer.destroy();
});

test('[recent-imagery-040] a probe for a day outside focus does not start its preview', async () => {
  const f = fixture();
  await f.ready();
  f.layer.clearPreview();
  f.layer.preview(V15);
  f.layer.setSources({ viirs: false });
  f.layer.setSources({ viirs: true });
  f.thumbnails.probe(V15, 'present');
  assert.equal(f.snap().focus.key, 'L30:2026-09-16');
  assert.equal(f.snap().shown.a, null);
  f.layer.destroy();
});

test('[recent-imagery-039] an unchanged day probe does not send renderer work', async () => {
  const f = fixture();
  await f.ready();
  f.renderer.calls.length = 0;
  f.thumbnails.probe(V15, 'unknown');
  assert.deepEqual(f.renderer.calls, []);
  f.layer.destroy();
});

test('[recent-imagery-039] a day with new pixels sends renderer work once without a host', async () => {
  const f = fixture({ hostKind: 'none' });
  await f.ready();
  f.layer.clearPreview();
  f.layer.preview(V15);
  f.renderer.calls.length = 0;
  f.thumbnails.probe(V15, 'present');
  assert.deepEqual(f.renderer.calls, [['rebind', 'none']]);
  f.layer.destroy();
});

test('[recent-imagery-039] an empty automatic preview sends renderer work once without a host', async () => {
  const f = fixture({ hostKind: 'none' });
  await f.ready();
  f.renderer.calls.length = 0;
  f.thumbnails.probe(S18, 'empty');
  assert.deepEqual(f.renderer.calls, [['rebind', 'none']]);
  f.layer.destroy();
});

test('[recent-imagery-035] stats check the host after a nonfunction subscription result', async () => {
  const controller = fakeController();
  controller.subscribe = () => ({});
  const f = fixture({ controller });
  await f.ready();
  f.hostState.kind = 'tileset';
  f.layer.getStats();
  assert.equal(f.layer.diagnostics().host, 'tileset');
  f.layer.destroy();
});

test('[recent-imagery-029] ENABLE keeps a catalog that has days', async () => {
  const f = fixture();
  await f.ready();
  f.layer.enable();
  assert.equal(f.catalog.searches.length, 1);
  assert.equal(f.snap().candidates.length, 4);
  f.layer.destroy();
});

test('[recent-imagery-036] a new catalog removes slot a alone', async () => {
  const f = fixture();
  await f.ready();
  f.layer.setMode('ab');
  f.layer.setAssignment('a', S18);
  f.layer.setAssignment('b', L16);
  f.layer.setBox({ ...BOX, east: -97.69 });
  f.catalog.resolveLast([CANDIDATES[2]]);
  await settle();
  assert.equal(f.snap().pins.a.key, null);
  assert.equal(f.snap().pins.b.key, 'L30:2026-09-16');
  f.layer.destroy();
});

test('[recent-imagery-036] a new catalog removes slot b alone', async () => {
  const f = fixture();
  await f.ready();
  f.layer.setMode('ab');
  f.layer.setAssignment('a', S18);
  f.layer.setAssignment('b', L16);
  f.layer.setBox({ ...BOX, east: -97.69 });
  f.catalog.resolveLast([CANDIDATES[1]]);
  await settle();
  assert.equal(f.snap().pins.b.key, null);
  assert.equal(f.snap().pins.a.key, 'S30:2026-09-18');
  f.layer.destroy();
});

test('[recent-imagery-038] both subscribers get the new opacity', async () => {
  const f = fixture();
  await f.ready();
  const first = [],
    second = [];
  f.layer.subscribe((snapshot) => first.push(snapshot.alpha));
  f.layer.subscribe((snapshot) => second.push(snapshot.alpha));
  f.layer.setAlpha(0.4);
  assert.deepEqual(first, [0.4]);
  assert.deepEqual(second, [0.4]);
  f.layer.destroy();
});

test('[recent-imagery-039] both offscreen pins get direct thumbnail requests', async () => {
  const f = fixture();
  const days = dailyViirs();
  f.layer.setVisibleRange(0, 5);
  f.layer.setParams({
    ...LINK_BOX,
    a: 'VIIRS:2026-08-27',
    b: 'VIIRS:2026-08-26',
    mode: 2,
  });
  f.layer.enable();
  f.catalog.resolveLast(days);
  await settle();
  assert.deepEqual(
    f.thumbnails.requests.find(([key]) => key === 'VIIRS:2026-08-27'),
    ['VIIRS:2026-08-27', 0],
  );
  assert.deepEqual(
    f.thumbnails.requests.find(([key]) => key === 'VIIRS:2026-08-26'),
    ['VIIRS:2026-08-26', 0],
  );
  f.layer.destroy();
});

test('[recent-imagery-031] the AB mode keeps slot A empty after a B preview', async () => {
  const f = fixture();
  await f.ready();
  f.layer.setAssignment('b', L16);
  f.layer.preview(L16);
  f.layer.setMode('ab');
  assert.equal(f.snap().shown.a, null);
  assert.equal(f.snap().shown.b, 'L30:2026-09-16');
  assert.equal(f.snap().shown.swipe, 'none');
  f.layer.destroy();
});

test('[recent-imagery-031] the AB mode does not compare a B preview with itself', async () => {
  const f = fixture();
  await f.ready();
  f.layer.setMode('ab');
  f.layer.setAssignment('b', L16);
  f.layer.setMode('image');
  f.layer.preview(L16);
  f.layer.setMode('ab');
  assert.equal(f.snap().shown.a, null);
  assert.equal(f.snap().shown.b, 'L30:2026-09-16');
  assert.equal(f.snap().shown.swipe, 'none');
  f.layer.destroy();
});

test('[recent-imagery-036] a new search keeps focus on the single B pin', async () => {
  const f = fixture();
  await f.ready();
  f.layer.setMode('ab');
  f.layer.setAssignment('b', L16);
  f.layer.setBox({ ...BOX, east: -97.69 });
  f.catalog.resolveLast();
  await settle();
  assert.equal(f.snap().focus.key, 'L30:2026-09-16');
  assert.equal(f.snap().auto, null);
  f.layer.destroy();
});

test('[recent-imagery-032] a controller after an image does not get a lease on a mode change', async () => {
  const f = fixture({ controller: null });
  await f.ready();
  f.layer.setAssignment('a', S18);
  assert.equal(f.snap().shown.a, 'S30:2026-09-18');
  let acquisitions = 0;
  const controller = fakeController();
  const acquire = controller.acquireImageryComparison.bind(controller);
  controller.acquireImageryComparison = (...args) => {
    acquisitions += 1;
    return acquire(...args);
  };
  f.layer.attachMapStackController(controller);
  f.layer.setMode('basemap');
  assert.equal(acquisitions, 0);
  f.layer.destroy();
});

test('[recent-imagery-029] a null preview key does not remove the current image', async () => {
  const f = fixture();
  await f.ready([CANDIDATES[1], { ...CANDIDATES[2], key: null }]);
  assert.equal(f.layer.preview(null), false);
  assert.equal(f.snap().shown.a, 'S30:2026-09-18');
  f.layer.destroy();
});

test('[recent-imagery-042] a null candidate key moves focus to the first card with a key', async () => {
  const f = fixture();
  await f.ready([CANDIDATES[1], { ...CANDIDATES[2], key: null }]);
  f.layer.focus(1);
  assert.equal(f.snap().focus.key, 'S30:2026-09-18');
  assert.equal(f.snap().focusIndex, 0);
  f.layer.destroy();
});

test('[recent-imagery-030] a mode with different numeric results does not change the mode', async () => {
  const f = fixture();
  await f.ready();
  let reads = 0;
  const mode = {
    valueOf() {
      reads += 1;
      return reads === 1 ? 1 : 1.5;
    },
  };
  assert.equal(f.layer.setMode(mode), false);
  assert.equal(f.snap().mode, 'image');
  f.layer.destroy();
});

test('[recent-imagery-042] a null candidate key does not cause an error or add a preview timer', async () => {
  const f = fixture();
  await f.ready([CANDIDATES[1], { ...CANDIDATES[2], key: null }]);
  assert.doesNotThrow(() => f.layer.focus(1));
  assert.equal(f.timers.armed(), 0);
  f.layer.destroy();
});

test('[recent-imagery-042] an equal distance before the old focus does not replace the first nearest card', async () => {
  const f = fixture();
  const days = [...CANDIDATES];
  days.indexOf = (day) =>
    day.key === L16 ? 0 : Array.prototype.indexOf.call(days, day);
  await f.ready(days);
  f.layer.focus(1);
  f.thumbnails.probe(S18, 'empty');
  assert.equal(f.snap().focus.key, 'VIIRS:2026-09-21');
  f.layer.destroy();
});

test('[recent-imagery-042] the hidden count stays zero with different source lists when empty days show', async () => {
  const f = fixture();
  const days = [...CANDIDATES];
  await f.ready(days);
  f.layer.setShowUnavailable(true);
  let calls = 0;
  days.filter = (...args) => {
    calls += 1;
    return calls % 2 ? Array.prototype.filter.call(days, ...args) : [];
  };
  assert.equal(f.snap().hiddenCount, 0);
  f.layer.destroy();
});

test('[recent-imagery-036] a share mode whose second value is null does not change the current mode', async () => {
  const f = fixture();
  await f.ready();
  let reads = 0;
  f.layer.setParams({
    get mode() {
      reads += 1;
      return reads === 1 ? 'ab' : null;
    },
  });
  assert.equal(f.snap().mode, 'image');
  f.layer.destroy();
});

test('[recent-imagery-037] a source that becomes active keeps the preview that waits after a product change', async () => {
  const f = fixture();
  const days = CANDIDATES.map((day) => ({ ...day }));
  await f.ready(days);
  f.layer.focus(2);
  days[2].product = 'VIIRS';
  f.layer.setSources({ hls: false });
  days[2].product = 'L30';
  f.layer.setSources({ hls: true });
  assert.equal(f.snap().preview.pending, 'L30:2026-09-16');
  f.layer.destroy();
});

test('[recent-imagery-031] a thumbnail callback that selects IMAGE does not leave an AB swipe', async () => {
  const f = fixture();
  await f.ready();
  f.layer.setMode('ab');
  f.layer.setAssignment('a', S18);
  f.layer.setAssignment('b', L16);
  const get = f.thumbnails.get.bind(f.thumbnails);
  let changed = false;
  f.thumbnails.get = (key) => {
    if (key === L16 && !changed) {
      changed = true;
      f.layer.setMode('image');
    }
    return get(key);
  };
  const state = f.diag();
  assert.equal(state.mode, 'image');
  assert.equal(state.shown.swipe, 'none');
  f.layer.destroy();
});

async function layerAfterRendererCallback({ pin = true } = {}) {
  const f = fixture({ controller: null });
  await f.ready();
  if (pin) f.layer.setAssignment('a', S18);
  f.renderer.destroy = () => f.layer.enable();
  f.layer.destroy();
  f.catalog.resolveLast();
  await settle();
  return f;
}

test('[recent-imagery-035] a map callback after the layer calls DESTROY does not change the host after a renderer callback', async () => {
  const f = await layerAfterRendererCallback();
  f.hostState.kind = 'tileset';
  f.layer.getStats();
  assert.equal(f.diag().host, 'globe');
});

test('[recent-imagery-040] a focus timer after the layer calls DESTROY does not change the preview after a renderer callback', async () => {
  const f = await layerAfterRendererCallback({ pin: false });
  f.layer.focus(2);
  f.timers.flush();
  assert.equal(f.snap().shown.a, 'S30:2026-09-18');
});

test('[recent-imagery-031] the layer rejects SWAP after a lease callback and a renderer callback destroy it', async () => {
  const f = fixture();
  await f.ready();
  f.layer.setMode('basemap');
  f.layer.setAssignment('a', S18);
  f.renderer.destroy = () => f.layer.enable();
  f.controller.lease.settle({
    get status() {
      f.layer.destroy();
      return 'ready';
    },
    activeId: 'esri',
  });
  await settle();
  f.catalog.resolveLast();
  await settle();
  assert.equal(f.layer.swapSides(), false);
  assert.equal(f.snap().swapped, false);
});

test('[recent-imagery-032] a lease that completes after its controller destroys the layer does not activate a comparison', async () => {
  const controller = fakeController();
  const acquire = controller.acquireImageryComparison.bind(controller);
  let f,
    stopped = false;
  controller.acquireImageryComparison = (...args) => {
    const lease = acquire(...args);
    if (!stopped) {
      stopped = true;
      f.layer.destroy();
      f.layer.attachMapStackController(controller);
    }
    return lease;
  };
  f = fixture({ controller });
  f.renderer.destroy = () => f.layer.enable();
  await f.ready();
  f.catalog.resolveLast();
  await settle();
  f.layer.setMode('basemap');
  controller.lease.settle();
  await settle();
  assert.equal(f.snap().comparison.active, false);
});

test('[recent-imagery-033] a ready result that causes a rejected lease does not activate a swipe', async () => {
  let active = 'esri',
    generation = 1;
  const controller = fakeController();
  controller.getActiveId = () => active;
  controller.getSwitchGeneration = () => generation;
  const f = fixture({ controller });
  await f.ready();
  f.layer.setMode('basemap');
  controller.lease.settle({
    get status() {
      active = 'photoreal';
      generation = 2;
      controller.acquireImageryComparison = () => {
        throw new Error('held');
      };
      f.layer.getStats();
      return 'ready';
    },
    activeId: 'esri',
  });
  await settle();
  assert.equal(f.snap().comparison.active, false);
  f.layer.destroy();
});

test('[recent-imagery-032] a new lease without a result does not mark Esri as borrowed after an old map result', async () => {
  let active = 'esri',
    generation = 1;
  const controller = fakeController();
  const acquire = controller.acquireImageryComparison.bind(controller);
  controller.acquireImageryComparison = (...args) => {
    active = 'esri';
    return acquire(...args);
  };
  controller.getActiveId = () => active;
  controller.getSwitchGeneration = () => generation;
  const f = fixture({ controller });
  await f.ready();
  controller.lease.settle({
    status: 'ready',
    get activeId() {
      active = 'photoreal';
      generation = 2;
      f.layer.getStats();
      return 'esri';
    },
  });
  await settle();
  assert.equal(f.snap().borrowedEsri, false);
  f.layer.destroy();
});

test('[recent-imagery-032] a ready result without a lease does not mark Esri as borrowed', async () => {
  let active = 'esri',
    generation = 1;
  const controller = fakeController();
  controller.getActiveId = () => active;
  controller.getSwitchGeneration = () => generation;
  const f = fixture({ controller });
  await f.ready();
  controller.lease.settle({
    get status() {
      active = 'photoreal';
      generation = 2;
      controller.acquireImageryComparison = () => {
        active = 'esri';
        return null;
      };
      try {
        f.layer.getStats();
      } catch {}
      return 'ready';
    },
    activeId: 'esri',
  });
  await settle();
  assert.equal(f.snap().borrowedEsri, false);
  f.layer.destroy();
});

async function layerAfterSearchCallback(action) {
  const f = fixture();
  f.layer.enable();
  f.layer.setBox(BOX);
  f.thumbnails.calls.length = 0;
  f.catalog.searches.at(-1).resolve({
    get candidates() {
      f.layer[action]();
      return CANDIDATES;
    },
    errors: [],
    truncated: false,
  });
  await settle();
  return f;
}

test('[recent-imagery-029] a search result that disables the layer does not show an image or request thumbnails', async () => {
  const f = await layerAfterSearchCallback('disable');
  assert.equal(f.snap().shown.a, null);
  assert.equal(
    f.thumbnails.calls.some(([kind]) => kind === 'ordered'),
    false,
  );
  assert.deepEqual(f.thumbnails.requests, []);
  f.layer.destroy();
});

test('[recent-imagery-041] a search result that clears the box does not show an image or request thumbnails', async () => {
  const f = await layerAfterSearchCallback('clear');
  assert.equal(f.snap().shown.a, null);
  assert.equal(
    f.thumbnails.calls.some(([kind]) => kind === 'ordered'),
    false,
  );
  assert.deepEqual(f.thumbnails.requests, []);
  f.layer.destroy();
});

test('[recent-imagery-040] a disabled layer does not set a preview timer after a search callback', async () => {
  const f = await layerAfterSearchCallback('disable');
  f.layer.focus(2);
  assert.equal(f.snap().preview.pending, null);
  f.layer.destroy();
});

test('[recent-imagery-030] a disabled layer rejects a preview after a search callback', async () => {
  const f = await layerAfterSearchCallback('disable');
  assert.equal(f.layer.preview(L16), false);
  f.layer.destroy();
});

test('[recent-imagery-031] a preview timer does not add a null slot after a thumbnail callback fills both pins', async () => {
  const f = fixture();
  await f.ready();
  f.layer.setMode('ab');
  f.thumbnails.probe(V21, 'present');
  f.layer.focus(0);
  const get = f.thumbnails.get.bind(f.thumbnails);
  let changed = false;
  f.thumbnails.get = (key) => {
    if (key === V21 && !changed) {
      changed = true;
      f.layer.setAssignment('a', S18);
      f.layer.setAssignment('b', L16);
    }
    return get(key);
  };
  f.timers.flush();
  assert.equal(Object.hasOwn(f.diag().shown, 'null'), false);
  f.layer.destroy();
});

test('[recent-imagery-032] a map callback does not end a lease while an earlier lease waits to end', async () => {
  let f,
    acquisitions = 0,
    generation = 1;
  const released = [];
  const controller = {
    getActiveId: () => 'photoreal',
    getSwitchGeneration: () => generation,
    acquireImageryComparison() {
      const id = ++acquisitions;
      const lease = {
        ready: new Promise(() => {}),
        release() {
          released.push(id);
          return id === 2 ? new Promise(() => {}) : Promise.resolve();
        },
      };
      if (id === 1) {
        f.layer.setAssignment('a', S18);
        f.layer.clear();
        f.layer.setBox(BOX);
      }
      return lease;
    },
  };
  f = fixture({ controller });
  await f.ready();
  f.catalog.resolveLast();
  await settle();
  generation = 2;
  f.layer.getStats();
  assert.equal(released.includes(1), false);
  f.layer.destroy();
});

test('[recent-imagery-034] a controller callback that removes both images does not read the switch generation', async () => {
  const controller = fakeController();
  controller.getActiveId = () => 'esri';
  let reads = 0;
  controller.getSwitchGeneration = () => {
    reads += 1;
    return 1;
  };
  const f = fixture({ controller });
  await f.ready();
  reads = 0;
  controller.getActiveId = () => {
    f.layer.clear();
    return 'photoreal';
  };
  f.layer.getStats();
  assert.equal(reads, 0);
  f.layer.destroy();
});
