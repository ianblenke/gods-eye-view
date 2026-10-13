/**
 * Display rules of the Reticulum layer: the style of a point and the choice of
 * the labels. It does not import Cesium, so the tests run on the host.
 */

export const RETICULUM_OVERLAY_SOURCE_ID = 'reticulum';
export const RETICULUM_LABEL_LIMIT = 48;
export const RETICULUM_COLLISION_CAPACITY = 24;
const LABEL_TITLE_MAX = 24;
const OTHER_COLOR = '#9ca3af';
const TYPE_COLORS = Object.freeze({
  rnode: '#2dd4bf',
  backbone: '#fb923c',
  tcpserver: '#facc15',
  tcpclient: '#fde047',
  i2p: '#a78bfa',
  kiss: '#60a5fa',
  weave: '#f472b6',
});
const STATUS_STYLES = Object.freeze({
  available: Object.freeze({ alpha: 1, size: 9 }),
  unknown: Object.freeze({ alpha: 0.6, size: 7 }),
  stale: Object.freeze({ alpha: 0.35, size: 5 }),
});
const STATUS_RANK = Object.freeze({ available: 3, unknown: 2, stale: 1 });

/** The color (CSS text), the alpha and the size in pixels of one point. */
export function pointStyle({ type, status }) {
  const color = Object.hasOwn(TYPE_COLORS, type)
    ? TYPE_COLORS[type]
    : OTHER_COLOR;
  const { alpha, size } = STATUS_STYLES[status];
  return { color, alpha, size };
}

/** Keep the interfaces that get a label: best status first, then newest. */
export function selectLabelCohort(interfaces) {
  return interfaces
    .slice()
    .sort(
      (a, b) =>
        STATUS_RANK[b.status] - STATUS_RANK[a.status] ||
        Date.parse(b.lastHeard) - Date.parse(a.lastHeard) ||
        (a.id < b.id ? -1 : 1),
    )
    .slice(0, RETICULUM_LABEL_LIMIT);
}

/** Build the entry of the overlay host for one label. */
export function createLabelEntry({ item, position, index }) {
  return {
    id: item.id,
    position,
    variant: 'label',
    title: Array.from(item.name).slice(0, LABEL_TITLE_MAX).join(''),
    accent: pointStyle(item).color,
    priority: 100000 - index,
    collisionGroup: 'ambient-label',
    paintLane: 'ambient-label',
    interactive: false,
    edgeFade: 'keyhole',
    horizonCull: true,
    terrainOcclusion: false,
    gapPx: 15,
    verticalOnly: true,
    placement: 'above',
  };
}
