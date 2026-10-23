import { governorRequestRender } from '../../renderGovernor.js';
import { createSceneLayer } from '../../layers/sceneLayer/index.js';
import { overlayHost } from './overlayHost.js';

/**
 * Wire the scene layer of one service ("planet" or "skyfi") to its source, the
 * overlay host and the render governor.
 */
export function createApplicationSceneLayer(service, options) {
  return createSceneLayer(service, {
    overlayHost,
    requestRender: governorRequestRender,
    ...options,
  });
}
