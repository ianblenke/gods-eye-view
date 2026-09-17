import assert from 'node:assert/strict';
import test, { before, after } from 'node:test';
import * as Cesium from 'cesium';
import { createOshLayer } from '../layers/osh/index.js';

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

function fakeSource({ systems = [SYSTEM_A, SYSTEM_B], datastreams = [], observations = {} } = {}) {
  const calls = { systems: 0, datastreams: 0, observations: [] };
  return {
    calls,
    async getSystems() {
      calls.systems += 1;
      return { keyRequired: false, systems, stale: false };
    },
    async getDatastreams() {
      calls.datastreams += 1;
      return { keyRequired: false, datastreams };
    },
    async getObservation(id) {
      calls.observations.push(id);
      return { keyRequired: false, observation: observations[id] ?? null };
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

test('[osh-029] shows one entity per system and reports stats', async () => {
  const source = fakeSource();
  const layer = createOshLayer({ source });
  const { viewer, dataSources } = fakeViewer();
  layer.init(viewer);
  layer.enable(viewer);
  const updated = await layer.update(viewer);
  assert.equal(updated, true);
  assert.equal(dataSources[0].entities.values.length, 2);
  const stats = layer.getStats();
  assert.equal(stats.count, 2);
  assert.ok(Number.isFinite(stats.lastUpdate));
  assert.equal(stats.error, null);
  assert.equal(stats.keyRequired, false);
  assert.equal(stats.stale, false);
  layer.disable(viewer);
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
      'ds-fixture-1': { rows: [], location: { lat: 9, lon: 8, alt: 7 }, resultTime: 't' },
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

test('[osh-031] a newest result without a location leaves the marker where it was', async () => {
  const source = fakeSource({
    systems: [SYSTEM_A],
    datastreams: [{ id: 'ds-fixture-1', systemId: 'sys-fixture-1', name: 'D1' }],
    observations: { 'ds-fixture-1': { rows: [], location: null, resultTime: 't' } },
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

test('[osh-031] a system dropped from a later systems fetch clears the selection', async () => {
  let systems = [SYSTEM_A, SYSTEM_B];
  const source = {
    async getSystems() {
      return { keyRequired: false, systems, stale: false };
    },
    async getDatastreams() {
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
    setPicked('osh:sys-fixture-1');
    getClick()({ position: {} });
    await flush();
    assert.equal(layer.getStats().selectedId, 'sys-fixture-1');
    systems = [SYSTEM_B];
    await layer.update(viewer);
    assert.equal(layer.getStats().selectedId, null);
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

test('[osh-029] a system with no name gets a point marker and no label', async () => {
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

test('[osh-031] a moved marker with no altitude in the newest result defaults to zero', async () => {
  const source = fakeSource({
    systems: [SYSTEM_A],
    datastreams: [{ id: 'ds-fixture-1', systemId: 'sys-fixture-1', name: 'D1' }],
    observations: {
      'ds-fixture-1': { rows: [], location: { lat: 9, lon: 8 }, resultTime: 't' },
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
