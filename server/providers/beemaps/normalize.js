import { createHash } from 'node:crypto';

/** Reduce a Bee Maps answer to the id, position and time of each frame. */

export const MAX_ITEMS = 5000;

const ISO_TIME =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;
const round6 = (value) => Number(value.toFixed(6));
const countOf = (value) =>
  Number.isFinite(value) && value >= 0 ? value : null;

/** The first 16 hex characters of the SHA-256 of `timestamp|lat|lon`. */
export function frameId(timestamp, lat, lon) {
  return createHash('sha256')
    .update(`${timestamp}|${lat}|${lon}`)
    .digest('hex')
    .slice(0, 16);
}

/** Credits that the upstream answer reports, each as a number of 0 or more or null. */
export function readCredits(document) {
  return {
    used: countOf(document.creditsUsed),
    remaining: countOf(document.creditsRemaining),
    cost: countOf(document.cost),
  };
}

function readItem(item) {
  const text = item?.timestamp;
  const time =
    typeof text === 'string' && ISO_TIME.test(text) ? Date.parse(text) : NaN;
  const { lat, lon } = item?.position ?? {};
  if (
    Number.isNaN(time) ||
    !Number.isFinite(lat) ||
    Math.abs(lat) > 90 ||
    !Number.isFinite(lon) ||
    Math.abs(lon) > 180
  ) {
    return null;
  }
  const timestamp = new Date(time).toISOString();
  const frame = { lat: round6(lat), lon: round6(lon), timestamp };
  return {
    time,
    frame: {
      id: frameId(timestamp, frame.lat, frame.lon),
      lat: frame.lat,
      lon: frame.lon,
      timestamp,
    },
  };
}

/**
 * Turn the upstream document into frames: cut by `since`, without a repeat,
 * newest first and the smaller id first for equal times.
 * @param {unknown} document - Parsed upstream JSON.
 * @param {string|null} since - Day text YYYY-MM-DD or null.
 * @returns {{ok:false}|{ok:true, frames:object[], overflow:boolean, credits:object}}
 */
export function normalizeDocument(document, since) {
  if (!Array.isArray(document?.frames)) return { ok: false };
  const cutoff = since === null ? -Infinity : Date.parse(`${since}T00:00:00Z`);
  const seen = new Set();
  const kept = [];
  for (const raw of document.frames.slice(0, MAX_ITEMS)) {
    const read = readItem(raw);
    if (read === null || read.time < cutoff || seen.has(read.frame.id)) {
      continue;
    }
    seen.add(read.frame.id);
    kept.push(read);
  }
  kept.sort((a, b) => b.time - a.time || (a.frame.id < b.frame.id ? -1 : 1));
  return {
    ok: true,
    frames: kept.map((entry) => entry.frame),
    overflow: document.frames.length > MAX_ITEMS,
    credits: readCredits(document),
  };
}
