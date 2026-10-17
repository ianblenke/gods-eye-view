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

const FAKE_VIEWER = { dataSources: { add() {}, remove() {} } };

test('[beemaps-frames-024] registers the layer in the catalog, the source contract, the reference sources and the share link', async (t) => {
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
  assert.equal(catalog.get('beemaps').name, 'Bee Maps Frames');
  const ids = catalog.layers.map((layer) => layer.id);
  assert.equal(ids.indexOf('beemaps'), ids.indexOf('reticulum') + 1);
  assert.deepEqual(CATALOG_SOURCE_CONTRACTS.beemaps.layers, ['beemaps']);
  assert.deepEqual(CATALOG_SOURCE_CONTRACTS.beemaps.methods, [
    'getStatus',
    'getFrames',
  ]);

  const sources = createReferenceSources();
  assert.equal(typeof sources.beemaps.getStatus, 'function');
  assert.equal(typeof sources.beemaps.getFrames, 'function');
  assert.notEqual(sources.beemaps, createReferenceSources().beemaps);
  const entry = LAYER_STATE_REGISTRY.find(({ id }) => id === 'beemaps');
  assert.equal(entry.token, '5');
  assert.equal(entry.disposition, 'enabled-only');
  assert.deepEqual(
    decodeLayerStateParams(new URLSearchParams('v=2&l=5')).enabledLayerIds,
    ['beemaps'],
  );
});

test('[beemaps-frames-024] gives the layer the status of its supplied source and no frame request on enable', async (t) => {
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
  const calls = { getStatus: 0, getFrames: 0 };
  const supplied = createStandaloneLayerSources();
  supplied.beemaps = {
    getStatus: async () => {
      calls.getStatus++;
      return { ok: true, configured: true };
    },
    getFrames: async () => {
      calls.getFrames++;
      return { ok: false, status: 500, error: 'unknown' };
    },
  };
  const wired = catalogOf(supplied).get('beemaps');
  wired.init(FAKE_VIEWER);
  wired.enable(FAKE_VIEWER);
  assert.equal(await wired.update(FAKE_VIEWER), true);
  assert.deepEqual(calls, { getStatus: 1, getFrames: 0 });
  wired.destroy(FAKE_VIEWER);

  const bare = createStandaloneLayerSources();
  delete bare.beemaps;
  const missing = catalogOf(bare).get('beemaps');
  missing.init(FAKE_VIEWER);
  missing.enable(FAKE_VIEWER);
  assert.equal(await missing.update(FAKE_VIEWER), true);
  assert.equal(missing.getStats().error, 'Data source not configured: beemaps');
  missing.destroy(FAKE_VIEWER);
});

test('[beemaps-frames-024] ignores the parameters of the manager for the layer and sends no request', async (t) => {
  const lifetime = new AbortController();
  t.after(() => lifetime.abort());
  const calls = { getStatus: 0, getFrames: 0 };
  const sources = createStandaloneLayerSources();
  sources.beemaps = {
    getStatus: async () => {
      calls.getStatus++;
      return { ok: true, configured: true };
    },
    getFrames: async () => {
      calls.getFrames++;
      return { ok: false, status: 500, error: 'unknown' };
    },
  };
  const catalog = createApplicationCatalog({
    sources,
    signal: lifetime.signal,
    surface: createSurfaceServices({
      terrainSource: { getHeights: async () => [] },
      signal: lifetime.signal,
      eventTarget: null,
    }),
  });
  const manager = new DataLayerManager({});
  manager.register(catalog.get('beemaps'));
  manager.finalizeRegistrations(
    LAYER_STATE_REGISTRY.filter(({ id }) => id === 'beemaps'),
  );
  assert.equal(
    manager.setLayerParams('beemaps', { fetch: true, bbox: [0, 0, 1, 1] }),
    false,
  );
  assert.equal(
    manager.setLayerParams('beemaps', { fetch: true }, { origin: 'user' }),
    false,
  );
  assert.deepEqual(calls, { getStatus: 0, getFrames: 0 });
});

test('[beemaps-frames-025] puts the layer in the Cameras group of the panel, before the bursts layer', () => {
  const text = readFileSync(
    fileURLToPath(new URL('../../ui/layerPanel.js', import.meta.url)),
    'utf8',
  );
  const group = /label: msg\('Cameras'\),\s*ids: \[([^\]]*)\]/.exec(text);
  assert.ok(group);
  const ids = [...group[1].matchAll(/'([^']+)'/g)].map((match) => match[1]);
  assert.deepEqual(ids.slice(-3), [
    'street-level',
    'beemaps',
    'beemaps-bursts',
  ]);
});

test('[beemaps-frames-026] keeps the layer out of voice', () => {
  assert.equal(
    VOICE_OFF_LAYERS.beemaps,
    'The Bee Maps layer has no voice tools.',
  );
});

test('[beemaps-frames-027] credits Bee Maps', () => {
  const credit = DATA_CREDITS.find(({ key }) => key === 'beemaps');
  assert.ok(credit);
  assert.ok(credit.html.includes('Bee Maps'));
  assert.ok(credit.html.includes('href="https://beemaps.com/"'));
});
