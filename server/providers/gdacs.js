import { coalesceProxyRequest, readResponseTextCapped } from './common/http.js';

/**
 * Recent disaster events from the GDACS event list (floods, droughts,
 * volcanoes and tropical cyclones).
 *
 * GDACS is a cooperation framework of the United Nations and the European
 * Commission. Its event list answers a GeoJSON feature collection with a point
 * for each event. This provider reads the pages, checks each record, keeps a
 * short list of fields and sends one small document. It is the only filter: the
 * layer never sees a link, an icon or HTML text of the feed.
 *
 * @module server/providers/gdacs
 */

const SOURCE = 'GDACS (Global Disaster Alert and Coordination System)';
const ATTRIBUTION =
  'GDACS, a cooperation framework of the United Nations and the European Commission';
const LICENSE =
  'The legal notice of the European Commission licenses content that the European Union owns under CC BY 4.0. GDACS gives no separate license for the feed. Data of NOAA, JTWC, GloFAS, GDO and other sources keep their own terms. The provider shortens the data and rounds the positions.';
const DISCLAIMER =
  'The estimates of GDACS come from a machine, and an estimate can be wrong. Check each estimate before you use it to make a decision.';
const COVERAGE =
  'Flood, drought, volcano and tropical cyclone events active on any day from the UTC date 14 days before fetchedAt. The provider does not list earthquakes and wildfires.';
const ENDPOINT =
  'https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH';
const USER_AGENT = 'gods-eye-view-gdacs-proxy/1.0';
const TYPE_LABELS = {
  FL: 'Flood',
  DR: 'Drought',
  VO: 'Volcano',
  TC: 'Tropical cyclone',
};
const TYPES = Object.keys(TYPE_LABELS);
const ALERTS = ['green', 'orange', 'red'];
const DAY = 24 * 3600_000;
const WINDOW_DAYS = 14;
const PAGE_SIZE = 100;
const MAX_PAGES = 5;
const MAX_EVENTS = 500;
const CACHE_MS = 10 * 60_000;
const STALE_SERVE_MS = 3600_000;
const REFRESH_TIMEOUT_MS = 30_000;
const MAX_BYTES = 2 * 1024 * 1024;
const LIMITS = { name: 120, country: 80, origin: 40, unit: 12, text: 160 };

const isObject = (value) => value !== null && typeof value === 'object';
const finite = Number.isFinite;
/** Round to three decimals; adding zero turns negative zero into zero. */
const round3 = (value) => Math.round(value * 1000) / 1000 + 0;

const TIME_FORM =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?Z?$/;

/**
 * A valid time is YYYY-MM-DDTHH:MM:SS with a real date and a real clock time,
 * with an optional fraction of one to three digits and an optional final Z.
 * GDACS sends no time zone, so the time is UTC. Returns the epoch milliseconds
 * or null.
 */
function parseTime(value) {
  const match = typeof value === 'string' ? TIME_FORM.exec(value) : null;
  if (!match) return null;
  const [year, month, day, hour, minute, second] = match.slice(1).map(Number);
  const time = Date.UTC(year, month - 1, day, hour, minute, second);
  const date = new Date(time);
  // A month or an hour that is too large rolls the date over, and the year or
  // the day then differs. Only a minute or a second can roll over silently.
  const real =
    date.getUTCFullYear() === year &&
    date.getUTCDate() === day &&
    minute < 60 &&
    second < 60;
  return real ? time + Number((match[7] ?? '').padEnd(3, '0')) : null;
}
const isoOf = (time) => (time === null ? null : new Date(time).toISOString());

/**
 * Clean a text: remove control characters and angle brackets, join runs of
 * spaces, cut to the limit, then trim the spaces. Returns '' when nothing is
 * left, and null when the value is not text.
 */
function cleanText(value, limit) {
  if (typeof value !== 'string') return null;
  return value
    .replace(/[\u0000-\u001f\u007f-\u009f<>]/g, '')
    .replace(/ {2,}/g, ' ')
    .slice(0, limit)
    .replace(/^ +| +$/g, '');
}

function positionOf(geometry) {
  if (!isObject(geometry) || geometry.type !== 'Point') return null;
  const [longitude, latitude] = Array.isArray(geometry.coordinates)
    ? geometry.coordinates
    : [];
  if (!finite(longitude) || !finite(latitude)) return null;
  if (longitude < -180 || longitude > 180) return null;
  if (latitude < -90 || latitude > 90) return null;
  if (longitude === 0 && latitude === 0) return null;
  return { latitude: round3(latitude), longitude: round3(longitude) };
}

function severityOf(data) {
  if (!isObject(data)) return null;
  const unit = cleanText(data.severityunit, LIMITS.unit);
  if (!unit || !finite(data.severity)) return null;
  const value = Math.round(data.severity);
  if (!(value > 0)) return null;
  return {
    value,
    unit,
    text: cleanText(data.severitytext, LIMITS.text) || null,
  };
}

/** The event for one record, or null when a rule drops the record. */
function eventOf(record) {
  if (!isObject(record) || !isObject(record.properties)) return null;
  const p = record.properties;
  const type = p.eventtype;
  if (!TYPES.includes(type)) return null;
  const eventId = p.eventid;
  if (!Number.isInteger(eventId) || eventId < 1) return null;
  const episodeId = p.episodeid;
  if (!Number.isInteger(episodeId) || episodeId < 0) return null;
  const alert =
    typeof p.alertlevel === 'string' ? p.alertlevel.toLowerCase() : null;
  if (!ALERTS.includes(alert)) return null;
  const position = positionOf(record.geometry);
  const from = parseTime(p.fromdate);
  if (!position || from === null) return null;
  const to = parseTime(p.todate);
  const modified = parseTime(p.datemodified);
  return {
    modifiedTime: modified ?? -Infinity,
    event: {
      id: `${type}-${eventId}`,
      type,
      eventId,
      episodeId,
      name: cleanText(p.name, LIMITS.name) || TYPE_LABELS[type],
      alert,
      alertScore: finite(p.alertscore) ? p.alertscore : null,
      current: p.iscurrent === 'true' || p.iscurrent === true,
      country: cleanText(p.country, LIMITS.country) || null,
      iso3:
        typeof p.iso3 === 'string' && /^[A-Z]{3}$/.test(p.iso3) ? p.iso3 : null,
      from: isoOf(from),
      to: isoOf(to),
      modified: isoOf(modified),
      latitude: position.latitude,
      longitude: position.longitude,
      severity: severityOf(p.severitydata),
      origin: cleanText(p.source, LIMITS.origin) || null,
      reportUrl: `https://www.gdacs.org/report.aspx?eventid=${eventId}&episodeid=${episodeId}&eventtype=${type}`,
    },
  };
}

const zeroCounts = () => ({
  total: 0,
  current: 0,
  dropped: 0,
  byType: { FL: 0, DR: 0, VO: 0, TC: 0 },
});

/**
 * Check each record, join the records of one type and event id, sort the events
 * and cut the list. The count `dropped` counts only the records that the rules
 * drop.
 *
 * @param {unknown[]} records The records of all pages, in order.
 * @returns {{events: object[], counts: object}}
 */
export function normalizeEvents(records) {
  const best = new Map();
  let dropped = 0;
  for (const record of records) {
    const item = eventOf(record);
    if (!item) {
      dropped += 1;
      continue;
    }
    const held = best.get(item.event.id);
    if (
      !held ||
      item.event.episodeId > held.event.episodeId ||
      (item.event.episodeId === held.event.episodeId &&
        item.modifiedTime > held.modifiedTime)
    ) {
      best.set(item.event.id, item);
    }
  }
  const events = [...best.values()]
    // Two times of -Infinity (no modified time) give NaN, so the id decides.
    .sort(
      (a, b) =>
        b.modifiedTime - a.modifiedTime || (a.event.id < b.event.id ? -1 : 1),
    )
    .slice(0, MAX_EVENTS)
    .map((item) => item.event);
  const counts = { ...zeroCounts(), total: events.length, dropped };
  for (const event of events) {
    counts.byType[event.type] += 1;
    if (event.current) counts.current += 1;
  }
  return { events, counts };
}

function documentOf(fields) {
  return {
    schemaVersion: 1,
    source: SOURCE,
    attribution: ATTRIBUTION,
    license: LICENSE,
    disclaimer: DISCLAIMER,
    coverage: COVERAGE,
    fetchedAt: null,
    stale: false,
    unavailable: false,
    reason: null,
    counts: zeroCounts(),
    events: [],
    ...fields,
  };
}
const unavailable = () =>
  documentOf({ unavailable: true, reason: 'GDACS unavailable' });

const dateOf = (time) => new Date(time).toISOString().slice(0, 10);

/**
 * Vite plugin for `/api/gdacs`.
 *
 * @param {object} [options]
 * @param {typeof fetch} [options.fetchImpl] Fetch used for the page requests.
 * @param {() => number} [options.now] Clock in milliseconds.
 * @param {Function} [options.setTimer] Timer for the limit of a refresh.
 * @param {Function} [options.clearTimer] Clears that timer.
 */
export function gdacsProxy({
  fetchImpl = fetch,
  now = Date.now,
  setTimer = setTimeout,
  clearTimer = clearTimeout,
} = {}) {
  let cache = null;
  const inFlight = new Map();

  /** The records of all pages, or an error when GDACS fails. */
  async function fetchRecords(time) {
    const controller = new AbortController();
    const timer = setTimer(() => controller.abort(), REFRESH_TIMEOUT_MS);
    const query = `eventlist=FL;DR;VO;TC&fromdate=${dateOf(time - WINDOW_DAYS * DAY)}&todate=${dateOf(time)}&alertlevel=green;orange;red`;
    try {
      const records = [];
      for (let page = 1; page <= MAX_PAGES; page += 1) {
        const response = await fetchImpl(
          `${ENDPOINT}?${query}&pagenumber=${page}`,
          {
            method: 'GET',
            redirect: 'error',
            signal: controller.signal,
            headers: { Accept: 'application/json', 'User-Agent': USER_AGENT },
          },
        );
        if (response.status === 204) break;
        if (response.status !== 200) throw new Error('gdacs_status');
        const body = JSON.parse(
          await readResponseTextCapped(response, MAX_BYTES, controller.signal),
        );
        if (
          !isObject(body) ||
          body.type !== 'FeatureCollection' ||
          !Array.isArray(body.features)
        )
          throw new Error('gdacs_format');
        records.push(...body.features);
        if (body.features.length < PAGE_SIZE) break;
      }
      return records;
    } finally {
      clearTimer(timer);
    }
  }

  async function refresh(time) {
    try {
      const { events, counts } = normalizeEvents(await fetchRecords(time));
      const document = documentOf({
        fetchedAt: new Date(time).toISOString(),
        counts,
        events,
      });
      cache = { fetchedAt: time, document };
      return document;
    } catch {
      if (cache && time - cache.fetchedAt < STALE_SERVE_MS)
        return { ...cache.document, stale: true };
      return unavailable();
    }
  }

  async function load() {
    const time = now();
    if (cache && time - cache.fetchedAt < CACHE_MS) return cache.document;
    return coalesceProxyRequest(inFlight, 'events', () => refresh(time))
      .promise;
  }

  async function handler(req, res) {
    const json = (status, value) => {
      res.writeHead(status, {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      });
      res.end(JSON.stringify(value));
    };
    if (req.method !== 'GET') return json(405, { error: 'method_not_allowed' });
    if (req.url !== '/' && req.url !== '')
      return json(400, { error: 'invalid_gdacs_query' });
    return json(200, await load());
  }

  return {
    name: 'gdacs',
    configureServer({ middlewares }) {
      middlewares.use('/api/gdacs', handler);
    },
    configurePreviewServer({ middlewares }) {
      middlewares.use('/api/gdacs', handler);
    },
  };
}
