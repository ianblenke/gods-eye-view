import assert from 'node:assert/strict';
import test from 'node:test';
import { LocationControls } from './locationControls.js';
import * as Cesium from 'cesium';
import { CITY_POIS } from '../cityPois.js';
import { flyToPresetLocation } from '../locations.js';

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
function fixture(options = {}) {
  const elements = {
    search: node(),
  };
  const doc = node();
  doc.createElement = node;
  const cities = {
    a: { name: 'City A', pois: [{ name: 'First' }, { name: 'Second' }] },
    b: { name: 'City B', pois: [{ name: 'Elsewhere' }] },
  };
  const calls = [];
  const frames = new Map();
  const cancelled = [];
  let next = 0;
  const views = [];
  const controls = new LocationControls({
    elements,
    cities,
    getExpandedCity: () => 'a',
    onCity: (id) => calls.push(['city', id]),
    onPoi: (id, index) => calls.push(['poi', id, index]),
    onSearch: (query) => calls.push(['search', query]),
    onSearchEdit: () => calls.push(['edit']),
    onReset: () => calls.push(['reset']),
    publish: (view) => views.push(view),
    doc,
    requestFrame: (fn) => {
      const id = next++;
      frames.set(id, fn);
      return id;
    },
    cancelFrame: (id) => cancelled.push(id),
    ...options,
  });
  const view = () => views.at(-1);
  return { elements, doc, controls, calls, frames, cancelled, views, view };
}
test('the tray presents its cities, empty status and no landmarks at first', () => {
  const f = fixture();
  assert.deepEqual(f.view(), {
    cities: [
      { id: 'a', label: 'City A', active: false },
      { id: 'b', label: 'City B', active: false },
    ],
    poiCity: null,
    pois: [],
    poisExpanded: false,
    status: { city: '📍 Location: --', poi: 'Landmark: --' },
    searchError: null,
    searchExpanded: false,
    searching: false,
    searchOrigin: 'dock',
    orbit: null,
  });
  f.controls.highlightCity('b');
  assert.deepEqual(
    f.view().cities.map((city) => city.active),
    [false, true],
  );
  f.controls.setSearchError('Not found');
  assert.equal(f.view().searchError, 'Not found');
  f.controls.setSearchError(null);
  assert.equal(f.view().searchError, null);
});
test('hiding a POI row cancels frame zero and rejects an already queued expansion', () => {
  const f = fixture();
  f.controls.showPois('a');
  const callback = f.frames.get(0);
  f.controls.hidePois();
  callback();
  assert.deepEqual(f.cancelled, [0]);
  assert.equal(f.view().poisExpanded, false);
});
test('replacing POIs routes clicks to the final row and expands it a frame later', () => {
  const f = fixture();
  f.controls.showPois('a');
  f.controls.highlightPoi(1);
  assert.deepEqual(
    f.view().pois.map((poi) => [poi.key, poi.name, poi.active]),
    [
      ['Q', 'First', false],
      ['W', 'Second', true],
    ],
  );
  f.controls.showPois('b');
  assert.equal(f.view().poiCity, 'b');
  assert.deepEqual(
    f.view().pois.map((poi) => [poi.name, poi.active]),
    [['Elsewhere', false]],
  );
  f.controls.choosePoi(0);
  assert.deepEqual(f.calls, [['poi', 'b', 0]]);
  f.frames.get(0)();
  assert.equal(f.view().poisExpanded, false);
  f.frames.get(1)();
  assert.equal(f.view().poisExpanded, true);
});
test('destruction revokes document, search, reset, city and POI actions and removes orbit UI', () => {
  const f = fixture();
  f.controls.showPois('a');
  f.controls.showOrbit(true);
  assert.deepEqual(f.view().orbit, { active: true });
  f.controls.destroy();
  assert.equal(f.view().orbit, null);
  f.controls.destroy();
  const published = f.views.length;
  f.controls.showOrbit(true);
  f.controls.chooseCity('a');
  f.controls.choosePoi(0);
  f.controls.highlightCity('a');
  f.elements.search.value = 'Place';
  f.elements.search.fire('keydown', { key: 'Enter' });
  f.doc.fire('keydown', { key: 'Q' });
  f.controls.reset();
  f.frames.get(0)();
  assert.deepEqual(f.calls, []);
  assert.equal(f.views.length, published);
});
test('the mini status shows the city, a landmark or a searched place', () => {
  const f = fixture();
  f.controls.renderStatus({ searchedLabel: 'Somewhere' });
  assert.equal(f.view().status.poi, 'Searched location');
  f.controls.renderStatus({});
  assert.deepEqual(f.view().status, {
    city: '📍 Location: --',
    poi: 'Landmark: --',
  });
});
test('location and POI keys route once while form controls retain typing', () => {
  const f = fixture();
  f.doc.fire('keydown', { key: 'W', target: { matches: () => false } });
  f.doc.fire('keydown', { key: 'Q', target: { matches: () => true } });
  f.controls.reset();
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
  const ids = pills.map((pill) => pill.dataset.locationId);
  assert.ok(ids.indexOf('taiwan') < ids.indexOf('austin'));
  assert.equal(pills[ids.indexOf('austin')].textContent, 'Austin');
  controls.destroy();
});

test('[location-presets-007] shows the Tampa pill between the Taiwan and Austin pills', () => {
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
  const ids = pills.map((pill) => pill.dataset.locationId);
  assert.ok(ids.indexOf('taiwan') < ids.indexOf('tampa'));
  assert.ok(ids.indexOf('tampa') < ids.indexOf('austin'));
  assert.equal(pills[ids.indexOf('tampa')].textContent, 'Tampa');
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

test('[location-presets-008] a click on the Tampa pill flies to the downtown view', () => {
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
  const pill = f.elements.pills.children.find(
    (child) => child.dataset.locationId === 'tampa',
  );
  pill.fire('click');
  assert.deepEqual(ids, ['tampa']);
  assert.equal(flights.length, 1);
  assert.equal(flights[0].offset.range, 650);
  assert.ok(
    Math.abs(Cesium.Math.toDegrees(flights[0].offset.pitch) + 22) < 1e-8,
  );
  assert.equal(Cesium.Math.toDegrees(flights[0].offset.heading), 0);
  const point = Cesium.Cartographic.fromCartesian(result.targetPosition);
  assert.ok(Math.abs(Cesium.Math.toDegrees(point.latitude) - 27.9468) < 1e-8);
  assert.ok(Math.abs(Cesium.Math.toDegrees(point.longitude) + 82.4591) < 1e-8);
  controls.destroy();
});


test('POI keys held with Cmd, Ctrl or Alt run no POI; Shift still does', () => {
  const f = fixture();
  const target = { matches: () => false };
  for (const modifier of ['metaKey', 'ctrlKey', 'altKey'])
    for (const key of ['q', 'w', 'r', 'R'])
      f.doc.fire('keydown', { key, target, [modifier]: true });
  assert.deepEqual(f.calls, []);
  f.doc.fire('keydown', { key: 'W', target, shiftKey: true });
  assert.deepEqual(f.calls, [['poi', 'a', 1]]);
});
test('typing clears a failed search error and closing the emptied field drops it too', () => {
  const f = fixture();
  f.elements.search.value = 'Pariss';
  f.elements.search.fire('blur');
  assert.deepEqual(f.calls, [], 'leaving a kept query keeps its error');
  f.elements.search.fire('input');
  f.elements.search.value = '';
  f.elements.search.fire('blur');
  assert.deepEqual(f.calls, [['edit'], ['edit']]);
});
test('the search field opens and closes through the toggle and marks a lookup', () => {
  const f = fixture();
  const field = f.elements.search;
  f.controls.toggleSearch();
  assert.equal(f.view().searchExpanded, true);
  assert.equal(field.focused, true);
  f.controls.setSearching(true);
  assert.equal(f.view().searching, true);
  f.controls.toggleSearch();
  assert.equal(f.view().searchExpanded, false);
  f.controls.toggleSearch();
  field.value = 'Paris';
  f.controls.closeSearch();
  assert.equal(f.view().searchExpanded, false);
  assert.equal(field.value, '');
});
test('a lookup that found nothing keeps its query, the open field and focus', () => {
  const f = fixture();
  const field = f.elements.search;
  let selected = false;
  field.select = () => {
    selected = true;
  };
  f.controls.toggleSearch();
  f.controls.setSearching(true);
  field.value = 'Pariss';
  field.focused = false;
  f.controls.settleSearch({ keepQuery: true });
  assert.equal(f.view().searching, false);
  assert.equal(f.view().searchExpanded, true);
  assert.equal(field.value, 'Pariss');
  assert.equal(field.focused, true);
  assert.equal(selected, true);
});
test('a lookup that arrived clears and closes the field', () => {
  const f = fixture();
  const field = f.elements.search;
  let blurred = false;
  field.blur = () => {
    blurred = true;
  };
  f.controls.toggleSearch();
  f.controls.setSearching(true);
  field.value = 'Paris';
  f.controls.settleSearch();
  assert.equal(f.view().searching, false);
  assert.equal(f.view().searchExpanded, false);
  assert.equal(field.value, '');
  assert.equal(blurred, true);
  // Destroyed controls change nothing.
  f.controls.destroy();
  const after = f.views.length;
  f.controls.toggleSearch();
  f.controls.setSearching(true);
  f.controls.settleSearch();
  f.controls.closeSearch();
  assert.equal(f.views.length, after);
});
test('controls that replace others can start with the field open', () => {
  const f = fixture({ searchExpanded: true });
  assert.equal(f.controls.presentation().searchExpanded, true);
  assert.equal(f.elements.search.focused, undefined);
});
