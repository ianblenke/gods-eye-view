import {
  createOshLayer as createLayer,
  createOshSource,
} from '../layers/osh/index.js';
export * from '../layers/osh/index.js';

/**
 * Wire the standalone source. The detail host is provisional (see the OSH
 * change design) — no panel element exists yet, so the layer writes its
 * detail to nothing until a caller supplies one.
 */
export function createOshLayer({ source = createOshSource(), detailHost = null } = {}) {
  return createLayer({ source, detailHost });
}
export default createOshLayer();
