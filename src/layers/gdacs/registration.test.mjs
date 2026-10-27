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
import { getLocale, setLocale } from '../../i18n/index.js';
import { createStandaloneLayerSources } from '../../standalone/layerSources.js';
import { createReferenceSources } from '../../sources/reference.js';
import { layerNameForId } from '../../ui/layerNames.js';
import { VOICE_OFF_LAYERS } from '../../voice/layerManifest.js';

const GOOD = {
  events: [],
  meta: {
    unavailable: false,
    stale: false,
    reason: null,
    fetchedAt: null,
    total: 0,
  },
};
const FAKE_VIEWER = { dataSources: { add() {}, remove() {} } };
const readLocale = (code) =>
  JSON.parse(
    readFileSync(
      fileURLToPath(
        new URL(`../../i18n/locales/${code}.json`, import.meta.url),
      ),
      'utf8',
    ),
  );

test('[gdacs-layer-018] registers the layer in the catalog, the source contract, the reference sources and the share link', async (t) => {
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
  assert.equal(catalog.get('gdacs').name, 'Disaster Alerts');
  const ids = catalog.layers.map((layer) => layer.id);
  assert.equal(ids.indexOf('gdacs'), ids.indexOf('gnss-integrity') + 1);
  assert.deepEqual(CATALOG_SOURCE_CONTRACTS.gdacs.layers, ['gdacs']);
  assert.deepEqual(CATALOG_SOURCE_CONTRACTS.gdacs.methods, ['getSnapshot']);

  const calls = [];
  const supplied = createStandaloneLayerSources();
  supplied.gdacs = {
    getSnapshot: async (options) => {
      calls.push(options);
      return GOOD;
    },
  };
  const wired = catalogOf(supplied).get('gdacs');
  wired.init(FAKE_VIEWER);
  wired.enable(FAKE_VIEWER);
  assert.equal(await wired.update(FAKE_VIEWER), true);
  assert.equal(calls.length, 1);
  wired.destroy(FAKE_VIEWER);

  const bare = createStandaloneLayerSources();
  delete bare.gdacs;
  const missing = catalogOf(bare).get('gdacs');
  missing.init(FAKE_VIEWER);
  missing.enable(FAKE_VIEWER);
  assert.equal(await missing.update(FAKE_VIEWER), false);
  assert.equal(missing.getStats().error, 'Data source not configured: gdacs');
  missing.destroy(FAKE_VIEWER);

  const sources = createReferenceSources();
  assert.equal(typeof sources.gdacs.getSnapshot, 'function');
  assert.notEqual(sources.gdacs, createReferenceSources().gdacs);
  const entry = LAYER_STATE_REGISTRY.find(({ id }) => id === 'gdacs');
  assert.equal(entry.token, '9');
  assert.equal(entry.disposition, 'enabled-only');
  assert.deepEqual(
    decodeLayerStateParams(new URLSearchParams('v=2&l=9')).enabledLayerIds,
    ['gdacs'],
  );
});

test('[gdacs-layer-019] puts the layer at the end of the Events group of the panel', () => {
  const text = readFileSync(
    fileURLToPath(new URL('../../ui/layerPanel.js', import.meta.url)),
    'utf8',
  );
  const group = /label: msg\('Events'\),\s*ids: \[([^\]]*)\]/.exec(text);
  assert.notEqual(group, null);
  const ids = [...group[1].matchAll(/'([^']+)'/g)].map((match) => match[1]);
  assert.deepEqual(ids.slice(-2), ['s2-ghostmaps', 'gdacs']);
});

test('[gdacs-layer-020] keeps the layer out of voice', () => {
  assert.equal(VOICE_OFF_LAYERS.gdacs, 'The GDACS layer has no voice tools.');
});

test('[gdacs-layer-021] names GDACS and its two partners and gives the disclaimer of the estimates', () => {
  const credit = DATA_CREDITS.find(({ key }) => key === 'gdacs');
  assert.notEqual(credit, undefined);
  for (const text of [
    'GDACS',
    'United Nations',
    'European Commission',
    'The estimates of GDACS come from a machine, and an estimate can be wrong.',
    'Check each estimate before you use it to make a decision.',
    'href="https://www.gdacs.org/"',
  ])
    assert.equal(credit.html.includes(text), true, text);
});

test('[gdacs-layer-022] gives the Spanish and the Russian texts of the layer', (t) => {
  const es = readLocale('es');
  const ru = readLocale('ru');
  assert.equal(es['Disaster Alerts'], 'Alertas de desastres');
  assert.equal(ru['Disaster Alerts'], 'Оповещения о бедствиях');
  assert.equal(es['GDACS source unavailable'], 'Fuente de GDACS no disponible');
  assert.equal(ru['GDACS source unavailable'], 'Источник GDACS недоступен');
  assert.equal(es['GDACS unavailable'], 'GDACS no disponible');
  assert.equal(ru['GDACS unavailable'], 'GDACS недоступен');
  const before = getLocale();
  t.after(() => setLocale(before));
  setLocale('es');
  assert.equal(layerNameForId('gdacs'), 'Alertas de desastres');
  setLocale('en');
  assert.equal(layerNameForId('gdacs'), 'Disaster Alerts');
});
