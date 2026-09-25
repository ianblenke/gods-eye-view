import test from 'node:test';
import assert from 'node:assert/strict';
import * as Cesium from 'cesium';
import { createSurfaceServices } from '../surfaceServices.js';
import { createApplicationCatalog } from '../constructCatalog.js';
import { createApplicationOsh } from './osh.js';
import { createStandaloneLayerSources } from '../../standalone/layerSources.js';

/** A terrain source that answers every point with one ellipsoidal height. */
function fixtureSurface(signal) {
  return createSurfaceServices({
    terrainSource: {
      getHeights: async (chunk) => chunk.map(() => ({ ellipsoid: 0 })),
    },
    signal,
    eventTarget: null,
  });
}

test('[osh-095] builds the OSH systems layer in the application catalog right after the recent-imagery layer', (t) => {
  const lifetime = new AbortController();
  t.after(() => lifetime.abort());
  const catalog = createApplicationCatalog({
    sources: createStandaloneLayerSources(),
    signal: lifetime.signal,
    surface: fixtureSurface(lifetime.signal),
  });
  const ids = catalog.layers.map((layer) => layer.id);
  assert.equal(ids.filter((id) => id === 'osh-systems').length, 1);
  assert.equal(ids.indexOf('osh-systems'), ids.indexOf('recent-imagery') + 1);
  assert.deepEqual(catalog.metadata.find(({ id }) => id === 'osh-systems'), { id: 'osh-systems', token: '3', disposition: 'enabled-only' });
  assert.equal(createApplicationOsh().id, 'osh-systems');
});

/** Set a global for one test, and put it back after. */
function withGlobal(t, name, value) {
  const had = Object.hasOwn(globalThis, name);
  const original = globalThis[name];
  globalThis[name] = value;
  t.after(() => {
    if (had) globalThis[name] = original;
    else delete globalThis[name];
  });
}

test('[osh-096] gives the application layer the production source and the elements of the page', async (t) => {
  const elements = { 'osh-panel': { hidden: true }, 'osh-panel-detail': { innerHTML: '' }, 'osh-panel-video': {} };
  withGlobal(t, 'document', { addEventListener() {}, removeEventListener() {}, getElementById: (id) => elements[id] ?? null });
  const asked = [];
  const bodies = {
    '/api/osh/systems': { systems: [{ id: 'sys-fixture-1', uid: 'urn:a', name: 'System A', description: null, lon: 1, lat: 2, alt: 0 }] },
    '/api/osh/fois': { fois: [] },
    '/api/osh/locations': { locations: [] },
    '/api/osh/datastreams?system=sys-fixture-1': { datastreams: [] },
  };
  withGlobal(t, 'fetch', async (path) => {
    asked.push(path);
    return { ok: true, status: 200, json: async () => bodies[path] };
  });
  let click = null;
  const setInputAction = Cesium.ScreenSpaceEventHandler.prototype.setInputAction;
  Cesium.ScreenSpaceEventHandler.prototype.setInputAction = function (action, type) {
    if (type === Cesium.ScreenSpaceEventType.LEFT_CLICK) click = action;
    return setInputAction.call(this, action, type);
  };
  t.after(() => {
    Cesium.ScreenSpaceEventHandler.prototype.setInputAction = setInputAction;
  });
  const viewer = {
    scene: { canvas: { addEventListener() {}, removeEventListener() {} }, pick: () => ({ id: { id: 'osh:sys-fixture-1' } }) },
    camera: { moveEnd: new Cesium.Event(), positionWC: Cesium.Cartesian3.fromDegrees(1, 2, 1_500_000) },
    dataSources: { add: (dataSource) => dataSource, remove: () => true },
  };
  const layer = createApplicationOsh();
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  layer.enable(viewer);
  await layer.update(viewer);
  assert.ok(asked.includes('/api/osh/systems'), 'the layer reads the same-origin route of the systems');
  click({ position: {} });
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(elements['osh-panel'].hidden, false, 'the panel element shows');
  assert.match(elements['osh-panel-detail'].innerHTML, /System A/, 'the detail element holds the name of the system');
});
