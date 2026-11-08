import { governorRequestRender } from '../../renderGovernor.js';
import { createUp42ScenesLayer } from '../../layers/up42Scenes/index.js';
import { overlayHost } from './overlayHost.js';

/** Wire the UP42 scenes layer to its source, the overlay host and the render governor. */
export function createApplicationUp42Scenes(options) {
  return createUp42ScenesLayer({
    overlayHost,
    requestRender: governorRequestRender,
    ...options,
  });
}
