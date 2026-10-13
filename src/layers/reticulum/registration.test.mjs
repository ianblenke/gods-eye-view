import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { createApplicationCatalog } from '../../app/constructCatalog.js';
import { createSurfaceServices } from '../../app/surfaceServices.js';
import { CATALOG_SOURCE_CONTRACTS } from '../../app/sourceComposition.js';
import { DATA_CREDITS } from '../../data/dataCredits.js';
import {
  LAYER_STATE_REGISTRY,
  decodeLayerStateParams,
} from '../../data/layerState.js';
import { createStandaloneLayerSources } from '../../standalone/layerSources.js';
import { createReferenceSources } from '../../sources/reference.js';
import { VOICE_OFF_LAYERS } from '../../voice/layerManifest.js';

const GOOD = {
  interfaces: [],
  meta: {
    unavailable: false,
    stale: false,
    reason: null,
    fetchedAt: null,
    total: 0,
  },
};
const FAKE_VIEWER = { dataSources: { add() {}, remove() {} } };

test('[reticulum-layer-017] registers the layer in the catalog, the source contract, the reference sources and the share link', async (t) => {
  const lifetime = new AbortController();
  t.after(() => lifetime.abort());
  const catalogOf = (sources) =>
    createApplicationCatalog({
      sources,
      signal: lifetime.signal,
      surface: createSurfaceServices({
        terrainSource: { getHeights: async () => [] },
        signal: lifetime.signal,
        eventTarget: null,
      }),
    });
  const catalog = catalogOf(createStandaloneLayerSources());
  assert.equal(catalog.get('reticulum').name, 'Reticulum Network');
  const ids = catalog.layers.map((layer) => layer.id);
  assert.equal(ids.indexOf('reticulum'), ids.indexOf('earthquakes') + 1);
  assert.deepEqual(CATALOG_SOURCE_CONTRACTS.reticulum.layers, ['reticulum']);
  assert.deepEqual(CATALOG_SOURCE_CONTRACTS.reticulum.methods, ['getSnapshot']);

  const calls = [];
  const supplied = createStandaloneLayerSources();
  supplied.reticulum = {
    getSnapshot: async (options) => {
      calls.push(options);
      return GOOD;
    },
  };
  const wired = catalogOf(supplied).get('reticulum');
  wired.init(FAKE_VIEWER);
  wired.enable(FAKE_VIEWER);
  assert.equal(await wired.update(FAKE_VIEWER), true);
  assert.equal(calls.length, 1);
  wired.destroy(FAKE_VIEWER);

  const bare = createStandaloneLayerSources();
  delete bare.reticulum;
  const missing = catalogOf(bare).get('reticulum');
  missing.init(FAKE_VIEWER);
  missing.enable(FAKE_VIEWER);
  assert.equal(await missing.update(FAKE_VIEWER), false);
  assert.equal(
    missing.getStats().error,
    'Data source not configured: reticulum',
  );
  missing.destroy(FAKE_VIEWER);

  const sources = createReferenceSources();
  assert.equal(typeof sources.reticulum.getSnapshot, 'function');
  assert.notEqual(sources.reticulum, createReferenceSources().reticulum);
  const entry = LAYER_STATE_REGISTRY.find(({ id }) => id === 'reticulum');
  assert.equal(entry.token, '4');
  assert.equal(entry.disposition, 'enabled-only');
  assert.deepEqual(
    decodeLayerStateParams(new URLSearchParams('v=2&l=4')).enabledLayerIds,
    ['reticulum'],
  );
});

test('[reticulum-layer-018] puts the layer at the end of the Infrastructure group of the panel', () => {
  const text = readFileSync(
    fileURLToPath(new URL('../../ui/layerPanel.js', import.meta.url)),
    'utf8',
  );
  const group = /label: 'Infrastructure',\s*ids: \[([^\]]*)\]/.exec(text);
  assert.ok(group);
  const ids = [...group[1].matchAll(/'([^']+)'/g)].map((match) => match[1]);
  assert.deepEqual(ids.slice(-2), ['local-dams', 'reticulum']);
});

test('[reticulum-layer-019] keeps the layer out of voice', () => {
  assert.equal(
    VOICE_OFF_LAYERS.reticulum,
    'The Reticulum layer has no voice tools.',
  );
});

test('[reticulum-layer-020] credits the Reticulum network', () => {
  const credit = DATA_CREDITS.find(({ key }) => key === 'reticulum');
  assert.ok(credit);
  assert.ok(credit.html.includes('Reticulum network'));
  assert.ok(credit.html.includes('href="https://reticulum.network/"'));
});
