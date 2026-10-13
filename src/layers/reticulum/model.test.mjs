import assert from 'node:assert/strict';
import test from 'node:test';
import {
  RETICULUM_COLLISION_CAPACITY,
  RETICULUM_LABEL_LIMIT,
  RETICULUM_OVERLAY_SOURCE_ID,
  createLabelEntry,
  pointStyle,
  selectLabelCohort,
} from './model.js';

const COLORS = {
  rnode: '#2dd4bf',
  backbone: '#fb923c',
  tcpserver: '#facc15',
  tcpclient: '#fde047',
  i2p: '#a78bfa',
  kiss: '#60a5fa',
  weave: '#f472b6',
};
const STATUS = {
  available: { alpha: 1, size: 9 },
  unknown: { alpha: 0.6, size: 7 },
  stale: { alpha: 0.35, size: 5 },
};
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

test('[reticulum-layer-009] styles the points by type and status', () => {
  for (const [type, color] of Object.entries(COLORS))
    for (const [status, style] of Object.entries(STATUS))
      assert.deepEqual(
        pointStyle({ type, status }),
        { color, alpha: style.alpha, size: style.size },
        `${type} ${status}`,
      );
  for (const type of ['other', 'tcp', 'constructor', 'tostring', 'proto'])
    assert.deepEqual(pointStyle({ type, status: 'available' }), {
      color: '#9ca3af',
      alpha: 1,
      size: 9,
    });
});

test('[reticulum-layer-010] chooses at most 48 labels in order and builds their entries', () => {
  assert.equal(RETICULUM_OVERLAY_SOURCE_ID, 'reticulum');
  assert.equal(RETICULUM_LABEL_LIMIT, 48);
  assert.equal(RETICULUM_COLLISION_CAPACITY, 24);
  const list = [
    item(1, { status: 'stale', lastHeard: '2026-10-13T11:59:00.000Z' }),
    item(2, { status: 'unknown', lastHeard: '2026-10-13T10:00:00.000Z' }),
    item(3, { status: 'available', lastHeard: '2026-10-13T09:00:00.000Z' }),
    item(4, { status: 'available', lastHeard: '2026-10-13T10:30:00.000Z' }),
    item(6, { status: 'available', lastHeard: '2026-10-13T10:30:00.000Z' }),
    item(5, { status: 'available', lastHeard: '2026-10-13T10:30:00.000Z' }),
    item(7, { status: 'unknown', lastHeard: '2026-10-13T10:01:00.000Z' }),
  ];
  const before = list.map((entry) => entry.id);
  assert.deepEqual(
    selectLabelCohort(list).map((entry) => entry.id),
    [hex(4), hex(5), hex(6), hex(3), hex(7), hex(2), hex(1)],
  );
  assert.deepEqual(
    list.map((entry) => entry.id),
    before,
    'the input stays as it is',
  );
  const many = [];
  for (let n = 1; n <= 60; n += 1) many.push(item(n));
  assert.equal(selectLabelCohort(many).length, 48);
  assert.equal(selectLabelCohort(many.slice(0, 48)).length, 48);
  assert.equal(selectLabelCohort(many.slice(0, 47)).length, 47);
  assert.deepEqual(selectLabelCohort([]), []);
  const position = { x: 1, y: 2, z: 3 };
  const long = item(9, { type: 'backbone', name: 'N'.repeat(30) });
  assert.deepEqual(createLabelEntry({ item: long, position, index: 0 }), {
    id: hex(9),
    position,
    variant: 'label',
    title: 'N'.repeat(24),
    accent: '#fb923c',
    priority: 100000,
    collisionGroup: 'ambient-label',
    paintLane: 'ambient-label',
    interactive: false,
    edgeFade: 'keyhole',
    horizonCull: true,
    terrainOcclusion: false,
    gapPx: 15,
    verticalOnly: true,
    placement: 'above',
  });
  const short = createLabelEntry({
    item: item(3, { name: 'Short', type: 'weave' }),
    position,
    index: 5,
  });
  assert.equal(short.title, 'Short');
  assert.equal(short.priority, 99995);
  assert.equal(short.accent, '#f472b6');
  assert.equal(
    createLabelEntry({
      item: item(3, { name: '\u{1f600}'.repeat(30) }),
      position,
      index: 0,
    }).title,
    '\u{1f600}'.repeat(24),
  );
});
