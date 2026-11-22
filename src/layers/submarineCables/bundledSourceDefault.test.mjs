import test from 'node:test';
import assert from 'node:assert/strict';
import { createBundledCableSource } from './bundledSource.js';

test('[cable-bundled-source-001] the bundled source reads both files with the global fetch when it is given none', async (t) => {
  const urls = [];
  t.mock.method(globalThis, 'fetch', async (url) => {
    urls.push(String(url));
    return { ok: true, json: async () => ({ type: 'FeatureCollection', features: [] }) };
  });
  const snapshot = await createBundledCableSource().fetch();
  assert.equal(urls.length, 2);
  assert.ok(urls[0].endsWith('/cable-geo.json'));
  assert.ok(urls[1].endsWith('/landing-point-geo.json'));
  assert.ok(snapshot);
});
