import test from 'node:test';
import assert from 'node:assert/strict';
import {
  windFrom,
  formatWindSpeed,
  inspectWindAtCenter,
} from './inspection.js';

test('[wind-016] wind directions describe the source of the flow and calm is not north', () => {
  assert.equal(windFrom(10, 0), 'W');
  assert.equal(windFrom(-10, 0), 'E');
  assert.equal(windFrom(0, 10), 'S');
  assert.equal(windFrom(0, -10), 'N');
  assert.equal(windFrom(0, 0), 'Calm');
  assert.equal(formatWindSpeed(10, 'km/h'), '36.0 km/h');
  assert.equal(formatWindSpeed(10, 'mph'), '22.4 mph');
});
test('[wind-016] center inspection uses a fixed forecast reading without double-converting scalar units', () => {
  const snapshot = {
    grid: { nx: 2, ny: 2, lo1: 0, la1: 90, dx: 180, dy: 180 },
    u: Float32Array.from([10, 10, 10, 10]),
    v: new Float32Array(4),
    scalar: {
      kind: 'temperature',
      units: '°C',
      values: Float32Array.from([20, 20, 20, 20]),
    },
  };
  const viewer = {
    camera: { pickEllipsoid: () => ({ longitude: 0, latitude: 0 }) },
    scene: { canvas: { clientWidth: 800, clientHeight: 600 } },
  };
  const cesium = {
    Cartesian2: class {
      constructor(x, y) {
        this.x = x;
        this.y = y;
      }
    },
    Ellipsoid: { WGS84: {} },
    Cartographic: { fromCartesian: (p) => p },
    Math: { toDegrees: (x) => (x * 180) / Math.PI },
  };
  const result = inspectWindAtCenter(snapshot, viewer, cesium, {
    overlay: 'temperature',
    units: 'km/h',
    model: 'GFS',
    validTime: 'fixed',
    status: 'forecast',
  });
  assert.equal(result.wind, '36.0 km/h from W');
  assert.equal(result.scalarValue, '20.0 °C');
  assert.equal(result.validTime, 'fixed');
  assert.equal(result.coordinates, '0.00°N · 0.00°E');
  viewer.camera.pickEllipsoid = () => null;
  assert.equal(
    inspectWindAtCenter(snapshot, viewer, cesium).coordinates,
    'No surface reading',
  );
});

test('[wind-017] inspection marker follows only its captured point, hides beyond limb, and releases its listener', async () => {
  const { createWindInspectionMarker } = await import('./inspection.js');
  let listener = null;
  let visible = true;
  const projected = [];
  const nodes = [];
  const container = {
    ownerDocument: { createElement: () => ({ style: {}, setAttribute() {}, remove() { nodes.splice(nodes.indexOf(this), 1); } }) },
    appendChild(node) { nodes.push(node); },
    getBoundingClientRect: () => ({ left: 5, top: 10 }),
  };
  const viewer = {
    camera: { positionWC: {} },
    scene: {
      mode: 3,
      canvas: { clientWidth: 800, clientHeight: 600, getBoundingClientRect: () => ({ left: 15, top: 30 }) },
      postRender: { addEventListener(fn) { assert.equal(listener, null); listener = fn; return () => { listener = null; }; } },
      cartesianToCanvasCoordinates(point) { projected.push(point); return { x: 100, y: 200 }; },
      requestRender() {},
    },
  };
  const cesium = {
    SceneMode: { SCENE3D: 3 }, Ellipsoid: { WGS84: {} },
    EllipsoidalOccluder: class { isPointVisible() { return visible; } },
  };
  const owner = createWindInspectionMarker({ container, viewer, cesium });
  const point = { x: 1, y: 2, z: 3 };
  owner.show(point);
  assert.equal(nodes.length, 1);
  assert.match(nodes[0].style.cssText, /pointer-events:none/);
  assert.equal(nodes[0].style.left, '110px');
  assert.equal(nodes[0].style.top, '220px');
  viewer.camera.positionWC = { moved: true };
  visible = false;
  listener();
  assert.equal(nodes[0].hidden, true);
  assert.ok(projected.every((value) => value === point));
  visible = true;
  listener();
  assert.equal(nodes[0].hidden, false);
  owner.show({ x: 4 });
  assert.equal(nodes.length, 1);
  owner.clear();
  assert.equal(nodes.length, 0);
  assert.equal(listener, null);
  owner.show(point);
  owner.destroy();
  owner.destroy();
  assert.equal(nodes.length, 0);
  assert.equal(listener, null);
});

test('[wind-016] readout uses south and west signs and scalar modes', () => {
  const grid = { nx: 2, ny: 2, lo1: -180, la1: 90, dx: 180, dy: 180 };
  const base = { grid, u: new Float32Array(4).fill(3), v: new Float32Array(4).fill(4) };
  const point = { longitude: -Math.PI / 2, latitude: -Math.PI / 4 };
  const viewer = { scene: { canvas: { clientWidth: 400, clientHeight: 300 } }, camera: { pickEllipsoid: () => point } };
  const cesium = {
    Cartesian2: class { constructor(x, y) { this.x = x; this.y = y; } },
    Cartographic: { fromCartesian: (p) => p },
    Math: { toDegrees: (x) => x * 180 / Math.PI },
  };
  const speed = inspectWindAtCenter(base, viewer, cesium, { overlay: 'speed', units: 'm/s' });
  assert.equal(speed.coordinates, '45.00°S · 90.00°W');
  assert.equal(speed.scalarLabel, 'Wind speed');
  assert.equal(speed.scalarValue, '5.0 m/s');
  const pressure = inspectWindAtCenter({ ...base, scalar: { kind: 'pressure', units: 'hPa', values: new Float32Array(4).fill(1000) } }, viewer, cesium, { overlay: 'pressure', position: point });
  assert.equal(pressure.scalarValue, '1000.0 hPa');
  assert.equal(pressure.scalarLabel, 'Sea-level pressure');
  assert.equal(inspectWindAtCenter(base, viewer, cesium, { overlay: 'pressure' }).scalarValue, null);
  assert.equal(inspectWindAtCenter(base, viewer, cesium, { overlay: 'none' }).scalarLabel, null);
  assert.equal(formatWindSpeed(5, 'bad'), '18.0 km/h');
});

test('[wind-017] marker skips absent scene inputs and hides out of view', async () => {
  const { createWindInspectionMarker } = await import('./inspection.js');
  let shown;
  let listener;
  const node = { style: {}, setAttribute() {}, remove() {} };
  const container = { ownerDocument: { createElement: () => node }, appendChild(x) { shown = x; }, getBoundingClientRect: () => ({ left: 0, top: 0 }) };
  const scene = { canvas: { clientWidth: 10, clientHeight: 10, getBoundingClientRect: () => ({ left: 0, top: 0 }) }, postRender: { addEventListener(fn) { listener = fn; return () => {}; } }, cartesianToCanvasCoordinates: () => ({ x: -1, y: 2 }) };
  const viewer = { camera: { positionWC: {} }, scene };
  const cesium = { Ellipsoid: { WGS84: {} }, SceneMode: { SCENE3D: 3 }, EllipsoidalOccluder: class { isPointVisible() { return true; } } };
  const marker = createWindInspectionMarker({ container, viewer, cesium });
  marker.show(null);
  assert.equal(shown, undefined);
  marker.show({ x: 1 });
  assert.equal(shown.hidden, true);
  scene.cartesianToCanvasCoordinates = () => null;
  listener();
  assert.equal(shown.hidden, true);
  scene.cartesianToCanvasCoordinates = () => ({ x: 4, y: 5 });
  listener();
  assert.equal(shown.hidden, false);
  marker.clear();
});

test('[wind-016] calm readout uses a globe ellipsoid', () => {
  const ellipsoid = { id: 'globe' };
  const point = { longitude: 0, latitude: 0 };
  const scene = { globe: { ellipsoid }, canvas: { clientWidth: 20, clientHeight: 20 } };
  const viewer = { scene, camera: { pickEllipsoid: (_, used) => { assert.equal(used, ellipsoid); return point; } } };
  const cesium = { Cartesian2: class {}, Cartographic: { fromCartesian: (p) => p }, Math: { toDegrees: (x) => x } };
  const grid = { nx: 2, ny: 2, lo1: 0, la1: 90, dx: 180, dy: 180 };
  const result = inspectWindAtCenter({ grid, u: new Float32Array(4), v: new Float32Array(4) }, viewer, cesium);
  assert.equal(result.wind, '0.0 km/h · calm');
});

test('[wind-017] marker uses the globe ellipsoid', async () => {
  const { createWindInspectionMarker } = await import('./inspection.js');
  const ellipsoid = { id: 'globe' };
  const container = { ownerDocument: { createElement: () => ({ style: {}, setAttribute() {}, remove() {} }) }, appendChild() {}, getBoundingClientRect: () => ({ left: 0, top: 0 }) };
  const scene = { globe: { ellipsoid }, canvas: { clientWidth: 2, clientHeight: 2, getBoundingClientRect: () => ({ left: 0, top: 0 }) }, postRender: { addEventListener: () => () => {} }, cartesianToCanvasCoordinates: () => ({ x: 1, y: 1 }) };
  const viewer = { scene, camera: { positionWC: {} } };
  const cesium = { EllipsoidalOccluder: class { constructor(value) { assert.equal(value, ellipsoid); } isPointVisible() { return true; } }, SceneMode: { SCENE3D: 3 } };
  const marker = createWindInspectionMarker({ container, viewer, cesium });
  marker.show({ x: 1 });
  marker.destroy();
});
