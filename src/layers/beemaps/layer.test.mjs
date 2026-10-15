import assert from 'node:assert/strict';
import test from 'node:test';
import * as Cesium from 'cesium';
import { createBeemapsLayer } from './index.js';

const NOW = Date.UTC(2026, 9, 15, 12, 0, 0);
const HOUR = 3600_000;
const hex = (n) => n.toString(16).padStart(16, '0');
const frame = (n, overrides = {}) => {
  const timestamp = new Date(NOW - n * HOUR).toISOString();
  return {
    id: hex(n),
    lat: 10 + n,
    lon: 20 + n,
    timestamp,
    time: Date.parse(timestamp),
    ...overrides,
  };
};
const answer = (frames, extra = {}) => ({
  frames,
  used: 3,
  limit: 20,
  remaining: 998,
  ...extra,
});
const THREE = answer([frame(1), frame(200), frame(1000)]);
const deferred = () => {
  let resolve;
  let reject;
  const promise = new Promise((ok, no) => {
    resolve = ok;
    reject = no;
  });
  return { promise, resolve, reject };
};
const tick = () => new Promise((resolve) => setImmediate(resolve));
const HINT =
  'A press asks for the newest frames in 4 km² at the view centre. It can cost money.';
const STATUS_FAILED = 'The server did not give the status of the key.';

function harness({
  status = async () => ({ ok: true, configured: true }),
  frames = async () => ({ ok: true, answer: THREE }),
  pick = () => Cesium.Cartesian3.fromDegrees(10.0031, 59.9976),
  canvas = { clientWidth: 800, clientHeight: 600 },
} = {}) {
  const calls = { getStatus: [], getFrames: [] };
  const source = {
    getStatus: (options) => {
      calls.getStatus.push(options);
      return status(options);
    },
    getFrames: (options) => {
      calls.getFrames.push(options);
      return frames(options);
    },
  };
  const added = [];
  const listeners = [];
  const picks = [];
  const handlers = {};
  const watch = (name) => ({
    addEventListener: (handler) => {
      listeners.push(name);
      (handlers[name] ??= []).push(handler);
    },
    raiseEvent: () => (handlers[name] ?? []).forEach((handler) => handler()),
  });
  const viewer = {
    dataSources: {
      add: (dataSource) => added.push(dataSource),
      remove(dataSource, destroy) {
        added.splice(added.indexOf(dataSource), 1);
        viewer.removed = [dataSource, destroy];
      },
    },
    camera: {
      positionWC: Cesium.Cartesian3.fromDegrees(0, 0, 1e7),
      changed: watch('camera.changed'),
      moveStart: watch('camera.moveStart'),
      moveEnd: watch('camera.moveEnd'),
      pickEllipsoid: (...args) => {
        picks.push(args);
        return pick(...args);
      },
    },
    scene: {
      canvas,
      globe: { ellipsoid: Cesium.Ellipsoid.WGS84 },
      preRender: watch('scene.preRender'),
      postRender: watch('scene.postRender'),
    },
  };
  const clock = { t: NOW };
  const layer = createBeemapsLayer({ source, now: () => clock.t });
  const chip = () => layer.getRowControls().chips[0];
  const info = () => layer.getRowControls().info;
  return {
    layer,
    viewer,
    calls,
    added,
    listeners,
    picks,
    clock,
    chip,
    info,
    dataSource: () => added[0],
    async ready() {
      layer.init(viewer);
      layer.enable(viewer);
      await layer.update();
    },
  };
}

test('[beemaps-frames-001] describes the layer and has no method setParams', () => {
  const { layer } = harness();
  assert.equal(layer.id, 'beemaps');
  assert.equal(layer.name, 'Bee Maps Frames');
  assert.equal(layer.icon, '📸');
  assert.equal(layer.source, 'Bee Maps');
  assert.equal(layer.updateInterval, 0);
  assert.equal('setParams' in layer, false);
  assert.deepEqual(layer.getStats(), {
    count: 0,
    lastUpdate: null,
    error: null,
  });
});

test('[beemaps-frames-001] refuses a source without getStatus and getFrames', () => {
  for (const source of [
    undefined,
    null,
    {},
    { getStatus() {} },
    { getFrames() {} },
  ])
    assert.throws(() => createBeemapsLayer({ source }), TypeError);
});

test('[beemaps-frames-001] refuses a second init', () => {
  const { layer, viewer } = harness();
  layer.init(viewer);
  assert.throws(() => layer.init(viewer), /already initialized/);
});

test('[beemaps-frames-002] asks only for the status and adds no listener to the camera or the scene', async () => {
  const { layer, viewer, calls, listeners } = harness();
  layer.init(viewer);
  layer.enable(viewer);
  for (const [lon, lat] of [
    [10, 60],
    [11, 61],
    [12, 62],
  ]) {
    viewer.camera.positionWC = Cesium.Cartesian3.fromDegrees(lon, lat, 1e7);
    for (const name of ['moveStart', 'changed', 'moveEnd'])
      viewer.camera[name].raiseEvent();
    viewer.scene.preRender.raiseEvent();
    viewer.scene.postRender.raiseEvent();
    await layer.update();
  }
  layer.disable(viewer);
  layer.enable(viewer);
  assert.equal(calls.getStatus.length, 3);
  assert.equal(calls.getFrames.length, 0);
  assert.deepEqual(listeners, []);
});

test('[beemaps-frames-002] reads the status only while it is enabled', async () => {
  const { layer, viewer, calls } = harness();
  layer.init(viewer);
  assert.equal(await layer.update(), false);
  assert.equal(calls.getStatus.length, 0);
  assert.equal(calls.getFrames.length, 0);
});

test('[beemaps-frames-003] has one chip with an onClick function and no params, and one click gives one request', async () => {
  const h = harness();
  await h.ready();
  const { chips } = h.layer.getRowControls();
  assert.equal(chips.length, 1);
  assert.equal(chips[0].id, 'fetch');
  assert.equal(chips[0].label, 'Fetch frames here');
  assert.equal(typeof chips[0].onClick, 'function');
  assert.equal('params' in chips[0], false);
  assert.equal(h.calls.getFrames.length, 0);
  await chips[0].onClick();
  assert.equal(h.calls.getFrames.length, 1);
});

test('[beemaps-frames-003] has no chip after disable, and an old onClick sends no request', async () => {
  const h = await (async () => {
    const value = harness();
    await value.ready();
    return value;
  })();
  const old = h.chip().onClick;
  h.layer.disable(h.viewer);
  assert.deepEqual(h.layer.getRowControls().chips, []);
  await old();
  assert.equal(h.calls.getFrames.length, 0);
  const disabledOnly = harness();
  disabledOnly.layer.init(disabledOnly.viewer);
  assert.deepEqual(disabledOnly.layer.getRowControls().chips, []);
});

test('[beemaps-frames-004] sends one request for two calls of onClick, and keeps the chip disabled with the label Fetching… while it runs, also after an update', async () => {
  const wait = deferred();
  const h = harness({ frames: () => wait.promise });
  await h.ready();
  const first = h.chip().onClick();
  const second = h.chip().onClick();
  await tick();
  assert.equal(h.calls.getFrames.length, 1);
  assert.equal(h.chip().label, 'Fetching…');
  assert.equal(h.chip().disabled, true);
  assert.equal(await h.layer.update(), true);
  assert.equal(h.chip().label, 'Fetching…');
  assert.equal(h.chip().disabled, true);
  assert.equal(h.calls.getFrames.length, 1);
  wait.resolve({ ok: true, answer: THREE });
  await Promise.all([first, second]);
  assert.equal(h.chip().label, 'Fetch frames here');
  assert.equal(h.chip().disabled, false);
  assert.equal(h.calls.getFrames.length, 1);
});

test('[beemaps-frames-005] sends no request again after a rejection or an error answer', async (t) => {
  t.mock.timers.enable({
    apis: ['setTimeout', 'setInterval', 'Date'],
    now: NOW,
  });
  for (const result of [
    () => Promise.reject(new Error('boom')),
    () =>
      Promise.resolve({
        ok: false,
        status: 429,
        error: 'upstream_rate_limit',
        retryAfter: 30,
      }),
    () => Promise.resolve({ ok: false, status: 502, error: 'upstream_failed' }),
  ]) {
    const h = harness({ frames: result });
    await h.ready();
    await h.chip().onClick();
    assert.equal(h.calls.getFrames.length, 1);
    t.mock.timers.tick(10 * 60_000);
    await tick();
    await h.layer.update();
    await h.layer.update();
    await h.layer.update();
    h.layer.disable(h.viewer);
    h.layer.enable(h.viewer);
    await tick();
    assert.equal(h.calls.getFrames.length, 1);
    h.layer.disable(h.viewer);
    h.layer.enable(h.viewer);
    await h.layer.update();
    assert.equal(h.chip().disabled, false);
    await h.chip().onClick();
    assert.equal(h.calls.getFrames.length, 2);
  }
});

test('[beemaps-frames-006] disables the chip and shows the text for no key when the status says there is no key', async () => {
  const h = harness({ status: async () => ({ ok: true, configured: false }) });
  await h.ready();
  assert.equal(h.chip().disabled, true);
  assert.equal(
    h.info(),
    'No Bee Maps key. Set BEEMAPS_API_KEY in .env and restart the app.',
  );
  await h.chip().onClick();
  assert.equal(h.calls.getFrames.length, 0);
  const enabled = harness();
  await enabled.ready();
  assert.equal(enabled.chip().disabled, false);
  assert.equal(enabled.info(), HINT);
});

test('[beemaps-frames-007] shows that the server did not give the status, and keeps the layer enabled, when the status fails', async () => {
  const rows = [
    [async () => ({ ok: false }), STATUS_FAILED],
    [async () => Promise.reject(new Error('down')), 'down'],
    [async () => Promise.reject(new Error('')), STATUS_FAILED],
    [async () => Promise.reject({}), STATUS_FAILED],
    [async () => Promise.reject(undefined), STATUS_FAILED],
  ];
  for (const [status, error] of rows) {
    const h = harness({ status });
    h.layer.init(h.viewer);
    h.layer.enable(h.viewer);
    assert.equal(await h.layer.update(), true);
    assert.equal(h.info(), STATUS_FAILED);
    assert.equal(h.layer.getStats().error, error);
    assert.equal(h.chip().disabled, false);
  }
});

test('[beemaps-frames-006] keeps the text for no key when a good answer arrives after a status with no key', async () => {
  const wait = deferred();
  let configured = true;
  const h = harness({
    status: async () => ({ ok: true, configured }),
    frames: () => wait.promise,
  });
  await h.ready();
  const pressed = h.chip().onClick();
  await tick();
  configured = false;
  await h.layer.update();
  wait.resolve({ ok: true, answer: THREE });
  await pressed;
  assert.equal(h.chip().disabled, true);
  assert.equal(
    h.info(),
    'No Bee Maps key. Set BEEMAPS_API_KEY in .env and restart the app. · 3 frames · newest 2026-10-15 · requests today 3 of 20 · credits left 998',
  );
});

test('[beemaps-frames-007] removes the text and the error of a failed status after a good status', async () => {
  let fail = true;
  const h = harness({
    status: async () => (fail ? { ok: false } : { ok: true, configured: true }),
  });
  await h.ready();
  assert.equal(h.info(), STATUS_FAILED);
  assert.equal(h.layer.getStats().error, STATUS_FAILED);
  fail = false;
  assert.equal(await h.layer.update(), true);
  assert.equal(h.info(), HINT);
  assert.equal(h.layer.getStats().error, null);
});

test('[beemaps-frames-007] removes the text and the error of a failed status after a good answer of getFrames', async () => {
  const h = harness({ status: async () => ({ ok: false }) });
  await h.ready();
  assert.equal(h.info(), STATUS_FAILED);
  await h.chip().onClick();
  assert.equal(
    h.info(),
    '3 frames · newest 2026-10-15 · requests today 3 of 20 · credits left 998',
  );
  assert.equal(h.layer.getStats().error, null);
});

test('[beemaps-frames-007] shows the message and the error of a press that fails after a failed status', async () => {
  const h = harness({
    status: async () => ({ ok: false }),
    frames: async () => ({ ok: false, status: 502, error: 'upstream_failed' }),
  });
  await h.ready();
  await h.chip().onClick();
  assert.equal(h.info(), 'Bee Maps did not answer correctly.');
  assert.equal(h.layer.getStats().error, 'Bee Maps did not answer correctly.');
});

test('[beemaps-frames-008] builds the box from the point under the middle of the canvas', async () => {
  const h = harness();
  await h.ready();
  await h.chip().onClick();
  assert.equal(h.calls.getFrames.length, 1);
  assert.deepEqual(
    h.calls.getFrames[0].bbox,
    [9.987014, 59.991007, 10.022986, 60.008993],
  );
  assert.equal(h.calls.getFrames[0].signal instanceof AbortSignal, true);
  assert.equal(h.picks.length, 1);
  assert.equal(h.picks[0][0].x, 400);
  assert.equal(h.picks[0][0].y, 300);
  assert.equal(h.picks[0][1], Cesium.Ellipsoid.WGS84);
});

test('[beemaps-frames-009] sends no request and names the reason for a view that has no box', async () => {
  const sky = harness({ pick: () => undefined });
  await sky.ready();
  await sky.chip().onClick();
  assert.equal(sky.calls.getFrames.length, 0);
  assert.equal(sky.info(), 'Point the view at the ground and press again.');
  assert.equal(
    sky.layer.getStats().error,
    'Point the view at the ground and press again.',
  );
  const throwing = harness({
    pick: () => {
      throw new Error('no globe');
    },
  });
  await throwing.ready();
  await throwing.chip().onClick();
  assert.equal(throwing.calls.getFrames.length, 0);
  assert.equal(
    throwing.info(),
    'Point the view at the ground and press again.',
  );
  const empty = harness({ canvas: { clientWidth: 0, clientHeight: 600 } });
  await empty.ready();
  await empty.chip().onClick();
  assert.equal(empty.calls.getFrames.length, 0);
  const flat = harness({ canvas: { clientWidth: 800, clientHeight: 0 } });
  await flat.ready();
  await flat.chip().onClick();
  assert.equal(flat.calls.getFrames.length, 0);
  const north = harness({
    pick: () => Cesium.Cartesian3.fromDegrees(0, 80.003),
  });
  await north.ready();
  await north.chip().onClick();
  assert.equal(north.calls.getFrames.length, 0);
  assert.equal(
    north.info(),
    'Move the view to a latitude from -80 to 80 degrees and press again.',
  );
  const edge = harness({
    pick: () => Cesium.Cartesian3.fromDegrees(179.995, 0),
  });
  await edge.ready();
  await edge.chip().onClick();
  assert.equal(edge.calls.getFrames.length, 0);
  assert.equal(
    edge.info(),
    'Move the view away from the 180th meridian and press again.',
  );
  const noGlobe = harness();
  noGlobe.viewer.scene.globe = undefined;
  await noGlobe.ready();
  await noGlobe.chip().onClick();
  assert.equal(noGlobe.calls.getFrames.length, 1);
  assert.equal(noGlobe.picks[0][1], undefined);
  const noScene = harness();
  noScene.viewer.scene = undefined;
  await noScene.ready();
  await noScene.chip().onClick();
  assert.equal(noScene.calls.getFrames.length, 0);
});

test('[beemaps-frames-019] shows one point on the ground for each frame, with the style of its age', async () => {
  const h = harness();
  await h.ready();
  await h.chip().onClick();
  const entities = h.dataSource().entities.values;
  assert.equal(entities.length, 3);
  assert.deepEqual(
    entities.map((entity) => entity.id),
    [`beemaps:${hex(1)}`, `beemaps:${hex(200)}`, `beemaps:${hex(1000)}`],
  );
  const julian = Cesium.JulianDate.now();
  const expected = [
    [8, 1],
    [7, 0.7],
    [6, 0.4],
  ];
  entities.forEach((entity, index) => {
    const [size, alpha] = expected[index];
    assert.equal(entity.point.pixelSize.getValue(julian), size);
    const color = entity.point.color.getValue(julian);
    assert.equal(color.alpha, alpha);
    assert.equal(Cesium.Color.fromAlpha(color, 1).toCssHexString(), '#f59e0b');
    assert.equal(
      entity.point.heightReference.getValue(julian),
      Cesium.HeightReference.CLAMP_TO_GROUND,
    );
  });
  assert.deepEqual(h.layer.getStats(), {
    count: 3,
    lastUpdate: NOW,
    error: null,
  });
});

test('[beemaps-frames-019] puts each point at the position of its frame', async () => {
  const h = harness({
    frames: async () => ({
      ok: true,
      answer: answer([frame(1, { lat: 12.5, lon: -45.25 })]),
    }),
  });
  await h.ready();
  await h.chip().onClick();
  const [entity] = h.dataSource().entities.values;
  const position = entity.position.getValue(Cesium.JulianDate.now());
  assert.equal(
    Cesium.Cartesian3.equalsEpsilon(
      position,
      Cesium.Cartesian3.fromDegrees(-45.25, 12.5),
      1e-6,
    ),
    true,
  );
});

test('[beemaps-frames-019] replaces the points of the first answer with those of the second', async () => {
  let call = 0;
  const h = harness({
    frames: async () => ({
      ok: true,
      answer: call++ === 0 ? THREE : answer([frame(5)]),
    }),
  });
  await h.ready();
  await h.chip().onClick();
  h.clock.t = NOW + 1000;
  await h.chip().onClick();
  assert.deepEqual(
    h.dataSource().entities.values.map((entity) => entity.id),
    [`beemaps:${hex(5)}`],
  );
  assert.deepEqual(h.layer.getStats(), {
    count: 1,
    lastUpdate: NOW + 1000,
    error: null,
  });
});

test('[beemaps-frames-020] keeps the points and shows the message when a later press fails', async () => {
  let call = 0;
  const h = harness({
    frames: async () =>
      call++ === 0
        ? { ok: true, answer: THREE }
        : { ok: false, status: 429, error: 'budget', limit: 20 },
  });
  await h.ready();
  await h.chip().onClick();
  await h.chip().onClick();
  assert.equal(h.dataSource().entities.values.length, 3);
  assert.equal(
    h.info(),
    'The daily limit of 20 requests is used. · 3 frames · newest 2026-10-15 · requests today 3 of 20 · credits left 998',
  );
  assert.deepEqual(h.layer.getStats(), {
    count: 3,
    lastUpdate: NOW,
    error: 'The daily limit of 20 requests is used.',
  });
  assert.equal(h.chip().disabled, false);
});

test('[beemaps-frames-020] shows the message of a first press that fails and keeps no point', async () => {
  const h = harness({
    frames: async () => ({ ok: false, status: 403, error: 'cross_origin' }),
  });
  await h.ready();
  await h.chip().onClick();
  assert.equal(h.dataSource().entities.values.length, 0);
  assert.equal(
    h.info(),
    'Only the machine that runs the server can fetch frames. Start the app with make up-codex.',
  );
  assert.equal(h.layer.getStats().count, 0);
});

test('[beemaps-frames-020] keeps the points when a press has no box', async () => {
  let sky = false;
  const h = harness({
    pick: () => (sky ? undefined : Cesium.Cartesian3.fromDegrees(10, 60)),
  });
  await h.ready();
  await h.chip().onClick();
  sky = true;
  await h.chip().onClick();
  assert.equal(h.dataSource().entities.values.length, 3);
  assert.equal(h.calls.getFrames.length, 1);
  assert.equal(h.layer.getStats().count, 3);
});

test('[beemaps-frames-020] clears the message after a good answer', async () => {
  let call = 0;
  const h = harness({
    frames: async () =>
      call++ === 0
        ? { ok: false, status: 502, error: 'upstream_failed' }
        : { ok: true, answer: THREE },
  });
  await h.ready();
  await h.chip().onClick();
  assert.equal(h.info(), 'Bee Maps did not answer correctly.');
  await h.chip().onClick();
  assert.equal(h.info().startsWith('3 frames'), true);
  assert.equal(h.layer.getStats().error, null);
});

test('[beemaps-frames-021] aborts the request on disable and ignores the late answer', async () => {
  const wait = deferred();
  const h = harness({ frames: () => wait.promise });
  await h.ready();
  const pressed = h.chip().onClick();
  await tick();
  h.layer.disable(h.viewer);
  assert.equal(h.calls.getFrames[0].signal.aborted, true);
  wait.resolve({ ok: true, answer: THREE });
  await pressed;
  assert.equal(h.dataSource().entities.values.length, 0);
  assert.equal(h.dataSource().show, false);
  assert.equal(h.layer.getStats().count, 0);
  h.layer.enable(h.viewer);
  assert.equal(h.info(), HINT);
  assert.equal(h.layer.getStats().error, null);
});

test('[beemaps-frames-021] shows no point after disable and no message after the next enable', async () => {
  let call = 0;
  const h = harness({
    frames: async () =>
      call++ === 0
        ? { ok: true, answer: THREE }
        : { ok: false, status: 502, error: 'upstream_failed' },
  });
  await h.ready();
  await h.chip().onClick();
  await h.chip().onClick();
  h.layer.disable(h.viewer);
  assert.equal(h.dataSource().entities.values.length, 0);
  h.layer.enable(h.viewer);
  assert.equal(h.dataSource().show, true);
  assert.equal(h.info(), HINT);
  assert.deepEqual(h.layer.getStats(), {
    count: 0,
    lastUpdate: null,
    error: null,
  });
});

test('[beemaps-frames-021] ignores a status answer that arrives after disable', async () => {
  const wait = deferred();
  const h = harness({ status: () => wait.promise });
  h.layer.init(h.viewer);
  h.layer.enable(h.viewer);
  const updating = h.layer.update();
  await tick();
  h.layer.disable(h.viewer);
  assert.equal(h.calls.getStatus[0].signal.aborted, true);
  wait.resolve({ ok: true, configured: false });
  assert.equal(await updating, false);
  h.layer.enable(h.viewer);
  assert.equal(h.info(), HINT);
});

test('[beemaps-frames-021] aborts the status request of an update before when a new update starts', async () => {
  const first = deferred();
  let call = 0;
  const h = harness({
    status: () =>
      call++ === 0
        ? first.promise
        : Promise.resolve({ ok: true, configured: true }),
  });
  h.layer.init(h.viewer);
  h.layer.enable(h.viewer);
  const older = h.layer.update();
  await tick();
  const newer = h.layer.update();
  assert.equal(h.calls.getStatus[0].signal.aborted, true);
  first.resolve({ ok: true, configured: false });
  assert.equal(await older, false);
  assert.equal(await newer, true);
  assert.equal(h.info(), HINT);
});

test('[beemaps-frames-022] releases the data source and aborts the request on destroy', async () => {
  const wait = deferred();
  const h = harness({ frames: () => wait.promise });
  await h.ready();
  const dataSource = h.dataSource();
  const pressed = h.chip().onClick();
  await tick();
  h.layer.destroy(h.viewer);
  assert.equal(h.calls.getFrames[0].signal.aborted, true);
  assert.deepEqual(h.added, []);
  assert.deepEqual(h.viewer.removed, [dataSource, true]);
  wait.resolve({ ok: true, answer: THREE });
  await pressed;
  assert.deepEqual(h.layer.getStats(), {
    count: 0,
    lastUpdate: null,
    error: null,
  });
  h.viewer.removed = null;
  h.layer.destroy(h.viewer);
  assert.equal(h.viewer.removed, null);
});

test('[beemaps-frames-022] clears the points of a layer that shows them on destroy', async () => {
  const h = harness();
  await h.ready();
  await h.chip().onClick();
  h.layer.destroy(h.viewer);
  assert.deepEqual(h.layer.getStats(), {
    count: 0,
    lastUpdate: null,
    error: null,
  });
  assert.deepEqual(h.layer.getRowControls().chips, []);
});

test('[beemaps-frames-022] destroys a layer that was never initialized', () => {
  const h = harness();
  h.layer.destroy(h.viewer);
  assert.deepEqual(h.added, []);
});

test('[beemaps-frames-023] tells the panel when a request starts and ends and when an update ends', async () => {
  const wait = deferred();
  const h = harness({ frames: () => wait.promise });
  let count = 0;
  const seen = [];
  h.layer.setRowControlsListener(() => {
    count++;
    seen.push(h.layer.getRowControls().chips[0]?.label);
  });
  h.layer.init(h.viewer);
  h.layer.enable(h.viewer);
  await h.layer.update();
  assert.equal(count, 1);
  const pressed = h.chip().onClick();
  await tick();
  assert.equal(count, 2);
  wait.resolve({ ok: true, answer: THREE });
  await pressed;
  assert.equal(count, 3);
  assert.deepEqual(seen, [
    'Fetch frames here',
    'Fetching…',
    'Fetch frames here',
  ]);
  h.layer.setRowControlsListener(null);
  await h.layer.update();
  await h.chip().onClick();
  assert.equal(count, 3);
});

test('[beemaps-frames-023] tells the panel when a press has no box', async () => {
  const h = harness({ pick: () => undefined });
  await h.ready();
  let count = 0;
  h.layer.setRowControlsListener(() => count++);
  await h.chip().onClick();
  assert.equal(count, 1);
});
