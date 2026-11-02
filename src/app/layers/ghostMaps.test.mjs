import test from 'node:test';
import assert from 'node:assert/strict';
import { createApplicationGhostMaps } from './ghostMaps.js';

function property(t, key, value) {
  const old = Object.getOwnPropertyDescriptor(globalThis, key);
  Object.defineProperty(globalThis, key, { configurable: true, value });
  t.after(() =>
    old ? Object.defineProperty(globalThis, key, old) : delete globalThis[key],
  );
}

test('[ghostmaps-035] The application factory accepts a source and host options', async () => {
  let catalogs = 0;
  let subscriptions = 0;
  const reads = [];
  const source = {
    getCatalog: async () => {
      catalogs++;
      return {
        commit: 'caller-head',
        products: [
          {
            id: 'border-crisis',
            title: 'Border Crisis Map',
            version: 'caller-version',
            defaultOn: true,
          },
        ],
      };
    },
    subscribe: () => {
      subscriptions++;
      return () => {};
    },
  };
  const layer = createApplicationGhostMaps({
    source,
    storage: {
      getItem: (key) => {
        reads.push(key);
        return key === 'gev.ghostmaps.products' ? '[]' : null;
      },
    },
    overlayHost: null,
  });
  assert.equal(layer.id, 's2-ghostmaps');
  layer.init({});
  layer.enable();
  assert.equal(await layer.update(), true);
  assert.equal(catalogs, 1);
  assert.deepEqual(reads, ['gev.ghostmaps.products']);
  assert.equal(subscriptions, 1);
  assert.equal(layer.getStats().commit, 'caller-head');
  assert.deepEqual(
    layer.getRowControls().chips.map(({ id, active }) => [id, active]),
    [['border-crisis', false]],
  );
  layer.destroy();
});

test('[ghostmaps-035] The application factory creates the standard input handler', (t) => {
  const events = [];
  const target = {
    addEventListener: (name) => events.push(name),
    removeEventListener() {},
  };
  const canvas = { ...target, ownerDocument: target, disableRootEvents: true };
  property(t, 'document', target);
  const layer = createApplicationGhostMaps({
    source: { getCatalog: async () => ({ products: [] }) },
    storage: null,
    overlayHost: { setEntries() {} },
    picking: { registerPickOwner() {}, unregisterPickOwner() {} },
  });
  layer.init({ scene: { canvas, requestRender() {} } });
  assert.deepEqual(events, []);
  layer.enable();
  assert.ok(events.includes('mousedown') || events.includes('pointerdown'));
  layer.destroy();
});
