/**
 * Pure helpers for one OpenSensorHub observation. Shared the same way as
 * src/data/oshSystems.js: the server provider applies them before it
 * caches a result, so a cached or served payload always holds trimmed
 * rows.
 *
 * A location, when a datastream carries one, comes from a shape a reader
 * built by readOshSchemaLocation() names — never from a guessed key. See
 * design decision D44.
 */

const MAX_DEPTH = 4;
const MAX_ROWS = 64;
const TRUNCATED_ROW = Object.freeze({ path: '…', value: '…' });

/**
 * Flatten a SWE Common result record to path/value rows. A primitive value
 * becomes one row. An object walks into dotted paths, and an array walks
 * into index paths. A value past the depth cap becomes the string
 * "[object]". A result with more than 64 rows keeps 63 and ends with one
 * marker row.
 * @param {*} result
 * @returns {Array<{path:string, value:*}>}
 */
export function flattenOshResult(result) {
  if (result === null || result === undefined) return [];
  const leaves = [];
  const visit = (value, path, depth) => {
    if (value === null || typeof value !== 'object') {
      leaves.push({ path, value });
      return;
    }
    if (depth >= MAX_DEPTH) {
      leaves.push({ path, value: '[object]' });
      return;
    }
    const isArray = Array.isArray(value);
    const keys = isArray ? value.map((_, index) => index) : Object.keys(value);
    if (keys.length === 0) {
      leaves.push({ path, value: isArray ? [] : {} });
      return;
    }
    for (const key of keys) {
      visit(value[key], path ? `${path}.${key}` : String(key), depth + 1);
    }
  };
  if (typeof result !== 'object') {
    leaves.push({ path: '', value: result });
  } else {
    visit(result, '', 0);
  }
  if (leaves.length <= MAX_ROWS) return leaves;
  return [...leaves.slice(0, MAX_ROWS - 1), TRUNCATED_ROW];
}

/** Depth cap on the schema walk (D44): a DataRecord nested more than this deep gives no reader. */
const MAX_SCHEMA_DEPTH = 4;
const GEOGRAPHIC_FRAME_TAILS = new Set(['4979', '4326']);
const HEIGHT_DEFINITION_TOKENS = new Set([
  'heighthae',
  'heightaboveellipsoid',
  'ellipsoidalheight',
]);

function schemaFieldsOf(node) {
  return Array.isArray(node?.fields) ? node.fields : null;
}

function namedFields(node) {
  const fields = schemaFieldsOf(node);
  if (!fields) return [];
  return fields.filter(
    (field) => field && typeof field === 'object' && typeof field.name === 'string',
  );
}

/** A reference frame, when present, must resolve to EPSG 4979 or 4326. Absent is tolerated. */
function frameIsGeographic(frame) {
  if (frame === null || frame === undefined) return true;
  if (typeof frame !== 'string') return false;
  const lower = frame.toLowerCase();
  if (!lower.includes('epsg')) return false;
  const tail = lower.split(/[/:#]/).filter(Boolean).pop();
  return GEOGRAPHIC_FRAME_TAILS.has(tail);
}

/** The last token of a definition URI or URN, after the last `/`, `#` or `:`, in lower case. */
function lastDefinitionToken(definition) {
  if (typeof definition !== 'string') return null;
  const parts = definition.split(/[/#:]/).filter(Boolean);
  return parts.length ? parts[parts.length - 1].toLowerCase() : null;
}

function unitCodeOf(field) {
  return field?.uom && typeof field.uom === 'object' ? field.uom.code : null;
}

/**
 * Bind a Vector field's coordinates by axisID, never by name or list
 * position. Returns null when the frame is present and not geographic, or
 * when no coordinate binds both Lat and Lon.
 */
function vectorReaderOf(field, fieldPath) {
  if (!frameIsGeographic(field.referenceFrame)) return null;
  const coordinates = Array.isArray(field.coordinates) ? field.coordinates : [];
  let lat = null;
  let lon = null;
  let alt = null;
  for (const coord of coordinates) {
    if (!coord || typeof coord !== 'object' || typeof coord.name !== 'string') continue;
    const unit = unitCodeOf(coord);
    const path = [...fieldPath, coord.name];
    if (coord.axisID === 'Lat' && unit === 'deg') lat = path;
    else if (coord.axisID === 'Lon' && unit === 'deg') lon = path;
    else if (coord.axisID === 'h' && unit === 'm') alt = path;
  }
  if (!lat || !lon) return null;
  return { lat, lon, alt };
}

/** Walk `fields` for a `Vector` field bound by axisID, to a depth of four. Vector shape wins ties. */
function walkForVector(node, path, depth) {
  if (depth > MAX_SCHEMA_DEPTH) return null;
  const fields = namedFields(node);
  for (const field of fields) {
    if (field.type === 'Vector' && Array.isArray(field.coordinates)) {
      const reader = vectorReaderOf(field, [...path, field.name]);
      if (reader) return reader;
    }
  }
  for (const field of fields) {
    const nested = walkForVector(field, [...path, field.name], depth + 1);
    if (nested) return nested;
  }
  return null;
}

/** Walk `fields` for two flat `Quantity` fields bound by definition, to a depth of four. */
function walkForFlat(node, path, depth) {
  if (depth > MAX_SCHEMA_DEPTH) return null;
  const fields = namedFields(node);
  let lat = null;
  let lon = null;
  let alt = null;
  for (const field of fields) {
    if (field.type !== 'Quantity') continue;
    const unit = unitCodeOf(field);
    const token = lastDefinitionToken(field.definition);
    const fieldPath = [...path, field.name];
    if (unit === 'deg' && token === 'latitude') lat = fieldPath;
    else if (unit === 'deg' && token === 'longitude') lon = fieldPath;
    else if (unit === 'm' && HEIGHT_DEFINITION_TOKENS.has(token)) alt = fieldPath;
  }
  if (lat && lon) return { lat, lon, alt };
  for (const field of fields) {
    const nested = walkForFlat(field, [...path, field.name], depth + 1);
    if (nested) return nested;
  }
  return null;
}

/** Walk `fields` for a `Text` field whose definition names a sampling-feature uid, to a depth of four. */
function walkForFeatureUid(node, path, depth) {
  if (depth > MAX_SCHEMA_DEPTH) return null;
  const fields = namedFields(node);
  for (const field of fields) {
    if (field.type === 'Text' && lastDefinitionToken(field.definition) === 'samplingfeatureuid') {
      return [...path, field.name];
    }
  }
  for (const field of fields) {
    const nested = walkForFeatureUid(field, [...path, field.name], depth + 1);
    if (nested) return nested;
  }
  return null;
}

/**
 * Read a datastream schema for a location reader: a path to the latitude,
 * the longitude and, when present, the height and the sampling-feature
 * uid, each a list of field names from the result root. Recognises a
 * `Vector` field bound by axisID, or two flat `Quantity` fields bound by
 * definition; the Vector shape wins when a schema declares both. Field
 * names come from the schema itself, never from a guessed spelling, so a
 * `Vector` named `Location` and one named `location` give the same shape
 * of reader. Returns null when the schema names neither shape, when a
 * present reference frame is not EPSG 4979 or 4326, or when the body has
 * no `resultSchema`.
 * @param {*} schema
 * @returns {?{lat:string[], lon:string[], alt:?string[], featureUid:?string[]}}
 */
export function readOshSchemaLocation(schema) {
  const root = schema && typeof schema === 'object' ? schema.resultSchema : null;
  if (!root || typeof root !== 'object') return null;
  const reader = walkForVector(root, [], 0) || walkForFlat(root, [], 0);
  if (!reader) return null;
  return { ...reader, featureUid: walkForFeatureUid(root, [], 0) };
}

function readPath(result, path) {
  let value = result;
  for (const key of path) {
    if (value === null || typeof value !== 'object') return undefined;
    value = value[key];
  }
  return value;
}

function readFinite(result, path) {
  if (!path) return null;
  const raw = readPath(result, path);
  if (raw === null || raw === undefined || raw === '') return null;
  const number = Number(raw);
  return Number.isFinite(number) ? number : null;
}

/**
 * Extract a location from a result record by walking a reader's paths —
 * never by a guessed key name, and never through `geometry.coordinates`.
 * A value counts only when `Number(value)` is finite, so the text `NaN`,
 * an empty string and null all fail. A bad or absent height keeps a good
 * latitude and longitude at `alt:null`. A null reader, a bad latitude or
 * longitude, or one out of range gives null.
 * @param {*} result
 * @param {?{lat:string[], lon:string[], alt:?string[]}} reader
 * @returns {?{lat:number, lon:number, alt:?number}}
 */
export function extractOshLocation(result, reader) {
  if (!reader || !reader.lat || !reader.lon) return null;
  if (result === null || typeof result !== 'object') return null;
  const lat = readFinite(result, reader.lat);
  const lon = readFinite(result, reader.lon);
  if (lat === null || lon === null) return null;
  if (Math.abs(lat) > 90 || Math.abs(lon) > 180) return null;
  const alt = reader.alt ? readFinite(result, reader.alt) : null;
  return { lat, lon, alt };
}

/**
 * Build the response shape for one datastream's newest observation from
 * the upstream envelope `{items:[{phenomenonTime, resultTime, result}]}`.
 * An empty or malformed item list becomes null. `reader` comes from
 * readOshSchemaLocation(); a null reader gives `location:null`.
 * @param {*} payload
 * @param {?object} reader
 * @returns {?{phenomenonTime:?string, resultTime:?string, rows:Array, location:*}}
 */
export function mapOshObservation(payload, reader = null) {
  const items = Array.isArray(payload?.items) ? payload.items : null;
  if (!items || items.length === 0) return null;
  const first = items[0];
  if (!first || typeof first !== 'object') return null;
  const result = Object.hasOwn(first, 'result') ? first.result : null;
  return {
    phenomenonTime: typeof first.phenomenonTime === 'string' ? first.phenomenonTime : null,
    resultTime: typeof first.resultTime === 'string' ? first.resultTime : null,
    rows: flattenOshResult(result),
    location: extractOshLocation(result, reader),
  };
}

function readFeatureUid(result, reader) {
  if (!reader?.featureUid) return null;
  const raw = readPath(result, reader.featureUid);
  return typeof raw === 'string' && raw ? raw : null;
}

/**
 * Map a page of `resultTime=latest` items — the newest record of each
 * feature of interest a stream reports, newest first — to location
 * records. `ageMs` comes from `oshObservationAgeMs()`, Part B's pure age
 * function in this same file (design decision D39); `nowMs` is the
 * caller's injected clock reading, never the wall clock read here. An
 * item with no location is kept with `location:null`, so a caller can
 * count it. A malformed payload gives an empty list. The order of the
 * page is kept.
 * @param {*} payload
 * @param {?object} reader
 * @param {number} nowMs
 * @returns {Array<{foiId:?string, foiUid:?string, phenomenonTime:?string, resultTime:?string, location:*, ageMs:?number}>}
 */
export function mapOshLocationPage(payload, reader, nowMs) {
  const items = Array.isArray(payload?.items) ? payload.items : null;
  if (!items) return [];
  const records = [];
  for (const item of items) {
    if (!item || typeof item !== 'object') continue;
    const result = Object.hasOwn(item, 'result') ? item.result : null;
    const phenomenonTime = typeof item.phenomenonTime === 'string' ? item.phenomenonTime : null;
    records.push({
      foiId: typeof item['foi@id'] === 'string' && item['foi@id'] ? item['foi@id'] : null,
      foiUid: readFeatureUid(result, reader),
      phenomenonTime,
      resultTime: typeof item.resultTime === 'string' ? item.resultTime : null,
      location: extractOshLocation(result, reader),
      // oshObservationAgeMs() arrives with osh-observation-age (Part B);
      // this call is written against that export and cannot run until
      // that change is merged into this branch.
      ageMs: oshObservationAgeMs(phenomenonTime, nowMs),
    });
  }
  return records;
}
