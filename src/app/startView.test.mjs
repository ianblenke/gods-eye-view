import test from 'node:test';
import assert from 'node:assert/strict';
import * as Cesium from 'cesium';
import { START_VIEW, flyToStartView } from '../camera.js';
import { createApplicationControls } from './controls.js';

function cameraFixture() {
  const views = [];
  const flights = [];
  let cancelled = 0;
  let destroyed = false;
  return {
    views,
    flights,
    get cancelled() {
      return cancelled;
    },
    destroy() {
      destroyed = true;
    },
    viewer: {
      isDestroyed: () => destroyed,
      camera: {
        setView: (view) => views.push(view),
        flyTo: (view) => flights.push(view),
        cancelFlight: () => cancelled++,
      },
    },
  };
}

function position(view) {
  const carto = Cesium.Cartographic.fromCartesian(view.destination);
  return [
    Cesium.Math.toDegrees(carto.longitude),
    Cesium.Math.toDegrees(carto.latitude),
    carto.height,
  ];
}

function applicationFixture(hasShareState) {
  const camera = cameraFixture();
  const loaderStatus = { textContent: '' };
  const deferred = [];
  let controlsViewer;
  class Controls {
    constructor(viewer) {
      controlsViewer = viewer;
      this.hasShareState = hasShareState;
      this.orbitController = { stop() {} };
      this.hud = { destroy() {} };
    }

    dispose() {}
  }
  createApplicationControls({
    scene: {
      viewer: camera.viewer,
      mapStackController: {},
      operations: {
        surface: { controlServices: {} },
        searchAndFlyTo() {},
        requests: { regional: { getBrief() {} }, weather: {} },
      },
    },
    loaderStatus,
    Controls,
    services: {},
    catalog: { get: (id) => ({ id }) },
    placeSearch: {},
    defer: (stop) => deferred.push(stop),
    initCloudEffects: () => ({ destroy() {} }),
  });
  return { camera, loaderStatus, deferred, controlsViewer };
}

test('[startup-view-001] flies to the Taiwan pose', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  assert.deepEqual(START_VIEW, {
    longitude: 120.6485,
    latitude: 24.18,
    heightM: 217,
    headingDeg: 0,
    pitchDeg: -35,
    rollDeg: 0,
  });
  const { camera, controlsViewer } = applicationFixture(false);
  assert.equal(controlsViewer, camera.viewer);
  t.mock.timers.tick(500);
  assert.equal(camera.flights.length, 1);
  const [lon, lat, height] = position(camera.flights[0]);
  assert.ok(Math.abs(lon - 120.6485) < 1e-8);
  assert.ok(Math.abs(lat - 24.18) < 1e-8);
  assert.ok(Math.abs(height - 217) < 1e-5);
  assert.equal(camera.flights[0].orientation.heading, 0);
  assert.equal(camera.flights[0].orientation.pitch, Cesium.Math.toRadians(-35));
  assert.equal(camera.flights[0].orientation.roll, 0);
});

test('[startup-view-002] starts high above Taiwan after 500 ms', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const { viewer, views, flights } = cameraFixture();
  flyToStartView(viewer);
  assert.equal(views.length, 1);
  const [lon, lat, height] = position(views[0]);
  assert.ok(Math.abs(lon - 120.6485) < 1e-8);
  assert.ok(Math.abs(lat - 24.18) < 1e-8);
  assert.ok(Math.abs(height - 25000) < 1e-5);
  assert.equal(views[0].orientation.pitch, Cesium.Math.toRadians(-90));
  t.mock.timers.tick(499);
  assert.equal(flights.length, 0);
  t.mock.timers.tick(1);
  assert.equal(flights.length, 1);
  assert.equal(flights[0].duration, 4);
});

test('[startup-view-003] stops a late flight and skips a destroyed viewer', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const live = cameraFixture();
  const stop = flyToStartView(live.viewer);
  stop();
  t.mock.timers.tick(500);
  assert.equal(live.flights.length, 0);
  assert.equal(live.cancelled, 1);
  const dead = cameraFixture();
  const stopDead = flyToStartView(dead.viewer);
  dead.destroy();
  t.mock.timers.tick(500);
  assert.equal(dead.flights.length, 0);
  stopDead();
  assert.equal(dead.cancelled, 0);
});

test('[startup-view-004] keeps the share view', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const { camera, loaderStatus, deferred, controlsViewer } = applicationFixture(true);
  t.mock.timers.tick(500);
  assert.equal(controlsViewer, camera.viewer);
  assert.equal(camera.views.length, 0);
  assert.equal(camera.flights.length, 0);
  assert.equal(loaderStatus.textContent, 'Restoring shared view...');
  assert.equal(deferred.length, 4);
});

test('[startup-view-005] shows the Taiwan flight text', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const { camera, loaderStatus, deferred } = applicationFixture(false);
  assert.equal(camera.views.length, 1);
  assert.equal(loaderStatus.textContent, 'Flying to Taiwan...');
  assert.equal(deferred.length, 5);
  assert.equal(typeof deferred[4], 'function');
  deferred[4]();
  t.mock.timers.tick(500);
  assert.equal(camera.flights.length, 0);
  assert.equal(camera.cancelled, 1);
});
