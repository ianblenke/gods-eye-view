/**
 * Pure adapter for an OpenSensorHub system list. Shared by the server
 * provider (server/providers/osh.js), which applies it before it caches a
 * page walk, and by the browser layer, which places each record with
 * placeOshEntities() below.
 *
 * `mapOshSystems()` reads a GeoJSON `FeatureCollection` (`features`) or a
 * plain list (`items`). It keeps a record for every entry with a string id,
 * and keeps the first record of a repeated id, because one walk can serve a
 * system twice. An entry with no Point geometry, or with a coordinate that
 * is not finite, keeps a record with `lon`, `lat` and `alt` null: a host
 * system with no geometry still needs its name for the detail of every
 * feature it hosts. Every other field is optional, so a missing property
 * becomes null instead of a thrown error.
 */

import { isOshObservationFresh } from './oshObservations.js';

function finiteNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function listOf(payload) {
  if (Array.isArray(payload?.features)) return payload.features;
  if (Array.isArray(payload?.items)) return payload.items;
  return null;
}

/** Read a Point geometry's coordinates as `{lon, lat, alt}`, all null when absent or not finite. */
function pointOf(geometry) {
  if (
    !geometry ||
    geometry.type !== 'Point' ||
    !Array.isArray(geometry.coordinates)
  )
    return { lon: null, lat: null, alt: null };
  const lon = finiteNumber(geometry.coordinates[0]);
  const lat = finiteNumber(geometry.coordinates[1]);
  if (lon === null || lat === null) return { lon: null, lat: null, alt: null };
  const alt =
    geometry.coordinates.length > 2
      ? finiteNumber(geometry.coordinates[2])
      : null;
  return { lon, lat, alt };
}

/**
 * Map a raw OpenSensorHub system list to trimmed records.
 * @param {*} payload - Upstream JSON body.
 * @returns {Array<{id:string, uid:?string, name:?string, description:?string, validTime:?Array, lon:?number, lat:?number, alt:?number}>}
 */
export function mapOshSystems(payload) {
  const list = listOf(payload);
  if (!list) return [];
  const records = [];
  const seen = new Set();
  for (const feature of list) {
    if (!feature || typeof feature !== 'object') continue;
    const id = typeof feature.id === 'string' && feature.id ? feature.id : null;
    if (!id || seen.has(id)) continue;
    seen.add(id);
    const { lon, lat, alt } = pointOf(feature.geometry);
    const properties =
      feature.properties && typeof feature.properties === 'object'
        ? feature.properties
        : {};
    records.push({
      id,
      uid: typeof properties.uid === 'string' ? properties.uid : null,
      name: typeof properties.name === 'string' ? properties.name : null,
      description:
        typeof properties.description === 'string'
          ? properties.description
          : null,
      validTime: Array.isArray(properties.validTime)
        ? properties.validTime
        : null,
      lon,
      lat,
      alt,
    });
  }
  return records;
}

/** True when `a` is a valid time later than `b`, or `b` is absent or unparseable. */
function isNewer(a, b) {
  const at = typeof a === 'string' ? Date.parse(a) : NaN;
  if (!Number.isFinite(at)) return false;
  const bt = typeof b === 'string' ? Date.parse(b) : NaN;
  return !Number.isFinite(bt) || at > bt;
}

/** Build a placed-system record for a system a fresh stream location names, with or without a held record. */
function placedFromStream(systemId, system, location) {
  return {
    id: systemId,
    uid: system ? system.uid : null,
    name: system ? system.name : null,
    description: system ? system.description : null,
    validTime: system ? system.validTime : null,
    lon: location.lon,
    lat: location.lat,
    alt: location.alt,
    locationSource: 'stream',
    datastreamId: location.datastreamId,
    datastreamName: location.datastreamName,
    phenomenonTime: location.phenomenonTime,
    ageMs: location.ageMs,
    // The location pass's own name for this system (design decision D48),
    // kept beside `name` rather than in it: `name` stays null with no held
    // record, per this scenario's own rule, and the layer decides whether
    // to fall back to this field when it builds a placeholder (osh-057).
    streamSystemName: location.systemName ?? null,
  };
}

/** Build a placed-feature record for an unheld feature a fresh location names. */
function drawnFromStream(key, location) {
  return {
    id: key,
    uid: location.foiUid ?? null,
    systemId: location.systemId ?? null,
    name: null,
    description: null,
    validTime: null,
    lon: location.lon,
    lat: location.lat,
    alt: location.alt,
    locationSource: 'stream',
    datastreamId: location.datastreamId,
    datastreamName: location.datastreamName,
    phenomenonTime: location.phenomenonTime,
    ageMs: location.ageMs,
  };
}

/**
 * Merge the system records, the feature-of-interest records and the
 * location-pass records into the entities the layer places, with no
 * cross-placement: a feature never places its host system, and a system
 * never places a feature. A location counts only when its `ageMs` is fresh
 * under isOshObservationFresh() (design decisions D44 and D48); a stale
 * one is dropped before any other rule. A fresh location that names a
 * feature, by id or by uid, moves that feature and does not place a
 * system. It draws that feature when the layer holds no such feature. A
 * fresh location with no feature reference places its system above a
 * `Point`; the newer of two such locations for one system wins.
 * @param {{systems: Array, fois: Array, locations: Array}} lists
 * @returns {{systems: Array, features: Array, unplaced: Array}}
 */
export function placeOshEntities({
  systems = [],
  fois = [],
  locations = [],
} = {}) {
  const featureById = new Map(fois.map((foi) => [foi.id, foi]));
  const featureByUid = new Map();
  for (const foi of fois) if (foi.uid) featureByUid.set(foi.uid, foi);

  const fresh = locations.filter((location) =>
    isOshObservationFresh(location?.ageMs),
  );

  const featureOverrides = new Map();
  const unheldFeatures = new Map();
  const systemLocations = [];
  for (const location of fresh) {
    const referencesFeature = Boolean(location.foiId || location.foiUid);
    if (referencesFeature) {
      const feature =
        featureById.get(location.foiId) ?? featureByUid.get(location.foiUid);
      if (feature) {
        const existing = featureOverrides.get(feature.id);
        if (
          !existing ||
          isNewer(location.phenomenonTime, existing.phenomenonTime)
        ) {
          featureOverrides.set(feature.id, location);
        }
      } else {
        const key = location.foiId || location.foiUid;
        const existing = unheldFeatures.get(key);
        if (
          !existing ||
          isNewer(location.phenomenonTime, existing.phenomenonTime)
        ) {
          unheldFeatures.set(key, location);
        }
      }
      continue;
    }
    if (!location.systemId) continue;
    const existing = systemLocations.find(
      (entry) => entry.systemId === location.systemId,
    );
    if (!existing) {
      systemLocations.push(location);
    } else if (isNewer(location.phenomenonTime, existing.phenomenonTime)) {
      systemLocations[systemLocations.indexOf(existing)] = location;
    }
  }

  const bestSystemLocation = new Map(
    systemLocations.map((location) => [location.systemId, location]),
  );

  const placedSystems = [];
  const unplaced = [];
  const seenIds = new Set();
  for (const system of systems) {
    seenIds.add(system.id);
    const streamLocation = bestSystemLocation.get(system.id);
    if (streamLocation) {
      placedSystems.push(placedFromStream(system.id, system, streamLocation));
      continue;
    }
    if (system.lon === null || system.lat === null) {
      unplaced.push(system.id);
      continue;
    }
    placedSystems.push({ ...system, locationSource: 'geometry' });
  }
  for (const [systemId, location] of bestSystemLocation) {
    if (seenIds.has(systemId)) continue;
    placedSystems.push(placedFromStream(systemId, null, location));
  }

  const features = fois.map((foi) => {
    const override = featureOverrides.get(foi.id);
    if (!override) return { ...foi };
    return {
      ...foi,
      lon: override.lon,
      lat: override.lat,
      alt: override.alt,
      locationSource: 'stream',
      datastreamId: override.datastreamId,
      datastreamName: override.datastreamName,
      phenomenonTime: override.phenomenonTime,
      ageMs: override.ageMs,
    };
  });
  for (const [key, location] of unheldFeatures) {
    features.push(drawnFromStream(key, location));
  }

  return { systems: placedSystems, features, unplaced };
}
