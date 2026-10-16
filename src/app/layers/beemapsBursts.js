import { governorRequestRender } from '../../renderGovernor.js';
import { createBeemapsBurstsLayer } from '../../layers/beemapsBursts/index.js';

/** Wire the Bee Maps bursts layer to its source and to the render governor. */
export function createApplicationBeemapsBursts(options) {
  return createBeemapsBurstsLayer({
    requestRender: governorRequestRender,
    ...options,
  });
}
