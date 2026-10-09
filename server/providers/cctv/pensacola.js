import { fallbackHeadingFromId, prioritizeSources } from './normalize.js';
import { CCTV_SOURCE_FETCH_TIMEOUT_MS } from './constants.js';
import { readResponseJsonCapped } from '../../../src/sources/httpBody.js';

const DEFAULT_ROWS_URL =
  'https://services.arcgis.com/3wFbqsFPLeKqOlIK/arcgis/rest/services/FL511_Traffic_Cameras/FeatureServer/0/query';
const IMAGE_ORIGIN = 'https://images-dis.divas.cloud';
// The whole row address is matched as text: a URL parser would drop the default port 443.
const FRAME_ADDRESS =
  /^https:\/\/images-dis\.divas\.cloud\/DGI\/chan-(\d+)_h\.jpg(?:[?#].*)?$/;
const BOUNDS = { south: 30.2, north: 30.85, west: -87.65, east: -86.8 };
const ANCHOR = { lat: 30.4213, lon: -87.2169 };
const DEFAULT_MAX_SOURCES = 120;
const MIN_SOURCES = 8;
const MAX_SOURCES = 200;
const MAX_BYTES = 1048576;
const DIRECTIONS = new Map([
  ['N', 0],
  ['E', 90],
  ['S', 180],
  ['W', 270],
]);

/**
 * Map one row (the attributes of a feature) of the FL511 traffic camera layer
 * to a still-image camera source, or null for an invalid row. The id comes
 * from the channel number of the frame address, and the pack builds the frame
 * address from that number, so the address of the row is never copied.
 *
 * @param {object} row
 * @returns {object|null}
 */
export function pensacolaCameraToSource(row) {
  if (!row) return null;
  const lat = row.LATITUDE;
  const lon = row.LONGITUDE;
  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lon) ||
    lat < BOUNDS.south ||
    lat > BOUNDS.north ||
    lon < BOUNDS.west ||
    lon > BOUNDS.east
  )
    return null;
  if (typeof row.IMAGE !== 'string') return null;
  const match = FRAME_ADDRESS.exec(row.IMAGE);
  if (!match) return null;
  const channel = match[1];
  const id = `fl-${channel}`;
  const url = `${IMAGE_ORIGIN}/DGI/chan-${channel}_h.jpg`;
  const direction = String(row.DIRECTION).trim();
  return {
    id,
    name: String(row.DESCRIPT ?? '').trim() || `FL511 camera ${channel}`,
    city: 'Pensacola',
    cityId: 'pensacola',
    provider: 'FL511',
    lat,
    lon,
    headingDeg: DIRECTIONS.get(direction) ?? fallbackHeadingFromId(id),
    headingConfidence: 'low',
    pitchDeg: -18,
    fovDeg: 44,
    rangeM: 145,
    mountHeightM: 8,
    groundElevationM: 5,
    feedType: 'image',
    url,
    snapshotUrl: url,
    sourceKind: 'fl511-open-data',
    license: 'FL511 (FDOT), individual non-commercial use only',
    code: channel,
  };
}

/**
 * Fetch the cameras of the Pensacola area from the keyless FL511 ArcGIS layer.
 * Every failure gives an empty list. FL511 limits its content to individual
 * non-commercial use; see DATA_SOURCES.md.
 *
 * @returns {Promise<Array<object>>} Camera source objects, nearest first.
 */
export async function loadPensacolaSourcesFromOpenData() {
  try {
    const endpoint = new URL(
      process.env.CCTV_PENSACOLA_ROWS_URL || DEFAULT_ROWS_URL,
    );
    endpoint.search = new URLSearchParams({
      where: '1=1',
      geometryType: 'esriGeometryEnvelope',
      inSR: '4326',
      outSR: '4326',
      spatialRel: 'esriSpatialRelIntersects',
      geometry: '-87.65,30.2,-86.8,30.85',
      returnGeometry: 'false',
      f: 'json',
      outFields: 'DESCRIPT,DIRECTION,LATITUDE,LONGITUDE,IMAGE',
      resultRecordCount: '200',
    }).toString();
    const resp = await fetch(endpoint.toString(), {
      headers: { Accept: 'application/json' },
      redirect: 'manual',
      signal: AbortSignal.timeout(CCTV_SOURCE_FETCH_TIMEOUT_MS),
    });
    const discard = async () => {
      try {
        await resp.body?.cancel();
      } catch {
        /* no-op */
      }
      return [];
    };
    if (resp.status >= 300 && resp.status < 400) {
      console.warn(
        '[CCTV] Pensacola layer redirected; redirects are not followed',
      );
      return discard();
    }
    if (!resp.ok) {
      console.warn('[CCTV] Pensacola camera download failed:', resp.status);
      return discard();
    }
    const payload = await readResponseJsonCapped(resp, MAX_BYTES);
    if (payload.error || !Array.isArray(payload.features)) {
      console.warn('[CCTV] Pensacola layer answered with an error.');
      return [];
    }
    const cameras = [];
    const seen = new Set();
    for (const feature of payload.features) {
      const camera = pensacolaCameraToSource(feature?.attributes);
      if (!camera || seen.has(camera.id)) continue;
      seen.add(camera.id);
      cameras.push(camera);
    }
    const maxRaw = Number(
      process.env.CCTV_PENSACOLA_MAX_SOURCES || DEFAULT_MAX_SOURCES,
    );
    const maxCount = Number.isFinite(maxRaw)
      ? Math.max(MIN_SOURCES, Math.min(MAX_SOURCES, Math.floor(maxRaw)))
      : DEFAULT_MAX_SOURCES;
    const prioritized = prioritizeSources(cameras, maxCount, [ANCHOR]);
    console.log(
      `[CCTV] Loaded Pensacola camera sources: ${cameras.length} (using nearest ${prioritized.length})`,
    );
    return prioritized;
  } catch (error) {
    console.warn(
      '[CCTV] Pensacola camera download error:',
      error?.message || error,
    );
    return [];
  }
}
