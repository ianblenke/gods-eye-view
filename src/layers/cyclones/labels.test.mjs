import test from 'node:test';
import assert from 'node:assert/strict';
import * as Cesium from 'cesium';
import {
  CYCLONE_LEAD_LABEL_MAX_DISTANCE_M,
  CYCLONE_OVERLAY_COHORT_LIMIT,
  CYCLONE_OVERLAY_SOURCE_ID,
  createCycloneLabels,
  cycloneLeadEntry,
  cycloneOverlayEntries,
  cycloneStormEntry,
  cycloneStormIdFromEntryId,
} from './labels.js';
import {
  getWorldOverlayDiagnostics,
  normalizeOverlayEntry,
  paintLaneForOverlayEntry,
  WORLD_OVERLAY_PAINT_LANES,
} from '../../overlays/worldOverlay.js';
import { distanceFade } from '../../overlays/worldOverlayDraw.js';

const anchor = (longitude, latitude) =>
  Cesium.Cartesian3.fromDegrees(longitude, latitude, 0);
const storms = () => [
  {
    id: 'al062026',
    name: 'Fay',
    classification: 'TS',
    windKt: 50,
    position: anchor(-60, 20),
    forecasts: [
      { tauHours: 12, position: anchor(-61, 21) },
      { tauHours: 24, position: anchor(-62, 22) },
    ],
  },
  {
    id: 'ep152026',
    name: 'Fifteen-E',
    classification: 'PTC',
    windKt: null,
    position: anchor(-125, 15),
    forecasts: [{ tauHours: 12, position: anchor(-126, 16) }],
  },
];
const byId = (entries) => new Map(entries.map((entry) => [entry.id, entry]));

test('[cyclones-009] storm cards join the fire and vessel card tier with fire-card clearance', () => {
  const input = storms();
  const entries = byId(cycloneOverlayEntries(input, 'al062026'));
  assert.deepEqual(
    [...entries.keys()],
    [
      'storm:al062026',
      'lead:al062026:12',
      'lead:al062026:24',
      'storm:ep152026',
    ],
    'lead-hour labels belong to the selected storm only',
  );
  const selected = entries.get('storm:al062026');
  const ambient = entries.get('storm:ep152026');
  for (const card of [selected, ambient]) {
    assert.equal(card.cardStyle, 'tactical');
    assert.equal(card.collisionGroup, 'ambient-card');
    assert.equal(card.verticalOnly, true);
    assert.equal(card.horizonCull, true);
    assert.equal(card.edgeFade, 'keyhole');
    assert.equal(card.interactive, true);
    assert.equal(card.maxDistance, Number.POSITIVE_INFINITY);
  }
  assert.equal(selected.position, input[0].position, 'renderer anchor as-is');
  assert.equal(selected.title, 'Fay');
  assert.deepEqual(selected.details, ['TS']);
  assert.equal(selected.variant, 'selected');
  assert.equal(selected.selected, true);
  assert.equal(selected.protected, true);
  assert.equal(selected.accent, '#ffe19a');
  // Fire policy: gap = max(12, marker + 8), leader starts gap - 6 out.
  assert.equal(selected.gapPx, 20);
  assert.equal(selected.leaderOffsetPx, 14);
  assert.equal(ambient.title, 'Fifteen-E');
  assert.deepEqual(ambient.details, ['PTC']);
  assert.equal(ambient.variant, 'card');
  assert.equal(ambient.protected, false);
  assert.equal(ambient.accent, '#7fe6ed');
  assert.equal(ambient.gapPx, 17);
  assert.equal(ambient.leaderOffsetPx, 11);

  const lead = entries.get('lead:al062026:24');
  assert.equal(lead.position, input[0].forecasts[1].position);
  assert.equal(lead.title, '24 h');
  assert.deepEqual(lead.details, []);
  assert.equal(lead.cardStyle, 'tactical');
  assert.equal(lead.collisionGroup, 'ambient-card');
  assert.equal(lead.protected, false);
  assert.equal(lead.interactive, true);
  assert.equal(lead.maxDistance, CYCLONE_LEAD_LABEL_MAX_DISTANCE_M);
  assert.equal(lead.gapPx, 13);
  assert.equal(lead.leaderOffsetPx, 7);
  assert.ok(ambient.priority > entries.get('lead:al062026:12').priority);
  assert.ok(entries.get('lead:al062026:12').priority > lead.priority);

  const none = cycloneOverlayEntries(input, null);
  assert.deepEqual(
    none.map((entry) => [entry.id, entry.variant]),
    [
      ['storm:al062026', 'card'],
      ['storm:ep152026', 'card'],
    ],
  );
  assert.ok(none[0].priority > none[1].priority, 'stronger storm ranks first');
});

test('[cyclones-009] entries satisfy the shared host contract and keep the 4,000 km lead-hour rule', () => {
  const entries = cycloneOverlayEntries(storms(), 'al062026').map((entry) =>
    normalizeOverlayEntry(CYCLONE_OVERLAY_SOURCE_ID, entry),
  );
  const lane = (entry) =>
    WORLD_OVERLAY_PAINT_LANES[paintLaneForOverlayEntry(entry)];
  const [selected, lead] = entries;
  assert.equal(lane(selected), 'selected');
  assert.equal(lane(lead), 'ambient-card');
  assert.equal(lane(entries.at(-1)), 'ambient-card');
  for (const entry of entries) {
    assert.equal(entry.collisionGroup, 'ambient-card');
    assert.equal(entry.cardStyle, 'tactical');
    assert.equal(entry.horizonCull, true);
  }
  const range = {
    minDistance: lead.minDistance,
    maxDistance: lead.maxDistance,
    fadeStartRatio: lead.distanceFadeStartRatio,
  };
  assert.equal(distanceFade(3_999_000, range), 1, 'full strength inside');
  assert.equal(distanceFade(4_000_000, range), 0, 'hidden at the limit');
  assert.equal(
    distanceFade(40_000_000, {
      minDistance: selected.minDistance,
      maxDistance: selected.maxDistance,
      fadeStartRatio: selected.distanceFadeStartRatio,
    }),
    1,
    'storm cards have no distance limit',
  );
});

test('[cyclones-010] publisher republishes on snapshots and selection changes, and hides on clear', () => {
  const calls = [];
  const host = {
    setEntries: (...args) => calls.push(['entries', ...args]),
    setVisible: (...args) => calls.push(['visible', ...args]),
    clearSource: (...args) => calls.push(['clear', ...args]),
  };
  const labels = createCycloneLabels({ host });
  labels.setSelection('al062026');
  labels.clear();
  assert.deepEqual(calls, [], 'nothing is published before a snapshot');

  labels.setSnapshot(storms(), 'al062026');
  assert.deepEqual(
    calls.map(([kind, source]) => [kind, source]),
    [
      ['visible', CYCLONE_OVERLAY_SOURCE_ID],
      ['entries', CYCLONE_OVERLAY_SOURCE_ID],
    ],
  );
  assert.equal(calls[0][2], true);
  const [, , entries, options] = calls[1];
  assert.equal(entries.length, 4);
  assert.deepEqual(options, {
    cohortLimit: CYCLONE_OVERLAY_COHORT_LIMIT,
    collisionCapacity: 3,
    moving: false,
  });

  calls.length = 0;
  labels.setSelection('al062026');
  assert.deepEqual(calls, [], 'an unchanged selection publishes nothing');
  labels.setSelection('ep152026');
  const published = calls.find(([kind]) => kind === 'entries')[2];
  assert.deepEqual(
    published.map((entry) => entry.id),
    ['storm:al062026', 'storm:ep152026', 'lead:ep152026:12'],
  );
  assert.equal(published[1].variant, 'selected');

  calls.length = 0;
  labels.clear();
  assert.deepEqual(calls, [
    ['clear', CYCLONE_OVERLAY_SOURCE_ID],
    ['visible', CYCLONE_OVERLAY_SOURCE_ID, false],
  ]);
  labels.clear();
  labels.setSelection('al062026');
  assert.equal(calls.length, 2, 'a cleared publisher stays quiet');
});

test('[cyclones-011] storm identity resolves from card and lead-hour ids only', () => {
  assert.equal(cycloneStormIdFromEntryId('storm:al062026'), 'al062026');
  assert.equal(cycloneStormIdFromEntryId('lead:al062026:24'), 'al062026');
  for (const value of ['vessel:123', 'storm:', 'lead:', '', null, undefined])
    assert.equal(cycloneStormIdFromEntryId(value), null, String(value));
});

test('[cyclones-009] card priority is 1000 plus the wind, the largest safe integer for the selected storm and 500 minus the lead hours for a lead label', () => {
  const [fay, fifteen] = storms();
  assert.equal(cycloneStormEntry(fay, false).priority, 1050);
  assert.equal(cycloneStormEntry(fifteen, false).priority, 1000);
  assert.equal(cycloneStormEntry(fay, true).priority, 9007199254740991);
  assert.equal(
    cycloneStormEntry({ ...fay, windKt: 'not a number' }, false).priority,
    1000,
  );
  assert.equal(cycloneLeadEntry('al062026', fay.forecasts[0]).priority, 488);
  assert.equal(cycloneLeadEntry('al062026', fay.forecasts[1]).priority, 476);
  assert.equal(CYCLONE_LEAD_LABEL_MAX_DISTANCE_M, 4000000);
});

test('[cyclones-009] a card with no classification has no detail line, and a selected storm with no forecast list has no lead-hour label', () => {
  const bare = { id: 'al012026', name: 'Bare', position: anchor(-50, 25) };
  const card = cycloneStormEntry(bare, false);
  assert.deepEqual(card.details, []);
  assert.equal(card.title, 'Bare');
  assert.equal(card.id, 'storm:al012026');
  assert.equal(card.priority, 1000);
  assert.deepEqual(
    cycloneOverlayEntries([bare], 'al012026').map((entry) => entry.id),
    ['storm:al012026'],
  );
  assert.deepEqual(cycloneOverlayEntries([], 'al012026'), []);
  assert.deepEqual(
    cycloneOverlayEntries([{ ...bare, forecasts: [] }], 'al012026').map(
      (entry) => entry.id,
    ),
    ['storm:al012026'],
  );
});

test('[cyclones-010] the publisher limits the cohort to 64 and the collision capacity to the ambient count', () => {
  assert.equal(CYCLONE_OVERLAY_COHORT_LIMIT, 64);
  assert.equal(CYCLONE_OVERLAY_SOURCE_ID, 'weather-cyclones');
  const calls = [];
  const labels = createCycloneLabels({
    host: {
      setEntries: (...args) => calls.push(['entries', ...args]),
      setVisible: (...args) => calls.push(['visible', ...args]),
      clearSource: (...args) => calls.push(['clear', ...args]),
    },
  });
  const many = Array.from({ length: 70 }, (_, index) => ({
    id: `al${String(index).padStart(2, '0')}2026`,
    name: `Storm ${index}`,
    position: anchor(-60, 20),
  }));
  labels.setSnapshot(many, null);
  assert.deepEqual(calls.at(-1)[3], {
    cohortLimit: 64,
    collisionCapacity: 64,
    moving: false,
  });
  labels.setSnapshot(many.slice(0, 5), 'al002026');
  assert.deepEqual(calls.at(-1)[3], {
    cohortLimit: 64,
    collisionCapacity: 4,
    moving: false,
  });
});

test('[cyclones-010] a snapshot with no selection argument keeps the selection, and clear forgets it', () => {
  const calls = [];
  const labels = createCycloneLabels({
    host: {
      setEntries: (source, entries) => calls.push(entries),
      setVisible() {},
      clearSource() {},
    },
  });
  labels.setSelection('ep152026');
  assert.deepEqual(calls, []);
  labels.setSnapshot(storms());
  assert.deepEqual(
    calls.at(-1).map((entry) => [entry.id, entry.variant]),
    [
      ['storm:al062026', 'card'],
      ['storm:ep152026', 'selected'],
      ['lead:ep152026:12', 'card'],
    ],
  );
  labels.setSnapshot(storms(), 'al062026');
  labels.setSnapshot(storms());
  assert.equal(calls.at(-1)[0].variant, 'selected');
  labels.clear();
  labels.setSnapshot(storms());
  assert.deepEqual(
    calls.at(-1).map((entry) => entry.variant),
    ['card', 'card'],
  );
});

test('[cyclones-010] with no host option the publisher uses the shared world overlay', () => {
  const entries = () =>
    getWorldOverlayDiagnostics().entriesBySource[CYCLONE_OVERLAY_SOURCE_ID];
  const labels = createCycloneLabels();
  labels.setSnapshot(storms(), 'al062026');
  assert.equal(entries(), 4);
  labels.setSelection('ep152026');
  assert.equal(entries(), 3);
  labels.clear();
  assert.equal(entries(), 0);
});

test('[cyclones-011] only the prefixes storm and lead, in lower case and at the start, give a storm id', () => {
  assert.equal(cycloneStormIdFromEntryId('storm:al062026:extra'), 'al062026');
  assert.equal(cycloneStormIdFromEntryId('lead:al062026:'), 'al062026');
  assert.equal(cycloneStormIdFromEntryId('storm:a:b:c'), 'a');
  for (const value of [
    'xstorm:al062026',
    'STORM:al062026',
    'storms:al062026',
    5,
    {},
  ])
    assert.equal(cycloneStormIdFromEntryId(value), null, String(value));
});
