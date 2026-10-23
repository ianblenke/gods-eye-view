import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import * as Cesium from 'cesium';
import { createApplicationCatalog } from '../../app/constructCatalog.js';
import { createApplicationSceneLayer } from '../../app/layers/sceneLayers.js';
import { CATALOG_SOURCE_CONTRACTS } from '../../app/sourceComposition.js';
import { createSurfaceServices } from '../../app/surfaceServices.js';
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
import {
  _resetRenderGovernorForTest,
  getRenderGovernorDiagnostics,
  installRenderGovernor,
} from '../../renderGovernor.js';
import { VOICE_OFF_LAYERS } from '../../voice/layerManifest.js';
import { modelFor } from './model.js';

const SERVICES = [
  {
    service: 'planet',
    layer: 'planet-scenes',
    name: 'Planet Scenes',
    list: 'Planet scenes',
    label: 'Planet',
    icon: '🪐',
    key: 'PLANET_API_KEY',
    thumbs: 'PLANET_THUMBNAILS',
    route: '/api/planet',
    token: '01',
    after: 'skywatch-scenes',
    panelAfter: 'skywatch-scenes',
    credit: [
      'Satellite scenes: Planet,',
      'Imagery © Planet Labs PBC.',
      'The terms of Planet allow you to view the data for yourself.',
      'Do not give other people access to this app.',
      'href="https://www.planet.com/"',
      '>planet.com</a>',
    ],
  },
  {
    service: 'skyfi',
    layer: 'skyfi-scenes',
    name: 'SkyFi Scenes',
    list: 'SkyFi scenes',
    label: 'SkyFi',
    icon: '🛰',
    key: 'SKYFI_API_KEY',
    thumbs: 'SKYFI_THUMBNAILS',
    route: '/api/skyfi',
    token: '02',
    after: 'planet-scenes',
    panelAfter: 'planet-scenes',
    credit: [
      'Satellite scenes: SkyFi,',
      'The terms of SkyFi give a personal and non-commercial license, so use the data for yourself only.',
      'Each scene comes from a satellite provider that the list names.',
      'href="https://skyfi.com/"',
      '>skyfi.com</a>',
    ],
  },
];

for (const S of SERVICES) {
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
        rings: [RING],
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

  test(`[scene-layers-031] ${S.label}: registers the layer in the catalog, the source contract, the reference sources and the share link`, (t) => {
    const lifetime = new AbortController();
    t.after(() => lifetime.abort());
    const catalog = catalogOf(createStandaloneLayerSources(), lifetime.signal);
    assert.equal(catalog.get(`${S.layer}`).name, `${S.name}`);
    const ids = catalog.layers.map((layer) => layer.id);
    assert.equal(ids.indexOf(`${S.layer}`), ids.indexOf(S.after) + 1);
    assert.deepEqual(CATALOG_SOURCE_CONTRACTS[`${S.layer}`].layers, [
      `${S.layer}`,
    ]);
    assert.deepEqual(CATALOG_SOURCE_CONTRACTS[`${S.layer}`].methods, [
      'getStatus',
      'searchScenes',
      'getThumbnail',
    ]);
    const sources = createReferenceSources();
    for (const method of ['getStatus', 'searchScenes', 'getThumbnail'])
      assert.equal(typeof sources[`${S.layer}`][method], 'function');
    assert.notEqual(
      sources[`${S.layer}`],
      createReferenceSources()[`${S.layer}`],
    );
    assert.deepEqual(
      LAYER_STATE_REGISTRY.find(({ id }) => id === `${S.layer}`),
      { id: `${S.layer}`, token: S.token, disposition: 'enabled-only' },
    );
    assert.deepEqual(
      decodeLayerStateParams(new URLSearchParams(`v=2&l=${S.token}`))
        .enabledLayerIds,
      [`${S.layer}`],
    );
  });

  test(`[scene-layers-031] ${S.label}: gives the layer its supplied source, and the stats error of a catalog without the source`, async (t) => {
    const lifetime = new AbortController();
    t.after(() => lifetime.abort());
    const calls = { getStatus: 0, searchScenes: 0, getThumbnail: 0 };
    const supplied = createStandaloneLayerSources();
    supplied[`${S.layer}`] = fakeSource(calls);
    const wired = catalogOf(supplied, lifetime.signal).get(`${S.layer}`);
    const view = viewer();
    wired.init(view);
    wired.enable(view);
    assert.equal(await wired.update(view), true);
    assert.deepEqual(calls, { getStatus: 1, searchScenes: 0, getThumbnail: 0 });
    wired.destroy(view);

    const bare = createStandaloneLayerSources();
    delete bare[`${S.layer}`];
    const missing = catalogOf(bare, lifetime.signal).get(`${S.layer}`);
    const other = viewer();
    missing.init(other);
    missing.enable(other);
    assert.equal(await missing.update(other), true);
    assert.equal(
      missing.getStats().error,
      `Data source not configured: ${S.layer}`,
    );
    missing.destroy(other);
  });

  test(`[scene-layers-031] ${S.label}: selects a scene through setLayerParams of the manager with the origin user`, async (t) => {
    const lifetime = new AbortController();
    t.after(() => lifetime.abort());
    const calls = { getStatus: 0, searchScenes: 0, getThumbnail: 0 };
    const sources = createStandaloneLayerSources();
    sources[`${S.layer}`] = fakeSource(calls);
    const layer = catalogOf(sources, lifetime.signal).get(`${S.layer}`);
    const manager = new DataLayerManager({});
    manager.register(layer);
    manager.finalizeRegistrations(
      LAYER_STATE_REGISTRY.filter(({ id }) => id === `${S.layer}`),
    );
    const view = viewer();
    layer.init(view);
    layer.enable(view);
    await layer.update(view);
    assert.equal(
      manager.setLayerParams(
        `${S.layer}`,
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
      manager.setLayerParams(`${S.layer}`, item.params, { origin: 'user' }),
      true,
    );
    assert.equal(layer.getRowControls().list.items[0].active, true);
    assert.equal(
      manager.setLayerParams(
        `${S.layer}`,
        { scene: 'other' },
        { origin: 'user' },
      ),
      false,
    );
    layer.destroy(view);
  });

  test(`[scene-layers-031] ${S.label}: gives the layer of the application the render governor, and an option requestRender replaces it`, async (t) => {
    const frames = [];
    installRenderGovernor({
      scene: { requestRender: () => frames.push('frame') },
    });
    t.after(() => _resetRenderGovernorForTest());
    const calls = { getStatus: 0, searchScenes: 0, getThumbnail: 0 };
    const view = viewer();
    const layer = createApplicationSceneLayer(S.service, {
      source: fakeSource(calls),
    });
    layer.init(view);
    layer.enable(view);
    await layer.update(view);
    const before = frames.length;
    await layer.getRowControls().chips[0].onClick();
    assert.equal(calls.searchScenes, 1);
    assert.equal(frames.length, before + 1);
    assert.equal(
      getRenderGovernorDiagnostics().recentRequests.at(-1).reason,
      `${S.layer}`,
    );
    layer.destroy(view);
    const own = [];
    const custom = createApplicationSceneLayer(S.service, {
      source: fakeSource(calls),
      requestRender: (reason) => own.push(reason),
    });
    const other = viewer();
    custom.init(other);
    custom.enable(other);
    await custom.update(other);
    const count = frames.length;
    await custom.getRowControls().chips[0].onClick();
    assert.deepEqual(own, [`${S.layer}`]);
    assert.equal(frames.length, count);
    custom.destroy(other);
  });

  test(`[scene-layers-032] ${S.label}: puts the layer in the Cameras group right after the layer before it`, () => {
    const text = readFileSync(
      fileURLToPath(new URL('../../ui/layerPanel.js', import.meta.url)),
      'utf8',
    );
    const group = /label: msg\('Cameras'\),\s*ids: \[([^\]]*)\]/.exec(text);
    assert.notEqual(group, null);
    const ids = [...group[1].matchAll(/'([^']+)'/g)].map((match) => match[1]);
    assert.equal(ids.indexOf(`${S.layer}`), ids.indexOf(S.panelAfter) + 1);
    assert.equal(ids.indexOf('recent-imagery') >= 0, true);
    assert.deepEqual(ids.slice(-3), [
      'street-level',
      'beemaps',
      'beemaps-bursts',
    ]);
  });

  test(`[scene-layers-033] ${S.label}: keeps the layer out of voice`, () => {
    assert.equal(
      VOICE_OFF_LAYERS[`${S.layer}`],
      `The ${S.label} layer has no voice tools.`,
    );
  });

  test(`[scene-layers-034] ${S.label}: gives the credit text with the terms and the link`, () => {
    const credit = DATA_CREDITS.find(({ key }) => key === `${S.layer}`);
    assert.notEqual(credit, undefined);
    for (const text of S.credit)
      assert.equal(credit.html.includes(text), true, text);
  });

  test(`[scene-layers-035] ${S.label}: gives the Spanish and the Russian name of the layer`, (t) => {
    assert.equal(readLocale('es')[`${S.name}`], `Escenas de ${S.label}`);
    assert.equal(readLocale('ru')[`${S.name}`], `Сцены ${S.label}`);
    const before = getLocale();
    t.after(() => setLocale(before));
    setLocale('es');
    assert.equal(layerNameForId(`${S.layer}`), `Escenas de ${S.label}`);
    setLocale('en');
    assert.equal(layerNameForId(`${S.layer}`), `${S.name}`);
  });

  test(`[scene-layers-035] ${S.label}: gives the Spanish and the Russian label of the list`, (t) => {
    assert.equal(readLocale('es')[`${S.list}`], `Escenas de ${S.label}`);
    assert.equal(readLocale('ru')[`${S.list}`], `Сцены ${S.label}`);
    const before = getLocale();
    t.after(() => setLocale(before));
    const answer = {
      scenes: [ANSWER.scenes[0]],
      total: 1,
      truncated: false,
      used: 1,
      limit: 20,
    };
    setLocale('es');
    assert.equal(
      modelFor(S.service).sceneList({ answer, selectedId: null }).ariaLabel,
      `Escenas de ${S.label}`,
    );
    setLocale('ru');
    assert.equal(
      modelFor(S.service).sceneList({ answer, selectedId: null }).ariaLabel,
      `Сцены ${S.label}`,
    );
    setLocale('en');
    assert.equal(
      modelFor(S.service).sceneList({ answer, selectedId: null }).ariaLabel,
      `${S.list}`,
    );
  });

  test(`[scene-layers-031] ${S.label}: gives the reference source the routes of its own service`, async (t) => {
    const urls = [];
    t.mock.method(globalThis, 'fetch', async (url) => {
      urls.push(String(url));
      return new Response(JSON.stringify({ configured: true }), {
        status: 200,
      });
    });
    const source = createReferenceSources()[S.layer];
    assert.deepEqual(await source.getStatus(), { ok: true, configured: true });
    assert.deepEqual(urls, [`${S.route}/status`]);
  });
}
