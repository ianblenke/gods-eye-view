import assert from 'node:assert/strict';
import test from 'node:test';
import * as Cesium from 'cesium';
import { createUp42ScenesLayer } from './index.js';
import { normalizeAnswer } from './records.js';

const tick = () => new Promise((resolve) => setImmediate(resolve));
const deferred = () => {
  let resolve;
  let reject;
  const promise = new Promise((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
};
const record = (id, start = '2026-10-20T00:00:00Z', thumbnail = true) => ({
  id,
  start,
  thumbnail,
  footprint: {
    type: 'Polygon',
    coordinates: [
      [
        [10, 60],
        [12, 61],
        [11, 63],
        [9, 62],
        [10, 60],
      ],
    ],
  },
});
const answer = (scenes) => normalizeAnswer({ scenes });
const three = () =>
  answer([
    record('old', '2026-10-18T00:00:00Z'),
    record('new', '2026-10-20T00:00:00Z'),
    record('middle', '2026-10-19T00:00:00Z'),
  ]);
const fakeDecode = async () => ({ width: 2, height: 1, close() {} });
const decodeFirst = (decode) => {
  let first = true;
  return (blob) => {
    if (!first) return fakeDecode();
    first = false;
    return decode(blob);
  };
};
const image = () => ({
  ok: true,
  blob: new Blob(['fake'], { type: 'image/png' }),
});

function harness(
  t,
  { scenes = three(), thumbnail = async () => image(), decode } = {},
) {
  const state = { scenes, configured: true, searchError: null };
  const calls = [];
  const urls = [];
  const revoked = [];
  const cards = [];
  const cleared = [];
  const renders = [];
  const notices = [];
  let active = 0;
  let maximum = 0;
  t.mock.method(URL, 'createObjectURL', (blob) => {
    urls.push(blob);
    return `blob:preview-${urls.length}`;
  });
  t.mock.method(URL, 'revokeObjectURL', (url) => revoked.push(url));
  const layer = createUp42ScenesLayer({
    source: {
      getStatus: async () => ({ ok: true, configured: state.configured }),
      searchScenes: async () =>
        state.searchError ?? { ok: true, answer: state.scenes },
      getThumbnail(options) {
        calls.push(options);
        active += 1;
        maximum = Math.max(maximum, active);
        return Promise.resolve()
          .then(() => thumbnail(options))
          .then(
            (value) => {
              active -= 1;
              return value;
            },
            (error) => {
              active -= 1;
              throw error;
            },
          );
      },
    },
    overlayHost: {
      setEntries: (...args) => cards.push(args),
      clearSource: (...args) => cleared.push(args),
      setVisible() {},
    },
    decodeImage: decode ?? fakeDecode,
    requestRender: (id) => renders.push(id),
  });
  let ds;
  const viewer = {
    scene: { canvas: { clientWidth: 800, clientHeight: 600 }, globe: {} },
    camera: { pickEllipsoid: () => Cesium.Cartesian3.fromDegrees(10, 60) },
    dataSources: {
      add(value) {
        ds = value;
      },
      remove() {},
    },
  };
  const controls = () => layer.getRowControls();
  const chip = () => controls().chips[1];
  const search = () => controls().chips[0].onClick();
  const images = () =>
    ds.entities.values.filter(
      (entity) =>
        entity.polygon?.material instanceof Cesium.ImageMaterialProperty,
    );
  const outline = (id) => ds.entities.getById(`up42-scenes:${id}`);
  layer.setRowControlsListener(() => notices.push(controls().info));
  layer.init(viewer);
  layer.enable();
  t.after(() => layer.destroy());
  return {
    layer,
    state,
    calls,
    urls,
    revoked,
    cards,
    cleared,
    renders,
    notices,
    controls,
    chip,
    search,
    images,
    outline,
    maximum: () => maximum,
    ds: () => ds,
    async ready() {
      await layer.update();
      await search();
    },
  };
}

const coordinates = (positions) =>
  positions.map((position) => {
    const point = Cesium.Cartographic.fromCartesian(position);
    return [
      Number(Cesium.Math.toDegrees(point.longitude).toFixed(8)),
      Number(Cesium.Math.toDegrees(point.latitude).toFixed(8)),
    ];
  });

test('[up42-scene-overlay-001] starts with no image and keeps the card path', async (t) => {
  const h = harness(t);
  await h.ready();
  assert.equal(h.chip().label, 'Show images');
  assert.equal(h.images().length, 0);
  assert.equal(h.calls.length, 0);
  assert.equal(h.layer.setParams({ scene: 'new' }), true);
  await tick();
  assert.equal(h.cards.length, 1);
  assert.equal(h.cards[0][0], 'up42-scenes');
  assert.equal(h.cards[0][1][0].variant, 'thumbnail');
  assert.equal(h.urls.length, 0);
});

test('[up42-scene-overlay-002] gives the image chip its labels and handler', async (t) => {
  const h = harness(t);
  await h.ready();
  assert.equal(h.controls().chips.length, 2);
  assert.equal(h.chip().id, 'images');
  assert.equal(h.chip().label, 'Show images');
  assert.deepEqual(Object.keys(h.chip()), ['id', 'label', 'onClick']);
  assert.equal(typeof h.chip().onClick, 'function');
  assert.equal(Object.hasOwn(h.chip(), 'params'), false);
  h.chip().onClick();
  assert.equal(h.chip().label, 'Hide images');
  h.chip().onClick();
  assert.equal(h.chip().label, 'Show images');
  assert.equal(h.notices.length, 5);
  assert.deepEqual(h.renders, ['up42-scenes', 'up42-scenes', 'up42-scenes']);
});

test('[up42-scene-overlay-003] omits the image chip without an answer or available thumbnails', async (t) => {
  const h = harness(t);
  assert.deepEqual(
    h.controls().chips.map(({ id }) => id),
    ['search'],
  );
  await h.layer.update();
  assert.deepEqual(
    h.controls().chips.map(({ id }) => id),
    ['search'],
  );
  await h.search();
  const old = h.chip().onClick;
  h.state.configured = false;
  await h.layer.update();
  assert.deepEqual(
    h.controls().chips.map(({ id }) => id),
    ['search'],
  );
  old();
  assert.equal(h.calls.length, 0);
  h.state.configured = true;
  await h.layer.update();
  assert.equal(h.chip().label, 'Show images');
  h.state.scenes = answer([record('none', undefined, false)]);
  await h.search();
  assert.deepEqual(
    h.controls().chips.map(({ id }) => id),
    ['search'],
  );
  old();
  assert.equal(h.calls.length, 0);
  h.state.scenes = answer([]);
  await h.search();
  assert.deepEqual(
    h.controls().chips.map(({ id }) => id),
    ['search'],
  );
  old();
  assert.equal(h.calls.length, 0);
  h.layer.disable();
  assert.deepEqual(h.controls().chips, []);
  old();
  assert.equal(h.calls.length, 0);
});

test('[up42-scene-overlay-003] supplies the image chip when the status is unknown', async (t) => {
  const h = harness(t);
  await h.search();
  assert.equal(h.chip().label, 'Show images');
  h.chip().onClick();
  await tick();
  assert.equal(h.images().length, 3);
  assert.equal(h.chip().label, 'Hide images');
});

test('[up42-scene-overlay-004] requests only the 24 newest thumbnails in literal order', async (t) => {
  const scenes = Array.from({ length: 30 }, (_, index) =>
    record(
      `scene-${String(index + 1).padStart(2, '0')}`,
      `2026-10-${String(30 - index).padStart(2, '0')}T00:00:00Z`,
    ),
  ).reverse();
  scenes.unshift(record('no-image', '2026-11-01T00:00:00Z', false));
  const h = harness(t, { scenes: answer(scenes) });
  await h.ready();
  h.chip().onClick();
  await tick();
  assert.deepEqual(
    h.calls.map(({ id }) => id),
    [
      'scene-01',
      'scene-02',
      'scene-03',
      'scene-04',
      'scene-05',
      'scene-06',
      'scene-07',
      'scene-08',
      'scene-09',
      'scene-10',
      'scene-11',
      'scene-12',
      'scene-13',
      'scene-14',
      'scene-15',
      'scene-16',
      'scene-17',
      'scene-18',
      'scene-19',
      'scene-20',
      'scene-21',
      'scene-22',
      'scene-23',
      'scene-24',
    ],
  );
  assert.equal(
    h.calls.some(({ id }) =>
      [
        'scene-25',
        'scene-26',
        'scene-27',
        'scene-28',
        'scene-29',
        'scene-30',
        'no-image',
      ].includes(id),
    ),
    false,
  );
  assert.equal(h.images().length, 24);
  assert.equal(h.urls.length, 24);
});

test('[up42-scene-overlay-005] orders equal times by id and puts greater time values first', async (t) => {
  const h = harness(t, {
    scenes: answer([
      record('c', '2026-10-12T00:00:00+02:00'),
      record('newest', '2026-10-11T23:00:00Z'),
      record('oldest', '2026-10-11T21:00:00Z'),
      record('b', '2026-10-12T00:00:00+02:00'),
      record('a', '2026-10-12T00:00:00+02:00'),
    ]),
  });
  await h.ready();
  h.chip().onClick();
  await tick();
  assert.deepEqual(
    h.calls.map(({ id }) => id),
    ['newest', 'a', 'b', 'c', 'oldest'],
  );
});

test('[up42-scene-overlay-006] runs at most four requests and starts the next after an end', async (t) => {
  const pending = [];
  const h = harness(t, {
    scenes: answer(
      Array.from({ length: 24 }, (_, index) =>
        record(`id-${String(index).padStart(2, '0')}`),
      ),
    ),
    thumbnail: () => {
      const wait = deferred();
      pending.push(wait);
      return wait.promise;
    },
  });
  await h.ready();
  h.chip().onClick();
  await tick();
  assert.deepEqual(
    h.calls.map(({ id }) => id),
    ['id-00', 'id-01', 'id-02', 'id-03'],
  );
  pending[2].resolve(image());
  await tick();
  assert.deepEqual(
    h.calls.map(({ id }) => id),
    ['id-00', 'id-01', 'id-02', 'id-03', 'id-04'],
  );
  for (let index = 0; index < 24; index += 1) {
    pending[index].resolve(image());
    await tick();
  }
  assert.equal(h.maximum(), 4);
  assert.equal(h.calls.length, 24);
  assert.equal(h.images().length, 24);
});

test('[up42-scene-overlay-007] keeps two images after one failure and sends no retry', async (t) => {
  const h = harness(t, {
    thumbnail: async ({ id }) =>
      id === 'middle'
        ? { ok: false, status: 502, error: 'upstream_failed', detail: 'SECRET' }
        : image(),
  });
  await h.ready();
  h.chip().onClick();
  await tick();
  assert.equal(
    h.controls().info,
    '3 scenes · newest 2026-10-20 · Images shown: 2; failed: 1.',
  );
  assert.deepEqual(
    h.images().map(({ id }) => id),
    ['up42-scenes:image:new', 'up42-scenes:image:old'],
  );
  await h.layer.update();
  h.layer.setParams({ scene: 'middle' });
  h.layer.setParams({ scene: 'old' });
  await tick();
  assert.equal(h.calls.length, 3);
  assert.equal(h.cards.length, 0);
  assert.equal(h.layer.getStats().error, null);
});

test('[up42-scene-overlay-008] counts a rejected thumbnail with a fixed message', async (t) => {
  const h = harness(t, {
    thumbnail: async () => {
      throw new Error('SECRET');
    },
  });
  await h.ready();
  h.chip().onClick();
  await tick();
  assert.equal(
    h.controls().info,
    '3 scenes · newest 2026-10-20 · Images shown: 0; failed: 3.',
  );
  assert.equal(h.images().length, 0);
  assert.equal(h.calls.length, 3);
});

test('[up42-scene-overlay-008] counts an image error and releases its URL', async (t) => {
  const h = harness(t);
  await h.ready();
  const add = h.ds().entities.add.bind(h.ds().entities);
  t.mock.method(h.ds().entities, 'add', (entity) => {
    if (entity.id === 'up42-scenes:image:middle') throw new Error('SECRET');
    return add(entity);
  });
  h.chip().onClick();
  await tick();
  assert.equal(
    h.controls().info,
    '3 scenes · newest 2026-10-20 · Images shown: 2; failed: 1.',
  );
  assert.deepEqual(h.revoked, ['blob:preview-2']);
  h.chip().onClick();
  assert.deepEqual(h.revoked, [
    'blob:preview-2',
    'blob:preview-1',
    'blob:preview-3',
  ]);
});

test('[up42-scene-overlay-008] counts an object URL error', async (t) => {
  const h = harness(t);
  await h.ready();
  t.mock.method(URL, 'createObjectURL', () => {
    throw new Error('SECRET');
  });
  h.chip().onClick();
  await tick();
  assert.equal(
    h.controls().info,
    '3 scenes · newest 2026-10-20 · Images shown: 0; failed: 3.',
  );
  assert.deepEqual(h.revoked, []);
});

test('[up42-scene-overlay-009] draws every footprint vertex with the specified image material', async (t) => {
  const scenes = three();
  scenes.scenes[0].ring = [
    [21, 31],
    [23, 32],
    [24, 35],
    [21, 31],
  ];
  scenes.scenes[2].ring = [
    [-15, 40],
    [-12, 41],
    [-13, 44],
    [-16, 43],
    [-15, 40],
  ];
  const h = harness(t, { scenes });
  await h.ready();
  h.chip().onClick();
  await tick();
  const polygon = h.images()[0].polygon;
  assert.deepEqual(coordinates(polygon.hierarchy.getValue().positions), [
    [10, 60],
    [12, 61],
    [11, 63],
    [9, 62],
    [10, 60],
  ]);
  assert.deepEqual(
    h
      .images()
      .map((entity) => [
        entity.id,
        coordinates(entity.polygon.hierarchy.getValue().positions),
      ]),
    [
      [
        'up42-scenes:image:new',
        [
          [10, 60],
          [12, 61],
          [11, 63],
          [9, 62],
          [10, 60],
        ],
      ],
      [
        'up42-scenes:image:middle',
        [
          [-15, 40],
          [-12, 41],
          [-13, 44],
          [-16, 43],
          [-15, 40],
        ],
      ],
      [
        'up42-scenes:image:old',
        [
          [21, 31],
          [23, 32],
          [24, 35],
          [21, 31],
        ],
      ],
    ],
  );
  assert.equal(polygon.material.image.getValue(), 'blob:preview-1');
  assert.equal(polygon.material.transparent.getValue(), true);
  assert.deepEqual(
    polygon.material.color.getValue(),
    new Cesium.Color(1, 1, 1, 0.85),
  );
  assert.equal(h.urls[0] instanceof Blob, true);
  assert.equal(h.urls[0].type, 'image/png');
  assert.equal(await h.urls[0].text(), 'fake');
});

test('[up42-scene-overlay-010] gives ground polygons literal ranks with the newest highest', async (t) => {
  const waits = new Map();
  const h = harness(t, {
    thumbnail: ({ id }) => {
      const wait = deferred();
      waits.set(id, wait);
      return wait.promise;
    },
  });
  await h.ready();
  h.chip().onClick();
  await tick();
  for (const id of ['old', 'middle', 'new']) {
    waits.get(id).resolve(image());
    await tick();
  }
  assert.deepEqual(
    h.images().map(({ id, polygon }) => [id, polygon.zIndex.getValue()]),
    [
      ['up42-scenes:image:old', 1],
      ['up42-scenes:image:middle', 2],
      ['up42-scenes:image:new', 3],
    ],
  );
  for (const { polygon } of h.images()) {
    assert.equal(polygon.height, undefined);
    assert.equal(polygon.heightReference.getValue(), 1);
    assert.equal(polygon.perPositionHeight.getValue(), false);
  }
});

test('[up42-scene-overlay-011] keeps each outline above images and keeps the selected style', async (t) => {
  const h = harness(t);
  await h.ready();
  h.chip().onClick();
  await tick();
  h.layer.setParams({ scene: 'middle' });
  assert.equal(h.ds().entities.values.length, 6);
  for (const id of ['old', 'new', 'middle']) {
    const line = h.outline(id).polyline;
    assert.equal(line.zIndex.getValue(), 25);
    assert.equal(line.clampToGround.getValue(), true);
    assert.deepEqual(coordinates(line.positions.getValue()), [
      [10, 60],
      [12, 61],
      [11, 63],
      [9, 62],
      [10, 60],
    ]);
  }
  assert.equal(h.outline('middle').polyline.width.getValue(), 3);
  assert.deepEqual(
    h.outline('middle').polyline.material.color.getValue(),
    new Cesium.Color(250 / 255, 204 / 255, 21 / 255, 1),
  );
  assert.equal(h.outline('middle').polygon.zIndex.getValue(), 25);
  assert.equal(h.outline('new').polyline.width.getValue(), 2);
  assert.deepEqual(
    h.outline('new').polyline.material.color.getValue(),
    new Cesium.Color(56 / 255, 189 / 255, 248 / 255, 0.9),
  );
});

test('[up42-scene-overlay-012] selects without a card and keeps each image unchanged', async (t) => {
  const h = harness(t, {
    scenes: answer([record('new'), record('none', undefined, false)]),
  });
  await h.ready();
  h.chip().onClick();
  await tick();
  const entity = h.images()[0];
  const material = entity.polygon.material;
  assert.equal(h.layer.setParams({ scene: 'new' }), true);
  assert.equal(h.controls().list.items[0].active, true);
  assert.equal(h.outline('new').polyline.width.getValue(), 3);
  assert.deepEqual(
    h.outline('new').polyline.material.color.getValue(),
    new Cesium.Color(250 / 255, 204 / 255, 21 / 255, 1),
  );
  assert.equal(h.outline('none').polyline.width.getValue(), 2);
  assert.deepEqual(
    h.outline('none').polyline.material.color.getValue(),
    new Cesium.Color(56 / 255, 189 / 255, 248 / 255, 0.9),
  );
  assert.equal(h.layer.setParams({ scene: 'none' }), true);
  assert.equal(h.controls().list.items[1].active, true);
  assert.equal(h.outline('none').polyline.width.getValue(), 3);
  assert.deepEqual(
    h.outline('none').polyline.material.color.getValue(),
    new Cesium.Color(250 / 255, 204 / 255, 21 / 255, 1),
  );
  assert.equal(h.outline('new').polyline.width.getValue(), 2);
  assert.deepEqual(
    h.outline('new').polyline.material.color.getValue(),
    new Cesium.Color(56 / 255, 189 / 255, 248 / 255, 0.9),
  );
  assert.equal(h.layer.setParams({ scene: null }), true);
  for (const id of ['new', 'none']) {
    assert.equal(h.outline(id).polyline.width.getValue(), 2);
    assert.deepEqual(
      h.outline(id).polyline.material.color.getValue(),
      new Cesium.Color(56 / 255, 189 / 255, 248 / 255, 0.9),
    );
  }
  await tick();
  assert.equal(h.images()[0], entity);
  assert.equal(h.images()[0].polygon.material, material);
  assert.equal(h.calls.length, 1);
  assert.equal(h.cards.length, 0);
  assert.equal(
    h.controls().info,
    '2 scenes · newest 2026-10-20 · Images shown: 1; failed: 0.',
  );
});

for (const [scenario, end] of [
  ['013', 'a new answer'],
  ['014', 'a second press'],
  ['015', 'disable'],
  ['016', 'destroy'],
]) {
  test(`[up42-scene-overlay-${scenario}] aborts and releases images after ${end}`, async (t) => {
    const pending = [];
    const h = harness(t, {
      scenes: answer(['a', 'b', 'c', 'd', 'e', 'f'].map((id) => record(id))),
      thumbnail: () => {
        const wait = deferred();
        pending.push(wait);
        return wait.promise;
      },
    });
    await h.ready();
    h.chip().onClick();
    await tick();
    pending[0].resolve(image());
    pending[1].resolve(image());
    await tick();
    assert.equal(h.images().length, 2);
    assert.equal(h.calls.length, 6);
    const oldSignals = h.calls.map(({ signal }) => signal);
    const oldImages = h.images();
    h.state.scenes = answer([record('fresh', '2026-10-21T00:00:00Z')]);
    if (end === 'a new answer') await h.search();
    if (end === 'a second press') h.chip().onClick();
    if (end === 'disable') h.layer.disable();
    if (end === 'destroy') {
      h.layer.destroy();
      h.layer.destroy();
    }
    assert.deepEqual(
      oldSignals.map((signal) => signal.aborted),
      [true, true, true, true, true, true],
    );
    assert.deepEqual(h.revoked, ['blob:preview-1', 'blob:preview-2']);
    assert.equal(h.images().length, 0);
    assert.equal(
      oldImages.some((entity) => h.ds().entities.contains(entity)),
      false,
    );
    for (let index = 2; index < 6; index += 1) pending[index].resolve(image());
    await tick();
    assert.equal(h.urls.length, 2);
    if (end === 'a new answer') {
      assert.equal(h.chip().label, 'Hide images');
      assert.deepEqual(
        h.calls.map(({ id }) => id),
        ['a', 'b', 'c', 'd', 'e', 'f', 'fresh'],
      );
      pending[6].resolve(image());
      await tick();
      assert.equal(h.images().length, 1);
    }
    if (end === 'a second press') {
      assert.equal(h.ds().entities.values.length, 6);
      assert.equal(h.chip().label, 'Show images');
      h.layer.setParams({ scene: 'a' });
      await tick();
      pending[6].resolve(image());
      await tick();
      assert.equal(h.cards.length, 1);
    }
    if (end === 'disable') {
      h.layer.enable();
      assert.deepEqual(
        h.controls().chips.map(({ id }) => id),
        ['search'],
      );
    }
  });
}

test('[up42-scene-overlay-017] ignores late success and failure and does not drain an old queue', async (t) => {
  const pending = [];
  const h = harness(t, {
    scenes: answer(['a', 'b', 'c', 'd', 'e'].map((id) => record(id))),
    thumbnail: () => {
      const wait = deferred();
      pending.push(wait);
      return wait.promise;
    },
  });
  await h.ready();
  h.chip().onClick();
  await tick();
  h.chip().onClick();
  pending[0].resolve(image());
  pending[1].reject(new Error('SECRET'));
  pending[2].resolve({ ok: false });
  pending[3].resolve(image());
  await tick();
  assert.equal(h.calls.length, 4);
  assert.equal(h.images().length, 0);
  assert.equal(h.urls.length, 0);
  assert.equal(h.cards.length, 0);
  assert.equal(h.controls().info, '5 scenes · newest 2026-10-20');
});

test('[up42-scene-overlay-018] closes the old card before the image queue starts', async (t) => {
  let closed = 0;
  const h = harness(t, {
    decode: async () => ({
      width: 2,
      height: 1,
      close() {
        closed += 1;
      },
    }),
  });
  await h.ready();
  h.layer.setParams({ scene: 'new' });
  await tick();
  assert.equal(h.cards.length, 1);
  h.chip().onClick();
  assert.equal(closed, 1);
  assert.deepEqual(h.cleared.at(-1), ['up42-scenes']);
  await tick();
  assert.equal(h.images().length, 3);
  assert.equal(h.cards.length, 1);
});

test('[up42-scene-overlay-018] aborts the old card and closes a late bitmap', async (t) => {
  const decoding = deferred();
  let closed = 0;
  const h = harness(t, { decode: decodeFirst(() => decoding.promise) });
  await h.ready();
  h.layer.setParams({ scene: 'new' });
  await tick();
  const signal = h.calls[0].signal;
  h.chip().onClick();
  assert.equal(signal.aborted, true);
  decoding.resolve({
    width: 2,
    height: 1,
    close() {
      closed += 1;
    },
  });
  await tick();
  assert.equal(closed, 1);
  assert.equal(h.cards.length, 0);
  assert.equal(h.images().length, 3);
});

test('[up42-scene-overlay-019] keeps images and selection after a failed search', async (t) => {
  const h = harness(t);
  await h.ready();
  h.chip().onClick();
  await tick();
  h.layer.setParams({ scene: 'new' });
  h.state.searchError = { ok: false, status: 502, error: 'upstream_failed' };
  await h.search();
  assert.equal(h.images().length, 3);
  assert.deepEqual(h.revoked, []);
  assert.equal(h.controls().list.items[1].active, true);
  assert.equal(
    h.controls().info,
    'UP42 did not answer correctly. · 3 scenes · newest 2026-10-20 · Images shown: 3; failed: 0.',
  );
});

test('[up42-scene-overlay-020] keeps the original public scene fields', async (t) => {
  t.diagnostic(`Host Node: ${process.version}`);
  const scenes = answer([record('a', '2026-10-12T00:00:00+02:00')]);
  assert.equal(scenes.scenes[0].time, 1791756000000);
  assert.deepEqual(Object.keys(scenes.scenes[0]).sort(), [
    'cloudPercent',
    'collection',
    'id',
    'provider',
    'resolutionM',
    'ring',
    'thumbnail',
    'time',
  ]);
  const h = harness(t, { scenes });
  await h.ready();
  h.chip().onClick();
  await tick();
  assert.deepEqual(
    h.calls.map(({ id }) => id),
    ['a'],
  );
  assert.deepEqual(Object.keys(scenes.scenes[0]).sort(), [
    'cloudPercent',
    'collection',
    'id',
    'provider',
    'resolutionM',
    'ring',
    'thumbnail',
    'time',
  ]);
  assert.equal(scenes.scenes[0].time, 1791756000000);
});

test('[up42-scene-overlay-013] switches the option off after an answer with no thumbnails', async (t) => {
  const h = harness(t);
  await h.ready();
  h.chip().onClick();
  await tick();
  assert.equal(h.images().length, 3);
  const oldImages = h.images();
  const oldSignals = h.calls.map(({ signal }) => signal);
  const old = h.chip().onClick;
  h.state.scenes = answer([record('none', undefined, false)]);
  await h.search();
  assert.deepEqual(
    h.controls().chips.map(({ id }) => id),
    ['search'],
  );
  assert.deepEqual(
    oldSignals.map(({ aborted }) => aborted),
    [true, true, true],
  );
  assert.deepEqual(h.revoked, [
    'blob:preview-1',
    'blob:preview-2',
    'blob:preview-3',
  ]);
  assert.equal(
    oldImages.some((entity) => h.ds().entities.contains(entity)),
    false,
  );
  old();
  assert.equal(h.images().length, 0);
  assert.equal(h.calls.length, 3);
  assert.equal(h.controls().info, '1 scene · newest 2026-10-20');
  h.state.scenes = three();
  await h.search();
  assert.equal(h.chip().label, 'Show images');
  assert.equal(h.images().length, 0);
  assert.equal(h.calls.length, 3);
});

for (const [result, phrase] of [
  ['reject', 'the decoder rejects'],
  ['null', 'the decoder returns null'],
]) {
  test(`[up42-scene-overlay-021] counts one failed image when ${phrase}`, async (t) => {
    const corrupt = new Blob(
      [new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])],
      {
        type: 'image/png',
      },
    );
    const decoded = [];
    const h = harness(t, {
      scenes: answer([record('corrupt')]),
      thumbnail: async () => ({ ok: true, blob: corrupt }),
      decode: async (blob) => {
        decoded.push(blob);
        if (result === 'reject') throw new Error('SECRET');
        return null;
      },
    });
    await h.ready();
    h.chip().onClick();
    await tick();
    assert.equal(decoded.length, 1);
    assert.equal(decoded[0].type, 'image/png');
    assert.deepEqual(
      [...new Uint8Array(await decoded[0].arrayBuffer())],
      [137, 80, 78, 71, 13, 10, 26, 10],
    );
    assert.equal(
      h.controls().info,
      '1 scene · newest 2026-10-20 · Images shown: 0; failed: 1.',
    );
    assert.equal(h.images().length, 0);
    assert.deepEqual(h.urls, []);
    assert.deepEqual(h.revoked, []);
    await h.layer.update();
    assert.equal(h.calls.length, 1);
  });
}

test('[up42-scene-overlay-021] closes the bitmap before it creates the blob URL', async (t) => {
  const events = [];
  const h = harness(t, {
    scenes: answer([record('valid')]),
    decode: async () => ({ close: () => events.push('close') }),
  });
  const create = URL.createObjectURL;
  t.mock.method(URL, 'createObjectURL', (blob) => {
    events.push('url');
    return create(blob);
  });
  await h.ready();
  h.chip().onClick();
  await tick();
  assert.deepEqual(events, ['close', 'url']);
  assert.equal(h.images().length, 1);
  assert.equal(
    h.controls().info,
    '1 scene · newest 2026-10-20 · Images shown: 1; failed: 0.',
  );
  h.chip().onClick();
  assert.deepEqual(h.revoked, ['blob:preview-1']);
  assert.deepEqual(events, ['close', 'url']);
});

for (const end of ['off', 'disable', 'destroy', 'answer']) {
  for (const result of ['bitmap', 'reject', 'null']) {
    test(`[up42-scene-overlay-021] ignores a late ${result} decode after ${end}`, async (t) => {
      const decoding = deferred();
      let closed = 0;
      const h = harness(t, {
        scenes: answer([record('late')]),
        decode: decodeFirst(() => decoding.promise),
      });
      await h.ready();
      h.chip().onClick();
      await tick();
      assert.equal(h.images().length, 0);
      assert.equal(h.urls.length, 0);
      if (end === 'off') h.chip().onClick();
      if (end === 'disable') h.layer.disable();
      if (end === 'destroy') h.layer.destroy();
      if (end === 'answer') {
        h.state.scenes = answer([record('fresh', '2026-10-21T00:00:00Z')]);
        await h.search();
        await tick();
      }
      assert.equal(h.calls[0].signal.aborted, true);
      const info = h.controls().info;
      const notices = h.notices.length;
      if (result === 'reject') decoding.reject(new Error('SECRET'));
      else
        decoding.resolve(
          result === 'null'
            ? null
            : {
                close() {
                  closed += 1;
                },
              },
        );
      await tick();
      assert.equal(closed, result === 'bitmap' ? 1 : 0);
      assert.equal(h.urls.length, end === 'answer' ? 1 : 0);
      assert.deepEqual(
        h.images().map(({ id }) => id),
        end === 'answer' ? ['up42-scenes:image:fresh'] : [],
      );
      assert.equal(h.controls().info, info);
      assert.equal(h.notices.length, notices);
      assert.deepEqual(h.revoked, []);
      assert.equal(h.cards.length, 0);
    });
  }
}
