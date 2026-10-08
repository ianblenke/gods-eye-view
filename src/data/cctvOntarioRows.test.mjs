import test from 'node:test';
import assert from 'node:assert/strict';
import { loadOntarioSourcesFromOpenData } from '../../server/providers/cctv/sources.js';

function row(extra = {}) {
  return {
    Id: '1',
    Latitude: 43.6532,
    Longitude: -79.3832,
    Views: [{ Status: 'Enabled', Url: 'https://511on.ca/map/Cctv/A_1.-' }],
    ...extra,
  };
}
async function load(t, rows, cap, logs = []) {
  const old = {
    key: process.env.ONTARIO_511_API_KEY,
    cap: process.env.CCTV_ONTARIO_MAX_SOURCES,
  };
  t.after(() => {
    for (const [name, value] of [
      ['ONTARIO_511_API_KEY', old.key],
      ['CCTV_ONTARIO_MAX_SOURCES', old.cap],
    ]) {
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
  });
  process.env.ONTARIO_511_API_KEY = 'FAKE_ROW_KEY';
  if (cap === undefined) delete process.env.CCTV_ONTARIO_MAX_SOURCES;
  else process.env.CCTV_ONTARIO_MAX_SOURCES = cap;
  t.mock.method(globalThis, 'fetch', async () => ({
    ok: true,
    json: async () => rows,
  }));
  t.mock.method(console, 'log', (...args) => logs.push(args.join(' ')));
  t.mock.method(console, 'warn', (...args) => logs.push(args.join(' ')));
  return loadOntarioSourcesFromOpenData();
}
const badRows = [
  () => null,
  () => ({}),
  () => ({ Id: '' }),
  () => ({ Latitude: NaN }),
  () => ({ Longitude: Infinity }),
  () => ({ Latitude: 40.9 }),
  () => ({ Latitude: 57.6 }),
  () => ({ Longitude: -95.7 }),
  () => ({ Longitude: -73.9 }),
  () => ({ Views: null }),
  () => ({ Views: {} }),
  () => ({ Views: [] }),
  () => ({ Views: [null] }),
  () => ({
    Views: [{ Status: 'Disabled', Url: 'https://511on.ca/map/Cctv/A' }],
  }),
];
for (const [i, makeExtra] of badRows.entries()) {
  test(`[live-sources-006] reject row ${i}`, async (t) => {
    const extra = makeExtra();
    assert.deepEqual(
      await load(t, [extra === null ? null : i === 1 ? {} : row(extra)]),
      [],
    );
  });
}
const urls = [
  '',
  undefined,
  'bad',
  'https://511on.ca/other/A',
  'http://511on.ca/map/Cctv/A',
  'https://evil.test/map/Cctv/A',
  'https://traveliq.co/map/Cctv/A',
  'https://511on.ca/map/Cctv/%2F',
  'https://511on.ca/map/Cctv/%ZZ',
  'https://511on.ca/extra/map/Cctv/A',
  'https://511on.ca/map/Cctv/A/extra',
  'https://511on.ca/map/Cctv/%2FA',
  'https://511on.ca/map/Cctv/A%2F',
];
for (const [i, Url] of urls.entries()) {
  test(`[live-sources-006] reject URL ${i}`, async (t) => {
    assert.deepEqual(
      await load(t, [row({ Views: [{ Status: 'Enabled', Url }] })]),
      [],
    );
  });
}
for (const [Latitude, Longitude] of [
  [41, -95.6],
  [57.5, -74],
]) {
  test(`[live-sources-006] accept boundary ${Latitude}`, async (t) => {
    assert.equal((await load(t, [row({ Latitude, Longitude })])).length, 1);
  });
}
test('[live-sources-006] select the first view without down', async (t) => {
  const views = [
    null,
    { Status: 'Disabled' },
    { Status: 'Enabled', Url: 'bad' },
    {
      Status: 'Enabled',
      Url: 'https://511on.ca/map/Cctv/D',
      Description: 'Down',
    },
    {
      status: ' enabled ',
      url: ' https://a.traveliq.co/map/Cctv/%41?x=1#x ',
      description: ' East ',
    },
    {
      Status: 'Enabled',
      Url: 'https://511on.ca/map/Cctv/B',
      Description: 'West',
    },
  ];
  const result = await load(t, [row({ Views: views })]);
  assert.equal(result[0].url, 'https://511on.ca/map/Cctv/A');
  assert.equal(result[0].name, 'Ontario 511 Camera 1 - East');
  assert.equal(result[0].headingDeg, 90);
});
test('[live-sources-006] select the first down view', async (t) => {
  const result = await load(t, [
    row({
      Views: [
        {
          Status: 'Enabled',
          Url: 'https://511on.ca/map/Cctv/D',
          Description: 'Down',
        },
        {
          Status: 'Enabled',
          Url: 'https://511on.ca/map/Cctv/E',
          Description: 'Down',
        },
      ],
    }),
  ]);
  assert.equal(result[0].url, 'https://511on.ca/map/Cctv/D');
  assert.equal(result[0].name, 'Ontario 511 Camera 1');
});
test('[live-sources-007] set all source fields', async (t) => {
  const [source] = await load(t, [
    row({ Location: ' Place ', Roadway: 'Road', Direction: 'North' }),
  ]);
  assert.deepEqual(source, {
    id: 'on-1',
    name: 'Place',
    city: 'Place',
    cityId: 'ontario',
    provider: 'Ontario 511',
    lat: 43.6532,
    lon: -79.3832,
    headingDeg: 0,
    headingConfidence: 'high',
    pitchDeg: -24,
    fovDeg: 56,
    rangeM: 210,
    mountHeightM: 10,
    groundElevationM: 200,
    feedType: 'image',
    url: 'https://511on.ca/map/Cctv/A_1.-',
    snapshotUrl: 'https://511on.ca/map/Cctv/A_1.-',
    sourceKind: 'ontario-511-open-data',
    license: 'Open Government Licence - Ontario',
  });
  for (const key of [
    'id',
    'name',
    'city',
    'cityId',
    'provider',
    'lat',
    'lon',
    'headingDeg',
    'headingConfidence',
    'pitchDeg',
    'fovDeg',
    'rangeM',
    'mountHeightM',
    'groundElevationM',
    'feedType',
    'url',
    'snapshotUrl',
    'sourceKind',
    'license',
  ]) {
    assert.equal(Object.hasOwn(source, key), true);
  }
});
test('[live-sources-007] use lower case fields and hash pose', async (t) => {
  const [source] = await load(t, [
    {
      id: '1',
      latitude: 43,
      longitude: -80,
      location: '',
      roadway: 'Road',
      direction: '?',
      views: [
        {
          status: 'Enabled',
          url: 'https://511on.ca/map/Cctv/A',
          description: '',
        },
      ],
    },
  ]);
  assert.equal(source.name, 'Road');
  assert.equal(source.city, 'Road');
  assert.equal(source.headingConfidence, 'low');
  assert.deepEqual(
    [source.pitchDeg, source.fovDeg, source.rangeM, source.mountHeightM],
    [-18, 44, 145, 8],
  );
  assert.equal(source.headingDeg, 45);
  const [fallback] = await load(t, [row()]);
  assert.equal(fallback.city, 'Ontario');
  assert.equal(fallback.name, 'Ontario 511 Camera 1');
});
for (const [cap, count] of [
  [undefined, 1000],
  ['', 1000],
  ['bad', 1000],
  ['Infinity', 1000],
  ['3', 8],
  ['9.9', 9],
  ['2000', 1000],
]) {
  test(`[live-sources-008] apply cap ${String(cap)}`, async (t) => {
    const rows = Array.from({ length: 1002 }, (_, i) =>
      row({ Id: String(i), Latitude: 50 }),
    );
    rows[1001] = row({ Id: 'near' });
    const result = await load(t, rows, cap);
    assert.equal(result.length, count);
    assert.equal(result[0].id, 'on-near');
    assert.equal(result[1].id, 'on-0');
  });
}
test('[live-sources-008] use the last duplicate', async (t) => {
  const result = await load(t, [
    row({ Location: 'First' }),
    row({ Location: 'Last' }),
  ]);
  assert.equal(result.length, 1);
  assert.equal(result[0].name, 'Last');
});
for (const title of ['null', '{}', '"rows"', '0']) {
  test(`[live-sources-009] reject data ${title}`, async (t) => {
    const rows = JSON.parse(title);
    const logs = [];
    assert.deepEqual(await load(t, rows, undefined, logs), []);
    assert.deepEqual(logs, []);
  });
}
test('[live-sources-005] return no rows after a data error', async (t) => {
  assert.deepEqual(
    await load(t, [
      {
        get Id() {
          throw new Error('row error');
        },
      },
    ]),
    [],
  );
});

test('[live-sources-007] use field precedence', async (t) => {
  const [source] = await load(t, [
    row({
      Id: 0,
      id: 'other',
      latitude: 0,
      longitude: 0,
      Location: '',
      location: 'Lower place',
      Roadway: '',
      roadway: 'Lower road',
      Direction: null,
      direction: 'West',
      Views: [
        {
          Status: '',
          status: 'enabled',
          Url: '',
          url: 'https://511on.ca/map/Cctv/X',
          Description: '',
          description: 'East',
        },
      ],
    }),
  ]);
  assert.equal(source.id, 'on-0');
  assert.equal(source.lat, 43.6532);
  assert.equal(source.lon, -79.3832);
  assert.equal(source.city, 'Lower place');
  assert.equal(source.name, 'Lower place - East');
  assert.equal(source.headingDeg, 270);
});
test('[live-sources-008] use each nearest anchor', async (t) => {
  const anchors = [
    [43.4516, -80.4925],
    [43.6532, -79.3832],
    [45.4215, -75.6972],
    [43.2557, -79.8711],
    [42.9849, -81.2453],
    [42.3149, -83.0364],
  ];
  const result = await load(t, [
    row({ Id: 'far', Latitude: 57, Longitude: -95 }),
    ...anchors.map(([Latitude, Longitude], i) =>
      row({ Id: String(i), Latitude, Longitude }),
    ),
  ]);
  assert.deepEqual(
    result.map((source) => source.id),
    ['on-0', 'on-1', 'on-2', 'on-3', 'on-4', 'on-5', 'on-far'],
  );
});

test('[live-sources-006] reject null ID fields', async (t) => {
  assert.deepEqual(await load(t, [row({ Id: null, id: null })]), []);
});
test('[live-sources-007] use roadway and blank direction', async (t) => {
  const [source] = await load(t, [
    row({
      Roadway: ' Upper road ',
      roadway: 'Lower road',
      Direction: '',
      direction: 'West',
      Views: [
        {
          Status: 'Enabled',
          Url: 'https://511on.ca/map/Cctv/A',
          Description: 'East',
        },
      ],
    }),
  ]);
  assert.equal(source.city, 'Upper road');
  assert.equal(source.name, 'Upper road - East');
  assert.equal(source.headingDeg, 90);
});
test('[live-sources-006] accept an empty row list', async (t) => {
  assert.deepEqual(await load(t, []), []);
});

test('[live-sources-008] log both source counts', async (t) => {
  const logs = [];
  const rows = Array.from({ length: 9 }, (_, i) => row({ Id: String(i) }));
  rows.push(row({ Id: '0' }));
  assert.equal((await load(t, rows, '8', logs)).length, 8);
  assert.deepEqual(logs, [
    '[CCTV] Loaded Ontario 511 camera sources: 9 enabled (using nearest 8)',
  ]);
});

test('[live-sources-006] reject views without a data error', async (t) => {
  const logs = [];
  assert.deepEqual(
    await load(
      t,
      [
        null,
        {},
        row({ Id: '' }),
        row({ Views: {} }),
        row({ Id: '2', Views: [] }),
        row({ Id: '3', Views: [{ Status: 'Disabled' }] }),
      ],
      undefined,
      logs,
    ),
    [],
  );
  assert.deepEqual(logs, [
    '[CCTV] Loaded Ontario 511 camera sources: 0 enabled (using nearest 0)',
  ]);
});

test('[live-sources-006] accept every ID character', async (t) => {
  const [source] = await load(t, [
    row({
      Views: [
        {
          Status: 'Enabled',
          Url: 'https://511on.ca/map/Cctv/ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_.-',
        },
      ],
    }),
  ]);
  assert.equal(
    source.url,
    'https://511on.ca/map/Cctv/ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_.-',
  );
});

test('[live-sources-007] convert row values to text and numbers', async (t) => {
  const [source] = await load(t, [
    row({
      Id: 42,
      Latitude: '43.6532',
      Longitude: '-79.3832',
      Location: 42,
      Direction: 'North',
      Views: [
        {
          Status: 'Enabled',
          Url: 'https://511on.ca/map/Cctv/A',
          Description: 44,
        },
      ],
    }),
  ]);
  assert.equal(source.id, 'on-42');
  assert.equal(source.city, '42');
  assert.equal(source.name, '42 - 44');
  assert.equal(source.lat, 43.6532);
  assert.equal(source.lon, -79.3832);
  const [road] = await load(t, [row({ Roadway: 43 })]);
  assert.equal(road.city, '43');
  assert.equal(road.name, '43');
});
test('[live-sources-006] reject a numeric status without a data error', async (t) => {
  const logs = [];
  assert.deepEqual(
    await load(
      t,
      [row({ Views: [{ Status: 42, Url: 'https://511on.ca/map/Cctv/A' }] })],
      undefined,
      logs,
    ),
    [],
  );
  assert.deepEqual(logs, [
    '[CCTV] Loaded Ontario 511 camera sources: 0 enabled (using nearest 0)',
  ]);
});
for (const title of ['URL object', 'URL edge spaces']) {
  test(`[live-sources-006] accept ${title}`, async (t) => {
    const Url =
      title === 'URL object'
        ? new URL('https://511on.ca/map/Cctv/A')
        : '\u00a0https://511on.ca/map/Cctv/A\u00a0';
    const [source] = await load(t, [
      row({ Views: [{ Status: 'Enabled', Url }] }),
    ]);
    assert.equal(source.url, 'https://511on.ca/map/Cctv/A');
  });
}
test('[live-sources-006 live-sources-007] select a view with downhill', async (t) => {
  const [source] = await load(t, [
    row({
      Views: [
        {
          Status: 'Enabled',
          Url: 'https://511on.ca/map/Cctv/D',
          Description: 'Downhill',
        },
        {
          Status: 'Enabled',
          Url: 'https://511on.ca/map/Cctv/E',
          Description: 'East',
        },
      ],
    }),
  ]);
  assert.equal(source.url, 'https://511on.ca/map/Cctv/D');
  assert.equal(source.name, 'Ontario 511 Camera 1 - Downhill');
});

test('[live-sources-007] use capitalized text fields first', async (t) => {
  const [source] = await load(t, [
    row({
      Id: ' 1 ',
      id: 'other',
      latitude: 0,
      longitude: 0,
      Location: ' Upper ',
      location: 'Lower',
      Direction: 'North',
      direction: 'West',
      views: [
        {
          status: 'Enabled',
          url: 'https://511on.ca/map/Cctv/B',
          description: 'West',
        },
      ],
      Views: [
        {
          Status: ' Enabled ',
          status: 'Disabled',
          Url: 'https://511on.ca/map/Cctv/A',
          url: 'https://511on.ca/map/Cctv/B',
          Description: ' North ',
          description: 'East',
        },
      ],
    }),
  ]);
  assert.equal(source.id, 'on-1');
  assert.equal(source.name, 'Upper - North');
  assert.equal(source.city, 'Upper');
  assert.equal(source.url, 'https://511on.ca/map/Cctv/A');
  assert.equal(source.headingDeg, 0);
});
for (const axis of ['Latitude', 'Longitude']) {
  test(`[live-sources-006 live-sources-007] reject zero upper ${axis}`, async (t) => {
    const extra =
      axis === 'Latitude'
        ? { Latitude: 0, latitude: 43 }
        : { Longitude: 0, longitude: -80 };
    assert.deepEqual(await load(t, [row(extra)]), []);
  });
}
test('[live-sources-006] skip fields after a row guard', async (t) => {
  const logs = [];
  const rows = [
    {
      Id: '',
      get Latitude() {
        throw new Error('coordinate fault');
      },
      get Longitude() {
        throw new Error('coordinate fault');
      },
    },
    {
      Id: 'bad',
      Latitude: 40,
      Longitude: -80,
      get Views() {
        throw new Error('view fault');
      },
    },
    row(),
  ];
  const result = await load(t, rows, undefined, logs);
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 'on-1');
  assert.deepEqual(logs, [
    '[CCTV] Loaded Ontario 511 camera sources: 1 enabled (using nearest 1)',
  ]);
});

test('[live-sources-007] read latitude before longitude', async (t) => {
  const camera = row({ Longitude: -80 });
  Object.defineProperty(camera, 'Latitude', {
    get() {
      camera.Longitude = -79.3832;
      return 43.6532;
    },
  });
  const [source] = await load(t, [camera]);
  assert.equal(source.lat, 43.6532);
  assert.equal(source.lon, -79.3832);
});
test('[live-sources-007] read location before roadway', async (t) => {
  const camera = row({ Roadway: 'Before' });
  Object.defineProperty(camera, 'Location', {
    get() {
      camera.Roadway = 'After';
      return '';
    },
  });
  const [source] = await load(t, [camera]);
  assert.equal(source.city, 'After');
  assert.equal(source.name, 'After');
});
