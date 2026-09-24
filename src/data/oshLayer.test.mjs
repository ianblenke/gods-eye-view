import assert from 'node:assert/strict';
import test, { before, after } from 'node:test';
import * as Cesium from 'cesium';
import { createOshLayer } from '../layers/osh/index.js';
import { OSH_CLOCK_SKEW_MAX_MS, OSH_FRESH_MAX_AGE_MS } from './oshObservations.js';

let _originalDocument;
before(() => {
  _originalDocument = globalThis.document;
  globalThis.document = { addEventListener() {}, removeEventListener() {} };
});
after(() => {
  if (_originalDocument === undefined) delete globalThis.document;
  else globalThis.document = _originalDocument;
});

const SYSTEM_A = { id: 'sys-fixture-1', uid: 'urn:a', name: 'System A', description: 'desc a', lon: 1, lat: 2, alt: 0 };
const SYSTEM_B = { id: 'sys-fixture-2', uid: 'urn:b', name: 'System B', description: 'desc b', lon: 3, lat: 4, alt: 0 };
const SYSTEM_NULL = { id: 'sys-fixture-9', uid: 'urn:n', name: 'No Point', description: null, lon: null, lat: null, alt: null };
const FEATURE_A = {
  id: 'foi-fixture-1',
  uid: 'urn:foi-a',
  systemId: 'sys-fixture-1',
  name: 'Feature A',
  description: 'foi desc a',
  lon: 1.5,
  lat: 2.5,
  alt: 0,
};
const FEATURE_ORPHAN = {
  id: 'foi-fixture-2',
  uid: 'urn:foi-orphan',
  systemId: 'sys-fixture-unknown',
  name: 'Feature Orphan',
  description: null,
  lon: 9,
  lat: 9,
  alt: 0,
};
const FEATURE_NO_HOST = {
  id: 'foi-fixture-3',
  uid: 'urn:foi-no-host',
  systemId: null,
  name: 'Feature No Host',
  description: null,
  lon: 8,
  lat: 8,
  alt: 0,
};
const FEATURE_NO_NAME = {
  id: 'foi-fixture-4',
  uid: 'urn:foi-no-name',
  systemId: 'sys-fixture-1',
  name: null,
  description: null,
  lon: 11,
  lat: 12,
  alt: 0,
};
// osh-062: at the antipode of SYSTEM_A, beyond the horizon of the fake
// viewer's camera (set over longitude 1, latitude 2).
const SYSTEM_FAR = { id: 'sys-fixture-far', uid: 'urn:far', name: 'System Far', description: 'desc far', lon: -179, lat: -2, alt: 0 };
const FEATURE_FAR = {
  id: 'foi-fixture-far',
  uid: 'urn:foi-far',
  systemId: 'sys-fixture-far',
  name: 'Feature Far',
  description: null,
  lon: -179,
  lat: -2,
  alt: 0,
};
// osh-061: every other feature fixture carries alt:0, which leaves
// `feature.alt || 0` mutation-proof. This one gives it a non-zero value.
const FEATURE_ALT = {
  id: 'foi-fixture-alt',
  uid: 'urn:foi-alt',
  systemId: 'sys-fixture-1',
  name: 'Feature Alt',
  description: null,
  lon: 5,
  lat: 6,
  alt: 75,
};

function fakeSource({
  systems = [SYSTEM_A, SYSTEM_B],
  fois = [],
  truncated = false,
  datastreams = [],
  observations = {},
  locations = [],
  live = false,
} = {}) {
  const calls = {
    systems: 0,
    fois: 0,
    datastreams: 0,
    datastreamsArgs: [],
    observations: [],
    locations: 0,
    locationsArgs: [],
    live: [],
  };
  const source = {
    calls,
    async getSystems() {
      calls.systems += 1;
      return { keyRequired: false, systems, stale: false };
    },
    async getFois() {
      calls.fois += 1;
      return { keyRequired: false, fois, truncated };
    },
    async getDatastreams({ system } = {}) {
      calls.datastreams += 1;
      calls.datastreamsArgs.push(system);
      return { keyRequired: false, datastreams };
    },
    async getObservation(id) {
      calls.observations.push(id);
      return { keyRequired: false, observation: observations[id] ?? null };
    },
    async getLocations(...args) {
      calls.locations += 1;
      calls.locationsArgs.push(args);
      return { keyRequired: false, locations, failed: 0 };
    },
  };
  // A source with no openLive keeps the polling of today. With one, each
  // stream records its callbacks, so a test can push the events.
  if (live) {
    source.openLive = (id, callbacks) => {
      const stream = { id, callbacks, closed: 0 };
      stream.handle = {
        close() {
          stream.closed += 1;
        },
      };
      calls.live.push(stream);
      return stream.handle;
    };
  }
  return source;
}

/** A fake viewer with entity dataSources, a pickable scene and a click capture. */
function fakeViewer() {
  const dataSources = [];
  let picked = null;
  const camera = { moveEnd: new Cesium.Event() };
  function setCamera(lon, lat, height) {
    camera.positionWC = Cesium.Cartesian3.fromDegrees(lon, lat, height);
  }
  const viewer = {
    scene: {
      canvas: { addEventListener() {}, removeEventListener() {} },
      pick() {
        return picked;
      },
    },
    camera,
    dataSources: {
      add(dataSource) {
        dataSources.push(dataSource);
        return dataSource;
      },
      remove(dataSource) {
        const index = dataSources.indexOf(dataSource);
        if (index >= 0) dataSources.splice(index, 1);
        return index >= 0;
      },
    },
  };
  // The repro height the firms horizon test also uses. From here the
  // horizon half-angle is about 36 degrees, so SYSTEM_A, SYSTEM_B and
  // FEATURE_A stay visible and the antipode fixtures do not.
  setCamera(1, 2, 1_500_000);
  return {
    viewer,
    dataSources,
    setPicked(id) {
      picked = id === null ? null : { id };
    },
    setCamera,
    raiseMoveEnd() {
      camera.moveEnd.raiseEvent();
    },
  };
}

function withClickCapture(run) {
  let clickAction = null;
  const original = Cesium.ScreenSpaceEventHandler.prototype.setInputAction;
  Cesium.ScreenSpaceEventHandler.prototype.setInputAction = function (action, type) {
    if (type === Cesium.ScreenSpaceEventType.LEFT_CLICK) clickAction = action;
    return original.call(this, action, type);
  };
  try {
    return run(() => clickAction);
  } finally {
    Cesium.ScreenSpaceEventHandler.prototype.setInputAction = original;
  }
}

test('[osh-029] throws without a systems source', () => {
  assert.throws(() => createOshLayer({}), TypeError);
});

test('[osh-029] shows one entity per system and reports stats, including the new fields', async (t) => {
  const source = fakeSource({ fois: [FEATURE_A] });
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  layer.enable(viewer);
  const updated = await layer.update(viewer);
  assert.equal(updated, true);
  assert.equal(dataSources[0].entities.values.length, 3, 'two system entities and one feature entity');
  const stats = layer.getStats();
  assert.equal(stats.count, 2);
  assert.equal(stats.features, 1);
  assert.ok(Number.isFinite(stats.lastUpdate));
  assert.equal(stats.error, null);
  assert.equal(stats.keyRequired, false);
  assert.equal(stats.stale, false);
  assert.equal(stats.unplaced, 0);
  assert.equal(stats.truncated, false);
  assert.equal(stats.partial, false);
  assert.equal(stats.selectedId, null);
  assert.equal(stats.selectedFeatureId, null);
  layer.disable(viewer);
});

test('[osh-029] a system with no Point gets no entity, and counts toward unplaced', async (t) => {
  const source = fakeSource({ systems: [SYSTEM_A, SYSTEM_NULL] });
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  layer.enable(viewer);
  await layer.update(viewer);
  assert.equal(dataSources[0].entities.values.length, 1, 'only the placed system gets an entity');
  assert.equal(dataSources[0].entities.getById('osh:sys-fixture-9'), undefined);
  const stats = layer.getStats();
  assert.equal(stats.count, 1);
  assert.equal(stats.unplaced, 1);
});

test('[osh-029] a system with no Point but a fresh location still gets an entity, counted under count', async (t) => {
  const source = fakeSource({ systems: [], fois: [], locations: [aircraftLocation()] });
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  layer.enable(viewer);
  await layer.update(viewer);
  assert.ok(dataSources[0].entities.getById('osh:sys-fixture-9'), 'the stream-placed entity must exist');
  assert.equal(layer.getStats().count, 1);
  assert.equal(layer.getStats().unplaced, 0);
});

test('[osh-029] reports getStats().stale from a stale systems fetch', async (t) => {
  const source = {
    async getSystems() {
      return { keyRequired: false, systems: [SYSTEM_A], stale: true };
    },
  };
  const layer = createOshLayer({ source });
  const { viewer } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  layer.enable(viewer);
  await layer.update(viewer);
  assert.equal(layer.getStats().stale, true);
});

test('[osh-029] a failed fetch sets the error and does not change the entities', async (t) => {
  let fail = false;
  const source = {
    async getSystems() {
      if (fail) throw new Error('boom');
      return { keyRequired: false, systems: [SYSTEM_A, SYSTEM_B], stale: false };
    },
  };
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  layer.enable(viewer);
  assert.equal(await layer.update(viewer), true);
  assert.equal(dataSources[0].entities.values.length, 2);

  fail = true;
  const updated = await layer.update(viewer);
  assert.equal(updated, false);
  assert.equal(layer.getStats().error, 'boom');
  assert.equal(
    dataSources[0].entities.values.length,
    2,
    'a failed fetch must leave the earlier entities in place',
  );
});

test('[osh-029] a thrown non-Error still sets a fallback error message', async (t) => {
  const source = {
    async getSystems() {
      throw { not: 'an error' };
    },
  };
  const layer = createOshLayer({ source });
  const { viewer } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  layer.enable(viewer);
  await layer.update(viewer);
  assert.equal(layer.getStats().error, 'OSH source unavailable');
});

test('[osh-029] keyRequired clears the entities and reports keyRequired:true', async (t) => {
  const source = {
    async getSystems() {
      return { keyRequired: true, systems: [], stale: false };
    },
  };
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  layer.enable(viewer);
  await layer.update(viewer);
  assert.equal(dataSources[0].entities.values.length, 0);
  assert.equal(layer.getStats().keyRequired, true);
});

test('[osh-029] disable hides the data source, destroy removes it, and disable stops more updates', async (t) => {
  const source = fakeSource();
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  layer.enable(viewer);
  await layer.update(viewer);
  layer.disable(viewer);
  assert.equal(dataSources[0].show, false);
  assert.equal(await layer.update(viewer), false);
  layer.destroy(viewer);
  assert.equal(dataSources.length, 0);
});

test('[osh-049] disable() does not clear the system union', async (t) => {
  const source = fakeSource();
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  layer.enable(viewer);
  await layer.update(viewer);
  assert.equal(layer.getStats().count, 2);
  layer.disable(viewer);
  assert.equal(layer.getStats().count, 2, 'disable() must not have cleared the union');
  assert.equal(dataSources[0].entities.values.length, 2, 'disable() only hides the data source, it does not remove entities');
  layer.enable(viewer);
  assert.equal(dataSources[0].show, true);
  assert.equal(dataSources[0].entities.values.length, 2, 'the same union is visible again after re-enabling');
});

test('[osh-029] update does nothing before init and while disabled', async () => {
  const layer = createOshLayer({ source: fakeSource() });
  assert.equal(await layer.update(), false);
});

test('[osh-029] init cannot run twice', (t) => {
  const layer = createOshLayer({ source: fakeSource() });
  const { viewer } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  assert.throws(() => layer.init(viewer), /already initialized/);
});

test('[osh-030] polls the datastreams of a selected system, again every 15 seconds', async (t) => {
  t.mock.timers.enable({ apis: ['setInterval'] });
  const source = fakeSource({
    datastreams: [
      { id: 'ds-fixture-1', systemId: 'sys-fixture-1', name: 'D1' },
      { id: 'ds-fixture-2', systemId: 'sys-fixture-2', name: 'D2' },
    ],
    observations: { 'ds-fixture-1': { rows: [], location: null, resultTime: 't1' } },
  });
  const detailHost = { innerHTML: '' };
  const layer = createOshLayer({ source, detailHost });
  const { viewer } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);

  await withClickCapture(async (getClick) => {
    layer.enable(viewer);
    await layer.update(viewer);
    const { setPicked } = viewerPickHelper(viewer);
    setPicked('osh:sys-fixture-1');
    getClick()({ position: {} });
    await flush();
    assert.equal(source.calls.datastreams, 1);
    assert.deepEqual(source.calls.observations, ['ds-fixture-1']);
    assert.match(detailHost.innerHTML, /D1/);

    t.mock.timers.tick(15_000);
    await flush();
    assert.equal(source.calls.datastreams, 2);
    assert.deepEqual(source.calls.observations, ['ds-fixture-1', 'ds-fixture-1']);

    setPicked('osh:sys-fixture-2');
    getClick()({ position: {} });
    await flush();
    const datastreamsAfterSwitch = source.calls.datastreams;
    t.mock.timers.tick(15_000);
    await flush();
    assert.ok(source.calls.datastreams > datastreamsAfterSwitch, 'the new system keeps polling');

    setPicked(null);
    getClick()({ position: {} });
    await flush();
    assert.equal(detailHost.innerHTML, '');
    const callsAtDeselect = source.calls.datastreams;
    t.mock.timers.tick(15_000);
    await flush();
    assert.equal(source.calls.datastreams, callsAtDeselect, 'no more polling once deselected');
  });
});

test('[osh-030] stops the poll of the selected system when the layer disables', async (t) => {
  t.mock.timers.enable({ apis: ['setInterval'] });
  const source = fakeSource({
    datastreams: [{ id: 'ds-fixture-1', systemId: 'sys-fixture-1', name: 'D1' }],
  });
  const layer = createOshLayer({ source });
  const { viewer } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  await withClickCapture(async (getClick) => {
    layer.enable(viewer);
    await layer.update(viewer);
    const { setPicked } = viewerPickHelper(viewer);
    setPicked('osh:sys-fixture-1');
    getClick()({ position: {} });
    await flush();
    const calls = source.calls.datastreams;
    layer.disable(viewer);
    t.mock.timers.tick(30_000);
    await flush();
    assert.equal(source.calls.datastreams, calls);
  });
});

test('[osh-030] deselects on a click on empty space or on a non-osh entity', async (t) => {
  const source = fakeSource({ datastreams: [] });
  const layer = createOshLayer({ source });
  const { viewer } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  await withClickCapture(async (getClick) => {
    layer.enable(viewer);
    await layer.update(viewer);
    const { setPicked } = viewerPickHelper(viewer);
    setPicked('osh:sys-fixture-1');
    getClick()({ position: {} });
    await flush();
    assert.equal(layer.getStats().selectedId, 'sys-fixture-1');

    setPicked('not-an-osh-entity');
    getClick()({ position: {} });
    await flush();
    assert.equal(layer.getStats().selectedId, null, 'a non-osh pick deselects, like empty space');

    setPicked('osh:sys-fixture-1');
    getClick()({ position: {} });
    await flush();
    assert.equal(layer.getStats().selectedId, 'sys-fixture-1');

    setPicked(null);
    getClick()({ position: {} });
    await flush();
    assert.equal(layer.getStats().selectedId, null);

    setPicked(null);
    getClick()({ position: {} });
    await flush();
    assert.equal(layer.getStats().selectedId, null, 'deselecting twice is a no-op');
  });
});

test('[osh-030] a picked entity whose id is a plain string is also read', async (t) => {
  const source = fakeSource({ datastreams: [] });
  const layer = createOshLayer({ source });
  const { viewer } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  await withClickCapture(async (getClick) => {
    layer.enable(viewer);
    await layer.update(viewer);
    viewer.scene.pick = () => ({ id: 'osh:sys-fixture-1' });
    getClick()({ position: {} });
    await flush();
    assert.equal(layer.getStats().selectedId, 'sys-fixture-1');
  });
});

test('[osh-030] a second click handler install does nothing, and a second click on the same system does not restart the poll', async (t) => {
  const source = fakeSource({ systems: [SYSTEM_A], datastreams: [] });
  const layer = createOshLayer({ source });
  const { viewer } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  await withClickCapture(async (getClick) => {
    layer.enable(viewer);
    layer.enable(viewer);
    await layer.update(viewer);
    const { setPicked } = viewerPickHelper(viewer);
    setPicked('osh:sys-fixture-1');
    getClick()({ position: {} });
    await flush();
    assert.equal(source.calls.datastreams, 1);
    getClick()({ position: {} });
    await flush();
    assert.equal(source.calls.datastreams, 1, 'the same system clicked again does not restart the poll');
  });
});

test('[osh-030] a keyRequired datastreams response during a poll stops that poll cycle', async (t) => {
  const source = {
    async getSystems() {
      return { keyRequired: false, systems: [SYSTEM_A], stale: false };
    },
    async getDatastreams() {
      return { keyRequired: true, datastreams: [] };
    },
    async getObservation() {
      throw new Error('should not be called');
    },
  };
  const detailHost = { innerHTML: 'stale' };
  const layer = createOshLayer({ source, detailHost });
  const { viewer } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  await withClickCapture(async (getClick) => {
    layer.enable(viewer);
    await layer.update(viewer);
    const { setPicked } = viewerPickHelper(viewer);
    setPicked('osh:sys-fixture-1');
    getClick()({ position: {} });
    await flush();
    assert.equal(detailHost.innerHTML, 'stale', 'no detail is written for a key-required poll');
  });
});

test('[osh-030] a failed datastreams or observation fetch during a poll does not throw, and the next poll still runs', async (t) => {
  let failDatastreams = true;
  let getDatastreamsCalls = 0;
  let getObservationCalls = 0;
  const source = {
    async getSystems() {
      return { keyRequired: false, systems: [SYSTEM_A], stale: false };
    },
    async getDatastreams() {
      getDatastreamsCalls += 1;
      if (failDatastreams) throw new Error('boom');
      return {
        keyRequired: false,
        datastreams: [{ id: 'ds-fixture-1', systemId: 'sys-fixture-1', name: 'D1' }],
      };
    },
    async getObservation() {
      getObservationCalls += 1;
      throw new Error('observation boom');
    },
  };
  const detailHost = { innerHTML: 'unset' };
  const layer = createOshLayer({ source, detailHost });
  const { viewer } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  await withClickCapture(async (getClick) => {
    layer.enable(viewer);
    await layer.update(viewer);
    const { setPicked } = viewerPickHelper(viewer);
    setPicked('osh:sys-fixture-1');
    getClick()({ position: {} });
    await flush();
    assert.equal(getDatastreamsCalls, 1);
    assert.equal(
      detailHost.innerHTML,
      'unset',
      'a failed datastreams fetch must not write a detail, or throw out of the click handler',
    );

    failDatastreams = false;
    setPicked(null);
    getClick()({ position: {} });
    setPicked('osh:sys-fixture-1');
    getClick()({ position: {} });
    await flush();
    assert.equal(getDatastreamsCalls, 2, 'the next poll still runs after the earlier failure');
    assert.equal(getObservationCalls, 1);
    assert.match(
      detailHost.innerHTML,
      /D1/,
      'a failed observation fetch still lets the poll write the datastream, with no observation',
    );
    assert.match(detailHost.innerHTML, /No data/);
  });
});

test('[osh-031] a newest result with a location moves the entity, and a systems refresh keeps the moved position', async (t) => {
  const source = fakeSource({
    systems: [SYSTEM_A],
    datastreams: [{ id: 'ds-fixture-1', systemId: 'sys-fixture-1', name: 'D1' }],
    observations: {
      'ds-fixture-1': { rows: [], location: { lat: 9, lon: 8, alt: 7 }, resultTime: 't', ageMs: 1000 },
    },
  });
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  await withClickCapture(async (getClick) => {
    layer.enable(viewer);
    await layer.update(viewer);
    const { setPicked } = viewerPickHelper(viewer);
    setPicked('osh:sys-fixture-1');
    getClick()({ position: {} });
    await flush();
    const entity = dataSources[0].entities.getById('osh:sys-fixture-1');
    const moved = entity.position.getValue(Cesium.JulianDate.now());
    const expected = Cesium.Cartesian3.fromDegrees(8, 9, 7);
    assert.ok(Cesium.Cartesian3.equalsEpsilon(moved, expected, Cesium.Math.EPSILON6));

    await layer.update(viewer);
    const stillEntity = dataSources[0].entities.getById('osh:sys-fixture-1');
    const stillMoved = stillEntity.position.getValue(Cesium.JulianDate.now());
    assert.ok(Cesium.Cartesian3.equalsEpsilon(stillMoved, expected, Cesium.Math.EPSILON6));
  });
});

test('[osh-031] a newest result without a location leaves the entity where it was', async (t) => {
  const source = fakeSource({
    systems: [SYSTEM_A],
    datastreams: [{ id: 'ds-fixture-1', systemId: 'sys-fixture-1', name: 'D1' }],
    observations: { 'ds-fixture-1': { rows: [], location: null, resultTime: 't', ageMs: 1000 } },
  });
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  await withClickCapture(async (getClick) => {
    layer.enable(viewer);
    await layer.update(viewer);
    const { setPicked } = viewerPickHelper(viewer);
    setPicked('osh:sys-fixture-1');
    getClick()({ position: {} });
    await flush();
    const entity = dataSources[0].entities.getById('osh:sys-fixture-1');
    const position = entity.position.getValue(Cesium.JulianDate.now());
    const expected = Cesium.Cartesian3.fromDegrees(SYSTEM_A.lon, SYSTEM_A.lat, 0);
    assert.ok(Cesium.Cartesian3.equalsEpsilon(position, expected, Cesium.Math.EPSILON6));
  });
});

// The owner's OSH server runs a few seconds ahead of the provider, so a live
// reading's phenomenonTime lands after the injected "now" and its age comes
// out negative. A negative age is as fresh as it gets, and motion must not
// refuse it.
test('[osh-031] the layer moves the entity from a newest result with a negative ageMs', async (t) => {
  const source = fakeSource({
    systems: [SYSTEM_A],
    datastreams: [{ id: 'ds-fixture-1', systemId: 'sys-fixture-1', name: 'D1' }],
    observations: {
      'ds-fixture-1': { rows: [], location: { lat: 9, lon: 8, alt: 7 }, resultTime: 't', ageMs: -5000 },
    },
  });
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  await withClickCapture(async (getClick) => {
    layer.enable(viewer);
    await layer.update(viewer);
    const { setPicked } = viewerPickHelper(viewer);
    setPicked('osh:sys-fixture-1');
    getClick()({ position: {} });
    await flush();
    const entity = dataSources[0].entities.getById('osh:sys-fixture-1');
    const moved = entity.position.getValue(Cesium.JulianDate.now());
    const expected = Cesium.Cartesian3.fromDegrees(8, 9, 7);
    assert.ok(Cesium.Cartesian3.equalsEpsilon(moved, expected, Cesium.Math.EPSILON6));
  });
});

test('[osh-031] a newest result one millisecond past the freshness threshold leaves the entity where it was', async (t) => {
  const source = fakeSource({
    systems: [SYSTEM_A],
    datastreams: [{ id: 'ds-fixture-1', systemId: 'sys-fixture-1', name: 'D1' }],
    observations: {
      'ds-fixture-1': {
        rows: [],
        location: { lat: 9, lon: 8, alt: 7 },
        resultTime: 't',
        ageMs: OSH_FRESH_MAX_AGE_MS + 1,
      },
    },
  });
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  await withClickCapture(async (getClick) => {
    layer.enable(viewer);
    await layer.update(viewer);
    const { setPicked } = viewerPickHelper(viewer);
    setPicked('osh:sys-fixture-1');
    getClick()({ position: {} });
    await flush();
    const entity = dataSources[0].entities.getById('osh:sys-fixture-1');
    const position = entity.position.getValue(Cesium.JulianDate.now());
    const expected = Cesium.Cartesian3.fromDegrees(SYSTEM_A.lon, SYSTEM_A.lat, 0);
    assert.ok(Cesium.Cartesian3.equalsEpsilon(position, expected, Cesium.Math.EPSILON6));
  });
});

test('[osh-031] a newest result from far ahead of the clock leaves the entity where it was', async (t) => {
  // One year ahead. Finite, and under the upper bound, so a rule with only
  // that bound treats it as the freshest reading there is and moves to it.
  const source = fakeSource({
    systems: [SYSTEM_A],
    datastreams: [{ id: 'ds-fixture-1', systemId: 'sys-fixture-1', name: 'D1' }],
    observations: {
      'ds-fixture-1': {
        rows: [],
        location: { lat: 9, lon: 8, alt: 7 },
        resultTime: 't',
        ageMs: -31_536_000_000,
      },
    },
  });
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  await withClickCapture(async (getClick) => {
    layer.enable(viewer);
    await layer.update(viewer);
    const { setPicked } = viewerPickHelper(viewer);
    setPicked('osh:sys-fixture-1');
    getClick()({ position: {} });
    await flush();
    const entity = dataSources[0].entities.getById('osh:sys-fixture-1');
    const position = entity.position.getValue(Cesium.JulianDate.now());
    const expected = Cesium.Cartesian3.fromDegrees(SYSTEM_A.lon, SYSTEM_A.lat, 0);
    assert.ok(Cesium.Cartesian3.equalsEpsilon(position, expected, Cesium.Math.EPSILON6));
  });
});

test('[osh-031] a newest result with ageMs:null leaves the entity where it was', async (t) => {
  const source = fakeSource({
    systems: [SYSTEM_A],
    datastreams: [{ id: 'ds-fixture-1', systemId: 'sys-fixture-1', name: 'D1' }],
    observations: {
      'ds-fixture-1': { rows: [], location: { lat: 9, lon: 8, alt: 7 }, resultTime: 't', ageMs: null },
    },
  });
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  await withClickCapture(async (getClick) => {
    layer.enable(viewer);
    await layer.update(viewer);
    const { setPicked } = viewerPickHelper(viewer);
    setPicked('osh:sys-fixture-1');
    getClick()({ position: {} });
    await flush();
    const entity = dataSources[0].entities.getById('osh:sys-fixture-1');
    const position = entity.position.getValue(Cesium.JulianDate.now());
    const expected = Cesium.Cartesian3.fromDegrees(SYSTEM_A.lon, SYSTEM_A.lat, 0);
    assert.ok(Cesium.Cartesian3.equalsEpsilon(position, expected, Cesium.Math.EPSILON6));
  });
});

test('[osh-049] the system map is a union across refreshes', async (t) => {
  t.mock.timers.enable({ apis: ['setInterval'] });
  let systems = [SYSTEM_A, SYSTEM_B];
  let fois = [FEATURE_A];
  let keyRequired = false;
  const datastreamsCalls = [];
  const source = {
    async getSystems() {
      if (keyRequired) return { keyRequired: true, systems: [], stale: false };
      return { keyRequired: false, systems, stale: false };
    },
    async getFois() {
      return { keyRequired: false, fois, truncated: false };
    },
    async getDatastreams({ system } = {}) {
      datastreamsCalls.push(system);
      return { keyRequired: false, datastreams: [] };
    },
    async getObservation() {
      return { keyRequired: false, observation: null };
    },
  };
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  await withClickCapture(async (getClick) => {
    layer.enable(viewer);
    await layer.update(viewer);
    assert.equal(layer.getStats().count, 2);
    const { setPicked } = viewerPickHelper(viewer);
    setPicked('osh:sys-fixture-1');
    getClick()({ position: {} });
    await flush();
    assert.equal(layer.getStats().selectedId, 'sys-fixture-1');
    const callsBeforeOmission = datastreamsCalls.length;

    // Refresh #2: the systems list omits sys-fixture-1 (the list samples).
    // The union keeps it, count does not fall, and the selection stays.
    // The feature list also drops FEATURE_A, and it must go.
    systems = [SYSTEM_B];
    fois = [];
    await layer.update(viewer);
    assert.equal(layer.getStats().count, 2, 'the union keeps the omitted system');
    assert.ok(
      dataSources[0].entities.getById('osh:sys-fixture-1'),
      'the omitted system keeps its entity',
    );
    assert.equal(layer.getStats().selectedId, 'sys-fixture-1', 'the selection of the omitted system stays');
    assert.equal(layer.getStats().features, 0);
    assert.equal(
      dataSources[0].entities.getById('osh-foi:foi-fixture-1'),
      undefined,
      'the dropped feature loses its entity',
    );

    // The poll of the omitted, still-selected system must keep running.
    t.mock.timers.tick(15_000);
    await flush();
    assert.ok(
      datastreamsCalls.length > callsBeforeOmission,
      'the poll of the omitted system must still be running',
    );

    // Refresh #3: sys-fixture-1 reappears with a new name; its record updates in place.
    systems = [{ ...SYSTEM_A, name: 'System A Renamed' }, SYSTEM_B];
    await layer.update(viewer);
    const renamed = dataSources[0].entities.getById('osh:sys-fixture-1');
    assert.equal(renamed.label.text.getValue(Cesium.JulianDate.now()), 'System A Renamed');

    // Refresh #4: keyRequired empties the whole map.
    keyRequired = true;
    await layer.update(viewer);
    assert.equal(layer.getStats().count, 0);
    assert.equal(layer.getStats().selectedId, null);

    // Refresh #5: back to normal, with only sys-fixture-1. If the map had
    // not truly been emptied, sys-fixture-2 would still linger from before.
    keyRequired = false;
    systems = [SYSTEM_A];
    await layer.update(viewer);
    assert.equal(layer.getStats().count, 1, 'the keyRequired reset must have cleared the union');
  });
});

test('[osh-049] a selected feature dropped from the next refresh clears the feature and its host, and stops the poll', async (t) => {
  t.mock.timers.enable({ apis: ['setInterval'] });
  let fois = [FEATURE_A];
  const datastreamsCalls = [];
  const source = {
    async getSystems() {
      return { keyRequired: false, systems: [SYSTEM_A], stale: false };
    },
    async getFois() {
      return { keyRequired: false, fois, truncated: false };
    },
    async getDatastreams({ system } = {}) {
      datastreamsCalls.push(system);
      return { keyRequired: false, datastreams: [] };
    },
    async getObservation() {
      return { keyRequired: false, observation: null };
    },
  };
  const layer = createOshLayer({ source });
  const { viewer } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  await withClickCapture(async (getClick) => {
    layer.enable(viewer);
    await layer.update(viewer);
    const { setPicked } = viewerPickHelper(viewer);
    setPicked('osh-foi:foi-fixture-1');
    getClick()({ position: {} });
    await flush();
    assert.equal(layer.getStats().selectedFeatureId, 'foi-fixture-1');
    assert.equal(layer.getStats().selectedId, 'sys-fixture-1');
    assert.equal(datastreamsCalls.length, 1);

    fois = [];
    await layer.update(viewer);
    assert.equal(layer.getStats().selectedFeatureId, null, 'the dropped feature clears its own selection');
    assert.equal(layer.getStats().selectedId, null, 'and clears its host selection too');

    const callsBeforeTick = datastreamsCalls.length;
    t.mock.timers.tick(15_000);
    await flush();
    assert.equal(
      datastreamsCalls.length,
      callsBeforeTick,
      'the poll of the dropped feature\'s host must have stopped',
    );
  });
});

test('[osh-045] shows one entity per feature, with a label distance condition, and getStats().features counts them', async (t) => {
  const source = fakeSource({ fois: [FEATURE_A, FEATURE_NO_HOST] });
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  layer.enable(viewer);
  await layer.update(viewer);
  const entity = dataSources[0].entities.getById('osh-foi:foi-fixture-1');
  assert.ok(entity);
  assert.equal(entity.label.text.getValue(Cesium.JulianDate.now()), 'Feature A');
  const condition = entity.label.distanceDisplayCondition.getValue(Cesium.JulianDate.now());
  assert.equal(condition.near, 0);
  assert.equal(condition.far, 200_000, 'the spec fixes this at 200 km');
  assert.equal(layer.getStats().features, 2);
});

test('[osh-045] a feature with no name gets a point entity and no label', async (t) => {
  const source = fakeSource({ fois: [FEATURE_NO_NAME] });
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  layer.enable(viewer);
  await layer.update(viewer);
  const entity = dataSources[0].entities.getById('osh-foi:foi-fixture-4');
  assert.ok(entity);
  assert.equal(entity.label, undefined);
});

test('[osh-045] a click on a feature selects and polls its host, whether or not the host is in the systems list', async (t) => {
  const source = fakeSource({ systems: [SYSTEM_A], fois: [FEATURE_A, FEATURE_ORPHAN] });
  const layer = createOshLayer({ source });
  const { viewer } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  await withClickCapture(async (getClick) => {
    layer.enable(viewer);
    await layer.update(viewer);
    const { setPicked } = viewerPickHelper(viewer);

    setPicked('osh-foi:foi-fixture-1');
    getClick()({ position: {} });
    await flush();
    assert.equal(layer.getStats().selectedFeatureId, 'foi-fixture-1');
    assert.equal(layer.getStats().selectedId, 'sys-fixture-1');
    assert.equal(source.calls.datastreams, 1);
    assert.deepEqual(source.calls.datastreamsArgs, ['sys-fixture-1']);

    setPicked('osh-foi:foi-fixture-2');
    getClick()({ position: {} });
    await flush();
    assert.equal(layer.getStats().selectedFeatureId, 'foi-fixture-2');
    assert.equal(
      layer.getStats().selectedId,
      'sys-fixture-unknown',
      'the host id is selected even though it never appeared in the systems list',
    );
    assert.equal(source.calls.datastreams, 2, 'a host outside the systems list still polls');
  });
});

test('[osh-045] a click on a feature with a null host selects the feature, leaves selectedId null, and starts no poll', async (t) => {
  const source = fakeSource({ fois: [FEATURE_NO_HOST] });
  const layer = createOshLayer({ source });
  const { viewer } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  await withClickCapture(async (getClick) => {
    layer.enable(viewer);
    await layer.update(viewer);
    const { setPicked } = viewerPickHelper(viewer);
    setPicked('osh-foi:foi-fixture-3');
    getClick()({ position: {} });
    await flush();
    assert.equal(layer.getStats().selectedFeatureId, 'foi-fixture-3');
    assert.equal(layer.getStats().selectedId, null);
    assert.equal(source.calls.datastreams, 0, 'no host means no poll');

    setPicked(null);
    getClick()({ position: {} });
    await flush();
    assert.equal(layer.getStats().selectedFeatureId, null);
  });
});

test('[osh-045] finds a feature record by id and by uid, with no per-feature fetch method on the source', async (t) => {
  const source = fakeSource({ fois: [FEATURE_A] });
  assert.equal(typeof source.getFoiById, 'undefined');
  const layer = createOshLayer({ source });
  const { viewer } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  await withClickCapture(async (getClick) => {
    layer.enable(viewer);
    await layer.update(viewer);
    const { setPicked } = viewerPickHelper(viewer);
    setPicked('osh-foi:foi-fixture-1');
    getClick()({ position: {} });
    await flush();
    assert.equal(layer.getStats().selectedFeatureId, 'foi-fixture-1');
  });
});

test('[osh-045] a click on a stale feature entity selects that feature id, with no host and no name', async (t) => {
  const source = fakeSource({ fois: [] });
  const layer = createOshLayer({ source });
  const { viewer } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  await withClickCapture(async (getClick) => {
    layer.enable(viewer);
    await layer.update(viewer);
    // No feature was ever placed, so this picked id has no record — a
    // stale or synthetic pick the click handler must still handle safely.
    viewer.scene.pick = () => ({ id: { id: 'osh-foi:gone' } });
    getClick()({ position: {} });
    await flush();
    assert.equal(layer.getStats().selectedFeatureId, 'gone');
    assert.equal(layer.getStats().selectedId, null);
  });
});

test('[osh-030] a fresh observation with a location does not throw when the selected system has no entity', async (t) => {
  const source = fakeSource({
    systems: [SYSTEM_A],
    fois: [FEATURE_ORPHAN],
    datastreams: [{ id: 'ds-fixture-1', systemId: 'sys-fixture-unknown', name: 'D1' }],
    observations: {
      'ds-fixture-1': { rows: [], location: { lat: 9, lon: 8, alt: 7 }, resultTime: 't' },
    },
  });
  const layer = createOshLayer({ source });
  const { viewer } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  await withClickCapture(async (getClick) => {
    layer.enable(viewer);
    await layer.update(viewer);
    const { setPicked } = viewerPickHelper(viewer);
    setPicked('osh-foi:foi-fixture-2');
    assert.doesNotThrow(() => getClick()({ position: {} }));
    await flush();
    assert.equal(layer.getStats().selectedId, 'sys-fixture-unknown');
    assert.deepEqual(source.calls.observations, ['ds-fixture-1']);

    // A later refresh, with the selected host still not on the map, must
    // not throw while it looks up that host's (absent) entity.
    await layer.update(viewer);
    assert.equal(layer.getStats().selectedId, 'sys-fixture-unknown');
  });
});

test('[osh-045] a selected feature that is still present after a later refresh keeps its selection', async (t) => {
  const source = fakeSource({ fois: [FEATURE_A] });
  const layer = createOshLayer({ source });
  const { viewer } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  await withClickCapture(async (getClick) => {
    layer.enable(viewer);
    await layer.update(viewer);
    const { setPicked } = viewerPickHelper(viewer);
    setPicked('osh-foi:foi-fixture-1');
    getClick()({ position: {} });
    await flush();
    assert.equal(layer.getStats().selectedFeatureId, 'foi-fixture-1');

    await layer.update(viewer);
    assert.equal(
      layer.getStats().selectedFeatureId,
      'foi-fixture-1',
      'the feature is still in the list, so the selection must stay',
    );
  });
});

test('[osh-046] a fois getter that resolves keyRequired:true, while the systems getter does not, gives an empty feature list', async (t) => {
  const source = {
    async getSystems() {
      return { keyRequired: false, systems: [SYSTEM_A], stale: false };
    },
    async getFois() {
      return { keyRequired: true, fois: [], truncated: false };
    },
    async getDatastreams() {
      return { keyRequired: false, datastreams: [] };
    },
  };
  const layer = createOshLayer({ source });
  const { viewer } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  layer.enable(viewer);
  await layer.update(viewer);
  assert.equal(layer.getStats().features, 0);
  assert.equal(layer.getStats().partial, false);
});

test('[osh-046] a locations getter that resolves keyRequired:true alone gives an empty location list, with partial:false and no error', async (t) => {
  const source = {
    async getSystems() {
      return { keyRequired: false, systems: [], stale: false };
    },
    async getFois() {
      return { keyRequired: false, fois: [], truncated: false };
    },
    async getLocations() {
      return { keyRequired: true, locations: [aircraftLocation()], failed: 0 };
    },
  };
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  layer.enable(viewer);
  await layer.update(viewer);
  assert.equal(
    dataSources[0].entities.getById('osh:sys-fixture-9'),
    undefined,
    'a keyRequired locations answer places nothing, even though it carries a location',
  );
  assert.equal(layer.getStats().count, 0);
  assert.equal(layer.getStats().partial, false);
  assert.equal(layer.getStats().error, null);
});

test('[osh-046] the features getter throwing sets partial:true and no error, and the systems still place', async (t) => {
  const source = {
    async getSystems() {
      return { keyRequired: false, systems: [SYSTEM_A], stale: false };
    },
    async getFois() {
      throw new Error('fois boom');
    },
    async getDatastreams() {
      return { keyRequired: false, datastreams: [] };
    },
  };
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  layer.enable(viewer);
  await layer.update(viewer);
  assert.equal(layer.getStats().count, 1);
  assert.equal(layer.getStats().partial, true);
  assert.equal(layer.getStats().error, null);
  assert.equal(dataSources[0].entities.getById('osh:sys-fixture-1') !== undefined, true);
});

test('[osh-046] a server with no Point and no feature gives count:0, features:0, error:null and partial:false', async (t) => {
  const source = fakeSource({ systems: [SYSTEM_NULL], fois: [] });
  const layer = createOshLayer({ source });
  const { viewer } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  layer.enable(viewer);
  await layer.update(viewer);
  const stats = layer.getStats();
  assert.equal(stats.count, 0);
  assert.equal(stats.features, 0);
  assert.equal(stats.error, null);
  assert.equal(stats.partial, false);
});

test('[osh-046] truncated is true when the features payload says so', async (t) => {
  const source = fakeSource({ fois: [FEATURE_A], truncated: true });
  const layer = createOshLayer({ source });
  const { viewer } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  layer.enable(viewer);
  await layer.update(viewer);
  assert.equal(layer.getStats().truncated, true);
});

test('[osh-046] an update aborted before all three reads settle draws nothing from them', async (t) => {
  let resolveSystems;
  let resolveFois;
  let resolveLocations;
  const source = {
    async getSystems() {
      return new Promise((resolve) => {
        resolveSystems = resolve;
      });
    },
    async getFois() {
      return new Promise((resolve) => {
        resolveFois = resolve;
      });
    },
    async getLocations() {
      return new Promise((resolve) => {
        resolveLocations = resolve;
      });
    },
  };
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  layer.enable(viewer);
  const updatePromise = layer.update(viewer);
  layer.disable(viewer);
  resolveFois({ keyRequired: false, fois: [FEATURE_A], truncated: false });
  resolveLocations({ keyRequired: false, locations: [], failed: 0 });
  resolveSystems({ keyRequired: false, systems: [SYSTEM_A], stale: false });
  assert.equal(await updatePromise, false);
  assert.equal(dataSources[0].entities.values.length, 0, 'nothing is drawn from a superseded update');
  assert.equal(layer.getStats().count, 0);
});

test('[osh-046] a locations getter that throws sets partial:true and no error, and the systems still place', async (t) => {
  const source = {
    async getSystems() {
      return { keyRequired: false, systems: [SYSTEM_A], stale: false };
    },
    async getFois() {
      return { keyRequired: false, fois: [], truncated: false };
    },
    async getLocations() {
      throw new Error('locations boom');
    },
  };
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  layer.enable(viewer);
  await layer.update(viewer);
  assert.equal(layer.getStats().count, 1);
  assert.equal(layer.getStats().partial, true);
  assert.equal(layer.getStats().error, null);
  assert.equal(dataSources[0].entities.getById('osh:sys-fixture-1') !== undefined, true);
});

test('[osh-046] the layer sends no candidate of its own to the locations getter', async (t) => {
  const source = fakeSource();
  const layer = createOshLayer({ source });
  const { viewer } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  layer.enable(viewer);
  await layer.update(viewer);
  assert.equal(source.calls.locations, 1);
  const [args] = source.calls.locationsArgs;
  assert.deepEqual(Object.keys(args[0] ?? {}).sort(), ['signal']);
});

test('[osh-030] the poll passes the selected system id to the datastreams getter, and drops a record naming another system', async (t) => {
  const source = fakeSource({
    systems: [SYSTEM_A, SYSTEM_B],
    datastreams: [
      { id: 'ds-fixture-1', systemId: 'sys-fixture-1', name: 'D1' },
      { id: 'ds-fixture-2', systemId: 'sys-fixture-2', name: 'D2 (foreign)' },
    ],
  });
  const detailHost = { innerHTML: '' };
  const layer = createOshLayer({ source, detailHost });
  const { viewer } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  await withClickCapture(async (getClick) => {
    layer.enable(viewer);
    await layer.update(viewer);
    const { setPicked } = viewerPickHelper(viewer);
    setPicked('osh:sys-fixture-1');
    getClick()({ position: {} });
    await flush();
    assert.deepEqual(source.calls.datastreamsArgs, ['sys-fixture-1']);
    assert.match(detailHost.innerHTML, /D1/);
    assert.doesNotMatch(detailHost.innerHTML, /D2 \(foreign\)/, 'a record naming another system must be dropped');
  });
});

test('[osh-030] a poll superseded while it waits for the datastreams is discarded, and the newer poll still runs', async (t) => {
  let resolveDatastreams;
  const datastreamsPromise = new Promise((resolve) => {
    resolveDatastreams = resolve;
  });
  const source = {
    async getSystems() {
      return { keyRequired: false, systems: [SYSTEM_A, SYSTEM_B], stale: false };
    },
    async getDatastreams() {
      return datastreamsPromise;
    },
    async getObservation() {
      return { keyRequired: false, observation: null };
    },
  };
  const detailHost = { innerHTML: 'unset' };
  const layer = createOshLayer({ source, detailHost });
  const { viewer } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  await withClickCapture(async (getClick) => {
    layer.enable(viewer);
    await layer.update(viewer);
    const { setPicked } = viewerPickHelper(viewer);
    setPicked('osh:sys-fixture-1');
    getClick()({ position: {} });
    await flush();
    setPicked('osh:sys-fixture-2');
    getClick()({ position: {} });
    await flush();
    resolveDatastreams({
      keyRequired: false,
      datastreams: [{ id: 'ds-fixture-1', systemId: 'sys-fixture-2', name: 'D1' }],
    });
    await flush();
    assert.match(detailHost.innerHTML, /D1/, 'the newer poll for sys-fixture-2 still completes');
  });
});

test('[osh-030] a poll superseded mid-loop while it waits for an observation stops the detail rows', async (t) => {
  let resolveObservation;
  const observationPromise = new Promise((resolve) => {
    resolveObservation = resolve;
  });
  const source = {
    async getSystems() {
      return { keyRequired: false, systems: [SYSTEM_A], stale: false };
    },
    async getDatastreams() {
      return {
        keyRequired: false,
        datastreams: [
          { id: 'ds-fixture-1', systemId: 'sys-fixture-1', name: 'D1' },
          { id: 'ds-fixture-2', systemId: 'sys-fixture-1', name: 'D2' },
        ],
      };
    },
    async getObservation(id) {
      if (id === 'ds-fixture-1') return observationPromise;
      return { keyRequired: false, observation: null };
    },
  };
  const detailHost = { innerHTML: 'unset' };
  const layer = createOshLayer({ source, detailHost });
  const { viewer } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  await withClickCapture(async (getClick) => {
    layer.enable(viewer);
    await layer.update(viewer);
    const { setPicked } = viewerPickHelper(viewer);
    setPicked('osh:sys-fixture-1');
    getClick()({ position: {} });
    await flush();
    setPicked(null);
    getClick()({ position: {} });
    await flush();
    assert.equal(detailHost.innerHTML, '', 'deselecting clears the host');
    resolveObservation({ keyRequired: false, observation: { rows: [], location: null } });
    await flush();
    assert.equal(
      detailHost.innerHTML,
      '',
      'the superseded poll must not overwrite the cleared host',
    );
  });
});

test('[osh-029] a system with no name gets a point entity and no label', async (t) => {
  const unnamed = { id: 'sys-fixture-3', uid: null, name: null, description: null, lon: 5, lat: 6, alt: 0 };
  const source = fakeSource({ systems: [unnamed] });
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  layer.enable(viewer);
  await layer.update(viewer);
  const entity = dataSources[0].entities.getById('osh:sys-fixture-3');
  assert.equal(entity.label, undefined);
});

test('[osh-029] a second update aborts the first, whose late result is discarded even without a thrown AbortError', async (t) => {
  let calls = 0;
  let resolveFirst;
  const firstPromise = new Promise((resolve) => {
    resolveFirst = resolve;
  });
  const source = {
    async getSystems() {
      calls += 1;
      if (calls === 1) {
        await firstPromise;
        // Resolves normally, without checking its own signal — the layer
        // itself must still discard a superseded result.
        return { keyRequired: false, systems: [SYSTEM_A], stale: false };
      }
      return { keyRequired: false, systems: [SYSTEM_A, SYSTEM_B], stale: false };
    },
  };
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  layer.enable(viewer);
  const firstUpdate = layer.update(viewer);
  const secondUpdate = layer.update(viewer);
  const [firstResult, secondResult] = await Promise.all([
    (async () => {
      resolveFirst();
      return firstUpdate;
    })(),
    secondUpdate,
  ]);
  assert.equal(secondResult, true);
  assert.equal(firstResult, false);
  assert.equal(dataSources[0].entities.values.length, 2, 'only the second, newer result is applied');
});

test('[osh-029] aborts an update in flight on disable, with no error recorded', async (t) => {
  let signalSeen;
  const source = {
    async getSystems({ signal } = {}) {
      signalSeen = signal;
      await new Promise((resolve) => {
        signal.addEventListener('abort', resolve, { once: true });
      });
      signal.throwIfAborted();
    },
  };
  const layer = createOshLayer({ source });
  const { viewer } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  layer.enable(viewer);
  const updatePromise = layer.update(viewer);
  layer.disable(viewer);
  assert.equal(await updatePromise, false);
  assert.equal(signalSeen.aborted, true);
  assert.equal(layer.getStats().error, null);
});

test('[osh-029] aborts an update in flight on destroy', async (t) => {
  let signalSeen;
  const source = {
    async getSystems({ signal } = {}) {
      signalSeen = signal;
      await new Promise((resolve) => {
        signal.addEventListener('abort', resolve, { once: true });
      });
      signal.throwIfAborted();
    },
  };
  const layer = createOshLayer({ source });
  const { viewer } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  layer.enable(viewer);
  const updatePromise = layer.update(viewer);
  layer.destroy(viewer);
  assert.equal(await updatePromise, false);
  assert.equal(signalSeen.aborted, true);
});

test('[osh-029] a superseded update that throws a real error still lets the newer request finish', async (t) => {
  let calls = 0;
  let rejectFirst;
  const firstPromise = new Promise((_resolve, reject) => {
    rejectFirst = reject;
  });
  const source = {
    async getSystems() {
      calls += 1;
      if (calls === 1) return firstPromise;
      return { keyRequired: false, systems: [SYSTEM_A, SYSTEM_B], stale: false };
    },
  };
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  layer.enable(viewer);
  const firstUpdate = layer.update(viewer);
  const secondUpdate = layer.update(viewer);
  rejectFirst(new Error('a real, non-abort failure'));
  const [firstResult, secondResult] = await Promise.all([firstUpdate, secondUpdate]);
  assert.equal(firstResult, false);
  assert.equal(secondResult, true);
  assert.equal(layer.getStats().error, null, 'the superseded failure must not overwrite the newer result');
  assert.equal(dataSources[0].entities.values.length, 2);
});

test('[osh-046] a features getter that throws synchronously behaves exactly like one that rejects', async (t) => {
  const source = {
    async getSystems() {
      return { keyRequired: false, systems: [SYSTEM_A], stale: false };
    },
    getFois() {
      // Not async: calling this throws immediately, in the same tick,
      // rather than returning a rejected promise. The layer must still
      // treat this as the features read failing, not as a fatal error
      // that discards the successful systems read.
      throw new Error('fois threw synchronously, not a rejection');
    },
  };
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  layer.enable(viewer);
  const updated = await layer.update(viewer);
  assert.equal(updated, true);
  assert.equal(layer.getStats().count, 1, 'the systems read must still be drawn');
  assert.equal(dataSources[0].entities.values.length, 1);
  assert.equal(layer.getStats().partial, true);
  assert.equal(layer.getStats().error, null);
});

test('[osh-029] a duplicate feature id makes the draw loop throw, and the update reports that failure', async (t) => {
  // placeOshEntities() does not dedupe by id; only the server-side adapter
  // does. Two fois records sharing an id are a malformed features read
  // that reaches the draw loop, where Cesium refuses a second entity with
  // an id already in the collection — a failure this layer does not
  // control, arising after both reads already succeeded.
  const source = fakeSource({ fois: [FEATURE_A, { ...FEATURE_A }] });
  const layer = createOshLayer({ source });
  const { viewer } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  layer.enable(viewer);
  const updated = await layer.update(viewer);
  assert.equal(updated, false);
  assert.equal(typeof layer.getStats().error, 'string');
  assert.notEqual(layer.getStats().error, null);
});

test('[osh-029] a thrown non-Error while placing the entities still sets the fallback error message', async (t) => {
  // A getter, not a mocked getter/source call: this throws from inside
  // placeOshEntities()'s own read of the record, still after both reads
  // already settled, so it lands in the same catch as the duplicate-id
  // case above, but with a thrown value that carries no .message.
  const evilSystem = {
    id: 'sys-fixture-evil',
    uid: null,
    name: null,
    description: null,
    get lon() {
      throw 'not an Error instance';
    },
    lat: 1,
    alt: 0,
  };
  const source = fakeSource({ systems: [evilSystem] });
  const layer = createOshLayer({ source });
  const { viewer } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  layer.enable(viewer);
  await layer.update(viewer);
  assert.equal(layer.getStats().error, 'OSH source unavailable');
});

test('[osh-031] a moved entity with no altitude in the newest result defaults to zero', async (t) => {
  const source = fakeSource({
    systems: [SYSTEM_A],
    datastreams: [{ id: 'ds-fixture-1', systemId: 'sys-fixture-1', name: 'D1' }],
    observations: {
      'ds-fixture-1': { rows: [], location: { lat: 9, lon: 8 }, resultTime: 't', ageMs: 1000 },
    },
  });
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  await withClickCapture(async (getClick) => {
    layer.enable(viewer);
    await layer.update(viewer);
    const { setPicked } = viewerPickHelper(viewer);
    setPicked('osh:sys-fixture-1');
    getClick()({ position: {} });
    await flush();
    const entity = dataSources[0].entities.getById('osh:sys-fixture-1');
    const moved = entity.position.getValue(Cesium.JulianDate.now());
    const expected = Cesium.Cartesian3.fromDegrees(8, 9, 0);
    assert.ok(Cesium.Cartesian3.equalsEpsilon(moved, expected, Cesium.Math.EPSILON6));
  });
});

function viewerPickHelper(viewer) {
  return {
    setPicked(id) {
      viewer.scene.pick = () => (id === null ? null : { id: { id } });
    },
  };
}

async function flush() {
  for (let i = 0; i < 6; i += 1) await Promise.resolve();
}

// --- osh-057: place a system from a fresh stream record, and retire it ---

const FRESH_AGE_MS = 5_000;
const STALE_AGE_MS = 7_200_000;

function aircraftLocation(overrides = {}) {
  return {
    systemId: 'sys-fixture-9',
    systemName: 'Fixture Aircraft',
    foiId: null,
    foiUid: null,
    datastreamId: 'ds-fixture-aircraft',
    datastreamName: 'Aircraft Position',
    lon: 10,
    lat: 20,
    alt: 100,
    phenomenonTime: '2026-01-01T00:00:00Z',
    ageMs: FRESH_AGE_MS,
    ...overrides,
  };
}

test('[osh-057] a fresh location with no feature reference places its system, counted under getStats().placed.stream', async (t) => {
  const source = fakeSource({ systems: [], fois: [], locations: [aircraftLocation()] });
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  layer.enable(viewer);
  await layer.update(viewer);
  const entity = dataSources[0].entities.getById('osh:sys-fixture-9');
  assert.ok(entity, 'the stream-placed entity must exist');
  assert.equal(layer.getStats().placed.stream, 1);
});

test('[osh-057] a system with no record in the union map is named from the location, and never enters the union', async (t) => {
  const source = fakeSource({ systems: [], fois: [], locations: [aircraftLocation()] });
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  layer.enable(viewer);
  await layer.update(viewer);
  const entity = dataSources[0].entities.getById('osh:sys-fixture-9');
  assert.equal(entity.label.text.getValue(), 'Fixture Aircraft');
  assert.equal(entity.properties.name.getValue(), null, 'no held system record was created');
});

test('[osh-057] only a location with systemName:null gives the id as the label', async (t) => {
  const source = fakeSource({
    systems: [],
    fois: [],
    locations: [aircraftLocation({ systemName: null })],
  });
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  layer.enable(viewer);
  await layer.update(viewer);
  const entity = dataSources[0].entities.getById('osh:sys-fixture-9');
  assert.equal(entity.label.text.getValue(), 'sys-fixture-9');
});

test('[osh-057] a refresh with no fresh location for that system removes the entity and counts it under unplaced', async (t) => {
  let locations = [aircraftLocation()];
  const source = {
    async getSystems() {
      return { keyRequired: false, systems: [], stale: false };
    },
    async getFois() {
      return { keyRequired: false, fois: [], truncated: false };
    },
    async getLocations() {
      return { keyRequired: false, locations, failed: 0 };
    },
    async getDatastreams() {
      return { keyRequired: false, datastreams: [] };
    },
  };
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  layer.enable(viewer);
  await layer.update(viewer);
  assert.ok(dataSources[0].entities.getById('osh:sys-fixture-9'));

  locations = [];
  await layer.update(viewer);
  assert.equal(
    dataSources[0].entities.getById('osh:sys-fixture-9'),
    undefined,
    'the entity is gone once its stream is no longer fresh',
  );
  assert.equal(layer.getStats().unplaced, 1);
});

test('[osh-057] a placeholder that gains a held record and a Point on a later refresh is not counted as retired', async (t) => {
  let systems = [];
  let locations = [aircraftLocation()];
  const source = {
    async getSystems() {
      return { keyRequired: false, systems, stale: false };
    },
    async getFois() {
      return { keyRequired: false, fois: [], truncated: false };
    },
    async getLocations() {
      return { keyRequired: false, locations, failed: 0 };
    },
    async getDatastreams() {
      return { keyRequired: false, datastreams: [] };
    },
  };
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  layer.enable(viewer);
  await layer.update(viewer);
  assert.ok(dataSources[0].entities.getById('osh:sys-fixture-9'), 'placed as a placeholder from the stream');

  // The system now shows up in a systems refresh with its own Point, and
  // the stream that placed it as a placeholder goes stale. Its id is
  // still placed this refresh, by geometry, so it must not add to the
  // retirement count a placeholder losing its stream would otherwise add.
  systems = [{ id: 'sys-fixture-9', uid: 'urn:n', name: 'Held Now', description: null, lon: 5, lat: 6, alt: 0 }];
  locations = [];
  await layer.update(viewer);
  assert.ok(dataSources[0].entities.getById('osh:sys-fixture-9'), 'still placed, now by geometry');
  assert.equal(layer.getStats().unplaced, 0, 'a system placed this refresh is never also counted as retired');
});

test('[osh-057] a selected stream-placed system keeps its entity at its last position until deselected', async (t) => {
  let locations = [aircraftLocation()];
  const source = {
    async getSystems() {
      return { keyRequired: false, systems: [], stale: false };
    },
    async getFois() {
      return { keyRequired: false, fois: [], truncated: false };
    },
    async getLocations() {
      return { keyRequired: false, locations, failed: 0 };
    },
    async getDatastreams() {
      return { keyRequired: false, datastreams: [] };
    },
  };
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  await withClickCapture(async (getClick) => {
    layer.enable(viewer);
    await layer.update(viewer);
    const { setPicked } = viewerPickHelper(viewer);
    setPicked('osh:sys-fixture-9');
    getClick()({ position: {} });
    await flush();
    assert.equal(layer.getStats().selectedId, 'sys-fixture-9');

    locations = [];
    await layer.update(viewer);
    const entity = dataSources[0].entities.getById('osh:sys-fixture-9');
    assert.ok(entity, 'the selected entity stays even though its stream went stale');
    assert.equal(layer.getStats().selectedId, 'sys-fixture-9', 'the selection is not cleared');
    // The exception governs the entity only: the system still counts as
    // unplaced, because its stream went stale, even while its entity is
    // kept for the current selection.
    assert.equal(layer.getStats().unplaced, 1);
  });
});

test('[osh-057] a fresh location that names a feature moves the feature entity and never places a system', async (t) => {
  const source = fakeSource({
    systems: [],
    fois: [FEATURE_A],
    locations: [
      aircraftLocation({ systemId: null, systemName: null, foiId: FEATURE_A.id, lon: 30, lat: 31, alt: 32 }),
      aircraftLocation({ systemId: 'sys-fixture-second-no-point', systemName: null, foiId: 'foi-fixture-unheld-2', lon: 40, lat: 41, alt: 42 }),
    ],
  });
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  layer.enable(viewer);
  await layer.update(viewer);
  const featureEntity = dataSources[0].entities.getById('osh-foi:foi-fixture-1');
  const moved = featureEntity.position.getValue(Cesium.JulianDate.now());
  const expected = Cesium.Cartesian3.fromDegrees(30, 31, 32);
  assert.ok(Cesium.Cartesian3.equalsEpsilon(moved, expected, Cesium.Math.EPSILON6));
  assert.equal(dataSources[0].entities.getById('osh:sys-fixture-9'), undefined, 'no system entity was placed');
  assert.equal(dataSources[0].entities.getById('osh:sys-fixture-second-no-point'), undefined, 'unheld feature location never places system');
  assert.equal(layer.getStats().placed.stream, 0, 'placed.stream stays at zero');
});

test('[osh-057] a click on a stream-placed entity selects it and starts its datastream poll like any system', async (t) => {
  const source = fakeSource({ systems: [], fois: [], locations: [aircraftLocation()] });
  const layer = createOshLayer({ source });
  const { viewer } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  await withClickCapture(async (getClick) => {
    layer.enable(viewer);
    await layer.update(viewer);
    const { setPicked } = viewerPickHelper(viewer);
    setPicked('osh:sys-fixture-9');
    getClick()({ position: {} });
    await flush();
    assert.equal(layer.getStats().selectedId, 'sys-fixture-9');
    assert.equal(source.calls.datastreams, 1);
    assert.equal(source.calls.datastreamsArgs[0], 'sys-fixture-9');
  });
});

test('[osh-057] the detail for a selected stream-placed placeholder shows Placed by, with the name the location carries', async (t) => {
  const source = fakeSource({ systems: [], fois: [], locations: [aircraftLocation()] });
  const detailHost = { innerHTML: '' };
  const layer = createOshLayer({ source, detailHost });
  const { viewer } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  await withClickCapture(async (getClick) => {
    layer.enable(viewer);
    await layer.update(viewer);
    const { setPicked } = viewerPickHelper(viewer);
    setPicked('osh:sys-fixture-9');
    getClick()({ position: {} });
    await flush();
    assert.match(detailHost.innerHTML, /Fixture Aircraft/, 'the header falls back to the location\'s own systemName');
    assert.match(detailHost.innerHTML, /Placed by Aircraft Position/);
  });
});

test('[osh-057] a held system\'s own name wins over the location\'s systemName in the detail header', async (t) => {
  const source = fakeSource({ systems: [SYSTEM_NULL], fois: [], locations: [aircraftLocation()] });
  const detailHost = { innerHTML: '' };
  const layer = createOshLayer({ source, detailHost });
  const { viewer } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  await withClickCapture(async (getClick) => {
    layer.enable(viewer);
    await layer.update(viewer);
    const { setPicked } = viewerPickHelper(viewer);
    setPicked('osh:sys-fixture-9');
    getClick()({ position: {} });
    await flush();
    assert.match(detailHost.innerHTML, /No Point/, 'the held record\'s own name wins');
    assert.doesNotMatch(
      detailHost.innerHTML,
      /Fixture Aircraft/,
      'the location\'s systemName never overrides a held name',
    );
  });
});

test('[osh-057] getStats().placed.stream counts only the stream-placed system, not the geometry-placed one', async (t) => {
  const source = fakeSource({ systems: [SYSTEM_A], fois: [], locations: [aircraftLocation()] });
  const layer = createOshLayer({ source });
  const { viewer } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  layer.enable(viewer);
  await layer.update(viewer);
  const stats = layer.getStats();
  assert.equal(stats.count, 2, 'both the geometry-placed and the stream-placed system are on the map');
  assert.equal(stats.placed.stream, 1);
});

// --- osh-061: every entity draws on top of the depth test, at its own altitude ---

test('[osh-061] the system entity\'s point and label draw on top, with the height reference NONE', async (t) => {
  const source = fakeSource({ systems: [SYSTEM_A] });
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  layer.enable(viewer);
  await layer.update(viewer);
  const entity = dataSources[0].entities.getById('osh:sys-fixture-1');
  const now = Cesium.JulianDate.now();
  assert.equal(entity.point.disableDepthTestDistance.getValue(now), Infinity);
  assert.equal(entity.point.heightReference.getValue(now), Cesium.HeightReference.NONE);
  assert.equal(entity.label.disableDepthTestDistance.getValue(now), Infinity);
  assert.equal(entity.label.heightReference.getValue(now), Cesium.HeightReference.NONE);
});

test('[osh-061] the feature entity\'s point and label draw on top, with the height reference NONE', async (t) => {
  const source = fakeSource({ fois: [FEATURE_A] });
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  layer.enable(viewer);
  await layer.update(viewer);
  const entity = dataSources[0].entities.getById('osh-foi:foi-fixture-1');
  const now = Cesium.JulianDate.now();
  assert.equal(entity.point.disableDepthTestDistance.getValue(now), Infinity);
  assert.equal(entity.point.heightReference.getValue(now), Cesium.HeightReference.NONE);
  assert.equal(entity.label.disableDepthTestDistance.getValue(now), Infinity);
  assert.equal(entity.label.heightReference.getValue(now), Cesium.HeightReference.NONE);
});

test('[osh-061] the re-added entity for a selected system draws on top, on its point and its label', async (t) => {
  let locations = [aircraftLocation()];
  const source = {
    async getSystems() {
      return { keyRequired: false, systems: [], stale: false };
    },
    async getFois() {
      return { keyRequired: false, fois: [], truncated: false };
    },
    async getLocations() {
      return { keyRequired: false, locations, failed: 0 };
    },
    async getDatastreams() {
      return { keyRequired: false, datastreams: [] };
    },
  };
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  await withClickCapture(async (getClick) => {
    layer.enable(viewer);
    await layer.update(viewer);
    const { setPicked } = viewerPickHelper(viewer);
    setPicked('osh:sys-fixture-9');
    getClick()({ position: {} });
    await flush();

    // The stream goes quiet: this refresh re-adds the same entity id at
    // its last position instead of drawing it fresh (osh-057).
    locations = [];
    await layer.update(viewer);
    const entity = dataSources[0].entities.getById('osh:sys-fixture-9');
    const now = Cesium.JulianDate.now();
    assert.equal(entity.point.disableDepthTestDistance.getValue(now), Infinity);
    assert.equal(entity.point.heightReference.getValue(now), Cesium.HeightReference.NONE);
    // The re-add's label is the one site whose mechanism differs: it
    // carries the values by reusing the previous refresh's LabelGraphics,
    // not by passing through entityAlwaysOnTop() itself (D62).
    assert.equal(entity.label.disableDepthTestDistance.getValue(now), Infinity);
    assert.equal(entity.label.heightReference.getValue(now), Cesium.HeightReference.NONE);
  });
});

test('[osh-061] a system placed from a fresh location keeps its altitude', async (t) => {
  const source = fakeSource({ systems: [], fois: [], locations: [aircraftLocation()] });
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  layer.enable(viewer);
  await layer.update(viewer);
  const entity = dataSources[0].entities.getById('osh:sys-fixture-9');
  const cartographic = Cesium.Cartographic.fromCartesian(
    entity.position.getValue(Cesium.JulianDate.now()),
  );
  assert.ok(
    Math.abs(cartographic.height - 100) < 1e-3,
    `expected the fixture's own altitude, 100, got ${cartographic.height}`,
  );
});

test('[osh-061] a feature entity keeps its own altitude', async (t) => {
  const source = fakeSource({ fois: [FEATURE_ALT] });
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  layer.enable(viewer);
  await layer.update(viewer);
  const entity = dataSources[0].entities.getById('osh-foi:foi-fixture-alt');
  const cartographic = Cesium.Cartographic.fromCartesian(
    entity.position.getValue(Cesium.JulianDate.now()),
  );
  assert.ok(
    Math.abs(cartographic.height - 75) < 1e-3,
    `expected the fixture's own altitude, 75, got ${cartographic.height}`,
  );
});

test('[osh-061] a moved entity keeps the observation\'s altitude', async (t) => {
  const source = fakeSource({
    systems: [SYSTEM_A],
    datastreams: [{ id: 'ds-fixture-1', systemId: 'sys-fixture-1', name: 'D1' }],
    observations: {
      'ds-fixture-1': { rows: [], location: { lat: 9, lon: 8, alt: 250 }, resultTime: 't', ageMs: 1000 },
    },
  });
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  await withClickCapture(async (getClick) => {
    layer.enable(viewer);
    await layer.update(viewer);
    const { setPicked } = viewerPickHelper(viewer);
    setPicked('osh:sys-fixture-1');
    getClick()({ position: {} });
    await flush();
    const entity = dataSources[0].entities.getById('osh:sys-fixture-1');
    const cartographic = Cesium.Cartographic.fromCartesian(
      entity.position.getValue(Cesium.JulianDate.now()),
    );
    assert.ok(
      Math.abs(cartographic.height - 250) < 1e-3,
      `expected the observation's own altitude, 250, got ${cartographic.height}`,
    );
  });
});

// --- osh-062: hide an entity beyond the ellipsoid horizon ---

test('[osh-062] a refresh under a camera that has not moved hides the antipode entities and shows the near ones', async (t) => {
  const source = fakeSource({ systems: [SYSTEM_A, SYSTEM_FAR], fois: [FEATURE_A, FEATURE_FAR] });
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
  layer.init(viewer);
  t.after(() => layer.destroy(viewer));
  layer.enable(viewer);
  await layer.update(viewer);
  const near = dataSources[0].entities.getById('osh:sys-fixture-1');
  const far = dataSources[0].entities.getById('osh:sys-fixture-far');
  const nearFeature = dataSources[0].entities.getById('osh-foi:foi-fixture-1');
  const farFeature = dataSources[0].entities.getById('osh-foi:foi-fixture-far');
  assert.equal(near.show, true, 'an entity under the camera stays visible');
  assert.equal(nearFeature.show, true);
  assert.equal(far.show, false, 'an entity at the antipode starts hidden, before any moveEnd');
  assert.equal(farFeature.show, false);
});

test('[osh-062] a moveEnd over the antipode swaps which entities show', async (t) => {
  const source = fakeSource({ systems: [SYSTEM_A, SYSTEM_FAR], fois: [] });
  const layer = createOshLayer({ source });
  const { viewer, dataSources, setCamera, raiseMoveEnd } = fakeViewer();
  layer.init(viewer);
  t.after(() => layer.destroy(viewer));
  layer.enable(viewer);
  await layer.update(viewer);
  const near = dataSources[0].entities.getById('osh:sys-fixture-1');
  const far = dataSources[0].entities.getById('osh:sys-fixture-far');
  assert.equal(near.show, true);
  assert.equal(far.show, false);

  setCamera(-179, -2, 1_500_000);
  raiseMoveEnd();
  assert.equal(near.show, false, 'the near entity is now beyond the horizon');
  assert.equal(far.show, true, 'the camera now sees the far entity');
});

test('[osh-062] a moveEnd raised while the layer is off still updates show, so enable() shows a correct set', async (t) => {
  const source = fakeSource({ systems: [SYSTEM_A, SYSTEM_FAR], fois: [] });
  const layer = createOshLayer({ source });
  const { viewer, dataSources, setCamera, raiseMoveEnd } = fakeViewer();
  layer.init(viewer);
  t.after(() => layer.destroy(viewer));
  layer.enable(viewer);
  await layer.update(viewer);
  layer.disable();

  setCamera(-179, -2, 1_500_000);
  raiseMoveEnd();

  layer.enable(viewer);
  const near = dataSources[0].entities.getById('osh:sys-fixture-1');
  const far = dataSources[0].entities.getById('osh:sys-fixture-far');
  assert.equal(near.show, false, 'updated while the layer was off');
  assert.equal(far.show, true, 'enable() shows the set the listener already computed');
});

test('[osh-062] a poll move across the horizon hides the selected entity, and a later move back shows it', async (t) => {
  t.mock.timers.enable({ apis: ['setInterval'] });
  let location = { lat: 2, lon: 1 };
  const source = {
    async getSystems() {
      return { keyRequired: false, systems: [SYSTEM_A], stale: false };
    },
    async getFois() {
      return { keyRequired: false, fois: [], truncated: false };
    },
    async getDatastreams() {
      return { keyRequired: false, datastreams: [{ id: 'ds-fixture-1', systemId: 'sys-fixture-1', name: 'D1' }] };
    },
    async getObservation() {
      return { keyRequired: false, observation: { rows: [], location: { ...location, alt: 0 }, resultTime: 't', ageMs: 1000 } };
    },
  };
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
  layer.init(viewer);
  t.after(() => layer.destroy(viewer));
  await withClickCapture(async (getClick) => {
    layer.enable(viewer);
    await layer.update(viewer);
    const { setPicked } = viewerPickHelper(viewer);
    setPicked('osh:sys-fixture-1');
    getClick()({ position: {} });
    await flush();
    const entity = dataSources[0].entities.getById('osh:sys-fixture-1');
    assert.equal(entity.show, true, 'starts under the camera');

    location = { lat: -2, lon: -179 };
    t.mock.timers.tick(15_000);
    await flush();
    assert.equal(entity.show, false, 'the poll carried it past the horizon');

    location = { lat: 2, lon: 1 };
    t.mock.timers.tick(15_000);
    await flush();
    assert.equal(entity.show, true, 'a later poll move brings it back into view');
  });
});

test('[osh-062] init() adds one moveEnd listener, disable() keeps it, and destroy() removes it', (t) => {
  const layer = createOshLayer({ source: fakeSource() });
  const { viewer } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  assert.equal(viewer.camera.moveEnd.numberOfListeners, 1);
  layer.enable(viewer);
  assert.equal(viewer.camera.moveEnd.numberOfListeners, 1);
  layer.disable();
  assert.equal(viewer.camera.moveEnd.numberOfListeners, 1, 'the listener stays while the layer is off');
  layer.destroy(viewer);
  assert.equal(viewer.camera.moveEnd.numberOfListeners, 0);
});

// --- osh-059: show one entity per stream-drawn feature ---

test('[osh-059] the map holds osh-foi:<id> for a stream-drawn feature at the location\'s position, with no label, and getStats().features counts it', async (t) => {
  const source = fakeSource({
    systems: [],
    fois: [],
    locations: [
      aircraftLocation({
        foiId: 'foi-fixture-unheld-1',
        systemId: 'sys-fixture-host-1',
        systemName: 'Host System',
        lon: 15,
        lat: 25,
        alt: 50,
      }),
    ],
  });
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
  layer.init(viewer);
  t.after(() => layer.destroy(viewer));
  layer.enable(viewer);
  await layer.update(viewer);

  const entity = dataSources[0].entities.getById('osh-foi:foi-fixture-unheld-1');
  assert.ok(entity);
  const position = entity.position.getValue(Cesium.JulianDate.now());
  const expected = Cesium.Cartesian3.fromDegrees(15, 25, 50);
  assert.ok(Cesium.Cartesian3.equalsEpsilon(position, expected, Cesium.Math.EPSILON6));
  assert.equal(entity.label, undefined);
  assert.equal(layer.getStats().features, 1);
});

test('[osh-059] the location\'s systemName never becomes the label of a stream-drawn feature', async (t) => {
  const source = fakeSource({
    systems: [],
    fois: [],
    locations: [
      aircraftLocation({
        foiId: 'foi-fixture-unheld-1',
        systemId: 'sys-fixture-host-1',
        systemName: 'Host Name Should Not Appear On Feature',
        lon: 15,
        lat: 25,
        alt: 50,
      }),
    ],
  });
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
  layer.init(viewer);
  t.after(() => layer.destroy(viewer));
  layer.enable(viewer);
  await layer.update(viewer);

  const entity = dataSources[0].entities.getById('osh-foi:foi-fixture-unheld-1');
  assert.ok(entity);
  assert.equal(entity.label, undefined);
});

test('[osh-059] three fresh unheld features of one host at one position give three entities, with no grouping', async (t) => {
  const source = fakeSource({
    systems: [],
    fois: [],
    locations: [
      aircraftLocation({
        foiId: 'foi-fixture-f1',
        systemId: 'sys-fixture-host-1',
        lon: 15,
        lat: 25,
        alt: 50,
      }),
      aircraftLocation({
        foiId: 'foi-fixture-f2',
        systemId: 'sys-fixture-host-1',
        lon: 15,
        lat: 25,
        alt: 50,
      }),
      aircraftLocation({
        foiId: 'foi-fixture-f3',
        systemId: 'sys-fixture-host-1',
        lon: 15,
        lat: 25,
        alt: 50,
      }),
    ],
  });
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
  layer.init(viewer);
  t.after(() => layer.destroy(viewer));
  layer.enable(viewer);
  await layer.update(viewer);

  assert.equal(dataSources[0].entities.values.length, 3);
  assert.ok(dataSources[0].entities.getById('osh-foi:foi-fixture-f1'));
  assert.ok(dataSources[0].entities.getById('osh-foi:foi-fixture-f2'));
  assert.ok(dataSources[0].entities.getById('osh-foi:foi-fixture-f3'));
});

test('[osh-059] a click on a stream-drawn feature selects its host and starts the datastream poll', async (t) => {
  const source = fakeSource({
    systems: [],
    fois: [],
    locations: [
      aircraftLocation({
        foiId: 'foi-fixture-unheld-1',
        systemId: 'sys-fixture-host-1',
      }),
    ],
  });
  const layer = createOshLayer({ source });
  const { viewer, setPicked } = fakeViewer();
  layer.init(viewer);
  t.after(() => layer.destroy(viewer));
  await withClickCapture(async (getClick) => {
    layer.enable(viewer);
    await layer.update(viewer);
    setPicked('osh-foi:foi-fixture-unheld-1');
    getClick()({ position: {} });
    await flush();
    assert.equal(layer.getStats().selectedFeatureId, 'foi-fixture-unheld-1');
    assert.equal(layer.getStats().selectedId, 'sys-fixture-host-1');
    assert.deepEqual(source.calls.datastreamsArgs, ['sys-fixture-host-1']);
  });
});

test('[osh-059] placed.streamFeatures counts the stream-drawn feature and not the held feature a stream moved', async (t) => {
  const source = fakeSource({
    systems: [],
    fois: [FEATURE_A],
    locations: [
      aircraftLocation({
        foiId: FEATURE_A.id,
        systemId: FEATURE_A.systemId,
        lon: 10,
        lat: 20,
        alt: 30,
      }),
      aircraftLocation({
        foiId: 'foi-fixture-unheld-1',
        systemId: 'sys-fixture-host-1',
        lon: 15,
        lat: 25,
        alt: 35,
      }),
    ],
  });
  const layer = createOshLayer({ source });
  const { viewer } = fakeViewer();
  layer.init(viewer);
  t.after(() => layer.destroy(viewer));
  layer.enable(viewer);
  await layer.update(viewer);

  const stats = layer.getStats();
  assert.equal(stats.features, 2);
  assert.equal(stats.placed.streamFeatures, 1);
});

test('[osh-059] the detail for a selected stream-drawn feature shows its id, its host id and Placed by with the location\'s age', async (t) => {
  const detailHost = { innerHTML: '' };
  const source = fakeSource({
    systems: [],
    fois: [],
    locations: [
      aircraftLocation({
        foiId: 'foi-fixture-unheld-1',
        systemId: 'sys-fixture-host-1',
        systemName: 'Fixture Host Name',
        datastreamName: 'Stream Alpha',
        ageMs: 12_000,
      }),
    ],
  });
  const layer = createOshLayer({ source, detailHost });
  const { viewer, setPicked } = fakeViewer();
  layer.init(viewer);
  t.after(() => layer.destroy(viewer));
  await withClickCapture(async (getClick) => {
    layer.enable(viewer);
    await layer.update(viewer);
    setPicked('osh-foi:foi-fixture-unheld-1');
    getClick()({ position: {} });
    await flush();

    assert.match(detailHost.innerHTML, /foi-fixture-unheld-1/);
    assert.match(detailHost.innerHTML, /Host:\s*sys-fixture-host-1/);
    assert.match(detailHost.innerHTML, /Placed by Stream Alpha \(12 s\)/);
    assert.doesNotMatch(detailHost.innerHTML, /<h3>Fixture Host Name<\/h3>/);
  });
});

test('[osh-059] the detail for a selected stream-drawn feature with no host shows Placed by with the datastream name and age', async (t) => {
  const detailHost = { innerHTML: '' };
  const source = fakeSource({
    systems: [],
    fois: [],
    locations: [
      aircraftLocation({
        foiId: 'foi-fixture-unheld-nohost-1',
        systemId: null,
        systemName: null,
        datastreamName: 'Stream Unheld',
        ageMs: 15_000,
      }),
    ],
  });
  const layer = createOshLayer({ source, detailHost });
  const { viewer, setPicked } = fakeViewer();
  layer.init(viewer);
  t.after(() => layer.destroy(viewer));
  await withClickCapture(async (getClick) => {
    layer.enable(viewer);
    await layer.update(viewer);
    setPicked('osh-foi:foi-fixture-unheld-nohost-1');
    getClick()({ position: {} });
    await flush();

    assert.match(detailHost.innerHTML, /foi-fixture-unheld-nohost-1/);
    assert.match(detailHost.innerHTML, /Host:\s*—/);
    assert.match(detailHost.innerHTML, /Placed by Stream Unheld \(15 s\)/);
  });
});

test('[osh-059] a refresh with no fresh location for a stream-drawn feature removes its entity and clears its selection', async (t) => {
  let locations = [
    aircraftLocation({
      foiId: 'foi-fixture-unheld-1',
      systemId: 'sys-fixture-host-1',
    }),
  ];
  const source = fakeSource({
    systems: [],
    fois: [],
    locations: [],
  });
  source.getLocations = async () => ({ keyRequired: false, locations, failed: 0 });
  const layer = createOshLayer({ source });
  const { viewer, dataSources, setPicked } = fakeViewer();
  layer.init(viewer);
  t.after(() => layer.destroy(viewer));
  await withClickCapture(async (getClick) => {
    layer.enable(viewer);
    await layer.update(viewer);
    setPicked('osh-foi:foi-fixture-unheld-1');
    getClick()({ position: {} });
    await flush();
    assert.equal(layer.getStats().selectedFeatureId, 'foi-fixture-unheld-1');
    assert.ok(dataSources[0].entities.getById('osh-foi:foi-fixture-unheld-1'));

    locations = [];
    await layer.update(viewer);
    assert.equal(dataSources[0].entities.getById('osh-foi:foi-fixture-unheld-1'), undefined);
    assert.equal(layer.getStats().selectedFeatureId, null);
    assert.equal(layer.getStats().selectedId, null);
  });
});

test('[osh-059] a selected stream-drawn feature keeps its selection across a refresh that still draws it', async (t) => {
  const source = fakeSource({
    systems: [],
    fois: [],
    locations: [
      aircraftLocation({
        foiId: 'foi-fixture-unheld-1',
        systemId: 'sys-fixture-host-1',
      }),
    ],
  });
  const layer = createOshLayer({ source });
  const { viewer, setPicked } = fakeViewer();
  layer.init(viewer);
  t.after(() => layer.destroy(viewer));
  await withClickCapture(async (getClick) => {
    layer.enable(viewer);
    await layer.update(viewer);
    setPicked('osh-foi:foi-fixture-unheld-1');
    getClick()({ position: {} });
    await flush();
    assert.equal(layer.getStats().selectedFeatureId, 'foi-fixture-unheld-1');

    await layer.update(viewer);
    assert.equal(layer.getStats().selectedFeatureId, 'foi-fixture-unheld-1');
  });
});

test('[osh-032] the detail for a selected held feature that a stream moves shows its name and Placed by with the location\'s age', async (t) => {
  const detailHost = { innerHTML: '' };
  const source = fakeSource({
    systems: [SYSTEM_A],
    fois: [FEATURE_A],
    locations: [
      aircraftLocation({
        foiId: FEATURE_A.id,
        systemId: FEATURE_A.systemId,
        datastreamName: 'Stream Beta',
        ageMs: 42_000,
      }),
    ],
  });
  const layer = createOshLayer({ source, detailHost });
  const { viewer, setPicked } = fakeViewer();
  layer.init(viewer);
  t.after(() => layer.destroy(viewer));
  await withClickCapture(async (getClick) => {
    layer.enable(viewer);
    await layer.update(viewer);
    setPicked(`osh-foi:${FEATURE_A.id}`);
    getClick()({ position: {} });
    await flush();

    assert.match(detailHost.innerHTML, /<h3>Feature A<\/h3>/);
    assert.match(detailHost.innerHTML, /Placed by Stream Beta \(42 s\)/);
  });
});

test('[osh-059] a system with no Point that only an unheld-feature location names counts under unplaced', async (t) => {
  const source = fakeSource({
    systems: [SYSTEM_NULL],
    fois: [],
    locations: [
      aircraftLocation({
        foiId: 'foi-fixture-unheld-1',
        systemId: SYSTEM_NULL.id,
      }),
    ],
  });
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
  layer.init(viewer);
  t.after(() => layer.destroy(viewer));
  layer.enable(viewer);
  await layer.update(viewer);

  assert.equal(dataSources[0].entities.getById('osh:sys-fixture-9'), undefined);
  assert.ok(dataSources[0].entities.getById('osh-foi:foi-fixture-unheld-1'));
  const stats = layer.getStats();
  assert.equal(stats.unplaced, 1);
  assert.equal(stats.count, 0);
  assert.equal(stats.features, 1);
  assert.equal(stats.placed.stream, 0, 'the location places no system');
});

test('[osh-059] destroy() forgets the stream-drawn feature and zeroes placed.streamFeatures', async (t) => {
  const source = fakeSource({
    systems: [],
    fois: [],
    locations: [
      aircraftLocation({
        foiId: 'foi-fixture-unheld-1',
        systemId: 'sys-fixture-host-1',
      }),
    ],
  });
  const layer = createOshLayer({ source });
  const { viewer } = fakeViewer();
  layer.init(viewer);
  t.after(() => layer.destroy(viewer));
  layer.enable(viewer);
  await layer.update(viewer);

  assert.equal(layer.getStats().placed.streamFeatures, 1);
  layer.destroy(viewer);
  assert.equal(layer.getStats().placed.streamFeatures, 0);
});

// --- osh-060: keep one entity across a failed features read ---

test('[osh-060] one entity id across a held refresh, a failed features read and a restored read, and none once the location is gone', async (t) => {
  let foiFail = false;
  let locationFresh = true;
  const foiRecord = {
    id: 'foi-fixture-stable-1',
    uid: 'foi-fixture-stable',
    systemId: 'sys-fixture-host-1',
    name: 'Stable Feature',
    description: null,
    validTime: null,
    lon: 1,
    lat: 2,
    alt: 0,
  };
  const source = fakeSource({
    systems: [],
    fois: [foiRecord],
    locations: [],
  });
  source.getFois = async () => {
    if (foiFail) throw new Error('features unavailable');
    return { keyRequired: false, fois: [foiRecord], truncated: false };
  };
  source.getLocations = async () => {
    if (!locationFresh) return { keyRequired: false, locations: [], failed: 0 };
    return {
      keyRequired: false,
      locations: [
        aircraftLocation({
          foiId: 'foi-fixture-stable-1',
          systemId: 'sys-fixture-host-1',
          lon: 10,
          lat: 20,
          alt: 30,
          ageMs: FRESH_AGE_MS,
        }),
      ],
      failed: 0,
    };
  };

  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
  layer.init(viewer);
  t.after(() => layer.destroy(viewer));
  layer.enable(viewer);

  const expectedPos = Cesium.Cartesian3.fromDegrees(10, 20, 30);

  // Refresh 1: held refresh (getFois succeeds, location is fresh)
  await layer.update(viewer);
  let entity = dataSources[0].entities.getById('osh-foi:foi-fixture-stable-1');
  assert.ok(entity);
  assert.ok(Cesium.Cartesian3.equalsEpsilon(entity.position.getValue(Cesium.JulianDate.now()), expectedPos, Cesium.Math.EPSILON6));
  assert.equal(entity.label?.text?.getValue(Cesium.JulianDate.now()), 'Stable Feature');
  assert.equal(layer.getStats().partial, false);
  assert.equal(layer.getStats().placed.streamFeatures, 0);

  // Refresh 2: failed features read (getFois throws, location is fresh)
  foiFail = true;
  await layer.update(viewer);
  entity = dataSources[0].entities.getById('osh-foi:foi-fixture-stable-1');
  assert.ok(entity);
  assert.ok(Cesium.Cartesian3.equalsEpsilon(entity.position.getValue(Cesium.JulianDate.now()), expectedPos, Cesium.Math.EPSILON6));
  assert.equal(entity.label, undefined);
  assert.equal(layer.getStats().partial, true);
  assert.equal(layer.getStats().placed.streamFeatures, 1);

  // Refresh 3: restored read (getFois succeeds, location is fresh)
  foiFail = false;
  await layer.update(viewer);
  entity = dataSources[0].entities.getById('osh-foi:foi-fixture-stable-1');
  assert.ok(entity);
  assert.ok(Cesium.Cartesian3.equalsEpsilon(entity.position.getValue(Cesium.JulianDate.now()), expectedPos, Cesium.Math.EPSILON6));
  assert.equal(entity.label?.text?.getValue(Cesium.JulianDate.now()), 'Stable Feature');
  assert.equal(layer.getStats().partial, false);
  assert.equal(layer.getStats().placed.streamFeatures, 0);

  // Refresh 4: getFois throws, location is gone (no fresh location)
  foiFail = true;
  locationFresh = false;
  await layer.update(viewer);
  entity = dataSources[0].entities.getById('osh-foi:foi-fixture-stable-1');
  assert.equal(entity, undefined);
  assert.equal(layer.getStats().partial, true);
  assert.equal(layer.getStats().placed.streamFeatures, 0);
});

// --- osh-072 to osh-074: the live streams of the selected system ---

/** Wait until every promise step of the layer has run. */
async function settle() {
  await new Promise((resolve) => setImmediate(resolve));
}

async function pickAndSettle(getClick, viewer, id) {
  viewerPickHelper(viewer).setPicked(id);
  getClick()({ position: {} });
  await settle();
}

function liveDatastreams(count, systemId = 'sys-fixture-1', prefix = '') {
  return Array.from({ length: count }, (_, index) => ({
    id: `ds-fixture-${prefix}${index + 1}`,
    systemId,
    name: `D${index + 1}`,
  }));
}

function polledObservation(text, overrides = {}) {
  return { rows: [{ path: 'polled', value: text }], location: null, resultTime: 't', ageMs: 1000, ...overrides };
}

function liveObservation(overrides = {}) {
  return {
    phenomenonTime: '2026-01-01T00:00:00Z',
    resultTime: '2026-01-01T00:00:01Z',
    rows: [{ path: 'speed', value: 42 }],
    location: { lat: 9, lon: 8, alt: 7 },
    ageMs: 3000,
    ...overrides,
  };
}

/** The datastream blocks of a detail, in order. */
function detailBlocks(detailHost) {
  return detailHost.innerHTML.split('<div class="osh-detail-datastream">').slice(1);
}

function positionOf(dataSource, id) {
  return dataSource.entities.getById(id).position.getValue(Cesium.JulianDate.now());
}

function isAt(position, lon, lat, alt) {
  return Cesium.Cartesian3.equalsEpsilon(position, Cesium.Cartesian3.fromDegrees(lon, lat, alt), Cesium.Math.EPSILON6);
}

test('[osh-072] the layer opens one live stream for each of the first eight datastreams of the selected system', async (t) => {
  t.mock.timers.enable({ apis: ['setInterval'] });
  const other = { id: 'ds-fixture-other', systemId: 'sys-fixture-2', name: 'Other' };
  const source = fakeSource({ live: true, datastreams: [other, ...liveDatastreams(10)] });
  const layer = createOshLayer({ source });
  const { viewer } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  await withClickCapture(async (getClick) => {
    layer.enable(viewer);
    await layer.update(viewer);
    await pickAndSettle(getClick, viewer, 'osh:sys-fixture-1');
    assert.deepEqual(
      source.calls.live.map((stream) => stream.id),
      liveDatastreams(8).map((record) => record.id),
    );
    t.mock.timers.tick(15_000);
    await settle();
    assert.equal(source.calls.live.length, 8, 'the next poll opens no more stream');
  });
});

test('[osh-072] the layer opens one live stream for a datastream that the list holds twice', async (t) => {
  const twice = liveDatastreams(1)[0];
  const source = fakeSource({ live: true, datastreams: [twice, twice] });
  const layer = createOshLayer({ source });
  const { viewer } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  await withClickCapture(async (getClick) => {
    layer.enable(viewer);
    await layer.update(viewer);
    await pickAndSettle(getClick, viewer, 'osh:sys-fixture-1');
    assert.deepEqual(
      source.calls.live.map((stream) => stream.id),
      ['ds-fixture-1'],
    );
  });
});

test('[osh-072] a new selection closes every open live stream and opens the streams of the new system', async (t) => {
  const source = fakeSource({
    live: true,
    datastreams: [...liveDatastreams(2), ...liveDatastreams(2, 'sys-fixture-2', 'b')],
  });
  const layer = createOshLayer({ source });
  const { viewer } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  await withClickCapture(async (getClick) => {
    layer.enable(viewer);
    await layer.update(viewer);
    await pickAndSettle(getClick, viewer, 'osh:sys-fixture-1');
    const first = [...source.calls.live];
    assert.deepEqual(
      first.map((stream) => stream.closed),
      [0, 0],
    );
    await pickAndSettle(getClick, viewer, 'osh:sys-fixture-2');
    assert.deepEqual(
      first.map((stream) => stream.closed),
      [1, 1],
      'the streams of the first system close',
    );
    const second = source.calls.live.slice(2);
    assert.deepEqual(
      second.map((stream) => [stream.id, stream.closed]),
      [
        ['ds-fixture-b1', 0],
        ['ds-fixture-b2', 0],
      ],
    );
  });
});

test('[osh-072] a click on empty space closes every open live stream', async (t) => {
  const source = fakeSource({ live: true, datastreams: liveDatastreams(2) });
  const layer = createOshLayer({ source });
  const { viewer } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  await withClickCapture(async (getClick) => {
    layer.enable(viewer);
    await layer.update(viewer);
    await pickAndSettle(getClick, viewer, 'osh:sys-fixture-1');
    assert.deepEqual(
      source.calls.live.map((stream) => stream.closed),
      [0, 0],
    );
    await pickAndSettle(getClick, viewer, null);
    assert.deepEqual(
      source.calls.live.map((stream) => stream.closed),
      [1, 1],
    );
  });
});

test('[osh-072] the destroy method closes every open live stream', async (t) => {
  const source = fakeSource({ live: true, datastreams: liveDatastreams(2) });
  const layer = createOshLayer({ source });
  const { viewer } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  await withClickCapture(async (getClick) => {
    layer.enable(viewer);
    await layer.update(viewer);
    await pickAndSettle(getClick, viewer, 'osh:sys-fixture-1');
    layer.destroy(viewer);
    assert.deepEqual(
      source.calls.live.map((stream) => stream.closed),
      [1, 1],
    );
  });
});

test('[osh-072] a refresh that drops the selected feature closes every open live stream', async (t) => {
  let fois = [FEATURE_A];
  const source = fakeSource({ live: true, datastreams: liveDatastreams(2) });
  source.getFois = async () => ({ keyRequired: false, fois, truncated: false });
  const layer = createOshLayer({ source });
  const { viewer } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  await withClickCapture(async (getClick) => {
    layer.enable(viewer);
    await layer.update(viewer);
    await pickAndSettle(getClick, viewer, 'osh-foi:foi-fixture-1');
    assert.equal(layer.getStats().selectedFeatureId, 'foi-fixture-1');
    assert.equal(source.calls.live.length, 2, 'a feature selection opens the streams of its host');
    fois = [];
    await layer.update(viewer);
    assert.equal(layer.getStats().selectedFeatureId, null);
    assert.deepEqual(
      source.calls.live.map((stream) => stream.closed),
      [1, 1],
    );
  });
});

test('[osh-072] a callback of a live stream that the layer closed changes nothing', async (t) => {
  const source = fakeSource({
    live: true,
    datastreams: [...liveDatastreams(1), ...liveDatastreams(1, 'sys-fixture-2', 'b')],
  });
  const detailHost = { innerHTML: '' };
  const layer = createOshLayer({ source, detailHost });
  const { viewer, dataSources } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  await withClickCapture(async (getClick) => {
    layer.enable(viewer);
    await layer.update(viewer);
    await pickAndSettle(getClick, viewer, 'osh:sys-fixture-1');
    const [stale] = source.calls.live;
    await pickAndSettle(getClick, viewer, 'osh:sys-fixture-2');
    const detailBefore = detailHost.innerHTML;
    stale.callbacks.onOpen();
    stale.callbacks.onObservation(liveObservation());
    assert.equal(detailHost.innerHTML, detailBefore, 'the detail of the new selection stays');
    assert.ok(isAt(positionOf(dataSources[0], 'osh:sys-fixture-2'), 3, 4, 0), 'the new entity stays');
    layer.destroy(viewer);
    assert.doesNotThrow(() => stale.callbacks.onObservation(liveObservation()));
  });
});

test('[osh-073] a live observation replaces the observation of its datastream and keeps the others', async (t) => {
  const source = fakeSource({
    live: true,
    datastreams: liveDatastreams(2),
    observations: {
      'ds-fixture-1': polledObservation('one'),
      'ds-fixture-2': polledObservation('two'),
    },
  });
  const detailHost = { innerHTML: '' };
  const layer = createOshLayer({ source, detailHost });
  const { viewer } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  await withClickCapture(async (getClick) => {
    layer.enable(viewer);
    await layer.update(viewer);
    await pickAndSettle(getClick, viewer, 'osh:sys-fixture-1');
    assert.match(detailBlocks(detailHost)[0], />one</);
    const [first, second] = source.calls.live;
    first.callbacks.onOpen();
    second.callbacks.onOpen();

    first.callbacks.onObservation(liveObservation());
    let blocks = detailBlocks(detailHost);
    assert.equal(blocks.length, 2);
    assert.match(blocks[0], /D1/);
    assert.match(blocks[0], /speed/);
    assert.match(blocks[0], />42</);
    assert.match(blocks[0], /2026-01-01T00:00:01Z/);
    assert.match(blocks[0], /3 s/, 'the block shows the age of the observation');
    assert.doesNotMatch(blocks[0], />one</, 'the live observation replaces the polled one');
    assert.match(blocks[1], />two</, 'the other datastream keeps its observation');

    second.callbacks.onObservation(liveObservation({ rows: [{ path: 'altitude', value: 900 }], ageMs: 65_000 }));
    blocks = detailBlocks(detailHost);
    assert.match(blocks[0], /speed/, 'the first datastream keeps its live observation');
    assert.match(blocks[1], /altitude/);
    assert.match(blocks[1], /1 min/);
    assert.doesNotMatch(blocks[1], />two</);
  });
});

test('[osh-073] a live observation with a fresh location moves the entity', async (t) => {
  const source = fakeSource({ live: true, datastreams: liveDatastreams(1) });
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  await withClickCapture(async (getClick) => {
    layer.enable(viewer);
    await layer.update(viewer);
    await pickAndSettle(getClick, viewer, 'osh:sys-fixture-1');
    const [stream] = source.calls.live;
    assert.ok(isAt(positionOf(dataSources[0], 'osh:sys-fixture-1'), 1, 2, 0), 'the entity starts at its system point');
    stream.callbacks.onOpen();
    stream.callbacks.onObservation(liveObservation());
    assert.ok(isAt(positionOf(dataSources[0], 'osh:sys-fixture-1'), 8, 9, 7));
    stream.callbacks.onObservation(liveObservation({ location: { lat: 6, lon: 5 } }));
    assert.ok(isAt(positionOf(dataSources[0], 'osh:sys-fixture-1'), 5, 6, 0), 'a location with no altitude gives zero');
  });
});

test('[osh-073] a live move across the horizon hides the entity, and a later move shows it', async (t) => {
  const source = fakeSource({ live: true, datastreams: liveDatastreams(1) });
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  await withClickCapture(async (getClick) => {
    layer.enable(viewer);
    await layer.update(viewer);
    await pickAndSettle(getClick, viewer, 'osh:sys-fixture-1');
    const [stream] = source.calls.live;
    const entity = dataSources[0].entities.getById('osh:sys-fixture-1');
    assert.equal(entity.show, true, 'starts under the camera');
    stream.callbacks.onObservation(liveObservation({ location: { lat: -2, lon: -179, alt: 0 } }));
    assert.equal(entity.show, false, 'the live move carried it past the horizon');
    stream.callbacks.onObservation(liveObservation({ location: { lat: 2, lon: 1, alt: 0 } }));
    assert.equal(entity.show, true, 'a later live move brings it back into view');
  });
});

test('[osh-073] a live observation that is not fresh leaves the entity where it was, and the detail shows it', async (t) => {
  const source = fakeSource({ live: true, datastreams: liveDatastreams(1) });
  const detailHost = { innerHTML: '' };
  const layer = createOshLayer({ source, detailHost });
  const { viewer, dataSources } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  await withClickCapture(async (getClick) => {
    layer.enable(viewer);
    await layer.update(viewer);
    await pickAndSettle(getClick, viewer, 'osh:sys-fixture-1');
    const [stream] = source.calls.live;
    stream.callbacks.onObservation(liveObservation({ ageMs: OSH_FRESH_MAX_AGE_MS + 1 }));
    assert.ok(isAt(positionOf(dataSources[0], 'osh:sys-fixture-1'), 1, 2, 0), 'an old observation moves nothing');
    assert.match(detailBlocks(detailHost)[0], /speed/, 'the detail still shows the old observation');
    stream.callbacks.onObservation(liveObservation({ ageMs: null }));
    assert.ok(isAt(positionOf(dataSources[0], 'osh:sys-fixture-1'), 1, 2, 0), 'an unknown age moves nothing');
    stream.callbacks.onObservation(liveObservation({ location: null }));
    assert.ok(isAt(positionOf(dataSources[0], 'osh:sys-fixture-1'), 1, 2, 0), 'no location moves nothing');
  });
});

test('[osh-073] a live observation that is ahead of the clock leaves the entity where it was', async (t) => {
  const source = fakeSource({ live: true, datastreams: liveDatastreams(1) });
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  await withClickCapture(async (getClick) => {
    layer.enable(viewer);
    await layer.update(viewer);
    await pickAndSettle(getClick, viewer, 'osh:sys-fixture-1');
    const [stream] = source.calls.live;
    stream.callbacks.onObservation(liveObservation({ ageMs: -(OSH_CLOCK_SKEW_MAX_MS + 1) }));
    assert.ok(isAt(positionOf(dataSources[0], 'osh:sys-fixture-1'), 1, 2, 0), 'an observation from too far ahead moves nothing');
    stream.callbacks.onObservation(liveObservation({ ageMs: -5000, location: { lat: 6, lon: 5, alt: 4 } }));
    assert.ok(isAt(positionOf(dataSources[0], 'osh:sys-fixture-1'), 5, 6, 4), 'a small negative age is fresh');
  });
});

test('[osh-073] the layer reads no second observation for a datastream while its live stream is open', async (t) => {
  t.mock.timers.enable({ apis: ['setInterval'] });
  const source = fakeSource({
    live: true,
    datastreams: liveDatastreams(2),
    observations: {
      'ds-fixture-1': polledObservation('one'),
      'ds-fixture-2': polledObservation('two'),
    },
  });
  const detailHost = { innerHTML: '' };
  const layer = createOshLayer({ source, detailHost });
  const { viewer } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  await withClickCapture(async (getClick) => {
    layer.enable(viewer);
    await layer.update(viewer);
    await pickAndSettle(getClick, viewer, 'osh:sys-fixture-1');
    assert.deepEqual(source.calls.observations, ['ds-fixture-1', 'ds-fixture-2']);
    const [first, second] = source.calls.live;
    first.callbacks.onOpen();
    second.callbacks.onOpen();
    first.callbacks.onObservation(liveObservation());

    t.mock.timers.tick(15_000);
    await settle();
    assert.equal(source.calls.datastreams, 2, 'the poll still reads the list of datastreams');
    assert.deepEqual(source.calls.observations, ['ds-fixture-1', 'ds-fixture-2'], 'the poll reads no observation');
    const blocks = detailBlocks(detailHost);
    assert.match(blocks[0], /speed/, 'the poll keeps the live observation');
    assert.match(blocks[1], />two</, 'the poll keeps the held observation');
  });
});

test('[osh-073] a poll answer that comes after a live observation does not replace it', async (t) => {
  const source = fakeSource({ live: true, datastreams: liveDatastreams(1) });
  let answer;
  source.getObservation = () =>
    new Promise((resolve) => {
      answer = resolve;
    });
  const detailHost = { innerHTML: '' };
  const layer = createOshLayer({ source, detailHost });
  const { viewer, dataSources } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  await withClickCapture(async (getClick) => {
    layer.enable(viewer);
    await layer.update(viewer);
    await pickAndSettle(getClick, viewer, 'osh:sys-fixture-1');
    const [stream] = source.calls.live;
    stream.callbacks.onObservation(liveObservation());
    assert.equal(detailHost.innerHTML, '', 'the poll has not written a detail yet');
    assert.ok(isAt(positionOf(dataSources[0], 'osh:sys-fixture-1'), 8, 9, 7), 'the live observation moved the entity');

    answer({
      keyRequired: false,
      observation: polledObservation('old', { location: { lat: 1, lon: 1, alt: 0 }, ageMs: 20_000 }),
    });
    await settle();
    const blocks = detailBlocks(detailHost);
    assert.match(blocks[0], /speed/, 'the detail shows the live observation');
    assert.doesNotMatch(blocks[0], />old</);
    assert.ok(isAt(positionOf(dataSources[0], 'osh:sys-fixture-1'), 8, 9, 7), 'the older answer moves nothing');
  });
});

test('[osh-073] a live observation of a new selection does not draw the datastreams of the old one', async (t) => {
  const source = fakeSource({
    live: true,
    datastreams: [...liveDatastreams(1), ...liveDatastreams(1, 'sys-fixture-2', 'b')],
    observations: { 'ds-fixture-1': polledObservation('one') },
  });
  let answer;
  const read = source.getObservation;
  source.getObservation = (id) =>
    id === 'ds-fixture-b1'
      ? new Promise((resolve) => {
          answer = resolve;
        })
      : read(id);
  const detailHost = { innerHTML: '' };
  const layer = createOshLayer({ source, detailHost });
  const { viewer } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  await withClickCapture(async (getClick) => {
    layer.enable(viewer);
    await layer.update(viewer);
    await pickAndSettle(getClick, viewer, 'osh:sys-fixture-1');
    assert.match(detailHost.innerHTML, /System A/);
    await pickAndSettle(getClick, viewer, 'osh:sys-fixture-2');
    const detailBefore = detailHost.innerHTML;
    source.calls.live[1].callbacks.onObservation(liveObservation());
    assert.equal(detailHost.innerHTML, detailBefore, 'the new selection has no detail yet');

    answer({ keyRequired: false, observation: null });
    await settle();
    assert.match(detailHost.innerHTML, /System B/);
    assert.match(detailBlocks(detailHost)[0], /speed/, 'the first detail of the new selection has the live observation');
  });
});

test('[osh-074] the layer polls a datastream that has no open live stream', async (t) => {
  t.mock.timers.enable({ apis: ['setInterval'] });
  const observations = {};
  for (let index = 1; index <= 10; index += 1) observations[`ds-fixture-${index}`] = polledObservation('one');
  const source = fakeSource({ live: true, datastreams: liveDatastreams(10), observations });
  const layer = createOshLayer({ source });
  const { viewer } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  await withClickCapture(async (getClick) => {
    layer.enable(viewer);
    await layer.update(viewer);
    await pickAndSettle(getClick, viewer, 'osh:sys-fixture-1');
    assert.equal(source.calls.observations.length, 10, 'the first poll reads every datastream');

    t.mock.timers.tick(15_000);
    await settle();
    assert.equal(source.calls.observations.length, 20, 'a stream that is still opening does not stop the poll');

    for (const stream of source.calls.live) stream.callbacks.onOpen();
    t.mock.timers.tick(15_000);
    await settle();
    assert.deepEqual(
      source.calls.observations.slice(20),
      ['ds-fixture-9', 'ds-fixture-10'],
      'the two datastreams that have no stream keep the poll',
    );
  });
});

test('[osh-074] the layer polls a datastream whose live stream reports down', async (t) => {
  t.mock.timers.enable({ apis: ['setInterval'] });
  const observations = { 'ds-fixture-1': polledObservation('one') };
  const source = fakeSource({ live: true, datastreams: liveDatastreams(1), observations });
  const detailHost = { innerHTML: '' };
  const layer = createOshLayer({ source, detailHost });
  const { viewer } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  await withClickCapture(async (getClick) => {
    layer.enable(viewer);
    await layer.update(viewer);
    await pickAndSettle(getClick, viewer, 'osh:sys-fixture-1');
    const [stream] = source.calls.live;
    stream.callbacks.onOpen();
    t.mock.timers.tick(15_000);
    await settle();
    assert.equal(source.calls.observations.length, 1, 'an open stream stops the poll');

    stream.callbacks.onDown();
    observations['ds-fixture-1'] = polledObservation('two');
    t.mock.timers.tick(15_000);
    await settle();
    assert.equal(source.calls.observations.length, 2, 'a stream that is down keeps the poll');
    assert.match(detailBlocks(detailHost)[0], />two</);
  });
});

test('[osh-074] the layer polls a datastream whose live stream reports unsupported', async (t) => {
  t.mock.timers.enable({ apis: ['setInterval'] });
  const observations = {
    'ds-fixture-1': polledObservation('one'),
    'ds-fixture-2': polledObservation('two'),
  };
  const source = fakeSource({ live: true, datastreams: liveDatastreams(2), observations });
  const layer = createOshLayer({ source });
  const { viewer } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  await withClickCapture(async (getClick) => {
    layer.enable(viewer);
    await layer.update(viewer);
    await pickAndSettle(getClick, viewer, 'osh:sys-fixture-1');
    const [first, second] = source.calls.live;
    first.callbacks.onOpen();
    second.callbacks.onOpen();
    first.callbacks.onUnsupported();
    assert.equal(first.closed, 1, 'the layer closes the stream that reports unsupported');
    assert.equal(second.closed, 0, 'the other stream stays open');

    t.mock.timers.tick(15_000);
    await settle();
    assert.deepEqual(source.calls.observations.slice(2), ['ds-fixture-1']);
  });
});

test('[osh-074] a live stream that opens again stops the poll of its datastream', async (t) => {
  t.mock.timers.enable({ apis: ['setInterval'] });
  const observations = { 'ds-fixture-1': polledObservation('one') };
  const source = fakeSource({ live: true, datastreams: liveDatastreams(1), observations });
  const layer = createOshLayer({ source });
  const { viewer } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  await withClickCapture(async (getClick) => {
    layer.enable(viewer);
    await layer.update(viewer);
    await pickAndSettle(getClick, viewer, 'osh:sys-fixture-1');
    const [stream] = source.calls.live;
    stream.callbacks.onOpen();
    stream.callbacks.onDown();
    t.mock.timers.tick(15_000);
    await settle();
    assert.equal(source.calls.observations.length, 2, 'the poll runs while the stream is down');

    stream.callbacks.onOpen();
    t.mock.timers.tick(15_000);
    await settle();
    assert.equal(source.calls.observations.length, 2, 'the poll stops when the stream opens again');
  });
});

test('[osh-074] the layer polls a datastream whose live stream is open and has delivered nothing', async (t) => {
  const source = fakeSource({
    live: true,
    datastreams: liveDatastreams(2),
    observations: {
      'ds-fixture-1': polledObservation('one'),
      'ds-fixture-2': polledObservation('two'),
    },
  });
  // The first read waits, so the second stream opens before the poll reaches its datastream.
  let answer;
  const read = source.getObservation;
  source.getObservation = (id) => {
    if (id !== 'ds-fixture-1') return read(id);
    source.calls.observations.push(id);
    return new Promise((resolve) => {
      answer = resolve;
    });
  };
  const detailHost = { innerHTML: '' };
  const layer = createOshLayer({ source, detailHost });
  const { viewer } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  await withClickCapture(async (getClick) => {
    layer.enable(viewer);
    await layer.update(viewer);
    await pickAndSettle(getClick, viewer, 'osh:sys-fixture-1');
    source.calls.live[1].callbacks.onOpen();
    answer({ keyRequired: false, observation: polledObservation('one') });
    await settle();
    assert.deepEqual(source.calls.observations, ['ds-fixture-1', 'ds-fixture-2']);
    const blocks = detailBlocks(detailHost);
    assert.match(blocks[0], />one</);
    assert.match(blocks[1], />two</, 'the polled observation shows for the stream that has delivered nothing');
  });
});

test('[osh-074] an open live stream stops the poll of its datastream after the first live observation', async (t) => {
  t.mock.timers.enable({ apis: ['setInterval'] });
  const source = fakeSource({ live: true, datastreams: liveDatastreams(1) });
  const detailHost = { innerHTML: '' };
  const layer = createOshLayer({ source, detailHost });
  const { viewer } = fakeViewer();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  await withClickCapture(async (getClick) => {
    layer.enable(viewer);
    await layer.update(viewer);
    await pickAndSettle(getClick, viewer, 'osh:sys-fixture-1');
    const [stream] = source.calls.live;
    assert.equal(source.calls.observations.length, 1);
    assert.match(detailBlocks(detailHost)[0], /No data/);

    stream.callbacks.onOpen();
    t.mock.timers.tick(15_000);
    await settle();
    t.mock.timers.tick(15_000);
    await settle();
    assert.equal(source.calls.observations.length, 3, 'the poll runs while the stream has delivered nothing');

    stream.callbacks.onObservation(liveObservation());
    t.mock.timers.tick(15_000);
    await settle();
    assert.equal(source.calls.observations.length, 3, 'the first live observation stops the poll');
    assert.match(detailBlocks(detailHost)[0], /speed/);
  });
});
