import assert from 'node:assert/strict';
import test from 'node:test';
import * as Cesium from 'cesium';
import createOshLayer, { createOshLayer as createLayer, createOshPanelHosts } from './osh.js';
import { createOshSource } from '../layers/osh/index.js';

test('[osh-029] the default export is a wired OSH layer', () => {
  assert.equal(createOshLayer.id, 'osh-systems');
  assert.equal(typeof createOshLayer.init, 'function');
  assert.equal(typeof createOshLayer.update, 'function');
});

test('[osh-029] createOshLayer() wires a real source and a null detail host outside the browser', () => {
  const layer = createLayer();
  assert.equal(layer.id, 'osh-systems');
  assert.equal(typeof layer.getStats, 'function');
});

test('[osh-029] createOshLayer() accepts an injected source and detail host', () => {
  const source = createOshSource({ fetchImpl: async () => new Response('{}') });
  const detailHost = { innerHTML: '' };
  const layer = createLayer({ source, detailHost });
  assert.equal(layer.id, 'osh-systems');
});

// --- osh-089: the hosts of the panel ---

/** A fake document: `getElementById` answers from a table, as the page does. */
function fakeDocument(elements) {
  return {
    getElementById(id) {
      return elements[id];
    },
  };
}

const PANEL_ELEMENTS = {
  'osh-panel': { name: 'panel element' },
  'osh-panel-detail': { name: 'detail element' },
  'osh-panel-video': { name: 'video element' },
};

test('[osh-089] the hosts come from the elements with the ids osh-panel, osh-panel-detail and osh-panel-video', () => {
  const hosts = createOshPanelHosts(fakeDocument(PANEL_ELEMENTS));
  assert.deepEqual(Object.keys(hosts).sort(), ['detailHost', 'panelHost', 'videoHost']);
  assert.equal(hosts.panelHost, PANEL_ELEMENTS['osh-panel']);
  assert.equal(hosts.detailHost, PANEL_ELEMENTS['osh-panel-detail']);
  assert.equal(hosts.videoHost, PANEL_ELEMENTS['osh-panel-video']);
});

test('[osh-089] every host is null when there is no document', () => {
  assert.deepEqual(createOshPanelHosts(null), { panelHost: null, detailHost: null, videoHost: null });
});

test('[osh-089] a document with no getElementById method gives no host', () => {
  assert.deepEqual(createOshPanelHosts({}), { panelHost: null, detailHost: null, videoHost: null });
});

test('[osh-089] a host is null when the page has no element for its id', () => {
  const missingDetail = { 'osh-panel': PANEL_ELEMENTS['osh-panel'], 'osh-panel-video': PANEL_ELEMENTS['osh-panel-video'] };
  assert.deepEqual(createOshPanelHosts(fakeDocument(missingDetail)), {
    panelHost: PANEL_ELEMENTS['osh-panel'],
    detailHost: null,
    videoHost: PANEL_ELEMENTS['osh-panel-video'],
  });
  const onlyVideo = { 'osh-panel-video': PANEL_ELEMENTS['osh-panel-video'] };
  assert.deepEqual(createOshPanelHosts(fakeDocument(onlyVideo)), {
    panelHost: null,
    detailHost: null,
    videoHost: PANEL_ELEMENTS['osh-panel-video'],
  });
});

test('[osh-089] a host is null when the page answers null for its element', () => {
  const answersNull = { getElementById: () => null };
  assert.deepEqual(createOshPanelHosts(answersNull), { panelHost: null, detailHost: null, videoHost: null });
});

test('[osh-089] the hosts come from the global document when the caller gives none', (t) => {
  const original = globalThis.document;
  t.after(() => {
    if (original === undefined) delete globalThis.document;
    else globalThis.document = original;
  });
  delete globalThis.document;
  assert.deepEqual(createOshPanelHosts(), { panelHost: null, detailHost: null, videoHost: null });
  globalThis.document = fakeDocument(PANEL_ELEMENTS);
  assert.equal(createOshPanelHosts().panelHost, PANEL_ELEMENTS['osh-panel']);
});

/** Put a fake `document` in place for one test, and restore the old one after it. */
function withGlobalDocument(t, documentLike) {
  const original = globalThis.document;
  globalThis.document = documentLike;
  t.after(() => {
    if (original === undefined) delete globalThis.document;
    else globalThis.document = original;
  });
}

/** A fake viewer that has only what the layer reads, and a capture of the left click. */
function clickableViewer(t) {
  const viewer = {
    scene: {
      canvas: { addEventListener() {}, removeEventListener() {} },
      pick: () => ({ id: { id: 'osh:sys-fixture-1' } }),
    },
    camera: { moveEnd: new Cesium.Event(), positionWC: Cesium.Cartesian3.fromDegrees(1, 2, 1_500_000) },
    dataSources: { add: (dataSource) => dataSource, remove: () => true },
  };
  const capture = { click: null };
  const setInputAction = Cesium.ScreenSpaceEventHandler.prototype.setInputAction;
  Cesium.ScreenSpaceEventHandler.prototype.setInputAction = function (action, type) {
    if (type === Cesium.ScreenSpaceEventType.LEFT_CLICK) capture.click = action;
    return setInputAction.call(this, action, type);
  };
  t.after(() => {
    Cesium.ScreenSpaceEventHandler.prototype.setInputAction = setInputAction;
  });
  return { viewer, capture };
}

const SYSTEM_RECORD = { id: 'sys-fixture-1', uid: 'urn:a', name: 'System A', description: null, lon: 1, lat: 2, alt: 0 };

async function settle() {
  await new Promise((resolve) => setImmediate(resolve));
}

test('[osh-089] createOshLayer() passes the panel host, the detail host and the video host to the layer', async (t) => {
  withGlobalDocument(t, { addEventListener() {}, removeEventListener() {} });
  const recorded = { streams: [], views: [] };
  const source = {
    async getSystems() {
      return { keyRequired: false, systems: [SYSTEM_RECORD], stale: false };
    },
    async getDatastreams() {
      return { keyRequired: false, datastreams: [{ id: 'ds-fixture-v1', systemId: 'sys-fixture-1', name: 'Camera One', video: true }] };
    },
    async getObservation() {
      return { keyRequired: false, observation: null };
    },
    openVideo(id) {
      recorded.streams.push(id);
      return { close() {} };
    },
  };
  const hosts = { panelHost: { hidden: true }, detailHost: { innerHTML: '' }, videoHost: { name: 'video element' } };
  const layer = createLayer({
    source,
    ...hosts,
    createView: (options) => {
      recorded.views.push(options);
      return { canvas: {}, setStatus() {}, destroy() {} };
    },
    createPlayer: () => ({ push() {}, close() {} }),
    documentImpl: { name: 'fake document' },
  });
  const { viewer, capture } = clickableViewer(t);
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  layer.enable(viewer);
  await layer.update(viewer);
  capture.click({ position: {} });
  await settle();
  assert.equal(hosts.panelHost.hidden, false, 'the panel host shows');
  assert.match(hosts.detailHost.innerHTML, /Camera One/, 'the detail host holds the detail');
  assert.deepEqual(recorded.streams, ['ds-fixture-v1']);
  assert.equal(recorded.views.length, 1);
  assert.equal(recorded.views[0].host, hosts.videoHost, 'the view goes into the video host');
});

test('[osh-089] the default layer looks for the panel elements in the page and fills them', async (t) => {
  const asked = [];
  const elements = { 'osh-panel': { hidden: true }, 'osh-panel-detail': { innerHTML: '' } };
  withGlobalDocument(t, {
    addEventListener() {},
    removeEventListener() {},
    getElementById(id) {
      asked.push(id);
      return elements[id];
    },
  });
  const original = globalThis.fetch;
  t.after(() => {
    globalThis.fetch = original;
  });
  const bodies = {
    '/api/osh/systems': { systems: [SYSTEM_RECORD] },
    '/api/osh/fois': { fois: [] },
    '/api/osh/locations': { locations: [] },
    '/api/osh/datastreams?system=sys-fixture-1': { datastreams: [] },
  };
  globalThis.fetch = async (path) => ({ ok: true, status: 200, json: async () => bodies[path] });
  // A fresh copy of the module runs its default export again, now with a page.
  const fresh = await import('./osh.js?page-hosts');
  assert.deepEqual([...asked].sort(), ['osh-panel', 'osh-panel-detail', 'osh-panel-video']);
  const layer = fresh.default;
  const { viewer, capture } = clickableViewer(t);
  t.after(() => layer.destroy(viewer));
  layer.init(viewer);
  layer.enable(viewer);
  await layer.update(viewer);
  capture.click({ position: {} });
  await settle();
  assert.equal(elements['osh-panel'].hidden, false, 'the panel element shows');
  assert.match(elements['osh-panel-detail'].innerHTML, /System A/, 'the detail element holds the detail');
});
