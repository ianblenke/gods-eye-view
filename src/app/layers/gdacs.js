import { createGdacsLayer } from '../../layers/gdacs/index.js';
import { overlayHost } from './overlayHost.js';

/** Wire the GDACS events to the application overlay host. */
export function createApplicationGdacs(options) {
  return createGdacsLayer({ overlayHost, ...options });
}
