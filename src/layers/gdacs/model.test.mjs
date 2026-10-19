import assert from 'node:assert/strict';
import test from 'node:test';
import {
  GDACS_COLLISION_CAPACITY,
  GDACS_LABEL_LIMIT,
  GDACS_OVERLAY_SOURCE_ID,
  createLabelEntry,
  pointStyle,
  selectLabelCohort,
} from './model.js';

const COLORS = { green: '#22c55e', orange: '#f97316', red: '#ef4444' };
function item(id, overrides = {}) {
  return {
    id,
    type: 'FL',
    name: `Event ${id}`,
    alert: 'green',
    current: true,
    latitude: 10,
    longitude: 20,
    modified: '2026-10-16T07:00:00.000Z',
    ...overrides,
  };
}
const order = (list) => selectLabelCohort(list).map((entry) => entry.id);

test('[gdacs-layer-010] gives each point the color of its alert level and the size and alpha of its current flag', () => {
  for (const [alert, color] of Object.entries(COLORS)) {
    assert.deepEqual(pointStyle({ alert, current: true }), {
      color,
      alpha: 1,
      size: 10,
    });
    assert.deepEqual(pointStyle({ alert, current: false }), {
      color,
      alpha: 0.45,
      size: 6,
    });
  }
});

test('[gdacs-layer-011] chooses at most 48 labels in the order of the current flag, the alert level, the modified date and the id, and builds their entries', () => {
  assert.equal(GDACS_OVERLAY_SOURCE_ID, 'gdacs');
  assert.equal(GDACS_LABEL_LIMIT, 48);
  assert.equal(GDACS_COLLISION_CAPACITY, 24);

  // The current flag comes before the alert level.
  assert.deepEqual(
    order([
      item('FL-1', { alert: 'red', current: false }),
      item('FL-2', { alert: 'green', current: true }),
    ]),
    ['FL-2', 'FL-1'],
  );
  // The alert level comes before the modified date.
  assert.deepEqual(
    order([
      item('FL-1', { alert: 'green' }),
      item('FL-2', { alert: 'orange', modified: '2026-10-16T09:00:00.000Z' }),
      item('FL-3', { alert: 'red', modified: '2026-10-16T05:00:00.000Z' }),
    ]),
    ['FL-3', 'FL-2', 'FL-1'],
  );
  // The newest modified date first, and null after the dates.
  assert.deepEqual(
    order([
      item('FL-1', { modified: null }),
      item('FL-2', { modified: '2026-10-16T05:00:00.000Z' }),
      item('FL-3', { modified: '2026-10-16T09:00:00.000Z' }),
    ]),
    ['FL-3', 'FL-2', 'FL-1'],
  );
  // The id, compared as text, last.
  assert.deepEqual(order([item('FL-9'), item('FL-10'), item('FL-2')]), [
    'FL-10',
    'FL-2',
    'FL-9',
  ]);
  assert.deepEqual(
    order([
      item('FL-9', { modified: null }),
      item('FL-10', { modified: null }),
    ]),
    ['FL-10', 'FL-9'],
  );
  const list = [item('FL-3'), item('FL-1'), item('FL-2')];
  const before = list.map((entry) => entry.id);
  assert.deepEqual(order(list), ['FL-1', 'FL-2', 'FL-3']);
  assert.deepEqual(
    list.map((entry) => entry.id),
    before,
    'the input stays as it is',
  );

  const many = Array.from({ length: 60 }, (_, index) =>
    item(`FL-${index + 100}`),
  );
  assert.equal(selectLabelCohort(many).length, 48);
  // The newest modified date first: with the input in the reverse order of
  // the sort, the cohort must still be the 48 newest events.
  const dated = Array.from({ length: 60 }, (_, index) =>
    item(`FL-${index + 100}`, {
      modified: new Date(Date.UTC(2026, 9, 16, 0, index)).toISOString(),
    }),
  );
  assert.deepEqual(
    order(dated),
    dated
      .slice(12)
      .reverse()
      .map((entry) => entry.id),
  );
  assert.equal(selectLabelCohort(many.slice(0, 48)).length, 48);
  assert.equal(selectLabelCohort(many.slice(0, 47)).length, 47);
  assert.deepEqual(selectLabelCohort([]), []);

  const position = { x: 1, y: 2, z: 3 };
  const long = item('TC-7', { type: 'TC', alert: 'red', name: 'N'.repeat(40) });
  assert.deepEqual(createLabelEntry({ item: long, position, index: 0 }), {
    id: 'TC-7',
    position,
    variant: 'label',
    title: 'N'.repeat(32),
    accent: '#ef4444',
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
    item: item('FL-3', { name: 'Short', alert: 'orange', current: false }),
    position,
    index: 5,
  });
  assert.equal(short.title, 'Short');
  assert.equal(short.priority, 99995);
  assert.equal(short.accent, '#f97316');
  assert.equal(
    createLabelEntry({
      item: item('FL-3', { name: '\u{1f30a}'.repeat(40) }),
      position,
      index: 0,
    }).title,
    '\u{1f30a}'.repeat(32),
  );
  assert.equal(
    createLabelEntry({
      item: item('FL-3', { name: 'N'.repeat(32) }),
      position,
      index: 0,
    }).title,
    'N'.repeat(32),
  );
});
