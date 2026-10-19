import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeGdacsDocument } from './records.js';

/** One event in the shape that the route /api/gdacs sends. */
function event(overrides = {}) {
  return {
    id: 'FL-1104230',
    type: 'FL',
    eventId: 1104230,
    episodeId: 2,
    name: 'Flood in Türkiye',
    alert: 'green',
    alertScore: 1,
    current: true,
    country: 'Türkiye',
    iso3: 'TUR',
    from: '2026-10-12T01:00:00.000Z',
    to: '2026-10-16T01:00:00.000Z',
    modified: '2026-10-16T07:45:43.000Z',
    latitude: 41.116,
    longitude: 28.999,
    severity: null,
    origin: 'GLOFAS',
    reportUrl:
      'https://www.gdacs.org/report.aspx?eventid=1104230&episodeid=2&eventtype=FL',
    ...overrides,
  };
}
function doc(events, overrides = {}) {
  return {
    schemaVersion: 1,
    source: 'GDACS (Global Disaster Alert and Coordination System)',
    stale: false,
    unavailable: false,
    reason: null,
    fetchedAt: '2026-10-16T08:00:00.000Z',
    counts: { total: events.length, current: events.length, dropped: 0 },
    events,
    ...overrides,
  };
}
const only = (overrides) =>
  normalizeGdacsDocument(doc([event(overrides)])).events;
const nameOf = (name, type = 'FL') =>
  only({ name, type, id: `${type}-7` })[0].name;
const numbered = (count, start = 1) =>
  Array.from({ length: count }, (_, index) =>
    event({ id: `FL-${start + index}` }),
  );

test('[gdacs-layer-005] keeps exactly the 8 fields of a valid event and the valid types, alerts, positions and ids', () => {
  const [record] = normalizeGdacsDocument(doc([event()])).events;
  assert.deepEqual(Object.keys(record).sort(), [
    'alert',
    'current',
    'id',
    'latitude',
    'longitude',
    'modified',
    'name',
    'type',
  ]);
  assert.deepEqual(record, {
    id: 'FL-1104230',
    type: 'FL',
    name: 'Flood in Türkiye',
    alert: 'green',
    current: true,
    latitude: 41.116,
    longitude: 28.999,
    modified: '2026-10-16T07:45:43.000Z',
  });
  for (const type of ['DR', 'VO', 'TC']) {
    const [kept] = only({ type, id: `${type}-7` });
    assert.equal(kept.type, type);
    assert.equal(kept.id, `${type}-7`);
  }
  assert.equal(only({ alert: 'orange' })[0].alert, 'orange');
  assert.equal(only({ alert: 'red' })[0].alert, 'red');
  for (const [latitude, longitude] of [
    [-90, 28.999],
    [90, 28.999],
    [41.116, -180],
    [41.116, 180],
    [0, 0],
  ]) {
    const [kept] = only({ latitude, longitude });
    assert.deepEqual([kept.latitude, kept.longitude], [latitude, longitude]);
  }
  assert.equal(only({ id: 'FL-1' })[0].id, 'FL-1');
  assert.equal(
    only({ id: 'FL-9007199254740992' })[0].id,
    'FL-9007199254740992',
  );
});

test('[gdacs-layer-006] drops the events that are not valid, keeps the first of two equal ids and keeps at most 500 valid events', () => {
  const bad = [
    ['type EQ', { type: 'EQ', id: 'EQ-7' }],
    ['type in lower case', { type: 'fl', id: 'fl-7' }],
    ['type with a space', { type: 'FL ', id: 'FL -7' }],
    ['no type', { type: undefined }],
    ['id FL-0', { id: 'FL-0' }],
    ['id FL-01', { id: 'FL-01' }],
    ['id FL-1.5', { id: 'FL-1.5' }],
    ['id FL-', { id: 'FL-' }],
    ['id of another type', { id: 'DR-7' }],
    ['id of 17 digits', { id: 'FL-12345678901234567' }],
    ['id in lower case', { id: 'fl-7' }],
    ['id as a number', { id: 7 }],
    ['alert Green', { alert: 'Green' }],
    ['alert purple', { alert: 'purple' }],
    ['alert with a space', { alert: ' red' }],
    ['no alert', { alert: undefined }],
    ['latitude 90.001', { latitude: 90.001 }],
    ['latitude -90.001', { latitude: -90.001 }],
    ['latitude as text', { latitude: '5' }],
    ['no latitude', { latitude: undefined }],
    ['latitude NaN', { latitude: Number.NaN }],
    ['longitude 180.001', { longitude: 180.001 }],
    ['longitude -180.001', { longitude: -180.001 }],
    ['longitude null', { longitude: null }],
  ];
  for (const [label, overrides] of bad)
    assert.deepEqual(only(overrides), [], label);
  assert.deepEqual(
    normalizeGdacsDocument(doc([null, 5, 'FL-1', [event()]])).events,
    [],
  );

  const pair = normalizeGdacsDocument(
    doc([event({ id: 'FL-7', name: 'A' }), event({ id: 'FL-7', name: 'B' })]),
  ).events;
  assert.deepEqual(
    pair.map((item) => [item.id, item.name]),
    [['FL-7', 'A']],
  );

  const many = normalizeGdacsDocument(doc(numbered(520))).events;
  assert.equal(many.length, 500);
  assert.equal(many[0].id, 'FL-1');
  assert.equal(many[499].id, 'FL-500');

  const notValid = Array.from({ length: 10 }, () => event({ alert: 'purple' }));
  const afterBad = normalizeGdacsDocument(
    doc([...notValid, ...numbered(500)]),
  ).events;
  assert.equal(afterBad.length, 500);
  assert.equal(afterBad[0].id, 'FL-1');
  assert.equal(afterBad[499].id, 'FL-500');

  const withRepeat = normalizeGdacsDocument(
    doc([...numbered(499), event({ id: 'FL-7' }), event({ id: 'FL-9999' })]),
  ).events;
  assert.equal(withRepeat.length, 500);
  assert.equal(withRepeat[499].id, 'FL-9999');
});

test('[gdacs-layer-007] makes current true only for the value true and keeps only a modified value that is a date', () => {
  assert.equal(only({ current: true })[0].current, true);
  for (const current of [false, 'true', 1, undefined])
    assert.equal(only({ current })[0].current, false, String(current));
  assert.equal(
    only({ modified: '2026-10-16T07:45:43.000Z' })[0].modified,
    '2026-10-16T07:45:43.000Z',
  );
  for (const modified of ['not a date', 5, null, undefined])
    assert.equal(only({ modified })[0].modified, null, String(modified));
});

test('[gdacs-layer-008] cleans the names: removed characters, white space, the cut to 120 code points and the name of the type', () => {
  const removed = [
    0x00, 0x09, 0x1f, 0x3c, 0x3e, 0x7f, 0x9f, 0x61c, 0x200b, 0x200f, 0x2028,
    0x202e, 0x2060, 0x2064, 0x2066, 0x2069, 0xfeff,
  ];
  for (const code of removed)
    assert.equal(
      nameOf(`Flood${String.fromCodePoint(code)}X`),
      'FloodX',
      code.toString(16),
    );
  // The neighbours of each removed range stay. A neighbour that is white space
  // (the pattern \s of the requirement) becomes one space.
  const neighbours = [
    0x20, 0x3b, 0x3d, 0x3f, 0x7e, 0xa0, 0x61b, 0x61d, 0x200a, 0x2010, 0x2027,
    0x202f, 0x205f, 0x2065, 0x206a, 0xfefe, 0xff00,
  ];
  for (const code of neighbours) {
    const character = String.fromCodePoint(code);
    const expected = /\s/.test(character) ? 'Flood X' : `Flood${character}X`;
    assert.equal(nameOf(`Flood${character}X`), expected, code.toString(16));
  }
  assert.equal(nameOf('Flood\tin'), 'Floodin');
  assert.equal(nameOf('a 　b'), 'a b');
  assert.equal(nameOf('  Flood   in  X  '), 'Flood in X');
  assert.equal(nameOf('x'.repeat(130)), 'x'.repeat(120));
  assert.equal(nameOf('y'.repeat(120)), 'y'.repeat(120));
  assert.equal(nameOf('🌊'.repeat(125)), '🌊'.repeat(120));
  assert.equal(nameOf(`${'z'.repeat(119)} ${'w'.repeat(10)}`), 'z'.repeat(119));
  assert.equal(
    nameOf(`${'z'.repeat(118)}\u0001\u0002\u0003${'w'.repeat(10)}`),
    `${'z'.repeat(118)}ww`,
  );
  assert.equal(
    nameOf(`${'z'.repeat(118)}  ${'w'.repeat(10)}`),
    `${'z'.repeat(118)} w`,
  );
  const typeNames = {
    FL: 'Flood',
    DR: 'Drought',
    VO: 'Volcano',
    TC: 'Tropical cyclone',
  };
  for (const [type, label] of Object.entries(typeNames)) {
    assert.equal(nameOf('', type), label, type);
    assert.equal(nameOf('   ', type), label, type);
    assert.equal(nameOf('<>​', type), label, type);
    assert.equal(nameOf(42, type), label, type);
    assert.equal(nameOf(undefined, type), label, type);
  }
  assert.equal(nameOf('A & "B" Ж 東京'), 'A & "B" Ж 東京');
});

test('[gdacs-layer-009] reads the meta of the document and returns null for a value that is not a document', () => {
  const meta = (overrides, events = [event()]) =>
    normalizeGdacsDocument(doc(events, overrides)).meta;
  assert.equal(meta({ unavailable: true }).unavailable, true);
  assert.equal(meta({ unavailable: 'true' }).unavailable, false);
  assert.equal(meta({ unavailable: false }).unavailable, false);
  assert.equal(meta({ stale: true }).stale, true);
  assert.equal(meta({ stale: 'true' }).stale, false);
  assert.equal(meta({ stale: undefined }).stale, false);
  assert.equal(meta({ reason: 'GDACS feed down' }).reason, 'GDACS feed down');
  assert.equal(meta({ reason: '  feed‮  <down>  ' }).reason, 'feed down');
  assert.equal(meta({ reason: 'r'.repeat(130) }).reason, 'r'.repeat(120));
  for (const reason of ['', '   ', '<>', 5, null, undefined])
    assert.equal(
      meta({ unavailable: true, reason }).reason,
      null,
      String(reason),
    );
  assert.equal(meta({ unavailable: false, reason: '' }).reason, null);
  assert.equal(
    meta({ fetchedAt: '2026-10-16T08:00:00.000Z' }).fetchedAt,
    '2026-10-16T08:00:00.000Z',
  );
  for (const fetchedAt of ['not a date', 5, null, undefined])
    assert.equal(meta({ fetchedAt }).fetchedAt, null, String(fetchedAt));
  assert.equal(meta({ counts: { total: 7 } }).total, 7);
  assert.equal(meta({ counts: { total: 0 } }).total, 0);
  assert.equal(
    meta({ counts: { total: 9007199254740991 } }).total,
    9007199254740991,
  );
  for (const total of [-1, 1.5, '7', null, undefined, 9007199254740992])
    assert.equal(
      meta({ counts: { total } }, [event(), event({ id: 'FL-2' })]).total,
      2,
      String(total),
    );
  assert.equal(meta({ counts: undefined }, [event()]).total, 1);
  for (const value of [
    null,
    undefined,
    'text',
    5,
    [],
    { events: [] },
    { schemaVersion: 2, events: [] },
    { schemaVersion: '1', events: [] },
    { schemaVersion: 1, events: 'x' },
    { schemaVersion: 1 },
  ])
    assert.equal(normalizeGdacsDocument(value), null, JSON.stringify(value));
});
