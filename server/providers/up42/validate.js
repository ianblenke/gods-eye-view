/** Checks of a UP42 scenes request. Nothing in this file sends a request. */

export const MAX_BODY_BYTES = 4096;
export const MAX_AREA_KM2 = 2500;
const MAX_WINDOW_DAYS = 91;
const DAY_MS = 86_400_000;
const EARTH_RADIUS_M = 6371008.8;
const FIELDS = new Set(['box', 'start', 'end', 'maxCloud', 'collections']);
const DATE_TEXT = /^(\d{4})-(\d{2})-(\d{2})$/;

const radians = (degrees) => (degrees * Math.PI) / 180;

/** Read the request body as text. Returns null when it has more bytes than the cap or fails. */
export async function readBodyText(req) {
  const chunks = [];
  let total = 0;
  try {
    for await (const chunk of req) {
      total += chunk.length;
      if (total > MAX_BODY_BYTES * 16) return null;
      if (total <= MAX_BODY_BYTES) chunks.push(chunk);
    }
  } catch {
    return null;
  }
  return total > MAX_BODY_BYTES ? null : Buffer.concat(chunks).toString('utf8');
}

const refuse = (error, extra = {}) => ({
  ok: false,
  status: 400,
  payload: { error, ...extra },
});

/** The area in km² of a box [west, south, east, north] on a sphere. */
export function boxAreaKm2([west, south, east, north]) {
  const width = radians(east - west);
  const band = Math.sin(radians(north)) - Math.sin(radians(south));
  return (EARTH_RADIUS_M * EARTH_RADIUS_M * width * band) / 1e6;
}

function validBox(box) {
  if (!Array.isArray(box) || box.length !== 4) return false;
  if (!box.every((value) => Number.isFinite(value))) return false;
  const [west, south, east, north] = box;
  return (
    west >= -180 &&
    east <= 180 &&
    south >= -90 &&
    north <= 90 &&
    west < east &&
    south < north
  );
}

/** The UTC time of a calendar date YYYY-MM-DD, or null. */
function dayOf(text) {
  if (typeof text !== 'string') return null;
  const match = DATE_TEXT.exec(text);
  if (match === null) return null;
  const [year, month, day] = match.slice(1).map(Number);
  const time = Date.UTC(year, month - 1, day);
  const date = new Date(time);
  const same =
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day;
  return same ? time : null;
}

/**
 * Check the text of a scenes request: the body, the box, the area and the
 * dates, in that order.
 * @param {string} text - Body text.
 * @param {number} now - Server clock in milliseconds.
 * @returns {{ok:true, box:number[], start:string, end:string}|{ok:false, status:number, payload:object}}
 */
export function validateRequest(text, now) {
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    return refuse('bad_body');
  }
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    return refuse('bad_body');
  }
  if (!Object.keys(body).every((field) => FIELDS.has(field))) {
    return refuse('bad_body');
  }
  if (!validBox(body.box)) return refuse('bad_bbox');
  if (boxAreaKm2(body.box) > MAX_AREA_KM2) {
    return refuse('area_too_large', { maxKm2: MAX_AREA_KM2 });
  }
  const start = dayOf(body.start);
  const end = dayOf(body.end);
  const today = Math.floor(now / DAY_MS) * DAY_MS;
  if (
    start === null ||
    end === null ||
    start > end ||
    end > today ||
    end - start > MAX_WINDOW_DAYS * DAY_MS
  ) {
    return refuse('bad_dates');
  }
  const options = {};
  if (Object.hasOwn(body, 'maxCloud')) {
    if (
      !Number.isInteger(body.maxCloud) ||
      body.maxCloud < 0 ||
      body.maxCloud > 100
    ) {
      return refuse('bad_options');
    }
    options.maxCloud = body.maxCloud;
  }
  if (Object.hasOwn(body, 'collections')) {
    if (
      !Array.isArray(body.collections) ||
      body.collections.length === 0 ||
      !body.collections.every(
        (name) =>
          typeof name === 'string' &&
          name.length > 0 &&
          name.length <= 128 &&
          name.trim() === name,
      ) ||
      new Set(body.collections).size !== body.collections.length
    ) {
      return refuse('bad_options');
    }
    options.collections = [...body.collections];
  }
  return {
    ok: true,
    box: [...body.box],
    start: body.start,
    end: body.end,
    ...options,
  };
}
