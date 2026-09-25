import {
  createOshLayer,
  createOshPanelHosts,
  createOshSource,
} from '../../layers/osh/index.js';

/**
 * Construct one OpenSensorHub layer for this catalog. The layer reads the
 * same-origin `/api/osh/*` routes and finds the panel of the page by its ids.
 * @returns {object} A fresh layer instance for this catalog.
 */
export function createApplicationOsh() {
  return createOshLayer({
    source: createOshSource(),
    ...createOshPanelHosts(),
  });
}
