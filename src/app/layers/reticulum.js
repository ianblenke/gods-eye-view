import { createReticulumLayer } from '../../layers/reticulum/index.js';
import { overlayHost } from './overlayHost.js';

/** Wire the Reticulum interfaces to the application overlay host. */
export function createApplicationReticulum(options) {
  return createReticulumLayer({ overlayHost, ...options });
}
