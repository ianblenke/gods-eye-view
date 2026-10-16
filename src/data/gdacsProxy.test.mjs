import test from 'node:test';
import assert from 'node:assert/strict';
import { gdacsProxy, normalizeEvents } from '../../server/providers/gdacs.js';
import { localProviderPlugins } from '../../server/providers/local.js';

const NOW = Date.UTC(2026, 2, 5, 10, 0, 0);
const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const ZONE = 'Pacific/Kiritimati';

/** The real record FL-1104230 of 2026-10-16, as GDACS sends it. */
function base() {
  return {
    type: 'Feature',
    bbox: [28.9986, 41.1157, 28.9986, 41.1157],
    geometry: { type: 'Point', coordinates: [28.9986, 41.1157] },
    properties: {
      eventtype: 'FL',
      eventid: 1104230,
      episodeid: 2,
      eventname: '',
      glide: '',
      name: 'Flood in Türkiye',
      description: 'Flood in Türkiye',
      htmldescription: '<b>Flood</b>',
      icon: 'https://www.gdacs.org/images/gdacs_icons/maps/Green/FL.png',
      iconoverall: 'https://www.gdacs.org/images/gdacs_icons/maps/Green/FL.png',
      url: {
        geometry:
          'https://www.gdacs.org/gdacsapi/api/polygons/getgeometry?eventtype=FL&eventid=1104230&episodeid=2',
        report:
          'https://www.gdacs.org/report.aspx?eventid=1104230&episodeid=2&eventtype=FL',
        details:
          'https://www.gdacs.org/gdacsapi/api/events/geteventdata?eventtype=FL&eventid=1104230',
      },
      alertlevel: 'Green',
      alertscore: 1,
      episodealertlevel: 'Green',
      episodealertscore: 0.5,
      istemporary: 'false',
      iscurrent: 'true',
      country: 'Türkiye',
      fromdate: '2026-10-12T01:00:00',
      todate: '2026-10-16T01:00:00',
      datemodified: '2026-10-16T07:45:43',
      iso3: 'TUR',
      source: 'GLOFAS',
      sourceid: '',
      polygonlabel: 'Centroid',
      Class: 'Point_Centroid',
      affectedcountries: [{ iso2: 'TR', iso3: 'TUR', countryname: 'Türkiye' }],
      severitydata: {
        severity: 0,
        severitytext: 'Magnitude 0 ',
        severityunit: '',
      },
    },
  };
}
/** A record with other properties, and other top-level fields when given. */
function rec(properties = {}, top = {}) {
  const record = base();
  return {
    ...record,
    ...top,
    properties: { ...record.properties, ...properties },
  };
}
const at = (longitude, latitude) => ({
  geometry: { type: 'Point', coordinates: [longitude, latitude] },
});
/** A time text from a number of seconds after 2026-01-01T00:00:00. */
const stamp = (seconds) =>
  new Date(Date.UTC(2026, 0, 1, 0, 0, seconds)).toISOString().slice(0, 19);
const only = (records) => {
  const result = normalizeEvents(records);
  assert.equal(result.events.length, 1);
  return result.events[0];
};
async function inTimeZone(zone, run) {
  const saved = process.env.TZ;
  process.env.TZ = zone;
  try {
    assert.equal(new Date(2026, 0, 1).getTimezoneOffset(), -840);
    return await run();
  } finally {
    if (saved === undefined) delete process.env.TZ;
    else process.env.TZ = saved;
  }
}

test('[gdacs-source-001] keeps the allowed fields of a flood and rounds the position', () => {
  const event = only([rec()]);
  assert.deepEqual(Object.keys(event).sort(), [
    'alert',
    'alertScore',
    'country',
    'current',
    'episodeId',
    'eventId',
    'from',
    'id',
    'iso3',
    'latitude',
    'longitude',
    'modified',
    'name',
    'origin',
    'reportUrl',
    'severity',
    'to',
    'type',
  ]);
  assert.deepEqual(event, {
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
  });
});

test('[gdacs-source-002] drops the fields that are not on the list and keeps the event', () => {
  const first = [
    'icon',
    'iconoverall',
    'htmldescription',
    'description',
    'glide',
    'sourceid',
    'polygonlabel',
    'Class',
  ];
  const second = [
    'episodealertlevel',
    'episodealertscore',
    'istemporary',
    'affectedcountries',
    'countryonland',
    'eventname',
  ];
  const properties = {
    url: {
      geometry: 'CANARY-link-geometry',
      report: 'CANARY-link-report',
      details: 'CANARY-link-details',
    },
  };
  for (const field of [...first, ...second]) {
    properties[field] = `CANARY-${field}`;
  }
  const record = rec(properties, { bbox: 'CANARY-bbox' });
  const event = only([record]);
  assert.equal(JSON.stringify(event).includes('CANARY'), false);
  assert.equal(event.name, 'Flood in Türkiye');
  assert.equal(event.id, 'FL-1104230');
});

test('[gdacs-source-003] builds the report link from the ids and ignores the link of the feed', () => {
  const event = only([
    rec({
      url: { report: 'https://example.invalid/phish' },
    }),
  ]);
  assert.equal(
    event.reportUrl,
    'https://www.gdacs.org/report.aspx?eventid=1104230&episodeid=2&eventtype=FL',
  );
  assert.equal(JSON.stringify(event).includes('example.invalid'), false);
});

test('[gdacs-source-004] drops a record that is not an object or has no properties object', () => {
  const noProperties = rec();
  delete noProperties.properties;
  const result = normalizeEvents([
    5,
    'text',
    null,
    [],
    noProperties,
    { ...rec(), properties: null },
    { ...rec(), properties: [] },
    rec(),
  ]);
  assert.equal(result.events.length, 1);
  assert.equal(result.events[0].id, 'FL-1104230');
  assert.equal(result.counts.dropped, 7);
  assert.equal(result.counts.total, 1);
});

test('[gdacs-source-005] drops a record with a wrong type, event id, episode id or alert level', () => {
  const wrong = [
    ...['EQ', 'WF', 'fl', ['FL'], undefined].map((v) => ({ eventtype: v })),
    ...[0, -1, 1.5, '7', null, undefined].map((v) => ({ eventid: v })),
    ...[-1, 1.5, '2', undefined].map((v) => ({ episodeid: v })),
    ...['Purple', 2, null, undefined, ['green']].map((v) => ({
      alertlevel: v,
    })),
  ];
  const result = normalizeEvents(wrong.map((properties) => rec(properties)));
  assert.deepEqual(result.events, []);
  assert.equal(result.counts.dropped, wrong.length);
  const valid = only([
    rec({ episodeid: 0, alertlevel: 'Orange', eventtype: 'DR' }),
  ]);
  assert.equal(valid.alert, 'orange');
  assert.equal(valid.episodeId, 0);
  assert.equal(valid.type, 'DR');
});

test('[gdacs-source-006] lists only records with a valid position and rounds it to three decimals', () => {
  const wrong = [
    { geometry: undefined },
    { geometry: { type: 'Polygon', coordinates: [[1, 2]] } },
    { geometry: { type: 'MultiPoint', coordinates: [[1, 2]] } },
    { geometry: { type: 'Polygon', coordinates: [10, 20] } },
    { geometry: { type: 'MultiPoint', coordinates: [10, 20] } },
    { geometry: { type: 'LineString', coordinates: [10, 20] } },
    { geometry: { coordinates: [10, 20] } },
    { geometry: { type: 'Point', coordinates: [5] } },
    { geometry: { type: 'Point' } },
    { geometry: { type: 'Point', coordinates: {} } },
    { geometry: { type: 'Point', coordinates: 5 } },
    at('a', 'b'),
    at(null, 5),
    at(NaN, 5),
    at(Infinity, 5),
    at(10, 91),
    at(10, -91),
    at(181, 10),
    at(-181, 10),
    at(0, 0),
  ];
  const result = normalizeEvents(wrong.map((top) => rec({}, top)));
  assert.deepEqual(result.events, []);
  assert.equal(result.counts.dropped, wrong.length);
  const position = (longitude, latitude) => {
    const event = only([rec({}, at(longitude, latitude))]);
    return [event.longitude, event.latitude];
  };
  assert.deepEqual(position(10, -90), [10, -90]);
  assert.deepEqual(position(10, 90), [10, 90]);
  assert.deepEqual(position(-180, 10), [-180, 10]);
  assert.deepEqual(position(180, 10), [180, 10]);
  assert.deepEqual(position(0, 5), [0, 5]);
  assert.deepEqual(position(5, 0), [5, 0]);
  assert.deepEqual(position(0.0004, 0.0004), [0, 0]);
  assert.deepEqual(position(28.9986, 41.1157), [28.999, 41.116]);
  assert.deepEqual(position(10, 5.5555), [10, 5.556]);
  const negative = position(10, -0.0004);
  assert.equal(Object.is(negative[1], 0), true);
});

const VALID_TIMES = [
  ['2026-10-12T01:00:00', '2026-10-12T01:00:00.000Z'],
  ['2026-10-12T01:00:00Z', '2026-10-12T01:00:00.000Z'],
  ['2026-10-12T01:00:00.5', '2026-10-12T01:00:00.500Z'],
  ['2026-10-12T01:00:00.123Z', '2026-10-12T01:00:00.123Z'],
  ['2026-10-12T23:59:59', '2026-10-12T23:59:59.000Z'],
  ['0100-01-01T00:00:00', '0100-01-01T00:00:00.000Z'],
  ['1970-01-01T00:00:00', '1970-01-01T00:00:00.000Z'],
  ['2026-12-31T23:59:59', '2026-12-31T23:59:59.000Z'],
  ['9999-12-31T23:59:59', '9999-12-31T23:59:59.000Z'],
];
const INVALID_TIMES = [
  '2026-10-12T01:00:00+02:00',
  '2026-02-30T00:00:00',
  '2026-13-40T00:00:00',
  '2026-10-12',
  '2026-10-12T01:00',
  '2026-10-12T25:00:00',
  '2026-10-12T24:00:00',
  '2026-10-12T01:60:00',
  '2026-10-12T01:00:61',
  '2026-10-12T01:00:00.1234',
  '2026-10-12T01:00:00.',
  '2026-10-12T01:00:60',
  '2026-10-12T01:61:00',
  '2026-00-12T01:00:00',
  '999-10-12T01:00:00',
  '2026-10-12T+1:00:00',
  '2026-10-12T 1:00:00',
  '2026-10-12T01:00:00,5',
  '2026-10-12T01:00:00x5',
  '2026-10-12T01:00:00ZZ',
  '2026-10-12t01:00:00',
  '2026-10-12T01:00:00z',
  '2026-10-12T01:00:00\n',
  '2026/10-12T01:00:00',
  '2026-10/12T01:00:00',
  '2026-10-12 01:00:00',
  '2026-10-12T01.00:00',
  '2026-10-12T01:00.00',
  '2026-13-12T01:00:00',
  '0099-10-12T01:00:00',
  '26-10-12T01:00:00',
  '12026-10-12T01:00:00',
  '2026-1-12T01:00:00',
  '2026-010-12T01:00:00',
  '2026-10-1T01:00:00',
  '2026-10-012T01:00:00',
  '2026-10-12T1:00:00',
  '2026-10-12T001:00:00',
  '2026-10-12T01:0:00',
  '2026-10-12T01:000:00',
  '2026-10-12T01:00:0',
  '2026-10-12T01:00:000',
  'x2026-10-12T01:00:00',
  '2026-10-12T01:00:00x',
  ['2026-10-12T01:00:00'],
  '',
  12345,
  null,
];

test('[gdacs-source-007] reads valid times as UTC in any time zone', async () => {
  await inTimeZone(ZONE, () => {
    for (const [text, expected] of VALID_TIMES) {
      const event = only([
        rec({ fromdate: text, todate: text, datemodified: text }),
      ]);
      assert.equal(event.from, expected, text);
      assert.equal(event.to, expected, text);
      assert.equal(event.modified, expected, text);
    }
  });
});

test('[gdacs-source-008] sets invalid times to null and drops a record with an invalid start time', async () => {
  await inTimeZone(ZONE, () => {
    for (const text of INVALID_TIMES) {
      const event = only([rec({ todate: text, datemodified: text })]);
      assert.equal(event.to, null, String(text));
      assert.equal(event.modified, null, String(text));
      assert.equal(event.from, '2026-10-12T01:00:00.000Z');
    }
    const result = normalizeEvents(
      INVALID_TIMES.map((text) => rec({ fromdate: text })),
    );
    assert.deepEqual(result.events, []);
    assert.equal(result.counts.dropped, INVALID_TIMES.length);
    const missing = rec();
    delete missing.properties.fromdate;
    assert.equal(normalizeEvents([missing]).counts.dropped, 1);
  });
});

test('[gdacs-source-009] sets the alert level, the score and the current flag', () => {
  const flags = ['true', 'false', 'True', true, false, 1, undefined];
  const result = normalizeEvents(
    flags.map((iscurrent, index) => rec({ iscurrent, eventid: 10 + index })),
  );
  const byId = Object.fromEntries(
    result.events.map((event) => [event.eventId, event.current]),
  );
  assert.deepEqual(byId, {
    10: true,
    11: false,
    12: false,
    13: true,
    14: false,
    15: false,
    16: false,
  });
  assert.equal(result.counts.current, 2);
  for (const [text, expected] of [
    ['Green', 'green'],
    ['ORANGE', 'orange'],
    ['red', 'red'],
  ]) {
    assert.equal(only([rec({ alertlevel: text })]).alert, expected);
  }
  assert.equal(only([rec({ alertscore: 2 })]).alertScore, 2);
  for (const score of ['2', null, Infinity, undefined]) {
    assert.equal(only([rec({ alertscore: score })]).alertScore, null);
  }
});

const SIMON = {
  severity: 249.9984,
  severitytext: 'Tropical Storm (maximum wind speed of 250 km/h)',
  severityunit: 'km/h',
};
const storm = (properties) => rec({ eventtype: 'TC', ...properties });

test('[gdacs-source-010] keeps a severity with a unit and rounds its value to a whole number', () => {
  assert.deepEqual(only([storm({ severitydata: SIMON })]).severity, {
    value: 250,
    unit: 'km/h',
    text: 'Tropical Storm (maximum wind speed of 250 km/h)',
  });
  const one = only([
    storm({ severitydata: { ...SIMON, severity: 120.3696 } }),
  ]).severity;
  assert.equal(one.value, 120);
  const drought = only([
    rec({
      eventtype: 'DR',
      severitydata: {
        severity: 537380,
        severitytext: 'Minor impact for agricultural drought in 537380 km2',
        severityunit: 'km2',
      },
    }),
  ]).severity;
  assert.equal(drought.value, 537380);
  assert.equal(drought.unit, 'km2');
  const half = only([
    storm({ severitydata: { ...SIMON, severity: 0.5 } }),
  ]).severity;
  assert.equal(half.value, 1);
  for (const text of ['', null, 12345, undefined]) {
    const severity = only([
      storm({ severitydata: { ...SIMON, severity: 100, severitytext: text } }),
    ]).severity;
    assert.deepEqual(severity, { value: 100, unit: 'km/h', text: null });
  }
});

test('[gdacs-source-011] sets the severity to null when the unit, the value or the data is not usable', () => {
  const cases = [
    { severity: 0, severitytext: 'Magnitude 0 ', severityunit: '' },
    { severity: 0, severitytext: '', severityunit: '' },
    ...[0, 0.4, -5, 'fast', '250', Infinity, NaN, null, undefined].map(
      (severity) => ({ ...SIMON, severity }),
    ),
    { ...SIMON, severity: 100, severityunit: '' },
    { ...SIMON, severity: 100, severityunit: '<>' },
    { ...SIMON, severity: 100, severityunit: '   ' },
    { ...SIMON, severity: 100, severityunit: 5 },
    { ...SIMON, severity: 100, severityunit: undefined },
    undefined,
    [],
    null,
    'text',
  ];
  const result = normalizeEvents(
    cases.map((severitydata, index) =>
      rec({
        eventtype: ['FL', 'VO'][index] ?? 'TC',
        severitydata,
        eventid: 100 + index,
      }),
    ),
  );
  assert.equal(result.events.length, cases.length);
  for (const event of result.events) assert.equal(event.severity, null);
  assert.equal(result.counts.dropped, 0);
});

const letters = (count, letter = 'a') => letter.repeat(count);

test('[gdacs-source-012] cleans the names in the order of the rules and cuts them to 120 characters', () => {
  const name = (value) => only([rec({ name: value })]).name;
  assert.equal(name('Eruption  Kanlaon'), 'Eruption Kanlaon');
  assert.equal(name('Flood<b> in\u0007 X'), 'Floodb in X');
  assert.equal(name('A <> B'), 'A B');
  assert.equal(name('A\u007fB\u009fC'), 'ABC');
  assert.equal(name('A\u0000B'), 'AB');
  assert.equal(name('A\u001fB'), 'AB');
  assert.equal(name('A~B'), 'A~B');
  assert.equal(name('A\tB\nC\rD'), 'ABCD');
  assert.equal(name('A  B  C'), 'A B C');
  assert.equal(name('A\u00a0\u00a0B'), 'A\u00a0\u00a0B');
  assert.equal(name('\u00a0A\u00a0'), '\u00a0A\u00a0');
  assert.equal(name(' A '), 'A');
  assert.equal(name(' A'), 'A');
  assert.equal(name('A '), 'A');
  assert.equal(name('A B'), 'A B');
  assert.equal(
    name(`${letters(118)}  ${letters(10, 'b')}`),
    `${letters(118)} b`,
  );
  assert.equal(
    name(`${letters(118)}\u0001\u0002\u0003${letters(10, 'b')}`),
    `${letters(118)}bb`,
  );
  assert.equal(name(letters(130)), letters(120));
  assert.equal(name(letters(120)), letters(120));
  assert.equal(name(`${letters(119)} ${letters(10, 'b')}`), letters(119));
  assert.equal(
    name(`${letters(100)}${' '.repeat(30)}${letters(10, 'b')}`),
    `${letters(100)} ${letters(10, 'b')}`,
  );
  const labels = {
    FL: 'Flood',
    DR: 'Drought',
    VO: 'Volcano',
    TC: 'Tropical cyclone',
  };
  for (const [type, label] of Object.entries(labels)) {
    for (const value of ['   ', '', 7, null, undefined, '<>']) {
      assert.equal(only([rec({ eventtype: type, name: value })]).name, label);
    }
  }
});

test('[gdacs-source-013] cleans the country, the origin and the severity texts and checks the iso3', () => {
  const event = (properties) => only([rec(properties)]);
  assert.equal(event({ country: letters(200) }).country, letters(80));
  assert.equal(event({ country: letters(80) }).country, letters(80));
  for (const value of ['', '  ', 7, null, undefined]) {
    assert.equal(event({ country: value }).country, null);
    assert.equal(event({ source: value }).origin, null);
  }
  assert.equal(event({ country: 'A  <b> B' }).country, 'A b B');
  assert.equal(event({ country: 'A\u0007B' }).country, 'AB');
  assert.equal(event({ source: 'A\u0007B' }).origin, 'AB');
  assert.equal(event({ source: 'A<b>B' }).origin, 'AbB');
  assert.equal(event({ source: 'A  B' }).origin, 'A B');
  assert.equal(event({ source: ' A ' }).origin, 'A');
  assert.equal(event({ source: letters(50) }).origin, letters(40));
  assert.equal(event({ source: letters(40) }).origin, letters(40));
  const severity = (extra) =>
    event({ severitydata: { ...SIMON, ...extra } }).severity;
  assert.equal(severity({ severityunit: letters(20) }).unit, letters(12));
  assert.equal(severity({ severityunit: letters(12) }).unit, letters(12));
  assert.equal(severity({ severitytext: letters(200) }).text, letters(160));
  assert.equal(severity({ severitytext: letters(160) }).text, letters(160));
  assert.equal(severity({ severitytext: ' x  y ' }).text, 'x y');
  assert.equal(severity({ severityunit: 'k\u0007m' }).unit, 'km');
  assert.equal(severity({ severityunit: 'k  m' }).unit, 'k m');
  assert.equal(severity({ severityunit: ' km ' }).unit, 'km');
  assert.equal(severity({ severitytext: 'x\u0007y' }).text, 'xy');
  assert.equal(severity({ severitytext: 'x<b>y' }).text, 'xby');
  assert.equal(event({ iso3: 'TUR' }).iso3, 'TUR');
  for (const letter of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') {
    assert.equal(event({ iso3: letter.repeat(3) }).iso3, letter.repeat(3));
  }
  for (const value of [
    'ÀÀÀ',
    'TUR\n',
    'tur',
    'TURK',
    'TU',
    'T1R',
    'T<U>R',
    '',
    5,
    null,
    ['TUR'],
  ]) {
    assert.equal(event({ iso3: value }).iso3, null, String(value));
  }
});

test('[gdacs-source-014] joins duplicates and keeps the record with the highest episode', () => {
  const flood = (episodeid, extra = {}) => rec({ episodeid, ...extra });
  const one = (records) => {
    const result = normalizeEvents(records);
    assert.equal(result.events.length, 1);
    return result.events[0];
  };
  assert.equal(one([flood(2), flood(1), flood(2)]).episodeId, 2);
  const old = { datemodified: '2026-10-16T07:00:00' };
  const recent = { datemodified: '2026-10-16T08:00:00' };
  for (const order of [
    [flood(2, old), flood(1, recent)],
    [flood(1, recent), flood(2, old)],
  ]) {
    assert.equal(one(order).episodeId, 2);
  }
  for (const order of [
    [flood(2, recent), flood(2, old)],
    [flood(2, old), flood(2, recent)],
  ]) {
    assert.equal(one(order).modified, '2026-10-16T08:00:00.000Z');
  }
  for (const order of [
    [flood(2, { datemodified: null, name: 'A' }), flood(2, { name: 'B' })],
    [flood(2, { name: 'B' }), flood(2, { datemodified: null, name: 'A' })],
  ]) {
    assert.equal(one(order).name, 'B');
  }
  for (const order of [
    [flood(2, { name: 'First' }), flood(2, { name: 'Second' })],
    [
      flood(2, { datemodified: null, name: 'First' }),
      flood(2, { datemodified: null, name: 'Second' }),
    ],
  ]) {
    assert.equal(one(order).name, 'First');
  }
  for (const order of [
    [
      flood(2, { datemodified: '1969-12-31T23:59:59', name: 'A' }),
      flood(2, { datemodified: null, name: 'B' }),
    ],
    [
      flood(2, { datemodified: null, name: 'B' }),
      flood(2, { datemodified: '1969-12-31T23:59:59', name: 'A' }),
    ],
  ]) {
    assert.equal(one(order).name, 'A');
    assert.equal(one(order).modified, '1969-12-31T23:59:59.000Z');
  }
  for (const order of [
    [flood(2), flood(1)],
    [flood(1), flood(2)],
    [flood(2, { name: 'A' }), flood(2, { name: 'B' })],
  ]) {
    const result = normalizeEvents(order);
    assert.equal(result.events.length, 1);
    assert.equal(result.counts.dropped, 0);
    assert.equal(result.counts.total, 1);
  }
  const purple = normalizeEvents([
    flood(1),
    flood(3, { alertlevel: 'Purple' }),
    flood(2),
  ]);
  assert.equal(purple.events.length, 1);
  assert.equal(purple.events[0].episodeId, 2);
  assert.equal(purple.counts.dropped, 1);
  assert.equal(purple.counts.total, 1);
  const types = normalizeEvents([
    rec({ eventtype: 'DR', eventid: 7 }),
    rec({ eventtype: 'FL', eventid: 7 }),
  ]);
  assert.deepEqual(types.events.map((event) => event.id).sort(), [
    'DR-7',
    'FL-7',
  ]);
  assert.equal(types.counts.dropped, 0);
});

test('[gdacs-source-014] joins the records of different pages and of a full first page', async () => {
  const filler = Array.from({ length: 97 }, (_, i) =>
    rec({ eventid: 2000 + i }),
  );
  const first = [
    rec({ episodeid: 2 }),
    rec({ episodeid: 1 }),
    rec({ episodeid: 2 }),
    ...filler,
  ];
  assert.equal(first.length, 100);
  const calls = [];
  const { request } = install({
    fetchImpl: pagesFetch(
      [first, [rec({ episodeid: 1 })], { status: 204 }],
      calls,
    ),
  });
  const document = (await request('/')).body;
  assert.equal(calls.length, 2);
  assert.equal(document.events.length, 98);
  const flood = document.events.find((event) => event.id === 'FL-1104230');
  assert.equal(flood.episodeId, 2);
  const swapped = install({
    fetchImpl: pagesFetch([
      [
        rec({ episodeid: 1 }),
        ...filler,
        rec({ eventid: 1, name: 'X' }),
        rec({ eventid: 2 }),
      ],
      [rec({ episodeid: 2 })],
    ]),
  });
  const joined = (await swapped.request('/')).body;
  assert.equal(
    joined.events.find((event) => event.id === 'FL-1104230').episodeId,
    2,
  );
});

test('[gdacs-source-015] orders the events by modified time and id and lists at most 500', async () => {
  const records = Array.from({ length: 520 }, (_, i) =>
    rec({ eventid: 1 + i, datemodified: stamp(i), iscurrent: 'true' }),
  );
  const calls = [];
  const { request } = install({
    fetchImpl: pagesFetch([records, { status: 204 }], calls),
  });
  const document = (await request('/')).body;
  assert.equal(calls.length, 2);
  assert.equal(document.events.length, 500);
  assert.equal(document.events[0].eventId, 520);
  assert.equal(document.events[0].modified, '2026-01-01T00:08:39.000Z');
  assert.equal(document.events[499].eventId, 21);
  assert.deepEqual(document.counts, {
    total: 500,
    current: 500,
    dropped: 0,
    byType: { FL: 500, DR: 0, VO: 0, TC: 0 },
  });
  const mixed = rec({ eventtype: 'DR', eventid: 9000, datemodified: stamp(0) });
  const cut = normalizeEvents([mixed, ...records]);
  assert.equal(cut.counts.byType.DR, 0);
  assert.equal(cut.counts.byType.FL, 500);
  const kinds = normalizeEvents([
    rec({ eventtype: 'DR', eventid: 1 }),
    rec({ eventtype: 'VO', eventid: 2 }),
    rec({ eventtype: 'TC', eventid: 3 }),
    rec({ eventtype: 'TC', eventid: 4 }),
    rec({ eventtype: 'FL', eventid: 5 }),
  ]);
  assert.deepEqual(kinds.counts.byType, { FL: 1, DR: 1, VO: 1, TC: 2 });
  const three = normalizeEvents([
    rec({ eventid: 1, datemodified: null }),
    rec({ eventid: 2, datemodified: stamp(5) }),
    rec({ eventid: 3, datemodified: stamp(9) }),
  ]);
  assert.deepEqual(
    three.events.map((event) => event.eventId),
    [3, 2, 1],
  );
  const text = normalizeEvents([
    rec({ eventid: 9, datemodified: stamp(5) }),
    rec({ eventid: 10, datemodified: stamp(5) }),
  ]);
  assert.deepEqual(
    text.events.map((event) => event.id),
    ['FL-10', 'FL-9'],
  );
  const reverse = normalizeEvents([
    rec({ eventid: 10, datemodified: stamp(5) }),
    rec({ eventid: 9, datemodified: stamp(5) }),
  ]);
  assert.deepEqual(
    reverse.events.map((event) => event.id),
    ['FL-10', 'FL-9'],
  );
  for (const old of ['1969-12-31T23:59:59', '1970-01-01T00:00:00']) {
    const early = normalizeEvents([
      rec({ eventid: 1, datemodified: null }),
      rec({ eventid: 2, datemodified: old }),
    ]);
    assert.deepEqual(
      early.events.map((event) => event.eventId),
      [2, 1],
      old,
    );
  }
  const permutations = [
    [1, 2, 3],
    [1, 3, 2],
    [2, 1, 3],
    [2, 3, 1],
    [3, 1, 2],
    [3, 2, 1],
  ];
  for (const order of permutations) {
    const sorted = normalizeEvents(
      order.map((eventid) => rec({ eventid, datemodified: stamp(5) })),
    );
    assert.deepEqual(
      sorted.events.map((event) => event.id),
      ['FL-1', 'FL-2', 'FL-3'],
      order.join(),
    );
  }
  const nulls = normalizeEvents([
    rec({ eventid: 9, datemodified: null }),
    rec({ eventid: 10, datemodified: null }),
  ]);
  assert.deepEqual(
    nulls.events.map((event) => event.id),
    ['FL-10', 'FL-9'],
  );
});

function install(options = {}, preview = false) {
  const clock = { t: NOW };
  const timers = [];
  const cleared = [];
  const { useRealTimers, ...rest } = options;
  const plugin = gdacsProxy({
    now: () => clock.t,
    ...(useRealTimers
      ? {}
      : {
          setTimer: (fn, ms) => {
            timers.push({ fn, ms });
            return timers.length;
          },
          clearTimer: (id) => cleared.push(id),
        }),
    ...rest,
  });
  const request = mount(plugin, preview);
  return { request, clock, plugin, timers, cleared };
}
/** Mount the plugin on a fake server. The header call must come before the end call. */
function mount(plugin, preview = false) {
  let handler;
  plugin[preview ? 'configurePreviewServer' : 'configureServer']({
    middlewares: {
      use(path, callback) {
        assert.equal(path, '/api/gdacs');
        handler = callback;
      },
    },
  });
  return async (url = '/', method = 'GET', headers = {}) => {
    const res = {};
    res.writeHead = (code, head) => {
      assert.equal(res.statusCode, undefined);
      assert.equal(res.body, undefined);
      res.statusCode = code;
      res.headers = head;
    };
    res.end = (body) => {
      assert.equal(res.body, undefined);
      assert.notEqual(res.statusCode, undefined);
      res.body = JSON.parse(body);
    };
    await handler({ url, method, headers }, res);
    return res;
  };
}

/** A response for an answer of the test: a list of records, a status or a text. */
function answerOf(answer) {
  if (Array.isArray(answer)) {
    return new Response(
      JSON.stringify({ type: 'FeatureCollection', features: answer }),
      { status: 200 },
    );
  }
  if (answer.status === 204) return new Response(null, { status: 204 });
  return new Response(answer.text ?? '', { status: answer.status ?? 200 });
}
/** A fetch that answers the page requests in order, and records them. */
function pagesFetch(answers, calls = [], onCall = () => {}) {
  return async (url, options) => {
    calls.push({ url: String(url), options });
    onCall(calls.length);
    return answerOf(answers[calls.length - 1]);
  };
}

test('[gdacs-source-016] answers a GET request with the document', async () => {
  for (const preview of [false, true]) {
    const calls = [];
    const { request, plugin } = install(
      { fetchImpl: pagesFetch([[rec()]], calls) },
      preview,
    );
    assert.equal(plugin.name, 'gdacs');
    const res = await request('/');
    assert.equal(res.statusCode, 200);
    assert.equal(res.headers['Cache-Control'], 'no-store');
    assert.equal(res.headers['Content-Type'], 'application/json');
    assert.deepEqual(Object.keys(res.body).sort(), [
      'attribution',
      'counts',
      'coverage',
      'disclaimer',
      'events',
      'fetchedAt',
      'license',
      'reason',
      'schemaVersion',
      'source',
      'stale',
      'unavailable',
    ]);
    assert.equal(res.body.schemaVersion, 1);
    assert.equal(res.body.stale, false);
    assert.equal(res.body.unavailable, false);
    assert.equal(res.body.reason, null);
    assert.equal(
      res.body.source,
      'GDACS (Global Disaster Alert and Coordination System)',
    );
    assert.equal(
      res.body.attribution,
      'GDACS, a cooperation framework of the United Nations and the European Commission',
    );
    assert.equal(
      res.body.license,
      'The legal notice of the European Commission licenses content that the Union owns on the Commission website under CC BY 4.0. GDACS gives no separate license for the feed. Data of NOAA, JTWC, GloFAS, GDO and other sources keep their own terms. The provider shortens the data and rounds the positions.',
    );
    assert.equal(
      res.body.disclaimer,
      'The estimates of GDACS come from a machine, and an estimate can be wrong. Check each estimate before you use it to make a decision.',
    );
    assert.equal(
      res.body.coverage,
      'Flood, drought, volcano and tropical cyclone events active on any day from the UTC date 14 days before fetchedAt. The provider does not list earthquakes and wildfires.',
    );
    assert.equal(res.body.fetchedAt, '2026-03-05T10:00:00.000Z');
    assert.deepEqual(res.body.counts, {
      total: 1,
      current: 1,
      dropped: 0,
      byType: { FL: 1, DR: 0, VO: 0, TC: 0 },
    });
    assert.equal(res.body.events.length, 1);
    assert.equal(res.body.events[0].id, 'FL-1104230');
    assert.equal(calls.length, 1);
    assert.equal((await request('')).statusCode, 200);
  }
  assert.equal(gdacsProxy().name, 'gdacs');
});

test('[gdacs-source-017] refuses the methods other than GET and sends no page request', async () => {
  const calls = [];
  const { request } = install({ fetchImpl: pagesFetch([[rec()]], calls) });
  for (const method of ['POST', 'PUT', 'DELETE', 'HEAD']) {
    const res = await request('/', method);
    assert.equal(res.statusCode, 405, method);
    assert.deepEqual(res.body, { error: 'method_not_allowed' });
  }
  const withQuery = await request('/?x=1', 'POST');
  assert.equal(withQuery.statusCode, 405);
  assert.deepEqual(withQuery.body, { error: 'method_not_allowed' });
  assert.equal(calls.length, 0);
});

test('[gdacs-source-018] refuses a query or a sub-path and answers the empty path', async () => {
  const calls = [];
  const { request } = install({ fetchImpl: pagesFetch([[rec()]], calls) });
  for (const url of ['/?x=1', '/other', '/?']) {
    const res = await request(url);
    assert.equal(res.statusCode, 400, url);
    assert.deepEqual(res.body, { error: 'invalid_gdacs_query' });
  }
  assert.equal(calls.length, 0);
  const empty = await request('');
  assert.equal(empty.statusCode, 200);
  assert.equal(empty.body.events.length, 1);
  assert.equal(calls.length, 1);
});

test('[gdacs-source-019] sends the page request to the fixed address with UTC dates and fixed options', async () => {
  await inTimeZone(ZONE, async () => {
    const calls = [];
    const { request } = install({ fetchImpl: pagesFetch([[rec()]], calls) });
    await request('/');
    assert.equal(calls.length, 1);
    assert.equal(
      calls[0].url,
      'https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH?eventlist=FL;DR;VO;TC&fromdate=2026-02-19&todate=2026-03-05&alertlevel=green;orange;red&pagenumber=1',
    );
    assert.equal(calls[0].options.method, 'GET');
    assert.equal(calls[0].options.redirect, 'error');
    assert.deepEqual(Object.keys(calls[0].options).sort(), [
      'headers',
      'method',
      'redirect',
      'signal',
    ]);
    assert.deepEqual(calls[0].options.headers, {
      Accept: 'application/json',
      'User-Agent': 'gods-eye-view-gdacs-proxy/1.0',
    });
    assert.equal(calls[0].options.signal instanceof AbortSignal, true);
    const late = install({ fetchImpl: pagesFetch([[rec()]], calls) });
    late.clock.t = Date.UTC(2026, 0, 10, 23, 59, 59);
    await late.request('/');
    assert.equal(calls.length, 2);
    assert.match(calls[1].url, /&fromdate=2025-12-27&todate=2026-01-10&/);
    for (const edge of [
      Date.UTC(2026, 2, 5, 0, 0, 0, 0),
      Date.UTC(2026, 2, 5, 23, 59, 59, 999),
    ]) {
      const probe = install({ fetchImpl: pagesFetch([[rec()]], calls) });
      probe.clock.t = edge;
      await probe.request('/');
      assert.match(
        calls.at(-1).url,
        /&fromdate=2026-02-19&todate=2026-03-05&/,
        String(edge),
      );
    }
  });
});

const fullPage = (start, count = 100) =>
  Array.from({ length: count }, (_, i) => rec({ eventid: start + i }));

test('[gdacs-source-020] fetches pages in order and stops at a 204 answer, at a short page or after page 5', async () => {
  const calls = [];
  const { request, clock } = install({
    fetchImpl: pagesFetch([fullPage(1), fullPage(1000, 99)], calls, (n) => {
      if (n === 1) clock.t = Date.UTC(2026, 2, 6, 0, 0, 5);
    }),
  });
  clock.t = Date.UTC(2026, 2, 5, 23, 59, 58);
  const document = (await request('/')).body;
  assert.equal(calls.length, 2);
  assert.equal(document.events.length, 199);
  assert.match(calls[1].url, /&pagenumber=2$/);
  const dates = (url) =>
    url.match(/&fromdate=([^&]*)&todate=([^&]*)&/).slice(1);
  assert.deepEqual(dates(calls[0].url), ['2026-02-19', '2026-03-05']);
  assert.deepEqual(dates(calls[1].url), ['2026-02-19', '2026-03-05']);
  assert.equal(document.fetchedAt, '2026-03-05T23:59:58.000Z');

  const second204 = [];
  const a = install({
    fetchImpl: pagesFetch([fullPage(1), { status: 204 }], second204),
  });
  assert.equal((await a.request('/')).body.events.length, 100);
  assert.equal(second204.length, 2);

  const first204 = [];
  const b = install({ fetchImpl: pagesFetch([{ status: 204 }], first204) });
  const empty = (await b.request('/')).body;
  assert.equal(first204.length, 1);
  assert.deepEqual(empty.events, []);
  assert.equal(empty.unavailable, false);
  assert.equal(empty.stale, false);
  assert.equal(empty.fetchedAt, '2026-03-05T10:00:00.000Z');
  assert.deepEqual(empty.counts, {
    total: 0,
    current: 0,
    dropped: 0,
    byType: { FL: 0, DR: 0, VO: 0, TC: 0 },
  });

  const over = [];
  const c = install({ fetchImpl: pagesFetch([fullPage(1, 101), []], over) });
  await c.request('/');
  assert.equal(over.length, 2);

  const bad = [];
  const withBad = fullPage(1);
  withBad[0] = 5;
  withBad[1] = null;
  const d = install({ fetchImpl: pagesFetch([withBad, []], bad) });
  const dropped = (await d.request('/')).body;
  assert.equal(bad.length, 2);
  assert.equal(dropped.counts.dropped, 2);

  const five = [];
  const pages = [0, 1, 2, 3, 4].map((n) => {
    const page = fullPage(n * 100 + 1);
    page[0] = 5;
    page[1] = null;
    return page;
  });
  const e = install({ fetchImpl: pagesFetch(pages, five) });
  const capped = (await e.request('/')).body;
  assert.equal(five.length, 5);
  assert.deepEqual(
    five.map((call) => Number(call.url.match(/pagenumber=(\d+)$/)[1])),
    [1, 2, 3, 4, 5],
  );
  assert.equal(capped.events.length, 490);
});

const FAILURES = [
  ['a fetch that throws', () => Promise.reject(new TypeError('redirect'))],
  ['a status 301', () => answerOf({ status: 301, text: '[]' })],
  ['a status 404', () => answerOf({ status: 404, text: '[]' })],
  ['a status 500', () => answerOf({ status: 500, text: '[]' })],
  [
    'a status 206',
    () =>
      answerOf({
        status: 206,
        text: '{"type":"FeatureCollection","features":[]}',
      }),
  ],
  ['an empty body', () => answerOf({ text: '' })],
  ['a text that is not JSON', () => answerOf({ text: 'not json' })],
  ['the body {}', () => answerOf({ text: '{}' })],
  ['the body []', () => answerOf({ text: '[]' })],
  ['the body null', () => answerOf({ text: 'null' })],
  ['no features', () => answerOf({ text: '{"type":"FeatureCollection"}' })],
  [
    'null features',
    () => answerOf({ text: '{"type":"FeatureCollection","features":null}' }),
  ],
  [
    'object features',
    () => answerOf({ text: '{"type":"FeatureCollection","features":{}}' }),
  ],
  [
    'a wrong type',
    () => answerOf({ text: '{"type":"Feature","features":[]}' }),
  ],
  [
    'text features',
    () => answerOf({ text: '{"type":"FeatureCollection","features":"abc"}' }),
  ],
];

test('[gdacs-source-021] fails on each kind of bad answer', async () => {
  for (const [label, make] of FAILURES) {
    const { request } = install({ fetchImpl: async () => make() });
    const document = (await request('/')).body;
    assert.equal(document.unavailable, true, label);
    assert.equal(document.reason, 'GDACS unavailable', label);
    assert.deepEqual(document.events, [], label);
  }
  const calls = [];
  const second = install({
    fetchImpl: pagesFetch([fullPage(1), { status: 500 }], calls),
  });
  const document = (await second.request('/')).body;
  assert.equal(calls.length, 2);
  assert.equal(document.unavailable, true);
  assert.equal(document.reason, 'GDACS unavailable');
  assert.deepEqual(document.events, []);
  assert.equal(JSON.stringify(document).includes('FL-'), false);
});

const sizedPage = (bytes) => {
  const head = JSON.stringify({ type: 'FeatureCollection', features: [rec()] });
  const padded = head.replace(
    '"features"',
    `${' '.repeat(bytes - Buffer.byteLength(head))}"features"`,
  );
  assert.equal(Buffer.byteLength(padded), bytes);
  return { text: padded };
};

test('[gdacs-source-022] accepts an answer of exactly 2 MiB and refuses an answer with one byte more', async () => {
  const limit = 2 * 1024 * 1024;
  const exact = install({ fetchImpl: pagesFetch([sizedPage(limit)]) });
  const good = (await exact.request('/')).body;
  assert.equal(good.unavailable, false);
  assert.equal(good.stale, false);
  assert.equal(good.events.length, 1);
  const over = install({ fetchImpl: pagesFetch([sizedPage(limit + 1)]) });
  const bad = (await over.request('/')).body;
  assert.equal(bad.unavailable, true);
  assert.equal(bad.reason, 'GDACS unavailable');
});

test('[gdacs-source-023] stops a refresh after 30 seconds with one timer and one signal', async () => {
  const calls = [];
  const fetchImpl = async (url, options) => {
    calls.push({ url, options });
    if (calls.length === 1) return answerOf(fullPage(1));
    return new Promise((resolve, reject) => {
      options.signal.addEventListener('abort', () =>
        reject(new DOMException('aborted', 'AbortError')),
      );
    });
  };
  const { request, timers, cleared } = install({ fetchImpl });
  const pending = request('/');
  for (let turn = 0; turn < 50 && calls.length < 2; turn += 1) {
    await new Promise((resolve) => setImmediate(resolve));
  }
  assert.equal(calls.length, 2);
  assert.equal(timers.length, 1);
  assert.equal(timers[0].ms, 30000);
  assert.equal(calls[0].options.signal, calls[1].options.signal);
  assert.equal(calls[1].options.signal.aborted, false);
  timers[0].fn();
  assert.equal(calls[1].options.signal.aborted, true);
  const document = (await pending).body;
  assert.equal(document.unavailable, true);
  assert.deepEqual(cleared, [1]);

  const stall = install({
    fetchImpl: async () =>
      new Response(
        new ReadableStream({
          start(controller) {
            controller.enqueue(new TextEncoder().encode('{"type":"Feat'));
          },
        }),
        { status: 200 },
      ),
  });
  const stalled = stall.request('/');
  for (let turn = 0; turn < 20; turn += 1) {
    await new Promise((resolve) => setImmediate(resolve));
  }
  stall.timers[0].fn();
  const outcome = await Promise.race([
    stalled.then((res) => res.body.unavailable),
    new Promise((resolve) => {
      setTimeout(() => resolve('hung'), 2000).unref();
    }),
  ]);
  assert.equal(outcome, true);

  const ok = install({ fetchImpl: pagesFetch([[rec()]]) });
  await ok.request('/');
  assert.equal(ok.timers.length, 1);
  assert.deepEqual(ok.cleared, [1]);
  const real = install({
    fetchImpl: pagesFetch([[rec()]]),
    useRealTimers: true,
  });
  assert.equal((await real.request('/')).body.unavailable, false);
});

test('[gdacs-source-024] serves the last good document when a refresh fails, if the document is younger than 1 hour at the start of that refresh', async () => {
  for (const [age, stale] of [
    [HOUR - 1, true],
    [HOUR, false],
  ]) {
    const { request, clock } = install({
      fetchImpl: pagesFetch([[rec()], { status: 500 }]),
    });
    const good = (await request('/')).body;
    clock.t += age;
    const next = (await request('/')).body;
    if (stale) {
      assert.deepEqual(next, { ...good, stale: true });
      assert.equal(next.fetchedAt, '2026-03-05T10:00:00.000Z');
    } else {
      assert.equal(next.unavailable, true);
      assert.equal(next.stale, false);
      assert.equal(next.fetchedAt, null);
      assert.equal(next.reason, 'GDACS unavailable');
      for (const field of [
        'schemaVersion',
        'source',
        'attribution',
        'license',
        'disclaimer',
        'coverage',
      ]) {
        assert.equal(next[field], good[field], field);
      }
      assert.deepEqual(next.counts, {
        total: 0,
        current: 0,
        dropped: 0,
        byType: { FL: 0, DR: 0, VO: 0, TC: 0 },
      });
      assert.deepEqual(next.events, []);
    }
  }
  const slow = [];
  const late = install({
    fetchImpl: pagesFetch([[rec()], { status: 500 }], slow, (n) => {
      if (n === 2) late.clock.t += 30_000;
    }),
  });
  const first = (await late.request('/')).body;
  late.clock.t += HOUR - 1;
  const second = (await late.request('/')).body;
  assert.equal(slow.length, 2);
  assert.deepEqual(second, { ...first, stale: true });
  const calls = [];
  const { request } = install({
    fetchImpl: pagesFetch([{ status: 500 }, [rec()]], calls),
  });
  assert.equal((await request('/')).body.unavailable, true);
  const again = (await request('/')).body;
  assert.equal(calls.length, 2);
  assert.equal(again.unavailable, false);
  assert.equal(again.events.length, 1);
});

test('[gdacs-source-025] caches the document for 10 minutes and shares one refresh', async () => {
  const calls = [];
  let open;
  const gate = new Promise((resolve) => {
    open = resolve;
  });
  const fetchImpl = async (url, options) => {
    calls.push({ url, options });
    if (calls.length === 1) await gate;
    return answerOf([rec()]);
  };
  const { request, clock } = install({ fetchImpl });
  const first = request('/');
  const second = request('/');
  await new Promise((resolve) => setImmediate(resolve));
  open();
  const [a, b] = await Promise.all([first, second]);
  assert.equal(calls.length, 1);
  assert.deepEqual(a.body, b.body);
  clock.t = NOW + 10 * MINUTE - 1;
  const third = await request('/');
  assert.equal(calls.length, 1);
  assert.equal(third.body.fetchedAt, '2026-03-05T10:00:00.000Z');
  clock.t = NOW + 10 * MINUTE;
  const fourth = await request('/');
  assert.equal(calls.length, 2);
  assert.equal(fourth.body.fetchedAt, '2026-03-05T10:10:00.000Z');
  clock.t = NOW + 15 * MINUTE;
  const fifth = await request('/');
  assert.equal(calls.length, 2);
  assert.equal(fifth.body.fetchedAt, '2026-03-05T10:10:00.000Z');
});

test('[gdacs-source-026] registers the provider and mounts the route in both servers', () => {
  const plugins = localProviderPlugins().filter(
    (plugin) => plugin.name === 'gdacs',
  );
  assert.equal(plugins.length, 1);
  for (const method of ['configureServer', 'configurePreviewServer']) {
    const paths = [];
    plugins[0][method]({
      middlewares: {
        use: (path, callback) => paths.push([path, typeof callback]),
      },
    });
    assert.deepEqual(paths, [['/api/gdacs', 'function']]);
  }
});

test('[gdacs-source-027] sends only the fixed headers to GDACS', async () => {
  const calls = [];
  const { request } = install({ fetchImpl: pagesFetch([[rec()]], calls) });
  const secret = {
    Cookie: 'session=SECRET-cookie',
    Authorization: 'Bearer SECRET-token',
    Referer: 'http://SECRET-referrer.example/',
    'User-Agent': 'SECRET-browser',
  };
  const res = await request('/', 'GET', secret);
  assert.equal(calls.length, 1);
  assert.deepEqual(Object.keys(calls[0].options.headers).sort(), [
    'Accept',
    'User-Agent',
  ]);
  assert.equal(
    calls[0].options.headers['User-Agent'],
    'gods-eye-view-gdacs-proxy/1.0',
  );
  assert.equal(calls[0].options.headers['User-Agent'].includes('@'), false);
  assert.equal(calls[0].options.body, undefined);
  assert.equal(JSON.stringify(res.body).includes('SECRET'), false);
});

test('[gdacs-source-009 gdacs-source-011] turns a number that is too large for a score or a severity into null', async () => {
  const record = rec({
    alertscore: 'SCORE',
    severitydata: {
      severity: 'SEVERITY',
      severitytext: 'x',
      severityunit: 'km/h',
    },
  });
  const text = JSON.stringify({ type: 'FeatureCollection', features: [record] })
    .replace('"SCORE"', '1e999')
    .replace('"SEVERITY"', '1e999');
  assert.equal(text.includes('1e999'), true);
  const { request } = install({
    fetchImpl: async () => answerOf({ text }),
  });
  const event = (await request('/')).body.events[0];
  assert.equal(event.alertScore, null);
  assert.equal(event.severity, null);
});

test('[gdacs-source-016] uses the global fetch and the real clock when it gets no options', async () => {
  const saved = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url) => {
    calls.push(String(url));
    return answerOf([rec()]);
  };
  try {
    const request = mount(gdacsProxy());
    const before = Date.now();
    const res = await request('/');
    const after = Date.now();
    assert.equal(calls.length, 1);
    const fetchedAt = Date.parse(res.body.fetchedAt);
    assert.equal(fetchedAt >= before && fetchedAt <= after, true);
    assert.equal(res.body.unavailable, false);
  } finally {
    globalThis.fetch = saved;
  }
});

test('[gdacs-source-005] drops more wrong values of the type and the alert level and keeps the valid ones', () => {
  const wrong = [
    ...['FLOOD', 'FL ', ' FL'].map((v) => ({ eventtype: v })),
    ...[
      ' green',
      'green ',
      'greenish',
      'Redd',
      { toLowerCase: 'green' },
      { toLowerCase: 1 },
    ].map((v) => ({ alertlevel: v })),
  ];
  const result = normalizeEvents(wrong.map((properties) => rec(properties)));
  assert.deepEqual(result.events, []);
  assert.equal(result.counts.dropped, wrong.length);
  for (const type of ['FL', 'DR', 'VO', 'TC']) {
    assert.equal(only([rec({ eventtype: type })]).type, type);
  }
  for (const [text, expected] of [
    ['Green', 'green'],
    ['Orange', 'orange'],
    ['RED', 'red'],
  ]) {
    assert.equal(only([rec({ alertlevel: text })]).alert, expected);
  }
  assert.equal(only([rec({ eventid: 1 })]).eventId, 1);
  assert.equal(
    only([rec({ eventid: 9007199254740992 })]).eventId,
    9007199254740992,
  );
  assert.equal(
    only([rec({ episodeid: 9007199254740992 })]).episodeId,
    9007199254740992,
  );
});

test('[gdacs-source-006] drops a position at the rounded limit, a null geometry and a bad latitude', () => {
  const wrong = [
    at(180.0004, 10),
    at(-180.0004, 10),
    at(10, 90.0004),
    at(10, -90.0004),
    { geometry: null },
    at(10, null),
    at(10, '5'),
    at(10, NaN),
    at(-0, -0),
  ];
  const result = normalizeEvents(wrong.map((top) => rec({}, top)));
  assert.deepEqual(result.events, []);
  assert.equal(result.counts.dropped, wrong.length);
  const listed = (longitude, latitude) =>
    only([rec({}, at(longitude, latitude))]);
  assert.equal(listed(10, 0.0045).latitude, 0.005);
  assert.equal(Object.is(listed(-0.0004, 10).longitude, 0), true);
});

test('[gdacs-source-009] keeps an alert score of 0, a negative score and a fraction', () => {
  for (const score of [0, -1, 1.5]) {
    assert.equal(
      Object.is(only([rec({ alertscore: score })]).alertScore, score),
      true,
    );
  }
});

test('[gdacs-source-010] keeps a severity value above 32 bits and a unit with capital letters', () => {
  const severity = only([
    rec({ severitydata: { ...SIMON, severity: 3e9, severityunit: 'MW' } }),
  ]).severity;
  assert.equal(severity.value, 3000000000);
  assert.equal(severity.unit, 'MW');
});

test('[gdacs-source-019] sends the same form of page request for each page and the dates of each refresh', async () => {
  const calls = [];
  const { request, clock } = install({
    fetchImpl: pagesFetch([fullPage(1), fullPage(1000, 99), [rec()]], calls),
  });
  await request('/');
  assert.equal(calls.length, 2);
  calls.forEach((call, index) => {
    assert.equal(
      call.url,
      `https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH?eventlist=FL;DR;VO;TC&fromdate=2026-02-19&todate=2026-03-05&alertlevel=green;orange;red&pagenumber=${index + 1}`,
    );
    assert.equal(call.options.method, 'GET');
    assert.equal(call.options.redirect, 'error');
    assert.deepEqual(Object.keys(call.options).sort(), [
      'headers',
      'method',
      'redirect',
      'signal',
    ]);
    assert.deepEqual(call.options.headers, {
      Accept: 'application/json',
      'User-Agent': 'gods-eye-view-gdacs-proxy/1.0',
    });
  });
  clock.t = Date.UTC(2026, 2, 6, 10, 11, 0);
  await request('/');
  assert.equal(calls.length, 3);
  assert.match(calls[2].url, /&fromdate=2026-02-20&todate=2026-03-06&/);
});

test('[gdacs-source-021] fails on a bad status with a valid body and on a bad second page', async () => {
  const valid = '{"type":"FeatureCollection","features":[]}';
  for (const status of [301, 404, 500]) {
    const { request } = install({
      fetchImpl: async () => answerOf({ status, text: valid }),
    });
    const document = (await request('/')).body;
    assert.equal(document.unavailable, true, String(status));
    assert.equal(document.reason, 'GDACS unavailable');
  }
  const second = install({
    fetchImpl: pagesFetch([fullPage(1), { text: '{}' }]),
  });
  const document = (await second.request('/')).body;
  assert.equal(document.unavailable, true);
  assert.deepEqual(document.events, []);
});

test('[gdacs-source-023] starts the timer before the first page and takes the timers of the system by default', async () => {
  const hang = install({
    fetchImpl: (url, options) =>
      new Promise((resolve, reject) => {
        options.signal.addEventListener('abort', () =>
          reject(new DOMException('aborted', 'AbortError')),
        );
      }),
  });
  const pending = hang.request('/');
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(hang.timers.length, 1);
  hang.timers[0].fn();
  assert.equal((await pending).body.unavailable, true);

  const savedSet = globalThis.setTimeout;
  const savedClear = globalThis.clearTimeout;
  const sets = [];
  const clears = [];
  globalThis.setTimeout = (fn, ms) => {
    const handle = savedSet(fn, ms);
    sets.push({ ms, handle });
    return handle;
  };
  globalThis.clearTimeout = (handle) => {
    clears.push(handle);
    return savedClear(handle);
  };
  let request;
  try {
    request = mount(
      gdacsProxy({ fetchImpl: pagesFetch([[rec()]]), now: () => NOW }),
    );
  } finally {
    globalThis.setTimeout = savedSet;
    globalThis.clearTimeout = savedClear;
  }
  await request('/');
  const mine = sets.filter((entry) => entry.ms === 30000);
  assert.equal(mine.length, 1);
  assert.deepEqual(clears, [mine[0].handle]);
});

test('[gdacs-source-024] sends the status 200 and tries GDACS again after a stale document', async () => {
  const calls = [];
  const { request, clock } = install({
    fetchImpl: pagesFetch([[rec()], { status: 500 }, { status: 500 }], calls),
  });
  await request('/');
  clock.t += HOUR - 1;
  const stale = await request('/');
  assert.equal(stale.statusCode, 200);
  assert.equal(stale.body.stale, true);
  assert.equal(calls.length, 2);
  const next = await request('/');
  assert.equal(calls.length, 3);
  assert.equal(next.body.stale, true);
  const gone = install({ fetchImpl: pagesFetch([{ status: 500 }]) });
  const unavailable = await gone.request('/');
  assert.equal(unavailable.statusCode, 200);
  assert.equal(unavailable.body.unavailable, true);
});

test('[gdacs-source-025] caches a document with no event and shares a refresh whatever the time of the request', async () => {
  const calls = [];
  const empty = install({
    fetchImpl: pagesFetch([{ status: 204 }, [rec()]], calls),
  });
  await empty.request('/');
  await empty.request('/');
  assert.equal(calls.length, 1);
  const many = [];
  let open;
  const gate = new Promise((resolve) => {
    open = resolve;
  });
  const { request, clock } = install({
    fetchImpl: async (url, options) => {
      many.push({ url, options });
      await gate;
      return answerOf([rec()]);
    },
  });
  const first = request('/');
  clock.t = NOW + 1;
  const second = request('/');
  await new Promise((resolve) => setImmediate(resolve));
  open();
  await Promise.all([first, second]);
  assert.equal(many.length, 1);
});

test('[gdacs-source-027] sends only the fixed headers when the browser sends lower case header names', async () => {
  const calls = [];
  const { request } = install({ fetchImpl: pagesFetch([[rec()]], calls) });
  const res = await request('/', 'GET', {
    cookie: 'session=SECRET-cookie',
    authorization: 'Bearer SECRET-token',
    referer: 'http://SECRET-referrer.example/',
    'user-agent': 'SECRET-browser',
  });
  assert.deepEqual(Object.keys(calls[0].options).sort(), [
    'headers',
    'method',
    'redirect',
    'signal',
  ]);
  assert.deepEqual(calls[0].options.headers, {
    Accept: 'application/json',
    'User-Agent': 'gods-eye-view-gdacs-proxy/1.0',
  });
  assert.equal(JSON.stringify(res.body).includes('SECRET'), false);
});
