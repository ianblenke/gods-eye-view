import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createCycloneSource,
  validateCycloneSnapshot,
  CYCLONE_RESPONSE_LIMIT,
} from './source.js';

const issuedAt = '2026-09-16T03:00:00.000Z';
function fixture() {
  return {
    schemaVersion: 1,
    source: 'NOAA NHC / CPHC',
    attribution: 'NOAA/NWS',
    coverage: 'Atlantic and eastern/central North Pacific',
    fetchedAt: Date.parse(issuedAt),
    stale: false,
    unavailable: false,
    reason: null,
    storms: [
      {
        id: 'ep152026',
        name: 'Fifteen-E',
        classification: 'PTC',
        basin: 'EP',
        position: { longitude: -125.8, latitude: 15.5 },
        positionAt: issuedAt,
        issuedAt,
        advisoryNumber: '10',
        windKt: 25,
        pressureHpa: 1006,
        movement: { directionDegrees: null, speedKt: null },
        advisoryUrl: 'https://www.nhc.noaa.gov/text/MIATCMEP5.shtml',
        outlookUrl: 'https://www.nhc.noaa.gov/gtwo.php?basin=epac&fdays=7',
        geometryStatus: 'pending',
        geometryAdvisoryNumber: null,
        forecastPoints: [],
        track: null,
        cone: null,
      },
    ],
  };
}
function current() {
  const value = fixture(),
    storm = value.storms[0];
  storm.geometryStatus = 'current';
  storm.geometryAdvisoryNumber = '10';
  storm.forecastPoints = [
    {
      position: { longitude: 179, latitude: 15 },
      tauHours: 12,
      windKt: 30,
      gustKt: 40,
    },
  ];
  storm.track = {
    type: 'MultiLineString',
    coordinates: [
      [
        [179, 15],
        [-179, 16],
      ],
      [
        [170, 14],
        [179, 15],
      ],
    ],
  };
  storm.cone = {
    type: 'MultiPolygon',
    coordinates: [
      [
        [
          [178, 10],
          [-178, 10],
          [-178, 20],
          [178, 10],
        ],
        [
          [179, 12],
          [-179, 12],
          [-179, 14],
          [179, 12],
        ],
      ],
      [
        [
          [170, 1],
          [171, 1],
          [171, 2],
          [170, 1],
        ],
      ],
    ],
  };
  return value;
}
test('[cyclones-001] cyclone projection preserves MultiPolygon holes/dateline and separates advisory from position time', () => {
  const value = current();
  value.storms[0].positionAt = '2026-09-16T03:30:00.000Z';
  value.storms[0].cone.properties = {
    html: '<script>',
    href: 'https://example.invalid',
  };
  const result = validateCycloneSnapshot(value);
  assert.deepEqual(
    result.storms[0].cone.coordinates,
    value.storms[0].cone.coordinates,
  );
  assert.notEqual(result.storms[0].positionAt, result.storms[0].issuedAt);
  assert.equal(result.storms[0].cone.properties, undefined);
  assert.notEqual(
    result.storms[0].cone.coordinates,
    value.storms[0].cone.coordinates,
  );
});
test('[cyclones-002] successful empty coverage is distinct from unavailable', () => {
  const value = fixture();
  value.storms = [];
  assert.equal(validateCycloneSnapshot(value).unavailable, false);
  assert.equal(
    validateCycloneSnapshot({
      ...value,
      unavailable: true,
      stale: true,
      fetchedAt: null,
      reason: 'Unavailable',
    }).unavailable,
    true,
  );
  assert.throws(
    () => validateCycloneSnapshot({ ...fixture(), unavailable: true }),
    /Malformed/,
  );
});
test('[cyclones-003 cyclones-004 cyclones-005] mismatched, malformed or unbounded cyclone geometry is rejected whole', () => {
  const changes = [
    (storm) => {
      storm.geometryAdvisoryNumber = '9';
    },
    (storm) => {
      storm.geometryStatus = 'pending';
    },
    (storm) => {
      storm.position.longitude = 181;
    },
    (storm) => {
      storm.track.coordinates[0][0][0] = NaN;
    },
    (storm) => {
      storm.cone.coordinates[0][0].pop();
    },
    (storm) => {
      storm.forecastPoints.push(storm.forecastPoints[0]);
    },
    (storm) => {
      storm.advisoryUrl = 'https://example.invalid/text/TEST.shtml';
    },
    (storm) => {
      storm.issuedAt = '2026-02-31T00:00:00.000Z';
    },
    (storm) => {
      storm.windKt = 9999;
    },
  ];
  for (const change of changes) {
    const value = current();
    change(value.storms[0]);
    assert.throws(() => validateCycloneSnapshot(value));
  }
  const oversized = current();
  oversized.storms[0].track = {
    type: 'MultiLineString',
    coordinates: Array.from({ length: 3 }, () =>
      Array.from({ length: 9000 }, () => [1, 2]),
    ),
  };
  assert.throws(() => validateCycloneSnapshot(oversized), /Malformed/);
  assert.throws(
    () =>
      validateCycloneSnapshot({
        ...fixture(),
        storms: Array(33).fill(fixture().storms[0]),
      }),
    /Malformed/,
  );
});
test('[cyclones-006 cyclones-007 cyclones-008] source is lazy and fixed-origin, caps bytes, and honors pre-abort', async () => {
  const calls = [];
  const source = createCycloneSource({
    fetchImpl: async (url, options) => {
      calls.push({ url, options });
      return Response.json(fixture());
    },
  });
  assert.equal(calls.length, 0);
  await source.getSnapshot();
  assert.equal(calls[0].url, '/api/cyclones');
  assert.equal(calls[0].options.redirect, 'error');
  await assert.rejects(source.getSnapshot({ signal: AbortSignal.abort() }), {
    name: 'AbortError',
  });
  assert.equal(calls.length, 1);
  const oversized = createCycloneSource({
    fetchImpl: async () =>
      new Response('{}', {
        headers: { 'content-length': String(CYCLONE_RESPONSE_LIMIT + 1) },
      }),
  });
  await assert.rejects(oversized.getSnapshot(), /too large/);
});
test('[cyclones-008] source deadline cancels request and removes timer on completion', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  let signal;
  const source = createCycloneSource({
    timeoutMs: 10,
    fetchImpl: async (_url, options) => {
      signal = options.signal;
      return new Promise((_resolve, reject) =>
        signal.addEventListener('abort', () => reject(signal.reason), {
          once: true,
        }),
      );
    },
  });
  const pending = source.getSnapshot();
  const rejected = assert.rejects(pending, /timed out/);
  t.mock.timers.tick(11);
  await rejected;
  assert.equal(signal.aborted, true);
});

const MALFORMED = { message: 'Malformed cyclone snapshot' };
const clone = (value) => structuredClone(value);
function assign(target, path, value) {
  const keys = path.split('.');
  const last = keys.pop();
  const holder = keys.reduce((object, key) => object[key], target);
  if (value === undefined) delete holder[last];
  else holder[last] = value;
}
/** A valid snapshot with one `current` storm, changed by a list of [path, value]. */
function changed(...edits) {
  const value = current();
  for (const [path, next] of edits) assign(value, path, next);
  return value;
}
function pendingStorm(id, basin = id.slice(0, 2).toUpperCase()) {
  return { ...clone(fixture().storms[0]), id, basin };
}
/** A `current` storm with a short track, a short cone and `points` forecast points. */
function currentStorm(id, points, extra = {}) {
  const storm = { ...clone(current().storms[0]), id, basin: 'EP', ...extra };
  storm.forecastPoints = Array.from({ length: points }, (_, index) => ({
    position: { longitude: 10, latitude: 10 },
    tauHours: index / 4,
    windKt: null,
    gustKt: null,
  }));
  return storm;
}
const pairs = (count) => Array.from({ length: count }, () => [1, 2]);
/** A closed ring of `count` pairs. */
const longRing = (count) =>
  Array.from({ length: count }, (_, index) =>
    index === 0 || index === count - 1 ? [0, 0] : [1, 1],
  );
const ring = () => [
  [0, 0],
  [1, 0],
  [1, 1],
  [0, 0],
];

test('[cyclones-001] the projection holds exactly the named fields, as copies, with the normal form of each link', () => {
  const input = {
    schemaVersion: 1,
    source: 'Test source',
    attribution: 'Test attribution',
    coverage: 'Test coverage',
    fetchedAt: 1758000000000,
    stale: true,
    unavailable: false,
    reason: 'Test reason',
    extraSnapshot: 'drop',
    storms: [
      {
        id: 'al012026',
        name: 'Test storm',
        classification: 'HU',
        basin: 'AL',
        position: { longitude: -60.5, latitude: 20.25, altitude: 5 },
        positionAt: '2026-09-16T04:00:00.000Z',
        issuedAt: '2026-09-16T03:00:00.000Z',
        advisoryNumber: '7A',
        windKt: 55,
        pressureHpa: 985,
        movement: { directionDegrees: 270, speedKt: 12, extra: 1 },
        advisoryUrl: 'https://WWW.NHC.NOAA.GOV/text/MIATCMAT1.shtml',
        outlookUrl: 'https://www.nhc.noaa.gov:443/gtwo.php?basin=cpac&fdays=7',
        geometryStatus: 'current',
        geometryAdvisoryNumber: '7A',
        forecastPoints: [
          {
            position: { longitude: -61, latitude: 21, altitude: 1 },
            tauHours: 12,
            windKt: 60,
            gustKt: 75,
            extra: 2,
          },
        ],
        track: {
          type: 'LineString',
          coordinates: [
            [-60.5, 20.25],
            [-61, 21],
          ],
          bbox: [1, 2, 3, 4],
        },
        cone: { type: 'Polygon', coordinates: [ring()], properties: { a: 1 } },
        extraStorm: 'drop',
      },
    ],
  };
  const result = validateCycloneSnapshot(input);
  assert.deepEqual(result, {
    schemaVersion: 1,
    source: 'Test source',
    attribution: 'Test attribution',
    coverage: 'Test coverage',
    fetchedAt: 1758000000000,
    stale: true,
    unavailable: false,
    reason: 'Test reason',
    storms: [
      {
        id: 'al012026',
        name: 'Test storm',
        classification: 'HU',
        basin: 'AL',
        position: { longitude: -60.5, latitude: 20.25 },
        positionAt: '2026-09-16T04:00:00.000Z',
        advisoryNumber: '7A',
        issuedAt: '2026-09-16T03:00:00.000Z',
        windKt: 55,
        pressureHpa: 985,
        movement: { directionDegrees: 270, speedKt: 12 },
        advisoryUrl: 'https://www.nhc.noaa.gov/text/MIATCMAT1.shtml',
        outlookUrl: 'https://www.nhc.noaa.gov/gtwo.php?basin=cpac&fdays=7',
        geometryStatus: 'current',
        geometryAdvisoryNumber: '7A',
        forecastPoints: [
          {
            position: { longitude: -61, latitude: 21 },
            tauHours: 12,
            windKt: 60,
            gustKt: 75,
          },
        ],
        track: {
          type: 'LineString',
          coordinates: [
            [-60.5, 20.25],
            [-61, 21],
          ],
        },
        cone: {
          type: 'Polygon',
          coordinates: [
            [
              [0, 0],
              [1, 0],
              [1, 1],
              [0, 0],
            ],
          ],
        },
      },
    ],
  });
  const storm = result.storms[0];
  assert.notEqual(storm.track.coordinates, input.storms[0].track.coordinates);
  assert.notEqual(
    storm.track.coordinates[0],
    input.storms[0].track.coordinates[0],
  );
  assert.notEqual(
    storm.cone.coordinates[0][0],
    input.storms[0].cone.coordinates[0][0],
  );
  assert.equal(result.storms.length, 1);
  assert.notEqual(result.storms, input.storms);
});

test('[cyclones-001] a track of one line and a cone of one polygon keep their types', () => {
  const value = changed(
    [
      'storms.0.track',
      {
        type: 'LineString',
        coordinates: [
          [170, 14],
          [171, 15],
        ],
      },
    ],
    ['storms.0.cone', { type: 'Polygon', coordinates: [ring()] }],
  );
  const { track, cone } = validateCycloneSnapshot(value).storms[0];
  assert.equal(track.type, 'LineString');
  assert.deepEqual(track.coordinates, [
    [170, 14],
    [171, 15],
  ]);
  assert.equal(cone.type, 'Polygon');
  assert.deepEqual(cone.coordinates, [ring()]);
});

test('[cyclones-003] the validator rejects a wrong snapshot shape or storm identity', () => {
  const rows = [
    ['schema version 2', [['schemaVersion', 2]]],
    ['schema version missing', [['schemaVersion', undefined]]],
    ['stale is a string', [['stale', 'no']]],
    ['unavailable is a number', [['unavailable', 0]]],
    ['storms is an object', [['storms', {}]]],
    ['storms is missing', [['storms', undefined]]],
    ['unknown basin prefix', [['storms.0.id', 'xx152026']]],
    ['id has five digits', [['storms.0.id', 'ep15202']]],
    ['id has seven digits', [['storms.0.id', 'ep1520261']]],
    ['id is in upper case', [['storms.0.id', 'EP152026']]],
    ['id is missing', [['storms.0.id', undefined]]],
    ['geometry status is unknown', [['storms.0.geometryStatus', 'stale']]],
    ['geometry status is missing', [['storms.0.geometryStatus', undefined]]],
    ['basin does not match the id', [['storms.0.basin', 'AL']]],
    ['basin is in lower case', [['storms.0.basin', 'ep']]],
    ['basin is missing', [['storms.0.basin', undefined]]],
  ];
  for (const [label, edits] of rows)
    assert.throws(
      () => validateCycloneSnapshot(changed(...edits)),
      MALFORMED,
      label,
    );
  for (const value of [null, undefined])
    assert.throws(() => validateCycloneSnapshot(value), MALFORMED);
  assert.throws(
    () => validateCycloneSnapshot(changed(['storms', [null]])),
    MALFORMED,
    'a storm that is null',
  );
  const twice = changed();
  twice.storms.push(clone(twice.storms[0]));
  assert.throws(() => validateCycloneSnapshot(twice), MALFORMED, 'repeated id');
  const many = (count) => ({
    ...fixture(),
    storms: Array.from({ length: count }, (_, index) =>
      pendingStorm(`al${String(index).padStart(2, '0')}2026`),
    ),
  });
  assert.equal(validateCycloneSnapshot(many(32)).storms.length, 32);
  assert.throws(() => validateCycloneSnapshot(many(33)), MALFORMED, '33');
  const basins = {
    ...fixture(),
    storms: [
      pendingStorm('al012026'),
      pendingStorm('ep012026'),
      pendingStorm('cp012026'),
    ],
  };
  assert.deepEqual(
    validateCycloneSnapshot(basins).storms.map((storm) => storm.basin),
    ['AL', 'EP', 'CP'],
  );
});

const tooLong = (limit) => 'a'.repeat(limit + 1);
test('[cyclones-004] the validator rejects a wrong text and accepts a text on its limit', () => {
  const fields = [
    ['storms.0.name', 80],
    ['storms.0.classification', 16],
    ['source', 160],
    ['attribution', 240],
    ['coverage', 240],
    ['reason', 240],
  ];
  for (const [path, limit] of fields) {
    const bad = [
      ['blank', ''],
      ['spaces', '   '],
      ['too long', tooLong(limit)],
      ['number', 5],
      ['less than', 'a<b'],
      ['greater than', 'a>b'],
      ['control character', 'a\u0001b'],
      ['new line', 'a\nb'],
      ['object', { toString: () => 'text' }],
      ['missing', undefined],
    ];
    for (const [label, value] of bad)
      assert.throws(
        () => validateCycloneSnapshot(changed([path, value])),
        MALFORMED,
        `${path} ${label}`,
      );
    const edge = 'a'.repeat(limit);
    const result = validateCycloneSnapshot(changed([path, edge]));
    assert.equal(
      path.split('.').reduce((o, key) => o[key], result),
      edge,
    );
  }
  assert.throws(
    () => validateCycloneSnapshot(changed(['storms.0.classification', null])),
    MALFORMED,
  );
  assert.equal(validateCycloneSnapshot(changed(['reason', null])).reason, null);
});

test('[cyclones-004] the validator rejects a number outside its range and accepts each end of the range', () => {
  const fields = [
    ['storms.0.windKt', 0, 300, true],
    ['storms.0.pressureHpa', 800, 1100, true],
    ['storms.0.movement.directionDegrees', 0, 360, true],
    ['storms.0.movement.speedKt', 0, 200, true],
    ['storms.0.position.longitude', -180, 180, false],
    ['storms.0.position.latitude', -90, 90, false],
    ['storms.0.forecastPoints.0.windKt', 0, 300, true],
    ['storms.0.forecastPoints.0.gustKt', 0, 350, true],
    ['storms.0.forecastPoints.0.tauHours', 0, 168, false],
    ['storms.0.forecastPoints.0.position.longitude', -180, 180, false],
    ['storms.0.forecastPoints.0.position.latitude', -90, 90, false],
    ['fetchedAt', 0, 9007199254740991, true],
  ];
  for (const [path, low, high, nullable] of fields) {
    const bad = [
      ['below', low - 1],
      ['above', high + 1],
      ['not a number', NaN],
      ['infinite', Infinity],
      ['text', String(low)],
    ];
    if (path === 'fetchedAt') bad[1][1] = 9007199254740992;
    for (const [label, value] of bad)
      assert.throws(
        () => validateCycloneSnapshot(changed([path, value])),
        MALFORMED,
        `${path} ${label}`,
      );
    for (const value of [low, high]) {
      const result = validateCycloneSnapshot(changed([path, value]));
      assert.equal(
        path.split('.').reduce((o, key) => o[key], result),
        value,
      );
    }
    if (!nullable)
      assert.throws(
        () => validateCycloneSnapshot(changed([path, null])),
        MALFORMED,
        `${path} null`,
      );
    else
      assert.equal(
        path
          .split('.')
          .reduce(
            (o, key) => o[key],
            validateCycloneSnapshot(changed([path, null])),
          ),
        null,
      );
  }
  assert.throws(
    () => validateCycloneSnapshot(changed(['storms.0.movement', undefined])),
    MALFORMED,
    'movement missing',
  );
  assert.throws(
    () => validateCycloneSnapshot(changed(['storms.0.position', null])),
    MALFORMED,
    'position null',
  );
  assert.throws(
    () => validateCycloneSnapshot(changed(['storms.0.position', undefined])),
    MALFORMED,
    'position missing',
  );
  assert.throws(
    () =>
      validateCycloneSnapshot(
        changed(['storms.0.forecastPoints.0.position', null]),
      ),
    MALFORMED,
    'forecast position null',
  );
});

test('[cyclones-004] the validator rejects a time that has no exact ISO form or no real date', () => {
  const bad = [
    ['number', 5],
    ['null', null],
    ['missing', undefined],
    ['no milliseconds', '2026-09-16T03:00:00Z'],
    ['one digit of milliseconds', '2026-09-16T03:00:00.0Z'],
    ['one digit of month', '2026-9-16T03:00:00.000Z'],
    ['space for T', '2026-09-16 03:00:00.000Z'],
    ['offset', '2026-09-16T03:00:00.000+00:00'],
    ['month 13', '2026-13-01T00:00:00.000Z'],
    ['day 31 of February', '2026-02-31T00:00:00.000Z'],
    ['hour 24', '2026-09-16T24:00:00.000Z'],
    ['year of six digits', '+010000-01-01T00:00:00.000Z'],
    ['object', { toString: () => '2026-09-16T03:00:00.000Z' }],
  ];
  for (const path of ['storms.0.positionAt', 'storms.0.issuedAt'])
    for (const [label, value] of bad)
      assert.throws(
        () => validateCycloneSnapshot(changed([path, value])),
        MALFORMED,
        `${path} ${label}`,
      );
  const leap = '2028-02-29T23:59:59.999Z';
  const result = validateCycloneSnapshot(
    changed(['storms.0.positionAt', leap], ['storms.0.issuedAt', leap]),
  );
  assert.equal(result.storms[0].positionAt, leap);
  assert.equal(result.storms[0].issuedAt, leap);
});

test('[cyclones-004] an advisory number of up to three digits and one capital letter is the only form accepted', () => {
  const bad = [
    10,
    null,
    '',
    '1000',
    '01',
    'A',
    '10a',
    '10AB',
    '-1',
    ' 10',
    '10 ',
    { toString: () => '10' },
  ];
  for (const value of bad) {
    assert.throws(
      () =>
        validateCycloneSnapshot(
          changed(
            ['storms.0.advisoryNumber', value],
            ['storms.0.geometryAdvisoryNumber', value],
          ),
        ),
      MALFORMED,
      String(value),
    );
    if (value !== null)
      assert.throws(
        () => validateCycloneSnapshot(pendingWith(value)),
        MALFORMED,
        `geometry ${String(value)}`,
      );
  }
  for (const value of ['0', '9', '99', '999', '10A', '0B']) {
    const result = validateCycloneSnapshot(
      changed(
        ['storms.0.advisoryNumber', value],
        ['storms.0.geometryAdvisoryNumber', value],
      ),
    );
    assert.equal(result.storms[0].advisoryNumber, value);
    assert.equal(result.storms[0].geometryAdvisoryNumber, value);
  }
  const older = fixture();
  older.storms[0].geometryAdvisoryNumber = '9';
  assert.equal(
    validateCycloneSnapshot(older).storms[0].geometryAdvisoryNumber,
    '9',
  );
  function pendingWith(value) {
    const snapshot = fixture();
    snapshot.storms[0].geometryAdvisoryNumber = value;
    return snapshot;
  }
});

test('[cyclones-004] the validator rejects a link that is not an official NHC link and accepts each official form', () => {
  const host = 'https://www.nhc.noaa.gov';
  const advisory = `${host}/text/MIATCMEP5.shtml`;
  const outlook = `${host}/gtwo.php?basin=epac&fdays=7`;
  const badAdvisory = [
    ['blank', ''],
    ['number', 5],
    ['missing', undefined],
    ['plain http', 'http://www.nhc.noaa.gov/text/MIATCMEP5.shtml'],
    ['other host', 'https://example.invalid/text/MIATCMEP5.shtml'],
    ['longer host', 'https://www.nhc.noaa.gov.example.invalid/text/A.shtml'],
    ['port', 'https://www.nhc.noaa.gov:8443/text/MIATCMEP5.shtml'],
    ['user', 'https://user@www.nhc.noaa.gov/text/MIATCMEP5.shtml'],
    ['password', 'https://:secret@www.nhc.noaa.gov/text/MIATCMEP5.shtml'],
    ['fragment', `${advisory}#top`],
    ['query', `${advisory}?a=1`],
    ['lower case code', `${host}/text/miatcmep5.shtml`],
    ['other extension', `${host}/text/MIATCMEP5.html`],
    ['other folder', `${host}/other/MIATCMEP5.shtml`],
    ['no code', `${host}/text/.shtml`],
    ['outlook form', outlook],
    ['too long', `${host}/text/${'A'.repeat(240)}.shtml`],
  ];
  for (const [label, value] of badAdvisory)
    assert.throws(
      () => validateCycloneSnapshot(changed(['storms.0.advisoryUrl', value])),
      MALFORMED,
      label,
    );
  assert.throws(
    () => validateCycloneSnapshot(changed(['storms.0.advisoryUrl', 'no url'])),
    TypeError,
    'text that is not a URL',
  );
  const badOutlook = [
    ['blank', ''],
    ['number', 5],
    ['plain http', 'http://www.nhc.noaa.gov/gtwo.php?basin=epac&fdays=7'],
    ['other host', 'https://example.invalid/gtwo.php?basin=epac&fdays=7'],
    ['user', 'https://user@www.nhc.noaa.gov/gtwo.php?basin=epac&fdays=7'],
    [
      'password',
      'https://:secret@www.nhc.noaa.gov/gtwo.php?basin=epac&fdays=7',
    ],
    ['fragment', `${outlook}#top`],
    ['unknown basin', `${host}/gtwo.php?basin=wpac&fdays=7`],
    ['four days', `${host}/gtwo.php?basin=epac&fdays=5`],
    ['no days', `${host}/gtwo.php?basin=epac`],
    ['extra field', `${outlook}&x=1`],
    ['other page', `${host}/gtwo2.php?basin=epac&fdays=7`],
    ['advisory form', advisory],
  ];
  for (const [label, value] of badOutlook)
    assert.throws(
      () => validateCycloneSnapshot(changed(['storms.0.outlookUrl', value])),
      MALFORMED,
      label,
    );
  const good = validateCycloneSnapshot(
    changed(['storms.0.advisoryUrl', null], ['storms.0.outlookUrl', null]),
  ).storms[0];
  assert.equal(good.advisoryUrl, null);
  assert.equal(good.outlookUrl, null);
  for (const basin of ['atlc', 'epac', 'cpac']) {
    const url = `${host}/gtwo.php?basin=${basin}&fdays=7`;
    assert.equal(
      validateCycloneSnapshot(changed(['storms.0.outlookUrl', url])).storms[0]
        .outlookUrl,
      url,
    );
  }
  assert.equal(
    validateCycloneSnapshot(
      changed(['storms.0.advisoryUrl', `${host}/text/A0.shtml`]),
    ).storms[0].advisoryUrl,
    `${host}/text/A0.shtml`,
  );
});

test('[cyclones-005] the validator rejects geometry that does not fit the status of its storm', () => {
  const rows = [
    [
      'status current with no geometry advisory',
      [['storms.0.geometryAdvisoryNumber', null]],
    ],
    [
      'status current with an older geometry advisory',
      [['storms.0.geometryAdvisoryNumber', '9']],
    ],
    ['status current with no track', [['storms.0.track', null]]],
    ['status current with no cone', [['storms.0.cone', null]]],
    [
      'status current with no forecast point',
      [['storms.0.forecastPoints', []]],
    ],
    [
      'status pending with a track',
      [
        ['storms.0.geometryStatus', 'pending'],
        ['storms.0.cone', null],
        ['storms.0.forecastPoints', []],
      ],
    ],
    [
      'status pending with a cone',
      [
        ['storms.0.geometryStatus', 'pending'],
        ['storms.0.track', null],
        ['storms.0.forecastPoints', []],
      ],
    ],
    [
      'status pending with a forecast point',
      [
        ['storms.0.geometryStatus', 'pending'],
        ['storms.0.track', null],
        ['storms.0.cone', null],
      ],
    ],
    [
      'status unavailable with a track',
      [
        ['storms.0.geometryStatus', 'unavailable'],
        ['storms.0.cone', null],
        ['storms.0.forecastPoints', []],
      ],
    ],
    ['forecast points are not a list', [['storms.0.forecastPoints', null]]],
    ['forecast points are missing', [['storms.0.forecastPoints', undefined]]],
    [
      'forecast points repeat a lead time',
      [
        [
          'storms.0.forecastPoints',
          [
            {
              position: { longitude: 1, latitude: 1 },
              tauHours: 12,
              windKt: null,
              gustKt: null,
            },
            {
              position: { longitude: 2, latitude: 2 },
              tauHours: 12,
              windKt: null,
              gustKt: null,
            },
          ],
        ],
      ],
    ],
    [
      'forecast point with no lead time',
      [['storms.0.forecastPoints.0.tauHours', null]],
    ],
  ];
  for (const [label, edits] of rows)
    assert.throws(
      () => validateCycloneSnapshot(changed(...edits)),
      MALFORMED,
      label,
    );
  const none = fixture();
  none.storms[0].geometryStatus = 'unavailable';
  assert.equal(
    validateCycloneSnapshot(none).storms[0].geometryStatus,
    'unavailable',
  );
});

test('[cyclones-005] the validator rejects a track or a cone of a wrong form', () => {
  const rows = [
    [
      'track of type Polygon',
      'track',
      { type: 'Polygon', coordinates: [ring()] },
    ],
    ['track of type Point', 'track', { type: 'Point', coordinates: [1, 2] }],
    ['track with no type', 'track', {}],
    ['track that is text', 'track', 'line'],
    ['track that is missing', 'track', undefined],
    [
      'cone of type LineString',
      'cone',
      { type: 'LineString', coordinates: pairs(2) },
    ],
    [
      'cone of type MultiLineString',
      'cone',
      { type: 'MultiLineString', coordinates: [pairs(2)] },
    ],
    ['cone that is missing', 'cone', undefined],
    [
      'line of one pair',
      'track',
      { type: 'LineString', coordinates: pairs(1) },
    ],
    [
      'line of 10001 pairs',
      'track',
      { type: 'LineString', coordinates: pairs(10001) },
    ],
    [
      'pair of one number',
      'track',
      { type: 'LineString', coordinates: [[1], [1, 2]] },
    ],
    [
      'pair of three numbers',
      'track',
      {
        type: 'LineString',
        coordinates: [
          [1, 2, 3],
          [1, 2],
        ],
      },
    ],
    [
      'pair with text',
      'track',
      {
        type: 'LineString',
        coordinates: [
          ['1', 2],
          [1, 2],
        ],
      },
    ],
    [
      'pair that is a number',
      'track',
      { type: 'LineString', coordinates: [5, [1, 2]] },
    ],
    [
      'pair out of range',
      'track',
      {
        type: 'LineString',
        coordinates: [
          [181, 2],
          [1, 2],
        ],
      },
    ],
    [
      'pair that is not finite',
      'track',
      {
        type: 'LineString',
        coordinates: [
          [Infinity, 2],
          [1, 2],
        ],
      },
    ],
    [
      'coordinates that are not a list',
      'track',
      { type: 'LineString', coordinates: 'ab' },
    ],
    [
      'multi line with no line',
      'track',
      { type: 'MultiLineString', coordinates: [] },
    ],
    [
      'multi line of 129 lines',
      'track',
      {
        type: 'MultiLineString',
        coordinates: Array.from({ length: 129 }, () => pairs(2)),
      },
    ],
    [
      'ring of three pairs',
      'cone',
      {
        type: 'Polygon',
        coordinates: [
          [
            [0, 0],
            [1, 0],
            [0, 0],
          ],
        ],
      },
    ],
    [
      'ring that does not close in x',
      'cone',
      {
        type: 'Polygon',
        coordinates: [
          [
            [0, 0],
            [1, 0],
            [1, 1],
            [2, 0],
          ],
        ],
      },
    ],
    [
      'ring that does not close in y',
      'cone',
      {
        type: 'Polygon',
        coordinates: [
          [
            [0, 0],
            [1, 0],
            [1, 1],
            [0, 1],
          ],
        ],
      },
    ],
    ['polygon with no ring', 'cone', { type: 'Polygon', coordinates: [] }],
    [
      'polygon of 129 rings',
      'cone',
      { type: 'Polygon', coordinates: Array.from({ length: 129 }, ring) },
    ],
    [
      'multi polygon with no polygon',
      'cone',
      { type: 'MultiPolygon', coordinates: [] },
    ],
    [
      'multi polygon of 129 polygons',
      'cone',
      {
        type: 'MultiPolygon',
        coordinates: Array.from({ length: 129 }, () => [ring()]),
      },
    ],
    [
      'ring of 10001 pairs',
      'cone',
      { type: 'Polygon', coordinates: [longRing(10001)] },
    ],
  ];
  for (const [label, key, geometry] of rows)
    assert.throws(
      () => validateCycloneSnapshot(changed([`storms.0.${key}`, geometry])),
      MALFORMED,
      label,
    );
  const edge = validateCycloneSnapshot(
    changed(
      [
        'storms.0.track',
        {
          type: 'MultiLineString',
          coordinates: Array.from({ length: 128 }, () => pairs(2)),
        },
      ],
      [
        'storms.0.cone',
        {
          type: 'MultiPolygon',
          coordinates: Array.from({ length: 128 }, () => [ring()]),
        },
      ],
    ),
  ).storms[0];
  assert.equal(edge.track.coordinates.length, 128);
  assert.equal(edge.cone.coordinates.length, 128);
  const rings = validateCycloneSnapshot(
    changed([
      'storms.0.cone',
      { type: 'Polygon', coordinates: Array.from({ length: 128 }, ring) },
    ]),
  ).storms[0];
  assert.equal(rings.cone.coordinates.length, 128);
  const long = validateCycloneSnapshot(
    changed([
      'storms.0.track',
      { type: 'LineString', coordinates: pairs(10000) },
    ]),
  ).storms[0];
  assert.equal(long.track.coordinates.length, 10000);
  const wide = validateCycloneSnapshot(
    changed([
      'storms.0.cone',
      { type: 'Polygon', coordinates: [longRing(10000)] },
    ]),
  ).storms[0];
  assert.equal(wide.cone.coordinates[0].length, 10000);
});

test('[cyclones-005] the validator rejects more than 500 forecast points or more than 25,000 coordinates', () => {
  const withStorms = (...storms) => ({ ...fixture(), storms });
  const total = (extraPairs) => ({
    type: 'MultiLineString',
    coordinates: [pairs(10000), pairs(10000), pairs(4989 + extraPairs)],
  });
  // One forecast point, 24,989 track pairs and a cone of 4 pairs, plus the extra pairs.
  const box = (extraPairs) =>
    currentStorm('ep012026', 1, {
      track: total(extraPairs),
      cone: { type: 'Polygon', coordinates: [ring()] },
    });
  assert.equal(validateCycloneSnapshot(withStorms(box(6))).storms.length, 1);
  assert.throws(
    () => validateCycloneSnapshot(withStorms(box(7))),
    MALFORMED,
    '25,001 coordinates',
  );
  // The forecast points of a second storm push the shared total over 25,000.
  const second = currentStorm('ep022026', 7);
  assert.throws(
    () => validateCycloneSnapshot(withStorms(box(0), second)),
    MALFORMED,
    'forecast points over the coordinate limit',
  );
  const five = validateCycloneSnapshot(
    withStorms(currentStorm('ep012026', 500)),
  );
  assert.equal(five.storms[0].forecastPoints.length, 500);
  assert.throws(
    () => validateCycloneSnapshot(withStorms(currentStorm('ep012026', 501))),
    MALFORMED,
    '501 forecast points',
  );
  assert.throws(
    () =>
      validateCycloneSnapshot(
        withStorms(
          currentStorm('ep012026', 300),
          currentStorm('ep022026', 201),
        ),
      ),
    MALFORMED,
    '501 forecast points in two storms',
  );
});

test('[cyclones-006] a source with no fetch option calls the global fetch and returns the validated snapshot', async (t) => {
  const calls = [];
  const source = createCycloneSource();
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    calls.push({ url, options });
    return Response.json(fixture());
  });
  const snapshot = await source.getSnapshot();
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, '/api/cyclones');
  assert.deepEqual(Object.keys(calls[0].options).sort(), [
    'cache',
    'redirect',
    'signal',
  ]);
  assert.equal(calls[0].options.cache, 'no-store');
  assert.equal(calls[0].options.redirect, 'error');
  assert.ok(calls[0].options.signal instanceof AbortSignal);
  assert.equal(snapshot.storms[0].id, 'ep152026');
  assert.equal(snapshot.source, 'NOAA NHC / CPHC');
});

test('[cyclones-006] a body that is not a valid snapshot makes the call reject', async () => {
  const answer = (body) =>
    createCycloneSource({
      fetchImpl: async () => new Response(body),
    }).getSnapshot();
  await assert.rejects(
    answer(JSON.stringify({ ...fixture(), schemaVersion: 2 })),
    MALFORMED,
  );
  await assert.rejects(answer('{'), SyntaxError);
});

test('[cyclones-007] a response with a failed status cancels its body and rejects with the status', async () => {
  let cancelled = 0;
  const body = new ReadableStream({
    cancel() {
      cancelled++;
    },
  });
  const source = createCycloneSource({
    fetchImpl: async () => new Response(body, { status: 503 }),
  });
  await assert.rejects(source.getSnapshot(), { message: 'Cyclone HTTP 503' });
  assert.equal(cancelled, 1);
  const bodiless = createCycloneSource({
    fetchImpl: async () => new Response(null, { status: 404 }),
  });
  await assert.rejects(bodiless.getSnapshot(), {
    message: 'Cyclone HTTP 404',
  });
});

test('[cyclones-007] the limit of 4,194,304 bytes applies to the declared length and to the streamed bytes', async () => {
  assert.equal(CYCLONE_RESPONSE_LIMIT, 4194304);
  const json = JSON.stringify(fixture());
  const source = (body, headers) =>
    createCycloneSource({
      fetchImpl: async () => new Response(body, { headers }),
    });
  await assert.rejects(
    source(json, { 'content-length': '4194305' }).getSnapshot(),
    /too large/,
  );
  const declared = await source(json, {
    'content-length': '4194304',
  }).getSnapshot();
  assert.equal(declared.storms.length, 1);
  const padded = (size) => new TextEncoder().encode(json.padEnd(size, ' '));
  await assert.rejects(source(padded(4194305)).getSnapshot(), /too large/);
  const streamed = await source(padded(4194304)).getSnapshot();
  assert.equal(streamed.storms.length, 1);
});

test('[cyclones-008] the default deadline is 15,000 ms and it aborts the request with a timeout error', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  let signal;
  const source = createCycloneSource({
    fetchImpl: async (_url, options) => {
      signal = options.signal;
      return new Promise((_resolve, reject) =>
        signal.addEventListener('abort', () => reject(signal.reason), {
          once: true,
        }),
      );
    },
  });
  const rejected = assert.rejects(source.getSnapshot(), {
    message: 'Cyclone request timed out',
  });
  t.mock.timers.tick(14999);
  assert.equal(signal.aborted, false);
  t.mock.timers.tick(1);
  await rejected;
  assert.equal(signal.aborted, true);
});

test('[cyclones-008] a caller abort during the request aborts it with the reason of the caller', async () => {
  const caller = new AbortController();
  let request;
  const source = createCycloneSource({
    fetchImpl: async (_url, options) => {
      request = options.signal;
      return new Promise((_resolve, reject) =>
        request.addEventListener('abort', () => reject(request.reason), {
          once: true,
        }),
      );
    },
  });
  const reason = new Error('caller stop');
  const pending = source.getSnapshot({ signal: caller.signal });
  assert.equal(request.aborted, false);
  caller.abort(reason);
  await assert.rejects(pending, (error) => error === reason);
  assert.equal(request.aborted, true);
  assert.equal(request.reason, reason);
});

test('[cyclones-008] a caller abort after the body read still rejects the call', async () => {
  const caller = new AbortController();
  const reason = new Error('late stop');
  const response = {
    ok: true,
    headers: new Headers(),
    body: null,
    text: () =>
      new Promise((resolve) => {
        resolve(JSON.stringify(fixture()));
        // Abort after the body reader checks the signal, and before the source does.
        queueMicrotask(() => queueMicrotask(() => caller.abort(reason)));
      }),
  };
  const source = createCycloneSource({ fetchImpl: async () => response });
  await assert.rejects(
    source.getSnapshot({ signal: caller.signal }),
    (error) => error === reason,
  );
});

test('[cyclones-008] a finished call leaves no deadline timer and no listener on the caller signal', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  for (const status of [200, 500]) {
    const caller = new AbortController();
    let request;
    const source = createCycloneSource({
      timeoutMs: 10,
      fetchImpl: async (_url, options) => {
        request = options.signal;
        return status === 200
          ? Response.json(fixture())
          : new Response(null, { status });
      },
    });
    await source.getSnapshot({ signal: caller.signal }).catch(() => {});
    t.mock.timers.tick(11);
    assert.equal(request.aborted, false, `timer ended, status ${status}`);
    caller.abort(new Error('after the call'));
    assert.equal(request.aborted, false, `listener ended, status ${status}`);
  }
});
