/**
 * Browser-side rules for the document of the route /api/gdacs.
 *
 * The provider of the server already filters and cleans the events. The names
 * still come from GDACS, so this module checks every field that the layer
 * reads again and cleans every name. It does not import Cesium.
 */

export const MAX_EVENTS = 500;
const NAME_MAX = 120;
const EVENT_NUMBER_RE = /^[1-9][0-9]{0,15}$/;
const ALERTS = new Set(['green', 'orange', 'red']);
const TYPE_NAMES = Object.freeze({
  FL: 'Flood',
  DR: 'Drought',
  VO: 'Volcano',
  TC: 'Tropical cyclone',
});
// Code point ranges that the cleaning removes: control characters, marks that
// change the text direction, zero width characters, line and paragraph
// separators, the byte order mark and the angle brackets. The ranges are
// numbers because a formatter can turn an escape of an invisible character
// into the character itself.
const STRIPPED_RANGES = Object.freeze([
  [0x00, 0x1f],
  [0x3c, 0x3c],
  [0x3e, 0x3e],
  [0x7f, 0x9f],
  [0x61c, 0x61c],
  [0x200b, 0x200f],
  [0x2028, 0x202e],
  [0x2060, 0x2064],
  [0x2066, 0x2069],
  [0xfeff, 0xfeff],
]);
const isStripped = (character) => {
  const code = character.codePointAt(0);
  return STRIPPED_RANGES.some(([first, last]) => code >= first && code <= last);
};

const finite = (value) => typeof value === 'number' && Number.isFinite(value);
const validDate = (value) =>
  typeof value === 'string' && Number.isFinite(Date.parse(value));

/** Remove the characters of STRIPPED_RANGES, join the spaces and cut to 120 code points. */
function clean(value) {
  if (typeof value !== 'string') return '';
  const text = Array.from(value)
    .filter((character) => !isStripped(character))
    .join('')
    .replace(/\s+/g, ' ')
    .trimStart();
  return Array.from(text).slice(0, NAME_MAX).join('').trimEnd();
}

function normalizeEvent(record) {
  if (!record || typeof record !== 'object') return null;
  const { id, type, alert, latitude, longitude } = record;
  if (!Object.hasOwn(TYPE_NAMES, type)) return null;
  if (
    typeof id !== 'string' ||
    !id.startsWith(`${type}-`) ||
    !EVENT_NUMBER_RE.test(id.slice(type.length + 1))
  )
    return null;
  if (!ALERTS.has(alert)) return null;
  if (!finite(latitude) || Math.abs(latitude) > 90) return null;
  if (!finite(longitude) || Math.abs(longitude) > 180) return null;
  return {
    id,
    type,
    name: clean(record.name) || TYPE_NAMES[type],
    alert,
    current: record.current === true,
    latitude,
    longitude,
    modified: validDate(record.modified) ? record.modified : null,
  };
}

/**
 * Keep the valid events of a document of the schema version 1.
 *
 * @param {unknown} payload The parsed answer of the route.
 * @returns {{events: object[], meta: object}|null} Null when the value is not
 *   a document of the schema version 1 with a list of events.
 */
export function normalizeGdacsDocument(payload) {
  if (
    !payload ||
    typeof payload !== 'object' ||
    payload.schemaVersion !== 1 ||
    !Array.isArray(payload.events)
  )
    return null;
  const events = [];
  const seen = new Set();
  for (const record of payload.events) {
    if (events.length >= MAX_EVENTS) break;
    const item = normalizeEvent(record);
    if (!item || seen.has(item.id)) continue;
    seen.add(item.id);
    events.push(item);
  }
  const total = payload.counts?.total;
  return {
    events,
    meta: {
      unavailable: payload.unavailable === true,
      stale: payload.stale === true,
      reason: clean(payload.reason) || null,
      fetchedAt: validDate(payload.fetchedAt) ? payload.fetchedAt : null,
      total:
        Number.isSafeInteger(total) && total >= 0
          ? total
          : payload.events.length,
    },
  };
}
