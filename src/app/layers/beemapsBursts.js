import { createBeemapsBurstsLayer } from '../../layers/beemapsBursts/index.js';

/** Wire the Bee Maps bursts layer to its source. */
export function createApplicationBeemapsBursts(options) {
  return createBeemapsBurstsLayer(options);
}
