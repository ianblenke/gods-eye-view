/** The fields of the SkyFi scenes that the route gives. Nothing in this file sends a request. */

export const MAX_SCENES = 50;
const MIN_RING = 4;
const MAX_RING = 2000;
const MAX_FOOTPRINT_CHARS = 20_000;
const MAX_LINK_CHARS = 2048;
const SCENE_ID = /^[A-Za-z0-9_-]{1,128}$/;
const PROVIDER = /^[A-Z0-9_]{1,40}$/;
const PRODUCT_TYPES = new Set([
  'DAY',
  'NIGHT',
  'VIDEO',
  'MULTISPECTRAL',
  'HYPERSPECTRAL',
  'SAR',
  'STEREO',
  'BASEMAP',
  'THERMAL',
]);
/** A thumbnail link starts with one of two hosts of SkyFi and a slash, so a port or a user name never passes. */
const THUMBNAIL_LINK =
  /^https:\/\/(?:app|thumbnails)\.skyfi\.com\/[^\s#@\\\u0000-\u001f\u007f]*$/;
const OFFSET = /(?:Z|[+-]\d{2}:\d{2})$/;
const NUMBER = '-?\\d+(?:\\.\\d+)?';
const POSITION = `${NUMBER} +${NUMBER}`;
const RING_BODY = `${POSITION}(?: *, *${POSITION})*`;
const POLYGON = new RegExp(
  `^POLYGON *\\(\\(${RING_BODY}\\)(?: *, *\\(${RING_BODY}\\))*\\)$`,
);
const FIRST_RING = /^POLYGON *\(\(([^()]*)\)/;

/** True for a scene id of 1 to 128 ASCII letters, digits, hyphens or underscores. */
export const isSceneId = (value) =>
  typeof value === 'string' && SCENE_ID.test(value);

/** True for a thumbnail link that starts with an allowed host and a slash. */
export const isThumbnailLink = (value) =>
  typeof value === 'string' &&
  value.length <= MAX_LINK_CHARS &&
  THUMBNAIL_LINK.test(value);

/** A number from `min` to `max`, else null. Both limits are finite, so Infinity and NaN give null. */
const numberIn = (value, min, max) =>
  typeof value === 'number' && value >= min && value <= max ? value : null;

/** The ISO text of a valid time with an offset, else null. */
function timeOf(value) {
  if (typeof value !== 'string' || !OFFSET.test(value)) return null;
  const time = Date.parse(value);
  return Number.isFinite(time) ? new Date(time).toISOString() : null;
}

/** The first ring of a footprint text as [lon, lat] pairs, else null. */
function ringOf(text) {
  if (text.length > MAX_FOOTPRINT_CHARS || !POLYGON.test(text)) return null;
  const positions = FIRST_RING.exec(text)[1]
    .split(/ *, */)
    .map((position) => position.split(/ +/).map(Number));
  if (positions.length < MIN_RING || positions.length > MAX_RING) return null;
  for (const [lon, lat] of positions) {
    if (numberIn(lon, -180, 180) === null || numberIn(lat, -90, 90) === null) {
      return null;
    }
  }
  const first = positions[0];
  const last = positions[positions.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) return null;
  return positions;
}

function footprintOf(text) {
  if (typeof text !== 'string') return null;
  const ring = ringOf(text);
  return ring === null ? null : { type: 'Polygon', coordinates: [ring] };
}

function sceneOf(item) {
  if (!isSceneId(item?.archiveId)) return null;
  const start = timeOf(item.captureTimestamp);
  if (start === null) return null;
  const footprint = footprintOf(item.footprint);
  if (footprint === null) return null;
  const gsd = numberIn(item.gsd, 0, Number.MAX_VALUE);
  const link = item.thumbnailUrls?.['300x300'];
  const hasLink = isThumbnailLink(link);
  return {
    scene: {
      id: item.archiveId,
      start,
      footprint,
      resolutionM: gsd === null ? null : gsd / 100,
      provider:
        typeof item.provider === 'string' && PROVIDER.test(item.provider)
          ? item.provider
          : null,
      productType: PRODUCT_TYPES.has(item.productType)
        ? item.productType
        : null,
      cloudPercent: numberIn(item.cloudCoveragePercent, 0, 100),
      thumbnail: hasLink,
    },
    url: hasLink ? link : null,
  };
}

const byNewestThenId = (a, b) => {
  const later = Date.parse(b.scene.start) - Date.parse(a.scene.start);
  if (later !== 0) return later;
  if (a.scene.id === b.scene.id) return 0;
  return a.scene.id < b.scene.id ? -1 : 1;
};

/**
 * The kept scenes of the page, the newest first, at most 50, with the
 * thumbnail link of each scene in `urls`.
 * @param {{archives:unknown[], nextPage?:unknown}} page
 * @returns {{scenes:object[], urls:(string|null)[], truncated:boolean}}
 */
export function normalizeScenes(page) {
  const kept = [];
  for (const item of page.archives) {
    const entry = sceneOf(item);
    if (entry !== null) kept.push(entry);
  }
  kept.sort(byNewestThenId);
  const first = kept.slice(0, MAX_SCENES);
  return {
    scenes: first.map((entry) => entry.scene),
    urls: first.map((entry) => entry.url),
    truncated:
      (typeof page.nextPage === 'string' && page.nextPage !== '') ||
      kept.length > MAX_SCENES,
  };
}
