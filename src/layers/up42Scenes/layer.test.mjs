import assert from 'node:assert/strict';
import test from 'node:test';
import * as Cesium from 'cesium';
import { createUp42ScenesLayer } from './index.js';

const NOW = Date.parse('2026-10-21T12:00:00.000Z');
const MINUTE = 60_000;
const RING = [
  [10, 60],
  [10.2, 60],
  [10.2, 60.1],
  [10, 60.1],
  [10, 60],
];
const scene = (id, overrides = {}) => ({
  id,
  time: Date.parse('2026-10-14T08:03:00.000Z'),
  ring: RING,
  resolutionM: 0.5,
  provider: 'Satellogic',
  cloudPercent: 3,
  thumbnail: true,
  ...overrides,
});
const answerOf = (scenes, extra = {}) => ({
  scenes,
  count: scenes.length,
  truncated: false,
  partial: false,
  used: 3,
  limit: 20,
  ...extra,
});
const THREE = answerOf([
  scene('a'),
  scene('b', {
    time: Date.parse('2026-10-12T10:00:00.000Z'),
    ring: [
      [10, 60],
      [13, 60],
      [10, 63],
      [10, 60],
    ],
    provider: null,
  }),
  scene('c', { thumbnail: false }),
]);
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
// The globe of the fake viewer has an ellipsoid of its own, so a default value cannot pass for it.
const GLOBE_ELLIPSOID = Cesium.Ellipsoid.clone(Cesium.Ellipsoid.WGS84);
const HINT =
  'A press searches 92 days of the UP42 archive in a 48 km box at the view centre.';
const STATUS_FAILED = 'The server did not give the status of the credentials.';
const NO_KEY =
  'No UP42 credentials. Set UP42_USERNAME and UP42_PASSWORD in .env and restart the app.';
const LOADING = 'Loading the thumbnail…';
const ANSWER_TEXT = '3 scenes · newest 2026-10-14 · searches today 3 of 20';
const BLOB = new Blob([Uint8Array.from([1, 2, 3])], { type: 'image/png' });
const fakeImage = (width = 256, height = 128) => {
  const value = { width, height, closed: 0 };
  value.close = () => {
    value.closed += 1;
  };
  return value;
};

const PRODUCT_IDS = Array.from(
  { length: 8 },
  (_, i) => `00000000-0000-4000-8000-00000000000${i}`,
);
const PRODUCTS = PRODUCT_IDS.map((id, i) => ({ id, title: `Product ${i}` }));
const QUOTE = {
  results: {
    validation: { ok: true, status: 'VALID' },
    estimate: { ok: true, credits: 120, size: 4, unit: 'SQ_KM' },
    feasibility: { ok: true, outcome: 'FEASIBLE' },
    opportunities: { ok: true, count: 3 },
  },
  cached: false,
  budget: { used: 2, limit: 20 },
};
const QUOTE_TEXT =
  'Validation: VALID · Estimate: 120 credits for 4 SQ_KM · Feasibility: FEASIBLE · Passes: 3 · Quotes today: 2 of 20. No order was made.';
const BOX = [9.568326, 59.784163, 10.431674, 60.215837];

function harness({
  status = async () => ({ ok: true, configured: true }),
  scenes = async () => ({ ok: true, answer: THREE }),
  thumbnail = async () => ({ ok: true, blob: BLOB }),
  decode = async () => fakeImage(),
  pick = () => Cesium.Cartesian3.fromDegrees(10.0031, 59.9976),
  canvas = { clientWidth: 800, clientHeight: 600 },
  withRender = true,
  withDecode = true,
  withNow = true,
  withQuotes = false,
  products = async () => ({ ok: true, products: PRODUCTS }),
  quote = async () => ({ ok: true, ...QUOTE }),
} = {}) {
  const calls = {
    getStatus: [],
    searchScenes: [],
    getThumbnail: [],
    getProducts: [],
    getQuote: [],
    decode: [],
  };
  const source = {
    getStatus: (options) => {
      calls.getStatus.push(options);
      return status(options);
    },
    searchScenes: (options) => {
      calls.searchScenes.push(options);
      return scenes(options);
    },
    getThumbnail: (options) => {
      calls.getThumbnail.push(options);
      return thumbnail(options);
    },
    ...(withQuotes
      ? {
          getProducts: (options) => {
            calls.getProducts.push(options);
            return products(options);
          },
          getQuote: (options) => {
            calls.getQuote.push(options);
            return quote(options);
          },
        }
      : {}),
  };
  const overlay = [];
  const overlayHost = {
    setEntries: (...args) => overlay.push(['setEntries', ...args]),
    clearSource: (...args) => overlay.push(['clearSource', ...args]),
    setVisible: (...args) => overlay.push(['setVisible', ...args]),
  };
  const renders = [];
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
      globe: { ellipsoid: GLOBE_ELLIPSOID },
      preRender: watch('scene.preRender'),
      postRender: watch('scene.postRender'),
    },
  };
  const clock = { t: NOW };
  const layer = createUp42ScenesLayer({
    source,
    overlayHost,
    ...(withNow ? { now: () => clock.t } : {}),
    ...(withRender ? { requestRender: (id) => renders.push(id) } : {}),
    ...(withDecode
      ? {
          decodeImage: (blob) => {
            calls.decode.push(blob);
            return decode(blob);
          },
        }
      : {}),
  });
  const chip = () => layer.getRowControls().chips[0];
  const chips = () => layer.getRowControls().chips;
  const chipIds = () => chips().map((item) => item.id);
  const byId = (id) => chips().find((item) => item.id === id);
  const info = () => layer.getRowControls().info;
  const list = () => layer.getRowControls().list;
  const entity = (id) => added[0]?.entities.getById(`up42-scenes:${id}`);
  const cards = () => overlay.filter(([name]) => name === 'setEntries');
  return {
    layer,
    viewer,
    calls,
    added,
    listeners,
    picks,
    clock,
    overlay,
    renders,
    chip,
    chips,
    chipIds,
    byId,
    info,
    list,
    entity,
    cards,
    dataSource: () => added[0],
    async ready() {
      layer.init(viewer);
      layer.enable(viewer);
      await layer.update();
    },
    async searched() {
      layer.init(viewer);
      layer.enable(viewer);
      await layer.update();
      await chip().onClick();
    },
  };
}
const colorOf = (graphics) => graphics.material.color.getValue();
const expectColor = (actual, css, alpha) =>
  assert.equal(
    Cesium.Color.equals(
      actual,
      Cesium.Color.fromCssColorString(css).withAlpha(alpha),
    ),
    true,
    `${actual} ${css} ${alpha}`,
  );

test('[up42-scenes-layer-001] describes the layer and has a method setParams', () => {
  const { layer } = harness();
  assert.equal(layer.id, 'up42-scenes');
  assert.equal(layer.name, 'UP42 Scenes');
  assert.equal(layer.icon, '🔭');
  assert.equal(layer.source, 'UP42');
  assert.equal(layer.updateInterval, 0);
  assert.equal(typeof layer.setParams, 'function');
  assert.deepEqual(layer.getStats(), {
    count: 0,
    lastUpdate: null,
    error: null,
  });
});

test('[up42-scenes-layer-001] refuses a source without getStatus, searchScenes or getThumbnail', () => {
  const host = { setEntries() {}, clearSource() {}, setVisible() {} };
  const all = { getStatus() {}, searchScenes() {}, getThumbnail() {} };
  for (const source of [
    undefined,
    null,
    {},
    { ...all, getStatus: undefined },
    { ...all, searchScenes: undefined },
    { ...all, getThumbnail: undefined },
  ])
    assert.throws(
      () => createUp42ScenesLayer({ source, overlayHost: host }),
      TypeError,
    );
  assert.doesNotThrow(() =>
    createUp42ScenesLayer({ source: all, overlayHost: host }),
  );
});

test('[up42-scenes-layer-001] refuses an overlay host without setEntries, clearSource or setVisible', () => {
  const source = { getStatus() {}, searchScenes() {}, getThumbnail() {} };
  const all = { setEntries() {}, clearSource() {}, setVisible() {} };
  for (const overlayHost of [
    undefined,
    null,
    {},
    { ...all, setEntries: undefined },
    { ...all, clearSource: undefined },
    { ...all, setVisible: undefined },
  ])
    assert.throws(
      () => createUp42ScenesLayer({ source, overlayHost }),
      TypeError,
    );
  assert.throws(() => createUp42ScenesLayer(), TypeError);
});

test('[up42-scenes-layer-001] refuses a second init', () => {
  const { layer, viewer } = harness();
  layer.init(viewer);
  assert.throws(() => layer.init(viewer), /already initialized/);
});

test('[up42-scenes-layer-002] asks only for the status and adds no listener to the camera or the scene', async () => {
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
  assert.equal(calls.searchScenes.length, 0);
  assert.equal(calls.getThumbnail.length, 0);
  assert.deepEqual(listeners, []);
});

test('[up42-scenes-layer-002] reads the status only while it is enabled', async () => {
  const { layer, viewer, calls } = harness();
  layer.init(viewer);
  assert.equal(await layer.update(), false);
  layer.enable(viewer);
  layer.disable(viewer);
  assert.equal(await layer.update(), false);
  assert.equal(calls.getStatus.length, 0);
  assert.equal(calls.searchScenes.length, 0);
});

test('[up42-scenes-layer-003] has one chip with an onClick function and no params, and one click gives one search', async () => {
  const h = harness();
  await h.ready();
  const { chips } = h.layer.getRowControls();
  assert.equal(chips.length, 1);
  assert.equal(chips[0].id, 'search');
  assert.equal(chips[0].label, 'Search scenes here');
  assert.equal(typeof chips[0].onClick, 'function');
  assert.equal('params' in chips[0], false);
  assert.equal(h.calls.searchScenes.length, 0);
  await chips[0].onClick();
  assert.equal(h.calls.searchScenes.length, 1);
});

test('[up42-scenes-layer-003] has no chip after disable, and an old onClick sends no search', async () => {
  const h = harness();
  await h.ready();
  const old = h.chip().onClick;
  h.layer.disable(h.viewer);
  assert.deepEqual(h.layer.getRowControls().chips, []);
  await old();
  assert.equal(h.calls.searchScenes.length, 0);
  const fresh = harness();
  fresh.layer.init(fresh.viewer);
  assert.deepEqual(fresh.layer.getRowControls().chips, []);
});

test('[up42-scenes-layer-004] sends one search for two presses and shows the search message while the search runs', async () => {
  const pending = deferred();
  const h = harness({ scenes: () => pending.promise });
  await h.ready();
  const first = h.chip().onClick();
  assert.equal(h.chip().label, 'Searching…');
  assert.equal(h.chip().disabled, true);
  const second = h.chip().onClick();
  await h.layer.update();
  assert.equal(h.chip().label, 'Searching…');
  assert.equal(h.chip().disabled, true);
  assert.equal(h.calls.searchScenes.length, 1);
  pending.resolve({ ok: true, answer: THREE });
  await first;
  await second;
  assert.equal(h.calls.searchScenes.length, 1);
  assert.equal(h.chip().label, 'Search scenes here');
  assert.equal(h.chip().disabled, false);
});

test('[up42-scenes-layer-005] sends no search after an error while the fake clock and the mocked timers move 10 minutes, and sends one search at the next press', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout', 'setInterval'] });
  const rejects = async () => {
    throw new Error('network');
  };
  for (const scenes of [
    rejects,
    async () => ({
      ok: false,
      status: 429,
      error: 'upstream_rate_limit',
      retryAfter: 30,
    }),
    async () => ({ ok: false, status: 504, error: 'search_timeout' }),
  ]) {
    const h = harness({ scenes });
    await h.searched();
    assert.equal(h.calls.searchScenes.length, 1);
    if (scenes === rejects)
      assert.equal(h.info(), 'The server did not answer.');
    for (let minute = 0; minute < 10; minute += 1) {
      h.clock.t += MINUTE;
      t.mock.timers.tick(MINUTE);
      await tick();
    }
    assert.equal(h.calls.searchScenes.length, 1);
    assert.equal(h.chip().disabled, false);
    assert.equal(h.chip().label, 'Search scenes here');
    await h.chip().onClick();
    assert.equal(h.calls.searchScenes.length, 2);
    for (let index = 0; index < 3; index += 1) await h.layer.update();
    h.layer.disable(h.viewer);
    h.layer.enable(h.viewer);
    await h.layer.update();
    await tick();
    assert.equal(h.calls.searchScenes.length, 2);
    assert.equal(h.chip().disabled, false);
    await h.chip().onClick();
    assert.equal(h.calls.searchScenes.length, 3);
  }
});

test('[up42-scenes-layer-006] disables the chip and shows the text for no credentials when the status has no credentials', async () => {
  const state = { configured: false };
  const h = harness({ status: async () => ({ ok: true, ...state }) });
  await h.ready();
  assert.equal(h.chip().disabled, true);
  assert.equal(h.info(), NO_KEY);
  await h.chip().onClick();
  assert.equal(h.calls.searchScenes.length, 0);
  state.configured = true;
  await h.layer.update();
  assert.equal(h.chip().disabled, false);
  assert.equal(h.info(), HINT);
});

test('[up42-scenes-layer-006] keeps the text for no credentials when a good answer arrives after a status with no credentials', async () => {
  const pending = deferred();
  const state = { configured: true };
  const h = harness({
    status: async () => ({ ok: true, ...state }),
    scenes: () => pending.promise,
  });
  await h.ready();
  const press = h.chip().onClick();
  state.configured = false;
  await h.layer.update();
  pending.resolve({ ok: true, answer: THREE });
  await press;
  assert.equal(h.info(), `${NO_KEY} · ${ANSWER_TEXT}`);
  assert.equal(h.chip().disabled, true);
});

test('[up42-scenes-layer-007] reports a status that fails and keeps the chip enabled', async () => {
  const rows = [
    [
      async () =>
        Promise.reject(
          Object.assign(new Error('Data source not configured: x'), {
            code: 'unavailable',
          }),
        ),
      'Data source not configured: up42-scenes',
    ],
    [async () => Promise.reject(new Error('')), STATUS_FAILED],
    [async () => Promise.reject('text'), STATUS_FAILED],
    [async () => ({ ok: false }), STATUS_FAILED],
    [async () => ({ ok: false, error: 'boom' }), STATUS_FAILED],
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

test('[up42-scenes-layer-007] enables the chip after a failed status that follows a status with no credentials', async () => {
  const queue = [{ ok: true, configured: false }, { ok: false }];
  const h = harness({ status: async () => queue.shift() });
  await h.ready();
  assert.equal(h.chip().disabled, true);
  await h.layer.update();
  assert.equal(h.chip().disabled, false);
  assert.equal(h.info(), STATUS_FAILED);
});

test('[up42-scenes-layer-007] removes the failed status after a good status or a good answer', async () => {
  const queue = [{ ok: false }, { ok: true, configured: true }];
  const h = harness({ status: async () => queue.shift() });
  await h.ready();
  assert.equal(h.layer.getStats().error, STATUS_FAILED);
  await h.layer.update();
  assert.equal(h.info(), HINT);
  assert.equal(h.layer.getStats().error, null);
  const second = harness({ status: async () => ({ ok: false }) });
  await second.searched();
  assert.equal(second.info(), ANSWER_TEXT);
  assert.equal(second.layer.getStats().error, null);
});

test('[up42-scenes-layer-007] shows the message and the error of a press that fails after a failed status', async () => {
  const h = harness({
    status: async () => ({ ok: false }),
    scenes: async () => ({ ok: false, status: 502, error: 'upstream_failed' }),
  });
  await h.searched();
  assert.equal(h.info(), 'UP42 did not answer correctly.');
  assert.equal(h.layer.getStats().error, 'UP42 did not answer correctly.');
});

test('[up42-scenes-layer-008] picks the middle of the canvas on the ellipsoid of the globe and sends its box', async () => {
  const h = harness({ pick: () => Cesium.Cartesian3.fromDegrees(10, 60) });
  await h.searched();
  assert.equal(h.picks.length, 1);
  const [position, ellipsoid] = h.picks[0];
  assert.equal(position.x, 400);
  assert.equal(position.y, 300);
  assert.equal(ellipsoid, GLOBE_ELLIPSOID);
  assert.notEqual(ellipsoid, Cesium.Ellipsoid.WGS84);
  assert.notEqual(ellipsoid, Cesium.Ellipsoid.default);
  assert.deepEqual(
    h.calls.searchScenes[0].box,
    [9.568326, 59.784163, 10.431674, 60.215837],
  );
});

test('[up42-scenes-layer-011] sends the window of the time of the clock at the press', async () => {
  const h = harness();
  await h.ready();
  h.clock.t = Date.parse('2026-03-01T00:00:00.000Z');
  await h.chip().onClick();
  const options = h.calls.searchScenes[0];
  assert.equal(options.start, '2025-11-30');
  assert.equal(options.end, '2026-03-01');
  assert.equal(options.signal instanceof AbortSignal, true);
  assert.deepEqual(Object.keys(options).sort(), [
    'box',
    'end',
    'signal',
    'start',
  ]);
});

test('[up42-scenes-layer-011] uses Date.now as the clock when the caller gives no option now', async (t) => {
  const time = Date.parse('2024-03-01T00:00:00.000Z');
  t.mock.method(Date, 'now', () => time);
  const h = harness({ withNow: false });
  await h.searched();
  assert.equal(h.calls.searchScenes[0].start, '2023-12-01');
  assert.equal(h.calls.searchScenes[0].end, '2024-03-01');
  assert.equal(h.layer.getStats().lastUpdate, time);
});

test('[up42-scenes-layer-009] sends no search for a view that has no box and names the reason', async () => {
  const SKY = 'Point the view at the ground and press again.';
  const rows = [
    [{ pick: () => undefined }, SKY],
    [{ pick: () => null }, SKY],
    [
      {
        pick: () => {
          throw new Error('pick');
        },
      },
      SKY,
    ],
    [{ canvas: { clientWidth: 0, clientHeight: 600 } }, SKY],
    [{ canvas: { clientWidth: 800 } }, SKY],
    [{ canvas: null }, SKY],
    [
      { pick: () => Cesium.Cartesian3.fromDegrees(0, 85) },
      'Move the view to a latitude from -80 to 80 degrees and press again.',
    ],
    [
      { pick: () => Cesium.Cartesian3.fromDegrees(179.9, 0) },
      'Move the view away from the 180th meridian and press again.',
    ],
  ];
  for (const [options, text] of rows) {
    const h = harness(options);
    await h.searched();
    assert.equal(h.calls.searchScenes.length, 0, text);
    assert.equal(h.info(), text);
    assert.equal(h.layer.getStats().error, text);
  }
});

test('[up42-scenes-layer-024] shows one polyline on the ground for each scene, with the style of a footprint that is not selected', async () => {
  const h = harness();
  await h.searched();
  const entities = h.dataSource().entities.values;
  assert.deepEqual(
    entities.map(({ id }) => id),
    ['up42-scenes:a', 'up42-scenes:b', 'up42-scenes:c'],
  );
  for (const item of THREE.scenes) {
    const found = h.entity(item.id);
    const positions = found.polyline.positions.getValue();
    assert.equal(positions.length, item.ring.length);
    item.ring.forEach(([lon, lat], index) =>
      assert.equal(
        Cesium.Cartesian3.equalsEpsilon(
          positions[index],
          Cesium.Cartesian3.fromDegrees(lon, lat),
          1e-6,
        ),
        true,
      ),
    );
    assert.equal(found.polyline.clampToGround.getValue(), true);
    assert.equal(found.polyline.width.getValue(), 2);
    expectColor(colorOf(found.polyline), '#38bdf8', 0.9);
    assert.equal(found.polygon, undefined);
  }
  assert.deepEqual(h.layer.getStats(), {
    count: 3,
    lastUpdate: NOW,
    error: null,
  });
  assert.equal(h.dataSource().show, true);
});

test('[up42-scenes-layer-024] gives the list of the answer and replaces the footprints and the list with a second answer', async () => {
  const queue = [
    { ok: true, answer: THREE },
    { ok: true, answer: answerOf([scene('z')]) },
  ];
  const h = harness({ scenes: async () => queue.shift() });
  await h.searched();
  assert.deepEqual(
    h.list().items.map(({ id }) => id),
    ['scene:a', 'scene:b', 'scene:c'],
  );
  assert.equal(h.list().ariaLabel, 'UP42 scenes');
  h.clock.t = NOW + MINUTE;
  await h.chip().onClick();
  assert.deepEqual(
    h.dataSource().entities.values.map(({ id }) => id),
    ['up42-scenes:z'],
  );
  assert.deepEqual(
    h.list().items.map(({ id }) => id),
    ['scene:z'],
  );
  assert.equal(h.layer.getStats().lastUpdate, NOW + MINUTE);
});

test('[up42-scenes-layer-024] calls requestRender with up42-scenes after each change of the entities', async () => {
  const h = harness();
  await h.ready();
  assert.deepEqual(h.renders, []);
  await h.chip().onClick();
  assert.deepEqual(h.renders, ['up42-scenes']);
  assert.equal(h.layer.setParams({ scene: 'a' }), true);
  assert.deepEqual(h.renders, ['up42-scenes', 'up42-scenes']);
  h.layer.disable(h.viewer);
  assert.deepEqual(h.renders, ['up42-scenes', 'up42-scenes', 'up42-scenes']);
  const quiet = harness({ withRender: false });
  await quiet.searched();
  assert.equal(quiet.dataSource().entities.values.length, 3);
});

test('[up42-scenes-layer-025] keeps the footprints, the list and the selection when a press fails', async () => {
  const queue = [
    { ok: true, answer: THREE },
    { ok: false, status: 429, error: 'rate_limited' },
  ];
  const h = harness({ scenes: async () => queue.shift() });
  await h.searched();
  assert.equal(h.layer.setParams({ scene: 'a' }), true);
  await tick();
  await tick();
  assert.equal(h.cards().length, 1);
  const clears = h.overlay.filter(([name]) => name === 'clearSource').length;
  await h.chip().onClick();
  assert.equal(h.dataSource().entities.values.length, 3);
  assert.equal(h.list().items.length, 3);
  assert.equal(h.list().items[0].active, true);
  assert.equal(
    h.info(),
    `Too many searches. Wait 60 seconds. · ${ANSWER_TEXT}`,
  );
  assert.deepEqual(h.layer.getStats(), {
    count: 3,
    lastUpdate: NOW,
    error: 'Too many searches. Wait 60 seconds.',
  });
  assert.equal(
    h.overlay.filter(([name]) => name === 'clearSource').length,
    clears,
  );
  assert.equal(h.cards().length, 1);
});

test('[up42-scenes-layer-025] keeps the footprints for a press with no box, and a good answer removes the message', async () => {
  const where = { at: Cesium.Cartesian3.fromDegrees(10, 60) };
  const queue = [
    { ok: true, answer: THREE },
    { ok: true, answer: answerOf([scene('z')]) },
  ];
  const h = harness({
    pick: () => where.at,
    scenes: async () => queue.shift(),
  });
  await h.searched();
  where.at = undefined;
  await h.chip().onClick();
  assert.equal(h.dataSource().entities.values.length, 3);
  assert.equal(
    h.info(),
    `Point the view at the ground and press again. · ${ANSWER_TEXT}`,
  );
  where.at = Cesium.Cartesian3.fromDegrees(10, 60);
  await h.chip().onClick();
  assert.equal(h.layer.getStats().error, null);
  assert.equal(
    h.info(),
    '1 scene · newest 2026-10-14 · searches today 3 of 20',
  );
});

test('[up42-scenes-layer-026] aborts each request on disable and ignores the answers that arrive afterwards', async () => {
  const search = deferred();
  const status = deferred();
  const picture = deferred();
  let statusCalls = 0;
  const h = harness({
    status: () => {
      statusCalls += 1;
      return statusCalls === 1
        ? Promise.resolve({ ok: true, configured: true })
        : status.promise;
    },
    scenes: async () => ({ ok: true, answer: THREE }),
    thumbnail: () => picture.promise,
  });
  await h.searched();
  assert.equal(h.layer.setParams({ scene: 'a' }), true);
  const second = harness({ scenes: () => search.promise });
  await second.ready();
  const press = second.chip().onClick();
  const update = h.layer.update();
  const signals = [h.calls.getStatus[1].signal, h.calls.getThumbnail[0].signal];
  h.layer.disable(h.viewer);
  second.layer.disable(second.viewer);
  assert.equal(
    signals.every((signal) => signal.aborted),
    true,
  );
  assert.equal(second.calls.searchScenes[0].signal.aborted, true);
  status.resolve({ ok: true, configured: false });
  picture.resolve({ ok: true, blob: BLOB });
  search.resolve({ ok: true, answer: THREE });
  assert.equal(await update, false);
  await press;
  await tick();
  for (const made of [h, second]) {
    assert.equal(made.dataSource().show, false);
    assert.equal(made.dataSource().entities.values.length, 0);
    assert.equal(made.layer.getStats().count, 0);
  }
  assert.equal(h.calls.decode.length, 0);
  assert.equal(h.cards().length, 0);
  assert.deepEqual(h.overlay.slice(-2), [
    ['clearSource', 'up42-scenes'],
    ['setVisible', 'up42-scenes', false],
  ]);
});

test('[up42-scenes-layer-026] shows the hint and no list on the next enable, and forgets the status', async () => {
  for (const status of [
    async () => ({ ok: true, configured: false }),
    async () => ({ ok: false }),
  ]) {
    const h = harness({ status });
    await h.ready();
    h.layer.disable(h.viewer);
    h.layer.enable(h.viewer);
    assert.equal(h.info(), HINT);
    assert.equal(h.list(), null);
    assert.equal(h.chip().disabled, false);
    assert.deepEqual(h.layer.getStats(), {
      count: 0,
      lastUpdate: null,
      error: null,
    });
    assert.deepEqual(h.overlay.at(-1), ['setVisible', 'up42-scenes', true]);
  }
  const shown = harness();
  await shown.searched();
  shown.layer.disable(shown.viewer);
  shown.layer.enable(shown.viewer);
  assert.equal(shown.list(), null);
  assert.equal(shown.info(), HINT);
});

test('[up42-scenes-layer-026] aborts the status request of the update before, and not a status request that ended', async () => {
  const first = deferred();
  const queue = [
    first.promise,
    Promise.resolve({ ok: true, configured: true }),
    Promise.resolve({ ok: true, configured: true }),
  ];
  const h = harness({ status: () => queue.shift() });
  h.layer.init(h.viewer);
  h.layer.enable(h.viewer);
  const older = h.layer.update();
  const newer = h.layer.update();
  assert.equal(h.calls.getStatus[0].signal.aborted, true);
  first.resolve({ ok: true, configured: false });
  assert.equal(await older, false);
  assert.equal(await newer, true);
  assert.equal(h.chip().disabled, false);
  const ended = h.calls.getStatus[1].signal;
  await h.layer.update();
  assert.equal(ended.aborted, false);
  const third = harness();
  await third.ready();
  const done = third.calls.getStatus[0].signal;
  third.layer.disable(third.viewer);
  assert.equal(done.aborted, false);
});

test('[up42-scenes-layer-027] releases everything on destroy and can initialize again', async () => {
  const picture = deferred();
  const h = harness({ thumbnail: () => picture.promise });
  await h.searched();
  assert.equal(h.layer.setParams({ scene: 'a' }), true);
  const thumbSignal = h.calls.getThumbnail[0].signal;
  const dataSource = h.dataSource();
  h.layer.destroy(h.viewer);
  assert.equal(thumbSignal.aborted, true);
  assert.equal(h.added.length, 0);
  assert.deepEqual(h.viewer.removed, [dataSource, true]);
  assert.deepEqual(h.layer.getStats(), {
    count: 0,
    lastUpdate: null,
    error: null,
  });
  assert.deepEqual(h.overlay.slice(-2), [
    ['clearSource', 'up42-scenes'],
    ['setVisible', 'up42-scenes', false],
  ]);
  const count = h.overlay.length;
  h.layer.destroy(h.viewer);
  assert.equal(h.overlay.length, count);
  picture.resolve({ ok: true, blob: BLOB });
  await tick();
  assert.equal(h.calls.decode.length, 0);
  h.layer.init(h.viewer);
  assert.equal(h.added.length, 1);
  const never = harness();
  assert.doesNotThrow(() => never.layer.destroy(never.viewer));
  assert.deepEqual(never.overlay, []);
});

test('[up42-scenes-layer-027] aborts a search and a status request in flight on destroy', async () => {
  const search = deferred();
  const status = deferred();
  const h = harness({ scenes: () => search.promise });
  await h.ready();
  const press = h.chip().onClick();
  const s = harness({ status: () => status.promise });
  s.layer.init(s.viewer);
  s.layer.enable(s.viewer);
  const update = s.layer.update();
  h.layer.destroy(h.viewer);
  s.layer.destroy(s.viewer);
  assert.equal(h.calls.searchScenes[0].signal.aborted, true);
  assert.equal(s.calls.getStatus[0].signal.aborted, true);
  search.resolve({ ok: true, answer: THREE });
  status.resolve({ ok: true, configured: true });
  await press;
  assert.equal(await update, false);
  assert.equal(h.layer.getStats().count, 0);
});

test('[up42-scenes-layer-028] calls the listener for a search, an update, a press with no box, a selection and the end of a thumbnail request', async () => {
  const where = { at: Cesium.Cartesian3.fromDegrees(10, 60) };
  const h = harness({ pick: () => where.at });
  let calls = 0;
  h.layer.setRowControlsListener(() => {
    calls += 1;
  });
  await h.ready();
  assert.equal(calls, 1);
  await h.chip().onClick();
  assert.equal(calls, 3);
  where.at = undefined;
  await h.chip().onClick();
  assert.equal(calls, 4);
  assert.equal(h.layer.setParams({ scene: 'c' }), true);
  assert.equal(calls, 5);
  assert.equal(h.layer.setParams({ scene: 'a' }), true);
  assert.equal(calls, 6);
  await tick();
  await tick();
  assert.equal(calls, 7);
  h.layer.setRowControlsListener(null);
  await h.chip().onClick();
  assert.equal(h.layer.setParams({ scene: null }), true);
  assert.equal(calls, 7);
});

test('[up42-scenes-layer-029] selects a scene and gives it the style of a selected footprint', async () => {
  const h = harness({
    scenes: async () => ({
      ok: true,
      answer: answerOf([
        scene('a', {
          ring: [
            [10, 60],
            [12, 61],
            [11, 63],
            [9, 62],
            [10, 60],
          ],
        }),
        scene('b', {
          ring: [
            [21, 31],
            [23, 32],
            [24, 35],
            [21, 31],
          ],
        }),
        scene('c', {
          ring: [
            [-15, 40],
            [-12, 41],
            [-13, 44],
            [-16, 43],
            [-15, 40],
          ],
          thumbnail: false,
        }),
      ]),
    }),
  });
  await h.searched();
  assert.equal(h.layer.setParams({ scene: 'b' }), true);
  const selected = h.entity('b');
  assert.equal(selected.polyline.width.getValue(), 3);
  expectColor(colorOf(selected.polyline), '#facc15', 1);
  expectColor(colorOf(selected.polygon), '#facc15', 0.25);
  const hierarchy = selected.polygon.hierarchy.getValue();
  const coordinates = (positions) =>
    positions.map((position) => {
      const point = Cesium.Cartographic.fromCartesian(position);
      return [
        Number(Cesium.Math.toDegrees(point.longitude).toFixed(8)),
        Number(Cesium.Math.toDegrees(point.latitude).toFixed(8)),
      ];
    });
  assert.deepEqual(coordinates(hierarchy.positions), [
    [21, 31],
    [23, 32],
    [24, 35],
    [21, 31],
  ]);
  assert.deepEqual(coordinates(selected.polyline.positions.getValue()), [
    [21, 31],
    [23, 32],
    [24, 35],
    [21, 31],
  ]);
  assert.deepEqual(coordinates(h.entity('a').polyline.positions.getValue()), [
    [10, 60],
    [12, 61],
    [11, 63],
    [9, 62],
    [10, 60],
  ]);
  assert.deepEqual(coordinates(h.entity('c').polyline.positions.getValue()), [
    [-15, 40],
    [-12, 41],
    [-13, 44],
    [-16, 43],
    [-15, 40],
  ]);
  for (const id of ['a', 'c']) {
    const other = h.entity(id);
    assert.equal(other.polyline.width.getValue(), 2);
    expectColor(colorOf(other.polyline), '#38bdf8', 0.9);
    assert.equal(other.polygon, undefined);
  }
  assert.deepEqual(
    h.list().items.map(({ active, params }) => [active, params.scene]),
    [
      [false, 'a'],
      [true, null],
      [false, 'c'],
    ],
  );
});

test('[up42-scenes-layer-029] removes the selection with scene null and sends no new request for the selected id', async () => {
  const h = harness();
  await h.searched();
  assert.equal(h.layer.setParams({ scene: 'a' }), true);
  assert.equal(h.layer.setParams({ scene: 'a' }), true);
  assert.equal(h.calls.getThumbnail.length, 1);
  assert.equal(h.layer.setParams({ scene: null }), true);
  assert.equal(h.entity('a').polygon, undefined);
  assert.equal(
    h.list().items.every(({ active }) => active === false),
    true,
  );
  assert.equal(h.layer.setParams({ scene: null }), true);
  assert.equal(h.calls.getThumbnail.length, 1);
  assert.equal(h.layer.setParams({ scene: 'c' }), true);
  assert.equal(
    h.info(),
    `${ANSWER_TEXT} · UP42 has no thumbnail for this scene.`,
  );
  assert.equal(h.layer.setParams({ scene: null }), true);
  assert.equal(h.info(), ANSWER_TEXT);
});

test('[up42-scenes-layer-029] refuses each other parameter and changes nothing', async () => {
  const h = harness();
  await h.searched();
  assert.equal(h.layer.setParams({ scene: 'a' }), true);
  const before = JSON.stringify(h.list());
  const thumbnails = h.calls.getThumbnail.length;
  for (const params of [
    { scene: 'zzz' },
    { scene: 7 },
    { scene: undefined },
    { scene: ['a'] },
    { scene: 'b', other: 1 },
    { other: 'b' },
    {},
    null,
    undefined,
    'b',
    ['b'],
  ])
    assert.equal(h.layer.setParams(params), false, JSON.stringify(params));
  assert.equal(JSON.stringify(h.list()), before);
  assert.equal(h.calls.getThumbnail.length, thumbnails);
  const off = harness();
  await off.searched();
  off.layer.disable(off.viewer);
  assert.equal(off.layer.setParams({ scene: 'a' }), false);
  assert.equal(off.layer.setParams({ scene: null }), false);
  const empty = harness();
  await empty.ready();
  assert.equal(empty.layer.setParams({ scene: 'a' }), false);
  assert.equal(empty.layer.setParams({ scene: null }), true);
});

test('[up42-scenes-layer-029] removes the selection with a new good answer', async () => {
  const h = harness();
  await h.searched();
  assert.equal(h.layer.setParams({ scene: 'a' }), true);
  await h.chip().onClick();
  assert.equal(h.entity('a').polygon, undefined);
  assert.equal(
    h.list().items.every(({ active }) => active === false),
    true,
  );
});

test('[up42-scenes-layer-030] gets the thumbnail of the selected scene and shows it as one card', async () => {
  const picture = deferred();
  const image = fakeImage(512, 256);
  const h = harness({
    thumbnail: () => picture.promise,
    decode: async () => image,
  });
  await h.searched();
  assert.equal(h.layer.setParams({ scene: 'b' }), true);
  assert.equal(h.calls.getThumbnail.length, 1);
  assert.equal(h.calls.getThumbnail[0].id, 'b');
  assert.equal(h.calls.getThumbnail[0].signal instanceof AbortSignal, true);
  assert.equal(h.info(), `${ANSWER_TEXT} · ${LOADING}`);
  picture.resolve({ ok: true, blob: BLOB });
  await tick();
  await tick();
  assert.deepEqual(h.calls.decode, [BLOB]);
  const cards = h.cards();
  assert.equal(cards.length, 1);
  const [, sourceId, entries] = cards[0];
  assert.equal(sourceId, 'up42-scenes');
  assert.equal(entries.length, 1);
  const [entry] = entries;
  assert.equal(entry.id, 'selected');
  assert.equal(entry.variant, 'thumbnail');
  assert.equal(entry.image, image);
  assert.equal(entry.requireImage, true);
  assert.equal(entry.thumbnailWidth, 192);
  assert.equal(entry.thumbnailHeight, 96);
  assert.equal(entry.title, '2026-10-12');
  assert.equal(
    Cesium.Cartesian3.equalsEpsilon(
      entry.position,
      Cesium.Cartesian3.fromDegrees(11, 61),
      1e-6,
    ),
    true,
  );
  assert.equal(h.info(), ANSWER_TEXT);
  assert.equal(image.closed, 0);
});

test('[up42-scenes-layer-030] writes the date and the provider as the title of the card', async () => {
  const h = harness();
  await h.searched();
  assert.equal(h.layer.setParams({ scene: 'a' }), true);
  await tick();
  await tick();
  const [, , [entry]] = h.cards()[0];
  assert.equal(entry.title, '2026-10-14 Satellogic');
  assert.equal(entry.thumbnailWidth, 192);
  assert.equal(entry.thumbnailHeight, 96);
});

test('[up42-scenes-layer-030] sends no thumbnail request for a scene that has no thumbnail', async () => {
  const h = harness();
  await h.searched();
  assert.equal(h.layer.setParams({ scene: 'c' }), true);
  await tick();
  assert.equal(h.calls.getThumbnail.length, 0);
  assert.equal(
    h.info(),
    `${ANSWER_TEXT} · UP42 has no thumbnail for this scene.`,
  );
  assert.equal(h.cards().length, 0);
});

test('[up42-scenes-layer-030] decodes the blob with createImageBitmap of the page when the caller gives no decodeImage function', async (t) => {
  const image = fakeImage(100, 100);
  const blobs = [];
  const before = Object.getOwnPropertyDescriptor(
    globalThis,
    'createImageBitmap',
  );
  t.after(() => {
    if (before) Object.defineProperty(globalThis, 'createImageBitmap', before);
    else delete globalThis.createImageBitmap;
  });
  globalThis.createImageBitmap = async (blob) => {
    blobs.push(blob);
    return image;
  };
  const h = harness({ withDecode: false });
  await h.searched();
  assert.equal(h.layer.setParams({ scene: 'a' }), true);
  await tick();
  await tick();
  assert.deepEqual(blobs, [BLOB]);
  assert.equal(h.cards()[0][2][0].image, image);
});

test('[up42-scenes-layer-031] shows the failure of a thumbnail and no card', async () => {
  const rows = [
    [
      {
        thumbnail: async () => ({
          ok: false,
          status: 404,
          error: 'thumbnails_off',
        }),
      },
      'Thumbnails are off. Set UP42_THUMBNAILS=true in .env and restart the app.',
    ],
    [
      {
        thumbnail: async () => ({
          ok: false,
          status: 404,
          error: 'unknown_scene',
        }),
      },
      'The server does not keep this scene now. Search again.',
    ],
    [
      {
        thumbnail: async () => {
          throw new TypeError('fetch failed');
        },
      },
      'The server did not answer.',
    ],
    [
      {
        decode: async () => {
          throw new Error('decode');
        },
      },
      'The layer cannot show the thumbnail.',
    ],
  ];
  for (const [options, text] of rows) {
    const h = harness(options);
    await h.searched();
    assert.equal(h.layer.setParams({ scene: 'a' }), true);
    await tick();
    await tick();
    assert.equal(h.cards().length, 0, text);
    assert.equal(h.info(), `${ANSWER_TEXT} · ${text}`);
    assert.equal(h.layer.getStats().error, null);
    await tick();
    assert.equal(h.calls.getThumbnail.length, 1);
  }
});

test('[up42-scenes-layer-031] closes an image whose size gives no card and names it bad_image', async () => {
  for (const image of [fakeImage(0, 100), fakeImage(100, NaN)]) {
    const h = harness({ decode: async () => image });
    await h.searched();
    assert.equal(h.layer.setParams({ scene: 'a' }), true);
    await tick();
    await tick();
    assert.equal(h.cards().length, 0);
    assert.equal(image.closed, 1);
    assert.equal(
      h.info(),
      `${ANSWER_TEXT} · The layer cannot show the thumbnail.`,
    );
  }
});

test('[up42-scenes-layer-031] keeps the error of the stats and sends a new request only on the next selection', async () => {
  const queue = [
    { ok: true, answer: THREE },
    { ok: false, status: 429, error: 'rate_limited' },
  ];
  const h = harness({
    scenes: async () => queue.shift(),
    thumbnail: async () => ({
      ok: false,
      status: 502,
      error: 'upstream_failed',
    }),
  });
  await h.searched();
  await h.chip().onClick();
  const error = 'Too many searches. Wait 60 seconds.';
  assert.equal(h.layer.getStats().error, error);
  assert.equal(h.layer.setParams({ scene: 'a' }), true);
  await tick();
  await tick();
  assert.equal(h.layer.getStats().error, error);
  assert.equal(
    h.info(),
    `${error} · ${ANSWER_TEXT} · UP42 did not give the thumbnail.`,
  );
  assert.equal(h.calls.getThumbnail.length, 1);
  h.clock.t += 10 * MINUTE;
  await h.layer.update();
  await tick();
  assert.equal(h.calls.getThumbnail.length, 1);
  assert.equal(h.layer.setParams({ scene: null }), true);
  assert.equal(h.layer.setParams({ scene: 'a' }), true);
  assert.equal(h.calls.getThumbnail.length, 2);
});

test('[up42-scenes-layer-032] aborts the request of the first scene and closes the image that it gives', async () => {
  const first = deferred();
  const queue = [first.promise, Promise.resolve({ ok: true, blob: BLOB })];
  const images = [fakeImage(), fakeImage()];
  const h = harness({
    thumbnail: () => queue.shift(),
    decode: async () => images.shift(),
  });
  const kept = [...images];
  await h.searched();
  assert.equal(h.layer.setParams({ scene: 'a' }), true);
  const signal = h.calls.getThumbnail[0].signal;
  assert.equal(h.layer.setParams({ scene: 'b' }), true);
  assert.equal(signal.aborted, true);
  await tick();
  await tick();
  first.resolve({ ok: true, blob: BLOB });
  await tick();
  await tick();
  const cards = h.cards();
  assert.equal(cards.length, 1);
  assert.equal(cards[0][2][0].title, '2026-10-12');
  assert.equal(cards[0][2][0].image, kept[0]);
  assert.equal(h.calls.decode.length, 1);
  assert.equal(kept[0].closed, 0);
  assert.equal(h.info(), ANSWER_TEXT);
});

test('[up42-scenes-layer-032] closes an image that arrives after the layer aborts the request of that image', async () => {
  const decoding = deferred();
  const image = fakeImage();
  const h = harness({ decode: () => decoding.promise });
  await h.searched();
  assert.equal(h.layer.setParams({ scene: 'a' }), true);
  await tick();
  assert.equal(h.calls.decode.length, 1);
  assert.equal(h.layer.setParams({ scene: null }), true);
  decoding.resolve(image);
  await tick();
  await tick();
  assert.equal(image.closed, 1);
  assert.equal(h.cards().length, 0);
  assert.equal(h.info(), ANSWER_TEXT);
});

test('[up42-scenes-layer-032] replaces the card and closes the old image once', async () => {
  const images = [fakeImage(), fakeImage()];
  const kept = [...images];
  const h = harness({ decode: async () => images.shift() });
  await h.searched();
  assert.equal(h.layer.setParams({ scene: 'a' }), true);
  await tick();
  await tick();
  const clears = h.overlay.filter(([name]) => name === 'clearSource').length;
  assert.equal(h.layer.setParams({ scene: 'b' }), true);
  assert.equal(kept[0].closed, 1);
  assert.deepEqual(h.overlay.at(-1), ['clearSource', 'up42-scenes']);
  assert.equal(
    h.overlay.filter(([name]) => name === 'clearSource').length,
    clears + 1,
  );
  assert.equal(h.cards().length, 1);
  await tick();
  await tick();
  assert.equal(h.cards().length, 2);
  assert.equal(h.cards()[1][2][0].image, kept[1]);
  assert.equal(kept[0].closed, 1);
  assert.equal(kept[1].closed, 0);
});

test('[up42-scenes-layer-032] closes the image of the card once on scene null, a new answer, disable and destroy', async () => {
  const ends = [
    (h) => assert.equal(h.layer.setParams({ scene: null }), true),
    (h) => h.chip().onClick(),
    (h) => h.layer.disable(h.viewer),
    (h) => h.layer.destroy(h.viewer),
  ];
  for (const end of ends) {
    const image = fakeImage();
    const h = harness({ decode: async () => image });
    await h.searched();
    assert.equal(h.layer.setParams({ scene: 'a' }), true);
    await tick();
    await tick();
    assert.equal(h.cards().length, 1);
    const clears = h.overlay.filter(([name]) => name === 'clearSource').length;
    await end(h);
    assert.equal(image.closed, 1);
    assert.equal(
      h.overlay.filter(([name]) => name === 'clearSource').length,
      clears + 1,
    );
    assert.deepEqual(
      h.overlay.filter(([name]) => name === 'clearSource').at(-1),
      ['clearSource', 'up42-scenes'],
    );
    if (end !== ends[3]) {
      h.layer.destroy(h.viewer);
      assert.equal(image.closed, 1);
    }
  }
});

test('[up42-scenes-layer-032] aborts a thumbnail request that runs on scene null and on a new good answer, and closes a late image', async () => {
  for (const end of [
    (h) => assert.equal(h.layer.setParams({ scene: null }), true),
    (h) => h.chip().onClick(),
  ]) {
    const decoding = deferred();
    const image = fakeImage();
    const picture = deferred();
    const h = harness({
      thumbnail: () => picture.promise,
      decode: () => decoding.promise,
    });
    await h.searched();
    assert.equal(h.layer.setParams({ scene: 'a' }), true);
    const signal = h.calls.getThumbnail[0].signal;
    await end(h);
    assert.equal(signal.aborted, true);
    picture.resolve({ ok: true, blob: BLOB });
    await tick();
    assert.equal(h.calls.decode.length, 0);
    const second = harness({ decode: () => decoding.promise });
    await second.searched();
    assert.equal(second.layer.setParams({ scene: 'a' }), true);
    await tick();
    assert.equal(second.calls.decode.length, 1);
    await end(second);
    decoding.resolve(image);
    await tick();
    await tick();
    assert.equal(image.closed, 1);
    assert.equal(second.cards().length, 0);
  }
});

test('[up42-scenes-layer-040] shows local texts for source errors and uses no object URL', async (t) => {
  const h = harness({
    status: async () => {
      throw new Error('SECRET_UPSTREAM');
    },
  });
  await h.ready();
  assert.equal(
    h.info(),
    'The server did not give the status of the credentials.',
  );
  assert.equal(
    h.layer.getStats().error,
    'The server did not give the status of the credentials.',
  );
  let urls = 0;
  t.mock.method(URL, 'createObjectURL', () => {
    urls++;
    throw new Error('object URL');
  });
  await h.chip().onClick();
  assert.equal(h.layer.setParams({ scene: 'a' }), true);
  await tick();
  await tick();
  assert.equal(h.cards().length, 1);
  assert.equal(urls, 0);
});

test('[up42-scenes-layer-040] builds the local source error without source text', async () => {
  for (const status of [
    async () => ({
      ok: false,
      error: 'Data source not configured: SECRET_UPSTREAM',
    }),
    async () => {
      throw Object.assign(new Error('SECRET_UPSTREAM'), {
        code: 'unavailable',
      });
    },
  ]) {
    const h = harness({ status });
    await h.ready();
    assert.equal(
      h.info(),
      'The server did not give the status of the credentials.',
    );
    assert.equal(
      JSON.stringify(h.layer.getStats()).includes('SECRET_UPSTREAM'),
      false,
    );
  }
});

test('[up42-quote-panel-003] shows the quote chip only for a source with both methods, after an answer and while enabled', async () => {
  const plain = harness();
  await plain.searched();
  assert.deepEqual(plain.chipIds(), ['search', 'images']);

  const h = harness({ withQuotes: true });
  h.layer.init(h.viewer);
  assert.deepEqual(h.chipIds(), []);
  h.layer.enable(h.viewer);
  await h.layer.update();
  assert.deepEqual(h.chipIds(), ['search']);
  await h.chip().onClick();
  assert.deepEqual(h.chipIds(), ['search', 'images', 'quote']);
  assert.equal(h.byId('quote').label, 'Quote tasking here');
  assert.equal(h.byId('quote').disabled, false);
  h.layer.disable();
  assert.deepEqual(h.chipIds(), []);
});

test('[up42-quote-panel-003] disables the quote chip while the status says that the server has no credentials', async () => {
  let configured = true;
  const h = harness({
    withQuotes: true,
    status: async () => ({ ok: true, configured }),
  });
  await h.searched();
  configured = false;
  await h.layer.update();
  assert.equal(h.byId('quote').disabled, true);
  await h.byId('quote').onClick();
  assert.equal(h.calls.getProducts.length, 0);
});

test('[up42-quote-panel-004] reads the products once and shows a chip for each of the first six', async () => {
  const wait = deferred();
  const h = harness({ withQuotes: true, products: () => wait.promise });
  await h.searched();
  const press = h.byId('quote').onClick();
  assert.equal(h.byId('quote').disabled, true);
  assert.equal(h.info().startsWith('Reading the product list…'), true);
  await h.byId('quote').onClick();
  wait.resolve({ ok: true, products: PRODUCTS });
  await press;
  assert.equal(h.calls.getProducts.length, 1);
  assert.equal(h.calls.getProducts[0].signal instanceof AbortSignal, true);
  assert.equal(h.calls.getQuote.length, 0);
  assert.deepEqual(h.chipIds().slice(2), [
    'quote-product-0',
    'quote-product-1',
    'quote-product-2',
    'quote-product-3',
    'quote-product-4',
    'quote-product-5',
    'quote-cancel',
  ]);
  assert.deepEqual(
    h
      .chips()
      .slice(2, 8)
      .map((item) => item.label),
    [
      'Product 0',
      'Product 1',
      'Product 2',
      'Product 3',
      'Product 4',
      'Product 5',
    ],
  );
  assert.equal(h.byId('quote-cancel').label, 'Cancel');
  assert.equal(h.info().startsWith('Choose a product.'), true);
});

test('[up42-quote-panel-004] shows the failure text and the quote chip again when the products fail', async () => {
  for (const [products, text] of [
    [
      async () => ({ ok: false, status: 503, error: 'no_credentials' }),
      'No UP42 credentials. Set UP42_USERNAME and UP42_PASSWORD in .env and restart the app.',
    ],
    [
      async () => ({ ok: true, products: [] }),
      'UP42 lists no tasking product.',
    ],
    [
      async () => {
        throw new Error('network');
      },
      'The server did not answer.',
    ],
  ]) {
    const h = harness({ withQuotes: true, products });
    await h.searched();
    await h.byId('quote').onClick();
    assert.equal(h.info().startsWith(text), true);
    assert.deepEqual(h.chipIds(), ['search', 'images', 'quote']);
    assert.equal(h.byId('quote').disabled, false);
  }
});

test('[up42-quote-panel-004] stops the product call after the caller disables the layer', async () => {
  const wait = deferred();
  const h = harness({ withQuotes: true, products: () => wait.promise });
  await h.searched();
  const press = h.byId('quote').onClick();
  const { signal } = h.calls.getProducts[0];
  h.layer.disable();
  assert.equal(signal.aborted, true);
  wait.resolve({ ok: true, products: PRODUCTS });
  await press;
  h.layer.enable(h.viewer);
  assert.deepEqual(h.chipIds(), ['search']);
});

test('[up42-quote-panel-005] asks the person to confirm and sends no quote before the person confirms', async () => {
  const h = harness({ withQuotes: true });
  await h.searched();
  await h.byId('quote').onClick();
  h.byId('quote-product-1').onClick();
  assert.equal(
    h
      .info()
      .startsWith(
        'Quote Product 1 for this view? This gives no order and spends no credits.',
      ),
    true,
  );
  assert.deepEqual(h.chipIds().slice(2), ['quote-confirm', 'quote-cancel']);
  assert.equal(h.byId('quote-confirm').label, 'Confirm quote');
  assert.equal(h.calls.getQuote.length, 0);
  h.byId('quote-cancel').onClick();
  assert.deepEqual(h.chipIds(), ['search', 'images', 'quote']);
  assert.equal(h.info().startsWith('Quote Product 1'), false);
  assert.equal(h.calls.getQuote.length, 0);
});

test('[up42-quote-panel-005] ignores a stale chip press', async () => {
  const h = harness({ withQuotes: true });
  await h.searched();
  await h.byId('quote').onClick();
  const product = h.byId('quote-product-0');
  const cancel = h.byId('quote-cancel');
  cancel.onClick();
  product.onClick();
  cancel.onClick();
  await h.byId('quote').onClick();
  h.byId('quote-product-0').onClick();
  const confirm = h.byId('quote-confirm');
  h.byId('quote-cancel').onClick();
  await confirm.onClick();
  assert.equal(h.calls.getQuote.length, 0);
  assert.deepEqual(h.chipIds(), ['search', 'images', 'quote']);
});

test('[up42-quote-panel-006] sends one quote with the product and the box of the view and shows its facts', async () => {
  const wait = deferred();
  const h = harness({
    withQuotes: true,
    pick: () => Cesium.Cartesian3.fromDegrees(10, 60),
    quote: () => wait.promise,
  });
  await h.searched();
  await h.byId('quote').onClick();
  h.byId('quote-product-2').onClick();
  const confirm = h.byId('quote-confirm');
  const press = confirm.onClick();
  await confirm.onClick();
  assert.equal(h.calls.getQuote.length, 1);
  const options = h.calls.getQuote[0];
  assert.deepEqual(Object.keys(options).sort(), [
    'box',
    'dataProduct',
    'signal',
  ]);
  assert.equal(options.dataProduct, '00000000-0000-4000-8000-000000000002');
  assert.deepEqual(options.box, BOX);
  assert.equal(h.info().startsWith('Asking for a quote…'), true);
  assert.equal(h.byId('quote').disabled, true);
  wait.resolve({ ok: true, ...QUOTE });
  await press;
  assert.equal(h.info().startsWith(QUOTE_TEXT), true);
  assert.deepEqual(h.chipIds(), ['search', 'images', 'quote']);
  assert.equal(h.byId('quote').disabled, false);
});

test('[up42-quote-panel-006] shows the failure text of a quote that fails or rejects', async () => {
  for (const [quote, text] of [
    [
      async () => ({ ok: false, status: 429, error: 'budget' }),
      'No more quotes today.',
    ],
    [
      async () => {
        throw new Error('network');
      },
      'The server did not answer.',
    ],
  ]) {
    const h = harness({ withQuotes: true, quote });
    await h.searched();
    await h.byId('quote').onClick();
    h.byId('quote-product-0').onClick();
    await h.byId('quote-confirm').onClick();
    assert.equal(h.info().startsWith(text), true);
    assert.deepEqual(h.chipIds(), ['search', 'images', 'quote']);
  }
});

test('[up42-quote-panel-006] stops the quote after the caller disables the layer or starts a new search, and shows no result', async () => {
  for (const stop of ['disable', 'search']) {
    const wait = deferred();
    const h = harness({ withQuotes: true, quote: () => wait.promise });
    await h.searched();
    await h.byId('quote').onClick();
    h.byId('quote-product-0').onClick();
    const press = h.byId('quote-confirm').onClick();
    const { signal } = h.calls.getQuote[0];
    if (stop === 'disable') {
      h.layer.disable();
      h.layer.enable(h.viewer);
      await h.layer.update();
    } else {
      await h.chip().onClick();
    }
    assert.equal(signal.aborted, true);
    wait.resolve({ ok: true, ...QUOTE });
    await press;
    assert.equal(h.info().includes('No order was made'), false);
    assert.equal(h.info().startsWith('Asking'), false);
  }
});

test('[up42-quote-panel-006] gives the reason of a view that has no box and sends no quote', async () => {
  let ground = true;
  const h = harness({
    withQuotes: true,
    pick: () => (ground ? Cesium.Cartesian3.fromDegrees(10, 60) : undefined),
  });
  await h.searched();
  await h.byId('quote').onClick();
  h.byId('quote-product-0').onClick();
  ground = false;
  await h.byId('quote-confirm').onClick();
  assert.equal(
    h.info().startsWith('Point the view at the ground and press again.'),
    true,
  );
  assert.equal(h.calls.getQuote.length, 0);
  assert.deepEqual(h.chipIds().slice(2), ['quote-confirm', 'quote-cancel']);
});

test('[up42-quote-panel-009] calls only the two quote routes and keeps the word order in the text of the flow', async () => {
  const { createUp42Source } = await import('./source.js');
  const urls = [];
  const real = createUp42Source({
    fetchImpl: async (url, init = {}) => {
      urls.push(`${init.method ?? 'GET'} ${url}`);
      return new Response(
        JSON.stringify(
          url === '/api/up42/quote/products' ? { products: PRODUCTS } : QUOTE,
        ),
      );
    },
  });
  const layer = createUp42ScenesLayer({
    source: {
      getStatus: async () => ({ ok: true, configured: true }),
      searchScenes: async () => ({ ok: true, answer: THREE }),
      getThumbnail: async () => ({ ok: false, status: 404, error: 'x' }),
      getProducts: real.getProducts,
      getQuote: real.getQuote,
    },
    overlayHost: { setEntries() {}, clearSource() {}, setVisible() {} },
  });
  layer.init(harness().viewer);
  layer.enable();
  await layer.update();
  const texts = [];
  const grab = (id) => {
    const { chips, info } = layer.getRowControls();
    texts.push(info, ...chips.map((chip) => chip.label));
    return chips.find((chip) => chip.id === id);
  };
  await grab('search').onClick();
  await grab('quote').onClick();
  grab('quote-product-0').onClick();
  await grab('quote-confirm').onClick();
  grab('quote');
  assert.deepEqual(urls, [
    'GET /api/up42/quote/products',
    'POST /api/up42/quote',
  ]);
  assert.equal(
    texts.some((text) => text.includes('No order was made')),
    true,
  );
  for (const text of texts)
    assert.equal(
      text
        .replaceAll('no order', '')
        .replaceAll('No order', '')
        .match(/order/i),
      null,
    );
});

test('[up42-quote-panel-005] shows the confirm text after a failed search that follows a good search', async () => {
  let count = 0;
  const h = harness({
    withQuotes: true,
    scenes: async () =>
      ++count === 1
        ? { ok: true, answer: THREE }
        : { ok: false, status: 502, error: 'upstream_failed' },
  });
  await h.searched();
  await h.chip().onClick();
  assert.equal(h.info().startsWith('UP42 did not answer correctly.'), true);
  await h.byId('quote').onClick();
  h.byId('quote-product-0').onClick();
  assert.equal(
    h
      .info()
      .startsWith(
        'Quote Product 0 for this view? This gives no order and spends no credits.',
      ),
    true,
  );
});

test('[up42-quote-panel-006] stops the quote when the layer is destroyed and shows no late result', async () => {
  const wait = deferred();
  const h = harness({ withQuotes: true, quote: () => wait.promise });
  await h.searched();
  await h.byId('quote').onClick();
  h.byId('quote-product-0').onClick();
  const press = h.byId('quote-confirm').onClick();
  const { signal } = h.calls.getQuote[0];
  h.layer.destroy(h.viewer);
  assert.equal(signal.aborted, true);
  wait.resolve({ ok: true, ...QUOTE });
  await press;
  assert.equal(h.info().includes('No order was made'), false);
});
