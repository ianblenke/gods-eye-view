import {
  createOshLayer as createLayer,
  createOshPanelHosts,
  createOshSource,
} from '../layers/osh/index.js';
export * from '../layers/osh/index.js';

/**
 * Wire the standalone source. The hosts are the elements of the panel, and the
 * other options go to the layer as they are.
 */
export function createOshLayer({
  source = createOshSource(),
  ...options
} = {}) {
  return createLayer({ source, ...options });
}
export default createOshLayer(createOshPanelHosts());
