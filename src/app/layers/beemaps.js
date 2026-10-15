import { createBeemapsLayer } from '../../layers/beemaps/index.js';

/** Wire the Bee Maps frames layer to its source. */
export function createApplicationBeemaps(options) {
  return createBeemapsLayer(options);
}
