import test from 'node:test';
import assert from 'node:assert/strict';
import { createWindLayer, formatWindValidTime, windStats } from './index.js';

const snapshot = (model) => ({
  model,
  grid: { nx: 2, ny: 2 },
  cycle: { runIso: '2026-09-14T12:00:00Z', validIso: '2026-09-14T18:00:00Z' },
});
function harness(feed, diagnostics = {}) {
  const calls = [];
  const rendering = Object.fromEntries(
    ['attach', 'start', 'stop', 'clear', 'destroy', 'setField'].map((name) => [
      name,
      (...args) => calls.push([name, ...args]),
    ]),
  );
  rendering.getDiagnostics = () => diagnostics;
  const layer = createWindLayer({ feed, createRendering: () => rendering });
  layer.init({ container: {} });
  layer.enable();
  return { layer, calls };
}
test('[wind-009] forecast valid time and source age stay distinct', () => {
  assert.equal(formatWindValidTime('invalid'), null);
  assert.equal(
    formatWindValidTime('2026-01-05T06:30:00Z'),
    '2026-01-05 06:30 UTC',
  );
  assert.equal(
    windStats(snapshot('gfs')).lastUpdate,
    Date.parse('2026-09-14T12:00:00Z'),
  );
});
test('[wind-010] switching models clears old data and ignores an abort-insensitive late source', async () => {
  const pending = [];
  const { layer, calls } = harness({
    getSnapshot: (args) =>
      new Promise((resolve) => pending.push({ ...args, resolve })),
  });
  const first = layer.update();
  layer.setParams({ model: 'ifs' });
  await Promise.resolve();
  assert.equal(pending.length, 2);
  assert.equal(pending[0].signal.aborted, true);
  assert.equal(layer.getStats().count, 0);
  assert.equal(layer.getStats().model, 'IFS');
  pending[0].resolve(snapshot('gfs'));
  await first;
  assert.equal(calls.filter(([name]) => name === 'setField').length, 0);
  pending[1].resolve(snapshot('ifs'));
  await Promise.resolve();
  await Promise.resolve();
  assert.equal(calls.find(([name]) => name === 'setField')[1].model, 'ifs');
  assert.match(
    layer.getRowControls().info,
    /IFS forecast[\s\S]*Valid: 2026-09-14 18:00 UTC[\s\S]*Issued: 2026-09-14 12:00 UTC/,
  );
  layer.destroy();
});
test('[wind-010] external and owned cancellation both cancel source work; queued switches stop on disable', async () => {
  let signal;
  const { layer } = harness({
    getSnapshot: (args) => {
      signal = args.signal;
      return new Promise((resolve) =>
        signal.addEventListener('abort', () => resolve(snapshot('gfs')), {
          once: true,
        }),
      );
    },
  });
  const external = new AbortController();
  const update = layer.update(null, { signal: external.signal });
  layer.disable();
  assert.equal(signal.aborted, true);
  assert.equal(external.signal.aborted, false);
  assert.equal(await update, false);
  layer.enable();
  const other = layer.update(null, { signal: external.signal });
  external.abort();
  assert.equal(signal.aborted, true);
  await other;
  layer.setParams({ model: 'ifs' });
  layer.disable();
  await Promise.resolve();
  assert.equal(layer.getStats().loading, false);
  layer.destroy();
});

const complete = (model, extra = {}) => ({
  ...snapshot(model),
  grid: { nx: 2, ny: 2, lo1: 0, la1: 90, dx: 180, dy: 180 },
  u: new Float32Array(4).fill(4),
  v: new Float32Array(4).fill(3),
  ...extra,
});
test('[wind-011] local appearance and units reuse the loaded field; optional scalar requests remain separate', async () => {
  const requests = [];
  const { layer, calls } = harness({
    getSnapshot: async (args) => {
      requests.push(args);
      return complete(
        args.model,
        args.overlay === 'pressure'
          ? {
              scalar: {
                kind: 'pressure',
                units: 'hPa',
                values: new Float32Array(4).fill(1013),
              },
            }
          : {},
      );
    },
  });
  await layer.update();
  layer.setParams({ overlay: 'none' });
  layer.setParams({ overlay: 'speed', units: 'mph', paused: true });
  await Promise.resolve();
  assert.equal(requests.length, 1, 'speed/units/pause do not download weather');
  assert.deepEqual(layer.getParams(), {
    model: 'gfs',
    overlay: 'speed',
    units: 'mph',
    paused: true,
  });
  layer.setParams({ overlay: 'pressure' });
  await Promise.resolve();
  await Promise.resolve();
  assert.equal(requests.length, 2);
  assert.equal(requests[1].overlay, 'pressure');
  assert.equal(layer.getStats().overlay, 'pressure');
  assert.ok(layer.getRowControls().info.includes('(hPa)'));
  assert.equal(layer.getRowControls().legend.at(-1).label, '1050+');
  layer.destroy();
});
test('[wind-011] local appearance changes preserve an in-flight first load', async () => {
  const requests = [];
  const { layer } = harness({
    getSnapshot: (args) =>
      new Promise((resolve) => requests.push({ ...args, resolve })),
  });
  const first = layer.update();
  layer.setParams({ overlay: 'none' });
  await Promise.resolve();
  assert.equal(requests.length, 1);
  assert.equal(requests[0].signal.aborted, false);
  assert.equal(layer.getStats().loading, true);
  requests[0].resolve(complete('gfs'));
  await first;
  assert.equal(layer.getStats().count, 4);
  assert.equal(layer.getStats().loading, false);
  layer.destroy();
});
test('[wind-011] re-enable and an appearance change cannot reuse a released renderer field', async () => {
  const requests = [];
  const { layer, calls } = harness({
    getSnapshot: (args) =>
      new Promise((resolve) => requests.push({ ...args, resolve })),
  });
  const first = layer.update();
  requests[0].resolve(complete('gfs'));
  await first;
  layer.disable();
  assert.equal(layer.getStats().count, 0);
  layer.enable();
  const second = layer.update();
  layer.setParams({ overlay: 'none' });
  await Promise.resolve();
  assert.equal(requests.length, 2);
  assert.equal(requests[1].signal.aborted, false);
  assert.equal(layer.getStats().loading, true);
  requests[1].resolve(complete('gfs'));
  await second;
  assert.equal(
    calls.filter(([name]) => name === 'setField').length,
    2,
    'new field must reach the cleared renderer',
  );
  assert.equal(layer.getStats().count, 4);
  assert.equal(layer.getStats().loading, false);
  layer.destroy();
});
test('[wind-012] missing optional scalar retains valid wind and labels the field unavailable', async () => {
  const { layer } = harness({
    getSnapshot: async () =>
      complete('gfs', {
        overlay: 'pressure',
        scalarError: 'Mean sea level pressure field unavailable',
      }),
  });
  layer.setParams({ overlay: 'pressure' });
  await Promise.resolve();
  await Promise.resolve();
  assert.equal(layer.getStats().count, 4);
  assert.match(layer.getStats().error, /pressure field unavailable/);
  assert.match(layer.getRowControls().info, /Selected field unavailable/);
  assert.deepEqual(layer.getRowControls().legend, []);
  layer.destroy();
});

test('[wind-012] a pending companion does not claim that it is already unavailable', async () => {
  let resolve;
  const { layer } = harness({
    getSnapshot: (args) =>
      args.overlay === 'none'
        ? Promise.resolve(complete('gfs'))
        : new Promise((done) => {
            resolve = done;
          }),
  });
  await layer.update();
  layer.setParams({ overlay: 'pressure' });
  await Promise.resolve();
  assert.equal(layer.getStats().loading, true);
  assert.doesNotMatch(
    layer.getRowControls().info,
    /Selected field unavailable/,
  );
  resolve(
    complete('gfs', {
      scalarError: 'Mean sea level pressure field unavailable',
    }),
  );
  await Promise.resolve();
  await Promise.resolve();
  assert.match(layer.getRowControls().info, /Selected field unavailable/);
  layer.destroy();
});
test('[wind-013] an imagery failure appears in status and cannot retain a misleading field legend', async () => {
  const diagnostics = { imageryError: null };
  const { layer } = harness(
    { getSnapshot: async () => complete('gfs') },
    diagnostics,
  );
  await layer.update();
  diagnostics.imageryError = 'Globe field image unavailable';
  assert.equal(layer.getStats().error, 'Globe field image unavailable');
  assert.match(layer.getRowControls().info, /Globe field image unavailable/);
  assert.deepEqual(layer.getRowControls().legend, []);
  layer.destroy();
});
test('[wind-013] renderer readiness pushes fresh loading stats and controls to the displayed row', async () => {
  let ready = false;
  let statusChanged;
  const rendering = {
    attach() {},
    start() {},
    stop() {},
    clear() {},
    destroy() {},
    setField() {},
    getDiagnostics: () => ({
      renderMode: 'gpu-streamlines',
      gpu: { pathCount: 10, ready },
    }),
  };
  const layer = createWindLayer({
    feed: { getSnapshot: async () => snapshot('gfs') },
    createRendering(options) {
      statusChanged = options.onStatusChange;
      return rendering;
    },
  });
  layer.init({ container: {} });
  layer.enable();
  let displayed;
  layer.setRowControlsListener(() => {
    displayed = {
      loading: layer.getStats().loading,
      info: layer.getRowControls().info,
    };
  });
  const update = layer.update();
  const loadingInfo = layer.getRowControls().info;
  assert.match(loadingInfo, /Valid: [^\n]+ · loading/);
  await update;
  assert.equal(displayed.loading, true);
  assert.match(displayed.info, /Valid: [^\n]+ · preparing/);
  assert.equal(displayed.info.split('\n').length, loadingInfo.split('\n').length);
  ready = true;
  statusChanged();
  assert.equal(displayed.loading, false);
  assert.doesNotMatch(displayed.info, / · preparing| · loading/);
  assert.equal(displayed.info.split('\n').length, loadingInfo.split('\n').length);
  layer.destroy();
});

test('[wind-015] weather summary describes the selected forecast and count remains numeric', async () => {
  const { layer } = harness({ getSnapshot: async () => complete('gfs') });
  await layer.update();
  assert.equal(typeof layer.getStats().count, 'number');
  assert.equal(layer.getStats().countLabel, 'Forecast');
  const summary = layer.getRowControls().summary;
  assert.equal(summary.label, 'Wind motion');
  assert.equal(summary.units, 'km/h');
  assert.match(summary.detail, /GFS forecast.*UTC/);
  assert.equal((summary.detail.match(/UTC/g) || []).length, 1);
  assert.equal(layer.getRowControls().chips.find(c => c.id === 'overlay-temperature').label, 'Temperature');
  layer.destroy();
});

test('[wind-014] sample stays fixed across model, field and unit changes; dismissal and disable clear marker', async () => {
  const nodes = [];
  let listener;
  let samples = 0;
  const container = {
    ownerDocument: { createElement: () => ({ style: {}, setAttribute() {}, remove() { nodes.splice(nodes.indexOf(this), 1); } }) },
    appendChild(node) { nodes.push(node); },
    getBoundingClientRect: () => ({ left: 0, top: 0 }),
  };
  const viewer = {
    container,
    camera: { positionWC: {}, pickEllipsoid: () => { samples++; return { longitude: 0, latitude: 0 }; } },
    scene: {
      mode: 3,
      canvas: { clientWidth: 800, clientHeight: 600, getBoundingClientRect: () => ({ left: 0, top: 0 }) },
      cartesianToCanvasCoordinates: () => ({ x: 400, y: 300 }),
      postRender: { addEventListener(fn) { listener = fn; return () => { listener = null; }; } },
      requestRender() {},
    },
  };
  const rendering = Object.fromEntries(['attach', 'start', 'stop', 'clear', 'destroy', 'setField'].map(name => [name, () => {}]));
  const layer = createWindLayer({
    feed: { getSnapshot: async ({ model }) => complete(model) },
    cesium: {
      Cartesian2: class {}, Ellipsoid: { WGS84: {} }, SceneMode: { SCENE3D: 3 },
      Cartographic: { fromCartesian: point => point }, Math: { toDegrees: value => value },
      EllipsoidalOccluder: class { isPointVisible() { return true; } },
    },
    createRendering: () => rendering,

  });
  layer.init(viewer);
  layer.enable();
  await layer.update();
  layer.setParams({ inspect: true });
  const captured = layer.getRowControls().summary.reading;
  assert.equal(samples, 1);
  const retained = nodes[0];
  layer.setParams({ units: 'mph' });
  assert.equal(nodes[0], retained);
  const changed = layer.getRowControls().summary.reading;
  assert.equal(changed.speed, captured.speed);
  assert.equal(changed.coordinates, captured.coordinates);
  assert.match(changed.wind, /mph/);
  assert.equal(samples, 1, 'units do not resample');
  assert.equal(layer.getRowControls().summary.result.id, 'reading');
  assert.deepEqual(layer.getRowControls().summary.settings.map(({ label }) => label), ['MODEL', 'FIELD', 'UNITS', 'MOTION']);
  assert.equal(nodes.length, 1);
  assert.equal(typeof listener, 'function');
  viewer.camera.pickEllipsoid = () => { samples++; return { longitude: 70, latitude: 20 }; };
  layer.setParams({ overlay: 'speed' });
  assert.equal(layer.getRowControls().summary.reading.coordinates, captured.coordinates);
  layer.setParams({ model: 'ifs' });
  await new Promise(resolve => setImmediate(resolve));
  const resampled = layer.getRowControls().summary.reading;
  assert.equal(resampled.coordinates, captured.coordinates);
  assert.equal(resampled.model, 'ECMWF');
  assert.equal(resampled.position, captured.position);
  assert.equal(samples, 1, 'model and field changes never sample the moved camera');
  assert.match(layer.getRowControls().summary.result.lines.find(({ id }) => id === 'meta').text, /ECMWF · valid/);
  await layer.update();
  assert.equal(layer.getRowControls().summary.reading.coordinates, captured.coordinates);
  layer.setParams({ inspect: true });
  assert.equal(layer.getRowControls().summary.reading.coordinates, '20.00°N · 70.00°E');
  assert.equal(samples, 2, 'the next explicit read samples the new center');
  for (const change of [() => layer.setParams({ inspect: false }), () => layer.disable()]) {
    layer.setParams({ inspect: true });
    assert.equal(nodes.length, 1);
    change();
    assert.equal(nodes.length, 0);
    assert.equal(layer.getRowControls().summary.reading, null);
    assert.equal(layer.getRowControls().summary.result, null);
    assert.equal(listener, null);
  }
  layer.destroy();
});

test('[wind-009] observed history labels wind as a forecast without changing its data or parameters', async () => {
  const { createWeatherClock } = await import('../weather/clock.js');
  const clock = createWeatherClock();
  const layer = createWindLayer({ feed: { getSnapshot: async () => snapshot('gfs') }, clock });
  let changes = 0;
  layer.setRowControlsListener(() => changes++);
  const params = layer.getParams();
  await clock.setTarget('2026-09-14T12:00:00.000Z');
  assert.equal(layer.getRowControls().summary.status, null, 'history does not mask source status');
  assert.ok(changes > 0);
  assert.match(layer.getRowControls().info, /Forecast · does not follow history/);
  assert.deepEqual(layer.getParams(), params);
  await clock.latest();
  assert.equal(layer.getRowControls().summary.status, null);
  layer.destroy();
  const before = changes;
  await clock.setTarget('2026-09-14T12:00:00.000Z');
  assert.equal(changes, before);
  clock.destroy();
});

test('[wind-015] wind unit chips appear only alongside a speed legend, including canvas trails', async () => {
  let renderMode = 'gpu-streamlines'; let imageryError = null;
  const layer = createWindLayer({ feed: { getSnapshot: async () => complete('gfs') }, createRendering: () => ({ attach() {}, start() {}, clear() {}, setField() {}, setOptions() {}, getDiagnostics: () => ({ renderMode, imageryError }), stop() {}, destroy() {} }) });
  layer.init({ container: {} }); layer.enable(); await layer.update();
  const unitChips = () => layer.getRowControls().chips.filter(({ id }) => id.startsWith('units-'));
  assert.equal(layer.getRowControls().readout, true); assert.equal(layer.getRowControls().summary.coverage, 'Global · 1° grid');
  assert.deepEqual(unitChips(), []); assert.deepEqual(layer.getRowControls().legend, []);
  renderMode = 'canvas-fallback'; assert.equal(unitChips().length, 3); assert.ok(layer.getRowControls().legend.length);
  renderMode = 'gpu-streamlines'; layer.setParams({ overlay: 'speed' }); assert.equal(unitChips().length, 3);
  imageryError = 'Unavailable'; assert.deepEqual(unitChips(), []); imageryError = null;
  for (const overlay of ['pressure', 'temperature', 'none']) { layer.setParams({ overlay }); assert.deepEqual(unitChips(), []); }
  layer.destroy();
});

test('[wind-009] layer needs a source and reports absent data', () => {
  assert.throws(() => createWindLayer(), /Wind requires a snapshot source/);
  assert.deepEqual(windStats({ unavailable: true }), { count: 0, lastUpdate: null, error: 'Wind unavailable' });
  assert.equal(windStats({ reason: 'No grid' }).error, 'No grid');
});

test('[wind-013] layer gives renderer the current imagery host', async () => {
  let options;
  const actions = [];
  const renderer = { attach() {}, rehome() { actions.push('rehome'); }, setOptions() {}, start() {}, stop() {}, clear() {}, destroy() {} };
  const layer = createWindLayer({ feed: { getSnapshot: async () => ({ unavailable: true }) }, createRendering: (value) => { options = value; return renderer; } });
  const viewer = { container: {}, imageryLayers: { id: 'globe' }, scene: { imageryLayers: { id: 'scene' } } };
  layer.init(viewer);
  assert.equal(options.getViewer(), viewer);
  assert.deepEqual(options.getHost(), { collection: viewer.imageryLayers, kind: 'globe' });
  layer.attachShellServices({ imageryHost: () => ({ collection: 'tiles', kind: 'tiles' }) });
  assert.deepEqual(options.getHost(), { collection: 'tiles', kind: 'tiles' });
  layer.attachShellServices({ imageryHost: null });
  assert.equal(options.getHost().collection, viewer.imageryLayers);
  delete viewer.imageryLayers;
  assert.equal(options.getHost().collection, viewer.scene.imageryLayers);
  layer.enable();
  assert.equal(await layer.update(), true);
  assert.equal(actions.length, 3);
  layer.destroy();
});

test('[wind-012] unavailable snapshot clears the renderer', async () => {
  const { layer, calls } = harness({ getSnapshot: async () => ({ unavailable: true, reason: 'No wind' }) });
  assert.equal(await layer.update(), true);
  assert.equal(layer.getStats().error, 'No wind');
  assert.equal(calls.some(([name]) => name === 'clear'), true);
  layer.destroy();
});

test('[wind-013] source error reaches status and renderer counts', async () => {
  const { layer } = harness({ getSnapshot: async () => { throw new Error('Grid error'); } });
  assert.equal(await layer.update(), true);
  assert.equal(layer.getStats().error, 'Grid error');
  assert.match(layer.getRowControls().info, /Grid error/);
  layer.destroy();
  assert.deepEqual(layer.getDiagnostics(), {});
  assert.equal(layer.getParticleCount(), 0);
});

test('[wind-013] layer reads renderer counts and reduced motion', () => {
  const diagnostics = { reducedMotion: true, renderMode: 'gpu-streamlines', gpu: { pathCount: 1, ready: false } };
  const { layer } = harness({ getSnapshot: async () => complete('gfs') }, diagnostics);
  assert.equal(layer.getRowControls().chips.find((chip) => chip.id === 'motion').label, 'Reduced motion');
  assert.equal(layer.getRowControls().chips.find((chip) => chip.id === 'motion').disabled, true);
  layer.destroy();
});

test('[wind-010] update skips disabled state and aborts old work', async () => {
  const pending = [];
  const { layer } = harness({ getSnapshot: ({ signal }) => new Promise((resolve, reject) => { pending.push({ signal, resolve, reject }); }) });
  const first = layer.update();
  const second = layer.update();
  assert.equal(pending[0].signal.aborted, true);
  pending[0].reject(new Error('old request'));
  assert.equal(await first, false);
  pending[1].resolve(complete('gfs'));
  assert.equal(await second, true);
  layer.disable();
  assert.equal(await layer.update(), false);
  layer.destroy();
});

test('[wind-013] source error without a message uses a fixed status', async () => {
  const { layer } = harness({ getSnapshot: async () => { throw null; } });
  assert.equal(await layer.update(), true);
  assert.equal(layer.getStats().error, 'Wind source unavailable');
  layer.setRowControlsListener('bad');
  layer.destroy();
});

test('[wind-012] stale wind appears in row and stats', async () => {
  const { layer } = harness({ getSnapshot: async () => complete('gfs', { stale: true }) });
  assert.equal(await layer.update(), true);
  assert.equal(layer.getRowControls().summary.status, 'Cached forecast · stale');
  assert.match(layer.getRowControls().info, /STALE/);
  assert.equal(layer.getStats().stale, true);
  layer.destroy();
});

test('[wind-013] renderer optional status methods can be absent', () => {
  const layer = createWindLayer({ feed: { getSnapshot: async () => complete('gfs') }, createRendering: () => ({ attach() {}, setOptions() {}, start() {}, stop() {}, clear() {}, destroy() {}, getParticleCount: () => 0 }) });
  layer.init({ container: {} });
  layer.enable();
  assert.deepEqual(layer.getDiagnostics(), {});
  assert.equal(layer.getParticleCount(), 0);
  layer.destroy();
});

test('[wind-010] an old abort signal stops an update', async () => {
  let calls = 0;
  const { layer } = harness({ getSnapshot: async () => { calls++; return complete('gfs'); } });
  const controller = new AbortController();
  controller.abort(new Error('old signal'));
  assert.equal(await layer.update(null, { signal: controller.signal }), false);
  assert.equal(calls, 0);
  layer.destroy();
});

test('[wind-014] empty center readout has no saved point', async () => {
  const { layer } = harness({ getSnapshot: async () => complete('gfs') });
  assert.equal(await layer.update(), true);
  layer.setParams({ inspect: true });
  assert.equal(layer.getRowControls().summary.reading.coordinates, 'No surface reading');
  layer.destroy();
});

test('[wind-014] readout uses an absent time and stale source label', async () => {
  const old = complete('gfs', { stale: true, cycle: {} });
  const { layer } = harness({ getSnapshot: async () => old });
  assert.equal(await layer.update(), true);
  layer.setParams({ inspect: true });
  const readout = layer.getRowControls().summary.reading;
  assert.equal(readout.validTime, 'Unavailable');
  assert.equal(readout.status, 'Cached forecast · stale');
  layer.destroy();
});

test('[wind-011] a new scalar choice requests a new field', async () => {
  const requests = [];
  const { layer } = harness({ getSnapshot: async (args) => { requests.push(args.overlay); return complete('gfs', args.overlay === 'temperature' ? { scalar: { kind: 'temperature', units: '°C', values: new Float32Array(4) } } : {}); } });
  assert.equal(await layer.update(), true);
  layer.setParams({ overlay: 'temperature' });
  await Promise.resolve();
  await Promise.resolve();
  assert.deepEqual(requests, ['none', 'temperature']);
  layer.destroy();
});

test('[wind-013] renderer null diagnostics use an empty result', () => {
  const { layer } = harness({ getSnapshot: async () => complete('gfs') });
  layer.destroy();
  assert.deepEqual(layer.getDiagnostics(), {});
});

test('[wind-011] a scalar switch checks the current scalar kind', async () => {
  const requests = [];
  const { layer } = harness({ getSnapshot: async (args) => { requests.push(args.overlay); return complete('gfs', { scalar: { kind: args.overlay, units: '°C', values: new Float32Array(4) } }); } });
  layer.setParams({ overlay: 'temperature' });
  await Promise.resolve();
  await Promise.resolve();
  layer.setParams({ overlay: 'pressure' });
  await Promise.resolve();
  await Promise.resolve();
  assert.deepEqual(requests, ['temperature', 'pressure']);
  layer.destroy();
});

test('[wind-011] a speed choice starts an absent field', async () => {
  let calls = 0;
  const { layer } = harness({ getSnapshot: async () => { calls++; return complete('gfs'); } });
  layer.setParams({ overlay: 'speed' });
  await Promise.resolve();
  await Promise.resolve();
  assert.equal(calls, 1);
  layer.destroy();
});

test('[wind-013] null renderer diagnostics give an empty result', () => {
  const layer = createWindLayer({ feed: { getSnapshot: async () => complete('gfs') }, createRendering: () => ({ attach() {}, setOptions() {}, start() {}, stop() {}, clear() {}, destroy() {}, getDiagnostics: () => null }) });
  layer.init({ container: {} });
  assert.deepEqual(layer.getDiagnostics(), {});
  layer.destroy();
});

test('[wind-012] absent scalar sets the row status', async () => {
  const { layer } = harness({ getSnapshot: async () => complete('gfs') });
  layer.setParams({ overlay: 'temperature' });
  await Promise.resolve();
  await Promise.resolve();
  assert.equal(layer.getRowControls().summary.status, 'Selected field unavailable');
  layer.destroy();
});
