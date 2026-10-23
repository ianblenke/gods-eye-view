import test from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import { skyfiProxy } from '../../server/providers/skyfi.js';
import { normalizeScenes } from '../../server/providers/skyfi/normalize.js';

const NOW = Date.UTC(2026, 9, 22, 12, 0, 0);
const RING_TEXT = '-82.5 27.9, -82.4 27.9, -82.4 28, -82.5 28, -82.5 27.9';
const RING = [
  [-82.5, 27.9],
  [-82.4, 27.9],
  [-82.4, 28],
  [-82.5, 28],
  [-82.5, 27.9],
];
const wkt = (...rings) => `POLYGON (${rings.map((r) => `(${r})`).join(', ')})`;
const textOf = (ring) => ring.map(([lon, lat]) => `${lon} ${lat}`).join(', ');
const thumbOf = (id) => `https://thumbnails.skyfi.com/CANARY/${id}.png`;
const item = (id, changes = {}) => ({
  archiveId: id,
  identifier: 'CANARY-identifier',
  provider: 'VANTOR',
  productType: 'DAY',
  captureTimestamp: '2026-10-05T15:00:00Z',
  cloudCoveragePercent: 5,
  footprint: wkt(RING_TEXT),
  priceForOneSquareKm: 99.5,
  priceFullScene: 12345,
  openData: false,
  thumbnailUrls: {
    '300x300': thumbOf(id),
    '2048x2048': 'https://app.skyfi.com/CANARY-big.png',
  },
  gsd: 35,
  tilesUrl: 'https://metadata-tiles.skyfi.com/CANARY-tiles/{z}/{x}/{y}.png',
  ...changes,
});
const withFootprint = (id, footprint) => item(id, { footprint });
const one = (archives, nextPage = null) =>
  normalizeScenes({ archives, nextPage, total: null });
const idsOf = (result) => result.scenes.map((scene) => scene.id);

test('[skyfi-source-017] gives only the allowed fields of a scene', () => {
  const result = one([item('a-1')]);
  assert.deepEqual(result.scenes, [
    {
      id: 'a-1',
      start: '2026-10-05T15:00:00.000Z',
      footprint: { type: 'Polygon', coordinates: [RING] },
      resolutionM: 0.35,
      provider: 'VANTOR',
      productType: 'DAY',
      cloudPercent: 5,
      thumbnail: true,
    },
  ]);
  const text = JSON.stringify(result.scenes);
  for (const word of [
    'CANARY',
    'skyfi.com',
    'price',
    'tiles',
    'openData',
    'identifier',
  ])
    assert.equal(text.includes(word), false, word);
  assert.deepEqual(result.urls, [thumbOf('a-1')]);
});

test('[skyfi-source-017] reads start with Date.parse for a text with an offset and writes it with toISOString', () => {
  for (const [captureTimestamp, start] of [
    ['2026-10-05T15:00:00Z', '2026-10-05T15:00:00.000Z'],
    ['2026-10-22T18:10:34-04:00', '2026-10-22T22:10:34.000Z'],
    ['2026-10-05T10:00:00+05:30', '2026-10-05T04:30:00.000Z'],
    ['2026-10-22T16:53:32.065542Z', '2026-10-22T16:53:32.065Z'],
  ]) {
    const [scene] = one([item('a', { captureTimestamp })]).scenes;
    assert.equal(scene.start, start, captureTimestamp);
  }
  for (const captureTimestamp of [
    '2026-10-22T18:10:34',
    '2026-10-22',
    '2026-13-01T00:00:00Z',
    'x',
    '',
    1760000000000,
    null,
    undefined,
  ]) {
    assert.equal(
      one([item('a', { captureTimestamp })]).scenes.length,
      0,
      String(captureTimestamp),
    );
  }
});

test('[skyfi-source-017] gives null for each number that does not meet its rule, and divides gsd by 100', () => {
  const infinity = JSON.parse('{"x":1e999}').x;
  for (const value of [null, '7', true, -1, infinity, undefined]) {
    const [scene] = one([
      item('a', { gsd: value, cloudCoveragePercent: value }),
    ]).scenes;
    assert.equal(scene.resolutionM, null, String(value));
    assert.equal(scene.cloudPercent, null, String(value));
  }
  const [over] = one([
    item('a', { gsd: 1000, cloudCoveragePercent: 101 }),
  ]).scenes;
  assert.equal(over.resolutionM, 10);
  assert.equal(over.cloudPercent, null);
  for (const [gsd, percent] of [
    [0, 0],
    [34, 12.5],
    [67, 100],
  ]) {
    const [scene] = one([
      item('a', { gsd, cloudCoveragePercent: percent }),
    ]).scenes;
    assert.equal(scene.resolutionM, gsd / 100);
    assert.equal(scene.cloudPercent, percent);
  }
  assert.equal(one([item('a', { gsd: 34 })]).scenes[0].resolutionM, 0.34);
});

test('[skyfi-source-017] gives the provider and the product type only for an allowed text', () => {
  const forty = 'A'.repeat(39) + '1';
  for (const [provider, expected] of [
    ['VANTOR', 'VANTOR'],
    ['SENTINEL2_CREODIAS', 'SENTINEL2_CREODIAS'],
    [forty, forty],
    ['A'.repeat(41), null],
    ['', null],
    ['vantor', null],
    ['VAN TOR', null],
    ['VANTOR-1', null],
    [5, null],
    [null, null],
    [undefined, null],
  ]) {
    const [scene] = one([item('a', { provider })]).scenes;
    assert.equal(scene.provider, expected, String(provider));
  }
  for (const type of [
    'DAY',
    'NIGHT',
    'VIDEO',
    'MULTISPECTRAL',
    'HYPERSPECTRAL',
    'SAR',
    'STEREO',
    'BASEMAP',
    'THERMAL',
  ]) {
    assert.equal(
      one([item('a', { productType: type })]).scenes[0].productType,
      type,
    );
  }
  for (const type of ['day', 'OTHER', '', 5, null, undefined, 'DAY ']) {
    assert.equal(
      one([item('a', { productType: type })]).scenes[0].productType,
      null,
      String(type),
    );
  }
});

test('[skyfi-source-017] sets thumbnail true only for a link of the 300x300 key that starts with an allowed host and path', () => {
  const link = (value) => item('a', { thumbnailUrls: { '300x300': value } });
  const long = (head) => head + 'a'.repeat(2048 - head.length);
  for (const good of [
    'https://app.skyfi.com/x/y.png',
    'https://thumbnails.skyfi.com/a.png?x=1&y=2',
    long('https://thumbnails.skyfi.com/'),
  ]) {
    const result = one([link(good)]);
    assert.equal(result.scenes[0].thumbnail, true, good.slice(0, 50));
    assert.deepEqual(result.urls, [good]);
  }
  for (const bad of [
    'https://skyfi.example.test/a.png',
    'https://app.skyfi.com.example.test/a.png',
    'http://app.skyfi.com/a.png',
    'https://app.skyfi.com:8443/a.png',
    'https://app.skyfi.com:443/a.png',
    'https://user@app.skyfi.com/a.png',
    'https://app.skyfi.com.@example.test/a.png',
    'https://app.skyfi.com\\@example.test/a.png',
    'https://app.skyfi.com/a.png#x',
    'https://app.skyfi.com/a b.png',
    'https://app.skyfi.com/a\tb.png',
    'https://app.skyfi.com/a\u0007.png',
    'https://app.skyfi.com',
    'https://other.skyfi.com/a.png',
    long('https://thumbnails.skyfi.com/') + 'b',
    '',
    5,
    null,
    undefined,
    {},
  ]) {
    const result = one([link(bad)]);
    assert.equal(result.scenes[0].thumbnail, false, String(bad).slice(0, 50));
    assert.deepEqual(result.urls, [null]);
  }
  const big = item('a', {
    thumbnailUrls: { '2048x2048': 'https://app.skyfi.com/big.png' },
  });
  assert.equal(one([big]).scenes[0].thumbnail, false);
  for (const thumbnailUrls of [null, undefined, 'x', []]) {
    assert.equal(
      one([item('a', { thumbnailUrls })]).scenes[0].thumbnail,
      false,
    );
  }
});

test('[skyfi-source-017] removes an item that is not an object, and a scene with a bad id', () => {
  const long = 'a'.repeat(128);
  const result = one([
    null,
    5,
    'x',
    [item('in-array')],
    item(''),
    item('a.b'),
    item('a b'),
    item('a'.repeat(129)),
    item(5),
    { ...item('no-id'), archiveId: undefined },
    item(long),
    item('A-z_0-9'),
  ]);
  assert.deepEqual(idsOf(result).sort(), ['A-z_0-9', long].sort());
});

test('[skyfi-source-018] keeps the first ring of a polygon and removes each other ring', () => {
  const hole = [
    [-82.46, 27.94],
    [-82.44, 27.94],
    [-82.44, 27.96],
    [-82.46, 27.94],
  ];
  const result = one([
    withFootprint('hole', wkt(RING_TEXT, textOf(hole))),
    withFootprint('compact', `POLYGON((${RING_TEXT.replaceAll(', ', ',')}))`),
    withFootprint(
      'spaces',
      `POLYGON  (  ( ${RING_TEXT.replaceAll(', ', ' , ')} )  ,  (${textOf(hole)}) )`,
    ),
    withFootprint('short-later', wkt(RING_TEXT, '1 1, 2 2, 3 3')),
    withFootprint('open-later', wkt(RING_TEXT, '1 1, 2 2, 3 3, 4 4')),
    withFootprint(
      'far-later',
      wkt(RING_TEXT, '500 500, 600 600, 700 700, 500 500'),
    ),
  ]);
  assert.equal(result.scenes.length, 6);
  for (const scene of result.scenes) {
    assert.deepEqual(scene.footprint, { type: 'Polygon', coordinates: [RING] });
  }
});

test('[skyfi-source-018] keeps a ring of 4 to 2000 positions that ends at its first position', () => {
  const ringOf = (n) => {
    const ring = Array.from({ length: n - 1 }, (_, i) => [
      -82.5 + i * 0.0001,
      27.9 + (i % 2) * 0.0001,
    ]);
    return [...ring, ring[0]];
  };
  const text = (ring) =>
    ring.map(([lon, lat]) => `${lon.toFixed(4)} ${lat.toFixed(4)}`).join(', ');
  const result = one([
    withFootprint('r3', wkt(text(ringOf(3)))),
    withFootprint('r4', wkt(text(ringOf(4)))),
    withFootprint('r2000', wkt(text(ringOf(2000)))),
    withFootprint('r2001', wkt(text(ringOf(2001)))),
    withFootprint(
      'open',
      wkt('-82.5 27.9, -82.4 27.9, -82.4 28, -82.5 28, -82.5 27.91'),
    ),
    withFootprint(
      'open-lat',
      wkt('-82.5 27.9, -82.4 27.9, -82.4 28, -82.5 28, -82.49 27.9'),
    ),
  ]);
  assert.deepEqual(idsOf(result).sort(), ['r2000', 'r4']);
});

test('[skyfi-source-018] removes a scene with a first position out of range', () => {
  const at = (position) =>
    wkt(
      `${RING_TEXT.split(', ')[0]}, ${position}, -82.4 28, -82.5 28, ${RING_TEXT.split(', ')[0]}`,
    );
  for (const good of ['180 90', '-180 -90', '0 0', '10.5 20.25']) {
    assert.equal(one([withFootprint('k', at(good))]).scenes.length, 1, good);
  }
  for (const bad of ['180.0001 0', '-180.0001 0', '0 90.0001', '0 -90.0001']) {
    assert.equal(one([withFootprint('r', at(bad))]).scenes.length, 0, bad);
  }
});

test('[skyfi-source-018] removes a scene when the text does not meet the rule of the WKT reader', () => {
  const ring = RING_TEXT;
  const bad = [
    `MULTIPOLYGON (((${ring})))`,
    'POINT (0 0)',
    'POLYGON EMPTY',
    `polygon ((${ring}))`,
    `POLYGON Z ((${ring}))`,
    `POLYGON ((${ring.replaceAll('27.9', '+27.9')}))`,
    `POLYGON ((${ring.replaceAll('27.9', '.9')}))`,
    `POLYGON ((${ring.replaceAll('28', '28.')}))`,
    `POLYGON ((${ring.replaceAll('28', '2.8e1')}))`,
    `POLYGON ((${ring.replaceAll(' 27.9', ' 27.9 5')}))`,
    `POLYGON ((${ring.replaceAll(', ', ',\t')}))`,
    `POLYGON ((${ring.replaceAll(', ', ',\n')}))`,
    `POLYGON ((${ring.replace('-82.5 27.9', '-82.5\t27.9')}))`,
    ` POLYGON ((${ring}))`,
    `POLYGON ((${ring})) x`,
    `POLYGON ((${ring})`,
    `POLYGON (${ring})`,
    `POLYGON ((${ring}), (1e1 1, 2 2, 3 3, 1e1 1))`,
    `POLYGON ((${ring}), (1 1, 2 x))`,
    'POLYGON (())',
    'POLYGON ((a b, c d, e f, a b))',
    '',
    'x',
  ];
  for (const text of bad) {
    assert.equal(
      one([withFootprint('r', text)]).scenes.length,
      0,
      JSON.stringify(text),
    );
  }
  for (const footprint of [undefined, null, 5, {}, [wkt(ring)]]) {
    assert.equal(one([withFootprint('r', footprint)]).scenes.length, 0);
  }
});

test('[skyfi-source-018] reads at most 20000 characters of the footprint', () => {
  const pad = (length) => {
    const base = wkt(RING_TEXT);
    // Spaces after POLYGON are allowed, so they set the length without a new rule.
    return base.replace(
      'POLYGON (',
      `POLYGON${' '.repeat(length - base.length + 1)}(`,
    );
  };
  const exact = pad(20000);
  const over = pad(20001);
  assert.equal(exact.length, 20000);
  assert.equal(over.length, 20001);
  assert.equal(one([withFootprint('e', exact)]).scenes.length, 1);
  assert.equal(one([withFootprint('o', over)]).scenes.length, 0);
});

test('[skyfi-source-019] sorts the scenes with the newest start first, then by the code units of the id, then in the upstream order', () => {
  const at = (id, captureTimestamp, gsd = 35) =>
    item(id, { captureTimestamp, gsd });
  const result = one([
    at('p-old', '2026-10-01T00:00:00Z'),
    at('b', '2026-10-03T00:00:00Z'),
    at('B', '2026-10-03T00:00:00Z', 1),
    at('s-new', '2026-10-04T00:00:00Z'),
    at('a', '2026-10-03T00:00:00Z'),
    at('B', '2026-10-03T00:00:00Z', 2),
    at('B', '2026-10-03T00:00:00Z', 3),
  ]);
  assert.deepEqual(idsOf(result), ['s-new', 'B', 'B', 'B', 'a', 'b', 'p-old']);
  assert.deepEqual(
    result.scenes.filter((scene) => scene.id === 'B').map((s) => s.resolutionM),
    [0.01, 0.02, 0.03],
  );
  assert.equal(result.urls.length, 7);
  assert.equal(result.urls[0], thumbOf('s-new'));
  assert.equal(result.urls[6], thumbOf('p-old'));
});

test('[skyfi-source-019] keeps the first 50 scenes, and sets truncated for more than 50 scenes or a nextPage text', () => {
  const many = (n) =>
    Array.from({ length: n }, (_, i) =>
      item(`p-${String(i).padStart(2, '0')}`, {
        captureTimestamp: new Date(
          Date.UTC(2026, 8, 1) + i * 3600_000,
        ).toISOString(),
      }),
    );
  const fifty = one(many(50));
  assert.equal(fifty.scenes.length, 50);
  assert.equal(fifty.truncated, false);
  const fiftyOne = one(many(51));
  assert.equal(fiftyOne.scenes.length, 50);
  assert.equal(fiftyOne.truncated, true);
  assert.equal(fiftyOne.urls.length, 50);
  assert.equal(idsOf(fiftyOne).includes('p-50'), true);
  assert.equal(idsOf(fiftyOne).includes('p-00'), false);
  assert.equal(one([], '/platform-api/archives?page=x').truncated, true);
  assert.equal(one([], 'x').truncated, true);
  for (const value of ['', undefined, null, 5, {}, ['x']]) {
    assert.equal(one([], value).truncated, false, String(value));
  }
});

/** Install the scenes plugin and send one request to the scenes route. */
async function route(t, { body, method = 'POST', headers = {} } = {}) {
  t.mock.timers.reset();
  t.mock.timers.enable({ apis: ['Date'], now: NOW });
  const plugin = skyfiProxy({
    env: { SKYFI_API_KEY: 'fixture-key-Q7' },
    fetchImpl: async () =>
      new Response(
        JSON.stringify({
          archives: [
            item('a-old', { captureTimestamp: '2026-10-01T00:00:00Z' }),
            item('a-new', { captureTimestamp: '2026-10-09T00:00:00Z' }),
            null,
            item('a-mid', { captureTimestamp: '2026-10-05T00:00:00Z' }),
          ],
          nextPage: null,
          total: null,
        }),
        { status: 200 },
      ),
    now: () => NOW,
    setTimer: () => 1,
    clearTimer: () => {},
    log: () => {},
  });
  const routes = new Map();
  plugin.configureServer({
    middlewares: { use: (path, handler) => routes.set(path, handler) },
  });
  const text =
    body ??
    JSON.stringify({
      bbox: [-82.5, 27.9, -82.4, 28],
      start: '2026-10-01',
      end: '2026-10-20',
    });
  const req = Object.assign(Readable.from([Buffer.from(text)]), {
    method,
    url: '/',
    headers: {
      host: '127.0.0.1:5173',
      origin: 'http://127.0.0.1:5173',
      'content-type': 'application/json',
      ...headers,
    },
    socket: { remoteAddress: '127.0.0.1', encrypted: false },
  });
  const res = {
    headers: {},
    writeHead(code, values) {
      this.statusCode = code;
      for (const [name, value] of Object.entries(values ?? {}))
        this.headers[name.toLowerCase()] = value;
    },
    end(chunk) {
      this.text = chunk;
    },
  };
  await routes.get('/api/skyfi/scenes')(req, res, () => {});
  return {
    status: res.statusCode,
    headers: res.headers,
    body: JSON.parse(res.text),
  };
}

test('[skyfi-source-019] gives the shape of a good answer and the headers of each answer of the scenes route', async (t) => {
  const answer = await route(t);
  assert.equal(answer.status, 200);
  assert.deepEqual(Object.keys(answer.body).sort(), [
    'budget',
    'cached',
    'count',
    'scenes',
    'source',
    'truncated',
  ]);
  assert.equal(answer.body.source, 'SkyFi');
  assert.equal(answer.body.count, 3);
  assert.equal(answer.body.scenes.length, 3);
  assert.equal(answer.body.truncated, false);
  assert.equal(answer.body.cached, false);
  assert.deepEqual(answer.body.budget, { used: 1, limit: 20 });
  assert.deepEqual(
    answer.body.scenes.map((scene) => scene.id),
    ['a-new', 'a-mid', 'a-old'],
  );
  for (const result of [
    answer,
    await route(t, { body: 'not json' }),
    await route(t, { method: 'GET' }),
    await route(t, { headers: { 'sec-fetch-site': 'cross-site' } }),
  ]) {
    assert.equal(
      result.headers['content-type'],
      'application/json; charset=utf-8',
    );
    assert.equal(result.headers['cache-control'], 'no-store');
  }
});
