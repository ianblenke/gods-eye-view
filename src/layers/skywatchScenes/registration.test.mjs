import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import * as Cesium from 'cesium';
import { createApplicationCatalog } from '../../app/constructCatalog.js';
import { createSurfaceServices } from '../../app/surfaceServices.js';
import { CATALOG_SOURCE_CONTRACTS } from '../../app/sourceComposition.js';
import { DATA_CREDITS } from '../../data/dataCredits.js';
import { DataLayerManager } from '../../data/manager.js';
import {
  LAYER_STATE_REGISTRY,
  decodeLayerStateParams,
} from '../../data/layerState.js';
import { getLocale, setLocale } from '../../i18n/index.js';
import { createStandaloneLayerSources } from '../../standalone/layerSources.js';
import { createReferenceSources } from '../../sources/reference.js';
import { layerNameForId } from '../../ui/layerNames.js';
import { VOICE_OFF_LAYERS } from '../../voice/layerManifest.js';

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
  total: 1,
  truncated: false,
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
});

test('[skywatch-scenes-layer-033] registers the layer in the catalog, the source contract, the reference sources and the share link', (t) => {
  const lifetime = new AbortController();
  t.after(() => lifetime.abort());
  const catalog = catalogOf(createStandaloneLayerSources(), lifetime.signal);
  assert.equal(catalog.get('skywatch-scenes').name, 'SkyWatch Scenes');
  const ids = catalog.layers.map((layer) => layer.id);
  assert.equal(ids.indexOf('skywatch-scenes'), ids.indexOf('gdacs') + 1);
  assert.deepEqual(CATALOG_SOURCE_CONTRACTS['skywatch-scenes'].layers, [
    'skywatch-scenes',
  ]);
  assert.deepEqual(CATALOG_SOURCE_CONTRACTS['skywatch-scenes'].methods, [
    'getStatus',
    'searchScenes',
    'getThumbnail',
  ]);
  const sources = createReferenceSources();
  for (const method of ['getStatus', 'searchScenes', 'getThumbnail'])
    assert.equal(typeof sources['skywatch-scenes'][method], 'function');
  assert.notEqual(
    sources['skywatch-scenes'],
    createReferenceSources()['skywatch-scenes'],
  );
  assert.deepEqual(
    LAYER_STATE_REGISTRY.find(({ id }) => id === 'skywatch-scenes'),
    { id: 'skywatch-scenes', token: '00', disposition: 'enabled-only' },
  );
  assert.deepEqual(
    decodeLayerStateParams(new URLSearchParams('v=2&l=00')).enabledLayerIds,
    ['skywatch-scenes'],
  );
});

test('[skywatch-scenes-layer-033] gives the layer its supplied source, and the stats error of a catalog without the source', async (t) => {
  const lifetime = new AbortController();
  t.after(() => lifetime.abort());
  const calls = { getStatus: 0, searchScenes: 0, getThumbnail: 0 };
  const supplied = createStandaloneLayerSources();
  supplied['skywatch-scenes'] = fakeSource(calls);
  const wired = catalogOf(supplied, lifetime.signal).get('skywatch-scenes');
  const view = viewer();
  wired.init(view);
  wired.enable(view);
  assert.equal(await wired.update(view), true);
  assert.deepEqual(calls, { getStatus: 1, searchScenes: 0, getThumbnail: 0 });
  wired.destroy(view);

  const bare = createStandaloneLayerSources();
  delete bare['skywatch-scenes'];
  const missing = catalogOf(bare, lifetime.signal).get('skywatch-scenes');
  const other = viewer();
  missing.init(other);
  missing.enable(other);
  assert.equal(await missing.update(other), true);
  assert.equal(
    missing.getStats().error,
    'Data source not configured: skywatch-scenes',
  );
  missing.destroy(other);
});

test('[skywatch-scenes-layer-033] selects a scene through setLayerParams of the manager with the origin user', async (t) => {
  const lifetime = new AbortController();
  t.after(() => lifetime.abort());
  const calls = { getStatus: 0, searchScenes: 0, getThumbnail: 0 };
  const sources = createStandaloneLayerSources();
  sources['skywatch-scenes'] = fakeSource(calls);
  const layer = catalogOf(sources, lifetime.signal).get('skywatch-scenes');
  const manager = new DataLayerManager({});
  manager.register(layer);
  manager.finalizeRegistrations(
    LAYER_STATE_REGISTRY.filter(({ id }) => id === 'skywatch-scenes'),
  );
  const view = viewer();
  layer.init(view);
  layer.enable(view);
  await layer.update(view);
  assert.equal(
    manager.setLayerParams(
      'skywatch-scenes',
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
    manager.setLayerParams('skywatch-scenes', item.params, { origin: 'user' }),
    true,
  );
  assert.equal(layer.getRowControls().list.items[0].active, true);
  assert.equal(
    manager.setLayerParams(
      'skywatch-scenes',
      { scene: 'other' },
      { origin: 'user' },
    ),
    false,
  );
  layer.destroy(view);
});

test('[skywatch-scenes-layer-034] puts the layer in the Cameras group right after recent-imagery', () => {
  const text = readFileSync(
    fileURLToPath(new URL('../../ui/layerPanel.js', import.meta.url)),
    'utf8',
  );
  const group = /label: msg\('Cameras'\),\s*ids: \[([^\]]*)\]/.exec(text);
  assert.notEqual(group, null);
  const ids = [...group[1].matchAll(/'([^']+)'/g)].map((match) => match[1]);
  assert.equal(
    ids.indexOf('skywatch-scenes'),
    ids.indexOf('recent-imagery') + 1,
  );
  assert.equal(ids.indexOf('recent-imagery') >= 0, true);
  assert.deepEqual(ids.slice(-3), [
    'street-level',
    'beemaps',
    'beemaps-bursts',
  ]);
});

test('[skywatch-scenes-layer-035] keeps the layer out of voice', () => {
  assert.equal(
    VOICE_OFF_LAYERS['skywatch-scenes'],
    'The SkyWatch layer has no voice tools.',
  );
});

test('[skywatch-scenes-layer-036] names SkyWatch EarthCache, links to skywatch.com and gives the sentence about the terms', () => {
  const credit = DATA_CREDITS.find(({ key }) => key === 'skywatch-scenes');
  assert.notEqual(credit, undefined);
  for (const text of [
    'SkyWatch EarthCache',
    'href="https://skywatch.com/"',
    'SkyWatch publishes no terms for the display of footprints or thumbnails, so use the data for yourself only.',
  ])
    assert.equal(credit.html.includes(text), true, text);
});

test('[skywatch-scenes-layer-037] gives the Spanish and the Russian name of the layer', (t) => {
  assert.equal(readLocale('es')['SkyWatch Scenes'], 'Escenas de SkyWatch');
  assert.equal(readLocale('ru')['SkyWatch Scenes'], 'Сцены SkyWatch');
  const before = getLocale();
  t.after(() => setLocale(before));
  setLocale('es');
  assert.equal(layerNameForId('skywatch-scenes'), 'Escenas de SkyWatch');
  setLocale('en');
  assert.equal(layerNameForId('skywatch-scenes'), 'SkyWatch Scenes');
});
