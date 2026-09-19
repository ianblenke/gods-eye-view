import assert from 'node:assert/strict';
import test, { before, after } from 'node:test';
import * as Cesium from 'cesium';
import { createOshLayer } from '../layers/osh/index.js';
import { OSH_FRESH_MAX_AGE_MS } from './oshObservations.js';

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

function fakeSource({
  systems = [SYSTEM_A, SYSTEM_B],
  fois = [],
  truncated = false,
  datastreams = [],
  observations = {},
  locations = [],
} = {}) {
  const calls = {
    systems: 0,
    fois: 0,
    datastreams: 0,
    datastreamsArgs: [],
    observations: [],
    locations: 0,
    locationsArgs: [],
  };
  return {
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
}

/** A fake viewer with entity dataSources, a pickable scene and a click capture. */
function fakeViewer() {
  const dataSources = [];
  let picked = null;
  const viewer = {
    scene: {
      canvas: { addEventListener() {}, removeEventListener() {} },
      pick() {
        return picked;
      },
    },
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
  return {
    viewer,
    dataSources,
    setPicked(id) {
      picked = id === null ? null : { id };
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

test('[osh-029] shows one entity per system and reports stats, including the new fields', async () => {
  const source = fakeSource({ fois: [FEATURE_A] });
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
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
  layer.destroy(viewer);
});

test('[osh-029] a system with no Point gets no entity, and counts toward unplaced', async () => {
  const source = fakeSource({ systems: [SYSTEM_A, SYSTEM_NULL] });
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
  layer.init(viewer);
  layer.enable(viewer);
  await layer.update(viewer);
  assert.equal(dataSources[0].entities.values.length, 1, 'only the placed system gets an entity');
  assert.equal(dataSources[0].entities.getById('osh:sys-fixture-9'), undefined);
  const stats = layer.getStats();
  assert.equal(stats.count, 1);
  assert.equal(stats.unplaced, 1);
  layer.destroy(viewer);
});

test('[osh-029] a system with no Point but a fresh location still gets an entity, counted under count', async () => {
  const source = fakeSource({ systems: [], fois: [], locations: [aircraftLocation()] });
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
  layer.init(viewer);
  layer.enable(viewer);
  await layer.update(viewer);
  assert.ok(dataSources[0].entities.getById('osh:sys-fixture-9'), 'the stream-placed entity must exist');
  assert.equal(layer.getStats().count, 1);
  assert.equal(layer.getStats().unplaced, 0);
  layer.destroy(viewer);
});

test('[osh-029] reports getStats().stale from a stale systems fetch', async () => {
  const source = {
    async getSystems() {
      return { keyRequired: false, systems: [SYSTEM_A], stale: true };
    },
  };
  const layer = createOshLayer({ source });
  const { viewer } = fakeViewer();
  layer.init(viewer);
  layer.enable(viewer);
  await layer.update(viewer);
  assert.equal(layer.getStats().stale, true);
  layer.destroy(viewer);
});

test('[osh-029] a failed fetch sets the error and does not change the entities', async () => {
  let fail = false;
  const source = {
    async getSystems() {
      if (fail) throw new Error('boom');
      return { keyRequired: false, systems: [SYSTEM_A, SYSTEM_B], stale: false };
    },
  };
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
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
  layer.destroy(viewer);
});

test('[osh-029] a thrown non-Error still sets a fallback error message', async () => {
  const source = {
    async getSystems() {
      throw { not: 'an error' };
    },
  };
  const layer = createOshLayer({ source });
  const { viewer } = fakeViewer();
  layer.init(viewer);
  layer.enable(viewer);
  await layer.update(viewer);
  assert.equal(layer.getStats().error, 'OSH source unavailable');
  layer.destroy(viewer);
});

test('[osh-029] keyRequired clears the entities and reports keyRequired:true', async () => {
  const source = {
    async getSystems() {
      return { keyRequired: true, systems: [], stale: false };
    },
  };
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
  layer.init(viewer);
  layer.enable(viewer);
  await layer.update(viewer);
  assert.equal(dataSources[0].entities.values.length, 0);
  assert.equal(layer.getStats().keyRequired, true);
  layer.destroy(viewer);
});

test('[osh-029] disable hides the data source, destroy removes it, and disable stops more updates', async () => {
  const source = fakeSource();
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
  layer.init(viewer);
  layer.enable(viewer);
  await layer.update(viewer);
  layer.disable(viewer);
  assert.equal(dataSources[0].show, false);
  assert.equal(await layer.update(viewer), false);
  layer.destroy(viewer);
  assert.equal(dataSources.length, 0);
});

test('[osh-049] disable() does not clear the system union', async () => {
  const source = fakeSource();
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
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
  layer.destroy(viewer);
});

test('[osh-029] update does nothing before init and while disabled', async () => {
  const layer = createOshLayer({ source: fakeSource() });
  assert.equal(await layer.update(), false);
});

test('[osh-029] init cannot run twice', () => {
  const layer = createOshLayer({ source: fakeSource() });
  const { viewer } = fakeViewer();
  layer.init(viewer);
  assert.throws(() => layer.init(viewer), /already initialized/);
  layer.destroy(viewer);
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
  layer.destroy(viewer);
});

test('[osh-030] stops the poll of the selected system when the layer disables', async (t) => {
  t.mock.timers.enable({ apis: ['setInterval'] });
  const source = fakeSource({
    datastreams: [{ id: 'ds-fixture-1', systemId: 'sys-fixture-1', name: 'D1' }],
  });
  const layer = createOshLayer({ source });
  const { viewer } = fakeViewer();
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
  layer.destroy(viewer);
});

test('[osh-030] deselects on a click on empty space or on a non-osh entity', async () => {
  const source = fakeSource({ datastreams: [] });
  const layer = createOshLayer({ source });
  const { viewer } = fakeViewer();
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
  layer.destroy(viewer);
});

test('[osh-030] a picked entity whose id is a plain string is also read', async () => {
  const source = fakeSource({ datastreams: [] });
  const layer = createOshLayer({ source });
  const { viewer } = fakeViewer();
  layer.init(viewer);
  await withClickCapture(async (getClick) => {
    layer.enable(viewer);
    await layer.update(viewer);
    viewer.scene.pick = () => ({ id: 'osh:sys-fixture-1' });
    getClick()({ position: {} });
    await flush();
    assert.equal(layer.getStats().selectedId, 'sys-fixture-1');
  });
  layer.destroy(viewer);
});

test('[osh-030] a second click handler install does nothing, and a second click on the same system does not restart the poll', async () => {
  const source = fakeSource({ systems: [SYSTEM_A], datastreams: [] });
  const layer = createOshLayer({ source });
  const { viewer } = fakeViewer();
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
  layer.destroy(viewer);
});

test('[osh-030] a keyRequired datastreams response during a poll stops that poll cycle', async () => {
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
  layer.destroy(viewer);
});

test('[osh-030] a failed datastreams or observation fetch during a poll does not throw, and the next poll still runs', async () => {
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
  layer.destroy(viewer);
});

test('[osh-031] a newest result with a location moves the entity, and a systems refresh keeps the moved position', async () => {
  const source = fakeSource({
    systems: [SYSTEM_A],
    datastreams: [{ id: 'ds-fixture-1', systemId: 'sys-fixture-1', name: 'D1' }],
    observations: {
      'ds-fixture-1': { rows: [], location: { lat: 9, lon: 8, alt: 7 }, resultTime: 't', ageMs: 1000 },
    },
  });
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
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
  layer.destroy(viewer);
});

test('[osh-031] a newest result without a location leaves the entity where it was', async () => {
  const source = fakeSource({
    systems: [SYSTEM_A],
    datastreams: [{ id: 'ds-fixture-1', systemId: 'sys-fixture-1', name: 'D1' }],
    observations: { 'ds-fixture-1': { rows: [], location: null, resultTime: 't', ageMs: 1000 } },
  });
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
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
  layer.destroy(viewer);
});

// The owner's OSH server runs a few seconds ahead of the provider, so a live
// reading's phenomenonTime lands after the injected "now" and its age comes
// out negative. A negative age is as fresh as it gets, and motion must not
// refuse it.
test('[osh-031] the layer moves the entity from a newest result with a negative ageMs', async () => {
  const source = fakeSource({
    systems: [SYSTEM_A],
    datastreams: [{ id: 'ds-fixture-1', systemId: 'sys-fixture-1', name: 'D1' }],
    observations: {
      'ds-fixture-1': { rows: [], location: { lat: 9, lon: 8, alt: 7 }, resultTime: 't', ageMs: -5000 },
    },
  });
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
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
  layer.destroy(viewer);
});

test('[osh-031] a newest result one millisecond past the freshness threshold leaves the entity where it was', async () => {
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
  layer.destroy(viewer);
});

test('[osh-031] a newest result from far ahead of the clock leaves the entity where it was', async () => {
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
  layer.destroy(viewer);
});

test('[osh-031] a newest result with ageMs:null leaves the entity where it was', async () => {
  const source = fakeSource({
    systems: [SYSTEM_A],
    datastreams: [{ id: 'ds-fixture-1', systemId: 'sys-fixture-1', name: 'D1' }],
    observations: {
      'ds-fixture-1': { rows: [], location: { lat: 9, lon: 8, alt: 7 }, resultTime: 't', ageMs: null },
    },
  });
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
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
  layer.destroy(viewer);
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
  layer.destroy(viewer);
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
  layer.destroy(viewer);
});

test('[osh-045] shows one entity per feature, with a label distance condition, and getStats().features counts them', async () => {
  const source = fakeSource({ fois: [FEATURE_A, FEATURE_NO_HOST] });
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
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
  layer.destroy(viewer);
});

test('[osh-045] a feature with no name gets a point entity and no label', async () => {
  const source = fakeSource({ fois: [FEATURE_NO_NAME] });
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
  layer.init(viewer);
  layer.enable(viewer);
  await layer.update(viewer);
  const entity = dataSources[0].entities.getById('osh-foi:foi-fixture-4');
  assert.ok(entity);
  assert.equal(entity.label, undefined);
  layer.destroy(viewer);
});

test('[osh-045] a click on a feature selects and polls its host, whether or not the host is in the systems list', async () => {
  const source = fakeSource({ systems: [SYSTEM_A], fois: [FEATURE_A, FEATURE_ORPHAN] });
  const layer = createOshLayer({ source });
  const { viewer } = fakeViewer();
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
  layer.destroy(viewer);
});

test('[osh-045] a click on a feature with a null host selects the feature, leaves selectedId null, and starts no poll', async () => {
  const source = fakeSource({ fois: [FEATURE_NO_HOST] });
  const layer = createOshLayer({ source });
  const { viewer } = fakeViewer();
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
  layer.destroy(viewer);
});

test('[osh-045] finds a feature record by id and by uid, with no per-feature fetch method on the source', async () => {
  const source = fakeSource({ fois: [FEATURE_A] });
  assert.equal(typeof source.getFoiById, 'undefined');
  const layer = createOshLayer({ source });
  const { viewer } = fakeViewer();
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
  layer.destroy(viewer);
});

test('[osh-045] a click on a stale feature entity selects that feature id, with no host and no name', async () => {
  const source = fakeSource({ fois: [] });
  const layer = createOshLayer({ source });
  const { viewer } = fakeViewer();
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
  layer.destroy(viewer);
});

test('[osh-030] a fresh observation with a location does not throw when the selected system has no entity', async () => {
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
  layer.destroy(viewer);
});

test('[osh-045] a selected feature that is still present after a later refresh keeps its selection', async () => {
  const source = fakeSource({ fois: [FEATURE_A] });
  const layer = createOshLayer({ source });
  const { viewer } = fakeViewer();
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
  layer.destroy(viewer);
});

test('[osh-046] a fois getter that resolves keyRequired:true, while the systems getter does not, gives an empty feature list', async () => {
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
  layer.init(viewer);
  layer.enable(viewer);
  await layer.update(viewer);
  assert.equal(layer.getStats().features, 0);
  assert.equal(layer.getStats().partial, false);
  layer.destroy(viewer);
});

test('[osh-046] a locations getter that resolves keyRequired:true alone gives an empty location list, with partial:false and no error', async () => {
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
  layer.destroy(viewer);
});

test('[osh-046] the features getter throwing sets partial:true and no error, and the systems still place', async () => {
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
  layer.init(viewer);
  layer.enable(viewer);
  await layer.update(viewer);
  assert.equal(layer.getStats().count, 1);
  assert.equal(layer.getStats().partial, true);
  assert.equal(layer.getStats().error, null);
  assert.equal(dataSources[0].entities.getById('osh:sys-fixture-1') !== undefined, true);
  layer.destroy(viewer);
});

test('[osh-046] a server with no Point and no feature gives count:0, features:0, error:null and partial:false', async () => {
  const source = fakeSource({ systems: [SYSTEM_NULL], fois: [] });
  const layer = createOshLayer({ source });
  const { viewer } = fakeViewer();
  layer.init(viewer);
  layer.enable(viewer);
  await layer.update(viewer);
  const stats = layer.getStats();
  assert.equal(stats.count, 0);
  assert.equal(stats.features, 0);
  assert.equal(stats.error, null);
  assert.equal(stats.partial, false);
  layer.destroy(viewer);
});

test('[osh-046] truncated is true when the features payload says so', async () => {
  const source = fakeSource({ fois: [FEATURE_A], truncated: true });
  const layer = createOshLayer({ source });
  const { viewer } = fakeViewer();
  layer.init(viewer);
  layer.enable(viewer);
  await layer.update(viewer);
  assert.equal(layer.getStats().truncated, true);
  layer.destroy(viewer);
});

test('[osh-046] an update aborted before all three reads settle draws nothing from them', async () => {
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
  layer.destroy(viewer);
});

test('[osh-046] a locations getter that throws sets partial:true and no error, and the systems still place', async () => {
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
  layer.init(viewer);
  layer.enable(viewer);
  await layer.update(viewer);
  assert.equal(layer.getStats().count, 1);
  assert.equal(layer.getStats().partial, true);
  assert.equal(layer.getStats().error, null);
  assert.equal(dataSources[0].entities.getById('osh:sys-fixture-1') !== undefined, true);
  layer.destroy(viewer);
});

test('[osh-046] the layer sends no candidate of its own to the locations getter', async () => {
  const source = fakeSource();
  const layer = createOshLayer({ source });
  const { viewer } = fakeViewer();
  layer.init(viewer);
  layer.enable(viewer);
  await layer.update(viewer);
  assert.equal(source.calls.locations, 1);
  const [args] = source.calls.locationsArgs;
  assert.deepEqual(Object.keys(args[0] ?? {}).sort(), ['signal']);
  layer.destroy(viewer);
});

test('[osh-030] the poll passes the selected system id to the datastreams getter, and drops a record naming another system', async () => {
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
  layer.destroy(viewer);
});

test('[osh-030] a poll superseded while it waits for the datastreams is discarded, and the newer poll still runs', async () => {
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
  layer.destroy(viewer);
});

test('[osh-030] a poll superseded mid-loop while it waits for an observation stops the detail rows', async () => {
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
  layer.destroy(viewer);
});

test('[osh-029] a system with no name gets a point entity and no label', async () => {
  const unnamed = { id: 'sys-fixture-3', uid: null, name: null, description: null, lon: 5, lat: 6, alt: 0 };
  const source = fakeSource({ systems: [unnamed] });
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
  layer.init(viewer);
  layer.enable(viewer);
  await layer.update(viewer);
  const entity = dataSources[0].entities.getById('osh:sys-fixture-3');
  assert.equal(entity.label, undefined);
  layer.destroy(viewer);
});

test('[osh-029] a second update aborts the first, whose late result is discarded even without a thrown AbortError', async () => {
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
  layer.destroy(viewer);
});

test('[osh-029] aborts an update in flight on disable, with no error recorded', async () => {
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
  layer.init(viewer);
  layer.enable(viewer);
  const updatePromise = layer.update(viewer);
  layer.disable(viewer);
  assert.equal(await updatePromise, false);
  assert.equal(signalSeen.aborted, true);
  assert.equal(layer.getStats().error, null);
  layer.destroy(viewer);
});

test('[osh-029] aborts an update in flight on destroy', async () => {
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
  layer.init(viewer);
  layer.enable(viewer);
  const updatePromise = layer.update(viewer);
  layer.destroy(viewer);
  assert.equal(await updatePromise, false);
  assert.equal(signalSeen.aborted, true);
});

test('[osh-029] a superseded update that throws a real error still lets the newer request finish', async () => {
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
  layer.destroy(viewer);
});

test('[osh-046] a features getter that throws synchronously behaves exactly like one that rejects', async () => {
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
  layer.init(viewer);
  layer.enable(viewer);
  const updated = await layer.update(viewer);
  assert.equal(updated, true);
  assert.equal(layer.getStats().count, 1, 'the systems read must still be drawn');
  assert.equal(dataSources[0].entities.values.length, 1);
  assert.equal(layer.getStats().partial, true);
  assert.equal(layer.getStats().error, null);
  layer.destroy(viewer);
});

test('[osh-029] a duplicate feature id makes the draw loop throw, and the update reports that failure', async () => {
  // placeOshEntities() does not dedupe by id; only the server-side adapter
  // does. Two fois records sharing an id are a malformed features read
  // that reaches the draw loop, where Cesium refuses a second entity with
  // an id already in the collection — a failure this layer does not
  // control, arising after both reads already succeeded.
  const source = fakeSource({ fois: [FEATURE_A, { ...FEATURE_A }] });
  const layer = createOshLayer({ source });
  const { viewer } = fakeViewer();
  layer.init(viewer);
  layer.enable(viewer);
  const updated = await layer.update(viewer);
  assert.equal(updated, false);
  assert.equal(typeof layer.getStats().error, 'string');
  assert.notEqual(layer.getStats().error, null);
  layer.destroy(viewer);
});

test('[osh-029] a thrown non-Error while placing the entities still sets the fallback error message', async () => {
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
  layer.init(viewer);
  layer.enable(viewer);
  await layer.update(viewer);
  assert.equal(layer.getStats().error, 'OSH source unavailable');
  layer.destroy(viewer);
});

test('[osh-031] a moved entity with no altitude in the newest result defaults to zero', async () => {
  const source = fakeSource({
    systems: [SYSTEM_A],
    datastreams: [{ id: 'ds-fixture-1', systemId: 'sys-fixture-1', name: 'D1' }],
    observations: {
      'ds-fixture-1': { rows: [], location: { lat: 9, lon: 8 }, resultTime: 't', ageMs: 1000 },
    },
  });
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
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
  layer.destroy(viewer);
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

test('[osh-057] a fresh location with no feature reference places its system, counted under getStats().placed.stream', async () => {
  const source = fakeSource({ systems: [], fois: [], locations: [aircraftLocation()] });
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
  layer.init(viewer);
  layer.enable(viewer);
  await layer.update(viewer);
  const entity = dataSources[0].entities.getById('osh:sys-fixture-9');
  assert.ok(entity, 'the stream-placed entity must exist');
  assert.equal(layer.getStats().placed.stream, 1);
  layer.destroy(viewer);
});

test('[osh-057] a system with no record in the union map is named from the location, and never enters the union', async () => {
  const source = fakeSource({ systems: [], fois: [], locations: [aircraftLocation()] });
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
  layer.init(viewer);
  layer.enable(viewer);
  await layer.update(viewer);
  const entity = dataSources[0].entities.getById('osh:sys-fixture-9');
  assert.equal(entity.label.text.getValue(), 'Fixture Aircraft');
  assert.equal(entity.properties.name.getValue(), null, 'no held system record was created');
  layer.destroy(viewer);
});

test('[osh-057] only a location with systemName:null gives the id as the label', async () => {
  const source = fakeSource({
    systems: [],
    fois: [],
    locations: [aircraftLocation({ systemName: null })],
  });
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
  layer.init(viewer);
  layer.enable(viewer);
  await layer.update(viewer);
  const entity = dataSources[0].entities.getById('osh:sys-fixture-9');
  assert.equal(entity.label.text.getValue(), 'sys-fixture-9');
  layer.destroy(viewer);
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
  layer.destroy(viewer);
});

test('[osh-057] a selected stream-placed system keeps its entity at its last position until deselected', async () => {
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
  layer.destroy(viewer);
});

test('[osh-057] a fresh location that names a feature moves the feature entity and never places a system', async () => {
  const source = fakeSource({
    systems: [],
    fois: [FEATURE_A],
    locations: [aircraftLocation({ systemId: null, systemName: null, foiId: FEATURE_A.id, lon: 30, lat: 31, alt: 32 })],
  });
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
  layer.init(viewer);
  layer.enable(viewer);
  await layer.update(viewer);
  const featureEntity = dataSources[0].entities.getById('osh-foi:foi-fixture-1');
  const moved = featureEntity.position.getValue(Cesium.JulianDate.now());
  const expected = Cesium.Cartesian3.fromDegrees(30, 31, 32);
  assert.ok(Cesium.Cartesian3.equalsEpsilon(moved, expected, Cesium.Math.EPSILON6));
  assert.equal(dataSources[0].entities.getById('osh:sys-fixture-9'), undefined, 'no system entity was placed');
  layer.destroy(viewer);
});

test('[osh-057] a click on a stream-placed entity selects it and starts its datastream poll like any system', async () => {
  const source = fakeSource({ systems: [], fois: [], locations: [aircraftLocation()] });
  const layer = createOshLayer({ source });
  const { viewer } = fakeViewer();
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
  layer.destroy(viewer);
});

test('[osh-057] the detail for a selected stream-placed placeholder shows Placed by, with the name the location carries', async () => {
  const source = fakeSource({ systems: [], fois: [], locations: [aircraftLocation()] });
  const detailHost = { innerHTML: '' };
  const layer = createOshLayer({ source, detailHost });
  const { viewer } = fakeViewer();
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
  layer.destroy(viewer);
});

test('[osh-057] a held system\'s own name wins over the location\'s systemName in the detail header', async () => {
  const source = fakeSource({ systems: [SYSTEM_NULL], fois: [], locations: [aircraftLocation()] });
  const detailHost = { innerHTML: '' };
  const layer = createOshLayer({ source, detailHost });
  const { viewer } = fakeViewer();
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
  layer.destroy(viewer);
});

test('[osh-057] getStats().placed.stream counts only the stream-placed system, not the geometry-placed one', async () => {
  const source = fakeSource({ systems: [SYSTEM_A], fois: [], locations: [aircraftLocation()] });
  const layer = createOshLayer({ source });
  const { viewer } = fakeViewer();
  layer.init(viewer);
  layer.enable(viewer);
  await layer.update(viewer);
  const stats = layer.getStats();
  assert.equal(stats.count, 2, 'both the geometry-placed and the stream-placed system are on the map');
  assert.equal(stats.placed.stream, 1);
  layer.destroy(viewer);
});
