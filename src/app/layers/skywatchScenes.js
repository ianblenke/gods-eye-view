import { governorRequestRender } from '../../renderGovernor.js';
import { createSkywatchScenesLayer } from '../../layers/skywatchScenes/index.js';
import { overlayHost } from './overlayHost.js';

/** Wire the SkyWatch scenes layer to its source, the overlay host and the render governor. */
export function createApplicationSkywatchScenes(options) {
  return createSkywatchScenesLayer({
    overlayHost,
    requestRender: governorRequestRender,
    ...options,
  });
}
