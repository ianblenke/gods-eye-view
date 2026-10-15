/** Keep only the frames of an answer that have a valid id, position and time. */

export const MAX_FRAMES = 200;
const ID = /^[0-9a-f]{16}$/;
const TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;

const countOf = (value) =>
  Number.isInteger(value) && value >= 0 ? value : null;

function readFrame(item) {
  if (
    typeof item?.id !== 'string' ||
    !ID.test(item.id) ||
    !Number.isFinite(item.lat) ||
    Math.abs(item.lat) > 90 ||
    !Number.isFinite(item.lon) ||
    Math.abs(item.lon) > 180 ||
    typeof item.timestamp !== 'string' ||
    !TIME.test(item.timestamp)
  ) {
    return null;
  }
  const time = Date.parse(item.timestamp);
  if (Number.isNaN(time)) return null;
  return {
    id: item.id,
    lat: item.lat,
    lon: item.lon,
    timestamp: item.timestamp,
    time,
  };
}

/**
 * @param {unknown} payload - Parsed answer of the route /api/beemaps/frames.
 * @returns {{frames:object[], used:number|null, limit:number|null, remaining:number|null}|null}
 */
export function normalizeAnswer(payload) {
  if (!Array.isArray(payload?.frames)) return null;
  const seen = new Set();
  const frames = [];
  for (const item of payload.frames) {
    if (frames.length === MAX_FRAMES) break;
    const frame = readFrame(item);
    if (frame === null || seen.has(frame.id)) continue;
    seen.add(frame.id);
    frames.push(frame);
  }
  return {
    frames,
    used: countOf(payload.budget?.used),
    limit: countOf(payload.budget?.limit),
    remaining: countOf(payload.credits?.remaining),
  };
}
