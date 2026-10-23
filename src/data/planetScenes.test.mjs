import test from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import { planetProxy } from '../../server/providers/planet.js';
import { normalizeScenes } from '../../server/providers/planet/normalize.js';

const NOW = Date.UTC(2026, 9, 22, 12, 0, 0);
const RING = [
  [-82.5, 27.9],
  [-82.4, 27.9],
  [-82.4, 28],
  [-82.5, 28],
  [-82.5, 27.9],
];
const HOLE = [
  [-82.46, 27.94],
  [-82.44, 27.94],
  [-82.44, 27.96],
  [-82.46, 27.94],
];
const thumbOf = (type, id) =>
  `https://tiles.planet.com/data/v1/item-types/${type}/items/${id}/thumb`;
const feature = (id, type = 'PSScene', changes = {}) => ({
  type: 'Feature',
  id,
  geometry: { type: 'Polygon', coordinates: [RING] },
  properties: {
    acquired: '2026-10-05T15:00:00Z',
    gsd: 3.9,
    pixel_resolution: 3,
    cloud_percent: 5,
    provider: 'CANARY-provider',
  },
  _links: {
    _self: `https://api.planet.com/data/v1/item-types/${type}/items/${id}`,
    assets: `https://api.planet.com/data/v1/item-types/${type}/items/${id}/assets/`,
    thumbnail: thumbOf(type, id),
  },
  _permissions: ['assets.visual:download'],
  assets: ['ortho_visual'],
  ...changes,
});
const withProperties = (id, properties) => {
  const item = feature(id);
  return { ...item, properties: { ...item.properties, ...properties } };
};
const withGeometry = (id, geometry) => feature(id, 'PSScene', { geometry });
/** Normalize one PSScene page, or two pages with their item types. */
const one = (features, links = {}) =>
  normalizeScenes([{ type: 'PSScene', page: { features, _links: links } }]);
const both = (first, second, links = [{}, {}]) =>
  normalizeScenes([
    { type: 'PSScene', page: { features: first, _links: links[0] } },
    { type: 'SkySatCollect', page: { features: second, _links: links[1] } },
  ]);
const idsOf = (result) => result.scenes.map((scene) => scene.id);

test('[planet-source-017] gives only the allowed fields of a scene, with the provider name of the item type', () => {
  const result = both(
    [feature('ps-1')],
    [
      feature('ss-1', 'SkySatCollect', {
        properties: {
          acquired: '2026-10-04T12:39:51.281Z',
          gsd: 0.63,
          pixel_resolution: 0.5,
          cloud_percent: 0,
          cloud_cover: 0.9,
          provider: 'skysat',
        },
      }),
    ],
  );
  assert.deepEqual(result.scenes, [
    {
      id: 'ps-1',
      start: '2026-10-05T15:00:00.000Z',
      footprint: { type: 'Polygon', coordinates: [RING] },
      resolutionM: 3.9,
      provider: 'PlanetScope',
      cloudPercent: 5,
      thumbnail: true,
    },
    {
      id: 'ss-1',
      start: '2026-10-04T12:39:51.281Z',
      footprint: { type: 'Polygon', coordinates: [RING] },
      resolutionM: 0.63,
      provider: 'SkySat',
      cloudPercent: 0,
      thumbnail: true,
    },
  ]);
  const text = JSON.stringify(result.scenes);
  for (const word of ['CANARY', 'api.planet.com', 'tiles.planet.com', 'assets'])
    assert.equal(text.includes(word), false, word);
});

test('[planet-source-017] reads start with Date.parse and writes it with toISOString', () => {
  for (const [acquired, start] of [
    ['2026-10-05T15:00:00Z', '2026-10-05T15:00:00.000Z'],
    ['2026-10-22T16:53:32.065542Z', '2026-10-22T16:53:32.065Z'],
    ['2026-10-05T10:00:00-05:00', '2026-10-05T15:00:00.000Z'],
  ]) {
    const [scene] = one([withProperties('a', { acquired })]).scenes;
    assert.equal(scene.start, start, acquired);
  }
});

test('[planet-source-017] gives null for each number that does not meet its rule, and does not read cloud_cover', () => {
  const infinity = JSON.parse('{"x":1e999}').x;
  for (const value of [null, '7', true, -1, infinity, undefined]) {
    const [scene] = one([
      withProperties('a', { gsd: value, cloud_percent: value }),
    ]).scenes;
    assert.equal(scene.resolutionM, null, String(value));
    assert.equal(scene.cloudPercent, null, String(value));
  }
  const [over] = one([
    withProperties('a', { gsd: 101, cloud_percent: 101 }),
  ]).scenes;
  assert.equal(over.resolutionM, 101);
  assert.equal(over.cloudPercent, null);
  for (const value of [0, 12.5, 100]) {
    const [scene] = one([
      withProperties('a', { gsd: value, cloud_percent: value }),
    ]).scenes;
    assert.equal(scene.resolutionM, value);
    assert.equal(scene.cloudPercent, value);
  }
  const [ratio] = one([
    withProperties('a', { cloud_percent: undefined, cloud_cover: 0.29 }),
  ]).scenes;
  assert.equal(ratio.cloudPercent, null);
});

test('[planet-source-017] sets thumbnail true only for the exact thumbnail link of the item type and the id', () => {
  const link = (thumbnail) =>
    feature('a', 'PSScene', {
      _links: { thumbnail },
    });
  assert.equal(one([link(thumbOf('PSScene', 'a'))]).scenes[0].thumbnail, true);
  for (const thumbnail of [
    thumbOf('SkySatCollect', 'a'),
    thumbOf('PSScene', 'b'),
    'https://tiles2.planet.com/data/v1/item-types/PSScene/items/a/thumb',
    'https://tiles.planet.com.example.test/data/v1/item-types/PSScene/items/a/thumb',
    'http://tiles.planet.com/data/v1/item-types/PSScene/items/a/thumb',
    `${thumbOf('PSScene', 'a')}?width=512`,
    `${thumbOf('PSScene', 'a')}?width=2048`,
    'https://tiles.planet.com/data/v1/PSScene/a/0/0/0.png',
    `${thumbOf('PSScene', 'a')}/`,
    undefined,
    null,
    5,
  ]) {
    assert.equal(
      one([link(thumbnail)]).scenes[0].thumbnail,
      false,
      String(thumbnail),
    );
  }
  for (const links of [undefined, null, 'x']) {
    assert.equal(
      one([feature('a', 'PSScene', { _links: links })]).scenes[0].thumbnail,
      false,
    );
  }
  const [skysat] = both([], [feature('s', 'SkySatCollect')]).scenes;
  assert.equal(skysat.thumbnail, true);
  const [wrongPage] = both([], [feature('p', 'PSScene')]).scenes;
  assert.equal(wrongPage.thumbnail, false);
});

test('[planet-source-017] removes an item that is not an object, and a scene with a bad id, time or properties', () => {
  const long = 'a'.repeat(128);
  const result = one([
    null,
    5,
    'x',
    [feature('in-array')],
    feature(''),
    feature('a.b'),
    feature('a b'),
    feature('a'.repeat(129)),
    feature(5),
    { ...feature('no-id'), id: undefined },
    withProperties('bad-time', { acquired: 'x' }),
    withProperties('number-time', { acquired: 1760000000000 }),
    withProperties('no-time', { acquired: undefined }),
    feature('no-properties', 'PSScene', { properties: undefined }),
    feature('null-properties', 'PSScene', { properties: null }),
    feature('text-properties', 'PSScene', { properties: 'x' }),
    feature('array-properties', 'PSScene', { properties: [] }),
    feature(long),
    feature('A-z_0-9'),
  ]);
  assert.deepEqual(idsOf(result).sort(), ['A-z_0-9', long].sort());
});

test('[planet-source-018] keeps the first ring of a polygon and of each polygon of a multipolygon', () => {
  const second = RING.map(([lon, lat]) => [lon + 1, lat]);
  const result = one([
    withGeometry('hole', { type: 'Polygon', coordinates: [RING, HOLE] }),
    withGeometry('multi', {
      type: 'MultiPolygon',
      coordinates: [[RING, HOLE], [second]],
    }),
    withGeometry('third', {
      type: 'Polygon',
      coordinates: [RING.map(([lon, lat]) => [lon, lat, 12.5])],
    }),
  ]);
  const byId = Object.fromEntries(result.scenes.map((s) => [s.id, s]));
  assert.deepEqual(byId.hole.footprint, {
    type: 'Polygon',
    coordinates: [RING],
  });
  assert.deepEqual(byId.multi.footprint, {
    type: 'MultiPolygon',
    coordinates: [[RING], [second]],
  });
  assert.deepEqual(byId.third.footprint, {
    type: 'Polygon',
    coordinates: [RING],
  });
});

test('[planet-source-018] keeps a multipolygon of 1 or 16 polygons, and removes one of 0 or 17 polygons', () => {
  const parts = (n) =>
    Array.from({ length: n }, (_, i) => [
      RING.map(([lon, lat]) => [lon + i * 0.01, lat]),
    ]);
  const result = one([
    withGeometry('m0', { type: 'MultiPolygon', coordinates: parts(0) }),
    withGeometry('m1', { type: 'MultiPolygon', coordinates: parts(1) }),
    withGeometry('m16', { type: 'MultiPolygon', coordinates: parts(16) }),
    withGeometry('m17', { type: 'MultiPolygon', coordinates: parts(17) }),
  ]);
  assert.deepEqual(idsOf(result).sort(), ['m1', 'm16']);
  const m16 = result.scenes.find((s) => s.id === 'm16');
  assert.equal(m16.footprint.coordinates.length, 16);
  assert.deepEqual(m16.footprint.coordinates[15], parts(16)[15]);
});

test('[planet-source-018] keeps a ring of 4 to 2000 positions that ends at its first position', () => {
  const ringOf = (n) => {
    const ring = Array.from({ length: n - 1 }, (_, i) => [
      -82.5 + i * 0.0001,
      27.9 + (i % 2) * 0.0001,
    ]);
    return [...ring, ring[0]];
  };
  const result = one([
    withGeometry('r3', { type: 'Polygon', coordinates: [ringOf(3)] }),
    withGeometry('r4', { type: 'Polygon', coordinates: [ringOf(4)] }),
    withGeometry('r2000', { type: 'Polygon', coordinates: [ringOf(2000)] }),
    withGeometry('r2001', { type: 'Polygon', coordinates: [ringOf(2001)] }),
    withGeometry('open', {
      type: 'Polygon',
      coordinates: [[...RING.slice(0, 4), [-82.5, 27.91]]],
    }),
    withGeometry('open-lat', {
      type: 'Polygon',
      coordinates: [[...RING.slice(0, 4), [-82.49, 27.9]]],
    }),
  ]);
  assert.deepEqual(idsOf(result).sort(), ['r2000', 'r4']);
});

test('[planet-source-018] removes a scene with a bad position', () => {
  const at = (position) => [RING[0], position, RING[2], RING[3], RING[0]];
  const kept = [
    [180, 90],
    [-180, -90],
    [10, 20, 30],
  ];
  const removed = [
    [10],
    [10, 20, 30, 40],
    [10, 20, 'x'],
    [10, 20, null],
    [180.0001, 0],
    [-180.0001, 0],
    [0, 90.0001],
    [0, -90.0001],
    [Number.NaN, 0],
    ['10', 0],
    [0, null],
    'x',
    5,
    null,
  ];
  for (const position of kept) {
    const result = one([
      withGeometry('k', { type: 'Polygon', coordinates: [at(position)] }),
    ]);
    assert.equal(result.scenes.length, 1, JSON.stringify(position));
  }
  for (const position of removed) {
    const result = one([
      withGeometry('r', { type: 'Polygon', coordinates: [at(position)] }),
    ]);
    assert.equal(result.scenes.length, 0, JSON.stringify(position));
  }
});

test('[planet-source-018] removes a scene when a first ring is not valid, or the geometry has another shape', () => {
  const bad = [[-82.5, 27.9]];
  const result = one([
    withGeometry('first-bad', { type: 'Polygon', coordinates: [bad, RING] }),
    withGeometry('part-bad', {
      type: 'MultiPolygon',
      coordinates: [[RING], [bad, RING]],
    }),
    withGeometry('no-rings', { type: 'Polygon', coordinates: [] }),
    withGeometry('empty-part', { type: 'MultiPolygon', coordinates: [[]] }),
    withGeometry('part-not-array', { type: 'MultiPolygon', coordinates: [5] }),
    withGeometry('ring-not-array', { type: 'Polygon', coordinates: ['x'] }),
    withGeometry('coordinates-text', { type: 'Polygon', coordinates: 'x' }),
    withGeometry('multi-line', {
      type: 'MultiLineString',
      coordinates: [RING],
    }),
    withGeometry('multi-text', { type: 'MultiPolygon', coordinates: 'x' }),
    withGeometry('point', { type: 'Point', coordinates: [-82.5, 27.9] }),
    withGeometry('line', { type: 'LineString', coordinates: RING }),
    withGeometry('collection', {
      type: 'GeometryCollection',
      geometries: [{ type: 'Polygon', coordinates: [RING] }],
    }),
    withGeometry('none', undefined),
    withGeometry('null', null),
    withGeometry('kept', { type: 'Polygon', coordinates: [RING] }),
  ]);
  assert.deepEqual(idsOf(result), ['kept']);
});

test('[planet-source-019] sorts the scenes of the two pages with the newest start first, then by the code units of the id, then in the upstream order', () => {
  const at = (id, acquired, type = 'PSScene') =>
    feature(id, type, {
      properties: { acquired, gsd: 3, cloud_percent: 1 },
    });
  const result = both(
    [
      at('p-old', '2026-10-01T00:00:00Z'),
      at('b', '2026-10-03T00:00:00Z'),
      at('B', '2026-10-03T00:00:00Z'),
    ],
    [
      at('s-new', '2026-10-04T00:00:00Z', 'SkySatCollect'),
      at('a', '2026-10-03T00:00:00Z', 'SkySatCollect'),
      at('B', '2026-10-03T00:00:00Z', 'SkySatCollect'),
    ],
  );
  assert.deepEqual(idsOf(result), ['s-new', 'B', 'B', 'a', 'b', 'p-old']);
  assert.deepEqual(result.types, [
    'SkySatCollect',
    'PSScene',
    'SkySatCollect',
    'SkySatCollect',
    'PSScene',
    'PSScene',
  ]);
});

test('[planet-source-019] keeps the upstream order of scenes with an equal start and an equal id, PSScene first', () => {
  const at = (id, acquired, gsd, type = 'PSScene') =>
    feature(id, type, { properties: { acquired, gsd } });
  const result = both(
    [
      at('D', '2026-10-03T00:00:00Z', 1),
      at('c', '2026-10-02T00:00:00Z', 9),
      at('D', '2026-10-03T00:00:00Z', 2),
      at('e', '2026-10-04T00:00:00Z', 9),
      at('D', '2026-10-03T00:00:00Z', 3),
    ],
    [
      at('D', '2026-10-03T00:00:00Z', 4, 'SkySatCollect'),
      at('A', '2026-10-03T00:00:00Z', 9, 'SkySatCollect'),
      at('D', '2026-10-03T00:00:00Z', 5, 'SkySatCollect'),
    ],
  );
  assert.deepEqual(idsOf(result), ['e', 'A', 'D', 'D', 'D', 'D', 'D', 'c']);
  assert.deepEqual(
    result.scenes
      .filter((scene) => scene.id === 'D')
      .map((scene) => scene.resolutionM),
    [1, 2, 3, 4, 5],
  );
  assert.deepEqual(result.types.slice(2, 7), [
    'PSScene',
    'PSScene',
    'PSScene',
    'SkySatCollect',
    'SkySatCollect',
  ]);
});

test('[planet-source-019] keeps the first 50 scenes, and sets truncated for more than 50 scenes or a text _next', () => {
  const many = (prefix, n, type) =>
    Array.from({ length: n }, (_, i) =>
      feature(`${prefix}-${String(i).padStart(2, '0')}`, type, {
        properties: {
          acquired: new Date(Date.UTC(2026, 8, 1) + i * 3600_000).toISOString(),
          gsd: 3,
        },
      }),
    );
  const fifty = both(many('p', 25, 'PSScene'), many('s', 25, 'SkySatCollect'));
  assert.equal(fifty.scenes.length, 50);
  assert.equal(fifty.truncated, false);
  const fiftyOne = both(
    many('p', 26, 'PSScene'),
    many('s', 25, 'SkySatCollect'),
  );
  assert.equal(fiftyOne.scenes.length, 50);
  assert.equal(fiftyOne.truncated, true);
  assert.equal(fiftyOne.types.length, 50);
  assert.equal(idsOf(fiftyOne).includes('p-00'), true);
  assert.equal(idsOf(fiftyOne).includes('s-00'), false);
  const next = 'https://api.planet.com/data/v1/searches/x/results?_page=y';
  assert.equal(both([], [], [{ _next: next }, {}]).truncated, true);
  assert.equal(both([], [], [{}, { _next: next }]).truncated, true);
  assert.equal(both([], [], [{}, { _next: '' }]).truncated, true);
  for (const value of [undefined, null, 5, {}]) {
    assert.equal(
      both([], [], [{ _next: value }, { _next: value }]).truncated,
      false,
      String(value),
    );
  }
  for (const links of [undefined, null, 'x']) {
    assert.equal(
      normalizeScenes([
        { type: 'PSScene', page: { features: [], _links: links } },
      ]).truncated,
      false,
    );
  }
});

/** Install the scenes plugin and send one request to the scenes route. */
async function route(t, { body, method = 'POST', headers = {} } = {}) {
  t.mock.timers.reset();
  t.mock.timers.enable({ apis: ['Date'], now: NOW });
  const plugin = planetProxy({
    env: { PLANET_API_KEY: 'fixture-key-Q7' },
    fetchImpl: async (url, init) => {
      const type = JSON.parse(init.body).item_types[0];
      const features =
        type === 'PSScene'
          ? [feature('ps-a'), feature('ps-b'), null]
          : [feature('ss-a', 'SkySatCollect')];
      return new Response(JSON.stringify({ features, _links: {} }), {
        status: 200,
      });
    },
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
  await routes.get('/api/planet/scenes')(req, res, () => {});
  return {
    status: res.statusCode,
    headers: res.headers,
    body: JSON.parse(res.text),
  };
}

test('[planet-source-019] gives the shape of a good answer and the headers of each answer of the scenes route', async (t) => {
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
  assert.equal(answer.body.source, 'Planet');
  assert.equal(answer.body.count, 3);
  assert.equal(answer.body.scenes.length, 3);
  assert.equal(answer.body.truncated, false);
  assert.equal(answer.body.cached, false);
  assert.deepEqual(answer.body.budget, { used: 1, limit: 20 });
  assert.deepEqual(
    answer.body.scenes.map((scene) => scene.id),
    ['ps-a', 'ps-b', 'ss-a'],
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
