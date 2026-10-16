import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { createApplicationCatalog } from '../../app/constructCatalog.js';
import { createSurfaceServices } from '../../app/surfaceServices.js';
import { CATALOG_SOURCE_CONTRACTS } from '../../app/sourceComposition.js';
import { DATA_CREDITS } from '../../data/dataCredits.js';
import { DataLayerManager } from '../../data/manager.js';
import {
  LAYER_STATE_REGISTRY,
  decodeLayerStateParams,
} from '../../data/layerState.js';
import { createStandaloneLayerSources } from '../../standalone/layerSources.js';
import { createReferenceSources } from '../../sources/reference.js';
import { VOICE_OFF_LAYERS } from '../../voice/layerManifest.js';
import { installRenderGovernor } from '../../renderGovernor.js';
import { createApplicationBeemapsBursts } from '../../app/layers/beemapsBursts.js';

const FAKE_VIEWER = { dataSources: { add() {}, remove() {} } };

const catalogOf = (sources, lifetime) =>
  createApplicationCatalog({
    sources,
    signal: lifetime.signal,
    surface: createSurfaceServices({
      terrainSource: { getHeights: async () => [] },
      signal: lifetime.signal,
      eventTarget: null,
    }),
  });

test('[beemaps-bursts-028] registers the layer in the catalog, the source contract, the reference sources and the share link', (t) => {
  const lifetime = new AbortController();
  t.after(() => lifetime.abort());
  const catalog = catalogOf(createStandaloneLayerSources(), lifetime);
  assert.equal(catalog.get('beemaps-bursts').name, 'Bee Maps Bursts');
  const ids = catalog.layers.map((layer) => layer.id);
  assert.equal(ids.indexOf('beemaps-bursts'), ids.indexOf('beemaps') + 1);
  assert.deepEqual(CATALOG_SOURCE_CONTRACTS['beemaps-bursts'].layers, [
    'beemaps-bursts',
  ]);
  assert.deepEqual(CATALOG_SOURCE_CONTRACTS['beemaps-bursts'].methods, [
    'getStatus',
    'quote',
    'confirm',
    'list',
  ]);

  const sources = createReferenceSources();
  for (const name of ['getStatus', 'quote', 'confirm', 'list']) {
    assert.equal(typeof sources['beemaps-bursts'][name], 'function', name);
  }
  assert.notEqual(
    sources['beemaps-bursts'],
    createReferenceSources()['beemaps-bursts'],
  );
  const entry = LAYER_STATE_REGISTRY.find(({ id }) => id === 'beemaps-bursts');
  assert.deepEqual(entry, {
    id: 'beemaps-bursts',
    token: '6',
    disposition: 'enabled-only',
  });
});

test('[beemaps-bursts-028] puts the layer in the Cameras group of the panel after the frames layer', () => {
  const text = readFileSync(
    fileURLToPath(new URL('../../ui/layerPanel.js', import.meta.url)),
    'utf8',
  );
  const group = /label: 'Cameras',\s*ids: \[([^\]]*)\]/.exec(text);
  assert.ok(group);
  const ids = [...group[1].matchAll(/'([^']+)'/g)].map((match) => match[1]);
  assert.equal(ids.indexOf('beemaps-bursts'), ids.indexOf('beemaps') + 1);
  assert.equal(ids.at(-1), 'beemaps-bursts');
});

test('[beemaps-bursts-028] keeps the layer out of voice', () => {
  assert.equal(
    VOICE_OFF_LAYERS['beemaps-bursts'],
    'The Bee Maps bursts layer has no voice tools.',
  );
});

test('[beemaps-bursts-028] credits Bee Maps', () => {
  const credit = DATA_CREDITS.find(({ key }) => key === 'beemaps-bursts');
  assert.ok(credit);
  assert.ok(credit.html.includes('Bee Maps'));
  assert.ok(credit.html.includes('href="https://beemaps.com/"'));
});

test('[beemaps-bursts-003] sends no quote, confirm or list request when the share link enables the layer', async (t) => {
  const lifetime = new AbortController();
  t.after(() => lifetime.abort());
  const calls = { getStatus: 0, quote: 0, confirm: 0, list: 0 };
  const sources = createStandaloneLayerSources();
  sources['beemaps-bursts'] = {
    getStatus: async () => {
      calls.getStatus++;
      return { ok: true, enabled: true, configured: true };
    },
    quote: async () => {
      calls.quote++;
      return { ok: false, status: 500, error: 'unknown' };
    },
    confirm: async () => {
      calls.confirm++;
      return { outcome: 'unknown', status: 500 };
    },
    list: async () => {
      calls.list++;
      return { ok: false, status: 500, error: 'unknown' };
    },
  };
  const catalog = catalogOf(sources, lifetime);
  const manager = new DataLayerManager(FAKE_VIEWER);
  manager.register(catalog.get('beemaps-bursts'));
  manager.finalizeRegistrations(
    LAYER_STATE_REGISTRY.filter(({ id }) => id === 'beemaps-bursts'),
  );
  t.after(() =>
    manager.restoreLayerState('beemaps-bursts', { enabled: false }),
  );
  const restored = decodeLayerStateParams(new URLSearchParams('v=2&l=6'));
  assert.deepEqual(restored.enabledLayerIds, ['beemaps-bursts']);
  for (const id of restored.enabledLayerIds) {
    const result = await manager.restoreLayerState(
      id,
      { enabled: true },
      { origin: 'share-restore' },
    );
    assert.equal(result.succeeded, true);
  }
  assert.deepEqual([calls.quote, calls.confirm, calls.list], [0, 0, 0]);
  assert.ok(calls.getStatus >= 1);
  assert.equal(
    manager.setLayerParams('beemaps-bursts', { confirm: true }),
    false,
  );
  assert.equal(
    manager.setLayerParams(
      'beemaps-bursts',
      { quoteId: 'a1b2c3d4e5f60718293a4b5c6d7e8f90' },
      { origin: 'user' },
    ),
    false,
  );
  assert.deepEqual([calls.quote, calls.confirm, calls.list], [0, 0, 0]);
});

test('[beemaps-bursts-020] gives the layer of the application the render governor, so a press asks the scene for a frame', async (t) => {
  const frames = [];
  installRenderGovernor({
    scene: { requestRender: () => frames.push('frame') },
  });
  const source = {
    getStatus: async () => ({ ok: true, enabled: true, configured: true }),
    quote: async () => ({ ok: false, status: 429, error: 'rate_limited' }),
    confirm: async () => ({ outcome: 'unknown', status: 0 }),
    list: async () => ({ ok: true, bursts: [], total: 0, cached: false }),
  };
  const layer = createApplicationBeemapsBursts({ source });
  layer.init({ dataSources: { add() {}, remove() {} } });
  layer.enable();
  t.after(() => layer.destroy({ dataSources: { add() {}, remove() {} } }));
  const before = frames.length;
  await layer.getRowControls().chips[1].onClick();
  assert.equal(frames.length, before + 1);
  const own = [];
  const custom = createApplicationBeemapsBursts({
    source,
    requestRender: (reason) => own.push(reason),
  });
  custom.init({ dataSources: { add() {}, remove() {} } });
  custom.enable();
  await custom.getRowControls().chips[1].onClick();
  assert.deepEqual(own, ['beemaps-bursts']);
  custom.destroy({ dataSources: { add() {}, remove() {} } });
});
