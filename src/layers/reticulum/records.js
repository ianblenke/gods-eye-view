/**
 * Browser-side rules for the snapshot of the route /api/reticulum.
 *
 * The provider of the server already filters and cleans the interfaces. The
 * names still come from anonymous operators, so this module checks every field
 * again and cleans every name. It does not import Cesium.
 */

export const MAX_INTERFACES = 5000;
const NAME_MAX = 40;
const REASON_MAX = 120;
const DEFAULT_REASON = 'Reticulum listener unavailable';
const ID_RE = /^[0-9a-f]{16}$/;
const TYPE_RE = /^[a-z0-9]{1,40}$/;
const STATUSES = new Set(['available', 'unknown', 'stale']);
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

/** Remove the characters of STRIPPED_RANGES, join the spaces and cut to `max` characters. */
function clean(value, max) {
  if (typeof value !== 'string') return '';
  const text = Array.from(value)
    .filter((character) => !isStripped(character))
    .join('')
    .replace(/\s+/g, ' ')
    .trim();
  return Array.from(text).slice(0, max).join('').trim();
}

function validPosition(latitude, longitude) {
  return (
    finite(latitude) &&
    finite(longitude) &&
    Math.abs(latitude) <= 90 &&
    Math.abs(longitude) <= 180 &&
    !(latitude === 0 && longitude === 0)
  );
}

function normalizeRadio(radio) {
  if (!radio || typeof radio !== 'object') return null;
  const { frequency, bandwidth, spreadingFactor, codingRate } = radio;
  if (![frequency, bandwidth, spreadingFactor, codingRate].every(finite))
    return null;
  return { frequency, bandwidth, spreadingFactor, codingRate };
}

function normalizeInterface(record) {
  if (!record || typeof record !== 'object') return null;
  const { id, type, status, latitude, longitude, lastHeard } = record;
  if (typeof id !== 'string' || !ID_RE.test(id)) return null;
  if (typeof type !== 'string' || !TYPE_RE.test(type)) return null;
  if (!STATUSES.has(status)) return null;
  if (!validPosition(latitude, longitude)) return null;
  if (!validDate(lastHeard)) return null;
  return {
    id,
    type,
    name: clean(record.name, NAME_MAX) || `Unnamed ${type}`,
    latitude,
    longitude,
    heightM: finite(record.heightM) ? record.heightM : null,
    hops: finite(record.hops) ? record.hops : null,
    lastHeard,
    status,
    radio: normalizeRadio(record.radio),
  };
}

/**
 * Keep the valid interfaces of a document of the schema version 1.
 *
 * @param {unknown} document The parsed answer of the route.
 * @returns {{interfaces: object[], meta: object}|null} Null when the value is
 *   not a document of the schema version 1 with a list of interfaces.
 */
export function normalizeReticulumSnapshot(document) {
  if (
    !document ||
    typeof document !== 'object' ||
    document.schemaVersion !== 1 ||
    !Array.isArray(document.interfaces)
  )
    return null;
  const interfaces = [];
  const seen = new Set();
  for (const record of document.interfaces) {
    if (interfaces.length >= MAX_INTERFACES) break;
    const item = normalizeInterface(record);
    if (!item || seen.has(item.id)) continue;
    seen.add(item.id);
    interfaces.push(item);
  }
  const unavailable = document.unavailable === true;
  const total = document.counts?.total;
  return {
    interfaces,
    meta: {
      unavailable,
      stale: document.stale === true,
      reason:
        clean(document.reason, REASON_MAX) ||
        (unavailable ? DEFAULT_REASON : null),
      fetchedAt: validDate(document.fetchedAt) ? document.fetchedAt : null,
      total:
        Number.isSafeInteger(total) && total >= 0
          ? total
          : document.interfaces.length,
    },
  };
}
