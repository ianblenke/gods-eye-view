import {
  createOshLayer as createLayer,
  createOshSource,
} from '../layers/osh/index.js';
export * from '../layers/osh/index.js';

/**
 * Find the elements of the OSH panel in a page (osh-089): the panel, the host
 * of the detail and the host of the video. A host is null when the page has
 * no document, or no element with its id.
 * @param {?{getElementById?: Function}} [documentLike]
 * @returns {{panelHost: ?object, detailHost: ?object, videoHost: ?object}}
 */
export function createOshPanelHosts(documentLike = globalThis.document) {
  const find = (id) => documentLike?.getElementById?.(id) ?? null;
  return {
    panelHost: find('osh-panel'),
    detailHost: find('osh-panel-detail'),
    videoHost: find('osh-panel-video'),
  };
}

/**
 * Wire the standalone source. The hosts are the elements of the panel, and the
 * other options go to the layer as they are.
 */
export function createOshLayer({ source = createOshSource(), ...options } = {}) {
  return createLayer({ source, ...options });
}
export default createOshLayer(createOshPanelHosts());
