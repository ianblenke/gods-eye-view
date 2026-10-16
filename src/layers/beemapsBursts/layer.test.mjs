import assert from 'node:assert/strict';
import test from 'node:test';
import * as Cesium from 'cesium';
import { createBeemapsBurstsLayer } from './index.js';

const NOW = Date.UTC(2026, 9, 16, 12, 0, 0);
const QUOTE_ID = 'a1b2c3d4e5f60718293a4b5c6d7e8f90';
const SECOND_ID = 'b2c3d4e5f60718293a4b5c6d7e8f90a1';
const VIEW_BOX = [9.987014, 59.991007, 10.022986, 60.008993];
const QUOTE = {
  quoteId: QUOTE_ID,
  expiresInSeconds: 120,
  bbox: VIEW_BOX,
  areaKm2: 4,
  credits: 125,
  budget: { used: 0, limit: 625, remaining: 625 },
};
const BURST_ID = '6501aa11bb22cc33dd44ee55';
const CREATED = {
  outcome: 'created',
  replayed: false,
  burst: {
    id: BURST_ID,
    status: 'active',
    validUntil: '2026-10-22T12:00:00.000Z',
    credits: 125,
  },
  creditsRemaining: 875,
};
const listed = (id, extra = {}) => ({
  id,
  status: 'active',
  isHit: false,
  credits: 125,
  bbox: [1, 2, 3, 4],
  ...extra,
});
const HINT =
  'A quote shows the price of a burst in 4 km² at the view centre. A quote costs nothing. A confirm request takes credits and cannot be undone.';
const QUOTE_TEXT =
  'Quote: 125 credits for 4 km² · credits used today 0 of 625 · valid for 120 seconds';
const UNKNOWN_TEXT =
  'It is possible that Bee Maps made a burst and took credits. Do not press Confirm again. Press Check my bursts.';
const ENDED_TEXT = 'The quote ended. Press Quote burst here again.';
const key = (n) => n.toString(16).padStart(32, '0');
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

function harness({
  status = async () => ({ ok: true, enabled: true, configured: true }),
  quote = async () => ({ ok: true, quote: QUOTE }),
  confirm = async () => CREATED,
  list = async () => ({ ok: true, bursts: [], total: 0, cached: false }),
  pick = () => Cesium.Cartesian3.fromDegrees(10.0031, 59.9976),
  canvas = { clientWidth: 800, clientHeight: 600 },
} = {}) {
  const calls = { getStatus: [], quote: [], confirm: [], list: [] };
  const source = {
    getStatus: (options) => {
      calls.getStatus.push(options);
      return status(options);
    },
    quote: (options) => {
      calls.quote.push(options);
      return quote(options);
    },
    confirm: (options) => {
      calls.confirm.push(options);
      return confirm(options);
    },
    list: (options) => {
      calls.list.push(options);
      return list(options);
    },
  };
  const added = [];
  const picks = [];
  const listeners = [];
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
        viewer.removals = (viewer.removals ?? 0) + 1;
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
  const timers = [];
  const cleared = [];
  const keys = [];
  let notices = 0;
  const layer = createBeemapsBurstsLayer({
    source,
    now: () => clock.t,
    makeKey: () => {
      keys.push(key(keys.length + 1));
      return keys[keys.length - 1];
    },
    setTimer: (fn, ms) => {
      timers.push({ fn, ms, done: false });
      return timers.length;
    },
    clearTimer: (id) => cleared.push(id),
  });
  layer.setRowControlsListener(() => {
    notices += 1;
  });
  const chips = () => layer.getRowControls().chips;
  const chip = (id) => chips().find((entry) => entry.id === id);
  const confirmChip = () =>
    chips().find((entry) => entry.id.startsWith('confirm:'));
  return {
    layer,
    viewer,
    calls,
    added,
    picks,
    listeners,
    clock,
    timers,
    cleared,
    keys,
    notices: () => notices,
    chips,
    chip,
    confirmChip,
    info: () => layer.getRowControls().info,
    dataSource: () => added[0],
    entityIds: () => added[0].entities.values.map((entity) => entity.id),
    async ready() {
      layer.init(viewer);
      layer.enable(viewer);
      await layer.update();
    },
    /** Move the clock past the wait of the Confirm chip and run its timer. */
    unlock() {
      clock.t += 1000;
      const timer = [...timers]
        .reverse()
        .find((entry) => entry.ms === 1000 && !entry.done);
      timer.done = true;
      timer.fn();
    },
    async quoted({ unlocked = true } = {}) {
      await this.ready();
      await chip('quote').onClick();
      if (unlocked) this.unlock();
    },
  };
}

test('[beemaps-bursts-001] describes the layer and has no method setParams', () => {
  const { layer } = harness();
  assert.equal(layer.id, 'beemaps-bursts');
  assert.equal(layer.name, 'Bee Maps Bursts');
  assert.equal(layer.icon, '🐝');
  assert.equal(layer.source, 'Bee Maps');
  assert.equal(layer.updateInterval, 0);
  assert.equal('setParams' in layer, false);
  assert.deepEqual(layer.getStats(), {
    count: 0,
    lastUpdate: null,
    error: null,
  });
});

test('[beemaps-bursts-001] refuses a source without getStatus, quote, confirm and list, and a second init', () => {
  const full = {
    getStatus() {},
    quote() {},
    confirm() {},
    list() {},
  };
  assert.throws(() => createBeemapsBurstsLayer(), TypeError);
  for (const source of [undefined, null, {}]) {
    assert.throws(() => createBeemapsBurstsLayer({ source }), TypeError);
  }
  for (const name of Object.keys(full)) {
    assert.throws(
      () => createBeemapsBurstsLayer({ source: { ...full, [name]: 'x' } }),
      TypeError,
      name,
    );
  }
  const layer = createBeemapsBurstsLayer({ source: full });
  const { viewer } = harness();
  layer.init(viewer);
  assert.throws(() => layer.init(viewer), /already initialized/);
});

test('[beemaps-bursts-002] asks only for the status and adds no listener to the camera or the scene', async () => {
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
  layer.destroy(viewer);
  assert.equal(calls.getStatus.length, 3);
  assert.deepEqual([calls.quote, calls.confirm, calls.list], [[], [], []]);
  assert.deepEqual(listeners, []);
});

test('[beemaps-bursts-002] reads the status only while it is enabled', async () => {
  const { layer, viewer, calls } = harness();
  layer.init(viewer);
  assert.equal(await layer.update(), false);
  assert.equal(calls.getStatus.length, 0);
});

test('[beemaps-bursts-002] sends no confirm and no second request while a quote is shown and the page reads, updates and moves', async () => {
  const h = harness();
  await h.quoted();
  for (let n = 0; n < 3; n += 1) {
    h.layer.getRowControls();
    await h.layer.update();
    for (const name of ['moveStart', 'changed', 'moveEnd'])
      h.viewer.camera[name].raiseEvent();
    h.viewer.scene.preRender.raiseEvent();
    h.viewer.scene.postRender.raiseEvent();
  }
  await tick();
  assert.deepEqual(
    [h.calls.quote.length, h.calls.confirm.length, h.calls.list.length],
    [1, 0, 0],
  );
  h.timers[0].fn();
  h.layer.disable(h.viewer);
  h.layer.enable(h.viewer);
  await h.layer.update();
  h.layer.destroy(h.viewer);
  await tick();
  assert.deepEqual(
    [h.calls.quote.length, h.calls.confirm.length, h.calls.list.length],
    [1, 0, 0],
  );
});

test('[beemaps-bursts-004] has two chips with onClick functions and no params after enable, and none before and after', async () => {
  const h = harness();
  h.layer.init(h.viewer);
  assert.deepEqual(h.chips(), []);
  h.layer.enable(h.viewer);
  const chips = h.chips();
  assert.deepEqual(
    chips.map((entry) => [entry.id, entry.label]),
    [
      ['quote', 'Quote burst here'],
      ['list', 'Check my bursts'],
    ],
  );
  for (const entry of chips) {
    assert.equal(typeof entry.onClick, 'function');
    assert.equal('params' in entry, false);
  }
  h.layer.disable(h.viewer);
  assert.deepEqual(h.chips(), []);
});

test('[beemaps-bursts-004] sends no call from an onClick function taken before disable', async () => {
  const h = harness();
  await h.ready();
  const oldQuote = h.chip('quote').onClick;
  const oldList = h.chip('list').onClick;
  h.layer.disable(h.viewer);
  await oldQuote();
  await oldList();
  assert.deepEqual([h.calls.quote, h.calls.list], [[], []]);
});

test('[beemaps-bursts-005] shows that bursts are off and disables both chips', async () => {
  const h = harness({
    status: async () => ({ ok: true, enabled: false, configured: true }),
  });
  await h.ready();
  assert.equal(
    h.info(),
    'Bursts are off on this server. Set BEEMAPS_BURST_ENABLED=true in .env and restart the app.',
  );
  assert.deepEqual(
    h.chips().map((entry) => [entry.id, entry.disabled]),
    [
      ['quote', true],
      ['list', true],
    ],
  );
  assert.equal(h.layer.getStats().error, null);
  await h.chip('quote').onClick();
  await h.chip('list').onClick();
  assert.deepEqual([h.calls.quote, h.calls.list], [[], []]);
});

test('[beemaps-bursts-005] shows that the key is missing and disables both chips', async () => {
  for (const enabled of [true]) {
    const h = harness({
      status: async () => ({ ok: true, enabled, configured: false }),
    });
    await h.ready();
    assert.equal(
      h.info(),
      'No Bee Maps key for bursts. Set BEEMAPS_BURST_API_KEY in .env and restart the app.',
    );
    assert.deepEqual(
      h.chips().map((entry) => entry.disabled),
      [true, true],
    );
  }
});

test('[beemaps-bursts-005] shows a failed status, leaves both chips enabled and resolves to true', async () => {
  for (const status of [
    async () => ({ ok: false }),
    async () => {
      throw new Error('boom');
    },
  ]) {
    const h = harness({ status });
    h.layer.init(h.viewer);
    h.layer.enable(h.viewer);
    assert.equal(await h.layer.update(), true);
    assert.equal(h.info(), 'The server did not give the status of the bursts.');
    assert.deepEqual(
      h.chips().map((entry) => entry.disabled),
      [false, false],
    );
    assert.equal(
      h.layer.getStats().error,
      'The server did not give the status of the bursts.',
    );
  }
});

test('[beemaps-bursts-005] shows the hint for a good status and clears an older failure', async () => {
  let answer = { ok: false };
  const h = harness({ status: async () => answer });
  h.layer.init(h.viewer);
  h.layer.enable(h.viewer);
  await h.layer.update();
  assert.notEqual(h.info(), HINT);
  answer = { ok: true, enabled: true, configured: true };
  await h.layer.update();
  assert.equal(h.info(), HINT);
  assert.deepEqual(h.layer.getStats(), {
    count: 0,
    lastUpdate: null,
    error: null,
  });
});

test('[beemaps-bursts-005] aborts the first status request when a second update starts, and when the layer is disabled', async () => {
  const waits = [deferred(), deferred(), deferred()];
  let n = 0;
  const h = harness({ status: () => waits[n++].promise });
  h.layer.init(h.viewer);
  h.layer.enable(h.viewer);
  const first = h.layer.update();
  const second = h.layer.update();
  assert.equal(h.calls.getStatus[0].signal.aborted, true);
  assert.equal(h.calls.getStatus[1].signal.aborted, false);
  waits[0].resolve({ ok: true, enabled: false, configured: true });
  waits[1].resolve({ ok: true, enabled: true, configured: true });
  assert.equal(await first, false);
  assert.equal(await second, true);
  assert.equal(h.info(), HINT);
  const third = h.layer.update();
  h.layer.disable(h.viewer);
  assert.equal(h.calls.getStatus[2].signal.aborted, true);
  waits[2].resolve({ ok: true, enabled: false, configured: true });
  assert.equal(await third, false);
});

test('[beemaps-bursts-006] sends one quote request with the box of the view and nothing else', async () => {
  const wait = deferred();
  const h = harness({ quote: () => wait.promise });
  await h.ready();
  const first = h.chip('quote').onClick();
  const second = h.chip('quote').onClick();
  await tick();
  assert.equal(h.calls.quote.length, 1);
  assert.deepEqual(Object.keys(h.calls.quote[0]).sort(), ['bbox', 'signal']);
  assert.deepEqual(h.calls.quote[0].bbox, VIEW_BOX);
  assert.equal(h.calls.confirm.length, 0);
  wait.resolve({ ok: true, quote: QUOTE });
  await Promise.all([first, second]);
  assert.equal(h.calls.quote.length, 1);
});

test('[beemaps-bursts-006] shows the label Quoting… on a disabled busy chip and disables the chip list while the quote is open', async () => {
  const wait = deferred();
  const h = harness({ quote: () => wait.promise });
  await h.ready();
  const before = h.notices();
  const pressed = h.chip('quote').onClick();
  assert.equal(h.notices(), before + 1);
  const quote = h.chip('quote');
  assert.equal(quote.label, 'Quoting…');
  assert.equal(quote.disabled, true);
  assert.equal(quote.busy, true);
  assert.equal(h.chip('list').disabled, true);
  assert.equal(h.chip('list').label, 'Check my bursts');
  wait.resolve({ ok: true, quote: QUOTE });
  await pressed;
  assert.equal(h.chip('quote'), undefined);
});

test('[beemaps-bursts-007] shows the quote, the chips, the text and the box of the answer', async () => {
  const h = harness();
  await h.quoted();
  assert.deepEqual(
    h.chips().map((entry) => [entry.id, entry.label]),
    [
      [`confirm:${QUOTE_ID}`, 'Confirm: 125 credits, 4 km²'],
      ['cancel', 'Cancel quote'],
      ['list', 'Check my bursts'],
    ],
  );
  assert.equal(h.info(), QUOTE_TEXT);
  assert.equal(h.calls.confirm.length, 0);
  assert.deepEqual(h.entityIds(), ['beemaps-bursts:quote']);
  const rectangle = h
    .dataSource()
    .entities.getById('beemaps-bursts:quote').rectangle;
  const west = Cesium.Math.toDegrees(
    rectangle.coordinates.getValue(Cesium.JulianDate.now()).west,
  );
  assert.equal(Number(west.toFixed(6)), 9.987014);
  assert.deepEqual(
    h.chips().map((entry) => entry.title),
    [
      'Create the burst. This takes credits and cannot be undone.',
      'Cancel the quote. Nothing is sent.',
      'Ask Bee Maps for your bursts. This can cost money.',
    ],
  );
});

test('[beemaps-bursts-007] asks for the idempotency key when the answer arrives and not when the person presses', async () => {
  const wait = deferred();
  const h = harness({ quote: () => wait.promise });
  await h.ready();
  const pressed = h.chip('quote').onClick();
  await tick();
  assert.deepEqual(h.keys, []);
  wait.resolve({ ok: true, quote: QUOTE });
  await pressed;
  assert.deepEqual(h.keys, [key(1)]);
});

test('[beemaps-bursts-008] shows a message and sends no quote request when the view gives no box', async () => {
  const rows = [
    [() => undefined, 'Point the view at the ground and press again.'],
    [
      () => Cesium.Cartesian3.fromDegrees(0, 80.5),
      'Move the view to a latitude from -79.99 to 79.99 degrees and press again.',
    ],
    [
      () => Cesium.Cartesian3.fromDegrees(0, -79.999),
      'Move the view to a latitude from -79.99 to 79.99 degrees and press again.',
    ],
    [
      () => Cesium.Cartesian3.fromDegrees(0, 79.996),
      'Move the view to a latitude from -79.99 to 79.99 degrees and press again.',
    ],
    [
      () => Cesium.Cartesian3.fromDegrees(179.999, 0),
      'Move the view away from the 180th meridian and press again.',
    ],
    [
      () => {
        throw new Error('pick failed');
      },
      'Point the view at the ground and press again.',
    ],
  ];
  for (const [pick, message] of rows) {
    const h = harness({ pick });
    await h.ready();
    await h.chip('quote').onClick();
    assert.equal(h.info(), message);
    assert.equal(h.calls.quote.length, 0);
    assert.equal(h.chip('quote').disabled, false);
    assert.equal(h.layer.getStats().error, message);
  }
});

test('[beemaps-bursts-008] shows the sky for a canvas with no size, and quotes the view at the latitude 79.9', async () => {
  for (const canvas of [
    null,
    { clientWidth: 0, clientHeight: 600 },
    { clientWidth: 800, clientHeight: 0 },
  ]) {
    const h = harness({ canvas });
    await h.ready();
    await h.chip('quote').onClick();
    assert.equal(h.info(), 'Point the view at the ground and press again.');
    assert.equal(h.calls.quote.length, 0);
  }
  const north = harness({
    pick: () => Cesium.Cartesian3.fromDegrees(0, 79.9),
  });
  await north.ready();
  await north.chip('quote').onClick();
  assert.equal(north.calls.quote.length, 1);
  assert.deepEqual(
    north.calls.quote[0].bbox,
    [-0.051282, 79.891007, 0.051282, 79.908993],
  );
});

test('[beemaps-bursts-009] shows the text of each error of a quote and keeps no quote', async () => {
  const rows = [
    [
      { ok: false, status: 403, error: 'burst_off' },
      'Bursts are off on this server. Set BEEMAPS_BURST_ENABLED=true in .env and restart the app.',
    ],
    [
      { ok: false, status: 429, error: 'rate_limited', retryAfter: 60 },
      'Too many presses. Wait 60 seconds.',
    ],
    [
      { ok: false, status: 403, error: 'budget_used', used: 625, limit: 625 },
      'The daily limit of 625 credits is used.',
    ],
    [
      { ok: false, status: 200, error: 'bad_answer' },
      'The server sent an answer that the layer cannot read.',
    ],
    [
      { ok: false, status: 418, error: 'unknown' },
      'The server answered with an unknown error (418).',
    ],
  ];
  for (const [answer, message] of rows) {
    const h = harness({ quote: async () => answer });
    await h.ready();
    await h.chip('quote').onClick();
    assert.equal(h.info(), message);
    assert.equal(h.layer.getStats().error, message);
    assert.deepEqual(
      h.chips().map((entry) => entry.id),
      ['quote', 'list'],
    );
    assert.equal(h.chip('quote').disabled, false);
    assert.deepEqual(h.entityIds(), []);
    assert.deepEqual(h.keys, []);
    await h.layer.update();
    h.layer.disable(h.viewer);
    h.layer.enable(h.viewer);
    await tick();
    assert.equal(h.calls.quote.length, 1);
  }
});

test('[beemaps-bursts-009] shows the text for unreachable when the source throws', async () => {
  const h = harness({
    quote: async () => {
      throw new Error('boom');
    },
  });
  await h.ready();
  await h.chip('quote').onClick();
  assert.equal(h.info(), 'The server did not answer.');
});

test('[beemaps-bursts-009] ignores the answer of a quote that the layer was disabled for', async () => {
  const wait = deferred();
  const h = harness({ quote: () => wait.promise });
  await h.ready();
  const pressed = h.chip('quote').onClick();
  await tick();
  h.layer.disable(h.viewer);
  assert.equal(h.calls.quote[0].signal.aborted, true);
  h.layer.enable(h.viewer);
  wait.resolve({ ok: true, quote: QUOTE });
  await pressed;
  assert.deepEqual(
    h.chips().map((entry) => entry.id),
    ['quote', 'list'],
  );
  assert.deepEqual(h.keys, []);
  assert.equal(h.timers.length, 0);
});

test('[beemaps-bursts-010] ends the quote when the timer of its seconds runs', async () => {
  const h = harness();
  await h.quoted();
  assert.equal(h.timers.length, 2);
  assert.equal(h.timers[0].ms, 120000);
  assert.equal(h.timers[1].ms, 1000);
  h.clock.t += 120000;
  h.timers[0].fn();
  assert.deepEqual(
    h.chips().map((entry) => entry.id),
    ['quote', 'list'],
  );
  assert.deepEqual(h.entityIds(), []);
  assert.equal(h.info(), ENDED_TEXT);
  assert.equal(h.calls.confirm.length, 0);
  assert.equal(h.layer.getStats().error, null);
});

test('[beemaps-bursts-010] starts the timer at the answer and clears it when the quote is cancelled, confirmed or disabled', async () => {
  const cancelled = harness();
  await cancelled.quoted();
  await cancelled.chip('cancel').onClick();
  assert.deepEqual(cancelled.cleared, [1]);
  const confirmed = harness();
  await confirmed.quoted();
  await confirmed.confirmChip().onClick();
  assert.deepEqual(confirmed.cleared, [1]);
  const disabled = harness();
  await disabled.quoted();
  disabled.layer.disable(disabled.viewer);
  assert.deepEqual(disabled.cleared, [1]);
  const none = harness();
  await none.ready();
  none.layer.disable(none.viewer);
  assert.deepEqual(none.cleared, []);
});

test('[beemaps-bursts-010] sends no confirm request at or after the end of the quote when the timer has not run', async () => {
  for (const late of [0, 1, 60000]) {
    const h = harness();
    await h.quoted();
    const press = h.confirmChip().onClick;
    h.clock.t = NOW + 120000 + late;
    await press();
    assert.equal(h.calls.confirm.length, 0);
    assert.equal(h.info(), ENDED_TEXT);
    assert.deepEqual(
      h.chips().map((entry) => entry.id),
      ['quote', 'list'],
    );
    assert.deepEqual(h.entityIds(), []);
    assert.deepEqual(h.cleared, [1]);
  }
  const edge = harness();
  await edge.quoted();
  const press = edge.confirmChip().onClick;
  edge.clock.t = NOW + 119999;
  await press();
  assert.equal(edge.calls.confirm.length, 1);
});

test('[beemaps-bursts-011] drops the quote when a person presses cancel', async () => {
  const h = harness();
  await h.quoted();
  const old = h.confirmChip();
  await h.chip('cancel').onClick();
  assert.deepEqual(
    h.chips().map((entry) => entry.id),
    ['quote', 'list'],
  );
  assert.deepEqual(h.entityIds(), []);
  assert.equal(h.info(), HINT);
  assert.deepEqual(h.cleared, [1]);
  await old.onClick();
  assert.equal(h.calls.confirm.length, 0);
  await h.chip('quote').onClick();
  assert.equal(h.chip('confirm:' + QUOTE_ID) !== undefined, true);
});

test('[beemaps-bursts-011] gives a new quote a new Confirm chip id, so a press on the old chip finds no chip', async () => {
  let n = 0;
  const h = harness({
    quote: async () => ({
      ok: true,
      quote: { ...QUOTE, quoteId: [QUOTE_ID, SECOND_ID][n++] },
    }),
  });
  await h.quoted();
  const first = h.confirmChip();
  await h.chip('cancel').onClick();
  await h.chip('quote').onClick();
  assert.equal(h.confirmChip().id, `confirm:${SECOND_ID}`);
  assert.equal(h.chip(first.id), undefined);
  await first.onClick();
  assert.equal(h.calls.confirm.length, 0);
});

test('[beemaps-bursts-011] does nothing for a cancel press without a quote or while the layer is disabled', async () => {
  const h = harness();
  await h.quoted();
  const cancel = h.chip('cancel').onClick;
  h.layer.disable(h.viewer);
  await cancel();
  assert.equal(h.info(), HINT);
  h.layer.enable(h.viewer);
  await cancel();
  assert.deepEqual(
    h.chips().map((entry) => entry.id),
    ['quote', 'list'],
  );
});

test('[beemaps-bursts-012] sends one confirm request with the quoteId and the key, and disables the chip in the same call', async () => {
  const wait = deferred();
  const h = harness({ confirm: () => wait.promise });
  await h.quoted();
  const pressed = h.confirmChip().onClick();
  assert.equal(h.calls.confirm.length, 1);
  assert.deepEqual(h.calls.confirm[0], {
    quoteId: QUOTE_ID,
    idempotencyKey: key(1),
  });
  const sending = h.confirmChip();
  assert.equal(sending.label, 'Sending…');
  assert.equal(sending.disabled, true);
  assert.equal(sending.busy, true);
  assert.equal(h.chip('cancel'), undefined);
  assert.equal(h.chip('list').disabled, true);
  assert.equal(h.info(), HINT);
  wait.resolve(CREATED);
  await pressed;
});

test('[beemaps-bursts-012] sends no second request for a second call of the same onClick function', async () => {
  const wait = deferred();
  const h = harness({ confirm: () => wait.promise });
  await h.quoted();
  const press = h.confirmChip().onClick;
  const first = press();
  const second = press();
  await tick();
  assert.equal(h.calls.confirm.length, 1);
  wait.resolve(CREATED);
  await Promise.all([first, second]);
  await press();
  assert.equal(h.calls.confirm.length, 1);
});

test('[beemaps-bursts-012] sends no confirm request after an answer, whatever the answer was', async () => {
  const answers = [
    CREATED,
    { outcome: 'refused', status: 403, error: 'no_key' },
    { outcome: 'unknown', status: 502 },
  ];
  for (const answer of answers) {
    const h = harness({ confirm: async () => answer });
    await h.quoted();
    const press = h.confirmChip().onClick;
    await press();
    await press();
    await h.layer.update();
    assert.equal(h.calls.confirm.length, 1);
    assert.equal(h.confirmChip(), undefined);
  }
});

test('[beemaps-bursts-012] sends no confirm request while a list request is open or while the layer is not enabled', async () => {
  const wait = deferred();
  const h = harness({ list: () => wait.promise });
  await h.quoted();
  const press = h.confirmChip().onClick;
  const listing = h.chip('list').onClick();
  assert.equal(h.confirmChip().disabled, true);
  await press();
  assert.equal(h.calls.confirm.length, 0);
  wait.resolve({ ok: true, bursts: [], total: 0, cached: false });
  await listing;
  assert.equal(h.confirmChip().disabled, false);
  h.layer.disable(h.viewer);
  await press();
  assert.equal(h.calls.confirm.length, 0);
});

test('[beemaps-bursts-013] asks the random source once for each quote and sends the key of that quote', async () => {
  let n = 0;
  const h = harness({
    quote: async () => ({
      ok: true,
      quote: { ...QUOTE, quoteId: [QUOTE_ID, SECOND_ID][n++] },
    }),
  });
  await h.quoted();
  await h.chip('cancel').onClick();
  assert.deepEqual(h.keys, [key(1)]);
  await h.chip('quote').onClick();
  assert.deepEqual(h.keys, [key(1), key(2)]);
  h.unlock();
  await h.confirmChip().onClick();
  assert.deepEqual(h.calls.confirm, [
    { quoteId: SECOND_ID, idempotencyKey: key(2) },
  ]);
});

test('[beemaps-bursts-013] asks for one key when the answer arrives, and shows no key in a label, title, id or text', async () => {
  const h = harness();
  await h.quoted();
  assert.deepEqual(h.keys, [key(1)]);
  const everything = JSON.stringify([
    h.chips().map(({ id, label, title }) => [id, label, title]),
    h.info(),
  ]);
  assert.equal(everything.includes(key(1)), false);
  await h.chip('cancel').onClick();
  await h.layer.update();
  assert.deepEqual(h.keys, [key(1)]);
  assert.equal(h.calls.confirm.length, 0);
});

test('[beemaps-bursts-013] makes a key of 32 characters from 0123456789abcdef when no random source is given', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout', 'Date'], now: NOW });
  const sent = [];
  const source = {
    getStatus: async () => ({ ok: true, enabled: true, configured: true }),
    quote: async () => ({ ok: true, quote: QUOTE }),
    confirm: async (options) => {
      sent.push(options.idempotencyKey);
      return CREATED;
    },
    list: async () => ({ ok: true, bursts: [], total: 0, cached: false }),
  };
  const { viewer } = harness();
  for (let n = 0; n < 24; n += 1) {
    const layer = createBeemapsBurstsLayer({ source });
    layer.init(viewer);
    layer.enable(viewer);
    await layer.update();
    await layer.getRowControls().chips[0].onClick();
    t.mock.timers.tick(1000);
    await layer.getRowControls().chips[0].onClick();
    layer.destroy(viewer);
  }
  assert.equal(sent.length, 24);
  for (const value of sent) {
    assert.match(value, /^[0-9a-f]{32}$/);
    assert.doesNotMatch(value, /^(..)\1{15}$/);
  }
  assert.equal(new Set(sent).size, 24);
});

test('[beemaps-bursts-010] uses the clock and the timers of the page when none are given', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout', 'Date'], now: NOW });
  const source = {
    getStatus: async () => ({ ok: true, enabled: true, configured: true }),
    quote: async () => ({ ok: true, quote: QUOTE }),
    confirm: async () => CREATED,
    list: async () => ({ ok: true, bursts: [], total: 0, cached: false }),
  };
  const { viewer } = harness();
  const layer = createBeemapsBurstsLayer({ source });
  layer.init(viewer);
  layer.enable(viewer);
  await layer.update();
  await layer.getRowControls().chips[0].onClick();
  assert.equal(layer.getRowControls().chips[0].id, `confirm:${QUOTE_ID}`);
  t.mock.timers.tick(119999);
  assert.equal(layer.getRowControls().chips[0].id, `confirm:${QUOTE_ID}`);
  t.mock.timers.tick(1);
  assert.deepEqual(
    layer.getRowControls().chips.map((entry) => entry.id),
    ['quote', 'list'],
  );
  assert.equal(layer.getRowControls().info, ENDED_TEXT);
  await layer.getRowControls().chips[0].onClick();
  t.mock.timers.tick(1000);
  await layer.getRowControls().chips[0].onClick();
  const text = layer.getRowControls().info;
  assert.match(text, /^Burst created: /);
  assert.equal(layer.getStats().lastUpdate, Date.now());
  t.mock.timers.tick(120000);
  assert.equal(layer.getRowControls().info, text);
  layer.destroy(viewer);
});

test('[beemaps-bursts-014] shows a created burst, its box and the stats', async () => {
  const h = harness();
  await h.quoted();
  await h.confirmChip().onClick();
  assert.equal(
    h.info(),
    'Burst created: 125 credits taken, 875 left at Bee Maps. · 1 burst · 0 hits',
  );
  assert.deepEqual(
    h.chips().map((entry) => entry.id),
    ['quote', 'list'],
  );
  assert.deepEqual(h.entityIds(), [`beemaps-bursts:${BURST_ID}`]);
  assert.deepEqual(h.layer.getStats(), {
    count: 1,
    lastUpdate: NOW + 1000,
    error: null,
  });
});

test('[beemaps-bursts-014] gives the text without the credits left when the answer has none', async () => {
  const h = harness({
    confirm: async () => ({ ...CREATED, creditsRemaining: null }),
  });
  await h.quoted();
  await h.confirmChip().onClick();
  assert.equal(
    h.info(),
    'Burst created: 125 credits taken. · 1 burst · 0 hits',
  );
});

test('[beemaps-bursts-014] adds the created burst to the bursts of an earlier list', async () => {
  const h = harness({
    list: async () => ({
      ok: true,
      bursts: [listed('a'), listed('b', { isHit: true })],
      total: 2,
      cached: false,
    }),
  });
  await h.ready();
  await h.chip('list').onClick();
  await h.chip('quote').onClick();
  h.unlock();
  await h.confirmChip().onClick();
  assert.equal(h.layer.getStats().count, 3);
  assert.deepEqual(h.entityIds(), [
    'beemaps-bursts:a',
    'beemaps-bursts:b',
    `beemaps-bursts:${BURST_ID}`,
  ]);
  assert.equal(
    h.info(),
    'Burst created: 125 credits taken, 875 left at Bee Maps. · 3 bursts · 1 hit',
  );
});

test('[beemaps-bursts-015] shows the text of a refusal that took no credits, keeps no quote and creates no entity', async () => {
  const rows = [
    [
      { outcome: 'refused', status: 402, error: 'no_credit' },
      'The Bee Maps account has no credit.',
    ],
    [
      { outcome: 'refused', status: 403, error: 'key_rejected' },
      'Bee Maps refused the key. Check BEEMAPS_BURST_API_KEY in .env.',
    ],
    [
      {
        outcome: 'refused',
        status: 429,
        error: 'upstream_rate_limit',
        retryAfter: 30,
      },
      'Bee Maps asks you to wait 30 seconds.',
    ],
    [{ outcome: 'refused', status: 410, error: 'quote_expired' }, ENDED_TEXT],
    [
      {
        outcome: 'refused',
        status: 403,
        error: 'budget_used',
        used: 625,
        limit: 625,
      },
      'The daily limit of 625 credits is used.',
    ],
    [
      { outcome: 'refused', status: 409, error: 'busy' },
      'The server is busy with another confirm request. Wait, then press Check my bursts.',
    ],
  ];
  for (const [answer, message] of rows) {
    const h = harness({ confirm: async () => answer });
    await h.quoted();
    await h.confirmChip().onClick();
    assert.equal(h.info(), message);
    assert.equal(h.layer.getStats().error, message);
    assert.equal(h.layer.getStats().count, 0);
    assert.deepEqual(h.entityIds(), []);
    assert.deepEqual(
      h.chips().map((entry) => entry.id),
      ['quote', 'list'],
    );
    await h.layer.update();
    assert.equal(h.calls.confirm.length, 1);
  }
});

test('[beemaps-bursts-016] warns that a burst can exist after an unclear answer and offers no second confirm', async () => {
  const rows = [
    [{ outcome: 'unknown', status: 502 }, UNKNOWN_TEXT],
    [
      { outcome: 'unknown', status: 409, retryAfter: 539 },
      `${UNKNOWN_TEXT} The server refuses new confirms for 539 seconds.`,
    ],
    [
      { outcome: 'unknown', status: 0, retryAfter: 1 },
      `${UNKNOWN_TEXT} The server refuses new confirms for 1 second.`,
    ],
    [{ outcome: 'mystery' }, UNKNOWN_TEXT],
    [undefined, UNKNOWN_TEXT],
    [null, UNKNOWN_TEXT],
    ['garbage', UNKNOWN_TEXT],
  ];
  for (const [answer, message] of rows) {
    const h = harness({ confirm: async () => answer });
    await h.quoted();
    await h.confirmChip().onClick();
    assert.equal(h.info(), message);
    assert.equal(h.layer.getStats().error, message);
    assert.deepEqual(
      h.chips().map((entry) => entry.id),
      ['quote', 'list'],
    );
    assert.deepEqual(h.entityIds(), []);
    await h.layer.update();
    assert.equal(h.calls.confirm.length, 1);
  }
});

test('[beemaps-bursts-016] warns that a burst can exist when the source throws', async () => {
  const h = harness({
    confirm: async () => {
      throw new Error('boom');
    },
  });
  await h.quoted();
  await h.confirmChip().onClick();
  assert.equal(h.info(), UNKNOWN_TEXT);
  assert.equal(h.calls.confirm.length, 1);
});

test('[beemaps-bursts-017] gives the confirm call no signal, so disable cannot abort it, and keeps the text of the answer', async () => {
  const wait = deferred();
  const h = harness({ confirm: () => wait.promise });
  await h.quoted();
  const pressed = h.confirmChip().onClick();
  assert.deepEqual(Object.keys(h.calls.confirm[0]).sort(), [
    'idempotencyKey',
    'quoteId',
  ]);
  h.layer.disable(h.viewer);
  wait.resolve({ outcome: 'unknown', status: 502 });
  await pressed;
  h.layer.enable(h.viewer);
  assert.equal(h.info(), UNKNOWN_TEXT);
  assert.deepEqual(
    h.chips().map((entry) => entry.id),
    ['quote', 'list'],
  );
});

test('[beemaps-bursts-017] shows a created burst that came while the layer was disabled, after the next enable', async () => {
  const wait = deferred();
  const h = harness({ confirm: () => wait.promise });
  await h.quoted();
  const pressed = h.confirmChip().onClick();
  h.layer.disable(h.viewer);
  h.layer.enable(h.viewer);
  assert.equal(h.chip('quote').disabled, true);
  assert.equal(h.chip('list').disabled, true);
  wait.resolve(CREATED);
  await pressed;
  assert.equal(
    h.info(),
    'Burst created: 125 credits taken, 875 left at Bee Maps. · 1 burst · 0 hits',
  );
  assert.deepEqual(h.entityIds(), [`beemaps-bursts:${BURST_ID}`]);
  assert.equal(h.chip('quote').disabled, false);
});

test('[beemaps-bursts-017] keeps the text of a confirm through disable and enable until a new quote', async () => {
  const h = harness({
    confirm: async () => ({ outcome: 'unknown', status: 0 }),
  });
  await h.quoted();
  await h.confirmChip().onClick();
  h.layer.disable(h.viewer);
  h.layer.enable(h.viewer);
  await h.layer.update();
  assert.equal(h.info(), UNKNOWN_TEXT);
  await h.chip('quote').onClick();
  assert.equal(h.info(), QUOTE_TEXT);
});

test('[beemaps-bursts-017] joins the text of a confirm and the message of a later press', async () => {
  let n = 0;
  const h = harness({
    confirm: async () => ({ outcome: 'unknown', status: 0 }),
    pick: () =>
      n++ === 0 ? Cesium.Cartesian3.fromDegrees(10.0031, 59.9976) : undefined,
  });
  await h.quoted();
  await h.confirmChip().onClick();
  await h.chip('quote').onClick();
  assert.equal(
    h.info(),
    `${UNKNOWN_TEXT} · Point the view at the ground and press again.`,
  );
});

test('[beemaps-bursts-017] clears a quote that is shown when the layer is disabled, and shows no Confirm chip after the next enable', async () => {
  const h = harness();
  await h.quoted();
  h.layer.disable(h.viewer);
  h.layer.enable(h.viewer);
  assert.deepEqual(
    h.chips().map((entry) => entry.id),
    ['quote', 'list'],
  );
  assert.deepEqual(h.entityIds(), []);
});

test('[beemaps-bursts-017] shows nothing and throws no error for an answer after destroy', async () => {
  const wait = deferred();
  const h = harness({ confirm: () => wait.promise });
  await h.quoted();
  const pressed = h.confirmChip().onClick();
  const before = h.notices();
  h.layer.destroy(h.viewer);
  wait.resolve(CREATED);
  await pressed;
  assert.equal(h.notices(), before);
  assert.deepEqual(h.layer.getStats(), {
    count: 0,
    lastUpdate: null,
    error: null,
  });
  assert.equal(h.layer.getRowControls().info, HINT);
  assert.deepEqual(h.added, []);
  assert.equal(h.viewer.removed[1], true);
});

test('[beemaps-bursts-018] sends one list request, draws the box of each burst and shows the counts', async () => {
  const wait = deferred();
  const h = harness({ list: () => wait.promise });
  await h.ready();
  const pressed = h.chip('list').onClick();
  const second = h.chip('list').onClick();
  await tick();
  assert.equal(h.calls.list.length, 1);
  assert.equal(h.calls.list[0].signal.aborted, false);
  const listing = h.chip('list');
  assert.equal(listing.label, 'Checking…');
  assert.equal(listing.disabled, true);
  assert.equal(listing.busy, true);
  assert.equal(h.chip('quote').disabled, true);
  assert.equal(h.chip('quote').label, 'Quote burst here');
  wait.resolve({
    ok: true,
    bursts: [listed('a'), listed('b', { isHit: true }), listed('c')],
    total: 3,
    cached: false,
  });
  await Promise.all([pressed, second]);
  assert.equal(h.calls.list.length, 1);
  assert.equal(h.info(), '3 bursts · 1 hit');
  assert.deepEqual(h.entityIds(), [
    'beemaps-bursts:a',
    'beemaps-bursts:b',
    'beemaps-bursts:c',
  ]);
  assert.deepEqual(h.layer.getStats(), {
    count: 3,
    lastUpdate: NOW,
    error: null,
  });
  assert.equal(h.chip('list').label, 'Check my bursts');
  assert.equal(h.chip('list').disabled, false);
});

test('[beemaps-bursts-018] shows the counts for one burst and for a list that is cut at 100', async () => {
  const one = harness({
    list: async () => ({
      ok: true,
      bursts: [listed('a')],
      total: 1,
      cached: true,
    }),
  });
  await one.ready();
  await one.chip('list').onClick();
  assert.equal(one.info(), '1 burst · 0 hits · stored answer');
  const many = harness({
    list: async () => ({
      ok: true,
      bursts: Array.from({ length: 100 }, (_, n) => listed(`id${n}`)),
      total: 130,
      cached: false,
    }),
  });
  await many.ready();
  await many.chip('list').onClick();
  assert.equal(many.info(), '100 bursts (130 in all) · 0 hits');
  assert.equal(many.layer.getStats().count, 100);
});

test('[beemaps-bursts-018] gives one entity for a burst id that repeats or equals quote', async () => {
  const h = harness({
    list: async () => ({
      ok: true,
      bursts: [listed('a'), listed('a'), listed('quote')],
      total: 3,
      cached: false,
    }),
  });
  await h.quoted();
  await h.chip('list').onClick();
  assert.deepEqual(h.entityIds(), ['beemaps-bursts:quote', 'beemaps-bursts:a']);
});

test('[beemaps-bursts-019] keeps the entities of the first list when a second list fails', async () => {
  let n = 0;
  const h = harness({
    list: async () =>
      n++ === 0
        ? {
            ok: true,
            bursts: [listed('a'), listed('b')],
            total: 2,
            cached: false,
          }
        : { ok: false, status: 403, error: 'key_rejected' },
  });
  await h.ready();
  await h.chip('list').onClick();
  await h.chip('list').onClick();
  assert.equal(
    h.info(),
    'Bee Maps refused the key. Check BEEMAPS_BURST_API_KEY in .env. · 2 bursts · 0 hits',
  );
  assert.deepEqual(h.entityIds(), ['beemaps-bursts:a', 'beemaps-bursts:b']);
  assert.equal(h.chip('list').disabled, false);
  assert.equal(
    h.layer.getStats().error,
    'Bee Maps refused the key. Check BEEMAPS_BURST_API_KEY in .env.',
  );
});

test('[beemaps-bursts-019] shows unreachable when the source throws, and replaces the earlier list with a new one', async () => {
  let n = 0;
  const h = harness({
    list: async () => {
      n += 1;
      if (n === 1) throw new Error('boom');
      return n === 2
        ? {
            ok: true,
            bursts: [listed('a'), listed('b')],
            total: 2,
            cached: false,
          }
        : {
            ok: true,
            bursts: [listed('b'), listed('c')],
            total: 2,
            cached: false,
          };
    },
  });
  await h.ready();
  await h.chip('list').onClick();
  assert.equal(h.info(), 'The server did not answer.');
  await h.chip('list').onClick();
  await h.chip('list').onClick();
  assert.deepEqual(h.entityIds(), ['beemaps-bursts:b', 'beemaps-bursts:c']);
  assert.equal(h.info(), '2 bursts · 0 hits');
});

test('[beemaps-bursts-019] keeps the created burst after a list answer that does not list it', async () => {
  const h = harness({
    list: async () => ({
      ok: true,
      bursts: [listed('a')],
      total: 1,
      cached: true,
    }),
  });
  await h.quoted();
  await h.confirmChip().onClick();
  assert.deepEqual(h.entityIds(), [`beemaps-bursts:${BURST_ID}`]);
  await h.chip('list').onClick();
  assert.deepEqual(h.entityIds(), [
    'beemaps-bursts:a',
    `beemaps-bursts:${BURST_ID}`,
  ]);
  assert.equal(h.layer.getStats().count, 2);
  assert.equal(
    h.info(),
    'Burst created: 125 credits taken, 875 left at Bee Maps. · 2 bursts · 0 hits · stored answer',
  );
});

test('[beemaps-bursts-019] takes the burst of the list answer in place of the burst that a confirm created', async () => {
  const h = harness({
    list: async () => ({
      ok: true,
      bursts: [listed(BURST_ID, { isHit: true, bbox: [5, 6, 7, 8] })],
      total: 1,
      cached: false,
    }),
  });
  await h.quoted();
  await h.confirmChip().onClick();
  await h.chip('list').onClick();
  assert.deepEqual(h.entityIds(), [`beemaps-bursts:${BURST_ID}`]);
  assert.equal(h.layer.getStats().count, 1);
  assert.equal(
    h.info(),
    'Burst created: 125 credits taken, 875 left at Bee Maps. · 1 burst · 1 hit',
  );
  const rectangle = h
    .dataSource()
    .entities.getById(`beemaps-bursts:${BURST_ID}`)
    .rectangle.coordinates.getValue(Cesium.JulianDate.now());
  assert.equal(Math.round(Cesium.Math.toDegrees(rectangle.west)), 5);
});

test('[beemaps-bursts-019] forgets the bursts of the list and the created bursts on disable', async () => {
  const h = harness({
    list: async () => ({
      ok: true,
      bursts: [listed('a')],
      total: 1,
      cached: false,
    }),
  });
  await h.quoted();
  await h.confirmChip().onClick();
  await h.chip('list').onClick();
  h.layer.disable(h.viewer);
  h.layer.enable(h.viewer);
  assert.deepEqual(h.entityIds(), []);
  assert.equal(h.layer.getStats().count, 0);
});

test('[beemaps-bursts-018] counts a burst with null fields and draws no box for a burst with no box', async () => {
  const h = harness({
    list: async () => ({
      ok: true,
      bursts: [
        listed('open'),
        listed('nobox', { bbox: null }),
        listed('nostatus', { status: null, credits: null }),
      ],
      total: 3,
      cached: false,
    }),
  });
  await h.ready();
  await h.chip('list').onClick();
  assert.equal(h.info(), '3 bursts · 0 hits');
  assert.equal(h.layer.getStats().count, 3);
  assert.deepEqual(h.entityIds(), [
    'beemaps-bursts:open',
    'beemaps-bursts:nostatus',
  ]);
  const at = Cesium.JulianDate.now();
  const grey = Cesium.Color.fromCssColorString('#9ca3af').withAlpha(0.2);
  const colour = h
    .dataSource()
    .entities.getById('beemaps-bursts:nostatus')
    .rectangle.material.getValue(at).color;
  assert.equal(Cesium.Color.equals(colour, grey), true);
});

test('[beemaps-bursts-014] shows the credits of the quote for a created burst with null credits and a null status', async () => {
  const h = harness({
    confirm: async () => ({
      ...CREATED,
      burst: { ...CREATED.burst, credits: null, status: null },
    }),
  });
  await h.quoted();
  await h.confirmChip().onClick();
  assert.equal(
    h.info(),
    'Burst created: 125 credits taken, 875 left at Bee Maps. · 1 burst · 0 hits',
  );
  const at = Cesium.JulianDate.now();
  const grey = Cesium.Color.fromCssColorString('#9ca3af').withAlpha(0.2);
  const colour = h
    .dataSource()
    .entities.getById(`beemaps-bursts:${BURST_ID}`)
    .rectangle.material.getValue(at).color;
  assert.equal(Cesium.Color.equals(colour, grey), true);
});

test('[beemaps-bursts-019] clears the text of a failed status after a good list or a good quote', async () => {
  const h = harness({ status: async () => ({ ok: false }) });
  await h.ready();
  assert.equal(
    h.layer.getStats().error,
    'The server did not give the status of the bursts.',
  );
  await h.chip('list').onClick();
  assert.equal(h.info(), '0 bursts · 0 hits');
  assert.equal(h.layer.getStats().error, null);
  const q = harness({ status: async () => ({ ok: false }) });
  await q.quoted();
  assert.equal(q.info(), QUOTE_TEXT);
  assert.equal(q.layer.getStats().error, null);
});

test('[beemaps-bursts-019] ignores the answer of a list that the layer was disabled for', async () => {
  const wait = deferred();
  const h = harness({ list: () => wait.promise });
  await h.ready();
  const pressed = h.chip('list').onClick();
  await tick();
  h.layer.disable(h.viewer);
  assert.equal(h.calls.list[0].signal.aborted, true);
  h.layer.enable(h.viewer);
  wait.resolve({ ok: true, bursts: [listed('a')], total: 1, cached: false });
  await pressed;
  assert.deepEqual(h.entityIds(), []);
  assert.equal(h.layer.getStats().count, 0);
});

test('[beemaps-bursts-020] draws a rectangle of the box of each burst with the color of its state', async () => {
  const h = harness({
    list: async () => ({
      ok: true,
      bursts: [
        listed('hit', { isHit: true, bbox: [1, 2, 3, 4] }),
        listed('open', { bbox: [5, 6, 7, 8] }),
        listed('done', { status: 'ended', bbox: [9, 10, 11, 12] }),
      ],
      total: 3,
      cached: false,
    }),
  });
  await h.quoted();
  await h.chip('list').onClick();
  const at = Cesium.JulianDate.now();
  const entity = (id) => h.dataSource().entities.getById(id);
  const color = (id) => entity(id).rectangle.material.getValue(at).color;
  const near = (a, b) => Math.abs(a - b) < 1e-9;
  const check = (id, css, alpha) => {
    const expected = Cesium.Color.fromCssColorString(css).withAlpha(alpha);
    assert.equal(Cesium.Color.equals(color(id), expected), true, id);
  };
  check('beemaps-bursts:hit', '#22c55e', 0.35);
  check('beemaps-bursts:open', '#38bdf8', 0.25);
  check('beemaps-bursts:done', '#9ca3af', 0.2);
  check('beemaps-bursts:quote', '#f59e0b', 0.3);
  const open = entity('beemaps-bursts:open').rectangle.coordinates.getValue(at);
  assert.equal(near(Cesium.Math.toDegrees(open.west), 5), true);
  assert.equal(near(Cesium.Math.toDegrees(open.south), 6), true);
  assert.equal(near(Cesium.Math.toDegrees(open.east), 7), true);
  assert.equal(near(Cesium.Math.toDegrees(open.north), 8), true);
});

test('[beemaps-bursts-020] hides the boxes with the data source and removes the data source on destroy', async () => {
  const h = harness();
  h.layer.init(h.viewer);
  assert.equal(h.dataSource().show, false);
  h.layer.enable(h.viewer);
  assert.equal(h.dataSource().show, true);
  h.layer.disable(h.viewer);
  assert.equal(h.dataSource().show, false);
  const source = h.dataSource();
  h.layer.destroy(h.viewer);
  assert.deepEqual(h.viewer.removed, [source, true]);
  assert.deepEqual(h.added, []);
  const idle = harness();
  idle.layer.destroy(idle.viewer);
  assert.equal(idle.viewer.removed, undefined);
});

test('[beemaps-bursts-029] keeps the Confirm chip disabled for 1000 milliseconds after the quote shows', async () => {
  const h = harness();
  await h.quoted({ unlocked: false });
  assert.deepEqual(
    h.timers.map((timer) => timer.ms),
    [120000, 1000],
  );
  const locked = h.confirmChip();
  assert.equal(locked.disabled, true);
  assert.equal(locked.label, 'Confirm: 125 credits, 4 km²');
  const before = h.notices();
  h.clock.t = NOW + 999;
  assert.equal(h.confirmChip().disabled, true);
  await locked.onClick();
  assert.equal(h.calls.confirm.length, 0);
  assert.equal(h.info(), QUOTE_TEXT);
  assert.equal(h.notices(), before);
  h.clock.t = NOW + 1000;
  h.timers[1].done = true;
  h.timers[1].fn();
  assert.equal(h.notices(), before + 1);
  assert.equal(h.confirmChip().disabled, false);
  await h.confirmChip().onClick();
  assert.equal(h.calls.confirm.length, 1);
});

test('[beemaps-bursts-029] lets a press through when the clock passed the wait before the timer ran', async () => {
  const h = harness();
  await h.quoted({ unlocked: false });
  h.clock.t = NOW + 1000;
  assert.equal(h.confirmChip().disabled, false);
  await h.confirmChip().onClick();
  assert.equal(h.calls.confirm.length, 1);
  assert.deepEqual(h.cleared, [1, 2]);
});

test('[beemaps-bursts-029] clears the timer of the wait when the quote is cancelled, ended or cleared by disable', async () => {
  const cancelled = harness();
  await cancelled.quoted({ unlocked: false });
  await cancelled.chip('cancel').onClick();
  assert.deepEqual(cancelled.cleared, [1, 2]);
  const ended = harness();
  await ended.quoted({ unlocked: false });
  ended.timers[0].fn();
  assert.deepEqual(ended.cleared, [1, 2]);
  const disabled = harness();
  await disabled.quoted({ unlocked: false });
  disabled.layer.disable(disabled.viewer);
  assert.deepEqual(disabled.cleared, [1, 2]);
  const done = harness();
  await done.quoted();
  done.layer.disable(done.viewer);
  assert.deepEqual(done.cleared, [1]);
});

test('[beemaps-bursts-029] gives the next quote its own period of 1000 milliseconds', async () => {
  const h = harness();
  await h.quoted();
  await h.chip('cancel').onClick();
  await h.chip('quote').onClick();
  assert.equal(h.timers.length, 4);
  assert.equal(h.timers[3].ms, 1000);
  assert.equal(h.confirmChip().disabled, true);
  await h.confirmChip().onClick();
  assert.equal(h.calls.confirm.length, 0);
  h.clock.t += 1000;
  assert.equal(h.confirmChip().disabled, false);
});

test('[beemaps-bursts-012] has disabled the Confirm chip and told the panel before the source gets the confirm call', async () => {
  const seen = [];
  let h;
  h = harness({
    confirm: async () => {
      seen.push({
        notices: h.notices(),
        chip: h.confirmChip(),
        cancel: h.chip('cancel'),
        info: h.info(),
      });
      return CREATED;
    },
  });
  await h.quoted();
  const before = h.notices();
  await h.confirmChip().onClick();
  assert.equal(seen.length, 1);
  assert.equal(seen[0].notices, before + 1);
  assert.equal(seen[0].chip.label, 'Sending…');
  assert.equal(seen[0].chip.disabled, true);
  assert.equal(seen[0].chip.busy, true);
  assert.equal(seen[0].cancel, undefined);
  assert.equal(seen[0].info, HINT);
});

test('[beemaps-bursts-012] sends no quote, list or cancel from old chips while a confirm request is open after disable and enable', async () => {
  const wait = deferred();
  const h = harness({ confirm: () => wait.promise });
  await h.quoted();
  const cancel = h.chip('cancel').onClick;
  const pressed = h.confirmChip().onClick();
  await cancel();
  assert.equal(h.confirmChip().label, 'Sending…');
  h.layer.disable(h.viewer);
  h.layer.enable(h.viewer);
  await h.chip('quote').onClick();
  await h.chip('list').onClick();
  assert.equal(h.calls.quote.length, 1);
  assert.equal(h.calls.list.length, 0);
  wait.resolve(CREATED);
  await pressed;
});

test('[beemaps-bursts-006] sends no second quote request from an old quote chip while a quote is shown', async () => {
  const h = harness();
  await h.ready();
  const old = h.chip('quote').onClick;
  await old();
  h.unlock();
  await old();
  assert.equal(h.calls.quote.length, 1);
  await h.chip('cancel').onClick();
  await old();
  assert.equal(h.calls.quote.length, 2);
});

test('[beemaps-bursts-030] tells the panel once for a status answer, and not for a status that was aborted', async () => {
  const h = harness();
  h.layer.init(h.viewer);
  h.layer.enable(h.viewer);
  const before = h.notices();
  await h.layer.update();
  assert.equal(h.notices(), before + 1);
  const wait = deferred();
  const h2 = harness({ status: () => wait.promise });
  h2.layer.init(h2.viewer);
  h2.layer.enable(h2.viewer);
  const pending = h2.layer.update();
  h2.layer.disable(h2.viewer);
  const count = h2.notices();
  wait.resolve({ ok: true, enabled: true, configured: true });
  await pending;
  assert.equal(h2.notices(), count);
});

test('[beemaps-bursts-030] tells the panel at the start and at the answer of a quote, and once for a view with no box', async () => {
  const wait = deferred();
  const h = harness({ quote: () => wait.promise });
  await h.ready();
  let n = h.notices();
  const pressed = h.chip('quote').onClick();
  assert.equal(h.notices(), n + 1);
  wait.resolve({ ok: true, quote: QUOTE });
  await pressed;
  assert.equal(h.notices(), n + 2);
  const failing = harness({
    quote: async () => ({ ok: false, status: 429, error: 'rate_limited' }),
  });
  await failing.ready();
  n = failing.notices();
  await failing.chip('quote').onClick();
  assert.equal(failing.notices(), n + 2);
  const sky = harness({ pick: () => undefined });
  await sky.ready();
  n = sky.notices();
  await sky.chip('quote').onClick();
  assert.equal(sky.notices(), n + 1);
});

test('[beemaps-bursts-030] tells the panel at the start and at the answer of a list, for a good and a failed answer', async () => {
  for (const answer of [
    { ok: true, bursts: [], total: 0, cached: false },
    { ok: false, status: 500, error: 'unknown' },
  ]) {
    const wait = deferred();
    const h = harness({ list: () => wait.promise });
    await h.ready();
    const n = h.notices();
    const pressed = h.chip('list').onClick();
    assert.equal(h.notices(), n + 1);
    wait.resolve(answer);
    await pressed;
    assert.equal(h.notices(), n + 2);
  }
});

test('[beemaps-bursts-030] tells the panel once for a cancel, for the end of a quote and for the end of the wait', async () => {
  const cancelled = harness();
  await cancelled.quoted();
  let n = cancelled.notices();
  await cancelled.chip('cancel').onClick();
  assert.equal(cancelled.notices(), n + 1);
  const ended = harness();
  await ended.quoted();
  n = ended.notices();
  ended.timers[0].fn();
  assert.equal(ended.notices(), n + 1);
  const waiting = harness();
  await waiting.quoted({ unlocked: false });
  n = waiting.notices();
  waiting.timers[1].fn();
  assert.equal(waiting.notices(), n + 1);
});

test('[beemaps-bursts-030] tells the panel at the start and at the answer of a confirm, whatever the answer was', async () => {
  for (const answer of [
    CREATED,
    { outcome: 'refused', status: 403, error: 'no_key' },
    { outcome: 'unknown', status: 502 },
  ]) {
    const h = harness({ confirm: async () => answer });
    await h.quoted();
    const n = h.notices();
    await h.confirmChip().onClick();
    assert.equal(h.notices(), n + 2);
  }
});

test('[beemaps-bursts-030] tells the panel zero times for a cancel press without a quote', async () => {
  const h = harness();
  await h.quoted();
  const old = h.chip('cancel').onClick;
  await old();
  const n = h.notices();
  await old();
  assert.equal(h.notices(), n);
});

test('[beemaps-bursts-030] tells the panel zero times for presses while another request is open', async () => {
  const wait = deferred();
  const h = harness({ list: () => wait.promise });
  await h.quoted();
  const pressed = h.chip('list').onClick();
  const n = h.notices();
  await h.chip('list').onClick();
  await h.confirmChip().onClick();
  assert.equal(h.notices(), n);
  wait.resolve({ ok: true, bursts: [], total: 0, cached: false });
  await pressed;
});

test('[beemaps-bursts-030] tells the panel zero times for presses after disable', async () => {
  const h = harness();
  await h.quoted();
  const press = h.confirmChip().onClick;
  const cancel = h.chip('cancel').onClick;
  const quote = h.chip('list').onClick;
  h.layer.disable(h.viewer);
  const n = h.notices();
  await press();
  await cancel();
  await quote();
  assert.equal(h.notices(), n);
});

test('[beemaps-bursts-030] calls no listener after setRowControlsListener(null)', async () => {
  const h = harness();
  await h.ready();
  const n = h.notices();
  h.layer.setRowControlsListener(null);
  await h.chip('quote').onClick();
  h.unlock();
  await h.confirmChip().onClick();
  await h.chip('list').onClick();
  await h.layer.update();
  assert.equal(h.notices(), n);
});

test('[beemaps-bursts-002] sends no confirm request when enable is called again while a quote is shown', async () => {
  const h = harness();
  await h.quoted();
  h.layer.enable(h.viewer);
  await tick();
  assert.equal(h.calls.confirm.length, 0);
  assert.equal(h.confirmChip().disabled, false);
});

test('[beemaps-bursts-002] removes the data source on destroy and gives a layer as new after init and enable', async () => {
  const h = harness({
    confirm: async () => ({ outcome: 'unknown', status: 0 }),
  });
  await h.quoted();
  await h.confirmChip().onClick();
  assert.equal(h.dataSource().name, 'beemaps-bursts');
  h.layer.destroy(h.viewer);
  assert.deepEqual(h.chips(), []);
  assert.equal(h.info(), HINT);
  assert.equal(await h.layer.update(), false);
  assert.deepEqual(h.added, []);
  h.layer.init(h.viewer);
  assert.equal(h.added.length, 1);
  h.layer.enable(h.viewer);
  await h.layer.update();
  assert.equal(h.info(), HINT);
  assert.deepEqual(
    h.chips().map((entry) => entry.id),
    ['quote', 'list'],
  );
  assert.deepEqual(h.entityIds(), []);
  assert.deepEqual(h.layer.getStats(), {
    count: 0,
    lastUpdate: null,
    error: null,
  });
});

test('[beemaps-bursts-017] gives the controls, the info text and the stats of a new layer after disable and enable, except the text of the last confirm', async () => {
  const h = harness({
    status: async () => ({ ok: true, enabled: false, configured: true }),
    list: async () => ({
      ok: true,
      bursts: [listed('a')],
      total: 1,
      cached: false,
    }),
  });
  await h.ready();
  assert.equal(h.chip('quote').disabled, true);
  const wait = deferred();
  const busy = harness({
    quote: () => wait.promise,
    list: async () => ({ ok: false, status: 500, error: 'unknown' }),
  });
  await busy.ready();
  await busy.chip('list').onClick();
  const pending = busy.chip('quote').onClick();
  busy.layer.disable(busy.viewer);
  assert.equal(busy.info(), HINT);
  assert.deepEqual(busy.layer.getStats(), {
    count: 0,
    lastUpdate: null,
    error: null,
  });
  busy.layer.enable(busy.viewer);
  assert.equal(busy.chip('quote').label, 'Quote burst here');
  assert.equal(busy.chip('quote').busy, false);
  wait.resolve({ ok: true, quote: QUOTE });
  await pending;
  assert.deepEqual(
    busy.chips().map((entry) => entry.id),
    ['quote', 'list'],
  );
  h.layer.disable(h.viewer);
  h.layer.enable(h.viewer);
  assert.equal(h.info(), HINT);
  assert.equal(h.chip('quote').disabled, false);
  assert.equal(h.chip('list').disabled, false);
});

test('[beemaps-bursts-017] removes the boxes and the stats of a list and a quote on disable', async () => {
  const h = harness({
    list: async () => ({
      ok: true,
      bursts: [listed('a')],
      total: 1,
      cached: false,
    }),
  });
  await h.quoted();
  await h.chip('list').onClick();
  assert.deepEqual(h.entityIds(), ['beemaps-bursts:quote', 'beemaps-bursts:a']);
  h.layer.disable(h.viewer);
  assert.deepEqual(h.entityIds(), []);
  assert.deepEqual(h.layer.getStats(), {
    count: 0,
    lastUpdate: null,
    error: null,
  });
});

test('[beemaps-bursts-017] forgets a press message, a status message and a failed status on disable', async () => {
  const h = harness({
    status: async () => ({ ok: true, enabled: true, configured: false }),
    pick: () => undefined,
  });
  await h.ready();
  assert.equal(h.chip('quote').disabled, true);
  h.layer.disable(h.viewer);
  assert.equal(h.info(), HINT);
  const failed = harness({
    status: async () => ({ ok: false }),
    pick: () => undefined,
  });
  await failed.ready();
  h.layer.enable(h.viewer);
  await failed.chip('quote').onClick();
  assert.notEqual(failed.layer.getStats().error, null);
  failed.layer.disable(failed.viewer);
  failed.layer.enable(failed.viewer);
  assert.equal(failed.info(), HINT);
  assert.equal(failed.layer.getStats().error, null);
});

test('[beemaps-bursts-005] shows the text for off first when the status is off and has no key', async () => {
  const h = harness({
    status: async () => ({ ok: true, enabled: false, configured: false }),
  });
  await h.ready();
  assert.equal(
    h.info(),
    'Bursts are off on this server. Set BEEMAPS_BURST_ENABLED=true in .env and restart the app.',
  );
});

test('[beemaps-bursts-005] does not abort a status request that has ended, and gives the press error before the status error', async () => {
  const h = harness();
  h.layer.init(h.viewer);
  h.layer.enable(h.viewer);
  await h.layer.update();
  await h.layer.update();
  assert.equal(h.calls.getStatus[0].signal.aborted, false);
  assert.equal(h.calls.getStatus[1].signal.aborted, false);
  const failing = harness({
    status: async () => ({ ok: false }),
    pick: () => undefined,
  });
  await failing.ready();
  await failing.chip('quote').onClick();
  assert.equal(
    failing.layer.getStats().error,
    'Point the view at the ground and press again.',
  );
  assert.equal(failing.info(), 'Point the view at the ground and press again.');
});

test('[beemaps-bursts-008] picks the point at the middle of the canvas on the ellipsoid of the globe', async () => {
  const h = harness();
  await h.ready();
  await h.chip('quote').onClick();
  assert.equal(h.picks.length, 1);
  assert.equal(h.picks[0][0].x, 400);
  assert.equal(h.picks[0][0].y, 300);
  assert.equal(h.picks[0][1], Cesium.Ellipsoid.WGS84);
  const small = harness({ canvas: { clientWidth: 1000, clientHeight: 200 } });
  await small.ready();
  await small.chip('quote').onClick();
  assert.equal(small.picks[0][0].x, 500);
  assert.equal(small.picks[0][0].y, 100);
});

test('[beemaps-bursts-008] gives the sky text for a viewer with no scene, and picks on the default ellipsoid for a viewer with no globe', async () => {
  const noScene = harness();
  noScene.layer.init(noScene.viewer);
  noScene.layer.enable(noScene.viewer);
  delete noScene.viewer.scene;
  await noScene.chip('quote').onClick();
  assert.equal(noScene.info(), 'Point the view at the ground and press again.');
  assert.equal(noScene.calls.quote.length, 0);
  const noGlobe = harness();
  await noGlobe.ready();
  delete noGlobe.viewer.scene.globe;
  await noGlobe.chip('quote').onClick();
  assert.equal(noGlobe.picks[0][1], undefined);
  assert.equal(noGlobe.calls.quote.length, 1);
});

test('[beemaps-bursts-001] names the missing methods in the error for a source that is missing', () => {
  assert.throws(
    () => createBeemapsBurstsLayer({ source: undefined }),
    /requires a source with getStatus, quote, confirm and list/,
  );
  assert.throws(
    () => createBeemapsBurstsLayer({ source: null }),
    /requires a source with getStatus, quote, confirm and list/,
  );
});

test('[beemaps-bursts-004] gives each chip its title and no busy flag when the layer is idle', async () => {
  const h = harness();
  await h.ready();
  assert.deepEqual(
    h
      .chips()
      .map((entry) => [entry.id, entry.title, entry.busy, entry.disabled]),
    [
      [
        'quote',
        'Ask for the price of a burst. A quote costs nothing.',
        false,
        false,
      ],
      [
        'list',
        'Ask Bee Maps for your bursts. This can cost money.',
        false,
        false,
      ],
    ],
  );
});

test('[beemaps-bursts-007] shows a Confirm chip that is not busy and a cancel chip that is enabled', async () => {
  const h = harness();
  await h.quoted();
  assert.equal(h.confirmChip().busy, false);
  assert.equal(h.chip('cancel').disabled, false);
  assert.equal(h.chip('list').busy, false);
});

test('[beemaps-bursts-006] marks only the chip of the open request as busy', async () => {
  const wait = deferred();
  const quoting = harness({ quote: () => wait.promise });
  await quoting.ready();
  const pressed = quoting.chip('quote').onClick();
  assert.equal(quoting.chip('quote').busy, true);
  assert.equal(quoting.chip('list').busy, false);
  wait.resolve({ ok: true, quote: QUOTE });
  await pressed;
  const listing = deferred();
  const h = harness({ list: () => listing.promise });
  await h.ready();
  const press = h.chip('list').onClick();
  assert.equal(h.chip('list').busy, true);
  assert.equal(h.chip('quote').busy, false);
  listing.resolve({ ok: true, bursts: [], total: 0, cached: false });
  await press;
  assert.equal(h.chip('list').busy, false);
});

test('[beemaps-bursts-018] sends the list call with the signal and no other field', async () => {
  const h = harness();
  await h.ready();
  await h.chip('list').onClick();
  assert.deepEqual(Object.keys(h.calls.list[0]), ['signal']);
});

test('[beemaps-bursts-007] shows the quote with no message of an earlier press and no error of an earlier press', async () => {
  let n = 0;
  const h = harness({
    pick: () =>
      n++ === 0 ? undefined : Cesium.Cartesian3.fromDegrees(10.0031, 59.9976),
  });
  await h.ready();
  await h.chip('quote').onClick();
  assert.equal(h.info(), 'Point the view at the ground and press again.');
  await h.chip('quote').onClick();
  assert.equal(h.info(), QUOTE_TEXT);
  assert.equal(h.layer.getStats().error, null);
});

test('[beemaps-bursts-011] shows the quote button again with its normal label after a cancel, and keeps no message', async () => {
  const h = harness();
  await h.quoted();
  await h.chip('cancel').onClick();
  assert.equal(h.chip('quote').label, 'Quote burst here');
  assert.equal(h.chip('quote').busy, false);
});

test('[beemaps-bursts-011] keeps the message of a press when a stale cancel press comes without a quote', async () => {
  const h = harness({
    quote: async () => ({ ok: false, status: 429, error: 'rate_limited' }),
  });
  await h.ready();
  const stale = h.chip('list').onClick;
  await h.chip('quote').onClick();
  const cancelHandlers = [];
  const q = harness();
  await q.quoted();
  cancelHandlers.push(q.chip('cancel').onClick);
  await q.chip('cancel').onClick();
  await q.chip('quote').onClick();
  q.layer.disable(q.viewer);
  q.layer.enable(q.viewer);
  const text = h.info();
  await cancelHandlers[0]();
  assert.equal(h.info(), text);
  assert.equal(typeof stale, 'function');
});

test('[beemaps-bursts-019] shows no message and no error after a good list that follows a failed list', async () => {
  let n = 0;
  const h = harness({
    list: async () =>
      n++ === 0
        ? { ok: false, status: 500, error: 'unknown' }
        : { ok: true, bursts: [listed('a')], total: 1, cached: false },
  });
  await h.ready();
  await h.chip('list').onClick();
  assert.notEqual(h.layer.getStats().error, null);
  await h.chip('list').onClick();
  assert.equal(h.layer.getStats().error, null);
  assert.equal(h.info(), '1 burst · 0 hits');
});

test('[beemaps-bursts-014] shows the credits of the answer when they differ from the quote, and the box of the quote for the burst', async () => {
  const h = harness({
    confirm: async () => ({
      ...CREATED,
      burst: { ...CREATED.burst, credits: 250 },
    }),
  });
  await h.quoted();
  await h.confirmChip().onClick();
  assert.match(h.info(), /^Burst created: 250 credits taken, 875 left/);
  const west = h
    .dataSource()
    .entities.getById(`beemaps-bursts:${BURST_ID}`)
    .rectangle.coordinates.getValue(Cesium.JulianDate.now()).west;
  assert.equal(Number(Cesium.Math.toDegrees(west).toFixed(6)), 9.987014);
});

test('[beemaps-bursts-014] clears the error of an earlier list failure when a burst is created', async () => {
  const h = harness({
    list: async () => ({ ok: false, status: 500, error: 'unknown' }),
  });
  await h.quoted();
  await h.chip('list').onClick();
  assert.notEqual(h.layer.getStats().error, null);
  await h.confirmChip().onClick();
  assert.equal(h.layer.getStats().error, null);
});

test('[beemaps-bursts-014] draws two created bursts in the order of their creation', async () => {
  let n = 0;
  const h = harness({
    confirm: async () => ({
      ...CREATED,
      burst: { ...CREATED.burst, id: `burst-${++n}` },
    }),
  });
  await h.quoted();
  await h.confirmChip().onClick();
  await h.chip('quote').onClick();
  h.unlock();
  await h.confirmChip().onClick();
  assert.deepEqual(h.entityIds(), [
    'beemaps-bursts:burst-1',
    'beemaps-bursts:burst-2',
  ]);
  assert.equal(h.layer.getStats().count, 2);
  assert.match(h.info(), /· 2 bursts · 0 hits$/);
});

test('[beemaps-bursts-002] removes the data source once and does nothing on a second destroy', async () => {
  const h = harness();
  await h.ready();
  h.layer.destroy(h.viewer);
  h.layer.destroy(h.viewer);
  assert.equal(h.viewer.removals, 1);
  const never = harness();
  never.layer.destroy(never.viewer);
  assert.equal(never.viewer.removals, undefined);
});

test('[beemaps-bursts-029] clears each timer of a quote once, also when the quote is cancelled before the layer is disabled', async () => {
  const h = harness();
  await h.quoted({ unlocked: false });
  await h.chip('cancel').onClick();
  h.layer.disable(h.viewer);
  h.layer.enable(h.viewer);
  h.layer.disable(h.viewer);
  assert.deepEqual(h.cleared, [1, 2]);
});

test('[beemaps-bursts-014] draws a created burst in blue when Bee Maps gives the status active', async () => {
  const h = harness();
  await h.quoted();
  await h.confirmChip().onClick();
  const blue = Cesium.Color.fromCssColorString('#38bdf8').withAlpha(0.25);
  const colour = h
    .dataSource()
    .entities.getById(`beemaps-bursts:${BURST_ID}`)
    .rectangle.material.getValue(Cesium.JulianDate.now()).color;
  assert.equal(Cesium.Color.equals(colour, blue), true);
});

test('[beemaps-bursts-011] keeps the message of a failed list after a cancel', async () => {
  const h = harness({
    list: async () => ({ ok: false, status: 500, error: 'unknown' }),
  });
  await h.quoted();
  await h.chip('list').onClick();
  await h.chip('cancel').onClick();
  assert.equal(h.info(), 'The server answered with an unknown error (500).');
});
