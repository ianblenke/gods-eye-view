import assert from 'node:assert/strict';
import test from 'node:test';
import createOshLayer, { createOshLayer as createLayer } from './osh.js';
import { createOshSource } from '../layers/osh/index.js';

test('[osh-029] the default export is a wired OSH layer', () => {
  assert.equal(createOshLayer.id, 'osh-systems');
  assert.equal(typeof createOshLayer.init, 'function');
  assert.equal(typeof createOshLayer.update, 'function');
});

test('[osh-029] createOshLayer() wires a real source and a null detail host outside the browser', () => {
  const layer = createLayer();
  assert.equal(layer.id, 'osh-systems');
  assert.equal(typeof layer.getStats, 'function');
});

test('[osh-029] createOshLayer() accepts an injected source and detail host', () => {
  const source = createOshSource({ fetchImpl: async () => new Response('{}') });
  const detailHost = { innerHTML: '' };
  const layer = createLayer({ source, detailHost });
  assert.equal(layer.id, 'osh-systems');
});
