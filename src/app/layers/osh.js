import {
  createOshLayer,
  createOshPanelHosts,
  createOshSource,
} from '../../layers/osh/index.js';
import { createOshControlClient } from '../../layers/oshControl/client.js';
import { createOshCommandView } from '../../layers/oshControl/view.js';
import { overlayHost } from './overlayHost.js';

/**
 * Construct one OpenSensorHub layer for this catalog. The layer reads the
 * same-origin `/api/osh/*` routes and finds the panel of the page by its ids.
 * @param {object} [options] Replaces the wiring of the layer (tests).
 * @returns {object} A fresh layer instance for this catalog.
 */
export function createApplicationOsh(options) {
  const host = globalThis.document?.getElementById?.('osh-panel-control');
  return createOshLayer({
    source: createOshSource(),
    ...createOshPanelHosts(),
    overlayHost,
    commandView: host
      ? createOshCommandView({
          host,
          client: createOshControlClient({ fetchImpl: globalThis.fetch }),
          documentImpl: globalThis.document,
        })
      : null,
    ...options,
  });
}
