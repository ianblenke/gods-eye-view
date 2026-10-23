import test from 'node:test';
import assert from 'node:assert/strict';
import { createReferenceSources } from './reference.js';
import { createStandaloneReferenceSources } from '../standalone/layerSources.js';

test('reference factories retain compatibility without starting acquisition or sharing instances', (t) => {
  let requests = 0;
  t.mock.method(globalThis, 'fetch', () => {
    requests++;
    throw new Error('unexpected acquisition');
  });
  assert.equal(createReferenceSources, createStandaloneReferenceSources);
  const first = createReferenceSources();
  const second = createReferenceSources();
  assert.deepEqual(Object.keys(first), [
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
  ]);
  assert.notEqual(first.earthquakes, second.earthquakes);
  assert.notEqual(first['air-quality'], second['air-quality']);
  assert.notEqual(first['fire-perimeters'], second['fire-perimeters']);
  assert.notEqual(first.cables, second.cables);
  assert.notEqual(first.reticulum, second.reticulum);
  assert.notEqual(first.beemaps, second.beemaps);
  assert.notEqual(first['beemaps-bursts'], second['beemaps-bursts']);
  assert.notEqual(first['gnss-integrity'], second['gnss-integrity']);
  assert.equal(typeof first.earthquakes.getSnapshot, 'function');
  assert.equal(typeof first['air-quality'].getSnapshot, 'function');
  assert.equal(typeof first['fire-perimeters'].getSnapshot, 'function');
  assert.equal(typeof first.cables.fetch, 'function');
  assert.equal(typeof first.reticulum.getSnapshot, 'function');
  assert.equal(typeof first.beemaps.getStatus, 'function');
  assert.equal(typeof first.beemaps.getFrames, 'function');
  assert.equal(typeof first['beemaps-bursts'].getStatus, 'function');
  assert.equal(typeof first['beemaps-bursts'].quote, 'function');
  assert.equal(typeof first['beemaps-bursts'].confirm, 'function');
  assert.equal(typeof first['beemaps-bursts'].list, 'function');
  assert.equal(typeof first['gnss-integrity'].getSnapshot, 'function');
  assert.equal(requests, 0);
});
