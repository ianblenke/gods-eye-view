import assert from 'node:assert/strict';
import test from 'node:test';
import * as Cesium from 'cesium';
import { createReticulumLayer } from './index.js';

const ID = 'reticulum';
const hex = (n) => n.toString(16).padStart(16, '0');
function item(n, overrides = {}) {
  return {
    id: hex(n),
    type: 'rnode',
    name: `Node ${n}`,
    latitude: 10,
    longitude: 20,
    heightM: null,
    hops: null,
    lastHeard: '2026-10-13T11:00:00.000Z',
    status: 'available',
    radio: null,
    ...overrides,
  };
}
function snapshot(interfaces, meta = {}) {
  return {
    interfaces,
    meta: {
      unavailable: false,
      stale: false,
      reason: null,
      fetchedAt: '2026-10-13T12:00:00.000Z',
      total: interfaces.length,
      ...meta,
    },
  };
}
const THREE = [
  item(1, { type: 'rnode', status: 'available', latitude: 10, longitude: 20 }),
  item(2, {
    type: 'backbone',
    status: 'unknown',
    latitude: -5.5,
    longitude: 100.25,
  }),
  item(3, { type: 'i2p', status: 'stale', latitude: 45, longitude: -120 }),
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
  const layer = createReticulumLayer({ source, overlayHost });
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

test('[reticulum-layer-001] describes the layer and refuses a missing source or overlay host', () => {
  const { layer } = harness();
  assert.equal(layer.id, 'reticulum');
  assert.equal(layer.name, 'Reticulum Network');
  assert.equal(layer.icon, '\u{1f4e1}');
  assert.equal(layer.source, 'Reticulum discovery');
  assert.equal(layer.updateInterval, 300000);
  assert.deepEqual(layer.getStats(), {
    count: 0,
    lastUpdate: null,
    error: null,
  });
  const overlayHost = { setEntries() {}, setVisible() {}, clearSource() {} };
  assert.throws(() => createReticulumLayer(), TypeError);
  assert.throws(() => createReticulumLayer({ overlayHost }), TypeError);
  assert.throws(
    () => createReticulumLayer({ source: {}, overlayHost }),
    TypeError,
  );
  assert.throws(
    () => createReticulumLayer({ source: { getSnapshot: 'x' }, overlayHost }),
    TypeError,
  );
  assert.throws(
    () => createReticulumLayer({ source: { getSnapshot() {} } }),
    TypeError,
  );
  assert.throws(
    () =>
      createReticulumLayer({ source: { getSnapshot() {} }, overlayHost: null }),
    TypeError,
  );
});

test('[reticulum-layer-002] makes no request on init and enable, and refuses a second init', () => {
  const h = harness();
  h.layer.init(h.viewer);
  assert.equal(h.added.length, 1);
  assert.equal(h.added[0].show, false);
  assert.equal(h.added[0].name, 'reticulum');
  assert.equal(h.overlay.visible.get(ID), false);
  h.layer.enable(h.viewer);
  assert.equal(h.added[0].show, true);
  assert.equal(h.overlay.visible.get(ID), true);
  assert.equal(h.calls.length, 0);
  assert.throws(() => h.layer.init(h.viewer), {
    message: 'Reticulum layer is already initialized',
  });
  assert.equal(h.added.length, 1);
  h.layer.disable(h.viewer);
  assert.equal(h.added[0].show, false);
  assert.equal(h.overlay.visible.get(ID), false);
});

test('[reticulum-layer-011] shows the points on the ground and the labels, and fills the stats', async () => {
  const h = enabled();
  assert.equal(await h.layer.update(h.viewer), true);
  assert.equal(h.calls.length, 1);
  assert.equal(typeof h.calls[0].signal.aborted, 'boolean');
  const entities = entitiesOf(h);
  assert.deepEqual(
    entities.map((entity) => entity.id),
    THREE.map((entry) => `reticulum:${entry.id}`),
  );
  const expected = [
    ['#2dd4bf', 1, 9],
    ['#fb923c', 0.6, 7],
    ['#a78bfa', 0.35, 5],
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
  assert.equal(call[1], 'reticulum');
  assert.deepEqual(call[3], {
    cohortLimit: 48,
    collisionCapacity: 24,
    moving: false,
  });
  assert.deepEqual(
    call[2].map((entry) => entry.id),
    [hex(1), hex(2), hex(3)],
  );
  assert.ok(
    Cesium.Cartesian3.equals(
      call[2][0].position,
      Cesium.Cartesian3.fromDegrees(20, 10),
    ),
  );
  assert.equal(call[2][0].title, 'Node 1');
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
    [`reticulum:${hex(2)}`],
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
        status: ['unknown', 'stale', 'available'][n % 3],
        latitude: n,
        longitude: n,
      }),
    );
  const many = enabled(async () => snapshot(crowded.slice().reverse()));
  assert.equal(await many.layer.update(many.viewer), true);
  assert.equal(entitiesOf(many).length, 60);
  const labels = many.overlay.entries.get(ID);
  assert.equal(labels.length, 48);
  assert.equal(labels[0].id, hex(2));
  assert.equal(labels[0].priority, 100000);
  assert.equal(labels[1].priority, 99999);
  assert.equal(labels[47].priority, 99953);
  assert.deepEqual(
    labels.slice(0, 20).map((entry) => entry.id),
    [
      2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35, 38, 41, 44, 47, 50, 53, 56,
      59,
    ].map(hex),
  );
  for (const entry of labels) {
    const n = Number.parseInt(entry.id, 16);
    assert.ok(
      Cesium.Cartesian3.equals(
        entry.position,
        Cesium.Cartesian3.fromDegrees(n, n),
      ),
      entry.id,
    );
  }
});

test('[reticulum-layer-012] shows no point for an unavailable listener and gives the reason as guidance', async () => {
  let step = 0;
  const h = enabled(async () => {
    step += 1;
    return step === 1
      ? snapshot(THREE)
      : snapshot([], {
          unavailable: true,
          reason: 'Reticulum listener not configured',
        });
  });
  await h.layer.update(h.viewer);
  assert.equal(entitiesOf(h).length, 3);
  assert.equal(await h.layer.update(h.viewer), true);
  assert.equal(entitiesOf(h).length, 0);
  assert.equal(h.overlay.entries.has(ID), false);
  const stats = h.layer.getStats();
  assert.equal(stats.count, 0);
  assert.equal(stats.status, 'idle');
  assert.equal(stats.statusMessage, 'Reticulum listener not configured');
  assert.equal(stats.error, null);
  step = 0;
  await h.layer.update(h.viewer);
  assert.equal(entitiesOf(h).length, 3);
  assert.equal(h.layer.getStats().status, undefined);
  assert.equal(h.layer.getStats().statusMessage, undefined);
});

test('[reticulum-layer-013] keeps the points of a stale list', async () => {
  const h = enabled(async () => snapshot(THREE.slice(0, 2), { stale: true }));
  assert.equal(await h.layer.update(h.viewer), true);
  assert.equal(entitiesOf(h).length, 2);
  const stats = h.layer.getStats();
  assert.equal(stats.count, 2);
  assert.equal(stats.error, null);
});

test('[reticulum-layer-014] keeps the last points when a request fails and gives the error', async () => {
  const failures = [new Error('Reticulum HTTP 503'), new Error(''), undefined];
  let step = 0;
  const h = enabled(async () => {
    step += 1;
    if (step === 1) return snapshot(THREE);
    throw failures[step - 2];
  });
  await h.layer.update(h.viewer);
  assert.equal(await h.layer.update(h.viewer), false);
  assert.equal(entitiesOf(h).length, 3);
  assert.equal(h.layer.getStats().error, 'Reticulum HTTP 503');
  assert.equal(await h.layer.update(h.viewer), false);
  assert.equal(h.layer.getStats().error, 'Reticulum source unavailable');
  assert.equal(await h.layer.update(h.viewer), false);
  assert.equal(h.layer.getStats().error, 'Reticulum source unavailable');
  assert.equal(entitiesOf(h).length, 3);
  step = 0;
  assert.equal(await h.layer.update(h.viewer), true);
  assert.equal(h.layer.getStats().error, null);
});

test('[reticulum-layer-015] polls only while enabled, aborts on disable and on a new update', async () => {
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
});

test('[reticulum-layer-016] releases everything on destroy, aborts the request in flight and survives a second destroy', async () => {
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
    throw new Error('Reticulum HTTP 503');
  });
  await k.layer.update(k.viewer);
  await k.layer.update(k.viewer);
  assert.equal(k.layer.getStats().status, 'idle');
  assert.equal(k.layer.getStats().error, 'Reticulum HTTP 503');
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
