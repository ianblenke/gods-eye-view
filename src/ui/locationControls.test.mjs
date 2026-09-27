import assert from 'node:assert/strict';
import test from 'node:test';
import { LocationControls } from './locationControls.js';
import * as Cesium from 'cesium';
import { CITY_POIS, flyToPresetLocation } from '../locations.js';

function node() {
  const classes = new Set();
  return {
    children: [],
    dataset: {},
    listeners: new Map(),
    className: '',
    textContent: '',
    classList: {
      add: (...names) => names.forEach((name) => classes.add(name)),
      remove: (...names) => names.forEach((name) => classes.delete(name)),
      contains: (name) => classes.has(name),
      toggle(name, enabled = !classes.has(name)) {
        if (enabled) classes.add(name);
        else classes.delete(name);
      },
    },
    addEventListener(name, callback) {
      if (!this.listeners.has(name)) this.listeners.set(name, new Set());
      this.listeners.get(name).add(callback);
    },
    removeEventListener(name, callback) {
      this.listeners.get(name)?.delete(callback);
    },
    fire(name, event = {}) {
      for (const callback of this.listeners.get(name) || []) callback(event);
    },
    appendChild(child) {
      this.children.push(child);
      child.parent = this;
    },
    append(...children) {
      for (const child of children)
        if (typeof child !== 'string') this.appendChild(child);
    },
    replaceChildren() {
      this.children = [];
    },
    remove() {
      if (this.parent)
        this.parent.children = this.parent.children.filter(
          (child) => child !== this,
        );
    },
    querySelectorAll(selector) {
      return this.children.flatMap((child) => [
        ...(child.className === selector.slice(1) ? [child] : []),
        ...child.querySelectorAll(selector),
      ]);
    },
    focus() {
      this.focused = true;
    },
  };
}
function fixture() {
  const elements = {
    pills: node(),
    poiRow: node(),
    divider: node(),
    search: node(),
    searchToggle: node(),
    resetButtons: [node(), node()],
    statusCity: node(),
    statusPoi: node(),
  };
  const doc = node();
  doc.createElement = node;
  doc.body = node();
  const cities = {
    a: { name: 'City A', pois: [{ name: 'First' }, { name: 'Second' }] },
    b: { name: 'City B', pois: [{ name: 'Elsewhere' }] },
  };
  const calls = [];
  const frames = new Map();
  const cancelled = [];
  let next = 0;
  const controls = new LocationControls({
    elements,
    cities,
    getExpandedCity: () => 'a',
    onCity: (id) => calls.push(['city', id]),
    onPoi: (id, index) => calls.push(['poi', id, index]),
    onSearch: (query) => calls.push(['search', query]),
    onReset: () => calls.push(['reset']),
    doc,
    requestFrame: (fn) => {
      const id = next++;
      frames.set(id, fn);
      return id;
    },
    cancelFrame: (id) => cancelled.push(id),
  });
  return { elements, doc, controls, calls, frames, cancelled };
}
test('hiding a POI row cancels frame zero and rejects an already queued expansion', () => {
  const f = fixture();
  f.controls.showPois('a');
  const callback = f.frames.get(0);
  f.controls.hidePois();
  callback();
  assert.deepEqual(f.cancelled, [0]);
  assert.equal(f.elements.poiRow.classList.contains('expanded'), false);
  assert.equal(f.elements.divider.classList.contains('visible'), false);
});
test('replacing POIs removes old click actions and presents the final row', () => {
  const f = fixture();
  f.controls.showPois('a');
  const old = f.elements.poiRow.children[0];
  f.controls.showPois('b');
  old.fire('click');
  assert.deepEqual(f.calls, []);
  f.elements.poiRow.children[0].fire('click');
  assert.deepEqual(f.calls, [['poi', 'b', 0]]);
  f.frames.get(0)();
  assert.equal(f.elements.poiRow.classList.contains('expanded'), false);
  f.frames.get(1)();
  assert.equal(f.elements.poiRow.classList.contains('expanded'), true);
});
test('destruction revokes document, search, reset, city and POI actions and removes orbit UI', () => {
  const f = fixture();
  f.controls.showPois('a');
  f.controls.createOrbitIndicator();
  assert.equal(f.doc.body.children.length, 1);
  const city = f.elements.pills.children[0];
  const poi = f.elements.poiRow.children[0];
  f.controls.destroy();
  f.controls.destroy();
  city.fire('click');
  poi.fire('click');
  f.elements.search.value = 'Place';
  f.elements.search.fire('keydown', { key: 'Enter' });
  f.doc.fire('keydown', { key: 'Q' });
  f.elements.resetButtons[0].fire('click');
  f.frames.get(0)();
  assert.deepEqual(f.calls, []);
  assert.equal(f.doc.body.children.length, 0);
});
test('location and POI keys route once while form controls retain typing', () => {
  const f = fixture();
  f.doc.fire('keydown', { key: 'W', target: { matches: () => false } });
  f.doc.fire('keydown', { key: 'Q', target: { matches: () => true } });
  f.elements.resetButtons[1].fire('click');
  assert.deepEqual(f.calls, [['poi', 'a', 1], ['reset']]);
});

test('[location-presets-003] shows the Taiwan pill first', () => {
  const f = fixture();
  f.controls.destroy();
  const controls = new LocationControls({
    elements: f.elements,
    cities: CITY_POIS,
    getExpandedCity: () => null,
    onCity: () => {},
    onPoi: () => {},
    onSearch: () => {},
    onReset: () => {},
    doc: f.doc,
  });
  const pills = f.elements.pills.children;
  assert.equal(pills.length, Object.keys(CITY_POIS).length);
  assert.deepEqual(
    pills.map((pill) => pill.dataset.locationId),
    Object.keys(CITY_POIS),
  );
  assert.equal(pills[0].dataset.locationId, 'taiwan');
  assert.equal(pills[0].textContent, 'Taiwan');
  assert.equal(pills[1].dataset.locationId, 'austin');
  assert.equal(pills[1].textContent, 'Austin');
  controls.destroy();
});

test('[location-presets-004] a click on the Taiwan pill flies to the island view', () => {
  const f = fixture();
  f.controls.destroy();
  const flights = [];
  const viewer = {
    scene: { globe: null, canvas: { clientWidth: 0, clientHeight: 0 } },
    camera: {
      positionCartographic: { longitude: 0, latitude: 0, height: 1200 },
      cancelFlight() {},
      flyTo(options) {
        flights.push(options);
      },
      flyToBoundingSphere(sphere, options) {
        flights.push({ sphere, ...options });
      },
      lookAt() {},
      lookAtTransform() {},
    },
  };
  const ids = [];
  let result = null;
  const controls = new LocationControls({
    elements: f.elements,
    cities: CITY_POIS,
    getExpandedCity: () => null,
    onCity: (id) => {
      ids.push(id);
      result = flyToPresetLocation(viewer, id);
    },
    onPoi: () => {},
    onSearch: () => {},
    onReset: () => {},
    doc: f.doc,
  });
  f.elements.pills.children[0].fire('click');
  assert.deepEqual(ids, ['taiwan']);
  assert.equal(flights.length, 1);
  assert.equal(flights[0].offset.range, 700000);
  assert.ok(
    Math.abs(Cesium.Math.toDegrees(flights[0].offset.pitch) + 60) < 1e-8,
  );
  assert.equal(Cesium.Math.toDegrees(flights[0].offset.heading), 0);
  const point = Cesium.Cartographic.fromCartesian(result.targetPosition);
  assert.ok(Math.abs(Cesium.Math.toDegrees(point.latitude) - 23.7) < 1e-8);
  assert.ok(Math.abs(Cesium.Math.toDegrees(point.longitude) - 121.0) < 1e-8);
  controls.destroy();
});
