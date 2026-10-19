/**
 * Display rules of the GDACS layer: the style of a point and the choice of the
 * labels. It does not import Cesium, so the tests run on the host.
 */

export const GDACS_OVERLAY_SOURCE_ID = 'gdacs';
export const GDACS_LABEL_LIMIT = 48;
export const GDACS_COLLISION_CAPACITY = 24;
const LABEL_TITLE_MAX = 32;
const ALERT_COLORS = Object.freeze({
  green: '#22c55e',
  orange: '#f97316',
  red: '#ef4444',
});
const ALERT_RANK = Object.freeze({ red: 3, orange: 2, green: 1 });
const CURRENT_STYLE = Object.freeze({ alpha: 1, size: 10 });
const PAST_STYLE = Object.freeze({ alpha: 0.45, size: 6 });

/** The color (CSS text), the alpha and the size in pixels of one point. */
export function pointStyle({ alert, current }) {
  const { alpha, size } = current ? CURRENT_STYLE : PAST_STYLE;
  return { color: ALERT_COLORS[alert], alpha, size };
}

const modifiedTime = (event) =>
  event.modified === null ? -Infinity : Date.parse(event.modified);

/** Order two events: current first, then the highest alert, then newest, then id. */
function compareEvents(a, b) {
  return (
    Number(b.current) - Number(a.current) ||
    ALERT_RANK[b.alert] - ALERT_RANK[a.alert] ||
    modifiedTime(b) - modifiedTime(a) ||
    (a.id < b.id ? -1 : 1)
  );
}

/** Keep the events that get a label. */
export function selectLabelCohort(events) {
  return events.slice().sort(compareEvents).slice(0, GDACS_LABEL_LIMIT);
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
