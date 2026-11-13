import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import * as Cesium from 'cesium';
import { createApplicationCatalog } from '../../app/constructCatalog.js';
import { createApplicationUp42Scenes } from '../../app/layers/up42Scenes.js';
import { createSurfaceServices } from '../../app/surfaceServices.js';
import { CATALOG_SOURCE_CONTRACTS } from '../../app/sourceComposition.js';
import { DATA_CREDITS } from '../../data/dataCredits.js';
import { DataLayerManager } from '../../data/manager.js';
import {
  LAYER_STATE_REGISTRY,
  REGISTERED_LAYER_IDS,
  LAYER_STATE_TOKEN_RESERVATIONS,
  nextLayerStateToken,
  decodeLayerStateParams,
} from '../../data/layerState.js';
import { getLocale, setLocale } from '../../i18n/index.js';
import { createStandaloneLayerSources } from '../../standalone/layerSources.js';
import { createReferenceSources } from '../../sources/reference.js';
import { layerNameForId } from '../../ui/layerNames.js';
import {
  _resetRenderGovernorForTest,
  getRenderGovernorDiagnostics,
  installRenderGovernor,
} from '../../renderGovernor.js';
import { VOICE_OFF_LAYERS } from '../../voice/layerManifest.js';
import { sceneList } from './model.js';
import { fakeStreetLevelProvider } from '../../testSupport/streetLevelFakes.mjs';

const RING = [
  [10, 60],
  [10.2, 60],
  [10.2, 60.1],
  [10, 60.1],
  [10, 60],
];
const ANSWER = {
  scenes: [
    {
      id: 'scene-1',
      time: Date.parse('2026-10-14T08:03:00.000Z'),
      ring: RING,
      resolutionM: 0.5,
      provider: 'Satellogic',
      cloudPercent: 3,
      thumbnail: false,
    },
  ],
  count: 1,
  truncated: false,
  partial: false,
  used: 1,
  limit: 20,
};
const viewer = () => ({
  dataSources: { add() {}, remove() {} },
  camera: {
    pickEllipsoid: () => Cesium.Cartesian3.fromDegrees(10, 60),
  },
  scene: {
    canvas: { clientWidth: 800, clientHeight: 600 },
    globe: { ellipsoid: Cesium.Ellipsoid.WGS84 },
  },
});
const readLocale = (code) =>
  JSON.parse(
    readFileSync(
      fileURLToPath(
        new URL(`../../i18n/locales/${code}.json`, import.meta.url),
      ),
      'utf8',
    ),
  );
const catalogOf = (sources, signal) =>
  createApplicationCatalog({
    sources,
    signal,
    surface: createSurfaceServices({
      terrainSource: { getHeights: async () => [] },
      signal,
      eventTarget: null,
    }),
  });
const fakeSource = (calls) => ({
  getStatus: async () => {
    calls.getStatus += 1;
    return { ok: true, configured: true };
  },
  searchScenes: async () => {
    calls.searchScenes += 1;
    return { ok: true, answer: ANSWER };
  },
  getThumbnail: async () => {
    calls.getThumbnail += 1;
    return { ok: false, status: 404, error: 'thumbnails_off' };
  },
  getProducts: async () => ({ ok: true, products: [] }),
  getQuote: async () => ({ ok: false, status: 404, error: 'quotes_off' }),
});

test('[up42-scenes-layer-033] registers the layer in the catalog, the source contract, the reference sources and the share link', (t) => {
  const lifetime = new AbortController();
  t.after(() => lifetime.abort());
  const catalog = catalogOf(createStandaloneLayerSources(), lifetime.signal);
  assert.equal(catalog.get('up42-scenes').name, 'UP42 Scenes');
  const ids = catalog.layers.map((layer) => layer.id);
  assert.equal(ids.indexOf('up42-scenes'), ids.indexOf('skyfi-scenes') + 1);
  assert.deepEqual(CATALOG_SOURCE_CONTRACTS['up42-scenes'].layers, [
    'up42-scenes',
  ]);
  assert.deepEqual(CATALOG_SOURCE_CONTRACTS['up42-scenes'].methods, [
    'getStatus',
    'searchScenes',
    'getThumbnail',
    'getProducts',
    'getQuote',
  ]);
  const sources = createReferenceSources();
  for (const method of [
    'getStatus',
    'searchScenes',
    'getThumbnail',
    'getProducts',
    'getQuote',
  ])
    assert.equal(typeof sources['up42-scenes'][method], 'function');
  assert.notEqual(
    sources['up42-scenes'],
    createReferenceSources()['up42-scenes'],
  );
  assert.deepEqual(
    LAYER_STATE_REGISTRY.find(({ id }) => id === 'up42-scenes'),
    { id: 'up42-scenes', token: '04', disposition: 'enabled-only' },
  );
  assert.deepEqual(
    decodeLayerStateParams(new URLSearchParams('v=2&l=04')).enabledLayerIds,
    ['up42-scenes'],
  );
});

test('[up42-scenes-layer-033] gives the layer its supplied source, and the stats error of a catalog without the source', async (t) => {
  const lifetime = new AbortController();
  t.after(() => lifetime.abort());
  const calls = { getStatus: 0, searchScenes: 0, getThumbnail: 0 };
  const supplied = createStandaloneLayerSources();
  supplied['up42-scenes'] = fakeSource(calls);
  const wired = catalogOf(supplied, lifetime.signal).get('up42-scenes');
  const view = viewer();
  wired.init(view);
  wired.enable(view);
  assert.equal(await wired.update(view), true);
  assert.deepEqual(calls, { getStatus: 1, searchScenes: 0, getThumbnail: 0 });
  wired.destroy(view);

  const bare = createStandaloneLayerSources();
  delete bare['up42-scenes'];
  const missing = catalogOf(bare, lifetime.signal).get('up42-scenes');
  const other = viewer();
  missing.init(other);
  missing.enable(other);
  assert.equal(await missing.update(other), true);
  assert.equal(
    missing.getStats().error,
    'Data source not configured: up42-scenes',
  );
  missing.destroy(other);
});

test('[up42-scenes-layer-033] selects a scene through setLayerParams of the manager with the origin user', async (t) => {
  const lifetime = new AbortController();
  t.after(() => lifetime.abort());
  const calls = { getStatus: 0, searchScenes: 0, getThumbnail: 0 };
  const sources = createStandaloneLayerSources();
  sources['up42-scenes'] = fakeSource(calls);
  const layer = catalogOf(sources, lifetime.signal).get('up42-scenes');
  const manager = new DataLayerManager({});
  manager.register(layer);
  manager.finalizeRegistrations(
    LAYER_STATE_REGISTRY.filter(({ id }) => id === 'up42-scenes'),
  );
  const view = viewer();
  layer.init(view);
  layer.enable(view);
  await layer.update(view);
  assert.equal(
    manager.setLayerParams(
      'up42-scenes',
      { scene: 'scene-1' },
      { origin: 'user' },
    ),
    false,
  );
  await layer.getRowControls().chips[0].onClick();
  assert.equal(calls.searchScenes, 1);
  const [item] = layer.getRowControls().list.items;
  assert.deepEqual(item.params, { scene: 'scene-1' });
  assert.equal(
    manager.setLayerParams('up42-scenes', item.params, { origin: 'user' }),
    true,
  );
  assert.equal(layer.getRowControls().list.items[0].active, true);
  assert.equal(
    manager.setLayerParams(
      'up42-scenes',
      { scene: 'other' },
      { origin: 'user' },
    ),
    false,
  );
  layer.destroy(view);
});

test('[up42-scenes-layer-033] gives the layer of the application the render governor, and an option requestRender replaces it', async (t) => {
  const frames = [];
  installRenderGovernor({
    scene: { requestRender: () => frames.push('frame') },
  });
  t.after(() => _resetRenderGovernorForTest());
  const calls = { getStatus: 0, searchScenes: 0, getThumbnail: 0 };
  const view = viewer();
  const layer = createApplicationUp42Scenes({ source: fakeSource(calls) });
  layer.init(view);
  layer.enable(view);
  await layer.update(view);
  const before = frames.length;
  await layer.getRowControls().chips[0].onClick();
  assert.equal(calls.searchScenes, 1);
  assert.equal(frames.length, before + 1);
  assert.equal(
    getRenderGovernorDiagnostics().recentRequests.at(-1).reason,
    'up42-scenes',
  );
  layer.destroy(view);
  const own = [];
  const custom = createApplicationUp42Scenes({
    source: fakeSource(calls),
    requestRender: (reason) => own.push(reason),
  });
  const other = viewer();
  custom.init(other);
  custom.enable(other);
  await custom.update(other);
  const count = frames.length;
  await custom.getRowControls().chips[0].onClick();
  assert.deepEqual(own, ['up42-scenes']);
  assert.equal(frames.length, count);
  custom.destroy(other);
});

test('[up42-scenes-layer-034] puts the layer in the Cameras group right after skyfi-scenes', () => {
  const text = readFileSync(
    fileURLToPath(new URL('../../ui/layerPanel.js', import.meta.url)),
    'utf8',
  );
  const group = /label: msg\('Cameras'\),\s*ids: \[([^\]]*)\]/.exec(text);
  assert.notEqual(group, null);
  const ids = [...group[1].matchAll(/'([^']+)'/g)].map((match) => match[1]);
  assert.equal(ids.indexOf('up42-scenes'), ids.indexOf('skyfi-scenes') + 1);
  assert.equal(ids.indexOf('skyfi-scenes') >= 0, true);
  assert.deepEqual(ids.slice(-3), [
    'street-level',
    'beemaps',
    'beemaps-bursts',
  ]);
});

test('[up42-scenes-layer-035] keeps the layer out of voice', () => {
  assert.equal(
    VOICE_OFF_LAYERS['up42-scenes'],
    'The UP42 layer has no voice tools.',
  );
});

test('[up42-scenes-layer-036] names UP42, links to up42.com and gives the sentence about the terms', () => {
  const credit = DATA_CREDITS.find(({ key }) => key === 'up42-scenes');
  assert.notEqual(credit, undefined);
  for (const text of [
    'UP42',
    'href="https://up42.com/"',
    'UP42 terms do not address the display of previews. Use the data for yourself only.',
  ])
    assert.equal(credit.html.includes(text), true, text);
});

test('[up42-scenes-layer-037] gives the Spanish and the Russian name of the layer', (t) => {
  assert.equal(readLocale('es')['UP42 Scenes'], 'Escenas de UP42');
  assert.equal(readLocale('ru')['UP42 Scenes'], 'Сцены UP42');
  const before = getLocale();
  t.after(() => setLocale(before));
  setLocale('es');
  assert.equal(layerNameForId('up42-scenes'), 'Escenas de UP42');
  setLocale('en');
  assert.equal(layerNameForId('up42-scenes'), 'UP42 Scenes');
});

test('[up42-scenes-layer-037] gives the Spanish and the Russian label of the list', (t) => {
  assert.equal(readLocale('es')['UP42 scenes'], 'Escenas de UP42');
  assert.equal(readLocale('ru')['UP42 scenes'], 'Сцены UP42');
  const before = getLocale();
  t.after(() => setLocale(before));
  const answer = {
    scenes: [ANSWER.scenes[0]],
    count: 1,
    truncated: false,
    partial: false,
    used: 1,
    limit: 20,
  };
  setLocale('es');
  assert.equal(
    sceneList({ answer, selectedId: null }).ariaLabel,
    'Escenas de UP42',
  );
  setLocale('ru');
  assert.equal(sceneList({ answer, selectedId: null }).ariaLabel, 'Сцены UP42');
  setLocale('en');
  assert.equal(
    sceneList({ answer, selectedId: null }).ariaLabel,
    'UP42 scenes',
  );
});

test('[up42-scenes-layer-037] gives both Chinese names for the shipped catalogs', () => {
  assert.equal(readLocale('zh-CN')['UP42 Scenes'], 'UP42 影像场景');
  assert.equal(readLocale('zh-CN')['UP42 scenes'], 'UP42 影像场景');
  assert.equal(readLocale('zh-Hant')['UP42 Scenes'], 'UP42 影像場景');
  assert.equal(readLocale('zh-Hant')['UP42 scenes'], 'UP42 影像場景');
});

test('[up42-scenes-layer-041] keeps 42 catalog layers with full, absent and changed sources', (t) => {
  const lifetime = new AbortController();
  t.after(() => lifetime.abort());
  const sources = createStandaloneLayerSources();
  assert.equal(catalogOf(sources, lifetime.signal).layers.length, 42);
  delete sources.mapillary;
  assert.equal(catalogOf(sources, lifetime.signal).layers.length, 42);
  assert.equal(catalogOf({}, lifetime.signal).layers.length, 42);
  const changed = createApplicationCatalog({
    sources,
    signal: lifetime.signal,
    surface: createSurfaceServices({
      terrainSource: { getHeights: async () => [] },
      signal: lifetime.signal,
      eventTarget: null,
    }),
    streetLevelProviders: [
      fakeStreetLevelProvider({ id: 'example', pickPrefix: 'example:' }),
    ],
  });
  assert.equal(changed.layers.length, 42);
  assert.deepEqual(changed.get('street-level').providerIds, ['example']);
});

test('[up42-scenes-layer-041] keeps all 13 reference source keys in order', () => {
  assert.deepEqual(Object.keys(createReferenceSources()), [
    'earthquakes',
    'air-quality',
    'fire-perimeters',
    'cables',
    'reticulum',
    'beemaps',
    'beemaps-bursts',
    'gnss-integrity',
    'gdacs',
    'skywatch-scenes',
    'planet-scenes',
    'skyfi-scenes',
    'up42-scenes',
  ]);
});

test('[up42-scenes-layer-041] keeps 41 registry and ledger entries and refuses the free token 05', () => {
  assert.equal(REGISTERED_LAYER_IDS.length, 41);
  assert.equal(new Set(REGISTERED_LAYER_IDS).size, 41);
  assert.equal(LAYER_STATE_REGISTRY.length, 41);
  assert.equal(Object.keys(LAYER_STATE_TOKEN_RESERVATIONS).length, 41);
  assert.equal(LAYER_STATE_TOKEN_RESERVATIONS['up42-scenes'], '04');
  const rows = JSON.parse(
    readFileSync(
      new URL('../../data/layerStateTokenReservations.json', import.meta.url),
      'utf8',
    ),
  );
  assert.equal(rows.length, 41);
  assert.deepEqual(
    rows.filter(([id]) => id === 'up42-scenes'),
    [['up42-scenes', '04']],
  );
  assert.equal(nextLayerStateToken(), '05');
  assert.equal(decodeLayerStateParams(new URLSearchParams('v=2&l=05')), null);
  assert.equal(decodeLayerStateParams(new URLSearchParams('v=2&l=c.05')), null);
  const source = readFileSync(
    new URL('../../data/layerState.js', import.meta.url),
    'utf8',
  );
  assert.equal(
    source.split(
      "  Object.freeze({\n    id: 'up42-scenes',\n    token: '04',\n    disposition: 'enabled-only',\n  }),\n",
    ).length,
    2,
  );
});

test('[up42-quote-panel-010] lists the five methods in the contract and in the reference source', () => {
  const methods = [
    'getStatus',
    'searchScenes',
    'getThumbnail',
    'getProducts',
    'getQuote',
  ];
  assert.deepEqual(CATALOG_SOURCE_CONTRACTS['up42-scenes'].methods, methods);
  const source = createReferenceSources()['up42-scenes'];
  for (const method of methods) assert.equal(typeof source[method], 'function');
});
