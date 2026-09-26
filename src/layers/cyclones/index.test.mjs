import test from 'node:test';
import assert from 'node:assert/strict';
import { createCyclonesLayer } from './index.js';
import {
  claimPointer,
  releasePointer,
  isPointerFree,
} from '../../data/inputOwnership.js';
import { isOwnedByOtherLayer } from '../../data/pickRegistry.js';

const time = '2026-09-16T03:00:00.000Z';
const storm = (id = 'ep152026') => ({
  id,
  name: id === 'ep152026' ? 'Fifteen-E' : 'Another system',
  classification: 'PTC',
  basin: 'EP',
  position: { longitude: -125.8, latitude: 15.5 },
  positionAt: time,
  issuedAt: time,
  advisoryNumber: '10',
  windKt: 25,
  pressureHpa: 1006,
  geometryStatus: 'pending',
  geometryAdvisoryNumber: null,
  forecastPoints: [],
  track: null,
  cone: null,
  advisoryUrl: 'https://www.nhc.noaa.gov/text/MIATCMEP5.shtml',
});
const snapshot = (storms = [storm()]) => ({
  schemaVersion: 1,
  storms,
  unavailable: false,
  stale: false,
  fetchedAt: Date.parse(time),
  coverage: 'Atlantic and eastern/central North Pacific',
  reason: null,
});
const deferred = () => {
  let resolve, reject;
  const promise = new Promise((done, fail) => {
    resolve = done;
    reject = fail;
  });
  return { promise, resolve, reject };
};

test('[cyclones-019 cyclones-024] map selection yields to pointer owners and owns only its enabled handler', async () => {
  const handlers = [],
    pickedEntity = {},
    foreignEntity = {};
  let picked = { id: pickedEntity },
    overlayHit = null,
    overlayTests = 0,
    picks = 0,
    notices = 0;
  const rendering = {
    setSnapshot: async () => true,
    setSelection() {},
    clear() {},
    destroy() {},
    pickStorm: (value) => (value?.id === pickedEntity ? 'ep162026' : null),
    ownsPickId: (id) => id === 'cyclone:ep162026:center',
    getDiagnostics: () => ({}),
  };
  const cesium = {
    ScreenSpaceEventType: { LEFT_CLICK: 'left' },
    ScreenSpaceEventHandler: class {
      constructor(canvas) {
        assert.ok(canvas);
        handlers.push(this);
        this.destroyed = false;
      }
      setInputAction(callback, type) {
        assert.equal(type, 'left');
        this.click = callback;
      }
      destroy() {
        this.destroyed = true;
      }
      isDestroyed() {
        return this.destroyed;
      }
    },
  };
  const layer = createCyclonesLayer({
    feed: { getSnapshot: async () => snapshot([storm(), storm('ep162026')]) },
    cesium,
    createRendering: () => rendering,
    hitTestOverlay: () => {
      overlayTests++;
      return overlayHit;
    },
  });
  const canvas = new EventTarget();
  canvas.getBoundingClientRect = () => ({ left: 100, top: 200 });
  const viewer = {
    scene: {
      canvas,
      pick() {
        picks++;
        return picked;
      },
    },
    trackedEntity: null,
    camera: {
      flyToBoundingSphere() {
        assert.fail('Click must not move the camera');
      },
    },
  };
  layer.init(viewer);
  layer.setRowControlsListener(() => notices++);
  assert.equal(handlers.length, 0, 'disabled module installs no handler');
  layer.enable();
  layer.enable();
  assert.equal(
    isOwnedByOtherLayer('flights', 'cyclone:ep162026:center'),
    true,
    'flight tracking recognizes the cyclone pick and leaves the camera alone',
  );
  assert.equal(isOwnedByOtherLayer('vessels', 'cyclone:ep162026:center'), true);
  assert.equal(
    isOwnedByOtherLayer('flights', 'cyclone:ep162026:foreign'),
    false,
    'registration recognizes exact current IDs, not a prefix',
  );
  assert.equal(handlers.length, 1, 'enable is idempotent');
  await layer.update();
  const click = { position: { x: 10, y: 20 } };
  const owner = claimPointer('director');
  assert.ok(owner);
  try {
    handlers[0].click(click);
    assert.equal(picks, 0, 'claimed pointer is checked before picking');
    assert.equal(layer.getDiagnostics().selectedId, 'ep152026');
  } finally {
    releasePointer(owner);
  }
  picked = { id: foreignEntity };
  handlers[0].click(click);
  assert.equal(layer.getDiagnostics().selectedId, 'ep152026');
  picked = { primitive: {} };
  handlers[0].click(click);
  assert.equal(layer.getDiagnostics().selectionIntent, 'auto');
  picked = { id: pickedEntity };
  overlayHit = { sourceId: 'ais-live-vessels', entryId: 'vessel:123' };
  const beforeCard = picks;
  handlers[0].click(click);
  assert.equal(
    picks,
    beforeCard,
    'foreground AIS card wins before scene picking',
  );
  assert.equal(layer.getDiagnostics().selectedId, 'ep152026');
  // A native capture runs before an earlier sibling handler clears hit rects.
  const up = new Event('pointerup');
  Object.assign(up, { clientX: 110, clientY: 220 });
  canvas.dispatchEvent(up);
  overlayHit = null;
  handlers[0].click(click);
  assert.equal(
    layer.getDiagnostics().selectedId,
    'ep152026',
    'captured AIS hit survives synchronous sibling overlay rebuild',
  );
  // A captured background hit remains background even if a sibling adds a card.
  canvas.dispatchEvent(up);
  overlayHit = { sourceId: 'ais-live-vessels', entryId: 'vessel:123' };
  handlers[0].click(click);
  assert.equal(layer.getDiagnostics().selectedId, 'ep162026');
  layer.setParams({ stormId: 'ep152026' });
  // A new gesture clears an unconsumed release snapshot.
  canvas.dispatchEvent(up);
  canvas.dispatchEvent(new Event('pointerdown'));
  overlayHit = null;
  handlers[0].click(click);
  assert.equal(layer.getDiagnostics().selectedId, 'ep162026');
  layer.setParams({ stormId: 'ep152026' });
  overlayHit = { sourceId: 'ais-live-vessels', entryId: 'vessel:123' };
  canvas.dispatchEvent(up);
  overlayHit = null;
  handlers[0].click({ position: { x: 15, y: 25 } });
  assert.equal(
    layer.getDiagnostics().selectedId,
    'ep162026',
    'a different click cannot reuse the captured card',
  );
  layer.setParams({ stormId: 'ep152026' });
  overlayHit = { sourceId: 'cctv', entryId: 'camera:1' };
  const before = notices;
  handlers[0].click(click);
  assert.equal(layer.getDiagnostics().selectedId, 'ep162026');
  assert.match(layer.getRowControls().summary.detail, /Another system/);
  assert.equal(layer.getRowControls().list.items[1].active, true);
  assert.ok(notices > before);
  assert.equal(viewer.trackedEntity, null);
  picked = undefined;
  overlayHit = { sourceId: 'ais-live-vessels' };
  handlers[0].click(click);
  assert.equal(layer.getDiagnostics().selectedId, 'ep162026');
  overlayHit = null;
  handlers[0].click(click);
  assert.equal(layer.getDiagnostics().selectedId, null);
  assert.equal(layer.getDiagnostics().selectionIntent, 'cleared');
  picked = { id: pickedEntity };
  handlers[0].click(click);
  assert.equal(layer.getDiagnostics().selectedId, 'ep162026');
  picked = { id: 'flight:abc', primitive: {} };
  handlers[0].click(click);
  assert.equal(
    layer.getDiagnostics().selectedId,
    'ep162026',
    "another layer's pick leaves the selection alone",
  );
  picked = { content: {}, primitive: {} };
  handlers[0].click(click);
  assert.equal(
    layer.getDiagnostics().selectedId,
    null,
    '3D Tiles surface content is empty map',
  );
  assert.equal(layer.getDiagnostics().selectionIntent, 'cleared');
  await layer.update();
  assert.equal(layer.getDiagnostics().selectedId, null);
  assert.equal(
    isPointerFree(),
    true,
    'ambient selection never claims the pointer',
  );
  layer.disable();
  assert.equal(
    isOwnedByOtherLayer('flights', 'cyclone:ep162026:center'),
    false,
  );
  assert.equal(handlers[0].destroyed, true);
  assert.equal(layer.getDiagnostics().selectionActive, false);
  const afterDisable = picks;
  const afterDisableOverlay = overlayTests;
  canvas.dispatchEvent(up);
  assert.equal(
    overlayTests,
    afterDisableOverlay,
    'disable removes native capture listeners',
  );
  handlers[0].click(click);
  assert.equal(picks, afterDisable, 'queued disabled callback is inert');
  layer.enable();
  await layer.update();
  assert.equal(isOwnedByOtherLayer('flights', 'cyclone:ep162026:center'), true);
  handlers[0].click(click);
  assert.equal(
    picks,
    afterDisable,
    'superseded handler remains inert after re-enable',
  );
  assert.equal(handlers.length, 2);
  layer.destroy();
  assert.equal(
    isOwnedByOtherLayer('flights', 'cyclone:ep162026:center'),
    false,
  );
  assert.equal(handlers[1].destroyed, true);
});
test('[cyclones-024] a click on a storm card or lead-hour label selects that storm without picking', async () => {
  const handlers = [];
  let picks = 0,
    overlayHit = null,
    hostArgument;
  const layer = createCyclonesLayer({
    feed: { getSnapshot: async () => snapshot([storm(), storm('ep162026')]) },
    cesium: {
      ScreenSpaceEventType: { LEFT_CLICK: 'left' },
      ScreenSpaceEventHandler: class {
        constructor() {
          handlers.push(this);
        }
        setInputAction(callback) {
          this.click = callback;
        }
        destroy() {}
      },
    },
    overlayHost: 'host',
    createRendering: ({ overlayHost }) => {
      hostArgument = overlayHost;
      return {
        setSnapshot: async () => true,
        setSelection() {},
        clear() {},
        destroy() {},
        pickStorm: () => null,
        ownsPickId: () => false,
        getDiagnostics: () => ({}),
      };
    },
    hitTestOverlay: () => overlayHit,
  });
  const canvas = new EventTarget();
  canvas.getBoundingClientRect = () => ({ left: 0, top: 0 });
  layer.init({
    scene: {
      canvas,
      pick() {
        picks++;
        return { content: {} };
      },
    },
  });
  assert.equal(hostArgument, 'host', 'the overlay host reaches the renderer');
  layer.enable();
  await layer.update();
  assert.equal(layer.getDiagnostics().selectedId, 'ep152026');
  const click = { position: { x: 10, y: 20 } };
  overlayHit = { sourceId: 'weather-cyclones', entryId: 'storm:ep162026' };
  handlers[0].click(click);
  assert.equal(layer.getDiagnostics().selectedId, 'ep162026');
  assert.equal(layer.getDiagnostics().selectionIntent, 'user');
  overlayHit = { sourceId: 'weather-cyclones', entryId: 'lead:ep152026:24' };
  handlers[0].click(click);
  assert.equal(layer.getDiagnostics().selectedId, 'ep152026');
  // A card from a superseded advisory is not empty map.
  overlayHit = { sourceId: 'weather-cyclones', entryId: 'storm:al019999' };
  handlers[0].click(click);
  assert.equal(layer.getDiagnostics().selectedId, 'ep152026');
  // The native release snapshot carries the card identity too.
  const up = new Event('pointerup');
  Object.assign(up, { clientX: 10, clientY: 20 });
  overlayHit = { sourceId: 'weather-cyclones', entryId: 'storm:ep162026' };
  canvas.dispatchEvent(up);
  overlayHit = null;
  handlers[0].click(click);
  assert.equal(layer.getDiagnostics().selectedId, 'ep162026');
  assert.equal(picks, 0, 'card clicks never fall through to the scene');
  handlers[0].click(click);
  assert.equal(picks, 1);
  assert.equal(layer.getDiagnostics().selectedId, null, 'empty map clears');
  layer.destroy();
});
function harness(
  feed = { getSnapshot: async () => snapshot() },
  { reducedMotion = false } = {},
) {
  const applied = [],
    navigation = [],
    opened = [];
  let cleared = 0,
    destroyed = 0,
    selection = null;
  const rendering = {
    async setSnapshot(value) {
      applied.push(value);
      return true;
    },
    setSelection(id) {
      selection = id;
    },
    getFocusSphere: () => ({ radius: 500000 }),
    clear() {
      cleared++;
    },
    destroy() {
      destroyed++;
    },
    getDiagnostics: () => ({
      entities: applied.at(-1)?.storms.length || 0,
      timerActive: false,
    }),
  };
  const layer = createCyclonesLayer({
    feed,
    createRendering: () => rendering,
    matchMedia: () => ({ matches: reducedMotion }),
    openLink: (url) => opened.push(url),
  });
  const viewer = {
    camera: {
      flyToBoundingSphere: (sphere, options) =>
        navigation.push({ sphere, options }),
    },
  };
  layer.init(viewer);
  layer.attachShellServices({
    runNavigation: (fn) => {
      navigation.push('claimed');
      return fn();
    },
  });
  return {
    layer,
    applied,
    navigation,
    opened,
    get cleared() {
      return cleared;
    },
    get destroyed() {
      return destroyed;
    },
    get selection() {
      return selection;
    },
  };
}
test('[cyclones-023] refresh preserves selection intent, including explicit clears and missing storms', async () => {
  let next = snapshot([storm(), storm('ep162026')]);
  const h = harness({ getSnapshot: async () => next });
  h.layer.enable();
  await h.layer.update();
  assert.equal(h.selection, 'ep152026');
  assert.equal(h.layer.getDiagnostics().selectionIntent, 'auto');
  next = snapshot([storm('ep162026')]);
  await h.layer.update();
  assert.equal(h.selection, 'ep162026');
  assert.equal(h.layer.getDiagnostics().selectionIntent, 'auto');
  next = snapshot([storm(), storm('ep162026')]);
  h.layer.setParams({ stormId: 'ep162026' });
  h.layer.setParams({ stormId: 'ep162026' });
  await h.layer.update();
  assert.equal(h.selection, 'ep162026');
  assert.equal(h.layer.getDiagnostics().selectionIntent, 'user');
  assert.equal(h.navigation.length, 0);
  next = snapshot([storm()]);
  await h.layer.update();
  assert.equal(h.selection, 'ep152026');
  assert.equal(h.layer.getDiagnostics().selectionIntent, 'user');
  for (const clear of [{ stormId: null }, { clear: true }]) {
    h.layer.setParams({ stormId: 'ep152026' });
    h.layer.setParams(clear);
    assert.equal(h.selection, null);
    assert.equal(h.layer.getDiagnostics().selectionIntent, 'cleared');
    await h.layer.update();
    assert.equal(h.selection, null);
    assert.equal(h.layer.getRowControls().summary.detail, '1 active storm');
  }
  h.layer.disable();
  assert.equal(h.layer.getDiagnostics().selectionIntent, 'auto');
  h.layer.enable();
  await h.layer.update();
  assert.equal(h.selection, 'ep152026');
  h.layer.destroy();
});

test('[cyclones-023] clearing while a refreshed data source is staging cannot reselect a storm', async () => {
  const staged = deferred();
  const staging = deferred();
  let calls = 0;
  const layer = createCyclonesLayer({
    feed: { getSnapshot: async () => snapshot() },
    createRendering: () => ({
      setSnapshot() {
        if (++calls === 1) return true;
        staging.resolve();
        return staged.promise;
      },
      setSelection() {},
      getDiagnostics: () => ({}),
      clear() {},
      destroy() {},
    }),
  });
  layer.init({});
  layer.enable();
  await layer.update();
  assert.equal(layer.getDiagnostics().selectedId, 'ep152026');
  const pending = layer.update();
  await staging.promise;
  layer.setParams({ clear: true });
  staged.resolve(true);
  await pending;
  assert.equal(layer.getDiagnostics().selectedId, null);
  assert.equal(layer.getDiagnostics().selectionIntent, 'cleared');
  layer.destroy();
});

test('[cyclones-025] queued focus is revoked by selection changes, clears, refresh fallback and teardown', async () => {
  for (const change of ['select', 'clear', 'fallback', 'disable', 'destroy']) {
    let next = snapshot([storm(), storm('ep162026')]);
    const h = harness({ getSnapshot: async () => next });
    const callbacks = [];
    h.layer.attachShellServices({ runNavigation: (fn) => callbacks.push(fn) });
    h.layer.enable();
    await h.layer.update();
    h.layer.setParams({ stormId: 'ep152026', focus: true });
    if (change === 'select') {
      h.layer.setParams({ stormId: 'ep162026' });
      h.layer.setParams({ stormId: 'ep152026' });
    } else if (change === 'clear') h.layer.setParams({ stormId: null });
    else if (change === 'fallback') {
      next = snapshot([storm('ep162026')]);
      await h.layer.update();
    } else h.layer[change]();
    callbacks.shift()();
    assert.equal(h.navigation.length, 0, change);
    h.layer.destroy();
  }
});

test('[cyclones-023 cyclones-025] only the latest queued focus runs and an unchanged selection survives refresh', async () => {
  const h = harness();
  const callbacks = [];
  h.layer.attachShellServices({ runNavigation: (fn) => callbacks.push(fn) });
  h.layer.enable();
  await h.layer.update();
  h.layer.setParams({ stormId: 'ep152026', focus: true });
  h.layer.setParams({ stormId: 'ep152026', focus: true });
  await h.layer.update();
  callbacks[0]();
  assert.equal(h.navigation.length, 0);
  callbacks[1]();
  assert.equal(h.navigation.length, 1);
  assert.equal(h.navigation[0].options.duration, 1.4);
  h.layer.destroy();
});
test('[cyclones-021] classification display expands known codes without altering the source or guessing unknown meanings', async () => {
  for (const [code, label] of [
    ['PTC', 'Potential tropical cyclone'],
    ['HU', 'Hurricane'],
    ['TS', 'Tropical storm'],
    ['TD', 'Tropical depression'],
    ['SS', 'Subtropical storm'],
    ['SD', 'Subtropical depression'],
    ['EX', 'EX'],
    ['UNKNOWN', 'UNKNOWN'],
  ]) {
    const record = { ...storm(), classification: code };
    const h = harness({ getSnapshot: async () => snapshot([record]) });
    try {
      h.layer.enable();
      await h.layer.update();
      const controls = h.layer.getRowControls();
      assert.ok(controls.summary.detail.includes(` · ${label} · `));
      assert.ok(controls.list.items[0].text.includes(` · ${label} · `));
      assert.equal(record.classification, code);
      assert.equal(h.applied[0].storms[0].classification, code);
    } finally {
      h.layer.destroy();
    }
  }
});
test('[cyclones-021 cyclones-025] advisory selection uses accessible row descriptors and shared camera handoff', async () => {
  const h = harness(
    { getSnapshot: async () => snapshot([storm(), storm('ep162026')]) },
    { reducedMotion: true },
  );
  h.layer.enable();
  assert.equal(await h.layer.update(), true);
  const controls = h.layer.getRowControls();
  assert.equal(controls.readout, true);
  assert.deepEqual(controls.chips, []);
  assert.equal(controls.summary.coverage, 'Atlantic · E/C Pacific');
  assert.equal(controls.summary.actions[0].href, storm().advisoryUrl);
  assert.equal(controls.summary.lines.length, 3);
  assert.deepEqual(controls.summary.settings, []);
  assert.deepEqual(controls.summary.actions, [
    { id: 'advisory', label: 'Official advisory ↗', href: storm().advisoryUrl },
  ]);
  assert.match(controls.summary.compact, /2 active storms · .* selected/);
  assert.equal(controls.summary.sections, undefined);
  assert.match(controls.list.ariaLabel, /NHC/);
  assert.equal(controls.list.items.length, 2);
  assert.equal(controls.list.items[0].active, true);
  assert.match(controls.info, /awaiting advisory 10/);
  assert.equal(
    controls.info.split('Track/cone awaiting advisory 10').length - 1,
    1,
  );
  assert.equal(controls.summary.status, 'Track/cone awaiting advisory 10');
  assert.match(controls.info, /09-16 03:00 UTC/);
  assert.match(controls.infoTitle, /not storm size/);
  assert.match(controls.infoTitle, /follows the surface/);
  assert.equal(controls.list.items[1].params.focus, true);
  assert.equal(
    controls.chips.some((chip) => chip.id === 'focus'),
    false,
  );
  h.layer.setParams(controls.list.items[1].params);
  assert.equal(h.selection, 'ep162026');
  assert.equal(h.navigation[0], 'claimed');
  assert.equal(h.navigation[1].options.duration, 0);
  h.layer.setParams(controls.list.items[1].params);
  assert.equal(h.navigation.length, 4, 'selected row focuses again');
  h.layer.setParams({ advisory: true });
  assert.match(h.opened[0], /^https:\/\/www\.nhc\.noaa\.gov\/text\//);
  h.layer.disable();
  h.layer.setParams({ focus: true, advisory: true });
  assert.equal(h.navigation.length, 4);
  assert.equal(h.opened.length, 1);
  assert.equal(h.layer.getStats().count, 0);
  assert.equal(h.layer.getDiagnostics().timerActive, false);
  h.layer.destroy();
  assert.equal(h.destroyed, 1);
});
test('[cyclones-020 cyclones-021] empty successful coverage, unavailable source and stale advisory are different states', async () => {
  let next = snapshot([]);
  const h = harness({ getSnapshot: async () => next });
  h.layer.enable();
  await h.layer.update();
  assert.equal(h.layer.getStats().empty, true);
  assert.match(h.layer.getRowControls().summary.detail, /No active NHC\/CPHC/);
  next = { ...snapshot(), stale: true };
  await h.layer.update();
  assert.match(h.layer.getRowControls().summary.status, /stale/);
  assert.match(
    h.layer.getRowControls().info,
    /Track\/cone awaiting advisory 10/,
  );
  assert.match(h.layer.getRowControls().info, /Cached advisory · stale source/);
  next = {
    ...snapshot([]),
    unavailable: true,
    reason: 'Cyclone data unavailable',
  };
  await h.layer.update();
  assert.equal(h.layer.getStats().empty, false);
  assert.match(h.layer.getRowControls().summary.status, /unavailable/);
  assert.ok(h.cleared > 0);
  h.layer.destroy();
});
test('[cyclones-020] disabled and superseded sources cannot publish late advisories even if they ignore abort', async () => {
  const first = deferred(),
    second = deferred();
  const signals = [];
  let calls = 0;
  const h = harness({
    getSnapshot: ({ signal }) => {
      signals.push(signal);
      return (++calls === 1 ? first : second).promise;
    },
  });
  h.layer.enable();
  const old = h.layer.update(),
    latest = h.layer.update();
  assert.equal(signals[0].aborted, true);
  second.resolve(snapshot());
  assert.equal(await latest, true);
  first.resolve(snapshot([storm('ep162026')]));
  assert.equal(await old, false);
  assert.equal(h.applied.length, 1);
  assert.equal(h.selection, 'ep152026');
  h.layer.destroy();
  const delayed = deferred();
  const disabled = harness({ getSnapshot: () => delayed.promise });
  disabled.layer.enable();
  const work = disabled.layer.update();
  disabled.layer.disable();
  delayed.resolve(snapshot());
  assert.equal(await work, false);
  assert.equal(disabled.applied.length, 0);
  assert.equal(disabled.layer.getDiagnostics().requestPending, false);
  disabled.layer.destroy();
});
test('[cyclones-020] external cancellation and acquisition failure cannot install or retain unlabeled advisory geometry', async () => {
  let fail = false;
  const h = harness({
    getSnapshot: async () => {
      if (fail) throw new Error('Network unavailable');
      return snapshot();
    },
  });
  h.layer.enable();
  assert.equal(
    await h.layer.update(undefined, { signal: AbortSignal.abort() }),
    false,
  );
  assert.equal(h.applied.length, 0);
  await h.layer.update();
  fail = true;
  await h.layer.update();
  assert.equal(h.layer.getStats().count, 0);
  assert.match(h.layer.getStats().error, /Network/);
  assert.ok(h.cleared > 0);
  h.layer.destroy();
});

/** A renderer that records its calls; each method can be replaced. */
function fakeRendering(overrides = {}) {
  const log = [];
  const rendering = {
    setSnapshot: async (value) => {
      log.push(['snapshot', value]);
      return true;
    },
    setSelection: (id) => log.push(['selection', id]),
    getFocusSphere: () => ({ radius: 500000 }),
    clear: () => log.push(['clear']),
    destroy: () => log.push(['destroy']),
    pickStorm: () => null,
    ownsPickId: () => false,
    getDiagnostics: () => ({ storms: 0 }),
    ...overrides,
  };
  return { rendering, log };
}
const TITLE =
  'Select a storm on the map, or choose a storm in the list to select it and move the camera. Click empty map space to clear the selection. NOAA NHC/CPHC advisory context. The cone describes forecast center-track uncertainty, not storm size or the full hazard area. Forecast point labels are source lead hours, not times computed from advisory issuance. Geometry follows the surface; height is not weather altitude. Consult the official advisory.';
const DEFAULT_COVERAGE =
  'Atlantic and eastern/central North Pacific; not worldwide cyclone coverage.';
const ADVISORY_URL = 'https://www.nhc.noaa.gov/text/MIATCMEP5.shtml';

/** A layer with a controllable feed and renderer. */
function plainLayer({ feed, rendering = fakeRendering().rendering, ...rest }) {
  const layer = createCyclonesLayer({
    feed,
    createRendering: () => rendering,
    ...rest,
  });
  layer.init({ camera: {} });
  return layer;
}

test('[cyclones-018] the layer has a fixed identity', () => {
  const layer = createCyclonesLayer({
    feed: { getSnapshot: async () => snapshot() },
  });
  assert.equal(layer.id, 'weather-cyclones');
  assert.equal(layer.name, 'Cyclone advisories');
  assert.equal(layer.icon, '◉');
  assert.equal(layer.source, 'NOAA NHC / CPHC');
  assert.equal(layer.updateInterval, 300000);
});

test('[cyclones-018] a call with no snapshot source throws a TypeError', () => {
  for (const options of [
    undefined,
    {},
    { feed: null },
    { feed: {} },
    { feed: { getSnapshot: 'not a function' } },
  ])
    assert.throws(() => createCyclonesLayer(options), {
      name: 'TypeError',
      message: 'Cyclones require a snapshot source',
    });
});

test('[cyclones-019] the pick owner claims an id only after enable and before disable, when the renderer owns it exactly', () => {
  const { rendering } = fakeRendering({
    ownsPickId: (id) => (id === 'owned' ? true : id === 'truthy' ? 1 : false),
  });
  const layer = plainLayer({
    feed: { getSnapshot: async () => snapshot() },
    rendering,
  });
  assert.equal(isOwnedByOtherLayer('flights', 'owned'), false);
  layer.enable();
  assert.equal(isOwnedByOtherLayer('flights', 'owned'), true);
  assert.equal(isOwnedByOtherLayer('flights', 'truthy'), false);
  assert.equal(isOwnedByOtherLayer('flights', 'other'), false);
  layer.disable();
  assert.equal(isOwnedByOtherLayer('flights', 'owned'), false);
  layer.enable();
  layer.destroy();
  assert.equal(isOwnedByOtherLayer('flights', 'owned'), false);
  const bare = plainLayer({
    feed: { getSnapshot: async () => snapshot() },
    rendering: { clear() {}, destroy() {}, getDiagnostics: () => ({}) },
  });
  bare.enable();
  assert.equal(isOwnedByOtherLayer('flights', 'owned'), false);
  bare.destroy();
});

test('[cyclones-019] the layer installs no click handler without a canvas or without a Cesium handler class', () => {
  const type = { LEFT_CLICK: 'left' };
  class Handler {
    constructor() {
      throw new Error('no handler must be made');
    }
  }
  for (const [label, cesium, viewer] of [
    [
      'no scene',
      { ScreenSpaceEventType: type, ScreenSpaceEventHandler: Handler },
      {},
    ],
    [
      'no canvas',
      { ScreenSpaceEventType: type, ScreenSpaceEventHandler: Handler },
      { scene: {} },
    ],
    [
      'no handler class',
      { ScreenSpaceEventType: type },
      { scene: { canvas: new EventTarget() } },
    ],
    [
      'handler that is not a class',
      { ScreenSpaceEventType: type, ScreenSpaceEventHandler: {} },
      { scene: { canvas: new EventTarget() } },
    ],
  ]) {
    const layer = createCyclonesLayer({
      feed: { getSnapshot: async () => snapshot() },
      cesium,
      createRendering: () => fakeRendering().rendering,
    });
    layer.init(viewer);
    layer.enable();
    assert.equal(layer.getDiagnostics().enabled, true, label);
    assert.equal(layer.getDiagnostics().selectionActive, false, label);
    layer.destroy();
  }
});

test('[cyclones-019] disable destroys the click handler once, and never when Cesium destroyed it already', () => {
  for (const [label, isDestroyed, expected] of [
    ['no isDestroyed method', undefined, 1],
    ['isDestroyed is false', () => false, 1],
    ['isDestroyed is true', () => true, 0],
  ]) {
    let destroys = 0;
    class Handler {
      setInputAction() {}
      destroy() {
        destroys++;
      }
    }
    if (isDestroyed) Handler.prototype.isDestroyed = isDestroyed;
    const layer = createCyclonesLayer({
      feed: { getSnapshot: async () => snapshot() },
      cesium: {
        ScreenSpaceEventType: { LEFT_CLICK: 'left' },
        ScreenSpaceEventHandler: Handler,
      },
      createRendering: () => fakeRendering().rendering,
    });
    layer.init({ scene: { canvas: new EventTarget() } });
    layer.enable();
    assert.equal(layer.getDiagnostics().selectionActive, true, label);
    layer.disable();
    layer.disable();
    assert.equal(destroys, expected, label);
    assert.equal(layer.getDiagnostics().selectionActive, false, label);
    layer.destroy();
  }
});

test('[cyclones-019] disable aborts the request, resets the state and clears the renderer, and destroy releases the renderer once', async () => {
  const pending = deferred();
  const signals = [];
  const { rendering, log } = fakeRendering();
  const layer = plainLayer({
    feed: {
      getSnapshot: ({ signal }) => {
        signals.push(signal);
        return pending.promise;
      },
    },
    rendering,
  });
  layer.enable();
  const work = layer.update();
  assert.equal(layer.getStats().loading, true);
  assert.equal(layer.getDiagnostics().requestPending, true);
  layer.disable();
  assert.equal(signals[0].aborted, true);
  assert.deepEqual(layer.getStats(), {
    count: 0,
    lastUpdate: null,
    loading: false,
    error: null,
    stale: false,
    source: 'NOAA NHC / CPHC',
    advisoryAt: null,
    empty: false,
  });
  assert.deepEqual(
    log.map(([kind]) => kind),
    ['clear'],
  );
  pending.resolve(snapshot());
  assert.equal(await work, false);
  layer.destroy();
  layer.destroy();
  assert.deepEqual(
    log.map(([kind]) => kind),
    ['clear', 'clear', 'destroy'],
  );
  layer.enable();
  assert.equal(layer.getDiagnostics().enabled, false);
});

test('[cyclones-019] a layer that never had a viewer can enable, disable and destroy', () => {
  const layer = createCyclonesLayer({
    feed: { getSnapshot: async () => snapshot() },
  });
  layer.enable();
  layer.disable();
  layer.destroy();
  assert.deepEqual(layer.getDiagnostics(), {
    enabled: false,
    loading: false,
    requestPending: false,
    selectionActive: false,
    selectedId: null,
    selectionIntent: 'auto',
    timerActive: false,
  });
});

test('[cyclones-020] update does nothing for a disabled or destroyed layer', async () => {
  let calls = 0;
  const layer = plainLayer({
    feed: {
      getSnapshot: async () => {
        calls++;
        return snapshot();
      },
    },
  });
  assert.equal(await layer.update(), false);
  layer.enable();
  layer.disable();
  assert.equal(await layer.update(), false);
  layer.enable();
  layer.destroy();
  assert.equal(await layer.update(), false);
  assert.equal(calls, 0);
  assert.equal(layer.getStats().loading, false);
});

test('[cyclones-020] an update that the renderer does not apply returns false and keeps the earlier snapshot', async () => {
  let apply = true;
  let next = snapshot([storm(), storm('ep162026')]);
  const { rendering } = fakeRendering({ setSnapshot: async () => apply });
  const layer = plainLayer({
    feed: { getSnapshot: async () => next },
    rendering,
  });
  layer.enable();
  assert.equal(await layer.update(), true);
  assert.equal(layer.getStats().count, 2);
  apply = false;
  next = snapshot([storm()]);
  assert.equal(await layer.update(), false);
  assert.equal(layer.getStats().count, 2);
  assert.equal(layer.getStats().loading, false);
  assert.equal(layer.getStats().error, null);
});

test('[cyclones-020] a disable, a newer request or an abort while the renderer stages stops the update', async () => {
  for (const how of ['disable', 'newer', 'abort']) {
    const staged = deferred();
    let stagings = 0;
    const { rendering } = fakeRendering({
      setSnapshot: (value) => {
        if (value.storms.length !== 1) return true;
        stagings++;
        return staged.promise;
      },
    });
    let next = snapshot([storm(), storm('ep162026')]);
    const layer = plainLayer({
      feed: { getSnapshot: async () => next },
      rendering,
    });
    layer.enable();
    assert.equal(await layer.update(), true, how);
    next = snapshot([storm('ep162026')]);
    const caller = new AbortController();
    const second = layer.update(undefined, { signal: caller.signal });
    await new Promise((resolve) => setImmediate(resolve));
    assert.equal(stagings, 1, `${how}: the renderer stages`);
    let third = null;
    if (how === 'disable') layer.disable();
    else if (how === 'abort') caller.abort();
    else {
      next = snapshot([storm(), storm('ep162026')]);
      third = layer.update();
    }
    staged.resolve(true);
    assert.equal(await second, false, how);
    if (third) assert.equal(await third, true, how);
    assert.equal(layer.getStats().count, how === 'disable' ? 0 : 2, how);
    layer.destroy();
  }
});

test('[cyclones-020] an unavailable snapshot clears the renderer, drops the selection and sets the error to its reason or to the default text', async () => {
  let next = snapshot([storm(), storm('ep162026')]);
  const { rendering, log } = fakeRendering();
  const layer = plainLayer({
    feed: { getSnapshot: async () => next },
    rendering,
  });
  layer.enable();
  await layer.update();
  assert.equal(layer.getDiagnostics().selectedId, 'ep152026');
  const before = log.filter(([kind]) => kind === 'snapshot').length;
  next = {
    ...snapshot([]),
    unavailable: true,
    reason: 'Cyclone data unavailable',
  };
  assert.equal(await layer.update(), true);
  assert.equal(layer.getStats().error, 'Cyclone data unavailable');
  assert.equal(layer.getDiagnostics().selectedId, null);
  assert.equal(log.filter(([kind]) => kind === 'snapshot').length, before);
  assert.equal(log.filter(([kind]) => kind === 'clear').length, 1);
  assert.equal(layer.getStats().count, 0);
  assert.equal(layer.getStats().empty, false);
  next = { ...snapshot([]), unavailable: true, reason: null };
  await layer.update();
  assert.equal(layer.getStats().error, 'Cyclone advisories unavailable');
  next = snapshot();
  await layer.update();
  assert.equal(layer.getStats().error, null);
  assert.equal(layer.getDiagnostics().selectedId, 'ep152026');
  layer.destroy();
});

test('[cyclones-020] a failed request sets the error to its message or to the default text, clears the state and returns true', async () => {
  let failing = false;
  let cause;
  const { rendering, log } = fakeRendering();
  const layer = plainLayer({
    feed: {
      getSnapshot: async () => {
        if (failing) throw cause;
        return snapshot();
      },
    },
    rendering,
  });
  layer.enable();
  for (const [reason, expected] of [
    [new Error('Network unavailable'), 'Network unavailable'],
    [new Error(''), 'Cyclone advisories unavailable'],
    [{}, 'Cyclone advisories unavailable'],
    ['text', 'Cyclone advisories unavailable'],
    [undefined, 'Cyclone advisories unavailable'],
  ]) {
    failing = false;
    await layer.update();
    assert.equal(layer.getStats().count, 1);
    assert.equal(layer.getStats().error, null);
    assert.equal(layer.getDiagnostics().selectedId, 'ep152026');
    const clears = log.filter(([kind]) => kind === 'clear').length;
    failing = true;
    cause = reason;
    assert.equal(await layer.update(), true, expected);
    assert.equal(layer.getStats().error, expected);
    assert.equal(layer.getStats().count, 0);
    assert.equal(layer.getDiagnostics().selectedId, null);
    assert.equal(log.filter(([kind]) => kind === 'clear').length, clears + 1);
  }
  layer.destroy();
});

test('[cyclones-020] a failure of a request that a newer request or an abort replaced changes nothing', async () => {
  const late = deferred();
  let calls = 0;
  const { rendering, log } = fakeRendering();
  const layer = plainLayer({
    feed: {
      getSnapshot: ({ signal }) => {
        calls++;
        if (calls === 1) return late.promise;
        if (calls === 2) return Promise.resolve(snapshot());
        return new Promise((_resolve, reject) =>
          signal.addEventListener('abort', () => reject(signal.reason), {
            once: true,
          }),
        );
      },
    },
    rendering,
  });
  layer.enable();
  const old = layer.update();
  const latest = layer.update();
  assert.equal(await latest, true);
  const clears = log.filter(([kind]) => kind === 'clear').length;
  late.reject(new Error('late failure'));
  assert.equal(await old, false);
  assert.equal(layer.getStats().error, null);
  assert.equal(layer.getStats().count, 1);
  assert.equal(log.filter(([kind]) => kind === 'clear').length, clears);
  const caller = new AbortController();
  const stopped = layer.update(undefined, { signal: caller.signal });
  caller.abort(new Error('caller stop'));
  assert.equal(await stopped, false);
  assert.equal(layer.getStats().error, null);
  assert.equal(layer.getStats().count, 1);
  assert.equal(layer.getStats().loading, false);
  assert.equal(log.filter(([kind]) => kind === 'clear').length, clears);
  layer.destroy();
});

test('[cyclones-020] a caller abort during the request aborts it, and the layer removes its listener when the call ends', async () => {
  const caller = new AbortController();
  const signals = [];
  const layer = plainLayer({
    feed: {
      getSnapshot: ({ signal }) => {
        signals.push(signal);
        return signals.length === 1
          ? new Promise((_resolve, reject) =>
              signal.addEventListener('abort', () => reject(signal.reason), {
                once: true,
              }),
            )
          : Promise.resolve(snapshot());
      },
    },
  });
  layer.enable();
  const work = layer.update(undefined, { signal: caller.signal });
  assert.equal(signals[0].aborted, false);
  const reason = new Error('caller stop');
  caller.abort(reason);
  assert.equal(await work, false);
  assert.equal(signals[0].aborted, true);
  assert.equal(signals[0].reason, reason);
  assert.equal(layer.getDiagnostics().requestPending, false);
  const other = new AbortController();
  assert.equal(await layer.update(undefined, { signal: other.signal }), true);
  other.abort(new Error('after the call'));
  assert.equal(signals[1].aborted, false);
  layer.destroy();
});

test('[cyclones-020] the listener runs at the start of a request and at the end of the newest request, and the load flag holds between', async () => {
  const gates = [deferred(), deferred()];
  let call = 0;
  const layer = plainLayer({
    feed: { getSnapshot: () => gates[call++].promise },
  });
  let notices = 0;
  layer.setRowControlsListener(() => notices++);
  layer.enable();
  const first = layer.update();
  assert.equal(notices, 1);
  assert.equal(layer.getStats().loading, true);
  const second = layer.update();
  assert.equal(notices, 2);
  gates[0].resolve(snapshot([storm('ep162026')]));
  assert.equal(await first, false);
  assert.equal(layer.getStats().loading, true);
  assert.equal(layer.getDiagnostics().requestPending, true);
  assert.equal(notices, 2);
  gates[1].resolve(snapshot());
  assert.equal(await second, true);
  assert.equal(layer.getStats().loading, false);
  assert.equal(layer.getDiagnostics().requestPending, false);
  assert.equal(notices, 3);
  layer.setRowControlsListener('not a function');
  await layer.update().catch(() => {});
  assert.equal(notices, 3);
  layer.destroy();
});

test('[cyclones-021] the row controls of a selected storm with a coherent track and cone', async () => {
  const record = {
    ...storm(),
    geometryStatus: 'current',
    geometryAdvisoryNumber: '10',
  };
  const h = harness({ getSnapshot: async () => snapshot([record]) });
  h.layer.enable();
  await h.layer.update();
  const detail =
    'Fifteen-E · Potential tropical cyclone · Advisory 10 · issued 09-16 03:00 UTC';
  assert.deepEqual(h.layer.getRowControls(), {
    readout: true,
    summary: {
      label: 'Cyclones · NHC / CPHC',
      coverage: 'Atlantic · E/C Pacific',
      compact: '1 active storm · Fifteen-E selected',
      actions: [
        { id: 'advisory', label: 'Official advisory ↗', href: ADVISORY_URL },
      ],
      settings: [],
      lines: [
        { id: 'position', text: 'Position as of 09-16 03:00 UTC', muted: true },
        {
          id: 'intensity',
          text: 'Maximum sustained wind: 25 kt · Pressure: 1006 hPa',
        },
        {
          id: 'geometry',
          text: 'Track and cone match this advisory',
          muted: true,
        },
      ],
      detail,
      status: null,
      units: 'kt',
    },
    list: {
      ariaLabel: 'Active NHC and CPHC cyclone advisories',
      items: [
        {
          id: 'ep152026',
          ordinal: 1,
          lead: 'EP',
          text: 'Fifteen-E · Potential tropical cyclone · 25 kt',
          active: true,
          params: { stormId: 'ep152026', focus: true },
        },
      ],
    },
    chips: [],
    legend: [
      { label: 'Advisory center / forecast track', color: '#7fe6ed' },
      { label: 'Center-track uncertainty cone', color: '#7fe6ed44' },
    ],
    info: `${detail}\nPosition as of 09-16 03:00 UTC\nMaximum sustained wind: 25 kt · Pressure: 1006 hPa\nTrack and cone match this advisory\nAtlantic and eastern/central North Pacific`,
    infoTitle: TITLE,
  });
  h.layer.destroy();
});

test('[cyclones-021] a code that names an inherited property of an object shows as it is', async () => {
  for (const code of [
    'toString',
    'constructor',
    '__proto__',
    'hasOwnProperty',
  ]) {
    const record = { ...storm(), classification: code };
    const h = harness({ getSnapshot: async () => snapshot([record]) });
    h.layer.enable();
    await h.layer.update();
    const controls = h.layer.getRowControls();
    assert.equal(
      controls.summary.detail,
      `Fifteen-E · ${code} · Advisory 10 · issued 09-16 03:00 UTC`,
    );
    assert.equal(controls.list.items[0].text, `Fifteen-E · ${code} · 25 kt`);
    h.layer.destroy();
  }
});

test('[cyclones-021] a storm with no wind, pressure or time shows Unavailable, and a geometry that waits shows the advisory number', async () => {
  const record = {
    ...storm(),
    windKt: null,
    pressureHpa: null,
    issuedAt: null,
    positionAt: null,
    advisoryUrl: null,
  };
  const h = harness({ getSnapshot: async () => snapshot([record]) });
  h.layer.enable();
  await h.layer.update();
  const controls = h.layer.getRowControls();
  const detail =
    'Fifteen-E · Potential tropical cyclone · Advisory 10 · issued Unavailable';
  assert.equal(controls.summary.detail, detail);
  assert.deepEqual(controls.summary.actions, []);
  assert.deepEqual(controls.summary.lines, [
    { id: 'position', text: 'Position as of Unavailable', muted: true },
    {
      id: 'intensity',
      text: 'Maximum sustained wind: Unavailable · Pressure: Unavailable',
    },
    {
      id: 'geometry',
      text: 'Track/cone awaiting advisory 10',
      muted: true,
    },
  ]);
  assert.equal(controls.summary.status, 'Track/cone awaiting advisory 10');
  assert.equal(
    controls.list.items[0].text,
    'Fifteen-E · Potential tropical cyclone · Wind unavailable',
  );
  assert.equal(
    controls.info,
    `${detail}\nPosition as of Unavailable\nMaximum sustained wind: Unavailable · Pressure: Unavailable\nTrack/cone awaiting advisory 10\nAtlantic and eastern/central North Pacific`,
  );
  h.layer.destroy();
});

test('[cyclones-021] a storm with the geometry status unavailable shows the text Track/cone unavailable', async () => {
  const record = { ...storm(), geometryStatus: 'unavailable' };
  const h = harness({ getSnapshot: async () => snapshot([record]) });
  h.layer.enable();
  await h.layer.update();
  const controls = h.layer.getRowControls();
  assert.equal(controls.summary.lines[2].text, 'Track/cone unavailable');
  assert.equal(controls.summary.status, 'Track/cone unavailable');
  assert.equal(controls.info.split('Track/cone unavailable').length - 1, 1);
  h.layer.destroy();
});

test('[cyclones-021] the status shows the error first, then the stale text, then the wait text, then the geometry text', async () => {
  const script = [];
  const h = harness({ getSnapshot: () => script.shift()() });
  const step = (run) => script.push(run);
  const gate = deferred();
  h.layer.enable();
  step(() => gate.promise);
  const first = h.layer.update();
  const loading = h.layer.getRowControls();
  assert.equal(loading.summary.status, 'Loading advisories…');
  assert.equal(loading.summary.detail, 'Loading advisories…');
  assert.equal(loading.summary.compact, 'Loading advisories…');
  assert.deepEqual(loading.list.items, []);
  assert.equal(
    loading.info,
    `Loading advisories…\nLoading advisories…\n${DEFAULT_COVERAGE}`,
  );
  gate.resolve(snapshot());
  await first;
  assert.equal(
    h.layer.getRowControls().summary.status,
    'Track/cone awaiting advisory 10',
  );
  const tail = (controls) => controls.info.split('\n').slice(-3).join('\n');
  const more = deferred();
  step(() => more.promise);
  const second = h.layer.update();
  assert.equal(h.layer.getRowControls().summary.status, 'Loading advisories…');
  assert.equal(
    tail(h.layer.getRowControls()),
    'Track/cone awaiting advisory 10\nLoading advisories…\nAtlantic and eastern/central North Pacific',
  );
  more.resolve({ ...snapshot(), stale: true });
  await second;
  assert.equal(
    h.layer.getRowControls().summary.status,
    'Cached advisory · stale source',
  );
  assert.equal(
    tail(h.layer.getRowControls()),
    'Track/cone awaiting advisory 10\nCached advisory · stale source\nAtlantic and eastern/central North Pacific',
  );
  const third = deferred();
  step(() => third.promise);
  const refresh = h.layer.update();
  assert.equal(
    h.layer.getRowControls().summary.status,
    'Cached advisory · stale source',
    'the stale text wins over the loading text',
  );
  third.resolve(snapshot());
  await refresh;
  step(() => Promise.reject(new Error('Network unavailable')));
  await h.layer.update();
  const failed = h.layer.getRowControls();
  assert.equal(failed.summary.status, 'Network unavailable');
  assert.equal(failed.summary.detail, 'Advisories unavailable');
  assert.equal(failed.summary.compact, 'Advisories unavailable');
  assert.equal(
    failed.info,
    `Advisories unavailable\nNetwork unavailable\n${DEFAULT_COVERAGE}`,
  );
  assert.equal(failed.infoTitle, TITLE);
  assert.deepEqual(failed.summary.lines, []);
  assert.deepEqual(failed.legend, []);
  assert.equal(failed.summary.coverage, 'Atlantic · E/C Pacific');
  const last = deferred();
  step(() => last.promise);
  const retry = h.layer.update();
  const retrying = h.layer.getRowControls();
  assert.equal(retrying.summary.status, 'Network unavailable');
  assert.equal(retrying.summary.detail, 'Loading advisories…');
  last.resolve(snapshot());
  await retry;
  h.layer.destroy();
});

test('[cyclones-021] the detail counts the active storms when the layer has no selected storm, and it names the empty and the unavailable state', async () => {
  let next = snapshot([storm(), storm('ep162026')]);
  const h = harness({ getSnapshot: async () => next });
  h.layer.enable();
  await h.layer.update();
  h.layer.setParams({ clear: true });
  let controls = h.layer.getRowControls();
  assert.equal(controls.summary.detail, '2 active storms');
  assert.equal(controls.summary.compact, '2 active storms');
  assert.equal(controls.summary.status, null);
  assert.deepEqual(controls.summary.actions, []);
  assert.deepEqual(controls.summary.lines, []);
  assert.deepEqual(controls.legend, []);
  assert.equal(
    controls.info,
    '2 active storms\nAtlantic and eastern/central North Pacific',
  );
  assert.deepEqual(
    controls.list.items.map((item) => [item.ordinal, item.lead, item.active]),
    [
      [1, 'EP', false],
      [2, 'EP', false],
    ],
  );
  assert.equal(
    controls.list.items[1].text,
    'Another system · Potential tropical cyclone · 25 kt',
  );
  next = snapshot([storm()]);
  await h.layer.update();
  controls = h.layer.getRowControls();
  assert.equal(controls.summary.detail, '1 active storm');
  assert.equal(controls.summary.compact, '1 active storm');
  next = snapshot([]);
  await h.layer.update();
  controls = h.layer.getRowControls();
  assert.equal(controls.summary.detail, 'No active NHC/CPHC systems');
  assert.equal(controls.summary.compact, 'No active NHC/CPHC systems');
  assert.equal(controls.summary.status, null);
  assert.deepEqual(controls.list.items, []);
  assert.equal(
    controls.info,
    'No active NHC/CPHC systems\nAtlantic and eastern/central North Pacific',
  );
  next = {
    ...snapshot([]),
    unavailable: true,
    reason: 'Cyclone data unavailable',
  };
  await h.layer.update();
  controls = h.layer.getRowControls();
  assert.equal(controls.summary.detail, 'Advisories unavailable');
  assert.equal(controls.summary.status, 'Cyclone data unavailable');
  assert.equal(
    controls.info,
    'Advisories unavailable\nCyclone data unavailable\nAtlantic and eastern/central North Pacific',
  );
  h.layer.destroy();
});

test('[cyclones-021] the row controls before the first update show the unavailable state and the default coverage', () => {
  const h = harness();
  const controls = h.layer.getRowControls();
  assert.equal(controls.summary.detail, 'Advisories unavailable');
  assert.equal(controls.summary.compact, 'Advisories unavailable');
  assert.equal(controls.summary.status, null);
  assert.deepEqual(controls.list.items, []);
  assert.equal(controls.info, `Advisories unavailable\n${DEFAULT_COVERAGE}`);
  h.layer.destroy();
});

test('[cyclones-022] getStats reports the count, the times, the flags and the source of each state', async () => {
  const later = '2026-09-17T09:30:00.000Z';
  const h = harness({
    getSnapshot: async () => ({
      ...snapshot([{ ...storm(), issuedAt: later }, storm('ep162026')]),
      fetchedAt: 1758000000000,
    }),
  });
  assert.deepEqual(h.layer.getStats(), {
    count: 0,
    lastUpdate: null,
    loading: false,
    error: null,
    stale: false,
    source: 'NOAA NHC / CPHC',
    advisoryAt: null,
    empty: false,
  });
  h.layer.enable();
  await h.layer.update();
  assert.deepEqual(h.layer.getStats(), {
    count: 2,
    lastUpdate: 1789637400000,
    loading: false,
    error: null,
    stale: false,
    source: 'NOAA NHC / CPHC',
    advisoryAt: later,
    empty: false,
  });
  h.layer.setParams({ clear: true });
  assert.equal(h.layer.getStats().lastUpdate, 1758000000000);
  assert.equal(h.layer.getStats().advisoryAt, null);
  h.layer.destroy();
});

test('[cyclones-022] getStats reports a stale snapshot, an empty snapshot and an unavailable snapshot', async () => {
  let next = { ...snapshot(), stale: true };
  const h = harness({ getSnapshot: async () => next });
  h.layer.enable();
  await h.layer.update();
  assert.equal(h.layer.getStats().stale, true);
  assert.equal(h.layer.getStats().empty, false);
  next = snapshot([]);
  await h.layer.update();
  assert.equal(h.layer.getStats().empty, true);
  assert.equal(h.layer.getStats().stale, false);
  assert.equal(h.layer.getStats().count, 0);
  assert.equal(h.layer.getStats().lastUpdate, 1789527600000);
  next = { ...snapshot([]), unavailable: true, reason: 'Down' };
  await h.layer.update();
  assert.equal(h.layer.getStats().empty, false);
  assert.equal(h.layer.getStats().error, 'Down');
  h.layer.destroy();
});

test('[cyclones-022] getDiagnostics joins the renderer diagnostics with the state of the layer', async () => {
  const layer = plainLayer({
    feed: { getSnapshot: async () => snapshot() },
    rendering: fakeRendering({
      getDiagnostics: () => ({ storms: 1, entities: 3, timerActive: true }),
    }).rendering,
  });
  layer.enable();
  await layer.update();
  assert.deepEqual(layer.getDiagnostics(), {
    storms: 1,
    entities: 3,
    enabled: true,
    loading: false,
    requestPending: false,
    selectionActive: false,
    selectedId: 'ep152026',
    selectionIntent: 'auto',
    timerActive: false,
  });
  layer.destroy();
});

test('[cyclones-023] setParams ignores an id that is not a string or not in the snapshot, and it does nothing after disable or destroy', async () => {
  const h = harness({
    getSnapshot: async () => snapshot([storm(), storm('ep162026')]),
  });
  let notices = 0;
  h.layer.setRowControlsListener(() => notices++);
  h.layer.setParams({ stormId: 'ep162026' });
  assert.equal(h.selection, null);
  h.layer.enable();
  h.layer.setParams({ stormId: 'ep162026' });
  assert.equal(h.layer.getDiagnostics().selectedId, null, 'no snapshot yet');
  await h.layer.update();
  const before = notices;
  h.layer.setParams();
  for (const params of [
    {},
    { stormId: 5 },
    { stormId: 'al019999' },
    { stormId: undefined },
    { clear: false },
    { clear: 'yes' },
  ]) {
    h.layer.setParams(params);
    assert.equal(h.layer.getDiagnostics().selectedId, 'ep152026');
    assert.equal(h.layer.getDiagnostics().selectionIntent, 'auto');
  }
  assert.equal(notices, before);
  h.layer.setParams({ stormId: 'ep162026' });
  assert.equal(h.layer.getDiagnostics().selectedId, 'ep162026');
  assert.equal(notices, before + 1);
  assert.equal(h.selection, 'ep162026');
  h.layer.destroy();
  h.layer.setParams({ clear: true });
  assert.equal(h.layer.getDiagnostics().selectionIntent, 'auto');
});

test('[cyclones-025] an unavailable snapshot and a failed request cancel the queued focus', async () => {
  for (const change of ['unavailable', 'failure']) {
    let next = snapshot([storm()]);
    const h = harness({
      getSnapshot: async () => {
        if (change === 'failure' && next === null)
          throw new Error('Network unavailable');
        return next;
      },
    });
    const callbacks = [];
    h.layer.attachShellServices({ runNavigation: (fn) => callbacks.push(fn) });
    h.layer.enable();
    await h.layer.update();
    h.layer.setParams({ stormId: 'ep152026', focus: true });
    assert.equal(callbacks.length, 1, change);
    if (change === 'unavailable')
      next = { ...snapshot([]), unavailable: true, reason: 'Down' };
    else next = null;
    await h.layer.update();
    callbacks.shift()();
    assert.equal(h.navigation.length, 0, change);
    h.layer.destroy();
  }
});

test('[cyclones-025] the flight goes to the focus sphere, the shell gets its result, and the listener runs when the services change', async () => {
  const flights = [];
  const layer = createCyclonesLayer({
    feed: { getSnapshot: async () => snapshot() },
    createRendering: () => ({
      ...fakeRendering().rendering,
      getFocusSphere: (id) => ({ radius: 700000, id }),
    }),
    matchMedia: () => ({ matches: false }),
  });
  const results = [];
  layer.init({
    camera: {
      flyToBoundingSphere: (sphere, options) => {
        flights.push({ sphere, options });
        return 'flight handle';
      },
    },
  });
  let notices = 0;
  layer.setRowControlsListener(() => notices++);
  layer.attachShellServices({ runNavigation: (fn) => results.push(fn()) });
  assert.equal(notices, 1);
  layer.enable();
  await layer.update();
  layer.setParams({ stormId: 'ep152026', focus: true });
  assert.deepEqual(flights, [
    { sphere: { radius: 700000, id: 'ep152026' }, options: { duration: 1.4 } },
  ]);
  assert.deepEqual(results, ['flight handle']);
  layer.destroy();
});

test('[cyclones-025] the layer queues no flight without a shell service, without a focus sphere or without a selected storm', async () => {
  for (const [label, services, sphere, selectFirst] of [
    ['no services', undefined, { radius: 1 }, true],
    ['no runNavigation', {}, { radius: 1 }, true],
    [
      'runNavigation is not a function',
      { runNavigation: 'x' },
      { radius: 1 },
      true,
    ],
    ['no focus sphere', { runNavigation: () => queued.push(1) }, null, true],
    [
      'no selected storm',
      { runNavigation: () => queued.push(1) },
      { radius: 1 },
      false,
    ],
  ]) {
    var queued = [];
    const layer = createCyclonesLayer({
      feed: { getSnapshot: async () => snapshot() },
      createRendering: () => ({
        ...fakeRendering().rendering,
        getFocusSphere: () => sphere,
      }),
    });
    layer.init({ camera: {} });
    layer.attachShellServices(services);
    layer.enable();
    if (selectFirst) await layer.update();
    layer.setParams({ focus: true });
    if (selectFirst) layer.setParams({ stormId: 'ep152026', focus: true });
    assert.deepEqual(queued, [], label);
    layer.destroy();
  }
});

test('[cyclones-025] the layer opens the advisory link only for a selected storm that has one', async () => {
  const opened = [];
  let record = storm();
  const layer = plainLayer({
    feed: { getSnapshot: async () => snapshot([record]) },
    openLink: (url) => opened.push(url),
  });
  layer.enable();
  layer.setParams({ advisory: true });
  assert.deepEqual(opened, [], 'no storm yet');
  await layer.update();
  layer.setParams({ advisory: false });
  layer.setParams({ advisory: 'yes' });
  assert.deepEqual(opened, []);
  layer.setParams({ advisory: true });
  assert.deepEqual(opened, [ADVISORY_URL]);
  record = { ...storm(), advisoryUrl: null };
  await layer.update();
  layer.setParams({ advisory: true });
  assert.deepEqual(opened, [ADVISORY_URL]);
  layer.destroy();
});

test('[cyclones-025] with no options the layer reads the global matchMedia and opens the advisory with the global open', async (t) => {
  const queries = [];
  const opened = [];
  let reduced = true;
  globalThis.matchMedia = function (query) {
    queries.push([this, query]);
    return { matches: reduced };
  };
  globalThis.open = (...args) => opened.push(args);
  t.after(() => {
    delete globalThis.matchMedia;
    delete globalThis.open;
  });
  const flights = [];
  const layer = createCyclonesLayer({
    feed: { getSnapshot: async () => snapshot() },
    createRendering: () => fakeRendering().rendering,
  });
  layer.init({
    camera: {
      flyToBoundingSphere: (_sphere, options) => flights.push(options),
    },
  });
  layer.attachShellServices({ runNavigation: (fn) => fn() });
  layer.enable();
  await layer.update();
  layer.setParams({ stormId: 'ep152026', focus: true });
  reduced = false;
  layer.setParams({ stormId: 'ep152026', focus: true });
  assert.deepEqual(flights, [{ duration: 0 }, { duration: 1.4 }]);
  assert.equal(queries.length, 2);
  assert.equal(queries[0][0], globalThis);
  assert.equal(queries[0][1], '(prefers-reduced-motion: reduce)');
  layer.setParams({ advisory: true });
  assert.deepEqual(opened, [[ADVISORY_URL, '_blank', 'noopener,noreferrer']]);
  layer.destroy();
});

test('[cyclones-025] with no global matchMedia and no global open the focus uses the full duration and the link does nothing', async () => {
  const flights = [];
  const layer = createCyclonesLayer({
    feed: { getSnapshot: async () => snapshot() },
    createRendering: () => fakeRendering().rendering,
  });
  layer.init({
    camera: {
      flyToBoundingSphere: (_sphere, options) => flights.push(options),
    },
  });
  layer.attachShellServices({ runNavigation: (fn) => fn() });
  layer.enable();
  await layer.update();
  layer.setParams({ stormId: 'ep152026', focus: true });
  assert.deepEqual(flights, [{ duration: 1.4 }]);
  assert.doesNotThrow(() => layer.setParams({ advisory: true }));
  layer.destroy();
});

const AIS = { sourceId: 'ais-live-vessels', entryId: 'vessel:1' };
/** A layer with a fake click handler, a canvas at (100, 200) and a scripted pick. */
async function mapLayer({ cesiumExtras = {}, picked, overlayHit = null } = {}) {
  const handlers = [];
  const state = { picked, overlayHit, picks: 0, overlayTests: 0 };
  const layer = createCyclonesLayer({
    feed: {
      getSnapshot: async () => snapshot([storm(), storm('ep162026')]),
    },
    cesium: {
      ScreenSpaceEventType: { LEFT_CLICK: 'left' },
      ScreenSpaceEventHandler: class {
        constructor() {
          handlers.push(this);
        }
        setInputAction(callback) {
          this.click = callback;
        }
        destroy() {}
      },
      ...cesiumExtras,
    },
    createRendering: () =>
      fakeRendering({
        pickStorm: (value) => (value?.id === 'entity' ? 'ep162026' : null),
      }).rendering,
    hitTestOverlay: () => {
      state.overlayTests++;
      return state.overlayHit;
    },
  });
  const canvas = new EventTarget();
  canvas.getBoundingClientRect = () => ({ left: 100, top: 200 });
  layer.init({
    scene: {
      canvas,
      pick() {
        state.picks++;
        return state.picked;
      },
    },
  });
  layer.enable();
  await layer.update();
  const release = (type, extra) =>
    canvas.dispatchEvent(Object.assign(new Event(type), extra));
  const click = (x = 10, y = 20) => handlers[0].click({ position: { x, y } });
  return { layer, handlers, canvas, state, release, click };
}

test('[cyclones-024] a click on 3D Tiles content or on a tileset primitive clears the selection, and another primitive does not', async () => {
  class Tileset {}
  const m = await mapLayer({ cesiumExtras: { Cesium3DTileset: Tileset } });
  const selected = () => m.layer.getDiagnostics().selectedId;
  for (const [label, picked, cleared] of [
    ['tileset primitive', { primitive: new Tileset() }, true],
    ['content', { content: {} }, true],
    ['content and primitive', { content: {}, primitive: {} }, true],
    ['other primitive', { primitive: {} }, false],
    ['no primitive', {}, false],
    [
      'entity id and tileset primitive',
      { id: 'flight:1', primitive: new Tileset() },
      false,
    ],
    ['entity id and content', { id: 'flight:1', content: {} }, false],
  ]) {
    m.layer.setParams({ stormId: 'ep152026' });
    m.state.picked = picked;
    m.click();
    assert.equal(selected(), cleared ? null : 'ep152026', label);
    assert.equal(
      m.layer.getDiagnostics().selectionIntent,
      cleared ? 'cleared' : 'user',
      label,
    );
  }
  m.state.picked = undefined;
  m.layer.setParams({ stormId: 'ep152026' });
  m.click();
  assert.equal(selected(), null, 'no pick at all is empty map');
  m.state.picked = { id: 'entity' };
  m.click();
  assert.equal(selected(), 'ep162026');
  m.layer.destroy();
});

test('[cyclones-024] each release event records the overlay hit, and each press or cancel event clears it', async () => {
  const m = await mapLayer({ picked: { content: {} } });
  const at = { clientX: 110, clientY: 220 };
  const touch = { changedTouches: [at] };
  const captures = [
    ['pointerup', at],
    ['mouseup', at],
    ['touchend', touch],
  ];
  const resets = [
    'pointerdown',
    'mousedown',
    'touchstart',
    'pointercancel',
    'touchcancel',
  ];
  m.state.overlayHit = AIS;
  for (const [type, extra] of captures) {
    m.release(type, extra);
    m.state.overlayHit = null;
    const before = m.state.picks;
    m.click();
    assert.equal(m.state.picks, before, `${type} keeps the captured hit`);
    m.state.overlayHit = AIS;
  }
  for (const reset of resets) {
    m.release('pointerup', at);
    m.release(reset);
    m.state.overlayHit = null;
    const before = m.state.picks;
    m.click();
    assert.equal(m.state.picks, before + 1, `${reset} clears the capture`);
    m.state.overlayHit = AIS;
  }
  m.layer.destroy();
});

test('[cyclones-024] a release with no finite coordinates records nothing and clears the earlier record', async () => {
  const m = await mapLayer({ picked: { content: {} } });
  const tests = () => m.state.overlayTests;
  for (const [label, extra] of [
    ['no coordinates', {}],
    ['x is not a number', { clientX: NaN, clientY: 220 }],
    ['y is infinite', { clientX: 110, clientY: Infinity }],
    ['x is text', { clientX: '110', clientY: 220 }],
    ['touch with no coordinates', { changedTouches: [{}] }],
  ]) {
    const before = tests();
    m.release('pointerup', extra);
    assert.equal(tests(), before, label);
  }
  m.state.overlayHit = AIS;
  m.release('pointerup', { clientX: 110, clientY: 220 });
  m.state.overlayHit = null;
  m.release('pointerup', {});
  const picks = m.state.picks;
  m.click();
  assert.equal(m.state.picks, picks + 1, 'the earlier record is gone');
  m.layer.destroy();
});

test('[cyclones-024] a captured hit serves a click within 1 px in both axes and no other click', async () => {
  const m = await mapLayer({ picked: { content: {} } });
  const at = { clientX: 110, clientY: 220 };
  for (const [x, y, uses] of [
    [10, 20, true],
    [10.5, 20.5, true],
    [9.5, 19.5, true],
    [11, 20, false],
    [10, 21, false],
    [9, 20, false],
    [10.5, 25, false],
    [15, 20.5, false],
  ]) {
    m.state.overlayHit = AIS;
    m.release('pointerup', at);
    m.state.overlayHit = null;
    const before = m.state.picks;
    m.click(x, y);
    assert.equal(m.state.picks, uses ? before : before + 1, `${x},${y}`);
  }
  m.layer.destroy();
});

test('[cyclones-024] a click with no position does nothing, and one capture serves one click only', async () => {
  const m = await mapLayer({ picked: { id: 'entity' } });
  m.handlers[0].click({});
  m.handlers[0].click(undefined);
  m.handlers[0].click({ position: null });
  assert.equal(m.state.picks, 0);
  assert.equal(m.state.overlayTests, 0);
  assert.equal(m.layer.getDiagnostics().selectedId, 'ep152026');
  m.state.overlayHit = AIS;
  m.release('pointerup', { clientX: 110, clientY: 220 });
  m.state.overlayHit = null;
  m.click();
  assert.equal(m.state.picks, 0);
  m.click();
  assert.equal(m.state.picks, 1);
  assert.equal(m.layer.getDiagnostics().selectedId, 'ep162026');
  m.layer.destroy();
});
