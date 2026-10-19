import assert from 'node:assert/strict';
import test from 'node:test';
import * as Cesium from 'cesium';
import { createGdacsLayer } from './index.js';

const ID = 'gdacs';
const hex = (n) => `FL-${n}`;
function item(n, overrides = {}) {
  return {
    id: hex(n),
    type: 'FL',
    name: `Event ${n}`,
    alert: 'green',
    current: true,
    latitude: 10,
    longitude: 20,
    modified: '2026-10-16T07:00:00.000Z',
    ...overrides,
  };
}
function snapshot(events, meta = {}) {
  return {
    events,
    meta: {
      unavailable: false,
      stale: false,
      reason: null,
      fetchedAt: '2026-10-16T08:00:00.000Z',
      total: events.length,
      ...meta,
    },
  };
}
const THREE = [
  item(1, { alert: 'green', current: true, latitude: 10, longitude: 20 }),
  item(2, {
    alert: 'orange',
    current: false,
    latitude: -5.5,
    longitude: 100.25,
  }),
  item(3, { alert: 'red', current: true, latitude: 45, longitude: -120 }),
];
const deferred = () => {
  let resolve;
  let reject;
  const promise = new Promise((ok, no) => {
    resolve = ok;
    reject = no;
  });
  return { promise, resolve, reject };
};

function harness(getSnapshot = async () => snapshot(THREE)) {
  const added = [];
  const removed = [];
  const viewer = {
    dataSources: {
      add(dataSource) {
        added.push(dataSource);
      },
      remove(dataSource, destroy) {
        added.splice(added.indexOf(dataSource), 1);
        removed.push([dataSource, destroy]);
      },
    },
  };
  const overlay = { entries: new Map(), visible: new Map(), calls: [] };
  const overlayHost = {
    setEntries(id, entries, options) {
      overlay.entries.set(id, entries);
      overlay.calls.push(['setEntries', id, entries, options]);
    },
    setVisible(id, visible) {
      overlay.visible.set(id, visible);
      overlay.calls.push(['setVisible', id, visible]);
    },
    clearSource(id) {
      overlay.entries.delete(id);
      overlay.calls.push(['clearSource', id]);
    },
  };
  const calls = [];
  const source = {
    getSnapshot(options) {
      calls.push(options);
      return getSnapshot(options, calls.length);
    },
  };
  const layer = createGdacsLayer({ source, overlayHost });
  return { layer, viewer, overlay, calls, added, removed };
}
function enabled(getSnapshot) {
  const h = harness(getSnapshot);
  h.layer.init(h.viewer);
  h.layer.enable(h.viewer);
  return h;
}
const entitiesOf = (h) => h.added[0].entities.values;
const now = () => Cesium.JulianDate.now();

test('[gdacs-layer-001] describes the layer and refuses to create a layer with no source or no overlay host', () => {
  const { layer } = harness();
  assert.equal(layer.id, 'gdacs');
  assert.equal(layer.name, 'Disaster Alerts');
  assert.equal(layer.icon, '\u{1f6a8}');
  assert.equal(layer.source, 'GDACS');
  assert.equal(layer.updateInterval, 600000);
  assert.equal('getAnalystRecords' in layer, false);
  assert.deepEqual(layer.getStats(), {
    count: 0,
    lastUpdate: null,
    error: null,
  });
  const overlayHost = { setEntries() {}, setVisible() {}, clearSource() {} };
  assert.throws(() => createGdacsLayer(), TypeError);
  assert.throws(() => createGdacsLayer({ overlayHost }), TypeError);
  assert.throws(() => createGdacsLayer({ source: {}, overlayHost }), TypeError);
  assert.throws(
    () => createGdacsLayer({ source: { getSnapshot: 'x' }, overlayHost }),
    TypeError,
  );
  assert.throws(
    () => createGdacsLayer({ source: { getSnapshot() {} } }),
    TypeError,
  );
  assert.throws(
    () => createGdacsLayer({ source: { getSnapshot() {} }, overlayHost: null }),
    TypeError,
  );
});

test('[gdacs-layer-002] sends no request when init and enable run, refuses a second call of init, and accepts a call of init after destroy', async () => {
  const h = harness();
  h.layer.init(h.viewer);
  assert.equal(h.added.length, 1);
  assert.equal(h.added[0].show, false);
  assert.equal(h.added[0].name, 'gdacs');
  assert.equal(h.overlay.visible.get(ID), false);
  h.layer.enable(h.viewer);
  assert.equal(h.added[0].show, true);
  assert.equal(h.overlay.visible.get(ID), true);
  assert.equal(h.calls.length, 0);
  assert.throws(() => h.layer.init(h.viewer), {
    message: 'GDACS layer is already initialized',
  });
  assert.equal(h.added.length, 1);
  h.layer.disable(h.viewer);
  assert.equal(h.added[0].show, false);
  assert.equal(h.overlay.visible.get(ID), false);

  h.layer.destroy(h.viewer);
  assert.equal(h.added.length, 0);
  h.layer.init(h.viewer);
  h.layer.enable(h.viewer);
  assert.equal(h.added.length, 1);
  assert.equal(await h.layer.update(h.viewer), true);
  assert.equal(entitiesOf(h).length, 3);
});

test('[gdacs-layer-012] shows the points on the ground and the labels, and fills the stats', async () => {
  const h = enabled();
  assert.equal(await h.layer.update(h.viewer), true);
  assert.equal(h.calls.length, 1);
  assert.equal(typeof h.calls[0].signal.aborted, 'boolean');
  const entities = entitiesOf(h);
  assert.deepEqual(
    entities.map((entity) => entity.id),
    THREE.map((entry) => `gdacs:${entry.id}`),
  );
  const expected = [
    ['#22c55e', 1, 10],
    ['#f97316', 0.45, 6],
    ['#ef4444', 1, 10],
  ];
  entities.forEach((entity, index) => {
    const entry = THREE[index];
    assert.ok(
      Cesium.Cartesian3.equals(
        entity.position.getValue(now()),
        Cesium.Cartesian3.fromDegrees(entry.longitude, entry.latitude),
      ),
      entry.id,
    );
    const [css, alpha, size] = expected[index];
    assert.equal(entity.point.pixelSize.getValue(now()), size);
    assert.ok(
      Cesium.Color.equals(
        entity.point.color.getValue(now()),
        Cesium.Color.fromCssColorString(css).withAlpha(alpha),
      ),
      css,
    );
    assert.equal(
      entity.point.heightReference.getValue(now()),
      Cesium.HeightReference.CLAMP_TO_GROUND,
    );
  });
  const call = h.overlay.calls.filter(([name]) => name === 'setEntries').at(-1);
  assert.equal(call[1], 'gdacs');
  assert.deepEqual(call[3], {
    cohortLimit: 48,
    collisionCapacity: 24,
    moving: false,
  });
  assert.deepEqual(
    call[2].map((entry) => entry.id),
    [hex(3), hex(1), hex(2)],
  );
  assert.ok(
    Cesium.Cartesian3.equals(
      call[2][0].position,
      Cesium.Cartesian3.fromDegrees(-120, 45),
    ),
  );
  assert.equal(call[2][0].title, 'Event 3');
  assert.equal(call[2][0].accent, '#ef4444');
  const stats = h.layer.getStats();
  assert.equal(stats.count, 3);
  assert.equal(Number.isFinite(stats.lastUpdate), true);
  assert.equal(stats.error, null);
  assert.equal(stats.status, undefined);
  assert.equal(stats.statusMessage, undefined);

  let step = 0;
  const twice = enabled(async () => {
    step += 1;
    return snapshot(step === 1 ? THREE : THREE.slice(1, 2));
  });
  await twice.layer.update(twice.viewer);
  assert.equal(entitiesOf(twice).length, 3);
  await twice.layer.update(twice.viewer);
  assert.deepEqual(
    entitiesOf(twice).map((entity) => entity.id),
    [`gdacs:${hex(2)}`],
  );
  assert.deepEqual(
    twice.overlay.entries.get(ID).map((entry) => entry.id),
    [hex(2)],
  );
  assert.equal(twice.layer.getStats().count, 1);

  const crowded = [];
  for (let n = 1; n <= 60; n += 1)
    crowded.push(
      item(n, {
        alert: ['orange', 'green', 'red'][n % 3],
        modified: new Date(Date.UTC(2026, 9, 16, 0, n)).toISOString(),
        latitude: n,
        longitude: n,
      }),
    );
  const many = enabled(async () => snapshot(crowded.slice().reverse()));
  assert.equal(await many.layer.update(many.viewer), true);
  assert.equal(entitiesOf(many).length, 60);
  const labels = many.overlay.entries.get(ID);
  assert.equal(labels.length, 48);
  assert.equal(labels[0].id, hex(59));
  assert.equal(labels[0].priority, 100000);
  assert.equal(labels[1].priority, 99999);
  assert.equal(labels[47].priority, 99953);
  assert.deepEqual(
    labels.slice(0, 20).map((entry) => entry.id),
    [
      59, 56, 53, 50, 47, 44, 41, 38, 35, 32, 29, 26, 23, 20, 17, 14, 11, 8, 5,
      2,
    ].map(hex),
  );
  for (const entry of labels) {
    const n = Number(entry.id.slice(3));
    assert.ok(
      Cesium.Cartesian3.equals(
        entry.position,
        Cesium.Cartesian3.fromDegrees(n, n),
      ),
      entry.id,
    );
  }
});

test('[gdacs-layer-013] removes the points when GDACS is unavailable and gives the reason as guidance', async () => {
  const results = [
    snapshot(THREE.slice(0, 2)),
    snapshot(THREE.slice(0, 2), {
      unavailable: true,
      reason: 'GDACS feed down',
    }),
    snapshot([], { unavailable: true, reason: null }),
    snapshot(THREE.slice(0, 2)),
  ];
  let step = 0;
  const h = enabled(async () => results[step++]);
  await h.layer.update(h.viewer);
  assert.equal(entitiesOf(h).length, 2);
  assert.equal(h.overlay.entries.get(ID).length, 2);
  assert.equal(await h.layer.update(h.viewer), true);
  assert.equal(entitiesOf(h).length, 0);
  assert.equal(h.overlay.entries.has(ID), false);
  const stats = h.layer.getStats();
  assert.equal(stats.count, 0);
  assert.equal(stats.status, 'idle');
  assert.equal(stats.statusMessage, 'GDACS feed down');
  assert.equal(stats.error, null);
  assert.equal(await h.layer.update(h.viewer), true);
  assert.equal(h.layer.getStats().statusMessage, 'GDACS unavailable');
  assert.equal(h.layer.getStats().status, 'idle');
  assert.equal(await h.layer.update(h.viewer), true);
  assert.equal(entitiesOf(h).length, 2);
  assert.equal(h.layer.getStats().count, 2);
  assert.equal(Object.hasOwn(h.layer.getStats(), 'status'), false);
  assert.equal(Object.hasOwn(h.layer.getStats(), 'statusMessage'), false);

  // An unavailable result after a failed request clears the error.
  let call = 0;
  const after = enabled(async () => {
    call += 1;
    if (call === 1) throw new Error('GDACS HTTP 503');
    return snapshot([], { unavailable: true, reason: 'GDACS feed down' });
  });
  assert.equal(await after.layer.update(after.viewer), false);
  assert.equal(after.layer.getStats().error, 'GDACS HTTP 503');
  assert.equal(await after.layer.update(after.viewer), true);
  assert.equal(after.layer.getStats().error, null);
  assert.equal(after.layer.getStats().statusMessage, 'GDACS feed down');
});

test('[gdacs-layer-014] keeps the points when the document is stale', async () => {
  const h = enabled(async () => snapshot(THREE.slice(0, 2), { stale: true }));
  assert.equal(await h.layer.update(h.viewer), true);
  assert.equal(entitiesOf(h).length, 2);
  const stats = h.layer.getStats();
  assert.equal(stats.count, 2);
  assert.equal(stats.error, null);
});

test('[gdacs-layer-015] keeps the last points when a request fails and gives the error', async () => {
  const failures = [new Error('GDACS HTTP 503'), new Error(''), undefined];
  let step = 0;
  const h = enabled(async () => {
    step += 1;
    if (step === 1) return snapshot(THREE);
    throw failures[step - 2];
  });
  await h.layer.update(h.viewer);
  assert.equal(await h.layer.update(h.viewer), false);
  assert.equal(entitiesOf(h).length, 3);
  assert.equal(h.overlay.entries.get(ID).length, 3);
  assert.equal(h.layer.getStats().error, 'GDACS HTTP 503');
  assert.equal(await h.layer.update(h.viewer), false);
  assert.equal(h.layer.getStats().error, 'GDACS source unavailable');
  assert.equal(await h.layer.update(h.viewer), false);
  assert.equal(h.layer.getStats().error, 'GDACS source unavailable');
  assert.equal(entitiesOf(h).length, 3);
  assert.equal(h.overlay.entries.get(ID).length, 3);
  step = 0;
  assert.equal(await h.layer.update(h.viewer), true);
  assert.equal(h.layer.getStats().error, null);
});

test('[gdacs-layer-016] polls only while the layer is enabled, and disable and a new call of update abort the request in flight', async () => {
  const idle = harness();
  idle.layer.init(idle.viewer);
  assert.equal(await idle.layer.update(idle.viewer), false);
  assert.equal(idle.calls.length, 0);
  idle.layer.enable(idle.viewer);
  idle.layer.disable(idle.viewer);
  assert.equal(await idle.layer.update(idle.viewer), false);
  assert.equal(idle.calls.length, 0);

  const done = enabled();
  assert.equal(await done.layer.update(done.viewer), true);
  assert.equal(done.overlay.entries.has(ID), true);
  done.layer.disable(done.viewer);
  assert.equal(done.calls[0].signal.aborted, false);
  assert.equal(done.overlay.entries.has(ID), false);
  assert.equal(done.overlay.visible.get(ID), false);
  assert.equal(done.added[0].show, false);

  const waits = [];
  const h = enabled(() => {
    const wait = deferred();
    waits.push(wait);
    return wait.promise;
  });
  const first = h.layer.update(h.viewer);
  assert.equal(h.calls[0].signal.aborted, false);
  h.layer.disable(h.viewer);
  assert.equal(h.calls[0].signal.aborted, true);
  waits[0].resolve(snapshot(THREE));
  assert.equal(await first, false);
  assert.equal(entitiesOf(h).length, 0);
  assert.equal(h.overlay.entries.has(ID), false);
  assert.equal(h.layer.getStats().count, 0);

  h.layer.enable(h.viewer);
  const a = h.layer.update(h.viewer);
  const b = h.layer.update(h.viewer);
  assert.equal(h.calls[1].signal.aborted, true);
  assert.equal(h.calls[2].signal.aborted, false);
  waits[2].resolve(snapshot(THREE.slice(0, 1)));
  assert.equal(await b, true);
  waits[1].resolve(snapshot(THREE));
  assert.equal(await a, false);
  assert.equal(entitiesOf(h).length, 1);
  assert.equal(h.layer.getStats().count, 1);
  const late = h.layer.update(h.viewer);
  waits[3].reject(new Error('late failure'));
  assert.equal(await late, false);
  assert.equal(h.layer.getStats().error, 'late failure');
  const stale = h.layer.update(h.viewer);
  h.layer.disable(h.viewer);
  waits[4].reject(new Error('after disable'));
  assert.equal(await stale, false);
  assert.equal(h.layer.getStats().error, 'late failure');

  // The aborted request answers before the newest call. Its answer changes
  // nothing, and the answer of the newest call still counts.
  h.layer.enable(h.viewer);
  const older = h.layer.update(h.viewer);
  const newer = h.layer.update(h.viewer);
  assert.equal(h.calls[5].signal.aborted, true);
  assert.equal(h.calls[6].signal.aborted, false);
  waits[5].resolve(snapshot(THREE));
  assert.equal(await older, false);
  waits[6].resolve(snapshot(THREE.slice(0, 2)));
  assert.equal(await newer, true);
  assert.equal(entitiesOf(h).length, 2);
  assert.equal(h.layer.getStats().count, 2);
  assert.equal(h.layer.getStats().error, null);
});

test('[gdacs-layer-017] removes the data source and the labels when destroy runs, aborts the request in flight, and ignores a second call of destroy', async () => {
  const h = enabled();
  await h.layer.update(h.viewer);
  h.layer.destroy(h.viewer);
  assert.equal(h.added.length, 0);
  assert.equal(h.removed.length, 1);
  assert.equal(h.removed[0][1], true);
  assert.equal(h.overlay.entries.has(ID), false);
  assert.equal(h.overlay.visible.get(ID), false);
  assert.deepEqual(h.layer.getStats(), {
    count: 0,
    lastUpdate: null,
    error: null,
  });
  h.layer.destroy(h.viewer);
  assert.equal(h.removed.length, 1);

  let step = 0;
  const k = enabled(async () => {
    step += 1;
    if (step === 1)
      return snapshot([], { unavailable: true, reason: 'Not configured' });
    throw new Error('GDACS HTTP 503');
  });
  await k.layer.update(k.viewer);
  await k.layer.update(k.viewer);
  assert.equal(k.layer.getStats().status, 'idle');
  assert.equal(k.layer.getStats().error, 'GDACS HTTP 503');
  k.layer.destroy(k.viewer);
  assert.deepEqual(k.layer.getStats(), {
    count: 0,
    lastUpdate: null,
    error: null,
  });
  assert.equal(await k.layer.update(k.viewer), false);
  assert.equal(k.calls.length, 2);

  const waits = [];
  const g = enabled(() => {
    const wait = deferred();
    waits.push(wait);
    return wait.promise;
  });
  const pending = g.layer.update(g.viewer);
  g.layer.destroy();
  assert.equal(g.calls[0].signal.aborted, true);
  assert.equal(g.added.length, 0);
  waits[0].resolve(snapshot(THREE));
  assert.equal(await pending, false);
  assert.equal(g.layer.getStats().count, 0);
});
