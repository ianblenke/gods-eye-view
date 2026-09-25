import test from 'node:test';
import assert from 'node:assert/strict';
import { createSurfaceServices } from '../surfaceServices.js';
import { createApplicationCatalog } from '../constructCatalog.js';
import { createApplicationOsh } from './osh.js';
import { createStandaloneLayerSources } from '../../standalone/layerSources.js';

/** A terrain source that answers every point with one ellipsoidal height. */
function fixtureSurface(signal) {
  return createSurfaceServices({
    terrainSource: {
      getHeights: async (chunk) => chunk.map(() => ({ ellipsoid: 0 })),
    },
    signal,
    eventTarget: null,
  });
}

test('[osh-095] builds the OSH systems layer in the application catalog right after the recent-imagery layer', (t) => {
  const lifetime = new AbortController();
  t.after(() => lifetime.abort());
  const catalog = createApplicationCatalog({
    sources: createStandaloneLayerSources(),
    signal: lifetime.signal,
    surface: fixtureSurface(lifetime.signal),
  });
  const ids = catalog.layers.map((layer) => layer.id);
  assert.equal(ids.filter((id) => id === 'osh-systems').length, 1);
  assert.equal(ids.indexOf('osh-systems'), ids.indexOf('recent-imagery') + 1);
  assert.deepEqual(catalog.metadata.find(({ id }) => id === 'osh-systems'), { id: 'osh-systems', token: '3', disposition: 'enabled-only' });
  assert.equal(createApplicationOsh().id, 'osh-systems');
});
